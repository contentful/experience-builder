import { placeholderImage } from '@/utils/constants';
import { Image } from './Image';
import React from 'react';
import { ImageOptions, OptimizedImageAsset } from '@contentful/experiences-core/types';

let options: ImageOptions;

describe('Image', () => {
  beforeEach(() => {
    options = {
      asset: {
        url: `${placeholderImage}?w=500`,
        srcSet: [`${placeholderImage}?w=125 125w`, `${placeholderImage}?w=250 250w`],
        file: {
          url: placeholderImage,
          details: { size: 1234567, image: { width: 800, height: 450 } },
          fileName: 'myImage.jpeg',
          contentType: 'image/jpeg',
        },
      },
      width: '500px',
      height: '500px',
      objectFit: 'contain',
      objectPosition: 'center center',
      quality: '100',
      format: 'jpg',
      targetSize: '500px',
    };
  });

  it('mounts', () => {
    cy.mount(<Image src={placeholderImage} />);
    cy.get('img').invoke('attr', 'src').should('eq', placeholderImage);
  });

  it('renders default image when no src or cfImage are specified', () => {
    cy.mount(<Image />);
    cy.get('.cf-no-image').should('exist');
    cy.get('.cf-no-image img').should('exist');
    cy.get('.cf-no-image svg').should('exist');
  });

  it('renders at the proper width', () => {
    cy.mount(<Image src={placeholderImage} width={300} />);
    cy.get('img').invoke('attr', 'width').should('eq', '300');
  });

  it('when cfImage is a string, it should be used as the src', () => {
    cy.mount(<Image cfImage={options} />);
    cy.get('img').invoke('attr', 'src').should('eq', placeholderImage);
  });

  it('when cfImage is an object, it should set the src as the url of the object as a fallback', () => {
    cy.mount(<Image cfImage={options} />);
    cy.get('img')
      .invoke('attr', 'src')
      .should('eq', (options.asset as OptimizedImageAsset).url);
  });

  it('when cfImage is an object, it should set the srcSet of the image tag to the srcSet of the object', () => {
    cy.mount(<Image cfImage={options} />);
    cy.get('img')
      .invoke('attr', 'srcset')
      .should('eq', (options.asset as OptimizedImageAsset).srcSet!.join(', '));
  });

  it('when cfImage is an object, it should set the sizes of the image tag to the sizes of the object', () => {
    cy.mount(<Image cfImage={options} />);
    cy.get('img').invoke('attr', 'sizes').should('eq', options.targetSize);
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
