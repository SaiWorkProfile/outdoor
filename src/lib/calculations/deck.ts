import { ENGINE_ASSUMPTIONS } from '../../data/assumptions';
import { ceilSafe, round } from '../units';
import { CalcInputError, requireCalculationFinite, requireNonNegative, requirePercent, requirePositive } from '../validation';

export type DeckBoardRunDirection = 'length' | 'width';

export interface DeckPricing {
  deckingPerBoard?: number;
  deckingPerSqFt?: number;
  deckingPerLinearFt?: number;
  joistPerPiece?: number;
  joistPerLinearFt?: number;
  beamPerPiece?: number;
  beamPerLinearFt?: number;
  postPrice?: number;
  fastenerPerEach?: number;
  rimJoistPerLinearFt?: number;
}

export interface DeckInput {
  deckLengthFt: number;
  deckWidthFt: number;
  deckingBoardWidthIn?: number;
  deckingBoardLengthFt?: number;
  boardGapIn?: number;
  boardRunDirection?: DeckBoardRunDirection;
  joistSpacingIn?: number;
  joistWidthIn?: number;
  joistDepthIn?: number;
  joistStockLengthFt?: number;
  beamCount?: number;
  beamLengthFt?: number;
  beamStockLengthFt?: number;
  beamWidthIn?: number;
  beamDepthIn?: number;
  postCount?: number;
  postHeightFt?: number;
  wastePercent?: number;
  fastenersPerBoardPerJoist?: number;
  pricing?: DeckPricing;
  deckLabel?: string;
}

export interface DeckResult {
  deckLabel: string;
  areaSqFt: number;
  deckingBoardWidthIn: number;
  deckingBoardLengthFt: number;
  boardGapIn: number;
  joistSpacingIn: number;
  joistWidthIn: number;
  joistDepthIn: number;
  beamWidthIn?: number;
  beamDepthIn?: number;
  boardRunDirection: DeckBoardRunDirection;
  boardRunLengthFt: number;
  boardCoverageWidthFt: number;
  deckingRowsRequired: number;
  deckingRowsOrdered: number;
  boardsPerRowRequired: number;
  deckingBoardsRequired: number;
  deckingLinearFtRequired: number;
  deckingLinearFtOrdered: number;
  perimeterLinearFtRequired: number;
  rimJoistLinearFtOrdered: number;
  joistsRequired: number;
  joistsOrdered: number;
  joistLinearFtOrdered: number;
  joistPiecesOrdered?: number;
  beamCount: number;
  beamLengthFt?: number;
  beamLinearFtOrdered: number;
  beamPiecesOrdered?: number;
  postCount: number;
  postHeightFt?: number;
  fastenersRequired: number;
  fastenersOrdered: number;
  wastePercent: number;
  pricing: DeckPricing | undefined;
  costs: DeckCostLine[];
  warnings: string[];
}

export interface DeckCostLine {
  component: 'decking' | 'joists' | 'beams' | 'posts' | 'fasteners' | 'rim-joist';
  basis: string;
  unitPrice: number;
  quantity: number;
  cost: number;
}

