import { describe, test } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ProfileCard from './profile';
describe('<profile />', () => {
  test('should mount', () => {
    render(<ProfileCard />);

  });
});
