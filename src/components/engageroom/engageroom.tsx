import { useState, useRef, useEffect } from 'react';
import styles from './engageroom.module.css';
import axios from 'axios';
import { useParams } from 'react-router';
import { useLiveKit } from '../../util/livekitcontext';
import { RoomEvent } from 'livekit-client';
interface Message {
  id: string;
  text: string;
  sender: string;
  isOwn: boolean;
  timestamp: Date;
}



const EngagedRoom = () => {
  const { userID } = useParams<{ userID: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey everyone! Welcome to the engaged studio session 🎧', sender: 'Alex Morgan', isOwn: false, timestamp: new Date(Date.now() - 300000) },
    { id: '2', text: 'Loving the energy in here! Great to see the team.', sender: 'Sofia Chen', isOwn: false, timestamp: new Date(Date.now() - 120000) },
    { id: '3', text: 'Awesome session, the audio is super clear!', sender: 'You', isOwn: true, timestamp: new Date(Date.now() - 60000) },
    { id: '4', text: 'The shared design board is 🔥 Are we going to review the new mockups?', sender: 'Marcus R.', isOwn: false, timestamp: new Date(Date.now() - 60000) },
    { id: '5', text: 'Yes! Let\'s do a quick voice round after this 🎙️', sender: 'Jamie T.', isOwn: false, timestamp: new Date(Date.now() - 30000) },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { room } = useLiveKit()
  const [users, setusers] = useState<any[]>([])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'You',
      isOwn: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  useEffect(() => {
    if (!room) return

    axios.get(`http://localhost:3000/rooms/${userID}`).then((el) => {
      let members = el.data.data.members
      setusers(members)
    })
    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribe)
    room.on(RoomEvent.TrackUnsubscribed, handleTrackDetach)
    room.on(RoomEvent.ParticipantConnected, (participants) => {
      console.log(`User joined: ${participants.identity}`)
    })
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  function handleTrackSubscribe() {

  }
  function handleTrackDetach() {

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
              <span>🎙️ Hosted by Alex Morgan</span>
              <span>👥 {users?.length} participants</span>
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
              {users?.map(user => (
                <div key={user.id} className={styles.userCard}>
                  <div className={styles.userAvatar}>{user.avatar}</div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user.username}</div>
                  </div>
                  {user.isSpeaking && <div className={styles.speakerIndicator}>🎙️</div>}
                  {user.hasAudio && !user.isSpeaking && <div className={styles.audioIndicator}>🔊</div>}
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
          <div className={styles.chatMessages}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.messageBubble} ${message.isOwn ? styles.messageOwn : styles.messageOther}`}
              >
                <div className={styles.messageMeta}>
                  <span>{message.sender}</span>
                  <span>{formatTime(message.timestamp)}</span>
                </div>
                <div className={styles.messageText}>{message.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className={styles.chatInputContainer}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className={styles.sendButton} onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagedRoom;
