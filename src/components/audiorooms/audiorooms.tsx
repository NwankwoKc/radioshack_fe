import { Link } from "react-router";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from './audiorooms.module.css';

function Audiorooms() {
  const [data, setdata] = useState<any[]>([]);
  const [error, seterr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${import.meta.env.VITE_BEURL}/rooms`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.data);
        setdata(response.data.data);
        setLoading(false);
      })
      .catch(err => {
        seterr(err);
        setLoading(false);
        console.log(`Error getting data: ${err.message}`);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div data-testid="error" className="error">Error loading rooms. Please try again later.</div>;
  }

  return (
    <div className={styles.audioRoomsContainer}>
      <h2 className={styles.roomsTitle}>Audio Rooms</h2>
      <div className={styles.roomsGrid}>
        {data.map((room) => (
          <div className={styles.roomCard} key={room.id || room._id}>

            <div className={styles.roomCardHeader}>
              <div className={styles.roomIcon}>🎙️</div>
              <h3 data-testid="roomname" className={styles.roomName}>{room.roomname || room.name}</h3>
            </div>

            <div className={styles.roomCardBody}>
              <div className={styles.creatorInfo}>
                <div className={styles.creatorAvatar}>
                  {room.creator?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className={styles.creatorDetails}>
                  <span className={styles.creatorLabel}>Created by</span>
                  <span data-testid="creator" className={styles.creatorName}>{room.creator || 'Unknown'}</span>
                </div>
              </div>

              {room.description && (
                <p data-testid="description" className={styles.roomDescription}>{room.description}</p>
              )}

              <Link
                to={`/rooms/${room.id || room._id}`}
                className={styles.detailsButton}
              >
                View Details
                <span className={styles.arrow}>→</span>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Audiorooms;
