// 6.25 · Bajo cubierta del Going Merry (Sergio: «que el barco actual podamos entrar abajo para cocina y demás …
// mira estas 3 imágenes» + «usa los sprites existentes para guiarte»). Mapa interior 'merry_bajo' como la armería de
// Loguetown y La Tortuga Glotona: se baja desde el menú del barco (Hablar con la tripulación) y la escalera te devuelve
// al timón donde estabas. Tres zonas según sus referencias:
//   · Cocina (imágenes 2 y 3): fogón blanco con campana, fregadero con azulejos, nevera con caja de manzanas, barra y
//     suelo de cuadros blanco y negro; mesita con mantel de cuadros rojos y banco.
//   · Comedor (imagen 2): mesa con mantel verde, sillas crema de respaldo redondo y el mástil redondo con aro de latón.
//   · Salita y bodega (imágenes 1 y 2): sofá verde, escalera de mano, armario con botellas, cajas, barriles y la
//     cabeza de carnero del Merry (imagen 3). Ojos de buey con mar en las paredes y lámparas de pared.
// Muebles dibujados con Pix como los de La Tortuga (tgX, paletas TGP); se registran en XSPR (genFurn2).
const MB_W = 28, MB_H = 15, MB_NAME = L2('Going Merry · bajo cubierta', 'Going Merry · below deck');
const MBP = {
  esmalte: pal(['#8a8478', '#b8b2a4', '#ddd8ca', '#f0ece0', '#ffffff']),
  verde: pal(['#1e4a36', '#2e6a4e', '#4a9a74', '#6cc49a', '#a8e8c8']),
  crema: pal(['#8a6a3a', '#b8945a', '#dcc08a', '#f0dcae', '#fff4d4']),
  rojo: pal(['#6a1414', '#a02424', '#d03a3a', '#ec6a6a', '#ffb0a8']),
  laton: pal(['#6a4a10', '#9a7020', '#c89a30', '#ecc85a', '#fff0a0'])
};
const mbX = (w, h, ax, ay, fn) => () => { const p = new Pix(w, h); fn(p); p.outline(OUTL); return { c: p.canvas(), ax, ay }; };
const MW = () => TGP.madera, ME = () => MBP.esmalte;
// cocina
XSPR.mb_fogon = mbX(34, 46, 17, 44, p => { const E = ME(), A = TGP.acero;
  p.rect(5, 0, 24, 9, A[2]); p.hl(5, 0, 24, A[4]); p.rect(9, 9, 16, 4, A[1]);                 // campana
  p.rect(1, 18, 32, 26, E[3]); p.hl(1, 18, 32, E[4]); p.rect(1, 18, 32, 4, A[3]);              // cuerpo esmaltado y placa
  for (const x of [6, 18]) { p.ell(x + 4, 20, 3, 1.4, C('#1a1a1e')); }
  p.rect(5, 26, 24, 12, E[2]); p.rect(7, 28, 20, 8, C('#2a2a30')); p.hl(8, 31, 18, C('#ff8a3a')); p.hl(5, 26, 24, A[2]);   // horno
  for (let x = 6; x < 30; x += 6) p.set(x, 24, A[1]);
  p.ball(10, 15, 4, 3, pal(['#3a6a8a', '#5a9ac0', '#8acae8', '#dff4ff'])); p.hl(13, 13, 3, A[2]);   // tetera
});
XSPR.mb_fregadero = mbX(34, 34, 17, 32, p => { const E = ME();
  for (let y = 0; y < 12; y++) for (let x = 1; x < 33; x++) p.set(x, y, (Math.floor(x / 4) + Math.floor(y / 4)) % 2 ? E[3] : C('#cfe4e8'));   // azulejos
  p.rect(1, 12, 32, 20, MW()[2]); p.hl(1, 12, 32, E[4]); p.rect(1, 13, 32, 3, E[3]);
  p.rect(6, 13, 14, 3, TGP.acero[1]); p.vl(13, 6, 7, TGP.acero[3]); p.hl(13, 6, 4, TGP.acero[3]);    // pila y grifo
  for (const x of [5, 18]) p.rect(x, 19, 11, 11, MW()[3]); for (const x of [10, 23]) p.set(x, 24, MBP.laton[3]);
  p.ball(26, 9, 3, 2, MBP.rojo.slice(1)); });
