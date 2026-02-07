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

  // Chat State: { matchId: [{ id, text, sender: 'me'|'them', timestamp }] }
  const [chats, setChats] = useState({});

  // Current user's preferences (mocked for matching logic)
  // eslint-disable-next-line no-unused-vars
  const [userProfile, setUserProfile] = useState({
    // Hardcoded read-only fields for now
    name: "My Name",
    email: "myemail@peach.com",
    photoUrl: null, // Avatar

    preferences: {
      allowAds: false // Premium user opt-in
    },

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

      // Initialize chat for new match
      setChats(prev => ({
        ...prev,
        [matchId]: []
      }));

      return true;
    }
    return false; // Limit reached, redirect handled in Discover
  };

  const isRipped = (matchId) => rippedMatches.includes(matchId);

  // Chat Actions
  const sendMessage = (matchId, text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'me',
      timestamp: new Date().toISOString()
    };

    setChats(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMessage]
    }));

    // Simulate a reply after 2 seconds
    setTimeout(() => {
        const reply = {
            id: Date.now() + 1,
            text: "That's interesting! Tell me more about your shifts at the hospital.",
            sender: 'them',
            timestamp: new Date().toISOString()
        };
        setChats(prev => ({
          ...prev,
          [matchId]: [...(prev[matchId] || []), reply]
        }));
    }, 2000);
  };

  // Helper to add a wingman generated message directly to input or as a sent message?
  // Usually the user reviews it first. So we just return the string in the UI.
  // But if the user clicks "Send", we use sendMessage.

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
    setUserProfile(prev => {
      // Handle deep merge for nested objects if necessary, or simple merge
      // For preferences, we might want specific handling if passed partially
      if (updates.preferences) {
        return {
          ...prev,
          ...updates,
          preferences: { ...prev.preferences, ...updates.preferences }
        };
      }
      return { ...prev, ...updates };
    });
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
      rippedMatches,
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
      postAd,
      chats,
      sendMessage
    }}>
      {children}
    </UserContext.Provider>
  );
};
