// ================= v5.12: TRENES DE JAPÓN (tren bala, subterráneo, metro elevado) Y AVIÓN CAMINABLE =================
// · Japón crece por el este y el sur (`jpGrow`: el mapa se copia a uno mayor después de crearlo, sin mover nada de lo que
//   ya había) con la Bahía del Shinkansen: una franja de costa nueva unida a la isla por 6 puentes.
// · Tren bala alrededor de toda la isla: viaducto sobre el mar (oeste y norte) y terraplén en la Bahía (este y sur), con
//   dos trenes (blanco y azul / verde y rosa) que dan la vuelta sin parar (paisaje, igual para todos).
// · Subterráneo: 13 bocas de metro (una por zona). Abajo, andén con gente que entra y sale, panel de salidas, revisor y
//   vendedora de ekiben. El tren bala para en cada estación (horario por reloj real, 3 trenes). Billete: 5.000.
//   Dentro del tren (vagones caminables con pasajeros) te avisa en cada parada: «¿Bajar aquí?».
// · Metro elevado: un anillo sobre Tokio, Akihabara, Shinjuku y Asakusa a 40 px de altura; al subir ves el mapa debajo y el
//   interior del vagón (techo abierto). 6 estaciones con escaleras. Billete: 5.000.
// · Avión: en vez de la cinemática, entras en la cabina (pasillo, asientos, azafatas, pasajeros) y llegas al minuto.
const JPT_FARE = 5000;
const JPX = { W: 460, H: 336, eX0: 422, eX1: 453, sY0: 302, sY1: 329, rx: 454, ry: 330 };

// ---------- ampliación del mapa ----------
function jpGrow(M) { const w = M.w, h = M.h, N = w * h, W2 = JPX.W, H2 = JPX.H, N2 = W2 * H2; if (w >= W2) return;
  for (const k of Object.keys(M)) { const a = M[k]; if (!a || typeof a !== 'object' || a.length !== N) continue; if (!(ArrayBuffer.isView(a) || Array.isArray(a))) continue;
    const b = Array.isArray(a) ? new Array(N2) : new a.constructor(N2); if (k === 'objAt') b.fill(-1); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) b[y * W2 + x] = a[y * w + x]; M[k] = b; }
  M.w = W2; M.h = H2; M.I = (x, y) => y * W2 + x; const I = M.I, J = JP_G;
  for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) { if (x < w && y < h) continue; const i = I(x, y); M.ter[i] = T.WATER; if (M.jg) M.jg[i] = J.SEA; }
  // tierra nueva: franja este y franja sur
  const land = (x, y, k) => { const i = I(x, y); M.ter[i] = T.FLOOR; M.jg[i] = k; };
  for (let y = 4; y <= JPX.sY1; y++) for (let x = JPX.eX0; x <= JPX.eX1; x++) land(x, y, x <= JPX.eX0 + 1 ? J.SAND : J.GRASS);
  for (let y = JPX.sY0; y <= JPX.sY1; y++) for (let x = 4; x <= JPX.eX1; x++) land(x, y, y <= JPX.sY0 + 1 && x < JPX.eX0 ? J.SAND : J.GRASS);
  for (let y = 6; y <= JPX.sY1 - 2; y++) for (const x of [JPX.eX0 + 4, JPX.eX0 + 5]) M.jg[I(x, y)] = J.WALK;
  for (let x = 6; x <= JPX.eX0 + 5; x++) for (const y of [JPX.sY0 + 4, JPX.sY0 + 5]) M.jg[I(x, y)] = J.WALK;
  // plaza de la Estación Central de la Bahía
  for (let y = 150; y <= 170; y++) for (let x = JPX.eX0 + 6; x <= JPX.eX1 - 2; x++) M.jg[I(x, y)] = J.STONE;
  // vías del anillo (sólidas en tierra; sobre el mar quedan como agua y se dibuja el viaducto)
  const rail = (x, y) => { if (x < 0 || y < 0 || x >= W2 || y >= H2) return; const i = I(x, y); if (M.ter[i] !== T.WATER) { M.ter[i] = T.IWALL; M.jg[i] = J.STONE; } M.jpRail = M.jpRail || new Uint8Array(N2); };
  for (let y = 1; y <= JPX.ry + 1; y++) for (const x of [1, 2, JPX.rx, JPX.rx + 1]) rail(x, y);
  for (let x = 1; x <= JPX.rx + 1; x++) for (const y of [1, 2, JPX.ry, JPX.ry + 1]) rail(x, y);
  // puentes desde la isla
  const bridgeE = y0 => { for (let y = y0; y < y0 + 3; y++) for (let x = JPX.eX0 - 1; x > 300; x--) { const i = I(x, y); if (M.jg[i] !== J.SEA) break; M.ter[i] = T.FLOOR; M.jg[i] = J.STONE; } };
  const bridgeS = x0 => { for (let x = x0; x < x0 + 3; x++) for (let y = JPX.sY0 - 1; y > 200; y--) { const i = I(x, y); if (M.jg[i] !== J.SEA) break; M.ter[i] = T.FLOOR; M.jg[i] = J.STONE; } };
  M.jpBridges = [];
  for (const y of [40, 150, 250]) { bridgeE(y); M.jpBridges.push(['e', y]); } for (const x of [60, 180, 290]) { bridgeS(x); M.jpBridges.push(['s', x]); }
  prepPalettes(M); M.cw = Math.ceil(W2 / CH); M.chh = Math.ceil(H2 / CH); M.objGrid = Array.from({ length: M.cw * M.chh }, () => []);
  for (const o of M.objs) { const gx = clamp(o.px >> 7, 0, M.cw - 1), gy = clamp(o.py >> 7, 0, M.chh - 1); M.objGrid[gy * M.cw + gx].push(o.id); }
  M.chunks.clear(); delete M._D; M.wdist = null;
  // decorado de la Bahía
  const free = (x, y) => { const i = I(x, y); return x > 0 && y > 0 && x < W2 && y < H2 && M.ter[i] === T.FLOOR && M.objAt[i] < 0 && (M.jg[i] === J.GRASS || M.jg[i] === J.SAND); };
  const put = (f, x, y, o) => free(x, y) ? addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {})) : null, R = new RNG(SEED + 9512);
  for (let y = 8; y <= JPX.sY1 - 4; y += 5) { put(R.f() < 0.5 ? 'jp_sakura' : 'jp_pino', JPX.eX1 - 2 - R.int(0, 3), y); if (y % 15 === 3) put('jp_farol', JPX.eX0 + 3, y); if (y % 20 === 8) put('jp_banco', JPX.eX0 + 7, y); }
  for (let x = 10; x <= JPX.eX0 - 4; x += 6) { put(R.f() < 0.4 ? 'jp_palmera' : R.f() < 0.5 ? 'jp_sakura' : 'jp_pino', x + R.int(0, 2), JPX.sY1 - 2 - R.int(0, 2)); if (x % 18 === 4) put('jp_farol', x, JPX.sY0 + 3); if (x % 24 === 10) put('jp_banco', x + 2, JPX.sY0 + 7); if (x % 30 === 16) put('jp_sombrilla', x + 3, JPX.sY0 + 2); }
  for (const [x, y] of [[JPX.eX0 + 8, 152], [JPX.eX1 - 3, 152], [JPX.eX0 + 8, 168], [JPX.eX1 - 3, 168]]) put('jp_maquina', x, y);
  M.jpGrown = 1; }
JP_ZONES.unshift({ k: 'bahia', n: L2('Bahía del Shinkansen', 'Shinkansen Bay'), mn: L2('Bahía', 'Bay'), j: '新幹線湾', x0: 418, x1: JPX.W - 1, y0: 0, y1: JPX.H - 1 }, { k: 'bahia_s', n: L2('Costa Sur del Shinkansen', 'Shinkansen South Coast'), mn: L2('Costa Sur', 'South Coast'), j: '南海岸', x0: 0, x1: 417, y0: 298, y1: JPX.H - 1 });

