import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import Discover from './components/Discover';
import PitStore from './components/PitStore';
import Membership from './components/Membership';
import LikesView from './components/LikesView';
import ChatList from './components/ChatList';
import Chat from './components/Chat';

function App() {
  const [currentView, setCurrentView] = useState('discover');
  const [selectedChat, setSelectedChat] = useState(null);

  const navigateToStore = () => setCurrentView('store');
  const navigateToDiscover = () => setCurrentView('discover');
  const navigateToMembership = () => setCurrentView('membership');
  const navigateToLikes = () => setCurrentView('likes');
  const navigateToChats = () => setCurrentView('chats');

  const handleSelectChat = (match) => {
    setSelectedChat(match);
    setCurrentView('chat');
  };

  return (
    <UserProvider>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {currentView === 'discover' && (
            <Discover
              onNavigateToStore={navigateToStore}
              onNavigateToMembership={navigateToMembership}
              onNavigateToLikes={navigateToLikes}
            />
          )}
          {currentView === 'likes' && (
            <LikesView onBack={navigateToDiscover} />
          )}
          {currentView === 'chats' && (
            <ChatList onBack={navigateToDiscover} onSelectChat={handleSelectChat} />
          )}
          {currentView === 'chat' && (
            <Chat match={selectedChat} onBack={navigateToChats} />
          )}
          {currentView === 'store' && (
            <PitStore onBack={navigateToDiscover} />
          )}
          {currentView === 'membership' && (
            <Membership onBack={navigateToDiscover} />
          )}
        </div>

        {/* Bottom Nav */}
        {['discover', 'likes', 'chats'].includes(currentView) && (
          <nav style={{
            height: '70px',
            backgroundColor: '#fff',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <button onClick={navigateToDiscover} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: currentView === 'discover' ? 1 : 0.3 }}>🍑</button>
            <button onClick={navigateToLikes} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: currentView === 'likes' ? 1 : 0.3 }}>🍯</button>
            <button onClick={navigateToChats} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: currentView === 'chats' ? 1 : 0.3 }}>💬</button>
          </nav>
        )}
      </div>
    </UserProvider>
  );
}

export default App;
