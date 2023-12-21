import { useFetchBySlug, useFetchBySlugArgs } from './useFetchBySlug';
import { EntityStore } from '@contentful/experience-builder-core';
import { renderHook, waitFor } from '@testing-library/react';
import { compositionEntry } from '../../test/__fixtures__/composition';
import { entries, assets } from '../../test/__fixtures__/entities';
import type { ContentfulClientApi, Entry } from 'contentful';
import type { ExternalSDKMode } from '@contentful/experience-builder-core/types';

const experienceTypeId = 'layout';
const localeCode = 'en-US';
const slug = 'hello-world';

let clientMock: ContentfulClientApi<undefined>;

describe('useFetchBySlug', () => {
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
    const { result } = renderHook(useFetchBySlug, {
      initialProps: {
        client: clientMock,
        mode: 'preview' as ExternalSDKMode,
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
        mode: 'preview' as ExternalSDKMode,
        slug,
        experienceTypeId,
        localeCode,
      },
    });

    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: localeCode,
    });

    await waitFor(() => {
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
        isLoading: false,
        error: undefined,
      });
    });
  });

  it('should return an error if experience entry was not found, then when slug changes to good entry the error should be undefined', async () => {
    clientMock.getEntries = jest.fn().mockResolvedValue({ items: [] });
    const initialProps: useFetchBySlugArgs = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
      slug: 'unknown-slug',
      experienceTypeId,
      localeCode,
    };
    const { result, rerender } = renderHook(useFetchBySlug, { initialProps });

    await waitFor(() => {
      expect(result.current.error?.message).toBe(
        'No experience entry with slug: unknown-slug exists'
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
    const initialProps: useFetchBySlugArgs = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
      slug,
      experienceTypeId,
      localeCode,
    };
    const { result, rerender } = renderHook(useFetchBySlug, { initialProps });

    await waitFor(() => {
      expect(result.current.error?.message).toBe(
        `More than one experience with identifier: ${JSON.stringify({ slug })} was found`
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
      expect(clientMock.getEntries).toHaveBeenCalledTimes(2);
    });
  });

  it('should return an error if experienceTypeId is not defined', async () => {
    const initialProps = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
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
        'Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided'
      );
    });

    rerender({ ...initialProps, experienceTypeId });

    await waitFor(() => expect(result.current.error).toBeUndefined());
  });

  it('should return an error if localeCode is not defined, then when localCode is provided, the error should be undefined', async () => {
    const initialProps: useFetchBySlugArgs = {
      client: clientMock,
      mode: 'preview' as ExternalSDKMode,
      slug,
      experienceTypeId,
      // @ts-expect-error undefined is not allowed through types, but it can still happen if invoked from plain js
      localeCode: undefined,
    };

    const { result, rerender } = renderHook(useFetchBySlug, { initialProps });

    await waitFor(() => {
      expect(result.current.error?.message).toBe(
        'Failed to fetch experience entities. Required "locale" parameter was not provided'
      );
      expect(result.current.isLoading).toBe(false);
    });

    rerender({ ...initialProps, localeCode });

    await waitFor(() => expect(result.current.error).toBeUndefined());
  });
});
