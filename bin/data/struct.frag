struct Ray
{
	vec3 ori;
	vec3 dir;
};

struct BounceData
{
	Ray ray;
	float intensity;
};

struct Material {
    vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
	float reflectIntensity;
	float refractRatio;
	float refractIntensity;
}; 

struct ObjectData {
    float d;
    Material mat;
}; 

struct DirLight {
	bool enabled;
    vec3 direction;
    vec3 color;
};

struct PointLight {
	bool enabled;
    vec3 position;
    vec3 color;
};