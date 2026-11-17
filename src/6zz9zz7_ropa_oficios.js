// ================= v5.05: ROPA DE OFICIO CON FORMAS PROPIAS =================
// Las 69 prendas de la 5.04 reutilizaban cortes que ya existían (solo cambiaba el color). Aquí cada una recibe su propio
// tipo (fitKind) con su forma: se ajusta solo a las 10 estructuras de cuerpo, 4 direcciones y la caminata (ver 6zx_fit).
// Mismos ids, objetos y forma de conseguirlas; solo cambia el dibujo (y el nombre de algunas para que diga lo que es).
const RO = h => ofRamp(h), RO_W = C('#ffffff'), RO_K = C('#1a1418'), RO_G = GOLD, RO_SV = P5(['#3a3a44', '#6a6a76', '#9a9aa6', '#c8c8d2', '#f0f0f8']);
const roSet = (p, x, y, c) => p.set(Math.round(x), Math.round(y), c);
const roRow = (p, x0, x1, y, c) => { for (let x = Math.round(x0); x <= Math.round(x1); x++) p.set(x, Math.round(y), c); };
const roRect = (p, x0, y0, w, h, c) => { for (let y = 0; y < h; y++) roRow(p, x0, x0 + w - 1, y0 + y, c); };
const roEll = (p, cx, cy, rx, ry, P, top) => { for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) { if (top && y > cy) continue; for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) { const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy > 1) continue; p.set(x, y, P[dx < -0.45 && dy < 0.2 ? 3 : dx > 0.5 ? 1 : 2]); } } };
// píxeles del pie (colores del calzado) agrupados por pie
function roFeet(p, A, s) { const cols = new Set(s.m), pts = []; for (let y = Math.round(A.legTop); y < Math.min(p.h, A.base + 3); y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) pts.push([x, y]);
 pts.sort((a, b) => a[0] - b[0]); const out = []; for (const [x, y] of pts) { let g = out.find(g => x <= g.x1 + 1 && x >= g.x0 - 1); if (!g) { g = { x0: x, x1: x, y0: y, y1: y }; out.push(g); } g.x0 = Math.min(g.x0, x); g.x1 = Math.max(g.x1, x); g.y0 = Math.min(g.y0, y); g.y1 = Math.max(g.y1, y); } return out; }
// píxeles de pierna (colores del pantalón) por encima del pie
function roLegPix(p, A, cols, y0, y1) { const out = []; for (let y = Math.round(y0); y <= Math.round(y1); y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) out.push([x, y]); return out; }
const roFront = A => !A.up && !A.side;

// ===================== CABEZA (se dibuja para la cabeza clásica y se escala sola) =====================
fitKind('head', 'of_trapper', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m, f = s.s;
 roEll(p, hx, hy - 4, 8, 5.5, m, true); for (let y = Math.round(hy - 9); y <= hy - 4; y++) for (let x = hx - 8; x <= hx + 8; x++) if (uA(p.get(x, y)) && ((x - hx + 30) % 4 === 0 || (y + 30) % 3 === 0)) p.set(x, y, m[1]);
 roRow(p, hx - 8, hx + 8, hy - 4, f[3]); roRow(p, hx - 8, hx + 8, hy - 3, f[2]);
 const flaps = side ? [-d] : [-1, 1]; for (const sg of flaps) for (let y = Math.round(hy - 3); y <= hy + 3; y++) for (let i = 0; i < 3; i++) roSet(p, hx + sg * (7 + i) - (sg < 0 ? 0 : 0), y, f[y === Math.round(hy + 3) ? 1 : i === 1 ? 3 : 2]);
 if (!up && !side) roSet(p, hx, hy - 8, f[4]); });
fitKind('head', 'of_hardhat', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m;
 roEll(p, hx, hy - 3, 8, 6, m, true); roRow(p, hx - 9, hx + 9, hy - 3, m[1]); roRow(p, hx - 8, hx + 8, hy - 2, m[0]); if (!side) for (let y = Math.round(hy - 9); y < hy - 3; y++) roSet(p, hx, y, m[4]);
 if (!up) { const lx = side ? hx + d * 6 : hx, ly = hy - 6; roRect(p, lx - 1, ly - 1, 3, 3, RO_SV[1]); roSet(p, lx, ly, C('#fff6a0')); roSet(p, lx, ly - 1, C('#ffd040')); if (side) roSet(p, lx + d, ly, C('#fff6a0')); } });
fitKind('head', 'of_bucket', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m;
 for (let y = Math.round(hy - 10); y <= hy - 4; y++) { const t = (y - (hy - 10)) / 6, half = Math.round(5 + t * 2); for (let x = hx - half; x <= hx + half; x++) p.set(x, y, m[x < hx - half + 2 ? 3 : x > hx + half - 2 ? 1 : 2]); }
 roRow(p, hx - 6, hx + 6, hy - 5, s.s[2]); for (let x = hx - 10; x <= hx + 10; x++) { const e = Math.abs(x - hx) > 7 ? 1 : 0; roSet(p, x, hy - 4 + e, m[1]); roSet(p, x, hy - 3 + e, m[0]); }
 if (!up) { const lx = side ? hx - d * 3 : hx + 3; roSet(p, lx, hy - 8, C('#e83a3a')); roSet(p, lx, hy - 7, RO_W); roSet(p, lx + 1, hy - 6, RO_SV[3]); if (!side) { roSet(p, hx - 4, hy - 7, C('#3ab0ff')); roSet(p, hx - 4, hy - 6, C('#ffd040')); } } });
fitKind('head', 'of_wreath', (p, A, s) => { const { hx, hy, side, up, d } = A, G = s.m, L = s.s;
 for (let i = -8; i <= 8; i++) { if (side && i * d > 3) continue; const y = Math.round(hy - 5 + Math.abs(i) * 0.18); roSet(p, hx + i, y, G[i % 2 ? 2 : 3]); if (i % 2 === 0) roSet(p, hx + i, y - 1, G[4]); }
 for (const [dx, h] of [[-4, 4], [0, 5], [4, 4]]) { if (side && dx * d > 1) continue; for (let k = 1; k <= h; k++) roSet(p, hx + dx + (k > 2 ? Math.sign(dx) : 0), hy - 5 - k, G[1]); roSet(p, hx + dx - 1, hy - 7, G[3]); roSet(p, hx + dx + 1, hy - 8, G[3]); roSet(p, hx + dx + Math.sign(dx || 1), hy - 5 - h, L[3]); roSet(p, hx + dx, hy - 6 - h, L[4]); } });
fitKind('head', 'of_goggles', (p, A, s) => { const { hx, hy, side, up, d } = A, St = s.m, Br = RO_G;
 roRow(p, hx - 8, hx + 8, hy - 5, St[1]); roRow(p, hx - 8, hx + 8, hy - 4, St[2]);
 if (up) { roRect(p, hx - 1, hy - 6, 3, 3, Br[3]); roSet(p, hx, hy - 5, Br[5]); return; }
 const lenses = side ? [hx + d * 3] : [hx - 3, hx + 3]; for (const lx of lenses) { roEll(p, lx, hy - 7, 2.6, 2.6, [Br[2], Br[2], Br[3], Br[4]]); roSet(p, lx, hy - 7, C('#2a3a3a')); roSet(p, lx + (side ? d : 1), hy - 7, C('#3a5a5a')); roSet(p, lx - 1, hy - 8, C('#a8f0e0')); } if (!side) roRow(p, hx - 1, hx + 1, hy - 7, Br[2]); });
fitKind('head', 'of_vialband', (p, A, s) => { const { hx, hy, side, up, d } = A, B = s.m;
 roRow(p, hx - 8, hx + 8, hy - 5, B[2]); roRow(p, hx - 8, hx + 8, hy - 4, B[1]);
 const vials = [[-4, '#5ae07a'], [0, '#c070ff'], [4, '#ff5a6a']]; for (const [dx, c] of vials) { if (side && dx * d > 1) continue; if (up && dx === 0) continue; const x = hx + dx; roSet(p, x, hy - 9, RO_SV[3]); roRect(p, x - 1, hy - 8, 2, 3, C('#d8f0ff')); roRow(p, x - 1, x, hy - 7, C(c)); roRow(p, x - 1, x, hy - 6, uMul(C(c), 0.7)); } });
