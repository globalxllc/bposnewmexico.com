(function(){
  const $ = s => document.querySelector(s);

  // Elements
  const body = document.body;
  const v1 = $('#v1'), v2 = $('#v2'), v3 = $('#v3');
  const cover1 = $('#cover1');
  const unmute = $('#unmuteV1');
  const frame = $('#playerFrame');
  const leftRail = $('#leftRail');
  const panelV2 = $('#panelV2');
  const panelMap = $('#panelMap');
  const panelV3 = $('#panelV3');
  const map = $('#nmMap');

  let audioAllowed = false;

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

  // Unmute V1 -> restart and hide the button
  unmute.addEventListener('click', () => {
    audioAllowed = true;
    try { v1.currentTime = 0; } catch {}
    v1.muted = false;
    const p = v1.play(); if (p && p.catch) p.catch(()=>{});
    unmute.classList.add('hidden');
  }, {once:true});

  // Helper to play videos robustly
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

  // After V1 ends: pin overlay and start the left-only flow
  v1.addEventListener('ended', () => {
    body.classList.add('pin'); // shows overlay & disables body scroll
    frame.setAttribute('aria-hidden', 'false');

    // Ensure left rail at top (V2)
    leftRail.scrollTo({top: 0, left: 0, behavior: 'instant' || 'auto'});

    // Start V2 (audio follows V1 unmute)
    try { v2.currentTime = 0; } catch {}
    robustStart(v2, {wantAudio: audioAllowed});

    // When V2 ends: auto-scroll left rail to map, show it, wait 6s, then to V3
    v2.addEventListener('ended', () => {
      leftRail.scrollTo({ top: panelMap.offsetTop - 12, behavior: 'smooth' });
      // map fly-in
      map.classList.remove('show'); void map.offsetWidth; map.classList.add('show');
      setTimeout(() => {
        leftRail.scrollTo({ top: panelV3.offsetTop - 12, behavior: 'smooth' });
        setTimeout(() => {
          try { v3.currentTime = 0; } catch {}
          robustStart(v3, {wantAudio: audioAllowed});
        }, 500);
      }, 6000);
    }, { once: true });
  });

})();