import React from 'react';
import { Copy, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { hexToRgbString, hexToHslString, getLuminance } from '../utils/colorUtils';

export function ColorCard({ hex, name, isFavorite, onToggleFavorite }) {
  const rgb = hexToRgbString(hex);
  const hsl = hexToHslString(hex);

  const { r, g, b } = (function() {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  })();
  const luminance = getLuminance(r, g, b);
  const textColorClass = luminance > 0.5 ? 'text-gray-900' : 'text-white';

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="glass-panel rounded-3xl overflow-hidden"
    >
      <div 
        className={`h-40 w-full p-5 flex flex-col justify-between relative group cursor-pointer transition-colors`}
        style={{ backgroundColor: hex }}
        onClick={() => handleCopy(hex, 'HEX')}
      >
        <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className={`font-semibold tracking-wide text-sm ${textColorClass} drop-shadow-md`}>{name || 'Color'}</span>
          {onToggleFavorite && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(hex); }}
              className={`p-2 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/40 transition-colors shadow-sm ${textColorClass}`}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center absolute inset-0 ${textColorClass} pointer-events-none drop-shadow-md`}>
          <span className="font-bold text-lg flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
            <Copy size={20} /> Copy
          </span>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center group/item cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => handleCopy(hex, 'HEX')}>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-10 tracking-wider">HEX</span>
          <span className="font-mono font-medium text-sm text-gray-800 dark:text-gray-200">{hex}</span>
          <Copy size={14} className="text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
        </div>
        <div className="flex justify-between items-center group/item cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => handleCopy(rgb, 'RGB')}>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-10 tracking-wider">RGB</span>
          <span className="font-mono font-medium text-sm text-gray-800 dark:text-gray-200">{rgb}</span>
          <Copy size={14} className="text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
        </div>
        <div className="flex justify-between items-center group/item cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => handleCopy(hsl, 'HSL')}>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-10 tracking-wider">HSL</span>
          <span className="font-mono font-medium text-sm text-gray-800 dark:text-gray-200">{hsl}</span>
          <Copy size={14} className="text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  );
}
