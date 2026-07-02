import { useState, useCallback } from 'react';
import * as Vibrant from 'node-vibrant';

export function useImageColorExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  const extractColors = useCallback(async (imageSrc, file) => {
    setIsExtracting(true);
    setError(null);
    try {
      // Create an image element to get dimensions
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const dimensions = { width: img.width, height: img.height };
      const aspectRatio = (img.width / img.height).toFixed(2);
      const resolution = `${img.width}x${img.height}`;
      const fileSize = file ? (file.size / 1024).toFixed(2) + ' KB' : 'Unknown';

      const orientation = img.width > img.height ? 'Landscape' : (img.height > img.width ? 'Portrait' : 'Square');

      // Extract colors using node-vibrant
      const v = new Vibrant(imageSrc);
      const palette = await v.getPalette();

      const colors = {
        Vibrant: palette.Vibrant?.hex,
        Muted: palette.Muted?.hex,
        DarkVibrant: palette.DarkVibrant?.hex,
        DarkMuted: palette.DarkMuted?.hex,
        LightVibrant: palette.LightVibrant?.hex,
        LightMuted: palette.LightMuted?.hex,
      };

      // Create a flat list of unique valid hex codes, fallback to empty array
      const allExtracted = Object.values(colors).filter(Boolean);
      const uniqueColors = [...new Set(allExtracted)];

      // Dominant color is usually Vibrant or the most populated one
      const dominant = palette.Vibrant?.hex || uniqueColors[0] || '#000000';

      // Calculate basic stats for the palette info
      // Approximation for "average brightness/saturation" based on the extracted Swatches
      let totalPop = 0;
      let sumL = 0;
      let sumS = 0;

      Object.values(palette).forEach(swatch => {
        if (swatch) {
          totalPop += swatch.population;
          const [, s, l] = swatch.hsl;
          sumS += (s * 100) * swatch.population;
          sumL += (l * 100) * swatch.population;
        }
      });

      const avgBrightness = totalPop > 0 ? (sumL / totalPop).toFixed(1) + '%' : '0%';
      const avgSaturation = totalPop > 0 ? (sumS / totalPop).toFixed(1) + '%' : '0%';

      // Dominant percentage - node-vibrant doesn't give a total image pixel count easily,
      // but we can compare vibrant population to total palette population as a proxy
      const dominantPop = palette.Vibrant ? palette.Vibrant.population : 0;
      const dominantPercentage = totalPop > 0 ? ((dominantPop / totalPop) * 100).toFixed(1) + '%' : '0%';

      const result = {
        colors, // the 6 vibrant categories
        palette: uniqueColors, // flat array of up to 6 colors
        dominant,
        imageInfo: {
          dimensions,
          aspectRatio,
          resolution,
          fileSize,
          orientation,
        },
        paletteInfo: {
          extractedCount: uniqueColors.length,
          avgBrightness,
          avgSaturation,
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
