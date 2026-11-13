// ================= NUEVA CLASE: PEZ (sin armas) · evoluciona a nv70 y se vuelve sirena/tritón a nv100 =================
CLASSES.pez = { n: 'Pez', desc: 'Pueblo del mar. Lucha sin armas: mordiscos, garras y agarres. Evoluciona a nivel 70 y a nivel 100 se convierte en sirena o tritón.', base: { str: 9, int: 3, dex: 8, vit: 9 }, grow: { str: 2.0, int: 0.4, dex: 1.0, vit: 1.5 }, hp: 135, mp: 50, main: 'str', weapon: 'fins', range: 30, aspd: 0.40, color: '#3ac8e0' };
BR.pez = ['Fauces', 'Marea', 'Abismo'];
// ---------- pieles, peinados y ropa propios ----------
const PEZ_SKINS = [SKINS.length, SKINS.length + 1, SKINS.length + 2];
SKINS.push(pal(['#3a7a9a', '#6ab0d0', '#9ad8ee', '#d0f4ff']), pal(['#2a6a6a', '#4aa0a0', '#7ad0c8', '#b8f0e8']), pal(['#1a3a6a', '#3a6aa8', '#6a9ad8', '#a8d0ff']));
const PEZ_TAIL = [P5(['#06303a', '#0a5a66', '#12868e', '#2ab8b0', '#7ae8d8']), P5(['#0a3a2a', '#14604a', '#20906a', '#40c08a', '#9af0c0']), P5(['#0a1446', '#162a7a', '#2a4ab8', '#4a7ae8', '#9ac0ff'])];
const PEZ_FIN = [pal(['#0a5a6a', '#2a9ab0', '#6ad8e8', '#c0f8ff']), pal(['#0a5a4a', '#2a9a7a', '#6ad8b0', '#c0ffe8']), pal(['#1a2a7a', '#3a5ac0', '#7a9af0', '#d0e0ff'])];
const STARF = pal(['#7a2a0a', '#c8501a', '#f08a3a', '#ffc080']);
const HS_PEZ_F0 = HS_F.length, HS_PEZ_M0 = HS_M.length;
HS_F.push({ n: 'Ola marina', cap: 'round', bang: 'side', side: 13, back: 22, bw: 1.25, wave: 1, pz: 1, orn: 'star' }, { n: 'Algas', cap: 'volume', bang: 'messy', side: 12, back: 20, bw: 1.2, jag: 1, layer: 1, pz: 1, orn: 'shell' }, { n: 'Corona de coral', cap: 'round', bang: 'full', side: 6, back: 8, pz: 1, orn: 'coral' }, { n: 'Perlas', cap: 'round', bang: 'split', side: 4, back: 0, tail: 'buns', pz: 1, orn: 'pearl' });
HS_M.push({ n: 'Aleta', cap: 'mohawk', bang: 'none', side: 0, back: 3, pz: 1, orn: 'fin' }, { n: 'Marea', cap: 'swept', bang: 'none', side: 3, back: 9, wave: 1, pz: 1, orn: 'shell' }, { n: 'Coral', cap: 'spiky', bang: 'messy', side: 3, back: 5, jag: 1, pz: 1, orn: 'coral' }, { n: 'Rastas de alga', cap: 'volume', bang: 'messy', side: 6, back: 12, bw: 1.15, jag: 1, pz: 1, orn: 'star' });
const TOP_PEZ0 = TOPS.length, BOT_PEZ0 = BOTS.length;
TOPS.push(['scaletop', 'Top de escamas'], ['shelltop', 'Chaleco de conchas']); BOTS.push(['scaleskirt', 'Faldón de escamas']);
const isPezStyle = (g, i) => i >= (g === 'm' ? HS_PEZ_M0 : HS_PEZ_F0);
// la etapa (0, 1 = nv70, 2 = nv100) y la ascensión viajan en la apariencia, así el resto de jugadores también las ve
{ const _n = normApp; normApp = function (a) { const o = _n(a); if (a && a.pz) o.pz = clamp(a.pz | 0, 0, 2); if (a && a.asc) o.asc = 1; return o; }; }
function pezStage(lv) { return lv >= 100 ? 2 : lv >= 70 ? 1 : 0; }
// ---------- equipo visible del pez ----------
{ const _gv = gearVis; gearVis = function (cls, slot, t) {
  if (cls !== 'pez') return _gv(cls, slot, t);
  const m = t >= 6 ? TIERP[t].map((c, i) => uMix(c, C('#2ab8c8'), i < 2 ? 0.2 : 0.35)) : CLOTH.turquesa, s = t >= 3 ? TIERP[t] : CLOTH.azul;
  if (slot === 'body') return { k: 'scaletop', m, s, t };
  if (slot === 'legs') return { k: 'scaleskirt', m: uMulP(m, 0.85), s };
  if (slot === 'feet') return { k: 'sandals', m: t >= 6 ? TIERP[t] : CLOTH.azul };
  if (slot === 'head') return { k: 'circlet', m, s: t >= 6 ? TIERP[t] : GOLD.slice(1), t, cover: 'hat' };
  return null; }; }
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, opts) {
  const L = _hl(cls, app, gear, cos, opts), a = normApp(app);
  if (cls === 'pez') {
    const si = PEZ_SKINS.includes(a.skin) ? PEZ_SKINS.indexOf(a.skin) : 0; L.skin = SKINS[PEZ_SKINS[si]]; L.weapon = null;
    L.pez = { st: a.pz || 0, tail: PEZ_TAIL[si], fin: PEZ_FIN[si] };
    if (L.pez.st === 2) { L.bot = { k: 'pants', m: PEZ_TAIL[si], s: PEZ_TAIL[si] }; L.feet = { k: 'shoes', m: PEZ_TAIL[si] }; }
  }
  if (a.asc) { L.asc = cls; if (cls === 'guerrero' && L.weapon) L.weapon = Object.assign({}, L.weapon, { dual: 1 }); }
  return L; }; }
{ const _hp = heroPose; heroPose = function (dir, anim, f, L) { const ps = _hp(dir, anim, f, L); if (L && L.pez && anim === 'atk') { ps.lean = f === 1 ? 2 : f === 2 ? 1 : 0; ps.crouch = (ps.crouch || 0) + (f === 1 ? 1 : 0); ps.noWeapon = 1; } return ps; }; }
// ---------- dibujo: escamas, aletas, cola de sirena, estrellas de mar, adornos ----------
function pezDecor(p, L, dir, anim, f) {
  const B = BODYP.normal, ps = heroPose(dir, anim, f, L), fem = L.g === 'f';
  const side = dir === 'left' || dir === 'right', up = dir === 'up', d = dir === 'left' ? -1 : 1;
  const cx = p.w >> 1, base = p.h - 4 - (ps.jump || 0), legTop = base - B.lh + ps.crouch, torsoTop = legTop - B.th + ps.bob, hy = Math.round(torsoTop - B.hry + 1 - (B === BODYP.normal ? FACE.lift : 0));
  const hx = cx + (side ? -1 : 0) + (side ? d * (ps.lean || 0) : 0), SK = L.skin, Z = L.pez, FN = Z.fin, empty = (x, y) => !p.get(x, y);
  // escamas en la piel y en la ropa de escamas
  for (let y = hy + 4; y < p.h; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!c) continue;
    if (c === SK[2] && (x * 3 + y * 5) % 7 === 0) p.set(x, y, SK[1]); else if (c === SK[3] && (x + y * 2) % 6 === 0) p.set(x, y, SK[2]);
    for (const Q of [L.top && L.top.k === 'scaletop' ? L.top.m : null, L.bot && (L.bot.k === 'scaleskirt' || Z.st === 2) ? L.bot.m : null]) if (Q && c === Q[2] && ((x + (y % 2) * 2) % 4 === 0)) p.set(x, y, Q[1]); }
  // chaleco de conchas: conchas claras sobre el torso
  if (L.top && L.top.k === 'shelltop' && !up) for (const [sx, sy] of side ? [[cx + d, torsoTop + 2]] : [[cx - 2, torsoTop + 2], [cx + 2, torsoTop + 2]]) { p.set(sx - 1, sy, C('#f0d8d0')); p.set(sx, sy - 1, C('#fff0ea')); p.set(sx + 1, sy, C('#f0d8d0')); p.set(sx, sy, C('#e0b0a8')); p.set(sx, sy + 1, C('#c89088')); }
  // nivel 100: cola de sirena / tritón
  if (Z.st === 2) { const tw = side ? 8 : (fem ? 9 : 10), T = Z.tail, sway = anim === 'walk' ? (f % 2 ? 1 : -1) : 0, H = base - legTop, isT = c => !c || T.includes(c) || (L.feet && L.feet.m && L.feet.m.includes(c));
    // cola: se estrecha hacia abajo y se mece al andar
    for (let y = legTop; y <= base; y++) { const t = (y - legTop) / H, sh = Math.round(sway * t); let x0, x1;
      if (side) { const w = Math.round(lerp(5, 3, t)); x0 = cx - 3 + sh + (d < 0 ? 0 : 0); x1 = x0 + w - 1; }
      else { const half = Math.max(1, Math.round(lerp(tw / 2, 1.5, t))); x0 = cx - half + sh; x1 = cx + half - 1 + sh; }
      for (let x = cx - 9; x <= cx + 9; x++) { const c = p.get(x, y); if (!isT(c)) continue; if (x >= x0 && x <= x1) p.set(x, y, T[x === x0 ? 3 : x === x1 ? 1 : (x + y * 2) % 4 === 0 ? 1 : 2]); else if (c) p.set(x, y, 0); } }
    // aleta caudal
    const by = base - 1, bx = cx + sway;
    if (side) { for (let r = -3; r <= 3; r++) { const len = 6 - Math.abs(r) + (r === 0 ? -2 : 0); for (let i = 0; i < len; i++) { const x = bx + (-d) * (1 + i), y = by + r; if (isT(p.get(x, y))) p.set(x, y, FN[i === len - 1 ? 3 : Math.abs(r) === 3 ? 3 : 2]); } } }
    else { for (let r = 0; r < 4; r++) { const y = by + r, spread = 2 + r * 2; for (let x = bx - spread; x <= bx + spread - 1; x++) { if (r >= 2 && Math.abs(x - bx + 0.5) < r - 0.5) continue; if (isT(p.get(x, y))) p.set(x, y, FN[x === bx - spread || x === bx + spread - 1 ? 3 : (x + r) % 3 === 0 ? 1 : 2]); } } }
  }
  // nivel 70+: aletas en las orejas y aleta dorsal
  if (Z.st >= 1) {
    for (const s of side ? [-d] : [-1, 1]) for (let k = 0; k < 5; k++) { const x = hx + s * (Math.round(B.hrx) + k), y0 = hy - 3 + Math.round(k * 0.5), y1 = hy + 2 - Math.round(k * 0.6); for (let y = y0; y <= y1; y++) p.set(x, y, FN[y === y0 ? 3 : k % 2 ? 1 : 2]); }
    if (side) { for (let r = 0; r < 6; r++) for (let i = 0; i <= Math.min(r, 6 - r); i++) { const x = cx + (-d) * (3 + i), y = torsoTop - 1 + r; if (empty(x, y)) p.set(x, y, FN[i === Math.min(r, 6 - r) ? 3 : 2]); } }
  }
  // sirenas: estrellas de mar sobre el pecho
  if (Z.st === 2 && fem && !up) { const star = (sx, sy) => { p.set(sx, sy, STARF[2]); for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]) p.set(sx + dx, sy + dy, STARF[dx === 0 ? 3 : 1]); p.set(sx, sy - 2, STARF[1]); };
    if (side) star(cx + d, torsoTop + 2); else { star(cx - 2, torsoTop + 2); star(cx + 2, torsoTop + 2); } }
  // adornos de los peinados del mar
  const HS = L.hs || {}, hat = L.head && (L.head.cover === 'full' || L.head.cover === 'hood');
  if (HS.orn && !hat) { const top = hy - Math.round(B.hry) - 1;
    if (HS.orn === 'star') { const sx = hx + (side ? -d * 2 : 3), sy = top + 2; p.set(sx, sy, STARF[2]); p.set(sx - 1, sy, STARF[3]); p.set(sx + 1, sy, STARF[3]); p.set(sx, sy - 1, STARF[3]); p.set(sx - 1, sy + 1, STARF[1]); p.set(sx + 1, sy + 1, STARF[1]); }
    if (HS.orn === 'shell') { const sx = hx + (side ? -d * 3 : -4), sy = top + 3; p.set(sx, sy, C('#fff0ea')); p.set(sx + 1, sy, C('#f0c8c0')); p.set(sx - 1, sy, C('#f0c8c0')); p.set(sx, sy + 1, C('#d8a098')); }
    if (HS.orn === 'coral') for (const [dx, h] of [[-2, 3], [0, 4], [2, 3]]) { for (let k = 0; k < h; k++) p.set(hx + dx, top + 1 - k, C(k === h - 1 ? '#ff8a8a' : '#d83a4a')); p.set(hx + dx + (dx < 0 ? -1 : 1), top - 1, C('#ff6a6a')); }
    if (HS.orn === 'fin') for (let i = -3; i <= 3; i++) { const h = 4 - Math.abs(i); for (let k = 0; k < h; k++) p.set(hx + i, top + 1 - k, FN[k === h - 1 ? 3 : 2]); }
    if (HS.orn === 'pearl') for (const dx of [-5, 5]) if (!side || Math.sign(dx) === -d) { p.set(hx + dx, top + 3, C('#ffffff')); p.set(hx + dx, top + 4, C('#d8e0f0')); }
  }
}
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { _dh(p, L, dir, anim, f); if (L.pez) pezDecor(p, L, dir, anim, f); }; }
// ---------- el editor solo enseña pieles, peinados y ropa de pez a la clase pez ----------
function editorCls() { const cr = $('#create'); return cr && !cr.hidden ? CC.cls : (EDIT_CLS || (G.P && G.P.cls) || 'guerrero'); }
let EDIT_CLS = null;
const SKIN_ORDER0 = SKIN_ORDER.slice();
{ const _ae = appEditorHTML; appEditorHTML = function (app, tabs) {
  const pez = editorCls() === 'pez';
  SKIN_ORDER.length = 0; (pez ? PEZ_SKINS : SKIN_ORDER0).forEach(v => SKIN_ORDER.push(v));
  let h = _ae(app, tabs); SKIN_ORDER.length = 0; SKIN_ORDER0.forEach(v => SKIN_ORDER.push(v));
  if (!pez) { const nF = app.g === 'm' ? HS_PEZ_M0 : HS_PEZ_F0; h = h.replace(/(\d+)\/(\d+)( · (?:masculinos|femeninos|male|female))/, (m, a, b, c) => a + '/' + nF + c); h = h.replace(/<button class="chip[^"]*" data-ek="hs" data-ev="(\d+)">[^<]*<\/button>/g, (m, i) => isPezStyle(app.g, +i) ? '' : m); h = h.replace(/<button class="chip[^"]*" data-ek="(top0|bot0)" data-ev="(\d+)">[^<]*<\/button>/g, (m, k, i) => +i >= (k === 'top0' ? TOP_PEZ0 : BOT_PEZ0) ? '' : m); }
  return h; }; }
{ const _oc = openCreate; openCreate = function () {
  const pez = CC.cls === 'pez', a = CC.app;
  if (pez && !PEZ_SKINS.includes(a.skin)) { a.skin = PEZ_SKINS[0]; a.hs = a.g === 'm' ? HS_PEZ_M0 : HS_PEZ_F0; a.top = [TOP_PEZ0, 'turquesa']; a.bot = [BOT_PEZ0, 'azul']; a.shoe = [2, 'azul']; a.eyes = 'dorado'; a.hair = a.g === 'm' ? 'azul' : 'rosa'; }
  if (!pez && PEZ_SKINS.includes(a.skin)) { a.skin = 0; if (isPezStyle(a.g, a.hs)) a.hs = 0; if (a.top[0] >= TOP_PEZ0) a.top[0] = 0; if (a.bot[0] >= BOT_PEZ0) a.bot[0] = 0; }
  return _oc.apply(this, arguments); }; }
