import type { ContentPage } from '../types';
import { fenceExample } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'fence-materials',
  path: '/materials/fence-materials',
  h1: 'Fence materials compared for planning',
  metaTitle: 'Fence Materials Compared: Wood, Vinyl, Chain-Link, Composite, Metal',
  metaDescription:
    'How common fence materials differ in maintenance and how they are counted, and what each changes about posts, gates, hardware and planning.',
  eyebrow: 'Material reference',
  crumb: 'Fence materials',
  lede:
    'Fence materials fill the same line in different ways. What changes between them is mostly how the infill is counted, how much maintenance the surface needs, and how the system handles posts, gates and hardware. This page compares them for planning purposes rather than recommending one.',
  keyFacts: [
    { label: 'Common choices', value: 'Wood, vinyl, chain-link, composite, metal' },
    { label: 'What stays constant', value: 'Posts, post holes, concrete and gate openings' },
    { label: 'What changes', value: 'Infill counting, fasteners, maintenance' },
    { label: 'Gate rule', value: 'Two gate posts and a hardware set per gate' },
    { label: 'Hardware', value: 'System-specific; always check the manufacturer list' },
    { label: 'Calculator', value: 'Fence Calculator' },
  ],
  sections: [
    {
      id: 'comparison',
      heading: 'The comparison that matters for planning',
      blocks: [
        {
          kind: 'p',
          text: 'Every fence is a post-and-rail skeleton with an infill between the posts. Choosing a material changes the infill, the fasteners and the maintenance schedule; it does not change the fact that you still need posts, holes, concrete and a gate detail. That is why this site calculates post layout separately.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Common fence materials and their planning characteristics',
            head: ['Material', 'Infill counted as', 'Maintenance character', 'Planning considerations'],
            rows: [
              ['Wood', 'Individual pickets or panels', 'Surface can be treated or refinished periodically; individual boards can be replaced', 'Board width and spacing drive the count; moisture movement and ground contact are the usual concerns'],
              ['Vinyl (PVC)', 'Panels', 'Generally a wipe-clean surface; colour is through the material rather than applied', 'Panel width fixes the post spacing; posts and rails are usually system components bought together'],
              ['Chain-link', 'Linear feet of mesh', 'Galvanised or coated mesh with a long service life in most conditions', 'Terminal, tension and tie components are system-specific and are not fully enumerated by a basic planner'],
              ['Composite', 'Panels', 'No refinishing; colour and grain are manufactured', 'Panel widths and rail systems are manufacturer-specific; expansion and ventilation details matter'],
              ['Metal (aluminium, steel)', 'Panels or pickets, depending on the system', 'Powder-coated or galvanised finishes; touch-up rather than refinishing', 'Strong wind loading and rigid fixings; manufacturer systems define the components'],
            ],
            note: 'No material here is universally best. What suits a boundary depends on climate, exposure, how much maintenance you want, the look you want, and local rules.',
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Price is not the comparison this page makes',
          text: 'Material costs vary by region, by system and by quantity. This site does not publish prices; enter your own quotes into the Fence Cost Calculator and compare the same scope.',
        },
      ],
    },
    {
      id: 'quantity',
      heading: 'How the choice changes the material list',
      blocks: [
        {
          kind: 'p',
          text: 'Running the same layout through different fence types is the fastest way to see the real difference. Posts, post-hole concrete and rail framework stay essentially the same; the infill line and the fastener count change, and the hardware requirement becomes system-specific.',
        },
        { kind: 'example', id: 'fence-chain-link' },
        {
          kind: 'ul',
          items: [
            'Panel systems are counted in panels, so the panel width and the post spacing are the same decision.',
            'Picket systems are counted in individual pickets, so board width and gap drive the count.',
            'Chain-link is counted in linear feet of mesh, and the result will remind you that terminal and tension components are not enumerated.',
            'Fastener counts are planning allowances. Hidden clip systems, brackets and truss plates all change the numbers, and the manufacturer list is the authority.',
          ],
        },
      ],
    },
    {
      id: 'gates-posts-hardware',
      heading: 'Gates, posts and hardware',
      blocks: [
        {
          kind: 'p',
          text: 'These three items behave similarly across materials, with one important difference: how system-specific they are. A gate is a moving, self-supporting panel, so whatever it is made of, it needs posts that can carry it and hardware that matches its weight.',
        },
        {
          kind: 'table',
          table: {
            caption: 'What each component requires, by material family',
            head: ['Component', 'What is common to all materials', 'What differs'],
            rows: [
              ['Gate posts', 'Two posts per gate, sized and set to carry the leaf', 'Wood posts may need bracing across the opening; panel systems use their own gate posts'],
              ['Hinges and latches', 'A hardware set per gate', 'Heavy vinyl and composite gates need hardware rated for their weight'],
              ['Line posts', 'One per position, set in a hole with concrete', 'Metal systems may set posts in concrete or use driven or ground-socket options'],
              ['Rails', 'Two or three per section depending on height and system', 'Individual boards versus integral panel rails'],
              ['Fasteners', 'A fixing at every board-to-rail or rail-to-post connection', 'Screws, brackets, clips and rivets are all system-specific'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Wind exposure is a material decision',
          text: 'A solid panel attracts more wind load than a permeable one, and a tall fence attracts more than a short one. That is a reason to check local rules and, on exposed or tall boundaries, to have the post and footing details reviewed rather than assumed.',
        },
      ],
    },
    {
      id: 'choosing',
      heading: 'A decision framework rather than a recommendation',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: 'Start with the purpose', body: 'Privacy, containment, marking a boundary, screening a view or securing an area each point to different materials.' },
            { title: 'Then the maintenance appetite', body: 'Some materials need periodic refinishing; others are cleaned. This is a preference, not a quality ranking.' },
            { title: 'Then the exposure and climate', body: 'Coastal salt, strong prevailing wind, heavy snow and intense sun all change how a material behaves over time.' },
            { title: 'Then local rules', body: 'Height, setback, material restrictions and boundary responsibilities vary by area and can eliminate an option entirely.' },
            { title: 'Then the layout', body: 'Post spacing, corners and gate openings are decided by the site, and they carry across materials unchanged.' },
            { title: 'Then the quantity', body: 'Enter the layout with the chosen type and let the calculator produce the component list.' },
          ],
        },
        {
          kind: 'p',
          text: 'Working in that order avoids the common mistake of falling in love with an option and then discovering it is not permitted, or that it cannot be built on the ground you have.',
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
            { href: '/projects/how-to-plan-a-fence', label: 'How to plan a fence', note: 'Layout, slopes, gates and the planning sequence' },
            { href: '/projects/how-to-calculate-fence-materials', label: 'A complete fence take-off', note: 'Posts, rails, pickets, panels, concrete and hardware' },
            { href: '/costs/fence-cost', label: 'What a fence estimate is made of' },
            { href: '/calculators/fence-calculator', label: 'Open the Fence Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    fenceExample({
      id: 'fence-chain-link',
      title: 'A 120 ft chain-link boundary fence with one gate',
      scenario:
        'A 120 ft run with two corners, two ends, one 4 ft gate and 10 ft post spacing, calculated with the chain-link fence type so the mesh is counted in linear feet.',
      conclusion:
        'The mesh line is the visible difference from a picket or panel fence: chain-link is counted as linear feet of mesh plus a fastener allowance, and the result states plainly that terminal, tension and tie components are system-specific and not enumerated. That is the honest limitation to carry into your own buying list.',
      fenceLengthFt: 120,
      heightFt: 6,
      fenceType: 'chain-link',
      postSpacingFt: 10,
      cornerCount: 2,
      endCount: 2,
      gateCount: 1,
      gateWidthFt: 4,
    }),
  ],
  faq: [
    {
      q: 'Which fence material lasts longest?',
      a: 'There is no single answer, because service life depends on the product, the climate, how it is installed and how it is maintained. Coatings, treatments and manufacturers differ within each material family, and a well-installed fence of almost any material outperforms a poorly installed one of a supposedly better material. Compare specific products rather than categories.',
    },
    {
      q: 'Does the fence material affect how many posts I need?',
      a: 'Not directly — post positions come from the fence length, the spacing you choose, the corners, ends and gate openings. What changes is the post type and the width of the panels or pickets between them, which is why post spacing is often fixed by the panel width in a panel system.',
    },
    {
      q: 'Why are chain-link quantities different from other fences?',
      a: 'Because the infill is counted as linear feet of mesh rather than as individual pickets or panels. Chain-link also needs terminal, tension and tie components — corner and end posts, tension bars, ties — which a quantity planner does not enumerate, so the buying list has to come from the system you choose.',
    },
    {
      q: 'Does a heavier gate need different posts?',
      a: 'Yes, and that is a design consideration rather than a quantity one. A gate leaf carries its own weight and creates load at the hinges, so gate posts and their footings are usually more substantial than line posts. Confirm the detail with the fence system or the person responsible for the design.',
    },
  ],
  limitations:
    'This page compares planning characteristics, not product performance, and it does not recommend a material. It makes no claim about durability, service life, load capacity or compliance for any product or system, and it cannot account for climate, exposure or local requirements. Gate hardware, brackets and especially chain-link terminal components vary by manufacturer and are not fully enumerated. Confirm system details with the manufacturer and any structural or boundary requirements locally.',
  related: [
    { href: '/calculators/fence-calculator', label: 'Fence Calculator', note: 'Switch fence type and watch the infill line change' },
    { href: '/projects/how-to-plan-a-fence', label: 'Project guide: how to plan a fence' },
    { href: '/projects/how-to-calculate-fence-materials', label: 'Project guide: a complete fence take-off' },
    { href: '/costs/fence-cost', label: 'Cost guide: what a fence estimate is made of' },
    { href: '/calculators/fence-post-calculator', label: 'Fence Post Calculator', note: 'Post layout independently of the material choice' },
    { href: '/calculators/concrete-calculator', label: 'Concrete Calculator', note: 'Post-hole concrete for any of these systems' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'fence-calculator',
  relatedCalculators: ['fence-cost-calculator', 'fence-post-calculator', 'concrete-calculator'],
};
