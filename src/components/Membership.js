import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useUser } from '../context/UserContext';

const Membership = ({ onBack }) => {
  const { userProfile, updateMembership } = useUser();

  const config = {
    reference: (new Date()).getTime().toString(),
    email: userProfile.email || "user@example.com",
    amount: 250000, // Amount in kobo (N2,500)
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  };

  const onSuccess = (reference) => {
    // Implementation for success
    console.log(reference);
    updateMembership('premium');
    alert("Welcome to Premium! Your benefits are now active.");
  };

  const onClose = () => {
    // Implementation for  close
    console.log('closed')
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={onBack} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>← Back</button>

      <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Upgrade to Premium 🍑✨</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Join the elite peaches and enjoy exclusive benefits.</p>

      <div style={{
        border: '2px solid #FF6347',
        borderRadius: '20px',
        padding: '30px',
        backgroundColor: '#fff',
        boxShadow: '0 10px 30px rgba(255, 99, 71, 0.1)'
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Premium Plan</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
          N2,500 <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#888' }}>/ one-time</span>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#FF6347', marginRight: '10px' }}>✓</span> Unlimited daily ripens (999/day)
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#FF6347', marginRight: '10px' }}>✓</span> No ads in your feed
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#FF6347', marginRight: '10px' }}>✓</span> See who likes you
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#FF6347', marginRight: '10px' }}>✓</span> Wingman AI Assistant
          </li>
          <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#FF6347', marginRight: '10px' }}>✓</span> Priority support
          </li>
        </ul>

        {userProfile.membershipType === 'premium' ? (
          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f0f0f0',
            borderRadius: '30px',
            color: '#666',
            fontWeight: 'bold'
          }}>
            Currently Active
          </div>
        ) : (
          <button
            onClick={() => initializePayment(onSuccess, onClose)}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: '#FF6347',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 99, 71, 0.4)'
            }}
          >
            Upgrade Now
          </button>
        )}
      </div>

      <p style={{ textAlign: 'center', marginTop: '30px', color: '#999', fontSize: '0.85rem' }}>
        Secure payment via Paystack. Your data is always private.
      </p>
    </div>
  );
};

export default Membership;
