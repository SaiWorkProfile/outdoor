'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { createPrintableProjectPlan, type Project, type ProjectArea, type ProjectMaterial } from '@/lib/project-mode';
import {
  addMaterialToProject, addProjectArea, addProjectCostLine, clearProject, duplicateMaterialInProject,
  emptyProject, isEmptyProject, loadProject, rebuildProject, removeMaterialFromProject, removeProjectArea,
  removeProjectCostLine, replaceMaterialInProject, saveProject, updateProjectArea, updateProjectName, updateShoppingItem,
} from '@/lib/project-store';
import { Button, Card, Field, Metric, Notice, Select, TextArea, TextInput } from '../ui/Primitives';
import { AnswerList } from '../content/ContentTable';
import { AddCalculationPanel } from './AddCalculationPanel';
import { calculatorLabel } from './engine-bridge';
import { CurrencyText } from '../currency/CurrencyText';
import { useCurrency } from '../currency/CurrencyProvider';
import { ArrowRightIcon, CheckIcon, FolderIcon, PlusIcon, PrinterIcon, RotateIcon, TrashIcon } from '../ui/icons';

/** Two calculations of the same shape should not add the same area twice. */
function sameArea(a: ProjectArea, b: ProjectArea): boolean {
  return a.name === b.name && JSON.stringify(a.shape) === JSON.stringify(b.shape);
}

