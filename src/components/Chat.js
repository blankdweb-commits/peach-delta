import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { wingmanService } from '../services/wingmanService';

const Chat = ({ matchId, onBack }) => {
  const { chats, sendMessage, userProfile, potentialMatches, subscription } = useUser();
  const [inputText, setInputText] = useState('');
  const [wingmanSuggestion, setWingmanSuggestion] = useState(null);
  const messagesEndRef = useRef(null);

  const match = potentialMatches.find(u => u.id === matchId);
  const messages = chats[matchId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(matchId, inputText);
      setInputText('');
      setWingmanSuggestion(null); // Clear suggestion if used/sent
    }
  };

  const handleWingman = () => {
    if (!subscription.isPremium) return;

    // Generate suggestion based on context
    // Ideally wingmanService could take conversation history, but for now uses profile
    // We can enhance wingmanService to take last message from 'them' if exists
    let context = {};
    if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.sender === 'them') {
            context.lastMessage = lastMsg.text;
        }
    }

    // Simple enhancement to wingmanService for reply
    // Since wingmanService.generateLine only takes user and match profiles currently
    // We might just use the existing generateLine for now, or mock a reply generator here

    const line = wingmanService.generateLine(userProfile, match);
    setWingmanSuggestion(line);
    setInputText(line);
  };

  if (!match) return <div>Match not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>

      {/* Header */}
      <header style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', backgroundColor: '#fff', zIndex: 10 }}>
        <button onClick={onBack} style={{ marginRight: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>←</button>
        <img src={match.photoUrl} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} />
        <div>
            <div style={{ fontWeight: 'bold' }}>{match.realName}</div>
            <div style={{ fontSize: '0.8rem', color: 'green' }}>Online</div>
        </div>
      </header>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
        {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                <p>Say hello to {match.realName}! 👋</p>
                <p style={{ fontSize: '0.9rem' }}>You matched because you both like {match.basics.fun[0] || 'similar things'}.</p>
            </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: msg.sender === 'me' ? '#FF6347' : 'white',
              color: msg.sender === 'me' ? 'white' : '#333',
              border: msg.sender === 'me' ? 'none' : '1px solid #ddd',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '10px', borderTop: '1px solid #eee', backgroundColor: '#fff' }}>

        {/* Wingman Suggestion UI (if active) */}
        {wingmanSuggestion && (
            <div style={{ fontSize: '0.8rem', color: '#006064', marginBottom: '5px', padding: '5px', backgroundColor: '#E0F7FA', borderRadius: '5px' }}>
                🦜 Wingman suggests: "{wingmanSuggestion}"
            </div>
        )}

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
          {/* Wingman Button */}
          {subscription.isPremium && (
             <button
               type="button"
               onClick={handleWingman}
               title="Ask Wingman"
               style={{
                 background: 'none',
                 border: '1px solid #ddd',
                 borderRadius: '50%',
                 width: '40px',
                 height: '40px',
                 cursor: 'pointer',
                 fontSize: '1.2rem',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
               }}
             >
               🦜
             </button>
          )}

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{
                background: '#FF6347',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