export function calculateDeckMaterials(input: DeckInput): DeckResult {
  requirePositive('deckLengthFt', input.deckLengthFt);
  requirePositive('deckWidthFt', input.deckWidthFt);

  const boardWidthIn = input.deckingBoardWidthIn ?? ENGINE_ASSUMPTIONS.deck.defaultBoardWidthIn;
  const boardLengthFt = input.deckingBoardLengthFt ?? ENGINE_ASSUMPTIONS.deck.defaultBoardLengthFt;
  const boardGapIn = input.boardGapIn ?? ENGINE_ASSUMPTIONS.deck.defaultBoardGapIn;
  const boardRunDirection = input.boardRunDirection ?? 'length';
  const joistSpacingIn = input.joistSpacingIn ?? ENGINE_ASSUMPTIONS.deck.defaultJoistSpacingIn;
  const joistWidthIn = input.joistWidthIn ?? ENGINE_ASSUMPTIONS.deck.defaultJoistWidthIn;
  const joistDepthIn = input.joistDepthIn ?? ENGINE_ASSUMPTIONS.deck.defaultJoistDepthIn;
  const waste = input.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent;
  const screwsPerIntersection = input.fastenersPerBoardPerJoist ?? ENGINE_ASSUMPTIONS.deck.defaultFastenersPerBoardPerJoist;

  requirePositive('deckingBoardWidthIn', boardWidthIn);
  requirePositive('deckingBoardLengthFt', boardLengthFt);
  requireNonNegative('boardGapIn', boardGapIn);
  requirePositive('joistSpacingIn', joistSpacingIn);
  requirePositive('joistWidthIn', joistWidthIn);
  requirePositive('joistDepthIn', joistDepthIn);
  requirePercent('wastePercent', waste);
  requirePositive('fastenersPerBoardPerJoist', screwsPerIntersection);

  if (input.beamCount !== undefined) requireNonNegativeInteger('beamCount', input.beamCount);
  if (input.postCount !== undefined) requireNonNegativeInteger('postCount', input.postCount);
  if (input.beamLengthFt !== undefined) requirePositive('beamLengthFt', input.beamLengthFt);
  if (input.beamStockLengthFt !== undefined) requirePositive('beamStockLengthFt', input.beamStockLengthFt);
  if (input.postHeightFt !== undefined) requirePositive('postHeightFt', input.postHeightFt);
  if (input.beamWidthIn !== undefined) requirePositive('beamWidthIn', input.beamWidthIn);
  if (input.beamDepthIn !== undefined) requirePositive('beamDepthIn', input.beamDepthIn);

  const areaSqFt = input.deckLengthFt * input.deckWidthFt;
  requireCalculationFinite('areaSqFt', areaSqFt);

  const boardRunLengthFt = boardRunDirection === 'length' ? input.deckLengthFt : input.deckWidthFt;
  const boardRunWidthFt = boardRunDirection === 'length' ? input.deckWidthFt : input.deckLengthFt;
  const boardCoverageWidthFt = (boardWidthIn + boardGapIn) / 12;
  const deckingRowsRequired = ceilSafe(boardRunWidthFt / boardCoverageWidthFt);
  const boardsPerRowRequired = ceilSafe(boardRunLengthFt / boardLengthFt);
  const deckingBoardsRequired = deckingRowsRequired * boardsPerRowRequired;
  const deckingLinearFtRequired = deckingRowsRequired * boardRunLengthFt;
  const deckingRowsOrdered = ceilSafe(deckingRowsRequired * (1 + waste / 100));
  const deckingBoardsOrdered = deckingRowsOrdered * boardsPerRowRequired;
  const deckingLinearFtOrdered = round(deckingBoardsOrdered * boardLengthFt, 2);

  const joistSpanFt = boardRunWidthFt;
  const joistsRequired = ceilSafe((joistSpanFt * 12) / joistSpacingIn) + 1;
  const joistsOrdered = ceilSafe(joistsRequired * (1 + waste / 100));
  const joistLinearFtOrdered = round(joistsOrdered * boardRunLengthFt, 2);
  const joistPiecesOrdered = input.joistStockLengthFt !== undefined
    ? ceilSafe(joistLinearFtOrdered / input.joistStockLengthFt)
    : undefined;
  if (input.joistStockLengthFt !== undefined) requirePositive('joistStockLengthFt', input.joistStockLengthFt);

  const beamCount = input.beamCount ?? 0;
  const beamLengthFt = input.beamLengthFt;
  const beamLinearFtRequired = beamLengthFt !== undefined ? beamCount * beamLengthFt : 0;
  const beamLinearFtOrdered = round(beamLinearFtRequired * (1 + waste / 100), 2);
  const beamPiecesOrdered = beamLengthFt !== undefined && input.beamStockLengthFt !== undefined
    ? ceilSafe(beamLinearFtOrdered / input.beamStockLengthFt)
    : undefined;

  const postCount = input.postCount ?? 0;
  const perimeterLinearFtRequired = 2 * (input.deckLengthFt + input.deckWidthFt);
  const rimJoistLinearFtOrdered = round(perimeterLinearFtRequired * (1 + waste / 100), 2);

  const fastenersRequired = deckingBoardsRequired * joistsRequired * screwsPerIntersection;
  const fastenersOrdered = ceilSafe(fastenersRequired * (1 + waste / 100));

  const costs = buildDeckCosts(input, {
    deckingBoardsOrdered,
    deckingLinearFtOrdered,
    areaSqFt,
    joistPiecesOrdered,
    joistLinearFtOrdered,
    beamPiecesOrdered,
    beamLinearFtOrdered,
    postCount,
    fastenersOrdered,
    rimJoistLinearFtOrdered,
  });

  const warnings = [
    'This calculator estimates materials only. It is not structural engineering and does not determine safe spans, footing sizes, load ratings or code compliance.',
    'Joist spacing, beam layout, post count and framing dimensions must be confirmed against the actual design, local code and site conditions.',
  ];
  if (beamCount > 0 && beamLengthFt === undefined) warnings.push('Beam count was supplied without beam length, so beam quantity is not priced or converted to stock pieces.');
  if (postCount === 0) warnings.push('No post count was supplied. This planner does not invent a structural post layout.');
  if (input.beamStockLengthFt !== undefined && beamPiecesOrdered === undefined) warnings.push('Beam stock length was supplied without a beam length.');
  if (waste > ENGINE_ASSUMPTIONS.waste.warningAbovePercent) warnings.push(`A waste allowance of ${waste}% is unusually high. Confirm why it is needed.`);

  return {
    deckLabel: input.deckLabel?.trim() || 'Deck Project',
    areaSqFt: round(areaSqFt, 2),
    deckingBoardWidthIn: boardWidthIn,
    deckingBoardLengthFt: boardLengthFt,
    boardGapIn,
    joistSpacingIn,
    joistWidthIn,
    joistDepthIn,
    beamWidthIn: input.beamWidthIn,
    beamDepthIn: input.beamDepthIn,
    boardRunDirection,
    boardRunLengthFt: round(boardRunLengthFt, 2),
    boardCoverageWidthFt: round(boardCoverageWidthFt, 4),
    deckingRowsRequired,
    deckingRowsOrdered,
    boardsPerRowRequired,
    deckingBoardsRequired: deckingBoardsOrdered,
    deckingLinearFtRequired: round(deckingLinearFtRequired, 2),
    deckingLinearFtOrdered,
    perimeterLinearFtRequired: round(perimeterLinearFtRequired, 2),
    rimJoistLinearFtOrdered,
    joistsRequired,
    joistsOrdered,
    joistLinearFtOrdered,
    joistPiecesOrdered,
    beamCount,
    beamLengthFt,
    beamLinearFtOrdered,
    beamPiecesOrdered,
    postCount,
    postHeightFt: input.postHeightFt,
    fastenersRequired,
    fastenersOrdered,
    wastePercent: waste,
    pricing: input.pricing,
    costs,
    warnings,
  };
}

