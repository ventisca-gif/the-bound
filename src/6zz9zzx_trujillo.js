// ================= v5.21: TRUJILLO (LA LIBERTAD, PERÚ), BUS INTERPROVINCIAL, CASAS EN OTROS PAÍSES E ICONOS DE OFICIOS =================
// Mapa 'trujillo' 780×440 con el motor de Lima (M.lima): Centro Histórico con la Plaza de Armas (catedral amarilla,
// Monumento a la Libertad, casonas de colores con rejas), Jirón Pizarro, Huanchaco (playa, muelle y caballitos de
// totora), Chan Chan (murallas de adobe), El Golf (casas con jardín y campo de golf), Salaverry (plaza con glorieta de
// madera, pérgola azul, iglesia y puerto) y las dunas del Cerro Carretas (oficio de sandboard). Terminal Terrestre.
// Bus interprovincial (5.000 de oro) desde Lima (La Victoria) y Lima Norte (Plaza Norte): vas sentado y ves el desierto y
// el mar por la ventana. Casas para mudarte en Japón, Lima, México, España y Trujillo (HOUSES 'hogar_*').
// Iconos propios para los oficios de los países (genIcon ['jobx', clave]).

const TR_W = 780, TR_H = 440, TR_BUS = 5000;
const TR_HR = [34, 70, 106, 142, 208, 244, 280, 316, 352], TR_VR = [44, 80, 116, 152, 188, 224, 260, 296, 380, 416, 452, 488, 524, 560];
const TR_PZ = { x0: 306, x1: 370, y0: 152, y1: 202, cx: 338, cy: 177 };          // Plaza de Armas
const TR_HU = { x0: 20, x1: 120, y0: 20, y1: 150, pier: 84 };                     // Huanchaco
const TR_CC = { x0: 150, x1: 240, y0: 86, y1: 136 };                               // Chan Chan
const TR_GOLF = { x0: 170, x1: 300, y0: 252, y1: 344 };                            // El Golf
const TR_SV = { x0: 470, x1: 540, y0: 356, y1: 392, cx: 505, cy: 374 };            // plaza de Salaverry
const TR_DUNA = { x0: 600, x1: 772, y0: 214, y1: 404, top: [690, 276] };           // Cerro Carretas
const TR_TERM = { x: 420, y: 214 };                                                 // Terminal Terrestre
const trCoast = y => y < 160 ? 14 + Math.round(Math.sin(y / 17) * 2) : 14 + Math.round((y - 160) * 0.5);
const trSea = (x, y) => x < trCoast(y) || y > 406;
const trBeach = (x, y) => !trSea(x, y) && (x < trCoast(y) + (y < 150 ? 12 : 7) || y > 398);
const trDune = (x, y) => x >= TR_DUNA.x0 && y >= TR_DUNA.y0 && y <= TR_DUNA.y1 && x <= TR_DUNA.x1;
const trDuneH = (x, y) => { const d = Math.hypot((x - TR_DUNA.top[0]) / 70, (y - TR_DUNA.top[1]) / 60), d2 = Math.hypot((x - 640) / 30, (y - 360) / 26); return Math.max(0, Math.min(9, Math.round((1 - d) * 10)), Math.min(5, Math.round((1 - d2) * 6))); };
const TR_RES = [[TR_PZ.x0 - 2, TR_PZ.y0 - 12, TR_PZ.x1 + 2, TR_PZ.y1 + 2], [TR_CC.x0, TR_CC.y0, TR_CC.x1, TR_CC.y1], [TR_GOLF.x0, TR_GOLF.y0, TR_GOLF.x1, TR_GOLF.y1], [TR_SV.x0 - 4, TR_SV.y0 - 10, TR_SV.x1 + 4, TR_SV.y1], [TR_TERM.x - 6, TR_TERM.y - 6, TR_TERM.x + 12, TR_TERM.y + 4]];
const trRes = (x, y) => TR_RES.some(([a, b, c, d]) => x >= a && x <= c && y >= b && y <= d);
const TR_ZONES = [
  { k: 'plaza', n: L2('Plaza de Armas de Trujillo', 'Trujillo Main Square'), s: L2('La Ciudad de la Eterna Primavera', 'The City of Eternal Spring'), t: (x, y) => x >= TR_PZ.x0 - 4 && x <= TR_PZ.x1 + 4 && y >= TR_PZ.y0 - 12 && y <= TR_PZ.y1 + 4 },
  { k: 'pizarro', n: L2('Jirón Pizarro', 'Jirón Pizarro'), s: L2('Paseo peatonal de casonas', 'Pedestrian street of mansions'), t: (x, y) => x > TR_PZ.x1 && x < 470 && Math.abs(y - TR_PZ.cy) < 5 },
  { k: 'huanchaco', n: 'Huanchaco', s: L2('Caballitos de totora y olas', 'Reed boats and waves'), t: (x, y) => x <= TR_HU.x1 && y <= TR_HU.y1 },
  { k: 'chanchan', n: 'Chan Chan', s: L2('La ciudad de barro más grande de América', 'The largest mud city in the Americas'), t: (x, y) => x >= TR_CC.x0 && x <= TR_CC.x1 && y >= TR_CC.y0 && y <= TR_CC.y1 },
  { k: 'golf', n: L2('El Golf (Víctor Larco)', 'El Golf (Víctor Larco)'), s: L2('Casas con jardín y campo de golf', 'Houses with gardens and a golf course'), t: (x, y) => x >= TR_GOLF.x0 - 10 && x <= TR_GOLF.x1 + 10 && y >= TR_GOLF.y0 - 10 && y <= TR_GOLF.y1 + 10 },
  { k: 'salaverry', n: 'Salaverry', s: L2('Puerto, glorieta y dunas', 'Port, gazebo and dunes'), t: (x, y) => x >= 440 && x < 600 && y >= 330 },
  { k: 'duna', n: L2('Cerro Carretas', 'Cerro Carretas'), s: L2('Dunas para el sandboard', 'Sandboarding dunes'), t: (x, y) => trDune(x, y) },
  { k: 'terminal', n: L2('Terminal Terrestre', 'Bus Terminal'), s: L2('Buses a Lima', 'Buses to Lima'), t: (x, y) => Math.abs(x - TR_TERM.x - 3) < 12 && Math.abs(y - TR_TERM.y) < 10 },
  { k: 'trujillo', n: 'Trujillo', s: L2('La Libertad, Perú', 'La Libertad, Peru'), t: () => true }];
const trZoneAt = (px, py) => TR_ZONES.find(z => z.t(px / 16, py / 16)) || null;

// ---------- suelo: dunas (27) y calles del golf (28) ----------
{ const _p2 = lmPaint2; lmPaint2 = function (M, g, x, y, tx, ty, k, m) { if (k !== 27 && k !== 28) return _p2.apply(this, arguments); const h = hash2(tx, ty, 271), R = (a, b, w, hh, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, hh); };
  if (k === 27) { const H = M.ld[M.I(tx, ty)] || 0, base = ['#e2cfa4', '#dcc79a', '#d6bf90', '#d0b886', '#cab07e', '#c4a876', '#bea06e', '#b89866', '#b2905e', '#ac8856'][Math.min(9, H)]; R(0, 0, 16, 16, base);
    const shade = H > (M.ld[M.I(tx + 1, ty)] || 0) ? 'rgba(255,255,255,0.10)' : H < (M.ld[M.I(tx + 1, ty)] || 0) ? 'rgba(90,60,30,0.10)' : null; if (shade) R(0, 0, 16, 16, shade);
    for (let k2 = 0; k2 < 3; k2++) { const yy = ((h * 50 + k2 * 5 + tx * 3) | 0) % 16; R(0, yy, 16, 1, 'rgba(120,90,50,0.14)'); } return; }
  R(0, 0, 16, 16, ((tx >> 2) + (ty >> 2)) % 2 ? '#4a9a3e' : '#56a648'); if (h < 0.08) R(((h * 200) | 0) % 12, 6, 3, 2, '#3e8834'); }; }

