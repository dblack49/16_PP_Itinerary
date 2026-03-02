import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

export function PackingList() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(8).fill(false));

  const essentials = [
    "Cowgirl boots 🤠",
    "Pink & Green outfits",
    "AKA letters/paraphernalia",
    "Dancing shoes",
    "Sunglasses",
    "Camera for memories",
    "Sparkly accessories ✨",
    "Comfy walking shoes"
  ];

  const toggleItem = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 via-white to-green-100 rounded-3xl p-8 shadow-xl border-4 border-pink-300 relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-4 right-4 text-yellow-400 animate-pulse">
        <Star className="w-8 h-8 fill-current" />
      </div>
      <div className="absolute bottom-4 left-4 text-green-400 animate-pulse">
        <Heart className="w-8 h-8 fill-current" />
      </div>

      <h3 className="text-3xl text-center mb-6 text-pink-800" style={{ fontFamily: "'Rye', serif" }}>
        What to Pack
      </h3>
      
      <div className="grid md:grid-cols-2 gap-3">
        {essentials.map((item, index) => (
          <button 
            key={index}
            onClick={() => toggleItem(index)}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border-2 border-pink-200 text-left hover:border-pink-400 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                checkedItems[index] 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-pink-400'
              }`}>
                {checkedItems[index] && (
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span className={`${checkedItems[index] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                {item}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
