import React, { useState } from 'react';
import { generateHarmonies } from '../utils/colorUtils';
import { Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export function ColorHarmonyGenerator({ dominantColor }) {
  const [activeHarmony, setActiveHarmony] = useState('complementary');
  
  if (!dominantColor) return null;

  const harmonies = generateHarmonies(dominantColor);
  const currentHarmonyColors = harmonies[activeHarmony];

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <Layers size={20} /> Harmony Generator
      </h3>
      
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
        {Object.keys(harmonies).map(harmony => (
          <button
            key={harmony}
            onClick={() => setActiveHarmony(harmony)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeHarmony === harmony ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
          >
            {harmony.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      <div className="flex h-32 rounded-xl overflow-hidden shadow-sm">
        {currentHarmonyColors.map((color, index) => (
          <div 
            key={`${color}-${index}`}
            onClick={() => handleCopy(color)}
            className="flex-1 flex flex-col justify-end p-3 cursor-pointer group transition-all hover:flex-[1.5]"
            style={{ backgroundColor: color }}
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm text-white text-xs font-mono py-1 px-2 rounded w-max mx-auto mb-2">
              {color}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Based on dominant color: <span className="font-mono font-medium">{dominantColor}</span>
      </p>
    </div>
  );
}
