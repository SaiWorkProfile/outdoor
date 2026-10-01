'use client';

import { useEffect, useRef } from 'react';
import { Button, Card, Field, Select, SectionHeading, TextInput } from '../ui/Primitives';
import { emptyShape, PriceField, ShapeEditor, type ShapeForm, UnitField } from './FormParts';
import { PlusIcon, RotateIcon, TrashIcon } from '../ui/icons';
import { ENGINE_ASSUMPTIONS } from '@/data/assumptions';
import type { CalculatorDefinition, CalculatorSlug } from './registry';

/**
 * The engine reports CalcInputError.field using its own input property names and documents
 * that the UI uses it to highlight the offending input. These are the form labels that
 * correspond to each engine field, per calculator family.
 */
const ENGINE_FIELD_LABELS: Record<string, string[]> = {
  material: ['Material'], areas: ['Length', 'Known area'], depthIn: ['Depth', 'Base depth'],
  wastePercent: ['Waste allowance', 'Waste'], compactionFactor: ['Compaction'], useCase: ['Use case'],
  bagSizesCuFt: ['Bag size'], parts: ['Type'], readyMixIncrementCuYd: ['Ready-mix increment'],
  bagSpecs: ['Bag specification'], layers: ['Layer name'], deliveryFeePerLoad: ['Delivery fee / load'],
  truckCapacityTons: ['Truck capacity'], fenceLengthFt: ['Fence length'], heightFt: ['Fence height'],
  postSpacingFt: ['Post spacing'], cornerCount: ['Corners'], endCount: ['Ends'], gateCount: ['Gate count'],
  gateWidthFt: ['Gate width'], gateWidthsFt: ['Gate width'], paverLengthIn: ['Paver length'],
  paverWidthIn: ['Paver width'], jointWidthIn: ['Joint width'], baseDepthIn: ['Base depth'],
  beddingSandDepthIn: ['Bedding sand depth'], edgeLinearFt: ['Edge length'], deckLengthFt: ['Deck length'],
  deckWidthFt: ['Deck width'], deckingBoardWidthIn: ['Board width'], deckingBoardLengthFt: ['Board stock length'],
  boardGapIn: ['Board gap'], joistSpacingIn: ['Joist spacing'], joistWidthIn: ['Joist width'],
  joistDepthIn: ['Joist depth'], joistStockLengthFt: ['Joist stock length'], beamCount: ['Beam count'],
  beamLengthFt: ['Beam length'], beamStockLengthFt: ['Beam stock length'], postCount: ['Post count'],
  postHeightFt: ['Post height'], fastenersPerBoardPerJoist: ['Fasteners / board / joist'],
  picketWidthIn: ['Picket width'], picketSpacingIn: ['Picket spacing'], panelWidthFt: ['Panel width'],
  railsPerSection: ['Rails / section'], railStockLengthFt: ['Rail stock length'],
  postHoleDiameterIn: ['Post-hole diameter'], postHoleDepthIn: ['Post-hole depth'], fenceType: ['Fence type'],
  concreteLbPerCuFt: ['Concrete density'], lengthFt: ['Length'], widthFt: ['Width'], thicknessIn: ['Thickness'],
  diameterIn: ['Diameter'], count: ['Count'],
};

const CONTAINER_LABELS: Record<string, string> = {
  areas: 'Area', parts: 'Section', layers: 'Layer', bagSpecs: 'Bag specification', bagSizesCuFt: 'Bag size',
};

/** Field label inside the concrete "Part i+1" repeater card, per engine property. */
const PART_FIELD_LABELS: Record<string, string> = {
  lengthFt: 'Length', widthFt: 'Width', widthIn: 'Width', thicknessIn: 'Thickness',
  depthIn: 'Depth', diameterIn: 'Diameter', count: 'Count',
};

function humanFieldLabel(key: string): string {
  const mapped = ENGINE_FIELD_LABELS[key];
  if (mapped && mapped[0]) return mapped[0];
  /* e.g. areas[0].length -> "Area 1 — Length"; parts[1].lengthFt -> "Section 2 — Length" */
  const indexed = key.match(/^([A-Za-z]+)\[(\d+)\](?:\.(.+))?$/);
  if (indexed) {
    const container = CONTAINER_LABELS[indexed[1]] ?? humanFieldLabel(indexed[1]);
    const suffix = indexed[3] ? ` — ${humanFieldLabel(indexed[3])}` : '';
    return `${container} ${Number(indexed[2]) + 1}${suffix}`;
  }
  return key.replace(/\[\d+\]$/, '').replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
}

