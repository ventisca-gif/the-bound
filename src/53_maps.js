// ================= MAPS, INTERIORS, SPAWNS, MAIN UPDATE =================
const INT_NPC = { herreria_albor: 'bruno', tienda_albor: 'lia', posada_albor: 'nora', alquimia_puerto: 'sela', tienda_puerto: 'gerta', herreria_puerto: 'hugo', posada_puerto: 'bram', castillo: 'rey', torre_magos: 'ilsa', gremio: 'kael', herreria_arxar: 'brann', tienda_arxar: 'orla', alquimia_arxar: 'elian', posada_arxar: 'sir_pollo', herreria_sahrim: 'zahir', tienda_sahrim: 'amira', posada_sahrim: 'farid', alquimia_sahrim: 'nadia', herreria_yarakai: 'tano', tienda_yarakai: 'kima', posada_yarakai: 'oba' };
const TOWN_OF = { albor: 'albor', puerto: 'puerto', arxar: 'arxar', capitana: 'puerto', castillo: 'arxar', torre: 'arxar', gremio: 'arxar', mira: 'albor' };
function townOfInterior(id) { for (const k of ['albor', 'puerto', 'arxar', 'sahrim', 'yarakai']) if (id.includes(k)) return k; if (id.startsWith('casa_s')) return 'sahrim'; if (id.startsWith('casa_y')) return 'yarakai'; if (id.startsWith('casa_a') || id === 'casa_mira') return 'albor'; if (id.startsWith('casa_p') || id === 'casa_capitana') return 'puerto'; return 'arxar'; }
function makeInterior(id) {
  if (HOUSES[id]) return makeHome(id);
  if (CAVES[id]) return makeCave(id);
  const kind = id.split('_')[0]; const big = id === 'castillo';
  const w = big ? 22 : 14, h = big ? 16 : 10, N = w * h;
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0.1, music: 'town', I: (x, y) => y * w + x };
  for (let x = 0; x < w; x++) { M.ter[x] = T.IWALL; M.ter[w + x] = T.IWALL; M.ter[(h - 1) * w + x] = T.IWALL; } for (let y = 0; y < h; y++) { M.ter[y * w] = T.IWALL; M.ter[y * w + w - 1] = T.IWALL; }
  const ex = w >> 1; M.ter[(h - 1) * w + ex] = T.FLOOR; M.exit = { x: ex, y: h - 1 };
  initMapObjs(M);
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  const npcAt = (nid, x, y, face) => spawnNPC(nid, x * 16 + 8, y * 16 + 12, id, { face: face || 'down', L: 0 });
  if (kind === 'herreria') { F('counter', 7, 4, [[-2, 0], [-1, 0], [0, 0], [1, 0]]); F('weaprack', 3, 2, [[0, 0], [-1, 0], [1, 0]]); F('weaprack', 10, 2, [[0, 0], [-1, 0], [1, 0]]); F('armorstand', 12, 5); F('chest', 1, 7); F('barrels', 2, 8, [[0, 0], [1, 0]], { solid: true }); addObj(M, 'forge', 11, 7, { fp: [[0, 0], [1, 0]] }); addObj(M, 'anvil', 9, 7); }
  else if (kind === 'tienda') { F('counter', 7, 4, [[-2, 0], [-1, 0], [0, 0], [1, 0]]); F('shelf', 2, 2, [[0, 0], [1, 0]]); F('shelf', 4, 2, [[0, 0], [1, 0]]); F('potshelf', 10, 2, [[0, 0], [1, 0]]); F('shelf', 12, 2, [[0, 0]]); addObj(M, 'barrel', 1, 7); addObj(M, 'crate', 2, 7); addObj(M, 'sack', 12, 7); F('plant', 12, 8); F('rug', 7, 7, [], { solid: false }); }
  else if (kind === 'alquimia') { F('counter', 7, 5, [[-2, 0], [-1, 0], [0, 0], [1, 0]]); F('potshelf', 2, 2, [[0, 0], [1, 0]]); F('potshelf', 4, 2, [[0, 0], [1, 0]]); F('bookshelf', 11, 2, [[0, 0], [1, 0]]); F('cauldron', 11, 6, [[0, 0], [1, 0]]); F('plant', 1, 8); F('table', 3, 7, [[0, 0], [1, 0]]); }
  else if (kind === 'posada') { F('counter', 4, 4, [[-2, 0], [-1, 0], [0, 0], [1, 0]]); F('shelf', 3, 2, [[0, 0], [1, 0]]); F('fireplace', 10, 2, [[0, 0], [1, 0], [-1, 0]]); F('table', 9, 6, [[0, 0], [1, 0]]); F('chair', 8, 6); F('chair', 11, 6); F('table', 4, 7, [[0, 0], [1, 0]]); F('chair', 3, 7); F('bed', 12, 4, [[0, 0], [0, 1]]); F('bed', 12, 7, [[0, 0], [0, 1]]); F('rug', 7, 8, [], { solid: false }); addObj(M, 'barrel', 1, 4); }
  else if (kind === 'gremio') { F('board', 7, 2, [[0, 0], [-1, 0], [1, 0]]); F('counter', 4, 5, [[-2, 0], [-1, 0], [0, 0], [1, 0]]); F('bookshelf', 11, 2, [[0, 0], [1, 0]]); F('table', 10, 6, [[0, 0], [1, 0]]); F('chair', 9, 6); F('chair', 12, 6); F('chest', 1, 8); F('armorstand', 12, 8); F('rug', 7, 8, [], { solid: false }); }
  else if (id === 'castillo') { for (let y = 2; y < h - 1; y++) for (let x = 9; x <= 13; x++) M.ter[y * w + x] = T.CARPET; F('throne', 11, 3, [[0, 0], [-1, 0], [1, 0]]); for (const y of [4, 7, 10, 13]) { F('pillar', 5, y); F('pillar', 17, y); } F('chest', 2, 3); F('chest', 19, 3); F('armorstand', 3, 13); F('armorstand', 19, 13); M.dark = 0; }
  else if (id === 'torre_magos') { F('bookshelf', 2, 2, [[0, 0], [1, 0]]); F('bookshelf', 4, 2, [[0, 0], [1, 0]]); F('bookshelf', 10, 2, [[0, 0], [1, 0]]); F('potshelf', 12, 2, [[0, 0]]); F('cauldron', 3, 7, [[0, 0], [1, 0]]); F('table', 10, 6, [[0, 0], [1, 0]]); F('rug', 7, 6, [], { solid: false }); M.dark = 0.2; }
  else { F('bed', 2, 3, [[0, 0], [0, 1]]); F('table', 8, 5, [[0, 0], [1, 0]]); F('chair', 7, 5); F('chair', 10, 5); F('fireplace', 11, 2, [[0, 0], [1, 0], [-1, 0]]); F('rug', 7, 7, [], { solid: false }); F('plant', 1, 8); F('shelf', 5, 2, [[0, 0], [1, 0]]); addObj(M, 'barrel', 12, 7); }
  const nid = INT_NPC[id]; if (nid) { const pos = { herreria: [7, 3], tienda: [7, 3], alquimia: [7, 4], posada: [4, 3], gremio: [4, 4] }[kind] || [11, 4]; npcAt(nid, pos[0], pos[1]); }
  if (id === 'castillo') { spawnNPC('guardia_x1', 9 * 16 + 8, 5 * 16 + 12, id); spawnNPC('guardia_x1', 13 * 16 + 8, 5 * 16 + 12, id); }
  M.wdist = null; G.maps[id] = M; return M;
}
function setMap(M, x, y, dir) {
  const P = G.P; G.map = M; P.map = M.id; P.x = x; P.y = y; if (dir) P.dir = dir; const i = tileAt(M, Math.floor(x / 16), Math.floor(y / 16)); P.L = i >= 0 ? M.lvl[i] : 0;
  chunkBudget = 99; prewarm(M); updateCamera(0, true); G.fx.length = 0; G.parts.length = 0; P.target = null;
  setMusic(null); uiDirty.hud = true; regionCheck(true); netPresence(true);
  if (COMP) { COMP.e.map = M.id; COMP.e.x = x + 10; COMP.e.y = y + 2; }
  familyOnMap(M, x, y);
  if (CAVES[M.id]) setTimeout(() => enterCaveBanner(M.id), 300);
  if (HOUSES[M.id] && !isHome(M.id)) setTimeout(() => toast('¡Casa en venta! Lee el cartel para comprarla', 'info'), 600);
}
function transition(fn) { if (G.fading) return; G.fading = true; G.fadeTarget = 1; G.fadeCb = () => { fn(); G.fadeTarget = 0; G.fading = false; }; sfx('door'); }
function enterInterior(door) {
  const P = G.P; P.retX = door.x * 16 + 8; P.retY = (door.y + 1) * 16 + 8;
  transition(() => { const M = (!HOUSES[door.to] && G.maps[door.to]) || makeInterior(door.to); P.inside = door.to; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 1) * 16 + 10, 'up'); });
}
function exitInterior() { const P = G.P; transition(() => { P.inside = null; setMap(G.world, P.retX, P.retY, 'down'); markDirty(); }); }
function travelTo(wsk, cb) {
  const ws = WAYSTONES.find(w => w.k === wsk); if (!ws) return; const P = G.P;
  transition(() => { P.inside = null; setMap(G.world, ws.x * 16 + 8, (ws.y + 2) * 16 + 6, 'down'); if (cb) cb(); markDirty(true); });
}
function shipTo(dest) { const P = G.P; transition(() => { if (dest === 'nhar') { setMap(G.world, 216 * 16 + 8, 169 * 16 + 8, 'right'); P.ws.nhar = 1; } else if (dest === 'sahrim') { setMap(G.world, (SAHRIM_DOCK[0] + 2) * 16 + 8, 147 * 16 + 8, 'right'); P.ws.sahrim = 1; } else setMap(G.world, 228 * 16 + 8, 129 * 16 + 8, 'left'); toast({ nhar: 'Has llegado a la Isla de Nhar', sahrim: 'Has llegado al Oasis de Sahrim' }[dest] || 'De vuelta en Puerto Coral', 'info'); markDirty(true); }); }
// ---------- spawns ----------
function updateSpawns() {
  const W = G.world, P = G.P; if (CAVES[P.map] && G.map.id === P.map) { caveSpawns(); return; } if (P.map !== 'world') return; const px = P.x / 16, py = P.y / 16;
  for (const c of W.camps) {
    if (syncBlocksCamp(c)) { if (c.alive.length) { for (const m of c.alive) m.remove = true; c.alive = []; } continue; }
    const d = Math.abs(c.x - px) + Math.abs(c.y - py);
    c.alive = c.alive.filter(m => !m.remove && m.hp > 0); c.dead = c.dead.filter(t => t > G.t);
    if (d < 30) { while (c.alive.length + c.dead.length < c.n) { const a = Math.random() * 6.28, r = Math.random() * 2.5; let x = (c.x + Math.cos(a) * r) * 16 + 8, y = (c.y + Math.sin(a) * r) * 16 + 8; if (blockedFor(W, Math.floor(x / 16), Math.floor(y / 16), c.L)) { x = c.x * 16 + 8; y = c.y * 16 + 8; } const lv = clamp(c.lv + Math.round((Math.random() - 0.5) * 2), 1, MAXLV); const m = spawnMob(c.mob, lv, x, y, c.L, c); m.home = { x: c.x * 16 + 8, y: c.y * 16 + 8 }; c.alive.push(m); } }
    else if (d > 40 && c.alive.length) { for (const m of c.alive) if (m.state !== 'chase') m.remove = true; c.alive = c.alive.filter(m => !m.remove); }
  }
  for (const b of W.bosses) {
    const d = Math.abs(b.x - px) + Math.abs(b.y - py);
    if (!b.ent && d < 24 && G.t > (b.respawn || 0)) { const B = BOSSES[b.id]; const i = W.I(b.x, b.y); b.ent = spawnMob(b.id, B.lv, b.x * 16 + 8, b.y * 16 + 8, W.lvl[i], null, true); if (b.hpLeft && G.t - b.hpT < 300) b.ent.hp = Math.max(1, Math.min(b.ent.maxhp, b.hpLeft)); }
    else if (b.ent && d > 44 && b.ent.state !== 'fight') { if (!b.ent.dying) { b.hpLeft = b.ent.hp; b.hpT = G.t; } b.ent.remove = true; b.ent = null; }
  }
}
// ---------- region / exploration ----------
let lastRegion = -1, lastTownK = null;
function regionCheck(force) {
  const P = G.P; if (P.map !== 'world') { const tk = townOfInterior(P.map); if (force) setMusic(null); return; }
  const W = G.world, tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16), i = W.I(clamp(tx, 0, W.w - 1), clamp(ty, 0, W.h - 1));
  const town = W.townAt[i] >= 0 ? TOWNS[W.townAt[i]].k : null;
  if (town !== lastTownK) { lastTownK = town; if (town) { P.lastTown = town; banner(TOWNS.find(t => t.k === town).n, 'Zona segura'); celebEnterTown(town); P.ws[town] = 1; if (town !== 'albor') tip('town'); } setMusic(null); }
  const r = W.reg[i]; if (r !== lastRegion && !town) { lastRegion = r; const R = REGIONS[r]; if (R.k !== 'mar') banner(R.n, 'Nivel ' + R.lv[0] + ' - ' + R.lv[1]); setMusic(null); }
  // explore
  const bits = P.exploredBits, rad = 9; for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) { if (dx * dx + dy * dy > rad * rad) continue; const x = tx + dx, y = ty + dy; if (x < 0 || y < 0 || x >= W.w || y >= W.h) continue; const k = y * W.w + x; bits[k >> 3] |= 1 << (k & 7); }
}
function currentMusic() { const P = G.P; if (!P || P.ghost) return 'title'; if (G.bossBar) return 'boss'; if (CAVES[P.map]) return 'cave'; if (P.map !== 'world') return 'town'; const W = G.world, i = W.I(clamp(Math.floor(P.x / 16), 0, W.w - 1), clamp(Math.floor(P.y / 16), 0, W.h - 1)); if (W.townAt[i] >= 0) return 'town'; const R = REGIONS[W.reg[i]]; return R.music || 'field'; }
// ---------- player update ----------
function updatePlayer(dt) {
  const P = G.P, M = G.map, S = P.S;
  if (P.riding) { P.atkCd -= dt; for (const k in P.cds) if (P.cds[k] > 0) P.cds[k] -= dt; return; }
  P.flash -= dt; P.ifr -= dt; P.atkCd -= dt; P.busy = (P.busy || 0) - dt; P.dashCd = (P.dashCd || 0) - dt; P.potCd = (P.potCd || 0) - dt;
  for (const k in P.cds) if (P.cds[k] > 0) P.cds[k] -= dt;
  if (P.buffs.length) { let ch = false; for (const b of P.buffs) { b.t -= dt; if (b.t <= 0) ch = true; } if (ch) { P.buffs = P.buffs.filter(b => b.t > 0); recalcBuffs(P); uiDirty.hud = true; } }
  if (P.shieldT > 0) { P.shieldT -= dt; if (P.shieldT <= 0) P.shield = 0; }
  if (P.slowT > 0) P.slowT -= dt;
  P.dot = (P.dot || 0) + dt; if (P.dot > 1) { P.dot = 0; if (P.poison > 0 && !P.dead) { P.poison--; const d = Math.max(1, P.poisonD || 5); P.hp -= d; floatText(P.x, P.y - 34, d, '#7ae04a'); if (P.hp <= 0) playerDie(); } if (P.burn > 0 && !P.dead) { P.burn--; const d = Math.max(1, P.burnD || 5); P.hp -= d; floatText(P.x, P.y - 34, d, '#ff8a2a'); if (P.hp <= 0) playerDie(); } }
  if (P.concert) concertTick(dt); swordAura(dt);
  if (P.acts && P.acts.length) { for (const a of P.acts) a.t -= dt; const due = P.acts.filter(a => a.t <= 0); P.acts = P.acts.filter(a => a.t > 0); for (const a of due) a.fn(); }
  if (P.dead) { stepAnim(P, dt, 2); return; }
  if (SCENE) { sceneUpdate(dt); return; }
  weaponTick(dt);
  // regen
  const ooc = G.t - P.combatT > 6 && G.t - P.lastHurt > 6; P.hp = Math.min(S.maxhp, P.hp + S.maxhp * (ooc ? 0.025 : 0.002) * dt); P.mp = Math.min(S.maxmp, P.mp + (S.maxmp * (ooc ? 0.03 : 0.012) + S.mpReg) * dt);
  if (P.dashT > 0) { P.dashT -= dt; const s = P.dashV * dt; moveEnt(M, P, Math.cos(P.dashA) * s, Math.sin(P.dashA) * s); P.dir = dirFromVec(Math.cos(P.dashA), Math.sin(P.dashA)); if (P.dashDmg) for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === M.id && !P.dashHit.has(m) && dist2(m.x, m.y, P.x, P.y) < 22 * 22) { P.dashHit.add(m); hitMob(m, P.dashDmg, { stun: P.dashStun, kb: 80 }); } if (Math.random() < 0.6) part(P.x, P.y, { vz: 5, life: 0.3, c: '#d8c8a8' }); setAnim(P, 'walk', true); stepAnim(P, dt, 16); return; }
  for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== M.id) continue; const rr = (m.rad || 8) + 5, dx = P.x - m.x, dy = P.y - m.y, d2_ = dx * dx + dy * dy; if (d2_ < rr * rr && d2_ > 0.01) { const d = Math.sqrt(d2_), push = (rr - d) * (m.boss ? 0.5 : 0.25); moveEnt(M, P, dx / d * push, dy / d * push); } }
  let [mx, my] = moveInput(); const moving = Math.abs(mx) + Math.abs(my) > 0.15;
  if (moving && (P.job || (P.fishing && P.fishing.state !== 'reel'))) { if (P.job) { P.job = null; } if (P.fishing) stopFishing(); setAnim(P, 'idle'); }
  if (P.fishing) { updateFishing(dt); stepAnim(P, dt, 2); return; }
  if (P.job) { updateJob(dt); stepAnim(P, dt, P.job && P.job.kind === 'herbo' ? 3 : 5); return; }
  const acting = P.busy > 0; const spd = S.spd * (P.slowT > 0 ? 0.6 : 1) * (acting ? 0.35 : 1);
  if (moving) { moveEnt(M, P, mx * spd * dt, my * spd * dt); if (!acting) P.dir = dirFromVec(mx, my); }
  if (inp.attack || keys.Space || keys.KeyJ) basicAttack();
  const a = P.anim;
  if (a === 'atk' || a === 'cast' || a === 'slam') { if (P.busy <= 0) setAnim(P, moving ? 'walk' : 'idle'); else stepAnim(P, dt, a === 'atk' ? 4 / Math.max(0.2, Math.min(P.busy + 0.05, 0.4)) : a === 'slam' ? 10 : 8); }
  else if (P.emote && !moving && !acting) { if (a !== P.emote) setAnim(P, P.emote); P.loopAnim = P.emote !== 'sit'; stepAnim(P, dt, P.emote === 'dance' ? 7 : 4); P.emoteT -= dt; if (P.emoteT <= 0) P.emote = null; }
  else { P.emote = null; setAnim(P, moving ? 'walk' : 'idle', true); P.loopAnim = true; stepAnim(P, dt, moving ? 8 + spd / 30 : 2); if (moving && P.af % 2 === 0 && Math.random() < 0.05) part(P.x + (Math.random() - 0.5) * 4, P.y, { vz: 6, life: 0.4, c: '#c8b898' }); }
  // doors
  if (M.isWorld && moving) { const tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16); for (const d of M.doors) if (d.x === tx && d.y === ty && my < -0.2) { enterInterior(d); break; } }
  else if (!M.isWorld && moving && my > 0.2) { const tx = Math.floor(P.x / 16), ty = Math.floor((P.y + 4) / 16); if (ty >= M.exit.y && Math.abs(tx - M.exit.x) <= 0) exitInterior(); }
}
function playerDie() { const P = G.P; if (P.dead) return; P.dead = true; P.hp = 0; setAnim(P, 'dead'); P.job = null; if (P.fishing) stopFishing(); P.stats.deaths++; sfx('die'); G.shake = 6; showBoss(null); setTimeout(() => showDeath(), 1200); setTimeout(() => tip('death'), 1300); }
function revive() { const P = G.P; P.dead = false; const loss = Math.floor(P.xp * 0.1); P.xp -= loss; P.hp = Math.round(P.S.maxhp * 0.6); P.mp = Math.round(P.S.maxmp * 0.6); P.poison = P.burn = 0; setAnim(P, 'idle'); travelTo(P.lastTown || 'albor', () => { if (loss) toast('Has perdido ' + loss + ' XP', 'warn'); }); }
// ---------- main update ----------
let tick5 = 0, saveT = 0;
function update(dt) {
  if (G.fadeTarget !== undefined) { const sp = dt * 4; if (G.fade < G.fadeTarget) { G.fade = Math.min(G.fadeTarget, G.fade + sp); if (G.fade >= 1 && G.fadeCb) { const cb = G.fadeCb; G.fadeCb = null; cb(); } } else if (G.fade > G.fadeTarget) G.fade = Math.max(G.fadeTarget, G.fade - sp); }
  if (G.P && G.paused && netOnline()) { presT += dt; if (presT > 1) { presT = 0; lastPresT = -99; netPresence(false); } }
  if (!G.P || G.paused) return;
  G.t += dt; { const pt = G.time; G.time = (G.time + dt * 4.8) % 1440; if (G.time < pt) newDay(); } worldTick(dt); townTick(dt); islandTick(dt); trainTick(dt); vehicleTick(dt); subTick(dt); wedRemoteTick(dt); nightLifeTick(dt); kingdomTick(dt); familyTick(dt); arenaFullTick(dt); phenAllTick(dt); archiTick(dt); legacyTick(dt); v33Tick(dt);
  if (G.hitstop > 0) { G.hitstop -= dt; return; }
  downTick(dt); reviveTick(dt); petTick(dt);
  updatePlayer(dt);
  { const P = G.P, W = G.world; G.pSafe = P.map === 'world' && !!(W.flags[W.I(clamp(Math.floor(P.x / 16), 0, W.w - 1), clamp(Math.floor(P.y / 16), 0, W.h - 1))] & 4); if (G.pSafe) { const tx = P.x / 16, ty = P.y / 16, t = TOWNS.find(t => tx >= t.x0 - 4 && tx <= t.x1 + 4 && ty >= t.y0 - 4 && ty <= t.y1 + 4); if (t && P.wstate && (townRuled(t.k) || P.wstate.ev.some(e => e.town === t.k && (e.type === 'asalto' || e.type === 'horda')))) G.pSafe = false; } }
  if (SUMMONS.length) SUMMONS = SUMMONS.filter(e => !e.remove && G.ents.includes(e));
  for (const e of G.ents) { if (e.type === 'summon') { updateSummon(e, dt); continue; } if (e.type === 'rsum' || e.type === 'rcomp' || e.type === 'rpet' || e.type === 'rkid' || e.type === 'hpet') { updateRemoteExtra(e, dt); continue; } if (e.map !== G.map.id && e.type !== 'npc') continue; if (e.type === 'mob') updateMob(e, dt); else if (e.type === 'npc') { if (e.map === G.map.id) updateNPC(e, dt); } else if (e.type === 'kid') updateKid(e, dt); else if (e.type === 'proj') updateProj(e, dt); }
  separateMobs(G.map);
  if (G.ents.some(e => e.remove)) G.ents = G.ents.filter(e => !e.remove);
  for (const f of G.fx) { f.t += dt; if (f.follow) { f.x = f.follow.x; f.y = f.follow.y; } if (f.tick) { f.tt = (f.tt || 0) + dt; if (f.tt >= f.tick) { f.tt -= f.tick; f.cbTick && f.cbTick(f); } } if (f.t >= f.dur) { f.done = true; if (f.cb) f.cb(f); } }
  G.fx = G.fx.filter(f => !f.done);
  for (const p of G.parts) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.vz -= p.g * dt; if (p.z < 0 && p.g > 0) { p.z = 0; p.vz *= -0.3; p.vx *= 0.6; p.vy *= 0.6; } }
  G.parts = G.parts.filter(p => p.t < p.life);
  for (const t of G.texts) t.t += dt; G.texts = G.texts.filter(t => t.t < t.life);
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 18);
  updateCamera(dt);
  ambient(dt);
  tick5 += dt; if (tick5 > 0.5) { tick5 = 0; updateSpawns(); regionCheck(); respawnResources(G.map); const want = currentMusic(); if (want !== curMusic) setMusic(null); }
  saveT += dt; if (saveT > 20) { saveT = 0; saveGame(); }
  netTick(dt);
}
const _sep = [];
function separateMobs(M) {
  const P = G.P; _sep.length = 0;
  for (const e of G.ents) if (e.type === 'mob' && !e.dying && e.map === M.id && Math.abs(e.x - P.x) < 420 && Math.abs(e.y - P.y) < 300) _sep.push(e);
  for (let i = 0; i < _sep.length; i++) for (let j = i + 1; j < _sep.length; j++) {
    const a = _sep[i], b = _sep[j], rr = ((a.rad || 8) + (b.rad || 8)) * 0.85, dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
    if (d2 >= rr * rr) continue; const d = Math.sqrt(d2), ux = d > 0.01 ? dx / d : 1, uy = d > 0.01 ? dy / d : 0, push = (rr - d) * 0.2, wa = a.boss ? 0.1 : 1, wb = b.boss ? 0.1 : 1;
    moveEnt(M, a, -ux * push * wa, -uy * push * wa); moveEnt(M, b, ux * push * wb, uy * push * wb);
  }
}
function ambient(dt) {
  if (!G.quality || G.map !== G.world) return; const P = G.P, W = G.world; const i = W.I(clamp(Math.floor(P.x / 16), 0, W.w - 1), clamp(Math.floor(P.y / 16), 0, W.h - 1)); const rk = REGIONS[W.reg[i]].k; const night = darkness() > 0.3;
  const r = Math.random(); const x = G.cam.x + Math.random() * VW, y = G.cam.y + Math.random() * VH;
  if (rk === 'picos' && r < 0.6) part(x, y - 40, { vx: -8 + Math.random() * 6, vy: 18, z: 0, life: 3, c: '#ffffff' });
  else if (rk === 'nhar' && r < 0.4) part(x, y, { vx: (Math.random() - 0.5) * 10, vy: -6, vz: 14, life: 2.5, c: Math.random() < 0.5 ? '#ff7a2a' : '#5a4a44' });
  else if (rk === 'bosque' && r < 0.12) part(x, y - 30, { vx: 10, vy: 14, life: 3, c: Math.random() < 0.5 ? '#5a9a3a' : '#8a6a2a', s: 2 });
  else if (night && r < 0.12) part(x, y, { vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, vz: 4, life: 2.5, c: '#e8ff8a' });
  else if (rk === 'llanuras' && r < 0.08) part(x, y, { vx: 12, vy: 2, vz: 3, life: 3, c: '#f0e08a' });
}
