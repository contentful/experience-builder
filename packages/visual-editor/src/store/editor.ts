import { defineDesignTokens } from '@contentful/experiences-core';
import type {
  ComponentRegistration,
  ExperienceDataSource,
  ExperienceUnboundValues,
  DesignTokensDefinition,
} from '@contentful/experiences-core/types';
import { create } from 'zustand';
import { componentRegistry } from './registries';
import { isEqual } from 'lodash-es';

export interface InitEditorParams {
  componentRegistry: Map<string, ComponentRegistration>;
  designTokens: DesignTokensDefinition;
  initialLocale: string;
}
export interface EditorStore {
  dataSource: ExperienceDataSource;
  hyperLinkPattern?: string;
  setHyperLinkPattern: (pattern: string) => void;
  locale: string | null;
  unboundValues: ExperienceUnboundValues;
  // updaters
  setDataSource: (data: ExperienceDataSource) => void;
  setUnboundValues: (values: ExperienceUnboundValues) => void;
  setLocale: (locale: string) => void;

  initializeEditor: (params: InitEditorParams) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  dataSource: {},
  hyperLinkPattern: undefined,
  unboundValues: {},

  locale: null,
  setHyperLinkPattern: (pattern: string) => {
    set({ hyperLinkPattern: pattern });
  },
  setDataSource(data) {
    const dataSource = get().dataSource;
    const newDataSource = { ...dataSource, ...data };
    if (isEqual(dataSource, newDataSource)) {
      return;
    }
    set({ dataSource: newDataSource });
  },
  setUnboundValues(values) {
    set({ unboundValues: values });
  },
  setLocale(locale) {
    const currentLocale = get().locale;

    if (locale === currentLocale) {
      return;
    }

    set({ locale });
  },
  initializeEditor({ componentRegistry: initialRegistry, designTokens, initialLocale }) {
    initialRegistry.forEach((registration) => {
      componentRegistry.set(registration.definition.id, registration);
    });

    // Re-register the design tokens with the Visual Editor's instance of the experiences-core package
    defineDesignTokens(designTokens);

    set({ locale: initialLocale });
  },
}));
