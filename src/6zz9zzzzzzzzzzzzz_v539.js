// ================= v5.39: TRANSFORMACIÓN MITAD DRAGÓN (nivel 450) =================
// Sergio aprobó la muestra: Mitad Dragón (cuernos, escamas, ojos dorados, alas pequeñas y cola) y Forma de Dragón
// (a cuatro patas, alas de membrana, fuego). Todo toma el COLOR DEL PELO del personaje. Bloqueada hasta el nivel 450;
// se consigue con el ritual de Corvel (ofrenda: 8 Brasas de Ignaroth + 200.000 oro). Más fuerte que lobo, vampiro y fantasma.
// Historia: la brasa de Ignaroth (que fue un Alado antes de que el Sello lo torciera) quedó en el hilo de quien lo venció;
// el ritual la anuda a tu hilo. Código de la muestra: tools/art/muestras/muestra_dragon.js.

// paleta desde el pelo (escamas, alas, panza); cuernos de marfil y ojos dorados fijos
const DRG_HORN = ['#3a2a1a', '#8a7a5a', '#d8ccb0', '#f8f0e0'];
function drgPal(L) { const h = (L && (L.hair || L.srFur)) || HAIRS.rojo || HAIRS[Object.keys(HAIRS)[0]], c = i => typeof h[i] === 'string' ? C(h[i]) : h[i];
  const k = 'drg' + [0, 1, 2, 3].map(c).join('.'); if (drgPal.cache[k]) return drgPal.cache[k];
  const h0 = c(0), h1 = c(1), h2 = c(2), h3 = c(3), W = C('#ffffff'), D = C('#0a0406');
  const Q = { sc: [uMix(h0, D, 0.45), h0, h1, h2, h3], wing: [uMix(h0, D, 0.55), uMix(h0, D, 0.2), uMix(h1, h0, 0.4), h2], bel: [uMix(h1, C('#8a5a1a'), 0.5), uMix(h2, C('#e8c070'), 0.55), uMix(h3, C('#f8e8a0'), 0.6), uMix(h3, W, 0.75)], horn: DRG_HORN.map(x => C(x)), eye: C('#ffd040') };
  return drgPal.cache[k] = Q; }
drgPal.cache = {};
function drgOverlay(p, L, dir, anim, f) { const m = p.meta; if (!m || m.hrx === undefined) return; const Q = drgPal(L), S = Q.sc, H = Q.horn, Wn = Q.wing, B = Q.bel;
  const hx = Math.round(m.hx), top = Math.round(m.headTop), side = m.side, up = m.up, d = m.d, empty = (x, y) => !uA(p.get(x, y)), behind = (x, y, c) => { if (empty(x, y)) p.set(x, y, c); };
  // alas pequeñas (detrás)
  const sy = Math.round(m.shY), flap = anim === 'walk' ? [0, -1, -2, -1][f % 4] : 0;
  for (const s of side ? [-d] : [-1, 1]) { const x0 = side ? Math.round(m.cx) - d * 2 : (s < 0 ? Math.round(m.shL) : Math.round(m.shR)); for (let k = 0; k < 9; k++) { const x = x0 + s * k, yt = sy - 4 - Math.round(k * 0.9) + flap, yb = sy + 4 - Math.round(k * 0.35) - (k % 3 === 2 ? 1 : 0); for (let y = yt; y <= yb; y++) { const c = y === yt ? H[1] : k % 3 === 0 ? Wn[0] : y < yt + 2 ? Wn[3] : Wn[2]; if (up) p.set(x, y, c); else behind(x, y, c); } } }
  // cola gruesa con púas
  const tail = up ? [[0, 0], [0, 2], [1, 4], [2, 6], [3, 8], [4, 9]] : side ? [[-d * 2, 0], [-d * 4, 0], [-d * 6, -1], [-d * 8, -3], [-d * 9, -5], [-d * 10, -6]] : [[5, 1], [7, 1], [9, 0], [10, -2], [11, -4]];
  const tx0 = Math.round(m.cx), ty0 = Math.round(m.legTop) - 1, wag = anim === 'walk' ? (f % 2 ? 1 : -1) : 0;
  tail.forEach(([dx, dy], k) => { const x = tx0 + dx + (k > 2 ? wag : 0), y = ty0 + dy, rr = Math.max(1, 2 - Math.floor(k / 3)); for (let yy = -rr; yy <= rr; yy++) for (let xx = -rr; xx <= rr; xx++) { if (xx * xx + yy * yy > rr * rr + 1) continue; const c = yy > 0 && !up ? B[1] : yy < 0 ? S[3] : S[2]; if (up) p.set(x + xx, y + yy, c); else behind(x + xx, y + yy, c); } if (k % 2 === 1) (up ? p.set.bind(p) : behind)(x, y - rr - 1, H[2]); });
  // cuernos
  for (const s of side ? [-d] : [-1, 1]) { const bx = hx + s * Math.round(m.hrx * 0.45) - (side ? d * 2 : 0); const pts = [[0, 0], [0, -1], [s * 1, -2], [s * 1, -3], [s * 2, -4], [s * 3, -4]]; pts.forEach(([dx, dy], k) => { p.set(bx + dx - (side ? d * Math.floor(k / 2) : 0), top + 1 + dy, k < 2 ? H[1] : k < 4 ? H[2] : H[3]); if (k < 3) p.set(bx + dx + s - (side ? d * Math.floor(k / 2) : 0), top + 1 + dy, H[1]); }); }
  // escamas en las mejillas y ojos dorados de pupila fina
  if (!up) { const ey = Math.round(m.ey); const cheeks = side ? [m.eyes[0] - d * 2] : [m.eyes[0] - 2, m.eyes[1] + 3]; for (const x of cheeks) { p.set(x, ey + 2, S[2]); p.set(x + 1, ey + 3, S[3]); p.set(x, ey + 4, S[2]); }
    for (const ex of m.eyes) { p.set(ex, ey, Q.eye); p.set(ex + (side ? 0 : 1), ey, Q.eye); p.set(ex + (side ? 0 : 1), ey + 1, C('#1a0a04')); } } }
