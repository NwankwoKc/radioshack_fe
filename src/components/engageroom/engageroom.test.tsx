import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import engageroom from './engageroom';

describe('<engageroom />', () => {
  test('should mount', () => {
    render(<engageroom />);

    const engageroom = screen.getByTestId('engageroom');

    expect(engageroom).toBeInTheDocument();
  });
});
