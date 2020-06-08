#include "ofApp.h"
#include "ofShader.h"

glm::mat4 model;
glm::mat4 view;
glm::mat4 projection;

glm::mat4 camFrustum;
glm::mat4 camToWorld;
glm::vec3 cameraPos;

ofRectangle viewport;

static ofMesh GetQuad() {
	ofMesh quad;
	quad.addVertex(glm::vec3(-1.0f, -1.0f, 0.0f));
	quad.addVertex(glm::vec3(1.0f, -1.0f, 0.0f));
	quad.addVertex(glm::vec3(1.0f, 1.0f, 0.0f));
	quad.addVertex(glm::vec3(-1.0f, 1.0f, 0.0f));

	quad.addTexCoord(glm::vec2(0.0f, 0.0f));
	quad.addTexCoord(glm::vec2(1.0f, 0.0f));
	quad.addTexCoord(glm::vec2(1.0f, 1.0f));
	quad.addTexCoord(glm::vec2(0.0f, 1.0f));

	quad.addIndex(0);
	quad.addIndex(2);
	quad.addIndex(1);
	quad.addIndex(0);
	quad.addIndex(3);
	quad.addIndex(2);
	return quad;
}

static glm::mat4 GetCamFrustum(ofCamera cam)
{
	glm::mat4 mat = glm::identity<glm::mat4>();
	float fov = glm::tan(glm::radians(cam.getFov() * 0.5f));
	glm::vec3 up = glm::vec3(0, 1, 0) * fov;
	glm::vec3 right = glm::vec3(1, 0, 0) * (cam.getAspectRatio() * fov);
	glm::vec3 TL = glm::vec3(0, 0, -1) + up - right;
	glm::vec3 TR = glm::vec3(0, 0, -1) + up + right;
	glm::vec3 BL = glm::vec3(0, 0, -1) - up - right;
	glm::vec3 BR = glm::vec3(0, 0, -1) - up + right;
	mat[0] = glm::vec4(TL, 0);
	mat[1] = glm::vec4(TR, 0);
	mat[2] = glm::vec4(BL, 0);
	mat[3] = glm::vec4(BR, 0);
	return mat;
}

static glm::mat4 GetCamToWorld(ofCamera cam, bool vFlip = true)
{
	glm::mat4 MVmatrix = cam.getModelViewMatrix();
	MVmatrix = glm::scale(glm::mat4(1.0), glm::vec3(1.f, -1.f, 1.f)) * MVmatrix;
	return glm::inverse(MVmatrix);
}

void ofApp::setupGUI() {
	parameters.setName("Settings");
	parameters.add(sceneIndex.set("Scene Index", 0, 0, 2));
	parameters.add(stepScale.set("Step Scale", 0.5f, 0.0f, 1.0f));
	parameters.add(smoothness.set("Smoothness", 0.5f, 0.0f, 1.0f));
	parameters.add(deformStrength.set("Deformation Strength", 0.1f, 0.0f, 1.0f));

	ofParameterGroup shadowGroup("Shadow");
	shadowGroup.add(useSoftShadow.set("Use Soft Shadow", true, false, true));
	shadowGroup.add(shadowImprovement.set("Shadow Improvement", false, false, true));
	shadowGroup.add(shadowPenumbra.set("Shadow Penumbra", 16.0f, 1.0f, 100.0f));
	parameters.add(shadowGroup);

	ofParameterGroup aoGroup("Ambient Occlusion");
	aoGroup.add(aoIterations.set("AO Iterations", 20, 0, 100));
	aoGroup.add(aoStepSize.set("AO Step Size", 0.05f, 0.001f, 0.1f));
	aoGroup.add(aoIntensity.set("AO Intensity", 0.1f, 0.0f, 1.0f));
	parameters.add(aoGroup);

	ofParameterGroup lightGroup("Lights");
	dirLight.setup("Directional Light");
	lightGroup.add(dirLight.parameters);
	for (int i = 0; i < NR_POINT_LIGHTS; i++) {
		lightGroup.add(pointLights[i].parameters);
		pointLights[i].setup("Point Light " + std::to_string(i));
	}
	parameters.add(lightGroup);
	ofParameterGroup materialGroup("Materials");
	for (int i = 0; i < NR_MATERIALS; i++) {
		materialGroup.add(materials[i].parameters);
		materials[i].setup("Material " + std::to_string(i));
	}
	parameters.add(materialGroup);

	gui.setup(parameters);
	gui.loadFromFile("settings.xml");
	font.load(OF_TTF_SANS, 9, true, true);
	ofEnableAlphaBlending();
}

