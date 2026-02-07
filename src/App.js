import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentView, setCurrentView] = useState('discover');

  const navigateToStore = () => setCurrentView('store');
  const navigateToDiscover = () => setCurrentView('discover');
  const navigateToAdmin = () => setCurrentView('admin');

  return (
    <UserProvider>
      <AdminProvider>
        <div className="App">
          {currentView === 'discover' && (
            <>
              <Discover onNavigateToStore={navigateToStore} />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={navigateToAdmin} style={{ fontSize: '0.8rem', color: '#ccc', background: 'none', border: 'none', cursor: 'pointer' }}>Admin Login</button>
              </div>
            </>
          )}
          {currentView === 'store' && (
            <PitStore onBack={navigateToDiscover} />
          )}
          {currentView === 'admin' && (
            <AdminDashboard onBack={navigateToDiscover} />
          )}
        </div>
      </AdminProvider>
    </UserProvider>
  );
}

export default App;
