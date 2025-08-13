// Smooth scroll with custom duration
function smoothScrollTo(targetY, duration=2000){
  const startY = window.scrollY;
  const diff = Math.max(0, targetY) - startY;
  const start = performance.now();
  function step(now){
    const t = Math.min(1, (now - start)/duration);
    const ease = t<.5 ? 2*t*t : -1+(4-2*t)*t; // easeInOutQuad
    window.scrollTo(0, startY + diff*ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

(function(){
  const hero = document.getElementById('hero');
  const v1 = document.getElementById('v1');
  const unmuteBtn = document.getElementById('unmuteBtn');
  const tapHint = document.getElementById('tapHint');

  const main = document.getElementById('main');
  const v2 = document.getElementById('v2');
  const v2Wrap = document.getElementById('v2Wrap');
  const v3 = document.getElementById('v3');
  const v3Wrap = document.getElementById('v3Wrap');
  const formPane = document.getElementById('formPane');

  const mapOverlay = document.getElementById('mapOverlay');
  const mapImg = document.getElementById('mapImg');

  let userUnmuted = false;

  function tryPlay(el){ try{ const p = el.play(); if (p && p.catch) p.catch(()=>{});}catch(e){} }
  function waitEnded(video, ms=60000){
    return new Promise(res=>{
      const to = setTimeout(()=>res('timeout'), ms);
      video.addEventListener('ended', ()=>{ clearTimeout(to); res('ended'); }, {once:true});
    });
  }

  // Tap hint after first frame
  v1.addEventListener('loadeddata', ()=>{
    hero.classList.add('ready');
    setTimeout(()=> hero.classList.add('hide-hint'), 2500);
  });

  // Unmute behaviors (restart V1)
  unmuteBtn.addEventListener('click', async ()=>{
    try{ v1.currentTime=0; v1.muted=false; await v1.play(); userUnmuted=true; }catch(e){}
    unmuteBtn.classList.add('hidden');
  });
  v1.addEventListener('click', async ()=>{
    if (v1.muted){
      try{ v1.currentTime=0; v1.muted=false; await v1.play(); userUnmuted=true; }catch(e){}
      unmuteBtn.classList.add('hidden');
    }
  });

  // Start sequence
  tryPlay(v1);
  setTimeout(()=>{ if (v1.paused) tryPlay(v1); }, 500);

  (async function run(){
    await waitEnded(v1, 60000);

    // Reveal main with intake exactly as V2 starts
    const mainTop = document.getElementById('main').getBoundingClientRect().top + window.scrollY - 8;
    hero.classList.add('fade-out');
    setTimeout(()=>{
      hero.classList.add('hidden');
      main.classList.remove('hidden');
      main.classList.add('fade-in');

      // Auto-scroll to main slowly
      smoothScrollTo(mainTop, 2200);

      // Start V2 and ensure intake is visible now
      if (userUnmuted) v2.muted = false;
      tryPlay(v2);
    }, 400);

    // After V2 ends -> Fullscreen Map overlay slow fly (7s) + 6s hold -> V3
    v2.addEventListener('ended', ()=>{
      mapOverlay.classList.remove('hidden');
      mapImg.classList.remove('map-fly-slow'); void mapImg.offsetWidth;
      mapImg.classList.add('map-fly-slow');

      setTimeout(()=>{ // after 7s fly + 6s hold
        mapOverlay.classList.add('hidden');
        // Show V3
        v3Wrap.classList.remove('hidden');
        const v3Top = v3Wrap.getBoundingClientRect().top + window.scrollY - 12;
        smoothScrollTo(v3Top, 2200);
        if (userUnmuted) v3.muted = false;
        tryPlay(v3);

        // Ensure entire form is visible next to V3 (no bottom hidden)
        setTimeout(()=>{
          const formBottom = formPane.getBoundingClientRect().bottom + window.scrollY;
          const viewportBottom = window.scrollY + window.innerHeight;
          if (formBottom > viewportBottom){
            smoothScrollTo(formBottom - window.innerHeight + 24, 1500);
          }
        }, 700);
      }, 7000 + 6000);
    }, {once:true});
  })();

  // Kill horizontal drift
  document.documentElement.style.overflowX = 'hidden';
})();