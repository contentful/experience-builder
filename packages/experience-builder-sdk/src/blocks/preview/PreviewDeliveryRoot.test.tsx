import React from 'react';
import { render } from '@testing-library/react';
import { EntityStore } from '@contentful/experiences-core';
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot';
import type { Experience } from '@contentful/experiences-core/types';
import { createExperienceEntry } from '../../../test/__fixtures__/composition';
import { assets, entries } from '../../../test/__fixtures__/entities';
import type { Entry } from 'contentful';
import { compatibleVersions } from '../../constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';

const locale = 'en-US';
const experienceEntry = createExperienceEntry({
  schemaVersion: '2023-09-28',
});

const entityStore = new EntityStore({
  experienceEntry: experienceEntry as unknown as Entry,
  entities: [...entries, ...assets],
  locale,
});

const experience: Experience<EntityStore> = {
  entityStore,
};

describe('PreviewDeliveryRoot', () => {
  afterEach(() => {
    resetComponentRegistry();
  });

  it('returns null if experience is not fetched', () => {
    const { container } = render(<PreviewDeliveryRoot locale={locale} experience={experience} />);

    expect(container.childElementCount).toBe(0);
  });

  describe('when the schema version is not compatible', () => {
    let consoleWarnSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });
    it('throws an error', () => {
      // @ts-expect-error testing an unsupported version
      const experienceEntryMock = createExperienceEntry({ schemaVersion: '2023-06-27' });

      const entityStore = new EntityStore({
        experienceEntry: experienceEntryMock as unknown as Entry,
        entities: [...entries, ...assets],
        locale,
      });

      const experience: Experience<EntityStore> = {
        entityStore,
      };

      const consoleWarnSpy = jest.spyOn(console, 'warn');

      render(<PreviewDeliveryRoot locale={locale} experience={experience} />);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `[experiences-sdk-react] Contentful experience schema version: ${entityStore.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`,
      );
    });
  });

  it('renders the composition block', () => {
    defineComponents([
      {
        component: () => <div data-test-id="component-1">Component 1</div>,
        definition: {
          id: 'component-1',
          name: 'Component 1',
          variables: {},
        },
      },
    ]);

    const { container, getByTestId } = render(
      <PreviewDeliveryRoot locale={locale} experience={experience} />,
    );

    expect(container.childElementCount).toBe(1);
    expect(getByTestId('component-1')).toBeInTheDocument();
  });
});
