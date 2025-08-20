(()=>{
  if (/Edg\//.test(navigator.userAgent)) document.body.classList.add('edge');

  const v1=document.getElementById('video1');
  const v2=document.getElementById('video2');
  const v3=document.getElementById('video3');
  const unmuteBtn=document.getElementById('unmuteBtn');

  const sceneV2=document.getElementById('scene-v2');
  const sceneMap=document.getElementById('scene-map');
  const sceneV3=document.getElementById('scene-v3');

  let audioAllowed=false;

  async function enableAudio(){
    try{ v1.muted=false; await v1.play().catch(()=>{});}catch{}
    audioAllowed=true; unmuteBtn.classList.add('hidden');
  }
  unmuteBtn.addEventListener('click', enableAudio);
  document.addEventListener('keydown',(e)=>{
    if((e.code==='Space'||e.code==='Enter')&&!audioAllowed) enableAudio();
  }, {once:true});

  const gotoScene=(el,delay=0)=>new Promise(res=>{
    setTimeout(()=>{ el.scrollIntoView({behavior:'smooth',block:'start'}); setTimeout(res,900); }, delay);
  });

  function robustStart(video,{wantAudio=true,maxTries=12,interval=650}={}){
    let tries=0;
    const t=setInterval(()=>{
      if(!video.paused && !video.ended && video.currentTime>0.05){ clearInterval(t); return; }
      tries++; video.muted=!wantAudio;
      const p=video.play(); if(p&&p.catch) p.catch(()=>{});
      if(tries>=maxTries) clearInterval(t);
    }, interval);
  }

  v1.addEventListener('ended', async ()=>{
    await gotoScene(sceneV2);
    setTimeout(()=> robustStart(v2,{wantAudio:audioAllowed}), 350);
  });

  v2.addEventListener('ended', async ()=>{
    await gotoScene(sceneMap);
    setTimeout(async ()=>{
      await gotoScene(sceneV3);
      setTimeout(()=> robustStart(v3,{wantAudio:audioAllowed}), 350);
    }, 6000); // hold ~6s on map
  });

  const io=new IntersectionObserver((entries)=>{
    entries.forEach((e)=>{
      if(e.isIntersecting && e.target.id==='scene-v2' && v2.paused && v2.currentTime===0){
        setTimeout(()=> robustStart(v2,{wantAudio:audioAllowed}), 300);
      }
    });
  }, {threshold:0.6});
  io.observe(sceneV2);
})();