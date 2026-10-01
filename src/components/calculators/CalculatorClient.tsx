'use client';

import { memo, useMemo, useState } from 'react';
import Link from 'next/link';
import { calculateBulk, compareDepths, calculateDriveway, calculateConcrete, calculatePavers, calculatePaverPatio, calculateFence, calculateFenceCost, calculateFencePosts, calculateDeckMaterials, type BulkResult, type DrivewayResult, type ConcreteResult, type PaverResult, type FenceResult, type FenceCostResult, type FencePostResult, type DeckResult, type Shape } from '@/index';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { Button, Card, Metric, Notice, SectionHeading } from '../ui/Primitives';
import { AlertIcon, ArrowRightIcon, CheckIcon, FolderIcon, PrinterIcon } from '../ui/icons';
import { CurrencyText } from '../currency/CurrencyText';
import { useCurrency } from '../currency/CurrencyProvider';
import { CalculatorForm, defaultForm, type CalculatorFormState } from './CalculatorForm';
import { getCalculator, type CalculatorDefinition, type CalculatorSlug } from './registry';
import { CALCULATOR_GUIDES } from '@/content/guides';
import { resultToProjectMaterial, resultToProjectAreas } from './project-mapper';
import { addMaterialToProject, loadProject, rebuildProject, saveProject } from '@/lib/project-store';

import { shapeFromForm, runCalculatorSummary, parseEngineError, runCalculator as safeResult } from './engine-bridge';

export function CalculatorClient({ definition }: { definition: CalculatorDefinition }) {
  const { code } = useCurrency();
  const [state,setState] = useState<CalculatorFormState>(() => defaultForm(definition.slug));
  const [result,setResult] = useState<unknown>(() => null);
  const [errors,setErrors] = useState<Record<string,string>>({});
  const [message,setMessage] = useState('');
  const [projectAdded,setProjectAdded] = useState(false);

  const calculate = () => {
    setErrors({}); setMessage(''); setProjectAdded(false);
    try { setResult(safeResult(definition.slug,state)); }
    catch (error) { const parsed=parseEngineError(error); if (parsed) setErrors({[parsed.field]:parsed.message}); else setMessage(error instanceof Error ? error.message : 'Please review the inputs.'); setResult(null); }
  };
  const reset = () => { setState(defaultForm(definition.slug)); setResult(null); setErrors({}); setMessage(''); setProjectAdded(false); };
  const addToProject = () => { if (!result) return; const p=loadProject(); const summary=runCalculatorSummary(definition.slug,state,result,code); const material=resultToProjectMaterial(definition.slug,result,{inputs:summary.inputs,results:summary.results,formState:state,currencyCode:code}); const areas=resultToProjectAreas(definition.slug,result,state.areas.map(shapeFromForm)); const next=addMaterialToProject(p,material); const withAreas=rebuildProject({...next,areas:[...next.areas,...areas]}); saveProject(withAreas); setProjectAdded(true); };

  const exampleState = useMemo(() => {
    const next=defaultForm(definition.slug);
    const ex=definition.workedExample.input;
    for (const [k,v] of Object.entries(ex)) { if (typeof v === 'number') next.fields[k] = String(v); else if (typeof v === 'string') next.fields[k]=v; }
    if ('shape' in ex || ('length' in ex && 'width' in ex && ['paver-calculator','paver-patio-calculator','deck-material-calculator'].includes(definition.slug))) {
      next.areas=[{...next.areas[0],kind:String(ex.shape ?? 'rectangle') as 'rectangle'|'circle'|'triangle'|'area',length:String(ex.length ?? '20'),width:String(ex.width ?? '30'),sqFt:String(ex.sqFt ?? '600')}];
    }
    if (definition.slug==='concrete-calculator') {
      next.concreteParts=[{...next.concreteParts[0],length:String(ex.length ?? '20'),width:String(ex.width ?? '30'),thickness:String(ex.thickness ?? '4')}];
    }
    return next;
  },[definition]);
  const exampleResult = useMemo(() => { try { return safeResult(definition.slug,exampleState); } catch { return null; } },[definition.slug,exampleState]);

  return <div className="container calculator-page"><Breadcrumbs items={[{label:'Calculators',href:'/calculators'},{label:definition.name}]}/><div className="calculator-head"><div><div className="eyebrow">{definition.family === 'material' ? 'Material planner' : definition.family === 'cost' ? 'Cost planner' : 'Project planner'}</div><h1>{definition.h1}</h1><p>{definition.intro}</p></div><Link className="button button-secondary" href="/projects"><FolderIcon size={16}/> Project Mode</Link></div><div className="calculator-layout"><div><CalculatorForm definition={definition} state={state} setState={setState} errors={errors} onCalculate={calculate} onReset={reset}/>{message && <div style={{marginTop:12}}><Notice tone="warning" title="Input needs attention">{message}</Notice></div>}<ContentSections definition={definition} exampleResult={exampleResult}/></div><div className="sticky-result"><ResultPanel definition={definition} result={result} onAddToProject={addToProject} projectAdded={projectAdded}/></div></div></div>;
}

