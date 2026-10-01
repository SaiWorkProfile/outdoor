import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { ContentPage } from '../types';
import { paverExample } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-plan-a-paver-patio',
  path: '/projects/how-to-plan-a-paver-patio',
  h1: 'How to plan a paver patio',
  metaTitle: 'How to Plan a Paver Patio: Shape, Layers, Base and Edging',
  metaDescription:
    'Plan a paver patio from the ground up: measure the shape, set paver size and joint, plan base and bedding depths, count edge restraint, and list the material.',
  eyebrow: 'Paver patio guide',
  crumb: 'How to plan a paver patio',
  lede:
    'A paver patio is a layered build-up, and the planning order follows it: shape and area first, then the paver module and joint, then base and bedding depths, then edge restraint. Get the order right and the material list falls out of the measurements; get it wrong and you buy pavers before realising the base is the bigger purchase.',
  keyFacts: [
    { label: 'Default base depth', value: `${ENGINE_ASSUMPTIONS.paver.baseDepthIn} in, compacted` },
    { label: 'Bedding sand', value: `${ENGINE_ASSUMPTIONS.paver.beddingSandDepthIn} in, screeded` },
    { label: 'Default joint width', value: `${ENGINE_ASSUMPTIONS.paver.defaultJointWidthIn} in` },
    { label: 'Base compaction allowance', value: `×${ENGINE_ASSUMPTIONS.paver.baseCompactionFactor}` },
    { label: 'Edge pieces', value: `Commonly ${ENGINE_ASSUMPTIONS.paver.edgePieceLengthFt} ft stock lengths` },
    { label: 'Calculators', value: 'Paver Calculator and Paver Patio Calculator' },
  ],
  sections: [
    {
      id: 'shape',
      heading: 'Start with the shape and the area',
      blocks: [
        {
          kind: 'p',
          text: 'A patio layout is easier to plan as a set of simple areas than as one outline. An L-shaped patio is two rectangles; a patio with a clipped corner is a rectangle plus a triangle; a circular seating area is a circle plus whatever surrounds it. The calculator adds those areas together and, where the shape allows, works out the perimeter for edging.',
        },
        {
          kind: 'ul',
          items: [
            'Measure the shape you are actually going to build, including any extension for steps or a seating nook.',
            'Remember that depth changes the plan: a patio on a slope may need excavation at the high side or a step at the low side, and both change the quantities.',
            'Note where the patio meets a wall, fence or lawn edge, because that is where edging or a transition detail goes.',
            'Curves are normally built from straight paver units, so a curved edge uses more cut pieces and more waste than a straight one.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'This is a material plan, not a design',
          text: 'The calculator plans quantities for the build-up you describe. It does not determine whether that build-up is structurally adequate for your soil, drainage and use. For patios on soft ground, on a slope, or under vehicles, the design needs a site-specific review.',
        },
      ],
    },
    {
      id: 'layers',
      heading: 'The layers, top to bottom',
      blocks: [
        { kind: 'diagram', id: 'paver-layers', caption: 'Pavers, bedding sand, compacted base and edge restraint, each calculated from the same measured area.' },
        {
          kind: 'table',
          table: {
            caption: 'Layer defaults used by the paver calculators',
            head: ['Layer', 'Planning depth', 'Allowance applied', 'Why it exists'],
            rows: [
              ['Pavers', 'Set by the paver size, not by depth', `${ENGINE_ASSUMPTIONS.waste.defaultPercent}% waste on the count`, 'The wearing surface'],
              ['Bedding sand', `${ENGINE_ASSUMPTIONS.paver.beddingSandDepthIn} in`, `×${ENGINE_ASSUMPTIONS.paver.beddingSandCompactionFactor}`, 'A screeded layer that lets pavers be laid to a consistent level'],
              ['Base', `${ENGINE_ASSUMPTIONS.paver.baseDepthIn} in`, `×${ENGINE_ASSUMPTIONS.paver.baseCompactionFactor}`, 'Spreads load and keeps the surface from settling unevenly'],
              ['Edge restraint', 'Perimeter length', `${ENGINE_ASSUMPTIONS.waste.defaultPercent}% waste`, 'Stops the outer pavers spreading outward'],
            ],
            note: 'Base depth varies with soil, drainage, climate and whether vehicles use the surface. The default is a starting point you can change.',
          },
        },
        {
          kind: 'p',
          text: 'Two habits matter here. First, base is ordered as a compactable aggregate, not as sand or soil: it is compacted in layers and the compaction allowance exists because it loses thickness when it is worked. Second, the bedding sand is a thin, level, screeded layer — it is not a substitute for base, and making it thicker does not fix an inadequate base.',
        },
      ],
    },
    {
      id: 'paver-size-joints',
      heading: 'Paver size and joint width: small numbers, large effect',
      blocks: [
        {
          kind: 'p',
          text: 'The paver count is based on the module: the paver size plus the joint. A 6 in × 6 in paver with a 1/8 in joint occupies about 37.5 sq in, not 36. That difference is small per unit and significant across a patio, which is why the calculator asks for the joint width rather than assuming zero.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Why the joint matters in the count',
            head: ['Paver size', 'Joint', 'Module area', 'Effect on the count'],
            rows: [
              ['6 in × 6 in', '1/8 in', '≈37.5 sq in', 'Slightly fewer pavers than a zero-joint estimate would suggest'],
              ['6 in × 6 in', '1/4 in', '≈39 sq in', 'Fewer still, and joints above 1/4 in are flagged as a substantial layout change'],
              ['6 in × 6 in', '0 in', '36 sq in', 'A tight-fit or tumbled-edge detail, which is not typical for sand-set pavers'],
            ],
            note: 'Joint width is set by the paver system and the edge detail, not by preference. Wider joints also change how much sand the joints absorb.',
          },
        },
        {
          kind: 'p',
          text: 'Cutting matters as much as counting. A patio laid on a diagonal uses more cut pieces at the perimeter, and a curved edge uses more still. That is why the waste allowance is applied to the paver count rather than to the area: it is the cuts and breakages, not the surface, that consume the extra material.',
        },
      ],
    },
    {
      id: 'example',
      heading: 'Worked example: an L-shaped patio',
      blocks: [
        {
          kind: 'p',
          text: 'This example uses two areas rather than one rectangle, which is how most real patios measure out. The base, bedding sand and edge restraint are all produced by the same calculation.',
        },
        { kind: 'example', id: 'patio-l-shape' },
      ],
    },
    {
      id: 'edging',
      heading: 'Edge restraint is a quantity, not an accessory',
      blocks: [
        {
          kind: 'p',
          text: 'Sand-set pavers are held in place by their edges. Without restraint the outer course creeps outward and the joints open, and once that starts it does not stop. The calculator derives the edge length from the shapes you enter and warns when a shape does not provide a perimeter — a triangle, for example, needs the edge length entered by hand.',
        },
        {
          kind: 'ul',
          items: [
            'Rectangles and circles give the calculator enough information to derive the perimeter automatically.',
            'For a rectangle the perimeter is two lengths plus two widths, measured around the outside.',
            'Where a patio meets a wall or a step, that edge may not need restraint — but it usually needs a different detail, so check the plan rather than the number.',
            'Edge pieces are bought in stock lengths, so linear feet are converted into a piece count with a waste allowance.',
          ],
        },
      ],
    },
    {
      id: 'checklist',
      heading: 'Paver patio planning checklist',
      blocks: [
        {
          kind: 'checklist',
          title: 'Before ordering a paver patio',
          items: [
            'Shape split into measurable areas, each written down separately',
            'Paver size, thickness and joint width decided from a real product',
            'Base depth decided for your soil and use, plus the compaction allowance',
            'Bedding sand depth decided and the screeding method planned',
            'Edge restraint type chosen, with the perimeter measured or derived',
            'Drainage direction and falls decided, including where water leaves the patio',
            'Whether the patio falls under local rules for drainage or impervious area checked',
            'Excavation depth and spoil location planned before the first delivery arrives',
            'Allowance for cuts and breakages agreed, so the count is not too tight',
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
            { href: '/projects/how-to-calculate-paver-materials', label: 'How to calculate paver materials', note: 'A complete 12 ft × 20 ft take-off with a shopping list' },
            { href: '/materials/paver-base', label: 'Paver base: purpose, depth and compaction', note: 'The layer that decides whether a patio stays flat' },
            { href: '/costs/paver-patio-cost', label: 'What drives paver patio cost', note: 'Pavers, base, bedding, restraint, delivery and labour' },
            { href: '/calculators/paver-patio-calculator', label: 'Open the Paver Patio Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    paverExample({
      id: 'patio-l-shape',
      title: 'An L-shaped patio: 10 ft × 14 ft plus a 6 ft × 8 ft return',
      scenario:
        'Two rectangular areas measured at excavation level, 6 in × 6 in pavers with a 1/8 in joint, a 6 in base and 1 in of bedding sand using the calculator defaults.',
      conclusion:
        'The most useful line is the base material, which is usually the largest volume on a paver job and the one most often left out of a budget. Edge restraint is the second surprise: it is measured around the whole perimeter, including the internal corner the L creates, so an awkward shape has more edge than the area alone suggests.',
      areas: [
        { kind: 'rectangle', length: 10, width: 14 },
        { kind: 'rectangle', length: 6, width: 8 },
      ],
      paverLengthIn: 6,
      paverWidthIn: 6,
    }),
  ],
  faq: [
    {
      q: 'How deep should the base be under a paver patio?',
      a: 'The calculator starts from 6 in of compacted base, with a planning range of about 4–8 in. What you need depends on the subgrade, how well the site drains, ground movement through the seasons and what the patio carries. A patio on soft or wet ground, or one taking vehicles, needs a site-specific decision rather than a default.',
    },
    {
      q: 'How much bedding sand do I need per square foot?',
      a: 'At the default 1 in bedding depth, a square foot uses about 0.0064 cubic yards — roughly 8 sq ft of coverage per cubic yard before allowances. The calculator performs that conversion for your actual area and adds the waste allowance, so the answer is always tied to the patio you are building.',
    },
    {
      q: 'Do I still need edge restraint if the patio is against a wall?',
      a: 'Where a patio meets a rigid wall or a step, that edge is already restrained in one direction, but the detail differs and every free edge still needs restraint. Measure the perimeter you are actually restraining and check the transition details rather than assuming the calculator sees the difference.',
    },
    {
      q: 'Can I lay pavers on sand without a base?',
      a: 'The calculator will compute the numbers for a bedding layer on its own, but the planning assumption behind the paver calculators is that bedding sand sits on a compacted base. Without a base the surface follows whatever the ground does. That is a design decision worth taking advice on.',
    },
    {
      q: 'How much waste should I allow on pavers?',
      a: 'The default is 10%, which covers cuts and breakages on a straightforward layout. Diagonal patterns, curves and lots of perimeter obstacles justify more. The calculator warns when a waste allowance is unusually high, so an unexplained number stands out instead of disappearing into the total.',
    },
  ],
  limitations:
    'This page plans material quantities for a described build-up. It is not a structural or drainage design, and it does not determine the base depth your site needs, the falls required to move water, or whether the patio falls under local rules. Paver thickness, base gradation and bedding material depend on the product and the system, and subgrade conditions can invalidate a standard detail. Confirm the design with a qualified professional where the site is soft, sloping or loaded.',
  related: [
    { href: '/calculators/paver-patio-calculator', label: 'Paver Patio Calculator', note: 'Areas, pavers, base, bedding, edging and a shopping list' },
    { href: '/projects/how-to-calculate-paver-materials', label: 'Project guide: how to calculate paver materials' },
    { href: '/materials/paver-base', label: 'Material guide: paver base' },
    { href: '/costs/paver-patio-cost', label: 'Cost guide: paver patio cost' },
    { href: '/projects/how-to-calculate-landscaping-materials', label: 'Project guide: landscaping materials workflow' },
    { href: '/calculators/paver-base-calculator', label: 'Paver Base Calculator', note: 'Base volume only, with compaction' },
    { href: '/calculators/sand-calculator', label: 'Sand Calculator', note: 'Bedding sand by area and depth' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'paver-patio-calculator',
  relatedCalculators: ['paver-calculator', 'paver-base-calculator', 'sand-calculator'],
};
