import React from 'react';
import { Button } from '@components/Button';
import { withExperienceBuilder } from './withExperienceBuilder';

describe('withExperienceBuilder', () => {
  const ExperienceBuilderButton = withExperienceBuilder(Button, {
    id: 'button',
    name: 'Button',
    category: 'Components',
    variables: {},
  });

  it('classes should be applied to the inner component', () => {
    cy.mount(<ExperienceBuilderButton classes="test" label="Click me" />);
    cy.get('button').should('have.class', 'test');
  });

  it('events should be bound to the container div', () => {
    const onClickSpy = cy.spy().as('onClickSpy');
    const onMouseDownSpy = cy.spy().as('onMouseDownSpy');
    const onMouseUpSpy = cy.spy().as('onMouseUpSpy');
    cy.mount(
      <ExperienceBuilderButton
        onClick={onClickSpy}
        onMouseDown={onMouseDownSpy}
        onMouseUp={onMouseUpSpy}
        label="Click me"
      />
    );
    cy.get('div').first().click();
    cy.get('@onClickSpy').should('have.been.calledOnce');
    cy.get('@onMouseDownSpy').should('have.been.calledOnce');
    cy.get('@onMouseUpSpy').should('have.been.calledOnce');
  });
});
