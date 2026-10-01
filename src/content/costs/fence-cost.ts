import type { ContentPage } from '../types';
import { fenceCostExample } from '../shared';

export const page: ContentPage = {
  cluster: 'costs',
  slug: 'fence-cost',
  path: '/costs/fence-cost',
  h1: 'What a fence estimate is made of',
  metaTitle: 'Fence Cost: Posts, Rails, Infill, Concrete, Gates and Labour',
  metaDescription:
    'Break a fence estimate into posts, rails, pickets or panels, concrete, gates, hardware, waste and labour, and compare quotes on the same scope.',
  eyebrow: 'Cost guide',
  crumb: 'Fence cost',
  lede:
    'A fence estimate is a component list with prices attached. Understanding the components is what makes quotes comparable, because two installers can quote very different totals for the same boundary simply by including different things. This page breaks the list down, and the Fence Cost Calculator applies your own prices to it.',
  keyFacts: [
    { label: 'Components', value: 'Posts, rails, infill, concrete, hardware, gates' },
    { label: 'Labour', value: 'Often quoted per linear foot or as a flat sum' },
    { label: 'Waste', value: 'Applies per component, not as one margin' },
    { label: 'Biggest variable', value: 'Access, ground conditions and the fence system' },
    { label: 'Prices here', value: 'Only the ones you enter' },
    { label: 'Calculator', value: 'Fence Cost Calculator' },
  ],
  sections: [
    {
      id: 'breakdown',
      heading: 'The components, and why each one is its own line',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'What belongs in a fence estimate',
            head: ['Component', 'Counted from', 'Why it is priced separately'],
            rows: [
              ['Posts', 'Post layout: net run, spacing, corners, ends and gates', 'Post type and length differ between line, corner and gate posts'],
              ['Rails', 'Net run × rails per section, in stock lengths', 'Rail stock lengths and grades vary, and offcuts are unavoidable'],
              ['Pickets or panels', 'Picket count, panel count or linear feet of mesh', 'This is where the fence system choice is most visible in the price'],
              ['Post-hole concrete', 'Hole volume × post count', 'It is a real purchase and a real labour item, easily forgotten'],
              ['Hardware', 'System-specific fasteners, brackets and clips', 'Hidden clip systems are priced by coverage rather than by the piece'],
              ['Gates', 'Number of gates, plus two posts and a hardware set each', 'A gate is a separate assembly with its own hardware and bracing'],
              ['Waste', 'Per component, at the rate each one warrants', 'A cut picket and an offcut rail are different losses'],
              ['Labour', 'Per linear foot, per day or as a fixed sum', 'Includes digging, setting, fixing and clean-up, which vary enormously with ground'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Ground conditions are the invisible line',
          text: 'Digging post holes through compacted gravel, tree roots or rocky ground takes far longer than through soft soil. That cost shows up in the labour figure, which is why two sites can get very different quotes for the same fence.',
        },
      ],
    },
    {
      id: 'example',
      heading: 'The same 100 ft fence, priced line by line',
      blocks: [
        {
          kind: 'p',
          text: 'The calculator applies your prices to the quantity it calculated. The example below uses illustrative unit prices and an illustrative labour rate so the structure of the estimate is visible; the numbers are yours to replace.',
        },
        { kind: 'example', id: 'fence-cost-lines' },
      ],
    },
    {
      id: 'comparing',
      heading: 'Comparing fence quotes on the same scope',
      blocks: [
        {
          kind: 'p',
          text: 'Two fence quotes for the same boundary are only comparable when the layout, the components and the inclusions are the same. Most of the difference between quotes is scope rather than price, and a short checklist catches it.',
        },
        {
          kind: 'checklist',
          title: 'Comparing two fence quotes',
          items: [
            'Same fence length, height and layout, including every gate opening',
            'Same post spacing, or an explanation of why they differ',
            'Same fence system and product, down to panel or picket width',
            'Post length and hole depth stated, since these drive concrete and labour',
            'Concrete included, rather than “materials” with an assumed exclusion',
            'Gate hardware listed by name, and whether it is a matching set',
            'Waste and breakage included, or explicitly the customer’s risk',
            'Site clearance, spoil removal and old fence disposal either included or listed separately',
            'Labour stated per linear foot, per day or fixed, and what it covers',
            'Lead time, and whether the price is held for that period',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'A price that looks too low is usually a scope difference',
          text: 'The common omissions are concrete, gate hardware, spoil removal and disposal of an old fence. Ask what is not included, and the quotes will become comparable quickly.',
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
            { href: '/calculators/fence-cost-calculator', label: 'Fence Cost Calculator', note: 'Apply your own per-component prices and labour rate' },
            { href: '/projects/how-to-calculate-fence-materials', label: 'A complete 100 ft fence take-off', note: 'Where the quantities in a quote come from' },
            { href: '/materials/fence-materials', label: 'Fence materials compared for planning' },
            { href: '/projects/how-to-plan-a-fence', label: 'How to plan a fence' },
            { href: '/calculators/fence-calculator', label: 'Fence Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    fenceCostExample({
      id: 'fence-cost-lines',
      title: 'A 100 ft wood fence with one gate, priced line by line',
      scenario:
        'The same layout as the fence take-off example: 100 ft at 6 ft high, one corner, two ends, one 4 ft gate and 8 ft post spacing. The unit prices and the labour rate are illustrative entries used to show how the calculator builds a total; they are not market quotes.',
      conclusion:
        'The line structure is the useful part. Every component appears with the basis it was priced on — per post, per rail piece, per picket, per cubic yard of concrete, per hardware unit, per gate — plus labour. The completeness line matters as much as the total: if any component has no price, the calculator says so rather than treating it as zero.',
      fenceLengthFt: 100,
      heightFt: 6,
      fenceType: 'wood-picket',
      postSpacingFt: 8,
      cornerCount: 1,
      endCount: 2,
      gateCount: 1,
      gateWidthFt: 4,
      pricing: {
        postPrice: 22,
        railPricePerPiece: 12,
        picketPrice: 3.2,
        concretePricePerCuYd: 180,
        hardwarePricePerUnit: 0.35,
        gatePrice: 120,
        laborPerLinearFt: 18,
      },
    }),
  ],
  faq: [
    {
      q: 'How much does a fence cost per foot?',
      a: 'This site does not publish a per-foot figure, because the number depends on the fence system, the height, the post spacing, the ground, access and the local labour market. What can be done is to estimate the components: the calculator produces the quantities and applies whatever prices you have, and dividing the total by the fence length gives your own project’s figure.',
    },
    {
      q: 'Is labour usually a large part of a fence quote?',
      a: 'Often it is a significant share, particularly where post holes have to be dug through difficult ground. Labour also includes setting posts, fixing the infill, hanging gates and clearing up. Whether a contractor quotes per linear foot or as a fixed sum, it is worth asking what the figure covers.',
    },
    {
      q: 'Why does post-hole concrete appear as its own cost line?',
      a: 'Because it is a real material purchase that scales with post count and hole size, and because it is a common omission from informal quotes. The calculator counts the posts, computes the hole volume and applies your concrete price to it.',
    },
    {
      q: 'Should I price the gate separately from the fence?',
      a: 'Yes. A gate is an assembly rather than a length of fence: it has two posts, a leaf, hinges and a latch, and it usually costs more per foot than the run beside it. The calculator treats gates separately and adds a hardware set per gate.',
    },
    {
      q: 'The total says the estimate is incomplete. What does that mean?',
      a: 'It means at least one component or the labour rate has no price entered. The calculator leaves that gap visible on purpose, because a total that silently treats an unpriced component as free is worse than no total at all.',
    },
  ],
  limitations:
    'This page explains the structure of a fence estimate. It does not provide prices, does not account for taxes, permits, spoil removal, disposal charges or access restrictions, and makes no claim about what any particular fence system or installation should cost. Unit prices and labour rates in the worked example are illustrative entries only. Obtain written quotes for the scope you are actually buying.',
  related: [
    { href: '/calculators/fence-cost-calculator', label: 'Fence Cost Calculator', note: 'Per-component prices, labour and a completeness check' },
    { href: '/projects/how-to-calculate-fence-materials', label: 'Project guide: a complete fence take-off' },
    { href: '/materials/fence-materials', label: 'Material guide: fence materials compared' },
    { href: '/projects/how-to-plan-a-fence', label: 'Project guide: how to plan a fence' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/calculators/fence-post-calculator', label: 'Fence Post Calculator' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'fence-cost-calculator',
  relatedCalculators: ['fence-calculator', 'fence-post-calculator', 'concrete-calculator'],
};
