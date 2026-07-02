import React from 'react';
import { Copy, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { hexToRgbString, hexToHslString, getLuminance } from '../utils/colorUtils';

export function ColorCard({ hex, name, isFavorite, onToggleFavorite }) {
  const rgb = hexToRgbString(hex);
  const hsl = hexToHslString(hex);

  // Determine text color based on background luminance for the color preview area
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
    >
      <div 
        className={`h-32 w-full p-4 flex flex-col justify-between relative group cursor-pointer`}
        style={{ backgroundColor: hex }}
        onClick={() => handleCopy(hex, 'HEX')}
      >
        <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
          <span className={`font-mono text-sm font-medium ${textColorClass}`}>{name || 'Color'}</span>
          {onToggleFavorite && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(hex); }}
              className={`p-1.5 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/40 transition-colors ${textColorClass}`}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center absolute inset-0 ${textColorClass} pointer-events-none`}>
          <span className="font-semibold text-lg flex items-center gap-2">
            <Copy size={18} /> Copy HEX
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center group/item cursor-pointer" onClick={() => handleCopy(hex, 'HEX')}>
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-8">HEX</span>
          <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{hex}</span>
          <Copy size={14} className="text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
        </div>
        <div className="flex justify-between items-center group/item cursor-pointer" onClick={() => handleCopy(rgb, 'RGB')}>
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-8">RGB</span>
          <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{rgb}</span>
          <Copy size={14} className="text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
        </div>
        <div className="flex justify-between items-center group/item cursor-pointer" onClick={() => handleCopy(hsl, 'HSL')}>
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-8">HSL</span>
          <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{hsl}</span>
          <Copy size={14} className="text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  );
}
