import React from 'react';
import Discover from './components/Discover';
import PitStore from './components/PitStore';
import { useUser } from './context/UserContext';

function App() {
  const { currentView } = useUser();

  return (
    <div className="App">
      <header style={{ padding: '10px', background: '#FFCBA4', textAlign: 'center' }}>
        <h1>Peach Delta 🍑</h1>
      </header>
      <main style={{ padding: '20px' }}>
        {currentView === 'discover' && <Discover />}
        {currentView === 'store' && <PitStore />}
      </main>
    </div>
  );
}

export default App;
