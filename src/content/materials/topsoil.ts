import type { ContentPage } from '../types';
import { bulkExample, depthRangeTable, materialAssumptionTable } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'topsoil',
  path: '/materials/topsoil',
  h1: 'Topsoil, garden soil and compost compared',
  metaTitle: 'Topsoil vs Garden Soil vs Compost: What Each One Is For',
  metaDescription:
    'How topsoil, garden soil and compost differ, where the terminology varies between suppliers, what depth each application uses, and how to plan a soil quantity.',
  eyebrow: 'Material reference',
  crumb: 'Topsoil, garden soil and compost',
  lede:
    'These three words are used loosely, and sometimes interchangeably, which is why so many soil projects go wrong before anyone measures anything. The distinction that matters is what each product is intended to do: add mineral growing depth, provide a ready-to-plant blend, or improve what is already there.',
  keyFacts: [
    { label: 'Topsoil', value: 'Mineral soil, usually screened; adds growing depth' },
    { label: 'Garden soil', value: 'Usually a topsoil and compost blend; intended for planting into' },
    { label: 'Compost', value: 'Decomposed organic matter; an amendment, not a growing medium' },
    { label: 'Lawn top-dressing', value: 'Around ¼–½ in at a time' },
    { label: 'Bed and raised-bed depths', value: '4–8 in for beds, more for deep fills' },
    { label: 'Calculator', value: 'Topsoil Calculator and Soil Calculator' },
  ],
  sections: [
    {
      id: 'definitions',
      heading: 'A working distinction, and why it is only working',
      blocks: [
        {
          kind: 'p',
          text: 'There is no universal definition enforced across suppliers, so the label matters more than the name. What follows is a practical way to read the terms rather than a specification, and it is the distinction this site uses when it talks about planning depths.',
        },
        {
          kind: 'table',
          table: {
            caption: 'How the three products differ in practice',
            head: ['Product', 'What it usually is', 'What it is used for', 'What it is not'],
            rows: [
              ['Topsoil', 'Screened mineral soil, sometimes blended', 'Building up or replacing the growing layer before planting', 'A guaranteed fertile or weed-free medium'],
              ['Garden soil / planting mix', 'A blend, commonly topsoil with compost or other organic material', 'Filling beds and planters to plant into directly', 'A single product with a standard recipe'],
              ['Compost', 'Decomposed organic material', 'Improving existing soil structure and biology', 'A complete growing medium on its own in most cases'],
              ['Fill dirt / subsoil', 'Uneven mineral material, low organic content', 'Raising levels where nothing is growing', 'Topsoil, despite sometimes being sold nearby'],
            ],
            note: 'Suppliers blend, screen and name products differently by region. Ask what a product is made from rather than relying on the word on the bag.',
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'The cheapest per-yard product is often the wrong one',
          text: 'Fill dirt is cheaper than topsoil because it is not the same material. Using it where plants are expected to grow is not a saving, it is a second project waiting to happen once the plants fail.',
        },
      ],
    },
    {
      id: 'applications',
      heading: 'How each application changes the depth',
      blocks: [
        {
          kind: 'p',
          text: 'Depth is what turns a product choice into a quantity, and the same product is used at very different depths depending on the job. The calculator keeps a preset for each of the common applications so the depth guidance stays attached to the use.',
        },
        { kind: 'table', table: depthRangeTable('topsoil') },
        {
          kind: 'ul',
          items: [
            'Top-dressing a lawn is a thin application repeated over time. It is not a way to rebuild a lawn in a single weekend.',
            'Planting beds are usually improved: the added depth sits on top of existing soil and is worked in, so the total rooting depth is larger than the number you order.',
            'Raised beds are filled to a chosen depth, which makes them the easiest soil project to calculate and the hardest to guess.',
            'New lawns on poor subsoil need the deepest application of the four, and the right figure depends on how much existing material is worth keeping.',
          ],
        },
      ],
    },
    {
      id: 'quantity',
      heading: 'Quantity planning',
      blocks: [
        {
          kind: 'p',
          text: 'Soil quantity is area × depth, and depth is the whole argument. Two projects with the same area can differ by a factor of twenty depending on whether they are top-dressing a lawn or filling a raised bed.',
        },
        { kind: 'table', table: materialAssumptionTable('topsoil') },
        { kind: 'example', id: 'topsoil-raised-example' },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Check the volume you calculate against published guidance',
          text: 'For thin lawn applications, published extension guidance gives volumes per unit area that can be checked against the calculator. The project guide for topsoil walks through that comparison depth by depth, which is a useful way to confirm the arithmetic before ordering.',
        },
      ],
    },
    {
      id: 'supplier-questions',
      heading: 'Questions worth asking a soil supplier',
      blocks: [
        {
          kind: 'checklist',
          title: 'Before ordering soil',
          items: [
            'What is the product made from — screened soil, a blend, or mostly subsoil?',
            'What is it screened to, and does the screening remove stones, roots and debris?',
            'Has it been tested, and can you see the results for pH and organic content?',
            'How is it stored, and is it covered, since wet soil weighs more and can slump in a pile',
            'Is it sold by volume or by weight, and what does the loader operator actually measure?',
            'Is it blended with compost already, so you know whether to add more?',
            'What does “garden soil” mean on this supplier’s price list specifically?',
          ],
        },
        {
          kind: 'p',
          text: 'A soil test is the answer to most quality questions, and it is a small cost relative to a failed lawn or a bed that never performs. Volume planning tells you how much to move; it says nothing about whether the material is suitable.',
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
            'Soil settles as it is watered and worked, so a layer spread to the target depth will be thinner in a month.',
            'Moisture changes the weight of a cubic yard substantially, which matters for barrows, driveways and any load limit.',
            'Blending on site — soil, compost and existing ground — usually produces a better result than ordering one perfect product.',
            'Screened soil is not sterile soil. Weeds, roots and stones survive screening of all but the finest mesh.',
            'If a raised bed is more than about a foot deep, neither the whole depth has to be a premium blend nor the whole depth the cheapest fill; a layered fill is a common and sensible approach.',
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
            { href: '/projects/how-much-topsoil-do-i-need', label: 'How much topsoil do I need?', note: 'Lawn, bed, raised bed and new lawn examples with a published cross-check' },
            { href: '/costs/landscaping-project-cost', label: 'What drives landscaping project cost' },
            { href: '/materials/mulch', label: 'Mulch: categories, depth and coverage', note: 'The surface layer that usually goes on top of soil' },
            { href: '/calculators/topsoil-calculator', label: 'Open the Topsoil Calculator' },
            { href: '/calculators/soil-calculator', label: 'Open the Soil Calculator', note: 'For general soil and fill by area and depth' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'topsoil-raised-example',
      title: 'Filling a 4 ft × 8 ft raised bed to twelve inches',
      scenario:
        'One raised bed measured on its inside dimensions and filled to 12 in of depth, using the raised-bed preset and the default 10% waste allowance.',
      conclusion:
        'The bag rows are the practical part of this result. A single bed of this size is only just past the point where bags stop being convenient, so the quantity is small in absolute terms even though the depth is large. That is because the area is small — the opposite of the lawn case, where a thin layer over a large area produces a large volume.',
      material: 'topsoil',
      areas: [{ kind: 'rectangle', length: 4, width: 8 }],
      depthIn: 12,
      useCase: 'raised-bed',
      compare: [6, 12, 18],
    }),
  ],
  faq: [
    {
      q: 'Is topsoil the same as garden soil?',
      a: 'Not usually. Topsoil is screened mineral soil; garden soil is normally a blend of topsoil with compost or other organic material, sold ready to plant into. Suppliers use the terms differently, so the honest answer is to ask what a specific product is made from rather than trusting the name.',
    },
    {
      q: 'Can I use compost instead of topsoil?',
      a: 'For filling a bed or a raised planter, compost alone is usually too rich and holds too much moisture; it is an amendment rather than a growing medium. For improving existing soil, compost is exactly the right product. Which one you want depends on whether you are building depth or improving what is already there.',
    },
    {
      q: 'How deep should topsoil be for a new lawn?',
      a: 'The planning range used here is 3–6 in, with 4 in as the default, and the right figure depends on the quality of what is underneath. If the existing soil is workable and drained, less added depth is needed. If it is compacted subsoil, the added layer has to do more of the work.',
    },
    {
      q: 'Why does the weight of topsoil vary so much?',
      a: 'Moisture and organic content. Water is heavy, and a saturated cubic yard of soil can weigh substantially more than a dry one, while the volume is unchanged. That is why the calculator shows a weight estimate using a typical density and labels it as an estimate rather than a guaranteed figure.',
    },
    {
      q: 'Should I put compost on top of the soil or mix it in?',
      a: 'For an existing bed, incorporating it into the top few inches does more than leaving it on the surface, while a thin surface layer is the standard approach for lawn top-dressing. For a new bed, mixing soil and compost before planting is the usual method. The calculator plans volumes; the method is a horticultural decision.',
    },
  ],
  sources: [
    {
      label: 'Penn State Extension — Using Composts to Improve Turf Performance',
      note: 'Published surface-application volumes per unit area for compost and soil top-dressing, useful as an independent check on thin applications.',
      url: 'https://extension.psu.edu/using-composts-to-improve-turf-performance',
    },
  ],
  limitations:
    'This page explains how soil products are described and planned, not what your soil needs. It does not test fertility, pH, structure, drainage or contamination, and it cannot tell you whether a particular supplier product is suitable for planting, for a lawn or for a raised bed used for food. Terminology varies by region and by supplier. Where a planting scheme depends on the outcome, obtain a soil test and agronomic advice rather than inferring quality from a product name.',
  related: [
    { href: '/calculators/topsoil-calculator', label: 'Topsoil Calculator', note: 'Presets for beds, raised beds, top-dressing and new lawn' },
    { href: '/calculators/soil-calculator', label: 'Soil Calculator', note: 'General soil and fill by area and depth' },
    { href: '/projects/how-much-topsoil-do-i-need', label: 'Project guide: how much topsoil do I need?' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/materials/mulch', label: 'Material guide: mulch' },
    { href: '/materials/sand', label: 'Material guide: sand', note: 'A different mineral product with different intended uses' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'topsoil-calculator',
  relatedCalculators: ['soil-calculator', 'mulch-calculator', 'sand-calculator'],
};
