'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createPrintableProjectPlan, type PrintableProjectPlan } from '@/lib/project-mode';
import { isEmptyProject, loadProject } from '@/lib/project-store';
import { Button } from '@/components/ui/Primitives';
import { ArrowLeftIcon, PrinterIcon } from '@/components/ui/icons';
import { CurrencyText } from '@/components/currency/CurrencyText';
import { useCurrency } from '@/components/currency/CurrencyProvider';

/** "1 loads" reads badly on paper; singularise counts of one. */
function formatUnit(unit: string, quantity: number): string {
  return quantity === 1 && unit.endsWith('s') ? unit.slice(0, -1) : unit;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function quantityLabel(quantity: { orderQuantity?: number; quantity: number; orderUnit?: string; unit: string }): string {
  const value = quantity.orderQuantity ?? quantity.quantity;
  return `${formatNumber(value)} ${formatUnit(String(quantity.orderUnit ?? quantity.unit), value)}`;
}

/**
 * Printable project plan.
 *
 * A utility view of the project saved in this browser. It renders whatever the project
 * actually contains — nothing is hardcoded — and shows a short empty state when no project
 * has been built yet.
 */
export default function ProjectPrintPage() {
  /* The plan prints in the currency selected in the header; amounts are never converted. */
  const { code, currency } = useCurrency();
  const [state, setState] = useState<{ ready: boolean; plan: PrintableProjectPlan | null }>({ ready: false, plan: null });

  useEffect(() => {
    const project = loadProject();
    setState({ ready: true, plan: isEmptyProject(project) ? null : createPrintableProjectPlan(project) });
  }, []);

  if (!state.ready) return <div className="print-page"><div className="empty-state">Loading print plan…</div></div>;

  const plan = state.plan;
  const toolbar = (
    <div className="print-toolbar no-print">
      <Link className="button button-secondary" href="/projects"><ArrowLeftIcon size={16}/> Project Mode</Link>
      {plan ? <Button tone="primary" type="button" onClick={() => window.print()}><PrinterIcon size={16}/> Print / Save PDF</Button> : null}
    </div>
  );

  if (!plan) {
    return (
      <div className="print-page">
        {toolbar}
        <div className="print-empty">
          <div className="eyebrow">Printable project plan</div>
          <h1>No project is ready to print yet.</h1>
          <p>Create a project and add at least one calculation in Project Mode.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/projects">Open Project Mode</Link>
            <Link className="button button-secondary" href="/calculators">Browse calculators</Link>
          </div>
          <p className="subtle">
            Need the background first? Read <Link href="/how-it-works">how the calculations work</Link> or the
            {' '}<Link href="/guides">guides and references</Link>.
          </p>
        </div>
      </div>
    );
  }

  const pricedLines = plan.estimatedCosts.lines;
  const extraLines = plan.estimatedCosts.extraLines ?? [];
  const hasCosts = pricedLines.length > 0 || extraLines.length > 0;
  const costState = pricedLines.length === 0 && extraLines.length === 0
    ? 'Price not entered'
    : plan.estimatedCosts.isComplete
      ? 'All entered prices included'
      : 'Some components have no price yet';


  return (
    <div className="print-page">
      {toolbar}
      <article className="print-sheet">
        <div className="eyebrow">MeasureToBuild — printable project plan</div>
        <h1>{plan.projectName}</h1>
        <div className="print-meta">
          Prepared {new Date(plan.date).toLocaleDateString()} · Planning estimate · {plan.materials.length} calculation(s),{' '}
          {plan.dimensions.length} area(s) · {costState}
        </div>

        {plan.dimensions.length > 0 ? (
          <section className="print-section">
            <h2>Project dimensions</h2>
            <table className="print-table">
              <thead><tr><th>Area</th><th>Dimensions</th></tr></thead>
              <tbody>
                {plan.dimensions.map((dimension, index) => (
                  <tr key={`${dimension.label}-${index}`}>
                    <td>{dimension.label}</td>
                    <td>
                      {dimension.value}
                      {dimension.notes ? <span className="print-note">{dimension.notes}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        {plan.materials.length > 0 ? (
          <section className="print-section">
            <h2>Calculations</h2>
            {plan.materials.map((material, index) => (
              <div className="print-calculation" key={`${material.materialName}-${index}`}>
                <h3>{material.calculatorName ?? material.calculator} — {material.materialName}</h3>
                <div className="print-calc-grid">
                  <div>
                    <h4>Inputs</h4>
                    {material.inputs?.length ? (
                      <table className="print-table">
                        <tbody>
                          {material.inputs.map((row, rowIndex) => (
                            <tr key={`${row.label}-${rowIndex}`}><td>{row.label}</td><td>{row.value}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    ) : <p className="print-note">Inputs were not recorded for this calculation. Re-add it from Project Mode to include them.</p>}
                  </div>
                  <div>
                    <h4>Result</h4>
                    {material.results?.length ? (
                      <table className="print-table">
                        <tbody>
                          {material.results.map((row, rowIndex) => (
                            <tr key={`${row.label}-${rowIndex}`}><td>{row.label}</td><td>{row.value}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    ) : <p className="print-note">No result summary stored. The order quantities below come from the same calculation.</p>}
                  </div>
                </div>
                <h4>Order quantities</h4>
                <table className="print-table">
                  <tbody>
                    {material.quantities.map((quantity, quantityIndex) => (
                      <tr key={`${quantity.label}-${quantityIndex}`}>
                        <td>{quantity.label}</td>
                        <td>{quantityLabel(quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {material.wastePercent !== undefined ? <p className="print-note">Waste allowance applied: {material.wastePercent}%</p> : null}
              </div>
            ))}
          </section>
        ) : null}


        {plan.materials.length > 0 ? (
          <section className="print-section">
            <h2>Materials</h2>
            <table className="print-table">
              <thead><tr><th>Material</th><th>Quantity</th><th>Waste</th></tr></thead>
              <tbody>
                {plan.materials.map((material, index) => (
                  <tr key={`${material.materialName}-${index}`}>
                    <td>{material.materialName}</td>
                    <td>{material.quantities.map((quantity) => `${quantity.label}: ${quantityLabel(quantity)}`).join(', ')}</td>
                    <td>{material.wastePercent !== undefined ? `${material.wastePercent}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        <section className="print-section">
          <h2>Estimated costs</h2>
          <p className="print-note">
            Amounts print in {code} {currency.name}, the currency selected in the header. Prices were entered and recorded in
            {` ${plan.estimatedCosts.currencyCode}`}; nothing here converts between currencies.
          </p>
          {hasCosts ? (
            <table className="print-table">
              <tbody>
                {pricedLines.map((line, index) => (
                  <tr key={`${line.label}-${index}`}>
                    <td>{line.label}{line.category ? <span className="print-note">{line.category}</span> : null}</td>
                    <td><CurrencyText amount={line.amount}/></td>
                  </tr>
                ))}
                {extraLines.map((line, index) => (
                  <tr key={`extra-${line.label}-${index}`}>
                    <td>{line.label}{line.category ? <span className="print-note">{line.category}</span> : null}</td>
                    <td><CurrencyText amount={line.amount}/></td>
                  </tr>
                ))}
                <tr><th>Entered material costs</th><th><CurrencyText amount={plan.estimatedCosts.enteredMaterialCost}/></th></tr>
                <tr><th>Entered labour</th><th><CurrencyText amount={plan.estimatedCosts.enteredLaborCost}/></th></tr>
                <tr><th>Other entered costs</th><th><CurrencyText amount={plan.estimatedCosts.enteredOtherCost}/></th></tr>
                <tr><th>Total entered cost</th><th><CurrencyText amount={plan.estimatedCosts.totalEnteredCost}/></th></tr>
              </tbody>
            </table>
          ) : <p className="print-note">Price not entered. This plan contains quantities only — the project never invents a market price.</p>}
          {plan.estimatedCosts.missingPrices?.length ? (
            <p className="print-note">No price entered for: {plan.estimatedCosts.missingPrices.join(', ')}.</p>
          ) : null}
        </section>

        {plan.shoppingList.length > 0 ? (
          <section className="print-section">
            <h2>Shopping list</h2>
            <table className="print-table">
              <thead><tr><th>Item</th><th>Quantity</th></tr></thead>
              <tbody>
                {plan.shoppingList.map((item) => (
                  <tr key={item.id}>
                    <td>□ {item.name}{item.checked ? ' (collected)' : ''}</td>
                    <td>{formatNumber(item.quantity)} {formatUnit(String(item.unit), item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        {plan.assumptions.length > 0 ? (
          <section className="print-section">
            <h2>Assumptions</h2>
            <table className="print-table">
              <thead><tr><th>Assumption</th><th>Value</th></tr></thead>
              <tbody>
                {plan.assumptions.map((assumption, index) => (
                  <tr key={`${assumption.key}-${index}`}>
                    <td>{assumption.label}</td>
                    <td>{String(assumption.value)}{assumption.unit ? ` ${assumption.unit}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        {plan.notes.length > 0 ? (
          <section className="print-section">
            <h2>Notes</h2>
            {plan.notes.map((note, index) => <p key={index}>{note}</p>)}
          </section>
        ) : null}

        <section className="print-section print-methodology">
          <h2>Method and limitations</h2>
          <p>{plan.methodologyDisclaimer}</p>
          <p className="print-note">
            Quantities include each calculator's waste, compaction and rounding assumptions, which are listed above.
            They are planning estimates for ordering material — not structural engineering, site surveying, drainage
            design, code compliance or a substitute for manufacturer instructions.
          </p>
        </section>
      </article>
    </div>
  );
}
