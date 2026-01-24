import React from 'react';
import { useUser } from '../context/UserContext';

const PitStore = ({ onBack }) => {
  const { pits, addPits } = useUser();

  const handlePurchase = (amount, cost) => {
    // Simulate payment gateway integration (Paystack/Flutterwave)
    alert(`Processing payment of N${cost} for ${amount} Pits... Success!`);
    addPits(amount);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Pit Store 🍑</h2>
      <p>Current Balance: <strong>{pits} Pits</strong></p>

      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
        <h3>Student Saver</h3>
        <p>20 Pits for N500</p>
        <button onClick={() => handlePurchase(20, 500)}>Buy Now</button>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
        <h3>Intern Bundle</h3>
        <p>50 Pits for N1000</p>
        <button onClick={() => handlePurchase(50, 1000)}>Buy Now</button>
      </div>

      <button onClick={onBack} style={{ marginTop: '20px' }}>Back to Discover</button>
    </div>
  );
};

export default PitStore;
