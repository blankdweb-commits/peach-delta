import React from 'react';
import Discover from './components/Discover';
import BusinessDashboard from './components/BusinessDashboard';
import Settings from './components/Settings';
import { useUser } from './context/UserContext';

function App() {
  const { currentView, navigateTo } = useUser();

  const navStyle = {
      display: 'flex',
      justifyContent: 'space-around',
      background: '#eee',
      padding: '10px',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      left: 0
  };

  return (
    <div className="App" style={{paddingBottom: '60px'}}>
      <header style={{ padding: '20px', background: '#FFCBA4', textAlign: 'center' }}>
        <h1 style={{margin: 0}}>Peach Delta 🍑</h1>
      </header>
      <main style={{ padding: '20px' }}>
        {currentView === 'discover' && <Discover />}
        {currentView === 'business' && <BusinessDashboard />}
        {currentView === 'settings' && <Settings />}
      </main>

      <nav style={navStyle}>
          <button onClick={() => navigateTo('discover')}>Discover</button>
          <button onClick={() => navigateTo('settings')}>Settings</button>
      </nav>
    </div>
  );
}

export default App;
