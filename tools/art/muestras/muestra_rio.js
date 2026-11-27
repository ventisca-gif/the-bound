// MUESTRA TEMPORAL (no se publica): Río de Janeiro con el motor del juego. Dos escenas en un mapa de prueba:
//  · izquierda: la cima del Corcovado con el Cristo Redentor (brazos abiertos, pedestal art déco) y el mirador sobre la
//    bahía de Guanabara con el Pan de Azúcar y su teleférico;
//  · derecha: Copacabana: edificios frente al mar (sólidos), la avenida Atlântica, el paseo de ondas blancas y negras,
//    la playa con sombrillas y quioscos, y el mar con espuma.
// Se fotografía con: python3 tools/art/muestras/rio.py file://$PWD/dist/test.html salida.png
const RIO_S = { w: 72, h: 40, split: 30, bld: 6, ave: 12, cal: 15, sand: 18, sea: 30 };
function rioMuestra() {
  const id = 'muestra_rio', { w, h } = RIO_S, N = w * h; G.ents = G.ents.filter(e => e.map !== id);
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.SAND), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I: (x, y) => y * w + x };
  const R = RIO_S;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x;
    if (x < R.split) { M.ter[i] = y < 3 ? T.IWALL : y < 24 ? (Math.hypot(x - 15, y - 14) < 9 ? T.STONE : T.GRASS) : T.IWALL; }   // cima, pedestal sólido, mirador al sur
    else M.ter[i] = y < R.ave ? T.IWALL : y < R.cal ? T.COBBLE : y < R.sand ? T.FLOOR : y < R.sea ? T.SAND : y < R.sea + 2 ? T.WATER : T.DEEP; }
  M.exit = { x: -9, y: -9 }; initMapObjs(M);
  for (let y = 12; y <= 14; y++) for (let x = 13; x <= 17; x++) M.solidO[y * w + x] = 1;   // pedestal del Cristo (sólido, sin cambiar la piedra)
  const put = (k, x, y, o) => { if (canPlace(M, x, y)) addObj(M, k, x, y, o || {}); };
  for (let x = R.split + 3; x < w - 2; x += 6) put('tree', x, R.cal - 1, { sp: 'palma', deco: true });
  for (let x = R.split + 6; x < w - 3; x += 13) put('stall', x, R.sand + 1, { col: ['#2a9a5a', '#f0c020', '#2a6ad0'][(x / 13 | 0) % 3], fp: [[0, 0], [1, 0], [-1, 0]] });
  for (const [x, y] of [[6, 6], [24, 6], [5, 18], [25, 18]]) put('tree', x, y, { sp: 'cerezo', deco: true });
  M.drawExtra = (cx, cy) => rioGround(M, cx, cy);
  G.maps[id] = M; return M; }
