import { createContext, useContext, useId, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type ButtonHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AlertIcon, CheckIcon, InfoIcon } from './icons';

/**
 * Field context so a <Field> label is always programmatically associated with the
 * control it wraps, even when the control is nested inside a UnitField/PriceField.
 * Without this the label's `for` attribute pointed at a non-existent id and the
 * input had no accessible name at all.
 */
type FieldControl = { id?: string; describedBy?: string };
const FieldControlContext = createContext<FieldControl>({});

function useFieldControl(id: string | undefined, describedBy: string | undefined): FieldControl {
  const ctx = useContext(FieldControlContext);
  return { id: id ?? ctx.id, describedBy: describedBy ?? ctx.describedBy };
}

export function Button({ tone = 'primary', className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <button className={`button button-${tone} ${className}`.trim()} {...props}>{children}</button>;
}

export function Card({ title, eyebrow, children, className = '' }: { title?: ReactNode; eyebrow?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`card ${className}`.trim()}>{eyebrow && <div className="eyebrow">{eyebrow}</div>}{title && <h2 className="card-title">{title}</h2>}{children}</section>;
}

export function Field({ label, htmlFor, hint, error, children }: { label: string; htmlFor?: string; hint?: string; error?: string; children: ReactNode }) {
  const autoId = useId();
  const id = htmlFor ?? autoId;
  const hintId = hint && !error ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return <FieldControlContext.Provider value={{ id, describedBy }}><div className="field"><label htmlFor={id}>{label}</label>{children}{hint && !error && <div className="field-hint" id={hintId}>{hint}</div>}{error && <div className="field-error" id={errorId} role="alert">{error}</div>}</div></FieldControlContext.Provider>;
}

export function NumberInput({ id, 'aria-describedby': describedBy, className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldControl(id, describedBy);
  return <input className={`input ${className}`.trim()} inputMode="decimal" type="number" {...props} id={field.id} aria-describedby={field.describedBy} />;
}

export function TextInput({ id, 'aria-describedby': describedBy, className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldControl(id, describedBy);
  return <input className={`input ${className}`.trim()} type="text" {...props} id={field.id} aria-describedby={field.describedBy} />;
}

export function Select({ id, 'aria-describedby': describedBy, className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const field = useFieldControl(id, describedBy);
  return <select className={`input select ${className}`.trim()} {...props} id={field.id} aria-describedby={field.describedBy}>{children}</select>;
}

export function TextArea({ id, 'aria-describedby': describedBy, className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const field = useFieldControl(id, describedBy);
  return <textarea className={`input textarea ${className}`.trim()} {...props} id={field.id} aria-describedby={field.describedBy} />;
}

export function SectionHeading({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: ReactNode }) {
  return <div className="section-heading">{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{body && <p>{body}</p>}</div>;
}

export function Notice({ tone = 'info', title, children }: { tone?: 'info' | 'warning' | 'success'; title: string; children?: ReactNode }) {
  const Icon = tone === 'warning' ? AlertIcon : tone === 'success' ? CheckIcon : InfoIcon;
  return <div className={`notice notice-${tone}`} role={tone === 'warning' ? 'alert' : 'status'}><Icon size={18}/><div><strong>{title}</strong>{children && <div>{children}</div>}</div></div>;
}

export function Metric({ label, value, detail, featured = false }: { label: string; value: ReactNode; detail?: ReactNode; featured?: boolean }) {
  return <div className={`metric ${featured ? 'metric-featured' : ''}`}><div className="metric-label">{label}</div><div className="metric-value">{value}</div>{detail && <div className="metric-detail">{detail}</div>}</div>;
}
