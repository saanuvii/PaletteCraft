import React from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to PaletteCraft</h1>
      <p className="text-gray-600 dark:text-gray-400">Extract beautiful color palettes from images.</p>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
