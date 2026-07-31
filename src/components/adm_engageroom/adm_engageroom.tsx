import styles from "./adm_engageroom.module.css"
import { useRef, useEffect, useMemo, useState } from "react"
import { createLocalAudioTrack, LocalAudioTrack, Participant, RemoteTrack, Room, RoomEvent, RemoteParticipant, RemoteTrackPublication } from 'livekit-client';
import { Track } from 'livekit-client'
import type { logindata } from '../../shared/usertype';
import instance from '../../util/axios';
import { useParams } from 'react-router';

interface Message {
  id: string;
  text: string;
  sender: string;
  isOwn: boolean;
  timestamp: Date;
  name: string
}


function Adm_engageroom() {
  const { roomID } = useParams<{ roomID: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const room = useMemo(() => new Room(), []);
  const audioRef = useRef<HTMLMediaElement>(null)
  const audioTrackRef = useRef<LocalAudioTrack | null>(null)
  const [isMuted, setIsMuted] = useState(false);
  const [activeSpeakers, setActiveSpeakers] = useState<Set<string>>(new Set()); // Use Set for better tracking
  const [participants, setParticipants] = useState<RemoteParticipant[]>([])
  const parsedata = useMemo(() => {
    const dt = localStorage.getItem('data');
    if (!dt) return null;
    return JSON.parse(dt);
  }, []);

  const [users, setUsers] = useState<any[]>([]);
  const [creator, setCreator] = useState<string>("")

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    instance.get(`${import.meta.env.VITE_BEURL}/${roomID}`).then((el) => {
      const members = el.data.data.members;
      const creator = el.data.data.creator.username
      setCreator(creator)
      setUsers([...members, creator]);
    });

    async function connect() {
      if (!parsedata) {
        console.error('No connection data found in localStorage');
        return;
      }
      await room.connect(parsedata.url, parsedata.token);
      const audioTrack = await createLocalAudioTrack();
      audioTrackRef.current = audioTrack
      await room.localParticipant.publishTrack(audioTrack)
    }

    // Handler functions that use refs or useCallback to avoid stale closures
    const handleActiveSpeakersChanged = (speakers: Participant[]) => {

      // Create a Set of speaker identities for efficient lookup
      const activeSpeakerIds = new Set(
        speakers.map(speaker => speaker.identity)
      );

      setActiveSpeakers(activeSpeakerIds);
    };

    const handleParticipantConnected = (participant: RemoteParticipant) => {
      setParticipants(prev => [...prev, participant]);
    };

    const handleTrackSubscribed = (track: RemoteTrack) => {
      if (track.kind === Track.Kind.Audio) {
        if (audioRef.current) track.attach(audioRef.current);
      }
    };

    const handleTrackUnsubscribed = (track: RemoteTrack) => {
      if (track.kind === Track.Kind.Audio && audioRef.current) {
        track.detach(audioRef.current);
      }
    };

    const handleDataReceived = (payload: any) => {
      const decoder = new TextDecoder();
      try {
        let message: Message = JSON.parse(decoder.decode(payload));
        message = {
          ...message,
          isOwn: false,
          sender: message.name
        }
        setMessages(prev => [...prev, message]);
      } catch (e) {
        console.error('Failed to parse incoming message', e);
      }
    };

    // Register event listeners
    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);
    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.DataReceived, handleDataReceived);

    // Connect to room
    connect();

    // Get initial participants
    const allMembers = Array.from(room.remoteParticipants.values());
    setParticipants(allMembers);
    console.log(room.name)

    // Cleanup
    return () => {
      // Remove event listeners
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(RoomEvent.DataReceived, handleDataReceived);

      audioTrackRef.current?.stop();
      room.disconnect();
    };
  }, [room, parsedata, roomID]); // Add dependencies

  function handleTrackMute() {
    if (audioTrackRef?.current?.isMuted) {
      audioTrackRef.current.unmute()
      setIsMuted(false)
    } else {
      audioTrackRef?.current?.mute()
      setIsMuted(true)
    }
  }
  function getracksid() {
    let tsid;
    participants.map((el: RemoteParticipant) => {
      el.trackPublications.forEach((el: RemoteTrackPublication) => {
        tsid = el.trackSid
      })
    })

    return tsid
  }

  function muteparticipant(identity: string) {
    const tracksid = getracksid()
    const body = {
      roomName: room.name,
      identity: identity,
      tracksid: tracksid,
      muted: true
    }
    console.log(body)

    instance.post(`${import.meta.env.VITE_BEURL}/rooms/mute`, body)
  }





  return (
    <div className={styles.joinRoomContainer}>
      <div className={styles.engagedRoomLayout}>
        <div className={styles.roomMainAreas}>
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
                  <div className={styles.userName}>{creator}</div>
                </div>
                {/* Check if creator is speaking - you might want to track this too */}
              </div>

              {participants?.map(user => {
                const isSpeaking = activeSpeakers.has(user.identity);
                return (
                  <div key={user.sid} className={`${styles.userCard} ${isSpeaking ? styles.userCardSpeaking : ''} `}>
                    <div className={styles.userAvatar}>👥</div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{user.identity || 'Anonymous'}</div>
                    </div>
                    {isSpeaking && (
                      <div className={styles.volumeBars}>
                        <span className={styles.bar}></span>
                        <span className={styles.bar}></span>
                        <span className={styles.bar}></span>
                      </div>
                    )}
                    <button className={styles.mutebtn} onClick={(_e) => muteparticipant(user.identity)}>Mute</button>

                  </div>
                );
              })}
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
            onClick={handleTrackMute}
          >
            {isMuted ? '🔇 Unmute mic' : '🎤 Mute mic'}
          </button>
          <div className={styles.chatMessages}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.messageBubble} ${message.isOwn ? styles.messageOwn : styles.messageOther} `}
              >
                <div className={styles.messageMeta}>
                  <span>{message.sender}</span>
                </div>
                <div data-testid="textmessage" className={styles.messageText}>{message.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <audio ref={audioRef} autoPlay controls={false} />
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

  )
}


export default Adm_engageroom


