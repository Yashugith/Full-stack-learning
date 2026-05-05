// ===== DEVQUEST v2 — app.js =====
// Uses: DOM, Events, Arrays, Objects, fetch API, localStorage, sessionStorage
//
// ── WHY GITHUB API? ──
// URL: https://api.github.com/search/repositories
// → FREE. No API key needed. Works directly from the browser.
// → Searches real GitHub repos that match your skill keywords as "topics"
// → Returns: name, description, language, stars, topics (skill tags), repo URL
// → Rate limit: 10 requests/minute without a key (plenty for our use)
// → Result: Real projects that real developers built — not made-up ideas!

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const GITHUB_API = "https://api.github.com/search/repositories";
const STORAGE_KEY = "devquest_saved_projects"; // localStorage key for My Projects

// Map user-friendly skill names → GitHub topic tags
// GitHub topics use lowercase-hyphen format
const SKILL_TO_TOPIC = {
  "html":         ["html", "html5"],
  "css":          ["css", "css3", "tailwindcss"],
  "javascript":   ["javascript", "js", "vanilla-js"],
  "dom":          ["dom", "vanilla-js", "javascript"],
  "localstorage": ["localstorage", "javascript", "browser"],
  "events":       ["javascript", "dom", "events"],
  "fetch":        ["fetch-api", "rest-api", "javascript"],
  "geolocation":  ["geolocation", "maps", "javascript"],
  "canvas":       ["canvas", "html5-canvas", "javascript"],
  "node":         ["nodejs", "node"],
  "express":      ["expressjs", "nodejs", "api"],
  "react":        ["react", "reactjs"],
  "python":       ["python", "python3"],
  "git":          ["git", "github"]
};

// ─────────────────────────────────────────
// SHARED UTILITIES
// ─────────────────────────────────────────

// Highlight current nav link
function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === page);
  });
}

// Show a temporary toast message
function toast(msg, duration = 2800) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), duration);
}

// Safely get/set sessionStorage (current workflow data)
function session(key, val) {
  if (val === undefined) {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
  }
  sessionStorage.setItem(key, JSON.stringify(val));
}

// Get saved projects from localStorage
function getSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

