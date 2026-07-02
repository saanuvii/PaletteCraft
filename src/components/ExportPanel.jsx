import React, { useState } from 'react';
import { Code,  Image as ImageIcon, FileJson, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  generateCSSVariables,
  generateTailwindConfig,
  generateSCSSVariables,
  generateJSON,
  generateTXT,
  downloadTextFile
} from '../utils/exportUtils';
import html2canvas from 'html2canvas';

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

  const handleDownloadImage = async () => {
    const element = document.getElementById('palette-export-view');
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'palettecraft-export.png';
        link.href = dataUrl;
        link.click();
        toast.success('Downloaded palette image!');
      } catch {
        toast.error('Failed to generate image');
      }
    }
  };

  const handleDownloadFile = (type) => {
    if (type === 'json') {
      downloadTextFile(contentMap.json, 'palette.json', 'application/json');
    } else if (type === 'txt') {
      downloadTextFile(generateTXT(colors), 'palette.txt', 'text/plain');
    } else if (type === 'svg') {
      // Basic SVG generation
      const svgWidth = colors.length * 100;
      let rects = colors.map((c, i) => `<rect x="${i * 100}" y="0" width="100" height="100" fill="${c}" />`).join('');
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} 100" width="${svgWidth}" height="100">${rects}</svg>`;
      downloadTextFile(svgContent, 'palette.svg', 'image/svg+xml');
    }
    toast.success(`Downloaded ${type.toUpperCase()}!`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <Code size={20} /> Export Code & Assets
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 dark:border-gray-700">
            {['css', 'tailwind', 'scss', 'json'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative group">
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-300 overflow-x-auto">
              <code>{contentMap[activeTab]}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="w-full lg:w-64 space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Downloads</h4>
          <button onClick={handleDownloadImage} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400"><ImageIcon size={18} /></div>
            <div>
              <div className="font-medium text-sm text-gray-800 dark:text-gray-200">PNG Image</div>
              <div className="text-xs text-gray-500">Visual layout</div>
            </div>
          </button>
          <button onClick={() => handleDownloadFile('svg')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400"><ImageIcon size={18} /></div>
            <div>
              <div className="font-medium text-sm text-gray-800 dark:text-gray-200">SVG Vector</div>
              <div className="text-xs text-gray-500">Scalable graphics</div>
            </div>
          </button>
          <button onClick={() => handleDownloadFile('json')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all text-left">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-yellow-600 dark:text-yellow-400"><FileJson size={18} /></div>
            <div>
              <div className="font-medium text-sm text-gray-800 dark:text-gray-200">JSON Data</div>
              <div className="text-xs text-gray-500">For developers</div>
            </div>
          </button>
          <button onClick={() => handleDownloadFile('txt')} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-left">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"><FileText size={18} /></div>
            <div>
              <div className="font-medium text-sm text-gray-800 dark:text-gray-200">TXT File</div>
              <div className="text-xs text-gray-500">Simple text list</div>
            </div>
          </button>
        </div>
      </div>

      {/* Hidden element for PNG export */}
      <div className="absolute -left-[9999px] -top-[9999px]">
        <div id="palette-export-view" className="p-8 bg-white flex gap-2 rounded-xl">
          {colors.map(c => (
            <div key={c} className="w-24 flex flex-col gap-2">
              <div className="w-24 h-24 rounded-lg shadow-sm" style={{ backgroundColor: c }}></div>
              <div className="text-center font-mono text-sm">{c}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
