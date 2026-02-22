import React from 'react';
import { useUser } from '../context/UserContext';

const ChatList = ({ onSelectChat, onBack }) => {
  const { potentialMatches, rippedMatches } = useUser();

  // Filter matches that are "ripened"
  const activeChats = potentialMatches.filter(user => rippedMatches.includes(user.id));

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '15px' }}>←</button>
        <h2 style={{ margin: 0 }}>Chats 🍑</h2>
      </header>

      {activeChats.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
          <p>No active chats yet. Ripen some peaches to start talking!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activeChats.map(user => (
            <div
              key={user.id}
              onClick={() => onSelectChat(user)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                borderRadius: '15px',
                backgroundColor: '#fff',
                border: '1px solid #eee',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginRight: '15px', backgroundColor: '#eee' }}>
                 <img src={user.photoUrl} alt={user.realName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{user.realName}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Tap to chat</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
