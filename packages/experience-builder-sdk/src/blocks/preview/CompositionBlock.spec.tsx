import React from 'react';

import { render } from '@testing-library/react';

import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../../constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import { CompositionNode, ExperienceEntry } from '../../types';
import { CompositionBlock } from './CompositionBlock';
import type { Entry } from 'contentful';
import {
  compositionEntry,
  createDesignComponentEntry,
} from '../../../test/__fixtures__/composition';
import { EntityStore } from '../../core/preview/EntityStore';
import { assets, entries } from '../../../test/__fixtures__/entities';

const TestComponent = (props: any) => {
  return <div {...props}>{props.text}</div>;
};

jest.mock('../../constants', () => ({
  ...jest.requireActual('../../constants'),
  SDK_VERSION: 'test',
}));

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
      definitionId: CONTENTFUL_SECTION_ID,
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
      definitionId: CONTENTFUL_CONTAINER_ID,
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

  it('renders design component node', () => {
    const designComponentEntry = createDesignComponentEntry({
      id: 'design-component-id',
      schemaVersion: '2023-09-28',
    });

    const entityStore = new EntityStore({
      experienceEntry: {
        ...compositionEntry,
        fields: {
          ...compositionEntry.fields,
          usedComponents: [designComponentEntry],
        },
      } as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const designComponentNode: CompositionNode = {
      definitionId: 'design-component-id',
      variables: {},
      children: [],
    };

    const { getByTestId, getByText } = render(
      <CompositionBlock
        node={designComponentNode}
        dataSource={{}}
        locale="en-US"
        breakpoints={[]}
        entityStore={entityStore}
        usedComponents={[designComponentEntry] as ExperienceEntry[]}
        unboundValues={{}}
        resolveDesignValue={jest.fn()}
      />
    );

    expect(getByTestId('design-component')).toBeInTheDocument();
    expect(getByTestId('contentful-container')).toBeInTheDocument();
    expect(getByText('custom component title')).toBeInTheDocument();
  });
});
