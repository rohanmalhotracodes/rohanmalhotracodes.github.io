const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

// ---- Settings + navigation ----
const settings=$('#settingsPanel'),settingsBtn=$('#settingsBtn'),settingsClose=$('#settingsClose');
settingsBtn?.addEventListener('click',()=>settings.classList.toggle('open'));settingsClose?.addEventListener('click',()=>settings.classList.remove('open'));
$('#themeToggle')?.addEventListener('change',e=>document.documentElement.classList.toggle('light',e.target.checked));
$('#motionToggle')?.addEventListener('change',e=>document.body.classList.toggle('no-animation',!e.target.checked));
$('#cursorToggle')?.addEventListener('change',e=>$('.cursor-dot')?.classList.toggle('off',!e.target.checked));

const dot=$('.cursor-dot');window.addEventListener('pointermove',e=>{if(dot){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:document.body.classList.contains('no-animation')?'auto':'smooth'})}}));

// ---- Reveal motion ----
const io=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.12});$$('.reveal').forEach(x=>io.observe(x));

// ---- Project carousel ----
const track=$('#projectTrack');$('#projectPrev')?.addEventListener('click',()=>track?.scrollBy({left:-Math.min(520,innerWidth*.7),behavior:'smooth'}));$('#projectNext')?.addEventListener('click',()=>track?.scrollBy({left:Math.min(520,innerWidth*.7),behavior:'smooth'}));

// ---- 3D engineering world (original scene, inspired by interactive portfolio cities) ----
let THREE,heroRenderer,heroScene,heroCamera,heroGroup,cityRenderer,cityScene,cityCamera,cityGroup,cityAnim;
async function loadThree(){if(THREE)return THREE;THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');return THREE}
function buildWorld(canvas,full=false){const T=THREE;const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);renderer.outputColorSpace=T.SRGBColorSpace;const scene=new T.Scene();scene.background=full?new T.Color(0x060809):null;scene.fog=new T.FogExp2(0x080b0d,full?.018:.025);const cam=new T.PerspectiveCamera(full?55:42,canvas.clientWidth/canvas.clientHeight,.1,100);cam.position.set(full?10:7,full?8:6,full?13:10);const group=new T.Group();scene.add(group);
const amb=new T.HemisphereLight(0xc7faff,0x172019,1.7);scene.add(amb);const key=new T.DirectionalLight(0xe8ff9a,3.4);key.position.set(5,10,7);scene.add(key);
const ground=new T.Mesh(new T.BoxGeometry(18,.5,18),new T.MeshStandardMaterial({color:0x0d1214,roughness:.9,metalness:.1}));ground.position.y=-.35;group.add(ground);
const accent=0xdff85f,cyan=0x66e8f3,dark=0x141a1d;const blocks=[[-4,1,-3,2.6,2.6,2.2,accent],[-1.2,.7,-3.8,2,1.5,2.2,dark],[2.3,1.5,-2.8,2.8,3.5,2.5,cyan],[4.5,.65,.7,2.4,1.4,2.6,dark],[-3.5,.8,1.1,3.2,1.7,2.4,dark],[0,1.9,1.4,3.3,4.3,3.2,accent],[2.8,.7,4,2.4,1.6,2.4,dark],[-2.7,.55,4,2.1,1.1,2.1,cyan]];blocks.forEach(([x,y,z,w,h,d,c])=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color:c,roughness:.55,metalness:.22,emissive:c===dark?0x000000:c,emissiveIntensity:.045}));m.position.set(x,y,z);group.add(m);for(let i=0;i<3;i++){const win=new T.Mesh(new T.PlaneGeometry(.38,.16),new T.MeshBasicMaterial({color:0xeef8ce,transparent:true,opacity:.45}));win.position.set(x+(i-1)*.55,y+h/2+.01,z+d/2+.002);group.add(win)}});
const roadMat=new T.MeshStandardMaterial({color:0x20262a,roughness:1});[-2,2].forEach(z=>{const r=new T.Mesh(new T.BoxGeometry(18,.04,.9),roadMat);r.position.set(0,-.06,z);group.add(r)});[-2,2].forEach(x=>{const r=new T.Mesh(new T.BoxGeometry(.9,.04,18),roadMat);r.position.set(x,-.05,0);group.add(r)});
for(let i=0;i<18;i++){const p=new T.Mesh(new T.CylinderGeometry(.05,.05,.8,8),new T.MeshStandardMaterial({color:0x9fa6aa}));p.position.set((i%6-2.5)*2.7,.15,(Math.floor(i/6)-1)*6.6);group.add(p);const lamp=new T.PointLight(i%2?accent:cyan,.35,2.8);lamp.position.set(p.position.x,.65,p.position.z);group.add(lamp)}
const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};resize();return{renderer,scene,cam,group,resize}}
async function initHero(){try{await loadThree();const c=$('#heroCanvas');if(!c)return;({renderer:heroRenderer,scene:heroScene,cam:heroCamera,group:heroGroup,resize:window.heroResize}=buildWorld(c,false));let mx=0,my=0;c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();mx=((e.clientX-r.left)/r.width-.5);my=((e.clientY-r.top)/r.height-.5)});function loop(){requestAnimationFrame(loop);heroGroup.rotation.y+=.0018;heroGroup.rotation.x+=(my*.08-heroGroup.rotation.x)*.025;heroGroup.rotation.y+=(mx*.10)*.01;heroRenderer.render(heroScene,heroCamera)}loop()}catch(e){console.warn('3D preview unavailable',e)}}
initHero();window.addEventListener('resize',()=>{window.heroResize?.();window.cityResize?.()});

