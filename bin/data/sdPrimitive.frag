float sdSphere(vec3 pos, vec3 center, float radius)
{
    return length(pos - center) - radius;
}

float sdPlane(vec3 p, vec3 center, vec3 n, float h)
{
  return dot(p - center, n) + h;
}