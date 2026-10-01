import { ENGINE_ASSUMPTIONS } from './assumptions';

/**
 * Material assumptions. EVERY number here is a typical planning value, not a guarantee.
 * The numerical source of truth lives in `data/assumptions.ts`.
 */
export type MaterialId = keyof typeof ENGINE_ASSUMPTIONS.materials;

export interface MaterialSpec {
  id: MaterialId;
  name: string;
  density: { typical: number; min: number; max: number };
  /** Common retail bag sizes in cubic feet. Verify against the product label. */
  bagSizesCuFt: number[];
  note: string;
}

const MATERIAL_META: Record<MaterialId, { name: string; note: string }> = {
  gravel: {
    name: 'Gravel (crushed stone)',
    note: 'Crushed stone varies by rock type and size; limestone, granite and trap rock differ.',
  },
  'pea-gravel': {
    name: 'Pea gravel',
    note: 'Rounded stone, typically about 3/8 in. Shifts underfoot, so edging matters.',
  },
  sand: {
    name: 'Sand',
    note: 'Wet sand is noticeably heavier than dry sand.',
  },
  topsoil: {
    name: 'Topsoil',
    note: 'Moisture and organic content change weight significantly.',
  },
  soil: {
    name: 'General soil / fill',
    note: 'Fill dirt is usually heavier than screened topsoil.',
  },
  mulch: {
    name: 'Mulch',
    note: 'Fresh, wet mulch weighs far more than dry. Mulch is normally sold by volume.',
  },
  'landscape-rock': {
    name: 'Landscape rock / river rock',
    note: 'Larger stone leaves more voids, so weight per yard varies.',
  },
  'paver-base': {
    name: 'Paver base (compactable aggregate)',
    note: 'Compactable aggregate with fines. Packs down, so order allows for compaction.',
  },
};

export const MATERIALS: Record<MaterialId, MaterialSpec> = Object.fromEntries(
  (Object.keys(MATERIAL_META) as MaterialId[]).map((id) => {
    const a = ENGINE_ASSUMPTIONS.materials[id];
    return [id, {
      id,
      name: MATERIAL_META[id].name,
      density: { ...a.densityTonsPerCuYd },
      bagSizesCuFt: [...a.bagSizesCuFt],
      note: MATERIAL_META[id].note,
    }];
  }),
) as Record<MaterialId, MaterialSpec>;

export const CONCRETE_BAGS = ENGINE_ASSUMPTIONS.concrete.bags;

/** Approximate weight of cured/wet normal-weight concrete. */
export const CONCRETE_LB_PER_CU_FT = ENGINE_ASSUMPTIONS.concrete.lbPerCuFt;
