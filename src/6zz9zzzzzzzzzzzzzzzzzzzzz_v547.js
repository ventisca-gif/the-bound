// ================= v5.47: GUARDIÁN DE HIELO · PELO Y ESCAMAS ENCIMA DE LA ROPA · GREMIOS ONLINE =================
// Sergio aprobó la muestra del Guardián de Hielo (tools/art/muestras/muestra_mar_hielo.js): «igual de fuerte que el dragón».
//  · Nivel 450 (como el dragón). Nilo avisa → Hilde, Vigía del Glaciar (junto a la Gruta Congelada, Picos Helados).
//    Misiones: 8 Núcleos de Escarcha (Gólem de Escarcha) → vence al Rey del Invierno Eterno y trae 20 Hielo Eterno y
//    5 Cristales Rúnicos → ritual de la escarcha (8 Núcleos + 200.000 de oro).
//  · Estados como el dragón: Mitad (+6 %) → Forma de Hielo (+16 %) → Forma de Cristal 2.0 (+26 %, rango 5) → Forma plena (+32 %).
//  · Las formas con pelo, escamas o cristales se pintan ENCIMA de tu ropa, armadura o cosmético (lobo, dragón y hielo).
//  · Gremios online en ▦ Atajos: crear, buscar, unirse, chat, donar y subir de nivel. Necesitan internet (wifi o datos).

// ---------- dibujo del Guardián de Hielo ----------
const HIE_COL = ['#3a6a9a', '#6aa8d8', '#a8e0ff', '#e0f8ff', '#ffffff'];
function iceClothCrystals(p, L, lvl) { const m = p.meta; if (!m || m.torsoTop === undefined) return; const I = HIE_COL.map(c => C(c)), SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), HAIR = new Set(Array.from(L.hair || []).map(c => typeof c === 'string' ? C(c) : c));
  const t0 = Math.round(m.torsoTop), th = Math.round(m.th || 8), lt = Math.round(m.legTop), base = Math.round(m.base), tx0 = Math.round(m.tx0), tw = Math.round(m.tw || 10), hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
  for (let y = t0; y <= base; y++) for (let x = 0; x < p.w; x++) { const i = y * p.w + x, c = p.d[i]; if (!uA(c) || SKN.has(c) || HAIR.has(c)) continue; const tg = p.t ? p.t[i] : 0; if (tg === 8 || tg === 4 || tg === 6 || tg === 7) continue;
    let zone = tg === 3 ? 'arm' : tg === 2 ? 'torso' : tg === 1 ? 'leg' : 0; if (!p.t) zone = y >= lt ? 'leg' : (x < tx0 || x >= tx0 + tw) ? 'arm' : 'torso';
    const ry = (y - t0) / Math.max(1, th), edge = x <= tx0 + 1 || x >= tx0 + tw - 2 || ry < 0.3;
    const dens = zone === 'arm' ? [0, 0.45, 0.7, 0.8][lvl] : zone === 'torso' ? (edge ? [0, 0.35, 0.65, 0.75][lvl] : [0, 0, 0.35, 0.5][lvl]) : zone === 'leg' ? [0, 0, 0.35, 0.5][lvl] : 0;
    // placas de hielo de 4×3 (no puntos sueltos): se elige la placa entera y se pinta con luz arriba a la izquierda
    const row = Math.floor(y / 3), ox = (row % 2) * 2, cxl = Math.floor((x + ox) / 4), lx = (x + ox) % 4, ly = y % 3;
    if (!dens || (hash(cxl, row) % 100) / 100 > dens) continue;
    const col = (ly === 0 && lx < 3) ? I[4] : lx === 0 ? I[3] : (ly === 2 && lx === 3) ? I[1] : I[2]; p.d[i] = uMix(c, col, 0.72) | 0xff000000; } }
function hieloDraw(p, L, dir, anim, f, F) { const m = p.meta; if (!m || m.hrx === undefined) return; const lvl = F === 2 ? 3 : F === 3 ? 2 : F === 1 ? 1 : 0;
  const SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), I = HIE_COL.map(c => C(c)), empty = (x, y) => !uA(p.get(x, y));
  const side = m.side, up = m.up, d = m.d, hx = Math.round(m.hx), ey = Math.round(m.ey), top = Math.round(m.headTop), sy = Math.round(m.shY);
  // piel cristalina: placas de hielo (la mitad solo en las mejillas)
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!uA(c) || !SKN.has(c)) continue; if (lvl === 0 && (y <= ey + 1 || y > ey + 5)) continue;
    if ((x * 3 + y * 5) % 7 < [1, 2, 4, 5][lvl]) p.set(x, y, uMix(c, I[(x + y) % 2 ? 2 : 3], lvl >= 2 ? 0.55 : 0.5)); }
  // los cristales de la ropa, encima de lo que lleves
  if (lvl) iceClothCrystals(p, L, lvl);
  // ojos de hielo
  if (!up) for (const ex of m.eyes || []) { p.set(ex, ey, I[3]); p.set(ex + (side ? 0 : 1), ey, I[4]); if (lvl) p.blend(ex, ey + 1, I[2], 0.6); }
  // cristales en los hombros
  for (const s of side ? [-d] : [-1, 1]) { const x0 = side ? Math.round(m.cx) - d : (s < 0 ? Math.round(m.shL) : Math.round(m.shR)); const n = [1, 3, 3, 4][lvl]; for (let k = 0; k < n; k++) for (let j = 0; j < 4 - k; j++) p.set(x0 + s * k, sy - 1 - j - k, j === 3 - k ? I[4] : I[2 + (j % 2)]); }
  // 2.0 y plena: esquirlas de hielo a la espalda (por detrás del cuerpo)
  if (lvl >= 2) { const len = lvl === 3 ? 8 : 5; for (const s of side ? [-d] : [-1, 1]) { const x0 = side ? Math.round(m.cx) - d * 2 : (s < 0 ? Math.round(m.shL) - 1 : Math.round(m.shR) + 1);
      for (const [a, l] of [[0.9, len], [0.45, len - 2]]) for (let k = 0; k < l; k++) { const x = x0 + s * Math.round(k * Math.cos(a)), y = sy - Math.round(k * Math.sin(a) * 1.2); const c = k === l - 1 ? I[4] : k % 2 ? I[2] : I[3]; if (up || empty(x, y)) p.set(x, y, c); if (k < l - 2 && (up || empty(x, y + 1))) p.set(x, y + 1, I[1]); } } }
  // corona de hielo
  if (lvl >= 1) { for (let k = -3; k <= 3; k++) { const h = 3 - Math.abs(k) + (k % 2 ? 0 : 2) + (lvl >= 2 ? 1 : 0); for (let j = 0; j < h; j++) p.set(hx + k * 2, top - j, j === h - 1 ? I[4] : I[2]); } }
  // plena: escarcha que cae
  if (lvl === 3) for (let i = 0; i < 6; i++) { const x = hx - 12 + ((i * 29 + (f || 0) * 3) % 25), y = sy + ((i * 11) % 20); p.set(x, y, I[4]); p.set(x - 1, y, I[3]); p.set(x + 1, y, I[3]); p.set(x, y - 1, I[3]); p.set(x, y + 1, I[3]); } }

