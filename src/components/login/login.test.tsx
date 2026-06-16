import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import login from './login';

describe('<login />', () => {
  test('should mount', () => {
    render(<login />);

    const login = screen.getByTestId('login');

    expect(login).toBeInTheDocument();
  });
});