function ResultPanel({definition,result,onAddToProject,projectAdded}:{definition:CalculatorDefinition;result:unknown;onAddToProject:()=>void;projectAdded:boolean}) {
  if (!result) return <Card><div className="empty-state" aria-live="polite"><CalculatorFormIcon/><h2>Your estimate will appear here</h2><p>Enter your dimensions, then calculate. Results stay tied to the tested engine.</p></div></Card>;
  return <Card className="result-card" title="Your estimate" eyebrow="Calculated result"><p className="sr-only" role="status" aria-live="polite">{resultAnnouncement(result)}</p><ResultContent slug={definition.slug} result={result}/><div className="toolbar"><Button type="button" tone="secondary" onClick={onAddToProject}>{projectAdded ? <><CheckIcon size={16}/> Added to Project</> : <><FolderIcon size={16}/> Add to Project</>}</Button><Link className="button button-secondary" href="/projects/print"><PrinterIcon size={16}/> Print plan</Link></div></Card>;
}

/** Concise, human-labelled announcement for screen readers when a result is produced. */
const ANNOUNCE_KEYS: Array<[string, string]> = [
  ['recommendedOrderCuYd', 'Order cubic yards'], ['totalOrderCuYd', 'Order cubic yards'], ['orderCuYd', 'Order cubic yards'],
  ['volumeCuYd', 'Calculated cubic yards'], ['areaSqFt', 'Area square feet'], ['tons', 'Tons'],
  ['recommendedReadyMixCuYd', 'Ready-mix cubic yards'], ['paversRequired', 'Pavers'],
  ['deckingBoardsRequired', 'Decking boards'], ['totalPosts', 'Total posts'],
  ['railPiecesRequired', 'Rails'], ['fastenersOrdered', 'Fasteners'],
];
function resultAnnouncement(result: unknown): string {
  if (!result || typeof result !== 'object') return 'Result updated.';
  const record = result as Record<string, unknown>;
  const parts: string[] = [];
  for (const [key, label] of ANNOUNCE_KEYS) {
    const value = record[key];
    if (typeof value === 'number' && parts.length < 4) parts.push(`${label} ${value}`);
  }
  return parts.length ? `Result updated. ${parts.join('. ')}.` : 'Result updated.';
}

const SUMMARY_LABELS: Record<string, string> = {
  areaSqFt: 'Area (sq ft)', volumeCuYd: 'Volume (cu yd)', recommendedOrderCuYd: 'Order (cu yd)',
  tons: 'Tons', paversRequired: 'Pavers', totalPosts: 'Posts', deckingBoardsRequired: 'Decking boards',
  orderCuYd: 'Order (cu yd)', totalOrderCuYd: 'Order (cu yd)',
};

function CalculatorFormIcon(){return <div className="tool-icon" style={{margin:'0 auto 12px',background:'var(--brand-soft)',color:'var(--brand)',width:46,height:46}}><FolderIcon size={20}/></div>}

/* Pure props-driven subtrees. Memoised so typing in a form field does not re-render
   the whole static content block or the result tables. */
const ResultContent = memo(function ResultContent({slug,result}:{slug:CalculatorSlug;result:unknown}) {
  if (slug==='fence-cost-calculator') return <FenceCostResultView result={result as FenceCostResult}/>;
  if (slug==='fence-calculator') return <FenceResultView result={result as FenceResult}/>;
  if (slug==='fence-post-calculator') return <FencePostResultView result={result as FencePostResult}/>;
  if (slug==='deck-material-calculator') return <DeckResultView result={result as DeckResult}/>;
  if (slug==='concrete-calculator') return <ConcreteResultView result={result as ConcreteResult}/>;
  if (slug==='driveway-gravel-calculator') return <DrivewayResultView result={result as DrivewayResult}/>;
  if (slug==='paver-calculator' || slug==='paver-patio-calculator') return <PaverResultView result={result as PaverResult}/>;
  return <BulkResultView slug={slug} result={result as BulkResult}/>;
});

