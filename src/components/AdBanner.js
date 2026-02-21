import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useUser } from '../context/UserContext';

const AdBanner = () => {
  const { userProfile } = useUser();
  const [showPromote, setShowPromote] = useState(false);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: "business@example.com",
    amount: 120000, // N1,200
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  const onSuccess = (reference) => {
    alert("Ad Payment Successful! Our team will contact you to set up your banner.");
    setShowPromote(false);
  };

  const onClose = () => {
    console.log('closed');
  };

  const initializePayment = usePaystackPayment(config);

  if (userProfile.membershipType === 'premium') return null;

  return (
    <div style={{ margin: '20px 0', borderRadius: '15px', overflow: 'hidden', border: '1px solid #eee' }}>
      {!showPromote ? (
        <div style={{ padding: '15px', backgroundColor: '#fff5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, color: '#FF6347' }}>Promote your business here! 🚀</h4>
            <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#666' }}>Reach thousands of nurses in Delta State for just N1,200.</p>
          </div>
          <button
            onClick={() => setShowPromote(true)}
            style={{ padding: '8px 15px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Learn More
          </button>
        </div>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
          <h4 style={{ marginTop: 0 }}>Business Ad (Pay-Per-Ad)</h4>
          <p style={{ fontSize: '0.9rem' }}>Get your brand in front of the community. One-time payment for 7 days visibility.</p>
          <ul style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>
            <li>Targeted Delta State nursing community</li>
            <li>Direct link to your WhatsApp/Website</li>
            <li>High engagement rates</li>
          </ul>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => initializePayment(onSuccess, onClose)}
              style={{ flex: 1, padding: '10px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Pay N1,200
            </button>
            <button
              onClick={() => setShowPromote(false)}
              style={{ flex: 1, padding: '10px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdBanner;
