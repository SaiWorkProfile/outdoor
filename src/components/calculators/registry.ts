import type { MaterialId } from '@/data/materials';
import { CALCULATOR_COPY, type CalculatorCopy } from './copy';

export type CalculatorSlug =
  | 'gravel-calculator'
  | 'mulch-calculator'
  | 'topsoil-calculator'
  | 'soil-calculator'
  | 'sand-calculator'
  | 'pea-gravel-calculator'
  | 'landscape-rock-calculator'
  | 'paver-base-calculator'
  | 'driveway-gravel-calculator'
  | 'concrete-calculator'
  | 'paver-calculator'
  | 'paver-patio-calculator'
  | 'fence-calculator'
  | 'fence-cost-calculator'
  | 'fence-post-calculator'
  | 'deck-material-calculator';

export type CalculatorFamily = 'material' | 'project' | 'cost';

export type CalculatorDefinition = CalculatorCopy & {
  slug: CalculatorSlug;
  name: string;
  h1: string;
  family: CalculatorFamily;
  material?: MaterialId;
  useCaseIds?: string[];
  howItWorks: string;
  formula: string;
  workedExample: { label: string; input: Record<string, string | number>; note: string };
  assumptions: Array<{ label: string; value: string; note?: string }>;
  related: CalculatorSlug[];
};

/** Structural (engine-facing) fields only; page copy is merged in below. */
type CalculatorStructure = Omit<CalculatorDefinition, keyof CalculatorCopy>;

const bulkAssumptions = (material: MaterialId, depth: string): CalculatorDefinition['assumptions'] => [
  { label: 'Default waste', value: '10%', note: 'Editable for the project. Higher allowances should have a reason.' },
  { label: 'Typical density', value: material === 'mulch' ? '0.35 tons/cu yd' : material === 'topsoil' ? '1.1 tons/cu yd' : material === 'soil' ? '1.2 tons/cu yd' : '1.35–1.4 tons/cu yd', note: 'Planning value; supplier material can differ.' },
  { label: 'Planning depth', value: depth, note: 'Use-case guidance is not a site-specific specification.' },
  { label: 'Price', value: 'User-entered only', note: 'No current market price is fabricated by the calculator.' },
];

