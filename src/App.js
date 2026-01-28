import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';

function App() {
  const [view, setView] = useState('discover');

  return (
    <UserProvider>
      <div className="App">
        <header style={{ backgroundColor: '#FF8C00', padding: '10px', color: 'white' }}>
          <h1>Peach Delta</h1>
        </header>
        <main>
          {view === 'discover' && (
            <Discover onNavigateToStore={() => setView('store')} />
          )}
          {view === 'store' && (
            <PitStore onBack={() => setView('discover')} />
          )}
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
