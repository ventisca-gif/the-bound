// 5.99 · Torre de los Portales (Sergio: «ahí solo hay cazadores de bajo nivel: que puedan subir a nivel 600; diseños
// nuevos de cazadores con armaduras y formas; las mazmorras se ven repetidas, parecen laberinto: otras zonas, portales de
// nivel más alto, más enemigos; luego te paso los enemigos y los mejoro»).

// =====================================================================================
// 1) ENEMIGOS Y JEFES NUEVOS (niveles 380-610) — arte provisional con las familias del motor, para que Sergio lo mejore
// =====================================================================================
HLOOKS.espadachin_portal = Object.assign({}, HLOOKS.bandido, { main: pal(['#10141c', '#1c2430', '#2a3646', '#3e4e64', '#5a7090']), sec: pal(['#0a3a4a', '#126a7a', '#1aa0b0', '#4ad8e0', '#a8fff8']), cloth: pal(['#08090c', '#101218', '#1a1c24', '#262a34', '#343a48']), eyes: 'brillo' });
HLOOKS.cazador_sombra = Object.assign({}, HLOOKS.bandido, { main: pal(['#06040a', '#0e0a16', '#181224', '#241a36', '#34264c']), sec: pal(['#3a2a06', '#6a4c0a', '#a8780e', '#e0b020', '#fff0a0']), cloth: pal(['#040306', '#0a080e', '#120e18', '#1c1624', '#282034']), eyes: 'brillo' });
HLOOKS.ultimo_portador = Object.assign({}, HLOOKS.bandido, { main: pal(['#1a1a24', '#34344a', '#5a5a78', '#9a9ac0', '#e8e8ff']), sec: pal(['#3a0a2a', '#7a1450', '#c0207a', '#ff5ab0', '#ffc0e8']), cloth: pal(['#0a0a10', '#14141e', '#20202e', '#2e2e42', '#40405a']), eyes: 'brillo' });
const DG2_MOBS = {
  centinela_obsidiana: [L2('Centinela de Obsidiana', 'Obsidian Sentinel'), ['bst', 'golem', ['#050508', '#14141c', '#2a2a36', '#ff7a2a'], 1.3, { core: '#ffb040' }], [380, 420], 2.0, 1.5, 1.8, 32, 'aggro'],
  espadachin_portal: [L2('Espadachín del Portal', 'Portal Swordsman'), ['hum', 'espadachin_portal'], [380, 460], 1.3, 1.6, 1.2, 62, 'aggro'],
  arana_cristal_negro: [L2('Araña de Cristal Negro', 'Black Crystal Spider'), ['bst', 'spider2', ['#04040a', '#14142a', '#2a3a6a', '#8ae0ff'], 1.1], [420, 470], 1.1, 1.6, 1.0, 70, 'aggro'],
  lagarto_cristal: [L2('Lagarto de Cristal', 'Crystal Lizard'), ['bst', 'lizard', ['#04141a', '#0a3a46', '#1a8a9a', '#b0fff4'], 1.2], [430, 480], 1.4, 1.6, 1.3, 58, 'charge'],
  espectro_hundido: [L2('Espectro Hundido', 'Sunken Wraith'), ['bst', 'wisp', ['#020a14', '#0a2a4a', '#1a6a8a', '#8affe0'], 1.2], [470, 520], 1.1, 1.8, 1.0, 60, 'ranged'],
  sapo_hundido: [L2('Sapo de la Ciudad Hundida', 'Sunken City Toad'), ['bst', 'toad', ['#020814', '#0a1e3a', '#1a4a7a', '#6ac8ff'], 1.3], [470, 520], 1.5, 1.5, 1.3, 46, 'aggro'],
  cangrejo_hundido: [L2('Cangrejo Guardián', 'Guardian Crab'), ['bst', 'crab', ['#0a0a14', '#1a2a4a', '#2a5a8a', '#a8e0ff'], 1.3], [480, 520], 1.8, 1.4, 2.0, 40, 'charge'],
  escarabajo_forja: [L2('Escarabajo de la Forja', 'Forge Beetle'), ['bst', 'beetle', ['#1a0600', '#5a1a04', '#c84a0a', '#ffd040'], 1.3], [520, 570], 1.8, 1.6, 2.0, 40, 'charge'],
  golem_forja: [L2('Gólem de la Forja', 'Forge Golem'), ['bst', 'golem', ['#1a0a00', '#5a2a06', '#c8780e', '#ffe08a'], 1.5, { core: '#ffffff' }], [520, 570], 2.3, 1.7, 2.0, 30, 'aggro'],
  cazador_sombra: [L2('Cazador de las Sombras', 'Shadow Hunter'), ['hum', 'cazador_sombra'], [520, 600], 1.3, 1.8, 1.2, 64, 'ranged'],
  arpia_trono: [L2('Arpía del Trono', 'Throne Harpy'), ['bst', 'harpy', ['#1a1424', '#3a2a5a', '#8a6ac8', '#fff0c0'], 1.2], [560, 610], 1.2, 1.8, 1.1, 76, 'ranged'],
  guardian_trono: [L2('Guardián del Trono', 'Throne Guardian'), ['bst', 'golem', ['#2a2430', '#6a6478', '#d8d0e8', '#ffe070'], 1.6, { core: '#ff5ab0' }], [580, 610], 2.5, 1.8, 2.2, 30, 'aggro']
};
for (const id in DG2_MOBS) { const [n, art, lv, hp, atk, def, spd, ai] = DG2_MOBS[id]; MOBS[id] = { n, art, reg: ['portal'], lv, hp, atk, def, spd, ai, fam: id, drops: [['esencia_portal', 0.25]], dg: 1 }; DG_MOBS[id] = DG2_MOBS[id]; }
const DG2_BOSS = {
  castellano_obsidiana: [L2('Castellano de Obsidiana', 'Obsidian Castellan'), 404, ['bst', 'golem', ['#050508', '#1a1a24', '#3a3a4a', '#ff7a2a'], 3.6, { core: '#ffe040' }], ['slam', 'nova', 'charge', 'summon'], 'centinela_obsidiana'],
  reina_cristal: [L2('Reina de Cristal Negro', 'Black Crystal Queen'), 454, ['bst', 'spider2', ['#04040a', '#1a1a3a', '#4a5a9a', '#c8f4ff'], 2.8], ['volley', 'summon', 'field', 'charge', 'blink'], 'arana_cristal_negro'],
  leviatan_hundido: [L2('Leviatán de la Ciudad Hundida', 'Sunken City Leviathan'), 504, ['bst', 'lizard', ['#020814', '#0a2a4a', '#1a6a9a', '#a8f0ff'], 3.2], ['charge', 'rain', 'hop', 'summon', 'nova'], 'sapo_hundido'],
  dios_forja: [L2('El Dios de la Forja', 'The Forge God'), 554, ['bst', 'golem', ['#1a0a00', '#7a3a06', '#e0901a', '#fff0a0'], 3.8, { core: '#ffffff' }], ['slam', 'nova', 'rain', 'summon', 'field'], 'golem_forja'],
  ultimo_portador: [L2('El Último Portador', 'The Last Bearer'), 600, ['hum', 'ultimo_portador'], ['charge', 'blink', 'volley', 'slam', 'summon', 'nova'], 'cazador_sombra']
};
for (const id in DG2_BOSS) { const [n, lv, art, moves, minion] = DG2_BOSS[id]; BOSSES[id] = { n, lv, art, hp: 30, atk: 2.2 + lv / 400, def: 2 + lv / 400, spd: 48, moves, minion, drops: [['esencia_portal', 1, 8], ['diamante', 0.7, 4]], r: 30, cave: 1, dg: 1 }; DG_BOSS[id] = DG2_BOSS[id]; }
// [id, mundo, nivel, nombre, enemigos, jefe, suelo, región] + plano
const DG2 = [
  ['d400', 'world', 400, L2('Fortaleza de Obsidiana', 'Obsidian Fortress'), ['centinela_obsidiana', 'espadachin_portal', 'golem_vacio'], 'castellano_obsidiana', 'COBBLE', 'nhar'],
  ['d450', 'world', 450, L2('Jardín de Cristal Negro', 'Black Crystal Garden'), ['arana_cristal_negro', 'lagarto_cristal', 'espadachin_portal'], 'reina_cristal', 'DUSK', 'cristal'],
  ['d500', 'world', 500, L2('Ciudad Hundida del Portal', 'Sunken Portal City'), ['espectro_hundido', 'sapo_hundido', 'cangrejo_hundido'], 'leviatan_hundido', 'SAND', 'selva'],
  ['d550', 'world', 550, L2('Forja del Dios Caído', 'Fallen God’s Forge'), ['escarabajo_forja', 'golem_forja', 'cazador_sombra'], 'dios_forja', 'ASH', 'nhar'],
  ['d600', 'world', 600, L2('Trono del Último Portal', 'Throne of the Last Portal'), ['cazador_sombra', 'arpia_trono', 'guardian_trono'], 'ultimo_portador', 'COBBLE', 'eclipse']];
