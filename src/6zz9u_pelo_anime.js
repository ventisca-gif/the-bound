// ================= v4.79: 10 PEINADOS ANIME (5 de chica y 5 de chico) =================
// Pelo por mechones con volumen, rizos en espiral, flequillo en punta y brillo, al estilo del pelo de Lienya.
// Cómo funciona: drawHero pinta la cabeza calva y después se dibujan dos capas de pelo:
//   - capa de atrás (B): solo rellena los huecos vacíos del cuadro, así queda detrás del cuerpo (de espaldas va encima);
//   - capa de delante (F): tapa la cabeza sin pisar la cara (ojos, cejas y boca siguen a la vista).
// Cada mechón lleva su propio número: donde un mechón pisa a otro se dibuja una línea oscura (separación anime).
// Todo se mide con p.meta (hx, hy, hrx, hry, ey, torsoTop, legTop, base), así se adapta a las 8 estructuras.
// Con casco, sombrero o capucha se usan los parámetros clásicos de la entrada (cap, bang, side, back...).
const AH = {};
const AH_W = C('#ffffff');
function ahPal(HP) { return [uMul(HP[0], 0.7), HP[0], HP[1], HP[2], HP[3], uMix(HP[3], AH_W, 0.5)]; }
function ahNew(W, H) { return { W, H, id: new Int16Array(W * H), lt: new Float32Array(W * H), cs: new Float32Array(W * H), n: 0 }; }
function ahPut(L, x, y, id, l, cs) { x = Math.floor(x); y = Math.floor(y); if (x < 0 || y < 0 || x >= L.W || y >= L.H) return; const i = y * L.W + x; if (L.id[i] === id && L.cs[i] <= cs) return; L.id[i] = id; L.lt[i] = l; L.cs[i] = cs; }
function ahSpline(pts, step) { if (pts.length < 2) return pts.slice(); const P = [pts[0]].concat(pts, [pts[pts.length - 1]]), out = [];
  for (let i = 1; i < P.length - 2; i++) { const a = P[i - 1], b = P[i], c = P[i + 1], d = P[i + 2], n = Math.max(2, Math.ceil(Math.hypot(c[0] - b[0], c[1] - b[1]) / step));
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t, f = (p0, p1, p2, p3) => 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t3); out.push([f(a[0], b[0], c[0], d[0]), f(a[1], b[1], c[1], d[1])]); } }
  out.push(pts[pts.length - 1]); return out; }
// mechón: curva gruesa que se afina (w0 → w1); más claro en el centro y hacia arriba a la izquierda
function ahLock(L, pts, w0, w1, o) { o = o || {}; const id = ++L.n, S = ahSpline(pts, 0.3), acc = [0]; let tot = 0;
  for (let i = 1; i < S.length; i++) { tot += Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]); acc.push(tot); }
  const base = o.l === undefined ? 0.4 : o.l, fade = o.fade === undefined ? 0.22 : o.fade;
  for (let i = 0; i < S.length; i++) { const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)]; let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const nx = -ty, ny = tx, u = tot ? acc[i] / tot : 0, w = Math.max(1, w0 + (w1 - w0) * u), h = w / 2;
    for (let q = -h; q <= h + 1e-6; q += 0.34) { const s = q / h, dl = -nx * s * 0.55 - ny * s * 0.8; ahPut(L, S[i][0] + nx * q, S[i][1] + ny * q, id, base + 0.36 * (1 - s * s) + 0.22 * dl - fade * u, Math.abs(s)); } }
  return id; }
