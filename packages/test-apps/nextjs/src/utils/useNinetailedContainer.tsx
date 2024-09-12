import React, { createContext, useContext } from 'react';

// Define the shape of your context value
interface NinetailedContainerContextValue {
  // Add your context properties and methods here
  selectedVariantContainerId: string;
}

// Create the context
const NinetailedContainerContext = createContext<NinetailedContainerContextValue | undefined>(
  undefined,
);

// Create a custom hook to access the context
export function useNinetailedContainer(): NinetailedContainerContextValue {
  const context = useContext(NinetailedContainerContext);
  if (!context) {
    throw new Error('useNinetailedContainer must be used within a NinetailedContainerProvider');
  }
  return context;
}

// Create a provider component to wrap your app
export function NinetailedContainerProvider({
  children,
  selectedVariantContainerId,
}: {
  children: React.ReactNode;
  selectedVariantContainerId: string;
}) {
  // Add your context state and methods here

  const value: NinetailedContainerContextValue = {
    selectedVariantContainerId: selectedVariantContainerId,
  };

  return (
    <NinetailedContainerContext.Provider value={value}>
      {children}
    </NinetailedContainerContext.Provider>
  );
}
