import type { ContentPage } from '../types';
import { bulkExample, coverageTable, depthRangeTable } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-calculate-mulch',
  path: '/projects/how-to-calculate-mulch',
  h1: 'How to calculate mulch',
  metaTitle: 'How to Calculate Mulch: Beds, Depth, Bags and Bulk',
  metaDescription:
    'Calculate mulch from bed measurements and depth: convert to cubic yards or bags, see how far a bag really covers, allow for settling, and plan a bulk delivery.',
  eyebrow: 'Mulch project guide',
  crumb: 'How to calculate mulch',
  lede:
    'Mulch is calculated exactly like any other bulk material: bed area × depth ÷ 12 gives cubic feet, and cubic feet ÷ 27 gives cubic yards. What makes mulch different is that the depth range is narrow, the bag sizes are misleadingly small, and the material settles after it is spread. This guide covers all three.',
  keyFacts: [
    { label: 'Typical depth', value: '2–4 in, less over fine or wet soil' },
    { label: 'Measure at', value: 'Soil level, inside the bed edge' },
    { label: 'Bag sizes', value: 'Commonly 2 cu ft and 3 cu ft' },
    { label: 'Bulk unit', value: 'Cubic yard, often delivered loose' },
    { label: 'Settling', value: 'Plan for the layer to lose height as it knits' },
    { label: 'Calculator', value: 'Mulch Calculator' },
  ],
  sections: [
    {
      id: 'why-different',
      heading: 'Why mulch is not just another bulk material',
      blocks: [
        {
          kind: 'p',
          text: 'Mulch is one of the few landscaping materials where the depth is set by the plants rather than by the load or the drainage. Too thin and it does not suppress weeds or hold moisture. Too thick and it holds water against stems and trunks, which is the opposite of what most planting schemes need.',
        },
        {
          kind: 'p',
          text: 'That narrow band is useful, because it means the calculation rarely has to guess at depth. The hard part is the measurement — beds are irregular, they wrap around shrubs, and the mulch has to stay clear of stems — and the arithmetic that turns an area into bags.',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Mulch is sold by volume, not weight',
          text: 'Cubic yards and cubic feet are the numbers that matter. Weight only becomes relevant if you are comparing a bagged product that is sold by weight, or if you need to know what a load will do to a driveway.',
        },
      ],
    },
    {
      id: 'measure-beds',
      heading: 'Measure the bed the way it will be planted',
      blocks: [
        {
          kind: 'p',
          text: 'A bed is rarely a rectangle, and the area you mulch is the area between the plants and the edge, not the whole bed outline. Walking the outline with a tape measure and breaking it into rectangles, curves and triangles gives a better number than a single rough guess.',
        },
        {
          kind: 'diagram',
          id: 'mulch-depth',
          caption:
            'Mulch depth is measured after it settles. The gap around the stem is part of the plan, not an accident of spreading.',
        },
        {
          kind: 'ul',
          items: [
            'Measure the open bed area, then subtract obvious obstacles such as large shrub crowns or a permanent path through the middle.',
            'For a curved bed, measure the widest and narrowest width and average them, then measure the length along the middle of the bed rather than along the property line.',
            'Tree rings are circles: measure the diameter at the outer edge of the ring you want, then enter a circle instead of a rectangle.',
            'Round up to the nearest half foot. Mulch is ordered to the quarter cubic yard, so further precision adds nothing.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Do not mulch into the trunk',
          text: 'Keep mulch off stems and trunks so the root flare stays visible. This is a planting decision, not a calculation one, but it changes the area you are covering because the material stops short of the plant.',
        },
      ],
    },
    {
      id: 'depth',
      heading: 'Pick a depth inside a defensible range',
      blocks: [
        {
          kind: 'p',
          text: 'The calculator carries planning ranges for beds and tree rings and warns you when a number sits outside them. Two factors move you toward the thinner end of the range: soil that drains slowly, and finely textured mulch that packs down and holds moisture. Two factors move you toward the thicker end: coarse mulch that matures quickly and beds with a heavy weed seed bank.',
        },
        { kind: 'table', table: depthRangeTable('mulch') },
        {
          kind: 'callout',
          tone: 'info',
          title: 'A useful independent check',
          text: 'Penn State Extension frames the same guidance in practical terms: mulch out, not up, generally 2–4 in and no deeper than the heel of your hand, with less used on poorly drained soil or with finely textured mulch. The calculator defaults sit inside that range.',
        },
      ],
    },
    {
      id: 'bags-and-bulk',
      heading: 'Bags, bulk and how far each one actually goes',
      blocks: [
        {
          kind: 'p',
          text: 'Bagged mulch is sold in 2 cu ft and 3 cu ft bags, and a cubic yard is 27 cu ft. One cubic yard is therefore worth roughly nine 3 cu ft bags or thirteen and a half 2 cu ft bags — a comparison most shoppers never make before picking up a trolley. The table below converts both units into coverage at the depths mulch is normally spread.',
        },
        {
          kind: 'table',
          table: coverageTable(
            [2, 3, 4],
            [2, 3],
            'Read this table beside your own bed area: the useful question is how many bags a single bed would consume, not how far a bag goes in theory.',
          ),
        },
        {
          kind: 'p',
          text: 'The practical consequence is simple. One 3 cu ft bag covers a bed smaller than a small car at 3 in deep. Any real planting bed runs into bags by the dozen, which is why bulk delivery usually wins on convenience once the volume passes about half a cubic yard.',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Compressed bags are not the same as loose bags',
          text: 'Some products are compressed for shipping and expand after opening. The fill volume printed on the bag is the number to use, but check whether the label describes the compressed or the expanded volume before multiplying it by your bag count.',
        },
      ],
    },
    {
      id: 'worked-example',
      heading: 'Worked example: a 12 ft × 18 ft planting bed',
      blocks: [
        {
          kind: 'p',
          text: 'The example below runs the real calculator on a common bed size. The depth comparison is the part worth studying: the same bed at 2 in, 3 in and 4 in are three different orders, and that gap is often the difference between one delivery and two.',
        },
        { kind: 'example', id: 'mulch-bed' },
      ],
    },
    {
      id: 'settling',
      heading: 'Settling, waste and why a tidy order still runs short',
      blocks: [
        {
          kind: 'p',
          text: 'Fresh mulch is fluffy. It loses height within weeks as it knits together and the particles settle, and it keeps losing height over a season as the lower layer breaks down into the soil. The depth you calculate is the depth you spread, not the depth you will see in a month.',
        },
        {
          kind: 'ul',
          items: [
            'The 10% default waste allowance covers material that ends up on a wheelbarrow route, on an edge, or spread unevenly.',
            'Beds with many individual plants to work around need more waste than open beds, because a trowel and a gloved hand scatter more than a rake does.',
            'A bed being mulched for the first time usually needs a full-depth application; top-up beds need less, but raking the old layer first tells you how much is really there.',
            'Do not add depth to make the bed look finished. A layer that looks slightly thin for a week is better than a layer that is still too thick next spring.',
          ],
        },
      ],
    },
    {
      id: 'mistakes',
      heading: 'Mistakes that cost a second trip',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'Common mulch calculation mistakes',
            head: ['Mistake', 'Result', 'Better approach'],
            rows: [
              ['Measuring to the lawn edge rather than the soil edge', 'Oversupply of a bed that already has a mulch layer', 'Measure the open soil area inside the edging'],
              ['Adding full depth to a bed that is already mulched', 'A layer deep enough to bury crowns and hold water against stems', 'Account for the existing layer, or rake it before deciding'],
              ['Comparing bags by count rather than by volume', 'A misleadingly cheap comparison between 2 cu ft and 3 cu ft bags', 'Compare price per cubic foot, or price per cubic yard for bulk'],
              ['Using one depth for beds and tree rings', 'Thin cover in the beds, heavy rings around trunks', 'Calculate each shape with its own depth'],
              ['Ignoring where the pile will land', 'Mulch dropped on a lawn that then has to be moved in the rain', 'Choose the drop point before the delivery arrives'],
            ],
          },
        },
      ],
    },
    {
      id: 'plan',
      heading: 'A short ordering checklist',
      blocks: [
        {
          kind: 'checklist',
          title: 'Before you order mulch',
          items: [
            'Total area of every bed and tree ring, measured at soil level',
            'Chosen depth per bed, with a reason if it sits outside the 2–4 in range',
            'Order quantity in cubic yards, plus a bag count for areas too small for a bulk delivery',
            'A decision on colour and texture settled before the delivery, not after',
            'A drop point that does not block the route you will carry material along',
            'Edging or fabric if the bed is being refurbished at the same time',
          ],
        },
        {
          kind: 'p',
          text: 'Ordering mulch is the last step, not the first. Weeding, edging and any soil work are easier on bare ground, and doing them after the delivery means moving the pile twice.',
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
            { href: '/materials/mulch', label: 'Mulch: types, depth and coverage', note: 'How bark, wood and other mulch products differ in planning terms' },
            { href: '/costs/mulch-cost', label: 'Bagged versus bulk mulch pricing', note: 'What actually moves the number once the volume is known' },
            { href: '/projects/how-much-topsoil-do-i-need', label: 'How much topsoil do I need?', note: 'For beds that need soil before they need mulch' },
            { href: '/calculators/mulch-calculator', label: 'Open the Mulch Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'mulch-bed',
      title: 'Mulching a 12 ft × 18 ft bed at three inches',
      scenario:
        'A single rectangular bed is mulched for the first time at 3 in deep, using the calculator default 10% waste allowance and the garden-bed depth preset.',
      conclusion:
        'The depth table is the decision-maker. The same bed at 2 in is comfortably a bagged purchase, while 3 in and 4 in push the job toward bulk delivery. That is the honest reading of the result: the depth you choose, not the size of the bed, decides how the material gets bought.',
      material: 'mulch',
      areas: [{ kind: 'rectangle', length: 12, width: 18 }],
      depthIn: 3,
      useCase: 'garden-bed',
      compare: [2, 3, 4],
    }),
  ],
  faq: [
    {
      q: 'How many bags of mulch are in a cubic yard?',
      a: 'A cubic yard is 27 cu ft, so it is about nine 3 cu ft bags or about thirteen and a half 2 cu ft bags. Bag sizes printed on the product are fill volumes, so divide 27 by your bag size before comparing a bulk quote with a bag count.',
    },
    {
      q: 'Should I add extra mulch for settling?',
      a: 'The 10% waste allowance is a reasonable starting point, and many beds are topped up annually anyway. If you want the bed to look full for longer, the honest move is to choose a slightly thicker planned depth rather than add an unexplained allowance on top of it.',
    },
    {
      q: 'Can I use the mulch calculator for a tree ring?',
      a: 'Yes. Enter a circle with the diameter of the ring you want. Keep the mulch clear of the trunk so the root flare stays visible, and use the thinner end of the 2–4 in range if the soil drains slowly.',
    },
    {
      q: 'Does mulch weight matter when ordering?',
      a: 'Rarely, because mulch is normally sold by volume. It matters if you are comparing a weight-priced bagged product, or if you need to know whether a delivery can sit on a driveway without marking it. The calculator shows an estimated weight using a typical density and labels it as an estimate.',
    },
  ],
  sources: [
    {
      label: 'Penn State Extension — Mulching Landscape Trees',
      note: 'Independent practical guidance on mulch depth and keeping mulch clear of the trunk.',
      url: 'https://extension.psu.edu/mulching-landscape-trees',
    },
  ],
  limitations:
    'The calculator converts an area and a depth into volume, bags and an estimated weight. It does not evaluate your soil, your plants or your drainage, and it does not decide how deep a mulch layer should be for a particular species. Density is a planning value, so a weight estimate can differ from a real delivery load. For demanding plantings, confirm depth with a horticultural or landscape professional.',
  related: [
    { href: '/calculators/mulch-calculator', label: 'Mulch Calculator', note: 'Compare depths and bag sizes using your own measurements' },
    { href: '/materials/mulch', label: 'Material guide: mulch' },
    { href: '/costs/mulch-cost', label: 'Cost guide: bagged versus bulk mulch' },
    { href: '/projects/how-much-gravel-do-i-need', label: 'Project guide: how much gravel do I need?' },
    { href: '/projects/how-much-topsoil-do-i-need', label: 'Project guide: how much topsoil do I need?' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'mulch-calculator',
  relatedCalculators: ['topsoil-calculator', 'soil-calculator', 'landscape-rock-calculator'],
};
