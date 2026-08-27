const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement,settings=$('#settings');
const settingsOpen=$('#settingsOpen'),brightMode=$('#brightMode'),darkMode=$('#darkMode'),motionToggle=$('#motionToggle');
const setTheme=theme=>{
  const dark=theme==='dark';
  root.classList.toggle('dark',dark);
  brightMode.classList.toggle('active',!dark);
  darkMode.classList.toggle('active',dark);
  localStorage.setItem('portfolio-theme',dark?'dark':'bright');
};
setTheme(localStorage.getItem('portfolio-theme')==='dark'?'dark':'bright');
const motionEnabled=localStorage.getItem('portfolio-motion')!=='off';
root.classList.toggle('background-still',!motionEnabled);motionToggle.checked=motionEnabled;
settingsOpen.addEventListener('click',()=>{const open=settings.classList.toggle('open');settingsOpen.setAttribute('aria-expanded',String(open))});
$('#settingsClose').addEventListener('click',()=>{settings.classList.remove('open');settingsOpen.setAttribute('aria-expanded','false')});
brightMode.addEventListener('click',()=>setTheme('bright'));
darkMode.addEventListener('click',()=>setTheme('dark'));
motionToggle.addEventListener('change',event=>{root.classList.toggle('background-still',!event.target.checked);localStorage.setItem('portfolio-motion',event.target.checked?'on':'off')});
addEventListener('keydown',e=>{if(e.key==='Escape'){settings.classList.remove('open');settingsOpen.setAttribute('aria-expanded','false')}});

const rail=$('#projectRail');
$('#projectNext').addEventListener('click',()=>rail.scrollBy({left:366,behavior:'smooth'}));
$('#projectPrev').addEventListener('click',()=>rail.scrollBy({left:-366,behavior:'smooth'}));

const navLinks=$$('.header nav a[href^="#"]');
const navTargets=navLinks.map(link=>({link,target:$(link.getAttribute('href'))})).filter(item=>item.target);
let spyFrame=0;
const updateActiveNav=()=>{
  const marker=scrollY+$('.header').offsetHeight+48;
  let current=navTargets[0];
  navTargets.forEach(item=>{if(item.target.getBoundingClientRect().top+scrollY<=marker)current=item});
  navLinks.forEach(link=>link.classList.toggle('active',link===current.link));
  spyFrame=0;
};
const requestNavUpdate=()=>{if(!spyFrame)spyFrame=requestAnimationFrame(updateActiveNav)};
addEventListener('scroll',requestNavUpdate,{passive:true});
addEventListener('resize',requestNavUpdate,{passive:true});
updateActiveNav();