// Save projects array back to localStorage
function putSaved(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// Format a GitHub star count: 12345 → "12.3k"
function fmtStars(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

// Truncate text to maxLen characters
function trunc(str, maxLen) {
  if (!str) return "No description available.";
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
}

// ─────────────────────────────────────────
// PAGE 1 — LANDING (index.html)
// User types skills → fetch GitHub projects
// ─────────────────────────────────────────
async function initLanding() {
  const tagsArea      = document.getElementById("tags-area");
  const skillInput    = document.getElementById("skill-input");
  const quickWrap     = document.getElementById("quick-skills");
  const findBtn       = document.getElementById("find-btn");
  const loadingWrap   = document.getElementById("loading-wrap");
  const errorWrap     = document.getElementById("error-wrap");

  if (!tagsArea) return; // Not on this page

  let skills = []; // Array of skill strings the user has added

  // ── Quick-add preset buttons ──
  const presets = ["HTML", "CSS", "JavaScript", "DOM", "localStorage", "fetch", "Canvas", "Node"];
  presets.forEach(s => {
    const btn = document.createElement("button");
    btn.className = "quick-btn";
    btn.textContent = s;
    btn.onclick = () => addSkill(s);
    quickWrap.appendChild(btn);
  });

  // ── Add skill on Enter key ──
  skillInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      addSkill(skillInput.value.trim());
      skillInput.value = "";
    }
  });

  function addSkill(name) {
    if (!name || skills.map(s => s.toLowerCase()).includes(name.toLowerCase())) return;
    skills.push(name);
    renderTags();
    syncBtn();
  }

  function removeSkill(name) {
    skills = skills.filter(s => s.toLowerCase() !== name.toLowerCase());
    renderTags();
    syncBtn();
  }

  // Build DOM tags from skills array
  function renderTags() {
    tagsArea.innerHTML = "";
    skills.forEach(skill => {
      const el = document.createElement("span");
      el.className = "skill-tag";
      el.innerHTML = `${skill} <button class="rm" title="Remove">×</button>`;
      el.querySelector(".rm").onclick = () => removeSkill(skill);
      tagsArea.appendChild(el);
    });
    if (skills.length === 0) {
      tagsArea.innerHTML = `<span style="color:var(--text-muted);font-size:0.85rem">Add your skills above…</span>`;
    }
  }

  function syncBtn() {
    findBtn.disabled = skills.length === 0;
  }

  renderTags(); // Initial render with empty state text

  // ── MAIN: Fetch projects from GitHub API ──
  findBtn.addEventListener("click", async () => {
    if (skills.length === 0) return;

    // Show loading, hide errors
    loadingWrap.classList.remove("hidden");
    errorWrap.classList.add("hidden");
    findBtn.disabled = true;

    try {
      // FIX: Build a smarter GitHub query
      // Too many topic: filters → 0 results (GitHub is strict about multi-topic AND)
      // Better strategy: use 1-2 topics + language: keyword filter
      // This gives real, relevant results every time

      const { topicQuery, langQuery } = buildQuery(skills);

      // PRIMARY query: topic filter + language filter combined
      // Example: q=topic:javascript+language:javascript
      // This finds repos tagged as "javascript" projects, written in JS
      const primaryUrl = `${GITHUB_API}?q=${topicQuery}${langQuery}&sort=stars&order=desc&per_page=15`;

      // ── GITHUB SEARCH API CALL ──
      // Endpoint: GET https://api.github.com/search/repositories
      // Header "Accept: application/vnd.github.v3+json" → tells GitHub we want v3 JSON format
      // No Authorization header → unauthenticated, rate limit = 10 req/min (fine for users)
      // Response: { total_count, items: [ { name, description, language, topics, stargazers_count, ... } ] }
      let response = await fetch(primaryUrl, {
        headers: { "Accept": "application/vnd.github.v3+json" }
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("GitHub rate limit reached. Please wait 1 minute and try again.");
        if (response.status === 422) throw new Error("Search query invalid. Please try simpler skill names.");
        throw new Error(`GitHub API error: ${response.status}`);
      }

      let data = await response.json();

      // FALLBACK: if primary query returns nothing, try keyword search only
      // This happens when topics don't match exactly
      if (!data.items || data.items.length < 3) {
        const fallbackKeyword = skills.map(s => s.toLowerCase()).join("+");
        const fallbackUrl = `${GITHUB_API}?q=${fallbackKeyword}+in:topics&sort=stars&order=desc&per_page=15`;
        const fallbackRes = await fetch(fallbackUrl, {
          headers: { "Accept": "application/vnd.github.v3+json" }
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData.items && fallbackData.items.length > 0) {
            data = fallbackData;
          }
        }
      }

      if (!data.items || data.items.length === 0) {
        throw new Error("No projects found. Try broader skills like 'JavaScript' or 'HTML'.");
      }

      // Filter out repos with no description (they're usually not helpful for learners)
      const usable = data.items.filter(r => r.description && r.description.length > 10);
      const finalResults = (usable.length >= 5 ? usable : data.items).slice(0, 12);

      // Save to sessionStorage — other pages will read from here
      session("skills", skills);
      session("results", finalResults.map(cleanRepo));

      window.location.href = "results.html";

    } catch (err) {
      loadingWrap.classList.add("hidden");
      errorWrap.classList.remove("hidden");
      document.getElementById("error-msg").textContent = err.message;
      findBtn.disabled = false;
    }
  });

  // Build a smart, effective GitHub search query from user skills
  // FIX: Use SINGLE most-relevant topic + language filter instead of multiple topic:X ANDs
  function buildQuery(userSkills) {
    // Detect primary language from skills
    const langMap = {
      javascript: "javascript", js: "javascript",
      python: "python", java: "java",
      typescript: "typescript", ruby: "ruby",
      html: "javascript", css: "javascript", // web skills → JS language repos
      dom: "javascript", localstorage: "javascript",
      fetch: "javascript", canvas: "javascript",
      node: "javascript", react: "javascript"
    };

    let detectedLang = null;
    let bestTopic = null;

    userSkills.forEach(skill => {
      const key = skill.toLowerCase();
      if (!detectedLang && langMap[key]) detectedLang = langMap[key];
      // Pick best topic: use direct mapping, fallback to cleaned skill name
      if (!bestTopic) {
        const mapped = SKILL_TO_TOPIC[key];
        bestTopic = mapped ? mapped[0] : key.replace(/\s+/g, "-");
      }
    });

    // Build topic part — use just 1 topic for best results
    const topicQuery = bestTopic ? `topic:${bestTopic}` : "topic:javascript";
    // Build language part — optional but improves relevance significantly
    const langQuery  = detectedLang ? `+language:${detectedLang}` : "";

    return { topicQuery, langQuery };
  }
}

