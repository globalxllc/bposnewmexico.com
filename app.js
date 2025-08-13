
(() => {
  const qs = sel => document.querySelector(sel);

  // DOM
  const gate = qs('#gate');
  const startBtn = qs('#startBtn');

  const stageV1 = qs('#stageV1');
  const v1 = qs('#video1');
  const unmuteBtn = qs('#unmuteBtn');

  const app = qs('#app');
  const leftCol = qs('#leftCol');
  const v2Wrap = qs('#v2Wrap');
  const v2 = qs('#video2');
  const mapWrap = qs('#mapWrap');
  const v3Wrap = qs('#v3Wrap');
  const v3 = qs('#video3');
  const intakeWrap = qs('#intakeWrap');

  let userUnmuted = false;

  // Helpers
  const show = el => { el.classList.remove('hidden'); el.classList.add('show'); };
  const hide = el => { el.classList.remove('show'); el.classList.add('hidden'); };

  // Start experience (user gesture)
  startBtn.addEventListener('click', async () => {
    hide(gate);
    show(stageV1);
    unmuteBtn.classList.remove('hidden'); // show blue unmute button
    try {
      await v1.play();
    } catch (e) {
      console.info('V1 play blocked until user interacts');
    }
  });

  // Unmute & restart V1
  unmuteBtn.addEventListener('click', async () => {
    userUnmuted = true;
    v1.pause();
    v1.currentTime = 0;
    v1.muted = false;
    try {
      await v1.play();
    } catch(e){}
  });

  // When V1 ends, fade to two-column app
  v1.addEventListener('ended', () => {
    hide(stageV1);
    show(app);
    // Show V2 first
    nextV2();
  });

  function nextV2(){
    show(v2Wrap);
    // Set V2 audio state based on userUnmuted
    v2.muted = !userUnmuted;
    v2.currentTime = 0;
    v2.play().catch(()=>{});

    v2.onended = () => {
      // After V2 -> Map
      hide(v2Wrap);
      show(mapWrap);
      // Reveal intake slightly later so it's not immediate
      setTimeout(() => show(intakeWrap), 800);
      // Hold map for 6s
      setTimeout(() => {
        hide(mapWrap);
        nextV3();
      }, 6000);
    };
  }

  function nextV3(){
    show(v3Wrap);
    v3.muted = !userUnmuted;
    v3.currentTime = 0;
    v3.play().catch(()=>{});
  }

  // Prevent form submission navigation
  const form = qs('#intake');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('BPO Request submitted. (Wire this up to your backend/email).');
  });
})();