fitKind('head', 'of_toque', (p, A, s) => { const { hx, hy, side, up } = A, m = s.m;
 roRect(p, hx - 7, hy - 6, 15, 3, m[3]); roRow(p, hx - 7, hx + 7, hy - 4, m[2]);
 roEll(p, hx, hy - 11, 7.5, 5, [m[2], m[2], m[4], m[4]]); for (let x = hx - 5; x <= hx + 5; x += 3) for (let y = Math.round(hy - 14); y < hy - 6; y++) if (uA(p.get(x, y))) p.set(x, y, m[2]); });
fitKind('head', 'of_pith', (p, A, s) => { const { hx, hy, side, up } = A, m = s.m;
 roEll(p, hx, hy - 3, 7.5, 6.5, m, true); for (let x = hx - 11; x <= hx + 11; x++) { const e = Math.abs(x - hx) > 8 ? 1 : 0; roSet(p, x, hy - 3 + e, m[1]); } roRow(p, hx - 7, hx + 7, hy - 4, s.s[1]); roSet(p, hx, hy - 10, m[4]); roSet(p, hx, hy - 9, m[3]); });
fitKind('head', 'of_strawwide', (p, A, s) => { const { hx, hy, side, up } = A, m = s.m;
 for (let x = hx - 13; x <= hx + 13; x++) { const e = Math.abs(x - hx) > 10 ? 1 : 0; roSet(p, x, hy - 4 + e, m[(x % 2) ? 2 : 3]); if (Math.abs(x - hx) < 12) roSet(p, x, hy - 3 + e, m[1]); }
 roSet(p, hx - 13, hy - 2, m[1]); roSet(p, hx + 13, hy - 2, m[1]); roEll(p, hx, hy - 5, 5.5, 4, m, true); roRow(p, hx - 5, hx + 5, hy - 5, s.s[2]); roRow(p, hx - 5, hx + 5, hy - 6, s.s[3]); });
fitKind('head', 'of_loupe', (p, A, s) => { const { hx, hy, side, up, d } = A;
 roRow(p, hx - 8, hx + 8, hy - 5, RO_G[3]); roRow(p, hx - 7, hx + 7, hy - 6, RO_G[4]);
 if (!up) { const lx = side ? hx + d * 3 : hx + 3; roRect(p, lx - 1, hy - 9, 3, 3, RO_K); roSet(p, lx, hy - 10, RO_G[4]); roSet(p, lx, hy - 8, C('#bfe8ff')); if (!side) { roSet(p, hx - 2, hy - 6, C(s.gem || '#e83a8a')); roSet(p, hx - 2, hy - 7, RO_W); } } });
fitKind('head', 'of_pinhat', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m, ox = side ? -d : 2;
 roRect(p, hx + ox - 4, hy - 8, 9, 3, m[2]); roRow(p, hx + ox - 4, hx + ox + 4, hy - 8, m[4]); roRow(p, hx + ox - 4, hx + ox + 4, hy - 6, m[1]);
 for (const [dx, c] of [[-2, '#e83a3a'], [1, '#3a8ad0'], [3, '#ffd040']]) { roSet(p, hx + ox + dx, hy - 9, RO_SV[3]); roSet(p, hx + ox + dx, hy - 10, C(c)); }
 if (!side || d < 0) { const tx = hx + 7; for (let y = Math.round(hy - 6); y <= hy + 2; y++) roSet(p, tx, y, (y % 2) ? C('#ffd040') : RO_K); } });
fitKind('head', 'of_divemask', (p, A, s) => { const { hx, side, up, d } = A, ey = A.ey, fr = s.m[1], gl = C('#9ad8f0');
 if (up) { roRow(p, hx - 8, hx + 8, ey, fr); roRect(p, hx + 5, ey - 7, 2, 7, C('#ffd040')); return; }
 if (side) { const ex = d > 0 ? hx + 1 : hx - 6; roRect(p, ex, ey - 1, 6, 4, fr); roRect(p, ex + 1, ey, 4, 2, gl); roSet(p, ex + (d > 0 ? 3 : 2), ey, RO_W); roRow(p, hx - 7, ex, ey, fr); roRect(p, hx - d * 5, ey - 8, 2, 9, C('#ffd040')); return; }
 roRect(p, A.eyes[0] - 2, ey - 1, A.eyes[1] - A.eyes[0] + 6, 4, fr); roRect(p, A.eyes[0] - 1, ey, A.eyes[1] - A.eyes[0] + 4, 2, gl); roSet(p, A.eyes[0], ey, RO_W); roSet(p, A.eyes[1] + 1, ey, RO_W); roSet(p, hx, ey, fr);
 roRow(p, hx - 8, A.eyes[0] - 2, ey, fr); roRow(p, A.eyes[1] + 3, hx + 8, ey, fr); roRect(p, hx + 8, ey - 8, 2, 9, C('#ffd040')); roSet(p, hx + 7, ey - 8, C('#ffd040')); }, { face: true });
fitKind('head', 'of_wingband', (p, A, s) => { const { hx, hy, side, up, d } = A, W = s.m;
 roRow(p, hx - 8, hx + 8, hy - 5, s.s[2]); roRow(p, hx - 8, hx + 8, hy - 4, s.s[1]);
 for (const sg of side ? [-d] : [-1, 1]) for (let r = 0; r < 4; r++) for (let i = 0; i < 5 - r; i++) roSet(p, hx + sg * (8 + i), hy - 5 - r - Math.round(i * 0.7), W[r === 0 ? 2 : 4 - (i % 2)]); });
fitKind('head', 'of_laurel', (p, A, s) => { const { hx, hy, side, up, d } = A, G = RO_G;
 for (let i = -7; i <= 7; i++) { if (side && i * d > 4) continue; const y = Math.round(hy - 5 + Math.abs(i) * 0.25); roSet(p, hx + i, y, G[3]); if (Math.abs(i) % 2 === 1) { roSet(p, hx + i, y - 1, G[5]); roSet(p, hx + i + Math.sign(i), y - 1, G[4]); } }
 if (up) { roSet(p, hx - 1, hy - 3, C('#c83a3a')); roSet(p, hx + 1, hy - 3, C('#c83a3a')); roSet(p, hx - 1, hy - 1, C('#c83a3a')); roSet(p, hx + 2, hy - 1, C('#c83a3a')); } });
fitKind('head', 'of_visor', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m;
 roRow(p, hx - 8, hx + 8, hy - 6, m[2]); roRow(p, hx - 8, hx + 8, hy - 5, m[1]);
 if (!up) { if (side) { roRow(p, hx + d * 6, hx + d * 10, hy - 5, m[3]); roRow(p, hx + d * 7, hx + d * 10, hy - 4, m[2]); } else { roRow(p, hx - 6, hx + 6, hy - 4, m[3]); roRow(p, hx - 5, hx + 5, hy - 3, m[2]); } }
 const fx = side ? hx - d * 5 : hx - 6; roSet(p, fx, hy - 8, C('#ff5a8a')); roSet(p, fx - 1, hy - 7, C('#ff5a8a')); roSet(p, fx + 1, hy - 7, C('#ff5a8a')); roSet(p, fx, hy - 7, C('#ffd040')); roSet(p, fx, hy - 6, C('#ff5a8a')); });
fitKind('head', 'of_beret', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m, ox = side ? -d : 1;
 roEll(p, hx + ox, hy - 7, 8.5, 3.4, m); roSet(p, hx + ox, hy - 11, m[1]); roRow(p, hx - 7 + ox, hx + 7 + ox, hy - 4, m[1]);
 if (!up) { const bx = side ? hx - d * 7 : hx + 7; for (let k = 0; k < 6; k++) roSet(p, bx + (side ? -d : 1) * Math.round(k * 0.5), hy - 3 - k, C('#986236')); roSet(p, bx + (side ? -d : 1) * 3, hy - 9, C('#e83a5a')); roSet(p, bx + (side ? -d : 1) * 3, hy - 10, C('#3a8ad0')); } });
