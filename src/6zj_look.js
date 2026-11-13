// ================= v3.6: LOGO DEL TÍTULO (letras doradas, espada y cinta "Capítulo 1") + créditos =================
const LOGO_GLYPH = {
  T: ['###########', '##..###..##', '#...###...#', '....###....', '....###....', '....###....', '....###....', '....###....', '....###....', '....###....', '...#####...', '..#######..'],
  h: ['####.......', '.###.......', '.###.......', '.###.......', '.###.####..', '.#########.', '.####..###.', '.###...###.', '.###...###.', '.###...###.', '.###...###.', '#####.#####'],
  e: ['..#####..', '.###..##.', '###...###', '#########', '###......', '###....##', '.###..###', '..######.'],
  B: ['#########..', '.###...###.', '.###....###', '.###....###', '.###...###.', '.########..', '.###...###.', '.###....###', '.###....###', '.###....###', '.###...###.', '#########..'],
  o: ['..#####..', '.###.###.', '###...###', '###...###', '###...###', '###...###', '.###.###.', '..#####..'],
  u: ['####..####.', '.###...###.', '.###...###.', '.###...###.', '.###...###.', '.###...###.', '.###..####.', '..####.####'],
  n: ['####.####..', '.#########.', '.####..###.', '.###...###.', '.###...###.', '.###...###.', '.###...###.', '#####.#####'],
  d: ['......####.', '.......###.', '.......###.', '.......###.', '..########.', '.###...###.', '###....###.', '###....###.', '###....###.', '###....###.', '.###..####.', '..#####.###'],
};
function logoCanvas(sub) {
  const word = 'The Bound', TOP = 13, CAP = 12, gap = 1, SP = 7, PADX = 12;
  let tw = 0; const pos = [];
  for (const ch of word) { if (ch === ' ') { tw += SP; pos.push(null); continue; } const g = LOGO_GLYPH[ch]; if (!g) { pos.push(null); continue; } pos.push(tw); tw += g[0].length + gap; }
  tw -= gap; const W = tw + PADX * 2, RIB = TOP + CAP + 5, H = RIB + 16;
  const p = new Pix(W, H), M = new Uint8Array(W * H);
  [...word].forEach((ch, i) => { const g = LOGO_GLYPH[ch]; if (!g) return; const oy = TOP + CAP - g.length; g.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === '#') M[(oy + y) * W + PADX + pos[i] + x] = 1; }); });
  // espada detrás de las letras, entre "The" y "Bound"
  const sx = PADX + (pos[4] || 0) - Math.round(SP / 2) - 1;
  const steel = [C('#5a6a80'), C('#c8d4e4'), C('#f4f8ff')], gold = [C('#7a3e08'), C('#e8a020'), C('#ffe070')], ink = C('#1e0a02');
  for (let y = 11; y < RIB + 6; y++) { p.set(sx - 1, y, steel[0]); p.set(sx, y, steel[2]); p.set(sx + 1, y, steel[1]); p.set(sx + 2, y, steel[0]); p.set(sx - 2, y, ink); p.set(sx + 3, y, ink); }
  for (let y = 3; y < 8; y++) { p.set(sx, y, C('#6a2a10')); p.set(sx + 1, y, C('#a04a1c')); p.set(sx - 1, y, ink); p.set(sx + 2, y, ink); }
  p.rect(sx - 1, 0, 4, 3, gold[1]); p.set(sx, 0, gold[2]); p.set(sx - 2, 1, ink); p.set(sx + 3, 1, ink);
  p.rect(sx - 7, 8, 16, 3, gold[1]); for (let x = sx - 7; x < sx + 9; x++) { p.set(x, 8, gold[2]); p.set(x, 10, gold[0]); p.set(x, 7, ink); p.set(x, 11, ink); }
  p.set(sx - 8, 9, ink); p.set(sx + 9, 9, ink); p.rect(sx - 1, 8, 4, 3, C('#c01828')); p.set(sx, 8, C('#ff6070')); p.set(sx + 1, 9, C('#ff98a0'));
  // letras: relieve, contorno y degradado dorado
  const ext = [C('#7a3a08'), C('#5a2606'), C('#2a0e02')], OUT = new Uint8Array(W * H);
  for (let d = 3; d >= 1; d--) for (let i = 0; i < W * H; i++) if (M[i] && i + d * W < W * H) { p.d[i + d * W] = ext[d - 1]; OUT[i + d * W] = 1; }
  for (let i = 0; i < W * H; i++) if (M[i]) OUT[i] = 1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (OUT[i]) continue; let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && OUT[yy * W + xx]) n++; } if (n) p.set(x, y, ink); }
  const grad = ['#fff7c0', '#ffeb8a', '#ffe060', '#ffd23a', '#ffc22a', '#f8ae1e', '#f09a18', '#e48614', '#d87410', '#c8640e', '#b8560c', '#a84a0a'].map(h => C(h));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (!M[i]) continue; const r = clamp(y - TOP, 0, 11); p.set(x, y, (!M[i - W]) ? C('#fffbe0') : (!M[i - 1] && r < 8) ? grad[Math.max(0, r - 2)] : grad[r]); }
  // cinta roja con el capítulo
  const rw = Math.round(tw * 0.74), rx = Math.round((W - rw) / 2), ry = RIB, rh = 10, red = [C('#4a0806'), C('#7a1410'), C('#b0201a'), C('#e04a32')];
  for (const side of [-1, 1]) { const tx = side < 0 ? rx - 8 : rx + rw; for (let y = 0; y < rh; y++) for (let x = 0; x < 8; x++) { const notch = side < 0 ? x < 3 - Math.abs(y - rh / 2) * 0.7 : x > 4 + Math.abs(y - rh / 2) * 0.7; if (notch) continue; p.set(tx + x, ry + 3 + y, y === 0 || y === rh - 1 ? red[0] : red[1]); } }
  for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) p.set(rx + x, ry + y, y === 0 || y === rh - 1 ? C('#ffc848') : y === 1 ? red[3] : y === rh - 2 ? red[1] : red[2]);
  for (let y = 0; y < rh; y++) { p.set(rx - 1, ry + y, ink); p.set(rx + rw, ry + y, ink); }
  const txt = textSprite(sub, '#ffe9c0', null), tc = txt.getContext('2d').getImageData(0, 0, txt.width, txt.height).data;
  const ox = Math.round((W - txt.width) / 2), oy = ry + Math.round((rh - txt.height) / 2);
  for (let y = 0; y < txt.height; y++) for (let x = 0; x < txt.width; x++) { const k = (y * txt.width + x) * 4; if (tc[k + 3] > 100) { p.set(ox + x, oy + y + 1, C('#4a0806')); } }
  for (let y = 0; y < txt.height; y++) for (let x = 0; x < txt.width; x++) { const k = (y * txt.width + x) * 4; if (tc[k + 3] > 100) p.set(ox + x, oy + y, rgbU(tc[k], tc[k + 1], tc[k + 2])); }
  for (const dx of [-7, txt.width + 5]) { const cx = ox + dx, cy = ry + 5; p.set(cx, cy - 1, C('#ffd860')); p.set(cx - 1, cy, C('#ffd860')); p.set(cx + 1, cy, C('#ffd860')); p.set(cx, cy + 1, C('#ffd860')); p.set(cx, cy, C('#fff6c0')); }
  return p.canvas();
}
function setupLogo() {
  const L = document.querySelector('#title .logo'); if (!L) return;
  const cv = logoCanvas('CAPÍTULO 1'); cv.setAttribute('aria-label', 'The Bound'); cv.style.setProperty('--lw', cv.width); cv.style.setProperty('--ls', 5);
  L.innerHTML = ''; L.appendChild(cv);
  const ch = document.querySelector('#title .chain'); if (ch) ch.remove();
  if (!document.querySelector('#title .tcred')) { const d = document.createElement('div'); d.className = 'tcred'; d.textContent = 'Creado por Ventisca'; const tm = document.getElementById('tmain'); tm.parentNode.insertBefore(d, tm.nextSibling); }
}
setupLogo();
// ================= v3.6: ICONOS DE ARMADURA REDISEÑADOS (casco, armadura, grebas, botas) con sombreado y detalles por rango =================
const ARM_SHAPE = {
  helm: ['......cccc......', '.....######.....', '....########....', '...##########...', '..############..', '..############..', '..#TTTTTTTTTT#..', '..#DDD####DDD#..', '..############..', '..####D##D####..', '..############..', '...##########...', '....###..###....', '................', '................', '................'],
  armor: ['................', '..###......###..', '.#####TTTT#####.', '################', '################', '.######|#######.', '..#####k######..', '..######|#####..', '..############..', '..TTTTTTTTTTTT..', '..###B####B###..', '...##########...', '...####..####...', '...###....###...', '................', '................'],
  legs: ['................', '...TTTTTTTTTT...', '...####BB####...', '...##########...', '...####..####...', '...####..####...', '...#oo#..#oo#...', '...#oo#..#oo#...', '...####..####...', '...####..####...', '...####..####...', '..#####..#####..', '..#####..#####..', '................', '................', '................'],
  boots: ['................', '.TTTT....TTTT...', '.####....####...', '.####....####...', '.#oo#....#oo#...', '.####....####...', '.####....####...', '.#####...#####..', '.######..######.', '.#######.#######', '.SSSSSSS.SSSSSSS', '................', '................', '................', '................', '................'],
};
const ARM_GEM = { 7: '#40e0ff', 8: '#c050ff', 9: '#a060ff', 10: '#ff4030', 11: '#ffd040', 12: '#ff60c0', 13: '#80c0ff', 14: '#40ffd0', 15: '#ffa020', 16: '#a0d0ff', 17: '#60ff60', 18: '#fff080' };
function armorIcon(kind, t) {
  const S = ARM_SHAPE[kind], tp = tierPal(t), p = new Pix(16, 16), at = (x, y) => y >= 0 && y < 16 && x >= 0 && x < 16 ? S[y][x] : '.';
  const solid = ch => ch !== '.' && ch !== 'c', metal = t >= 3, trim = t >= 4 ? GOLD : [tp[0], tp[0], tp[1], tp[2], tp[3]];
  const gem = ARM_GEM[t] ? C(ARM_GEM[t]) : null;
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const ch = S[y][x]; if (ch === '.') continue; let c;
    if (ch === '#' || ch === 'o') {
      const up = !solid(at(x, y - 1)), lf = !solid(at(x - 1, y)), dn = !solid(at(x, y + 1)), rt = !solid(at(x + 1, y));
      c = up ? tp[4] : lf ? tp[3] : dn ? tp[0] : rt ? tp[1] : y < 6 ? tp[3] : tp[2];
      if (ch === 'o') c = up ? tp[4] : tp[3];
      if (metal && !up && !lf && !dn && !rt && x + y === 8 && y >= 2 && y <= 5) c = uMix(tp[4], C('#ffffff'), 0.5);   // brillo del metal
      if (!metal && !up && !dn && (x * 3 + y) % 7 === 0) c = tp[1];                                              // vetas de madera/cuero
    } else if (ch === 'T') c = at(x, y - 1) === '.' || at(x, y - 1) === 'c' ? trim[4] : trim[3];
    else if (ch === 'D') c = C('#140e12');
    else if (ch === '|') c = tp[1];
    else if (ch === 'B') c = t >= 4 ? GOLD[4] : tp[4];
    else if (ch === 'S') c = tp[0];
    else if (ch === 'k') c = gem || (metal ? tp[4] : trim[3]);
    else if (ch === 'c') c = t >= 5 ? (gem || C('#d02828')) : t >= 3 ? tp[3] : null;
    if (c) p.set(x, y, c);
  }
  if (gem) { // gemas en casco, grebas y botas a partir de mithril
    if (kind === 'helm') { p.set(7, 6, gem); p.set(8, 6, uMix(gem, C('#ffffff'), 0.5)); }
    if (kind === 'legs') { p.set(7, 2, gem); p.set(8, 2, gem); }
    if (kind === 'boots') { p.set(2, 1, gem); p.set(10, 1, gem); }
    if (kind === 'armor') p.set(7, 6, uMix(gem, C('#ffffff'), 0.55));
  }
  p.outline(OUTL);
  if (t >= 13) { const g = gem || C('#ffffff'); for (const [x, y] of [[14, 1], [1, 13], [15, 8]]) if (!uA(p.d[y * 16 + x])) p.set(x, y, uMix(g, C('#ffffff'), 0.6)); }
  return p;
}
{ const _gi = genIcon; genIcon = function (spec) { if (ARM_SHAPE[spec[0]] && typeof spec[1] === 'number') return armorIcon(spec[0], spec[1]); return _gi(spec); }; }
// el paisaje del atardecer solo en los marcos altos (en los bajos taparía el texto)
function landFrames() { requestAnimationFrame(() => { for (const f of document.querySelectorAll('#pbody .frame, #mbody.frame')) f.classList.toggle('land', f.clientHeight >= 300); }); }
{ const _rp = renderPanel; renderPanel = function () { const r = _rp.apply(this, arguments); landFrames(); return r; }; }
{ const _om = openModal; openModal = function () { const r = _om.apply(this, arguments); landFrames(); return r; }; }
