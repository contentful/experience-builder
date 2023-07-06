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
        justifyContent: `${verticalAlignment}`,
      }
    : {
        alignItems: `${verticalAlignment}`,
        justifyContent: `${horizontalAlignment}`,
      }
