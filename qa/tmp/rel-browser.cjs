'use strict';
/* scratch: release browser checks — brand hero, header nav, print empty state,
   calculator alias redirects, mobile header, console/hydration cleanliness. */
const lib = require('../lib.cjs');
const BASE = 'http://localhost:3200';
const { launch, watch, emptyLog, isHydration, CHROME } = lib;

let failures = 0;
const ok = (cond, label, detail) => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${label}${detail !== undefined ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
};

(async () => {
  if (!CHROME) { console.log('no chrome'); process.exit(2); }
  const browser = await launch();

  /* --- homepage --- */
  {
    const page = await browser.newPage();
    const log = watch(page, emptyLog());
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    const v = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const cta = Array.from(document.querySelectorAll('.hero .hero-actions a')).map((a) => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
      const nav = Array.from(document.querySelectorAll('.main-nav a')).map((a) => a.textContent.trim());
      const brandStrong = (document.querySelector('.brand strong') || {}).textContent;
      const brandSmall = (document.querySelector('.brand small') || {}).textContent;
      const mark = document.querySelector('.brand-mark svg');
      const footerBrand = (document.querySelector('.footer-brand') || {}).textContent;
      const footerLinks = Array.from(document.querySelectorAll('.site-footer a')).map((a) => a.getAttribute('href'));
      return {
        h1: h1.textContent.trim(),
        h1Upper: getComputedStyle(h1).textTransform,
        cta, nav, brandStrong, brandSmall, footerBrand, footerLinks,
        markPaths: mark ? mark.querySelectorAll('path').length : 0,
        title: document.title,
      };
    });
    ok(v.h1 === 'Measure. Calculate. Plan.', 'home h1', v.h1);
    ok(v.h1Upper === 'uppercase', 'hero brandline uppercase', v.h1Upper);
    ok(v.title === 'MeasureToBuild | Outdoor Project Calculators & Planning Tools', 'home title', v.title);
    ok(v.cta.length === 2 && v.cta[0].text.includes('Start with a calculator') && v.cta[0].href === '/calculators', 'primary CTA', JSON.stringify(v.cta[0] || {}));
    ok(v.cta[1] && v.cta[1].text.includes('Browse project guides') && v.cta[1].href === '/guides', 'secondary CTA', JSON.stringify(v.cta[1] || {}));
    ok(v.nav.join('|') === 'Calculators|Projects|Guides|How It Works|Methodology|About', 'nav order', v.nav.join(' | '));
    ok(v.brandStrong === 'MeasureToBuild', 'header brand', v.brandStrong);
    ok(v.brandSmall === 'Measure. Calculate. Plan.', 'header tagline', v.brandSmall);
    ok(v.markPaths >= 1, 'header brand mark svg', `${v.markPaths} paths`);
    ok(v.footerBrand === 'MeasureToBuild', 'footer brand', v.footerBrand);
    ok(v.footerLinks.includes('/guides#cluster-projects') && v.footerLinks.includes('/guides#cluster-materials') && v.footerLinks.includes('/guides#cluster-costs'), 'footer guide clusters');
    ok(v.footerLinks.includes('/about#contact') && v.footerLinks.includes('/privacy') && v.footerLinks.includes('/terms') && v.footerLinks.includes('/how-it-works') && v.footerLinks.includes('/methodology'), 'footer resources/legal/contact');
    const iconStatus = await page.evaluate(async () => {
      const ico = await fetch('/favicon.ico').then((r) => r.status).catch(() => 0);
      const svg = await fetch('/icon.svg').then((r) => r.status).catch(() => 0);
      return { ico, svg };
    });
    ok(iconStatus.ico === 200 && iconStatus.svg === 200, 'favicon.ico + icon.svg', JSON.stringify(iconStatus));
    const badConsole = log.console.filter((c) => c.type === 'error' && !/favicon/i.test(c.text));
    ok(badConsole.length === 0, 'home console errors', JSON.stringify(badConsole.slice(0, 3)));
    ok(log.pageErrors.length === 0, 'home page errors', JSON.stringify(log.pageErrors));
    ok(!log.console.some((c) => isHydration(c.text)), 'home hydration errors');
    await page.close();
  }

  /* --- print empty state (fresh profile => no localStorage) --- */
  {
    const page = await browser.newPage();
    const log = watch(page, emptyLog());
    await page.goto(`${BASE}/projects/print`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.print-empty h1', { timeout: 15000 }).catch(() => {});
    const v = await page.evaluate(() => ({
      h1: ((document.querySelector('.print-empty h1') || document.querySelector('h1')) || {}).textContent,
      openBtn: !!Array.from(document.querySelectorAll('a')).find((a) => a.getAttribute('href') === '/projects' && /Open Project Mode/.test(a.textContent)),
      hasSheet: !!document.querySelector('.print-sheet'),
      robots: document.querySelector('meta[name="robots"]').getAttribute('content'),
      title: document.title,
    }));
    ok((v.h1 || '').trim() === 'No project is ready to print yet.', 'print empty-state h1', v.h1);
    ok(v.openBtn, 'print empty-state CTA');
    ok(!v.hasSheet, 'no giant empty report rendered');
    ok(v.robots === 'noindex, follow', 'print robots', v.robots);
    ok(log.pageErrors.length === 0, 'print page errors', JSON.stringify(log.pageErrors));
    await page.close();
  }

  /* --- Project Mode page hydrates with its H1 --- */
  {
    const page = await browser.newPage();
    const log = watch(page, emptyLog());
    await page.goto(`${BASE}/projects`, { waitUntil: 'networkidle0' });
    const h1 = await page.evaluate(() => (document.querySelector('h1') || {}).textContent);
    ok((h1 || '').trim() === 'One project, one material plan.', 'projects h1', h1);
    ok(log.pageErrors.length === 0 && !log.console.some((c) => isHydration(c.text)), 'projects console/hydration', JSON.stringify(log.console.slice(0, 2)));
    await page.close();
  }

  /* --- shorthand calculator aliases redirect to canonical slugs --- */
  {
    const page = await browser.newPage();
    const aliases = [
      ['/calculators/gravel', '/calculators/gravel-calculator'],
      ['/calculators/fence', '/calculators/fence-calculator'],
      ['/calculators/paver', '/calculators/paver-calculator'],
      ['/calculators/concrete', '/calculators/concrete-calculator'],
    ];
    for (const [short, canonical] of aliases) {
      const res = await page.goto(`${BASE}${short}`, { waitUntil: 'domcontentloaded' });
      ok(res.status() === 200 && new URL(page.url()).pathname === canonical, `alias ${short}`, `${res.status()} -> ${new URL(page.url()).pathname}`);
    }
    await page.close();
  }

  /* --- mobile: responsive navigation retained --- */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 780 });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    const v = await page.evaluate(() => {
      const nav = document.querySelector('.main-nav');
      const brand = document.querySelector('.brand');
      const doc = document.documentElement;
      return {
        navVisible: !!nav && getComputedStyle(nav).display !== 'none',
        brandVisible: !!brand && brand.getBoundingClientRect().width > 0,
        overflow: doc.scrollWidth > doc.clientWidth,
        heroHeight: Math.round(document.querySelector('.hero').getBoundingClientRect().height),
      };
    });
    ok(!v.navVisible, 'mobile nav collapses');
    ok(v.brandVisible, 'mobile brand visible');
    ok(!v.overflow, 'no horizontal overflow');
    ok(v.heroHeight < 900, 'mobile hero not excessively tall', `${v.heroHeight}px`);
    await page.close();
  }

  /* --- desktop hero compactness (two-column layout) --- */
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    const heroHeight = await page.evaluate(() => Math.round(document.querySelector('.hero').getBoundingClientRect().height));
    ok(heroHeight < 700, 'desktop hero not excessively tall', `${heroHeight}px`);
    await page.close();
  }


  await browser.close();
  console.log(failures === 0 ? '\nALL BROWSER RELEASE CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
