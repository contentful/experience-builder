import { placeholderImage } from '@/utils/constants';
import { Image } from './Image';
import React from 'react';
import { OptimizedImageAsset } from '@contentful/experience-builder-core/types';

let file: OptimizedImageAsset;

describe('Image', () => {
  beforeEach(() => {
    file = {
      url: `${placeholderImage}?w=500`,
      srcSet: [`${placeholderImage}?w=125 125w`, `${placeholderImage}?w=250 250w`],
      sizes: '250px',
      file: {
        url: placeholderImage,
        details: { size: 1234567, image: { width: 800, height: 450 } },
        fileName: 'myImage.jpeg',
        contentType: 'image/jpeg',
      },
    };
  });

  it('mounts', () => {
    cy.mount(<Image src={placeholderImage} />);
    cy.get('img').invoke('attr', 'src').should('eq', placeholderImage);
  });

  it('renders default image when no src or cfImageAsset are specified', () => {
    cy.mount(<Image />);
    cy.get('img').invoke('attr', 'src').should('eq', placeholderImage);
  });

  it('renders at the proper width', () => {
    cy.mount(<Image src={placeholderImage} width={300} />);
    cy.get('img').invoke('attr', 'width').should('eq', '300');
  });

  it('when cfImageAsset is a string, it should be used as the src', () => {
    cy.mount(<Image cfImageAsset={placeholderImage} />);
    cy.get('img').invoke('attr', 'src').should('eq', placeholderImage);
  });

  it('when cfImageAsset is an object, it should set the src as the url of the object as a fallback', () => {
    cy.mount(<Image cfImageAsset={file} />);
    cy.get('img').invoke('attr', 'src').should('eq', file.url);
  });

  it('when cfImageAsset is an object, it should set the srcSet of the image tag to the srcSet of the object', () => {
    cy.mount(<Image cfImageAsset={file} />);
    cy.get('img').invoke('attr', 'srcset').should('eq', file.srcSet!.join(', '));
  });

  it.only('when cfImageAsset is an object, it should set the sizes of the image tag to the sizes of the object', () => {
    cy.mount(<Image cfImageAsset={file} />);
    cy.get('img').invoke('attr', 'sizes').should('eq', file.sizes);
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
