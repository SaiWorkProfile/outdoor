import type { UnitSystem } from '../units';
import type { Shape } from '../calculations/geometry';

export type ISODateString = string;

export interface Project {
  id?: string;
  name: string;
  date: ISODateString;
  unitSystem: UnitSystem;
  areas: ProjectArea[];
  materials: ProjectMaterial[];
  costs: ProjectCostSummary;
  waste: ProjectWasteSummary;
  shoppingList: ProjectShoppingListItem[];
  notes: string[];
  assumptions: ProjectAssumptionSnapshot[];
  methodologyDisclaimer: string;
}

export interface ProjectArea {
  id: string;
  name: string;
  shape: Shape;
  role?: 'surface' | 'base' | 'bedding' | 'framing' | 'other';
  /** Free-text note the user adds to an area (slope, access, surface to remove). */
  notes?: string;
}

export interface ProjectMaterial {
  id: string;
  name: string;
  materialId?: string;
  calculator: string;
  /** Human label for `calculator`, captured so stored projects stay readable. */
  calculatorName?: string;
  role?: 'surface' | 'base' | 'bedding' | 'edging' | 'framing' | 'concrete' | 'hardware' | 'other';
  quantities: ProjectQuantity[];
  costs: ProjectCostLine[];
  wastePercent?: number;
  sourceCalculationId?: string;
  notes?: string[];
  assumptions?: ProjectAssumptionSnapshot[];
  /**
   * What the user entered, captured when the calculation was added. Stored as display
   * rows so Project Mode and the printable plan never have to recompute a quantity.
   */
  inputs?: ProjectInputRow[];
  /** The important engine outputs for this calculation, captured at add time. */
  results?: ProjectInputRow[];
  /** The exact calculator form state, so a stored calculation can be reopened and edited. */
  formState?: ProjectCalculationFormState;
}

/** A label/value pair taken from user input or from an engine result. */
export interface ProjectInputRow {
  label: string;
  value: string;
}

/**
 * Structural copy of the calculator form state (see CalculatorForm.tsx).
 *
 * Declared loosely on purpose: this is persisted data, not engine input. Anything that
 * matters for a quantity is re-validated by the engine when the calculation runs again.
 */
export interface ProjectCalculationFormState {
  fields: Record<string, string>;
  areas: Array<Record<string, string>>;
  layers: Array<Record<string, string>>;
  concreteParts: Array<Record<string, string>>;
}

export interface ProjectQuantity {
  label: string;
  quantity: number;
  unit: ProjectQuantityUnit;
  /** Optional unrounded quantity retained for display/methodology. */
  exactQuantity?: number;
  orderQuantity?: number;
  orderUnit?: ProjectQuantityUnit;
  notes?: string;
}

export type ProjectQuantityUnit =
  | 'sq ft'
  | 'sq m'
  | 'cubic ft'
  | 'cubic yards'
  | 'cubic m'
  | 'tons'
  | 'tonnes'
  | 'bags'
  | 'loads'
  | 'linear ft'
  | 'linear m'
  | 'pieces'
  | 'posts'
  | 'rails'
  | 'pickets'
  | 'panels'
  | 'sets'
  | 'each';

export interface ProjectCostLine {
  label: string;
  amount: number;
  basis?: string;
  /** Cost category used for the project cost summary. Never inferred from a market price. */
  category?: 'material' | 'labor' | 'other';
  enteredPrice?: number;
  quantity?: number;
  currencyCode?: string;
  notes?: string;
}

export interface ProjectCostSummary {
  currencyCode: string;
  enteredMaterialCost: number;
  enteredLaborCost: number;
  enteredOtherCost: number;
  totalEnteredCost: number;
  isComplete: boolean;
  missingPrices?: string[];
  lines: ProjectCostLine[];
  /** Cost lines the user entered directly in Project Mode (labour, permits, delivery, hire). */
  extraLines?: ProjectCostLine[];
}