export type CalculatorFormState = {
  fields: Record<string,string>;
  areas: ShapeForm[];
  layers: Array<{ name:string; depth:string; material:string; compaction:string; price:string }>;
  concreteParts: Array<{ kind:string; label:string; length:string; width:string; thickness:string; widthIn:string; depth:string; diameter:string; count:string }>;
};

export function defaultForm(slug: CalculatorSlug): CalculatorFormState {
  const fields: Record<string,string> = {waste:'10', price:'', density:'', length:'20', width:'30', depth:'3', useCase:'', truck:'10', deliveryFee:'', paverLength:'6', paverWidth:'6', joint:'.125', baseDepth:'6', sandDepth:'1', edge:'', fenceLength:'100', fenceHeight:'6', postSpacing:'8', corners:'0', ends:'2', gates:'1', gateWidth:'4', picketWidth:'5.5', picketSpacing:'.125', panelWidth:'8', rails:'2', railLength:'8', holeDiameter:'12', holeDepth:'30', fastenersPicket:'2', fastenersPanel:'8', gatePrice:'', postPrice:'', railPrice:'', picketPrice:'', panelPrice:'', concretePrice:'', hardwarePrice:'', chainLinkPrice:'', laborPerFt:'', laborFlat:'', basePrice:'', sandPrice:'', boardWidth:'5.5', boardLength:'16', boardGap:'.125', boardRun:'length', joistSpacing:'16', joistWidth:'1.5', joistDepth:'7.25', joistStock:'', beamCount:'0', beamLength:'', beamStock:'', beamWidth:'', beamDepth:'', postCount:'0', postHeight:'', fasteners:'2', deckingPrice:'', joistPrice:'', beamPrice:'', deckPostPrice:'', fastenerPrice:'', rimPrice:'', patioName:'My Paver Patio'};
  if (slug === 'gravel-calculator') fields.useCase='walkway';
  if (slug === 'mulch-calculator') fields.useCase='garden-bed';
  if (slug === 'topsoil-calculator') { fields.useCase='garden-bed'; fields.depth='6'; }
  if (slug === 'soil-calculator') fields.useCase='general';
  if (slug === 'sand-calculator') { fields.useCase='paver-bedding'; fields.depth='1'; }
  if (slug === 'pea-gravel-calculator') { fields.useCase='walkway'; fields.depth='2'; }
  if (slug === 'landscape-rock-calculator') { fields.useCase='decorative'; fields.depth='3'; }
  if (slug === 'paver-base-calculator') { fields.useCase='patio'; fields.depth='6'; fields.compaction='1.1'; }
  if (slug === 'driveway-gravel-calculator') { fields.depth='4'; }
  if (slug === 'concrete-calculator') { fields.length='20'; fields.width='30'; fields.thickness='4'; }
  return {fields, areas:[emptyShape()], layers:[{name:'Base layer',depth:'4',material:'gravel',compaction:'1.15',price:''},{name:'Middle layer',depth:'2',material:'gravel',compaction:'1.15',price:''},{name:'Surface layer',depth:'2',material:'gravel',compaction:'1.10',price:''}], concreteParts:[{kind:'slab',label:'Slab 1',length:'20',width:'30',thickness:'4',widthIn:'12',depth:'4',diameter:'12',count:'1'}]};
}

