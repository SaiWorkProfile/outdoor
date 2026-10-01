import type { MaterialId } from './materials';

/**
 * Use-case presets are what make each calculator page genuinely different:
 * same math engine, different defaults, ranges and guidance.
 * Depth ranges are typical guidance only; site conditions can change what is right.
 */
export interface UseCase {
  id: string;
  material: MaterialId;
  label: string;
  defaultDepthIn: number;
  minDepthIn: number;
  maxDepthIn: number;
  note: string;
}

export const USE_CASES: UseCase[] = [
  { id: 'garden-bed', material: 'mulch', label: 'Garden bed', defaultDepthIn: 3, minDepthIn: 2, maxDepthIn: 4, note: 'Keep mulch off plant stems and trunks.' },
  { id: 'tree-ring', material: 'mulch', label: 'Tree ring', defaultDepthIn: 3, minDepthIn: 2, maxDepthIn: 4, note: 'Do not pile against the trunk.' },

  { id: 'walkway', material: 'gravel', label: 'Walkway / path', defaultDepthIn: 3, minDepthIn: 2, maxDepthIn: 4, note: 'Usually laid over a compacted base.' },
  { id: 'patio', material: 'gravel', label: 'Gravel patio surface', defaultDepthIn: 3, minDepthIn: 2, maxDepthIn: 4, note: 'Surface layer only; base is calculated separately.' },
  { id: 'general', material: 'gravel', label: 'General fill', defaultDepthIn: 3, minDepthIn: 1, maxDepthIn: 6, note: 'Adjust depth to your project.' },

  { id: 'walkway', material: 'pea-gravel', label: 'Walkway', defaultDepthIn: 2, minDepthIn: 1, maxDepthIn: 3, note: 'Use firm edging to keep stones in place.' },
  { id: 'garden', material: 'pea-gravel', label: 'Garden / planting bed', defaultDepthIn: 2, minDepthIn: 1, maxDepthIn: 3, note: 'Often used as a decorative ground cover.' },
  { id: 'patio', material: 'pea-gravel', label: 'Patio', defaultDepthIn: 2, minDepthIn: 2, maxDepthIn: 3, note: 'Loose stone can be uncomfortable for furniture legs.' },

  { id: 'garden-bed', material: 'topsoil', label: 'Garden bed', defaultDepthIn: 6, minDepthIn: 4, maxDepthIn: 8, note: 'Depth to add on top of existing ground.' },
  { id: 'raised-bed', material: 'topsoil', label: 'Raised bed fill', defaultDepthIn: 12, minDepthIn: 6, maxDepthIn: 24, note: 'Use the inside height of the bed. Soil settles over time.' },
  { id: 'lawn-topdressing', material: 'topsoil', label: 'Lawn top-dressing', defaultDepthIn: 0.5, minDepthIn: 0.25, maxDepthIn: 0.5, note: 'A thin layer is spread over the existing lawn.' },
  { id: 'new-lawn', material: 'topsoil', label: 'New lawn', defaultDepthIn: 4, minDepthIn: 3, maxDepthIn: 6, note: 'Depth varies with existing soil quality.' },

  { id: 'general', material: 'soil', label: 'General soil', defaultDepthIn: 4, minDepthIn: 1, maxDepthIn: 12, note: 'Adjust depth to your project.' },

  { id: 'paver-bedding', material: 'sand', label: 'Paver bedding', defaultDepthIn: 1, minDepthIn: 1, maxDepthIn: 1.5, note: 'A screeded layer under pavers, not a structural base.' },
  { id: 'leveling', material: 'sand', label: 'Leveling', defaultDepthIn: 2, minDepthIn: 1, maxDepthIn: 4, note: 'Depth depends on how uneven the ground is.' },
  { id: 'sandbox', material: 'sand', label: 'Sandbox', defaultDepthIn: 6, minDepthIn: 4, maxDepthIn: 12, note: 'Use sand labeled for play.' },

  { id: 'decorative', material: 'landscape-rock', label: 'Decorative cover', defaultDepthIn: 3, minDepthIn: 2, maxDepthIn: 4, note: 'Larger stone needs more depth to cover the ground.' },

  { id: 'patio', material: 'paver-base', label: 'Patio base', defaultDepthIn: 6, minDepthIn: 4, maxDepthIn: 8, note: 'Compact in layers. Soil and climate affect the needed depth.' },
  { id: 'walkway', material: 'paver-base', label: 'Walkway base', defaultDepthIn: 4, minDepthIn: 4, maxDepthIn: 6, note: 'Compact in layers.' },
  { id: 'driveway', material: 'paver-base', label: 'Driveway base', defaultDepthIn: 8, minDepthIn: 8, maxDepthIn: 12, note: 'Heavier loads need a professional evaluation.' },
];

export function getUseCase(material: MaterialId, id: string): UseCase | undefined {
  return USE_CASES.find((u) => u.material === material && u.id === id);
}

export function useCasesFor(material: MaterialId): UseCase[] {
  return USE_CASES.filter((u) => u.material === material);
}
