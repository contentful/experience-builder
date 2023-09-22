import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { CompositionComponentNode } from '../types'
import { calculateNodeDefaultHeight } from './stylesUtils'

jest.mock('../communication/sendMessage')

describe('calculateNodeDefaultHeight', () => {
  it('should return value when blockId is undefined', () => {
    const result = calculateNodeDefaultHeight({
      children: [],
      parentId: 'root',
      value: '400px',
    })

    expect(result).toBe('400px')
  })

	it('should return value when value is not "auto"', () => {
    const result = calculateNodeDefaultHeight({
      children: [],
      parentId: 'root',
      value: '456px',
    })

    expect(result).toBe('456px')
  })

	it('should return value if block is not a container', () => {
    const result = calculateNodeDefaultHeight({
			blockId: 'node-block-id',
      children: [],
      parentId: 'root',
      value: '567px',
    })

    expect(result).toBe('567px')
  })

  it('should return defaultValue of "200px" when container is on "root" and has no children', () => {
    const result = calculateNodeDefaultHeight({
      blockId: CONTENTFUL_SECTION_ID,
      children: [],
      parentId: 'root',
      value: 'auto',
    })

    expect(result).toBe('200px')
  })

	it('should return defaultValue of "200px" when container is on "root" and has only container children', () => {
		const childNode: CompositionComponentNode = {
      type: 'block',
      data: {
        id: 'node-1',
				blockId: CONTENTFUL_CONTAINER_ID,
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    }
    const result = calculateNodeDefaultHeight({
      blockId: CONTENTFUL_SECTION_ID,
      children: [childNode],
      parentId: 'root',
      value: 'auto',
    })

    expect(result).toBe('200px')
  })

  it('should return "fit-content" when container has a non-container child', () => {
    const childNode: CompositionComponentNode = {
      type: 'block',
      data: {
        id: 'block1',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    }

    const result = calculateNodeDefaultHeight({
      blockId: CONTENTFUL_CONTAINER_ID,
      children: [childNode],
      value: 'auto',
    })

    expect(result).toBe('fit-content')
  })

  it('should return "fill" if container is nested', () => {
    const childNode: CompositionComponentNode = {
      type: 'block',
      data: {
        id: 'node-1',
        blockId: CONTENTFUL_CONTAINER_ID,
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    }

    const result = calculateNodeDefaultHeight({
      blockId: CONTENTFUL_CONTAINER_ID,
      children: [childNode],
      value: 'auto',
    })

    expect(result).toBe('fill')
  })
})
