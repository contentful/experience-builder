import React from 'react';

import { render } from '@testing-library/react';

import { CONTENTFUL_COMPONENTS } from '@contentful/experience-builder-core/constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import type { CompositionNode, ExperienceEntry } from '@contentful/experience-builder-core/types';
import { CompositionBlock } from './CompositionBlock';
import type { Entry } from 'contentful';
import { compositionEntry } from '../../../test/__fixtures__/composition';
import {
  createAssemblyEntry,
  defaultAssemblyId,
  assemblyGeneratedVariableName,
} from '../../../test/__fixtures__/assembly';
import { EntityStore } from '@contentful/experience-builder-core';
import { assets, entries } from '../../../test/__fixtures__/entities';

const TestComponent: React.FC<{ text: string }> = (props) => {
  return <div {...props}>{props.text}</div>;
};

describe('CompositionBlock', () => {
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
        dataSource={{}}
        locale="en-US"
        breakpoints={[]}
        entityStore={undefined}
        usedComponents={[]}
        unboundValues={{
          value1: { value: 'unboundValue1' },
          value2: { value: 1 },
        }}
        resolveDesignValue={jest.fn()}
      />
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
        dataSource={{}}
        locale="en-US"
        breakpoints={[]}
        entityStore={undefined}
        usedComponents={[]}
        unboundValues={{}}
        resolveDesignValue={jest.fn()}
      />
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
        dataSource={{}}
        locale="en-US"
        breakpoints={[]}
        entityStore={undefined}
        usedComponents={[]}
        unboundValues={{}}
        resolveDesignValue={jest.fn()}
      />
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
        dataSource={{}}
        locale="en-US"
        breakpoints={[]}
        entityStore={entityStore}
        usedComponents={[assemblyEntry] as ExperienceEntry[]}
        unboundValues={experienceEntry.fields.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    );

    expect(getByTestId('assembly')).toBeInTheDocument();
    expect(getByTestId('contentful-container')).toBeInTheDocument();
    expect(getByText('New year eve')).toBeInTheDocument();
  });
});
