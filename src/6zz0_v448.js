// =====================================================================================
// v4.48: la Torre de los Portales crece — Antesala de los Portales, Coliseo de Cazadores (torneos con
// espectador y apuestas), Salón de Pruebas (fuerza, resistencia, velocidad, examen de rango y misión diaria).
// 30 cazadores nuevos con el estilo del juego (capuchas, capas…), nivel de cazador limitado a 350
// y el medidor de poder igual al del menú.
// =====================================================================================

// ---------- el medidor usa el mismo poder del menú; rangos en esa escala ----------
tpPower = function () { return (G.P && G.P.S && G.P.S.power) || 0; };
HN_RKSC.splice(0, HN_RKSC.length, 0, 3400, 10000, 23000, 36000, 50000);
// ---------- ningún cazador pasa del nivel máximo ----------
{ const _hl = hnLv; hnLv = function (h) { return Math.min(MAXLV, _hl.apply(this, arguments)); }; }

// ---------- 30 cazadores nuevos con el estilo del juego ----------
const HN_NEW_N = { m: ['Darius', 'Kenji', 'Orion', 'Silas', 'Taro', 'Viktor', 'Ezra', 'Ragnar', 'Jun', 'Malik', 'Corvin', 'Haku', 'Leandro', 'Ivo', 'Soren'], f: ['Aiko', 'Mireya', 'Selka', 'Yuna', 'Nadia', 'Freya', 'Kaori', 'Vesna', 'Liora', 'Rin', 'Odette', 'Sakura', 'Ines', 'Zara', 'Ulla'] };
const HN_PROC0 = HN.length;
{ const R = new RNG(SEED + 4848), cls = Object.keys(CLASSES).filter(c => c !== 'pez'), pws = Object.keys(HN_PW);
  for (let j = 0; j < 30; j++) { const i = HN_PROC0 + j, g = j % 2 ? 'f' : 'm', big = R.f() < 0.18, lv = Math.round(30 + Math.pow(R.f(), 1.5) * 310), c = cls[R.int(0, cls.length - 1)], pw = pws[R.int(0, pws.length - 1)];
    const name = HN_NEW_N[g][j >> 1] || ('Cazador ' + i), h = { i, id: 'hn_' + i, name, g, big, lv, cls: c, pw, pers: R.int(0, HN_LINES.length - 1), proc: 1 };
    h.body = big ? (j % 3 === 0 ? 'giant' : 'big') : (j % 4 === 1 ? 'tall' : 'normal'); HN.push(h);
    NPCS[h.id] = { n: name, title: '', look: null, lines: HN_LINES[i % HN_LINES.length] }; NPCS[h.id].look = hnLookProc(h); } }
function hnLookProc(h) { const L = hnLook(h), R = new RNG(SEED + 9191 + h.i * 17), col = HN_PW[h.pw][1], dark = P5([shade(col, -0.8), shade(col, -0.66), shade(col, -0.5), shade(col, -0.32), shade(col, -0.15)]);
  const style = R.int(0, 5);
  if (style === 0) { L.hat = 'hood'; L.hatC = dark; L.cape = { out: dark, in: CLOTH.gris, trim: GOLD.slice(1) }; L.outfit = 'rogue'; }
  else if (style === 1) { L.cape = { out: dark, in: P5(['#2a0a0a', '#4a1414', '#6a1e1e', '#8a2a2a', '#aa3a3a']), trim: GOLD.slice(1) }; L.armor = TIERP[clamp(Math.ceil((G.P ? hnLv(h) : h.lv) / 22), 1, 15)]; }
  else if (style === 2) { L.hat = 'hood'; L.hatC = P5(['#08080c', '#121218', '#1c1c24', '#282832', '#363642']); L.mask = P5(['#1a1a20', '#2c2c36', '#40404c', '#585866', '#747484']); L.outfit = 'rogue'; L.main = P5(['#08080c', '#121218', '#1c1c24', '#282832', '#363642']); }
  else if (style === 3) { L.outfit = 'robe'; L.cape = { out: dark, in: dark, trim: GOLD.slice(1) }; L.scarf = P5([shade(col, -0.5), shade(col, -0.3), col, shade(col, 0.3), shade(col, 0.5)]); }
  else if (style === 4) { L.armor = TIERP[clamp(Math.ceil((G.P ? hnLv(h) : h.lv) / 20), 1, 15)]; L.scarf = P5([shade(col, -0.5), shade(col, -0.3), col, shade(col, 0.3), shade(col, 0.5)]); }
  else { L.outfit = h.g === 'f' ? 'dress' : 'guard'; L.cape = { out: P5(['#c8c8d8', '#d8d8e8', '#e8e8f4', '#f4f4fa', '#ffffff']), in: dark, trim: GOLD.slice(1) }; }
  return L; }
{ const _ha = hnAtlas; hnAtlas = function (h) { if (h && h.proc) return HN_ATL[h.id] || (HN_ATL[h.id] = buildAtlas(hnLookProc(h), ['idle', 'walk', 'atk', 'cast', 'hurt'])); return _ha.apply(this, arguments); }; }

