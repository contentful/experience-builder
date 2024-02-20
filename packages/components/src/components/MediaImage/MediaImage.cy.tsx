import { constants } from '@/utils/constants';
import { MediaImage } from './MediaImage';
import React from 'react';

describe('MediaImage', () => {
  it('mounts', () => {
    cy.mount(<MediaImage src={constants.placeholderImage} />);
    cy.get('img').invoke('attr', 'src').should('eq', constants.placeholderImage);
  });

  it('renders null when no src specified', () => {
    cy.mount(<MediaImage src={''} />);
    cy.get('img').should('not.exist');
  });

  it('renders at the proper width', () => {
    cy.mount(<MediaImage src={constants.placeholderImage} width={300} />);
    cy.get('img').invoke('attr', 'width').should('eq', '300');
  });

  it('additional props should be passed to the image', () => {
    cy.mount(<MediaImage src={constants.placeholderImage} data-foo="bar" />);
    cy.get('img').should('have.attr', 'data-foo', 'bar');
  });

  it('when className is provided, it should be added to the image', () => {
    cy.mount(<MediaImage src={constants.placeholderImage} className="custom-class" />);
    cy.get('img').should('have.class', 'custom-class');
  });

  it('has a default class of "cf-media-image"', () => {
    cy.mount(<MediaImage src={constants.placeholderImage} />);
    cy.get('img').should('have.class', 'cf-media-image');
  });
});
