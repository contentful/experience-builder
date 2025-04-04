import { renderHook, waitFor } from '@testing-library/react';
import { useCustomFetch } from './useCustomFetch';
import { experienceEntry } from '../../test/__fixtures__/composition';
import { entries, assets } from '../../test/__fixtures__/entities';
import { Experience } from '@contentful/experiences-core/types';
import { createExperience, EntityStore } from '@contentful/experiences-core';
import { Entry } from 'contentful';

// Using customly stored content to create an experience
const customFetchAllEntities = async (): Promise<Experience<EntityStore> | undefined> => {
  const experience = createExperience({
    experienceEntry: experienceEntry as Entry,
    referencedAssets: assets,
    referencedEntries: entries,
    locale: 'en-US',
  });

  return experience;
};

describe('useCustomFetch', () => {
  beforeEach(() => {});

  it('should return a loading state and then resolve', async () => {
    const fetchFn = jest.fn().mockImplementation(customFetchAllEntities);
    const { result } = renderHook(useCustomFetch, { initialProps: { fetchFn } });

    await waitFor(() => expect(result.current.isLoading).toBe(true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchFn).toHaveBeenCalled();
  });
});
