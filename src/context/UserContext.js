import React, { createContext, useState } from 'react';
import { CURRENT_USER } from '../data/mockData';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(CURRENT_USER);
  const [pits, setPits] = useState(25); // Starter kit
  const [ripenedMatches, setRipenedMatches] = useState(new Set());

  const buyPits = (amount) => {
    setPits((prev) => prev + amount);
  };

  const ripenMatch = (matchId) => {
    if (pits >= 5) {
      setPits((prev) => prev - 5);
      setRipenedMatches((prev) => new Set(prev).add(matchId));
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        pits,
        ripenedMatches,
        buyPits,
        ripenMatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
