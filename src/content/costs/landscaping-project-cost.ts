import type { ContentPage } from '../types';
import { bulkExample } from '../shared';

export const page: ContentPage = {
  cluster: 'costs',
  slug: 'landscaping-project-cost',
  path: '/costs/landscaping-project-cost',
  h1: 'Landscaping project cost: the full breakdown',
  metaTitle: 'Landscaping Project Cost: Materials, Delivery, Labour and More',
  metaDescription:
    'A complete breakdown of what a landscaping project costs: materials, delivery, labour, equipment, preparation, waste and complexity — with prices you enter yourself.',
  eyebrow: 'Cost pillar',
  crumb: 'Landscaping project cost',
  lede:
    'A landscaping budget is a list of categories, and most overruns come from the categories that were never on the list. This page covers all of them: material, delivery, labour, equipment, preparation, waste and complexity — and explains how to build the number yourself rather than borrowing someone else’s average.',
  keyFacts: [
    { label: 'Categories', value: 'Material, delivery, labour, equipment, preparation, waste' },
    { label: 'Most underestimated', value: 'Preparation and disposal' },
    { label: 'Most variable', value: 'Labour and site access' },
    { label: 'Prices', value: 'Entered by you, never invented here' },
    { label: 'Where it lives', value: 'Project Mode, in your browser' },
    { label: 'Calculators', value: 'Sixteen tools share one engine' },
  ],
  sections: [
    {
      id: 'categories',
      heading: 'The categories in full',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'Every category a landscaping budget contains',
            head: ['Category', 'What it covers', 'How it usually gets missed'],
            rows: [
              ['Materials', 'Every layer and component at the quantity you calculated', 'Edge restraint, bedding sand, fasteners, joint sand'],
              ['Delivery', 'Each load, plus any placement charge and any second trip', 'Multiple loads, or a minimum charge on a small order'],
              ['Labour', 'Your time or a contractor’s, including preparation and clean-up', 'Clean-up, waste removal and snagging at the end'],
              ['Equipment', 'Excavator, compactor, mixer, cutters, hire and transport', 'Getting the machine to site and back'],
              ['Preparation', 'Excavation, spoil removal, subgrade work, temporary protection', 'Disposal charges for what comes out'],
              ['Waste', 'The order margin that covers cuts, spillage and breakage', 'Assumed to be zero in a hopeful estimate'],
              ['Consumables', 'Fabric, pegs, string, blades, sheeting, personal protection', 'Almost always, because each item looks trivial'],
              ['Contingency', 'A held-back amount for what the ground turns out to be', 'Ignored, then needed'],
              ['Professional input', 'Design, engineering, surveys or permits where they apply', 'Assumed to be free because it is invisible'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Why no average is quoted here',
          text: 'A published average cannot know your access, your ground, your quantity or your supplier. Material quantities can be calculated and checked; prices have to come from real quotes. Keeping those two things separate is what makes a budget usable.',
        },
      ],
    },
    {
      id: 'complexity',
      heading: 'Complexity is a cost category of its own',
      blocks: [
        {
          kind: 'p',
          text: 'Two identical patios on two different plots can cost different amounts, and the difference is almost never the patio. Complexity is the term for everything site-specific: how hard it is to reach, how much has to be dug, what has to be removed, and how many times material has to be moved by hand.',
        },
        {
          kind: 'ul',
          items: [
            'Access: how close a delivery can get, and whether a machine can reach the work area.',
            'Level changes: slopes, steps and retaining requirements add structure, not just material.',
            'Ground: existing hard surfaces, tree roots, rock or fill all change how much labour preparation takes.',
            'Drainage: where water goes, and whether a new route has to be provided for it.',
            'Services: pipes and cables in the work area, which have to be located and protected.',
            'Existing material: removing and disposing of what is already there, which is a cost with no visible result.',
          ],
        },
        {
          kind: 'p',
          text: 'The practical consequence is that a quote which lists material only is not necessarily wrong, but it is incomplete. The completion is what usually decides whether the project finishes on budget.',
        },
      ],
    },
    {
      id: 'build-it',
      heading: 'Building the number yourself',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: 'Measure and calculate quantities first', body: 'Every material in the project goes through a calculator, using measurements taken once and reused.' },
            { title: 'Collect the result in one place', body: 'Add each calculation to Project Mode, so quantities, assumptions and notes stay together with the project.' },
            { title: 'Enter prices as they arrive', body: 'Apply supplier and installer prices to the quantities. A component with no price stays visible rather than being treated as free.' },
            { title: 'List the categories with no calculator', body: 'Delivery, equipment hire, disposal, permits, professional input and your own time. These are recorded as notes or flat amounts.' },
            { title: 'Add a contingency for what you cannot see', body: 'Size it against the preparation risk rather than against a fixed percentage of the total.' },
            { title: 'Compare like for like', body: 'When quotes arrive, check them against the same quantity list, so scope differences become visible instead of being averaged away.' },
          ],
        },
        { kind: 'example', id: 'landscaping-cost-example' },
      ],
    },
    {
      id: 'scale',
      heading: 'How the mix changes with project size',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'What dominates at each scale, and where the risk sits',
            head: ['Scale', 'Dominant cost', 'Main risk'],
            rows: [
              ['A bed, a tree ring, a small repair', 'Material', 'Time rather than money'],
              ['A walkway or a small patio', 'Material plus delivery', 'Delivery minimum exceeding the material cost'],
              ['A driveway or a large patio', 'Base material, preparation and delivery', 'What the excavation reveals'],
              ['A deck, fence or structure', 'Framing, fixings and labour', 'Specification and design requirements'],
              ['A whole garden or outdoor refurbishment', 'Preparation, labour and disposal', 'Scope growth and the cost of removing what exists'],
            ],
          },
        },
        {
          kind: 'p',
          text: 'The consistent pattern is that material becomes a smaller share of the total as the project grows, because preparation, labour and disposal grow faster. Budgeting from the ground up — preparation, then structure, then finish — puts the money where the risk is.',
        },
      ],
    },
    {
      id: 'practical',
      heading: 'Practical budget guidance',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Get the quantity right before price shopping. A 30% error in quantity is bigger than most price differences between suppliers.',
            'Ask for a delivered total rather than a material rate, so the comparison includes delivery.',
            'Price the layers you cannot see first: base, bedding, subgrade work and spoil. They are the least optional and the easiest to forget.',
            'Keep a single running list rather than comparing mental totals between calculators.',
            'Record the assumptions next to each quantity, so a number can be explained weeks later.',
            'Decide the finish material last, once the budget for everything beneath it is understood.',
            'Where the work is regulated, contractual or load-bearing, obtain written quotes and whatever professional input the work requires.',
          ],
        },
      ],
    },
    {
      id: 'next',
      heading: 'Related guides',
      blocks: [
        {
          kind: 'links',
          title: 'Cost guides for individual materials',
          items: [
            { href: '/costs/gravel-cost', label: 'Gravel cost' },
            { href: '/costs/mulch-cost', label: 'Mulch cost' },
            { href: '/costs/fence-cost', label: 'Fence cost' },
            { href: '/costs/paver-patio-cost', label: 'Paver patio cost' },
            { href: '/costs/gravel-driveway-cost', label: 'Gravel driveway cost' },
            { href: '/costs/deck-cost', label: 'Deck cost' },
          ],
        },
        {
          kind: 'links',
          title: 'Build the project',
          items: [
            { href: '/projects', label: 'Project Mode', note: 'Quantities, costs, assumptions and a printable plan' },
            { href: '/projects/outdoor-project-cost-planning', label: 'Outdoor project cost planning', note: 'The budgeting method behind this breakdown' },
            { href: '/projects/how-to-calculate-landscaping-materials', label: 'Landscaping materials workflow', note: 'One measurement process for every material' },
            { href: '/calculators', label: 'All calculators' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'landscaping-cost-example',
      title: 'One material line from a bigger budget, priced by the cubic yard',
      scenario:
        'A 10 ft × 20 ft planting bed built up with 6 in of topsoil, priced with an illustrative 42.00 per cubic yard and a 55.00 delivery fee. Replace these with your own supplier figures; they exist to show how one line of a budget is built, and they appear in the currency you choose at the top of the page.',
      conclusion:
        'This is one line of a whole-project budget. A typical garden refresh has several lines like it — soil, mulch, aggregate, bedding, restraint — plus the categories no calculator covers. The point of calculating each line separately is that the total then has a structure: you can see which line changed when a quote comes in higher than expected, instead of renegotiating the whole number.',
      material: 'topsoil',
      areas: [{ kind: 'rectangle', length: 10, width: 20 }],
      depthIn: 6,
      useCase: 'garden-bed',
      pricing: { perCuYd: 42, deliveryFee: 55 },
    }),
  ],
  faq: [
    {
      q: 'How much does a landscaping project cost?',
      a: 'This site does not publish a figure, because the answer depends on the area, the materials, the preparation the site needs, the access and the local labour market. What it does provide is the structure: calculate each material quantity, apply your own prices, and list the categories that no calculator covers. That produces a budget you can defend rather than an average you cannot.',
    },
    {
      q: 'What percentage should contingency be?',
      a: 'There is no universal percentage. Contingency should reflect what you cannot see: if nothing has to be excavated, the risk is low; if a base has to come out, spoil has to be removed or services cross the work area, it is not. Size it against preparation risk rather than against habit.',
    },
    {
      q: 'Is it cheaper to do the work myself?',
      a: 'Material cost is the same either way. What changes is labour, equipment hire and time, and also what happens if something needs redoing. The honest version of this question is whether the tasks you would be doing need skill, machinery or a specification — and those are the ones worth paying for.',
    },
    {
      q: 'Why does the tool not include labour?',
      a: 'Because labour is site-specific: ground conditions, access, height and the local market all change it, and none of those can be inferred from a material quantity. The calculators plan material and apply prices you enter; labour is yours to add, at whatever rate applies to your project.',
    },
    {
      q: 'Can I phase a landscaping project to spread the cost?',
      a: 'Yes, and it often makes sense to sequence preparation and structure first, with finishes later. What phasing costs is deliveries: each phase means another delivery charge, and each return visit costs setup time. Whether it saves money depends on the size of the delivery minimums involved.',
    },
  ],
  limitations:
    'This page is budgeting guidance, not a quotation. It cannot tell you what anything will cost in your area, and it does not account for taxes, permits, professional fees, disposal charges, or site conditions that only a visit reveals. Material prices in the worked example are illustrative entries. Quantities are estimates produced from the measurements you enter. For contractual, regulated or load-bearing work, obtain written quotes and the professional input the work requires.',
  related: [
    { href: '/projects', label: 'Project Mode', note: 'Combine every calculator result into one plan and total' },
    { href: '/projects/outdoor-project-cost-planning', label: 'Project guide: outdoor project cost planning' },
    { href: '/projects/how-to-calculate-landscaping-materials', label: 'Project guide: landscaping materials workflow' },
    { href: '/costs/paver-patio-cost', label: 'Cost guide: paver patio cost' },
    { href: '/costs/gravel-driveway-cost', label: 'Cost guide: gravel driveway cost' },
    { href: '/costs/fence-cost', label: 'Cost guide: fence cost' },
    { href: '/costs/deck-cost', label: 'Cost guide: deck cost' },
    { href: '/costs/mulch-cost', label: 'Cost guide: mulch cost' },
    { href: '/costs/gravel-cost', label: 'Cost guide: gravel cost' },
    { href: '/methodology', label: 'How the calculation engine works' },
  ],
  primaryCalculator: 'topsoil-calculator',
  relatedCalculators: ['gravel-calculator', 'mulch-calculator', 'paver-base-calculator'],
};
