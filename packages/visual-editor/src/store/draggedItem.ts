import { DragStart, DragUpdate } from '@hello-pangea/dnd';
import { create } from 'zustand';

export type DraggedItem = DragStart & Partial<DragUpdate>;

export interface DraggedItemStore {
  componentId: string;
  draggedItem?: DraggedItem;
  isDraggingOnCanvas: boolean;
  onBeforeCaptureId: string;
  mouseX: number;
  mouseY: number;
  scrollY: number;
  domRect?: DOMRect;

  // actions
  setComponentId: (id: string) => void;
  updateItem: (item?: DraggedItem) => void;
  setOnBeforeCaptureId: (draggableId: string) => void;
  setMousePosition: (x: number, y: number) => void;
  setScrollY: (y: number) => void;
  setDraggingOnCanvas: (isDraggingOnCanvas: boolean) => void;
  setDomRect: (domRect?: DOMRect) => void;
}

export const useDraggedItemStore = create<DraggedItemStore>((set) => ({
  draggedItem: undefined,
  domRect: undefined,
  componentId: '',
  isDraggingOnCanvas: false,
  onBeforeCaptureId: '',
  mouseX: 0,
  mouseY: 0,
  scrollY: 0,
  setComponentId(id) {
    set({ componentId: id });
  },
  updateItem: (item) => {
    set({ draggedItem: item });
  },
  setDraggingOnCanvas: (isDraggingOnCanvas) => {
    set({ isDraggingOnCanvas });
  },
  setOnBeforeCaptureId: (onBeforeCaptureId) => {
    set({ onBeforeCaptureId });
  },
  setMousePosition(x, y) {
    set({ mouseX: x, mouseY: y });
  },
  setDomRect(domRect) {
    set({ domRect });
  },
  setScrollY(y) {
    set({ scrollY: y });
  },
}));
