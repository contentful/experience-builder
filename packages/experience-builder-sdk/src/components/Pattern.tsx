import React from 'react';

const patternStyle = { display: 'contents' };

// Feel free to do any magic as regards variable definitions for patterns
// Or if this isn't necessary by the time we figure that part out, we can bid this part farewell
export const Pattern = ({ ...props }) => {
  // Using a display contents so pattern content/children
  // can appear as if they are direct children of the div wrapper's parent
  return <div data-test-id="pattern" {...props} style={patternStyle} />;
};
