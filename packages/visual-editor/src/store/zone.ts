import { create } from 'zustand';

import { produce } from 'immer';
export interface Zone {
  id: string;
}

interface State {
  hoveringZone: string;
  zones: Record<string, Zone>;
}

interface Actions {
  upsertZone: (id: string, data: Partial<Zone>) => void;
  setHoveringZone: (zoneId: string) => void;
}

export const useZoneStore = create<Actions & State>()((set) => ({
  zones: {},
  hoveringZone: '',
  setHoveringZone(zoneId) {
    set({
      hoveringZone: zoneId,
    });
  },
  upsertZone(id, data) {
    set(
      produce((state) => {
        state.zones[id] = { ...(state.zones[id] || {}), ...data };
      }),
    );
  },
}));
