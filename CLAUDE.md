# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML slide deck: "Fundamentos Técnicos de IA para Abogados" — 20 interactive educational slides about AI/LLMs aimed at legal professionals. Built by Trifolia (trifolia.cl). Content is in Spanish. Licensed CC BY-NC-SA 4.0.

## Running Locally

Open `index.html` directly in a browser — no build step, no bundler, no dependencies to install. All CSS/JS is vanilla. External deps (Bootstrap 5, Google Fonts, Bootstrap Icons) are loaded via CDN.

## Architecture

### Page Structure
- `index.html` — Landing page with table of contents linking to all 20 slides
- `slides/*.html` — Each slide is a self-contained HTML file with its own inline `<style>` block for slide-specific styles

### Shared Assets
- `css/slides-base.css` — Base styles, CSS variables (Trifolia brand colors), layout system, fullscreen presentation mode (16:9 scaling at 1280x720 reference resolution), footer, animations, responsive breakpoints
- `css/slide-nav.css` — Fixed bottom navigation bar, dot indicators, progress bar, fullscreen auto-hide behavior
- `js/slide-nav.js` — Keyboard navigation (arrows, PageUp/Down, Space/Enter/Tab), touch swipe, presentation mode toggle (P key, persisted via localStorage), fullscreen detection, `window.slideInteraction` API for interactive slides
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

### Presentation Mode
Press **P** to toggle presentation mode (16:9, 1280x720 reference scaled to fit viewport). State persists in localStorage across slide navigation. The nav bar auto-hides and shows a minimal progress bar; mouse movement briefly reveals the nav.

### CSS Variables
Key brand colors defined in `slides-base.css`:
- `--clover-purple: #3c78fd` (primary blue)
- `--petal-accent: #7200fc` (purple accent)
- `--law-navy: #1A2332` (dark background)
- `--paper-white: #F8F9FA`
- `--viz-max-width: 1000px` (overridable per slide)

### Slide Order
intro → ai-taxonomy → ai-ecosystem → autocomplete → context-window → ai-intelligence → practical-implications → practical-tips → model-tradeoffs → prompting-tips → hallucinations → knowledge-problem → trifolia-demo → tools-context → sources-section → trifolia → conclusiones → privacidad-datos → privacidad-proteccion → privacidad-onpremise
