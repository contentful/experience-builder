import React from 'react';

export type MissingComponentPlaceholderProps = {
  blockId: string;
};

export const MissingComponentPlacehoder = ({ blockId }) => {
  return (
    <div
      style={{
        border: '1px solid red',
        width: '100%',
        height: '100%',
      }}>
      Missing component &apos;{blockId}&apos;
    </div>
  );
};
