import isString from 'lodash.isstring'
import {
  StyleProps,
  CSSProperties,
  ComponentDefinitionVariable,
  CompositionVariableValueType,
} from '../types'
import { BLOCKS, Document as RichTextDocument } from '@contentful/rich-text-types'

export const transformFill = (value?: string) => (value === 'fill' ? '100%' : value)
export const transformBorderStyle = (value?: string): CSSProperties => {
  if (!value) return {}
  const parts = value.split(' ')
  // Just accept the passed value
  if (parts.length < 3) return { border: value }
  // Replace the second part always with `solid` and set the box sizing accordingly
  const [borderSize, borderPlacement, ...borderColorParts] = parts
  const borderColor = borderColorParts.join(' ')
  return {
    border: `${borderSize} solid ${borderColor}`,
    boxSizing: borderPlacement === 'inside' ? 'border-box' : 'content-box',
  }
}

export const transformAlignment = (
  cfHorizontalAlignment?: string,
  cfVerticalAlignment?: string,
  cfFlexDirection = 'row'
): CSSProperties =>
  cfFlexDirection === 'row'
    ? {
        alignItems: cfHorizontalAlignment,
        justifyContent:
          cfVerticalAlignment === 'center' ? `safe ${cfVerticalAlignment}` : cfVerticalAlignment,
      }
    : {
        alignItems: cfVerticalAlignment,
        justifyContent:
          cfHorizontalAlignment === 'center'
            ? `safe ${cfHorizontalAlignment}`
            : cfHorizontalAlignment,
      }

interface CSSPropertiesForBackground extends CSSProperties {
  backgroundImage: string
  backgroundRepeat: 'repeat' | 'no-repeat'
  backgroundSize?: 'cover' | 'contain'

  backgroundPosition?:
    | 'left top'
    | 'left center'
    | 'left bottom'
    | 'right top'
    | 'right center'
    | 'right bottom'
    | 'center top'
    | 'center center'
    | 'center bottom'
}

export const transformBackgroundImage = (
  cfBackgroundImageUrl: string | null | undefined,
  cfBackgroundImageScaling?: StyleProps['cfBackgroundImageScaling'],
  cfBackgroundImageAlignment?: StyleProps['cfBackgroundImageAlignment']
): CSSPropertiesForBackground | undefined => {
  const matchBackgroundSize = (
    backgroundImageScaling?: StyleProps['cfBackgroundImageScaling']
  ): 'cover' | 'contain' | undefined => {
    if ('fill' === backgroundImageScaling) return 'cover'
    if ('fit' === backgroundImageScaling) return 'contain'
    return undefined
  }

  const matchBackgroundPosition = (
    cfBackgroundImageAlignment?: StyleProps['cfBackgroundImageAlignment']
  ): CSSPropertiesForBackground['backgroundPosition'] | undefined => {
    if (!cfBackgroundImageAlignment) {
      return undefined
    }
    if (!isString(cfBackgroundImageAlignment)) {
      return undefined
    }
    let [horiz, vert] = cfBackgroundImageAlignment.trim().split(/\s+/, 2)

    // Special case for handling single values
    // for backwards compatibility with single values 'right','left', 'center', 'top','bottom'
    if (horiz && !vert) {
      const singleValue = horiz
      switch (singleValue) {
        case 'left':
          horiz = 'left'
          vert = 'center'
          break
        case 'right':
          horiz = 'right'
          vert = 'center'
          break
        case 'center':
          horiz = 'center'
          vert = 'center'
          break
        case 'top':
          horiz = 'center'
          vert = 'top'
          break
        case 'bottom':
          horiz = 'center'
          vert = 'bottom'
          break
        default:
        // just fall down to the normal validation logic for horiz and vert
      }
    }

    const isHorizValid = ['left', 'right', 'center'].includes(horiz)
    const isVertValid = ['top', 'bottom', 'center'].includes(vert)

    horiz = isHorizValid ? horiz : 'left'
    vert = isVertValid ? vert : 'top'

    return `${horiz} ${vert}` as CSSPropertiesForBackground['backgroundPosition']
  }

  if (!cfBackgroundImageUrl) {
    return undefined
  }

  return {
    backgroundImage: `url(${cfBackgroundImageUrl})`,
    backgroundRepeat: cfBackgroundImageScaling === 'tile' ? 'repeat' : 'no-repeat',
    backgroundPosition: matchBackgroundPosition(cfBackgroundImageAlignment),
    backgroundSize: matchBackgroundSize(cfBackgroundImageScaling),
  }
}

export const transformContentValue = (
  value: CompositionVariableValueType,
  variableDefinition: ComponentDefinitionVariable
) => {
  if (variableDefinition.type === 'RichText') {
    return transformRichText(value)
  }
  return value
}

export const transformRichText = (
  value: CompositionVariableValueType
): RichTextDocument | undefined => {
  if (typeof value === 'string') {
    return {
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              data: {},
              nodeType: 'text',
              value: value,
              marks: [],
            },
          ],
        },
      ],
      nodeType: BLOCKS.DOCUMENT,
    }
  }
  if (typeof value === 'object' && value.nodeType === BLOCKS.DOCUMENT) {
    return value as RichTextDocument
  }
  return undefined
}
