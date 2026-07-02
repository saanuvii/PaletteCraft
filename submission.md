# PaletteCraft: Modern Color Palette Extractor

## Implementation Details
Built a modern React + Vite application for extracting color palettes from images using node-vibrant. 
Features include:
- Minimal, premium UI with Glassmorphism and soft shadows.
- Light/Dark mode with `lucide-react` icons.
- Drag & Drop Image Upload with preview.
- Extraction of Vibrant, Muted, and Dominant colors.
- Color Cards with HEX/RGB/HSL values and one-click copy.
- Gradient Generator (Linear/Radial) with CSS export.
- Export to CSS, Tailwind Config, SCSS, JSON, and TXT.
- Accessibility Checker for WCAG AA/AAA compliance against black and white text.
- Color Harmony Generator for complementary, analogous, triadic, etc.
- LocalStorage persistence for Favorites and upload History.
- Downloadable PNG palette export using `html2canvas`.
- Beautiful animations using `framer-motion`.

## Files Modified/Created
- Setup Vite + Tailwind CSS configuration
- `src/utils/colorUtils.js` - Color conversion and harmony utilities
- `src/utils/exportUtils.js` - Code string generators and file downloads
- `src/hooks/useImageColorExtraction.js` - Wrapper for `node-vibrant`
- `src/hooks/useLocalStorage.js` - Helper hook for persisting data
- `src/components/...` - All functional React UI components
- `src/App.jsx` - Main application entry point orchestrating components

Note: Could not automatically deploy to Render via API due to the branch not being present on the remote repository. The code is committed locally and ready for push and manual deployment.
