import { toMediaQuery } from '@contentful/experiences-core';
import { ResolvedStylesheetData } from './createStylesheetsForBuiltInStyles';

/**
 * Takes the CSS code for each breakpoint and merges them into a single CSS string.
 * It will wrap each breakpoint's CSS code in a media query (exception: default breakpoint with '*').
 *
 * **Example Input:**
 * ```
 * [
 *  { className: 'cfstyles-123', breakpointCondition: '*', css: 'color:red;', visibilityCss: 'display:none !important;' },
 *  { className: 'cfstyles-456', breakpointCondition: '<768px', css: 'color:blue;' },
 * ]
 * ```
 *
 * **Example Output:**
 * ```
 * '.cfstyles-123{color:red;}@media not (max-width:768px){.cfstyles-123{display:none !important;}}@media(max-width:768px){.cfstyles-456{color:blue;}}'
 * ```
 */
export const convertResolvedDesignValuesToMediaQuery = (stylesheetData: ResolvedStylesheetData) => {
  const stylesheet = stylesheetData.reduce(
    (acc, { breakpointCondition, className, css, visibilityCss }, index) => {
      if (acc.classNames.includes(className)) {
        return acc;
      }

      const mediaQueryCss = toMediaQuery({
        condition: breakpointCondition,
        cssByClassName: { [className]: css },
      });
      const visibilityMediaQueryCss = toMediaQuery({
        condition: breakpointCondition,
        cssByClassName: { [className]: visibilityCss ?? '' },
        // Validation ensures that it starts with the '*' breakpoint
        nextCondition: stylesheetData[index + 1]?.breakpointCondition,
      });
      return {
        classNames: [...acc.classNames, className],
        css: `${acc.css}${mediaQueryCss}${visibilityMediaQueryCss}`,
      };
    },
    {
      classNames: [] as string[],
      css: '',
    },
  );

  return {
    css: stylesheet.css,
    className: stylesheet.classNames.join(' '),
  };
};
