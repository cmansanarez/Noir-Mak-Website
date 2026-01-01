let phrase = "Noir Mak";
let numLines = 6;
let baseSize = 60;

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
  fill(255);

  let t = millis() * 0.002; // controls animation speed

  // Adjust base size for mobile screens
  let responsiveBaseSize = width < 480 ? 40 : (width < 768 ? 50 : baseSize);

  // compute stacked height to center vertically
  let totalHeight = 0;
  for (let i = 0; i < numLines; i++) {
    // use the same size formula here as below
    let fs = responsiveBaseSize * pow(0.85, i);
    totalHeight += fs * 1.2;
  }
  let startY = height / 2 - totalHeight / 2;

  for (let line = 0; line < numLines; line++) {
    let fs = responsiveBaseSize * pow(0.85, line);
    textSize(fs);

    // center the phrase horizontally
    let w = textWidth(phrase);
    let startX = width / 2 - w / 2;
    let baseY = startY + line * fs * 1.2;

    let x = startX;
    for (let i = 0; i < phrase.length; i++) {
      let c = phrase[i];
      let cw = textWidth(c);

      // the wave, scaled by font size so bigger text moves more
      let yOffset = sin(i * 0.4 + t + line * 0.5) * fs * 0.15;

      text(c, x, baseY + yOffset);

      x += cw;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, calculateCanvasHeight());
}