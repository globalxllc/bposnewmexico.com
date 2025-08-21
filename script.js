// Normalize unmute overlay behavior for v1
const v1 = document.getElementById('v1');
const unmuteBtn = document.getElementById('unmuteBtn');

if (v1) {
  v1.play().catch(() => {/* autoplay may be blocked */});
  unmuteBtn?.addEventListener('click', () => {
    try {
      v1.muted = false;
      v1.currentTime = 0;
      v1.play().catch(()=>{});
    } catch {}
    unmuteBtn.style.display = 'none';
  });
  v1.addEventListener('volumechange', () => {
    if (!v1.muted) unmuteBtn.style.display = 'none';
  });
}

// Form submit with feedback
const form = document.getElementById('bpo-form');
const status = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', body: data });
      const json = await res.json();
      if (json.ok) {
        status.textContent = 'Thanks — your request has been sent.';
        form.reset();
      } else {
        status.textContent = 'Sorry, something went wrong.';
        console.error(json);
      }
    } catch (err) {
      status.textContent = 'Network error. Please try again.';
      console.error(err);
    }
  });
}
