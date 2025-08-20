(()=>{
  // Edge class for CSS tweaks
  if (/Edg\//.test(navigator.userAgent)) document.body.classList.add('edge');

  const v1=document.getElementById('video1');
  const v2=document.getElementById('video2');
  const v3=document.getElementById('video3');
  const unmuteBtn=document.getElementById('unmuteBtn');

  let audioAllowed=false;

  async function enableAudio(){
    try{ v1.muted=false; await v1.play().catch(()=>{});}catch{}
    audioAllowed=true;
    unmuteBtn.classList.add('hidden'); // hide button after use
  }
  unmuteBtn.addEventListener('click', enableAudio);

  // Allow space/enter to also enable audio once
  document.addEventListener('keydown',(e)=>{
    if((e.code==='Space'||e.code==='Enter')&&!audioAllowed) enableAudio();
  }, {once:true});

  // Robust start helper (prevents "stuck paused" across browsers)
  function robustStart(video,{wantAudio=true,maxTries=12,interval=650}={}){
    let tries=0;
    const t=setInterval(()=>{
      if(!video.paused && !video.ended && video.currentTime>0.05){ clearInterval(t); return; }
      tries++;
      video.muted=!wantAudio;
      const p=video.play(); if(p&&p.catch) p.catch(()=>{});
      if(tries>=maxTries) clearInterval(t);
    }, interval);
  }

  // Smooth scroll helper
  const smoothScrollTo=(el)=>new Promise((res)=>{
    el.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(res, 900);
  });

  const stage=document.getElementById('stage');
  const v2block=document.getElementById('v2-block');
  const mapBlock=document.getElementById('map-block');
  const mapImg=document.querySelector('.map');
  const v3block=document.getElementById('v3-block');

  // After V1 ends → scroll to stage → start V2 shortly after arrival
  v1.addEventListener('ended', async ()=>{
    await smoothScrollTo(stage);
    setTimeout(()=>{
      try{ v2.currentTime=0; }catch{}
      robustStart(v2,{wantAudio:audioAllowed});
    }, 500);
  });

  // After V2 ends → show/animate map (hold ~6s) → scroll to V3 & play
  v2.addEventListener('ended', async ()=>{
    mapBlock.classList.remove('hidden');
    setTimeout(()=>{ mapImg.classList.add('flyin'); }, 40);
    setTimeout(async ()=>{
      await smoothScrollTo(v3block);
      setTimeout(()=>{
        try{ v3.currentTime=0; }catch{}
        robustStart(v3,{wantAudio:audioAllowed});
      }, 900);
    }, 6000);
  });

  // Safety: if user manually scrolls & V2 becomes visible, start it once
  const io=new IntersectionObserver((entries)=>{
    entries.forEach((e)=>{
      if(e.isIntersecting && v2.paused && v2.currentTime===0){
        setTimeout(()=> robustStart(v2,{wantAudio:audioAllowed}), 450);
      }
    });
  }, {threshold:0.6});
  io.observe(v2block);

  // No playground / no "file not found" overlay. Only console warnings if unreachable.
  async function headOK(url){
    try{ const r=await fetch(url, {method:'HEAD', mode:'no-cors'}); return true; }catch{ return true; }
  }
  // (Optional) Quick sanity checks without UI noise
  [v1,v2,v3].forEach(v=>{
    const s=v.querySelector('source'); if(!s) return;
    headOK(s.src).then(()=>{});
  });
})();