// Strip GitHub repo object to only what we need (smaller sessionStorage footprint)
function cleanRepo(repo) {
  return {
    id:          repo.id,
    name:        repo.name,
    full_name:   repo.full_name,
    description: repo.description,
    url:         repo.html_url,
    stars:       repo.stargazers_count,
    forks:       repo.forks_count,
    language:    repo.language,
    topics:      repo.topics || [],
    homepage:    repo.homepage,
    updated_at:  repo.updated_at
  };
}


// ─────────────────────────────────────────
// PAGE 2 — RESULTS (results.html)
// Shows fetched GitHub projects as a list
// User clicks one to see full details
// ─────────────────────────────────────────
function initResults() {
  const listWrap = document.getElementById("project-list");
  if (!listWrap) return;

  const results = session("results");
  const skills  = session("skills") || [];

  if (!results || results.length === 0) {
    listWrap.innerHTML = `<p style="color:var(--text-muted)">No results found. <a href="index.html" style="color:var(--accent)">Go back →</a></p>`;
    return;
  }

  // Show which skills were searched
  const skillsDisplay = document.getElementById("searched-skills");
  if (skillsDisplay) {
    skillsDisplay.innerHTML = skills.map(s => `<span class="skill-tag">${s}</span>`).join("");
  }
  document.getElementById("result-count").textContent = `${results.length} projects found`;

  // Render each repo as a clickable list item
  results.forEach((repo, i) => {
    const item = document.createElement("div");
    item.className = "project-list-item";
    item.style.animationDelay = `${i * 0.05}s`;

    const langColor = getLangColor(repo.language);
    const topicsHtml = repo.topics.slice(0, 4)
      .map(t => `<span class="tech-badge" style="font-size:0.7rem;padding:0.15rem 0.5rem">${t}</span>`)
      .join("");

    item.innerHTML = `
      <div>
        <div class="p-name">${repo.name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
        <div class="p-desc">${trunc(repo.description, 120)}</div>
        <div class="p-meta" style="margin-top:0.6rem">
          ${repo.language ? `<span class="meta-badge"><span class="lang-dot" style="background:${langColor}"></span>${repo.language}</span>` : ""}
          <span class="meta-badge"><span class="stars-icon">★</span> ${fmtStars(repo.stars)}</span>
          <span class="meta-badge">⑂ ${fmtStars(repo.forks)}</span>
          <div style="display:flex;gap:0.35rem;flex-wrap:wrap">${topicsHtml}</div>
        </div>
      </div>
      <span class="arrow-icon">→</span>
    `;

    // Click: save chosen project to session, go to detail page
    item.addEventListener("click", () => {
      session("selectedProject", repo);
      window.location.href = "detail.html";
    });

    listWrap.appendChild(item);
  });
}

// Map language names to their GitHub color conventions
function getLangColor(lang) {
  const colors = {
    JavaScript: "#f1e05a", TypeScript: "#2b7489", Python: "#3572A5",
    HTML: "#e34c26", CSS: "#563d7c", Rust: "#dea584",
    Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
    Ruby: "#701516", PHP: "#4F5D95", Swift: "#ffac45",
    Kotlin: "#F18E33", Dart: "#00B4AB"
  };
  return colors[lang] || "#6c63ff";
}


