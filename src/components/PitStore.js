import React from 'react';
import { useUser } from '../context/UserContext';

const PitStore = () => {
  const { addPits, navigateTo } = useUser();

  const handlePurchase = (amount, cost) => {
    // Simulate payment process
    alert(`Payment of N${cost} successful! Adding ${amount} Pits.`);
    addPits(amount);
    navigateTo('discover');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Pit Store 🍑</h2>
      <p>Top up your Pits to Ripen connections!</p>

      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '8px' }}>
        <h3>Student Saver</h3>
        <p>20 Pits for N500</p>
        <button onClick={() => handlePurchase(20, 500)}>Buy Now</button>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '8px' }}>
        <h3>Intern Bundle</h3>
        <p>50 Pits for N1000</p>
        <button onClick={() => handlePurchase(50, 1000)}>Buy Now</button>
      </div>

      <button onClick={() => navigateTo('discover')} style={{ marginTop: '20px' }}>
        Back to Discover
      </button>
    </div>
  );
};

export default PitStore;
