import React from 'react';
import { withComponentWrapper } from './withComponentWrapper';
import { fireEvent, render } from '@testing-library/react';

const MyButton: React.FC<React.PropsWithChildren> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

describe('withComponentWrapper', () => {
  beforeEach(() => {
    // mute noisy console logs
    global.console = { ...global.console, error: jest.fn(), log: jest.fn(), warn: jest.fn() };
  });

  describe('when component is wrapped', () => {
    const WrappedButton = withComponentWrapper(MyButton);

    it('can wrap a component with a custom tag', () => {
      const WrappedButtonSpan = withComponentWrapper(MyButton, { wrapContainerTag: 'span' });

      const { container } = render(
        <WrappedButtonSpan className="my-span">Click me</WrappedButtonSpan>,
      );

      expect(container.firstChild).toHaveClass('my-span');
      expect(container.firstChild).toHaveTextContent('Click me');
    });

    it('classes get added to the correct elements', () => {
      const { container, getByRole } = render(
        <WrappedButton
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="my-wrapper"
          classes="my-class"
          data-caca="yep">
          Click me
        </WrappedButton>,
      );

      expect(container.firstChild).toHaveClass('my-wrapper');
      expect(getByRole('button')).toHaveClass('my-class');
      expect(getByRole('button')).toHaveAttribute('data-caca', 'yep');
    });
  });

  describe('when component is not wrapped', () => {
    const Button = withComponentWrapper(MyButton, { wrapComponent: false });

    it('classes should be applied to the component itself', () => {
      const { getByRole } = render(<Button classes="test">Click me</Button>);
      expect(getByRole('button')).toHaveClass('test');
    });

    it('events should be bound to the component itself', () => {
      const onClickSpy = jest.fn();
      const onMouseDownSpy = jest.fn();
      const onMouseUpSpy = jest.fn();

      const { container } = render(
        <Button onClick={onClickSpy} onMouseDown={onMouseDownSpy} onMouseUp={onMouseUpSpy}>
          Click me
        </Button>,
      );

      fireEvent.click(container.firstChild!);
      expect(onClickSpy).toHaveBeenCalledTimes(1);

      fireEvent.mouseDown(container.firstChild!);
      expect(onMouseDownSpy).toHaveBeenCalledTimes(1);

      fireEvent.mouseUp(container.firstChild!);
      expect(onMouseUpSpy).toHaveBeenCalledTimes(1);
    });

    it('extra props should be passed to the component', () => {
      const { container } = render(
        <Button
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3">
          Click me
        </Button>,
      );
      expect(container.firstChild).toHaveAttribute('data-cf-node-block-id', 'test1');
      expect(container.firstChild).toHaveAttribute('data-cf-node-block-type', 'test2');
      expect(container.firstChild).toHaveAttribute('data-cf-node-id', 'test3');
    });

    it('classes get added to the correct elements', () => {
      const { container } = render(
        <Button
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="my-button" //so we can select it later
          classes="my-class">
          Click me
        </Button>,
      );
      expect(container.firstChild).toHaveClass('my-button');
      expect(container.firstChild).toHaveClass('my-class');
    });
  });
});