// ---------- pelo de lobo encima de la ropa (y orejas por encima de sombreros) ----------
function wolfGearFur(p, L, dir, anim, f) { const m = p.meta; if (!m || m.hrx === undefined || m.torsoTop === undefined) return; const F = (L.srFur || L.hair || HAIRS.blanco).map(c => typeof c === 'string' ? C(c) : c);
  const hx = Math.round(m.hx), top = Math.round(m.headTop), side = m.side, up = m.up, d = m.d;
  // orejas: se repintan al final para que ningún gorro o casco las tape
  for (const s of side ? [-d] : [-1, 1]) { const ex = hx + s * Math.round(m.hrx * 0.62), back = side && s === -d; for (let r = 0; r < 6; r++) { const w = Math.max(0, 2 - Math.floor(r / 2)); for (let i = -w; i <= w; i++) { const x = ex + i + (side ? -d * Math.floor(r / 3) : 0), y = top + 2 - r; p.set(x, y, r === 5 ? F[3] : i === 0 && r < 4 && !up && !back ? uMix(F[0], C('#d08090'), 0.5) : F[i < 0 ? 1 : 2]); } } }
  if (L.srF !== 1) return;
  // forma híbrida: melena en el cuello y los hombros y mechones en los brazos, encima de la ropa
  const SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), t0 = Math.round(m.torsoTop), th = Math.round(m.th || 8), lt = Math.round(m.legTop), tx0 = Math.round(m.tx0), tw = Math.round(m.tw || 10), hash = (x, y) => ((x * 2654435761) ^ (y * 40503)) >>> 0;
  for (let y = t0; y < lt; y++) for (let x = 0; x < p.w; x++) { const i = y * p.w + x, c = p.d[i]; if (!uA(c) || SKN.has(c)) continue; const tg = p.t ? p.t[i] : 0; if (tg === 8 || tg === 4 || tg === 6 || tg === 7) continue;
    const arm = p.t ? tg === 3 : (x < tx0 || x >= tx0 + tw), ry = (y - t0) / Math.max(1, th), ruff = !arm && ry < 0.34, dens = ruff ? 0.9 : arm ? 0.6 : 0; if (!dens) continue;
    // mechones de 1×3 en columnas alternas: punta clara arriba y raíz oscura abajo
    const band = Math.floor((y - t0 + (x % 2)) / 3), ly = (y - t0 + (x % 2)) % 3; if (x % 2 && !ruff) continue; if ((hash(x, band) % 100) / 100 > dens) continue;
    p.d[i] = uMix(c, ly === 0 ? F[3] : ly === 1 ? F[2] : F[1], 0.8) | 0xff000000; }
  // puntas de la melena que sobresalen por los hombros
  if (!up) for (let x = tx0 - 1; x <= tx0 + tw; x += 2) { const y = t0 - 1; if (!uA(p.get(x, y))) p.set(x, y, F[2]); } }

{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (!L || !L.sr) return r;
  try { const tg = p.tg; if (p.t) p.tg = 5;
    if (L.sr === 'hielo') hieloDraw(p, L, dir, anim, f, L.srF | 0);
    else if (L.sr === 'lobo' && L.srF !== 2) wolfGearFur(p, L, dir, anim, f);
    p.tg = tg; } catch (e) { if (typeof errOnce === 'function') errOnce('v547dh', e); } return r; }; }

// ---------- materiales, forma y fuerza ----------
it('nucleo_escarcha', { n: L2('Núcleo de Escarcha', 'Frost Core'), t: 'mat', stack: true, tier: 12, price: 8000, icon: ['crystal', '#a8e0ff'], rar: 4, d: L2('El frío del Gólem de Escarcha, que nunca se derrite. Ofrenda para la transformación Guardián de Hielo (nivel 450).', 'The Frost Golem\'s cold, which never melts. Offering for the Ice Guardian transformation (level 450).') });
if (BOSSES.golemhielo) BOSSES.golemhielo.drops = (BOSSES.golemhielo.drops || []).concat([['nucleo_escarcha', 1, 2]]);
const HIE_LV = 450, HIE2_RANK = 5;
const hie2Ok = () => { const P = G.P; return P && P.sr === 'hielo' && srRank() >= HIE2_RANK; };
SR.hielo = { n: L2('Guardián de Hielo', 'Ice Guardian'), f: L2('Forma de Hielo', 'Ice Form'), ic: '❄', col: '#a8e0ff', cost: [['nucleo_escarcha', 8]], lv: HIE_LV,
  pas: L2('Mejillas de cristal, ojos de hielo y cristales en los hombros. +6 % de ataque, +6 % de vida y +4 % de defensa. Forma de Hielo: placas de hielo en la piel y la ropa y corona de hielo, +16 % de ataque. Forma de Cristal 2.0 (rango 5): más placas y esquirlas en la espalda, +26 % de ataque. Forma plena: alas de esquirlas y escarcha que cae, +32 % de ataque, +15 % de defensa, +15 % de vida y +12 % de velocidad. Igual de fuerte que el dragón. Nivel 450.', 'Crystal cheeks, ice eyes and crystals on the shoulders. +6% attack, +6% HP and +4% defence. Ice Form: ice plates on skin and clothes and an ice crown, +16% attack. Crystal Form 2.0 (rank 5): more plates and shards on the back, +26% attack. Full form: shard wings and falling frost, +32% attack, +15% defence, +15% HP and +12% speed. As strong as the dragon. Level 450.'),
  forms: () => [[1, L2('Forma de Hielo', 'Ice Form')], [3, (hie2Ok() ? '' : '🔒 ') + L2('Cristal 2.0', 'Crystal 2.0') + (hie2Ok() ? '' : ' (' + L2('rango ', 'rank ') + HIE2_RANK + ')')], [2, L2('Forma plena', 'Full form')]],
  why: off => (G.P.lv < HIE_LV ? `<b>${L2('Requiere nivel ', 'Requires level ')}${HIE_LV}.</b> ` : '') + L2('Misiones de Hilde (Lupa › Subrazas) y ritual de la escarcha: ', 'Hilde\'s quests (Magnifier › Subraces) and the frost ritual: ') + off + '.' };
