import type { ContentPage } from '../types';
import { bulkExample, coverageTable, depthRangeTable, materialAssumptionTable } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'sand',
  path: '/materials/sand',
  h1: 'Sand: common outdoor uses and how to plan a quantity',
  metaTitle: 'Sand Guide: Bedding, Leveling and Landscaping Uses',
  metaDescription:
    'Why sand products are not interchangeable, what bedding, leveling, masonry and landscaping uses each need, and how to plan the quantity.',
  eyebrow: 'Material reference',
  crumb: 'Sand',
  lede:
    'Sand is sold under many names, and they are not the same product. Bedding sand for pavers, leveling sand, masonry sand and play sand have different gradings and different intended uses. Choosing the right one is a supplier conversation; planning the quantity is arithmetic.',
  keyFacts: [
    { label: 'Bedding depth', value: '1–1.5 in, screeded' },
    { label: 'Leveling depth', value: '1–4 in depending on how uneven the ground is' },
    { label: 'Sold as', value: '0.5 cu ft bags, cubic yards or tons' },
    { label: 'Planning density', value: 'About 1.35 tons per cubic yard' },
    { label: 'Wet versus dry', value: 'Wet sand is noticeably heavier' },
    { label: 'Calculator', value: 'Sand Calculator' },
  ],
  sections: [
    {
      id: 'not-interchangeable',
      heading: 'Sand products are not interchangeable',
      blocks: [
        {
          kind: 'p',
          text: 'The word “sand” describes a particle size range rather than a product. What differs between the bags and piles at a supplier is the grading — the spread of particle sizes — and sometimes the shape of the grains and how washed the material is. Those differences decide what a sand is suitable for, and using the wrong one is a common reason a surface moves or a joint fails to fill.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Common sand products by intended application',
            head: ['Application', 'What is usually specified', 'Why the choice matters'],
            rows: [
              ['Paver bedding', 'A screeding sand intended for bedding, with a consistent grading', 'The bedding layer has to compact to a level surface and let pavers be set to a consistent height'],
              ['Joint sand', 'A finer sand intended to be swept into joints', 'Joint filling depends on particles small enough to enter the joint and settle'],
              ['Leveling', 'General purpose sand for filling low spots and bedding slabs', 'Working to a level requires sand that does not shift once placed'],
              ['Masonry and mortar work', 'Sand graded for use in mortar mixes', 'Mortar behaviour depends on the sand grading as much as on the cement'],
              ['Landscaping and play areas', 'Washed sand, and specifically sand labelled for play where children use it', 'Washing removes fines and dust; play sand is also screened for larger debris'],
            ],
            note: 'Regional names vary widely for the same product. Describe the application rather than asking for “sand”.',
          },
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Do not substitute one sand for another',
          text: 'A bag of the wrong sand can be the difference between a bedding layer that screeds level and one that will not hold a profile. If you are unsure, tell the supplier what you are doing and ask what they recommend for it.',
        },
      ],
    },
    {
      id: 'applications',
      heading: 'Where sand is used in outdoor projects',
      blocks: [
        {
          kind: 'p',
          text: 'Sand appears in more places than people expect, usually as a thin layer rather than as a structural material. That is why its quantities are small relative to the aggregate beneath it, and why volume planning is quick.',
        },
        { kind: 'table', table: depthRangeTable('sand') },
        {
          kind: 'ul',
          items: [
            'Under pavers, as the bedding layer that lets the units be set level. It is not a substitute for a compacted base.',
            'Swept into joints after laying, where it fills the gaps between units.',
            'For leveling: thin lifts used to true up an area before a finished surface goes on.',
            'Around play equipment or in a sandbox, where the product needs to be labelled for that use.',
            'In masonry work, as a constituent of mortar or concrete mixes, where the grading is part of the mix design.',
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
          text: 'Sand quantities are small compared with the aggregate around them, because the layers are thin. That makes planning simple and also makes it easy to dismiss: a bedding layer that is under-ordered is a project that stops halfway, and a bagged top-up at that point costs more than the bulk delivery would have.',
        },
        {
          kind: 'table',
          table: coverageTable(
            [1, 2, 3],
            [0.5],
            'Sand is sold by volume but moved by weight, so the coverage figures above are about the layer rather than about how much one person can carry.',
          ),
        },
        { kind: 'table', table: materialAssumptionTable('sand') },
        { kind: 'example', id: 'sand-bedding-example' },
      ],
    },
    {
      id: 'weight',
      heading: 'Weight, moisture and handling',
      blocks: [
        {
          kind: 'p',
          text: 'Sand is heavy, and wet sand is heavier than dry sand for the same volume. That matters in three places: the number of barrow loads you are willing to move, whether a delivery vehicle can stand on the surface it is delivering to, and how a tonnage quote compares with a volume quote.',
        },
        {
          kind: 'ul',
          items: [
            'A cubic yard of sand is in the region of 1.35 tons in this planner, but saturated sand can be considerably heavier.',
            'Barrow loads are limited by weight as much as by volume, so a large sand order is more work than the volume suggests.',
            'If you are ordering by the ton, ask what density the supplier is pricing with, and compare it against the calculator figure.',
            'Bagged sand is convenient for small areas and repairs; the per-unit cost rises steeply once a project passes a few barrows.',
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
            'Describe the job, not the material, when ordering: “bedding sand for pavers” is more useful than “sand”.',
            'Keep sand covered before use. A pile that has been rained on is heavier and harder to screed.',
            'Washed sand is not necessarily the right sand for bedding. Washing removes fines, which changes how the material behaves.',
            'For a sandbox, use a product labelled for play. That is a label about the material and how it is screened, and it is not inferred from appearance.',
            'Sand used in mortar or concrete is part of a mix design. Do not substitute it without checking against the specification you are working to.',
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
            { href: '/projects/how-to-calculate-paver-materials', label: 'How to calculate paver materials', note: 'Bedding sand as one line of a complete paver take-off' },
            { href: '/materials/paver-base', label: 'Paver base', note: 'The compactable layer that sand cannot replace' },
            { href: '/costs/paver-patio-cost', label: 'What drives paver patio cost' },
            { href: '/calculators/sand-calculator', label: 'Open the Sand Calculator' },
            { href: '/calculators/paver-base-calculator', label: 'Open the Paver Base Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'sand-bedding-example',
      title: 'Bedding sand for a 12 ft × 20 ft patio',
      scenario:
        'A 240 sq ft patio area with a 1 in bedding sand layer, using the paver-bedding preset and the default 10% waste allowance.',
      conclusion:
        'The volume is small, which is the point worth taking from this example: bedding sand is a thin layer, and it is the base beneath it that carries the volume. Note also that the weight is still substantial for a layer an inch thick, which is why a sand order is a lifting exercise even when the cubic yardage looks modest.',
      material: 'sand',
      areas: [{ kind: 'rectangle', length: 12, width: 20 }],
      depthIn: 1,
      useCase: 'paver-bedding',
      compare: [1, 1.5, 2],
    }),
  ],
  faq: [
    {
      q: 'What kind of sand goes under pavers?',
      a: 'A bedding sand intended for that purpose, typically with a consistent grading so it can be screeded to a level layer and will hold a profile while pavers are set on it. The exact product name varies by region, so describe the application to your supplier rather than asking for sand in general.',
    },
    {
      q: 'How much sand do I need for paver joints?',
      a: 'Joint filling uses less material than the bedding layer, and the amount depends on joint width, paver thickness and how much is swept in and compacted. Many suppliers quote joint sand by coverage of the paved area rather than by the joint volume, which is why the calculator concentrates on the bedding layer it can compute from your area and depth.',
    },
    {
      q: 'Is play sand the same as builder’s sand?',
      a: 'Not necessarily. Sand sold for play is screened and washed differently, and the label is the point: buy sand that is labelled for that use. Do not assume any clean-looking sand is appropriate for a sandbox, and do not use sand that carries dust or debris.',
    },
    {
      q: 'Can I use sand to level a lawn or fill a low spot?',
      a: 'Sand alone is a poor growing medium and can make a low spot worse by creating a layer that roots struggle to cross. For leveling under a hard surface, sand is the right material; for leveling a lawn, a soil or sand-and-soil blend is usually the better answer. That is a horticultural question rather than a quantity one.',
    },
    {
      q: 'Why does the calculator ask for a density?',
      a: 'Because sand is sometimes bought by weight and sometimes by volume, and moisture changes the weight of a cubic yard. The calculator uses a typical density to produce an estimate and lets you override it with the figure your supplier prices with.',
    },
  ],
  limitations:
    'This page explains how sand products are used and planned. It does not specify gradings, does not determine whether a sand is suitable for a particular bedding, jointing, mortar or play application, and does not make any structural or safety claim about any use. Mortar and concrete mixes are designed specifications rather than material choices. Confirm product suitability with your supplier and, where a mix or a load-bearing detail is involved, with the design professional responsible for it.',
  related: [
    { href: '/calculators/sand-calculator', label: 'Sand Calculator', note: 'Coverage, cubic yards, tons and bags from your own area' },
    { href: '/materials/paver-base', label: 'Material guide: paver base' },
    { href: '/materials/topsoil', label: 'Material guide: topsoil and garden soil' },
    { href: '/projects/how-to-calculate-paver-materials', label: 'Project guide: how to calculate paver materials' },
    { href: '/costs/paver-patio-cost', label: 'Cost guide: paver patio cost' },
    { href: '/calculators/paver-calculator', label: 'Paver Calculator', note: 'Bedding sand as part of a complete paver take-off' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'sand-calculator',
  relatedCalculators: ['paver-base-calculator', 'paver-calculator', 'topsoil-calculator'],
};
