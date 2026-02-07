import React, { createContext, useState, useContext } from 'react';
import { MOCK_USERS } from '../data/mockData';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Starter Kit: 25 Free Pits
  const [pits, setPits] = useState(25);
  const [rippedMatches, setRippedMatches] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState(MOCK_USERS);
  const [adsSeen, setAdsSeen] = useState(0);

  // Current user's preferences (mocked for matching logic)
  const [userProfile, setUserProfile] = useState({
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

  const addPits = (amount) => {
    setPits(prev => prev + amount);
  };

  const deductPits = (amount) => {
    if (pits >= amount) {
      setPits(prev => prev - amount);
      return true;
    }
    return false;
  };

  const ripenMatch = (matchId) => {
    if (rippedMatches.includes(matchId)) return true;

    if (deductPits(5)) {
      setRippedMatches(prev => [...prev, matchId]);
      return true;
    }
    return false;
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

  // Ad Tracking
  const incrementAdsSeen = () => {
    setAdsSeen(prev => prev + 1);
  };

  return (
    <UserContext.Provider value={{
      pits,
      addPits,
      ripenMatch,
      isRipped,
      userProfile,
      potentialMatches,
      deleteUser,
      banUser,
      adsSeen,
      incrementAdsSeen
    }}>
      {children}
    </UserContext.Provider>
  );
};