for (const D of DG2) DG.push(D);
// la antesala pone un portal cada 7 casillas: se ensancha para que quepan todos
if (typeof TPR !== 'undefined' && TPR.tp_antesala) TPR.tp_antesala.w = Math.max(TPR.tp_antesala.w, 5 + DG.length * 7 + 3);

// =====================================================================================
// 2) PLANOS DE MAZMORRA: cada portal tiene su propia forma (antes todas eran la misma cueva de 8 salas)
// =====================================================================================
// [plano, ancho, alto, más enemigos por grupo]
const DG_LAYOUT = { d50: ['salas', 64, 46, 0], d100: ['cueva', 64, 46, 0], d150: ['anillo', 66, 50, 0], d250: ['arena', 70, 48, 0], d340: ['nave', 60, 64, 1], a170: ['cueva', 64, 46, 0], c210: ['arena', 66, 46, 0], v300: ['nave', 58, 60, 1],
  d400: ['salas', 78, 56, 1], d450: ['anillo', 74, 58, 1], d500: ['arena', 80, 56, 1], d550: ['nave', 64, 72, 1], d600: ['trono', 80, 70, 1] };
const DG_LAYOUT_N = { cueva: L2('Cueva', 'Cave'), salas: L2('Fortaleza de salas', 'Hall fortress'), anillo: L2('Anillo', 'Ring'), arena: L2('Gran salón de columnas', 'Pillared great hall'), nave: L2('Catedral', 'Cathedral'), trono: L2('Sala del trono', 'Throne room') };
{ const _dd = dgDef; dgDef = function (D, team) { const id = _dd.apply(this, arguments), C = CAVES[id], L = DG_LAYOUT[D[0]];
  if (C && L && !C._lay) { C._lay = 1; if (L[0] !== 'cueva') { C.layout = L[0]; C.w = L[1]; C.h = L[2]; } C.more = L[3]; if (L[0] === 'salas' || L[0] === 'nave' || L[0] === 'trono') C.deco = 'mine'; } return id; }; }