function BulkResultView({slug,result}:{slug:CalculatorSlug;result:BulkResult}) { const depthCompare=slug==='mulch-calculator'?compareDepths({material:result.material,areas:[{kind:'area',sqFt:result.areaSqFt}],wastePercent:result.wastePercent},[2,3,4]):[]; return <div className="result-body"><div className="metrics"><Metric featured label="Cubic yards" value={result.recommendedOrderCuYd} detail={`${result.volumeCuYd} yd³ calculated`} /><Metric label="Tons" value={result.tons.toFixed(2)} /><Metric label="Square feet" value={result.areaSqFt.toFixed(2)} /><Metric label="Waste" value={`${result.wastePercent}%`} /></div><div style={{marginTop:12}} className="stack"><div><table className="result-table"><tbody><tr><td>Cubic feet</td><td>{result.volumeCuFt.toFixed(2)}</td></tr><tr><td>Metric volume</td><td>{result.volumeCuM.toFixed(2)} m³</td></tr><tr><td>Tonnes</td><td>{result.tonnes.toFixed(2)}</td></tr><tr><td>Purchase advice</td><td>{result.purchaseAdvice}</td></tr>{result.loads!==undefined&&<tr><td>Truckloads</td><td>{result.loads}</td></tr>}</tbody></table></div>{depthCompare.length>0&&<div><div className="metric-label">Depth comparison</div><table className="result-table"><thead><tr><th>Depth</th><th>Order yards</th><th>Tons</th></tr></thead><tbody>{depthCompare.map(x=><tr key={x.depthIn}><td>{x.depthIn} in</td><td>{x.result.recommendedOrderCuYd}</td><td>{x.result.tons.toFixed(2)}</td></tr>)}</tbody></table></div>}{result.costs.length>0&&<div><div className="metric-label">Entered pricing</div><table className="result-table"><tbody>{result.costs.map((c,i)=><tr key={i}><td>{c.basis}</td><td><CurrencyText amount={c.total}/></td></tr>)}</tbody></table></div>}{result.warnings.map((w,i)=><Notice key={i} tone="warning" title="Planning note">{w}</Notice>)}</div></div> }

function DrivewayResultView({result}: {result:DrivewayResult}) { return <div className="result-body"><div className="metrics"><Metric featured label="Order volume" value={`${result.totalOrderCuYd} yd³`} /><Metric label="Tons" value={result.totalTons.toFixed(2)} /><Metric label="Area" value={`${result.areaSqFt.toFixed(0)} sq ft`} /><Metric label="Depth" value={`${result.totalDepthIn} in`} /></div><div style={{marginTop:12}}><table className="result-table"><thead><tr><th>Layer</th><th>Order yd³</th><th>Tons</th></tr></thead><tbody>{result.layers.map(l=><tr key={l.name}><td>{l.name}</td><td>{l.result.recommendedOrderCuYd}</td><td>{l.result.tons.toFixed(2)}</td></tr>)}</tbody></table>{result.delivery&&<div className="notice notice-info" style={{marginTop:12}}><div><strong>Delivery</strong>{result.delivery.loads} loads × {result.delivery.truckCapacityTons} tons = <CurrencyText amount={result.delivery.totalFee}/> delivery.</div></div>}{result.totalCost!==undefined&&<Metric label="Entered total" value={<CurrencyText amount={result.totalCost}/>}/>} {result.warnings.map((w,i)=><Notice key={i} tone="warning" title="Planning note">{w}</Notice>)}</div></div> }

function ConcreteResultView({result}: {result:ConcreteResult}) { return <div className="result-body"><div className="metrics"><Metric featured label="Order volume" value={`${result.orderCuYd} yd³`} /><Metric label="Ready-mix order" value={`${result.recommendedReadyMixCuYd} yd³`} /><Metric label="Waste" value={`${result.wastePercent}%`} /><Metric label="Approx. weight" value={`${(result.approxWeightLb/2000).toFixed(2)} tons`} /></div><table className="result-table" style={{marginTop:12}}><thead><tr><th>Bag</th><th>Count</th></tr></thead><tbody>{result.bags.map(b=><tr key={b.bagLb}><td>{b.bagLb} lb</td><td>{b.count}</td></tr>)}</tbody></table>{result.warnings.map((w,i)=><Notice key={i} tone="warning" title="Planning note">{w}</Notice>)}</div> }

