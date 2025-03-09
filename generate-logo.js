import { createCanvas } from 'canvas';
import { existsSync, mkdirSync, writeFileSync, copyFileSync } from 'fs';
import { dirname } from 'path';

// Function to draw the Minesweeper logo
function drawMinesweeperLogo(canvas, ctx) {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const gridSize = width / 4;
  
  // Background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
  
  // Grid lines
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = width * 0.004;
  
  // Vertical grid lines
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, height);
    ctx.stroke();
  }
  
  // Horizontal grid lines
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(width, i * gridSize);
    ctx.stroke();
  }
  
  // Mine in the center
  const mineRadius = width * 0.15;
  
  // Mine body
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(centerX, centerY, mineRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Mine spikes
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = width * 0.025;
  
  // Vertical spike
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - mineRadius * 1.5);
  ctx.lineTo(centerX, centerY + mineRadius * 1.5);
  ctx.stroke();
  
  // Horizontal spike
  ctx.beginPath();
  ctx.moveTo(centerX - mineRadius * 1.5, centerY);
  ctx.lineTo(centerX + mineRadius * 1.5, centerY);
  ctx.stroke();
  
  // Diagonal spike (top-left to bottom-right)
  ctx.beginPath();
  ctx.moveTo(centerX - mineRadius, centerY - mineRadius);
  ctx.lineTo(centerX + mineRadius, centerY + mineRadius);
  ctx.stroke();
  
  // Diagonal spike (top-right to bottom-left)
  ctx.beginPath();
  ctx.moveTo(centerX + mineRadius, centerY - mineRadius);
  ctx.lineTo(centerX - mineRadius, centerY + mineRadius);
  ctx.stroke();
  
  // Mine shine (highlight)
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(centerX - mineRadius * 0.3, centerY - mineRadius * 0.3, mineRadius * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  
  // Flag in the top-left cell
  const flagX = gridSize / 2;
  const flagY = gridSize / 2;
  const flagSize = gridSize * 0.3;
  
  // Flag pole
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = width * 0.012;
  ctx.beginPath();
  ctx.moveTo(flagX, flagY - flagSize);
  ctx.lineTo(flagX, flagY + flagSize);
  ctx.stroke();
  
  // Flag cloth
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.moveTo(flagX, flagY - flagSize);
  ctx.lineTo(flagX + flagSize, flagY - flagSize * 0.3);
  ctx.lineTo(flagX, flagY + flagSize * 0.4);
  ctx.closePath();
  ctx.fill();
}

// List of icon sizes to generate
const sizes = [
  { name: 'favicon.png', size: 32 },
  { name: 'src-tauri/icons/32x32.png', size: 32 },
  { name: 'src-tauri/icons/128x128.png', size: 128 },
  { name: 'src-tauri/icons/128x128@2x.png', size: 256 },
  { name: 'src-tauri/icons/icon.png', size: 512 },
  { name: 'src-tauri/icons/Square30x30Logo.png', size: 30 },
  { name: 'src-tauri/icons/Square44x44Logo.png', size: 44 },
  { name: 'src-tauri/icons/Square71x71Logo.png', size: 71 },
  { name: 'src-tauri/icons/Square89x89Logo.png', size: 89 },
  { name: 'src-tauri/icons/Square107x107Logo.png', size: 107 },
  { name: 'src-tauri/icons/Square142x142Logo.png', size: 142 },
  { name: 'src-tauri/icons/Square150x150Logo.png', size: 150 },
  { name: 'src-tauri/icons/Square284x284Logo.png', size: 284 },
  { name: 'src-tauri/icons/Square310x310Logo.png', size: 310 },
  { name: 'src-tauri/icons/StoreLogo.png', size: 50 },
];

// Generate and save PNG files for each size
sizes.forEach(({ name, size }) => {
  console.log(`Generating ${name} (${size}x${size})...`);
  
  // Create canvas with the specified size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw the logo
  drawMinesweeperLogo(canvas, ctx);
  
  // Create necessary directories
  const dir = dirname(name);
  if (dir !== '.' && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(name, buffer);
});

// Create a favicon for the static folder
copyFileSync('src-tauri/icons/32x32.png', 'static/favicon.png');

console.log('All icons generated successfully!');
