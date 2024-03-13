import React from 'react';

import { render } from '@testing-library/react';

import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import type { ComponentTreeNode, ExperienceEntry } from '@contentful/experiences-core/types';
import { CompositionBlock } from './CompositionBlock';
import type { Entry } from 'contentful';
import { compositionEntry } from '../../../test/__fixtures__/composition';
import {
  createPatternEntry,
  defaultPatternId,
  patternGeneratedVariableName,
} from '../../../test/__fixtures__/pattern';
import { EntityStore } from '@contentful/experiences-core';
import { assets, entries } from '../../../test/__fixtures__/entities';

const TestComponent: React.FC<{ text: string }> = (props) => {
  return <div {...props}>{props.text}</div>;
};

describe('CompositionBlock', () => {
  const emptyEntityStore = {
    breakpoints: [],
    dataSource: {},
    unboundValues: {},
    usedComponents: [],
  } as unknown as EntityStore;

  beforeEach(() => {
    defineComponents([
      {
        component: TestComponent,
        definition: {
          id: 'custom-component',
          name: 'section',
          variables: {
            text: {
              displayName: 'Text',
              type: 'Text',
              defaultValue: 'Subheading',
            },
          },
        },
      },
    ]);
  });

  afterEach(() => {
    resetComponentRegistry();
  });

  it('renders the custom component node', () => {
    const mockExperienceTreeNode: ComponentTreeNode = {
      definitionId: 'custom-component',
      variables: {
        text: { type: 'UnboundValue', key: 'value1' },
      },
      children: [],
    };

    // Render the component with the initial text
    render(
      <CompositionBlock
        node={mockExperienceTreeNode}
        locale="en-US"
        entityStore={
          {
            ...emptyEntityStore,
            unboundValues: {
              value1: { value: 'unboundValue1' },
              value2: { value: 1 },
            },
          } as unknown as EntityStore
        }
        resolveDesignValue={jest.fn()}
      />,
    );
  });

  it('renders section node', () => {
    const sectionNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.section.id,
      variables: {},
      children: [],
    };

    const { getByTestId } = render(
      <CompositionBlock
        node={sectionNode}
        locale="en-US"
        entityStore={emptyEntityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(getByTestId('contentful-container')).toBeInTheDocument();
  });

  it('renders container node', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };

    const { getByTestId } = render(
      <CompositionBlock
        node={containerNode}
        locale="en-US"
        entityStore={emptyEntityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(getByTestId('contentful-container')).toBeInTheDocument();
  });

  it('renders pattern node', () => {
    const unboundValueKey = 'some-unbound-value-key';
    const patternEntry = createPatternEntry({
      id: defaultPatternId,
      schemaVersion: '2023-09-28',
    });
    const experienceEntry = {
      ...compositionEntry,
      fields: {
        ...compositionEntry.fields,
        usedComponents: [patternEntry],
        unboundValues: {
          [unboundValueKey]: {
            value: 'New year eve',
          },
        },
      },
    } as ExperienceEntry;

    const entityStore = new EntityStore({
      experienceEntry: experienceEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const patternNode: ComponentTreeNode = {
      definitionId: defaultPatternId,
      variables: {
        [patternGeneratedVariableName]: { type: 'UnboundValue', key: unboundValueKey },
      },
      children: [],
    };

    const { getByTestId, getByText } = render(
      <CompositionBlock
        node={patternNode}
        locale="en-US"
        entityStore={entityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(getByTestId('pattern')).toBeInTheDocument();
    expect(getByTestId('contentful-container')).toBeInTheDocument();
    expect(getByText('New year eve')).toBeInTheDocument();
  });
});
