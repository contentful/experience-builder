import { Direction } from '@hello-pangea/dnd';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Zone {
  id: string;
  direction: Direction;
}

interface State {
  hoveringZone: string;
  hoveringSection: string;
  sectionsWithZones: Record<string, boolean>;
  zones: Record<string, Zone>;
}

interface Actions {
  upsertZone: (id: string, data: Partial<Zone>) => void;
  setHoveringZone: (zoneId: string) => void;
  setHoveringSection: (sectionId: string) => void;
  addSectionWithZone: (sectionId: string) => void;
}

export const useZoneStore = create<Actions & State>()(
  immer((set) => ({
    zones: {},
    hoveringSection: '',
    hoveringZone: '',
    sectionsWithZones: {},
    setHoveringZone(zoneId) {
      set({
        hoveringZone: zoneId,
      });
    },
    setHoveringSection(sectionId) {
      set({
        hoveringSection: sectionId,
      });
    },
    addSectionWithZone(sectionId) {
      set((state) => {
        state.sectionsWithZones[sectionId] = true;
      });
    },
    upsertZone(id, data) {
      set((state) => {
        state.zones[id] = { ...(state.zones[id] || {}), ...data };
      });
    },
  }))
);
