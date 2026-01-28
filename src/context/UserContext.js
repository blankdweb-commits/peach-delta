import React, { createContext, useState, useEffect } from 'react';
import { USERS, CURRENT_USER_ID } from '../data/mockData';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pits, setPits] = useState(25);
  const [matches, setMatches] = useState([]);
  const [ripenedMatches, setRipenedMatches] = useState([]);

  useEffect(() => {
    const currentUser = USERS.find(u => u.id === CURRENT_USER_ID);
    setUser(currentUser);

    // Filter out current user from matches
    const potentialMatches = USERS.filter(u => u.id !== CURRENT_USER_ID);
    setMatches(potentialMatches);
  }, []);

  const ripenMatch = (matchId) => {
    if (pits >= 5) {
      setPits(prev => prev - 5);
      setRipenedMatches(prev => [...prev, matchId]);
      return true;
    }
    return false;
  };

  const buyPits = (amount) => {
    setPits(prev => prev + amount);
  };

  return (
    <UserContext.Provider value={{
      user,
      pits,
      matches,
      ripenedMatches,
      ripenMatch,
      buyPits,
      setPits // Exposed for testing flexibility
    }}>
      {children}
    </UserContext.Provider>
  );
};
