float opUnion(float d1, float d2)
{
	return min(d1, d2); 
}

float opSubtraction(float d1, float d2)
{
	return max(-d1, d2); 
}

float opIntersection(float d1, float d2)
{
	return max(d1, d2); 
}

float opSmoothUnion(float d1, float d2, float k)
{
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

vec3 opBend(vec3 p, float strength)
{
	float c = cos(strength * p.x);
	float s = sin(strength * p.x);
	mat2 m = mat2(c, s, -s, c);
	vec3 q = vec3(m*p.xy, p.z);
	return q;
}

vec3 opTwist(vec3 p, float strength)
{
	float c = cos(strength * p.y);
	float s = sin(strength * p.y);
	mat2 m = mat2(c, -s, s, c);
	vec3 q = vec3(m*p.xy, p.z);
	return q;
}

vec3 opTransform(vec3 p, mat4 trans)
{
	vec4 tmp = (inverse(trans) * vec4(p, 1));
	return tmp.xyz;
}

float opRound(float primitive, float rad)
{
	return primitive - rad;
}

float opExtrusion(vec3 p, float primitive, float h)
{
	vec2 w = vec2(primitive, abs(p.z-h));
	return min(max(w.x,w.y), 0.0) + length(max(w, 0.0));
}
