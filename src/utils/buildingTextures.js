import * as THREE from 'three';

/**
 * Creates a procedural canvas texture for futuristic skyscraper window grids.
 */
export function createBuildingTexture(isDark = true) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background facade
  ctx.fillStyle = isDark ? '#061322' : '#DCE5F2';
  ctx.fillRect(0, 0, 512, 512);

  // Vertical structural columns
  ctx.fillStyle = isDark ? '#0A1E36' : '#C5D4E8';
  for (let x = 0; x < 512; x += 32) {
    ctx.fillRect(x, 0, 4, 512);
  }

  // Horizontal floor dividers
  ctx.fillStyle = isDark ? '#08172A' : '#CBD8EC';
  for (let y = 0; y < 512; y += 16) {
    ctx.fillRect(0, y, 512, 2);
  }

  // Window grid pixels
  const rows = 32;
  const cols = 16;
  const wWidth = 18;
  const wHeight = 8;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * 32 + 6;
      const y = r * 16 + 4;
      const rand = Math.random();

      if (rand > 0.45) {
        // Lit window
        if (rand > 0.94) {
          ctx.fillStyle = isDark ? '#39E7FF' : '#0099CC'; // Cyan accent
        } else if (rand > 0.88) {
          ctx.fillStyle = isDark ? '#8B5CFF' : '#7C3AED'; // Violet AI accent
        } else if (rand > 0.82) {
          ctx.fillStyle = '#FFC86B'; // Warm amber window
        } else {
          ctx.fillStyle = isDark ? '#A6E5FF' : '#4E87C6'; // Standard window light
        }
        ctx.fillRect(x, y, wWidth, wHeight);
      } else {
        // Unlit/reflective window
        ctx.fillStyle = isDark ? '#030A14' : '#EAF0F8';
        ctx.fillRect(x, y, wWidth, wHeight);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 8);
  return texture;
}

/**
 * Creates an emissive-only canvas map for glowing window grids.
 */
export function createEmissiveBuildingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 32;
  const cols = 16;
  const wWidth = 18;
  const wHeight = 8;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * 32 + 6;
      const y = r * 16 + 4;
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
  return texture;
}
