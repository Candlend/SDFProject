#version 410

#define EPSILON 0.001
#define MAX_MARCHING_STEPS 1000
#define MAX_DISTANCE 1000
#define NR_POINT_LIGHTS 1

#pragma include "struct.frag"
#pragma include "sdPrimitive.frag"
#pragma include "sdOperation.frag"
#pragma include "shade.frag"

out vec4 FragColor;

in vec2 texCoords;
in vec3 rayDir;

uniform vec3 cameraPos;
uniform Material mat;
uniform DirLight dirLight;
uniform PointLight pointLights[NR_POINT_LIGHTS];

float map(vec3 pos) {
	float sphere1 = sdSphere(pos, vec3(0.0f, 0.0f, 0.0f), 1.0f);
	float sphere2 = sdSphere(pos, vec3(0.0f, 1.5f, 0.0f), 1.5f);
    return opSmoothUnion(sphere1, sphere2, 0.5);
}

vec3 shade(vec3 hitPosition, vec3 normal, vec3 viewDir) {
	vec3 result = calcDirLight(mat, dirLight, normal, viewDir);
	for (int i = 0; i < NR_POINT_LIGHTS; i++) {
		result += calcPointLight(mat, pointLights[i], normal, hitPosition, viewDir);
	}
    return result;
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
    return normalize( k.xyy * map(p + k.xyy * h) + 
                      k.yyx * map(p + k.yyx * h) + 
                      k.yxy * map(p + k.yxy * h) + 
                      k.xxx * map(p + k.xxx * h));
}

bool rayMarch(Ray ray, out vec3 p){
    float t = 0.0f;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        if (t > MAX_DISTANCE) return false;
        p = ray.ori + t * ray.dir;
        float d = map(p);
        if (abs(d) < EPSILON) {
            return true;
        }
        t += d;
    }
    return false;
}

void main()
{
    Ray ray = generateRay(cameraPos, normalize(rayDir));
	vec3 hitPosition;
	bool hit = rayMarch(ray, hitPosition);
	if (hit) {
		vec3 normal = calcNormal(hitPosition);
		vec3 viewDir = normalize(cameraPos - hitPosition);
        FragColor = vec4(shade(hitPosition, normal, viewDir), 1);
    }
	else{
		FragColor = vec4(0.0f);
	}
}