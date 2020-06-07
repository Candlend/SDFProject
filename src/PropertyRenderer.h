#pragma once
#include "ofxGui.h"
#include "ofMain.h"

static glm::vec3 getVector(ofFloatColor color) {
	return glm::vec3(color.r, color.g, color.b);
}

class PropertyRenderer {
public:
	ofParameterGroup parameters;
	virtual void setUniform(ofShader &shader, string name) = 0;
};