// ---------- muebles nuevos de la Torre ----------
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = C;
  if (kind === 'tp_puerta') { const p = new Pix(40, 52), S = pal(['#7a7a8e', '#a8a8bc', '#d8d8e8', '#ffffff']); p.rect(2, 8, 7, 44, S[1]); p.rect(31, 8, 7, 44, S[1]); p.ell(20, 12, 18, 10, S[2]); p.ell(20, 14, 12, 7, D('#1a1430')); p.rect(9, 14, 22, 38, D('#1a1430')); p.rect(11, 18, 18, 34, D('#2a1e5a')); for (let k = 0; k < 6; k++) p.hl(12, 22 + k * 5, 16, D(k % 2 ? '#4a3a9a' : '#3a2a7a')); p.rect(14, 2, 12, 5, D('#ffd040')); p.hl(14, 2, 12, D('#fff0a0')); p.outline(D('#1a1a2a')); return { c: p.canvas(), ax: 20, ay: 51, light: 1 }; }
  if (kind === 'tp_pilar') { const p = new Pix(16, 50), S = pal(['#a8a8bc', '#d0d0e0', '#ececf6', '#ffffff']); p.rect(1, 44, 14, 6, S[1]); p.rect(3, 6, 10, 38, S[2]); p.vl(4, 6, 38, S[3]); p.vl(11, 6, 38, S[0]); p.rect(1, 2, 14, 5, S[1]); p.hl(3, 20, 10, D('#ffd040')); p.hl(3, 30, 10, D('#ffd040')); p.outline(D('#5a5a6e')); return { c: p.canvas(), ax: 8, ay: 49 }; }
  if (kind === 'tp_estandarte') { const p = new Pix(16, 40); p.rect(7, 0, 2, 40, D('#5a4a2a')); p.rect(2, 3, 12, 26, D('#1a3a8a')); p.rect(3, 4, 10, 24, D('#2a5ac8')); p.poly([[2, 29], [8, 35], [14, 29]], D('#1a3a8a')); p.ell(8, 14, 3, 4, D('#ffd040')); p.set(8, 14, D('#ffffff')); p.outline(D('#0a1a3a')); return { c: p.canvas(), ax: 8, ay: 39 }; }
  if (kind === 'tp_brasero') { const p = new Pix(16, 26); p.rect(4, 18, 8, 8, D('#5a5a6e')); p.rect(2, 14, 12, 4, D('#9a9aae')); p.ell(8, 9, 5, 6, D('#4aa0f0')); p.ell(8, 10, 3, 4, D('#9ad8ff')); p.set(8, 6, D('#ffffff')); p.outline(D('#1a1a2a')); return { c: p.canvas(), ax: 8, ay: 25, light: 1 }; }
  if (kind === 'tp_granportal') { const p = new Pix(56, 64), S = pal(['#2a2238', '#4a3e5e', '#6e6288', '#9a8eb4']); p.rect(2, 10, 9, 54, S[1]); p.rect(45, 10, 9, 54, S[1]); p.vl(3, 10, 54, S[3]); p.vl(46, 10, 54, S[3]); p.ell(28, 12, 26, 11, S[2]); p.ell(28, 14, 18, 8, D('#0a0614')); p.rect(11, 14, 34, 50, D('#0a0614')); p.ell(28, 38, 15, 24, D('#2a0a5a')); p.ell(28, 38, 11, 19, D('#5a2aaa')); p.ell(28, 38, 6, 12, D('#b08aff')); p.ell(28, 38, 2, 5, D('#ffffff')); for (let k = 0; k < 5; k++) { p.set(5, 20 + k * 9, D('#c8a0ff')); p.set(49, 20 + k * 9, D('#c8a0ff')); } p.outline(D('#06040a')); return { c: p.canvas(), ax: 28, ay: 63, light: 1 }; }
  if (kind === 'tp_marcador') { const p = new Pix(52, 40); p.rect(2, 2, 48, 28, D('#1a1a24')); p.rect(4, 4, 44, 24, D('#3a1a2a')); p.rect(6, 6, 18, 8, D('#ffd040')); p.rect(28, 6, 18, 8, D('#8ad0ff')); p.hl(6, 18, 40, D('#ff8a8a')); p.hl(6, 22, 28, D('#8aff8a')); p.rect(10, 30, 4, 10, D('#5a5a6e')); p.rect(38, 30, 4, 10, D('#5a5a6e')); p.outline(D('#0a0a12')); return { c: p.canvas(), ax: 26, ay: 39, light: 1 }; }
  if (kind === 'tp_muneco') { const p = new Pix(20, 32); p.rect(9, 18, 2, 14, D('#6a4a2a')); p.ell(10, 13, 6, 7, D('#c8a060')); p.ell(10, 13, 4, 5, D('#e0c080')); p.ell(10, 4, 4, 4, D('#c8a060')); p.hl(4, 12, 12, D('#8a2a2a')); p.ell(10, 13, 2, 2, D('#c82a2a')); p.outline(D('#3a2a1a')); return { c: p.canvas(), ax: 10, ay: 31 }; }
  if (kind.startsWith('tp_obel')) { const c = { tp_obel_r: '#ff6a3a', tp_obel_v: '#6aff8a', tp_obel_e: '#ffd040', tp_obel_d: '#6ac8ff' }[kind] || '#c8a0ff', p = new Pix(18, 42); p.rect(2, 36, 14, 6, D('#9a9aae')); p.poly([[9, 0], [15, 8], [14, 36], [4, 36], [3, 8]], D('#2a2a3a')); p.poly([[9, 2], [12, 8], [11, 34], [7, 34], [6, 8]], D('#3a3a50')); p.ell(9, 16, 2, 4, D(c)); p.vl(9, 22, 8, D(c)); p.outline(D('#0a0a12')); return { c: p.canvas(), ax: 9, ay: 41, light: 1 }; }
  if (kind === 'tp_estatua') { const p = new Pix(26, 50), S = pal(['#8a8a9e', '#b4b4c8', '#d8d8e8', '#f4f4fa']); p.rect(3, 40, 20, 10, S[1]); p.hl(3, 40, 20, S[3]); p.ell(13, 10, 5, 6, S[2]); p.rect(8, 16, 10, 16, S[2]); p.rect(9, 32, 3, 8, S[1]); p.rect(14, 32, 3, 8, S[1]); p.line(18, 18, 24, 2, S[3]); p.poly([[6, 16], [2, 34], [8, 30]], S[1]); p.outline(D('#4a4a5e')); return { c: p.canvas(), ax: 13, ay: 49 }; }
  if (kind === 'tp_poste') { const p = new Pix(8, 20); p.rect(2, 2, 4, 18, D('#8a1a1a')); p.rect(1, 0, 6, 3, D('#ffd040')); p.outline(D('#2a0a0a')); return { c: p.canvas(), ax: 4, ay: 19 }; }
  return _ge.apply(this, arguments); }; }

// ---------- salas nuevas (cuartos de la Torre) ----------
const TPR = {
  tp_antesala: { n: L2('Antesala de los Portales', 'Portal Antechamber'), w: 60, h: 26, fl: ['#2a2438', '#241f30'], carpet: '#6a1a2a', door: [24, 2] },
  tp_coliseo: { n: L2('Coliseo de Cazadores', 'Hunters\' Coliseum'), w: 50, h: 38, fl: ['#d8c8a8', '#ccbc9a'], door: [45, 16] },
  tp_pruebas: { n: L2('Salón de Pruebas', 'Trial Hall'), w: 46, h: 30, fl: ['#3a4a5a', '#334252'], door: [2, 16] } };
