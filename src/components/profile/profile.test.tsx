import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ProfileCard from './profile';
describe('<profile />', () => {
  test('should mount', () => {
    render(<ProfileCard />);

  });
});
