BPOsNewMexico.com__v5

WHAT'S IN THIS ZIP
------------------
index.html
css/styles.css
js/app.js
media/ (place your actual videos and map image here)

HOW TO USE
----------
1) Put your media files into /media and name them exactly:
   - video1.mp4  (hero/top video)
   - video2.mp4  (left column, section 2)
   - video3.mp4  (left column, section 3)
   - nm-map.png  (map image for section 3)

2) Open index.html. You should see:
   - Video 1 with a small blue "Unmute" button centered above the control bar.
     Clicking it removes the button, restarts V1 with sound, and unlocks audio
     for the rest of the session.

   - Scrolling to Section 2 shows Video 2 on the left and a STICKY intake
     form on the right half. Three seconds after Section 2 comes into view,
     Video 2 starts UNMUTED automatically (no unmute button).

   - Section 3 shows the New Mexico map flying in and holding for 6 seconds.
     Video 3 sits BELOW the map; after the 6 second hold, V3 begins UNMUTED.
     The map is NOT replaced—users scroll down to V3 naturally.

   - The intake stays visible on the right from Section 2 onward, with no
     horizontal scrolling or alignment glitches.

NOTES
-----
- There is no "Start" overlay; any legacy start layers are hidden/removed.
- The Unmute button exists ONLY for Video 1 and disappears after it’s clicked.
- Video 2 and Video 3 do not show an unmute button; they rely on the user
  gesture you made by unmuting Video 1.
- If you need to tweak the map hold time, look for the 6000ms delay in js/app.js.
- If you want the left column widths different, adjust grid-template-columns in css/styles.css.

Version label: v5
