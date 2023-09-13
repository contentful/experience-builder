import React from 'react';
import Button from './Button';

describe('<Button />', () => {
  it('renders with text', () => {
    cy.mount(<Button>Click Me!</Button>);
    cy.get('button').contains('Click Me!');
  });

  it('when clicked it calls onClick handler', () => {
    const onClickSpy = cy.spy().as('onClick');
    cy.mount(<Button onClick={onClickSpy}>Click Me!</Button>);
    cy.get('button').click();
    cy.get('@onClick').should('have.been.calledOnce');
  });
});
