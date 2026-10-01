import type { ContentPage } from '../types';
import { bulkExample, bulkVolumeCuYd, depthRangeTable, materialAssumptionTable, num } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-much-topsoil-do-i-need',
  path: '/projects/how-much-topsoil-do-i-need',
  h1: 'How much topsoil do I need?',
  metaTitle: 'How Much Topsoil Do I Need? Lawn, Beds and Raised Beds',
  metaDescription:
    'Calculate topsoil for lawn top-dressing, garden beds, new lawns and raised beds. Convert area and depth into cubic yards or bags, with worked examples for each use.',
  eyebrow: 'Topsoil project guide',
  crumb: 'How much topsoil do I need?',
  lede:
    'Topsoil is calculated from the area you are covering and the depth you are adding: area × depth ÷ 12 gives cubic feet, and ÷ 27 gives cubic yards. The work is in choosing the depth, because top-dressing a lawn, filling a raised bed and topping up a planting bed use three completely different numbers.',
  keyFacts: [
    { label: 'Lawn top-dressing', value: 'Around ¼–½ in at a time' },
    { label: 'Planting beds', value: 'Commonly 4–8 in of added soil' },
    { label: 'Raised beds', value: 'Fill depth measured inside the bed' },
    { label: 'Bulk unit', value: 'Cubic yard, usually screened' },
    { label: 'Bag sizes', value: 'Commonly 0.75, 1 and 1.5 cu ft' },
    { label: 'Calculator', value: 'Topsoil Calculator' },
  ],
  sections: [
    {
      id: 'what-topsoil-is',
      heading: 'Topsoil, garden soil and compost are not interchangeable',
      blocks: [
        {
          kind: 'p',
          text: 'Suppliers use these words differently, and the difference changes both the depth you plan and the price you pay. As a working distinction: topsoil is mineral soil, usually screened, sold to add or rebuild the growing layer; garden soil or planting mix is normally a topsoil and compost blend intended to be planted straight into; compost is decomposed organic matter, used as an amendment rather than as a growing medium on its own.',
        },
        {
          kind: 'p',
          text: 'Because the words travel loosely, the label matters more than the name. A product sold as garden soil may already contain enough organic matter that adding more compost would be wrong, and a cheap topsoil may be mostly subsoil with little organic content. Ask what the product is screened to and what it is blended from before deciding a depth.',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'A volume calculator cannot see quality',
          text: 'This calculator answers "how much volume". It cannot tell you whether a screened topsoil is suitable for a lawn, whether it drains, or whether it carries weed seed. Those are supplier and site questions.',
        },
      ],
    },
    {
      id: 'use-cases',
      heading: 'Depths by use: the number that actually matters',
      blocks: [
        {
          kind: 'p',
          text: 'Topsoil depth is where projects go wrong. Half an inch spread over an established lawn is a soil amendment; half an inch in a raised bed is not enough to grow anything. The calculator carries a preset for each of the common uses and warns you when your depth sits outside its planning range.',
        },
        { kind: 'table', table: depthRangeTable('topsoil') },
        {
          kind: 'ul',
          items: [
            'Lawn top-dressing is deliberately thin. Spreading too deep smothers the grass you are trying to help.',
            'A planting bed is usually improved rather than replaced, so the added depth is measured on top of what is already there.',
            'A raised bed is filled to a depth, so the number you want is the inside height you intend to fill, not the height of the boards.',
            'A new lawn on poor subsoil needs the most material of the four, and the depth depends on how much existing soil is worth keeping.',
          ],
        },
      ],
    },
    {
      id: 'raised-beds',
      heading: 'Filling a raised bed without overshooting',
      blocks: [
        {
          kind: 'p',
          text: 'A raised bed is the easiest topsoil project to calculate accurately, because the container defines the volume for you. Measure the inside dimensions and the fill height, and remember that soil settles: most beds are filled slightly proud and then topped up after a few weeks of watering.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Inside dimensions matter more than outside dimensions',
            head: ['What people measure', 'Why it is wrong', 'What to measure instead'],
            rows: [
              ['Outside length and width', 'Includes the wall thickness, which is dead space', 'Inside the boards, corner to corner'],
              ['Full board height', 'Leaves a lip and ignores settling', 'The fill depth you actually want'],
              ['One bed at a time', 'Misses the option of a single bulk delivery for all beds', 'Measure every bed, then add them as separate areas in one calculation'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Bulk delivery is usually the deciding factor',
          text: 'Raised beds are small individually, but several of them together cross the point where bagged soil stops making sense. Adding all beds as separate areas in the same calculation gives one order quantity and one delivery.',
        },
      ],
    },
    {
      id: 'examples',
      heading: 'Worked examples for the three common jobs',
      blocks: [
        {
          kind: 'p',
          text: 'Each example below is calculated by the same engine the calculator uses, so you can reproduce it exactly by entering the same figures yourself.',
        },
        { kind: 'example', id: 'topsoil-bed' },
        { kind: 'example', id: 'topsoil-raised' },
        { kind: 'example', id: 'topsoil-lawn' },
      ],
    },
    {
      id: 'cross-check',
      heading: 'Cross-checking thin lawn applications against published guidance',
      blocks: [
        {
          kind: 'p',
          text: 'Lawn top-dressing is the one topsoil job where an independent published figure is easy to find, so it is worth checking the calculator against it. Penn State Extension publishes a table of compost volumes per unit area for surface applications from one quarter inch up to two inches. The engine output below uses the same area and depths with the waste allowance set to zero, which is the basis a published table uses.',
        },
        {
          kind: 'table',
          table: {
            caption: '10,000 sq ft of lawn: engine output compared with a published extension table',
            head: ['Depth applied', 'Engine volume', 'Engine volume (cu yd)', 'Published table (cu yd)'],
            rows: [0.25, 0.5, 1, 1.5, 2].map((depthIn) => {
              const cuYd = bulkVolumeCuYd('topsoil', 10000, depthIn, 0);
              const published: Record<string, string> = { '0.25': '8', '0.5': '15', '1': '31', '1.5': '46', '2': '62' };
              return [`${num(depthIn)} in`, `${num(cuYd * 27)} cu ft`, num(cuYd), published[String(depthIn)]];
            }),
            note: 'The published table rounds to whole cubic yards, which is why the two columns differ in the decimals but agree on the number you would order.',
          },
        },
        {
          kind: 'p',
          text: 'The columns agree at every depth. That is a useful confirmation that the calculator uses the same arithmetic a land-grant extension service publishes. What a published table cannot tell you is what your own soil needs, which is why the depth setting stays in your hands.',
        },
      ],
    },
    {
      id: 'bags-and-waste',
      heading: 'Bags, bulk and how much waste to allow',
      blocks: [
        {
          kind: 'p',
          text: 'Topsoil is usually ordered screened, by the cubic yard, and delivered loose. Bags are common for small repairs and for bagged blends. Because the material is usually spread by hand and raked to a grade, it deserves a slightly more generous waste allowance than a machine-spread aggregate.',
        },
        { kind: 'table', table: materialAssumptionTable('topsoil') },
        {
          kind: 'ul',
          items: [
            'Waste covers soil that sinks into the existing surface, spills from a barrow, or is lost in a long carry from the drop point.',
            'Soil settles when it is watered, so a layer spread to exactly the target depth will be thinner a month later.',
            'The weight of a cubic yard depends heavily on moisture. Wet soil can weigh considerably more than dry, which affects how much a barrow holds and how far a truck can safely go.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Topsoil is not a structural base',
          text: 'Do not use this calculator to plan a base under pavers, a driveway or a structure. Those need compactable aggregate and a site-appropriate design, which is a different material and a different decision.',
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
            { href: '/materials/topsoil', label: 'Topsoil, garden soil and compost compared', note: 'What the words mean and where suppliers differ' },
            { href: '/costs/landscaping-project-cost', label: 'What drives landscaping project cost', note: 'Material, delivery, labour and site preparation' },
            { href: '/projects/how-to-calculate-mulch', label: 'How to calculate mulch', note: 'The layer that often goes on top of new soil' },
            { href: '/calculators/topsoil-calculator', label: 'Open the Topsoil Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'topsoil-bed',
      title: 'Topping up a 10 ft × 20 ft planting bed by six inches',
      scenario:
        'An existing planting bed is built up with 6 in of screened topsoil before replanting, using the calculator default 10% waste allowance.',
      conclusion:
        'Six inches over this area is a serious amount of material, and the bag rows show why bagged soil rarely suits bed building. The result is a small bulk delivery, which is where the cost conversation starts rather than where it ends.',
      material: 'topsoil',
      areas: [{ kind: 'rectangle', length: 10, width: 20 }],
      depthIn: 6,
      useCase: 'garden-bed',
    }),
    bulkExample({
      id: 'topsoil-raised',
      title: 'Filling a 4 ft × 8 ft raised bed to twelve inches',
      scenario:
        'One raised bed is filled to 12 in of depth using its inside dimensions, with the raised-bed preset selected in the calculator.',
      conclusion:
        'This is the calculation that proves the point about measuring inside dimensions. Fill depth, not board height, drives the number, and a single bed of this size still lands in the range where bags and bulk compete closely.',
      material: 'topsoil',
      areas: [{ kind: 'rectangle', length: 4, width: 8 }],
      depthIn: 12,
      useCase: 'raised-bed',
    }),
    bulkExample({
      id: 'topsoil-lawn',
      title: 'Top-dressing a 2,000 sq ft lawn at half an inch',
      scenario:
        'An established lawn is top-dressed at ½ in over 2,000 sq ft, entered as a measured area with the lawn top-dressing preset selected.',
      conclusion:
        'Thin applications are the opposite problem: the volume is small enough that bagged material is genuinely practical, and the bag rows confirm it. Together with the cross-check table above, this result shows why depth, not area, is the variable that decides how topsoil gets bought.',
      material: 'topsoil',
      areas: [{ kind: 'area', sqFt: 2000 }],
      depthIn: 0.5,
      useCase: 'lawn-topdressing',
      compare: [0.25, 0.5, 1],
    }),
  ],
  faq: [
    {
      q: 'How much topsoil do I need for a new lawn?',
      a: 'It depends on what is already there. If the existing soil is workable and reasonably drained, a few inches of blended material tilled in is often enough. If the subsoil is compacted, stony or poor, the added depth has to be larger. The calculator shows 3–6 in as a planning range for new lawn, with 4 in as the default, and lets you enter your own depth.',
    },
    {
      q: 'How deep should topsoil be over existing soil?',
      a: 'For planting beds, 4–8 in of added topsoil is the common planning band, and the right answer depends on how deep the roots you are planting will go. For a lawn top-dressing the number is far smaller: a quarter to half an inch at a time, repeated if needed rather than applied all at once.',
    },
    {
      q: 'Can I use topsoil for a raised bed?',
      a: 'Topsoil is usually the base component, and it is common to blend it with compost so the bed holds moisture and drains well. Suppliers sell pre-blended raised-bed mixes for exactly this reason. Use the inside dimensions of the bed and the depth you intend to fill, and treat the result as a volume rather than a recipe.',
    },
    {
      q: 'How many bags of topsoil make a cubic yard?',
      a: 'It depends on the bag. A cubic yard is 27 cu ft, so that is thirty-six 0.75 cu ft bags, twenty-seven 1 cu ft bags, or eighteen 1.5 cu ft bags. The calculator shows all three counts for your volume so you can compare a bag price with a bulk price honestly.',
    },
    {
      q: 'Does the calculator tell me how much compost to add?',
      a: 'No. Compost is used as an amendment, and how much to add depends on what the soil needs, which normally means a soil test. The calculator is for planning the volume of material you are spreading or filling.',
    },
  ],
  sources: [
    {
      label: 'Penn State Extension — Using Composts to Improve Turf Performance',
      note: 'Published surface-application volumes per unit area, used above as an independent cross-check on thin lawn applications.',
      url: 'https://extension.psu.edu/using-composts-to-improve-turf-performance',
    },
  ],
  limitations:
    'The calculator models volume, not soil suitability. It does not test drainage, pH, organic content, compaction or contamination, and it cannot tell you whether a supplier product is adequate for planting. Screened topsoil can still contain weed seed, stones or a high clay fraction. If a lawn or a planting scheme depends on the result, get a soil test or an agronomic recommendation rather than inferring quality from a quantity.',
  related: [
    { href: '/calculators/topsoil-calculator', label: 'Topsoil Calculator', note: 'Presets for beds, raised beds, top-dressing and new lawn' },
    { href: '/materials/topsoil', label: 'Material guide: topsoil, garden soil and compost' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/projects/how-to-calculate-mulch', label: 'Project guide: how to calculate mulch' },
    { href: '/projects/how-to-calculate-landscaping-materials', label: 'Project guide: landscaping materials workflow' },
    { href: '/calculators/soil-calculator', label: 'Soil Calculator', note: 'For general soil and fill by area and depth' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'topsoil-calculator',
  relatedCalculators: ['soil-calculator', 'mulch-calculator', 'landscape-rock-calculator'],
};
