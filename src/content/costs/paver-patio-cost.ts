import type { ContentPage } from '../types';
import { paverExample } from '../shared';

export const page: ContentPage = {
  cluster: 'costs',
  slug: 'paver-patio-cost',
  path: '/costs/paver-patio-cost',
  h1: 'What drives paver patio cost',
  metaTitle: 'Paver Patio Cost: Pavers, Base, Bedding, Edging and Labour',
  metaDescription:
    'The components behind a paver patio price: pavers, base, bedding sand, edge restraint, waste, delivery and labour, and why quotes differ.',
  eyebrow: 'Cost guide',
  crumb: 'Paver patio cost',
  lede:
    'A paver patio quote is a build-up, not a single material. Pavers are the visible cost, but the compacted base is usually the largest volume and the preparation is often the largest labour item. Understanding the layers is what makes two quotes comparable.',
  keyFacts: [
    { label: 'Components', value: 'Pavers, base, bedding sand, edge restraint' },
    { label: 'Largest volume', value: 'Usually the compacted base' },
    { label: 'Most variable', value: 'Excavation and site preparation' },
    { label: 'Often overlooked', value: 'Edge restraint and delivery' },
    { label: 'Prices here', value: 'Only the ones you enter' },
    { label: 'Calculator', value: 'Paver Patio Calculator' },
  ],
  sections: [
    {
      id: 'components',
      heading: 'The components behind the price',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'What a paver patio price contains',
            head: ['Component', 'Counted from', 'Why it varies'],
            rows: [
              ['Pavers', 'Area ÷ paver module, plus waste', 'Paver type, thickness, colour and pattern; thicker and premium units cost more'],
              ['Compacted base', 'Area × base depth, plus a compaction allowance', 'Base depth depends on subgrade and use; it is usually the largest material volume'],
              ['Bedding sand', 'Area × bedding depth', 'A thin layer, but a real purchase with a delivery implication'],
              ['Edge restraint', 'Perimeter length, plus waste, in stock pieces', 'Shape determines how much edge there is, and awkward shapes have more'],
              ['Joint sand', 'Depends on joint width and paver thickness', 'Sometimes included with the pavers and sometimes not'],
              ['Waste', 'Per component, at the rate each one warrants', 'Cutting at curves, borders and diagonal layouts uses more'],
              ['Delivery', 'Per load, with a minimum on bulk material', 'Base and bedding are bulk; pavers are usually a separate delivery'],
              ['Labour and equipment', 'Excavation, compaction, screeding, laying, cutting, jointing', 'The most site-specific line: access, ground and drainage all change it'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'The base is the quiet majority',
          text: 'At typical patio base depths, the compacted base is several times the volume of the bedding sand and comparable to the pavers themselves in cost terms. A quote that lists only pavers is describing the finish, not the job.',
        },
      ],
    },
    {
      id: 'example',
      heading: 'A 12 ft × 20 ft patio priced by component',
      blocks: [
        {
          kind: 'p',
          text: 'The example below applies illustrative unit prices to the quantities the calculator produces, so the structure of the estimate is visible. Replace the prices with your own supplier and installer figures.',
        },
        { kind: 'example', id: 'paver-cost-lines' },
      ],
    },
    {
      id: 'why-different',
      heading: 'Why two quotes for the same patio differ',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Different base depth. A deeper excavation and a thicker compacted base is more material and much more labour, and the finished patio looks identical.',
            'Different subgrade work. Removing soft material, importing fill or stabilising ground are not visible in the finished job but are heavily priced.',
            'Different paver specification. Thickness, material, edge profile and colour all vary within a product family.',
            'Different edge restraint. A continuous concrete restraint, a plastic edge and a stone border are three different details with three different costs.',
            'Different waste handling. Spoil has to go somewhere, and disposal can be a line item in its own right.',
            'Different access. Barrowing material around a house takes time and time is labour.',
            'Different inclusions. Drainage, steps, transitions to lawn and joint sand may or may not be in the price.',
          ],
        },
        {
          kind: 'p',
          text: 'The practical response is to ask each quotation to describe the layer depths, the edge detail, the paver specification and what happens to the spoil. Quotes that describe those things are comparable; quotes that do not are not.',
        },
      ],
    },
    {
      id: 'checklist',
      heading: 'Comparing paver patio quotes',
      blocks: [
        {
          kind: 'checklist',
          title: 'Ask for these details from every quote',
          items: [
            'Patio area as measured, and the shape it assumes',
            'Base depth, compaction method and whether spoil removal is included',
            'Bedding sand depth and the paver thickness, with the finished level confirmed',
            'Edge restraint type and how the perimeter is measured',
            'Paver product, colour, thickness and pattern',
            'Waste allowance stated, particularly for curves, borders and diagonal layouts',
            'Delivery included or excluded, and how many loads are expected',
            'Labour as a rate or a fixed sum, and what it covers',
            'Drainage and falls, and any steps or transitions',
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
            { href: '/projects/how-to-plan-a-paver-patio', label: 'How to plan a paver patio', note: 'The layers and the planning sequence' },
            { href: '/projects/how-to-calculate-paver-materials', label: 'How to calculate paver materials', note: 'Where every quantity in a quote comes from' },
            { href: '/materials/paver-base', label: 'Paver base: purpose, depth and compaction' },
            { href: '/materials/sand', label: 'Sand: bedding, leveling and landscaping uses' },
            { href: '/costs/landscaping-project-cost', label: 'Landscaping project cost' },
            { href: '/calculators/paver-patio-calculator', label: 'Open the Paver Patio Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    paverExample({
      id: 'paver-cost-lines',
      title: '12 ft × 20 ft patio priced per paver, per cubic yard and per linear foot',
      scenario:
        'A 240 sq ft patio with 6 in × 6 in pavers, a 6 in base and 1 in of bedding sand. The example uses illustrative prices of 2.10 per paver, 45.00 per cubic yard of base, 48.00 per cubic yard of bedding sand and 6.00 per linear foot of edge restraint. These are demonstration values, not market quotes, and they are displayed in the currency selected at the top of the page.',
      conclusion:
        'The result shows cost lines rather than one number, which is the point: pavers priced by the piece, base and bedding priced by the cubic yard, restraint priced by the linear foot. That is also how to check a quote — if the base line is missing, or the edge restraint has been left out, the quote has fewer lines than the job has materials.',
      areas: [{ kind: 'rectangle', length: 12, width: 20 }],
      paverLengthIn: 6,
      paverWidthIn: 6,
      pricing: {
        perPaver: 2.1,
        base: { perCuYd: 45 },
        beddingSand: { perCuYd: 48 },
        edgingPerLinearFt: 6,
      },
    }),
  ],
  faq: [
    {
      q: 'What is the biggest cost in a paver patio?',
      a: 'It varies with the project, but the two things that most often dominate are the base material and the labour of excavation and preparation. The pavers are the visible purchase, and they are rarely the whole story. Comparing quotes means comparing the layers as well as the finish.',
    },
    {
      q: 'Are pavers more expensive than concrete?',
      a: 'This site does not publish comparative prices, because both options vary enormously with specification, area, access and labour market. What can be compared honestly is the material list: the concrete calculator and the paver calculators each produce the quantities for their own build-up, and your own quotes can be applied to both.',
    },
    {
      q: 'Why is edge restraint sometimes left out of a quote?',
      a: 'Because it is not visually obvious and it is bought by the linear foot rather than the square foot, so it is easy to overlook when quoting from an area. Leaving it out does not make the patio cheaper; it makes the patio fail later. Ask for it by name.',
    },
    {
      q: 'Does a larger patio cost less per square foot?',
      a: 'Usually the material rate improves because delivery and minimum charges spread across more area, but labour and preparation do not always scale down the same way. Access and excavation complexity often matter more than size. The calculator shows the quantities so a supplier or installer can price them for your specific site.',
    },
    {
      q: 'How much does drainage add?',
      a: 'It depends entirely on the site. A patio that can shed water to a lawn is a different project from one that needs a channel drain and a connection to a drainage system. That is a design and site question rather than a quantity one, and it belongs in the quote as a described item.',
    },
  ],
  limitations:
    'This page describes the components of a paver patio price and does not provide prices, regional estimates or quotations. It does not account for taxes, permits, spoil disposal, drainage connections or site-specific preparation. Unit prices in the worked example are illustrative entries only. Where a patio involves a slope, drainage work or a structure, obtain site-specific design advice and written quotes.',
  related: [
    { href: '/calculators/paver-patio-calculator', label: 'Paver Patio Calculator', note: 'Quantities and your own prices in one list' },
    { href: '/projects/how-to-calculate-paver-materials', label: 'Project guide: how to calculate paver materials' },
    { href: '/materials/paver-base', label: 'Material guide: paver base' },
    { href: '/materials/sand', label: 'Material guide: sand' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/projects/how-to-plan-a-paver-patio', label: 'Project guide: how to plan a paver patio' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'paver-patio-calculator',
  relatedCalculators: ['paver-calculator', 'paver-base-calculator', 'sand-calculator'],
};