// ---------- anillo del tren bala (paisaje) ----------
function jptLoop(pts) { const segs = []; let L = 0; for (let k = 0; k < pts.length; k++) { const a = pts[k], b = pts[(k + 1) % pts.length], len = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]); segs.push({ a, b, s0: L, len }); L += len; } return { pts, segs, L }; }
const JPR = { P: null, trains: [{ liv: 'N', ph: 0, track: 0 }, { liv: 'E', ph: 0.5, track: 1 }], v: 46, cars: 8, carL: 3.4 };
function jprPath(track) { const o = track ? 0.5 : -0.5; const a = 1.5 + o, b = JPX.rx + 0.5 - o, c = JPX.ry + 0.5 - o; return track ? jptLoop([[a, a], [a, c], [b, c], [b, a]]) : jptLoop([[a, a], [b, a], [b, c], [a, c]]); }
function jprPos(tr) { const Pp = tr.P || (tr.P = jprPath(tr.track)), lap = Pp.L / JPR.v, t = ((Date.now() / 1000) / lap + tr.ph) % 1; return t * Pp.L; }
const JPT_LIV = { N: { body: '#f4f6f8', body2: '#d8dde4', stripe: '#1a3a8a', stripe2: '#2a5ad8', win: '#1a2030' }, E: { body: '#f4f6f8', body2: '#cfd6dc', top: '#1a8a7a', top2: '#2ab09a', stripe: '#e83a9a', win: '#14201e' } };
function jptCar(g, x, y, len, horiz, dir, liv, head, tail, cut) { // dibuja un vagón centrado en (x,y)
  const L = JPT_LIV[liv], w = horiz ? len : 14, h = horiz ? 14 : len; ctx.save(); ctx.translate(Math.round(x), Math.round(y)); if (horiz) { if (dir < 0) ctx.scale(-1, 1); } else if (dir < 0) ctx.scale(1, -1);
  if (horiz) { const x0 = -len / 2; ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x0, 6, len, 3); ctx.fillStyle = L.body2; ctx.fillRect(x0, -6, len, 12); ctx.fillStyle = L.body; ctx.fillRect(x0, -7, len, 9);
    if (L.top) { ctx.fillStyle = L.top; ctx.fillRect(x0, -7, len, 5); ctx.fillStyle = L.top2; ctx.fillRect(x0, -7, len, 1); }
    ctx.fillStyle = L.stripe; ctx.fillRect(x0, 1, len, 2); if (L.stripe2) { ctx.fillStyle = L.stripe2; ctx.fillRect(x0, 3, len, 1); }
    ctx.fillStyle = L.win; for (let k = x0 + 4; k < x0 + len - 4; k += 5) ctx.fillRect(k, -3, 3, 2);
    if (head) { ctx.fillStyle = L.top || L.body; ctx.beginPath(); ctx.moveTo(x0 + len, -7); ctx.quadraticCurveTo(x0 + len + 22, -6, x0 + len + 26, 4); ctx.lineTo(x0 + len + 26, 6); ctx.lineTo(x0 + len, 6); ctx.fill(); ctx.fillStyle = L.body; ctx.beginPath(); ctx.moveTo(x0 + len, -1); ctx.quadraticCurveTo(x0 + len + 18, 0, x0 + len + 26, 5); ctx.lineTo(x0 + len, 6); ctx.fill(); ctx.fillStyle = L.win; ctx.fillRect(x0 + len + 4, -5, 7, 2); ctx.fillStyle = '#fff8c0'; ctx.fillRect(x0 + len + 18, 2, 3, 1); ctx.fillStyle = L.stripe; ctx.fillRect(x0 + len, 1, 14, 2); }
    if (tail) { ctx.fillStyle = L.top || L.body; ctx.beginPath(); ctx.moveTo(x0, -7); ctx.quadraticCurveTo(x0 - 18, -6, x0 - 22, 4); ctx.lineTo(x0 - 22, 6); ctx.lineTo(x0, 6); ctx.fill(); ctx.fillStyle = '#ff4a3a'; ctx.fillRect(x0 - 18, 2, 2, 1); }
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(x0 + len - 1, -7, 1, 13); }
  else { const y0 = -len / 2; ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-6, y0 + 3, 14, len); ctx.fillStyle = L.body2; ctx.fillRect(-7, y0, 14, len); ctx.fillStyle = L.top || L.body; ctx.fillRect(-5, y0, 10, len); ctx.fillStyle = L.stripe; ctx.fillRect(-7, y0, 1, len); ctx.fillRect(6, y0, 1, len);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-4, y0, 1, len);
    if (head) { ctx.fillStyle = L.top || L.body; ctx.beginPath(); ctx.moveTo(-7, y0 + len); ctx.quadraticCurveTo(-6, y0 + len + 22, 0, y0 + len + 26); ctx.quadraticCurveTo(6, y0 + len + 22, 7, y0 + len); ctx.fill(); ctx.fillStyle = L.win; ctx.fillRect(-3, y0 + len + 3, 6, 5); }
    if (tail) { ctx.fillStyle = L.top || L.body; ctx.beginPath(); ctx.moveTo(-7, y0); ctx.quadraticCurveTo(-6, y0 - 18, 0, y0 - 22); ctx.quadraticCurveTo(6, y0 - 18, 7, y0); ctx.fill(); } }
  ctx.restore(); }
function jprDraw(M, cx, cy) { const x0 = cx / 16 - 2, x1 = (cx + VW) / 16 + 2, y0 = cy / 16 - 2, y1 = (cy + VH) / 16 + 2, I = M.I, t = G.t;
  // viaducto / terraplén
  const seg = (x, y, horiz) => { if (x < x0 || x > x1 || y < y0 || y > y1) return; const X = Math.round(x * 16 - cx), Y = Math.round(y * 16 - cy), i = I(Math.floor(x), Math.floor(y)), sea = M.ter[i] === T.WATER;
    if (sea) { ctx.fillStyle = 'rgba(0,20,40,0.25)'; ctx.fillRect(X - 2, Y + 4, 20, 16); ctx.fillStyle = '#8a8e98'; if (horiz) { if ((Math.floor(x) % 4) === 0) { ctx.fillRect(X + 6, Y + 14, 4, 12); ctx.fillStyle = '#6a6e78'; ctx.fillRect(X + 9, Y + 14, 1, 12); } } else if ((Math.floor(y) % 4) === 0) { ctx.fillRect(X + 2, Y + 8, 12, 6); } }
    ctx.fillStyle = sea ? '#b8bcc4' : '#8a7a6a'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = sea ? '#9a9ea8' : '#6a5a4a'; if (horiz) { ctx.fillRect(X, Y + 14, 16, 2); ctx.fillRect(X, Y, 16, 1); } else { ctx.fillRect(X + 14, Y, 2, 16); ctx.fillRect(X, Y, 1, 16); }
    ctx.fillStyle = '#5a4a3a'; if (horiz) for (let k = 0; k < 16; k += 4) ctx.fillRect(X + k, Y + 4, 2, 8); else for (let k = 0; k < 16; k += 4) ctx.fillRect(X + 4, Y + k, 8, 2);
    ctx.fillStyle = '#d8dce4'; if (horiz) { ctx.fillRect(X, Y + 5, 16, 1); ctx.fillRect(X, Y + 10, 16, 1); } else { ctx.fillRect(X + 5, Y, 1, 16); ctx.fillRect(X + 10, Y, 1, 16); } };
  for (const yy of [1, 2, JPX.ry, JPX.ry + 1]) for (let x = Math.max(1, Math.floor(x0)); x <= Math.min(JPX.rx + 1, x1); x++) seg(x, yy, true);
  for (const xx of [1, 2, JPX.rx, JPX.rx + 1]) for (let y = Math.max(3, Math.floor(y0)); y <= Math.min(JPX.ry - 1, y1); y++) seg(xx, y, false);
  // trenes
  for (const tr of JPR.trains) { const Pp = tr.P || (tr.P = jprPath(tr.track)), s = jprPos(tr);
    for (let k = 0; k < JPR.cars; k++) { const p = pathPos(Pp, s - k * JPR.carL), X = p.x * 16 - cx + 8, Y = p.y * 16 - cy + 8; if (X < -80 || Y < -80 || X > VW + 80 || Y > VH + 80) continue; const h = p.dy === 0;
      jptCar(ctx, X, Y, JPR.carL * 16 - 2, h, h ? p.dx : p.dy, tr.liv, k === 0, k === JPR.cars - 1); } } }

// ---------- el metro subterráneo y el tren bala con paradas ----------
const JPS_ST = [ // [clave, nombre, kanji, x, y] en el orden del recorrido
  ['fuji', L2('Monte Fuji', 'Mount Fuji'), '富士山', 60, 62], ['aki', 'Akihabara', '秋葉原', 178, 42], ['shinjuku', 'Shinjuku', '新宿', 277, 82], ['takayama', 'Takayama', '高山', 366, 52],
  ['bahia', L2('Bahía Central', 'Bay Central'), '湾岸中央', 438, 160], ['higashiyama', 'Higashiyama', '東山', 382, 184], ['okinawa', 'Okinawa', '沖縄', 278, 262], ['aeropuerto', L2('Aeropuerto', 'Airport'), '空港', 252, 206],
  ['asakusa', 'Asakusa', '浅草', 180, 188], ['tokio', L2('Tokio', 'Tokyo'), '東京', 178, 116], ['osaka', 'Osaka', '大阪', 180, 262], ['nagasaki', 'Nagasaki', '長崎', 60, 262], ['kioto', L2('Kioto', 'Kyoto'), '京都', 60, 150]];
const JPS_DW = 12, JPS_RUN = 16, JPS_LEG = JPS_DW + JPS_RUN, JPS_NT = 3;
function jpsLap() { return JPS_ST.length * JPS_LEG; }
function jpsState(tr) { const lap = jpsLap(), t = ((Date.now() / 1000 + tr * lap / JPS_NT) % lap + lap) % lap, i = Math.floor(t / JPS_LEG), u = t - i * JPS_LEG; if (u < JPS_DW) return { stop: i, i, left: JPS_DW - u, u };
  return { stop: null, i, next: (i + 1) % JPS_ST.length, f: (u - JPS_DW) / JPS_RUN, left: JPS_LEG - u, u }; }
function jpsName(i) { const S = JPS_ST[i]; return S ? S[1] : ''; }
// bocas de metro en la superficie
function jpsPlace(M) { M.jpsEnt = []; const J = JP_G, I = M.I, okJ = new Set([J.WALK, J.PATH, J.STONE, J.GRASS, J.PINK, J.SAND, J.ALLEY]);
  const ok = (x, y) => { if (x < 2 || y < 2 || x >= M.w - 2 || y >= M.h - 2) return false; for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const i = I(x + dx, y + dy); if (M.ter[i] !== T.FLOOR || M.objAt[i] >= 0 || !okJ.has(M.jg[i]) || (typeof jpReserved === 'function' && jpReserved(x + dx, y + dy))) return false; } return true; };
  JPS_ST.forEach((S, idx) => { let p = null; for (let r = 0; r < 40 && !p; r++) for (let dy = -r; dy <= r && !p; dy++) for (let dx = -r; dx <= r && !p; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; if (ok(S[3] + dx, S[4] + dy)) p = [S[3] + dx, S[4] + dy]; }
    if (!p) return; const o = addObj(M, 'furn', p[0], p[1], { f: 'jps_boca', fp: [[0, 0], [1, 0]], xact: 'jps_bajar', st: idx }); M.jpsEnt[idx] = { x: p[0], y: p[1], o }; }); }
