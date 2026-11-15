// =====================================================================================
// v4.47: cazadores con poder propio (como jugadores), IA más lista, mazmorras sin reaparición,
// modo espectador sin ataques, enemigos/jefes/góticos nuevos sacados de las imágenes de Sergio.
// =====================================================================================

// ---------- utilidades de dibujo para sprites sacados de imágenes ----------
function a47Load(src, cb) { const im = new Image(); im.onload = () => { try { cb(im); } catch (e) { console.warn(e); } }; im.src = src; return im; }
// humanoide con 4 vistas (abajo, izquierda, derecha, arriba): idle, walk, atk, cast, hurt como los jugadores
function a47HumAtlas(img, cells, cw, ch, sc) {
  sc = sc || 1; const FW = Math.max(Math.round(48 * sc), Math.ceil((cw * sc + 8) / 2)), FH = Math.max(Math.round(48 * sc), Math.ceil((ch * sc + 10) / 2)), FWh = FW * 2, FHh = FH * 2, set = ['idle', 'walk', 'atk', 'cast', 'hurt'], idx = {}; let N = 0; for (const a of set) { idx[a] = N; N += ANIMS[a][1]; }
  const hi = mkCanvas(FWh * N, FHh * 4), hx = hi.getContext('2d'); hx.imageSmoothingEnabled = false; const w = Math.round(cw * sc), h = Math.round(ch * sc), legY = Math.round(h * 0.84), dirx = { down: 0, left: -1, right: 1, up: 0 }, diry = { down: 1, left: 0, right: 0, up: -1 };
  const tmp = mkCanvas(w, h), tx = tmp.getContext('2d'); tx.imageSmoothingEnabled = false;
  DIRS.forEach((dir, di) => { const c = cells[dir]; tx.clearRect(0, 0, w, h); tx.drawImage(img, c[0], c[1], cw, ch, 0, 0, w, h); const side = dir === 'left' || dir === 'right';
    for (const a of set) for (let f = 0; f < ANIMS[a][1]; f++) { const ox = (idx[a] + f) * FWh, oy = di * FHh, bx = ox + (FWh - w >> 1), by = oy + FHh - 6 - h; let dx = 0, dy = 0, lL = 0, lR = 0;
      if (a === 'idle') dy = f ? -1 : 0; else if (a === 'walk') { dy = f % 2 ? -2 : 0; if (side) lL = f === 1 ? 2 : f === 3 ? -2 : 0; else { lL = f === 1 ? -2 : 0; lR = f === 3 ? -2 : 0; } }
      else if (a === 'atk') { const k = [0, 3, 6, 2][f]; dx = dirx[dir] * k; dy = Math.round(diry[dir] * k * 0.6) - (f === 1 ? 2 : 0); } else if (a === 'cast') dy = -2 - f; else if (a === 'hurt') { dx = -dirx[dir] * 3; dy = -diry[dir] * 2; }
      hx.drawImage(tmp, 0, 0, w, legY, bx + dx, by + dy, w, legY);
      if (side) hx.drawImage(tmp, 0, legY, w, h - legY, bx + dx + lL, by + dy + legY, w, h - legY); else { const hw = w >> 1, y2 = by + legY + Math.min(dy, 0); hx.drawImage(tmp, 0, legY, hw, h - legY, bx + dx, y2 + lL, hw, h - legY); hx.drawImage(tmp, hw, legY, w - hw, h - legY, bx + dx + hw, y2 + lR, w - hw, h - legY); }
      if (a === 'hurt') { hx.save(); hx.globalCompositeOperation = 'source-atop'; hx.fillStyle = 'rgba(255,60,60,0.45)'; hx.fillRect(ox, oy, FWh, FHh); hx.restore(); } } });
  const im2 = mkCanvas(FW * N, FH * 4), ix = im2.getContext('2d'); ix.imageSmoothingEnabled = true; ix.drawImage(hi, 0, 0, im2.width, im2.height);
  return { img: im2, hi, fw: FW, fh: FH, idx, ax: FW >> 1, ay: FH - 4, hna: 1 }; }
