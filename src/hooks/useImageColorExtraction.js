import { useState, useCallback } from 'react';
import { rgbToHex } from '../utils/colorUtils';

export function useImageColorExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  const extractColors = useCallback(async (imageSrc, file) => {
    setIsExtracting(true);
    setError(null);
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageSrc;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const dimensions = { width: img.width, height: img.height };
      const aspectRatio = (img.width / img.height).toFixed(2);
      const resolution = `${img.width}x${img.height}`;
      const fileSize = file ? (file.size / 1024).toFixed(2) + ' KB' : 'Unknown';
      
      const orientation = img.width > img.height ? 'Landscape' : (img.height > img.width ? 'Portrait' : 'Square');

      // Due to dependency issues with color extractors, let's just use canvas directly
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple color quantization (very basic)
      const colorCounts = {};
      for (let i = 0; i < data.length; i += 4 * 10) { // Sample every 10th pixel for performance
        const r = Math.round(data[i] / 10) * 10;
        const g = Math.round(data[i+1] / 10) * 10;
        const b = Math.round(data[i+2] / 10) * 10;
        const rgb = `${r},${g},${b}`;
        colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
      }

      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([rgbStr]) => {
          const [r, g, b] = rgbStr.split(',').map(Number);
          return rgbToHex(r, g, b);
        });

      const dominant = sortedColors[0] || '#000000';
      const palette = sortedColors;

      const colors = {
        Vibrant: palette[0] || dominant,
        Muted: palette[1] || dominant,
        DarkVibrant: palette[2] || dominant,
        DarkMuted: palette[3] || dominant,
        LightVibrant: palette[4] || dominant,
        LightMuted: palette[5] || dominant,
      };

      const result = {
        colors, 
        palette, 
        dominant,
        imageInfo: {
          dimensions,
          aspectRatio,
          resolution,
          fileSize,
          orientation,
        },
        paletteInfo: {
          extractedCount: palette.length,
          avgBrightness: 'N/A',
          avgSaturation: 'N/A',
          dominantPercentage: 'N/A'
        }
      };
      
      setExtractedData(result);
      return result;
    } catch (err) {
      console.error("Extraction error:", err);
      setError("Failed to extract colors from the image.");
      setExtractedData(null);
      return null;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  return { isExtracting, extractedData, error, extractColors };
}
