import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const Discover = ({ onNavigateToStore }) => {
  const { userProfile, potentialMatches, pits, ripenMatch, isRipped } = useUser();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [notification, setNotification] = useState(null);

  const currentMatch = potentialMatches[currentMatchIndex];

  const calculateCompatibility = (user, match) => {
    const sharedLikes = user.likes.filter(l => match.likes.includes(l));
    const sharedDislikes = user.dislikes.filter(d => match.dislikes.includes(d));

    // Weight likes higher?
    // 3 likes = 60 points (20 each)
    // 3 dislikes = 40 points (13.3 each)
    let score = (sharedLikes.length * 20) + (sharedDislikes.length * 13);
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
        // Determine available templates based on data
        const validTemplates = [];

        // Sample 1: Needs 1 shared like + 1 shared dislike
        if (sharedLikes.length > 0 && sharedDislikes.length > 0) {
          validTemplates.push({
            id: 1,
            text: `Sweet like Nectar! 🍯 You and ${currentMatch.alias} are a ${score}% match. You both hate ${sharedDislikes[0]} but love ${sharedLikes[0]}? Use 5 Pits to see your twin!`
          });
        }

        // Sample 2: Needs 1 shared dislike
        if (sharedDislikes.length > 0) {
          validTemplates.push({
            id: 2,
            text: `Shift Partner Alert! 🩺 A ${score}% match just landed ${currentMatch.distance}km away. They also hate ${sharedDislikes[0]}. Ripen the connection now! 🍑`
          });
        }

        // Sample 3: Generic
        validTemplates.push({
          id: 3,
          text: `Is this your person? 😍 You and ${currentMatch.alias} have the same 'Sweet Peaches.' Don't let this one stay unripened!`
        });

        // Select random template
        const randomIndex = Math.floor(Math.random() * validTemplates.length);
        const selectedTemplate = validTemplates[randomIndex];

        setNotification({
          type: 'nectar',
          message: selectedTemplate.text,
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Peach Discover 🍑</h2>
        <div>Pits: {pits}</div>
      </header>

      {/* Notification Area */}
      {notification && (
        <div style={{
          backgroundColor: '#FFD700',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '2px solid #FFA500',
          animation: 'pulse 2s infinite'
        }}>
          <h3>{notification.message}</h3>
          <p>Don't let this one stay unripened!</p>
          <button
            onClick={handleRipenAction}
            style={{
              backgroundColor: '#FF6347',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {pits >= 5 ? "Ripen Now (5 Pits)" : "Get Pits to Ripen"}
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ height: '200px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           {isMatchRipped ? (
             <img src={currentMatch.photoUrl} alt={currentMatch.realName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           ) : (
             <div style={{ filter: 'blur(10px)', fontSize: '50px' }}>🍑</div>
           )}
        </div>
        <div style={{ padding: '20px' }}>
          <h3>{isMatchRipped ? currentMatch.realName : currentMatch.alias} <span style={{fontSize: '0.8em', color: '#666'}}>({currentMatch.level})</span></h3>
          <p>📍 {currentMatch.location} ({currentMatch.distance}km away)</p>
          <p><strong>Compatibility:</strong> {score}%</p>

          <div style={{ marginTop: '10px' }}>
            <strong>Sweet Peaches (Likes):</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
              {currentMatch.likes.map(like => (
                <span key={like} style={{ background: '#FFEFD5', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{like}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <strong>Bruised Peaches (Dislikes):</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
              {currentMatch.dislikes.map(dislike => (
                <span key={dislike} style={{ background: '#E6E6FA', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{dislike}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button onClick={handleNext} style={{ padding: '10px 20px', fontSize: '16px' }}>Next Peach ⏭️</button>
        {!isMatchRipped && !notification && (
           <button onClick={handleRipenAction} style={{ padding: '10px 20px', fontSize: '16px', background: '#FF6347', color: 'white', border: 'none', borderRadius: '5px' }}>
             Ripen (5 Pits)
           </button>
        )}
      </div>
    </div>
  );
};

export default Discover;
