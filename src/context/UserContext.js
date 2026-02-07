import React, { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { mockBackend } from '../services/mockBackend';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [subscription, setSubscription] = useState({
    isPremium: false,
    dailyUnripes: 0,
    lastReset: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  });
  const [rippedMatches, setRippedMatches] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState(MOCK_USERS);
  const [adsSeen, setAdsSeen] = useState(0);
  const [business, setBusiness] = useState({ isBusiness: false, ads: [] });

  // Current user's preferences (mocked for matching logic)
  const [userProfile, setUserProfile] = useState({
    // Hardcoded read-only fields for now
    name: "My Name",
    email: "myemail@peach.com",
    photoUrl: null, // Avatar

    alias: "My_Alias",
    level: "Year 2",
    basics: {
        fun: ["Eating Boli", "Watching Nollywood", "Swimming"],
        media: ["Afrobeats", "Davido", "K-Dramas"]
    },
    life: {
        based: "Sapele",
        upbringing: "Strict but loving, raised by grandma."
    },
    work: {
        job: "Student Nurse",
        reason: "Always wanted to help people heal."
    },
    relationships: {
        values: ["Honesty", "God-fearing", "Family"],
        lookingFor: "Long-term"
    },
    vision: "A simple life with a small clinic of my own someday.",
    special: "Communication is key to everything."
  });

  // Daily Reset Logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (subscription.lastReset !== today) {
      setSubscription(prev => ({
        ...prev,
        dailyUnripes: 0,
        lastReset: today
      }));
    }
  }, [subscription.lastReset]);

  const canRipen = () => {
    if (subscription.isPremium) return true;
    return subscription.dailyUnripes < 25;
  };

  const ripenMatch = async (matchId) => {
    if (rippedMatches.includes(matchId)) return true;

    if (canRipen()) {
      // If free user, increment count
      if (!subscription.isPremium) {
         setSubscription(prev => ({
           ...prev,
           dailyUnripes: prev.dailyUnripes + 1
         }));
      }

      setRippedMatches(prev => [...prev, matchId]);
      return true;
    }
    return false; // Limit reached, redirect handled in Discover
  };

  const isRipped = (matchId) => rippedMatches.includes(matchId);

  // Admin Actions
  const deleteUser = (userId) => {
    setPotentialMatches(prev => prev.filter(user => user.id !== userId));
  };

  const banUser = (userId) => {
    setPotentialMatches(prev => prev.map(user =>
      user.id === userId ? { ...user, banned: true } : user
    ));
  };

  // Membership Actions
  const processUpgrade = async (paymentReference) => {
    const result = await mockBackend.verifyPayment(paymentReference);
    if (result.status) {
      setSubscription(prev => ({ ...prev, isPremium: true }));
      return true;
    }
    return false;
  };

  // Ad Tracking
  const incrementAdsSeen = () => {
    setAdsSeen(prev => prev + 1);
  };

  // Profile Updates
  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Business Account
  const createBusinessAccount = () => {
    if (subscription.isPremium) {
      setBusiness(prev => ({ ...prev, isBusiness: true }));
      return true;
    }
    return false;
  };

  const postAd = (adData) => {
    setBusiness(prev => ({
      ...prev,
      ads: [...prev.ads, { id: Date.now(), ...adData }]
    }));
  };

  return (
    <UserContext.Provider value={{
      subscription,
      ripenMatch,
      isRipped,
      userProfile,
      potentialMatches,
      deleteUser,
      banUser,
      adsSeen,
      incrementAdsSeen,
      processUpgrade,
      canRipen,
      updateUserProfile,
      business,
      createBusinessAccount,
      postAd
    }}>
      {children}
    </UserContext.Provider>
  );
};
