const BAR_DATA = [
  {label:"Potholes",count:420,emoji:"🕳️"},
  {label:"Water",count:210,emoji:"💧"},
  {label:"Streetlights",count:310,emoji:"💡"},
  {label:"Waste",count:155,emoji:"🗑️"},
  {label:"Drainage",count:98,emoji:"🌊"},
  {label:"Other",count:47,emoji:"⚠️"},
];
const LEADERS = [
  {name:"Rahul S.",points:1240,initial:"R"},
  {name:"Priya M.",points:980,initial:"P"},
  {name:"Aman K.",points:870,initial:"A"},
  {name:"Sunita D.",points:740,initial:"S"},
  {name:"Vikram J.",points:620,initial:"V"},
];

const maxCount = Math.max(...BAR_DATA.map(d=>d.count));
const barChart = document.getElementById("barChart");
if(barChart) barChart.innerHTML = BAR_DATA.map(d=>`
  <div class="bar-row">
    <div class="bar-label">${d.emoji} ${d.label}</div>
    <div class="bar-track"><div class="bar-fill" style="width:${(d.count/maxCount)*100}%"></div></div>
    <div class="bar-count">${d.count}</div>
  </div>`).join("");

const lb = document.getElementById("leaderboard");
if(lb) lb.innerHTML = LEADERS.map((l,i)=>`
  <div class="lb-item">
    <div class="lb-rank">#${i+1}</div>
    <div class="lb-avatar">${l.initial}</div>
    <div class="lb-name">${l.name}</div>
    <div class="lb-pts">⭐ ${l.points} pts</div>
  </div>`).join("");

document.querySelectorAll(".kpi-val[data-target]").forEach(el=>{
  const target=+el.dataset.target; let cur=0;
  const step=Math.ceil(target/60);
  const t=setInterval(()=>{ cur=Math.min(cur+step,target); el.textContent=cur.toLocaleString(); if(cur>=target)clearInterval(t); },20);
});