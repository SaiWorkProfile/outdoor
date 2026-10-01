import type { ContentPage } from '../types';
import { drivewayExample } from '../shared';

export const page: ContentPage = {
  cluster: 'costs',
  slug: 'gravel-driveway-cost',
  path: '/costs/gravel-driveway-cost',
  h1: 'What drives gravel driveway cost',
  metaTitle: 'Gravel Driveway Cost: Excavation, Base, Surface and Delivery',
  metaDescription:
    'Why a driveway price is mostly preparation and base material, how excavation, drainage, delivery and labour change the total, and how to compare driveway quotes.',
  eyebrow: 'Cost guide',
  crumb: 'Gravel driveway cost',
  lede:
    'A gravel driveway price has very little to do with the stone on the surface. Excavation, subgrade preparation, the base layers, drainage and delivery are usually where the money goes — and where two quotes for the same driveway can legitimately differ by a large margin.',
  keyFacts: [
    { label: 'Priced as', value: 'Layers of material plus site work' },
    { label: 'Largest item', value: 'Usually preparation and base material' },
    { label: 'Delivery', value: 'Per load, often the visible variable' },
    { label: 'Most site-specific', value: 'Excavation, drainage and access' },
    { label: 'Prices here', value: 'Only the ones you enter' },
    { label: 'Calculator', value: 'Driveway Gravel Calculator' },
  ],
  sections: [
    {
      id: 'where-money-goes',
      heading: 'Where the money goes',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'The components of a gravel driveway price',
            head: ['Component', 'Why it is a line item', 'What makes it vary'],
            rows: [
              ['Excavation and removal', 'Material has to be taken out before new layers go in', 'How much spoil there is, where it goes and how hard it is to dig'],
              ['Subgrade preparation', 'The surface the base sits on has to be shaped and compacted', 'Soil type, drainage and how much soft material has to be replaced'],
              ['Base material', 'Usually the largest material volume', 'Planned depth, subgrade strength and whether the surface takes vehicles'],
              ['Middle and surface layers', 'Smaller volumes, but a second and third delivery', 'Product choice, and whether the top layer is decorative or functional'],
              ['Compaction', 'Each layer has to be worked, usually with hired equipment', 'Plant hire rates and the time each layer takes'],
              ['Drainage work', 'Water has to leave the surface and the sub-base', 'Site levels, whether a ditch, culvert or channel is needed'],
              ['Delivery', 'Several loads of different materials', 'Distance, vehicle size, access and any placement charge'],
              ['Edging or kerbs', 'Restraint at the edges where ground is soft or levels change', 'Length, type and whether it is a load-bearing kerb or a simple edge'],
              ['Labour', 'Digging, spreading, raking, compacting and finishing', 'Access, ground conditions and how much is machine work'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'No universal figure applies',
          text: 'A driveway cost depends on the site far more than on the materials. A level site with firm ground and clear access is a completely different project from one that needs excavation, a replacement sub-base and a drainage solution, even when the finished surface looks identical.',
        },
      ],
    },
    {
      id: 'example',
      heading: 'A three-layer driveway priced per layer',
      blocks: [
        {
          kind: 'p',
          text: 'The driveway calculator applies a price per layer to the quantity it has already calculated, so each layer is priced on its own volume rather than on one blended figure. The example below uses illustrative prices to show the structure.',
        },
        { kind: 'example', id: 'driveway-cost-layers' },
      ],
    },
    {
      id: 'drainage-labour',
      heading: 'Drainage and labour: the two lines that decide the outcome',
      blocks: [
        {
          kind: 'p',
          text: 'Drainage is the most common reason a driveway fails, and it is also the line most easily left out of a quote. Water that cannot leave the surface will eventually take the surface with it, so the cost of shaping and of any culvert, ditch or channel is not optional decoration — it is part of the build.',
        },
        {
          kind: 'ul',
          items: [
            'Shaping the surface to shed water changes layer depths at different points along the driveway, which changes quantities slightly.',
            'A crossing or culvert at the entrance is a separate item with its own materials.',
            'Soft ground may need replacement or stabilisation before any aggregate is ordered.',
            'Labour for a driveway is usually machine work plus finishing. Access decides how much of it can be done by machine.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Ask what happens to the spoil',
          text: 'Excavated material has to go somewhere. Disposal, or reuse elsewhere on the property, is a cost and an earth-moving task. It is a common omission from a driveway quote, and it appears later as an extra.',
        },
      ],
    },
    {
      id: 'comparing',
      heading: 'Comparing driveway quotes',
      blocks: [
        {
          kind: 'checklist',
          title: 'What every driveway quote should state',
          items: [
            'The area measured, and the layer build-up with a depth for each layer',
            'Whether excavation is included, and how much material will be removed',
            'What happens to spoil, including who pays for disposal',
            'Subgrade preparation method and how it will be compacted',
            'Whether compaction of each aggregate layer is included',
            'Drainage: what falls are planned, and whether any ditch, culvert or channel is included',
            'The product by catalogue name and size for each layer',
            'Delivery: how many loads, of what, and whether placement is included',
            'Edge treatment, and any transition where the driveway meets a road or a path',
            'Labour and equipment, stated as a rate or a fixed sum',
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
            { href: '/projects/how-to-plan-a-gravel-driveway', label: 'How to plan a gravel driveway', note: 'Layers, drainage and quantity planning' },
            { href: '/materials/gravel', label: 'Gravel and rock: sizing, uses and quantity planning' },
            { href: '/costs/gravel-cost', label: 'What changes the price of gravel' },
            { href: '/projects/outdoor-project-cost-planning', label: 'Outdoor project cost planning' },
            { href: '/calculators/driveway-gravel-calculator', label: 'Open the Driveway Gravel Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    drivewayExample({
      id: 'driveway-cost-layers',
      title: 'A 40 ft driveway with a parking pad, priced layer by layer',
      scenario:
        'A 40 ft × 12 ft run plus a 20 ft × 20 ft parking pad, built with the calculator default layers and priced with illustrative entries of 40.00 per cubic yard for the base layer, 46.00 for the middle layer and 52.00 for the surface, plus a 70.00 per-load delivery fee. Replace these with your own quotes; no currency conversion is involved in the running total.',
      conclusion:
        'Pricing by layer is what makes the structure visible: the base layer is the largest material volume and usually the largest material cost, while the surface is the smallest. The delivery line is charged per load, so the number of loads matters as much as the rate. Note what is not in the total — excavation, spoil removal and drainage are site costs that no material calculation can contain, which is exactly why they belong in a written quote.',
      sections: [
        { kind: 'rectangle', length: 40, width: 12 },
        { kind: 'rectangle', length: 20, width: 20 },
      ],
      layers: [
        { name: 'Base layer', depthIn: 4, compactionFactor: 1.15, pricePerCuYd: 40 },
        { name: 'Middle layer', depthIn: 2, compactionFactor: 1.15, pricePerCuYd: 46 },
        { name: 'Surface layer', depthIn: 2, compactionFactor: 1.1, pricePerCuYd: 52 },
      ],
      truckCapacityTons: 10,
      deliveryFeePerLoad: 70,
    }),
  ],
  faq: [
    {
      q: 'How much does a gravel driveway cost?',
      a: 'This site does not publish a figure, because a driveway price is dominated by site work rather than by stone. Excavation, subgrade preparation, drainage and access vary from one property to the next, and those items alone can exceed the material cost. Build the quantity first, then obtain quotes against the same build-up.',
    },
    {
      q: 'Is the surface material worth paying more for?',
      a: 'Sometimes. A better surface material can be easier to maintain, more comfortable to drive on and more visually consistent. But the surface is the thinnest layer, so spending there while skimping on the base is the wrong way round: a good base under a cheap surface outperforms the reverse.',
    },
    {
      q: 'Why does the calculator charge delivery per load?',
      a: 'Because that is how bulk delivery is normally priced: a fee per vehicle trip, with a minimum. It also means that the number of loads — driven by total tonnage and truck size — is a real cost variable, which is why the calculator shows it separately.',
    },
    {
      q: 'Does the quote need to include drainage?',
      a: 'Yes, and it should describe what is being done. Falls, ditches, culverts and channel drains are all site-specific, and a driveway without a way for water to leave will need attention sooner than one with it. If drainage is not mentioned in a quote, ask about it before comparing totals.',
    },
    {
      q: 'Can I build a gravel driveway in stages?',
      a: 'Often the base and middle layers can be placed and used, with the surface added later. That spreads the cost, but it means a second delivery and a second round of compaction. Whether it saves anything depends on delivery minimums and on whether the intermediate surface survives a season without rutting.',
    },
  ],
  limitations:
    'This page explains the structure of a gravel driveway price. It does not provide prices or regional estimates, does not account for taxes, permits, disposal charges, drainage connections or site-specific preparation, and makes no claim about what any driveway should cost. The prices in the worked example are illustrative entries. Where a driveway carries heavy vehicles, crosses drainage or falls under local rules, obtain site-specific design advice and written quotes.',
  related: [
    { href: '/calculators/driveway-gravel-calculator', label: 'Driveway Gravel Calculator', note: 'Layers, compaction, delivery loads and your own prices' },
    { href: '/projects/how-to-plan-a-gravel-driveway', label: 'Project guide: how to plan a gravel driveway' },
    { href: '/materials/gravel', label: 'Material guide: gravel and rock' },
    { href: '/costs/gravel-cost', label: 'Cost guide: what changes the price of gravel' },
    { href: '/projects/outdoor-project-cost-planning', label: 'Project guide: outdoor project cost planning' },
    { href: '/calculators/gravel-calculator', label: 'Gravel Calculator', note: 'For a single surface layer' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'driveway-gravel-calculator',
  relatedCalculators: ['gravel-calculator', 'paver-base-calculator', 'concrete-calculator'],
};
