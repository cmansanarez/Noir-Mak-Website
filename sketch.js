let phrase = "Noir Mak";
let numLines = 6;
let baseSize = 60;

// Glitch effect settings
let glitchToggle = false; // for mobile tap
const CHAR_FLIP_PROBABILITY = 0.06;
const ECHO_PROBABILITY = 0.08;
const GLITCH_CHARS = ["#", "%", "█", "░", "▓", "/", "\\", "_", "x", "*"];

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

        // 2) occasional character "bitflip"
        if (random() < CHAR_FLIP_PROBABILITY && c !== " ") {
          c = random(GLITCH_CHARS);
        }

        // 3) occasional "duplicate echo" draw (looks like chromatic smear without color)
        if (random() < ECHO_PROBABILITY && c !== " ") {
          text(c, x + jx * 2.0, baseY + yOffset - jy * 1.5);
        }

        text(c, x + jx, baseY + yOffset + jy);
      } else {
        text(c, x, baseY + yOffset);
      }

      x += cw;
    }
  }

  // Extra glitch layer: scanline bars across the logo area
  if (glitchOn) {
    noStroke();
    fill(255, 20);
    for (let s = 0; s < 6; s++) {
      let y = random(boxY, boxY + boxH);
      rect(boxX, y, boxW, random(1, 4));
    }
  }
}

// Tap to toggle glitch on mobile
function touchStarted() {
  glitchToggle = !glitchToggle;
  return false; // prevents page scroll on touch
}

function windowResized() {
  resizeCanvas(windowWidth, calculateCanvasHeight());
}
