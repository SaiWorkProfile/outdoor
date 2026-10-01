'use strict';
/**
 * npm run qa:site-url — production origin guard.
 *
 * Guards the single production origin for MeasureToBuild, https://www.measuretobuild.in,
 * so a release can never ship with localhost, an apex-only host, an http:// origin or a
 * Vercel preview host baked into the canonical / Open Graph / sitemap / robots output.
 *
 * Checks:
 *   1. `.env.production` exists and sets NEXT_PUBLIC_SITE_URL to the canonical origin;
 *   2. `.env.production` contains no banned host (localhost / 127.0.0.1 / example.com /
 *      *.vercel.app) and no http:// or apex origin;
 *   3. src/lib/seo.ts falls back to the same origin (one source of truth, not two);
 *   4. the ambient NEXT_PUBLIC_SITE_URL, when set, is https and is not a banned host
 *      (a localhost QA origin is allowed and reported as INFO).
 *
 * Usage:
 *   node qa/site-url-guard.cjs            # standalone (informational unless NODE_ENV=production)
 *   node qa/site-url-guard.cjs --strict   # fail when NEXT_PUBLIC_SITE_URL is missing in production
 *
 * Exit code 1 when any FAIL finding is produced, 0 otherwise.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REQUIRED_ORIGIN = 'https://www.measuretobuild.in';
const APEX_ORIGIN = /^https?:\/\/measuretobuild\.in/i;
const HTTP_ORIGIN = /^http:\/\//i;
const LOCAL_QA_ORIGIN = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i;

const BANNED = [
  ['localhost', /localhost/i],
  ['127.0.0.1', /127\.0\.0\.1/],
  ['example.com', /example\.com/i],
  ['a Vercel preview host (*.vercel.app)', /\.vercel\.app\b/i],
];

const strict = process.argv.includes('--strict') || process.env.NODE_ENV === 'production';

function parseEnvFile(file) {
  if (!fs.existsSync(file)) return null;
  const out = {};
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const findings = [];
const fail = (m) => findings.push(`FAIL:${m}`);
const warn = (m) => findings.push(`WARN:${m}`);
const info = (m) => findings.push(`INFO:${m}`);

const prodFile = path.join(ROOT, '.env.production');
const prodEnv = parseEnvFile(prodFile);
const prodOrigin = prodEnv ? prodEnv.NEXT_PUBLIC_SITE_URL || null : null;

/* 1 + 2: the committed release configuration. */
if (!prodEnv) {
  fail(`.env.production is missing — the release configuration must set NEXT_PUBLIC_SITE_URL=${REQUIRED_ORIGIN}`);
} else {
  const raw = fs.readFileSync(prodFile, 'utf8');
  if (!prodOrigin) {
    fail('.env.production does not set NEXT_PUBLIC_SITE_URL');
  } else if (prodOrigin !== REQUIRED_ORIGIN) {
    fail(`.env.production sets NEXT_PUBLIC_SITE_URL=${prodOrigin} — expected ${REQUIRED_ORIGIN}`);
  } else {
    info(`.env.production NEXT_PUBLIC_SITE_URL=${prodOrigin}`);
  }
  if (prodOrigin && HTTP_ORIGIN.test(prodOrigin)) fail('.env.production uses an http:// origin — production must be https');
  if (prodOrigin && APEX_ORIGIN.test(prodOrigin)) fail('.env.production uses the apex host — production must use the www origin');
  for (const [label, re] of BANNED) {
    if (re.test(raw)) fail(`.env.production references ${label}, which is never the production origin`);
  }
}

/* 3: one source of truth in the code. */
const seoFile = path.join(ROOT, 'src', 'lib', 'seo.ts');
let seoSource = '';
try {
  seoSource = fs.readFileSync(seoFile, 'utf8');
} catch (error) {
  fail(`src/lib/seo.ts could not be read (${error.message})`);
}
if (seoSource && !seoSource.includes(REQUIRED_ORIGIN)) {
  fail(`src/lib/seo.ts does not fall back to ${REQUIRED_ORIGIN} — the site origin would have more than one source`);
} else if (seoSource) {
  info(`src/lib/seo.ts fallback origin = ${REQUIRED_ORIGIN}`);
}
if (seoSource && /NEXT_PUBLIC_SITE_URL/.test(seoSource)) {
  info('src/lib/seo.ts derives SITE_URL from NEXT_PUBLIC_SITE_URL');
} else if (seoSource) {
  warn('src/lib/seo.ts does not reference NEXT_PUBLIC_SITE_URL — the origin is hardcoded');
}

/* 4: the ambient environment for this process. */
const ambient = process.env.NEXT_PUBLIC_SITE_URL;
if (ambient) {
  if (LOCAL_QA_ORIGIN.test(ambient)) {
    info(`ambient NEXT_PUBLIC_SITE_URL=${ambient} (local QA origin — allowed, not a production value)`);
  } else if (HTTP_ORIGIN.test(ambient)) {
    warn(`ambient NEXT_PUBLIC_SITE_URL=${ambient} is not https`);
  } else if (APEX_ORIGIN.test(ambient)) {
    fail(`ambient NEXT_PUBLIC_SITE_URL=${ambient} is the apex host — use ${REQUIRED_ORIGIN}`);
  } else if (ambient === REQUIRED_ORIGIN) {
    info(`ambient NEXT_PUBLIC_SITE_URL=${ambient}`);
  } else {
    for (const [label, re] of BANNED) {
      if (re.test(ambient)) fail(`ambient NEXT_PUBLIC_SITE_URL references ${label}`);
    }
    info(`ambient NEXT_PUBLIC_SITE_URL=${ambient}`);
  }
} else {
  info(`ambient NEXT_PUBLIC_SITE_URL is unset; releases resolve via .env.production to ${prodOrigin || REQUIRED_ORIGIN}`);
  if (strict && !prodOrigin) {
    fail('NEXT_PUBLIC_SITE_URL is missing in a production context and .env.production is absent');
  }
}

/* ------------------------------------------------------------------ report */
console.log('=== site url guard ===');
for (const finding of findings) console.log(finding);
const failedCount = findings.filter((f) => f.startsWith('FAIL:')).length;
const warnedCount = findings.filter((f) => f.startsWith('WARN:')).length;
console.log(`\n${failedCount ? 'FAIL' : warnedCount ? 'WARN' : 'PASS'} — production origin ${REQUIRED_ORIGIN}`);
process.exitCode = failedCount ? 1 : 0;
