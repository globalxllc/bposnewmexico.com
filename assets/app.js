(function(){
  const $ = s => document.querySelector(s);

  // Elements
  const v1 = $('#v1'), v2 = $('#v2'), v3 = $('#v3');
  const cover1 = $('#cover1');
  const unmute = $('#unmuteV1');
  const flow = $('#flow');
  const p2 = $('#p2'), pmap = $('#pmap'), p3 = $('#p3');
  const map = $('#nmMap');

  let audioAllowed = false;
  let mapShown = false;

  // Hide cover when V1 is actually rendering frames
  function bindCover(video, cover){
    function hide(){ cover && cover.classList.add('hide'); cleanup(); }
    function onPlay(){ hide(); }
    function onTU(){ if (video.currentTime > 0.05) hide(); }
    function onCP(){ if (video.readyState >= 2) setTimeout(hide, 80); }
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
  bindCover(v1, cover1);

  // Try to start V1 muted on load
  document.addEventListener('DOMContentLoaded', () => {
    try { v1.muted = true; const p=v1.play(); if(p&&p.catch) p.catch(()=>{});} catch {}
  });

  // Unmute V1 -> restart and hide button
  unmute.addEventListener('click', () => {
    audioAllowed = true;
    try { v1.currentTime = 0; } catch {}
    v1.muted = false;
    const p = v1.play(); if (p && p.catch) p.catch(()=>{});
    unmute.classList.add('hidden');
  }, {once:true});

  // Helper: robust play attempts for V2/V3
  function robustStart(video, {wantAudio=true, maxTries=12, interval=700}={}){
    let tries = 0;
    const h = setInterval(() => {
      if (!video.paused && !video.ended && video.currentTime > 0.05){ clearInterval(h); return; }
      tries++;
      video.muted = !wantAudio;
      const p = video.play(); if (p && p.catch) p.catch(()=>{});
      if (tries >= maxTries) clearInterval(h);
    }, interval);
  }

  // Sequence: V1 end -> scroll to flow and start V2
  v1.addEventListener('ended', () => {
    flow.scrollIntoView({behavior:'smooth', block:'start'});
    setTimeout(() => {
      try { v2.currentTime = 0; } catch {}
      robustStart(v2, {wantAudio: audioAllowed});
    }, 400);
  });

  // If user scrolls to V2 early, start it
  const io2 = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting && e.target === p2){
        robustStart(v2, {wantAudio: audioAllowed});
      }
    });
  }, {threshold: .5});
  io2.observe(p2);

  // On V2 end -> show map, hold 6s, then scroll to V3 and start
  function revealMapThenV3(){
    if (mapShown) return;
    mapShown = true;
    map.classList.remove('show'); void map.offsetWidth; map.classList.add('show');
    setTimeout(() => {
      p3.scrollIntoView({behavior:'smooth', block:'start'});
      setTimeout(() => {
        try { v3.currentTime = 0; } catch {}
        robustStart(v3, {wantAudio: audioAllowed});
      }, 400);
    }, 6000);
  }
  v2.addEventListener('ended', revealMapThenV3);
  v2.addEventListener('timeupdate', () => {
    if (!mapShown && v2.duration && v2.currentTime / v2.duration > 0.985) revealMapThenV3();
  });
  // Hard fallback in case metadata is odd
  setTimeout(()=>{ if (!mapShown) revealMapThenV3(); }, 60000);

})();