// recibe el mapa en muros (T.CWALL), talla el suelo y devuelve [entrada, salas…]; makeCave pone enemigos en cada sala y el jefe en la más lejana
function caveLayout(M, D, R, carve, start) { const w = M.w, h = M.h, I = M.I, F = D.floor, ex = start[0];
  const set = (x, y, t) => { if (x >= 2 && y >= 2 && x < w - 2 && y < h - 2) M.ter[I(x, y)] = t; };
  const rect = (x0, y0, x1, y1, t = F) => { for (let y = Math.round(y0); y <= Math.round(y1); y++) for (let x = Math.round(x0); x <= Math.round(x1); x++) set(x, y, t); };
  const hall = (a, b, r = 1) => { const [x0, y0] = a, [x1, y1] = b; rect(Math.min(x0, x1) - r, y0 - r, Math.max(x0, x1) + r, y0 + r); rect(x1 - r, Math.min(y0, y1) - r, x1 + r, Math.max(y0, y1) + r); };
  const pillar = (x, y) => { rect(x, y, x + 1, y + 1, T.CWALL); };
  const out = [start];
  if (D.layout === 'salas') { // cuadrícula de salas rectangulares unidas por pasillos rectos
    const cols = 3, rows = 3, cw = Math.floor((w - 8) / cols), ch = Math.floor((h - 14) / rows), cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const rw = R.int(Math.floor(cw * 0.45), Math.floor(cw * 0.7)), rh = R.int(Math.floor(ch * 0.45), Math.floor(ch * 0.7)), x0 = 4 + c * cw + R.int(1, cw - rw - 1), y0 = 4 + r * ch + R.int(1, ch - rh - 1);
      rect(x0, y0, x0 + rw, y0 + rh); if (rw > 9 && rh > 7 && R.f() < 0.6) { pillar(x0 + 2, y0 + 2); pillar(x0 + rw - 3, y0 + 2); pillar(x0 + 2, y0 + rh - 3); pillar(x0 + rw - 3, y0 + rh - 3); } cells.push([Math.round(x0 + rw / 2), Math.round(y0 + rh / 2), r, c]); }
    for (const a of cells) for (const b of cells) if ((b[2] === a[2] && b[3] === a[3] + 1) || (b[3] === a[3] && b[2] === a[2] + 1)) if (R.f() < 0.85 || b[2] === 2) hall([a[0], a[1]], [b[0], b[1]]);
    const bottom = cells.filter(c => c[2] === rows - 1).sort((a, b) => Math.abs(a[0] - ex) - Math.abs(b[0] - ex))[0]; hall([ex, h - 7], [bottom[0], bottom[1]], 1);
    // asegurar que todo queda unido: cadena por filas
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols - 1; c++) { const a = cells[r * cols + c], b = cells[r * cols + c + 1]; if (R.f() < 0.35) hall([a[0], a[1]], [b[0], b[1]]); }
    for (let c = 0; c < cols; c++) { const a = cells[c], b = cells[cols + c], d = cells[2 * cols + c]; hall([a[0], a[1]], [b[0], b[1]]); hall([b[0], b[1]], [d[0], d[1]]); }
    cells.sort((a, b) => b[2] - a[2]).forEach(c => out.push([c[0], c[1]])); return out; }
  if (D.layout === 'anillo') { // pasillo circular con salas en el anillo y una cámara central (jefe) unida por 4 puentes
    const cx = w >> 1, cy = Math.round(h * 0.45), rx = Math.floor(w * 0.36), ry = Math.floor(h * 0.32);
    for (let a = 0; a < Math.PI * 2; a += 0.02) { const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry; rect(x - 1.5, y - 1.5, x + 1.5, y + 1.5); }
    rect(cx - 6, cy - 5, cx + 6, cy + 5); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; hall([cx, cy], [Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry)], 1); }
    const n = 7; for (let k = 0; k < n; k++) { const a = Math.PI / 2 + (k + 0.5) / n * Math.PI * 2, x = Math.round(cx + Math.cos(a) * rx), y = Math.round(cy + Math.sin(a) * ry); rect(x - 4, y - 3, x + 4, y + 3); out.push([x, y]); }
    hall([ex, h - 7], [cx, cy + ry], 1); pillar(cx - 3, cy - 2); pillar(cx + 2, cy - 2); out.push([cx, cy + 2]); M._bossPt = [cx, cy + 2]; return out; }
  if (D.layout === 'arena' || D.layout === 'trono') { // gran salón con filas de columnas y alcobas a los lados
    const x0 = 6, x1 = w - 7, y0 = 6, y1 = h - 10; rect(x0, y0, x1, y1);
    for (let y = y0 + 4; y < y1 - 3; y += 6) for (let x = x0 + 5; x < x1 - 4; x += 8) if (Math.abs(x - (w >> 1)) > 4) pillar(x, y);
    const al = []; for (let y = y0 + 6; y < y1 - 4; y += 12) { rect(2, y - 2, x0, y + 2); rect(x1, y - 2, w - 3, y + 2); al.push([3, y], [w - 4, y]); }
    rect(ex - 1, y1, ex + 1, h - 7);
    if (D.layout === 'trono') { rect((w >> 1) - 8, 2, (w >> 1) + 8, y0 + 3); for (let k = -6; k <= 6; k += 4) pillar((w >> 1) + k, y0 + 1); }
    for (let y = y1 - 6; y > y0 + 3; y -= 9) for (const x of [x0 + 8, x1 - 8]) out.push([x, y]); out.push(...al); out.push([w >> 1, D.layout === 'trono' ? 5 : y0 + 2]); M._bossPt = out[out.length - 1]; return out; }
  if (D.layout === 'nave') { // nave larga de catedral con capillas a los lados y el ábside al fondo
    const cx = w >> 1, top = 6, nw = Math.max(6, Math.floor(w * 0.16)); rect(cx - nw, top, cx + nw, h - 7);
    for (let y = top + 6; y < h - 10; y += 5) { pillar(cx - nw + 1, y); pillar(cx + nw - 2, y); }
    for (let y = top + 8, k = 0; y < h - 12; y += 11, k++) { for (const s of [-1, 1]) { const x = cx + s * (nw + 9); rect(x - 5, y - 3, x + 5, y + 3); hall([cx, y], [x, y], 1); out.push([x, y]); } }
    rect(cx - nw - 4, top - 3, cx + nw + 4, top + 4); for (let y = h - 14; y > top + 6; y -= 13) out.push([cx, y]); out.push([cx, top]); M._bossPt = [cx, top]; return out; }
  return null; }
