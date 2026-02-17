import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { MOCK_USERS } from '../data/mockData';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Starter Kit: 25 Free Pits
  const [pits, setPits] = useState(25);
  const [rippedMatches, setRippedMatches] = useState([]);

  // Current user's preferences (mocked for matching logic)
  const [userProfile] = useState({
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

  const addPits = useCallback((amount) => {
    setPits(prev => prev + amount);
  }, []);

  const deductPits = useCallback((amount) => {
    if (pits >= amount) {
      setPits(prev => prev - amount);
      return true;
    }
    return false;
  }, [pits]);

  const ripenMatch = useCallback((matchId) => {
    if (rippedMatches.includes(matchId)) return true;

    if (deductPits(5)) {
      setRippedMatches(prev => [...prev, matchId]);
      return true;
    }
    return false;
  }, [rippedMatches, deductPits]);

  const isRipped = useCallback((matchId) => rippedMatches.includes(matchId), [rippedMatches]);

  const value = useMemo(() => ({
    pits,
    addPits,
    ripenMatch,
    isRipped,
    userProfile,
    potentialMatches: MOCK_USERS
  }), [pits, addPits, ripenMatch, isRipped, userProfile]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