// ---------- etapa según el nivel (y ascensión) guardada en la apariencia ----------
function pezSyncStage(P) { if (!P || P.cls !== 'pez') return false; P.app = P.app || {}; const st = pezStage(P.lv); if ((P.app.pz || 0) === st) return false; P.app.pz = st; return true; }
{ const _gx = gainXp; gainXp = function (n) { const P = G.P, lv0 = P ? P.lv : 0; const r = _gx.apply(this, arguments); if (P && P.cls === 'pez' && P.lv !== lv0 && pezSyncStage(P)) { refreshLook(); const st = P.app.pz; setTimeout(() => { banner(st === 2 ? (P.app.g === 'm' ? '¡Te has convertido en tritón!' : '¡Te has convertido en sirena!') : '¡Has evolucionado!', st === 2 ? 'Ahora tienes cola de pez' : 'Aletas y escamas más fuertes · +poder'); sfx('quest'); for (let i = 0; i < 3; i++) burst(P.x, P.y - 12, 30, { sp: 80, up: 60, g: 40, life: 1.2, c: ['#7ae8d8', '#c0f8ff', '#ffffff'] }); }, 1600); } return r; }; }
// ---------- poder: escala con el nivel y con las evoluciones ----------
{ const _cs = calcStats; calcStats = function (P) { const S = _cs(P); if (P && P.cls === 'pez') { const st = pezStage(P.lv), k = 1 + st * 0.03; S.atk = Math.round(S.atk * k); S.maxhp = Math.round(S.maxhp * (1 + st * 0.03)); if (st === 2) S.life = (S.life || 0) + 1; if (P.hp > S.maxhp) P.hp = S.maxhp; S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); } return S; }; }
// ---------- "armas" del pez: aletas de combate (no se ven, dan el ataque de su tier) ----------
WBASE.pez = ['Aletas', 'fp', 'pezfin', 0.98];
for (let t = 1; t <= 18; t++) { const T_ = TIER[t]; if (!T_) continue; const g = ITEMS[`w_guerrero_${t}`]; if (!g) continue;
  it(`w_pez_${t}`, { n: `Aletas de combate ${T_.fp}`, t: 'weapon', slot: 'weapon', cls: 'pez', lv: T_.lv, tier: t, atk: Math.round(g.atk * 0.98), crit: Math.round(t * 0.6), mpB: 0, price: g.price, icon: ['pezfin', t], rar: g.rar });
  const r = RECIPES.find(x => x.id === `r_w_guerrero_${t}`); if (r) RECIPES.push(Object.assign({}, r, { id: `r_w_pez_${t}`, out: `w_pez_${t}`, cls: 'pez' })); }
