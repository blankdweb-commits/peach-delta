import React from 'react';
import { useUser } from '../context/UserContext';

const ChatList = ({ onSelectChat }) => {
  const { rippedMatches, potentialMatches, chats } = useUser();

  // Filter potential matches to find only those who are ripped
  const matches = potentialMatches.filter(user => rippedMatches.includes(user.id));

  if (matches.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        <h3>No Chats Yet 🍑</h3>
        <p>Go to Discover and ripen some matches!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Peaches 🍑</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matches.map(match => {
          const lastMessage = chats[match.id] && chats[match.id].length > 0
            ? chats[match.id][chats[match.id].length - 1].text
            : "Start the conversation!";

          return (
            <li
              key={match.id}
              onClick={() => onSelectChat(match.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <img
                src={match.photoUrl}
                alt={match.alias}
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{match.realName}</span>
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>{match.level}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                  {lastMessage}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
