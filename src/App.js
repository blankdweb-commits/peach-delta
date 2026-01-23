import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';

function App() {
  const [currentScreen, setCurrentScreen] = useState('discover');

  return (
    <UserProvider>
      <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <header style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <h1>Peach Delta 🍑</h1>
          <nav>
            <button onClick={() => setCurrentScreen('discover')} style={{ marginRight: '10px' }}>Discover</button>
            <button onClick={() => setCurrentScreen('store')}>Pit Store</button>
          </nav>
        </header>

        <main>
          {currentScreen === 'discover' && (
            <Discover onNavigateToStore={() => setCurrentScreen('store')} />
          )}
          {currentScreen === 'store' && (
            <PitStore />
          )}
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
