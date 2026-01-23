import React from 'react';
import { useUser } from '../context/UserContext';

const PitStore = () => {
  const { user, addPits } = useUser();

  const pricingTiers = [
    { name: 'Student Saver', pits: 20, price: 500, id: 'tier1' },
    { name: 'Intern Bundle', pits: 50, price: 1000, id: 'tier2' },
    { name: 'Head Nurse Stash', pits: 120, price: 2000, id: 'tier3' },
  ];

  const handlePurchase = (tier) => {
    // Mock payment gateway integration (Paystack/Flutterwave)
    alert(`Processing payment of N${tier.price} for ${tier.name}...`);
    // Simulate successful payment
    addPits(tier.pits);
    alert(`Success! ${tier.pits} Pits added to your wallet.`);
  };

  return (
    <div className="pit-store">
      <h2>Pit Store 🍑</h2>
      <p>Current Balance: {user.pits} Pits</p>

      <div className="pricing-tiers">
        {pricingTiers.map(tier => (
          <div key={tier.id} className="tier-card" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>{tier.name}</h3>
            <p>{tier.pits} Pits</p>
            <p>N{tier.price}</p>
            <button onClick={() => handlePurchase(tier)}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PitStore;
