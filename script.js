const EVENTS = [
  {id:1,name:"CodeSprint Hackathon",cat:"Tech",date:"2026-11-28T09:00",venue:"KIIT Convention Centre, Bhubaneswar",desc:"24 hours to build, break and ship. Teams of up to four, mentors on call and prizes for the top three.",img:"hackathon"},
  {id:2,name:"Lo-Fi Nights Live",cat:"Music",date:"2026-12-05T19:00",venue:"Open Air Theatre, Bhubaneswar",desc:"An evening of mellow live sets from local indie artists under the stars.",img:"concert"},
  {id:3,name:"Odisha Art Walk",cat:"Art",date:"2026-12-09T16:00",venue:"Ekamra Haat, Bhubaneswar",desc:"Guided walk through pop-up galleries, pattachitra demos and live mural painting.",img:"gallery"},
  {id:4,name:"City 10K Run",cat:"Sports",date:"2026-12-13T06:00",venue:"Marine Drive, Bhubaneswar",desc:"Beginner-friendly 10K and 5K routes with timing chips and finisher medals.",img:"marathon"},
  {id:5,name:"Cloud & DevOps Summit",cat:"Tech",date:"2026-12-17T10:00",venue:"Hotel Mayfair Lagoon",desc:"Talks and hands-on labs on Kubernetes, CI/CD and cost-aware cloud design.",img:"conference"},
  {id:6,name:"Street Food Carnival",cat:"Food",date:"2026-12-20T12:00",venue:"Janpath Ground, Bhubaneswar",desc:"60 stalls, live cooking battles and regional specialities from across Odisha.",img:"food"},
  {id:7,name:"Open Mic & Poetry Slam",cat:"Art",date:"2026-12-23T18:00",venue:"The Book Cafe, Bhubaneswar",desc:"Sign up to perform or just listen. Poetry, stand-up and acoustic music.",img:"microphone"},
  {id:8,name:"Inter-College Football Cup",cat:"Sports",date:"2026-12-26T15:00",venue:"Kalinga Stadium",desc:"Knockout tournament for college teams. Come cheer or register your squad.",img:"football"}
];
const $ = s => document.querySelector(s);
const store = {get:()=>{try{return JSON.parse(localStorage.getItem("regs"))||[]}catch{return[]}},set:v=>{try{localStorage.setItem("regs",JSON.stringify(v))}catch{}}};
let cat = "All", q = "";
const fmt = d => new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
const img = e => `${e.img}.svg`;

// Theme
const root = document.documentElement;
try{root.dataset.theme = localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")}catch{}
$("#themeBtn").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try{localStorage.setItem("theme",root.dataset.theme)}catch{}
};

// Filters
const cats = ["All",...new Set(EVENTS.map(e=>e.cat))];
$("#chips").innerHTML = cats.map(c=>`<button class="chip${c==="All"?" on":""}" data-c="${c}" aria-pressed="${c==="All"}">${c}</button>`).join("");
$("#chips").onclick = e => {
  const b = e.target.closest(".chip"); if(!b) return;
  cat = b.dataset.c;
  document.querySelectorAll(".chip").forEach(c=>{c.classList.toggle("on",c===b);c.setAttribute("aria-pressed",c===b)});
  render();
};
$("#search").oninput = e => { q = e.target.value.trim().toLowerCase(); render(); };

