'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { BASE, launch, emptyLog, watch, waitForCalculator, OUT } = require('./lib.cjs');

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  const log = watch(page, emptyLog());
  await page.goto(`${BASE}/calculators/gravel-calculator`, { waitUntil: 'networkidle0' });
  await waitForCalculator(page);
  const html = await page.content();
  fs.writeFileSync(path.join(OUT, 'gravel-dom.html'), html);

  const summary = await page.evaluate(() => {
    const fields = Array.from(document.querySelectorAll('.field')).map((f) => {
      const label = f.querySelector('label');
      const ctl = f.querySelector('input, select, textarea');
      const forAttr = label ? label.getAttribute('for') : null;
      return {
        label: label ? label.textContent.trim() : null,
        for: forAttr,
        forResolves: forAttr ? !!document.getElementById(forAttr) : null,
        controlTag: ctl ? ctl.tagName.toLowerCase() : null,
        controlId: ctl ? ctl.id || null : null,
        controlType: ctl ? ctl.getAttribute('type') : null,
        unit: f.querySelector('.unit') ? f.querySelector('.unit').textContent.trim() : null,
        value: ctl ? ctl.value : null,
      };
    });
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => `${h.tagName}: ${h.textContent.trim().slice(0, 70)}`);
    const buttons = Array.from(document.querySelectorAll('button')).map((b) => ({ text: b.textContent.trim(), name: b.getAttribute('aria-label') || b.textContent.trim() }));
    const links = Array.from(document.querySelectorAll('a')).map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim().slice(0, 40) }));
    const landmarks = Array.from(document.querySelectorAll('header,nav,main,footer,aside')).map((e) => `${e.tagName}${e.getAttribute('aria-label') ? `[${e.getAttribute('aria-label')}]` : ''}`);
    return { fieldCount: fields.length, fields, headings, buttons, links, landmarks, bodyScrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth };
  });
  console.log(JSON.stringify({ log, summary }, null, 2));
  await browser.close();
})();
