document.addEventListener('DOMContentLoaded', () => {
  ['vid1','vid2','vid3'].forEach(id => {
    const v = document.getElementById(id);
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
  });
});