// ---------- edificios ----------
Object.assign(LM_H_OF, { trucat: () => 170, trucasa: v => 64 + (v % 3) * 10, truterm: () => 70, trugolf: () => 64, truiglesia: () => 120, trucasajard: v => 58 + (v % 2) * 10 });
Object.assign(LM_DEPTH, { trucat: 8, trucasa: 3, truterm: 5, trugolf: 4, truiglesia: 6, trucasajard: 3 });
const TR_COL = ['#f2c230', '#3a5ad8', '#b8302a', '#8ac8e8', '#f4f0e6', '#e8a0b0', '#7ab86a', '#f0a040'];
const trReja = (R, x, y, w, h) => { R(x - 2, y - 2, w + 4, h + 4, '#f8f6f0'); R(x, y, w, h, '#2a3040'); for (let q = x + 1; q < x + w; q += 2) R(q, y, 1, h, '#0e0e12'); R(x, y + (h >> 1), w, 1, '#0e0e12'); R(x - 3, y + h + 2, w + 6, 2, '#e8e2d4'); };
Object.assign(LM_BLD2, {
  trucat: (g, W, H, v, r, R) => { const Y = '#f2c230', Yd = '#d8a818', Wh = '#fbf8f0', TW = 54; R(TW, 56, W - 2 * TW, H - 56, Y); g.fillStyle = Y; g.beginPath(); g.moveTo(TW, 60); g.lineTo(W / 2, 30); g.lineTo(W - TW, 60); g.fill(); R(TW, 58, W - 2 * TW, 4, Wh);
    for (const k of [-1, 1]) for (let j = 0; j < 2; j++) R(W / 2 + k * (18 + j * 22) - 3, 66, 6, H - 72, Wh);
    g.fillStyle = '#3a2414'; g.beginPath(); g.moveTo(W / 2 - 12, H - 4); g.lineTo(W / 2 - 12, H - 40); g.ellipse(W / 2, H - 40, 12, 12, 0, Math.PI, 0); g.lineTo(W / 2 + 12, H - 4); g.fill(); R(W / 2 - 14, H - 56, 28, 4, Wh); R(W / 2 - 6, 70, 12, 16, Wh); R(W / 2 - 4, 72, 8, 12, '#3a5ad8');
    for (const tx0 of [0, W - TW]) { R(tx0, 40, TW, H - 40, Y); R(tx0, 40, 3, H - 40, Yd); R(tx0, 40, TW, 4, Wh); R(tx0 + 6, 18, TW - 12, 24, Y); R(tx0 + 6, 18, TW - 12, 3, Wh); g.fillStyle = Y; g.beginPath(); g.ellipse(tx0 + TW / 2, 18, TW / 2 - 8, 14, 0, Math.PI, 0); g.fill(); R(tx0 + TW / 2 - 2, -2 + 4, 4, 8, Wh);
      for (const ox of [-8, 8]) { g.fillStyle = '#2a2420'; g.beginPath(); g.moveTo(tx0 + TW / 2 + ox - 4, 38); g.lineTo(tx0 + TW / 2 + ox - 4, 28); g.ellipse(tx0 + TW / 2 + ox, 28, 4, 4, 0, Math.PI, 0); g.lineTo(tx0 + TW / 2 + ox + 4, 38); g.fill(); }
      for (let y = 56; y < H - 30; y += 34) trReja(R, tx0 + TW / 2 - 6, y, 12, 18); }
    R(0, H - 3, W, 3, '#8a8478'); },
  trucasa: (g, W, H, v, r, R) => { const fc = TR_COL[(v * 3 + W) % TR_COL.length], Wh = '#f8f6f0'; R(0, 8, W, H - 8, fc); R(0, 4, W, 6, Wh); R(0, 10, W, 2, lmSh(fc, 0.8)); R(0, 8, 3, H - 8, Wh); R(W - 3, 8, 3, H - 8, Wh);
    const n = Math.max(1, Math.floor((W - 10) / 24)); for (let k = 0; k < n; k++) { const x = 8 + k * ((W - 16) / n) + ((W - 16) / n - 12) / 2; trReja(R, Math.round(x), 18, 12, Math.round(H * 0.42)); }
    R((W >> 1) - 7, H - 26, 14, 23, '#5a3418'); R((W >> 1) - 9, H - 28, 18, 2, Wh); R(0, H - 3, W, 3, '#8a8478'); },
  trucasajard: (g, W, H, v, r, R) => { const fc = ['#f4f0e6', '#e8dcc0', '#d8e8f0', '#f0e0d0'][v % 4]; R(0, 14, W, H - 14, fc); g.fillStyle = v % 2 ? '#b4502e' : '#5a6a7a'; g.beginPath(); g.moveTo(-2, 18); g.lineTo(W / 2, 2); g.lineTo(W + 2, 18); g.fill();
    for (let x = 6; x < W - 12; x += 20) { R(x, 24, 12, 12, '#3a5068'); R(x, 24, 12, 2, '#f8f6f0'); } R(W - 20, H - 22, 12, 19, '#6a4022'); R(0, H - 8, W, 5, '#3a8a3a'); for (let x = 2; x < W; x += 5) R(x, H - 10, 3, 3, ['#ff5a8a', '#ffd040', '#ffffff'][x % 3]); R(0, H - 3, W, 3, '#8a8478'); },
  truterm: (g, W, H, v, r, R) => { R(0, 14, W, H - 14, '#e8e4dc'); R(0, 10, W, 6, '#c8302a'); R(0, H - 26, W, 23, '#3a5068'); for (let x = 6; x < W - 6; x += 18) R(x, H - 24, 14, 20, '#5a7a98'); txtT(g, 'TERMINAL TERRESTRE', W / 2, 18, '#1a1a1e'); R(0, H - 3, W, 3, '#8a8478'); },
  trugolf: (g, W, H, v, r, R) => { R(0, 18, W, H - 18, '#f8f6f0'); g.fillStyle = '#2a6a3a'; g.beginPath(); g.moveTo(-2, 22); g.lineTo(W / 2, 4); g.lineTo(W + 2, 22); g.fill(); for (let x = 8; x < W - 10; x += 18) { R(x, 30, 12, 16, '#3a5068'); R(x - 1, 46, 14, 2, '#c8c0b0'); } txtT(g, 'GOLF CLUB', W / 2, 22, '#2a6a3a'); R((W >> 1) - 8, H - 22, 16, 19, '#6a4022'); R(0, H - 3, W, 3, '#8a8478'); },
  truiglesia: (g, W, H, v, r, R) => { const Cr = '#f2ead6', Rd = '#a8302a', TW = 30; R(TW, 46, W - 2 * TW, H - 46, Cr); g.fillStyle = Cr; g.beginPath(); g.ellipse(W / 2, 48, (W - 2 * TW) / 2 - 4, 22, 0, Math.PI, 0); g.fill(); R(TW, 46, W - 2 * TW, 3, Rd); R(TW, H - 12, W - 2 * TW, 3, Rd);
    g.fillStyle = '#3a2414'; g.beginPath(); g.moveTo(W / 2 - 9, H - 4); g.lineTo(W / 2 - 9, H - 30); g.ellipse(W / 2, H - 30, 9, 9, 0, Math.PI, 0); g.lineTo(W / 2 + 9, H - 4); g.fill();
    for (const tx0 of [0, W - TW]) { R(tx0, 36, TW, H - 36, Cr); R(tx0, 36, TW, 3, Rd); g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(tx0 + TW / 2, 36, TW / 2 - 3, 12, 0, Math.PI, 0); g.fill(); R(tx0 + TW / 2 - 1, 16, 2, 10, '#5a5a60'); R(tx0 + TW / 2 - 4, 19, 8, 2, '#5a5a60'); g.fillStyle = '#2a2420'; g.beginPath(); g.ellipse(tx0 + TW / 2, 52, 5, 7, 0, 0, 7); g.fill(); }
    R(0, H - 3, W, 3, '#8a8478'); } });
function txtT(g, s, x, y, col) { g.font = 'bold 9px monospace'; g.textAlign = 'center'; g.fillStyle = col; g.fillText(s, Math.round(x), Math.round(y)); g.textAlign = 'left'; }

// ---------- decorado ----------
XSPR.tru_libertad = () => { const [c, g] = XC(56, 120), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  R(4, 104, 48, 14, '#d8d0c0'); R(4, 104, 48, 2, '#f0eadc'); R(10, 94, 36, 12, '#cfc6b4'); R(16, 52, 24, 44, '#e2dacb'); R(16, 52, 3, 44, '#f4eee2'); R(18, 70, 20, 14, '#6a8a6a'); R(20, 72, 16, 10, '#8aaa88');
  for (const sx of [6, 40]) { R(sx, 82, 10, 14, '#7a9a7a'); R(sx + 2, 78, 6, 6, '#8aaa88'); }
  g.fillStyle = '#e8e0d0'; g.beginPath(); g.moveTo(14, 54); g.lineTo(28, 36); g.lineTo(42, 54); g.fill(); g.fillStyle = '#5a8a6a'; g.beginPath(); g.ellipse(28, 34, 6, 5, 0, 0, 7); g.fill();
  R(25, 14, 6, 20, '#5a8a6a'); R(26, 8, 4, 6, '#6a9a7a'); R(31, 2, 2, 14, '#5a8a6a'); R(30, 0, 4, 3, '#7aaa8a'); R(22, 18, 4, 8, '#4a7a5a'); R(20, 22, 4, 10, '#7a6a5a');
  return { c, ax: 28, ay: 117 }; };
XSPR.tru_caballito = () => { const [c, g] = XC(14, 52); g.fillStyle = '#c8a050'; g.beginPath(); g.moveTo(3, 50); g.lineTo(11, 50); g.lineTo(9, 10); g.lineTo(7, 0); g.lineTo(5, 10); g.fill(); g.fillStyle = '#a07a30'; for (let y = 6; y < 50; y += 4) g.fillRect(4, y, 6, 1); g.fillStyle = '#8a6420'; g.fillRect(6, 0, 2, 6); for (let k = 0; k < 4; k++) g.fillRect(4 + k, 0, 1, 3); return { c, ax: 7, ay: 50 }; };
XSPR.tru_glorieta = () => { const [c, g] = XC(64, 76), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  R(4, 66, 56, 8, '#c8b8a0'); R(4, 66, 56, 2, '#e0d4c0'); for (const x of [8, 20, 42, 54]) R(x, 30, 3, 36, '#6a3a1e'); R(6, 52, 52, 2, '#7a4422'); for (let x = 8; x < 56; x += 3) R(x, 54, 1, 10, '#7a4422');
  g.fillStyle = '#7a4422'; g.beginPath(); g.moveTo(0, 32); g.lineTo(32, 12); g.lineTo(64, 32); g.fill(); g.fillStyle = '#5a2e16'; for (let x = 4; x < 62; x += 6) g.fillRect(x, 26 - Math.abs(32 - x) * 0.3, 2, 6);
  g.fillStyle = '#6a3a1e'; g.beginPath(); g.ellipse(32, 12, 8, 6, 0, Math.PI, 0); g.fill(); R(31, 0, 2, 8, '#5a2e16'); return { c, ax: 32, ay: 74 }; };
XSPR.tru_pergola = () => { const [c, g] = XC(40, 64); g.fillStyle = '#2a5ab8'; g.fillRect(4, 8, 4, 56); g.fillRect(32, 8, 4, 56); g.fillRect(0, 6, 40, 5); g.fillStyle = '#4a7ad8'; g.fillRect(4, 8, 1, 56); g.fillStyle = '#f0f0e8'; for (const x of [6, 34]) { g.beginPath(); g.ellipse(x, 14, 4, 3, 0, 0, 7); g.fill(); } return { c, ax: 20, ay: 63 }; };
XSPR.tru_bandera_golf = () => { const [c, g] = XC(16, 34); g.fillStyle = '#1a1a1e'; g.beginPath(); g.ellipse(4, 32, 4, 2, 0, 0, 7); g.fill(); g.fillStyle = '#e8e8e8'; g.fillRect(3, 4, 2, 28); g.fillStyle = '#e83a3a'; g.beginPath(); g.moveTo(5, 4); g.lineTo(15, 8); g.lineTo(5, 12); g.fill(); return { c, ax: 4, ay: 32 }; };
XSPR.tru_chanchan = () => { const [c, g] = XC(64, 44), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); }; R(0, 6, 64, 38, '#b08a5e'); R(0, 6, 64, 3, '#c8a274'); for (let y = 14; y < 40; y += 10) for (let x = 4 + ((y / 10) % 2) * 6; x < 60; x += 12) { R(x, y, 8, 6, '#9a7650'); R(x + 2, y + 2, 4, 2, '#c8a274'); } R(0, 40, 64, 4, '#8a6a46'); return { c, ax: 32, ay: 43 }; };
XSPR.tru_barco = () => { const [c, g] = XC(44, 26); g.fillStyle = '#2a5ab8'; g.beginPath(); g.moveTo(2, 14); g.lineTo(42, 14); g.lineTo(36, 24); g.lineTo(8, 24); g.fill(); g.fillStyle = '#f0f0e8'; g.fillRect(4, 14, 36, 2); g.fillStyle = '#e8e4dc'; g.fillRect(16, 4, 12, 10); g.fillStyle = '#c8302a'; g.fillRect(16, 4, 12, 2); return { c, ax: 22, ay: 24 }; };
XSPR.tru_bus = () => ({ c: (() => { const [c, g] = XC(64, 34); g.fillStyle = '#e8e4dc'; g.fillRect(2, 4, 60, 24); g.fillStyle = '#c8302a'; g.fillRect(2, 18, 60, 4); g.fillStyle = '#3a5068'; for (let x = 6; x < 56; x += 10) g.fillRect(x, 7, 8, 9); g.fillStyle = '#1a1a1e'; for (const x of [12, 50]) { g.beginPath(); g.arc(x, 29, 5, 0, 7); g.fill(); } return c; })(), ax: 32, ay: 33 });
XSPR.tru_tablas = () => { const [c, g] = XC(26, 34); for (const [x, col] of [[3, '#ff8a3a'], [10, '#3ac8e8'], [17, '#ffd040']]) { g.fillStyle = col; g.beginPath(); g.ellipse(x + 3, 16, 3, 14, 0, 0, 7); g.fill(); g.fillStyle = '#1a1a1e'; g.fillRect(x + 1, 12, 4, 1); g.fillRect(x + 1, 20, 4, 1); } return { c, ax: 13, ay: 32 }; };
XSPR.fs_casa = () => { const [c, g] = XC(48, 58), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); }; R(2, 20, 44, 36, '#f4ece0'); g.fillStyle = '#b4502e'; g.beginPath(); g.moveTo(-2, 22); g.lineTo(24, 4); g.lineTo(50, 22); g.fill(); R(18, 34, 12, 22, '#6a4022'); R(27, 44, 2, 2, '#ffd040'); R(6, 28, 9, 9, '#3a5068'); R(33, 28, 9, 9, '#3a5068'); R(16, 13, 16, 7, '#ffd040'); R(17, 14, 14, 5, '#2a6a3a'); R(0, 54, 48, 4, '#8a8478'); return { c, ax: 24, ay: 57 }; };

