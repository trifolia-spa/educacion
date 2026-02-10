# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML slide deck: "Fundamentos Técnicos de IA para Abogados" — 20 interactive educational slides about AI/LLMs aimed at legal professionals. Built by Trifolia (trifolia.cl). Content is in Spanish. Licensed CC BY-NC-SA 4.0.

## Running Locally

```bash
npm run setup   # Install devDependencies + pre-commit hook (first time only)
npm start       # Local server at http://localhost:3000
```

Alternatively, open `index.html` directly in a browser. All CSS/JS is vanilla; external deps (Bootstrap 5, Google Fonts, Bootstrap Icons) are loaded via CDN.

## Architecture

### Page Structure
- `index.html` — Landing page with table of contents linking to all 20 slides
- `slides/*.html` — Each slide is a self-contained HTML file with its own inline `<style>` block for slide-specific styles

### Shared Assets
- `css/slides-base.css` — Base styles, CSS variables (Trifolia brand colors), 16:9 layout (1280×720 reference resolution scaled to viewport), animations, responsive breakpoints
- `css/slide-nav.css` — Auto-hiding bottom navigation bar, dot indicators, progress bar
- `js/slide-nav.js` — Keyboard navigation (arrows, PageUp/Down, Space/Enter/Tab), touch swipe, 16:9 viewport scaling, nav auto-hide, `window.slideInteraction` API for interactive slides
- `js/llm-context-viz.js` — Standalone interactive visualization for the context-window slide; demonstrates LLM token processing with animated chat conversation
- `images/` — SVG logo and PNG images used in specific slides

### Slide Anatomy
Each slide HTML file follows this structure:
1. `<head>`: SEO meta, license meta, CDN links (fonts, Bootstrap), `slides-base.css`, inline `<style>` for that slide
2. `<body>`: `.page-container` > `main.viz-container` (with `.corner-top-left`/`.corner-bottom-right` decorative elements) > `.viz-content` (header + slide body)
3. Footer: `.brand-footer` with Trifolia attribution and CC license link
4. Navigation: `<nav class="slide-nav">` with prev/next buttons and 20 dot indicators (the active dot must match the current slide)
5. Bottom scripts: `slide-nav.css` and `slide-nav.js` loaded at end of body

### Slide Navigation
Navigation between slides is hardcoded — each slide has explicit prev/next links and all 20 dots with one marked `.active`. When adding or reordering slides, you must update the nav in **every** slide file plus `index.html`.

### Interactive Slides
Slides with JavaScript interactions use `window.slideInteraction.register(fn)` to intercept Space/Enter so the interaction runs before advancing to the next slide. The handler returns `true` to navigate or `false` to stay.

### Display
Slides always render in 16:9 presentation layout (1280×720 reference resolution, scaled to fit the viewport). The nav bar auto-hides and shows a minimal progress bar; mouse movement briefly reveals the nav.

### CSS Variables
Key brand colors defined in `slides-base.css`:
- `--clover-purple: #3c78fd` (primary blue)
- `--petal-accent: #7200fc` (purple accent)
- `--law-navy: #1A2332` (dark background)
- `--paper-white: #F8F9FA`
- `--viz-max-width: 1000px` (overridable per slide)

## Tooling

### npm Scripts

| Script | What it does |
|--------|-------------|
| `npm run setup` | `npm install` + installs pre-commit hook (run once after clone) |
| `npm start` | Local dev server on port 3000 (`serve .`) |
| `npm run lint` | Run HTMLHint + Stylelint + JS syntax check |
| `npm run validate:nav` | Validate nav dots, prev/next links, active dot, and progress bar across all 20 slides |
| `npm run validate` | `lint` + `validate:nav` |

### Linter Configs

- `.htmlhintrc` — HTMLHint rules; inline styles/scripts allowed (required by slide architecture)
- `.stylelintrc.json` — Stylelint extending `stylelint-config-standard`; naming patterns and vendor-prefix rules relaxed

### Navigation Validator (`scripts/validate-nav.js`)

Reads all 20 slide HTML files and checks:
1. Exactly 20 nav dots in the correct canonical order
2. Exactly one `.active` dot matching the current slide filename
3. Prev link points to the previous slide (or `../index.html` for the first slide)
4. Next link points to the next slide (or `../index.html` for the last slide)
5. Progress bar width percentage matches `round((position / 20) * 100)`

### Pre-commit Hook

Installed via `npm run setup` (symlinks `scripts/pre-commit` → `.git/hooks/pre-commit`). On each commit it checks staged files for:
1. Merge conflict markers
2. JS syntax errors (`node --check`)
3. HTMLHint issues
4. Stylelint issues
5. Navigation consistency (runs `validate-nav.js`)

Warnings (trailing whitespace) don't block the commit; errors do.

### Slide Order
intro → ai-taxonomy → ai-ecosystem → autocomplete → context-window → practical-implications → practical-tips → ai-intelligence → model-tradeoffs → prompting-tips → hallucinations → knowledge-problem → trifolia-demo → tools-context → sources-section → trifolia → conclusiones → privacidad-datos → privacidad-proteccion → privacidad-onpremise
