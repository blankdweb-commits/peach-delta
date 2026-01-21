import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    alias: 'Nurse_Peachy99',
    email: 'nurse.peachy@example.com',
    isEmailVerified: true,
    level: 'Year 2', // Year 1-3 or Intern
    pits: 25, // Starter bonus
    location: {
      latitude: 5.5442,
      longitude: 5.7603,
      name: 'Warri, Delta State' // Default broader location
    },
    likes: ['Night shifts', 'Suya after rounds', 'Pediatric ward'],
    dislikes: ['8 AM lectures', 'Rude preceptors', 'PHCN blackouts']
  });

  const refillPits = (amount) => {
    setUser(prev => ({
      ...prev,
      pits: prev.pits + amount
    }));
  };

  const spendPits = (amount) => {
    if (user.pits >= amount) {
      setUser(prev => ({
        ...prev,
        pits: prev.pits - amount
      }));
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ user, setUser, refillPits, spendPits }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