// espiral alrededor de (cx, cy) desde el ángulo a0 recorriendo sw radianes, cerrándose hacia dentro
function ahSpiral(cx, cy, r, a0, sw, shrink) { const out = [], n = Math.max(6, Math.ceil(Math.abs(sw) * r * 1.4)); for (let k = 1; k <= n; k++) { const t = k / n, a = a0 + sw * t, rr = r * (1 - (shrink === undefined ? 0.45 : shrink) * t); out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return out; }
// final de mechón que se enrosca hacia abajo y vuelve (sx: 1 a la derecha, -1 a la izquierda)
const ahCurlEnd = (E, sx, r, turn) => ahSpiral(E[0] + sx * r, E[1], r, sx > 0 ? Math.PI : 0, -sx * (turn || 1.3) * Math.PI);
// rizo que sale hacia fuera y se enrosca hacia arriba (las espirales del borde del dibujo de Lienya)
const ahHook = (x, y, sx, r, turn) => [[x, y]].concat(ahSpiral(x + sx * r, y, r, sx > 0 ? Math.PI : 0, sx * (turn || 1.4) * Math.PI));
// casquete: la masa de pelo de la cabeza, con borde ondulado, surcos que salen de la coronilla y aro de brillo
function ahCap(L, cx, cy, rx, ry, o) { o = o || {}; const id = ++L.n, nb = o.bumps || 7, ba = o.ba === undefined ? 0.07 : o.ba, K = o.grooves || 8;
  for (let y = Math.floor(cy - ry * 1.2); y <= Math.ceil(cy + ry * 1.2); y++) { if (o.yMax !== undefined && y > o.yMax) continue;
    for (let x = Math.floor(cx - rx * 1.2); x <= Math.ceil(cx + rx * 1.2); x++) { const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry, ang = Math.atan2(ny, nx), r = Math.hypot(nx, ny);
      if (r > 1 + ba * Math.sin(ang * nb + (o.ph || 0)) * (ny < -0.5 ? 0.35 : 1)) continue;
      let l = 0.56 - 0.22 * nx - 0.3 * ny - 0.2 * r * r; const g = Math.cos(ang * K + (o.gph || 0));
      if (g > 0.6 && r > 0.4 && (!o.front || ny > 0.1)) l -= 0.3 * (g - 0.6) / 0.4;
      if (o.ring !== false && ny > -0.74 && ny < -0.46 && nx > -0.72 && nx < 0.3 && g < 0.55) l += 0.4;
      ahPut(L, x, y, id, l, 0); } }
  return id; }
function ahRender(p, L, T, behind, face, ring, off) { off = off || 0; const W = L.W, H = L.H, id = L.id, K = new Int8Array(W * H).fill(-1);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, a = id[i]; if (!a) continue; if (face && face(x, y)) continue; if (behind && (p.d[i] >>> 24)) continue;
    const v = L.lt[i] + off; let k = v < 0.2 ? 1 : v < 0.42 ? 2 : v < 0.66 ? 3 : v < 0.9 ? 4 : 5;
    const l = x > 0 ? id[i - 1] : 0, r = x < W - 1 ? id[i + 1] : 0, u = y > 0 ? id[i - W] : 0, dn = y < H - 1 ? id[i + W] : 0;
    if (l > a || r > a || u > a || dn > a) k = 1; else { if (!l || !r || !u || !dn) k = Math.min(k, 3); else if (ring && y >= ring[0] && y <= ring[1] && x >= ring[2] && x <= ring[3] && k >= 3 && (y > ring[0] || (x + y) % 3)) k = 5; }
    K[i] = k; }
  // limpieza: un píxel suelto rodeado de otro tono toma ese tono (sin puntos sueltos)
  const K2 = K.slice();
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x, k = K[i]; if (k < 0) continue; const nb = [K[i - 1], K[i + 1], K[i - W], K[i + W]];
    if (nb.some(v => v === k)) continue; const cnt = {}; let best = -1, bc = 0; for (const v of nb) if (v >= 0) { cnt[v] = (cnt[v] || 0) + 1; if (cnt[v] > bc) { bc = cnt[v]; best = v; } } if (bc >= 3) K2[i] = best; }
  for (let i = 0; i < W * H; i++) if (K2[i] >= 0) p.set(i % W, (i / W) | 0, T[K2[i]]); }

