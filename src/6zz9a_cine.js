// ================= v4.64: CINEMÁTICAS DEL LIBRO DEL VÍNCULO (pixel art dibujado con el motor) =================
// Escenas a 256×144 escaladas sin suavizado, con barras de cine, texto que se escribe solo y fundidos.
// - Prólogo: resumen de toda la historia (botón en el Libro y opción de la Anciana Mira).
// - Cada capítulo tiene su cinemática: se ve al descubrirlo hablando con un NPC y desde el Libro (botón 🎬).
// - Los capítulos sin escena propia usan el libro de Mira abierto con dibujos que flotan.
// SETTINGS.cine === false las apaga al hablar con NPCs (siguen en el Libro).

const CN_W = 256, CN_H = 144;
const CINE = { on: false, list: [], i: 0, t: 0, last: 0, cv: null, x: null, raf: 0, done: null, txtN: 0 };

// ---------- utilidades de dibujo ----------
function cnR(x, c, X, Y, w, h) { x.fillStyle = c; x.fillRect(Math.round(X), Math.round(Y), Math.round(w), Math.round(h)); }
function cnRnd(s) { s = Math.sin(s * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function cnSky(x, top, bot) { const g = x.createLinearGradient(0, 0, 0, CN_H); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, CN_W, CN_H); }
function cnStars(x, t, n, a) { for (let i = 0; i < (n || 60); i++) { const sx = cnRnd(i) * CN_W, sy = cnRnd(i + 50) * CN_H * 0.7, tw = 0.5 + 0.5 * Math.sin(t * 2 + i); x.globalAlpha = (a || 1) * (0.3 + tw * 0.7); cnR(x, i % 7 ? '#ffffff' : '#ffe6a0', sx, sy, 1, 1); } x.globalAlpha = 1; }
function cnCloud(x, X, Y, s, c) { x.fillStyle = c; for (const [dx, dy, r] of [[0, 0, 7], [8, -4, 9], [18, -1, 8], [26, 2, 6], [10, 3, 8]]) { x.beginPath(); x.arc(Math.round(X + dx * s), Math.round(Y + dy * s), r * s, 0, 7); x.fill(); } }
function cnIsland(x, X, Y, w, t, seed) {
  const bob = Math.round(Math.sin(t * 1.2 + seed) * 1.5); Y += bob;
  for (let i = 0; i < 9; i++) { const k = i / 9, ww = w * (1 - k * 0.85); cnR(x, i < 2 ? '#7a5a3a' : i % 2 ? '#5a4030' : '#4a3426', X + (w - ww) / 2, Y + 3 + i * 2, ww, 2); }
  cnR(x, '#4caa4c', X, Y, w, 3); cnR(x, '#7ad06a', X + 1, Y, w - 2, 1);
  return Y;
}
// figura con túnica (Tejedores, Aurel): c = color de túnica, g = brillo
function cnRobe(x, X, Y, c, g, dark, S) {
  S = S || 2; X = Math.round(X); Y = Math.round(Y);
  if (g) { x.globalAlpha = 0.22; x.fillStyle = g; x.beginPath(); x.arc(X + 5 * S, Y + 8 * S, 11 * S, 0, 7); x.fill(); x.globalAlpha = 1; }
  // capucha, cara, túnica con fajín y mangas anchas
  const rows = ['...####...', '..######..', '.##ffff##.', '.##ffff##.', '..#ffff#..', '.########.', '##########', 'm########m', 'm##gggg##m', '.########.', '.########.', '##########', '##########', '###########'];
  const sh = uMulC(c, 0.7);
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const ch = r[i]; if (ch === '.') continue;
    const col = ch === 'f' ? (dark ? '#120a18' : '#f4e0c8') : ch === 'g' ? (dark ? '#5a1020' : '#ffd75a') : ch === 'm' ? sh : (i < 3 || j > 11 ? sh : c); cnR(x, col, X + i * S, Y + j * S, S, S); } });
  cnR(x, dark ? '#ff3040' : '#3a2a50', X + 4 * S, Y + 3 * S, S, S); cnR(x, dark ? '#ff3040' : '#3a2a50', X + 6 * S, Y + 3 * S, S, S);
}
function uMulC(c, k) { const n = parseInt(c.slice(1), 16), r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k); return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
// silueta de criatura/jefe: cuerpo redondo con ojos
function cnBlob(x, X, Y, r, c, eye, t) { x.fillStyle = c; x.beginPath(); x.ellipse(Math.round(X), Math.round(Y + Math.sin(t * 2) * 1), r, r * 0.8, 0, 0, 7); x.fill(); cnR(x, eye || '#ffffff', X - r * 0.4, Y - r * 0.2, 2, 2); cnR(x, eye || '#ffffff', X + r * 0.3, Y - r * 0.2, 2, 2); }
function cnShard(x, X, Y, t) { const g = 0.6 + 0.4 * Math.sin(t * 4); x.globalAlpha = g * 0.4; x.fillStyle = '#ffe066'; x.beginPath(); x.arc(X, Y, 6, 0, 7); x.fill(); x.globalAlpha = 1; cnR(x, '#ffe066', X - 1, Y - 3, 3, 6); cnR(x, '#ffffff', X, Y - 2, 1, 2); }
// Alado: cuerpo pequeño, aureola y alas que baten
function cnWinged(x, X, Y, t, fallen) {
  X = Math.round(X); Y = Math.round(Y); const f = Math.sin(t * 10) > 0 ? 0 : 2;
  cnR(x, fallen ? '#8a7a6a' : '#ffffff', X - 6, Y + 1 + f, 5, 2); cnR(x, fallen ? '#8a7a6a' : '#ffffff', X + 3, Y + 1 + f, 5, 2);
  cnR(x, fallen ? '#6a5a4a' : '#dfe8ff', X - 4, Y + f, 3, 1); cnR(x, fallen ? '#6a5a4a' : '#dfe8ff', X + 3, Y + f, 3, 1);
  cnR(x, '#f4d0b0', X, Y - 1, 3, 3); cnR(x, '#e8e0ff', X, Y + 2, 3, 4);
  if (!fallen) { cnR(x, '#ffe066', X - 1, Y - 3, 5, 1); }
}
// el héroe del jugador (su propio dibujo) en reposo o caminando
function cnHero(x, X, Y, t, walk, dirRow, alpha) {
  const P = G.P; if (!P) return; let A; try { A = P.atlas || playerAtlas(P); } catch (e) { return; } if (!A || !A.img) return;
  const col = walk && A.idx.walk !== undefined ? A.idx.walk + (Math.floor(t * 7) % 4) : (A.idx.idle || 0);
  x.globalAlpha = alpha === undefined ? 1 : alpha;
  x.drawImage(A.img, col * A.fw, (dirRow || 0) * A.fh, A.fw, A.fh, Math.round(X - A.fw / 2), Math.round(Y - A.fh), A.fw, A.fh); x.globalAlpha = 1;
}
function cnThread(x, x0, y0, x1, y1, t, c, a) {
  x.globalAlpha = a === undefined ? 1 : a; const n = Math.max(8, Math.hypot(x1 - x0, y1 - y0) | 0);
  for (let i = 0; i <= n; i++) { const k = i / n, w = Math.sin(k * 9 - t * 4) * 1.5 * Math.sin(k * 3.14); cnR(x, (i + Math.floor(t * 20)) % 9 < 2 ? '#ffffff' : (c || '#ffd75a'), x0 + (x1 - x0) * k + w, y0 + (y1 - y0) * k, 1, 1); }
  x.globalAlpha = 1;
}
function cnEyes(x, X, Y, t, s, c) { const bl = (t % 4) > 3.8 ? 0.2 : 1; s = s || 1; x.fillStyle = c || '#ffffff'; for (const d of [-1, 1]) { x.beginPath(); x.ellipse(Math.round(X + d * 12 * s), Math.round(Y), 5 * s, 2.5 * s * bl, 0, 0, 7); x.fill(); } x.fillStyle = '#000'; for (const d of [-1, 1]) cnR(x, '#000', X + d * 12 * s - 1, Y - 1, 2, 2 * bl); }
function cnFeathers(x, t, n, seed) { for (let i = 0; i < (n || 20); i++) { const fx = (cnRnd(i + seed) * CN_W + Math.sin(t + i) * 10) % CN_W, fy = ((cnRnd(i * 3 + seed) * CN_H) + t * (12 + cnRnd(i) * 10)) % CN_H; cnR(x, '#f0f0ff', fx, fy, 2, 1); cnR(x, '#c0c8e0', fx + 1, fy + 1, 1, 1); } }
function cnGround(x, y, c1, c2) { cnR(x, c1, 0, y, CN_W, CN_H - y); for (let i = 0; i < CN_W; i += 4) cnR(x, c2, i + (i % 8 ? 1 : 0), y, 2, 1); }
function cnHouse(x, X, Y, lit) { cnR(x, '#2a1c24', X, Y - 12, 16, 12); x.fillStyle = '#1a1018'; x.beginPath(); x.moveTo(X - 2, Y - 12); x.lineTo(X + 8, Y - 20); x.lineTo(X + 18, Y - 12); x.fill(); if (lit) cnR(x, '#ffc860', X + 4, Y - 8, 3, 3); }
function cnLoom(x, X, Y, t, a) { x.globalAlpha = a === undefined ? 1 : a; cnR(x, '#c8a060', X, Y - 22, 2, 22); cnR(x, '#c8a060', X + 26, Y - 22, 2, 22); cnR(x, '#e8c080', X - 2, Y - 24, 32, 3);
  for (let i = 0; i < 8; i++) cnR(x, ['#ff6a6a', '#ffd75a', '#6ad0ff', '#8aff8a', '#d08aff'][i % 5], X + 3 + i * 3, Y - 21 + Math.sin(t * 3 + i) * 1, 1, 20); x.globalAlpha = 1; }

