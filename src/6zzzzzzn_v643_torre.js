// ================= 6.43: TORRE INFINITA (Torre de los Portales) =================
// Sergio: un modo distinto dentro de la Torre de los Portales, «Torre Infinita», con salas sin fin; cada piso los enemigos
// suben 5 niveles, entran 5 (más con los pisos), cada 10 pisos un jefe; salen TODOS los enemigos y jefes del juego (y unos
// nuevos) combinados con mecánicas; pueden pasar del nivel 700 (600, 800, 1000…) porque solo es una prueba de resistencia
// con un top. El nivel máximo del jugador sigue siendo 700 y NO se tocan las estadísticas de nadie: mobStats ya calcula la
// fuerza con el nivel, así que un enemigo de nivel 1000 sale solo de la fórmula de siempre.
// - Un solo mapa 'torre_infinita' que se rehace en cada piso (no pesa más por subir: el piso 1000 ocupa lo mismo que el 1).
// - En la torre cada enemigo/jefe usa una COPIA de su ficha con id 'ti_<id>' (propiedad no enumerable de MOBS/BOSSES):
//   no sale en el bestiario ni en la Lupa, no suelta botín de su ficha, no avanza historias ni misiones de jefes
//   (bossKilled se salta) y la ficha original no cambia.
// - Récord en P.ti (best, bestT, runs, lastF) y top en línea ev/ti/{jugador} {n, f, lv, t} (reglas en docs/firebase_rules.json).
const TI_LV = 5, TI_N = 5, TI_BOSS = 10, TI_MAP = 'torre_infinita';
let TI = null;   // partida en curso: { floor, start, t0, kills, ret, mod, cleared, spawned }
const tiSave = () => { const P = G.P; P.ti = P.ti || { best: 0, bestT: 0, runs: 0 }; return P.ti; };
const tiLvOf = f => f * TI_LV, tiCountOf = f => Math.min(9, TI_N + Math.floor(f / 25));
// ---------- enemigos nuevos de la torre (familias del motor con paleta propia; solo salen aquí) ----------
const TI_MOBS = {
  eco_peldano: [L2('Eco del Peldaño', 'Step Echo'), ['bst', 'wisp', ['#140a24', '#3a1a6a', '#8a5ae0', '#f0e0ff'], 1.2], 1.1, 1.7, 1.0, 62, 'ranged'],
  centinela_escalon: [L2('Centinela del Escalón', 'Stair Sentinel'), ['bst', 'golem', ['#2a2a34', '#7a7a8c', '#e4e4f0', '#c070ff'], 1.4, { core: '#e0a0ff' }], 2.2, 1.5, 2.0, 32, 'aggro'],
  arana_vertigo: [L2('Araña del Vértigo', 'Vertigo Spider'), ['bst', 'spider2', ['#0a0806', '#2a2010', '#8a6a20', '#ffe070'], 1.1], 1.1, 1.7, 1.0, 74, 'aggro'],
  lagarto_espiral: [L2('Lagarto Espiral', 'Spiral Lizard'), ['bst', 'lizard', ['#0a0a24', '#1a2a6a', '#2a8aa0', '#a0fff0'], 1.2], 1.4, 1.6, 1.3, 60, 'charge'],
  arpia_cumbre: [L2('Arpía de la Cumbre', 'Summit Harpy'), ['bst', 'harpy', ['#1a1424', '#4a3a6a', '#b09ae0', '#fff4ff'], 1.2], 1.2, 1.8, 1.1, 78, 'ranged'],
  escarabajo_reloj: [L2('Escarabajo de Reloj', 'Clockwork Beetle'), ['bst', 'beetle', ['#1a0e04', '#5a3a10', '#c08a2a', '#fff0a0'], 1.3], 1.8, 1.6, 2.1, 42, 'charge']
};
for (const id in TI_MOBS) { const [n, art, hp, atk, def, spd, ai] = TI_MOBS[id]; MOBS[id] = { n, art, reg: ['torre_inf'], lv: [5, 1000], hp, atk, def, spd, ai, fam: id, drops: [], ti: 1 }; }
const TI_BOSSES = {
  arquitecto_torre: [L2('El Arquitecto de la Torre', 'The Tower Architect'), ['bst', 'golem', ['#24242e', '#8a8a9c', '#f0f0fa', '#c070ff'], 3.8, { core: '#ffffff' }], ['slam', 'nova', 'summon', 'field', 'charge'], 'centinela_escalon'],
  reina_vertigo: [L2('La Reina del Vértigo', 'The Vertigo Queen'), ['bst', 'harpy', ['#1a1030', '#5a3a8a', '#c0a0ff', '#fff8ff'], 3.0], ['volley', 'blink', 'rain', 'summon', 'nova'], 'arpia_cumbre']
};
for (const id in TI_BOSSES) { const [n, art, moves, minion] = TI_BOSSES[id]; BOSSES[id] = { n, lv: 50, art, hp: 30, atk: 2.4, def: 2.2, spd: 50, moves, minion, drops: [], r: 30, cave: 1, ti: 1 }; }
// ---------- reservas de enemigos y jefes: todos los del juego que se pueden pelear ----------
let TI_POOL = null, TI_BPOOL = null;
function tiPools() { if (TI_POOL) return; TI_POOL = Object.keys(MOBS).filter(k => { const d = MOBS[k]; return d && Array.isArray(d.art) && !d.duel && d.fam !== 'duel' && d.ai !== 'passive' && d.hp > 0 && !/^duel_|^crew_rival/.test(k); });
  TI_BPOOL = Object.keys(BOSSES).filter(k => { const d = BOSSES[k]; return d && Array.isArray(d.art) && Array.isArray(d.moves) && d.moves.length && !d.duel && !/^duel_|^crew_rival/.test(k) && !tiStoryBoss(k, d); }); }