XSPR.mb_nevera = mbX(22, 46, 11, 44, p => { const E = ME();
  p.rect(2, 12, 18, 32, E[3]); p.vl(2, 12, 32, E[4]); p.vl(19, 12, 32, E[1]); p.hl(2, 24, 18, E[1]);
  p.rect(16, 15, 2, 6, TGP.acero[1]); p.rect(16, 27, 2, 9, TGP.acero[1]);
  p.rect(3, 6, 16, 6, MW()[3]); p.hl(3, 6, 16, MW()[4]); for (const x of [5, 9, 13, 16]) p.ball(x, 5, 2, 2, MBP.rojo.slice(1)); });   // caja de manzanas
XSPR.mb_barra = mbX(52, 26, 26, 24, p => { const E = ME();
  p.rect(1, 6, 50, 18, MW()[2]); for (let x = 4; x < 50; x += 8) p.vl(x, 11, 12, MW()[1]); p.hl(1, 23, 50, MW()[0]);
  p.rect(0, 3, 52, 4, E[3]); p.hl(0, 3, 52, E[4]); p.ell(12, 3, 4, 1.4, C('#d8c8a0')); p.rect(30, 1, 6, 2, C('#d84a4a')); p.ell(42, 2, 3, 1.4, C('#e8e0b8')); });
XSPR.mb_mesa_cuadros = mbX(40, 34, 20, 32, p => { const R = MBP.rojo, W = MW();
  for (const x of [8, 31]) p.rect(x, 18, 2, 10, W[1]);
  for (let y = 6; y < 18; y++) for (let x = 2; x < 38; x++) p.set(x, y, (Math.floor(x / 3) + Math.floor(y / 3)) % 2 ? R[2] : C('#fff4ec'));
  p.hl(2, 17, 36, R[1]); p.ell(20, 9, 4, 1.6, C('#f4f0e4')); p.set(20, 8, C('#c84a2a'));
  p.rect(4, 27, 32, 4, W[3]); p.hl(4, 27, 32, W[4]); for (const x of [6, 33]) p.rect(x, 31, 2, 3, W[1]); });   // banco
// comedor
XSPR.mb_mesa_verde = mbX(56, 34, 28, 30, p => { const V = MBP.verde, W = MW();
  for (const x of [8, 46]) p.rect(x, 22, 3, 10, W[1]);
  p.ell(28, 12, 26, 10, V[2]); p.ell(28, 11, 25, 9, V[3]); p.ell(22, 8, 10, 3, V[4]);
  p.rect(3, 12, 50, 10, V[2]); p.hl(3, 21, 50, V[1]); for (let x = 6; x < 52; x += 7) p.vl(x, 16, 5, V[1]);
  p.ell(18, 10, 4, 1.6, C('#f4f0e4')); p.ell(38, 11, 4, 1.6, C('#f4f0e4')); p.ball(28, 9, 3, 2, pal(['#8a4a1a', '#c07030', '#e8a050', '#ffe0a0'])); });   // platos y carne
XSPR.mb_silla = mbX(14, 22, 7, 20, p => { const K = MBP.crema;
  p.ell(7, 6, 6, 6, K[2]); p.ell(7, 5, 5, 5, K[3]); p.ell(5, 3, 2, 2, K[4]); p.rect(2, 11, 10, 4, K[2]); p.hl(2, 11, 10, K[4]);
  for (const x of [3, 10]) p.vl(x, 15, 6, MW()[1]); });
XSPR.mb_mastil = mbX(20, 52, 10, 50, p => { const W = MW(), L = MBP.laton;
  p.rect(4, 0, 12, 48, W[2]); p.vl(4, 0, 48, W[1]); p.vl(15, 0, 48, W[1]); p.vl(8, 0, 48, W[3]);
  for (const y of [14, 15, 34, 35]) p.hl(3, y, 14, L[y % 2 ? 2 : 3]); p.rect(2, 46, 16, 5, W[1]); p.hl(2, 46, 16, W[3]);
  p.ball(10, 24, 3, 3, pal(['#a06010', '#e0a020', '#fff080', '#ffffff'])); });   // lámpara del mástil
