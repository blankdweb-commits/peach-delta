import React from 'react';
import { useUser } from '../context/UserContext';

const Settings = () => {
    const { user, upgradeMembership, toggleAdPreference, navigateTo } = useUser();

    return (
        <div>
            <h2>Settings & Account</h2>

            <div style={{border: '1px solid #ccc', padding: '15px', borderRadius: '10px', marginBottom: '20px'}}>
                <h3>Your Membership</h3>
                <p>Current Tier: <strong>{user.membershipTier.toUpperCase()}</strong></p>

                {user.membershipTier === 'free' && (
                    <div>
                        <p>Limit: 25 Unripes / Day</p>
                        <p>Remaining Today: {25 - user.dailyRipenCount}</p>
                        <button
                            style={{backgroundColor: '#FFD700', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                            onClick={() => upgradeMembership('premium')}
                        >
                            Upgrade to Premium (Unlimited + No Ads) 🌟
                        </button>
                        <div style={{marginTop: '10px'}}>
                             <button onClick={() => upgradeMembership('business')} style={{background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}>
                                Switch to Business Account
                            </button>
                        </div>
                    </div>
                )}

                {user.membershipTier === 'premium' && (
                    <div>
                        <p>✅ Unlimited Unripes</p>
                        <p>✅ Ad Control</p>
                        <button onClick={() => upgradeMembership('free')} style={{fontSize: '0.8em', marginTop: '10px'}}>Downgrade to Free</button>
                    </div>
                )}

                 {user.membershipTier === 'business' && (
                    <div>
                        <p>✅ Run Targeted Ads</p>
                        <p>✅ Analytics Dashboard</p>
                         <button
                            style={{backgroundColor: '#4CAF50', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                            onClick={() => navigateTo('business')}
                        >
                            Go to Business Dashboard
                        </button>
                        <br/>
                        <button onClick={() => upgradeMembership('free')} style={{fontSize: '0.8em', marginTop: '10px'}}>Switch to Personal Account</button>
                    </div>
                )}
            </div>

            {user.membershipTier === 'premium' && (
                <div style={{border: '1px solid #ccc', padding: '15px', borderRadius: '10px'}}>
                    <h3>Ad Preferences</h3>
                    <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                        <input
                            type="checkbox"
                            checked={!user.adPreferences.allowAds}
                            onChange={toggleAdPreference}
                            style={{marginRight: '10px'}}
                        />
                        Disable Ads (Pure Experience)
                    </label>
                    <p style={{fontSize: '0.9em', color: '#666'}}>
                        {user.adPreferences.allowAds
                            ? "You are currently supporting local businesses by seeing relevant ads."
                            : "You will not see any ads."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Settings;
