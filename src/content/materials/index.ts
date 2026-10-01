import type { ContentPage } from '../types';
import { page as gravel } from './gravel';
import { page as peaGravel } from './pea-gravel';
import { page as mulch } from './mulch';
import { page as topsoil } from './topsoil';
import { page as sand } from './sand';
import { page as paverBase } from './paver-base';
import { page as concrete } from './concrete';
import { page as fenceMaterials } from './fence-materials';
import { page as deckingMaterials } from './decking-materials';

/** Material references: what each material is, and how it is planned. */
export const MATERIAL_PAGES: ContentPage[] = [
  gravel,
  peaGravel,
  mulch,
  topsoil,
  sand,
  paverBase,
  concrete,
  fenceMaterials,
  deckingMaterials,
];
