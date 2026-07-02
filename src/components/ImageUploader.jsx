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
          "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out group cursor-pointer overflow-hidden",
          isDragging 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
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
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={currentImage} 
            alt="Uploaded preview" 
            className="w-full h-full object-contain p-2"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm z-0">
            <div className="flex items-center space-x-2">
              <UploadCloud size={24} />
              <span className="font-medium">Replace Image</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center p-6 z-0 pointer-events-none">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <ImageIcon size={32} className="text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Drag & Drop your image here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or click to browse files (PNG, JPG, WebP)
          </p>
        </div>
      )}
    </div>
  );
}