function tprMake(id) { if (G.maps[id]) return G.maps[id]; const R = TPR[id], w = R.w, h = R.h, N = w * h, I = (x, y) => y * w + x;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: id === 'tp_antesala' ? 0.25 : 0, music: id === 'tp_coliseo' ? 'boss' : 'town', I, tw2: 1, fl: R.fl, camps: [] };
  for (let x = 0; x < w; x++) { M.ter[x] = T.IWALL; M.ter[w + x] = T.IWALL; M.ter[(h - 1) * w + x] = T.IWALL; } for (let y = 0; y < h; y++) { M.ter[y * w] = T.IWALL; M.ter[y * w + w - 1] = T.IWALL; }
  const ex = w >> 1; M.ter[(h - 1) * w + ex] = T.FLOOR; M.exit = { x: ex, y: h - 1 }; prepPalettes(M); initMapObjs(M);
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {})), R2 = new RNG(SEED + id.length * 31);
  const hunters = HN.filter(x => x.proc), spawnH = (list, area) => { for (const h_ of list) { let x, y, t = 0; do { x = R2.int(area[0], area[2]); y = R2.int(area[1], area[3]); t++; } while (t < 40 && M.objAt[I(x, y)] >= 0); const e = spawnNPC(h_.id, x * 16 + 8, y * 16 + 8, id, { wander: 2, face: pick(['down', 'left', 'right', 'up']) }); if (e) e.hn = h_; } };
  if (id === 'tp_antesala') {
    DG.forEach((D, i) => F('tp_granportal', 5 + i * 7, 4, [[-1, 0], [0, 0], [1, 0]], { xact: 'tp_portal', dgi: i, gp: 1 }));
    for (let x = 4; x < w - 3; x += 7) { F('tp_pilar', x + 3, 9); F('tp_pilar', x + 3, 20); }
    for (let x = 6; x < w - 4; x += 14) { F('tp_brasero', x, 12); F('tp_brasero', x + 7, 17); }
    for (const x of [3, w - 4]) for (const y of [8, 13, 18]) F('tp_estandarte', x, y);
    F('tp_estatua', ex - 4, 15); F('tp_estatua', ex + 4, 15); F('board', ex + 9, h - 4, null, { xact: 'tp_aviso' });
    spawnNPC('tp_guardia', (ex - 2) * 16 + 8, (h - 4) * 16 + 8, id, { face: 'down' }); spawnNPC('tp_guardia2', (ex + 2) * 16 + 8, (h - 4) * 16 + 8, id, { face: 'down' });
    spawnH(hunters.slice(0, 10), [4, 8, w - 5, h - 5]); }
  if (id === 'tp_coliseo') {
    const cx = ex, cy = 17; M.ring = { x: cx * 16 + 8, y: cy * 16 + 8, rx: 9 * 16, ry: 6 * 16 };
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, x = Math.round(cx + Math.cos(a) * 10.2), y = Math.round(cy + Math.sin(a) * 7); if (k % 2 === 0) F('tp_poste', x, y); }
    for (let x = 4; x < w - 4; x += 3) { addObj(M, 'bench', x, 4); addObj(M, 'bench', x, 30); } for (let y = 8; y < 28; y += 3) { addObj(M, 'bench', 3, y); addObj(M, 'bench', w - 4, y); }
    F('tp_marcador', cx, 2, [[-1, 0], [0, 0], [1, 0]], { xact: 'tp_torneo' }); F('tp_estandarte', cx - 6, 2); F('tp_estandarte', cx + 6, 2);
    spawnNPC('tp_apuestas', (cx + 4) * 16 + 8, 32 * 16 + 8, id, { face: 'down' }); spawnNPC('tp_heraldo', (cx - 4) * 16 + 8, 32 * 16 + 8, id, { face: 'down' });
    const R3 = new RNG(SEED + 333), sp = hunters.slice(10, 24).concat(HN.filter(x => !x.proc).slice(0, 8)); sp.forEach((h_, k) => { const row = k % 2 ? 5 : 31, x = 5 + ((k * 7) % (w - 10)); const e = spawnNPC(h_.id, x * 16 + 8, row * 16 + 8, id, { face: row === 5 ? 'down' : 'up' }); if (e) { e.hn = h_; e.fan = 1; } }); }
  if (id === 'tp_pruebas') {
    F('tp_muneco', 8, 7, null, { xact: 'tp_fuerza' }); F('tp_muneco', 11, 7); F('tp_muneco', 14, 7);
    F('tp_obel_r', 22, 6, null, { xact: 'tp_resist' }); F('tp_obel_v', 30, 6, null, { xact: 'tp_veloc' }); F('tp_obel_e', 38, 6, null, { xact: 'tp_examen' }); F('tp_obel_d', ex, 20, null, { xact: 'tp_diaria' });
    for (const x of [4, w - 5]) for (const y of [10, 18, 24]) F('tp_brasero', x, y); F('tp_estandarte', 18, 2); F('tp_estandarte', 27, 2);
    spawnNPC('tp_instructor', 10 * 16 + 8, 10 * 16 + 8, id, { face: 'down' }); spawnH(hunters.slice(24), [5, 12, w - 6, h - 5]); }
  G.maps[id] = M; return M; }
NPCS.tp_guardia = { n: L2('Guardia Haru', 'Guard Haru'), title: L2('Guardia de la Asociación', 'Association Guard'), look: LK({ hair: HAIRS.negro, outfit: 'guard', main: P5(['#0a1a3a', '#14285a', '#1e3a7a', '#2a4e9a', '#4a6aba']), armor: TIERP[8] }), lines: [L2('Más allá están las puertas. No entre en una por encima de su nivel.', 'Beyond are the gates. Don\'t enter one above your level.'), L2('La semana pasada un rango Cobre entró en una puerta roja… no volvió.', 'Last week a Copper rank entered a red gate… he never came back.')] };
NPCS.tp_guardia2 = { n: L2('Guardia Mina', 'Guard Mina'), title: L2('Guardia de la Asociación', 'Association Guard'), look: LK({ hair: HAIRS.castano, hairStyle: 'long', outfit: 'guard', main: P5(['#0a1a3a', '#14285a', '#1e3a7a', '#2a4e9a', '#4a6aba']), armor: TIERP[8] }), lines: [L2('Revise su equipo y sus pociones antes de cruzar.', 'Check your gear and potions before crossing.'), L2('Si el portal brilla rojo, salga corriendo.', 'If the portal glows red, run.')] };
NPCS.tp_apuestas = { n: L2('Corredor Gin', 'Bookie Gin'), title: L2('Apuestas del Coliseo', 'Coliseum Bets'), look: LK({ hair: HAIRS.rubio, outfit: 'tunic', main: P5(['#3a2a0a', '#5a4214', '#7a5a1e', '#9a7a2a', '#c8a040']) }), lines: [L2('¿Apuesta por el favorito o por la sorpresa?', 'Betting on the favourite or the underdog?')] };
NPCS.tp_heraldo = { n: L2('Heraldo Ryo', 'Herald Ryo'), title: L2('Presentador de torneos', 'Tournament host'), look: LK({ hair: HAIRS.rojo, outfit: 'guard', main: P5(['#3a0a0a', '#5a1414', '#7a1e1e', '#9a2a2a', '#c84040']) }), lines: [L2('¡Damas y caballeros, cazadores de todos los rangos…!', 'Ladies and gentlemen, hunters of every rank…!')] };
NPCS.tp_instructor = { n: L2('Instructora Kaede', 'Instructor Kaede'), title: L2('Pruebas de cazador', 'Hunter trials'), look: LK({ hair: HAIRS.negro, hairStyle: 'long', outfit: 'guard', main: P5(['#0a0a0a', '#1a1a1a', '#2a2a2a', '#3a3a3a', '#5a5a5a']), armor: TIERP[10] }), lines: [L2('El Sistema premia a quien entrena cada día.', 'The System rewards those who train every day.'), L2('Fuerza, resistencia, velocidad… y valor para el examen.', 'Strength, endurance, speed… and the nerve for the exam.')] };
// suelo de cada sala, alfombra roja y arena del coliseo
{ const _bdf = bldDrawFloors; bldDrawFloors = function (M, cx, cy) { _bdf.apply(this, arguments); if (!M || !M.tw2) return; const ex = M.w >> 1;
    for (let y = 1; y < M.h - 1; y++) for (let x = 1; x < M.w - 1; x++) { const sx = x * 16 - cx, sy = y * 16 - cy; if (sx < -16 || sy < -16 || sx > VW || sy > VH) continue; ctx.fillStyle = M.fl[(x + y) % 2]; ctx.fillRect(sx, sy, 16, 16); ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(sx, sy + 15, 16, 1);
      if (M.id === 'tp_antesala' && Math.abs(x - ex) <= 1 && y > 6) { ctx.fillStyle = Math.abs(x - ex) === 1 ? '#8a2a3a' : '#6a1a2a'; ctx.fillRect(sx, sy, 16, 16); if (Math.abs(x - ex) === 1) { ctx.fillStyle = '#ffd040'; ctx.fillRect(x < ex ? sx : sx + 15, sy, 1, 16); } }
      if (M.id === 'tp_antesala' && y === 7) { ctx.fillStyle = '#6a1a2a'; ctx.fillRect(sx, sy + 4, 16, 8); ctx.fillStyle = '#ffd040'; ctx.fillRect(sx, sy + 4, 16, 1); ctx.fillRect(sx, sy + 11, 16, 1); } }
    if (M.ring) { const r = M.ring; ctx.fillStyle = '#c8a878'; ctx.beginPath(); ctx.ellipse(r.x - cx, r.y - cy, r.rx, r.ry, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a1a1a'; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(r.x - cx, r.y - cy, r.rx * 0.35, r.ry * 0.35, 0, 0, 7); ctx.stroke(); } }; }
// remolino de los grandes portales y nombres
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || M.id !== 'tp_antesala') return; for (const o of M.objs) { if (!o.gp) continue; const D = DG[o.dgi], ok = D && dgUnlocked(D), x = o.px - cx, y = o.py - cy - 26;
    for (let k = 0; k < 10; k++) { const a = G.t * (ok ? 2.4 : 0.8) + k * 0.63, r = 3 + k * 1.3; ctx.fillStyle = ok ? ['#c8a0ff', '#8a5aff', '#ffffff', '#5a3aff', '#e0d0ff'][k % 5] : ['#ff4a4a', '#8a1a1a', '#ff8a6a'][k % 3]; ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 1.7), 2, 2); }
    if (D) { const s = textSprite(D[3], ok ? '#ffffff' : '#ff8a8a'), s2 = textSprite(L2('Nv. ', 'Lv. ') + D[2] , ok ? '#ffd040' : '#ff6a6a'); ctx.drawImage(s, Math.round(x - s.width / 2), Math.round(y - 46)); ctx.drawImage(s2, Math.round(x - s2.width / 2), Math.round(y - 37)); } }
  if (Math.random() < 0.3) part(M.w * 8 + (Math.random() - 0.5) * M.w * 14, 7 * 16 + Math.random() * 120, { vz: 8, g: -4, life: 1.6, c: pick(['#8a5aff', '#c8a0ff', '#4aa0f0']), s: 1 }); });
