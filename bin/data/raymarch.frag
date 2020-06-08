#version 410

#define EPSILON 0.0001
#define MAX_MARCHING_STEPS 1000
#define MAX_DISTANCE 1000
#define NR_POINT_LIGHTS 3
#define NR_MATERIALS 3

#pragma include "struct.frag"
#pragma include "sdPrimitive.frag"
#pragma include "sdOperation.frag"

out vec4 FragColor;

in vec2 texCoords;
in vec3 rayDir;

uniform float aoStepSize;
uniform int aoIterations;
uniform int sceneIndex;
uniform float aoIntensity;

uniform float stepScale;
uniform float smoothness;
uniform float deformStrength;
uniform float elapsedTime;
uniform vec3 cameraPos;
uniform Material materials[NR_MATERIALS];
uniform DirLight dirLight;
uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform float shadowPenumbra;

#pragma include "scene.frag"
ObjectData map(vec3 pos) {
	if (sceneIndex == 0){
		return scene0(pos);
	}
	else if (sceneIndex == 1) {
		return scene1(pos);
	}
	else if (sceneIndex == 2) {
		return scene2(pos);
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


float shadow(Ray ray, float tMin, float tMax)
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
        float y = h * h / (2.0 * ph);
        float d = sqrt(h * h - y * y);
        result = min(result, k * d / max(0.0, t - y));
        ph = h;
        t += h * stepScale;
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
    float shadow = softShadow(shadowRay, 0.0, MAX_DISTANCE, shadowPenumbra);
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
    float shadow = softShadow(shadowRay, 0.0, distance, shadowPenumbra);
	float ao = calcAO(p, normal);
    return ambient * ao + (diffuse + specular) * shadow;
}


vec3 shade(vec3 hitPosition, vec3 normal, vec3 viewDir, Material material) {
	vec3 result = calcDirLight(hitPosition, material, dirLight, normal, viewDir);
	for (int i = 0; i < NR_POINT_LIGHTS; i++) {
		result += calcPointLight(hitPosition, material, pointLights[i], normal, hitPosition, viewDir);
	}
    return result;
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
        t += d * stepScale;
    }
    return false;
}

void main()
{
    Ray ray = generateRay(cameraPos, normalize(rayDir));
	vec3 hitPosition;
    Material material;
	bool hit = rayMarch(ray, hitPosition,  material);
	if (hit) {
		vec3 normal = calcNormal(hitPosition);
		vec3 viewDir = normalize(cameraPos - hitPosition);
        FragColor = vec4(shade(hitPosition, normal, viewDir, material), 1);
    }
	else{
		FragColor = vec4(0.0f);
	}
}