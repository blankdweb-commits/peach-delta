import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PitStore = ({ onBack }) => {
  const { user, buyPits } = useContext(UserContext);

  const handlePurchase = (amount, cost) => {
    // Simulate payment gateway interaction
    alert(`Processing payment of N${cost}...`);
    buyPits(amount);
    alert(`Success! ${amount} Pits added.`);
  };

  return (
    <div className="pit-store">
      <button onClick={onBack}>&larr; Back to Discover</button>
      <h2>Pit Store 🍑</h2>
      <p>Your Balance: {user.pits} Pits</p>

      <div className="store-items">
        <div className="store-item">
          <h3>Handful of Pits</h3>
          <p>20 Pits</p>
          <button onClick={() => handlePurchase(20, 500)}>Buy for N500</button>
        </div>
        <div className="store-item">
          <h3>Basket of Pits</h3>
          <p>50 Pits</p>
          <button onClick={() => handlePurchase(50, 1200)}>Buy for N1200</button>
        </div>
      </div>
    </div>
  );
};

export default PitStore;