// criatura: cells = {down,left,right,up} o una sola vista (se voltea a la derecha). Anim: idle 2, walk 4, atk 3, hurt 1
function a47MobAtlas(img, cells, cw, ch, opt) {
  opt = opt || {}; const one = !cells.down, FWh = cw + 16, FHh = ch + 16, FW = FWh >> 1, FH = FHh >> 1, N = 10, hi = mkCanvas(FWh * N, FHh * 4), x = hi.getContext('2d'); x.imageSmoothingEnabled = false;
  const tmp = mkCanvas(cw, ch), tx = tmp.getContext('2d'); tx.imageSmoothingEnabled = false;
  DIRS.forEach((dir, di) => { const c = one ? cells : cells[dir]; tx.clearRect(0, 0, cw, ch); tx.save(); if (one && dir === 'right') { tx.translate(cw, 0); tx.scale(-1, 1); } tx.drawImage(img, c[0], c[1], cw, ch, 0, 0, cw, ch); tx.restore();
    const lx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0, ly = dir === 'down' ? 1 : dir === 'up' ? -1 : 0;
    for (const a in MOBANIM) for (let f = 0; f < MOBANIM[a][1]; f++) { const ox = (MOBANIM[a][0] + f) * FWh, oy = di * FHh; let dx = 0, dy = 0, sx = 1, sy = 1;
      if (a === 'idle') { dy = opt.float ? (f ? -3 : 0) : (f ? -1 : 0); sy = f ? 1.02 : 1; } else if (a === 'walk') { dy = opt.float ? [0, -2, -4, -2][f] : [0, -2, 0, -2][f]; sx = [1, 0.97, 1, 0.97][f]; sy = [1, 1.03, 1, 1.03][f]; }
      else if (a === 'atk') { const k = [2, 7, 2][f]; dx = lx * k; dy = ly * k * 0.6 - (f === 0 ? 3 : 0); sy = [1.05, 0.95, 1][f]; } else if (a === 'hurt') { dx = -lx * 3; dy = -2; }
      const w = Math.round(cw * sx), h = Math.round(ch * sy); x.drawImage(tmp, 0, 0, cw, ch, ox + (FWh - w >> 1) + dx, oy + FHh - 4 - h + Math.round(dy), w, h);
      if (a === 'hurt') { x.save(); x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(255,255,255,0.4)'; x.fillRect(ox, oy, FWh, FHh); x.restore(); } } });
  const img2 = mkCanvas(FW * N, FH * 4), ix = img2.getContext('2d'); ix.imageSmoothingEnabled = true; ix.drawImage(hi, 0, 0, img2.width, img2.height);
  const idx = {}; for (const a in MOBANIM) idx[a] = MOBANIM[a][0]; return { img: img2, hi, fw: FW, fh: FH, idx, ax: FW >> 1, ay: FH - 3 }; }

// ---------- 12 enemigos de mazmorra ----------
const A47 = { mob: null, alfa: null, torm: null, goth: null, cache: {} };
const A47_OLD = {};
for (const id of ART47_MOB.ids) if (MOBS[id]) { A47_OLD[id] = MOBS[id].art; MOBS[id].art = ['art47', id]; if (DG_MOBS[id]) DG_MOBS[id][1] = MOBS[id].art; }
A47_OLD.alfa_nocturno = BOSSES.alfa_nocturno.art; BOSSES.alfa_nocturno.art = ['art47b', 'alfa'];
A47_OLD.senor_tormentas = BOSSES.senor_tormentas.art; BOSSES.senor_tormentas.art = ['art47b', 'torm'];
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) {
    if (art && art[0] === 'art47') { const k = art[1]; if (!A47.mob) return _ma(A47_OLD[k]); if (A47.cache[k]) return A47.cache[k]; const i = ART47_MOB.ids.indexOf(k), cw = ART47_MOB.cw, ch = ART47_MOB.ch; return A47.cache[k] = a47MobAtlas(A47.mob, [i * cw, 0], cw, ch, { float: /elemental_fuego|elemental_hielo|espectro/.test(k) }); }
    if (art && art[0] === 'art47b') { const k = art[1], im = A47[k], id = k === 'alfa' ? 'alfa_nocturno' : 'senor_tormentas'; if (!im) return _ma(A47_OLD[id]); if (A47.cache[k]) return A47.cache[k]; const S = k === 'alfa' ? ART47_ALFA : ART47_TORM, cw = S.cw, ch = S.ch, c = {}; DIRS.forEach(d => { c[d] = [[0, 1, 2, 3][['down', 'left', 'right', 'up'].indexOf(d)] * cw, 0]; }); return A47.cache[k] = a47MobAtlas(im, c, cw, ch, { float: k === 'torm' }); }
    return _ma.apply(this, arguments); }; }
function a47Refresh() { for (const e of G.ents) if (e.type === 'mob' && e.def && e.def.art && /^art47/.test(e.def.art[0])) e.atlas = mobAtlasFor(e.def.art); }
a47Load(ART47_MOB.src, im => { A47.mob = im; a47Refresh(); });
a47Load(ART47_ALFA.src, im => { A47.alfa = im; a47Refresh(); });
a47Load(ART47_TORM.src, im => { A47.torm = im; a47Refresh(); });

// ---------- góticos con 4 direcciones y romance ----------
const A47_GSC = { goth_raven: 1, goth_dorian: 1 };
{ const _na = npcAtlas; npcAtlas = function (id) { if (A47.goth && ART47_GOTH.ids.includes(id)) { if (A47.cache[id]) return A47.cache[id]; const r = ART47_GOTH.ids.indexOf(id), cw = ART47_GOTH.cw, ch = ART47_GOTH.ch, c = {}; ['down', 'left', 'right', 'up'].forEach((d, i) => c[d] = [i * cw, r * ch]); return A47.cache[id] = a47HumAtlas(A47.goth, c, cw, ch, A47_GSC[id] || 0.96); } return _na.apply(this, arguments); }; }
a47Load(ART47_GOTH.src, im => { A47.goth = im; for (const e of G.ents) if (e.id && ART47_GOTH.ids.includes(e.id)) e.atlas = npcAtlas(e.id); });
if (NPCS.goth_raven) { NPCS.goth_raven.look = Object.assign({}, NPCS.goth_raven.look, { hairStyle: 'short' }); NPCS.goth_raven.title = L2('Coleccionista de rarezas', 'Collector of oddities'); }
ROM.goth_morwenna = { g: 'f', loves: ['cloth', 'gem', 'ring'], likes: ['bouquet', 'amulet', 'cake'], hates: ['fish', 'ore'], taste: L2('las telas negras, las joyas y los anillos', 'black fabrics, jewels and rings') };
ROM.goth_lilith = { g: 'f', loves: ['bouquet', 'relic', 'crystal'], likes: ['gem', 'cake'], hates: ['fish', 'pelt'], taste: L2('las rosas, las reliquias y los cristales', 'roses, relics and crystals') };
ROM.goth_nyx = { g: 'f', loves: ['crystal', 'gem', 'cake'], likes: ['bouquet', 'ring'], hates: ['bone', 'ore'], taste: L2('los cristales, las gemas y los dulces', 'crystals, gems and sweets') };
ROM.goth_raven = { g: 'm', loves: ['relic', 'bone', 'fang'], likes: ['gem', 'crystal'], hates: ['bouquet', 'cake'], taste: L2('las rarezas: reliquias, huesos y colmillos', 'oddities: relics, bones and fangs') };
ROM.goth_dorian = { g: 'm', loves: ['crystal', 'relic', 'ring'], likes: ['gem', 'food'], hates: ['fish', 'spore'], taste: L2('los cristales, las reliquias y los anillos', 'crystals, relics and rings') };
Object.assign(ROM_WHERE, { goth_morwenna: L2('Albor (tienda gótica)', 'Albor (gothic shop)'), goth_lilith: 'Puerto Coral', goth_nyx: 'Arxar', goth_raven: 'Sahrim', goth_dorian: 'Yarakai' });
if (typeof WED_SPOUSE_LINES !== 'undefined') Object.assign(WED_SPOUSE_LINES, { goth_morwenna: L2('¡Morwenna se casa… de negro, claro!', 'Morwenna is getting married… in black, of course!'), goth_lilith: L2('Lilith escribió un poema para su boda.', 'Lilith wrote a poem for her wedding.'), goth_nyx: L2('Nyx tocará el violín en su propia boda.', 'Nyx will play violin at her own wedding.'), goth_raven: L2('Raven se casa. Dicen que el anillo es de hueso de cuervo.', 'Raven is getting married. They say the ring is raven bone.'), goth_dorian: L2('Dorian por fin sonríe: se casa.', 'Dorian finally smiles: he\'s getting married.') });

// ---------- cazadores con poder propio: estadísticas como un jugador de su nivel y clase ----------
const HNS_GEAR = {};
function hnGear(cls, lv) { const k = cls + '|' + lv; if (HNS_GEAR[k]) return HNS_GEAR[k]; const best = {}; for (const id in ITEMS) { const it = ITEMS[id]; if (!it.slot || it.quest || it.cos || !(it.price > 0) || (it.lv || 1) > lv || (it.cls && it.cls !== cls)) continue; const v = (it.atk || 0) * 3 + (it.def || 0) * 2 + (it.hpB || 0) * 0.2; if (!best[it.slot] || v > best[it.slot].v) best[it.slot] = { v, it }; }
  const g = { atk: 0, def: 0, hpB: 0, crit: 0 }; for (const s in best) { const it = best[s].it; g.atk += it.atk || 0; g.def += it.def || 0; g.hpB += it.hpB || 0; g.crit += it.crit || 0; } return HNS_GEAR[k] = g; }
function hnWm(h) { const s = hnState(h); if (s.wm === undefined) s.wm = Math.min(WM_MAX || 100, Math.round(hnLv(h) * 0.3)); return s.wm; }
function hnStats(h) { const L = hnLv(h), C = CLASSES[h.cls] || CLASSES.guerrero, g = hnGear(h.cls, L), up = Math.min(10, Math.floor(L / 30)), k = 1 + 0.08 * up, main = 5 + (L - 1) * 2.1, vit = 5 + (L - 1) * 0.9, wm = hnWm(h), rk = hnRank(h);
  const atkP = Math.min(45, L * 0.15) + rk * 3, hpP = Math.min(35, L * 0.1) + rk * 2;
  const S = { lv: L, wm, rk, atk: Math.round((g.atk * k + main * 2.2 + L * 1.6) * (1 + atkP / 100) * (1 + wm * 0.001 + (wm >= 50 ? 0.05 : 0))), def: Math.round((g.def * k + vit * 1.1 + L * 0.9) * (1 + rk * 0.03)), maxhp: Math.round((C.hp + vit * 12 + L * 15 + g.hpB * k) * (1 + hpP / 100)), crit: Math.min(55, 5 + L * 0.06 + g.crit), aspd: C.aspd };
  return S; }
huntAtk = function (a) { const S = a.S || (a.S = hnStats(a.h)), cr = Math.random() * 100 < S.crit; return Math.max(1, Math.round(S.atk * (cr ? 1.6 : 1) * (0.92 + Math.random() * 0.16))); };
huntHurt = function (a, base, lv) { if (!a || a.down) return; const S = a.S || (a.S = hnStats(a.h)); const d = Math.round(base * dmgRedP(S.def, lv || S.lv) * (0.9 + Math.random() * 0.2)); a.hp -= d; floatText(a.x, a.y - 36, d, '#ff8a8a'); a.flash = 0.1; if (a.hp <= 0) { a.hp = 0; a.down = true; a.downT = 15; setAnim(a, 'idle'); floatText(a.x, a.y - 44, L2('¡Caído!', 'Down!'), '#ff6a6a'); } };
function hnInit(a) { if (a.S0) return; a.S0 = 1; a.S = hnStats(a.h); a.maxhp = a.S.maxhp; a.hp = a.maxhp; a.pots = 3; a.tcd = 2 + Math.random() * 3; a.hcd = 3; }
// los cazadores también ganan maestría de arma y suben con el tiempo
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { if (m && m.type === 'mob' && HUNT.allies.length) for (const a of HUNT.allies) { const s = hnState(a.h); hnWm(a.h); s.wmx = (s.wmx || 0) + (m.boss ? 30 : 1); const need = 12 + s.wm * 2; if (s.wmx >= need && s.wm < (WM_MAX || 100)) { s.wmx -= need; s.wm++; a.S = hnStats(a.h); floatText(a.x, a.y - 48, L2('Maestría ', 'Mastery ') + s.wm, '#ffd040'); } } } catch (e) { } return r; }; }

