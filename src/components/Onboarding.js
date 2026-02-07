import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const Onboarding = ({ onComplete }) => {
  const { updateUserProfile, setOnboardingComplete } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    verified: false,
    alias: '',
    level: 'Year 1',
    location: 'Sapele',
    sweetPeaches: [],
    bruisedPeaches: []
  });

  const LOCATIONS = ['Sapele', 'Warri', 'Asaba', 'Ughelli'];
  const LEVELS = ['Year 1', 'Year 2', 'Year 3', 'Intern'];
  const SWEET_PEACHES = ['Night shifts', 'Suya after rounds', 'Anatomy study', 'Pediatric ward', 'Boat club vibes', 'Skincare'];
  const BRUISED_PEACHES = ['8 AM lectures', 'Rude preceptors', 'Double shifts', 'Ghosting', 'Heavy textbooks', 'PHCN blackouts'];

  const handleVerify = () => {
    if (formData.email.includes('@')) {
      // Simulate verification
      setTimeout(() => {
        setFormData({ ...formData, verified: true });
        alert("Email Verified! Starter bonus claimed.");
        setStep(2);
      }, 1000);
    } else {
      alert("Please enter a valid email.");
    }
  };

  const handleSelection = (category, item) => {
    const list = formData[category];
    if (list.includes(item)) {
      setFormData({ ...formData, [category]: list.filter(i => i !== item) });
    } else {
      if (list.length < 3) {
        setFormData({ ...formData, [category]: [...list, item] });
      } else {
        alert("Select only 3!");
      }
    }
  };

  const handleFinish = () => {
    // Save to context
    updateUserProfile({
      email: formData.email,
      alias: formData.alias,
      level: formData.level,
      life: { based: formData.location },
      basics: { fun: formData.sweetPeaches }, // Mapping sweet peaches to fun for matching
      // We could store bruised peaches too but matching logic uses likes mainly for now
    });

    // Mark as complete in context (we need to add this function to UserContext)
    if (setOnboardingComplete) setOnboardingComplete(true);

    onComplete(); // Navigate to App
  };

  const renderStep1 = () => (
    <div style={{ textAlign: 'center' }}>
      <h2>Step 1: Verification 📧</h2>
      <p>Enter your email to claim your starter bonus!</p>
      <input
        type="email"
        placeholder="nurse.joy@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        style={{ padding: '10px', width: '80%', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button
        onClick={handleVerify}
        style={{ padding: '10px 30px', background: '#FF6347', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
      >
        Verify Email
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ textAlign: 'center' }}>
      <h2>Step 2: Profile Setup 👩‍⚕️</h2>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Alias (Anonymous Name)</label>
        <input
          type="text"
          placeholder="Nurse_Peachy99"
          value={formData.alias}
          onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
          style={{ padding: '10px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Level</label>
        <select
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          style={{ padding: '10px', width: '85%', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Based In</label>
        <select
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          style={{ padding: '10px', width: '85%', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <button
        onClick={() => setStep(3)}
        disabled={!formData.alias}
        style={{ padding: '10px 30px', background: formData.alias ? '#FF6347' : '#ccc', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
      >
        Next: Vibe Check
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ textAlign: 'center' }}>
      <h2>Step 3: Vibe Check 🍑</h2>

      <h4 style={{ color: '#FF6347' }}>Sweet Peaches (Pick 3 Likes)</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        {SWEET_PEACHES.map(item => (
          <span
            key={item}
            onClick={() => handleSelection('sweetPeaches', item)}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              background: formData.sweetPeaches.includes(item) ? '#FF6347' : '#eee',
              color: formData.sweetPeaches.includes(item) ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <h4 style={{ color: '#8B4513' }}>Bruised Peaches (Pick 3 Dislikes)</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        {BRUISED_PEACHES.map(item => (
          <span
            key={item}
            onClick={() => handleSelection('bruisedPeaches', item)}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              background: formData.bruisedPeaches.includes(item) ? '#8B4513' : '#eee',
              color: formData.bruisedPeaches.includes(item) ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <button
        onClick={() => setStep(4)}
        disabled={formData.sweetPeaches.length !== 3 || formData.bruisedPeaches.length !== 3}
        style={{
          padding: '10px 30px',
          background: (formData.sweetPeaches.length === 3 && formData.bruisedPeaches.length === 3) ? '#FF6347' : '#ccc',
          color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer'
        }}
      >
        Next: How it Works
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Tutorial 📚</h2>
      <div style={{ textAlign: 'left', background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <p><strong>1. Swipe to Discover:</strong> Find other nurses nearby. We prioritize people within 5km of your location.</p>
        <p><strong>2. Ripen to Reveal:</strong> Matches are anonymous! Use your daily limit (25) or Premium to "Ripen" them and see their real details.</p>
        <p><strong>3. Chat & Wingman:</strong> Once ripened, you can chat. Premium members get a smart "Wingman" to help break the ice!</p>
        <p><strong>4. Peach Code:</strong> Be kind. Harassment leads to strikes and bans.</p>
      </div>
      <button
        onClick={handleFinish}
        style={{ padding: '15px 40px', background: '#FF6347', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
      >
        Get Started! 🚀
      </button>
    </div>
  );

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderRadius: '15px',
      backgroundColor: 'white'
    }}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
};

export default Onboarding;
