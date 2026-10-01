'use strict';
/** Shared seed: a realistic /projects project (fence calculation). */
function seedProject() {
  const now = new Date().toISOString();
  return {
    id: 'local-project',
    name: 'My Outdoor Project — backyard fence and patio plan',
    date: now,
    unitSystem: 'us',
    areas: [{ id: 'a1', name: 'Patio area', shape: { kind: 'rectangle', length: 20, width: 30 } }],
    materials: [{
      id: 'fence-1',
      name: 'Fence Project',
      calculator: 'fence',
      calculatorName: 'Fence Calculator',
      role: 'framing',
      quantities: [
        { label: 'Total posts', quantity: 15, unit: 'posts', orderQuantity: 15, orderUnit: 'posts' },
        { label: 'Rails', quantity: 27, unit: 'rails', orderQuantity: 27, orderUnit: 'rails' },
        { label: 'Pickets', quantity: 226, unit: 'pickets', orderQuantity: 226, orderUnit: 'pickets' },
        { label: 'Post-hole concrete', quantity: 1.25, unit: 'cubic yards', orderQuantity: 1.25, orderUnit: 'bags' },
        { label: 'Hardware', quantity: 995, unit: 'each', orderQuantity: 995, orderUnit: 'each' },
      ],
      costs: [{ label: 'Fence Project materials', amount: 11, category: 'material', enteredPrice: 11, quantity: 1 }],
      inputs: [{ label: 'Fence length', value: '120 linear ft' }, { label: 'Panel width', value: '8 ft' }],
      results: [{ label: 'Fence runs', value: '2 runs' }, { label: 'Corners', value: '1 corner' }],
      assumptions: [{ key: 'waste', label: 'Waste factor', value: 10, unit: '%', editable: true, source: 'engine-default' }],
    }],
    costs: {
      currencyCode: 'USD', enteredMaterialCost: 11, enteredLaborCost: 0, enteredOtherCost: 0,
      totalEnteredCost: 11, isComplete: false, missingPrices: ['Pickets'],
      lines: [{ label: 'Fence Project materials', amount: 11, category: 'material' }],
      extraLines: [{ label: 'Permit', amount: 0, category: 'other' }],
    },
    waste: { materialWaste: [{ materialName: 'Pickets', percent: 10 }] },
    shoppingList: [
      { id: 'k1', category: 'material', name: 'Fence Project — Total posts', quantity: 15, unit: 'posts', checked: false },
      { id: 'k2', category: 'material', name: 'Fence Project — Rails', quantity: 27, unit: 'rails', checked: false },
      { id: 'k3', category: 'material', name: 'Fence Project — Pickets', quantity: 226, unit: 'pickets', checked: false },
      { id: 'k4', category: 'material', name: 'Fence Project — Post-hole concrete', quantity: 1.25, unit: 'bags', checked: true },
      { id: 'k5', category: 'hardware', name: 'Fence Project — Hardware', quantity: 995, unit: 'each', checked: false },
    ],
    notes: ['Delivery window — confirm with supplier before ordering materials.'],
    assumptions: [],
    methodologyDisclaimer: 'Calculations are planning estimates. Verify dimensions before purchasing.',
  };
}

module.exports = { seedProject };
