ObjectData scene0(vec3 pos){
	ObjectData sphere1 = ObjectData(sdSphere(pos, vec3(0.0f, 0.0f, 0.0f), 1.0f), materials[0]);
	ObjectData sphere2 = ObjectData(sdSphere(pos, vec3(0.0f, 1.5f + 3.0 * sin(elapsedTime), 0.0f), 1.5f), materials[1]);
	ObjectData sphere3 = ObjectData(sdSphere(pos, vec3(0.0f, 1.5f, 1.0f), 1.0f), materials[1]);
    ObjectData plane = ObjectData(sdPlane(pos, vec3(0.0f, -1.0f, 0.0f), vec3(0.0f, 1.0f, 0.0f), 1.0f), materials[0]);
    return opUnion(sphere1, plane);
}

ObjectData scene1(vec3 pos){
    ObjectData sphere1 = ObjectData(sdSphere(pos, vec3(0.0f, 0.0f, 0.0f), 1.0f), materials[0]);
    ObjectData sphere2 = ObjectData(sdSphere(pos, vec3(0.0f, 1.5f + sin(elapsedTime), 0.0f), 1.5f), materials[1]);
    return opSmoothIntersection(sphere2, sphere1, 0.2);
}

ObjectData scene2(vec3 pos){
    return ObjectData(sdSphere(pos, vec3(0.0f, 1.5f + 3.0 * sin(elapsedTime), 0.0f), 1.5f), materials[1]);
}