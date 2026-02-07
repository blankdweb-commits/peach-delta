import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { mockBackend } from '../services/mockBackend';
import FeedbackHandler from './FeedbackHandler';

const Settings = ({ onNavigateToMembership }) => {
  const { userProfile, updateUserProfile, subscription, business, createBusinessAccount, postAd, setOnboardingComplete, submitFeedback } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [adForm, setAdForm] = useState({ title: '', content: '' });
  const [processingAd, setProcessingAd] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Handle Profile Inputs
  const handleProfileChange = (field, value) => {
    updateUserProfile({ [field]: value });
  };

  const handleNestedProfileChange = (section, field, value) => {
    updateUserProfile({
      [section]: {
        ...userProfile[section],
        [field]: value
      }
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      updateUserProfile({ photoUrl: fakeUrl });
    }
  };

  const handlePreferenceChange = (key, value) => {
    updateUserProfile({
      preferences: {
        [key]: value
      }
    });
  };

  // Handle Business Logic
  const handleCreateBusiness = () => {
    if (createBusinessAccount()) {
      alert("Business Account Created! You can now post ads.");
    } else {
      alert("Error: Ensure you are a Premium member.");
    }
  };

  const handlePostAd = async (e) => {
    e.preventDefault();
    setProcessingAd(true);

    // Simulate Payment for Ad (1200 Naira)
    setTimeout(async () => {
      const fakeRef = "ad_ref_" + Date.now();
      const success = await postAd(adForm, fakeRef);

      setProcessingAd(false);
      if (success) {
        setAdForm({ title: '', content: '' });
        alert("Ad Posted Successfully! (₦1,200 deducted)");
      } else {
        alert("Payment Failed.");
      }
    }, 2000);
  };

  const handleRestartTutorial = () => {
    if (window.confirm("Restart the tutorial? This will take you back to onboarding.")) {
      setOnboardingComplete(false);
    }
  };

  // Styles
  const containerStyle = { padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', width: '100%', boxSizing: 'border-box' };
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' };
  const buttonStyle = { padding: '12px 20px', background: '#FF6347', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', maxWidth: '200px' };
  const tabStyle = (isActive) => ({
    flex: 1,
    textAlign: 'center',
    padding: '15px 10px',
    cursor: 'pointer',
    borderBottom: isActive ? '3px solid #FF6347' : '1px solid #eee',
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#333' : '#888',
    backgroundColor: isActive ? '#fff' : '#f9f9f9'
  });

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px' }}>Settings ⚙️</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={tabStyle(activeTab === 'profile')} onClick={() => setActiveTab('profile')}>Profile</div>
        <div style={tabStyle(activeTab === 'preferences')} onClick={() => setActiveTab('preferences')}>Preferences</div>
        <div style={tabStyle(activeTab === 'business')} onClick={() => setActiveTab('business')}>Business</div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ padding: '0 5px' }}>
          <h3>Edit Profile</h3>

          {/* Avatar */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#eee', margin: '0 auto 10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {userProfile.photoUrl ? (
                <img src={userProfile.photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '30px' }}>👤</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ maxWidth: '100%' }} />
          </div>

          {/* Read-Only Fields */}
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
            <label htmlFor="name-input" style={labelStyle}>Name (Read-only)</label>
            <input id="name-input" style={{ ...inputStyle, background: '#e0e0e0' }} value={userProfile.name} disabled />
            <label htmlFor="email-input" style={labelStyle}>Email (Read-only)</label>
            <input id="email-input" style={{ ...inputStyle, background: '#e0e0e0' }} value={userProfile.email} disabled />
          </div>

          {/* Editable Fields */}
          <label style={labelStyle}>Alias</label>
          <input style={inputStyle} value={userProfile.alias} onChange={(e) => handleProfileChange('alias', e.target.value)} />

          <label style={labelStyle}>Level</label>
          <input style={inputStyle} value={userProfile.level} onChange={(e) => handleProfileChange('level', e.target.value)} />

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

          <h4>Life</h4>
          <label style={labelStyle}>Based In</label>
          <input style={inputStyle} value={userProfile.life.based} onChange={(e) => handleNestedProfileChange('life', 'based', e.target.value)} />

          <label style={labelStyle}>Upbringing</label>
          <textarea style={inputStyle} value={userProfile.life.upbringing} onChange={(e) => handleNestedProfileChange('life', 'upbringing', e.target.value)} />

          <h4>Work</h4>
          <label style={labelStyle}>Job</label>
          <input style={inputStyle} value={userProfile.work.job} onChange={(e) => handleNestedProfileChange('work', 'job', e.target.value)} />

          <h4>Vision</h4>
          <textarea style={inputStyle} value={userProfile.vision} onChange={(e) => handleProfileChange('vision', e.target.value)} />

          <h4>Special</h4>
          <textarea style={inputStyle} value={userProfile.special} onChange={(e) => handleProfileChange('special', e.target.value)} />

        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div style={{ padding: '0 5px' }}>
          <h3>App Preferences</h3>

          <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1rem', display: 'block' }}>Show Targeted Ads</strong>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  {subscription.isPremium
                    ? "Opt-in to support local businesses."
                    : "Ads are required for Free plans."}
                </span>
              </div>

              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                <input
                  type="checkbox"
                  checked={!subscription.isPremium ? true : userProfile.preferences.allowAds}
                  disabled={!subscription.isPremium}
                  onChange={(e) => handlePreferenceChange('allowAds', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute', cursor: !subscription.isPremium ? 'not-allowed' : 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0, backgroundColor: (!subscription.isPremium || userProfile.preferences.allowAds) ? '#FF6347' : '#ccc',
                  transition: '.4s', borderRadius: '34px',
                  opacity: !subscription.isPremium ? 0.6 : 1
                }}></span>
                <span style={{
                  position: 'absolute', content: '""', height: '20px', width: '20px',
                  left: (!subscription.isPremium || userProfile.preferences.allowAds) ? '26px' : '4px', bottom: '4px',
                  backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                }}></span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h4>Help & Support</h4>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <button
                  onClick={handleRestartTutorial}
                  style={{ padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', textAlign: 'left' }}
                >
                  📚 Restart Tutorial
                </button>
                <button
                  onClick={() => setShowFeedback(true)}
                  style={{ padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', textAlign: 'left' }}
                >
                  💬 Send Feedback / Report Bug
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Tab */}
      {activeTab === 'business' && (
        <div style={{ padding: '0 5px' }}>
          <h3>Business Account</h3>

          {!subscription.isPremium ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#fff3e0', borderRadius: '10px' }}>
              <p>🔒 Business Accounts are for Premium Members only.</p>
              <button onClick={onNavigateToMembership} style={buttonStyle}>Upgrade to Premium</button>
            </div>
          ) : (
            <>
              {!business.isBusiness ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>You are a Premium Member! Create a business profile to start posting ads.</p>
                  <button onClick={handleCreateBusiness} style={buttonStyle}>Create Business Account</button>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
                    <h4>Post a New Ad (₦1,200)</h4>
                    <form onSubmit={handlePostAd}>
                      <input
                        placeholder="Ad Title"
                        style={inputStyle}
                        value={adForm.title}
                        onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                        required
                      />
                      <textarea
                        placeholder="Ad Content"
                        style={inputStyle}
                        value={adForm.content}
                        onChange={(e) => setAdForm({ ...adForm, content: e.target.value })}
                        required
                      />
                      <button
                        type="submit"
                        style={{ ...buttonStyle, opacity: processingAd ? 0.7 : 1 }}
                        disabled={processingAd}
                      >
                        {processingAd ? 'Processing...' : 'Pay & Post Ad'}
                      </button>
                    </form>
                  </div>

                  <h4>Your Active Ads</h4>
                  {business.ads.length === 0 ? (
                    <p style={{ color: '#888' }}>No ads posted yet.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {business.ads.map(ad => (
                        <li key={ad.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                          <strong>{ad.title}</strong>
                          <p>{ad.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showFeedback && <FeedbackHandler onClose={() => setShowFeedback(false)} onSubmit={submitFeedback} />}
    </div>
  );
};

export default Settings;
