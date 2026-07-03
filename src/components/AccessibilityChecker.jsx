import React from 'react';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { checkAccessibility } from '../utils/colorUtils';

export function AccessibilityChecker({ colors }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100 flex items-center gap-3">
        <Eye size={24} className="text-zinc-800 dark:text-zinc-200" /> Accessibility
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colors.slice(0, 4).map(hex => {
          const acc = checkAccessibility(hex);
          return (
            <div key={hex} className="glass-card flex gap-5 p-5 rounded-2xl">
              <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center shadow-inner border border-zinc-200/20" style={{ backgroundColor: hex, color: acc.textColor }}>
                <span className="font-black text-3xl">Aa</span>
              </div>
              <div className="flex-1 space-y-2.5">
                <div className="font-mono text-sm font-bold tracking-wide text-zinc-800 dark:text-zinc-200">{hex}</div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-zinc-500 dark:text-zinc-400">Text:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-600" style={{ backgroundColor: acc.textColor }}></div>
                    <span className="font-mono text-xs text-zinc-600 dark:text-zinc-300">{acc.textColor}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
                  <span className={`flex-1 flex justify-center py-1 rounded-lg text-xs font-bold items-center gap-1.5 ${acc.isAA ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                    {acc.isAA ? <CheckCircle2 size={14} /> : <XCircle size={14} />} AA
                  </span>
                  <span className={`flex-1 flex justify-center py-1 rounded-lg text-xs font-bold items-center gap-1.5 ${acc.isAAA ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
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
