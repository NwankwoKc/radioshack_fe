import { useState, useRef, useEffect } from 'react';
import './EngagedRoom.css';

interface Message {
  id: string;
  text: string;
  sender: string;
  isOwn: boolean;
  timestamp: Date;
}
interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isSpeaking: boolean;
  hasAudio: boolean;
}

const EngagedRoom = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey everyone! Welcome to the engaged studio session 🎧', sender: 'Alex Morgan', isOwn: false, timestamp: new Date(Date.now() - 300000) },
    { id: '2', text: 'Loving the energy in here! Great to see the team.', sender: 'Sofia Chen', isOwn: false, timestamp: new Date(Date.now() - 120000) },
    { id: '3', text: 'Awesome session, the audio is super clear!', sender: 'You', isOwn: true, timestamp: new Date(Date.now() - 60000) },
    { id: '4', text: 'The shared design board is 🔥 Are we going to review the new mockups?', sender: 'Marcus R.', isOwn: false, timestamp: new Date(Date.now() - 60000) },
    { id: '5', text: 'Yes! Let\'s do a quick voice round after this 🎙️', sender: 'Jamie T.', isOwn: false, timestamp: new Date(Date.now() - 30000) },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const users: User[] = [
    { id: '1', name: 'Alex Morgan', avatar: 'AM', role: 'Host · Speaker', isSpeaking: true, hasAudio: true },
    { id: '2', name: 'Jamie T.', avatar: 'JT', role: 'Co-host', isSpeaking: true, hasAudio: true },
    { id: '3', name: 'Sofia Chen', avatar: 'SC', role: 'Moderator', isSpeaking: false, hasAudio: true },
    { id: '4', name: 'Marcus R.', avatar: 'MR', role: 'Member', isSpeaking: false, hasAudio: true },
    { id: '5', name: 'Lina K.', avatar: 'LK', role: 'Design lead', isSpeaking: false, hasAudio: true },
    { id: '6', name: 'Devon J.', avatar: 'DJ', role: 'Guest speaker', isSpeaking: true, hasAudio: true },
    { id: '7', name: 'Nina P.', avatar: 'NP', role: 'Visual artist', isSpeaking: false, hasAudio: false },
    { id: '8', name: 'Taylor W.', avatar: 'TW', role: 'Listener', isSpeaking: false, hasAudio: true },
  ];

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

    // Simulate reply from random user after 1 second
    setTimeout(() => {
      const randomResponders = ['Alex Morgan', 'Sofia Chen', 'Jamie T.', 'Lina K.', 'Marcus R.'];
      const randomName = randomResponders[Math.floor(Math.random() * randomResponders.length)];
      const responses = [
        'Great point! 🙌', 'Totally agree with that!', 'Interesting take 🤔',
        'Yes! Let\'s keep the momentum.', '🎶 Love the vibe in here',
        'Can\'t wait to hear more updates', '🔥🔥 absolutely!'
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];

      const replyMessage: Message = {
        id: Date.now().toString(),
        text: randomReply,
        sender: randomName,
        isOwn: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 800);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="joinRoomContainer">
      <div className="engagedRoomLayout">
        {/* MAIN AREA - Room content + users + audio icon */}
        <div className="roomMainArea">
          <div className="roomHeader">
            <div className="roomTitleSection">
              <span className="roomName">🌿 Creative Collab · Engaged Studio</span>
              <div className="liveBadge">
                <span className="pulseDot"></span>
                <span>LIVE · RECORDING</span>
              </div>
            </div>
            <div className="roomMeta">
              <span>🎙️ Hosted by Alex Morgan</span>
              <span>👥 {users.length + 4} participants</span>
              <span>🔒 Private engaged room</span>
              <span>⏱️ 48 min elapsed</span>
            </div>
          </div>

          {/* Audio icon section */}
          <div className="audioControlBar">
            <div className="audioIconWrapper">
              <div className="micIcon">🎤</div>
              <div>
                <div className="audioText">Audio stream active</div>
                <div className="liveAudioStatus">● High quality · engaged</div>
              </div>
            </div>
            <div className="statusText">🔈 Room sound: enabled</div>
            <div className="voiceActivityBadge">
              <span>🔊 Voice activity</span>
            </div>
          </div>

          {/* All users section */}
          <div className="usersSection">
            <div className="sectionLabel">
              <span>👥</span> Active members · engaged now
            </div>
            <div className="usersGrid">
              {users.map(user => (
                <div key={user.id} className="userCard">
                  <div className="userAvatar">{user.avatar}</div>
                  <div className="userInfo">
                    <div className="userName">{user.name}</div>
                    <div className="userRole">{user.role}</div>
                  </div>
                  {user.isSpeaking && <div className="speakerIndicator">🎙️</div>}
                  {user.hasAudio && !user.isSpeaking && <div className="audioIndicator">🔊</div>}
                </div>
              ))}
            </div>
            <div className="moreUsersBadge">
              🟢 +4 more joined recently
            </div>
          </div>
        </div>

        {/* CHAT SECTION - Quarter width, half height */}
        <div className="chatSection">
          <div className="chatHeader">
            <span>💬</span>
            <h3>Room chat · engaged</h3>
            <span className="messageCount">{messages.length} messages</span>
          </div>
          <div className="chatMessages">
            {messages.map(message => (
              <div key={message.id} className={`messageBubble ${message.isOwn ? 'messageOwn' : 'messageOther'}`}>
                <div className="messageMeta">
                  <span>{message.sender}</span>
                  <span>{formatTime(message.timestamp)}</span>
                </div>
                <div className="messageText">{message.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chatInputContainer">
            <input
              type="text"
              className="chatInput"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="sendButton" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagedRoom;
