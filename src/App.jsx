import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Trash2, Search, Edit2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { ThemeToggle } from './components/ThemeToggle';
import { ImageUploader } from './components/ImageUploader';
import { EmptyState } from './components/EmptyState';
import { PaletteGrid } from './components/PaletteGrid';
import { GradientPreview } from './components/GradientPreview';
import { ExportPanel } from './components/ExportPanel';
import { AccessibilityChecker } from './components/AccessibilityChecker';
import { ColorHarmonyGenerator } from './components/ColorHarmonyGenerator';
import { PaletteInformation } from './components/PaletteInformation';

import { useImageColorExtraction } from './hooks/useImageColorExtraction';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const { isExtracting, extractedData, error, extractColors } = useImageColorExtraction();
  
  // Robust LocalStorage initialization
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('palettecraft-favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Persist to local storage whenever favorites change
  useEffect(() => {
    localStorage.setItem('palettecraft-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const handleImageUpload = async (imageSrc, file) => {
    setCurrentImage(imageSrc);
    await extractColors(imageSrc, file);
  };

  const saveCurrentPalette = () => {
    if (!extractedData) return;
    const newEntry = {
      id: Date.now().toString(),
      name: `Palette ${new Date().toLocaleDateString()}`,
      colors: extractedData.palette,
      date: new Date().toISOString(),
      thumbnail: currentImage
    };
    
    setFavorites(prev => [newEntry, ...prev]);
    toast.success("Saved to your palettes");
  };

  const deleteFavorite = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    toast.success("Palette removed");
  };

  const renameFavorite = (id, newName) => {
    setFavorites(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const filteredFavorites = favorites.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.colors.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#18181b',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }
      }} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
              <Palette size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              PaletteCraft
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Upload Section */}
        <section className="max-w-4xl mx-auto">
          <ImageUploader onImageUpload={handleImageUpload} currentImage={currentImage} />
          {isExtracting && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-3 text-sm font-medium"
            >
              <div className="w-4 h-4 rounded-full border-2 border-zinc-800 dark:border-zinc-200 border-t-transparent animate-spin"></div>
              Extracting colors...
            </motion.div>
          )}
          {error && <div className="mt-6 text-center text-red-500 font-medium text-sm">{error}</div>}
        </section>

        <AnimatePresence mode="wait">
          {!extractedData && !isExtracting ? (
            <EmptyState key="empty" />
          ) : extractedData && !isExtracting ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-12"
            >
              {/* Top Bar Actions */}
              <div className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Extracted Palette</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Colors discovered in your image.</p>
                </div>
                <button 
                  onClick={saveCurrentPalette}
                  className="flex items-center gap-2 px-5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg transition-colors text-sm font-semibold shadow-sm"
                >
                  <CheckCircle2 size={16} /> Save Palette
                </button>
              </div>

              {/* Extracted Colors Grid */}
              <section>
                <PaletteGrid colors={extractedData.palette} />
              </section>

              {/* Data & Analysis */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PaletteInformation imageInfo={extractedData.imageInfo} paletteInfo={extractedData.paletteInfo} />
                <ColorHarmonyGenerator dominantColor={extractedData.dominant} />
              </section>

              {/* Tools & Checking */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccessibilityChecker colors={extractedData.palette} />
                <GradientPreview colors={extractedData.palette} />
              </section>

              {/* Export */}
              <section>
                <ExportPanel colors={extractedData.palette} />
              </section>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Saved Palettes Section */}
        <section className="pt-16 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Saved Palettes</h2>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search palettes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 text-sm"
              />
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">No saved palettes yet. Extract colors and save them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((fav) => (
                <div key={fav.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 flex flex-col gap-4 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group/card">
                  <div className="flex gap-4 items-center">
                    {fav.thumbnail && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
                        <img src={fav.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 group">
                        <input 
                          type="text" 
                          value={fav.name}
                          onChange={(e) => renameFavorite(fav.id, e.target.value)}
                          className="bg-transparent font-semibold text-zinc-800 dark:text-zinc-100 outline-none border-b border-transparent focus:border-zinc-300 dark:focus:border-zinc-600 w-full truncate text-sm"
                        />
                        <Edit2 size={12} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{new Date(fav.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteFavorite(fav.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover/card:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex h-12 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800">
                    {fav.colors.slice(0, 6).map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Added some padding to the bottom since footer is gone */}
        <div className="pb-12"></div>
      </main>
    </div>
  );
}

export default App;
