#include "ofApp.h"
#include "ofShader.h"

glm::mat4 model;
glm::mat4 view;
glm::mat4 projection;

glm::mat4 camFrustum;
glm::mat4 camToWorld;
glm::vec3 cameraPos;

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

static glm::mat4 GetCamToWorld(ofCamera cam)
{
	glm::mat4 MVmatrix = cam.getModelViewMatrix();
	return glm::inverse(MVmatrix);
}

//--------------------------------------------------------------
void ofApp::setup() {
	ofDisableArbTex();
	phongShader.load("phong.vert", "phong.frag");
	raymarchShader.load("vertex_color.vert", "vertex_color.frag");

	glm::vec3 cameraPos = glm::vec3(0, 0, 5);
	glm::vec3 cameraTarget = glm::vec3(0, 0, 0);
	glm::vec3 cameraUp = glm::vec3(0, 1, 0);
	cam.setupPerspective(false, 60, 0.1, 17000);
	cam.setPosition(cameraPos);
	cam.setTarget(cameraTarget);
	cam.setOrientation(cameraUp);

	ofEnableDepthTest();
	model = glm::mat4(1.0);
	view = cam.getModelViewMatrix();
	projection = cam.getProjectionMatrix();
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
}

//--------------------------------------------------------------
void ofApp::update() {
	view = cam.getModelViewMatrix();
	projection = cam.getProjectionMatrix();
	camFrustum = GetCamFrustum(cam);
	camToWorld = GetCamToWorld(cam);
	cameraPos = cam.getGlobalPosition();
}

//--------------------------------------------------------------
void ofApp::draw() {
	cam.begin();
	raymarchShader.begin();
	raymarchShader.setUniformMatrix4f("model", model);
	raymarchShader.setUniformMatrix4f("view", view);
	raymarchShader.setUniformMatrix4f("projection", projection);

	raymarchShader.setUniformMatrix4f("camFrustum", camFrustum);
	raymarchShader.setUniformMatrix4f("camToWorld", camToWorld);
	raymarchShader.setUniform3f("cameraPos", cameraPos);
	quad.draw();
	//ofDrawSphere(1);

	raymarchShader.end();
	cam.end();
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
