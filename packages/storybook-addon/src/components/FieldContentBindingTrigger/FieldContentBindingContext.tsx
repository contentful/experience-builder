import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { ComponentDefinition } from '@contentful/experience-builder';
import { useArgs } from '@storybook/manager-api';

export type UnboundValues = {
  value: string | boolean | number | Record<any, any> | undefined;
};

interface FieldContentBindingContextProps {
  defaultManualValue: UnboundValues['value'] | undefined;
  manualValue: UnboundValues['value'] | undefined;
  currentTab: string;
  setCurrentTab: (currentTab: ContentBindTabs) => void;
  setManualValue: (value: UnboundValues['value']) => void;
}

const FieldContentBindingContext = React.createContext<FieldContentBindingContextProps>({
  manualValue: undefined,
  defaultManualValue: undefined,
  setManualValue: () => {
    /* noop */
  },
  currentTab: '',
  setCurrentTab: () => {
    /* noop */
  },
});

type FieldContentBindingContextProviderProps = {
  propKey: string;
  componentDefinition: ComponentDefinition;
};

export enum ContentBindTabs {
  MANUAL = 'manual',
  REUSABLE = 'reusable',
}

export const FieldContentBindingContextProvider = ({
  children,
  componentDefinition,
  propKey,
}: PropsWithChildren<FieldContentBindingContextProviderProps>) => {
  const [manualValue, setManualValue] = useState<UnboundValues['value']>();

  const [args] = useArgs();
  // Also updates the manual value when it was removed via the entity-level binding popover
  const defaultManualValue = componentDefinition?.variables[propKey].defaultValue;
  const savedManualValue = args[propKey];

  useEffect(() => {
    setManualValue(savedManualValue ?? defaultManualValue);
  }, [defaultManualValue, savedManualValue]);

  const [currentTab, setCurrentTab] = useState<ContentBindTabs>(ContentBindTabs.MANUAL);

  return (
    <FieldContentBindingContext.Provider
      value={{
        defaultManualValue,
        manualValue,
        setManualValue,
        currentTab,
        setCurrentTab,
      }}>
      {children}
    </FieldContentBindingContext.Provider>
  );
};

export const useBindingContext = () => useContext(FieldContentBindingContext);