function buildDeckCosts(input: DeckInput, q: {
  deckingBoardsOrdered: number;
  deckingLinearFtOrdered: number;
  areaSqFt: number;
  joistPiecesOrdered?: number;
  joistLinearFtOrdered: number;
  beamPiecesOrdered?: number;
  beamLinearFtOrdered: number;
  postCount: number;
  fastenersOrdered: number;
  rimJoistLinearFtOrdered: number;
}): DeckCostLine[] {
  const p = input.pricing;
  if (!p) return [];
  const lines: DeckCostLine[] = [];
  const add = (component: DeckCostLine['component'], basis: string, price: number | undefined, quantity: number) => {
    if (price === undefined || quantity <= 0) return;
    requireNonNegative(`pricing.${basis}`, price);
    lines.push({ component, basis, unitPrice: price, quantity: round(quantity, 2), cost: round(price * quantity, 2) });
  };
  if (p.deckingPerBoard !== undefined) add('decking', 'deckingPerBoard', p.deckingPerBoard, q.deckingBoardsOrdered);
  if (p.deckingPerSqFt !== undefined) add('decking', 'deckingPerSqFt', p.deckingPerSqFt, round(q.areaSqFt * (1 + (input.wastePercent ?? ENGINE_ASSUMPTIONS.waste.defaultPercent) / 100), 2));
  if (p.deckingPerLinearFt !== undefined) add('decking', 'deckingPerLinearFt', p.deckingPerLinearFt, q.deckingLinearFtOrdered);
  if (p.joistPerPiece !== undefined && q.joistPiecesOrdered !== undefined) add('joists', 'joistPerPiece', p.joistPerPiece, q.joistPiecesOrdered);
  if (p.joistPerLinearFt !== undefined) add('joists', 'joistPerLinearFt', p.joistPerLinearFt, q.joistLinearFtOrdered);
  if (p.beamPerPiece !== undefined && q.beamPiecesOrdered !== undefined) add('beams', 'beamPerPiece', p.beamPerPiece, q.beamPiecesOrdered);
  if (p.beamPerLinearFt !== undefined) add('beams', 'beamPerLinearFt', p.beamPerLinearFt, q.beamLinearFtOrdered);
  if (p.postPrice !== undefined) add('posts', 'postPrice', p.postPrice, q.postCount);
  if (p.fastenerPerEach !== undefined) add('fasteners', 'fastenerPerEach', p.fastenerPerEach, q.fastenersOrdered);
  if (p.rimJoistPerLinearFt !== undefined) add('rim-joist', 'rimJoistPerLinearFt', p.rimJoistPerLinearFt, q.rimJoistLinearFtOrdered);
  return lines;
}

function requireNonNegativeInteger(field: string, value: number): void {
  requireNonNegative(field, value);
  if (!Number.isInteger(value)) throw new CalcInputError(field, `${field} must be a whole number.`);
}
