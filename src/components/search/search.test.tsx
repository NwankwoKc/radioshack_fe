import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import search from './search';

describe('<search />', () => {
  test('should mount', () => {
    render(<search />);

    const search = screen.getByTestId('search');

    expect(search).toBeInTheDocument();
  });
});
