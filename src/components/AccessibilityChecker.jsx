import React from 'react';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { checkAccessibility } from '../utils/colorUtils';

export function AccessibilityChecker({ colors }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <Eye size={24} className="text-green-500" /> Accessibility
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colors.slice(0, 4).map(hex => {
          const acc = checkAccessibility(hex);
          return (
            <div key={hex} className="glass-card flex gap-5 p-5 rounded-2xl">
              <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center shadow-inner border border-white/20" style={{ backgroundColor: hex, color: acc.textColor }}>
                <span className="font-black text-3xl">Aa</span>
              </div>
              <div className="flex-1 space-y-2.5">
                <div className="font-mono text-sm font-bold tracking-wide">{hex}</div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-500 dark:text-gray-400">Text:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full shadow-sm border border-gray-200 dark:border-gray-600" style={{ backgroundColor: acc.textColor }}></div>
                    <span className="font-mono text-xs">{acc.textColor}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-700/50">
                  <span className={`flex-1 flex justify-center py-1 rounded-lg text-xs font-bold items-center gap-1.5 ${acc.isAA ? 'bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {acc.isAA ? <CheckCircle2 size={14} /> : <XCircle size={14} />} AA
                  </span>
                  <span className={`flex-1 flex justify-center py-1 rounded-lg text-xs font-bold items-center gap-1.5 ${acc.isAAA ? 'bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {acc.isAAA ? <CheckCircle2 size={14} /> : <XCircle size={14} />} AAA
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
