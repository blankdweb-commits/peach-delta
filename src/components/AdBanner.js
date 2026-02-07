import React, { useEffect } from 'react';

const AdBanner = ({ onAdComplete }) => {
  useEffect(() => {
    // Simulate ad duration
    const timer = setTimeout(() => {
      onAdComplete();
    }, 3000); // 3 seconds ad

    return () => clearTimeout(timer);
  }, [onAdComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      color: 'white'
    }}>
      <div style={{ padding: '20px', background: '#333', borderRadius: '10px', maxWidth: '300px', textAlign: 'center' }}>
        <h2>Sponsored Ad</h2>
        <p>Buy Peaches, Get Pits!</p>
        <div style={{ fontSize: '3rem', margin: '20px' }}>📢</div>
        <p>Ad will close in 3 seconds...</p>
      </div>
    </div>
  );
};

export default AdBanner;