// puertas en el vestíbulo de la Torre
XACT.tp_door = [o => L2('Entrar: ', 'Enter: ') + TPR[o.to].n, 'run', o => tprGo(o.to)];
function tprGo(id) { const P = G.P, M = tprMake(id); P.tprRet = { x: P.x, y: P.y + 16 }; transition(() => { setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); banner(TPR[id].n, L2('Torre de los Portales', 'Portal Tower')); }); }
{ const _ei = exitInterior; exitInterior = function () { const M = G.map, P = G.P; if (M && M.tw2) { tourSpectEnd(true); trialEnd(false, true); const R = P.tprRet; P.tprRet = null; transition(() => { const T_ = makeTower(), d = TPR[M.id].door; setMap(T_, R ? R.x : d[0] * 16 + 8, R ? R.y : (d[1] + 2) * 16 + 8, 'down'); }); return; } return _ei.apply(this, arguments); }; }
{ const _mt = makeTower; makeTower = function () { const fresh = !G.maps.torre_portales, M = _mt.apply(this, arguments); if (fresh) { const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
      for (const id in TPR) { const d = TPR[id].door; F('tp_puerta', d[0], d[1], [[0, 0]], { xact: 'tp_door', to: id }); }
      for (const e of G.ents) if (e.map === 'torre_portales' && e.hn && e.hn.proc) e.remove = true; G.ents = G.ents.filter(e => !e.remove); } return M; }; }
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || !M.tower) return; for (const o of M.objs) { if (o.xact !== 'tp_door') continue; const s = textSprite(TPR[o.to].n, '#ffe8a0'); ctx.drawImage(s, Math.round(o.px - cx - s.width / 2), Math.round(o.py - cy - 60)); } });
XACT.tp_aviso = [L2('Tablón de puertas', 'Gate board'), 'board', () => { const H = hunt(); openModal(`<h2>📜 ${L2('Puertas abiertas hoy', 'Gates open today')}</h2><div class="pvBody">${DG.map(D => { const ok = dgUnlocked(D), c = (H.cleared[D[0]] || 0) + (H.cleared[D[0] + '_eq'] || 0); return `<div class="news ${ok ? 'good' : 'bad'}"><b>${esc(D[3])}</b> · ${L2('Nv. ', 'Lv. ')}${D[2]} · ${L2('Jefe: ', 'Boss: ')}${esc(BOSSES[D[5]].n)} · ${ok ? L2('Abierta para usted', 'Open for you') : L2('Peligro: nivel insuficiente', 'Danger: level too low')} · ${L2('cerrada ', 'cleared ')}${c}×</div>`; }).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal'); $('#mclose').onclick = closeModal; }];

// =====================================================================================
// TORNEOS: duelos 1 contra 1 (8 cazadores), parejas 2 contra 2 y batalla real de 6. Se ven en vivo
// desde las gradas o de cerca en modo espectador; se puede apostar al campeón.
// =====================================================================================
let TOUR = null;
const TOUR_T = { duelo: [L2('Torneo de duelos', 'Duel tournament'), 8, 1], parejas: [L2('Torneo por parejas', 'Pairs tournament'), 8, 2], real: [L2('Batalla real', 'Battle royale'), 6, 1] };
function hnPow(h) { const S = hnStats(h); return S.atk * 2 + S.def * 1.5 + S.maxhp / 10; }
function tourSideName(s) { return s.map(h => h.name).join(' & '); }
function tourStart(type) { if (TOUR) return; const T_ = TOUR_T[type], P = G.P, pool = HN.filter(h => !hnBusy(h)).sort(() => Math.random() - 0.5);
  const center = P.lv, pick8 = pool.sort((a, b) => Math.abs(hnLv(a) - center) - Math.abs(hnLv(b) - center) + (Math.random() - 0.5) * 120).slice(0, T_[1]);
  const sides = []; for (let i = 0; i < pick8.length; i += T_[2]) sides.push(pick8.slice(i, i + T_[2]));
  TOUR = { type, name: T_[0], round: 1, sides, next: [], queue: [], cur: null, pause: 3, log: [], bet: null, champ: null };
  if (type === 'real') TOUR.queue.push(sides); else for (let i = 0; i < sides.length; i += 2) TOUR.queue.push([sides[i], sides[i + 1]]);
  banner(T_[0], L2('¡Empieza en el Coliseo!', 'Starting at the Coliseum!')); tourLog(L2('Comienza: ', 'Starting: ') + T_[0] + ' — ' + sides.map(tourSideName).join(', ')); tourMenu(); }
function tourLog(t) { if (!TOUR) return; TOUR.log.unshift(t); TOUR.log = TOUR.log.slice(0, 30); if (typeof hnLog === 'function') hnLog('🏟 ' + t); }
function tourSpawn(match) { const M = G.maps.tp_coliseo, r = M.ring, n = match.length, ents = [];
  match.forEach((side, si) => side.forEach((h, k) => { const a = si / n * Math.PI * 2 + Math.PI, x = r.x + Math.cos(a) * r.rx * 0.6 + k * 14, y = r.y + Math.sin(a) * r.ry * 0.6; const S = hnStats(h);
    const e = { type: 'tf', h, side: si, name: h.name, x, y, L: 0, map: 'tp_coliseo', dir: 'down', anim: 'idle', af: 0, at: 0, hum: true, S, maxhp: S.maxhp, hp: S.maxhp, cd: 1 + Math.random(), pcd: 3 + Math.random() * 3, shR: 7 }; e.atlas = hnAtlas(h); ents.push(e); G.ents.push(e); addFx({ type: 'ring', x, y, r: 16, dur: 0.5, col: HN_PW[h.pw][1] }); }));
  return ents; }
function tourResolveSim(match) { // fuera del Coliseo: se decide por poder y algo de suerte
  const sc = match.map(s => s.reduce((a, h) => a + hnPow(h), 0) * (0.7 + Math.random() * 0.6)); let b = 0; sc.forEach((v, i) => { if (v > sc[b]) b = i; }); return b; }
function tourTick(dt) { const T_ = TOUR; if (!T_) return; const inCol = G.map && G.map.id === 'tp_coliseo';
  if (!T_.cur) { T_.pause -= dt; if (T_.pause > 0) return; const match = T_.queue.shift();
    if (!match) { if (T_.next.length === 1) return tourFinish(T_.next[0]); T_.round++; T_.queue = []; for (let i = 0; i < T_.next.length; i += 2) T_.queue.push([T_.next[i], T_.next[i + 1]]); T_.next = []; T_.pause = 2; banner(L2('Ronda ', 'Round ') + T_.round, T_.queue.length === 1 ? L2('¡Gran final!', 'Grand final!') : ''); return; }
    T_.cur = { match, ents: inCol ? tourSpawn(match) : null, t: 0 }; tourLog((match.length > 2 ? L2('Batalla real: ', 'Battle royale: ') : '') + match.map(tourSideName).join(' vs ')); if (inCol) { banner(match.map(tourSideName).join('  VS  '), T_.name); sfx('boss'); } return; }
  const C_ = T_.cur; C_.t += dt;
  if (!C_.ents) { if (inCol) { C_.ents = tourSpawn(C_.match); return; } if (C_.t > 6) { const w = tourResolveSim(C_.match); tourWin(C_.match[w]); } return; }
  if (!inCol) { for (const e of C_.ents) e.remove = true; G.ents = G.ents.filter(e => !e.remove); C_.ents = null; C_.t = 0; return; }
  const alive = C_.ents.filter(e => e.hp > 0), sidesAlive = [...new Set(alive.map(e => e.side))];
  if (sidesAlive.length <= 1 || C_.t > 90) { const w = sidesAlive.length ? sidesAlive[0] : tourResolveSim(C_.match); setTimeout(() => { for (const e of C_.ents) e.remove = true; G.ents = G.ents.filter(e => !e.remove); }, 1500); tourWin(C_.match[w]); return; }
  for (const e of alive) tfUpdate(e, alive, dt); }
function tfUpdate(e, alive, dt) { const M = G.map; e.cd -= dt; e.pcd -= dt; let t = null, bd = 1e12; for (const o of alive) if (o.side !== e.side) { const d = dist2(o.x, o.y, e.x, e.y); if (d < bd) { bd = d; t = o; } } if (!t) return;
  const C = CLASSES[e.h.cls] || CLASSES.guerrero, ranged = C.range > 60, want = ranged ? 70 : 18, d = Math.sqrt(bd), dx = t.x - e.x, dy = t.y - e.y; let mv = 0;
  if (d > want + 4) { const sp = 70 * dt; moveEnt(M, e, dx / d * sp, dy / d * sp); mv = 1; } else if (ranged && d < want - 20) { const sp = 50 * dt; moveEnt(M, e, -dx / d * sp, -dy / d * sp); mv = 1; }
  const r = M.ring; if (r) { const nx = (e.x - r.x) / r.rx, ny = (e.y - r.y) / r.ry, q = Math.hypot(nx, ny); if (q > 0.95) { e.x = r.x + nx / q * 0.95 * r.rx; e.y = r.y + ny / q * 0.95 * r.ry; } }
  e.dir = dirFromVec(dx, dy); const dmg = k => Math.max(1, Math.round(e.S.atk * dmgRedP(t.S.def, e.S.lv) * k * (0.85 + Math.random() * 0.3) * 0.6));
  if (e.pcd <= 0 && d < 120) { e.pcd = 6 + Math.random() * 3; setAnim(e, 'cast'); const W = HN_PW[e.h.pw]; if (typeof pwFx === 'function') pwFx(e.h.pw, t.x, t.y, 34); floatText(e.x, e.y - 44, W[0] + '!', W[1]); for (const o of alive) if (o.side !== e.side && dist2(o.x, o.y, t.x, t.y) < 34 * 34) tfHit(o, dmg(2.2)); }
  else if (e.cd <= 0 && d < want + 10) { e.cd = (e.S.aspd || 1) * 1.2; setAnim(e, 'atk'); const cr = Math.random() * 100 < e.S.crit, v = dmg(cr ? 1.6 : 1);
    if (ranged) addFx({ type: 'ring', x: t.x, y: t.y - 8, r: 8, dur: 0.2, col: HN_PW[e.h.pw][1] }); else addFx({ type: 'slash', x: e.x, y: e.y - 8, ang: Math.atan2(dy, dx), arc: 2, r: 22, dur: 0.18, col: HN_PW[e.h.pw][1] }); tfHit(t, v, cr); }
  if (e.anim === 'atk' || e.anim === 'cast') { if (e.af < animN(e, e.anim) - 1) stepAnim(e, dt, 10); else setAnim(e, 'idle'); } else { setAnim(e, mv ? 'walk' : 'idle', true); stepAnim(e, dt, mv ? 9 : 2); } }
function tfHit(o, v, cr) { o.hp -= v; o.flash = 0.1; floatText(o.x, o.y - 34, (cr ? '¡' : '') + fmt(v), cr ? '#ffd040' : '#ffffff'); if (o.hp <= 0) { o.hp = 0; o.dying = 0.01; setAnim(o, 'hurt'); floatText(o.x, o.y - 46, L2('¡Fuera!', 'Out!'), '#ff6a6a'); burst(o.x, o.y - 10, 12, { sp: 60, up: 40, life: 0.6, c: ['#ffffff', HN_PW[o.h.pw][1]] }); } }
function tourWin(side) { const T_ = TOUR; T_.cur = null; T_.pause = 3; tourLog(L2('Gana ', 'Winner: ') + tourSideName(side)); if (G.map && G.map.id === 'tp_coliseo') { banner(L2('¡Gana ', 'Winner: ') + tourSideName(side) + '!', T_.name); sfx('questdone'); }
  if (T_.type === 'real') return tourFinish(side); T_.next.push(side); }
function tourFinish(side) { const T_ = TOUR, P = G.P; T_.champ = side; tourLog('🏆 ' + L2('Campeón: ', 'Champion: ') + tourSideName(side)); banner('🏆 ' + tourSideName(side), L2('Campeón del ', 'Champion of the ') + T_.name); sfx('level');
  if (T_.bet) { if (T_.bet.side.every(h => side.includes(h))) { const g = Math.round(T_.bet.gold * T_.bet.odds); P.gold += g; toast(L2('¡Ganaste la apuesta! +', 'You won the bet! +') + fmt(g) + L2(' oro', ' gold'), 'quest', 6); sfx('coin'); } else toast(L2('Perdiste la apuesta.', 'You lost the bet.'), 'warn', 4); }
  for (const h of side) { const s = hnState(h); s.wm = Math.min(WM_MAX, (hnWm(h)) + 2); }
  TOUR_LAST = { side, name: T_.name }; TOUR = null; tourSpectEnd(); uiDirty.hud = true; markDirty(); }
let TOUR_LAST = null;
V33_TICKS.push(dt => { try { tourTick(dt || 0); } catch (e) { console.warn(e); } });
// nombres y barras de vida sobre los luchadores
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || M.id !== 'tp_coliseo') return; for (const e of G.ents) { if (e.type !== 'tf' || e.map !== M.id || e.remove) continue; const x = Math.round(e.x - cx), y = Math.round(e.y - cy - 46), w = 26;
    ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(x - w / 2 - 1, y - 1, w + 2, 4); ctx.fillStyle = ['#ff6a5a', '#5ab0ff', '#8aff8a', '#ffd040', '#e07aff', '#ffffff'][e.side % 6]; ctx.fillRect(x - w / 2, y, Math.round(w * e.hp / e.maxhp), 2);
    const s = textSprite(e.name + ' ' + L2('Nv.', 'Lv.') + e.S.lv, '#ffffff'); ctx.drawImage(s, x - (s.width >> 1), y - 9 - (e.side % 2) * 9); }
  // gente animando en las gradas
  for (const e of G.ents) if (e.fan && e.map === M.id && TOUR && TOUR.cur && Math.random() < 0.0015) { e.chat = pick([L2('¡Vamos!', 'Come on!'), L2('¡Dale!', 'Go!'), '¡¡' + (TOUR.cur.match[0][0] || {}).name + '!!', L2('¡Increíble!', 'Incredible!'), L2('¡Qué golpe!', 'What a hit!')]); e.chatT = G.t; } });
// los luchadores caídos se desvanecen
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e && e.type === 'tf' && e.hp <= 0) { ctx.globalAlpha = 0.4; const r = _de.apply(this, arguments); ctx.globalAlpha = 1; return r; } return _de.apply(this, arguments); }; }
function tourMenu() { const T_ = TOUR, P = G.P;
  const body = T_ ? `<p><b>${esc(T_.name)}</b> · ${L2('Ronda ', 'Round ')}${T_.round}${T_.cur ? ' · ' + L2('Ahora: ', 'Now: ') + esc(T_.cur.match.map(tourSideName).join(' vs ')) : ''}</p>
      ${T_.bet ? `<p class="hint">${L2('Tu apuesta: ', 'Your bet: ')}<b>${esc(tourSideName(T_.bet.side))}</b> · ${fmt(T_.bet.gold)} ${L2('oro', 'gold')} ×${T_.bet.odds.toFixed(1)}</p>` : T_.round === 1 && !T_.cur ? `<h4>${L2('Apostar al campeón', 'Bet on the champion')}</h4><div class="slist">${T_.sides.map((s, i) => { const tot = T_.sides.reduce((a, x) => a + x.reduce((b, h) => b + hnPow(h), 0), 0), mine = s.reduce((b, h) => b + hnPow(h), 0), odds = clamp(tot / mine / 1.6, 1.2, 9); return `<div class="srow"><div class="sn"><b>${esc(tourSideName(s))}</b><small>${s.map(h => esc(CLASSES[h.cls].n) + ' Nv.' + hnLv(h)).join(' · ')} · ×${odds.toFixed(1)}</small></div><button class="btn sm" data-tb="${i}" data-od="${odds}">${L2('Apostar ', 'Bet ')}${fmt(tourBetAmt())}</button></div>`; }).join('')}</div>` : ''}
      <div class="pvBody">${T_.log.map(l => `<div class="news">${esc(l)}</div>`).join('')}</div>`
    : `<p class="hint">${L2('Elija un torneo. Los cazadores luchan en la arena: mírelo desde las gradas o de cerca.', 'Choose a tournament. Hunters fight in the arena: watch from the stands or up close.')}</p><div class="row">${Object.keys(TOUR_T).map(k => `<button class="btn gold" data-ts="${k}">${esc(TOUR_T[k][0])}</button>`).join('')}</div>${TOUR_LAST ? `<p class="hint">🏆 ${L2('Último campeón: ', 'Last champion: ')}<b>${esc(tourSideName(TOUR_LAST.side))}</b> (${esc(TOUR_LAST.name)})</p>` : ''}`;
  openModal(`<h2>🏟 ${L2('Coliseo de Cazadores', 'Hunters\' Coliseum')}</h2>${body}<div class="row">${T_ ? `<button class="btn gold" id="tsV">📺 ${L2('Ver de cerca', 'Watch up close')}</button>` : ''}${!T_ && TOUR_LAST && TOUR_LAST.side.length === 1 ? `<button class="btn" id="tsC">⚔ ${L2('Retar al campeón', 'Challenge the champion')}</button>` : ''}${G.map.id !== 'tp_coliseo' ? `<button class="btn" id="tsG">🏟 ${L2('Ir al Coliseo', 'Go to the Coliseum')}</button>` : ''}<button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal; $$('[data-ts]').forEach(b => b.onclick = () => { closeModal(); tourStart(b.dataset.ts); });
  $$('[data-tb]').forEach(b => b.onclick = () => { const g = tourBetAmt(); if (P.gold < g) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } P.gold -= g; T_.bet = { side: T_.sides[+b.dataset.tb], gold: g, odds: +b.dataset.od }; sfx('coin'); tourMenu(); });
  const v = $('#tsV'); if (v) v.onclick = () => { closeModal(); tourSpect(); }; const c = $('#tsC'); if (c) c.onclick = () => { closeModal(); const h = TOUR_LAST.side[0]; duelStart({ name: h.name, lv: hnLv(h), pw: h.pw, look: h.proc ? hnLookProc(h) : hnLook(h), h }); };
  const go = $('#tsG'); if (go) go.onclick = () => { closeModal(); if (G.map.tower) tprGo('tp_coliseo'); else { tpGo(); setTimeout(() => tprGo('tp_coliseo'), 900); } }; }
function tourBetAmt() { return Math.max(500, Math.min(50000, Math.round((G.P.gold || 0) * 0.1 / 100) * 100)); }
XACT.tp_torneo = [L2('Torneos', 'Tournaments'), 'star', () => tourMenu()];
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'tp_apuestas' || npc.id === 'tp_heraldo') opts.unshift({ label: L2('Torneos y apuestas', 'Tournaments and bets'), icon: ['star', '#ffd040'], fn: () => { closeDialog(); tourMenu(); } }); });
// ver de cerca: la cámara se va a la arena; tú no puedes moverte ni atacar
let TSPECT = null;
function tourSpect() { const P = G.P; if (G.map.id !== 'tp_coliseo') { if (G.map.tower) tprGo('tp_coliseo'); return; } TSPECT = { x: P.x, y: P.y }; P.spect = true; P.invis = true; const b = document.createElement('button'); b.id = 'tsOut'; b.className = 'btn gold'; b.textContent = '📺 ' + L2('Dejar de mirar', 'Stop watching'); b.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);bottom:calc(9em + env(safe-area-inset-bottom,0px));z-index:40'; b.onclick = () => tourSpectEnd(); document.body.appendChild(b); toast(L2('Mirando el combate de cerca.', 'Watching the fight up close.'), 'info'); }
function tourSpectEnd(silent) { const P = G.P, S = TSPECT; const b = $('#tsOut'); if (b) b.remove(); if (!S) return; TSPECT = null; P.spect = false; P.invis = false; if (G.map && G.map.id === 'tp_coliseo') { P.x = S.x; P.y = S.y; } }
V33_TICKS.push(() => { const P = G.P; if (!TSPECT || !P) return; if (!G.map || G.map.id !== 'tp_coliseo') { tourSpectEnd(true); return; } const r = G.maps.tp_coliseo.ring, fs = G.ents.filter(e => e.type === 'tf' && e.hp > 0 && e.map === 'tp_coliseo'); let x = r.x, y = r.y + 10; if (fs.length) { x = fs.reduce((a, e) => a + e.x, 0) / fs.length; y = fs.reduce((a, e) => a + e.y, 0) / fs.length + 10; } P.x += (x - P.x) * 0.1; P.y += (y - P.y) * 0.1; if (P.S) P.hp = P.S.maxhp; });
// en las pantallas del vestíbulo se ve el torneo en curso
{ const _tw = tpWatch; tpWatch = function () { const r = _tw.apply(this, arguments); try { const box = $('#tpWatch'); if (box && (TOUR || TOUR_LAST)) { const d = document.createElement('div'); d.className = 'news good'; d.innerHTML = '🏟 ' + (TOUR ? esc(TOUR.name) + ' · ' + (TOUR.cur ? esc(TOUR.cur.match.map(tourSideName).join(' vs ')) : L2('entre combates', 'between fights')) : '🏆 ' + esc(tourSideName(TOUR_LAST.side))) + ' '; const b = document.createElement('button'); b.className = 'btn gold sm'; b.textContent = TOUR ? L2('Ver en el Coliseo', 'Watch at the Coliseum') : L2('Coliseo', 'Coliseum'); b.onclick = () => { closeModal(); tourMenu(); }; d.appendChild(b); box.prepend(d); } } catch (e) { } return r; }; }

