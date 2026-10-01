import type { Project, ProjectArea, ProjectCostLine, ProjectMaterial, ProjectQuantity, ProjectShoppingListItem } from '@/lib/project-mode';
import { DEFAULT_CURRENCY } from '@/lib/currency';

const STORAGE_KEY = 'outdoor-project-v1';

export function emptyProject(name = 'My Outdoor Project'): Project {
  return {
    id: 'local-project',
    name,
    date: new Date().toISOString(),
    unitSystem: 'us',
    areas: [],
    materials: [],
    costs: { currencyCode: DEFAULT_CURRENCY, enteredMaterialCost: 0, enteredLaborCost: 0, enteredOtherCost: 0, totalEnteredCost: 0, isComplete: false, missingPrices: [], lines: [], extraLines: [] },
    waste: { materialWaste: [] },
    shoppingList: [],
    notes: [],
    assumptions: [],
    methodologyDisclaimer: 'Calculations are planning estimates. Verify dimensions, product yields, material densities, supplier quantities, site conditions and applicable local requirements before purchasing or building.',
  };
}

/** True when the project holds nothing the user would lose by clearing it. */
export function isEmptyProject(project: Project): boolean {
  return project.materials.length === 0 && project.areas.length === 0 && (project.costs.extraLines?.length ?? 0) === 0;
}

export function loadProject(): Project {
  if (typeof window === 'undefined') return emptyProject();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProject();
    return JSON.parse(raw) as Project;
  } catch {
    return emptyProject();
  }
}

export function saveProject(project: Project): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}