const cityModal=$('#cityModal');$('#openCity')?.addEventListener('click',async()=>{cityModal.classList.add('open');if(cityRenderer)return;try{await loadThree();({renderer:cityRenderer,scene:cityScene,cam:cityCamera,group:cityGroup,resize:window.cityResize}=buildWorld($('#cityCanvas'),true));let drag=false,lastX=0,lastY=0,rx=.18,ry=.45,zoom=15;const c=$('#cityCanvas');c.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY});window.addEventListener('pointerup',()=>drag=false);window.addEventListener('pointermove',e=>{if(!drag)return;ry+=(e.clientX-lastX)*.006;rx=Math.max(-.3,Math.min(.7,rx+(e.clientY-lastY)*.004));lastX=e.clientX;lastY=e.clientY});c.addEventListener('wheel',e=>{zoom=Math.max(7,Math.min(24,zoom+e.deltaY*.01));e.preventDefault()},{passive:false});function render(){cityAnim=requestAnimationFrame(render);cityGroup.rotation.y+=(ry-cityGroup.rotation.y)*.04;cityGroup.rotation.x+=(rx-cityGroup.rotation.x)*.04;cityCamera.position.z+=(zoom-cityCamera.position.z)*.05;cityRenderer.render(cityScene,cityCamera)}render()}catch(e){console.warn(e)}});$('#closeCity')?.addEventListener('click',()=>cityModal.classList.remove('open'));