const STRUCTURE: CalculatorStructure[] = [
  {
    slug:'gravel-calculator', name:'Gravel Calculator', h1:'Gravel Calculator', family:'material', material:'gravel', useCaseIds:['walkway','patio','general'], howItWorks:'Measure each area, choose a depth, add a waste allowance, and the engine converts area × depth into volume and purchase quantities.', formula:'Area × depth ÷ 12 = cubic feet; cubic feet ÷ 27 = cubic yards; cubic yards × density = estimated tons; waste and compaction are then applied to the order volume.', workedExample:{label:'20 × 30 ft area at 3 in depth',input:{shape:'rectangle',length:20,width:30,depth:3,waste:10},note:'The engine calculates 600 sq ft and applies your selected depth and waste allowance.'}, assumptions:bulkAssumptions('gravel','2–4 in for common walkway/patio examples'), related:['pea-gravel-calculator','paver-base-calculator','driveway-gravel-calculator','sand-calculator']
  },
  {
    slug:'mulch-calculator', name:'Mulch Calculator', h1:'Mulch Calculator', family:'material', material:'mulch', useCaseIds:['garden-bed','tree-ring'], howItWorks:'Measure the bed area and choose a depth. The same volume engine converts the result to cubic yards, weight and common bag sizes.', formula:'Area × depth ÷ 12 = volume in cubic feet; divide by 27 for cubic yards; multiply by the configured material density for a planning weight estimate.', workedExample:{label:'12 × 18 ft bed at 3 in depth',input:{shape:'rectangle',length:12,width:18,depth:3,waste:10},note:'Compare the result with a 2 in and 4 in depth before ordering.'}, assumptions:bulkAssumptions('mulch','2–4 in for common bed examples'), related:['topsoil-calculator','soil-calculator','landscape-rock-calculator']
  },
  {
    slug:'topsoil-calculator', name:'Topsoil Calculator', h1:'Topsoil Calculator', family:'material', material:'topsoil', useCaseIds:['garden-bed','raised-bed','lawn-topdressing','new-lawn'], howItWorks:'Choose a use case so the page can show relevant depth guidance, then calculate volume and purchase quantities from your actual dimensions.', formula:'Area × depth ÷ 12 gives cubic feet, then the engine converts to cubic yards and bag counts using centralized assumptions.', workedExample:{label:'10 × 20 ft garden bed at 6 in depth',input:{shape:'rectangle',length:10,width:20,depth:6,waste:10,useCase:'garden-bed'},note:'The use-case setting adds a warning when your chosen depth is outside the planning range.'}, assumptions:bulkAssumptions('topsoil','4–8 in for a common garden bed; other use cases vary'), related:['soil-calculator','mulch-calculator','landscape-rock-calculator']
  },
  {
    slug:'soil-calculator', name:'Soil Calculator', h1:'Soil Calculator', family:'material', material:'soil', useCaseIds:['general'], howItWorks:'Enter one or more shapes, the material depth and an optional supplier density. The engine converts the total volume into common purchase units.', formula:'Area × depth ÷ 12 = cubic feet; divide by 27 for cubic yards; multiply by density for an estimated tonnage.', workedExample:{label:'15 × 24 ft soil area at 4 in depth',input:{shape:'rectangle',length:15,width:24,depth:4,waste:10},note:'Use supplier-specific density when available.'}, assumptions:bulkAssumptions('soil','1–12 in general planning range'), related:['topsoil-calculator','mulch-calculator','gravel-calculator']
  },
  {
    slug:'sand-calculator', name:'Sand Calculator', h1:'Sand Calculator', family:'material', material:'sand', useCaseIds:['paver-bedding','leveling','sandbox'], howItWorks:'Choose the use case and depth, then the engine estimates volume, tonnage, bags and an order volume rounded for purchasing.', formula:'Area × depth ÷ 12 = cubic feet; convert to cubic yards, then apply waste and the configured sand density.', workedExample:{label:'12 × 20 ft paver bedding at 1 in',input:{shape:'rectangle',length:12,width:20,depth:1,waste:10,useCase:'paver-bedding'},note:'Bedding depth is shown as a planning assumption, not a structural base thickness.'}, assumptions:bulkAssumptions('sand','1–1.5 in for paver bedding'), related:['paver-base-calculator','paver-calculator','paver-patio-calculator']
  },
  {
    slug:'pea-gravel-calculator', name:'Pea Gravel Calculator', h1:'Pea Gravel Calculator', family:'material', material:'pea-gravel', useCaseIds:['walkway','garden','patio'], howItWorks:'The page uses the shared bulk engine but applies pea-gravel-specific density and use-case guidance.', formula:'Area × depth ÷ 12, converted to cubic yards and tons, with waste applied to the purchase volume.', workedExample:{label:'10 × 16 ft garden path at 2 in',input:{shape:'rectangle',length:10,width:16,depth:2,waste:10,useCase:'walkway'},note:'Use edging when the material needs to stay contained.'}, assumptions:bulkAssumptions('pea-gravel','1–3 in depending on use'), related:['gravel-calculator','landscape-rock-calculator','paver-base-calculator']
  },
  {
    slug:'landscape-rock-calculator', name:'Landscape Rock Calculator', h1:'Landscape Rock Calculator', family:'material', material:'landscape-rock', useCaseIds:['decorative'], howItWorks:'Enter the ground area and depth, then review both volume and weight. Larger rock can have different void space and supplier density.', formula:'Area × depth ÷ 12, then convert cubic feet to cubic yards and apply the configured rock density.', workedExample:{label:'18 × 24 ft landscape bed at 3 in',input:{shape:'rectangle',length:18,width:24,depth:3,waste:10,useCase:'decorative'},note:'Larger rock sizes can cover differently than the typical planning density.'}, assumptions:bulkAssumptions('landscape-rock','2–4 in for common decorative cover'), related:['gravel-calculator','pea-gravel-calculator','mulch-calculator']
  },
  {
    slug:'paver-base-calculator', name:'Paver Base Calculator', h1:'Paver Base Calculator', family:'material', material:'paver-base', useCaseIds:['patio','walkway','driveway'], howItWorks:'The engine separates net volume from compacted order volume and uses the centralized base-material assumptions.', formula:'Net area × depth ÷ 12 = base volume; order volume = net volume × compaction factor × (1 + waste).', workedExample:{label:'12 × 20 ft patio base at 6 in',input:{shape:'rectangle',length:12,width:20,depth:6,waste:10,useCase:'patio'},note:'Compaction is an editable assumption in the engine.'}, assumptions:[{label:'Default compaction',value:'1.10',note:'Planning allowance only.'},{label:'Default waste','value':'10%'},{label:'Typical density','value':'1.4 tons/cu yd',note:'Confirm supplier value.'},{label:'Price','value':'User-entered only'}], related:['paver-calculator','paver-patio-calculator','sand-calculator']
  },
  {
    slug:'driveway-gravel-calculator', name:'Driveway Gravel Calculator', h1:'Driveway Gravel Calculator', family:'project', material:'gravel', howItWorks:'Define the driveway area, then configure one or more layers. Each layer runs through the shared bulk engine so volume, waste, density and cost stay consistent.', formula:'Each layer is calculated independently as area × layer depth, then adjusted for compaction and waste. Layer totals are summed for the project.', workedExample:{label:'20 × 60 ft driveway with three layers',input:{length:20,width:60},note:'Use actual site layer depths and supplier densities before ordering.'}, assumptions:[{label:'Default base compaction','value':'1.15'},{label:'Default middle compaction','value':'1.15'},{label:'Default surface compaction','value':'1.10'},{label:'Truck capacity','value':'10 tons planning default'}], related:['gravel-calculator','paver-base-calculator']
  },
  {
    slug:'concrete-calculator', name:'Concrete Calculator', h1:'Concrete Calculator', family:'project', howItWorks:'Each concrete section is converted to cubic feet, summed, and then increased by your waste allowance. The engine reports bag counts for the configured bag sizes.', formula:'Slab volume = length × width × thickness; footing volume = length × width × depth; post-hole volume = cylinder volume × count.', workedExample:{label:'20 × 30 ft slab at 4 in',input:{length:20,width:30,thickness:4,waste:10},note:'The engine can also combine multiple parts in one calculation.'}, assumptions:[{label:'Concrete density','value':'150 lb/cu ft planning value'},{label:'Waste','value':'10% default'},{label:'Ready-mix increment','value':'0.25 cu yd'},{label:'Bag yields','value':'40/50/60/80 lb configured yields'}], related:['fence-post-calculator','fence-calculator','deck-material-calculator']
  },
  {
    slug:'paver-calculator', name:'Paver Calculator', h1:'Paver Calculator', family:'project', howItWorks:'The paver module calculates paver coverage using a joint-aware module, then calls the bulk engine for base and bedding sand.', formula:'Paver module = (paver length + joint) × (paver width + joint). Pavers required = area ÷ module area × (1 + waste). Base and sand use their own depths and compaction assumptions.', workedExample:{label:'12 × 20 ft patio with 6 × 6 in pavers',input:{length:12,width:20,paverLength:6,paverWidth:6,joint:.125,waste:10},note:'Edge length can be entered when the perimeter is not derivable from the supplied shape.'}, assumptions:[{label:'Base depth','value':'6 in default'},{label:'Bedding sand depth','value':'1 in default'},{label:'Paver joint','value':'1/8 in default'},{label:'Waste','value':'10% default'}], related:['paver-patio-calculator','paver-base-calculator','sand-calculator']
  },
  {
    slug:'paver-patio-calculator', name:'Paver Patio Calculator', h1:'Paver Patio Calculator', family:'project', howItWorks:'It is a project wrapper around the reusable paver engine and exposes the shopping-list quantities needed for a patio plan.', formula:'The same paver, base and bedding formulas are used as the core Paver Calculator; Project Mode can store these quantities together.', workedExample:{label:'12 × 20 ft patio at 6 in base + 1 in sand',input:{length:12,width:20,paverLength:6,paverWidth:6,baseDepth:6,sandDepth:1,waste:10},note:'Use the printable quantity list as a planning worksheet, then verify product-specific requirements.'}, assumptions:[{label:'Base depth','value':'6 in default'},{label:'Bedding sand','value':'1 in default'},{label:'Waste','value':'10% default'},{label:'Edge stock','value':'8 ft planning pieces'}], related:['paver-calculator','paver-base-calculator','sand-calculator']
  },
  {
    slug:'fence-calculator', name:'Fence Calculator', h1:'Fence Calculator', family:'project', howItWorks:'Post geometry is calculated first. Rails, pickets/panels, concrete and hardware are then derived from that layout and your fence-type inputs.', formula:'Estimated post positions use net run ÷ spacing, with corners, ends and gate posts handled separately. Surface components are then rounded up with waste.', workedExample:{label:'100 ft × 6 ft wood-picket fence',input:{length:100,height:6,postSpacing:8,corners:0,ends:2,gates:1,gateWidth:4,waste:10},note:'Gate, corner and terrain geometry can change exact post placement.'}, assumptions:[{label:'Post spacing','value':'8 ft default'},{label:'Rails','value':'2 through 6 ft; 3 above 6 ft'},{label:'Post holes','value':'12 in diameter × 30 in deep default'},{label:'Waste','value':'10% default'}], related:['fence-cost-calculator','fence-post-calculator','concrete-calculator']
  },
  {
    slug:'fence-cost-calculator', name:'Fence Cost Calculator', h1:'Fence Cost Calculator', family:'cost', howItWorks:'The underlying fence quantity result is reused. Cost lines only appear for prices you supply, and missing prices remain visible so the total cannot look falsely precise.', formula:'Component quantity × entered unit price = line cost; material lines plus labor make the project estimate.', workedExample:{label:'100 ft privacy fence with entered prices',input:{length:100,height:6,postSpacing:8,corners:0,ends:2,gates:1,gateWidth:4,waste:10},note:'Enter supplier or contractor quotes in the price fields for a meaningful estimate.'}, assumptions:[{label:'Market price','value':'Never fabricated'},{label:'Labor','value':'User-entered per linear foot or flat'},{label:'Waste','value':'10% default'},{label:'Cost completeness','value':'Missing prices are flagged'}], related:['fence-calculator','fence-post-calculator','concrete-calculator']
  },
  {
    slug:'fence-post-calculator', name:'Fence Post Calculator', h1:'Fence Post Calculator', family:'project', howItWorks:'Gate openings are removed from the total run, spacing determines estimated post positions, and gate posts are counted separately.', formula:'Net run = total length − gate openings. Estimated positions = ceil(net run ÷ spacing) + 1; gate posts = gates × 2.', workedExample:{label:'100 ft fence, 8 ft spacing, one 4 ft gate',input:{length:100,spacing:8,corners:0,ends:2,gates:1,gateWidth:4},note:'Exact post placement should follow the actual fence layout.'}, assumptions:[{label:'Default spacing','value':'8 ft'},{label:'Default ends','value':'2'},{label:'Gate posts','value':'2 per gate'},{label:'Layout status','value':'Planning estimate'}], related:['fence-calculator','fence-cost-calculator','concrete-calculator']
  },
  {
    slug:'deck-material-calculator', name:'Deck Material Calculator', h1:'Deck Material Calculator', family:'project', howItWorks:'The estimator calculates decking rows and stock pieces, then joist count and optional beam/post quantities. It deliberately does not design a safe structure.', formula:'Board rows use deck width ÷ board coverage width. Board stock pieces use run length ÷ board length. Joists use spacing along the board run width. Waste is then applied to order quantities.', workedExample:{label:'12 × 20 ft deck with 5.5 in boards and 16 in joist spacing',input:{length:20,width:12,boardWidth:5.5,boardLength:16,joistSpacing:16,waste:10},note:'Confirm the framing design separately with local code, span tables or a qualified professional.'}, assumptions:[{label:'Board width','value':'5.5 in default'},{label:'Board gap','value':'1/8 in default'},{label:'Joist spacing','value':'16 in default'},{label:'Fasteners','value':'2 per board/joist intersection default'}], related:['concrete-calculator','fence-post-calculator','paver-patio-calculator']
  },
];

export const CALCULATORS: CalculatorDefinition[] = STRUCTURE.map((entry) => ({ ...entry, ...CALCULATOR_COPY[entry.slug] }));

export function getCalculator(slug: string): CalculatorDefinition | undefined { return CALCULATORS.find((c) => c.slug === slug); }
