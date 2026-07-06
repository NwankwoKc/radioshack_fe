import { useState } from "react";
import axios from "axios";
import { Room } from "livekit-client"
import styles from "./create-audioroom.module.css";
type lsdata = {
  username: string,
  id: string
}
function Createaudioroom() {
  const [name, setname] = useState('');
  const [description, setdescription] = useState('')
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState<string | null>(null);


  const handleSubmit = async (e: any) => {
    //livekit roomcreation

    async function livekitroom() {
      try {
        let ls = localStorage.getItem("Udata")
        if (!ls) {
          seterror("user not logged in")
          return
        }
        let passcreatorId: lsdata = JSON.parse(ls)

        const response = await axios.post("https://radioshack-be.vercel.app/rooms/token", {
          room_name: name,
          participant_identity: passcreatorId.id
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
    let ls = localStorage.getItem("Udata")
    if (!ls) {
      seterror("user not logged in")
      return
    }
    let passcreatorId = JSON.parse(ls)
    const data = {
      roomname: name,
      creatorId: passcreatorId.id,
      description
    };

    try {
      await axios.post('https://radioshack-be.vercel.app/rooms', data);
      livekitroom()
      setloading(false);
      setname('');
      setdescription('')

    } catch (err: any) {
      seterror(err.message);
      setloading(false);
      console.error(err);
    }
  };

  return (
    <div className={styles.createRoomContainer}>
      <div className={styles.createRoomCard}>

        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.2)" />
              <path d="M24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12ZM28 22H26V18H22V22H20L24 28L28 22Z" fill="white" />
            </svg>
          </div>
          <div>
            <h2 className={styles.cardTitle}>Create a Room</h2>
            <p className={styles.cardSubtitle}>Set up a new audio room for your community</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.createRoomForm}>

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              <span data-testid="errormsg" className={styles.errorText}>{error}</span>
            </div>
          )}

          {/* Group Name Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="Groupname" className={styles.inputLabel}>
              Group Name
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="currentColor" />
                  <path d="M10 12C5.58172 12 2 14.6863 2 18V20H18V18C18 14.6863 14.4183 12 10 12Z" fill="currentColor" />
                </svg>
              </span>
              <input
                type="text"
                id="Groupname"
                name="Groupname"
                className={styles.formInput}
                placeholder="e.g. Tech Talks"
                value={name}
                onChange={(e) => setname(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Description Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="Description" className={styles.inputLabel}>
              Description
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 2.5H2.5C1.83696 2.5 1.20107 2.76339 0.732233 3.23223C0.263392 3.70107 0 4.33696 0 5V13.3333C0 14.0003 0.263392 14.6362 0.732233 15.1051C1.20107 15.5739 1.83696 15.8333 2.5 15.8333H5V18.3333C5 18.5543 5.08779 18.7663 5.24408 18.9226C5.40036 19.0789 5.61232 19.1667 5.83333 19.1667C5.95833 19.1667 6.08167 19.135 6.19167 19.075L10.5833 16.6667H17.5C18.163 16.6667 18.7989 16.4033 19.2678 15.9344C19.7366 15.4656 20 14.8297 20 14.1667V5C20 4.33696 19.7366 3.70107 19.2678 3.23223C18.7989 2.76339 18.163 2.5 17.5 2.5Z" fill="currentColor" />
                </svg>
              </span>
              <input
                type="text"
                id="Description"
                name="Description"
                className={styles.formInput}
                placeholder="What's this room about?"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Creating...
              </>
            ) : (
              <>
                <span className={styles.plusIcon}>+</span>
                Create Room
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Createaudioroom;
