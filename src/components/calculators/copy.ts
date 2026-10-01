import type { CalculatorSlug } from './registry';

/**
 * Page copy for the 16 calculator pages.
 *
 * The calculators share one presentation architecture (that is intentional);
 * what differs is the search intent and the explanation each page carries.
 * Every field here is written per calculator so that one canonical URL can
 * cover its whole query cluster without duplicate routes or keyword stuffing.
 *
 * This file holds text only — no engine logic, no formulas, no prices.
 */
export interface CalculatorCopy {
  /** One-line description used in calculator lists and cross-page link cards. */
  shortDescription: string;
  /** Unique <title> content; the layout template appends " | MeasureToBuild". */
  metaTitle: string;
  /** Unique meta description: what can be calculated, outputs and use cases. */
  metaDescription: string;
  /** 100–180 word introduction rendered under the H1. */
  intro: string;
  /** "What this calculator calculates" — the concrete outputs of the tool. */
  outputs: string[];
  /** Genuinely relevant project types for this calculator. */
  useCases: Array<{ label: string; detail: string }>;
  /** Output-specific explanations (units, calculated vs ordered, cost scope). */
  outputNotes: Array<{ label: string; text: string }>;
  /** Calculator-specific practical guidance. */
  planning: string[];
  /** Calculator-specific mistakes to avoid. */
  mistakes: string[];
  /** 5–8 genuinely useful, intent-matching questions. */
  faq: Array<{ q: string; a: string }>;
}