// más enemigos en los portales altos
{ const _mc = makeCave; makeCave = function (id) { const fresh = !G.maps[id], M = _mc.apply(this, arguments), D = CAVES[id]; if (!fresh || !M || !D || !D.dg) return M;
  // el jefe va al sitio que pide el plano (trono, cámara central, ábside); la sala que tenía pasa a ser un grupo más
  const B = M._bossPt; if (B && M.bossAt && (M.bossAt[0] !== B[0] || M.bossAt[1] !== B[1])) { const old = M.bossAt, i = (M.camps || []).findIndex(c => c.x === B[0] && c.y === B[1]); const c = i >= 0 ? M.camps.splice(i, 1)[0] : null;
    if (c) { c.x = old[0]; c.y = old[1]; M.camps.push(c); } M.bossAt = [B[0], B[1]]; }
  if (D.more) for (const c of M.camps || []) c.n += D.more; return M; }; }

// =====================================================================================
// 3) LOS CAZADORES SUBEN DE NIVEL (hasta el nivel máximo)
// =====================================================================================
const hnNeed = lv => 30 + Math.round(lv * 1.6);
function hnGainLv(h, n) { const s = hnState(h); const before = s.lv; s.lv = Math.min(MAXLV, s.lv + n); if (s.lv > before) { delete HN_ATL[h.id]; } return s.lv - before; }
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { if (m && m.type === 'mob' && HUNT.allies.length) for (const a of HUNT.allies) { const h = a.h; if (!h) continue; const s = hnState(h);
      s.hx = (s.hx || 0) + Math.max(1, Math.round((m.lv || 1) / 8)) * (m.boss ? 25 : 1); let up = 0; while (s.lv < MAXLV && s.hx >= hnNeed(s.lv)) { s.hx -= hnNeed(s.lv); s.lv++; up++; }
      if (up) { delete HN_ATL[h.id]; floatText(a.x, a.y - 40, h.name + ' · ' + L2('Nv. ', 'Lv. ') + s.lv, '#ffd040'); } } } catch (e) { } return r; }; }
