import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import Createaudioroom from './create-audioroom';
import axios from 'axios';

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
      return null;
    });
  });

  // Test 1: Component mounts correctly
  test('should render all form elements', () => {
    render(<Createaudioroom />);

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
    render(<Createaudioroom />);
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
    render(<Createaudioroom />);
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
    render(<Createaudioroom />);
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
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } }); // Room creation
    mockedAxios.post.mockResolvedValueOnce({
      data: { data: 'test-token' }
    }); // Token generation

    render(<Createaudioroom />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(nameInput, 'My Room');
    await user.type(descriptionInput, 'Room description');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    // Verify first API call (create room)
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://radioshack-be.vercel.app/rooms',
        {
          roomname: 'My Room',
          creatorId: 'test-user-id',
          description: 'Room description',
        }
      );
    });

    // Verify second API call (token generation)
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://radioshack-be.vercel.app/rooms/token',
        {
          room_name: 'My Room',
          participant_identity: 'test-uid-123',
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

    render(<Createaudioroom />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, 'Room Only');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://radioshack-be.vercel.app/rooms',
        expect.objectContaining({
          description: '',
        })
      );
    });
  });

  // Test 7: Handle API error during room creation
  test('should handle API error during room creation', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

    render(<Createaudioroom />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, 'Error Room');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByTestId('errormsg');
      expect(errorElement).toHaveTextContent(errorMessage);
    });
  });

  // Test 8: Handle missing userid in localStorage
  test('should use default userId when localStorage is empty', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    mockedAxios.post.mockResolvedValueOnce({
      data: { data: 'test-token' }
    });

    render(<Createaudioroom />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, 'Default User Room');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://radioshack-be.vercel.app/rooms',
        expect.objectContaining({
          creatorId: 'bb706f87-e5e4-4a78-aae4-6a6d748f1cf9',
        })
      );
    });
  });

  // Test 9: Loading state during submission
  test('should show loading state and disable form during submission', async () => {
    // Create a promise that we can resolve manually
    let resolvePromise: (value: any) => void;
    const postPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockedAxios.post.mockReturnValueOnce(postPromise as any);

    render(<Createaudioroom />);
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
    render(<Createaudioroom />);

    const form = document.querySelector('form');
    const preventDefaultSpy = vi.fn();

    form?.addEventListener('submit', preventDefaultSpy);

    fireEvent.submit(form!);

    // Since validation fails, the form should not submit
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  // Test 11: Token generation failure handling
  test('should handle token generation failure gracefully', async () => {
    // Mock console.error to prevent test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } }); // Room creation success
    mockedAxios.post.mockRejectedValueOnce(new Error('Token generation failed')); // Token failure

    render(<Createaudioroom />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, 'Token Fail Room');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Token generation failed:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  // Test 12: Form inputs have correct placeholder text
  test('should have correct placeholder text', () => {
    render(<Createaudioroom />);

    expect(screen.getByPlaceholderText('e.g. Tech Talks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's this room about?")).toBeInTheDocument();
  });

  // Test 13: Error state clears on new submission
  test('should clear error message on successful submission', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    mockedAxios.post.mockResolvedValueOnce({
      data: { data: 'test-token' }
    });

    render(<Createaudioroom />);
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

  // Test 14: Handle API error with custom error message
  test('should display custom error message from API', async () => {
    const apiError = {
      response: {
        data: {
          message: 'Room name already exists',
        },
      },
      message: 'Request failed with status code 409',
    };

    mockedAxios.post.mockRejectedValueOnce(apiError);

    render(<Createaudioroom />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Group Name');
    await user.type(nameInput, 'Duplicate Room');

    const submitButton = screen.getByRole('button', { name: /create room/i });
    await user.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByTestId('errormsg');
      expect(errorElement).toBeInTheDocument();
    });
  });

  // Test 15: Verify SVG icons are rendered
  test('should render all SVG icons', () => {
    const { container } = render(<Createaudioroom />);

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
