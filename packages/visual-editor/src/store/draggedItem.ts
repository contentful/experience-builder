import { DragStart, DragUpdate } from '@hello-pangea/dnd';
import { create } from 'zustand';

export type DraggedItem = DragStart & Partial<DragUpdate>;

export interface DraggedItemStore {
  componentId: string;
  setComponentId: (id: string) => void;
  draggedItem?: DraggedItem;
  updateItem: (item?: DraggedItem) => void;
  isBeforeCapture: boolean;
  setBeforeCapture: (isBeforeCapture?: boolean) => void;
}

export const useDraggedItemStore = create<DraggedItemStore>((set) => ({
  draggedItem: undefined,
  componentId: '',
  isBeforeCapture: false,
  setComponentId(id) {
    set({ componentId: id });
  },
  updateItem: (item) => {
    set({ draggedItem: item });
  },
  setBeforeCapture: (isBeforeCapture) => {
    set({ isBeforeCapture });
  },
}));