export interface ProjectWasteSummary {
  defaultPercent?: number;
  materialWaste: Array<{
    materialId?: string;
    materialName: string;
    percent: number;
    notes?: string;
  }>;
}

export interface ProjectShoppingListItem {
  id: string;
  category: 'material' | 'hardware' | 'delivery' | 'tool' | 'other';
  name: string;
  quantity: number;
  unit: ProjectQuantityUnit | string;
  checked?: boolean;
  /** True when the user replaced the calculated quantity with their own figure. */
  quantityOverridden?: boolean;
  notes?: string;
}

export interface ProjectAssumptionSnapshot {
  key: string;
  label: string;
  value: number | string | boolean;
  unit?: string;
  editable: boolean;
  source: 'engine-default' | 'user-input' | 'supplier-input' | 'calculation';
  notes?: string;
}

export interface PrintableProjectPlan {
  version: 1;
  projectName: string;
  date: ISODateString;
  unitSystem: UnitSystem;
  dimensions: PrintableDimensionSummary[];
  assumptions: ProjectAssumptionSnapshot[];
  materials: PrintableMaterialLine[];
  estimatedCosts: ProjectCostSummary;
  waste: ProjectWasteSummary;
  shoppingList: ProjectShoppingListItem[];
  notes: string[];
  methodologyDisclaimer: string;
}

export interface PrintableDimensionSummary {
  label: string;
  value: string;
  notes?: string;
}

export interface PrintableMaterialLine {
  materialName: string;
  /** Calculator slug this line came from. */
  calculator: string;
  /** Human label for the calculator (resolved from the registry by the print view). */
  calculatorName?: string;
  role?: ProjectMaterial['role'];
  inputs?: ProjectInputRow[];
  results?: ProjectInputRow[];
  quantities: ProjectQuantity[];
  costs: ProjectCostLine[];
  wastePercent?: number;
  notes?: string[];
  assumptions?: ProjectAssumptionSnapshot[];
}

export function createPrintableProjectPlan(project: Project): PrintableProjectPlan {
  return {
    version: 1,
    projectName: project.name,
    date: project.date,
    unitSystem: project.unitSystem,
    dimensions: project.areas.map((area) => ({ label: area.name, value: formatShape(area.shape), notes: area.notes })),
    assumptions: project.assumptions.map((a) => ({ ...a })),
    materials: project.materials.map((material) => ({
      materialName: material.name,
      calculator: material.calculator,
      calculatorName: material.calculatorName,
      role: material.role,
      inputs: material.inputs ? material.inputs.map((row) => ({ ...row })) : undefined,
      results: material.results ? material.results.map((row) => ({ ...row })) : undefined,
      quantities: material.quantities.map((q) => ({ ...q })),
      costs: material.costs.map((c) => ({ ...c })),
      wastePercent: material.wastePercent,
      notes: material.notes ? [...material.notes] : undefined,
      assumptions: material.assumptions ? material.assumptions.map((a) => ({ ...a })) : undefined,
    })),
    estimatedCosts: {
      ...project.costs,
      lines: project.costs.lines.map((line) => ({ ...line })),
      extraLines: project.costs.extraLines ? project.costs.extraLines.map((line) => ({ ...line })) : undefined,
      missingPrices: project.costs.missingPrices ? [...project.costs.missingPrices] : undefined,
    },
    waste: {
      defaultPercent: project.waste.defaultPercent,
      materialWaste: project.waste.materialWaste.map((w) => ({ ...w })),
    },
    shoppingList: project.shoppingList.map((item) => ({ ...item })),
    notes: [...project.notes],
    methodologyDisclaimer: project.methodologyDisclaimer,
  };
}

function formatShape(shape: Shape): string {
  switch (shape.kind) {
    case 'rectangle': return `${shape.length} ft × ${shape.width} ft`;
    case 'circle': return `${shape.diameter} ft diameter`;
    case 'triangle': return `triangle, ${shape.base} ft base × ${shape.height} ft height`;
    case 'area': return `${shape.sqFt} sq ft`;
  }
}
