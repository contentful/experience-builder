import { RichText } from './RichText';
import { Document, BLOCKS } from '@contentful/rich-text-types';
import React from 'react';

describe('RichText', () => {
  const document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [{ nodeType: 'text', value: 'abc', marks: [], data: {} }],
      },
    ],
  };

  it('mounts', () => {
    cy.mount(<RichText value={document} />);
    cy.get('div').contains('abc');
  });

  it('additional props should be passed to the rich text', () => {
    cy.mount(<RichText value={document} data-foo="bar" />);
    cy.get('div[class="cf-richtext"]').should('have.attr', 'data-foo', 'bar');
  });

  it('when className is provided, it should be added to the rich text', () => {
    cy.mount(<RichText value={document} className="custom-class" />);
    cy.get('div').should('have.class', 'custom-class');
  });

  it('has a default class of "cf-richtext"', () => {
    cy.mount(<RichText value={document} />);
    cy.get('div[class="cf-richtext"]').should('have.class', 'cf-richtext');
  });
});