// Sergio: en la torre no salen súper jefes ni jefes de historia: SUPER_BOSS, los de los fragmentos y misiones de la historia
// principal (frag/quest/reward), los que la historia pone en un sitio fijo (where sin cueva), los de Dawn y los Ecos de Nihil.
const TI_STORY_RE = /^(dawn_|shells_|orange_|alvida|nezumi|jy_|inf_|shimo_|mhq_|crew_|eco_nihil|devorador_carmesi|coloso_telar)/;
function tiStoryBoss(k, d) { return (typeof SUPER_BOSS !== 'undefined' && SUPER_BOSS[k] !== undefined) || d.frag || d.quest || d.reward || (d.where && !d.cave) || TI_STORY_RE.test(k); }
// copia de la ficha (no enumerable: no aparece en listas, bestiario ni Lupa)
function tiDef(id, boss) { const T_ = boss ? BOSSES : MOBS, key = 'ti_' + id; if (!Object.prototype.hasOwnProperty.call(T_, key)) { const src = T_[id]; if (!src) return null;
  Object.defineProperty(T_, key, { value: Object.assign({}, src, { drops: [], ti: 1, minion: boss && src.minion && MOBS[src.minion] ? src.minion : src.minion }), enumerable: false, configurable: true, writable: true }); } return key; }
// ---------- mecánicas por piso ----------
const TI_MODS = {
  rapidos: [L2('Enemigos rápidos', 'Fast enemies'), m => { m.spd = (m.spd || 40) * 1.35; }],
  acorazados: [L2('Acorazados', 'Armored'), m => { m.df = Math.round(m.df * 1.6); }],
  furiosos: [L2('Furiosos', 'Furious'), m => { m.atk = Math.round(m.atk * 1.25); m.hp = m.maxhp = Math.round(m.maxhp * 0.85); }],
  enjambre: [L2('Enjambre', 'Swarm'), m => { m.hp = m.maxhp = Math.round(m.maxhp * 0.6); }],
  elite: [L2('Con élite', 'With an elite'), null],
  oscuridad: [L2('Oscuridad', 'Darkness'), null],
  regeneran: [L2('Se regeneran', 'They regenerate'), m => { m.tiRegen = 1; }],
  explosivos: [L2('Explotan al morir', 'Explode on death'), m => { m.tiBoom = 1; }]
};
const TI_MOD_K = Object.keys(TI_MODS);
function tiRng(f) { return new RNG(SEED * 13 + f * 7919 + 17); }
function tiModFor(f) { if (f < 5 || f % TI_BOSS === 0) return null; const R = tiRng(f); return R.f() < 0.25 ? null : TI_MOD_K[R.int(0, TI_MOD_K.length - 1)]; }
// ---------- el mapa: una sala por piso, con 4 formas y 8 temas que cambian cada 10 pisos ----------
const TI_THEME = [['#ecebf6', '#dcdaea', '#b48cff', 'mármol'], ['#2a2630', '#221e28', '#ff6a3a', 'obsidiana'], ['#d8efe2', '#c4e2d0', '#3ac08a', 'jade'], ['#dbe6f6', '#c8d6ee', '#4a8aff', 'zafiro'],
  ['#f6ecd2', '#ecdcb6', '#e0a020', 'oro'], ['#c8c4c0', '#b4b0ac', '#7a7a8a', 'ceniza'], ['#f0d8d8', '#e2c0c0', '#e0304a', 'carmesí'], ['#1a1a2e', '#14142a', '#8a5aff', 'abismo']];
