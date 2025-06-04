import md5 from 'md5';
import {
  transformAlignment,
  transformBackgroundImage,
  transformBorderStyle,
  transformFill,
  transformGridColumn,
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

/**
 * Turns a list of CSSProperties into a joined CSS string that can be
 * used for <style> tags. Per default it creates a minimized version.
 * For editor mode, use the `useWhitespaces` flag to create a more readable version.
 *
 * @param cssProperties list of CSS properties
 * @param useWhitespaces adds whitespaces and newlines between each rule
 * @returns a string of CSS rules
 */
export const stringifyCssProperties = (
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
  const generatedStyles = stringifyCssProperties(styles, true);
  const className = `cfstyles-${nodeId ? nodeId : md5(generatedStyles)}`;
  const styleRule = `.${className}{ ${generatedStyles} }`;

  return [className, styleRule];
};

/**
 * Takes plain design values and transforms them into CSS properties. Undefined values will
 * be filtered out.
 *
 * **Example Input**
 * ```
 * values = {
 *   cfVisibility: 'visible',
 *   cfMargin: '10px',
 *   cfFlexReverse: true,
 *   cfImageOptions: { objectFit: 'cover' },
 *   // ...
 * }
 * ```
 * **Example Output**
 * ```
 * cssProperties = {
 *   margin: '10px',
 *   flexDirection: 'row-reverse',
 *   objectFit: 'cover',
 *   // ...
 * }
 * ```
 */
export const buildCfStyles = (values: Partial<StyleProps>): CSSProperties => {
  const cssProperties = {
    boxSizing: 'border-box',
    margin: values.cfMargin,
    padding: values.cfPadding,
    backgroundColor: values.cfBackgroundColor,
    width: transformFill(values.cfWidth || values.cfImageOptions?.width),
    height: transformFill(values.cfHeight || values.cfImageOptions?.height),
    maxWidth: values.cfMaxWidth,
    ...transformGridColumn(values.cfColumnSpan),
    ...transformBorderStyle(values.cfBorder),
    borderRadius: values.cfBorderRadius,
    gap: values.cfGap,
    ...transformAlignment(
      values.cfHorizontalAlignment,
      values.cfVerticalAlignment,
      values.cfFlexDirection,
    ),
    flexDirection:
      values.cfFlexReverse && values.cfFlexDirection
        ? `${values.cfFlexDirection}-reverse`
        : values.cfFlexDirection,
    flexWrap: values.cfFlexWrap,
    ...transformBackgroundImage(values.cfBackgroundImageUrl, values.cfBackgroundImageOptions),
    fontSize: values.cfFontSize,
    fontWeight: values.cfTextBold ? 'bold' : values.cfFontWeight,
    fontStyle: values.cfTextItalic ? 'italic' : undefined,
    textDecoration: values.cfTextUnderline ? 'underline' : undefined,
    lineHeight: values.cfLineHeight,
    letterSpacing: values.cfLetterSpacing,
    color: values.cfTextColor,
    textAlign: values.cfTextAlign,
    textTransform: values.cfTextTransform,
    objectFit: values.cfImageOptions?.objectFit,
    objectPosition: values.cfImageOptions?.objectPosition,
  };
  const cssPropertiesWithoutUndefined = Object.fromEntries(
    Object.entries(cssProperties).filter(([, value]) => value !== undefined),
  );
  return cssPropertiesWithoutUndefined;
};

/**
 * **Only meant to be used in editor mode!**
 *
 * If the node is an empty structure component with a relative height (e.g. '100%'),
 * it might render with a zero height. In this case, add a min height of 80px to ensure
 * that child nodes can be added via drag & drop.
 */
export const addMinHeightForEmptyStructures = (
  cssProperties: CSSProperties,
  node: ComponentTreeNode,
) => {
  if (
    !node.children.length &&
    isStructureWithRelativeHeight(node.definitionId, cssProperties.height)
  ) {
    return {
      ...cssProperties,
      minHeight: EMPTY_CONTAINER_HEIGHT,
    };
  }
  return cssProperties;
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
