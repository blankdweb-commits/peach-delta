export const LOCATIONS = [
  'Warri',
  'Asaba',
  'Ughelli',
  'Sapele',
  'Agbor',
  'Abraka'
];

export const LIKES = [
  'Night shifts',
  'Suya after rounds',
  'Anatomy study',
  'Pediatric ward',
  'Boat club vibes',
  'Skincare'
];

export const DISLIKES = [
  '8 AM lectures',
  'Rude preceptors',
  'Double shifts',
  'Ghosting',
  'Heavy textbooks',
  'PHCN blackouts'
];

export const MOCK_USERS = [
  {
    id: 1,
    alias: 'Nurse_Peachy99',
    level: 'Year 2',
    location: 'Sapele',
    likes: ['Suya after rounds', 'Skincare', 'Pediatric ward'],
    dislikes: ['8 AM lectures', 'Double shifts', 'Ghosting'],
    compatibility: 0, // Calculated dynamically
  },
  {
    id: 2,
    alias: 'DeltaDoc_Intern',
    level: 'Intern',
    location: 'Warri',
    likes: ['Night shifts', 'Boat club vibes', 'Anatomy study'],
    dislikes: ['Rude preceptors', 'PHCN blackouts', 'Heavy textbooks'],
    compatibility: 0,
  },
  {
    id: 3,
    alias: 'Sapele_Soul',
    level: 'Year 3',
    location: 'Sapele',
    likes: ['Suya after rounds', 'Night shifts', 'Boat club vibes'],
    dislikes: ['8 AM lectures', 'Rude preceptors', 'Ghosting'],
    compatibility: 0,
  },
   {
    id: 4,
    alias: 'Perfect_Match',
    level: 'Year 3',
    location: 'Sapele',
    likes: ['Suya after rounds', 'Skincare', 'Pediatric ward'], // Same as user 1 (mock current user)
    dislikes: ['8 AM lectures', 'Double shifts', 'Ghosting'], // Same as user 1
    compatibility: 0,
  }
];

export const CURRENT_USER = {
  id: 100,
  alias: 'My_Alias',
  level: 'Year 2',
  location: 'Sapele',
  likes: ['Suya after rounds', 'Skincare', 'Pediatric ward'],
  dislikes: ['8 AM lectures', 'Double shifts', 'Ghosting'],
  email: 'me@example.com',
  isVerified: true
};
