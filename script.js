// v20-like sequence with no decorative borders; keep things simple and reliable.
function pauseOthers(except){
  ['v1','v2','v3'].forEach(id => {
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
    video.play().catch(()=>{});
  }

  function handleUnmute() {
    userUnmuted = true;
    try { v1.currentTime = 0; } catch(e){}
    tryUnmute(v1);
    setTimeout(() => { tryUnmute(v2); tryUnmute(v3); }, 1200);
    unmuteBtn.style.display = 'none';
  }

  unmuteBtn.addEventListener('click', handleUnmute);
  v1.addEventListener('click', handleUnmute);
  [v1, v2, v3].forEach(v => v && v.addEventListener('play', () => pauseOthers(v)));

  // On V1 end: scroll to content and start V2
  v1.addEventListener('ended', () => {
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      v2.play().catch(()=>{});
      if (userUnmuted) setTimeout(() => tryUnmute(v2), 600);
    }, 350);
  });

  // After V2 end: map ~6s, then V3
  v2.addEventListener('ended', () => {
    if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      v3.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        v3.play().catch(()=>{});
        if (userUnmuted) setTimeout(() => tryUnmute(v3), 600);
      }, 250);
    }, 6000);
  });

  // Form submit -> on-screen confirmation
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
