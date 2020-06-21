ObjectData opUnion(ObjectData d1, ObjectData d2)
{
	if (d1.d < d2.d)
	{
		return d1;
	}
	else
	{
		return d2;
	}
}

ObjectData opSubtraction(ObjectData d1, ObjectData d2)
{
	ObjectData d;
	d.d = max(-d1.d, d2.d);
	if (-d1.d > d2.d)
	{
		d.mat = d1.mat;
	}
	else
	{
		d.mat = d2.mat;
	}
	return d;
}

ObjectData opIntersection(ObjectData d1, ObjectData d2)
{
	if (d1.d > d2.d)
	{
		return d1;
	}
	else
	{
		return d2;
	}
}

ObjectData opSmoothUnion(ObjectData d1, ObjectData d2, float k)
{
	Material newMat;
	ObjectData newObjData;
    float h = clamp(0.5 + 0.5 * (d2.d - d1.d) / k, 0.0, 1.0);

	newMat.ambient = mix(d2.mat.ambient, d1.mat.ambient, h);
	newMat.diffuse = mix(d2.mat.diffuse, d1.mat.diffuse, h);
	newMat.specular = mix(d2.mat.specular, d1.mat.specular, h);
	newMat.shininess = mix(d2.mat.shininess, d1.mat.shininess, h);
	newMat.reflectIntensity = mix(d2.mat.reflectIntensity, d1.mat.reflectIntensity, h);
	newMat.refractRaito = mix(d2.mat.refractRaito, d1.mat.refractRaito, h);
	newMat.reflectIntensity = mix(d2.mat.refractIntensity, d1.mat.refractIntensity, h);

	newObjData.d = mix(d2.d, d1.d, h) - k * h * (1.0 - h);
	newObjData.mat = newMat;
    return newObjData;
}

ObjectData opSmoothSubtraction( ObjectData d1, ObjectData d2, float k ) 
{
	Material newMat;
	ObjectData newObjData;
    float h = clamp( 0.5 - 0.5*(d2.d + d1.d )/k, 0.0, 1.0 );

	newMat.ambient = mix(d2.mat.ambient, d1.mat.ambient, h);
	newMat.diffuse = mix(d2.mat.diffuse, d1.mat.diffuse, h);
	newMat.specular = mix(d2.mat.specular, d1.mat.specular, h);
	newMat.shininess = mix(d2.mat.shininess, d1.mat.shininess, h);
	newMat.reflectIntensity = mix(d2.mat.reflectIntensity, d1.mat.reflectIntensity, h);
	newMat.refractRaito = mix(d2.mat.refractRaito, d1.mat.refractRaito, h);
	newMat.reflectIntensity = mix(d2.mat.refractIntensity, d1.mat.refractIntensity, h);

	newObjData.d = mix(d2.d, -d1.d, h) + k * h * (1.0 - h);
	newObjData.mat = newMat;
    return newObjData;

}

ObjectData opSmoothIntersection( ObjectData d1, ObjectData d2, float k ) 
{
	Material newMat;
	ObjectData newObjData;
    float h = clamp( 0.5 - 0.5*(d2.d-d1.d)/k, 0.0, 1.0 );

	newMat.ambient = mix(d2.mat.ambient, d1.mat.ambient, h);
	newMat.diffuse = mix(d2.mat.diffuse, d1.mat.diffuse, h);
	newMat.specular = mix(d2.mat.specular, d1.mat.specular, h);
	newMat.shininess = mix(d2.mat.shininess, d1.mat.shininess, h);
	newMat.reflectIntensity = mix(d2.mat.reflectIntensity, d1.mat.reflectIntensity, h);
	newMat.refractRaito = mix(d2.mat.refractRaito, d1.mat.refractRaito, h);
	newMat.reflectIntensity = mix(d2.mat.refractIntensity, d1.mat.refractIntensity, h);

	newObjData.d = mix(d2.d, d1.d, h) + k * h * (1.0 - h);
	newObjData.mat = newMat;
    return newObjData;
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

ObjectData opRound(ObjectData primitive, float rad)
{
	return ObjectData(primitive.d - rad, primitive.mat);;
}

ObjectData opExtrusion(vec3 p, ObjectData primitive, float h)
{
	vec2 w = vec2(primitive.d, abs(p.z)-h);
	return ObjectData(min(max(w.x,w.y), 0.0) + length(max(w, 0.0)), primitive.mat);
}
