import { useState } from 'react';
import styles from './profile.module.css';
import axios from 'axios';

export interface Group {
  id: string;
  roomname: string;
}

export interface Profile {
  username: string;
  profilePicUrl?: string;
  email: string;
  password: string;
  createdGroups: Group[];
  joinedGroups: Group[];
}

export default function ProfileCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [createdGroups, setcreatedGroups] = useState<Array<Group>>([]);
  const [joinedGroups, setjoinedGroups] = useState<Array<Group>>([]);
  const [profilePicUrl, setprofilePicUrl] = useState('')

  function getprofile() {
    const token = localStorage.getItem('token')
    let id = localStorage.getItem('Udata')
    if (!id) {
      return
    }
    id = JSON.parse(id).id
    console.log(id)
    axios.get(`https://radioshack-be.vercel.app/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(el => {
      let result = el.data.data
      console.log(result)
      setusername(result.username)
      setemail(result.email)
      setpassword("password")
      setcreatedGroups(result.createdgroups)
      setjoinedGroups(result.groups)
      setprofilePicUrl('https://people.com/thmb/L-K8CyH9fyhmCy8v8OQERFlnmdA=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(668x0:670x2)/Anne-Hathaway-2002-041626-1-54f6abd6326d40658ae13ab757f06411.jpg')
    })
  }

  getprofile()
  const initials = username
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.profileContainer}>
      {/* ── Header ── */}
      <div className={styles.profileHeader}>
        {profilePicUrl ? (
          <img src={profilePicUrl} alt={username} className={styles.profilePic} />
        ) : (
          <div className={styles.profilePicFallback}>{initials}</div>
        )}
        <h2 className={styles.username}>{username}</h2>
      </div>

      {/* ── Account details ── */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Email</span>
        <p className={styles.fieldValue}>{email}</p>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Password</span>
        <div className={styles.passwordRow}>
          <p className={styles.fieldValue}>
            {showPassword ? password : '•'.repeat(Math.max(password.length, 8))}
          </p>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* ── Created groups ── */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Created Groups</span>
        {createdGroups.length > 0 ? (
          <ul className={styles.groupList}>
            {createdGroups?.map((group) => (
              <li key={group.id} className={styles.groupChip}>
                {group.roomname}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyText}>No groups created yet.</p>
        )}
      </div>

      {/* ── Joined groups ── */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Joined Groups</span>
        {joinedGroups.length > 0 ? (
          <ul className={styles.groupList}>
            {joinedGroups?.map((group) => (
              <li key={group.id} className={styles.groupChip}>
                {group.roomname}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyText}>Not part of any groups yet.</p>
        )}
      </div>
    </div>
  );
}
