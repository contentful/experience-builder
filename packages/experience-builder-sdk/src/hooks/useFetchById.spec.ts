import { useFetchById, UseFetchByIdArgs } from './useFetchById';
import { EntityStore } from '@contentful/experiences-core';
import { renderHook, waitFor } from '@testing-library/react';
import { experienceEntry } from '../../test/__fixtures__/composition';
import { entries, assets } from '../../test/__fixtures__/entities';
import type { ContentfulClientApi, Entry } from 'contentful';
import { StudioCanvasMode } from '@contentful/experiences-core/constants';

const experienceTypeId = 'layout';
const localeCode = 'en-US';
const id = 'composition-id';

let clientMock: ContentfulClientApi<undefined>;

describe('useFetchById', () => {
  beforeEach(() => {
    clientMock = {
      getEntries: jest.fn().mockImplementation(() => {
        return Promise.resolve({ items: [experienceEntry] });
      }),
      getAssets: jest.fn().mockResolvedValue({ items: assets }),
    } as unknown as ContentfulClientApi<undefined>;
  });

  it('should be defined', async () => {
    const { result } = renderHook(useFetchById, {
      initialProps: {
        client: clientMock,
        id,
        experienceTypeId,
        localeCode,
      },
    });

    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('should fetch the experience by id with bound entities', async () => {
    const { result } = renderHook(useFetchById, {
      initialProps: {
        client: clientMock,
        id,
        experienceTypeId,
        localeCode,
      },
    });

    await waitFor(() => {
      const store = result.current;

      const entityStore = new EntityStore({
        experienceEntry: experienceEntry as unknown as Entry,
        entities: [...entries, ...assets],
        locale: localeCode,
      });
      expect(store.experience?.entityStore).toMatchObject(entityStore);

      expect(clientMock.getEntries).toHaveBeenNthCalledWith(1, {
        content_type: experienceTypeId,
        'sys.id': experienceEntry.sys.id,
        locale: localeCode,
      });

      expect(clientMock.getEntries).toHaveBeenNthCalledWith(1, {
        limit: 100,
        skip: 0,
        'sys.id[in]': entries.map((entry) => entry.sys.id),
        locale: localeCode,
      });

      expect(clientMock.getAssets).toHaveBeenCalledWith({
        limit: 100,
        skip: 0,
        'sys.id[in]': assets.map((asset) => asset.sys.id),
        locale: localeCode,
      });

      expect(store).toEqual({
        experience: store.experience,
        mode: StudioCanvasMode.NONE,
        isLoading: false,
        error: undefined,
      });
    });
  });

  it('should return an error if experience entry was not found, then when id changes to good entry the error should be undefined', async () => {
    clientMock.getEntries = jest.fn().mockResolvedValue({ items: [] });
    const initialProps: UseFetchByIdArgs = {
      client: clientMock,
      id: 'unknown-id',
      experienceTypeId,
      localeCode,
    };
    const { result, rerender } = renderHook(useFetchById, { initialProps });

    await waitFor(() => {
      expect(result.current.error?.message).toBe('No experience entry with id: unknown-id exists');
    });

    // Reset stub
    clientMock.getEntries = jest.fn().mockImplementation((data) => {
      if ('sys.id[in]' in data) {
        return Promise.resolve({ items: entries });
      }
      return Promise.resolve({ items: [experienceEntry] });
    });

    rerender({ ...initialProps, id: 'composition-id' });

    await waitFor(() => expect(result.current.error).toBeUndefined());
  });

  it('should return an error if experienceTypeId is not defined', async () => {
    const initialProps = {
      client: clientMock,
      id,
      localeCode,
      experienceTypeId: undefined,
    };

    const { result, rerender } = renderHook(useFetchById, {
      // @ts-expect-error undefined is not allowed through types, but it can still happen if invoked from plain js
      initialProps,
    });

    await waitFor(() => {
      expect(result.current.error?.message).toBe(
        'Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided',
      );
    });

    rerender({ ...initialProps, experienceTypeId });

    await waitFor(() => expect(result.current.error).toBeUndefined());
  });

  it('should return an error if localeCode is not defined, then when localCode is provided, the error should be undefined', async () => {
    const initialProps: UseFetchByIdArgs = {
      client: clientMock,
      id,
      experienceTypeId,
      // @ts-expect-error undefined is not allowed through types, but it can still happen if invoked from plain js
      localeCode: undefined,
    };

    const { result, rerender } = renderHook(useFetchById, { initialProps });

    await waitFor(() => {
      expect(result.current.error?.message).toBe(
        'Failed to fetch experience entities. Required "locale" parameter was not provided',
      );
      expect(result.current.isLoading).toBe(false);
    });

    rerender({ ...initialProps, localeCode });

    await waitFor(() => expect(result.current.error).toBeUndefined());
  });
});
