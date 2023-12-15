import { OUTGOING_EVENTS } from '../constants';
import { sendMessage } from '@contentful/experience-builder-core';
import { DesignTokensDefinition } from '../types';

/**
 * Register design tokens styling
 * @param designTokenDefinition - {[key:string]: Record<string, string>}
 * @returns void
 */
export const defineDesignTokens = (designTokenDefinition: DesignTokensDefinition) => {
  sendMessage(OUTGOING_EVENTS.DesignTokens, {
    designTokens: designTokenDefinition,
  });
};