XACT.jps_bajar = [o => '🚇 ' + L2('Bajar al andén · ', 'Down to the platform · ') + jpsName(o.st), 'run', o => jpsEnter(o.st, true)];
function jpsSurf(idx) { const M = makeJapan(), E = M.jpsEnt && M.jpsEnt[idx]; return E ? { x: E.x * 16 + 16, y: (E.y + 2) * 16 + 4 } : { x: JP_Q.term.door * 16 + 8, y: (JP_Q.term.y + JP_Q.term.h + 2) * 16 }; }
function jpsEnter(idx, fromTop) { const P = G.P, M = makeJpStation(idx); P.jpRet = jpsSurf(idx); P.jpsAt = idx; transition(() => { P.inside = M.id; setMap(M, fromTop ? M.exit.x * 16 + 8 : 18 * 16 + 8, fromTop ? (M.exit.y - 1) * 16 + 6 : 7 * 16 + 8, fromTop ? 'up' : 'down'); banner('🚇 ' + JPS_ST[idx][2] + ' · ' + jpsName(idx), L2('Andén del tren bala · billete ', 'Bullet train platform · ticket ') + fmt(JPT_FARE)); }); }
// NPCs nuevos
const JPT_LOOK = i => LK({ g: i % 2 ? 'f' : 'm', hair: [HAIRS.negro, HAIRS.castano, HAIRS.negro, HAIRS.gris][i % 4], hairStyle: i % 2 ? 'long' : 'short', outfit: ['tunic', 'dress', 'guard', 'apron'][i % 4], main: [CLOTH.marino, CLOTH.blanco, CLOTH.gris, CLOTH.negro, CLOTH.beige, CLOTH.azul, CLOTH.rosa, CLOTH.marron][i % 8], sec: CLOTH.blanco });
Object.assign(NPCS, {
  jps_ekiin: { n: L2('Jefe de estación', 'Station master'), title: L2('Tren bala', 'Bullet train'), look: LK({ hair: HAIRS.negro, outfit: 'guard', main: CLOTH.marino, hat: 'helmet', hatC: CLOTH.marino }), lines: [L2('El tren bala sale con puntualidad absoluta. ¡Ni un segundo de retraso!', 'The bullet train leaves perfectly on time. Not a second late!'), L2('El billete cuesta 5.000 y te lleva a cualquier estación de Japón.', 'The ticket costs 5,000 and takes you to any station in Japan.')], quests: [] },
  jps_ekiben: { n: L2('Vendedora de ekiben', 'Ekiben seller'), title: L2('Comida para el viaje', 'Food for the trip'), look: LK({ g: 'f', hair: HAIRS.castano, hairStyle: 'long', outfit: 'apron', main: CLOTH.rojo, sec: CLOTH.blanco }), lines: [L2('¡Ekiben recién hecho! La comida sabe mejor mirando por la ventanilla.', 'Fresh ekiben! Food tastes better looking out the window.')], quests: [] },
  jps_azafata: { n: L2('Azafata del tren bala', 'Bullet train attendant'), title: L2('Servicio a bordo', 'On-board service'), look: LK({ g: 'f', hair: HAIRS.negro, hairStyle: 'long', outfit: 'dress', main: CLOTH.rosa, sec: CLOTH.blanco }), lines: [L2('¿Desea algo del carrito? Tenemos té verde y helado muy duro.', 'Anything from the trolley? We have green tea and very hard ice cream.')], quests: [] },
  jps_revisor: { n: L2('Revisor', 'Conductor'), title: L2('Tren bala', 'Bullet train'), look: LK({ hair: HAIRS.gris, outfit: 'guard', main: CLOTH.marino, hat: 'helmet', hatC: CLOTH.marino }), lines: [L2('Este tren va a 320 km/h. Agárrese al pasar por los túneles.', 'This train goes 320 km/h. Hold on through the tunnels.')], quests: [] },
  jpe_guia: { n: L2('Guía de la Bahía', 'Bay guide'), title: L2('Turismo', 'Tourism'), look: LK({ g: 'f', hair: HAIRS.negro, hairStyle: 'long', outfit: 'guard', main: CLOTH.verde, sec: CLOTH.blanco }), lines: [L2('Bajo tierra pasa el tren bala por todas las zonas; sobre la ciudad, el metro elevado. ¡Y alrededor de la isla el tren bala nunca para!', 'Underground, the bullet train reaches every area; above the city, the elevated metro. And around the island the bullet train never stops!')], quests: [] },
  jpe_otaku: { n: L2('Fan de los trenes', 'Train fan'), title: L2('Fotógrafo de trenes', 'Train photographer'), look: LK({ hair: HAIRS.negro, outfit: 'tunic', main: CLOTH.oliva || CLOTH.verde }), lines: [L2('¡Ahí viene el blanco y azul! Y luego el verde y rosa. Los conozco de memoria.', 'Here comes the white and blue one! Then the green and pink. I know them by heart.')], quests: [] },
  av_azafata: { n: L2('Azafata de vuelo', 'Flight attendant'), title: L2('Aerolínea Albor-Tokio', 'Albor-Tokyo Airline'), look: LK({ g: 'f', hair: HAIRS.rubio || HAIRS.castano, hairStyle: 'long', outfit: 'dress', main: CLOTH.marino, sec: CLOTH.blanco }), lines: [L2('Abróchese el cinturón cuando se encienda la señal, por favor.', 'Please fasten your seatbelt when the sign is on.'), L2('Hoy volamos sobre el mar de nubes. ¡Precioso!', 'Today we fly over a sea of clouds. Beautiful!')], quests: [] },
  av_azafato: { n: L2('Sobrecargo', 'Purser'), title: L2('Aerolínea Albor-Tokio', 'Albor-Tokyo Airline'), look: LK({ hair: HAIRS.negro, outfit: 'guard', main: CLOTH.marino, sec: CLOTH.blanco }), lines: [L2('Bienvenido a bordo. El vuelo dura unos minutos, ¡disfrute de las vistas!', 'Welcome aboard. The flight takes a few minutes, enjoy the view!')], quests: [] },
});
for (let i = 0; i < 8; i++) NPCS['jtpax' + i] = { n: [L2('Viajero', 'Traveller'), L2('Viajera', 'Traveller')][i % 2], title: L2('Pasajero', 'Passenger'), look: JPT_LOOK(i), sit: 1, lines: [[L2('Voy a ver el Fuji. ¡Dicen que hoy está despejado!', 'I am going to see Fuji. They say it is clear today!'), L2('Siempre me duermo en el tren y me paso de estación.', 'I always fall asleep on the train and miss my stop.'), L2('El ekiben de Osaka es el mejor.', 'The Osaka ekiben is the best.'), L2('Vuelvo del trabajo en Shinjuku.', 'Coming back from work in Shinjuku.')][i % 4]], quests: [] };
DLG_HOOKS.push((npc, opts) => { const P = G.P;
  if (npc.id === 'jps_ekiben' || npc.id === 'jps_azafata' || npc.id === 'av_azafata') opts.unshift({ label: '🍱 ' + L2('Comprar comida (', 'Buy food (') + fmt(800) + ')', icon: ['food', 2], fn: () => { if (P.gold < 800) { typeText(L2('No tienes suficiente oro.', 'Not enough gold.')); return; } P.gold -= 800; giveItem('food2', 1); sfx('coin'); typeText(L2('¡Aquí tiene! Buen viaje.', 'Here you go! Have a nice trip.')); markDirty(); } });
  if (npc.id === 'jps_ekiin' || npc.id === 'jpe_guia') opts.unshift({ label: '🕑 ' + L2('¿Cuándo pasa el próximo tren bala?', 'When is the next bullet train?'), icon: ['ways'], fn: () => { const idx = G.map && G.map.station !== undefined ? G.map.station : 4, w = jpsWait(idx); typeText(w.here ? L2('¡Está en el andén ahora! Sale en ', 'It is at the platform now! It leaves in ') + w.s + ' s.' : L2('El próximo llega en ', 'The next one arrives in ') + w.s + L2(' segundos. Destinos: todas las estaciones de Japón.', ' seconds. Destinations: every station in Japan.')); } }); });
function jpsWait(idx) { let best = 1e9, here = false, hs = 0; for (let k = 0; k < JPS_NT; k++) { const st = jpsState(k); if (st.stop === idx) { here = true; hs = Math.ceil(st.left); } const lap = jpsLap(), t = ((Date.now() / 1000 + k * lap / JPS_NT) % lap + lap) % lap, ta = idx * JPS_LEG, d = ((ta - t) % lap + lap) % lap; best = Math.min(best, d); } return { here, s: here ? hs : Math.ceil(best) }; }

// ---------- el andén subterráneo ----------
function makeJpStation(idx) { const S = JPS_ST[idx], id = 'jp_st_' + S[0]; if (G.maps[id]) return G.maps[id]; const w = 36, h = 17, M = jpRoom(id, w, h, 5, 0.04, 'st_' + S[0]), I = M.I;
  M.station = idx; M.crowd = []; const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  for (const x of [6, 12, 24, 30]) F('jps_pilar', x, 9); F('jp_banco', 9, 11); F('jp_banco', 27, 11); F('jp_maquina', 2, 7); F('jp_maquina', 33, 7); F('jp_basura', 3, 13);
  for (const x of [14, 15, 21, 22]) F('jps_torno', x, 13);
  spawnNPC('jps_ekiin', 13 * 16 + 8, 14 * 16 + 8, id, { face: 'down' }); spawnNPC('jps_ekiben', 31 * 16 + 8, 11 * 16 + 8, id, { face: 'down' });
  M.drawExtra = (cx, cy) => jpsDrawStation(M, cx, cy); return M; }
function jpsTrainAt(idx) { // ¿hay un tren llegando, parado o saliendo del andén idx?
  for (let k = 0; k < JPS_NT; k++) { const st = jpsState(k); if (st.stop === idx) return { k, ph: 'stop', u: st.u, left: st.left, doors: st.u > 1.5 && st.left > 1.2 };
    if (st.stop === null && st.next === idx && st.f > 0.8) return { k, ph: 'in', f: (st.f - 0.8) / 0.2 }; if (st.stop === null && st.i === idx && st.f < 0.2) return { k, ph: 'out', f: st.f / 0.2 }; } return null; }