fitKind('head', 'of_fez', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m;
 for (let y = Math.round(hy - 11); y <= hy - 4; y++) { const half = Math.round(3.5 + (y - (hy - 11)) * 0.25); for (let x = hx - half; x <= hx + half; x++) p.set(x, y, m[x === hx - half ? 3 : x === hx + half ? 1 : 2]); }
 roRow(p, hx - 4, hx + 4, hy - 11, m[4]); const tx = side ? hx - d * 4 : hx + 3; roSet(p, hx, hy - 12, RO_K); for (let k = 0; k < 6; k++) roSet(p, tx, hy - 11 + k, RO_K); roSet(p, tx, hy - 5, RO_G[4]); });
fitKind('head', 'of_fedora', (p, A, s) => { const { hx, hy, side, up } = A, m = s.m;
 roEll(p, hx, hy - 5, 6.5, 5, m, true); if (!side) { roSet(p, hx, hy - 10, 0); roSet(p, hx, hy - 9, m[1]); } roRow(p, hx - 6, hx + 6, hy - 6, s.s[1]); roRow(p, hx - 6, hx + 6, hy - 5, s.s[2]);
 for (let x = hx - 10; x <= hx + 10; x++) { const e = Math.abs(x - hx) > 7 ? -1 : 0; roSet(p, x, hy - 4 + e, m[1]); } });
fitKind('head', 'of_brushpins', (p, A, s) => { const { hx, hy, side, up, d } = A;
 const bx = side ? hx - d * 3 : hx + 2; for (let k = 0; k < 7; k++) { roSet(p, bx - 3 + k, hy - 9 + Math.round(k * 0.5), C('#986236')); roSet(p, bx + 3 - k, hy - 9 + Math.round(k * 0.5), C('#7a4c29')); }
 roSet(p, bx - 4, hy - 10, C('#c070ff')); roSet(p, bx - 3, hy - 10, C('#c070ff')); roSet(p, bx + 4, hy - 10, C('#ffd040')); roSet(p, bx + 3, hy - 10, C('#ffd040'));
 roSet(p, bx, hy - 7, C('#ffe060')); roSet(p, bx - 1, hy - 7, C('#ffd040')); roSet(p, bx + 1, hy - 7, C('#ffd040')); roSet(p, bx, hy - 8, C('#ffd040')); roSet(p, bx, hy - 6, C('#ffd040')); });
fitKind('head', 'of_kasa', (p, A, s) => { const { hx, hy, side, up } = A, m = s.m;
 for (let y = Math.round(hy - 12); y <= hy - 3; y++) { const half = Math.round((y - (hy - 12)) * 1.25); for (let x = hx - half; x <= hx + half; x++) p.set(x, y, m[(x - hx + 40) % 3 === 0 ? 1 : x < hx ? 3 : 2]); }
 roRow(p, hx - 11, hx + 11, hy - 3, m[1]); roSet(p, hx, hy - 13, m[4]); });
fitKind('head', 'of_tenugui', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m;
 for (let y = Math.round(hy - 8); y <= hy - 4; y++) for (let x = hx - 8; x <= hx + 8; x++) { const dx = (x + 0.5 - hx) / 8.2, dy = (y + 0.5 - (hy - 4)) / 5; if (dx * dx + dy * dy > 1) continue; p.set(x, y, (x + y) % 4 === 0 ? s.s[2] : m[x < hx ? 4 : 3]); }
 roRow(p, hx - 8, hx + 8, hy - 4, s.s[2]); if (roFront(A)) { roRect(p, hx - 1, hy - 7, 3, 2, m[4]); roSet(p, hx - 3, hy - 8, m[3]); roSet(p, hx + 3, hy - 8, m[3]); roSet(p, hx - 2, hy - 8, m[4]); roSet(p, hx + 2, hy - 8, m[4]); }
 else if (side) { roSet(p, hx + d * 7, hy - 7, m[4]); roSet(p, hx + d * 8, hy - 8, m[3]); } });
fitKind('head', 'of_eboshi', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m, lean = side ? -d : 0;
 roEll(p, hx, hy - 5, 6, 3, m, true); for (let k = 0; k < 7; k++) { const half = Math.round(3 - k * 0.3); for (let x = -half; x <= half; x++) roSet(p, hx + x + Math.round(lean * k * 0.4), hy - 7 - k, m[x === -half ? 3 : 2]); }
 roSet(p, hx - 1 + Math.round(lean * 2), hy - 10, m[4]); if (!up) { roSet(p, hx - 6, hy - 2, RO_W); roSet(p, hx + 6, hy - 2, RO_W); } });
fitKind('head', 'of_headwrap', (p, A, s) => { const { hx, hy, side, up, d } = A, m = s.m;
 roEll(p, hx, hy - 4, 8.2, 6, m, true); roRow(p, hx - 8, hx + 8, hy - 4, m[1]);
 for (const [x, y] of [[-3, -7], [2, -6], [5, -8]]) roSet(p, hx + x, hy + y, s.s[1]);
 const kx = up ? hx : side ? hx - d * 8 : null; if (kx !== null) { roRect(p, kx - 1, hy - 6, 3, 3, m[3]); roSet(p, kx + (up ? -2 : -d), hy - 3, m[2]); roSet(p, kx + (up ? 2 : -d * 2), hy - 2, m[1]); } });

// ===================== CUERPO (encima del torso base; las mangas usan s.m) =====================
const roT = A => ({ x0: A.tx0, x1: A.tx0 + A.tw - 1, y0: A.torsoTop, y1: A.torsoTop + A.th - 1, cx: A.cx });
const roPaint = (p, T, fn) => { for (let y = T.y0; y <= T.y1; y++) for (let x = T.x0; x <= T.x1; x++) if (uA(p.get(x, y))) { const c = fn(x, y); if (c) p.set(x, y, c); } };
function roHem(p, A, to, P, open) { const { tx0, tw, torsoTop: ty, th, legTop, up, side } = A; for (let y = ty + th - 1; y <= Math.min(to, A.base - 3); y++) for (let x = tx0; x < tx0 + tw; x++) { if (!up && !side && open && Math.abs(x + 0.5 - A.cx) < 1.5) continue; p.set(x, y, P[x === tx0 ? 3 : x === tx0 + tw - 1 ? 1 : (x + y) % 6 ? 2 : 1]); } }
fitKind('body', 'of_flannel', (p, A, s) => { const T = roT(A), m = s.m, b = s.s; roPaint(p, T, (x, y) => (x % 3 === 0 && y % 3 === 0) ? m[0] : (x % 3 === 0 || y % 3 === 0) ? m[1] : null);
 if (!A.up) { const xs = A.side ? [A.cx - 1] : [A.cx - 3, A.cx + 2]; for (const x of xs) for (let y = T.y0; y <= T.y1; y++) p.set(x, y, b[1]); if (!A.side) { roSet(p, A.cx - 1, T.y0, m[4]); roSet(p, A.cx, T.y0, m[4]); } }
 else for (let i = 0; i <= T.y1 - T.y0; i++) { roSet(p, T.x0 + 1 + i * 0.7, T.y0 + i, b[1]); roSet(p, T.x1 - 1 - i * 0.7, T.y0 + i, b[1]); } });
fitKind('body', 'of_minejacket', (p, A, s) => { const T = roT(A), m = s.m, Y = s.s, y1 = T.y0 + Math.round(A.th * 0.35), y2 = T.y0 + Math.round(A.th * 0.65);
 roRow(p, T.x0, T.x1, y1, Y[3]); roRow(p, T.x0, T.x1, y2, Y[3]); roRow(p, T.x0, T.x1, y1 + 1, RO_SV[4]);
 if (roFront(A)) { roRect(p, A.cx - 3, T.y0 + 1, 2, 2, m[1]); roSet(p, A.cx + 2, T.y1 - 1, C('#e83a3a')); for (let y = T.y0; y < T.y1; y++) roSet(p, A.cx, y, RO_SV[2]); } });
