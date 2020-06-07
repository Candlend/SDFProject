float sdSphere(vec3 pos, vec3 center, float radius)
{
    return length(pos - center) - radius;
}

float sdPlane(vec3 p, vec3 center, vec3 n, float h)
{
  return dot(p - center, n) + h;
}

float sdCube(vec3 p, vec3 center, vec3 b)
{
    vec3 q = abs(p - center)-b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdRoundCube(vec3 p, vec3 center, vec3 b, float r)
{
    vec3 q = abs(p - center)-b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float sd2DCross(vec2 p, vec2 b, float r)
{
     p = abs(p);p = p.y>p.x?p.yx:p.xy;
     vec2 q = p-b;
     float k = max(q.y, q.x);
     vec2 w = (k>0) ? q:vec2(b.y-b.x, -k);
     return sign(k)*length(max(w, 0.0))+r;
}

float sdCylinder(vec3 p, vec3 center, float h, float r)
{
    vec2 d = abs(vec2(length((p-center).xz), (p-center).y)) - vec2(h,r);
    return min(max(d.x,d.y),0.0)+ length(max(d, 0.0));
}