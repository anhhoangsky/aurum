/**
 * Optional landmark bundle.
 *
 * The core's face geometry uses server boxes and face-relative feature
 * anchors out of the box. Load this module only when a precise pass is worth
 * the extra download, then hand the result to `core.setFaceAnchors()`.
 * MediaPipe is imported dynamically from self-hosted URLs; it is never part
 * of this bundle and never runs on a server.
 */

export {
  anchorsFromLandmarks,
  faceAnchorFromLandmarks,
  MIN_FACE_LANDMARKS,
} from './math';
export type { LandmarkPoint } from './math';
export {
  closeFaceLandmarker,
  detectFaceAnchors,
} from './mediapipe';
export type {
  FaceLandmarkerOptions,
  LandmarkWasmAssets,
} from './mediapipe';
