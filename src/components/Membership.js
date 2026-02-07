import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { mockBackend } from '../services/mockBackend';

const Membership = ({ onBack }) => {
  const { processUpgrade, subscription } = useUser();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePaystackPayment = async () => {
    setProcessing(true);

    // Simulate Paystack Pop opening and user paying
    setTimeout(async () => {
      // In reality, Paystack returns a reference upon success
      const fakeReference = "ref_" + Math.random().toString(36).substr(2, 9);

      // Call our context (which calls backend) to verify
      const verified = await processUpgrade(fakeReference);

      setProcessing(false);
      if (verified) {
        setSuccess(true);
      } else {
        alert("Payment Verification Failed");
      }
    }, 2000);
  };

  if (success || subscription.isPremium) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '3rem' }}>👑</h2>
        <h1>Welcome to Peach Premium!</h1>
        <p>You now have unlimited access to ripen matches.</p>
        <button
          onClick={onBack}
          style={{
            marginTop: '20px',
            padding: '15px 30px',
            background: '#FF6347',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Start Discovering
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={onBack} style={{ marginRight: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>←</button>
        <h2>Membership Plans</h2>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Free Plan */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '15px',
          padding: '25px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Free Plan</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>₦0 <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>/ month</span></p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>✅ Match with anyone</li>
            <li style={{ marginBottom: '10px' }}>⚠️ <strong>25 Unripes / Day</strong> limit</li>
            <li style={{ marginBottom: '10px' }}>❌ Ads in feed</li>
          </ul>
          <button disabled style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc', background: '#e0e0e0', color: '#888' }}>
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div style={{
          border: '2px solid #FFD700',
          borderRadius: '15px',
          padding: '25px',
          backgroundColor: '#FFF8DC',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '10px', right: '-30px', background: '#FFD700', padding: '5px 40px', transform: 'rotate(45deg)', fontWeight: 'bold' }}>BEST VALUE</div>
          <h3>Peach Premium 👑</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>₦2,500 <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>/ month</span></p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>✅ <strong>Unlimited Unripes</strong></li>
            <li style={{ marginBottom: '10px' }}>✅ See who likes you</li>
            <li style={{ marginBottom: '10px' }}>🚫 No Ads</li>
          </ul>

          <button
            onClick={handlePaystackPayment}
            disabled={processing}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: '#FF6347',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              opacity: processing ? 0.7 : 1
            }}
          >
            {processing ? 'Processing Paystack...' : 'Upgrade with Paystack'}
          </button>
          <p style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '10px', color: '#666' }}>
            Secure payment via Paystack. Backend managed by Supabase.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Membership;
