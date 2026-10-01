import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { ContentPage } from '../types';
import { deckExample } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-estimate-deck-materials',
  path: '/projects/how-to-estimate-deck-materials',
  h1: 'How to estimate deck materials',
  metaTitle: 'How to Estimate Deck Materials: Boards, Joists and Fasteners',
  metaDescription:
    'Estimate decking boards, joists, rim material and fasteners from your deck size, board dimensions and joist spacing. Material planning only, not structural design.',
  eyebrow: 'Deck material guide',
  crumb: 'How to estimate deck materials',
  lede:
    'A deck material estimate runs on four inputs: the deck size, the board width and stock length, the joist spacing, and the direction the boards run. Everything else — board rows, joist count, rim material, fasteners — follows from those. What it does not do is decide whether the deck is safe to build, which is a separate question with a separate answer.',
  keyFacts: [
    { label: 'Default board width', value: `${ENGINE_ASSUMPTIONS.deck.defaultBoardWidthIn} in` },
    { label: 'Default board length', value: `${ENGINE_ASSUMPTIONS.deck.defaultBoardLengthFt} ft` },
    { label: 'Default board gap', value: `${ENGINE_ASSUMPTIONS.deck.defaultBoardGapIn} in` },
    { label: 'Default joist spacing', value: `${ENGINE_ASSUMPTIONS.deck.defaultJoistSpacingIn} in` },
    { label: 'Fastener default', value: `${ENGINE_ASSUMPTIONS.deck.defaultFastenersPerBoardPerJoist} per board-to-joist intersection` },
    { label: 'Calculator', value: 'Deck Material Calculator' },
  ],
  sections: [
    {
      id: 'what-it-plans',
      heading: 'What this estimate covers',
      blocks: [
        {
          kind: 'p',
          text: 'The deck calculator plans the material you would buy from a lumber or building supply counter: decking boards, joists, rim joist material, optional beams and posts you specify, and fasteners. It deliberately does not invent a framing layout, because a framing layout is a structural decision.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Material planning, not structural engineering',
          text: 'This estimate does not determine safe spans, footing sizes, beam and post sizing, ledger attachment, bracing, load ratings or code compliance. Joist spacing, beam layout and post positions have to come from the actual design, local requirements and the decking product, not from a quantity calculator.',
        },
        { kind: 'diagram', id: 'deck-parts', caption: 'Boards run across joists. Beams and posts are counted only from the layout you enter.' },
      ],
    },
    {
      id: 'boards',
      heading: 'Decking boards: rows first, then pieces',
      blocks: [
        {
          kind: 'p',
          text: 'Board quantity is calculated in two stages, and understanding both makes the number easy to check by hand. First, how many rows of board are needed to cover the deck: the width being covered divided by the coverage width of one board. Second, how many stock lengths are needed per row: the run length divided by the board stock length, rounded up.',
        },
        {
          kind: 'table',
          table: {
            caption: 'How the board count is built',
            head: ['Step', 'What it uses', 'Why it matters'],
            rows: [
              ['Coverage width', 'Board width plus the gap, converted to feet', 'A 5.5 in board with a 1/8 in gap covers 0.469 ft, not 0.458 ft'],
              ['Rows required', 'Deck width ÷ coverage width, rounded up', 'Round up, because a partial row still needs a board'],
              ['Boards per row', 'Board run length ÷ board stock length, rounded up', 'Stock lengths rarely divide evenly into a deck'],
              ['Waste', 'Applied to the row count, then multiplied by boards per row', 'Waste is added as whole rows, which is how offcuts actually behave'],
            ],
          },
        },
        {
          kind: 'p',
          text: 'The board run direction changes everything. Boards running along the length of a 20 ft deck need multiple stock lengths per row; boards running across a 12 ft width may fit in one stock length per row with an offcut. Neither is automatically better, but the two quantities are completely different.',
        },
      ],
    },
    {
      id: 'joists',
      heading: 'Joists, spacing and the framing you specify',
      blocks: [
        {
          kind: 'p',
          text: 'Joist count is derived from the span the joists cross and the spacing you enter, plus one for the end. The calculator then applies waste and converts linear feet into stock pieces when you supply a stock length. Beam and post quantities are counted only from the numbers you enter, because the planner does not invent a framing plan.',
        },
        {
          kind: 'ul',
          items: [
            'Joist spacing is set by the decking product and the framing design. Composite and some synthetic boards often require closer spacing than a natural wood board of the same width.',
            'Rim joist material is calculated from the deck perimeter with waste. It is easy to forget, because it appears in neither the board count nor the joist count.',
            'Fasteners are counted per board-to-joist intersection and then given a waste allowance. Many modern systems use hidden clips with their own coverage figures, which is why the fastener line is a planning allowance rather than a parts list.',
            'Post count stays at zero unless you enter one. That is intentional: the calculator will not guess a structural layout.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Where the framing numbers come from',
          text: 'Span tables, the decking manufacturer instructions and local requirements are the sources for joist spacing, beam size and footing depth. Enter those decisions here, and the estimate turns them into material quantities.',
        },
      ],
    },
    {
      id: 'example',
      heading: 'Worked example: a 20 ft × 12 ft deck',
      blocks: [
        {
          kind: 'p',
          text: 'A 20 ft × 12 ft deck with 5.5 in boards, 16 ft board stock, a 1/8 in gap, 16 in joist spacing and 16 ft joist stock. The default 10% waste allowance applies throughout.',
        },
        { kind: 'example', id: 'deck-20x12' },
        {
          kind: 'p',
          text: 'Two lines are worth checking against your own plan. The board count assumes boards run along the 20 ft length, which is why each row needs more than one stock length. The joist count is little more than the span divided by the spacing plus one, so it changes quickly if the decking product requires tighter spacing.',
        },
      ],
    },
    {
      id: 'waste',
      heading: 'Waste on a deck behaves differently',
      blocks: [
        {
          kind: 'p',
          text: 'Deck waste is not the same as bulk-material waste. A bag of gravel that an estimator over-orders disappears into the ground. An offcut of decking is a real, visible object, and offcuts are often unusable on a deck because board ends want to land on a joist. Understanding that reframes the allowance.',
        },
        {
          kind: 'ul',
          items: [
            'Board ends have to land on framing, so a row that ends mid-span needs a cut that may leave an unusable offcut.',
            'Stair treads, picture framing and border boards add material that a simple area calculation does not see.',
            'A 10% allowance is reasonable for a simple rectangular deck with boards running one direction. Diagonal layouts and multiple direction changes justify more.',
            'Keep a couple of spare boards from the same delivery. Decking colour and grain vary between batches, and a repair years later is much easier with matching material.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Order framing and decking from the same plan',
          text: 'If the joist spacing or board direction changes, the board count changes with it. Calculate once, order once, and keep the waste allowance attached to the layout it was calculated for.',
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
            { href: '/materials/decking-materials', label: 'Decking materials compared for planning', note: 'Wood, cedar, composite and the trade-offs between them' },
            { href: '/costs/deck-cost', label: 'What drives deck cost', note: 'Framing, decking, fasteners, stairs, railing and labour' },
            { href: '/calculators/concrete-calculator', label: 'Concrete Calculator', note: 'For post footings once your layout is fixed' },
            { href: '/calculators/deck-material-calculator', label: 'Open the Deck Material Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    deckExample({
      id: 'deck-20x12',
      title: 'A 20 ft × 12 ft deck with 5.5 in boards at 16 in joist spacing',
      scenario:
        'Boards running along the 20 ft length, 16 ft board stock, a 1/8 in gap, joists at 16 in spacing with 16 ft stock, and the calculator default 10% waste allowance.',
      conclusion:
        'Three numbers are worth carrying forward. The board count is larger than the area suggests, because every row needs whole stock lengths. The joist count barely depends on the deck length in the way people expect — it comes from the span being crossed and the spacing. And the fastener count is a four-figure number, which is why hidden-clip systems are usually priced by coverage rather than by the piece.',
      deckLengthFt: 20,
      deckWidthFt: 12,
      joistStockLengthFt: 16,
    }),
  ],
  faq: [
    {
      q: 'How many decking boards do I need for a 20 × 12 deck?',
      a: 'This example returns a count in the high fifties for 5.5 in boards with a 1/8 in gap running the 20 ft length, using 16 ft stock and a 10% allowance. The count is driven by the coverage width of one board (about 5.6 in including the gap) and by how many stock lengths each row requires.',
    },
    {
      q: 'How far apart should deck joists be?',
      a: 'The planning default here is 16 in, which is common for natural wood decking. It is not a universal answer: some composite and synthetic products require 12 in spacing, and the framing design may require something different again. Use the decking manufacturer instructions and the framing design, then enter that spacing here.',
    },
    {
      q: 'Does the calculator size my beams and posts?',
      a: 'No. Beam and post quantities are only counted when you enter a count and a length yourself, and the calculator states plainly that it does not determine safe spans, footing sizes or load ratings. Framing sizing belongs to a structural design, span tables or a qualified professional.',
    },
    {
      q: 'How much waste should I allow for a deck?',
      a: 'Ten percent is a reasonable starting point for a simple rectangular deck laid in one direction. Add more for diagonal layouts, multiple direction changes, stair treads and border details, because those create cuts that cannot be reused elsewhere.',
    },
    {
      q: 'Can I mix decking products in one estimate?',
      a: 'Not in a single calculation. The estimate assumes one board width, one stock length, one gap and one joist spacing. If you are using a border board of a different width or a contrasting infill, calculate that separately with its own dimensions.',
    },
  ],
  limitations:
    'This is a material-planning estimator. It does not determine safe spans, footing sizes, beam and post sizing, ledger attachment, bracing, load ratings, fastener specification or code compliance, and it cannot tell you whether a decking product is suitable for a given application. Post and beam quantities are counted only from numbers you supply. Framing details, footing depths, attachment methods and hardware must be confirmed against the design, the manufacturer instructions and local requirements before construction.',
  related: [
    { href: '/calculators/deck-material-calculator', label: 'Deck Material Calculator', note: 'Boards, joists, rim material and fasteners from your own inputs' },
    { href: '/materials/decking-materials', label: 'Material guide: decking materials compared' },
    { href: '/costs/deck-cost', label: 'Cost guide: what drives deck cost' },
    { href: '/calculators/concrete-calculator', label: 'Concrete Calculator', note: 'Footings and pads once the layout is fixed' },
    { href: '/projects/how-to-calculate-landscaping-materials', label: 'Project guide: landscaping materials workflow' },
    { href: '/about', label: 'What this platform does and does not do' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'deck-material-calculator',
  relatedCalculators: ['concrete-calculator', 'fence-calculator', 'paver-patio-calculator'],
};