// Forma de Dragón (a cuatro patas, con alas), 80×64
function drgForm(dir, a, f, Q) { const p = new Pix(80, 64), S = Q.sc, B = Q.bel, H = Q.horn, Wn = Q.wing, eye = Q.eye, gy = 58, cx = 40, side = dir === 'left' || dir === 'right', up = dir === 'up';
  const flap = a === 'fly' ? -8 : a === 'walk' ? [0, -2, -4, -2][f % 4] : 0, bob = a === 'walk' ? [0, 1, 0, 1][f % 4] : 0, fire = a === 'atk';
  const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const wing = (x0, y0, s, sc) => { sc = sc || 1; const el = [x0 + s * 9 * sc, y0 - 13 * sc + flap], tips = [[x0 + s * 26 * sc, y0 - 18 * sc + flap * 1.3], [x0 + s * 30 * sc, y0 - 3 * sc + flap * 0.6], [x0 + s * 22 * sc, y0 + 9 * sc], [x0 + s * 8 * sc, y0 + 10 * sc]], poly = [[x0, y0], el].concat(tips);
    const xs = poly.map(q => q[0]), ys = poly.map(q => q[1]); for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++) for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs); x++) { if (!inPoly(x + 0.5, y + 0.5, poly)) continue; let cut = false; for (let i = 0; i < tips.length - 1; i++) { const mx = (tips[i][0] + tips[i + 1][0]) / 2, my = (tips[i][1] + tips[i + 1][1]) / 2, ox = mx - (el[0] - mx) * 0.12, oy = my - (el[1] - my) * 0.12; if ((x - ox) ** 2 + (y - oy) ** 2 < (5 * sc) ** 2) cut = true; } if (cut) continue; const t = Math.hypot(x - x0, y - y0) / (30 * sc); p.set(x, y, t > 0.75 ? Wn[3] : t > 0.45 ? Wn[2] : Wn[1]); }
    p.line(x0, y0, el[0], el[1], H[1]); p.line(x0, y0 + 1, el[0], el[1] + 1, Wn[0]); for (const t of tips.slice(0, 3)) { p.line(el[0], el[1], Math.round(t[0]), Math.round(t[1]), Wn[0]); } p.set(el[0], el[1] - 1, H[3]); p.set(el[0] + s, el[1] - 1, H[2]); };
  if (side) { const L_ = dir === 'left' ? 1 : -1, bx = cx + 6 * L_ * -1, by = gy - 20 - bob;
    wing(bx - 6 * L_, by - 8, L_, 0.85);
    for (let i = 0; i < 9; i++) { const t = i / 8, x = bx - L_ * (-14 - 18 * t), y = by + 2 - 8 * Math.sin(t * 2.2); p.ball(Math.round(x), Math.round(y), Math.round(6 - t * 4), Math.round(5 - t * 3), S); if (i % 2) p.set(Math.round(x), Math.round(y - 6 + t * 3), H[2]); }
    for (const [ox, ph] of [[-8, 0], [10, 1]]) { const sw = a === 'walk' ? (((f + ph) % 2) ? 3 : -3) : 0; p.rect(bx + L_ * ox * -1 + sw, by + 6, 5, gy - by - 7, S[1]); p.rect(bx + L_ * ox * -1 + sw - 1, gy - 2, 7, 3, S[0]); }
    p.ball(bx, by, 17, 10, S); p.ell(bx, by + 6, 13, 3, B[2]); for (let k = -12; k <= 12; k += 4) p.set(bx + k, by + 6, B[1]);
    for (const [ox, ph] of [[-12, 1], [8, 0]]) { const sw = a === 'walk' ? (((f + ph) % 2) ? 3 : -3) : 0; p.rect(bx - L_ * ox + sw, by + 6, 5, gy - by - 6, S[2]); p.rect(bx - L_ * ox + sw - 1, gy - 2, 7, 3, S[1]); for (let c = 0; c < 3; c++) p.set(bx - L_ * ox + sw + c * 2 - 1, gy, H[3]); }
    for (let k = -14; k <= 14; k += 5) { p.set(bx + k, by - 10, H[2]); p.set(bx + k, by - 11, H[3]); }
    wing(bx - 10 * L_, by - 10, L_);
    for (let i = 0; i < 6; i++) { const t = i / 5; p.ball(Math.round(bx - L_ * (12 + t * 9)), Math.round(by - 4 - t * 12), Math.round(6 - t * 1.5), Math.round(6 - t), S); if (i % 2 === 0) { p.set(Math.round(bx - L_ * (10 + t * 9)), Math.round(by - 10 - t * 12), H[2]); } }
    const hx = bx - L_ * 23, hy = by - 18 + (fire ? 1 : 0); p.ball(hx, hy, 6, 5, S); p.ball(hx - L_ * 6, hy + 1, 6, 3.5, S); p.ell(hx - L_ * 6, hy + 3, 5, 1.2, B[2]);
    if (fire) { p.ball(hx - L_ * 5, hy + 6, 5, 2, S); p.hl(Math.min(hx - L_ * 10, hx - L_ * 1), hy + 4, 9, C('#3a0a08')); } else p.hl(Math.min(hx - L_ * 11, hx - L_ * 2), hy + 4, 9, S[0]);
    p.set(hx - L_ * 11, hy, C('#1a0a04')); p.rect(hx - L_ * 1 - 1, hy - 2, 3, 2, eye); p.set(hx - L_ * 1, hy - 2, C('#1a0a04')); p.hl(hx - L_ * 1 - 2, hy - 3, 5, S[0]);
    for (const k of [0, 1, 2, 3, 4]) { p.set(hx + L_ * (3 + k), hy - 3 - Math.floor(k * 0.7), H[2]); p.set(hx + L_ * (3 + k), hy - 2 - Math.floor(k * 0.7), H[1]); } p.set(hx + L_ * 8, hy - 6, H[3]);
    if (fire) for (let k = 0; k < 22; k++) { const x = hx - L_ * (12 + k), y = hy + 5 + Math.round(Math.sin(k * 0.9) * (k / 6)); const r = 1 + Math.floor(k / 6); for (let yy = -r; yy <= r; yy++) p.set(x, y + yy, C(k < 4 ? '#fff4b0' : k < 12 ? '#ffb040' : '#e8402a')); } }
  else { const by = gy - 22 - bob; wing(cx - 9, by - 4, -1, 0.9); wing(cx + 9, by - 4, 1, 0.9);
    if (up) { for (let i = 0; i < 6; i++) p.ball(cx + Math.round(Math.sin(i) * 2), by + 10 + i * 3, 5 - Math.floor(i / 2), 3, S); }
    for (const ox of [-12, 8]) { p.rect(cx + ox, by + 6, 5, gy - by - 6, S[2]); p.rect(cx + ox - 1, gy - 2, 7, 3, S[1]); }
    p.ball(cx, by, 15, 11, S); if (!up) { p.ell(cx, by + 3, 8, 7, B[2]); for (let k = -4; k <= 6; k += 3) p.hl(cx - 5, by + k, 10, B[1]); }
    for (let k = -8; k <= 8; k += 4) p.set(cx + k, by - 11, H[3]);
    const hy = by - 16; p.ball(cx, hy, 8, 7, S); if (!up) { p.ball(cx, hy + 4, 6, 4, S); p.ell(cx, hy + 6, 4, 1.5, B[2]); for (const s of [-1, 1]) { p.rect(cx + s * 4 - 1, hy - 1, 3, 2, eye); p.set(cx + s * 4, hy - 1, C('#1a0a04')); p.set(cx + s * 2, hy + 5, C('#1a0a04')); } if (fire) for (let k = 0; k < 10; k++) p.ell(cx, hy + 9 + k, 2 + k / 2, 1.5, C(k < 3 ? '#fff4b0' : k < 7 ? '#ffb040' : '#e8402a')); }
    for (const s of [-1, 1]) for (const k of [0, 1, 2, 3]) { p.set(cx + s * (5 + Math.floor(k / 2)), hy - 6 - k, H[2]); p.set(cx + s * (6 + Math.floor(k / 2)), hy - 6 - k, H[3]); } }
  p.outline(OUTL); return p; }