// ---------- piezas comunes (c = contexto del fotograma: medidas, capas y vista) ----------
function ahCtx(m, anim, f, W, H) {
  const c = { hx: m.hx + 0.5, hy: m.hy, rx: m.hrx, ry: m.hry, top: m.headTop, ey: m.ey, tt: m.torsoTop, lt: m.legTop, base: m.base, side: !!m.side, up: !!m.up, d: m.d || 1,
    sw: anim === 'walk' || anim === 'dance' ? (f % 2 ? 1 : -1) : anim === 'idle' ? (f ? 0.5 : 0) : 0, B: ahNew(W, H), F: ahNew(W, H) };
  c.kx = c.rx / 7.5; c.ky = c.ry / 8; c.k = -c.d;   // k: hacia la nuca en la vista de perfil
  c.Y = t => c.tt + (c.base - c.tt) * t;           // altura en el cuerpo: 0 hombros, 1 suelo
  // casquete
  c.cap = (vol, o) => { o = o || {}; const cx = c.hx + (c.side ? c.k * (0.6 + vol * 0.4) : 0), cy = c.hy - 1.6 - vol * 0.45, rx = c.rx + 0.9 + vol * (c.side ? 0.8 : 1), ry = c.ry + 0.5 + vol * 0.75;
    return ahCap(c.F, cx, cy, rx, ry, Object.assign({ front: !c.up && !c.side, yMax: c.up ? c.hy + c.ry - 1 : c.side ? c.hy + c.ry - 2 : c.hy + 1.5 }, o)); };
  // flequillo: type 'point' (puntas), 'curl' (rizos), 'swept' (de lado), 'curtain' (abierto al medio), 'messy'
  c.fringe = (type, n, o) => { o = o || {}; if (c.up) return; const F = c.F, t0 = c.top + 2.2, yb = c.ey - 1.2 + (o.drop || 0);
    if (c.side) { const m = o.sideN || 3; for (let i = 0; i < m; i++) { const x0 = c.hx + c.k * (1.5 - i * 0.6) * c.kx, xe = c.hx + c.d * (c.rx + 0.4 - i * 1.4), ye = yb - i * 1.3 + (type === 'messy' ? (i % 2) : 0);
        const pts = [[x0, t0 - 0.5], [c.hx + c.d * (c.rx * 0.55 - i * 0.8), t0 + 1.5], [xe, ye]]; if (type === 'curl') ahLock(F, pts.concat(ahCurlEnd(pts[2], -c.d, 1.2, 1.1)), 3, 1.2); else ahLock(F, pts, 3.2, 0.9); } return; }
    for (let i = 0; i < n; i++) { const t = n === 1 ? 0 : i / (n - 1) * 2 - 1, ox = t * (c.rx - 1.2), jit = type === 'messy' ? [0, 1.2, -0.6, 0.9, 0.2, 1.4][i % 6] : type === 'point' ? (i % 2 ? -0.9 : 0) : 0;
      let lean = type === 'swept' ? 2.6 * (o.dir || 1) : type === 'curtain' ? t * 2.2 : t * 0.8; const x0 = c.hx + ox * 0.45 - lean * 0.4, xe = c.hx + ox + lean, ye = yb + jit - (type === 'curtain' ? Math.abs(t) * -0.6 + (1 - Math.abs(t)) * 2.4 : 0) - (type === 'swept' ? (t * (o.dir || 1) + 1) * 0.9 : 0);
      const pts = [[x0, t0 - 0.5], [(x0 + xe) / 2 + lean * 0.3, (t0 + ye) / 2], [xe, ye]];
      const fw = Math.max(3, c.rx * 2 / n + 1.3); if (type === 'curl') ahLock(F, pts.concat(ahCurlEnd(pts[2], t < 0 ? 1 : -1, 1.1, 1)), fw, 1.3, { l: 0.46 }); else ahLock(F, pts, fw, 0.9, { l: 0.46 }); } };
  // mechones que enmarcan la cara (delante de los hombros)
  c.sidelocks = (yL, w, o) => { o = o || {}; if (c.up) return; const F = c.F;
    const one = (s, x0, x1) => { const pts = [[x0, c.hy - 3], [x0 + s * 0.4, c.hy + 1], [x1 + Math.sin(yL) * 0.3, (c.hy + yL) / 2 + 1], [x1 + s * (o.out || 0) + c.sw * 0.3, yL]];
      if (o.curl) ahLock(F, pts.concat(ahCurlEnd(pts[3], o.curlIn ? -s : s, o.curl, 1.2)), w, 1.4); else ahLock(F, pts, w, 0.9); };
    if (c.side) one(c.d, c.hx + c.k * 1.2, c.hx + c.k * 0.4); else for (const s of [-1, 1]) one(s, c.hx + s * (c.rx - 0.8), c.hx + s * (c.rx + 0.2)); };
  // melena larga de atrás: hasta yE, abriéndose 'spread' píxeles; o.curl radio del rizo final, o.wild espirales en el borde
  c.mane = (yE, spread, n, o) => { o = o || {}; const B = c.B, cr = o.curl || 0, wv = o.wav || 0, sp = spread * c.kx, w0 = o.w || 4;
    const end = (pts, sx, w) => { if (cr) ahLock(B, pts.concat(ahCurlEnd(pts[pts.length - 1], sx, cr * (0.8 + 0.2 * (n % 2)), 1.3)), w, 1.5); else ahLock(B, pts, w, o.jag ? 0.6 : 1.2); };
    if (c.up) { const m = n * 2 + 1, idx = []; for (let j = 0; j < m; j++) idx.push(j); idx.sort((a, b) => Math.abs(b / (m - 1) * 2 - 1) - Math.abs(a / (m - 1) * 2 - 1));
      for (const j of idx) { const t = (j / (m - 1)) * 2 - 1, x0 = c.hx + t * (c.rx - 1), xe = c.hx + t * (c.rx * 0.7 + sp), ye = yE - Math.abs(t) * 2 - (j % 2) * 1.5;
        end([[x0, c.hy - 2], [x0 + t * 2.5, c.hy + 3], [(x0 + xe) / 2 + t * sp * 0.35 + Math.sin(j * 1.7) * wv, (c.hy + ye) / 2 + 2], [xe + c.sw * 0.6, ye]], j % 2 ? 1 : -1, w0 + 0.5); }
      if (o.wild) for (const s of [-1, 1]) for (let y = c.hy + 3, i = 0; y < yE - 2; y += 4.5, i++) { const tt = (y - c.hy) / Math.max(1, yE - c.hy), x = c.hx + s * (c.rx * 0.7 + sp * (0.35 + 0.65 * tt) + 1.5); ahLock(B, ahHook(x, y, s, 1.5 + (i % 2) * 0.4), 2.2, 1); }
      return; }
    if (c.side) { for (let j = n - 1; j >= 0; j--) { const t = n === 1 ? 0 : j / (n - 1), x0 = c.hx + c.k * (c.rx * 0.2 + t * c.rx * 0.6), xe = c.hx + c.k * (c.rx * 0.45 + sp * (0.45 + 0.55 * t)), ye = yE - t * 2.5 - (j % 2) * 1.2;
        end([[x0, c.hy - 3 + t], [x0 + c.k * 2.5, c.hy + 2], [(x0 + xe) / 2 + c.k * sp * 0.3 + Math.sin(j * 2.1) * wv, (c.hy + ye) / 2 + 2], [xe + c.sw * 0.6, ye]], j % 2 ? c.k : -c.k, w0); }
      if (o.wild) for (let y = c.hy + 3, i = 0; y < yE - 2; y += 4.5, i++) { const tt = (y - c.hy) / Math.max(1, yE - c.hy), x = c.hx + c.k * (c.rx * 0.45 + sp * (0.4 + 0.6 * tt) + 1.5); ahLock(B, ahHook(x, y, c.k, 1.5 + (i % 2) * 0.4), 2.2, 1); }
      return; }
    for (const s of [-1, 1]) for (let j = n - 1; j >= 0; j--) { const t = n === 1 ? 0 : j / (n - 1), x0 = c.hx + s * (c.rx * 0.45 + t * c.rx * 0.5), xe = c.hx + s * (c.rx * 0.55 + sp * (0.4 + 0.6 * t)), ye = yE - t * 2 - (j % 2) * 1.5;
      end([[x0, c.hy - 4], [x0 + s * 2, c.hy + 1], [(x0 + xe) / 2 + s * sp * 0.35 + Math.sin(j * 1.9 + s) * wv, (c.hy + ye) / 2 + 1], [xe + c.sw * 0.6, ye]], j % 2 ? s : -s, w0); }
    if (o.center !== false) for (const s of [-1, 0, 1]) ahLock(B, [[c.hx + s * 3, c.hy], [c.hx + s * 4, Math.min(yE, c.lt) - 1]], 5, 3);
    if (o.wild) for (const s of [-1, 1]) for (let y = c.hy + 2, i = 0; y < yE - 2; y += 4.5, i++) { const tt = (y - c.hy) / Math.max(1, yE - c.hy), x = c.hx + s * (c.rx * 0.55 + sp * (0.4 + 0.6 * tt) + 1.2); ahLock(B, ahHook(x, y, s, 1.5 + (i % 2) * 0.4), 2.2, 1); } };
  // rizos que asoman por encima de la cabeza
  c.tufts = (o) => { o = o || {}; const L = c.F, y = c.top - 0.5 - (o.lift || 0); if (c.side) { ahLock(L, ahHook(c.hx + c.k * 1, y + 0.5, c.k, 1.4), 2.2, 1); ahLock(L, ahHook(c.hx + c.k * 4.5, y + 2.5, c.k, 1.5), 2.2, 1); ahLock(L, ahHook(c.hx + c.d * 3, y + 0.8, c.d, 1.3), 2, 1); return; }
    for (const s of [-1, 1]) { ahLock(L, ahHook(c.hx + s * 3.2 * c.kx, y + 0.6, s, 1.5), 2.3, 1); ahLock(L, ahHook(c.hx + s * (c.rx + 0.5), y + 4, s, 1.5), 2.3, 1); } };
  // pelo rebelde (ahoge)
  c.ahoge = (s) => { s = s || 1; if (c.side) s = c.d; const y = c.top - 1.5 - c.ry * 0.1; ahLock(c.F, [[c.hx + s * 0.5, y + 1], [c.hx + s * 0.6, y - 2], [c.hx + s * 2.2, y - 3.8], [c.hx + s * 3.6, y - 3]], 1.8, 0.8, { l: 0.62 }); };
  // puntas: [ángulo desde arriba (grados, + a la derecha), largo, ancho]
  c.spikes = (list, o) => { o = o || {}; const cy = c.hy - 2, L = c.F, ex = c.rx + 1, ey2 = c.ry + 1;
    for (const [a0, len, w] of list) { let a = a0; if (c.side) a = (Math.abs(a0) * 0.6 + 30 + (a0 < 0 ? 22 : 0)) * c.k; else if (c.up) a = -a0;
      const r = a * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r), bx = c.hx + dx * ex * 0.72, by = cy + dy * ey2 * 0.72, ln = len * c.ky, bend = (o.bend === undefined ? 0.3 : o.bend) * (a >= 0 ? 1 : -1);
      ahLock(L, [[bx - dx * 1.5, by - dy * 1.5], [bx + dx * ln * 0.5 - dy * bend * ln * 0.25, by + dy * ln * 0.5 + dx * bend * ln * 0.25], [bx + dx * ln + dy * bend * ln * 0.1, by + dy * ln + c.sw * 0.2]], w * c.kx, 0.7, { l: 0.5, fade: 0.1 }); } };
  // nuca: mechones cortos detrás de la cabeza (hasta yN)
  c.nape = (yN, n, o) => { o = o || {}; const L = c.up ? c.F : c.B, cr = o.curl || 0;
    const one = (x0, xe, sx, y1) => { const pts = [[x0, c.hy - 1], [(x0 + xe) / 2, (c.hy + y1) / 2], [xe + c.sw * 0.3, y1]]; if (cr) ahLock(L, pts.concat(ahCurlEnd(pts[2], sx, cr, 1.2)), o.w || 3.4, 1.2); else ahLock(L, pts, o.w || 3.4, o.jag ? 0.6 : 1); };
    if (c.side) { for (let j = 0; j < n; j++) one(c.hx + c.k * (c.rx * 0.3 + j * 1.6), c.hx + c.k * (c.rx * 0.5 + j * 1.8 + (o.out || 1)), c.k, yN - j * 1.2); return; }
    for (let j = 0; j < n; j++) { const t = n === 1 ? 0 : j / (n - 1) * 2 - 1; one(c.hx + t * (c.rx - 1), c.hx + t * (c.rx + (o.out || 1)), t < 0 ? -1 : 1, yN - Math.abs(t) * 1.2 - (j % 2)); } };
  return c;
}
function ahDraw(p, L, S, dir, anim, f) { const m = p.meta; if (!m || m.hrx === undefined) return;
  const c = ahCtx(m, anim, f, p.w, p.h); S(c); const T = ahPal(L.hair), tg = p.tg; if (p.t) p.tg = 6;
  ahRender(p, c.B, T, !c.up, null, null, c.up ? 0 : -0.1);
  const face = c.up ? null : c.side ? ((x, y) => y >= c.ey - 1 && y <= c.hy + c.ry + 1 && (x + 0.5 - c.hx) * c.d >= -1.6 && Math.abs(x + 0.5 - c.hx) <= c.rx + 0.6)
    : ((x, y) => y >= c.ey - 1 && y <= c.hy + c.ry + 1 && Math.abs(x + 0.5 - c.hx) <= c.rx - 1.6);
  ahRender(p, c.F, T, false, face, c.ring === false ? null : c.side ? [Math.round(c.top), Math.round(c.top + 1), Math.round(c.hx - c.rx * 0.5 + c.k * 1.5), Math.round(c.hx + c.rx * 0.3 + c.k * 1.5)] : [Math.round(c.top), Math.round(c.top + 1), Math.round(c.hx - c.rx * 0.6), Math.round(c.hx + c.rx * 0.2)]); if (p.t) p.tg = tg; }