//--------------------------------------------------------------
void ofApp::setup() {
	raymarchShader.load("raymarch.vert", "raymarch.frag");

	glm::vec3 cameraPos = glm::vec3(0, 0, 5);
	glm::vec3 cameraTarget = glm::vec3(0, 0, 0);
	glm::vec3 cameraUp = glm::vec3(0, 1, 0);
	cam.setupPerspective(false, 60, 0.1, 17000);
	cam.setPosition(cameraPos);
	cam.setTarget(cameraTarget);
	cam.setOrientation(cameraUp);
	viewport = ofGetCurrentRenderer()->getCurrentViewport();
	cam.setAspectRatio(viewport.width / viewport.height);

	model = glm::mat4(1.0);
	view = cam.getModelViewMatrix();
	projection = cam.getProjectionMatrix();

	quad = GetQuad();

	setupGUI();
}

//--------------------------------------------------------------
void ofApp::update() {
	viewport = ofGetCurrentRenderer()->getCurrentViewport();
	cam.setAspectRatio(viewport.width / viewport.height);
	view = cam.getModelViewMatrix();
	projection = cam.getProjectionMatrix();
	camFrustum = GetCamFrustum(cam);
	camToWorld = GetCamToWorld(cam);
	cameraPos = cam.getGlobalPosition();
	elapsedTime = ofGetElapsedTimef();
}

//--------------------------------------------------------------
void ofApp::draw() {
	cam.begin();
	raymarchShader.begin();
	raymarchShader.setUniform3f("materials[0].ambient", glm::vec3(0.2f, 0.2f, 0.2f));
	raymarchShader.setUniform3f("materials[0].diffuse", glm::vec3(0.8f, 0.8f, 0.8f));
	raymarchShader.setUniform3f("materials[0].specular", glm::vec3(0.8f, 0.8f, 0.8f));
	raymarchShader.setUniform1f("materials[0].shininess", 64.0f);
	raymarchShader.setUniform3f("materials[1].ambient", glm::vec3(0.2f, 0.0f, 0.0f));
	raymarchShader.setUniform3f("materials[1].diffuse", glm::vec3(0.8f, 0.0f, 0.0f));
	raymarchShader.setUniform3f("materials[1].specular", glm::vec3(0.8f, 0.0f, 0.0f));
	raymarchShader.setUniform1f("materials[1].shininess", 16.0f);
	raymarchShader.setUniformMatrix4f("camFrustum", camFrustum);
	raymarchShader.setUniformMatrix4f("camToWorld", camToWorld);
	raymarchShader.setUniform3f("cameraPos", cameraPos);
	raymarchShader.setUniform1f("elapsedTime", elapsedTime);
	raymarchShader.setUniform1i("sceneIndex", sceneIndex);
	raymarchShader.setUniform1f("stepScale", stepScale);
	raymarchShader.setUniform1f("smoothness", smoothness);
	raymarchShader.setUniform1f("deformStrength", deformStrength);

	raymarchShader.setUniform1f("shadowPenumbra", shadowPenumbra);
	raymarchShader.setUniform1f("useSoftShadow", useSoftShadow);
	raymarchShader.setUniform1f("shadowImprovement", shadowImprovement);
	raymarchShader.setUniform1f("aoStepSize", aoStepSize);
	raymarchShader.setUniform1i("aoIterations", aoIterations);
	raymarchShader.setUniform1f("aoIntensity", aoIntensity);
	dirLight.setUniform(raymarchShader);
	for (int i = 0; i < NR_POINT_LIGHTS; i++) {
		pointLights[i].setUniform(raymarchShader, "pointLights[" + std::to_string(i) + "]");
	}
	for (int i = 0; i < NR_MATERIALS; i++) {
		materials[i].setUniform(raymarchShader, "materials[" + std::to_string(i) + "]");
	}
	quad.draw();
	raymarchShader.end();
	cam.end();
	gui.draw();
	font.drawString("fps: " + ofToString((int)ofGetFrameRate()), ofGetWidth() - 50, 20);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key) {

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y) {

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button) {

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button) {

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button) {

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y) {

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y) {

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h) {

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg) {

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo) {

}