SRSK.hielo = ['sri1', 'sri2', 'sri3', 'sri4'];
for (const [id, n, cd, mp, icon, eff, d] of [
  ['sri1', L2('Lanzas de Hielo', 'Ice Lances'), 3, 12, ['crystal', '#a8e0ff'], { k: 'ishard', m: 0.9, mr: 0.08 }, L2('Cinco lanzas de hielo al frente: {m}% cada una y ralentizan.', 'Five ice lances ahead: {m}% each and they slow.')],
  ['sri2', L2('Ventisca', 'Blizzard'), 12, 28, ['snow', '#e0f8ff'], { k: 'iblizz', m: 1.8, mr: 0.15 }, L2('Una ventisca a tu alrededor: {m}% de daño y los enemigos van más lentos 3 s.', 'A blizzard around you: {m}% damage and enemies are slowed for 3 s.')],
  ['sri3', L2('Deslizamiento Helado', 'Ice Slide'), 8, 18, ['dash', '#a8e0ff'], { k: 'phase', m: 1.7, mr: 0.15 }, L2('Te deslizas sobre el hielo atravesando enemigos: {m}% de daño.', 'You slide on the ice through enemies: {m}% damage.')],
  ['sri4', L2('Prisión de Escarcha', 'Frost Prison'), 22, 40, ['star', '#ffffff'], { k: 'iprison', m: 2.6, mr: 0.2 }, L2('Congelas el suelo: {m}% de daño alrededor y los enemigos quedan helados 1,5 s.', 'You freeze the ground: {m}% damage around you and enemies are frozen 1.5 s.')]]) sk(id, 'sr_hielo', 0, 0, n, 'act', 1, null, { mp, cd, icon, eff, d, srk: eff.k, max: 10 });
{ const _sc = srCast; srCast = function (id) { const P = G.P, s = SK[id], e = s && s.eff; if (!e || !['ishard', 'iblizz', 'iprison'].includes(e.k)) return _sc.apply(this, arguments);
  const r = P.skills[id] || 1, atk = P.S.atk * ((e.m || 1) + (e.mr || 0) * (r - 1)) * (1 + (P.S.skillP || 0) / 100), tgt = nearestMob(P.x, P.y, 170), ang = tgt ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]);
  setAnim(P, 'cast');
  if (e.k === 'ishard') { for (let k = -2; k <= 2; k++) delayAct(0.04 * (k + 2), () => spawnProj('p', P.x, P.y - 12, ang + k * 0.16, { spd: 240, dmg: atk, art: 'ice', life: 0.9, slow: 1.5 })); sfx('ice'); }
  else if (e.k === 'iblizz') { delayAct(0.12, () => { hitCircle(P.x, P.y, 95, atk, { slow: 3 }); addFx({ type: 'ring', x: P.x, y: P.y, r: 95, dur: 0.6, col: '#e0f8ff' }); burst(P.x, P.y - 14, 34, { sp: 120, up: 40, g: 10, life: 1, c: ['#ffffff', '#e0f8ff', '#a8e0ff'] }); sfx('ice'); }); }
  else { P.busy = 0.5; addFx({ type: 'ring', x: P.x, y: P.y, r: 100, dur: 0.6, col: '#a8e0ff' }); delayAct(0.35, () => { hitCircle(P.x, P.y, 100, atk, { stun: 1.5 }); addFx({ type: 'ring', x: P.x, y: P.y, r: 100, dur: 0.4, col: '#ffffff' }); burst(P.x, P.y - 6, 40, { sp: 140, up: 30, g: 30, life: 0.9, c: ['#ffffff', '#a8e0ff', '#6aa8d8'] }); G.shake = 4; sfx('boom'); }); } }; }
// fuerza: la misma que el dragón (sobre tus estadísticas; no cuenta en duelos)
{ const _cs = calcStats; calcStats = function (P, ...a) { const S = _cs.call(this, P, ...a); if (!P || !S || P.sr !== 'hielo' || !srOk()) return S; const F = P.srF || 0;
  S.atk = Math.round(S.atk * (F === 2 ? 1.32 : F === 3 ? 1.26 : F === 1 ? 1.16 : 1.06)); S.maxhp = Math.round(S.maxhp * (F === 2 ? 1.15 : F === 3 ? 1.10 : F === 1 ? 1.08 : 1.06));
  S.def = Math.round(S.def * (F === 2 ? 1.15 : F === 3 ? 1.08 : F === 1 ? 1.05 : 1.04)); if (F === 2) S.spd *= 1.12;
  if (P.hp > S.maxhp) P.hp = S.maxhp; S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); P.S = S; return S; }; }
// el 2.0 viaja como 3 (igual que el del dragón)
{ const _lg = lkGear; lkGear = function (g) { const o = _lg.apply(this, arguments); if (o && o.sr === 'hielo' && g && g.sf === 3) o.sf = 3; return o; }; }
{ const _ss = srSet; srSet = function (on) { const P = G.P; if (on === 3 && P && P.sr === 'hielo') { if (!hie2Ok()) { toast(L2('La Forma de Cristal 2.0 se desbloquea con el Guardián de Hielo en rango ', 'Crystal Form 2.0 unlocks with the Ice Guardian at rank ') + HIE2_RANK + '.', 'warn'); return; } const r = _ss.call(this, 1); P.srF = 3; calcStats(P); refreshLook(); markDirty(); return r; } return _ss.apply(this, arguments); }; }
// ❄: normal → hielo → cristal 2.0 (si está) → plena → normal
{ const _st = srToggle; srToggle = function () { const P = G.P; if (!P || P.sr !== 'hielo') return _st.apply(this, arguments); if (P.dead || (P.srTT || 0) > G.t) return; P.srTT = G.t + 1.2;
  const F = P.srF || 0, nx = F === 0 ? 1 : F === 1 ? (hie2Ok() ? 3 : 2) : F === 3 ? 2 : 0; srSet(nx); hieFx(); }; }
