/* Helper: load src from data-src only when needed */
function setSrcIfNeeded(el) {
  const data = el.getAttribute('data-src');
  if (data && !el._loadedSrc) {
    el.src = data;
    el._loadedSrc = true;
  }
}

/* HERO video1 logic with custom Unmute */
const v1 = document.getElementById('video1');
const unmute = document.getElementById('unmuteBtn');

// Ensure src is set and try to autoplay muted (allowed)
setSrcIfNeeded(v1);
v1.addEventListener('canplay', () => {
  v1.play().catch(()=>{});
}, { once: true });

unmute.addEventListener('click', () => {
  try { v1.pause(); v1.currentTime = 0; } catch(e) {}
  v1.muted = false;
  v1.play().catch(()=>{});
  unmute.style.display = 'none'; // disappear on click
});

/* LEFT rail: activate panels as they appear. Keep RIGHT intake sticky */
const panels = [...document.querySelectorAll('.left .panel')];
const v2 = document.getElementById('video2');
const v3 = document.getElementById('video3');

[ v2, v3 ].forEach(v => setSrcIfNeeded(v));

// Intersection logic to fade panels and (re)start videos on enter
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const panel = entry.target;
    if (entry.isIntersecting) {
      panel.classList.remove('inactive');
      const kind = panel.dataset.kind;
      if (kind === 'video2') {
        // restart & unmute V2 once visible
        v2.muted = false;
        try { v2.pause(); v2.currentTime = 0; } catch(e) {}
        v2.play().catch(()=>{});
      } else if (kind === 'video3') {
        v3.muted = false;
        try { v3.pause(); v3.currentTime = 0; } catch(e) {}
        v3.play().catch(()=>{});
      }
    } else {
      panel.classList.add('inactive');
    }
  });
}, { rootMargin: '-10% 0px -10% 0px', threshold: 0.6 });

panels.forEach(p => io.observe(p));

/* Auto-grow textarea (limit 2 lines until typing) */
document.querySelectorAll('textarea[data-autogrow="true"]').forEach(t => {
  const min = t.scrollHeight;
  t.style.height = min + 'px';
  t.addEventListener('input', () => {
    t.style.height = 'auto';
    t.style.height = Math.min(t.scrollHeight, 240) + 'px';
  });
});

/* Defensive: ensure videos keep aspect ratio & don't overflow intake */
function normalizeMediaSizes() {
  document.querySelectorAll('.media-el').forEach(el => {
    el.style.maxWidth = '100%';
  });
}
window.addEventListener('resize', normalizeMediaSizes);
normalizeMediaSizes();
