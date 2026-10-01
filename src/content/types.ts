import type { CalculatorSlug } from '@/components/calculators/registry';
import type { CurrencyTextValue } from '@/lib/currency/money-value';

/**
 * Content system types.
 *
 * A content page is data, not markup, so 28 pages stay maintainable and no two
 * pages are forced through an identical template. Every page still renders
 * through one accessible component.
 *
 * Numbers that depend on the calculation engine are never typed by hand: the
 * `workedExamples` in each content entry are produced by calling the same
 * functions the calculators use (see `src/content/shared.ts`).
 *
 * Money is never baked into a string either: a price is stored as a
 * `CurrencyTextValue` money part and formatted in the visitor's selected
 * currency when the page renders (see `src/components/currency/CurrencyText`).
 */

export type Cluster = 'projects' | 'materials' | 'costs';

export type DiagramId =
  | 'area-measure'
  | 'gravel-depth'
  | 'mulch-depth'
  | 'driveway-layers'
  | 'fence-components'
  | 'post-hole'
  | 'paver-layers'
  | 'slab-section'
  | 'deck-parts';

export interface TableSpec {
  caption?: string;
  head: string[];
  /** A cell is text, or money that is formatted in the visitor's selected currency. */
  rows: CurrencyTextValue[][];
  note?: string;
}

export interface ContentLink {
  label: string;
  href: string;
  note?: string;
}

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'checklist'; title: string; items: string[] }
  | { kind: 'steps'; items: { title: string; body: string }[] }
  | { kind: 'table'; table: TableSpec }
  | { kind: 'callout'; tone: 'info' | 'warning' | 'success'; title: string; text: string }
  | { kind: 'diagram'; id: DiagramId; caption: string }
  | { kind: 'example'; id: string }
  | { kind: 'links'; title: string; items: ContentLink[] };

export interface Section {
  /** Anchor id, also used by the table of contents. */
  id: string;
  heading: string;
  blocks: Block[];
}

export interface WorkedExample {
  id: string;
  title: string;
  /** What the project is, in one sentence. */
  scenario: string;
  inputs: { label: string; value: CurrencyTextValue }[];
  results: { label: string; value: CurrencyTextValue; note?: CurrencyTextValue }[];
  tables?: TableSpec[];
  conclusion: string;
}

export interface SourceRef {
  label: string;
  note: string;
  url: string;
}

export interface ContentPage {
  cluster: Cluster;
  slug: string;
  /** Full path, including the cluster segment. */
  path: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** Short label used above the H1, in breadcrumbs and in cross-page link lists. */
  eyebrow: string;
  /** Short breadcrumb label for this page. */
  crumb: string;
  /** One-paragraph direct answer to the primary question. */
  lede: string;
  /** Quick-answer rows shown in the summary panel. */
  keyFacts?: { label: string; value: string }[];
  sections: Section[];
  workedExamples?: WorkedExample[];
  faq?: { q: string; a: string }[];
  sources?: SourceRef[];
  /** What this page and its calculator cannot tell the reader. */
  limitations: string;
  related: ContentLink[];
  primaryCalculator: CalculatorSlug;
  relatedCalculators?: CalculatorSlug[];
}
