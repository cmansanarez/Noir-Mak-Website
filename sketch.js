let phrase = "Noir Mak";
let numLines = 6;
let baseSize = 60;

// Glitch effect settings
let glitchToggle = false; // for mobile tap
const CHAR_FLIP_PROBABILITY = 0.06;
const ECHO_PROBABILITY = 0.08;
const COLOR_FLASH_PROBABILITY = 0.12;
const GLITCH_CHARS = ["#", "%", "█", "░", "▓", "/", "\\", "_", "x", "*"];

// Color palette
const BLUE = [48, 79, 254];        // #304ffe
const PINK = [255, 29, 137];       // #ff1d89
const YELLOW = [255, 236, 0];      // #ffec00
const CHARTREUSE = [188, 248, 4];  // #bcf804

function setup() {
  // Calculate available height dynamically based on actual header/footer heights
  let canvas = createCanvas(windowWidth, calculateCanvasHeight());
  canvas.parent('canvas-container');
  textAlign(LEFT, CENTER);
  textFont("monospace");
  noStroke();
}

function calculateCanvasHeight() {
  // Get actual heights of header, social links, and footer elements
  let header = document.querySelector('header');
  let socialLinks = document.querySelector('.social-links');
  let footer = document.querySelector('footer');
  let headerHeight = header ? header.offsetHeight : 60;
  let socialHeight = socialLinks ? socialLinks.offsetHeight : 80;
  let footerHeight = footer ? footer.offsetHeight : 60;

  // Add larger buffer for safety to ensure footer is visible
  let buffer = 30;
  let availableHeight = windowHeight - headerHeight - socialHeight - footerHeight - buffer;

  // Ensure minimum height
  return max(availableHeight, 200);
}

function draw() {
  background(0);

  let t = millis() * 0.002; // controls animation speed

  // Adjust base size for mobile screens
  let responsiveBaseSize = width < 480 ? 40 : (width < 768 ? 50 : baseSize);

  // --- measure total stacked height (for vertical centering) ---
  let totalHeight = 0;
  let sizes = [];
  for (let i = 0; i < numLines; i++) {
    let fs = responsiveBaseSize * pow(0.85, i);
    sizes.push(fs);
    totalHeight += fs * 1.2;
  }
  let startY = height / 2 - totalHeight / 2;

  // --- measure widest line width (for hover hitbox) ---
  let maxW = 0;
  for (let line = 0; line < numLines; line++) {
    textSize(sizes[line]);
    maxW = max(maxW, textWidth(phrase));
  }

  // A single bounding box around the whole "logo" stack
  let boxX = width / 2 - maxW / 2;
  let boxY = startY;
  let boxW = maxW;
  let boxH = totalHeight;

  // Hover OR tapped on mobile
  let hoverOn = mouseX >= boxX && mouseX <= boxX + boxW && mouseY >= boxY && mouseY <= boxY + boxH;
  let glitchOn = hoverOn || glitchToggle;

  // --- draw the lines ---
  fill(255);

  for (let line = 0; line < numLines; line++) {
    let fs = sizes[line];
    textSize(fs);

    let w = textWidth(phrase);
    let startX = width / 2 - w / 2;

    // baseY accumulates actual line heights so spacing is consistent
    let baseY = startY;
    for (let k = 0; k < line; k++) baseY += sizes[k] * 1.2;

    let x = startX;

    for (let i = 0; i < phrase.length; i++) {
      let c = phrase[i];
      let cw = textWidth(c);

      // wave motion
      let yOffset = sin(i * 0.4 + t + line * 0.5) * fs * 0.15;

      if (glitchOn) {
        // --- glitch behaviors ---
        // 1) micro jitter
        let jx = random(-fs * 0.03, fs * 0.03);
        let jy = random(-fs * 0.04, fs * 0.04);

        // 2) occasional character "bitflip" with color flash
        let bitflipped = false;
        if (random() < CHAR_FLIP_PROBABILITY && c !== " ") {
          c = random(GLITCH_CHARS);
          bitflipped = true;

          // Bitflipped characters get yellow or chartreuse
          if (random() < COLOR_FLASH_PROBABILITY) {
            let col = random() < 0.5 ? YELLOW : CHARTREUSE;
            fill(col[0], col[1], col[2]);
          }
        }

        // 3) Chromatic aberration - RGB split echo effect
        if (random() < ECHO_PROBABILITY && c !== " ") {
          // Blue offset (left-up)
          fill(BLUE[0], BLUE[1], BLUE[2], 180);
          text(c, x + jx * 2.0 - fs * 0.08, baseY + yOffset - jy * 1.5 - fs * 0.05);

          // Pink offset (right-down)
          fill(PINK[0], PINK[1], PINK[2], 180);
          text(c, x + jx * 2.0 + fs * 0.08, baseY + yOffset - jy * 1.5 + fs * 0.05);

          // Reset to white for main character
          fill(255);
        }

        // Draw main character (white unless bitflipped with color)
        if (!bitflipped) {
          fill(255);
        }
        text(c, x + jx, baseY + yOffset + jy);

        // Reset fill to white for next character
        fill(255);
      } else {
        text(c, x, baseY + yOffset);
      }

      x += cw;
    }
  }
}

// Tap to toggle glitch on mobile - only within canvas bounds
function touchStarted() {
  // Only toggle glitch if touch is within the canvas area
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    glitchToggle = !glitchToggle;
    return false; // prevents page scroll on touch within canvas
  }
  // Allow default behavior for touches outside canvas (buttons, etc.)
  return true;
}

function windowResized() {
  resizeCanvas(windowWidth, calculateCanvasHeight());
}
