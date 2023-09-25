import { Heading } from './Heading';
import React from 'react';

describe('Heading', () => {
  it('mounts', () => {
    cy.mount(<Heading text="My Heading" />);
    cy.get('h1').contains('My Heading');
  });

  it('mounts with type', () => {
    cy.mount(<Heading text="My Heading" type="h2" />);
    cy.get('h2').contains('My Heading');
  });

  it('when no text is provided, renders children', () => {
    cy.mount(<Heading type="h3">My Heading</Heading>);
    cy.get('h3').contains('My Heading');
  });

  it('when text and children are provided, renders text', () => {
    cy.mount(
      <Heading text="Text text" type="h4">
        Children text
      </Heading>
    );
    cy.get('h4').contains('Text text');
  });

  it('additional props should be passed to the heading', () => {
    cy.mount(
      <Heading text="My Heading" data-foo="bar">
        Children text
      </Heading>
    );
    cy.get('h1').should('have.attr', 'data-foo', 'bar');
  });

  it('when className is provided, it should be added to the heading', () => {
    cy.mount(<Heading text="My Heading" className="custom-class" />);
    cy.get('h1').should('have.class', 'custom-class');
  });

  it('has a default class of "cf-heading"', () => {
    cy.mount(<Heading text="My Heading" />);
    cy.get('h1').should('have.class', 'cf-heading');
  });
});
