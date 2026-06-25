// Add <script src="js/api.js"></script> before this in index.html

async function renderFeed() {
  const grid = document.getElementById("feedGrid");
  if (!grid) return;

  try {
    const issues = await Issues.getAll('?limit=6');
    const CAT_EMOJI = { pothole:"🕳️", light:"💡", water:"💧", waste:"🗑️", drain:"🌊", other:"⚠️" };

    grid.innerHTML = issues.map(i => `
      <div class="feed-card">
        <div class="feed-card-top">
          <span class="feed-cat">${CAT_EMOJI[i.category] || '⚠️'} ${i.category}</span>
          <span class="feed-status ${i.status === 'open' ? 'status-open' : i.status === 'progress' ? 'status-progress' : 'status-resolved'}">
            ${i.status === 'open' ? 'Open' : i.status === 'progress' ? 'In Progress' : 'Resolved'}
          </span>
        </div>
        <div class="feed-title">${i.title}</div>
        <div class="feed-location">📍 ${i.location?.address || 'Location not set'}</div>
        <div class="feed-votes">👍 ${i.voteCount} upvotes</div>
      </div>`).join('');
  } catch {
    // Fallback to mock data if backend not connected
    renderMockFeed();
  }
}

function renderMockFeed() {
  const MOCK = [
    { title:"Large pothole on Main Road", category:"pothole", location:{address:"MG Road"}, status:"open", voteCount:34 },
    { title:"Streetlight not working", category:"light", location:{address:"Bistupur"}, status:"progress", voteCount:21 },
    { title:"Water pipe burst", category:"water", location:{address:"NH-33"}, status:"open", voteCount:58 },
  ];
  const CAT_EMOJI = { pothole:"🕳️", light:"💡", water:"💧", waste:"🗑️", drain:"🌊", other:"⚠️" };
  const grid = document.getElementById("feedGrid");
  grid.innerHTML = MOCK.map(i => `
    <div class="feed-card">
      <div class="feed-card-top">
        <span class="feed-cat">${CAT_EMOJI[i.category]} ${i.category}</span>
        <span class="feed-status status-open">Open</span>
      </div>
      <div class="feed-title">${i.title}</div>
      <div class="feed-location">📍 ${i.location.address}</div>
      <div class="feed-votes">👍 ${i.voteCount} upvotes</div>
    </div>`).join('');
}

async function loadStats() {
  try {
    const stats = await Dashboard.stats();
    const nums = document.querySelectorAll(".stat-num[data-target]");
    const values = [stats.totalIssues, stats.resolutionRate, stats.totalUsers];
    nums.forEach((el, i) => {
      if (values[i] !== undefined) el.dataset.target = values[i];
    });
  } catch { /* use default targets */ }
  animateStats();
}

function animateStats() {
  document.querySelectorAll(".stat-num[data-target]").forEach(el => {
    const target = +el.dataset.target; let cur = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur.toLocaleString(); if (cur >= target) clearInterval(t); }, 20);
  });
}

document.querySelectorAll(".cat-card").forEach(c => c.addEventListener("click", () => window.location.href = "map.html"));
renderFeed();
loadStats();