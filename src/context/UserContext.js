import React, { createContext, useState, useContext } from 'react';
import { MOCK_USERS } from '../data/mockData';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Starter Kit: 25 Free Pits
  const [pits, setPits] = useState(25);
  const [rippedMatches, setRippedMatches] = useState([]);

  // Current user's preferences (mocked for matching logic)
  const [userProfile, setUserProfile] = useState({
    alias: "My_Alias",
    likes: ["Night shifts", "Suya after rounds", "Skincare"],
    dislikes: ["8 AM lectures", "Rude preceptors", "PHCN blackouts"],
    location: "Delta State"
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

  return (
    <UserContext.Provider value={{
      pits,
      addPits,
      ripenMatch,
      isRipped,
      userProfile,
      potentialMatches: MOCK_USERS
    }}>
      {children}
    </UserContext.Provider>
  );
};
