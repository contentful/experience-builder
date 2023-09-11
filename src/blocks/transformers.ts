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

  // Note, that these are NOT the only allowed values as per spec
  // FYI spec also accepts percentages and other keywords
  //  @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-position-y
  //  @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-position-x
  backgroundPositionX?: 'left' | 'center' | 'right'
  backgroundPositionY?: 'top' | 'center' | 'bottom'
}

export const transformBackgroundImage = (
  cfBackgroundImageUrl: string | null | undefined,
  cfBackgroundImageScaling?: StyleProps['cfBackgroundImageScaling'],
  cfBackgroundImageAlignmentHorizontal?: StyleProps['cfBackgroundImageAlignmentHorizontal'],
  cfBackgroundImageAlignmentVertical?: StyleProps['cfBackgroundImageAlignmentVertical']
): CSSPropertiesForBackground | undefined => {
  const matchBackgroundSize = (
    backgroundImageScaling?: StyleProps['cfBackgroundImageScaling']
  ): 'cover' | 'contain' | undefined => {
    if ('fill' === backgroundImageScaling) return 'cover'
    if ('fit' === backgroundImageScaling) return 'contain'
    return undefined
  }

  if (!cfBackgroundImageUrl) {
    return undefined
  }

  return {
    backgroundImage: `url(${cfBackgroundImageUrl})`,
    backgroundRepeat: cfBackgroundImageScaling === 'tile' ? 'repeat' : 'no-repeat',
    backgroundPositionX: cfBackgroundImageAlignmentHorizontal,
    backgroundPositionY: cfBackgroundImageAlignmentVertical,
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