fitKind('body', 'of_raincoat', (p, A, s) => { const T = roT(A), m = s.m; roHem(p, A, A.legTop + 5, m, true);
 if (!A.up) { roRow(p, T.x0 - 1, T.x1 + 1, T.y0, m[4]); if (!A.side) { for (const y of [T.y0 + 2, T.y0 + 4, T.y1 - 1]) { roSet(p, A.cx - 2, y, C('#7a4c29')); roSet(p, A.cx + 1, y, C('#7a4c29')); } for (let y = T.y0 + 1; y <= A.legTop + 4; y++) roSet(p, A.cx, y, m[1]); } }
 else { roEll(p, A.cx, T.y0 + 1, 4, 2.5, m); } });
fitKind('body', 'of_herbapron', (p, A, s) => { const T = roT(A), a = s.s; if (A.up) { roRow(p, T.x0, T.x1, T.y1 - 2, a[2]); roSet(p, A.cx, T.y1 - 1, a[2]); roSet(p, A.cx - 1, T.y1, a[1]); roSet(p, A.cx + 1, T.y1, a[1]); return; }
 const x0 = A.side ? A.cx - 1 + A.d * 1 - 1 : T.x0 + 1, w = A.side ? 3 : A.tw - 2; for (let y = T.y0 + 3; y <= A.legTop + 3; y++) roRow(p, x0, x0 + w - 1, y, a[y > T.y1 ? 1 : 2]);
 if (!A.side) for (const px of [T.x0 + 2, T.x1 - 3]) { roRect(p, px, T.y1 - 2, 2, 2, a[3]); roSet(p, px, T.y1 - 3, C('#5ab04a')); roSet(p, px + 1, T.y1 - 4, C('#3a9a3a')); roSet(p, px + 1, T.y1 - 3, C('#c8a0ff')); } });
fitKind('body', 'of_bibapron', (p, A, s) => { const T = roT(A), L = s.s; if (A.up) { for (let i = 0; i <= T.y1 - T.y0; i++) { roSet(p, T.x0 + 1 + i * 0.6, T.y0 + i, L[1]); roSet(p, T.x1 - 1 - i * 0.6, T.y0 + i, L[1]); } roRow(p, T.x0, T.x1, T.y1 - 2, L[1]); return; }
 const x0 = A.side ? A.cx - 2 + A.d : A.cx - 3, w = A.side ? 3 : 6; for (let y = T.y0 + 2; y <= A.legTop + 4; y++) roRow(p, x0, x0 + w - 1, y, L[y === T.y0 + 2 ? 3 : 2]);
 if (!A.side) { roSet(p, T.x0 + 1, T.y0, L[1]); roSet(p, T.x0 + 2, T.y0 + 1, L[1]); roSet(p, T.x1 - 1, T.y0, L[1]); roSet(p, T.x1 - 2, T.y0 + 1, L[1]); roSet(p, x0, T.y0 + 2, RO_G[4]); roSet(p, x0 + w - 1, T.y0 + 2, RO_G[4]); roRect(p, A.cx - 1, T.y1 - 1, 2, 2, L[1]); } });
fitKind('body', 'of_labcoat', (p, A, s) => { const T = roT(A), m = s.m; roHem(p, A, A.legTop + 6, m, true);
 if (roFront(A)) { for (let y = T.y0; y <= A.legTop + 5; y++) { roSet(p, A.cx - 1, y, m[1]); roSet(p, A.cx, y, s.s[2]); } roSet(p, A.cx - 3, T.y0, m[4]); roSet(p, A.cx + 2, T.y0, m[4]); roRect(p, T.x0 + 1, T.y0 + 3, 2, 2, m[1]); roSet(p, T.x0 + 1, T.y0 + 2, C('#5ae07a')); roSet(p, T.x0 + 2, T.y0 + 2, C('#c070ff')); } });
fitKind('body', 'of_chef', (p, A, s) => { const T = roT(A), m = s.m; if (roFront(A)) { for (let y = T.y0 + 2; y < T.y1; y += 2) { roSet(p, A.cx - 3, y, s.s[1]); roSet(p, A.cx + 2, y, s.s[1]); } for (let y = T.y0 + 1; y < T.y1; y++) roSet(p, A.cx + 1, y, m[2] === m[1] ? m[1] : m[1]);
  roRow(p, A.cx - 2, A.cx + 1, T.y0, C('#e83a3a')); roSet(p, A.cx - 1, T.y0 + 1, C('#c02a2a')); roSet(p, A.cx, T.y0 + 1, C('#c02a2a')); }
 roRow(p, T.x0, T.x1, T.y1 - 1, m[2]); });
fitKind('body', 'of_safari', (p, A, s) => { const T = roT(A), m = s.m; if (roFront(A)) { for (const px of [T.x0 + 1, T.x1 - 2]) { roRect(p, px, T.y0 + 2, 2, 2, m[1]); roRow(p, px, px + 1, T.y0 + 2, m[3]); } for (let i = 0; i <= T.y1 - T.y0; i++) { roSet(p, T.x0 + i * 0.9, T.y0 + i, s.s[1]); if (i % 2) roSet(p, T.x0 + i * 0.9, T.y0 + i, RO_G[3]); } }
 if (!A.side) { roSet(p, T.x0, T.y0, m[3]); roSet(p, T.x1, T.y0, m[3]); } roRow(p, T.x0, T.x1, T.y1 - 1, C('#5e381e')); });
fitKind('body', 'of_overalls', (p, A, s) => { const T = roT(A), D = s.s; roPaint(p, T, (x, y) => y >= T.y0 + 3 ? D[(x + y) % 5 ? 2 : 1] : null);
 if (!A.side) for (const x of [T.x0 + 1, T.x1 - 1]) for (let y = T.y0; y < T.y0 + 3; y++) roSet(p, x, y, D[1]); if (roFront(A)) { roSet(p, T.x0 + 1, T.y0 + 3, RO_G[4]); roSet(p, T.x1 - 1, T.y0 + 3, RO_G[4]); roRect(p, A.cx - 1, T.y0 + 4, 2, 2, D[3]); } });
fitKind('body', 'of_velvet', (p, A, s) => { const T = roT(A), m = s.m; if (roFront(A)) { for (let i = 0; i < 4; i++) { roSet(p, A.cx - 3 + i, T.y0 + i, RO_G[4]); roSet(p, A.cx + 2 - i, T.y0 + i, RO_G[4]); } roSet(p, A.cx - 1, T.y0 + 4, C('#e83a8a')); roSet(p, A.cx, T.y0 + 4, RO_W); for (const y of [T.y0 + 5, T.y1 - 1]) roSet(p, A.cx - 1, y, RO_G[3]); }
 if (A.up) { roSet(p, A.cx - 1, T.y1 + 1, m[1]); roSet(p, A.cx, T.y1 + 1, m[1]); roSet(p, A.cx - 1, T.y1 + 2, m[1]); } roRow(p, T.x0, T.x1, T.y0, m[4]); });
fitKind('body', 'of_waistcoat', (p, A, s) => { const T = roT(A), m = s.m; roPaint(p, T, (x, y) => x % 2 === 0 ? m[3] : null);
 if (roFront(A)) { for (let i = 0; i < 4; i++) for (let x = A.cx - 3 + i; x <= A.cx + 2 - i; x++) roSet(p, x, T.y0 + i, RO_W); for (const y of [T.y0 + 4, T.y0 + 6]) roSet(p, A.cx, y, RO_G[4]); roRow(p, A.cx + 1, T.x1 - 1, T.y0 + 5, RO_G[3]); }
 const Y = C('#ffd040'); for (const x of A.side ? [A.cx] : [T.x0 + 1, T.x1 - 1]) for (let y = T.y0; y <= T.y1 + 1; y++) roSet(p, x, y, y % 2 ? Y : RO_K); });
fitKind('body', 'of_wetsuit', (p, A, s) => { const T = roT(A), m = s.m, B = s.s; roPaint(p, T, (x, y) => (x <= T.x0 + 1 || x >= T.x1 - 1) ? B[2] : null);
 if (roFront(A)) { for (let y = T.y0; y < T.y1; y++) roSet(p, A.cx, y, RO_SV[3]); roSet(p, A.cx - 3, T.y0 + 2, B[3]); roSet(p, A.cx - 2, T.y0 + 2, B[4]); } if (A.up) for (let y = T.y0; y < T.y1; y++) roSet(p, A.cx, y, B[2]); });
