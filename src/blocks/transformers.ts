import { CSSObject } from '@emotion/css'

export const transformFill = (value: string) => (value === 'fill' ? '100%' : value)
export const transformBorderStyle = (value?: string): CSSObject => {
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
