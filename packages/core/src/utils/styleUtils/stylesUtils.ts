import md5 from 'md5';
import {
  transformAlignment,
  transformBackgroundImage,
  transformBorderStyle,
  transformFill,
  transformGridColumn,
  transformVisibility,
} from './styleTransformers';
import { isContentfulStructureComponent, isStructureWithRelativeHeight } from '../components';
import { EMPTY_CONTAINER_HEIGHT } from '../../constants';
import {
  CSSProperties,
  StyleProps,
  PrimitiveValue,
  ExperienceTreeNode,
  ComponentTreeNode,
} from '@/types';

export const toCSSAttribute = (key: string) => {
  let val = key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

  // Remove the number from the end of the key to allow for overrides on style properties
  val = val.replace(/\d+$/, '');

  return val;
};

export const createJoinedCSSRules = (
  cssProperties: CSSProperties,
  useWhitespaces: boolean = false,
) => {
  const rules = Object.entries(cssProperties)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) =>
      useWhitespaces ? `${toCSSAttribute(key)}: ${value};` : `${toCSSAttribute(key)}:${value};`,
    );
  return rules.join(useWhitespaces ? '\n' : '');
};

export const buildStyleTag = ({ styles, nodeId }: { styles: CSSProperties; nodeId?: string }) => {
  const generatedStyles = createJoinedCSSRules(styles);
  const className = `cfstyles-${nodeId ? nodeId : md5(generatedStyles)}`;
  const styleRule = `.${className}{ ${generatedStyles} }`;

  return [className, styleRule];
};

export const buildCfStyles = ({
  cfHorizontalAlignment,
  cfVerticalAlignment,
  cfFlexDirection,
  cfFlexReverse,
  cfFlexWrap,
  cfMargin,
  cfPadding,
  cfBackgroundColor,
  cfWidth,
  cfHeight,
  cfMaxWidth,
  cfBorder,
  cfBorderRadius,
  cfGap,
  cfBackgroundImageUrl,
  cfBackgroundImageOptions,
  cfFontSize,
  cfFontWeight,
  cfImageOptions,
  cfLineHeight,
  cfLetterSpacing,
  cfTextColor,
  cfTextAlign,
  cfTextTransform,
  cfTextBold,
  cfTextItalic,
  cfTextUnderline,
  cfColumnSpan,
  cfVisibility,
}: Partial<StyleProps>): CSSProperties => {
  const translatedRules = {
    boxSizing: 'border-box',
    ...transformVisibility(cfVisibility),
    margin: cfMargin,
    padding: cfPadding,
    backgroundColor: cfBackgroundColor,
    width: transformFill(cfWidth || cfImageOptions?.width),
    height: transformFill(cfHeight || cfImageOptions?.height),
    maxWidth: cfMaxWidth,
    ...transformGridColumn(cfColumnSpan),
    ...transformBorderStyle(cfBorder),
    borderRadius: cfBorderRadius,
    gap: cfGap,
    ...transformAlignment(cfHorizontalAlignment, cfVerticalAlignment, cfFlexDirection),
    flexDirection:
      cfFlexReverse && cfFlexDirection ? `${cfFlexDirection}-reverse` : cfFlexDirection,
    flexWrap: cfFlexWrap,
    ...transformBackgroundImage(cfBackgroundImageUrl, cfBackgroundImageOptions),
    fontSize: cfFontSize,
    fontWeight: cfTextBold ? 'bold' : cfFontWeight,
    fontStyle: cfTextItalic ? 'italic' : undefined,
    textDecoration: cfTextUnderline ? 'underline' : undefined,
    lineHeight: cfLineHeight,
    letterSpacing: cfLetterSpacing,
    color: cfTextColor,
    textAlign: cfTextAlign,
    textTransform: cfTextTransform,
    objectFit: cfImageOptions?.objectFit,
    objectPosition: cfImageOptions?.objectPosition,
  };
  const rulesWithoutUndefined = Object.fromEntries(
    Object.entries(translatedRules).filter(([, value]) => value !== undefined),
  );
  return rulesWithoutUndefined;
};

export const buildCfStylesWithSpecialCasing = (
  designProperties: Partial<StyleProps>,
  node: ComponentTreeNode,
) => {
  const cfStyles = buildCfStyles(designProperties);
  if (!node.children.length && isStructureWithRelativeHeight(node.definitionId, cfStyles.height)) {
    return {
      ...cfStyles,
      minHeight: EMPTY_CONTAINER_HEIGHT,
    };
  }
  return cfStyles;
};

/**
 * Container/section default behavior:
 * Default height => height: EMPTY_CONTAINER_HEIGHT
 * If a container component has children => height: 'fit-content'
 */
export const calculateNodeDefaultHeight = ({
  blockId,
  children,
  value,
}: {
  blockId?: string;
  children: ExperienceTreeNode['children'];
  value: PrimitiveValue;
}) => {
  if (!blockId || !isContentfulStructureComponent(blockId) || value !== 'auto') {
    return value;
  }

  if (children.length) {
    return '100%';
  }

  return EMPTY_CONTAINER_HEIGHT;
};
