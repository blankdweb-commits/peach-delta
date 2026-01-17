// User Levels
export const LEVELS = ['Intern', 'Year 1', 'Year 2', 'Year 3'];

// Sweet Peaches (Likes)
export const SWEET_PEACHES = [
  'Night shifts',
  'Suya after rounds',
  'Anatomy study',
  'Pediatric ward',
  'Boat club vibes',
  'Skincare'
];

// Bruised Peaches (Dislikes)
export const BRUISED_PEACHES = [
  '8 AM lectures',
  'Rude preceptors',
  'Double shifts',
  'Ghosting',
  'Heavy textbooks',
  'PHCN blackouts'
];

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} alias
 * @property {string} email
 * @property {number} pits
 * @property {Object} geolocation
 * @property {number} geolocation.lat
 * @property {number} geolocation.lng
 * @property {string} geolocation.city
 * @property {string} geolocation.state
 * @property {string[]} likes
 * @property {string[]} dislikes
 */
