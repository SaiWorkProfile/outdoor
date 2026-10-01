'use strict';
/**
 * One-off refactor helper: move the form-state -> engine-input dispatch out of
 * CalculatorClient.tsx into a shared module so Project Mode can reuse exactly the
 * same code path instead of duplicating it. The block is copied verbatim, never retyped.
 */
const fs = require('node:fs');

const CLIENT = 'src/components/calculators/CalculatorClient.tsx';
const BRIDGE = 'src/components/calculators/engine-bridge.ts';

const text = fs.readFileSync(CLIENT, 'utf8');
const eol = text.includes('\r\n') ? '\r\n' : '\n';
const lines = text.split(/\r?\n/);

const startIdx = lines.findIndex((line) => line.startsWith('function numberValue('));
const endIdx = lines.findIndex((line) => line.startsWith('function errorMessage('));
if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) throw new Error('anchors not found: ' + startIdx + '/' + endIdx);

const block = lines.slice(startIdx, endIdx).join(eol).replace(/\s+$/, '');

const header = [
  '/**',
  ' * Shared bridge between calculator form state and the calculation engine.',
  ' *',
  ' * The engine under src/lib/calculations remains the single source of truth. This module',
  ' * only converts form strings into typed engine inputs and derives the input/result',
  ' * summaries the UI displays, so calculator pages and Project Mode cannot drift apart.',
  ' */',
  "import { calculateBulk, calculateDriveway, calculateConcrete, calculatePavers, calculatePaverPatio, calculateFence, calculateFenceCost, calculateFencePosts, calculateDeckMaterials, type Shape } from '@/index';",
  "import { getCalculator, type CalculatorSlug } from './registry';",
  "import type { CalculatorFormState } from './CalculatorForm';",
  "import type { ShapeForm } from './FormParts';",
  '',
].join(eol);

const exported = block
  .replace('function safeResult(', 'function runCalculator(')
  .replace(/^function /gm, 'export function ');

if (!exported.includes('export function runCalculator(') || !exported.includes('export function numberValue(')) {
  throw new Error('rename failed');
}

fs.writeFileSync(BRIDGE, header + exported + eol, 'utf8');

const importLine = "import { numberValue, optionalNumber, shapeFromForm, runCalculator as safeResult } from './engine-bridge';";
const nextLines = [...lines.slice(0, startIdx), importLine, ...lines.slice(endIdx)];
fs.writeFileSync(CLIENT, nextLines.join(eol), 'utf8');

console.log('removed lines ' + (startIdx + 1) + '-' + endIdx + ' from CalculatorClient.tsx');
console.log('bridge first lines:');
console.log(fs.readFileSync(BRIDGE, 'utf8').split(eol).slice(0, 16).join('\n'));
console.log('client around edit:');
console.log(fs.readFileSync(CLIENT, 'utf8').split(eol).slice(12, 18).join('\n'));