export function ProjectModeClient() {
  /* Display currency for every amount below; the project keeps its own recorded code. */
  const { code, currency, symbol } = useCurrency();
  const [project, setProject] = useState<Project>(() => loadProject());
  const [hydrated, setHydrated] = useState(false);
  const [panel, setPanel] = useState<{ open: boolean; editing: ProjectMaterial | null }>({ open: false, editing: null });
  const [areaName, setAreaName] = useState('Patio area');
  const [areaLength, setAreaLength] = useState('20');
  const [areaWidth, setAreaWidth] = useState('30');
  const [areaNotes, setAreaNotes] = useState('');
  const [areaError, setAreaError] = useState('');
  const [costLabel, setCostLabel] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [costCategory, setCostCategory] = useState<'labor' | 'other' | 'material'>('labor');
  const [costError, setCostError] = useState('');
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setProject(loadProject()); setHydrated(true); }, []);

  const plan = useMemo(() => createPrintableProjectPlan(project), [project]);
  const materialTotals = useMemo(() => {
    const map = new Map<string, { id: string; name: string; unit: string; quantity: number; sources: number }>();
    for (const material of project.materials) {
      for (const quantity of material.quantities) {
        const value = quantity.orderQuantity ?? quantity.quantity;
        if (!value || value <= 0) continue;
        const unit = String(quantity.orderUnit ?? quantity.unit);
        const id = `${material.name}:${quantity.label}:${unit}`;
        const existing = map.get(id);
        if (existing) { existing.quantity += value; existing.sources += 1; }
        else map.set(id, { id, name: `${material.name} — ${quantity.label}`, unit, quantity: value, sources: 1 });
      }
    }
    return [...map.values()];
  }, [project.materials]);

  const commit = (next: Project) => { setProject(next); saveProject(next); };
  const setName = (name: string) => commit(updateProjectName(project, name));
  const setNotes = (text: string) => commit({ ...project, notes: text.trim() ? [text] : [] });

  const openChooser = () => {
    setPanel({ open: true, editing: null });
    window.requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const addArea = () => {
    const length = Number(areaLength);
    const width = Number(areaWidth);
    if (!Number.isFinite(length) || length <= 0 || !Number.isFinite(width) || width <= 0) {
      setAreaError('Enter positive length and width values.');
      return;
    }
    commit(addProjectArea(project, {
      id: `area-${Date.now()}`,
      name: areaName.trim() || 'Project area',
      shape: { kind: 'rectangle', length, width },
      role: 'surface',
      notes: areaNotes.trim() || undefined,
    }));
    setAreaError('');
    setAreaNotes('');
  };

  const addCost = () => {
    const amount = Number(costAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setCostError('Enter a positive amount. The project never estimates a price for you.');
      return;
    }
    const label = costLabel.trim() || (costCategory === 'labor' ? 'Labour' : costCategory === 'material' ? 'Materials' : 'Other cost');
    commit(addProjectCostLine(project, { label, amount, basis: 'user-entry', category: costCategory, currencyCode: code }));
    setCostLabel('');
    setCostAmount('');
    setCostError('');
  };

  const handleCalculation = (material: ProjectMaterial, areas: ProjectArea[], mode: 'add' | 'edit') => {
    const base = mode === 'edit' ? replaceMaterialInProject(project, material) : addMaterialToProject(project, material);
    const fresh = areas.filter((area) => !base.areas.some((existing) => sameArea(existing, area)));
    commit(fresh.length ? rebuildProject({ ...base, areas: [...base.areas, ...fresh] }) : base);
    setPanel({ open: false, editing: null });
  };

  const reset = () => {
    clearProject();
    const blank = emptyProject();
    setProject(blank);
    saveProject(blank);
    setPanel({ open: false, editing: null });
  };

  if (!hydrated) return <div className="container section"><Card><div className="empty-state">Loading project…</div></Card></div>;

  const empty = isEmptyProject(project);
  const collected = project.shoppingList.filter((item) => item.checked).length;

  return (
    <div className="container project-page">
      <div className="project-header">
        <div>
          <div className="eyebrow">Project Mode</div>
          <h1>One project, one material plan.</h1>
          <p className="subtle" style={{ maxWidth: 700 }}>
            Add a calculation, review what it produced, combine the materials and enter your own prices. Everything is
            saved in this browser only — no account, no server copy, no invented prices.
          </p>
        </div>
        <div className="hero-actions">
          <Button type="button" tone="primary" onClick={openChooser}><PlusIcon size={16}/> Add calculation</Button>
          <Link className="button button-secondary" href="/projects/print"><PrinterIcon size={16}/> Print project</Link>
          <Button type="button" tone="danger" onClick={reset}><TrashIcon size={16}/> Clear project</Button>
        </div>
      </div>

      {empty && !panel.open ? (
        <Card className="empty-project">
          <div className="empty-state">
            <h2>Your project is empty</h2>
            <p>Add a calculation to start building your material plan.</p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Button type="button" tone="primary" onClick={openChooser}><PlusIcon size={16}/> Add calculation</Button>
              <Link className="button button-secondary" href="/calculators">Browse calculators</Link>
            </div>
            <p className="subtle" style={{ marginBottom: 0 }}>
              Prefer to start from a guide? Read <Link href="/how-it-works">how the calculations work</Link> or the
              {' '}<Link href="/guides">guides to projects, materials and costs</Link>.
            </p>
          </div>
        </Card>
      ) : (
        <div className="project-grid">
          <div className="stack">
            <div ref={panelRef}>
              {panel.open || panel.editing ? (
                <AddCalculationPanel
                  editing={panel.editing}
                  onCommit={handleCalculation}
                  onCancel={() => setPanel({ open: false, editing: null })}
                />
              ) : null}
            </div>

            <Card title="Project dashboard" eyebrow="Workspace">
              <div className="field">
                <label htmlFor="project-name">Project name</label>
                <TextInput id="project-name" className="project-name-input" value={project.name} onChange={(event) => setName(event.target.value)} />
                <div className="field-hint">Saved locally in this browser. Last updated {new Date(project.date).toLocaleString()}.</div>
              </div>
              <div className="metrics" style={{ marginTop: 14 }}>
                <Metric label="Calculations" value={project.materials.length} />
                <Metric label="Areas" value={project.areas.length} />
                <Metric label="Shopping items" value={project.shoppingList.length} detail={`${collected} collected`} />
                <Metric label="Entered cost" value={project.costs.totalEnteredCost ? <CurrencyText amount={project.costs.totalEnteredCost}/> : 'No prices yet'} />
              </div>
              <div className="summary-list">
                <div className="qty-row"><span>Material lines in the plan</span><strong>{plan.materials.length}</strong></div>
                <div className="qty-row"><span>Assumption entries recorded</span><strong>{plan.assumptions.length}</strong></div>
                <div className="qty-row"><span>Cost state</span><strong>{project.costs.isComplete ? 'All required prices entered' : project.costs.missingPrices?.length ? `${project.costs.missingPrices.length} price(s) not entered` : 'Price not entered'}</strong></div>
              </div>
            </Card>

            <Card title="Areas" eyebrow="Dimensions">
              <p className="subtle" style={{ marginTop: 0 }}>
                Areas you measure yourself. A calculator can also add its measured area when you add a result.
              </p>
              <div className="form-grid-3">
                <Field label="Area name" htmlFor="area-name"><TextInput id="area-name" value={areaName} onChange={(event) => setAreaName(event.target.value)} /></Field>
                <Field label="Length" htmlFor="area-length"><TextInput id="area-length" inputMode="decimal" value={areaLength} onChange={(event) => setAreaLength(event.target.value)} /></Field>
                <Field label="Width" htmlFor="area-width"><TextInput id="area-width" inputMode="decimal" value={areaWidth} onChange={(event) => setAreaWidth(event.target.value)} /></Field>
              </div>
              <div className="field" style={{ marginTop: 12 }}>
                <label htmlFor="area-notes">Notes (optional)</label>
                <TextInput id="area-notes" value={areaNotes} onChange={(event) => setAreaNotes(event.target.value)} />
                <div className="field-hint">Slope, access, surface to remove — anything that affects the job.</div>
              </div>
              {areaError ? <div className="field-error" role="alert">{areaError}</div> : null}
              <div className="toolbar"><Button type="button" tone="secondary" onClick={addArea}><PlusIcon size={16}/> Add area</Button></div>
              {project.areas.length ? (
                <div className="area-list">
                  {project.areas.map((area) => (
                    <div className="area-row" key={area.id}>
                      <div>
                        <strong>{area.name}</strong>
                        <div className="subtle">{area.shape.kind === 'rectangle' ? `${area.shape.length} × ${area.shape.width} ft` : `${area.shape.kind} shape`}</div>
                      </div>
                      <TextInput
                        className="area-note-input"
                        aria-label={`Notes for ${area.name}`}
                        placeholder="Add a note"
                        defaultValue={area.notes ?? ''}
                        onBlur={(event) => commit(updateProjectArea(project, area.id, { notes: event.target.value.trim() || undefined }))}
                      />
                      <Button type="button" tone="danger" onClick={() => commit(removeProjectArea(project, area.id))}><TrashIcon size={15}/> Remove</Button>
                    </div>
                  ))}
                </div>
              ) : <p className="subtle" style={{ marginBottom: 0 }}>No manual areas yet.</p>}
            </Card>


            <Card title="Calculations" eyebrow="What this project contains">
              {project.materials.length === 0 ? (
                <p className="subtle" style={{ marginBottom: 0 }}>
                  No calculations yet. Use <strong>Add calculation</strong> above to create one without leaving this page.
                </p>
              ) : project.materials.map((material) => {
                const entered = material.costs.filter((line) => line.notes !== 'missing-price').reduce((sum, line) => sum + line.amount, 0);
                const missing = material.costs.some((line) => line.notes === 'missing-price');
                return (
                  <article className="project-material" key={material.id}>
                    <div className="project-material-header">
                      <div>
                        <div className="eyebrow">{material.calculatorName ?? calculatorLabel(material.calculator)}</div>
                        <h3>{material.name}</h3>
                      </div>
                      <span className="chip">{material.wastePercent ?? 10}% waste</span>
                    </div>
                    {material.results?.length ? (
                      <div className="metrics" style={{ marginTop: 10 }}>
                        {material.results.slice(0, 2).map((row, index) => (
                          <Metric key={row.label} featured={index === 0} label={row.label} value={row.value} />
                        ))}
                      </div>
                    ) : null}
                    {material.inputs?.length ? (
                      <details className="calc-details">
                        <summary>Inputs ({material.inputs.length})</summary>
                        <AnswerList rows={material.inputs} />
                      </details>
                    ) : null}
                    <div className="qty-list">
                      {material.quantities.map((quantity, index) => (
                        <div className="qty-row" key={`${material.id}-${index}`}>
                          <span>{quantity.label}</span>
                          <strong>{quantity.orderQuantity ?? quantity.quantity} {quantity.orderUnit ?? quantity.unit}</strong>
                        </div>
                      ))}
                    </div>
                    {material.assumptions?.length ? (
                      <details className="calc-details">
                        <summary>Assumptions ({material.assumptions.length})</summary>
                        <div className="assumption-list">
                          {material.assumptions.map((assumption) => (
                            <div className="assumption-row" key={assumption.key}>
                              <span>{assumption.label}</span>
                              <span>{String(assumption.value)}{assumption.unit ? ` ${assumption.unit}` : ''}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    ) : null}
                    <div className="calc-actions">
                      <span className="cost-state">
                        {entered > 0 ? <>Entered cost <CurrencyText amount={entered}/></> : 'Price not entered'}
                        {missing ? ' · some components unpriced' : ''}
                      </span>
                      <div className="toolbar-actions">
                        <Button type="button" tone="secondary" onClick={() => setPanel({ open: true, editing: material })}>Edit</Button>
                        <Button type="button" tone="secondary" onClick={() => commit(duplicateMaterialInProject(project, material.id))}>Duplicate</Button>
                        <Button type="button" tone="danger" onClick={() => commit(removeMaterialFromProject(project, material.id))}><TrashIcon size={15}/> Remove</Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </Card>

            <Card title="Project notes" eyebrow="Anything else">
              <TextArea id="project-notes" value={project.notes[0] ?? ''} onChange={(event) => setNotes(event.target.value)} placeholder="Delivery window, site access, who is confirming quantities…" />
              <div className="field-hint">Notes are included on the printable plan.</div>
            </Card>
          </div>

          <aside className="stack">
            <Card title="Materials" eyebrow="Aggregated project quantities">
              {materialTotals.length ? (
                <div className="table-wrap">
                  <table className="content-table">
                    <thead><tr><th>Material</th><th>Quantity</th></tr></thead>
                    <tbody>
                      {materialTotals.map((row) => (
                        <tr key={row.id}>
                          <td>
                            {row.name}
                            {row.sources > 1 ? <span className="content-link-note">combined from {row.sources} calculations</span> : null}
                          </td>
                          <td>{row.quantity} {row.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="subtle">Add a calculation and its order quantities are aggregated here.</p>}
              <p className="subtle" style={{ marginBottom: 0 }}>
                Order quantities already include each calculator's waste, compaction and rounding. They are planning
                figures, not supplier confirmations.
              </p>
            </Card>

            <Card title="Costs" eyebrow="Entered prices only">
              <div className="cost-summary">
                <div className="qty-row"><span>Entered material costs</span><strong><CurrencyText amount={project.costs.enteredMaterialCost}/></strong></div>
                <div className="qty-row"><span>Entered labour</span><strong><CurrencyText amount={project.costs.enteredLaborCost}/></strong></div>
                <div className="qty-row"><span>Other entered costs</span><strong><CurrencyText amount={project.costs.enteredOtherCost}/></strong></div>
                <div className="qty-row"><span>Subtotal</span><strong><CurrencyText amount={project.costs.totalEnteredCost}/></strong></div>
              </div>
              <div className="total-box" style={{ marginTop: 12 }}>
                <div className="metric-label">Total entered cost</div>
                <strong>{project.costs.totalEnteredCost ? <CurrencyText amount={project.costs.totalEnteredCost}/> : 'Price not entered'}</strong>
              </div>
              <p className="subtle" style={{ marginBottom: 0 }}>
                Amounts are shown in {currency.code} {currency.name}, the currency selected in the header. They are never
                converted: prices were entered and recorded in {project.costs.currencyCode ?? code}, so re-check any price you
                typed if you change the display currency.
              </p>
              {project.costs.missingPrices?.length ? (
                <Notice tone="warning" title="Price not entered">
                  These components have no price yet: {project.costs.missingPrices.join(', ')}. Open the calculator that
                  produced them and enter your supplier price.
                </Notice>
              ) : null}
              {project.costs.extraLines?.length ? (
                <div className="extra-costs">
                  {project.costs.extraLines.map((line) => (
                    <div className="qty-row" key={line.label}>
                      <span>{line.label} <span className="chip">{line.category ?? 'other'}</span></span>
                      <span>
                        <strong><CurrencyText amount={line.amount}/></strong>
                        {' '}<button type="button" className="link-button" onClick={() => commit(removeProjectCostLine(project, line.label))}>Remove</button>
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="cost-entry">
                <div className="form-grid">
                  <Field label="Cost label" htmlFor="cost-label"><TextInput id="cost-label" value={costLabel} onChange={(event) => setCostLabel(event.target.value)} /></Field>
                  <Field label="Amount" htmlFor="cost-amount" hint={`Enter the amount in ${code} (${symbol}), the currency selected in the header. Amounts are never converted.`}><TextInput id="cost-amount" inputMode="decimal" value={costAmount} onChange={(event) => setCostAmount(event.target.value)} /></Field>
                </div>
                <Field label="Category" htmlFor="cost-category" hint="Used to separate material, labour and other costs.">
                  <Select id="cost-category" value={costCategory} onChange={(event) => setCostCategory(event.target.value as 'labor' | 'other' | 'material')}>
                    <option value="labor">Labour</option>
                    <option value="other">Other</option>
                    <option value="material">Materials</option>
                  </Select>
                </Field>
                {costError ? <div className="field-error" role="alert">{costError}</div> : null}
                <Button type="button" tone="secondary" onClick={addCost}><PlusIcon size={16}/> Add entered cost</Button>
              </div>
            </Card>



            <Card title="Shopping list" eyebrow="Purchase checklist">
              <div className="shopping-list">
                {project.shoppingList.length === 0 ? (
                  <p className="subtle" style={{ margin: 0 }}>The list builds automatically from the quantities each calculator produced.</p>
                ) : project.shoppingList.map((item) => (
                  <div className="shopping-item" key={item.id}>
                    <label className="shopping-check-label">
                      <input
                        className="shopping-check"
                        type="checkbox"
                        checked={Boolean(item.checked)}
                        aria-label={`Mark ${item.name} as collected`}
                        onChange={(event) => commit(updateShoppingItem(project, item.id, { checked: event.target.checked }))}
                      />
                      <span>{item.name}</span>
                    </label>
                    <input
                      className="qty-input"
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      aria-label={`Quantity for ${item.name}`}
                      onChange={(event) => commit(updateShoppingItem(project, item.id, { quantity: Number(event.target.value), quantityOverridden: true }))}
                    />
                    <span className="unit-label">{item.unit}</span>
                    {item.quantityOverridden ? (
                      <button type="button" className="link-button" onClick={() => commit(updateShoppingItem(project, item.id, { quantityOverridden: false }))}>
                        <RotateIcon size={14}/> Reset
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              {project.shoppingList.length ? <p className="subtle" style={{ marginBottom: 0 }}>{collected} of {project.shoppingList.length} collected.</p> : null}
            </Card>

            <Card title="Printable plan" eyebrow="Print or save as PDF">
              <p className="subtle">
                {plan.materials.length} calculation(s), {plan.dimensions.length} area(s), {project.costs.lines.length} cost
                line(s) and {plan.shoppingList.length} shopping item(s). Empty sections are not printed.
              </p>
              <Link className="tool-card-link" href="/projects/print">Open print view <PrinterIcon size={14}/></Link>
            </Card>

            <Card title="Need background first?" eyebrow="Guides">
              <p className="subtle">The guides explain the measurement, layer and ordering decisions behind these calculators.</p>
              <Link className="tool-card-link" href="/guides">Browse guides and references <ArrowRightIcon size={14}/></Link>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
