import { placeholderImage } from '@/utils/constants';
import { Image } from './Image';
import React from 'react';

describe('Image', () => {
  it('mounts', () => {
    cy.mount(<Image src={placeholderImage} />);
    cy.get('img').invoke('attr', 'src').should('eq', placeholderImage);
  });

  it('renders null when no src specified', () => {
    cy.mount(<Image src={''} />);
    cy.get('img').should('not.exist');
  });

  it('renders at the proper width', () => {
    cy.mount(<Image src={placeholderImage} width={300} />);
    cy.get('img').invoke('attr', 'width').should('eq', '300');
  });

  it('additional props should be passed to the image', () => {
    cy.mount(<Image src={placeholderImage} data-foo="bar" />);
    cy.get('img').should('have.attr', 'data-foo', 'bar');
  });

  it('when className is provided, it should be added to the image', () => {
    cy.mount(<Image src={placeholderImage} className="custom-class" />);
    cy.get('img').should('have.class', 'custom-class');
  });

  it('has a default class of "cf-image"', () => {
    cy.mount(<Image src={placeholderImage} />);
    cy.get('img').should('have.class', 'cf-image');
  });
});