// ---------- los 10 peinados ----------
// chica
AH.diosa = c => { const yE = c.Y(0.62); c.mane(yE, 8, 4, { curl: 2.2, wav: 1, wild: 1 }); c.cap(2.2, { bumps: 9, ba: 0.1 }); c.tufts(); c.sidelocks(c.tt + 4, 3, { curl: 1.6, out: 1 }); c.fringe('curl', 4); };
AH.seda = c => { const yE = c.Y(0.86); c.mane(yE, 4, 4, { wav: 0.8, w: 4.4 }); c.cap(1, { ba: 0.03 }); c.sidelocks(c.tt + 7, 3, {}); c.fringe('point', 6); c.ahoge(1); };
AH.taladro = c => { const B = c.B, r = 2.5 * c.kx, drill = (x0, sx) => { const y0 = c.hy + 1, step = 4 * c.ky, n = 3, P = k => { const t = k * Math.PI * 2 - Math.PI / 2, rr = r * (1 - k * 0.12); return [x0 + sx * Math.cos(t) * rr + sx * k * 0.5 + c.sw * 0.3 * k, y0 + k * step + Math.sin(t) * rr * 0.55]; };
    ahLock(B, [[x0 - sx * 4, c.hy - 6], [x0 - sx * 1, c.hy - 4], [x0, c.hy - 1], P(0)], 4, 3.2);
    for (let q = 0; q < n; q++) { const pts = []; for (let k = q; k <= q + 1.04; k += 0.05) pts.push(P(k)); ahLock(B, pts, 3.2 - q * 0.3, 2.4 - q * 0.3, { l: 0.52 }); }
    ahLock(B, [P(n), [P(n)[0] + sx * 0.5, P(n)[1] + 2]], 2, 1); };
  if (c.side) drill(c.hx + c.k * (c.rx * 0.3 + 2), c.k); else if (c.up) for (const s of [-1, 1]) drill(c.hx + s * (c.rx + 1.5 * c.kx), s); else for (const s of [-1, 1]) drill(c.hx + s * (c.rx + 2.2 * c.kx), s);
  c.nape(c.hy + c.ry + 1, 4, {}); c.cap(1.2); c.sidelocks(c.hy + c.ry + 2, 2.6, { curl: 1.1, curlIn: 1 }); c.fringe('point', 5); };
