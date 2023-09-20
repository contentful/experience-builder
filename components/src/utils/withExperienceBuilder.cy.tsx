import React from 'react';
import { Button } from '@components/Button';
import { withExperienceBuilder } from './withExperienceBuilder';

describe('withExperienceBuilder', () => {
  describe('when component is wrapped', () => {
    const ExperienceBuilderButton = withExperienceBuilder(
      Button,
      {
        id: 'button',
        name: 'Button',
        category: 'Components',
        variables: {},
      },
      { wrapComponent: true }
    );

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
          className="my-div" //so we can select it later
        />
      );
      cy.get('div.my-div').click();
      cy.get('@onClickSpy').should('have.been.calledOnce');
      cy.get('@onMouseDownSpy').should('have.been.calledOnce');
      cy.get('@onMouseUpSpy').should('have.been.calledOnce');
    });

    it('extra props should be passed to the container div', () => {
      cy.mount(
        <ExperienceBuilderButton
          label="Click me"
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="my-div" //so we can select it later
        />
      );

      cy.get('div.my-div').should('have.attr', 'data-cf-node-block-id', 'test1');
      cy.get('div.my-div').should('have.attr', 'data-cf-node-block-type', 'test2');
      cy.get('div.my-div').should('have.attr', 'data-cf-node-id', 'test3');
    });

    it('can wrap a component with a custom tag', () => {
      const ExperienceBuilderButtonSpan = withExperienceBuilder(
        Button,
        {
          id: 'button',
          name: 'Button',
          category: 'Components',
          variables: {},
        },
        { wrapComponent: true, wrapContainerTag: 'span' }
      );
      cy.mount(
        <ExperienceBuilderButtonSpan
          label="Click me"
          className="my-span" //so we can select it later
        />
      );
      cy.get('span.my-span').should('exist').find('button').contains('Click me');
    });

    it('classes get added to the correct elements', () => {
      cy.mount(
        <ExperienceBuilderButton
          label="Click me"
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="my-div" //so we can select it later
          classes="my-class"
        />
      );
      cy.get('div.my-div').should('have.class', 'my-div');
      cy.get('button').should('have.class', 'my-class');
    });
  });

  describe('when component is not wrapped', () => {
    const ExperienceBuilderButton = withExperienceBuilder(
      Button,
      {
        id: 'button',
        name: 'Button',
        category: 'Components',
        variables: {},
      },
      { wrapComponent: false }
    );

    it('classes should be applied to the component itself', () => {
      cy.mount(<ExperienceBuilderButton classes="test" label="Click me" />);
      cy.get('button').should('have.class', 'test');
    });

    it('events should be bound to the component itself', () => {
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
      cy.get('button').first().click();
      cy.get('@onClickSpy').should('have.been.calledOnce');
      cy.get('@onMouseDownSpy').should('have.been.calledOnce');
      cy.get('@onMouseUpSpy').should('have.been.calledOnce');
    });

    it('extra props should be passed to the component', () => {
      cy.mount(
        <ExperienceBuilderButton
          label="Click me"
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
        />
      );
      cy.get('button').should('have.attr', 'data-cf-node-block-id', 'test1');
      cy.get('button').should('have.attr', 'data-cf-node-block-type', 'test2');
      cy.get('button').should('have.attr', 'data-cf-node-id', 'test3');
    });

    it('classes get added to the correct elements', () => {
      cy.mount(
        <ExperienceBuilderButton
          label="Click me"
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="my-button" //so we can select it later
          classes="my-class"
        />
      );
      cy.get('button').should('have.class', 'my-button');
      cy.get('button').should('have.class', 'my-class');
    });
  });
});
