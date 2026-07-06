import { describe, test, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Login from './login';
import { BrowserRouter } from 'react-router';

vi.mock('axios')

describe('<login />', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should mount', () => {
    render(
      < BrowserRouter >
        <Login />
      </BrowserRouter >
    )
  });

  test('if return error with incorrect email pattern', async () => {

    render(
      <BrowserRouter >
        <Login />
      </BrowserRouter >
    )

    let email = screen.getByLabelText('Email Address')
    let passwrd = screen.getByLabelText('Password')

    fireEvent.change(email, {
      target: { value: 'nkelechi21ailcom' }
    })
    fireEvent.change(passwrd, {
      target: { value: 'Poiuytre101' }
    })

    fireEvent.click(screen.getByTestId('createaccount'))
    await waitFor(() => expect(screen.getByTestId("loginerr").innerHTML).toContain('Please enter a valid email address'))

  })

  test('if return error with incorrect if email not available', async () => {

    render(
      <BrowserRouter >
        <Login />
      </BrowserRouter >
    )

    let email = screen.getByLabelText('Email Address')
    let passwrd = screen.getByLabelText('Password')

    fireEvent.change(email, {
      target: { value: '' }
    })
    fireEvent.change(passwrd, {
      target: { value: 'Poiuytre101' }
    })

    fireEvent.click(screen.getByTestId('createaccount'))
    await waitFor(() => expect(screen.getByTestId("loginerr").innerHTML).toContain('Please enter your email address'))
  })


  test('if password is available', async () => {

    render(
      <BrowserRouter >
        <Login />
      </BrowserRouter >
    )

    let email = screen.getByLabelText('Email Address')
    let passwrd = screen.getByLabelText('Password')

    fireEvent.change(email, {
      target: { value: 'nkelechi21@gmail.com' }
    })
    fireEvent.change(passwrd, {
      target: { value: '' }
    })

    fireEvent.click(screen.getByTestId('createaccount'))
    await waitFor(() => expect(screen.getByTestId("loginerr").innerHTML).toContain('Please enter your password'))
  })
});