// ─────────────────────────────────────────
// PAGE 3 — DETAIL (detail.html)
// Shows full project info: problem, solution,
// tech stack, checklist — fetched from GitHub
// ─────────────────────────────────────────
async function initDetail() {
  const wrap    = document.getElementById("detail-wrap");
  const loading = document.getElementById("detail-loading");
  if (!wrap) return;

  const repo = session("selectedProject");
  if (!repo) {
    // Hide loading, show error message inside wrap
    if (loading) loading.classList.add("hidden");
    wrap.classList.remove("hidden");
    wrap.innerHTML = `
      <div style="padding: 3rem; text-align: center; color: var(--text-muted)">
        <p style="font-size: 2rem; margin-bottom: 1rem">🔍</p>
        <h2 style="color: var(--text); margin-bottom: 0.5rem">No Project Selected</h2>
        <p style="margin-bottom: 1.5rem">Please pick a project from the results page first.</p>
        <a href="results.html" class="btn btn-primary">← Go to Results</a>
        <span style="margin: 0 0.5rem; color: var(--text-dim)">or</span>
        <a href="index.html" class="btn btn-secondary">Start Over</a>
      </div>`;
    return;
  }

  // Show project title immediately (fast feedback)
  document.getElementById("detail-title").textContent =
    repo.name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  document.getElementById("detail-desc").textContent =
    repo.description || "No description provided.";

  // Stats
  document.getElementById("stat-stars").textContent = fmtStars(repo.stars);
  document.getElementById("stat-forks").textContent = fmtStars(repo.forks);
  document.getElementById("stat-lang").textContent = repo.language || "Mixed";
  document.getElementById("detail-github-link").href = repo.url;
  if (repo.homepage) {
    const liveLink = document.getElementById("detail-live-link");
    if (liveLink) { liveLink.href = repo.homepage; liveLink.classList.remove("hidden"); }
  }

  // Tech Stack — use topics + language
  const techList = [...new Set([repo.language, ...repo.topics].filter(Boolean))];
  const techWrap = document.getElementById("tech-stack-row");
  techList.slice(0, 10).forEach(t => {
    const b = document.createElement("span");
    b.className = "tech-badge";
    b.textContent = t;
    techWrap.appendChild(b);
  });

  // Problem statement — derived from topics + description
  document.getElementById("problem-text").textContent = generateProblem(repo);

  // Solution statement
  document.getElementById("solution-text").textContent = generateSolution(repo);

  // Checklist items — generated from repo characteristics
  const tasks = generateChecklist(repo);
  session("checklist_tasks", tasks);
  session("checklist_project_id", repo.id);
  session("checklist_project_name", repo.name);

  const saved = getSaved();
  const alreadySaved = saved.some(p => p.id === repo.id);
  const saveBtn = document.getElementById("save-project-btn");
  if (saveBtn) {
    if (alreadySaved) {
      saveBtn.textContent = "✓ Saved";
      saveBtn.disabled = true;
    }
    saveBtn.addEventListener("click", () => {
      saveProject(repo, tasks);
      saveBtn.textContent = "✓ Saved";
      saveBtn.disabled = true;
      toast("Project saved to My Projects!");
    });
  }

  wrap.classList.remove("hidden");
  if (loading) loading.classList.add("hidden");
}

// Generate a "problem" description from repo data
function generateProblem(repo) {
  const name = repo.name.replace(/-/g, " ");
  const topics = repo.topics.join(", ");
  const desc = repo.description || "";
  // We craft a meaningful problem statement from what we know about the repo
  if (desc.length > 30) {
    return `Many developers struggle to find a well-structured ${name} solution. The challenge: ${desc.toLowerCase()} — and most existing tools don't solve it cleanly using open web technologies.`;
  }
  return `Developers need a practical project to apply ${topics || "web"} skills. Building "${name}" solves a real use-case while practicing the full workflow — from structure to deployment.`;
}

