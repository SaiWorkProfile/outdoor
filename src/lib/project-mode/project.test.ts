import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrintableProjectPlan, type Project } from './index';

test('printable project plan preserves project structure without PDF dependencies', () => {
  const project: Project = {
    name: 'Gravel Patio',
    date: '2026-09-29',
    unitSystem: 'us',
    areas: [{ id: 'surface', name: 'Patio', shape: { kind: 'rectangle', length: 20, width: 30 }, role: 'surface' }],
    materials: [{
      id: 'gravel',
      name: 'Gravel',
      calculator: 'gravel',
      role: 'surface',
      quantities: [{ label: 'Volume', quantity: 5.75, unit: 'cubic yards', orderQuantity: 5.75, orderUnit: 'cubic yards' }],
      costs: [{ label: 'Material', amount: 287.5, basis: 'per cubic yard' }],
      wastePercent: 0,
    }],
    costs: {
      currencyCode: 'USD',
      enteredMaterialCost: 287.5,
      enteredLaborCost: 0,
      enteredOtherCost: 0,
      totalEnteredCost: 287.5,
      isComplete: true,
      lines: [{ label: 'Gravel', amount: 287.5 }],
    },
    waste: { materialWaste: [{ materialName: 'Gravel', percent: 0 }] },
    shoppingList: [{ id: 'gravel', category: 'material', name: 'Gravel', quantity: 5.75, unit: 'cubic yards' }],
    notes: ['Confirm density with supplier.'],
    assumptions: [{ key: 'waste.defaultPercent', label: 'Default waste', value: 10, unit: '%', editable: true, source: 'engine-default' }],
    methodologyDisclaimer: 'Planning estimate only.',
  };

  const printable = createPrintableProjectPlan(project);
  assert.equal(printable.version, 1);
  assert.equal(printable.projectName, 'Gravel Patio');
  assert.equal(printable.materials[0]!.quantities[0]!.quantity, 5.75);
  assert.equal(printable.dimensions[0]!.value, '20 ft × 30 ft');
  assert.equal(printable.methodologyDisclaimer, 'Planning estimate only.');
});
