import React, { useState } from 'react';
import Discover from './components/Discover';
import PitStore from './components/PitStore';

function App() {
  const [pits, setPits] = useState(2); // Starting with 2 to test insufficient funds initially

  const [view, setView] = useState('discover'); // 'discover' or 'store'

  const handleBuyPits = (amount) => {
    setPits(prev => prev + amount);
    alert(`Sweet! Added ${amount} Pits. New Balance: ${pits + amount}`);
    setView('discover');
  };

  const handleRipen = () => {
    if (pits >= 5) {
      setPits(prev => prev - 5);
      return true; // Success
    } else {
      return false; // Insufficient funds
    }
  };

  const navigateToStore = () => {
      setView('store');
  }

  return (
    <div className="App">
       <header style={{textAlign: 'center', padding: '10px', backgroundColor: '#db2777', color: 'white'}}>
           <h1>Peach Delta 🍑</h1>
           <p>Anonymous Nursing Community in Delta State</p>
           <div style={{fontWeight: 'bold'}}>Balance: {pits} Pits</div>
       </header>

       {view === 'discover' && (
           <Discover
               pits={pits}
               onRipen={handleRipen}
               onGoToStore={navigateToStore}
           />
       )}

       {view === 'store' && (
           <PitStore
               onBuy={handleBuyPits}
               onBack={() => setView('discover')}
           />
       )}
    </div>
  );
}

export default App;
