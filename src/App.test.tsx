import React from 'react';

import { render } from '@testing-library/react';
import { App } from './App';

jest.mock('sparkengineweb');

test('renders learn react link', () => {
  render(<App />);
});