fitKind('body', 'of_track', (p, A, s) => { const T = roT(A), m = s.m; for (let i = 0; i <= T.y1 - T.y0; i++) roSet(p, T.x1 - i * 0.8, T.y0 + i, s.s[3]);
 if (roFront(A)) { roRect(p, A.cx - 2, T.y0 + 2, 4, 3, RO_W); roSet(p, A.cx - 1, T.y0 + 3, RO_K); roSet(p, A.cx + 1, T.y0 + 3, RO_K); roSet(p, A.cx, T.y0 + 3, RO_K); } });
fitKind('body', 'of_toga', (p, A, s) => { const T = roT(A), m = s.m; for (let i = 0; i <= T.y1 - T.y0; i++) { roSet(p, T.x0 + i * 0.8, T.y0 + i, m[1]); roSet(p, T.x0 + 1 + i * 0.8, T.y0 + i, m[4]); }
 roRow(p, T.x0, T.x1, T.y1 - 2, RO_G[3]); roHem(p, A, A.legTop + 2, m, false); for (let x = T.x0; x <= T.x1; x += 2) roSet(p, x, A.legTop + 2, m[1]); });
fitKind('body', 'of_rash', (p, A, s) => { const T = roT(A), W = s.s, cy = T.y0 + Math.round(A.th * 0.45); for (let x = T.x0; x <= T.x1; x++) { const y = cy + Math.round(Math.sin(x * 1.1) * 1.2); roSet(p, x, y, W[3]); roSet(p, x, y + 1, W[2]); roSet(p, x, y - 1, W[4]); }
 roRow(p, T.x0, T.x1, T.y0, W[1]); });
fitKind('body', 'of_smock', (p, A, s) => { const T = roT(A), m = s.m; roHem(p, A, A.legTop + 2, m, false);
 const dots = [[1, 2, '#e83a5a'], [4, 4, '#3a8ad0'], [2, 6, '#ffd040'], [6, 1, '#5ab04a'], [5, 7, '#c070ff']]; for (const [dx, dy, c] of dots) roSet(p, T.x0 + dx % A.tw, T.y0 + dy % (A.th + 2), C(c));
 if (roFront(A)) { roSet(p, A.cx - 2, T.y0, s.s[3]); roSet(p, A.cx + 1, T.y0, s.s[3]); roSet(p, A.cx - 3, T.y0 + 1, s.s[2]); roSet(p, A.cx + 2, T.y0 + 1, s.s[2]); roSet(p, A.cx - 1, T.y0, s.s[4]); roSet(p, A.cx, T.y0, s.s[4]); } });
fitKind('body', 'of_merchant', (p, A, s) => { const T = roT(A), m = s.m; roHem(p, A, A.legTop + 4, m, true); for (let i = 0; i <= T.y1 - T.y0; i++) { roSet(p, T.x0 + i * 0.9, T.y0 + i, s.s[2]); roSet(p, T.x0 + i * 0.9 + 1, T.y0 + i, s.s[3]); }
 const px = A.side ? A.cx : T.x1 - 1; if (!A.up) { roRect(p, px - 1, T.y1, 2, 2, RO_G[3]); roSet(p, px - 1, T.y1, RO_G[5]); } for (let x = T.x0; x <= T.x1; x += 2) roSet(p, x, A.legTop + 4, RO_G[3]); });
fitKind('body', 'of_fieldvest', (p, A, s) => { const T = roT(A), V = s.s; roPaint(p, T, (x, y) => (roFront(A) && Math.abs(x + 0.5 - A.cx) < 1.5) ? null : V[(x + y) % 7 ? 2 : 1]);
 if (roFront(A)) for (const [x, y] of [[T.x0 + 1, T.y0 + 2], [T.x1 - 2, T.y0 + 2], [T.x0 + 1, T.y1 - 2], [T.x1 - 2, T.y1 - 2]]) { roRect(p, x, y, 2, 2, V[1]); roRow(p, x, x + 1, y, V[3]); }
 if (roFront(A)) { roSet(p, T.x1 - 1, T.y0 + 1, C('#986236')); roSet(p, T.x1 - 1, T.y0, C('#f0e0b8')); } });
fitKind('body', 'of_starrobe', (p, A, s) => { const T = roT(A), m = s.m; roHem(p, A, A.base - 3, m, false);
 for (const [dx, dy] of [[1, 1], [5, 3], [2, 6], [7, 8], [3, 11], [6, 14], [1, 16]]) { const x = T.x0 + dx % A.tw, y = T.y0 + dy; if (y < A.base - 3) roSet(p, x, y, C('#ffe060')); }
 if (roFront(A)) { roSet(p, A.cx, T.y0 + 2, RO_W); roSet(p, A.cx - 1, T.y0 + 2, C('#ffe060')); roSet(p, A.cx - 1, T.y0 + 3, C('#ffe060')); } });
fitKind('body', 'of_happi', (p, A, s) => { const T = roT(A), m = s.m, B = s.s; roHem(p, A, A.legTop + 2, m, true);
 if (roFront(A)) for (let y = T.y0; y <= A.legTop + 2; y++) { roSet(p, A.cx - 2, y, B[2]); roSet(p, A.cx + 1, y, B[2]); }
 if (A.up) { roEll(p, A.cx - 0.5, T.y0 + 4, 2.6, 2.6, [RO_W, RO_W, RO_W, RO_W]); roSet(p, A.cx - 1, T.y0 + 4, B[2]); roSet(p, A.cx, T.y0 + 4, B[2]); roSet(p, A.cx - 1, T.y0 + 3, B[2]); }
 roRow(p, T.x0, T.x1, T.y1 - 1, B[2]); roRow(p, T.x0, T.x1, A.legTop + 2, B[2]); });
fitKind('body', 'of_maekake', (p, A, s) => { const T = roT(A), m = s.m, B = s.s; if (roFront(A)) { roSet(p, A.cx - 2, T.y0, RO_W); roSet(p, A.cx - 1, T.y0 + 1, RO_W); roSet(p, A.cx + 1, T.y0, m[1]); }
 if (!A.up) { const x0 = A.side ? A.cx - 2 + A.d : T.x0, w = A.side ? 4 : A.tw; for (let y = T.y1 - 1; y <= A.legTop + 6; y++) roRow(p, x0, x0 + w - 1, y, B[y === T.y1 - 1 ? 3 : 1]);
  if (!A.side) { roEll(p, A.cx - 0.5, A.legTop + 2, 2.5, 2.5, [RO_W, RO_W, RO_W, RO_W]); roSet(p, A.cx - 1, A.legTop + 2, B[1]); roSet(p, A.cx, A.legTop + 2, B[1]); } } else roRow(p, T.x0, T.x1, T.y1 - 1, B[2]); });
fitKind('body', 'of_haori', (p, A, s) => { const T = roT(A), m = s.m; roHem(p, A, A.legTop + 3, m, true); const mon = (x, y) => { roSet(p, x, y, RO_W); roSet(p, x + 1, y, RO_W); roSet(p, x, y + 1, RO_W); roSet(p, x + 1, y + 1, s.s[3]); };
 if (roFront(A)) { mon(T.x0 + 1, T.y0 + 1); mon(T.x1 - 2, T.y0 + 1); roSet(p, A.cx - 1, T.y0 + 4, RO_W); roSet(p, A.cx, T.y0 + 4, RO_W); for (let y = T.y0; y <= A.legTop + 3; y++) roSet(p, A.cx, y, m[1]); } else if (A.up) mon(A.cx - 1, T.y0 + 1); });
fitKind('body', 'of_pottertunic', (p, A, s) => { const T = roT(A), m = s.m, Cl = s.s; roHem(p, A, A.legTop + 1, m, false);
 for (const [dx, dy] of [[1, 2], [5, 4], [3, 7], [6, 6]]) { roSet(p, T.x0 + dx % A.tw, T.y0 + dy, Cl[2]); roSet(p, T.x0 + (dx + 1) % A.tw, T.y0 + dy, Cl[1]); }
 roRow(p, T.x0, T.x1, T.y1 - 1, C('#5e381e')); if (roFront(A)) { roSet(p, T.x1 - 1, T.y1, RO_SV[3]); roSet(p, T.x1 - 1, T.y1 + 1, RO_SV[2]); } });

