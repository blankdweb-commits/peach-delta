import React, { createContext, useState } from 'react';
import { currentUser, mockMatches } from '../data/mockData';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(currentUser);
  const [matches, setMatches] = useState(mockMatches);
  const [ripenedMatches, setRipenedMatches] = useState([]);

  const buyPits = (amount) => {
    setUser(prev => ({ ...prev, pits: prev.pits + amount }));
  };

  const ripenMatch = (matchId) => {
    if (user.pits >= 5) {
      setUser(prev => ({ ...prev, pits: prev.pits - 5 }));
      setRipenedMatches(prev => [...prev, matchId]);
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{
      user,
      matches,
      ripenedMatches,
      buyPits,
      ripenMatch
    }}>
      {children}
    </UserContext.Provider>
  );
};
