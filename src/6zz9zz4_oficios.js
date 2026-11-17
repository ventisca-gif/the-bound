// ================= v5.04: OFICIOS QUE MERECEN LA PENA =================
// - Ritmo: hace falta menos experiencia desde el nivel 20 (hasta un 55 % menos) y las 30 primeras acciones de cada día dan +50 %.
// - Cada oficio desbloquea algo cada 5 niveles: productos para vender o regalar, muebles y decoración, ropa del oficio,
//   platos nuevos y ventajas de oro. Nada de esto da fuerza, salvo un +0,1 % de ataque por oficio en nivel 50 (máximo +1 %).
// - Gremio de Oficios en cada pueblo: pedidos diarios, taller para los oficios sin mesa propia y maestrías para todos.
// No se borra ni se cambia nada anterior: recetas, ventajas y maestrías existentes siguen igual.
SAVEKEYS.push('ofx');
function ofx() { const P = G.P; P.ofx = P.ofx || {}; const O = P.ofx; O.dn = O.dn || {}; O.got = O.got || {}; O.ord = O.ord || {}; O.mast = O.mast || {}; return O; }
const ofRamp = h => P5([shade(h, -0.55), shade(h, -0.3), h, shade(h, 0.25), shade(h, 0.5)]);

// ---------- ritmo ----------
const OFX_CURVE = L => Math.max(0.45, Math.min(1, 1 - (L - 20) * 0.012));
const OFX_DAILY = 30;
{ const prev = gainJobXp; gainJobXp = function (job, n) {
  const P = G.P, J = P && P.jobs && P.jobs[job]; if (!J || !(n > 0)) return prev.apply(this, arguments);
  const O = ofx(), day = calDay(); if (O.dd !== day) { O.dd = day; O.dn = {}; }
  let k = 1 / OFX_CURVE(J.lv); const c = O.dn[job] | 0; if (c < OFX_DAILY) { k *= 1.5; O.dn[job] = c + 1; }
  // ventajas «+% experiencia de este oficio»
  k *= 1 + ofPerkSum(job, 'xp') / 100;
  const before = J.lv, r = prev.call(this, job, Math.max(1, Math.round(n * k)));
  if (J.lv > before) ofOnLevel(job, before, J.lv);
  // ventaja de oro al trabajar
  const g = ofPerkSum(job, 'gold'); if (g && Math.random() < g / 100) { const v = 20 + J.lv * 8; P.gold += v; floatText(P.x, P.y - 52, '+' + v + ' ' + L2('ORO', 'GOLD'), '#ffd040'); }
  return r; }; }
// +0,1 % de ataque por cada oficio en nivel 50 (máximo +1 %): pequeño a propósito, ningún oficio es obligatorio.
function ofAtkBonus(P) { if (!P || !P.jobs) return 0; let n = 0; for (const k in JOBS) if ((P.jobs[k] || {}).lv >= 50) n++; return Math.min(1, n * 0.1); }
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); if (P && P === G.P && P.S) { const b = ofAtkBonus(P); if (b) P.S.atk = Math.round(P.S.atk * (1 + b / 100)); } return r; }; }

// ---------- iconos de productos ----------
const OFP_SHAPES = ['plank', 'crate', 'figure', 'vase', 'jar', 'bottle', 'ring', 'scroll', 'basket', 'bundle', 'candle', 'bowl', 'box', 'lantern', 'pendant', 'cheese', 'soap', 'tea', 'statue', 'fish', 'painting', 'doll', 'fan', 'bouquet', 'honey', 'wool', 'medal', 'shell', 'map', 'brick'];
function ofpPaint(p, sh, a, b) {
 const A = [C(shade(a, -0.45)), C(shade(a, -0.2)), C(a), C(shade(a, 0.35))], B = [C(shade(b, -0.4)), C(b), C(shade(b, 0.4))], W = C('#ffffff');
 switch (sh) {
  case 'plank': for (let i = 0; i < 3; i++) { p.rect(2, 3 + i * 4, 12, 3, A[1 + (i % 2)]); p.hl(2, 3 + i * 4, 12, A[3]); p.set(4 + i * 3, 4 + i * 4, A[0]); } break;
  case 'crate': p.rect(2, 4, 12, 10, A[1]); p.rect(3, 5, 10, 8, A[2]); p.line(3, 5, 12, 12, A[0]); p.line(3, 12, 12, 5, A[0]); p.hl(2, 4, 12, A[3]); p.rect(6, 1, 4, 3, B[1]); break;
  case 'figure': p.ball(8, 4, 2.5, 2.5, [A[1], A[2], A[3]]); p.poly([[5, 7], [11, 7], [12, 13], [4, 13]], A[2]); p.line(5, 7, 4, 12, A[3]); p.rect(3, 13, 10, 2, B[0]); break;
  case 'vase': p.ell(8, 9, 5, 5, A[2]); p.rect(6, 2, 4, 4, A[1]); p.hl(5, 2, 6, A[3]); p.hl(4, 9, 8, B[1]); p.set(6, 7, A[3]); p.hl(6, 13, 4, A[0]); break;
  case 'jar': p.rect(4, 5, 8, 9, A[2]); p.rect(4, 3, 8, 2, B[1]); p.hl(4, 3, 8, B[2]); p.vl(5, 6, 6, A[3]); p.rect(6, 8, 4, 3, W); p.hl(6, 9, 4, B[0]); break;
  case 'bottle': p.rect(6, 1, 4, 3, B[1]); p.rect(7, 4, 2, 2, A[1]); p.ell(8, 10, 4.5, 4.5, A[2]); p.vl(6, 8, 4, A[3]); p.rect(6, 9, 4, 3, W); break;
  case 'ring': for (let a = 0; a < 6.3; a += 0.25) p.set(Math.round(8 + Math.cos(a) * 5), Math.round(10 + Math.sin(a) * 3.5), A[2]); p.ball(8, 5, 2.5, 2.5, [B[0], B[1], B[2], W]); break;
  case 'scroll': p.rect(3, 4, 10, 9, C('#f0e0b8')); for (let y = 6; y < 12; y += 2) p.hl(5, y, 6, A[1]); p.rect(2, 3, 12, 2, A[2]); p.rect(2, 12, 12, 2, A[2]); p.set(13, 8, B[1]); break;
  case 'basket': p.poly([[2, 7], [14, 7], [12, 14], [4, 14]], A[1]); for (let x = 3; x < 14; x += 2) p.vl(x, 8, 5, A[2]); p.hl(2, 7, 12, A[3]); for (let a = 3.3; a < 6.2; a += 0.3) p.set(Math.round(8 + Math.cos(a) * 5), Math.round(7 + Math.sin(a) * 5), A[0]); p.ball(6, 6, 2, 1.6, [B[0], B[1], B[2]]); p.ball(10, 6, 2, 1.6, [B[0], B[1], B[2]]); break;
  case 'bundle': for (let i = 0; i < 4; i++) p.line(3 + i * 2, 14, 7 + i * 2, 2, i % 2 ? A[2] : A[1]); p.hl(4, 8, 9, B[1]); p.hl(4, 9, 9, B[0]); break;
  case 'candle': p.rect(5, 5, 6, 9, A[2]); p.vl(6, 6, 7, A[3]); p.vl(10, 6, 7, A[1]); p.vl(8, 3, 2, C('#3a2a1a')); p.ball(8, 2, 1.2, 1.6, [C('#ff8a2a'), C('#ffe060'), W]); p.rect(4, 13, 8, 2, B[1]); break;
  case 'bowl': p.ell(8, 8, 6.5, 2, B[2]); p.poly([[1, 8], [15, 8], [12, 14], [4, 14]], A[2]); p.hl(2, 9, 12, A[3]); p.hl(5, 13, 6, A[0]); p.set(6, 7, B[1]); p.set(10, 7, B[0]); break;
  case 'box': p.rect(2, 6, 12, 8, A[2]); p.rect(2, 4, 12, 3, A[3]); p.vl(8, 4, 10, B[1]); p.hl(2, 9, 12, B[1]); p.ball(8, 3, 2.5, 1.5, [B[0], B[1], B[2]]); break;
  case 'lantern': p.vl(8, 1, 2, A[0]); p.rect(4, 3, 8, 2, A[1]); p.rect(5, 5, 6, 7, C('#ffe080')); p.vl(5, 5, 7, A[1]); p.vl(10, 5, 7, A[1]); p.ball(8, 8, 1.5, 2, [C('#ff8a2a'), W]); p.rect(4, 12, 8, 2, A[1]); break;
  case 'pendant': p.line(3, 2, 8, 9, B[1]); p.line(13, 2, 8, 9, B[1]); p.poly([[8, 7], [12, 11], [8, 15], [4, 11]], A[2]); p.line(8, 8, 11, 11, A[3]); break;
  case 'cheese': p.poly([[2, 13], [14, 13], [14, 7], [4, 5]], A[2]); p.poly([[4, 5], [14, 7], [2, 8]], A[3]); p.ell(7, 10, 1.2, 1, A[0]); p.ell(11, 11, 1, 1, A[0]); p.set(12, 9, A[0]); break;
  case 'soap': p.rect(3, 6, 10, 7, A[2]); p.hl(3, 6, 10, A[3]); p.hl(3, 12, 10, A[0]); for (const [x, y] of [[4, 3], [9, 2], [12, 4]]) p.ball(x, y, 1.4, 1.4, [B[1], B[2], W]); break;
  case 'tea': p.ell(8, 12, 6, 2, B[1]); p.poly([[3, 6], [13, 6], [12, 12], [4, 12]], A[2]); p.ell(8, 6, 5, 1.5, B[0]); p.hl(4, 8, 8, A[3]); p.set(6, 3, W); p.set(9, 2, W); p.set(10, 4, W); break;
  case 'statue': p.rect(3, 12, 10, 3, A[0]); p.ball(8, 3, 2.2, 2.2, [A[1], A[2], A[3]]); p.poly([[5, 6], [11, 6], [10, 12], [6, 12]], A[2]); p.line(11, 6, 13, 3, A[3]); p.set(13, 2, B[2]); break;
  case 'fish': p.rect(2, 3, 12, 10, C('#7a4c29')); p.rect(3, 4, 10, 8, C('#986236')); p.ell(7, 8, 4, 2.2, A[2]); p.poly([[11, 8], [14, 5], [14, 11]], A[1]); p.set(5, 7, C('#101010')); p.hl(5, 9, 4, A[3]); break;
  case 'painting': p.rect(1, 2, 14, 12, B[1]); p.rect(2, 3, 12, 10, C('#9ad0f0')); p.poly([[2, 13], [6, 7], [9, 11], [11, 8], [14, 13]], A[2]); p.ball(11, 5, 1.5, 1.5, [C('#ffd040'), W]); break;
  case 'doll': p.ball(8, 5, 3.5, 3.5, [A[1], A[2], A[3]]); p.poly([[4, 9], [12, 9], [13, 14], [3, 14]], B[1]); p.set(7, 5, C('#101010')); p.set(9, 5, C('#101010')); p.hl(4, 2, 8, A[0]); break;
  case 'fan': for (let i = 0; i < 7; i++) { const an = Math.PI * (1.05 + i * 0.15); p.line(8, 13, Math.round(8 + Math.cos(an) * 7), Math.round(13 + Math.sin(an) * 9), i % 2 ? A[2] : A[3]); } p.ball(8, 13, 1.5, 1.5, [B[0], B[1]]); break;
  case 'bouquet': for (const [x, y, c] of [[5, 5, A], [10, 4, B], [8, 7, A], [4, 9, B], [11, 9, A]]) p.ball(x, y, 2.2, 2.2, [c[0], c[1], c[2]]); p.poly([[5, 11], [11, 11], [9, 15], [7, 15]], C('#5ab04a')); break;
  case 'honey': p.ell(8, 10, 5, 4.5, A[2]); p.rect(5, 3, 6, 3, B[1]); p.hl(5, 3, 6, B[2]); p.set(6, 9, A[3]); p.set(6, 8, W); p.line(10, 6, 10, 9, A[1]); break;
  case 'wool': p.ball(8, 9, 6, 5, [A[1], A[2], A[3], W]); for (let a = 0; a < 6; a += 0.7) p.set(Math.round(8 + Math.cos(a) * 3), Math.round(9 + Math.sin(a) * 2.5), A[0]); p.line(12, 12, 15, 15, B[1]); break;
  case 'medal': p.poly([[5, 1], [8, 6], [11, 1]], B[1]); p.ball(8, 10, 4.2, 4.2, [A[0], A[1], A[2], A[3]]); p.set(7, 9, W); break;
  case 'shell': for (let i = 0; i < 6; i++) p.line(8, 14, 2 + i * 2.4, 4 + Math.abs(i - 2.5) * 1.2, i % 2 ? A[2] : A[3]); p.ell(8, 13, 3, 1.5, A[1]); break;
  case 'map': p.poly([[2, 3], [6, 2], [10, 3], [14, 2], [14, 13], [10, 14], [6, 13], [2, 14]], C('#f0e0b8')); p.vl(6, 2, 11, C('#d8c098')); p.vl(10, 3, 11, C('#d8c098')); p.line(4, 11, 8, 6, A[2]); p.line(8, 6, 12, 9, A[2]); p.set(12, 9, B[1]); p.set(11, 8, B[1]); break;
  case 'brick': for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { const x = 2 + c * 6 + (r % 2) * 3, y = 4 + r * 3; p.rect(x, y, 5, 2, A[2]); p.hl(x, y, 5, A[3]); } break;
 }
}
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'ofp') return _gi.apply(this, arguments); const p = new Pix(16, 16); ofpPaint(p, spec[1], spec[2] || '#c08a4a', spec[3] || '#ffd040'); p.outline(OUTL); return p; }; }

