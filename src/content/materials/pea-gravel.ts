import type { ContentPage } from '../types';
import { bulkExample, coverageTable, depthRangeTable, materialAssumptionTable } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'pea-gravel',
  path: '/materials/pea-gravel',
  h1: 'Pea gravel: uses, coverage and depth',
  metaTitle: 'Pea Gravel Guide: Uses, Coverage, Depth and Quantity',
  metaDescription:
    'How pea gravel behaves as a surface, where its rounded shape helps and hurts, common depths, and how to calculate a cubic yard, ton or bag quantity.',
  eyebrow: 'Material reference',
  crumb: 'Pea gravel',
  lede:
    'Pea gravel is small, rounded stone, usually around 3/8 in. Its rounded shape is why it feels good underfoot and why it will not lock together: it shifts, it migrates, and it needs edging to stay where you put it. Plan it as a decorative surface rather than a structural layer.',
  keyFacts: [
    { label: 'Typical size', value: 'About 3/8 in, rounded' },
    { label: 'Shape', value: 'Smooth, so it does not interlock' },
    { label: 'Planning depth', value: '1–3 in for most decorative uses' },
    { label: 'Sold as', value: '0.5 cu ft bags, cubic yards or tons' },
    { label: 'Planning density', value: 'About 1.4 tons per cubic yard' },
    { label: 'Calculator', value: 'Pea Gravel Calculator' },
  ],
  sections: [
    {
      id: 'what-it-is',
      heading: 'What makes pea gravel different',
      blocks: [
        {
          kind: 'p',
          text: 'Pea gravel is a single-size, rounded stone. Being rounded, the particles do not have the interlocking edges that crushed stone gets from being broken, so a bed of pea gravel behaves more like a loose granular surface than a locked layer. That has three practical consequences: it compacts poorly, it migrates on slopes and against edges, and it is comfortable to walk on barefoot.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Where the rounded shape helps and where it hurts',
            head: ['Behaviour', 'Helps with', 'Hurts with'],
            rows: [
              ['Does not interlock', 'Loose decorative surfaces, dry pathways, planted areas', 'Any layer that needs to carry load or stay put'],
              ['Shifts underfoot', 'Barefoot areas and gentle garden paths', 'Wheeled loads, furniture legs, steep ramps'],
              ['Small particle size', 'Filling around plants and hiding the fabric below', 'Staying out of lawn edges, drains and shoes'],
              ['Drains freely', 'Water movement through the bed', 'Retaining any moisture for planting'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Pea gravel is a surface, not a base',
          text: 'If you need load spreading or a stable platform, that is a compactable aggregate under the surface. Pea gravel over a properly compacted base works well; pea gravel in place of a base does not.',
        },
      ],
    },
    {
      id: 'uses-and-depth',
      heading: 'Uses and depths',
      blocks: [
        { kind: 'table', table: depthRangeTable('pea-gravel') },
        {
          kind: 'ul',
          items: [
            'Walkways and garden paths: the most common use. Edging matters more here than in any other project, because the stone spreads sideways with every footstep.',
            'Decorative garden cover: often used over fabric around shrubs, where the small particle size hides the fabric line well.',
            'Patio and seating areas: workable, but loose stone is uncomfortable under furniture legs unless the furniture has wide feet or rests on a solid base.',
            'Play areas and utility covers: a common choice where a soft-looking, free-draining surface is wanted, though it is not a safety surfacing and should not be treated as one.',
            'Around pipework and underground services: a rounded single-size stone is often used as bedding, but the specification belongs to the utility or engineer, not to this page.',
          ],
        },
      ],
    },
    {
      id: 'quantity',
      heading: 'Coverage and quantity',
      blocks: [
        {
          kind: 'p',
          text: 'Because pea gravel is laid in thin layers, small changes in depth change the order noticeably. Two inches over a path is a light decorative cover; three inches feels more substantial and hides the base better. The coverage table below is calculated by the same engine the calculator uses.',
        },
        {
          kind: 'table',
          table: coverageTable(
            [1, 2, 3],
            [0.5],
            'Rounded stone spreads sideways as well as down, so a path treated with edging usually uses less material than the same path left open at the edges.',
          ),
        },
        { kind: 'table', table: materialAssumptionTable('pea-gravel') },
        { kind: 'example', id: 'pea-gravel-walkway' },
      ],
    },
    {
      id: 'drainage',
      heading: 'Drainage considerations',
      blocks: [
        {
          kind: 'p',
          text: 'Pea gravel drains freely, which is why it is popular in damp corners of a garden. But free-draining stone over a compacted or clay-heavy subgrade can become a shallow reservoir: water passes through the stone and then sits on the surface beneath it. Where that matters, the water needs somewhere to go rather than somewhere to hide.',
        },
        {
          kind: 'ul',
          items: [
            'A landscape fabric under the stone keeps soil from migrating up into the stone, but it does not create drainage.',
            'If the ground below does not drain, the stone bed will hold water. A shallow channel or a fall toward a planting bed or drain is a design decision, not a material one.',
            'Edging performs a double role: it keeps stone in place and it holds the edge of the layer so water does not wash the stone outward.',
            'On a slope, a rounded stone will creep downhill. Consider a different, more angular material for sloped surfaces, or a stabilised detail.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Free-draining is not the same as well-drained',
          text: 'The stone drains; the ground may not. If a path or patio sits permanently wet, the answer is usually the ground beneath it rather than a different decorative stone.',
        },
      ],
    },
    {
      id: 'practical',
      heading: 'Practical guidance',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Buy edging before the stone, not after. Without it, pea gravel ends up in the lawn after the first wet week.',
            'Consider a 30° or steeper edge detail at the lawn boundary, because a flat edge is easy for the stone to escape over.',
            'Expect to top up. A decorative pea gravel surface loses depth over time, and keeping a spare bag or two makes the repair simple.',
            'Raking shows the pattern of the surface below. A visibly uneven surface means the base is uneven, not the stone.',
            'Pea gravel is difficult to sweep clear of hard surfaces once it has spread. Transitions to paving are worth detailing rather than hoping for the best.',
          ],
        },
      ],
    },
    {
      id: 'next',
      heading: 'Related guides',
      blocks: [
        {
          kind: 'links',
          title: 'Keep going',
          items: [
            { href: '/projects/how-much-gravel-do-i-need', label: 'How much gravel do I need?', note: 'The calculation process, from measurement to order' },
            { href: '/materials/gravel', label: 'Gravel: sizes, uses and quantity planning', note: 'The angular options, including compactable gradations' },
            { href: '/costs/gravel-cost', label: 'What changes the price of gravel' },
            { href: '/calculators/pea-gravel-calculator', label: 'Open the Pea Gravel Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'pea-gravel-walkway',
      title: 'A 3 ft wide path running 40 ft, at two inches deep',
      scenario:
        'A 120 sq ft decorative path surface in pea gravel at 2 in deep, using the walkway preset and the default 10% waste allowance.',
      conclusion:
        'Note how modest the volume is: a thin layer over a narrow path is one of the few jobs where bagged material and a small bulk order are genuinely comparable. The depth comparison shows the leverage — a 3 in path is a single delivery rather than a few bags, which is worth knowing before you decide how thick to spread it.',
      material: 'pea-gravel',
      areas: [{ kind: 'rectangle', length: 3, width: 40 }],
      depthIn: 2,
      useCase: 'walkway',
      compare: [1, 2, 3],
    }),
  ],
  faq: [
    {
      q: 'How deep should pea gravel be?',
      a: 'For a decorative path or bed cover, 1–3 in is the planning range used here, with 2 in as the typical depth. Two inches hides the base and the fabric below while staying comfortable to walk on. Deeper than 3 in makes walking harder and makes the stone more likely to spread at the edges.',
    },
    {
      q: 'How many bags of pea gravel do I need?',
      a: 'Bagged pea gravel is normally sold in 0.5 cu ft bags, so a cubic yard is 54 bags. That is why bags suit small repairs and individual tree rings rather than paths: a 120 sq ft path at 2 in deep is around 0.8 cubic yards, which is more than 40 bags before any allowance.',
    },
    {
      q: 'Can I put pea gravel over soil?',
      a: 'You can, but it will migrate into the soil and disappear over time, and weeds will come through unless you use a fabric. A fabric over a firm base, with edging at the boundary, is the detail that makes a pea gravel surface last. The calculator plans the stone quantity; the layers beneath it are a separate decision.',
    },
    {
      q: 'Is pea gravel good for a driveway?',
      a: 'No. A rounded stone does not lock together, so it cannot spread the load of a vehicle and it will rut, spread and migrate. Driveways need compactable aggregate for the base and, usually, a more angular surface material. Use the driveway calculator for that build-up instead.',
    },
    {
      q: 'Does pea gravel need to be compacted?',
      a: 'It should not be treated as a compactable material. The calculator applies compaction only when you turn it on, and for pea gravel it normally stays off: the stone is a loose surface. What does need compacting is the base beneath it, which is a separate layer with its own quantity.',
    },
  ],
  limitations:
    'This page describes material planning characteristics. It cannot tell you whether pea gravel is suitable for a particular slope, drainage arrangement, play area or utility application, and it is not a safety surfacing of any kind. It also cannot confirm the grading, cleanliness or angularity of a specific supplier product. Confirm the material you are buying with the supplier and, where a detail carries load, drainage or a regulated function, with a qualified professional.',
  related: [
    { href: '/calculators/pea-gravel-calculator', label: 'Pea Gravel Calculator', note: 'Coverage, cubic yards, tons, bags and your own price' },
    { href: '/projects/how-much-gravel-do-i-need', label: 'Project guide: how much gravel do I need?' },
    { href: '/materials/gravel', label: 'Material guide: gravel and crushed stone' },
    { href: '/costs/gravel-cost', label: 'Cost guide: what changes the price of gravel' },
    { href: '/calculators/landscape-rock-calculator', label: 'Landscape Rock Calculator', note: 'For larger decorative stone that stays put' },
    { href: '/calculators/paver-base-calculator', label: 'Paver Base Calculator', note: 'For the compactable layer pea gravel cannot provide' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'pea-gravel-calculator',
  relatedCalculators: ['gravel-calculator', 'landscape-rock-calculator', 'paver-base-calculator'],
};
