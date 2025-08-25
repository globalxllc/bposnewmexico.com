const browser = (() => {
  const ua = navigator.userAgent;
  if (ua.includes("Edg") && !ua.includes("Chrome")) return "edge";
  if (ua.includes("Chrome")) return "chrome";
  return "other";
})();

console.log("Detected browser:", browser);C:\Users\kimsw\Documents\bposnewmexico.com\js\app.js// Minimal JS: keep intake static; left rail is native scroll-snap.
// Ensure map never peeks when moving to V3 by snapping strictly.
(() => {
  const rail = document.querySelector('#leftRail');
  // Optional: when a pane comes fully into view, you could start/pause videos here.
  const panes = [...document.querySelectorAll('.snap-pane')];
  const vids = panes.flatMap(p => [...p.querySelectorAll('video')]);
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      const vid = e.target.querySelector('video');
      if (!vid) return;
      if (e.isIntersecting && e.intersectionRatio > 0.8) {
        // play when active
        vid.play().catch(()=>{});
      } else {
        vid.pause();
      }
    });
  }, {root:null, threshold:[0.0,0.8]});
  panes.forEach(p => io.observe(p));
})();