function hieFx() { const P = G.P, D = SR.hielo; addFx({ type: 'ring', x: P.x, y: P.y, r: 40, dur: 0.6, col: D.col }); burst(P.x, P.y - 14, 30, { sp: 80, up: 60, g: 20, life: 0.8, c: ['#ffffff', '#e0f8ff', '#a8e0ff'] }); sfx(P.srF ? 'buff' : 'ui');
  if (P.srF) banner(P.srF === 1 ? D.f : P.srF === 3 ? L2('Forma de Cristal 2.0', 'Crystal Form 2.0') : L2('Forma plena de Hielo', 'Full Ice Form'), P.srF === 1 ? L2('+16 % de ataque', '+16% attack') : P.srF === 3 ? L2('+26 % de ataque', '+26% attack') : L2('+32 % de ataque', '+32% attack')); }
{ const _ts = transSet; transSet = function (f) { const P = G.P; if (P && P.sr === 'hielo' && f === 3 && !hie2Ok()) { toast(L2('Rango ', 'Rank ') + HIE2_RANK + L2(' para la Forma de Cristal 2.0', ' for Crystal Form 2.0'), 'warn'); return; } const r = _ts.apply(this, arguments); if (P && P.sr === 'hielo' && P.srF) hieFx(); return r; }; }

// ---------- Hilde y las misiones ----------
NPCS.hilde_glaciar = { n: 'Hilde', title: L2('Vigía del Glaciar', 'Glacier Watcher'), look: LK({ outfit: 'ranger', hairStyle: 'long', hair: HAIRS.blanco, main: P5(['#1a3a5a', '#2a5a8a', '#4a80b0', '#7ab0d8', '#b8e0f8']), sec: P5(['#5a5a6a', '#8a8a9a', '#b8b8c8', '#dcdce8', '#f4f4fc']), g: 'f' }),
  lines: [L2('Los Vigías del Alba no solo miran al mar. Yo miro al hielo: debajo de estos picos aún late el frío del Gólem.', 'The Dawn Watchers do not only watch the sea. I watch the ice: under these peaks the Golem\'s cold still beats.'), L2('El frío no es malo. Solo está solo. Si alguien lo guarda, protege en vez de congelar.', 'Cold is not evil. It is only alone. If someone keeps it, it protects instead of freezing.')], quests: [] };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); try { const [x, y] = freeTileNear(W, 217, 23); W.npcDefs.push({ id: 'hilde_glaciar', x, y, face: 'down' }); } catch (e) { console.warn(e); } }; }
q('hn_hie', { n: L2('Escarcha en el Libro', 'Frost in the Book'), giver: 'nilo_vigia', lv: HIE_LV, desc: L2('En tu página del Libro ha salido escarcha que no se derrite. Ve a ver a Hilde, Vigía del Glaciar, junto a la Gruta Congelada (Picos Helados).', 'Frost that does not melt has appeared on your page of the Book. Go and see Hilde, Glacier Watcher, by the Frozen Grotto (Frozen Peaks).'),
  obj: [{ t: 'talk', npc: 'hilde_glaciar', txt: L2('Habla con Hilde (Gruta Congelada, Picos Helados)', 'Talk to Hilde (Frozen Grotto, Frozen Peaks)') }], rew: { xp: 1, gold: 100000 },
  offer: [L2('¡Toca tu página! Está fría… y tiene escarcha que no se derrite ni junto al fuego.', 'Touch your page! It is cold… and has frost that does not melt even by the fire.'), L2('La abuela Mira dice que es del Gólem de Escarcha, el guardián que venciste. Hilde, la Vigía del Glaciar, sabrá qué hacer.', 'Grandma Mira says it is from the Frost Golem, the guardian you defeated. Hilde, the Glacier Watcher, will know what to do.')],
  prog: [L2('Hilde vigila la entrada de la Gruta Congelada, en los Picos Helados (norte).', 'Hilde watches the entrance of the Frozen Grotto, in the Frozen Peaks (north).')], done: [L2('Lo noto desde aquí: el frío del Gólem te ha elegido. No muerde… si lo cuidas.', 'I can feel it from here: the Golem\'s cold has chosen you. It does not bite… if you look after it.')] });
q('hie1', { n: L2('Un frío sin dueño', 'A cold with no owner'), giver: 'hilde_glaciar', lv: HIE_LV, pre: 'hn_hie', desc: L2('Cuando el fragmento del Sello torció al Gólem de Escarcha, su frío se quedó sin dueño. Vénce a su eco y reúne 8 Núcleos de Escarcha (no se gastan aún: son la ofrenda del ritual).', 'When the Seal fragment twisted the Frost Golem, its cold was left without an owner. Defeat its echo and gather 8 Frost Cores (not used yet: they are the ritual offering).'),
  obj: [{ t: 'item', it: 'nucleo_escarcha', n: 8, txt: L2('Reúne 8 Núcleos de Escarcha', 'Gather 8 Frost Cores') }], rew: { xp: 1, gold: 200000 },
  offer: [L2('El Gólem vuelve a levantarse en los picos cada cierto tiempo: es un eco, no él. Cada vez que cae suelta un núcleo de su frío.', 'The Golem rises again on the peaks every so often: it is an echo, not him. Each time it falls it drops a core of its cold.'), L2('Tráeme 8. Es el frío que te va a proteger.', 'Bring me 8. It is the cold that will protect you.')],
  prog: [L2('El Gólem de Escarcha suelta 1 o 2 Núcleos de Escarcha cada vez que lo vences.', 'The Frost Golem drops 1 or 2 Frost Cores each time you defeat it.')], done: [L2('Fríos y enteros. Bien.', 'Cold and whole. Good.')] });
q('hie2', { n: L2('La corona del invierno', 'The winter crown'), giver: 'hilde_glaciar', lv: HIE_LV, pre: 'hie1', desc: L2('Parte del frío del Gólem se volvió el Rey del Invierno Eterno. Vénce al Rey en la Gruta Congelada y trae 20 Hielo Eterno y 5 Cristales Rúnicos para atar el frío a tu hilo.', 'Part of the Golem\'s cold became the Eternal Winter King. Defeat the King in the Frozen Grotto and bring 20 Eternal Ice and 5 Rune Crystals to tie the cold to your thread.'),
  obj: [{ t: 'boss', b: 'rey_invierno' }, { t: 'item', it: 'hielo_eterno', n: 20, take: true, txt: L2('Trae 20 Hielo Eterno', 'Bring 20 Eternal Ice') }, { t: 'item', it: 'ore7', n: 5, take: true, txt: L2('Trae 5 Cristales Rúnicos', 'Bring 5 Rune Crystals') }], rew: { xp: 1, gold: 250000 },
  offer: [L2('El Rey del Invierno es el frío que nadie guardó: se hizo corona y muñecos de nieve. Si lo vences, ese frío vuelve a ser de alguien.', 'The Winter King is the cold nobody kept: it became a crown and snowmen. If you defeat him, that cold belongs to someone again.')],
  prog: [L2('El Rey del Invierno Eterno está al fondo de la Gruta Congelada. El Hielo Eterno lo sueltan él y los muñecos de nieve.', 'The Eternal Winter King is at the bottom of the Frozen Grotto. He and the snowmen drop Eternal Ice.')], done: [L2('Ya está atado. Cuando quieras haremos el ritual de la escarcha (habla conmigo otra vez).', 'It is tied. Whenever you like we will do the frost ritual (talk to me again).')] });