// cada día los cazadores entrenan por su cuenta (los de bajo nivel suben más)
{ const _nd = newDay; newDay = function () { const r = _nd.apply(this, arguments); try { if (G.P) for (const h of HN) { const lv = hnLv(h); if (lv >= MAXLV) continue; const R = hash2(h.i, calDay(), 77);
      if (R < 0.55) hnGainLv(h, lv < 200 ? 3 : lv < 400 ? 2 : 1); } } catch (e) { } return r; }; }
// al cerrar un portal, los aliados suben dos niveles más
{ const _bk = bossKilled; bossKilled = function (m) { const r = _bk.apply(this, arguments); try { const D = G.map && CAVES[G.map.id]; if (m && D && D.dg && HUNT.allies.length) for (const a of HUNT.allies) if (a.h && hnGainLv(a.h, 2)) toast('⬆ ' + a.h.name + ' · ' + L2('Nv. ', 'Lv. ') + hnLv(a.h), 'quest', 3); } catch (e) { } return r; }; }

// =====================================================================================
// 4) CAZADORES DE ÉLITE (diseños nuevos: armaduras de los tiers altos y transformaciones)
// =====================================================================================
// [nombre, sexo, estructura, clase, poder, nivel, tier de armadura, forma, pelo, piel, título]
const HN_ELITE = [
  ['Valeria Corona Rota', 'f', 1, 'guerrero', 'fuego', 600, 44, 'dragon', 'rubio', 1, L2('La campeona sin rival', 'The unrivalled champion')],
  ['Ashur el Último', 'm', 2, 'guerrero', 'roca', 592, 43, 'dragon', 'negro', 3, L2('Escamas de obsidiana', 'Obsidian scales')],
  ['Nyx Medianoche', 'f', 4, 'asesino', 'mente', 585, 42, 'fantasma', 'platino', 0, L2('Nadie oye sus pasos', 'Nobody hears her steps')],
  ['Kael Ventisca', 'm', 0, 'arquero', 'hielo', 570, 41, 'hielo', 'blanco', 2, L2('Flechas que congelan el aire', 'Arrows that freeze the air')],
  ['Seraphine Alba', 'f', 2, 'bardo', 'aire', 560, 40, 'alado', 'rosa', 1, L2('Canta y caen las tormentas', 'She sings and storms fall')],
  ['Dorian Telar', 'm', 4, 'invocador', 'mente', 548, 39, 'eco', 'morado', 2, L2('Teje portales con los dedos', 'Weaves portals with his fingers')],
  ['Ilse Boceto', 'f', 3, 'mago', 'agua', 530, 38, 'eco', 'azul', 0, L2('Pinta hechizos en el aire', 'Paints spells in the air')],
  ['Bram Colmillo', 'm', 3, 'guerrero', 'roca', 515, 37, 'lobo', 'castano', 3, L2('Aúlla antes de cada portal', 'Howls before every portal')],
  ['Mei Brasa', 'f', 0, 'mago', 'fuego', 498, 36, 'dragon', 'rojo', 1, L2('Llamas con forma de dragón', 'Dragon-shaped flames')],
  ['Oskar Hierro', 'm', 1, 'arquero', 'aire', 470, 35, 'alado', 'gris', 2, L2('Vuela sobre los portales', 'Flies over the portals')],
  ['Lysa Espejo', 'f', 1, 'asesino', 'agua', 452, 34, 'fantasma', 'turquesa', 0, L2('Su reflejo ataca primero', 'Her reflection strikes first')],
  ['Taro Granito', 'm', 2, 'invocador', 'roca', 436, 33, 'alado', 'negro', 4, L2('Invoca gólems de luz', 'Summons golems of light')],
  ['Inés Escarcha', 'f', 3, 'bardo', 'hielo', 418, 32, 'hielo', 'blanco', 1, L2('Un laúd de hielo eterno', 'A lute of eternal ice')],
  ['Rurik Ceniza', 'm', 0, 'guerrero', 'fuego', 400, 31, 'lobo', 'castano', 2, L2('Corre entre el humo', 'Runs through the smoke')]];
