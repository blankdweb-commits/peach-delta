import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const Discover = ({ onNavigateToStore }) => {
  const { userProfile, potentialMatches, pits, ripenMatch, isRipped } = useUser();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [notification, setNotification] = useState(null);

  const currentMatch = potentialMatches[currentMatchIndex];

  const calculateCompatibility = (user, match) => {
    // Matching Logic:
    // 1. Fun (Tags): 20% max (approx 7% per match, cap at 20)
    // 2. Media (Tags): 20% max
    // 3. Values (Tags): 30% max (10% each)
    // 4. Location (Based): 20% if same
    // 5. Looking For: 10% if same

    if (!match.basics || !match.relationships || !match.life) return { score: 0, commonFun: [], commonValues: [] };

    const commonFun = user.basics.fun.filter(f => match.basics.fun.includes(f));
    const commonMedia = user.basics.media.filter(m => match.basics.media.includes(m));
    const commonValues = user.relationships.values.filter(v => match.relationships.values.includes(v));

    let score = 0;

    score += Math.min(commonFun.length * 7, 20);
    score += Math.min(commonMedia.length * 7, 20);
    score += Math.min(commonValues.length * 10, 30);

    if (user.life.based === match.life.based) score += 20;
    if (user.relationships.lookingFor === match.relationships.lookingFor) score += 10;

    if (score > 100) score = 100;

    return { score: Math.round(score), commonFun, commonValues, commonMedia };
  };

  useEffect(() => {
    if (currentMatch) {
      const { score, commonFun, commonValues, commonMedia } = calculateCompatibility(userProfile, currentMatch);

      if (isRipped(currentMatch.id)) {
        setNotification(null);
        return;
      }

      if (score >= 80) { // Lowered threshold slightly as strict tag matching is harder
        const rand = Math.random();
        let message = "";
        const getRandom = (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

        if (rand < 0.33 && commonFun.length > 0) {
           const funItem = getRandom(commonFun);
           message = `Sweet like Nectar! 🍯 You and ${currentMatch.alias} match ${score}%. You both enjoy ${funItem}! Use 5 Pits to see your twin!`;
        } else if (rand < 0.66 && commonValues.length > 0) {
           const valueItem = getRandom(commonValues);
           message = `Deep Connection Alert! 💫 You and ${currentMatch.alias} match ${score}%. You both value ${valueItem}. Ripen the connection now! 🍑`;
        } else {
           message = `Is this your person? 😍 You and ${currentMatch.alias} have a ${score}% vibe match. Don't let this one stay unripened!`;
        }

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
        setNotification(null);
      }
    } else {
      onNavigateToStore();
    }
  };

  if (!currentMatch) return <div>No more matches nearby!</div>;

  const { score } = calculateCompatibility(userProfile, currentMatch);
  const isMatchRipped = isRipped(currentMatch.id);

  // Styles for the "Clean. Breathable." look
  const sectionStyle = { marginBottom: '25px' };
  const labelStyle = { color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '8px', display: 'block' };
  const textStyle = { fontSize: '1.1rem', color: '#333', lineHeight: '1.5' };
  const tagStyle = { display: 'inline-block', padding: '5px 12px', borderRadius: '20px', backgroundColor: '#f0f0f0', marginRight: '8px', marginBottom: '8px', fontSize: '0.9rem', color: '#555' };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Discover Peaches 🍑</h2>
        <div style={{ fontWeight: 'bold', color: '#FF6347' }}>{pits} Pits</div>
      </header>

      {notification && (
        <div style={{
          backgroundColor: '#FFF8DC',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #FFD700',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)'
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{notification.message}</h3>
          <button
            onClick={handleRipenAction}
            style={{
              backgroundColor: '#FF6347',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '10px'
            }}
          >
            {pits >= 5 ? "Ripen Now (5 Pits)" : "Get Pits to Ripen"}
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div style={{ border: '1px solid #eaeaea', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ height: '250px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
           {isMatchRipped ? (
             <img src={currentMatch.photoUrl} alt={currentMatch.realName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           ) : (
             <div style={{ fontSize: '80px', filter: 'blur(15px)', opacity: 0.6 }}>🍑</div>
           )}
           <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#333', backgroundColor: 'rgba(255,255,255,0.8)', padding: '5px 15px', borderRadius: '15px', fontSize: '0.9rem' }}>
             {currentMatch.distance}km away
           </div>
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>
              {isMatchRipped ? currentMatch.realName : currentMatch.alias}
              <span style={{ fontSize: '1rem', color: '#888', marginLeft: '10px', fontWeight: 'normal' }}>{currentMatch.level}</span>
            </h1>
            <div style={{ fontSize: '1.2rem', color: '#FF6347', fontWeight: 'bold' }}>{score}% Match</div>
          </div>

          {/* Basics */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Basics</span>
            <div style={{ marginBottom: '10px' }}>
              <div style={{fontSize: '0.9rem', marginBottom: '5px', color: '#666'}}>For Fun</div>
              <div>{currentMatch.basics.fun.map(tag => <span key={tag} style={tagStyle}>{tag}</span>)}</div>
            </div>
            <div>
              <div style={{fontSize: '0.9rem', marginBottom: '5px', color: '#666'}}>Music / Movies</div>
              <div>{currentMatch.basics.media.map(tag => <span key={tag} style={tagStyle}>{tag}</span>)}</div>
            </div>
          </div>

          {/* Life */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Life</span>
            <div style={{ marginBottom: '10px' }}><strong>Based in:</strong> {currentMatch.life.based}</div>
            <div style={textStyle}>"{currentMatch.life.upbringing}"</div>
          </div>

          {/* Work */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Work</span>
            <div style={{ marginBottom: '5px' }}><strong>{currentMatch.work.job}</strong></div>
            <div style={textStyle}>{currentMatch.work.reason}</div>
          </div>

          {/* Relationships */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Relationships</span>
            <div style={{ marginBottom: '10px' }}>
                <div style={{fontSize: '0.9rem', marginBottom: '5px', color: '#666'}}>Values</div>
                <div>{currentMatch.relationships.values.map(tag => <span key={tag} style={tagStyle}>{tag}</span>)}</div>
            </div>
            <div><strong>Looking for:</strong> {currentMatch.relationships.lookingFor}</div>
          </div>

          {/* Vision */}
          <div style={sectionStyle}>
            <span style={labelStyle}>Vision</span>
            <div style={{ ...textStyle, fontStyle: 'italic' }}>"{currentMatch.vision}"</div>
          </div>

          {/* Special */}
          <div style={sectionStyle}>
            <span style={labelStyle}>One thing I learned from my parents</span>
            <div style={textStyle}>{currentMatch.special}</div>
          </div>

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <button
          onClick={handleNext}
          style={{
            padding: '15px 30px',
            fontSize: '1rem',
            border: '2px solid #ddd',
            backgroundColor: 'transparent',
            borderRadius: '30px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Skip
        </button>
        {!isMatchRipped && !notification && (
           <button
             onClick={handleRipenAction}
             style={{
               padding: '15px 30px',
               fontSize: '1rem',
               background: '#FF6347',
               color: 'white',
               border: 'none',
               borderRadius: '30px',
               cursor: 'pointer',
               boxShadow: '0 4px 10px rgba(255, 99, 71, 0.3)'
             }}
           >
             Ripen (5 Pits)
           </button>
        )}
      </div>
    </div>
  );
};

export default Discover;
