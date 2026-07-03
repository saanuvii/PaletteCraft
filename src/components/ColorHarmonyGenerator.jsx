import React, { useState } from 'react';
import { generateHarmonies } from '../utils/colorUtils';
import { Component } from 'lucide-react';
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
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100 flex items-center gap-3">
        <Component size={24} className="text-zinc-800 dark:text-zinc-200" /> Harmony Generator
      </h3>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {Object.keys(harmonies).map(harmony => (
          <button
            key={harmony}
            onClick={() => setActiveHarmony(harmony)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${activeHarmony === harmony ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-md' : 'bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700'}`}
          >
            {harmony.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      <div className="flex h-32 rounded-2xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-800 mt-auto">
        {currentHarmonyColors.map((color, index) => (
          <div
            key={`${color}-${index}`}
            onClick={() => handleCopy(color)}
            className="flex-1 flex flex-col justify-end p-3 cursor-pointer group transition-all duration-300 hover:flex-[1.5]"
            style={{ backgroundColor: color }}
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold py-1.5 px-3 rounded-lg w-max mx-auto mb-2 shadow-lg">
              {color}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-6 text-center">
        Based on dominant color: <span className="font-mono px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-800 dark:text-zinc-200">{dominantColor}</span>
      </p>
    </div>
  );
}
