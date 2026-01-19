import React from 'react';

const PitStore = ({ onBuy, onBack }) => {
  return (
    <div className="container">
      <div className="card">
        <h2>Pit Store 🍑</h2>
        <p>Refill your Pits to keep connecting in Delta State!</p>

        <div className="store-items">
          <div className="store-item notification">
            <h3>Student Saver</h3>
            <p>20 Pits for ₦500</p>
            <button className="btn btn-primary" onClick={() => onBuy(20)}>Buy Now</button>
          </div>

          <div className="store-item notification">
            <h3>Intern Bundle</h3>
            <p>50 Pits for ₦1000</p>
            <button className="btn btn-primary" onClick={() => onBuy(50)}>Buy Now</button>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={onBack}>Back to Discover</button>
      </div>
    </div>
  );
};

export default PitStore;