// =====================================================================================
// SALÓN DE PRUEBAS
// =====================================================================================
let TRIAL = null;
MOBS.tp_dummy = { n: L2('Muñeco de prueba', 'Training dummy'), art: ['bst', 'golem', ['#3a2a1a', '#6a4a2a', '#9a7a4a', '#c8a878'], 1.0, { core: '#ffd040' }], reg: ['portal'], lv: [1, 1], hp: 1e6, atk: 0.01, def: 0.6, spd: 1, ai: 'none', fam: 'dummy', drops: [] };
const TRIAL_REC = () => { const H = hunt(); return H.trial = H.trial || { str: 0, res: 0, vel: 0 }; };
function trialStart(kind) { const P = G.P, M = G.map; if (TRIAL || !M || M.id !== 'tp_pruebas') return;
  if (kind === 'str') { const m = spawnMob('tp_dummy', P.lv, 11 * 16 + 8, 9 * 16 + 8, 0, null, false); m.map = M.id; m.stun = 1e9; m.noXp = 1; m.xp = 0; m.gold = 0; TRIAL = { kind, t: 10, dmg: 0, m }; banner(L2('Prueba de fuerza', 'Strength trial'), L2('¡Golpea al muñeco durante 10 segundos!', 'Hit the dummy for 10 seconds!')); }
  if (kind === 'res') { TRIAL = { kind, t: 45, wave: 0, wt: 0, mobs: [] }; banner(L2('Prueba de resistencia', 'Endurance trial'), L2('Aguanta 45 segundos', 'Survive 45 seconds')); }
  if (kind === 'vel') { const R = new RNG(Date.now() & 0xffff), orbs = []; for (let k = 0; k < 10; k++) orbs.push({ x: (4 + R.int(0, M.w - 9)) * 16 + 8, y: (10 + R.int(0, M.h - 14)) * 16 + 8 }); TRIAL = { kind, t: 30, orbs, got: 0 }; banner(L2('Prueba de velocidad', 'Speed trial'), L2('Recoge las 10 luces en 30 segundos', 'Collect the 10 lights in 30 seconds')); }
  sfx('boss'); }
