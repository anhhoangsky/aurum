# Test fixtures

- `portrait.jpg` — the MediaPipe sample portrait (`storage.googleapis.com/mediapipe-assets/portrait.jpg`, 176,561 bytes). Used only by `test-landmarks-live.html` to exercise the real Face Landmarker. It is not copied into `dist/` or deployed.

Run the live test from the repository root so the self-hosted fileset is reachable:

```powershell
python -m http.server 4174
# open http://localhost:4174/aurum-editor/test-landmarks-live.html
```

The synthetic regression (`test-landmarks.html`) needs no fixture and runs from `aurum-editor/` on port 4173.
