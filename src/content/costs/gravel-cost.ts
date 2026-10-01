import type { ContentPage } from '../types';
import { bulkExample } from '../shared';

export const page: ContentPage = {
  cluster: 'costs',
  slug: 'gravel-cost',
  path: '/costs/gravel-cost',
  h1: 'What changes the price of gravel',
  metaTitle: 'Gravel Cost: The Variables That Change the Price',
  metaDescription:
    'Material type, quantity, supplier, delivery, location, site access and packaging all move the price of gravel. Understand each one before comparing quotes.',
  eyebrow: 'Cost guide',
  crumb: 'What changes the price of gravel',
  lede:
    'Gravel has no universal price, and any single figure quoted as one is describing a different project. What can be explained honestly is what moves the number: the material, the quantity, how it arrives, and how hard it is to get it where it needs to be.',
  keyFacts: [
    { label: 'Priced by', value: 'Cubic yard, ton, or bag' },
    { label: 'Delivery', value: 'Usually charged per load, with a minimum' },
    { label: 'Biggest swing', value: 'How far it travels and how it is placed' },
    { label: 'Small orders', value: 'Pay a premium per unit' },
    { label: 'Prices in this tool', value: 'Only the ones you enter' },
    { label: 'Calculator', value: 'Gravel Calculator' },
  ],
  sections: [
    {
      id: 'variables',
      heading: 'The variables, in order of how much they usually move the price',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'What moves a gravel price, from largest effect to smallest',
            head: ['Variable', 'Why it changes the price', 'What you can do about it'],
            rows: [
              ['How far the material travels', 'Transport is a large part of the delivered cost, so distance from the quarry or depot matters more than most people expect', 'Buy from a supplier local to the project'],
              ['How the load is placed', 'A tip at the gate and a placed load near the work area are different jobs', 'Decide the drop point before ordering, and ask what placement costs'],
              ['Quantity', 'Small orders pay a premium per unit and may carry a minimum charge', 'Combine materials into one delivery where it makes sense'],
              ['Material type and gradation', 'Washed, screened and specialty stones cost more to produce than a basic crushed product', 'Match the product to the job rather than over-specifying'],
              ['Packaging', 'Bags carry a large per-unit premium over bulk', 'Use bags only where bulk delivery is impractical'],
              ['Order unit', 'Ton pricing and cubic yard pricing are not the same comparison', 'Convert both to one unit before comparing'],
              ['Season and availability', 'Demand and plant availability change lead times and sometimes prices', 'Order ahead of a busy period if you can'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Why this page does not quote a price',
          text: 'A price without a location, a quantity and an access description is not information, it is a guess. The calculators here compute quantities and apply your own prices so the arithmetic is transparent and the price is yours.',
        },
      ],
    },
    {
      id: 'comparing',
      heading: 'How to compare two gravel quotes properly',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: 'Normalise the unit', body: 'Convert every quote to the same basis — per cubic yard is usually easiest — using the density figure the supplier uses.' },
            { title: 'Check the quantity basis', body: 'Confirm what depth the quote assumes, because a quote for a 2 in layer and one for a 3 in layer are for different jobs.' },
            { title: 'Add the delivery', body: 'Compare delivered totals, not material prices, and ask whether the fee is per load with a minimum.' },
            { title: 'Compare the inclusions', body: 'Placement, tipping restrictions and any machine time should be listed so both quotes describe the same service.' },
            { title: 'Check the product', body: 'Two quotes for “gravel” may be for different gradations, which are different products at different prices.' },
          ],
        },
        { kind: 'example', id: 'gravel-cost-per-ton' },
      ],
    },
    {
      id: 'access',
      heading: 'Site access is the variable people forget',
      blocks: [
        {
          kind: 'p',
          text: 'Access decides which vehicle can deliver, how close it can get, and therefore whether the material can be tipped where it is needed or has to be moved by hand or by machine. Two identical orders on two adjacent properties can cost different amounts simply because one has a wide gate and the other has a low branch over the entrance.',
        },
        {
          kind: 'ul',
          items: [
            'Narrow or low access limits vehicle size, which usually means more loads at a higher cost per load.',
            'A load that has to be barrowed across a lawn takes time, and time is the real cost of a bad drop point.',
            'Soft ground or a slope can rule out some vehicles entirely.',
            'A delivery that blocks a shared driveway has a cost measured in other people’s patience, which is worth avoiding deliberately.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Cheaper material in more loads is often not cheaper',
          text: 'If access forces several small deliveries, the per-load charges can outweigh a lower material rate. Compare total delivered cost for the quantity you actually need, not the headline rate.',
        },
      ],
    },
    {
      id: 'bags',
      heading: 'Bagged versus bulk, in cost terms',
      blocks: [
        {
          kind: 'p',
          text: 'Bagged stone carries a large premium per cubic foot because someone else has already filled and handled it. That premium is worth paying for a single tree ring and rarely worth paying for a path.',
        },
        {
          kind: 'table',
          table: {
            caption: 'The trade-off between packaging options',
            head: ['Option', 'Cost character', 'Best suited to'],
            rows: [
              ['Bags', 'High per cubic foot, no delivery charge, no minimum', 'Small areas, repairs, awkward access for vehicles'],
              ['Bulk by the cubic yard', 'Lower per unit, delivery fee, often a minimum', 'Most projects above roughly half a cubic yard'],
              ['Bulk by the ton', 'Lower per unit, priced on weight, needs a density figure', 'Suppliers who price by weight, and larger orders'],
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
            { href: '/projects/how-much-gravel-do-i-need', label: 'How much gravel do I need?', note: 'Get the quantity right before comparing prices' },
            { href: '/materials/gravel', label: 'Gravel: sizes, uses and quantity planning', note: 'Why the gradation changes the product you are pricing' },
            { href: '/costs/gravel-driveway-cost', label: 'What drives gravel driveway cost', note: 'The multi-layer version of the same question' },
            { href: '/projects/outdoor-project-cost-planning', label: 'Outdoor project cost planning', note: 'Where material sits in a whole-project budget' },
            { href: '/calculators/gravel-calculator', label: 'Open the Gravel Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'gravel-cost-per-ton',
      title: 'A path priced by the ton, with a delivery fee',
      scenario:
        'A 3 ft × 40 ft path at 3 in deep, priced with illustrative entries of 55.00 per ton and a 45.00 delivery fee. The prices exist to demonstrate how a weight-based quote is applied; replace them with your own supplier figures, which the calculator shows in the currency chosen at the top of the page.',
      conclusion:
        'Two things are worth noticing. First, the cost is applied to the estimated tonnage, so if your supplier’s density differs from the planning value the material cost moves with it. Second, the delivery fee is added once, which means a small order and a slightly larger one often cost nearly the same delivered — a good reason to buy the whole project’s gravel in one trip.',
      material: 'gravel',
      areas: [{ kind: 'rectangle', length: 3, width: 40 }],
      depthIn: 3,
      useCase: 'walkway',
      pricing: { perTon: 55, deliveryFee: 45 },
    }),
  ],
  faq: [
    {
      q: 'How much does a yard of gravel cost?',
      a: 'This site does not publish a price, because a yard of gravel costs whatever your local supplier charges for that specific product in that specific quantity — and delivery can add more than the material. Use the calculator to get the quantity, then apply your own quote.',
    },
    {
      q: 'Is it cheaper to buy gravel by the ton or the cubic yard?',
      a: 'The unit itself does not change the material cost; it changes how the supplier prices and how you compare. Convert both to the same basis — using the supplier’s density figure — before deciding. Around 1.4 tons per cubic yard is a reasonable planning factor for gravel.',
    },
    {
      q: 'Why is delivery such a large part of the cost?',
      a: 'Because a loaded vehicle, a driver and a return trip are a large share of the cost of moving bulk material, and the fee is charged per load with a minimum. That is why combining orders and choosing a good drop point saves money more reliably than shopping around for a slightly lower material rate.',
    },
    {
      q: 'Do bags ever work out cheaper?',
      a: 'For very small quantities they can, because there is no delivery charge or minimum. Once the job needs more than a few bags, the per-cubic-foot premium usually outweighs the convenience. The calculator shows the bag count and the cubic yardage at the same time, so the crossover for your own project is visible.',
    },
    {
      q: 'Can I negotiate a better price?',
      a: 'Sometimes, and the two things that help are quantity and flexibility: a larger order, or a delivery that can be fitted into a slower day, gives a supplier more room to work with. Asking for the delivered total rather than the material rate keeps the comparison honest.',
    },
  ],
  limitations:
    'This page explains what moves a gravel price. It does not provide a price, a regional estimate or a quotation, and it does not account for taxes, permits, access restrictions or any site-specific charge. Costs vary by location, supplier, season and quantity. Treat the variables here as a checklist for comparing quotes rather than as a pricing guide.',
  related: [
    { href: '/calculators/gravel-calculator', label: 'Gravel Calculator', note: 'Apply your own price per cubic yard, ton or bag' },
    { href: '/materials/gravel', label: 'Material guide: gravel and crushed stone' },
    { href: '/projects/how-much-gravel-do-i-need', label: 'Project guide: how much gravel do I need?' },
    { href: '/costs/gravel-driveway-cost', label: 'Cost guide: gravel driveway cost' },
    { href: '/projects/outdoor-project-cost-planning', label: 'Project guide: outdoor project cost planning' },
    { href: '/calculators/pea-gravel-calculator', label: 'Pea Gravel Calculator' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'gravel-calculator',
  relatedCalculators: ['driveway-gravel-calculator', 'pea-gravel-calculator', 'paver-base-calculator'],
};
