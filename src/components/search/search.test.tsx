import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Search from './search';

describe('<search />', () => {
  test('should mount', () => {
    render(<Search />);
  });
});
