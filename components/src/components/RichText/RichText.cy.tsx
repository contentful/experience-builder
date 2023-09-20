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
    cy.get('p').contains('abc');
  });
});