// ---------- muebles del oficio ----------
function offPaint(sh, a, b) {
 const A = [C(shade(a, -0.5)), C(shade(a, -0.25)), C(a), C(shade(a, 0.3)), C(shade(a, 0.55))], B = [C(shade(b, -0.4)), C(b), C(shade(b, 0.4))], W_ = WOOD, W = C('#ffffff');
 let p, ax, ay;
 switch (sh) {
  case 'shelf': { p = new Pix(32, 34); p.rect(1, 2, 30, 31, W_[2]); p.rect(1, 0, 30, 3, W_[4]); for (let s = 0; s < 3; s++) { const y = 10 + s * 9; p.rect(3, y - 6, 26, 6, W_[1]); p.hl(2, y, 28, W_[4]); for (let i = 0; i < 5; i++) { const x = 4 + i * 5, c = (i + s) % 2 ? A : B; p.rect(x, y - 5, 3, 5, c[1]); p.hl(x, y - 5, 3, c[2]); } } ax = 8; ay = 32; break; }
  case 'crates': { p = new Pix(30, 26); for (const [x, y, w, h] of [[1, 10, 14, 14], [15, 12, 13, 12], [7, 1, 13, 10]]) { p.rect(x, y, w, h, A[1]); p.rect(x + 1, y + 1, w - 2, h - 2, A[2]); p.line(x + 1, y + 1, x + w - 2, y + h - 2, A[0]); p.hl(x, y, w, A[3]); } p.ball(13, 4, 2, 1.5, [B[0], B[1], B[2]]); ax = 8; ay = 24; break; }
  case 'barrel': { p = new Pix(16, 22); p.ell(8, 11, 7, 10, A[2]); for (let x = 2; x < 15; x += 3) p.vl(x, 3, 16, A[1]); p.hl(1, 5, 14, IRON[3]); p.hl(1, 16, 14, IRON[3]); p.ell(8, 2, 6, 1.6, A[3]); p.ball(8, 1, 2, 1.2, [B[0], B[1], B[2]]); ax = 8; ay = 21; break; }
  case 'statue': { p = new Pix(18, 34); p.rect(2, 26, 14, 7, C('#6a6a76')); p.hl(2, 26, 14, C('#a0a0aa')); p.ball(9, 6, 3.5, 3.5, [A[1], A[2], A[3], A[4]]); p.poly([[5, 10], [13, 10], [12, 26], [6, 26]], A[2]); p.line(5, 10, 6, 26, A[3]); p.line(13, 11, 16, 4, B[1]); p.ball(16, 3, 1.5, 1.5, [B[1], B[2], W]); ax = 9; ay = 32; break; }
  case 'lamp': { p = new Pix(14, 34); p.vl(7, 8, 24, IRON[2]); p.vl(6, 8, 24, IRON[3]); p.rect(3, 30, 8, 3, IRON[1]); p.rect(2, 1, 10, 9, A[1]); p.rect(3, 2, 8, 7, C('#ffe8a0')); p.vl(7, 2, 7, A[1]); p.hl(2, 1, 10, A[3]); p.ball(7, 5, 1.5, 2, [C('#ff8a2a'), C('#ffe060')]); ax = 7; ay = 32; break; }
  case 'rack': { p = new Pix(30, 30); woodPost(p, 2, 4, 28, 3); woodPost(p, 25, 4, 28, 3); p.rect(2, 4, 26, 3, W_[4]); for (let i = 0; i < 4; i++) { const x = 7 + i * 5; p.vl(x, 7, 14, i % 2 ? B[1] : A[2]); p.rect(x - 1, 7, 3, 4, i % 2 ? A[3] : B[2]); } p.rect(2, 22, 26, 3, W_[2]); ax = 8; ay = 28; break; }
  case 'display': { p = new Pix(32, 24); p.rect(1, 8, 30, 4, W_[4]); p.hl(1, 8, 30, W_[5]); woodPost(p, 3, 12, 22, 3); woodPost(p, 27, 12, 22, 3); for (let i = 0; i < 4; i++) { const x = 4 + i * 7, c = i % 2 ? A : B; p.ball(x + 2, 5, 2.5, 3, [c[0], c[1], c[2]]); p.set(x + 1, 3, W); } ax = 8; ay = 22; break; }
  case 'rug': { p = new Pix(32, 18); p.rect(1, 2, 30, 14, A[1]); p.rect(3, 4, 26, 10, A[2]); p.rect(6, 6, 20, 6, B[1]); p.rect(9, 8, 14, 2, A[3]); for (let x = 1; x < 31; x += 2) { p.set(x, 1, A[3]); p.set(x, 16, A[3]); } ax = 8; ay = 16; break; }
  case 'easel': { p = new Pix(22, 34); p.line(4, 32, 10, 2, W_[3]); p.line(17, 32, 11, 2, W_[3]); p.line(11, 20, 15, 32, W_[2]); p.rect(2, 6, 18, 14, B[1]); p.rect(3, 7, 16, 12, C('#9ad0f0')); p.poly([[3, 19], [8, 11], [12, 16], [15, 12], [19, 19]], A[2]); p.ball(15, 10, 1.6, 1.6, [C('#ffd040'), W]); ax = 11; ay = 32; break; }
  case 'pots': { p = new Pix(30, 22); for (const [x, s] of [[6, 1], [15, 1.3], [24, 0.9]]) { p.poly([[x - 4 * s, 13], [x + 4 * s, 13], [x + 3 * s, 21], [x - 3 * s, 21]], C('#b0603a')); p.hl(Math.round(x - 4 * s), 13, Math.round(8 * s), C('#d08050')); for (let k = 0; k < 4; k++) p.ball(x + Math.cos(k * 1.6) * 3 * s, 9 - k * 1.5 * s, 2.2 * s, 1.8 * s, [A[1], A[2], A[3]]); p.ball(x, 6 - 2 * s, 1.6, 1.6, [B[0], B[1], B[2]]); } ax = 8; ay = 21; break; }
  case 'tank': { p = new Pix(32, 30); p.rect(1, 20, 30, 9, W_[2]); p.hl(1, 20, 30, W_[4]); p.rect(2, 3, 28, 17, C('#3a8ad0')); p.rect(3, 4, 26, 15, C('#6ab8f0')); p.hl(3, 4, 26, C('#c8f0ff')); p.rect(3, 16, 26, 3, C('#d8c088')); p.ell(10, 10, 3, 1.6, A[2]); p.poly([[13, 10], [15, 8], [15, 12]], A[2]); p.ell(21, 13, 2.5, 1.4, B[1]); p.poly([[18, 13], [16, 11], [16, 15]], B[1]); p.vl(26, 9, 8, C('#3aa04a')); p.vl(6, 11, 6, C('#3aa04a')); ax = 8; ay = 28; break; }
  case 'bench': { p = new Pix(32, 20); p.rect(1, 6, 30, 4, A[2]); p.hl(1, 6, 30, A[3]); p.rect(1, 1, 30, 3, A[1]); woodPost(p, 3, 10, 19, 2); woodPost(p, 27, 10, 19, 2); p.hl(1, 10, 30, A[0]); ax = 8; ay = 18; break; }
  case 'loom': { p = new Pix(30, 30); woodPost(p, 2, 2, 28, 3); woodPost(p, 25, 2, 28, 3); p.rect(2, 2, 26, 3, W_[4]); p.rect(2, 24, 26, 3, W_[3]); for (let x = 6; x < 25; x += 2) p.vl(x, 5, 11, C('#f0e8d8')); p.rect(6, 15, 18, 9, A[2]); for (let y = 16; y < 24; y += 2) p.hl(6, y, 18, B[1]); ax = 8; ay = 28; break; }
  case 'wheel': { p = new Pix(24, 24); p.rect(2, 12, 20, 10, W_[2]); p.hl(2, 12, 20, W_[4]); p.ell(12, 10, 8, 2.5, IRON[3]); p.ell(12, 8, 4, 4, A[2]); p.ell(12, 5, 3, 1.2, A[3]); p.vl(10, 6, 4, A[3]); p.ball(19, 17, 2, 2, [B[0], B[1], B[2]]); ax = 8; ay = 22; break; }
  case 'oven': { p = new Pix(30, 30); p.ball(15, 16, 13, 13, [A[0], A[1], A[2], A[3]]); p.rect(2, 22, 26, 7, A[1]); p.ell(15, 22, 6, 5, C('#2a1408')); p.ell(15, 23, 4, 3, C('#ff6a1a')); p.ell(15, 24, 2, 1.5, C('#ffd040')); p.rect(19, 1, 4, 6, A[0]); ax = 8; ay = 28; break; }
  case 'trophy': { p = new Pix(32, 22); p.rect(1, 2, 30, 18, W_[2]); p.rect(2, 3, 28, 16, W_[3]); p.ell(14, 11, 10, 4.5, A[2]); p.ell(14, 10, 8, 2.5, A[3]); p.poly([[23, 11], [29, 5], [29, 17]], A[1]); p.set(7, 10, C('#101010')); p.hl(9, 12, 10, B[1]); ax = 8; ay = 20; break; }
  case 'bonsai': { p = new Pix(22, 26); p.rect(3, 19, 16, 6, A[1]); p.hl(3, 19, 16, A[3]); p.line(11, 19, 9, 11, W_[2]); p.line(9, 11, 13, 7, W_[2]); for (const [x, y] of [[6, 9], [12, 6], [16, 9], [9, 5]]) p.ball(x, y, 3.5, 2.4, [B[0], B[1], B[2]]); ax = 11; ay = 25; break; }
  case 'fountain': { p = new Pix(30, 28); p.ell(15, 20, 13, 6, C('#7a7a86')); p.ell(15, 19, 11, 4.5, C('#5ab0e0')); p.rect(13, 6, 4, 13, C('#9a9aa6')); p.ell(15, 7, 6, 2, C('#b0b0ba')); p.ell(15, 6, 5, 1.4, C('#8ad0f0')); p.set(15, 2, W); p.set(14, 3, C('#c8f0ff')); p.ball(24, 19, 1.5, 1, [A[1], A[2]]); ax = 8; ay = 26; break; }
  case 'cart': { p = new Pix(32, 24); p.rect(3, 6, 22, 10, A[2]); p.hl(3, 6, 22, A[3]); for (let x = 5; x < 24; x += 5) p.vl(x, 7, 8, A[1]); for (const [x, c] of [[8, B], [15, A], [21, B]]) p.ball(x, 5, 3, 2.5, [c[0], c[1], c[2]]); p.ball(9, 18, 4, 4, [W_[1], W_[2], W_[3]]); p.ball(21, 18, 4, 4, [W_[1], W_[2], W_[3]]); p.line(25, 10, 31, 12, W_[3]); ax = 8; ay = 22; break; }
  case 'board': { p = new Pix(30, 32); woodPost(p, 3, 6, 31, 2); woodPost(p, 25, 6, 31, 2); p.rect(1, 2, 28, 18, W_[3]); p.rect(2, 3, 26, 16, A[1]); for (const [x, y] of [[4, 5], [12, 6], [19, 5], [7, 12], [16, 12]]) { p.rect(x, y, 6, 5, C('#f0e0b8')); p.hl(x + 1, y + 2, 4, B[1]); } ax = 8; ay = 31; break; }
  default: { p = new Pix(16, 16); p.rect(2, 2, 12, 12, A[2]); ax = 8; ay = 15; }
 }
 p.outline(C('#1a1010')); return { c: p.canvas(), ax, ay };
}
{ const _gf = genFurn2; genFurn2 = function (kind) { if (!/^of_/.test(kind)) return _gf.apply(this, arguments); const b = BK[kind.slice(3)]; return b && b.ofs ? offPaint(b.ofs[0], b.ofs[1], b.ofs[2]) : _gf.apply(this, arguments); }; }
const OFF_FP = { shelf: [[0, 0], [1, 0]], crates: [[0, 0], [1, 0]], rack: [[0, 0], [1, 0]], display: [[0, 0], [1, 0]], rug: [[0, 0], [1, 0]], tank: [[0, 0], [1, 0]], bench: [[0, 0], [1, 0]], loom: [[0, 0], [1, 0]], oven: [[0, 0], [1, 0]], trophy: [[0, 0], [1, 0]], fountain: [[0, 0], [1, 0]], cart: [[0, 0], [1, 0]], board: [[0, 0], [1, 0]] };

