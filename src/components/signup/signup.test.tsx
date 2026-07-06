import { describe, test, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Signup from './signup';

import { BrowserRouter, MemoryRouter } from 'react-router';
vi.mock('axios')
vi.mock('useNavigate')

describe('<signup />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
  test('should mount', () => {
    <MemoryRouter>
      render(<Signup />);
    </MemoryRouter>
  });

  test('test for username input value', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    let inputpass = screen.getByLabelText('Username')
    let emailpass = screen.getByLabelText('Email Address')
    let passwordpass = screen.getByLabelText('Password')
    fireEvent.change(inputpass, {
      target: { value: 'he' }
    })
    fireEvent.change(emailpass, {
      target: { value: 'nkelechi21@gmail.com' }
    })
    fireEvent.change(passwordpass, {
      target: { value: 'Poiuytre101' }
    })
    fireEvent.click(screen.getByTestId('createaccount'))

    let errmsg = screen.getByTestId("username")
    expect(errmsg.innerHTML).toContain('Username must be at least 3 characters')

  });

  test('email validity', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    let inputpass = screen.getByLabelText('Username')
    let emailpass = screen.getByLabelText('Email Address')
    let passwordpass = screen.getByLabelText('Password')
    fireEvent.change(inputpass, {
      target: { value: 'hello' }
    })
    fireEvent.change(emailpass, {
      target: { value: 'nkelechi21ailcom' }
    })
    fireEvent.change(passwordpass, {
      target: { value: 'Poiuytre101' }
    })
    fireEvent.click(screen.getByTestId('createaccount'))

    let errmsg = screen.getByTestId("email")
    expect(errmsg.innerHTML).toContain('Please enter a valid email address')

  })

  test('testing password validity', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    let inputpass = screen.getByLabelText('Username')
    let emailpass = screen.getByLabelText('Email Address')
    let passwordpass = screen.getByLabelText('Password')
    fireEvent.change(inputpass, {
      target: { value: 'hello' }
    })
    fireEvent.change(emailpass, {
      target: { value: 'nkelechi21@gmail.com' }
    })
    fireEvent.change(passwordpass, {
      target: { value: 'Poi' }
    })
    fireEvent.click(screen.getByTestId('createaccount'))

    let errmsg = screen.getByTestId("passwrd")
    expect(errmsg.innerHTML).toContain('Password must be at least 8 characters')
  })

  test('test when everything works', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    let inputpass = screen.getByLabelText('Username')
    let emailpass = screen.getByLabelText('Email Address')
    let passwordpass = screen.getByLabelText('Password')
    fireEvent.change(inputpass, {
      target: { value: 'hello' }
    })
    fireEvent.change(emailpass, {
      target: { value: 'nkelechi21@gmail.com' }
    })
    fireEvent.change(passwordpass, {
      target: { value: 'Poiuytre101' }
    })
    fireEvent.click(screen.getByTestId('createaccount'))

    let emailsucc = screen.getByTestId("emailsucc")
    let unamesucc = screen.getByTestId("usernamesucc")

    expect(emailsucc.innerHTML).toContain("✓")
    expect(unamesucc.innerHTML).toContain("✓")
  })
});
