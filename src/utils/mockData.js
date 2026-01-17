import { SWEET_PEACHES, BRUISED_PEACHES } from './types';

export const currentUser = {
  id: 'user_001',
  alias: 'Nurse_Peachy99',
  email: 'nurse.joy@example.com',
  pits: 3, // Starting low to test the "Purchase" flow logic
  geolocation: {
    lat: 5.8904,
    lng: 5.6800,
    city: 'Sapele',
    state: 'Delta'
  },
  likes: ['Suya after rounds', 'Pediatric ward', 'Skincare'],
  dislikes: ['8 AM lectures', 'Rude preceptors', 'PHCN blackouts']
};

export const potentialMatches = [
  {
    id: 'match_001',
    alias: 'Dr_Dre', // Hidden until ripened
    realName: 'Andre Okeke', // Hidden until ripened
    photoUrl: 'https://via.placeholder.com/150', // Blurred until ripened
    geolocation: {
      lat: 5.8910, // Close to Sapele
      lng: 5.6810,
      city: 'Sapele',
      state: 'Delta'
    },
    likes: ['Suya after rounds', 'Pediatric ward', 'Boat club vibes'],
    dislikes: ['8 AM lectures', 'Rude preceptors', 'Double shifts']
  },
  {
    id: 'match_002',
    alias: 'Sister_Nkechi',
    realName: 'Nkechi Obi',
    photoUrl: 'https://via.placeholder.com/150',
    geolocation: {
      lat: 5.5544, // Warri
      lng: 5.7932,
      city: 'Warri',
      state: 'Delta'
    },
    likes: ['Night shifts', 'Anatomy study', 'Skincare'],
    dislikes: ['Ghosting', 'Heavy textbooks', 'PHCN blackouts']
  }
];
