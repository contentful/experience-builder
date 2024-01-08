import { Direction } from '@hello-pangea/dnd';
import { create } from 'zustand';

import { produce } from 'immer';
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

export const useZoneStore = create<Actions & State>()((set) => ({
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
    set(
      produce((state) => {
        state.sectionsWithZones[sectionId] = true;
      })
    );
  },
  upsertZone(id, data) {
    set(
      produce((state) => {
        state.zones[id] = { ...(state.zones[id] || {}), ...data };
      })
    );
  },
}));
