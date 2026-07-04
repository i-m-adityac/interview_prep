// ============================================================
// FAANG Prep 2026 — App logic
// State in localStorage · spaced repetition at 1/3/7/14/35 days
// ============================================================

const STORE_KEY = "faangPrep2026";

// ---------- state ----------
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.customSolved = parsed.customSolved || {};
      parsed.activeCustomPathId = parsed.activeCustomPathId || (DATA && DATA.customPaths ? Object.keys(DATA.customPaths)[0] : null);
      return parsed;
    }
  } catch (e) { /* corrupted -> fresh */ }
  return {
    startDate: todayStr(),
    theme: null,               // null = follow system
    solved: {},                // problemKey -> true
    sr: {},                    // itemId -> {stage, due, learnedAt}
    goals: {},                 // goalId -> true
    stories: {},               // storyId -> text
    activity: {},              // 'YYYY-MM-DD' -> count
    customSolved: {},          // key (jobId::weekIdx::itemIdx) -> true
    activeCustomPathId: (DATA && DATA.customPaths) ? Object.keys(DATA.customPaths)[0] : null
  };
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

// ---------- date helpers ----------
function todayStr(d) {
  const dt = d || new Date();
  return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return todayStr(d);
}
function daysBetween(a, b) {
  return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
}
function logActivity(n) {
  const t = todayStr();
  state.activity[t] = (state.activity[t] || 0) + (n || 1);
}

// ---------- spaced repetition ----------
const INTERVALS = DATA.intervals; // [1,3,7,14,35]

function srItems() {
  // every learnable thing: patterns, sd fundamentals, sd cases, lld fundamentals, lld cases
  const items = [];
  DATA.patterns.forEach(p => items.push({ id: p.id, name: p.name, kind: "DSA pattern", view: "dsa" }));
  DATA.sdFundamentals.forEach(f => items.push({ id: f.id, name: f.name, kind: "System design", view: "system" }));
  DATA.sdCases.forEach(c => items.push({ id: c.id, name: c.name, kind: "SD case study", view: "system" }));
  DATA.lldFundamentals.forEach(f => items.push({ id: f.id, name: f.name, kind: "LLD concept", view: "lld" }));
  DATA.lldCases.forEach(c => items.push({ id: c.id, name: c.name, kind: "LLD case study", view: "lld" }));
  return items;
}
const SR_LOOKUP = {};
srItems().forEach(it => SR_LOOKUP[it.id] = it);

function markLearned(id) {
  state.sr[id] = { stage: 0, due: addDays(todayStr(), INTERVALS[0]), learnedAt: todayStr() };
  logActivity(); save(); render();
}
function markReviewed(id) {
  const rec = state.sr[id];
  if (!rec) return;
  rec.stage += 1;
  if (rec.stage >= INTERVALS.length) {
    rec.due = null; // mastered
  } else {
    rec.due = addDays(todayStr(), INTERVALS[rec.stage]);
  }
  logActivity(); save(); render();
}
function unlearn(id) {
  delete state.sr[id];
  save(); render();
}
function dueToday() {
  const t = todayStr();
  return Object.entries(state.sr)
    .filter(([id, r]) => r.due && r.due <= t)
    .map(([id, r]) => ({ ...SR_LOOKUP[id], rec: r }))
    .filter(x => x.id);
}
function srStatusLabel(id) {
  const rec = state.sr[id];
  if (!rec) return null;
  if (rec.due === null) return { cls: "mastered", text: "Mastered ✓" };
  const d = daysBetween(todayStr(), rec.due);
  if (d <= 0) return { cls: "due", text: "Review due" };
  return { cls: "scheduled", text: "Review in " + d + "d" };
}

