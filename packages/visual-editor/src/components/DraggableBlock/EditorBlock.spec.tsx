import React from 'react';
import { vi } from 'vitest';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { ComponentRegistration, ExperienceTree } from '@contentful/experiences-core/types';
import { addComponentRegistration } from '../../store/registries';
import { VisualEditorRoot } from '../VisualEditorRoot';
import { createExperience } from '@contentful/experiences-core';
import { experienceEntry } from '../../../test/__fixtures__/composition';
import { entries, assets } from '../../../test/__fixtures__/entities';
import { Entry } from 'contentful';
import { useTreeStore } from '../../store/tree';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

const componentRegistration1: ComponentRegistration = {
  definition: {
    id: 'component-1',
    name: 'Component 1',
    variables: {},
  },
  component: () => <div>Block 1</div>,
  options: {
    wrapComponent: false,
  },
};
const componentRegistration2: ComponentRegistration = {
  definition: {
    id: 'component-2',
    name: 'Component 2',
    variables: {},
  },
  component: () => <div>Block 2</div>,
  options: {
    wrapComponent: false,
  },
};

const tree: ExperienceTree = {
  root: {
    children: [
      {
        children: [],
        type: 'block',
        data: {
          breakpoints: [],
          dataSource: {},
          id: 'component-1',
          props: {},
          unboundValues: {},
          blockId: 'component-1',
        },
      },
      {
        children: [],
        type: 'block',
        data: {
          breakpoints: [],
          dataSource: {},
          id: 'component-2',
          props: {},
          unboundValues: {},
          blockId: 'component-2',
        },
      },
    ],
    type: 'root',
    data: {
      breakpoints: [],
      dataSource: {},
      id: 'root',
      props: {},
      unboundValues: {},
    },
  },
};

const experience = createExperience({
  experienceEntry: experienceEntry as unknown as Entry,
  referencedAssets: assets,
  referencedEntries: entries,
  locale: 'en-US',
});
let sendMessageSpy;
let message;
describe('EditorBlock', () => {
  beforeEach(() => {
    sendMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation((msg) => {
      if (msg.eventType === OUTGOING_EVENTS.ComponentSelected) {
        message = msg;
      }
    });
    const { result } = renderHook(() =>
      useTreeStore((state) => ({
        updateTree: state.updateTree,
      })),
    );
    addComponentRegistration(componentRegistration1);
    addComponentRegistration(componentRegistration2);
    act(() => result.current.updateTree(tree));
    vi.mock(
      '../../hooks/useInitializeEditor',
      vi.fn(() => ({ useInitializeEditor: () => true })),
    );
  });

  const renderComponent = () => render(<VisualEditorRoot experience={experience} />);

  it('should render EditorBlock with props', () => {
    renderComponent();
    const el = screen.getByText('Block 1');
    fireEvent.click(el);
    expect(message).toEqual({
      eventType: OUTGOING_EVENTS.ComponentSelected,
      payload: {
        assembly: undefined,
        nodeId: 'component-1',
      },
      source: 'customer-app',
    });

    screen.debug();
  });
});
