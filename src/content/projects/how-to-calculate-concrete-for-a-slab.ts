import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { ContentPage } from '../types';
import { concreteExample, money } from '../shared';

const BAG_TABLE = ENGINE_ASSUMPTIONS.concrete.bags;

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'how-to-calculate-concrete-for-a-slab',
  path: '/projects/how-to-calculate-concrete-for-a-slab',
  h1: 'How to calculate concrete for a slab',
  metaTitle: 'How to Calculate Concrete for a Slab: Volume, Yards and Bags',
  metaDescription:
    'Calculate concrete for a slab: convert length, width and thickness into cubic yards, add an ordering allowance, and compare ready-mix with bagged concrete.',
  eyebrow: 'Concrete project guide',
  crumb: 'How to calculate concrete for a slab',
  lede:
    'Concrete volume is length × width × thickness, converted into cubic yards and rounded up to what a supplier will actually deliver. The arithmetic is simple; the decisions around it — thickness, waste allowance, and whether the job is bagged or delivered — are where a slab project succeeds or fails.',
  keyFacts: [
    { label: 'Volume', value: 'Length × width × thickness' },
    { label: 'Order unit', value: 'Cubic yards, rounded up to 0.25' },
    { label: 'Planning weight', value: `${ENGINE_ASSUMPTIONS.concrete.lbPerCuFt} lb per cubic foot` },
    { label: 'Waste allowance', value: `${ENGINE_ASSUMPTIONS.waste.defaultPercent}% default` },
    { label: 'Thin-slab warning', value: `Below ${ENGINE_ASSUMPTIONS.concrete.slabThicknessWarningBelowIn} in` },
    { label: 'Calculator', value: 'Concrete Calculator' },
  ],
  sections: [
    {
      id: 'measure',
      heading: 'Measure a slab in three dimensions',
      blocks: [
        {
          kind: 'p',
          text: 'A slab is the easiest concrete volume to measure: there is no compaction and no density to think about, only a box. Measure the length and width at the formwork, and the thickness you intend to pour. If the slab is not rectangular, split it into rectangles and add them, or measure it in the calculator as separate sections.',
        },
        { kind: 'diagram', id: 'slab-section', caption: 'Thickness is measured from the prepared subgrade to the finished level, not from the top of the aggregate.' },
        {
          kind: 'ul',
          items: [
            'Measure inside the forms. A 4 in thickness is a real dimension, not a nominal one, and small errors multiply across a large area.',
            'For a slab that includes a thickened edge or a footing, calculate that as a separate part rather than averaging it into the slab thickness.',
            'Post holes, pads and footings in the same pour are separate parts with their own shapes. The calculator accepts all of them in one estimate.',
            'If the ground is uneven, expect to use more concrete than the box calculation suggests, because a low spot has to be filled before the slab reaches full thickness.',
          ],
        },
      ],
    },
    {
      id: 'volume',
      heading: 'From dimensions to cubic yards',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: 'Convert thickness to feet', body: 'Divide the thickness in inches by 12. A 4 in slab is 0.333 ft thick.' },
            { title: 'Length × width × thickness', body: 'This gives cubic feet. It is the actual volume of the slab, before any allowance.' },
            { title: 'Divide by 27', body: '27 cubic feet make one cubic yard, the unit ready-mix is ordered and priced in.' },
            { title: 'Add the ordering allowance', body: 'A waste allowance covers spillage, formwork movement and a low spot in the subgrade. The calculator default is 10%.' },
            { title: 'Round up to the delivery increment', body: 'Ready-mix is delivered in increments, so the calculator rounds up to the nearest quarter cubic yard.' },
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Running out mid-pour is the expensive mistake',
          text: 'A slab has to be placed and finished in one continuous operation. Short-load fees, waiting time and a cold joint all cost more than the extra quarter yard that would have avoided them. This is the one place where rounding up generously is the cheaper decision.',
        },
      ],
    },
    {
      id: 'ready-mix-or-bags',
      heading: 'Ready-mix or bagged concrete',
      blocks: [
        {
          kind: 'p',
          text: 'Ready-mix is batched at a plant and delivered in a truck, which is why a supplier can tailor a mix to a specification. Bagged concrete is mixed on site, which is practical for small placements and post holes but becomes punishing at slab scale. The calculator compares the volume against both and suggests which is likely to be practical.',
        },
        {
          kind: 'table',
          table: {
            caption: 'Bag yields assumed by the calculator',
            head: ['Bag size', 'Yield per bag', 'Approximate bags per cubic yard'],
            rows: BAG_TABLE.map((bag) => [
              `${bag.bagLb} lb`,
              `${bag.yieldCuFt} cu ft`,
              `${Math.ceil(27 / bag.yieldCuFt)} bags`,
            ]),
            note: 'Yields are planning values. Always check the yield printed on the bag you actually buy, because mixes differ.',
          },
        },
        {
          kind: 'ul',
          items: [
            'Small placements — a post hole, a pad, a repair — are usually bagged, because there is no minimum order and no truck to coordinate.',
            'Mid-sized placements can go either way. The deciding factor is often how quickly the material can be mixed and placed before it starts to set.',
            'Slab-sized placements are almost always ready-mix, because the number of bags and the mixing time become the constraint rather than the cost.',
            'A short load of ready-mix may carry a premium, which is worth asking about before assuming bags will be cheaper.',
          ],
        },
      ],
    },
    {
      id: 'example',
      heading: 'Worked example: a 12 ft × 20 ft slab at four inches',
      blocks: [
        {
          kind: 'p',
          text: 'A 240 sq ft slab at 4 in thick, with the default 10% waste allowance. The result shows the volume, the ready-mix order quantity, every bag option and the planned weight.',
        },
        { kind: 'example', id: 'slab-12x20' },
        {
          kind: 'p',
          text: 'The bag rows make the scale obvious: several hundred bags for a single car-sized slab. That is the point at which most people stop thinking about bagged concrete and start booking a delivery.',
        },
      ],
    },
    {
      id: 'post-hole-example',
      heading: 'Worked example: the same calculator for post holes',
      blocks: [
        {
          kind: 'p',
          text: 'The concrete calculator also handles cylindrical post holes and continuous footings, which is how fence and deck projects usually use it. The example below is a set of post holes at the calculator default size.',
        },
        { kind: 'example', id: 'post-holes' },
        {
          kind: 'p',
          text: 'The bags-or-ready-mix recommendation flips between this example and the slab, which is exactly what the comparison is for. Hole diameter and depth are assumptions you can edit, and they change the volume directly.',
        },
      ],
    },
    {
      id: 'specification',
      heading: 'What a volume calculator cannot decide',
      blocks: [
        {
          kind: 'p',
          text: 'Concrete is a designed material. Strength, air content, aggregate size, reinforcement, joint layout, subgrade preparation and curing all affect whether a slab performs, and none of them can be inferred from a volume. A slab that is the right volume but the wrong thickness, mix or base will still fail.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'This is a materials estimate, not a structural design',
          text: 'The calculator does not determine slab thickness, reinforcement, mix design, joint spacing or subgrade requirements, and it does not certify that a placement will meet a code or a load. Where a slab carries structure, vehicles or a building, the specification belongs to a qualified professional.',
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
            { href: '/materials/concrete', label: 'Ready-mix and bagged concrete', note: 'How the two delivery routes differ in planning terms' },
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
      id: 'slab-12x20',
      title: 'A 12 ft × 20 ft slab, 4 in thick',
      scenario:
        'One rectangular slab part, 4 in thick, with the calculator default 10% waste allowance and default bag specifications.',
      conclusion:
        'The ready-mix order quantity is the number to order, not the raw volume: it is already rounded up to a delivery increment, which protects against the one outcome a slab pour cannot absorb. The weight row is worth reading too, because it tells you what the subgrade and the formwork have to carry before the concrete sets.',
      parts: [{ kind: 'slab', label: 'Patio slab', lengthFt: 12, widthFt: 20, thicknessIn: 4 }],
    }),
    concreteExample({
      id: 'post-holes',
      title: 'Fourteen fence post holes, 12 in × 30 in',
      scenario:
        'Fourteen cylindrical post holes at the calculator default diameter and depth, with the same 10% waste allowance.',
      conclusion:
        'The same engine that planned a slab now plans a volume in bags rather than a truckload, which is the useful comparison: concrete projects are not one size. Hole diameter and depth are assumptions you can change, and they move the volume directly, so use the dimensions your own fence or deck detail calls for.',
      parts: [{ kind: 'post-hole', label: 'Fence post holes', diameterIn: 12, depthIn: 30, count: 14 }],
    }),
  ],
  faq: [
    {
      q: 'How many cubic yards of concrete do I need for a 12 × 20 slab?',
      a: 'A 12 ft × 20 ft slab at 4 in thick is 80 cubic feet of concrete, which is just under 3 cubic yards. With the default 10% ordering allowance it becomes about 3.25 cubic yards, and the ready-mix order quantity is rounded up from there to the nearest delivery increment.',
    },
    {
      q: 'How thick should a concrete slab be?',
      a: 'Four inches is commonly used for patios and walkways, and the calculator warns below 3.5 in because a thinner slab is less tolerant of a weak subgrade and of loads. What you actually need depends on what the slab carries, the subgrade and the reinforcement, which is a specification question rather than a volume question.',
    },
    {
      q: 'How much extra concrete should I order?',
      a: 'A 10% allowance is the calculator default and is a reasonable planning figure for a slab on a prepared subgrade. The cost of a slightly short load — a cold joint, a second delivery, waiting time — is normally larger than the cost of the extra material, which is why rounding up to the delivery increment is deliberate.',
    },
    {
      q: 'How much does a yard of concrete weigh?',
      a: 'Normal-weight concrete is in the region of 4,000 lb per cubic yard, which is the 150 lb per cubic foot planning value the calculator uses. That matters for formwork, for subgrade preparation and for whether a wheelbarrow route can take the load.',
    },
    {
      q: 'Can I use this calculator for footings and pads as well as slabs?',
      a: 'Yes. The calculator handles slabs, continuous footings and cylindrical post holes in the same estimate, so a project that mixes a pad, a footing run and post holes can be ordered as one volume.',
    },
  ],
  sources: [
    {
      label: 'American Cement Association / Portland Cement Association — Applications of cement',
      note: 'Background on ready-mixed concrete, how it is batched and delivered, and how cement-based materials are compacted and cured.',
      url: 'https://www.cement.org/cement-concrete/applications-of-cement/',
    },
  ],
  limitations:
    'This is a materials estimate, not a structural design or a mix specification. The calculator does not determine slab thickness, reinforcement, joint layout, subgrade preparation, mix design, air content or curing requirements, and it does not confirm that a placement meets a code, a load rating or a manufacturer requirement. Bag yields differ between products and must be checked on the label. Where concrete carries a structure, a vehicle or a building, the specification has to come from a qualified professional.',
  related: [
    { href: '/calculators/concrete-calculator', label: 'Concrete Calculator', note: 'Slabs, footings and post holes in one estimate' },
    { href: '/materials/concrete', label: 'Material guide: concrete' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/projects/how-to-calculate-fence-materials', label: 'Project guide: a complete fence take-off' },
    { href: '/projects/how-to-calculate-landscaping-materials', label: 'Project guide: landscaping materials workflow' },
    { href: '/calculators/fence-post-calculator', label: 'Fence Post Calculator', note: 'Post layout, which determines the hole count' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'concrete-calculator',
  relatedCalculators: ['fence-post-calculator', 'fence-calculator', 'deck-material-calculator'],
};