// ---------- catálogo por oficio ----------
// p: producto [nivel, id, es, en, forma, color, color2, precio, materiales, cantidad]
// f: mueble  [nivel, id, es, en, forma, color, color2, coste, oro, categoría]
// c: ropa    [nivel, id, es, en, ranura, función de aspecto]
// k: ventaja [nivel, es, en, {xp|gold|dbl|sell: %}]
const OFU = {};
const OFC = (k, m, s, o) => () => Object.assign({ k, m: ofRamp(m), s: ofRamp(s || m) }, o || {});
OFU.tala = {
 p: [[5, 'tablas', 'Tablas cepilladas', 'Planed boards', 'plank', '#b67c48', '#7a4c29', 40, [['log1', 3]], 2], [15, 'tallas', 'Talla de madera', 'Wood carving', 'figure', '#c8904a', '#5e381e', 220, [['log2', 3], ['log3', 1]], 1],
  [25, 'arcon', 'Arcón de abedul', 'Birch chest', 'box', '#d8b080', '#8a5a2a', 600, [['log3', 4], ['ore2', 1]], 1], [35, 'carbon', 'Carbón vegetal', 'Charcoal', 'bundle', '#3a3a40', '#7a4c29', 300, [['log4', 2]], 3],
  [55, 'barca', 'Barca en miniatura', 'Model boat', 'crate', '#7a4c29', '#e0e0f0', 2400, [['log7', 4], ['tela_fina', 2]], 1], [75, 'obra_tala', 'Obra maestra: árbol tallado', 'Masterpiece: carved tree', 'statue', '#986236', '#5ab04a', 9000, [['log10', 6], ['log11', 2]], 1]],
 f: [[20, 'of_lenera', 'Leñera', 'Woodpile', 'crates', '#986236', '#5ab04a', [['log', 8]], 300, 'deco'], [40, 'of_banco_roble', 'Banco de roble tallado', 'Carved oak bench', 'bench', '#b67c48', '#5e381e', [['log4', 6]], 800, 'mueble'], [60, 'of_bonsai', 'Bonsái del leñador', 'Woodcutter bonsai', 'bonsai', '#b0603a', '#3a9a3a', [['log7', 3]], 2500, 'deco']],
 c: [[30, 'c_of_tala_g', 'Gorro de leñador', 'Woodcutter cap', 'head', OFC('bandana', '#b8322a', '#3a2a1a', { cover: 'hat' })], [50, 'c_of_tala_c', 'Camisa de leñador', 'Woodcutter shirt', 'body', OFC('shirt', '#b8322a', '#2a1a1a')], [70, 'c_of_tala_p', 'Pantalón de faena', 'Work trousers', 'legs', OFC('pants', '#3a4a6a')]],
 k: [[10, 'Astillas útiles: +10 % de experiencia de Tala', 'Useful chips: +10% Woodcutting XP', { xp: 10 }], [45, 'Madera noble: tus productos de Tala valen un 20 % más', 'Fine timber: your Woodcutting goods are worth 20% more', { sell: 20 }], [65, 'Racha: 15 % de producto doble en el taller', 'Streak: 15% double goods in the workshop', { dbl: 15 }]] };
OFU.mineria = {
 p: [[5, 'ladrillos', 'Ladrillos de arcilla', 'Clay bricks', 'brick', '#b0603a', '#d08050', 30, [['piedra', 3]], 3], [15, 'lingote', 'Lingote de plata', 'Silver ingot', 'brick', '#c8d0e0', '#8a8a96', 260, [['ore3', 3]], 1],
  [25, 'geoda', 'Geoda abierta', 'Opened geode', 'shell', '#8a5ad0', '#c8a0ff', 700, [['ore4', 2], ['piedra', 6]], 1], [35, 'campana', 'Campanilla de bronce', 'Bronze bell', 'lantern', '#c8902a', '#fff0a0', 900, [['ore2', 4], ['ore4', 1]], 1],
  [55, 'farolm', 'Farol de mithril', 'Mithril lantern', 'lantern', '#8ad0e0', '#ffe080', 2600, [['ore5', 4], ['ore7', 1]], 1], [75, 'obra_min', 'Obra maestra: corona de cristal', 'Masterpiece: crystal crown', 'pendant', '#8af0ff', '#ffd040', 9500, [['ore10', 4], ['diamante', 1]], 1]],
 f: [[20, 'of_carretilla', 'Vagoneta de mina', 'Mine cart', 'cart', '#5d5c66', '#c8a040', [['piedra', 10], ['ore2', 2]], 300, 'deco'], [40, 'of_geodas', 'Estante de geodas', 'Geode shelf', 'shelf', '#8a5ad0', '#8ad0f0', [['ore4', 3], ['log', 4]], 900, 'mueble'], [60, 'of_fuente_m', 'Fuente de piedra', 'Stone fountain', 'fountain', '#8a8a96', '#5ab0e0', [['piedra', 30], ['ore6', 2]], 3000, 'deco']],
 c: [[30, 'c_of_min_g', 'Casco de minero', 'Miner helmet', 'head', OFC('bandana', '#e0b030', '#5d5c66', { cover: 'hat' })], [50, 'c_of_min_c', 'Chaleco de minero', 'Miner vest', 'body', OFC('vest', '#7a5a3a', '#e0b030')], [70, 'c_of_min_b', 'Botas de roca', 'Rock boots', 'feet', OFC('boots', '#4a4a56')]],
 k: [[10, 'Buen pulso: +10 % de experiencia de Minería', 'Steady hand: +10% Mining XP', { xp: 10 }], [45, 'Pepitas: 6 % de encontrar oro al minar', 'Nuggets: 6% chance to find gold when mining', { gold: 6 }], [65, 'Metal puro: productos de Minería un 20 % más caros', 'Pure metal: Mining goods worth 20% more', { sell: 20 }]] };
OFU.pesca = {
 p: [[5, 'cebo', 'Cebo casero', 'Homemade bait', 'jar', '#8a6a3a', '#c86a4a', 25, [['sardina', 2]], 3], [15, 'ahumado', 'Pescado ahumado', 'Smoked fish', 'fish', '#c8783a', '#8a4a2a', 260, [['salmon', 2], ['log2', 1]], 2],
  [25, 'conserva', 'Conserva de anguila', 'Eel preserve', 'jar', '#5a7a5a', '#e0c070', 520, [['anguila', 2], ['herb2', 1]], 2], [35, 'red', 'Red de pescador', 'Fishing net', 'bundle', '#c8b088', '#3a5a8a', 900, [['tela_fina', 4], ['log3', 2]], 1],
  [55, 'trofeo_p', 'Trofeo: pez espada disecado', 'Trophy: mounted swordfish', 'fish', '#5a7ab0', '#c8d0e0', 3000, [['pezespada', 2], ['log5', 2]], 1], [75, 'obra_pes', 'Obra maestra: pez dragón de oro', 'Masterpiece: golden dragonfish', 'fish', '#ffd040', '#ff6a3a', 10000, [['pezdragon', 2], ['ore4', 4]], 1]],
 f: [[20, 'of_acuario', 'Acuario', 'Aquarium', 'tank', '#ff8a3a', '#ffd040', [['log', 4], ['piedra', 4]], 900, 'mueble'], [40, 'of_trofeo_pez', 'Pez gigante en la pared', 'Giant fish on the wall', 'trophy', '#5a8ab0', '#ffd040', [['log4', 3], ['lucio', 2]], 1500, 'deco'], [60, 'of_barril_p', 'Barril de salazón', 'Salting barrel', 'barrel', '#7a4c29', '#c8d0e0', [['log5', 3], ['sardina', 6]], 1200, 'deco']],
 c: [[30, 'c_of_pes_g', 'Sombrero de pescador', 'Fisher hat', 'head', OFC('ranger', '#c8b070', '#3a5a8a', { cover: 'hat' })], [50, 'c_of_pes_c', 'Impermeable amarillo', 'Yellow raincoat', 'body', OFC('coat', '#ffd030', '#c89a20')], [70, 'c_of_pes_b', 'Botas de agua', 'Rain boots', 'feet', OFC('boots', '#2a6a4a')]],
 k: [[10, 'Buen cebo: +10 % de experiencia de Pesca', 'Good bait: +10% Fishing XP', { xp: 10 }], [45, 'Lonja: productos de Pesca un 20 % más caros', 'Fish market: Fishing goods worth 20% more', { sell: 20 }], [65, 'Monedas en la red: 6 % de sacar oro', 'Coins in the net: 6% chance of gold', { gold: 6 }]] };
