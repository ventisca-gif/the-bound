// 6.16 · Loguetown: personajes del puerto y desafíos de la patrulla.
// Sprites: hojas de Sergio recortadas por tools/dev/logue_pack.py en src/6zzzzzc_logue_sprites.js
// (filas abajo/izquierda/derecha/arriba; columnas reposo, paso A, paso B; smoker_atk: reposo, carga, golpe, vuelta).
const LOGUE_SHEETS = {};
for (const [id, url] of Object.entries(LOGUE_IMAGES)) {
  const im = new Image(); LOGUE_SHEETS[id] = im; im.src = url;
  im.addEventListener('load', () => { for (const e of G.ents || []) if (e.type === 'npc' && LOGUE_CAST[e.id] && LOGUE_CAST[e.id][1] === id) e.atlas = logueActorAtlas(id); });
}
// Columnas del atlas: 0 reposo · 1-2 caminar · 3-6 ataque · 7 herido/caído (reposo).
const LOGUE_ATK_STEP = [1, 2, 1, 0];
function logueActorAtlas(id) {
  const im = LOGUE_SHEETS[id], atk = LOGUE_SHEETS[id + '_atk'], cw = LOGUE_CELL.w, ch = LOGUE_CELL.h;
  if (!im || !im.naturalWidth) return null;
  const hasAtk = !!(atk && atk.naturalWidth);
  return getAtlas('logue_actor_' + id + (hasAtk ? ':a' : ''), () => {
    const a = dawnPixelAtlas(cw / 2, ch / 2, { idle: 0, walk: 1, atk: 3, hurt: 7, dead: 7 }, 8, (g, c, r) => {
      if (c >= 3 && c <= 6) { if (hasAtk) g.drawImage(atk, (c - 3) * cw, r * ch, cw, ch, 0, 0, cw, ch); else g.drawImage(im, LOGUE_ATK_STEP[c - 3] * cw, r * ch, cw, ch, 0, 0, cw, ch); return; }
      const frame = c === 1 ? 1 : c === 2 ? 2 : 0;
      g.drawImage(im, frame * cw, r * ch, cw, ch, 0, 0, cw, ch);
    });
    a.frames = { idle: 1, walk: 2, atk: 4, hurt: 1, dead: 1 }; return a;
  });
}
const LOGUE_CAST = {
  logue_merchant: ['Ipponmatsu', 'merchant', 74, 163, 'Las cajas del puerto no llegaron a mi taller. ¿Puedes averiguar qué pasó?', 'The harbor crates never reached my workshop. Can you find out what happened?'],
  logue_alvida: ['Alvida', 'alvida', 124, 179, 'Hay mercancía desaparecida. No me interesa un cargamento vacío.', 'Cargo has gone missing. An empty shipment is no use to me.'],
  logue_bart: ['Bartolomeo', 'bart', 110, 133, 'Vi unas sombras cerca del mercado. Busca a los contrabandistas.', 'I saw shadows near the market. Look for the smugglers.'],
  logue_officer: ['Smoker', 'smoker', 146, 81, 'El puerto necesita orden. Si quieres ayudar, demuestra tu fuerza en el patio.', 'The harbor needs order. If you want to help, prove your strength in the yard.']
};
for (const [id, [n, art, , , es, en]] of Object.entries(LOGUE_CAST)) {
  NPCS[id] = { n, title: L2('Puerto de Loguetown', 'Loguetown harbor'), lines: [L2(es, en)], look: LK({}), quests: [], atlas: () => logueActorAtlas(art) || npcAtlas('dawn_marine_spy') };
}
SAVEKEYS.push('logueHarborDone');
// [id, nivel, nombre, x, y, vida×, ataque×, dibujo]
const LOGUE_TRIALS = [
  ['logue_smuggler', 610, L2('Contrabandista', 'Smuggler'), 124, 180, 42, 3.7, ['hum', 'dawn_boarder']],
  ['logue_guard', 612, L2('Vigía del muelle', 'Dock lookout'), 104, 185, 49, 4.0, ['hum', 'dawn_marine']],
  ['logue_captain', 615, L2('Smoker · capitán de la Marina', 'Smoker · Navy captain'), 146, 81, 68, 4.3, ['logue_actor', 'smoker']]
];
const LOGUE_REW = [[60000, null], [80000, null], [120000, null]];
for (const [id, lv, n, , , hp, atk, art] of LOGUE_TRIALS) {
  BOSSES[id] = { n, lv, hp, atk, def: 3.85, spd: 82, r: 34, where: 'Loguetown', art, moves: [], drops: [] };
}
hookAround('mobAtlasFor', (next, art) => art && art[0] === 'logue_actor' ? (logueActorAtlas(art[1]) || next(['hum', 'dawn_marine_cap'])) : next(art));
function logueActive(P, M) { return !!(P && M && M.logue && !P.dead && !P.dawnHelm && logueTile((P.x >> 4) - LOGUE_X, (P.y >> 4) - LOGUE_Y)); }
function logueClear(M) {
  const s = M && M.logueActors; if (!s) return;
  for (const e of s.cast) if (e) e.remove = true;
  if (s.trial) { s.trial.remove = true; if (G.bossBar === s.trial) showBoss(null); }
  M.logueActors = null;
}
V33_TICKS.push(() => {
  const M = G.map, P = G.P; if (!M || !M.logue) return;
  if (!logueActive(P, M)) { logueClear(M); return; }
  if (!M.logueActors || M.logueActors.owner !== P) {
    logueClear(M);
    M.logueActors = { owner: P, cast: Object.entries(LOGUE_CAST).map(([id, [, , x, y]]) => spawnNPC(id, ...dawnPx(logueAt(x, y)), M.id, { hgt: 66, wander: id === 'logue_bart' ? 1 : 0 })) };
  }
  const S = M.logueActors; if (S.trial && (S.trial.dead || S.trial.remove || !G.ents.includes(S.trial))) S.trial = null;
});
hookAfter('setMap', () => { for (const M of Object.values(G.maps || {})) if (M !== G.map && M.logueActors) logueClear(M); });
DLG_HOOKS.push((npc, opts) => {
  if (!npc || !logueActive(G.P, G.map) || npc.id !== 'logue_officer') return;
  const P = G.P, S = G.map.logueActors, i = Math.min(3, P.logueHarborDone || 0);
  if (!S || S.trial) return;
  if (i >= 3) { opts.unshift({ label: L2('Desafíos del puerto · completados', 'Harbor challenges · completed'), icon: ['talk'], fn: () => { closeDialog(); toast(L2('Smoker: el puerto está en orden gracias a ti.', 'Smoker: the harbor is in order thanks to you.'), 'info'); } }); return; }
  const [id, lv] = LOGUE_TRIALS[i];
  opts.unshift({ label: L2('Desafío del puerto ', 'Harbor challenge ') + (i + 1) + '/3 · ' + L2('Nv. ', 'Lv. ') + lv, icon: ['talk'], fn: () => {
    closeDialog(); if (!logueActive(P, G.map) || S.trial) return;
    if (P.lv < lv) { toast(L2('Necesitas nivel ', 'Required level ') + lv, 'info'); return; }
    const at = (typeof freePxNear === 'function' && freePxNear(G.map, P.x, P.y - 48, 4)) || [P.x, P.y - 48];
    S.trial = spawnMob(id, lv, at[0], at[1], 0, null, true); if (S.trial) { S.trial.state = 'fight'; S.trial.logueTrial = 1; }
  } });
});
hookAfter('killMob', (_r, m) => {
  const S = G.map && G.map.logueActors, P = G.P; if (!S || !m || m !== S.trial || S.owner !== P) return;
  S.trial = null; const k = Math.min(3, (P.logueHarborDone || 0) + 1); P.logueHarborDone = k;
  const [gold, item] = LOGUE_REW[k - 1]; P.gold = (P.gold || 0) + gold; if (item && ITEMS[item]) giveItem(item, 1);
  if (typeof markDirty === 'function') markDirty(true);
  toast(L2('Desafío del puerto completado ', 'Harbor challenge completed ') + k + '/3 · +' + gold + ' ' + L2('oro', 'gold'), 'info');
});

