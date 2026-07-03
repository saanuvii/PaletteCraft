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
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-white/50 dark:border-white/10">
          <Palette size={48} className="text-indigo-500 dark:text-indigo-400" />
        </div>
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
        Discover Beautiful Colors
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg font-medium leading-relaxed">
        Upload an image to magically extract its color palette, generate harmonies, check accessibility, and export variables.
      </p>
    </motion.div>
  );
}