const HN_ELITE0 = HN.length;
HN_ELITE.forEach(([name, g, bt, cls, pw, lv, tier, form, hair, skin, title], j) => { const i = HN_ELITE0 + j, id = 'hn_' + i; if (!CLASSES[cls]) cls = 'guerrero'; if (!HN_PW[pw]) pw = 'fuego';
  const h = { i, id, name, g, big: false, lv, cls, pw, pers: j % HN_LINES.length, elite: 1, tier, form: SR[form] ? form : null, hair: HAIRS[hair] ? hair : 'negro', bt, skin, etitle: title, body: 'normal' }; HN.push(h);
  NPCS[id] = { n: name, title: '', look: null, lines: [title].concat(HN_LINES[i % HN_LINES.length] || []), atlas: () => hnAtlas(h) };
  Object.defineProperty(NPCS[id], 'title', { get: () => '★ ' + hnTitle(h), configurable: true }); });
// solo formas que se pueden conseguir (Tejedor y Despertar Dorado están bloqueadas y no dan estadísticas)
const HN_FORM_OK = f => !!(SR[f] && !(SR[f].lv >= 1000));
function hnEliteLook(h, on) { const app = Object.assign({}, DEF_APP, { g: h.g, bt: h.bt || 0, hair: h.hair, skin: h.skin || 0 }), t = h.tier, gear = { weapon: t, head: t, body: t, legs: t, feet: t };
  if (on && h.form && HN_FORM_OK(h.form)) { gear.sr = h.form; gear.sf = h.form === 'lobo' ? 0 : 1; if (h.form === 'lobo') gear.sc = h.hair; } return heroLook(h.cls, app, gear, {}, {}); }
// forma normal fuera de combate; transformado en batalla
const hnEliteAtlas = (h, on) => { const k = h.id + (on ? ':f' : ''); return HN_ATL[k] || (HN_ATL[k] = buildHeroAtlas(hnEliteLook(h, on))); };
{ const _ha = hnAtlas; hnAtlas = function (h) { if (h && h.elite) return hnEliteAtlas(h, false); return _ha.apply(this, arguments); }; }
function hnEliteForm(e, h, on) { if (!!e.eliteOn === on) return; e.eliteOn = on; e.atlas = hnEliteAtlas(h, on);
  if (on) { const S = SR[h.form]; floatText(e.x, e.y - 46, (S ? S.ic + ' ' + (S.f || S.n) : L2('¡Transformación!', 'Transformation!')), (S && S.col) || '#ffd040', true); burst(e.x, e.y - 16, 22, { sp: 90, up: 40, life: 0.6, c: [(S && S.col) || '#ffd040', '#ffffff'] }); addFx({ type: 'ring', x: e.x, y: e.y, r: 26, dur: 0.45, col: (S && S.col) || '#ffd040' }); } }