// ---------- Cinemática: la ejecución de Roger (él ya no está; solo se cuenta en el patíbulo) ----------
SAVEKEYS.push('logueRoger');
function logueRogerSprite(x, X, Y, h, row) {
  const im = LOGUE_SHEETS.roger, cw = LOGUE_CELL.w, ch = LOGUE_CELL.h; if (!im || !im.naturalWidth) return;
  const k = h / 120; x.imageSmoothingEnabled = false;
  x.drawImage(im, 0, (row || 0) * ch, cw, ch, Math.round(X - cw * k / 2), Math.round(Y - 139 * k), Math.round(cw * k), Math.round(ch * k));
}
function logueCrowd(x, t, Y, n, lift) {
  for (let i = 0; i < n; i++) { const X = (i * 37) % 262 - 3, r = cnRnd(i), up = lift ? Math.max(0, Math.sin(t * 6 + i)) * lift : 0, yy = Y + (i % 3) * 7;
    cnR(x, ['#2a2430', '#3a2e3a', '#232838'][i % 3], X, yy, 11, 20); cnR(x, ['#e0b48a', '#c8946a', '#a87650'][i % 3], X + 3, yy - 6, 6, 6); cnR(x, '#1a1418', X + 3, yy - 7, 6, 2);
    if (lift && r > 0.45) cnR(x, '#d8a47a', X + (r > 0.7 ? 9 : 0), yy - 8 - up, 2, 8); }
}
function logueScaffold(x, X, Y) {
  cnR(x, '#4a3020', X - 40, Y, 80, 5); cnR(x, '#6a4630', X - 40, Y, 80, 2);
  for (const dx of [-36, -12, 12, 34]) cnR(x, '#3a2618', X + dx, Y + 5, 3, 40);
  for (let i = 0; i < 6; i++) cnR(x, '#5a3c28', X + 40 + i * 5, Y + 5 + i * 6, 6, 2);
  cnR(x, '#3a2618', X - 3, Y - 52, 5, 52); cnR(x, '#3a2618', X - 3, Y - 52, 28, 4);
}
Object.assign(CN_SC, {
  logue_plaza: (x, t) => {
    cnSky(x, '#3a4a6a', '#c88a5a'); cnR(x, '#8a8478', 0, 92, CN_W, 52); cnR(x, '#6e695f', 0, 92, CN_W, 2);
    for (let i = 0; i < 7; i++) { const X = i * 40 - 6, h = 30 + (i * 13) % 22; cnR(x, '#5a5450', X, 92 - h, 34, h); cnR(x, '#7a3a2a', X - 2, 90 - h, 38, 4); for (let w = 0; w < 3; w++) cnR(x, '#f0c870', X + 5 + w * 10, 98 - h, 4, 5); }
    cnR(x, '#6a6458', 196, 20, 18, 72); cnR(x, '#e8e0c8', 199, 26, 12, 12); cnR(x, '#3a3430', 204, 28, 1, 6); cnR(x, '#3a3430', 204, 32, 4, 1);
    logueScaffold(x, 128, 84); logueCrowd(x, t, 104, 28, 0);
  },
  logue_roger: (x, t, k) => {
    cnSky(x, '#5a6a8a', '#e8b070'); cnR(x, '#8a8478', 0, 92, CN_W, 52);
    logueScaffold(x, 128, 84);
    const zoom = 1 + k * 0.25; x.save(); x.translate(128, 84); x.scale(zoom, zoom); x.translate(-128, -84);
    logueRogerSprite(x, 128, 84, 50, 0);
    for (const [dx, s] of [[-26, 1], [26, -1]]) { cnR(x, '#e8e8e8', 128 + dx - 4, 60, 8, 24); cnR(x, '#d8b088', 128 + dx - 3, 53, 6, 7); cnR(x, '#2a4a8a', 128 + dx - 4, 52, 8, 2);
      x.strokeStyle = '#b8c0c8'; x.lineWidth = 1; x.beginPath(); x.moveTo(128 + dx, 70); x.lineTo(128 + dx * 0.25, 30 + Math.sin(t * 2) * 1.5); x.stroke(); }
    x.restore(); logueCrowd(x, t, 108, 28, 0);
  },
  logue_era: (x, t) => {
    cnSky(x, '#2a5a8a', '#9ad0e8'); cnR(x, '#2a6a9a', 0, 70, CN_W, 74);
    for (let i = 0; i < 10; i++) cnR(x, '#7ab0d0', (i * 53 + t * 18) % 280 - 20, 76 + (i % 4) * 14, 14, 1);
    for (let i = 0; i < 4; i++) { const X = 30 + i * 60 + t * (6 + i * 2), Y = 64 + (i % 2) * 10 + Math.sin(t * 2 + i) * 1.5;
      cnR(x, '#5a3a22', X, Y, 26, 6); cnR(x, '#3a2414', X + 2, Y + 6, 22, 2); cnR(x, '#3a2414', X + 12, Y - 26, 2, 26); cnR(x, '#f0ece0', X + 4, Y - 24, 18, 15); cnR(x, '#1a1a1a', X + 10, Y - 21, 6, 6); cnR(x, '#ffffff', X + 12, Y - 19, 2, 2); }
    logueCrowd(x, t, 112, 28, 6);
  }
});
function logueRogerCine(done) {
  cinePlay([
    { s: 'logue_plaza', title: L2('Loguetown · la ciudad del principio y del fin', 'Loguetown · the town of the beginning and the end'), txt: L2('Hace más de veinte años, esta plaza se llenó de gente para ver el final del hombre más buscado del mar.', 'More than twenty years ago, this square filled with people to see the end of the most wanted man at sea.') },
    { s: 'logue_roger', title: 'Gol D. Roger', txt: L2('Gol D. Roger, el Rey de los Piratas, se entregó él mismo. Subió a este patíbulo sonriendo, como si fuera él quien hubiera ganado.', 'Gol D. Roger, the Pirate King, turned himself in. He climbed this scaffold smiling, as if he were the one who had won.') },
    { s: 'logue_roger', txt: L2('Antes del final, le preguntaron por su tesoro. Roger respondió a toda la plaza: que lo buscaran, que lo había dejado todo en un solo lugar del mar.', 'Before the end, they asked him about his treasure. Roger answered the whole square: go and look for it, he had left everything in one place at sea.') },
    { s: 'logue_era', title: L2('La Gran Era de la Piratería', 'The Great Pirate Era'), txt: L2('Esas palabras no cerraron una historia: la empezaron. Desde aquel día, miles de piratas zarpan hacia el Grand Line, y el patíbulo sigue en pie.', 'Those words did not end a story: they started one. Since that day, thousands of pirates set sail for the Grand Line, and the scaffold still stands.') }
  ], done);
}
// Se ve la primera vez que llegas a la plaza; el cartel de la plaza la repite.
V33_TICKS.push(() => {
  const M = G.map, P = G.P; if (!M || !M.logue || !P || P.logueRoger || CINE.on || G.fading || !logueActive(P, M)) return;
  if (logueTile((P.x >> 4) - LOGUE_X, (P.y >> 4) - LOGUE_Y) !== 'plaza') return;
  P.logueRoger = 1; if (typeof markDirty === 'function') markDirty(true); logueRogerCine();
});
hookAfter('makeDawn', M => {
  const at = LOGUE_PLAZA, key = 'logue_info_' + at[0] + '_' + at[1], X = XACT[key]; if (!X || X.logueCine) return;
  const nx = [X[0], 'book', () => xMsg(X[0], L2('Aquí ejecutaron a Gol D. Roger, el Rey de los Piratas. Sus últimas palabras empezaron la Gran Era de la Piratería.', 'Gol D. Roger, the Pirate King, was executed here. His last words started the Great Pirate Era.'), [[L2('🎬 Ver la cinemática', '🎬 Watch the cutscene'), () => { closeModal(); logueRogerCine(); }]])];
  nx.logueCine = 1; XACT[key] = nx;
});
