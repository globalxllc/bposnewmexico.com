BPOsNewMexico.com — v10

Fixes vs v9:
- **Video 2 autoplay hardened**: multiple start triggers (V1 end, S2 visible, retry watchdog) so V2 reliably begins.
- **Covers** now hide on playing/canplay/timeupdate, so overlays don’t linger.
- **Intake** is visible/sticky immediately at Section 2 and persists beside Map and V3.
- **Map progression**: triggered on V2 ended OR >98.5% watched, with a 45s fallback.
- **Video 3** starts only after map’s 6s hold and scroll to Section 3.

Cloudinary links are hardwired for all 3 videos. No “Start” button anywhere. V1 has a small **Unmute** chip only.