NPCS.nilo_vigia.quests.push('hn_hie'); NPCS.hilde_glaciar.quests.push('hie1', 'hie2');
if (typeof H31_HN !== 'undefined') H31_HN.push(['hn_hie', L2('Nilo te busca en Albor: hay escarcha que no se derrite en tu página del Libro.', 'Nilo is looking for you in Albor: there is frost that will not melt on your page of the Book.')]);
try { for (const [q_, k] of [['hn_hie', 0.15], ['hie1', 0.4], ['hie2', 0.45]]) QUESTS[q_].rew.xp = Math.round(xpToNext(HIE_LV) * k); } catch (e) { }
const hieReady = () => { const P = G.P; return P && P.lv >= HIE_LV && P.quests && P.quests.done.hie2; };
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'hilde_glaciar' || !hieReady() || srOwned().includes('hielo')) return; opts.unshift({ label: '❄ ' + L2('Ritual de la escarcha (Guardián de Hielo)', 'Frost ritual (Ice Guardian)'), icon: ['star', '#a8e0ff'], fn: () => { closeDialog(); srRitual(); } }); });
{ const _sr = srRitual; srRitual = function () { const r = _sr.apply(this, arguments); try { const P = G.P, b = document.querySelector('#modal [data-sr="hielo"]'); if (b && !b.disabled && !hieReady()) { b.disabled = true; b.textContent = '🔒 ' + (P.lv < HIE_LV ? L2('Nivel ', 'Level ') + HIE_LV : L2('Misión de Hilde', 'Hilde\'s quest')); } } catch (e) { } return r; }; }

// ---------- guía (Lupa › Subrazas) ----------
if (typeof SR_GUIDE !== 'undefined') SR_GUIDE.hielo = {
  how: () => [L2('1. Nivel 450: Nilo (Albor) te avisa. Misión «Escarcha en el Libro»: habla con Hilde junto a la Gruta Congelada (Picos Helados).', '1. Level 450: Nilo (Albor) tells you. Quest «Frost in the Book»: talk to Hilde by the Frozen Grotto (Frozen Peaks).'),
    L2('2. «Un frío sin dueño»: 8 Núcleos de Escarcha del Gólem de Escarcha (1-2 por victoria).', '2. «A cold with no owner»: 8 Frost Cores from the Frost Golem (1-2 per victory).'),
    L2('3. «La corona del invierno»: vence al Rey del Invierno Eterno (Gruta Congelada) y trae 20 Hielo Eterno y 5 Cristales Rúnicos.', '3. «The winter crown»: defeat the Eternal Winter King (Frozen Grotto) and bring 20 Eternal Ice and 5 Rune Crystals.'),
    L2('4. Ritual de la escarcha con Hilde: 8 Núcleos de Escarcha + 200.000 de oro.', '4. Frost ritual with Hilde: 8 Frost Cores + 200,000 gold.'),
    L2('5. Toca ❄: Mitad → Forma de Hielo (+16 %) → Forma de Cristal 2.0 (+26 %, rango 5) → Forma plena (+32 %). Igual de fuerte que el dragón.', '5. Tap ❄: Half → Ice Form (+16%) → Crystal Form 2.0 (+26%, rank 5) → Full form (+32%). As strong as the dragon.')],
  lore: () => L2('El Gólem de Escarcha fue uno de los siete guardianes: el fragmento del Sello lo torció. Al vencerlo, su frío quedó sin dueño bajo los Picos Helados; una parte se volvió el Rey del Invierno y sus muñecos de nieve, y otra se quedó dormida en tu hilo. Hilde, de los Vigías del Alba, ata ese frío a ti con el hielo que nunca se derrite: no eres un gólem, eres quien guarda el frío para que proteja en vez de congelar.', 'The Frost Golem was one of the seven guardians: the Seal fragment twisted it. When you defeated it, its cold was left without an owner under the Frozen Peaks; part of it became the Winter King and his snowmen, and part fell asleep in your thread. Hilde, of the Dawn Watchers, ties that cold to you with ice that never melts: you are not a golem, you are the one who keeps the cold so it protects instead of freezing.') };
if (typeof GSIS !== 'undefined') GSIS.unshift(['hie547', '❄ ' + L2('Transformación Guardián de Hielo', 'Ice Guardian transformation'), () => SR_GUIDE.hielo.how().concat([L2('Las formas con pelo, escamas o cristales (lobo, dragón y hielo) se ven encima de tu ropa, armadura o cosmético.', 'Forms with fur, scales or crystals (wolf, dragon and ice) show over your clothes, armour or cosmetic.')]), () => null]);

