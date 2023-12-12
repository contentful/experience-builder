export const SpacingUnitRegexp = /px|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%$/;
export const SpacingValueRegexp = /^\d{1,}(px|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)?$/;
export const FixedSpacingValueRegexp = /\d{1,}(px|cm|mm|in|pt|pc)$/;
export const RelativeSpacingValueRegexp = /\d{1,}(em|ex|ch|rem|vw|vh|vmin|vmax|%)$/;

export const OnlyNumberRegexp = /^\d+$/;

// Taken from https://developer.mozilla.org/en-US/docs/Web/CSS/length
// Note that this explicitly doesn't include percentage values (see <length-percentage>)
export const LengthRegExp = /^\d{1,}(px|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax)$/;

export const BORDER_STYLE_OPTIONS = ['inside', 'outside'];
export const BorderStyleRegExp = new RegExp(`^${BORDER_STYLE_OPTIONS.join('|')}$`);
