#pragma once

#include "ofMain.h"
#include "ofxGui.h"
#include "DirLight.h"
#include "PointLight.h"

#define NR_POINT_LIGHTS 3

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
	ofTrueTypeFont font;
	ofParameterGroup parameters;
	ofParameter<float> shadowPenumbra;
	ofParameter<float> aoStepSize;
	ofParameter<int> aoIterations;
	ofParameter<float> aoIntensity;

	ofEasyCam cam;
	ofShader raymarchShader;
	ofMesh quad;

	DirLight dirLight;
	PointLight pointLights[NR_POINT_LIGHTS];
	
	float elapsedTime;
};
