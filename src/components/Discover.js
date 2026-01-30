import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const NOTIFICATION_TEMPLATES = [
  "Sweet like Nectar! 🍯 You and [Alias] are a [Score]% match. You both hate [Dislike] but love [Like]? Use 5 Pits to see your twin!",
  "Shift Partner Alert! 🩺 A [Score]% match just landed 1km away. They also hate [Dislike]. Ripen the connection now! 🍑",
  "Is this your person? 😍 You and [Alias] have the same 'Sweet Peaches.' Don't let this one stay unripened!"
];

const styles = {
  container: { padding: '20px' },
  header: { fontSize: '24px', marginBottom: '20px' },
  card: { border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' },
  blurredImage: { filter: 'blur(5px)', width: '100px', height: '100px', borderRadius: '50%' },
  button: { padding: '10px 15px', backgroundColor: '#FF8C00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  notification: { backgroundColor: '#FFFACD', padding: '15px', border: '1px solid #FFD700', borderRadius: '8px', marginBottom: '20px' }
};

const Discover = ({ onNavigate }) => {
  const { user, matches, ripenedMatches, ripenMatch } = useContext(UserContext);
  const [highMatch, setHighMatch] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('');

  const calculateCompatibility = (match) => {
    const sharedLikes = user.likes.filter(l => match.likes.includes(l)).length;
    const sharedDislikes = user.dislikes.filter(d => match.dislikes.includes(d)).length;
    let score = (sharedLikes * 20) + (sharedDislikes * 13);
    if (score > 100) score = 100;
    return { score, sharedLikes: user.likes.filter(l => match.likes.includes(l)), sharedDislikes: user.dislikes.filter(d => match.dislikes.includes(d)) };
  };

  useEffect(() => {
    // Find a high match for notification simulation
    const bestMatch = matches.find(m => calculateCompatibility(m).score >= 90 && !ripenedMatches.includes(m.id));
    if (bestMatch) {
      const { score, sharedLikes, sharedDislikes } = calculateCompatibility(bestMatch);
      setHighMatch(bestMatch);

      const template = NOTIFICATION_TEMPLATES[Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length)];
      let msg = template.replace('[Alias]', bestMatch.alias)
                        .replace('[Score]', score)
                        .replace('[Like]', sharedLikes[0] || 'something')
                        .replace('[Dislike]', sharedDislikes[0] || 'something');
      setNotificationMsg(msg);
    } else {
      setHighMatch(null);
    }
  }, [matches, ripenedMatches, user]);

  const handleRipen = (matchId) => {
    const success = ripenMatch(matchId);
    if (success) {
      alert("Ripened!");
    } else {
      alert("Not enough Pits!");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Discover Peaches in Delta State 🍑</h1>

      {highMatch && (
        <div style={styles.notification}>
          <h3>Peach Nectar! 🍑</h3>
          <p>{notificationMsg}</p>
          {user.pits < 5 ? (
            <button style={styles.button} onClick={() => onNavigate('pitstore')}>
              Get Pits to Ripen
            </button>
          ) : (
            <button style={styles.button} onClick={() => handleRipen(highMatch.id)}>
              Ripen Now (5 Pits)
            </button>
          )}
        </div>
      )}

      <div>
        {matches.map(match => {
          const isRipened = ripenedMatches.includes(match.id);
          const { score } = calculateCompatibility(match);

          return (
            <div key={match.id} style={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={match.avatar}
                  alt="avatar"
                  style={isRipened ? { ...styles.blurredImage, filter: 'none' } : styles.blurredImage}
                />
                <div style={{ marginLeft: '15px' }}>
                  <h3>{isRipened ? match.alias : 'Anonymous Peach'}</h3>
                  <p>Match Score: {score}%</p>
                  <p>Location: {match.location}</p>
                  {!isRipened && (
                    <button style={styles.button} onClick={() => handleRipen(match.id)}>
                      Ripen to see details (5 Pits)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Discover;
