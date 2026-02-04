import React, { useState, useContext, useEffect, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import { MOCK_USERS } from '../data/mockData';

const styles = {
  header: { color: '#e91e63' },
  matchCard: { border: '1px solid #ffccbc', padding: '15px', margin: '15px 0', borderRadius: '12px', backgroundColor: '#fff' },
  blurred: { filter: 'blur(8px)', transition: 'filter 0.3s' },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#ffab91',
    margin: '0 auto 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  }
};

const Discover = ({ onNavigateToStore }) => {
  const { user, pits, ripenMatch, ripenedMatches } = useContext(UserContext);
  const [matches, setMatches] = useState([]);
  const [highMatch, setHighMatch] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('');

  const calculateCompatibility = (currentUser, otherUser) => {
    const sharedLikes = currentUser.likes.filter(l => otherUser.likes.includes(l));
    const sharedDislikes = currentUser.dislikes.filter(d => otherUser.dislikes.includes(d));

    let score = (sharedLikes.length * 20) + (sharedDislikes.length * (40 / 3));
    score = Math.min(Math.round(score), 100);

    return { score, sharedLikes, sharedDislikes };
  };

  const generateNotificationMessage = (match) => {
    const templates = [
      `Sweet like Nectar! 🍯 You and ${match.alias} are a ${match.compatibility}% match. You both hate ${match.sharedDislikes[0] || 'stuff'} but love ${match.sharedLikes[0] || 'stuff'}? Use 5 Pits to see your twin!`,
      `Shift Partner Alert! 🩺 A ${match.compatibility}% match just landed nearby. They also hate ${match.sharedDislikes[0] || 'stuff'}. Ripen the connection now! 🍑`,
      `Is this your person? 😍 You and ${match.alias} have the same 'Sweet Peaches.' Don't let this one stay unripened!`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  useEffect(() => {
    const calculatedMatches = MOCK_USERS
        .filter(u => u.id !== user.id)
        .map(u => {
            const { score, sharedLikes, sharedDislikes } = calculateCompatibility(user, u);
            return { ...u, compatibility: score, sharedLikes, sharedDislikes };
        })
        .sort((a, b) => b.compatibility - a.compatibility);

    setMatches(calculatedMatches);

    const bestMatch = calculatedMatches.find(m => m.compatibility >= 90);

    if (bestMatch && !ripenedMatches.has(bestMatch.id)) {
        setHighMatch(bestMatch);
        // Ensure message is stable for the same match/render cycle
        setNotificationMsg(prev => prev || generateNotificationMessage(bestMatch));
    } else {
        setHighMatch(null);
        setNotificationMsg('');
    }

    return () => {
        setHighMatch(null);
    }
  }, [user, ripenedMatches]);

  const handleRipen = (matchId) => {
    const success = ripenMatch(matchId);
    if (success) {
      // Success feedback handled by UI update
    } else {
       onNavigateToStore();
    }
  };

  return (
    <div className="card">
      <h2 style={styles.header}>Discover Peaches in Delta State 🍑</h2>

      {highMatch && (
        <div className="notification">
          <h3>Peach Nectar! 🍯</h3>
          <p>{notificationMsg}</p>

          <button
            className="button"
            onClick={() => {
                if (pits >= 5) {
                    handleRipen(highMatch.id);
                } else {
                    onNavigateToStore();
                }
            }}
          >
            {pits >= 5 ? 'Ripen Now (5 Pits)' : 'Get Pits to Ripen'}
          </button>
        </div>
      )}

      <div>
        {matches.map(match => {
           const isRipened = ripenedMatches.has(match.id);
           return (
             <div key={match.id} style={styles.matchCard}>
               <h3>{match.alias}</h3>
               <p>{match.level} • {match.location}</p>
               <p><strong>Compatibility: {match.compatibility}%</strong></p>

               <div style={{...styles.avatar, ...(isRipened ? {} : styles.blurred)}}>
                 {isRipened ? '👩‍⚕️' : '🍑'}
               </div>

               {!isRipened ? (
                 <button
                    className="button"
                    onClick={() => {
                        if (pits >= 5) handleRipen(match.id);
                        else onNavigateToStore();
                    }}
                 >
                    Ripen (5 Pits)
                 </button>
               ) : (
                 <p style={{color: 'green'}}><strong>Ripened! Start Chatting</strong></p>
               )}
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default Discover;
