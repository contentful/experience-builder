import React from 'react';

import { render } from '@testing-library/react';

import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants';
import { defineComponents, resetComponentRegistry } from '../core/componentRegistry';
import { CompositionNode } from '../types';
import { CompositionBlock } from './CompositionBlock';

const TestComponent = (props: any) => {
  return <div {...props}>{props.text}</div>;
};

jest.mock('../core/constants', () => ({
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

    render(
      <CompositionBlock
        node={sectionNode}
        dataSource={{}}
        locale="en-US"
        breakpoints={[]}
        entityStore={undefined}
        unboundValues={{}}
        resolveDesignValue={jest.fn()}
      />
    );

    expect(document.getElementById('ContentfulContainer')).toBeDefined();
  });

  it('renders container node', () => {
    const containerNode: CompositionNode = {
      definitionId: CONTENTFUL_CONTAINER_ID,
      variables: {},
      children: [],
    };

    render(
      <CompositionBlock
        node={containerNode}
        dataSource={{}}
        locale="en-US"
        breakpoints={[]}
        entityStore={undefined}
        unboundValues={{}}
        resolveDesignValue={jest.fn()}
      />
    );

    expect(document.getElementById('ContentfulContainer')).toBeDefined();
  });
});
