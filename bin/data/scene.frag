ObjectData scene0(vec3 pos){
	float c = cos(elapsedTime);
	float s = sin(elapsedTime);
	mat4 m1 = mat4(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	mat4 m2 = mat4(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
	vec3 q = opTransform(pos, m1 * m2);

	ObjectData cube0 = ObjectData(sdCube(q, vec3(0.0f, 0.0f, 0.0f), vec3(1.0f, 1.0f, 1.0f)), materials[2]);
	ObjectData sphere0 = ObjectData(sdSphere(q, vec3(0.0f, 0.0f, 0.0f), 1.4f), materials[2]);
	ObjectData sphere1 = ObjectData(sdSphere(q, vec3(0.0f, -1.2f, 0.0f), 0.4f), materials[1]);
	ObjectData sphere2 = ObjectData(sdSphere(q, vec3(-1.1f, 0.4f, -0.4f), 0.2f), materials[0]);
	ObjectData sphere3 = ObjectData(sdSphere(q, vec3(-1.1f, -0.4f, 0.4f), 0.2f), materials[0]);
	ObjectData sphere4 = ObjectData(sdSphere(q, vec3(-0.4f, -0.4f, -1.1f), 0.2f), materials[0]);
	ObjectData sphere5 = ObjectData(sdSphere(q, vec3(0.0f, 0.0f, -1.1f), 0.2f), materials[0]);
	ObjectData sphere6 = ObjectData(sdSphere(q, vec3(0.4f, 0.4f, -1.1f), 0.2f), materials[0]);
	ObjectData sphere7 = ObjectData(sdSphere(q, vec3(0.4f, -0.4f, 1.1f), 0.2f), materials[1]);
	ObjectData sphere8 = ObjectData(sdSphere(q, vec3(-0.4f, -0.4f, 1.1f), 0.2f), materials[1]);
	ObjectData sphere9 = ObjectData(sdSphere(q, vec3(-0.4f, 0.4f, 1.1f), 0.2f), materials[1]);
	ObjectData sphere10 = ObjectData(sdSphere(q, vec3(0.4f, 0.4f, 1.1f), 0.2f), materials[1]);
	ObjectData sphere11 = ObjectData(sdSphere(q, vec3(1.1f, -0.4f, 0.4f), 0.2f), materials[0]);
	ObjectData sphere12 = ObjectData(sdSphere(q, vec3(1.1f, 0.4f, 0.4f), 0.2f), materials[0]);
	ObjectData sphere13 = ObjectData(sdSphere(q, vec3(1.1f, 0.4f, -0.4f), 0.2f), materials[0]);
	ObjectData sphere14 = ObjectData(sdSphere(q, vec3(1.1f, -0.4f, -0.4f), 0.2f), materials[0]);
	ObjectData sphere15 = ObjectData(sdSphere(q, vec3(1.1f, 0.0f, 0.0f), 0.2f), materials[0]);
	ObjectData sphere16 = ObjectData(sdSphere(q, vec3(0.6f, 1.1f, 0.4f), 0.2f), materials[0]);
	ObjectData sphere17 = ObjectData(sdSphere(q, vec3(-0.6f, 1.1f, 0.4f), 0.2f), materials[0]);
	ObjectData sphere18 = ObjectData(sdSphere(q, vec3(-0.6f, 1.1f, -0.4f), 0.2f), materials[0]);
	ObjectData sphere19 = ObjectData(sdSphere(q, vec3(0.6f, 1.1f, -0.4f), 0.2f), materials[0]);
	ObjectData sphere20 = ObjectData(sdSphere(q, vec3(0.0f, 1.1f, 0.4f), 0.2f), materials[0]);
	ObjectData sphere21 = ObjectData(sdSphere(q, vec3(0.0f, 1.1f, -0.4f), 0.2f), materials[0]);
	
	ObjectData face1 = sphere1;
	ObjectData face2 = opUnion(sphere2, sphere3);
	ObjectData face3 = opUnion(opUnion(sphere4, sphere5), sphere6);
	ObjectData face4 = opUnion(opUnion(opUnion(sphere7, sphere8), sphere9), sphere10);
	ObjectData face5 = opUnion(opUnion(opUnion(opUnion(sphere11, sphere12), sphere13), sphere14), sphere15);
	ObjectData face6 = opUnion(opUnion(opUnion(opUnion(opUnion(sphere16, sphere17), sphere18), sphere19), sphere20), sphere21);
	ObjectData dots = opUnion(opUnion(opUnion(opUnion(opUnion(face1, face2), face3), face4), face5), face6);
	ObjectData body = opSmoothIntersection(cube0, sphere0, 0.015f);
	ObjectData dice = opSmoothSubtraction(dots, body, 0.01f);
    ObjectData plane = ObjectData(sdPlane(pos, vec3(0.0f, -2.0f, 0.0f), vec3(0.0f, 1.0f, 0.0f), 1.0f), materials[3]);
    return opUnion(dice, plane);
}

ObjectData scene1(vec3 pos){
	ObjectData sphere0 = ObjectData(sdSphere(pos, vec3(0.0f, 0.0f, 0.0f), 1.0f), materials[0]);

    // float sphereDis = 0.8f;
    // float sphereR = 0.55f;
    // float smoothR = 0.2;

    float sphereDis = 0.5f;
    float sphereR = 0.65f;
    float smoothR = 0.1;

    ObjectData sphere1 = ObjectData(sdSphere(pos, vec3(sphereDis, 0.0f, 0.0f), sphereR),  materials[1]);
    ObjectData sphere2 = ObjectData(sdSphere(pos, vec3(0.0f, sphereDis, 0.0f), sphereR),  materials[1]);
    ObjectData sphere3 = ObjectData(sdSphere(pos, vec3(0.0f, 0.0f, sphereDis), sphereR),  materials[1]);
    ObjectData sphere4 = ObjectData(sdSphere(pos, vec3(-sphereDis, 0.0f, 0.0f), sphereR), materials[1]);
    ObjectData sphere5 = ObjectData(sdSphere(pos, vec3(0.0f, -sphereDis, 0.0f), sphereR), materials[1]);
    ObjectData sphere6 = ObjectData(sdSphere(pos, vec3(0.0f, 0.0f, -sphereDis), sphereR), materials[1]);

    ObjectData temp = opSmoothSubtraction(sphere1, sphere0, smoothR);
    temp = opSmoothSubtraction(sphere2, temp, smoothR);
    temp = opSmoothSubtraction(sphere3, temp, smoothR);
    temp = opSmoothSubtraction(sphere4, temp, smoothR);
    temp = opSmoothSubtraction(sphere5, temp, smoothR);
    temp = opSmoothSubtraction(sphere6, temp, smoothR);

    return temp;
}

ObjectData scene2(vec3 pos){
	float c = cos(elapsedTime);
	float s = sin(elapsedTime);
	mat4 trans = mat4(c, s, 0, 0, -s, c, 0, 0, 0,0,1,0 ,0,0,0,1);

	trans = trans * mat4(1,0 ,0,0,0,c, -s, 0,0,s,c,0,0,0,0,1);
    ObjectData jelly = ObjectData(sdRoundCube(opBend(pos - vec3(3, 0, 0), deformStrength * s), vec3(3, 0, 3), vec3(2, 1, 1), 0.5), materials[0]);
	
    ObjectData plane = ObjectData(sdPlane(pos, vec3(0.0f, -2.0f, 0.0f), vec3(0.0f, 1.0f, 0.0f), 1.0f), materials[0]);

	ObjectData cross3d = opRound(
		ObjectData(
			opExtrusion(
				pos - vec3(-5, 0, 0), 
				sd2DCross(
					(pos - vec3(-5, 0, 0)).xy,
					vec2(1.0, 0.25),
					0.2), 
				5 * deformStrength * s + 5 * deformStrength),
			materials[0]),
		deformStrength * 0.1);

	ObjectData cylinder = ObjectData(sdCylinder(opTransform(pos, trans), vec3(0,0,0), 0.5, 2.0), materials[0]);

	return opSmoothUnion(opUnion(opUnion(jelly, cylinder), cross3d), plane, smoothness);
}

ObjectData scene3(vec3 pos){
    return ObjectData(sdSphere(pos, vec3(0.0f, 1.5f + 3.0 * sin(elapsedTime), 0.0f), 1.5f), materials[1]);
}