// Procedural particle target shapes. Every generator fills `count` particles
// into a Float32Array(count * 3), normalized to a ~5-unit-wide volume centered
// at the origin so morphs travel comparable distances.

const rand = (a = 1, b?: number) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

// Box–Muller gaussian
function gauss(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Rasterizes `text` on an offscreen canvas and samples particle positions from
 * its glyph pixels — the content-as-particles trick. Call after fonts load.
 */
export function textTarget(count: number, text: string, worldWidth = 6.4): Float32Array {
  const out = new Float32Array(count * 3);
  const W = 1024;
  const H = 360;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  let size = 300;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  do {
    ctx.font = `700 ${size}px 'Space Grotesk', system-ui, sans-serif`;
    size -= 10;
  } while (ctx.measureText(text).width > W * 0.94 && size > 40);
  ctx.fillStyle = "#fff";
  ctx.fillText(text, W / 2, H / 2);

  const data = ctx.getImageData(0, 0, W, H).data;
  const candidates: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) candidates.push(x, y);
    }
  }
  const scale = worldWidth / W;
  if (candidates.length === 0) {
    // font failed to rasterize — fall back to a slab so the morph still works
    for (let i = 0; i < count; i++) {
      out[i * 3] = rand(-2.8, 2.8);
      out[i * 3 + 1] = rand(-0.6, 0.6);
      out[i * 3 + 2] = rand(-0.15, 0.15);
    }
    return out;
  }
  for (let i = 0; i < count; i++) {
    const ci = (Math.floor(Math.random() * (candidates.length / 2)) * 2) % candidates.length;
    const px = candidates[ci] + rand(-2.5, 2.5);
    const py = candidates[ci + 1] + rand(-2.5, 2.5);
    out[i * 3] = (px - W / 2) * scale;
    out[i * 3 + 1] = -(py - H / 2) * scale;
    // generous depth keeps glyph strokes from stacking into a white-out
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.55;
  }
  return out;
}

export function brainTarget(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const z = rand(-1, 1);
    const s = Math.sqrt(1 - z * z);
    let x = s * Math.cos(t);
    let y = s * Math.sin(t);
    let zz = z;
    const r = 0.55 + 0.45 * Math.pow(Math.random(), 0.35);
    x *= 2.1 * r;
    y *= 1.55 * r;
    zz *= 1.75 * r;
    if (Math.abs(x) < 0.14) x += Math.sign(x || 1) * 0.14;
    const wr = 0.09;
    x += wr * Math.sin(y * 5.1 + zz * 3.7);
    y += wr * Math.sin(zz * 6.3 + x * 2.9) + 0.18;
    zz += wr * Math.sin(x * 4.7 + y * 3.1);
    out[i * 3] = x;
    out[i * 3 + 1] = y * 0.92;
    out[i * 3 + 2] = zz;
  }
  return out;
}

