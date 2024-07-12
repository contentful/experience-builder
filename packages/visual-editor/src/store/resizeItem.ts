import { create } from 'zustand';

export interface ResizeStore {
  isResize: boolean;
  resizingComponentId: string;
  setIsResize: (isResize: boolean) => void;
  setResizingComponent: (componentId: string) => void;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;

  setInitialCoords: ({ x, y }: { x: number; y: number }) => void;
  setInitialSize: ({ width, height }: { width: number; height: number }) => void;
}

export const useResizeStore = create<ResizeStore>((set) => ({
  resizingComponentId: '',
  isResize: false,
  initialX: 0,
  initialY: 0,
  initialHeight: 0,
  initialWidth: 0,
  setResizingComponent(componentId) {
    set({ resizingComponentId: componentId });
  },
  setIsResize(isResize) {
    set({ isResize });
  },
  setInitialSize({ width, height }) {
    set({ initialHeight: height, initialWidth: width });
  },
  setInitialCoords({ x, y }) {
    set({ initialX: x, initialY: y });
  },
}));