function trialEnd(ok, silent) { const T_ = TRIAL, P = G.P; if (!T_) return; TRIAL = null; const R = TRIAL_REC();
  if (T_.m) T_.m.remove = true; if (T_.mobs) for (const m of T_.mobs) m.remove = true; if (silent) return;
  if (T_.kind === 'str') { const dps = Math.round(T_.dmg / 10), best = dps > R.str; if (best) R.str = dps; banner(fmt(dps) + L2(' de daño por segundo', ' damage per second'), best ? L2('¡Nuevo récord!', 'New record!') : L2('Récord: ', 'Record: ') + fmt(R.str)); if (best) { giveItem('esencia_portal', 3); wmGain(10); } }
  if (T_.kind === 'res') { if (ok) { R.res++; banner(L2('¡Resististe!', 'You endured!'), L2('Oleadas: ', 'Waves: ') + T_.wave); giveItem('esencia_portal', 4 + T_.wave); gainXp(Math.round(xpToNext(P.lv) * 0.08)); } else banner(L2('Prueba fallida', 'Trial failed'), L2('Oleadas: ', 'Waves: ') + T_.wave); }
  if (T_.kind === 'vel') { if (ok) { const tm = 30 - T_.t, best = !R.vel || tm < R.vel; if (best) R.vel = Math.round(tm * 10) / 10; banner(L2('¡Lo lograste en ', 'Done in ') + tm.toFixed(1) + ' s!', best ? L2('¡Nuevo récord!', 'New record!') : L2('Récord: ', 'Record: ') + R.vel + ' s'); giveItem('esencia_portal', 3); } else banner(L2('Se acabó el tiempo', 'Time\'s up'), T_.got + '/10'); }
  sfx(ok ? 'questdone' : 'hurt'); markDirty(); }
{ const _hm = hitMob; hitMob = function (m, d) { const h0 = m ? m.hp : 0; const r = _hm.apply(this, arguments); if (TRIAL && TRIAL.kind === 'str' && m === TRIAL.m) { TRIAL.dmg += Math.max(0, h0 - m.hp); m.hp = m.maxhp; } return r; }; }
{ const _hp = hurtPlayer; hurtPlayer = function () { const P = G.P; if (TRIAL && TRIAL.kind === 'res' && P) { const r = _hp.apply(this, arguments); if (P.hp <= 1 || P.dead) { P.dead = false; P.hp = Math.max(1, Math.round(P.S.maxhp * 0.3)); trialEnd(false); } return r; } return _hp.apply(this, arguments); }; }
V33_TICKS.push(dt => { const T_ = TRIAL, P = G.P; if (!T_ || !P) return; dt = dt || 0; if (!G.map || G.map.id !== 'tp_pruebas') { trialEnd(false, true); return; } T_.t -= dt;
  if (T_.kind === 'res') { T_.wt -= dt; if (T_.wt <= 0) { T_.wt = 11; T_.wave++; const pool = DG.filter(D => D[2] <= P.lv + 10).pop() || DG[0]; for (let k = 0; k < 2 + T_.wave; k++) { const a = Math.random() * 6.28, m = spawnMob(pick(pool[4]), Math.max(1, P.lv - 3), P.x + Math.cos(a) * 120, P.y + Math.sin(a) * 80, 0, null, false); m.map = G.map.id; m.state = 'chase'; m.aggroR = 999; m.xp = Math.round(m.xp * 0.3); m.gold = 0; T_.mobs.push(m); } toast(L2('Oleada ', 'Wave ') + T_.wave, 'warn', 2); } }
  if (T_.kind === 'vel') { for (const o of T_.orbs) if (!o.got && dist2(o.x, o.y, P.x, P.y) < 14 * 14) { o.got = 1; T_.got++; sfx('coin'); burst(o.x, o.y - 6, 10, { sp: 50, up: 40, life: 0.5, c: ['#8affb0', '#ffffff'] }); } if (T_.got >= 10) return trialEnd(true); }
  if (T_.t <= 0) trialEnd(T_.kind === 'res' || T_.kind === 'str'); });
