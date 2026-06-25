const uploadZone = document.getElementById("uploadZone");
const uploadInner = document.getElementById("uploadInner");
const fileInput = document.getElementById("fileInput");
const previewImg = document.getElementById("previewImg");
const aiStatus = document.getElementById("aiStatus");
const aiResult = document.getElementById("aiResult");
const aiCategory = document.getElementById("aiCategory");
const catSelect = document.getElementById("catSelect");
const locateBtn = document.getElementById("locateBtn");
const locationInput = document.getElementById("locationInput");
const mapPreview = document.getElementById("mapPreview");
const submitBtn = document.getElementById("submitBtn");
const reportForm = document.getElementById("reportForm");
const successState = document.getElementById("successState");
const trackingId = document.getElementById("trackingId");
const AI_CATS = ["Pothole","Water Leakage","Streetlight Issue","Waste Dumping","Drainage Problem"];

uploadZone.addEventListener("click", ()=>fileInput.click());
uploadZone.addEventListener("dragover", e=>{e.preventDefault();uploadZone.classList.add("dragover");});
uploadZone.addEventListener("dragleave", ()=>uploadZone.classList.remove("dragover"));
uploadZone.addEventListener("drop", e=>{
  e.preventDefault(); uploadZone.classList.remove("dragover");
  const f=e.dataTransfer.files[0]; if(f) handleFile(f);
});
fileInput.addEventListener("change", ()=>{ if(fileInput.files[0]) handleFile(fileInput.files[0]); });

function handleFile(file){
  const reader = new FileReader();
  reader.onload = e=>{
    previewImg.src=e.target.result;
    previewImg.classList.remove("hidden");
    uploadInner.classList.add("hidden");
    simulateAI();
  };
  reader.readAsDataURL(file);
}

function simulateAI(){
  aiStatus.classList.remove("hidden"); aiResult.classList.add("hidden");
  setTimeout(()=>{
    aiStatus.classList.add("hidden");
    aiCategory.textContent = AI_CATS[Math.floor(Math.random()*AI_CATS.length)];
    aiResult.classList.remove("hidden");
  }, 2000);
}

document.getElementById("aiChange").addEventListener("click", ()=>aiResult.classList.add("hidden"));

catSelect.querySelectorAll(".cat-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    catSelect.querySelectorAll(".cat-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  });
});

locateBtn.addEventListener("click", ()=>{
  locateBtn.textContent="Detecting..."; locateBtn.disabled=true;
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const{latitude:lat,longitude:lng}=pos.coords;
      locationInput.value=`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      mapPreview.innerHTML=`<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&marker=${lat},${lng}&layer=mapnik" style="width:100%;height:100%;border:none;border-radius:8px"></iframe>`;
      locateBtn.textContent="✅ Detected";
    }, ()=>{
      locationInput.value="Jamshedpur, Jharkhand (default)";
      locateBtn.textContent="📍 Detect"; locateBtn.disabled=false;
    });
  }
});

submitBtn.addEventListener("click", ()=>{
  const title=document.getElementById("title").value.trim();
  if(!title){ alert("Please enter an issue title!"); return; }
  submitBtn.textContent="Submitting..."; submitBtn.disabled=true;
  setTimeout(()=>{
    trackingId.textContent="#CP-"+Math.floor(1000+Math.random()*9000);
    reportForm.classList.add("hidden");
    successState.classList.remove("hidden");
  }, 1500);
});