'use strict';
/** Find elements wider than the viewport on a content page (development probe). */
const { BASE, launch } = require('./lib.cjs');

const ROUTE = process.argv[2] || '/materials/gravel';
const WIDTH = Number(process.argv[3] || 380);

const FIND = () => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  for (const el of Array.from(document.querySelectorAll('body *'))) {
    const rect = el.getBoundingClientRect();
    if (rect.width > vw + 1 || rect.right > vw + 1) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: typeof el.className === 'string' ? el.className.slice(0, 60) : '',
        width: Math.round(rect.width),
        right: Math.round(rect.right),
        scrollWidth: el.scrollWidth,
      });
    }
  }
  return { viewport: vw, scrollWidth: document.documentElement.scrollWidth, offenders: out.slice(0, 25) };
};

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: 800, deviceScaleFactor: 2 });
  await page.goto(`${BASE}${ROUTE}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log(JSON.stringify(await page.evaluate(FIND), null, 2));
  await browser.close();
})();
