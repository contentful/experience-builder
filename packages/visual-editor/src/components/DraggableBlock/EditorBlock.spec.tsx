import React, { act } from 'react';
import { vi } from 'vitest';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { addComponentRegistration } from '../../store/registries';
import { VisualEditorRoot } from '../VisualEditorRoot';
import { createExperience } from '@contentful/experiences-core';
import { experienceEntry, tree, componentRegistrations } from '../../../test/__fixtures__';
import { Entry } from 'contentful';
import { useTreeStore } from '../../store/tree';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

console.log('experienceEntry', experienceEntry);

const experience = createExperience({
  experienceEntry: experienceEntry as unknown as Entry,
  referencedAssets: [],
  referencedEntries: [],
  locale: 'en-US',
});
vi.mock(
  '../../hooks/useInitializeEditor',
  vi.fn(() => ({ useInitializeEditor: () => true })),
);
describe('VisualEditorRoot', () => {
  it('should render the editor', () => {
    addComponentRegistration(componentRegistrations[0]);
    addComponentRegistration(componentRegistrations[1]);

    const { result } = renderHook(() =>
      useTreeStore((state) => ({
        updateTree: state.updateTree,
      })),
    );
    act(() => result.current.updateTree(tree));

    render(<VisualEditorRoot experience={experience} />);
    screen.debug();
    const el1 = screen.getByText('Block 1');
    fireEvent.click(el1);

    addComponentRegistration(componentRegistrations[0]);
    addComponentRegistration(componentRegistrations[1]);

    const result2 = renderHook(() =>
      useTreeStore((state) => ({
        updateTree: state.updateTree,
      })),
    );
    act(() => result2.result.current.updateTree(tree));

    render(<VisualEditorRoot experience={experience} />);
    screen.debug();
    const el2 = screen.getByText('Block 2');
    fireEvent.click(el2);
  });
});