// ---------- tiny markdown ----------
function md(s) {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

// ---------- derived stats ----------
function totalProblems() { return DATA.patterns.reduce((n, p) => n + p.problems.length, 0); }
function solvedCount() { return Object.keys(state.solved).length; }
function learnedCount() { return Object.keys(state.sr).length; }
function totalLearnable() { return srItems().length; }
function currentWeek() {
  const w = Math.floor(daysBetween(state.startDate, todayStr()) / 7) + 1;
  return Math.min(Math.max(w, 1), 12);
}
function dayNumber() {
  return Math.min(Math.max(daysBetween(state.startDate, todayStr()) + 1, 1), 84);
}
function streak() {
  let s = 0, d = todayStr();
  if (!state.activity[d]) d = addDays(d, -1); // today not yet active doesn't break streak
  while (state.activity[d]) { s += 1; d = addDays(d, -1); }
  return s;
}
function goalsForWeek(w) {
  const wk = DATA.roadmap.find(r => r.week === w);
  return wk ? wk.goals : [];
}

// ---------- rendering ----------
const VIEWS = ["dashboard", "roadmap", "dsa", "system", "lld", "behavioral", "curator", "revision"];
let activeView = location.hash.replace("#", "") || "dashboard";
if (!VIEWS.includes(activeView)) activeView = "dashboard";
const openCards = new Set(); // expanded card ids survive re-render

function render() {
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.view === activeView);
    if (b.dataset.view === "revision") {
      const n = dueToday().length;
      b.querySelector(".badge").textContent = n || "";
      b.querySelector(".badge").style.display = n ? "inline-flex" : "none";
    }
  });
  const root = document.getElementById("view");
  root.innerHTML = {
    dashboard: renderDashboard,
    roadmap: renderRoadmap,
    dsa: renderDSA,
    system: renderSystem,
    lld: renderLLD,
    behavioral: renderBehavioral,
    curator: renderCurator,
    revision: renderRevision
  }[activeView]();
  bindEvents(root);
  window.scrollTo({ top: 0 });
}

function setView(v) { activeView = v; location.hash = v; render(); }

// ---------- dashboard ----------
function renderDashboard() {
  const week = currentWeek(), day = dayNumber();
  const due = dueToday();
  const wk = DATA.roadmap.find(r => r.week === week);
  const isWeekend = [0, 6].includes(new Date().getDay());
  const plan = isWeekend && week >= 5 ? DATA.dailyPlan.concat(DATA.weekendPlan) : DATA.dailyPlan;
  const goals = goalsForWeek(week);
  const goalsDone = goals.filter(g => state.goals[g.id]).length;

  // activity: last 14 days
  let bars = "", maxAct = 1;
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = addDays(todayStr(), -i);
    const v = state.activity[d] || 0;
    days.push({ d, v });
    maxAct = Math.max(maxAct, v);
  }
  bars = days.map(({ d, v }) => {
    const h = v ? Math.max(8, Math.round(v / maxAct * 64)) : 3;
    const dt = new Date(d + "T12:00:00");
    const lbl = dt.toLocaleDateString(undefined, { weekday: "short" })[0];
    return `<div class="abar-slot" title="${d}: ${v} item${v === 1 ? "" : "s"}">
      <div class="abar${v ? "" : " empty"}" style="height:${h}px"></div>
      <div class="abar-lbl">${lbl}</div></div>`;
  }).join("");

  const pctProblems = Math.round(solvedCount() / totalProblems() * 100);
  const pctTopics = Math.round(learnedCount() / totalLearnable() * 100);

  return `
  <div class="hero-row">
    <div>
      <div class="hero-kicker">FAANG Prep · SDE-2 track</div>
      <div class="hero-num">Day ${day} <span class="hero-of">of 84</span></div>
      <div class="hero-sub">Week ${week} — ${wk ? wk.theme : ""} · started ${state.startDate}
        <button class="link-btn" data-action="edit-start">change</button></div>
    </div>
  </div>

  <div class="tiles">
    <div class="tile"><div class="tile-label">Problems solved</div>
      <div class="tile-value">${solvedCount()}<span class="tile-sub">/ ${totalProblems()}</span></div>
      <div class="meter"><div class="meter-fill" style="width:${pctProblems}%"></div></div></div>
    <div class="tile"><div class="tile-label">Topics learned</div>
      <div class="tile-value">${learnedCount()}<span class="tile-sub">/ ${totalLearnable()}</span></div>
      <div class="meter"><div class="meter-fill" style="width:${pctTopics}%"></div></div></div>
    <div class="tile${due.length ? " tile-due" : ""}"><div class="tile-label">Reviews due today</div>
      <div class="tile-value">${due.length}</div>
      <div class="tile-note">${due.length ? "clear these first — 30 min" : "queue is clear ✓"}</div></div>
    <div class="tile"><div class="tile-label">Day streak</div>
      <div class="tile-value">${streak()}</div>
      <div class="tile-note">${streak() >= 7 ? "consistency is the whole game" : "any activity counts"}</div></div>
  </div>

  <div class="dash-cols">
    <section class="panel">
      <h2>Today's session <span class="muted">(${isWeekend && week >= 5 ? "weekend — includes system design" : "2–3 hrs"})</span></h2>
      ${plan.map(p => `<div class="plan-block">
        <div class="plan-time">${p.time}</div>
        <div><div class="plan-title">${p.title}</div><div class="plan-desc">${p.desc}</div></div>
      </div>`).join("")}
      ${due.length ? `<div class="due-strip">Due for revision now:
        ${due.slice(0, 5).map(d => `<button class="chip chip-due" data-action="goto" data-view="revision">${d.name}</button>`).join("")}
        ${due.length > 5 ? `<span class="muted">+${due.length - 5} more</span>` : ""}</div>` : ""}
    </section>

    <section class="panel">
      <h2>Week ${week} goals <span class="muted">${goalsDone}/${goals.length}</span></h2>
      ${goals.map(g => `<label class="check-row">
        <input type="checkbox" data-action="goal" data-id="${g.id}" ${state.goals[g.id] ? "checked" : ""}>
        <span>${md(g.text)}</span></label>`).join("")}
      <button class="btn-ghost" data-action="goto" data-view="roadmap">Full 12-week roadmap →</button>
    </section>
  </div>

  <section class="panel">
    <h2>Last 14 days <span class="muted">items completed per day</span></h2>
    <div class="activity">${bars}</div>
  </section>

  <section class="panel method">
    <h2>How this plan works</h2>
    <p><strong>Learn visually, then retrieve.</strong> Each pattern page opens with a picture — trace it by hand before reading code. Re-typing the template <em>without looking</em> is worth three passive reads.</p>
    <p><strong>Spaced repetition, built in.</strong> When you mark a topic learned, this site schedules reviews at <strong>1, 3, 7, 14 and 35 days</strong> — the interval ladder shown in a 254-study meta-analysis (Cepeda et al., 2006) to beat massed study, with retrieval practice adding up to 150% better recall (Karpicke & Roediger, 2008). The 30-minute daily revision block is where retention actually happens; treat it as non-negotiable.</p>
    <p><strong>Narrate everything.</strong> In 2026 loops, poor communication is the most-cited rejection reason. Practice stating the brute force, the trade-off, and the complexity out loud from week 1 — it must be automatic by the time it counts.</p>
  </section>`;
}

