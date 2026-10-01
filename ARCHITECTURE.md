# Outdoor Project Calculator Platform — UI Architecture

## Source of truth

The calculation engine under `src/lib/calculations/` is authoritative. The UI converts form state into engine inputs, calls the engine, and renders typed results. No calculator formula is duplicated in presentation code.

## App layers

- `src/app/` — routes, metadata, sitemap, robots, print view.
- `src/components/ui/` — primitive visual system and accessible form controls.
- `src/components/layout/` — header, footer, breadcrumbs.
- `src/components/calculators/` — reusable calculator shell, registry, forms, result presentation, Project Mode integration.
- `src/lib/project-store/` — browser-local Project Mode persistence and mapping.
- `src/lib/calculations/` — calculation engine (unchanged source of truth).
- `src/data/assumptions.ts` — centralized assumptions surfaced in the UI.
- `src/types/css.d.ts` — ambient declaration for plain global stylesheet imports (`import './globals.css'`), which Next.js 16 no longer declares.

## Rendering strategy

Calculator routes are statically enumerated from the 16 calculator definitions. The page shell and content metadata are server-rendered; interactive calculator controls live in a client component. Project Mode and print preview use browser state only and require no backend.

## Data flow

`Form state → typed engine input → calculation result → Result UI → optional ProjectMaterial → localStorage Project → printable plan`

## SEO scope

This phase implements technical SEO infrastructure only. It does not generate the 50-page content library or programmatic keyword pages.