// ---- Portfolio assistant ----
const assistant=$('#assistantPanel'),launcher=$('#assistantLauncher'),messages=$('#assistantMessages'),form=$('#assistantForm'),input=$('#assistantInput');
function openAssistant(){assistant.classList.add('open');input?.focus()}launcher?.addEventListener('click',openAssistant);$('#assistantClose')?.addEventListener('click',()=>assistant.classList.remove('open'));
const knowledge={
 intro:`Rohan Malhotra is a Computer Engineering student at Thapar Institute of Engineering & Technology, focused on software engineering, open source, developer tooling and algorithmic problem solving.`,
 experience:`His highlighted engineering experience includes computer-vision work at Bharat Electronics Limited, open-source ownership and contributions at Oppia Foundation, and active TrueForge / TrueFoundry contributions around chat lifecycle, cancellation and sandbox behavior.`,
 oppia:`At Oppia Foundation, Rohan worked as a Project Owner & Collaborator across production code and developer documentation, including TypeScript safety, rich-text-editor issue tracks, API payload migrations and regression fixes.`,
 trueforge:`Rohan contributes to TrueForge / TrueFoundry. Current highlighted work includes persisted chat deletion and cancellation / sandbox behavior improvements.`,
 bel:`At Bharat Electronics Limited, he worked on computer-vision systems, including a road-scene accident-detection pipeline using YOLO and DenseNet on KITTI.`,
 projects:`Key projects include OmniSprint, Smriti, Solar Sweeper, ProductDNA and RepoWise. OmniSprint is the flagship: an AI sprint-risk intelligence layer that combines roadmap, GitHub and CI signals.`,
 omnisprint:`OmniSprint analyzes engineering execution risk across roadmaps, GitHub and CI. It placed Top 50 among 5,400+ participants in the Pirates of the Coral-Bean hackathon and later won the Iteration Machine Special Prize at DSH Hacks V1.`,
 achievements:`Highlights include TCS CodeVita Global Rank 57, Yandex CodeRun Winter Challenge Global Rank 87, Rank 8 in Unstop's Top 100 Unstoppable E-School Leaders 2026, selection for Amazon ML Summer School 2025, ZS Campus Beats Top 100, and multiple hackathon awards.`,
 competitive:`Competitive programming highlights: TCS CodeVita Global Rank 57 and Yandex CodeRun Winter Challenge Global Rank 87.`,
 education:`Rohan studies B.E. Computer Engineering at Thapar Institute of Engineering & Technology (TIET), graduating in 2027.`,
 skills:`Core stack: C++, Python, Java, TypeScript/JavaScript, React, FastAPI, Node.js, SQL/Postgres, Docker, Git/GitHub, with experience in ML/computer vision and developer tooling.`,
 contact:`You can reach Rohan through LinkedIn or GitHub using the links on this portfolio.`,
 writing:`Rohan was featured in Pratyaksh 2025 and has also been recognized through Unstop's Top 100 Unstoppable E-School Leaders.`
};
function answer(q){const s=q.toLowerCase();if(/who|about|introduce|rohan/.test(s)&&!/(oppia|trueforge|bel)/.test(s))return knowledge.intro;if(/oppia/.test(s))return knowledge.oppia;if(/trueforge|truefoundry/.test(s))return knowledge.trueforge;if(/bharat|bel|vision/.test(s))return knowledge.bel;if(/omnisprint/.test(s))return knowledge.omnisprint;if(/project|built|build|hackathon/.test(s))return knowledge.projects;if(/achievement|award|rank|codevita|yandex|competitive/.test(s))return /project|hackathon/.test(s)?knowledge.projects:knowledge.achievements;if(/experience|work|intern/.test(s))return knowledge.experience;if(/skill|stack|language|technology/.test(s))return knowledge.skills;if(/college|education|degree|thapar|tiet/.test(s))return knowledge.education;if(/article|writing|pratyaksh|unstop/.test(s))return knowledge.writing;if(/contact|email|linkedin|github/.test(s))return knowledge.contact;return `I can answer questions about Rohan's experience, projects, open-source work, competitive-programming ranks, education, skills and achievements. Try asking “What did he do at Oppia?” or “Tell me about OmniSprint.”`}
function addMsg(text,type){const el=document.createElement('div');el.className='message '+type;el.textContent=text;messages.append(el);messages.scrollTop=messages.scrollHeight}
function ask(q){if(!q.trim())return;addMsg(q,'user');setTimeout(()=>addMsg(answer(q),'bot'),180)}
form?.addEventListener('submit',e=>{e.preventDefault();const q=input.value;input.value='';ask(q)});$$('.assistant-suggestions button').forEach(b=>b.addEventListener('click',()=>{openAssistant();ask(b.textContent)}));
