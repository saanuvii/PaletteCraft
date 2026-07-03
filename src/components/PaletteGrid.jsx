import React from 'react';
import { ColorCard } from './ColorCard';

export function PaletteGrid({ colors, title }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-4">
      {title && <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {colors.map((hex, i) => (
          <ColorCard key={`${hex}-${i}`} hex={hex} />
        ))}
      </div>
    </div>
  );
}
