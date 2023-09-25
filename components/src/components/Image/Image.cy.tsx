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

  it('additional props should be passed to the image', () => {
    cy.mount(<Image url={constants.placeholderImage} data-foo="bar" />);
    cy.get('img').should('have.attr', 'data-foo', 'bar');
  });

  it('when className is provided, it should be added to the image', () => {
    cy.mount(<Image url={constants.placeholderImage} className="custom-class" />);
    cy.get('img').should('have.class', 'custom-class');
  });

  it('has a default class of "cf-image"', () => {
    cy.mount(<Image url={constants.placeholderImage} />);
    cy.get('img').should('have.class', 'cf-image');
  });
});
