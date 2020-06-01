#version 410

#define EPSILON 0.01
#define MAX_MARCHING_STEPS 1000
#define MAX_DISTANCE 1000

out vec4 FragColor;

in vec2 texCoords;
in vec3 rayDir;

uniform vec3 cameraPos;
            
struct Ray
{
	vec3 ori;
	vec3 dir;
};

float sdSphere(vec3 pos, vec3 center, float radius)
{
    return length(pos - center) - radius;
}

float map(vec3 pos) {
    return sdSphere(pos, vec3(0.0f), 1.0f);
}

Ray generateRay(vec3 ori,vec3 dir)
{
	Ray ray;
	ray.ori = ori;
	ray.dir = dir;
	return ray;
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
	vec3 result = vec3(0.0f);
    Ray ray = generateRay(cameraPos, normalize(rayDir));
	vec3 hitPosition;
	bool hit = rayMarch(ray, hitPosition);
	if (hit) {
        result = vec3(1.0f);
    }
	//FragColor = vec4(rayDir.x, rayDir.y, rayDir.z, 1);
	//FragColor = vec4(cameraPos.x / 10.0f, cameraPos.y / 10.0f, cameraPos.z / 10.0f, 1.0f);
	FragColor = vec4(result, 1.0f);
}