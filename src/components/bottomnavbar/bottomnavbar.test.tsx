import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import bottomnavbar from './bottomnavbar';

describe('<bottomnavbar />', () => {
  test('should mount', () => {
    render(<bottomnavbar />);

    const bottomnavbar = screen.getByTestId('bottomnavbar');

    expect(bottomnavbar).toBeInTheDocument();
  });
});