// ---------- NPCs de Trujillo ----------
const TR_L = [['¡Bienvenido a Trujillo, la ciudad de la eterna primavera!', 'Welcome to Trujillo, the city of eternal spring!'], ['Trujillo es la capital de la marinera. En enero hay concurso nacional.', 'Trujillo is the capital of the marinera. There is a national contest in January.'], ['¿Ya fuiste a Huanchaco? Los pescadores todavía salen en caballitos de totora.', 'Have you been to Huanchaco? Fishermen still go out on reed boats.'],
  ['Chan Chan fue la capital de los chimúes, toda de barro. ¡Es enorme!', 'Chan Chan was the Chimú capital, all made of mud. It is huge!'], ['En Salaverry subimos al Cerro Carretas a hacer sandboard al atardecer.', 'In Salaverry we climb Cerro Carretas to sandboard at sunset.'], ['El Monumento a la Libertad lo hizo un escultor alemán. Mira cómo levanta la antorcha.', 'A German sculptor made the Liberty Monument. Look how it raises the torch.'],
  ['En El Golf las casas tienen jardín y hay un campo de golf de verdad.', 'In El Golf the houses have gardens and there is a real golf course.'], ['¿Un ceviche de mero en Huanchaco? ¡O un shambar el lunes!', 'A grouper ceviche in Huanchaco? Or a shambar on Monday!'], ['El bus a Lima sale de la Terminal Terrestre. Son unas horitas por la Panamericana.', 'The bus to Lima leaves from the Bus Terminal. A few hours along the Panamericana.'],
  ['Las casonas del centro tienen rejas de fierro forjado en las ventanas. Son coloniales.', 'The downtown mansions have wrought-iron window grilles. They are colonial.'], ['¡Chévere tu ropa, causa!', 'Cool clothes, mate!'], ['Dicen que la Ventisca pintó el norte con sol y arena.', 'They say the Ventisca painted the north with sun and sand.']];
const TR_NPC_LOOK = {}; { const cnt = {}; for (let n = 1; n <= 160; n++) { const li = (n * 7 + 3) % PE_LOOKS.length, [g] = PE_LOOKS[li]; cnt[g] = (cnt[g] || 0) + 1;
    NPCS['tr_' + n] = { n: { m: L2('Trujillano', 'Trujillano'), f: L2('Trujillana', 'Trujillana') }[g] || L2('Trujillano', 'Trujillano'), title: 'Trujillo', look: LK({ g }), lines: [peTx(TR_L[n % TR_L.length]), peTx(TR_L[(n * 5 + 2) % TR_L.length])], quests: [], hat: PE_LOOKS[li][4] }; TR_NPC_LOOK['tr_' + n] = li; } }
for (const [id, t, li, l, hat] of [['tr_bus', L2('Vendedora de pasajes', 'Ticket seller'), 3, L2('Bus a Lima y Lima Norte: 5.000 de oro. ¡Asientos cama con vista al mar!', 'Bus to Lima and North Lima: 5,000 gold. Sleeper seats with a sea view!')],
  ['tr_guia', L2('Guía de Trujillo', 'Trujillo guide'), 5, L2('La Plaza de Armas, la catedral y las casonas son del siglo XVI. ¿Qué quieres ver?', 'The Main Square, the cathedral and the mansions date from the 16th century. What do you want to see?')],
  ['tr_sandboard', L2('Instructor de sandboard', 'Sandboard instructor'), 1, L2('Sube la duna, ponte la tabla y déjate caer. Pasa entre las banderas y esquiva las piedras.', 'Climb the dune, strap on the board and let yourself go. Pass between the flags and dodge the rocks.'), 'gorra'],
  ['tr_golf', L2('Profesor de golf', 'Golf pro'), 6, L2('Tres hoyos, par 3. Apunta, mide la fuerza y que ruede.', 'Three holes, par 3. Aim, judge the power and let it roll.'), 'gorra'],
  ['tr_pescador', L2('Pescador de Huanchaco', 'Huanchaco fisherman'), 2, L2('El caballito de totora lo hacemos igual que los antiguos mochicas. Se rema de rodillas.', 'We make the reed boat just like the ancient Mochica. You paddle on your knees.'), 'paja'],
  ['tr_chanchan', L2('Guardián de Chan Chan', 'Chan Chan guardian'), 4, L2('Mira los peces y las aves en los muros: los chimúes adoraban al mar y a la luna.', 'Look at the fish and birds on the walls: the Chimú worshipped the sea and the moon.')],
  ['tr_marinera', L2('Campeona de marinera', 'Marinera champion'), 8, L2('¡Trujillo es la capital de la marinera! Pídele la ropa a la Profesora Milagros en Lima.', 'Trujillo is the capital of the marinera! Ask Teacher Milagros in Lima for the clothes.')]]) {
  NPCS[id] = { n: t, title: 'Trujillo', look: LK({ g: PE_LOOKS[li][0] }), lines: [l], quests: [], hat: hat || PE_LOOKS[li][4] }; TR_NPC_LOOK[id] = li; }
{ const _na = npcAtlas; npcAtlas = function (id) { const li = TR_NPC_LOOK[id]; if (li !== undefined) return getAtlas('TRN' + li, () => { const [a, cos] = peApp(li), L = heroLook('guerrero', a, { weapon: 0 }, cos, {}); L.weapon = null; L.back = null; return buildAtlas(L, ['idle', 'walk'], drawHero); }); return _na.apply(this, arguments); }; }
FS_DANCERS.add('tr_marinera');

// ---------- el mapa ----------
function makeTrujillo() { if (G.maps.trujillo) return G.maps.trujillo; const w = TR_W, h = TR_H, N = w * h, I = (x, y) => y * w + x, J = LM_G;
  const M = { id: 'trujillo', w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], bossAt: [], halos: [], temples: [], lima: 1, tru: 1,
    lg: new Uint8Array(N), lm: new Uint8Array(N), ld: new Uint8Array(N), HR: TR_HR, VR: TR_VR, nCars: 80, npre: 'tr_', pedApps: PE_APPS_W, pedLooks: PE_LOOKS, zoneAt: trZoneAt };
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h, RG = (x0, y0, x1, y1, k, mk) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inb(x, y)) { M.lg[I(x, y)] = k; M.lm[I(x, y)] = mk || 0; } };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = I(x, y); let k = J.GRASS; if (trSea(x, y)) { k = J.SEA; M.ld[i] = Math.min(250, Math.max(1, (trCoast(y) - x) * 3, (y - 406) * 3)); } else if (trBeach(x, y)) k = J.SAND; else if (trDune(x, y)) { k = 27; M.ld[i] = trDuneH(x, y); } else if (x >= 774 || y < 4) k = LM_G2.ARID; else k = hash2(x >> 4, y >> 4, 7) < 0.5 ? LM_G2.DIRT : J.GRASS; M.lg[i] = k; if (k === J.GRASS) M.lm[i] = hash2(x >> 3, y >> 3, 9) < 0.4 ? 20 : 0; }
  const hc = new Uint8Array(N), vc = new Uint8Array(N), blocked = k => k === J.SEA || k === J.SAND || k === 27 || k === LM_G2.ARID;
  const road = (x0, y0, x1, y1, hz) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (!inb(x, y)) continue; const i = I(x, y), k0 = M.lg[i]; if (blocked(k0) || trRes(x, y)) continue; const al = hz ? y - y0 : x - x0; if (al === 0 || al === 5) { if (k0 !== J.ROAD) { M.lg[i] = J.WALK; M.lm[i] = 0; } continue; } M.lg[i] = J.ROAD; M.lm[i] = 0; (hz ? hc : vc)[i] = 1; if (al === 2) M.lm[i] = hz ? 1 : 2; } };
  for (const y0 of TR_HR) road(4, y0, w - 8, y0 + 5, true); for (const x0 of TR_VR) road(x0, 6, x0 + 5, h - 1, false);
  for (let i = 0; i < N; i++) if (hc[i] && vc[i]) M.lm[i] = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = I(x, y); if (hc[i] && !vc[i] && (vc[i - 1] || vc[i + 1])) M.lm[i] = 3; else if (vc[i] && !hc[i] && (hc[i - w] || hc[i + w])) M.lm[i] = 4; }
  // Plaza de Armas: cuatro jardines, caminos y el monumento al centro; Jirón Pizarro peatonal al este
  const Z = TR_PZ; RG(Z.x0 - 2, Z.y0 - 12, Z.x1 + 2, Z.y1 + 2, J.WALK); RG(Z.x0, Z.y0, Z.x1, Z.y1, J.PLAZA);
  for (const [a, b] of [[Z.x0 + 3, Z.y0 + 3], [Z.cx + 5, Z.y0 + 3], [Z.x0 + 3, Z.cy + 5], [Z.cx + 5, Z.cy + 5]]) RG(a, b, a + Math.round((Z.x1 - Z.x0) / 2) - 9, b + Math.round((Z.y1 - Z.y0) / 2) - 9, J.GRASS, 20);
  for (let x = Z.x1 + 3; x < 470; x++) for (let y = Z.cy - 3; y <= Z.cy + 3; y++) if (!blocked(M.lg[I(x, y)])) { M.lg[I(x, y)] = J.COBBLE; M.lm[I(x, y)] = 0; }
  // Huanchaco: muelle sobre el mar y malecón
  for (let x = trCoast(TR_HU.pier) - 28; x <= trCoast(TR_HU.pier) + 12; x++) for (const y of [TR_HU.pier, TR_HU.pier + 1]) if (inb(x, y)) { M.lg[I(x, y)] = J.BRIDGE; M.lm[I(x, y)] = 0; }
  for (let y = TR_HU.y0; y <= TR_HU.y1; y++) { const x = trCoast(y) + 12; for (let k = 0; k < 3; k++) if (inb(x + k, y)) { M.lg[I(x + k, y)] = J.WALK; M.lm[I(x + k, y)] = 0; } }
  // Chan Chan: explanada de adobe
  RG(TR_CC.x0, TR_CC.y0, TR_CC.x1, TR_CC.y1, J.ADOBE);
  // El Golf: calles verdes y búnkeres de arena
  for (let y = TR_GOLF.y0; y <= TR_GOLF.y1; y++) for (let x = TR_GOLF.x0; x <= TR_GOLF.x1; x++) { const i = I(x, y); M.lg[i] = 28; M.lm[i] = 0; }
  for (const [bx, by, r] of [[200, 270, 4], [250, 300, 5], [280, 330, 4], [215, 325, 3]]) for (let y = by - r; y <= by + r; y++) for (let x = bx - r; x <= bx + r; x++) if (Math.hypot(x - bx, (y - by) * 1.3) <= r) M.lg[I(x, y)] = J.SAND;
  // Salaverry: plaza con glorieta y malecón al puerto
  RG(TR_SV.x0 - 4, TR_SV.y0 - 10, TR_SV.x1 + 4, TR_SV.y1, J.WALK); RG(TR_SV.x0, TR_SV.y0, TR_SV.x1, TR_SV.y1, J.PLAZA); for (const [a, b] of [[TR_SV.x0 + 3, TR_SV.y0 + 3], [TR_SV.cx + 6, TR_SV.y0 + 3], [TR_SV.x0 + 3, TR_SV.cy + 5], [TR_SV.cx + 6, TR_SV.cy + 5]]) RG(a, b, a + 24, b + 7, J.GRASS, 20);
  for (let y = TR_SV.y1 + 1; y <= 432; y++) for (const x of [556, 557]) if (inb(x, y)) { M.lg[I(x, y)] = J.BRIDGE; M.lm[I(x, y)] = 0; }
  RG(TR_TERM.x - 6, TR_TERM.y - 6, TR_TERM.x + 12, TR_TERM.y + 4, J.WALK);
  for (let i = 0; i < N; i++) { const k = M.lg[i]; if (k === J.SEA) M.ter[i] = T.WATER; else if (k === LM_G2.ARID) M.ter[i] = T.IWALL; }
  M.exit = { x: -9, y: -9 }; prepPalettes(M); initMapObjs(M); trBuild(M); G.maps.trujillo = M; return M; }
