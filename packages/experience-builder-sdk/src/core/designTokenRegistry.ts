import { OUTGOING_EVENTS } from '../constants';
import { sendMessage } from '../communication/sendMessage';
import { DesignTokensDefinition } from '../types';

const designTokensRegistry = {} as DesignTokensDefinition;
const templateStringRegex = /\${(.+?)}/g;

/**
 * Register design tokens styling
 * @param designTokenDefinition - {[key:string]: Record<string, string>}
 * @returns void
 */
export const defineDesignTokens = (designTokenDefinition: DesignTokensDefinition) => {
  Object.assign(designTokensRegistry, designTokenDefinition);
  sendMessage(OUTGOING_EVENTS.DesignTokens, {
    designTokens: designTokenDefinition,
  });
};

export const getDesignTokenRegistrationForSpacing = (breakpointValue: string) => {
  let resolvedValue = '';
  const values = breakpointValue.split(' ');
  values.forEach((value) => {
    let tokenValue = value;
    if (isTemplateStringFormat(value)) tokenValue = resolveSpacingDesignToken(value);
    resolvedValue += `${tokenValue} `;
  });
  return resolvedValue;
};

// Using this because export const StringTemplateRegex = /\${(.*?)\}/g doesn't work
const isTemplateStringFormat = (str: string) => {
  return templateStringRegex.test(str);
};

const resolveSpacingDesignToken = (templateString: string) => {
  const nonTemplateValue = templateString.replace(templateStringRegex, '$1');
  const designKeys = nonTemplateValue.split('.');
  const spacingValues = designTokensRegistry[designKeys[0]] as DesignTokensDefinition;
  const resolvedValue = spacingValues[designKeys[1]] as string;
  return resolvedValue || '0px';
};
