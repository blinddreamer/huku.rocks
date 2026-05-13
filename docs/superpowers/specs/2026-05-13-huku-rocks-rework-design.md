---
name: huku-rocks-rework
description: Rework huku.rocks from React/Vite to pure static HTML + CSS, pixel-perfect implementation of the Claude design handoff
metadata:
  type: project
---

# huku.rocks rework — design spec

## Overview

Replace the current React/Vite single-page app with a pure static `index.html` + `style.css` site. The design is fully specified in `C:\asd\huku.rocks\design_handoff_huku_rocks\` — this spec captures the implementation decisions made on top of that reference.

## Files

| File | Purpose |
|------|---------|
| `index.html` | HTML shell, Google Fonts link, Statcounter snippet, wordmark + footer markup |
| `style.css` | All styles — design tokens, resets, layout, wordmark, footer, hover transitions |
| `public/favicon.ico` | Keep as-is |
| `Dockerfile` | nginx:alpine, copies the three files above |

### Removed

- `src/` directory (all React components, App.jsx, index.css, main.jsx, assets)
- `node_modules/`
- `package.json`, `yarn.lock`, `eslint.config.js`, `vite.config.js`, `renovate.json`
- `.dockerignore` (replace with minimal version for nginx)

## Architecture

No build step. No JavaScript (except Statcounter). The Docker image is `nginx:alpine` — copies `index.html`, `style.css`, `public/favicon.ico` to `/usr/share/nginx/html`, exposes port 80.

## index.html structure

```html
<!doctype html>
<html lang="en">
<head>
  <!-- charset, viewport, title, favicon -->
  <!-- Google Fonts: Share Tech Mono -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1 class="wordmark">huku<span class="row2">rocks</span></h1>
  </main>
  <footer>
    <span class="copy">© 2026 huku rocks</span>
    <nav class="rail">
      <!-- 5 icon anchors: github, twitter, bluesky, notes, email -->
      <!-- SVG paths verbatim from reference.html -->
    </nav>
  </footer>
  <!-- Statcounter snippet (sc_project=13161327, sc_security="2d8a26fd") -->
</body>
</html>
```

## style.css structure

1. `:root` — CSS custom properties for all design tokens
2. Reset (`*, *::before, *::after`)
3. `body` — flex column, peach bg, font, padding, overflow-x hidden
4. `body::before` — fixed grid overlay (z-index 0)
5. `body > *` — z-index 1
6. `main` — flex center
7. `.wordmark` — Share Tech Mono, clamp size, line-height, letter-spacing, user-select none
8. `.wordmark .row2` — outlined text, margin-top
9. `footer` — flex row, space-between, border-top, font-size, tracking
10. `.rail` — flex row, gap
11. `.rail a` — 24×24 hover target, transitions
12. `.rail a svg` — 15×15, scale transition
13. `.rail a::after` — underline slide animation
14. `.rail a:hover` rules

## Design tokens (from reference)

| Token | Value |
|-------|-------|
| `--bg` | `#e8b890` |
| `--ink` | `#2a1408` |
| `--ink-soft` | `rgba(42, 20, 8, 0.7)` |
| `--ink-line` | `rgba(42, 20, 8, 0.3)` |
| `--ink-grid` | `rgba(42, 20, 8, 0.06)` |
| `--grid-size` | `18px` |
| `--ease-out-io` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| Wordmark size | `clamp(80px, 22vw, 280px)` |
| Side padding | `56px` |
| Top padding | `40px` |

## Dockerfile

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY style.css  /usr/share/nginx/html/style.css
COPY public/favicon.ico /usr/share/nginx/html/favicon.ico
EXPOSE 80
```

## Social links (placeholders — replace before launch)

| Icon | Current placeholder |
|------|-------------------|
| github | `https://github.com/` |
| twitter | `https://twitter.com/` |
| bluesky | `https://bsky.app/` |
| notes | `#` |
| email | `mailto:hi@huku.rocks` |
