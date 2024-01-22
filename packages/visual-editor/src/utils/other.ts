import { CompositionComponentNode } from '@contentful/experience-builder-core/types';

export const entityIdsOfDataSource = (
  dataSource: CompositionComponentNode['data']['dataSource']
): string[] => {
  if (!dataSource) return [];

  return Object.values(dataSource).map((link) => link.sys.id);
};
