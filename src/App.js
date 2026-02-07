import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';
import Discover from './components/Discover';
import Membership from './components/Membership';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentView, setCurrentView] = useState('discover');

  const navigateToMembership = () => setCurrentView('membership');
  const navigateToDiscover = () => setCurrentView('discover');
  const navigateToAdmin = () => setCurrentView('admin');

  return (
    <UserProvider>
      <AdminProvider>
        <div className="App">
          {currentView === 'discover' && (
            <>
              <Discover onNavigateToStore={navigateToMembership} />
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
        </div>
      </AdminProvider>
    </UserProvider>
  );
}

export default App;