function rioGround(M, cx, cy) { const R = RIO_S, S = 16, px = R.split * S;
  const box = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x - cx), Math.round(y - cy), w, h); };
  // ===== Corcovado: borde del mirador y bahía abajo
  const my = 24 * S; box(0, my, px, M.h * S - my, '#2a7ab8'); for (let k = 0; k < 40; k++) box((k * 37) % px, my + 20 + (k * 23) % 180, 10, 1, 'rgba(255,255,255,.35)');
  // Pan de Azúcar y Morro da Urca en la bahía, con el teleférico
  const dome = (x, y, rx, ry, c, c2) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x - cx, y - cy, rx, ry, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(x - cx + rx * 0.25, y - cy, rx * 0.55, ry * 0.92, 0, Math.PI, 0); ctx.fill(); };
  dome(330, my + 130, 62, 108, '#5a6a50', '#6e7e62'); dome(170, my + 132, 54, 52, '#4e6248', '#5e7258');
  for (let k = 0; k < 18; k++) box(290 + (k * 13) % 80, my + 50 + (k * 17) % 70, 3, 2, '#3e7a3a');
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(170 - cx, my + 84 - cy); ctx.lineTo(330 - cx, my + 26 - cy); ctx.stroke();
  const t = (G.t * 0.07) % 1; box(170 + 160 * t - 4, my + 84 - 58 * t, 8, 6, '#e8402a'); box(170 + 160 * t - 4, my + 84 - 58 * t, 8, 2, '#ffd0c0');
  // baranda del mirador
  box(0, my - 6, px, 3, '#d8d0c0'); for (let x = 4; x < px; x += 10) box(x, my - 12, 2, 9, '#b8b0a0'); box(0, my - 13, px, 2, '#e8e0d0');
  // Cristo Redentor (pixel art, piedra jabón gris verdosa con luz por la izquierda) sobre su pedestal art déco
  const cxs = 15 * S + 8, base = 14 * S + 14, L0 = '#f0f2ea', L1 = '#d8dccf', L2c = '#bcc2b2', L3 = '#9aa290', L4 = '#7c8474';
  box(cxs - 30, base - 2, 60, 6, L3); box(cxs - 26, base - 6, 52, 4, L2c);                                                                  // escalinata
  box(cxs - 20, base - 40, 40, 34, L2c); box(cxs - 20, base - 40, 6, 34, L1); box(cxs + 14, base - 40, 6, 34, L3);                           // pedestal
  for (let k = 0; k < 5; k++) box(cxs - 12 + k * 6, base - 36, 2, 26, L3); box(cxs - 24, base - 44, 48, 4, L1); box(cxs - 24, base - 40, 48, 1, L4);
  const ft = base - 44;                                                                                                                       // pies de la estatua
  for (let y = 0; y < 86; y++) { const hw = Math.round(7 + (86 - y) * 0.06 + (y > 60 ? (y - 60) * 0.18 : 0)), yy = ft - y;               // túnica que se abre abajo
    box(cxs - hw, yy, hw * 2, 1, L1); box(cxs - hw, yy, 2, 1, L0); box(cxs + hw - 3, yy, 3, 1, L3); if (y % 9 < 2 && y < 60) box(cxs - 2, yy, 1, 1, L3); }
  for (let k = -2; k <= 2; k++) box(cxs + k * 3, ft - 30, 1, 30, k > 0 ? L3 : L2c);                                                         // pliegues bajos
  const sh = ft - 86;                                                                                                                         // hombros y brazos abiertos con mangas que cuelgan
  box(cxs - 52, sh, 104, 6, L1); box(cxs - 52, sh, 104, 2, L0); box(cxs - 52, sh + 5, 104, 1, L3);
  for (const sg of [-1, 1]) { for (let k = 0; k < 30; k++) { const x = cxs + sg * (12 + k), dr = Math.round(6 + k * 0.28); box(x, sh + 6, 1, dr, sg < 0 ? L2c : L3); }
    box(cxs + sg * 52 - (sg > 0 ? 4 : 0), sh - 1, 4, 8, L0); }
  box(cxs - 3, sh - 4, 6, 4, L2c);                                                                                                            // cuello
  box(cxs - 6, sh - 17, 12, 13, L1); box(cxs - 6, sh - 17, 3, 13, L0); box(cxs + 3, sh - 17, 3, 13, L3);                                     // cabeza
  box(cxs - 7, sh - 19, 14, 5, L2c); box(cxs - 7, sh - 14, 2, 9, L2c); box(cxs + 5, sh - 14, 2, 9, L3);                                      // pelo
  box(cxs - 3, sh - 11, 2, 1, L4); box(cxs + 1, sh - 11, 2, 1, L4); box(cxs - 1, sh - 8, 2, 2, L3);                                          // rostro sereno
  // ===== Copacabana: fachadas frente al mar (encima de las casillas sólidas)
  for (let k = 0; k < 9; k++) { const x0 = px + k * 74 + 4, hh = R.ave * S - 4 - (k % 3) * 10, col = ['#f0e6d0', '#e8d4b8', '#d8e4ea', '#f4ece0', '#e0d0c0'][k % 5];
    box(x0, R.ave * S - hh, 68, hh, col); box(x0 + 60, R.ave * S - hh, 8, hh, 'rgba(0,0,0,.08)');
    for (let wy = R.ave * S - hh + 8; wy < R.ave * S - 22; wy += 12) for (let wx = x0 + 6; wx < x0 + 56; wx += 10) { box(wx, wy, 6, 6, (wx + wy) % 3 ? '#5a8ab0' : '#8ab8d8'); box(wx, wy + 6, 6, 1, '#ffffff'); }
    box(x0 + 26, R.ave * S - 18, 16, 18, '#6a4a2a'); box(x0 + 2, R.ave * S - 22, 64, 3, ['#e83a3a', '#2a9a5a', '#2a6ad0'][k % 3]); }
  // avenida Atlântica
  box(px, R.ave * S, M.w * S - px, 3 * S, '#4a4a50'); for (let x = px; x < M.w * S; x += 40) box(x, (R.ave + 1.5) * S, 20, 2, '#f0f0f0');
  // calçadão: ondas blancas y negras
  const y0 = R.cal * S; box(px, y0, M.w * S - px, 3 * S, '#f4f2ee');
  for (let x = px; x < M.w * S; x += 2) for (const b of [0, 1, 2]) { const yy = y0 + 6 + b * 15 + Math.sin(x / 16 + b * 1.3) * 5; box(x, yy, 2, 5, '#1e1e22'); }
  // sombrillas y toallas en la arena
  for (let k = 0; k < 12; k++) { const x = px + 30 + (k * 97) % (M.w * S - px - 40), y = (R.sand + 3 + (k * 7) % 7) * S, c = ['#e83a3a', '#f0c020', '#2a9a5a', '#2a6ad0', '#ff6ab0'][k % 5];
    box(x - 10, y + 6, 14, 6, ['#ffffff', '#ffd040', '#5ac8ff'][k % 3]); box(x, y - 2, 1, 14, '#7a5a3a'); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - 13 - cx, y - cy); ctx.quadraticCurveTo(x - cx, y - 13 - cy, x + 13 - cx, y - cy); ctx.closePath(); ctx.fill(); box(x - 1, y - 10, 3, 2, '#ffffff'); }
  // espuma de las olas
  const sy = R.sea * S; for (let x = px; x < M.w * S; x += 8) { const yy = sy + Math.sin(x / 30 + G.t * 2) * 3; box(x, yy - 2, 8, 3, 'rgba(255,255,255,.85)'); } }
