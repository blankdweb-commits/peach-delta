import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';

function App() {
  const [currentView, setCurrentView] = useState('discover');

  const navigateToStore = () => setCurrentView('store');
  const navigateToDiscover = () => setCurrentView('discover');

  return (
    <UserProvider>
      <div className="App">
        {currentView === 'discover' && (
          <Discover onNavigateToStore={navigateToStore} />
        )}
        {currentView === 'store' && (
          <PitStore onBack={navigateToDiscover} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;