AH.nube = c => { const yE = c.tt + 4; c.mane(yE, 6, 3, { curl: 1.9, w: 4.6, center: false, wild: 0 }); c.cap(2.8, { bumps: 10, ba: 0.11 }); c.tufts({ lift: 0.5 }); c.sidelocks(c.hy + c.ry + 3, 3, { curl: 1.5, out: 1 }); c.fringe('messy', 6); };
AH.cola = c => { const B = c.up ? c.F : c.B, tl = (x0, y0, sx) => { const ye = c.Y(0.5); ahLock(B, [[x0, y0], [x0 + sx * 4.5, y0 + 1], [x0 + sx * 6.5 + c.sw * 0.5, (y0 + ye) / 2], [x0 + sx * 5 + c.sw, ye]].concat(ahCurlEnd([x0 + sx * 5 + c.sw, ye], sx, 2.2, 1.4)), 5, 1.6);
    ahLock(B, ahHook(x0 + sx * 7, (y0 + ye) / 2 - 2, sx, 1.6), 2.2, 1); ahLock(B, ahHook(x0 + sx * 6.5, ye - 3, sx, 1.5), 2.2, 1); };
  if (c.side) tl(c.hx + c.k * (c.rx - 1), c.top + 1.5, c.k); else if (c.up) tl(c.hx, c.top + 1, 1); else tl(c.hx + c.rx - 1.5, c.top + 2, 1);
  c.nape(c.hy + 3, 3, {}); c.cap(1.4, { bumps: 8 }); if (!c.side) { const bx = c.up ? c.hx : c.hx + c.rx - 2; ahLock(c.F, [[bx - 1.5, c.top + 0.5], [bx + 1.5, c.top - 0.5]], 3, 3, { l: 0.65 }); }
  c.sidelocks(c.tt + 2, 2.8, { curl: 1.3, curlIn: 1 }); c.fringe('swept', 5, { dir: -1 }); };
