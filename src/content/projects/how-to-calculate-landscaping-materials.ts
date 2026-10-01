import type { ContentPage } from '../types';
import { bulkExample, coverageTable, paverExample } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-calculate-landscaping-materials',
  path: '/projects/how-to-calculate-landscaping-materials',
  h1: 'How to calculate landscaping materials',
  metaTitle: 'How to Calculate Landscaping Materials: A Planning Workflow',
  metaDescription:
    'One measurement workflow for gravel, mulch, soil, sand, rock and paver base: measure once, convert per material, and build a single shopping list.',
  eyebrow: 'Landscaping planning pillar',
  crumb: 'How to calculate landscaping materials',
  lede:
    'Almost every landscaping material is planned with the same three numbers: an area, a depth, and a waste allowance. Learn that workflow once and it covers gravel, mulch, soil, topsoil, sand, decorative rock and paver base — only the depth guidance and the purchase unit change.',
  keyFacts: [
    { label: 'Core formula', value: 'Area × depth ÷ 12 = cubic feet' },
    { label: 'Ordering unit', value: 'Cubic feet ÷ 27 = cubic yards' },
    { label: 'Weight unit', value: 'Cubic yards × density = tons' },
    { label: 'What changes per material', value: 'Depth guidance and density' },
    { label: 'What stays constant', value: 'Measure, depth, waste, round up' },
    { label: 'Calculators', value: 'Eight material calculators share one engine' },
  ],
  sections: [
    {
      id: 'workflow',
      heading: 'The five-step workflow',
      blocks: [
        {
          kind: 'p',
          text: 'Do these steps once, in this order, and you can run every material in the project through the same process without re-measuring anything.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Sketch the project and split it into areas',
              body: 'Draw the outline on paper and divide it into shapes you can measure: rectangles, circles, triangles. Label each one with what it is for, such as "patio", "west bed" or "path".',
            },
            {
              title: 'Measure each area at the level the material will sit on',
              body: 'A paver base is measured on the excavated subgrade, not on the finished patio. Mulch is measured on soil, not on the bed outline. This one habit prevents most oversupply.',
            },
            {
              title: 'Decide the layers for each area',
              body: 'A patio is pavers over bedding sand over compacted base. A bed is soil, then mulch. A driveway is several aggregate layers. Write the depth next to each layer, not next to the area.',
            },
            {
              title: 'Convert each layer into a purchase quantity',
              body: 'Area × depth ÷ 12 for cubic feet, ÷ 27 for cubic yards, × density for tons. Apply compaction and waste per layer, because those differ between a compactable base and a loose decorative cover.',
            },
            {
              title: 'Round up and combine',
              body: 'Round each order to the increments your supplier sells in, then combine materials that come from the same source into one delivery where that saves money.',
            },
          ],
        },
        {
          kind: 'diagram',
          id: 'area-measure',
          caption:
            'Every material in a landscaping project follows the same path from an area and a depth to a purchase quantity.',
        },
      ],
    },
    {
      id: 'materials-map',
      heading: 'What changes between materials',
      blocks: [
        {
          kind: 'p',
          text: 'The arithmetic never changes. What changes is the depth guidance, the purchase unit and whether the material compacts. This table is the map: find the material, then use the calculator named in the last column with the numbers from your own measurements.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Landscaping materials and how each one is planned',
            head: ['Material', 'Role in a project', 'Planning depth', 'Sold as', 'Where it is calculated'],
            rows: [
              ['Gravel (crushed stone)', 'Surface cover, drainage layer, compactable base', '2–4 in loose cover, more for a base', 'Cubic yard or ton', 'Gravel Calculator'],
              ['Pea gravel', 'Decorative cover for paths and beds', '1–3 in', 'Bag, cubic yard or ton', 'Pea Gravel Calculator'],
              ['Mulch', 'Moisture retention, weed suppression, finish', '2–4 in, less on slow-draining soil', 'Cubic yard or bag', 'Mulch Calculator'],
              ['Topsoil', 'Adding or rebuilding the growing layer', '½ in for top-dressing, 4–8 in for beds', 'Cubic yard or bag', 'Topsoil Calculator'],
              ['General soil / fill', 'Raising levels, filling voids, bulk shaping', 'Set by the level you are filling to', 'Cubic yard or ton', 'Soil Calculator'],
              ['Sand', 'Paver bedding, leveling, play areas', '1–1.5 in as bedding, more for leveling', 'Bag, cubic yard or ton', 'Sand Calculator'],
              ['Landscape rock', 'Decorative cover that stays in place', '2–4 in, more with larger stone', 'Cubic yard or ton', 'Landscape Rock Calculator'],
              ['Paver base', 'Compactable structural layer under pavers', '4–8 in typical, more for vehicles', 'Cubic yard or ton', 'Paver Base Calculator'],
            ],
            note: 'Depths are planning guidance used by the calculators, not site-specific specifications.',
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Compaction is the one thing that does not carry over',
          text: 'A decorative cover and a compactable base at the same depth are not the same order, because the base loses thickness when it is worked. The paver base and driveway calculators include a compaction allowance; the loose-cover calculators do not.',
        },
      ],
    },
    {
      id: 'coverage',
      heading: 'Coverage: the number that makes quotes comparable',
      blocks: [
        {
          kind: 'p',
          text: 'Suppliers quote in whatever unit they prefer, which makes comparisons hard. Converting every quote to coverage per cubic yard at your planned depth puts them on the same footing, and it exposes the bag-versus-bulk question immediately.',
        },
        {
          kind: 'table',
          table: coverageTable(
            [1, 2, 3, 4],
            [2, 3],
            'Figures assume the depth is spread evenly. On an uneven bed, the thin spots consume the material first and the coverage figure becomes optimistic.',
          ),
        },
      ],
    },
    {
      id: 'examples',
      heading: 'Three worked examples from one project',
      blocks: [
        {
          kind: 'p',
          text: 'A single backyard project usually mixes materials. These three examples come from one plausible job — a paver patio, a planting bed and a gravel path — and each is calculated by the engine the calculators use.',
        },
        { kind: 'example', id: 'ls-patio' },
        { kind: 'example', id: 'ls-bed' },
        { kind: 'example', id: 'ls-path' },
      ],
    },
    {
      id: 'one-list',
      heading: 'Turning the results into one shopping list',
      blocks: [
        {
          kind: 'p',
          text: 'Once each layer has a quantity, the project has a shopping list rather than a set of separate answers. Project Mode on this site exists for that step: calculate each material, add the result to the project, and the combined quantities, assumptions, costs and shopping list are kept in one place in your browser.',
        },
        {
          kind: 'checklist',
          title: 'Building the list',
          items: [
            'One line per material per layer, with the depth written next to it',
            'The order unit your supplier actually sells in',
            'Which items can be combined into one delivery, and which cannot',
            'Delivery and site access notes, including where each load will be dropped',
            'Prices entered only from real quotes, so the running total means something',
            'A reminder of what still has to be measured or confirmed before ordering',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Keep the assumptions visible',
          text: 'A shopping list is only useful if you can see where each quantity came from. Every result on this site keeps its depth, waste allowance, density and compaction values attached, so a number can be explained later instead of guessed at.',
        },
      ],
    },
    {
      id: 'mistakes',
      heading: 'Mistakes that affect a whole project, not one page',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'Project-level planning mistakes',
            head: ['Mistake', 'Why it matters across materials', 'Fix'],
            rows: [
              ['Measuring each material separately', 'The same area gets measured three times, with three small errors', 'Measure once, then reuse the area in every calculator'],
              ['Planning materials before deciding layers', 'Depths get invented to fit a hoped-for quantity', 'Write the build-up first, then calculate'],
              ['Treating all bulk material as one delivery', 'A mixed load that cannot be separated causes site problems', 'Decide what can arrive together before ordering'],
              ['Ignoring the excavation or subgrade step', 'The base quantity is right but there is nowhere to put it', 'Plan what has to be removed and where it goes'],
              ['Buying the finish material first', 'Colour and texture get locked in before the budget is understood', 'Price the structural layers first; they are the expensive ones'],
            ],
          },
        },
      ],
    },
    {
      id: 'next',
      heading: 'Every material page in this workflow',
      blocks: [
        {
          kind: 'links',
          title: 'Material guides',
          items: [
            { href: '/materials/gravel', label: 'Gravel', note: 'Sizing, driveway and drainage uses, and how to plan quantities' },
            { href: '/materials/pea-gravel', label: 'Pea gravel', note: 'Rounding stone, shallow depths and why edging matters' },
            { href: '/materials/mulch', label: 'Mulch', note: 'Types, depth and how bags compare with bulk' },
            { href: '/materials/topsoil', label: 'Topsoil', note: 'Topsoil, garden soil and compost, and where terminology varies' },
            { href: '/materials/sand', label: 'Sand', note: 'Why different sand products have different intended uses' },
            { href: '/materials/paver-base', label: 'Paver base', note: 'Compaction, depth and purchasing' },
            { href: '/materials/concrete', label: 'Concrete', note: 'Ready-mix and bagged concrete for slabs, pads and post holes' },
            { href: '/materials/fence-materials', label: 'Fence materials', note: 'Planning characteristics of wood, vinyl, chain-link, composite and metal' },
            { href: '/materials/decking-materials', label: 'Decking materials', note: 'How common decking choices differ in planning terms' },
          ],
        },
        {
          kind: 'links',
          title: 'Calculators for each material',
          items: [
            { href: '/calculators/gravel-calculator', label: 'Gravel Calculator' },
            { href: '/calculators/pea-gravel-calculator', label: 'Pea Gravel Calculator' },
            { href: '/calculators/mulch-calculator', label: 'Mulch Calculator' },
            { href: '/calculators/topsoil-calculator', label: 'Topsoil Calculator' },
            { href: '/calculators/soil-calculator', label: 'Soil Calculator' },
            { href: '/calculators/sand-calculator', label: 'Sand Calculator' },
            { href: '/calculators/landscape-rock-calculator', label: 'Landscape Rock Calculator' },
            { href: '/calculators/paver-base-calculator', label: 'Paver Base Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    paverExample({
      id: 'ls-patio',
      title: 'A 12 ft × 20 ft paver patio, complete with base and bedding',
      scenario:
        'Six-inch square pavers on a 6 in compacted base with 1 in of bedding sand, using the calculator defaults and a 10% waste allowance.',
      conclusion:
        'Notice how much of this result is not pavers. The base material, the bedding sand and the edge restraint are all separate purchases that a paver-only estimate would miss, and the base is often the largest single volume on a patio job.',
      areas: [{ kind: 'rectangle', length: 12, width: 20 }],
      paverLengthIn: 6,
      paverWidthIn: 6,
    }),
    bulkExample({
      id: 'ls-bed',
      title: 'Mulching a 6 ft × 10 ft bed from the same project',
      scenario:
        'The planting bed beside the patio receives 3 in of mulch, calculated with the garden-bed preset.',
      conclusion:
        'A bed this size is where bagged material is still defensible, which is why the coverage table matters: it turns an abstract volume into the number of bags someone would actually carry.',
      material: 'mulch',
      areas: [{ kind: 'rectangle', length: 6, width: 10 }],
      depthIn: 3,
      useCase: 'garden-bed',
      compare: [2, 3, 4],
    }),
    bulkExample({
      id: 'ls-path',
      title: 'Gravel for a 30 ft path leading to the patio',
      scenario:
        'A 3 ft wide path is finished with 3 in of gravel over a prepared base, measured as a single rectangle.',
      conclusion:
        'The path is small enough that the delivery, not the material, is the real cost of the job. That is the kind of conclusion a single shopping list makes visible, and it is the reason to calculate every material before ordering any of them.',
      material: 'gravel',
      areas: [{ kind: 'rectangle', length: 3, width: 30 }],
      depthIn: 3,
      useCase: 'walkway',
    }),
  ],
  faq: [
    {
      q: 'Can I use one calculator for every material?',
      a: 'The arithmetic is shared, but each calculator carries the right depth guidance, default density and compaction behaviour for its material. Using the gravel calculator for paver base would ignore compaction; using the topsoil calculator for sand would use the wrong density. Pick the calculator that matches the material.',
    },
    {
      q: 'How accurate can a landscaping material estimate be?',
      a: 'The measurement and conversion can be exact. What limits accuracy is the ground: uneven subgrade, spoil that has to be replaced deeper than expected, and the difference between a supplier density figure and the load that actually arrives. A 10% waste allowance and rounding up to the supplier increment absorbs most of that.',
    },
    {
      q: 'Should I order everything at once?',
      a: 'Only the materials that will not be damaged by waiting, and only if one load can be placed where each material is needed. Aggregates and soil store well in a dry pile; bagged products, edging and hardware usually do too. What does not work is one mixed delivery that has to be hand-sorted on the driveway.',
    },
    {
      q: 'Does measuring in metres work?',
      a: 'The calculators take feet and inches in the interface. If you have metric dimensions, convert them once — 1 m is about 3.28 ft — and carry the converted figure through. The results also show square metres and cubic metres alongside the imperial units.',
    },
  ],
  limitations:
    'This page organises the planning process; it does not replace a design. It cannot tell you what a subgrade needs, how much excavation a patio requires, what your local rules say about drainage or impervious cover, or how a build-up should be detailed. Quantities describe material; they do not describe an adequate or compliant construction. Confirm site-specific requirements with a qualified professional.',
  related: [
    { href: '/projects/how-much-gravel-do-i-need', label: 'Project guide: how much gravel do I need?' },
    { href: '/projects/how-to-calculate-mulch', label: 'Project guide: how to calculate mulch' },
    { href: '/projects/how-much-topsoil-do-i-need', label: 'Project guide: how much topsoil do I need?' },
    { href: '/projects/how-to-plan-a-paver-patio', label: 'Project guide: how to plan a paver patio' },
    { href: '/projects/outdoor-project-cost-planning', label: 'Project guide: outdoor project cost planning' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/projects', label: 'Project Mode: combine results into one plan' },
    { href: '/calculators', label: 'All calculators' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'gravel-calculator',
  relatedCalculators: ['mulch-calculator', 'topsoil-calculator', 'paver-base-calculator'],
};
