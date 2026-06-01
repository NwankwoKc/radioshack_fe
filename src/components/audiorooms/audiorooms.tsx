import { Link } from "react-router";
import axios from "axios";
import { useState, useEffect } from "react";
import "./audiorooms.module.css";

function Audiorooms() {
  const [data, setdata] = useState<any[]>([]);
  const [error, seterr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/rooms')
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
    return <div className="error">Error loading rooms. Please try again later.</div>;
  }

  return (
    <div className="audio-rooms-container">
      <h2 className="rooms-title">Audio Rooms</h2>
      <div className="rooms-grid">
        {data.map((room) => (
          <div className="room-card" key={room.id || room._id}>
            <div className="room-card-header">
              <div className="room-icon">🎙️</div>
              <h3 className="room-name">{room.roomname || room.name}</h3>
            </div>

            <div className="room-card-body">
              <div className="creator-info">
                <div className="creator-avatar">
                  {room.creator?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="creator-details">
                  <span className="creator-label">Created by</span>
                  <span className="creator-name">{room.creator || 'Unknown'}</span>
                </div>
              </div>

              {room.description && (
                <p className="room-description">{room.description}</p>
              )}
              <Link
                to={`/rooms/${room.id || room._id}`}
                className="details-button"
              >
                View Details
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}

export default Audiorooms;