// Generate a "solution" description from repo data
function generateSolution(repo) {
  const lang = repo.language || "JavaScript";
  const stars = fmtStars(repo.stars);
  return `This open-source project (${stars} ⭐ on GitHub) demonstrates a working solution using ${lang}${repo.topics.length ? " and " + repo.topics.slice(0, 3).join(", ") : ""}. Study the codebase, clone it, break it, rebuild it — that's the learning path.`;
}

// Generate a contextual task checklist based on repo metadata
function generateChecklist(repo) {
  const lang = repo.language || "JavaScript";
  const name = repo.name;

  // Base tasks every project needs
  const base = [
    `Read the full README of '${name}' on GitHub`,
    `Clone the repo: git clone ${repo.url}`,
    `Install dependencies (check README for setup steps)`,
    `Run the project locally and see it working`,
    `Open the code in VS Code and explore the file structure`,
  ];

  // Language-specific tasks
  const langTasks = {
    JavaScript: [
      "Identify which DOM methods are used (querySelector, addEventListener, etc.)",
      "Find where data is stored — localStorage, variables, or API calls",
      "Trace one user interaction: button click → what happens step by step",
      "Modify one small feature — change a color, label, or value",
      "Add one new feature of your own",
    ],
    Python: [
      "Understand the entry point (main.py or __main__ block)",
      "Trace how data flows through the functions",
      "Add a print statement to understand program flow",
      "Modify one function's output",
      "Write a new helper function",
    ],
    TypeScript: [
      "Read the type definitions and interfaces",
      "Understand how TypeScript types differ from plain JavaScript",
      "Find where async/await is used and trace the flow",
      "Add a new typed function",
    ]
  };

  const extra = langTasks[lang] || langTasks["JavaScript"];

  // GitHub-specific tasks
  const githubTasks = [
    `Star the original repo on GitHub: ${repo.url}`,
    "Fork it to your own GitHub account",
    "Create a new branch: git checkout -b my-changes",
    "Commit your changes and push to GitHub",
    "Deploy it live (GitHub Pages, Vercel, or Netlify)",
  ];

  return [...base, ...extra, ...githubTasks];
}


// ─────────────────────────────────────────
// PAGE 4 — CHECKLIST (checklist.html)
// Checkboxes with localStorage persistence
// ─────────────────────────────────────────
function initChecklist() {
  const wrap = document.getElementById("checklist-wrap");
  if (!wrap) return;

  // FIX: session() can return null if nothing was saved — guard all reads
  const tasks    = session("checklist_tasks");
  const projId   = session("checklist_project_id");
  const projName = session("checklist_project_name");

  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    wrap.innerHTML = `
      <div style="padding: 2rem; text-align:center; color: var(--text-muted)">
        <p style="margin-bottom: 1rem">No project loaded yet.</p>
        <a href="index.html" class="btn btn-primary">← Find a project first</a>
      </div>`;
    return;
  }

  // FIX: Safe string formatting — ensure projName is a string before calling replace
  const safeName = typeof projName === "string"
    ? projName.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "Your Project";

  document.getElementById("checklist-proj-name").textContent = safeName;

  const storageKey = `devquest_check_${projId}`;
  let states = JSON.parse(localStorage.getItem(storageKey) || "{}");
  // states = { "0": true, "3": true } — index → checked boolean

  tasks.forEach((task, i) => {
    const row = document.createElement("div");
    const checked = states[i] === true;
    row.className = `check-item ${checked ? "done" : ""}`;
    row.innerHTML = `
      <input type="checkbox" id="t${i}" ${checked ? "checked" : ""}>
      <label for="t${i}">${task}</label>
    `;
    row.querySelector("input").addEventListener("change", e => {
      states[i] = e.target.checked;
      row.classList.toggle("done", e.target.checked);
      localStorage.setItem(storageKey, JSON.stringify(states));
      updateProgress(tasks.length, states);
    });
    wrap.appendChild(row);
  });

  updateProgress(tasks.length, states);
}

