struct Ray
{
	vec3 ori;
	vec3 dir;
};

struct Material {
    vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
}; 

struct DirLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

struct PointLight {
    vec3 position;
    float constant;
    float linear;
    float quadratic;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};