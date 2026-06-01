import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import joinroom from './joinroom';

describe('<joinroom />', () => {
  test('should mount', () => {
    render(<joinroom />);

    const joinroom = screen.getByTestId('joinroom');

    expect(joinroom).toBeInTheDocument();
  });
});
