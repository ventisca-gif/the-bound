// ================= v4.18: EL CONTINENTE DEL VELO ROTO — personajes dibujados en código (estilo dark fantasy) =================
// Se dibujan al doble de resolución (cada píxel = medio píxel del juego) para que en HD tengan más detalle que los héroes.
const VR_ART = (() => {
const VP = s => pal(s);
function sh(p, x, y, w, h, c) { p.rect(x, y, w, h, C(c)); }
function grad(p, x0, y0, w, h, cols, vert) { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = vert ? y / h : x / w; const i = Math.min(cols.length - 1, Math.floor(t * cols.length)); p.set(x0 + x, y0 + y, C(cols[i])); } }
function face(p, cx, cy, skin, eyeC, lipC, opt) {   // cara estilizada (pelo aparte)
  const S = VP(skin); p.ball(cx, cy, 9, 11, [S[1], S[2], S[3], S[4]]); p.ball(cx, cy + 6, 6.5, 6, [S[1], S[2], S[3], S[4]]);
  for (const s of [-1, 1]) { const ex = cx + s * 4; p.rect(ex - 2, cy - 1, 4, 2, C('#ffffff')); p.rect(ex - 1, cy - 1, 2, 3, C(eyeC)); p.set(ex - (s > 0 ? 1 : 0), cy - 1, C('#ffffff')); p.hl(ex - 3, cy - 3, 5, C('#120818')); p.set(ex + s * 3, cy - 2, C('#120818')); }
  p.hl(cx - 3, cy - 5, 2, S[0]); p.hl(cx + 2, cy - 5, 2, S[0]);
  p.set(cx, cy + 3, S[1]); p.hl(cx - 2, cy + 7, 5, C(lipC)); p.hl(cx - 1, cy + 8, 3, uMul(C(lipC), 0.7));
}
function gown(p, cx, top, waistY, hem, main, trim, sleeve, bust) {   // vestido con corsé, cintura y falda
  const M = VP(main), T = VP(trim);
  for (let y = top; y < hem; y++) { const t = (y - top) / (hem - top); let w = y < waistY ? 13 - Math.round(Math.sin(Math.min(1, (y - top) / (waistY - top)) * 3.0) * 3) : 9 + Math.round((y - waistY) * 0.45);
    for (let x = cx - w; x <= cx + w; x++) { const k = (x - cx + w) / (2 * w); p.set(x, y, M[k < 0.18 ? 1 : k > 0.82 ? 1 : ((x * 3 + y * 2) % 11 === 0 ? 3 : 2)]); } }
  if (bust) for (const s of [-1, 1]) p.ball(cx + s * 5, top + 7, 6, 5, [M[1], M[2], M[3], M[4]]);
  // brocado: rombos y líneas
  for (let y = waistY + 4; y < hem - 2; y += 6) for (let x = cx - 8; x <= cx + 8; x += 6) { p.set(x, y, M[4]); p.set(x - 1, y + 1, M[3]); p.set(x + 1, y + 1, M[3]); p.set(x, y + 2, M[4]); }
  for (let y = top + 12; y < waistY; y++) p.set(cx, y, M[0]);
  // encaje del escote, la cintura y el bajo
  for (let x = cx - 12; x <= cx + 12; x++) { const yy = top + 2 + Math.round(Math.abs(x - cx) * 0.35); p.set(x, yy, T[3]); p.set(x, yy + 1, (x & 1) ? T[2] : T[4]); }
  for (let x = cx - 10; x <= cx + 10; x++) { const yy = waistY + 1 + Math.round(Math.abs(x - cx) * -0.25 + 3); p.set(x, yy, T[3]); if (x % 2) p.set(x, yy + 1, T[2]); }
  for (let x = cx - 26; x <= cx + 26; x++) if (uA(p.get(x, hem - 1))) { p.set(x, hem - 1, T[3]); if (x % 3 === 0) p.set(x, hem, T[2]); }
  // mangas abullonadas
  for (const s of [-1, 1]) { const S = VP(sleeve); p.ball(cx + s * 16, top + 3, 6, 6, [S[1], S[2], S[3], S[4]]); for (let y = top + 8; y < top + 38; y++) { const w = 4 + (y > top + 30 ? 2 : 0); for (let x = -w; x <= w; x++) p.set(cx + s * 17 + x, y, S[x === -w || x === w ? 1 : (y * 5 + x) % 9 === 0 ? 3 : 2]); } for (let x = -6; x <= 6; x++) { p.set(cx + s * 17 + x, top + 38, T[3]); if (x % 2) p.set(cx + s * 17 + x, top + 39, T[2]); } }
}
function gem(p, x, y, c) { const G_ = VP(c); p.set(x, y - 2, G_[3]); p.hl(x - 1, y - 1, 3, G_[2]); p.hl(x - 2, y, 5, G_[1]); p.hl(x - 1, y + 1, 3, G_[0]); p.set(x, y + 2, G_[0]); p.set(x - 1, y - 1, C('#ffffff')); }
// ---------- Hechicera Violeta ----------
function hechiceraVioleta() { const p = new Pix(64, 112), cx = 32;
  gown(p, cx, 34, 58, 108, ['#1a0830', '#3a1060', '#5a1c90', '#7a30c0', '#a060e8'], ['#0a4a4a', '#1a8a8a', '#3ac8c0', '#8af0e8', '#e0fffa'], ['#1a0830', '#3a1060', '#5a1c90', '#7a30c0', '#a060e8'], true);
  const SK = ['#14143a', '#262a6a', '#3a409a', '#5a60c0', '#8a90e0'];
  for (const s of [-1, 1]) { p.ball(cx + s * 17, 76, 3, 4, VP(SK).slice(1)); }
  p.rect(cx - 3, 28, 6, 6, C(SK[2])); p.hl(cx - 2, 33, 4, C(SK[1]));   // cuello
  for (const x of [-6, -3, 0, 3, 6]) gem(p, cx + x, 32 + Math.abs(x) * 0.2, ['#5a0a2a', '#a01a50', '#e03a80', '#ff9ac8']); gem(p, cx, 39, ['#5a0a2a', '#a01a50', '#e03a80', '#ff9ac8']); gem(p, cx, 60, ['#5a0a2a', '#a01a50', '#e03a80', '#ff9ac8']);
  // pelo: melena corta negra con flequillo recto
  const H = VP(['#05040a', '#0e0c18', '#1a1828', '#2a2a40', '#40405a']); p.ball(cx, 14, 15, 14, [H[1], H[2], H[3], H[4]]); p.rect(cx - 15, 14, 30, 14, H[1]);
  face(p, cx, 17, SK, '#c080ff', '#3a40c0');
  p.rect(cx - 10, 4, 20, 9, H[2]); for (let x = cx - 10; x <= cx + 10; x += 2) p.vl(x, 8, 4, H[3]); p.hl(cx - 9, 6, 6, H[4]);
  p.outline(OUTL); return p; }
// ---------- Hechicera Carmesí ----------
function hechiceraCarmesi() { const p = new Pix(64, 112), cx = 32;
  gown(p, cx, 34, 58, 108, ['#2a0408', '#5a0a12', '#8a1420', '#b02030', '#d8404a'], ['#2a0408', '#5a0a12', '#8a1420', '#b02030', '#d8404a'], ['#2a0408', '#5a0a12', '#8a1420', '#b02030', '#d8404a'], true);
  for (let y = 40; y < 104; y += 5) for (let x = cx - 10; x <= cx + 10; x += 5) { p.set(x, y, C('#3a0610')); p.set(x + 1, y + 1, C('#d8404a')); }   // remolinos del brocado
  const SK = ['#0a4a4a', '#1a7a7a', '#2ab0a8', '#5ad8d0', '#a0fff0'];
  for (const s of [-1, 1]) p.ball(cx + s * 17, 76, 3, 4, VP(SK).slice(1));
  p.rect(cx - 3, 28, 6, 7, C(SK[2]));
  // cuello de piel negra alto
  const F = VP(['#020204', '#0a0a10', '#14141c', '#22222e', '#3a3a4a']); for (const s of [-1, 1]) p.poly([[cx + s * 4, 36], [cx + s * 22, 18], [cx + s * 20, 34], [cx + s * 10, 40]], F[2]); for (let k = 0; k < 8; k++) p.set(cx + (k % 2 ? 1 : -1) * (8 + k * 1.5), 22 + k * 2, F[4]);
  for (let k = -3; k <= 3; k++) gem(p, cx + k * 2.5, 36 + Math.abs(k) * -0.5 + 2, ['#3a0408', '#8a0a14', '#d01a28', '#ff8a8a']); for (let k = -4; k <= 4; k += 2) p.set(cx + k * 2, 35, C('#d8b030'));
  const H = VP(['#020208', '#0a0a14', '#141428', '#22223c', '#3a3a5a']); p.ball(cx, 13, 12, 11, [H[1], H[2], H[3], H[4]]);
  face(p, cx, 17, SK, '#c0f0f0', '#c01020');
  for (let x = cx - 9; x <= cx + 9; x += 3) p.poly([[x, 6], [x + 3, 6], [x + 1, 12 + (x % 2)]], H[2]); for (const s of [-1, 1]) { p.ball(cx + s * 11, 22, 1.5, 2.5, VP(['#5a3a0a', '#b08020', '#e0c040', '#fff0a0'])); p.set(cx + s * 11, 25, C('#d01a28')); }
  p.outline(OUTL); return p; }
// ---------- Rey Esqueleto con su búho ----------
function reyEsqueleto() { const p = new Pix(84, 112), cx = 34;
  const R = VP(['#2a0408', '#5a0a12', '#8a1420', '#b02030', '#d03a40']), G2 = VP(['#04201a', '#0a3a2e', '#145a48', '#2a8a6a', '#5ac0a0']);
  for (let y = 36; y < 110; y++) { const w = 15 + Math.round((y - 36) * 0.22); for (let x = cx - w; x <= cx + w; x++) { const z = Math.floor((y + Math.abs(x - cx) * 0.8) / 7) % 2; p.set(x, y, y > 72 ? G2[z ? 1 : 2] : R[z ? 2 : 3]); } }
  for (let y = 70; y < 76; y++) for (let x = cx - 18; x <= cx + 18; x++) p.set(x, y, VP(['#3a4a50', '#6a8088', '#a0b8c0', '#d8eef4'])[y === 70 ? 3 : (x * 3 + y) % 5 ? 2 : 1]);
  for (let k = 0; k < 4; k++) p.ball(cx - 6 + k * 4, 50 + (k % 2) * 4, 2, 3, [G2[2], G2[3], G2[4], G2[4]]);
  p.ball(cx, 34, 19, 6, [G2[1], G2[2], G2[3], G2[4]]); for (let x = cx - 16; x <= cx + 16; x += 4) p.set(x, 34, C('#5ac0ff'));   // estola con gemas
  p.ball(cx, 20, 12, 13, [G2[0], G2[1], G2[2], G2[3]]);   // capucha
  const B = VP(['#6a7a8a', '#a8b8c8', '#d0e0ec', '#f0f8ff', '#ffffff']); p.ball(cx, 22, 8, 9, [B[1], B[2], B[3], B[4]]);
  p.ball(cx - 3, 21, 2.5, 3, [C('#000'), C('#000'), C('#0a0a10'), C('#0a0a10')]); p.ball(cx + 3, 21, 2.5, 3, [C('#000'), C('#000'), C('#0a0a10'), C('#0a0a10')]); p.set(cx, 25, C('#1a1a24')); for (let x = cx - 4; x <= cx + 4; x += 2) p.vl(x, 28, 2, B[1]);
  const Cr = VP(['#2a6a8a', '#5aa8d0', '#9ae0ff', '#e0f8ff']); p.hl(cx - 9, 13, 18, Cr[2]); for (let k = 0; k < 5; k++) p.poly([[cx - 9 + k * 4, 13], [cx - 7 + k * 4, 4 + (k === 2 ? -3 : 0)], [cx - 5 + k * 4, 13]], Cr[k % 2 ? 1 : 2]);
  // búho blanco de ojos rojos
  const O = VP(['#6a7080', '#a8b0c0', '#dce4ee', '#ffffff']); const ox = 66, oy = 70; p.rect(ox - 8, oy + 16, 16, 22, C('#1a2a2a')); p.ball(ox, oy + 6, 8, 11, O); p.ball(ox, oy - 4, 7, 6, O);
  for (const s of [-1, 1]) { p.ball(ox + s * 3, oy - 4, 2, 2, [C('#5a0000'), C('#c00010'), C('#ff2030'), C('#ff8080')]); } p.set(ox, oy - 1, C('#e0b040')); for (let k = 0; k < 6; k++) p.hl(ox + 2, oy + 2 + k * 2, 4, O[0]);
  p.outline(OUTL); return p; }
// ---------- Brujo Sapo ----------
function brujoSapo() { const p = new Pix(64, 112), cx = 30; const R = VP(['#04201e', '#0a3a36', '#145a54', '#2a8a80', '#5ac8bc']), Gk = VP(['#0a3a0a', '#1a6a1a', '#3aa03a', '#6ad06a', '#b0ffb0']);
  for (let y = 42; y < 110; y++) { const w = 11 + Math.round((y - 42) * 0.25); for (let x = cx - w; x <= cx + w; x++) p.set(x, y, R[Math.floor((y + Math.abs(x - cx)) / 5) % 2 ? 2 : 3]); }
  for (const s of [-1, 1]) p.poly([[cx + s * 10, 48], [cx + s * 24, 82], [cx + s * 12, 80]], R[1]); p.hl(cx - 10, 66, 20, R[1]);
  p.ball(cx, 34, 13, 11, Gk.slice(1)); for (const s of [-1, 1]) { p.ball(cx + s * 6, 28, 5, 5, [C('#5a8a90'), C('#a8d8e0'), C('#e0fbff'), C('#ffffff')]); p.ball(cx + s * 6, 28, 1.5, 1.5, [C('#000'), C('#000'), C('#102020'), C('#102020')]); }
  p.hl(cx - 7, 39, 14, Gk[0]); p.hl(cx - 6, 40, 12, C('#1a0a0a'));
  p.poly([[cx - 22, 22], [cx + 22, 22], [cx + 4, -2 + 6], [cx + 10, 0]], R[2]); p.poly([[cx - 10, 22], [cx + 2, 2], [cx + 12, 22]], R[3]); p.hl(cx - 22, 22, 44, R[1]);
  for (let y = 30; y < 110; y++) { const x = cx + 20 - Math.round((y - 30) * 0.1); p.set(x, y, C('#8a7a4a')); p.set(x + 1, y, C('#c0b070')); } p.ball(cx + 21, 52, 3, 3, Gk.slice(1));
  p.ball(cx - 18, 60, 3, 3, Gk.slice(1)); p.outline(OUTL); return p; }
// ---------- Demonio Cornudo ----------
function demonio() { const p = new Pix(72, 116), cx = 36; const M = VP(['#3a0a3a', '#6a1a6a', '#a02aa0', '#d040d0', '#ff80ff']), H = VP(['#0a0a2a', '#14145a', '#2a2a8a', '#4a4ac0', '#8080ff']);
  for (const s of [-1, 1]) { p.rect(cx + s * 6 - 3, 66, 7, 46, M[2]); p.vl(cx + s * 6 - 3, 66, 46, M[1]); for (let y = 70; y < 108; y += 6) p.hl(cx + s * 6 - 2, y, 4, M[1]); }
  p.ball(cx, 48, 14, 18, M.slice(1)); for (let k = 0; k < 5; k++) { p.hl(cx - 11, 38 + k * 5, 9, M[0]); p.hl(cx + 2, 38 + k * 5, 9, M[0]); }   // costillas
  for (const s of [-1, 1]) { p.ball(cx + s * 16, 36, 5, 5, M.slice(1)); for (let y = 38; y < 72; y++) p.hl(cx + s * 19 - 2, y, 5, M[y % 6 ? 2 : 1]); }
  p.rect(cx - 15, 64, 30, 5, H[1]); for (let x = cx - 14; x <= cx + 14; x += 4) p.rect(x, 65, 3, 3, H[3]); p.poly([[cx - 10, 69], [cx + 10, 69], [cx + 6, 92], [cx - 6, 92]], H[2]); for (let y = 86; y < 94; y += 2) p.set(cx - 4 + (y % 4), y, C('#000'));
  const B = VP(['#7a7a8a', '#b0b0c0', '#e0e0ea', '#ffffff']); p.ball(cx, 20, 10, 11, M.slice(1)); p.ball(cx - 4, 18, 3, 3, [C('#0a3a0a'), C('#3aff3a'), C('#9aff9a'), C('#ffffff')]); p.ball(cx + 4, 18, 3, 3, [C('#0a3a0a'), C('#3aff3a'), C('#9aff9a'), C('#ffffff')]); for (let x = cx - 5; x <= cx + 5; x += 2) p.vl(x, 26, 3, B[2]);
  for (const s of [-1, 1]) for (let k = 0; k < 16; k++) { const a = -Math.PI / 2 - s * (0.5 + k * 0.09); p.ball(cx + s * 8 + Math.cos(a) * k * 1.6 * -s * -1 + s * k * 1.3, 12 - k * 0.6 + (k > 9 ? (k - 9) * 0.9 : 0), 2.2 - k * 0.08, 2.2 - k * 0.08, H.slice(1)); }
  // hacha de hueso
  const ax = cx - 26; for (let y = 52; y < 104; y++) { p.set(ax, y, B[2]); p.set(ax + 1, y, B[1]); } p.ball(ax, 52, 3, 3, B); p.poly([[ax - 2, 84], [ax - 12, 78], [ax - 9, 94], [ax - 2, 92]], B[2]); p.poly([[ax + 2, 84], [ax + 8, 80], [ax + 6, 92]], B[1]);
  p.outline(OUTL); return p; }
// ---------- Obispo Hueco ----------
function obispo() { const p = new Pix(72, 116), cx = 32; const R = VP(['#2a0418', '#5a0a2a', '#8a1440', '#b02a58', '#d04a78']), Bl = VP(['#0a0a3a', '#14146a', '#2a2a9a', '#4a4ac0', '#7a7ae0']), Gd = VP(['#5a3a0a', '#9a7010', '#d0a020', '#f0d050', '#fff0a0']);
  for (let y = 36; y < 112; y++) { const w = 15 + Math.round((y - 36) * 0.26); for (let x = cx - w; x <= cx + w; x++) p.set(x, y, R[(Math.floor((x - cx + 40) / 4) + (y >> 3)) % 3 === 0 ? 1 : 2]); }
  for (let y = 36; y < 112; y++) for (let x = cx - 5; x <= cx + 5; x++) p.set(x, y, x === cx - 5 || x === cx + 5 ? Gd[2] : Bl[(y + x) % 7 === 0 ? 3 : 2]); for (let y = 40; y < 110; y += 6) p.set(cx + ((y >> 2) % 2 ? 1 : -1) * 2, y, Gd[3]);
  p.ball(cx, 38, 18, 7, [Bl[1], Bl[2], Bl[3], Bl[4]]); for (let x = cx - 17; x <= cx + 17; x += 3) p.set(x, 38, Gd[3]);
  const T = VP(['#0a3a3a', '#1a7a7a', '#3ac0b0', '#9af0e0']); p.rect(cx - 1, 48, 3, 12, T[2]); p.rect(cx - 4, 51, 9, 3, T[2]); p.line(cx - 6, 38, cx, 48, C('#c0c8d0')); p.line(cx + 6, 38, cx, 48, C('#c0c8d0'));
  const B = VP(['#5a6a8a', '#90a8c8', '#c8dcf0', '#eef6ff']); p.ball(cx, 22, 8, 10, B); for (const s of [-1, 1]) p.ball(cx + s * 3, 21, 2.5, 3, [C('#000'), C('#000'), C('#0a0a14'), C('#0a0a14')]); p.set(cx, 25, C('#101020')); for (let x = cx - 4; x <= cx + 4; x += 2) p.vl(x, 28, 3, B[1]);
  p.poly([[cx - 9, 15], [cx, -2 + 4], [cx + 9, 15]], R[3]); p.poly([[cx - 3, 15], [cx, 4], [cx + 3, 15]], Bl[3]); p.vl(cx, 4, 11, Gd[3]); p.hl(cx - 9, 14, 18, Gd[2]);
  const sx = cx + 26; for (let y = 16; y < 112; y++) p.set(sx, y, ((y >> 2) % 2) ? C('#3ac06a') : C('#1a7a3a')); p.ball(sx, 14, 5, 7, [C('#3a0418'), C('#8a1430'), C('#c02a50'), C('#3ac080')]); p.ball(sx - 6, 64, 3, 3, B);
  p.outline(OUTL); return p; }
// ---------- Criatura de cuello largo con venas verdes ----------
function criatura() { const p = new Pix(96, 140), D = VP(['#020c0a', '#08201a', '#10302a', '#1a4a40', '#2a6a5a']), Gl = C('#5aff3a');
  for (const [lx, ly] of [[30, 92], [42, 96], [62, 92], [74, 96]]) { for (let y = ly; y < 136; y++) p.hl(lx - 3, y, 7, D[2]); p.hl(lx - 4, 135, 9, C('#1a6a3a')); }
  p.ball(52, 88, 28, 16, D.slice(1)); for (let k = 0; k < 28; k++) { const x = 40 - k * 0.6, y = 76 - k * 2; p.ball(x, y, 6 - k * 0.08, 5, D.slice(1)); }
  p.ball(26, 16, 9, 6, D.slice(1)); p.ball(18, 18, 6, 4, D.slice(1)); p.ball(24, 14, 2, 2, [C('#0a3a0a'), Gl, C('#c0ffa0'), C('#ffffff')]);
  for (let k = 0; k < 7; k++) { const a = -0.9 + k * 0.28; for (let r = 4; r < 30; r++) p.set(Math.round(30 + Math.cos(a) * r * 1.1), Math.round(14 + Math.sin(a) * r - r * 0.2), r % 7 === 0 ? Gl : C('#1a5a4a')); }
  for (let y = 4; y < 136; y++) for (let x = 0; x < 96; x++) if (uA(p.get(x, y)) && p.get(x, y) !== C('#1a6a3a') && ((x * 7 + y * 5) % 23 === 0 || (x * 3 - y * 4) % 29 === 0)) p.set(x, y, Gl);
  p.outline(OUTL); return p; }
return { violeta: hechiceraVioleta, carmesi: hechiceraCarmesi, rey: reyEsqueleto, sapo: brujoSapo, demonio, obispo, alce: criatura };
})();