function tiMake(f) { delete G.maps[TI_MAP]; const lay = ['circulo', 'columnas', 'cruz', 'anillo'][f % 4], w = 30, h = 26, N = w * h, I = (x, y) => y * w + x;
  const M = { id: TI_MAP, w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'cave', I, ti: 1, tiF: f, tiTheme: TI_THEME[Math.floor((f - 1) / 10) % TI_THEME.length] };
  const wall = (x, y) => { if (x >= 0 && y >= 0 && x < w && y < h) M.ter[I(x, y)] = T.IWALL; };
  for (let x = 0; x < w; x++) { wall(x, 0); wall(x, 1); wall(x, h - 1); } for (let y = 0; y < h; y++) { wall(0, y); wall(w - 1, y); }
  const cx = w >> 1, cy = (h >> 1) + 1;
  if (lay === 'circulo' || lay === 'anillo') for (let y = 2; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const d = Math.hypot((x - cx) / 13.5, (y - cy) / 11); if (d > 1) wall(x, y); }
  if (lay === 'cruz') for (let y = 2; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const inV = Math.abs(x - cx) <= 4, inH = Math.abs(y - cy) <= 4; if (!inV && !inH && (Math.abs(x - cx) > 8 || Math.abs(y - cy) > 7)) wall(x, y); }
  const ex = cx; M.ter[I(ex, h - 1)] = T.FLOOR; for (let y = h - 4; y < h; y++) M.ter[I(ex, y)] = T.FLOOR; M.exit = { x: ex, y: h - 1 };
  prepPalettes(M); initMapObjs(M);
  const pil = (x, y) => { if (M.ter[I(x, y)] === T.FLOOR && M.objAt[I(x, y)] < 0 && Math.abs(x - ex) + Math.abs(y - (h - 3)) > 4) addObj(M, 'crystal', x, y); };
  if (lay === 'columnas') for (const [x, y] of [[cx - 7, cy - 5], [cx + 7, cy - 5], [cx - 7, cy + 4], [cx + 7, cy + 4], [cx - 11, cy], [cx + 11, cy]]) pil(x, y);
  if (lay === 'anillo') for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; pil(Math.round(cx + Math.cos(a) * 5), Math.round(cy + Math.sin(a) * 4)); }
  if (lay === 'cruz') for (const [x, y] of [[cx - 4, cy - 4], [cx + 4, cy - 4], [cx - 4, cy + 4], [cx + 4, cy + 4]]) pil(x, y);
  for (const [x, y] of [[3, 3], [w - 4, 3]]) if (M.ter[I(x, y)] === T.FLOOR) addObj(M, 'lantern', x, y, { kind: 0 });
  M.lights = []; G.maps[TI_MAP] = M; return M; }
// suelo de la torre: baldosas del tema y un círculo de runas en el centro
hookAfter('bldDrawFloors', (r, M, cx, cy) => { if (!M || !M.ti) return; const th = M.tiTheme, w = M.w, h = M.h;
  for (let y = 1; y < h; y++) for (let x = 1; x < w - 1; x++) { if (M.ter[M.I(x, y)] !== T.FLOOR) continue; const sx = x * 16 - cx, sy = y * 16 - cy; if (sx < -16 || sy < -16 || sx > VW || sy > VH) continue;
    ctx.fillStyle = (x + y) % 2 ? th[0] : th[1]; ctx.fillRect(sx, sy, 16, 16); ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fillRect(sx, sy + 15, 16, 1); if ((x * 5 + y * 3) % 13 === 0) { ctx.fillStyle = th[2] + '40'; ctx.fillRect(sx + 4, sy + 6, 7, 1); } }
  const ox = (w >> 1) * 16 + 8 - cx, oy = ((h >> 1) + 1) * 16 + 8 - cy; ctx.strokeStyle = th[2] + '66'; ctx.lineWidth = 1; for (const r of [34, 46]) { ctx.beginPath(); ctx.ellipse(ox, oy, r, r * 0.7, 0, 0, 7); ctx.stroke(); }
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6 + G.t * 0.2; ctx.fillStyle = th[2] + '99'; ctx.fillRect(Math.round(ox + Math.cos(a) * 40) - 1, Math.round(oy + Math.sin(a) * 28) - 1, 3, 2); } });
// ---------- entrada en la Torre de los Portales ----------
hookAfter('makeTower', M => { if (!M || M._tiDoor) return; M._tiDoor = 1; const ex = M.w >> 1;
  const spots = [[ex, 16], [ex, 15], [ex - 3, 16], [ex + 3, 16]]; for (const [x, y] of spots) { const i = M.I(x, y); if (M.objAt[i] < 0 && !SOLID_T[M.ter[i]]) { addObj(M, 'furn', x, y, { f: 'tp_portal', fp: [[0, 0], [-1, 0], [1, 0]], xact: 'ti_open', tiDoor: 1 }); break; } } });
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M) return;
  if (M.tower) for (const o of M.objs) { if (o.xact !== 'ti_open') continue; const x = o.px - cx, y = o.py - cy - 23; for (let k = 0; k < 8; k++) { const a = G.t * 2.6 + k * 0.785, r = 4 + k * 1.4; ctx.fillStyle = ['#ffe070', '#ffb020', '#ffffff', '#ff8a2a', '#fff0b0', '#ffd040', '#ffffff', '#ffa040'][k]; ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 1.6), 2, 2); }
    const s = textSprite(L2('TORRE INFINITA', 'INFINITE TOWER'), '#ffe070'); ctx.drawImage(s, Math.round(x - s.width / 2), y - 34); }
  if (M.ti) { for (const o of M.objs) { if (o.xact !== 'ti_next' || o.hidden) continue; const x = o.px - cx, y = o.py - cy - 23; for (let k = 0; k < 8; k++) { const a = G.t * 3 + k * 0.785, r = 4 + k * 1.5; ctx.fillStyle = ['#c8a0ff', '#ffffff', '#8a5aff', '#e0d0ff'][k % 4]; ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r * 1.6), 2, 2); } const s = textSprite(L2('PISO ', 'FLOOR ') + (M.tiF + 1), '#ffffff'); ctx.drawImage(s, Math.round(x - s.width / 2), y - 32); }
    if (TI) { const s = textSprite(L2('Piso ', 'Floor ') + TI.floor + ' - ' + L2('Nv. ', 'Lv. ') + tiLvOf(TI.floor) + (TI.mod ? ' - ' + TI_MODS[TI.mod][0] : ''), '#ffe8a0'); ctx.drawImage(s, Math.round(VW / 2 - s.width / 2), 4); } } });
