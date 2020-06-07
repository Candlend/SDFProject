#pragma once
#include "PropertyRenderer.h"


class DirLight : public PropertyRenderer {
public:
	ofParameter<bool> enabled;
	ofParameter<glm::vec3> direction;
	ofParameter<ofFloatColor> color;

	void setup(string name, glm::vec3 d = glm::vec3(-1.0f, -1.0f, -1.0f), glm::vec3 c = glm::vec3(0.5f, 0.5f, 0.5f)) {
		parameters.setName(name);
		parameters.add(enabled.set("Enabled", true, false, true));
		parameters.add(direction.set("Direction", d, glm::vec3(-1.0f, -1.0f, -1.0f), glm::vec3(1.0f, 1.0f, 1.0f)));
		parameters.add(color.set("Color", ofFloatColor(c.x, c.y, c.z), ofFloatColor(0.0f, 0.0f, 0.0f), ofFloatColor(1.0f, 1.0f, 1.0f)));
	}
	void setUniform(ofShader &shader, string name = "dirLight") {
		shader.setUniform1i(name + ".enabled", enabled);
		shader.setUniform3f(name + ".direction", direction);
		shader.setUniform3f(name + ".color", getVector(color));
	}
};