// ---------- roadmap ----------
function renderRoadmap() {
  const cw = currentWeek();
  const phases = { 1: "Phase 1 · DSA Foundations (Weeks 1–4)", 2: "Phase 2 · Structures + System Design (Weeks 5–8)", 3: "Phase 3 · DP, AI Systems & Mocks (Weeks 9–12)" };
  let out = `<h1>12-Week Roadmap</h1>
  <p class="lede">Beginner-to-intermediate → interview-ready SDE-2 in 84 days at 2–3 hrs/day. Weekdays: learn + solve + revise. Weekends from week 5: system design. Mocks at weeks 4, 8, 10 and all of week 12.</p>`;
  let lastPhase = 0;
  DATA.roadmap.forEach(wk => {
    if (wk.phase !== lastPhase) {
      out += `<div class="phase-hdr">${phases[wk.phase]}</div>`;
      lastPhase = wk.phase;
    }
    const done = wk.goals.filter(g => state.goals[g.id]).length;
    const isOpen = openCards.has("wk" + wk.week) || wk.week === cw;
    const chips = (wk.patternIds || []).map(id => {
      const p = DATA.patterns.find(x => x.id === id);
      return p ? `<button class="chip" data-action="goto-item" data-view="dsa" data-id="${id}">${p.name}</button>` : "";
    }).join("") + (wk.sdIds || []).map(id => {
      const f = DATA.sdFundamentals.find(x => x.id === id);
      return f ? `<button class="chip chip-sd" data-action="goto-item" data-view="system" data-id="${id}">${f.name}</button>` : "";
    }).join("") + (wk.lldIds || []).map(id => {
      const f = DATA.lldFundamentals.find(x => x.id === id) || DATA.lldCases.find(x => x.id === id);
      return f ? `<button class="chip chip-lld" data-action="goto-item" data-view="lld" data-id="${id}">${f.name}</button>` : "";
    }).join("");
    out += `<div class="card${wk.week === cw ? " card-current" : ""}" id="wk${wk.week}">
      <button class="card-head" data-action="toggle" data-id="wk${wk.week}">
        <span class="wk-num">W${wk.week}</span>
        <span class="card-title">${wk.theme}${wk.week === cw ? ' <span class="now-pill">you are here</span>' : ""}</span>
        <span class="card-meta">${done}/${wk.goals.length}</span>
        <span class="chev">${isOpen ? "▾" : "▸"}</span>
      </button>
      <div class="card-body" ${isOpen ? "" : "hidden"}>
        ${chips ? `<div class="chip-row">${chips}</div>` : ""}
        ${wk.goals.map(g => `<label class="check-row">
          <input type="checkbox" data-action="goal" data-id="${g.id}" ${state.goals[g.id] ? "checked" : ""}>
          <span>${md(g.text)}</span></label>`).join("")}
      </div>
    </div>`;
  });
  return out;
}

