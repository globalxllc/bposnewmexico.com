# BPOsNewMexico.com – v5

This bundle implements your requests:
- No "start" overlay; a **smaller blue Unmute** button appears **only for Video 1**, sits lower, and disappears on click.
- After you unmute V1, the video **restarts** and plays with audio.
- When V1 ends, the page **auto-scrolls slowly** to the split section: **Video 2 (left)** and **sticky intake (right)**.
- The intake is visible from the **start of Video 2** and stays on the right for the rest.
- When Video 2 ends, a **map flies in** (bigger, slender feel) and holds **6 seconds**.
- After that, the page **auto-scrolls** to Video 3 (left). Video 3 starts **unmuted** a few seconds after the scroll.
- Horizontal scrolling removed; layout aligned to the **left**; intake is **sticky**.
- File upload accepts **.jpg / .pdf**, multiple files.

## Replace Video 1 URL
Edit `index.html` and set the Video 1 `<source>` to your actual Cloudinary link:

```html
<video id="video1" ...>
  <source src="YOUR_VIDEO_1_URL.mp4" type="video/mp4">
</video>
```

## Timings
Adjust delays in `script.js`:
```js
const DELAY_BEFORE_V2 = 3000;
const MAP_HOLD_MS     = 6000;
const DELAY_BEFORE_V3 = 3000;
const SCROLL_MS       = 1600;
```

## Build details
- HTML/CSS/JS only; no external libs.
- Map image: `assets/map-new-mexico.jpg`.
- Right column intake is `position: sticky` with larger, clean inputs.
