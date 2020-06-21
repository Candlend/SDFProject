#pragma once

#include "ofMain.h"
#include "ofxGui.h"
#include "DirLight.h"
#include "PointLight.h"
#include "Material.h"
#include "ofxEasyCubemap.h"

#define NR_POINT_LIGHTS 3
#define NR_MATERIALS 4

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

	void setupGUI();

	ofxPanel gui;
	bool guiHidden = false;
	ofTrueTypeFont font;
	ofParameterGroup parameters;
	ofParameter<float> shadowPenumbra;
	ofParameter<bool> useSoftShadow;
	ofParameter<bool> shadowImprovement;
	ofParameter<float> aoStepSize;
	ofParameter<int> sceneIndex;
	ofParameter<int> bounceTime;
	ofParameter<int> aoIterations;
	ofParameter<float> aoIntensity;
	ofParameter<float> stepScale;
	ofParameter<float> smoothness;
	ofParameter<float> deformStrength;
	ofParameter<float> reflectIntensity;
	ofParameter<float> fractRaito;
	ofEasyCam cam;
	ofShader raymarchShader;
	ofMesh quad;

	DirLight dirLight;
	PointLight pointLights[NR_POINT_LIGHTS];
	Material materials[NR_MATERIALS];
	ofxEasyCubemap cubeMap;
	float elapsedTime;
};