function trBuild(M) { const I = M.I, J = LM_G, w = M.w, h = M.h, inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h, R = new RNG(SEED + 9811);
  const occ = (x, y) => !inb(x, y) || M.objAt[I(x, y)] >= 0 || SOLID_T[M.ter[I(x, y)]];
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {})), Fs = (f, x, y, o) => occ(x, y) ? null : F(f, x, y, null, o);
  const bld = (kind, x, by, wd, v) => F('lmb_' + kind + '_' + wd + '_' + v, x, by, jpFp(wd, LM_DEPTH[kind] || 3), { px: x * 16 + wd * 8, py: (by + 1) * 16 - 1, jpb: 1, jl: lmBldLights(kind === 'trucat' || kind === 'truiglesia' ? 'catedral' : 'casa', wd) });
  const free = (x0, y0, x1, y1, ks) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (occ(x, y) || trRes(x, y)) return false; const k = M.lg[I(x, y)]; if (!(ks || [J.GRASS, LM_G2.DIRT]).includes(k)) return false; } return true; };
  const sp = (id, x, y, o) => { const [X, Y] = fsFree(M, x, y, 8); return spawnNPC(id, X * 16 + 8, Y * 16 + 8, 'trujillo', Object.assign({ face: 'down' }, o || {})); };
  const put = (id, cx, cy, rr) => { for (let t = 0; t < 60; t++) { const x = cx + R.int(-rr, rr), y = cy + R.int(-rr, rr); if (!inb(x, y) || occ(x, y)) continue; const k = M.lg[I(x, y)]; if (k === J.ROAD || k === J.SEA) continue; spawnNPC(id, x * 16 + 8, y * 16 + 8, 'trujillo', { face: 'down', wander: 4 }); return; } };
  // Plaza de Armas: catedral amarilla al norte, casonas alrededor, monumento, palmeras y faroles
  const Z = TR_PZ; bld('trucat', Z.cx - 12, Z.y0 - 3, 24, 0); for (let x = Z.x0 - 2; x < Z.cx - 13; x += 6) bld('trucasa', x, Z.y0 - 3, 6, x % 16); for (let x = Z.cx + 13; x <= Z.x1 - 4; x += 6) bld('trucasa', x, Z.y0 - 3, 6, (x * 3) % 16);
  F('tru_libertad', Z.cx, Z.cy, [[-1, 0], [0, 0], [1, 0]], { px: Z.cx * 16 + 8 }); for (const [x, y] of [[Z.x0 + 2, Z.y0 + 2], [Z.x1 - 2, Z.y0 + 2], [Z.x0 + 2, Z.y1 - 2], [Z.x1 - 2, Z.y1 - 2], [Z.cx - 8, Z.cy - 8], [Z.cx + 8, Z.cy + 8]]) Fs('lm_palmera1', x, y);
  for (let x = Z.x0; x <= Z.x1; x += 8) { Fs('lm_farol', x, Z.y0, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); Fs('lm_farol', x, Z.y1, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); }
  // casonas de colores en el centro histórico (entre las avenidas cercanas a la plaza) y en el Jirón Pizarro
  for (let x = Z.x1 + 4; x < 466; x += 6) { if (free(x, Z.cy - 6, x + 5, Z.cy - 4, [J.GRASS, LM_G2.DIRT, J.WALK])) bld('trucasa', x, Z.cy - 4, 6, x % 16); if (free(x, Z.cy + 6, x + 5, Z.cy + 8, [J.GRASS, LM_G2.DIRT, J.WALK])) bld('trucasa', x, Z.cy + 8, 6, (x + 5) % 16); }
  const VR = TR_VR.concat([w - 8]), HR = TR_HR.concat([h + 6]);
  for (let i = 0; i < VR.length - 1; i++) for (let j = 0; j < HR.length - 1; j++) { const bx0 = VR[i] + 6, bx1 = VR[i + 1] - 1, by0 = Math.max(8, HR[j] + 6), by1 = Math.min(h - 2, HR[j + 1] - 1); if (bx1 - bx0 < 3 || by1 - by0 < 3) continue;
    const cx = (bx0 + bx1) >> 1, cy = (by0 + by1) >> 1, center = Math.abs(cx - Z.cx) < 150 && Math.abs(cy - Z.cy) < 90, golfz = cx >= 140 && cx <= 330 && cy >= 220 && cy <= 380, kinds = center ? ['trucasa', 'trucasa', 'trucasa', 'col'] : golfz ? ['trucasajard'] : ['trucasajard', 'casa', 'trucasa', 'depa'];
    if (hash2(i, j, 981) < (center ? 0.04 : 0.25)) continue;
    for (let by = by1; by - 2 >= by0; by -= 5) { let x = bx0; while (x <= bx1) { let wd = R.int(5, 7); if (x + wd - 1 > bx1) { if (bx1 - x + 1 >= 4) wd = bx1 - x + 1; else break; } const kind = kinds[R.int(0, kinds.length - 1)], dp = LM_DEPTH[kind] || 3; if (free(x, by - dp + 1, x + wd - 1, by)) { bld(kind, x, by, wd, R.int(0, 15)); x += wd; } else x++; } }
    for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) if (M.lg[I(x, y)] === J.GRASS && !trRes(x, y) && !occ(x, y) && hash2(x, y, 991) < 0.03) Fs(golfz || hash2(x, y, 3) < 0.5 ? 'lm_palmera1' : 'lm_arbol', x, y); }
  // Huanchaco: caballitos de totora en fila, muelle, sombrillas y pescador
  for (let y = TR_HU.y0 + 6; y < TR_HU.y1; y += 3) if (Math.abs(y - TR_HU.pier) > 4) { const x = trCoast(y) + 2 + (y % 2); Fs('tru_caballito', x, y); }
  for (let y = TR_HU.y0 + 4; y < TR_HU.y1; y += 13) Fs('lm_sombrilla' + (y % 4), trCoast(y) + 7, y + 1); F('tru_barco', trCoast(TR_HU.pier) - 16, TR_HU.pier + 3, null, { solid: false });
  sp('tr_pescador', trCoast(TR_HU.pier) + 4, TR_HU.pier + 3);
  // Chan Chan: murallas de adobe con relieves
  for (let x = TR_CC.x0 + 2; x < TR_CC.x1 - 4; x += 5) { Fs('tru_chanchan', x, TR_CC.y0 + 2, { fp: [[0, 0], [1, 0], [2, 0], [3, 0]] }); if (x % 15 === 2) Fs('tru_chanchan', x, TR_CC.y1 - 2); } for (let y = TR_CC.y0 + 8; y < TR_CC.y1 - 6; y += 10) { Fs('tru_chanchan', TR_CC.x0 + 2, y); Fs('tru_chanchan', TR_CC.x1 - 4, y); }
  sp('tr_chanchan', (TR_CC.x0 + TR_CC.x1) >> 1, (TR_CC.y0 + TR_CC.y1) >> 1);
  // El Golf: club, banderas y profesor
  bld('trugolf', TR_GOLF.x0 + 4, TR_GOLF.y0 + 6, 8, 0); for (const [x, y] of [[222, 280], [270, 312], [196, 336], [290, 270]]) Fs('tru_bandera_golf', x, y); sp('tr_golf', TR_GOLF.x0 + 8, TR_GOLF.y0 + 8);
  // Salaverry: glorieta, pérgola azul, iglesia, faroles, barcos y el instructor de sandboard al pie de la duna
  const S = TR_SV; F('tru_glorieta', S.cx, S.cy, [[-1, 0], [0, 0], [1, 0]], { px: S.cx * 16 + 8 }); bld('truiglesia', S.cx - 6, S.y0 - 3, 12, 0);
  for (let x = S.x0 + 2; x <= S.x1 - 2; x += 8) { Fs('tru_pergola', x, S.y1 - 1); Fs('lm_farol', x + 4, S.y0 + 1, { jl: [[0, -50, 46, 'rgba(255,230,160,0.6)']] }); }
  for (const x of [530, 580, 610]) F('tru_barco', x, 414, null, { solid: false });
  const sb = sp('tr_sandboard', TR_DUNA.x0 + 4, 330); Fs('tru_tablas', TR_DUNA.x0 + 2, 328); const top = TR_DUNA.top; F('lm_vacio', top[0], top[1], null, { solid: false, xact: 'tru_sandboard' }); Fs('tru_tablas', top[0] + 2, top[1] - 1);
  // Terminal Terrestre con buses y la vendedora
  bld('truterm', TR_TERM.x - 4, TR_TERM.y - 1, 12, 0); Fs('tru_bus', TR_TERM.x + 10, TR_TERM.y + 2); F('lm_vacio', TR_TERM.x + 2, TR_TERM.y, null, { solid: false, xact: 'tru_terminal' }); sp('tr_bus', TR_TERM.x - 2, TR_TERM.y + 2);
  sp('tr_guia', Z.cx + 4, Z.cy + 6, { wander: 2 }); sp('tr_marinera', Z.cx - 6, Z.y1 - 3);
  // casa para mudarte (El Golf) y gente
  abDoor(M, 'hogar_tru', 236, 360);
  let n = 1; for (const [cx, cy, k] of [[Z.cx, Z.cy, 50], [70, 90, 18], [195, 110, 12], [235, 300, 20], [505, 374, 20], [640, 330, 12], [420, 214, 10], [520, 120, 18], [150, 200, 10]]) for (let q = 0; q < k && n <= 160; q++) put('tr_' + (n++), cx, cy, 26);
  lmCarsInit(M); }
XACT.tru_sandboard = [L2('🏂 Bajar la duna en sandboard', '🏂 Sandboard down the dune'), 'run', () => trSandboard()];
XACT.tru_terminal = [L2('🚌 Bus a Lima (5.000)', '🚌 Bus to Lima (5,000)'), 'run', () => busMenu('trujillo')];

// ---------- bus interprovincial ----------
const BUSR = { end: 0, dest: null, from: null, title: '' };
function busMenu(here) { const P = G.P, opts = here === 'trujillo' ? [['lima', L2('Lima (La Victoria)', 'Lima (La Victoria)')], ['lima_norte', L2('Lima Norte (Plaza Norte)', 'North Lima (Plaza Norte)')]] : [['trujillo', L2('Trujillo (La Libertad)', 'Trujillo (La Libertad)')]];
  xMsg('🚌 ' + L2('Bus interprovincial', 'Intercity bus'), L2('Pasaje: ', 'Ticket: ') + TR_BUS.toLocaleString() + L2(' de oro. Asiento con ventana: verás el desierto y el mar por la Panamericana.', ' gold. Window seat: you will see the desert and the sea along the Panamericana.'), opts.map(([d, n]) => [n, () => { if (P.gold < TR_BUS) { toast(L2('Te falta oro para el pasaje.', 'Not enough gold for the ticket.'), 'warn'); return; } P.gold -= TR_BUS; sfx('coin'); markDirty(); busBoard(here, d); }])); }
