import { useFetchExperience } from './useFetchExperience';
import { EntityStore } from '@contentful/experiences-core';
import { act, renderHook } from '@testing-library/react';
import { compositionEntry } from '../../test/__fixtures__/composition';
import { entries, assets } from '../../test/__fixtures__/entities';
import type { ContentfulClientApi, Entry } from 'contentful';
import { ExternalSDKMode } from '@contentful/experiences-core/types';

const experienceTypeId = 'layout';
const localeCode = 'en-US';
const slug = 'hello-world';

let clientMock: ContentfulClientApi<undefined>;

describe('useFetchExperience', () => {
  beforeEach(() => {
    clientMock = {
      getEntries: jest.fn().mockImplementation((_query) => {
        // { content_type: 'layout', locale: 'en-US', 'fields.slug': 'hello-world' }
        return Promise.resolve({ items: [compositionEntry] });
      }),
      getAssets: jest.fn().mockResolvedValue({ items: assets }),
      withoutLinkResolution: {
        getEntries: jest.fn().mockImplementation((_query) => {
          // { "sys.id[in]": [ "entry1", "entry2", ], locale: "en-US", }
          return Promise.resolve({ items: entries });
        }),
      },
    } as unknown as ContentfulClientApi<undefined>;
  });

  it('should be defined', () => {
    const res = renderHook((props) => useFetchExperience(props), {
      initialProps: { client: clientMock, mode: 'preview' as ExternalSDKMode },
    });

    const store = res.result.current;

    expect(store).toEqual({
      entityStore: undefined,
      isFetching: false,
      fetchBySlug: store.fetchBySlug,
      fetchById: store.fetchById,
    });
  });

  it('should fetch the experience by slug with bound entities', async () => {
    const res = renderHook((props) => useFetchExperience(props), {
      initialProps: { client: clientMock, mode: 'preview' as ExternalSDKMode },
    });

    const store = res.result.current;

    expect(store).toEqual({
      experience: undefined,
      isFetching: false,
      error: undefined,
      fetchBySlug: store.fetchBySlug,
      fetchById: store.fetchById,
    });

    await act(async () => {
      const experience = await store.fetchBySlug({
        experienceTypeId,
        localeCode,
        slug,
      });

      const entityStore = new EntityStore({
        experienceEntry: compositionEntry as unknown as Entry,
        entities: [...entries, ...assets],
        locale: localeCode,
      });

      expect(experience).toHaveProperty('entityStore');
      expect(experience!.entityStore).toMatchObject(entityStore);
    });

    expect(clientMock.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: experienceTypeId,
      'fields.slug': slug,
      locale: localeCode,
    });

    expect(clientMock.withoutLinkResolution.getEntries).toHaveBeenNthCalledWith(1, {
      'sys.id[in]': entries.map((entry) => entry.sys.id),
      locale: localeCode,
    });

    expect(clientMock.getAssets).toHaveBeenCalledWith({
      'sys.id[in]': assets.map((asset) => asset.sys.id),
      locale: localeCode,
    });

    expect(res.result.current).toEqual({
      experience: res.result.current.experience,
      isFetching: false,
      fetchBySlug: store.fetchBySlug,
      fetchById: store.fetchById,
    });
  });

  it('should fetch the experience by id with bound entities', async () => {
    const res = renderHook((props) => useFetchExperience(props), {
      initialProps: { client: clientMock, mode: 'preview' as ExternalSDKMode },
    });

    const store = res.result.current;

    expect(store).toEqual({
      experience: undefined,
      isFetching: false,
      error: undefined,
      fetchBySlug: store.fetchBySlug,
      fetchById: store.fetchById,
    });

    await act(async () => {
      const experience = await store.fetchById({
        experienceTypeId,
        localeCode,
        id: compositionEntry.sys.id,
      });

      const entityStore = new EntityStore({
        experienceEntry: compositionEntry as unknown as Entry,
        entities: [...entries, ...assets],
        locale: localeCode,
      });

      expect(experience).toHaveProperty('entityStore');
      expect(experience!.entityStore).toMatchObject(entityStore);
    });

    expect(clientMock.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: experienceTypeId,
      'sys.id': compositionEntry.sys.id,
      locale: localeCode,
    });

    expect(clientMock.withoutLinkResolution.getEntries).toHaveBeenNthCalledWith(1, {
      'sys.id[in]': entries.map((entry) => entry.sys.id),
      locale: localeCode,
    });

    expect(clientMock.getAssets).toHaveBeenCalledWith({
      'sys.id[in]': assets.map((asset) => asset.sys.id),
      locale: localeCode,
    });

    expect(res.result.current).toEqual({
      experience: res.result.current.experience,
      isFetching: false,
      fetchBySlug: store.fetchBySlug,
      fetchById: store.fetchById,
    });
  });

  it('should throw an error if experience entry was not found', async () => {
    clientMock.getEntries = jest.fn().mockResolvedValue({ items: [] });

    const res = renderHook((props) => useFetchExperience(props), {
      initialProps: { client: clientMock, mode: 'preview' as ExternalSDKMode },
    });

    try {
      await act(() => res.result.current.fetchBySlug({ experienceTypeId, slug, localeCode }));
    } catch (e) {
      expect((e as Error).message).toBe(`No experience entry with slug: ${slug} exists`);
    }

    expect(res.result.current.isFetching).toBe(false);
  });

  it('should throw an error if multiple experience entries were found', async () => {
    clientMock.getEntries = jest
      .fn()
      .mockResolvedValue({ items: [compositionEntry, compositionEntry] });

    const res = renderHook((props) => useFetchExperience(props), {
      initialProps: { client: clientMock, mode: 'preview' as ExternalSDKMode },
    });

    try {
      await act(() => res.result.current.fetchBySlug({ experienceTypeId, slug, localeCode }));
    } catch (e) {
      expect((e as Error).message).toBe(
        `More than one experience with identifier: ${JSON.stringify({ slug })} was found`,
      );
    }

    expect(res.result.current.isFetching).toBe(false);
  });

  it('should throw an error if experienceTypeId is not defined', async () => {
    const res = renderHook((props) => useFetchExperience(props), {
      initialProps: { client: clientMock, mode: 'preview' as ExternalSDKMode },
    });

    try {
      await act(() =>
        // @ts-expect-error undefined is not alloed through types, but it can still happen if invoked from a plain js
        res.result.current.fetchBySlug({ experienceTypeId: undefined, slug, localeCode }),
      );
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided',
      );
    }

    expect(res.result.current.isFetching).toBe(false);
  });

  it('should throw an error if slug is not defined', async () => {
    const res = renderHook((props) => useFetchExperience(props), {
      initialProps: { client: clientMock, mode: 'preview' as ExternalSDKMode },
    });

    try {
      await act(() =>
        // @ts-expect-error undefined is not alloed through types, but it can still happen if invoked from a plain js
        res.result.current.fetchBySlug({ experienceTypeId, slug: undefined, localeCode }),
      );
    } catch (e) {
      expect((e as Error).message).toBe(
        `Failed to fetch experience entities. At least one identifier must be provided. Received: ${JSON.stringify(
          {},
        )}`,
      );
    }

    expect(res.result.current.isFetching).toBe(false);
  });

  it('should throw an error if localeCode is not defined', async () => {
    const res = renderHook((props) => useFetchExperience(props), {
      initialProps: { client: clientMock, mode: 'preview' as ExternalSDKMode },
    });

    try {
      await act(() =>
        // @ts-expect-error undefined is not alloed through types, but it can still happen if invoked from a plain js
        res.result.current.fetchBySlug({ experienceTypeId, slug, localeCode: undefined }),
      );
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "locale" parameter was not provided',
      );
    }

    expect(res.result.current.isFetching).toBe(false);
  });
});
