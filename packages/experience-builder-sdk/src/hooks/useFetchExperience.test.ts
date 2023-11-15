import { useFetchExperience } from './useFetchExperience';
import { EntityStore } from '../core/preview/EntityStore';
import { act, renderHook } from '@testing-library/react';
import { compositionEntry } from '../../test/__fixtures__/composition';
import { entries, assets } from '../../test/__fixtures__/entities';
import type { ContentfulClientApi, Entry } from 'contentful';
import { ExternalSDKMode } from '../types';

const experienceTypeId = 'layout';
const localeCode = 'en-US';
const slug = 'hello-world';
const id = 'composition-id';

let clientMock: ContentfulClientApi<undefined>;

describe('useFetchExperience', () => {
  beforeEach(() => {
    clientMock = {
      getEntries: jest.fn().mockImplementation((data) => {
        if ('sys.id[in]' in data) {
          return Promise.resolve({ items: entries });
        }

        return Promise.resolve({ items: [compositionEntry] });
      }),
      getAssets: jest.fn().mockResolvedValue({ items: assets }),
    } as unknown as ContentfulClientApi<undefined>;
  });

  it('should be defined', async () => {
    const { result } = await act(async () => {
      return renderHook(useFetchExperience, {
        initialProps: {
          client: clientMock,
          mode: 'preview' as ExternalSDKMode,
          slug,
          experienceTypeId,
          localeCode,
        },
      });
    });

    expect(result.current).toBeDefined();
    expect(result.current.isFetching).toBe(false);
  });

  it('should fetch the experience by slug with bound entities', async () => {
    const { result } = await act(async () =>
      renderHook(useFetchExperience, {
        initialProps: {
          client: clientMock,
          mode: 'preview' as ExternalSDKMode,
          slug,
          experienceTypeId,
          localeCode,
        },
      })
    );

    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: localeCode,
    });

    expect(result.current.experience?.mode).toBe('preview');
    expect(result.current.experience?.entityStore).toMatchObject(entityStore);

    expect(clientMock.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: experienceTypeId,
      'fields.slug': slug,
      locale: localeCode,
    });

    expect(clientMock.getEntries).toHaveBeenNthCalledWith(2, {
      'sys.id[in]': entries.map((entry) => entry.sys.id),
      locale: localeCode,
    });

    expect(clientMock.getAssets).toHaveBeenCalledWith({
      'sys.id[in]': assets.map((asset) => asset.sys.id),
      locale: localeCode,
    });

    expect(result.current).toEqual({
      experience: result.current.experience,
      isFetching: false,
      fetchBySlug: result.current.fetchBySlug,
      fetchById: result.current.fetchById,
    });
  });

  it('should fetch the experience by id with bound entities', async () => {
    const { result } = await act(async () =>
      renderHook(useFetchExperience, {
        initialProps: {
          client: clientMock,
          mode: 'preview' as ExternalSDKMode,
          id,
          experienceTypeId,
          localeCode,
        },
      })
    );

    const store = result.current;

    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: localeCode,
    });

    expect(store.experience?.mode).toBe('preview');
    expect(store.experience?.entityStore).toMatchObject(entityStore);

    expect(clientMock.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: experienceTypeId,
      'sys.id': compositionEntry.sys.id,
      locale: localeCode,
    });

    expect(clientMock.getEntries).toHaveBeenNthCalledWith(2, {
      'sys.id[in]': entries.map((entry) => entry.sys.id),
      locale: localeCode,
    });

    expect(clientMock.getAssets).toHaveBeenCalledWith({
      'sys.id[in]': assets.map((asset) => asset.sys.id),
      locale: localeCode,
    });

    expect(result.current).toEqual({
      experience: result.current.experience,
      isFetching: false,
      fetchBySlug: store.fetchBySlug,
      fetchById: store.fetchById,
    });
  });

  it('should return an error if experience entry was not found, then when slug changes to good entry the error should be undefined', async () => {
    clientMock.getEntries = jest.fn().mockResolvedValue({ items: [] });
    const initialProps = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
      slug: 'unknown-slug',
      experienceTypeId,
      localeCode,
    };
    const { result, rerender } = await act(async () => {
      return renderHook(useFetchExperience, { initialProps });
    });

    expect(result.current.error?.message).toBe(
      'No experience entry with slug: unknown-slug exists'
    );

    // Reset stub
    clientMock.getEntries = jest.fn().mockImplementation((data) => {
      if ('sys.id[in]' in data) {
        return Promise.resolve({ items: entries });
      }
      return Promise.resolve({ items: [compositionEntry] });
    });

    await act(async () => rerender({ ...initialProps, slug: 'hello-world' }));

    expect(result.current.error).toBeUndefined();
  });

  it('should return an error if multiple experience entries were found, then when slug changes to only one entry, then the error should be undefined', async () => {
    clientMock.getEntries = jest
      .fn()
      .mockResolvedValue({ items: [compositionEntry, compositionEntry] });
    const initialProps = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
      slug,
      experienceTypeId,
      localeCode,
    };
    const { result, rerender } = await act(async () =>
      renderHook(useFetchExperience, { initialProps })
    );

    expect(result.current.error?.message).toBe(
      `More than one experience with identifier: ${JSON.stringify({ slug })} was found`
    );

    expect(result.current.isFetching).toBe(false);

    // Reset stub
    clientMock.getEntries = jest
      .fn()
      .mockResolvedValue({ items: [{ ...compositionEntry, slug: 'hello-world2' }] });

    await act(async () => rerender({ ...initialProps, slug: 'hello-world2' }));

    expect(result.current.error).toBeUndefined();
  });

  it('should return an error if experienceTypeId is not defined', async () => {
    const initialProps = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
      slug,
      localeCode,
      experienceTypeId: undefined,
    };

    const { result, rerender } = await act(async () =>
      renderHook(useFetchExperience, {
        // @ts-expect-error undefined is not allowed through types, but it can still happen if invoked from a plain js
        initialProps,
      })
    );

    expect(result.current.error?.message).toBe(
      'Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided'
    );

    await act(async () => rerender({ ...initialProps, experienceTypeId }));

    expect(result.current.error).toBeUndefined();
  });

  it('should return an error if slug and id are both undefined, then when one becomes defined the error should be undefined', async () => {
    const initialProps: Parameters<typeof useFetchExperience>[0] = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
      slug: undefined,
      id: undefined,
      experienceTypeId,
      localeCode,
    };

    const { result, rerender } = await act(async () =>
      renderHook(useFetchExperience, {
        initialProps,
      })
    );

    expect(result.current.error?.message).toBe(
      'Either slug or id must be provided to useFetchExperience'
    );

    expect(result.current.isFetching).toBe(false);

    await act(async () => rerender({ ...initialProps, slug }));

    expect(result.current.error).toBeUndefined();
  });

  it('should return an error if localeCode is not defined, then when localCode is provided, the error should be undefined', async () => {
    const initialProps: Parameters<typeof useFetchExperience>[0] = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
      slug,
      experienceTypeId,
      // @ts-expect-error undefined is not allowed through types, but it can still happen if invoked from a plain js
      localeCode: undefined,
    };

    const { result, rerender } = await act(async () =>
      renderHook(useFetchExperience, { initialProps })
    );

    expect(result.current.error?.message).toBe(
      'Failed to fetch experience entities. Required "locale" parameter was not provided'
    );

    expect(result.current.isFetching).toBe(false);

    await act(async () => rerender({ ...initialProps, localeCode }));

    expect(result.current.error).toBeUndefined();
  });
});
