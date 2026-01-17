# Peach - System Design & Strategy

## 1. Database Design (Schema)

### User Profile (`users` collection)
```json
{
  "_id": "ObjectId",
  "email": "nurse.joy@example.com",
  "emailVerified": true,
  "alias": "Nurse_Peachy99",
  "level": "Year 2", // Enum: ['Intern', 'Year 1', 'Year 2', 'Year 3']
  "geolocation": {
    "lat": 5.8904,
    "lng": 5.6800,
    "city": "Sapele", // or Warri, Asaba, etc.
    "state": "Delta",
    "lastUpdated": "2023-10-27T10:00:00Z"
  },
  "pits": 25, // Wallet balance
  "likes": [ // "Sweet Peaches" (Max 3)
    "Night shifts",
    "Suya after rounds",
    "Pediatric ward"
  ],
  "dislikes": [ // "Bruised Peaches" (Max 3)
    "8 AM lectures",
    "Rude preceptors",
    "PHCN blackouts"
  ],
  "matches": [
    {
      "userId": "ObjectId",
      "status": "ripened", // 'unripened', 'ripened', 'rejected'
      "compatibilityScore": 95,
      "timestamp": "2023-10-27T10:05:00Z"
    }
  ],
  "createdAt": "2023-10-26T09:00:00Z"
}
```

## 2. UI Flow: Peach Nectar & Ripen

### "Peach Nectar" Notification
*   **Trigger**: When a potential match within 5km (or Delta State region) has >= 90% compatibility based on Likes/Dislikes.
*   **Visual**: A high-energy modal or overlay with a pulsating peach icon and honey/nectar animations.
*   **Copy**: "Sweet like Nectar! 🍯 You and [Alias] are a 95% match. You both hate 8 AM lectures but love Suya?"
*   **Action**: A prominent button.
    *   **Logic**:
        *   If `user.pits >= 5`: Button says "Ripen Now (-5 Pits)". Click -> Deducts Pits, Reveals Photo/Name.
        *   If `user.pits < 5`: Button says "Get Pits to Ripen". Click -> Redirects to Pit Store.

## 3. Launch Content: Sapele-Style Email Templates

### Welcome Email
**Subject**: You’ve Landed in the Peach Orchard! 🍑
**Body**:
"How far, Nurse_Peachy99!

Welcome to Peach, the only place where Sapele nurses can vibe without stress. We know the ward is tough, so we’ve credited **25 Free Pits** to your account.

No be cho cho cho. Use them to 'Ripen' connections that make sense.
See someone who also hates 8 AM lectures? That's your person.

Go verify your alias and start matching!

Stay Sweet,
The Peach Team"

### Pit Refill Confirmation
**Subject**: Account Credited! More Pits, More Vibe. 🔋
**Body**:
"Oga/Madam!

Your account has been topped up with **20 Pits**. Matches are waiting, and 'Peach Nectar' alerts are flying left and right.

Don't dull yourself. If you see a match that makes sense, Ripen am immediately.

Thanks for keeping the community sweet!

- Peach Payments"

### Match Alert
**Subject**: Sweet like Nectar! 🍯 You have a 95% Match!
**Body**:
"Nurse_Peachy99, look sharp!

We found someone near Sapele Hospital who matches your vibe 95%.
They like 'Suya after rounds' and dislike 'Rude preceptors' just like you.

This kind of compatibility is rare like steady light.
Login now to check them out before someone else does!

[Ripen Connection Now]

- Peach Algorithm"

## 4. Monetization Strategy: Pit Pricing (Sapele Student Budget)

*   **The "Intern" Pack (Starter)**: N500 for 20 Pits (N25/Pit). Good for 4 reveals.
    *   *Psychology*: Low barrier to entry, equivalent to a snack price.
*   **The "Resident" Pack (Value)**: N1,000 for 50 Pits (N20/Pit). Good for 10 reveals.
    *   *Psychology*: "Double the price, more than double the pits."
*   **The "Chief Matron" Pack (Bulk)**: N2,500 for 150 Pits (N16/Pit). Good for 30 reveals.
    *   *Psychology*: Best value for power users.

**Payment Gateways**: Paystack & Flutterwave (Seamless localized payments).
