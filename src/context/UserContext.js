import React, { createContext, useState, useEffect } from 'react';
import { currentUser, mockUsers } from '../data/mockData';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(currentUser);
  const [matches, setMatches] = useState([]);
  const [ripenedMatches, setRipenedMatches] = useState(new Set());

  useEffect(() => {
    // Simulate fetching matches based on location/logic
    // For now, just load all mock users
    setMatches(mockUsers);
  }, []);

  const buyPits = (amount) => {
    setUser((prev) => ({ ...prev, pits: prev.pits + amount }));
  };

  const ripenMatch = (matchId) => {
    if (user.pits >= 5) {
      setUser((prev) => ({ ...prev, pits: prev.pits - 5 }));
      setRipenedMatches((prev) => new Set(prev).add(matchId));
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ user, matches, ripenedMatches, buyPits, ripenMatch }}>
      {children}
    </UserContext.Provider>
  );
};
