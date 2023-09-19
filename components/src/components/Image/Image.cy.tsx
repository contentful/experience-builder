import constants from '@/utils/constants';
import { Image } from './Image';
import React from 'react';

describe('Image', () => {
  it('mounts', () => {
    cy.mount(<Image url={constants.placeholderImage} />);
    cy.get('img').invoke('attr', 'src').should('eq', constants.placeholderImage);
  });
  it('renders null when no url specified', () => {
    cy.mount(<Image url={''} />);
    cy.get('img').should('not.exist');
  });
  it('renders at the proper width', () => {
    cy.mount(<Image url={constants.placeholderImage} width={300} />);
    cy.get('img').invoke('attr', 'width').should('eq', '300');
  });
});
