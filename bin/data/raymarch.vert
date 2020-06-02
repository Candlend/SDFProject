#version 410

layout ( location = 0 ) in vec3 aPos;
layout ( location = 1 ) in vec4 aTangent;
layout ( location = 2 ) in vec3 aNormal;
layout ( location = 3 ) in vec2 aTexCoords;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat4 camFrustum;
uniform mat4 camToWorld;

out vec2 texCoords;
out vec3 rayDir;

void main()
{
	int index = int(dot(aTexCoords, vec2(1, 2)));
	texCoords = aTexCoords;
	rayDir = (camToWorld * camFrustum[index]).xyz;
	gl_Position = vec4(aPos,1);
}
