import React from 'react';

const NinetailedVariantRenderer: React.FC<React.PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <>
      <pre>{JSON.stringify(rest, null, 2)}</pre>
      {children}
    </>
  );
};

export default NinetailedVariantRenderer;