XACT.ti_open = [L2('Torre Infinita', 'Infinite Tower'), 'talk', () => tiOpen()];
XACT.ti_next = [L2('Subir al siguiente piso', 'Climb to the next floor'), 'door', () => tiNext()];
// ---------- ventana de inicio y top ----------
function tiOpen() { const P = G.P, S = tiSave(), cp = S.best >= 11 ? Math.floor((S.best - 1) / 10) * 10 + 1 : 0;
  openModal(`<div class="frame"><h3>♾ ${L2('Torre Infinita', 'Infinite Tower')}</h3><p class="hint">${L2('Salas sin fin. Cada piso los enemigos suben 5 niveles y entran 5 o más; cada 10 pisos, un jefe. Salen todos los enemigos del mundo y los jefes de zona, cueva y portal (sin súper jefes ni jefes de la historia), mezclados con mecánicas. Llega lo más alto que puedas: si caes o sales, la subida termina y tu récord queda en el top.', 'Endless rooms. Each floor enemies gain 5 levels and 5 or more come in; every 10 floors, a boss. Every enemy in the world and the zone, cave and portal bosses show up (no super bosses or story bosses), mixed with mechanics. Climb as high as you can: if you fall or leave, the climb ends and your record goes on the leaderboard.')}</p>
    <p>🏆 ${L2('Tu récord', 'Your record')}: <b>${S.best ? L2('piso ', 'floor ') + S.best + ' (' + L2('nivel ', 'level ') + tiLvOf(S.best) + ')' : '—'}</b> · ${L2('subidas', 'climbs')}: ${S.runs || 0}</p>
    <div class="row"><button class="btn gold" id="tiGo1">${L2('Empezar en el piso 1', 'Start at floor 1')}</button>${cp ? `<button class="btn" id="tiGoCp">${L2('Empezar en el piso ', 'Start at floor ') + cp}</button>` : ''}<button class="btn" id="tiX">${L2('Cerrar', 'Close')}</button></div>
    <h4>👥 ${L2('Equipo de 4', 'Team of 4')}</h4><p class="hint">${L2('Tú y 3 compañeros elegidos entre los cazadores de los portales y los jugadores cazadores de tu nivel. Récord del equipo: piso ', 'You and 3 companions chosen from the portal hunters and player hunters of your level. Team record: floor ')}${S.best4 || 0} (${L2('sin top', 'no leaderboard')}).</p><div class="row"><button class="btn" id="tiGoT">${L2('Subir en equipo', 'Climb as a team')}</button></div>
    <h4>🌐 ${L2('En línea (solo jugadores)', 'Online (players only)')}</h4><p class="hint">${L2('Con tu grupo en línea, hasta 4 o hasta 7 jugadores. Sin top: solo es para ver cuánto aguantáis. Empieza el líder del grupo; los demás tienen que estar en la Torre de los Portales.', 'With your online group, up to 4 or up to 7 players. No leaderboard: just to see how long you last. The group leader starts; the others must be in the Portal Tower.')}</p><div class="row"><button class="btn" id="tiGoO4">${L2('En línea · máx. 4', 'Online · max 4')}</button><button class="btn" id="tiGoO7">${L2('En línea · máx. 7', 'Online · max 7')}</button></div>
    <h4>🌐 ${L2('Top de la Torre Infinita', 'Infinite Tower leaderboard')}</h4><div id="tiTop" class="hint">${L2('Cargando…', 'Loading…')}</div></div>`);
  $('#tiGo1').onclick = () => { closeModal(); tiStart(1); }; $('#tiGoT').onclick = () => { closeModal(); tiStart(1, 'team'); }; $('#tiGoO4').onclick = () => tioHost(4); $('#tiGoO7').onclick = () => tioHost(7); const b = $('#tiGoCp'); if (b) b.onclick = () => { closeModal(); tiStart(cp); }; $('#tiX').onclick = () => closeModal();
  tiTopShow(); }
function tiTopShow() { const el = () => $('#tiTop'), P = G.P, S = tiSave(), me = typeof evMe === 'function' ? evMe() : '';
  const local = `<p>1. ${esc(P.name)} · ${L2('piso ', 'floor ')}${S.best || 0}</p>`;
  if (typeof evNet !== 'function' || !evNet() || typeof evTop !== 'function') { if (el()) el().innerHTML = local + `<p class="hint">${L2('Sin conexión: solo se ve tu récord.', 'Offline: only your record is shown.')}</p>`; return; }
  evTop('ev/ti', 'f').then(rows => { if (!el()) return; if (!rows.length) { el().innerHTML = local; return; }
    el().innerHTML = rows.slice(0, 10).map(([id, r], i) => `<p${id === me ? ' style="color:#ffe070"' : ''}>${i + 1}. ${esc(cleanStr(r.n, 20) || '?')} · ${L2('piso ', 'floor ')}${r.f | 0}${r.lv ? ' · ' + L2('Nv. ', 'Lv. ') + (r.lv | 0) : ''}</p>`).join(''); }).catch(() => { if (el()) el().innerHTML = local; }); }
