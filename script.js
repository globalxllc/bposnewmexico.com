// --- Configurable timings (ms) ---
const DELAY_BEFORE_V2 = 3000;  // delay after auto-scroll to V2
const MAP_HOLD_MS     = 6000;  // how long the map stays before moving to V3
const DELAY_BEFORE_V3 = 3000;  // delay after auto-scroll to V3
const SCROLL_MS       = 1600;  // smooth scroll duration

// Grab elements
const v1 = document.getElementById('video1');
const v2 = document.getElementById('video2');
const v3 = document.getElementById('video3');
const unmuteBtn = document.getElementById('unmuteBtn');

const split = document.getElementById('split');
const panelV2 = document.getElementById('panel-v2');
const panelMap = document.getElementById('panel-map');
const panelV3 = document.getElementById('panel-v3');

// UTIL: smooth scroll to an element with consistent timing
function smoothScrollTo(el, duration = SCROLL_MS) {
  const startY = window.scrollY;
  const endY = el.getBoundingClientRect().top + window.scrollY - 10;
  const diff = endY - startY;
  let start;

  return new Promise(resolve => {
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      // easeInOutQuad
      const eased = p < 0.5 ? 2*p*p : -1 + (4 - 2*p)*p;
      window.scrollTo(0, startY + diff * eased);
      if (p < 1) requestAnimationFrame(step); else resolve();
    }
    requestAnimationFrame(step);
  });
}

// Pause videos when mostly out of view
const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    const el = e.target;
    if (el.tagName !== 'VIDEO') continue;
    if (e.isIntersecting && e.intersectionRatio > 0.6) {
      // do nothing (play controlled by our flow)
    } else {
      try { el.pause(); } catch {}
    }
  }
}, { threshold: [0, .6, 1] });
[v2, v3].forEach(v => io.observe(v));

// Ensure panels fade in when reached
const showIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: .15 });
[panelV2, panelMap, panelV3].forEach(p => showIO.observe(p));

// --- Unmute behavior for V1 only ---
function handleUnmuteClick() {
  try {
    v1.muted = false;
    v1.currentTime = 0; // restart when unmuted (requested)
    v1.play().catch(()=>{});
  } catch {}
  unmuteBtn.style.opacity = '0';
  unmuteBtn.style.pointerEvents = 'none';
  setTimeout(()=> unmuteBtn.remove(), 400);
}
unmuteBtn.addEventListener('click', handleUnmuteClick);

// After V1 ends: scroll to split, show V2 + intake immediately
v1.addEventListener('ended', async () => {
  await smoothScrollTo(split);
  // Make sure V2 panel is visible and intake shows immediately
  panelV2.classList.add('visible');
  setTimeout(() => {
    try {
      v2.muted = false; // should be allowed since user interacted on unmute
      v2.play().catch(()=>{});
    } catch {}
  }, DELAY_BEFORE_V2);

  // When V2 ends, show MAP, then go to V3
  v2.addEventListener('ended', async () => {
    panelMap.classList.add('visible');
    // hold the map for a bit
    await new Promise(r => setTimeout(r, MAP_HOLD_MS));
    // now scroll to V3
    await smoothScrollTo(panelV3);
    panelV3.classList.add('visible');
    setTimeout(() => {
      try {
        v3.muted = false;
        v3.play().catch(()=>{});
      } catch {}
    }, DELAY_BEFORE_V3);
  }, { once: true });
});

// If autoplay policies block any play, ensure our button can fix it
window.addEventListener('load', () => {
  // Attempt to autoplay muted hero so we see motion behind the Unmute button
  v1.play().catch(()=>{/* ignored, user will click Unmute */});
});
