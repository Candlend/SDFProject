#version 410

#define EPSILON 0.0001
#define MAX_MARCHING_STEPS 1000
#define MAX_DISTANCE 100
#define NR_POINT_LIGHTS 3
#define NR_MATERIALS 4
#define BOUNCE_ARRAY_MAX 32

#pragma include "struct.frag"
#pragma include "sdPrimitive.frag"
#pragma include "sdOperation.frag"

out vec4 FragColor;

in vec2 texCoords;
in vec3 rayDir;

uniform int sceneIndex;
uniform float elapsedTime;
uniform float stepScale;
uniform float deformStrength;
uniform float smoothness;

uniform float shadowPenumbra;
uniform bool useSoftShadow;
uniform bool shadowImprovement;


uniform float aoStepSize;
uniform int aoIterations;
uniform float aoIntensity;

uniform vec3 cameraPos;
uniform Material materials[NR_MATERIALS];
uniform DirLight dirLight;
uniform PointLight pointLights[NR_POINT_LIGHTS];

uniform samplerCube envMap;
uniform int bounceTime;

BounceData[BOUNCE_ARRAY_MAX] rayArray;
int rayCount;

#pragma include "scene.frag"
ObjectData map(vec3 pos) {
    switch(sceneIndex)
    {
        case 0: return scene0(pos);
        case 1: return scene1(pos);
        case 2: return scene2(pos);
        case 3: return scene3(pos);
		case 4: return scene4(pos);
    }
}

Ray generateRay(vec3 ori,vec3 dir)
{
	Ray ray;
	ray.ori = ori;
	ray.dir = dir;
	return ray;
}

vec3 calcNormal(vec3 p)
{
    const float h = 0.0001;
    const vec2 k = vec2(1,-1);
    return normalize( k.xyy * map(p + k.xyy * h).d + 
                      k.yyx * map(p + k.yyx * h).d + 
                      k.yxy * map(p + k.yxy * h).d + 
                      k.xxx * map(p + k.xxx * h).d);
}

float calcAO(vec3 pos, vec3 normal)
{
    float ao = 0.0f;
    float d = 0.001f;
    for(int i = 0; i<= aoIterations; i++){
        d += aoStepSize;
        ao += max(0.0f, (d - map(pos + d * normal).d) / d);
    }
    return clamp(1.0f - ao * aoIntensity, 0.0, 1.0);
}


float hardShadow(Ray ray, float tMin, float tMax)
{
    float result = 1.0f;
    float t = tMin;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        if (t > tMax) break;
        float h = map(ray.ori + t * ray.dir).d;
        if (abs(h) < EPSILON) {
            return 0.0f;
        }
        t += h * stepScale;
    }
    return result;
}

float softShadow(Ray ray, float tMin, float tMax, float k){
    float result = 1.0f;
    float ph = 1e20;
    float t = tMin;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        if (t > tMax) break;
        float h = map(ray.ori + t * ray.dir).d;
        if (abs(h) < EPSILON) {
            return 0.0f;
        }
		if (shadowImprovement){
			float y = h * h / (2.0 * ph);
			float d = sqrt(h * h - y * y);
			result = min(result, k * d / max(0.0, t - y));		
			ph = h;
			t += h;
		}
		else {
			result = min(result, k * h / t);
			t += h * stepScale;
		}
    }
    return result;
}

vec3 calcDirLight(vec3 p, Material mat, DirLight light, vec3 normal, vec3 viewDir)
{
	if (!light.enabled){
		return vec3(0);
	}
	vec3 L = -normalize(light.direction);
	vec3 R = normalize(-reflect(L, normal));
    vec3 ambient = mat.ambient * light.color;
    vec3 diffuse = mat.diffuse * light.color * max(dot(normal, L), 0.0);
	vec3 specular = vec3(0);
	if (dot(normal, L) > 0) {
		specular = mat.specular * light.color * pow(max(dot(R, viewDir), 0.0), mat.shininess);
	}
    Ray shadowRay = generateRay(p + 0.01 * normal, L);
    float shadow;
	if (useSoftShadow){
		shadow = softShadow(shadowRay, 0.0, MAX_DISTANCE, shadowPenumbra);
	}
	else {
		shadow = hardShadow(shadowRay, 0.0, MAX_DISTANCE);
	}
	float ao = calcAO(p, normal);
    return ambient * ao + (diffuse + specular) * shadow;
}