function tiPush() { const P = G.P, S = tiSave(); if (!S.best || typeof evNet !== 'function' || !evNet()) return; try { clanReq('ev/ti/' + evMe(), { m: 'PUT', b: { n: cleanStr(P.name, 20) || '?', f: Math.min(100000, S.best | 0), lv: clamp(P.lv | 0, 1, MAXLV), t: clanTs } }).catch(() => { }); } catch (e) { } }
// ---------- la subida ----------
function tiStart(f, mode) { const P = G.P; if (TI || P.dead) return; const S = tiSave(); S.runs = (S.runs || 0) + 1; tiPools();
  TI = { floor: f, start: f, t0: Date.now(), kills: 0, ret: { m: G.map.id, x: P.x, y: P.y, inside: P.inside }, mod: null, cleared: false, spawned: false, mode: mode || 'solo' };
  tiEnterFloor(f, true); }
function tiEnterFloor(f, first) { const P = G.P; TI.floor = f; TI.cleared = false; TI.spawned = false; TI.mod = tiModFor(f); const M = tiMake(f); if (TI.mod === 'oscuridad') M.dark = 0.72;
  const go = () => { P.inside = null; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 2) * 16 + 8, 'up'); const boss = f % TI_BOSS === 0; if (TI.mode === 'team' && !HUNT.allies.length) tiAllies(M); if (TI.mode === 'online' && TIO) { TIO.f = f; TIO.kd = []; }
    banner(L2('Torre Infinita · Piso ', 'Infinite Tower · Floor ') + f, L2('Nivel ', 'Level ') + tiLvOf(f) + (boss ? ' · ' + L2('¡JEFE!', 'BOSS!') : '') + (TI.mod ? ' · ' + TI_MODS[TI.mod][0] : '')); sfx(boss ? 'boss' : 'door');
    setTimeout(() => { if (TI && TI.floor === f && G.map === M) tiSpawn(M, f); }, 1100); };
  transition(go); }
function tiSpawn(M, f) { if (!TI || TI.spawned) return; TI.spawned = true; const R = tiRng(f), lv = tiLvOf(f), cx = (M.w >> 1) * 16 + 8, cy = ((M.h >> 1) - 1) * 16 + 8, P = G.P;
  const free = () => { for (let t = 0; t < 60; t++) { const x = cx + (R.f() - 0.5) * 300, y = cy + (R.f() - 0.6) * 200, tx = Math.floor(x / 16), ty = Math.floor(y / 16); if (!blockedFor(M, tx, ty, 0) && Math.hypot(x - P.x, y - P.y) > 120) return [x, y]; } return [cx, cy]; };
  let idx = 0; const nOn = TI.mode === 'online' ? tioCount() : 1;
  const mk = (id, boss, x, y) => { const key = tiDef(id, boss); if (!key) return null; const m = spawnMob(key, lv, x, y, 0, null, boss); if (!m) return null; m.map = TI_MAP; m.ti = 1; m.tioI = idx++; if (nOn > 1) { m.hp = m.maxhp = Math.round(m.maxhp * (1 + 0.35 * (nOn - 1))); } m.state = 'chase'; m.aggroR = 999; m.gold = Math.round((m.gold || 0) * 0.5);
    addFx({ type: 'ring', x, y, r: boss ? 40 : 18, dur: 0.6, col: boss ? '#ff5050' : '#c8a0ff' }); const mod = TI.mod && TI_MODS[TI.mod][1]; if (mod && !boss) try { mod(m); } catch (e) { } return m; };
  if (f % TI_BOSS === 0) { const special = f % 50 === 0 ? (f % 100 === 0 ? 'reina_vertigo' : 'arquitecto_torre') : null, id = special || TI_BPOOL[R.int(0, TI_BPOOL.length - 1)];
    const b = mk(id, true, cx, cy - 30); if (b) { b.tiBossF = f; if (typeof showBoss === 'function') try { showBoss(b); } catch (e) { } }
    for (let k = 0; k < Math.min(4, 1 + Math.floor(f / 100)); k++) { const [x, y] = free(); mk(TI_POOL[R.int(0, TI_POOL.length - 1)], false, x, y); } return; }
  const n = tiCountOf(f) + (TI.mod === 'enjambre' ? 3 : 0), newOnes = Object.keys(TI_MOBS);
  for (let k = 0; k < n; k++) { const id = (k === 0 && R.f() < 0.35) ? newOnes[R.int(0, newOnes.length - 1)] : TI_POOL[R.int(0, TI_POOL.length - 1)], [x, y] = free(), m = mk(id, false, x, y);
    if (m && TI.mod === 'elite' && k === 0) { m.elite = 1; m.hp = m.maxhp = Math.round(m.maxhp * 3.5); m.atk = Math.round(m.atk * 1.4); m.name = L2('Élite ', 'Elite ') + m.name; } } }