export function CalculatorForm({ definition, state, setState, errors, onCalculate, onReset }: { definition: CalculatorDefinition; state: CalculatorFormState; setState: (next: CalculatorFormState)=>void; errors: Record<string,string>; onCalculate:()=>void; onReset:()=>void }) {
  const set = (key:string,value:string) => setState({...state,fields:{...state.fields,[key]:value}});
  const updateArea = (i:number,next:ShapeForm) => setState({...state,areas:state.areas.map((a,index)=>index===i?next:a)});
  const formRef = useRef<HTMLDivElement | null>(null);

  /* Highlight the input the engine reported, using the labels the forms actually render. */
  useEffect(() => {
    const root = formRef.current;
    if (!root) return;
    const mark = (field: Element, control: Element | null | undefined) => {
      field.classList.add('field-invalid');
      if (control) control.setAttribute('aria-invalid', 'true');
    };
    const repeaterCard = (prefix: string, index: number) =>
      Array.from(root.querySelectorAll('.card')).find((card) =>
        (card.querySelector('.toolbar strong')?.textContent ?? '').trim() === `${prefix} ${index + 1}`);
    for (const el of Array.from(root.querySelectorAll('.field-invalid'))) el.classList.remove('field-invalid');
    for (const el of Array.from(root.querySelectorAll('[aria-invalid="true"]'))) el.removeAttribute('aria-invalid');
    for (const key of Object.keys(errors)) {
      /* Indexed engine keys target the repeater card they came from:
         areas[i].length -> the ShapeEditor's #shape-length-i input,
         parts[i].thicknessIn -> the matching field inside "Part i+1". */
      const indexed = key.match(/^([A-Za-z]+)\[(\d+)\]\.(.+)$/);
      if (indexed) {
        const [container, indexText, prop] = [indexed[1], indexed[2], indexed[3]];
        if (container === 'areas') {
          const suffix = prop === 'sqFt' ? 'area' : prop;
          const control = root.querySelector(`#shape-${suffix}-${indexText}`);
          const field = control?.closest('.field');
          if (field && control) { mark(field, control); continue; }
        }
        if (container === 'parts') {
          const wanted = PART_FIELD_LABELS[prop];
          const card = repeaterCard('Part', Number(indexText));
          const field = wanted
            ? Array.from(card?.querySelectorAll('.field') ?? []).find(
                (f) => (f.querySelector('label')?.textContent ?? '').trim() === wanted,
              )
            : undefined;
          if (field) { mark(field, field.querySelector('input, select, textarea')); continue; }
        }
      }
      const labels = ENGINE_FIELD_LABELS[key] ?? [humanFieldLabel(key)];
      const matches = Array.from(root.querySelectorAll('.field')).filter((field) => {
        const label = field.querySelector('label');
        return !!label && labels.includes(label.textContent.trim());
      });
      if (matches.length !== 1) continue;
      mark(matches[0], matches[0].querySelector('input, select, textarea'));
    }
  }, [errors]);
  const isBulk = !!definition.material && !['paver-base-calculator'].includes(definition.slug) && !['driveway-gravel-calculator','paver-calculator','paver-patio-calculator','fence-calculator','fence-cost-calculator','fence-post-calculator','deck-material-calculator','concrete-calculator'].includes(definition.slug);
  return <div ref={formRef}><Card title="Calculator input" eyebrow="Inputs">
    {isBulk && <><div className="form-section"><SectionHeading title="Project areas" body="Use one or more areas. The engine adds them before calculating volume."/><div className="stack">{state.areas.map((a,i)=><ShapeEditor key={i} shape={a} index={i} removable={state.areas.length>1} onRemove={()=>setState({...state,areas:state.areas.filter((_,x)=>x!==i)})} onChange={next=>updateArea(i,next)}/>)}</div><div className="toolbar"><Button type="button" tone="secondary" onClick={()=>setState({...state,areas:[...state.areas,emptyShape()]})}><PlusIcon size={16}/> Add area</Button></div></div><div className="form-section"><div className="form-grid"><Field label="Depth" htmlFor="depth"><UnitField value={state.fields.depth} onChange={v=>set('depth',v)} unit="in" min="0.01"/><span className="field-hint">Choose a depth appropriate to the use case.</span></Field><Field label="Use case" htmlFor="useCase"><Select id="useCase" value={state.fields.useCase} onChange={e=>set('useCase',e.target.value)}><option value="">General planning</option>{definition.useCaseIds?.map(id=><option value={id} key={id}>{id.replaceAll('-',' ')}</option>)}</Select></Field><Field label="Waste allowance" htmlFor="waste"><UnitField value={state.fields.waste} onChange={v=>set('waste',v)} unit="%" min="0"/></Field><Field label="Supplier density" htmlFor="density"><UnitField value={state.fields.density} onChange={v=>set('density',v)} unit="t/yd³" min="0"/><span className="field-hint">Leave blank to use the centralized typical value.</span></Field><PriceField label="Price per cubic yard" value={state.fields.price} onChange={v=>set('price',v)}/><Field label="Truck capacity" htmlFor="truck"><UnitField value={state.fields.truck} onChange={v=>set('truck',v)} unit="tons" min="0.01"/></Field></div></div></>}
    {definition.slug==='paver-base-calculator' && <BulkLikeBaseForm state={state} set={set} setState={setState} definition={definition}/>} 
    {['paver-calculator','paver-patio-calculator'].includes(definition.slug) && <PaverForm state={state} set={set} setState={setState} patio={definition.slug==='paver-patio-calculator'}/>} 
    {definition.slug==='driveway-gravel-calculator' && <DrivewayForm state={state} set={set} setState={setState}/>} 
    {definition.slug==='concrete-calculator' && <ConcreteForm state={state} setState={setState}/>} 
    {['fence-calculator','fence-cost-calculator'].includes(definition.slug) && <FenceForm state={state} set={set} cost={definition.slug==='fence-cost-calculator'}/>} 
    {definition.slug==='fence-post-calculator' && <FencePostForm state={state} set={set}/>} 
    {definition.slug==='deck-material-calculator' && <DeckForm state={state} set={set}/>} 
    {Object.entries(errors).length > 0 && <div className="notice notice-warning" role="alert" aria-live="assertive"><div><strong>This calculation could not run</strong><ul style={{margin:'6px 0 0',paddingLeft:18}}>{Object.entries(errors).map(([key,msg])=><li key={key}><b>{humanFieldLabel(key)}</b> — {msg}</li>)}</ul></div></div>}
    <div className="toolbar"><Button type="button" tone="primary" onClick={onCalculate}>Calculate</Button><Button type="button" tone="secondary" onClick={onReset}><RotateIcon size={16}/> Reset</Button></div>
  </Card></div>;
}