// aliados en la mazmorra: se transforman si hay enemigos cerca (+15 % de ataque mientras dura)
{ let t = 0; V33_TICKS.push(dt => { t += dt || 0.016; if (t < 0.4) return; t = 0; const M = G.map; if (!M || !HUNT.allies.length) return;
  for (const a of HUNT.allies) { if (!a || !a.h || !a.h.elite || a.remove) continue; const fight = G.ents.some(m => m.type === 'mob' && !m.dying && !m.remove && m.map === M.id && dist2(m.x, m.y, a.x, a.y) < 150 * 150);
    if (fight !== !!a.eliteOn) { hnEliteForm(a, a.h, fight); } } }); }
{ const _ha = huntAtk; huntAtk = function (a) { const d = _ha.apply(this, arguments); return a && a.eliteOn ? Math.round(d * 1.15) : d; }; }
// duelo contra un cazador de élite: su forma normal al empezar y se transforma al 60 % (hnFormOn)
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'hum' && /^duel_/.test(art[1] || '') && typeof DUEL !== 'undefined' && DUEL && DUEL.o && DUEL.o.h && DUEL.o.h.elite) return hnEliteAtlas(DUEL.o.h, false); return _ma.apply(this, arguments); }; }
{ const _fo = hnFormOn; hnFormOn = function (m) { const r = _fo.apply(this, arguments); try { const h = typeof DUEL !== 'undefined' && DUEL && DUEL.o && DUEL.o.h; if (h && h.elite) { m.eliteOn = false; hnEliteForm(m, h, true); } } catch (e) { } return r; }; }
// en la antesala: los de élite esperan junto a los portales altos
{ const _tm = tprMake; tprMake = function (id) { const fresh = !G.maps[id], M = _tm.apply(this, arguments); try { if (fresh && id === 'tp_antesala') HN.filter(h => h.elite).forEach((h, k) => { const x = 5 + (8 + (k % 5)) * 7 - 2 + (k >= 5 ? 3 : 0), y = 12 + Math.floor(k / 5) * 4; const e = spawnNPC(h.id, Math.min(M.w - 4, x) * 16 + 8, y * 16 + 8, id, { wander: 1, face: 'down' }); if (e) e.hn = h; }); } catch (e) { } return M; }; }

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['portales599', '🌀 ' + L2('Torre de los Portales: portales 400-600 y cazadores', 'Portal Tower: portals 400-600 and hunters'), () => [
  L2('Portales nuevos (Antesala de la Torre o botón 🌀): Fortaleza de Obsidiana (400), Jardín de Cristal Negro (450), Ciudad Hundida del Portal (500), Forja del Dios Caído (550) y Trono del Último Portal (600). Tienen más enemigos por grupo.', 'New portals (Tower Antechamber or the 🌀 button): Obsidian Fortress (400), Black Crystal Garden (450), Sunken Portal City (500), Fallen God’s Forge (550) and Throne of the Last Portal (600). They have more enemies per group.'),
  L2('Cada mazmorra tiene su forma: fortaleza de salas, anillo con cámara central, gran salón de columnas, catedral con capillas, sala del trono o cueva.', 'Each dungeon has its own shape: hall fortress, ring with a central chamber, pillared great hall, cathedral with chapels, throne room or cave.'),
  L2('Los cazadores ya suben de nivel hasta el máximo: al pelear contigo (más con jefes), +2 al cerrar un portal y entrenan solos cada día (los de bajo nivel, más rápido).', 'Hunters now level up to the cap: by fighting with you (more with bosses), +2 when a portal closes, and they train on their own every day (low-level ones faster).'),
  L2('14 cazadores de élite (nivel 400-600) con armaduras de los tiers altos y transformaciones: te esperan en la Antesala. Solo te acompañan si su nivel no supera el tuyo en más de 20.', '14 elite hunters (level 400-600) with high-tier armour and transformations wait in the Antechamber. They only join you if their level is no more than 20 above yours.')], () => null]);
