'use strict';
/** Chromium accessibility-name approximation + heading/focus/contrast helpers. */
const A11Y = () => {
  const nameOf = (el) => {
    const labelledby = el.getAttribute('aria-labelledby');
    if (labelledby) {
      const t = labelledby.split(/\s+/).map((id) => ((document.getElementById(id) || {}).textContent || '')).join(' ').trim();
      if (t) return { name: t, source: 'aria-labelledby' };
    }
    const aria = el.getAttribute('aria-label');
    if (aria && aria.trim()) return { name: aria.trim(), source: 'aria-label' };
    if (el.id) {
      const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (lbl && lbl.textContent.trim()) return { name: lbl.textContent.trim(), source: 'label[for]' };
    }
    const wrap = el.closest('label');
    if (wrap && wrap.textContent.trim()) return { name: wrap.textContent.trim(), source: 'wrapping label' };
    const title = el.getAttribute('title');
    if (title) return { name: title, source: 'title' };
    if (el.tagName === 'BUTTON' || el.tagName === 'A') return { name: (el.textContent || '').trim(), source: 'text' };
    return { name: '', source: 'none' };
  };

  const controls = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea')).map((el) => {
    const { name, source } = nameOf(el);
    return { tag: el.tagName.toLowerCase(), type: el.getAttribute('type'), id: el.id || null, name: name.slice(0, 30), source, ok: !!name };
  });
  const buttons = Array.from(document.querySelectorAll('button')).map((el) => nameOf(el));
  const linkEls = Array.from(document.querySelectorAll('a')).map((el) => nameOf(el));

  const levels = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => Number(h.tagName[1]));
  const skips = [];
  for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) skips.push(`${levels[i - 1]} -> ${levels[i]}`);

  return {
    lang: document.documentElement.lang,
    landmarks: Array.from(document.querySelectorAll('header, nav, main, footer')).map((e) => e.tagName.toLowerCase() + (e.getAttribute('aria-label') ? `[${e.getAttribute('aria-label')}]` : '')),
    h1Count: document.querySelectorAll('h1').length,
    headingSkips: skips,
    controls, unnamedControls: controls.filter((c) => !c.ok).length,
    unnamedButtons: buttons.filter((b) => !b.name).length,
    unnamedLinks: linkEls.filter((l) => !l.name).length,
    buttonCount: buttons.length, linkCount: linkEls.length,
    liveRegions: Array.from(document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')).map((e) => `${e.tagName.toLowerCase()}[${e.getAttribute('aria-live') || e.getAttribute('role')}]`),
  };
};

module.exports = { A11Y };
