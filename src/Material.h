#pragma once
#include "PropertyRenderer.h"


class Material : public PropertyRenderer {
public:
	ofParameter<ofFloatColor> ambient;
	ofParameter<ofFloatColor> diffuse;
	ofParameter<ofFloatColor> specular;
	ofParameter<float> shininess;
	ofParameter<float> reflectIntensity;
	ofParameter<float> refractRatio;
	ofParameter<float> refractIntensity;

	void setup(string name, glm::vec3 p = glm::vec3(0.0f, 1.0f, 0.0f), glm::vec3 c = glm::vec3(0.5f, 0.5f, 0.5f)) {
		parameters.setName(name);
		parameters.add(ambient.set("Ambient", ofFloatColor(c.x, c.y, c.z) * 0.2, ofFloatColor(0.0f, 0.0f, 0.0f), ofFloatColor(1.0f, 1.0f, 1.0f)));
		parameters.add(diffuse.set("Diffuse", ofFloatColor(c.x, c.y, c.z), ofFloatColor(0.0f, 0.0f, 0.0f), ofFloatColor(1.0f, 1.0f, 1.0f)));
		parameters.add(specular.set("Specular", ofFloatColor(c.x, c.y, c.z), ofFloatColor(0.0f, 0.0f, 0.0f), ofFloatColor(1.0f, 1.0f, 1.0f)));
		parameters.add(shininess.set("Shininess", 32.0f, 1.0f, 128.0f));
		parameters.add(reflectIntensity.set("ReflectIntensity", 0.0f, 0.0f, 1.0f));
		parameters.add(refractRatio.set("RefractRatio", 0.0f, 0.0f, 1.0f));
		parameters.add(refractIntensity.set("RefractIntensity", 0.0f, 0.0f, 1.0f));
	}
	void setUniform(ofShader &shader, string name = "material") {
		shader.setUniform3f(name + ".ambient", getVector(ambient));
		shader.setUniform3f(name + ".diffuse", getVector(diffuse));
		shader.setUniform3f(name + ".specular", getVector(specular));
		shader.setUniform1f(name + ".shininess", shininess);
		shader.setUniform1f(name + ".reflectIntensity", reflectIntensity);
		shader.setUniform1f(name + ".refractRatio", refractRatio);
		shader.setUniform1f(name + ".refractIntensity", refractIntensity);
	}
};
