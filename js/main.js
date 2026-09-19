const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---- preloader ---- */
const preloader=document.getElementById('preloader'),preloaderFill=document.getElementById('preloaderFill');
requestAnimationFrame(()=>{preloaderFill.style.width='100%'});
addEventListener('load',()=>{
  setTimeout(()=>preloader.classList.add('done'),1700);
  setTimeout(()=>{document.querySelectorAll('.hero h1 .line').forEach((l,i)=>{setTimeout(()=>l.classList.add('in'),250+i*200)})},1900);
});

/* ---- cursor ---- */
const cursor=document.getElementById('cursor');
let cx=0,cy=0,mx=0,my=0;
if(cursor&&matchMedia('(pointer:fine)').matches&&!reduced){
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  document.addEventListener('mousedown',()=>cursor.classList.add('click'));
  document.addEventListener('mouseup',()=>cursor.classList.remove('click'));
  const hov='a,button,.inco-item,.city,.svc-block,.tags li,.btn';
  document.querySelectorAll(hov).forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
  });
  (function anim(){cx+=(mx-cx)*.14;cy+=(my-cy)*.14;cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(anim)})();
}else if(cursor)cursor.style.display='none';

/* ---- smooth scroll ---- */
let sT=scrollY,sC=scrollY,scrolling=false;
const lerp=(a,b,t)=>a+(b-a)*t;
if(!reduced){
  addEventListener('wheel',e=>{e.preventDefault();sT=Math.max(0,Math.min(sT+e.deltaY,document.body.scrollHeight-innerHeight));if(!scrolling)sLoop()},{passive:false});
  document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();sT=t.offsetTop-40;if(!scrolling)sLoop()}})});
  let ts=0;
  addEventListener('touchstart',e=>{ts=e.touches[0].clientY},{passive:true});
  addEventListener('touchmove',e=>{const d=ts-e.touches[0].clientY;ts=e.touches[0].clientY;sT=Math.max(0,Math.min(sT+d*1.5,document.body.scrollHeight-innerHeight));if(!scrolling)sLoop()},{passive:true});
  function sLoop(){scrolling=true;sC=lerp(sC,sT,.078);if(Math.abs(sC-sT)<.5){sC=sT;scrolling=false}scrollTo(0,sC);if(scrolling)requestAnimationFrame(sLoop)}
  addEventListener('scroll',()=>{if(!scrolling){sT=scrollY;sC=scrollY}},{passive:true});
}

/* ---- nav ---- */
addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>20),{passive:true});
const burger=document.getElementById('burger'),navLinks=document.getElementById('navLinks');
burger.addEventListener('click',()=>{const o=navLinks.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

/* ---- reveals ---- */
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));

/* ---- hero parallax ---- */
const heroSky=document.getElementById('heroSky'),heroGrid=document.getElementById('heroGrid'),cWrap=document.getElementById('containersWrap');
if(!reduced)addEventListener('scroll',()=>{const y=Math.min(scrollY,innerHeight*1.2),p=y/innerHeight;heroSky.style.transform=`translate3d(0,${-y*.48}px,0) scale(${1+p*.14})`;heroGrid.style.transform=`translate3d(0,${-y*.3}px,0)`;heroGrid.style.opacity=Math.max(0,.25-p*.4);cWrap.style.transform=`translate3d(0,${y*.4}px,0)`},{passive:true});

