vec3 calcDirLight(Material mat, DirLight light, vec3 normal, vec3 viewDir)
{
	vec3 L = normalize(light.direction);
	vec3 R = normalize(-reflect(L, normal));
    vec3 ambient = mat.ambient * light.ambient;
    vec3 diffuse = mat.diffuse * light.diffuse * max(dot(normal, L), 0.0);
	vec3 specular = vec3(0);
	if (dot(normal, L) > 0) {
		specular = mat.specular * light.specular * pow(max(dot(R, viewDir), 0.0), mat.shininess);
	}
    return (ambient + diffuse + specular);
}

vec3 calcPointLight(Material mat, PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
	vec3 path = vec3(vec4(light.position, 1) - vec4(fragPos, 1));
	vec3 L = normalize(path);
	vec3 R = normalize(-reflect(L, normal));
    vec3 ambient = mat.ambient * light.ambient;
    vec3 diffuse = mat.diffuse * light.diffuse * max(dot(normal, L), 0.0);
	vec3 specular = vec3(0);
	if (dot(normal, L) > 0) {
		specular = mat.specular * light.specular * pow(max(dot(R, viewDir), 0.0), mat.shininess);
	}

	float distance = length(vec4(light.position, 1) - vec4(fragPos, 1));
	float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
	ambient  *= attenuation; 
	diffuse  *= attenuation;
	specular *= attenuation;

    return (ambient + diffuse + specular);
}