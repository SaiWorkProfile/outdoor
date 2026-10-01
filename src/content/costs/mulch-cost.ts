import type { ContentPage } from '../types';
import { bulkExample } from '../shared';

export const page: ContentPage = {
  cluster: 'costs',
  slug: 'mulch-cost',
  path: '/costs/mulch-cost',
  h1: 'Mulch cost: bagged versus bulk',
  metaTitle: 'Mulch Cost: Bagged vs Bulk and What Drives the Total',
  metaDescription:
    'Why bagged and bulk mulch are priced so differently, how depth and project size change the total, what delivery adds, and how to compare quotes on the same volume.',
  eyebrow: 'Cost guide',
  crumb: 'Mulch cost',
  lede:
    'Mulch is one of the few materials where the packaging decision changes the cost more than the product choice. Bagged mulch carries a large premium per cubic foot, and bulk mulch carries a delivery minimum. This page explains where the crossover falls for your own project.',
  keyFacts: [
    { label: 'Priced by', value: 'Cubic yard or bag' },
    { label: 'Units per cubic yard', value: '27 cu ft — about 9 three-cubic-foot bags' },
    { label: 'Delivery', value: 'Often a flat fee or a minimum quantity' },
    { label: 'Biggest lever', value: 'Total volume, driven by area and depth' },
    { label: 'Prices here', value: 'Only the ones you enter' },
    { label: 'Calculator', value: 'Mulch Calculator' },
  ],
  sections: [
    {
      id: 'bagged-vs-bulk',
      heading: 'Why bagged and bulk mulch cost so differently',
      blocks: [
        {
          kind: 'p',
          text: 'Bagged mulch has been filled, sealed, palletised, transported and retailed, and all of that handling is in the price. Bulk mulch is loaded once from a pile and delivered. The difference per cubic foot is usually substantial, which is why the honest question is not “which is cheaper” but “at what volume does bulk become practical for me”.',
        },
        {
          kind: 'table',
          table: {
            caption: 'How the two routes compare',
            head: ['Factor', 'Bagged', 'Bulk'],
            rows: [
              ['Unit price', 'High per cubic foot, because of packaging and retail handling', 'Lower per cubic foot'],
              ['Minimum order', 'None — buy one bag or forty', 'Often a minimum quantity or a delivery fee that applies regardless'],
              ['Convenience', 'Clean, stackable and easy to move in a car', 'A pile that has to be moved, and a delivery vehicle that has to reach it'],
              ['Suits', 'Small beds, tree rings, top-ups and repairs', 'Whole beds, multiple beds and any project past a few barrows'],
              ['Waste risk', 'Leftover bags store well for next season', 'Leftover pile has to be placed somewhere'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Compare cost per cubic foot',
          text: 'Dividing the bag price by its fill volume, and the bulk price by 27, puts both options on the same basis. The calculator shows both counts for your volume, so the comparison can be made without arithmetic on the back of an envelope.',
        },
      ],
    },
    {
      id: 'what-moves-the-total',
      heading: 'What moves the total',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'The variables behind a mulch cost',
            head: ['Variable', 'Effect', 'Note'],
            rows: [
              ['Bed area', 'Directly proportional to the volume and the cost', 'The number most often estimated rather than measured'],
              ['Depth', 'Directly proportional, and easy to over-specify', 'Going from 2 in to 3 in is a 50% increase in material'],
              ['Material category', 'Bark, wood and blended products are priced differently', 'Colour and screening also affect the price'],
              ['Bag versus bulk', 'Packaging premium versus delivery cost', 'The crossover is usually around half a cubic yard'],
              ['Delivery', 'A flat fee or minimum that a small order absorbs badly', 'Combining beds into one delivery often helps'],
              ['Season', 'Availability and demand change lead time and price', 'Ordering early in the season is easier than late'],
            ],
          },
        },
        { kind: 'example', id: 'mulch-cost-example' },
      ],
    },
    {
      id: 'comparing-quotes',
      heading: 'Comparing mulch quotes on the same volume',
      blocks: [
        {
          kind: 'checklist',
          title: 'Before you decide between bag and bulk',
          items: [
            'Total bed and tree-ring area measured at soil level, added together',
            'Depth chosen per area, so the volume is right before the price is compared',
            'Bag price divided by the bag fill volume, to get a cost per cubic foot',
            'Bulk price checked against any delivery fee or minimum quantity',
            'Colour and product confirmed as the same thing in both quotes',
            'Where the bulk pile will be dropped, and who is moving it',
            'A decision on how much material is worth keeping back for topping up later',
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
            { href: '/projects/how-to-calculate-mulch', label: 'How to calculate mulch', note: 'Get the volume right first' },
            { href: '/materials/mulch', label: 'Mulch: categories, depth and coverage' },
            { href: '/costs/gravel-cost', label: 'What changes the price of gravel', note: 'A similar packaging-versus-delivery trade-off' },
            { href: '/projects/outdoor-project-cost-planning', label: 'Outdoor project cost planning' },
            { href: '/calculators/mulch-calculator', label: 'Open the Mulch Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'mulch-cost-example',
      title: 'A three-bed garden, priced by the cubic yard and by the bag',
      scenario:
        'Three separate beds totalling roughly the area of one 12 ft × 18 ft rectangle, at 3 in deep, priced with illustrative entries of 38.00 per cubic yard, 4.50 per 2 cu ft bag and a 40.00 delivery fee. Replace these with your own figures; the totals shown here follow the currency selected in the header.',
      conclusion:
        'The two cost lines make the trade-off concrete: the bulk price plus delivery, against a bag count multiplied by the bag price. At this volume the bag route is usually the more expensive one, which is the pattern for most real planting beds — but the calculation is what tells you that for your own area and depth, not a rule of thumb.',
      material: 'mulch',
      areas: [{ kind: 'rectangle', length: 12, width: 18 }],
      depthIn: 3,
      useCase: 'garden-bed',
      pricing: { perCuYd: 38, perBag: { bagCuFt: 2, price: 4.5 }, deliveryFee: 40 },
      compare: [2, 3, 4],
    }),
  ],
  faq: [
    {
      q: 'Is bulk mulch always cheaper than bags?',
      a: 'Per cubic foot, almost always. Delivered total, not necessarily — a small order that still attracts a minimum delivery charge can cost more than a handful of bags. The crossover for most projects is around half a cubic yard, and the calculator shows both quantities so you can check your own case.',
    },
    {
      q: 'How many bags of mulch is a cubic yard?',
      a: '27 cubic feet, so about thirteen and a half 2 cu ft bags or nine 3 cu ft bags. Dividing your total cubic yardage into bags is the fastest way to see whether a bagged purchase is realistic.',
    },
    {
      q: 'Does mulch depth affect the cost more than price shopping?',
      a: 'Usually yes. Going from 2 in to 3 in increases the material by 50% for the same beds. Changing supplier might move the unit price by a smaller margin than that. Getting the depth right is the most reliable saving available.',
    },
    {
      q: 'Why do mulch prices change through the season?',
      a: 'Availability, demand and delivery scheduling all move through the year, and a supplier who is fully booked charges differently from one with spare capacity. Ordering early in the season and accepting a flexible delivery day both help.',
    },
    {
      q: 'Should I keep spare mulch for topping up?',
      a: 'A small margin is genuinely useful, because beds settle and organic mulch decomposes. Bulk leftovers need somewhere to sit and may not match the next batch exactly, so it is often more practical to keep a few bags back than to over-order bulk.',
    },
  ],
  limitations:
    'This page explains what drives a mulch cost and how to compare the two purchase routes. It does not publish prices or regional estimates, and it does not account for taxes, minimum charges or supplier-specific terms. Prices vary by location, product, season and quantity. Use the variables here as a comparison checklist, and obtain your own quotes.',
  related: [
    { href: '/calculators/mulch-calculator', label: 'Mulch Calculator', note: 'Apply your own price per cubic yard or per bag' },
    { href: '/projects/how-to-calculate-mulch', label: 'Project guide: how to calculate mulch' },
    { href: '/materials/mulch', label: 'Material guide: mulch' },
    { href: '/costs/gravel-cost', label: 'Cost guide: what changes the price of gravel' },
    { href: '/projects/outdoor-project-cost-planning', label: 'Project guide: outdoor project cost planning' },
    { href: '/calculators/topsoil-calculator', label: 'Topsoil Calculator', note: 'For beds that need soil before mulch' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'mulch-calculator',
  relatedCalculators: ['topsoil-calculator', 'soil-calculator', 'landscape-rock-calculator'],
};
