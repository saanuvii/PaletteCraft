import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center max-w-2xl mx-auto glass-panel rounded-[3rem]"
    >
      <div className="relative w-32 h-32 mb-8 group">
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-zinc-900 rounded-full shadow-xl border border-zinc-100 dark:border-zinc-800">
          <Palette size={48} className="text-zinc-800 dark:text-zinc-200" />
        </div>
      </div>
      <h2 className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100 mb-4 tracking-tight">
        Discover Beautiful Colors
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-lg font-medium leading-relaxed">
        Upload an image to magically extract its color palette, generate harmonies, check accessibility, and export variables.
      </p>
    </motion.div>
  );
}
