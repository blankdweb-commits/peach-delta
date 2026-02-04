import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('discover');

  return (
    <UserProvider>
      <div className="App">
        {currentScreen === 'discover' && (
          <Discover onNavigateToStore={() => setCurrentScreen('store')} />
        )}
        {currentScreen === 'store' && (
          <PitStore onBack={() => setCurrentScreen('discover')} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;