XSPR.mb_carnero = mbX(22, 40, 11, 38, p => { const W = MW();
  p.vl(10, 16, 20, W[2]); p.vl(11, 16, 20, W[3]); p.rect(4, 35, 14, 4, W[1]);
  p.ball(11, 9, 6, 6, pal(['#c8c0b0', '#e4ded2', '#f6f2ea', '#ffffff'])); p.rect(8, 9, 6, 5, C('#f4e8d8'));
  for (const s of [-1, 1]) { const x = 11 + s * 6; p.ball(x, 8, 3, 3, MBP.crema.slice(1)); p.set(x, 8, MBP.crema[0]); }   // cuernos en espiral
  p.set(9, 10, C('#1a1a1e')); p.set(13, 10, C('#1a1a1e')); });
// salita y bodega
XSPR.mb_sofa = mbX(52, 26, 26, 24, p => { const V = MBP.verde;
  p.rect(3, 2, 46, 10, V[2]); p.hl(3, 2, 46, V[4]); for (let x = 9; x < 46; x += 8) p.vl(x, 4, 7, V[1]);
  p.rect(1, 11, 50, 9, V[2]); p.hl(1, 11, 50, V[3]); p.rect(1, 3, 5, 17, V[1]); p.rect(46, 3, 5, 17, V[1]); p.hl(1, 20, 50, MW()[1]);
  for (const x of [4, 47]) p.rect(x, 21, 2, 3, MW()[0]); });
XSPR.mb_escalera = mbX(22, 50, 11, 48, p => { const W = MW();
  p.vl(4, 0, 48, W[2]); p.vl(5, 0, 48, W[3]); p.vl(16, 0, 48, W[2]); p.vl(17, 0, 48, W[3]);
  for (let y = 4; y < 46; y += 6) { p.hl(4, y, 14, W[3]); p.hl(4, y + 1, 14, W[1]); }
  p.rect(1, 0, 20, 3, C('#f4e0a0')); p.hl(1, 3, 20, W[0]); });   // luz de la escotilla
XSPR.mb_armario = mbX(36, 46, 18, 44, p => { const W = MW();
  p.rect(1, 2, 34, 42, W[1]); p.rect(3, 4, 30, 18, W[3]); for (const y of [12]) p.hl(3, y, 30, W[1]);
  for (let k = 0; k < 8; k++) { const x = 5 + (k % 4) * 7, y = k < 4 ? 5 : 13, c = [C('#2a6a2a'), C('#8a2a1a'), C('#c89a30'), C('#3a4a8a')][k % 4]; p.rect(x, y + 2, 3, 5, c); p.rect(x + 1, y, 1, 2, c); }
  p.rect(3, 24, 14, 18, W[2]); p.rect(19, 24, 14, 18, W[2]); p.set(15, 33, MBP.laton[3]); p.set(20, 33, MBP.laton[3]); p.hl(1, 2, 34, W[4]); });
XSPR.mb_cajas = mbX(40, 36, 20, 34, p => { const W = MW();
  const box = (x, y, w, h) => { p.rect(x, y, w, h, W[3]); p.rect(x, y, w, 2, W[4]); p.line(x + 1, y + 2, x + w - 2, y + h - 2, W[2]); p.rect(x, y, 1, h, W[1]); p.rect(x + w - 1, y, 1, h, W[1]); p.hl(x, y + h - 1, w, W[1]); };
  box(2, 16, 18, 18); box(20, 20, 18, 14); box(8, 2, 16, 14); p.rect(12, 6, 8, 2, C('#2a2a30')); });
XSPR.mb_puerta_sube = mbX(36, 12, 18, 10, p => { p.rect(1, 2, 34, 8, C('#f4e0a0')); p.hl(1, 2, 34, C('#fff4c8')); });

