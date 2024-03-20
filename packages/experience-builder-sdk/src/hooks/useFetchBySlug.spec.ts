import { useFetchBySlug, UseFetchBySlugArgs } from './useFetchBySlug';
import { EntityStore } from '@contentful/experiences-core';
import { renderHook, waitFor } from '@testing-library/react';
import { compositionEntry } from '../../test/__fixtures__/composition';
import { entries, assets } from '../../test/__fixtures__/entities';
import type { ContentfulClientApi, Entry } from 'contentful';

const experienceTypeId = 'layout';
const localeCode = 'en-US';
const slug = 'hello-world';

let clientMock: ContentfulClientApi<undefined>;

describe('useFetchBySlug', () => {
  beforeEach(() => {
    clientMock = {
      getEntries: jest.fn().mockImplementation((_query) => {
        // { content_type: 'layout', locale: 'en-US', 'fields.slug': 'hello-world' }
        return Promise.resolve({ items: [compositionEntry] });
      }),
      getAssets: jest.fn().mockResolvedValue({ items: assets }),
      withoutLinkResolution: {
        getEntries: jest.fn().mockImplementation((_query) => {
          // { 'sys.id[in]': [ 'entry1', 'entry2' ], locale: 'en-US' }
          return Promise.resolve({ items: entries });
        }),
      },
    } as unknown as ContentfulClientApi<undefined>;
  });

  it('should be defined', async () => {
    const { result } = renderHook(useFetchBySlug, {
      initialProps: {
        client: clientMock,
        slug,
        experienceTypeId,
        localeCode,
      },
    });

    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('should fetch the experience by slug with bound entities', async () => {
    const { result } = renderHook(useFetchBySlug, {
      initialProps: {
        client: clientMock,
        slug,
        experienceTypeId,
        localeCode,
      },
    });

    expect(result.current).toEqual({
      error: undefined,
      experience: undefined,
      isLoading: true,
      isEditorMode: false,
    });

    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: localeCode,
    });

    await waitFor(() => {
      expect(result.current.experience?.entityStore).toMatchObject(entityStore);

      expect(clientMock.getEntries).toHaveBeenNthCalledWith(1, {
        content_type: experienceTypeId,
        'fields.slug': slug,
        locale: localeCode,
      });

      expect(clientMock.withoutLinkResolution.getEntries).toHaveBeenNthCalledWith(1, {
        limit: 100,
        skip: 0,
        'sys.id[in]': entries.map((entry) => entry.sys.id),
        locale: localeCode,
      });

      expect(clientMock.getAssets).toHaveBeenCalledWith({
        'sys.id[in]': assets.map((asset) => asset.sys.id),
        locale: localeCode,
      });

      expect(result.current).toEqual({
        experience: result.current.experience,
        isEditorMode: false,
        isLoading: false,
        error: undefined,
      });
    });
  });

  it('should return an error if experience entry was not found, then when slug changes to good entry the error should be undefined', async () => {
    clientMock.getEntries = jest.fn().mockResolvedValue({ items: [] });
    const initialProps: UseFetchBySlugArgs = {
      client: clientMock,
      slug: 'unknown-slug',
      experienceTypeId,
      localeCode,
    };
    const { result, rerender } = renderHook(useFetchBySlug, { initialProps });

    await waitFor(() => {
      expect(result.current.error?.message).toBe(
        'No experience entry with slug: unknown-slug exists',
      );
    });

    // Reset stub
    clientMock.getEntries = jest.fn().mockImplementation((data) => {
      if ('sys.id[in]' in data) {
        return Promise.resolve({ items: entries });
      }
      return Promise.resolve({ items: [compositionEntry] });
    });

    rerender({ ...initialProps, slug: 'hello-world' });

    await waitFor(() => expect(result.current.error).toBeUndefined());
  });

  it('should return an error if multiple experience entries were found, then when slug changes to only one entry, then the error should be undefined', async () => {
    clientMock.getEntries = jest
      .fn()
      .mockResolvedValue({ items: [compositionEntry, compositionEntry] });
    const initialProps: UseFetchBySlugArgs = {
      client: clientMock,
      slug,
      experienceTypeId,
      localeCode,
    };
    const { result, rerender } = renderHook(useFetchBySlug, { initialProps });

    await waitFor(() => {
      expect(result.current.error?.message).toBe(
        `More than one experience with identifier: ${JSON.stringify({ slug })} was found`,
      );
      expect(result.current.isLoading).toBe(false);
      expect(clientMock.getEntries).toHaveBeenCalledTimes(1);
    });

    // Reset stub
    clientMock.getEntries = jest
      .fn()
      .mockResolvedValue({ items: [{ ...compositionEntry, slug: 'hello-world2' }] });

    rerender({ ...initialProps, slug: 'hello-world2' });

    await waitFor(() => {
      expect(result.current.error).toBeUndefined();
      expect(clientMock.getEntries).toHaveBeenCalledTimes(1);
      expect(clientMock.withoutLinkResolution.getEntries).toHaveBeenCalledTimes(1);
    });
  });

  it('should return an error if experienceTypeId is not defined', async () => {
    const initialProps = {
      client: clientMock,
      slug,
      localeCode,
      experienceTypeId: undefined,
    };

    const { result, rerender } = renderHook(useFetchBySlug, {
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
    const initialProps: UseFetchBySlugArgs = {
      client: clientMock,
      slug,
      experienceTypeId,
      // @ts-expect-error undefined is not allowed through types, but it can still happen if invoked from plain js
      localeCode: undefined,
    };

    const { result, rerender } = renderHook(useFetchBySlug, { initialProps });

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
