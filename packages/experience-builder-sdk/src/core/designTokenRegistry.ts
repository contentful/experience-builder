import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';
import { sendMessage } from '@contentful/experience-builder-core';
import { DesignTokensDefinition } from '@contentful/experience-builder-core/types';

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