// ================= GREMIOS ONLINE (▦ Atajos › 🛡 Gremios) =================
// Se guardan en el servidor del Top (Firebase): cl/{id} gremio, cm/{id}/{jugador} miembros, cc/{id}/{msg} chat.
// Hay que pegar las reglas nuevas de docs/firebase_rules.json en la consola de Firebase.
SAVEKEYS.push('clan');
const CLAN = { list: null, mem: null, chat: null, info: null, busy: false, err: '', at: 0, tab: 'info' };
const CLAN_COST = 50000, CLAN_MAX = 30, CLAN_EMB = ['🛡', '⚔', '🐉', '🐺', '❄', '🔥', '🌙', '⭐', '👑', '🦅', '🌸', '💀', '🏹', '🌊', '⚡', '🍀'];
const clanLv = xp => Math.min(20, 1 + Math.floor(Math.sqrt((xp || 0) / 5000)));
const clanMe = () => topKey(hrsCurrent());
const clanNet = () => typeof TOP_URL === 'string' && !!TOP_URL && typeof fetch === 'function' && (typeof navigator === 'undefined' || navigator.onLine !== false);
function clanReq(path, opt) { return fetch(TOP_URL + '/' + path + '.json' + (opt && opt.q ? '?' + opt.q : ''), opt && opt.m ? { method: opt.m, body: opt.b === undefined ? undefined : JSON.stringify(opt.b) } : { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); }); }
const clanTs = { '.sv': 'timestamp' };
function clanMeRow() { const P = G.P; return { n: cleanStr(P.name, 20) || '?', lv: clamp(P.lv | 0, 1, MAXLV), c: String(P.cls || '').slice(0, 12), r: G.P.clan && G.P.clan.own ? 'jefe' : 'miembro', t: clanTs }; }
function clanFail(e) { CLAN.busy = false; CLAN.err = L2('No se pudo conectar con el servidor de gremios. Revisa tu wifi o datos.', 'Could not reach the guild server. Check your wifi or data.'); clanOpen(); }
function clanLoad() { const P = G.P; if (!clanNet()) { clanOpen(); return; } CLAN.busy = true; CLAN.err = '';
  const c = P.clan; const jobs = c ? [clanReq('cl/' + c.id), clanReq('cm/' + c.id), clanReq('cc/' + c.id, { q: 'orderBy=%22%24key%22&limitToLast=30' })] : [clanReq('cl', { q: 'orderBy=%22xp%22&limitToLast=40' })];
  Promise.all(jobs).then(r => { CLAN.busy = false; CLAN.at = Date.now();
    if (c) { if (!r[0]) { P.clan = null; toast(L2('Tu gremio ya no existe.', 'Your guild no longer exists.'), 'warn'); markDirty(true); return clanLoad(); } CLAN.info = r[0]; CLAN.mem = r[1] || {}; CLAN.chat = r[2] || {};
      if (!CLAN.mem[clanMe()]) { P.clan = null; toast(L2('Ya no estás en ese gremio.', 'You are no longer in that guild.'), 'warn'); markDirty(true); return clanLoad(); }
      c.n = CLAN.info.n; c.tg = CLAN.info.tg; c.ic = CLAN.info.ic; c.lv = clanLv(CLAN.info.xp); clanReq('cm/' + c.id + '/' + clanMe(), { m: 'PUT', b: clanMeRow() }).catch(() => { }); }
    else CLAN.list = r[0] || {};
    clanOpen(); }).catch(clanFail); }
function clanCreate() { const P = G.P, n = cleanStr($('#clN').value, 20).trim(), tg = cleanStr($('#clT').value, 4).trim().toUpperCase(), ic = CLAN.pick || CLAN_EMB[0];
  if (n.length < 3) return toast(L2('El nombre necesita al menos 3 letras.', 'The name needs at least 3 letters.'), 'warn'); if (!/^[A-Z0-9ÁÉÍÓÚÑ]{2,4}$/.test(tg)) return toast(L2('La sigla son 2-4 letras o números.', 'The tag is 2-4 letters or numbers.'), 'warn');
  if (P.gold < CLAN_COST) return toast(L2('Crear un gremio cuesta ', 'Creating a guild costs ') + fmt(CLAN_COST) + L2(' de oro.', ' gold.'), 'warn');
  const id = (tg + '_' + Date.now().toString(36)).toLowerCase(); CLAN.busy = true; clanOpen();
  clanReq('cl/' + id, { m: 'PUT', b: { n, tg, ic, o: clanMe(), xp: 0, m: 1, t: clanTs } }).then(() => { P.gold -= CLAN_COST; P.clan = { id, n, tg, ic, own: 1, lv: 1 }; return clanReq('cm/' + id + '/' + clanMe(), { m: 'PUT', b: clanMeRow() }); })
    .then(() => { CLAN.busy = false; uiDirty.hud = true; markDirty(true); sfx('quest'); banner('🛡 ' + n, L2('¡Has fundado tu gremio!', 'You founded your guild!')); clanSay(L2('¡Gremio fundado!', 'Guild founded!'), true); clanLoad(); }).catch(clanFail); }
function clanJoin(id) { const P = G.P, C_ = CLAN.list && CLAN.list[id]; if (!C_) return; if ((C_.m || 0) >= CLAN_MAX) return toast(L2('Ese gremio está lleno.', 'That guild is full.'), 'warn'); CLAN.busy = true; clanOpen();
  P.clan = { id, n: C_.n, tg: C_.tg, ic: C_.ic, own: 0, lv: clanLv(C_.xp) };
  clanReq('cm/' + id + '/' + clanMe(), { m: 'PUT', b: clanMeRow() }).then(() => clanReq('cm/' + id, { q: 'shallow=true' })).then(m => clanReq('cl/' + id + '/m', { m: 'PUT', b: Object.keys(m || {}).length || 1 }))
    .then(() => { CLAN.busy = false; markDirty(true); sfx('quest'); banner(C_.ic + ' ' + C_.n, L2('¡Te has unido al gremio!', 'You joined the guild!')); clanSay(L2('se ha unido al gremio.', 'joined the guild.'), true); clanLoad(); }).catch(e => { P.clan = null; clanFail(e); }); }
function clanLeave() { const P = G.P, c = P.clan; if (!c) return; const id = c.id, own = c.own; P.clan = null; markDirty(true); CLAN.info = CLAN.mem = CLAN.chat = null;
  clanReq('cm/' + id + '/' + clanMe(), { m: 'DELETE' }).then(() => clanReq('cm/' + id, { q: 'shallow=true' })).then(m => { const left = Object.keys(m || {});
    if (!left.length) return Promise.all([clanReq('cl/' + id, { m: 'DELETE' }), clanReq('cc/' + id, { m: 'DELETE' })]);
    const upd = { m: left.length }; if (own) upd.o = left[0]; return clanReq('cl/' + id, { m: 'PATCH', b: upd }); }).then(() => { toast(L2('Has dejado el gremio.', 'You left the guild.'), 'info'); clanLoad(); }).catch(clanFail); }
function clanSay(txt, sys) { const P = G.P, c = P.clan; if (!c || !clanNet()) return; const x = cleanStr(txt, 120).trim(); if (!x) return;
  const k = Date.now().toString(36) + Math.random().toString(36).slice(2, 5); clanReq('cc/' + c.id + '/' + k, { m: 'PUT', b: { n: cleanStr(P.name, 20) || '?', x: sys ? '· ' + x : x, t: clanTs } }).then(() => { if (CLAN.chat) CLAN.chat[k] = { n: P.name, x: sys ? '· ' + x : x, t: Date.now() }; if (CLAN.tab === 'chat' && $('#modal .clan')) clanOpen(); }).catch(() => { }); }
