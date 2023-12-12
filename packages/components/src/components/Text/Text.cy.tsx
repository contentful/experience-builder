import { Text } from './Text';
import React from 'react';

describe('Text', () => {
  it('mounts', () => {
    cy.mount(<Text value="My Text" />);
    cy.get('p').contains('My Text');
  });

  it('mounts with specific tag', () => {
    cy.mount(<Text value="My Text" as="div" />);
    cy.get('div').contains('My Text');
  });

  it('when no value is provided, renders children', () => {
    cy.mount(<Text>My Text</Text>);
    cy.get('p').contains('My Text');
  });

  it('when value and children are provided, renders text', () => {
    cy.mount(<Text value="Text text">Children text</Text>);
    cy.get('p').contains('Text text');
  });

  it('additional props should be passed to the text', () => {
    cy.mount(
      <Text value="My Text" data-foo="bar">
        Children text
      </Text>
    );
    cy.get('p').should('have.attr', 'data-foo', 'bar');
  });

  it('when className is provided, it should be added to the text', () => {
    cy.mount(<Text value="My Text" className="custom-class" />);
    cy.get('p').should('have.class', 'custom-class');
  });

  it('has a default class of "cf-text"', () => {
    cy.mount(<Text value="My Text" />);
    cy.get('p').should('have.class', 'cf-text');
  });
});
