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
      const ctx = canvas.getContext('2d');
      // Scale down for faster processing
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

      for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
        if (data[i+3] < 128) continue; // Skip transparent pixels
        
        // Group by larger color buckets to find dominance
        const r = Math.round(data[i] / 15) * 15;
        const g = Math.round(data[i+1] / 15) * 15;
        const b = Math.round(data[i+2] / 15) * 15;
        
        const rgb = `${r},${g},${b}`;
        colorMap.set(rgb, (colorMap.get(rgb) || 0) + 1);
        totalPixels++;
      }

      // Score colors based on frequency AND saturation (favor vibrant colors)
      const colorScores = [];
      for (const [rgbStr, count] of colorMap.entries()) {
        const [r, g, b] = rgbStr.split(',').map(Number);
        const { h, s, l } = rgbToHsl(r, g, b);
        
        // Score: count * (1 + saturation_weight)
        const score = count * (1 + (s / 100) * 2);
        colorScores.push({ r, g, b, h, s, l, count, score });
      }

      // Sort by custom score to get the best colors
      colorScores.sort((a, b) => b.score - a.score);
      
      // Filter out overly similar colors
      const uniqueColors = [];
      for (const c of colorScores) {
        let isSimilar = false;
        for (const u of uniqueColors) {
          const diff = Math.abs(c.r - u.r) + Math.abs(c.g - u.g) + Math.abs(c.b - u.b);
          if (diff < 60) {
            isSimilar = true;
            break;
          }
        }
        if (!isSimilar) {
          uniqueColors.push(c);
          if (uniqueColors.length >= 8) break;
        }
      }

      if (uniqueColors.length === 0) throw new Error("No colors found");

      const palette = uniqueColors.map(c => rgbToHex(c.r, c.g, c.b));
      
      // The absolute most frequent color
      colorScores.sort((a, b) => b.count - a.count);
      const dominant = rgbToHex(colorScores[0].r, colorScores[0].g, colorScores[0].b);
      const dominantPercentage = ((colorScores[0].count / totalPixels) * 100).toFixed(1) + '%';

      // Categorize colors
      let vibrantColor = null, mutedColor = null, darkVibrant = null, lightVibrant = null;
      let highestS = -1, lowestS = 101, highestL_S = -1, lowestL_S = -1;

      uniqueColors.forEach(c => {
        // Most vibrant
        if (c.s > highestS && c.l >= 30 && c.l <= 70) { highestS = c.s; vibrantColor = c; }
        // Most muted
        if (c.s < lowestS && c.l >= 20 && c.l <= 80) { lowestS = c.s; mutedColor = c; }
        // Light vibrant
        if (c.l > 65 && c.s > highestL_S) { highestL_S = c.s; lightVibrant = c; }
        // Dark vibrant
        if (c.l < 35 && c.s > lowestL_S) { lowestL_S = c.s; darkVibrant = c; }
      });

      const colors = {
        Vibrant: vibrantColor ? rgbToHex(vibrantColor.r, vibrantColor.g, vibrantColor.b) : dominant,
        Muted: mutedColor ? rgbToHex(mutedColor.r, mutedColor.g, mutedColor.b) : dominant,
        DarkVibrant: darkVibrant ? rgbToHex(darkVibrant.r, darkVibrant.g, darkVibrant.b) : palette[1] || dominant,
        DarkMuted: palette[3] || dominant,
        LightVibrant: lightVibrant ? rgbToHex(lightVibrant.r, lightVibrant.g, lightVibrant.b) : palette[2] || dominant,
        LightMuted: palette[4] || dominant,
      };

      const avgS = uniqueColors.reduce((sum, c) => sum + c.s, 0) / uniqueColors.length;
      const avgL = uniqueColors.reduce((sum, c) => sum + c.l, 0) / uniqueColors.length;

      const result = {
        colors, 
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
