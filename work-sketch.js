let gridSize = 20; // Size of each square
let cols, rows;
let noiseScale = 0.08; // Controls the smoothness of waves
let timeOffset = 0;
let staticBurst = false;
let burstTimer = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-background');
  cols = ceil(width / gridSize);
  rows = ceil(height / gridSize);
  noStroke();
}

function draw() {
  background(28, 28, 31); // Dark background

  // Occasional static bursts
  if (random(1) < 0.008) {
    staticBurst = true;
    burstTimer = 20;
  }

  if (burstTimer > 0) {
    burstTimer--;
    if (burstTimer === 0) staticBurst = false;
  }

  // Draw undulating pixel grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * gridSize;
      let y = j * gridSize;

      // Create undulating wave pattern using Perlin noise
      let noiseVal = noise(
        i * noiseScale,
        j * noiseScale,
        timeOffset
      );

      // Add second layer of noise for more complex patterns
      let noiseVal2 = noise(
        i * noiseScale * 2 + 100,
        j * noiseScale * 2 + 100,
        timeOffset * 1.5
      );

      // Combine noise values
      let combinedNoise = (noiseVal + noiseVal2 * 0.5) / 1.5;

      // During static burst, add randomness
      if (staticBurst) {
        combinedNoise = random(1);
      }

      // Determine if square should be black or white
      let isWhite = combinedNoise > 0.5;

      // Draw the square
      if (isWhite) {
        fill(255, 255, 255, 200); // White with slight transparency
      } else {
        fill(0, 0, 0, 150); // Black with transparency
      }

      rect(x, y, gridSize, gridSize);

      // Add occasional flicker effect to individual squares
      if (!staticBurst && random(1) < 0.02) {
        fill(random(1) > 0.5 ? 255 : 0);
        rect(x, y, gridSize, gridSize);
      }
    }
  }

  // Increment time for animation
  timeOffset += 0.015;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = ceil(width / gridSize);
  rows = ceil(height / gridSize);
}
