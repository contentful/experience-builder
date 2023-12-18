import { EditorModeEntityStore } from '@contentful/experience-builder-core';
import type {
  ComponentRegistration,
  CompositionDataSource,
  CompositionUnboundValues,
} from '@contentful/experience-builder-core/types';
import { create } from 'zustand';

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
  componentRegistry: Map<string, ComponentRegistration>;

  // updaters
  setDataSource: (data: CompositionDataSource) => void;
  setUnboundValues: (values: CompositionUnboundValues) => void;
  setLocale: (locale: string) => void;
  setSelectedNodeId: (id: string) => void;
  setEntityStore: (store: EditorModeEntityStore) => void;

  initializeEditor: (params: InitEditorParams) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  dataSource: {},
  unboundValues: {},
  isDragging: false,
  dragItem: '',
  selectedNodeId: null,
  locale: null,
  entityStore: undefined,
  componentRegistry: new Map(),

  setSelectedNodeId: (id: string) => {
    set({ selectedNodeId: id });
  },
  setDataSource(data) {
    set({ dataSource: data });
  },
  setUnboundValues(values) {
    set({ unboundValues: values });
  },
  setLocale(locale) {
    set({ locale });
  },
  setEntityStore(store) {
    set({ entityStore: store });
  },
  initializeEditor({ componentRegistry, initialLocale }) {
    set({ locale: initialLocale, componentRegistry });
  },
}));
