import type { Cluster, ContentPage } from './types';
import { PROJECT_PAGES } from './projects';
import { MATERIAL_PAGES } from './materials';
import { COST_PAGES } from './costs';

/** Content library registry. One entry per indexable content page. */
export const CONTENT_BY_CLUSTER: Record<Cluster, ContentPage[]> = {
  projects: PROJECT_PAGES,
  materials: MATERIAL_PAGES,
  costs: COST_PAGES,
};

export const CONTENT_PAGES: ContentPage[] = [
  ...CONTENT_BY_CLUSTER.projects,
  ...CONTENT_BY_CLUSTER.materials,
  ...CONTENT_BY_CLUSTER.costs,
];

export function getContentPage(slug: string): ContentPage | undefined {
  return CONTENT_PAGES.find((page) => page.slug === slug);
}

export function pagesInCluster(cluster: Cluster): ContentPage[] {
  return CONTENT_BY_CLUSTER[cluster];
}