OFU.herbo = {
 p: [[5, 'te_hierbas', 'Té de hierbas', 'Herbal tea', 'tea', '#c8a070', '#5ab04a', 35, [['herb1', 3]], 2], [15, 'incienso', 'Varillas de incienso', 'Incense sticks', 'bundle', '#a05ad0', '#ffd040', 240, [['herb2', 2], ['log1', 1]], 3],
  [25, 'jabon', 'Jabón de lavanda', 'Lavender soap', 'soap', '#b090e0', '#ffffff', 420, [['herb3', 2], ['gel', 2]], 2], [35, 'perfume', 'Perfume de flor de luna', 'Moonflower perfume', 'bottle', '#c8a0ff', '#ffd040', 1100, [['herb5', 2], ['ore3', 1]], 1],
  [55, 'especias', 'Mezcla de especias', 'Spice blend', 'jar', '#d8602a', '#ffd040', 1800, [['herb8', 2], ['herb7', 1]], 2], [75, 'obra_her', 'Obra maestra: jardín en botella', 'Masterpiece: garden in a bottle', 'bottle', '#5ad08a', '#c8f0ff', 9000, [['herb10', 3], ['herb11', 2]], 1]],
 f: [[20, 'of_macetas', 'Macetas de flores', 'Flower pots', 'pots', '#e05a8a', '#ffd040', [['piedra', 4]], 400, 'deco'], [40, 'of_secadero', 'Secadero de hierbas', 'Herb drying rack', 'rack', '#5ab04a', '#c8a070', [['log', 6]], 900, 'mueble'], [60, 'of_bonsai_flor', 'Árbol de flores lunares', 'Moonflower tree', 'bonsai', '#6a6aa0', '#c8a0ff', [['herb5', 4], ['piedra', 6]], 2500, 'deco']],
 c: [[30, 'c_of_her_g', 'Corona de hierbas', 'Herb crown', 'head', () => ({ k: 'flowers', cover: 'hat' })], [50, 'c_of_her_c', 'Túnica de herbolaria', 'Herbalist tunic', 'body', OFC('tunic', '#5a8a4a', '#d8c088')], [70, 'c_of_her_p', 'Falda de pétalos', 'Petal skirt', 'legs', OFC('skirt', '#d870a0')]],
 k: [[10, 'Buen olfato: +10 % de experiencia de Herboristería', 'Keen nose: +10% Herbalism XP', { xp: 10 }], [45, 'Boticaria: productos de Herboristería un 20 % más caros', 'Apothecary: Herbalism goods worth 20% more', { sell: 20 }], [65, 'Ramillete doble: 15 % de producto doble', 'Double posy: 15% double goods', { dbl: 15 }]] };
OFU.herreria = {
 p: [[5, 'clavos', 'Caja de clavos', 'Box of nails', 'box', '#7c7b86', '#a3a2ac', 40, [['ore1', 2]], 2], [15, 'herradura', 'Herradura de la suerte', 'Lucky horseshoe', 'ring', '#a3a2ac', '#ffd040', 300, [['ore2', 3]], 1],
  [25, 'candelabro', 'Candelabro de hierro', 'Iron candelabrum', 'candle', '#424149', '#ffe060', 650, [['ore2', 4], ['ore3', 1]], 1], [35, 'espada_deco', 'Espada de adorno', 'Ornamental sword', 'statue', '#c8d0e0', '#ffd040', 1300, [['ore4', 3], ['ore5', 1]], 1],
  [55, 'yelmo_deco', 'Armadura de exposición', 'Display armour', 'figure', '#8a96b0', '#ffd040', 3000, [['ore6', 4], ['ore7', 1]], 1], [75, 'obra_her2', 'Obra maestra: estandarte de acero', 'Masterpiece: steel standard', 'statue', '#e8f0ff', '#c83a3a', 10000, [['ore10', 5], ['ore11', 2]], 1]],
 f: [[20, 'of_armero', 'Armero de pared', 'Weapon rack', 'rack', '#a3a2ac', '#c83a3a', [['log', 4], ['ore2', 2]], 600, 'mueble'], [40, 'of_estatua_cab', 'Estatua del caballero', 'Knight statue', 'statue', '#8a96b0', '#ffd040', [['piedra', 12], ['ore4', 2]], 2000, 'deco'], [60, 'of_farol_forja', 'Farol de forja', 'Forge lantern', 'lamp', '#424149', '#ff8a2a', [['ore6', 2]], 1500, 'deco']],
 c: [[30, 'c_of_hrr_g', 'Pañuelo de herrero', 'Smith bandana', 'head', OFC('bandana', '#5a5a64', '#2a2a30', { cover: 'hat' })], [50, 'c_of_hrr_c', 'Mandil de cuero', 'Leather apron', 'body', OFC('leather', '#7a4a2a', '#a3a2ac')], [70, 'c_of_hrr_b', 'Botas reforzadas', 'Reinforced boots', 'feet', OFC('boots', '#3a2a20')]],
 k: [[10, 'Fuelle: +10 % de experiencia de Herrería', 'Bellows: +10% Smithing XP', { xp: 10 }], [45, 'Sello del gremio: productos de Herrería un 20 % más caros', 'Guild seal: Smithing goods worth 20% more', { sell: 20 }], [65, 'Martillo veloz: 15 % de producto doble', 'Quick hammer: 15% double goods', { dbl: 15 }]] };
OFU.alquimia = {
 p: [[5, 'sales', 'Sales de baño', 'Bath salts', 'jar', '#8ad0f0', '#ffffff', 40, [['herb1', 2], ['gel', 1]], 2], [15, 'tinta', 'Tinta mágica', 'Magic ink', 'bottle', '#3a3a8a', '#c8a0ff', 280, [['herb2', 2], ['espora', 1]], 2],
  [25, 'velas_a', 'Velas aromáticas', 'Scented candles', 'candle', '#f0d0e0', '#c8a0ff', 500, [['herb3', 2], ['gel', 2]], 2], [35, 'fuegos', 'Fuegos artificiales', 'Fireworks', 'bundle', '#e83a3a', '#ffd040', 1100, [['brasa', 1], ['herb4', 2]], 3],
  [55, 'esencia_luz', 'Esencia de luz', 'Light essence', 'bottle', '#ffe080', '#ffffff', 2600, [['herb7', 2], ['prisma', 1]], 1], [75, 'obra_alq', 'Obra maestra: piedra filosofal falsa', "Masterpiece: fake philosopher's stone", 'pendant', '#e83a5a', '#ffd040', 10000, [['opalo', 1], ['herb10', 2]], 1]],
 f: [[20, 'of_estante_alq', 'Estante de frascos', 'Jar shelf', 'shelf', '#5ab0e0', '#c070ff', [['log', 4], ['gel', 4]], 600, 'mueble'], [40, 'of_farol_alq', 'Farol de esencia azul', 'Blue essence lamp', 'lamp', '#3a6ad0', '#8af0ff', [['ore3', 2], ['herb4', 2]], 1200, 'deco'], [60, 'of_fuente_alq', 'Fuente burbujeante', 'Bubbling fountain', 'fountain', '#6a5a8a', '#c070ff', [['piedra', 20], ['herb6', 3]], 3000, 'deco']],
 c: [[30, 'c_of_alq_g', 'Sombrero de alquimista', 'Alchemist hat', 'head', OFC('wizard', '#4a3a8a', '#c8a040', { cover: 'hat' })], [50, 'c_of_alq_c', 'Bata de laboratorio', 'Lab coat', 'body', OFC('robe', '#e8e8f0', '#5a8ad0')], [70, 'c_of_alq_b', 'Zapatos de alquimista', 'Alchemist shoes', 'feet', OFC('shoes', '#3a2a4a')]],
 k: [[10, 'Probeta limpia: +10 % de experiencia de Alquimia', 'Clean flask: +10% Alchemy XP', { xp: 10 }], [45, 'Fórmula secreta: productos de Alquimia un 20 % más caros', 'Secret formula: Alchemy goods worth 20% more', { sell: 20 }], [65, 'Reacción en cadena: 15 % de producto doble', 'Chain reaction: 15% double goods', { dbl: 15 }]] };
OFU.cocina = {
 p: [[5, 'mermelada', 'Mermelada casera', 'Homemade jam', 'jar', '#c83a5a', '#f0e0b8', 40, [['uva', 1], ['trigo', 1]], 2], [25, 'queso_c', 'Queso curado', 'Aged cheese', 'cheese', '#f0c040', '#c89020', 500, [['ig_leche', 3], ['herb2', 1]], 1],
  [45, 'galletas', 'Caja de galletas', 'Box of biscuits', 'box', '#d8a060', '#e85a8a', 1200, [['trigo', 4], ['ig_azucar', 2], ['ig_huevo', 1]], 2], [75, 'obra_coc', 'Obra maestra: tarta de bodas', 'Masterpiece: wedding cake', 'cheese', '#fff0f8', '#ffd040', 9000, [['frutaestelar', 2], ['ig_azucar', 4], ['ig_leche', 4]], 1]],
 f: [[20, 'of_horno', 'Horno de leña', 'Wood oven', 'oven', '#b0603a', '#ffd040', [['piedra', 12], ['log', 4]], 1200, 'mueble'], [40, 'of_mostrador_c', 'Vitrina de pasteles', 'Cake counter', 'display', '#f0c0d0', '#c83a5a', [['log', 6], ['piedra', 2]], 1500, 'mueble'], [60, 'of_barril_v', 'Barril de vino', 'Wine barrel', 'barrel', '#7a2a3a', '#c8a040', [['log5', 4], ['uva', 4]], 1500, 'deco']],
 c: [[30, 'c_of_coc_g', 'Gorro de chef', 'Chef hat', 'head', OFC('bandana', '#ffffff', '#d8d8e0', { cover: 'hat' })], [50, 'c_of_coc_c', 'Chaqueta de chef', 'Chef jacket', 'body', OFC('coat', '#f4f4f0', '#3a3a40')], [70, 'c_of_coc_p', 'Pantalón de cuadros', 'Checked trousers', 'legs', OFC('pants', '#2a2a30')]],
 k: [[10, 'Buena sazón: +10 % de experiencia de Cocina', 'Good seasoning: +10% Cooking XP', { xp: 10 }], [35, 'Clientela: productos de Cocina un 20 % más caros', 'Regulars: Cooking goods worth 20% more', { sell: 20 }], [65, 'Propinas: 6 % de ganar oro al cocinar', 'Tips: 6% chance of gold when cooking', { gold: 6 }]] };