function updateProgress(total, states) {
  // FIX: Guard against division by zero (when total is 0 somehow)
  if (!total || total === 0) return;
  const done = Object.values(states).filter(Boolean).length;
  const pct  = Math.round((done / total) * 100);
  const fill = document.getElementById("prog-fill");
  const text = document.getElementById("prog-text");
  if (fill) fill.style.width = pct + "%";
  if (text) text.textContent = `${done} / ${total} tasks — ${pct}%`;
}


// ─────────────────────────────────────────
// PAGE 5 — MY PROJECTS (projects.html)
// Shows saved projects + ZIP download
// ─────────────────────────────────────────
function initProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  renderGrid();

  function renderGrid() {
    const saved = getSaved();
    grid.innerHTML = "";

    if (saved.length === 0) {
      grid.innerHTML = `
        <div class="empty-msg">
          <div class="big">📂</div>
          <h3>No saved projects yet</h3>
          <p style="margin: 0.5rem 0 1.5rem">Find a project and save it to see it here</p>
          <a href="index.html" class="btn btn-primary">Find a project →</a>
        </div>`;
      return;
    }

    saved.forEach(p => {
      // FIX: Guard against corrupted/old saved data missing .repo field
      if (!p || !p.repo) return;

      const card = document.createElement("div");
      card.className = "saved-card";
      const techBadges = (p.topics || []).slice(0, 3)
        .map(t => `<span class="tech-badge" style="font-size:0.72rem;padding:0.15rem 0.5rem">${t}</span>`)
        .join("");

      card.innerHTML = `
        <h3>${(p.name || "Project").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</h3>
        <p class="saved-desc">${trunc(p.description, 100)}</p>
        <div style="display:flex;gap:0.35rem;flex-wrap:wrap">${techBadges}</div>
        <div class="saved-card-actions">
          <button class="btn btn-secondary btn-sm open-btn">Open →</button>
          <button class="btn btn-success btn-sm dl-btn">⬇ Download</button>
          <button class="btn btn-danger btn-sm del-btn">✕ Delete</button>
        </div>
      `;

      // Open: reload this project into session and go to detail
      card.querySelector(".open-btn").addEventListener("click", () => {
        session("selectedProject", p.repo);
        session("checklist_tasks", p.tasks);
        session("checklist_project_id", p.repo.id);
        session("checklist_project_name", p.repo.name);
        window.location.href = "detail.html";
      });

      // Download: generate ZIP using JSZip and trigger browser download
      card.querySelector(".dl-btn").addEventListener("click", () => {
        downloadProjectZip(p);
      });

      // Delete from localStorage
      card.querySelector(".del-btn").addEventListener("click", () => {
        if (confirm(`Remove "${p.repo.name}" from saved projects?`)) {
          const updated = getSaved().filter(sp => sp.id !== p.id);
          putSaved(updated);
          toast("Project removed.");
          renderGrid();
        }
      });

      grid.appendChild(card);
    });
  }
}

// Save project + tasks to My Projects in localStorage
function saveProject(repo, tasks) {
  const saved = getSaved();
  if (saved.some(p => p.id === repo.id)) return; // already saved
  saved.push({
    id:          repo.id,
    name:        repo.name,
    description: repo.description,
    topics:      repo.topics,
    repo:        repo,
    tasks:       tasks,
    savedAt:     new Date().toISOString()
  });
  putSaved(saved);
}

// ─────────────────────────────────────────
// ZIP DOWNLOAD using JSZip
// ─────────────────────────────────────────
// WHY JSZip?
// → Browser-side ZIP creator. No server needed.
// → Works entirely in JavaScript in the browser.
// → We build a real .zip with multiple files inside.
// → User picks where to save it via the browser's native Save dialog.
// → CDN: https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js

