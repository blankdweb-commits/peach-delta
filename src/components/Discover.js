import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import PitStore from './PitStore';

// Mock Data for Matches
const potentialMatches = [
  {
    id: 1,
    alias: 'Delta_Florence',
    realName: 'Chioma Okeke', // Hidden until ripened
    photo: 'https://via.placeholder.com/150', // Blurred initially
    age: 23,
    level: 'Intern',
    location: 'Asaba, Delta State', // Broader Delta location
    distance: '1.2km',
    likes: ['Night shifts', 'Suya after rounds', 'Pediatric ward'],
    dislikes: ['8 AM lectures', 'Rude preceptors', 'PHCN blackouts'],
    compatibility: 95
  },
  {
    id: 2,
    alias: 'Scrub_Life_Warri',
    realName: 'Emeka Johns',
    photo: 'https://via.placeholder.com/150',
    age: 25,
    level: 'Year 3',
    location: 'Warri, Delta State',
    distance: '4.5km',
    likes: ['Anatomy study', 'Boat club vibes', 'Skincare'],
    dislikes: ['Ghosting', 'Heavy textbooks', 'Double shifts'],
    compatibility: 80
  }
];

const Discover = () => {
  const { user, spendPits } = useUser();
  const [currentMatch, setCurrentMatch] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [ripened, setRipened] = useState(false);

  useEffect(() => {
    // Simulate finding a match
    const match = potentialMatches[0];
    setCurrentMatch(match);

    // Trigger notification if compatibility >= 90%
    if (match.compatibility >= 90) {
      // Small delay to simulate "finding"
      const timer = setTimeout(() => setShowNotification(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRipen = () => {
    const cost = 5;
    if (spendPits(cost)) {
      setRipened(true);
      setShowNotification(false);
      alert(`You have ripened the connection with ${currentMatch.alias}!`);
    } else {
      // This path shouldn't be reached via the button if we disable it,
      // but good for safety.
      alert("Not enough Pits!");
      setShowStore(true);
    }
  };

  const handleGoToStore = () => {
    setShowStore(true);
    setShowNotification(false);
  };

  if (showStore) {
    return <PitStore onClose={() => setShowStore(false)} />;
  }

  if (!currentMatch) return <div>Finding Peaches near you...</div>;

  return (
    <div className="discover-container" style={{ position: 'relative', minHeight: '80vh' }}>
      <h2>Discover Peaches 🍑</h2>

      <div className="profile-card" style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        background: 'white',
        filter: ripened ? 'none' : 'blur(0px)' // We don't blur the whole card, just photo/name logic
      }}>
        <div className="photo-container" style={{ marginBottom: '15px' }}>
          {ripened ? (
            <img src={currentMatch.photo} alt={currentMatch.realName} style={{ borderRadius: '50%' }} />
          ) : (
            <div style={{
              width: '150px',
              height: '150px',
              background: '#ddd',
              borderRadius: '50%',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span>PHOTO BLURRED</span>
            </div>
          )}
        </div>

        <h3>{ripened ? currentMatch.realName : currentMatch.alias}</h3>
        <p>{currentMatch.level} • {currentMatch.location}</p>
        <p><strong>Distance:</strong> {currentMatch.distance}</p>

        <div className="vibes">
          <h4>Sweet Peaches (Likes)</h4>
          <p>{currentMatch.likes.join(', ')}</p>

          <h4>Bruised Peaches (Dislikes)</h4>
          <p>{currentMatch.dislikes.join(', ')}</p>
        </div>

        <div className="compatibility" style={{ marginTop: '20px', color: '#ff7f50', fontWeight: 'bold' }}>
          Compatibility: {currentMatch.compatibility}%
        </div>
      </div>

      {/* Peach Nectar Notification Overlay */}
      {showNotification && !ripened && (
        <div className="peach-nectar-notification" style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '400px',
          backgroundColor: '#FFF0F5', // Lavender Blush
          border: '2px solid #FF7F50', // Coral
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 1000,
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#FF7F50', margin: '0 0 10px 0' }}>Peach Nectar! 🍯</h3>
          <p style={{ margin: '0 0 15px 0' }}>
            Sweet like Nectar! You and <strong>{currentMatch.alias}</strong> are a {currentMatch.compatibility}% match.
            You both love {currentMatch.likes[1]}?
          </p>

          <div className="actions">
            {user.pits >= 5 ? (
              <button
                className="btn btn-primary"
                onClick={handleRipen}
                style={{ width: '100%' }}
              >
                Ripen Now (-5 Pits)
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <p style={{ color: 'red', margin: 0, fontSize: '0.9rem' }}>Not enough Pits! (Balance: {user.pits})</p>
                 <button
                  className="btn btn-primary"
                  onClick={handleGoToStore}
                  style={{ width: '100%' }}
                >
                  Get Pits to Ripen
                </button>
              </div>
            )}

            <button
              className="btn"
              onClick={() => setShowNotification(false)}
              style={{ background: 'transparent', color: '#888', marginTop: '10px', fontSize: '0.8rem' }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
