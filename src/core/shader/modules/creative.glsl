vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void addBand(
  float hue, float center, float width, vec3 shift,
  inout float dh, inout float ds, inout float dl, inout float wsum
) {
  float d = abs(mod(hue - center + 540.0, 360.0) - 180.0);
  float w = 1.0 - smoothstep(width * 0.55, width, d);
  if (w > 0.0001) {
    dh += shift.x * w;
    ds += shift.y * w;
    dl += shift.z * w;
    wsum += w;
  }
}

vec3 sampleLUT(vec3 c) {
  float size = u_lutSize;
  float slice = c.b * (size - 1.0);
  float s0 = floor(slice);
  float s1 = min(s0 + 1.0, size - 1.0);
  float f = slice - s0;
  float y = (c.g * (size - 1.0) + 0.5) / size;
  float x0 = (s0 * size + c.r * (size - 1.0) + 0.5) / (size * size);
  float x1 = (s1 * size + c.r * (size - 1.0) + 0.5) / (size * size);
  vec3 a = texture2D(u_lut, vec2(x0, y)).rgb;
  vec3 b = texture2D(u_lut, vec2(x1, y)).rgb;
  return mix(a, b, f);
}
