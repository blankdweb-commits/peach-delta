import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const nectarNotificationStyle = {
  border: '2px solid #FFCBA4',
  backgroundColor: '#FFF5EE',
  padding: '20px',
  borderRadius: '15px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const adCardStyle = {
  border: '2px solid #aaa',
  backgroundColor: '#f0f0f0',
  padding: '20px',
  borderRadius: '15px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  position: 'relative'
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

const Discover = () => {
  const { user, ads, ripenMatch, navigateTo } = useUser();
  const [match, setMatch] = useState(null);
  const [isRipened, setIsRipened] = useState(false);
  const [showingAd, setShowingAd] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);

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

  // Determine if we should show an ad
  useEffect(() => {
     if (user.adPreferences.allowAds && ads.length > 0) {
        // Simple random chance for ad (e.g., 30% chance on load)
        // In reality, this would be more sophisticated interspersing
        if (Math.random() < 0.3) {
            setShowingAd(true);
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            setCurrentAd(randomAd);
        }
     }
  }, [user.adPreferences.allowAds, ads]);

  const handleRipen = async () => {
    const result = await ripenMatch();
    if (result.success) {
      setIsRipened(true);
    } else if (result.reason === 'limit_reached') {
        alert("Daily limit reached! Upgrade to Premium for unlimited connections.");
        navigateTo('settings');
    }
  };

  const handleSkipAd = () => {
      setShowingAd(false);
  };

  if (!match && !showingAd) return <div>Loading potential matches in Delta...</div>;

  return (
    <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Discover</h2>
            <div>
                <span style={{marginRight: '10px', fontWeight: 'bold'}}>
                    {user.membershipTier.toUpperCase()}
                </span>
                {user.membershipTier === 'free' && (
                    <span>({user.dailyRipenCount}/25 today)</span>
                )}
            </div>
        </div>

      {/* Ad Card */}
      {showingAd && currentAd && (
          <div style={adCardStyle}>
              <div style={{position: 'absolute', top: 10, right: 10, background: '#ccc', padding: '2px 6px', fontSize: '10px', borderRadius: '4px'}}>Sponsored</div>
              <h3>{currentAd.title}</h3>
              <p>{currentAd.content}</p>
              <div style={{marginTop: '20px'}}>
                  <button style={{...buttonStyle, backgroundColor: '#888'}} onClick={handleSkipAd}>Skip Ad</button>
                  <button style={{...buttonStyle, marginLeft: '10px', backgroundColor: '#444'}}>Learn More</button>
              </div>
          </div>
      )}

      {/* Peach Nectar Notification (Match Card) */}
      {!showingAd && match && match.compatibility >= 90 && !isRipened && (
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
           <button style={buttonStyle} onClick={handleRipen}>
              Ripen Connection 🍑
           </button>

           {user.membershipTier === 'free' && (
               <p style={{fontSize: '0.8em', color: '#666', marginTop: '10px'}}>
                   {25 - user.dailyRipenCount} free reveals left today.
               </p>
           )}
        </div>
      )}

      {/* Ripened View */}
      {!showingAd && isRipened && match && (
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
