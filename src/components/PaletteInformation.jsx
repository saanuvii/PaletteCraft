import React from 'react';
import { Image as ImageIcon, BarChart2 } from 'lucide-react';

export function PaletteInformation({ imageInfo, paletteInfo }) {
  if (!imageInfo || !paletteInfo) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <BarChart2 size={18} /> Palette Stats
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Extracted Colors</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{paletteInfo.extractedCount}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Dominant Weight</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{paletteInfo.dominantPercentage}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Avg Brightness</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{paletteInfo.avgBrightness}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Avg Saturation</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{paletteInfo.avgSaturation}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <ImageIcon size={18} /> Image Analysis
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Resolution</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{imageInfo.resolution}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Aspect Ratio</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{imageInfo.aspectRatio}:1</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Orientation</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{imageInfo.orientation}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Est. File Size</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{imageInfo.fileSize}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
