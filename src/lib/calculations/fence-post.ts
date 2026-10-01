import { ENGINE_ASSUMPTIONS } from '../../data/assumptions';
import { ceilSafe, round } from '../units';
import { CalcInputError, requireInteger, requireNonNegative, requirePositive } from '../validation';

export interface FencePostInput {
  fenceLengthFt: number;
  postSpacingFt?: number;
  cornerCount?: number;
  endCount?: number;
  gateCount?: number;
  gateWidthFt?: number;
  gateWidthsFt?: number[];
}

export interface FencePostResult {
  fenceLengthFt: number;
  gateOpeningLengthFt: number;
  netFenceRunFt: number;
  estimatedPostPositions: number;
  linePosts: number;
  cornerPosts: number;
  endPosts: number;
  gatePosts: number;
  totalPosts: number;
  notes: string[];
}

export function calculateFencePosts(input: FencePostInput): FencePostResult {
  requirePositive('fenceLengthFt', input.fenceLengthFt);
  const postSpacingFt = input.postSpacingFt ?? ENGINE_ASSUMPTIONS.fence.defaultPostSpacingFt;
  requirePositive('postSpacingFt', postSpacingFt);

  const cornerCount = input.cornerCount ?? 0;
  const endCount = input.endCount ?? ENGINE_ASSUMPTIONS.fence.defaultEndPosts;
  const gateCount = input.gateCount ?? input.gateWidthsFt?.length ?? 0;
  requireInteger('cornerCount', cornerCount, 0);
  requireInteger('endCount', endCount, 0);
  requireInteger('gateCount', gateCount, 0);

  const gateWidths = resolveGateWidths(gateCount, input.gateWidthFt, input.gateWidthsFt);
  const gateOpeningLengthFt = gateWidths.reduce((sum, width) => sum + width, 0);
  if (gateOpeningLengthFt >= input.fenceLengthFt) {
    throw new CalcInputError('gateWidthFt', 'Gate openings cannot equal or exceed the total fence length.');
  }

  const netFenceRunFt = input.fenceLengthFt - gateOpeningLengthFt;
  const estimatedPostPositions = netFenceRunFt > 0 ? ceilSafe(netFenceRunFt / postSpacingFt) + 1 : 0;
  if (cornerCount + endCount > estimatedPostPositions) {
    throw new CalcInputError('cornerCount', 'Corner and end posts exceed the estimated post positions.');
  }

  const linePosts = Math.max(estimatedPostPositions - cornerCount - endCount, 0);
  const gatePosts = gateCount * 2;
  const totalPosts = linePosts + cornerCount + endCount + gatePosts;

  return {
    fenceLengthFt: round(input.fenceLengthFt, 2),
    gateOpeningLengthFt: round(gateOpeningLengthFt, 2),
    netFenceRunFt: round(netFenceRunFt, 2),
    estimatedPostPositions,
    linePosts,
    cornerPosts: cornerCount,
    endPosts: endCount,
    gatePosts,
    totalPosts,
    notes: [
      `Post count uses ${postSpacingFt} ft spacing unless you enter another value. Actual post placement depends on fence layout, terrain and gate/corner geometry.`,
      'Gate posts are counted separately; do not also enter those same physical posts as end or corner posts.',
    ],
  };
}

function resolveGateWidths(gateCount: number, gateWidthFt?: number, gateWidthsFt?: number[]): number[] {
  if (gateWidthsFt !== undefined) {
    if (gateWidthsFt.length !== gateCount) throw new CalcInputError('gateWidthsFt', 'gateWidthsFt length must match gateCount.');
    gateWidthsFt.forEach((width, i) => requirePositive(`gateWidthsFt[${i}]`, width));
    return [...gateWidthsFt];
  }
  if (gateCount === 0) return [];
  if (gateWidthFt === undefined) throw new CalcInputError('gateWidthFt', 'Provide gateWidthFt when gateCount is greater than zero.');
  requirePositive('gateWidthFt', gateWidthFt);
  requireNonNegative('gateWidthFt', gateWidthFt);
  return Array.from({ length: gateCount }, () => gateWidthFt);
}