// ---------- IA de los cazadores: eligen objetivo, se reparten, esquivan zonas rojas, usan técnica, curan y beben pociones ----------
function hnTech(a, tgt) { const t = (WBASE[a.h.cls] || WBASE.guerrero)[2], T = WM_TECH[t] || WM_TECH.sword, R = Math.min(70, T[3] * 0.55), d = huntAtk(a) * T[2] * 0.75, W = HN_PW[a.h.pw];
  setAnim(a, 'atk'); a.loopAnim = false; floatText(a.x, a.y - 46, T[0], '#ffe08a'); addFx({ type: 'ring', x: tgt.x, y: tgt.y - 6, r: R, dur: 0.4, col: W[1] }); addFx({ type: 'slash', x: a.x, y: a.y - 8, ang: Math.atan2(tgt.y - a.y, tgt.x - a.x), arc: 3, r: 30, dur: 0.25, col: '#ffffff' });
  for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === a.map && dist2(m.x, m.y, tgt.x, tgt.y) < R * R) hitMob(m, d, { kb: 18 }); }
function hnHealTeam(a) { const P = G.P, list = HUNT.allies.filter(q => !q.down && !q.remove); let low = null, lr = 0.55; for (const q of list) if (q.hp / q.maxhp < lr) { lr = q.hp / q.maxhp; low = q; } const pl = P.S && !P.spect && !P.dead ? P.hp / P.S.maxhp : 1; if (pl < lr) low = 'P'; if (!low) return false;
  if (low === 'P') { P.hp = Math.min(P.S.maxhp, P.hp + P.S.maxhp * 0.18); floatText(P.x, P.y - 40, '+' + L2('cura', 'heal'), '#8aff8a'); addFx({ type: 'ring', x: P.x, y: P.y - 6, r: 18, dur: 0.4, col: '#8aff8a' }); }
  else { low.hp = Math.min(low.maxhp, low.hp + low.maxhp * 0.22); floatText(low.x, low.y - 40, '+' + L2('cura', 'heal'), '#8aff8a'); addFx({ type: 'ring', x: low.x, y: low.y - 6, r: 18, dur: 0.4, col: '#8aff8a' }); }
  setAnim(a, 'cast'); return true; }
{ const _hu = huntUpdate; huntUpdate = function (a, dt) {
    const P = G.P; if (!a || a.map !== P.map || a.down) return _hu.apply(this, arguments); hnInit(a);
    a.cd -= dt; a.pcd -= dt; a.tcd -= dt; a.hcd -= dt;
    // poción
    if (a.hp < a.maxhp * 0.35 && a.pots > 0 && G.t > (a.potT || 0)) { a.pots--; a.potT = G.t + 8; a.hp = Math.min(a.maxhp, a.hp + a.maxhp * 0.4); floatText(a.x, a.y - 40, L2('¡Poción!', 'Potion!'), '#ff8aa8'); }
    // curanderos
    if ((a.h.cls === 'bardo' || a.h.pw === 'agua') && a.hcd <= 0 && hnHealTeam(a)) a.hcd = 6;
    const lead = a.spect ? HUNT.allies[0] : P, i = HUNT.allies.indexOf(a), C = CLASSES[a.h.cls] || CLASSES.guerrero, ranged = C.range > 60;
    // elegir objetivo: cerca del grupo, prioriza jefes, heridos y los que atacan a alguien; cada uno coge uno distinto
    let tgt = null, bs = 1e12; for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== a.map) continue; const dl = dist2(m.x, m.y, lead.x, lead.y); if (dl > 240 * 240 && m !== a.tgt) continue;
      let s = Math.sqrt(dist2(m.x, m.y, a.x, a.y)) - (m.boss ? 60 : 0) - (1 - m.hp / m.maxhp) * 50 - (m.htg || m.state === 'chase' ? 25 : 0); for (const q of HUNT.allies) if (q !== a && q.tgt === m && !m.boss) s += 70; if (m === a.tgt) s -= 30; if (s < bs) { bs = s; tgt = m; } }
    a.tgt = tgt; if (!tgt) return _hu.apply(this, arguments);   // sin enemigos: seguir o explorar
    // esquivar zonas rojas (ataques del jefe)
    let ex = 0, ey = 0; for (const f of G.fx) if (f.type === 'tele' && f.ground !== false && typeof teleHas === 'function' && teleHas(f, a.x, a.y, 8)) { const dx = a.x - (f.x || tgt.x), dy = a.y - (f.y || tgt.y), L = Math.hypot(dx, dy) || 1; ex += dx / L; ey += dy / L; }
    const low = a.hp < a.maxhp * 0.28 && a.pots === 0;
    const base = Math.atan2(lead.y - tgt.y, lead.x - tgt.x) + (i - (HUNT.allies.length - 1) / 2) * 0.9, rr = ranged || low ? 92 : 20;
    let tx = tgt.x + Math.cos(base) * rr, ty = tgt.y + Math.sin(base) * rr * 0.75; if (ex || ey) { tx = a.x + ex * 40; ty = a.y + ey * 40; }
    const dx = tx - a.x, dy = ty - a.y, L = Math.hypot(dx, dy); if (L > 320) { a.x = lead.x; a.y = lead.y + 10; } else if (L > 2) { const sp = Math.min(L * 6, 95 * (ex || ey ? 1.4 : 1)); if (!moveEnt(G.map, a, dx / L * sp * dt, dy / L * sp * dt)) { a.stk = (a.stk || 0) + dt; if (a.stk > 1) { a.x += dx / L * 12; a.y += dy / L * 12; a.stk = 0; } } }
    a.dir = dirFromVec(tgt.x - a.x, tgt.y - a.y); const d = Math.hypot(tgt.x - a.x, tgt.y - a.y);
    if (a.pcd <= 0 && d < 150) { a.pcd = 6 + Math.random() * 3; huntPower(a, tgt); }
    else if (a.tcd <= 0 && d < (ranged ? 150 : 40)) { a.tcd = 6 + Math.random() * 3; hnTech(a, tgt); }
    else if (a.cd <= 0 && d < (ranged ? 165 : 34)) { a.cd = (a.S.aspd || C.aspd) * 1.15; setAnim(a, 'atk'); a.loopAnim = false; const W = HN_PW[a.h.pw];
      if (ranged) spawnProj('p', a.x, a.y - 8, Math.atan2(tgt.y - a.y, tgt.x - a.x), { spd: 260, dmg: huntAtk(a), art: W[2], life: 0.9 }); else { hitMob(tgt, huntAtk(a), { kb: 10 }); addFx({ type: 'slash', x: a.x, y: a.y - 8, ang: Math.atan2(tgt.y - a.y, tgt.x - a.x), arc: 2, r: 24, dur: 0.18, col: W[1] }); } }
    if (a.anim === 'atk' || a.anim === 'cast') { if (a.af < animN(a, a.anim) - 1) stepAnim(a, dt, 10); else setAnim(a, 'idle'); } else { setAnim(a, L > 4 ? 'walk' : 'idle', true); stepAnim(a, dt, L > 4 ? 9 : 2); }
  }; }
