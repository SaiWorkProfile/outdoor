'use strict';
/**
 * Per-calculator functional QA in a real browser against the production build.
 *  - page loads, inputs render, labels match inputs, units present
 *  - realistic worked example -> result appears and matches engine output
 *  - invalid input -> useful error, no crash
 *  - reset -> back to defaults
 *  - edge cases: zero / negative / decimal / huge / empty / custom prices
 *  - console errors + hydration warnings
 */
const {
  BASE, launch, emptyLog, watch, waitForCalculator, setByLabel, clickButton,
  resultSnapshot, writeJson, isHydration,
} = require('./lib.cjs');
const expected = require('./artifacts/expected.json');

const CALCS = Object.keys(expected);
const num = (s) => {
  const m = String(s).replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
};

async function fieldsOf(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('.field')).map((f) => {
    const label = f.querySelector('label');
    const forAttr = label ? label.getAttribute('for') : null;
    const ctl = f.querySelector('input, select, textarea');
    return {
      label: label ? label.textContent.trim() : null,
      forAttr,
      forResolves: forAttr ? !!document.getElementById(forAttr) : null,
      hasControl: !!ctl,
      labelWrapsControl: !!(label && ctl && label.contains(ctl)),
      unit: f.querySelector('.unit') ? f.querySelector('.unit').textContent.trim() : null,
    };
  }));
}

const associated = (f) => !f.hasControl || f.labelWrapsControl || (f.forAttr ? f.forResolves === true : false);

const REALISTIC = {
  'paver-patio-calculator': [['Length', '12'], ['Width', '20']],
  'deck-material-calculator': [['Deck length', '12'], ['Deck width', '20']],
  'concrete-calculator': [['Length', '10'], ['Width', '12'], ['Thickness', '4']],
  'fence-cost-calculator': [
    ['Post / each', '20'], ['Rail / piece', '8'], ['Picket / each', '2'],
    ['Concrete / cubic yard', '150'], ['Hardware / each', '0.25'], ['Gate / each', '120'],
    ['Labor / linear ft', '12'],
  ],
};
module.exports = { CALCS, num, fieldsOf, associated, REALISTIC };