// ===================== PIERNAS =====================
const roSkin = (p, A, cols, y0) => { const SK = A.sk; if (!SK) return; for (const [x, y] of roLegPix(p, A, cols, y0, A.base - 3)) p.set(x, y, SK[2]); };
fitKind('legs', 'of_workpants', (p, A, s) => { const cols = new Set(s.m), kn = A.legTop + Math.round((A.base - A.legTop) * 0.45); for (const [x, y] of roLegPix(p, A, cols, kn, kn + 1)) p.set(x, y, s.s[(x + y) % 2 ? 2 : 3]);
 for (const [x, y] of roLegPix(p, A, cols, A.base - 4, A.base - 4)) p.set(x, y, s.m[4]); if (!A.up) { const lx = A.side ? A.cx - A.d * 2 : A.tx0; roSet(p, lx, A.legTop + 1, RO_SV[3]); roSet(p, lx, A.legTop + 2, C('#7a4c29')); } });
fitKind('legs', 'of_petalskirt', (p, A, s) => { const { tx0, tw, legTop, side } = A, P = s.m, hem = legTop + 5; roSkin(p, A, new Set(s.m), legTop + 2);
 for (let y = legTop - 1; y <= hem; y++) { const ex = Math.round((y - legTop + 1) * (side ? 0.3 : 0.6)); for (let x = tx0 - ex; x < tx0 + tw + ex; x++) { const k = (x - tx0 + ex) % 3; if (y === hem && k !== 1) continue; p.set(x, y, P[y === hem ? 3 : k === 1 ? 4 : (y % 2 ? 2 : 3)]); } } }, { skin: true });
fitKind('legs', 'of_checkpants', (p, A, s) => { const cols = new Set(s.m); for (const [x, y] of roLegPix(p, A, cols, A.legTop, A.base - 3)) p.set(x, y, ((x >> 0) + (y >> 0)) % 2 ? s.m[1] : s.m[4]); });
fitKind('legs', 'of_cargo', (p, A, s) => { const cols = new Set(s.m), hem = A.legTop + 3; roSkin(p, A, cols, hem + 1); for (const [x, y] of roLegPix(p, A, cols, A.legTop + 1, hem)) if (y === hem) p.set(x, y, s.m[4]);
 if (!A.up) { const sx = A.side ? [A.cx - 1 - A.d] : [A.tx0 - 1, A.tx0 + A.tw]; for (const x of sx) { roSet(p, x, A.legTop + 1, s.m[1]); roSet(p, x, A.legTop + 2, s.m[2]); } } }, { skin: true });
fitKind('legs', 'of_pencilskirt', (p, A, s) => { const { tx0, tw, legTop, side, up } = A, P = s.m, hem = legTop + 5; roSkin(p, A, new Set(s.m), legTop + 1);
 for (let y = legTop - 1; y <= hem; y++) for (let x = tx0; x < tx0 + tw; x++) { if (!up && !side && y >= hem - 1 && x === tx0 + tw - 3) continue; p.set(x, y, P[x === tx0 ? 3 : x === tx0 + tw - 1 ? 1 : 2]); }
 roRow(p, tx0, tx0 + tw - 1, legTop - 1, RO_K); if (!up && !side) roSet(p, A.cx, legTop - 1, RO_G[4]); }, { skin: true });

// ===================== PIES (sobre los píxeles del calzado de cada pie) =====================
const roUp = (p, A, cols, F, n, Pc) => { for (const g of F) for (let k = 1; k <= n; k++) for (let x = g.x0; x <= g.x1; x++) { const y = g.y0 - k; if (uA(p.get(x, y)) && !cols.has(p.get(x, y))) p.set(x, y, Pc(x, y, k)); } };
fitKind('feet', 'of_steeltoe', (p, A, s) => { const F = roFeet(p, A, s); for (const g of F) { const tx = A.side ? (A.d > 0 ? g.x1 : g.x0) : null; for (let x = g.x0; x <= g.x1; x++) roSet(p, x, g.y1, RO_K); if (tx !== null) { roSet(p, tx, g.y1 - 1, RO_SV[3]); roSet(p, tx, g.y1 - 2, RO_SV[2]); } else if (!A.up) roRow(p, g.x0, g.x1, g.y1 - 1, RO_SV[3]); } });
fitKind('feet', 'of_wellies', (p, A, s) => { const F = roFeet(p, A, s), cols = new Set(s.m), n = A.side ? 2 : 3; roUp(p, A, cols, F, n, (x, y, k) => s.m[k === n ? 4 : x % 2 ? 2 : 3]); });
fitKind('feet', 'of_buckleboots', (p, A, s) => { const F = roFeet(p, A, s), cols = new Set(s.m); roUp(p, A, cols, F, 2, (x, y, k) => s.m[k === 2 ? 3 : 2]); for (const g of F) { roRow(p, g.x0, g.x1, g.y1, RO_K); roRow(p, g.x0, g.x1, g.y0 - 1, RO_SV[2]); roSet(p, Math.round((g.x0 + g.x1) / 2), g.y0 - 1, RO_SV[4]); } });
fitKind('feet', 'of_curlshoes', (p, A, s) => { for (const g of roFeet(p, A, s)) { if (A.side) { const tx = A.d > 0 ? g.x1 + 1 : g.x0 - 1; roSet(p, tx, g.y1, s.m[2]); roSet(p, tx + A.d, g.y1 - 1, s.m[3]); roSet(p, tx + A.d, g.y1 - 2, RO_G[4]); } else if (!A.up) { roSet(p, Math.round((g.x0 + g.x1) / 2), g.y1 - 1, RO_G[4]); } roRow(p, g.x0, g.x1, g.y1, s.m[1]); } });
fitKind('feet', 'of_clogs', (p, A, s) => { for (const g of roFeet(p, A, s)) { const ex = A.side ? 1 : 0; roRow(p, g.x0 - (A.side && A.d < 0 ? ex : 0), g.x1 + (A.side && A.d > 0 ? ex : 0), g.y1, s.m[1]); for (let x = g.x0; x <= g.x1; x++) roSet(p, x, g.y1 - 1, s.m[x === g.x0 ? 4 : 3]); } });
fitKind('feet', 'of_flippers', (p, A, s) => { for (const g of roFeet(p, A, s)) { if (A.side) { for (let i = 1; i <= 4; i++) { const x = A.d > 0 ? g.x1 + i : g.x0 - i; roSet(p, x, g.y1, s.m[i % 2 ? 2 : 3]); if (i < 3) roSet(p, x, g.y1 - 1, s.m[1]); } } else { roRow(p, g.x0 - 1, g.x1 + 1, g.y1, s.m[A.up ? 1 : 3]); } } });
fitKind('feet', 'of_wingsandal', (p, A, s) => { for (const g of roFeet(p, A, s)) { const SK = A.sk; if (SK) for (let x = g.x0; x <= g.x1; x++) roSet(p, x, g.y0, SK[2]); roRow(p, g.x0, g.x1, g.y1, RO_G[3]); const wx = A.side ? (A.d > 0 ? g.x0 - 1 : g.x1 + 1) : null;
  for (const x of wx !== null ? [wx] : [g.x0 - 1, g.x1 + 1]) { roSet(p, x, g.y0, RO_W); roSet(p, x + (x < g.x0 ? -1 : 1), g.y0 - 1, C('#e8f0ff')); } } }, { skin: true });
