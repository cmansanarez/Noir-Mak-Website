let phrase = "Noir Mak";
let numLines = 6;
let baseSize = 60;

function setup() {
  // Calculate available height (viewport minus header and footer)
  let availableHeight = windowHeight - 180; // Account for header and footer with padding
  let canvas = createCanvas(windowWidth, availableHeight);
  canvas.parent('canvas-container');
  textAlign(LEFT, CENTER);
  textFont("monospace");
  noStroke();
}

function draw() {
  background(0);
  fill(255);

  let t = millis() * 0.002; // controls animation speed

  // compute stacked height to center vertically
  let totalHeight = 0;
  for (let i = 0; i < numLines; i++) {
    // use the same size formula here as below
    let fs = baseSize * pow(0.85, i);
    totalHeight += fs * 1.2;
  }
  let startY = height / 2 - totalHeight / 2;

  for (let line = 0; line < numLines; line++) {
    let fs = baseSize * pow(0.85, line);
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
  let availableHeight = windowHeight - 180;
  resizeCanvas(windowWidth, availableHeight);
}