import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { USERS } from '../data/mockData';

const styles = {
  container: { padding: '20px', paddingBottom: '200px' },
  header: { textAlign: 'center', color: '#ff7f50' },
  card: { border: '1px solid #ddd', borderRadius: '10px', padding: '15px', marginBottom: '20px' },
  notification: {
    position: 'fixed', bottom: '0', left: '0', right: '0',
    backgroundColor: '#fffbe6', borderTop: '2px solid #ff7f50',
    padding: '20px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  button: {
    backgroundColor: '#ff7f50', color: 'white', border: 'none',
    padding: '12px 20px', borderRadius: '5px', marginTop: '10px', cursor: 'pointer',
    width: '100%', fontSize: '16px', fontWeight: 'bold'
  }
};

const calculateCompatibility = (currentUser, otherUser) => {
  const sharedLikes = currentUser.likes.filter(l => otherUser.likes.includes(l));
  const sharedDislikes = currentUser.dislikes.filter(d => otherUser.dislikes.includes(d));

  let score = (sharedLikes.length * 20) + (sharedDislikes.length * (40 / 3));
  score = Math.min(Math.round(score), 100);

  return { score, sharedLikes, sharedDislikes };
};

const Discover = ({ onNavigateToStore }) => {
  const { user, ripenMatch } = useUser();
  const [highMatch, setHighMatch] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const match = USERS.find(u => {
      if (u.id === user.id) return false;
      if (user.ripenedMatches.includes(u.id)) return false;
      const { score } = calculateCompatibility(user, u);
      return score >= 90;
    });

    if (match) {
        const { score, sharedLikes, sharedDislikes } = calculateCompatibility(user, match);
        const matchData = { ...match, score, sharedLikes, sharedDislikes };
        setHighMatch(matchData);

        // Select message once
        const messages = [
            `Sweet like Nectar! 🍯 You and ${matchData.alias} are a ${matchData.score}% match. You both hate ${matchData.sharedDislikes[0] || 'bad vibes'} but love ${matchData.sharedLikes[0] || 'good vibes'}? Use 5 Pits to see your twin!`,
            `Shift Partner Alert! 🩺 A ${matchData.score}% match just landed nearby. They also hate ${matchData.sharedDislikes[0] || 'Ward Rounds'}. Ripen the connection now! 🍑`,
            `Is this your person? 😍 You and ${matchData.alias} have the same 'Sweet Peaches.' Don't let this one stay unripened!`
        ];
        setMessage(messages[Math.floor(Math.random() * messages.length)]);

    } else {
        setHighMatch(null);
    }
  }, [user.ripenedMatches, user.likes, user.dislikes, user.id]);

  const handleRipenClick = () => {
    if (user.pits < 5) {
      onNavigateToStore();
    } else {
      ripenMatch(highMatch.id);
      // alert(`You have ripened the match with ${highMatch.alias}!`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Discover Peaches in Delta State 🍑</h1>

      {USERS.map(u => {
        if (u.id === user.id) return null;
        const isRipened = user.ripenedMatches.includes(u.id);
        const { score } = calculateCompatibility(user, u);

        return (
          <div key={u.id} style={styles.card}>
            <h3>{isRipened ? u.alias + " (Revealed)" : u.alias}</h3>
            <p>Location: {u.location}</p>
            <p>Compatibility: {score}%</p>
            <div>
              <strong>Sweet Peaches:</strong> {u.likes.join(', ')}
            </div>
            <div>
              <strong>Bruised Peaches:</strong> {u.dislikes.join(', ')}
            </div>
          </div>
        );
      })}

      {highMatch && (
        <div style={styles.notification}>
          <h3>Peach Nectar! 🍑</h3>
          <p>{message}</p>
          <button style={styles.button} onClick={handleRipenClick}>
            {user.pits >= 5 ? 'Ripen Now (5 Pits)' : 'Get Pits to Ripen'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Discover;
