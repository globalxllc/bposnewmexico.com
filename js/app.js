(function(){
  const isEdge = navigator.userAgent.includes('Edg/');
  if (isEdge) document.body.classList.add('edge');

  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const v3 = document.getElementById('v3');
  const unmuteBtn = document.getElementById('unmuteV1');
  const intake = document.getElementById('intakeWrap');
  const mapImg = document.getElementById('nmMap');
  const s2 = document.getElementById('s2');
  const s3 = document.getElementById('s3');

  // Ensure any old “start” overlays are gone
  document.querySelectorAll('#start, .start-overlay, [data-start]').forEach(el => el.remove());

  // V1 Unmute: user gesture unlocks autoplay with sound for session
  function restartAndPlay(v){
    try {
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(()=>{});
    } catch(e){}
  }
  unmuteBtn.addEventListener('click', () => {
    try { v1.muted = false; } catch(e){}
    restartAndPlay(v1);
    unmuteBtn.classList.add('hidden');
  });

  // Make sure intake is visible once Section 2 is reached
  intake.style.visibility = 'hidden';
  let v2Armed = false;
  let v3Armed = false;

  const obs = new IntersectionObserver((entries)=>{
    for (const entry of entries){
      if (!entry.isIntersecting) continue;

      if (entry.target.id === 's2'){
        intake.style.visibility = 'visible';
        if (!v2Armed){
          v2Armed = true;
          setTimeout(()=>{
            try { v2.muted = false; } catch(e){}
            restartAndPlay(v2);
          }, 3000); // 3s after Section 2 appears
        }
      }

      if (entry.target.id === 's3'){
        if (mapImg){
          mapImg.classList.add('show');
          if (!v3Armed){
            v3Armed = true;
            setTimeout(()=>{
              try { v3.muted = false; } catch(e){}
              restartAndPlay(v3);
            }, 6000); // hold map 6s, then start V3 (below the map)
          }
        }
      }
    }
  }, { threshold: 0.55 });

  [s2, s3].forEach(s => obs.observe(s));

  // Extra safety against accidental horizontal scrolling
  window.addEventListener('load', () => {
    document.querySelectorAll('body, .section, .left-col, .right-col, #intakeWrap')
      .forEach(el => { el.style.overflowX = 'hidden'; el.style.maxWidth = '100%'; });
  });
})();