export const CALCULATOR_COPY: Record<CalculatorSlug, CalculatorCopy> = {
  'gravel-calculator': {
    shortDescription: 'Calculate gravel volume, tons, bags, waste and cost.',
    metaTitle: 'Gravel Calculator — Cubic Yards, Tons & Cost',
    metaDescription:
      'Calculate gravel in cubic feet, cubic yards and tons for driveways, walkways, patios and paths, with bag counts, waste and cost from your own price.',
    intro:
      'Working out how much gravel you need starts with a measurement: enter the length and width of each area (or a square footage you already know), choose how deep the gravel should sit, and the calculator turns that into the quantities you order. It reports total area, volume in cubic feet and cubic yards, an estimated weight in tons based on a typical density, bag counts for common bag sizes, and a bag-versus-bulk suggestion. A waste allowance is applied before the recommended order quantity, and if you have a supplier price you can see a material cost estimate as well. The page is built for homeowners and tradespeople planning a driveway surface layer, a walkway, a gravel patio, a garden path or general landscaping fill who want defensible numbers before they call a yard.',
    outputs: [
      'Total area in square feet, with multiple shapes added together',
      'Volume in cubic feet and cubic yards, before and after waste',
      'Recommended order volume rounded up to the nearest 0.25 cubic yards',
      'Estimated tons (and tonnes) from the density you enter or the default',
      'Bag counts for common bag sizes, plus a bag or bulk purchase hint',
      'Material cost estimate built only from the price you enter yourself',
    ],
    useCases: [
      { label: 'Driveway surface layer', detail: 'A single wearing course over an existing drive. Full base, middle and surface layering is planned in the Driveway Gravel Calculator.' },
      { label: 'Walkways and garden paths', detail: 'Firm, well-drained foot routes where 2–4 in over a prepared base is the usual planning range.' },
      { label: 'Gravel patio and seating areas', detail: 'Loose surface over a compacted base, calculated here separately from the base material itself.' },
      { label: 'Landscaping beds and general fill', detail: 'Decorative cover around plants, between pavers, or utility fill where depth changes across the site.' },
    ],
    outputNotes: [
      { label: 'Cubic yards versus tons', text: 'Volume is what you measure; weight is what many suppliers bill. The tons figure comes from the density in use, so ask what density the product actually has before comparing a weight quote with a volume quote.' },
      { label: 'Calculated volume versus order quantity', text: 'The calculated volume is the exact space your depth fills. The recommended order volume adds waste and any compaction factor, then rounds up to a quarter cubic yard because suppliers do not sell fractions of a yard.' },
      { label: 'Bags versus bulk delivery', text: 'Below about half a cubic yard, bags are usually simpler. Above a couple of cubic yards a bulk load normally costs less per unit. The advice line is a planning hint rather than a rule.' },
      { label: 'Material cost versus total cost', text: 'The cost figure multiplies your quantity by your price. Delivery, removal of spoil and labour are not included unless you add them yourself in Project Mode.' },
    ],
    planning: [
      'Pick depth from the job: about 2 in for decorative cover, 3–4 in for paths and loose patio surfaces, deeper for drives that carry vehicles.',
      'Measure each separate area on its own and let the form add them up — one rectangle rarely covers an irregular yard.',
      'Allow 5–10% waste on straight runs and more where curves, edging or hand cutting dominate the job.',
      'Take the density from your supplier if they publish one; stone type and moisture move the weight more than most people expect.',
      'Remember that loose gravel settles, so a surface laid at the thin end of the range can stay thin.',
    ],
    mistakes: [
      'Reading a cubic-yard figure and a ton figure as the same number — they only agree at the density the calculator used.',
      'Ordering the exact calculated volume with no waste, then finding the last few metres of path need another bag.',
      'Applying a decorative-stone density to a compactable base material and getting a weight that is far off.',
      'Calculating the surface layer but forgetting the base underneath it, which usually takes more material than the surface.',
      'Treating the estimate as delivered — confirm the load fee and minimum order separately with the supplier.',
    ],
    faq: [
      { q: 'How do I calculate how much gravel I need?', a: 'Measure length and width of each area, multiply for square feet, multiply by the depth in feet for cubic feet, then divide by 27 for cubic yards. The calculator does those steps, adds waste and shows an order quantity.' },
      { q: 'Is gravel measured in cubic yards or tons?', a: 'Both are common. Suppliers selling by volume use cubic yards; many quote by the ton. This page shows both numbers so you can compare either kind of quote.' },
      { q: 'How deep should I plan for gravel?', a: 'Decorative cover is often around 2 in, paths and loose patios 3–4 in, and vehicle surfaces deeper over a prepared base. Traffic, drainage and stone size all shift the right number.' },
      { q: 'How much waste should I allow?', a: 'Ten percent is the default and suits most rectangular jobs. Raise it for curves, extensive edging, or a site where material is lost over the sides.' },
      { q: 'How do I convert cubic yards of gravel into tons?', a: 'Multiply cubic yards by the density in tons per cubic yard. The calculator uses a typical value near 1.35–1.4 for gravel, but the supplier product may differ.' },
      { q: 'Can I calculate multiple areas at once?', a: 'Yes. Add rectangles, circles, triangles or a known square footage and the engine totals the area before applying depth, waste and density.' },
      { q: 'Can this calculator estimate cost?', a: 'It can, but only from a price you enter per cubic yard, ton or bag. It never invents a market price, and delivery stays outside the figure unless you account for it separately.' },
    ],
  },
  'mulch-calculator': {
    shortDescription: 'Plan mulch coverage by depth, cubic yards and bags.',
    metaTitle: 'Mulch Calculator — Cubic Yards, Bags & Cost',
    metaDescription:
      'Work out how much mulch you need for garden beds, tree rings and borders: coverage by depth, cubic yards, bag counts and cost from your own price.',
    intro:
      'This mulch calculator converts a bed measurement and a chosen depth into the volume you need to buy, so you can plan garden beds, tree rings and border top-ups before you shop. Enter one or more bed shapes — rectangles, circles or a known square footage — set the depth in inches, and the tool returns area, cubic feet, cubic yards, an estimated weight and bag counts for common bag sizes. Depth comparison is the point of the page: the same bed at 2 in, 3 in and 4 in gives noticeably different order quantities, and seeing them side by side stops you buying short or over-ordering. A waste allowance and your own price per bag or per cubic yard turn the quantity into a cost estimate. It suits DIY gardeners and landscapers who need coverage and quantity answers for mulch rather than a guess from the back of the bag.',
    outputs: [
      'Bed area in square feet, with several bed shapes combined',
      'Volume in cubic feet and cubic yards at your chosen depth',
      'Depth comparison so 2 in, 3 in and 4 in can be weighed up',
      'Estimated weight from the configured mulch density',
      'Bag counts at common fill volumes, with a bag or bulk hint',
      'Cost estimate from the bag or cubic-yard price you enter',
    ],
    useCases: [
      { label: 'Garden beds and borders', detail: 'The standard 2–4 in top layer around plants, held back from stems and crowns.' },
      { label: 'Tree rings', detail: 'A shallow, wide circle of cover that needs care near the trunk and root flare.' },
      { label: 'Playground and path surfacing', detail: 'Deeper, softer coverage where the depth choice matters more than in a decorative bed.' },
      { label: 'Replacing a thin or patchy layer', detail: 'Measure the existing cover and top up only the depth you actually need to add.' },
    ],
    outputNotes: [
      { label: 'Coverage versus volume', text: 'A bag advertises coverage at a stated depth. Coverage shrinks as depth grows: halving the depth roughly doubles the area one bag covers. Area, depth and volume results let you check the label against your own bed.' },
      { label: 'Cubic yards versus bags', text: 'Cubic yards describe the loose volume delivered or hauled; bags are a fixed fill volume you carry. Below about half a cubic yard bags are practical, above it bulk is usually cheaper per unit.' },
      { label: 'Settling and compaction', text: 'Fresh mulch is fluffy and settles after rain. The order quantity includes your waste allowance, which is the practical way to cover settling without ordering twice.' },
      { label: 'Weight is an estimate', text: 'Mulch density varies with moisture and product, and wet mulch weighs far more than dry. Treat the tonnage as a rough guide for transport, not a scale figure.' },
    ],
    planning: [
      'Set depth per feature: 2–3 in over most beds, no more than about 4 in, and keep a gap at trunks and plant crowns.',
      'Measure the bed, not the mulch pile — inside curves and irregular borders are easier to measure as several simple shapes.',
      'Compare the bag fill volume printed on the product with the cubic-yard result before deciding how many bags to carry home.',
      'Buy by the cubic yard once the job passes a couple of cubic yards; bag carrying cost adds up quickly at that scale.',
      'Plan where the mulch meets hard surfaces, because edges and corners are where depth calculations are hardest to hold to.',
    ],
    mistakes: [
      'Using one depth for every feature in the garden and finding half the mulch was unnecessary.',
      'Piling mulch against tree trunks — the depth guidance is for the bed, not for the root flare.',
      'Trusting a coverage figure that was quoted at a different depth than the one you plan to lay.',
      'Ignoring that wet mulch weighs considerably more than the dry density the calculator assumes.',
      'Forgetting the waste allowance when the bed is full of curves, edging and obstacles to cut around.',
    ],
    faq: [
      { q: 'How much mulch do I need?', a: 'Measure the bed area, choose a depth in inches and calculate. Area times depth gives cubic feet; divide by 27 for cubic yards, then add the waste allowance the calculator applies.' },
      { q: 'What depth should mulch be?', a: 'Most beds take 2–3 in, with 4 in at the deep end. Use-case ranges on the page flag when a chosen depth sits outside normal guidance for that feature.' },
      { q: 'How many bags of mulch are in a cubic yard?', a: 'It depends on the bag fill volume. The calculator shows counts for the common bag sizes of this material, so a 2 cu ft bag and a 3 cu ft bag give different totals.' },
      { q: 'How much area does one bag of mulch cover?', a: 'Coverage depends entirely on depth. Halving the depth roughly doubles the coverage, which is why the depth comparison result is more useful than a single coverage figure.' },
      { q: 'Should I enter a price per bag or per cubic yard?', a: 'Whichever the supplier sells by. Enter it in the matching price field and the estimate only prices the quantity you calculated, with no delivery included.' },
      { q: 'Can I calculate several beds in one go?', a: 'Yes. Add each bed as its own shape and the total area carries the same depth, waste and pricing assumptions across the whole job.' },
    ],
  },
  'topsoil-calculator': {
    shortDescription: 'Estimate topsoil for lawns, gardens and raised beds.',
    metaTitle: 'Topsoil Calculator — Garden, Lawn & Raised Bed Yards',
    metaDescription:
      'Estimate topsoil for garden beds, new lawns, raised beds and lawn top-dressing: cubic yards, bags, waste and cost from the price you enter.',
    intro:
      'Topsoil is bought by volume, so the job of this calculator is to turn ground measurements into cubic yards you can order with confidence. Enter the area being filled — a garden bed, a new lawn, a raised bed or a patch being top-dressed — set the depth of soil you intend to add, and the tool returns area, cubic feet, cubic yards, bag counts and an order quantity that already includes a waste allowance. Use-case presets matter here: a raised bed is filled to its inside height, a new lawn wants several inches worked into the surface, and a top-dressing is a thin measured layer over existing turf. Choosing the preset shows the depth range that fits that job and warns when your input sits outside it. The result is aimed at gardeners, landscapers and homeowners planning a soil purchase who need to know how many yards or bags to have delivered.',
    outputs: [
      'Area in square feet for the ground being covered or filled',
      'Volume in cubic feet and cubic yards at your chosen depth',
      'Recommended order quantity with waste already included',
      'Bag counts at the common topsoil bag sizes, plus bag or bulk advice',
      'Depth-range feedback for the selected use case (garden, lawn, raised bed)',
      'Cost estimate from the per-yard or per-bag price you enter',
    ],
    useCases: [
      { label: 'Garden beds', detail: 'Depth to add on top of what is already there — measure what you are adding, not what the soil profile already holds.' },
      { label: 'New lawn preparation', detail: 'Several inches worked into the prepared ground before seeding or turfing.' },
      { label: 'Raised bed fill', detail: 'Calculated from the inside length, width and fill height of the bed, allowing for settling.' },
      { label: 'Lawn top-dressing', detail: 'A thin measured layer over existing turf, usually well under an inch at a time.' },
    ],
    outputNotes: [
      { label: 'Depth to add versus depth present', text: 'The calculator estimates soil you bring in. If existing soil is already loose or amended, subtract that depth instead of doubling up — the use-case note explains how to treat each situation.' },
      { label: 'Cubic yards versus bags', text: 'Bulk topsoil is sold by the cubic yard or by the load; bags give a fixed volume you carry. The bag counts and the bag-or-bulk hint show where each option stops being convenient.' },
      { label: 'Order quantity versus exact volume', text: 'The order figure rounds the waste-inclusive volume up to a quarter cubic yard, because suppliers sell in those increments rather than in exact fractions.' },
      { label: 'Settling and moisture', text: 'Soil settles after spreading and holds water, so weight varies. Treat the tonnage and any weight-based quote as an estimate until the supplier confirms their product.' },
    ],
    planning: [
      'Choose the use-case preset first so the depth guidance matches the job you are actually doing.',
      'For raised beds, measure the inside dimensions and expect the fill to settle after the first few waterings.',
      'Separate existing soil depth from the depth you intend to add; double counting here is the most common over-order.',
      'Spread thin layers and rake rather than dumping a full depth in one pass, especially on lawns.',
      'Confirm whether the supplier sells by cubic yard, load or bag before you compare two prices.',
    ],
    mistakes: [
      'Using outside planter dimensions for a raised bed and ending up short on fill.',
      'Applying lawn top-dressing depths to a new planting bed, where far more soil is needed.',
      'Assuming every supplier bag has the same fill volume when counting how many to buy.',
      'Ordering for both the existing soil and the soil to be added, effectively paying for the same layer twice.',
      'Comparing a weight-based quote against a volume-based calculation without a density to convert between them.',
    ],
    faq: [
      { q: 'How much topsoil do I need for a garden bed?', a: 'Measure the bed length and width, multiply for square feet, multiply by the depth of soil to add in feet, then divide by 27 for cubic yards. The calculator adds the waste allowance for you.' },
      { q: 'How much topsoil do I need for a raised bed?', a: 'Use the inside length, inside width and the fill height. Account for settling by keeping the waste allowance, and select the raised-bed preset so the depth guidance fits.' },
      { q: 'How many inches of topsoil does a new lawn need?', a: 'Planning ranges on the page start around 3 in and go up from there, depending on what is already under the prepared ground. The preset warns if your depth falls outside that range.' },
      { q: 'How many bags of topsoil equal a cubic yard?', a: 'Divide 27 cubic feet by the bag fill volume. The calculator lists counts for common bag sizes so you can compare carrying bags against a bulk delivery.' },
      { q: 'Is topsoil heavier than the estimate shows?', a: 'It can be. Moisture and composition change the weight, so treat the tonnage as planning information and ask the supplier for their figure when a quote is weight-based.' },
      { q: 'Can this calculate soil for several areas at once?', a: 'Yes. Add each area separately and the totals share one depth, waste setting and price, which is useful for a garden and lawn planned together.' },
    ],
  },
  'soil-calculator': {
    shortDescription: 'Estimate general soil or fill by area and depth.',
    metaTitle: 'Soil Calculator — Garden Soil Volume in Cubic Yards',
    metaDescription:
      'A general soil volume calculator for garden, fill and landscaping areas: area, cubic feet, cubic yards, tons and bag counts from your dimensions.',
    intro:
      'Where the topsoil calculator is tuned to growing layers, this soil calculator is the general-purpose tool: any outdoor area where material is sold by volume or weight. Give it one or more shapes, the depth the material needs to sit at, and an optional supplier density, and it works out area, cubic feet, cubic yards, an estimated tonnage and bag counts, then rounds the order volume up for purchasing. It handles garden soil mixes, screened fill, planting substrate and ordinary earth replacement equally well, because the engine only needs geometry, depth and density. A waste allowance is applied before the recommended order quantity, and a price field turns the volume into a material cost if you already have quotes. It is aimed at anyone who knows the material they are buying but not how much of it the space will take — from a weekend gardener filling a bed to a landscaper pricing bulk fill.',
    outputs: [
      'Combined area in square feet across every shape entered',
      'Volume in cubic feet and cubic yards at the entered depth',
      'Estimated tons using the default density or your supplier figure',
      'Order quantity rounded up after the waste allowance is applied',
      'Bag counts for common bag sizes of this material',
      'Material cost from the unit price you enter',
    ],
    useCases: [
      { label: 'Garden and planting beds', detail: 'Replacing or topping up the soil layer where plants will actually grow.' },
      { label: 'Bulk fill and low spots', detail: 'Bringing ground level up or filling excavations with screened or ordinary fill material.' },
      { label: 'Planters and large containers', detail: 'Volume by inside dimensions, with extra allowance because containers settle quickly.' },
      { label: 'Landscaping rebuilds', detail: 'Reinstating soil after works, when the depth to add varies from area to area.' },
    ],
    outputNotes: [
      { label: 'Density changes the weight, not the volume', text: 'Cubic yards come from geometry alone. Tons come from density, so garden mix, damp fill and dry screened soil can give three different weights for the same yard count.' },
      { label: 'Soil is not the same as topsoil', text: 'The general engine does not assume a growing layer. If the job is specifically a lawn or bed amendment, the topsoil page carries the depth guidance for that use.' },
      { label: 'Calculated versus ordered volume', text: 'The order quantity includes waste and is rounded up to a quarter cubic yard, which is the number to take to a supplier rather than the exact calculated figure.' },
      { label: 'Bags or bulk', text: 'Small volumes are easier as bags; larger ones are cheaper by the yard or load. The purchase advice line shows which side of that line your result falls on.' },
    ],
    planning: [
      'Start from the material name on the supplier invoice and match the density to it rather than to a generic soil value.',
      'Measure every area separately when the fill depth changes; a single average depth hides the areas that need more.',
      'Keep a waste allowance for excavation edges and uneven subgrades, which rarely accept a clean uniform depth.',
      'Order by volume when you can, because weight-based pricing moves with moisture and you cannot see that in advance.',
      'Check whether the material is sold screened or unscreened — the volume is the same, the placement effort is not.',
    ],
    mistakes: [
      'Assuming topsoil and fill dirt share the same density and then receiving a heavier load than planned.',
      'Ordering by weight without confirming what the supplier actually sells by.',
      'Using a planter depth for ground fill, or the reverse, because both are just "soil" on the invoice.',
      'Leaving the density at the default when a specific product figure was available.',
      'Forgetting the waste allowance on areas with irregular edges or soft ground that takes extra material.',
    ],
    faq: [
      { q: 'Can this calculate fill dirt as well as garden soil?', a: 'Yes. The engine only needs area, depth and density, so fill works the same way. Enter a supplier density when you have one, because fill is often heavier than screened garden soil.' },
      { q: 'What density should I use for soil?', a: 'The default is a planning value. If the supplier publishes a tons-per-cubic-yard figure for the actual product, enter it in the density field and the weight estimate follows it.' },
      { q: 'How do I convert cubic yards of soil to tons?', a: 'Multiply the cubic yards by the density in tons per cubic yard. The result panel does this for you and shows which density it used.' },
      { q: 'Is this the right calculator for a raised bed?', a: 'It will give you the volume, but the topsoil page carries raised-bed depth guidance and inside-dimension reminders. Use that one when the job is growing material rather than bulk fill.' },
      { q: 'How much waste should I add for soil?', a: 'The default allowance covers normal trimming and uneven ground. Increase it where the subgrade is rough or where material is lost over the edges of the area.' },
      { q: 'Can I price the soil in this calculator?', a: 'Yes, enter your price per cubic yard, ton or bag. Only the quantity you calculated gets priced, and no market rate is ever filled in for you.' },
    ],
  },
  'sand-calculator': {
    shortDescription: 'Calculate sand for paver bedding, leveling and landscaping.',
    metaTitle: 'Sand Calculator — Cubic Yards, Tons & Paver Bedding',
    metaDescription:
      'Estimate sand for paver bedding, leveling, sandboxes and play areas: cubic feet, cubic yards, tons, bag counts and cost from your own price.',
    intro:
      'Sand is bought in small, precisely defined layers, and this calculator is built around that. Choose what the sand is for — a screeded bedding layer under pavers, a leveling fill, a sandbox or another outdoor use — enter the area and the depth that layer calls for, and the tool returns area, cubic feet, cubic yards, an estimated tonnage and bag counts for common bag sizes, with a waste allowance folded into the order quantity. Each use case carries its own depth range, because a bedding layer measured in single inches and a sandbox measured in feet are entirely different orders even though the arithmetic is the same. If a depth sits outside the range for the selected use, the page says so before you order. The result also accepts your supplier price so a volume can be converted into a cost estimate. It is intended for patio builders, DIYers and anyone who needs sand quantities without guessing how many bags that actually is.',
    outputs: [
      'Area in square feet for the surface the sand covers',
      'Volume in cubic feet and cubic yards at the chosen layer depth',
      'Estimated tons from the sand density you use or the default',
      'Order quantity with waste included and rounded up for purchase',
      'Bag counts for common sand bag sizes, with bag or bulk advice',
      'Cost estimate built from the price you enter per unit',
    ],
    useCases: [
      { label: 'Paver bedding', detail: 'A thin screeded layer under patio or path pavers, planned separately from the compactable base below it.' },
      { label: 'Leveling and filling', detail: 'Correcting uneven ground before a surface goes down, with depth driven by how much correction the site needs.' },
      { label: 'Sandbox and play areas', detail: 'A much deeper fill, where the same engine gives cubic yards and bag counts in feet of depth rather than inches.' },
      { label: 'Pipe bedding and utility backfill', detail: 'Measured lengths and widths of trench where sand is specified around the installation.' },
    ],
    outputNotes: [
      { label: 'Bedding sand is not base', text: 'The depth you enter here is the layer directly under the unit being laid. Base thickness belongs to the paver base calculation; mixing the two is the fastest way to misorder material.' },
      { label: 'Cubic yards versus tons for sand', text: 'Sand is dense and often sold by weight. The tonnage figure uses the density on the page — replace it with the supplier value when their product differs.' },
      { label: 'Exact volume versus order quantity', text: 'Screeding wastes material at edges and corners. The order figure includes your waste allowance and rounds up to a quarter cubic yard for purchasing.' },
      { label: 'Bags for thin layers', text: 'A 1 in bedding layer over a patio is a small volume that bags can cover; the same area at 6 in crosses into bulk territory. The advice line reflects that.' },
    ],
    planning: [
      'Select the use case before entering depth, so the guidance range matches a bedding layer or a sandbox rather than a generic number.',
      'Check the installation system for the bedding thickness it expects; the default is a planning value, not a specification.',
      'Confirm the sand type the job calls for — graded, coarse, play sand and masonry sand are not interchangeable.',
      'Screen and level the area before ordering, because a depth measured over rough ground ends up deeper in the hollows.',
      'Keep bedding sand separate from base material on the order sheet; they are different products with different quantities.',
    ],
    mistakes: [
      'Using base material in place of bedding sand, or bedding sand where the system calls for a compacted base.',
      'Applying a deep leveling layer instead of correcting the base underneath it.',
      'Carrying a paver patio depth over to a sandbox job and under-ordering by a factor of six.',
      'Ignoring that sand is often sold by weight while the calculation starts in volume.',
      'Ordering exactly the calculated volume when screeding and edges will always consume a little more.',
    ],
    faq: [
      { q: 'How much sand do I need for paver bedding?', a: 'Lay the patio area at the screeded thickness your system specifies — often around an inch. Enter area and depth and the calculator returns cubic feet, cubic yards and an order quantity with waste.' },
      { q: 'How much sand is in a cubic yard?', a: 'Twenty-seven cubic feet. The calculator converts that into bag counts for common bag sizes so you can decide whether bags or a bulk load make sense.' },
      { q: 'Is sand sold by the cubic yard or by the ton?', a: 'Both. The page shows volume and weight together, using the density you enter or the default, so either kind of quote can be checked against the same calculation.' },
      { q: 'Should bedding sand and paver base be calculated together?', a: 'No. They have different depths, densities and compaction behaviour. The paver base page handles the compactable layer; this page handles the thin sand layer above it.' },
      { q: 'Can I use this for a sandbox?', a: 'Yes. The sandbox preset provides a separate planning depth range in feet rather than inches, and the same volume, bag and cost outputs follow from it.' },
      { q: 'Does the result include waste?', a: 'Yes, a waste allowance is applied before the order quantity is rounded up. Raise it for lots of edges, curves or a site where material is lost over the sides.' },
    ],
  },
  'pea-gravel-calculator': {
    shortDescription: 'Estimate pea gravel for paths, gardens and patios.',
    metaTitle: 'Pea Gravel Calculator — Coverage, Cubic Yards & Tons',
    metaDescription:
      'Calculate pea gravel for walkways, garden beds and patios: coverage by depth, cubic yards, tons, bag counts and cost using your own measurements.',
    intro:
      'Pea gravel is rounded, loose and easy to underestimate, so this calculator is deliberately explicit about depth. Enter the path, bed or patio area, choose a depth from the use-case guidance — usually a couple of inches for a walkway, a little more where the stone has to stay put — and the page returns area, cubic feet, cubic yards, an estimated weight in tons and bag counts for common bag sizes. Waste is applied before the recommended order quantity, because loose stone migrates at edges and corners no matter how carefully it is spread. The material-specific density keeps the weight figure honest for a smooth, uniform stone that is lighter per yard than crushed product. A price field is included if you want a cost estimate for the load. It suits anyone planning a decorative path, a planting-bed cover, a gravel patio surface or a low-maintenance yard area who needs to know how much to buy in the units the supplier actually sells.',
    outputs: [
      'Area in square feet for the path, bed or surface being covered',
      'Volume in cubic feet and cubic yards at the chosen depth',
      'Estimated tons using the pea gravel density for this material',
      'Recommended order volume with waste included',
      'Bag counts for common bag sizes of rounded stone',
      'Material cost from the price you enter per yard, ton or bag',
    ],
    useCases: [
      { label: 'Walkways and garden paths', detail: 'The everyday use: a shallow, contained layer over a prepared, levelled surface.' },
      { label: 'Planting beds and ground cover', detail: 'A decorative layer around plants and features where drainage matters more than foot traffic.' },
      { label: 'Gravel patio surface', detail: 'Loose stone as a finished surface, planned with edging that keeps it from walking outwards.' },
      { label: 'Play areas and low-maintenance yards', detail: 'Larger covered areas where depth consistency determines how much the yard actually costs.' },
    ],
    outputNotes: [
      { label: 'Coverage varies with depth', text: 'One yard covers less area as depth increases, and rounded stone is usually laid thinner than crushed product. Compare the coverage implied by your depth against supplier figures before ordering.' },
      { label: 'Volume versus weight', text: 'Pea gravel is often quoted per cubic yard, sometimes per ton. The tons figure uses this material density — smooth stone packs differently from angular aggregate, so confirm with the supplier.' },
      { label: 'Loose material needs an edge', text: 'The quantity calculated covers the surface, not the restraint. Edging is a separate purchase, and the waste allowance is there because migration at edges is normal.' },
      { label: 'Ordering bags or bulk', text: 'Small paths are fine with bags; a patio or full yard almost always justifies a bulk load. The purchase advice follows the volume your calculation produces.' },
    ],
    planning: [
      'Pick depth from how the surface is used: 1–2 in for a light path, 2–3 in where the stone has to resist being kicked aside.',
      'Fit edging before spreading, because loose rounded stone finds the lowest edge on the first heavy rain.',
      'Prepare and compact the ground first — pea gravel does not lock together, so the layer underneath does the stabilising.',
      'Ask for coverage per yard from the supplier and compare it with what your chosen depth implies.',
      'Order a little extra rather than exactly the calculated figure; spillage during spreading is normal with small rounded stone.',
    ],
    mistakes: [
      'Assuming pea gravel compacts like a crushed paver base — it does not, and the depth you lay is the depth that stays.',
      'Ignoring migration on slopes or at open edges where nothing holds the stone in place.',
      'Reusing a crushed-gravel density and misreading how heavy the load will be.',
      'Calculating only the visible surface and forgetting the prepared base underneath it.',
      'Laying too thin a layer because the coverage figure sounded generous, then seeing the ground through the stone.',
    ],
    faq: [
      { q: 'How much pea gravel do I need?', a: 'Multiply the area by the depth in feet to get cubic feet, divide by 27 for cubic yards, then add waste. The calculator performs those steps for every shape you enter and shows the order quantity.' },
      { q: 'How deep should pea gravel be?', a: 'Planning ranges on the page run from about 1 in for light cover to 3 in for surfaces that take foot traffic. Drainage, the ground below and the look you want can all move that.' },
      { q: 'How much does a cubic yard of pea gravel cover?', a: 'It depends on depth: a yard covers far more ground at 1 in than at 3 in. Enter your depth and the result shows the area the quantity covers.' },
      { q: 'Is pea gravel sold by the yard or by the ton?', a: 'Either. This page gives both figures using the pea gravel density, so you can compare a volume quote and a weight quote directly.' },
      { q: 'Does pea gravel need a base underneath?', a: 'Usually a prepared, compacted layer keeps it stable. The surface depth you calculate here is separate from that base, which the paver base page can plan.' },
      { q: 'Can I estimate the cost of the stone?', a: 'Yes, enter the supplier price per yard, ton or bag. The estimate covers material only — delivery and edging are separate lines you can add in Project Mode.' },
    ],
  },
  'landscape-rock-calculator': {
    shortDescription: 'Estimate decorative rock by area, depth, tons and yards.',
    metaTitle: 'Landscape Rock Calculator — Coverage, Tons & Yards',
    metaDescription:
      'Plan landscape rock and decorative stone by area and depth: cubic yards, tons, coverage, bag counts and cost for beds, borders and yard features.',
    intro:
      'Landscape rock covers ground permanently, so getting the quantity right the first time matters more than with any material you can simply spread thinner later. This calculator takes the area of the bed, border or yard feature, the depth of decorative stone you intend to lay, and returns area, cubic feet, cubic yards and an estimated weight, along with bag counts and a purchase suggestion. The depth guidance is tied to stone size, because a 2 in cover with small rock and a 4 in cover with larger stone can be solving the same visual problem with very different volumes. Void space — the air between stones — is why coverage per yard drops as rock gets bigger, and the density used reflects typical decorative product rather than dense crushed aggregate. Waste is applied before the order quantity, and your own price turns the result into a material cost. It is aimed at anyone planning a rock bed, a border, a xeriscape area or feature edging who needs yard and ton figures before ordering.',
    outputs: [
      'Ground area in square feet, combining every bed or border shape',
      'Volume in cubic feet and cubic yards at the entered depth',
      'Estimated tons using a typical decorative-rock density',
      'Order quantity after waste, rounded up for purchasing',
      'Bag counts for common bag sizes of decorative stone',
      'Cost estimate from the price you supply per yard or ton',
    ],
    useCases: [
      { label: 'Rock beds and borders', detail: 'Decorative cover around plants, along foundations and in planting beds where mulch is not wanted.' },
      { label: 'Xeriscape and low-water areas', detail: 'Larger drought-tolerant zones where consistent depth determines both the look and the budget.' },
      { label: 'Feature edging and hardscape surrounds', detail: 'Narrow strips beside patios, drives and walkways, calculated as their own areas.' },
      { label: 'Tree and shrub rings', detail: 'Wide, shallow circles that must stay clear of trunks while still reading as deliberate cover.' },
    ],
    outputNotes: [
      { label: 'Stone size changes coverage', text: 'Bigger rock has bigger voids between pieces, so the same yard count covers less ground. Depth guidance on the page shifts with stone size, and the supplier coverage figure is worth checking against it.' },
      { label: 'Cubic yards versus tons', text: 'Decorative stone is quoted both ways. The weight estimate uses this material density — a lighter planning value than crushed aggregate, so a crushed-stone quote will not match.' },
      { label: 'Depth is not a structural decision', text: 'The depth here controls cover and appearance. Anything carrying loads, retaining edge material or sitting on a slope may need a different arrangement entirely.' },
      { label: 'Order quantity versus calculated volume', text: 'Waste and rounding are applied so the number you take to the supplier is buyable. The exact volume remains visible for comparison with coverage tables.' },
    ],
    planning: [
      'Match depth to stone size: smaller rock needs less, while larger pieces need more depth before the ground stops showing through.',
      'Measure irregular beds as several simple shapes instead of trying to average one awkward outline.',
      'Ask the supplier for weight per yard of the specific product; decorative stone varies more than crushed aggregate does.',
      'Plan where the rock meets lawn or paving, because a clean edge prevents both migration and topping-up every season.',
      'Order the full quantity in one delivery when possible — colour and size lots vary between batches.',
    ],
    mistakes: [
      'Using the density of small gravel for large rock and underestimating the load weight.',
      'Forgetting irregular bed shapes and ending up with a yard short on the curves.',
      'Judging depth by eye on a bed that has not been cleared, so the depth is measured from the wrong surface.',
      'Assuming coverage per yard stays constant when the stone size on the order changes.',
      'Treating a decorative depth as if it were a load-bearing layer for a path or driveway.',
    ],
    faq: [
      { q: 'How much landscape rock do I need?', a: 'Enter the bed area and the depth of cover. The calculator converts area times depth into cubic feet and cubic yards, applies waste and shows the quantity to buy.' },
      { q: 'How much does a yard of landscape rock cover?', a: 'Coverage falls as depth rises and as stone size grows. The result reflects the depth you entered, and the supplier per-yard figure is worth comparing against it.' },
      { q: 'Should I order by cubic yard or by ton?', a: 'Use whichever the supplier sells. The page shows both numbers from one calculation, using a decorative-rock density you can replace with their figure.' },
      { q: 'Does rock size change the amount I need?', a: 'Yes. Larger pieces create bigger voids, so coverage and effective depth differ between a 1 in chip and a 3 in stone. Adjust depth for the product you chose.' },
      { q: 'How much waste should I allow for rock?', a: 'The default allowance covers spillage and edges. Raise it where beds are curved, where rock meets turf, or where you are working around obstacles.' },
      { q: 'Can this estimate the cost of the stone?', a: 'It prices only what you enter per yard, ton or bag. Delivery, edging and any weed membrane are separate items to account for in your plan.' },
    ],
  },
  'paver-base-calculator': {
    shortDescription: 'Estimate compactable base material for patios and walkways.',
    metaTitle: 'Paver Base Calculator — Yards, Tons & Compaction',
    metaDescription:
      'Calculate paver base for patios, walkways and drives: compactable aggregate by area and depth, with compaction allowance, cubic yards, tons and cost.',
    intro:
      'The base layer is the part of a paver project nobody sees and everybody under-orders. This calculator works out how much compactable aggregate the prepared area needs: enter the patio, walkway or driveway footprint, choose the base depth, and the engine separates the net volume of material in place from the order volume that accounts for compaction and waste. Both figures are shown, because they answer different questions — the net volume tells you what the finished layer holds, the order volume tells you what to buy once loose material is compacted down. A compaction factor is exposed as an editable assumption rather than buried in the maths, so you can match it to the product and specification you are working to. Density, tons and a price field follow the same pattern as the other bulk pages. It is built for anyone laying pavers who needs the quantity of road base, crushed stone or recycled aggregate below the sand and units, not just the visible surface.',
    outputs: [
      'Prepared area in square feet across all entered sections',
      'Net base volume in cubic feet and cubic yards before compaction',
      'Order volume including the compaction factor and waste allowance',
      'Estimated tons from the base-material density',
      'Bag counts where the volume is small enough for bagged product',
      'Cost estimate from the price you enter per yard or ton',
    ],
    useCases: [
      { label: 'Patio base', detail: 'The standard 6 in planning layer under a domestic paver patio, compacted in lifts.' },
      { label: 'Walkway and path base', detail: 'A thinner prepared layer for foot traffic, where the ground is usually firmer.' },
      { label: 'Driveway base', detail: 'Deeper layers under vehicle loads — the depth needs site-specific judgement, not a default.' },
      { label: 'Step and landing bases', detail: 'Small, precisely measured pads that still need real aggregate below them.' },
    ],
    outputNotes: [
      { label: 'Net volume versus order volume', text: 'Compacted base occupies less space than the loose material you buy. The net figure is the volume in the ground; the order figure adds the compaction allowance and waste so the delivery matches the job.' },
      { label: 'Why compaction is an input', text: 'Different products tighten by different amounts. The default factor is a planning allowance you can change to match the material and the specification you are working to.' },
      { label: 'Base depth versus bedding depth', text: 'The compactable layer and the thin sand bedding above it are separate calculations with separate depths. Adding them together into one figure is a common source of over-ordering.' },
      { label: 'Weight for a load-based order', text: 'Base material is dense and often sold by the ton. The weight estimate uses the density shown on the page — replace it with the supplier figure when they quote a product-specific value.' },
    ],
    planning: [
      'Confirm base depth against the ground conditions and the intended use rather than accepting the default outright.',
      'Place and compact the material in manageable lifts; the compaction allowance assumes the layer is actually compressed.',
      'Measure the prepared footprint after excavation, because the base sits in a wider, deeper hole than the finished surface.',
      'Keep bedding sand out of this calculation and plan it on the sand page with its own thin depth.',
      'Ask the supplier whether their product is sold loose or compacted, then set the compaction factor to match.',
    ],
    mistakes: [
      'Treating compacted volume and loose order volume as the same figure and arriving short on delivery.',
      'Using bedding sand thickness as the base thickness, or the reverse.',
      'Carrying a patio base depth straight into a driveway without considering the vehicle load.',
      'Ordering base by weight using a density from a different aggregate product.',
      'Forgetting that excavation and disposal of existing material sit outside the material quantity entirely.',
    ],
    faq: [
      { q: 'How much paver base do I need?', a: 'Measure the prepared area, choose the base depth and calculate. Area times depth gives the volume; the engine then adds the compaction allowance and waste to produce the order quantity.' },
      { q: 'Why does the calculator show two volumes?', a: 'One is the net volume the compacted layer occupies, the other is the loose material you should buy. Compaction reduces volume, so the two figures are deliberately different.' },
      { q: 'How deep should a paver base be?', a: 'The page defaults to a common patio depth and lets you change it. Ground conditions, climate and the intended load all affect what is right, so treat the default as a starting point.' },
      { q: 'What compaction factor should I use?', a: 'The default is a planning allowance. If your supplier or specification quotes a figure for the product, enter it and the order volume follows that instead.' },
      { q: 'Is paver base sold by cubic yards or tons?', a: 'Both are common for compactable aggregate. The result gives volume and weight together so either quote can be checked.' },
      { q: 'Does this include the bedding sand?', a: 'No. Sand is a separate thin layer with its own page and depth. Planning them apart keeps both quantities accurate.' },
    ],
  },
  'driveway-gravel-calculator': {
    shortDescription: 'Estimate layered driveway base, middle and surface materials.',
    metaTitle: 'Driveway Gravel Calculator — Layers, Yards & Tons',
    metaDescription:
      'Plan a gravel driveway in layers: footprint area, base, middle and surface depths, compaction and waste, with cubic yards, tons, loads and cost.',
    intro:
      'A gravel driveway is not one material at one depth — it is a system of layers, and this calculator is built to plan them separately. Define the driveway footprint as one or more sections (straight run, apron, turnaround), then configure each layer: its own material, depth, compaction factor and, if you have it, a price. Every layer runs through the same bulk engine, so volume, waste, density and cost behave consistently across the job, and the results combine into total cubic yards, total tons and an estimated number of truck loads at the planning capacity you set. Compaction is exposed per layer because the crushed stone under a drive tightens differently from the surface course on top of it. It is intended for homeowners and contractors sizing material for a new drive or a resurfacing, who need quantities to compare quotes and deliveries — not a design for the structure, drainage or subgrade, which are site-specific decisions.',
    outputs: [
      'Driveway footprint area in square feet across all sections',
      'Per-layer depth, volume and order quantity, kept separate',
      'Combined totals in cubic yards for the whole layered job',
      'Total tons across the layers, each with its own density',
      'Estimated truck loads from the planning truck capacity you set',
      'Material cost per layer from entered prices, with completeness flagged',
    ],
    useCases: [
      { label: 'New gravel driveway', detail: 'Base, middle and surface courses planned as one project with separate depths and materials.' },
      { label: 'Resurfacing an existing drive', detail: 'A single surface layer over a drive that is already built, using just the top course.' },
      { label: 'Apron and turnaround areas', detail: 'Extra sections added beside the main run where the geometry or depth changes.' },
      { label: 'Gravel car parks and yards', detail: 'Larger plain areas planned with the same layered approach and load-based depth choices.' },
    ],
    outputNotes: [
      { label: 'Layer totals versus project totals', text: 'Each layer calculates independently and reports its own volume, weight and cost. The project totals sum them, so you can still see what the base alone will cost before anything is ordered.' },
      { label: 'Compaction differs by layer', text: 'The base, middle and surface courses each carry their own compaction factor. Order quantities reflect that, which is why buying every layer at the same loose volume does not work.' },
      { label: 'Loads are a planning estimate', text: 'Truck load counts use the capacity you enter. Actual load sizes depend on the material, the haulier and moisture, so treat the number as a conversation starter with the supplier.' },
      { label: 'Cost completeness', text: 'Prices are only ever yours. If a layer has no price, the total is marked incomplete instead of quietly filling the gap with an assumed rate.' },
    ],
    planning: [
      'Measure the drive as sections — main run, apron, turning area — because depth and geometry rarely stay constant.',
      'Set layer depths deliberately: the surface course is thin, the middle course bridges, and the base carries the load.',
      'Treat drainage and subgrade conditions as site questions; the quantities assume the ground has already been prepared.',
      'Use separate pricing per layer when the materials differ, and check the truck capacity against what the haulier actually runs.',
      'Plan the edge restraint and any geotextile alongside the aggregate — neither appears in a volume calculation.',
    ],
    mistakes: [
      'Using the same depth for every layer and producing a drive that is all surface or all base.',
      'Assuming a driveway is only a surface-gravel calculation when the base is usually the larger quantity.',
      'Treating the truck-load estimate as a guaranteed delivery size or a firm number of trips.',
      'Applying one density across layers made from different products.',
      'Ordering the calculated volume with no allowance for the soft edges and camber of a real drive.',
    ],
    faq: [
      { q: 'How much gravel do I need for a driveway?', a: 'Measure the footprint in sections, set a depth for each layer and calculate. The page sums the layers into total cubic yards and tons while keeping each course visible on its own.' },
      { q: 'How deep should each driveway layer be?', a: 'Depth depends on the ground and the traffic. The defaults are planning values for a typical layered drive — change them to match what the site and your material supplier call for.' },
      { q: 'Why does compaction appear per layer?', a: 'Different courses tighten by different amounts during placement. Each layer carries its own factor so the order quantity reflects how the loose material actually behaves.' },
      { q: 'How many truck loads will I need?', a: 'The estimate divides total order weight by the truck capacity you enter. Confirm the real load size with the haulier, since material and regulations affect it.' },
      { q: 'Can I price each layer separately?', a: 'Yes. Enter a price per ton or per cubic yard for each layer; missing prices keep the project total marked incomplete rather than being guessed.' },
      { q: 'Does this design the driveway structure?', a: 'No. It estimates material quantities. Subgrade, drainage, grading and local requirements may need a professional evaluation before anything is ordered.' },
    ],
  },
  'concrete-calculator': {
    shortDescription: 'Estimate concrete for slabs, footings and post holes.',
    metaTitle: 'Concrete Calculator — Cubic Yards, Bags & Ready-Mix',
    metaDescription:
      'Calculate concrete for slabs, footings and post holes: cubic feet, cubic yards, ready-mix order size, bag counts at 40–80 lb yields and waste.',
    intro:
      'Concrete is ordered in awkward increments, and running short mid-pour is expensive, so this calculator plans the pour before it starts. Add the sections you are placing — slabs by length, width and thickness, footings by length, width and depth, post holes by diameter, depth and count — and the engine totals their volumes, applies your waste allowance, and reports cubic feet, cubic yards, an approximate weight, and a ready-mix order figure rounded up in the supplier increment. Bag counts for 40, 50, 60 and 80 lb bags appear alongside, each using its own yield, so the bags-versus-ready-mix decision is made on numbers rather than assumption. Multiple sections combine into one pour, which is how real slabs with steps, pads and footings are actually planned. The page is for anyone ordering a slab, a footing or a batch of post holes who wants the volume, the order size and the bag count to agree before the truck arrives.',
    outputs: [
      'Per-section volumes in cubic feet for slabs, footings and holes',
      'Total pour volume before waste, in cubic feet and cubic yards',
      'Order volume with waste, plus ready-mix rounded to the supplier increment',
      'Bag counts at 40, 50, 60 and 80 lb using each bag yield',
      'Approximate weight of the pour from the concrete density',
      'Purchase advice comparing bags with ready-mix for your volume',
    ],
    useCases: [
      { label: 'Slabs and pads', detail: 'Patios, shed bases and workshop floors entered by length, width and thickness.' },
      { label: 'Continuous footings', detail: 'Strip footings measured by run, width and depth as their own sections in the pour.' },
      { label: 'Post holes', detail: 'Fence and structural holes by diameter, depth and count, calculated as cylinders.' },
      { label: 'Combined pours', detail: 'Slab plus step plus footing added together so one order covers the whole placement.' },
    ],
    outputNotes: [
      { label: 'Calculated volume versus ready-mix order', text: 'The volume is what the geometry holds. The ready-mix figure adds waste and rounds up in the supplier increment, so the number you give the dispatch office is the one to order.' },
      { label: 'Bags have their own yields', text: 'A 60 lb bag does not hold the same volume as an 80 lb bag. Bag counts use each bag yield rather than weight alone, which is why the four bag options give different totals.' },
      { label: 'Weight is approximate', text: 'The weight figure uses a planning density for concrete. Reinforcement, aggregate blend and entrained air all move the real number, so do not treat it as a weighbridge result.' },
      { label: 'Running short is the real risk', text: 'Ordering the exact finished volume leaves nothing for spillage, uneven subgrade or a slightly deeper patch. The waste allowance exists so the pour can be finished, not just started.' },
    ],
    planning: [
      'Measure thickness from the finished slab and remember the sub-base and any reinforcement sit outside this volume.',
      'Confirm the yield printed on the actual bag rather than assuming every 60 lb bag behaves the same.',
      'Ask about ready-mix minimums and short-load fees before committing to a bag-versus-truck decision.',
      'Enter every section of the pour, including steps and thickened edges, so one order covers the whole placement.',
      'Have help and a plan for the day: concrete punishes hesitation far more than it punishes a slightly generous order.',
    ],
    mistakes: [
      'Ordering by finished volume with no waste allowance and running short halfway through the pour.',
      'Assuming every concrete bag has the same yield when the counts are calculated per bag size.',
      'Mixing post-hole cylinders up with slab areas in one entry instead of adding them as separate sections.',
      'Treating the calculator as structural design — thickness and reinforcement are engineering decisions.',
      'Comparing a bag total with a ready-mix quote without checking the supplier minimum and delivery charge.',
    ],
    faq: [
      { q: 'How much concrete do I need for a slab?', a: 'Length times width times thickness gives cubic feet; divide by 27 for cubic yards. Enter the slab as a section and the calculator adds waste and rounds the order figure for you.' },
      { q: 'How many bags of concrete equal a cubic yard?', a: 'It depends on bag yield. The page counts 40, 50, 60 and 80 lb bags separately using their volumes, so you can see the real bag count for your order.' },
      { q: 'Should I order ready-mix or bags?', a: 'The purchase advice compares your volume with practical bag and truck thresholds. Small jobs favour bags; larger pours usually work out better as ready-mix once minimums are considered.' },
      { q: 'Does it calculate post holes?', a: 'Yes. Enter the hole diameter, depth and count and the engine treats each hole as a cylinder, mixing the result into the same pour total.' },
      { q: 'Why is the order figure larger than my volume?', a: 'The waste allowance is included and ready-mix quantities are rounded up in the supplier increment, because neither material nor truck loads arrive in exact fractions.' },
      { q: 'Is the weight estimate accurate enough to plan with?', a: 'It uses a planning density for concrete and is fine for transport thinking. It is not a substitute for the supplier figure on a weight-based order.' },
    ],
  },
  'paver-calculator': {
    shortDescription: 'Plan pavers, base, bedding sand, edging and cost.',
    metaTitle: 'Paver Calculator — Pavers, Base, Sand & Waste',
    metaDescription:
      'Calculate pavers for patios and paths: piece count with joints and waste, plus base aggregate, bedding sand, edging and cost from your own prices.',
    intro:
      'Square footage is where most paver estimates stop; this calculator treats it as the starting point. Enter the area, the paver dimensions and the joint width, and the engine builds a joint-aware module for the pattern, then works out how many pieces the area needs before and after waste. It then calculates the layers beneath and around them: compactable base at its own depth, a thin bedding sand layer, and edging along the perimeter when you supply one. Each of those is a separate output with its own unit, because they are bought from different suppliers in different units. Prices are optional and only ever yours, so the cost lines reflect quotes you have rather than guessed rates. The page suits anyone laying a patio, path or paved area who needs a material take-off — pavers, base, sand, edging, waste — rather than a simple area figure, and who wants the same quantities available in Project Mode for printing.',
    outputs: [
      'Area in square feet from one or more paved sections',
      'Paver count before waste and the order count after waste',
      'Surface quantity in square feet for ordering by coverage',
      'Base aggregate volume and bedding sand volume as separate lines',
      'Edging in linear feet and stock pieces from the perimeter',
      'Shopping list plus optional cost lines from prices you enter',
    ],
    useCases: [
      { label: 'Patios and terraces', detail: 'Rectangular or multi-section areas where pavers, base, sand and edging must all be ordered together.' },
      { label: 'Walkways and garden paths', detail: 'Narrow runs where piece count and joint width still change the total more than expected.' },
      { label: 'Steps and landings', detail: 'Small paved areas added as their own sections alongside the main surface.' },
      { label: 'Drives and turning areas', detail: 'Larger paved footprints planned with the same layered approach and heavier base depths.' },
    ],
    outputNotes: [
      { label: 'Joints change the piece count', text: 'Pavers are laid with a gap, so the module — paver size plus joint — is slightly larger than the paver. Counting from raw area alone underestimates the order, which is why the joint width is an input.' },
      { label: 'Pieces versus square footage', text: 'Some suppliers sell by the piece, others by coverage. Both results are shown: the piece count for a pattern order, the surface area for a coverage-based quote.' },
      { label: 'Waste covers cuts and breakage', text: 'Edges, curves and pattern cuts consume whole pavers. The waste allowance is applied to the count, so the order number already includes that margin.' },
      { label: 'Base and sand are separate purchases', text: 'Aggregate and bedding sand are different products in different units. They appear as their own outputs so neither is missed when the shopping list is built.' },
    ],
    planning: [
      'Confirm the laying pattern first, because herringbone and basket-weave consume pieces differently at the cuts.',
      'Measure every paved section separately when depth, pattern or paver size changes across the project.',
      'Set the joint width to the product you are actually laying; a quarter-inch change moves the count on a large area.',
      'Use product-specific requirements for edge restraint rather than a generic stock length assumption.',
      'Keep a note of the paver batch or colour lot — running out mid-job means a visible second order.',
    ],
    mistakes: [
      'Calculating pavers from area alone while ignoring joints, then coming up short by a whole pallet section.',
      'Skipping base and bedding quantities because the paver count looked complete on its own.',
      'Assuming raw square footage equals the order quantity when cuts and breakage are real.',
      'Entering a joint width that does not match the installation system used for the pattern.',
      'Forgetting edging entirely, then watching the perimeter shift after the first season.',
    ],
    faq: [
      { q: 'How many pavers do I need?', a: 'The engine divides the area by the paver module — size plus joint — then applies the waste allowance. Both the count before waste and the order count are shown.' },
      { q: 'Why does the joint width matter?', a: 'Each joint makes the module slightly bigger than the paver, so more pieces fit into a given area than a raw size calculation suggests. Enter the gap your system uses.' },
      { q: 'Does this include paver base?', a: 'Yes. Base aggregate and bedding sand are calculated as separate outputs with their own depths and compaction, ready for the shopping list.' },
      { q: 'How much waste should I allow for pavers?', a: 'Ten percent covers straight-edged jobs with normal cutting. Raise it for curves, diagonal patterns or a border that eats whole pieces.' },
      { q: 'Can I calculate several sections at once?', a: 'Yes — add the patio, path and steps as separate areas and the totals carry the same paver, base, sand and waste assumptions across them.' },
      { q: 'Can this estimate what the project will cost?', a: 'It prices pavers, base, sand and edging only from the unit prices you enter. Nothing is quoted at a market rate, and labour is not included.' },
    ],
  },
  'paver-patio-calculator': {
    shortDescription: 'Build a complete patio material plan with printable quantities.',
    metaTitle: 'Paver Patio Calculator — Pavers, Base, Sand & Edging',
    metaDescription:
      'Plan a whole paver patio: piece count with joints and waste, compactable base, bedding sand, edge restraint, shopping list and print-ready quantities.',
    intro:
      'This is the project-level view of a paved area: everything the patio needs, planned together and ready to print. Measure the patio as one or more sections, set the paver size and joint, choose base and bedding depths, add a waste allowance, and the calculator returns the full material set — pavers with joints accounted for, compactable base, bedding sand, edging stock and an optional cost total from prices you enter. The quantities are arranged as a shopping list rather than a set of disconnected figures, because a patio is ordered as a coordinated set: the pavers, the stone below them, the sand between them and the restraint around them all have to arrive for the job to progress. Everything feeds Project Mode, so the same numbers can be combined with other work, checked off during purchasing and printed as a plan. It is aimed at anyone building a patio who wants one authoritative take-off instead of four separate estimates that disagree.',
    outputs: [
      'Patio area in square feet, with multiple sections combined',
      'Paver pieces with joints and waste, before and after allowance',
      'Compact base volume with its own depth and compaction assumption',
      'Bedding sand volume as its own line item',
      'Edge restraint in linear feet and stock pieces',
      'Shopping list output, optional cost lines, and print-ready quantities',
    ],
    useCases: [
      { label: 'Rectangular patio', detail: 'The straightforward case: one area, one pattern, all layers planned in a single pass.' },
      { label: 'Multi-section patios', detail: 'L-shapes, extensions and level changes entered as separate areas that share one material plan.' },
      { label: 'Patio with a path or steps', detail: 'Connected paved areas calculated together so one order covers the whole hardscape.' },
      { label: 'Renovation and relaying', detail: 'Reusing an existing base by adjusting the base depth, while planning new pavers and sand properly.' },
    ],
    outputNotes: [
      { label: 'One plan, several suppliers', text: 'Pavers, aggregate, sand and edging rarely come from the same yard. The shopping list keeps them as separate quantities precisely so each can be quoted and ordered correctly.' },
      { label: 'Base depth versus excavation', text: 'The base volume assumes the depth you set. Excavation, bedding of the subgrade and disposal of spoil are related work, but they are not part of the material quantities.' },
      { label: 'Waste protects the pattern', text: 'Cuts at borders and corners consume whole units. The waste allowance is applied to the piece count so the patio can be finished in the same batch.' },
      { label: 'Cost lines reflect your quotes', text: 'The optional total prices only what you enter. Missing prices leave the total flagged as incomplete rather than being filled with an assumed rate.' },
    ],
    planning: [
      'Separate excavation, base, bedding and finish quantities — they are bought separately and used at different stages.',
      'Confirm drainage falls and edge restraint requirements for the actual site before locking the material list.',
      'Fix the pattern and paver size before calculating, because both change the piece count at the borders.',
      'Calculate the patio as sections when the shape is not a clean rectangle instead of forcing one average.',
      'Take the printable list to the suppliers as-is so each quote can be checked against the same quantities.',
    ],
    mistakes: [
      'Treating the patio as only a paver-count problem and discovering the base was never ordered.',
      'Skipping edge restraint because it looks minor, then watching the perimeter spread underfoot.',
      'Using an arbitrary paver pattern without confirming the piece dimensions it actually requires.',
      'Ordering pavers without matching batch numbers after underestimating the waste allowance.',
      'Comparing total costs that include delivery on one quote and not on another.',
    ],
    faq: [
      { q: 'How many pavers do I need for a patio?', a: 'Enter the patio area, paver size and joint width. The engine converts area into a piece count using the joint-aware module, then applies waste for cuts and breakage.' },
      { q: 'Can I combine multiple patio sections?', a: 'Yes. Add additional area sections when the patio is not one simple rectangle, and the totals carry one consistent set of assumptions.' },
      { q: 'Does the plan include base and bedding sand?', a: 'Both are calculated with their own depths and compaction allowances, listed as separate quantities on the shopping list.' },
      { q: 'What about edge restraint?', a: 'Edging is calculated from the perimeter in linear feet and stock pieces, so it appears alongside the pavers instead of being discovered on site.' },
      { q: 'Is the base depth fixed at the default?', a: 'No. The default is a planning value; change it for the ground conditions, climate and intended use of the patio.' },
      { q: 'Can I print the material list?', a: 'Yes — add the result to Project Mode and use the printable plan, which shows quantities, costs and assumptions together.' },
    ],
  },
  'fence-calculator': {
    shortDescription: 'Plan posts, rails, pickets/panels, concrete and hardware.',
    metaTitle: 'Fence Calculator — Posts, Panels, Rails & Concrete',
    metaDescription:
      'Calculate a fence from length, height and gates: posts by spacing, rails, pickets or panels, concrete for holes, hardware and a shopping list.',
    intro:
      'A fence is a list of components that all depend on one layout, and this calculator builds that layout first. Enter the run length, the fence height, post spacing, corners, ends and gates; the engine works out the net run after gate openings, places the posts, and then derives everything that hangs on them — rails by height, pickets or panels by surface area, concrete for the holes, and a hardware allowance. Choose the fence type and the surface components change to match: wood pickets, pre-built panels, or chain-link all calculate differently even though the post layout is shared. Gate posts are counted separately from line, corner and end posts so nothing is doubled. The output is a practical shopping list for homeowners, contractors and anyone replacing a run of fence who needs quantities for posts, rails, surface material, concrete and gates before contacting suppliers.',
    outputs: [
      'Net fence run after gate openings are removed',
      'Post totals split into line, corner, end and gate posts',
      'Rails required in pieces, derived from height and stock length',
      'Pickets, panels or chain-link by fence type, with waste included',
      'Concrete volume for post holes plus a hardware allowance',
      'A shopping list of every component for quoting and purchasing',
    ],
    useCases: [
      { label: 'Privacy fence', detail: 'Tall close-board or board-on-board runs where rails, pickets and post counts all scale with height.' },
      { label: 'Picket and panel fence', detail: 'Standard residential styles where panels or pickets cover the calculated surface area.' },
      { label: 'Runs with gates', detail: 'Gate openings subtracted from the run, with their posts counted separately from line posts.' },
      { label: 'Corners and changing direction', detail: 'Corner posts identified explicitly so a boundary that turns is planned correctly.' },
    ],
    outputNotes: [
      { label: 'Estimated posts versus exact placement', text: 'The post count comes from net run divided by spacing plus the ends, corners and gates you declare. Real layouts adjust for slopes and fixtures, so treat the count as a material estimate, not a setting-out drawing.' },
      { label: 'Rails follow height', text: 'Rails per section change above six feet in the engine defaults. Height, not length, drives that number, which is why two hundred feet of six-foot fence and eight-foot fence are different orders.' },
      { label: 'Surface material depends on type', text: 'Pickets are counted as individual boards, panels as whole units, chain-link as linear feet. Switching type changes the unit you order, not just the quantity.' },
      { label: 'Concrete and hardware are estimates', text: 'Hole volume uses the diameter and depth assumptions shown, and hardware is a planning allowance. Confirm both against the post and gate systems you actually buy.' },
    ],
    planning: [
      'Map corners, ends and gate openings before ordering anything — the post layout drives every other quantity.',
      'Check post-hole requirements against the soil, frost depth and local rules rather than accepting the default hole.',
      'Measure the run along the actual fence line, including dips and rises, because slope adds real length.',
      'Decide the fence type first; pickets, panels and chain-link produce different units and different totals.',
      'Keep the shopping list with the height and spacing used, so a supplier can check the layout against the quantities.',
    ],
    mistakes: [
      'Counting gate posts twice by including them in the line-post spacing as well as the gate calculation.',
      'Assuming post spacing alone determines exact placement when corners and ends are also in the run.',
      'Treating hardware allowances as a complete manufacturer-specific system rather than a planning figure.',
      'Ordering rails by length without checking the stock length the calculation assumed.',
      'Forgetting concrete for the holes, which is easy to miss because it does not appear on a fence invoice line.',
    ],
    faq: [
      { q: 'How does it work out the whole fence take-off?', a: 'Post positions come from the net run divided by spacing, with corners, ends and gate posts added. Rails follow the height, and the picket, panel or chain-link quantity follows the surface area of the run.' },
      { q: 'How many pickets or panels does the fence need?', a: 'The surface area from net run times height is divided by the unit coverage of the chosen fence type, then increased by the waste allowance for cuts.' },
      { q: 'Does it calculate concrete for the post holes?', a: 'Yes. Hole diameter and depth assumptions produce a concrete volume for the posts, listed as its own quantity on the shopping list.' },
      { q: 'How does a gate affect the calculation?', a: 'Gate openings are subtracted from the run before posts are placed, and each gate contributes its own posts separately so the spacing is not counted twice.' },
      { q: 'Can I plan a fence with corners?', a: 'Yes. Enter the number of corners; the engine treats them as distinct posts rather than ordinary line positions.' },
      { q: 'Does this tell me the exact post positions?', a: 'No. It produces a material estimate from spacing and layout inputs. Setting out on site still needs a tape, pins and judgement about slope.' },
    ],
  },
  'fence-cost-calculator': {
    shortDescription: 'Estimate fence materials and labor from your own prices.',
    metaTitle: 'Fence Cost Calculator — Materials, Labor & Total',
    metaDescription:
      'Build a fence cost estimate from your own prices: posts, rails, pickets or panels, concrete, hardware, gates and labor, with missing prices flagged.',
    intro:
      'Quantity planning and pricing are separate jobs, and this calculator keeps them that way. It runs the same fence layout as the fence page — run length, height, spacing, corners, ends, gates — and then prices the components only where you supply a rate: per post, per rail, per picket or panel, per linear foot of chain-link, per cubic yard of concrete, per hardware unit, per gate, and labour by the foot or as a flat figure. Lines without a price stay visible and the total is marked incomplete, so a partial quote can never look like a finished budget. That is the entire point of the tool: an honest fence estimate built from your supplier and contractor numbers rather than an invented market rate. It suits homeowners comparing quotes, contractors assembling a take-off, and anyone who wants material cost, labour and total project cost shown as distinct figures they can defend.',
    outputs: [
      'Every fence component quantity from the shared layout engine',
      'Material cost lines for each component you have priced',
      'Labour cost as per-foot or flat, whichever you enter',
      'Material subtotal, labour subtotal and project total kept apart',
      'Missing-price list so incomplete quotes stay visible',
      'Cost completeness flag on the result instead of a silent gap',
    ],
    useCases: [
      { label: 'Comparing contractor quotes', detail: 'Enter each quote basis and see how the totals assemble from the same component quantities.' },
      { label: 'Pricing a DIY replacement run', detail: 'Supplier prices per post, rail, panel and bag of concrete, with labour excluded or included as you prefer.' },
      { label: 'Budgeting gates separately', detail: 'Gate cost is its own line so the hardware and leaf price do not disappear into a per-foot rate.' },
      { label: 'Tendering a longer boundary', detail: 'Per-linear-foot labour against a flat figure, with material cost tracked independently for evaluation.' },
    ],
    outputNotes: [
      { label: 'Material cost versus total project cost', text: 'The material subtotal counts physical components only. Labour sits in its own subtotal and the project total combines the two, so a change in either is visible rather than buried.' },
      { label: 'Why the total can say incomplete', text: 'A component without a price cannot be costed without inventing a rate. The calculator refuses to do that and lists the missing prices instead.' },
      { label: 'Price basis matters', text: 'A price per piece, per linear foot and per cubic yard are not interchangeable. Each line shows the basis it used, which makes two quotes comparable line by line.' },
      { label: 'What is not in the number', text: 'Delivery, permits, disposal of the old fence and site-specific work are excluded from the engine. Add them as manual lines in Project Mode if they apply.' },
    ],
    planning: [
      'Enter prices from the supplier or installer you actually intend to use, on the basis they quote them.',
      'Keep delivery, permits and special site work in the project notes so they are not mistaken for engine output.',
      'Price the layout first and the style second — quantities move with height, spacing and gate count.',
      'Record which components a quote includes, because a per-foot labour rate that includes posts changes the comparison.',
      'Re-run the estimate when the fence height or type changes; both alter enough lines to move the total.',
    ],
    mistakes: [
      'Treating a partial quote as a complete project cost because the total looks like a round number.',
      'Comparing quotes with different inclusions — material-only against material-and-labour — without normalising them.',
      'Entering a per-piece price against a per-foot quantity and getting a total that is orders of magnitude out.',
      'Assuming the calculator validates market rates; it only ever multiplies your quantity by your price.',
      'Leaving the waste allowance at zero to save money and then paying for a second delivery instead.',
    ],
    faq: [
      { q: 'What does the fence cost calculator include?', a: 'Posts, rails, surface material, concrete, hardware, gates and labour, each priced only when you enter a rate for it. Delivery and permits are not part of the engine.' },
      { q: 'Why does the total say incomplete?', a: 'One or more components has no price entered. The calculator leaves that gap visible rather than filling it with an invented figure.' },
      { q: 'Does it calculate labour?', a: 'Yes, either per linear foot or as a flat amount. Labour is reported in its own subtotal so it can be compared separately from materials.' },
      { q: 'Can I price only part of the fence?', a: 'You can. The priced lines total normally and the unpriced ones are listed, so you always know what the number does not cover.' },
      { q: 'How do I compare two contractor quotes?', a: 'Enter each quote on its own basis and check the inclusions line by line. The per-component display makes material-only and turnkey quotes distinguishable.' },
      { q: 'Does this replace a written estimate?', a: 'No. It structures your own numbers for planning. A written quote from the contractor remains the commercial document.' },
    ],
  },
  'fence-post-calculator': {
    shortDescription: 'Estimate line, corner, end and gate posts.',
    metaTitle: 'Fence Post Calculator — Spacing, Posts & Gates',
    metaDescription:
      'Work out how many fence posts you need: post spacing, line, corner, end and gate posts, net run after gate openings and a layout estimate.',
    intro:
      'Post layout is the foundation of every fence estimate, so this page isolates it. Enter the fence length, the spacing you intend to use, and how many corners, ends and gates the run contains; the engine removes gate openings from the total, works out estimated positions along the remaining run, and reports line posts, corner posts, end posts and gate posts separately as well as in total. Because nothing else is calculated, the page is the quickest way to check a layout before committing to a fence system — you can see immediately what changing spacing from eight feet to six does to the count, or what a second gate adds. Notes flag anything unusual about the layout as you go. It is aimed at anyone setting out a fence: homeowners checking quantities, contractors sanity-checking a take-off, and anyone who needs gate posts counted correctly for once.',
    outputs: [
      'Fence length and gate opening length in feet',
      'Net run available for line-post spacing',
      'Estimated post positions along the net run',
      'Line, corner, end and gate posts reported separately',
      'Total post count for ordering',
      'Layout notes when the inputs produce an unusual result',
    ],
    useCases: [
      { label: 'Straight boundary runs', detail: 'The simple case: length divided by spacing, plus the end posts that bookend it.' },
      { label: 'Runs with one or more gates', detail: 'Gate widths removed from the run and their posts added explicitly, never implied.' },
      { label: 'Boundaries with corners', detail: 'Turns in the fence line counted as their own posts rather than line positions.' },
      { label: 'Spacing comparisons', detail: 'Testing what tighter spacing does to the count before the fence system is chosen.' },
    ],
    outputNotes: [
      { label: 'Estimated positions versus setting out', text: 'The count is derived from arithmetic on spacing, ends, corners and gates. Real setting out must also accommodate slopes, fixtures and the position of the corners themselves.' },
      { label: 'Gate openings are subtracted', text: 'A gate is an opening, not a line of posts. The engine removes gate width from the run before spacing is applied, then adds the gate posts explicitly.' },
      { label: 'One post can do two jobs', text: 'A gate can share a post with the end of the run. The counts are reported by category so you can see how the total assembles rather than guessing at overlaps.' },
      { label: 'This is quantity, not structure', text: 'Hole depth, concrete volume and post size are structural decisions handled by the fence page and local requirements — not by a spacing calculation.' },
    ],
    planning: [
      'Sketch the run with corners and gate positions before entering anything, so the inputs match the real boundary.',
      'Measure the actual fence line rather than the property line; the two are rarely identical.',
      'Test the spacing you intend to use against the fence system, because panel and rail lengths set a practical limit.',
      'Count gates explicitly with their widths — an opening without a width cannot be removed from the run.',
      'Treat the total as an ordering figure and adjust on site once the corners are pinned.',
    ],
    mistakes: [
      'Double-counting gate posts by also spacing line posts through the opening.',
      'Entering a gate width without a matching gate count, or the reverse, leaving the layout inconsistent.',
      'Assuming ends are included automatically — the default is two, but a run meeting an existing fence may need one.',
      'Using the count as a structural layout instead of a material estimate.',
      'Ignoring corners entirely and discovering mid-job that a turning post is not a line post.',
    ],
    faq: [
      { q: 'How many fence posts do I need?', a: 'Divide the net run — total length minus gate openings — by the spacing, then add the end, corner and gate posts you declare. The calculator reports each category and the total.' },
      { q: 'What spacing should I use?', a: 'Match it to the fence system: panels and rails come in fixed lengths that usually settle the question. The default is a common planning value you can change freely.' },
      { q: 'How are gate posts counted?', a: 'Each gate contributes its own posts on top of the spaced positions, because a gate needs a post at both sides of the opening.' },
      { q: 'Do corner posts count as line posts?', a: 'No. Corners are reported separately since they are positioned by the turn in the boundary rather than by spacing along a straight run.' },
      { q: 'Does this include concrete for the holes?', a: 'Not on this page. Use the fence calculator for hole volume, concrete and the rest of the component take-off.' },
      { q: 'Is the count exact enough to order from?', a: 'It is a strong ordering estimate. Final positions still get adjusted on site for slope, fixtures and where the corners actually fall.' },
    ],
  },
  'deck-material-calculator': {
    shortDescription: 'Estimate decking, joists, framing pieces and fasteners.',
    metaTitle: 'Deck Material Calculator — Boards, Joists & Fasteners',
    metaDescription:
      'Estimate deck materials from your dimensions: decking boards, joists, beams, posts, rim joist and fasteners, with waste and optional prices.',
    intro:
      'This calculator turns a deck size into a material list: decking boards, joists, beams, posts, rim material and fasteners, all from the dimensions and product sizes you enter. Give the deck length and width, the board width and length, the joist spacing and a waste allowance, and the engine works out how many rows of decking the width produces, how many stock boards each row needs, how many joists fall along the run at the chosen spacing, and the framing and fastener quantities that follow from those. Everything is arithmetic on your inputs — it deliberately does not decide beam sizes, spans or footings, because those are structural questions with local code attached. Prices are optional and only ever yours, so the cost lines reflect quotes rather than guesses. It is built for homeowners planning a build, contractors assembling a purchase list, and anyone who wants board counts and fastener counts to agree with each other before anything is ordered.',
    outputs: [
      'Deck area in square feet from the dimensions entered',
      'Board rows across the width and stock boards per row',
      'Decking boards and linear feet ordered with waste',
      'Joists by spacing, plus joist and beam linear feet and pieces',
      'Post count and rim joist linear feet for the frame',
      'Fasteners at board and framing intersections, with optional costs',
    ],
    useCases: [
      { label: 'Rectangular backyard deck', detail: 'The standard case: one area, one board direction, joists at a chosen spacing.' },
      { label: 'Multi-level or shaped decks', detail: 'Calculated as sections so each level can carry its own board direction and quantities.' },
      { label: 'Board direction changes', detail: 'Where the pattern turns, the run length changes — and so do the stock board counts.' },
      { label: 'Replacement decking on an existing frame', detail: 'Set framing inputs to match what is there and plan only the boards, gaps and fasteners.' },
    ],
    outputNotes: [
      { label: 'Board width versus coverage', text: 'Rows are counted from the coverage width — board width plus the gap you set — not the nominal size. That is why the row count differs from a simple width division.' },
      { label: 'Stock lengths drive board counts', text: 'Rows are filled with boards of the stock length you enter. Shorter stock means more boards and more end joints for the same deck.' },
      { label: 'Joist spacing is an input, not advice', text: 'The count follows the spacing you choose. Choosing a spacing for a real deck belongs with span tables, the decking manufacturer and local code.' },
      { label: 'Ordered quantities include waste', text: 'Board and fastener totals are increased by the waste allowance and rounded up, because cuts and mistakes consume whole boards.' },
    ],
    planning: [
      'Measure the actual board you will lay, including its real width, rather than the nominal size on the label.',
      'Decide the joist spacing with span tables and the decking manufacturer documentation before counting joists.',
      'Confirm the stock board lengths available; they determine how many end joints the deck will have.',
      'Follow the fastener recommendation for the specific decking product — two per intersection is only a default.',
      'Order boards from one batch where colour consistency matters, and keep the waste allowance intact.',
    ],
    mistakes: [
      'Treating material estimating as structural design: the count does not prove the frame will carry the load.',
      'Assuming one joist spacing works for every decking product, especially thinner or composite boards.',
      'Forgetting rim joist and beam material because the board count looked like the whole order.',
      'Counting fasteners per board instead of per intersection and coming up short during installation.',
      'Setting waste to zero on a deck full of angles, then buying the missing boards at retail price.',
    ],
    faq: [
      { q: 'How many deck boards do I need?', a: 'The deck width divided by the board coverage width gives the rows; rows divided by stock length gives boards per row. Multiply out, add waste and the ordered count follows.' },
      { q: 'How many joists does the deck need?', a: 'Joists are counted along the run at the spacing you enter. The result shows the count and the linear feet of joist material it implies.' },
      { q: 'What board width should I use?', a: 'Use the real laying width of the product, and include the gap in the coverage width field. Nominal sizes differ from the board you actually hold.' },
      { q: 'Does this tell me safe joist spans?', a: 'No. It explicitly avoids structural engineering and estimates material quantities from the inputs you provide. Span selection needs tables, code and manufacturer data.' },
      { q: 'How much waste should I allow for decking?', a: 'Ten percent suits straightforward rectangles with plenty of square cuts. Increase it for diagonals, picture-frame borders or a lot of notching.' },
      { q: 'Are fasteners included?', a: 'Yes — fasteners are estimated at board and framing intersections using the default you can change. Confirm the final figure against the product instructions.' },
    ],
  },
};
