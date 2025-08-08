import StyleDictionary from 'style-dictionary';
import tinycolor from 'tinycolor2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register a custom format for @theme
StyleDictionary.registerFormat({
  name: 'css/variables-theme',
  format: function ({ dictionary }) {
    return `@theme {
${dictionary.allTokens.map((token) => `  --${token.name}: ${token.value};`).join('\n')}
}`;
  }
});

const projectDir = path.resolve(__dirname, '..');

console.log('Reading base colors...');
const baseColors = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens', 'base-colors.json'), 'utf8'));

console.log('Generating color shades...');
const colorTokens = baseColors.color;
const generatedTokens = { color: {} };

Object.keys(colorTokens).forEach((color) => {
  const shades = {};
  const base = tinycolor(colorTokens[color].value);

  shades['500'] = { value: base.toHslString() };

  for (let i = 1; i < 5; i++) {
    const weight = i * 0.2;
    shades[500 - i * 100] = { value: tinycolor.mix(base, '#ffffff', weight * 100).toHslString() };
  }

  for (let i = 1; i < 5; i++) {
    const weight = i * 0.2;
    shades[500 + i * 100] = { value: tinycolor.mix(base, '#000000', weight * 100).toHslString() };
  }

  generatedTokens.color[color] = shades;
});

console.log('Initializing Style Dictionary...');
const sd = new StyleDictionary({
  tokens: generatedTokens,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: path.join(projectDir, 'src', 'styles'),
      files: [
        {
          destination: 'generated-color-shades.css',
          format: 'css/variables-theme'
        }
      ]
    }
  }
});

console.log('Building platforms...');
await sd.buildAllPlatforms();

console.log('\n======================================');
console.log('\nBuild completed! Check the output folder.\n');
