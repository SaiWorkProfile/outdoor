'use strict';
/* scratch: release smoke checks against the local production server */
const http = require('node:http');
const BASE = process.env.SMOKE_BASE || 'http://localhost:3200';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(BASE + path, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: d, headers: res.headers }));
    }).on('error', reject);
  });
}

const pick = (re, s) => { const m = s.match(re); return m ? m[1] : null; };

(async () => {
  const routes = ['/', '/projects', '/about', '/projects/print', '/guides', '/methodology'];
  for (const r of routes) {
    const { status, body } = await get(r);
    const h1 = [...body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
    const ogTitle = pick(/property="og:title" content="([^"]+)"/, body);
    const ogUrl = pick(/property="og:url" content="([^"]+)"/, body);
    const robots = pick(/<meta name="robots" content="([^"]+)"/, body);
    const icon = pick(/<link rel="icon"[^>]*href="([^"]+)"/, body) || (body.includes('<link rel="icon"') ? 'present' : 'MISSING');
    const title = pick(/<title>([^<]+)<\/title>/, body);
    const canonical = pick(/rel="canonical" href="([^"]+)"/, body);
    console.log(r, status, JSON.stringify({ title, h1, ogTitle, ogUrl, robots, icon, canonical }));
  }

  // console/hydration check is done in the browser QA; here: header brand + footer groups
  const home = await get('/');
  const brandBlock = (home.body.match(/<a href="\/" class="brand">[\s\S]*?<\/a>/) || [''])[0];
  console.log('header brand   :', brandBlock.includes('MeasureToBuild')
    ? `MeasureToBuild OK (mark svg: ${/<svg[\s\S]*?<\/svg>/.test(brandBlock) ? 'yes' : 'no'})`
    : `MISSING -> ${brandBlock.slice(0, 200)}`);
  console.log('header tagline :', home.body.includes('Measure. Calculate. Plan.') ? 'OK' : 'MISSING');
  console.log('footer brand   :', home.body.includes('footer-brand">MeasureToBuild') ? 'OK' : 'MISSING');
  console.log('nav order      :', (() => {
    const nav = home.body.match(/<nav class="main-nav"[\s\S]*?<\/nav>/);
    if (!nav) return 'MISSING';
    return [...nav[0].matchAll(/>([^<>]+)<\/a>/g)].map((m) => m[1]).join(' | ');
  })());
  console.log('footer groups  :', [...home.body.matchAll(/<strong>([^<]+)<\/strong>/g)].map((m) => m[1]).join(' | '));
  console.log('hero CTAs      :', home.body.includes('Start with a calculator') && home.body.includes('Browse project guides') ? 'OK' : 'MISSING');
  const guides = await get('/guides');
  console.log('guide clusters :', ['cluster-projects', 'cluster-materials', 'cluster-costs'].map((id) => guides.body.includes(`id="${id}"`) ? id : `${id} MISSING`).join(', '));
  const sm = await get('/sitemap.xml');
  const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log('sitemap count  :', locs.length, '| print excluded:', !locs.some((l) => l.includes('/projects/print')));
  console.log('sitemap hosts   :', [...new Set(locs.map((l) => new URL(l).host))].join(','));
  const rb = await get('/robots.txt');
  console.log('robots.txt     :', rb.body.trim().replace(/\s+/g, ' '));
})();
