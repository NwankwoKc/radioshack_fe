import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import signup from './signup';

describe('<signup />', () => {
  test('should mount', () => {
    render(<signup />);

    const signup = screen.getByTestId('signup');

    expect(signup).toBeInTheDocument();
  });
});