function BulkLikeBaseForm({state,set,setState,definition}:{state:CalculatorFormState;set:(k:string,v:string)=>void;setState:(n:CalculatorFormState)=>void;definition:CalculatorDefinition}) { return <><div className="form-section"><SectionHeading title="Base areas" body="Use the same shapes as the other bulk calculators."/><div className="stack">{state.areas.map((a,i)=><ShapeEditor key={i} shape={a} index={i} removable={state.areas.length>1} onRemove={()=>setState({...state,areas:state.areas.filter((_,x)=>x!==i)})} onChange={next=>setState({...state,areas:state.areas.map((x,j)=>j===i?next:x)})}/>)}</div><div className="toolbar"><Button type="button" tone="secondary" onClick={()=>setState({...state,areas:[...state.areas,emptyShape()]})}><PlusIcon size={16}/> Add area</Button></div></div><div className="form-section"><div className="form-grid"><Field label="Base depth"><UnitField value={state.fields.depth} onChange={v=>set('depth',v)} unit="in" min="0.01"/></Field><Field label="Use case"><Select value={state.fields.useCase} onChange={e=>set('useCase',e.target.value)}>{definition.useCaseIds?.map(id=><option key={id} value={id}>{id.replaceAll('-',' ')}</option>)}</Select></Field><Field label="Waste"><UnitField value={state.fields.waste} onChange={v=>set('waste',v)} unit="%" min="0"/></Field><Field label="Supplier density"><UnitField value={state.fields.density} onChange={v=>set('density',v)} unit="t/yd³" min="0"/></Field><Field label="Compaction"><UnitField value={state.fields.compaction ?? '1.1'} onChange={v=>set('compaction',v)} unit="×" min="1" step="0.01"/></Field><PriceField label="Price per cubic yard" value={state.fields.price} onChange={v=>set('price',v)}/></div></div></> }

