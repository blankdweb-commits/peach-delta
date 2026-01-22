import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Mock User Data
const initialUser = {
  alias: 'Nurse_Peachy99',
  email: 'nurse.peachy@example.com',
  isEmailVerified: true,
  level: 'Year 2',
  pits: 25, // Starter Kit
  geolocation: { lat: 5.8904, lng: 5.6806 }, // Example: Sapele
  likes: ['Night shifts', 'Suya after rounds', 'Skincare'],
  dislikes: ['8 AM lectures', 'Double shifts', 'PHCN blackouts'],
  matchedUsers: []
};

// Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [currentView, setCurrentView] = useState('discover'); // 'discover', 'store'

  const deductPits = (amount) => {
    if (user.pits >= amount) {
      setUser((prev) => ({ ...prev, pits: prev.pits - amount }));
      return true;
    }
    return false;
  };

  const addPits = (amount) => {
    setUser((prev) => ({ ...prev, pits: prev.pits + amount }));
  };

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  return (
    <UserContext.Provider value={{ user, deductPits, addPits, currentView, navigateTo }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook
export const useUser = () => {
  return useContext(UserContext);
};
