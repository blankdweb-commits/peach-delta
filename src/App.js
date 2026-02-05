import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';

function App() {
  const [currentView, setCurrentView] = useState('discover');

  return (
    <UserProvider>
      <div className="App">
        {currentView === 'discover' && (
          <Discover onNavigateToStore={() => setCurrentView('store')} />
        )}
        {currentView === 'store' && (
          <PitStore onBack={() => setCurrentView('discover')} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;
