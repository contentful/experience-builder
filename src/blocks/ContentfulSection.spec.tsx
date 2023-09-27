import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { ContentfulSection } from './ContentfulSection'
import { CompositionComponentNode } from '../types'
import { CONTENTFUL_SECTION_ID } from '../constants'

describe('ContentfulSection', () => {
  describe('when in editor mode', () => {
    const node = {
      type: 'block',
      data: {
        id: 'test-node-id',
        blockId: CONTENTFUL_SECTION_ID,
      },
    } as CompositionComponentNode

    it('should render a section', () => {
      const onMouseDown = jest.fn()

      render(
        <ContentfulSection
          editorMode={true}
          node={node}
          onMouseDown={onMouseDown}></ContentfulSection>
      )

      const section = document.getElementById('ContentfulSection') as HTMLDivElement | null

      expect(section).toBeDefined()
      expect(section?.tagName).toBe('DIV')
      expect(section?.className).toBe('defaultStyles')
      expect(section?.dataset.cfNodeId).toBe(node.data.id)
      expect(section?.dataset.cfNodeBlockId).toBe(node.data.blockId)
      expect(section?.dataset.cfNodeBlockType).toBe(node.type)

      fireEvent.mouseDown(section as HTMLDivElement)
      expect(onMouseDown).toHaveBeenCalled()
    })

    it('should allow to pass a custom class name', () => {
      const onMouseDown = jest.fn()

      render(
        <ContentfulSection
          editorMode={true}
          node={node}
          className="custom-test-class-name"
          onMouseDown={onMouseDown}></ContentfulSection>
      )

      const section = document.getElementById('ContentfulSection') as HTMLDivElement | null

      expect(section).toBeDefined()
      expect(section?.className).toBe('custom-test-class-name defaultStyles')
    })

    it('should render an anchor if hyperlink prop is provided', () => {
      const onMouseDown = jest.fn()

      render(
        <ContentfulSection
          editorMode={true}
          node={node}
          cfHyperlink="https://contentful.com"
          onMouseDown={onMouseDown}></ContentfulSection>
      )

      const section = document.getElementById('ContentfulSection') as HTMLAnchorElement | null

      expect(section?.tagName).toBe('A')
      expect(section).toBeDefined()
      expect(section?.className).toBe('defaultStyles cf-section-link')
      expect(section?.dataset.cfNodeId).toBe(node.data.id)
      expect(section?.dataset.cfNodeBlockId).toBe(node.data.blockId)
      expect(section?.dataset.cfNodeBlockType).toBe(node.type)
      expect(section?.href).toBe('https://contentful.com/')
    })

    it('supports child components', () => {
      const onMouseDown = jest.fn()

      const { getByTestId } = render(
        <ContentfulSection editorMode={true} node={node} onMouseDown={onMouseDown}>
          <h1 data-test-id="child1">Hello world!</h1>
          <button data-test-id="child2">Button</button>
        </ContentfulSection>
      )

      const section = document.getElementById('ContentfulSection') as HTMLDivElement | null

      expect(section).toBeDefined()
      expect(getByTestId('child1')).toBeDefined()
      expect(getByTestId('child1').parentElement).toBe(section)
      expect(getByTestId('child2')).toBeDefined()
      expect(getByTestId('child2').parentElement).toBe(section)
    })
  })

  describe('when NOT in editor mode', () => {
    it('should render a section', () => {
      render(<ContentfulSection editorMode={false}></ContentfulSection>)

      const section = document.getElementById('ContentfulSection') as HTMLDivElement | null

      expect(section).toBeDefined()
      expect(section?.tagName).toBe('DIV')
      expect(section?.className).toBe('defaultStyles')
    })

    it('should allow to pass a custom class name', () => {
      render(
        <ContentfulSection
          editorMode={false}
          className="custom-test-class-name"></ContentfulSection>
      )

      const section = document.getElementById('ContentfulSection') as HTMLDivElement | null

      expect(section).toBeDefined()
      expect(section?.className).toBe('custom-test-class-name defaultStyles')
    })

    it('should render an anchor if hyperlink prop is provided', () => {
      render(
        <ContentfulSection
          editorMode={false}
          cfHyperlink="https://contentful.com"></ContentfulSection>
      )

      const section = document.getElementById('ContentfulSection') as HTMLAnchorElement | null

      expect(section?.tagName).toBe('A')
      expect(section).toBeDefined()
      expect(section?.className).toBe('defaultStyles cf-section-link')
      expect(section?.href).toBe('https://contentful.com/')
    })

    it('supports child components', () => {
      const { getByTestId } = render(
        <ContentfulSection editorMode={false}>
          <h1 data-test-id="child1">Hello world!</h1>
          <button data-test-id="child2">Button</button>
        </ContentfulSection>
      )

      const section = document.getElementById('ContentfulSection') as HTMLDivElement | null

      expect(section).toBeDefined()
      expect(getByTestId('child1')).toBeDefined()
      expect(getByTestId('child1').parentElement).toBe(section)
      expect(getByTestId('child2')).toBeDefined()
      expect(getByTestId('child2').parentElement).toBe(section)
    })
  })
})
