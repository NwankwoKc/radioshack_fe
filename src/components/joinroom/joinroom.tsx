import axios from "axios";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import styles from "./joinroom.module.css";
import { useNavigate } from "react-router";
interface Room {
  _id: string;
  id?: string;
  roomname: string;
  description?: string;
  creator?: {
    username: string;
    id: string;
  };
  creatorName?: string;
  members?: Array<any>;
  participants: number;
  maxParticipants?: number;
  duration?: string;
  isActive?: boolean;
  createdAt?: string;
  roomType?: string;
}

function Joinroom() {
  const [data, setData] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joiningRoom, setJoiningRoom] = useState<string | null>(null);

  const { userID } = useParams<{ userID: string }>();
  const navigate = useNavigate()


  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/rooms/${userID}`);
        console.log(response.data)

        // Handle both single room and array responses
        const roomData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];

        setData(roomData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : 'An unknown error occurred';
        setError(errorMessage);
        console.log(`Error getting room details: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchRoomDetails();
    }
  }, [userID]);

  const handleJoinRoom = async (roomId: string) => {
    try {
      setJoiningRoom(roomId);

      // Add your room joining logic here
      // For example, redirect to the actual room or open a connection
      console.log(`Joining room: ${roomId}`);
      navigate(`/engageroom/${roomId}`)

      // Example: Redirect to the actual room
      // window.location.href = `/room/${roomId}`;

      // Or if using LiveKit:
      // const room = new Room();
      // await room.connect(url, token);

      alert(`Successfully joined room: ${roomId}`);
    } catch (err) {
      console.error(`Failed to join room: ${err}`);
      alert('Failed to join room. Please try again.');
    } finally {
      setJoiningRoom(null);
    }
  };

  const getStatusBadge = (status?: boolean) => {
    switch (status) {
      case true:
        return (
          <span className={`${styles.statusBadge} ${styles.liveStatus}`}>
            <span className={styles.liveDot}></span>
            Live
          </span>
        );

      case false:
        return (
          <span className={`${styles.statusBadge} ${styles.endedStatus}`}>
            Ended
          </span>
        );
    }
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];

    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading room details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Error Loading Room</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3>No Rooms Found</h3>
        <p>There are no rooms available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.joinRoomContainer}>
      <h2 className={styles.roomTitle}>Available Rooms</h2>

      <div className={styles.roomsGrid}>
        {data.map((room) => {
          const roomId = room.id || room.id || '';
          const roomName = room.roomname || 'Unnamed Room';
          const creatorName = room.creator?.username || room.creatorName || 'Unknown';

          return (
            <div className={styles.roomCard} key={roomId}>
              {/* Card Header */}
              <div className={styles.roomCardHeader}>
                {room.roomType && (
                  <div className={styles.roomType}>
                    {room.roomType}
                  </div>
                )}
                <h3 className={styles.roomName}>{roomName}</h3>
                {roomId && (
                  <div className={styles.roomId}>
                    ID: {roomId.slice(0, 8)}...
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className={styles.roomCardBody}>
                {room.description && (
                  <p className={styles.roomDescription}>
                    {room.description}
                  </p>
                )}

                {/* Room Details Grid */}
                <div className={styles.roomDetails}>
                  <div className={styles.detailItem}>
                    <div className={`${styles.detailIcon} ${styles.participantsIcon}`}>
                      👥
                    </div>
                    <div>
                      <div className={styles.detailLabel}>Participants</div>
                      <div className={styles.detailValue}>
                        {room.participants || 0}/{room.maxParticipants || '∞'}
                      </div>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <div className={`${styles.detailIcon} ${styles.durationIcon}`}>
                      ⏱️
                    </div>
                    <div>
                      <div className={styles.detailLabel}>Duration</div>
                      <div className={styles.detailValue}>
                        {room.duration || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <div className={`${styles.detailIcon} ${styles.statusIcon}`}>
                      📊
                    </div>
                    <div>
                      <div className={styles.detailLabel}>Status</div>
                      <div className={styles.detailValue}>
                        {getStatusBadge(room.isActive)}
                      </div>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <div className={`${styles.detailIcon} ${styles.createdIcon}`}>
                      📅
                    </div>
                    <div>
                      <div className={styles.detailLabel}>Created</div>
                      <div className={styles.detailValue}>
                        {formatDate(room.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creator Info */}
                <div className={styles.creatorSection}>
                  <div
                    className={styles.creatorAvatar}
                    style={{ background: getAvatarColor(creatorName) }}
                  >
                    {creatorName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.creatorInfo}>
                    <span className={styles.creatorLabel}>Created by</span>
                    <span className={styles.creatorName}>{creatorName}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className={styles.roomCardFooter}>
                <button
                  className={styles.joinButton}
                  onClick={() => handleJoinRoom(roomId)}
                  disabled={joiningRoom === roomId || room.isActive == false}
                >
                  {joiningRoom === roomId ? (
                    <>
                      <span className={styles.loadingSpinner} style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                      Joining...
                    </>
                  ) : (
                    <>
                      <span className={styles.buttonIcon}>🚪</span>
                      Join Room
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Joinroom;
