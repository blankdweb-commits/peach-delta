import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

const NOTIFICATION_STYLES = {
  container: {
    backgroundColor: '#FFDAB9', // Peach puff
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #FF8C00',
    margin: '20px 0',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF4500',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  }
};

const Discover = ({ onNavigateToStore }) => {
  const { user, matches, pits, ripenMatch, ripenedMatches } = useContext(UserContext);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  if (!user || matches.length === 0) return <div>Loading...</div>;

  const match = matches[currentMatchIndex];
  const isRipened = ripenedMatches.includes(match.id);

  const calculateCompatibility = (userA, userB) => {
    if (!userA || !userB) return { score: 0, sharedLikes: [], sharedDislikes: [] };

    const sharedLikes = userA.likes.filter(l => userB.likes.includes(l));
    const sharedDislikes = userA.dislikes.filter(d => userB.dislikes.includes(d));

    const totalAttributes = userA.likes.length + userA.dislikes.length; // 6
    const matchCount = sharedLikes.length + sharedDislikes.length;

    const score = Math.round((matchCount / totalAttributes) * 100);

    return { score, sharedLikes, sharedDislikes };
  };

  const { score, sharedLikes, sharedDislikes } = calculateCompatibility(user, match);

  const handleRipenClick = () => {
    if (pits >= 5) {
      ripenMatch(match.id);
    } else {
      onNavigateToStore();
    }
  };

  const handleNext = () => {
      setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
  };

  const showNotification = score >= 90 && !isRipened;

  const getNotificationMessage = () => {
      const templates = [];

      if (sharedLikes.length > 0 && sharedDislikes.length > 0) {
          templates.push(`Sweet like Nectar! 🍯 You and ${match.alias} are a ${score}% match. You both hate ${sharedDislikes[0]} but love ${sharedLikes[0]}? Use 5 Pits to see your twin!`);
      }

      if (sharedDislikes.length > 0) {
           templates.push(`Shift Partner Alert! 🩺 A ${score}% match just landed near ${match.location}. They also hate ${sharedDislikes[0]}. Ripen the connection now! 🍑`);
      }

      templates.push(`Is this your person? 😍 You and ${match.alias} have the same 'Sweet Peaches.' Don't let this one stay unripened!`);

      const index = Math.floor(Math.random() * templates.length);
      return templates[index];
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Discover Peaches in Delta State</h2>

      <div style={{marginBottom: '10px'}}>
        <strong>Your Pits: {pits}</strong>
      </div>

      {showNotification && (
        <div style={NOTIFICATION_STYLES.container} data-testid="nectar-notification">
          <h3>Peach Nectar! 🍑</h3>
          <p>{getNotificationMessage()}</p>
          <button
            style={NOTIFICATION_STYLES.button}
            onClick={handleRipenClick}
            data-testid="notification-action-btn"
          >
            {pits >= 5 ? 'Ripen Now (5 Pits)' : 'Get Pits to Ripen'}
          </button>
        </div>
      )}

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h3>{isRipened ? match.alias : 'Anonymous Peach'}</h3>
        <p>Location: {match.location}</p>
        <p>Level: {match.level}</p>
        <p>Compatibility: {score}%</p>

        <h4>Sweet Peaches (Likes)</h4>
        <ul>
            {match.likes.map(l => <li key={l}>{l}</li>)}
        </ul>

        <h4>Bruised Peaches (Dislikes)</h4>
        <ul>
            {match.dislikes.map(d => <li key={d}>{d}</li>)}
        </ul>

        {!isRipened && !showNotification && (
             <button style={NOTIFICATION_STYLES.button} onClick={handleRipenClick}>
                {pits >= 5 ? 'Ripen (5 Pits)' : 'Get Pits'}
             </button>
        )}
      </div>

      <button onClick={handleNext} style={{marginTop: '20px'}}>Next Match</button>
    </div>
  );
};

export default Discover;