OFU.excavacion = {
 p: [[5, 'vasija', 'Vasija restaurada', 'Restored pot', 'vase', '#b0603a', '#e0c070', 40, [['piedra', 4]], 1], [15, 'punta', 'Punta de flecha antigua', 'Ancient arrowhead', 'pendant', '#6a6a76', '#c8a070', 280, [['moneda_antigua', 2]], 1],
  [25, 'mosaico', 'Mosaico pequeño', 'Small mosaic', 'painting', '#5a8ad0', '#ffd040', 650, [['piedra', 10], ['reliquia1', 1]], 1], [35, 'mapa_t', 'Mapa del tesoro copiado', 'Copied treasure map', 'map', '#c83a3a', '#ffd040', 1200, [['moneda_antigua', 6], ['tela_fina', 1]], 1],
  [55, 'idolo_r', 'Réplica de ídolo de oro', 'Golden idol replica', 'statue', '#ffd040', '#c83a3a', 2800, [['reliquia2', 1], ['ore4', 3]], 1], [75, 'obra_exc', 'Obra maestra: corona restaurada', 'Masterpiece: restored crown', 'pendant', '#ffd040', '#8af0ff', 12000, [['reliquia4', 1], ['diamante', 1]], 1]],
 f: [[20, 'of_vitrina_exc', 'Mesa de hallazgos', 'Finds table', 'display', '#c8a070', '#5a8ad0', [['log', 4], ['piedra', 4]], 600, 'mueble'], [40, 'of_estatua_ant', 'Estatua antigua', 'Ancient statue', 'statue', '#a09a80', '#5ab04a', [['piedra', 16]], 1800, 'deco'], [60, 'of_mosaico', 'Alfombra de mosaico', 'Mosaic floor rug', 'rug', '#5a8ad0', '#ffd040', [['piedra', 20], ['ore3', 2]], 2000, 'deco']],
 c: [[30, 'c_of_exc_g', 'Sombrero de explorador', 'Explorer hat', 'head', OFC('ranger', '#c8a070', '#7a4c29', { cover: 'hat' })], [50, 'c_of_exc_c', 'Camisa de expedición', 'Expedition shirt', 'body', OFC('shirt', '#d8c088', '#8a6a3a')], [70, 'c_of_exc_p', 'Pantalón corto de campo', 'Field shorts', 'legs', OFC('shorts', '#a08a5a')]],
 k: [[10, 'Pincel fino: +10 % de experiencia de Excavación', 'Fine brush: +10% Digging XP', { xp: 10 }], [45, 'Coleccionistas: productos de Excavación un 20 % más caros', 'Collectors: Digging goods worth 20% more', { sell: 20 }], [65, 'Tesoro enterrado: 6 % de encontrar oro', 'Buried treasure: 6% chance of gold', { gold: 6 }]] };
OFU.agricultura = {
 p: [[5, 'pan_c', 'Hogaza de campo', 'Country loaf', 'bundle', '#d8a060', '#8a5a2a', 40, [['trigo', 3]], 1], [15, 'zumo', 'Zumo de tomate', 'Tomato juice', 'bottle', '#e83a3a', '#5ab04a', 220, [['tomate', 3]], 2],
  [25, 'cesta_v', 'Cesta de verduras', 'Vegetable basket', 'basket', '#c8904a', '#e86a2a', 500, [['zanahoria', 3], ['tomate', 2], ['calabaza', 1]], 1], [35, 'vino_c', 'Vino de la casa', 'House wine', 'bottle', '#7a1a3a', '#c8a040', 1000, [['uva', 4]], 1],
  [55, 'melon_c', 'Melones de exposición', 'Show melons', 'basket', '#e0c040', '#5ab04a', 2400, [['melon', 3]], 1], [75, 'obra_agr', 'Obra maestra: calabaza gigante', 'Masterpiece: giant pumpkin', 'vase', '#e8802a', '#5ab04a', 9500, [['calabaza', 8], ['frutaestelar', 2]], 1]],
 f: [[20, 'of_carretilla_v', 'Carro de verduras', 'Vegetable cart', 'cart', '#986236', '#e86a2a', [['log', 6]], 500, 'granja'], [40, 'of_espantapajaros', 'Espantapájaros', 'Scarecrow', 'statue', '#c8a070', '#c83a3a', [['log', 4], ['tela_fina', 2]], 800, 'granja'], [60, 'of_cajas_fruta', 'Cajas de fruta', 'Fruit crates', 'crates', '#b67c48', '#e05a3a', [['log5', 3]], 1200, 'granja']],
 c: [[30, 'c_of_agr_g', 'Sombrero de paja', 'Straw hat', 'head', OFC('ranger', '#e0c070', '#c83a3a', { cover: 'hat' })], [50, 'c_of_agr_c', 'Peto de granjero', 'Farmer overalls', 'body', OFC('vest', '#4a6aa0', '#e0c070')], [70, 'c_of_agr_b', 'Botas de campo', 'Field boots', 'feet', OFC('boots', '#5a3a1a')]],
 k: [[10, 'Tierra fértil: +10 % de experiencia de Agricultura', 'Fertile soil: +10% Farming XP', { xp: 10 }], [45, 'Mercado de abastos: productos de Agricultura un 20 % más caros', 'Farmers market: Farming goods worth 20% more', { sell: 20 }], [65, 'Buena cosecha: 15 % de producto doble', 'Bumper crop: 15% double goods', { dbl: 15 }]] };
OFU.joyeria = {
 p: [[5, 'abalorios', 'Abalorios de cobre', 'Copper beads', 'ring', '#c8783a', '#ffd040', 45, [['ore1', 3]], 2], [15, 'broche', 'Broche de rubí', 'Ruby brooch', 'pendant', '#e83a3a', '#ffd040', 600, [['rubi', 1], ['ore3', 1]], 1],
  [25, 'diadema', 'Diadema de zafiro', 'Sapphire diadem', 'ring', '#3a6ad0', '#c8d0e0', 1100, [['zafiro', 1], ['ore3', 2]], 1], [35, 'joyero', 'Joyero de ébano', 'Ebony jewel box', 'box', '#3a2a1a', '#ffd040', 1600, [['log4', 3], ['esmeralda', 1]], 1],
  [55, 'collar_p', 'Collar de perlas finas', 'Fine pearl necklace', 'pendant', '#f0f0f8', '#ffd040', 4000, [['perla', 2], ['ore4', 2]], 1], [75, 'obra_joy', 'Obra maestra: tiara de ópalo', 'Masterpiece: opal tiara', 'ring', '#e8a0ff', '#ffd040', 15000, [['opalo', 1], ['diamante', 1], ['ore4', 4]], 1]],
 f: [[20, 'of_espejo_j', 'Tocador con joyas', 'Jewellery dresser', 'display', '#e8c0d0', '#ffd040', [['log', 4], ['ore3', 1]], 1200, 'mueble'], [40, 'of_farol_j', 'Farol de cristal', 'Crystal lantern', 'lamp', '#c8d0e0', '#8af0ff', [['ore7', 1], ['ore3', 2]], 1500, 'deco'], [60, 'of_estatua_j', 'Estatua con gemas', 'Gem statue', 'statue', '#f0f0f8', '#e83a8a', [['piedra', 12], ['amatista', 1]], 3500, 'deco']],
 c: [[30, 'c_of_joy_g', 'Diadema de joyera', 'Jeweller circlet', 'head', () => ({ k: 'circlet', s: TIERP[9], cover: 'hat' })], [50, 'c_of_joy_c', 'Chaqueta de terciopelo', 'Velvet jacket', 'body', OFC('coat', '#5a1a4a', '#ffd040')], [70, 'c_of_joy_k', 'Capa de seda brillante', 'Shimmering silk cape', 'back', () => ({ k: 'cape', o: ofRamp('#8a2a7a'), i: ofRamp('#3a1a3a'), tr: GOLD.slice(1) })]],
 k: [[10, 'Lupa: +10 % de experiencia de Joyería', 'Loupe: +10% Jewelcrafting XP', { xp: 10 }], [45, 'Firma de autor: productos de Joyería un 20 % más caros', "Maker's mark: Jewelcrafting goods worth 20% more", { sell: 20 }], [65, 'Engaste doble: 10 % de producto doble', 'Double setting: 10% double goods', { dbl: 10 }]] };
OFU.sastreria = {
 p: [[5, 'panuelos', 'Pañuelos bordados', 'Embroidered handkerchiefs', 'scroll', '#f0e8d8', '#e85a8a', 40, [['tela', 1]], 3], [15, 'ovillo', 'Ovillos de colores', 'Coloured yarn', 'wool', '#e86a8a', '#5a8ad0', 200, [['tela_fina', 2]], 2],
  [25, 'muneco_t', 'Muñeco de trapo', 'Rag doll', 'doll', '#f0c8a0', '#c83a5a', 520, [['tela_fina', 3], ['tinte', 1]], 1], [35, 'tapiz', 'Tapiz bordado', 'Embroidered tapestry', 'painting', '#8a2a3a', '#ffd040', 1300, [['tela_fina', 5], ['tinte', 2]], 1],
  [55, 'abanico', 'Abanico de seda', 'Silk fan', 'fan', '#e85a8a', '#ffd040', 2600, [['seda', 2], ['log4', 1]], 1], [75, 'obra_sas', 'Obra maestra: vestido de gala', 'Masterpiece: gala gown', 'doll', '#f0f0ff', '#c8a0ff', 11000, [['seda', 4], ['hilo_estelar', 1]], 1]],
 f: [[20, 'of_telar', 'Telar', 'Loom', 'loom', '#c83a5a', '#ffd040', [['log', 8]], 900, 'mueble'], [40, 'of_maniqui', 'Maniquí', 'Mannequin', 'statue', '#f0d8b8', '#5a8ad0', [['log', 3], ['tela_fina', 3]], 900, 'mueble'], [60, 'of_alfombra_s', 'Alfombra tejida', 'Woven rug', 'rug', '#c83a5a', '#ffd040', [['tela_fina', 8], ['tinte', 2]], 1500, 'deco']],
 c: [[30, 'c_of_sas_g', 'Cinta métrica', 'Measuring ribbon', 'head', OFC('bandana', '#ffd040', '#c8a020', { cover: 'hat' })], [50, 'c_of_sas_c', 'Chaleco a medida', 'Tailored waistcoat', 'body', OFC('vest', '#3a3a6a', '#ffd040')], [70, 'c_of_sas_p', 'Falda de sastre', 'Tailored skirt', 'legs', OFC('skirt', '#2a2a3a')]],
 k: [[10, 'Dedal: +10 % de experiencia de Sastrería', 'Thimble: +10% Tailoring XP', { xp: 10 }], [45, 'Alta costura: productos de Sastrería un 20 % más caros', 'Haute couture: Tailoring goods worth 20% more', { sell: 20 }], [65, 'Patrón doble: 15 % de producto doble', 'Double pattern: 15% double goods', { dbl: 15 }]] };