// en el modo espectador los compañeros siguen al líder (no a la cámara) y se reparten
{ const _hu = huntUpdate; huntUpdate = function (a, dt) { if (a && a.spect && !a.down && HUNT.allies[0] && a !== HUNT.allies[0] && !a.tgt) { const l = HUNT.allies[0], i = HUNT.allies.indexOf(a), dv = DIRV[l.dir] || [0, 1], tx = l.x - dv[0] * 24 + (i === 1 ? -16 : 16), ty = l.y - dv[1] * 20 + 6, dx = tx - a.x, dy = ty - a.y, L = Math.hypot(dx, dy);
      let busy = false; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === a.map && dist2(m.x, m.y, l.x, l.y) < 240 * 240) { busy = true; break; }
      if (!busy) { if (L > 3) { const sp = Math.min(L * 5, 90); moveEnt(G.map, a, dx / L * sp * dt, dy / L * sp * dt); a.dir = dirFromVec(dx, dy); setAnim(a, 'walk', true); stepAnim(a, dt, 9); } else { setAnim(a, 'idle', true); stepAnim(a, dt, 2); } if (L > 260) { a.x = l.x; a.y = l.y + 10; } return; } }
    return _hu.apply(this, arguments); }; }

// ---------- modo espectador: tú solo miras (sin ataques ni maestría) ----------
{ const _ba = basicAttack; basicAttack = function () { if (G.P && G.P.spect) return; return _ba.apply(this, arguments); }; }
{ const _us = useSkill; useSkill = function () { if (G.P && G.P.spect) { toast(L2('Estás mirando: no puedes atacar.', 'You are watching: you can\'t attack.'), 'info', 2); return; } return _us.apply(this, arguments); }; }
{ const _wg = wmGain; wmGain = function () { if (G.P && G.P.spect) return; return _wg.apply(this, arguments); }; }
{ const _gx = gainXp; gainXp = function () { if (G.P && G.P.spect) return; return _gx.apply(this, arguments); }; }

