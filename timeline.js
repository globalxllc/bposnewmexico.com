// Robust no-scroll timeline: v1 -> v2 -> map (6s) -> v3
(function(){
  const stage = document.getElementById('stage');
  const startBtn = document.getElementById('startBtn');
  const unmuteBtn = document.getElementById('unmuteBtn');
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const v3 = document.getElementById('v3');
  const map = document.getElementById('map');

  const show = el => {
    [v1,v2,v3,map].forEach(n => n.classList.remove('media-active'));
    el.classList.add('media-active');
  };

  // Guard: ensure stage is visible even before media loads
  stage.style.minHeight = '60vh';

  let audioUnlocked = false;

  async function playVideo(video, {restart=false, unmute=false}={}){
    try{
      if(restart) video.currentTime = 0;
      if(unmute) video.muted = false;
      await video.play();
      return true;
    }catch(e){
      console.warn('Play blocked:', e);
      return false;
    }
  }

  // Clicking Start ensures we have a user gesture for future playback
  startBtn.addEventListener('click', async ()=>{
    startBtn.style.display='none';
    show(v1);
    // Keep v1 muted but visible; show custom big unmute button
    unmuteBtn.style.display = 'block';
    // Autoplay muted v1 as a visual cue
    await playVideo(v1, {restart:true, unmute:false});
  });

  // Big unmute: unlock audio & restart v1
  unmuteBtn.addEventListener('click', async ()=>{
    await v1.pause();
    v1.muted = false;
    audioUnlocked = true;
    unmuteBtn.style.display = 'none';
    await playVideo(v1, {restart:true, unmute:true});
  });

  // When v1 ends -> wait 0.8s -> v2 (unmuted if unlocked)
  v1.addEventListener('ended', async ()=>{
    setTimeout(async ()=>{
      show(v2);
      v2.muted = !audioUnlocked;
      await playVideo(v2, {restart:true, unmute:audioUnlocked});
    }, 800);
  });

  // When v2 ends -> map 6s -> v3 (3s delay)
  v2.addEventListener('ended', ()=>{
    show(map);
    setTimeout(async ()=>{
      show(v3);
      v3.muted = !audioUnlocked;
      // Small pre-delay to be sure UI settled
      setTimeout(()=>{
        playVideo(v3, {restart:true, unmute:audioUnlocked});
      }, 300);
    }, 6000);
  });

  // If user reloads mid-way and clicks inside the stage, reveal Start
  stage.addEventListener('click', ()=>{
    if (startBtn.style.display !== 'none' && !v1.classList.contains('media-active')) {
      startBtn.style.display='block';
    }
  });

  // Safety: if nothing clicked, still show Start
  window.addEventListener('load', ()=>{
    startBtn.style.display='block';
    show(v1);
  });
})();