// ---------- DSA ----------
function renderDSA() {
  let out = `<h1>DSA Patterns</h1>
  <p class="lede">18 patterns cover ~95% of FAANG coding questions. For each: recognize it → trace the visual by hand → re-type the template from memory → solve the problems in order. Mark it learned to start its revision schedule.</p>
  ${renderResources("dsa")}`;
  DATA.patterns.forEach(p => { out += renderPatternCard(p); });
  return out;
}

function renderPatternCard(p) {
  const isOpen = openCards.has(p.id);
  const st = srStatusLabel(p.id);
  const solvedHere = p.problems.filter((pr, i) => state.solved[p.id + "::" + i]).length;
  return `<div class="card" id="${p.id}">
    <button class="card-head" data-action="toggle" data-id="${p.id}">
      <span class="wk-num">W${p.week}</span>
      <span class="card-title">${p.name}</span>
      ${st ? `<span class="sr-pill ${st.cls}">${st.text}</span>` : ""}
      <span class="card-meta">${solvedHere}/${p.problems.length} solved</span>
      <span class="chev">${isOpen ? "▾" : "▸"}</span>
    </button>
    <div class="card-body" ${isOpen ? "" : "hidden"}>
      <div class="sect"><div class="sect-label">Recognize it</div><p>${md(p.recognize)}</p></div>
      <div class="sect"><div class="sect-label">The idea</div><p>${md(p.idea)}</p></div>
      ${p.visual ? `<div class="sect"><div class="sect-label">Picture it</div>${p.visual}</div>` : ""}
      <div class="sect"><div class="sect-label">Template — re-type this from memory</div>
        <pre><code>${p.template.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>
        <p class="muted">${md(p.complexity)}</p></div>
      <div class="sect"><div class="sect-label">Pitfalls</div>
        <ul>${p.pitfalls.map(x => `<li>${md(x)}</li>`).join("")}</ul></div>
      <div class="sect"><div class="sect-label">Problems — solve in order</div>
        ${p.problems.map((pr, i) => {
          const key = p.id + "::" + i;
          return `<label class="check-row prob-row">
            <input type="checkbox" data-action="solve" data-id="${key}" ${state.solved[key] ? "checked" : ""}>
            <span class="diff diff-${pr.diff}">${pr.diff}</span>
            <a href="${pr.url}" target="_blank" rel="noopener">${pr.name}</a></label>`;
        }).join("")}
      </div>
      ${srControls(p.id)}
    </div>
  </div>`;
}

function srControls(id) {
  const rec = state.sr[id];
  if (!rec) {
    return `<div class="sr-box"><button class="btn" data-action="learn" data-id="${id}">Mark learned — start revision schedule</button>
      <span class="muted">schedules reviews at +1, +3, +7, +14, +35 days</span></div>`;
  }
  if (rec.due === null) {
    return `<div class="sr-box"><span class="sr-pill mastered">Mastered ✓ — all 5 reviews done</span>
      <button class="link-btn" data-action="unlearn" data-id="${id}">reset</button></div>`;
  }
  const d = daysBetween(todayStr(), rec.due);
  if (d <= 0) {
    return `<div class="sr-box sr-due-box">
      <button class="btn" data-action="review" data-id="${id}">Reviewed — done from memory ✓</button>
      <span class="muted">review ${rec.stage + 1} of ${INTERVALS.length} · next gap: ${rec.stage + 1 < INTERVALS.length ? INTERVALS[rec.stage + 1] + " days" : "mastered"}</span>
      <button class="link-btn" data-action="unlearn" data-id="${id}">reset</button></div>`;
  }
  return `<div class="sr-box"><span class="sr-pill scheduled">Review ${rec.stage + 1}/${INTERVALS.length} due in ${d} day${d === 1 ? "" : "s"} (${rec.due})</span>
    <button class="link-btn" data-action="unlearn" data-id="${id}">reset</button></div>`;
}

// ---------- resources helper ----------
function renderResources(key) {
  const res = DATA.resources[key];
  if (!res || !res.length) return "";
  return `<div class="res-row"><span class="res-lbl">Resources</span>${res.map(r => `<a href="${r.url}" target="_blank" rel="noopener">${r.name}</a>`).join("")}</div>`;
}

