ObjectData scene0(vec3 pos){
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

ObjectData scene1(vec3 pos){
    ObjectData sphere1 = ObjectData(sdSphere(pos, vec3(0.0f, 0.0f, 0.0f), 1.0f), materials[0]);
    ObjectData sphere2 = ObjectData(sdSphere(pos, vec3(0.0f, 1.5f + sin(elapsedTime), 0.0f), 1.5f), materials[1]);
    return opSmoothIntersection(sphere2, sphere1, 0.2);
}

ObjectData scene2(vec3 pos){
    return ObjectData(sdSphere(pos, vec3(0.0f, 1.5f + 3.0 * sin(elapsedTime), 0.0f), 1.5f), materials[1]);
}