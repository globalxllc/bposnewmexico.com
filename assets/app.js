(()=>{
  if (/Edg\//.test(navigator.userAgent)) document.body.classList.add('edge');

  const stage  = document.getElementById('stage');
  const v1     = document.getElementById('v1');
  const v2     = document.getElementById('v2');
  const v3     = document.getElementById('v3');
  const unmute = document.getElementById('unmute');
  const toStage= document.getElementById('toStage');

  function rafScrollTo(targetY, duration=700){
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
  function smoothScrollToEl(el){
    const y = el.getBoundingClientRect().top + window.pageYOffset - 8;
    if ('scrollBehavior' in document.documentElement.style){
      window.scrollTo({top:y, behavior:'smooth'});
    } else {
      rafScrollTo(y, 800);
    }
  }

  async function handleUnmute(){
    try{ v1.pause(); }catch{}
    try{ v1.currentTime = 0; }catch{}
    v1.muted = false;
    try{ await v1.play().catch(()=>{});}catch{}
    unmute.classList.add('hidden');
  }
  unmute.addEventListener('click', handleUnmute);
  toStage.addEventListener('click', ()=> smoothScrollToEl(stage));

  const revealables = document.querySelectorAll('.revealable');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.classList.add('revealed');
        if (e.target.id==='sec-v2' && v2.paused && v2.currentTime===0){
          setTimeout(()=>{
            const wantAudio = !v1.muted;
            v2.muted = !wantAudio;
            v2.play().catch(()=>{});
          }, 300);
        }
        if (e.target.id==='sec-v3' && v3.paused && v3.currentTime===0){
          setTimeout(()=>{
            const wantAudio = !v1.muted;
            v3.muted = !wantAudio;
            v3.play().catch(()=>{});
          }, 300);
        }
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.40});

  revealables.forEach(el=> io.observe(el));

  v1.addEventListener('ended', ()=> smoothScrollToEl(document.getElementById('sec-v2')));
  v2.addEventListener('ended', ()=> {
    const secMap = document.getElementById('sec-map');
    smoothScrollToEl(secMap);
    setTimeout(()=> smoothScrollToEl(document.getElementById('sec-v3')), 6000);
  });

  const ta = document.querySelector('textarea.autosize');
  if (ta){
    const resize = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 12*16) + 'px'; };
    ta.addEventListener('input', resize);
    resize();
  }
})();

(function(){
  const v1 = document.getElementById('v1');
  const stage = document.getElementById('stage');
  const v2Pane = document.getElementById('pane-v2');
  const mapPane = document.getElementById('pane-map');
  const v3Pane = document.getElementById('pane-v3');
  const v2 = document.getElementById('v2');
  const v3 = document.getElementById('v3');
  function activatePane(el){
    document.querySelectorAll('.media-pane').forEach(p=>p.classList.remove('active'));
    if (el) el.classList.add('active');
  }
  function goStage(){
    window.scrollTo({top: stage.offsetTop - 8, behavior:'smooth'});
    document.body.classList.add('stage-locked');
  }
  if (v1) v1.addEventListener('ended', ()=>{ goStage(); activatePane(v2Pane); try{ v2 && v2.play(); }catch(e){} }, {once:true});
  if (v2) v2.addEventListener('ended', ()=>{ activatePane(mapPane); setTimeout(()=>{ activatePane(v3Pane); try{ v3 && v3.play(); }catch(e){} }, 6000); });
})();
