import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import audiorooms from './audiorooms';

describe('<audiorooms />', () => {
  test('should mount', () => {
    render(<audiorooms />);

    const audiorooms = screen.getByTestId('audiorooms');

    expect(audiorooms).toBeInTheDocument();
  });
});
