import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

const styles = {
  container: { padding: '20px', textAlign: 'center' },
  header: { fontSize: '24px', marginBottom: '20px' },
  card: { border: '1px solid #ccc', borderRadius: '10px', padding: '20px', maxWidth: '400px', margin: '0 auto' },
  nectarNotification: { backgroundColor: '#FFD700', color: '#000', padding: '15px', borderRadius: '10px', marginTop: '10px', marginBottom: '10px' },
  button: { padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px' },
  ripenButton: { backgroundColor: '#FF6347', color: 'white' },
  storeButton: { backgroundColor: '#32CD32', color: 'white' }
};

const calculateCompatibility = (user, match) => {
  const sharedLikes = user.sweetPeaches.filter(like => match.sweetPeaches.includes(like));
  const sharedDislikes = user.bruisedPeaches.filter(dislike => match.bruisedPeaches.includes(dislike));

  // (sharedLikes.length * 20) + (sharedDislikes.length * (40 / 3))
  let score = (sharedLikes.length * 20) + (sharedDislikes.length * (40 / 3));
  score = Math.min(Math.round(score), 100);

  return { score, sharedLikes, sharedDislikes };
};

const Discover = ({ onNavigateToStore }) => {
  const { user, matches, ripenedMatches, ripenMatch } = useContext(UserContext);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [highMatch, setHighMatch] = useState(null);

  const currentMatch = matches[currentMatchIndex];
  const isRipened = currentMatch && ripenedMatches.has(currentMatch.id);

  useEffect(() => {
    if (currentMatch) {
      const { score, sharedLikes, sharedDislikes } = calculateCompatibility(user, currentMatch);
      if (score >= 90 && !isRipened) {
        setHighMatch({ score, sharedLikes, sharedDislikes });
      } else {
        setHighMatch(null);
      }
    } else {
        setHighMatch(null);
    }

    // Cleanup to prevent stale state
    return () => setHighMatch(null);
  }, [currentMatch, user, isRipened]);

  if (!currentMatch) {
    return <div style={styles.container}>No matches found nearby.</div>;
  }

  const handleNext = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
  };

  const handleRipenAction = () => {
    if (user.pits >= 5) {
      ripenMatch(currentMatch.id);
    } else {
      onNavigateToStore();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Discover Peaches in Delta State 🍑</h1>
      <div style={styles.card}>
        <h2>{isRipened ? currentMatch.alias : "Anonymous Peach"}</h2>
        <p>Location: {currentMatch.location}</p>
        <p>Level: {currentMatch.level}</p>

        {isRipened ? (
             <img src={currentMatch.imageUrl} alt={currentMatch.alias} style={{width: '100px', borderRadius: '50%'}} />
        ) : (
             <div style={{width: '100px', height: '100px', backgroundColor: '#ddd', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Blurred</div>
        )}

        <div style={{marginTop: '10px'}}>
            <strong>Sweet Peaches (Likes):</strong> {currentMatch.sweetPeaches.join(", ")}
        </div>
        <div style={{marginTop: '10px'}}>
            <strong>Bruised Peaches (Dislikes):</strong> {currentMatch.bruisedPeaches.join(", ")}
        </div>

        {highMatch && (
          <div style={styles.nectarNotification} role="alert">
            <h3>Peach Nectar! 🍯</h3>
            <p>
                Sweet like Nectar! You and {currentMatch.alias} are a {highMatch.score}% match.
                You both love {highMatch.sharedLikes[0] || 'similar things'}!
            </p>
            <button
                onClick={handleRipenAction}
                style={{...styles.button, ...(user.pits >= 5 ? styles.ripenButton : styles.storeButton)}}
            >
                {user.pits >= 5 ? "Ripen Now (5 Pits)" : "Get Pits to Ripen"}
            </button>
          </div>
        )}

        {!isRipened && !highMatch && (
             <button onClick={handleRipenAction} style={{...styles.button, ...styles.ripenButton, marginTop: '20px'}}>
                 Ripen (5 Pits)
             </button>
        )}

        <div style={{marginTop: '20px'}}>
            <button onClick={handleNext} style={styles.button}>Next Peach &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default Discover;
