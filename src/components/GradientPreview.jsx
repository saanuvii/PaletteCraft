import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export function GradientPreview({ colors }) {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(90);

  if (!colors || colors.length < 2) return null;

  const stops = colors.slice(0, 3).join(', '); // Use up to 3 colors for the gradient
  const gradientStyle = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stops})`
    : `radial-gradient(circle, ${stops})`;

  const cssCode = `background: ${gradientStyle};`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success('CSS copied to clipboard!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Gradient Generator</h3>

      <div
        className="w-full h-40 rounded-xl mb-4 transition-all duration-300"
        style={{ background: gradientStyle }}
      ></div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
          <button
            onClick={() => setType('linear')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${type === 'linear' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Linear
          </button>
          <button
            onClick={() => setType('radial')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${type === 'radial' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Radial
          </button>
        </div>

        {type === 'linear' && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-500">Angle:</label>
            <input
              type="range"
              min="0" max="360"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-32"
            />
            <span className="text-sm font-mono w-10">{angle}°</span>
          </div>
        )}

        <button
          onClick={copyCode}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Copy size={16} /> Copy CSS
        </button>
      </div>
    </div>
  );
}
