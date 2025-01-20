import React from 'react';

import { render } from '@testing-library/react';

import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import type { ComponentTreeNode, ExperienceEntry } from '@contentful/experiences-core/types';
import { CompositionBlock } from './CompositionBlock';
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
    const { getByText } = render(
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

    expect(getByText('unboundValue1')).toBeInTheDocument();
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

  it('renders the custom component node with SSR class', () => {
    const ssrClassName = 'cfstyles-3da2d7a8871905d8079c313b36bcf404';
    const mockExperienceTreeNode: ComponentTreeNode = {
      definitionId: 'custom-component',
      variables: {
        text: { type: 'UnboundValue', key: 'value1' },
        cfSsrClassName: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: ssrClassName },
        },
      },
      children: [],
    };

    const { container } = render(
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

    expect(container.firstChild).toHaveClass(ssrClassName);
  });

  it('renders section node with SSR class', () => {
    const ssrClassName = 'cfstyles-4a59232681bf8491154b4c4ec81ea113';
    const sectionNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.section.id,
      variables: {
        cfSsrClassName: { type: 'DesignValue', valuesByBreakpoint: { desktop: ssrClassName } },
      },
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

    expect(getByTestId('contentful-container')).toHaveClass(`${ssrClassName} contentful-container`);
  });

  it('renders container node with SSR class', () => {
    const ssrClassName = 'cfstyles-4a59232681bf8491154b4c4ec81ea113';
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {
        cfSsrClassName: { type: 'DesignValue', valuesByBreakpoint: { desktop: ssrClassName } },
      },
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

    expect(getByTestId('contentful-container')).toHaveClass(`${ssrClassName} contentful-container`);
  });

  it('renders nested components with SSR class', () => {
    const ssrClassName = 'cfstyles-3da2d7a8871905d8079c313b36bcf404';
    const sectionNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.section.id,
      variables: {
        cfSsrClassName: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: ssrClassName },
        },
      },
      children: [
        {
          definitionId: 'custom-component',
          variables: {
            text: { type: 'UnboundValue', key: 'value1' },
            cfSsrClassName: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: ssrClassName },
            },
          },
          children: [],
        },
      ],
    };

    const { getByTestId } = render(
      <CompositionBlock
        node={sectionNode}
        locale="en-US"
        entityStore={
          {
            ...emptyEntityStore,
            unboundValues: {
              value1: { value: 'unboundValue1' },
            },
          } as unknown as EntityStore
        }
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(getByTestId('contentful-container')).toHaveClass(`${ssrClassName} contentful-container`);
    expect(getByTestId('contentful-container').firstChild).toHaveClass(ssrClassName);
  });

  it('renders assembly node with SSR class', () => {
    const ssrClassName = 'cfstyles-3da2d7a8871905d8079c313b36bcf404';
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
        cfSsrClassName: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: ssrClassName },
        },
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

    expect(getByTestId('assembly')).toHaveClass(ssrClassName);
    expect(getByTestId('contentful-container')).toBeInTheDocument();
    expect(getByText('New year eve')).toBeInTheDocument();
  });

  it('renders nested patterns with SSR class', () => {
    const ssrClassName = 'cfstyles-3da2d7a8871905d8079c313b36bcf404';
    const unboundValueKey = 'some-unbound-value-key';
    const assemblyEntry = createAssemblyEntry({
      id: defaultAssemblyId,
      schemaVersion: '2023-09-28',
    });
    const nestedAssemblyEntry = createAssemblyEntry({
      id: 'nested-assembly-id',
      schemaVersion: '2023-09-28',
    });
    const updatedExperienceEntry = {
      ...experienceEntry,
      fields: {
        ...experienceEntry.fields,
        usedComponents: [assemblyEntry, nestedAssemblyEntry],
        unboundValues: {
          [unboundValueKey]: {
            value: 'Nested pattern value',
          },
        },
      },
    } as ExperienceEntry;

    const entityStore = new EntityStore({
      experienceEntry: updatedExperienceEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const nestedAssemblyNode: ComponentTreeNode = {
      definitionId: 'nested-assembly-id',
      variables: {
        [assemblyGeneratedVariableName]: { type: 'UnboundValue', key: unboundValueKey },
        cfSsrClassName: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: ssrClassName },
        },
      },
      children: [],
    };

    const assemblyNode: ComponentTreeNode = {
      definitionId: defaultAssemblyId,
      variables: {
        [assemblyGeneratedVariableName]: { type: 'UnboundValue', key: unboundValueKey },
        cfSsrClassName: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: ssrClassName },
        },
      },
      children: [nestedAssemblyNode],
    };

    const { getByTestId, getByText } = render(
      <CompositionBlock
        node={assemblyNode}
        locale="en-US"
        entityStore={entityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(getByTestId('assembly')).toHaveClass(ssrClassName);
    expect(getByTestId('assembly').firstChild).toHaveClass(ssrClassName);
    expect(getByText('Nested pattern value')).toBeInTheDocument();
  });
});
