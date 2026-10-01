'use strict';
/**
 * Reassemble ProjectModeClient.tsx after a chunked append placed two JSX blocks at the
 * wrong boundaries. Pure line moves: the reset closer / guard / derived consts move above
 * the JSX return, and the Areas..aside tail moves inside the grid.
 */
const fs = require('node:fs');
const FILE = 'src/components/calculators/ProjectModeClient.tsx';

const text = fs.readFileSync(FILE, 'utf8');
const eol = text.includes('\r\n') ? '\r\n' : '\n';
const lines = text.split(/\r?\n/);

const head = lines.slice(0, 108);        /* 1..108  (through reset body) */
const guard = lines.slice(174, 181);     /* 175..181 ('};', guard, consts) */
const jsxHead = lines.slice(109, 174);   /* 110..174 (return .. dashboard </Card>) */
const tail = lines.slice(182);           /* 183..EOF (Areas .. component close) */

if (!head[107].includes('setPanel({ open: false, editing: null });')) throw new Error('head boundary wrong: ' + head[107]);
if (guard[0].trim() !== '};') throw new Error('guard boundary wrong: ' + guard[0]);
if (!jsxHead[0].trim().startsWith('return (')) throw new Error('jsx boundary wrong: ' + jsxHead[0]);
if (!tail[0].includes('<Card title="Areas"')) throw new Error('tail boundary wrong: ' + tail[0]);

const out = [...head, ...guard, ...jsxHead, ...tail];
fs.writeFileSync(FILE, out.join(eol), 'utf8');
console.log('reassembled: ' + out.length + ' lines');
console.log(out.slice(104, 116).join('\n'));
