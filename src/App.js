import React, { useState } from 'react';
import Discover from './components/Discover';
import PitStore from './components/PitStore';
import { UserProvider } from './context/UserContext';

function App() {
  const [currentScreen, setCurrentScreen] = useState('discover');

  return (
    <UserProvider>
      <div className="App">
        {currentScreen === 'discover' && (
          <Discover onNavigate={setCurrentScreen} />
        )}
        {currentScreen === 'pitstore' && (
          <PitStore onBack={() => setCurrentScreen('discover')} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;
