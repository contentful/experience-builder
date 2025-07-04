import { useFetchByBase } from './useFetchByBase';
import { EntityStore } from '@contentful/experiences-core';
import { renderHook, waitFor } from '@testing-library/react';
import { experienceEntry } from '../../test/__fixtures__/composition';
import { StudioCanvasMode } from '@contentful/experiences-core/constants';
import type { Experience } from '@contentful/experiences-core/types';

describe('useFetchByBase', () => {
  [StudioCanvasMode.EDITOR, StudioCanvasMode.READ_ONLY, StudioCanvasMode.NONE].forEach((mode) => {
    it(`for mode '${mode}' should be defined`, async () => {
      const { result } = renderHook(({ fetchMethod, mode }) => useFetchByBase(fetchMethod, mode), {
        initialProps: {
          fetchMethod: () => Promise.resolve(experienceEntry as Experience<EntityStore>),
          mode,
        },
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });
  });

  [StudioCanvasMode.EDITOR, StudioCanvasMode.READ_ONLY].forEach((mode) => {
    describe(`for supervised mode '${mode}'`, () => {
      it('should return isLoading=true on first render', async () => {
        const { result } = renderHook(
          ({ fetchMethod, mode }) => useFetchByBase(fetchMethod, mode),
          {
            initialProps: {
              fetchMethod: () => Promise.resolve(experienceEntry as Experience<EntityStore>),
              mode,
            },
          },
        );

        expect(result.current).toBeDefined();
        expect(result.current.isLoading).toBe(false); // should be false in supervised mode
      });

      it('should not call fetchMethod when in supervised mode', async () => {
        const fetchMethod = jest.fn().mockResolvedValue(experienceEntry as Experience<EntityStore>);

        const { result } = renderHook(
          ({ fetchMethod, mode }) => useFetchByBase(fetchMethod, mode),
          {
            initialProps: {
              fetchMethod,
              mode,
            },
          },
        );

        expect(fetchMethod).not.toHaveBeenCalled();

        await waitFor(() => {
          expect(result.current.experience).toBeUndefined();
          expect(result.current.isLoading).toBe(false);
          expect(result.current.error).toBeUndefined();
        });
      });
    });
  });

  [StudioCanvasMode.NONE].forEach((mode) => {
    describe(`for non-supervised mode '${mode}'`, () => {
      it('should return isLoading=false on first render', async () => {
        const { result } = renderHook(
          ({ fetchMethod, mode }) => useFetchByBase(fetchMethod, mode),
          {
            initialProps: {
              fetchMethod: () => Promise.resolve(experienceEntry as Experience<EntityStore>),
              mode,
            },
          },
        );

        await waitFor(() => {
          expect(result.current).toBeDefined();
          expect(result.current.isLoading).toBe(true); // should be true in non-supervised mode
        });
      });

      it('should call fetchMethod and set experience', async () => {
        const fetchMethod = jest.fn().mockResolvedValue(experienceEntry as Experience<EntityStore>);

        const { result } = renderHook(
          ({ fetchMethod, mode }) => useFetchByBase(fetchMethod, mode),
          {
            initialProps: {
              fetchMethod,
              mode,
            },
          },
        );

        expect(fetchMethod).toHaveBeenCalledTimes(1);

        await waitFor(() => {
          expect(result.current.experience).toEqual(experienceEntry);
          expect(result.current.isLoading).toBe(false);
          expect(result.current.error).toBeUndefined();
        });
      });

      it('should handle fetchMethod errors correctly', async () => {
        const expectedError = new Error('Failed to fetch');
        const fetchMethod = jest.fn().mockRejectedValue(expectedError);

        const { result } = renderHook(
          ({ fetchMethod, mode }) => useFetchByBase(fetchMethod, mode),
          {
            initialProps: {
              fetchMethod,
              mode,
            },
          },
        );

        expect(result.current.isLoading).toBe(true);
        expect(fetchMethod).toHaveBeenCalledTimes(1);

        await waitFor(() => {
          expect(result.current.error).toBe(expectedError);
          expect(result.current.experience).toBeUndefined();
          expect(result.current.isLoading).toBe(false);
        });
      });
    }); // describe
  });
});
