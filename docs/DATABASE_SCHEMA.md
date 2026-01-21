# Database Schema Design for Peach

## User Profile Collection
`users`

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier |
| `email` | String | Unique, requires verification |
| `is_email_verified` | Boolean | True if email is verified |
| `password_hash` | String | Hashed password |
| `alias` | String | Unique username (e.g., Nurse_Peachy99) |
| `real_name` | String | Full name (Encrypted/Protected) |
| `profile_photo_url` | String | URL to photo (Applied blur client-side or separate blurred version) |
| `level` | String | Enum: ['Year 1', 'Year 2', 'Year 3', 'Intern'] |
| `location` | Object | `{ type: "Point", coordinates: [longitude, latitude], name: "City, State" }` |
| `pits_balance` | Integer | Current balance of Pits. Default: 25 (if verified) |
| `likes` | Array<String> | List of "Sweet Peaches" (Max 3) |
| `dislikes` | Array<String> | List of "Bruised Peaches" (Max 3) |
| `created_at` | Timestamp | Account creation date |
| `last_active` | Timestamp | Last login time |

## Matches/Interactions Collection
`matches`

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier |
| `user_id_1` | ObjectId | Reference to User |
| `user_id_2` | ObjectId | Reference to User |
| `status` | String | Enum: ['pending', 'matched', 'ripened', 'rejected'] |
| `compatibility_score` | Integer | Calculated percentage (0-100) |
| `ripened_by` | Array<ObjectId> | List of user IDs who paid to ripen this match |
| `created_at` | Timestamp | |

## Transactions Collection
`transactions`

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier |
| `user_id` | ObjectId | Reference to User |
| `amount` | Integer | Number of Pits (Positive for purchase, Negative for spend) |
| `type` | String | Enum: ['bonus', 'purchase', 'ripen_spend'] |
| `reference` | String | Payment gateway reference (if purchase) |
| `created_at` | Timestamp | |
