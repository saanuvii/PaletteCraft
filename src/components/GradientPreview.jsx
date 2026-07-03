import React, { useState } from 'react';
import { Copy, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export function GradientPreview({ colors }) {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);

  if (!colors || colors.length < 2) return null;

  const stops = colors.slice(0, 3).join(', ');
  const gradientStyle = type === 'linear' 
    ? `linear-gradient(${angle}deg, ${stops})` 
    : `radial-gradient(circle at top right, ${stops})`;

  const cssCode = `background: ${gradientStyle};`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success('Gradient CSS copied!');
  };

  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <Layers size={24} className="text-purple-500" /> Gradient Generator
      </h3>
      
      <div 
        className="w-full flex-1 min-h-[160px] rounded-2xl mb-6 shadow-inner border border-white/20 dark:border-white/5 transition-all duration-500" 
        style={{ background: gradientStyle }}
      ></div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-auto">
        <div className="flex gap-1 bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-xl backdrop-blur-sm w-full sm:w-auto">
          <button 
            onClick={() => setType('linear')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${type === 'linear' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Linear
          </button>
          <button 
            onClick={() => setType('radial')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${type === 'radial' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Radial
          </button>
        </div>

        {type === 'linear' && (
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <input 
              type="range" 
              min="0" max="360" 
              value={angle} 
              onChange={(e) => setAngle(e.target.value)}
              className="flex-1 sm:w-32 accent-purple-500"
            />
            <span className="text-sm font-mono font-medium text-gray-600 dark:text-gray-400 w-12">{angle}°</span>
          </div>
        )}

        <button 
          onClick={copyCode}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl transition-colors text-sm font-bold shadow-md"
        >
          <Copy size={18} /> CSS
        </button>
      </div>
    </div>
  );
}
