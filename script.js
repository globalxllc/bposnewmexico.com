
(() => {
  const v1 = document.getElementById('v1');
  const v2 = document.getElementById('v2');
  const v3 = document.getElementById('v3');
  const nmMap = document.getElementById('nmMap');
  const hero = document.getElementById('stage-hero');
  const main = document.getElementById('stage-main');
  const intake = document.getElementById('intakeCard');
  const unmuteBtn = document.getElementById('unmuteBtn');

  let userInteracted = false;

  unmuteBtn.addEventListener('click', async () => {
    try {
      userInteracted = true;
      v1.currentTime = 0;
      v1.muted = false;
      await v1.play();
    } catch (e) {}
    unmuteBtn.classList.add('hidden');
  });

  v1.addEventListener('ended', () => {
    hero.classList.add('fade-out');
    setTimeout(() => {
      hero.classList.add('hidden');
      main.classList.remove('hidden');
      main.classList.add('fade-in');
      intake.classList.remove('hidden');
      intake.classList.add('fade-in');

      v2.classList.remove('hidden');
      v2.classList.add('fade-in');
      startWithBestEffortAudio(v2);
    }, 450);
  });

  v2.addEventListener('ended', () => {
    v2.classList.add('fade-out');
    setTimeout(() => {
      v2.classList.add('hidden');
      nmMap.classList.remove('hidden');
      nmMap.classList.add('zoom-in');
      setTimeout(() => {
        nmMap.classList.remove('zoom-in');
        nmMap.classList.add('fade-out');
        setTimeout(() => {
          nmMap.classList.add('hidden');
          v3.classList.remove('hidden');
          v3.classList.add('fade-in');
          startWithBestEffortAudio(v3);
        }, 600);
      }, 6000);
    }, 400);
  });

  async function startWithBestEffortAudio(videoEl){
    try{
      if(userInteracted){
        videoEl.muted = false;
        await videoEl.play();
      }else{
        videoEl.muted = false;
        await videoEl.play();
      }
    }catch(e){
      try{
        videoEl.muted = true;
        await videoEl.play();
        setTimeout(async () => {
          try{ videoEl.muted = false; await videoEl.play(); }catch(_){}
        }, 400);
      }catch(_e){}
    }
  }

  v1.addEventListener('volumechange', () => {
    if(!v1.muted){ userInteracted = true; unmuteBtn.classList.add('hidden'); }
  });
  main.addEventListener('transitionend', () => unmuteBtn.classList.add('hidden'));
})();