// chico
AH.puntas = c => { c.nape(c.hy + c.ry - 1, 3, { jag: 1, out: 2 }); c.cap(1, { ba: 0.04 }); c.spikes([[100, 4.5, 4.5], [-95, 4.5, 4.5], [70, 6, 5.5], [-66, 6, 5.5], [38, 7, 6], [-34, 7, 6], [4, 7.5, 6.2]]); c.fringe('point', 4, { drop: 0.5 }); };
AH.revuelto = c => { c.nape(c.hy + c.ry, 4, { curl: 1.2 }); c.cap(2.6, { bumps: 11, ba: 0.12 }); c.tufts({ lift: 0.3 }); if (!c.up && !c.side) for (const s of [-1, 1]) ahLock(c.F, ahHook(c.hx + s * (c.rx + 2), c.hy, s, 1.4), 2.2, 1); c.fringe('curl', 5); };
AH.salvaje = c => { c.mane(c.Y(0.32), 5, 4, { jag: 1, w: 3.8, center: false }); c.cap(1.6, { bumps: 9 }); c.spikes([[78, 4, 4.5], [-74, 4, 4.5], [40, 4.5, 5], [-36, 4.5, 5], [2, 4.5, 5]], { bend: 0.45 }); c.sidelocks(c.tt + 3, 2.6, { out: 1 }); c.fringe('messy', 5); };
AH.principe = c => { const B = c.up ? c.F : c.B; if (c.side) ahLock(B, [[c.hx + c.k * (c.rx - 1), c.hy + 2], [c.hx + c.k * (c.rx + 0.5), c.tt + 2], [c.hx + c.k * (c.rx - 0.5) + c.sw * 0.4, c.tt + 7]], 3, 1); else ahLock(B, [[c.hx + 1, c.hy + 2], [c.hx + 2, c.tt + 2], [c.hx + 1.5 + c.sw * 0.4, c.tt + 7]], 3, 1);
  c.nape(c.hy + c.ry, 3, {}); c.cap(1, { ba: 0.03 }); c.sidelocks(c.tt + 4, 2.4, {}); c.fringe('swept', 5, { dir: 1, drop: 0.6 }); };