function jpsDrawStation(M, cx, cy) { const w = M.w, h = M.h, S = JPS_ST[M.station], t = G.t;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const X = x * 16 - cx, Y = y * 16 - cy; if (X < -16 || Y < -16 || X > VW || Y > VH) continue;
    if (y <= 1) { ctx.fillStyle = y === 0 ? '#c8ccd2' : '#dfe3e8'; ctx.fillRect(X, Y, 16, 16); if (y === 1) { ctx.fillStyle = '#9aa0a8'; ctx.fillRect(X, Y + 15, 16, 1); } }
    else if (y <= 4) { ctx.fillStyle = y === 2 ? '#3a3e46' : '#2a2c32'; ctx.fillRect(X, Y, 16, 16); if (y === 3 || y === 4) { ctx.fillStyle = '#4a3a2e'; for (let k = 0; k < 16; k += 4) ctx.fillRect(X + k, Y + 5, 2, 7); ctx.fillStyle = '#c8ccd4'; ctx.fillRect(X, Y + 6, 16, 1); ctx.fillRect(X, Y + 11, 16, 1); } }
    else if (y === h - 1) { ctx.fillStyle = '#9aa0a8'; ctx.fillRect(X, Y, 16, 16); if (x === M.exit.x) { ctx.fillStyle = '#6a7078'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = '#c8ccd4'; for (let k = 0; k < 4; k++) ctx.fillRect(X + 1, Y + 2 + k * 4, 14, 2); } }
    else { ctx.fillStyle = (x + y) % 2 ? '#e4e6ea' : '#dcdfe4'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(X + 15, Y, 1, 16); ctx.fillRect(X, Y + 15, 16, 1);
      if (y === 5) { ctx.fillStyle = '#ffffff'; ctx.fillRect(X, Y, 16, 2); ctx.fillStyle = '#f0c820'; ctx.fillRect(X, Y + 5, 16, 4); ctx.fillStyle = '#d8a810'; for (let k = 1; k < 16; k += 3) ctx.fillRect(X + k, Y + 6, 1, 2); } } }
  // carteles: nombre de la estación y panel de salidas
  const sx = Math.round(4 * 16 - cx), sy = Math.round(0 * 16 - cy) + 6; ctx.fillStyle = '#ffffff'; ctx.fillRect(sx, sy, 120, 20); ctx.fillStyle = '#1a3a8a'; ctx.fillRect(sx, sy + 17, 120, 3); jpText(ctx, S[2], sx + 6, sy + 3, '#1a1a24', 12); const tn = textSprite(S[1], '#1a1a24', null); ctx.drawImage(tn, sx + 8 + jpW(S[2], 12), sy + 5);
  const bx = Math.round(20 * 16 - cx), by = Math.round(-cy) + 4; ctx.fillStyle = '#14161c'; ctx.fillRect(bx, by, 150, 24); ctx.strokeStyle = '#6a6e78'; ctx.strokeRect(bx + 0.5, by + 0.5, 149, 23);
  const w8 = jpsWait(M.station), nx = JPS_ST[(M.station + 1) % JPS_ST.length]; jpText(ctx, '新幹線', bx + 4, by + 3, '#ff8a3a', 10);
  const l1 = textSprite((w8.here ? L2('En andén - sale en ', 'At platform - leaves in ') : L2('Próximo en ', 'Next in ')) + w8.s + ' s', '#ffd040', null), l2 = textSprite('> ' + nx[1] + ' - ' + fmt(JPT_FARE), '#9ae0ff', null); ctx.drawImage(l1, bx + 46, by + 2); ctx.drawImage(l2, bx + 46, by + 13);
  // el tren bala en la vía (filas 2-4)
  const A = jpsTrainAt(M.station); if (A) { const lenC = 15 * 16, stopX = 33 * 16; let head = stopX; if (A.ph === 'in') head = stopX + (1 - A.f) * (1 - A.f) * 700; else if (A.ph === 'out') head = stopX - A.f * A.f * 900;
    const liv = A.k % 2 ? 'E' : 'N', Y = 3.5 * 16 - cy; for (let c = 0; c < 4; c++) { const X = head - lenC / 2 - c * (lenC + 2) - cx; if (X < -lenC || X > VW + lenC) continue; ctx.save(); ctx.translate(0, -4); ctx.scale(1, 1.6); jptCar(ctx, X, Y / 1.6 + 2, lenC, true, 1, liv, c === 0, c === 3); ctx.restore();
      if (A.ph === 'stop' && A.doors) for (const dx of [-lenC / 2 + 30, lenC / 2 - 34]) { ctx.fillStyle = '#20242c'; ctx.fillRect(Math.round(X + dx), Math.round(Y - 4), 10, 16); ctx.fillStyle = '#ffe9a0'; ctx.fillRect(Math.round(X + dx) + 2, Math.round(Y - 2), 6, 1); } }
    if (A.ph !== 'stop') G.shake = Math.max(G.shake || 0, 0.8); } }
// ---------- gente en los andenes y en las bocas de metro ----------
function jpCrowdApps() { return typeof JP_APPS_W !== 'undefined' ? JP_APPS_W : undefined; }
function jpCrowdSpawn(list, x, y, tx, ty, then) { list.push({ x, y, tx, ty, then, A: xwAtlas((Math.random() * 16) | 0, jpCrowdApps()), mv: 1, ph: Math.random() * 9, dir: 'down', sp: 30 + Math.random() * 14, t: 0 }); }
function jpCrowdStep(list, dt) { for (let k = list.length - 1; k >= 0; k--) { const f = list[k], dx = f.tx - f.x, dy = f.ty - f.y, L = Math.hypot(dx, dy); f.t += dt;
  if (L < 4) { if (f.then === 'gone') { list.splice(k, 1); continue; } if (f.then === 'wait') { f.mv = 0; f.dir = 'up'; continue; } list.splice(k, 1); continue; }
  const st = Math.min(L, f.sp * dt); f.x += dx / L * st; f.y += dy / L * st; f.mv = 1; f.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); if (f.t > 40) list.splice(k, 1); } }
let jpCrowdT = 0; const JP_SURF = [];
V33_TICKS.push(dt => { const P = G.P, M = G.map; dt = Math.min(0.1, dt || 0); if (!P || !M) return; jpCrowdT -= dt;
  if (M.station !== undefined) { const C = M.crowd, A = jpsTrainAt(M.station), ex = M.exit.x * 16 + 8, ey = (M.exit.y - 1) * 16;
    if (jpCrowdT <= 0) { jpCrowdT = 1.6 + Math.random() * 1.6; if (C.length < 22) { if (Math.random() < 0.6) jpCrowdSpawn(C, ex + (Math.random() - 0.5) * 30, ey, (3 + Math.random() * 30) * 16, (6.2 + Math.random() * 3) * 16, 'wait'); else jpCrowdSpawn(C, (4 + Math.random() * 28) * 16, 6 * 16, ex + (Math.random() - 0.5) * 20, ey + 10, 'gone'); } }
    if (A && A.ph === 'stop' && A.doors) { for (const f of C) if (f.then === 'wait' && !f.mv && Math.random() < dt * 0.8) { f.ty = 5 * 16; f.then = 'gone'; }
      if (!M._alight || M._alight !== A.k + ':' + Math.floor(Date.now() / 1000 / jpsLap())) { M._alight = A.k + ':' + Math.floor(Date.now() / 1000 / jpsLap()); for (let n = 0; n < 4 + (Math.random() * 4 | 0); n++) jpCrowdSpawn(C, (6 + Math.random() * 26) * 16, 5.6 * 16, ex + (Math.random() - 0.5) * 24, ey + 10, 'gone'); } }
    jpCrowdStep(C, dt); }
  else if (M.id === 'japon' && M.jpsEnt) { if (jpCrowdT <= 0) { jpCrowdT = 2.2 + Math.random() * 2; const near = M.jpsEnt.filter(E => E && Math.hypot(E.x * 16 - P.x, E.y * 16 - P.y) < 420);
      for (const E of near) { if (JP_SURF.length > 26) break; const ex = E.x * 16 + 16, ey = E.y * 16 + 8, a = Math.random() * 6.28, r = 120 + Math.random() * 80; if (Math.random() < 0.5) jpCrowdSpawn(JP_SURF, ex + Math.cos(a) * r, ey + Math.sin(a) * r * 0.7, ex, ey, 'gone'); else jpCrowdSpawn(JP_SURF, ex, ey, ex + Math.cos(a) * r, ey + Math.sin(a) * r * 0.7, 'gone'); } }
    jpCrowdStep(JP_SURF, dt); }
  else JP_SURF.length = 0; });
DL_HOOKS.push((list, cx, cy) => { const M = G.map; if (!M) return; const arr = M.station !== undefined ? M.crowd : M.id === 'japon' ? JP_SURF : null; if (!arr) return;
  for (const f of arr) if (f.x > cx - 30 && f.x < cx + VW + 30 && f.y > cy - 30 && f.y < cy + VH + 60) list.push({ type: 'xdraw', x: f.x, y: f.y, noShadow: true, draw: (e, a, b) => xwDraw(f, a, b) }); });
// subir al tren bala desde el andén
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && M.station !== undefined && !P.dead && P.y < 7.5 * 16) { const A = jpsTrainAt(M.station); if (A && A.ph === 'stop' && A.doors) return { kind: 'jpsboard', A, label: '🚄 ' + L2('Subir al tren bala (', 'Board the bullet train (') + fmt(JPT_FARE) + ')', icon: 'run' }; } return _it.apply(this, arguments); }; }
{ const _di = doInteract; doInteract = function (it) { it = it || interactTarget(); if (it && it.kind === 'jpsboard') { jpsBoard(it.A.k); return; } return _di.apply(this, arguments); }; }
function jpsBoard(k) { const P = G.P; if (P.gold < JPT_FARE) { toast(L2('El billete cuesta ', 'The ticket costs ') + fmt(JPT_FARE) + L2(' de oro.', ' gold.'), 'warn'); return; } P.gold -= JPT_FARE; sfx('coin'); markDirty(true);
  const M = makeShinTrain(k), last = G.map.station; transition(() => { P.shin = { k, last, want: null }; P.inside = M.id; setMap(M, (M.cars[0] + 8) * 16 + 8, 7 * 16 + 6, 'up'); jptUI(); toast(L2('En cada estación te preguntaremos si quieres bajar.', 'At every station we will ask if you want to get off.'), 'info', 4); }); if (typeof stampAdd === 'function') stampAdd('tren_bala'); }

