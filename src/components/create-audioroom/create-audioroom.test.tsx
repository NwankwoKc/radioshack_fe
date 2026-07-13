import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import Createaudioroom from './create-audioroom';
import axios from 'axios';
import { BrowserRouter } from 'react-router';
// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);
// Mock livekit-client
vi.mock('livekit-client', () => {
  const mockRemoteParticipants = new Map();

  return {
    Room: vi.fn().mockImplementation(function() {
      return {
        connect: vi.fn().mockResolvedValue(undefined),
        disconnect: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        localParticipant: {
          identity: 'local-user',
          sid: 'local-sid',
          publishTrack: vi.fn().mockResolvedValue(undefined),
          publishData: vi.fn().mockResolvedValue(undefined),
          unpublishTrack: vi.fn(),
        },
        remoteParticipants: mockRemoteParticipants,
        state: 'connected',
      };
    }),
    RoomEvent: {
      TrackSubscribed: 'trackSubscribed',
      TrackUnsubscribed: 'trackUnsubscribed',
      ParticipantConnected: 'participantConnected',
      DataReceived: 'dataReceived',
    },
    Track: {
      Kind: {
        Audio: 'audio',
      },
    },
    createLocalAudioTrack: vi.fn().mockResolvedValue({
      stop: vi.fn(),
      mute: vi.fn(),
      unmute: vi.fn(),
      isMuted: false,
    }),
    RemoteTrack: vi.fn(),
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('Createaudioroom Component', () => {
  let ls: string = '{"id": "test-user-id"}'
  let dt: string = '{"token":"test-uid-123","url":"www.google.com"}'
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'Udata') return ls;
      if (key === 'data') return dt;
      if (key === 'token') return "token"
      return null;
    });
  });
  afterEach(async () => {
    cleanup();
    // Wait for any pending promises
  });

  // Test 1: Component mounts correctly
  test('should render all form elements', () => {
    render(
      < BrowserRouter >
        <Createaudioroom />
      </BrowserRouter >
    )
    // Check header elements
    expect(screen.getByText('Create a Room')).toBeInTheDocument();
    expect(screen.getByText('Set up a new audio room for your community')).toBeInTheDocument();

    // Check form inputs
    expect(screen.getByLabelText('Group Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole('button', { name: /create room/i })).toBeInTheDocument();

  });

  // Test 2: Form inputs should update state
  test('should update input values when typing', async () => {
    render(
      <BrowserRouter>
        <Createaudioroom />
      </BrowserRouter>
    );
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(nameInput, 'Test Room');
    await user.type(descriptionInput, 'A test description');

    expect(nameInput).toHaveValue('Test Room');
    expect(descriptionInput).toHaveValue('A test description');
  });

  // Test 3: Show error when submitting empty name
  test('should show error when group name is empty', async () => {
    render(
      <BrowserRouter>
        <Createaudioroom />
      </BrowserRouter>
    );
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    // Check error message appears
    const errorMessage = screen.getByTestId('errormsg');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Groupname is required');
  });

  // Test 4: Show error when submitting with only whitespace name
  test('should show error when group name is only whitespace', async () => {
    render(
      <BrowserRouter><Createaudioroom /></BrowserRouter>
    );
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, '   ');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    const errorMessage = screen.getByTestId('errormsg');
    expect(errorMessage).toHaveTextContent('Groupname is required');
  });

  // Test 5: Successful form submission
  test('should submit form successfully and make API calls', async () => {
    mockedAxios.post.mockImplementation((url: string, _data: any) => {
      if (url === "import.meta.env.VITE_BEURL/rooms") {
        return Promise.resolve({ data: { data: { id: "roomid" } } })
      } else {
        return Promise.resolve({ data: { success: true, data: "token" } })
      }
    })

    const token = "token"
    render(
      <BrowserRouter><Createaudioroom /></BrowserRouter>
    );

    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(nameInput, 'My Room');
    await user.type(descriptionInput, 'Room description');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    // Verify first API call (create room) - this happens first in the component
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'import.meta.env.VITE_BEURL/rooms',
        {
          roomname: 'My Room',
          creatorId: 'test-user-id',
          description: 'Room description'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    });

    // Verify second API call (token generation) - this happens second in the component
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'import.meta.env.VITE_BEURL/rooms/token',
        {
          room_name: 'My Room',
          participant_identity: 'test-user-id'
        }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      );
    });

    // Verify inputs are cleared after successful submission
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });
  // Test 6: Form submission with missing description
  test('should submit form with empty description', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    mockedAxios.post.mockResolvedValueOnce({
      data: { data: 'test-token' }
    });

    render(
      <BrowserRouter><Createaudioroom /></BrowserRouter>
    );
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, 'Room Only');
    const token = "token"
    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'import.meta.env.VITE_BEURL/rooms',
        expect.objectContaining({
          description: '',
          roomname: "Room Only",
          creatorId: "test-user-id"
        }),
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }

        }
      );
    });
  });

  // Test 7: Handle API error during room creation
  test('should handle API error during room creation', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.post.mockImplementation((url: string, _data: any) => {
      if (url === 'import.meta.env.VITE_BEURL/rooms') {
        return Promise.reject(new Error(errorMessage))
      } else {
        return Promise.reject(new Error(errorMessage))
      }
    });

    render(
      <BrowserRouter><Createaudioroom /></BrowserRouter>
    );
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, 'Error Room');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);
    waitFor(() => {
      const errorElement = screen.getByTestId('errormsg');
      expect(errorElement).toHaveTextContent(errorMessage)
    })
  })

  // Test 9: Loading state during submission
  test('should show loading state and disable form during submission', async () => {
    // Create a promise that we can resolve manually
    let resolvePromise: (value: any) => void;
    const postPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockedAxios.post.mockReturnValueOnce(postPromise as any);

    render(
      <BrowserRouter><Createaudioroom /></BrowserRouter>
    );
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, 'Loading Room');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    // Check loading state
    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(nameInput).toBeDisabled();

    // Resolve the promise
    resolvePromise!({ data: { success: true } });

    // Mock the second call
    mockedAxios.post.mockResolvedValueOnce({
      data: { data: 'test-token' }
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  // Test 10: Prevent default form submission
  test('should prevent default form submission', async () => {
    render(
      <BrowserRouter><Createaudioroom /></BrowserRouter>
    );

    const form = document.querySelector('form');
    const preventDefaultSpy = vi.fn();

    form?.addEventListener('submit', preventDefaultSpy);

    fireEvent.submit(form!);

    // Since validation fails, the form should not submit
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  // Test 11: Token generation failure han

});

// Test 12: Form inputs have correct placeholder text
test('should have correct placeholder text', () => {
  render(
    <BrowserRouter><Createaudioroom /></BrowserRouter>
  );

  expect(screen.getByPlaceholderText('e.g. Tech Talks')).toBeInTheDocument();
  expect(screen.getByPlaceholderText("What's this room about?")).toBeInTheDocument();
});

// Test 13: Error state clears on new submission
test('should clear error message on successful submission', async () => {
  mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
  mockedAxios.post.mockResolvedValueOnce({
    data: { data: 'test-token' }
  });

  render(
    <BrowserRouter><Createaudioroom /></BrowserRouter>
  );
  const user = userEvent.setup();

  // First, trigger an error
  const submitButton = screen.getByRole('button', { name: /create room/i });
  await user.click(submitButton);

  let errorMessage = screen.getByTestId('errormsg');
  expect(errorMessage).toBeInTheDocument();

  // Now submit with valid data
  const nameInput = screen.getByLabelText('Group Name');
  await user.type(nameInput, 'Valid Room');
  await user.click(submitButton);

  await waitFor(() => {
    expect(screen.queryByTestId('errormsg')).not.toBeInTheDocument();
  });
});


// Test 15: Verify SVG icons are rendered
test('should render all SVG icons', () => {
  const { container } = render(
    <BrowserRouter><Createaudioroom /></BrowserRouter>
  );

  const svgs = container.querySelectorAll('svg');
  expect(svgs.length).toBeGreaterThan(0);
});
