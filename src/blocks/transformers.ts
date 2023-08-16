import { StyleProps } from '../types'

export const transformFill = (value: string) => (value === 'fill' ? '100%' : value)
export const transformBorderStyle = (value?: string): Record<string, string> => {
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
  horizontalAlignment: string,
  verticalAlignment: string,
  flexDirection = 'row'
) =>
  flexDirection === 'row'
    ? {
        alignItems: `${horizontalAlignment}`,
        justifyContent: `safe ${verticalAlignment}`,
      }
    : {
        alignItems: `${verticalAlignment}`,
        justifyContent: `safe ${horizontalAlignment}`,
      }

type CssPropertiesForBackground =
  | {
      backgroundImage: string
      backgroundRepeat: 'repeat' | 'no-repeat'
      backgroundPosition: 'left' | 'right' | 'top' | 'bottom'
      backgroundSize?: 'cover' | 'contain'
    }
  | undefined

export const transformBackgroundImage = (
  backgroundImageUrl: string | null | undefined,
  backgroundImageScaling: StyleProps['backgroundImageScaling'],
  backgroundImageAlignment: StyleProps['backgroundImageAlignment']
): CssPropertiesForBackground => {
  const matchBackgroundSize = (
    backgroundImageScaling: StyleProps['backgroundImageScaling']
  ): 'cover' | 'contain' | undefined => {
    if ('fill' === backgroundImageScaling) return 'cover'
    if ('fit' === backgroundImageScaling) return 'contain'
    return undefined
  }

  if (!backgroundImageUrl) {
    return undefined
  }

  return {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundRepeat: backgroundImageScaling === 'tile' ? 'repeat' : 'no-repeat',
    backgroundPosition: backgroundImageAlignment,
    backgroundSize: matchBackgroundSize(backgroundImageScaling),
  }
}
