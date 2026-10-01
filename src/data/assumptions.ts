/**
 * Centralized planning assumptions for the entire calculator engine.
 *
 * These are not promises about field conditions or supplier products. Every
 * public calculator result should keep enough metadata to explain which
 * assumptions were used, and the UI can override the editable values.
 */

export interface MaterialPlanningAssumption {
  densityTonsPerCuYd: { typical: number; min: number; max: number };
  bagSizesCuFt: number[];
}

export const ENGINE_ASSUMPTIONS = {
  waste: {
    defaultPercent: 10,
    warningAbovePercent: 25,
    lowMarginBelowPercent: 5,
  },

  truck: {
    defaultCapacityTons: 10,
    orderGranularityCuYd: 0.25,
  },

  bulk: {
    defaultCompactionFactor: 1,
    bagsBelowCuYd: 0.5,
    bulkAboveCuYd: 2,
    typicalWasteMinPercent: 5,
    typicalWasteMaxPercent: 15,
  },

  materials: {
    gravel: {
      densityTonsPerCuYd: { typical: 1.4, min: 1.2, max: 1.7 },
      bagSizesCuFt: [0.5],
    },
    'pea-gravel': {
      densityTonsPerCuYd: { typical: 1.4, min: 1.3, max: 1.5 },
      bagSizesCuFt: [0.5],
    },
    sand: {
      densityTonsPerCuYd: { typical: 1.35, min: 1.25, max: 1.6 },
      bagSizesCuFt: [0.5],
    },
    topsoil: {
      densityTonsPerCuYd: { typical: 1.1, min: 0.9, max: 1.4 },
      bagSizesCuFt: [0.75, 1, 1.5],
    },
    soil: {
      densityTonsPerCuYd: { typical: 1.2, min: 1.0, max: 1.5 },
      bagSizesCuFt: [0.75, 1, 1.5],
    },
    mulch: {
      densityTonsPerCuYd: { typical: 0.35, min: 0.25, max: 0.6 },
      bagSizesCuFt: [2, 3],
    },
    'landscape-rock': {
      densityTonsPerCuYd: { typical: 1.35, min: 1.2, max: 1.6 },
      bagSizesCuFt: [0.5],
    },
    'paver-base': {
      densityTonsPerCuYd: { typical: 1.4, min: 1.3, max: 1.6 },
      bagSizesCuFt: [0.5],
    },
  } satisfies Record<string, MaterialPlanningAssumption>,

  driveway: {
    layers: [
      { name: 'Base layer', depthIn: 4, compactionFactor: 1.15 },
      { name: 'Middle layer', depthIn: 2, compactionFactor: 1.15 },
      { name: 'Surface layer', depthIn: 2, compactionFactor: 1.1 },
    ],
  },

  paver: {
    baseDepthIn: 6,
    beddingSandDepthIn: 1,
    baseCompactionFactor: 1.1,
    beddingSandCompactionFactor: 1,
    defaultJointWidthIn: 0.125,
    edgePieceLengthFt: 8,
  },

  fence: {
    defaultPostSpacingFt: 8,
    defaultRailsForUpTo6Ft: 2,
    defaultRailsAbove6Ft: 3,
    defaultRailStockLengthFt: 8,
    postHoleDiameterIn: 12,
    postHoleDepthIn: 30,
    screwsPerPicketPerRail: 2,
    fastenersPerPanel: 8,
    gateHardwareSetsPerGate: 1,
    heightWarningFt: 8,
    defaultEndPosts: 2,
    defaultPicketWidthIn: 5.5,
    defaultPicketSpacingIn: 0.125,
    defaultPanelWidthFt: 8,
    chainLinkFastenersPerLinearFt: 1.5,
  },

  deck: {
    defaultBoardWidthIn: 5.5,
    defaultBoardGapIn: 0.125,
    defaultBoardLengthFt: 16,
    defaultJoistSpacingIn: 16,
    defaultJoistWidthIn: 1.5,
    defaultJoistDepthIn: 7.25,
    defaultFastenersPerBoardPerJoist: 2,
  },

  concrete: {
    lbPerCuFt: 150,
    bagsAdviceBelowCuYd: 0.5,
    bagsAdviceAboveCuYd: 1.5,
    readyMixIncrementCuYd: 0.25,
    slabThicknessWarningBelowIn: 3.5,
    bags: [
      { bagLb: 40, yieldCuFt: 0.3 },
      { bagLb: 50, yieldCuFt: 0.375 },
      { bagLb: 60, yieldCuFt: 0.45 },
      { bagLb: 80, yieldCuFt: 0.6 },
    ],
  },
} as const;

export type EngineMaterialId = keyof typeof ENGINE_ASSUMPTIONS.materials;

/**
 * Return a serializable copy so callers cannot mutate the canonical defaults
 * accidentally. UI code can clone this and edit it for a project session.
 */
export function getDefaultAssumptions() {
  return JSON.parse(JSON.stringify(ENGINE_ASSUMPTIONS));
}
