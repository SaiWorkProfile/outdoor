import type { ContentPage } from '../types';
import { deckExample } from '../shared';

export const page: ContentPage = {
  cluster: 'costs',
  slug: 'deck-cost',
  path: '/costs/deck-cost',
  h1: 'What drives deck cost',
  metaTitle: 'Deck Cost: Framing, Decking, Fasteners, Stairs and Labour',
  metaDescription:
    'Why deck cost is usually dominated by framing and labour rather than by the decking surface, and how stairs, railing, fixings and waste change the total.',
  eyebrow: 'Cost guide',
  crumb: 'Deck cost',
  lede:
    'Deck cost is usually framed around the decking boards because that is the part you see. In practice the framing, footings, fixings and labour are often the larger share, and the surface is the smallest of the visible decisions. This page explains the structure of a deck price and where it can move.',
  keyFacts: [
    { label: 'Components', value: 'Framing, decking, fixings, stairs, railing, labour' },
    { label: 'Seldom itemised', value: 'Footings and framing material' },
    { label: 'Recurring cost', value: 'Finishing, on natural materials' },
    { label: 'Most variable', value: 'Height, access and ground conditions' },
    { label: 'Prices here', value: 'Only the ones you enter' },
    { label: 'Calculator', value: 'Deck Material Calculator' },
  ],
  sections: [
    {
      id: 'structure',
      heading: 'The structure of a deck price',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'What a deck price contains',
            head: ['Component', 'Why it is a line item', 'What makes it vary'],
            rows: [
              ['Footings and posts', 'The deck has to be supported on something', 'Ground conditions, height above grade and the design requirements'],
              ['Beams and framing', 'The structure under the boards', 'Span layout, joist spacing required by the decking product, and framing material'],
              ['Decking boards', 'The visible walking surface', 'Material, width, grade and pattern'],
              ['Fixings', 'Hidden clips, screws or brackets, at every intersection', 'System choice, and whether clips are priced by coverage'],
              ['Stairs', 'A separate structure with its own framing and treads', 'Rise, width, number of steps and whether landings are needed'],
              ['Railing', 'A safety and boundary element with its own posts and infill', 'Length, height, material and whether the design requires a specific system'],
              ['Finishing', 'Staining, sealing or coating, on natural materials', 'Product choice and how often it has to be redone'],
              ['Labour and equipment', 'Digging, framing, laying, fixing and finishing', 'Access, ground, height and how much has to be done by hand'],
              ['Waste', 'Offcuts that cannot be reused because board ends land on framing', 'Layout complexity, diagonals and border details'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Framing and footings are design decisions',
          text: 'How a deck is supported, and how its framing is sized and spaced, is a structural design question. It affects the cost substantially, and it cannot be answered by a quantity calculator. The figures belong with whoever is responsible for the design and with local requirements.',
        },
      ],
    },
    {
      id: 'example',
      heading: 'A 20 ft × 12 ft deck priced by component',
      blocks: [
        {
          kind: 'p',
          text: 'The example below applies illustrative prices to the quantities the deck calculator produces, so the relative size of each line is visible. Replace the prices with your own supplier figures.',
        },
        { kind: 'example', id: 'deck-cost-lines' },
      ],
    },
    {
      id: 'what-moves-it',
      heading: 'What moves a deck price the most',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Height above grade. A low deck on firm ground is a different project from a raised deck with longer posts, deeper footings and more framing.',
            'Ground conditions for the footings. Clay, rock, fill and slope all change how much work the support system requires.',
            'Decking product and width. Narrower boards mean more linear feet, more fixings and often tighter joist spacing, which adds framing material too.',
            'Railing. Where a deck is above a certain height, railing is usually required, and it is a separate structure with its own posts and infill.',
            'Stairs. Each step is its own small structure, and a long flight with a landing adds materially to both labour and material.',
            'Access. Bringing long framing material and boards to the back of a property by hand is slow work.',
            'Finishing. On natural materials, the recurring cost of re-finishing belongs in the budget alongside the initial application.',
          ],
        },
        {
          kind: 'p',
          text: 'The pattern is that decisions about structure and site tend to dominate, while the visible surface is comparatively small. That is the opposite of how decks are usually discussed, and it is worth remembering when a quote seems high for the boards you chose.',
        },
      ],
    },
    {
      id: 'comparing',
      heading: 'Comparing deck quotes',
      blocks: [
        {
          kind: 'checklist',
          title: 'What every deck quote should state',
          items: [
            'Deck size, height above grade and shape',
            'Footing type and depth, and how many are needed',
            'Framing specification, joist spacing and the framing material',
            'Decking product, board width, length and pattern',
            'Fixing system, named, and whether clips are priced by coverage',
            'Railing included or excluded, and to what height and specification',
            'Stairs included or excluded, with a step count',
            'Finishing included or excluded, and which product',
            'Waste and offcuts included, or explicitly the customer’s risk',
            'Labour and equipment, and what the figure covers',
            'Permits, engineering or inspection fees, if any apply',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Ask about the posts and footings first',
          text: 'They are the least visible part of a deck and one of the hardest to change later. A quote that names a footing type and a framing specification is far more comparable than one that lists only boards and labour.',
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
            { href: '/projects/how-to-estimate-deck-materials', label: 'How to estimate deck materials', note: 'Where the quantities in a deck quote come from' },
            { href: '/materials/decking-materials', label: 'Decking materials compared for planning' },
            { href: '/costs/landscaping-project-cost', label: 'Landscaping project cost' },
            { href: '/calculators/deck-material-calculator', label: 'Open the Deck Material Calculator' },
            { href: '/calculators/concrete-calculator', label: 'Open the Concrete Calculator', note: 'For footings once the layout is fixed' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    deckExample({
      id: 'deck-cost-lines',
      title: '20 ft × 12 ft deck priced per board, per joist piece and per fastener',
      scenario:
        'The same deck as the material example: 5.5 in boards at 16 ft stock laid along the length, joists at 16 in spacing with 16 ft stock, and the default 10% waste. Illustrative prices of 28.00 per board, 18.00 per joist piece, 0.35 per fastener and 14.00 per linear foot of rim joist are applied; the page renders them in whichever currency you select in the header and never converts them. Replace them with your own quotes.',
      conclusion:
        'The relative sizes are the useful part. Fasteners are a small unit price but a large count, so they add up; joists are fewer pieces at a higher price; decking is the largest single line here but not by the margin people expect. What this estimate deliberately does not contain is footings, beams, railing, stairs or labour — the items that typically dominate a real deck price. Those belong in a written quote against a stated design.',
      deckLengthFt: 20,
      deckWidthFt: 12,
      joistStockLengthFt: 16,
      pricing: {
        deckingPerBoard: 28,
        joistPerPiece: 18,
        fastenerPerEach: 0.35,
        rimJoistPerLinearFt: 14,
      },
    }),
  ],
  faq: [
    {
      q: 'How much does a deck cost per square foot?',
      a: 'This site does not publish that figure, because a deck price depends on height above grade, footing conditions, framing specification, railing and stairs far more than on area. Two decks of the same size on the same street can differ substantially if one is at ground level and the other is raised with a full railing and stair flight.',
    },
    {
      q: 'Is decking or framing the bigger cost?',
      a: 'It depends on the design, but framing, footings and labour together are often the larger share, particularly on a raised deck. The decking is the visible surface and the most discussed choice, which is why it can feel like it should dominate the budget when it does not.',
    },
    {
      q: 'Do hidden fasteners cost more than screws?',
      a: 'Clipped systems are usually priced by coverage rather than by the piece, and they carry a premium over loose screws. They also change the look of the surface, which is often the reason they are chosen. Compare them as systems rather than as fasteners: a clip system may also require a specific board groove or gap.',
    },
    {
      q: 'Should I budget for railing and stairs separately?',
      a: 'Yes. They are separate structures with their own material and labour, and both are frequently excluded from informal estimates. Ask whether they are included, and at what specification, before comparing totals.',
    },
    {
      q: 'Does the calculator include labour?',
      a: 'No. It estimates material quantities from your inputs and applies your own material prices. Labour, equipment and site work are entered separately, which is deliberate: those costs depend on the site, the design and the local market rather than on the material list.',
    },
  ],
  limitations:
    'This page explains the structure of a deck price. It does not provide prices or regional estimates, and it makes no claim about what a deck should cost. Footings, framing sizing, railing requirements and attachment details are structural and code matters that must be determined by a qualified professional and local requirements. Material prices in the worked example are illustrative entries only. Obtain written quotes against a specified design.',
  related: [
    { href: '/calculators/deck-material-calculator', label: 'Deck Material Calculator', note: 'Board, joist and fastener quantities, with your own prices' },
    { href: '/projects/how-to-estimate-deck-materials', label: 'Project guide: how to estimate deck materials' },
    { href: '/materials/decking-materials', label: 'Material guide: decking materials compared' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/projects/outdoor-project-cost-planning', label: 'Project guide: outdoor project cost planning' },
    { href: '/calculators/concrete-calculator', label: 'Concrete Calculator' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'deck-material-calculator',
  relatedCalculators: ['concrete-calculator', 'fence-cost-calculator', 'paver-patio-calculator'],
};
