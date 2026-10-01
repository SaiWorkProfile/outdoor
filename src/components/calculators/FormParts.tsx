'use client';

import type { ReactNode } from 'react';
import { Field, NumberInput, Select, TextInput } from '../ui/Primitives';
import { useCurrency } from '../currency/CurrencyProvider';

export type ShapeForm = { kind: 'rectangle' | 'circle' | 'triangle' | 'area'; length: string; width: string; diameter: string; base: string; height: string; sqFt: string };

export const emptyShape = (): ShapeForm => ({kind:'rectangle',length:'20',width:'30',diameter:'20',base:'20',height:'15',sqFt:'600'});

export function ShapeEditor({ shape, onChange, index, removable, onRemove }: { shape: ShapeForm; onChange: (next: ShapeForm) => void; index: number; removable?: boolean; onRemove?: () => void }) {
  const update = (key: keyof ShapeForm, value: string) => onChange({...shape,[key]:value});
  return <div className="card" style={{padding:14,boxShadow:'none'}}><div className="toolbar" style={{marginTop:0,marginBottom:10}}><strong style={{fontSize:13}}>Area {index + 1}</strong>{removable && <button type="button" className="button button-danger" onClick={onRemove}>Remove</button>}</div><div className="form-grid"><Field label="Shape" htmlFor={`shape-${index}`}><Select id={`shape-${index}`} value={shape.kind} onChange={e=>update('kind',e.target.value as ShapeForm['kind'])}><option value="rectangle">Rectangle</option><option value="circle">Circle</option><option value="triangle">Triangle</option><option value="area">Known area</option></Select></Field>{shape.kind==='rectangle' && <><Field label="Length" htmlFor={`shape-length-${index}`}><UnitField value={shape.length} onChange={v=>update('length',v)} unit="ft" /></Field><Field label="Width" htmlFor={`shape-width-${index}`}><UnitField value={shape.width} onChange={v=>update('width',v)} unit="ft" /></Field></>}{shape.kind==='circle' && <Field label="Diameter" htmlFor={`shape-diameter-${index}`}><UnitField value={shape.diameter} onChange={v=>update('diameter',v)} unit="ft" /></Field>}{shape.kind==='triangle' && <><Field label="Base" htmlFor={`shape-base-${index}`}><UnitField value={shape.base} onChange={v=>update('base',v)} unit="ft" /></Field><Field label="Height" htmlFor={`shape-height-${index}`}><UnitField value={shape.height} onChange={v=>update('height',v)} unit="ft" /></Field></>}{shape.kind==='area' && <Field label="Known area" htmlFor={`shape-area-${index}`}><UnitField value={shape.sqFt} onChange={v=>update('sqFt',v)} unit="sq ft" /></Field>}</div></div>;
}

export function UnitField({ value, onChange, unit, min='0', step='any' }: { value: string; onChange: (v:string)=>void; unit:string; min?: string; step?: string }) {
  return <div className="unit-input"><NumberInput min={min} step={step} value={value} onChange={e=>onChange(e.target.value)} /><span className="unit">{unit}</span></div>;
}

export function PriceField({ label, value, onChange }: { label:string; value:string; onChange:(v:string)=>void }) {
  const { symbol } = useCurrency();
  return <Field label={label}><UnitField value={value} onChange={onChange} unit={symbol} min="0" step="0.01" /></Field>;
}

export function SectionLabel({ children }: { children: ReactNode }) { return <h3 className="form-section-title">{children}</h3>; }