function tiAlive() { let n = 0; for (const e of G.ents) if (e.type === 'mob' && e.ti && !e.dying && !e.remove && e.hp > 0 && e.map === TI_MAP) n++; return n; }
function tiCleared() { const P = G.P, M = G.map, S = tiSave(), f = TI.floor; TI.cleared = true;
  if (TI.mode === 'team') { if (f > (S.best4 || 0)) S.best4 = f; } else if (TI.mode === 'online') { S.lastOn = f; } else if (f > (S.best || 0)) { S.best = f; S.bestT = Date.now(); tiPush(); toast('🏆 ' + L2('¡Nuevo récord: piso ', 'New record: floor ') + f + '!', 'quest', 4); }
  S.lastF = f; markDirty(true); const boss = f % TI_BOSS === 0;
  P.hp = Math.min(P.S.maxhp, P.hp + Math.round(P.S.maxhp * (boss ? 1 : 0.2))); if (P.S.maxmp) P.mp = Math.min(P.S.maxmp, (P.mp || 0) + Math.round(P.S.maxmp * (boss ? 1 : 0.3)));
  const cx = M.w >> 1, cy = (M.h >> 1) + 1; addObj(M, 'furn', cx, cy, { f: 'tp_portal', fp: [[0, 0], [-1, 0], [1, 0]], xact: 'ti_next' }); M.chunks.clear && M.chunks.clear();
  banner(L2('¡Piso ', 'Floor ') + f + L2(' superado!', ' cleared!'), boss ? L2('Te recuperas del todo. Sigue por el portal.', 'You fully recover. Go on through the portal.') : L2('Recuperas un poco. Sigue por el portal del centro.', 'You recover a little. Go on through the central portal.')); sfx('questdone'); }
function tiNext() { if (!TI || !TI.cleared) return; tiEnterFloor(TI.floor + 1); }
function tiEnd(why) { if (!TI) return; const P = G.P, S = tiSave(), R = TI, reached = R.cleared ? R.floor : R.floor - 1, secs = Math.round((Date.now() - R.t0) / 1000), nOn = R.mode === 'online' ? tioCount() : 0; TI = null; if (R.mode === 'team' && typeof huntAlliesClear === 'function') huntAlliesClear(); if (R.mode === 'online') { TIO = null; if (typeof netPresence === 'function') netPresence(true); }
  for (const e of G.ents) if (e.type === 'mob' && e.ti) e.remove = true; if (typeof showBoss === 'function') try { showBoss(null); } catch (e) { }
  P.dead = false; P.hp = P.S.maxhp; if (P.S.maxmp) P.mp = P.S.maxmp; setAnim(P, 'idle');
  transition(() => { const T0 = makeTower(), d = T0.objs.find(o => o.xact === 'ti_open'); P.inside = R.ret.m === 'torre_portales' ? R.ret.inside : P.inside; setMap(T0, d ? d.px : (T0.w >> 1) * 16 + 8, d ? d.py + 24 : (T0.h - 3) * 16, 'down');
    openModal(`<div class="frame"><h3>♾ ${L2('Fin de la subida', 'Climb over')}</h3><p>${why === 'left' ? L2('Saliste de la torre.', 'You left the tower.') : L2('Caíste en la torre.', 'You fell in the tower.')}</p>
      <p>${L2('Piso superado', 'Floor cleared')}: <b>${Math.max(0, reached)}</b> (${L2('empezaste en el ', 'you started at ')}${R.start}) · ${L2('enemigos', 'enemies')}: ${R.kills} · ${L2('tiempo', 'time')}: ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</p>
      ${R.mode === 'online' ? `<p>🌐 ${L2('En línea, con ', 'Online, with ')}${nOn} ${L2('jugadores. Sin top: solo para ver cuánto aguantáis.', 'players. No leaderboard: just to see how long you last.')}</p>` : R.mode === 'team' ? `<p>👥 ${L2('Equipo de 4 · récord del equipo: piso ', 'Team of 4 · team record: floor ')}<b>${S.best4 || 0}</b></p>` : `<p>🏆 ${L2('Récord', 'Record')}: <b>${L2('piso ', 'floor ')}${S.best || 0}</b></p>`}<div class="row"><button class="btn gold" id="tiAgain">${L2('Volver a la Torre Infinita', 'Back to the Infinite Tower')}</button><button class="btn" id="tiOk">OK</button></div></div>`);
    $('#tiOk').onclick = () => closeModal(); $('#tiAgain').onclick = () => { closeModal(); tiOpen(); }; }); markDirty(true); }
// tick: piso superado, regeneración, explosiones
let TI_TK = 0;
hookAfter('updateSpawns', () => { if (!TI || !G.map || G.map.id !== TI_MAP) return; const now = G.t;
  if (TI.spawned && !TI.cleared && tiAlive() === 0) tiCleared();
  if (now - TI_TK < 0.5) return; TI_TK = now; for (const m of G.ents) { if (m.type !== 'mob' || !m.ti || m.dying) continue; if (m.tiRegen && now - (m.lastHit || 0) > 3 && m.hp < m.maxhp) m.hp = Math.min(m.maxhp, m.hp + Math.round(m.maxhp * 0.01)); } });
