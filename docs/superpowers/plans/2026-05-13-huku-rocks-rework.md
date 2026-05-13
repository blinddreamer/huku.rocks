# huku.rocks Rework — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React/Vite site with a pure static `index.html` + `style.css` page matching the Claude design handoff pixel-for-pixel.

**Architecture:** Two files (`index.html` + `style.css`) served by `nginx:alpine` in Docker. No build step, no JavaScript framework. Statcounter analytics snippet preserved. Social links remain as placeholder URLs for the owner to fill in.

**Tech Stack:** HTML5, CSS3, `nginx:alpine` (Docker)

---

## File map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `index.html` | HTML shell, markup, SVG icons, Statcounter |
| Create | `style.css` | All design tokens, layout, typography, hover transitions |
| Modify | `Dockerfile` | Switch from Node/serve to nginx:alpine |
| Modify | `.dockerignore` | Exclude only `.git` and `docs/` |
| Modify | `.gitignore` | Strip Node-specific entries |
| Delete | `src/` | Entire React source tree |
| Delete | `package.json`, `yarn.lock`, `eslint.config.js`, `vite.config.js`, `renovate.json` | Build tooling no longer needed |
| Keep | `public/favicon.ico` | Served as `/favicon.ico` |
| Keep | `.github/workflows/docker-image.yml` | CI already does plain `docker build` — no changes needed |

---

### Task 1: Remove old React/Vite artifacts

**Files:**
- Delete: `src/`
- Delete: `package.json`, `yarn.lock`, `eslint.config.js`, `vite.config.js`, `renovate.json`
- Modify: `.gitignore`

- [ ] **Step 1: Delete source tree and build config**

```powershell
Remove-Item -Recurse -Force "src"
Remove-Item -Force "package.json", "yarn.lock", "eslint.config.js", "vite.config.js", "renovate.json"
```

- [ ] **Step 2: Delete node_modules if present**

```powershell
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
```

- [ ] **Step 3: Replace .gitignore**

Overwrite `C:\huku.rocks\.gitignore` with:

```
.DS_Store
*.local
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove React/Vite stack"
```

---

### Task 2: Create style.css

**Files:**
- Create: `style.css`

- [ ] **Step 1: Create `C:\huku.rocks\style.css`**

```css
/* Design tokens */
:root {
  --bg:           #e8b890;
  --ink:          #2a1408;
  --ink-soft:     rgba(42, 20, 8, 0.7);
  --ink-line:     rgba(42, 20, 8, 0.3);
  --ink-grid:     rgba(42, 20, 8, 0.06);
  --grid-size:    18px;
  --ease-out-io:  cubic-bezier(0.65, 0, 0.35, 1);
}

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; }

body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Share Tech Mono', ui-monospace, monospace;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 40px 56px 0 56px;
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(to right,  var(--ink-grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ink-grid) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
  pointer-events: none;
  z-index: 0;
}

body > * { position: relative; z-index: 1; }

main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wordmark {
  margin: 0;
  font-family: 'Share Tech Mono', monospace;
  font-weight: 400;
  font-size: clamp(80px, 22vw, 280px);
  line-height: 0.82;
  letter-spacing: -0.02em;
  text-transform: lowercase;
  text-align: center;
  color: var(--ink);
  user-select: none;
}

.wordmark .row2 {
  display: block;
  letter-spacing: 0.02em;
  -webkit-text-stroke: 2px var(--ink);
  color: transparent;
  margin-top: 6px;
}

footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  margin-top: 8px;
  border-top: 1px solid var(--ink-line);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: lowercase;
  color: var(--ink-soft);
}

footer .copy { white-space: nowrap; }

.rail {
  display: flex;
  gap: 18px;
  align-items: center;
}

.rail a {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--ink-soft);
  text-decoration: none;
  transition:
    color 0.2s ease,
    transform 0.25s var(--ease-out-io);
}

.rail a svg {
  width: 15px;
  height: 15px;
  display: block;
  transition: transform 0.3s var(--ease-out-io);
}

.rail a::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -4px;
  width: 0;
  height: 1px;
  background: var(--ink);
  transition:
    width 0.3s var(--ease-out-io),
    left  0.3s var(--ease-out-io);
}

.rail a:hover              { color: var(--ink); transform: translateY(-1px); }
.rail a:hover svg          { transform: scale(1.1); }
.rail a:hover::after       { width: 100%; left: 0; }
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "feat: add style.css with all design tokens and layout"
```

---

### Task 3: Create index.html

**Files:**
- Modify: `index.html` (full replacement)

