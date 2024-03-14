import md5 from 'md5';
import {
  transformWidthSizing,
  transformAlignment,
  transformBackgroundImage,
  transformBorderStyle,
  transformFill,
  transformGridColumn,
} from './styleTransformers';
import {
  CSSProperties,
  StyleProps,
  CompositionVariableValueType,
  CompositionComponentNode,
} from '@/types';
import { isContentfulStructureComponent } from '../components';
import { EMPTY_CONTAINER_HEIGHT } from '../../constants';

const toCSSAttribute = (key: string) => {
  let val = key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

  // Remove the number from the end of the key to allow for overrides on style properties
  val = val.replace(/\d+$/, '');

  return val;
};

export const buildStyleTag = ({ styles, nodeId }: { styles: CSSProperties; nodeId?: string }) => {
  const stylesStr = Object.entries(styles)
    .filter(([, value]) => value !== undefined)
    .reduce(
      (acc, [key, value]) =>
        `${acc}
        ${toCSSAttribute(key)}: ${value};`,
      '',
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
  cfImage,
  cfBackgroundImage,
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
  cfColumnSpan,
}: Partial<StyleProps>): CSSProperties => {
  return {
    margin: cfMargin,
    padding: cfPadding,
    backgroundColor: cfBackgroundColor,
    width: transformWidthSizing({ value: cfWidth || cfImage?.width, cfMargin }),
    height: transformFill(cfHeight || cfImage?.height),
    maxWidth: cfMaxWidth,
    ...transformGridColumn(cfColumnSpan),
    ...transformBorderStyle(cfBorder),
    gap: cfGap,
    ...transformAlignment(cfHorizontalAlignment, cfVerticalAlignment, cfFlexDirection),
    flexDirection: cfFlexDirection,
    flexWrap: cfFlexWrap,
    ...transformBackgroundImage(cfBackgroundImage),
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
    objectFit: cfImage?.objectFit,
    objectPosition: cfImage?.objectPosition,
  };
};
/**
 * Container/section default behavior:
 * Default height => height: EMPTY_CONTAINER_HEIGHT (120px)
 * If a container component has children => height: 'fit-content'
 */
export const calculateNodeDefaultHeight = ({
  blockId,
  children,
  value,
}: {
  blockId?: string;
  children: CompositionComponentNode['children'];
  value: CompositionVariableValueType;
}) => {
  if (!blockId || !isContentfulStructureComponent(blockId) || value !== 'auto') {
    return value;
  }

  if (children.length) {
    return '100%';
  }

  return EMPTY_CONTAINER_HEIGHT;
};
