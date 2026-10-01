import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { ContentPage } from '../types';
import { drivewayExample } from '../shared';

const LAYER_PURPOSE = [
  'The thickest layer: it spreads vehicle load into the ground and needs the most material.',
  'A transition layer that locks the base together and fills voids before the surface goes down.',
  'The wearing course you see and drive on. It is renewed more often than the layers beneath it.',
];

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-plan-a-gravel-driveway',
  path: '/projects/how-to-plan-a-gravel-driveway',
  h1: 'How to plan a gravel driveway',
  metaTitle: 'How to Plan a Gravel Driveway: Layers, Depths and Quantities',
  metaDescription:
    'Plan a gravel driveway in layers: measure the footprint, set a depth for base, middle and surface, allow for compaction and waste, and estimate delivery loads.',
  eyebrow: 'Driveway project guide',
  crumb: 'How to plan a gravel driveway',
  lede:
    'A gravel driveway is calculated layer by layer, because each layer is a different stone at a different depth with its own compaction behaviour. Measure the footprint once, then run base, middle and surface through the same calculation and add the results into one order.',
  keyFacts: [
    { label: 'Plan as layers', value: 'Base, middle, surface' },
    { label: 'Default planning depth', value: `${ENGINE_ASSUMPTIONS.driveway.layers.reduce((sum, layer) => sum + layer.depthIn, 0)} in total` },
    { label: 'Compaction allowance', value: 'Applied per compacted layer' },
    { label: 'Delivery', value: 'Usually by the load, priced per load' },
    { label: 'Section handling', value: 'Driveway, apron and turnaround as separate areas' },
    { label: 'Calculator', value: 'Driveway Gravel Calculator' },
  ],
  sections: [
    {
      id: 'layers',
      heading: 'Why a driveway is planned in layers',
      blocks: [
        {
          kind: 'p',
          text: 'A single depth of stone tipped onto bare ground is a path, not a driveway. A driveway that has to take vehicles is normally built from a coarse base that spreads load, a middle layer that binds the base together, and a finer surface that can be graded and maintained. Each layer is ordered separately because each is a different material.',
        },
        {
          kind: 'table',
          table: {
            caption: 'The three-layer starting point the driveway calculator uses',
            head: ['Layer', 'Default depth', 'Compaction allowance', 'Purpose'],
            rows: ENGINE_ASSUMPTIONS.driveway.layers.map((layer, index) => [
              layer.name,
              `${layer.depthIn} in`,
              `×${layer.compactionFactor}`,
              LAYER_PURPOSE[index] ?? '',
            ]),
            note: 'These are starting values you can edit per layer. Required depths depend on soil, drainage, climate and traffic.',
          },
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'The calculator does not design a driveway',
          text: 'It converts your layer depths into material quantities. It does not assess subgrade strength, drainage, frost depth or the loads your driveway will carry. Where those matter, the decision belongs to a local professional or a site-specific design.',
        },
      ],
    },
    {
      id: 'measure',
      heading: 'Measuring a driveway that is not one rectangle',
      blocks: [
        {
          kind: 'p',
          text: 'Driveways are usually two or three shapes: the run itself, a wider apron where it meets the road, and a turning or parking area. Enter each as its own section and the calculator applies the same layers across the total area, which is exactly how a delivery is planned.',
        },
        { kind: 'diagram', id: 'driveway-layers', caption: 'Each layer is calculated on its own depth and compacted before the next goes down.' },
        {
          kind: 'ul',
          items: [
            'Measure the finished width you want, then add an allowance If you are widening a turning area; the area, not the line, is what gets paved.',
            'A taper is best treated as an average width. Measure both ends, average them, and enter one rectangle.',
            'A curve can be approximated by two or three short rectangles. The error is smaller than a wheelbarrow load.',
            'Measure access as well as area: if a delivery truck cannot reach the far end, that material has to be moved by machine or by hand, and that changes the plan more than the quantity does.',
          ],
        },
      ],
    },
    {
      id: 'quantities',
      heading: 'Turning layers into an order',
      blocks: [
        {
          kind: 'steps',
          items: [
            {
              title: 'Total area of the footprint',
              body: 'All sections added together. The road-facing apron and the parking pad count as much as the run itself.',
            },
            {
              title: 'Multiply by each layer depth',
              body: 'Four inches of base over the whole area is a bigger quantity than two inches of surface, even though the surface is what you see.',
            },
            {
              title: 'Apply the compaction allowance per layer',
              body: 'A compacted layer loses thickness as air is squeezed out, so the order has to be larger than the design depth.',
            },
            {
              title: 'Add the waste allowance',
              body: 'One waste percentage covers spillage and uneven spreading across every layer, so it does not have to be tracked three times.',
            },
            {
              title: 'Round each layer up, then add them',
              body: 'Suppliers deliver in increments, so each layer is rounded before the layers are summed. That is why the total order is slightly larger than the total volume.',
            },
            {
              title: 'Convert to loads',
              body: 'Divide total tonnage by the truck capacity you enter and round up. Delivery is normally charged per load, so the load count is a cost driver rather than a technical detail.',
            },
          ],
        },
      ],
    },
    {
      id: 'example',
      heading: 'Worked example: a 40 ft run with a 20 ft parking pad',
      blocks: [
        {
          kind: 'p',
          text: 'This example uses the calculator defaults for the three layers, a 10% waste allowance, ten-ton trucks and a per-load delivery fee. Every figure below is produced by the driveway calculator itself.',
        },
        { kind: 'example', id: 'driveway-pad' },
      ],
    },
    {
      id: 'drainage',
      heading: 'Drainage considerations a quantity calculator will not raise',
      blocks: [
        {
          kind: 'p',
          text: 'Water is the most common reason a gravel driveway fails, and volume arithmetic says nothing about it. There are a few things worth deciding before the material is ordered, because several of them change the quantities.',
        },
        {
          kind: 'ul',
          items: [
            'Water on a slope takes the surface with it. A graded driveway needs the water directed off the surface, which usually means shaping and sometimes a ditch or channel drain. Shaping changes the depth of the surface layer.',
            'Soft ground needs more base, not more surface. If a loaded vehicle leaves ruts, adding thinner decorative stone on top makes the problem worse.',
            'Water arriving from uphill needs somewhere to go. A culvert or swale at the entrance is a design decision with a quantity attached: pipe, stone, and sometimes a different base detail.',
            'Edges matter. On softer ground, stone spreads sideways unless the edge is restrained by soil, edging or a kerb, and a driveway that spreads gets thinner as well as wider.',
            'Fabric under a base can reduce how much stone migrates into soft subgrade, but only if the subgrade is prepared first.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Compaction is not optional',
          text: 'An uncompacted base keeps losing thickness for months, so the surface becomes uneven and you end up buying more stone. The calculator includes a compaction allowance; compacting each layer in lifts is what makes that allowance meaningful.',
        },
      ],
    },
    {
      id: 'delivery',
      heading: 'Delivery, access and staging',
      blocks: [
        {
          kind: 'p',
          text: 'Driveway material arrives in very different vehicles depending on quantity. A few cubic yards may come on a small tipper that fits down a side access; a full multi-layer order often arrives on a larger vehicle that needs more room to turn and place the load.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Questions to answer before booking a delivery',
            head: ['Question', 'Why it changes the plan'],
            rows: [
              ['Can a loaded vehicle reach the far end of the driveway?', 'If not, material has to be moved twice, or each layer ordered and staged in a different place'],
              ['Where will each layer sit while the layer below is prepared?', 'Mixed piles cannot be separated once tipped, and re-handling stone is slow work'],
              ['Is there a weight or size restriction on the access?', 'Oversize vehicles may not be permitted, which limits delivery size and increases the number of loads'],
              ['Will the entrance stay usable during the work?', 'Most projects need at least one vehicle parked elsewhere for a period'],
            ],
          },
        },
      ],
    },
    {
      id: 'limits-of-a-calculator',
      heading: 'What this approach cannot tell you',
      blocks: [
        {
          kind: 'p',
          text: 'A quantity estimate answers "how much", and it answers that well. It cannot tell you whether 4 in of base is enough for your soil, whether the crust of your subgrade is stable, whether water will sit under the driveway in spring, or what local rules require for a new or widened access. Nor can it tell you whether the stone you have been quoted is the right gradation for the layer it is going into.',
        },
        {
          kind: 'p',
          text: 'The driveway calculator warns when the total planned depth sits on the light side for regular vehicle traffic, because a thin build-up is a common and expensive mistake. That warning is a prompt to check the site, not a judgement about it.',
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
            { href: '/materials/gravel', label: 'Gravel and rock: sizing, uses and quantity planning', note: 'What different gradations are used for' },
            { href: '/costs/gravel-driveway-cost', label: 'What drives gravel driveway cost', note: 'Excavation, base material, surface, delivery and labour' },
            { href: '/projects/how-much-gravel-do-i-need', label: 'How much gravel do I need?', note: 'The single-layer calculation, explained from scratch' },
            { href: '/calculators/driveway-gravel-calculator', label: 'Open the Driveway Gravel Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    drivewayExample({
      id: 'driveway-pad',
      title: '40 ft × 12 ft driveway run plus a 20 ft × 20 ft parking pad',
      scenario:
        'Two sections with the calculator default layers — 4 in base, 2 in middle and 2 in surface — a 10% waste allowance, ten-ton trucks and a per-load delivery fee.',
      conclusion:
        'Two things stand out. The base layer is the largest single quantity, which is normal and is why the structural layers deserve more attention than the decorative surface. And the load count is a planning constraint as much as a cost one: four loads means four visits by a vehicle that has to reach the drop point each time.',
      sections: [
        { kind: 'rectangle', length: 40, width: 12 },
        { kind: 'rectangle', length: 20, width: 20 },
      ],
      truckCapacityTons: 10,
      deliveryFeePerLoad: 75,
    }),
  ],
  faq: [
    {
      q: 'How deep should a gravel driveway be?',
      a: 'The calculator starts from 4 in of base, 2 in of middle layer and 2 in of surface, which is 8 in in total. That is a planning starting point, not a specification. Where you land depends on subgrade strength, how much water the site deals with, ground movement in winter and the vehicles using it.',
    },
    {
      q: 'Do I need three layers, or can I use one stone?',
      a: 'A single gradation can work as a surface over a firm, well-drained base. What it cannot do is spread load the way a coarse base does, so even a one-stone driveway still has two depths of the same material. The layers exist to do different jobs.',
    },
    {
      q: 'How do I convert cubic yards to tons for driveway stone?',
      a: 'Multiply cubic yards by the density in tons per cubic yard. This planner uses about 1.4 tons per cubic yard for gravel, and the calculator accepts a density override when your supplier gives you a product-specific figure. Moisture changes the number, so treat it as a load-planning estimate.',
    },
    {
      q: 'Why does the calculator round each layer up separately?',
      a: 'Because suppliers deliver in increments and each layer is effectively a separate order line. Rounding each layer before summing gives the quantity you would actually ask for, rather than an ideal total that cannot be bought.',
    },
    {
      q: 'Can the calculator plan a driveway for heavy vehicles?',
      a: 'It can calculate quantities for whatever depths you enter, and it warns when the planned total depth is light. It deliberately does not decide adequacy for heavy loads, because that needs a site-specific design from a qualified professional.',
    },
  ],
  limitations:
    'This page and its calculator plan material quantities. They are not structural or site engineering, and they do not evaluate subgrade strength, drainage capacity, ground movement, access geometry or local stormwater rules. Layer depths shown are planning defaults that you can and should change. If a driveway carries heavy vehicles, sits on soft or wet ground, or falls under drainage regulations, have the design reviewed before ordering material.',
  related: [
    { href: '/calculators/driveway-gravel-calculator', label: 'Driveway Gravel Calculator', note: 'Edit each layer, add sections and price per load' },
    { href: '/materials/gravel', label: 'Material guide: gravel and rock' },
    { href: '/costs/gravel-driveway-cost', label: 'Cost guide: gravel driveway cost' },
    { href: '/projects/how-much-gravel-do-i-need', label: 'Project guide: how much gravel do I need?' },
    { href: '/projects/how-to-calculate-landscaping-materials', label: 'Project guide: landscaping materials workflow' },
    { href: '/calculators/gravel-calculator', label: 'Gravel Calculator', note: 'For a single surface layer' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'driveway-gravel-calculator',
  relatedCalculators: ['gravel-calculator', 'paver-base-calculator', 'sand-calculator'],
};
