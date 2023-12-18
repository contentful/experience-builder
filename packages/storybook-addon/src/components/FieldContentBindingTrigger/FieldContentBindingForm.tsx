import { Flex, Button } from '@contentful/f36-components';

import { css, cx } from 'emotion';
import React, { useState } from 'react';

import { FieldManualContentBinding } from './FieldManualContentBinding';
import tokens from '@contentful/f36-tokens';
import {
  ComponentDefinition,
  ComponentDefinitionVariableType,
} from '@contentful/experience-builder';

export const styles = {
  entryTab: css({
    maxWidth: '100%',
    minWidth: '0',
    flexGrow: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }),
  manualTab: css({
    flexGrow: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }),
  tabActiveState: css({
    background: tokens.blue100,
    borderColor: tokens.blue600,
    color: tokens.blue600,

    ':hover': {
      background: tokens.blue100,
      color: tokens.blue600,
    },
  }),
};

enum ContentBindTabs {
  MANUAL = 'manual',
  REUSABLE = 'reusable',
}

const UnsupportedManualBindingTypes: string[] = [
  'Link',
  'Date',
  'Location',
  'Object',
] satisfies Array<ComponentDefinitionVariableType | 'Link'>;

type FieldContentBindingFormProps = {
  propKey: string;
  variableType: ComponentDefinitionVariableType;
  componentDefinition: ComponentDefinition;
};

const FieldContentBindingForm = ({
  variableType,
  propKey,
  componentDefinition,
}: FieldContentBindingFormProps) => {
  // const { selectedEntity, setCurrentTab, currentTab } = useBindingContext();

  const [currentTab, setCurrentTab] = useState(ContentBindTabs.MANUAL);

  return (
    <>
      <Flex fullWidth>
        <Button
          className={cx(styles.entryTab, {
            [styles.tabActiveState]: currentTab === ContentBindTabs.REUSABLE,
          })}
          onClick={() => setCurrentTab(ContentBindTabs.REUSABLE)}>
          Reusable
        </Button>
        <Button
          className={cx(styles.manualTab, {
            [styles.tabActiveState]: currentTab === ContentBindTabs.MANUAL,
          })}
          isDisabled={UnsupportedManualBindingTypes.includes(variableType)}
          onClick={() => setCurrentTab(ContentBindTabs.MANUAL)}>
          Manual
        </Button>
      </Flex>

      <Flex flexDirection="column" fullWidth>
        {currentTab === ContentBindTabs.MANUAL && (
          <FieldManualContentBinding componentDefinition={componentDefinition} propKey={propKey} />
        )}
        {/* {currentTab === ContentBindTabs.REUSABLE && (
          <FieldReusableContentBindingForm
            variableType={variableType}
            removeBoundEntity={removeBoundEntity}
            saveFieldBinding={saveFieldBinding}
            selectedLocale={selectedLocale}
          />
        )} */}
      </Flex>
    </>
  );
};

export { FieldContentBindingForm };
