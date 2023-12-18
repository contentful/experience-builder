import { CSSProperties } from 'react';
import { create } from 'zustand';

export interface PlaceholderStyleStore {
  style: CSSProperties;
  updateStyle: (style: CSSProperties) => void;
}

export const usePlaceholderStyleStore = create<PlaceholderStyleStore>((set) => ({
  style: {},
  updateStyle(style) {
    set({ style });
  },
}));
