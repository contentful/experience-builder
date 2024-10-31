import { create } from 'zustand';

export interface DraggedItemStore {
  componentId: string;
  hoveredComponentId?: string;
  isDraggingOnCanvas: boolean;
  onBeforeCaptureId: string;
  mouseX: number;
  mouseY: number;
  scrollY: number;
  domRect?: DOMRect;

  // actions
  setComponentId: (id: string) => void;
  setHoveredComponentId: (id?: string) => void;
  setOnBeforeCaptureId: (draggableId: string) => void;
  setMousePosition: (x: number, y: number) => void;
  setScrollY: (y: number) => void;
  setDraggingOnCanvas: (isDraggingOnCanvas: boolean) => void;
  setDomRect: (domRect?: DOMRect) => void;
}

export const useDraggedItemStore = create<DraggedItemStore>((set) => ({
  draggedItem: undefined,
  hoveredComponentId: undefined,
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
  setHoveredComponentId(id) {
    set({ hoveredComponentId: id });
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
