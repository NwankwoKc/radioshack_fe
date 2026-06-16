import { useState, useRef } from "react";
import axios from "axios";
import { Room } from "livekit-client"
import "./create-audioroom.module.css"


function Createaudioroom() {
  const [name, setname] = useState('');
  const [description, setdescription] = useState('')
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState<string | null>(null);
  const videoref = useRef<HTMLDivElement>(null)


  const handleSubmit = async (e: any) => {
    //livekit roomcreation
    async function livekitroom() {
      try {
        const response = await axios.post("http://localhost:3000/rooms/token", {
          room_name: name,
          participant_identity: localStorage.getItem('Uid') || "id1234556789"
        });

        const freshToken = response.data.data;

        const room = new Room();
        await room.connect('wss://radioshack-z35oydua.livekit.cloud', freshToken);
      } catch (err) {
        console.error("Token generation failed:", err);
      }
    }
    if (!name.trim()) {
      seterror('Groupname is required')
      setloading(false)
      return;
    }
    e.preventDefault(); // Prevent page reload
    setloading(true);
    seterror(null);

    const data = {
      roomname: name,
      creatorId: localStorage.getItem("userid") || "bb706f87-e5e4-4a78-aae4-6a6d748f1cf9",
      description
    };

    try {
      await axios.post('http://localhost:3000/rooms', data);
      livekitroom()
      setloading(false);
      setname('');
      setdescription('')

    } catch (err: any) {
      seterror(err.message || 'An error occurred');
      setloading(false);
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Groupname:
          <input
            type="text"
            name="Groupname"
            value={name}
            onChange={(e) => setname(e.target.value)}
            disabled={loading}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="Description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            disabled={loading}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Creategroup'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div ref={videoref}>

      </div>
    </div>
  );
}

export default Createaudioroom;