function PaverForm({state,set,setState,patio}:{state:CalculatorFormState;set:(k:string,v:string)=>void;setState:(n:CalculatorFormState)=>void;patio:boolean}) { return <><div className="form-section"><SectionHeading title={patio?'Patio layout':'Paver area'} body="Add multiple sections when the project is not one simple rectangle."/><div className="stack">{state.areas.map((a,i)=><ShapeEditor key={i} shape={a} index={i} removable={state.areas.length>1} onRemove={()=>setState({...state,areas:state.areas.filter((_,x)=>x!==i)})} onChange={next=>setState({...state,areas:state.areas.map((x,j)=>j===i?next:x)})}/>)}</div><div className="toolbar"><Button type="button" tone="secondary" onClick={()=>setState({...state,areas:[...state.areas,emptyShape()]})}><PlusIcon size={16}/> Add area</Button></div></div><div className="form-section"><div className="form-grid-3"><Field label="Paver length"><UnitField value={state.fields.paverLength} onChange={v=>set('paverLength',v)} unit="in" min="0.01"/></Field><Field label="Paver width"><UnitField value={state.fields.paverWidth} onChange={v=>set('paverWidth',v)} unit="in" min="0.01"/></Field><Field label="Joint width"><UnitField value={state.fields.joint} onChange={v=>set('joint',v)} unit="in" min="0"/></Field><Field label="Base depth"><UnitField value={state.fields.baseDepth} onChange={v=>set('baseDepth',v)} unit="in" min="0.01"/></Field><Field label="Bedding sand depth"><UnitField value={state.fields.sandDepth} onChange={v=>set('sandDepth',v)} unit="in" min="0.01"/></Field><Field label="Waste"><UnitField value={state.fields.waste} onChange={v=>set('waste',v)} unit="%" min="0"/></Field><Field label="Edge length"><UnitField value={state.fields.edge} onChange={v=>set('edge',v)} unit="ft" min="0"/></Field><PriceField label="Paver price / piece" value={state.fields.price} onChange={v=>set('price',v)}/><PriceField label="Base / cubic yard" value={state.fields.basePrice} onChange={v=>set('basePrice',v)}/><PriceField label="Bedding sand / cubic yard" value={state.fields.sandPrice} onChange={v=>set('sandPrice',v)}/><PriceField label="Edging / linear ft" value={state.fields.laborFlat} onChange={v=>set('laborFlat',v)}/></div>{patio && <Field label="Patio name"><TextInput value={state.fields.patioName} onChange={e=>set('patioName',e.target.value)}/></Field>}</div></> }

function DrivewayForm({state,set,setState}:{state:CalculatorFormState;set:(k:string,v:string)=>void;setState:(n:CalculatorFormState)=>void}) { return <><div className="form-section"><SectionHeading title="Driveway footprint" body="Configure one or more sections; layers are applied across all sections."/><div className="stack">{state.areas.map((a,i)=><ShapeEditor key={i} shape={a} index={i} removable={state.areas.length>1} onRemove={()=>setState({...state,areas:state.areas.filter((_,x)=>x!==i)})} onChange={next=>setState({...state,areas:state.areas.map((x,j)=>j===i?next:x)})}/>)}</div><div className="toolbar"><Button type="button" tone="secondary" onClick={()=>setState({...state,areas:[...state.areas,emptyShape()]})}><PlusIcon size={16}/> Add section</Button></div></div><div className="form-section"><SectionHeading title="Layers" body="Edit depth, material, compaction and optional price per layer."/><div className="stack">{state.layers.map((layer,i)=><div className="card" key={i} style={{padding:14,boxShadow:'none'}}><div className="form-grid"><Field label="Layer name"><TextInput value={layer.name} onChange={e=>setState({...state,layers:state.layers.map((x,j)=>j===i?{...x,name:e.target.value}:x)})}/></Field><Field label="Material"><Select value={layer.material} onChange={e=>setState({...state,layers:state.layers.map((x,j)=>j===i?{...x,material:e.target.value}:x)})}><option value="gravel">Gravel</option><option value="paver-base">Paver base</option><option value="sand">Sand</option></Select></Field><Field label="Depth"><UnitField value={layer.depth} onChange={v=>setState({...state,layers:state.layers.map((x,j)=>j===i?{...x,depth:v}:x)})} unit="in" min="0.01"/></Field><Field label="Compaction"><UnitField value={layer.compaction} onChange={v=>setState({...state,layers:state.layers.map((x,j)=>j===i?{...x,compaction:v}:x)})} unit="×" min="1" step="0.01"/></Field><PriceField label="Price / cubic yard" value={layer.price} onChange={v=>setState({...state,layers:state.layers.map((x,j)=>j===i?{...x,price:v}:x)})}/></div></div>)}</div><div className="form-grid"><Field label="Truck capacity"><UnitField value={state.fields.truck} onChange={v=>set('truck',v)} unit="tons" min="0.01"/></Field><PriceField label="Delivery fee / load" value={state.fields.deliveryFee} onChange={v=>set('deliveryFee',v)}/></div></div></> }

