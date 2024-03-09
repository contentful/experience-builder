import React from 'react';

import { render } from '@testing-library/react';

import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import type { CompositionNode, ExperienceEntry } from '@contentful/experiences-core/types';
import { CompositionBlock } from './CompositionBlock';
import type { Entry } from 'contentful';
import { compositionEntry } from '../../../test/__fixtures__/composition';
import {
  createAssemblyEntry,
  defaultAssemblyId,
  assemblyGeneratedVariableName,
} from '../../../test/__fixtures__/assembly';
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
    const mockCompositionComponentNode: CompositionNode = {
      definitionId: 'custom-component',
      variables: {
        text: { type: 'UnboundValue', key: 'value1' },
      },
      children: [],
    };

    // Render the component with the initial text
    render(
      <CompositionBlock
        node={mockCompositionComponentNode}
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
    const sectionNode: CompositionNode = {
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
    const containerNode: CompositionNode = {
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

  it('renders assembly node', () => {
    const unboundValueKey = 'some-unbound-value-key';
    const assemblyEntry = createAssemblyEntry({
      id: defaultAssemblyId,
      schemaVersion: '2023-09-28',
    });
    const experienceEntry = {
      ...compositionEntry,
      fields: {
        ...compositionEntry.fields,
        usedComponents: [assemblyEntry],
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

    const assemblyNode: CompositionNode = {
      definitionId: defaultAssemblyId,
      variables: {
        [assemblyGeneratedVariableName]: { type: 'UnboundValue', key: unboundValueKey },
      },
      children: [],
    };

    const { getByTestId, getByText } = render(
      <CompositionBlock
        node={assemblyNode}
        locale="en-US"
        entityStore={entityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(getByTestId('assembly')).toBeInTheDocument();
    expect(getByTestId('contentful-container')).toBeInTheDocument();
    expect(getByText('New year eve')).toBeInTheDocument();
  });
});
