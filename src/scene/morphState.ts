// Shared mutable state bridging the scroll-scrubbed master timeline (GSAP)
// and the R3F render loop. The timeline tweens the *Target fields; the render
// loop damps the live fields toward them every frame.
export const morphState = {
  // morph target index:
  // 0 name · 1 brain · 2 candles · 3 phone · 4 swarm · 5 tenx · 6 helix · 7 globe
  target: 0,
  index: 0,
  // particle scatter (0 = formed shape, 1 = loose drift)
  scatterTarget: 0,
  scatter: 0,
  // global particle alpha multiplier
  alphaTarget: 1,
  alpha: 1,
  // horizontal offset of the particle formation (text one side, shape the other)
  offsetXTarget: 0,
  offsetX: 0,
  // palette blend 0..1 (teal/magenta → acid/violet), tweened per scene
  paletteTarget: 0,
  palette: 0,
  // pointer in NDC, fed by window listeners; projected in-scene
  pointerX: 0,
  pointerY: 0,
  pointerActive: 0,
  // click shockwave: stamp increments per click; consumed by MorphParticles
  shockStamp: 0,
  shockX: 0,
  shockY: 0,
  // lenis scroll velocity (px/frame-ish), drives turbulence + stage skew
  scrollVel: 0,
};
