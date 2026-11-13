// ================= PLAYER, PROGRESSION, QUESTS, JOBS =================
const INV_MAX = 200;
function newPlayer(name, cls, app) {
  app = normApp(app);
  const C = CLASSES[cls]; const jobs = {}; for (const k in JOBS) jobs[k] = { lv: 1, xp: 0 };
  return { v: 1, name, cls, app, lv: 1, xp: 0, gold: 60, attr: Object.assign({}, C.base), apts: 0, spts: 1, skills: {}, slots: [null, null, null, null],
    equip: { weapon: { id: `w_${cls}_1` }, head: null, body: null, legs: null, feet: null, acc: null, neck: null }, inv: [{ id: 'pocion1', q: 4 }, { id: 'b_1' }], cos: {}, wardrobe: [], hideHelm: 0, jobs, quests: { active: {}, done: {} }, track: null,
    map: 'world', x: 118 * 16 + 8, y: 154 * 16, dir: 'up', ws: { albor: 1 }, explored: '', stats: { kills: 0, deaths: 0 }, board: { seed: 1, list: null }, potion: 'pocion1', lastTown: 'albor', time: 8 * 60, hp: -1, mp: -1, bossKills: {}, ship: 0 };
}
const SAVEKEYS = ['v', 'name', 'cls', 'app', 'lv', 'xp', 'gold', 'attr', 'apts', 'spts', 'skills', 'slots', 'equip', 'inv', 'jobs', 'quests', 'track', 'map', 'x', 'y', 'dir', 'ws', 'stats', 'board', 'potion', 'lastTown', 'time', 'hp', 'mp', 'bossKills', 'ship', 'savedAt', 'tips', 'cos', 'wardrobe', 'hideHelm', 'best', 'farm', 'xpBT', 'exW', 'rel', 'partner', 'homes', 'furn', 'store', 'kids', 'souls', 'soulSet', 'pass', 'pets', 'pet', 'dances', 'rail', 'cal', 'wstate'];
function serializeP(P) { const o = {}; for (const k of SAVEKEYS) o[k] = P[k]; o.time = G.time; o.explored = b64(P.exploredBits); o.savedAt = Date.now(); if (P.map !== 'world') { o.map = 'world'; o.x = P.retX || o.x; o.y = P.retY || o.y; } return o; }
function b64(u8) { let s = ''; for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s); }
function unb64(s, n) { const u = new Uint8Array(n); try { const r = atob(s || ''); for (let i = 0; i < Math.min(n, r.length); i++) u[i] = r.charCodeAt(i); } catch (e) { } return u; }
function initPlayerRuntime(P) {
  initWorldState(P);
  Object.assign(P, { type: 'player', anim: 'idle', af: 0, at: 0, hum: true, L: 0, flash: 0, ifr: 0, atkCd: 0, cds: {}, buffs: [], buff: {}, shield: 0, shR: 6, dead: false, target: null, combatT: -99, lastHurt: -99, job: null, fishing: null, act: null, hw: 4, hh: 3 });
  const ow = P.exW || 256;
  if (ow !== WW && P.explored) { const ob = unb64(P.explored, Math.ceil(ow * WH / 8)), nb = new Uint8Array(Math.ceil(WW * WH / 8)), mw = Math.min(ow, WW);
    for (let y = 0; y < WH; y++) for (let x = 0; x < mw; x++) { const i = y * ow + x; if (ob[i >> 3] & (1 << (i & 7))) { const j = y * WW + x; nb[j >> 3] |= 1 << (j & 7); } }
    P.exploredBits = nb; } else P.exploredBits = unb64(P.explored, Math.ceil(WW * WH / 8));
  P.exW = WW;
  for (const k in JOBS) if (!P.jobs[k]) P.jobs[k] = { lv: 1, xp: 0 };
  if (!('neck' in P.equip)) P.equip.neck = null; if (!('legs' in P.equip)) P.equip.legs = null; P.best = P.best || {}; P.farm = P.farm || {}; P.cos = P.cos || {}; P.wardrobe = P.wardrobe || []; P.xpBT = P.xpBT || 0;
  calcStats(P); if (P.hp < 0 || P.hp > P.S.maxhp) P.hp = P.S.maxhp; if (P.mp < 0 || P.mp > P.S.maxmp) P.mp = P.S.maxmp;
  P.atlas = playerAtlas(P);
}
// ---------- stats ----------
function skillVal(id, r) { const s = SK[id], o = {}; if (!r) return o; if (s.pas) for (const k in s.pas) o[k] = s.pas[k] * r; if (s.eff) { const e = s.eff; if (e.m !== undefined) o.m = Math.round((e.m + (e.mr || 0) * (r - 1)) * 100); if (e.st) for (const k in e.st) o[k] = e.st[k] + ((e.str && e.str[k]) || 0) * (r - 1); if (e.p !== undefined) o.p = e.p + (e.pr || 0) * (r - 1); } return o; }
function calcStats(P) {
  const C = CLASSES[P.cls], a = P.attr; let atk = 0, def = 0, hpB = 0, mpB = 0, crit = 0, spdB = 0;
  for (const sl in P.equip) { const e = P.equip[sl]; if (!e || !ITEMS[e.id]) continue; const it = ITEMS[e.id], k = 1 + 0.08 * (e.up || 0); atk += Math.round((it.atk || 0) * k); def += Math.round((it.def || 0) * k); hpB += Math.round((it.hpB || 0) * k); mpB += Math.round((it.mpB || 0) * k); crit += it.crit || 0; spdB += it.spdB || 0; }
  const pas = { atkP: 0, defP: 0, hpP: 0, crit: 0, critD: 0, life: 0, spdP: 0, aspdP: 0, mpReg: 0, dodge: 0, fireP: 0, vsPoison: 0 };
  for (const id in P.skills) { const s = SK[id]; if (s && s.type === 'pas') { const v = skillVal(id, P.skills[id]); for (const k in v) pas[k] = (pas[k] || 0) + v[k]; } }
  const b = P.buff || {};
  const main = a[C.main];
  const S = {};
  S.atk = Math.round((atk + main * 2.2 + P.lv * 1.6) * (1 + (pas.atkP + (b.atkP || 0)) / 100) * (1 + (b.food || 0) / 100));
  S.def = Math.round((def + a.vit * 1.1 + P.lv * 0.9) * (1 + (pas.defP + (b.defP || 0)) / 100) * (1 + (b.food || 0) / 200));
  S.maxhp = Math.round((C.hp + a.vit * 12 + P.lv * 15 + hpB) * (1 + pas.hpP / 100));
  S.maxmp = Math.round(C.mp + a.int * 6 + P.lv * 3 + mpB);
  S.crit = Math.min(65, 5 + a.dex * 0.12 + crit + pas.crit);
  S.critD = 150 + pas.critD; S.life = pas.life; S.dodge = Math.min(40, pas.dodge); S.fireP = pas.fireP; S.vsPoison = pas.vsPoison; S.mpReg = pas.mpReg;
  S.spd = (74 * (1 + (pas.spdP) / 100) + spdB * 0.8) * (P.wstate && G.map && G.map.isWorld && SETTINGS.weather && curWx() === 'snow' ? 0.93 : 1); S.aspd = C.aspd / (1 + (pas.aspdP + (b.aspdP || 0)) / 100);
  S.skillP = 0; weaponStats(P, S); swordStats(P, S); petStats(P, S); if (b.spdP) S.spd *= 1 + b.spdP / 100;
  { const cb = typeof compBonus === 'function' ? compBonus() : 0; if (cb) { S.atk = Math.round(S.atk * (1 + cb)); S.def = Math.round(S.def * (1 + cb)); } }
  S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10);
  P.S = S; if (P.hp > S.maxhp) P.hp = S.maxhp; if (P.mp > S.maxmp) P.mp = S.maxmp;
  return S;
}
function addBuff(P, id, st, dur) { removeBuff(P, id); P.buffs.push({ id, st, t: dur, dur }); recalcBuffs(P); }
function removeBuff(P, id) { const n = P.buffs.length; P.buffs = P.buffs.filter(b => b.id !== id); if (P.buffs.length !== n) recalcBuffs(P); }
function recalcBuffs(P) { const b = {}; for (const x of P.buffs) for (const k in x.st) b[k] = (b[k] || 0) + x.st[k]; P.buff = b; P.invis = !!b.invis; calcStats(P); }
// ---------- xp ----------
function gainXp(n) {
  const P = G.P; if (P.lv >= MAXLV) return; if (P.xpBT > 0) n = Math.round(n * 1.5); n = Math.round(n * xpEventMul()); P.xp += n;
  while (P.lv < MAXLV && P.xp >= xpToNext(P.lv)) {
    P.xp -= xpToNext(P.lv); P.lv++; const g = CLASSES[P.cls].grow; P.attrF = P.attrF || { str: 0, int: 0, dex: 0, vit: 0 };
    for (const k in g) { P.attrF[k] = (P.attrF[k] || 0) + g[k]; const w = Math.floor(P.attrF[k]); P.attr[k] += w; P.attrF[k] -= w; }
    P.apts += 3; P.spts += 1; calcStats(P); P.hp = P.S.maxhp; P.mp = P.S.maxmp; setTimeout(() => tip(P.spts ? 'skill' : 'attr'), 1500);
    addFx({ type: 'beam', x: P.x, y: P.y, dur: 0.9, col: 'rgba(255,230,120,0.6)' }); burst(P.x, P.y - 10, 30, { sp: 80, up: 60, g: 60, life: 1, c: ['#ffe080', '#ffffff', '#ffb040'] });
    sfx('level'); banner('¡Nivel ' + P.lv + '!', P.lv >= MAXLV ? 'Has alcanzado el nivel máximo' : '+3 atributos · +1 habilidad'); questEvent('level', {}); markDirty(true); netHero();
  }
  if (P.lv >= MAXLV) P.xp = 0;
  uiDirty.hud = true;
}
function gainJobXp(job, n) {
  const P = G.P, J = P.jobs[job]; if (J.lv >= JOBMAX) return; J.xp += n; floatText(P.x + 10, P.y - 46, '+' + n + ' ' + JOBS[job].n, '#9ae0ff');
  while (J.lv < JOBMAX && J.xp >= jobXpToNext(J.lv)) { J.xp -= jobXpToNext(J.lv); J.lv++; toast(JOBS[job].n + ' sube a nivel ' + J.lv, 'job'); sfx('level'); }
}
// ---------- inventory ----------
function countItem(id) { let n = 0; for (const s of G.P.inv) if (s && s.id === id) n += s.q || 1; return n; }
function giveItem(id, q = 1, silent) {
  const P = G.P, it = ITEMS[id]; if (!it) return false;
  if (it.t === 'cos') { if (!giveCosmetic(it.cos)) { const g = Math.round(it.price / 4); P.gold += g; toast('Ya tenías ' + it.n + ': +' + fmt(g) + ' oro', 'loot'); } return true; }
  if (it.stack) { const s = P.inv.find(s => s && s.id === id); if (s) { s.q += q; afterGive(id, q, silent); return true; } }
  for (let k = 0; k < q; k++) { if (P.inv.length >= INV_MAX) { toast('Inventario lleno', 'warn'); return false; } P.inv.push(it.stack ? { id, q: q } : { id }); if (it.stack) break; }
  afterGive(id, q, silent); return true;
}
function afterGive(id, q, silent) { const it = ITEMS[id]; if (G.P.inv.length >= INV_MAX - 3) tip('bag'); toast('+' + q + ' ' + it.n, 'loot', it.rar); questEvent('item', { it: id }); uiDirty.inv = true; if (it.t === 'weapon' || it.t === 'armor' || it.t === 'acc') autoEquipHint(id); }
function takeItem(id, q) { const P = G.P; let left = q; for (let i = P.inv.length - 1; i >= 0 && left > 0; i--) { const s = P.inv[i]; if (s.id !== id) continue; const n = s.q || 1; if (n <= left) { left -= n; P.inv.splice(i, 1); } else { s.q -= left; left = 0; } } uiDirty.inv = true; return left === 0; }
function canEquip(id) { const it = ITEMS[id], P = G.P; if (it.cls && it.cls !== P.cls) return 'Solo para ' + CLASSES[it.cls].n; if ((it.lv || 1) > P.lv) return 'Requiere nivel ' + it.lv; return null; }
function equipFromInv(idx) {
  const P = G.P, s = P.inv[idx]; if (!s) return; const it = ITEMS[s.id]; const why = canEquip(s.id); if (why) { toast(why, 'warn'); return; }
  const slot = it.slot; const old = P.equip[slot]; P.equip[slot] = s.up ? { id: s.id, up: s.up } : { id: s.id }; P.inv.splice(idx, 1); if (old) P.inv.push(old);
  calcStats(P); P.atlas = playerAtlas(P); sfx('equip'); toast('Equipado: ' + it.n); uiDirty.inv = uiDirty.hud = true; markDirty(); netHero();
}
function unequip(slot) { const P = G.P; const e = P.equip[slot]; if (!e) return; if (P.inv.length >= INV_MAX) { toast('Inventario lleno', 'warn'); return; } P.inv.push(e); P.equip[slot] = null; calcStats(P); P.atlas = playerAtlas(P); uiDirty.inv = uiDirty.hud = true; }
function autoEquipHint(id) { const it = ITEMS[id], P = G.P; if (canEquip(id)) return; const cur = P.equip[it.slot]; const score = x => x ? (ITEMS[x.id].atk || 0) * 2 + (ITEMS[x.id].def || 0) * 2 + (ITEMS[x.id].hpB || 0) * 0.2 : -1; if (score({ id }) > score(cur)) toast('Nuevo equipo mejor: ' + it.n + ' (Inventario)', 'info'); }
function missingTools() { return [['hacha1', 'tala'], ['cana1', 'pesca'], ['pico1', 'mineria']].filter(([, j]) => !bestTool(j)).map(([id]) => id); }
function bestTool(job) { let best = 0; for (const s of G.P.inv) { const it = ITEMS[s.id]; if (it.t === 'tool' && it.tool === job) best = Math.max(best, it.power); } return best; }
function useItem(idx) {
  const P = G.P, s = P.inv[idx]; if (!s) return; const it = ITEMS[s.id];
  if (it.t !== 'cons') { if (it.slot) equipFromInv(idx); return; }
  if (it.lv && P.lv < it.lv) { toast('Requiere nivel ' + it.lv, 'warn'); return; }
  if (it.recall) { if (P.map !== 'world') { toast('Úsalo al aire libre', 'warn'); return; } travelTo(P.lastTown || 'albor'); }
  if (it.heal) { P.hp = Math.min(P.S.maxhp, P.hp + it.heal); floatText(P.x, P.y - 40, '+' + Math.min(it.heal, 99999), '#6aff7a'); burst(P.x, P.y - 12, 10, { sp: 30, up: 40, g: -20, life: 0.8, c: ['#8aff8a', '#ffffff'] }); }
  if (it.mana) { P.mp = Math.min(P.S.maxmp, P.mp + it.mana); burst(P.x, P.y - 12, 10, { sp: 30, up: 40, g: -20, life: 0.8, c: ['#8ab0ff', '#ffffff'] }); }
  if (it.cure) { P.poison = 0; P.burn = 0; }
  if (it.food) addBuff(P, 'food', { food: it.food }, 180), toast('Bien alimentado: +' + it.food + '% ataque (3 min)');
  if (it.xpB) { P.xpBT = Math.max(P.xpBT || 0, 0) + it.dur; toast('Sabiduría: +' + it.xpB + '% experiencia (' + Math.round(P.xpBT / 60) + ' min)', 'quest'); }
  if (it.tonic) { addBuff(P, id, Object.assign({}, it.tonic), it.dur); toast(it.n + ': activo ' + Math.round(it.dur / 60) + ' min', 'quest'); }
  sfx('potion'); s.q--; if (s.q <= 0) P.inv.splice(idx, 1); uiDirty.inv = uiDirty.hud = true;
}
function quickPotion() { const P = G.P; let id = P.potion; if (!countItem(id)) { const opts = ['pocion5', 'pocion4', 'pocion3', 'pocion2', 'pocion1', 'elixir'].filter(x => countItem(x) && (ITEMS[x].lv || 1) <= P.lv); id = opts[0]; } if (!id) { toast('No tienes pociones', 'warn'); return; } const idx = P.inv.findIndex(s => s.id === id); if (P.potCd > 0) return; P.potCd = 1; useItem(idx); }
// ---------- skills ----------
function canLearn(id) { const P = G.P, s = SK[id], r = P.skills[id] || 0; if (s.cls !== P.cls) return 'Otra clase'; if (r >= s.max) return 'Rango máximo'; if (P.lv < s.req) return 'Requiere nivel ' + s.req; if (s.pre && !P.skills[s.pre]) return 'Requiere ' + SK[s.pre].n; if (P.spts <= 0) return 'Sin puntos de habilidad'; return null; }
function learnSkill(id) { const why = canLearn(id); if (why) { toast(why, 'warn'); return; } const P = G.P; P.skills[id] = (P.skills[id] || 0) + 1; P.spts--; if (SK[id].type === 'act' && !P.slots.includes(id)) { const e = P.slots.indexOf(null); if (e >= 0) P.slots[e] = id; } calcStats(P); sfx('learn'); uiDirty.skills = uiDirty.hud = true; markDirty(); }
// ---------- quests ----------
function QD(id) { return QUESTS[id] || (G.P.quests.active[id] && G.P.quests.active[id].def); }
function turnInNpc(Q) { if (Q.turnin) return Q.turnin; const t = Q.obj.find(o => o.t === 'talk'); return t ? t.npc : Q.giver; }
function sameNpc(a, b) { return a === b || (a && b && a.replace('_nhar', '') === b.replace('_nhar', '')); }
function canOffer(id) { const P = G.P, Q = QUESTS[id]; if (!Q || P.quests.done[id] || P.quests.active[id]) return false; if (P.lv < Q.lv) return false; if (Q.pre && !P.quests.done[Q.pre]) return false; return true; }
function objCount(Q, i) { const o = Q.obj[i], A = G.P.quests.active[Q.id]; if (!A) return 0; if (o.t === 'item') return Math.min(o.n, countItem(o.it)); if (o.t === 'level') return Math.min(o.n, G.P.lv); return Math.min(o.n || 1, A.p[i] || 0); }
function questReady(id) { const Q = QD(id); if (!Q || !G.P.quests.active[id]) return false; return Q.obj.every((o, i) => objCount(Q, i) >= (o.n || 1)); }
function acceptQuest(id, def) {
  const P = G.P, Q = def || QUESTS[id]; P.quests.active[id] = { p: Q.obj.map(() => 0) }; if (def) P.quests.active[id].def = def;
  if (Q.give) for (const [it, n] of Q.give) { const I_ = ITEMS[it]; if (I_ && I_.t === 'tool' && bestTool(I_.tool) > 0) continue; giveItem(it, n); } if (!P.track || Q.main) P.track = id;
  toast('Nueva misión: ' + Q.n, 'quest'); sfx('quest'); uiDirty.quest = true; questEvent('init', {}); markDirty();
}
function completeQuest(id) {
  const P = G.P, Q = QD(id); for (const o of Q.obj) if (o.t === 'item' && o.take) takeItem(o.it, o.n);
  const R = Q.rew; delete P.quests.active[id]; if (!Q.board) P.quests.done[id] = 1;
  if (R.gold) { P.gold += R.gold; } if (R.items) for (const [it, n] of R.items) giveItem(it, n); if (R.job) gainJobXp(R.job[0], R.job[1]); if (R.xp) gainXp(R.xp);
  toast('Misión completada: ' + Q.n, 'quest'); banner('Misión completada', Q.n); sfx('questdone');
  if (P.track === id) { P.track = null; const nm = Object.keys(P.quests.active).find(k => QD(k).main); P.track = nm || Object.keys(P.quests.active)[0] || null; }
  if (id === 'q14') setTimeout(() => showEnding(0), 1500);
  if (id === 'q21') setTimeout(() => showEnding(1), 1500);
  uiDirty.quest = uiDirty.hud = true; markDirty(true);
}
function questEvent(type, d) {
  const P = G.P; if (!P) return; let changed = false;
  for (const id in P.quests.active) {
    const Q = QD(id), A = P.quests.active[id]; if (!Q) continue; const wasReady = questReady(id);
    Q.obj.forEach((o, i) => {
      const n = o.n || 1; if ((A.p[i] || 0) >= n && o.t !== 'item') return;
      let inc = 0;
      if (type === 'kill' && o.t === 'kill' && ((o.m && o.m === d.m) || (o.fam && o.fam === d.fam))) inc = 1;
      if (type === 'boss' && o.t === 'boss' && o.b === d.b) inc = 1;
      if (type === 'talk' && o.t === 'talk' && sameNpc(o.npc, d.npc)) inc = 1;
      if (type === 'job' && o.t === 'job' && o.job === d.job && (!o.tier || d.tier >= o.tier)) inc = d.n || 1;
      if (type === 'craft' && o.t === 'craft' && (o.it === d.it || (o.it === 'weapon2' && d.it === `w_${P.cls}_2`))) inc = 1;
      if (inc) { A.p[i] = Math.min(n, (A.p[i] || 0) + inc); changed = true; }
    });
    if (!wasReady && questReady(id) && type !== 'init') { const npc = NPCS[turnInNpc(Q)]; toast('¡Objetivo cumplido! Vuelve con ' + (npc ? npc.n : 'el gremio'), 'quest'); sfx('quest'); }
  }
  if (changed || type === 'item' || type === 'init') uiDirty.quest = true;
}
function npcMarker(npcId) {
  const P = G.P; if (!P || !P.quests) return null; for (const id in P.quests.active) { const Q = QD(id); if (sameNpc(turnInNpc(Q), npcId) && !Q.board) { if (questReady(id)) return ['?', '#ffd23a']; } }
  const def = NPCS[npcId]; if (def && def.quests) for (const id of def.quests) if (canOffer(id)) return ['!', '#ffd23a'];
  for (const id in P.quests.active) { const Q = QD(id); if (sameNpc(turnInNpc(Q), npcId) && !Q.board) return ['?', '#a8a8b0']; }
  return null;
}
function trackedTarget() {
  const P = G.P, id = P.track; if (!id || !P.quests.active[id]) return null; const Q = QD(id);
  if (questReady(id)) { const npc = turnInNpc(Q); return { npc, label: 'Vuelve con ' + (NPCS[npc] ? NPCS[npc].n : 'Kael') }; }
  const i = Q.obj.findIndex((o, k) => objCount(Q, k) < (o.n || 1)); const o = Q.obj[i]; if (!o) return null;
  if (o.t === 'talk') return { npc: o.npc, loc: o.loc }; if (o.loc) return { loc: o.loc }; if (o.t === 'boss') { const b = G.world.bosses.find(x => x.id === o.b); return b ? { loc: [b.x, b.y] } : null; }
  if (o.t === 'kill') { const camp = nearestCampOf(o.m, o.fam); if (camp) return { loc: [camp.x, camp.y] }; }
  return null;
}
function guideTarget() {
  const t = trackedTarget(); if (t) return t; const P = G.P;
  if (P.track && P.quests.active[P.track]) return null;
  const avail = Object.keys(QUESTS).find(k => canOffer(k) && QUESTS[k].main);
  return avail ? { npc: QUESTS[avail].giver, label: 'Habla con ' + NPCS[QUESTS[avail].giver].n, next: avail } : null;
}
function guidePos(t) { if (!t) return null; if (t.npc) { const p = npcWorldPos(t.npc); if (p) return p; } return t.loc || null; }
function regionAt(tx, ty) { const W = G.world; if (!W || tx < 0 || ty < 0 || tx >= W.w || ty >= W.h) return null; return REGIONS[W.reg[W.I(tx | 0, ty | 0)]]; }
function nearestCampOf(m, fam) { const P = G.P; let best = null, bd = 1e12; for (const c of G.world.camps) { const def = MOBS[c.mob]; if ((m && c.mob === m) || (fam && def.fam === fam)) { const d = dist2(c.x * 16, c.y * 16, P.x, P.y) + Math.abs(c.lv - P.lv) * 4000; if (d < bd) { bd = d; best = c; } } } return best; }
function npcWorldPos(id) { for (const e of G.ents) if (e.type === 'npc' && sameNpc(e.id, id) && e.map === 'world') return [e.x / 16, e.y / 16]; const loc = { bruno: [126, 144], lia: [107, 155], nora: [127, 157], rey: [128, 40], ilsa: [111, 45], kael: [144, 57], brann: [110, 57], sela: [213, 122], gerta: [194, 136], hugo: [213, 137], bram: [195, 123], orla: [118, 63], elian: [137, 63], sir_pollo: [144, 44] }[id]; return loc || null; }
// ---------- bosses ----------
function bossKilled(m) {
  const P = G.P, B = BOSSES[m.mid]; const spot = G.world.bosses.find(b => b.id === m.mid); if (spot) { spot.ent = null; spot.respawn = G.t + 300; spot.hpLeft = 0; }
  const first = !P.bossKills[m.mid]; P.bossKills[m.mid] = (P.bossKills[m.mid] || 0) + 1;
  if (first || Math.random() < 0.2) { giveItem(B.acc, 1); }
  P.best['B_' + m.mid] = (P.best['B_' + m.mid] || 0) + 1;
  if (B.cos) { const miss = B.cos.filter(c => !(P.wardrobe || []).includes(c)); if (miss.length && (first || Math.random() < 0.4)) giveCosmetic(miss[(Math.random() * miss.length) | 0]); }
  for (const [id, ch, n] of B.drops) if (ch >= 1 || Math.random() < ch) { giveItem(id, n || 1); if (ITEMS[id] && ITEMS[id].leg) toast('¡ARMA LEGENDARIA! ' + ITEMS[id].n, 'quest', 6); }
  for (const e of G.ents) if (e.summoned) { e.remove = true; }
  questEvent('boss', { b: m.mid }); showBoss(null); setMusic(null); banner('¡' + B.n + ' derrotado!', first ? 'Has obtenido un tesoro legendario' : ''); G.shake = 8; markDirty(true);
}
// ---------- actions ----------
function useSkill(slot) {
  const P = G.P, id = P.slots[slot]; if (!id || P.dead || P.busy > 0 || P.job || P.fishing) return; const s = SK[id], r = P.skills[id]; if (!r) return;
  if ((P.cds[id] || 0) > 0) return; if (P.mp < s.mp) { toast('Maná insuficiente', 'warn'); return; }
  P.mp -= s.mp; P.cds[id] = s.cd; const e = s.eff, v = skillVal(id, r), mult = (v.m || 100) / 100 * (1 + (P.S.skillP || 0) / 100), atk = P.S.atk;
  const tgt = nearestMob(P.x, P.y, 170); if (tgt && e.k !== 'dash' && e.k !== 'blink') P.dir = dirFromVec(tgt.x - P.x, tgt.y - P.y);
  const ang = tgt && e.k !== 'dash' && e.k !== 'blink' ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]);
  const fx = P.x + Math.cos(ang) * 20, fy = P.y + Math.sin(ang) * 14;
  setAnim(P, e.k === 'buff' || e.k === 'heal' || e.k === 'shield' || e.k === 'nova' || e.k === 'rain' || e.k === 'field' || e.k === 'meteor' || e.k === 'vortex' || e.k === 'summon' || e.k === 'army' || e.k === 'kingsoul' || e.k === 'sumbuff' || e.k === 'concert' || e.k === 'beams' || e.k === 'skyfall' ? 'cast' : e.k === 'slam' || e.k === 'leap' ? 'slam' : 'atk'); P.busy = 0.32; P.loopAnim = false;
  const fire = e.fire || e.art === 'fire';
  switch (e.k) {
    case 'summon': case 'army': case 'kingsoul': case 'sumbuff': { if (!castSummon(id, r, mult, e)) { P.mp += s.mp; P.cds[id] = 0; toast(e.k === 'sumbuff' ? 'No tienes espíritus invocados' : 'No tienes almas. Derrota enemigos para capturarlas.', 'warn'); return; } break; }
    case 'concert': castConcert(id, r, mult, e); sfx('buff'); break;
    case 'skyfall': case 'beams': castExtra(id, r, mult, e, tgt, ang); break;
    case 'slash': delayAct(0.1, () => { hitArc(P.x, P.y, ang, e.r, e.arc, atk * mult, { kb: e.kb, exec: s.exec }); addFx({ type: 'slash', x: P.x, y: P.y, ang, arc: e.arc, r: e.r, dur: 0.25, col: P.cls === 'invocador' ? 'rgba(120,190,255,0.9)' : 'rgba(255,220,120,0.8)' }); sfx('slash2'); }); break;
    case 'spin': for (let k = 0; k < e.hits; k++) delayAct(0.08 + k * 0.11, () => { P.dir = ['down', 'left', 'up', 'right'][k % 4]; setAnim(P, 'atk'); hitCircle(P.x, P.y, e.r, atk * mult, {}); addFx({ type: 'slash', x: P.x, y: P.y, ang: k * 1.6, arc: 4.5, r: e.r * 0.8, dur: 0.2 }); sfx('swing'); }); P.busy = 0.5; break;
    case 'slam': delayAct(0.18, () => { const x = P.x + Math.cos(ang) * (e.front || 0), y = P.y + Math.sin(ang) * (e.front || 0) * 0.7; hitCircle(x, y, e.r, atk * mult, { stun: e.stun }); addFx({ type: 'ring', x, y, r: e.r, dur: 0.4, col: '#ffd890' }); burst(x, y, 20, { sp: 90, up: 40, g: 140, life: 0.6, c: ['#c8b090', '#8a7a6a', '#ffffff'] }); G.shake = 5; sfx('boom'); }); P.busy = 0.45; break;
    case 'dash': P.dashT = 0.2; P.dashA = Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]); P.dashV = e.dist / 0.2; P.dashHit = new Set(); P.dashDmg = e.m ? atk * mult : 0; P.dashStun = e.stun; P.ifr = Math.max(P.ifr, e.inv ? 0.35 : 0.15); sfx('dash'); break;
    case 'proj': { const n = e.n || 1; for (let k = 0; k < n; k++) { const a = ang + (n > 1 ? (k - (n - 1) / 2) * (e.spread / (n - 1)) * 1.0 : 0); delayAct(0.08, () => spawnProj('p', P.x, P.y - 6, a, { spd: e.spd, dmg: atk * mult, pierce: e.pierce, ex: e.ex, art: e.art, burn: e.burn, slow: e.slow, poison: e.poison, critB: e.critB, drain: e.drain, fire, life: 1.1 })); } sfx(e.art === 'fire' ? 'fire' : e.art === 'ice' ? 'ice' : 'bow'); break; }
    case 'rain': { const cxp = tgt ? tgt.x : fx + Math.cos(ang) * 40, cyp = tgt ? tgt.y : fy + Math.sin(ang) * 30; for (let k = 0; k < e.n; k++) { const x = cxp + (Math.random() - 0.5) * e.area * 2, y = cyp + (Math.random() - 0.5) * e.area * 1.3; delayAct(0.1 + k * 0.08, () => { addFx({ type: 'fall', x, y, dur: 0.3, art: e.art, col: e.art === 'meteor' ? '#ff7020' : '#ffffff' }); delayAct(0.3, () => { const hot = e.art === 'meteor' || e.art === 'phoenix'; hitCircle(x, y, e.r, atk * mult, { fire: fire || hot, burn: hot || e.burn }); addFx({ type: 'boom', x, y, r: e.r * 0.8, dur: 0.25, col: hot ? '#ff8a2a' : e.art === 'note' ? '#ffd040' : '#e8e0d0', light: hot ? 40 : 0 }); if (hot) sfx('boom'); if (e.art === 'phoenix') burst(x, y - 6, 8, { sp: 60, up: 50, g: 60, life: 0.5, c: ['#ff5a10', '#ffd040', '#fff4a0'] }); }); }); } break; }
    case 'nova': delayAct(0.12, () => { hitCircle(P.x, P.y, e.r, atk * mult, { freeze: e.freeze, root: e.root, burn: e.burn, stun: e.stun, poison: e.poison, fire }); addFx({ type: 'ring', x: P.x, y: P.y, r: e.r, dur: 0.45, col: e.art === 'ice' ? '#bfefff' : e.art === 'root' ? '#8aff6a' : e.art === 'note' ? '#ffd040' : e.art === 'soul' ? '#5ab0ff' : '#ff8a2a' }); burst(P.x, P.y - 8, 26, { sp: e.r * 2, up: 20, g: 40, life: 0.5, c: e.art === 'ice' ? ['#bfefff', '#ffffff'] : e.art === 'root' ? ['#6ac04a', '#a8e070'] : e.art === 'note' ? ['#ffd040', '#ff7ab0', '#7ad8ff'] : e.art === 'soul' ? ['#2a6ad0', '#5ab0ff', '#d0f0ff'] : ['#ff8a2a', '#ffd040'] }); if (e.art === 'note') for (let q = 0; q < 8; q++) addFx({ type: 'note', x: P.x + Math.cos(q * 0.8) * e.r * 0.6, y: P.y - 10 + Math.sin(q * 0.8) * e.r * 0.4, dur: 1, dbl: q & 1, col: ['#ffd040', '#ff7ab0', '#7ad8ff'][q % 3] }); sfx(e.art === 'ice' ? 'ice' : 'boom'); }); break;
    case 'field': { const x = e.self ? P.x : (tgt ? tgt.x : fx + Math.cos(ang) * 40), y = e.self ? P.y : (tgt ? tgt.y : fy); addFx({ type: 'field', ground: true, x, y, r: e.r, dur: e.ticks * 0.5, col: e.art === 'ice' ? '#bfefff' : e.art === 'note' ? '#ffd040' : e.art === 'soul' ? '#5ab0ff' : '#6ae04a', pc: e.art === 'ice' ? '#ffffff' : e.art === 'note' ? '#ff7ab0' : e.art === 'soul' ? '#d0f0ff' : '#a0ff80', tick: 0.5, follow: e.self ? P : null, cbTick: f => hitCircle(f.x, f.y, f.r, atk * mult, { slow: e.slow, poison: e.poison }, true) }); sfx('cast'); break; }
    case 'buff': { const st = {}; for (const k in e.st) st[k] = v[k] !== undefined ? v[k] : e.st[k]; addBuff(P, id, st, e.dur); if (e.pt) partyCast({ k: 'buff', id, st, dur: e.dur }); addFx({ type: 'ring', x: P.x, y: P.y, r: e.pt ? 60 : 26, dur: 0.5, col: '#ffd040' }); burst(P.x, P.y - 10, 16, { sp: 40, up: 50, g: -30, life: 0.8, c: ['#ffe080', '#ffffff'] }); sfx('buff'); break; }
    case 'leap': { const tx = tgt ? tgt.x : P.x + Math.cos(ang) * e.dist * 0.7, ty = tgt ? tgt.y : P.y + Math.sin(ang) * e.dist * 0.5; const L_ = Math.min(e.dist, Math.hypot(tx - P.x, ty - P.y)); const steps = 12; P.ifr = Math.max(P.ifr, 0.6); P.busy = 0.6; for (let k = 1; k <= steps; k++) delayAct(k * 0.03, () => { const nx = P.x + Math.cos(ang) * L_ / steps, ny = P.y + Math.sin(ang) * L_ / steps; moveEnt(G.map, P, nx - P.x, ny - P.y); P.z = Math.sin(k / steps * Math.PI) * 18; }); delayAct(steps * 0.03 + 0.02, () => { P.z = 0; hitCircle(P.x, P.y, e.r, atk * mult, { stun: e.stun, kb: 60 }); addFx({ type: 'ring', x: P.x, y: P.y, r: e.r, dur: 0.45, col: '#ffb060' }); burst(P.x, P.y, 26, { sp: 90, up: 60, g: 160, life: 0.7, c: ['#c8a070', '#8a6a48', '#ffffff'] }); G.shake = 7; sfx('boom'); vibrate(30); }); break; }
    case 'meteor': { const x = tgt ? tgt.x : fx + Math.cos(ang) * 50, y = tgt ? tgt.y : fy + Math.sin(ang) * 36; addFx({ type: 'field', ground: true, x, y, r: e.r, dur: e.delay, col: '#ff6a2a' }); delayAct(e.delay, () => { hitCircle(x, y, e.r, atk * mult, { burn: e.burn, fire: 1, stun: 0.6 }); addFx({ type: 'ring', x, y, r: e.r * 1.2, dur: 0.5, col: '#ffd040' }); burst(x, y - 6, 40, { sp: 120, up: 90, g: 160, life: 0.9, c: ['#ff7020', '#ffd040', '#5a2a10'] }); G.shake = 9; sfx('boom'); }); break; }
    case 'vortex': { const x = tgt ? tgt.x : fx + Math.cos(ang) * 40, y = tgt ? tgt.y : fy; addFx({ type: 'field', ground: true, x, y, r: e.r, dur: e.ticks * 0.4, col: '#a040e0' }); for (let k = 0; k < e.ticks; k++) delayAct(0.1 + k * 0.4, () => { for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.boss || m.map !== G.map.id) continue; const dx = x - m.x, dy = y - m.y, d = Math.hypot(dx, dy); if (d < e.r * 1.4 && d > 4) moveEnt(G.map, m, dx / d * Math.min(14, d * 0.4), dy / d * Math.min(14, d * 0.4)); } hitCircle(x, y, e.r, atk * mult, { slow: 1 }, true); burst(x, y - 8, 10, { sp: -60, up: 10, g: 0, life: 0.5, c: ['#c070ff', '#3a1a6a'] }); }); break; }
    case 'shield': P.shield = P.S.maxhp * v.p / 100; P.shieldT = e.dur; if (e.pt) partyCast({ k: 'heal', p: Math.round(v.p * 0.6) }); addFx({ type: 'ring', x: P.x, y: P.y, r: 22, dur: 0.6, col: '#c0a0ff' }); sfx('buff'); break;
    case 'heal': { const h = Math.round(P.S.maxhp * v.p / 100); P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 40, '+' + h, '#6aff7a'); burst(P.x, P.y - 10, 20, { sp: 30, up: 50, g: -30, life: 1, c: ['#8aff6a', '#ffffff'] }); if (e.pt) { partyCast({ k: 'heal', p: Math.round(v.p) }); addFx({ type: 'ring', x: P.x, y: P.y, r: 60, dur: 0.6, col: '#8aff6a' }); } sfx('potion'); break; }
    case 'blink': { const a = Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]); addFx({ type: 'ring', x: P.x, y: P.y, r: 14, dur: 0.3, col: '#c070ff' }); for (let k = 0; k < e.dist; k += 4) { const nx = P.x + Math.cos(a) * 4, ny = P.y + Math.sin(a) * 4; if (blockedFor(G.map, Math.floor(nx / 16), Math.floor(ny / 16), P.L)) break; P.x = nx; P.y = ny; } addFx({ type: 'ring', x: P.x, y: P.y, r: 14, dur: 0.3, col: '#c070ff' }); P.ifr = 0.2; sfx("blink"); break; }
    case 'shadow': { if (!tgt) { toast('Sin objetivo cercano', 'warn'); P.mp += s.mp; P.cds[id] = 0; return; } const a = Math.atan2(tgt.y - P.y, tgt.x - P.x); const bx = tgt.x + Math.cos(a) * 14, by = tgt.y + Math.sin(a) * 10; if (!blockedFor(G.map, Math.floor(bx / 16), Math.floor(by / 16), P.L)) { addFx({ type: 'ring', x: P.x, y: P.y, r: 12, dur: 0.3, col: '#b01e2e' }); P.x = bx; P.y = by; } P.dir = dirFromVec(tgt.x - P.x, tgt.y - P.y); delayAct(0.06, () => { hitMob(tgt, atk * mult, { critB: 25 }); addFx({ type: 'slash', x: tgt.x, y: tgt.y + 8, ang: 0, arc: 6.3, r: 14, dur: 0.2, col: 'rgba(255,60,80,0.8)' }); }); sfx('blink'); break; }
    case 'mark': { if (!tgt) { P.mp += s.mp; P.cds[id] = 0; toast('Sin objetivo cercano', 'warn'); return; } tgt.mark = 10; tgt.markP = v.p; delayAct(0.1, () => hitMob(tgt, atk * mult, {})); addFx({ type: 'ring', x: tgt.x, y: tgt.y, r: 18, dur: 0.6, col: '#ff3040' }); sfx('crit'); break; }
    case 'flurry': { if (e.vfx === 'void') { P.ifr = Math.max(P.ifr, e.hits * 0.07 + 0.2); P.invisT = e.hits * 0.07; addFx({ type: 'ring', x: P.x, y: P.y, r: 30, dur: 0.4, col: '#c070ff' }); burst(P.x, P.y - 10, 20, { sp: 60, up: 20, g: 0, life: 0.5, c: ['#1a0a2a', '#7a40c0', '#c070ff'] }); }
      for (let k = 0; k < e.hits; k++) delayAct(0.05 + k * (e.vfx === 'void' ? 0.07 : 0.09), () => { const t2 = nearestMob(P.x, P.y, e.r ? e.r + 40 : 60); if (t2) { hitMob(t2, atk * mult, {}); if (e.vfx === 'void') { const a = Math.random() * 6.28; addFx({ type: 'bolt', x: t2.x + Math.cos(a) * 24, y: t2.y - 8 + Math.sin(a) * 16, x2: t2.x - Math.cos(a) * 24, y2: t2.y - 8 - Math.sin(a) * 16, dur: 0.15, col: '#c070ff' }); burst(t2.x, t2.y - 8, 3, { sp: 50, up: 10, g: 0, life: 0.3, c: ['#7a40c0', '#ffd0ff'] }); } else addFx({ type: 'slash', x: t2.x, y: t2.y + 6, ang: Math.random() * 6, arc: 2, r: 12, dur: 0.15, col: 'rgba(255,80,100,0.9)' }); } sfx('swing'); }); P.busy = e.vfx === 'void' ? 0.6 : 1; break; }
  }
  uiDirty.hud = true;
}
function hitArc(x, y, ang, r, arc, dmg, src) { pvpArc(x, y, ang, r, arc, dmg); let n = 0; for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== G.map.id) continue; const dx = m.x - x, dy = (m.y - y) * 1.3, d = Math.hypot(dx, dy); if (d > r + (m.rad || 8)) continue; const a = Math.atan2(dy, dx); const da = Math.abs(((a - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (d < 12 || da <= arc / 2) { hitMob(m, dmg, src); n++; } } return n; }
function hitCircle(x, y, r, dmg, src, silent) { pvpCircle(x, y, r, dmg); let n = 0; for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== G.map.id) continue; if (dist2(m.x, (m.y - y) * 1.3 + y, x, y) <= (r + (m.rad || 8)) ** 2) { hitMob(m, dmg, src); n++; } } return n; }
function delayAct(t, fn) { G.P.acts = G.P.acts || []; G.P.acts.push({ t, fn }); }
function basicAttack() {
  const P = G.P; if (P.dead || P.busy > 0 || P.atkCd > 0 || P.job || P.fishing) return; const C = CLASSES[P.cls];
  const tgt = nearestMob(P.x, P.y, C.range + 60); if (tgt) { P.dir = dirFromVec(tgt.x - P.x, tgt.y - P.y); P.target = tgt; }
  const ang = tgt ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]);
  setAnim(P, 'atk'); P.loopAnim = false; P.atkCd = P.S.aspd; P.busy = Math.min(0.28, P.S.aspd * 0.8); P.combatT = G.t;
  if (P.invis) { /* ambush applies on hit */ }
  if (C.weapon === 'sword' || C.weapon === 'dagger' || C.weapon === 'scythe') {
    const sc = C.weapon === 'scythe', arc = C.weapon === 'dagger' ? 1.5 : sc ? 2.7 : 2.1;
    delayAct(0.09, () => { const n = hitArc(P.x, P.y, ang, C.range, arc, P.S.atk, { kb: C.weapon === 'dagger' ? 15 : 40 }); const WL = wInfo(P).leg; addFx({ type: 'slash', x: P.x, y: P.y, ang, arc: arc + 0.1, r: C.range * 0.9, dur: 0.18, col: WL ? WL.col1 || (WL.cls === 'guerrero' ? 'rgba(255,216,106,0.95)' : 'rgba(208,74,255,0.95)') : sc ? 'rgba(130,190,255,0.85)' : undefined }); if (WL) burst(P.x + Math.cos(ang) * 20, P.y + Math.sin(ang) * 14 - 8, 6, { sp: 50, up: 20, g: 40, life: 0.35, c: [WL.col, WL.col2] }); sfx(n ? 'slash' : 'swing'); });
  } else {
    delayAct(0.12, () => { const tg = P.target && !P.target.dying ? P.target : null; const a2 = tg ? Math.atan2(tg.y - 8 - (P.y - 8), tg.x - P.x) : ang; spawnProj('p', P.x + Math.cos(a2) * 6, P.y - 8, a2, weaponProjOpts({ spd: C.weapon === 'bow' ? 300 : 220, dmg: P.S.atk, art: C.weapon === 'bow' ? 'arrow' : C.weapon === 'lute' ? 'note' : 'orb', bard: C.weapon === 'lute' ? 1 : 0, life: C.range / (C.weapon === 'bow' ? 300 : 220) + 0.15 })); sfx(C.weapon === 'bow' ? 'bow' : C.weapon === 'lute' ? 'note' : 'magic'); });
  }
  weaponOnBasic(ang, tgt); swordOnBasic(ang, tgt);
}
function dodgeRoll() { const P = G.P; if (P.dead || P.dashCd > 0 || P.job || P.fishing) return; P.dashCd = 0.85; P.dashT = 0.16; const [mx, my] = moveInput(); const a = (mx || my) ? Math.atan2(my, mx) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]); P.dashA = a; P.dashV = 72 / 0.16; P.dashDmg = 0; P.ifr = Math.max(P.ifr, 0.24); burst(P.x, P.y, 6, { sp: 30, up: 10, life: 0.4, c: '#d8c8a8' }); sfx('dash'); }
// ---------- interaction ----------
function interactTarget() {
  const P = G.P, M = G.map; if (!M || P.dead) return null; const dv = DIRV[P.dir]; const fx = P.x + dv[0] * 12, fy = P.y + dv[1] * 10 - 2;
  let best = null, bd = 30 * 30;
  for (const e of G.ents) if ((e.type === 'npc' || e.type === 'kid') && e.map === P.map) { const d = Math.min(dist2(e.x, e.y, fx, fy), dist2(e.x, e.y, P.x, P.y) * 1.3); if (d < bd) { bd = d; best = { kind: 'npc', e, label: 'Hablar', icon: 'talk' }; } }
  if (best) return best;
  const tx0 = Math.floor((fx - 14) / 16), tx1 = Math.floor((fx + 14) / 16), ty0 = Math.floor((fy - 14) / 16), ty1 = Math.floor((fy + 18) / 16); bd = 26 * 26;
  for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
    const i = tileAt(M, tx, ty); if (i < 0) continue; const oi = M.objAt[i]; if (oi < 0) continue; const o = M.objs[oi]; const d = dist2(o.px, o.py - 4, fx, fy); if (d > bd) continue;
    let lab = null, icon = null;
    if (o.k === 'tree' && !o.deco && o.st !== 'stump' && o.st !== 'sapling' && WOODT[o.sp]) { lab = 'Talar'; icon = 'axe'; }
    else if (o.k === 'ore' && o.st !== 'dep') { lab = 'Minar'; icon = 'pick'; }
    else if (o.k === 'herb' && !o.hidden) { lab = 'Recoger'; icon = 'herb'; }
    else if (o.k === 'mound' && !o.hidden) { lab = 'Excavar'; icon = 'shovel'; }
    else if (o.k === 'plot') { const S = plotState(o); lab = S.st === 3 ? 'Cosechar' : S.st ? 'Creciendo' : 'Plantar'; icon = 'seed'; }
    else if (o.k === 'waystone') { lab = 'Viajar'; icon = 'ways'; }
    else if (o.k === 'sign') { lab = 'Leer'; icon = 'talk'; }
    else if ((o.k === 'cave' || o.k === 'mine') && M.isWorld) { const dr = M.doors.find(d => d.cave && Math.abs(d.x - o.tx) <= 1 && d.y === o.ty + 1); if (dr) { lab = 'Entrar'; icon = 'run'; o.door = dr; } }
    else if (o.k === 'furn' && o.f === 'board') { lab = 'Tablón'; icon = 'board'; }
    else if (o.k === 'furn' && (o.f === 'bed' || o.f === 'bigbed')) { lab = M.home && isHome(M.id) ? 'Dormir' : 'Descansar'; icon = 'talk'; }
    else if (o.k === 'furn' && FURN_ACT[o.f] && (o.f === 'salesign' || isHome(M.id))) { lab = FURN_ACT[o.f][0]; icon = FURN_ACT[o.f][1]; }
    if (lab) { bd = d; best = { kind: o.k, o, label: lab, icon }; }
  }
  if (best) return best;
  if (M.isWorld) { for (let k = 1; k <= 2; k++) { const wx = Math.floor((P.x + dv[0] * (6 + k * 12)) / 16), wy = Math.floor((P.y - 2 + dv[1] * (4 + k * 12)) / 16); const i = tileAt(M, wx, wy); if (i >= 0 && (M.ter[i] === T.WATER || M.ter[i] === T.DEEP || (M.ter[i] === T.LAVA && bestTool('pesca') >= 7))) return { kind: 'fish', tx: wx, ty: wy, label: 'Pescar', icon: 'rod' }; } }
  return null;
}
function doInteract() {
  const P = G.P; if (P.dead) return; if (P.fishing) { fishAction(); return; } if (P.job) return; const it = interactTarget(); if (!it) { basicAttack(); return; }
  if (it.kind === 'npc' && it.e.type === 'kid') { it.e.dir = dirFromVec(P.x - it.e.x, P.y - it.e.y); openKid(it.e); return; }
  if (it.kind === 'npc') { it.e.dir = dirFromVec(P.x - it.e.x, P.y - it.e.y); openDialog(it.e); return; }
  if (it.kind === 'waystone') { if (!P.ws[it.o.ws]) { P.ws[it.o.ws] = 1; toast('Piedra de viaje activada: ' + WAYSTONES.find(w => w.k === it.o.ws).n, 'quest'); sfx('quest'); markDirty(); } openTravel(); return; }
  if ((it.kind === 'cave' || it.kind === 'mine') && it.o.door) { enterInterior(it.o.door); return; }
  if (it.kind === 'sign') { toast('Norte: Ciudadela de Arxar · Este: Puerto Coral · Oeste: Bosque Susurrante', 'info'); return; }
  if (it.kind === 'furn' && it.o.f === 'board') { openBoard(); return; }
  if (it.kind === 'furn' && (it.o.f === 'bed' || it.o.f === 'bigbed')) { if (G.map.home && isHome(G.map.id)) sleepHome(); else toast('Descansa en la posada hablando con el posadero', 'info'); return; }
  if (it.kind === 'furn' && FURN_ACT[it.o.f]) { FURN_ACT[it.o.f][2](); return; }
  if (it.kind === 'tree' || it.kind === 'ore') {
    const job = it.kind === 'tree' ? 'tala' : 'mineria', tier = it.kind === 'tree' ? WOODT[it.o.sp] : it.o.tier, need = RESLV[tier], tool = bestTool(job), needTool = Math.ceil(tier / 2);
    if (!tool) { toast((it.kind === 'tree' ? 'Necesitas un hacha' : 'Necesitas un pico') + ': pídesela gratis a la Anciana Mira o cómprala en la tienda', 'warn'); tip('tools'); return; }
    if (P.jobs[job].lv < need) { toast('Requiere ' + JOBS[job].n + ' nivel ' + need, 'warn'); return; }
    if (tool < needTool) { toast('Necesitas una herramienta mejor (nivel ' + needTool + ')', 'warn'); return; }
    if (it.o.hp === undefined || it.o.hp <= 0) it.o.hp = 3 + tier * 2;
    P.job = { kind: job, o: it.o, tier, t: 0, tool }; P.dir = dirFromVec(it.o.px - P.x, it.o.py - 6 - P.y); setAnim(P, job === 'tala' ? 'chop' : 'mine'); P.loopAnim = true; return;
  }
  if (it.kind === 'plot') { farmAction(it.o); return; }
  if (it.kind === 'mound') { const tier = it.o.tier, need = RESLV[tier], tool = bestTool('excavacion'); if (!tool) { toast('Necesitas una pala: cómprala en la tienda', 'warn'); return; } if (P.jobs.excavacion.lv < need) { toast('Requiere Excavación nivel ' + need, 'warn'); return; } if (tool < Math.ceil(tier / 2)) { toast('Necesitas una pala mejor (nivel ' + Math.ceil(tier / 2) + ')', 'warn'); return; } P.job = { kind: 'excavacion', o: it.o, tier, t: 0, tool }; P.dir = dirFromVec(it.o.px - P.x, it.o.py - 6 - P.y); setAnim(P, 'dig'); P.loopAnim = true; return; }
  if (it.kind === 'herb') { const tier = it.o.tier, need = RESLV[tier]; if (P.jobs.herbo.lv < need) { toast('Requiere Herboristería nivel ' + need, 'warn'); return; } P.job = { kind: 'herbo', o: it.o, tier, t: 0 }; setAnim(P, 'gather'); P.loopAnim = true; return; }
  if (it.kind === 'fish') { if (!bestTool('pesca')) { toast('Necesitas una caña de pescar', 'warn'); return; } startFishing(it.tx, it.ty); return; }
}
function updateJob(dt) {
  const P = G.P, J = P.job; if (!J) return; if (J.kind === 'buceo') { updateDive(dt); return; } J.t += dt;
  if (J.kind === 'herbo') { if (J.t > 1) { const o = J.o; o.hidden = true; o.respawn = G.t + 50; const n = 1 + (Math.random() < 0.25 + P.jobs.herbo.lv * 0.01 + (perk('herbo', 15) ? 0.1 : 0) ? 1 : 0); giveItem('herb' + J.tier, n); petOnHarvest('herbo', J.tier); if (perk('herbo', 35) && Math.random() < 0.06 && ITEMS['herb' + (J.tier + 1)]) giveItem('herb' + (J.tier + 1), 1); gainJobXp('herbo', 8 + J.tier * 9); questEvent('job', { job: 'herbo', tier: J.tier, n: 1 }); burst(o.px, o.py - 6, 8, { sp: 30, up: 30, g: 60, life: 0.5, c: ['#8ad050', '#ffffff'] }); sfx('pickup'); P.job = null; setAnim(P, 'idle'); } return; }
  if (J.kind === 'excavacion') { if (Math.floor(J.t / 0.55) !== Math.floor((J.t - dt) / 0.55)) { burst(J.o.px, J.o.py - 4, 5, { sp: 40, up: 40, g: 140, life: 0.5, c: ['#8a6436', '#6a4a26'] }); sfx('mine'); } if (J.t > Math.max(0.9, 2.2 - J.tool * 0.15 - P.jobs.excavacion.lv * 0.01) * (perk('excavacion', 15) ? 0.85 : 1)) { finishDig(J); P.job = null; setAnim(P, 'idle'); } return; }
  const per = 0.62 * (perk(J.kind, 10) ? 0.85 : 1); if (J.t >= per) {
    J.t -= per; const o = J.o; const pow = J.tool + Math.floor(P.jobs[J.kind].lv / 12); o.hp -= pow; o.hit = 0.2; G.shake = 1;
    if (J.kind === 'tala') { burst(o.px, o.py - 20, 6, { sp: 50, up: 30, g: 100, life: 0.6, c: ['#3a7a2a', '#5aa040', '#8a6040'] }); sfx('chop'); } else { burst(o.px, o.py - 8, 6, { sp: 50, up: 40, g: 140, life: 0.5, c: ['#a0a0a8', '#ffffff', uCss(C(ORE[J.tier][1]))] }); sfx('mine'); }
    if (o.hp <= 0) {
      const item = (J.kind === 'tala' ? 'log' : 'ore') + J.tier; const n = 1 + (Math.random() < 0.2 + P.jobs[J.kind].lv * 0.012 ? 1 : 0); giveItem(item, n); gainJobXp(J.kind, 10 + J.tier * 11); questEvent('job', { job: J.kind, tier: J.tier, n: 1 }); jobHarvestBonus(J.kind, J.tier, o);
      if (J.kind === 'tala') { o.st = 'stump'; o.respawn = G.t + 70; } else { o.st = 'dep'; o.respawn = G.t + 80; }
      P.job = null; setAnim(P, 'idle'); sfx('pickup'); markDirty();
    }
  }
}
function respawnResources(M) { for (const o of M.objs) { if (o.respawn && G.t > o.respawn) { o.respawn = 0; o.st = null; o.hidden = false; o.hp = undefined; } } }
// ---------- fishing ----------
function habitatAt(tx, ty) { const W = G.world, i = W.I(tx, ty); const rk = REGIONS[W.reg[i]].k; if (rk === 'nhar') return 'nhar'; if (rk === 'desierto') return 'oasis'; if (rk === 'selva' || rk === 'cristal' || rk === 'eclipse') return rk; if (rk === 'picos') return 'hielo'; if (rk === 'pantano') return 'pantano'; if (rk === 'mar' || W.ter[i] === T.DEEP) return 'mar'; if (W.riverMask[i]) return 'rio'; return 'lago'; }
function startFishing(tx, ty) { const P = G.P; P.dir = dirFromVec(tx * 16 + 8 - P.x, ty * 16 + 8 - P.y); P.fishing = { state: 'wait', t: (2 + Math.random() * 4) * (perk('pesca', 20) ? 0.65 : 1) * (petHas('fish') ? 0.7 : 1), bob: { x: tx * 16 + 8, y: ty * 16 + 8 }, hab: habitatAt(tx, ty) }; setAnim(P, 'fish'); P.loopAnim = false; sfx('cast'); burst(tx * 16 + 8, ty * 16 + 8, 6, { sp: 20, up: 20, g: 80, life: 0.4, c: '#d8f4ff' }); }
function pickFish(hab) { const P = G.P, lv = P.jobs.pesca.lv, rod = bestTool('pesca'); const pool = FISH.filter(f => f[3].includes(hab) && RESLV[f[2]] <= lv && Math.ceil(f[2] / 2) <= rod); if (!pool.length) { const any = FISH.filter(f => f[3].includes(hab)).sort((a, b) => a[2] - b[2])[0]; return any ? any : FISH[0]; } const maxT = Math.max(...pool.map(f => f[2])); const ws = pool.map(f => ({ f, w: f[2] === maxT ? 1 : f[2] === 7 ? 0.2 : 2 })); return choiceW(new RNG((Math.random() * 1e9) | 0), ws).f; }
function updateFishing(dt) {
  const P = G.P, F = P.fishing; if (!F) return;
  if (F.state === 'wait') { F.t -= dt; if (F.t <= 0) { F.state = 'bite'; F.t = 1.3; F.fish = pickFish(F.hab); sfx('bite'); vibrate(40); burst(F.bob.x, F.bob.y, 8, { sp: 30, up: 20, g: 80, life: 0.4, c: '#ffffff' }); } }
  else if (F.state === 'bite') { F.t -= dt; if (F.t <= 0) { toast('El pez se escapó...', 'warn'); stopFishing(); } }
  else if (F.state === 'reel') updateReel(dt);
}
function fishAction() { const F = G.P.fishing; if (!F) return; if (F.state === 'wait') { stopFishing(); return; } if (F.state === 'bite') { F.state = 'reel'; startReel(F.fish); } }
function stopFishing() { const P = G.P; P.fishing = null; setAnim(P, 'idle'); hideReel(); }
function fishCaught(fish) { const P = G.P, [id, n, tier] = fish; giveItem(id, 1); gainJobXp('pesca', 12 + tier * 12); questEvent('job', { job: 'pesca', tier, n: 1 }); sfx('pickup'); floatText(P.x, P.y - 50, n, '#9ae0ff'); stopFishing(); markDirty(); }
