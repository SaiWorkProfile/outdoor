import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { ContentPage } from '../types';
import { fenceExample } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-calculate-fence-materials',
  path: '/projects/how-to-calculate-fence-materials',
  h1: 'How to calculate fence materials',
  metaTitle: 'How to Calculate Fence Materials: A Complete 100 ft Take-Off',
  metaDescription:
    'A full fence take-off for a 100 ft, 6 ft high fence with one 4 ft gate: posts, rails, pickets, concrete, hardware and waste, component by component.',
  eyebrow: 'Fence take-off guide',
  crumb: 'How to calculate fence materials',
  lede:
    'A fence take-off is a list of every component, not a single number. This page works through one complete example — a 100 ft fence, 6 ft high, with one 4 ft gate — and explains what each line of the result means, why the post count is not length divided by spacing, and where the allowances come from.',
  keyFacts: [
    { label: 'Example fence', value: '100 ft long, 6 ft high' },
    { label: 'Opening', value: 'One 4 ft gate' },
    { label: 'Post spacing', value: `${ENGINE_ASSUMPTIONS.fence.defaultPostSpacingFt} ft` },
    { label: 'Rails', value: `${ENGINE_ASSUMPTIONS.fence.defaultRailsForUpTo6Ft} per section at this height` },
    { label: 'Post hole', value: `${ENGINE_ASSUMPTIONS.fence.postHoleDiameterIn} in diameter, ${ENGINE_ASSUMPTIONS.fence.postHoleDepthIn} in deep` },
    { label: 'Calculator', value: 'Fence Calculator' },
  ],
  sections: [
    {
      id: 'what-a-takeoff-is',
      heading: 'What a take-off contains',
      blocks: [
        {
          kind: 'p',
          text: 'A take-off is the bridge between a layout and a purchase. For a fence it has five groups: posts, rails, infill (pickets or panels), post-hole concrete, and hardware and gates. Waste is applied within each group rather than as one blanket addition, because each group is bought in a different unit.',
        },
        {
          kind: 'table',
          table: {
            caption: 'The five groups in a fence take-off',
            head: ['Group', 'Counted from', 'Bought as'],
            rows: [
              ['Posts', 'Net run divided by spacing, plus corners, ends and gate posts', 'Individual post lengths'],
              ['Rails', 'Net run × rails per section, converted to stock lengths', 'Stock lengths, usually 8 ft'],
              ['Infill', 'Net run in pickets, panels or linear feet of mesh', 'Pickets, panels or mesh rolls'],
              ['Concrete', 'Cylindrical volume per post hole × number of posts', 'Ready-mix by volume or bagged mix'],
              ['Hardware and gates', 'Gate count and infill type', 'Hardware sets, hinges, latches, fasteners'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Gate openings come out before anything else is counted',
          text: 'The calculator subtracts gate openings from the fence length and then works on what is left. That is why the net run in the result is shorter than the fence you measured.',
        },
      ],
    },
    {
      id: 'the-example',
      heading: 'The example: 100 ft of 6 ft fence with one gate',
      blocks: [
        {
          kind: 'p',
          text: 'The inputs below are deliberately ordinary: a 100 ft run, one corner, two ends, one 4 ft gate, a 6 ft height and the default 8 ft post spacing. The fence type is wood picket, which is the most component-heavy option and therefore the most useful worked example.',
        },
        { kind: 'example', id: 'fence-wood' },
      ],
    },
    {
      id: 'reading-the-result',
      heading: 'Reading the result, line by line',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Net fence run is the length the calculator actually counts: fence length minus gate openings. It is smaller than the 100 ft you measured, and that is correct.',
            'Total posts combines line posts with corners, ends and gate posts. Corners and ends are positions inside the estimated layout, not extra posts, and gate posts are added as a pair per gate.',
            'Rails are counted as net run multiplied by rails per section, then converted to stock lengths. The quantity is in pieces, not linear feet, because that is what a yard sells.',
            'Pickets are counted from the net run in inches divided by the picket pitch — the picket width plus the gap — then the waste allowance is applied.',
            'Post-hole concrete is a cylinder volume per hole at the configured diameter and depth, multiplied by the total post count, with waste. It is the line most people forget to buy.',
            'Fasteners are a planning allowance based on the system, not a manufacturer parts list. Check the actual fasteners the fence system requires.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Hardware is the least precise line',
          text: 'Bracket and fastener counts vary by manufacturer, and chain-link systems need terminal, tension and tie components the calculator does not enumerate. Treat the hardware line as a starting point for a check against the system instructions.',
        },
      ],
    },
    {
      id: 'same-fence-different-type',
      heading: 'The same fence in a panel system',
      blocks: [
        {
          kind: 'p',
          text: 'Changing the fence type changes the infill line and the hardware allowance, but not the posts, rails or concrete. Running the same 100 ft layout as a panel system is the fastest way to see what a material choice actually costs in quantity terms.',
        },
        { kind: 'example', id: 'fence-panels' },
        {
          kind: 'p',
          text: 'The posts, rails and concrete are identical between the two runs, which is the honest finding: switching fence type changes the infill and fasteners, while the skeleton of the fence stays the same. That is also why post layout deserves to be settled before the fence type is chosen.',
        },
      ],
    },
    {
      id: 'waste',
      heading: 'Where the waste allowance goes',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'What the waste allowance covers per component',
            head: ['Component', 'Main cause of waste', 'Why it differs from the next line'],
            rows: [
              ['Pickets', 'Cut pickets at ends, corners and gate openings', 'Cut pieces rarely fit anywhere else'],
              ['Panels', 'Trimmed end panels and replaced damaged panels', 'Panels are large and awkward to cut'],
              ['Rails', 'Cut rails at the end of a run', 'Rails are bought in stock lengths, so a cut leaves an offcut'],
              ['Posts', 'Damaged or mismeasured posts, and gate posts set to a different detail', 'Posts are rarely re-usable once set or cut'],
              ['Concrete', 'Spillage, uneven hole volume and overfilling', 'Volume per hole is an assumption, not a measurement'],
            ],
          },
        },
        {
          kind: 'p',
          text: 'A 10% allowance is the default. It is a sensible planning figure for a straight run, optimistic for a fence with many corners, heavy stepping or a gate on a slope, and generous for a straight panel fence on level ground.',
        },
      ],
    },
    {
      id: 'checklist',
      heading: 'Buying checklist for the example project',
      blocks: [
        {
          kind: 'checklist',
          title: 'A 100 ft, 6 ft fence with one 4 ft gate',
          items: [
            'Post positions confirmed by marking the run on the ground first',
            'Gate posts identified, with the opening framed and the leaf size decided',
            'Rail stock length checked with the supplier, then the rail piece count confirmed',
            'Infill ordered in the same system as the rails and posts, not mixed',
            'Concrete quantity checked against the hole diameter and depth you intend to dig',
            'Fasteners and brackets checked against the fence system instructions',
            'Gate hardware bought as a matching kit, including hinges, latch and any bracing',
            'Property line and local height rules confirmed before digging',
          ],
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
            { href: '/projects/how-to-plan-a-fence', label: 'How to plan a fence', note: 'Layout, slopes, gates and the sequence that prevents rework' },
            { href: '/materials/fence-materials', label: 'Fence materials compared for planning', note: 'Wood, vinyl, chain-link, composite and metal' },
            { href: '/costs/fence-cost', label: 'What a fence estimate is made of', note: 'Turn this take-off into a quote comparison' },
            { href: '/calculators/fence-post-calculator', label: 'Open the Fence Post Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    fenceExample({
      id: 'fence-wood',
      title: 'Wood picket fence: 100 ft long, 6 ft high, one 4 ft gate',
      scenario:
        'A single straight run with one corner and two ends, one 4 ft gate, 8 ft post spacing, 5.5 in pickets and the calculator default 10% waste allowance.',
      conclusion:
        'Two lines surprise most people. The post-hole concrete is a delivery-sized volume rather than a bagged purchase once fifteen posts are involved, and the picket count is high because pickets are counted at their real width plus the gap, so a fence needs many more pickets than feet. Both numbers come from the same layout, which is why the layout is worth marking out on the ground first.',
      fenceLengthFt: 100,
      heightFt: 6,
      fenceType: 'wood-picket',
      postSpacingFt: 8,
      cornerCount: 1,
      endCount: 2,
      gateCount: 1,
      gateWidthFt: 4,
    }),
    fenceExample({
      id: 'fence-panels',
      title: 'The same layout as a vinyl panel fence',
      scenario:
        'Identical layout and gates, with the fence type changed to vinyl panels at the default 8 ft panel width.',
      conclusion:
        'Posts, rails and concrete are unchanged, while the infill is now counted in panels and the fastener allowance drops to the panel-system figure. Compare the two results when choosing a fence type: the skeleton dominates post and concrete quantities, and the infill is where the systems really differ.',
      fenceLengthFt: 100,
      heightFt: 6,
      fenceType: 'vinyl-panel',
      postSpacingFt: 8,
      cornerCount: 1,
      endCount: 2,
      gateCount: 1,
      gateWidthFt: 4,
    }),
  ],
  faq: [
    {
      q: 'Why is the net run shorter than my fence length?',
      a: 'Because gate openings are removed before anything is counted. A gate opening is not fence: it is a gap with a post at each side. Removing it keeps the picket, panel and rail quantities honest, and the gate posts are counted separately.',
    },
    {
      q: 'How many pickets do I need for a 100 ft fence?',
      a: 'It depends on picket width and gap, not on length alone. At the calculator default of 5.5 in pickets with a 1/8 in gap, this example needs more than 200 pickets before any waste allowance, because each picket covers only about 5.6 in of run. Change the width in the calculator and the count changes with it.',
    },
    {
      q: 'How much concrete does a fence need?',
      a: 'It depends on hole diameter, hole depth and the number of posts. The calculator assumes a 12 in diameter hole 30 in deep per post by default, which is a planning assumption rather than a requirement. If your soil, climate or fence system calls for a different hole, change those values and the concrete quantity updates.',
    },
    {
      q: 'Should I enter the gate as part of the fence run?',
      a: 'No. Enter the gate as a gate with its opening width. The calculator subtracts the opening, then adds two gate posts and a hardware set. Entering the gate width as fence length as well would double count material.',
    },
    {
      q: 'Does the calculator price the material?',
      a: 'Not on its own. The Fence Cost Calculator applies your own prices per component to this take-off and flags any component you have not priced, so an incomplete quote stays visible instead of disappearing into a total.',
    },
  ],
  limitations:
    'This take-off is a material-planning estimate. It does not design a fence, determine post embedment, footing size, wind or snow loading, or confirm local height and setback rules, and the hardware allowance is not a manufacturer parts list. Chain-link systems need additional terminal, tension and tie components. Gate weight and support details, fence type suitability and any engineering or permit requirement must be confirmed separately.',
  related: [
    { href: '/calculators/fence-calculator', label: 'Fence Calculator', note: 'Reproduce this take-off with your own dimensions' },
    { href: '/calculators/fence-cost-calculator', label: 'Fence Cost Calculator', note: 'Apply your own prices to the take-off' },
    { href: '/projects/how-to-plan-a-fence', label: 'Project guide: how to plan a fence' },
    { href: '/materials/fence-materials', label: 'Material guide: fence materials compared' },
    { href: '/costs/fence-cost', label: 'Cost guide: what a fence estimate is made of' },
    { href: '/calculators/fence-post-calculator', label: 'Fence Post Calculator' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'fence-calculator',
  relatedCalculators: ['fence-cost-calculator', 'fence-post-calculator', 'concrete-calculator'],
};
