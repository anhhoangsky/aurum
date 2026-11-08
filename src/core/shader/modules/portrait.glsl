float skinWeight(vec3 c, vec2 uv) {
  float y = luma(c);
  float cb = -0.168736 * c.r - 0.331264 * c.g + 0.5 * c.b + 0.5;
  float cr = 0.5 * c.r - 0.418688 * c.g - 0.081312 * c.b + 0.5;
  float m =
    smoothstep(0.30, 0.38, cr) * (1.0 - smoothstep(0.60, 0.70, cr)) *
    smoothstep(0.28, 0.36, cb) * (1.0 - smoothstep(0.54, 0.64, cb)) *
    smoothstep(0.10, 0.22, y) * (1.0 - smoothstep(0.90, 1.0, y));
  float face = 0.0;
  for (int i = 0; i < 4; i++) {
    if (i >= u_faceCount) break;
    vec4 f = u_faces[i];
    vec2 p = (uv - f.xy) / max(f.zw, vec2(0.0001));
    face = max(face, 1.0 - smoothstep(0.72, 1.0, length(p)));
  }
  return clamp(max(m, face * 0.9), 0.0, 1.0);
}
