(function(){
  const $ = s => document.querySelector(s);

  // UA tweak for Edge
  if (navigator.userAgent.includes('Edg')) document.body.classList.add('edge');

  const body = document.body;
  const v1 = $('#v1'), v2 = $('#v2'), v3 = $('#v3');
  const cover1 = $('#cover1');
  const unmute = $('#unmuteV1');
  const frame = $('#playerFrame');
  const leftRail = $('#leftRail');
  const panelMap = $('#panelMap');
  const panelV3 = $('#panelV3');
  const map = $('#nmMap');

  let audioAllowed = false;

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

  document.addEventListener('DOMContentLoaded', () => {
    try { v1.muted = true; const p=v1.play(); if(p&&p.catch) p.catch(()=>{});} catch {}
  });

  unmute.addEventListener('click', () => {
    audioAllowed = true;
    try { v1.currentTime = 0; } catch {}
    v1.muted = false;
    const p = v1.play(); if (p && p.catch) p.catch(()=>{});
    unmute.classList.add('hidden');
  }, {once:true});

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

  v1.addEventListener('ended', () => {
    body.classList.add('pin');
    frame.setAttribute('aria-hidden', 'false');
    leftRail.scrollTo({top: 0, left: 0, behavior: 'auto'});
    try { v2.currentTime = 0; } catch {}
    robustStart(v2, {wantAudio: audioAllowed});

    v2.addEventListener('ended', () => {
      leftRail.scrollTo({ top: panelMap.offsetTop - 10, behavior: 'smooth' });
      map.classList.remove('show'); void map.offsetWidth; map.classList.add('show');
      setTimeout(() => {
        leftRail.scrollTo({ top: panelV3.offsetTop - 10, behavior: 'smooth' });
        setTimeout(() => {
          try { v3.currentTime = 0; } catch {}
          robustStart(v3, {wantAudio: audioAllowed});
        }, 450);
      }, 6000);
    }, { once: true });
  });

})();