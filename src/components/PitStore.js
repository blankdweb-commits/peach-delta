import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PitStore = ({ onBack }) => {
  const { user, buyPits } = useContext(UserContext);

  const handleBuy = (amount, cost) => {
    alert(`Buying ${amount} Pits for N${cost}`);
    buyPits(amount);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pit Store 🍑</h2>
      <p>Balance: {user.pits} Pits</p>
      <button onClick={onBack}>Back to Discover</button>

      <div style={{ marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>Handful of Pits</h3>
          <p>20 Pits - N500</p>
          <button onClick={() => handleBuy(20, 500)}>Buy Now</button>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>Basket of Pits</h3>
          <p>50 Pits - N1000</p>
          <button onClick={() => handleBuy(50, 1000)}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default PitStore;