function ConcreteForm({state,setState}:{state:CalculatorFormState;setState:(n:CalculatorFormState)=>void}) {
  const f=state.fields;
  const set=(k:string,v:string)=>setState({...state,fields:{...state.fields,[k]:v}});
  const update=(i:number, patch:Partial<CalculatorFormState['concreteParts'][number]>)=>setState({...state,concreteParts:state.concreteParts.map((x,j)=>j===i?{...x,...patch}:x)});
  return <>
    <div className="form-section">
      <SectionHeading title="Concrete sections" body="Mix slabs, footings and post holes in one estimate."/>
      <div className="stack">
        {state.concreteParts.map((part,i)=><div className="card" key={i} style={{padding:14,boxShadow:'none'}}>
          <div className="toolbar" style={{marginTop:0,marginBottom:8}}><strong style={{fontSize:13}}>Part {i+1}</strong><button className="button button-danger" type="button" aria-label={`Remove part ${i+1}`} onClick={()=>setState({...state,concreteParts:state.concreteParts.filter((_,x)=>x!==i)})}><TrashIcon size={15}/></button></div>
          <div className="form-grid">
            <Field label="Type"><Select value={part.kind} onChange={e=>update(i,{kind:e.target.value})}><option value="slab">Slab</option><option value="footing">Footing</option><option value="post-hole">Post hole</option></Select></Field>
            <Field label="Label"><TextInput value={part.label} onChange={e=>update(i,{label:e.target.value})}/></Field>
            {part.kind==='slab' && <>
              <Field label="Length"><UnitField value={part.length} onChange={v=>update(i,{length:v})} unit="ft" min="0.01"/></Field>
              <Field label="Width"><UnitField value={part.width} onChange={v=>update(i,{width:v})} unit="ft" min="0.01"/></Field>
              <Field label="Thickness"><UnitField value={part.thickness} onChange={v=>update(i,{thickness:v})} unit="in" min="0.01"/></Field>
            </>}
            {part.kind==='footing' && <>
              <Field label="Length"><UnitField value={part.length} onChange={v=>update(i,{length:v})} unit="ft" min="0.01"/></Field>
              <Field label="Width"><UnitField value={part.widthIn} onChange={v=>update(i,{widthIn:v})} unit="in" min="0.01"/></Field>
              <Field label="Depth"><UnitField value={part.depth} onChange={v=>update(i,{depth:v})} unit="in" min="0.01"/></Field>
            </>}
            {part.kind==='post-hole' && <>
              <Field label="Diameter"><UnitField value={part.diameter} onChange={v=>update(i,{diameter:v})} unit="in" min="0.01"/></Field>
              <Field label="Depth"><UnitField value={part.depth} onChange={v=>update(i,{depth:v})} unit="in" min="0.01"/></Field>
              <Field label="Count"><UnitField value={part.count} onChange={v=>update(i,{count:v})} unit="holes" min="1" step="1"/></Field>
            </>}
          </div>
        </div>)}
      </div>
      <div className="toolbar"><Button type="button" tone="secondary" onClick={()=>setState({...state,concreteParts:[...state.concreteParts,{...state.concreteParts[0],label:`Part ${state.concreteParts.length+1}`}]})}><PlusIcon size={16}/> Add part</Button></div>
    </div>
    <div className="form-section"><div className="form-grid">
      <Field label="Waste"><UnitField value={f.waste} onChange={v=>set('waste',v)} unit="%" min="0"/></Field>
      <Field label="Concrete density"><UnitField value={f.density} onChange={v=>set('density',v)} unit="lb/cu ft" min="0.01"/><span className="field-hint">Leave blank to use the centralized planning value.</span></Field>
    </div></div>
  </>;
}

