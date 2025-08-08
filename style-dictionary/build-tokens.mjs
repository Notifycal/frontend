/* global console:readonly */

import StyleDictionary from 'style-dictionary';
import tinycolor from 'tinycolor2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseShade = 500;
const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const isColorToken = (token) => token.path[0] === 'color';
const baseCssVariable = (colorName) => `--color-${colorName}`;

const generateSingleColor = (color, isShaded, cssVariableName) => {
  return { value: tinycolor(color).toHslString(), isShaded, cssVariableName };
};

const generateColorShade = (baseColor, colorToMixWith, mixAmount, cssVariableName) => {
  return { value: tinycolor.mix(baseColor, colorToMixWith, mixAmount).toHslString(), isShaded: true, cssVariableName };
};

const generateColorShades = (colorTokens, colorName) => {
  const generateShadedCssVariableName = (colorName, colorShade) => `${baseCssVariable(colorName)}-${colorShade}`;
  const colorData = colorTokens[colorName];
  const base = tinycolor(colorData.value);

  return Object.fromEntries(
    colorShades.map((shade) => {
      const isBase = shade === baseShade;
      const isLight = shade < baseShade;
      const weight = (isLight ? 1 - shade / baseShade : (shade - baseShade) / baseShade) * 100;

      const colorToMixWith = isLight ? '#ffffff' : '#000000';

      if (isBase) {
        return [
          shade,
          generateSingleColor(base.toHslString(), true, generateShadedCssVariableName(colorName, baseShade))
        ];
      } else {
        return [
          shade,
          generateColorShade(base, colorToMixWith, weight, generateShadedCssVariableName(colorName, shade))
        ];
      }
    })
  );
};

// Register a custom format for @theme
StyleDictionary.registerFormat({
  name: 'css/variables-theme',
  format: function ({ dictionary }) {
    const output = dictionary.allTokens
      .filter(isColorToken)
      .map((token) => {
        return `  ${token.original.cssVariableName}: ${token.value};`;
      })
      .join('\n');

    return `/* This file was generated automatically, do not edit it */\n@theme {\n${output}\n}\n`;
  }
});

StyleDictionary.registerFormat({
  name: 'mantine/color-palette',
  format: function ({ dictionary }) {
    const colorsObject = {};

    dictionary.allTokens
      .filter((token) => isColorToken(token) && token.original.isShaded)
      .forEach((token) => {
        const colorName = token.path[1];
        const shade = parseInt(token.path[2], 10);

        if (!colorsObject[colorName]) {
          colorsObject[colorName] = [];
        }
        colorsObject[colorName].push({ shade, value: token.value, cssVariableName: token.original.cssVariableName });
      });

    let output = `/* This file was generated automatically, do not edit it */\n\nimport type { MantineColorsTuple } from '@mantine/core';\n\nexport const colors: Record<string, MantineColorsTuple> = {\n`;
    for (const colorName in colorsObject) {
      colorsObject[colorName].sort((a, b) => a.shade - b.shade);

      const values = colorsObject[colorName].map((s) => `'var(${s.cssVariableName})'`).join(',\n    ');
      output += `  ${colorName}: [\n    ${values}\n  ],\n`;
    }
    output += '};\n\n';

    return output;
  }
});

const projectDirectory = path.resolve(__dirname, '..');

console.log('Reading base colors...');
const baseColors = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens', 'base-colors.json'), 'utf8'));

console.log('Generating color shades...');
const colorTokens = baseColors.color;
const generatedTokens = { color: {} };

Object.keys(colorTokens).forEach((colorName) => {
  const colorData = colorTokens[colorName];
  const isShaded = colorData.generateShades === true; // Determine if shades should be generated

  if (isShaded) {
    generatedTokens.color[colorName] = generateColorShades(colorTokens, colorName);
  } else {
    // Add color directly if generateShades is false or not present
    generatedTokens.color[colorName] = generateSingleColor(colorData.value, false, baseCssVariable(colorName));
  }
});

console.log('Initializing Style Dictionary...');
const sd = new StyleDictionary({
  tokens: generatedTokens,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: path.join(projectDirectory, 'src', 'styles'),
      files: [
        {
          destination: '_generated-color-shades.css',
          format: 'css/variables-theme'
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: path.join(projectDirectory, 'src', 'theme'),
      files: [
        {
          destination: '_generated-colors-mantine.ts',
          format: 'mantine/color-palette'
        }
      ]
    }
  }
});

console.log('Building platforms...');
await sd.buildAllPlatforms();

console.log('\n======================================');
console.log('\nBuild completed! Check the output folder.\n');
