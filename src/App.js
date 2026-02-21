import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';
import Membership from './components/Membership';
import LikesView from './components/LikesView';

function App() {
  const [currentView, setCurrentView] = useState('discover');

  const navigateToStore = () => setCurrentView('store');
  const navigateToDiscover = () => setCurrentView('discover');
  const navigateToMembership = () => setCurrentView('membership');
  const navigateToLikes = () => setCurrentView('likes');

  return (
    <UserProvider>
      <div className="App">
        {currentView === 'discover' && (
          <Discover
            onNavigateToStore={navigateToStore}
            onNavigateToMembership={navigateToMembership}
            onNavigateToLikes={navigateToLikes}
          />
        )}
        {currentView === 'store' && (
          <PitStore onBack={navigateToDiscover} />
        )}
        {currentView === 'membership' && (
          <Membership onBack={navigateToDiscover} />
        )}
        {currentView === 'likes' && (
          <LikesView onBack={navigateToDiscover} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;
