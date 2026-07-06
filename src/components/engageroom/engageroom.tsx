import { useState, useRef, useEffect, useMemo } from 'react';
import styles from './engageroom.module.css';
import axios from 'axios';
import { useParams } from 'react-router';
import { createLocalAudioTrack, LocalAudioTrack, RemoteTrack, Room, RoomEvent } from 'livekit-client';
import { Track } from 'livekit-client'
import type { logindata } from '../../shared/usertype';

interface Message {
  id: string;
  text: string;
  sender: string;
  isOwn: boolean;
  timestamp: Date;
  name: string
}

const EngagedRoom = () => {
  const { roomID } = useParams<{ roomID: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const room = useMemo(() => new Room(), []);
  const audioRef = useRef<HTMLMediaElement>(null)
  const audioTrackRef = useRef<LocalAudioTrack | null>(null)
  const [isMuted, setIsMuted] = useState(false);

  const ndt = useMemo(() => {
    const dt = localStorage.getItem('data');
    if (!dt) return null;
    return JSON.parse(dt);
  }, []);

  const [users, setUsers] = useState<any[]>([]);
  const [creator, setcreator] = useState<string>("")

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const participantsMap = room.remoteParticipants;
  const allParticipants = Array.from(participantsMap.values());
  console.log(allParticipants)
  allParticipants.forEach((participant) => {
    console.log(participant.identity);
  });
  const handleSendMessage = () => {
    const encoder = new TextEncoder();
    if (!inputMessage.trim()) return;

    if (!room.localParticipant) return;

    let name = localStorage.getItem('Udata')
    if (!name) return;
    let objectname: logindata = JSON.parse(name)
    let uname = JSON.stringify(objectname?.username)

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'You',
      isOwn: true,
      timestamp: new Date(),
      name: uname
    };

    const data = encoder.encode(JSON.stringify(newMessage));
    room.localParticipant.publishData(data, {
      reliable: true,
      topic: 'chat',
    });

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  useEffect(() => {
    axios.get(`https://radioshack-be.vercel.app/rooms/${roomID}`).then((el) => {
      const members = el.data.data.members;
      const creator = el.data.data.creator.username
      setcreator(creator)
      setUsers([...members, creator]);
    });

    async function connect() {
      if (!ndt) {
        console.error('No connection data found in localStorage');
        return;
      }
      await room.connect(ndt.url, ndt.token);
      const audioTrack = await createLocalAudioTrack();
      audioTrackRef.current = audioTrack
      await room.localParticipant.publishTrack(audioTrack)
    }

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribe);
    room.on(RoomEvent.TrackUnsubscribed, handleTrackDetach);
    connect();

    room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log(`User joined: ${participant.identity}`);
    });

    room.on(RoomEvent.DataReceived, (payload) => {
      const decoder = new TextDecoder();
      try {
        let message: Message = JSON.parse(decoder.decode(payload));
        message = {
          ...message,
          isOwn: false,
          sender: message.name
        }
        setMessages(prev => [...prev, message]);
        console.log(message)
      } catch (e) {
        console.error('Failed to parse incoming message', e);
      }
    });

    return () => {
      audioTrackRef.current?.stop()
      room.disconnect();
    };
  }, []);

  function handleTrackSubscribe(track: RemoteTrack) {
    if (track.kind === Track.Kind.Audio) {
      if (audioRef.current) track.attach(audioRef.current);
    }
  }

  function handleTrackDetach(track: RemoteTrack) {
    if (track.kind === Track.Kind.Audio && audioRef.current) {
      track.detach(audioRef.current);
    }
  }
  function hanldeTrackMute() {
    if (audioTrackRef?.current?.isMuted) {
      audioTrackRef.current.unmute()
      setIsMuted(false)
    } else {
      audioTrackRef?.current?.mute()
      setIsMuted(true)
    }
  }

  return (
    <div className={styles.joinRoomContainer}>
      <div className={styles.engagedRoomLayout}>
        <div className={styles.roomMainArea}>
          <div className={styles.roomHeader}>
            <div className={styles.roomTitleSection}>
              <span className={styles.roomName}>🌿 Creative Collab · Engaged Studio</span>
              <div className={styles.liveBadge}>
                <span className={styles.pulseDot}></span>
                <span>LIVE · RECORDING</span>
              </div>
            </div>
            <div className={styles.roomMeta}>
              <span>🎙️ Hosted by {creator}</span>
              <span data-testid="participants">👥 {users?.length} participants</span>
              <span>🔒 Private engaged room</span>
            </div>
          </div>
          <div className={styles.audioControlBar}>
            <div className={styles.audioIconWrapper}>
              <div className={styles.micIcon}>🎤</div>
              <div>
                <div className={styles.audioText}>Audio stream active</div>
                <div className={styles.liveAudioStatus}>● High quality · engaged</div>
              </div>
            </div>
            <div className={styles.statusText}>🔈 Room sound: enabled</div>
            <div className={styles.voiceActivityBadge}>
              <span>🔊 Voice activity</span>
            </div>
          </div>
          <div className={styles.usersSection}>
            <div className={styles.sectionLabel}>
              <span>👥</span> Active members · engaged now
            </div>
            <div className={styles.usersGrid}>
              <div className={styles.userCard}>
                <div className={styles.userAvatar}>👥</div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}></div>
                  <div className={styles.userName}>{creator}</div>
                </div>
              </div>

              {allParticipants?.map(user => (
                <div key={user.sid} className={styles.userCard}>
                  <div className={styles.userAvatar}>👥</div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}></div>
                    <div className={styles.userName}>{user.identity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.chatSection}>
          <div className={styles.chatHeader}>
            <span>💬</span>
            <h3>Room chat · engaged</h3>
            <span className={styles.messageCount}>{messages.length} messages</span>
          </div>
          <button
            className={`${styles.micButton} ${isMuted ? styles.muted : styles.active}`}
            onClick={hanldeTrackMute}
          >
            {isMuted ? '🔇 Unmute mic' : '🎤 Mute mic'}
          </button>
          <div className={styles.chatMessages}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.messageBubble} ${message.isOwn ? styles.messageOwn : styles.messageOther}`}
              >
                <div className={styles.messageMeta}>
                  <span>{message.sender}</span>
                </div>
                <div data-testid="textmessage" className={styles.messageText}>{message.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <audio ref={audioRef}
            autoPlay
            controls={false} />
          <div className={styles.chatInputContainer}>
            <input
              data-testid="inputmessage"
              type="text"
              className={styles.chatInput}
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button data-testid="sendmessage" className={styles.sendButton} onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagedRoom;
