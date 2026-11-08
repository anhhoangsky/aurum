attribute vec2 a_pos;
attribute vec2 a_uv;
attribute float a_w;
uniform mat3 u_matrix;
uniform vec2 u_warp;
varying vec2 v_uv;
varying vec2 v_screen;
void main() {
  // a_pos is the source quad (-1..1, y up). u_warp applies the projective
  // Z tilt in source space before the affine crop/view matrix. For the export
  // pass u_warp is zero, a_pos is the pre-divided clip position and a_w is the
  // homography weight, so the rasteriser interpolates UVs projectively.
  float w = a_w * (1.0 + u_warp.x * a_pos.y + u_warp.y * a_pos.x);
  vec3 p = u_matrix * vec3(a_pos, w);
  gl_Position = vec4(p.xy, 0.0, w);
  v_uv = a_uv;
  v_screen = p.xy / w;
}
