# Database Schema

## Users Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `email` | String | User's email address (unique) |
| `isEmailVerified` | Boolean | Verification status |
| `alias` | String | User's display name (e.g., Nurse_Peachy99) |
| `level` | String | 'Year 1', 'Year 2', 'Year 3', 'Intern' |
| `location` | Object | GeoJSON Point `{ type: "Point", coordinates: [longitude, latitude] }` |
| `pits` | Integer | Current balance of Pits |
| `likes` | Array<String> | List of "Sweet Peaches" (max 3) |
| `dislikes` | Array<String> | List of "Bruised Peaches" (max 3) |
| `createdAt` | Date | Timestamp of account creation |

## Matches Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `userA` | ObjectId | Reference to User |
| `userB` | ObjectId | Reference to User |
| `compatibilityScore` | Integer | Calculated compatibility percentage |
| `status` | String | 'Pending', 'Ripened', 'Rejected' |
| `ripenedBy` | Array<ObjectId>| Users who have paid to ripen this match |

## Transactions Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `userId` | ObjectId | Reference to User |
| `type` | String | 'Purchase', 'Spend' |
| `amount` | Integer | Amount of Pits |
| `description` | String | e.g., 'Pit Refill', 'Ripen Match' |
| `timestamp` | Date | Transaction time |