fitKind('feet', 'of_gladiator', (p, A, s) => { const F = roFeet(p, A, s), cols = new Set(s.m); roUp(p, A, cols, F, 4, (x, y, k) => (x + y) % 2 ? RO_G[3] : null); for (const g of F) roRow(p, g.x0, g.x1, g.y1, s.m[1]); });
fitKind('feet', 'of_flipflop', (p, A, s) => { const SK = A.sk; for (const g of roFeet(p, A, s)) { for (let x = g.x0; x <= g.x1; x++) { if (SK) roSet(p, x, g.y0, SK[2]); roSet(p, x, g.y1, s.m[2]); } if (!A.up) roSet(p, Math.round((g.x0 + g.x1) / 2), g.y0, s.s[3]); } }, { skin: true });
fitKind('feet', 'of_paintsneaker', (p, A, s) => { const dots = [C('#e83a5a'), C('#3a8ad0'), C('#ffd040')]; for (const g of roFeet(p, A, s)) { roRow(p, g.x0, g.x1, g.y1, RO_W); roSet(p, g.x0 + 1 > g.x1 ? g.x0 : g.x0 + 1, g.y0, dots[(g.x0) % 3]); } });
fitKind('feet', 'of_babouche', (p, A, s) => { for (const g of roFeet(p, A, s)) { if (A.side) { const tx = A.d > 0 ? g.x1 + 1 : g.x0 - 1; roSet(p, tx, g.y1, s.m[3]); roSet(p, tx, g.y1 - 1, RO_G[4]); } roSet(p, Math.round((g.x0 + g.x1) / 2), g.y0, RO_G[4]); roRow(p, g.x0, g.x1, g.y1, s.m[1]); } });
fitKind('feet', 'of_gaiters', (p, A, s) => { const F = roFeet(p, A, s), cols = new Set(s.m); roUp(p, A, cols, F, 2, (x, y, k) => s.s[k === 2 ? 3 : 2]); for (const g of F) { if (!A.up && !A.side) roSet(p, Math.round((g.x0 + g.x1) / 2), g.y0 - 1, RO_W); roRow(p, g.x0, g.x1, g.y1, RO_K); } });
fitKind('feet', 'of_starslipper', (p, A, s) => { for (const g of roFeet(p, A, s)) { roSet(p, Math.round((g.x0 + g.x1) / 2), g.y0, C('#ffe060')); if (A.side) roSet(p, A.d > 0 ? g.x1 + 1 : g.x0 - 1, g.y0, RO_W); roRow(p, g.x0, g.x1, g.y1, s.m[1]); } });
fitKind('feet', 'of_tabi', (p, A, s) => { const F = roFeet(p, A, s), cols = new Set(s.m); roUp(p, A, cols, F, 1, () => s.m[2]); for (const g of F) { roRow(p, g.x0, g.x1, g.y1, RO_W); if (!A.up && !A.side && g.x1 > g.x0) roSet(p, g.x0 + 1, g.y1 - 1, RO_K); if (A.side) for (let y = g.y0 - 1; y < g.y1; y += 2) roSet(p, A.d > 0 ? g.x0 : g.x1, y, RO_G[3]); } });
fitKind('feet', 'of_geta', (p, A, s) => { for (const g of roFeet(p, A, s)) { for (let x = g.x0; x <= g.x1; x++) { roSet(p, x, g.y0, RO_W); roSet(p, x, g.y1, (x - g.x0) % 2 || A.side ? C('#986236') : C('#5e381e')); } if (!A.up) roSet(p, Math.round((g.x0 + g.x1) / 2), g.y0, C('#c83a3a')); } });
fitKind('feet', 'of_zori', (p, A, s) => { for (const g of roFeet(p, A, s)) { for (let x = g.x0; x <= g.x1; x++) { roSet(p, x, g.y0, RO_W); roSet(p, x, g.y1, C('#d8c088')); } if (!A.up) roSet(p, Math.round((g.x0 + g.x1) / 2), g.y0, C('#e83a5a')); } });
fitKind('feet', 'of_waraji', (p, A, s) => { const SK = A.sk, F = roFeet(p, A, s), cols = new Set(s.m); for (const g of F) for (let x = g.x0; x <= g.x1; x++) { if (SK) roSet(p, x, g.y0, (x + g.y0) % 2 ? SK[2] : C('#c8a070')); roSet(p, x, g.y1, C('#d8c088')); } roUp(p, A, cols, F, 1, (x, y) => (x + y) % 2 ? C('#c8a070') : null); }, { skin: true });

// ===================== ESPALDA =====================
fitKind('back', 'of_jewelmantle', (p, A, s) => { const { cx, tx0, tw, torsoTop: ty, up, side, d } = A, m = s.m, y1 = ty + Math.round(A.th * 0.6);
 if (up) { for (let y = ty - 1; y <= y1; y++) roRow(p, tx0 - 2, tx0 + tw + 1, y, m[y === ty - 1 ? 4 : (y + tx0) % 4 ? 2 : 1]); for (let x = tx0 - 2; x <= tx0 + tw + 1; x++) if ((x - tx0) % 3 === 0) { roSet(p, x, y1 + 1, m[1]); roSet(p, x, y1, [C('#e83a8a'), C('#3ad0ff'), C('#ffd040')][(x + 9) % 3]); } roRow(p, tx0 - 2, tx0 + tw + 1, ty - 1, RO_G[4]); }
 else if (side) { const x = d > 0 ? tx0 - 1 : tx0 + tw; for (let y = ty; y <= y1; y++) roSet(p, x, y, m[2]); roSet(p, x, y1 + 1, C('#e83a8a')); }
 else for (const sx of [tx0 - 1, tx0 + tw]) for (let y = ty + 1; y <= y1; y++) roSet(p, sx, y, m[sx < cx ? 3 : 1]); });