hookBefore('killMob', m => { if (!m || !m.ti || !TI) return; TI.kills++; if (m.tiBoom) { const x = m.x, y = m.y; telegraph({ shape: 'circle', x, y, r: 40, dur: 0.8 }); setTimeout(() => { const P = G.P; if (!TI || P.dead) return; addFx({ type: 'ring', x, y, r: 44, dur: 0.4, col: '#ff8a2a' }); if (Math.hypot(P.x - x, P.y - y) < 44 && !(P.ifr > 0)) { const d = Math.round(P.S.maxhp * 0.08); P.hp -= d; P.flash = 0.15; floatText(P.x, P.y - 34, d, '#ff8a2a'); if (P.hp <= 0) playerDie(); } }, 800); } });
hookAfter('killMob', (r, m) => { if (m && m.ti && G.P.best) delete G.P.best[m.mid]; });
hookBefore('bossKilled', m => { if (m && m.ti) return HOOK_SKIP; });
// caer en la torre termina la subida (sin la muerte normal); salir por la puerta sur también
hookBefore('playerDie', () => { if (TI && G.map && G.map.id === TI_MAP) { tiEnd('dead'); return HOOK_SKIP; } });
hookBefore('exitInterior', () => { if (G.map && G.map.id === TI_MAP) { if (TI && !confirm(L2('¿Salir de la Torre Infinita? La subida termina y tu récord se guarda.', 'Leave the Infinite Tower? The climb ends and your record is kept.'))) { const P = G.P; P.y -= 20; return HOOK_SKIP; } if (TI) tiEnd('left'); else { const T0 = makeTower(); transition(() => setMap(T0, (T0.w >> 1) * 16 + 8, (T0.h - 3) * 16, 'down')); } return HOOK_SKIP; } });
// si se guarda durante la subida, la partida queda donde entraste (el mapa de la torre se rehace al vuelo)
hookAround('saveGame', (next, ...a) => { const P = G.P; if (!P || P.map !== TI_MAP || !TI) return next(...a); const s = { m: P.map, x: P.x, y: P.y, i: P.inside };
  P.map = TI.ret.m; P.x = TI.ret.x; P.y = TI.ret.y; P.inside = TI.ret.inside; try { return next(...a); } finally { P.map = s.m; P.x = s.x; P.y = s.y; P.inside = s.i; } });
SAVEKEYS.push('ti');
// Lupa › Sistemas
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_torre_inf', '♾ ' + L2('Torre Infinita', 'Infinite Tower'), () => [L2('En la Torre de los Portales, el portal dorado del centro. Salas sin fin: cada piso los enemigos suben 5 niveles y entran 5 o más (uno más cada 25 pisos); cada 10 pisos hay un jefe y cada 50 uno de los jefes de la torre (El Arquitecto de la Torre, La Reina del Vértigo).', 'In the Portal Tower, the golden portal in the middle. Endless rooms: each floor enemies gain 5 levels and 5 or more come in (one more every 25 floors); every 10 floors there is a boss and every 50 one of the tower bosses (The Tower Architect, The Vertigo Queen).'),
  L2('Salen todos los enemigos del juego, los jefes de zona, continente, cueva y portal (no salen súper jefes ni jefes de la historia) y 6 enemigos propios de la torre, con mecánicas por piso: rápidos, acorazados, furiosos, enjambre, élite, oscuridad, se regeneran o explotan al morir. Pueden pasar del nivel 700: es una prueba de resistencia.', 'Every enemy in the game, the zone, continent, cave and portal bosses (no super bosses or story bosses) plus 6 tower-only enemies show up, with mechanics per floor: fast, armored, furious, swarm, elite, darkness, regenerating or exploding on death. They can go past level 700: it is an endurance test.'),
  L2('Al superar un piso recuperas un poco (del todo tras un jefe). Si caes o sales, la subida termina sin la muerte normal y tu mejor piso va al top. Puedes volver a empezar en el último múltiplo de 10 que superaste.', 'Clearing a floor heals you a little (fully after a boss). If you fall or leave, the climb ends without a normal death and your best floor goes to the leaderboard. You can restart at the last multiple of 10 you cleared.')], () => null]);

// ---------- 6.44: equipo de 4 (tú + 3 compañeros con IA: cazadores de los portales y jugadores cazadores) ----------
function tiAllies(M) { if (typeof huntAlliesClear !== 'function') return; huntAlliesClear(); const P = G.P, out = [];
  const hn = typeof huntPick === 'function' ? huntPick().slice(0, 2) : [];
  hn.forEach(h => { const rf = 0.8 + (typeof hnRank === 'function' ? hnRank(h) : 1) * 0.1; out.push({ type: 'hunter', h, id: h.id, def: NPCS[h.id], name: h.name, rf, atlas: npcAtlas(h.id) }); });
  if (typeof aihPop === 'function') { const pool = aihPop().slice().sort((a, b) => Math.abs(a.lv - P.lv) - Math.abs(b.lv - P.lv)).slice(0, 12); while (out.length < 3 && pool.length) { const jc = pool.splice(Math.floor(Math.random() * pool.length), 1)[0], pw = pick(Object.keys(HN_PW));
    out.push({ type: 'hunter', h: { id: 'aih_' + aihHash(jc.k), name: jc.name, cls: jc.cls, pw, big: false }, id: 'aih_' + aihHash(jc.k), def: { n: jc.name, lines: [''] }, name: jc.name, rf: 0.9 + ((jc.W && jc.W.r) || 0) * 0.02, atlas: aihAtlas(jc) }); } }
  out.slice(0, 3).forEach((a, i) => { Object.assign(a, { x: P.x + (i - 1) * 18, y: P.y + 14, L: P.L, map: M.id, dir: 'up', anim: 'idle', af: 0, at: 0, hum: true, cd: 0.5, pcd: 3 + i, scale: 1 }); a.maxhp = Math.round((P.S ? P.S.maxhp : 1000) * 0.85 * a.rf); a.hp = a.maxhp; G.ents.push(a); HUNT.allies.push(a); });
  if (typeof huntBars === 'function') huntBars(); banner(L2('Equipo de 4', 'Team of 4'), HUNT.allies.map(a => a.name).join(' · ')); }
