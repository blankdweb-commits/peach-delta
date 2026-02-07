import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';
import Discover from './components/Discover';
import Membership from './components/Membership';
import AdminDashboard from './components/AdminDashboard';
import Settings from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState('discover');

  const navigateToMembership = () => setCurrentView('membership');
  const navigateToDiscover = () => setCurrentView('discover');
  const navigateToAdmin = () => setCurrentView('admin');
  const navigateToSettings = () => setCurrentView('settings');

  return (
    <UserProvider>
      <AdminProvider>
        <div className="App">
          {currentView === 'discover' && (
            <>
              <Discover
                onNavigateToStore={navigateToMembership}
                onNavigateToSettings={navigateToSettings}
              />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={navigateToAdmin} style={{ fontSize: '0.8rem', color: '#ccc', background: 'none', border: 'none', cursor: 'pointer' }}>Admin Login</button>
              </div>
            </>
          )}
          {currentView === 'membership' && (
            <Membership onBack={navigateToDiscover} />
          )}
          {currentView === 'admin' && (
            <AdminDashboard onBack={navigateToDiscover} />
          )}
          {currentView === 'settings' && (
            <Settings onNavigateToMembership={navigateToMembership} />
          )}
          {/* Add a back button for settings if not inside the component logic */}
          {currentView === 'settings' && (
             <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button onClick={navigateToDiscover} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>← Back to Discover</button>
             </div>
          )}
        </div>
      </AdminProvider>
    </UserProvider>
  );
}

export default App;