- [ ] **Step 1: Overwrite `C:\huku.rocks\index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>huku.rocks</title>
  <link rel="icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <main>
    <h1 class="wordmark">
      huku<span class="row2">rocks</span>
    </h1>
  </main>

  <footer>
    <span class="copy">© 2026 huku rocks</span>
    <nav class="rail">

      <a href="https://github.com/" aria-label="github" title="github">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>
        </svg>
      </a>

      <a href="https://twitter.com/" aria-label="twitter" title="twitter">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4l7.5 10L4.5 20H7l6-6.5L17.5 20H20l-7.8-10.5L19.5 4H17l-5.5 6L7 4z"/>
        </svg>
      </a>

      <a href="https://bsky.app/" aria-label="bluesky" title="bluesky">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 11c-1.8-3.4-5.2-6-7-6-1.4 0-2 1-2 2.5 0 1.6 1 6.5 1.6 7.4.6 1 1.8 1.2 3 1 .8-.1 1.7-.4 2.4-.4-1 .5-1.8 1.4-2 2.5-.3 1.8 1 3 2.5 3 1.2 0 1.6-.5 1.5-2 0-1 0-1.8 0-2.5"/>
          <path d="M12 11c1.8-3.4 5.2-6 7-6 1.4 0 2 1 2 2.5 0 1.6-1 6.5-1.6 7.4-.6 1-1.8 1.2-3 1-.8-.1-1.7-.4-2.4-.4 1 .5 1.8 1.4 2 2.5.3 1.8-1 3-2.5 3-1.2 0-1.6-.5-1.5-2 0-1 0-1.8 0-2.5"/>
        </svg>
      </a>

      <a href="#" aria-label="notes" title="notes">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 3h11l3 3v15H5z"/>
          <path d="M8 8h8M8 12h8M8 16h5"/>
        </svg>
      </a>

      <a href="mailto:hi@huku.rocks" aria-label="email" title="email">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="0.5"/>
          <path d="M3 6l9 7 9-7"/>
        </svg>
      </a>

    </nav>
  </footer>

  <!-- Statcounter -->
  <script type="text/javascript">
    var sc_project = 13161327;
    var sc_invisible = 1;
    var sc_security = "2d8a26fd";
  </script>
  <script type="text/javascript" src="https://www.statcounter.com/counter/counter.js" async></script>
  <noscript>
    <div class="statcounter">
      <a title="free web stats" href="https://statcounter.com/" target="_blank">
        <img class="statcounter" src="https://c.statcounter.com/13161327/0/2d8a26fd/1/" alt="free web stats" referrerpolicy="no-referrer-when-downgrade" />
      </a>
    </div>
  </noscript>
  <!-- End Statcounter -->

</body>
</html>
```

- [ ] **Step 2: Open in browser to verify design**

Open `C:\huku.rocks\index.html` directly in a browser (no server needed). Check all of:
- Background is warm peach (`#e8b890`)
- "huku" is solid dark brown; "rocks" is outlined (transparent fill, dark stroke)
- Wordmark is centered both axes, large, scales with window resize
- Subtle grid overlay visible behind text
- Footer hugs the bottom: copyright left, 5 icons right, 1px separator line above
- Hovering an icon: lifts 1px, icon scales up 10%, 1px underline slides in from center outward
- Page does not scroll horizontally

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add index.html — static landing page"
```

---

### Task 4: Replace Dockerfile and .dockerignore

**Files:**
- Modify: `Dockerfile`
- Modify: `.dockerignore`

- [ ] **Step 1: Replace `C:\huku.rocks\Dockerfile`**

```dockerfile
FROM nginx:alpine
COPY index.html     /usr/share/nginx/html/index.html
COPY style.css      /usr/share/nginx/html/style.css
COPY public/favicon.ico /usr/share/nginx/html/favicon.ico
EXPOSE 80
```

- [ ] **Step 2: Replace `C:\huku.rocks\.dockerignore`**

```
.git
docs
```

- [ ] **Step 3: Build the Docker image**

```bash
docker build -t huku-rocks .
```

Expected: build completes successfully, image tagged `huku-rocks:latest`. The image should be ~50MB (nginx:alpine base).

- [ ] **Step 4: Run and verify**

```bash
docker run --rm -p 8080:80 huku-rocks
```

Open `http://localhost:8080` in a browser. The page should look identical to the direct file open in Task 3 Step 2. Stop the container with `Ctrl+C`.

- [ ] **Step 5: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "feat: replace Node/serve Dockerfile with nginx:alpine"
```

---

### Task 5: Commit spec and plan docs

**Files:**
- Keep: `docs/superpowers/specs/2026-05-13-huku-rocks-rework-design.md`
- Keep: `docs/superpowers/plans/2026-05-13-huku-rocks-rework.md`

- [ ] **Step 1: Commit docs**

```bash
git add docs/
git commit -m "docs: add design spec and implementation plan"
```
