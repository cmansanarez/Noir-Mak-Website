// Initialize Hydra with manual canvas creation (like Glitch_Tunnel)
const hydra = new Hydra({
  canvas: document.createElement('canvas'),
  detectAudio: false
});

// Insert canvas at the beginning of body
document.body.insertBefore(hydra.canvas, document.body.firstChild);

console.log('Hydra initialized');

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
