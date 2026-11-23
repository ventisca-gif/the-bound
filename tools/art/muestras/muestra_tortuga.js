// MUESTRA TEMPORAL (no se publica): restaurante flotante original «La Tortuga Glotona».
// Casco = caparazón de una tortuga marina gigante (cabeza sonriente a proa, aletas en el agua), torre de 3 pisos
// redondeados color coral con balcones blancos y ojos de buey, cúpula crema con chimenea, letrero de tenedor y
// cuchara dorados, dos mástiles con velas crema y un cuenco rojo de emblema, farolillos entre mástiles.
function tortugaSample() {
  const W = 230, H = 190, p = new Pix(W, H), SEA = 156;
  const shell = pal(['#2e3a1a', '#4a5a26', '#6a7a34', '#8c9a48', '#b0bc66']), skin = pal(['#2a5a4a', '#3e7a62', '#5a9a7a', '#80bc96', '#a8dab4']);
  const coral = pal(['#7a3020', '#b04a34', '#d8694a', '#ee8a66', '#ffb08c']), cream = pal(['#8a7a5a', '#b8a67e', '#dccaa0', '#f0e2be', '#fff6dc']);
  const terra = pal(['#5a2412', '#84361c', '#a84a26', '#c86434', '#e08a54']), wood = pal(['#3a2414', '#5a3820', '#7a502c', '#9a6a3a', '#ba8a52']);
  const white = C('#f4f2ea'), whiteS = C('#b8b4aa'), glass = pal(['#1e3a5a', '#3a6a9a', '#7ab0d8', '#d0ecff']), gold = pal(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), red = pal(['#5a0e10', '#9a1c1e', '#d0302c', '#f0605a']);
  // --- mástiles y velas (detrás) ---
  for (const [mx, top] of [[40, 26], [190, 30]]) {
    p.rect(mx - 1, top, 3, 122 - top, wood[2]); p.vl(mx - 1, top, 122 - top, wood[3]); p.vl(mx + 1, top, 122 - top, wood[1]);
    for (const [sy, sw, sh] of [[top + 10, 34, 22], [top + 40, 40, 26]]) {
      p.rect(mx - sw / 2 - 1, sy - 2, sw + 2, 2, wood[1]);
      for (let y = 0; y < sh; y++) { const bul = Math.round(Math.sin(y / sh * Math.PI) * 3); for (let x = -sw / 2 - bul; x < sw / 2 + bul; x++) p.set(mx + x, sy + y, cream[x < -sw / 2 + 3 ? 2 : x > sw / 2 - 4 ? 1 : (x + 40) % 9 === 0 ? 2 : 3]); }
      // emblema: cuenco de sopa rojo con vapor
      const ex = mx, ey = sy + sh / 2 + 1; p.ell(ex, ey, 6, 3.4, red[2]); p.hl(ex - 6, ey - 1, 13, red[3]); p.rect(ex - 7, ey - 2, 15, 1, red[1]); p.rect(ex - 2, ey + 3, 5, 1, red[1]);
      for (const k of [-3, 0, 3]) { p.set(ex + k, ey - 4, cream[0]); p.set(ex + k + 1, ey - 5, cream[0]); p.set(ex + k, ey - 6, cream[0]); }
    }
    p.poly([[mx + 1, top - 8], [mx + 14, top - 5], [mx + 1, top - 2]], C('#2a9a8a')); p.vl(mx, top - 9, 9, wood[1]);
    p.line(mx, top, mx < 115 ? 70 : 160, 92, wood[0]);
  }
  // --- caparazón (casco) ---
  const cen = []; for (let r = 0; r < 4; r++) for (let k = -5; k <= 5; k++) cen.push([115 + k * 22 + (r % 2) * 11, 100 + r * 17]);
  for (let y = 104; y <= SEA + 4; y++) for (let x = 26; x <= 204; x++) { const dx = (x - 115) / 89, dy = (y - SEA) / 52; if (dx * dx + dy * dy > 1) continue;
    let d1 = 1e9, d2 = 1e9, best = null; for (const c of cen) { const d = Math.hypot((x - c[0]) * 0.8, y - c[1]); if (d < d1) { d2 = d1; d1 = d; best = c; } else if (d < d2) d2 = d; }
    const edge = d2 - d1; let c = shell[dx < -0.45 ? 3 : dx > 0.5 ? 1 : 2];
    if (edge < 1.2) c = shell[0]; else if (edge < 2.4 && y < best[1]) c = shell[4]; else if (d1 < 3.5) c = shell[dx > 0.5 ? 2 : 3];
    if (dx * dx + dy * dy > 0.93 && edge >= 1.2) c = shell[1]; p.set(x, y, c); }
  for (let x = 30; x <= 200; x++) { const dx = (x - 115) / 85, yy = Math.round(SEA - 6 + dx * dx * 3); p.set(x, yy, cream[4]); p.set(x, yy + 1, cream[3]); p.set(x, yy + 2, cream[2]); p.set(x, yy + 3, cream[1]); }
  // cabeza sonriente a proa
  p.ball(18, 130, 15, 12, skin); p.ball(30, 140, 10, 9, skin);
  p.ell(12, 126, 3, 3.5, white); p.ell(12, 127, 1.6, 2.2, C('#101418')); p.set(11, 125, white);
  for (let k = 0; k < 12; k++) { const yy = 134 + Math.round(Math.sin(k / 11 * Math.PI) * 3); p.set(4 + k, yy, skin[0]); if (k > 2 && k < 9) p.set(4 + k, yy - 1, C('#8a2a2a')); }
  p.set(6, 133, C('#e07a7a')); p.set(7, 133, C('#e07a7a'));
  for (const [x, y] of [[14, 122], [22, 120], [26, 128]]) p.set(x, y, skin[1]);
  // aletas en el agua
  p.poly([[44, SEA - 2], [60, SEA - 4], [70, SEA + 6], [40, SEA + 8]], skin[2]); p.poly([[166, SEA - 3], [186, SEA - 2], [196, SEA + 7], [160, SEA + 6]], skin[1]);
  // --- cubierta y torre de 3 pisos ---
  const tier = (x0, x1, y0, y1, win) => {
    for (let y = y0; y < y1; y++) for (let x = x0; x <= x1; x++) { const t = (x - x0) / (x1 - x0); p.set(x, y, coral[t < 0.12 ? 4 : t > 0.85 ? 1 : t > 0.7 ? 2 : 3]); }
    p.hl(x0, y1 - 1, x1 - x0 + 1, coral[0]);
    for (let x = x0 + 8; x < x1 - 6; x += win) { const cy = Math.round((y0 + y1) / 2); p.ell(x, cy, 3.2, 3.2, cream[3]); p.ell(x, cy, 2.2, 2.2, glass[2]); p.set(x - 1, cy - 1, glass[3]); p.set(x + 1, cy + 1, glass[1]); }
    // balcón blanco con barandilla
    p.rect(x0 - 4, y0 - 2, x1 - x0 + 9, 2, terra[3]); p.hl(x0 - 4, y0 - 1, x1 - x0 + 9, terra[1]);
    p.hl(x0 - 4, y0 - 6, x1 - x0 + 9, white); for (let x = x0 - 4; x <= x1 + 4; x += 3) p.vl(x, y0 - 6, 4, (x & 1) ? whiteS : white);
  };
  p.rect(56, 108, 120, 4, wood[3]); p.hl(56, 108, 120, wood[4]); p.hl(56, 111, 120, wood[1]);
  tier(62, 168, 80, 108, 14); tier(74, 156, 56, 80, 13); tier(86, 144, 36, 56, 12);
  // puerta y letrero
  p.rect(108, 92, 14, 16, wood[1]); p.ell(115, 92, 7, 5, wood[1]); p.vl(115, 89, 19, wood[0]); p.set(112, 100, gold[3]); p.set(118, 100, gold[3]);
  p.ell(115, 84, 9, 4, gold[2]); p.ell(115, 84, 7, 2.6, terra[1]);
  // tenedor y cuchara cruzados dorados (letrero grande del piso alto)
  p.line(106, 54, 124, 38, gold[3]); p.line(107, 54, 125, 38, gold[1]); p.ell(125, 37, 3, 4, gold[3]); p.set(124, 35, gold[4]);
  p.line(124, 54, 106, 38, gold[3]); p.line(125, 54, 107, 38, gold[1]); for (const k of [-2, 0, 2]) p.vl(105 + k, 33, 5, gold[3]); p.hl(103, 38, 5, gold[2]);
  // cúpula crema y chimenea con vapor
  for (let y = 18; y < 36; y++) { const w = Math.round(Math.sqrt(Math.max(0, 1 - ((36 - y) / 18) ** 2)) * 24); for (let x = 115 - w; x <= 115 + w; x++) p.set(x, y, cream[x < 115 - w * 0.5 ? 4 : x > 115 + w * 0.5 ? 1 : 3]); }
  p.ball(115, 16, 3, 3, gold); p.rect(130, 14, 6, 12, terra[2]); p.hl(129, 13, 8, terra[4]);
  for (const [x, y, r] of [[134, 9, 3], [138, 4, 3.6], [143, 0, 4]]) p.ell(x, y, r, r * 0.8, C('#e8eef2'));
  // farolillos entre mástiles y torre
  for (const [a, b] of [[[40, 50], [74, 58]], [[190, 54], [156, 58]]]) for (let k = 0; k <= 6; k++) { const t = k / 6, x = Math.round(a[0] + (b[0] - a[0]) * t), y = Math.round(a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * 6); p.set(x, y, wood[0]); if (k % 2 === 1) { p.ell(x, y + 3, 2, 2.4, k % 4 === 1 ? red[2] : gold[2]); p.set(x - 1, y + 2, k % 4 === 1 ? red[3] : gold[4]); } }
  // muelle flotante a popa
  p.rect(200, SEA - 6, 28, 4, wood[3]); p.hl(200, SEA - 6, 28, wood[4]); for (const x of [204, 214, 224]) p.rect(x, SEA - 2, 2, 8, wood[1]);
  p.outline(OUTL);
  // cielo y mar
  const c = mkCanvas(W, H + 10), x = c.getContext('2d'); x.fillStyle = '#8ccaf0'; x.fillRect(0, 0, W, H + 10);
  x.fillStyle = '#ffffff'; for (const [cx, cy, r] of [[20, 20, 8], [30, 18, 10], [200, 12, 7], [210, 14, 9]]) { x.beginPath(); x.ellipse(cx, cy, r * 1.6, r * 0.8, 0, 0, 7); x.fill(); }
  x.drawImage(p.canvas(), 0, 0);
  const sea = new Pix(W, H + 10 - SEA); for (let y = 0; y < sea.h; y++) for (let xx = 0; xx < W; xx++) sea.set(xx, y, y === 0 ? C('#d8f2ff') : (xx + y * 3) % 23 === 0 ? C('#a8dcf8') : y < 4 ? C('#3a8ac8') : C('#2a6eb0'));
  for (let xx = 0; xx < W; xx++) if ((xx * 7) % 11 < 3) sea.set(xx, 1, C('#ffffff'));
  const sc = sea.canvas(), y0 = SEA + 2; x.drawImage(sc, 0, y0);
  return c;
}
