import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PitStore = ({ onBack }) => {
  const { pits, buyPits } = useContext(UserContext);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pit Store</h2>
      <p>Current Balance: {pits} Pits</p>
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h3>Starter Pack</h3>
        <p>20 Pits for N500</p>
        <button onClick={() => buyPits(20)}>Buy Now</button>
      </div>
       <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h3>Pro Pack</h3>
        <p>50 Pits for N1000</p>
        <button onClick={() => buyPits(50)}>Buy Now</button>
      </div>
      <button onClick={onBack}>Back to Discover</button>
    </div>
  );
};

export default PitStore;
