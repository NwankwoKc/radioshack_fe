import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Login from './login';

describe('<login />', () => {
  test('should mount', () => {
    render(<Login />);

    const login = screen.getByTestId('login');

    expect(login).toBeInTheDocument();
  });
});