// ---------- escenas ----------
// cada escena: (x, t, k) con k = progreso 0..1
const CN_SC = {
  lienzo: (x, t, k) => { cnR(x, '#000', 0, 0, CN_W, CN_H); x.globalAlpha = Math.min(1, k * 2) * 0.35; for (let i = 0; i <= CN_W; i += 16) cnR(x, '#3a3a5a', i, 0, 1, CN_H); for (let j = 0; j <= CN_H; j += 16) cnR(x, '#3a3a5a', 0, j, CN_W, 1); x.globalAlpha = 1;
    const n = Math.floor(k * 40); for (let i = 0; i < n; i++) { const gx = Math.floor(cnRnd(i) * 16) * 16, gy = Math.floor(cnRnd(i + 9) * 9) * 16; x.globalAlpha = 0.15 + 0.1 * Math.sin(t * 3 + i); cnR(x, '#ffffff', gx + 1, gy + 1, 15, 15); } x.globalAlpha = 1; },
  nihil: (x, t, k) => { cnR(x, '#000', 0, 0, CN_W, CN_H);
    for (let i = 0; i < 16; i++) for (let j = 0; j < 9; j++) { const r = cnRnd(i * 13 + j); if (r < k * 0.8) continue; cnR(x, ['#3a7a3a', '#3a6aaa', '#aa8a3a', '#7a3a7a'][(i + j) % 4], i * 16, j * 16, 16, 16); cnR(x, 'rgba(0,0,0,.25)', i * 16, j * 16 + 15, 16, 1); }
    x.globalAlpha = Math.min(1, k * 1.6); cnEyes(x, CN_W / 2, CN_H / 2 - 4, t, 1.6, '#e8e0ff'); x.globalAlpha = 1;
    for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + t * 0.3; cnThread(x, CN_W / 2, CN_H / 2, CN_W / 2 + Math.cos(a) * 120 * k, CN_H / 2 + Math.sin(a) * 70 * k, t, '#1a0a2a', 0.8); } },
  tejedores: (x, t, k) => { cnR(x, '#000', 0, 0, CN_W, CN_H); const n = Math.floor(k * 144 * 1.2);
    for (let i = 0; i < Math.min(144, n); i++) { const gx = i % 16, gy = Math.floor(i / 16); const c = gy < 4 ? ['#5a9ae8', '#6aaaf0'][(gx + gy) % 2] : gy < 6 ? ['#4caa4c', '#5aba5a'][(gx + gy) % 2] : ['#2a6aba', '#3a7aca'][(gx + gy) % 2]; cnR(x, c, gx * 16, gy * 16, 16, 16); }
    for (let w = 0; w < 3; w++) { const wx = 40 + w * 80 + Math.sin(t + w) * 10, wy = 60 + Math.sin(t * 1.5 + w * 2) * 6; cnRobe(x, wx - 6, wy - 10, ['#8a6ad0', '#6a9ad0', '#d08a6a'][w], '#ffffff'); cnThread(x, wx + 14, wy + 8, (Math.floor(k * 144 * 1.2) % 16) * 16 + 8, Math.floor(Math.min(143, k * 144 * 1.2) / 16) * 16 + 8, t, '#ffffff', 0.6); } },
  vinculo: (x, t, k) => { cnSky(x, '#1a2a5a', '#6a8ad0'); cnStars(x, t, 30, 0.5); cnGround(x, 112, '#3a7a3a', '#4c9a4c');
    cnHero(x, CN_W / 2, 114, t); cnThread(x, CN_W / 2, 66, CN_W / 2 + Math.sin(t) * 6, -4, t, '#ffd75a', Math.min(1, k * 3));
    x.globalAlpha = 0.18 + 0.08 * Math.sin(t * 2); x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.strokeRect(6, 6, CN_W - 12, CN_H - 12); x.globalAlpha = 0.08; x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(20, 6); x.lineTo(60, 6); x.lineTo(20, 60); x.fill(); x.globalAlpha = 1; },
  celestia: (x, t, k) => { cnSky(x, '#3a6ad0', '#bad8ff'); cnStars(x, t, 20, 0.2);
    for (let i = 0; i < 6; i++) cnCloud(x, ((i * 60 + t * 6) % 320) - 40, 120 + (i % 2) * 8, 1.2, '#ffffff');
    const I = [[20, 70, 40], [80, 50, 44], [150, 30, 50], [200, 64, 36], [110, 92, 30]]; I.forEach(([X, Y, w], i) => { const yy = cnIsland(x, X, Y, w, t, i); if (i === 2) cnLoom(x, X + 10, yy, t); });
    for (let i = 0; i < 10; i++) cnCloud(x, 150 - i * 14, 60 + i * 9, 0.4, 'rgba(255,255,255,.85)'); },
  alados: (x, t, k) => { cnSky(x, '#4a7ae0', '#d0e4ff'); for (let i = 0; i < 5; i++) cnCloud(x, ((i * 70 - t * 10) % 330 + 330) % 330 - 40, 30 + i * 22, 1, 'rgba(255,255,255,.8)');
    for (let i = 0; i < 7; i++) cnWinged(x, ((i * 45 + t * (18 + i * 3)) % 300) - 20, 40 + Math.sin(t * 2 + i) * 8 + (i % 3) * 22, t + i, false); },
  guerra: (x, t, k) => { const cut = k > 0.35; cnSky(x, cut ? '#2a0a1a' : '#3a5ab0', cut ? '#6a1a2a' : '#9ab8f0');
    if (cut) { x.strokeStyle = '#ff5a6a'; x.lineWidth = 1; x.beginPath(); let px = 130, py = 0; x.moveTo(px, py); for (let i = 0; i < 8; i++) { px += (cnRnd(i) - 0.5) * 30; py += 9; x.lineTo(px, py); } x.stroke(); cnFeathers(x, t, 30, 3); }
    const ax = CN_W / 2 - 11, ay = 60 + (cut ? Math.sin(t * 8) : 0); cnRobe(x, ax, ay, cut ? '#1a0a20' : '#f0f0ff', cut ? '#ff2040' : '#ffffff', cut);
    if (!cut) cnThread(x, ax + 10, ay, ax + 10, -2, t, '#ffd75a'); else { cnThread(x, ax + 10, ay - 30 - (k - 0.35) * 80, ax + 10, -2, t, '#ffd75a', 0.7); cnThread(x, ax + 10, ay, ax + 18, ay - 12, t, '#5a1a2a'); } },
  sello: (x, t, k) => { cnR(x, '#05030a', 0, 0, CN_W, CN_H); cnStars(x, t, 40, 0.4);
    const cx = CN_W / 2, cy = CN_H / 2 + 6; for (let r = 30; r > 0; r -= 3) { x.fillStyle = r % 6 ? '#1a0a2a' : '#2a0a3a'; x.beginPath(); x.arc(cx, cy, r * (1 - k * 0.5), t + r, t + r + 5); x.fill(); }
    cnEyes(x, cx, cy, t, 0.6, '#ff4050');
    for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28 + t * 0.8, R = 70 - k * 34; const sx = cx + Math.cos(a) * R, sy = cy + Math.sin(a) * R * 0.6; cnR(x, '#ffe066', sx - 2, sy - 3, 4, 6); cnR(x, '#ffffff', sx - 1, sy - 2, 1, 2); if (k > 0.6) cnThread(x, sx, sy, cx + Math.cos(a + 0.9) * R, cy + Math.sin(a + 0.9) * R * 0.6, t, '#ffe066', 0.7); }
    for (let w = 0; w < 4; w++) { x.globalAlpha = Math.max(0.15, 1 - k); cnRobe(x, 14 + w * 64, 10 + (w % 2) * 6, '#8a8ab0', '#ffffff'); } x.globalAlpha = 1; },
  origen: (x, t, k) => { cnSky(x, '#0a0a24', '#2a2050'); cnStars(x, t, 60); cnGround(x, 112, '#1a2a1a', '#243a24');
    [20, 44, 190, 214].forEach((hx, i) => cnHouse(x, hx, 112, i % 2 === 0));
    cnR(x, '#6a6a7a', CN_W / 2 - 6, 100, 12, 12); cnR(x, '#8a8a9a', CN_W / 2 - 8, 98, 16, 3);
    const touch = k > 0.55; if (!touch) cnThread(x, CN_W / 2, 98, CN_W / 2, 80, t, '#9a9aaa', 0.6 + 0.3 * Math.sin(t * 3));
    x.globalAlpha = Math.min(1, k * 2) * 0.35; cnR(x, '#bfe0ff', CN_W / 2 - 30, -10, 60, 30 + k * 30); x.globalAlpha = 1;
    const fy = Math.min(70, -20 + k * 160); cnR(x, '#f0c8a0', CN_W / 2 - 3, fy - 30, 7, 30); cnR(x, '#ffe0c8', CN_W / 2 - 2, fy - 4, 5, 4);
    if (touch) { const f = Math.max(0, 1 - (k - 0.55) * 5); x.globalAlpha = f; cnR(x, '#ffffff', 0, 0, CN_W, CN_H); x.globalAlpha = 1; cnThread(x, CN_W / 2, 54, CN_W / 2, -4, t, '#ffd75a'); cnHero(x, CN_W / 2, 100, t, false, 0, Math.min(1, (k - 0.55) * 4)); } },
  corona: (x, t, k) => { cnSky(x, '#1a0a2a', '#4a2a5a'); cnStars(x, t, 50, 0.6); for (let i = 0; i < 6; i++) cnCloud(x, ((i * 60 + t * 4) % 320) - 40, 124, 1.2, '#3a2a4a');
    const yy = cnIsland(x, 70, 96, 116, t, 0); cnLoom(x, 112, yy, t, 1 - k * 0.6);
    x.globalAlpha = 0.85; x.fillStyle = '#05000a'; x.beginPath(); x.ellipse(200, 50, 46, 40 + Math.sin(t) * 3, 0, 0, 7); x.fill(); x.globalAlpha = 1; cnEyes(x, 200, 44, t, 1, '#e8e0ff');
    for (let i = 0; i < 6; i++) cnThread(x, 120 + i * 3, yy - 20, 170, 40 + i * 5, t, ['#ff6a6a', '#ffd75a', '#6ad0ff', '#8aff8a', '#d08aff', '#ffffff'][i], 0.6);
    cnHero(x, 92, yy, t, false, 3); },
  heroe: (x, t, k) => { cnSky(x, '#ffb070', '#ffe0a0'); cnGround(x, 112, '#4caa4c', '#5aba5a'); for (let i = 0; i < 4; i++) cnCloud(x, ((i * 80 + t * 5) % 340) - 40, 30 + i * 6, 1, 'rgba(255,255,255,.7)');
    cnHero(x, 40 + k * 140, 114, t, true, 3); [180, 204].forEach(hx => cnHouse(x, hx, 112, false)); },
  velo: (x, t, k) => { cnSky(x, '#0a1a2a', '#1a3a4a'); for (let i = 0; i < 12; i++) { const sx = (cnRnd(i) * CN_W + Math.sin(t + i) * 8), sy = (CN_H - ((t * 10 + cnRnd(i + 3) * CN_H) % CN_H)); x.globalAlpha = 0.6; x.fillStyle = '#9ae8ff'; x.beginPath(); x.arc(sx, sy, 3, 0, 7); x.fill(); cnR(x, '#9ae8ff', sx - 1, sy + 2, 3, 4); } x.globalAlpha = 1;
    cnThread(x, 20, 100, 236, 60, t, '#9ae8ff', 0.7); cnThread(x, 236, 100, 20, 60, t, '#9ae8ff', 0.7); cnHero(x, CN_W / 2, 120, t, false, 0, 0.6); },
  vigias: (x, t, k) => { cnSky(x, '#1a1a3a', '#4a3a5a'); for (let i = 0; i < 30; i++) cnR(x, '#9ab0d0', (i * 37 + t * 60) % CN_W, (i * 53 + t * 140) % CN_H, 1, 3);
    cnR(x, '#2a5a8a', 0, 100, CN_W, 44); for (let i = 0; i < 16; i++) cnR(x, '#4a8aba', ((i * 16 + t * 8) % CN_W), 100 + (i % 3) * 4, 8, 1); cnR(x, '#d0b080', 0, 118, CN_W, 26);
    cnRobe(x, 84, 90, '#5a4a3a'); cnR(x, '#f0e0c0', 140, 112, 12, 4); x.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4); cnR(x, '#ffe066', 148, 112, 2, 2); x.globalAlpha = 1; },
  luna: (x, t, k) => { cnSky(x, '#05000a', '#3a0a2a'); cnStars(x, t, 50, 0.7); x.fillStyle = '#f0e8c0'; x.beginPath(); x.arc(196, 40, 22, 0, 7); x.fill(); x.fillStyle = '#3a1a2a'; cnR(x, '#3a1a2a', 186, 34, 4, 3); cnR(x, '#3a1a2a', 202, 34, 4, 3); x.strokeStyle = '#3a1a2a'; x.lineWidth = 2; x.beginPath(); x.arc(196, 42, 9, 0.3, 2.8); x.stroke();
    cnGround(x, 112, '#1a0a1a', '#2a0a2a'); for (let i = 0; i < 8; i++) cnR(x, '#0a050a', 10 + i * 32, 80 + (i % 3) * 8, 4, 32); for (let i = 0; i < 6; i++) { x.globalAlpha = 0.25; cnCloud(x, ((i * 60 - t * 6) % 320 + 320) % 320 - 40, 108, 1, '#c060a0'); } x.globalAlpha = 1; },
  guardianes: (x, t, k) => { cnSky(x, '#2a1a3a', '#5a3a4a'); cnGround(x, 110, '#2a3a2a', '#3a4a3a');
    const G7 = [['#5ad05a', 12], ['#3a8a3a', 18], ['#8a6a3a', 14], ['#7a3aaa', 11], ['#c0c0d0', 13], ['#9ad8ff', 16], ['#e0502a', 17]];
    G7.forEach(([c, r], i) => { const gx = 22 + i * 35, gy = 104 - r * 0.8; cnBlob(x, gx, gy, r, i < Math.ceil(k * 8) ? uMulC(c, 0.55) : c, i < Math.ceil(k * 8) ? '#ff3040' : '#ffffff', t + i); cnShard(x, gx, gy - r - 6, t + i); }); },
  vael: (x, t, k) => { cnSky(x, '#0a0a1a', '#2a2a3a'); cnR(x, '#3a3040', 0, 100, CN_W, 44); for (let i = 0; i < 6; i++) cnR(x, '#4a4050', 16 + i * 44, 20, 10, 80);
    cnR(x, '#6a1a2a', 108, 60, 40, 50); cnR(x, '#c0a050', 104, 52, 48, 8); cnR(x, '#d8d0c0', 120, 64, 16, 14); cnR(x, '#000', 123, 68, 3, 3); cnR(x, '#000', 130, 68, 3, 3); cnR(x, '#ffd75a', 118, 58, 20, 4); cnR(x, '#3a2a4a', 116, 78, 24, 26); cnShard(x, 128, 92, t);
    x.globalAlpha = 0.5 + 0.3 * Math.sin(t * 2); cnR(x, '#9ae8ff', 125, 69, 1, 1); cnR(x, '#9ae8ff', 132, 69, 1, 1); x.globalAlpha = 1; },
  kraken: (x, t, k) => { cnSky(x, '#04102a', '#0a3a6a'); for (let i = 0; i < 14; i++) cnR(x, '#3a7aba', (i * 23 + t * 6) % CN_W, 30 + (i * 37) % 90, 6, 1);
    x.fillStyle = '#4a1a3a'; x.beginPath(); x.ellipse(128, 120 - k * 30, 34, 26, 0, 0, 7); x.fill(); cnEyes(x, 128, 112 - k * 30, t, 0.8, '#ffe066');
    for (let i = 0; i < 6; i++) { const bx = 98 + i * 12; for (let j = 0; j < 12; j++) cnR(x, '#5a2a4a', bx + Math.sin(t * 2 + j * 0.5 + i) * 6, 130 - k * 30 + j * 3, 4, 3); } cnShard(x, 128, 84 - k * 30, t); },
  eclipse: (x, t, k) => { cnSky(x, '#1a0a00', '#5a2a0a'); x.fillStyle = '#ffd070'; x.beginPath(); x.arc(128, 50, 26, 0, 7); x.fill(); x.fillStyle = '#05000a'; x.beginPath(); x.arc(128 - 30 + k * 30, 50, 25, 0, 7); x.fill();
    cnGround(x, 112, '#1a0a0a', '#2a1010'); x.globalAlpha = 0.6 + 0.4 * k; cnRobe(x, 117, 82, '#120814', '#ff2040', true); x.globalAlpha = 1; },
  ambar: (x, t, k) => { cnSky(x, '#e08a3a', '#ffd090'); cnR(x, '#e8c070', 0, 100, CN_W, 44); for (let i = 0; i < CN_W; i += 6) cnR(x, '#d0a050', i, 100 + (i % 12 ? 2 : 0), 3, 1);
    x.fillStyle = '#c09040'; x.beginPath(); x.moveTo(60, 100); x.lineTo(110, 40); x.lineTo(160, 100); x.fill(); x.fillStyle = '#a07030'; x.beginPath(); x.moveTo(110, 40); x.lineTo(160, 100); x.lineTo(130, 100); x.fill();
    x.globalAlpha = 0.85; cnR(x, '#ff9a20', 176, 64, 28, 40); x.globalAlpha = 1; cnR(x, '#7a4a20', 184, 72, 12, 24); cnR(x, '#ffd75a', 186, 74, 8, 6); cnR(x, '#000', 187, 76, 2, 1); cnR(x, '#000', 191, 76, 2, 1); x.globalAlpha = 0.3 + 0.2 * Math.sin(t * 3); cnR(x, '#ffffff', 178, 66, 3, 36); x.globalAlpha = 1; },
  invierno: (x, t, k) => { cnSky(x, '#5a7ab0', '#c0d8f0'); x.fillStyle = '#e8f0ff'; x.beginPath(); x.moveTo(0, 110); x.lineTo(60, 30); x.lineTo(120, 110); x.moveTo(90, 110); x.lineTo(170, 20); x.lineTo(256, 110); x.fill(); cnR(x, '#f4f8ff', 0, 108, CN_W, 36);
    for (let i = 0; i < 40; i++) cnR(x, '#ffffff', (i * 41 + Math.sin(t + i) * 6) % CN_W, (i * 29 + t * 18) % CN_H, 1, 1);
    for (let i = 0; i < 3; i++) { const sx = 60 + i * 60, look = Math.sin(t * 1.5 + i) > 0.6; cnR(x, '#ffffff', sx - 6, 104, 12, 10); cnR(x, '#ffffff', sx - 4, 96, 8, 8); cnR(x, '#000', sx - 2 + (look ? 1 : 0), 98, 1, 1); cnR(x, '#000', sx + 1 + (look ? 1 : 0), 98, 1, 1); cnR(x, '#ff8a2a', sx, 100, 2, 1); }
    cnR(x, '#bfe8ff', 196, 88, 18, 4); for (let i = 0; i < 4; i++) cnR(x, '#bfe8ff', 197 + i * 5, 82, 2, 6); },
  ventisca: (x, t, k) => { cnSky(x, '#2a3a6a', '#8aa0d0'); cnGround(x, 112, '#3a7a3a', '#4c9a4c'); const n = Math.floor(k * 16);
    for (let i = 0; i < 16; i++) { if (i > n) break; const h = 20 + (cnRnd(i) * 40); x.globalAlpha = i === n ? 0.5 : 1; x.fillStyle = i % 2 ? '#6a7a9a' : '#5a6a8a'; x.beginPath(); x.moveTo(i * 16 - 8, 112); x.lineTo(i * 16 + 8, 112 - h); x.lineTo(i * 16 + 24, 112); x.fill(); } x.globalAlpha = 1;
    for (let i = 0; i < 8; i++) cnR(x, '#ffffff', ((i * 40 + t * 80) % 300) - 20, 30 + i * 9 + Math.sin(t * 3 + i) * 3, 14, 1); const px = n * 16 + 8, py = 112 - 40; cnR(x, '#ffffff', px, py - 2, 2, 2); cnThread(x, px, py, px + 30, 0, t, '#ffffff', 0.6); },
  cierras: (x, t, k) => { cnSky(x, k < 0.5 ? '#1a2a5a' : '#04040a', k < 0.5 ? '#6a8ad0' : '#141428'); cnStars(x, t, 40, k); cnGround(x, 110, '#3a6a3a', '#4a7a4a');
    for (let i = 0; i < 10; i++) { const h = 2 + Math.floor(k * 8); cnR(x, '#6a4a2a', 20 + i * 12, 118, 8, 2); cnR(x, '#5ad05a', 23 + i * 12, 118 - h, 2, h); if (k > 0.7) cnR(x, '#ffd75a', 22 + i * 12, 117 - h, 4, 2); }
    cnRobe(x, 170, 84, '#6a4a6a', '#ffd75a'); x.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2); cnR(x, '#ffc860', 196, 92, 3, 3); x.globalAlpha = 1; },
  reyes: (x, t, k) => { cnSky(x, '#5a6ab0', '#e0c090'); cnGround(x, 110, '#5a8a3a', '#6a9a4a');
    const castle = (X, c, w) => { cnR(x, c, X, 80, w, 30); for (let i = 0; i < w; i += 6) cnR(x, c, X + i, 76, 3, 4); cnR(x, uMulC(c, 0.6), X + w / 2 - 3, 98, 6, 12); };
    castle(14, '#8a8aa0', 40); castle(70, '#5a8ab0', 34); x.fillStyle = '#d0a050'; x.beginPath(); x.moveTo(120, 110); x.lineTo(140, 80); x.lineTo(160, 110); x.fill();
    cnHouse(x, 190, 110, true); cnHouse(x, 214, 110, true); cnR(x, '#f0e2c0', 200, 120, 10, 7); cnR(x, '#6a3a1a', 204, 120, 1, 7); },
  hilos: (x, t, k) => { cnSky(x, '#1a1a3a', '#4a4a7a'); for (let i = 0; i < 6; i++) cnCloud(x, ((i * 60 - t * 12) % 330 + 330) % 330 - 40, 20 + (i % 3) * 14, 1.1, '#3a3a5a');
    if (Math.sin(t * 3) > 0.95) { x.globalAlpha = 0.6; cnR(x, '#ffffff', 0, 0, CN_W, CN_H); x.globalAlpha = 1; }
    for (let j = 0; j < 22; j++) { const a = j * 0.45 + t * 2; cnR(x, j % 2 ? '#3a8aaa' : '#5ab0d0', 40 + j * 8, 70 + Math.sin(a) * 18, 8, 6); } cnR(x, '#ffe066', 214, 66 + Math.sin(22 * 0.45 + t * 2) * 18, 2, 2);
    cnThread(x, 30, 0, 60, 80, t, '#ffd75a', 0.5); cnThread(x, 230, 0, 200, 70, t, '#ffd75a', 0.5); cnHero(x, 128, 136, t, false, 3); },
  libro: (x, t, k, ch) => { cnSky(x, '#2a1a12', '#140a08'); cnR(x, '#6a3a1a', 38, 26, 180, 104); cnR(x, '#f0e2c0', 44, 30, 82, 96); cnR(x, '#e8d8b0', 130, 30, 82, 96); cnR(x, '#a07a4a', 126, 28, 4, 100);
    for (let i = 0; i < 9; i++) { cnR(x, '#b0a080', 52, 40 + i * 9, 60 - (i % 3) * 10, 1); cnR(x, '#b0a080', 138, 40 + i * 9, 64 - (i % 2) * 14, 1); }
    for (let i = 0; i < 10; i++) { const a = t * 0.8 + i, px = 128 + Math.cos(a) * (40 + i * 6), py = 70 + Math.sin(a * 1.3) * 30 - k * 20; x.globalAlpha = 0.7; cnR(x, ['#ffd75a', '#9ae8ff', '#ffffff'][i % 3], px, py, 2, 2); } x.globalAlpha = 1; },
};

