import React, { useState } from 'react';
import Discover from './components/Discover';
import PitStore from './components/PitStore';
import { useUser } from './context/UserContext';

function App() {
  const [view, setView] = useState('discover');
  const { user } = useUser();

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#ff7f50' }}>Peach Delta</h1>
        <div
          style={{ cursor: 'pointer', background: '#fff', padding: '5px 10px', borderRadius: '15px' }}
          onClick={() => setView('store')}
        >
          🍑 {user.pits} Pits
        </div>
      </header>

      {view === 'discover' && <Discover />}
      {view === 'store' && <PitStore onClose={() => setView('discover')} />}
    </div>
  );
}

export default App;
