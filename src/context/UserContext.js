import React, { createContext, useState, useContext } from 'react';
import { CURRENT_USER } from '../data/mockData';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(CURRENT_USER);

  const buyPits = (amount) => {
    setUser(prev => ({ ...prev, pits: prev.pits + amount }));
  };

  const ripenMatch = (matchId) => {
    if (user.pits >= 5) {
      setUser(prev => ({
        ...prev,
        pits: prev.pits - 5,
        ripenedMatches: [...prev.ripenedMatches, matchId]
      }));
    } else {
      console.warn("Insufficient pits!");
    }
  };

  return (
    <UserContext.Provider value={{ user, buyPits, ripenMatch }}>
      {children}
    </UserContext.Provider>
  );
};