export function candlesTarget(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const n = 18;
  const candles: { x: number; open: number; close: number; high: number; low: number }[] = [];
  let price = 0;
  for (let c = 0; c < n; c++) {
    const open = price;
    const close = open + gauss() * 0.42 + 0.06; // slight uptrend, obviously
    const high = Math.max(open, close) + Math.random() * 0.3;
    const low = Math.min(open, close) - Math.random() * 0.3;
    candles.push({ x: -3.1 + (6.2 * c) / (n - 1), open, close, high, low });
    price = close;
  }
  let min = Infinity;
  let max = -Infinity;
  for (const c of candles) {
    min = Math.min(min, c.low);
    max = Math.max(max, c.high);
  }
  const ny = (p: number) => ((p - min) / (max - min)) * 3.4 - 1.7;

  const bw = 0.17;
  for (let i = 0; i < count; i++) {
    const c = candles[i % n];
    const body = Math.random() < 0.74;
    let x: number;
    let y: number;
    let z: number;
    if (body) {
      const top = ny(Math.max(c.open, c.close));
      const bot = ny(Math.min(c.open, c.close));
      x = c.x + rand(-bw, bw);
      y = rand(bot, Math.max(top, bot + 0.05));
      z = rand(-bw, bw);
    } else {
      x = c.x + rand(-0.025, 0.025);
      y = rand(ny(c.low), ny(c.high));
      z = rand(-0.025, 0.025);
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

export function phoneTarget(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const w = 1.15;
  const h = 2.25;
  const d = 0.13;
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x: number;
    let y: number;
    let z: number;
    if (r < 0.34) {
      // app icon grid floating just over the screen — 4 x 6
      const col = Math.floor(rand(4));
      const row = Math.floor(rand(6));
      x = -w + 0.36 + col * ((2 * w - 0.72) / 3) + gauss() * 0.07;
      y = -h + 0.55 + row * ((2 * h - 1.3) / 5) + gauss() * 0.07;
      z = d + 0.06 + Math.random() * 0.03;
    } else if (r < 0.72) {
      x = rand(-w, w);
      y = rand(-h, h);
      z = d;
    } else if (r < 0.86) {
      x = rand(-w, w);
      y = rand(-h, h);
      z = -d;
    } else {
      const e = Math.random();
      z = rand(-d, d);
      if (e < 0.25) (x = -w), (y = rand(-h, h));
      else if (e < 0.5) (x = w), (y = rand(-h, h));
      else if (e < 0.75) (y = -h), (x = rand(-w, w));
      else (y = h), (x = rand(-w, w));
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

export function swarmTarget(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const clusters = 13;
  const centers: number[][] = [[0, 0, 0]];
  for (let c = 0; c < clusters; c++) {
    const t = (c / clusters) * Math.PI * 2;
    const r = rand(1.5, 2.5);
    const tilt = rand(-0.9, 0.9);
    centers.push([Math.cos(t) * r, Math.sin(t * 1.7) * r * 0.55 + tilt, Math.sin(t) * r]);
  }
  for (let i = 0; i < count; i++) {
    const ci = Math.random() < 0.22 ? 0 : 1 + Math.floor(rand(clusters));
    const [cx, cy, cz] = centers[ci];
    const sigma = ci === 0 ? 0.5 : 0.26;
    out[i * 3] = cx + gauss() * sigma;
    out[i * 3 + 1] = cy + gauss() * sigma;
    out[i * 3 + 2] = cz + gauss() * sigma;
  }
  return out;
}

/** Double helix with rungs — the journey timeline as DNA of a career. */
export function helixTarget(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const H = 4.6;
  const R = 1.1;
  const turns = 2.4;
  for (let i = 0; i < count; i++) {
    const kind = Math.random();
    const t = Math.random();
    const y = (t - 0.5) * H;
    const a = t * Math.PI * 2 * turns;
    if (kind < 0.42) {
      out[i * 3] = Math.cos(a) * R + gauss() * 0.05;
      out[i * 3 + 1] = y + gauss() * 0.05;
      out[i * 3 + 2] = Math.sin(a) * R + gauss() * 0.05;
    } else if (kind < 0.84) {
      out[i * 3] = Math.cos(a + Math.PI) * R + gauss() * 0.05;
      out[i * 3 + 1] = y + gauss() * 0.05;
      out[i * 3 + 2] = Math.sin(a + Math.PI) * R + gauss() * 0.05;
    } else {
      // rung between strands at quantized heights
      const q = Math.round(t * 14) / 14;
      const qa = q * Math.PI * 2 * turns;
      const m = Math.random() * 2 - 1;
      out[i * 3] = Math.cos(qa) * R * m + gauss() * 0.03;
      out[i * 3 + 1] = (q - 0.5) * H + gauss() * 0.03;
      out[i * 3 + 2] = Math.sin(qa) * R * m + gauss() * 0.03;
    }
  }
  return out;
}

export function globeTarget(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const R = 2.3;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const j = 0.03;
    out[i * 3] = (Math.cos(theta) * rad + gauss() * j) * R;
    out[i * 3 + 1] = (y + gauss() * j) * R;
    out[i * 3 + 2] = (Math.sin(theta) * rad + gauss() * j) * R;
  }
  return out;
}

// Kathmandu on the globe (lat 27.7°N, lon 85.3°E) for the contact-scene ping
export function kathmanduPosition(R = 2.3): [number, number, number] {
  const lat = (27.7 * Math.PI) / 180;
  const lon = (85.3 * Math.PI) / 180;
  return [R * Math.cos(lat) * Math.cos(lon), R * Math.sin(lat), -R * Math.cos(lat) * Math.sin(lon)];
}