AH.lobo = c => { c.nape(c.tt + 2, 5, { curl: 1.4, out: 2, w: 3.6 }); c.cap(1.6, { bumps: 8 }); c.sidelocks(c.hy + c.ry + 2, 2.6, { curl: 1.2, out: 1 }); c.fringe('curtain', 6); c.ahoge(-1); };

// entradas del menú de peinados (los parámetros clásicos se usan si llevas casco, sombrero o capucha)
HS_F.push(
  { n: L2('Rizos de diosa', 'Goddess curls'), cap: 'volume', bang: 'messy', side: 13, back: 19, bw: 1.38, curl: 2, ah: 'diosa' },
  { n: L2('Seda anime', 'Anime silk'), cap: 'round', bang: 'full', side: 10, back: 22, hime: 1, ah: 'seda' },
  { n: L2('Coletas taladro', 'Drill twintails'), cap: 'round', bang: 'full', side: 3, back: 0, tail: 'twin', ah: 'taladro' },
  { n: L2('Nube rizada', 'Curly cloud'), cap: 'volume', bang: 'messy', side: 6, back: 5, bw: 1.4, curl: 2, ah: 'nube' },
  { n: L2('Cola rizada', 'Curly ponytail'), cap: 'round', bang: 'side', side: 4, back: 0, tail: 'high', ah: 'cola' });
