import { DragStart, DragUpdate } from '@hello-pangea/dnd';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type DraggedItem = (DragStart & Partial<DragUpdate>) | undefined;
export interface DraggedItemState {
  draggedItem: DraggedItem;
}

const initialState: DraggedItemState = {
  draggedItem: undefined,
};

export const draggedItemSlice = createSlice({
  name: 'draggedItem',
  initialState,
  reducers: {
    updateItem: (state, action: PayloadAction<DraggedItem>) => {
      if (!state.draggedItem) {
        state.draggedItem = action.payload;
        return;
      }
      state.draggedItem = { ...state.draggedItem, ...action.payload };
    },
  },
});

export const { updateItem } = draggedItemSlice.actions;

export default draggedItemSlice.reducer;
