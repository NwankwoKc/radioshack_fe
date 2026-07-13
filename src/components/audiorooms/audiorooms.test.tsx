import { describe, test, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Audiorooms from './audiorooms';
import axios from 'axios';
import { BrowserRouter } from 'react-router';

vi.mock('axios')
const mockedaxios = vi.mocked(axios, true)

describe('<audiorooms />', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })
  test('should mount', () => {
    mockedaxios.get.mockResolvedValue({
      data: {
        data: [{
          roomname: "roomname",
          creator: "creator",
          description: "description"
        }]
      }
    })
    render(<BrowserRouter><Audiorooms /></BrowserRouter>);
  });

  test('if axios resolves the roomdata and how to implement it', async () => {
    mockedaxios.get.mockResolvedValue({
      data: {
        data: [{
          roomname: "roomname",
          creator: "creator",
          description: "description"
        }]
      }
    })
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    render(<BrowserRouter><Audiorooms /></BrowserRouter>);
    const token = 'token'
    await waitFor(() => expect(mockedaxios.get).toHaveBeenCalledWith('import.meta.env.VITE_BEURL/rooms', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }))
    expect(screen.getByTestId("description").innerHTML).toContain("description")
    expect(screen.getByTestId("creator").innerHTML).toContain("creator")
    expect(screen.getByTestId("roomname").innerHTML).toContain("roomname")
  })

  test("if axios resolves error", async () => {
    const token = "token"
    mockedaxios.get.mockRejectedValueOnce(new Error("something went wrong"))

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token')
    render(<BrowserRouter><Audiorooms /></BrowserRouter>);

    await waitFor(() => expect(mockedaxios.get).toHaveBeenCalledWith('import.meta.env.VITE_BEURL/rooms', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }))
    expect(screen.getByTestId("error").innerHTML).toContain("Error loading rooms. Please try again later.")
  })
});