function makeBusCabin() { if (G.maps.bus_pe) return G.maps.bus_pe; const w = 34, h = 9, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'bus_pe', w, h, ter: new Uint8Array(N).fill(T.IWALL), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], busR: 1 };
  for (let y = 2; y <= 6; y++) for (let x = 2; x <= w - 3; x++) M.ter[I(x, y)] = T.CARPET; M.exit = { x: -9, y: -9 }; prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {})); for (let x = 6; x <= w - 4; x += 2) for (const y of [2, 3, 5, 6]) F('av_asiento', x, y, { seat: 1 });
  const Rr = new RNG(77); for (const o of M.objs) if (o.seat && Rr.f() < 0.55) { const e = spawnNPC('pe_' + Rr.int(1, 120), o.px, o.py - 2, 'bus_pe', { face: 'down' }); if (e) { e.scene = 1; e.noTag = 1; setAnim(e, 'sit'); } }
  M.drawExtra = (cx, cy) => busDrawIn(M, cx, cy); G.maps.bus_pe = M; return M; }
function busDrawIn(M, cx, cy) { const t = G.t, dk = darkness();
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) { const X = x * 16 - cx, Y = y * 16 - cy; if (X < -16 || Y < -16 || X > VW || Y > VH) continue; const tt = M.ter[M.I(x, y)];
    if (tt === T.CARPET) { ctx.fillStyle = y === 4 ? ((x % 2) ? '#5a2a2a' : '#622e2e') : '#3a3a48'; ctx.fillRect(X, Y, 16, 16); } else { ctx.fillStyle = '#d8d4cc'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = '#c8302a'; ctx.fillRect(X, y < 2 ? Y + 12 : Y, 16, 3); } }
  for (const [wy, side] of [[4, 'sea'], [M.h * 16 - 26, 'desert']]) for (let wx = 6; wx < M.w - 3; wx += 2) { const X = Math.round(wx * 16 - 4 - cx), Y = Math.round(wy - cy); if (X > VW || X < -30) continue; ctx.save(); ctx.beginPath(); ctx.rect(X, Y, 26, 20); ctx.clip();
    const g = ctx.createLinearGradient(0, Y, 0, Y + 20); g.addColorStop(0, dk > 0.6 ? '#0a1030' : '#8ac8f0'); g.addColorStop(1, dk > 0.6 ? '#2a2050' : '#f4e0c0'); ctx.fillStyle = g; ctx.fillRect(X, Y, 26, 20);
    const sc = (t * 40 + wx * 26) % 260;
    if (side === 'sea') { ctx.fillStyle = dk > 0.6 ? '#0a2048' : '#2a6ab8'; ctx.fillRect(X, Y + 10, 26, 10); ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let k = 0; k < 3; k++) ctx.fillRect(X + ((k * 11 - sc) % 26 + 26) % 26, Y + 12 + k * 2, 5, 1); ctx.fillStyle = '#e8d4a0'; ctx.fillRect(X, Y + 17, 26, 3); }
    else { ctx.fillStyle = '#d8b880'; for (let k = 0; k < 3; k++) { const hx = ((k * 17 - sc * 0.6) % 40 + 40) % 40 - 8; ctx.beginPath(); ctx.ellipse(X + hx, Y + 18, 12, 9 - k, 0, Math.PI, 0); ctx.fill(); } ctx.fillStyle = '#9a8a7a'; ctx.beginPath(); ctx.moveTo(X, Y + 12); ctx.lineTo(X + 8 - (sc * 0.2) % 8, Y + 4); ctx.lineTo(X + 18, Y + 12); ctx.fill(); if ((wx + Math.floor(t)) % 7 === 0) { ctx.fillStyle = '#3a8a3a'; ctx.fillRect(X + ((20 - sc) % 26 + 26) % 26, Y + 12, 2, 6); } }
    ctx.restore(); ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 2; ctx.strokeRect(X, Y, 26, 20); }
  const sx = Math.round(15 * 16 - cx), sy = Math.round(18 - cy); ctx.fillStyle = '#1a1a24'; ctx.fillRect(sx, sy, 80, 12); jpText(ctx, BUSR.title || '', sx + 3, sy + 1, '#ffd040', 10);
  if (Math.random() < 0.01) G.shake = Math.max(G.shake || 0, 1.5); }
function busBoard(from, dest) { const P = G.P, M = makeBusCabin(); BUSR.from = from; BUSR.dest = dest; BUSR.title = (from === 'trujillo' ? 'TRUJILLO' : 'LIMA') + ' → ' + (dest === 'trujillo' ? 'TRUJILLO' : dest === 'lima_norte' ? 'LIMA NORTE' : 'LIMA');
  if (P.mount) { P.mount = null; calcStats(P); mountBtn(); }
  transition(() => { P.bus = 1; BUSR.end = G.t + 45; P.inside = 'bus_pe'; setMap(M, 4 * 16 + 8, 4 * 16 + 8, 'right'); banner('🚌 ' + BUSR.title, L2('Mira por la ventana: el mar a un lado y el desierto al otro.', 'Look out of the window: the sea on one side and the desert on the other.')); busUI(); }); }
let busEl = null;
function busUI() { const P = G.P; if (!busEl) { busEl = document.createElement('div'); busEl.id = 'busBar'; busEl.className = 'jptbar'; $('#hud').appendChild(busEl); } if (!P.bus) { busEl.hidden = true; return; } busEl.hidden = false; const left = Math.max(0, Math.ceil(BUSR.end - G.t));
  busEl.innerHTML = `<b>🚌 ${esc(BUSR.title)}</b><span>${left > 30 ? L2('Saliendo por la Panamericana Norte', 'Leaving on the North Panamericana') : left > 8 ? '🏜 ' + L2('Llegada en ', 'Arriving in ') + left + ' s' : '🚏 ' + L2('Llegando al terminal…', 'Arriving at the terminal…')}</span><div class="row"><button class="btn sm gold" id="busGo">⏩ ${L2('Llegar ya', 'Arrive now')}</button></div>`; $('#busGo').onclick = () => busArrive(); }
function busArrive() { const P = G.P; if (!P.bus) return; P.bus = 0; busUI(); const d = BUSR.dest; if (d === 'trujillo') goTrujillo(); else trArriveLima(d); }
let busT = 0; V33_TICKS.push(dt => { const P = G.P, M = G.map; if (!P || !P.bus) return; if (!M || !M.busR) { P.bus = 0; busUI(); return; } busT -= dt || 0; if (busT <= 0) { busT = 1; busUI(); } if (G.t >= BUSR.end) busArrive(); });
function goTrujillo() { const P = G.P, M = makeTrujillo(); transition(() => { P.inside = 'trujillo'; setMap(M, (TR_TERM.x + 2) * 16 + 8, (TR_TERM.y + 2) * 16 + 8, 'down'); banner(L2('¡Bienvenido a Trujillo!', 'Welcome to Trujillo!'), L2('La Libertad · Terminal Terrestre', 'La Libertad · Bus Terminal')); markDirty(true); }); }
const TR_LIMA_TERM = { lima: [566, 140], lima_norte: [120, 210] };
function trArriveLima(d) { const P = G.P, M = d === 'lima_norte' ? makeLimaNorte() : makeLima(), at = M.trTerm || TR_LIMA_TERM[d]; transition(() => { P.inside = M.id; setMap(M, at[0] * 16 + 8, (at[1] + 2) * 16 + 8, 'down'); banner(d === 'lima_norte' ? L2('Lima Norte · Plaza Norte', 'North Lima · Plaza Norte') : L2('Lima · La Victoria', 'Lima · La Victoria'), L2('Terminal de buses', 'Bus terminal')); markDirty(true); }); }
XACT.pe_terminal_bus = [L2('🚌 Bus a Trujillo (5.000)', '🚌 Bus to Trujillo (5,000)'), 'run', () => busMenu('lima')];
function trPlaceTerm(M, x, y) { const p = freePxNear(M, x * 16, y * 16, 8) || freePxNear(M, x * 16, y * 16, 16); if (!p) return; const tx = Math.floor(p[0] / 16), ty = Math.floor(p[1] / 16); addObj(M, 'furn', tx, ty, { f: 'tru_bus', fp: [[0, 0], [1, 0], [-1, 0]] }); addObj(M, 'furn', tx, ty + 1, { f: 'lm_vacio', fp: [[0, 0]], solid: false, xact: 'pe_terminal_bus' }); M.trTerm = [tx, ty]; }
{ const _ml = makeLima; makeLima = function () { const had = G.maps.lima, M = _ml.apply(this, arguments); if (!had && M) try { trPlaceTerm(M, TR_LIMA_TERM.lima[0], TR_LIMA_TERM.lima[1]); abDoor(M, 'hogar_pe', 400, 238); } catch (e) { console.warn(e); } return M; }; }
{ const _mn = makeLimaNorte; makeLimaNorte = function () { const had = G.maps.lima_norte, M = _mn.apply(this, arguments); if (!had && M) try { trPlaceTerm(M, TR_LIMA_TERM.lima_norte[0], TR_LIMA_TERM.lima_norte[1]); } catch (e) { console.warn(e); } return M; }; }

// ---------- sandboard en el Cerro Carretas (oficio) ----------
addJob('sandboard', L2('Sandboard', 'Sandboarding'), 'run', L2('Baja las dunas del Cerro Carretas en Salaverry: pasa entre las banderas y esquiva las piedras.', 'Ride down the Cerro Carretas dunes in Salaverry: pass between the flags and dodge the rocks.'),
  { how: [L2('Sube a la cima de la duna (Cerro Carretas, al este de Salaverry) y toca «Bajar la duna». Mantén ◀ o ▶ para girar y pasa entre las banderas.', 'Climb to the top of the dune (Cerro Carretas, east of Salaverry) and tap «Sandboard down». Hold ◀ or ▶ to steer and pass between the flags.'), ''], ben: [L2('Oro. Sello cultural: +0,5 % de daño la primera vez.', 'Gold. Cultural seal: +0.5% damage the first time.'), ''], find: () => ({ loc: TR_DUNA.top, t: L2('Cima del Cerro Carretas', 'Top of Cerro Carretas'), m: 'trujillo' }) },
  [[5, '+10 % de premio', '+10% prize', { sbG: 10 }], [15, '+15 % de premio', '+15% prize', { sbG: 15 }], [30, 'Patrocinador de tablas', 'Board sponsor', { sbG: 25 }]], ['jobx', 'sandboard']);
