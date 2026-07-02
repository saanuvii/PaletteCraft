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
      // Add to history
      const newEntry = {
        id: Date.now().toString(),
        name: `Palette ${new Date().toLocaleDateString()}`,
        colors: data.palette,
        date: new Date().toISOString(),
        thumbnail: imageSrc
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep last 10
    }
  };

  const toggleFavoritePalette = (paletteToSave) => {
    const exists = favorites.find(f => f.id === paletteToSave.id);
    if (exists) {
      setFavorites(favorites.filter(f => f.id !== paletteToSave.id));
      toast.success("Removed from favorites");
    } else {
      setFavorites([{ ...paletteToSave, id: Date.now().toString() }, ...favorites]);
      toast.success("Saved to favorites");
    }
  };

  const deleteFavorite = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
    toast.success("Deleted from favorites");
  };

  const renameFavorite = (id, newName) => {
    setFavorites(favorites.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const filteredFavorites = favorites.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.colors.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen transition-colors duration-200">
      <Toaster position="bottom-right" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Palette size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              PaletteCraft
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Upload Section */}
        <section className="max-w-3xl mx-auto">
          <ImageUploader onImageUpload={handleImageUpload} currentImage={currentImage} />
          {isExtracting && (
            <div className="mt-4 text-center text-gray-500 flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              Extracting colors...
            </div>
          )}
          {error && <div className="mt-4 text-center text-red-500">{error}</div>}
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
              className="space-y-12"
            >
              {/* Top Bar Actions */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => toggleFavoritePalette({
                    name: `Palette ${new Date().toLocaleDateString()}`,
                    colors: extractedData.palette,
                    date: new Date().toISOString(),
                    thumbnail: currentImage
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium shadow-sm"
                >
                  Save Palette
                </button>
              </div>

              {/* Extracted Colors Grid */}
              <section>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Extracted Palette</h2>
                  <p className="text-gray-500 dark:text-gray-400">The most prominent colors found in your image.</p>
                </div>
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

        {/* Saved & History Section */}
        <section className="pt-12 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Palettes</h2>
              <p className="text-gray-500 dark:text-gray-400">Your favorite extracted color palettes.</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search palettes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No saved palettes yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((fav) => (
                <div key={fav.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    {fav.thumbnail && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                        <img src={fav.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 group">
                        <input
                          type="text"
                          value={fav.name}
                          onChange={(e) => renameFavorite(fav.id, e.target.value)}
                          className="bg-transparent font-semibold text-gray-800 dark:text-gray-100 outline-none focus:border-b border-blue-500 w-full truncate"
                        />
                        <Edit2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500">{new Date(fav.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteFavorite(fav.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex h-12 rounded-lg overflow-hidden shadow-inner">
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

      <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-blue-500" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">PaletteCraft</span>
          </div>
          <p className="text-sm">
            Built with React, Tailwind CSS, Framer Motion & Color Thief (node-vibrant).
          </p>
          <a href="#" className="flex items-center gap-2 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            <GitBranch size={18} /> GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
