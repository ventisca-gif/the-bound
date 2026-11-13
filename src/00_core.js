'use strict';
// ================= CORE =================
const TS = 16;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const dist2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
const dist = (ax, ay, bx, by) => Math.sqrt(dist2(ax, ay, bx, by));
const smooth = t => t * t * (3 - 2 * t);
const now = () => performance.now();
function hash2(x, y, s) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul((s | 0) + 1, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
class RNG {
  constructor(s) { this.r = mulberry32(s); }
  f() { return this.r(); }
  int(a, b) { return a + Math.floor(this.r() * (b - a + 1)); }
  range(a, b) { return a + this.r() * (b - a); }
  pick(a) { return a[Math.floor(this.r() * a.length)]; }
  chance(p) { return this.r() < p; }
}
// value noise with smooth interpolation
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = smooth(xf), v = smooth(yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
function fbm(x, y, s, oct = 4) {
  let t = 0, amp = 1, f = 1, n = 0;
  for (let i = 0; i < oct; i++) { t += vnoise(x * f, y * f, s + i * 31) * amp; n += amp; amp *= 0.5; f *= 2; }
  return t / n;
}
// ---------- colors ----------
function hexRGB(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
function rgbU(r, g, b, a = 255) { return ((a & 255) << 24 | (b & 255) << 16 | (g & 255) << 8 | (r & 255)) >>> 0; }
function C(h, a = 255) { const [r, g, b] = hexRGB(h); return rgbU(r, g, b, a); }
function uR(c) { return c & 255; } function uG(c) { return (c >>> 8) & 255; } function uB(c) { return (c >>> 16) & 255; } function uA(c) { return c >>> 24; }
function uMul(c, f) { return rgbU(clamp(uR(c) * f, 0, 255), clamp(uG(c) * f, 0, 255), clamp(uB(c) * f, 0, 255), uA(c)); }
function uMix(c1, c2, t) { return rgbU(lerp(uR(c1), uR(c2), t), lerp(uG(c1), uG(c2), t), lerp(uB(c1), uB(c2), t), lerp(uA(c1), uA(c2), t)); }
function uCss(c) { return `rgba(${uR(c)},${uG(c)},${uB(c)},${(uA(c) / 255).toFixed(3)})`; }
function pal(arr) { return arr.map(h => C(h)); }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
// ---------- pixel buffer ----------
class Pix {
  constructor(w, h) { this.w = w; this.h = h; this.d = new Uint32Array(w * h); }
  set(x, y, c) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= this.w || y >= this.h || c === undefined) return; const i = y * this.w + x; this.d[i] = c; if (this.t) this.t[i] = this.tg; }
  blend(x, y, c, a) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; const i = y * this.w + x, o = this.d[i]; if (!uA(o)) { this.d[i] = (c & 0xffffff) | (Math.round(a * 255) << 24) >>> 0; return; } this.d[i] = uMix(o, c | 0xff000000, a) | 0xff000000; }
  get(x, y) { if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0; return this.d[y * this.w + x]; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); }
  hl(x, y, w, c) { for (let i = 0; i < w; i++) this.set(x + i, y, c); }
  vl(x, y, h, c) { for (let j = 0; j < h; j++) this.set(x, y + j, c); }
  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
    for (; ;) { this.set(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
  }
  ell(cx, cy, rx, ry, c) { // filled ellipse
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) this.set(x, y, c);
    }
  }
  // shaded ball: light from top-left. cols: [dark..light]
  ball(cx, cy, rx, ry, cols, hl = 1) {
    const n = cols.length;
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, r = dx * dx + dy * dy; if (r > 1) continue;
      let l = (-dx * 0.55 - dy * 0.75) * 0.5 + 0.5 - r * 0.25 * hl; // 0..1
      l += (hash2(x, y, 7) - 0.5) * 0.08;
      this.set(x, y, cols[clamp(Math.floor(l * n * 1.15), 0, n - 1)]);
    }
  }
  poly(pts, c) { // filled polygon (scanline)
    let minY = 1e9, maxY = -1e9; for (const p of pts) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs = []; const yy = y + 0.5;
      for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] <= yy && b[1] > yy) || (b[1] <= yy && a[1] > yy)) xs.push(a[0] + (yy - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.set(x, y, c);
    }
  }
  // outline: transparent pixels adjacent to opaque get color (or darkened neighbor)
  outline(c, diag = false, sel = 0) {
    const w = this.w, h = this.h, d = this.d, o = new Uint32Array(d);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; if (uA(d[i]) > 40) continue;
      let n = 0;
      const chk = (xx, yy) => { if (xx < 0 || yy < 0 || xx >= w || yy >= h) return; const v = d[yy * w + xx]; if (uA(v) > 128) n = n || v; };
      chk(x - 1, y); chk(x + 1, y); chk(x, y - 1); chk(x, y + 1);
      if (diag) { chk(x - 1, y - 1); chk(x + 1, y - 1); chk(x - 1, y + 1); chk(x + 1, y + 1); }
      if (n) o[i] = sel ? uMix(uMul(n, 0.3), c, 0.5) | 0xff000000 : c;
    }
    this.d = o;
  }
  flipX() { const w = this.w, h = this.h, d = this.d, o = new Uint32Array(w * h), t = this.t, ot = t ? new Uint8Array(w * h) : null; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { o[y * w + x] = d[y * w + (w - 1 - x)]; if (t) ot[y * w + x] = t[y * w + (w - 1 - x)]; } this.d = o; if (t) this.t = ot; return this; }
  blit(src, dx, dy) { for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) { const c = src.d[y * src.w + x]; if (uA(c) > 0) this.set(dx + x, dy + y, c); } }
  canvas() { const c = mkCanvas(this.w, this.h); const x = c.getContext('2d'); const id = x.createImageData(this.w, this.h); new Uint32Array(id.data.buffer).set(this.d); x.putImageData(id, 0, 0); return c; }
  toCtx(ctx, dx, dy) { const id = ctx.createImageData(this.w, this.h); new Uint32Array(id.data.buffer).set(this.d); ctx.putImageData(id, dx, dy); }
}
// draw an ascii template into Pix with palette map {char: color}
function tpl(p, rows, map, ox, oy, flip = false) {
  for (let y = 0; y < rows.length; y++) {
    const r = rows[y];
    for (let x = 0; x < r.length; x++) {
      const ch = r[x]; if (ch === '.' || ch === ' ') continue; const c = map[ch]; if (c === undefined) continue;
      p.set(flip ? ox + (r.length - 1 - x) : ox + x, oy + y, c);
    }
  }
}
// ---------- bitmap font (3x5 + accent row) ----------
const FONT = (() => {
  const g = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111',
    0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110', 4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001110',
    ' ': '000000000000000', '.': '000000000000010', ',': '000000000010100', '!': '010010010000010', '?': '110001010000010', '-': '000000111000000', '+': '000010111010000', '/': '001001010100100', ':': '000010000010000', "'": '010010000000000', '%': '101001010100101', '(': '010100100100010', ')': '010001001001010', '¡': '010000010010010', '¿': '010000010100011', '#': '101111101111101', '>': '100010001010100', '<': '001010100010001', '*': '000101010101000', '=': '000111000111000', '♥': '101111111010000', '♪': '011010010110110', '♫': '111101101101101', 'Ñ': '111000110101101'
  };
  const acc = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U', 'Ñ': 'N' };
  return { g, acc };
})();
const textCache = new Map();
function textSprite(str, col = '#ffffff', out = '#1a1218', scale = 1) {
  const key = str + '|' + col + '|' + out + '|' + scale; let s = textCache.get(key); if (s) return s;
  str = String(str).toUpperCase();
  const w = Math.max(1, str.length * 4 - 1), h = 7;
  const p = new Pix(w + 2, h + 2), c = C(col);
  for (let i = 0; i < str.length; i++) {
    let ch = str[i], accent = false; if (FONT.acc[ch]) { accent = true; ch = FONT.acc[ch]; }
    const gl = FONT.g[ch] || FONT.g['?'];
    for (let r = 0; r < 5; r++) for (let k = 0; k < 3; k++) if (gl[r * 3 + k] === '1') p.set(1 + i * 4 + k, 1 + 2 + r, c);
    if (str[i] === 'Ñ') { p.set(1 + i * 4, 2, c); p.set(1 + i * 4 + 1, 1, c); p.set(1 + i * 4 + 2, 2, c); }
    else if (accent) p.set(1 + i * 4 + 2, 1, c), p.set(1 + i * 4 + 1, 2, c);
  }
  if (out) p.outline(C(out), true);
  s = p.canvas(); if (textCache.size > 400) textCache.clear(); textCache.set(key, s); return s;
}
// ---------- misc ----------
const DIRS = ['down', 'left', 'right', 'up'];
const DIRV = { down: [0, 1], left: [-1, 0], right: [1, 0], up: [0, -1] };
function dirFromVec(dx, dy) { if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? 'left' : 'right'; return dy < 0 ? 'up' : 'down'; }
function fmt(n) { n = Math.floor(n); return n.toLocaleString('en-US'); }
function choiceW(rng, arr) { let t = 0; for (const a of arr) t += a.w; let r = rng.f() * t; for (const a of arr) { r -= a.w; if (r <= 0) return a; } return arr[arr.length - 1]; }
// binary heap for A*
class Heap { constructor() { this.a = []; this.p = []; } push(v, pr) { const a = this.a, p = this.p; a.push(v); p.push(pr); let i = a.length - 1; while (i > 0) { const j = (i - 1) >> 1; if (p[j] <= p[i]) break;[a[i], a[j]] = [a[j], a[i]];[p[i], p[j]] = [p[j], p[i]]; i = j; } } pop() { const a = this.a, p = this.p; const top = a[0]; const lv = a.pop(), lp = p.pop(); if (a.length) { a[0] = lv; p[0] = lp; let i = 0; for (; ;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && p[l] < p[m]) m = l; if (r < a.length && p[r] < p[m]) m = r; if (m === i) break;[a[i], a[m]] = [a[m], a[i]];[p[i], p[m]] = [p[m], p[i]]; i = m; } } return top; } get size() { return this.a.length; } }
const storage = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } }
};
