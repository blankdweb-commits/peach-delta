import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PitStore = ({ onBack }) => {
  const { pits, buyPits } = useContext(UserContext);

  const handleBuy = (amount, cost) => {
    // Simulate payment processing
    alert(`Processing payment of N${cost}...`);
    buyPits(amount);
    alert(`Success! Added ${amount} Pits.`);
  };

  return (
    <div className="card">
      <h2>Pit Store 🍑</h2>
      <p>Current Balance: <strong>{pits} Pits</strong></p>

      <div className="store-item">
        <h3>Pocket Pick</h3>
        <p>20 Pits for N500</p>
        <button className="button" onClick={() => handleBuy(20, 500)}>Buy</button>
      </div>

      <div className="store-item">
        <h3>Student Saver</h3>
        <p>50 Pits for N1000</p>
        <button className="button" onClick={() => handleBuy(50, 1000)}>Buy</button>
      </div>

      <div className="store-item">
        <h3>Intern Baller</h3>
        <p>120 Pits for N2000</p>
        <button className="button" onClick={() => handleBuy(120, 2000)}>Buy</button>
      </div>

      <button className="button button-secondary" onClick={onBack}>
        Back to Discover
      </button>
    </div>
  );
};

export default PitStore;