for (const cat in SHOPS) for (const tk in SHOPS[cat]) { const L_ = SHOPS[cat][tk]; if (!Array.isArray(L_)) continue; for (const id of L_.slice()) { const m = /^w_guerrero_(\d+)$/.exec(id); if (m && ITEMS['w_pez_' + m[1]] && !L_.includes('w_pez_' + m[1])) L_.push('w_pez_' + m[1]); } }
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'pezfin') return _gi(spec); const p = new Pix(16, 16), t = spec[1] | 0, tp = tierPal(t || 1), c = [C('#0a3a4a'), C('#1a7a8a'), C('#3ab8c8'), C('#9af0f8')];
  for (let i = 0; i < 9; i++) { const h = 10 - i; for (let k = 0; k < h; k++) p.set(3 + i, 13 - k - Math.round(i * 0.3), c[k === h - 1 ? 3 : (i + k) % 3 === 0 ? 1 : 2]); }
  for (let i = 0; i < 9; i += 2) p.set(3 + i, 13 - Math.round(i * 0.3), tp[3] || c[3]); p.rect(2, 12, 4, 3, tp[2] || c[1]); p.outline(OUTL); return p; }; }
// ---------- ataque básico: mordiscos y zarpazos ----------
{ const _ba = basicAttack; basicAttack = function () {
  const P = G.P; if (!P || P.cls !== 'pez') return _ba.apply(this, arguments); if (P.dead || P.busy > 0 || P.atkCd > 0 || P.job || P.fishing) return; const C_ = CLASSES.pez;
  const tgt = nearestMob(P.x, P.y, C_.range + 60); if (tgt) { P.dir = dirFromVec(tgt.x - P.x, tgt.y - P.y); P.target = tgt; }
  const ang = tgt ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]);
  setAnim(P, 'atk'); P.loopAnim = false; P.atkCd = P.S.aspd; P.busy = Math.min(0.26, P.S.aspd * 0.8); P.combatT = G.t; P.pezCombo = ((P.pezCombo || 0) + 1) % 3;
  const bite = P.pezCombo === 2, st = pezStage(P.lv);
  delayAct(0.08, () => { const n = hitArc(P.x, P.y, ang, C_.range + (st >= 1 ? 4 : 0), bite ? 1.4 : 1.9, P.S.atk * (bite ? 1.35 : 1), { kb: bite ? 30 : 12 });
    const fx = P.x + Math.cos(ang) * 18, fy = P.y + Math.sin(ang) * 12 - 6;
    if (bite) { addFx({ type: 'slash', x: fx, y: fy + 10, ang: ang - 1.2, arc: 1.6, r: 11, dur: 0.16, col: 'rgba(240,250,255,0.95)' }); addFx({ type: 'slash', x: fx, y: fy + 4, ang: ang + 1.2, arc: 1.6, r: 11, dur: 0.16, col: 'rgba(240,250,255,0.95)' }); burst(fx, fy, 6, { sp: 50, up: 20, g: 60, life: 0.35, c: ['#ffffff', '#7ae8d8'] }); if (n && st === 2) { const h = Math.round(P.S.atk * 0.05); P.hp = Math.min(P.S.maxhp, P.hp + h); } }
    else addFx({ type: 'slash', x: P.x, y: P.y, ang, arc: 2.0, r: C_.range * 0.9, dur: 0.16, col: 'rgba(90,220,240,0.9)' });
    sfx(n ? 'slash' : 'swing'); });
}; }
// ---------- habilidades (19, equivalentes a las de las otras clases) ----------
sk('z1', 'pez', 0, 0, 'Mordisco', 'act', 1, null, { mp: 8, cd: 3.5, icon: ['slash', '#9af0f8'], eff: { k: 'slash', m: 1.9, mr: 0.15, arc: 1.8, r: 32, kb: 40 }, d: 'Un mordisco feroz que hace {m}% de ataque a lo que tengas delante.' });
sk('z2', 'pez', 0, 1, 'Frenesí de Dientes', 'act', 8, 'z1', { mp: 18, cd: 9, icon: ['multi', '#9af0f8'], eff: { k: 'flurry', m: 0.62, mr: 0.05, hits: 5, r: 24 }, d: 'Muerdes 5 veces seguidas ({m}% cada mordisco).' });
sk('z3', 'pez', 0, 2, 'Colmillos Afilados', 'pas', 15, 'z1', { icon: ['up', '#ffd040'], pas: { atkP: 3 }, d: 'Aumenta el ataque en {atkP}%.' });
sk('z4', 'pez', 0, 3, 'Mandíbula de Tiburón', 'act', 45, 'z2', { mp: 40, cd: 20, icon: ['slam', '#7ae8d8'], eff: { k: 'slam', m: 4, mr: 0.4, r: 46, stun: 1.5, front: 22 }, d: 'Una dentellada brutal: {m}% de daño en área y aturde 1.5 s.' });
sk('z5', 'pez', 1, 0, 'Escamas Duras', 'pas', 3, null, { icon: ['shield', '#7ae8d8'], pas: { defP: 4 }, d: 'Tus escamas aumentan la defensa en {defP}%.' });
sk('z6', 'pez', 1, 1, 'Burbuja Protectora', 'act', 10, 'z5', { mp: 20, cd: 25, icon: ['shield', '#9ad8ff'], eff: { k: 'shield', p: 18, pr: 2.5, dur: 8 }, d: 'Una burbuja que absorbe daño igual al {p}% de tu vida máxima (8 s).' });
sk('z7', 'pez', 1, 2, 'Sangre Fría', 'pas', 18, 'z5', { icon: ['heart', '#7ad8ff'], pas: { hpP: 4 }, d: 'Aumenta la vida máxima en {hpP}%.' });
sk('z8', 'pez', 1, 3, 'Marea Curativa', 'act', 35, 'z6', { mp: 40, cd: 30, icon: ['drop', '#7ad8ff'], eff: { k: 'heal', p: 28, pr: 2, pt: 1 }, d: 'El agua te cura el {p}% de tu vida (y a tu grupo).' });
sk('z9', 'pez', 2, 0, 'Agarre', 'act', 5, null, { mp: 12, cd: 7, icon: ['dash', '#7ae8d8'], eff: { k: 'grab', m: 1.6, mr: 0.12, stun: 1.2, r: 110 }, d: 'Atrapas al enemigo más cercano, lo arrastras hacia ti ({m}%) y lo aturdes 1.2 s.' });
sk('z10', 'pez', 2, 1, 'Instinto Depredador', 'pas', 12, 'z9', { icon: ['eye', '#ffd040'], pas: { crit: 1 }, d: 'Aumenta la probabilidad de crítico en {crit}%.' });
sk('z11', 'pez', 2, 2, 'Remolino', 'act', 25, 'z9', { mp: 28, cd: 12, icon: ['spin', '#7ad8ff'], eff: { k: 'vortex', m: 0.8, mr: 0.07, r: 50, ticks: 6 }, d: 'Un remolino que atrae y golpea a los enemigos 6 veces ({m}% cada vez).' });
sk('z12', 'pez', 2, 3, 'Furia del Abismo', 'act', 60, 'z11', { mp: 60, cd: 60, icon: ['star', '#3ac8e0'], eff: { k: 'buff', dur: 15, st: { atkP: 40, aspdP: 20 }, str: { atkP: 3 } }, d: 'Durante 15 s: +{atkP}% ataque y +20% velocidad de ataque.' });
sk('z13', 'pez', 0, 4, 'Fauces del Megalodón', 'act', 100, 'z4', { mp: 90, cd: 16, icon: ['spin', '#c0f8ff'], eff: { k: 'spin', m: 1.1, mr: 0.08, r: 50, hits: 8 }, d: 'Giras mordiendo todo a tu alrededor 8 veces ({m}% cada mordisco).' });
sk('z14', 'pez', 0, 5, 'Devorador', 'act', 130, 'z13', { mp: 160, cd: 30, icon: ['slash', '#ffd040'], eff: { k: 'slash', m: 8, mr: 0.6, arc: 3.4, r: 72, kb: 120 }, d: 'Una dentellada gigante de agua: {m}% de daño en un enorme arco.' });
sk('z15', 'pez', 1, 4, 'Tsunami', 'act', 104, 'z8', { mp: 100, cd: 22, icon: ['nova', '#7ad8ff'], eff: { k: 'nova', m: 5, mr: 0.38, r: 92, stun: 1, art: 'ice' }, d: 'Una ola gigante: {m}% de daño a tu alrededor y aturde 1 s.' });
sk('z16', 'pez', 1, 5, 'Coraza Abisal', 'act', 134, 'z15', { mp: 140, cd: 50, icon: ['shield', '#fff0a0'], eff: { k: 'buff', dur: 15, st: { defP: 40, atkP: 10 }, str: { defP: 3 } }, d: 'Durante 15 s: +{defP}% defensa y +{atkP}% ataque.' });
sk('z17', 'pez', 2, 4, 'Embestida de Tiburón', 'act', 110, 'z12', { mp: 100, cd: 14, icon: ['dash', '#ffd040'], eff: { k: 'dash', dist: 140, m: 3, mr: 0.25, stun: 1 }, d: 'Te lanzas como un tiburón: {m}% de daño y aturdes 1 s.' });
sk('z18', 'pez', 2, 5, 'Kraken Interior', 'act', 140, 'z17', { mp: 180, cd: 40, icon: ['spin', '#c070ff'], eff: { k: 'vortex', m: 1.5, mr: 0.12, r: 80, ticks: 10 }, d: 'Invocas un torbellino abisal enorme: 10 golpes de {m}%.' });
sk('z19', 'pez', 0, 6, 'Leviatán Interior', 'act', 145, 'z14', { mp: 200, cd: 40, icon: ['slash', '#7ae8d8'], eff: { k: 'skyfall', m: 12, mr: 0.8, r: 70, col: '#7ae8d8', n: 1 }, d: 'Un leviatán de agua cae sobre la zona: {m}% de daño en área y aturde.' });
// "Agarre": arrastra al enemigo hacia ti
{ const _us = useSkill; useSkill = function (slot) {
  const P = G.P, id = P && P.slots[slot], s = id && SK[id];
  if (!s || !s.eff || s.eff.k !== 'grab') return _us.apply(this, arguments);
  const r = P.skills[id]; if (!r || P.dead || P.busy > 0 || P.job || P.fishing || (P.cds[id] || 0) > 0) return; if (P.mp < s.mp) { toast('Maná insuficiente', 'warn'); return; }
  const tgt = nearestMob(P.x, P.y, s.eff.r); if (!tgt) { toast('Sin objetivo cercano', 'warn'); return; }
  P.mp -= s.mp; P.cds[id] = s.cd; const v = skillVal(id, r), mult = (v.m || 100) / 100 * (1 + (P.S.skillP || 0) / 100);
  P.dir = dirFromVec(tgt.x - P.x, tgt.y - P.y); setAnim(P, 'atk'); P.busy = 0.35; P.loopAnim = false;
  addFx({ type: 'bolt', x: P.x, y: P.y - 8, x2: tgt.x, y2: tgt.y - 8, dur: 0.25, col: '#7ae8d8' });
  const a = Math.atan2(P.y - tgt.y, P.x - tgt.x), D = Math.max(0, Math.hypot(P.x - tgt.x, P.y - tgt.y) - 18);
  if (!tgt.boss) for (let k = 1; k <= 8; k++) delayAct(k * 0.02, () => { if (!tgt.dying) moveEnt(G.map, tgt, Math.cos(a) * D / 8, Math.sin(a) * D / 8); });
  delayAct(0.2, () => { hitMob(tgt, P.S.atk * mult, { stun: s.eff.stun }); tgt.stun = Math.max(tgt.stun || 0, s.eff.stun); burst(tgt.x, tgt.y - 8, 10, { sp: 60, up: 30, g: 60, life: 0.4, c: ['#7ae8d8', '#ffffff'] }); sfx('slash'); });
  uiDirty.hud = true; }; }
let _pzT = 0; V33_TICKS.push(dt => { _pzT += dt; if (_pzT < 2) return; _pzT = 0; const P = G.P; if (P && !P.ghost && pezSyncStage(P)) { refreshLook(); markDirty(); } });
