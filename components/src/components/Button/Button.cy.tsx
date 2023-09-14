import { Button } from './Button';
import React from 'react';

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

  it('when targetUrl is provided it calls onNavigate handler', () => {
    const onNavigateSpy = cy.spy().as('onNavigate');
    cy.mount(
      <Button targetUrl="https://www.contentful.com" onNavigate={onNavigateSpy}>
        Click Me!
      </Button>
    );
    cy.get('button').click();
    cy.get('@onNavigate').should('have.been.calledWith', 'https://www.contentful.com');
  });

  it('when onNavigate is provided but targetUrl is not, onNavigate should not be called', () => {
    const onNavigateSpy = cy.spy().as('onNavigate');
    cy.mount(<Button onNavigate={onNavigateSpy}>Click Me!</Button>);
    cy.get('button').click();
    cy.get('@onNavigate').should('not.have.been.called');
  });

  it('when there is a label (but no children), the label should be rendered', () => {
    cy.mount(<Button label="Click Me!" />);
    cy.get('button').contains('Click Me!');
  });

  it('when there is a label and children, the children should be rendered', () => {
    cy.mount(<Button label="Click Me!">Children text</Button>);
    cy.get('button').contains('Children text');
  });
});
