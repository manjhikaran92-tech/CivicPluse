const ISSUES = [
  {id:1,title:"Large pothole on Main Road",cat:"pothole",loc:"MG Road",status:"open",votes:34,lat:22.8046,lng:86.2029},
  {id:2,title:"Streetlight not working",cat:"light",loc:"Bistupur Market",status:"progress",votes:21,lat:22.7994,lng:86.1999},
  {id:3,title:"Water pipe burst",cat:"water",loc:"NH-33 Overbridge",status:"open",votes:58,lat:22.8110,lng:86.2100},
  {id:4,title:"Garbage not collected",cat:"waste",loc:"Sakchi Colony",status:"resolved",votes:12,lat:22.7950,lng:86.1950},
  {id:5,title:"Drain overflow near school",cat:"drain",loc:"Kadma School Road",status:"progress",votes:29,lat:22.8200,lng:86.2150},
  {id:6,title:"Broken footpath tiles",cat:"other",loc:"Jugsalai Chowk",status:"open",votes:17,lat:22.7880,lng:86.1880},
];
const COLOR = {open:"#EF4444",progress:"#F59E0B",resolved:"#10B981"};
const EMOJI = {pothole:"🕳️",light:"💡",water:"💧",waste:"🗑️",drain:"🌊",other:"⚠️"};

const map = L.map("map").setView([22.8046,86.2029],13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
let markers = [];

function getStatusClass(s){return s==="open"?"status-open":s==="progress"?"status-progress":"status-resolved";}
function getStatusLabel(s){return s==="open"?"Open":s==="progress"?"In Progress":"Resolved";}

function renderSidebar(issues){
  document.getElementById("sidebarList").innerHTML = issues.map(i=>`
    <div class="issue-item" data-id="${i.id}" onclick="focusIssue(${i.id})">
      <div class="issue-item-top">
        <span class="feed-cat">${EMOJI[i.cat]} ${i.cat}</span>
        <span class="feed-status ${getStatusClass(i.status)}">${getStatusLabel(i.status)}</span>
      </div>
      <div class="issue-item-title">${i.title}</div>
      <div class="issue-item-loc">📍 ${i.loc}</div>
      <div class="feed-votes" style="margin-top:0.3rem">👍 ${i.votes}</div>
    </div>`).join("");
}

function renderMarkers(issues){
  markers.forEach(m=>map.removeLayer(m)); markers=[];
  issues.forEach(i=>{
    const m=L.circleMarker([i.lat,i.lng],{radius:10,fillColor:COLOR[i.status],color:"#fff",weight:2,fillOpacity:0.9}).addTo(map);
    m.bindPopup(`<b>${EMOJI[i.cat]} ${i.title}</b><br>📍 ${i.loc}<br>👍 ${i.votes} votes`);
    markers.push(m);
  });
}

function focusIssue(id){
  const i=ISSUES.find(x=>x.id===id); if(!i) return;
  map.setView([i.lat,i.lng],16);
  document.querySelectorAll(".issue-item").forEach(el=>el.classList.remove("selected"));
  document.querySelector(`.issue-item[data-id="${id}"]`)?.classList.add("selected");
}

document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const f=btn.dataset.filter;
    const filtered=f==="all"?ISSUES:ISSUES.filter(i=>i.status===f);
    renderSidebar(filtered); renderMarkers(filtered);
  });
});

renderSidebar(ISSUES); renderMarkers(ISSUES);