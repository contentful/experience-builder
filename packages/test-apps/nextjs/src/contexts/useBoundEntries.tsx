'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Entry } from 'contentful';

type BoundEntriesContextType = {
  entries: Entry[];
  selectedIndex: number;
  setSelectedIndex: (arg0: number) => void;
  selectedEntry: Entry | null;
};

const BoundEntriesContext = createContext<BoundEntriesContextType | undefined>({
  entries: [],
  selectedIndex: 0,
  setSelectedIndex: () => {},
  selectedEntry: null,
});

export const BoundEntriesProvider: React.FC<{ children: ReactNode; entries: Entry[] }> = ({
  children,
  entries,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const selectedEntry = entries[selectedIndex] || null;

  return (
    <BoundEntriesContext.Provider
      value={{ entries, selectedIndex, setSelectedIndex, selectedEntry }}>
      {children}
    </BoundEntriesContext.Provider>
  );
};

export const useBoundEntries = (): BoundEntriesContextType => {
  const context = useContext(BoundEntriesContext);
  if (!context) {
    throw new Error('useBoundEntries must be used within a BoundEntriesProvider');
  }
  return context;
};
