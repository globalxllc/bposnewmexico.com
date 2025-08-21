
(function(){
  const cfg = (window.APP_CONFIG || {});
  const $ = s=>document.querySelector(s);
  $("#v1").src = cfg.VIDEO_1; $("#v2").src = cfg.VIDEO_2; $("#v3").src = cfg.VIDEO_3;

  // Hero unmute behavior
  const heroVid = $("#v1"), unmute = $("#unmuteBtn");
  heroVid.muted = true; heroVid.playsInline = true; heroVid.autoplay = true;
  heroVid.addEventListener("canplay", ()=>heroVid.play().catch(()=>{}));
  unmute.addEventListener("click", ()=>{ try{heroVid.currentTime=0;}catch(e){} heroVid.muted=false; heroVid.play().catch(()=>{}); unmute.classList.add("hidden"); });

  // In-view autoplay + delayed unmute for V2/V3
  function hook(vid, delay=2500){
    vid.muted = true; vid.playsInline = true;
    const io = new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting){ vid.play().catch(()=>{}); setTimeout(()=>{ try{vid.muted=false;}catch(_){}} , delay); }
        else { vid.pause(); }
      });
    }, {threshold:.6});
    io.observe(vid);
  }
  hook($("#v2"), 2500); hook($("#v3"), 2500);

  // Form submit with endpoint or mailto fallback
  const form = $("#bpoForm"), note=$("#formNotice");
  form.addEventListener("submit", async ev=>{
    ev.preventDefault(); if(note) note.textContent="Submitting...";
    const fd = new FormData(form);
    if(cfg.FORM_ENDPOINT){
      try{
        const r = await fetch(cfg.FORM_ENDPOINT,{method:"POST", body:fd, headers:{'Accept':'application/json'}});
        if(!r.ok) throw 0; if(note) note.textContent="Submitted!"; form.reset();
      }catch(e){
        if(note) note.textContent="Failed. Opening email..."; email(fd);
      }
    }else email(fd);
  });
  function email(fd){
    const to = encodeURIComponent(cfg.FALLBACK_EMAIL||"orders@example.com");
    const subject = encodeURIComponent("New BPO Intake Request");
    const lines=[]; for(const [k,v] of fd.entries()){ if(k==="attachments") continue; lines.push(`${k}: ${v}`); }
    lines.push("", "(Attachments not included via mailto.)");
    const body = encodeURIComponent(lines.join("\n"));
    location.href=`mailto:${to}?subject=${subject}&body=${body}`;
    if(document.getElementById("formNotice")) document.getElementById("formNotice").textContent="Opened your email app with the details.";
  }
})();
