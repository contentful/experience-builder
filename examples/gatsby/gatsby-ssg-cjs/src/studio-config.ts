// File is mjs so it can be imported in gatsby-node.mjs as well
const { defineDesignTokens } = require('@contentful/experiences-core');

defineDesignTokens({
  color: {
    MyBlue: 'cornflowerblue',
  },
});
