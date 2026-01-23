import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'u123',
    alias: 'Nurse_Peachy99',
    email: 'peachy99@nursing.school',
    isEmailVerified: true,
    level: 'Year 2',
    location: {
      city: 'Sapele',
      state: 'Delta State',
      coords: { lat: 5.8904, lng: 5.6800 }
    },
    pits: 25, // Starter bonus
    likes: ['Suya after rounds', 'Pediatric ward', 'Skincare'],
    dislikes: ['8 AM lectures', 'Double shifts', 'PHCN blackouts']
  });

  const addPits = (amount) => {
    setUser(prev => ({ ...prev, pits: prev.pits + amount }));
  };

  const deductPits = (amount) => {
    if (user.pits >= amount) {
      setUser(prev => ({ ...prev, pits: prev.pits - amount }));
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ user, addPits, deductPits }}>
      {children}
    </UserContext.Provider>
  );
};
