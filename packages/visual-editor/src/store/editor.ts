import { EditorModeEntityStore } from '@contentful/experience-builder-core';
import type {
  ComponentRegistration,
  CompositionDataSource,
  CompositionUnboundValues,
} from '@contentful/experience-builder-core/types';
import { create } from 'zustand';
import { componentRegistry } from './registries';

export interface InitEditorParams {
  componentRegistry: Map<string, ComponentRegistration>;
  initialLocale: string;
  entityStore: EditorModeEntityStore;
}
export interface EditorStore {
  dataSource: CompositionDataSource;
  locale: string | null;
  selectedNodeId: string | null;
  unboundValues: CompositionUnboundValues;
  entityStore: EditorModeEntityStore | undefined;
  // updaters
  setDataSource: (data: CompositionDataSource) => void;
  setUnboundValues: (values: CompositionUnboundValues) => void;
  setLocale: (locale: string) => void;
  setSelectedNodeId: (id: string) => void;

  initializeEditor: (params: InitEditorParams) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  dataSource: {},
  unboundValues: {},
  isDragging: false,
  dragItem: '',
  selectedNodeId: null,
  locale: null,
  entityStore: undefined,

  setSelectedNodeId: (id: string) => {
    set({ selectedNodeId: id });
  },
  setDataSource(data) {
    const dataSource = get().dataSource;
    set({ dataSource: { ...dataSource, ...data } });
  },
  setUnboundValues(values) {
    set({ unboundValues: values });
  },
  setLocale(locale) {
    const currentLocale = get().locale;

    if (locale === currentLocale) {
      return;
    }

    set({
      locale,
      entityStore: new EditorModeEntityStore({
        entities: [],
        locale: locale,
      }),
    });
  },
  initializeEditor({ componentRegistry: initialRegistry, initialLocale, entityStore }) {
    initialRegistry.forEach((registration) => {
      componentRegistry.set(registration.definition.id, registration);
    });
    set({ locale: initialLocale, entityStore });
  },
}));