// escenas de cada capítulo (índices de CRON); los demás usan 'libro'
function cnChapterScenes(ch) {
  const M = { 0: ['lienzo'], 1: ['vinculo'], 2: ['guerra', 'sello'], 3: ['guardianes'], 4: ['vael', 'kraken'], 5: ['eclipse'], 6: ['ambar'], 7: ['invierno'], 8: ['ventisca'], 9: ['heroe'], 10: ['cierras'], 15: ['reyes'], 11: ['lienzo', 'nihil'], 12: ['celestia'], 13: ['alados'], 14: ['guerra', 'alados'], 16: ['velo'], 17: ['origen'], 18: ['corona'], 19: ['tejedores', 'heroe'] };
  if (typeof CH_VIGIAS !== 'undefined') M[CH_VIGIAS] = ['vigias', 'origen'];
  if (typeof CH_ALTAVELA !== 'undefined') M[CH_ALTAVELA] = ['alados', 'celestia']; if (typeof CH_HILOS !== 'undefined') M[CH_HILOS] = ['hilos'];
  if (typeof CH_VELO_ROTO !== 'undefined') M[CH_VELO_ROTO] = ['luna'];
  if (typeof CH_VELMIRA !== 'undefined') M[CH_VELMIRA] = ['vigias', 'luna'];
  return M[ch] || ['libro'];
}
// reparte las frases del capítulo entre sus escenas
function cnSplit(txt, n) {
  const s = String(txt).match(/[^.!?…]+[.!?…»"]*\s*/g) || [txt]; const out = []; const per = Math.ceil(s.length / n);
  for (let i = 0; i < n; i++) out.push(s.slice(i * per, (i + 1) * per).join('').trim());
  return out.filter(Boolean);
}
function cnChapter(ch) {
  const C = CRON[ch]; if (!C) return []; const sc = cnChapterScenes(ch); const parts = cnSplit(C[1], sc.length);
  return parts.map((p, i) => ({ s: sc[Math.min(i, sc.length - 1)], txt: p, title: i === 0 ? C[0] : '', ch }));
}
// prólogo: toda la historia en frases cortas
function cnPrologue() { return [
  ['lienzo', L2('Antes de todo, solo había un Lienzo negro, infinito y en silencio.', 'Before everything, there was only a black Canvas, endless and silent.'), L2('El Libro del Vínculo', 'The Book of the Bond')],
  ['nihil', L2('Ese silencio era alguien: Nihil, una conciencia que no quería ser vista.', 'That silence was someone: Nihil, a mind that did not want to be seen.')],
  ['tejedores', L2('Llegaron los Tejedores y pintaron el mundo casilla a casilla. Por eso todo está hecho de cuadraditos.', 'The Weavers came and painted the world square by square. That is why everything is made of little squares.')],
  ['vinculo', L2('Ataron cada vida con un hilo de luz: el Vínculo. El hilo de los héroes llega al otro lado del cristal… hasta ti.', 'They tied every life with a thread of light: the Bond. The heroes\' thread reaches the other side of the glass… to you.')],
  ['celestia', L2('Vivían en Celestia, cinco islas sobre las nubes, donde el Gran Telar hilaba cada vida nueva.', 'They lived in Celestia, five islands above the clouds, where the Great Loom spun every new life.')],
  ['alados', L2('Del hilo sobrante nacieron los Alados, guardianes del cielo.', 'From the spare thread the Winged were born, guardians of the sky.')],
  ['guerra', L2('Nihil susurró al Tejedor Aurel: «Te están mirando». Aurel cortó su hilo y se convirtió en el Desatado.', 'Nihil whispered to the Weaver Aurel: "They are watching you." Aurel cut his thread and became the Unbound.')],
  ['sello', L2('Los Tejedores gastaron su luz en encerrarlo con un Sello de siete fragmentos. Siete guardianes los custodiaron… y se torcieron.', 'The Weavers spent their light locking him away with a Seal of seven shards. Seven guardians kept them… and were twisted.')],
  ['origen', L2('El último Tejedor guardó su luz en un hilo vacío, en Albor: «Para quien venga del otro lado». Alguien lo tocó. Ese hilo eres tú.', 'The last Weaver kept his light in an empty thread, in Albor: "For whoever comes from the other side." Someone touched it. That thread is you.')],
  ['corona', L2('Ahora Nihil ha subido a la Corona del Cielo para deshacer el mundo. Solo un hilo que llegue al otro lado puede pararlo.', 'Now Nihil has climbed to the Crown of the Sky to undo the world. Only a thread that reaches the other side can stop it.')],
  ['heroe', L2('Mientras alguien juegue, el Lienzo no volverá a quedarse negro.', 'As long as someone keeps playing, the Canvas will never go black again.')],
].map(([s, txt, title]) => ({ s, txt, title: title || '' })); }

// ---------- reproductor ----------
function cnDur(sc) { return Math.max(4.5, sc.txt.length * 0.06 + 2.2); }
function cinePlay(list, done) {
  if (!list || !list.length) return; if (CINE.on) cineEnd(true);
  let ov = $('#cine');
  if (!ov) { ov = document.createElement('div'); ov.id = 'cine';
    ov.innerHTML = '<canvas id="cineC" width="256" height="144"></canvas><div id="cineT"><b id="cineH"></b><span id="cineS"></span></div><button class="btn sm" id="cineX">⏭ ' + L2('Saltar', 'Skip') + '</button>';
    document.body.appendChild(ov);
    if (!document.getElementById('cineCss')) { const st = document.createElement('style'); st.id = 'cineCss';
      st.textContent = '#cine{position:fixed;inset:0;z-index:90;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:cnIn .6s}'
        + '@keyframes cnIn{from{opacity:0}to{opacity:1}}#cineC{image-rendering:pixelated;image-rendering:crisp-edges;width:min(100vw,calc((100vh - 7em) * 16 / 9));aspect-ratio:16/9;display:block}'
        + '#cineT{width:min(100vw,calc((100vh - 7em) * 16 / 9));min-height:4.6em;box-sizing:border-box;padding:.5em 1em;color:#f1e7d3;text-shadow:0 1px 0 #000;font-size:.95em;line-height:1.35;text-align:center}'
        + '#cineH{display:block;color:#e8c070;font-size:1.1em;margin-bottom:.15em}#cineH:empty{display:none}#cineX{position:absolute;top:calc(.6em + env(safe-area-inset-top,0px));right:max(.8em,env(safe-area-inset-right,0px));opacity:.85}';
      document.head.appendChild(st); }
    $('#cineX').onclick = e => { e.stopPropagation(); cineEnd(); };
    ov.onclick = () => cineNext(); }
  ov.hidden = false; CINE.cv = $('#cineC'); CINE.x = CINE.cv.getContext('2d'); CINE.x.imageSmoothingEnabled = false;
  CINE.list = list; CINE.i = 0; CINE.t = 0; CINE.last = performance.now(); CINE.on = true; CINE.done = done || null; CINE.txtN = -1;
  G.paused = true; try { sfx('ui'); } catch (e) { }
  cancelAnimationFrame(CINE.raf); CINE.raf = requestAnimationFrame(cineFrame);
}
function cineNext() { const sc = CINE.list[CINE.i]; if (!sc) return; const shown = Math.floor(CINE.t / 0.035);
  if (shown < sc.txt.length) { CINE.t = sc.txt.length * 0.035 + 0.01; return; }   // primero completa el texto
  CINE.i++; CINE.t = 0; CINE.txtN = -1; if (CINE.i >= CINE.list.length) cineEnd(); }
function cineEnd(silent) { CINE.on = false; cancelAnimationFrame(CINE.raf); const ov = $('#cine'); if (ov) ov.hidden = true;
  G.paused = !$('#panel').hidden || !$('#modal').hidden || !$('#dialog').hidden; const d = CINE.done; CINE.done = null; if (d && !silent) try { d(); } catch (e) { } }
function cineFrame(now) {
  if (!CINE.on) return; const dt = Math.min(0.1, (now - CINE.last) / 1000); CINE.last = now; CINE.t += dt;
  const sc = CINE.list[CINE.i]; if (!sc) { cineEnd(); return; } const D = cnDur(sc), k = Math.min(1, CINE.t / D), x = CINE.x;
  x.save(); try { (CN_SC[sc.s] || CN_SC.libro)(x, CINE.t, k, sc.ch); } catch (e) { cnR(x, '#000', 0, 0, CN_W, CN_H); } x.restore();
  // fundido de entrada/salida, viñeta y barras
  const fa = Math.max(0, 1 - CINE.t / 0.5, (CINE.t - (D - 0.5)) / 0.5); if (fa > 0) { x.globalAlpha = Math.min(1, fa); cnR(x, '#000', 0, 0, CN_W, CN_H); x.globalAlpha = 1; }
  cnR(x, '#000', 0, 0, CN_W, 6); cnR(x, '#000', 0, CN_H - 6, CN_W, 6);
  const n = Math.min(sc.txt.length, Math.floor(CINE.t / 0.035)); if (n !== CINE.txtN) { CINE.txtN = n; $('#cineH').textContent = sc.title || ''; $('#cineS').textContent = sc.txt.slice(0, n); }
  if (CINE.t >= D) { CINE.i++; CINE.t = 0; CINE.txtN = -1; if (CINE.i >= CINE.list.length) { cineEnd(); return; } }
  CINE.raf = requestAnimationFrame(cineFrame);
}
function cinePrologue() { cinePlay(cnPrologue()); }
function cineChapter(ch) { cinePlay(cnChapter(ch)); }

// ---------- dónde se ven ----------
// al descubrir un capítulo hablando con un NPC
{ const _lu = loreUnlock; loreUnlock = function (ch) { const talking = !$('#dialog').hidden; const r = _lu.apply(this, arguments);
    if (r && talking && SETTINGS.cine !== false) setTimeout(() => { if (!CINE.on) { closeDialog(); cineChapter(ch); } }, 1800);
    return r; }; }
// Anciana Mira: ver el prólogo
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'mira') return; opts.unshift({ label: L2('🎬 Ver el pasado (prólogo)', '🎬 See the past (prologue)'), icon: ['book'], fn: () => { closeDialog(); cinePrologue(); } }); });
// Libro del Vínculo: botón del prólogo y 🎬 en cada capítulo descubierto
{ const _ob = openBook; openBook = function () { const r = _ob.apply(this, arguments);
    try { if (bookTab !== 'cron') return r; const M = $('#modal'); if (!M || M.hidden) return r; const h = M.querySelector('h2');
      if (h && !M.querySelector('#cnPro')) { const b = document.createElement('button'); b.className = 'btn gold sm'; b.id = 'cnPro'; b.style.cssText = 'margin:.2em 0 .4em'; b.textContent = '🎬 ' + L2('Ver el prólogo', 'Watch the prologue'); b.onclick = () => cinePrologue(); const tabs = M.querySelector('.tabs, .chips'); (tabs || h).after(b); }
      const U = G.P.loreU || []; let k = 0;
      ERAS.forEach(([, chs]) => chs.forEach(i => { if (!U.includes(i)) return; const d = M.querySelectorAll('.era details')[k++]; if (!d) return; const s = d.querySelector('summary'); if (!s || s.querySelector('.cnB')) return;
        const b = document.createElement('button'); b.className = 'chip cnB'; b.textContent = '🎬'; b.title = L2('Ver cinemática', 'Watch cutscene'); b.style.cssText = 'float:right;padding:.05em .5em;margin-left:.4em'; b.onclick = e => { e.preventDefault(); e.stopPropagation(); cineChapter(i); }; s.appendChild(b); })); } catch (e) { }
    return r; }; }

