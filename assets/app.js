(()=>{
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const v3 = document.getElementById('v3');
  const unmute = document.getElementById('unmute');

  // Unmute overlay: restart V1 from 0 and hide button
  function handleUnmute(){
    try{ v1.pause(); }catch{}
    try{ v1.currentTime = 0; }catch{}
    v1.muted = false;
    try{ v1.play().catch(()=>{});}catch{}
    unmute.classList.add('hidden');
  }
  unmute.addEventListener('click', handleUnmute);

  // Fade-in reveals
  const panels = document.querySelectorAll('.panel.fade');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold: .25});
  panels.forEach(p => io.observe(p));

  // Smooth scroll helper
  function rafScrollTo(targetY, duration=800){
    const startY = window.scrollY || window.pageYOffset;
    const startT = performance.now();
    function step(now){
      const t = Math.min(1, (now - startT)/duration);
      const ease = t<.5 ? 2*t*t : -1+(4-2*t)*t;
      window.scrollTo(0, startY + (targetY - startY)*ease);
      if (t<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function scrollToEl(el){
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 8;
    if ('scrollBehavior' in document.documentElement.style) window.scrollTo({top:y, behavior:'smooth'});
    else rafScrollTo(y, 900);
  }

  // Auto sequence: V1 → V2 → Map (6s) → V3
  v1?.addEventListener('ended', ()=> scrollToEl(document.getElementById('panel-v2')));

  function startIfVisible(panelId, videoEl){
    const panel = document.getElementById(panelId);
    if (!panel || !videoEl) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if (e.isIntersecting && videoEl.paused && videoEl.currentTime===0){
          setTimeout(()=>{
            const wantAudio = !v1.muted;
            videoEl.muted = !wantAudio ? true : false;
            videoEl.play().catch(()=>{});
          }, 400);
          obs.unobserve(panel);
        }
      });
    }, {threshold:.55});
    obs.observe(panel);
  }
  startIfVisible('panel-v2', v2);
  startIfVisible('panel-v3', v3);

  v2?.addEventListener('ended', ()=> {
    const secMap = document.getElementById('panel-map');
    scrollToEl(secMap);
    setTimeout(()=> scrollToEl(document.getElementById('panel-v3')), 6000);
  });

  // Autosize textarea (~2 lines to start)
  document.querySelectorAll('textarea.autosize').forEach(ta=>{
    const resize = ()=>{ ta.style.height='auto'; ta.style.height = Math.min(ta.scrollHeight, 12*16) + 'px'; };
    ta.addEventListener('input', resize);
    resize();
  });
})();