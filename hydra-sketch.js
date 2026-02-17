// Create canvas element
const canvas = document.createElement('canvas');

// Function to calculate and set proper resolution
function updateCanvasResolution() {
  // Get device pixel ratio (2 on Retina, 1 on standard displays)
  const dpr = window.devicePixelRatio || 1;

  // Get CSS dimensions (viewport size)
  const cssWidth = window.innerWidth;
  const cssHeight = window.innerHeight;

  // Calculate actual pixel dimensions
  const pixelWidth = Math.floor(cssWidth * dpr);
  const pixelHeight = Math.floor(cssHeight * dpr);

  // Set canvas internal resolution (drawing buffer size)
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;

  // CSS size stays at viewport dimensions (handled by CSS)
  // The canvas will scale the high-res buffer down to CSS size

  // Tell Hydra the new resolution
  if (window.hydra) {
    window.hydra.setResolution(pixelWidth, pixelHeight);
  }

  return { pixelWidth, pixelHeight, dpr };
}

// Initialize Hydra with the canvas
const hydra = new Hydra({
  canvas: canvas,
  detectAudio: false,
  width: Math.floor(window.innerWidth * (window.devicePixelRatio || 1)),
  height: Math.floor(window.innerHeight * (window.devicePixelRatio || 1))
});

// Store hydra instance globally for resize handler
window.hydra = hydra;

// Insert canvas at the beginning of body
document.body.insertBefore(canvas, document.body.firstChild);

// Set initial resolution
const initialRes = updateCanvasResolution();
console.log(`Hydra initialized at ${initialRes.pixelWidth}x${initialRes.pixelHeight} (DPR: ${initialRes.dpr})`);

// Handle window resize with debouncing to avoid excessive redraws
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const res = updateCanvasResolution();
    console.log(`Canvas resized to ${res.pixelWidth}x${res.pixelHeight} (DPR: ${res.dpr})`);
  }, 100);
});

// Parallel Arrays
// Cam Mansanarez | @noir_mak

const nsides = [3, 4, 5]
const colors = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
]

let chain = solid(0, 0, 0, 1)

for (let i = 0; i < nsides.length; i++) {
  const c = colors[i]

  const layer =
    shape(nsides[i], 0.5, 0.1)
      .scale(0.5 + i * 0.2)
      .rotate(() => time * 0.2 * (i + 1))
      .color(c[0], c[1], c[2])

  chain = chain.add(layer, 0.6)
}

chain.out(o0)

// Modulate options
src(o0)
  .modulate(o0, 0.3)
  .modulate(o1, [0, 0.5].fast(0.5).smooth(1))
  .scale([1, 1.25].fast(0.25).smooth(0.4))
  .rotate(0.5, -0.3)
  .out(o1)

render(o1)

console.log('Hydra sketch running');