// ---------- la transformación ----------
it('brasa_ignaroth', { n: L2('Brasa de Ignaroth', 'Ignaroth\'s Ember'), t: 'mat', stack: true, tier: 12, price: 8000, icon: ['fire', '#ff7020'], rar: 4, d: L2('El fuego que Ignaroth guardaba cuando aún era un Alado. Ofrenda para la transformación Mitad Dragón (nivel 450).', 'The fire Ignaroth kept while still a Winged One. Offering for the Half-Dragon transformation (level 450).') });
if (BOSSES.ignaroth) BOSSES.ignaroth.drops = (BOSSES.ignaroth.drops || []).concat([['brasa_ignaroth', 1, 2]]);
const DRG_LV = 450;
SR.dragon = { n: L2('Mitad Dragón', 'Half-Dragon'), f: L2('Forma de Dragón', 'Dragon Form'), ic: '🐉', col: '#ff7a2a', cost: [['brasa_ignaroth', 8]], lv: DRG_LV,
  pas: L2('Cuernos, escamas, ojos dorados, alas pequeñas y cola, del color de tu pelo. +6 % de ataque, +6 % de vida y +3 % de crítico. Transformado: dragón a cuatro patas con alas que escupe fuego, +32 % de ataque, +15 % de defensa, +15 % de vida y +12 % de velocidad. Nivel 450.', 'Horns, scales, golden eyes, small wings and a tail, in your hair colour. +6% attack, +6% HP and +3% crit. Transformed: four-legged winged dragon that breathes fire, +32% attack, +15% defense, +15% HP and +12% speed. Level 450.') };
