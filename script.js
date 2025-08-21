// Helper: pause all but one to avoid overlaps
function pauseOthers(except) {
  ['v1', 'v2', 'v3'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el !== except) { try { el.pause(); } catch(e){} }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const v3 = document.getElementById('v3');
  const unmuteBtn = document.getElementById('unmuteBtn');
  const content = document.getElementById('content');
  const mapEl = document.getElementById('nmMap');
  const form = document.getElementById('bpoForm');
  const statusEl = document.getElementById('formStatus');

  let userUnmuted = false;

  function tryUnmute(video) {
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {
      // browsers may block; leave muted as fallback
    });
  }

  // Big Unmute button: restart v1 & unmute all
  function handleUnmute() {
    userUnmuted = true;
    try {
      v1.currentTime = 0;
    } catch(e){}
    tryUnmute(v1);
    // give browser a beat before trying others
    setTimeout(() => { tryUnmute(v2); tryUnmute(v3); }, 3000);
    unmuteBtn.style.display = 'none';
  }
  unmuteBtn.addEventListener('click', handleUnmute);
  v1.addEventListener('click', handleUnmute);

  // Ensure only one plays at a time
  [v1, v2, v3].forEach(v => {
    if (!v) return;
    v.addEventListener('play', () => pauseOthers(v));
  });

  // On V1 end: scroll to two-column and start V2
  v1.addEventListener('ended', () => {
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // slight delay to allow layout settle
    setTimeout(() => {
      v2.play().catch(()=>{});
      if (userUnmuted) setTimeout(() => tryUnmute(v2), 1200);
    }, 500);
  });

  // After V2 ends: scroll to map, hold ~6s, then to V3 (hide bottom of map by aligning top of V3)
  v2.addEventListener('ended', () => {
    if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // hold map for 6 seconds
    setTimeout(() => {
      v3.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        v3.play().catch(()=>{});
        if (userUnmuted) setTimeout(() => tryUnmute(v3), 1200);
      }, 400);
    }, 6000);
  });

  // Form submit with fetch; show message; keep email routed via PHP
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Submitting…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      if (data.ok) {
        statusEl.textContent = data.message || 'Submitted. We’ll be in touch shortly.';
        form.reset();
      } else {
        statusEl.textContent = 'Error: ' + (data.error || 'Unknown error');
      }
    } catch (err) {
      statusEl.textContent = 'Network error. Please try again.';
    }
  });
});
