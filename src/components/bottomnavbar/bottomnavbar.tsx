import { useState } from 'react';
import styles from './bottomnavbar.module.css';
import { useNavigate } from 'react-router';
const tabs = [
  { id: 'search', label: 'Search', icon: <SearchIcon />, link: '/search' },
  { id: 'fyp', label: 'For You', icon: <FypIcon />, link: '/rooms' },
  { id: 'profile', label: 'Profile', icon: <ProfileIcon />, link: '/profile' },
];

export default function BottomNavBar() {
  const [active, setActive] = useState('fyp');
  const navigate = useNavigate()
  return (
    <nav className={styles.bottomNav}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.navItem} ${active === tab.id ? styles.navItemActive : ''}`}
          onClick={() => {
            setActive(tab.id)
            navigate(tab.link)
          }}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FypIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3l1.9 5.8h6.1l-4.9 3.6 1.9 5.8L12 14.6l-4.9 3.6 1.9-5.8-4.9-3.6h6.1L12 3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
