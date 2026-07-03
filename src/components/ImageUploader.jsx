import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ImageUploader({ onImageUpload, currentImage }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result, file);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, [processFile]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  return (
    <div
      className={twMerge(
        clsx(
          "relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 ease-in-out group cursor-pointer overflow-hidden backdrop-blur-md shadow-sm",
          isDragging 
            ? "border-zinc-500 bg-zinc-100 dark:bg-zinc-800" 
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white/40 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-800/80"
        )
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInput}
      />
      
      {currentImage ? (
        <div className="absolute inset-0 w-full h-full p-4">
          <img 
            src={currentImage} 
            alt="Uploaded preview" 
            className="w-full h-full object-contain drop-shadow-xl rounded-2xl"
          />
          <div className="absolute inset-4 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white backdrop-blur-sm z-0">
            <div className="flex items-center space-x-3 bg-white/20 px-6 py-3 rounded-xl backdrop-blur-md border border-white/30">
              <UploadCloud size={24} />
              <span className="font-bold tracking-wide">Replace Image</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-8 z-0 pointer-events-none">
          <div className="p-5 bg-white dark:bg-zinc-800 rounded-2xl mb-6 shadow-sm border border-zinc-100 dark:border-zinc-700 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
            <ImageIcon size={40} className="text-zinc-600 dark:text-zinc-300" />
          </div>
          <p className="text-xl font-extrabold text-zinc-800 dark:text-zinc-200 mb-2 tracking-tight">
            Drag & Drop your image here
          </p>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            or click to browse files (PNG, JPG, WebP)
          </p>
        </div>
      )}
    </div>
  );
}
