'use client';

import { useMemo, useState } from 'react';
import { Button, Notice } from '../ui/Primitives';
import { AnswerList } from '../content/ContentTable';
import { CalculatorForm, defaultForm, type CalculatorFormState } from './CalculatorForm';
import { getCalculator, type CalculatorSlug } from './registry';
import { CALCULATOR_GROUPS } from './groups';
import { formInputSummary, parseEngineError, resultHighlights, runCalculator, shapeFromForm } from './engine-bridge';
import { resultToProjectAreas, resultToProjectMaterial } from './project-mapper';
import { useCurrency } from '../currency/CurrencyProvider';
import { CheckIcon, PlusIcon } from '../ui/icons';
import type { ProjectArea, ProjectMaterial } from '@/lib/project-mode';

interface AddCalculationPanelProps {
  /** Present when the user is editing a stored calculation instead of adding one. */
  editing?: ProjectMaterial | null;
  onCommit: (material: ProjectMaterial, areas: ProjectArea[], mode: 'add' | 'edit') => void;
  onCancel: () => void;
}

/**
 * The Project Mode calculation workflow.
 *
 * It walks the same three steps as a calculator page — choose, enter, calculate — but stays
 * inside the project so the result can be stored without leaving the page. Both the form and
 * the engine call are the shared ones, so no formula is repeated here.
 */
export function AddCalculationPanel({ editing, onCommit, onCancel }: AddCalculationPanelProps) {
  const { code } = useCurrency();
  const editSlug = editing && getCalculator(editing.calculator) ? (editing.calculator as CalculatorSlug) : null;
  const [slug, setSlug] = useState<CalculatorSlug | null>(editSlug);
  const [state, setState] = useState<CalculatorFormState>(() =>
    editSlug && editing?.formState
      ? { ...defaultForm(editSlug), ...(editing.formState as unknown as CalculatorFormState) }
      : defaultForm(editSlug ?? 'gravel-calculator'),
  );
  const [result, setResult] = useState<unknown>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [addAreas, setAddAreas] = useState(true);

  const definition = slug ? getCalculator(slug) : undefined;
  const inputs = useMemo(() => (slug ? formInputSummary(slug, state, code) : []), [slug, state, code]);
  const highlights = useMemo(() => (slug && result ? resultHighlights(slug, result, code) : []), [slug, result, code]);

  const choose = (next: CalculatorSlug) => {
    setSlug(next);
    setState(defaultForm(next));
    setResult(null);
    setErrors({});
    setMessage('');
  };

  const calculate = () => {
    if (!slug) return;
    setErrors({});
    setMessage('');
    try {
      setResult(runCalculator(slug, state));
    } catch (error) {
      const parsed = parseEngineError(error);
      if (parsed) setErrors({ [parsed.field]: parsed.message });
      else setMessage(error instanceof Error ? error.message : 'Please review the inputs.');
      setResult(null);
    }
  };

  const commit = () => {
    if (!slug || !result) return;
    const calculated = resultToProjectMaterial(slug, result, {
      inputs,
      results: resultHighlights(slug, result, code),
      formState: state,
      currencyCode: code,
    });
    const material = editing ? { ...calculated, id: editing.id } : calculated;
    const areas = addAreas ? resultToProjectAreas(slug, result, state.areas.map(shapeFromForm)) : [];
    onCommit(material, areas, editing ? 'edit' : 'add');
  };


  if (!slug || !definition) {
    return (
      <section className="card add-calculation" id="add-calculation">
        <div className="eyebrow">Add a calculation</div>
        <h2 className="card-title">Which calculator do you need?</h2>
        <p className="subtle">Every option below runs the same tested engine as the calculator pages. Your result is stored in this project, in this browser.</p>
        <div className="toolbar" style={{ marginTop: 0 }}>
          <span className="subtle">Nothing is stored on a server.</span>
          <Button type="button" tone="ghost" onClick={onCancel}>Cancel</Button>
        </div>
        {CALCULATOR_GROUPS.map((group) => (
          <div className="chooser-group" key={group.id}>
            <h3>{group.title}</h3>
            <p className="subtle">{group.blurb}</p>
            <div className="chooser-grid">
              {group.items.map((item) => {
                const itemDefinition = getCalculator(item.slug);
                if (!itemDefinition) return null;
                return (
                  <button type="button" className="chooser-item" key={`${group.id}-${item.slug}`} onClick={() => choose(item.slug)}>
                    <strong>{itemDefinition.name}</strong>
                    <span>{itemDefinition.shortDescription}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="card add-calculation" id="add-calculation" aria-labelledby="add-calculation-heading">
      <div className="eyebrow">{editing ? 'Edit calculation' : 'New calculation'}</div>
      <h2 className="card-title" id="add-calculation-heading">{definition.name}</h2>
      <p className="subtle">{definition.shortDescription}</p>
      <CalculatorForm
        definition={definition}
        state={state}
        setState={setState}
        errors={errors}
        onCalculate={calculate}
        onReset={() => { setState(defaultForm(slug)); setResult(null); setErrors({}); setMessage(''); }}
      />
      {message ? <div style={{ marginTop: 12 }}><Notice tone="warning" title="Input needs attention">{message}</Notice></div> : null}
      <div className="result-preview">
        <h3>Result preview</h3>
        {highlights.length ? (
          <AnswerList rows={highlights} />
        ) : (
          <p className="subtle" style={{ margin: 0 }}>Press Calculate to preview the quantities before adding them to the project.</p>
        )}
      </div>
      <div className="toolbar">
        <label className="check-row">
          <input type="checkbox" checked={addAreas} onChange={(event) => setAddAreas(event.target.checked)} />
          <span>Add the measured area to project areas</span>
        </label>
        <div className="toolbar-actions">
          <Button type="button" tone="ghost" onClick={() => { setSlug(null); setResult(null); }}>Change calculator</Button>
          <Button type="button" tone="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="button" tone="primary" onClick={commit} disabled={!result}>
            {editing ? <><CheckIcon size={16} /> Save changes</> : <><PlusIcon size={16} /> Add to project</>}
          </Button>
        </div>
      </div>
    </section>
  );
}