/* ---- counters ---- */
function animC(el){const t=+el.dataset.target,s=el.dataset.suffix,dur=1300,st=performance.now();function tick(n){const e=Math.min((n-st)/dur,1),ez=e===1?1:1-Math.pow(2,-10*e),v=Math.round(ez*t);el.textContent=v;if(s)el.innerHTML=v+'<span class="suffix">'+s+'</span>';if(e<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}
const sNums=document.querySelectorAll('.stat-num[data-target]');let sCounted=false;
const sObs=new IntersectionObserver(es=>{if(sCounted)return;es.forEach(e=>{if(e.isIntersecting){sCounted=true;sNums.forEach((c,i)=>setTimeout(()=>animC(c),i*100));sObs.disconnect()}})},{threshold:.5});
sNums.forEach(c=>sObs.observe(c));

/* ---- servicios scrollspy ---- */
const svcNum=document.getElementById('svcNum'),svcTitle=document.getElementById('svcTitle');
const svcBtns=[...document.querySelectorAll('#svcProgress button')];
const svcBlocks=[...document.querySelectorAll('.svc-block')];
let curSvc=null;
function setSvc(b){if(!b||b===curSvc)return;curSvc=b;svcNum.style.opacity=0;svcTitle.style.opacity=0;setTimeout(()=>{svcNum.textContent=b.dataset.num;svcTitle.textContent=b.dataset.title;svcNum.style.opacity=1;svcTitle.style.opacity=1},180);svcBtns.forEach(bt=>bt.classList.toggle('active',bt.dataset.target===b.id));svcBlocks.forEach(bl=>bl.classList.remove('in-view'));b.classList.add('in-view')}
function svcSpy(){const vc=innerHeight/2;let cl=null,cd=1e9;svcBlocks.forEach(b=>{const r=b.getBoundingClientRect(),c=r.top+r.height/2,d=Math.abs(c-vc);if(d<cd){cd=d;cl=b}});if(cl){const r=cl.getBoundingClientRect();if(r.bottom>vc*.35&&r.top<vc*1.65)setSvc(cl)}}
addEventListener('scroll',svcSpy,{passive:true});setTimeout(svcSpy,200);
svcBtns.forEach(b=>b.addEventListener('click',()=>{const el=document.getElementById(b.dataset.target);if(!reduced){sT=el.offsetTop-innerHeight/2+el.offsetHeight/2;if(!scrolling)sLoop()}else el.scrollIntoView({behavior:'smooth',block:'center'})}));

/* ---- incoterms gauge ---- */
const gCode=document.getElementById('gCode'),gName=document.getElementById('gName'),gFill=document.getElementById('gFill'),gNote=document.getElementById('gNote'),gPct=document.getElementById('gPct');
const incoItems=[...document.querySelectorAll('.inco-item')];let curInco=incoItems[0];
function pL(v){if(v<=10)return'Responsabilidad mínima';if(v<=45)return'Hasta el embarque';if(v<=70)return'Flete principal incluido';if(v<100)return'Hasta destino';return'Responsabilidad total'}
function setInco(it){if(!it||it===curInco)return;curInco=it;incoItems.forEach(i=>i.classList.remove('active'));it.classList.add('active');gCode.style.opacity=0;gName.style.opacity=0;gNote.style.opacity=0;setTimeout(()=>{gCode.textContent=it.dataset.code;gName.textContent=it.dataset.name;gNote.textContent=it.dataset.note;gPct.textContent=pL(+it.dataset.fill);gCode.style.opacity=1;gName.style.opacity=1;gNote.style.opacity=1},160);gFill.style.width=it.dataset.fill+'%'}
function incoSpy(){const vc=innerHeight/2;let cl=null,cd=1e9;incoItems.forEach(it=>{const r=it.getBoundingClientRect(),c=r.top+r.height/2,d=Math.abs(c-vc);if(d<cd){cd=d;cl=it}});if(cl){const r=cl.getBoundingClientRect();if(r.bottom>vc*.3&&r.top<vc*1.7)setInco(cl)}}
addEventListener('scroll',incoSpy,{passive:true});
incoItems.forEach(i=>{i.addEventListener('click',()=>setInco(i));i.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setInco(i)}})});
gFill.style.width='6%';

/* ---- city radial glow ---- */
document.querySelectorAll('.city:not(.hq)').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)/r.width*100+'%');c.style.setProperty('--my',(e.clientY-r.top)/r.height*100+'%')})});
