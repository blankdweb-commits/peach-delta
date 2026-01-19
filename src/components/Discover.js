import React, { useState } from 'react';

const LOCATIONS = [
  "Sapele, Delta State",
  "Warri, Delta State",
  "Asaba, Delta State",
  "Ughelli, Delta State",
  "Agbor, Delta State"
];

const MATCH_TEMPLATE = {
    alias: "Nurse_Peachy99",
    level: "Year 2",
    distance: "1km away",
    compatibility: 95,
    likes: ["Night shifts", "Suya after rounds", "Anatomy study"], // Sweet Peaches
    dislikes: ["8 AM lectures", "Rude preceptors", "PHCN blackouts"], // Bruised Peaches
    imageUrl: "https://via.placeholder.com/150/db2777/ffffff?text=Nurse+Peachy",
    realName: "Chioma Okonjo"
};

const Discover = ({ pits, onRipen, onGoToStore }) => {
  const [isRipened, setIsRipened] = useState(false);

  // Initialize match with a random location from Delta State
  const [match] = useState(() => {
      const randomLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      return { ...MATCH_TEMPLATE, location: randomLocation };
  });

  // Initialize notification content
  const [notification] = useState(() => {
      const dislike = match.dislikes[0];
      const like = match.likes[1]; // "Suya after rounds" matches the original sample context better

      const samples = [
          {
              title: "Sweet like Nectar! 🍯",
              body: `You and ${match.alias} are a ${match.compatibility}% match. You both hate ${dislike} but love ${like}?`
          },
          {
              title: "Shift Partner Alert! 🩺",
              body: `A ${match.compatibility}% match just landed ${match.distance}. They also hate ${dislike}. Ripen the connection now! 🍑`
          },
          {
              title: "Is this your person? 😍",
              body: `You and ${match.alias} have the same 'Sweet Peaches.' Don't let this one stay unripened!`
          }
      ];

      return samples[Math.floor(Math.random() * samples.length)];
  });

  const handleAction = () => {
    if (pits >= 5) {
      const success = onRipen();
      if (success) {
        setIsRipened(true);
      }
    } else {
      onGoToStore();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Discover Peaches 🍑</h2>

        {/* Profile Card */}
        <div className="profile-card" style={{textAlign: 'center'}}>
          <div className="image-container" style={{marginBottom: '15px'}}>
            {isRipened ? (
                <img src={match.imageUrl} alt="Profile" style={{borderRadius: '50%', width: '150px', height: '150px', objectFit: 'cover'}} />
            ) : (
                <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    backgroundColor: '#ddd',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <span style={{fontSize: '40px'}}>🍑</span>
                    <span className="blur-text" style={{marginTop: '10px'}}>Blurred</span>
                </div>
            )}
          </div>

          <h3>{isRipened ? match.realName : match.alias}</h3>
          <p>{match.level} • {match.distance}</p>
          <p>{match.location}</p>

          <div className="tags" style={{textAlign: 'left', marginTop: '20px'}}>
             <div style={{marginBottom: '10px'}}>
                <strong>Sweet Peaches (Likes):</strong>
                <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px'}}>
                    {match.likes.map(like => (
                        <span key={like} style={{backgroundColor: '#fce7f3', padding: '4px 8px', borderRadius: '12px', fontSize: '0.9em'}}>{like}</span>
                    ))}
                </div>
             </div>
             <div>
                <strong>Bruised Peaches (Dislikes):</strong>
                <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px'}}>
                    {match.dislikes.map(dislike => (
                        <span key={dislike} style={{backgroundColor: '#e5e7eb', padding: '4px 8px', borderRadius: '12px', fontSize: '0.9em'}}>{dislike}</span>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Peach Nectar Notification */}
      {match.compatibility >= 90 && !isRipened && (
        <div className="notification" style={{borderLeft: '4px solid #db2777'}}>
          <h3 style={{marginTop: 0}}>{notification.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: notification.body.replace(match.alias, `<strong>${match.alias}</strong>`).replace(`${match.compatibility}%`, `<strong>${match.compatibility}%</strong>`) }} />

          <div className="action-area" style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
             <button
                className="btn btn-primary"
                onClick={handleAction}
             >
                {pits >= 5 ? "Ripen Connection (5 Pits) 🍑" : "Get Pits to Ripen 🛒"}
             </button>

             <p style={{fontSize: '0.8em', color: '#666', margin: 0}}>
                {pits >= 5
                    ? "Use 5 Pits to see your twin! Reveal their photo and real name."
                    : "You need 5 Pits to see this match. Top up at the store!"}
             </p>
          </div>
        </div>
      )}

      {isRipened && (
          <div className="notification" style={{backgroundColor: '#ecfdf5', borderColor: '#10b981', borderLeft: '4px solid #10b981'}}>
              <h3 style={{marginTop: 0}}>Connection Ripened! 💚</h3>
              <p>You can now see {match.realName}'s photo and details. Start a chat!</p>
          </div>
      )}
    </div>
  );
};

export default Discover;