vec3 calcPointLight(vec3 p, Material mat, PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
	if (!light.enabled){
		return vec3(0);
	}
	vec3 path = light.position - fragPos;
	vec3 L = normalize(path);
	vec3 R = normalize(-reflect(L, normal));
    vec3 ambient = mat.ambient * light.color;
    vec3 diffuse = mat.diffuse * light.color * max(dot(normal, L), 0.0);
	vec3 specular = vec3(0);
	if (dot(normal, L) > 0) {
		specular = mat.specular * light.color * pow(max(dot(R, viewDir), 0.0), mat.shininess);
	}
	float constant = 1.0f;
	float linear = 0.09;
	float quadratic = 0.032;
	float distance = length(light.position - fragPos);
	float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));
	ambient  *= attenuation; 
	diffuse  *= attenuation;
	specular *= attenuation;
    Ray shadowRay = generateRay(p + 0.01 * normal, L);
    float shadow;
	if (useSoftShadow){
		shadow = softShadow(shadowRay, 0.0, distance, shadowPenumbra);
	}
	else {
		shadow = hardShadow(shadowRay, 0.0, distance);
	}
	float ao = calcAO(p, normal);
    return ambient * ao + (diffuse + specular) * shadow;
}

bool rayMarch(Ray ray, out vec3 p, out Material material){
    float t = 0.0f;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        if (t > MAX_DISTANCE) return false;
        p = ray.ori + t * ray.dir;
        ObjectData od;
        od = map(p);
        float d = od.d;
        material = od.mat;
        if (abs(d) < EPSILON) {
            return true;
        }
        t += abs(d) * stepScale;
    }
    return false;
}

vec3 shade(vec3 hitPosition, vec3 normal, vec3 viewDir, Material material) {
	vec3 result = calcDirLight(hitPosition, material, dirLight, normal, viewDir);
	for (int i = 0; i < NR_POINT_LIGHTS; i++) {
		result += calcPointLight(hitPosition, material, pointLights[i], normal, hitPosition, viewDir);
	}
    return result;
}

float schlick(vec3 I, vec3 N, float R1, float R2)
{
	float tmp = ((R1 - R2) / (R1 + R2)) * ((R1 - R2) / (R1 + R2)) ;
	tmp = tmp + (1.0 - tmp) * pow(1.0 - max(dot(I, N), 0.0), 2.0);
	return tmp;
}

vec3 bounce(BounceData bd, out float intensity){
	intensity = 1.0f;
	Ray ray = bd.ray;
	vec3 hitPosition;
	Material material;
	bool hit = rayMarch(ray, hitPosition,  material);
	float R = 1.0;
	vec3 res;
	if (hit) {
		vec3 normal = calcNormal(hitPosition);
		vec3 viewDir = normalize(ray.ori - hitPosition);
		if(map(hitPosition).d > 0){
			res = shade(hitPosition, normal, viewDir, material);
		}
		else{
			res = shade(hitPosition, -normal, viewDir, material);
		}

		if(material.refractIntensity > 0)
		{
			vec3 refract_dir;
			if(map(hitPosition).d > 0)
			{
				refract_dir = refract(ray.dir, normal, material.refractRatio);
				R = schlick(viewDir, normal, 1.0, material.refractRatio);
				rayArray[rayCount].ray = generateRay(hitPosition - 0.01 * normal, refract_dir);
				rayArray[rayCount].intensity = (1.0 - R) * bd.intensity * material.refractIntensity;
				rayCount += 1;
			}
			else 
			{
				refract_dir = refract(ray.dir, -normal, 1.0 / material.refractRatio);
				R = schlick(viewDir, -normal, material.refractRatio, 1.0);
				if (refract_dir != vec3(0.0)) {
					rayArray[rayCount].ray = generateRay(hitPosition + 0.01 * normal, refract_dir);
					rayArray[rayCount].intensity = (1.0 - R) * bd.intensity * material.refractIntensity;
					rayCount += 1;
				}
				else {
					R = 1.0;
				}
			}
			intensity -= (1.0 - R) * rayArray[rayCount - 1].intensity;
		}
		if(material.reflectIntensity > 0)
		{
			vec3 reflect_dir = reflect(ray.dir, normal);
			rayArray[rayCount].ray = generateRay(hitPosition + 0.01 * normal, reflect_dir);
			rayArray[rayCount].intensity = R * bd.intensity * material.reflectIntensity;
			rayCount += 1;
			intensity -= R * rayArray[rayCount - 1].intensity;
		}
	}
	else {
		res = texture(envMap, ray.dir).xyz;
	}
	intensity *= bd.intensity;
	return res;
}

void main()
{
    rayArray[0].ray = generateRay(cameraPos, normalize(rayDir));
	rayArray[0].intensity = 1.0f;
	rayCount = 1;
    vec3 res;
	for (int i = 0; i < bounceTime; i++) {
		int tmpRayCount = rayCount;
		BounceData[BOUNCE_ARRAY_MAX] tmpRayArray = rayArray;
		rayCount = 0;
		for (int j = 0; j < tmpRayCount; j++) {
			float intensity;
			vec3 bounce_res = bounce(tmpRayArray[j], intensity);
			res += intensity * bounce_res;
		}
		if (rayCount == 0) {
			break;
		}
	}
	FragColor = vec4(res, 1);
}