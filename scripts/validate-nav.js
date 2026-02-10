#!/usr/bin/env node
/**
 * Navigation consistency checker for the slide deck.
 * Validates that all 20 slides have correct nav dots, prev/next links,
 * active dot placement, and progress bar percentages.
 *
 * Usage: node scripts/validate-nav.js
 * Exit code 0 = all checks pass, 1 = errors found.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Canonical slide order (from CLAUDE.md)
const SLIDE_ORDER = [
  'intro',
  'ai-taxonomy',
  'ai-ecosystem',
  'autocomplete',
  'context-window',
  'practical-implications',
  'practical-tips',
  'ai-intelligence',
  'model-tradeoffs',
  'prompting-tips',
  'hallucinations',
  'knowledge-problem',
  'trifolia-demo',
  'tools-context',
  'sources-section',
  'trifolia',
  'conclusiones',
  'privacidad-datos',
  'privacidad-proteccion',
  'privacidad-onpremise',
];

const TOTAL_SLIDES = SLIDE_ORDER.length; // 20
const SLIDES_DIR = path.join(__dirname, '..', 'slides');

let errors = [];

function error(file, msg) {
  errors.push(`  ${file}: ${msg}`);
}

// Extract all href values from nav dots
function extractDotHrefs(html) {
  const dotsSection = html.match(/<div class="slide-nav-dots"[^>]*>([\s\S]*?)<\/div>/);
  if (!dotsSection) return [];
  const dotRegex = /href="([^"]+)"/g;
  const hrefs = [];
  let match;
  while ((match = dotRegex.exec(dotsSection[1])) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

// Extract the active dot href
function extractActiveDot(html) {
  const dotsSection = html.match(/<div class="slide-nav-dots"[^>]*>([\s\S]*?)<\/div>/);
  if (!dotsSection) return null;
  const activeMatch = dotsSection[1].match(/<a\s+href="([^"]+)"[^>]*class="slide-nav-dot active"/);
  if (!activeMatch) {
    // Try alternate attribute order: class before href
    const altMatch = dotsSection[1].match(/class="slide-nav-dot active"[^>]*href="([^"]+)"/);
    return altMatch ? altMatch[1] : null;
  }
  return activeMatch[1];
}

// Count active dots
function countActiveDots(html) {
  const dotsSection = html.match(/<div class="slide-nav-dots"[^>]*>([\s\S]*?)<\/div>/);
  if (!dotsSection) return 0;
  return (dotsSection[1].match(/slide-nav-dot active/g) || []).length;
}

// Extract prev link href
function extractPrevHref(html) {
  const prevSection = html.match(/<div class="slide-nav-prev">([\s\S]*?)<\/div>/);
  if (!prevSection) return null;
  const hrefMatch = prevSection[1].match(/href="([^"]+)"/);
  return hrefMatch ? hrefMatch[1] : null;
}

// Extract next link href
function extractNextHref(html) {
  const nextSection = html.match(/<div class="slide-nav-next">([\s\S]*?)<\/div>/);
  if (!nextSection) return null;
  const hrefMatch = nextSection[1].match(/href="([^"]+)"/);
  return hrefMatch ? hrefMatch[1] : null;
}

// Extract progress bar width percentage
function extractProgressWidth(html) {
  const match = html.match(/class="progress-fill"\s+style="width:\s*(\d+)%"/);
  return match ? parseInt(match[1], 10) : null;
}

// Validate each slide
for (let i = 0; i < TOTAL_SLIDES; i++) {
  const slideName = SLIDE_ORDER[i];
  const fileName = `${slideName}.html`;
  const filePath = path.join(SLIDES_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    error(fileName, `File not found: ${filePath}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const position = i + 1; // 1-indexed

  // 1. Check dot count
  const dotHrefs = extractDotHrefs(html);
  if (dotHrefs.length !== TOTAL_SLIDES) {
    error(fileName, `Expected ${TOTAL_SLIDES} nav dots, found ${dotHrefs.length}`);
  }

  // 2. Check dot order matches canonical sequence
  const expectedDotHrefs = SLIDE_ORDER.map((s) => `${s}.html`);
  for (let j = 0; j < Math.min(dotHrefs.length, expectedDotHrefs.length); j++) {
    if (dotHrefs[j] !== expectedDotHrefs[j]) {
      error(fileName, `Dot ${j + 1}: expected href="${expectedDotHrefs[j]}", found href="${dotHrefs[j]}"`);
      break; // Report only the first mismatch per file to reduce noise
    }
  }

  // 3. Exactly one active dot
  const activeCount = countActiveDots(html);
  if (activeCount !== 1) {
    error(fileName, `Expected exactly 1 active dot, found ${activeCount}`);
  }

  // 4. Active dot matches current file
  const activeDot = extractActiveDot(html);
  if (activeDot !== fileName) {
    error(fileName, `Active dot href="${activeDot}", expected "${fileName}"`);
  }

  // 5. Prev link
  const prevHref = extractPrevHref(html);
  if (i === 0) {
    // First slide: prev goes to index
    if (prevHref !== '../index.html') {
      error(fileName, `Prev link: expected "../index.html", found "${prevHref}"`);
    }
  } else {
    const expectedPrev = `${SLIDE_ORDER[i - 1]}.html`;
    if (prevHref !== expectedPrev) {
      error(fileName, `Prev link: expected "${expectedPrev}", found "${prevHref}"`);
    }
  }

  // 6. Next link
  const nextHref = extractNextHref(html);
  if (i === TOTAL_SLIDES - 1) {
    // Last slide: next goes to index
    if (nextHref !== '../index.html') {
      error(fileName, `Next link: expected "../index.html", found "${nextHref}"`);
    }
  } else {
    const expectedNext = `${SLIDE_ORDER[i + 1]}.html`;
    if (nextHref !== expectedNext) {
      error(fileName, `Next link: expected "${expectedNext}", found "${nextHref}"`);
    }
  }

  // 7. Progress bar percentage
  const expectedProgress = Math.round((position / TOTAL_SLIDES) * 100);
  const actualProgress = extractProgressWidth(html);
  if (actualProgress === null) {
    error(fileName, 'Progress bar not found');
  } else if (actualProgress !== expectedProgress) {
    error(fileName, `Progress bar: expected ${expectedProgress}%, found ${actualProgress}%`);
  }
}

// Report results
if (errors.length === 0) {
  console.log(`\u2705 Navigation validated: all ${TOTAL_SLIDES} slides consistent.`);
  process.exit(0);
} else {
  console.error(`\u274C Navigation validation failed (${errors.length} error${errors.length > 1 ? 's' : ''}):\n`);
  errors.forEach((e) => console.error(e));
  console.error('');
  process.exit(1);
}