// ---------- SÚPER JEFES: los jefes de la historia principal ----------
// Se distinguen de los jefes normales: barra dorada con «SÚPER JEFE», aviso grande la primera vez y, al vencerlos,
// la cinemática del capítulo que su derrota abre.
const SUPER_BOSS = { desatado: 5, eclipsor: 11, nihil: 19 };
if (typeof CH_VELO_ROTO !== 'undefined') SUPER_BOSS.luna_sonriente = CH_VELO_ROTO;
if (typeof CH_VELMIRA !== 'undefined') SUPER_BOSS.sin_nombre = CH_VELMIRA;
function isSuper(m) { return !!(m && m.boss && SUPER_BOSS[m.mid] !== undefined); }
SAVEKEYS.push('superSeen');
if (!document.getElementById('sbCss')) { const st = document.createElement('style'); st.id = 'sbCss';
  st.textContent = '#bossbar.super b{color:#ffe08a}#bossbar.super b::before{content:attr(data-sb);display:block;font-size:.72em;letter-spacing:.2em;color:#ff6a3a}#bossbar.super .bar{outline:2px solid #e8c070;box-shadow:0 0 8px #e8a040}#bossbar.super .bar i{background:linear-gradient(#ffe08a,#e08a20 50%,#8a3a0a)}'
    + '#sbBan{position:fixed;left:0;right:0;top:32%;z-index:80;text-align:center;pointer-events:none;animation:sbIn 2.8s forwards}#sbBan small{display:block;color:#ff6a3a;letter-spacing:.35em;font-size:1em;text-shadow:0 2px 0 #000}#sbBan b{display:block;color:#ffe08a;font-size:1.9em;text-shadow:0 3px 0 #000,0 0 12px #e08a20}'
    + '#sbBan::before{content:"";position:absolute;left:0;right:0;top:-.4em;bottom:-.4em;background:linear-gradient(90deg,transparent,rgba(0,0,0,.75),transparent);z-index:-1}@keyframes sbIn{0%{opacity:0;transform:scale(1.4)}12%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0}}';
  document.head.appendChild(st); }
{ const _sb = showBoss; showBoss = function (m) { const r = _sb.apply(this, arguments); const el = $('#bossbar'); if (!el) return r;
    const sup = isSuper(m); el.classList.toggle('super', sup); const b = el.querySelector('b'); if (b) b.dataset.sb = sup ? L2('SÚPER JEFE', 'SUPER BOSS') : '';
    if (sup && G.P) { G.P.superSeen = G.P.superSeen || []; if (!G.P.superSeen.includes(m.mid)) { G.P.superSeen.push(m.mid); markDirty();
      const old = $('#sbBan'); if (old) old.remove(); const d = document.createElement('div'); d.id = 'sbBan'; d.innerHTML = `<small>⚠ ${L2('SÚPER JEFE', 'SUPER BOSS')} ⚠</small><b>${esc(m.name)}</b>`; document.body.appendChild(d); setTimeout(() => d.remove(), 2900); try { sfx('boss'); } catch (e) { } } }
    return r; }; }
