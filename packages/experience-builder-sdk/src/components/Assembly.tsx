import React from 'react';

const assemblyStyle = { display: 'contents' };

// Feel free to do any magic as regards variable definitions for assemblies
// Or if this isn't necessary by the time we figure that part out, we can bid this part farewell
export const Assembly = ({ ...props }) => {
  // Using a display contents so assembly content/children
  // can appear as if they are direct children of the div wrapper's parent
  return <div data-test-id="assembly" {...props} style={assemblyStyle} />;
};
