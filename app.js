import * as THREE from 'three';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

// Settings
const root=document.documentElement,body=document.body;
const settingsBtn=$('#settingsBtn'),settingsPanel=$('#settingsPanel'),settingsClose=$('#settingsClose');
settingsBtn?.addEventListener('click',()=>settingsPanel.classList.toggle('open'));
settingsClose?.addEventListener('click',()=>settingsPanel.classList.remove('open'));
$('#themeToggle')?.addEventListener('change',e=>root.classList.toggle('light',e.target.checked));
$('#motionToggle')?.addEventListener('change',e=>body.classList.toggle('no-animation',e.target.checked));
$('#cursorToggle')?.addEventListener('change',e=>$('#cursorDot').classList.toggle('off',!e.target.checked));

// Cursor
const cursor=$('#cursorDot');
window.addEventListener('pointermove',e=>{if(cursor){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'}});
$$('a,button,input').forEach(el=>{el.addEventListener('mouseenter',()=>{if(cursor){cursor.style.width='34px';cursor.style.height='34px'}});el.addEventListener('mouseleave',()=>{if(cursor){cursor.style.width='18px';cursor.style.height='18px'}})});

// Reveal
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

// Project rail
const track=$('#projectTrack');
$('#nextProject')?.addEventListener('click',()=>track.scrollBy({left:Math.min(track.clientWidth*.75,520),behavior:'smooth'}));
$('#prevProject')?.addEventListener('click',()=>track.scrollBy({left:-Math.min(track.clientWidth*.75,520),behavior:'smooth'}));

// Portfolio assistant
const assistantPanel=$('#assistantPanel'),assistantMessages=$('#assistantMessages'),assistantInput=$('#assistantInput');
const openAssistant=()=>{assistantPanel.classList.add('open');setTimeout(()=>assistantInput?.focus(),80)};
$('#assistantLauncher')?.addEventListener('click',()=>assistantPanel.classList.toggle('open'));
$('#openAssistantHero')?.addEventListener('click',openAssistant);
$('#assistantClose')?.addEventListener('click',()=>assistantPanel.classList.remove('open'));
const facts={
  strongest:`OmniSprint is the strongest all-round portfolio project: it combines engineering signals from roadmaps, GitHub and CI to surface sprint risk, blockers and likely regressions. It placed Top 50 among 5,400+ entries and later won the Iteration Machine Special Prize at DSH Hacks V1.`,
  open:`Rohan has substantial open-source experience with Oppia and current work around TrueForge / TrueFoundry. At Oppia he worked on full-stack regressions, TypeScript strictness, API payload migrations, RTE behavior and documentation, with 12+ merged high-impact PRs and 14+ resolved issues.`,
  achievements:`Highlights include Global Rank 57 in TCS CodeVita, Global Rank 87 in Yandex CodeRun, Rank 8 in Unstop's Top 100 Unstoppable E-School Leaders, Top 100 in ZS Campus Beats, selection for Amazon ML Summer School 2025, and multiple hackathon wins / special prizes.`,
  hire:`Rohan is strongest when a problem crosses product and engineering boundaries. He has evidence of shipping in open source, working with real-time computer vision, building developer tooling, debugging product behavior, and competing at a high algorithmic level.`,
  bel:`At Bharat Electronics Limited, Rohan worked on road-scene accident detection using YOLO and DenseNet-style vision pipelines, with reported results around 88% detection accuracy, 0.92 F1 and 180 ms/frame.`,
  skills:`His toolkit includes C++, Python, Java, JavaScript / TypeScript, SQL, React, FastAPI, Flask, Node.js, Postgres, Docker, Git/GitHub, ML/vision tooling, MQTT and CI workflows.`,
  education:`Rohan is pursuing a B.E. in Computer Engineering at Thapar Institute of Engineering & Technology, graduating in 2027.`
};
function replyFor(q){const s=q.toLowerCase();if(s.includes('strong')||s.includes('best project')||s.includes('omnisprint'))return facts.strongest;if(s.includes('open source')||s.includes('oppia')||s.includes('trueforge')||s.includes('truefoundry'))return facts.open;if(s.includes('achievement')||s.includes('rank')||s.includes('award')||s.includes('codevita')||s.includes('yandex')||s.includes('unstop'))return facts.achievements;if(s.includes('hire')||s.includes('why rohan')||s.includes('strength'))return facts.hire;if(s.includes('bharat')||s.includes('bel')||s.includes('vision'))return facts.bel;if(s.includes('skill')||s.includes('stack')||s.includes('language'))return facts.skills;if(s.includes('college')||s.includes('education')||s.includes('thapar')||s.includes('tiet'))return facts.education;if(s.includes('contact')||s.includes('email'))return `You can reach Rohan via LinkedIn or GitHub from the Contact section, or email rohanmalhotracodes@gmail.com.`;return `Rohan's profile centers on open-source product engineering, developer tools, computer vision, systems behavior and competitive programming. Ask me about a specific project, company, rank, skill or contribution and I'll narrow it down.`}
function addMessage(text,type='bot'){const el=document.createElement('div');el.className='message '+type;el.textContent=text;assistantMessages.appendChild(el);assistantMessages.scrollTop=assistantMessages.scrollHeight}
$('#assistantForm')?.addEventListener('submit',e=>{e.preventDefault();const q=assistantInput.value.trim();if(!q)return;addMessage(q,'user');assistantInput.value='';setTimeout(()=>addMessage(replyFor(q),'bot'),180)});
$$('.assistant-suggestions button').forEach(btn=>btn.addEventListener('click',()=>{openAssistant();const q=btn.dataset.q;addMessage(q,'user');setTimeout(()=>addMessage(replyFor(q),'bot'),140)}));

function makeCity(canvas,expanded=false){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.background=new THREE.Color(expanded?0x05070a:0x0d1115);scene.fog=new THREE.Fog(expanded?0x05070a:0x0d1115,10,expanded?48:34);
  const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(expanded?11:9,expanded?10:8,expanded?14:12);camera.lookAt(0,1,0);
  scene.add(new THREE.AmbientLight(0x9ab8c8,1.5));const sun=new THREE.DirectionalLight(0xe8ffb0,3);sun.position.set(6,12,8);scene.add(sun);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(34,34),new THREE.MeshStandardMaterial({color:expanded?0x0d1116:0x11171c,roughness:.95,metalness:.05}));ground.rotation.x=-Math.PI/2;ground.position.y=-.02;scene.add(ground);
  const grid=new THREE.GridHelper(34,34,0x33414a,0x1b252b);grid.position.y=.002;scene.add(grid);
  const group=new THREE.Group();scene.add(group);
  const colors=[0xdff36a,0x72d9e6,0x99a5ff,0xd3d7db,0x8ee5a1];
  const positions=[[-5,-4],[-2,-4],[2,-4],[5,-4],[-5,0],[-2,0],[2,0],[5,0],[-5,4],[-2,4],[2,4],[5,4]];
  positions.forEach((p,i)=>{const h=1.1+((i*17)%7)*.55;const w=1.5+(i%3)*.25;const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),new THREE.MeshStandardMaterial({color:colors[i%colors.length],roughness:.48,metalness:.15,emissive:colors[i%colors.length],emissiveIntensity:.025}));mesh.position.set(p[0],h/2,p[1]);mesh.userData.baseY=mesh.position.y;group.add(mesh);const cap=new THREE.Mesh(new THREE.BoxGeometry(w*.62,.12,w*.62),new THREE.MeshBasicMaterial({color:0xf4f0df}));cap.position.set(p[0],h+.08,p[1]);group.add(cap)});
  const roadMat=new THREE.MeshStandardMaterial({color:0x171c20,roughness:1});for(let x=-4;x<=4;x+=4){const r=new THREE.Mesh(new THREE.BoxGeometry(.9,.04,30),roadMat);r.position.set(x,.01,0);scene.add(r)}for(let z=-2;z<=2;z+=4){const r=new THREE.Mesh(new THREE.BoxGeometry(30,.04,.9),roadMat);r.position.set(0,.012,z);scene.add(r)}
  let dragging=false,lastX=0,lastY=0,targetRotY=-.45,targetRotX=-.18;canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointermove',e=>{if(!dragging)return;targetRotY+=(e.clientX-lastX)*.006;targetRotX+=(e.clientY-lastY)*.004;lastX=e.clientX;lastY=e.clientY});canvas.addEventListener('wheel',e=>{camera.position.multiplyScalar(e.deltaY>0?1.06:.94);camera.position.clampLength(7,28);e.preventDefault()},{passive:false});
  let t=0;function resize(){const rect=canvas.getBoundingClientRect();if(canvas.width!==Math.floor(rect.width*renderer.getPixelRatio())||canvas.height!==Math.floor(rect.height*renderer.getPixelRatio())){renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/Math.max(rect.height,1);camera.updateProjectionMatrix()}}
  function loop(){requestAnimationFrame(loop);resize();t+=.008;group.rotation.y+=(targetRotY-group.rotation.y)*.035;group.rotation.x+=(targetRotX-group.rotation.x)*.035;group.children.forEach((m,i)=>{if(m.geometry?.type==='BoxGeometry'&&m.userData.baseY)m.position.y=m.userData.baseY+Math.sin(t*2+i)*.025});renderer.render(scene,camera)}loop();return{renderer,scene,camera,group};
}
const heroCanvas=$('#heroCanvas');if(heroCanvas)makeCity(heroCanvas,false);
let cityInstance=null;const cityModal=$('#cityModal');
function showCity(){cityModal.classList.add('open');if(!cityInstance)cityInstance=makeCity($('#cityCanvas'),true)}
$('#openCity')?.addEventListener('click',showCity);$('#closeCity')?.addEventListener('click',()=>cityModal.classList.remove('open'));window.addEventListener('keydown',e=>{if(e.key==='Escape'){cityModal.classList.remove('open');assistantPanel.classList.remove('open');settingsPanel.classList.remove('open')}});
