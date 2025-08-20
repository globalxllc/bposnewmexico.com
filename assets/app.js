(function(){
  const $ = s => document.querySelector(s);

  // Elements
  const v1 = $('#v1'), v2 = $('#v2'), v3 = $('#v3');
  const c1 = $('#c1'), c2 = $('#c2'), c3 = $('#c3');
  const unmute = $('#unmuteV1');
  const map = $('#nmMap');
  let audioAllowed = false;

  // Helper: hide cover as soon as frames actually render
  function bindCover(video, cover){
    function hide(){ cover && cover.classList.add('hide'); cleanup(); }
    function onPlay(){ hide(); }
    function onTU(){ if (video.currentTime > 0.05) hide(); }
    function onCP(){ if (video.readyState >= 2) setTimeout(hide, 100); }
    function cleanup(){
      video.removeEventListener('playing', onPlay);
      video.removeEventListener('timeupdate', onTU);
      video.removeEventListener('canplay', onCP);
      video.removeEventListener('canplaythrough', onCP);
    }
    video.addEventListener('playing', onPlay);
    video.addEventListener('timeupdate', onTU);
    video.addEventListener('canplay', onCP);
    video.addEventListener('canplaythrough', onCP);
  }

  bindCover(v1, c1);
  bindCover(v2, c2);
  bindCover(v3, c3);

  // Try to start V1 muted immediately; if blocked, first tap starts it
  function tryPlayMuted(video){
    try {
      video.muted = true;
      const p = video.play();
      if (p && p.catch) p.catch(()=>{});
    } catch {}
  }
  document.addEventListener('DOMContentLoaded', () => tryPlayMuted(v1));

  // Unmute behavior for V1 only
  unmute.addEventListener('click', () => {
    audioAllowed = true;
    try { v1.currentTime = 0; } catch {}
    v1.muted = false;
    const p = v1.play(); if (p && p.catch) p.catch(()=>{});
    unmute.classList.add('hidden');
  }, {once:true});

  document.addEventListener('pointerdown', () => {
    if (v1.paused) tryPlayMuted(v1);
  }, {passive:true});

  // Robust play attempt with retries until 'playing' or max tries
  function robustStart(video, {wantAudio, maxTries=10, interval=800}={}){
    let tries = 0;
    const timer = setInterval(() => {
      if (!video.paused && !video.ended && video.currentTime > 0) { clearInterval(timer); return; }
      tries++;
      video.muted = !wantAudio;
      const p = video.play();
      if (p && p.catch) p.catch(()=>{});
      if (tries >= maxTries) clearInterval(timer);
    }, interval);
  }

  // When V1 ends, go to S2 and start V2; Intake is already visible/sticky
  v1.addEventListener('ended', () => {
    document.getElementById('s2').scrollIntoView({behavior:'smooth', block:'start'});
    setTimeout(() => {
      v2.currentTime = 0;
      robustStart(v2, {wantAudio: audioAllowed});
    }, 500);
  });

  // Start V2 as soon as S2 becomes visible too (in case user scrolls early)
  const s2 = $('#s2');
  const io2 = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if (e.isIntersecting) {
        robustStart(v2, {wantAudio: audioAllowed});
      }
    });
  }, {threshold: .35});
  io2.observe(s2);

  // From V2 to map (on ended OR near-end OR after 45s fallback)
  let mapTriggered = false;
  function toMap(){
    if (mapTriggered) return;
    mapTriggered = true;
    map.classList.remove('show'); void map.offsetWidth; map.classList.add('show');
    setTimeout(() => {
      document.getElementById('s3').scrollIntoView({behavior:'smooth', block:'start'});
      setTimeout(() => {
        v3.currentTime = 0;
        robustStart(v3, {wantAudio: audioAllowed});
      }, 600);
    }, 6000);
  }
  v2.addEventListener('ended', toMap);
  v2.addEventListener('timeupdate', () => {
    if (!mapTriggered && v2.duration && v2.currentTime / v2.duration > 0.985) toMap();
  });
  setTimeout(() => { if (!mapTriggered) toMap(); }, 45000); // hard fallback

  // Show map when S3 becomes visible by scroll
  const s3 = $('#s3');
  const io3 = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if (e.isIntersecting) map.classList.add('show'); });
  }, {threshold: .4});
  io3.observe(s3);

})();