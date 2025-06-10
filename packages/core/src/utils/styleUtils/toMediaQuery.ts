/**
 * Turns a condition like `<768px` or `>1024px` into a media query rule.
 * For example, `<768px` becomes `max-width:768px` and `>1024px` becomes `min-width:1024px`.
 */
const toMediaQueryRule = (condition: string) => {
  const [evaluation, pixelValue] = [condition[0], condition.substring(1)];
  const mediaQueryRule = evaluation === '<' ? 'max-width' : 'min-width';
  return `(${mediaQueryRule}:${pixelValue})`;
};

/**
 * Converts a map of class names to CSS strings into a single CSS string.
 *
 * @param cssByClassName map of class names to CSS strings containing all rules for each class
 * @returns joined string of all CSS class definitions
 */
const toCompoundCss = (cssByClassName: Record<string, string>): string => {
  return Object.entries(cssByClassName).reduce<string>((acc, [className, css]) => {
    if (css === '') return acc;
    return `${acc}.${className}{${css}}`;
  }, ``);
};

/**
 * Create a single CSS string containing all class definitions for a given media query.
 *
 * @param cssByClassName map of class names to CSS strings containing all rules for each class
 * @param condition e.g. "*", "<520px", ">520px"
 * @param nextCondition optional next condition to create a disjunct media query that doesn't affect the next breakpoint
 * @returns joined string of all CSS class definitions wrapped into media queries
 */
export const toMediaQuery = ({
  cssByClassName,
  condition,
  nextCondition,
}: {
  cssByClassName: Record<string, string>;
  condition: string;
  nextCondition?: string;
}) => {
  const compoundCss = toCompoundCss(cssByClassName);
  if (compoundCss === '') {
    return '';
  }

  const queryRule = toMediaQueryRule(condition);
  if (!nextCondition) {
    if (condition === '*') {
      return compoundCss;
    }
    return `@media${queryRule}{${compoundCss}}`;
  }

  const nextRule = toMediaQueryRule(nextCondition);
  if (condition === '*') {
    return `@media not ${nextRule}{${compoundCss}}`;
  }
  return `@media${queryRule} and (not ${nextRule}){${compoundCss}}`;
};
