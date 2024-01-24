import md5 from 'md5';
import {
  transformWidthSizing,
  transformAlignment,
  transformBackgroundImage,
  transformBorderStyle,
  transformFill,
} from './transformers';
import { CSSProperties, StyleProps, CompositionVariableValueType } from '@/types';
import { isContentfulStructureComponent } from './components';

const toCSSAttribute = (key: string) => key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

export const buildStyleTag = ({ styles, nodeId }: { styles: CSSProperties; nodeId?: string }) => {
  const stylesStr = Object.entries(styles)
    .filter(([, value]) => value !== undefined)
    .reduce(
      (acc, [key, value]) =>
        `${acc}
        ${toCSSAttribute(key)}: ${value};`,
      ''
    );

  const className = `cfstyles-${nodeId ? nodeId : md5(stylesStr)}`;

  const styleRule = `.${className}{ ${stylesStr} }`;

  return [className, styleRule];
};

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
  cfFontSize,
  cfFontWeight,
  cfLineHeight,
  cfLetterSpacing,
  cfTextColor,
  cfTextAlign,
  cfTextTransform,
  cfTextBold,
  cfTextItalic,
  cfTextUnderline,
}: Partial<StyleProps>): CSSProperties => {
  return {
    margin: cfMargin,
    padding: cfPadding,
    backgroundColor: cfBackgroundColor,
    width: transformWidthSizing({ value: cfWidth, cfMargin }),
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
    fontSize: cfFontSize,
    fontWeight: cfTextBold ? 'bold' : cfFontWeight,
    fontStyle: cfTextItalic ? 'italic' : 'normal',
    lineHeight: cfLineHeight,
    letterSpacing: cfLetterSpacing,
    color: cfTextColor,
    textAlign: cfTextAlign,
    textTransform: cfTextTransform,
    textDecoration: cfTextUnderline ? 'underline' : 'none',
    boxSizing: 'border-box',
  };
};
/**
 * Container/section default behaviour:
 * Default height => height: '200px'
 * If a container component has children => height: 'fit-content'
 */
export const calculateNodeDefaultHeight = ({
  blockId,
  value,
}: {
  blockId?: string;
  value: CompositionVariableValueType;
}) => {
  if (!blockId || !isContentfulStructureComponent(blockId) || value !== 'auto') {
    return value;
  }

  return '100%';
};
