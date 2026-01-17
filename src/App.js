import React, { useState } from 'react';
import Discover from './components/Discover';
import PitStore from './components/PitStore';
import { currentUser as initialUser } from './utils/mockData';

const App = () => {
  const [view, setView] = useState('discover'); // 'discover' or 'store'
  const [user, setUser] = useState(initialUser);

  const handleNavigateToStore = () => {
    setView('store');
  };

  const handleBackToDiscover = () => {
    setView('discover');
  };

  const handlePurchase = (amount) => {
    setUser(prev => ({ ...prev, pits: prev.pits + amount }));
    // In a real app, this would be an API call
    alert(`Successfully purchased ${amount} Pits!`);
    setView('discover');
  };

  const handleRipen = (cost) => {
    if (user.pits >= cost) {
      setUser(prev => ({ ...prev, pits: prev.pits - cost }));
    }
  };

  return (
    <div className="font-sans">
      {view === 'discover' && (
        <Discover
          currentUser={user}
          onRipen={handleRipen}
          onNavigateToStore={handleNavigateToStore}
        />
      )}
      {view === 'store' && (
        <PitStore
          onBack={handleBackToDiscover}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default App;
