const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement,settings=$('#settings');
$('#settingsOpen').addEventListener('click',()=>settings.classList.toggle('open'));
$('#settingsClose').addEventListener('click',()=>settings.classList.remove('open'));
$('#motionToggle').addEventListener('change',e=>root.classList.toggle('still',!e.target.checked));
$('#themeToggle').addEventListener('change',e=>root.classList.toggle('dark',e.target.checked));
addEventListener('keydown',e=>{if(e.key==='Escape'){settings.classList.remove('open');$('#chatPop').classList.remove('open')}});

const rail=$('#projectRail');
$('#projectNext').addEventListener('click',()=>rail.scrollBy({left:366,behavior:'smooth'}));
$('#projectPrev').addEventListener('click',()=>rail.scrollBy({left:-366,behavior:'smooth'}));
let dragging=false,startX=0,startScroll=0;
rail.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;startScroll=rail.scrollLeft;rail.setPointerCapture?.(e.pointerId)});
rail.addEventListener('pointermove',e=>{if(dragging)rail.scrollLeft=startScroll-(e.clientX-startX)});
rail.addEventListener('pointerup',()=>dragging=false);rail.addEventListener('pointercancel',()=>dragging=false);

const chat=$('#chatPop');$('#chatButton').addEventListener('click',()=>chat.classList.toggle('open'));$('#chatClose').addEventListener('click',()=>chat.classList.remove('open'));

const navLinks=$$('.header nav a[href^="#"]');
const sections=$$('section[id],#top');
const spy=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id))}}),{rootMargin:'-42% 0px -52%'});sections.forEach(s=>spy.observe(s));

const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%#@';
const name=$('#heroName'),finalText=name.dataset.text;
let frame=0;
function scramble(){if(root.classList.contains('still')){name.innerHTML=finalText.replace('|','<br>');return}const progress=frame/20;name.innerHTML=[...finalText].map((c,i)=>c==='|'?'<br>':i<finalText.length*progress?c:alphabet[Math.floor(Math.random()*alphabet.length)]).join('');frame++;if(frame<=20)requestAnimationFrame(scramble)}
setTimeout(scramble,180);

// Verified public GitHub contribution calendar snapshot (25 Aug 2026).
const calendar=$('#contributionCalendar'),months=$('#calendarMonths');
if(calendar){
  const levels=calendar.dataset.levels||'',start=new Date(calendar.dataset.start+'T00:00:00Z');
  const monthNames=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  let lastMonth=-1;
  [...levels].forEach((level,index)=>{
    const day=new Date(start);day.setUTCDate(start.getUTCDate()+index);
    const cell=document.createElement('i');cell.dataset.level=level;cell.title=`${day.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'})} · activity level ${level}`;calendar.appendChild(cell);
    if(day.getUTCMonth()!==lastMonth&&day.getUTCDate()<=7){
      const label=document.createElement('span');label.textContent=monthNames[day.getUTCMonth()];label.style.left=(Math.floor(index/7)*14)+'px';months.appendChild(label);lastMonth=day.getUTCMonth();
    }
  });
}