function trSandboard() { const D = 35000, t0 = performance.now() + 900; let x = 120, vx = 0, L = false, Rr = false, gates = [], rocks = [], pass = 0, hits = 0, done = false, scroll = 0, last = t0, nextG = 0, nextR = 0;
  openModal(`<h2>🏂 ${L2('Sandboard en el Cerro Carretas', 'Sandboarding on Cerro Carretas')}</h2><p class="hint">${L2('Mantén ◀ ▶ para girar. Pasa entre las banderas y esquiva las piedras. 35 segundos.', 'Hold ◀ ▶ to steer. Pass between the flags and dodge the rocks. 35 seconds.')}</p><canvas id="sbc" width="240" height="200" style="width:100%;max-width:360px;border-radius:.5em;touch-action:none"></canvas><div class="row"><button class="btn" id="sbL" style="font-size:1.5em;min-width:3em">◀</button><button class="btn" id="sbR" style="font-size:1.5em;min-width:3em">▶</button></div>`, 'party');
  const cv = $('#sbc'), g = cv.getContext('2d'), hold = (el, set) => { el.onpointerdown = e => { e.preventDefault(); set(true); }; el.onpointerup = el.onpointerleave = el.onpointercancel = () => set(false); };
  hold($('#sbL'), v => L = v); hold($('#sbR'), v => Rr = v); const kd = e => { if (e.code === 'ArrowLeft') L = true; if (e.code === 'ArrowRight') Rr = true; }, ku = e => { if (e.code === 'ArrowLeft') L = false; if (e.code === 'ArrowRight') Rr = false; }; window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
  const loop = now => { if (!document.body.contains(cv)) { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); return; } const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; const run = now > t0 && !done, sp = 70 + Math.min(60, (now - t0) / 500);
    if (run) { vx += ((Rr ? 1 : 0) - (L ? 1 : 0)) * 420 * dt; vx *= 0.9; x = Math.max(12, Math.min(228, x + vx * dt)); scroll += sp * dt;
      if (scroll > nextG) { nextG = scroll + 70 + Math.random() * 40; gates.push({ x: 40 + Math.random() * 160, y: -10, w: 42 }); } if (scroll > nextR) { nextR = scroll + 45 + Math.random() * 50; rocks.push({ x: 15 + Math.random() * 210, y: -10 }); }
      for (const o of gates.concat(rocks)) o.y += sp * dt;
      for (const G_ of gates) if (!G_.done && G_.y > 150) { G_.done = 1; if (Math.abs(x - G_.x) < G_.w / 2) { pass++; sfx('coin'); } }
      for (const r of rocks) if (!r.done && Math.abs(r.y - 156) < 8 && Math.abs(r.x - x) < 10) { r.done = 1; hits++; sfx('hurt'); }
      gates = gates.filter(o => o.y < 220); rocks = rocks.filter(o => o.y < 220); }
    const grd = g.createLinearGradient(0, 0, 0, 200); grd.addColorStop(0, '#f0a050'); grd.addColorStop(0.18, '#e8cfa0'); grd.addColorStop(1, '#d4b480'); g.fillStyle = grd; g.fillRect(0, 0, 240, 200);
    g.fillStyle = 'rgba(150,110,60,0.18)'; for (let k = 0; k < 10; k++) { const yy = ((k * 23 + scroll) % 220) - 10; g.fillRect(0, yy, 240, 2); }
    for (const G_ of gates) { for (const s of [-1, 1]) { const fx = G_.x + s * G_.w / 2; g.fillStyle = '#1a1a1e'; g.fillRect(fx, G_.y - 14, 2, 16); g.fillStyle = s < 0 ? '#e83a3a' : '#3a8ae8'; g.fillRect(fx + 2, G_.y - 14, 8, 6); } }
    for (const r of rocks) { g.fillStyle = '#7a6e62'; g.beginPath(); g.ellipse(r.x, r.y, 8, 5, 0, 0, 7); g.fill(); g.fillStyle = '#9a8e80'; g.fillRect(r.x - 4, r.y - 3, 4, 2); }
    g.save(); g.translate(x, 160); g.rotate(vx / 900); g.fillStyle = '#ff8a3a'; g.fillRect(-12, 2, 24, 5); g.fillStyle = '#2a5ab8'; g.fillRect(-3, -14, 6, 14); g.fillStyle = '#f0c090'; g.beginPath(); g.arc(0, -17, 4, 0, 7); g.fill(); g.restore();
    const left = Math.max(0, Math.ceil((t0 + D - now) / 1000)); g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(64, 2, 112, 14); g.fillStyle = '#ffe08a'; g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; g.fillText(left + ' s · 🚩 ' + pass + ' · 🪨 ' + hits, 120, 13);
    if (!done && now > t0 + D) { done = true; setTimeout(() => { closeModal(); const P = G.P, score = Math.max(0, pass * 2 - hits), gold = Math.round((150 + score * 60) * (1 + jobPerkSum('sbG') / 100)); P.gold += gold; gainJobXp('sandboard', 20 + score * 6); sfx('coin'); banner('🏂 ' + L2('¡Abajo!', 'Down!'), pass + L2(' banderas · ', ' flags · ') + hits + L2(' golpes · +', ' bumps · +') + gold + L2(' de oro', ' gold')); markDirty(); }, 300); }
    requestAnimationFrame(loop); }; requestAnimationFrame(loop); }

// ---------- golf en El Golf ----------
const TR_HOLES = [{ b: [30, 120], h: [205, 40], w: [] }, { b: [30, 40], h: [205, 120], w: [[110, 0, 14, 100]] }, { b: [120, 135], h: [120, 25], w: [[60, 70, 120, 12]] }];
function trGolf() { let hole = 0, strokes = 0, total = 0, phase = 'aim', ang = 0, pow = 0, ball = null, last = performance.now(), done = false;
  openModal(`<h2>⛳ ${L2('Golf · 3 hoyos', 'Golf · 3 holes')}</h2><p class="hint">${L2('Toca una vez para fijar la dirección y otra para la fuerza. Par 3 en cada hoyo.', 'Tap once to set the direction and again for the power. Par 3 each hole.')}</p><canvas id="gfc" width="240" height="160" style="width:100%;max-width:380px;border-radius:.5em;background:#3a8a3a"></canvas><div class="row"><button class="btn gold" id="gfB" style="font-size:1.1em">🏌 ${L2('Apuntar', 'Aim')}</button></div><p class="hint" id="gfS"></p>`, 'party');
  const cv = $('#gfc'), g = cv.getContext('2d'), H = () => TR_HOLES[hole], btn = $('#gfB'), info = () => { $('#gfS').textContent = L2('Hoyo ', 'Hole ') + (hole + 1) + '/3 · ' + L2('golpes ', 'strokes ') + strokes + ' · total ' + total; };
  const reset = () => { ball = { x: H().b[0], y: H().b[1], vx: 0, vy: 0 }; phase = 'aim'; strokes = 0; btn.textContent = '🏌 ' + L2('Apuntar', 'Aim'); info(); }; reset();
  btn.onclick = () => { if (done) return; if (phase === 'aim') { phase = 'pow'; btn.textContent = '💥 ' + L2('¡Golpear!', 'Hit!'); } else if (phase === 'pow') { const p = 40 + pow * 260; ball.vx = Math.cos(ang) * p; ball.vy = Math.sin(ang) * p; strokes++; phase = 'roll'; sfx('hit'); info(); } };
  const loop = now => { if (!document.body.contains(cv)) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; const Hh = H();
    if (phase === 'aim') ang += dt * 1.6; if (phase === 'pow') pow = (Math.sin(now / 260) + 1) / 2;
    if (phase === 'roll') { ball.x += ball.vx * dt; ball.y += ball.vy * dt; const f = Math.pow(0.35, dt); ball.vx *= f; ball.vy *= f; if (ball.x < 4 || ball.x > 236) { ball.vx *= -0.8; ball.x = Math.max(4, Math.min(236, ball.x)); } if (ball.y < 4 || ball.y > 156) { ball.vy *= -0.8; ball.y = Math.max(4, Math.min(156, ball.y)); }
      for (const [wx, wy, ww, wh] of Hh.w) if (ball.x > wx && ball.x < wx + ww && ball.y > wy && ball.y < wy + wh) { const fromL = Math.abs(ball.x - wx) < 6 || Math.abs(ball.x - wx - ww) < 6; if (fromL) ball.vx *= -0.8; else ball.vy *= -0.8; ball.x -= ball.vx * dt * 2; ball.y -= ball.vy * dt * 2; }
      const sp = Math.hypot(ball.vx, ball.vy), dh = Math.hypot(ball.x - Hh.h[0], ball.y - Hh.h[1]);
      if (dh < 7 && sp < 140) { sfx('coin'); total += strokes; toast('⛳ ' + (strokes === 1 ? L2('¡Hoyo en uno!', 'Hole in one!') : strokes <= 3 ? L2('¡Par o mejor!', 'Par or better!') : L2('Dentro', 'In')) + ' · ' + strokes, 'info'); hole++; if (hole >= 3) { done = true; setTimeout(() => { closeModal(); const P = G.P, g2 = Math.max(150, 1500 - (total - 9) * 120); P.gold += g2; if (total <= 12) culGain('golf'); banner('⛳ ' + L2('Fin del recorrido', 'Round over'), total + L2(' golpes · +', ' strokes · +') + g2 + L2(' de oro', ' gold') + (total > 12 ? ' · ' + L2('(12 o menos para el sello)', '(12 or fewer for the seal)') : '')); markDirty(); }, 500); } else reset(); }
      else if (sp < 6) { if (strokes >= 6) { total += 7; toast(L2('Demasiados golpes: 7', 'Too many strokes: 7'), 'warn'); hole++; if (hole >= 3) { done = true; setTimeout(() => { closeModal(); banner('⛳ ' + L2('Fin del recorrido', 'Round over'), total + L2(' golpes', ' strokes')); }, 400); } else reset(); } else { phase = 'aim'; btn.textContent = '🏌 ' + L2('Apuntar', 'Aim'); } } }
    g.fillStyle = '#3a8a3a'; g.fillRect(0, 0, 240, 160); for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; g.fillRect(k * 30, 0, 30, 160); } g.fillStyle = '#6aba5a'; g.beginPath(); g.ellipse(Hh.h[0], Hh.h[1], 26, 18, 0, 0, 7); g.fill();
    g.fillStyle = '#e8d8a0'; for (const [wx, wy, ww, wh] of Hh.w) g.fillRect(wx, wy, ww, wh); g.fillStyle = '#111'; g.beginPath(); g.arc(Hh.h[0], Hh.h[1], 5, 0, 7); g.fill(); g.fillStyle = '#eee'; g.fillRect(Hh.h[0], Hh.h[1] - 20, 1, 20); g.fillStyle = '#e83a3a'; g.fillRect(Hh.h[0] + 1, Hh.h[1] - 20, 8, 5);
    if (phase !== 'roll') { g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(ball.x, ball.y); g.lineTo(ball.x + Math.cos(ang) * 40, ball.y + Math.sin(ang) * 40); g.stroke(); g.setLineDash([]); }
    if (phase === 'pow') { g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(8, 146, 100, 8); g.fillStyle = pow > 0.75 ? '#e83a3a' : '#ffd040'; g.fillRect(8, 146, 100 * pow, 8); }
    g.fillStyle = '#ffffff'; g.beginPath(); g.arc(ball.x, ball.y, 3, 0, 7); g.fill(); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
CUL.sandboard = '🏂 ' + L2('Sandboard', 'Sandboarding'); CUL.golf = '⛳ ' + L2('Golf en Trujillo', 'Golf in Trujillo');

DLG_HOOKS.push((npc, opts) => { const add = (label, icon, fn) => opts.unshift({ label, icon, fn: () => { closeDialog(); fn(); } });
  if (npc.id === 'tr_bus') add('🚌 ' + L2('Comprar pasaje a Lima', 'Buy a ticket to Lima'), ['coin'], () => busMenu('trujillo'));
  if (npc.id === 'tr_golf') add('⛳ ' + L2('Jugar 3 hoyos', 'Play 3 holes'), ['run'], trGolf);
  if (npc.id === 'tr_sandboard') add('🏂 ' + L2('¿Dónde está la cima?', 'Where is the top?'), ['run'], () => { setWp && setWp({ loc: TR_DUNA.top, m: 'trujillo', t: L2('Cima del Cerro Carretas', 'Top of Cerro Carretas') }); toast(L2('Sigue la flecha dorada hasta la cima.', 'Follow the golden arrow to the top.'), 'info'); });
  if (npc.id === 'tr_marinera') add('🤍 ' + L2('Bailar marinera con ella', 'Dance the marinera with her'), ['run'], fsMarinera); });

// ---------- casas para mudarte en otros países ----------
const AB_HOUSES = { hogar_jp: [L2('Casa en Japón', 'House in Japan'), L2('Japón', 'Japan'), 250000, 'japon'], hogar_pe: [L2('Departamento en Miraflores', 'Flat in Miraflores'), 'Lima', 180000, 'lima'], hogar_mx: [L2('Casa en la Ciudad de México', 'House in Mexico City'), L2('México', 'Mexico'), 200000, 'mexico'],
  hogar_es: [L2('Piso en Madrid', 'Flat in Madrid'), L2('España', 'Spain'), 260000, 'espana'], hogar_tru: [L2('Casa en El Golf', 'House in El Golf'), 'Trujillo', 150000, 'trujillo'] };
for (const id in AB_HOUSES) { const [n, town, price] = AB_HOUSES[id]; HOUSES[id] = { n, town, price, abroad: 1 }; }
function abDoor(M, id, x, y) { const p = freePxNear(M, x * 16, y * 16, 6) || freePxNear(M, x * 16, y * 16, 16); if (!p) return; const tx = Math.floor(p[0] / 16), ty = Math.floor(p[1] / 16); addObj(M, 'furn', tx, ty, { f: 'fs_casa', fp: [[0, 0], [1, 0], [-1, 0]] }); addObj(M, 'furn', tx, ty + 1, { f: 'lm_vacio', fp: [[0, 0]], solid: false, xact: 'ab_casa', hid: id }); (M.abDoors = M.abDoors || {})[id] = [tx, ty + 1];
  (FS_POI[M.id] = FS_POI[M.id] || []).push({ c: 'home', x: tx, y: ty, t: AB_HOUSES[id][0] + ' · ' + L2('casa para mudarte', 'a house to move into') }); }
XACT.ab_casa = [o => (isHome(o.hid) ? '🏠 ' + L2('Entrar a tu casa', 'Enter your house') : '🏠 ' + AB_HOUSES[o.hid][0] + ' · ' + AB_HOUSES[o.hid][2].toLocaleString() + L2(' de oro', ' gold')), 'run', o => { const P = G.P, id = o.hid;
  if (!isHome(id)) { openBuyHouse(id); const b = $('#hbuy'); if (b) { const f = b.onclick; b.onclick = () => { f && f(); if (isHome(id)) { P.abRet = { m: G.map.id, x: o.px, y: o.py + 16 }; abEnter(id); } }; } return; }
  P.abRet = { m: G.map.id, x: o.px, y: o.py + 16 }; abEnter(id); }];
function abEnter(id) { const P = G.P, M = makeHome(id); transition(() => { P.inside = id; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 1) * 16 + 10, 'up'); banner(HOUSES[id].n, L2('Tu casa en ', 'Your house in ') + HOUSES[id].town); }); }
{ const _rb = rebuildHome; rebuildHome = function () { const P = G.P; if (P && AB_HOUSES[P.inside] && G.map && G.map.id !== P.inside) return; return _rb.apply(this, arguments); }; }
{ const _ei = exitInterior; exitInterior = function () { const M = G.map, P = G.P; const base = M && (homeBaseOf ? homeBaseOf(M.id) : M.id); if (M && AB_HOUSES[base]) { const R_ = P.abRet && P.abRet.m ? P.abRet : null, mk = { japon: makeJapan, lima: makeLima, mexico: makeMexico, espana: makeEspana, trujillo: makeTrujillo }[R_ ? R_.m : AB_HOUSES[base][3]];
    const D = mk ? mk() : null; if (!D) return _ei.apply(this, arguments); const pos = R_ || (D.abDoors && D.abDoors[base] ? { x: D.abDoors[base][0] * 16 + 8, y: (D.abDoors[base][1] + 1) * 16 + 8 } : { x: D.w * 8, y: D.h * 8 }); transition(() => { P.inside = D.id; setMap(D, pos.x, pos.y, 'down'); }); return; } return _ei.apply(this, arguments); }; }
