import React from 'react';
import { Image as ImageIcon, BarChart3 } from 'lucide-react';

export function PaletteInformation({ imageInfo, paletteInfo }) {
  if (!imageInfo || !paletteInfo) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="glass-panel rounded-3xl p-8 h-full flex flex-col">
        <h3 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100 flex items-center gap-3">
          <BarChart3 size={24} className="text-zinc-800 dark:text-zinc-200" /> Stats
        </h3>
        <div className="space-y-4 mt-auto">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200/80 dark:border-zinc-700/50">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Extracted Colors</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{paletteInfo.extractedCount}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200/80 dark:border-zinc-700/50">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Dominant Weight</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{paletteInfo.dominantPercentage}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200/80 dark:border-zinc-700/50">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Avg Brightness</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{paletteInfo.avgBrightness}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Avg Saturation</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{paletteInfo.avgSaturation}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-8 h-full flex flex-col">
        <h3 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100 flex items-center gap-3">
          <ImageIcon size={24} className="text-zinc-800 dark:text-zinc-200" /> Image
        </h3>
        <div className="space-y-4 mt-auto">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200/80 dark:border-zinc-700/50">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Resolution</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{imageInfo.resolution}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200/80 dark:border-zinc-700/50">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Aspect Ratio</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{imageInfo.aspectRatio}:1</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-zinc-200/80 dark:border-zinc-700/50">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Orientation</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{imageInfo.orientation}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Est. File Size</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{imageInfo.fileSize}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
