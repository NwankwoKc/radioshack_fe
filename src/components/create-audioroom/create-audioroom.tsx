import { useState, useRef } from "react";
import axios from "axios";
import { Room, LocalTrackPublication, RemoteTrack, RoomEvent, Track } from "livekit-client"
import "./create-audioroom.module.css"

function Createaudioroom() {
  const [token, settoken] = useState("")
  const [name, setname] = useState('');
  const [description, setdescription] = useState('')
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState<string | null>(null);
  const videoref = useRef<HTMLDivElement>(null)
  const handleSubmit = async (e: any) => {
    //livekit roomcreation
    async function livekitroom() {
      await axios.post("http://localhost:3000/rooms/token", {
        room_name: 'roomname',
        participant_identity: 'participantsname'
      }).then(response => {
        settoken(response.data.data)
      })
        .catch(err => {
          console.error("Token generation failed:", err);
        })


      const room = new Room();

      room.prepareConnection(import.meta.env.VITE_WSURL as string, token)

      room
        .on(RoomEvent.TrackSubscribed, handletracksubscribed)
        .on(RoomEvent.TrackUnsubscribed, handletrackunsubscribed)
        .on(RoomEvent.ActiveSpeakersChanged, handleactivespeacker)
        .on(RoomEvent.Disconnected, handledisconnected)
        .on(RoomEvent.LocalTrackUnpublished, handlelocaltrackunpublished)

      room.connect(import.meta.env.VITE_WSURL, token); console.log('connected to room', room.name)
      function handletracksubscribed(track: RemoteTrack) {
        if (!track || !videoref) return;
        if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
          const element = track.attach();
          if (videoref.current) {
            videoref.current.innerHTML = ''
            videoref.current.appendChild(element)
          }
        }
      }


      function handletrackunsubscribed(track: RemoteTrack) {
        track.detach()
      }

      function handleactivespeacker() {

      }

      function handledisconnected() {
        console.log('disconnected from room')
      }

      function handlelocaltrackunpublished(publication: LocalTrackPublication,
      ) {
        if (!publication.track) return
        publication.track.detach();
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
      const res = await axios.post('http://localhost:3000/rooms', data);
      console.log(res)
      if (res.data.status === 200 || res.data.status === 201) {
        setname('');
        setloading(false);
        livekitroom()
      }
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