WORLD_DRAW.push((cx, cy) => { const T_ = TRIAL; if (!T_) return; const s = textSprite('⏱ ' + Math.max(0, T_.t).toFixed(1) + (T_.kind === 'str' ? '  ' + fmt(Math.round(T_.dmg)) : T_.kind === 'vel' ? '  ' + T_.got + '/10' : '  ' + L2('oleada ', 'wave ') + T_.wave), '#ffe070'); ctx.drawImage(s, Math.round(VW / 2 - s.width), 40, s.width * 2, s.height * 2);
  if (T_.kind === 'vel') for (const o of T_.orbs) if (!o.got) { const y = o.y - cy - 10 + Math.sin(G.t * 4 + o.x) * 2; ctx.drawImage(glowSprite(10, '#8affb0'), Math.round(o.x - cx - 10), Math.round(y - 10)); ctx.fillStyle = '#eaffef'; ctx.fillRect(Math.round(o.x - cx - 2), Math.round(y - 2), 4, 4); } });
XACT.tp_fuerza = [L2('Prueba de fuerza (10 s)', 'Strength trial (10 s)'), 'sword', () => trialStart('str')];
XACT.tp_resist = [L2('Prueba de resistencia (45 s)', 'Endurance trial (45 s)'), 'shield', () => trialStart('res')];
XACT.tp_veloc = [L2('Prueba de velocidad (30 s)', 'Speed trial (30 s)'), 'run', () => trialStart('vel')];
// examen de ascenso: duelo contra un examinador del rango siguiente
const EXAM_LV = [50, 100, 160, 230, 300];
XACT.tp_examen = [L2('Examen de ascenso de rango', 'Rank-up exam'), 'star', () => { const H = hunt(), rk = H.rank || 0; if (rk >= 5) { toast(L2('Ya tiene el rango más alto de la Torre.', 'You already hold the Tower\'s top rank.'), 'info'); return; } const lv = EXAM_LV[rk];
  openModal(`<h2>🎖 ${L2('Examen de ascenso', 'Rank-up exam')}</h2><p class="hint">${L2('Vence a un examinador de nivel ', 'Beat an examiner of level ')}${lv} ${L2('para subir a ', 'to rise to ')}<b style="color:${HN_RK[rk + 1][2]}">${esc(rkName(rk + 1))}</b>. ${L2('Si pierde, no pasa nada: puede volver a intentarlo.', 'If you lose, nothing happens: you can try again.')}</p><div class="row"><button class="btn gold" id="exGo">⚔ ${L2('Empezar', 'Start')}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party'); $('#mclose').onclick = closeModal;
  $('#exGo').onclick = () => { closeModal(); duelStart({ name: L2('Examinador ', 'Examiner ') + ['Goto', 'Baek', 'Cha', 'Woo', 'Go'][rk], lv, pw: pick(Object.keys(HN_PW)), look: LK({ hair: HAIRS.negro, outfit: 'guard', main: P5(['#0a0a14', '#14142a', '#1e1e3e', '#2a2a5a', '#3a3a7a']), armor: TIERP[clamp(Math.ceil(lv / 22), 1, 15)], weapon: { k: 'sword', tier: clamp(Math.ceil(lv / 22), 1, 15) } }), exam: rk + 1 }); }; }];
{ const _de = duelEnd; duelEnd = function (won) { const D = DUEL; const r = _de.apply(this, arguments); try { if (won && D && D.o && D.o.exam) { const H = hunt(); if ((H.rank || 0) < D.o.exam) { H.rank = D.o.exam; banner(L2('¡Ascendido a rango ', 'Promoted to rank ') + rkName(H.rank) + '!', L2('Examen superado', 'Exam passed')); hnLog(G.P.name + L2(' superó el examen de rango ', ' passed the rank exam: ') + rkName(H.rank) + '.'); markDirty(true); } } } catch (e) { } return r; }; }

// ---------- misión diaria del Sistema ----------
const DQ_T = [['kill', 50, L2('Derrotar enemigos', 'Defeat enemies')], ['walk', 2000, L2('Recorrer metros', 'Travel metres')], ['skill', 30, L2('Usar habilidades', 'Use skills')], ['portal', 1, L2('Cerrar un portal', 'Close a portal')]];
function dq() { const H = hunt(), k = new Date().toDateString(); if (!H.dq || H.dq.d !== k) H.dq = { d: k, kill: 0, walk: 0, skill: 0, portal: 0, done: 0 }; return H.dq; }
function dqAdd(k, n) { const P = G.P; if (!P || P.spect) return; const Q = dq(); if (Q.done) return; Q[k] = (Q[k] || 0) + n; }
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { if (m && m.type === 'mob' && m.mid !== 'tp_dummy') dqAdd('kill', 1); if (m && m.boss && CAVES[m.map] && CAVES[m.map].dg) dqAdd('portal', 1); } catch (e) { } return r; }; }
{ const _us = useSkill; let last = 0; useSkill = function () { const r = _us.apply(this, arguments); if (G.t - last > 0.4) { last = G.t; dqAdd('skill', 1); } return r; }; }
{ let lx = null, ly = null, lm = null; V33_TICKS.push(() => { const P = G.P; if (!P) return; if (lm === P.map && lx !== null) { const d = Math.hypot(P.x - lx, P.y - ly); if (d > 0 && d < 30) dqAdd('walk', d / 16); } lx = P.x; ly = P.y; lm = P.map; }); }
XACT.tp_diaria = [L2('Misión diaria del Sistema', 'System daily quest'), 'board', () => dqMenu()];
function dqMenu() { const Q = dq(), P = G.P, all = DQ_T.every(([k, n]) => (Q[k] || 0) >= n);
  openModal(`<h2>🔷 ${L2('[ Misión diaria ]', '[ Daily quest ]')}</h2><p class="hint">${L2('Entrenamiento para volverse fuerte. Se renueva cada día.', 'Training to become strong. Renews every day.')}</p><div class="pvBody">${DQ_T.map(([k, n, t]) => `<div class="news ${(Q[k] || 0) >= n ? 'good' : ''}">${esc(t)}: <b>${fmt(Math.min(n, Math.floor(Q[k] || 0)))}/${fmt(n)}</b></div>`).join('')}</div>
    <p class="hint">${L2('Recompensa: +2 puntos de atributo, esencias y oro.', 'Reward: +2 attribute points, essences and gold.')}</p><div class="row"><button class="btn gold" id="dqGo" ${all && !Q.done ? '' : 'disabled'}>${Q.done ? L2('Completada hoy', 'Done today') : L2('Recibir recompensa', 'Claim reward')}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party'); $('#mclose').onclick = closeModal;
  const b = $('#dqGo'); if (b) b.onclick = () => { if (Q.done || !all) return; Q.done = 1; P.apts = (P.apts || 0) + 2; giveItem('esencia_portal', 5); P.gold += 2000 + P.lv * 60; banner(L2('[ Misión diaria completada ]', '[ Daily quest complete ]'), L2('+2 puntos de atributo', '+2 attribute points')); sfx('level'); uiDirty.hud = uiDirty.inv = true; markDirty(true); closeModal(); }; }
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'tp_instructor') { opts.unshift({ label: L2('Misión diaria', 'Daily quest'), icon: ['star', '#6ac8ff'], fn: () => { closeDialog(); dqMenu(); } }); opts.unshift({ label: L2('Récords', 'Records'), icon: ['board'], fn: () => { closeDialog(); const R = TRIAL_REC(); toast(L2('Fuerza: ', 'Strength: ') + fmt(R.str) + L2(' dps · Resistencia: ', ' dps · Endurance: ') + R.res + L2(' · Velocidad: ', ' · Speed: ') + (R.vel ? R.vel + ' s' : '—'), 'info', 6); } }); } });
// en la lupa › Sistemas
if (typeof GSIS !== 'undefined') GSIS.push(['torre2', '🏟 ' + L2('Torre: salas nuevas', 'Tower: new rooms'), () => [L2('Desde el vestíbulo de la Torre de los Portales hay tres puertas: la Antesala (los grandes portales, guardias y tablón de puertas), el Coliseo (torneos de duelos, parejas y batalla real; mírelos desde las gradas o de cerca, apueste al campeón y rételo) y el Salón de Pruebas (fuerza, resistencia, velocidad, examen de ascenso de rango y la misión diaria del Sistema: +2 puntos de atributo al día).', 'From the Portal Tower lobby there are three doors: the Antechamber (great gates, guards and gate board), the Coliseum (duel, pairs and battle royale tournaments; watch from the stands or up close, bet on the champion and challenge them) and the Trial Hall (strength, endurance, speed, rank-up exam and the System daily quest: +2 attribute points a day).')], () => null]);
