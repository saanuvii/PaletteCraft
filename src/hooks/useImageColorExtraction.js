import { useState, useCallback } from 'react';
import { rgbToHex, rgbToHsl } from '../utils/colorUtils';

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

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // Limit size to maintain performance while gathering enough pixel data
      const MAX_DIMENSION = 200;
      let scale = 1;
      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
          scale = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height);
      }
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const colorMap = new Map();
      let totalPixels = 0;

      // Group into tighter buckets to find base colors and avoid randomness
      for (let i = 0; i < data.length; i += 16) { 
        if (data[i+3] < 128) continue; // ignore transparent
        
        // Group by 10s to find strong clusters of similar colors
        const r = Math.round(data[i] / 10) * 10;
        const g = Math.round(data[i+1] / 10) * 10;
        const b = Math.round(data[i+2] / 10) * 10;
        
        const rgb = `${r},${g},${b}`;
        colorMap.set(rgb, (colorMap.get(rgb) || 0) + 1);
        totalPixels++;
      }

      const colorScores = [];
      for (const [rgbStr, count] of colorMap.entries()) {
        const [r, g, b] = rgbStr.split(',').map(Number);
        const { h, s, l } = rgbToHsl(r, g, b);
        
        // Only accept colors that have some significance in the image (ignore noise)
        if (count < (totalPixels * 0.005)) continue; 

        // Weigh by count, boost saturated colors slightly so they don't get lost in grays
        let saturationBoost = 1;
        if (s > 20 && l > 10 && l < 90) {
            saturationBoost = 1 + (s / 100);
        }
        
        const score = count * saturationBoost;
        colorScores.push({ r, g, b, h, s, l, count, score });
      }

      // Sort by score
      colorScores.sort((a, b) => b.score - a.score);
      
      const uniqueColors = [];
      
      // Select colors ensuring they are visually distinct (Euclidean distance)
      for (const c of colorScores) {
        let isDistinct = true;
        for (const u of uniqueColors) {
          const diff = Math.sqrt(
            Math.pow(c.r - u.r, 2) + 
            Math.pow(c.g - u.g, 2) + 
            Math.pow(c.b - u.b, 2)
          );
          
          // Require a minimum distance between chosen colors (avoiding similar shades)
          if (diff < 45) {
            isDistinct = false;
            break;
          }
        }
        if (isDistinct) {
          uniqueColors.push(c);
          if (uniqueColors.length >= 8) break; // We want top 8 distinct colors max
        }
      }

      // If we couldn't find 8 distinct colors, relax the constraint
      if (uniqueColors.length < 8) {
          for (const c of colorScores) {
              if (uniqueColors.length >= 8) break;
              if (!uniqueColors.find(u => u.r === c.r && u.g === c.g && u.b === c.b)) {
                  uniqueColors.push(c);
              }
          }
      }

      if (uniqueColors.length === 0) throw new Error("No colors found");

      // Calculate dominant strictly by count
      const byCount = [...colorScores].sort((a, b) => b.count - a.count);
      const dominant = rgbToHex(byCount[0].r, byCount[0].g, byCount[0].b);
      const dominantPercentage = ((byCount[0].count / totalPixels) * 100).toFixed(1) + '%';

      // Sort final palette by luminance
      uniqueColors.sort((a, b) => b.l - a.l);
      const palette = uniqueColors.map(c => rgbToHex(c.r, c.g, c.b));

      const avgS = uniqueColors.reduce((sum, c) => sum + c.s, 0) / uniqueColors.length;
      const avgL = uniqueColors.reduce((sum, c) => sum + c.l, 0) / uniqueColors.length;

      const result = {
        palette, 
        dominant,
        imageInfo: { dimensions, aspectRatio, resolution, fileSize, orientation },
        paletteInfo: {
          extractedCount: palette.length,
          avgBrightness: avgL.toFixed(1) + '%',
          avgSaturation: avgS.toFixed(1) + '%',
          dominantPercentage
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