function clanDonate(g) { const P = G.P, c = P.clan; if (!c) return; if (P.gold < g) return toast(L2('No tienes tanto oro.', 'You do not have that much gold.'), 'warn'); CLAN.busy = true; clanOpen();
  clanReq('cl/' + c.id + '/xp').then(xp => { const nx = Math.max(0, +xp || 0) + Math.round(g / 10); return clanReq('cl/' + c.id + '/xp', { m: 'PUT', b: nx }).then(() => nx); })
    .then(nx => { P.gold -= g; P.clanDon = (P.clanDon || 0) + g; const lv0 = c.lv; c.lv = clanLv(nx); if (CLAN.info) CLAN.info.xp = nx; CLAN.busy = false; markDirty(true); sfx('coin'); toast('+' + fmt(Math.round(g / 10)) + L2(' de experiencia para el gremio', ' guild experience'), 'quest');
      clanSay(L2('donó ', 'donated ') + fmt(g) + L2(' de oro.', ' gold.'), true); if (c.lv > lv0) { banner(c.ic + ' ' + c.n, L2('¡El gremio sube a nivel ', 'The guild reaches level ') + c.lv + '!'); clanSay(L2('¡El gremio sube a nivel ', 'The guild reaches level ') + c.lv + '!', true); } calcStats(P); clanOpen(); }).catch(clanFail); }
const clanPerk = lv => L2('+' + Math.min(10, lv) + ' % de experiencia y +' + Math.min(10, lv) + ' % de oro de los monstruos', '+' + Math.min(10, lv) + '% experience and +' + Math.min(10, lv) + '% gold from monsters');
// ventajas del gremio: +1 % de experiencia y de oro por nivel (máximo 10 %)
{ const _km = killMob; killMob = function (m) { const c = G.P && G.P.clan; if (!c || !m || m.dying) return _km.apply(this, arguments); const k = 1 + Math.min(10, c.lv || 1) / 100, x0 = m.xp, g0 = m.gold; m.xp = Math.round((x0 || 0) * k); m.gold = Math.round((g0 || 0) * k); try { return _km.apply(this, arguments); } finally { m.xp = x0; m.gold = g0; } }; }
function clanOpen() { const P = G.P; if (!P) return; const c = P.clan, off = !clanNet();
  let body = '';
  if (off) body = `<p class="hint">📡 ${L2('Los gremios funcionan online: conéctate a internet (wifi o datos) para crear uno, buscar o unirte.', 'Guilds work online: connect to the internet (wifi or data) to create, search or join one.')}</p>${c ? `<p><b>${esc(c.ic)} ${esc(c.n)} [${esc(c.tg)}]</b> · ${L2('nivel ', 'level ')}${c.lv || 1}<br><small>${clanPerk(c.lv || 1)}</small></p>` : ''}<div class="row"><button class="btn gold" id="clR">${L2('Reintentar', 'Retry')}</button></div>`;
  else if (CLAN.busy) body = `<p class="hint">⏳ ${L2('Conectando…', 'Connecting…')}</p>`;
  else if (CLAN.err) body = `<p class="hint">⚠ ${esc(CLAN.err)}</p><div class="row"><button class="btn gold" id="clR">${L2('Reintentar', 'Retry')}</button></div>`;
  else if (!c) { const rows = Object.entries(CLAN.list || {}).filter(([, v]) => v && v.n).sort((a, b) => (b[1].xp || 0) - (a[1].xp || 0)), q_ = (CLAN.q || '').toLowerCase(), vis = rows.filter(([, v]) => !q_ || (v.n + ' ' + v.tg).toLowerCase().includes(q_));
    body = `<div class="row wrap"><input id="clQ" placeholder="${L2('Buscar gremio…', 'Search guild…')}" value="${esc(CLAN.q || '')}" style="flex:1;min-width:9em"><button class="btn sm" id="clS">🔎</button></div>
      <div class="clist">${vis.length ? vis.map(([id, v]) => `<div class="gsrc"><span><b>${esc(v.ic || '🛡')} ${esc(v.n)}</b> [${esc(v.tg)}]<br><small>${L2('Nivel ', 'Level ')}${clanLv(v.xp)} · ${v.m || 1}/${CLAN_MAX} ${L2('miembros', 'members')}</small></span><button class="btn sm gold" data-clj="${esc(id)}" ${(v.m || 0) >= CLAN_MAX ? 'disabled' : ''}>${L2('Unirme', 'Join')}</button></div>`).join('') : `<p class="hint">${L2('Aún no hay gremios. ¡Funda el primero!', 'No guilds yet. Found the first one!')}</p>`}</div>
      <h4>${L2('Fundar un gremio', 'Found a guild')} · ${fmt(CLAN_COST)} ${L2('de oro', 'gold')}</h4><div class="row wrap"><input id="clN" maxlength="20" placeholder="${L2('Nombre', 'Name')}" style="flex:1;min-width:8em"><input id="clT" maxlength="4" placeholder="${L2('Sigla', 'Tag')}" style="width:4.5em;text-transform:uppercase"></div>
      <div class="row wrap clemb">${CLAN_EMB.map(e => `<button class="btn sm ${(CLAN.pick || CLAN_EMB[0]) === e ? 'gold' : ''}" data-cle="${e}">${e}</button>`).join('')}</div><div class="row"><button class="btn gold" id="clC">${L2('Fundar gremio', 'Found guild')}</button></div>`; }
  else { const I_ = CLAN.info || {}, lv = clanLv(I_.xp), nx = Math.pow(lv, 2) * 5000, mem = Object.entries(CLAN.mem || {}).sort((a, b) => (b[1].lv || 0) - (a[1].lv || 0)), chat = Object.values(CLAN.chat || {}).sort((a, b) => (a.t || 0) - (b.t || 0)), T = CLAN.tab;
    body = `<p><b style="font-size:1.2em">${esc(c.ic)} ${esc(c.n)}</b> [${esc(c.tg)}] · ${L2('Nivel ', 'Level ')}${lv}${lv < 20 ? ` <small>(${fmt(I_.xp || 0)}/${fmt(nx)})</small>` : ''}<br><small>${clanPerk(lv)}</small></p>
      <div class="row wrap">${[['info', '🏠 ' + L2('Gremio', 'Guild')], ['mem', '👥 ' + L2('Miembros', 'Members') + ' (' + mem.length + ')'], ['chat', '💬 Chat']].map(([k, n]) => `<button class="btn sm ${T === k ? 'gold' : ''}" data-clt="${k}">${n}</button>`).join('')}</div>`;
    if (T === 'mem') body += `<div class="clist">${mem.map(([k, m]) => `<div class="gsrc"><span><b>${esc(m.n || '?')}</b>${I_.o === k ? ' 👑' : ''}${k === clanMe() ? ' · ' + L2('tú', 'you') : ''}<br><small>${L2('Nv. ', 'Lv. ')}${m.lv || 1} · ${esc(CLASSES[m.c] ? CLASSES[m.c].n : m.c || '')}</small></span></div>`).join('')}</div>`;
    else if (T === 'chat') body += `<div class="clist clchat">${chat.length ? chat.map(m => `<div><b>${esc(m.n || '?')}</b> ${esc(m.x || '')}</div>`).join('') : `<p class="hint">${L2('Nadie ha escrito todavía.', 'Nobody has written yet.')}</p>`}</div><div class="row"><input id="clM" maxlength="120" placeholder="${L2('Escribe al gremio…', 'Write to the guild…')}" style="flex:1"><button class="btn sm gold" id="clMs">${L2('Enviar', 'Send')}</button></div>`;
    else body += `<p class="hint">${L2('Dona oro para subir el nivel del gremio (10 de oro = 1 de experiencia). Cada nivel da +1 % de experiencia y oro a todos los miembros (máximo 10 %). Tu sigla sale junto a tu nombre en el online.', 'Donate gold to level up the guild (10 gold = 1 experience). Each level gives every member +1% experience and gold (up to 10%). Your tag shows next to your name online.')}</p>
      <div class="row wrap">${[10000, 100000, 1000000].map(g => `<button class="btn sm" data-cld="${g}">${L2('Donar ', 'Donate ')}${fmt(g)}</button>`).join('')}</div><p><small>${L2('Has donado: ', 'You donated: ')}${fmt(P.clanDon || 0)}</small></p><div class="row"><button class="btn sm" id="clL">${L2('Dejar el gremio', 'Leave the guild')}</button></div>`; }
  openModal(`<div class="frame clan"><h3>🛡 ${L2('Gremios', 'Guilds')}</h3>${body}<div class="row">${!off && !CLAN.busy ? `<button class="btn sm" id="clR2">⟳ ${L2('Actualizar', 'Refresh')}</button>` : ''}<button class="btn" id="clX">${L2('Cerrar', 'Close')}</button></div></div>`);
  const on = (s, f) => { const e = $(s); if (e) e.onclick = f; };
  on('#clX', closeModal); on('#clR', clanLoad); on('#clR2', clanLoad); on('#clC', clanCreate); on('#clL', () => { if (confirm(L2('¿Dejar el gremio?', 'Leave the guild?'))) clanLeave(); });
  on('#clS', () => { CLAN.q = $('#clQ').value; clanOpen(); }); on('#clMs', () => { const i = $('#clM'); clanSay(i.value); i.value = ''; });
  { const i = $('#clM'); if (i) { i.onkeydown = e => { if (e.key === 'Enter') { clanSay(i.value); i.value = ''; } }; const ch = document.querySelector('#modal .clchat'); if (ch) ch.scrollTop = ch.scrollHeight; } }
  $$('#modal [data-clj]').forEach(b => b.onclick = () => clanJoin(b.dataset.clj)); $$('#modal [data-cle]').forEach(b => b.onclick = () => { const n = $('#clN').value, t = $('#clT').value; CLAN.pick = b.dataset.cle; clanOpen(); $('#clN').value = n; $('#clT').value = t; });
  $$('#modal [data-clt]').forEach(b => b.onclick = () => { CLAN.tab = b.dataset.clt; clanOpen(); }); $$('#modal [data-cld]').forEach(b => b.onclick = () => clanDonate(+b.dataset.cld)); }
