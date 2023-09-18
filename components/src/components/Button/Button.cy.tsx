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

  it('when url is provided it calls onNavigate handler', () => {
    const onNavigateSpy = cy.spy().as('onNavigateSpy');
    cy.mount(
      <Button
        url="https://www.contentful.com"
        target="_blank"
        onNavigate={(url, target) => {
          // dev can now do route via code
          onNavigateSpy(url, target);
        }}>
        Click Me!
      </Button>
    );
    cy.get('button').click();
    cy.get('@onNavigateSpy').should('have.been.calledWith', 'https://www.contentful.com', '_blank');
  });

  it('when url is provided it wraps an anchor tag around the button', () => {
    cy.mount(<Button url="https://www.contentful.com">Click Me!</Button>);
    cy.get('a').should('have.attr', 'href', 'https://www.contentful.com');
  });

  it('when url is provided and button is clicked, a navigation should take place', () => {
    cy.mount(<Button url="/testpage">Click Me!</Button>);
    const onClickSpy = cy.spy().as('onClickSpy');
    cy.get('a').then(($a) => {
      //spy on anchors click event
      $a.on('click', (e) => {
        onClickSpy(e);
        e.preventDefault();
      });
    });
    cy.get('button').click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
  });

  it('when url is not provided, it does not wrap an anchor tag around the button', () => {
    cy.mount(<Button>Click Me!</Button>);
    cy.get('a').should('not.exist');
  });

  it('when onNavigate is provided but url is not, onNavigate should not be called', () => {
    const onNavigateSpy = cy.spy().as('onNavigate');
    cy.mount(<Button onNavigate={onNavigateSpy}>Click Me!</Button>);
    cy.get('button').click();
    cy.get('@onNavigate').should('not.have.been.called');
  });

  it('when there is a label (but no children), the label should be rendered', () => {
    cy.mount(<Button label="Click Me!" />);
    cy.get('button').contains('Click Me!');
  });

  it('when there is a label and children, the label should be rendered', () => {
    cy.mount(<Button label="Label text">Children text</Button>);
    cy.get('button').contains('Label text');
  });

  it('when there is an empty label and children, the children should be rendered', () => {
    cy.mount(<Button label="">Children text</Button>);
    cy.get('button').contains('Children text');
  });

  it('when clicked, the onClick handler should give access to the url and target data-*  properties via currentTarget', () => {
    const onClickSpy = cy.spy().as('onClick');
    cy.mount(
      <Button
        url="https://www.contentful.com"
        target="_blank"
        onClick={(e) => {
          onClickSpy(e.currentTarget.dataset.url, e.currentTarget.dataset.target);
        }}>
        Click Me!
      </Button>
    );
    //need to get access to the anchors click event and prevent it so the browser doesn't leave the page
    cy.get('a').then(($a) => {
      $a.on('click', (e) => {
        e.preventDefault();
      });
    });
    cy.get('button').click();
    cy.get('@onClick').should('have.been.calledWith', 'https://www.contentful.com', '_blank');
  });
});