SAVEKEYS.push('abRet');
{ const _mj = makeJapan; makeJapan = function () { const had = G.maps.japon, M = _mj.apply(this, arguments); if (!had && M) try { abDoor(M, 'hogar_jp', 286, 158); } catch (e) { console.warn(e); } return M; }; }
{ const _b = mxBuild; mxBuild = function (M) { _b.apply(this, arguments); try { abDoor(M, 'hogar_mx', MX_ZOCALO.cx + 34, MX_ZOCALO.cy + 24); } catch (e) { console.warn(e); } }; }
{ const _b = esBuild; esBuild = function (M) { _b.apply(this, arguments); try { abDoor(M, 'hogar_es', 520, 340); } catch (e) { console.warn(e); } }; }
if (typeof MAPC !== 'undefined' && !MAPC.home) MAPC.home = [L2('Casa para mudarte', 'House to move into'), 'House', '#ff8ab0', 'house'];

// ---------- mapas: Trujillo en el mapa de Perú y su mapa propio ----------
const PE_TRU = [52, 103];
if (typeof MAPW_LIST !== 'undefined') MAPW_LIST.push({ id: 'trujillo', n: L2('Trujillo, La Libertad', 'Trujillo, La Libertad'), mk: () => makeTrujillo(), how: L2('Bus interprovincial desde Lima (La Victoria) o Lima Norte (Plaza Norte): 5.000 de oro.', 'Intercity bus from Lima (La Victoria) or North Lima (Plaza Norte): 5,000 gold.') });
{ const _op = otherPOI; otherPOI = function (M) { const out = _op.apply(this, arguments); if (M && M.peru) { out.push({ c: 'pecity', x: PE_TRU[0] * PE_K, y: PE_TRU[1] * PE_K, t: L2('Trujillo (La Libertad) · toca para ver su mapa', 'Trujillo (La Libertad) · tap to see its map') }); return out; }
  if (M && M.id === 'trujillo') out.push({ c: 'pesight', x: TR_PZ.cx, y: TR_PZ.cy, t: L2('Plaza de Armas y Monumento a la Libertad', 'Main Square and Liberty Monument') }, { c: 'pesight', x: TR_PZ.cx, y: TR_PZ.y0 - 4, t: L2('Catedral de Trujillo', 'Trujillo Cathedral') }, { c: 'pesight', x: 420, y: TR_PZ.cy, t: L2('Jirón Pizarro', 'Jirón Pizarro') },
    { c: 'pefun', x: trCoast(TR_HU.pier) - 10, y: TR_HU.pier, t: L2('Muelle de Huanchaco', 'Huanchaco Pier') }, { c: 'pesight', x: 40, y: 60, t: L2('Caballitos de totora', 'Reed boats') }, { c: 'pesight', x: (TR_CC.x0 + TR_CC.x1) >> 1, y: (TR_CC.y0 + TR_CC.y1) >> 1, t: 'Chan Chan' },
    { c: 'pejob', x: TR_GOLF.x0 + 8, y: TR_GOLF.y0 + 8, t: L2('Golf (3 hoyos)', 'Golf (3 holes)') }, { c: 'pesight', x: TR_SV.cx, y: TR_SV.cy, t: L2('Plaza de Salaverry y su glorieta', 'Salaverry square and gazebo') }, { c: 'pejob', x: TR_DUNA.top[0], y: TR_DUNA.top[1], t: L2('Sandboard en el Cerro Carretas (oficio)', 'Sandboarding on Cerro Carretas (job)') },
    { c: 'petrans', x: TR_TERM.x, y: TR_TERM.y, t: L2('Terminal Terrestre (bus a Lima)', 'Bus Terminal (bus to Lima)') });
  if (M && (M.id === 'lima' || M.id === 'lima_norte') && M.trTerm) out.push({ c: 'petrans', x: M.trTerm[0], y: M.trTerm[1], t: L2('Bus interprovincial a Trujillo (5.000)', 'Intercity bus to Trujillo (5,000)') }); return out; }; }
{ const _rm = renderMap; renderMap = function (B) { _rm.apply(this, arguments); const Wd = MAPW_LIST[MAPW]; if (!Wd) return; const cvs = $('#wm'); if (!cvs) return; const x = cvs.getContext('2d');
  if (Wd.id === 'peru') { const sc = cvs.width / PE_MAPM.w, tx = PE_TRU[0] * PE_K * sc, ty = PE_TRU[1] * PE_K * sc; x.fillStyle = '#d8102e'; x.beginPath(); x.moveTo(tx, ty); x.arc(tx, ty - 14, 7, Math.PI * 0.8, Math.PI * 2.2); x.closePath(); x.fill(); x.fillStyle = '#ffffff'; x.beginPath(); x.arc(tx, ty - 14, 2.5, 0, 7); x.fill();
    x.font = `bold ${Math.round(10 + sc * 2.5)}px 'Pixelify Sans', monospace`; x.lineWidth = 4; x.strokeStyle = 'rgba(10,6,4,0.95)'; x.textAlign = 'left'; x.strokeText('TRUJILLO', tx + 9, ty - 12); x.fillStyle = '#ffd23a'; x.fillText('TRUJILLO', tx + 9, ty - 12);
    const prev = cvs.onclick; cvs.onclick = e => { const r = cvs.getBoundingClientRect(), mx = (e.clientX - r.left) * (cvs.width / r.width), my = (e.clientY - r.top) * (cvs.height / r.height); if (Math.hypot(mx - tx, my - (ty - 8)) < 26 + sc * 5 || (mx > tx && mx < tx + 100 && Math.abs(my - ty + 12) < 16)) { const k = MAPW_LIST.findIndex(w => w.id === 'trujillo'); if (k >= 0) { MAPW = k; MAPF = null; renderPanel(); } return; } if (prev) prev(e); };
    const L = $('#mwList'); if (L) { L.insertAdjacentHTML('afterbegin', `<button class="btn gold" id="peGoTru" style="margin:.3em 0">📍 ${L2('Ver el mapa de Trujillo', 'Open the map of Trujillo')}</button>`); $('#peGoTru').onclick = () => { const k = MAPW_LIST.findIndex(w => w.id === 'trujillo'); if (k >= 0) { MAPW = k; MAPF = null; renderPanel(); } }; } return; }
  if (Wd.id === 'trujillo') { const M = G.maps.trujillo; if (!M) return; const sc = cvs.width / M.w; x.textAlign = 'center'; x.font = `bold ${Math.round(8 + sc * 1.6)}px 'Pixelify Sans', monospace`;
    for (const [n, zx, zy] of [[L2('PLAZA DE ARMAS', 'MAIN SQUARE'), TR_PZ.cx, TR_PZ.y0 - 14], ['HUANCHACO', 70, 30], ['CHAN CHAN', 195, 84], ['EL GOLF', 235, 248], ['SALAVERRY', 505, 350], ['CERRO CARRETAS', 690, 250], [L2('TERMINAL', 'TERMINAL'), TR_TERM.x + 3, TR_TERM.y - 8], [L2('OCÉANO PACÍFICO', 'PACIFIC OCEAN'), 120, 425]]) { x.lineWidth = 3; x.strokeStyle = 'rgba(10,6,4,0.95)'; x.strokeText(n, zx * sc, zy * sc); x.fillStyle = '#ffd23a'; x.fillText(n, zx * sc, zy * sc); } } }; }