function mbTile(x, y) {
  if (x <= 0 || x >= MB_W - 1 || y >= MB_H - 1) return 'rim';
  if (y <= 2) return 'wall';
  if (x <= 8) return 'kitchen';
  return 'floor';
}
function makeMerryBajo() {
  if (G.maps.merry_bajo) return G.maps.merry_bajo;
  const w = MB_W, h = MB_H, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'merry_bajo', w, h, I, ter: new Uint8Array(N), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', camps: [], exit: { x: -9, y: -9 }, hudName: MB_NAME, merryBajo: 1 };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = mbTile(x, y); M.ter[I(x, y)] = t === 'rim' || t === 'wall' ? T.IWALL : T.FLOOR; }
  prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  // cocina
  F('mb_nevera', 1, 3); F('mb_fogon', 3, 3, [[0, 0], [1, 0]]); F('mb_fregadero', 6, 3, [[0, 0], [1, 0]]);
  F('mb_barra', 4, 7, [[-1, 0], [0, 0], [1, 0]]); F('mb_mesa_cuadros', 4, 11, [[-1, 0], [0, 0], [1, 0]]);
  // comedor
  F('mb_carnero', 10, 4); F('mb_mastil', 14, 5);
  F('mb_mesa_verde', 14, 9, [[-1, 0], [0, 0], [1, 0]]);
  for (const [x, y] of [[12, 9], [16, 9], [13, 8], [15, 8], [13, 11], [15, 11]]) F('mb_silla', x, y, [], { solid: false });
  // salita y bodega
  F('mb_escalera', 19, 3, [], { solid: false, xact: 'mb_subir' }); F('mb_sofa', 23, 3, [[-1, 0], [0, 0], [1, 0]]); F('mb_armario', 26, 4);
  F('mb_cajas', 23, 11, [[0, 0], [1, 0]]); F('barrels', 20, 12); F('barrels', 26, 12);
  G.maps.merry_bajo = M; return M;
}
function mbPaint(M, cx, cy) {
  const c = mkCanvas(CHP, CHP), g = c.getContext('2d'), t0x = cx * CH, t0y = cy * CH;
  for (let ty = 0; ty < CH; ty++) for (let tx = 0; tx < CH; tx++) {
    const x = t0x + tx, y = t0y + ty, X = tx * 16, Y = ty * 16, t = mbTile(x, y);
    if (x >= MB_W || y >= MB_H) { g.fillStyle = '#120c08'; g.fillRect(X, Y, 16, 16); continue; }
    if (t === 'rim') { g.fillStyle = '#3a2414'; g.fillRect(X, Y, 16, 16); g.fillStyle = '#5a3820'; g.fillRect(X, Y + 4, 16, 2); g.fillRect(X, Y + 11, 16, 1); continue; }
    if (t === 'wall') {   // tablones curvos del casco; viga oscura arriba, ojos de buey y lámparas en la fila central
      g.fillStyle = y === 0 ? '#4a2e18' : '#7a502c'; g.fillRect(X, Y, 16, 16);
      if (y > 0) { g.fillStyle = '#6a4424'; for (let k = 3; k < 16; k += 5) g.fillRect(X, Y + k, 16, 1); g.fillStyle = '#9a6a3a'; g.fillRect(X, Y, 16, 1); }
      if (y === 2) { g.fillStyle = '#5a3820'; g.fillRect(X, Y + 13, 16, 3); }
      if (y === 1 && x % 4 === 2 && x !== 18 && x !== 19) {   // ojo de buey con el mar
        g.fillStyle = '#c89a30'; g.beginPath(); g.arc(X + 8, Y + 9, 7, 0, 7); g.fill();
        g.fillStyle = '#3a7ac0'; g.beginPath(); g.arc(X + 8, Y + 9, 5, 0, 7); g.fill();
        g.fillStyle = '#6aa8e0'; g.fillRect(X + 4, Y + 10, 8, 2); g.fillStyle = '#dff4ff'; g.fillRect(X + 5, Y + 6, 2, 2);
      } else if (y === 1 && x % 4 === 0 && x > 0) {   // lámpara de pared encendida
        g.fillStyle = 'rgba(255,210,120,.28)'; g.beginPath(); g.arc(X + 8, Y + 9, 8, 0, 7); g.fill();
        g.fillStyle = '#c89a30'; g.fillRect(X + 6, Y + 12, 4, 2); g.fillStyle = '#fff0a0'; g.fillRect(X + 6, Y + 6, 4, 6);
      }
      continue;
    }
    if (t === 'kitchen') { const k = (x + y) % 2; g.fillStyle = k ? '#2a2a2e' : '#ece8dc'; g.fillRect(X, Y, 16, 16); g.fillStyle = k ? '#36363c' : '#fffaf0'; g.fillRect(X + 1, Y + 1, 14, 2); continue; }
    g.fillStyle = (y % 2) ? '#a06a3a' : '#a87242'; g.fillRect(X, Y, 16, 16);   // tablones del suelo
    g.fillStyle = '#7a4e2a'; g.fillRect(X, Y + 15, 16, 1); if ((x + (y % 2) * 2) % 4 === 0) g.fillRect(X, Y, 1, 15);
    if ((x * 7 + y * 5) % 11 === 0) { g.fillStyle = 'rgba(255,230,190,.22)'; g.fillRect(X + 3, Y + 6, 10, 2); }
  }
  return c;
}
hookAround('renderChunk', (next, M, cx, cy) => M && M.merryBajo ? mbPaint(M, cx, cy) : next(M, cx, cy));

