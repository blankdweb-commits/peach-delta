import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const Discover = ({ onNavigateToStore }) => {
  const { user, deductPits } = useUser();
  const [match, setMatch] = useState(null);
  const [isRipened, setIsRipened] = useState(false);

  // Mock finding a match
  useEffect(() => {
    // In a real app, this would fetch from API
    // Simulating a match in Delta State (not just Sapele)
    const potentialMatch = {
      id: 'm456',
      alias: 'Delta_Doc_Intern',
      realName: 'Chinedu Okeke',
      level: 'Intern',
      location: 'Warri',
      likes: ['Suya after rounds', 'Football', 'Coding'],
      dislikes: ['8 AM lectures', 'Traffic', 'Mosquitoes'],
      compatibility: 95, // High compatibility triggers Nectar
      imageBlurred: 'https://via.placeholder.com/150/0000FF/808080?text=Blurred',
      imageClear: 'https://via.placeholder.com/150/0000FF/808080?text=Clear',
    };
    setMatch(potentialMatch);
  }, []);

  const handleRipen = () => {
    if (user.pits >= 5) {
      const success = deductPits(5);
      if (success) {
        setIsRipened(true);
      }
    } else {
      onNavigateToStore();
    }
  };

  if (!match) return <div>Looking for Peaches in Delta State...</div>;

  const isHighCompatibility = match.compatibility >= 90;

  return (
    <div className="discover-container">
      <h2>Discover Peaches</h2>

      {/* Peach Nectar Notification */}
      {isHighCompatibility && !isRipened && (
        <div className="peach-nectar-notification" style={{ backgroundColor: '#FFD700', padding: '15px', borderRadius: '10px', marginBottom: '20px' }} data-testid="nectar-notification">
          <h3>🍑 Peach Nectar!</h3>
          <p>Sweet like Nectar! 🍯 You and {match.alias} are a {match.compatibility}% match.</p>
          <p>You both hate {match.dislikes[0]} but love {match.likes[0]}?</p>

          {user.pits >= 5 ? (
            <button
              onClick={handleRipen}
              style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Ripen Match (5 Pits)
            </button>
          ) : (
            <button
              onClick={onNavigateToStore}
              style={{ backgroundColor: '#4ECDC4', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Get More Pits
            </button>
          )}
        </div>
      )}

      <div className="match-card">
        <img src={isRipened ? match.imageClear : match.imageBlurred} alt="Match" />
        <h3>{isRipened ? match.realName : match.alias}</h3>
        <p>{match.level} - {match.location}</p>
        <p>Likes: {match.likes.join(', ')}</p>
        <p>Dislikes: {match.dislikes.join(', ')}</p>
      </div>
    </div>
  );
};

export default Discover;
