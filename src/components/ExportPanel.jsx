import React, { useState } from 'react';
import { Code, Image as ImageIcon, FileJson, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  generateCSSVariables,
  generateTailwindConfig,
  generateSCSSVariables,
  generateJSON,
  generateTXT,
  downloadTextFile
} from '../utils/exportUtils';

export function ExportPanel({ colors }) {
  const [activeTab, setActiveTab] = useState('css');

  if (!colors || colors.length === 0) return null;

  const contentMap = {
    css: generateCSSVariables(colors),
    tailwind: generateTailwindConfig(colors),
    scss: generateSCSSVariables(colors),
    json: generateJSON(colors),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contentMap[activeTab]);
    toast.success('Copied to clipboard!');
  };

  const handleDownloadImage = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const swatchWidth = 150;
      const swatchHeight = 200;
      const padding = 40;

      canvas.width = (swatchWidth * colors.length) + (padding * 2) + ((colors.length - 1) * 20);
      canvas.height = swatchHeight + (padding * 2);

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw swatches
      colors.forEach((hex, i) => {
        const x = padding + (i * (swatchWidth + 20));
        const y = padding;

        // Color rect
        ctx.fillStyle = hex;
        ctx.beginPath();
        ctx.roundRect(x, y, swatchWidth, swatchHeight - 50, 12);
        ctx.fill();

        // Text
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(hex.toUpperCase(), x + (swatchWidth / 2), y + swatchHeight - 15);
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'palettecraft-export.png';
      link.href = dataUrl;
      link.click();
      toast.success('Downloaded palette image!');
    } catch {
      toast.error('Failed to generate image');
    }
  };

  const handleDownloadFile = (type) => {
    if (type === 'json') {
      downloadTextFile(contentMap.json, 'palette.json', 'application/json');
    } else if (type === 'txt') {
      downloadTextFile(generateTXT(colors), 'palette.txt', 'text/plain');
    } else if (type === 'svg') {
      const svgWidth = colors.length * 100;
      let rects = colors.map((c, i) => `<rect x="${i * 100}" y="0" width="100" height="100" fill="${c}" />`).join('');
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} 100" width="${svgWidth}" height="100">${rects}</svg>`;
      downloadTextFile(svgContent, 'palette.svg', 'image/svg+xml');
    }
    toast.success(`Downloaded ${type.toUpperCase()}!`);
  };

  return (
    <div className="glass-panel rounded-3xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <Code size={24} className="text-blue-500" /> Export Code & Assets
      </h3>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700/50">
            {['css', 'tailwind', 'scss', 'json'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 rounded-t-lg' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative group">
            <pre className="bg-white/50 dark:bg-black/50 p-6 rounded-2xl text-sm font-mono text-gray-800 dark:text-gray-300 overflow-x-auto shadow-inner border border-gray-200/50 dark:border-gray-700/50">
              <code>{contentMap[activeTab]}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors opacity-0 group-hover:opacity-100 font-medium text-sm"
            >
              Copy Code
            </button>
          </div>
        </div>

        <div className="w-full xl:w-72 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Downloads</h4>
          <button onClick={handleDownloadImage} className="w-full group flex items-center gap-4 p-4 rounded-2xl glass-card text-left">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"><ImageIcon size={20} /></div>
            <div>
              <div className="font-bold text-sm text-gray-800 dark:text-gray-100">PNG Image</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">High-res visual layout</div>
            </div>
          </button>
          <button onClick={() => handleDownloadFile('svg')} className="w-full group flex items-center gap-4 p-4 rounded-2xl glass-card text-left">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"><ImageIcon size={20} /></div>
            <div>
              <div className="font-bold text-sm text-gray-800 dark:text-gray-100">SVG Vector</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Scalable graphics</div>
            </div>
          </button>
          <button onClick={() => handleDownloadFile('json')} className="w-full group flex items-center gap-4 p-4 rounded-2xl glass-card text-left">
            <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform"><FileJson size={20} /></div>
            <div>
              <div className="font-bold text-sm text-gray-800 dark:text-gray-100">JSON Data</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">For developers</div>
            </div>
          </button>
          <button onClick={() => handleDownloadFile('txt')} className="w-full group flex items-center gap-4 p-4 rounded-2xl glass-card text-left">
            <div className="p-2.5 bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform"><FileText size={20} /></div>
            <div>
              <div className="font-bold text-sm text-gray-800 dark:text-gray-100">TXT File</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Simple text list</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
