/**
 * Ambient declarations for plain (non-module) stylesheet imports.
 *
 * `src/app/layout.tsx` loads the global stylesheet for its side effects:
 *
 *   import './globals.css';
 *
 * TypeScript cannot resolve a `.css` file as a module, so that import only
 * type-checks when an ambient wildcard module declaration exists. Next.js 16
 * ships declarations for CSS Modules only (`*.module.css`, `*.module.sass`,
 * `*.module.scss` in `next/types/global.d.ts`) and no longer declares `*.css`.
 * TypeScript 6 enables `noUncheckedSideEffectImports` by default (5.x only
 * enabled it when opted in), which reports the missing declaration as:
 *
 *   TS2882: Cannot find module or type declarations for side-effect import
 *   of './globals.css'.
 *
 * Declaring the wildcard module keeps global stylesheet imports resolvable
 * without turning the check off project-wide via
 * `"noUncheckedSideEffectImports": false`. A global stylesheet exports nothing,
 * so the declared module intentionally has no exports.
 */
declare module '*.css';