// ---------- el interior del tren bala ----------
const SHIN_CW = 17;
function makeShinTrain(k) { const id = 'jp_shin_' + k; if (G.maps[id]) return G.maps[id]; const nC = 3, w = 2 + nC * (SHIN_CW + 1) + 1, h = 9, N = w * h, I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.IWALL), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], shinTr: k, cars: [], tdoors: [] };
  for (let c = 0; c < nC; c++) { const x0 = 2 + c * (SHIN_CW + 1); M.cars.push(x0); for (let y = 2; y <= 7; y++) for (let x = x0; x < x0 + SHIN_CW; x++) M.ter[I(x, y)] = T.CARPET; if (c) for (const y of [4]) M.ter[I(x0 - 1, y)] = T.FLOOR; const dx = x0 + 1; M.ter[I(dx, 8)] = T.FLOOR; M.tdoors.push(dx); }
  M.exit = { x: -9, y: -9 }; prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {}));
  for (const x0 of M.cars) for (let x = x0 + 3; x < x0 + SHIN_CW; x += 2) for (const y of [2, 3, 5, 6, 7]) F('jps_asiento', x, y, { seat: 1 });
  const R = new RNG(k * 97 + 5); for (const o of M.objs) if (o.seat && R.f() < 0.45) { const e = spawnNPC('jtpax' + R.int(0, 7), o.px, o.py - 2, id, { face: 'down' }); if (e) { e.scene = 1; e.noTag = 1; e.seatO = o; o.taken = e; setAnim(e, 'sit'); } }
  spawnNPC('jps_azafata', (M.cars[1] + 8) * 16 + 8, 4 * 16 + 12, id, { wander: 5 }); spawnNPC('jps_revisor', (M.cars[2] + 6) * 16 + 8, 4 * 16 + 12, id, { wander: 4 });
  M.drawExtra = (cx, cy) => shinDrawIn(M, cx, cy); G.maps[id] = M; return M; }
function shinDrawIn(M, cx, cy) { const k = M.shinTr, st = jpsState(k), dk = darkness(), t = G.t;
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) { const X = x * 16 - cx, Y = y * 16 - cy; if (X < -16 || Y < -16 || X > VW || Y > VH) continue; const tt = M.ter[M.I(x, y)];
    if (tt === T.CARPET || tt === T.FLOOR) { ctx.fillStyle = y === 4 ? '#5a6478' : (x + y) % 2 ? '#3a4a6a' : '#3e4e70'; ctx.fillRect(X, Y, 16, 16); if (y === 8) { ctx.fillStyle = st.stop !== null ? '#6a7a5a' : '#2a2e36'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = '#ffd040'; ctx.fillRect(X, Y, 16, 2); } }
    else { ctx.fillStyle = y <= 1 ? '#eef0f4' : '#d8dce4'; ctx.fillRect(X, Y, 16, 16); if (y === 1) { ctx.fillStyle = '#1a3a8a'; ctx.fillRect(X, Y + 13, 16, 2); } } }
  // ventanillas con paisaje (túnel al salir y llegar)
  const tun = st.stop !== null || st.f < 0.15 || st.f > 0.85, from = JPS_ST[st.i], scroll = (Date.now() / 1000) * (st.stop !== null ? 0 : 260);
  for (const x0 of M.cars) for (let wx = x0 + 2; wx < x0 + SHIN_CW - 1; wx += 3) { const X = Math.round(wx * 16 - cx), Y = Math.round(2 - cy), W_ = 36, H_ = 22; if (X > VW || X + W_ < 0) continue; ctx.save(); ctx.beginPath(); ctx.rect(X, Y, W_, H_); ctx.clip();
    if (tun) { ctx.fillStyle = st.stop !== null ? '#c8ccd4' : '#14161c'; ctx.fillRect(X, Y, W_, H_); if (st.stop !== null) { ctx.fillStyle = '#f0c820'; ctx.fillRect(X, Y + H_ - 6, W_, 3); ctx.fillStyle = '#9aa0a8'; ctx.fillRect(X + 10, Y, 4, H_ - 6); } else { ctx.fillStyle = '#ffe9a0'; ctx.fillRect(X + ((W_ - (scroll * 0.6) % 80) | 0), Y + 6, 8, 2); } }
    else { const sky = ctx.createLinearGradient(0, Y, 0, Y + H_); sky.addColorStop(0, dk > 0.6 ? '#0a1030' : '#7ab8ff'); sky.addColorStop(1, dk > 0.6 ? '#2a2050' : '#ffd8b0'); ctx.fillStyle = sky; ctx.fillRect(X, Y, W_, H_);
      const fx = X + W_ / 2 - ((scroll * 0.02 + wx * 3) % 70) + 20; ctx.fillStyle = dk > 0.6 ? '#2a3050' : '#5a6a9a'; ctx.beginPath(); ctx.moveTo(fx - 22, Y + H_ - 6); ctx.lineTo(fx, Y + 4); ctx.lineTo(fx + 22, Y + H_ - 6); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(fx - 6, Y + 9); ctx.lineTo(fx, Y + 4); ctx.lineTo(fx + 6, Y + 9); ctx.fill();
      const c = (from[3] + from[4]) % 3; ctx.fillStyle = c === 0 ? (dk > 0.6 ? '#1a2a48' : '#2a6ab8') : c === 1 ? (dk > 0.6 ? '#1a2a1a' : '#5aa04a') : (dk > 0.6 ? '#20202a' : '#8a8e98'); ctx.fillRect(X, Y + H_ - 7, W_, 7);
      if (c === 2) { for (let b = 0; b < 4; b++) { const bx = X + ((b * 13 - scroll * 0.5) % 52 + 52) % 52 - 8; ctx.fillStyle = dk > 0.6 ? '#2a2a34' : '#6a6e7a'; ctx.fillRect(bx, Y + H_ - 14, 8, 14); if (dk > 0.4) { ctx.fillStyle = '#ffe080'; ctx.fillRect(bx + 2, Y + H_ - 11, 1, 1); ctx.fillRect(bx + 5, Y + H_ - 8, 1, 1); } } }
      ctx.fillStyle = '#9a9ea8'; ctx.fillRect(X + W_ - ((scroll * 1.4) % 60), Y, 2, H_); }
    ctx.restore(); ctx.strokeStyle = '#c8ccd4'; ctx.lineWidth = 2; ctx.strokeRect(X, Y, W_, H_); }
  if (st.stop === null && Math.random() < 0.02) G.shake = Math.max(G.shake || 0, 1); }
