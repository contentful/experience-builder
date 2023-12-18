import {
  Card,
  FormControl,
  Select,
  Switch,
  Textarea,
  Flex,
  TextInput,
} from '@contentful/f36-components';
import React, { useMemo, useState } from 'react';
import tokens from '@contentful/f36-tokens';
import { Document } from '@contentful/rich-text-types';
import {
  CONTENTFUL_SECTION_ID,
  CONTENTFUL_CONTAINER_ID,
  ComponentDefinition,
} from '@contentful/experience-builder';
import { css } from 'emotion';
import { useBindingContext } from './FieldContentBindingContext';

type FieldManualContentBindingProps = {
  propKey: string;
  componentDefinition: ComponentDefinition;
};

const styles = {
  booleanCard: css({
    padding: `${tokens.spacingXs} ${tokens.spacingM}`,
  }),
};

const RichTextFieldEditor = ({
  value,
  setValue,
}: {
  value: Document;
  setValue: (doc: Document) => void;
}) => {
  const compositionFieldSDK = false;

  if (!compositionFieldSDK) return <div />;

  return null;

  // return (
  //   // <RichTextEditor
  //   //   isInitiallyDisabled={false}
  //   //   minHeight="100px"
  //   //   maxHeight="100px"
  //   //   value={value}
  //   //   onChange={(document) => setValue(document as Document)}
  //   // />
  // );
};

export const FieldManualContentBinding = ({
  propKey,
  componentDefinition,
}: FieldManualContentBindingProps) => {
  const { manualValue, setManualValue } = useBindingContext();

  const variableType = componentDefinition?.variables[propKey].type;

  const toggleText = useMemo(() => {
    if (
      componentDefinition?.id === CONTENTFUL_SECTION_ID ||
      componentDefinition?.id === CONTENTFUL_CONTAINER_ID
    ) {
      return 'Open in new tab';
    }
    return componentDefinition?.variables[propKey].displayName;
  }, [componentDefinition?.id, componentDefinition?.variables, propKey]);

  switch (variableType) {
    case 'Text': {
      if (componentDefinition?.variables[propKey].validations?.in) {
        return (
          <FormControl>
            <FormControl.Label>
              {componentDefinition?.variables[propKey].displayName}
            </FormControl.Label>
            <Select
              id="optionSelect-controlled"
              name="optionSelect-controlled"
              testId="text-with-validations-manual-value"
              value={manualValue as string}
              onChange={(e) => setManualValue(e.target.value)}>
              {(componentDefinition?.variables[propKey].validations?.in || []).map(
                (validation, index) => (
                  <Select.Option value={validation.value} key={`${validation.value}-${index}`}>
                    {validation.displayName || validation.value}
                  </Select.Option>
                )
              )}
            </Select>
          </FormControl>
        );
      } else if (componentDefinition?.variables[propKey].validations?.format === 'URL') {
        return (
          <TextInput
            aria-label="Manual Url value"
            placeholder="Type in a URL..."
            type="url"
            value={(manualValue as string) ?? ''}
            onChange={(e: any) => setManualValue(e.target.value)}
          />
        );
      }
      return (
        <Textarea
          value={(manualValue as string) ?? ''}
          onChange={(e: any) => setManualValue(e.target.value)}
        />
      );
    }
    case 'Number': {
      return (
        <TextInput
          testId="number-manual-value"
          type="number"
          value={(manualValue as string) ?? ''}
          onChange={(e) => setManualValue(e.target.value)}
        />
      );
    }
    case 'Boolean': {
      return (
        <Card className={styles.booleanCard} testId="boolean-manual-value">
          <Flex justifyContent="space-between" alignItems="center">
            <span>{toggleText}</span>
            <Switch
              isChecked={manualValue as boolean}
              onChange={() => setManualValue(!!manualValue)}
            />
          </Flex>
        </Card>
      );
    }
    case 'RichText': {
      return <RichTextFieldEditor value={manualValue as Document} setValue={setManualValue} />;
    }
    default:
      // eslint-disable-next-line no-console
      console.warn('Received unsupported field type: ' + variableType);
      return <div>Field type is not supported </div>;
  }
};
