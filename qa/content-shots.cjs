'use strict';
/**
 * Visual spot-check: capture the layout-sensitive regions of new content pages
 * and report whether any capture coincided with a horizontally overflowing
 * document. Run against the production server (npm run build && npm start).
 */
const { BASE, launch, writeJson } = require('./lib.cjs');

const JOBS = [
  { route: '/projects/how-much-gravel-do-i-need', width: 380 },
  { route: '/projects/how-to-plan-a-paver-patio', width: 380 },
  { route: '/materials/paver-base', width: 380 },
  { route: '/costs/landscaping-project-cost', width: 380 },
  { route: '/projects/how-to-calculate-landscaping-materials', width: 1440 },
  { route: '/projects/how-to-estimate-deck-materials', width: 1440 },
];

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  const shots = [];

  for (const job of JOBS) {
    const tag = job.route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
    await page.setViewport({ width: job.width, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE}${job.route}`, { waitUntil: 'networkidle0', timeout: 30000 });

    /* Above the fold: h1, lede, key facts. */
    await page.screenshot({ path: `qa/artifacts/content-${tag}-top.png` });

    /* Every table, diagram and the table of contents. */
    const handles = await page.$$("main table, main svg[role='img'], .content-toc");
    let index = 0;
    for (const handle of handles) {
      const info = await handle.evaluate((el) => {
        el.scrollIntoView({ block: 'center' });
        const box = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          width: Math.round(box.width),
          docWidth: Math.round(document.documentElement.scrollWidth),
          viewport: window.innerWidth,
          overflowsViewport: document.documentElement.scrollWidth > window.innerWidth,
        };
      });
      await new Promise((resolve) => setTimeout(resolve, 120));
      const name = `content-${tag}-${info.tag}-${index}.png`;
      await page.screenshot({ path: `qa/artifacts/${name}` });
      shots.push({ route: job.route, width: job.width, file: name, ...info });
      index += 1;
    }
  }

  await page.close();
  await browser.close();
  writeJson('content-shots.json', { shots, overflowing: shots.filter((s) => s.overflowsViewport) });
  for (const s of shots) {
    console.log(`${s.route} ${s.width}px ${s.tag}=${s.width} doc=${s.docWidth} viewport=${s.viewport} overflow=${s.overflowsViewport}`);
  }
})();
