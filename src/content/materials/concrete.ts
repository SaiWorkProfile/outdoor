import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { ContentPage } from '../types';
import { concreteExample, money } from '../shared';

export const page: ContentPage = {
  cluster: 'materials',
  slug: 'concrete',
  path: '/materials/concrete',
  h1: 'Concrete: ready-mix, bagged and how to plan a volume',
  metaTitle: 'Concrete Guide: Ready-Mix vs Bagged, Volume and Ordering',
  metaDescription:
    'How ready-mix and bagged concrete differ, how volume is calculated for slabs, pads and post holes, and what to confirm before you order.',
  eyebrow: 'Material reference',
  crumb: 'Concrete',
  lede:
    'Concrete is ordered by volume and specified by mix. The volume is arithmetic: length × width × thickness, or a cylinder for post holes. The specification — strength, air content, reinforcement, subgrade and curing — is a design decision that a quantity calculator cannot make for you.',
  keyFacts: [
    { label: 'Volume', value: 'Length × width × thickness, in feet' },
    { label: 'Order unit', value: 'Cubic yards, rounded up to 0.25' },
    { label: 'Planning weight', value: `${ENGINE_ASSUMPTIONS.concrete.lbPerCuFt} lb per cubic foot` },
    { label: 'Ready-mix', value: 'Batched at a plant and delivered' },
    { label: 'Bagged', value: 'Mixed on site; practical at small volumes' },
    { label: 'Calculator', value: 'Concrete Calculator' },
  ],
  sections: [
    {
      id: 'two-routes',
      heading: 'Two delivery routes, two different projects',
      blocks: [
        {
          kind: 'p',
          text: 'Ready-mixed concrete is batched at a plant to a specification and delivered in a truck, which is why a supplier can tailor a mix: strength, slump, aggregate size and admixtures are all decided before it arrives. Bagged concrete is a dry mix you add water to on site. The two routes are not only different prices, they are different logistics.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Ready-mix and bagged concrete compared',
            head: ['Factor', 'Ready-mix', 'Bagged'],
            rows: [
              ['Best suited to', 'Slabs, pads and anything large enough to place continuously', 'Post holes, small pads, repairs and awkward access'],
              ['How it arrives', 'A truck that has to reach the placement point', 'Pallets or individual bags you store'],
              ['Timing pressure', 'Limited time to place and finish before it sets', 'Paced by how fast you can mix'],
              ['Ordering increment', `Rounded up to ${ENGINE_ASSUMPTIONS.concrete.readyMixIncrementCuYd} cu yd`, 'Whole bags, with a yield printed on each one'],
              ['Main risk', 'A short load leaves a cold joint', 'Running out of energy, or of bags, mid-placement'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Batching is why ready-mix exists',
          text: 'Ready-mixed concrete is made to order at a plant rather than mixed on site, which is what allows a mix to be tailored to the placement. That is background on how the material is produced; it is not a suggestion that any particular mix suits any particular project.',
        },
      ],
    },
    {
      id: 'volume',
      heading: 'Volume: slabs, pads and post holes',
      blocks: [
        {
          kind: 'p',
          text: 'Every concrete volume is a solid-shape calculation. A slab is a box; a footing is a long box; a post hole is a cylinder. The calculator keeps those shapes separate so a project that mixes all three can still be ordered as one volume.',
        },
        {
          kind: 'ul',
          items: [
            'A slab is length × width × thickness, with the thickness converted from inches to feet.',
            'A footing or grade beam is length × width × depth, again with the dimensions converted.',
            'A post hole is a cylinder: π × radius² × depth, multiplied by the number of holes.',
            'A waste allowance is added to the total volume and the order is rounded up to a delivery increment.',
          ],
        },
        { kind: 'diagram', id: 'post-hole', caption: 'Post-hole volume is a cylinder per hole. Diameter and depth are planning assumptions, not requirements.' },
      ],
    },
    {
      id: 'waste',
      heading: 'Waste and the ordering allowance',
      blocks: [
        {
          kind: 'p',
          text: 'The purpose of the waste allowance on a concrete estimate is different from a bulk aggregate. There is no compaction and no spillage into the subgrade in the same way; what the allowance covers is formwork movement, uneven subgrade, and the fact that a partially filled form has to be filled from somewhere.',
        },
        {
          kind: 'ul',
          items: [
            'An allowance under about 5% leaves very little margin, and the calculator warns at that point.',
            'A low spot in the subgrade absorbs concrete before the slab reaches full thickness over the whole area.',
            'Ready-mix is normally rounded up to a quarter cubic yard, so the order is already rounded beyond the calculated volume.',
            'Running out mid-placement is the failure mode with real consequences: a cold joint or a second load at short notice.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Ordering short to save money is a false economy',
          text: 'The extra fraction of a cubic yard costs far less than a cold joint, a waiting charge or a second delivery. This is one of the few places where rounding up generously is clearly the cheaper decision.',
        },
      ],
    },
    {
      id: 'example',
      heading: 'Two volumes from the same calculator',
      blocks: [
        {
          kind: 'p',
          text: 'The same engine plans a slab and a set of post holes, and the two results look completely different in scale. Both are produced by the calculator from the inputs shown.',
        },
        { kind: 'example', id: 'concrete-slab-volume' },
        { kind: 'example', id: 'concrete-post-holes' },
      ],
    },
    {
      id: 'purchasing',
      heading: 'Purchasing considerations',
      blocks: [
        {
          kind: 'checklist',
          title: 'Before ordering concrete',
          items: [
            'Volume calculated, with an allowance and the delivery increment applied',
            'A decision between ready-mix and bags, based on volume and access as well as price',
            'Access checked for a delivery truck, including whether a pump or a longer chute is needed',
            'Placement and finishing planned, with enough help on the day for the volume involved',
            'Formwork, reinforcement and joint layout decided by whoever is responsible for the specification',
            'Subgrade prepared, compacted and checked before the concrete arrives',
            'A plan for curing, because it affects how the finished work performs',
            'Weather and temperature conditions checked, since they change how fast the material sets',
          ],
        },
        {
          kind: 'p',
          text: 'One practical point about bagged concrete: the yield printed on the bag is the figure to use, and yields differ between products and bag sizes. The calculator shows counts for common bag sizes so you can compare them against the bags actually on the shelf.',
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
            { href: '/projects/how-to-calculate-concrete-for-a-slab', label: 'How to calculate concrete for a slab', note: 'The slab calculation with two worked examples' },
            { href: '/costs/landscaping-project-cost', label: 'What drives landscaping project cost', note: 'Where concrete sits in a project budget' },
            { href: '/projects/how-to-calculate-fence-materials', label: 'A complete fence take-off', note: 'Post-hole concrete as part of a bigger material list' },
            { href: '/calculators/concrete-calculator', label: 'Open the Concrete Calculator' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    concreteExample({
      id: 'concrete-slab-volume',
      title: 'A 10 ft × 12 ft pad at four inches thick',
      scenario:
        'One rectangular pad, 4 in thick, with the default 10% waste allowance and the default bag specifications.',
      conclusion:
        'A pad this size is the scale at which bagged concrete starts to become a decision rather than a default: the bag rows show counts in the dozens, which is a realistic day of mixing for two people. Above this size the arithmetic stops being the constraint and the logistics take over.',
      parts: [{ kind: 'slab', label: 'Utility pad', lengthFt: 10, widthFt: 12, thicknessIn: 4 }],
    }),
    concreteExample({
      id: 'concrete-post-holes',
      title: 'Eight post holes, 10 in diameter and 30 in deep',
      scenario:
        'Eight cylindrical post holes with a smaller diameter than the fence default, entered as a single part with a count.',
      conclusion:
        'The bag count is modest and the ready-mix recommendation stays with bags, which is the useful contrast with the slab example. Changing the hole diameter changes the volume directly, and that is the number most likely to differ from the detail you are working to.',
      parts: [{ kind: 'post-hole', label: 'Post holes', diameterIn: 10, depthIn: 30, count: 8 }],
    }),
  ],
  faq: [
    {
      q: 'How do I calculate how much concrete I need?',
      a: 'Work out the volume in cubic feet — length × width × thickness for a slab, or a cylinder per hole for post holes — divide by 27 for cubic yards, add an allowance, then round up to the delivery increment. The calculator does all of it, and shows bag counts for common bag sizes alongside the volume.',
    },
    {
      q: 'How many bags of concrete are in a cubic yard?',
      a: 'It depends on the bag. At the yields used here, a cubic yard is roughly 90 bags at 40 lb, 72 at 50 lb, 60 at 60 lb or 45 at 80 lb. Yields vary between products, so check the label of the bag you are buying before multiplying.',
    },
    {
      q: 'Do I need ready-mix or bags for a slab?',
      a: 'It depends on size and access. Bags are practical for small pads and post holes, while a full slab is normally placed as one continuous operation, which favours ready-mix. The calculator compares the volume against both routes and suggests which is likely to be practical, but the decision also depends on access and on how much help you have.',
    },
    {
      q: 'Does the calculator design the concrete mix?',
      a: 'No. It calculates volume. Mix design covers strength, air content, aggregate size, admixtures and curing, and it depends on what the concrete is doing, the climate and any reinforcement. That is a specification decision, not a quantity one.',
    },
    {
      q: 'Why does the calculator round the ready-mix quantity up?',
      a: 'Because ready-mix is sold in increments — commonly a quarter cubic yard — and because a placement that runs short is far more expensive to fix than the fraction of a yard that would have prevented it. The rounded figure is the number to order.',
    },
  ],
  sources: [
    {
      label: 'American Cement Association / Portland Cement Association — Applications of cement',
      note: 'Background on ready-mixed concrete, how it is batched and delivered, and the role of compaction and curing in cement-based materials.',
      url: 'https://www.cement.org/cement-concrete/applications-of-cement/',
    },
  ],
  limitations:
    'This page plans concrete volume and describes the two delivery routes. It is not a structural or mix design, and it does not determine slab thickness, reinforcement, joint layout, subgrade preparation, mix specification, air content or curing requirements. It also cannot confirm that a placement will meet a code, a load rating or a manufacturer requirement. Bag yields and densities differ between products. Where concrete carries a structure, a vehicle or a building, the specification must come from a qualified professional.',
  related: [
    { href: '/calculators/concrete-calculator', label: 'Concrete Calculator', note: 'Slabs, footings and post holes with bag and ready-mix options' },
    { href: '/projects/how-to-calculate-concrete-for-a-slab', label: 'Project guide: how to calculate concrete for a slab' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/projects/how-to-calculate-fence-materials', label: 'Project guide: a complete fence take-off' },
    { href: '/calculators/fence-post-calculator', label: 'Fence Post Calculator', note: 'The post count that determines hole volume' },
    { href: '/about', label: 'What this platform does and does not do' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'concrete-calculator',
  relatedCalculators: ['fence-post-calculator', 'paver-base-calculator', 'sand-calculator'],
};
