import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';
import Discover from './components/Discover';
import Membership from './components/Membership';
import AdminDashboard from './components/AdminDashboard';
import Settings from './components/Settings';
import ChatList from './components/ChatList';
import Chat from './components/Chat';

function App() {
  const [currentView, setCurrentView] = useState('discover');
  const [selectedChatId, setSelectedChatId] = useState(null);

  const navigateToMembership = () => setCurrentView('membership');
  const navigateToDiscover = () => setCurrentView('discover');
  const navigateToAdmin = () => setCurrentView('admin');
  const navigateToSettings = () => setCurrentView('settings');
  const navigateToChats = () => setCurrentView('chatList');

  const handleSelectChat = (matchId) => {
    setSelectedChatId(matchId);
    setCurrentView('chatConversation');
  };

  const handleBackToChatList = () => {
    setSelectedChatId(null);
    setCurrentView('chatList');
  };

  return (
    <UserProvider>
      <AdminProvider>
        <div className="App">
          {currentView === 'discover' && (
            <>
              <Discover
                onNavigateToStore={navigateToMembership}
                onNavigateToSettings={navigateToSettings}
                onNavigateToChats={navigateToChats}
              />
              <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
                <button onClick={navigateToAdmin} style={{ fontSize: '0.8rem', color: '#ccc', background: 'none', border: 'none', cursor: 'pointer' }}>Admin Login</button>
              </div>
            </>
          )}

          {currentView === 'chatList' && (
            <>
              <div style={{ padding: '10px', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                 <button onClick={navigateToDiscover} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#666' }}>← Back to Discover</button>
              </div>
              <ChatList onSelectChat={handleSelectChat} />
            </>
          )}

          {currentView === 'chatConversation' && selectedChatId && (
            <Chat matchId={selectedChatId} onBack={handleBackToChatList} />
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

          {/* Back button for settings */}
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
