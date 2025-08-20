const isEdge = navigator.userAgent.includes('Edg'); if(isEdge) document.body.classList.add('edge');
const v1=document.getElementById('v1'), v2=document.getElementById('v2'), v3=document.getElementById('v3');
const unmuteBtn=document.getElementById('unmuteBtn');
const scene2=document.getElementById('scene2'), sceneMap=document.getElementById('sceneMap'), scene3=document.getElementById('scene3');
const mapImg=document.getElementById('mapImg'); let audioAllowed=false;
function scrollToEl(el){el.scrollIntoView({behavior:'smooth',block:'start'})}
function safePlay(v){if(!v) return; const p=v.play(); if(p&&p.catch) p.catch(()=>{});}
unmuteBtn.addEventListener('click',()=>{audioAllowed=true; try{v1.currentTime=0;}catch(e){} v1.muted=false; unmuteBtn.style.display='none'; safePlay(v1);},{passive:true});
window.addEventListener('pointerdown',()=>{ if(!audioAllowed) return; unmuteBtn.style.display='none'; },{passive:true});
let movedToScene2=false;
v1.addEventListener('ended',()=>{ if(movedToScene2) return; movedToScene2=true; setTimeout(()=>{ scrollToEl(scene2); setTimeout(()=>{ v2.currentTime=0; v2.muted=!audioAllowed; safePlay(v2); if(audioAllowed) setTimeout(()=>{ v2.muted=false; },300); },300); },150); });
document.addEventListener('keydown',(e)=>{ if(e.key===' '&&!movedToScene2){ movedToScene2=true; scrollToEl(scene2);} });
let movedToMap=false;
v2.addEventListener('timeupdate',()=>{ const pct=v2.currentTime/(v2.duration||1); if(!movedToMap&&pct>0.98){ movedToMap=true; toMap(); } });
setTimeout(()=>{ if(!movedToMap){ movedToMap=true; toMap(); } },20000);
function toMap(){ scrollToEl(sceneMap); mapImg.style.animation='none'; mapImg.offsetHeight; mapImg.style.animation=''; setTimeout(()=>{ scrollToEl(scene3); setTimeout(()=>{ v3.currentTime=0; v3.muted=!audioAllowed; safePlay(v3); if(audioAllowed) setTimeout(()=>{ v3.muted=false; },300); },400); },6000); }
['loadedmetadata','resize','orientationchange'].forEach(ev=>{ window.addEventListener(ev,()=>{ [v1,v2,v3].forEach(v=>{ if(!v) return; v.style.maxHeight=`${window.innerHeight*0.8}px`; }); }); });
document.addEventListener('wheel',(e)=>{ if(Math.abs(e.deltaX)>Math.abs(e.deltaY)) e.preventDefault(); },{passive:false});