OFU.buceo = {
 p: [[5, 'collar_c', 'Collar de conchas', 'Shell necklace', 'shell', '#f0c8a0', '#e86a8a', 45, [['concha', 1]], 1], [15, 'coral_t', 'Coral tallado', 'Carved coral', 'figure', '#e85a4a', '#f0c8a0', 600, [['coral', 1]], 1],
  [25, 'farol_m', 'Farol marino', 'Sea lantern', 'lantern', '#3a8ad0', '#8af0ff', 900, [['concha', 2], ['ore3', 1]], 1], [35, 'botella_b', 'Barco en botella', 'Ship in a bottle', 'bottle', '#8ad0f0', '#7a4c29', 1600, [['log4', 2], ['perla', 1]], 1],
  [55, 'perla_t', 'Pendientes de perla negra', 'Black pearl earrings', 'pendant', '#2a2a3a', '#ffd040', 7000, [['perla_negra', 1], ['ore4', 1]], 1], [75, 'obra_buc', 'Obra maestra: cofre del galeón', "Masterpiece: galleon's chest", 'box', '#7a4c29', '#ffd040', 12000, [['perla', 3], ['ancla_maldita', 1]], 1]],
 f: [[20, 'of_acuario_c', 'Acuario de coral', 'Coral aquarium', 'tank', '#e85a4a', '#ffd040', [['coral', 1], ['piedra', 6]], 1200, 'mueble'], [40, 'of_ancla', 'Ancla decorativa', 'Decorative anchor', 'statue', '#424149', '#c8a040', [['ore2', 6]], 1200, 'deco'], [60, 'of_cofre_b', 'Cofre hundido', 'Sunken chest', 'crates', '#5a4a2a', '#ffd040', [['log5', 4], ['concha', 3]], 2500, 'deco']],
 c: [[30, 'c_of_buc_g', 'Gafas de buceo', 'Diving goggles', 'head', OFC('bandana', '#2a8ad0', '#c8f0ff', { cover: 'hat' })], [50, 'c_of_buc_c', 'Traje de neopreno', 'Wetsuit', 'body', OFC('shirt', '#1a2a4a', '#2a8ad0')], [70, 'c_of_buc_b', 'Aletas', 'Flippers', 'feet', OFC('sandals', '#2a8ad0')]],
 k: [[10, 'Pulmón de pez: +10 % de experiencia de Buceo', 'Fish lungs: +10% Diving XP', { xp: 10 }], [45, 'Tesoro del arrecife: 6 % de encontrar oro', 'Reef treasure: 6% chance of gold', { gold: 6 }], [65, 'Coleccionista marino: productos de Buceo un 20 % más caros', 'Sea collector: Diving goods worth 20% more', { sell: 20 }]] };
// oficios de minijuego (cielo, archipiélago, comercio, arte y Japón): productos con materiales comunes
const OF_MINI = {
 carrera: ['Carrera de Ángeles', '#e8f0ff', '#ffd040', ['medal', 'Medalla de alas', 'Wing medal'], ['figure', 'Figurita de ángel', 'Angel figurine'], ['fan', 'Abanico de plumas', 'Feather fan'], ['statue', 'Copa de las nubes', 'Cloud cup'], 'lamp', 'statue', ['ranger', 'shirt', 'boots'], '#e8f0ff', '#5a8ad0'],
 olimpiadas: ['Olimpiadas Angelicales', '#ffd040', '#e83a3a', ['medal', 'Medalla de bronce celeste', 'Celestial bronze medal'], ['scroll', 'Diploma olímpico', 'Olympic diploma'], ['figure', 'Estatuilla de atleta', 'Athlete statuette'], ['medal', 'Medalla de oro celeste', 'Celestial gold medal'], 'board', 'statue', ['bandana', 'tunic', 'sandals'], '#ffd040', '#e83a3a'],
 surf: ['Surf', '#2ab0e0', '#ffd040', ['shell', 'Llavero de concha', 'Shell keyring'], ['plank', 'Tabla en miniatura', 'Mini surfboard'], ['bottle', 'Arena de playa en frasco', 'Beach sand jar'], ['painting', 'Póster de la gran ola', 'Big wave poster'], 'rack', 'bench', ['bandana', 'shirt', 'sandals'], '#2ab0e0', '#ff8a3a'],
 arte: ['Arte', '#e85a8a', '#5a8ad0', ['scroll', 'Boceto enmarcado', 'Framed sketch'], ['painting', 'Paisaje al óleo', 'Oil landscape'], ['vase', 'Jarrón pintado', 'Painted vase'], ['painting', 'Retrato de la reina', 'Portrait of the queen'], 'easel', 'statue', ['bandana', 'coat', 'shoes'], '#3a2a5a', '#e85a8a'],
 comercio: ['Comercio', '#c8a040', '#7a4c29', ['crate', 'Lote de mercancías', 'Goods lot'], ['map', 'Mapa de rutas', 'Trade route map'], ['box', 'Caja de especias exóticas', 'Exotic spice box'], ['medal', 'Sello de mercader real', 'Royal merchant seal'], 'cart', 'crates', ['ranger', 'vest', 'boots'], '#8a5a2a', '#c8a040'],
 arqueologia: ['Arqueología', '#a09a80', '#c8a040', ['vase', 'Ánfora pegada', 'Glued amphora'], ['map', 'Calco de inscripción', 'Inscription rubbing'], ['figure', 'Réplica de guardián', 'Guardian replica'], ['statue', 'Busto antiguo', 'Ancient bust'], 'display', 'statue', ['ranger', 'shirt', 'boots'], '#c8a070', '#5a6a3a'],
 artista: ['Artista', '#c070ff', '#ffd040', ['painting', 'Lámina de la diosa', 'Goddess print'], ['figure', 'Figura de barro pintada', 'Painted clay figure'], ['painting', 'Cuadro de estrellas', 'Starry painting'], ['statue', 'Escultura de luz', 'Light sculpture'], 'easel', 'lamp', ['bandana', 'robe', 'shoes'], '#5a3a8a', '#c070ff'],
 rickshaw: ['Conductor de rickshaw', '#c83a3a', '#2a2a30', ['fan', 'Uchiwa de recuerdo', 'Souvenir uchiwa'], ['map', 'Guía de Takayama', 'Takayama guide'], ['doll', 'Muñeco de pasajero', 'Passenger doll'], ['lantern', 'Farolillo de rickshaw', 'Rickshaw lantern'], 'lamp', 'bench', ['bandana', 'kimono', 'sandals'], '#2a2a40', '#c83a3a'],
 sakero: ['Maestro sakero', '#f0f0f8', '#3a6ad0', ['bottle', 'Sake de arroz joven', 'Young rice sake'], ['bowl', 'Copa de sake', 'Sake cup'], ['bottle', 'Sake de ciruela', 'Plum sake'], ['crate', 'Barrica de cedro', 'Cedar cask'], 'barrel', 'shelf', ['bandana', 'kimono', 'sandals'], '#3a4a6a', '#f0f0f8'],
 sado: ['Maestro del té', '#5ab04a', '#c8a070', ['tea', 'Té verde matcha', 'Matcha tea'], ['bowl', 'Chawan de té', 'Tea bowl'], ['box', 'Caja de dulces wagashi', 'Wagashi box'], ['tea', 'Té de ceremonia imperial', 'Imperial ceremony tea'], 'bonsai', 'rug', ['bandana', 'kimono', 'sandals'], '#3a6a3a', '#c8a070'],
 ceramica: ['Ceramista', '#b0603a', '#5a8ad0', ['bowl', 'Taza de barro', 'Clay cup'], ['vase', 'Jarrón azul', 'Blue vase'], ['bowl', 'Juego de platos', 'Plate set'], ['vase', 'Jarrón del dragón', 'Dragon vase'], 'wheel', 'shelf', ['bandana', 'shirt', 'sandals'], '#7a5a3a', '#5a8ad0'],
};
const OF_MINI_MATS = [[['log1', 3], ['piedra', 2]], [['tela_fina', 2], ['log3', 2]], [['ore3', 2], ['tinte', 1]], [['ore4', 2], ['seda', 1]]];
for (const k in OF_MINI) { const [nm, c1, c2, a, b, c, d, f1, f2, kinds, oc1, oc2] = OF_MINI[k];
 OFU[k] = { p: [[10, ...a], [25, ...b], [45, ...c], [65, ...d]].map(([lv, sh, es, en], i) => [lv, k + '_' + i, es, en, sh, i % 2 ? c2 : c1, i % 2 ? c1 : c2, [80, 500, 1600, 4500][i], OF_MINI_MATS[i], 1]),
  f: [[20, 'of_' + k + '_a', L2('Recuerdo de ', 'Keepsake: ') + nm, L2('Recuerdo de ', 'Keepsake: ') + nm, f1, c1, c2, [['log', 4], ['piedra', 4]], 800, 'deco'], [55, 'of_' + k + '_b', L2('Trofeo de ', 'Trophy: ') + nm, L2('Trofeo de ', 'Trophy: ') + nm, f2, c2, c1, [['log4', 2], ['piedra', 8]], 2500, 'deco']],
  c: [[30, 'c_of_' + k + '_g', L2('Gorro de ', 'Cap: ') + nm, L2('Gorro de ', 'Cap: ') + nm, 'head', OFC(kinds[0], oc1, oc2, { cover: 'hat' })], [50, 'c_of_' + k + '_c', L2('Uniforme de ', 'Uniform: ') + nm, L2('Uniforme de ', 'Uniform: ') + nm, 'body', OFC(kinds[1], oc1, oc2)], [70, 'c_of_' + k + '_b', L2('Calzado de ', 'Shoes: ') + nm, L2('Calzado de ', 'Shoes: ') + nm, 'feet', OFC(kinds[2], oc2)]],
  k: [[15, '+10 % de experiencia de este oficio', '+10% XP in this job', { xp: 10 }], [40, 'Recuerdos más caros: productos un 20 % más caros', 'Pricier keepsakes: goods worth 20% more', { sell: 20 }], [60, 'Propinas: 6 % de ganar oro al trabajar', 'Tips: 6% chance of gold while working', { gold: 6 }]] }; }