function PaverResultView({result}: {result:PaverResult}) { return <div className="result-body"><div className="metrics"><Metric featured label="Pavers" value={result.paversRequired} /><Metric label="Area" value={`${result.areaSqFt.toFixed(0)} sq ft`} /><Metric label="Base" value={`${result.base.recommendedOrderCuYd} yd³`} /><Metric label="Bedding sand" value={`${result.beddingSand.recommendedOrderCuYd} yd³`} /></div><table className="result-table" style={{marginTop:12}}><tbody><tr><td>Edge restraint</td><td>{result.edgeOrderLinearFt} linear ft</td></tr><tr><td>Edge pieces</td><td>{result.edgePieces ?? '—'}</td></tr><tr><td>Waste</td><td>{result.wastePercent}%</td></tr></tbody></table>{result.shoppingList.map(item=><div className="shopping-item" key={item.id}><span>{item.name}</span><strong>{item.quantity} {item.unit}</strong></div>)}{result.warnings.map((w,i)=><Notice key={i} tone="warning" title="Planning note">{w}</Notice>)}</div> }

function FenceResultView({result}: {result:FenceResult}) { return <div className="result-body"><div className="metrics"><Metric featured label="Total posts" value={result.posts.totalPosts} /><Metric label="Rails" value={result.railPiecesRequired} /><Metric label="Concrete" value={`${result.concrete.recommendedReadyMixCuYd} yd³`} /><Metric label="Hardware" value={result.hardware.fastenerCount} /></div><table className="result-table" style={{marginTop:12}}><tbody><tr><td>Line posts</td><td>{result.posts.linePosts}</td></tr><tr><td>Corner posts</td><td>{result.posts.cornerPosts}</td></tr><tr><td>End posts</td><td>{result.posts.endPosts}</td></tr><tr><td>Gate posts</td><td>{result.posts.gatePosts}</td></tr><tr><td>Rail linear feet</td><td>{result.railLinearFtRequired.toFixed(2)}</td></tr><tr><td>Pickets/panels</td><td>{result.picketsRequired ?? result.panelsRequired ?? result.chainLinkLinearFtRequired ?? '—'}</td></tr></tbody></table>{result.shoppingList.map(item=><div className="shopping-item" key={item.id}><span>{item.name}</span><strong>{item.quantity} {item.unit}</strong></div>)}{result.warnings.map((w,i)=><Notice key={i} tone="warning" title="Planning note">{w}</Notice>)}</div> }

function FenceCostResultView({result}: {result:FenceCostResult}) { return <div className="result-body"><div className="metrics"><Metric featured label="Total estimate" value={<CurrencyText amount={result.totalCost}/>} /><Metric label="Materials" value={<CurrencyText amount={result.materialCost}/>} /><Metric label="Labor" value={<CurrencyText amount={result.laborCost}/>} /><Metric label="Complete" value={result.costIsComplete?'Yes':'No'} /></div><table className="result-table" style={{marginTop:12}}><tbody>{result.lines.map((line,i)=><tr key={i}><td>{line.component}</td><td><CurrencyText amount={line.cost}/></td></tr>)}</tbody></table>{!result.costIsComplete&&<Notice tone="warning" title="Incomplete price set">Missing: {result.missingPrices.join(', ')}</Notice>}{result.fence.warnings.map((w,i)=><Notice key={i} tone="warning" title="Planning note">{w}</Notice>)}</div> }

function FencePostResultView({result}: {result:FencePostResult}) { return <div className="result-body"><div className="metrics"><Metric featured label="Total posts" value={result.totalPosts} /><Metric label="Line posts" value={result.linePosts} /><Metric label="Gate posts" value={result.gatePosts} /><Metric label="Net run" value={`${result.netFenceRunFt} ft`} /></div><table className="result-table" style={{marginTop:12}}><tbody><tr><td>Corner posts</td><td>{result.cornerPosts}</td></tr><tr><td>End posts</td><td>{result.endPosts}</td></tr><tr><td>Gate openings</td><td>{result.gateOpeningLengthFt} ft</td></tr></tbody></table>{result.notes.map((n,i)=><Notice key={i} tone="warning" title="Layout note">{n}</Notice>)}</div> }

