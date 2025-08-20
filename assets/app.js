(()=>{
  if (/Edg\//.test(navigator.userAgent)) document.body.classList.add('edge');

  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const v3 = document.getElementById('v3');
  const unmute = document.getElementById('unmute');

  const layerV2  = document.getElementById('layer-v2');
  const layerMap = document.getElementById('layer-map');
  const layerV3  = document.getElementById('layer-v3');

  async function handleUnmute(){
    try{ v1.pause(); }catch{}
    try{ v1.currentTime = 0; }catch{}
    v1.muted = false;
    try{ await v1.play().catch(()=>{}); }catch{}
    unmute.classList.add('hidden');
  }
  unmute.addEventListener('click', handleUnmute);
  document.addEventListener('keydown', (e)=>{
    if((e.code==='Space'||e.code==='Enter') && !unmute.classList.contains('hidden')) handleUnmute();
  }, {once:true});

  function robustStart(video,{wantAudio=true,maxTries=10,interval=600}={}){
    let tries=0;
    const t = setInterval(()=>{
      if(!video.paused && !video.ended && video.currentTime>0.05){ clearInterval(t); return; }
      tries++;
      video.muted = !wantAudio;
      const p = video.play(); if(p&&p.catch) p.catch(()=>{});
      if(tries>=maxTries) clearInterval(t);
    }, interval);
  }

  function showLayer(target){
    [layerV2, layerMap, layerV3].forEach(l => l.classList.toggle('active', l===target));
  }

  v1.addEventListener('ended', ()=>{
    showLayer(layerV2);
    setTimeout(()=> robustStart(v2, {wantAudio: !v1.muted}), 350);
  });

  v2.addEventListener('ended', ()=>{
    showLayer(layerMap);
    setTimeout(()=>{
      showLayer(layerV3);
      setTimeout(()=> robustStart(v3, {wantAudio: !v1.muted}), 400);
    }, 6000);
  });

  const ta = document.querySelector('textarea.autosize');
  if (ta){
    const resize = () => { ta.style.height='auto'; ta.style.height = Math.min(ta.scrollHeight, 12*16) + 'px'; };
    ta.addEventListener('input', resize);
    resize();
  }
})();