import React, { ReactNode } from 'react';
import { Text, Button, Flex, Popover, TextLink } from '@contentful/f36-components';
import { CloseIcon } from '@contentful/f36-icons';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

const styles = {
  popoverRoot: css({
    width: '400px',
    lineHeight: 1,
    cursor: 'default',
  }),
  addContentHeader: css({
    fontWeight: tokens.fontWeightMedium,
  }),
};

type ContentBindingPopoverProps = {
  renderTriggerNode: () => React.ReactNode;
  onSave: () => void;
  isSaveButtonDisabled: boolean;
  isPopoverOpen: boolean;
  children: ReactNode;
  closePopover: () => void;
};

export const ContentBindingPopover = ({
  renderTriggerNode,
  onSave,
  isSaveButtonDisabled,
  isPopoverOpen,
  children,
  closePopover,
}: ContentBindingPopoverProps) => {
  return (
    // Don't render as portal to not render it on top of the EntitySelectorDialog nor the SlideInEditor
    <Popover isOpen={isPopoverOpen} onClose={closePopover} usePortal={false} closeOnBlur={false}>
      <Popover.Trigger>{renderTriggerNode()}</Popover.Trigger>
      <Popover.Content>
        <Flex flexDirection="column" className={styles.popoverRoot}>
          <Flex
            justifyContent="space-between"
            padding="spacingM"
            paddingTop="spacingS"
            paddingBottom="spacing2Xs"
            fullWidth
            className={styles.addContentHeader}>
            <Text fontColor="gray600">Add content</Text>
            <TextLink
              as="button"
              onClick={closePopover}
              icon={<CloseIcon />}
              variant="muted"
              aria-label="Close Popover"
            />
          </Flex>
          <Flex padding="spacingS" flexDirection="column" gap="spacingS">
            {children}
            <Flex justifyContent="flex-end" fullWidth>
              <Button
                isFullWidth
                variant="positive"
                isDisabled={isSaveButtonDisabled}
                onClick={() => {
                  onSave();
                  closePopover();
                }}>
                Confirm changes
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover>
  );
};