SRSK.dragon = ['srd1', 'srd2', 'srd3', 'srd4'];
const SRD_DRG = [
  ['srd1', L2('Aliento de Brasa', 'Ember Breath'), 6, 22, ['fire', '#ff7020'], { k: 'dbreath', m: 1.1, mr: 0.1 }, L2('Escupes fuego en cono: 3 llamaradas de {m}% que queman.', 'You breathe a cone of fire: 3 blasts of {m}% that burn.')],
  ['srd2', L2('Garras de Dragón', 'Dragon Claws'), 3, 12, ['paw', '#ff9a4a'], { k: 'claw', m: 2.6, mr: 0.22 }, L2('Zarpazo con las garras: {m}% de daño al frente.', 'Claw swipe: {m}% damage ahead.')],
  ['srd3', L2('Aleteo', 'Wing Gust'), 12, 25, ['wing', '#d8502a'], { k: 'dwing', m: 1.8, mr: 0.15 }, L2('Un golpe de alas: {m}% de daño alrededor y empuja lejos a los enemigos.', 'A beat of your wings: {m}% damage around you and pushes enemies far away.')],
  ['srd4', L2('Vuelo de Dragón', 'Dragon Flight'), 18, 25, ['dash', '#ffb050'], { k: 'fly' }, L2('Vuelas 6 s: +45 % de velocidad y +40 % de esquiva.', 'You fly for 6 s: +45% speed and +40% dodge.')]];