HS_M.push(
  { n: L2('Puntas de héroe', 'Hero spikes'), cap: 'spiky', bang: 'messy', side: 2, back: 3, ah: 'puntas' },
  { n: L2('Rizos revueltos', 'Tousled curls'), cap: 'volume', bang: 'messy', side: 3, back: 4, bw: 1.28, curl: 2, ah: 'revuelto' },
  { n: L2('Melena salvaje', 'Wild mane'), cap: 'spiky', bang: 'messy', side: 7, back: 14, jag: 1, ah: 'salvaje' },
  { n: L2('Flequillo de príncipe', 'Prince fringe'), cap: 'round', bang: 'long', side: 5, back: 5, ah: 'principe' },
  { n: L2('Lobo rebelde', 'Rebel wolf'), cap: 'volume', bang: 'curtain', side: 5, back: 7, bw: 1.1, jag: 1, layer: 1, ah: 'lobo' });
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const S = L && L.hs && L.hs.ah && AH[L.hs.ah]; if (!S || L.head || !L.hair) return _dh.apply(this, arguments);
    const L2_ = Object.assign({}, L, { hs: Object.assign({}, L.hs, { cap: 'bald', tail: null, back: 0, side: 0 }) }), r = _dh.call(this, p, L2_, dir, anim, f);
    try { ahDraw(p, L, S, dir, anim, f); } catch (e) { } return r; }; }