function FencePostForm({state,set}:{state:CalculatorFormState;set:(k:string,v:string)=>void}) { return <div className="form-section"><div className="form-grid"><Field label="Fence length"><UnitField value={state.fields.fenceLength} onChange={v=>set('fenceLength',v)} unit="ft" min="0.01"/></Field><Field label="Post spacing"><UnitField value={state.fields.postSpacing} onChange={v=>set('postSpacing',v)} unit="ft" min="0.01"/></Field><Field label="Corners"><UnitField value={state.fields.corners} onChange={v=>set('corners',v)} unit="posts" min="0" step="1"/></Field><Field label="Ends"><UnitField value={state.fields.ends} onChange={v=>set('ends',v)} unit="posts" min="0" step="1"/></Field><Field label="Gate count"><UnitField value={state.fields.gates} onChange={v=>set('gates',v)} unit="gates" min="0" step="1"/></Field><Field label="Gate width"><UnitField value={state.fields.gateWidth} onChange={v=>set('gateWidth',v)} unit="ft" min="0.01"/></Field></div></div> }

function FenceForm({state,set,cost}:{state:CalculatorFormState;set:(k:string,v:string)=>void;cost:boolean}) { return <><FencePostForm state={state} set={set}/><div className="form-section"><div className="form-grid-3"><Field label="Fence type"><Select value={state.fields.fenceType ?? 'wood-picket'} onChange={e=>set('fenceType',e.target.value)}><option value="wood-picket">Wood picket</option><option value="privacy-panel">Privacy panel</option><option value="vinyl-panel">Vinyl panel</option><option value="chain-link">Chain-link</option><option value="composite-panel">Composite panel</option><option value="custom">Custom</option></Select></Field><Field label="Fence height"><UnitField value={state.fields.fenceHeight} onChange={v=>set('fenceHeight',v)} unit="ft" min="0.01"/></Field><Field label="Waste"><UnitField value={state.fields.waste} onChange={v=>set('waste',v)} unit="%" min="0"/></Field><Field label="Picket width"><UnitField value={state.fields.picketWidth} onChange={v=>set('picketWidth',v)} unit="in" min="0.01"/></Field><Field label="Picket spacing"><UnitField value={state.fields.picketSpacing} onChange={v=>set('picketSpacing',v)} unit="in" min="0"/></Field><Field label="Panel width"><UnitField value={state.fields.panelWidth} onChange={v=>set('panelWidth',v)} unit="ft" min="0.01"/></Field><Field label="Rails / section"><UnitField value={state.fields.rails} onChange={v=>set('rails',v)} unit="rails" min="1" step="1"/></Field><Field label="Rail stock length"><UnitField value={state.fields.railLength} onChange={v=>set('railLength',v)} unit="ft" min="0.01"/></Field><Field label="Post-hole diameter"><UnitField value={state.fields.holeDiameter} onChange={v=>set('holeDiameter',v)} unit="in" min="0.01"/></Field><Field label="Post-hole depth"><UnitField value={state.fields.holeDepth} onChange={v=>set('holeDepth',v)} unit="in" min="0.01"/></Field></div></div>{cost && <div className="form-section"><SectionHeading title="Your prices" body="Only entered prices affect the cost estimate, and they are shown in the currency selected in the header."/><div className="form-grid-3"><PriceField label="Post / each" value={state.fields.postPrice} onChange={v=>set('postPrice',v)}/><PriceField label="Rail / piece" value={state.fields.railPrice} onChange={v=>set('railPrice',v)}/><PriceField label="Picket / each" value={state.fields.picketPrice} onChange={v=>set('picketPrice',v)}/><PriceField label="Panel / each" value={state.fields.panelPrice} onChange={v=>set('panelPrice',v)}/><PriceField label="Concrete / cubic yard" value={state.fields.concretePrice} onChange={v=>set('concretePrice',v)}/><PriceField label="Hardware / each" value={state.fields.hardwarePrice} onChange={v=>set('hardwarePrice',v)}/><PriceField label="Gate / each" value={state.fields.gatePrice} onChange={v=>set('gatePrice',v)}/><PriceField label="Chain-link / linear ft" value={state.fields.chainLinkPrice} onChange={v=>set('chainLinkPrice',v)}/><PriceField label="Labor / linear ft" value={state.fields.laborPerFt} onChange={v=>set('laborPerFt',v)}/><PriceField label="Flat labor" value={state.fields.laborFlat} onChange={v=>set('laborFlat',v)}/></div></div>}</> }

