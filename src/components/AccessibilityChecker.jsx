import React from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { checkAccessibility } from '../utils/colorUtils';

export function AccessibilityChecker({ colors }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <Eye size={20} /> Accessibility (Contrast)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colors.slice(0, 6).map(hex => {
          const acc = checkAccessibility(hex);
          return (
            <div key={hex} className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm" style={{ backgroundColor: hex, color: acc.textColor }}>
                <span className="font-bold text-xl">Aa</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="font-mono text-sm font-semibold">{hex}</div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Text color:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: acc.textColor }}></div>
                    <span className="font-mono">{acc.textColor}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${acc.isAA ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {acc.isAA ? <CheckCircle size={12} /> : <XCircle size={12} />} AA
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${acc.isAAA ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {acc.isAAA ? <CheckCircle size={12} /> : <XCircle size={12} />} AAA
                  </span>
                </div>
                <div className="text-xs text-gray-400">Ratio: {acc.ratio}:1</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