function clanShow() { CLAN.err = ''; if (clanNet() && (!CLAN.at || Date.now() - CLAN.at > 20000)) clanLoad(); else clanOpen(); }
// botón en ▦ Atajos
V33_TICKS.push(() => { const row = $('#tr .trbtns'); if (!row || !G.P) return; let b = $('#bClan'); if (!b) { b = document.createElement('button'); b.className = 'mini'; b.id = 'bClan'; b.title = L2('Gremios', 'Guilds'); b.setAttribute('aria-label', b.title); b.textContent = '🛡'; b.onclick = clanShow; row.appendChild(b); }
  const ic = G.P.clan ? G.P.clan.ic || '🛡' : '🛡'; if (b.textContent !== ic) b.textContent = ic; });
// tu sigla junto a tu nombre en el online
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); const c = G.P && G.P.clan; if (c && c.tg) o.ct = String(c.tg).slice(0, 4); }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); const t = typeof pr.ct === 'string' ? cleanStr(pr.ct, 4).replace(/[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/g, '') : ''; if (t && r.name && !r.name.startsWith('[')) r.name = '[' + t + '] ' + r.name; }; }
// el chat del gremio se refresca solo mientras está abierto
V33_TICKS.push(() => { if (!G.P || !G.P.clan || CLAN.busy || CLAN.tab !== 'chat' || !$('#modal .clan') || Date.now() - CLAN.at < 8000 || !clanNet()) return; CLAN.at = Date.now(); clanReq('cc/' + G.P.clan.id, { q: 'orderBy=%22%24key%22&limitToLast=30' }).then(d => { const a = JSON.stringify(d || {}), b = JSON.stringify(CLAN.chat || {}); CLAN.chat = d || {}; if (a !== b && $('#modal .clan') && document.activeElement !== $('#clM')) clanOpen(); }).catch(() => { }); });
{ const st = document.createElement('style'); st.textContent = `.clan .clist{max-height:40vh;overflow:auto;margin:.4em 0}.clan .clchat div{padding:.15em 0;border-bottom:1px solid rgba(255,255,255,.08)}.clan input{background:#1a120a;color:#f3e6c8;border:1px solid var(--gold);border-radius:.3em;padding:.35em}.clan .clemb .btn{min-width:2.4em}`; document.head.appendChild(st); }
if (typeof GSIS !== 'undefined') GSIS.unshift(['clan547', '🛡 ' + L2('Gremios online', 'Online guilds'), () => [
  L2('▦ Atajos › 🛡 Gremios. Funcionan con internet (wifi o datos): sin conexión te avisa.', '▦ Shortcuts › 🛡 Guilds. They work with internet (wifi or data): offline it tells you.'),
  L2('Funda un gremio (' + fmt(CLAN_COST) + ' de oro: nombre, sigla y emblema) o busca uno y únete (hasta ' + CLAN_MAX + ' miembros).', 'Found a guild (' + fmt(CLAN_COST) + ' gold: name, tag and emblem) or search for one and join (up to ' + CLAN_MAX + ' members).'),
  L2('Dona oro para subir su nivel: cada nivel da +1 % de experiencia y oro de monstruos a todos (máximo 10 %). Chat del gremio y lista de miembros. Tu sigla sale junto a tu nombre en el online.', 'Donate gold to raise its level: each level gives everyone +1% monster experience and gold (up to 10%). Guild chat and member list. Your tag shows next to your name online.')], () => null]);