// HUD y paradas
let jptEl = null;
function jptUI() { const P = G.P; if (!jptEl) { jptEl = document.createElement('div'); jptEl.id = 'jptBar'; jptEl.className = 'jptbar'; $('#hud').appendChild(jptEl); }
  const S = P.shin, E = P.elev; if (!S && !E) { jptEl.hidden = true; return; } jptEl.hidden = false;
  if (S) { const st = jpsState(S.k), here = st.stop !== null ? JPS_ST[st.stop] : null, nx = JPS_ST[st.stop !== null ? (st.stop + 1) % JPS_ST.length : st.next];
    jptEl.innerHTML = `<b>🚄 ${L2('Tren bala', 'Bullet train')}</b><span>${here ? L2('Parado en ', 'Stopped at ') + esc(here[1]) + ' · ' + Math.ceil(st.left) + ' s' : L2('Próxima: ', 'Next: ') + esc(nx[1]) + ' · ' + Math.ceil(st.left) + ' s'}${S.want !== null && S.want !== undefined ? ' · ' + L2('bajas en ', 'getting off at ') + esc(JPS_ST[S.want][1]) : ''}</span><div class="row">${here ? `<button class="btn sm gold" id="jptOff">${L2('Bajar aquí', 'Get off here')}</button>` : `<button class="btn sm" id="jptNext">${L2('Bajar en ', 'Get off at ') + esc(nx[1])}</button>`}<button class="btn sm" id="jptGo">⏩ ${L2('Elegir destino', 'Pick destination')}</button></div>`;
    const off = $('#jptOff'); if (off) off.onclick = () => shinAlight(st.stop); const nb = $('#jptNext'); if (nb) nb.onclick = () => { S.want = st.next; jptUI(); };
    $('#jptGo').onclick = () => openModal(`<h2>🚄 ${L2('¿A qué estación vas?', 'Which station?')}</h2><div class="slist">${JPS_ST.map((s, i) => `<button class="srow" data-jg="${i}"><div class="sn"><b>${s[2]} · ${esc(s[1])}</b></div></button>`).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party') || (() => { $('#mclose').onclick = closeModal; $$('#modal [data-jg]').forEach(b => b.onclick = () => { closeModal(); shinAlight(+b.dataset.jg); }); })(); }
  else { const st = elevState(E.k), here = st.stop !== null ? ELV.st[st.stop] : null, nx = ELV.st[st.stop !== null ? (st.stop + 1) % ELV.st.length : st.next];
    jptEl.innerHTML = `<b>🚝 ${L2('Metro elevado', 'Elevated metro')}</b><span>${here ? L2('Parado en ', 'Stopped at ') + esc(here[1]) + ' · ' + Math.ceil(st.left) + ' s' : L2('Próxima: ', 'Next: ') + esc(nx[1])}</span><div class="row">${here ? `<button class="btn sm gold" id="jptOff">${L2('Bajar aquí', 'Get off here')}</button>` : `<button class="btn sm ${E.want === st.next ? 'gold' : ''}" id="jptNext">${L2('Bajar en ', 'Get off at ') + esc(nx[1])}</button>`}</div>`;
    const off = $('#jptOff'); if (off) off.onclick = () => elevAlight(st.stop); const nb = $('#jptNext'); if (nb) nb.onclick = () => { E.want = st.next; jptUI(); }; } }
function shinAlight(idx) { const P = G.P; P.shin = null; jptUI(); const M = makeJpStation(idx); P.jpRet = jpsSurf(idx); transition(() => { P.inside = M.id; setMap(M, 18 * 16 + 8, 7 * 16 + 4, 'down'); banner('🚇 ' + JPS_ST[idx][2] + ' · ' + JPS_ST[idx][1], L2('Sube por la escalera de abajo para salir a la calle', 'Take the stairs at the bottom to go up to the street')); markDirty(); }); if (typeof stampAdd === 'function') stampAdd('st_' + JPS_ST[idx][0]); }
let jptHT = 0;
V33_TICKS.push(dt => { const P = G.P, M = G.map; if (!P || !M) return; jptHT -= dt || 0;
  if (P.shin && M.shinTr === undefined) { P.shin = null; jptUI(); }
  if (P.shin) { const st = jpsState(P.shin.k); if (st.stop !== null && P.shin.last !== st.stop) { P.shin.last = st.stop; const S = JPS_ST[st.stop]; if (P.shin.want === st.stop) { shinAlight(st.stop); return; } banner('🚄 ' + S[2] + ' · ' + S[1], L2('¿Bajar aquí? Pulsa «Bajar aquí» o sal por una puerta del vagón', 'Get off here? Tap «Get off here» or leave by a carriage door')); sfx('quest'); jptUI(); }
    if (st.stop === null && P.shin.last !== null) { P.shin.last = null; jptUI(); }
    const tx = Math.floor(P.x / 16), ty = Math.floor((P.y + 2) / 16); if (ty >= 8 && M.tdoors && M.tdoors.includes(tx)) { if (st.stop !== null) { shinAlight(st.stop); return; } P.y = 7 * 16 + 6; if (G.t - (P.doorMsgT || 0) > 2) { P.doorMsgT = G.t; toast(L2('Las puertas se abren en la próxima estación.', 'The doors open at the next station.'), 'warn'); } } }
  if ((P.shin || P.elev) && jptHT <= 0) { jptHT = 1; jptUI(); } });

// ---------- metro elevado ----------
const ELV_LIFT = 40;
const ELV = { pts: [[143, 30], [263, 30], [263, 126], [143, 126]], st: [['eaki', 'Akihabara', 'あきはばら', 0], ['enorte', L2('Shinjuku Norte', 'North Shinjuku'), 'しんじゅく', 0], ['esur', L2('Shinjuku Sur', 'South Shinjuku'), 'みなみ', 0], ['eparque', L2('Parque de la Torre', 'Tower Park'), 'こうえん', 0], ['eueno', L2('Ueno-Asakusa', 'Ueno-Asakusa'), 'うえの', 0], ['ekanda', 'Kanda', 'かんだ', 0]], ss: [], P: null, v: 11, dw: 8, nt: 2 };
function elevInit() { if (ELV.P) return; ELV.P = jptLoop(ELV.pts); const L = ELV.P.L; ELV.ss = ELV.st.map((s, i) => i * L / ELV.st.length + 6); }
function elevState(k) { elevInit(); const L = ELV.P.L, n = ELV.st.length, seg = L / n, legT = seg / ELV.v, leg = ELV.dw + legT, lap = n * leg, t = ((Date.now() / 1000 + k * lap / ELV.nt) % lap + lap) % lap, i = Math.floor(t / leg), u = t - i * leg;
  if (u < ELV.dw) return { stop: i, i, s: ELV.ss[i], left: ELV.dw - u }; const f = (u - ELV.dw) / legT, e = f < 0.5 ? 2 * f * f : 1 - 2 * (1 - f) * (1 - f); return { stop: null, i, next: (i + 1) % n, s: ELV.ss[i] + e * seg, left: leg - u }; }
function elevStPos(i) { elevInit(); const p = pathPos(ELV.P, ELV.ss[i]); return p; }
function elevPlace(M) { elevInit(); M.elvSt = []; const J = JP_G, I = M.I, okJ = new Set([J.WALK, J.PATH, J.STONE, J.GRASS, J.PINK]);
  ELV.st.forEach((S, i) => { const p = elevStPos(i); let q = null; for (let r = 1; r < 9 && !q; r++) for (let dy = -r; dy <= r && !q; dy++) for (let dx = -r; dx <= r && !q; dx++) { const x = Math.round(p.x) + dx, y = Math.round(p.y) + dy + 1; if (x < 2 || y < 2) continue; const a = I(x, y), b = I(x, y + 1); if (M.ter[a] === T.FLOOR && M.ter[b] === T.FLOOR && M.objAt[a] < 0 && M.objAt[b] < 0 && okJ.has(M.jg[a])) q = [x, y]; }
    if (!q) return; addObj(M, 'furn', q[0], q[1], { f: 'jpe_escalera', fp: [[0, 0]], xact: 'jpe_subir', est: i }); M.elvSt[i] = q; }); }
XACT.jpe_subir = [o => { const A = elevTrainAt(o.est); return '🚝 ' + (A ? L2('Subir al metro elevado (', 'Board the elevated metro (') + fmt(JPT_FARE) + ')' : ELV.st[o.est][1] + ' · ' + L2('próximo en ', 'next in ') + elevWait(o.est) + ' s'); }, 'run', o => { const A = elevTrainAt(o.est); if (!A) { xMsg('🚝 ' + ELV.st[o.est][1], L2('El metro elevado llega en ', 'The elevated metro arrives in ') + elevWait(o.est) + L2(' segundos. Espera junto a la escalera.', ' seconds. Wait by the stairs.')); return; } elevBoard(A, o.est); }];
function elevTrainAt(i) { for (let k = 0; k < ELV.nt; k++) { const st = elevState(k); if (st.stop === i && st.left > 1) return k; } return null; }
function elevWait(i) { elevInit(); const n = ELV.st.length, leg = ELV.dw + ELV.P.L / n / ELV.v, lap = n * leg; let best = 999; for (let k = 0; k < ELV.nt; k++) { const t = ((Date.now() / 1000 + k * lap / ELV.nt) % lap + lap) % lap, d = ((i * leg - t) % lap + lap) % lap; best = Math.min(best, d); } return Math.ceil(best); }
function elevBoard(k, i) { const P = G.P; if (P.gold < JPT_FARE) { toast(L2('El billete cuesta ', 'The ticket costs ') + fmt(JPT_FARE) + L2(' de oro.', ' gold.'), 'warn'); return; } P.gold -= JPT_FARE; sfx('coin'); P.elev = { k, want: null, from: i, last: i }; P.elevRet = { x: P.x, y: P.y }; toast(L2('¡Arriba! Mira la ciudad desde el metro elevado.', 'Up you go! See the city from the elevated metro.'), 'info', 3); jptUI(); netPresence(true); markDirty(true); if (typeof stampAdd === 'function') stampAdd('metro_elevado'); }
function elevAlight(i) { const P = G.P, M = G.map, q = M && M.elvSt && M.elvSt[i]; P.elev = null; jptUI(); if (q) { P.x = q[0] * 16 + 8; P.y = (q[1] + 1) * 16 + 10; } else if (P.elevRet) { P.x = P.elevRet.x; P.y = P.elevRet.y; } P.L = 0; sfx('door'); banner('🚝 ' + ELV.st[i][1], L2('Metro elevado', 'Elevated metro')); netPresence(true); markDirty(); }
function elevCarPos(k, c) { const st = elevState(k), p = pathPos(ELV.P, st.s - c * 3.1); return { x: p.x * 16 + 8, y: p.y * 16 + 8, h: p.dy === 0, dx: p.dx, dy: p.dy, st }; }
V33_TICKS.push(dt => { const P = G.P, M = G.map; if (!P || !P.elev) return; if (!M || M.id !== 'japon') { P.elev = null; jptUI(); return; } const E = P.elev, c = elevCarPos(E.k, 1);
  P.x = c.x; P.y = c.y; P.ifr = 1; P.dir = c.h ? (c.dx > 0 ? 'right' : 'left') : (c.dy > 0 ? 'down' : 'up'); setAnim(P, 'idle', true);
  if (c.st.stop !== null && E.last !== c.st.stop) { E.last = c.st.stop; if (E.want === c.st.stop) { elevAlight(c.st.stop); return; } toast('🚝 ' + ELV.st[c.st.stop][1] + L2(' · ¿Bajar aquí?', ' · Get off here?'), 'info', 3); jptUI(); }
  if (c.st.stop === null && E.last !== null) { E.last = null; jptUI(); } });
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e && ((e === G.P && G.P.elev) || (e.type === 'remote' && e.ev)) && !e._elevDraw) return; return _de.apply(this, arguments); }; }
{ const _hp = hurtPlayer; hurtPlayer = function () { if (G.P && G.P.elev) return; return _hp.apply(this, arguments); }; }
{ const _ba = basicAttack; basicAttack = function () { if (G.P && G.P.elev) return; return _ba.apply(this, arguments); }; }
{ const _it = interactTarget; interactTarget = function () { if (G.P && G.P.elev) return null; return _it.apply(this, arguments); }; }
{ const _sp = socialPresence; socialPresence = function (o) { _sp.apply(this, arguments); if (G.P && G.P.elev) o.ev = 1; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr.apply(this, arguments); r.ev = !!pr.ev; }; }
function elevDraw(cx, cy) { const M = G.map, P = G.P; if (!M || M.id !== 'japon') return; elevInit(); const L = ELV_LIFT, x0 = cx - 40, x1 = cx + VW + 40, y0 = cy - 60, y1 = cy + VH + 80;
  // sombra y pilares
  for (const sg of ELV.P.segs) { const [ax, ay] = sg.a, [bx, by] = sg.b, h = ay === by; for (let k = 0; k <= sg.len; k++) { const x = (ax + Math.sign(bx - ax) * k) * 16, y = (ay + Math.sign(by - ay) * k) * 16; if (x < x0 || x > x1 || y < y0 || y > y1) continue; const X = Math.round(x - cx), Y = Math.round(y - cy);
    ctx.fillStyle = 'rgba(0,0,0,0.16)'; if (h) ctx.fillRect(X, Y + 2, 16, 14); else ctx.fillRect(X + 2, Y, 14, 16);
    if (k % 4 === 0) { ctx.fillStyle = '#9a9ea6'; ctx.fillRect(X + 5, Y - L + 8, 6, L); ctx.fillStyle = '#7a7e86'; ctx.fillRect(X + 9, Y - L + 8, 2, L); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(X + 3, Y + 6, 10, 3); } } }
  // tablero del viaducto
  for (const sg of ELV.P.segs) { const [ax, ay] = sg.a, [bx, by] = sg.b, h = ay === by; for (let k = 0; k <= sg.len; k++) { const x = (ax + Math.sign(bx - ax) * k) * 16, y = (ay + Math.sign(by - ay) * k) * 16; if (x < x0 || x > x1 || y < y0 || y > y1) continue; const X = Math.round(x - cx), Y = Math.round(y - cy - L);
    ctx.fillStyle = '#c8ccd2'; ctx.fillRect(X - (h ? 0 : 3), Y - (h ? 3 : 0), h ? 16 : 22, h ? 22 : 16); ctx.fillStyle = '#a8acb4'; if (h) { ctx.fillRect(X, Y + 17, 16, 2); ctx.fillRect(X, Y - 3, 16, 1); } else { ctx.fillRect(X + 17, Y, 2, 16); ctx.fillRect(X - 3, Y, 1, 16); }
    ctx.fillStyle = '#6a6e78'; if (h) { ctx.fillRect(X, Y + 4, 16, 1); ctx.fillRect(X, Y + 11, 16, 1); } else { ctx.fillRect(X + 4, Y, 1, 16); ctx.fillRect(X + 11, Y, 1, 16); } } }
  // andenes elevados
  ELV.st.forEach((S, i) => { const p = elevStPos(i), X = Math.round(p.x * 16 + 8 - cx), Y = Math.round(p.y * 16 + 8 - cy - L); if (X < -80 || X > VW + 80 || Y < -80 || Y > VH + 80) return; const h = p.dy === 0;
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; if (h) ctx.fillRect(X - 40, Y + 10, 80, 8); else ctx.fillRect(X + 10, Y - 40, 8, 80); ctx.fillStyle = '#3aa04a'; if (h) ctx.fillRect(X - 40, Y + 17, 80, 2); else ctx.fillRect(X + 17, Y - 40, 2, 80);
    const tn = textSprite(S[1], '#ffffff', '#1a3a2a'); ctx.drawImage(tn, X - tn.width / 2, Y - 26); });
  // trenes (techo abierto en el tuyo: se ve el interior)
  for (let k = 0; k < ELV.nt; k++) { const mine = P && P.elev && P.elev.k === k;
    for (let c = 0; c < 4; c++) { const q = elevCarPos(k, c), X = Math.round(q.x - cx), Y = Math.round(q.y - cy - L); if (X < -60 || X > VW + 60 || Y < -60 || Y > VH + 60) continue; const h = q.h, w = h ? 46 : 18, hh = h ? 18 : 46;
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(X - w / 2 + 3, Y - hh / 2 + 4 + L * 0.0, w, hh);
      ctx.fillStyle = '#f4f4f0'; ctx.fillRect(X - w / 2, Y - hh / 2, w, hh); ctx.fillStyle = k % 2 ? '#3aa04a' : '#d8303a'; if (h) { ctx.fillRect(X - w / 2, Y + hh / 2 - 4, w, 3); } else { ctx.fillRect(X + w / 2 - 4, Y - hh / 2, 3, hh); }
      if (mine || c === 1) { ctx.fillStyle = '#6a7488'; ctx.fillRect(X - w / 2 + 3, Y - hh / 2 + 3, w - 6, hh - 7); ctx.fillStyle = '#2a4a8a'; if (h) { for (let s = -18; s <= 14; s += 6) { ctx.fillRect(X + s, Y - hh / 2 + 3, 4, 3); ctx.fillRect(X + s, Y + hh / 2 - 7, 4, 3); } } else { for (let s = -18; s <= 14; s += 6) { ctx.fillRect(X - w / 2 + 3, Y + s, 3, 4); ctx.fillRect(X + w / 2 - 7, Y + s, 3, 4); } }
        for (let n = 0; n < 2; n++) { const px = X + (h ? (n ? 12 : -14) : 0), py = Y + (h ? 0 : (n ? 12 : -14)); ctx.fillStyle = ['#2a1a14', '#1a1a24'][n]; ctx.fillRect(px - 2, py - 6, 4, 3); ctx.fillStyle = ['#e8c8a8', '#f0d0b0'][n]; ctx.fillRect(px - 2, py - 4, 4, 3); ctx.fillStyle = ['#3a5aa0', '#a03a5a'][n]; ctx.fillRect(px - 3, py - 1, 6, 5); } }
      else { ctx.fillStyle = '#d8dadc'; ctx.fillRect(X - w / 2 + 2, Y - hh / 2 + 2, w - 4, hh - 6); ctx.fillStyle = '#1a2a3a'; if (h) for (let s = -20; s < 20; s += 7) ctx.fillRect(X + s, Y - 2, 5, 3); else for (let s = -20; s < 20; s += 7) ctx.fillRect(X - 2, Y + s, 3, 5); }
      ctx.strokeStyle = '#8a8e96'; ctx.lineWidth = 1; ctx.strokeRect(X - w / 2 + 0.5, Y - hh / 2 + 0.5, w - 1, hh - 1);
      if (mine && c === 1) { P._elevDraw = 1; try { drawEnt(P, cx, cy + L); } catch (e) { } P._elevDraw = 0; } }
    for (const r of G.remote.values()) if (r.ev && r.map === 'japon') { r._elevDraw = 1; try { drawEnt(r, cx, cy + L); } catch (e) { } r._elevDraw = 0; } } }
WORLD_DRAW.push((cx, cy) => { try { elevDraw(cx, cy); } catch (e) { } });

// ---------- al crear Japón: crecer, anillo, bocas de metro y escaleras del elevado ----------
{ const _mj = makeJapan; makeJapan = function () { const had = G.maps.japon, M = _mj.apply(this, arguments); if (!had && M) { try { jpGrow(M); jpsPlace(M); elevPlace(M);
    const p = freePxNear(M, 436 * 16, 156 * 16, 3); if (p) spawnNPC('jpe_guia', p[0], p[1], 'japon', { face: 'down' }); const q = freePxNear(M, 446 * 16, 140 * 16, 4); if (q) spawnNPC('jpe_otaku', q[0], q[1], 'japon', { face: 'right' });
    for (let n = 0; n < 10; n++) { const r = freePxNear(M, (430 + (n % 3) * 7) * 16, (40 + n * 26) * 16, 5); if (r) { const e = spawnNPC('jtpax' + (n % 8), r[0], r[1], 'japon', { wander: 4 }); if (e) e.noTag = 1; } }
    const de = M.drawExtra; M.drawExtra = (cx, cy) => { if (de) de(cx, cy); try { jprDraw(M, cx, cy); } catch (e) { } }; } catch (e) { console.warn('jpGrow', e); } } return M; }; }
// los sentados del tren de Japón usan su propio atlas con «sit»
// (npcAtlas ya lo hace para cualquier NPC con def.sit, ver 6m_vehicles.js)

// ---------- sprites ----------
XSPR.jps_boca = () => { const [c, g] = XC(32, 40); g.fillStyle = '#2a2e36'; g.fillRect(2, 14, 28, 24); g.fillStyle = '#4a4e58'; for (let k = 0; k < 5; k++) g.fillRect(4, 18 + k * 4, 24, 2); g.fillStyle = '#c8ccd4'; g.fillRect(0, 10, 32, 5); g.fillRect(0, 10, 2, 28); g.fillRect(30, 10, 2, 28);
  g.fillStyle = '#1a3a8a'; g.fillRect(4, 0, 24, 11); g.fillStyle = '#ffffff'; g.fillRect(5, 1, 22, 1); jpText(g, '新幹線', 6, 1, '#ffffff', 10); g.fillStyle = '#f0c820'; g.fillRect(0, 36, 32, 2); return { c, ax: 8, ay: 37 }; };
XSPR.jps_pilar = () => { const [c, g] = XC(14, 44); g.fillStyle = '#c8ccd4'; g.fillRect(1, 0, 12, 44); g.fillStyle = '#e8eaee'; g.fillRect(2, 0, 3, 44); g.fillStyle = '#9aa0a8'; g.fillRect(11, 0, 2, 44); g.fillStyle = '#1a3a8a'; g.fillRect(1, 14, 12, 6); g.fillStyle = '#ffffff'; g.fillRect(3, 16, 8, 2); return { c, ax: 7, ay: 43 }; };
XSPR.jps_torno = () => { const [c, g] = XC(14, 22); g.fillStyle = '#8a8e98'; g.fillRect(1, 4, 12, 18); g.fillStyle = '#c8ccd4'; g.fillRect(1, 4, 12, 3); g.fillStyle = '#3aa0ff'; g.fillRect(4, 9, 6, 3); g.fillStyle = '#ffd040'; g.fillRect(5, 0, 4, 4); return { c, ax: 7, ay: 21 }; };
XSPR.jps_asiento = () => { const [c, g] = XC(14, 18); g.fillStyle = '#1a3a7a'; g.fillRect(1, 0, 12, 9); g.fillStyle = '#2a5ab0'; g.fillRect(2, 1, 10, 7); g.fillStyle = '#ffffff'; g.fillRect(3, 1, 8, 3); g.fillStyle = '#24488a'; g.fillRect(1, 9, 12, 6); g.fillStyle = '#5a5e68'; g.fillRect(2, 15, 2, 3); g.fillRect(10, 15, 2, 3); return { c, ax: 7, ay: 16 }; };
XSPR.jpe_escalera = () => { const [c, g] = XC(22, 56); g.fillStyle = '#9a9ea6'; g.fillRect(2, 0, 18, 56); g.fillStyle = '#c8ccd2'; for (let k = 0; k < 13; k++) g.fillRect(4, 4 + k * 4, 14, 2); g.fillStyle = '#3aa04a'; g.fillRect(0, 0, 22, 6); g.fillStyle = '#ffffff'; g.fillRect(3, 2, 16, 1); g.fillStyle = '#6a6e78'; g.fillRect(2, 0, 1, 56); g.fillRect(19, 0, 1, 56); return { c, ax: 11, ay: 55 }; };
XSPR.av_asiento = () => { const [c, g] = XC(14, 18); g.fillStyle = '#5a2a3a'; g.fillRect(1, 0, 12, 9); g.fillStyle = '#8a3a50'; g.fillRect(2, 1, 10, 7); g.fillStyle = '#e8e0d0'; g.fillRect(3, 1, 8, 2); g.fillStyle = '#6a2a3e'; g.fillRect(1, 9, 12, 6); g.fillStyle = '#3a3a44'; g.fillRect(2, 15, 2, 3); g.fillRect(10, 15, 2, 3); return { c, ax: 7, ay: 16 }; };
XSPR.av_galera = () => { const [c, g] = XC(44, 30); g.fillStyle = '#c8ccd4'; g.fillRect(0, 4, 44, 26); g.fillStyle = '#e8eaee'; g.fillRect(0, 4, 44, 3); g.fillStyle = '#8a8e98'; for (let k = 0; k < 4; k++) g.fillRect(3 + k * 10, 10, 8, 16); g.fillStyle = '#ffd040'; g.fillRect(4, 12, 2, 2); return { c, ax: 22, ay: 29 }; };

// ---------- el avión por dentro ----------
const PLANE = { cb: null, end: 0, title: '' };
function makePlaneCabin(id) { if (G.maps[id]) return G.maps[id]; const w = 40, h = 10, N = w * h, I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.IWALL), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], plane: 1 };
  for (let y = 2; y <= 7; y++) for (let x = 2; x <= w - 3; x++) M.ter[I(x, y)] = T.CARPET; M.exit = { x: -9, y: -9 }; prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {})); F('av_galera', 4, 3, { fp: [[0, 0], [-1, 0], [1, 0]] });
  for (let x = 8; x <= w - 4; x += 2) for (const y of [2, 3, 6, 7]) F('av_asiento', x, y, { seat: 1 });
  const R = new RNG(id.length * 131 + 9); for (const o of M.objs) if (o.seat && R.f() < 0.6) { const e = spawnNPC(R.f() < 0.5 ? 'jtpax' + R.int(0, 7) : 'tpax' + R.int(0, 7), o.px, o.py - 2, id, { face: 'down' }); if (e) { e.scene = 1; e.noTag = 1; e.seatO = o; o.taken = e; setAnim(e, 'sit'); } }
  spawnNPC('av_azafata', 14 * 16 + 8, 4 * 16 + 12, id, { wander: 6 }); spawnNPC('av_azafato', 6 * 16 + 8, 5 * 16 + 12, id, { wander: 2 });
  M.drawExtra = (cx, cy) => planeDrawIn(M, cx, cy); G.maps[id] = M; return M; }
function planeDrawIn(M, cx, cy) { const t = G.t, left = Math.max(0, PLANE.end - G.t), dk = darkness();
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) { const X = x * 16 - cx, Y = y * 16 - cy; if (X < -16 || Y < -16 || X > VW || Y > VH) continue; const tt = M.ter[M.I(x, y)];
    if (tt === T.CARPET) { ctx.fillStyle = (y === 4 || y === 5) ? ((x % 2) ? '#4a3a5a' : '#4e3e60') : '#5a5a6a'; ctx.fillRect(X, Y, 16, 16); if (y === 4) { ctx.fillStyle = '#ffd040'; if (x % 3 === 0) ctx.fillRect(X + 6, Y, 4, 1); } }
    else { ctx.fillStyle = '#e8eaee'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = '#c8ccd4'; ctx.fillRect(X, (y < 2 ? Y + 14 : Y), 16, 2); } }
  for (const wy of [2, M.h * 16 - 22]) for (let wx = 8; wx < M.w - 3; wx += 2) { const X = Math.round(wx * 16 + 2 - cx), Y = Math.round(wy - cy); if (X > VW || X < -20) continue; ctx.save(); ctx.beginPath(); ctx.ellipse(X + 6, Y + 8, 6, 8, 0, 0, 7); ctx.clip();
    const g = ctx.createLinearGradient(0, Y, 0, Y + 16); g.addColorStop(0, dk > 0.6 ? '#0a1030' : '#4a8ae8'); g.addColorStop(1, dk > 0.6 ? '#2a2050' : '#bfe0ff'); ctx.fillStyle = g; ctx.fillRect(X, Y, 12, 16); ctx.fillStyle = 'rgba(255,255,255,0.9)'; const s = (t * 30 + wx * 9) % 40; ctx.fillRect(X + 12 - s, Y + 10, 10, 3); ctx.fillRect(X + 22 - s, Y + 4, 6, 2); ctx.restore(); ctx.strokeStyle = '#9aa0a8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(X + 6, Y + 8, 6, 8, 0, 0, 7); ctx.stroke(); }
  const sx = Math.round(20 * 16 - cx), sy = Math.round(16 - cy); ctx.fillStyle = '#1a1a24'; ctx.fillRect(sx, sy, 54, 12); jpText(ctx, PLANE.title || '', sx + 3, sy + 1, '#ffd040', 10);
  if (Math.random() < 0.006) G.shake = Math.max(G.shake || 0, 2.5); }
function planeBoard(title, cb) { const P = G.P, id = /^(ALBOR)/.test(title) ? 'avion_jp' : 'avion_al', M = makePlaneCabin(id); PLANE.cb = cb; PLANE.title = title; PLANE.end = G.t + 62;
  transition(() => { P.plane = 1; PLANE.end = G.t + 60; P.inside = id; setMap(M, 6 * 16 + 8, 5 * 16 + 8, 'right'); banner('✈ ' + title, L2('Busca tu asiento o pasea por el pasillo. Llegada en 1 minuto.', 'Find your seat or walk the aisle. Landing in 1 minute.')); planeUI(); }); if (typeof stampAdd === 'function') stampAdd('avion'); }
let planeEl = null;
function planeUI() { const P = G.P; if (!planeEl) { planeEl = document.createElement('div'); planeEl.id = 'planeBar'; planeEl.className = 'jptbar'; $('#hud').appendChild(planeEl); }
  if (!P.plane) { planeEl.hidden = true; return; } planeEl.hidden = false; const left = Math.max(0, Math.ceil(PLANE.end - G.t)); planeEl.innerHTML = `<b>✈ ${esc(PLANE.title)}</b><span>${left > 50 ? '💺 ' + L2('Abróchese el cinturón · despegando', 'Fasten your seatbelt · taking off') : left > 10 ? '☁ ' + L2('Llegada en ', 'Landing in ') + left + ' s' : '🛬 ' + L2('Aterrizando…', 'Landing…')}</span><div class="row"><button class="btn sm gold" id="plGo">⏩ ${L2('Llegar ya', 'Arrive now')}</button></div>`; $('#plGo').onclick = () => planeArrive(); }
function planeArrive() { const P = G.P; if (!P.plane) return; P.plane = 0; planeUI(); const cb = PLANE.cb; PLANE.cb = null; if (cb) cb(); }
let planeT = 0; V33_TICKS.push(dt => { const P = G.P, M = G.map; if (!P || !P.plane) return; if (!M || !M.plane) { P.plane = 0; planeUI(); return; } planeT -= dt || 0; if (planeT <= 0) { planeT = 1; planeUI(); } if (G.t >= PLANE.end) planeArrive(); });
if (typeof flightCine === 'function') { const _fc = flightCine; flightCine = function (title, cb) { try { if (G.P) { planeBoard(title, cb); return; } } catch (e) { console.warn(e); } return _fc.apply(this, arguments); }; }

// ---------- estilos y Lupa ----------
{ const st = document.createElement('style'); st.textContent = `.jptbar{position:absolute;left:50%;transform:translateX(-50%);top:calc(4.2em + env(safe-area-inset-top,0px));z-index:7;display:flex;flex-direction:column;align-items:center;gap:.2em;padding:.35em .7em;background:rgba(14,9,7,.88);border:2px solid var(--gold);border-radius:.6em;color:#f3e6c8;font-size:.86em;max-width:min(92vw,30em);text-align:center}.jptbar b{color:#ffe08a}.jptbar .row{gap:.3em;margin:0}`; document.head.appendChild(st); }
if (typeof GSIS !== 'undefined') GSIS.splice(1, 0, ['jp_trenes', '🚄 ' + L2('Trenes de Japón y avión', 'Japan trains and plane'), () => [
  L2('Tren bala por el subterráneo: 13 bocas de metro azules (新幹線) en Fuji, Kioto, Akihabara, Tokio, Shinjuku, Asakusa, Aeropuerto, Osaka, Nagasaki, Okinawa, Takayama, Higashiyama y la Bahía Central. Baja, espera en el andén y sube cuando lleguen las puertas abiertas. Billete: 5.000.', 'Underground bullet train: 13 blue metro entrances (新幹線) in Fuji, Kyoto, Akihabara, Tokyo, Shinjuku, Asakusa, Airport, Osaka, Nagasaki, Okinawa, Takayama, Higashiyama and Bay Central. Go down, wait on the platform and board when the doors open. Ticket: 5,000.'),
  L2('Dentro del tren bala puedes pasear por los vagones. En cada estación te pregunta si quieres bajar («Bajar aquí»), o elige el destino con «Elegir destino».', 'Inside the bullet train you can walk through the carriages. At each station it asks if you want to get off («Get off here»), or pick a destination.'),
  L2('Alrededor de toda la isla dan vueltas sin parar dos trenes bala (blanco y azul, verde y rosa) por el viaducto de la costa y la nueva Bahía del Shinkansen (este y sur, con 6 puentes).', 'Two bullet trains (white and blue, green and pink) circle the whole island non-stop on the coastal viaduct and the new Shinkansen Bay (east and south, with 6 bridges).'),
  L2('Metro elevado: un anillo sobre Akihabara, Shinjuku, Tokio y Asakusa. Sube por las escaleras verdes (5.000): verás la ciudad desde arriba y el interior del vagón.', 'Elevated metro: a loop over Akihabara, Shinjuku, Tokyo and Asakusa. Climb the green stairs (5,000): you see the city from above and the inside of the carriage.'),
  L2('Avión: ahora viajas dentro de la cabina, con pasajeros y azafatas. Llegas en un minuto (o «Llegar ya»).', 'Plane: you now travel inside the cabin, with passengers and attendants. You land in a minute (or «Arrive now»).')], () => null]);
