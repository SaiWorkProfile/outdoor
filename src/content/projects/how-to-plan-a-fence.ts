import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { ContentPage } from '../types';
import { fencePostExample } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-plan-a-fence',
  path: '/projects/how-to-plan-a-fence',
  h1: 'How to plan a fence',
  metaTitle: 'How to Plan a Fence: Layout, Post Spacing, Height and Gates',
  metaDescription:
    'Plan a fence before buying material: measure the run, mark corners and ends, size the gates, choose post spacing and height, and check slopes and boundaries.',
  eyebrow: 'Fence project guide',
  crumb: 'How to plan a fence',
  lede:
    'Planning a fence is mostly sequencing. Measure the run, decide where gates go, choose post spacing, decide height, then pick a fence type — because each of those decisions changes the material list. The post count in particular depends on corners, ends and gates rather than on length alone.',
  keyFacts: [
    { label: 'Default post spacing', value: `${ENGINE_ASSUMPTIONS.fence.defaultPostSpacingFt} ft` },
    { label: 'Gate posts', value: `${ENGINE_ASSUMPTIONS.fence.gateHardwareSetsPerGate * 2} per gate, counted separately` },
    { label: 'Posts per hole', value: 'One, set in concrete' },
    { label: 'Rails', value: `${ENGINE_ASSUMPTIONS.fence.defaultRailsForUpTo6Ft} for fences up to 6 ft, ${ENGINE_ASSUMPTIONS.fence.defaultRailsAbove6Ft} above` },
    { label: 'Height warning', value: `Above ${ENGINE_ASSUMPTIONS.fence.heightWarningFt} ft may need more review` },
    { label: 'Calculators', value: 'Fence Calculator and Fence Post Calculator' },
  ],
  sections: [
    {
      id: 'sequence',
      heading: 'Plan in this order, not the other way round',
      blocks: [
        {
          kind: 'p',
          text: 'Most fence projects that go wrong were planned in the wrong order: a material list was produced before the layout existed. Building the layout first means every quantity has a reason attached to it.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Confirm where the fence can go',
              body: 'Check the property line, any setback rules, easements and whether a fence of the height you want is permitted. This is a legal and administrative step, and it comes before any measurement.',
            },
            {
              title: 'Walk the run and mark the turning points',
              body: 'Mark every corner, every end and every gate opening on the ground. The marks become the layout the material list is built from.',
            },
            {
              title: 'Split the run into straight sections',
              body: 'A fence with two corners is three runs, each with its own length. That is how the post count should be calculated, because each run has its own end or corner positions.',
            },
            {
              title: 'Choose post spacing and height',
              body: 'Spacing is usually set by the fence system or by the panel width. Height is usually set by purpose, and above a certain height the requirements can change.',
            },
            {
              title: 'Choose the fence type',
              body: 'Wood, vinyl, composite, chain-link and metal systems fill the same line with different components. This decision changes the shopping list more than any other.',
            },
            {
              title: 'Calculate, then price',
              body: 'Posts first because they are the fixed points, then rails, then the infill, then concrete and hardware. Pricing comes last, from real quotes.',
            },
          ],
        },
      ],
    },
    {
      id: 'measure',
      heading: 'Measuring a fence line',
      blocks: [
        {
          kind: 'p',
          text: 'Fence length is measured along the ground, following the line the fence will take, not along the property boundary on a plan. On level ground the two agree. On a slope they do not, and the difference decides how much rail and infill you need.',
        },
        { kind: 'diagram', id: 'fence-components', caption: 'Posts, rails, infill and gate openings are counted from the same layout.' },
        {
          kind: 'ul',
          items: [
            'Measure each straight run separately, corner to corner, and write the number down before moving the tape.',
            'Measure gate openings last, and measure the opening you want — not the gate leaf size. A gate needs clearance and hardware space.',
            'Record the slope of each run. A run that drops steadily may need stepping, packing or shorter panels to keep the fence looking level.',
            'If the fence turns at a fixed object such as a wall or a building, measure from the corner post position, not from the face of the wall.',
          ],
        },
      ],
    },
    {
      id: 'posts',
      heading: 'Corners, ends and gates: where post counts really come from',
      blocks: [
        {
          kind: 'p',
          text: 'A post count is not total length divided by spacing. Gate openings are removed from the run first, then positions are estimated along what is left, and gate posts are added separately — twice per gate. Corners and ends are positions within that estimated layout, not extra posts on top of it.',
        },
        { kind: 'example', id: 'fence-posts' },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Do not double count the same post',
          text: 'A corner that also carries a gate is one physical post carrying two roles. The calculator removes gate openings before estimating positions and counts gate posts separately, which is why the guidance in the result warns against entering the same post twice.',
        },
      ],
    },
    {
      id: 'spacing-height',
      heading: 'Post spacing, height and slopes',
      blocks: [
        {
          kind: 'p',
          text: 'Post spacing is a compromise between cost and stiffness: wider spacing uses fewer posts but puts more load on each post and on the rails. Panel systems effectively fix the spacing at the panel width, and the calculator accepts that width as an input. For a built-up fence, spacing is a decision you make.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Decisions that change the material list',
            head: ['Decision', 'Effect on quantities', 'What to check'],
            rows: [
              ['Wider post spacing', 'Fewer posts and less concrete, longer rail span per post', 'The fence system or a structural reference for the span you intend'],
              ['Taller fence', 'More rail, more infill and more post above ground', 'Whether additional engineering, permits or bracing are required'],
              ['More gates', 'Two extra posts and a hardware set per gate, minus the run they replace', 'Gate opening width, leaf weight and how the gate is supported'],
              ['Stepped or raked panels', 'Same material, more cutting and more waste', 'How the system is designed to follow a slope'],
              ['Steeper ground', 'Deeper or wider post holes, more concrete, more labour', 'How far down the line the ground stays workable'],
            ],
          },
        },
        {
          kind: 'p',
          text: 'Slopes deserve a specific mention, because they are where a fence stops looking like a picture. Most systems handle a slope in one of two ways: stepping, where each panel sits level and the height changes at every post, or racking, where panels follow the gradient. Stepping uses more material at the low end of a run and leaves visible gaps at the high end unless it is detailed carefully.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Fence height is not only a design choice',
          text: 'Height affects wind load, post embedment and sometimes local rules. The calculator warns above a certain height because a taller fence may need more than a material list can express. Check local requirements, and where the fence is exposed or tall, have the details reviewed.',
        },
      ],
    },
    {
      id: 'type',
      heading: 'Choosing the fence type before you calculate',
      blocks: [
        {
          kind: 'p',
          text: 'The calculator models common systems differently: picket and panel fences are counted by picket or panel, chain-link is counted in linear feet of mesh, and every type gets posts, rails, concrete and a hardware allowance. Choosing the type first means one calculation instead of three.',
        },
        {
          kind: 'table',
          table: {
            caption: 'How each fence type is counted',
            head: ['Fence type', 'Infill counted as', 'Extra components flagged'],
            rows: [
              ['Wood picket', 'Individual pickets at the width and spacing you enter', 'Rails, fasteners, gate hardware'],
              ['Privacy panel', 'Panels at the width you enter', 'Rails, fasteners, gate hardware'],
              ['Vinyl panel', 'Panels at the width you enter', 'Rails, fasteners, gate hardware'],
              ['Composite panel', 'Panels at the width you enter', 'Rails, fasteners, gate hardware'],
              ['Chain-link', 'Linear feet of mesh', 'The result notes that terminal, tension and tie components are system-specific'],
              ['Custom', 'Nothing is assumed', 'You supply the component quantities'],
            ],
          },
        },
      ],
    },
    {
      id: 'checklist',
      heading: 'Fence planning checklist',
      blocks: [
        {
          kind: 'checklist',
          title: 'Before ordering fence material',
          items: [
            'Layout marked on the ground, with every corner, end and gate opening identified',
            'Each straight run measured separately, with its slope noted',
            'Gate openings sized, with gate posts allowed for separately',
            'Post spacing decided and written down next to each run',
            'Height decided, with local requirements checked if it is unusually tall',
            'Fence type chosen, so posts, rails and infill are counted as one system',
            'Post-hole diameter and depth decided, and a concrete quantity calculated',
            'Hardware list checked against the actual fence system, not just the default',
            'Property line, setbacks and any shared-boundary agreement confirmed',
          ],
        },
        {
          kind: 'p',
          text: 'The last item is not a formality. Fence disputes are usually about position rather than material, and moving a fence after it is built costs far more than checking the line beforehand.',
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
            { href: '/projects/how-to-calculate-fence-materials', label: 'A complete fence take-off: 100 ft with a gate', note: 'Every component, counted and listed' },
            { href: '/materials/fence-materials', label: 'Fence materials compared for planning', note: 'How wood, vinyl, chain-link, composite and metal differ' },
            { href: '/costs/fence-cost', label: 'What a fence estimate is made of', note: 'Posts, rails, infill, concrete, gates, hardware and labour' },
            { href: '/calculators/fence-calculator', label: 'Open the Fence Calculator' },
            { href: '/calculators/fence-post-calculator', label: 'Open the Fence Post Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    fencePostExample({
      id: 'fence-posts',
      title: 'Post layout for a 100 ft fence with one 4 ft gate',
      scenario:
        'A 100 ft run with one corner, two ends, a single 4 ft gate and the calculator default 8 ft post spacing.',
      conclusion:
        'The gate opening is the telling part of this result. Four feet of opening removes a length of run but adds two gate posts, so the total post count is not simply length divided by spacing. Sketch the corners and the gate before setting posts, and treat the estimated positions as positions to check on the ground.',
      fenceLengthFt: 100,
      postSpacingFt: 8,
      cornerCount: 1,
      endCount: 2,
      gateCount: 1,
      gateWidthFt: 4,
    }),
  ],
  faq: [
    {
      q: 'How far apart should fence posts be?',
      a: 'Eight feet is the planning default used here because it matches many common panel widths. Wider spacing uses less material but increases the span each rail carries and the load on each post. The right number for your fence depends on the system and the exposure, so confirm it with the fence manufacturer or supplier.',
    },
    {
      q: 'Do I need a post at both sides of a gate?',
      a: 'Yes. A gate needs a post on each side to carry the hinge and latch and to hold the opening rigid. The calculator counts two gate posts per gate, which is why adding a gate increases the post count even though it reduces the fence run.',
    },
    {
      q: 'How do I count posts at a corner?',
      a: 'A corner is one physical post that belongs to two runs. Rather than counting it twice, enter the corner count and let the calculator allocate it within the estimated post positions. Double-counting corners is the most common cause of an over-ordered post list.',
    },
    {
      q: 'What fence height triggers extra requirements?',
      a: 'This site warns above 8 ft, because taller fences attract more wind load and are more likely to need additional engineering, permitting or material requirements. Many local rules limit fence height for exactly those reasons, so check locally before committing to a height.',
    },
    {
      q: 'Does the calculator handle a fence on a slope?',
      a: 'It calculates quantities from the length and spacing you enter, so it does not know about the slope. Measure along the ground rather than taking the horizontal distance from a plan, and expect more waste on a stepped run because panels and rails have to be set at different heights.',
    },
  ],
  limitations:
    'This is a material-planning estimate, not structural, property or code advice. The calculator does not determine safe post spans, embedment depth, footing size, wind or snow loading, land ownership or permit requirements, and it does not confirm that a chosen fence system suits your site. Gate hardware and chain-link terminal components vary by manufacturer and are not fully enumerated. Confirm property lines, local requirements and system-specific details before building.',
  related: [
    { href: '/calculators/fence-calculator', label: 'Fence Calculator', note: 'Posts, rails, infill, concrete and hardware in one list' },
    { href: '/calculators/fence-post-calculator', label: 'Fence Post Calculator', note: 'Post layout only, for review before ordering' },
    { href: '/projects/how-to-calculate-fence-materials', label: 'Project guide: a complete fence take-off' },
    { href: '/materials/fence-materials', label: 'Material guide: fence materials compared' },
    { href: '/costs/fence-cost', label: 'Cost guide: what a fence estimate is made of' },
    { href: '/calculators/concrete-calculator', label: 'Concrete Calculator', note: 'For post holes and any concrete pads' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'fence-calculator',
  relatedCalculators: ['fence-post-calculator', 'fence-cost-calculator', 'concrete-calculator'],
};
