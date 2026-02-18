import React, { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { mockBackend } from '../services/mockBackend';
import { supabaseService } from '../services/supabaseService'; // Imported but usage conditional

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Use a flag to toggle between Mock and Real Backend for development/demo
  // In production (cPanel), this would likely default to false or rely on env vars.
  const USE_SUPABASE = process.env.REACT_APP_USE_SUPABASE === 'true';

  const [currentUser, setCurrentUser] = useState(null);
  const [subscription, setSubscription] = useState({
    isPremium: false,
    dailyUnripes: 0,
    lastReset: new Date().toISOString().split('T')[0]
  });
  const [rippedMatches, setRippedMatches] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState(MOCK_USERS);
  const [adsSeen, setAdsSeen] = useState(0);
  const [business, setBusiness] = useState({ isBusiness: false, ads: [] });
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');

  const [chats, setChats] = useState({});
  const [feedback, setFeedback] = useState([]);

  const [userProfile, setUserProfile] = useState({
    name: "My Name",
    email: "myemail@peach.com",
    photoUrl: null,
    preferences: { allowAds: false },
    alias: "My_Alias",
    level: "Year 2",
    basics: { fun: [], media: [] },
    life: { based: "Sapele", upbringing: "" },
    work: { job: "Student Nurse", reason: "" },
    relationships: { values: [], lookingFor: "Long-term" },
    vision: "",
    special: ""
  });

  // --- AUTH ---
  const loginUser = async (email, password) => {
    if (USE_SUPABASE) {
        const { data, error } = await supabaseService.auth.signIn(email, password);
        if (!error && data.user) {
            setCurrentUser(data.user);
            await loadUserData(data.user.id);
            return true;
        }
        return false;
    } else {
        // Mock Logic
        if (email.includes('@') && password.length > 3) {
            setCurrentUser({ email, id: 'current_user' });
            if (email === 'test@peach.com') {
                setOnboardingComplete(true);
                setSubscription(prev => ({ ...prev, isPremium: false }));
            }
            return true;
        }
        return false;
    }
  };

  const signupUser = async (email, password) => {
      if (USE_SUPABASE) {
          const { data, error } = await supabaseService.auth.signUp(email, password);
          if (!error && data.user) {
              setCurrentUser(data.user);
              // Create initial profile in DB? Trigger typically handles this,
              // or we call supabaseService.profiles.update
              setOnboardingComplete(false);
              return true;
          }
          return false;
      } else {
          if (email.includes('@')) {
              setCurrentUser({ email, id: 'current_user' });
              setOnboardingComplete(false);
              setSubscription(prev => ({ ...prev, isPremium: false }));
              setUserProfile(prev => ({ ...prev, email }));
              return true;
          }
          return false;
      }
  };

  const logoutUser = async () => {
      if (USE_SUPABASE) await supabaseService.auth.signOut();
      setCurrentUser(null);
      setOnboardingComplete(false);
  };

  const loadUserData = async (userId) => {
      if (!USE_SUPABASE) return;
      // Load Profile
      const { data: profile } = await supabaseService.profiles.get(userId);
      if (profile) {
          setUserProfile(prev => ({ ...prev, ...profile }));
          setOnboardingComplete(profile.onboarding_complete);
          setKycStatus(profile.kyc_status);
          setSubscription(prev => ({
              ...prev,
              isPremium: profile.is_premium,
              dailyUnripes: profile.daily_unripes_count
          }));
      }
      // Load Matches
      const { data: matches } = await supabaseService.matches.getMatches(userId);
      // Transform logic would be needed here to match state structure
  };

  // --- CORE LOGIC ---
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (subscription.lastReset !== today) {
      setSubscription(prev => ({
        ...prev,
        dailyUnripes: 0,
        lastReset: today
      }));
      // TODO: Update DB reset date if Supabase
    }
  }, [subscription.lastReset]);

  const canRipen = () => {
    if (subscription.isPremium) return true;
    return subscription.dailyUnripes < 25;
  };

  const ripenMatch = async (matchId) => {
    if (rippedMatches.includes(matchId)) return true;

    if (canRipen()) {
      if (USE_SUPABASE) {
          const { error } = await supabaseService.matches.ripen(matchId, currentUser.id);
          if (error) return false;
      }

      // Update Local State (optimistic or fallback)
      if (!subscription.isPremium) {
         setSubscription(prev => ({
           ...prev,
           dailyUnripes: prev.dailyUnripes + 1
         }));
      }
      setRippedMatches(prev => [...prev, matchId]);
      setChats(prev => ({ ...prev, [matchId]: [] }));
      return true;
    }
    return false;
  };

  const isRipped = (matchId) => rippedMatches.includes(matchId);

  const sendMessage = async (matchId, text) => {
    const newMessage = { id: Date.now(), text, sender: 'me', timestamp: new Date().toISOString() };

    if (USE_SUPABASE && currentUser) {
        await supabaseService.messages.send(matchId, currentUser.id, text);
        // Subscription handles update, or optimistic:
    }

    setChats(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMessage]
    }));

    if (!USE_SUPABASE) {
        setTimeout(() => {
            const reply = { id: Date.now() + 1, text: "That's interesting! Tell me more.", sender: 'them', timestamp: new Date().toISOString() };
            setChats(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), reply] }));
        }, 2000);
    }
  };

  // --- ADMIN / BUSINESS ---
  const deleteUser = (userId) => {
    setPotentialMatches(prev => prev.filter(user => user.id !== userId));
  };

  const banUser = (userId) => {
    setPotentialMatches(prev => prev.map(user =>
      user.id === userId ? { ...user, banned: true } : user
    ));
  };

  const grantPremium = (userId) => {
      if (userId === 'current_user' || !userId || (currentUser && userId === currentUser.id)) {
          setSubscription(prev => ({ ...prev, isPremium: true }));
          if (USE_SUPABASE && currentUser) supabaseService.profiles.update(currentUser.id, { is_premium: true });
      } else {
          setPotentialMatches(prev => prev.map(user =>
            user.id === userId ? { ...user, isPremium: true } : user
          ));
      }
  };

  const revokePremium = (userId) => {
      if (userId === 'current_user' || !userId || (currentUser && userId === currentUser.id)) {
          setSubscription(prev => ({ ...prev, isPremium: false }));
          if (USE_SUPABASE && currentUser) supabaseService.profiles.update(currentUser.id, { is_premium: false });
      } else {
          setPotentialMatches(prev => prev.map(user =>
            user.id === userId ? { ...user, isPremium: false } : user
          ));
      }
  };

  const processUpgrade = async (paymentReference) => {
    const result = await mockBackend.verifyPayment(paymentReference);
    if (result.status) {
      setSubscription(prev => ({ ...prev, isPremium: true }));
      if (USE_SUPABASE && currentUser) supabaseService.profiles.update(currentUser.id, { is_premium: true });
      return true;
    }
    return false;
  };

  const incrementAdsSeen = () => setAdsSeen(prev => prev + 1);

  const updateUserProfile = (updates) => {
    setUserProfile(prev => {
      const newState = { ...prev, ...updates };
      if (updates.preferences) {
        newState.preferences = { ...prev.preferences, ...updates.preferences };
      }
      return newState;
    });

    if (USE_SUPABASE && currentUser) {
        // Map updates to schema fields if necessary
        supabaseService.profiles.update(currentUser.id, updates);
    }
  };

  const createBusinessAccount = () => {
    if (subscription.isPremium && kycStatus === 'verified') {
      setBusiness(prev => ({ ...prev, isBusiness: true }));
      return true;
    }
    return false;
  };

  const postAd = async (adData, paymentRef) => {
    const result = await mockBackend.verifyPayment(paymentRef);
    if (result.status) {
        setBusiness(prev => ({ ...prev, ads: [...prev.ads, { id: Date.now(), ...adData }] }));
        if (USE_SUPABASE && currentUser) {
            supabaseService.ads.post({ ...adData, owner_id: currentUser.id });
        }
        return true;
    }
    return false;
  };

  const submitFeedback = (data) => {
    setFeedback(prev => [...prev, data]);
    if (USE_SUPABASE && currentUser) {
        supabaseService.feedback.submit(currentUser.id, data.type, data.content);
    }
    console.log("Feedback received:", data);
  };

  const updateKYC = (status) => {
      setKycStatus(status);
      if (USE_SUPABASE && currentUser) {
          supabaseService.profiles.update(currentUser.id, { kyc_status: status });
      }
  };

  return (
    <UserContext.Provider value={{
      currentUser, loginUser, signupUser, logoutUser,
      subscription, ripenMatch, isRipped, rippedMatches, userProfile, potentialMatches,
      deleteUser, banUser, grantPremium, revokePremium,
      adsSeen, incrementAdsSeen, processUpgrade, canRipen, updateUserProfile,
      business, createBusinessAccount, postAd, chats, sendMessage,
      onboardingComplete, setOnboardingComplete, submitFeedback, feedback,
      kycStatus, updateKYC
    }}>
      {children}
    </UserContext.Provider>
  );
};
