import { describe, it, expect, vi } from 'vitest';
import { createExperience } from '@contentful/experiences-core';
import type { Entry } from 'contentful';
import { getExperience } from '../src/getExperience';
import ExperiencePage from '../src/app/[locale]/[slug]/page';

vi.mock('@contentful/experiences-sdk-react', async () => {
  const { defineDesignTokens, detachExperienceStyles } =
    await import('@contentful/experiences-core');
  return { defineDesignTokens, detachExperienceStyles };
});
vi.mock('../src/getExperience', () => ({ getExperience: vi.fn() }));
vi.mock('../src/components/PageLayout', () => ({ default: () => null }));

describe('server-rendered experience styles', () => {
  it('resolves template design tokens before serializing the experience', async () => {
    const entry: Entry = {
      metadata: { tags: [] },
      sys: {
        id: 'test-experience',
        type: 'Entry',
        locale: 'en-US',
        revision: 1,
        publishedVersion: 1,
        createdAt: '2026-10-07T00:00:00Z',
        updatedAt: '2026-10-07T00:00:00Z',
        space: { sys: { id: 'test-space', type: 'Link', linkType: 'Space' } },
        environment: { sys: { id: 'master', type: 'Link', linkType: 'Environment' } },
        contentType: { sys: { id: 'experience', type: 'Link', linkType: 'ContentType' } },
      },
      fields: {
        title: 'Test experience',
        slug: 'home-page',
        dataSource: {},
        unboundValues: {},
        usedComponents: [],
        componentTree: {
          schemaVersion: '2023-09-28',
          breakpoints: [
            { id: 'desktop', query: '*', displayName: 'All sizes', previewSize: '100%' },
          ],
          children: [
            {
              id: 'token-component',
              definitionId: 'custom-component',
              children: [],
              variables: {
                cfPadding: { type: 'DesignValue', valuesByBreakpoint: { desktop: '${spacing.M}' } },
                cfWidth: {
                  type: 'DesignValue',
                  valuesByBreakpoint: { desktop: '${sizing.Layout}' },
                },
              },
            },
          ],
        },
      },
    };
    const experience = createExperience({
      experienceEntry: entry,
      referencedEntries: [],
      referencedAssets: [],
      locale: 'en-US',
    });
    vi.mocked(getExperience).mockResolvedValue({ experience });

    const page = await ExperiencePage({
      params: Promise.resolve({ locale: 'en-US', slug: 'home-page' }),
      searchParams: Promise.resolve({}),
    });
    const { stylesheet } = page.props;

    expect(stylesheet).toContain('padding:24px;');
    expect(stylesheet).toContain('width:960px;');
  });
});
