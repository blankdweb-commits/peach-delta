import React from 'react';
import { useUser } from '../context/UserContext';

const PitStore = ({ onClose }) => {
  const { user, refillPits } = useUser();

  const bundles = [
    {
      id: 'student_saver',
      name: 'Student Saver',
      pits: 20,
      price: 500,
      description: 'Perfect for a quick match.'
    },
    {
      id: 'intern_bundle',
      name: 'Intern Bundle',
      pits: 50,
      price: 1000,
      description: 'Best value for active Peaches.'
    }
  ];

  const handlePurchase = (bundle) => {
    // Mock payment gateway integration (Paystack/Flutterwave)
    const confirmed = window.confirm(`Pay N${bundle.price} for ${bundle.pits} Pits?`);
    if (confirmed) {
      refillPits(bundle.pits);
      alert(`Successfully added ${bundle.pits} Pits! New balance: ${user.pits + bundle.pits}`);
      if (onClose) onClose();
    }
  };

  return (
    <div className="pit-store">
      <h2>Pit Store 🍑</h2>
      <p>Current Balance: <strong>{user.pits} Pits</strong></p>

      <div className="bundles">
        {bundles.map(bundle => (
          <div key={bundle.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px', background: 'white' }}>
            <h3>{bundle.name}</h3>
            <p>{bundle.description}</p>
            <p className="price">N{bundle.price} for {bundle.pits} Pits</p>
            <button
              className="btn btn-primary"
              onClick={() => handlePurchase(bundle)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {onClose && (
        <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: '20px' }}>
          Back to Discover
        </button>
      )}
    </div>
  );
};

export default PitStore;
