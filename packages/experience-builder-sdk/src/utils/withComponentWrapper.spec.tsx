import React from 'react';
import { withComponentWrapper } from './withComponentWrapper';
import { render, screen } from '@testing-library/react';

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

    it('passes all required attribuets to the wrapper and the rest to the component', () => {
      const { container } = render(
        <WrappedButton
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="cfstyles-randomhash"
          data-caca="yep">
          Click me
        </WrappedButton>,
      );

      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
      expect(container.firstChild).toHaveClass('cfstyles-randomhash');
      expect(container.firstChild).toHaveAttribute('data-cf-node-block-id', 'test1');
      expect(container.firstChild).toHaveAttribute('data-cf-node-block-type', 'test2');
      expect(container.firstChild).toHaveAttribute('data-cf-node-id', 'test3');

      expect(screen.getByRole('button')).not.toHaveClass('cfstyles-randomhash');
      expect(screen.getByRole('button')).not.toHaveAttribute('data-cf-node-block-id', 'test1');
      expect(screen.getByRole('button')).not.toHaveAttribute('data-cf-node-block-type', 'test2');
      expect(screen.getByRole('button')).not.toHaveAttribute('data-cf-node-id', 'test3');
      expect(screen.getByRole('button')).toHaveAttribute('data-caca', 'yep');
    });
  });

  describe('when component is not wrapped', () => {
    const Button = withComponentWrapper(MyButton, { wrapComponent: false });

    it('passes all required attributes to the component', () => {
      const { container } = render(
        <Button
          data-cf-node-block-id="test1"
          data-cf-node-block-type="test2"
          data-cf-node-id="test3"
          className="cfstyles-randomhash">
          Click me
        </Button>,
      );
      expect(container.firstChild).toBeInstanceOf(HTMLButtonElement);
      expect(container.firstChild).toHaveClass('cfstyles-randomhash');
      expect(container.firstChild).toHaveAttribute('data-cf-node-block-id', 'test1');
      expect(container.firstChild).toHaveAttribute('data-cf-node-block-type', 'test2');
      expect(container.firstChild).toHaveAttribute('data-cf-node-id', 'test3');
    });
  });
});