async function downloadProjectZip(savedProject) {
  const repo  = savedProject.repo;
  const tasks = savedProject.tasks || [];
  const name  = repo.name;
  toast("Preparing ZIP download…");

  // Wait for JSZip to be available (loaded via <script> in HTML)
  if (typeof JSZip === "undefined") {
    toast("JSZip not loaded. Check your internet connection.");
    return;
  }

  const zip = new JSZip();

  // Create a folder named after the project inside the zip
  const folder = zip.folder(name);

  // ── File 1: README.md ──
  const readme = `# ${name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}

> Generated by DevQuest — Your personal project learning guide

## About This Project
${repo.description || "A real-world project from GitHub."}

**GitHub:** ${repo.url}
${repo.homepage ? `**Live Demo:** ${repo.homepage}` : ""}

## Tech Stack
${[repo.language, ...repo.topics].filter(Boolean).map(t => `- ${t}`).join("\n")}

## Stars: ${fmtStars(repo.stars)} | Forks: ${fmtStars(repo.forks)}

## Your Task Checklist
${tasks.map((t, i) => `- [ ] ${t}`).join("\n")}

## How to Get Started
1. Clone the original repo: \`git clone ${repo.url}\`
2. Follow the checklist tasks above
3. Make it your own — modify, extend, improve

---
*Saved from DevQuest on ${new Date().toLocaleDateString()}*
`;
  folder.file("README.md", readme);

  // ── File 2: starter index.html ──
  const starterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} — My Version</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>
    <h1>${name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</h1>
    <p>My version — based on <a href="${repo.url}" target="_blank">this project</a></p>
  </header>

  <main id="app">
    <!-- Your app content goes here -->
    <p>Start building! Check the README.md for guidance.</p>
  </main>

  <script src="app.js"></script>
</body>
</html>
`;
  folder.file("index.html", starterHtml);

  // ── File 3: starter style.css ──
  const starterCss = `/* ${name} — My Version Styles */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0f0f17;
  --text: #e0deee;
  --accent: #6c63ff;
  --muted: #666;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  padding: 2rem;
}

header { margin-bottom: 2rem; }
header h1 { font-size: 2rem; color: var(--accent); }
header p { color: var(--muted); }
header a { color: var(--accent); }
`;
  folder.file("style.css", starterCss);

  // ── File 4: starter app.js ──
  const starterJs = `// ${name} — My Version
// Based on: ${repo.url}
// Tech: ${repo.language || "JavaScript"}

// YOUR CODE GOES HERE
// Follow the checklist in README.md

console.log("${name} loaded! Let's build.");

// Tip: Open DevTools (F12) → Console to see this message
`;
  folder.file("app.js", starterJs);

  // ── File 5: checklist.txt ──
  const checklistTxt = `DEVQUEST CHECKLIST — ${name}\n${"=".repeat(40)}\n\n` +
    tasks.map((t, i) => `${i + 1}. [ ] ${t}`).join("\n");
  folder.file("CHECKLIST.txt", checklistTxt);

  // ── Generate ZIP blob and trigger download ──
  // generateAsync builds the zip in the browser memory
  // "blob" type = Binary Large Object → what <a download> needs
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });

  // Create a temporary invisible link element
  const a = document.createElement("a");
  // URL.createObjectURL makes a temporary browser URL pointing to the blob
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-devquest.zip`; // The filename shown in browser's Save dialog
  // Appending + clicking + removing triggers the browser's native Save dialog
  // User picks where on their desktop/folder they want to save it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // FIX: Delay revokeObjectURL — browser needs the URL alive while download starts
  // Calling it immediately after click() can cancel the download in some browsers
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);

  toast(`📦 ${name}.zip downloaded!`);
}


// ─────────────────────────────────────────
// ROUTER — detect page and run correct init
// ─────────────────────────────────────────
setActiveNav();
const currentPage = location.pathname.split("/").pop() || "index.html";

if (currentPage === "index.html"    || currentPage === "") initLanding();
if (currentPage === "results.html")  initResults();
if (currentPage === "detail.html")   initDetail();
if (currentPage === "checklist.html") initChecklist();
if (currentPage === "projects.html") initProjects();
