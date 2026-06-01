import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import create-audioroom from './create-audioroom';

describe('<create-audioroom />', () => {
  test('should mount', () => {
    render(<create-audioroom />);

    const createAudioroom = screen.getByTestId('create-audioroom');

    expect(createAudioroom).toBeInTheDocument();
  });
});
