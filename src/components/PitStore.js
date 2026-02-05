import React from 'react';
import { useUser } from '../context/UserContext';

const PitStore = ({ onBack }) => {
  const { user, buyPits } = useUser();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Pit Store 🍑</h2>
      <p>Current Balance: {user.pits} Pits</p>

      <div style={{ margin: '20px 0', border: '1px solid #ddd', padding: '15px' }}>
        <h3>Starter Pack</h3>
        <p>20 Pits for ₦500</p>
        <button
          onClick={() => buyPits(20)}
          style={{ padding: '10px 20px', background: '#ff7f50', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Buy Now
        </button>
      </div>

      <button onClick={onBack} style={{ marginTop: '20px', background: 'transparent', border: 'none', textDecoration: 'underline' }}>
        Back to Discover
      </button>
    </div>
  );
};

export default PitStore;
