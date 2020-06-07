#pragma once

#include "ofMain.h"
#include "ofxGui.h"

#define NR_POINT_LIGHTS 1

static glm::vec3 getVector(ofFloatColor color) {
	return glm::vec3(color.r, color.g, color.b);
}

class LightRenderer {
public:
	ofParameterGroup parameters;
	virtual void setup(string name);
	virtual void setUniform(ofShader &shader, string name);
	LightRenderer(string name) {
		setup(name);
	}
};

class DirLight : public LightRenderer {
public:
	ofParameter<glm::vec3> direction;
	ofParameter<ofFloatColor> color;
	void setup(string name, glm::vec3 d = glm::vec3(-1.0f, -1.0f, -1.0f), glm::vec3 c = glm::vec3(0.5f, 0.5f, 0.5f)) {
		parameters.setName(name);
		parameters.add(direction.set("Direction", d, glm::vec3(-1.0f, -1.0f, -1.0f), glm::vec3(1.0f, 1.0f, 1.0f)));
		parameters.add(color.set("Color", ofFloatColor(c.x, c.y, c.z), ofFloatColor(0.0f, 0.0f, 0.0f), ofFloatColor(1.0f, 1.0f, 1.0f)));
	}
	void setUniform(ofShader &shader, string name = "dirLight") {
		shader.setUniform3f(name + ".direction", direction);
		shader.setUniform3f(name + ".color", getVector(color));
	}
};

class PointLight : public LightRenderer {
	ofParameter<glm::vec3> position;
	ofParameter<ofFloatColor> color;
	void setup(string name, glm::vec3 p = glm::vec3(0.0f, 1.0f, 0.0f), glm::vec3 c = glm::vec3(0.5f, 0.5f, 0.5f)) {
		parameters.setName(name);
		parameters.add(position.set("Position", p, glm::vec3(-100.0f, -100.0f, -100.0f), glm::vec3(100.0f, 100.0f, 100.0f)));
		parameters.add(color.set("Color", ofFloatColor(c.x, c.y, c.z), ofFloatColor(0.0f, 0.0f, 0.0f), ofFloatColor(1.0f, 1.0f, 1.0f)));
	}
	void setUniform(ofShader &shader, string name = "pointLight") {
		shader.setUniform3f(name + ".position", position);
		shader.setUniform3f(name + ".color", getVector(color));
	}
};

class ofApp : public ofBaseApp {

public:
	void setup();
	void update();
	void draw();

	void keyPressed(int key);
	void keyReleased(int key);
	void mouseMoved(int x, int y);
	void mouseDragged(int x, int y, int button);
	void mousePressed(int x, int y, int button);
	void mouseReleased(int x, int y, int button);
	void mouseEntered(int x, int y);
	void mouseExited(int x, int y);
	void windowResized(int w, int h);
	void dragEvent(ofDragInfo dragInfo);
	void gotMessage(ofMessage msg);

	void ofApp::setupGUI();

	ofxPanel gui;
	ofTrueTypeFont font;
	ofParameterGroup parameters;
	ofParameter<float> shadowPenumbra;

	ofEasyCam cam;
	ofShader raymarchShader;
	ofMesh quad;

	DirLight dirLight;
	PointLight pointLights[NR_POINT_LIGHTS];
};
