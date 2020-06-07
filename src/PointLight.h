#pragma once
#include "LightRenderer.h"


class PointLight : public LightRenderer {
public:
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