for (const [id, n, cd, mp, icon, eff, d] of SRD_DRG) sk(id, 'sr_dragon', 0, 0, n, 'act', 1, null, { mp, cd, icon, eff, d, srk: eff.k, max: 10 });
{ const _sc = srCast; srCast = function (id) { const P = G.P, s = SK[id], e = s && s.eff; if (!e || (e.k !== 'dbreath' && e.k !== 'dwing')) return _sc.apply(this, arguments);
  const r = P.skills[id] || 1, atk = P.S.atk * ((e.m || 1) + (e.mr || 0) * (r - 1)) * (1 + (P.S.skillP || 0) / 100), tgt = nearestMob(P.x, P.y, 170), ang = tgt ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]);
  if (e.k === 'dbreath') { setAnim(P, 'cast'); P.busy = 0.5; for (let k = 0; k < 3; k++) delayAct(0.08 + k * 0.14, () => { hitArc(P.x, P.y, ang, 95, 0.9, atk, { kb: 10, burn: 3 }); for (let q = 0; q < 14; q++) { const d = 20 + Math.random() * 75, a = ang + (Math.random() - 0.5) * 0.8; part(P.x + Math.cos(a) * d, P.y - 12 + Math.sin(a) * d * 0.7, { vz: 10 + Math.random() * 20, vx: Math.cos(a) * 40, g: -30, life: 0.45, c: v8Pick(['#fff4b0', '#ffb040', '#ff6a1a', '#e8402a']), s: 3 }); } }); sfx('fire'); G.shake = 3; }
  else { setAnim(P, 'cast'); delayAct(0.12, () => { hitCircle(P.x, P.y, 90, atk, { kb: 80 }); addFx({ type: 'ring', x: P.x, y: P.y, r: 90, dur: 0.5, col: '#ffb050' }); burst(P.x, P.y - 10, 24, { sp: 120, up: 30, g: 30, life: 0.6, c: ['#ffffff', '#ffd8a0', '#d8502a'] }); G.shake = 4; sfx('boom'); }); } }; }
// ritual: bloqueado hasta el nivel 450
{ const _sr = srRitual; srRitual = function () { const r = _sr.apply(this, arguments); try { const P = G.P, b = document.querySelector('#modal [data-sr="dragon"]'); if (b) { const h = b.onclick; if (P.lv < DRG_LV) { b.disabled = true; b.textContent = '🔒 ' + L2('Nivel ', 'Level ') + DRG_LV; } b.onclick = e => { if (G.P.lv < DRG_LV) { toast(L2('La brasa de Ignaroth solo se anuda a un hilo de nivel 450.', 'Ignaroth\'s ember only binds to a level 450 thread.'), 'warn'); return; } h && h(e); }; } } catch (e) { } return r; }; }
{ const _to = transOpen; transOpen = function () { const r = _to.apply(this, arguments); try { const P = G.P; if (P.sr !== 'dragon') for (const el of document.querySelectorAll('#modal .trlock')) if (el.textContent.includes(SR.dragon.n)) { const w = el.querySelector('.trwhy'); if (w && !w.dataset.d) { w.dataset.d = 1; w.insertAdjacentHTML('afterbegin', `<b>${L2('Requiere nivel ', 'Requires level ')}${DRG_LV}${P.lv < DRG_LV ? ' (' + L2('tienes ', 'you are ') + P.lv + ')' : ' ✓'}.</b> ${L2('La Brasa de Ignaroth la suelta Ignaroth, el Dragón Carmesí. ', 'Ignaroth, the Crimson Dragon, drops Ignaroth\'s Ember. ')}`); } } } catch (e) { } return r; }; }
// fuerza (no cuenta en los duelos, como las demás)
{ const _cs = calcStats; calcStats = function (P, ...a) { const S = _cs(P, ...a); if (!P || P.sr !== 'dragon' || !S || !srOk()) return S; const F = P.srF;
  S.atk = Math.round(S.atk * (F ? 1.32 : 1.06)); S.maxhp = Math.round(S.maxhp * (F ? 1.15 : 1.06)); S.crit = Math.min(70, S.crit + 3); if (F) { S.def = Math.round(S.def * 1.15); S.spd *= 1.12; }
  if (P.hp > S.maxhp) P.hp = S.maxhp; S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); P.S = S; return S; }; }
