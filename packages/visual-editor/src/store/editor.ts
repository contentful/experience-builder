import { defineDesignTokens } from '@contentful/experience-builder-core';
import type {
  ComponentRegistration,
  CompositionDataSource,
  CompositionUnboundValues,
  DesignTokensDefinition,
} from '@contentful/experience-builder-core/types';
import { create } from 'zustand';
import { componentRegistry } from './registries';
import { isEqual } from 'lodash-es';

export interface InitEditorParams {
  componentRegistry: Map<string, ComponentRegistration>;
  designTokens: DesignTokensDefinition;
  initialLocale: string;
}
export interface EditorStore {
  dataSource: CompositionDataSource;
  locale: string | null;
  selectedNodeId: string | null;
  selectedAssemblyChildId: string | null;
  unboundValues: CompositionUnboundValues;
  // updaters
  setDataSource: (data: CompositionDataSource) => void;
  setUnboundValues: (values: CompositionUnboundValues) => void;
  setLocale: (locale: string) => void;
  setSelectedNodeId: (id: string, assemblyChildId?: string) => void;

  initializeEditor: (params: InitEditorParams) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  dataSource: {},
  unboundValues: {},
  isDragging: false,
  dragItem: '',
  selectedNodeId: null,
  selectedAssemblyChildId: null,
  locale: null,

  setSelectedNodeId: (id: string, assemblyChildId?: string) => {
    console.log('set selected node', id, assemblyChildId);
    set({ selectedNodeId: id, selectedAssemblyChildId: assemblyChildId || null });
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

    // Re-register the design tokens with the Visual Editor's instance of the experience-builder-core package
    defineDesignTokens(designTokens);

    set({ locale: initialLocale });
  },
}));
