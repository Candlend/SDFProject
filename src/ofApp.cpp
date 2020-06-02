#include "ofApp.h"
#include "ofShader.h"

glm::mat4 model;
glm::mat4 view;
glm::mat4 projection;

glm::mat4 camFrustum;
glm::mat4 camToWorld;
glm::vec3 cameraPos;

ofRectangle viewport;

struct DirLight {
	glm::vec3 direction;
	glm::vec3 ambient;
	glm::vec3 diffuse;
	glm::vec3 specular;
};

struct PointLight {
	glm::vec3 position;
	float constant;
	float linear;
	float quadratic;
	glm::vec3 ambient;
	glm::vec3 diffuse;
	glm::vec3 specular;
};

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

static glm::mat4 GetCamToWorld(ofCamera cam)
{
	glm::mat4 MVmatrix = cam.getModelViewMatrix();
	return glm::inverse(MVmatrix);
}

//--------------------------------------------------------------
void ofApp::setup() {
	raymarchShader.load("raymarch.vert", "raymarch.frag");

	glm::vec3 cameraPos = glm::vec3(0, 0, 5);
	glm::vec3 cameraTarget = glm::vec3(0, 0, 0);
	glm::vec3 cameraUp = glm::vec3(0, 1, 0);
	cam.setupPerspective(true, 60, 0.1, 17000);
	cam.setPosition(cameraPos);
	cam.setTarget(cameraTarget);
	cam.setOrientation(cameraUp);
	viewport = ofGetCurrentRenderer()->getCurrentViewport();
	cam.setAspectRatio(viewport.width / viewport.height);

	ofEnableDepthTest();
	model = glm::mat4(1.0);
	view = cam.getModelViewMatrix();
	projection = cam.getProjectionMatrix();

	quad = GetQuad();

	raymarchShader.begin();
	raymarchShader.setUniform3f("mat.ambient", glm::vec3(0.5f, 0.5f, 0.5f));
	raymarchShader.setUniform3f("mat.diffuse", glm::vec3(0.5f, 0.5f, 0.5f));
	raymarchShader.setUniform3f("mat.specular", glm::vec3(0.5f, 0.5f, 0.5f));
	raymarchShader.setUniform1f("mat.shininess", 64.0f);
	raymarchShader.setUniform3f("dirLight.direction", glm::vec3(1.0f, 1.0f, 1.0f));
	raymarchShader.setUniform3f("dirLight.ambient", glm::vec3(0.2f, 0.2f, 0.2f));
	raymarchShader.setUniform3f("dirLight.diffuse", glm::vec3(1.0f, 1.0f, 1.0f));
	raymarchShader.setUniform3f("dirLight.specular", glm::vec3(1.0f, 1.0f, 1.0f));
	raymarchShader.setUniform3f("pointLights[0].position", glm::vec3(-5.7f,  5.2f,  -2.0f));
	raymarchShader.setUniform3f("pointLights[0].ambient", 0.05f, 0.0f, 0.0f);
	raymarchShader.setUniform3f("pointLights[0].diffuse", 0.8f, 0.0f, 0.0f);
	raymarchShader.setUniform3f("pointLights[0].specular", 1.0f, 0.0f, 0.0f);
	raymarchShader.setUniform1f("pointLights[0].constant", 1.0f);
	raymarchShader.setUniform1f("pointLights[0].linear", 0.09);
	raymarchShader.setUniform1f("pointLights[0].quadratic", 0.032);
	phongShader.end();
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
}

//--------------------------------------------------------------
void ofApp::draw() {
	cam.begin();
	raymarchShader.begin();


	raymarchShader.setUniformMatrix4f("camFrustum", camFrustum);
	raymarchShader.setUniformMatrix4f("camToWorld", camToWorld);
	raymarchShader.setUniform3f("cameraPos", cameraPos);
	quad.draw();

	raymarchShader.end();
	phongShader.begin();
	phongShader.setUniformMatrix4f("model", model);
	phongShader.setUniformMatrix4f("view", view);
	phongShader.setUniformMatrix4f("projection", projection);
	//ofDrawSphere(1);
	phongShader.end();
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
