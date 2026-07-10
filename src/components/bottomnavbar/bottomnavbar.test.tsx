import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BottomNavBar from './bottomnavbar';
import { BrowserRouter } from 'react-router';
describe('<bottomnavbar />', () => {
  test('should mount', () => {
    render(
      <BrowserRouter>
        <BottomNavBar />
      </BrowserRouter>
    );
  });
});
