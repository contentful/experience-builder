import { isCfStyleAttribute } from '@contentful/experiences-core';
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
} from '@contentful/experiences-core/types';
import { convertResolvedDesignValuesToMediaQuery } from '../hooks/useMediaQuery';

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
export const parseComponentProps = ({
  mainBreakpoint,
  componentDefinition,
  node,
  resolveClassNamesFromBuiltInStyles,
  resolveCustomDesignValue,
  resolveBoundValue,
  resolveHyperlinkValue,
  resolveUnboundValue,
}: {
  mainBreakpoint: Breakpoint;
  node: ComponentTreeNode;
  componentDefinition: ComponentDefinition;
  resolveClassNamesFromBuiltInStyles: (
    propsByBreakpointId: Record<string, Record<string, PrimitiveValue>>,
  ) => Array<{ className: string; breakpointCondition: string; css: string }>;
  resolveCustomDesignValue: (data: {
    propertyName: string;
    valuesByBreakpoint: Record<string, any>;
  }) => PrimitiveValue;
  resolveBoundValue: (data: {
    propertyName: string;
    dataType: ComponentDefinitionVariableType;
    binding: BoundValue;
  }) => BoundComponentPropertyTypes;
  resolveHyperlinkValue: (data: { linkTargetKey: string }) => string | null;
  resolveUnboundValue: (data: {
    mappingKey: string;
    defaultValue: ComponentDefinitionVariable['defaultValue'];
  }) => any;
}) => {
  const styleProps: Record<string, DesignValue['valuesByBreakpoint']> = {};
  const customDesignProps: Record<string, PrimitiveValue> = {};
  const contentProps: Record<string, any> = {};

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
          customDesignProps[propName] = resolveCustomDesignValue({
            propertyName: propName,
            valuesByBreakpoint: propertyValue.valuesByBreakpoint,
          });
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
          styleProps[propName] = { [mainBreakpoint.id]: propValue };
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
          styleProps[propName] = { [mainBreakpoint.id]: unboundValue };
        } else {
          contentProps[propName] = unboundValue;
        }
        break;
      }
      case 'ComponentValue':
        // We're rendering a pattern entry. Content cannot be set for ComponentValue type properties
        // directly in the pattern so we can safely use the default value
        // This can either a design (style) or a content variable
        contentProps[propName] = propDefinition.defaultValue;
        break;
      default:
        break;
    }
  }

  /**
  * {
      desktop: {
        cfVerticalAlignment: 'center',
        cfHorizontalAlignment: 'center',
        cfMargin: '0 0 0 0',
        cfPadding: '0 0 0 0',
        cfBackgroundColor: 'rgba(246, 246, 246, 1)',
        cfWidth: 'fill',
        cfHeight: 'fit-content',
        cfMaxWidth: 'none',
        cfFlexDirection: 'column',
        cfFlexWrap: 'nowrap',
        cfBorder: '0px solid rgba(0, 0, 0, 0)',
        cfBorderRadius: '0px',
        cfGap: '0px 0px',
        cfBackgroundImageOptions: { scaling: 'fill', alignment: 'left top', targetSize: '2000px' }
      },
      tablet: {},
      mobile: {}
    }
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

  /**
   * [
   *  {
   *    className: 'cfstyles-123',
   *    breakpointCondition: '<=1024px',
   *    css: '.cfstyles-123 { color: red; }'
   *  },
   *  {
   *   className: 'cfstyles-456',
   *   breakpointCondition: '<=768px',
   *   css: '.cfstyles-456 { color: blue; }'
   *  }
   * ]
   */
  const styleSheetData = resolveClassNamesFromBuiltInStyles(stylePropsIndexedByBreakpoint);

  /**
   * {
   *  className: ['cfstyles-123', 'cfstyles-456'],
   *  styleSheet: `
   *    @media (max-width: 1024px) {
   *      .cfstyles-123 { color: red; }
   *    }
   *    @media (max-width: 768px) {
   *      .cfstyles-456 { color: blue; }
   *    }
   *  `
   * }
   */
  const mediaQuery = convertResolvedDesignValuesToMediaQuery(styleSheetData);

  return {
    styleProps,
    mediaQuery,
    customDesignProps,
    contentProps,
  };
};
