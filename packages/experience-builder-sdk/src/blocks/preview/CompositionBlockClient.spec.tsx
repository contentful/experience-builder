import React from 'react';

import { render } from '@testing-library/react';

import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import type { ComponentTreeNode, ExperienceEntry } from '@contentful/experiences-core/types';
import { CompositionBlockClient } from './CompositionBlockClient';
import type { Entry } from 'contentful';
import { experienceEntry } from '../../../test/__fixtures__/composition';
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

describe('CompositionBlockClient', () => {
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
      <CompositionBlockClient
        node={mockExperienceTreeNode}
        locale="en-US"
        // entityStore={
        //   {
        //     ...emptyEntityStore,
        //     unboundValues: {
        //       value1: { value: 'unboundValue1' },
        //       value2: { value: 1 },
        //     },
        //   } as unknown as EntityStore
        // }
      />,
    );
  });

  it('renders section node', () => {
    const sectionNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.section.id,
      variables: {},
      children: [],
    };

    const { getByTestId } = render(<CompositionBlockClient node={sectionNode} locale="en-US" />);

    expect(getByTestId('contentful-container')).toBeInTheDocument();
  });

  it('renders container node', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };

    const { getByTestId } = render(<CompositionBlockClient node={containerNode} locale="en-US" />);

    expect(getByTestId('contentful-container')).toBeInTheDocument();
  });

  it('renders assembly node', () => {
    const unboundValueKey = 'some-unbound-value-key';
    const assemblyEntry = createAssemblyEntry({
      id: defaultAssemblyId,
      schemaVersion: '2023-09-28',
    });
    const updatedExperienceEntry = {
      ...experienceEntry,
      fields: {
        ...experienceEntry.fields,
        usedComponents: [assemblyEntry],
        unboundValues: {
          [unboundValueKey]: {
            value: 'New year eve',
          },
        },
      },
    } as ExperienceEntry;

    const entityStore = new EntityStore({
      experienceEntry: updatedExperienceEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const assemblyNode: ComponentTreeNode = {
      definitionId: defaultAssemblyId,
      variables: {
        [assemblyGeneratedVariableName]: { type: 'UnboundValue', key: unboundValueKey },
      },
      children: [],
    };

    const { getByTestId, getByText } = render(
      <CompositionBlockClient node={assemblyNode} locale="en-US" />,
    );

    expect(getByTestId('assembly')).toBeInTheDocument();
    expect(getByTestId('contentful-container')).toBeInTheDocument();
    expect(getByText('New year eve')).toBeInTheDocument();
  });
});
