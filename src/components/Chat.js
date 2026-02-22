import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';

const Chat = ({ match, onBack }) => {
  const { userProfile } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      // In a real app, match.id would be a UUID from Supabase.
      // For this demo, we'll just handle it gracefully.
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userProfile.id},receiver_id.eq.${match.id}),and(sender_id.eq.${match.id},receiver_id.eq.${userProfile.id})`)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (
            (payload.new.sender_id === userProfile.id && payload.new.receiver_id === match.id) ||
            (payload.new.sender_id === match.id && payload.new.receiver_id === userProfile.id)
          ) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [match.id, userProfile.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender_id: userProfile.id,
      receiver_id: match.id,
      content: newMessage.trim()
    };

    // If userProfile.id is null (demo mode), we just add it locally
    if (!userProfile.id) {
        setMessages(prev => [...prev, { ...messageData, id: Date.now(), created_at: new Date().toISOString() }]);
        setNewMessage("");
        return;
    }

    const { error } = await supabase.from('messages').insert(messageData);
    if (!error) {
      setNewMessage("");
    } else {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
      <header style={{ padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginRight: '15px' }}>←</button>
        <div style={{ fontWeight: 'bold' }}>{match.realName}</div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map((msg) => {
          const isMine = msg.sender_id === userProfile.id;
          return (
            <div key={msg.id} style={{
              display: 'flex',
              justifyContent: isMine ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '10px 15px',
                borderRadius: '18px',
                backgroundColor: isMine ? '#FF6347' : '#fff',
                color: isMine ? '#fff' : '#333',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                fontSize: '0.95rem'
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ padding: '15px', backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '25px',
            border: '1px solid #ddd',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#FF6347',
            color: 'white',
            border: 'none',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          🍑
        </button>
      </form>
    </div>
  );
};

export default Chat;