// ---------- tripulación abajo (solo los que ya se unieron; Nami deja el barco anclado mientras bajas) ----------
const MB_CREW = [   // [id, x, y, cara, condición]
  [BAR_SANJI, 4, 5, 'up', P => !!P.baratieSanji],
  [SHELLS_CAST_IDS.luffy, 14, 11, 'up', P => true],
  [SHELLS_CAST_IDS.zoro, 23, 5, 'down', P => true],
  [SYRUP_USOPP, 17, 11, 'right', P => !!P.syrupUsopp],
  [ORANGE_NAMI, 17, 8, 'left', P => !!P.dawnCrewJoined]
];
function mbSpawnCrew(M) {
  if (M.mbCrew) for (const e of M.mbCrew) e.remove = true;
  const P = G.P; M.mbCrew = [];
  for (const [id, x, y, face, ok] of MB_CREW) {
    if (!NPCS[id] || !ok(P)) continue;
    const e = spawnNPC(id, x * 16 + 8, y * 16 + 10, M.id, { face, hgt: 58 });
    if (e) { e.def = { ...e.def, lines: dawnCrewLines(id, true) }; M.mbCrew.push(e); }
  }
}

// ---------- bajar y subir ----------
function mbCanGoDown() { const P = G.P; return !!(G.map && G.map.dawn && P && P.dawnCrewJoined && P.dawnHelm && P.dawnHelm.kind === 'skiff' && !P.dead && !G.fading); }
function mbGoDown() {
  const P = G.P; if (!mbCanGoDown()) return;
  transition(() => {
    const h = P.dawnHelm; if (h) delete h.deck;
    P._mbTrip = { h, x: P.x, y: P.y, dir: P.dir }; P.inside = 'merry_bajo';
    const M = makeMerryBajo(); setMap(M, 19 * 16 + 8, 5 * 16 + 8, 'down'); mbSpawnCrew(M);
    banner(MB_NAME, L2('Cocina · Comedor · Salita y bodega', 'Galley · Dining room · Lounge and hold'));
  });
}
function mbGoUp() {
  const P = G.P, S = P._mbTrip; if (G.fading || P.dead) return;
  transition(() => {
    P.inside = null; P._mbTrip = null; const M = makeDawn();
    if (S && S.h) { P.dawnHelm = S.h; setMap(M, S.x, S.y, S.dir || 'down'); }
    else { const [x, y] = dawnPx(ORANGE_QUAY); P.dawnHelm = dawnHelm('skiff', { x, y }); setMap(M, x, y, 'down'); }
    markDirty(true);
  });
}
XACT.mb_subir = [L2('Subir a cubierta', 'Go up to the deck'), 'ways', mbGoUp];
// opción en el menú del barco (Hablar con la tripulación) para bajar
hookBefore('xMsg', (title, html, btns) => {
  if (title !== DAWN_MERRY_NAME || !Array.isArray(btns) || !mbCanGoDown() || btns.some(b => b && b.mbDown)) return;
  const b = [L2('Bajar a la cocina y el comedor', 'Go below to the galley and dining room'), () => { closeModal(); mbGoDown(); }]; b.mbDown = 1;
  btns.splice(1, 0, b);
});
// si se carga una partida guardada abajo, el juego te deja en el mundo como cualquier interior del Mar de Dawn;
// al salir del mapa por otra vía se borra el viaje
hookAfter('setMap', () => { const P = G.P; if (P && G.map && !G.map.merryBajo && !G.map.dawn && P._mbTrip) P._mbTrip = null; });
