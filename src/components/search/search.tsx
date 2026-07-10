import { useState } from 'react';
import styles from './search.module.css';

export interface RoomResult {
  id: string;
  name: string;
  memberCount: number;
}

export interface PersonResult {
  id: string;
  name: string;
  handle: string;
}

export interface SearchPanelProps {
  rooms: RoomResult[];
  people: PersonResult[];
}

type SearchMode = 'rooms' | 'people';

export default function Search() {
  const [mode, setMode] = useState<SearchMode>('rooms');
  const [query, setQuery] = useState('');
  const filteredPeople = [{ name: "", handle: "", id: "" }]
  const filteredRooms = [{ name: "", memberCount: 1, id: "" }]

  const initials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className={styles.searchContainer}>
      {/* ── Mode toggle ── */}
      <div className={styles.modeToggle}>
        <button
          type="button"
          className={`${styles.modeButton} ${mode === 'rooms' ? styles.modeButtonActive : ''}`}
          onClick={() => setMode('rooms')}
        >
          Rooms
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${mode === 'people' ? styles.modeButtonActive : ''}`}
          onClick={() => setMode('people')}
        >
          People
        </button>
      </div>

      {/* ── Search input ── */}
      <div className={styles.inputWrap}>
        <SearchIcon />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={mode === 'rooms' ? 'Search rooms…' : 'Search people…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* ── Results ── */}
      <div className={styles.resultsList}>
        {mode === 'rooms' &&
          (filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div key={room.id} className={styles.resultRow}>
                <div className={styles.roomIcon}>#</div>
                <div className={styles.resultInfo}>
                  <p className={styles.resultName}>{room.name}</p>
                  <p className={styles.resultMeta}>{room.memberCount} members</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>No rooms found.</p>
          ))}

        {mode === 'people' &&
          (filteredPeople.length > 0 ? (
            filteredPeople.map((person) => (
              <div key={person.id} className={styles.resultRow}>
                <div className={styles.personAvatar}>{initials(person.name)}</div>
                <div className={styles.resultInfo}>
                  <p className={styles.resultName}>{person.name}</p>
                  <p className={styles.resultMeta}>@{person.handle}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>No people found.</p>
          ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
