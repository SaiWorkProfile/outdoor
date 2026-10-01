import type { ContentPage } from '../types';
import { paverExample } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-calculate-paver-materials',
  path: '/projects/how-to-calculate-paver-materials',
  h1: 'How to calculate paver materials',
  metaTitle: 'How to Calculate Paver Materials: A 12 ft × 20 ft Example',
  metaDescription:
    'A complete paver take-off for a 12 ft × 20 ft patio: pavers with joints and waste, base and bedding volumes, edge restraint and a shopping list.',
  eyebrow: 'Paver take-off guide',
  crumb: 'How to calculate paver materials',
  lede:
    'Paver material is four purchases, not one: the pavers, the compacted base, the bedding sand and the edge restraint. This page works through a 12 ft × 20 ft patio from the first measurement to a shopping list, using the same engine as the calculators so every figure can be reproduced.',
  keyFacts: [
    { label: 'Example patio', value: '12 ft × 20 ft' },
    { label: 'Paver module', value: '6 in × 6 in plus a 1/8 in joint' },
    { label: 'Base', value: '6 in, compacted, with a 10% allowance' },
    { label: 'Bedding sand', value: '1 in, screeded' },
    { label: 'Edge restraint', value: 'Derived from the patio perimeter' },
    { label: 'Calculators', value: 'Paver Calculator and Paver Patio Calculator' },
  ],
  sections: [
    {
      id: 'order-of-work',
      heading: 'Calculate in the order the patio is built',
      blocks: [
        {
          kind: 'p',
          text: 'Working through the list in build order keeps the calculation honest. Each step uses the same measured area, so a mistake in the measurement shows up once rather than being buried in four separate estimates.',
        },
        {
          kind: 'steps',
          items: [
            { title: 'Area', body: 'Measure the patio footprint where the excavation will be, and enter each shape separately.' },
            { title: 'Base', body: 'Area × base depth, with a compaction allowance because the base is worked.' },
            { title: 'Bedding sand', body: 'Area × bedding depth. This is a thin screeded layer, so the volume is small but not zero.' },
            { title: 'Pavers', body: 'Area divided by the paver module — size plus joint — then a waste allowance for cuts.' },
            { title: 'Edge restraint', body: 'Perimeter length, or the perimeter the shape allows, plus waste, converted to stock pieces.' },
            { title: 'Shopping list', body: 'Each item with the unit your supplier sells in, plus the total paver surface area ordered for cross-checking.' },
          ],
        },
      ],
    },
    {
      id: 'the-example',
      heading: 'The 12 ft × 20 ft example',
      blocks: [
        {
          kind: 'p',
          text: 'The inputs are ordinary: a single rectangular area, 6 in × 6 in pavers, a 1/8 in joint, a 6 in compacted base, 1 in of bedding sand and the default 10% waste allowance. The result below includes the complete shopping list the calculator produces.',
        },
        { kind: 'example', id: 'paver-12x20' },
      ],
    },
    {
      id: 'reading-the-shopping-list',
      heading: 'How to read the shopping list',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Pavers are counted from the module, not the raw area, so the count already accounts for the joints between units.',
            'The paver surface area ordered is the net area plus waste. It is the number to use if your supplier sells pavers by the square foot rather than by the piece.',
            'Base material is shown in cubic yards after the compaction allowance, because that is how bulk aggregate is ordered.',
            'Bedding sand is a separate line in cubic yards, at the bedding depth rather than the base depth.',
            'Edge restraint appears as linear feet and as stock pieces, so you can buy whichever unit your supplier uses.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Use the shopping list as a quote checklist',
          text: 'Every line on the list is something you have to buy or explicitly decide not to buy. If a quote is missing the base, the bedding sand or the edge restraint, the quote is incomplete rather than cheap.',
        },
      ],
    },
    {
      id: 'cross-checks',
      heading: 'Three cross-checks worth doing by hand',
      blocks: [
        {
          kind: 'p',
          text: 'A take-off is easier to trust when two of its numbers can be checked with simple arithmetic. These three take a minute each and catch most ordering mistakes.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Hand checks against the calculator output',
            head: ['Check', 'How to do it', 'What a mismatch usually means'],
            rows: [
              ['Pavers per square foot', 'Roughly four for 6 in × 6 in pavers, because the module is a little over 6 in once the joint is included', 'A different paver size, or a joint width entered as feet rather than inches'],
              ['Excavation depth', 'Base plus bedding plus paver thickness should match the depth you are digging', 'A gradient or a step that has not been allowed for'],
              ['Edge restraint length', 'Two lengths plus two widths for a rectangle', 'A shape entered as a measured area, where the calculator cannot derive a perimeter at all'],
            ],
            note: 'These checks confirm the arithmetic. They do not confirm the design.',
          },
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'A measured area cannot produce a perimeter',
          text: 'If you enter an area directly rather than a length and width, the calculator cannot work out the edge length and says so. Enter the edge length yourself, or measure the shape as a rectangle or a circle.',
        },
      ],
    },
    {
      id: 'practical',
      heading: 'Practical ordering notes for pavers',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Pavers are often sold by the pallet or the layer, so the piece count is converted into whatever unit the supplier uses at the counter.',
            'Keep a spare bundle for later repairs. Matching a paver colour years later is unreliable, and intact offcuts do not exist unless you kept them.',
            'Confirm the paver thickness the base depth was planned around: a thicker paver changes the finished level as well as the price.',
            'Base and bedding are heavy. Check that the delivery can be placed close to the work, or plan for transporting material between the pile and the excavation.',
            'Bedding sand is sold screened and often called by a regional name. Ask for bedding sand for pavers rather than sand in general.',
          ],
        },
      ],
    },
    {
      id: 'next',
      heading: 'Related planning pages',
      blocks: [
        {
          kind: 'links',
          title: 'Keep going',
          items: [
            { href: '/projects/how-to-plan-a-paver-patio', label: 'How to plan a paver patio', note: 'Shape, layers, falls and the planning sequence' },
            { href: '/materials/sand', label: 'Sand products and what they are used for', note: 'Why bedding sand is not the same as leveling or play sand' },
            { href: '/materials/paver-base', label: 'Paver base: purpose, depth and compaction' },
            { href: '/costs/paver-patio-cost', label: 'What drives paver patio cost' },
            { href: '/calculators/paver-calculator', label: 'Open the Paver Calculator' },
            { href: '/calculators/paver-patio-calculator', label: 'Open the Paver Patio Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    paverExample({
      id: 'paver-12x20',
      title: '12 ft × 20 ft patio, 6 in × 6 in pavers',
      scenario:
        'One rectangular area with 6 in × 6 in pavers, a 1/8 in joint, a 6 in compacted base, 1 in of bedding sand and the calculator default 10% waste allowance.',
      conclusion:
        'The paver count and the base volume are both large, but they are large in different units and on different lead times: pavers are usually a stocked product counted by the piece, while base and bedding are bulk materials priced by the cubic yard. Use the paver surface area ordered as the figure to quote if your supplier prices by the square foot, and treat the base line as the one most likely to grow if the subgrade turns out softer than expected.',
      areas: [{ kind: 'rectangle', length: 12, width: 20 }],
      paverLengthIn: 6,
      paverWidthIn: 6,
    }),
  ],
  faq: [
    {
      q: 'How many pavers do I need for a 12 × 20 patio?',
      a: 'It depends on the paver size and the joint. This example uses 6 in × 6 in pavers with a 1/8 in joint, and the calculator returns a count around a thousand pieces including waste. Choose a larger paver and the count drops; widen the joint and it drops slightly further.',
    },
    {
      q: 'How much base material do I need under pavers?',
      a: 'At the default 6 in compacted base over 240 sq ft, the calculator returns about five and a half cubic yards of base after the compaction allowance, which is a bulk delivery rather than a bagged purchase. Depth is the variable that matters: a walkway base is usually thinner than a patio base, and a driveway base is thicker still.',
    },
    {
      q: 'Does the joint width really change the paver count?',
      a: 'Yes, by more than people expect. The count is based on the paver plus the joint, so a 1/8 in joint increases the module area of a 6 in paver by roughly 4%. Over a whole patio that is a meaningful number of units, and the calculator flags joints above a quarter inch because the layout changes as well as the count.',
    },
    {
      q: 'What is the difference between the Paver Calculator and the Paver Patio Calculator?',
      a: 'They use the same engine. The Paver Patio Calculator adds patio-specific framing, a named project and printable quantities so a result can be added to Project Mode and printed as part of a plan. Use whichever framing matches how you think about the job.',
    },
    {
      q: 'Should I order bedding sand in bags or bulk?',
      a: 'A patio of this size needs bedding sand as a bulk volume; bagged sand becomes expensive and laborious well before this scale. Bags make sense for repairs and small walkways. The calculator shows both so you can see where the crossover is for your own project.',
    },
  ],
  limitations:
    'This take-off converts a described build-up into purchase quantities. It does not specify the base depth your soil needs, the paver thickness a system requires, the sand gradation that suits a particular joint width, or the restraint detail at walls, steps and curves. It also cannot see a soft spot, a gradient or a drainage problem. Confirm product-specific and site-specific requirements with the supplier and, where the site is difficult, with a qualified professional.',
  related: [
    { href: '/calculators/paver-calculator', label: 'Paver Calculator', note: 'Pavers, base, bedding sand and edging from your own measurements' },
    { href: '/calculators/paver-patio-calculator', label: 'Paver Patio Calculator', note: 'Adds a named project and printable quantities' },
    { href: '/projects/how-to-plan-a-paver-patio', label: 'Project guide: how to plan a paver patio' },
    { href: '/materials/paver-base', label: 'Material guide: paver base' },
    { href: '/materials/sand', label: 'Material guide: sand' },
    { href: '/costs/paver-patio-cost', label: 'Cost guide: paver patio cost' },
    { href: '/projects', label: 'Project Mode: combine this with soil, mulch and gravel' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'paver-calculator',
  relatedCalculators: ['paver-patio-calculator', 'paver-base-calculator', 'sand-calculator'],
};