const contactForm=$('#contactForm');
if(contactForm){contactForm.addEventListener('submit',async event=>{
  event.preventDefault();
  const first=$('#contactFirstName').value.trim(),last=$('#contactLastName').value.trim(),email=$('#contactEmail').value.trim(),message=$('#contactMessage').value.trim();
  const status=$('#formStatus'),submit=contactForm.querySelector('button[type="submit"]');
  status.textContent='SENDING MESSAGE…';submit.disabled=true;
  try{
    const response=await fetch('https://formsubmit.co/ajax/rohanmalhotra430@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:`${first} ${last}`,email,message,_subject:`Portfolio message from ${first} ${last}`})});
    if(!response.ok)throw new Error('Submission failed');
    contactForm.reset();status.textContent='MESSAGE SENT — THANK YOU.';
  }catch(error){
    status.textContent='MESSAGE COULD NOT BE SENT. PLEASE TRY AGAIN.';
  }finally{submit.disabled=false}
});}

const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%#@';
const name=$('#heroName'),finalText=name.dataset.text;
let frame=0;
function scramble(){const progress=frame/20;name.innerHTML=[...finalText].map((c,i)=>c==='|'?'<br>':i<finalText.length*progress?c:alphabet[Math.floor(Math.random()*alphabet.length)]).join('');frame++;if(frame<=20)requestAnimationFrame(scramble)}
setTimeout(scramble,180);

// Render the bundled snapshot immediately, then replace it with the scheduled refresh.
const calendar=$('#contributionCalendar'),months=$('#calendarMonths');
const formatActivityDate=date=>new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).toUpperCase();
const renderCalendar=days=>{
  if(!calendar||!days.length)return;
  calendar.replaceChildren();months.replaceChildren();
  const monthNames=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const displayYear=new Date(`${days.at(-1).date}T00:00:00Z`).getUTCFullYear();
  let lastMonth=-1,lastYear=-1;
  days.forEach(({date,level,count},index)=>{
    const day=new Date(`${date}T00:00:00Z`);
    const cell=document.createElement('i');cell.dataset.level=level;cell.title=`${formatActivityDate(date)} · ${Number(count)||0} contribution${Number(count)===1?'':'s'}`;calendar.appendChild(cell);
    if(day.getUTCFullYear()===displayYear&&(day.getUTCFullYear()!==lastYear||day.getUTCMonth()!==lastMonth)){
      const label=document.createElement('span');label.textContent=monthNames[day.getUTCMonth()];label.style.left=(Math.floor(index/7)*14)+'px';months.appendChild(label);lastMonth=day.getUTCMonth();
      lastYear=day.getUTCFullYear();
    }
  });
};
const renderContributionMix=mix=>{
  if(!mix)return;
  const values={commits:Number(mix.commits)||0,pullRequests:Number(mix.pullRequests)||0,issues:Number(mix.issues)||0,codeReviews:Number(mix.codeReviews)||0};
  Object.entries(values).forEach(([metric,value])=>{const label=$(`[data-metric="${metric}"]`);if(label)label.textContent=`${value}%`});
  const points=[[260-1.2*values.commits,150],[260,150+1.08*values.pullRequests],[260+1.2*values.issues,150],[260,150-1.08*values.codeReviews]];
  const radar=$('.contribution-radar'),area=$('.radar-area',radar),circles=$$('.radar-points circle',radar);
  area.setAttribute('d',`M${points.map(point=>point.map(value=>value.toFixed(1)).join(' ')).join(' L')}Z`);
  points.forEach(([x,y],index)=>{circles[index]?.setAttribute('cx',x.toFixed(1));circles[index]?.setAttribute('cy',y.toFixed(1))});
  radar.setAttribute('aria-label',`Contribution mix: ${values.commits} percent commits, ${values.pullRequests} percent pull requests, ${values.issues} percent issues and ${values.codeReviews} percent code reviews`);
};
if(calendar){
  const start=new Date(`${calendar.dataset.start}T00:00:00Z`);
  const fallbackDays=[...(calendar.dataset.levels||'')].map((level,index)=>{const day=new Date(start);day.setUTCDate(start.getUTCDate()+index);return{date:day.toISOString().slice(0,10),level:Number(level),count:0}});
  renderCalendar(fallbackDays);
  const activityCacheKey=Math.floor(Date.now()/3600000);
  fetch(`assets/data/github-activity.json?v=${activityCacheKey}`,{cache:'no-store'})
    .then(response=>{if(!response.ok)throw new Error('Activity refresh unavailable');return response.json()})
    .then(activity=>{
      if(!Array.isArray(activity.days)||!activity.days.length)return;
      renderCalendar(activity.days);
      $('#githubCalendarTitle').textContent=`CONTRIBUTION CALENDAR · ${activity.year}`;
      $('#githubCalendarRange').textContent=`${formatActivityDate(activity.rangeStart)} — ${formatActivityDate(activity.rangeEnd)}`;
      const summary=[];
      if(Number.isFinite(activity.totalContributions))summary.push(`${activity.totalContributions} CONTRIBUTIONS`);
      if(Number.isFinite(activity.repositoryCount))summary.push(`${activity.repositoryCount} REPOSITORIES`);
      if(summary.length)$('#githubContributionSummary').textContent=summary.join(' · ');
      renderContributionMix(activity.mix);
    })
    .catch(()=>{});
}

const headerEyes=$$('#headerEyes .header-eye');
if(headerEyes.length&&matchMedia('(pointer:fine)').matches){
  let pointerX=0,pointerY=0,eyeFrame=0;
  const updateEyes=()=>{
    headerEyes.forEach(eye=>{
      const rect=eye.getBoundingClientRect();
      const dx=pointerX-(rect.left+rect.width/2),dy=pointerY-(rect.top+rect.height/2);
      const distance=Math.hypot(dx,dy)||1,travel=Math.min(4,distance);
      eye.style.setProperty('--eye-x',`${dx/distance*travel}px`);
      eye.style.setProperty('--eye-y',`${dy/distance*travel}px`);
    });
    eyeFrame=0;
  };
  addEventListener('pointermove',event=>{
    pointerX=event.clientX;pointerY=event.clientY;
    if(!eyeFrame)eyeFrame=requestAnimationFrame(updateEyes);
  },{passive:true});
  document.documentElement.addEventListener('mouseleave',()=>headerEyes.forEach(eye=>{
    eye.style.setProperty('--eye-x','0px');eye.style.setProperty('--eye-y','0px');
  }));
}
