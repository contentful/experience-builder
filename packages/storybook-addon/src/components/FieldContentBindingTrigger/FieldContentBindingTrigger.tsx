import React from 'react';
import { ComponentDefinition } from '@contentful/experience-builder';
import { Flex, IconButton, TextLink, Text } from '@contentful/f36-components';
import { MoreVerticalTrimmedIcon, PlusCircleIcon } from '@contentful/f36-icons';
import { useMemo, useCallback } from 'react';
import {
  ContentBindTabs,
  FieldContentBindingContextProvider,
  useBindingContext,
} from './FieldContentBindingContext';

import { FieldContentBindingForm } from './FieldContentBindingForm';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { isEqual } from 'lodash';
import { ContentBindingPopover } from './ContentBindingPopover';
import { useCompositionCanvasSubscriber } from '@/context/useCompositionCanvasSubscriber';
import { useArgs } from '@storybook/manager-api';

const styles = {
  bindingMenu: css({
    marginLeft: 'auto',
  }),
  bindingIndicator: css({
    color: tokens.gray500,
  }),
  menuIconButton: css({
    padding: `0 ${tokens.spacingS}`,
    minHeight: 'inherit',

    ':hover': {
      background: 'none',
    },
  }),
  addContentButton: css({
    marginLeft: 'auto',
  }),
};

enum BindingIndicator {
  Manual = 'Manual',
  Media = 'Media',
  Entry = 'Entry',
}

const getBindingIndicator = (entity?: any) => {
  if (entity) {
    switch (entity.sys.type) {
      case 'Entry':
        return BindingIndicator.Entry;
      case 'Asset':
        return BindingIndicator.Media;
      default:
        return entity.sys.type;
    }
  }
  return BindingIndicator.Manual;
};

type FieldContentBindingTriggerProps = {
  componentDefinition: ComponentDefinition;
  propKey: string;
  // Moved the pop-over open and close logic up one parent because the rich text editor has
  // menu dropdowns that when opened, make the binding dropdown lose focus and causes it to close.
  // So I disabled closing on blur. The binding popover closes when a user:
  // 1 - Saves new binding
  // 2 - Uses the close button
  // 3 - Uses the ESC key
  // 4 - Opens a new binding popover
  openPopover: () => void;
  closePopover: () => void;
  isPopoverOpen: boolean;
};

const FieldContentBindingTriggerWithoutContext = ({
  componentDefinition,
  propKey,
  isPopoverOpen,
  openPopover,
  closePopover,
}: FieldContentBindingTriggerProps) => {
  const { currentTab, defaultManualValue, manualValue } = useBindingContext();

  const [args] = useArgs();

  const { onUnboundValuesChanged } = useCompositionCanvasSubscriber();

  const isSaveButtonDisabled = useMemo(() => {
    const savedManualValue = args[propKey];
    if (currentTab === ContentBindTabs.MANUAL) {
      return savedManualValue === manualValue;
    }

    return true;
  }, [defaultManualValue, currentTab, manualValue, args, propKey]);

  const handleSave = useCallback(() => {
    if (currentTab === ContentBindTabs.MANUAL) {
      onUnboundValuesChanged({
        variableName: propKey,
        value: manualValue,
      });
      return;
    }
  }, [currentTab, onUnboundValuesChanged, propKey, manualValue]);

  const togglePopover = useCallback(() => {
    isPopoverOpen ? closePopover() : openPopover();
  }, [closePopover, isPopoverOpen, openPopover]);

  const showBindingMenu = !isEqual(
    manualValue,
    componentDefinition?.variables[propKey].defaultValue
  );

  const renderTriggerNode = useCallback(
    () =>
      showBindingMenu ? (
        <Flex className={styles.bindingMenu}>
          <Text className={styles.bindingIndicator}>{BindingIndicator.Manual}</Text>
          <IconButton
            className={styles.menuIconButton}
            variant="transparent"
            icon={<MoreVerticalTrimmedIcon />}
            aria-label="Open binding menu"
            onClick={togglePopover}
          />
        </Flex>
      ) : (
        <TextLink
          as="button"
          className={styles.addContentButton}
          icon={<PlusCircleIcon />}
          alignIcon="end"
          onClick={togglePopover}>
          Add content
        </TextLink>
      ),
    [showBindingMenu, togglePopover]
  );

  return (
    <ContentBindingPopover
      renderTriggerNode={renderTriggerNode}
      onSave={handleSave}
      isSaveButtonDisabled={isSaveButtonDisabled}
      isPopoverOpen={isPopoverOpen}
      closePopover={closePopover}>
      <FieldContentBindingForm
        propKey={propKey}
        variableType={componentDefinition.variables[propKey].type}
        componentDefinition={componentDefinition}
      />
    </ContentBindingPopover>
  );
};

export const FieldContentBindingTrigger = (props: FieldContentBindingTriggerProps) => {
  return (
    <FieldContentBindingContextProvider
      componentDefinition={props.componentDefinition}
      propKey={props.propKey}>
      <FieldContentBindingTriggerWithoutContext
        componentDefinition={props.componentDefinition}
        propKey={props.propKey}
        isPopoverOpen={props.isPopoverOpen}
        openPopover={props.openPopover}
        closePopover={props.closePopover}
      />
    </FieldContentBindingContextProvider>
  );
};
