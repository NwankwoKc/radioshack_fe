import { describe, test, expect, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Joinroom from './joinroom';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import { useParams } from 'react-router';
import { userEvent } from '@testing-library/user-event'
vi.mock('axios')
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ roomID: '123' }), // This is crucial!
  };
});

const mockGetItem = vi.fn().mockReturnValue('{"username":"username"}');
const mockSetItem = vi.fn().mockImplementation((_firstval: string, _secondval: string) => true);
const mockRemoveItem = vi.fn();
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
    removeItem: (...args: string[]) => mockRemoveItem(...args),
  },
});

describe('getroom', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  test('should mount', () => {
    render(
      <BrowserRouter>
        <Joinroom />
      </BrowserRouter>
    );
  });
  test('debug axios mock', async () => {
    // Create mock data
    const mockResponse = {
      data: {
        data: [{
          _id: "id123",
          id: "id123",
          roomname: "Test Room Name",
          description: "Test Description",
          creator: { username: "testuser", id: "userid" },
          isActive: true,
          createdAt: "2024-01-15T10:30:00Z"
        }]
      }
    };

    // Setup the mock
    vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

    // Test if mock works directly
    const result = await axios.get('https://radioshack-be.vercel.app/rooms/123');
    console.log('Axios mock result:', result); // Should show your mockResponse

    // Verify the mock was called
    expect(axios.get).toHaveBeenCalledWith('https://radioshack-be.vercel.app/rooms/123');
    expect(result).toEqual(mockResponse);
  });
  test('test if renders roominfo', async () => {
    let mockuserreponse = {
      id: "id",
      roomname: "roomname",
      description: "description",
      creator: {
        username: "username",
        id: "id"
      },
      creatorName: "creatorName",
      members: [],
      isActive: true,
      createdAt: "date"
    }

    vi.mocked(axios.get).mockResolvedValue({
      data: {
        data: [mockuserreponse]
      }
    })

    act(() => {
      render(
        <BrowserRouter>
          <Joinroom />
        </BrowserRouter>
      );
    })
    const { roomID } = useParams<{ roomID: string }>();

    let name = await waitFor(() => screen.getByTestId('roomname'))
    let description = await waitFor(() => screen.getByTestId('description'))
    await waitFor(() => screen.getByTestId('isActive'))

    expect(name.innerHTML).toContain("roomname")
    expect(description.innerHTML).toContain("description")
    expect(axios.get).toHaveBeenCalledWith(`https://radioshack-be.vercel.app/rooms/${roomID}`)
  })
});


describe('join room', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('testing if joinroom works underall conditions', async () => {
    let mockuserreponse = {
      id: "id",
      roomname: "roomname",
      description: "description",
      creator: {
        username: "username",
        id: "id"
      },
      creatorName: "creatorName",
      members: [],
      isActive: true,
      createdAt: "date"

    }

    const mockedpostresponse = {
      message: "success",
      data: 'token'
    }

    vi.mocked(axios.get).mockResolvedValue({
      data: {
        data: [mockuserreponse]
      }
    })

    vi.mocked(axios.post).mockResolvedValue({ data: { mockedpostresponse } })

    act(() => {
      render(
        <BrowserRouter>
          <Joinroom />
        </BrowserRouter>
      );
    })
    const { roomID } = useParams<{ roomID: string }>();

    const user = userEvent.setup()
    let name = await waitFor(() => screen.getByTestId('roomname'))
    let description = await waitFor(() => screen.getByTestId('description'))
    await waitFor(() => screen.getByTestId('isActive'))
    let joinbutton = await waitFor(() => screen.getByTestId('handleJoinRoom'))

    expect(joinbutton).toBeInTheDocument()
    await user.click(joinbutton)
    let objectname = JSON.parse(mockGetItem('Udata'))
    let uname = JSON.stringify(objectname?.username)


    expect(mockGetItem).toHaveBeenCalled()
    expect(mockGetItem).toHaveBeenCalledWith('Udata')
    expect(axios.post).toHaveBeenCalled()
    expect(axios.post).toHaveBeenCalledWith("https://radioshack-be.vercel.app/rooms/token", {
      room_name: mockuserreponse.roomname,
      participant_identity: uname
    })

    await waitFor(() => expect(axios.post).toHaveResolved())
    expect(mockSetItem).toHaveBeenCalled()

    expect(name.innerHTML).toContain("roomname")
    expect(description.innerHTML).toContain("description")
    expect(axios.get).toHaveBeenCalledWith(`https://radioshack-be.vercel.app/rooms/${roomID}`)
  })
})
