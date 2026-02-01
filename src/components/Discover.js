import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notification: {
    backgroundColor: '#FFD700',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '2px solid #FFA500',
    animation: 'pulse 2s infinite'
  },
  notificationButton: {
    backgroundColor: '#FF6347',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  profileCard: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  profileImageContainer: {
    height: '200px',
    backgroundColor: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholder: {
    filter: 'blur(10px)',
    fontSize: '50px'
  },
  profileContent: {
    padding: '20px'
  },
  alias: {
    fontSize: '0.8em',
    color: '#666'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    marginTop: '5px'
  },
  likeTag: {
    background: '#FFEFD5',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px'
  },
  dislikeTag: {
    background: '#E6E6FA',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px'
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px'
  },
  nextButton: {
    padding: '10px 20px',
    fontSize: '16px'
  },
  ripenButton: {
    padding: '10px 20px',
    fontSize: '16px',
    background: '#FF6347',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  }
};

const Discover = ({ onNavigateToStore }) => {
  const { userProfile, potentialMatches, pits, ripenMatch, isRipped } = useUser();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [notification, setNotification] = useState(null);

  const currentMatch = potentialMatches[currentMatchIndex];

  const calculateCompatibility = (user, match) => {
    // Simple algorithm:
    // Each matching "Like" (Sweet Peach) = 20%
    // Each matching "Dislike" (Bruised Peach) = 13.33% (approx, to reach 100 with 3+3)
    // Let's simplify: 3 likes + 3 dislikes = 6 items.
    // If they match all 3 likes and all 3 dislikes, that's perfect?
    // Let's say max score is 100.

    const sharedLikes = user.likes.filter(l => match.likes.includes(l));
    const sharedDislikes = user.dislikes.filter(d => match.dislikes.includes(d));

    // Weight likes higher?
    // 3 likes = 60 points (20 each)
    // 3 dislikes = 40 points (13.33... each)
    let score = (sharedLikes.length * 20) + (sharedDislikes.length * (40 / 3));
    if (score > 100) score = 100;
    return {
      score: Math.round(score),
      sharedLikes,
      sharedDislikes
    };
  };

  useEffect(() => {
    if (currentMatch) {
      const { score, sharedLikes, sharedDislikes } = calculateCompatibility(userProfile, currentMatch);
      if (score >= 90 && !isRipped(currentMatch.id)) {
        const templates = [
          (data) => `Sweet like Nectar! 🍯 You and ${data.alias} are a ${data.score}% match. You both hate ${data.dislike} but love ${data.like}? Use 5 Pits to see your twin!`,
          (data) => `Shift Partner Alert! 🩺 A ${data.score}% match just landed ${data.distance}km away. They also hate ${data.dislike}. Ripen the connection now! 🍑`,
          (data) => `Is this your person? 😍 You and ${data.alias} have the same 'Sweet Peaches.' Don't let this one stay unripened!`
        ];

        const firstLike = sharedLikes.length > 0 ? sharedLikes[0] : "Nursing";
        const firstDislike = sharedDislikes.length > 0 ? sharedDislikes[0] : "Bad Shifts";

        const templateIndex = Math.floor(Math.random() * templates.length);
        const message = templates[templateIndex]({
          alias: currentMatch.alias,
          score: score,
          distance: currentMatch.distance,
          like: firstLike,
          dislike: firstDislike
        });

        setNotification({
          type: 'nectar',
          message: message,
          matchId: currentMatch.id
        });
      } else {
        setNotification(null);
      }
    }
  }, [currentMatchIndex, userProfile, currentMatch, isRipped]);

  const handleNext = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % potentialMatches.length);
  };

  const handleRipenAction = () => {
    if (pits >= 5) {
      const success = ripenMatch(currentMatch.id);
      if (success) {
        alert("Match Ripened! You can now see their details.");
        setNotification(null); // Clear notification after ripening
      }
    } else {
      onNavigateToStore();
    }
  };

  if (!currentMatch) return <div>No more matches nearby!</div>;

  const { score } = calculateCompatibility(userProfile, currentMatch);
  const isMatchRipped = isRipped(currentMatch.id);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Discover Peaches in Delta State 🍑</h2>
        <div>Pits: {pits}</div>
      </header>

      {/* Notification Area */}
      {notification && (
        <div style={styles.notification}>
          <h3>{notification.message}</h3>
          <p>Don't let this one stay unripened!</p>
          <button
            onClick={handleRipenAction}
            style={styles.notificationButton}
          >
            {pits >= 5 ? "Ripen Now (5 Pits)" : "Get Pits to Ripen"}
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileImageContainer}>
           {isMatchRipped ? (
             <img src={currentMatch.photoUrl} alt={currentMatch.realName} style={styles.profileImage} />
           ) : (
             <div style={styles.placeholder}>🍑</div>
           )}
        </div>
        <div style={styles.profileContent}>
          <h3>{isMatchRipped ? currentMatch.realName : currentMatch.alias} <span style={styles.alias}>({currentMatch.level})</span></h3>
          <p>📍 {currentMatch.location} ({currentMatch.distance}km away)</p>
          <p><strong>Compatibility:</strong> {score}%</p>

          <div style={{ marginTop: '10px' }}>
            <strong>Sweet Peaches (Likes):</strong>
            <div style={styles.tagsContainer}>
              {currentMatch.likes.map(like => (
                <span key={like} style={styles.likeTag}>{like}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <strong>Bruised Peaches (Dislikes):</strong>
            <div style={styles.tagsContainer}>
              {currentMatch.dislikes.map(dislike => (
                <span key={dislike} style={styles.dislikeTag}>{dislike}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.controls}>
        <button onClick={handleNext} style={styles.nextButton}>Next Peach ⏭️</button>
        {!isMatchRipped && !notification && (
           <button onClick={handleRipenAction} style={styles.ripenButton}>
             Ripen (5 Pits)
           </button>
        )}
      </div>
    </div>
  );
};

export default Discover;
