import type { ContentPage } from '../types';
import { deckExample } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'decking-materials',
  path: '/materials/decking-materials',
  h1: 'Decking materials compared for planning',
  metaTitle: 'Decking Materials Compared: Wood, Cedar, Composite and More',
  metaDescription:
    'How pressure-treated wood, cedar, composite and other decking differ in board dimensions, joist requirements, maintenance, waste and cost.',
  eyebrow: 'Material reference',
  crumb: 'Decking materials',
  lede:
    'Decking materials differ in how they are made, how they behave outdoors, and what the framing beneath them has to do. The planning consequences are concrete: board width and stock length drive the count, joist spacing is often set by the decking product, and waste behaves differently. What this page will not do is declare a winner.',
  keyFacts: [
    { label: 'Common choices', value: 'Pressure-treated wood, cedar, composite' },
    { label: 'Board width', value: 'Commonly 5.5 in, with narrower and wider options' },
    { label: 'Board gap', value: 'Usually 1/8 in, but product-specific' },
    { label: 'Joist spacing', value: 'Set by the decking product, commonly 16 in or tighter' },
    { label: 'Waste', value: 'Higher on diagonals, stairs and border details' },
    { label: 'Calculator', value: 'Deck Material Calculator' },
  ],
  sections: [
    {
      id: 'options',
      heading: 'The main choices',
      blocks: [
        {
          kind: 'p',
          text: 'Decking falls into two broad groups: wood, which is sawn and finishes naturally, and manufactured boards, which are extruded or formed to a profile. Within each group there is a wide spread of product quality, price and behaviour.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Common decking materials and their planning characteristics',
            head: ['Material', 'What it is', 'Maintenance character', 'Planning considerations'],
            rows: [
              ['Pressure-treated wood', 'Softwood treated for outdoor exposure', 'Usually finished periodically; boards can be individually replaced', 'Boards move with moisture, so gaps and fixing details matter; span requirements come from the product and the framing design'],
              ['Cedar', 'Naturally durable softwood, often left to weather', 'Left to silver naturally, or finished; individual boards replaceable', 'Softer surface than many alternatives; board widths and lengths are set by the sawmill'],
              ['Composite', 'Wood fibre and plastic, formed into boards', 'No refinishing; cleaned rather than treated', 'Often requires tighter joist spacing than wood of the same width, and expansion details are product-specific'],
              ['Capped composite', 'A composite core with a protective outer layer', 'Cleaned rather than refinished', 'Same planning questions as composite, with product-specific installation instructions'],
              ['Aluminium and other metal', 'Extruded boards with a finish', 'Cleaned; touch-up rather than refinishing', 'Systems are manufacturer-specific and usually come with their own clips and spacing rules'],
            ],
            note: 'No material here is universally best. The right choice depends on budget, maintenance appetite, climate, how the deck is used and how it looks against the building.',
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'The decking product sets several of the numbers',
          text: 'Joist spacing, board gap, clip type and end-fixing requirements normally come from the decking manufacturer. The calculator accepts those as inputs rather than assuming them, which is why the framing decisions should be made before the quantity is calculated.',
        },
      ],
    },
    {
      id: 'board-dimensions',
      heading: 'Board dimensions and why they matter so much',
      blocks: [
        {
          kind: 'p',
          text: 'The board count is driven by the coverage width of one board: the board width plus the gap. That means small differences in nominal board size translate into visible differences in the count, and narrow boards need more of them for the same deck.',
        },
        {
          kind: 'table',
          table: {
            caption: 'How board choice affects the count',
            head: ['Board width', 'Coverage with a 1/8 in gap', 'Effect on the design'],
            rows: [
              ['5.5 in', 'About 5.6 in', 'The common default; fewer rows for a given width'],
              ['3.5 in', 'About 3.6 in', 'More rows and more fixing points for the same area'],
              ['7.25 in', 'About 7.4 in', 'Fewer rows, but the product may require different joist spacing'],
            ],
            note: 'Nominal sizes versus actual sizes vary by product and by material. Use the actual dimensions from the product data.',
          },
        },
        { kind: 'example', id: 'decking-narrow-boards' },
      ],
    },
    {
      id: 'waste',
      heading: 'Waste behaves differently on a deck',
      blocks: [
        {
          kind: 'p',
          text: 'Decking waste is not like bulk-material waste. An offcut of board is a visible object with a real cost, and board ends are usually cut to land on a joist, so many offcuts cannot be used elsewhere on the same deck. That makes the waste allowance a design question as much as a margin.',
        },
        {
          kind: 'ul',
          items: [
            'Boards laid diagonally use noticeably more material than boards laid square, because every board is cut at the perimeter.',
            'Stairs, picture framing and border details add material that an area calculation does not see.',
            'A board stock length that divides badly into the run length can leave a short offcut on every single row.',
            'Damaged or warped boards are a real risk with natural materials, which is another reason to keep a spare or two.',
          ],
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Keep spares from the same batch',
          text: 'Colour and grain vary between batches, and a repair years later is much easier with matching material. Keeping two or three boards aside is cheaper than replacing a section.',
        },
      ],
    },
    {
      id: 'cost-factors',
      heading: 'Cost factors without inventing prices',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'What moves the cost of a deck, independent of region',
            head: ['Factor', 'Why it moves the cost'],
            rows: [
              ['Board type and grade', 'Within any material family there is a wide spread from utility grade to premium'],
              ['Board coverage width', 'A narrower board means more linear feet for the same area, and more fixings'],
              ['Joist spacing', 'Tighter spacing means more framing material and more fasteners'],
              ['Framing material', 'Beams, posts and footings are usually the unseen majority of the material cost'],
              ['Fixings and clips', 'Hidden clip systems are priced by coverage and can be a significant line'],
              ['Layout complexity', 'Diagonals, borders, stairs and multiple levels all increase cutting and waste'],
              ['Finishing', 'Staining, sealing or coating a natural product is a recurring cost as well as an initial one'],
            ],
          },
        },
        {
          kind: 'p',
          text: 'Because these factors interact, comparing two decking quotes means comparing board width, joist spacing, framing and fixings at the same time. The Deck Cost Calculator applies your own prices to the quantities this planner produces, so a comparison is made on the same layout.',
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
            { href: '/projects/how-to-estimate-deck-materials', label: 'How to estimate deck materials', note: 'Boards, joists, rim material and fasteners' },
            { href: '/costs/deck-cost', label: 'What drives deck cost' },
            { href: '/calculators/deck-material-calculator', label: 'Open the Deck Material Calculator' },
            { href: '/calculators/concrete-calculator', label: 'Open the Concrete Calculator', note: 'For footings once the layout is decided' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    deckExample({
      id: 'decking-narrow-boards',
      title: 'A 16 ft × 12 ft deck with narrow boards and tighter joist spacing',
      scenario:
        'Boards 3.5 in wide and 12 ft long, laid along the 16 ft length, with joists at 12 in spacing and 12 ft stock. Waste is the default 10%.',
      conclusion:
        'Compare the row count and fastener count with a wider board at 16 in spacing and the difference is immediately visible: a narrower board means more rows, more linear feet and more fixing points, and tighter joist spacing adds framing material as well. That interaction is why decking choice cannot be compared on board price alone.',
      deckLengthFt: 16,
      deckWidthFt: 12,
      deckingBoardWidthIn: 3.5,
      deckingBoardLengthFt: 12,
      joistSpacingIn: 12,
      joistStockLengthFt: 12,
    }),
  ],
  faq: [
    {
      q: 'Which decking material is best?',
      a: 'There is no universal answer. Natural wood can be refinished and repaired board by board, manufactured boards need less ongoing work but come with product-specific installation rules, and both have a wide spread of quality and price within them. The right choice depends on budget, maintenance appetite, climate and appearance.',
    },
    {
      q: 'Do composite boards need different joist spacing?',
      a: 'Often yes. Many composite and synthetic boards require tighter joist spacing than a natural wood board of the same width, and the figure comes from the manufacturer’s installation instructions. The calculator takes the spacing as an input, so use the product figure rather than a default.',
    },
    {
      q: 'How much waste should I allow for decking?',
      a: 'Ten percent is a reasonable starting point for a simple rectangular deck laid square in one direction. Diagonal layouts, borders, stairs and multiple direction changes justify more, because the cuts they create cannot be reused elsewhere.',
    },
    {
      q: 'How wide should the gap between deck boards be?',
      a: 'A 1/8 in gap is a common default, but the product decides: some systems specify their own gap so that hidden clips fit, and some materials move more with temperature and moisture than others. Use the manufacturer figure where one is published.',
    },
    {
      q: 'Does the decking material change the framing?',
      a: 'It can. Joist spacing, fixing method and end-fixing requirements come from the decking product, and those affect how much framing material is needed. The framing itself still has to be designed — the calculator counts the material you specify and does not size beams, posts or footings.',
    },
  ],
  limitations:
    'This page compares planning characteristics and does not recommend any product. It makes no durability, service life or performance claim, and it cannot account for climate, exposure, local requirements or product-specific installation rules. Decking manufacturers publish their own joist spacing, gap, fixing and ventilation requirements, and those take precedence over any default used here. Framing design, footings and attachment details are outside the scope of this material guide.',
  related: [
    { href: '/calculators/deck-material-calculator', label: 'Deck Material Calculator', note: 'Boards, joists, rim material and fasteners' },
    { href: '/projects/how-to-estimate-deck-materials', label: 'Project guide: how to estimate deck materials' },
    { href: '/costs/deck-cost', label: 'Cost guide: what drives deck cost' },
    { href: '/materials/fence-materials', label: 'Material guide: fence materials compared', note: 'A similar planning comparison for boundary fences' },
    { href: '/calculators/concrete-calculator', label: 'Concrete Calculator' },
    { href: '/about', label: 'What this platform does and does not do' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'deck-material-calculator',
  relatedCalculators: ['concrete-calculator', 'fence-calculator', 'paver-patio-calculator'],
};
