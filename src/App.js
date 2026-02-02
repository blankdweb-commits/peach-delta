import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';

function App() {
  const [view, setView] = useState('discover');

  return (
    <UserProvider>
      <div className="App">
        {view === 'discover' ? (
          <Discover onNavigateToStore={() => setView('store')} />
        ) : (
          <PitStore onBack={() => setView('discover')} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;
