import React from 'react';

const PitStore = ({ onBack, onPurchase }) => {
  const packs = [
    { name: 'Intern Pack', pits: 20, price: 500 },
    { name: 'Resident Pack', pits: 50, price: 1000 },
    { name: 'Chief Matron Pack', pits: 150, price: 2500 },
  ];

  return (
    <div className="p-4 bg-orange-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">Peach Pit Store 🍑</h1>
      <p className="mb-6">Refill your pits to keep ripening connections!</p>

      <div className="grid gap-4">
        {packs.map((pack) => (
          <div key={pack.name} className="border p-4 rounded shadow bg-white flex justify-between items-center">
            <div>
              <h2 className="font-bold">{pack.name}</h2>
              <p className="text-sm text-gray-600">{pack.pits} Pits</p>
            </div>
            <button
              onClick={() => onPurchase(pack.pits)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Buy for N{pack.price}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-8 text-gray-500 underline"
      >
        &larr; Back to Discover
      </button>
    </div>
  );
};

export default PitStore;
