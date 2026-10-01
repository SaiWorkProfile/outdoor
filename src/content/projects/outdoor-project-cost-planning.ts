import type { ContentPage } from '../types';
import { bulkExample, money, PURCHASE_ADVICE_TEXT } from '../shared';

export const page: ContentPage = {
  cluster: 'projects',
  slug: 'outdoor-project-cost-planning',
  path: '/projects/outdoor-project-cost-planning',
  h1: 'Outdoor project cost planning',
  metaTitle: 'Outdoor Project Cost Planning: Build a Real Budget from Quantities',
  metaDescription:
    'Plan an outdoor project budget from measured quantities: materials, delivery, labour, waste and site access, using prices you enter yourself.',
  eyebrow: 'Budget planning pillar',
  crumb: 'Outdoor project cost planning',
  lede:
    'A useful outdoor project budget is built in two halves: quantities you calculate, and prices you enter from real quotes. This page covers both — which cost categories a project actually contains, why online estimates vary so widely, and how to turn a set of calculator results into a shopping list with a running total.',
  keyFacts: [
    { label: 'Quantities', value: 'Calculated from your measurements' },
    { label: 'Prices', value: 'Entered by you, never invented here' },
    { label: 'Typical categories', value: 'Material, delivery, labour, equipment, waste' },
    { label: 'Most underestimated', value: 'Site preparation and access' },
    { label: 'Where it lands', value: 'A shopping list with a running total' },
    { label: 'Tool', value: 'Project Mode (browser-local)' },
  ],
  sections: [
    {
      id: 'two-halves',
      heading: 'Why quantities and prices have to be kept apart',
      blocks: [
        {
          kind: 'p',
          text: 'Material costs are local, seasonal and product-specific. A published national average is almost never the price you will be quoted, because it carries no information about your supplier, your distance from the quarry or depot, the quantity you are buying, or how the load has to be placed. That is why this site never publishes a market price.',
        },
        {
          kind: 'p',
          text: 'Splitting the problem is what makes a budget reliable. The quantity side is arithmetic and can be tested and repeated; the price side is a phone call or an online quote. Keep them separate and a wrong quantity does not hide inside a plausible-looking total.',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'No prices are invented anywhere on this site',
          text: 'Every cost figure in these calculators comes from a number you type in. If a component has no price, the calculator says the estimate is incomplete rather than guessing.',
        },
      ],
    },
    {
      id: 'categories',
      heading: 'The cost categories a project actually contains',
      blocks: [
        {
          kind: 'p',
          text: 'Material is the category people plan for and the one that rarely surprises. The others are where budgets move, and they are also the categories most often missing from a quick online estimate.',
        },
        {
          kind: 'table',
          table: {
            caption: 'What a project budget contains, and what it leaves out',
            head: ['Category', 'What belongs in it', 'Often missed'],
            rows: [
              ['Material', 'Every layer and component, at the quantity you calculated', 'Edge restraint, bedding sand, fasteners, waste allowance'],
              ['Delivery', 'Each load, and any charge for placement rather than tip', 'Multiple loads, or a second trip after a shortfall'],
              ['Labour', 'Your own time, or a contractor at a day rate, linear rate or fixed price', 'Preparation, clean-up and waste removal as separate activities'],
              ['Equipment', 'Excavator, compactor, mixer, skip, cutting tools', 'Compactor hire, and the cost of getting equipment to site'],
              ['Site preparation', 'Excavation, spoil removal, subgrade work, temporary access', 'Spoil removal and disposal charges'],
              ['Consumables', 'Landscape fabric, pegs, string, blades, protective sheets', 'Almost always'],
              ['Contingency', 'A held-back amount for what the ground reveals', 'Determined by what you find, not by a percentage'],
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Excavation is the classic under-estimate',
          text: 'A project that requires soil or spoil to be removed has a cost that has nothing to do with the material being installed. Ask where the spoil goes and what it costs to take it away before comparing quotes that only price new material.',
        },
      ],
    },
    {
      id: 'your-prices',
      heading: 'How user-entered pricing works in these calculators',
      blocks: [
        {
          kind: 'p',
          text: 'Each calculator has price fields, and they behave the same way everywhere: a unit price multiplied by the calculated quantity, plus any delivery fee. Nothing happens until you enter a number, and the cost rows appear only when you do.',
        },
        {
          kind: 'table',
          table: {
            caption: 'How a price becomes a total',
            head: ['You enter', 'The calculator does', 'What appears'],
            rows: [
              ['A price per cubic yard', 'Multiplies it by the order quantity, rounded up as a supplier would round it', 'A material cost line and the delivery fee'],
              ['A price per ton', 'Multiplies it by the estimated tonnage', 'A cost line on a weight basis, for comparing against a volume quote'],
              ['A price per bag', 'Multiplies it by the bag count for that bag size', 'A cost line per bag, which is how most people buy small quantities'],
              ['A delivery fee', 'Adds it once to the order, not per unit', 'A total that includes delivery'],
              ['Nothing at all', 'Leaves the cost rows out and marks the estimate as incomplete', 'A visible gap rather than a silent zero'],
            ],
          },
        },
      ],
    },
    {
      id: 'why-estimates-vary',
      heading: 'Why two online estimates for the same job differ',
      blocks: [
        {
          kind: 'ul',
          items: [
            'Different inclusions. One estimate prices the material, another prices material plus delivery plus labour. The totals are not comparable until the inclusions match.',
            'Different quantities. A surface-area estimate that ignores a compacted base is a fraction of the real quantity, not a cheaper supplier.',
            'Different units. A per-ton quote and a per-cubic-yard quote for the same stone differ by roughly the density factor, which is about 40% at typical aggregate densities.',
            'Different depths. A 2 in and a 3 in cover over the same area are different jobs, and neither estimate is wrong without the depth attached.',
            'Different waste assumptions. A quote with no allowance for cuts and breakage is a quote that expects you to come back for more.',
            'Different site conditions. Access, spoil removal and subgrade work are site-specific, so a national figure cannot include them.',
          ],
        },
        {
          kind: 'p',
          text: 'The practical response is to normalise every quote to the same quantity and the same inclusions. That is what a shopping list with quantities does: it turns a set of quotes into a like-for-like comparison.',
        },
      ],
    },
    {
      id: 'project-size',
      heading: 'How project size changes the mix',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'What dominates the budget at different scales',
            head: ['Project scale', 'What usually dominates', 'Where the risk sits'],
            rows: [
              ['A bed or a tree ring', 'Material', 'Time, rather than money; a few extra bags is the whole risk'],
              ['A walkway or a small patio', 'Material, plus delivery if a bulk load is involved', 'The delivery minimum may exceed the material cost'],
              ['A driveway or a large patio', 'Base material, excavation and delivery', 'Site preparation and what the ground turns out to be'],
              ['A deck, fence or structure', 'Framing, hardware and labour', 'Specification and site-specific design requirements'],
              ['A whole garden refurbishment', 'Preparation, labour and disposal', 'Scope creep, and the cost of removing what is already there'],
            ],
          },
        },
        {
          kind: 'p',
          text: 'The pattern is consistent: the larger the project, the smaller the share of the budget that the visible finish material represents. That is why planning from the ground up — preparation, then structural layers, then finish — is cheaper than planning from a photograph.',
        },
      ],
    },
    {
      id: 'shopping-list',
      heading: 'Turning calculations into a project and a budget',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: 'Calculate each material once', body: 'Use the calculator that matches the material and enter your own measurements. Do not estimate the same area twice.' },
            { title: 'Add the result to the project', body: 'Adding a result to Project Mode records its quantities, assumptions and notes, so the whole job stays in one place.' },
            { title: 'Enter prices as quotes arrive', body: 'A price entered anywhere in the project flows into the running total; a missing price stays visible instead of being treated as zero.' },
            { title: 'Add the categories with no calculator', body: 'Delivery, equipment hire, disposal, permits and labour are recorded as notes or entered as flat amounts, so the total is not quietly incomplete.' },
            { title: 'Print the plan', body: 'The printable view produces a project plan with dimensions, quantities, assumptions, entered costs and a shopping list to take to the supplier.' },
          ],
        },
        {
          kind: 'example',
          id: 'gravel-cost-example',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'Illustrative price, not a market price',
          text: 'The price in that example exists only to demonstrate the arithmetic. Replace it with your own supplier figure; the calculator does not know or publish what material costs in your area.',
        },
      ],
    },
    {
      id: 'mistakes',
      heading: 'Budget mistakes worth avoiding on purpose',
      blocks: [
        {
          kind: 'table',
          table: {
            caption: 'Cost-planning mistakes',
            head: ['Mistake', 'Effect', 'Better approach'],
            rows: [
              ['Comparing quotes with different inclusions', 'The cheapest-looking quote is often the least complete one', 'Ask each supplier what is and is not included, then compare the same scope'],
              ['Leaving the delivery or equipment line at zero', 'The total looks achievable and then is not', 'Add known fixed costs early, even as estimates'],
              ['Treating your own labour as free', 'The project takes three weekends and there is no room in the budget for a hired machine', 'Value your time at something, or at least list the tasks and their duration'],
              ['Pricing the finish material before the structural layers', 'The expensive part of the job is discovered last', 'Price base, bedding and preparation first; they are the least optional'],
              ['Reusing one area for several materials without recalculating', 'A small measurement error propagates through the whole budget', 'Measure each area once and enter it into each calculator deliberately'],
              ['Assuming the cheapest quantity fits the shortest delivery', 'A load that cannot reach the work area costs more in labour than it saved', 'Check access before optimising quantity'],
            ],
          },
        },
      ],
    },
    {
      id: 'next',
      heading: 'Where to go next',
      blocks: [
        {
          kind: 'links',
          title: 'Cost guides',
          items: [
            { href: '/costs/landscaping-project-cost', label: 'Landscaping project cost: the full breakdown' },
            { href: '/costs/gravel-cost', label: 'Gravel cost: what changes the price' },
            { href: '/costs/mulch-cost', label: 'Mulch cost: bagged versus bulk' },
            { href: '/costs/fence-cost', label: 'Fence cost: component by component' },
            { href: '/costs/paver-patio-cost', label: 'Paver patio cost: what is really in the price' },
            { href: '/costs/gravel-driveway-cost', label: 'Gravel driveway cost: preparation to surface' },
            { href: '/costs/deck-cost', label: 'Deck cost: framing, decking and labour' },
          ],
        },
        {
          kind: 'links',
          title: 'Turn a quote into a plan',
          items: [
            { href: '/projects', label: 'Project Mode', note: 'Combine calculator results into one plan, total and shopping list' },
            { href: '/projects/how-to-calculate-landscaping-materials', label: 'Landscaping materials workflow', note: 'The measurement process that feeds every calculator' },
            { href: '/calculators', label: 'All calculators' },
          ],
        },
      ],
    },
  ],
  workedExamples: [
    bulkExample({
      id: 'gravel-cost-example',
      title: 'Gravel costs at a price you enter yourself',
      scenario:
        'A 20 ft × 30 ft gravel surface at 3 in deep, priced with an illustrative 40.00 per cubic yard and a 60.00 delivery fee that a reader replaces with their own supplier quote. These figures exist to demonstrate the arithmetic, not to suggest what material costs, and they are formatted in whichever currency the reader selects in the header.',
      conclusion:
        'The pattern to notice is that cost is calculated from the rounded order quantity rather than the raw volume, and that delivery is added once rather than per unit. That is why a small order and a slightly larger one can cost nearly the same delivered, and why comparing a per-yard price without a delivery figure is an incomplete comparison.',
      material: 'gravel',
      areas: [{ kind: 'rectangle', length: 20, width: 30 }],
      depthIn: 3,
      useCase: 'patio',
      pricing: { perCuYd: 40, deliveryFee: 60 },
    }),
  ],
  faq: [
    {
      q: 'Why does this site not publish average material prices?',
      a: 'Because material prices are local, seasonal and quantity-dependent, and a published average carries no information about your supplier, your distance from the depot, the volume you are buying or the site access. A price you obtain yourself is more accurate every time. The calculators supply the quantity; the price comes from you.',
    },
    {
      q: 'How should I budget labour for my own project?',
      a: 'Two honest options. Enter a contractor rate if you are hiring, or, if you are doing the work, list the tasks and decide how many days each takes. The second option rarely changes the cash budget, but it changes the plan: it shows where hiring a machine would pay for itself in time saved.',
    },
    {
      q: 'What percentage contingency should I add?',
      a: 'No single percentage is right. Excavation, subgrade surprises and access problems are the usual sources of overrun, so the contingency should follow what you cannot see. If nothing has to be dug, the risk is low; if a base has to come out or spoil has to be removed, it is not.',
    },
    {
      q: 'Can I save money by ordering a single mixed delivery?',
      a: 'Sometimes, if everything is needed at the same time and can be placed separately. The risks are paying for delivery that then has to be re-handled, and having no way to separate materials once they are tipped together. Compare the delivery saving against the labour cost of sorting and moving material by hand.',
    },
    {
      q: 'Does Project Mode store my prices anywhere online?',
      a: 'No. Project Mode runs in your browser and keeps the project locally. There is no account, no database and no server-side storage; the project exists on the device where you built it, which is also why the print view can be produced without a login.',
    },
  ],
  limitations:
    'This page is budgeting guidance, not a quotation or a market price list. It cannot tell you what material, delivery, labour or equipment will cost in your area, and it does not account for permits, professional fees, engineering, disposal charges or tax. The calculators compute quantities and apply the prices you supply; the completeness of a budget depends entirely on whether every category has been listed. For contractual or regulated work, obtain written quotes and any professional advice the work requires.',
  related: [
    { href: '/projects', label: 'Project Mode', note: 'Build the project, total and shopping list in your browser' },
    { href: '/costs/landscaping-project-cost', label: 'Cost guide: landscaping project cost' },
    { href: '/projects/how-to-calculate-landscaping-materials', label: 'Project guide: landscaping materials workflow' },
    { href: '/projects/how-to-plan-a-gravel-driveway', label: 'Project guide: planning a gravel driveway' },
    { href: '/projects/how-to-plan-a-fence', label: 'Project guide: how to plan a fence' },
    { href: '/projects/how-to-plan-a-paver-patio', label: 'Project guide: how to plan a paver patio' },
    { href: '/how-it-works', label: 'How the platform works' },
    { href: '/methodology', label: 'Calculation methodology' },
  ],
  primaryCalculator: 'fence-cost-calculator',
  relatedCalculators: ['gravel-calculator', 'concrete-calculator', 'paver-patio-calculator'],
};