// gente con el motor (bañistas, vendedores, turistas en el mirador)
function rioGente(M) { const looks = [['f', 'castano', ['#e83a5a', '#f05a7a', '#f88aa0', '#ffb0c0', '#ffd0dc']], ['m', 'negro', ['#1a6ad0', '#2a84e0', '#4a9af0', '#7ab8f8', '#a8d4ff']], ['f', 'negro', ['#f0c020', '#f8d040', '#ffe070', '#fff0a0', '#fff8d0']], ['m', 'castano', ['#2a9a5a', '#3ab46a', '#5aca84', '#84dca4', '#b0ecc4']], ['f', 'rubio', ['#ff8a3a', '#ffa05a', '#ffb87a', '#ffd0a0', '#ffe4c4']], ['m', 'rubio', ['#f4f4f4', '#e8e8e8', '#d8d8d8', '#c8c8c8', '#b8b8b8']]];
  const names = ['Carioca', 'Vendedora de acaí', 'Surfista', 'Paseante', 'Turista', 'Futbolista de playa'];
  for (let i = 0; i < 30; i++) { const L = looks[i % looks.length], idn = 'rio_smp' + i; NPCS[idn] = { n: names[i % 6], title: 'Río', look: LK({ g: L[0], hairStyle: L[0] === 'f' ? 'long' : 'short', hair: HAIRS[L[1]] || HAIRS.negro, main: pal(L[2]) }), lines: ['Oi!'], quests: [] };
    const beach = i >= 8, x = beach ? (RIO_S.split + 2 + (i * 37) % (RIO_S.w - RIO_S.split - 4)) * 16 : (8 + (i * 5) % 15) * 16, y = beach ? ((i % 3 === 0 ? RIO_S.cal + 1 : RIO_S.sand + 2 + (i * 5) % 8)) * 16 : (13 + (i * 3) % 8) * 16;
    spawnNPC(idn, x, y, M.id, { face: ['down', 'left', 'right', 'up'][i % 4], wander: 2 }); } }
