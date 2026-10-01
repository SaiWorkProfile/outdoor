import type { ContentPage } from '../types';
import { bulkExample, depthRangeTable, materialAssumptionTable } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-much-gravel-do-i-need',
  path: '/projects/how-much-gravel-do-i-need',
  h1: 'How much gravel do I need?',
  metaTitle: 'How Much Gravel Do I Need? Area, Depth, Yards and Tons',
  metaDescription:
    'Work out how much gravel a project needs: measure each section, pick a depth, convert square feet to cubic yards and tons, allow for waste, and choose bags or bulk.',
  eyebrow: 'Gravel project guide',
  crumb: 'How much gravel do I need?',
  lede:
    'Three things decide the order: the area you are covering, the depth of the gravel layer, and how much extra to allow for waste. Area × depth ÷ 12 gives cubic feet, ÷ 27 gives cubic yards, and cubic yards × the material density gives an estimated tonnage. The gravel calculator runs all of those steps from your own measurements.',
  keyFacts: [
    { label: 'What to measure', value: 'Length × width of every section, in feet' },
    { label: 'Depth sets the volume', value: 'Doubling the depth doubles the order' },
    { label: 'Ordering unit', value: 'Cubic yards, tons or bags' },
    { label: 'Typical waste allowance', value: '10% for most projects' },
    { label: 'Bags versus bulk', value: 'Bags are practical below about 0.5 cu yd' },
    { label: 'Calculator', value: 'Gravel Calculator' },
  ],
  sections: [
    {
      id: 'what-this-covers',
      heading: 'What this guide works out, and what it does not',
      blocks: [
        {
          kind: 'p',
          text: 'This page is about turning measurements you can take with a tape measure into a gravel order. It covers a surface layer: a walkway, a parking pad, a gravel patio seating area, or a decorative cover over landscape fabric. It also walks through the arithmetic that converts square feet into cubic yards and tons, so you can sanity-check any quote you are given.',
        },
        {
          kind: 'p',
          text: 'What it does not do is decide your drainage, your subgrade, or how thick a layer your particular site needs. Those depend on soil, water movement and the loads the surface has to carry. Plan quantities here, then confirm anything structural with the person or the documentation that owns that decision.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'A quantity estimate is not a site specification',
          text: 'The calculator converts measurements into material quantities. It does not test your soil, assess drainage, or confirm that a build-up is adequate for vehicles, footings or frost.',
        },
      ],
    },
    {
      id: 'measure',
      heading: 'Step 1: measure the surface you are covering',
      blocks: [
        {
          kind: 'p',
          text: 'Measure the area that will actually receive gravel, and do it in sections. A driveway with a wider apron, a walkway that turns a corner and a planting bed that follows a curve are all easier to handle as two or three rectangles than as one optimistic guess at the whole shape. The calculator accepts multiple areas and adds them together.',
        },
        {
          kind: 'diagram',
          id: 'area-measure',
          caption:
            'Square feet alone never tells you how much gravel to buy. The depth of the layer is what turns an area into a volume.',
        },
        {
          kind: 'ul',
          items: [
            'Measure at the level the gravel will sit on, not at the finished surface. A 3 in layer over a 4 in base means your tape sits on top of the base.',
            'Round each section up to the nearest half foot. Precision beyond that disappears into an order rounded to the nearest quarter cubic yard.',
            'Give any section you plan to fill deeper than the rest its own line, such as a low spot or a transition into a slope.',
            'For a tapered section, measure both ends and use the average width.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'An irregular shape has a shortcut',
          text: 'Walk the outline and drop the measurements into a scale sketch if you have one. Otherwise split the shape into rectangles and right triangles, calculate each, and enter them as separate areas.',
        },
      ],
    },
    {
      id: 'depth',
      heading: 'Step 2: choose a depth you can defend',
      blocks: [
        {
          kind: 'p',
          text: 'Depth is the single biggest lever on the order. The calculator keeps planning ranges for common gravel uses and warns you when your number sits outside the range, but it never overrides your judgement: a thin decorative cover and a compactable base layer over the same area are completely different orders.',
        },
        { kind: 'table', table: depthRangeTable('gravel') },
        {
          kind: 'p',
          text: 'Two patterns are worth remembering. Loose surface layers usually get thinner as the stone gets larger, because bigger stone leaves more void space and stands proud of the ground with less height. Compactable layers are ordered a little thicker than the finished depth you want, because compaction removes air from the layer.',
        },
      ],
    },
    {
      id: 'convert',
      heading: 'Step 3: convert square feet into cubic yards and tons',
      blocks: [
        {
          kind: 'steps',
          items: [
            {
              title: 'Area × depth in inches ÷ 12',
              body: 'This gives cubic feet. A 600 sq ft pad at 3 in is 600 × 3 ÷ 12 = 150 cubic feet.',
            },
            {
              title: 'Cubic feet ÷ 27',
              body: '27 cubic feet make one cubic yard, the unit most bulk suppliers quote from. 150 ÷ 27 = 5.56 cubic yards.',
            },
            {
              title: 'Add compaction and waste',
              body: 'Compaction applies only to layers that get compacted. Waste covers spillage, uneven ground, and the final wheelbarrow load you always seem to need.',
            },
            {
              title: 'Convert to tons if the supplier sells by weight',
              body: 'Cubic yards × tons per cubic yard. This planner uses about 1.4 tons per cubic yard for gravel, but rock type, gradation and moisture change it, so ask for the supplier figure.',
            },
            {
              title: 'Round the order up',
              body: 'The calculator rounds up to the nearest quarter cubic yard, which is the increment most bulk orders move in.',
            },
          ],
        },
        {
          kind: 'diagram',
          id: 'gravel-depth',
          caption:
            'Loose gravel is ordered by volume and often invoiced by weight. The calculator shows both so a volume quote and a tonnage quote can be compared.',
        },
        { kind: 'table', table: materialAssumptionTable('gravel') },
      ],
    },
    {
      id: 'worked-examples',
      heading: 'Two worked examples',
      blocks: [
        {
          kind: 'p',
          text: 'Both examples below run the real calculation engine as this page renders, using the same defaults a first-time visitor sees in the calculator. Change the numbers in the calculator and you will reproduce them exactly.',
        },
        { kind: 'example', id: 'gravel-pad' },
        { kind: 'example', id: 'gravel-walkway' },
      ],
    },
    {
      id: 'waste',
      heading: 'How much waste allowance do you actually need',
      blocks: [
        {
          kind: 'p',
          text: 'Waste is not a guess about quality; it covers the gravel that ends up somewhere other than the finished surface. Where the ground is uneven, where material is moved by wheelbarrow instead of a chute, and where the layer is raked to a grade, that allowance earns its place.',
        },
        {
          kind: 'ul',
          items: [
            'A flat, machine-spread surface over a prepared subgrade needs the least: often nothing beyond the order rounding.',
            'Hand-placed walks and patios with edging, curves or tight corners sit in the middle, where 10% is a sensible planning figure.',
            'A long carry from the delivery point, or a slope the material will creep down, justifies more.',
            'Anything above 25% should have a specific reason. The calculator warns above that threshold because an unexplained allowance usually means the measurement is wrong rather than the site being that difficult.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Waste and compaction are not the same thing',
          text: 'Waste replaces material that never reaches the surface. Compaction accounts for a layer that loses thickness as it is consolidated. The calculator keeps the two separate, so you can see which one changed the order.',
        },
      ],
    },
    {
      id: 'bags-or-bulk',
      heading: 'Bags or bulk delivery',
      blocks: [
        {
          kind: 'p',
          text: 'Gravel comes in 0.5 cu ft bags, in bulk by the cubic yard, or by the ton. The calculator converts your volume into all of those units at once and suggests which is likely to be practical, based only on volume.',
        },
        {
          kind: 'table',
          table: {
            caption: 'How the calculator translates one volume into purchase units',
            head: ['If you order', 'What the calculator shows', 'Watch out for'],
            rows: [
              [
                'By the cubic yard',
                'The volume after compaction and waste, rounded up to the nearest 0.25 cu yd',
                'Delivery minimums, and how far the truck can get from the work area',
              ],
              [
                'By the ton',
                'Cubic yards multiplied by the supplier density you enter',
                'The same volume weighs less dry and more when saturated',
              ],
              [
                'By the bag',
                'Total cubic feet divided by the fill volume printed on the product',
                'Bag fill volumes vary by brand; 0.5 cu ft is the common size for bagged stone',
              ],
            ],
            note: 'The calculator never supplies a price. Cost rows only appear after you enter your own supplier price.',
          },
        },
        {
          kind: 'p',
          text: 'As a planning cue rather than a rule: below roughly half a cubic yard, bags are convenient. Between half a cubic yard and two cubic yards it can go either way. Above two cubic yards, bulk delivery is usually easier, provided a truck can reach the work area.',
        },
      ],
    },
    {
      id: 'mistakes',
      heading: 'Common mistakes and how they show up',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'Mistakes that change the number you take to the supplier',
            head: ['Mistake', 'What it does to the order', 'Fix'],
            rows: [
              [
                'Measuring the finished surface instead of the subgrade',
                'Overstates the area, because a graded surface spreads wider than the layer beneath it',
                'Run the tape at the level the gravel will sit on',
              ],
              [
                'Mixing up cubic yards and tons',
                'A quote can look far cheaper than it is, because the units are different',
                'Ask which unit the price is quoted in, then compare like for like',
              ],
              [
                'Using one depth everywhere',
                'Oversupplies quiet areas and undersupplies the ones taking traffic',
                'Give each use its own area and depth',
              ],
              [
                'Ignoring compaction on a compactable layer',
                'The finished layer comes up short after it is worked',
                'Turn on the compaction allowance for anything being compacted',
              ],
              [
                'Forgetting fabric, edging or the base',
                'The stone arrives and the preparation is not done',
                'Buy and stage the other components before the delivery date',
              ],
            ],
          },
        },
      ],
    },
    {
      id: 'order-call',
      heading: 'What to have ready when you call the supplier',
      blocks: [
        {
          kind: 'checklist',
          title: 'Supplier checklist',
          items: [
            'The area, the depth, and the finished order quantity in cubic yards',
            'The stone size and type, described using the supplier catalogue name',
            'Whether you want the price by volume or by weight',
            'The delivery address, plus where the truck can safely place the load',
            'Whether the load must be placed rather than tipped, and whether the access is wide enough',
            'The delivery date, and how wide the arrival window can be',
            'Whether the supplier can split the load between two stone types for a base and a surface',
          ],
        },
        {
          kind: 'p',
          text: 'If the delivery is going to sit on the driveway until the weekend, say so. Damp bulk stone left in a pile for a week is heavier and harder to move than fresh material, and it will stain some surfaces.',
        },
      ],
    },
    {
      id: 'next',
      heading: 'Where this fits with the rest of the plan',
      blocks: [
        {
          kind: 'links',
          title: 'Go deeper',
          items: [
            { href: '/materials/gravel', label: 'Gravel: size, uses and what to ask for', note: 'How crushed stone differs by gradation, and what that means for a walkway or a base' },
            { href: '/costs/gravel-cost', label: 'What actually changes the price of gravel', note: 'Material type, quantity, delivery and site access' },
            { href: '/projects/how-to-plan-a-gravel-driveway', label: 'How to plan a gravel driveway', note: 'Multi-layer planning for a surface that takes vehicles' },
            { href: '/projects/how-to-calculate-landscaping-materials', label: 'Landscaping material planning workflow', note: 'One measurement process for gravel, soil, sand and pavers' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'gravel-pad',
      title: 'Gravel surface layer for a 20 ft × 30 ft parking pad',
      scenario:
        'A 20 ft × 30 ft pad gets a 3 in gravel surface layer over a base that is built and compacted separately, with the calculator default 10% waste allowance.',
      conclusion:
        'The depth comparison is the useful part of this result: the same pad at 2 in, 3 in and 4 in are three different orders, and the weight column shows how quickly a tonnage quote grows with depth. At this volume the calculator puts the project firmly in bulk-delivery territory, so a single delivered load plus the separate base material is a more practical plan than counting bags.',
      material: 'gravel',
      areas: [{ kind: 'rectangle', length: 20, width: 30 }],
      depthIn: 3,
      useCase: 'patio',
      compare: [2, 3, 4],
      truckCapacityTons: 10,
    }),
    bulkExample({
      id: 'gravel-walkway',
      title: 'Gravel surface for a 40 ft garden walkway',
      scenario:
        'A 3 ft wide walkway running 40 ft to a gate is finished with a 3 in gravel surface. The same delivery has to cover this section as well as the pad above.',
      conclusion:
        'Small projects are where bagged material starts to compete with bulk delivery, and the bag rows show why: the walkway alone would need far more bags than most people want to carry. Adding the area into the same calculator session as the pad gives one combined order instead of two trips.',
      material: 'gravel',
      areas: [{ kind: 'rectangle', length: 3, width: 40 }],
      depthIn: 3,
      useCase: 'walkway',
    }),
  ],
  faq: [
    {
      q: 'Should I order gravel by the cubic yard or by the ton?',
      a: 'Order in the unit your supplier quotes in, and use the calculator to convert between them. Cubic yards describe the space the material fills, which is what your project actually consumes. Tons describe the weight on the truck, which is how many suppliers prefer to invoice. Compare quotes only after converting both to the same unit.',
    },
    {
      q: 'How many square feet does one cubic yard of gravel cover?',
      a: 'It depends entirely on depth, which is why covering area alone is a misleading way to shop. One cubic yard is 27 cubic feet, so at 3 in deep it covers about 108 sq ft, and at 1 in deep it covers about 324 sq ft. Enter a volume and a depth in the calculator to see the coverage figure for your own numbers.',
    },
    {
      q: 'Is 2 inches deep enough for gravel?',
      a: 'Two inches is inside the planning range the calculator uses for walkways and patios, and it is a common depth for a decorative surface over a firm, prepared base. It is not enough on soft or poorly drained ground, and it is not what you would plan for a surface taking vehicle traffic. The calculator flags depths outside the typical range but leaves the decision to you.',
    },
    {
      q: 'Why does the calculator show both tons and tonnes?',
      a: 'A US short ton is 2,000 lb and a metric tonne is about 2,205 lb, so the numbers differ by roughly 10%. Showing both avoids the common confusion when a supplier or a product data sheet uses the other unit.',
    },
    {
      q: 'Does the calculator include the price of gravel?',
      a: 'No. It never invents a price. Cost output appears only after you type in a price from your own supplier quote, and it then multiplies that price by the calculated quantity so you can compare a per-yard quote with a per-ton quote.',
    },
  ],
  limitations:
    'The calculator models a volume of material. It does not know how well drained your ground is, how deep the frost goes, what is under the surface, or how much load the finished surface has to carry. Gravel density varies by rock type, gradation and moisture, so a tonnage estimate can move by a meaningful amount even when the volume is right. Treat the output as the quantity to start a conversation with, not as a specification or an engineering conclusion.',
  related: [
    { href: '/calculators/gravel-calculator', label: 'Gravel Calculator', note: 'Enter your own areas, depths and supplier price' },
    { href: '/materials/gravel', label: 'Material guide: gravel' },
    { href: '/costs/gravel-cost', label: 'Cost guide: what changes the price of gravel' },
    { href: '/projects/how-to-plan-a-gravel-driveway', label: 'Project guide: planning a gravel driveway' },
    { href: '/projects/how-to-calculate-landscaping-materials', label: 'Project guide: landscaping materials workflow' },
    { href: '/calculators/pea-gravel-calculator', label: 'Pea Gravel Calculator', note: 'For rounded decorative stone at shallower depths' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'gravel-calculator',
  relatedCalculators: ['driveway-gravel-calculator', 'pea-gravel-calculator', 'paver-base-calculator'],
};

