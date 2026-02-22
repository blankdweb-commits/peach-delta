import React from 'react';
import { useUser } from '../context/UserContext';

const LikesView = ({ onBack }) => {
  const { likes, userProfile } = useUser();

  if (userProfile.membershipType !== 'premium') {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Upgrade to see who likes you! 🍑</h2>
        <button onClick={onBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>← Back</button>
      <h2>Peaches that like you 🍯</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {likes.map(user => (
          <div key={user.id} style={{ border: '1px solid #ddd', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🍑</div>
            <div style={{ fontWeight: 'bold' }}>{user.alias}</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikesView;
