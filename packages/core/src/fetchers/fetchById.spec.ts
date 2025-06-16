import { ContentfulClientApi } from 'contentful';
import type { ExperienceEntry } from '@/types';
import { fetchById } from './fetchById';
import { createExperienceEntry } from '../test/__fixtures__/experience';
import { assets, entries } from '../test/__fixtures__/entities';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import * as attachPrebindingDefaultValueAsDataSourceMock from './attachPrebindingDefaultValueAsDataSource';
import * as fetchers from './fetchReferencedEntities';

const mockClient = {
  getAssets: vi.fn(),
  getEntries: vi.fn(),
  withoutLinkResolution: {
    getEntries: vi.fn(),
  },
} as unknown as ContentfulClientApi<undefined>;

const experienceTypeId = 'experienceTypeId';
const id = 'abc123';
const localeCode = 'en-US';
let experienceEntry = createExperienceEntry({});

describe('fetchById', () => {
  beforeEach(() => {
    experienceEntry = createExperienceEntry({});
    vi.mock('./fetchExperienceEntry', () => {
      const fetchExperienceEntry = async () => {
        return experienceEntry;
      };
      return {
        fetchExperienceEntry,
      };
    });

    vi.mock('./fetchReferencedEntities', () => {
      const fetchReferencedEntities = vi.fn(async () => {
        return { entries, assets };
      });
      return {
        fetchReferencedEntities,
      };
    });

    vi.mock('./attachPrebindingDefaultValueAsDataSource', () => ({
      attachPrebindingDefaultValueAsDataSource: vi.fn(),
    }));
  });

  describe('when in editor mode', () => {
    const isEditorMode = true;

    it('should returned undefined if in editor mode', async () => {
      const result = await fetchById({
        client: mockClient,
        experienceTypeId,
        id,
        localeCode,
        isEditorMode,
      });
      expect(result).toBeUndefined();
    });
  });

  describe('when not in editor mode', () => {
    const isEditorMode = false;

    it('should return an experience entry with the given slug', async () => {
      const result = await fetchById({
        client: mockClient,
        experienceTypeId,
        id,
        localeCode,
        isEditorMode,
      });
      expect(result?.entityStore?.experienceEntryFields?.slug).toEqual(experienceEntry.fields.slug);
    });
  });

  describe('when the API returns an experience with prebinding default value not as a datasource', () => {
    const isEditorMode = false;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should attach prebinding default value as a data source', async () => {
      vi.mocked(
        attachPrebindingDefaultValueAsDataSourceMock.attachPrebindingDefaultValueAsDataSource,
      ).mockImplementationOnce((entry: ExperienceEntry) => {
        entry.fields.dataSource = {
          ...entry.fields.dataSource,
          prebound: {
            sys: {
              id: 'prebound-id',
              type: 'Link',
              linkType: 'Entry',
            },
          },
        };
      });

      await fetchById({
        client: mockClient,
        experienceTypeId,
        id,
        localeCode,
        isEditorMode,
      });

      expect(fetchers.fetchReferencedEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          experienceEntry: expect.objectContaining({
            fields: expect.objectContaining({
              dataSource: expect.objectContaining({
                ...createExperienceEntry({}).fields.dataSource,
                prebound: {
                  sys: {
                    id: 'prebound-id',
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              }),
            }),
          }),
        }),
      );
    });

    it('should not attach prebinding default value as a data source if attachPrebindingDefaultValueAsDataSource does not populate it', async () => {
      await fetchById({
        client: mockClient,
        experienceTypeId,
        id,
        localeCode,
        isEditorMode,
      });

      expect(fetchers.fetchReferencedEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          experienceEntry: expect.objectContaining({
            fields: expect.objectContaining({
              dataSource: createExperienceEntry({}).fields.dataSource,
            }),
          }),
        }),
      );
    });
  });
});