// ---------- system design ----------
function renderSystem() {
  let out = `<h1>System Design — SDE-2 depth</h1>
  <p class="lede">Fundamentals first (weeks 5–8 weekends), then case studies (weeks 7–11). For every case: read it once, then <strong>redesign it from a blank page</strong> — recognition feels like knowledge but isn't. In 2026, expect "how would you debug/operate this?" follow-ups, and know the two AI cases.</p>
  ${renderResources("system")}
  <h2 class="group-hdr">Fundamentals</h2>`;
  DATA.sdFundamentals.forEach(f => {
    const isOpen = openCards.has(f.id);
    const st = srStatusLabel(f.id);
    out += `<div class="card" id="${f.id}">
      <button class="card-head" data-action="toggle" data-id="${f.id}">
        <span class="card-title">${f.name}</span>
        ${st ? `<span class="sr-pill ${st.cls}">${st.text}</span>` : ""}
        <span class="chev">${isOpen ? "▾" : "▸"}</span>
      </button>
      <div class="card-body" ${isOpen ? "" : "hidden"}>
        <p class="summary">${md(f.summary)}</p>
        ${f.visual ? `<div class="sect">${f.visual}</div>` : ""}
        <ul class="detail-list">${f.details.map(d => `<li>${md(d)}</li>`).join("")}</ul>
        ${srControls(f.id)}
      </div></div>`;
  });
  out += `<h2 class="group-hdr">Case Studies</h2>`;
  DATA.sdCases.forEach(c => {
    const isOpen = openCards.has(c.id);
    const st = srStatusLabel(c.id);
    out += `<div class="card" id="${c.id}">
      <button class="card-head" data-action="toggle" data-id="${c.id}">
        <span class="case-diff">${c.difficulty}</span>
        <span class="card-title">${c.name}</span>
        ${st ? `<span class="sr-pill ${st.cls}">${st.text}</span>` : ""}
        <span class="chev">${isOpen ? "▾" : "▸"}</span>
      </button>
      <div class="card-body" ${isOpen ? "" : "hidden"}>
        <p class="summary">Focus: ${md(c.focus)}</p>
        ${(c.sections || []).map(s => `<div class="sect">
          <div class="sect-label">${s.h}</div>
          ${s.diagram ? s.diagram : ""}
          ${s.items ? `<ul class="detail-list">${s.items.map(it => `<li>${md(it)}</li>`).join("")}</ul>` : ""}
        </div>`).join("")}
        ${srControls(c.id)}
      </div></div>`;
  });
  return out;
}

