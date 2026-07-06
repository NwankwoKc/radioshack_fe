import { describe, test, expect } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Engageroom from './engageroom';
import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import userEvent from '@testing-library/user-event';
vi.mock('livekit-client', () => {
  // Create the Map outside so it persists
  const mockRemoteParticipants = new Map();

  return {
    // This tells Vitest Room is a constructor
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
vi.spyOn(React, 'useRef').mockReturnValue({ current: { scrollIntoView: vi.fn(), focus: vi.fn() } })
vi.mock('axios');

vi.mock('react-router', () => ({
  ...vi.importActual('react-router'),
  useParams: vi.fn().mockReturnValue({ UserID: "1234" })
}));

const mockGetItem = vi.fn().mockReturnValue('{"url":"url","token":"token"}');
const mockSetItem = vi.fn();
const mockRemoveItem = vi.fn();
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
    removeItem: (...args: string[]) => mockRemoveItem(...args),
  },
});
Element.prototype.scrollIntoView = vi.fn();
vi.spyOn(axios, 'get').mockResolvedValue({
  data: {
    data: {
      members: [{}, {}]
    }
  }
})


describe('<engageroom />', () => {
  beforeEach(() => {
  })

  test('should mount', () => {
    render(<Engageroom />);
  });

  test('test if axios request is working', async () => {
    const { userID } = useParams<{ userID: string }>();
    const req = vi.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: {
          members: [{}, {}, {}]
        }
      }
    })
    render(<Engageroom />);

    await waitFor(() => expect(screen.getByTestId('participants').innerHTML).toContain("3 participants"))
    await waitFor(() => expect(screen.getByTestId('participants').innerHTML).toContain("👥"))

    expect(req).toHaveBeenCalled()
    expect(req).toHaveBeenCalledWith(`https://radioshack-be.vercel.app/rooms/${userID}`)
  })
  test('if chatbox is working correctly', async () => {

    render(<Engageroom />);
    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByTestId("sendmessage")

    expect(button).toBeInTheDocument()
    expect(button).toBeInTheDocument()

    await userEvent.type(input, 'Test Name')
    fireEvent.click(button)
    const msg = screen.getByTestId("textmessage")
    expect(msg).toBeInTheDocument()
    expect(msg.innerHTML).toContain('Test Name')
  })

});
