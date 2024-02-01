import React from 'react';
import { create } from 'zustand';

export interface InferredDirectionStore {
  itemStyles: React.CSSProperties | undefined;
  setItemStyles: (itemStyles: React.CSSProperties | undefined) => void;
}

export const useInferredDirectionStore = create<InferredDirectionStore>((set) => ({
  itemStyles: undefined,
  setItemStyles(itemStyles: React.CSSProperties | undefined) {
    set({ itemStyles });
  },
}));