// ===================== asignación a las 69 prendas =====================
// id: [es, en, k, color principal, color secundario, cubierta de la cabeza]
const RO_SPEC = {
 c_of_tala_g: ['Gorro de trampero', 'Trapper hat', 'of_trapper', '#b8322a', '#e0d0b0', 'hat'], c_of_tala_c: ['Camisa de franela', 'Flannel shirt', 'of_flannel', '#c03a2a', '#4a2a1a'], c_of_tala_p: ['Pantalón con rodilleras', 'Patched work trousers', 'of_workpants', '#3a4a6a', '#c8a070'],
 c_of_min_g: ['Casco con linterna', 'Lamp hard hat', 'of_hardhat', '#e0b030', '#5d5c66', 'hat'], c_of_min_c: ['Chaqueta reflectante', 'Hi-vis jacket', 'of_minejacket', '#3a3a48', '#e8c020'], c_of_min_b: ['Botas con puntera de acero', 'Steel-toe boots', 'of_steeltoe', '#5a3a1a', '#8a8a96'],
 c_of_pes_g: ['Gorro con anzuelos', 'Bucket hat with lures', 'of_bucket', '#7a8a5a', '#5a4a2a', 'hat'], c_of_pes_c: ['Impermeable de pescador', 'Fisher raincoat', 'of_raincoat', '#ffd030', '#c89a20'], c_of_pes_b: ['Botas altas de agua', 'Tall wellies', 'of_wellies', '#2a6a4a', '#1a3a2a'],
 c_of_her_g: ['Corona de ramitas', 'Sprig crown', 'of_wreath', '#3a8a3a', '#b090e0', 'hat'], c_of_her_c: ['Delantal de herbolaria', 'Herbalist apron', 'of_herbapron', '#e8dcc0', '#5a8a4a'], c_of_her_p: ['Falda de pétalos', 'Petal skirt', 'of_petalskirt', '#e870a0', '#f0c0d0'],
 c_of_hrr_g: ['Gafas de forja', 'Forge goggles', 'of_goggles', '#5a3a1a', '#c8a040', 'hat'], c_of_hrr_c: ['Peto de herrero', 'Smith bib apron', 'of_bibapron', '#8a8a96', '#7a4a2a'], c_of_hrr_b: ['Botas de hebillas', 'Buckled boots', 'of_buckleboots', '#3a2a20', '#8a8a96'],
 c_of_alq_g: ['Diadema de frascos', 'Vial headband', 'of_vialband', '#5a3a8a', '#c8a040', 'hat'], c_of_alq_c: ['Bata de laboratorio', 'Lab coat', 'of_labcoat', '#f0f0f4', '#5a8ad0'], c_of_alq_b: ['Zapatos de punta rizada', 'Curled-toe shoes', 'of_curlshoes', '#4a2a6a', '#c8a040'],
 c_of_coc_g: ['Gorro alto de chef', 'Tall chef toque', 'of_toque', '#f4f4f0', '#d8d8e0', 'hat'], c_of_coc_c: ['Chaqueta cruzada de chef', 'Double-breasted chef jacket', 'of_chef', '#f4f4f0', '#3a3a40'], c_of_coc_p: ['Pantalón de pata de gallo', 'Houndstooth trousers', 'of_checkpants', '#3a3a40', '#e8e8e8'],
 c_of_exc_g: ['Salacot', 'Pith helmet', 'of_pith', '#d8c088', '#7a5a3a', 'hat'], c_of_exc_c: ['Camisa de safari', 'Safari shirt', 'of_safari', '#c8b080', '#7a4c29'], c_of_exc_p: ['Pantalón corto de bolsillos', 'Cargo shorts', 'of_cargo', '#8a7a4a', '#c8b080'],
 c_of_agr_g: ['Sombrero de paja de ala ancha', 'Wide straw hat', 'of_strawwide', '#e0c070', '#c83a3a', 'hat'], c_of_agr_c: ['Peto vaquero de granja', 'Farm denim overalls', 'of_overalls', '#e8e0d0', '#4a6aa0'], c_of_agr_b: ['Zuecos de madera', 'Wooden clogs', 'of_clogs', '#b07a3a', '#e0b070'],
 c_of_joy_g: ['Cinta con lupa de joyera', 'Jeweller loupe band', 'of_loupe', '#ffd040', '#e83a8a', 'hat'], c_of_joy_c: ['Chaqueta de terciopelo con broche', 'Velvet jacket with brooch', 'of_velvet', '#5a1a4a', '#ffd040'], c_of_joy_k: ['Esclavina de gemas', 'Jewelled capelet', 'of_jewelmantle', '#8a2a7a', '#ffd040'],
 c_of_sas_g: ['Sombrerito con alfileres', 'Pinned pillbox hat', 'of_pinhat', '#3a3a6a', '#ffd040', 'hat'], c_of_sas_c: ['Chaleco de raya diplomática', 'Pinstripe waistcoat', 'of_waistcoat', '#2a2a40', '#ffd040'], c_of_sas_p: ['Falda de tubo con abertura', 'Slit pencil skirt', 'of_pencilskirt', '#2a2a3a', '#5a5a6a'],
 c_of_buc_g: ['Gafas de buceo con tubo', 'Mask and snorkel', 'of_divemask', '#2a5a8a', '#c8f0ff', 'face'], c_of_buc_c: ['Traje de neopreno', 'Wetsuit', 'of_wetsuit', '#1a1a24', '#2a8ad0'], c_of_buc_b: ['Aletas de buceo', 'Diving fins', 'of_flippers', '#2a8ad0', '#1a3a6a'],
 c_of_carrera_g: ['Cinta con alas', 'Winged headband', 'of_wingband', '#f0f4ff', '#5a8ad0', 'hat'], c_of_carrera_c: ['Camiseta de corredor con dorsal', 'Runner shirt with bib', 'of_track', '#5a8ad0', '#ffffff'], c_of_carrera_b: ['Sandalias aladas', 'Winged sandals', 'of_wingsandal', '#ffd040', '#ffffff'],
 c_of_olimpiadas_g: ['Corona de laurel dorada', 'Golden laurel wreath', 'of_laurel', '#ffd040', '#c83a3a', 'hat'], c_of_olimpiadas_c: ['Toga olímpica', 'Olympic toga', 'of_toga', '#f4f4f0', '#ffd040'], c_of_olimpiadas_b: ['Sandalias de gladiador', 'Gladiator sandals', 'of_gladiator', '#8a5a2a', '#ffd040'],
 c_of_surf_g: ['Visera con flor', 'Visor with flower', 'of_visor', '#2ab0e0', '#ff8a3a', 'hat'], c_of_surf_c: ['Licra de surf con ola', 'Wave rash guard', 'of_rash', '#1a3a6a', '#2ab0e0'], c_of_surf_b: ['Chanclas de playa', 'Beach flip-flops', 'of_flipflop', '#ff8a3a', '#ffd040'],
 c_of_arte_g: ['Boina de pintor con pincel', 'Painter beret with brush', 'of_beret', '#3a2a5a', '#e85a8a', 'hat'], c_of_arte_c: ['Blusón de pintor manchado', 'Paint-splattered smock', 'of_smock', '#e8e0d0', '#3a6ad0'], c_of_arte_b: ['Zapatillas salpicadas', 'Paint-splashed sneakers', 'of_paintsneaker', '#e8e8f0', '#3a3a40'],
 c_of_comercio_g: ['Fez de mercader', 'Merchant fez', 'of_fez', '#b8282a', '#1a1418', 'hat'], c_of_comercio_c: ['Casaca de mercader con faja', 'Merchant coat with sash', 'of_merchant', '#2a4a6a', '#c8a040'], c_of_comercio_b: ['Babuchas puntiagudas', 'Pointed babouches', 'of_babouche', '#c83a3a', '#ffd040'],
 c_of_arqueologia_g: ['Sombrero de explorador abollado', 'Dented fedora', 'of_fedora', '#8a6a4a', '#3a2a1a', 'hat'], c_of_arqueologia_c: ['Chaleco de campo con bolsillos', 'Many-pocket field vest', 'of_fieldvest', '#e8dcc0', '#7a6a3a'], c_of_arqueologia_b: ['Botas con polainas', 'Boots with gaiters', 'of_gaiters', '#5a3a1a', '#c8b080'],
 c_of_artista_g: ['Pinceles en el pelo', 'Paintbrush hairpins', 'of_brushpins', '#986236', '#c070ff', 'hat'], c_of_artista_c: ['Bata estrellada', 'Starry robe', 'of_starrobe', '#2a1a4a', '#c070ff'], c_of_artista_b: ['Zapatillas de estrella', 'Star slippers', 'of_starslipper', '#5a3a8a', '#ffe060'],
 c_of_rickshaw_g: ['Sombrero de paja cónico', 'Conical straw kasa', 'of_kasa', '#d8b070', '#7a4c29', 'hat'], c_of_rickshaw_c: ['Chaqueta happi', 'Happi coat', 'of_happi', '#2a2a5a', '#c83a3a'], c_of_rickshaw_b: ['Botas tabi de trabajo', 'Jika-tabi boots', 'of_tabi', '#1a1a3a', '#2a2a4a'],
 c_of_sakero_g: ['Tenugui anudado', 'Knotted tenugui', 'of_tenugui', '#f4f4f0', '#3a5aa0', 'hat'], c_of_sakero_c: ['Mandil maekake', 'Maekake apron', 'of_maekake', '#3a4a6a', '#1a2a5a'], c_of_sakero_b: ['Geta de madera', 'Wooden geta', 'of_geta', '#986236', '#5e381e'],
 c_of_sado_g: ['Tocado de la ceremonia', 'Ceremony cap', 'of_eboshi', '#1a1a20', '#5a5a64', 'hat'], c_of_sado_c: ['Haori con blasones', 'Crested haori', 'of_haori', '#3a5a3a', '#c8a070'], c_of_sado_b: ['Zori con calcetín tabi', 'Zori with tabi socks', 'of_zori', '#f4f4f0', '#d8c088'],
 c_of_ceramica_g: ['Pañuelo de alfarera', 'Potter headwrap', 'of_headwrap', '#b0603a', '#7a4a2a', 'hat'], c_of_ceramica_c: ['Túnica de alfarero', 'Potter tunic', 'of_pottertunic', '#7a8a9a', '#a0603a'], c_of_ceramica_b: ['Sandalias de paja waraji', 'Straw waraji', 'of_waraji', '#c8a070', '#8a6a3a'],
};
for (const id in RO_SPEC) { const C_ = COSM[id]; if (!C_) continue; const [es, en, k, a, b, cover] = RO_SPEC[id];
 C_.n = L2(es, en); if (ITEMS['cosi_' + id]) ITEMS['cosi_' + id].n = C_.n;
 C_.vis = C_.slot === 'back' ? () => ({ k, m: RO(a), s: RO(b), o: RO(a), i: RO(b) }) : () => Object.assign({ k, m: RO(a), s: RO(b) }, C_.slot === 'head' ? { cover: cover === 'face' ? 'hat' : 'hat' } : {}); }
