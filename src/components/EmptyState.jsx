import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-gray-800 rounded-full shadow-xl">
          <Palette size={48} className="text-blue-500 dark:text-blue-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Discover Beautiful Colors
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Upload an image to magically extract its color palette, generate harmonies, check accessibility, and export variables.
      </p>
    </motion.div>
  );
}