// platos nuevos de hoguera (Cocina 55-85): sin más fuerza; más curación, más duración y más valor de venta
const OF_DISHES = [
 ['ramen', 'Ramen del gremio', 'Guild ramen', '', 'bowl', ['#f0d8a0', '#e85a3a', '#5ab04a'], 'job', 5, [['ig_huevo', 1], ['trigo', 2], ['ig_carne', 1], ['ig_cebolla', 1]], 55],
 ['paella', 'Arroz marinero', "Sailor's rice", '', 'pan', ['#f0c040', '#e85a3a', '#5ab04a'], 'gold', 5, [['ig_arroz', 3], ['salmon', 1], ['ig_limon', 1]], 58],
 ['curry', 'Curri de las especias', 'Spice curry', '', 'bowl', ['#d8902a', '#f4f4ec', '#5ab04a'], 'regen', 5, [['ig_arroz', 2], ['ig_carne', 1], ['ig_aji', 1], ['ig_papa', 1]], 62],
 ['tortilla', 'Tortilla de la abuela', "Grandma's omelette", '', 'pie', ['#f0c860', '#c89020', '#5ab04a'], 'hp', 5, [['ig_huevo', 3], ['ig_papa', 2], ['ig_cebolla', 1]], 65],
 ['pizza', 'Pizza del horno de leña', 'Wood-fired pizza', '', 'pie', ['#e8a040', '#e83a3a', '#5ab04a'], 'xp', 5, [['trigo', 3], ['tomate', 2], ['ig_queso', 2]], 68],
 ['bento', 'Bento de Japón', 'Japanese bento', '', 'plate', ['#f4f4ec', '#e85a8a', '#5ab04a'], 'spd', 5, [['ig_arroz', 2], ['salmon', 1], ['ig_huevo', 1], ['ig_hoja', 1]], 72],
 ['crepes', 'Crepes de fruta estelar', 'Starfruit crêpes', '', 'layer', ['#f0d0a0', '#ffd040', '#c070ff'], 'aspd', 5, [['ig_huevo', 2], ['ig_leche', 2], ['frutaestelar', 1]], 75],
 ['banquete_g', 'Banquete del Gremio', 'Guild banquet', '', 'roast', ['#a8501a', '#ffd040', '#5ab04a'], 'gold', 5, [['ig_carne', 3], ['melon', 1], ['uva', 2], ['ig_queso', 2]], 80],
 ['tarta_m', 'Tarta del Maestro', "Master's cake", '', 'cake', ['#fff0f8', '#e85a8a', '#ffd040'], 'xp', 5, [['frutaestelar', 2], ['ig_azucar', 3], ['ig_leche', 2], ['ig_huevo', 2]], 85],
];
const OF_DISH_LV = {};
for (const d of OF_DISHES) { const lv = d.pop(); PL.push(d); OF_DISH_LV[d[0]] = lv; for (const pf of [0, 1]) it((pf ? 'plp_' : 'pl_') + d[0], { n: L2(d[1], d[2]) + (pf ? ' ★' : ''), t: 'cons', stack: true, tier: 5, heal: 4000 + lv * 40, plato: d[0], perfect: pf, price: 900 + lv * 12, icon: ['ofi', 'pl_' + d[0]], rar: pf ? 4 : 3 }); UI_ICONS.push('ofi:pl_' + d[0]); }
// el nivel de Cocina de los platos nuevos (la hoguera usa PL_JLV por tier): se esconden hasta tenerlo
{ const _po = plOpen; plOpen = function (o, tab) { const jl = ((G.P && G.P.jobs.cocina) || { lv: 1 }).lv, hide = PL.filter(d => OF_DISH_LV[d[0]] && jl < OF_DISH_LV[d[0]]); const keep = PL.slice(); for (const d of hide) PL.splice(PL.indexOf(d), 1); try { return _po.apply(this, arguments); } finally { PL.length = 0; PL.push(...keep); } }; }
{ const _pc = plCook; plCook = function (o, d) { if (d && OF_DISH_LV[d[0]] && ((G.P.jobs.cocina || { lv: 1 }).lv) < OF_DISH_LV[d[0]]) { toast(L2('Requiere Cocina ', 'Requires Cooking ') + OF_DISH_LV[d[0]], 'warn'); return; } return _pc.apply(this, arguments); }; }
// los platos del gremio duran el doble
{ const _ui = useItem; useItem = function (idx) { const P = G.P, s = P.inv[idx], I = s && ITEMS[s.id]; const r = _ui.apply(this, arguments); if (I && I.plato && OF_DISH_LV[I.plato]) { const b = (P.buffs || []).find(b => b.id === 'plato'); if (b) { b.t *= 2; b.dur *= 2; } } return r; }; }

// ---------- registro: objetos, recetas, muebles, ropa ----------
const OF_PROD = {}, OF_FURN = {}, OF_COS = {};
for (const job in OFU) { const U = OFU[job];
 for (const [lv, id0, es, en, sh, c1, c2, price, mats, n] of U.p || []) { const id = 'ofp_' + id0; OF_PROD[id] = job;
  it(id, { n: L2(es, en), t: 'mat', stack: true, tier: Math.max(1, Math.ceil(lv / 8)), base: price, icon: ['ofp', sh, c1, c2], rar: lv >= 75 ? 4 : lv >= 55 ? 3 : lv >= 25 ? 2 : 1, ofjob: job, d: L2('Producto de oficio: véndelo, regálalo, entrégalo en pedidos o ponlo en tu tienda.', 'Crafted good: sell it, gift it, use it for orders or put it in your shop.') });
  Object.defineProperty(ITEMS[id], 'price', { get() { return Math.round(this.base * (1 + ofPerkSum(job, 'sell') / 100)); }, set(v) { this.base = v; }, enumerable: true, configurable: true });
  RECIPES.push({ id: 'r_' + id, job, out: id, n: n || 1, lv: 1, jlv: lv, gold: Math.round(price * 0.08), mats, cat: 'oficio' }); }
 for (const [lv, k, es, en, sh, c1, c2, cost, gold, cat] of U.f || []) { const key = k.replace(/^of_/, 'of_'); OF_FURN[key] = [job, lv];
  BK[key] = { n: L2(es, en), f: 'of_' + key, fp: OFF_FP[sh] || [[0, 0]], cost, gold, tool: 'tala', tier: 1, cat, L: 1, ofs: [sh, c1, c2], ofjob: job, ofjlv: lv, solid: sh === 'rug' ? false : undefined };
  BK_KEYS.push(key); it('bk_' + key, { n: BK[key].n, t: 'mat', bk: key, stack: true, tier: 1, price: 5, icon: ['bk', key] }); }
 for (const [lv, id, es, en, slot, vis] of U.c || []) { OF_COS[id] = [job, lv]; cosm(id, L2(es, en), slot, vis, { src: L2('Oficio: ', 'Job: ') + (JOBS[job] ? JOBS[job].n : job) + ' ' + lv }); it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: 1500 + lv * 40, icon: ['hanger'], rar: 3 }); } }
function ofPerkSum(job, key) { const P = G.P, U = OFU[job]; if (!P || !U || !P.jobs || !P.jobs[job]) return 0; let v = 0; for (const [lv, , , ef] of U.k || []) if (P.jobs[job].lv >= lv && ef[key]) v += ef[key]; return v; }
// muebles: hace falta el nivel del oficio para fabricarlos en la Mesa de trabajo
{ const _cc = bkCanCraft; bkCanCraft = function (b, n) { if (b && b.ofjob && ((G.P.jobs[b.ofjob] || { lv: 1 }).lv) < b.ofjlv) return false; return _cc.apply(this, arguments); }; }
{ const _ct = bkCostTxt; bkCostTxt = function (b) { const t = _ct.apply(this, arguments); return b && b.ofjob ? t + ' · ' + (JOBS[b.ofjob] ? JOBS[b.ofjob].n : b.ofjob) + ' ' + b.ofjlv : t; }; }
// producto doble en el taller
{ const _dc = doCraft; doCraft = function (r) { const before = r && OF_PROD[r.out] ? countItem(r.out) : -1; const res = _dc.apply(this, arguments); if (before >= 0 && countItem(r.out) > before) { const d = ofPerkSum(r.job, 'dbl'); if (d && Math.random() < d / 100) { giveItem(r.out, r.n, true); floatText(G.P.x, G.P.y - 50, L2('¡Doble!', 'Double!'), '#ffd040'); } } return res; }; }

// ---------- subir de nivel: avisos y ropa del oficio ----------
function ofUnlocksAt(job, lv) { const U = OFU[job], out = []; if (!U) return out;
 for (const p of U.p || []) if (p[0] === lv) out.push(['p', ITEMS['ofp_' + p[1]].n]);
 for (const f of U.f || []) if (f[0] === lv) out.push(['f', BK[f[1]].n]);
 for (const c of U.c || []) if (c[0] === lv) out.push(['c', COSM[c[1]].n]);
 for (const k of U.k || []) if (k[0] === lv) out.push(['k', L2(k[1], k[2])]);
 for (const d of OF_DISHES) if (job === 'cocina' && OF_DISH_LV[d[0]] === lv) out.push(['d', L2(d[1], d[2])]);
 if (lv === 50) out.push(['a', L2('+0,1 % de ataque (máx. +1 % con 10 oficios)', '+0.1% attack (max +1% with 10 jobs)')]);
 return out; }
function ofOnLevel(job, a, b) { const all = []; for (let lv = a + 1; lv <= b; lv++) { for (const [t, n] of ofUnlocksAt(job, lv)) all.push([lv, t, n]);
  for (const c of (OFU[job] && OFU[job].c) || []) if (c[0] === lv) ofGiveCos(c[1]); }
 if (!all.length) return; const ic = { c: '👕 ', f: '🪑 ', d: '🍲 ', a: '⚔ ', k: '🏅 ', p: '📦 ' };
 all.slice(0, 3).forEach(([lv, t, n]) => toast(ic[t] + (JOBS[job] ? JOBS[job].n : job) + ' ' + lv + ': ' + n, 'job', 4));
 if (all.length > 3) toast(L2('…y ', '…and ') + (all.length - 3) + L2(' desbloqueos más (mira Oficios).', ' more unlocks (see Jobs).'), 'job', 4);
 ofCatchUp(); if (a < 50 && b >= 50) calcStats(G.P); markDirty(true); }
function ofGiveCos(id) { const O = ofx(); if (O.got[id]) return; O.got[id] = 1; giveItem('cosi_' + id, 1); }
// partidas guardadas: entrega la ropa que ya te corresponde
function ofCatchUp() { const P = G.P; if (!P || !P.jobs) return; for (const id in OF_COS) { const [job, lv] = OF_COS[id]; if ((P.jobs[job] || { lv: 1 }).lv >= lv) ofGiveCos(id); } }
V33_TICKS.push(() => { const P = G.P; if (!P || P._ofCU) return; P._ofCU = 1; try { for (const k in JOBS) if (!P.jobs[k]) P.jobs[k] = { lv: 1, xp: 0 }; ofCatchUp(); } catch (e) { } });

// ---------- panel de oficios: lo nuevo de cada oficio ----------
const OF_TYPE = { p: L2('Producto', 'Good'), f: L2('Mueble', 'Furniture'), c: L2('Ropa', 'Clothing'), k: L2('Ventaja', 'Perk'), d: L2('Plato', 'Dish'), a: L2('Ataque', 'Attack') };
{ const _pl = perkLine; perkLine = function (job) { const base = _pl.apply(this, arguments), J = (G.P.jobs[job] || { lv: 1 }), nx = []; for (let lv = 5; lv <= 85; lv += 5) for (const [t, n] of ofUnlocksAt(job, lv)) nx.push([lv, t, n]);
  const done = nx.filter(v => J.lv >= v[0]).length, next = nx.find(v => J.lv < v[0]);
  return base + `<span class="perk ${done ? 'on' : ''}">${done ? '✓ ' : ''}${done}/${nx.length} ${L2('desbloqueos del gremio', 'guild unlocks')}</span>` + (next ? `<span class="perk">${L2('Nv.', 'Lv.')}${next[0]} ${esc(OF_TYPE[next[1]])}: ${esc(next[2])}</span>` : ''); }; }