function render(){
  const list = EVENTS.filter(e => (cat==="All"||e.cat===cat) && (e.name+e.venue+e.desc+e.cat).toLowerCase().includes(q));
  $("#grid").innerHTML = list.map(e=>`
    <article class="card">
      <div class="img" style="background-image:url('${img(e)}')" role="img" aria-label="${e.name}"></div>
      <div class="card-body">
        <span class="tag">${e.cat}</span>
        <h3>${e.name}</h3>
        <p class="meta">${fmt(e.date)}<br>${e.venue}</p>
        <p class="desc">${e.desc}</p>
        <button class="btn small" data-id="${e.id}">View and register</button>
      </div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
}
$("#grid").onclick = e => { const b = e.target.closest("[data-id]"); if(b) openModal(+b.dataset.id); };

// Modal + form
const modal = $("#modal"), form = $("#form");
function openModal(id){
  const e = EVENTS.find(x=>x.id===id);
  $("#mImg").style.backgroundImage = `url('${img(e)}')`;
  $("#mCat").textContent = e.cat;
  $("#mTitle").textContent = e.name;
  $("#mMeta").textContent = `${fmt(e.date)} · ${e.venue}`;
  $("#mDesc").textContent = e.desc;
  $("#eventSel").innerHTML = EVENTS.map(x=>`<option value="${x.id}"${x.id===id?" selected":""}>${x.name}</option>`).join("");
  form.reset(); $("#eventSel").value = id;
  clearErrors();
  form.hidden = false; $("#done").hidden = true;
  modal.showModal();
}
$("#closeBtn").onclick = $("#doneBtn").onclick = () => modal.close();
modal.addEventListener("click", e => { if(e.target===modal) modal.close(); });

const rules = {
  name: v => /^[A-Za-z][A-Za-z .'-]{1,49}$/.test(v) ? "" : "Enter your full name using letters only (2–50 characters).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email, like name@example.com.",
  phone: v => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g,"")) ? "" : "Enter a 10-digit mobile number starting with 6, 7, 8 or 9."
};
function clearErrors(){ document.querySelectorAll(".err").forEach(s=>s.textContent=""); form.querySelectorAll("input").forEach(i=>i.classList.remove("bad")); }
function check(name){
  const input = form.elements[name], msg = rules[name](input.value.trim());
  input.classList.toggle("bad", !!msg);
  document.querySelector(`.err[data-for=${name}]`).textContent = msg;
  return !msg;
}
Object.keys(rules).forEach(n => form.elements[n].addEventListener("blur",()=>check(n)));

form.onsubmit = e => {
  e.preventDefault();
  const ok = Object.keys(rules).map(check).every(Boolean);
  if(!ok) return form.querySelector(".bad")?.focus();
  const ev = EVENTS.find(x=>x.id===+form.elements.event.value);
  const regs = store.get();
  const email = form.elements.email.value.trim().toLowerCase();
  if(regs.some(r=>r.eventId===ev.id && r.email===email)){
    document.querySelector(".err[data-for=email]").textContent = "This email is already registered for this event.";
    return;
  }
  regs.push({eventId:ev.id,name:form.elements.name.value.trim(),email,phone:form.elements.phone.value.trim(),at:Date.now()});
  store.set(regs);
  form.hidden = true; $("#done").hidden = false;
  $("#doneMsg").textContent = `Thanks, ${form.elements.name.value.trim().split(" ")[0]}. A confirmation for ${ev.name} will be sent to ${email}.`;
  renderRegs();
};

// Registrations
function renderRegs(){
  const regs = store.get();
  $("#regCount").textContent = regs.length;
  $("#regList").innerHTML = regs.length ? regs.map((r,i)=>{
    const ev = EVENTS.find(x=>x.id===r.eventId);
    return `<li><span><b>${ev.name}</b><br><span class="meta">${r.name} · ${r.email}</span></span><span class="meta">${fmt(ev.date)}</span></li>`;
  }).join("") : `<li class="none">No tickets yet. Pick an event above to register.</li>`;
}

// Countdown to next event
const upcoming = EVENTS.filter(e=>new Date(e.date)>Date.now()).sort((a,b)=>new Date(a.date)-new Date(b.date))[0] || EVENTS[0];
$("#nextName").textContent = upcoming.name;
$("#nextBtn").onclick = () => openModal(upcoming.id);
function tick(){
  let s = Math.max(0, Math.floor((new Date(upcoming.date)-Date.now())/1000));
  const p = [["Days",86400],["Hrs",3600],["Min",60],["Sec",1]].map(([l,n])=>{const v=Math.floor(s/n);s%=n;return `<div><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`});
  $("#timer").innerHTML = p.join("");
}
tick(); setInterval(tick,1000);
render(); renderRegs();