export function clearProject(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function addMaterialToProject(project: Project, material: ProjectMaterial): Project {
  const next = { ...project, date: new Date().toISOString(), materials: [...project.materials, material] };
  return rebuildProject(next);
}

export function updateProjectName(project: Project, name: string): Project {
  return { ...project, name, date: new Date().toISOString() };
}

export function rebuildProject(project: Project): Project {
  const previousItems = new Map(project.shoppingList.map((item) => [item.id, item]));
  const materialCostLines = project.materials.flatMap((m) => m.costs);
  const extraLines = project.costs.extraLines ?? [];
  const allLines = [...materialCostLines, ...extraLines];
  const missing = materialCostLines
    .filter((line) => line.enteredPrice === undefined && line.notes?.includes('missing-price'))
    .map((line) => line.label);
  const shoppingMap = new Map<string, { item: ProjectShoppingListItem; calculatedQuantity: number }>();
  for (const material of project.materials) {
    const quantities = material.quantities.filter((q) => q.orderQuantity !== undefined && q.orderQuantity > 0);
    for (const q of quantities) {
      const key = `${material.name}:${q.label}:${q.orderUnit ?? q.unit}`;
      const quantity = q.orderQuantity ?? q.quantity;
      const existing = shoppingMap.get(key);
      if (existing) existing.calculatedQuantity += quantity;
      else shoppingMap.set(key, {
        item: {
          id: key,
          category: material.role === 'hardware' ? 'hardware' : 'material',
          name: `${material.name} — ${q.label}`,
          quantity,
          unit: q.orderUnit ?? q.unit,
          checked: false,
        },
        calculatedQuantity: quantity,
      });
    }
  }
  /* Calculated quantities drive the list; a user's own edit or tick survives a rebuild. */
  const shoppingList = [...shoppingMap.values()].map(({ item, calculatedQuantity }) => {
    const prior = previousItems.get(item.id);
    return {
      ...item,
      quantity: prior?.quantityOverridden ? prior.quantity : calculatedQuantity,
      checked: prior?.checked ?? false,
      quantityOverridden: prior?.quantityOverridden ?? false,
    };
  });
  const categoryOf = (line: ProjectCostLine): 'material' | 'labor' | 'other' => {
    if (line.category) return line.category;
    const basis = (line.basis ?? '').toLowerCase();
    if (basis.includes('labor') || basis.includes('labour')) return 'labor';
    if (basis.includes('other') || basis.includes('delivery') || basis.includes('permit')) return 'other';
    return 'material';
  };
  const pricedLines = allLines.filter((line) => !line.notes?.includes('missing-price'));
  const sumOf = (category: 'material' | 'labor' | 'other') =>
    pricedLines.filter((line) => categoryOf(line) === category).reduce((total, line) => total + line.amount, 0);
  return {
    ...project,
    costs: {
      currencyCode: project.costs.currencyCode ?? DEFAULT_CURRENCY,
      enteredMaterialCost: sumOf('material'),
      enteredLaborCost: sumOf('labor'),
      enteredOtherCost: sumOf('other'),
      totalEnteredCost: pricedLines.reduce((total, line) => total + line.amount, 0),
      isComplete: pricedLines.length > 0 && missing.length === 0,
      missingPrices: missing.length ? missing : undefined,
      lines: pricedLines,
      extraLines,
    },
    shoppingList,
    waste: { defaultPercent: 10, materialWaste: project.materials.map((m) => ({ materialId: m.materialId, materialName: m.name, percent: m.wastePercent ?? 10 })) },
    assumptions: project.materials.flatMap((m) => m.assumptions ?? []),
    materials: project.materials.map((m) => ({ ...m, costs: m.costs.map((c) => ({ ...c })), assumptions: m.assumptions ? m.assumptions.map((a) => ({ ...a })) : undefined })),
  };
}

export function projectQuantity(label: string, quantity: number, unit: ProjectQuantity['unit'], orderQuantity?: number, orderUnit?: ProjectQuantity['orderUnit'], exactQuantity?: number, notes?: string): ProjectQuantity {
  return { label, quantity, unit, orderQuantity, orderUnit, exactQuantity, notes };
}

export function addProjectArea(project: Project, area: ProjectArea): Project {
  const next = { ...project, date: new Date().toISOString(), areas: [...project.areas, area] };
  return rebuildProject(next);
}

/* ---------------------------------------------------------------------------
 * Project Mode mutations.
 *
 * Every helper returns a new project and leaves recalculation of totals to
 * rebuildProject, so a calculation is never removed without its materials, costs
 * and shopping entries being rebuilt at the same time.
 * ------------------------------------------------------------------------- */

export function replaceMaterialInProject(project: Project, material: ProjectMaterial): Project {
  const materials = project.materials.map((entry) => (entry.id === material.id ? material : entry));
  return rebuildProject({ ...project, date: new Date().toISOString(), materials });
}

export function removeMaterialFromProject(project: Project, materialId: string): Project {
  return rebuildProject({ ...project, date: new Date().toISOString(), materials: project.materials.filter((entry) => entry.id !== materialId) });
}

export function duplicateMaterialInProject(project: Project, materialId: string): Project {
  const source = project.materials.find((entry) => entry.id === materialId);
  if (!source) return project;
  const copy: ProjectMaterial = {
    ...source,
    id: `${source.calculator}-${Date.now()}`,
    name: `${source.name} (copy)`,
    quantities: source.quantities.map((q) => ({ ...q })),
    costs: source.costs.map((c) => ({ ...c })),
    notes: source.notes ? [...source.notes] : undefined,
    assumptions: source.assumptions ? source.assumptions.map((a) => ({ ...a, key: `${a.key}-copy-${Date.now()}` })) : undefined,
    inputs: source.inputs ? source.inputs.map((row) => ({ ...row })) : undefined,
    results: source.results ? source.results.map((row) => ({ ...row })) : undefined,
    formState: source.formState ? JSON.parse(JSON.stringify(source.formState)) as ProjectMaterial['formState'] : undefined,
  };
  return rebuildProject({ ...project, date: new Date().toISOString(), materials: [...project.materials, copy] });
}

export function updateProjectArea(project: Project, areaId: string, next: Partial<ProjectArea>): Project {
  return rebuildProject({ ...project, date: new Date().toISOString(), areas: project.areas.map((area) => (area.id === areaId ? { ...area, ...next } : area)) });
}

export function removeProjectArea(project: Project, areaId: string): Project {
  return rebuildProject({ ...project, date: new Date().toISOString(), areas: project.areas.filter((area) => area.id !== areaId) });
}

export function addProjectCostLine(project: Project, line: ProjectCostLine): Project {
  const extraLines = [...(project.costs.extraLines ?? []), line];
  return rebuildProject({ ...project, date: new Date().toISOString(), costs: { ...project.costs, extraLines } });
}

export function removeProjectCostLine(project: Project, label: string): Project {
  const extraLines = (project.costs.extraLines ?? []).filter((line) => line.label !== label);
  return rebuildProject({ ...project, date: new Date().toISOString(), costs: { ...project.costs, extraLines } });
}

export function updateShoppingItem(project: Project, itemId: string, next: Partial<ProjectShoppingListItem>): Project {
  const shoppingList = project.shoppingList.map((item) => (item.id === itemId ? { ...item, ...next } : item));
  return rebuildProject({ ...project, date: new Date().toISOString(), shoppingList });
}
