import type { ContentPage } from '../types';
import { bulkExample, coverageTable, depthRangeTable, materialAssumptionTable } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'gravel',
  path: '/materials/gravel',
  h1: 'Gravel: sizes, uses and how to plan quantities',
  metaTitle: 'Gravel Guide: Types, Sizes, Uses and Quantity Planning',
  metaDescription:
    'What gravel is, how gradation changes what it is good for, which depths common projects use, and how to convert area and depth into a cubic yard, ton or bag order.',
  eyebrow: 'Material reference',
  crumb: 'Gravel',
  lede:
    'Gravel is a broad word covering crushed stone of many sizes and gradations, and the differences are not cosmetic: a stone that makes a good driveway base is a poor decorative cover, and the reverse. This page explains what changes between products, how to plan a quantity, and what to ask for at the counter.',
  keyFacts: [
    { label: 'What it is', value: 'Crushed or screened stone, sold by size and gradation' },
    { label: 'Sold as', value: 'Cubic yard, ton, or 0.5 cu ft bags' },
    { label: 'Planning density', value: 'About 1.4 tons per cubic yard' },
    { label: 'Common depths', value: '2–4 in loose cover, more for a compacted base' },
    { label: 'Compaction', value: 'Only matters for compactable gradations' },
    { label: 'Calculator', value: 'Gravel Calculator' },
  ],
  sections: [
    {
      id: 'what-gravel-is',
      heading: 'What gravel actually is',
      blocks: [
        {
          kind: 'p',
          text: 'Gravel is stone that has been crushed and screened to a target size range. What makes one product different from another is mostly gradation: whether the particles are all roughly one size, or whether a range of sizes is deliberately included. Rock type matters too, because limestone, granite and trap rock behave slightly differently, but gradation is the variable that changes what a product can be used for.',
        },
        {
          kind: 'table',
          table: {
            caption: 'The two ends of the gradation range, and what each is good for',
            head: ['Gradation', 'What it looks like', 'What it is used for'],
            rows: [
              ['Single-size (open graded)', 'Particles of a similar size, with visible gaps between them', 'Decorative cover, drainage layers, pipe bedding. Water moves through it'],
              ['Blended with fines (dense graded)', 'A mix of stone sizes plus fine material that fills the gaps', 'Base layers and surfaces that get compacted. It knits together and carries load'],
              ['Rounded (as opposed to crushed)', 'Smooth, naturally weathered particles such as pea gravel', 'Decorative cover, walkways, play areas. It shifts underfoot and does not lock together'],
            ],
            note: 'Ask for the product by the supplier catalogue name plus the size. Generic words like “gravel” or “drainage stone” mean different things in different regions.',
          },
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Gradation is a planning decision, not a detail',
          text: 'Using a single-size decorative stone as a base under pavers, or a dense compactable stone as a decorative bed cover, is a common and expensive mismatch. The quantity can be right and the material still be wrong for the job.',
        },
      ],
    },
    {
      id: 'uses',
      heading: 'Common uses and the size question',
      blocks: [
        {
          kind: 'p',
          text: 'Most projects fall into one of a handful of patterns. Identifying which one you are doing tells you whether you need an open-graded stone, a compactable one, or both.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Typical uses and the planning depth each one suggests',
            head: ['Use', 'Typical gradation', 'Planning depth', 'Notes'],
            rows: [
              ['Garden walkway surface', 'Open graded or rounded', '2–4 in', 'Usually over a compacted base; edging keeps it in place'],
              ['Gravel patio seating area', 'Open graded or rounded', '2–4 in', 'Loose stone is hard on furniture legs'],
              ['Driveway base', 'Dense graded with fines', '4 in and up, compacted', 'The layer that spreads load; site-specific'],
              ['Driveway surface', 'Dense graded, smaller top size', '2 in, compacted', 'Renewed more often than the base'],
              ['Drainage layer or French drain', 'Open graded, single size', 'Set by the drain detail', 'Water must move through it; fines defeat the purpose'],
              ['Pipe and utility bedding', 'Open graded, single size', 'Set by the detail', 'Placed to a specified profile, not raked flat'],
              ['Decorative bed cover', 'Single size or rounded', '2–4 in', 'Larger stone needs more depth to hide the fabric below'],
            ],
          },
        },
        { kind: 'table', table: depthRangeTable('gravel') },
      ],
    },
    {
      id: 'quantity',
      heading: 'Planning a quantity',
      blocks: [
        {
          kind: 'p',
          text: 'Gravel quantity is area × depth, converted into whatever unit your supplier sells in. The conversion chain is always the same: cubic feet, then cubic yards, then tons, then bags. What changes between projects is the depth and whether a compaction allowance applies.',
        },
        {
          kind: 'table',
          table: coverageTable(
            [1, 2, 3, 4],
            [0.5],
            'Depth is the lever here: at 2 in a bag covers roughly twice the area it covers at 4 in, which is why the depth decision matters more than the stone choice.',
          ),
        },
        { kind: 'table', table: materialAssumptionTable('gravel') },
        { kind: 'example', id: 'gravel-path-example' },
      ],
    },
    {
      id: 'bulk-vs-bags',
      heading: 'Bulk versus bags',
      blocks: [
        {
          kind: 'p',
          text: 'Bagged stone is convenient and expensive per unit. Bulk stone is cheaper per unit but arrives in a pile that has to be moved, and it comes with a delivery charge and often a minimum order. The crossover point is roughly where moving bags stops being a five-minute job.',
        },
        {
          kind: 'ul',
          items: [
            'Under about half a cubic yard, bags usually make sense: two people can carry the whole order in one trip.',
            'Between half and two cubic yards, either can work. The deciding factor is usually access rather than price.',
            'Above two cubic yards, a delivered load is almost always easier, provided the truck can place it where you need it.',
            'If access is difficult, a smaller number of larger loads can still beat many small deliveries: ask about the vehicle size before ordering.',
          ],
        },
      ],
    },
    {
      id: 'purchasing',
      heading: 'Purchasing considerations',
      blocks: [
        {
          kind: 'checklist',
          title: 'What to confirm before ordering',
          items: [
            'The product by catalogue name and size, not by the word “gravel”',
            'Whether it is open graded or blended with fines, because that decides whether it compacts',
            'The unit the price is quoted in — cubic yard, ton or bag — and any delivery charge',
            'The density figure the supplier uses, if you are ordering by weight',
            'Where the load can be placed, and whether the vehicle can reach it',
            'Whether the stone is washed or contains dust, because that affects how it looks and how it settles',
            'Colour consistency across the batch, if the stone is decorative and visible',
          ],
        },
        {
          kind: 'p',
          text: 'One practical point about ordering by weight: because moisture changes the weight of the same volume, a tonnage order and a volume order are not interchangeable. If your supplier sells by the ton, ask what density they price with, and compare that against the cubic yard figure the calculator gives you.',
        },
      ],
    },
    {
      id: 'mistakes',
      heading: 'Common mistakes',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'Mistakes that show up after delivery',
            head: ['Mistake', 'Consequence', 'Avoid it by'],
            rows: [
              ['Ordering decorative stone for a base', 'The base never locks together and the surface moves', 'Asking whether the product is blended with fines'],
              ['Ignoring compaction on a compactable layer', 'The finished depth falls short', 'Turning on the compaction allowance and compacting in lifts'],
              ['Using a dense stone around drainage', 'Water cannot move through the layer', 'Specifying an open-graded single-size stone for drainage'],
              ['Measuring the finished surface for the quantity', 'The order is short, because the layer below is wider', 'Measuring at the level the stone will sit on'],
              ['Assuming all gravel looks the same', 'A colour or texture that does not match the sample once spread', 'Ordering a small sample first, or viewing the actual stock'],
            ],
          },
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
            { href: '/projects/how-much-gravel-do-i-need', label: 'How much gravel do I need?', note: 'The measurement and conversion process step by step' },
            { href: '/projects/how-to-plan-a-gravel-driveway', label: 'How to plan a gravel driveway', note: 'Multi-layer planning for vehicle traffic' },
            { href: '/costs/gravel-cost', label: 'What changes the price of gravel' },
            { href: '/materials/pea-gravel', label: 'Pea gravel', note: 'The rounded, smaller cousin, and where it behaves differently' },
            { href: '/materials/paver-base', label: 'Paver base', note: 'The compactable aggregate used under pavers' },
            { href: '/calculators/gravel-calculator', label: 'Open the Gravel Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'gravel-path-example',
      title: 'Gravel for a 4 ft × 25 ft garden path',
      scenario:
        'A 100 sq ft path with a 3 in surface layer of gravel, using the walkway preset, the default 10% waste allowance and no compaction allowance because the layer is a loose cover.',
      conclusion:
        'This is the classic small-project result: a volume that bags can still cover, and a comparison table that shows how quickly the order grows with depth. The interesting decision is not the arithmetic but the base beneath — a loose 3 in cover over soft ground will not stay flat regardless of how accurate the quantity is.',
      material: 'gravel',
      areas: [{ kind: 'rectangle', length: 4, width: 25 }],
      depthIn: 3,
      useCase: 'walkway',
      compare: [2, 3, 4],
    }),
  ],
  faq: [
    {
      q: 'How many square feet does a ton of gravel cover?',
      a: 'It depends on depth and density. At roughly 1.4 tons per cubic yard, one ton is about 0.71 cubic yards, which covers around 77 sq ft at 3 in deep and around 115 sq ft at 2 in. The calculator works in cubic yards and tons at the same time so you can convert a supplier quote either way.',
    },
    {
      q: 'What size gravel should I use for a walkway?',
      a: 'A surface layer for walking is normally a smaller stone because it is comfortable underfoot, and it is often rounded or a small open-graded product. Larger stone is harder on shoes and furniture legs, and it needs more depth to look finished. The walkway range in the calculator is 2–4 in deep, and the size itself is a supplier catalogue choice.',
    },
    {
      q: 'Does gravel need a base underneath?',
      a: 'For a path that stays flat, yes in most cases: a compactable layer under a decorative cover is what stops the surface migrating and settling unevenly. A thin cover spread straight onto firm, well-drained ground can work, but it will follow whatever the ground does. The calculator plans each layer separately so you can price both.',
    },
    {
      q: 'Is gravel cheaper by the ton or by the cubic yard?',
      a: 'Neither is inherently cheaper; the units describe the same material differently. Convert both to the same figure before comparing. Roughly 1.4 tons per cubic yard is a useful planning factor, and the calculator shows both so a volume quote and a weight quote can be compared directly.',
    },
  ],
  limitations:
    'This material guide describes planning characteristics, not specification requirements. It cannot tell you which gradation your drainage or base actually needs, how deep a layer should be for your soil and loads, or whether a particular product is suitable for a slope, a driveway or a drainage detail. Rock type, gradation, moisture and supplier practice all vary by region. Confirm product suitability with your supplier and, where the work is structural or drainage-related, with a qualified professional.',
  related: [
    { href: '/calculators/gravel-calculator', label: 'Gravel Calculator', note: 'Cubic yards, tons, bags, waste and your own price' },
    { href: '/projects/how-much-gravel-do-i-need', label: 'Project guide: how much gravel do I need?' },
    { href: '/costs/gravel-cost', label: 'Cost guide: what changes the price of gravel' },
    { href: '/materials/pea-gravel', label: 'Material guide: pea gravel' },
    { href: '/materials/paver-base', label: 'Material guide: paver base' },
    { href: '/calculators/driveway-gravel-calculator', label: 'Driveway Gravel Calculator', note: 'For multi-layer vehicle surfaces' },
    { href: '/calculators/landscape-rock-calculator', label: 'Landscape Rock Calculator', note: 'For larger decorative stone' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'gravel-calculator',
  relatedCalculators: ['pea-gravel-calculator', 'driveway-gravel-calculator', 'paver-base-calculator'],
};
