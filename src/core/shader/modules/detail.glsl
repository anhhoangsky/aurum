void addTap(vec2 base, vec2 offset, float centerLuma, float invSigma2, inout vec3 acc, inout float wsum) {
  vec3 s = texture2D(u_texture, base + offset).rgb;
  float dl = luma(s) - centerLuma;
  float w = exp(-dl * dl * invSigma2);
  acc += s * w;
  wsum += w;
}
