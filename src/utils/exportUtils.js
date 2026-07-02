// exportUtils.js

const getNames = (colors) => {
  const names = ['primary', 'secondary', 'accent', 'neutral', 'base', 'info', 'success', 'warning', 'error'];
  return colors.map((c, i) => ({ name: names[i] || `color-${i+1}`, hex: c }));
};

export const generateCSSVariables = (colors) => {
  const namedColors = getNames(colors);
  let css = ':root {\n';
  namedColors.forEach(({ name, hex }) => {
    css += `  --${name}: ${hex};\n`;
  });
  css += '}';
  return css;
};

export const generateTailwindConfig = (colors) => {
  const namedColors = getNames(colors);
  let tw = 'colors: {\n';
  namedColors.forEach(({ name, hex }, index) => {
    tw += `  ${name}: "${hex}"${index < namedColors.length - 1 ? ',' : ''}\n`;
  });
  tw += '}';
  return tw;
};

export const generateSCSSVariables = (colors) => {
  const namedColors = getNames(colors);
  let scss = '';
  namedColors.forEach(({ name, hex }) => {
    scss += `$${name}: ${hex};\n`;
  });
  return scss;
};

export const generateJSON = (colors) => {
  const namedColors = getNames(colors);
  const obj = { palette: {} };
  namedColors.forEach(({ name, hex }) => {
    obj.palette[name] = hex;
  });
  return JSON.stringify(obj, null, 2);
};

export const generateTXT = (colors) => {
  const namedColors = getNames(colors);
  let txt = 'PaletteCraft Export\n\n';
  namedColors.forEach(({ name, hex }) => {
    txt += `${name.toUpperCase()}: ${hex}\n`;
  });
  return txt;
};

export const downloadTextFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