// ---------- mazmorras de verdad: los enemigos no vuelven a salir; el jefe tampoco ----------
{ const _cs = caveSpawns; caveSpawns = function () { const M = G.map, D = M && CAVES[M.id]; if (!D || !D.dg) return _cs.apply(this, arguments);
    for (const c of M.camps) if (c.filled) { c.alive = c.alive.filter(m => !m.remove && m.hp > 0); c.dead = []; c.n = c.alive.length; }
    const rt = CAVE_RT[M.id]; if (rt && rt.done) { rt.boss = null; rt.bossT = 1e15; }
    const r = _cs.apply(this, arguments); for (const c of M.camps) c.filled = 1; const rt2 = CAVE_RT[M.id]; if (rt2 && rt2.boss && (rt2.boss.dying || rt2.boss.hp <= 0)) rt2.done = 1; return r; }; }
function dgLeft() { const M = G.map; if (!M || !CAVES[M.id] || !CAVES[M.id].dg) return -1; let n = 0; for (const e of G.ents) if (e.type === 'mob' && e.map === M.id && !e.dying && e.hp > 0) n++; return n; }
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { const M = G.map, D = M && CAVES[M.id]; if (D && D.dg && m && m.map === M.id) { if (m.boss) { const rt = CAVE_RT[M.id]; if (rt) rt.done = 1; } const n = dgLeft(); if (n > 0 && (n <= 5 || n % 5 === 0)) toast(L2('Quedan ', 'Remaining: ') + n + L2(' enemigos en el portal', ' enemies in the portal'), 'info', 2); else if (n === 0) toast(L2('¡Portal limpio! No queda ningún enemigo.', 'Portal cleared! No enemies left.'), 'quest', 4); } } catch (e) { } return r; }; }
// al entrar se reinicia la mazmorra (nueva)
{ const _de = dgEnter; dgEnter = function (D, team) { const id = dgDef(D, team); delete CAVE_RT[id]; return _de.apply(this, arguments); }; }
{ const _ss = spectStart; spectStart = function (run) { if (run && run.D) delete CAVE_RT[dgDef(run.D, false)]; return _ss.apply(this, arguments); }; }
