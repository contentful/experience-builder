import React from 'react';

import { render, screen } from '@testing-library/react';

import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import type { ComponentTreeNode, ExperienceEntry } from '@contentful/experiences-core/types';
import { CompositionBlock } from './CompositionBlock';
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
    breakpoints: [{ id: 'desktop', query: '*' }],
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

    expect(screen.getByText('unboundValue1')).toBeInTheDocument();
  });

  it('renders section node', () => {
    const sectionNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.section.id,
      variables: {},
      children: [],
    };

    render(
      <CompositionBlock
        node={sectionNode}
        locale="en-US"
        entityStore={emptyEntityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(screen.getByTestId('contentful-container')).toBeInTheDocument();
  });

  it('renders container node', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };

    render(
      <CompositionBlock
        node={containerNode}
        locale="en-US"
        entityStore={emptyEntityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(screen.getByTestId('contentful-container')).toBeInTheDocument();
  });

  it('renders pattern node', () => {
    const unboundValueKey = 'some-unbound-value-key';
    const patternEntry = createAssemblyEntry();
    const updatedExperienceEntry = {
      ...experienceEntry,
      fields: {
        ...experienceEntry.fields,
        usedComponents: [patternEntry],
        unboundValues: {
          [unboundValueKey]: {
            value: 'New year eve',
          },
        },
      },
    } as ExperienceEntry;

    const entityStore = new EntityStore({
      experienceEntry: updatedExperienceEntry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const patternNode: ComponentTreeNode = {
      definitionId: defaultAssemblyId,
      variables: {
        [assemblyGeneratedVariableName]: { type: 'UnboundValue', key: unboundValueKey },
      },
      children: [],
    };

    render(
      <CompositionBlock
        node={patternNode}
        locale="en-US"
        entityStore={entityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(screen.getByTestId('assembly')).toBeInTheDocument();
    expect(screen.getByTestId('contentful-container')).toBeInTheDocument();
    expect(screen.getByText('New year eve')).toBeInTheDocument();
  });

  it('returns null when detecting a circular reference in the tree', () => {
    const updatedExperienceEntry = structuredClone(experienceEntry);
    const patternEntry = createAssemblyEntry();
    const nestedPatternEntry = createAssemblyEntry({ id: 'nested-pattern-id' });

    updatedExperienceEntry.fields.usedComponents = [patternEntry];
    patternEntry.fields.usedComponents = [nestedPatternEntry];
    nestedPatternEntry.fields.usedComponents = [patternEntry];

    const entityStore = new EntityStore({
      experienceEntry: updatedExperienceEntry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const patternNode: ComponentTreeNode = {
      definitionId: defaultAssemblyId,
      variables: {},
      children: [],
    };

    const nestedPatternNode: ComponentTreeNode = {
      definitionId: 'nested-pattern-id',
      variables: {},
      children: [],
    };

    patternEntry.fields.componentTree.children = [nestedPatternNode];
    nestedPatternEntry.fields.componentTree.children = [patternNode];

    render(
      <CompositionBlock
        node={patternNode}
        locale="en-US"
        entityStore={entityStore}
        resolveDesignValue={jest.fn()}
      />,
    );

    expect(screen.getAllByTestId('assembly')).toHaveLength(2);
  });

  describe('when SSR class is defined', () => {
    it('renders the custom component node', () => {
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

    it('renders section node', () => {
      const ssrClassName = 'cfstyles-4a59232681bf8491154b4c4ec81ea113';
      const sectionNode: ComponentTreeNode = {
        definitionId: CONTENTFUL_COMPONENTS.section.id,
        variables: {
          cfSsrClassName: { type: 'DesignValue', valuesByBreakpoint: { desktop: ssrClassName } },
        },
        children: [],
      };

      render(
        <CompositionBlock
          node={sectionNode}
          locale="en-US"
          entityStore={emptyEntityStore}
          resolveDesignValue={jest.fn()}
        />,
      );

      expect(screen.getByTestId('contentful-container')).toHaveClass(
        `${ssrClassName} contentful-container`,
      );
    });

    it('renders container node', () => {
      const ssrClassName = 'cfstyles-4a59232681bf8491154b4c4ec81ea113';
      const containerNode: ComponentTreeNode = {
        definitionId: CONTENTFUL_COMPONENTS.container.id,
        variables: {
          cfSsrClassName: { type: 'DesignValue', valuesByBreakpoint: { desktop: ssrClassName } },
        },
        children: [],
      };

      render(
        <CompositionBlock
          node={containerNode}
          locale="en-US"
          entityStore={emptyEntityStore}
          resolveDesignValue={jest.fn()}
        />,
      );

      expect(screen.getByTestId('contentful-container')).toHaveClass(
        `${ssrClassName} contentful-container`,
      );
    });

    it('renders nested components', () => {
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

      render(
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

      expect(screen.getByTestId('contentful-container')).toHaveClass(
        `${ssrClassName} contentful-container`,
      );
      expect(screen.getByTestId('contentful-container').firstChild).toHaveClass(ssrClassName);
    });

    it('renders pattern node', () => {
      const ssrClassName = 'cfstyles-3da2d7a8871905d8079c313b36bcf404';
      const unboundValueKey = 'some-unbound-value-key';
      const patternEntry = createAssemblyEntry();
      const updatedExperienceEntry = {
        ...experienceEntry,
        fields: {
          ...experienceEntry.fields,
          usedComponents: [patternEntry],
          unboundValues: {
            [unboundValueKey]: {
              value: 'New year eve',
            },
          },
        },
      } as ExperienceEntry;

      const entityStore = new EntityStore({
        experienceEntry: updatedExperienceEntry,
        entities: [...entries, ...assets],
        locale: 'en-US',
      });

      const patternNode: ComponentTreeNode = {
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

      render(
        <CompositionBlock
          node={patternNode}
          locale="en-US"
          entityStore={entityStore}
          resolveDesignValue={jest.fn()}
        />,
      );

      expect(screen.getByTestId('assembly')).toHaveClass(ssrClassName);
      expect(screen.getByTestId('contentful-container')).toBeInTheDocument();
      expect(screen.getByText('New year eve')).toBeInTheDocument();
    });

    it('renders nested patterns', () => {
      const ssrClassName = 'cfstyles-172c3e6faf64c49d7352080ec063acc8 contentful-container';
      const unboundValueKey = 'some-unbound-value-key';
      const unboundValueKey2 = 'some-unbound-value-key-2';

      const nestedPatternNode: ComponentTreeNode = {
        definitionId: 'nested-pattern-id',
        variables: {
          [assemblyGeneratedVariableName]: { type: 'UnboundValue', key: unboundValueKey },
          cfSsrClassName: {
            type: 'DesignValue',
            valuesByBreakpoint: { desktop: ssrClassName },
          },
        },
        children: [],
      };

      const patternNode: ComponentTreeNode = {
        definitionId: defaultAssemblyId,
        variables: {
          [assemblyGeneratedVariableName]: { type: 'UnboundValue', key: unboundValueKey2 },
          cfSsrClassName: {
            type: 'DesignValue',
            valuesByBreakpoint: { desktop: ssrClassName },
          },
        },
        children: [],
      };

      const nestedPatternEntry = createAssemblyEntry({
        id: 'nested-pattern-id',
      });
      const patternEntry = createAssemblyEntry({
        nestedPatterns: [{ entry: nestedPatternEntry, node: nestedPatternNode }],
      });

      const updatedExperienceEntry = {
        ...experienceEntry,
        fields: {
          ...experienceEntry.fields,
          usedComponents: [patternEntry],
          unboundValues: {
            [unboundValueKey]: {
              value: 'Parent pattern value',
            },
            [unboundValueKey2]: {
              value: 'Nested pattern value',
            },
          },
        },
      } as ExperienceEntry;

      const entityStore = new EntityStore({
        experienceEntry: updatedExperienceEntry,
        entities: [...entries, ...assets, patternEntry as any, nestedPatternEntry as any],
        locale: 'en-US',
      });

      render(
        <CompositionBlock
          node={patternNode}
          locale="en-US"
          entityStore={entityStore}
          resolveDesignValue={jest.fn()}
        />,
      );

      expect(screen.getAllByTestId('assembly')).toHaveLength(2);
      expect(screen.getAllByTestId('assembly')[0]).toHaveClass(ssrClassName);
      expect(screen.getAllByTestId('assembly')[1]).toHaveClass(ssrClassName);
      expect(screen.getAllByTestId('assembly')[1].firstChild).toHaveClass(ssrClassName);
      expect(screen.getByText('Parent pattern value')).toBeInTheDocument();
      expect(screen.getByText('Nested pattern value')).toBeInTheDocument();
    });
  });
});
