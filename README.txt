BPOsNewMexico.com — v23 (revert-to-v20 behavior)

What’s fixed (based on your notes):
- Video 1 is FULL‑SCREEN hero (100vh). V2/Map/V3 live in a left column.
- Auto‑sequence restored:
  • V1 auto‑plays (muted). On end → smooth‑scroll to two‑column and auto‑play V2.
  • After V2 ends → scroll to the Map, hold ~6s, then scroll to V3 (no bottom‑of‑map showing).
  • Only one video plays at a time (others paused).
- Big Unmute button (one click) restarts V1 and unmutes V1; after a short delay tries to unmute V2 & V3. If browser blocks, they play muted.
- Intake panel is sticky on the RIGHT starting at Video 2. Compact styling so the bottom (submit + phone) stays visible.
- Horizontal overflow disabled to avoid offset drift.
- Form posts to api/submit.php; emails are sent to backoffice@bposnewmexico.com and a copy to globalxllc@gmail.com.
  NOTE: For reliability, you may switch to SMTP/PHPMailer. This build uses PHP’s mail() for portability.

How to deploy:
1) Place all files on your host so that index.html is at the site root.
2) If you have a Map image, put the exact file next to index.html with name:
   “Portrait MAP New Mexico Counties.jpg”
   …or update index.html to point to your own URL.
3) Ensure your hosting supports PHP for api/submit.php (mail() enabled). If mail() is blocked, switch to SMTP.
   - Update addresses in api/submit.php as needed.
4) If you want SMTP, replace api/submit.php with a PHPMailer version and configure your SMTP credentials.

Files:
  - index.html
  - styles.css
  - script.js
  - api/submit.php
  - assets/ (empty placeholder folder; add any local assets if needed)