// ---------- 6.44: en línea con tu grupo (2-7 jugadores, sin top) ----------
// Cada uno juega su copia del piso (mismo piso y mismos enemigos: la semilla es la del piso); los enemigos que alguien
// vence desaparecen también para los demás (presencia «tio»: k = partida, f = piso, kd = índices vencidos) y cuando
// alguien sube de piso, los demás le siguen. Si caes, sales tú; los demás siguen. Vida ×(1 + 0,35 por jugador extra).
let TIO = null; const TIO_SEEN = {};
function tioPeers() { const o = []; if (!TIO) return o; for (const r of G.remote.values()) if (r.tio && r.tio.k === TIO.k && r.map === TI_MAP) o.push(r); return o; }
function tioCount() { return 1 + tioPeers().length; }
function tioHost(max) { const P = G.P; if (typeof PARTY === 'undefined' || !PARTY.id) { toast(L2('Necesitas un grupo en línea (invita a alguien desde 🌐).', 'You need an online group (invite someone from 🌐).'), 'warn'); return; }
  if (PARTY.id !== NET.myId) { toast(L2('Solo el líder del grupo puede empezar.', 'Only the group leader can start.'), 'warn'); return; }
  closeModal(); TIO = { k: NET.myId + ':' + Date.now().toString(36), host: NET.myId, max, f: 1, kd: [] }; tiStart(1, 'online'); toast('🌐 ' + L2('Torre en línea: tu grupo recibirá la invitación (máx. ', 'Online tower: your group gets the invite (max ') + max + ').', 'info', 4); }
hookAfter('extraPresence', (r, o) => { if (TIO && TI && TI.mode === 'online' && o) o.tio = { k: TIO.k, h: TIO.host, m: TIO.max, f: TI.floor, kd: TIO.kd.slice(0, 40) }; });
hookAfter('extraRecv', (r, rem, pr) => { if (!rem) return; const t = pr && pr.tio; rem.tio = t && typeof t.k === 'string' && t.k.length < 60 ? { k: t.k, h: String(t.h || '').slice(0, 20), m: clamp(t.m | 0, 2, 7), f: clamp(t.f | 0, 1, 100000), kd: Array.isArray(t.kd) ? t.kd.slice(0, 40).map(x => x | 0) : [] } : null; if (rem.tio) try { tioRecv(rem); } catch (e) { if (typeof errOnce === 'function') errOnce('tio', e); } });
function tioRecv(rem) { const P = G.P, t = rem.tio;
  // invitación: el líder de tu grupo empezó y tú estás en la Torre de los Portales
  if (!TI && !TIO_SEEN[t.k] && typeof PARTY !== 'undefined' && PARTY.id && rem.id === PARTY.id && t.h === rem.id && P.map === 'torre_portales' && !P.dead) { TIO_SEEN[t.k] = 1;
    let n = 1; for (const r of G.remote.values()) if (r.tio && r.tio.k === t.k) n++; if (n >= t.m) { toast(L2('La torre en línea de tu grupo está llena.', 'Your group\'s online tower is full.'), 'warn'); return; }
    openModal(`<div class="frame"><h3>🌐 ${L2('Torre Infinita en línea', 'Online Infinite Tower')}</h3><p>${esc(rem.name || '?')} ${L2('empezó la Torre Infinita con el grupo (máx. ', 'started the Infinite Tower with the group (max ')}${t.m}). ${L2('Va por el piso ', 'On floor ')}${t.f}.</p><div class="row"><button class="btn gold" id="tioJ">${L2('Unirme', 'Join')}</button><button class="btn" id="tioN">${L2('Ahora no', 'Not now')}</button></div></div>`);
    $('#tioJ').onclick = () => { closeModal(); TIO = { k: t.k, host: t.h, max: t.m, f: t.f, kd: [] }; tiStart(t.f, 'online'); }; $('#tioN').onclick = () => closeModal(); return; }
  if (!TI || TI.mode !== 'online' || !TIO || t.k !== TIO.k) return;
  // alguien subió de piso: le seguimos
  if (t.f > TI.floor && !P.dead && !G.fading) { tiEnterFloor(t.f); return; }
  // enemigos que otro venció en este piso
  if (t.f === TI.floor && t.kd.length && G.map && G.map.id === TI_MAP) for (const m of G.ents) if (m.type === 'mob' && m.ti && !m.dying && t.kd.includes(m.tioI)) { m.hp = 0; m.dying = 0.001; setAnim(m, 'hurt'); if (!TIO.kd.includes(m.tioI)) TIO.kd.push(m.tioI); if (m.boss && typeof showBoss === 'function') try { showBoss(null); } catch (e) { } } }
hookBefore('killMob', m => { if (m && m.ti && TIO && TI && TI.mode === 'online' && m.tioI !== undefined && !TIO.kd.includes(m.tioI)) TIO.kd.push(m.tioI); });
