import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const Discover = () => {
  const { user, deductPits, navigateTo } = useUser();
  const [match, setMatch] = useState(null);
  const [isRipened, setIsRipened] = useState(false);

  // Mock Match Data (Simulating a high compatibility match)
  useEffect(() => {
    // In a real app, this would be fetched from an API based on geolocation and preferences
    setMatch({
      id: 'match_123',
      alias: 'Unknown Peach',
      realName: 'Chioma N.',
      photoUrl: 'https://via.placeholder.com/150', // Placeholder
      compatibility: 95,
      likes: ['Suya after rounds', 'Pediatric ward', 'Afrobeats'],
      dislikes: ['8 AM lectures', 'Traffic', 'Mosquitoes'],
      distance: '1.2km' // Close proximity in Sapele/Delta
    });
  }, []);

  const handleRipen = () => {
    const cost = 5;
    if (user.pits >= cost) {
      const success = deductPits(cost);
      if (success) {
        setIsRipened(true);
        // Here we would also update the backend to record the "Ripen" action
      }
    } else {
        // This case handles if the button was clicked but logic failed,
        // though the UI should guide them to the store first.
        alert("Not enough Pits!");
        navigateTo('store');
    }
  };

  if (!match) return <div>Loading potential matches in Delta...</div>;

  const nectarNotificationStyle = {
    border: '2px solid #FFCBA4',
    backgroundColor: '#FFF5EE',
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    backgroundColor: '#FF7F50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '15px'
  };

  return (
    <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Discover</h2>
            <div>Balance: {user.pits} Pits</div>
        </div>

      {/* Peach Nectar Notification */}
      {match.compatibility >= 90 && !isRipened && (
        <div style={nectarNotificationStyle}>
          <h2 style={{ color: '#FF4500' }}>Peach Nectar! 🍯</h2>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{match.compatibility}% Match!</p>
          <p>
            You both hate <strong>{match.dislikes[0]}</strong> but love <strong>{match.likes[0]}</strong>?
          </p>

          <div style={{ margin: '20px auto', width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', filter: 'blur(10px)' }}>
            <img src={match.photoUrl} alt="Match" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <p><em>{match.distance} away</em></p>

          {/* Logic for Action Button */}
          {user.pits >= 5 ? (
             <button style={buttonStyle} onClick={handleRipen}>
                Ripen Connection (-5 Pits) 🍑
             </button>
          ) : (
              <button style={{ ...buttonStyle, backgroundColor: '#20B2AA' }} onClick={() => navigateTo('store')}>
                  Get More Pits to Ripen 🛒
              </button>
          )}
        </div>
      )}

      {/* Ripened View */}
      {isRipened && (
        <div style={nectarNotificationStyle}>
          <h2 style={{ color: '#32CD32' }}>Connection Ripened! 💚</h2>
          <div style={{ margin: '20px auto', width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%' }}>
            <img src={match.photoUrl} alt="Match" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h3>{match.realName} (@{match.alias})</h3>
          <p>is waiting for your message!</p>
          <button style={buttonStyle}>Start Chat</button>
        </div>
      )}

    </div>
  );
};

export default Discover;
