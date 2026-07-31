import { describe, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

describe('<adm_engageroom />', () => {
  test('should mount', () => {

    const admEngageroom = screen.getByTestId('adm_engageroom');

    expect(admEngageroom).toBeInTheDocument();
  });
});
