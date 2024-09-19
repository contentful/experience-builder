import { useNinetailedContainer } from '@/utils/useNinetailedContainer';
import React from 'react';

const NinetailedVariantContainer: React.FC<React.PropsWithChildren> = ({ children, ...rest }) => {
  const { selectedVariantContainerId } = useNinetailedContainer();

  if (selectedVariantContainerId !== rest['data-cf-node-id']) {
    return null;
  }

  return (
    <>
      {/* <span>Variant Container {rest['data-cf-node-id']}</span> */}
      {children}
    </>
  );
};

export default NinetailedVariantContainer;
