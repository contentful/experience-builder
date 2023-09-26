import React from 'react';
import { fireEvent, render } from "@testing-library/react";
import { ContentfulSectionAsHyperlink, ContentfulSectionProps } from "./ContentfulSectionAsHyperlink";
import { CONTENTFUL_SECTION_ID } from '../constants';
import { CompositionComponentNode } from '../types';

describe('ContentfulSectionAsHyperlink', () => {
  describe('when NOT in editor mode', () => {
    it('should render anchor tag without editor mode specific props', () => {
      render(
        <ContentfulSectionAsHyperlink
          cfHyperlink="https://contentful.com"
          editorMode={false}
        >
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(hyperlink?.tagName).toBe('A');
      expect(hyperlink?.className).toBe('defaultStyles cf-section-link');
      expect(hyperlink?.href).toBe('https://contentful.com/');
    })

    it('should support custom className', () => {
      render(
        <ContentfulSectionAsHyperlink
          cfHyperlink="https://contentful.com"
          className='test-class-name'
          editorMode={false}
        >
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(hyperlink?.className).toBe('test-class-name defaultStyles cf-section-link');
      expect(hyperlink?.href).toBe('https://contentful.com/');
    })

    it('should support opening the url in a new tab', () => {
      render(
        <ContentfulSectionAsHyperlink
          cfHyperlink="https://contentful.com"
          cfOpenInNewTab={true}
          editorMode={false}
        >
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(hyperlink?.target).toBe('_blank');
      expect(hyperlink?.rel).toBe('noopener noreferrer');
    })

    it('supports child components', () => {
      const { getByTestId } = render(
        <ContentfulSectionAsHyperlink
          cfHyperlink="https://contentful.com"
          cfOpenInNewTab={true}
          editorMode={false}
        >
          <h1 data-test-id="child1">Hello world!</h1>
          <button data-test-id="child2">Button!</button>
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(getByTestId('child1')).toBeDefined();
      expect(getByTestId('child1').parentElement).toBe(hyperlink);
      expect(getByTestId('child2')).toBeDefined();
      expect(getByTestId('child2').parentElement).toBe(hyperlink);
      
    });
  })

  describe('when in editor mode', () => {
    const node = {
      type: 'block',
      data: {
        id: 'test-node-id',
        blockId: CONTENTFUL_SECTION_ID
      }
    } as CompositionComponentNode

    it('should render anchor tag with editor mode specific props', () => {
      const onMouseDown = jest.fn();
  
      render(
        <ContentfulSectionAsHyperlink
          cfHyperlink="https://contentful.com"
          onMouseDown={onMouseDown}
          node={node}
          editorMode={true}
        >
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(hyperlink?.tagName).toBe('A');
      expect(hyperlink?.className).toBe('defaultStyles cf-section-link');
      expect(hyperlink?.href).toBe('https://contentful.com/');
      expect(hyperlink?.dataset.cfNodeId).toBe(node.data.id);
      expect(hyperlink?.dataset.cfNodeBlockId).toBe(node.data.blockId);
      expect(hyperlink?.dataset.cfNodeBlockType).toBe(node.type);

      fireEvent.mouseDown(hyperlink as HTMLAnchorElement);

      expect(onMouseDown).toHaveBeenCalled();
    })

    it('should allow to pass a custom class name', () => {
      const onMouseDown = jest.fn();
  
      render(
        <ContentfulSectionAsHyperlink
          className="test-class-name"
          cfHyperlink="https://contentful.com"
          onMouseDown={onMouseDown}
          node={node}
          editorMode={true}
        >
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(hyperlink?.className).toBe('test-class-name defaultStyles cf-section-link');
      expect(hyperlink?.href).toBe('https://contentful.com/');
      expect(hyperlink?.dataset.cfNodeId).toBe(node.data.id);
      expect(hyperlink?.dataset.cfNodeBlockId).toBe(node.data.blockId);
      expect(hyperlink?.dataset.cfNodeBlockType).toBe(node.type);

      fireEvent.mouseDown(hyperlink as HTMLAnchorElement);

      expect(onMouseDown).toHaveBeenCalled();
    })

    it('should support an option to open the url in the new tab', () => {
      const onMouseDown = jest.fn();
  
      render(
        <ContentfulSectionAsHyperlink
          cfHyperlink="https://contentful.com"
          onMouseDown={onMouseDown}
          node={node}
          editorMode={true}
          cfOpenInNewTab={true}
        >
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(hyperlink?.target).toBe('_blank');
      expect(hyperlink?.rel).toBe('noopener noreferrer');
    })
  
    it('should intercept click event', () => {
      const onMouseDown = jest.fn();
  
      render(
        <ContentfulSectionAsHyperlink
          cfHyperlink="https://contentful.com"
          onMouseDown={onMouseDown}
          node={node}
          editorMode={true}
        >
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(hyperlink?.className).toBe('defaultStyles cf-section-link');
      expect(hyperlink?.href).toBe('https://contentful.com/');
      expect(hyperlink?.dataset.cfNodeId).toBe(node.data.id);
      expect(hyperlink?.dataset.cfNodeBlockId).toBe(node.data.blockId);
      expect(hyperlink?.dataset.cfNodeBlockType).toBe(node.type);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })

      const propagationSpy = jest.spyOn(clickEvent, 'stopPropagation');
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

      fireEvent(hyperlink as HTMLAnchorElement, clickEvent);

      expect(propagationSpy).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
    })

    it('supports child components', () => {
      const onMouseDown = jest.fn();
  
      const { getByTestId } = render(
        <ContentfulSectionAsHyperlink
          cfHyperlink="https://contentful.com"
          onMouseDown={onMouseDown}
          node={node}
          editorMode={true}
        >
          <h1 data-test-id="child1">Hello world!</h1>
          <button data-test-id="child2">Button</button>
        </ContentfulSectionAsHyperlink>
      );
  
      const hyperlink = document.getElementById('ContentfulSection') as HTMLAnchorElement | null;
  
      expect(hyperlink).toBeDefined();
      expect(getByTestId('child1')).toBeDefined();
      expect(getByTestId('child1').parentElement).toBe(hyperlink);
      expect(getByTestId('child2')).toBeDefined();
      expect(getByTestId('child2').parentElement).toBe(hyperlink);
      
    });
  })
});