function DeckResultView({result}: {result:DeckResult}) { return <div className="result-body"><div className="metrics"><Metric featured label="Decking boards" value={result.deckingBoardsRequired} /><Metric label="Joists" value={result.joistsOrdered} /><Metric label="Fasteners" value={result.fastenersOrdered} /><Metric label="Area" value={`${result.areaSqFt.toFixed(0)} sq ft`} /></div><table className="result-table" style={{marginTop:12}}><tbody><tr><td>Decking linear feet</td><td>{result.deckingLinearFtOrdered}</td></tr><tr><td>Joist linear feet</td><td>{result.joistLinearFtOrdered}</td></tr><tr><td>Joist stock pieces</td><td>{result.joistPiecesOrdered ?? '—'}</td></tr><tr><td>Beam stock pieces</td><td>{result.beamPiecesOrdered ?? '—'}</td></tr><tr><td>Posts</td><td>{result.postCount}</td></tr></tbody></table><Notice tone="warning" title="Material planning only">{result.warnings[0]}</Notice>{result.warnings.slice(1).map((w,i)=><Notice key={i} tone="warning" title="Planning note">{w}</Notice>)} </div> }

const ContentSections = memo(function ContentSections({definition,exampleResult}:{definition:CalculatorDefinition;exampleResult:unknown}) { return <div className="stack" style={{marginTop:18}}><Card title="What this calculator calculates" eyebrow="Outputs"><ul className="copy-list">{definition.outputs.map(x=><li key={x}>{x}</li>)}</ul></Card><Card title="Projects this calculator covers" eyebrow="Where it is used"><ul className="content-links">{definition.useCases.map(u=><li key={u.label}><strong>{u.label}</strong><span className="content-link-note">{u.detail}</span></li>)}</ul></Card><Card title="How the calculation works" eyebrow="Method"><p>{definition.howItWorks}</p><p><strong>Formula:</strong> {definition.formula}</p></Card><Card title="Worked example" eyebrow="Example"><p><strong>{definition.workedExample.label}</strong></p><p>{definition.workedExample.note}</p>{exampleResult ? <div className="chip-row"><span className="chip">Example result generated with the same engine</span>{exampleSummary(exampleResult).map((x,i)=><span className="chip" key={i}>{x}</span>)}</div> : null}</Card><Card title="Reading the results" eyebrow="Understanding the outputs"><ul className="copy-list">{definition.outputNotes.map(n=><li key={n.label}><strong>{n.label}.</strong> {n.text}</li>)}</ul></Card><Card title="Assumptions" eyebrow="Transparency"><div className="assumption-list">{definition.assumptions.map((a,i)=><div className="assumption-row" key={i}><span>{a.label}</span><span>{a.value}</span></div>)}</div><p className="subtle" style={{marginBottom:0}}>Central engine assumptions can be inspected in the methodology view. User-entered prices never get replaced with invented market prices.</p></Card><Card title="Practical planning guidance" eyebrow="Use the estimate wisely"><ul className="copy-list">{definition.planning.map(x=><li key={x}>{x}</li>)}</ul></Card><Card title="Common mistakes" eyebrow="Before you buy"><ul className="copy-list">{definition.mistakes.map(x=><li key={x}>{x}</li>)}</ul></Card><Card title="Important limitations" eyebrow="Accuracy"><Notice tone="warning" title="Planning estimate">Material densities, product yields, local conditions, installation systems and supplier packaging can differ. Confirm quantities before purchase. This site does not replace structural engineering, property surveys, local code review or manufacturer instructions where applicable.</Notice></Card><Card title="Frequently asked questions" eyebrow="FAQ">{definition.faq.map((f,i)=><details key={i} style={{borderBottom:'1px solid var(--line)',padding:'11px 0'}}><summary style={{fontWeight:750,cursor:'pointer'}}>{f.q}</summary><p style={{color:'var(--muted)',marginBottom:0}}>{f.a}</p></details>)}</Card><Card title="Planning guides" eyebrow="Learn the process"><ul className="content-links">{(()=>{const guide=CALCULATOR_GUIDES[definition.slug]; const links=[guide.project,guide.material,guide.cost,guide.extra].filter((item):item is {href:string;label:string}=>Boolean(item)); return links.map(item=><li key={item.href}><Link href={item.href}>{item.label}</Link></li>);})()}</ul></Card><Card title="Related calculators" eyebrow="Next tool"><div className="grid-3">{definition.related.map(slug=>{const c=getCalculator(slug); return c ? <Link className="tool-card-link" href={`/calculators/${slug}`} key={slug}>{c.name} <ArrowRightIcon size={14}/></Link> : null;})}</div></Card></div>; });

function exampleSummary(result:unknown):string[] { const r=result as Record<string,unknown>; const out:string[]=[]; for(const key of ['areaSqFt','volumeCuYd','recommendedOrderCuYd','tons','paversRequired','totalPosts','deckingBoardsRequired','orderCuYd']) { if(typeof r[key]==='number') out.push(`${SUMMARY_LABELS[key] ?? key}: ${Number(r[key]).toFixed(2)}`); } return out.slice(0,4); }
