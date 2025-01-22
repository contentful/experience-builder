// File is mjs so it can be imported in gatsby-node.mjs as well
import { defineDesignTokens } from '@contentful/experiences-sdk-react';

defineDesignTokens({
  color: {
    MyBlue: 'cornflowerblue',
  },
});
