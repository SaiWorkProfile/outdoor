import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { ContentPage } from '../types';
import { bulkExample, depthRangeTable, materialAssumptionTable } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'paver-base',
  path: '/materials/paver-base',
  h1: 'Paver base: purpose, depth and compaction',
  metaTitle: 'Paver Base Guide: Purpose, Depth, Compaction and Quantity',
  metaDescription:
    'What compactable paver base does, why compaction changes the order quantity, how base depth is usually planned for patios, walkways and driveways, and how to buy it.',
  eyebrow: 'Material reference',
  crumb: 'Paver base',
  lede:
    'Paver base is the compactable aggregate layer under a paved surface. It spreads load, keeps the surface from settling unevenly, and provides the level platform the bedding layer is screeded onto. It is the layer that decides whether a patio stays flat, and it is usually the largest single quantity in the project.',
  keyFacts: [
    { label: 'What it is', value: 'Crushed aggregate blended with fines so it compacts' },
    { label: 'Default depth', value: `${ENGINE_ASSUMPTIONS.paver.baseDepthIn} in for a patio` },
    { label: 'Planning range', value: '4–8 in typical, more for vehicles' },
    { label: 'Compaction allowance', value: `×${ENGINE_ASSUMPTIONS.paver.baseCompactionFactor} default` },
    { label: 'Sold as', value: 'Cubic yard or ton, delivered bulk' },
    { label: 'Calculator', value: 'Paver Base Calculator' },
  ],
  sections: [
    {
      id: 'purpose',
      heading: 'What the base actually does',
      blocks: [
        {
          kind: 'p',
          text: 'A paver surface is not rigid. Each unit is bedded in sand, and the sand rests on the base. What holds the surface together is the interaction between the units, the bedding and a base that has been compacted into a firm, uniform platform. If the base is soft in one place, the surface settles there and the joints open around it.',
        },
        {
          kind: 'ul',
          items: [
            'It spreads load over a wider area than the paver itself would, which is why it is the layer that matters for strength.',
            'It provides a uniform platform, so the bedding sand has something consistent to be screeded onto.',
            'It separates the bedding from the subgrade, reducing how much sand migrates downward into the soil.',
            'It allows a small amount of drainage under the surface, which matters more in some climates and soils than others.',
          ],
        },
        { kind: 'diagram', id: 'paver-layers', caption: 'The base sits between the bedding sand and the prepared subgrade and is compacted before anything goes on top of it.' },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Site-specific requirements differ',
          text: 'Base thickness, gradation and preparation are site-specific. Soil type, drainage, ground movement through the seasons and the loads the surface carries all affect what is appropriate. The depths here are planning defaults to calculate quantities from, not a design.',
        },
      ],
    },
    {
      id: 'depth',
      heading: 'How base depth is usually planned',
      blocks: [
        { kind: 'table', table: depthRangeTable('paver-base') },
        {
          kind: 'p',
          text: 'The pattern behind those numbers is load: a walkway carries feet, a patio carries furniture and occasional foot traffic, and a driveway carries vehicles. The more load, and the softer the ground beneath, the more base is doing the work. Where the subgrade is weak or wet, the appropriate answer may be deeper preparation rather than simply a thicker layer of the same material.',
        },
      ],
    },
    {
      id: 'compaction',
      heading: 'Compaction: why the order is larger than the design depth',
      blocks: [
        {
          kind: 'p',
          text: 'Compaction removes air from the layer. A base placed loose at 6 in and then compacted will be thinner than 6 in, which is why the order is calculated with a compaction allowance rather than the finished design depth alone. In this planner the default allowance for paver base is 10%, applied before the waste allowance.',
        },
        {
          kind: 'table',
          table: {
            caption: 'What changes the order quantity for a base layer',
            head: ['Input', 'Effect on the order', 'Notes'],
            rows: [
              ['Base depth', 'Directly proportional: doubling the depth doubles the volume', 'The single biggest lever'],
              ['Compaction allowance', 'Increases the order for the same finished depth', 'Only applies to a layer that is compacted'],
              ['Waste allowance', 'Covers spillage and uneven spreading', 'Applied after compaction in the calculation'],
              ['Layer strategy', 'Two thinner compacted lifts use the same material as one thick lift', 'Also more reliable than compacting a very thick layer at once'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Compaction is a process, not a number',
          text: 'The allowance only means something if the base is compacted in lifts with a suitable machine. Loose stone spread to the correct depth is still loose stone.',
        },
      ],
    },
    {
      id: 'quantity',
      heading: 'Quantity and purchasing',
      blocks: [
        {
          kind: 'p',
          text: 'Base material is bought by the cubic yard or the ton and delivered loose. The volume is large enough that bags are rarely sensible beyond a small repair, and it is heavy enough that placement matters as much as price.',
        },
        { kind: 'table', table: materialAssumptionTable('paver-base') },
        { kind: 'example', id: 'paver-base-example' },
        {
          kind: 'checklist',
          title: 'Before ordering base material',
          items: [
            'Base depth decided, with a reason if it sits outside the typical range',
            'Excavation depth confirmed: base plus bedding plus paver thickness',
            'Compaction allowance included, and a method for compacting in lifts planned',
            'Subgrade prepared and any soft spots addressed before delivery',
            'Delivery placement agreed, because base is too heavy to move far by hand',
            'Gradation confirmed with the supplier as a compactable aggregate',
            'Edge restraint planned, since the base alone does not restrain the surface',
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
            { href: '/projects/how-to-plan-a-paver-patio', label: 'How to plan a paver patio', note: 'Where base depth sits in the build-up' },
            { href: '/projects/how-to-calculate-paver-materials', label: 'How to calculate paver materials', note: 'Base as one line of a complete take-off' },
            { href: '/materials/sand', label: 'Sand: bedding, leveling and landscaping uses' },
            { href: '/costs/paver-patio-cost', label: 'What drives paver patio cost' },
            { href: '/calculators/paver-base-calculator', label: 'Open the Paver Base Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'paver-base-example',
      title: 'Six inches of paver base under a 12 ft × 20 ft patio',
      scenario:
        'A 240 sq ft patio area with a 6 in base layer, the patio preset, the calculator default compaction allowance of ×1.1 and the default 10% waste allowance.',
      conclusion:
        'Compare this with the bedding sand example on the sand guide: the same area, and roughly five times the volume, simply because the base is six times thicker. That ratio is the reason the base is usually the largest material purchase on a paver project, and the reason a quote that prices only the pavers is not a quote for the job.',
      material: 'paver-base',
      areas: [{ kind: 'rectangle', length: 12, width: 20 }],
      depthIn: 6,
      useCase: 'patio',
      compactionFactor: ENGINE_ASSUMPTIONS.paver.baseCompactionFactor,
      compare: [4, 6, 8],
    }),
  ],
  faq: [
    {
      q: 'What kind of gravel is used for paver base?',
      a: 'A compactable aggregate: crushed stone blended with enough fine material that it knits together when compacted, rather than a single-size stone that stays loose. It is commonly described as crushed or processed aggregate, and the names vary by region, so ask for a compactable base aggregate for pavers.',
    },
    {
      q: 'How deep should paver base be?',
      a: 'The planning ranges here are 4–6 in for a walkway, 4–8 in for a patio and 8–12 in for a driveway. Those are quantity-planning defaults, and they depend on subgrade strength, drainage, ground movement and load. Where the ground is weak or the surface carries vehicles, the appropriate answer may involve deeper preparation rather than a thicker layer of the same material.',
    },
    {
      q: 'Why is compaction included in the order quantity?',
      a: 'Because a layer that is compacted ends up thinner than the loose depth you place. The allowance means the finished compacted layer reaches the design depth rather than falling short of it. It is applied before the waste allowance, and only to layers that are actually compacted.',
    },
    {
      q: 'Can I use the base material from the driveway calculator instead?',
      a: 'The driveway calculator applies the same engine to multiple aggregate layers, so it is the right tool when you are building more than one layer under a surface that takes vehicles. For a single base layer under pavers, the Paver Base Calculator gives a clearer result with the compaction default attached.',
    },
    {
      q: 'How can I tell whether base material is compacted enough?',
      a: 'Compaction is normally verified against a laboratory-determined maximum density rather than by eye, and a plate or vibrating roller is the usual tool. A useful practical check is that the surface should feel firm and not move underfoot or under a wheelbarrow, and no visible rutting should appear as the next layer goes on. For anything load-bearing, verification belongs with the person responsible for the design.',
    },
  ],
  limitations:
    'This page plans the quantity of a base material, not its adequacy. It does not determine base thickness, gradation, subgrade preparation, compaction specification or drainage for your site, and it cannot confirm that a build-up will carry a particular load or perform in your climate and soil. Base requirements are site-specific and differ from project to project. Where a paved surface carries vehicles or adjoins a structure, obtain a site-specific design.',
  related: [
    { href: '/calculators/paver-base-calculator', label: 'Paver Base Calculator', note: 'Base volume with compaction, in cubic yards and tons' },
    { href: '/projects/how-to-plan-a-paver-patio', label: 'Project guide: how to plan a paver patio' },
    { href: '/projects/how-to-calculate-paver-materials', label: 'Project guide: how to calculate paver materials' },
    { href: '/materials/gravel', label: 'Material guide: gravel and crushed stone' },
    { href: '/materials/sand', label: 'Material guide: sand' },
    { href: '/costs/paver-patio-cost', label: 'Cost guide: paver patio cost' },
    { href: '/calculators/driveway-gravel-calculator', label: 'Driveway Gravel Calculator', note: 'For multi-layer aggregate build-ups' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'paver-base-calculator',
  relatedCalculators: ['paver-calculator', 'paver-patio-calculator', 'gravel-calculator'],
};
