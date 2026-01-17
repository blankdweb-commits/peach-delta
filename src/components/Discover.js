import React, { useState, useEffect } from 'react';
import { potentialMatches } from '../utils/mockData';

const Discover = ({ currentUser, onRipen, onNavigateToStore }) => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showNectar, setShowNectar] = useState(false);
  const [match, setMatch] = useState(null);
  const [ripenedMatches, setRipenedMatches] = useState({}); // Track ripened matches by ID
  const [nectarDismissedFor, setNectarDismissedFor] = useState([]); // Track dismissed nectar by match ID

  useEffect(() => {
    // Simulate finding a match
    const foundMatch = potentialMatches[currentMatchIndex % potentialMatches.length];
    setMatch(foundMatch);

    // Calculate Compatibility
    if (foundMatch) {
      const sharedLikes = foundMatch.likes.filter(l => currentUser.likes.includes(l));
      const sharedDislikes = foundMatch.dislikes.filter(d => currentUser.dislikes.includes(d));
      const totalAttributes = foundMatch.likes.length + foundMatch.dislikes.length; // 6
      const score = ((sharedLikes.length + sharedDislikes.length) / totalAttributes) * 100;

      // Trigger Nectar if:
      // 1. Score is high enough (>= 30 for demo)
      // 2. We haven't just dismissed it
      // 3. We haven't ripened it yet
      const isRipened = ripenedMatches[foundMatch.id];
      const isDismissed = nectarDismissedFor.includes(foundMatch.id);

      if (score >= 30 && !isRipened && !isDismissed) {
        setShowNectar(true);
      } else {
        setShowNectar(false);
      }
    }
  }, [currentMatchIndex, currentUser, ripenedMatches, nectarDismissedFor]);

  const handleRipenClick = () => {
    if (currentUser.pits >= 5) {
      onRipen(5); // Deduct 5 pits

      // Update local state to show ripened view
      setRipenedMatches(prev => ({
        ...prev,
        [match.id]: true
      }));

      // Dismiss Nectar overlay
      setShowNectar(false);
    } else {
      onNavigateToStore();
    }
  };

  const handleDismiss = () => {
    setShowNectar(false);
    if (match) {
        setNectarDismissedFor(prev => [...prev, match.id]);
    }
  }

  const handleSkip = () => {
    setCurrentMatchIndex(prev => prev + 1);
    setShowNectar(false);
  };

  if (!match) return <div>Loading Peaches...</div>;

  const isRipened = ripenedMatches[match.id];

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 min-h-screen relative">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-orange-600">Peach 🍑</h1>
        <div className="bg-white px-3 py-1 rounded-full shadow text-sm">
          {currentUser.pits} Pits
        </div>
      </header>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
        <div className="h-64 bg-gray-300 relative">
           {/* Photo: Unblurred if ripened, Blurred if not */}
          <img
            src={match.photoUrl}
            alt="Match"
            className={`w-full h-full object-cover transition-all duration-500 ${isRipened ? '' : 'filter blur-md'}`}
          />
          <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
             <h2 className="text-2xl font-bold">
               {isRipened ? match.realName : match.alias}
             </h2>
             <p className="text-sm">{match.geolocation.city}, {match.geolocation.state}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-bold text-orange-500 text-sm">SWEET PEACHES (LIKES)</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {match.likes.map(l => (
                <span key={l} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-purple-500 text-sm">BRUISED PEACHES (DISLIKES)</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {match.dislikes.map(d => (
                <span key={d} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={handleSkip} className="bg-gray-200 p-4 rounded-full hover:bg-gray-300">❌</button>
      </div>

      {/* Peach Nectar Notification Overlay */}
      {showNectar && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-sm w-full border-4 border-yellow-400">
            <div className="text-4xl mb-2">🍯 🍑</div>
            <h2 className="text-2xl font-bold text-orange-600 mb-2">Sweet like Nectar!</h2>
            <p className="text-gray-600 mb-6">
              You and {match.alias} are a high match! You both vibe on the same things.
            </p>

            <button
              onClick={handleRipenClick}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transform transition active:scale-95 ${
                currentUser.pits >= 5 ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-blue-500'
              }`}
            >
              {currentUser.pits >= 5 ? (
                <span>Ripen Now (-5 Pits)</span>
              ) : (
                <span>Get Pits to Ripen</span>
              )}
            </button>

            <button
              onClick={handleDismiss}
              className="mt-4 text-gray-400 text-sm hover:text-gray-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
