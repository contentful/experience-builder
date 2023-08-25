import { StyleProps, CSSProperties } from '../types'

export const transformFill = (value: string) => (value === 'fill' ? '100%' : value)
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
  cfHorizontalAlignment: string,
  cfVerticalAlignment: string,
  cfFlexDirection = 'row'
): CSSProperties =>
  cfFlexDirection === 'row'
    ? {
        alignItems: `${cfHorizontalAlignment}`,
        justifyContent: `safe ${cfVerticalAlignment}`,
      }
    : {
        alignItems: `${cfVerticalAlignment}`,
        justifyContent: `safe ${cfHorizontalAlignment}`,
      }

interface CSSPropertiesForBackground extends CSSProperties {
  backgroundImage: string
  backgroundRepeat: 'repeat' | 'no-repeat'
  backgroundPosition: 'left' | 'right' | 'top' | 'bottom'
  backgroundSize?: 'cover' | 'contain'
}

export const transformBackgroundImage = (
  cfBackgroundImageUrl: string | null | undefined,
  cfBackgroundImageScaling: StyleProps['cfBackgroundImageScaling'],
  cfBackgroundImageAlignment: StyleProps['cfBackgroundImageAlignment']
): CSSPropertiesForBackground | undefined => {
  const matchBackgroundSize = (
    backgroundImageScaling: StyleProps['cfBackgroundImageScaling']
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
    backgroundPosition: cfBackgroundImageAlignment,
    backgroundSize: matchBackgroundSize(cfBackgroundImageScaling),
  }
}