// renderJobs solo listaba los oficios clásicos; las ventajas nuevas también salen en la Guía de oficios (JOB_PERKS)
for (const job in OFU) { JOB_PERKS[job] = JOB_PERKS[job] || []; for (const [lv, es, en] of OFU[job].k || []) JOB_PERKS[job].push([lv, L2(es, en)]); JOB_PERKS[job].sort((a, b) => a[0] - b[0]); }

// ---------- Gremio de Oficios: una oficina en cada pueblo ----------
const GR_TOWNS = ['albor', 'puerto', 'arxar', 'sahrim', 'yarakai', 'brasa'];
const GR_LOOK = LK({ hair: HAIRS.castano, hairStyle: 'long', outfit: 'apron', main: CLOTH.marron, sec: CLOTH.beige, eyes: 'verde', hat: 'straw' });
for (const t of GR_TOWNS) NPCS['gremio_' + t] = { n: L2('Encargada del Gremio', 'Guild Clerk'), title: L2('Gremio de Oficios', 'Crafters Guild'), look: GR_LOOK, lines: [L2('Cada oficio tiene su recompensa. Hasta el más humilde.', 'Every job has its reward. Even the humblest one.'), L2('¿Buscas trabajo? Tengo pedidos frescos cada día.', 'Looking for work? I have fresh orders every day.')] };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); for (const tk of GR_TOWNS) { const t = TOWNS.find(t => t.k === tk); if (!t) continue; const [x, y] = freeTileNear(W, (t.x0 + t.x1) / 2 + 6, (t.y0 + t.y1) / 2 + 4); W.npcDefs.push({ id: 'gremio_' + tk, x, y, face: 'down' }); } }; }
DLG_HOOKS.push((npc, opts) => { if (!/^gremio_/.test(npc.id || '')) return; const tk = npc.id.slice(7);
 opts.unshift({ label: L2('Pedidos del gremio', 'Guild orders'), icon: ['board'], fn: () => { closeDialog(); ofOrders(tk); } },
  { label: L2('Taller de oficios', 'Crafts workshop'), icon: ['anvil'], fn: () => { closeDialog(); ofWorkshop(); } },
  { label: L2('Maestrías de oficio', 'Job masteries'), icon: ['star', '#ffd040'], fn: () => { closeDialog(); ofMasteries(); } }); });

// taller: productos de todos los oficios (los de Herrería, Alquimia, Cocina, Joyería y Sastrería también salen en sus mesas)
let OFW_JOB = 'tala';
function ofWorkshop() { const P = G.P, jobs = Object.keys(OFU).filter(j => JOBS[j]); if (!jobs.includes(OFW_JOB)) OFW_JOB = jobs[0];
 const list = RECIPES.filter(r => r.cat === 'oficio' && r.job === OFW_JOB);
 const rows = list.map(r => { const I = ITEMS[r.out], why = craftCheck(r), mats = matsFor(r).map(([id, n]) => `<span class="${countItem(id) >= n ? 'ok' : 'bad'}">${iconHTML(ITEMS[id].icon, 14)} ${countItem(id)}/${n}</span>`).join('');
  return `<div class="crow ${why ? 'dim' : ''}">${iconHTML(I.icon, 32)}<div class="sn"><b style="color:${RARC[I.rar || 0]}">${esc(I.n)}${r.n > 1 ? ' ×' + r.n : ''}</b><small>${L2('Vale', 'Worth')} ${fmt(I.price)} · ${esc(JOBS[r.job].n)} ${r.jlv}</small><div class="mats">${mats}<span class="${P.gold >= r.gold ? 'ok' : 'bad'}">${fmt(r.gold)} ${L2('oro', 'gold')}</span></div></div><button class="btn sm" data-ofc="${r.id}" ${why ? 'disabled' : ''}>${L2('Hacer', 'Make')}</button></div>`; }).join('');
 openModal(`<h2>${iconHTML(['anvil'], 22)} ${L2('Taller de oficios', 'Crafts workshop')}</h2><p class="hint">${L2('Productos de cada oficio. Se venden caros, sirven para pedidos y para tu tienda. Muebles y ropa: Mesa de trabajo y Vestuario.', 'Goods from every job. They sell well and are used for orders and your shop. Furniture and clothes: Workbench and Wardrobe.')}</p>
  <div class="chips">${jobs.map(j => `<button class="chip ${OFW_JOB === j ? 'on' : ''}" data-ofj="${j}">${esc(JOBS[j].n)} ${(P.jobs[j] || { lv: 1 }).lv}</button>`).join('')}</div>
  <div class="goldline">${iconHTML(['coin'], 16)} ${fmt(P.gold)}</div><div class="slist">${rows}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
 $('#mclose').onclick = closeModal; $$('#modal [data-ofj]').forEach(b => b.onclick = () => { OFW_JOB = b.dataset.ofj; ofWorkshop(); });
 $$('#modal [data-ofc]').forEach(b => b.onclick = () => { doCraft(RECIPES.find(r => r.id === b.dataset.ofc)); ofWorkshop(); }); }
// los oficios con mesa propia muestran sus productos nuevos también allí (renderCraft filtra por oficio)
{ const _rc = renderCraft; renderCraft = function () { const r = _rc.apply(this, arguments); try { const h = $('#modal h2'); if (h && /undefined/.test(h.textContent)) h.firstChild.textContent = JOBS[craftState.job].n + ' '; } catch (e) { } return r; }; }

// maestrías para los oficios sin maestro propio (las de Tala, Minería, Pesca y Agricultura siguen con sus maestros)
for (const job in JOBS) if (!MAST[job]) MAST[job] = { npc: '_gremio', town: '_gremio', need: [40, 60, 75], gold: [12000, 50000, 160000], mats: [[], [], []], gremio: 1 };
// los productos de gremio cuentan como «material» del maestro: piden obras propias del oficio
for (const job in MAST) if (MAST[job].gremio && OFU[job]) { const ps = (OFU[job].p || []).map(p => 'ofp_' + p[1]); MAST[job].mats = [[[ps[1] || ps[0], 3]], [[ps[3] || ps[1], 3]], [[ps[ps.length - 1], 1]]]; }
function ofMasteries() { const P = G.P, list = Object.keys(MAST).filter(j => JOBS[j] && MAST[j].gremio);
 openModal(`<h2>${iconHTML(['star', '#ffd040'], 22)} ${L2('Maestrías de oficio', 'Job masteries')}</h2><p class="hint">${L2('Cada rango sube 10 niveles el tope del oficio (hasta 105) y da +15 % de experiencia de ese oficio. Tala, Minería, Pesca y Agricultura tienen sus propios maestros.', 'Each rank raises the job cap by 10 levels (up to 105) and gives +15% XP for that job. Woodcutting, Mining, Fishing and Farming have their own masters.')}</p>
  <div class="slist">${list.map(j => `<div class="srow">${iconHTML(['star', mastRank(j) ? '#ffd040' : '#8a8a96'], 24)}<div class="sn"><b>${esc(JOBS[j].n)}</b><small>${MAST_RANK[mastRank(j)]} · ${L2('Nv.', 'Lv.')} ${(P.jobs[j] || { lv: 1 }).lv}</small></div><button class="btn sm" data-ofm="${j}">${L2('Ver', 'View')}</button></div>`).join('')}</div>
  <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
 $('#mclose').onclick = closeModal; $$('#modal [data-ofm]').forEach(b => b.onclick = () => openMastery(b.dataset.ofm)); }

// pedidos diarios: 3 por pueblo y día de juego. Productos o materiales del oficio a cambio de oro, experiencia y a veces un regalo único.
function ofSeed(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return () => (h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0, h / 4294967296); }
function ofOrderList(tk) { const P = G.P, day = calDay(), R = ofSeed(tk + ':' + day + ':' + (P.name || '')), out = [];
 const jobs = Object.keys(OFU).filter(j => JOBS[j] && P.jobs[j]); const pick = a => a[Math.floor(R() * a.length)];
 for (let i = 0; i < 3; i++) { const job = pick(jobs), J = P.jobs[job] || { lv: 1 }, U = OFU[job], ok = (U.p || []).filter(p => p[0] <= Math.max(5, J.lv)); const p = ok.length ? ok[Math.floor(R() * ok.length)] : U.p[0];
  const id = 'ofp_' + p[1], n = 1 + Math.floor(R() * (p[0] >= 55 ? 1 : 3)), I = ITEMS[id];
  out.push({ k: tk + day + ':' + i, job, id, n, gold: Math.round(I.base * n * 1.6 + 200), xp: Math.round(60 + p[0] * 12 * n), gift: R() < 0.3 }); }
 return out; }
function ofOrders(tk) { const P = G.P, O = ofx(), list = ofOrderList(tk);
 openModal(`<h2>${iconHTML(['board'], 22)} ${L2('Pedidos del gremio', 'Guild orders')}</h2><p class="hint">${L2('Tres pedidos nuevos cada día. Pagan más que la tienda y dan experiencia del oficio.', 'Three new orders every day. They pay more than the shop and give job XP.')}</p>
  <div class="slist">${list.map(o => { const I = ITEMS[o.id], done = O.ord[o.k] !== undefined, have = countItem(o.id) >= o.n;
   return `<div class="srow ${done ? 'dim' : ''}">${iconHTML(I.icon, 30)}<div class="sn"><b>${o.n} × ${esc(I.n)}</b><small>${esc(JOBS[o.job].n)} · ${fmt(o.gold)} ${L2('oro', 'gold')} · +${o.xp} ${L2('exp. de oficio', 'job XP')}${o.gift ? ' · 🎁' : ''}</small><small>${L2('Tienes', 'You have')} ${countItem(o.id)}</small></div><button class="btn sm gold" data-ofo="${o.k}" ${done || !have ? 'disabled' : ''}>${done ? L2('Hecho', 'Done') : L2('Entregar', 'Deliver')}</button></div>`; }).join('')}</div>
  <div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
 $('#mclose').onclick = closeModal;
 $$('#modal [data-ofo]').forEach(b => b.onclick = () => { const o = list.find(v => v.k === b.dataset.ofo); if (!o || O.ord[o.k] !== undefined || countItem(o.id) < o.n) return; takeItem(o.id, o.n); O.ord[o.k] = calDay(); P.gold += o.gold; gainJobXp(o.job, o.xp); sfx('coin');
  if (o.gift) { const opts = (OFU[o.job].f || []).map(f => 'bk_' + f[1]); const g = opts[Math.floor(Math.random() * opts.length)]; if (g) { giveItem(g, 1); toast('🎁 ' + ITEMS[g].n, 'quest', 3); } }
  // limpieza: solo se guardan los pedidos de los últimos días
  for (const k in O.ord) if (!(O.ord[k] >= calDay() - 1)) delete O.ord[k];
  markDirty(true); ofOrders(tk); }); }
