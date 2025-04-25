import { getSingletonClient } from '@/utils/getExperience';
import { Link } from '@contentful/experiences-core/types';
import { useCallback } from 'react';
import type { Entry, Asset } from 'contentful';

const client = getSingletonClient();

export const useFetchReference = () => {
  const fetchLink = useCallback(
    (link: Link<'Entry' | 'Asset'>): Promise<Entry | Asset | undefined> => {
      if (!link || !client) {
        return Promise.resolve(undefined);
      }

      if (link.sys.linkType === 'Entry') {
        return client.getEntry(link.sys.id);
      }

      return client.getAsset(link.sys.id);
    },
    [],
  );

  return { fetchLink };
};