// ---------- iconos propios de los oficios de los países ----------
const JOBX = {
  futbolista: p => { p.ball(8, 8, 6, 6, [C('#8a8a90'), C('#c8c8d0'), C('#f0f0f4'), C('#ffffff')]); for (const [x, y] of [[8, 8], [5, 5], [11, 5], [5, 11], [11, 11]]) p.rect(x - 1, y - 1, 2, 2, C('#1a1a1e')); },
  folklorico: p => { p.ball(8, 3, 2, 2, [C('#5a3a2a'), C('#8a5a3a'), C('#f0c090'), C('#f0c090')]); p.rect(7, 5, 3, 4, C('#ffffff')); for (let y = 9; y < 15; y++) { const e = y - 8; for (let x = 8 - e - 1; x <= 8 + e; x++) p.set(x, y, C(['#ff4a8a', '#ffd040', '#4ad06a', '#4aa8ff', '#ff8a2a', '#b06aff'][(x + 16) % 6])); } p.line(4, 6, 6, 5, C('#f0c090')); p.line(11, 5, 13, 3, C('#f0c090')); },
  ambulante: p => { p.rect(2, 6, 12, 6, C('#3a8a4a')); p.rect(2, 6, 12, 1, C('#7ad08a')); p.rect(1, 3, 14, 3, C('#ffd040')); p.rect(7, 1, 2, 2, C('#e8e4dc')); p.ball(5, 13, 1.6, 1.6, [C('#1a1a1e'), C('#3a3a40')]); p.ball(11, 13, 1.6, 1.6, [C('#1a1a1e'), C('#3a3a40')]); p.rect(4, 8, 2, 2, C('#ff8a3a')); p.rect(9, 8, 2, 2, C('#e8d890')); },
  chofer: p => { p.rect(1, 4, 14, 8, C('#e8e4dc')); p.rect(1, 9, 14, 2, C('#2a6ab8')); for (let x = 2; x < 13; x += 4) p.rect(x, 5, 3, 3, C('#3a5068')); p.ball(4, 13, 1.6, 1.6, [C('#1a1a1e'), C('#3a3a40')]); p.ball(12, 13, 1.6, 1.6, [C('#1a1a1e'), C('#3a3a40')]); },
  mototaxi: p => { p.rect(3, 4, 10, 7, C('#c8302a')); p.rect(4, 5, 8, 3, C('#3a5068')); p.rect(1, 6, 3, 2, C('#ffd040')); p.ball(4, 13, 1.8, 1.8, [C('#1a1a1e'), C('#3a3a40')]); p.ball(12, 13, 1.8, 1.8, [C('#1a1a1e'), C('#3a3a40')]); p.ball(8, 13, 1.4, 1.4, [C('#1a1a1e'), C('#3a3a40')]); },
  cajero: p => { p.rect(2, 7, 12, 7, C('#5a5e6a')); p.rect(3, 8, 10, 2, C('#8a909c')); p.rect(4, 3, 8, 4, C('#3a3e48')); p.rect(5, 4, 6, 2, C('#7ae07a')); p.rect(5, 11, 6, 2, C('#ffd040')); },
  taquero: p => { for (let x = 2; x < 15; x++) { const y = 10 - Math.round(Math.sin((x - 2) / 12 * Math.PI) * 5); p.set(x, y, C('#e8c070')); p.set(x, y + 1, C('#d0a050')); } p.rect(4, 8, 8, 3, C('#c8602a')); p.rect(5, 7, 2, 1, C('#4ac04a')); p.rect(9, 7, 2, 1, C('#ffffff')); p.rect(7, 8, 2, 1, C('#e83a3a')); },
  taxista: p => { p.ball(8, 8, 7, 4.5, [C('#c8c4bc'), C('#e8e4dc'), C('#f4f0e8'), C('#ffffff')]); p.rect(5, 5, 6, 2, C('#3a5068')); p.ball(4, 12, 1.6, 1.6, [C('#1a1a1e'), C('#3a3a40')]); p.ball(12, 12, 1.6, 1.6, [C('#1a1a1e'), C('#3a3a40')]); p.rect(7, 2, 2, 2, C('#ffd040')); },
  sandboard: p => { for (let k = 0; k < 10; k++) p.set(3 + k, 12 - Math.round(k * 0.6), C('#ff8a3a')); for (let k = 0; k < 10; k++) p.set(3 + k, 13 - Math.round(k * 0.6), C('#c86a2a')); p.ball(9, 3, 1.6, 1.6, [C('#f0c090'), C('#f0c090')]); p.rect(8, 5, 2, 4, C('#2a5ab8')); p.line(6, 6, 12, 5, C('#2a5ab8')); p.rect(2, 14, 12, 1, C('#d8b880')); },
  rickshaw: p => { p.ball(10, 11, 3, 3, [C('#1a1a1e'), C('#3a3a40'), C('#8a8a90')]); p.rect(6, 4, 8, 6, C('#c8302a')); p.rect(6, 3, 8, 1, C('#1a1a1e')); p.line(2, 11, 7, 9, C('#6a4022')); } };
for (const k in JOBX) UI_ICONS.push('jobx:' + k);
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] === 'jobx' && JOBX[spec[1]]) { const p = new Pix(16, 16); JOBX[spec[1]](p); p.outline(OUTL); return p; } return _gi.apply(this, arguments); }; }
for (const k in JOBX) if (JOBS[k]) JOB_IC[k] = ['jobx', k];
// el panel de oficios ponía [icono, 2] (que no existe para estos) y salía un trozo de la hoja de iconos
{ const _rj = renderJobs; renderJobs = function (B) { _rj.apply(this, arguments); const keys = Object.keys(JOBS), cards = B.querySelectorAll('.job'); cards.forEach((el, i) => { const k = keys[i]; if (!k) return; const nx = el.querySelector('.nx'), GD = JOB_GUIDE[k]; if (nx && /posadas/.test(nx.textContent) && k !== 'cocina' && GD && GD.find) { try { const f = GD.find(); if (f && f.t) nx.textContent = '📍 ' + f.t; } catch (e) { } } const D = JOBS[k], cur = D.icon === 'herb' ? 'herb:1' : D.icon === 'potion' ? 'potion:#c040e0' : D.icon === 'food' ? 'food:2' : D.icon === 'anvil' ? 'anvil' : D.icon + ':2'; if (ICON.keys[cur] !== undefined && !JOBX[k]) return; const spec = JOB_IC[k] || jobIc(k); const ic = el.querySelector('.ico'); if (ic && ICON.keys[iconKey(spec)] !== undefined) ic.outerHTML = iconHTML(spec, 36); }); }; }

// ---------- Lupa › Sistemas ----------
if (typeof GSIS !== 'undefined') { GSIS.unshift(['trujillo', '🏜 ' + L2('Trujillo (La Libertad, Perú)', 'Trujillo (La Libertad, Peru)'), () => [
  L2('Bus interprovincial desde Lima (La Victoria, junto a Gamarra) o Lima Norte (Plaza Norte): 5.000 de oro. Vas sentado en el bus y ves el mar y el desierto por la ventana (o «Llegar ya»).', 'Intercity bus from Lima (La Victoria, by Gamarra) or North Lima (Plaza Norte): 5,000 gold. You sit on the bus and see the sea and the desert through the window (or «Arrive now»).'),
  L2('Centro Histórico: Plaza de Armas con la catedral amarilla, el Monumento a la Libertad, palmeras y casonas de colores con rejas; Jirón Pizarro peatonal. Huanchaco: playa, muelle y caballitos de totora. Chan Chan: murallas de adobe con relieves. El Golf: casas con jardín y campo de golf (3 hoyos). Salaverry: plaza con glorieta, pérgola azul, iglesia y puerto.', 'Historic Centre: Main Square with the yellow cathedral, the Liberty Monument, palms and colourful mansions with grilles; pedestrian Jirón Pizarro. Huanchaco: beach, pier and reed boats. Chan Chan: adobe walls with reliefs. El Golf: houses with gardens and a golf course (3 holes). Salaverry: square with a gazebo, blue pergola, church and port.'),
  L2('Oficio de sandboard: sube a la cima del Cerro Carretas (dunas al este de Salaverry) y baja pasando entre las banderas. Golf y sandboard dan sello cultural (+0,5 % de daño).', 'Sandboarding job: climb to the top of Cerro Carretas (dunes east of Salaverry) and ride down between the flags. Golf and sandboarding give a cultural seal (+0.5% damage).'),
  L2('Casas para mudarte: Japón (250.000), Departamento en Miraflores, Lima (180.000), Ciudad de México (200.000), Piso en Madrid (260.000) y Casa en El Golf, Trujillo (150.000). Funcionan como tu casa de siempre: dormir, baúl, armario y decorar.', 'Houses to move into: Japan (250,000), Miraflores flat, Lima (180,000), Mexico City (200,000), Madrid flat (260,000) and El Golf house, Trujillo (150,000). They work like your usual house: sleep, chest, wardrobe and decorating.')],
  () => G.P && G.P.map === 'trujillo' ? { loc: [TR_PZ.cx, TR_PZ.cy], t: L2('Plaza de Armas', 'Main Square'), m: 'trujillo' } : { loc: TR_LIMA_TERM.lima, t: L2('Bus a Trujillo', 'Bus to Trujillo'), m: 'lima' }]); }

// ---------- habilidades finales revisadas (5.21) ----------
// Medido contra un muñeco (tools: daño real ÷ ataque): las de un golpe hacen lo que dicen. Fallos encontrados:
// · 'skyfall' con n > 1 (Lluvia de Runas del mago: 3 runas; Tormenta de Plumas del arquero: 4 ráfagas) solo caía una vez.
// · Lluvia del Fénix (arquero) repartía 16 flechas en 160 px: a un solo enemigo le daban 2 (906 % en vez de ~7.000 %).
{ const _ce = castExtra; castExtra = function (id, r, mult, e, tgt, ang) { const ok = _ce.apply(this, arguments); if (ok && e && e.k === 'skyfall' && (e.n || 1) > 1) { const P = G.P, atk = P.S.atk;
    for (let i = 1; i < e.n; i++) delayAct(0.35 * i, () => { const T = tgt && !tgt.dying ? tgt : nearestMob(P.x, P.y, 200), cx = (T ? T.x : P.x + Math.cos(ang) * 50) + (Math.random() - 0.5) * e.r * 0.5, cy = (T ? T.y : P.y + Math.sin(ang) * 36) + (Math.random() - 0.5) * e.r * 0.4;
      addFx({ type: 'field', ground: true, x: cx, y: cy, r: e.r, dur: 0.6, col: e.col || '#ffe08a' }); delayAct(0.6, () => { hitCircle(cx, cy, e.r, atk * mult, { stun: 0.5 }); addFx({ type: 'ring', x: cx, y: cy, r: e.r * 1.2, dur: 0.5, col: e.col || '#ffd040' }); addFx({ type: 'bolt', x: cx, y: cy - 240, x2: cx, y2: cy, dur: 0.4, col: '#ffffff' }); sfx('boom'); }); }); } return ok; }; }
if (SK.a19 && SK.a19.eff) SK.a19.eff.area = 42;