function DeckForm({state,set}:{state:CalculatorFormState;set:(k:string,v:string)=>void}) { return <><div className="form-section"><div className="form-grid-3"><Field label="Deck length"><UnitField value={state.fields.length} onChange={v=>set('length',v)} unit="ft" min="0.01"/></Field><Field label="Deck width"><UnitField value={state.fields.width} onChange={v=>set('width',v)} unit="ft" min="0.01"/></Field><Field label="Waste"><UnitField value={state.fields.waste} onChange={v=>set('waste',v)} unit="%" min="0"/></Field><Field label="Board width"><UnitField value={state.fields.boardWidth} onChange={v=>set('boardWidth',v)} unit="in" min="0.01"/></Field><Field label="Board stock length"><UnitField value={state.fields.boardLength} onChange={v=>set('boardLength',v)} unit="ft" min="0.01"/></Field><Field label="Board gap"><UnitField value={state.fields.boardGap} onChange={v=>set('boardGap',v)} unit="in" min="0"/></Field><Field label="Board run"><Select value={state.fields.boardRun} onChange={e=>set('boardRun',e.target.value)}><option value="length">Along length</option><option value="width">Along width</option></Select></Field><Field label="Joist spacing"><UnitField value={state.fields.joistSpacing} onChange={v=>set('joistSpacing',v)} unit="in" min="0.01"/></Field><Field label="Joist width"><UnitField value={state.fields.joistWidth} onChange={v=>set('joistWidth',v)} unit="in" min="0.01"/></Field><Field label="Joist depth"><UnitField value={state.fields.joistDepth} onChange={v=>set('joistDepth',v)} unit="in" min="0.01"/></Field><Field label="Joist stock length"><UnitField value={state.fields.joistStock} onChange={v=>set('joistStock',v)} unit="ft" min="0.01"/></Field><Field label="Fasteners / board / joist"><UnitField value={state.fields.fasteners} onChange={v=>set('fasteners',v)} unit="each" min="0.01"/></Field><Field label="Beam count"><UnitField value={state.fields.beamCount} onChange={v=>set('beamCount',v)} unit="beams" min="0" step="1"/></Field><Field label="Beam length"><UnitField value={state.fields.beamLength} onChange={v=>set('beamLength',v)} unit="ft" min="0.01"/></Field><Field label="Beam stock length"><UnitField value={state.fields.beamStock} onChange={v=>set('beamStock',v)} unit="ft" min="0.01"/></Field><Field label="Post count"><UnitField value={state.fields.postCount} onChange={v=>set('postCount',v)} unit="posts" min="0" step="1"/></Field><Field label="Post height"><UnitField value={state.fields.postHeight} onChange={v=>set('postHeight',v)} unit="ft" min="0.01"/></Field></div></div><div className="form-section"><SectionHeading title="Optional prices" body="Enter supplier prices only when you want a cost breakdown; the breakdown follows the currency selected in the header."/><div className="form-grid-3"><PriceField label="Decking / board" value={state.fields.deckingPrice} onChange={v=>set('deckingPrice',v)}/><PriceField label="Joist / piece" value={state.fields.joistPrice} onChange={v=>set('joistPrice',v)}/><PriceField label="Beam / piece" value={state.fields.beamPrice} onChange={v=>set('beamPrice',v)}/><PriceField label="Post / each" value={state.fields.deckPostPrice} onChange={v=>set('deckPostPrice',v)}/><PriceField label="Fastener / each" value={state.fields.fastenerPrice} onChange={v=>set('fastenerPrice',v)}/><PriceField label="Rim joist / linear ft" value={state.fields.rimPrice} onChange={v=>set('rimPrice',v)}/></div></div></> }
