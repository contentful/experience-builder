import { isCfStyleAttribute, debug } from '@contentful/experiences-core';
import {
  BoundComponentPropertyTypes,
  BoundValue,
  Breakpoint,
  ComponentDefinition,
  ComponentDefinitionVariable,
  ComponentDefinitionVariableType,
  ComponentTreeNode,
  DesignValue,
  PrimitiveValue,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { convertResolvedDesignValuesToMediaQuery } from '../core/styles/convertResolvedDesignValuesToMediaQuery';
import { createStylesheetsForBuiltInStyles } from '../core/styles/createStylesheetsForBuiltInStyles';

// TODO: Test this for nested patterns as the name might be just a random hash without the actual name (needs to be validated).
/**
 * Checks if prop is a "siamese" prop. So far we have only one such prop: `cfBackgroundImageUrl`.
 * It is considered "siamese" because despite being a content variable, it always goes in pair
 * (is coupled) with the `cfBackgroundImageOptions` design variable. Without presence of the
 * `cfBackgroundImageUrl` the `cfBackgroundImageOptions` is useless (and is not going to be
 * rendered by the styleTransformers.ts#transformBackgroundImageUrl()).
 *
 * Because of this coupling, we need to create an "ephemeral" cfBackgroundImageUrl style(!) prop.
 */
const isSpecialCaseCssProp = (propName: string) => {
  return propName === 'cfBackgroundImageUrl' || propName.startsWith('cfBackgroundImageUrl_');
};

/**
 * The previous logic of prop mapping was too complex and mixed different ues cases together.
 * In this function, I aim to simplify the logic by focusing on the following specific cases FOR PREVIEW/DELIVERY MODES
 * 1) Any non `DesignValue` props should be resolved and returned as is
 * 2) Some exceptions like `cfImageAsset` and `cfBackgroundImageUrl` (BoundValue) should be handled separately
 * and be resolved for the default breakpoint only (cause we don't allow binding per breakpoint anyway)
 * 3) Those DesignValue props which can be converted to CSS should be grouped and resolved into a CSS media query
 * for each breakpoint
 * 4) Those DesignValue props which can NOT be converted to CSS (custom design props) should be resolved dynamically
 * for each breakpoint
 */
type ResolveBoundValueType = (data: {
  propertyName: string;
  dataType: ComponentDefinitionVariableType;
  binding: BoundValue;
}) => BoundComponentPropertyTypes;

export const parseComponentProps = ({
  breakpoints,
  componentDefinition,
  patternRootNodeIdsChain,
  node,
  resolveDesignValue,
  resolveBoundValue,
  resolveHyperlinkValue,
  resolveUnboundValue,
  resolvePrebindingValue,
}: {
  breakpoints: Breakpoint[];
  mainBreakpoint: Breakpoint;
  componentDefinition: ComponentDefinition;
  patternRootNodeIdsChain?: string;
  node: ComponentTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  resolveBoundValue: ResolveBoundValueType;
  resolveHyperlinkValue: (data: { linkTargetKey: string }) => string | null;
  resolveUnboundValue: (data: {
    mappingKey: string;
    defaultValue: ComponentDefinitionVariable['defaultValue'];
  }) => PrimitiveValue;
  resolvePrebindingValue: (data: {
    propertyName: string;
    mappingKey: string;
    dataType: ComponentDefinitionVariableType;
    resolveBoundValue: ResolveBoundValueType;
  }) => PrimitiveValue;
}) => {
  const styleProps: Record<string, DesignValue['valuesByBreakpoint']> = {};
  const customDesignProps: Record<string, PrimitiveValue> = {};
  const contentProps: Record<string, PrimitiveValue> = {};

  debug.log(
    '[experiences-sdk-react::parseComponentProps] Parsing component props for node with id: ',
    node.id,
  );

  for (const [propName, propDefinition] of Object.entries(componentDefinition.variables)) {
    const propertyValue = node.variables[propName];
    if (!propertyValue) continue;

    switch (propertyValue.type) {
      case 'DesignValue': {
        if (isCfStyleAttribute(propName)) {
          // for such properties we know how to convert them to CSS, so we will build a media query from it below after the loop is over
          styleProps[propName] = propertyValue.valuesByBreakpoint;
        } else {
          // for custom design props, the value will be resolved with the javascript per breakpoint at runtime
          customDesignProps[propName] = resolveDesignValue(propertyValue.valuesByBreakpoint);
        }
        break;
      }
      case 'BoundValue': {
        const boundValue = resolveBoundValue({
          propertyName: propName,
          dataType: propDefinition.type as ComponentDefinitionVariableType,
          binding: propertyValue,
        });

        const propValue = boundValue ?? propDefinition.defaultValue;

        if (isSpecialCaseCssProp(propName)) {
          // styleProps[propName] = { [mainBreakpoint.id]: propValue };
          // Here we create kind of "fake" style property out of a bound value.
          // As bound values are breakpoint-universal (they apply to all breakpoints),
          // but styleProps are breakpoint-specific, we need to ensure that
          // semantically our "fake" emphemeral style property will be universall as well,
          // by expanding it to all the breakpoints. This is important as
          // styleTransformers.ts#transformBackgroundImageUrl() expects
          // cfBackgroundImageUrl to be present for all breakpoints
          // where cfBackgroundImageOptions is present.
          styleProps[propName] = Object.fromEntries(breakpoints.map((b) => [b.id, propValue]));
        } else {
          contentProps[propName] = propValue;
        }
        break;
      }

      case 'HyperlinkValue': {
        const hyperlink = resolveHyperlinkValue({
          linkTargetKey: propertyValue.linkTargetKey,
        });
        if (hyperlink) {
          contentProps[propName] = hyperlink;
        }
        break;
      }
      case 'UnboundValue': {
        const unboundValue = resolveUnboundValue({
          mappingKey: propertyValue.key,
          defaultValue: propDefinition.defaultValue,
        });

        if (isSpecialCaseCssProp(propName)) {
          styleProps[propName] = Object.fromEntries(breakpoints.map((b) => [b.id, unboundValue]));
        } else {
          contentProps[propName] = unboundValue;
        }
        break;
      }
      case 'ComponentValue': {
        // This can either be a design (style) or a content property.
        // Where prebinding is used, we resolve like they are a BoundValue.
        const propValue =
          resolvePrebindingValue({
            propertyName: propName,
            mappingKey: propertyValue.key,
            dataType: propDefinition.type,
            resolveBoundValue,
          }) ?? propDefinition.defaultValue;

        if (isSpecialCaseCssProp(propName)) {
          styleProps[propName] = Object.fromEntries(breakpoints.map((b) => [b.id, propValue]));
        } else {
          contentProps[propName] = propValue;
        }
        break;
      }
      default:
        break;
    }
  }
  /* [Data Format] After resolving all properties, `styleProps` contains solely the plain design values
   * styleProps = {
   *   cfMargin: { desktop: '42px', tablet: '13px' },
   *   cfBackgroundColor: { desktop: 'rgba(246, 246, 246, 1)' },
   *   cfBackgroundImage: { desktop: 'url(https://example.com/image.jpg)' }
   * }
   */

  const stylePropsIndexedByBreakpoint = Object.entries(styleProps).reduce<
    Record<string, Record<string, PrimitiveValue>>
  >((acc, [propName, valuesByBreakpoint]) => {
    for (const [breakpointId, value] of Object.entries(valuesByBreakpoint)) {
      if (!acc[breakpointId]) {
        acc[breakpointId] = {};
      }

      acc[breakpointId][propName] = value;
    }

    return acc;
  }, {});
  /* [Data Format] `stylePropsIndexedByBreakpoint` contains the plain design values grouped by breakpoint
   * stylePropsIndexedByBreakpoint = {
   *   desktop: {
   *     cfMargin: '42px',
   *     cfBackgroundColor: 'rgba(246, 246, 246, 1)',
   *     cfBackgroundImage: 'url(https://example.com/image.jpg)'
   *   },
   *   tablet: {
   *     cfMargin: '13px'
   *   }
   * }
   */

  const stylesheetData = createStylesheetsForBuiltInStyles({
    designPropertiesByBreakpoint: stylePropsIndexedByBreakpoint,
    breakpoints,
    node,
    patternRootNodeIdsChain,
  });
  /* [Data Format] Stylesheet data provides objects containing `className`, `breakpointCondition`, and `css`.
   * stylesheetData = [{
   *    className: 'uniqueMD5Hash',
   *    breakpointCondition: '<768px',
   *    css: 'margin:13px;'
   *    visibilityCss: 'display:none !important;'
   *  }, ...]
   */
  const mediaQuery = convertResolvedDesignValuesToMediaQuery(stylesheetData);
  /* [Data Format] `mediaQuery` is a joined string of all media query CSS code
   * mediaQuery = ".cfstyles-123{margin:42px;}@media(max-width:768px){.cfstyles-456{margin:13px;}}"
   */
  return {
    styleProps,
    mediaQuery,
    customDesignProps,
    contentProps,
  };
};
