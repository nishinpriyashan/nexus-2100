import * as THREE from 'three';

const textureCache = {};

/**
 * Creates a procedural canvas texture for futuristic skyscraper window grids (cached).
 */
export function createBuildingTexture(isDark = true) {
  const cacheKey = `facade_${isDark ? 'dark' : 'light'}`;
  if (textureCache[cacheKey]) return textureCache[cacheKey];

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Background facade
  ctx.fillStyle = isDark ? '#061322' : '#DCE5F2';
  ctx.fillRect(0, 0, 256, 256);

  // Vertical structural columns
  ctx.fillStyle = isDark ? '#0A1E36' : '#C5D4E8';
  for (let x = 0; x < 256; x += 16) {
    ctx.fillRect(x, 0, 2, 256);
  }

  // Horizontal floor dividers
  ctx.fillStyle = isDark ? '#08172A' : '#CBD8EC';
  for (let y = 0; y < 256; y += 8) {
    ctx.fillRect(0, y, 256, 1);
  }

  // Window grid pixels
  const rows = 32;
  const cols = 16;
  const wWidth = 10;
  const wHeight = 4;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * 16 + 3;
      const y = r * 8 + 2;
      const rand = Math.random();

      if (rand > 0.45) {
        if (rand > 0.94) {
          ctx.fillStyle = isDark ? '#39E7FF' : '#0099CC';
        } else if (rand > 0.88) {
          ctx.fillStyle = isDark ? '#8B5CFF' : '#7C3AED';
        } else if (rand > 0.82) {
          ctx.fillStyle = '#FFC86B';
        } else {
          ctx.fillStyle = isDark ? '#A6E5FF' : '#4E87C6';
        }
        ctx.fillRect(x, y, wWidth, wHeight);
      } else {
        ctx.fillStyle = isDark ? '#030A14' : '#EAF0F8';
        ctx.fillRect(x, y, wWidth, wHeight);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 8);
  textureCache[cacheKey] = texture;
  return texture;
}

/**
 * Creates an emissive-only canvas map for glowing window grids (cached).
 */
export function createEmissiveBuildingTexture() {
  const cacheKey = 'emissive';
  if (textureCache[cacheKey]) return textureCache[cacheKey];

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 256, 256);

  const rows = 32;
  const cols = 16;
  const wWidth = 10;
  const wHeight = 4;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * 16 + 3;
      const y = r * 8 + 2;
      const rand = Math.random();

      if (rand > 0.45) {
        if (rand > 0.94) {
          ctx.fillStyle = '#39E7FF';
        } else if (rand > 0.88) {
          ctx.fillStyle = '#8B5CFF';
        } else if (rand > 0.82) {
          ctx.fillStyle = '#FFC86B';
        } else {
          ctx.fillStyle = '#68BBE3';
        }
        ctx.fillRect(x, y, wWidth, wHeight);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 8);
  textureCache[cacheKey] = texture;
  return texture;
}

