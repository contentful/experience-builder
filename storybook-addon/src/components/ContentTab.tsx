import React, { useState } from 'react';
import { Flex, Box, Text, Paragraph } from '@contentful/f36-components';
import { ArrowDownIcon, ArrowUpIcon } from '@contentful/f36-icons';
import CompositionFallBackIcon from '@svg/composition/composition-fall-back-icon.svg';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

import { ComponentDefinition } from '@contentful/experience-builder';
import { VariableIcon } from './VariableIcon';
import { FieldContentBindingTrigger } from './FieldContentBindingTrigger';

const styles = {
  selectedCard: css({
    borderBottom: `1px solid ${tokens.gray200}`,
  }),
  expandTrigger: css({
    cursor: 'pointer',
  }),
  componentIcon: css({
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
  }),
  emptyStateWrapper: css({
    height: '60vh',
    marginTop: tokens.spacing2Xl,
    justifyContent: 'center',
  }),
  emptyStateParagraph: css({
    marginTop: tokens.spacingM,
    textAlign: 'center',
    width: '200px',
    color: tokens.gray500,
  }),
  emptyStateSvg: css({
    width: '70px',
    height: '70px',
  }),
  entityBinding: css({
    marginLeft: 'auto',
    marginRight: tokens.spacingM,
    lineHeight: 0,
  }),
};

interface ContentTabProps {
  componentDefinition: ComponentDefinition;
}

const ContentTab: React.FC<ContentTabProps> = ({ componentDefinition }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [popoverKey, setPopoverKey] = useState('');

  if (!componentDefinition) {
    return (
      <Flex flexDirection="column" alignItems="center" className={styles.emptyStateWrapper}>
        <Box as="div" className={styles.emptyStateSvg}>
          <img src={CompositionFallBackIcon} alt="" />
        </Box>
        <Paragraph className={styles.emptyStateParagraph}>
          Select a component to view content options
        </Paragraph>
      </Flex>
    );
  }

  const isBindingAllowed = Object.entries(componentDefinition.variables).some(
    ([, variableData]) => variableData.group !== 'style'
  );

  return (
    <div>
      <Flex
        className={styles.selectedCard}
        alignItems="center"
        padding="none"
        paddingBottom="spacingS"
        marginTop="spacingS">
        <Flex onClick={() => setIsExpanded(!isExpanded)} className={styles.expandTrigger}>
          {isExpanded ? (
            <ArrowUpIcon variant="muted" testId={`${componentDefinition.id}-up-arrow`} />
          ) : (
            <ArrowDownIcon variant="muted" testId={`${componentDefinition.id}-down-arrow`} />
          )}
          <Box as="span" className={styles.componentIcon}>
            <img src={CompositionFallBackIcon} alt="" />
          </Box>
          <Box as="span" marginLeft="spacingXs">
            {componentDefinition?.name || 'Untitled'}
          </Box>
        </Flex>
        <Box className={styles.entityBinding}>
          {/* {isBindingAllowed && (
            <EntityContentBindingTrigger
              componentDefinition={componentDefinition}
              isPopoverOpen={popoverKey === componentDefinition.id}
              openPopover={() => setPopoverKey(componentDefinition.id)}
              closePopover={() => setPopoverKey('')}
              selectedLocale={selectedLocale}
            />
          )} */}
        </Box>
      </Flex>
      {isExpanded && isBindingAllowed && (
        <Box padding="spacing2Xs">
          {Object.entries(componentDefinition.variables).map(
            ([variableName, variableData], index) => {
              if (variableData.group === 'style') return;
              const uniqueKey = `${variableName}-${index}-${componentDefinition.id}`;
              return (
                <Flex key={uniqueKey} padding="spacingS" marginLeft="spacingM" alignItems="center">
                  <VariableIcon variableType={variableData.type} />
                  <Text>{variableData.displayName || variableName}</Text>
                  <FieldContentBindingTrigger
                    componentDefinition={componentDefinition}
                    propKey={variableName}
                    isPopoverOpen={popoverKey === uniqueKey}
                    openPopover={() => setPopoverKey(uniqueKey)}
                    closePopover={() => setPopoverKey('')}
                  />
                </Flex>
              );
            }
          )}
        </Box>
      )}
    </div>
  );
};

export { ContentTab };
