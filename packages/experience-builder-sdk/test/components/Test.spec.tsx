import React from 'react';

import { render } from '@testing-library/react';

import { Test } from './Test';

describe('test', () => {
  test('should be ok', () => {
    expect(true).toBe(true);
  });

  test('should also be ok', () => {
    const { getByTestId } = render(<Test />);
    expect(getByTestId('test')).toBeInTheDocument();
    expect(getByTestId('test')).toHaveTextContent('Test');
  });
});
