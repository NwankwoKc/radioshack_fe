import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import adm_engageroom from './adm_engageroom';

describe('<adm_engageroom />', () => {
  test('should mount', () => {
    render(<adm_engageroom />);

    const admEngageroom = screen.getByTestId('adm_engageroom');

    expect(admEngageroom).toBeInTheDocument();
  });
});
