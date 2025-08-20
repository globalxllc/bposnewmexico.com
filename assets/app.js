(function(){
  const $ = s => document.querySelector(s);

  // Elements
  const v1 = $('#v1'), v2 = $('#v2'), v3 = $('#v3');
  const c1 = $('#v1Cover'), c2 = $('#v2Cover'), c3 = $('#v3Cover');
  const unmute = $('#unmuteV1');
  const map = $('#nmMap');
  let audioAllowed = false;

  // Helper: play muted to pass autoplay policies; fallbacks handled silently
  function tryPlayMuted(video){
    try { video.muted = true; const p = video.play(); if (p && p.catch) p.catch(()=>{}); } catch {}
  }
  function hideCoverOnPlay(video, cover){
    function hide(){ if (cover) cover.classList.add('hide'); video.removeEventListener('playing', hide); }
    video.addEventListener('playing', hide);
    // also if we get currentTime advancing, hide
    video.addEventListener('timeupdate', function once(){
      if (video.currentTime > 0.05){ hide(); video.removeEventListener('timeupdate', once); }
    });
  }

  // Start V1 muted immediately; cover hides only when we actually see frames
  document.addEventListener('DOMContentLoaded', () => {
    hideCoverOnPlay(v1, c1);
    tryPlayMuted(v1);
  });

  // Unmute behavior for V1 only: restart and hide button
  unmute.addEventListener('click', () => {
    audioAllowed = true;
    try { v1.currentTime = 0; } catch {}
    v1.muted = false;
    const p = v1.play(); if (p && p.catch) p.catch(()=>{});
    unmute.classList.add('hidden');
  }, {once:true});

  // If autoplay is blocked even when muted, the first pointerdown anywhere will start it
  document.addEventListener('pointerdown', () => {
    if (v1.paused) { tryPlayMuted(v1); }
  }, {passive:true});

  // Sequence
  v1.addEventListener('ended', () => {
    // Show intake immediately as we scroll to section 2
    document.getElementById('s2').scrollIntoView({behavior:'smooth', block:'start'});
    setTimeout(() => {
      hideCoverOnPlay(v2, c2);
      v2.muted = !audioAllowed;
      const p = v2.play(); if (p && p.catch) p.catch(()=>{});
      if (audioAllowed) setTimeout(()=> v2.muted = false, 200);
    }, 500);
  });

  v2.addEventListener('ended', () => {
    // Fly-in map (show), hold 6s, then go to V3
    map.classList.remove('show'); void map.offsetWidth; map.classList.add('show');
    setTimeout(() => {
      document.getElementById('s3').scrollIntoView({behavior:'smooth', block:'start'});
      setTimeout(() => {
        hideCoverOnPlay(v3, c3);
        v3.muted = !audioAllowed;
        const p = v3.play(); if (p && p.catch) p.catch(()=>{});
        if (audioAllowed) setTimeout(()=> v3.muted = false, 200);
      }, 500);
    }, 6000);
  });

  // If user scrolls to V2/V3 earlier, start them (covers hide on playing)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      if (e.target === $('#s2')){
        hideCoverOnPlay(v2, c2);
        v2.muted = !audioAllowed;
        const p = v2.play(); if (p && p.catch) p.catch(()=>{});
      }
      if (e.target === $('#s3')){
        map.classList.add('show');
      }
    });
  }, {threshold: 0.55});
  io.observe($('#s2')); io.observe($('#s3'));
})();