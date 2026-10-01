import type { ContentPage } from '../types';
import { bulkExample, coverageTable, depthRangeTable, materialAssumptionTable } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'mulch',
  path: '/materials/mulch',
  h1: 'Mulch: categories, depth and coverage',
  metaTitle: 'Mulch Guide: Types, Depth, Coverage and Bags vs Bulk',
  metaDescription:
    'How mulch products differ without declaring a winner, what depth planting beds and tree rings use, how bags compare with bulk delivery, and how to plan a quantity.',
  eyebrow: 'Material reference',
  crumb: 'Mulch',
  lede:
    'Mulch is a category rather than a single product: bark, wood, and other organic materials are sold under the same word and behave differently. What they share is how they are planned — by volume, at a depth measured in inches — and that is what this page covers.',
  keyFacts: [
    { label: 'What it is', value: 'Organic material spread on the soil surface' },
    { label: 'Typically sold as', value: 'Cubic yard or 2–3 cu ft bags' },
    { label: 'Planning depth', value: '2–4 in, less on slow-draining soil' },
    { label: 'Planning density', value: 'About 0.35 tons per cubic yard when dry' },
    { label: 'Structure', value: 'Coarse mulch lasts longer; fine mulch knits faster' },
    { label: 'Calculator', value: 'Mulch Calculator' },
  ],
  sections: [
    {
      id: 'categories',
      heading: 'The categories you will actually see',
      blocks: [
        {
          kind: 'p',
          text: 'Mulch products are usually grouped by what they are made from and how they are processed. The visible differences — colour, texture, particle size — come from those two things. The practical differences are how fast the material breaks down, how well it stays in place, and how it behaves around water.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Common mulch categories and their planning characteristics',
            head: ['Category', 'Typical form', 'Planning characteristics'],
            rows: [
              ['Bark mulch', 'Shredded or chipped bark, often aged', 'Tends to knit together and stay in place; breakdown rate varies with particle size'],
              ['Wood chip mulch', 'Chipped wood from a range of sources', 'Coarse and slower to break down; appearance varies widely between batches'],
              ['Shredded or double-ground mulch', 'Finer texture, often with a uniform colour', 'Sits neatly and knits quickly; finer texture can hold more moisture against the soil'],
              ['Composted or aged material', 'Further decomposed, darker', 'Closer to a soil amendment than a cover; behaves differently in wet conditions'],
              ['Non-organic cover materials', 'Stone, rubber and similar', 'Planned like other aggregates; they do not break down, so they are replaced rather than topped up'],
            ],
            note: 'No single category is best. The right choice depends on what is being planted, how the bed drains, how it looks from the house and how often you want to top it up.',
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Colour fades, structure does not',
          text: 'Dyed mulch can lose colour over a season while keeping its structure. If colour consistency matters, ask how the product is coloured and how it holds up, rather than judging from a fresh sample.',
        },
      ],
    },
    {
      id: 'depth',
      heading: 'Depth: the number that matters most',
      blocks: [
        {
          kind: 'p',
          text: 'Mulch depth is a narrow band, because both extremes cause problems. Too thin and it does not suppress weeds or hold moisture. Too thick and it holds water against stems and trunks, which is where many mulch-related plant problems begin.',
        },
        { kind: 'table', table: depthRangeTable('mulch') },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Mulch out, not up',
          text: 'Penn State Extension puts the guidance simply: no deeper than the heel of your hand, generally 2–4 in, mulch less on poorly drained soil or with finely textured mulch, and keep all mulch away from the trunk so the root flare stays visible. This calculator uses the same range as its planning defaults.',
        },
      ],
    },
    {
      id: 'coverage',
      heading: 'Coverage and quantity planning',
      blocks: [
        {
          kind: 'p',
          text: 'Mulch is planned like any other bulk material: area × depth ÷ 12 gives cubic feet, and ÷ 27 gives cubic yards. Because mulch is light, weight rarely matters; volume is what the supplier sells and what your bed consumes.',
        },
        {
          kind: 'table',
          table: coverageTable(
            [2, 3, 4],
            [2, 3],
            'Mulch settles after spreading, so the depth you buy and the depth you see a month later are different numbers. Plan the spread depth, not the settled one.',
          ),
        },
        { kind: 'table', table: materialAssumptionTable('mulch') },
        { kind: 'example', id: 'mulch-tree-rings' },
      ],
    },
    {
      id: 'bags-vs-bulk',
      heading: 'Bags versus bulk',
      blocks: [
        {
          kind: 'p',
          text: 'A cubic yard is 27 cu ft, which is about nine 3 cu ft bags or thirteen and a half 2 cu ft bags. Comparing a bag price with a bulk price per cubic yard is the only fair comparison, and the calculator shows both counts for your own volume.',
        },
        {
          kind: 'ul',
          items: [
            'Bags are practical for a single tree ring, a repair, or a bed you are mulching one wheelbarrow at a time.',
            'Bulk becomes practical once the volume passes roughly half a cubic yard, and it is usually cheaper per cubic foot.',
            'Bulk arrives as a pile, so ask where it can be placed; a pile on a lawn you still have to mow is an irritation you will remember for a season.',
            'Compressed or baled products expand after opening. Use the fill volume printed on the label, and check whether it refers to the compressed or the spread state.',
          ],
        },
      ],
    },
    {
      id: 'practical',
      heading: 'Practical considerations',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Mulch is normally sold by volume even when it is priced by weight, so keep the two units separate when comparing quotes.',
            'Do not measure against a plant you are trying to keep dry: keep the layer clear of stems and pull it back from the base of shrubs and trees.',
            'Fresh, wet mulch weighs far more than dry mulch, which matters if you are moving it by barrow and if a delivery has to sit on a driveway.',
            'A bed that already has a mulch layer needs less than the calculation suggests unless you plan to rake the old layer out first.',
            'Termites and other wood-dwelling insects are a common reason people choose a different material near a building. That is a site decision, not a universal rule about mulch.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Topping up is normal',
          text: 'Organic mulch settles and decomposes, so a bed that is topped up annually needs less material each time than the bed needed on the first application. Calculate the top-up depth, not the full depth, for an established bed.',
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
            { href: '/projects/how-to-calculate-mulch', label: 'How to calculate mulch', note: 'Measuring beds, bag comparisons and settling, step by step' },
            { href: '/costs/mulch-cost', label: 'Bagged versus bulk mulch pricing', note: 'How to compare bag and bulk quotes fairly' },
            { href: '/materials/topsoil', label: 'Topsoil, garden soil and compost compared', note: 'The layer that may belong under the mulch' },
            { href: '/calculators/mulch-calculator', label: 'Open the Mulch Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'mulch-tree-rings',
      title: 'Six tree rings at four feet diameter, three inches deep',
      scenario:
        'Six circular tree rings, each 4 ft across, entered separately so the calculator adds them and the result shows the combined order. Depth is 3 in with the default 10% waste allowance.',
      conclusion:
        'This is the case where bags compete seriously: the combined area of a handful of tree rings is small enough that a bagged purchase is a reasonable choice, and the coverage table shows exactly how few square feet each bag covers. Remember to keep the mulch clear of the trunk, which means the area you actually cover is a ring rather than a full circle.',
      material: 'mulch',
      areas: [
        { kind: 'circle', diameter: 4 },
        { kind: 'circle', diameter: 4 },
        { kind: 'circle', diameter: 4 },
        { kind: 'circle', diameter: 4 },
        { kind: 'circle', diameter: 4 },
        { kind: 'circle', diameter: 4 },
      ],
      depthIn: 3,
      useCase: 'tree-ring',
      compare: [2, 3, 4],
    }),
  ],
  faq: [
    {
      q: 'Which mulch is best?',
      a: 'There is no universal answer, and any guide that gives one is simplifying. Coarse materials tend to last longer and stay in place; finer materials knit faster and look tidier. What suits a bed depends on the plants, the drainage, how the area looks from the house and how often you want to top it up.',
    },
    {
      q: 'How deep should mulch be around a tree?',
      a: 'The range used here is 2–4 in, with the material kept clear of the trunk. Penn State Extension’s phrasing is a good rule to remember: no deeper than the heel of your hand, and keep it away from the trunk so the root flare stays visible.',
    },
    {
      q: 'How many cubic feet are in a bag of mulch?',
      a: 'Bagged mulch is normally sold in 2 cu ft or 3 cu ft bags. A cubic yard is 27 cu ft, so that is about 13.5 bags of the smaller size or nine bags of the larger. The calculator converts your own volume into both bag counts.',
    },
    {
      q: 'Does mulch need to be removed before adding more?',
      a: 'Usually not, provided the existing layer is not already too deep and has not matted into a water-resistant crust. Raking the old layer to break the surface before topping up helps water move through it. If the layer has built up over years, removing some material is a better answer than adding more.',
    },
    {
      q: 'Why is mulch sold by the cubic yard rather than by weight?',
      a: 'Because weight varies enormously with moisture and material. A cubic yard of dry mulch and the same volume soaked after rain can differ substantially in weight, while the volume stays the same. Volume is the stable measure of what a bed consumes.',
    },
  ],
  sources: [
    {
      label: 'Penn State Extension — Mulching Landscape Trees',
      note: 'Independent guidance on mulch depth and on keeping mulch clear of the trunk.',
      url: 'https://extension.psu.edu/mulching-landscape-trees',
    },
  ],
  limitations:
    'This guide describes planning characteristics, not horticultural recommendations for a specific planting. It does not assess soil, drainage, plant health, insect or disease risk, and it cannot tell you which product is appropriate for your beds, your climate or your building. Mulch behaviour also varies between suppliers and between batches of the same product. Take planting-specific advice from a horticultural or landscape professional.',
  related: [
    { href: '/calculators/mulch-calculator', label: 'Mulch Calculator', note: 'Depth comparison, cubic yards, bags and your own price' },
    { href: '/projects/how-to-calculate-mulch', label: 'Project guide: how to calculate mulch' },
    { href: '/costs/mulch-cost', label: 'Cost guide: bagged versus bulk mulch' },
    { href: '/materials/topsoil', label: 'Material guide: topsoil, garden soil and compost' },
    { href: '/calculators/topsoil-calculator', label: 'Topsoil Calculator', note: 'For beds that need soil before mulch' },
    { href: '/calculators/landscape-rock-calculator', label: 'Landscape Rock Calculator', note: 'For a non-organic cover that does not decompose' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'mulch-calculator',
  relatedCalculators: ['topsoil-calculator', 'soil-calculator', 'landscape-rock-calculator'],
};
