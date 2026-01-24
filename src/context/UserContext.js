import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Mock User Data
// membershipTier: 'free' | 'premium' | 'business'
const initialUser = {
  alias: 'Nurse_Peachy99',
  email: 'nurse.peachy@example.com',
  isEmailVerified: true,
  level: 'Year 2',
  geolocation: { lat: 5.8904, lng: 5.6806 }, // Example: Sapele
  likes: ['Night shifts', 'Suya after rounds', 'Skincare'],
  dislikes: ['8 AM lectures', 'Double shifts', 'PHCN blackouts'],
  matchedUsers: [],

  // Membership & Ads
  membershipTier: 'free',
  dailyRipenCount: 0,
  lastRipenDate: new Date().toDateString(),
  adPreferences: {
    allowAds: true
  }
};

const initialAds = [
  { id: 1, title: "Study Nursing Abroad", content: "Scholarships available for Delta State nurses!", target: "all" },
  { id: 2, title: "Local Scrubs Sale", content: "Buy 1 Get 1 Free at Warri Market.", target: "Year 2" }
];

// Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [currentView, setCurrentView] = useState('discover'); // 'discover', 'business', 'settings'
  const [ads, setAds] = useState(initialAds);

  // -- Actions --

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  const upgradeMembership = (tier) => {
    setUser(prev => ({
      ...prev,
      membershipTier: tier,
      // Reset ad preference logic: Premium defaults to opting in but can opt out
      adPreferences: { ...prev.adPreferences, allowAds: tier !== 'premium' ? true : prev.adPreferences.allowAds }
    }));
  };

  const toggleAdPreference = () => {
    if (user.membershipTier === 'premium') {
      setUser(prev => ({
        ...prev,
        adPreferences: { ...prev.adPreferences, allowAds: !prev.adPreferences.allowAds }
      }));
    }
  };

  const ripenMatch = () => {
    const today = new Date().toDateString();

    // Reset if new day
    if (user.lastRipenDate !== today) {
       setUser(prev => ({ ...prev, dailyRipenCount: 0, lastRipenDate: today }));
       // After reset, we proceed.
    }

    // Check Limits
    if (user.membershipTier === 'free') {
        // use updated state logic in a real app, but for sync mock:
        // We need to check against the state *before* the update if we were doing this carefully,
        // but let's assume the reset happened.
        const currentCount = (user.lastRipenDate !== today) ? 0 : user.dailyRipenCount;

        if (currentCount >= 25) {
            return { success: false, reason: 'limit_reached' };
        }
    }

    // Execute Ripen
    setUser(prev => {
        const isNewDay = prev.lastRipenDate !== today;
        return {
            ...prev,
            dailyRipenCount: isNewDay ? 1 : prev.dailyRipenCount + 1,
            lastRipenDate: today
        };
    });

    return { success: true };
  };

  const createAd = (adData) => {
    const newAd = {
        id: Date.now(),
        ...adData
    };
    setAds(prev => [...prev, newAd]);
    alert("Ad Campaign Launched!");
  };

  return (
    <UserContext.Provider value={{
        user,
        ads,
        currentView,
        navigateTo,
        upgradeMembership,
        toggleAdPreference,
        ripenMatch,
        createAd
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook
export const useUser = () => {
  return useContext(UserContext);
};
