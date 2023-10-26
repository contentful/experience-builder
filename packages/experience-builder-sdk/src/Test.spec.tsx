import React from 'react';

import { render } from '@testing-library/react';

import { Test } from './Test';

jest.mock('./core/constants', () => ({
  VITE_SDK_VERSION: '0.0.0-test',
}));

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
