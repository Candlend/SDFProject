#version 410

out vec4 FragColor;

#pragma include "test.frag"

void main()
{
	FragColor = color;
}