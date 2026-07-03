import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, GitBranch, Trash2, Search, Edit2 } from 'lucide-react';
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
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const { isExtracting, extractedData, error, extractColors } = useImageColorExtraction();
  
  const [favorites, setFavorites] = useLocalStorage('palettecraft-favorites', []);
  const [, setHistory] = useLocalStorage("palettecraft-history", []);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleImageUpload = async (imageSrc, file) => {
    setCurrentImage(imageSrc);
    const data = await extractColors(imageSrc, file);
    if (data) {
      const newEntry = {
        id: Date.now().toString(),
        name: `Palette ${new Date().toLocaleDateString()}`,
        colors: data.palette,
        date: new Date().toISOString(),
        thumbnail: imageSrc
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 10));
    }
  };

  const toggleFavoritePalette = (paletteToSave) => {
    const exists = favorites.find(f => f.id === paletteToSave.id);
    if (exists) {
      setFavorites(prev => prev.filter(f => f.id !== paletteToSave.id));
      toast.success("Removed from favorites");
    } else {
      setFavorites(prev => [{ ...paletteToSave, id: Date.now().toString() }, ...prev]);
      toast.success("Saved to favorites");
    }
  };

  const deleteFavorite = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    toast.success("Deleted from favorites");
  };

  const renameFavorite = (id, newName) => {
    setFavorites(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const filteredFavorites = favorites.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.colors.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans">
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
        }
      }} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-b border-white/20 dark:border-white/5 rounded-none shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Palette size={24} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
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
              className="mt-6 text-center text-slate-600 dark:text-slate-400 flex items-center justify-center gap-3 font-medium"
            >
              <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              Analyzing pixels & extracting palette...
            </motion.div>
          )}
          {error && <div className="mt-6 text-center text-red-500 font-medium bg-red-50 dark:bg-red-900/20 py-3 rounded-xl">{error}</div>}
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
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-16"
            >
              {/* Top Bar Actions */}
              <div className="flex justify-between items-end border-b border-slate-200/50 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Extracted Palette</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">The dominant and vibrant colors discovered in your image.</p>
                </div>
                <button 
                  onClick={() => toggleFavoritePalette({
                    name: `Palette ${new Date().toLocaleDateString()}`,
                    colors: extractedData.palette,
                    date: new Date().toISOString(),
                    thumbnail: currentImage
                  })}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:scale-105 transition-all font-bold shadow-xl shadow-slate-900/20 dark:shadow-white/10"
                >
                  Save Palette
                </button>
              </div>

              {/* Extracted Colors Grid */}
              <section>
                <PaletteGrid colors={extractedData.palette} />
              </section>

              {/* Data & Analysis */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PaletteInformation imageInfo={extractedData.imageInfo} paletteInfo={extractedData.paletteInfo} />
                <ColorHarmonyGenerator dominantColor={extractedData.dominant} />
              </section>

              {/* Tools & Checking */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        <section className="pt-16 border-t border-slate-200/50 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Saved Palettes</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Your collection of favorite color schemes.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search palettes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-card border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-20 glass-panel border-dashed rounded-3xl">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette size={24} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No saved palettes yet</h3>
              <p className="text-slate-500 dark:text-slate-400">Upload an image and click "Save Palette" to build your collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFavorites.map((fav) => (
                <div key={fav.id} className="glass-panel rounded-3xl p-5 flex flex-col gap-5 hover:shadow-2xl transition-all duration-300 group/card">
                  <div className="flex gap-4 items-center">
                    {fav.thumbnail && (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-inner">
                        <img src={fav.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 group">
                        <input 
                          type="text" 
                          value={fav.name}
                          onChange={(e) => renameFavorite(fav.id, e.target.value)}
                          className="bg-transparent font-bold text-slate-800 dark:text-slate-100 outline-none border-b border-transparent focus:border-indigo-500 w-full truncate transition-colors"
                        />
                        <Edit2 size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">{new Date(fav.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteFavorite(fav.id)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all opacity-0 group-hover/card:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex h-16 rounded-2xl overflow-hidden shadow-inner border border-white/20 dark:border-white/5">
                    {fav.colors.slice(0, 6).map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <footer className="mt-24 py-12 border-t border-slate-200/50 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-6 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
              <Palette size={16} />
            </div>
            <span className="font-bold text-lg text-slate-800 dark:text-slate-200 tracking-tight">PaletteCraft</span>
          </div>
          <p className="text-sm font-medium">
            Built with React, Tailwind CSS V4 & Framer Motion.
          </p>
          <a href="#" className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300">
            <GitBranch size={16} /> GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
