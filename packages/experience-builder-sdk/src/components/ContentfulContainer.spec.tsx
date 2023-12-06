import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { CONTENTFUL_SECTION_ID } from '../constants';
import { CompositionComponentNode } from '../types';
import { ContentfulContainer } from './ContentfulContainer';

describe('ContentfulContainer', () => {
  describe('when in editor mode', () => {
    const node = {
      type: 'block',
      data: {
        id: 'test-node-id',
        blockId: CONTENTFUL_SECTION_ID,
      },
    } as CompositionComponentNode;

    it('should render a section', () => {
      const onMouseDown = jest.fn();

      render(<ContentfulContainer editorMode={true} node={node} renderDropZone={() => <></>} />);

      const section = document.getElementById('ContentfulContainer') as HTMLDivElement | null;

      expect(section).toBeDefined();
      expect(section?.tagName).toBe('DIV');
      expect(section?.className).toBe('defaultStyles');
      expect(section?.dataset.cfNodeId).toBe(node.data.id);
      expect(section?.dataset.cfNodeBlockId).toBe(node.data.blockId);
      expect(section?.dataset.cfNodeBlockType).toBe(node.type);

      fireEvent.mouseDown(section as HTMLDivElement);
      expect(onMouseDown).toHaveBeenCalled();
    });

    it('should allow to pass a custom class name', () => {
      render(
        <ContentfulContainer
          editorMode={true}
          node={node}
          className="custom-test-class-name"
          renderDropZone={() => <></>}
        />
      );

      const section = document.getElementById('ContentfulContainer') as HTMLDivElement | null;

      expect(section).toBeDefined();
      expect(section?.className).toBe('custom-test-class-name defaultStyles');
    });

    it('should render an anchor if hyperlink prop is provided', () => {
      render(
        <ContentfulContainer
          editorMode={true}
          node={node}
          cfHyperlink="https://contentful.com"
          renderDropZone={() => <></>}
        />
      );

      const section = document.getElementById('ContentfulContainer') as HTMLAnchorElement | null;

      expect(section?.tagName).toBe('A');
      expect(section).toBeDefined();
      expect(section?.className).toBe('defaultStyles cf-section-link');
      expect(section?.dataset.cfNodeId).toBe(node.data.id);
      expect(section?.dataset.cfNodeBlockId).toBe(node.data.blockId);
      expect(section?.dataset.cfNodeBlockType).toBe(node.type);
      expect(section?.href).toBe('https://contentful.com/');
    });

    it('supports child components', () => {
      const { getByTestId } = render(
        <ContentfulContainer editorMode={true} node={node} renderDropZone={() => <></>}>
          <h1 data-test-id="child1">Hello world!</h1>
          <button data-test-id="child2">Button</button>
        </ContentfulContainer>
      );

      const section = document.getElementById('ContentfulContainer') as HTMLDivElement | null;

      expect(section).toBeDefined();
      expect(getByTestId('child1')).toBeDefined();
      expect(getByTestId('child1').parentElement).toBe(section);
      expect(getByTestId('child2')).toBeDefined();
      expect(getByTestId('child2').parentElement).toBe(section);
    });
  });

  describe('when NOT in editor mode', () => {
    it('should render a section', () => {
      render(<ContentfulContainer editorMode={false} />);

      const section = document.getElementById('ContentfulContainer') as HTMLDivElement | null;

      expect(section).toBeDefined();
      expect(section?.tagName).toBe('DIV');
      expect(section?.className).toBe('defaultStyles');
    });

    it('should allow to pass a custom class name', () => {
      render(<ContentfulContainer editorMode={false} className="custom-test-class-name" />);

      const section = document.getElementById('ContentfulContainer') as HTMLDivElement | null;

      expect(section).toBeDefined();
      expect(section?.className).toBe('custom-test-class-name defaultStyles');
    });

    it('should render an anchor if hyperlink prop is provided', () => {
      render(<ContentfulContainer editorMode={false} cfHyperlink="https://contentful.com" />);

      const section = document.getElementById('ContentfulContainer') as HTMLAnchorElement | null;

      expect(section?.tagName).toBe('A');
      expect(section).toBeDefined();
      expect(section?.className).toBe('defaultStyles cf-section-link');
      expect(section?.href).toBe('https://contentful.com/');
    });

    it('supports child components', () => {
      const { getByTestId } = render(
        <ContentfulContainer editorMode={false}>
          <h1 data-test-id="child1">Hello world!</h1>
          <button data-test-id="child2">Button</button>
        </ContentfulContainer>
      );

      const section = document.getElementById('ContentfulContainer') as HTMLDivElement | null;

      expect(section).toBeDefined();
      expect(getByTestId('child1')).toBeDefined();
      expect(getByTestId('child1').parentElement).toBe(section);
      expect(getByTestId('child2')).toBeDefined();
      expect(getByTestId('child2').parentElement).toBe(section);
    });
  });
});