V33_TICKS.push(() => { const P = G.P; if (P && !P.srF && P.skills && P.skills.srd1) srSet(false); });
// aspecto: mitad (siempre) y forma (transformado)
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (L && L.sr === 'dragon') try { const tg = p.tg; if (p.t) p.tg = 5; drgOverlay(p, L, dir, anim, f); p.tg = tg; } catch (e) { if (typeof errOnce === 'function') errOnce('drg', e); } return r; }; }
const DRG_A = { idle: 'idle', walk: 'walk', atk: 'atk', cast: 'atk', slam: 'atk', dash: 'fly', dance: 'walk' };
function dragonAtlas(L) { const FW = 80, FH = 64, anims = HERO_ANIMS, idx = {}, Q = drgPal(L); let col = 0; for (const a of anims) { idx[a] = col; col += (ANIMS[a] || [0, 1])[1]; }
  const lo = mkCanvas(FW * col, FH * 4), lx = lo.getContext('2d'), hd = mkCanvas(FW * 2 * col, FH * 2 * 4), hx = hd.getContext('2d');
  DIRS.forEach((dir, di) => { for (const a of anims) for (let f = 0; f < (ANIMS[a] || [0, 1])[1]; f++) { const p = drgForm(dir, DRG_A[a] || 'idle', f, Q); lx.drawImage(p.canvas(), (idx[a] + f) * FW, di * FH); } });
  hx.imageSmoothingEnabled = false; hx.drawImage(lo, 0, 0, hd.width, hd.height);
  return { img: lo, hd, hdL: { vr: 1 }, hdDone: new Uint8Array(col * 4).fill(1), hdT: 0, fw: FW, fh: FH, idx, ax: FW >> 1, ay: FH - 5 }; }
{ const _bh = buildHeroAtlas; buildHeroAtlas = function (L) { if (L && L.sr === 'dragon' && L.srF) return dragonAtlas(L); return _bh.apply(this, arguments); }; }
// Lupa › Sistemas
if (typeof GSIS !== 'undefined') GSIS.unshift(['dragon539', '🐉 ' + L2('Transformación Mitad Dragón', 'Half-Dragon transformation'), () => [
  L2('Se desbloquea al nivel 450 en el ritual de Corvel (Velo Roto): 8 Brasas de Ignaroth + 200.000 de oro. La Brasa la suelta Ignaroth, el Dragón Carmesí. Solo puedes tener una transformación (la Poción de Sangre Limpia la quita).', 'Unlocks at level 450 in Corvel\'s ritual (Broken Veil): 8 Ignaroth\'s Embers + 200,000 gold. Ignaroth, the Crimson Dragon, drops the Ember. You can only have one transformation (the Clean Blood Potion removes it).'),
  L2('Mitad Dragón (siempre): cuernos, escamas en las mejillas, ojos dorados, alas pequeñas y cola, del color de tu pelo. +6 % de ataque, +6 % de vida, +3 % de crítico.', 'Half-Dragon (always): horns, cheek scales, golden eyes, small wings and a tail, in your hair colour. +6% attack, +6% HP, +3% crit.'),
  L2('Forma de Dragón (toca 🐉 arriba o en 🌀): dragón a cuatro patas con alas, del color de tu pelo. +32 % de ataque, +15 % de defensa, +15 % de vida y +12 % de velocidad. Habilidades: Aliento de Brasa, Garras de Dragón, Aleteo y Vuelo de Dragón (suben de rango venciendo enemigos transformado).', 'Dragon Form (tap 🐉 at the top or in 🌀): four-legged winged dragon in your hair colour. +32% attack, +15% defense, +15% HP and +12% speed. Skills: Ember Breath, Dragon Claws, Wing Gust and Dragon Flight (they rank up by defeating enemies while transformed).'),
  L2('La historia: Ignaroth fue un Alado antes de que el Sello lo torciera. Su brasa quedó en el hilo de quien lo venció, y el ritual la anuda al tuyo.', 'The story: Ignaroth was a Winged One before the Seal twisted him. His ember stayed in the thread of whoever defeated him, and the ritual binds it to yours.')], () => null]);