// ---------- LLD ----------
function renderLLD() {
  let out = `<h1>Low-Level Design — Machine Coding</h1>
  <p class="lede">45–90 minute rounds testing OOP, SOLID, design patterns, and working code. Study the concepts first (SOLID + patterns), then practice full case reps. For each case: clarify → entities → code happy path → extend → demo. Mark learned to track in spaced repetition.</p>
  ${renderResources("lld")}
  <h2 class="group-hdr">Concepts</h2>`;

  DATA.lldFundamentals.forEach(f => {
    const isOpen = openCards.has(f.id);
    const st = srStatusLabel(f.id);
    out += `<div class="card" id="${f.id}">
      <button class="card-head" data-action="toggle" data-id="${f.id}">
        <span class="card-title">${f.name}</span>
        ${st ? `<span class="sr-pill ${st.cls}">${st.text}</span>` : ""}
        <span class="chev">${isOpen ? "▾" : "▸"}</span>
      </button>
      <div class="card-body" ${isOpen ? "" : "hidden"}>
        <p class="summary">${md(f.summary)}</p>
        ${f.visual ? `<div class="sect">${f.visual}</div>` : ""}
        <ul class="detail-list">${f.details.map(d => `<li>${md(d)}</li>`).join("")}</ul>
        ${f.code ? `<div class="sect"><div class="sect-label">Code</div><pre><code>${f.code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre></div>` : ""}
        ${srControls(f.id)}
      </div></div>`;
  });

  out += `<h2 class="group-hdr">Case Studies</h2>`;
  DATA.lldCases.forEach(c => {
    const isOpen = openCards.has(c.id);
    const st = srStatusLabel(c.id);
    out += `<div class="card" id="${c.id}">
      <button class="card-head" data-action="toggle" data-id="${c.id}">
        <span class="case-diff">${c.difficulty}</span>
        <span class="card-title">${c.name}</span>
        ${st ? `<span class="sr-pill ${st.cls}">${st.text}</span>` : ""}
        <span class="chev">${isOpen ? "▾" : "▸"}</span>
      </button>
      <div class="card-body" ${isOpen ? "" : "hidden"}>
        <p class="summary">Focus: ${md(c.focus)}</p>

        <div class="sect"><div class="sect-label">Requirements</div>
          <ul class="detail-list">${c.requirements.map(r => `<li>${md(r)}</li>`).join("")}</ul></div>

        <div class="sect"><div class="sect-label">Entities</div>
          <div class="uml">${c.entities.map(e => `<div class="cls">
            <div class="cls-h">${e.n}${e.s ? ` <em>${e.s}</em>` : ""}</div>
            ${e.a && e.a.length ? `<ul>${e.a.map(a => `<li>${a}</li>`).join("")}</ul>` : ""}
            ${e.m && e.m.length ? `<ul class="mth">${e.m.map(m => `<li>${m}</li>`).join("")}</ul>` : ""}
          </div>`).join("")}</div></div>

        <div class="sect"><div class="sect-label">Relationships</div>
          <ul class="detail-list">${c.relations.map(r => `<li>${md(r)}</li>`).join("")}</ul></div>

        <div class="sect"><div class="sect-label">Design Patterns Used</div>
          <ul class="detail-list">${c.patterns.map(p => `<li>${md(p)}</li>`).join("")}</ul></div>

        <div class="sect"><div class="sect-label">Walkthrough</div>
          <ol class="detail-list">${c.walkthrough.map(w => `<li>${md(w)}</li>`).join("")}</ol></div>

        <div class="sect"><div class="sect-label">Follow-up Probes</div>
          <ul class="detail-list">${c.followups.map(f => `<li>${md(f)}</li>`).join("")}</ul></div>

        ${c.code ? `<div class="sect"><div class="sect-label">Code Skeleton</div>
          <pre><code>${c.code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre></div>` : ""}

        ${srControls(c.id)}
      </div></div>`;
  });
  return out;
}

// ---------- behavioral ----------
function renderBehavioral() {
  const b = DATA.behavioral;
  return `<h1>Behavioral — the underrated round</h1>
  <p class="lede">${md(b.intro)}</p>
  ${renderResources("behavioral")}

  <section class="panel"><h2>STAR, done properly</h2>
    <ul class="detail-list">${b.star.map(s => `<li>${md(s)}</li>`).join("")}</ul></section>

  <section class="panel"><h2>Your 8 stories <span class="muted">— drafts save automatically in your browser</span></h2>
    <p>Write each as STAR bullet points, not a script. Rehearse out loud in week 11.</p>
    ${b.stories.map(s => `<div class="story">
      <div class="story-head"><strong>${s.name}</strong><span class="muted"> — ${s.hint}</span></div>
      <textarea data-action="story" data-id="${s.id}" rows="4"
        placeholder="S: …  T: …  A: …  R: (with a number) …">${(state.stories[s.id] || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</textarea>
    </div>`).join("")}</section>

  <section class="panel"><h2>Leadership principles cheat-sheet <span class="muted">(Amazon names them; every FAANG tests them)</span></h2>
    <div class="lp-grid">${b.principles.map(p => `<div class="lp"><strong>${p.name}</strong><span>${p.tip}</span></div>`).join("")}</div></section>

  <section class="panel"><h2>The 10 questions you will actually get</h2>
    <ol class="q-list">${b.questions.map(q => `<li>${md(q)}</li>`).join("")}</ol></section>`;
}

// ---------- revision ----------
function renderRevision() {
  const t = todayStr();
  const entries = Object.entries(state.sr).map(([id, r]) => ({ ...SR_LOOKUP[id], rec: r })).filter(x => x.id);
  const due = entries.filter(x => x.rec.due && x.rec.due <= t).sort((a, b) => a.rec.due.localeCompare(b.rec.due));
  const upcoming = entries.filter(x => x.rec.due && x.rec.due > t).sort((a, b) => a.rec.due.localeCompare(b.rec.due));
  const mastered = entries.filter(x => x.rec.due === null);

  const row = (x, showBtn) => `<div class="rev-row">
    <span class="rev-kind">${x.kind}</span>
    <button class="link-btn rev-name" data-action="goto-item" data-view="${x.view}" data-id="${x.id}">${x.name}</button>
    <span class="muted">review ${x.rec.stage + 1}/${INTERVALS.length}${x.rec.due ? " · " + (x.rec.due <= t ? (daysBetween(x.rec.due, t) > 0 ? daysBetween(x.rec.due, t) + "d overdue" : "due today") : "due " + x.rec.due) : ""}</span>
    ${showBtn ? `<button class="btn btn-sm" data-action="review" data-id="${x.id}">Done ✓</button>` : ""}
  </div>`;

  return `<h1>Revision queue</h1>
  <p class="lede">The 1 → 3 → 7 → 14 → 35-day ladder. Each review must be <strong>retrieval, not re-reading</strong>: for a DSA pattern, re-type its template from memory and re-solve one of its problems cold; for a system design topic, redraw the design/flow on blank paper, then check what you missed. If a review feels shaky, hit reset and relearn — honesty here is what makes the schedule work.</p>

  <section class="panel">
    <h2>Due now ${due.length ? `<span class="due-count">${due.length}</span>` : ""}</h2>
    ${due.length ? due.map(x => row(x, true)).join("") : `<p class="muted">Nothing due — queue is clear ✓</p>`}
  </section>

  <section class="panel">
    <h2>Scheduled</h2>
    ${upcoming.length ? upcoming.map(x => row(x, false)).join("") : `<p class="muted">Nothing scheduled yet. Mark topics as learned to start their clocks.</p>`}
  </section>

  ${mastered.length ? `<section class="panel"><h2>Mastered <span class="muted">${mastered.length}</span></h2>
    ${mastered.map(x => `<div class="rev-row"><span class="rev-kind">${x.kind}</span><span class="rev-name">${x.name}</span><span class="sr-pill mastered">✓</span></div>`).join("")}</section>` : ""}

  <section class="panel method"><h2>Why these intervals</h2>
    <p>Reviews land at <strong>1, 3, 7, 14 and 35 days</strong> after learning — expanding gaps timed to catch memories just before they fade. A meta-analysis of 254 studies (Cepeda et al., 2006, 14,000+ participants) found spaced study reliably beats cramming, and retrieval practice roughly <strong>1.5×</strong>'s long-term recall vs re-reading (Karpicke & Roediger, 2008). Five successful spaced retrievals is a strong proxy for "will still be there in the interview."</p></section>`;
}

// ---------- Company Prep ----------
function renderCurator() {
  const paths = DATA.customPaths ? Object.entries(DATA.customPaths) : [];
  const activeId = state.activeCustomPathId || (paths.length > 0 ? paths[0][0] : null);
  const activePath = DATA.customPaths ? DATA.customPaths[activeId] : null;

  let mainContent = "";
  if (!activePath) {
    mainContent = `
      <div class="curator-form-panel">
        <h2>No Curated Paths Available</h2>
        <p class="lede">No custom paths have been pre-committed. Ask the AI assistant to curate and add paths directly in the code.</p>
      </div>
    `;
  } else {
    let totalItems = 0;
    let completedItems = 0;
    activePath.weeks.forEach((w, weekIdx) => {
      w.items.forEach((it, itemIdx) => {
        totalItems++;
        const key = `${activeId}::${weekIdx}::${itemIdx}`;
        if (state.customSolved[key]) completedItems++;
      });
    });
    const pct = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

    mainContent = `
      <div class="curator-meta-strip">
        <div class="curator-title-area">
          <h2>${md(activePath.jobTitle)}</h2>
          ${activePath.jobUrl ? `<p class="muted"><a href="${activePath.jobUrl}" target="_blank" rel="noopener">${activePath.jobUrl}</a></p>` : ""}
        </div>
        <div class="curator-meta-details">
          <div>Progress: <strong>${completedItems}/${totalItems}</strong> completed (${pct}%)</div>
        </div>
      </div>
      
      <div class="meter" style="margin-bottom:1.5rem"><div class="meter-fill" style="width:${pct}%"></div></div>
      
      <div class="curator-roadmap-container">
        ${activePath.weeks.map((w, weekIdx) => {
          return `
            <div class="curator-week-card">
              <div class="curator-week-header">
                <span class="curator-week-title">${w.title}</span>
                <span class="curator-week-desc">${w.desc}</span>
              </div>
              <div class="curator-week-body">
                ${w.items.map((it, itemIdx) => {
                  const key = `${activeId}::${weekIdx}::${itemIdx}`;
                  const isDone = !!state.customSolved[key];
                  let tagClass = "custom";
                  let tagText = "custom task";
                  let actionBtn = "";
                  
                  if (it.type === "dsa") { tagClass = "dsa"; tagText = "DSA Pattern"; actionBtn = `<button class="chip" data-action="goto-item" data-view="dsa" data-id="${it.refId}">Go to DSA</button>`; }
                  else if (it.type === "system") { tagClass = "system"; tagText = "HLD Topic"; actionBtn = `<button class="chip chip-sd" data-action="goto-item" data-view="system" data-id="${it.refId}">Go to HLD</button>`; }
                  else if (it.type === "lld") { tagClass = "lld"; tagText = "LLD Concept"; actionBtn = `<button class="chip chip-lld" data-action="goto-item" data-view="lld" data-id="${it.refId}">Go to LLD</button>`; }
                  else if (it.type === "problem") {
                    tagClass = "problem";
                    tagText = "Coding Problem";
                    const prob = DATA.problems ? DATA.problems[it.refId] : null;
                    if (prob) {
                      actionBtn = `<a href="${prob.url}" target="_blank" rel="noopener" class="chip chip-prob" style="text-decoration:none;">Solve ↗</a>`;
                    }
                  }
                  
                  return `
                    <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom: 1px solid var(--hairline); padding:0.4rem 0;">
                      <label class="check-row" style="flex:1;">
                        <input type="checkbox" data-action="curator-item-toggle" data-path-id="${activeId}" data-week-idx="${weekIdx}" data-item-idx="${itemIdx}" ${isDone ? "checked" : ""}>
                        <span>
                          <span class="curator-tag ${tagClass}">${tagText}</span>
                          ${md(it.text)}
                        </span>
                      </label>
                      ${actionBtn}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  const sidebarItems = paths.map(([id, p]) => {
    return `<button class="curator-item-btn ${id === activeId ? "active" : ""}" data-action="curator-select" data-id="${id}">
      ${md(p.jobTitle)}
    </button>`;
  }).join("");

  return `
    <h1>Company Prep</h1>
    <p class="lede">Review custom prep roadmaps specifically aligned with target roles, keeping your general 12-week FAANG study path intact.</p>
    
    <div class="curator-grid">
      <div class="curator-sidebar">
        <div class="curator-list-title">Target Roles</div>
        ${sidebarItems}
      </div>
      <div class="curator-main">
        ${mainContent}
      </div>
    </div>
  `;
}

// ---------- events ----------
function bindEvents(root) {
  root.querySelectorAll("[data-action]").forEach(el => {
    const act = el.dataset.action;
    if (act === "story") {
      el.addEventListener("input", () => { state.stories[el.dataset.id] = el.value; save(); });
      return;
    }
    el.addEventListener(el.tagName === "INPUT" ? "change" : "click", (e) => {
      const id = el.dataset.id;
      switch (act) {
        case "toggle":
          openCards.has(id) ? openCards.delete(id) : openCards.add(id);
          render();
          document.getElementById(id)?.scrollIntoView({ block: "nearest" });
          break;
        case "goal":
          if (el.checked) { state.goals[id] = true; logActivity(); } else delete state.goals[id];
          save(); render(); break;
        case "solve":
          if (el.checked) { state.solved[id] = true; logActivity(); } else delete state.solved[id];
          save(); render(); break;
        case "learn": markLearned(id); break;
        case "review": markReviewed(id); break;
        case "unlearn":
          if (confirm("Reset this topic's revision schedule?")) unlearn(id);
          break;
        case "goto": setView(el.dataset.view); break;
        case "goto-item":
          setView(el.dataset.view);
          openCards.add(id); render();
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        case "edit-start": {
          const v = prompt("Prep start date (YYYY-MM-DD) — sets your current week:", state.startDate);
          if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) { state.startDate = v; save(); render(); }
          break;
        }
        case "curator-select":
          state.activeCustomPathId = id;
          save(); render(); break;
        case "curator-item-toggle":
          const pathId = el.dataset.pathId;
          const weekIdx = parseInt(el.dataset.weekIdx);
          const itemIdx = parseInt(el.dataset.itemIdx);
          const key = `${pathId}::${weekIdx}::${itemIdx}`;
          if (el.checked) {
            state.customSolved[key] = true;
            logActivity();
          } else {
            delete state.customSolved[key];
          }
          save(); render(); break;
      }
    });
  });
}

// ---------- theme ----------
function applyTheme() {
  const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const t = state.theme || sys;
  document.documentElement.dataset.theme = t;
  document.getElementById("theme-btn").textContent = t === "dark" ? "☀" : "☾";
}
document.getElementById("theme-btn").addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme;
  state.theme = cur === "dark" ? "light" : "dark";
  save(); applyTheme();
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

// ---------- nav ----------
document.querySelectorAll(".nav-btn").forEach(b =>
  b.addEventListener("click", () => setView(b.dataset.view)));
window.addEventListener("hashchange", () => {
  const v = location.hash.replace("#", "");
  if (VIEWS.includes(v) && v !== activeView) { activeView = v; render(); }
});

applyTheme();
render();
