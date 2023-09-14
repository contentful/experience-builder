import { CSSProperties, StyleProps } from '../types'
//@ts-expect-error no types available
import md5 from 'md5'
import {
  transformAlignment,
  transformBackgroundImage,
  transformBorderStyle,
  transformFill,
} from '../blocks/transformers'

const toCSSAttribute = (key: string) => key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

export const buildStyleTag = ({ styles, nodeId }: { styles: CSSProperties; nodeId?: string }) => {
  const stylesStr = Object.entries(styles)
    .filter(([, value]) => value !== undefined)
    .reduce(
      (acc, [key, value]) =>
        `${acc}
        ${toCSSAttribute(key)}: ${value};`,
      ''
    )

  const className = `cfstyles-${nodeId ? nodeId : md5(stylesStr)}`

  const styleRule = `.${className}{ ${stylesStr} }`

  return [className, styleRule]
}

export const buildCfStyles = ({
  cfHorizontalAlignment,
  cfVerticalAlignment,
  cfFlexDirection,
  cfFlexWrap,
  cfMargin,
  cfPadding,
  cfBackgroundColor,
  cfWidth,
  cfHeight,
  cfMaxWidth,
  cfBorder,
  cfGap,
  cfBackgroundImageUrl,
  cfBackgroundImageAlignment,
  cfBackgroundImageScaling,
}: Partial<StyleProps>): CSSProperties => {
  return {
    margin: cfMargin,
    padding: cfPadding,
    backgroundColor: cfBackgroundColor,
    width: transformFill(cfWidth),
    height: transformFill(cfHeight),
    maxWidth: cfMaxWidth,
    ...transformBorderStyle(cfBorder),
    gap: cfGap,
    ...transformAlignment(cfHorizontalAlignment, cfVerticalAlignment, cfFlexDirection),
    flexDirection: cfFlexDirection,
    flexWrap: cfFlexWrap,
    ...transformBackgroundImage(
      cfBackgroundImageUrl,
      cfBackgroundImageScaling,
      cfBackgroundImageAlignment
    ),
  }
}
