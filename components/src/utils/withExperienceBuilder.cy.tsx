import React from 'react';
import { withExperienceBuilder } from './withExperienceBuilder';

const MyButton: React.FC<React.PropsWithChildren> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

describe('withExperienceBuilder', () => {
  describe('when component is wrapped', () => {
    const ExperienceBuilderButton = withExperienceBuilder(
      MyButton,
      {
        id: 'button',
        name: 'Button',
        category: 'Components',
        variables: {},
      },
      { wrapComponent: true }
    );

    it('events should be bound to the container div', () => {
      const onClickSpy = cy.spy().as('onClickSpy');
      const onMouseDownSpy = cy.spy().as('onMouseDownSpy');
      const onMouseUpSpy = cy.spy().as('onMouseUpSpy');
      cy.mount(
        <ExperienceBuilderButton
          onClick={onClickSpy}
          onMouseDown={onMouseDownSpy}
          onMouseUp={onMouseUpSpy}
          className="my-div" //so we can select it later
        >
          Click me
        </ExperienceBuilderButton>
      );
      cy.get('div.my-div').click();
      cy.get('@onClickSpy').should('have.been.calledOnce');
      cy.get('@onMouseDownSpy').should('have.been.calledOnce');
      cy.get('@onMouseUpSpy').should('have.been.calledOnce');
    });

    it('extra props should be passed to the container div', () => {
      cy.mount(
        <ExperienceBuilderButton
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="my-div" //so we can select it later
        >
          Click me
        </ExperienceBuilderButton>
      );

      cy.get('div.my-div').should('have.attr', 'data-cf-node-block-id', 'test1');
      cy.get('div.my-div').should('have.attr', 'data-cf-node-block-type', 'test2');
      cy.get('div.my-div').should('have.attr', 'data-cf-node-id', 'test3');
    });

    it('can wrap a component with a custom tag', () => {
      const ExperienceBuilderButtonSpan = withExperienceBuilder(
        MyButton,
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
          className="my-span" //so we can select it later
        >
          Click me
        </ExperienceBuilderButtonSpan>
      );
      cy.get('span.my-span').should('exist').find('button').contains('Click me');
    });

    it('classes get added to the correct elements', () => {
      cy.mount(
        <ExperienceBuilderButton
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="my-wrapper" //so we can select it later
          classes="my-class"
          data-caca="yep">
          Click me
        </ExperienceBuilderButton>
      );
      cy.get('div.my-wrapper').should('have.class', 'my-wrapper');
      cy.get('button').should('have.class', 'my-class');
      cy.get('button').should('have.attr', 'data-caca', 'yep');
    });
  });

  describe('when component is not wrapped', () => {
    const ExperienceBuilderButton = withExperienceBuilder(
      MyButton,
      {
        id: 'button',
        name: 'Button',
        category: 'Components',
        variables: {},
      },
      { wrapComponent: false }
    );

    it('classes should be applied to the component itself', () => {
      cy.mount(<ExperienceBuilderButton classes="test">Click me</ExperienceBuilderButton>);
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
          onMouseUp={onMouseUpSpy}>
          Click me
        </ExperienceBuilderButton>
      );
      cy.get('button').first().click();
      cy.get('@onClickSpy').should('have.been.calledOnce');
      cy.get('@onMouseDownSpy').should('have.been.calledOnce');
      cy.get('@onMouseUpSpy').should('have.been.calledOnce');
    });

    it('extra props should be passed to the component', () => {
      cy.mount(
        <ExperienceBuilderButton
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3">
          Click me
        </ExperienceBuilderButton>
      );
      cy.get('button').should('have.attr', 'data-cf-node-block-id', 'test1');
      cy.get('button').should('have.attr', 'data-cf-node-block-type', 'test2');
      cy.get('button').should('have.attr', 'data-cf-node-id', 'test3');
    });

    it('classes get added to the correct elements', () => {
      cy.mount(
        <ExperienceBuilderButton
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="my-button" //so we can select it later
          classes="my-class">
          Click me
        </ExperienceBuilderButton>
      );
      cy.get('button').should('have.class', 'my-button');
      cy.get('button').should('have.class', 'my-class');
    });
  });
});
