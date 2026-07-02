// colorUtils.js

export const hexToRgb = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return { r, g, b };
};

export const rgbToHex = (r, g, b) => {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
};

export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

export const hslToRgb = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

export const hexToHslString = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const hexToRgbString = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
};

// Relative luminance for contrast calculation
export const getLuminance = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Contrast ratio
export const getContrastRatio = (color1, color2) => {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export const checkAccessibility = (hex) => {
  const rgb = hexToRgb(hex);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const ratioWhite = getContrastRatio(rgb, white);
  const ratioBlack = getContrastRatio(rgb, black);

  const bestTextColor = ratioWhite > ratioBlack ? '#FFFFFF' : '#000000';
  const bestRatio = Math.max(ratioWhite, ratioBlack);

  return {
    ratio: bestRatio.toFixed(2),
    isAA: bestRatio >= 4.5,
    isAAA: bestRatio >= 7,
    textColor: bestTextColor,
    ratioWhite: ratioWhite.toFixed(2),
    ratioBlack: ratioBlack.toFixed(2)
  };
};

export const generateHarmonies = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const getHexFromHsl = (hue, sat, lit) => {
    const hueNormalized = (hue + 360) % 360;
    const { r: r2, g: g2, b: b2 } = hslToRgb(hueNormalized, sat, lit);
    return rgbToHex(r2, g2, b2);
  };

  return {
    complementary: [hex, getHexFromHsl(h + 180, s, l)],
    analogous: [getHexFromHsl(h - 30, s, l), hex, getHexFromHsl(h + 30, s, l)],
    triadic: [hex, getHexFromHsl(h + 120, s, l), getHexFromHsl(h + 240, s, l)],
    splitComplementary: [hex, getHexFromHsl(h + 150, s, l), getHexFromHsl(h + 210, s, l)],
    monochromatic: [
      getHexFromHsl(h, s, Math.min(l + 30, 100)),
      getHexFromHsl(h, s, Math.min(l + 15, 100)),
      hex,
      getHexFromHsl(h, s, Math.max(l - 15, 0)),
      getHexFromHsl(h, s, Math.max(l - 30, 0))
    ],
    tetradic: [hex, getHexFromHsl(h + 90, s, l), getHexFromHsl(h + 180, s, l), getHexFromHsl(h + 270, s, l)]
  };
};