// al vencerlo: cinemática de su capítulo (si no estás en un duelo)
{ const _km = killMob; killMob = function (m) { const sup = isSuper(m) && !m.dying; const r = _km.apply(this, arguments);
    if (sup) { const ch = SUPER_BOSS[m.mid]; setTimeout(() => { if (CINE.on || !G.P || G.P.dead || (typeof DUEL !== 'undefined' && DUEL)) return; if (typeof loreUnlock === 'function') { const U = G.P.loreU || []; if (!U.includes(ch)) loreUnlock(ch); } closeDialog(); cineChapter(ch); }, 3500); }
    return r; }; }
// bestiario y mapa: «Súper jefe» en vez de «Jefe»
{ const _rb = renderBestiary; renderBestiary = function (B) { const r = _rb.apply(this, arguments);
    try { const h = B && B.querySelector('.bhead h2'), sub = B && B.querySelector('.bhead .sub'); if (h && sub) { const id = Object.keys(SUPER_BOSS).find(k => BOSSES[k] && BOSSES[k].n === h.textContent); if (id) sub.textContent = sub.textContent.replace(/^Jefe/, '⚠ ' + L2('Súper jefe', 'Super boss')); } } catch (e) { }
    return r; }; }
// guía en la lupa
if (typeof GSIS !== 'undefined') GSIS.push(['cine', '🎬 ' + L2('Cinemáticas y súper jefes', 'Cutscenes and super bosses'), () => [
  L2('El pasado del mundo se cuenta con cinemáticas en pixel art. El prólogo con toda la historia está en el Libro del Vínculo («🎬 Ver el prólogo») y la Anciana Mira te lo enseña («Ver el pasado»).', 'The world\'s past is told with pixel art cutscenes. The prologue with the whole story is in the Book of the Bond ("🎬 Watch the prologue") and Elder Mira shows it to you ("See the past").'),
  L2('Cuando un aldeano te cuenta un capítulo nuevo («¿Qué se cuenta hoy?»), al terminar ves su cinemática. Puedes volver a verlas en el Libro con el botón 🎬 de cada capítulo. Toca la pantalla para avanzar o pulsa «Saltar».', 'When a villager tells you a new chapter ("What\'s the news today?"), you then see its cutscene. You can watch them again in the Book with each chapter\'s 🎬 button. Tap the screen to advance or press "Skip".'),
  L2('Súper jefes: el Desatado, el Señor del Eclipse, Nihil, la Luna Sonriente y El Sin Nombre son los jefes de la historia. Tienen barra dorada, un aviso al aparecer y, al vencerlos, una cinemática con lo que pasa después.', 'Super bosses: the Unbound, the Lord of the Eclipse, Nihil, the Smiling Moon and the Nameless One are the story bosses. They have a golden bar, a warning when they appear and, when defeated, a cutscene with what happens next.')], () => null]);
