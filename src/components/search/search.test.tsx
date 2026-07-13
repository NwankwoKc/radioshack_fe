import { describe, test } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Search from './search';

describe('<search />', () => {
  test('should mount', () => {
    render(<Search />);
  });
});
