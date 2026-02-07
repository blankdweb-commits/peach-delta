import React, { useState, useEffect, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { useUser } from '../context/UserContext';
import AdBanner from './AdBanner';
import { wingmanService } from '../services/wingmanService';
import './Discover.css';

const Discover = ({ onNavigateToStore, onNavigateToSettings, onNavigateToChats }) => {
  const { userProfile, potentialMatches, ripenMatch, isRipped, incrementAdsSeen, subscription } = useUser();
  const [lastDirection, setLastDirection] = useState();
  const [notification, setNotification] = useState(null);
  const [actionsSinceAd, setActionsSinceAd] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [wingmanLine, setWingmanLine] = useState(null);
  const [showWingman, setShowWingman] = useState(false);

  // Filter out banned users or already ripped?
  // Ripped users might still appear if we want to "re-visit" them or just filter them out.
  // Usually discovery hides matches.
  const deck = useMemo(() => {
    // Ensure potentialMatches is an array
    const matches = Array.isArray(potentialMatches) ? potentialMatches : [];
    return matches.filter(u => !u.banned && !isRipped(u.id));
  }, [potentialMatches, isRipped]);

  // We need to keep track of remaining cards to show empty state
  const [currentIndex, setCurrentIndex] = useState(deck.length - 1);
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(deck.length)
        .fill(0)
        .map((i) => React.createRef()),
    [deck.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < deck.length - 1;

  const calculateCompatibility = (user, match) => {
    if (!match.basics || !match.relationships || !match.life) return 0;
    // Simplified score for card view
    const userFun = user.basics?.fun || [];
    const userMedia = user.basics?.media || [];
    const userValues = user.relationships?.values || [];

    const commonFun = userFun.filter(f => match.basics.fun.includes(f));
    const commonMedia = userMedia.filter(m => match.basics.media.includes(m));
    const commonValues = userValues.filter(v => match.relationships.values.includes(v));

    let score = 0;
    score += Math.min(commonFun.length * 7, 20);
    score += Math.min(commonMedia.length * 7, 20);
    score += Math.min(commonValues.length * 10, 30);

    if (user.life.based === match.life.based) score += 20;
    if (user.relationships.lookingFor === match.relationships.lookingFor) score += 10;

    return Math.min(Math.round(score), 100);
  };

  // Helper to trigger Nectar Notification
  const checkNectar = (match) => {
      const score = calculateCompatibility(userProfile, match);
      if (score >= 80) {
          // Trigger Notification
          // We can show a modal or overlay
          const message = `Sweet like Nectar! 🍯 ${score}% Match with ${match.alias}!`;
          setNotification({ match, message, score });
      }
  };

  const swiped = async (direction, match, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    // Track Actions for Ads
    const newCount = actionsSinceAd + 1;
    setActionsSinceAd(newCount);
    const shouldShowAds = !subscription.isPremium || (subscription.isPremium && userProfile.preferences.allowAds);
    if (shouldShowAds && newCount >= 5) { // Show ad every 5 swipes
       setTimeout(() => setShowAd(true), 500); // Small delay
       setActionsSinceAd(0);
    }

    if (direction === 'right') {
        // Try to Ripen
        // Logic: if canRipen, call ripenMatch.
        // Wait, ripenMatch updates state which might re-render component.
        // If successful, great. If not (limit reached), we need to handle it.
        // However, swipe animation completes before async call finishes usually.

        // Check capacity first
        // We can use context canRipen() but it's sync.
        // ripenMatch is async.

        // If notification active, we might want to handle differently?
        // Actually if they swipe right, it means "I want to match/ripen".

        const success = await ripenMatch(match.id);
        if (!success) {
            // Limit Reached
            // We should probably undo the swipe or show an alert?
            // "Undo" is hard. Better to redirect to store or show modal.
            alert("Daily Limit Reached! Upgrade to Premium to continue ripening.");
            onNavigateToStore();
        } else {
             // Success
             // Check for Nectar (high match)
             checkNectar(match);
        }
    }
  };

  const outOfFrame = (name, idx) => {
    // Console log or cleanup
  };

  const swipe = async (dir) => {
    if (currentIndex >= 0 && currentIndex < deck.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  const handleAdComplete = () => {
    setShowAd(false);
    if (incrementAdsSeen) incrementAdsSeen();
  };

  if (showAd) {
    return <AdBanner onAdComplete={handleAdComplete} />;
  }

  // If notification (Nectar) is present
  if (notification) {
      return (
        <div className="nectar-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(255, 223, 186, 0.95)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px', textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0' }}>🍯</h1>
            <h2>{notification.message}</h2>
            <p>You ripened {notification.match.alias}! Start a chat?</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                <button onClick={() => setNotification(null)} style={{ padding: '15px 30px', border: '2px solid #333', background: 'transparent', borderRadius: '30px', cursor: 'pointer' }}>Keep Swiping</button>
                <button onClick={onNavigateToChats} style={{ padding: '15px 30px', background: '#FF6347', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>Go to Chat</button>
            </div>
        </div>
      );
  }

  // Handle empty state gracefully
  if (deck.length === 0 || currentIndex < 0) {
      return (
        <div className="discover-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>🍑</h1>
            <h2>No more peaches nearby!</h2>
            <p>Check back later or adjust your filters.</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '15px 30px', background: '#FF6347', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>Refresh</button>

            <div style={{ marginTop: '40px' }}>
                <button onClick={onNavigateToChats} style={{ marginRight: '20px', background: 'none', border: 'none', fontSize: '1rem', color: '#666', cursor: 'pointer' }}>💬 Chats</button>
                <button onClick={onNavigateToSettings} style={{ background: 'none', border: 'none', fontSize: '1rem', color: '#666', cursor: 'pointer' }}>⚙️ Settings</button>
            </div>
        </div>
      );
  }

  return (
    <div className="discover-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <header style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', zIndex: 100 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Discover 🍑</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={onNavigateToChats} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>💬</button>
          <button onClick={onNavigateToSettings} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>⚙️</button>
        </div>
      </header>

      <div className="card-container" style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {deck.map((match, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={match.id}
            onSwipe={(dir) => swiped(dir, match, index)}
            onCardLeftScreen={() => outOfFrame(match.alias, index)}
            preventSwipe={['up', 'down']}
          >
            <div
                style={{
                    backgroundImage: `url(${match.photoUrl || 'https://via.placeholder.com/400x600?text=Peach'})`,
                    width: '100%', height: '100%', borderRadius: '20px', backgroundSize: 'cover', backgroundPosition: 'center',
                    position: 'relative', overflow: 'hidden'
                }}
            >
                <div className="card-content">
                    <h1>{match.alias}, {match.level}</h1>
                    <p>📍 {match.distance}km away • {match.life.based}</p>
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {match.basics.fun.slice(0, 3).map(t => (
                            <span key={t} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: '15px' }}>{t}</span>
                        ))}
                    </div>
                </div>
            </div>
          </TinderCard>
        ))}
      </div>

      <div className="action-buttons" style={{ padding: '20px', paddingBottom: '40px', backgroundColor: 'white', display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <button className="swipe-btn swipe-left" onClick={() => swipe('left')}>✖</button>
        <button className="swipe-btn swipe-right" onClick={() => swipe('right')}>🍑</button>
      </div>

      {/* Compatibility Badge (if match is top card) */}
      {currentIndex >= 0 && deck[currentIndex] && (
           <div style={{
               position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)',
               background: 'rgba(255,255,255,0.9)', padding: '5px 15px', borderRadius: '20px',
               boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 50, pointerEvents: 'none'
           }}>
               Match: {calculateCompatibility(userProfile, deck[currentIndex])}%
           </div>
      )}
    </div>
  );
};

export default Discover;
