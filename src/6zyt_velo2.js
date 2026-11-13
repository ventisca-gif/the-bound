// ================= v4.19: VELO ROTO, SEGUNDA FASE =================
// Armaduras dark fantasy dibujadas para cada set (se ajustan a las 8 estructuras con fitKind), una mecánica propia por
// región (linterna y puentes espectrales, tienda del eclipse y decisión del campanero, símbolos e imitadores,
// altares de la catedral, la mirada de la Luna y dos finales), enemigos nuevos, Poder del Velo (250+) y la guía.

// ---------- armaduras de los tiers 22-26 ----------
const VA = {
  lobo: { fur: P5(['#1a1e24', '#3a4048', '#646c78', '#9aa4b0', '#d0d8e0']), m: P5(['#2a1410', '#4a2418', '#6a3622', '#8a4a30', '#a86a48']), s: P5(['#0a3a3a', '#146a6a', '#2aa8a0', '#5ae0d0', '#b0fff0']) },
  sepul: { m: P5(['#1a1c22', '#363a44', '#5a606c', '#8a92a0', '#c0c8d4']), s: P5(['#0a3a3a', '#146a6a', '#2aa8a0', '#5ae0d0', '#b0fff0']) },
  velo: { m: P5(['#2a0414', '#4a0a24', '#7a1438', '#a8244e', '#d84a70']), s: P5(['#1a0a2a', '#341650', '#542680', '#7a40b0', '#b07ae0']), w: P5(['#8a8090', '#b8b0c0', '#dcd4e4', '#f2eef8', '#ffffff']) },
  eclipse: { m: P5(['#0e0820', '#1e1240', '#30205e', '#4a3484', '#6a50b0']), s: P5(['#5a3a0a', '#9a7010', '#d0a020', '#f0d050', '#fff0a0']) },
  luna: { m: P5(['#1a1048', '#2a1a78', '#4030a8', '#6050d0', '#9088f0']), s: P5(['#7a3a0a', '#b86a14', '#e8a030', '#ffc860', '#fff0b0']), w: P5(['#8a8090', '#b8b0c0', '#dcd4e4', '#f2eef8', '#ffffff']) },
};
const VA_T = { 22: 'lobo', 23: 'sepul', 24: 'velo', 25: 'eclipse', 26: 'luna' };
const shoulder = (p, A, P, r) => { if (A.side) { p.ball(A.cx - 1 + A.d * -1, A.torsoTop + 1.5, r, r * 0.8, P.slice(1)); return; } for (const sx of [A.tx0 - 1, A.tx0 + A.tw]) p.ball(sx, A.torsoTop + 1.5, r, r * 0.8, P.slice(1)); };
fitKind('body', 'va_lobo', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, F = VA.lobo.fur, S = VA.lobo.s, R = tx0 + tw - 1;
  for (let x = tx0 - 2; x <= R + 2; x++) { const j = (x * 7) % 3; p.set(x, ty - 1 + (j === 0 ? 0 : 1), F[2 + (x & 1)]); p.set(x, ty + 1, F[1 + j % 2]); if (j === 2) p.set(x, ty + 2, F[1]); }   // cuello de pelo
  shoulder(p, A, F, 2.8); for (const sx of side ? [] : [tx0 - 3, R + 3]) for (let k = 0; k < 3; k++) p.set(sx + (sx < cx ? -0 : 0), ty + 3 + k, F[k % 2 ? 1 : 2]);
  p.hl(tx0, ty + th - 2, tw, VA.lobo.m[0]); if (!up && !side) { p.set(cx, ty + th - 2, F[3]); p.set(cx - 1, ty + 3, S[3]); p.set(cx, ty + 4, S[3]); p.set(cx + 1, ty + 3, S[3]); p.set(tx0 + 1, ty + 4, S[2]); p.set(R - 1, ty + 4, S[2]); } });
fitKind('body', 'va_sepul', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, M = VA.sepul.m, S = VA.sepul.s, R = tx0 + tw - 1;
  p.hl(tx0, ty, tw, M[3]); shoulder(p, A, M, 3); if (!side) for (const sx of [tx0 - 1, R + 1]) { p.set(sx, ty + 1, S[3]); p.set(sx, ty + 3, M[0]); }
  if (!up && !side) { for (let y = ty + 2; y < ty + th - 2; y++) { p.set(cx - 1, y, y === ty + 2 ? M[4] : S[y % 2 ? 2 : 3]); p.set(cx, y, y === ty + 2 ? M[4] : S[y % 2 ? 3 : 2]); } p.set(cx - 2, ty + 2, M[4]); p.set(cx + 1, ty + 2, M[4]); }   // vidriera de luz
  p.hl(tx0, ty + th - 2, tw, M[0]); if (!up && !side) p.set(cx, ty + th - 2, S[3]); for (let x = tx0; x <= R; x += 2) p.set(x, ty + th, M[x % 4 ? 1 : 2]); });
fitKind('body', 'va_velo', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, M = VA.velo.m, W = VA.velo.w, R = tx0 + tw - 1;
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty - 1, W[(x & 1) ? 3 : 4]); p.set(x, ty, W[(x & 1) ? 2 : 3]); }   // gorguera
  if (!up && !side) { for (let y = ty + 2; y < ty + th - 1; y++) { p.set(cx - 1, y, (y & 1) ? M[4] : M[0]); p.set(cx, y, (y & 1) ? M[0] : M[4]); } p.set(cx - 1, ty + 1, C('#ff3050')); p.set(cx, ty + 1, C('#ff8090')); }   // cordones y gema
  shoulder(p, A, VA.velo.s, 2.6); for (let x = tx0; x <= R; x++) if ((x + 1) % 3) p.set(x, ty + th, M[1]); });
fitKind('body', 'va_eclipse', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, M = VA.eclipse.m, G_ = VA.eclipse.s, R = tx0 + tw - 1;
  shoulder(p, A, G_, 3.3); if (!side) for (const sx of [tx0 - 4, R + 4]) { p.set(sx, ty - 1, G_[3]); p.set(sx + (sx < cx ? 1 : -1), ty, G_[2]); }
  p.hl(tx0, ty + 1, tw, G_[2]); if (!up && !side) { p.ball(cx - 0.5, ty + th * 0.5, 2.2, 2.2, [M[0], M[0], C('#120a24'), C('#120a24')]); for (const [dx, dy] of [[-3, 0], [2, 0], [-0.5, -3], [-0.5, 3]]) p.set(Math.round(cx - 0.5 + dx), Math.round(ty + th * 0.5 + dy), G_[4]); }   // sol eclipsado
  p.hl(tx0, ty + th - 2, tw, G_[1]); if (!side) { for (let y = ty + th - 1; y <= ty + th + 2; y++) p.set(cx - (up ? 1 : 0), y, M[2]); p.set(cx, ty + th + 1, G_[3]); } });
fitKind('body', 'va_luna', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, M = VA.luna.m, G_ = VA.luna.s, W = VA.luna.w, R = tx0 + tw - 1;
  for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, ty - 1, W[(x & 1) ? 3 : 4]); p.set(x, ty, W[(x & 1) ? 2 : 4]); }
  shoulder(p, A, M, 3); if (!side) for (const sx of [tx0 - 2, R + 2]) p.set(sx, ty + 4, G_[3]);   // cascabeles
  if (!up && !side) { for (let x = -2; x <= 2; x++) p.set(cx + x - (tw % 2 ? 0 : 0), ty + 3 + (Math.abs(x) === 2 ? 0 : 1), G_[3]); p.hl(cx - 1, ty + 4, 3, G_[4]); p.set(cx - 2, ty + 2, G_[2]); p.set(cx + 2, ty + 2, G_[2]); }   // sonrisa de luna
  for (let x = tx0; x <= R; x += 2) p.set(x, ty + th - 2, ((x >> 1) & 1) ? G_[2] : M[3]); });
fitKind('legs', 'va_rombos', (p, A, s) => { const cols = new Set(s.m); for (let y = A.legTop; y < A.base - 2; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; if (((x + y) % 4 === 0) || ((x - y + 40) % 4 === 0)) p.set(x, y, s.s[3]); } });
fitKind('legs', 'va_jirones', (p, A, s) => { if (A.side) return; for (let x = A.tx0 - 1; x <= A.tx0 + A.tw; x++) { const n = 2 + ((x * 5) % 4); for (let k = 0; k < n; k++) p.set(x, A.legTop + k, s.s[k === n - 1 ? 1 : 2]); } }, { float: true });
fitKind('head', 'va_sepul', (p, A, s) => { const S = VA.sepul.s, cx = A.hx, top = A.headTop; p.ball(cx, top + 3, A.hrx + 0.5, A.hry * 0.45, [C('#0a2a2a'), C('#124040'), C('#1a5a5a'), C('#2a7a7a')]);
  for (let k = 0; k < 5; k++) p.poly([[cx - 6 + k * 3, top + 1], [cx - 5 + k * 3, top - 3 - (k === 2 ? 2 : 0)], [cx - 4 + k * 3, top + 1]], S[k % 2 ? 2 : 3]); p.hl(cx - 6, top + 1, 13, S[1]); });
fitKind('head', 'va_velo', (p, A, s) => { const W = VA.velo.s, cx = A.hx, top = A.headTop; p.hl(cx - 6, top + 2, 13, C('#d8b030')); for (const x of [-4, 0, 4]) p.set(cx + x, top + 2, C('#ff3050'));
  if (!A.up) for (const sx of [-1, 1]) for (let y = top + 3; y < A.ey + 6; y++) p.set(cx + sx * (Math.round(A.hrx) + 1), y, W[(y & 1) ? 1 : 2]); else for (let y = top + 3; y < A.ey + 7; y++) for (let x = cx - 5; x <= cx + 5; x++) if (((x + y) & 1) || y > A.ey + 4) p.set(x, y, W[(y & 1) ? 1 : 2]); });
fitKind('head', 'va_eclipse', (p, A, s) => { const M = VA.eclipse.m, G_ = VA.eclipse.s, cx = A.hx, top = A.headTop; p.ball(cx, top + 4, A.hrx + 0.5, 5, [M[1], M[2], M[3], M[4]]); p.hl(cx - 6, top + 6, 13, G_[2]);
  for (const sx of [-1, 1]) { p.line(cx + sx * 6, top + 3, cx + sx * 9, top - 3, G_[3]); p.line(cx + sx * 9, top - 3, cx + sx * 7, top - 6, G_[2]); } if (!A.up) { p.ball(cx, top + 3, 1.6, 1.6, [C('#120a24'), C('#120a24'), C('#2a1a4a'), C('#2a1a4a')]); p.set(cx, top + 1, G_[4]); } });
fitKind('head', 'va_luna', (p, A, s) => { const M = VA.luna.m, G_ = VA.luna.s, cx = A.hx, top = A.headTop; p.ball(cx, top + 4, A.hrx + 0.5, 4.5, [M[1], M[2], M[3], M[4]]);
  for (const [sx, h] of [[-1, 7], [1, 7]]) { p.poly([[cx + sx * 2, top + 1], [cx + sx * 10, top - h + 4], [cx + sx * 6, top + 4]], sx < 0 ? M[2] : G_[2]); p.ball(cx + sx * 10, top - h + 4, 1.3, 1.3, G_.slice(1)); } p.hl(cx - 6, top + 6, 13, G_[3]); });
function vaVis(slot, t) { const k = VA_T[t]; if (!k) return null; const V = VA[k];
  if (slot === 'body') return { k: 'va_' + k, m: k === 'lobo' ? V.m : V.m, s: V.s, t };
  if (slot === 'legs') return k === 'luna' ? { k: 'va_rombos', m: V.m, s: V.s } : k === 'velo' ? { k: 'va_jirones', m: V.s, s: V.m } : { k: 'greaves', m: k === 'lobo' ? V.m : V.m, s: V.s };
  if (slot === 'feet') return { k: k === 'velo' || k === 'luna' ? 'boots' : 'sabatons', m: k === 'luna' ? V.s : V.m };
  if (slot === 'head') return k === 'lobo' ? { k: 'wolfhood', m: VA.lobo.fur, cover: 'hat' } : { k: 'va_' + k, m: V.m, s: V.s, cover: 'hat', t };
  return null; }
{ const _gv = gearVis; gearVis = function (cls, slot, t) { if (t >= 22 && cls !== 'pez') { const v = vaVis(slot, t); if (v) return v; } return _gv(cls, slot, t); }; }
for (const t in VA_T) { const set = VA_T[t]; for (const [s, i] of [['h', 'helm'], ['b', 'armor'], ['l', 'legs'], ['f', 'boots']]) if (ITEMS[`${s}_${t}`]) ITEMS[`${s}_${t}`].vaSet = set; }

// ---------- Poder del Velo: más fuerte con cada nivel por encima de 250 ----------
// +0,5 % de ataque y de vida por nivel desde el 251 (hasta +50 % a nivel 350). Es igual para todas las clases.
function vrPower(lv) { return Math.max(0, Math.min(100, lv - 250)) * 0.005; }
{ const _cs = calcStats; calcStats = function (P, ...a) { const r = _cs(P, ...a); if (P && P.S && P.lv > 250) { const k = vrPower(P.lv); P.S.atk = Math.round(P.S.atk * (1 + k)); P.S.maxhp = Math.round(P.S.maxhp * (1 + k)); P.S.vrPow = k; } return r; }; }
{ const _gx = gainXp; gainXp = function (n) { const P = G.P, l0 = P ? P.lv : 0; const r = _gx(n); if (P && P.lv > l0 && P.lv > 250) { addFx({ type: 'ring', x: P.x, y: P.y, r: 46, dur: 0.8, col: '#c070ff' }); addFx({ type: 'beam', x: P.x, y: P.y, dur: 0.7, col: '#9aff7a' }); burst(P.x, P.y - 12, 26, { sp: 80, up: 70, g: -10, life: 1, c: ['#c070ff', '#9aff7a', '#ffffff'] }); toast(L2('Poder del Velo: +', 'Veil Power: +') + Math.round(vrPower(P.lv) * 100) + L2(' % de ataque y vida', '% attack and health'), 'quest', 3); } return r; }; }

// ---------- enemigos nuevos: Lancero Sepulcral y Acólito del Velo ----------
VR_KIND.lancero = () => { const p = new Pix(70, 116), cx = 34, G2 = pal(['#04201a', '#0a4a3a', '#1a8a6a', '#3ad0a0', '#9affe0']), B = C('#04120c');
  for (const s of [-1, 1]) { p.rect(cx + s * 6 - 3, 70, 6, 42, G2[2]); for (let y = 74; y < 110; y += 4) p.hl(cx + s * 6 - 3, y, 6, B); }
  p.rect(cx - 7, 62, 14, 10, G2[1]); for (let y = 42; y < 62; y++) { const w = 10 - Math.round((y - 42) * 0.12); p.hl(cx - w, y, w * 2, G2[2]); if (y % 3 === 0) p.hl(cx - w + 1, y, w * 2 - 2, B); } p.vl(cx, 42, 22, G2[3]);   // costillas
  for (const s of [-1, 1]) { p.poly([[cx + s * 6, 36], [cx + s * 22, 30], [cx + s * 18, 44]], G2[2]); p.rect(cx + s * 16 - 2, 44, 5, 28, G2[2]); for (let y = 46; y < 70; y += 5) p.hl(cx + s * 16 - 2, y, 5, B); }
  p.poly([[cx - 9, 34], [cx - 12, 4], [cx - 2, 18], [cx + 2, 18], [cx + 12, 4], [cx + 9, 34]], G2[2]); for (let k = 0; k < 6; k++) p.line(cx - 8 + k * 3, 14 + k % 2 * 6, cx - 6 + k * 3, 26, B);   // máscara agrietada
  for (const s of [-1, 1]) p.ball(cx + s * 4, 22, 2.5, 2, [C('#5a0a3a'), C('#ff2a8a'), C('#ff6ab0'), C('#ffd0e8')]); p.poly([[cx - 4, 30], [cx + 4, 30], [cx + 2, 27], [cx - 2, 27]], B);
  const sx = cx - 24; for (let y = 6; y < 112; y++) { p.set(sx, y, G2[2]); p.set(sx + 1, y, G2[1]); } p.poly([[sx - 4, 18], [sx + 1, 0], [sx + 5, 18]], G2[3]); p.outline(C('#020806')); return p; };
VR_KIND.acolito = () => { const p = new Pix(56, 112), cx = 28, Bl = pal(['#08104a', '#141e7a', '#2234b0', '#3a52d8', '#6a84f0']), T = C('#2aa8a0');
  for (let y = 30; y < 110; y++) { const w = 9 + Math.round((y - 30) * 0.2); for (let x = cx - w; x <= cx + w; x++) p.set(x, y, Bl[x === cx - w ? 1 : x === cx + w ? 1 : ((x * 3 + y) % 13 === 0 ? 3 : 2)]); } p.hl(cx - 25, 109, 50, T);
  for (let y = 40; y < 108; y++) p.set(cx, y, Bl[1]); for (const s of [-1, 1]) p.poly([[cx + s * 7, 40], [cx + s * 20, 74], [cx + s * 9, 72]], Bl[1]);
  p.poly([[cx - 11, 34], [cx, 0], [cx + 11, 34]], Bl[2]); p.poly([[cx - 6, 34], [cx, 12], [cx + 6, 34]], C('#05060e')); p.ball(cx, 26, 3, 4, [C('#5a6a7a'), C('#90a0b0'), C('#c0ccd8'), C('#e0eaf0')]);
  p.ball(cx - 4, 60, 3, 3, [C('#5a6a7a'), C('#90a0b0'), C('#c0ccd8'), C('#e0eaf0')]); p.outline(C('#02030a')); return p; };
MOBS.lancero_sepulcral = { n: L2('Lancero Sepulcral', 'Sepulchral Lancer'), art: ['vr', 'lancero'], reg: ['velo'], lv: [288, 312], hp: 1.4, atk: 1.8, def: 1.75, spd: 58, ai: 'aggro', fam: 'velo', drops: [['hueso_coronado', 0.2]] };
MOBS.acolito_velo = { n: L2('Acólito del Velo', 'Veil Acolyte'), art: ['vr', 'acolito'], reg: ['velo'], lv: [270, 296], hp: 1.36, atk: 1.76, def: 1.7, spd: 52, ai: 'ranged', fam: 'velo', drops: [['encaje_maldito', 0.16], ['esencia_espectral', 0.06]] };
VR_ZONES[2].pool.push('lancero_sepulcral', 'acolito_velo'); VR_ZONES[0].pool.push('acolito_velo');
// el imitador: copia exacta del aspecto del jugador (Bosque de los Susurros)
MOBS.imitador = { n: L2('Imitador', 'Mimic'), art: ['mimic'], reg: ['velo'], lv: [296, 310], hp: 1.5, atk: 1.9, def: 1.75, spd: 60, ai: 'aggro', fam: 'velo', drops: [['frag_mapa', 0.2], ['encaje_maldito', 0.2]] };
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'mimic' && G.P) { const P = G.P, app = normApp(P.app), gear = gearTiers(P), cos = P.cos || {}; return getAtlas('Mmimic' + heroKey(P.cls, app, gear, cos, 0), () => { return buildHeroAtlas(heroLook(P.cls, app, gear, cos, {})); }); } return _ma(art); }; }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e.type === 'mob' && e.mid === 'imitador' && !e.dying) { ctx.save(); ctx.filter = 'hue-rotate(160deg) brightness(0.75)'; try { _de(e, cx, cy); } finally { ctx.restore(); } if (Math.random() < 0.3) part(e.x + (Math.random() - 0.5) * 12, e.y - 8, { z: 6, vz: 14, life: 0.6, c: '#c070ff', s: 1 }); return; } return _de(e, cx, cy); }; }

// ---------- materiales y objetos de las regiones ----------
it('esencia_espectral', { n: L2('Esencia Espectral', 'Spectral Essence'), t: 'mat', stack: true, tier: 16, price: 3000, icon: ['gem', '#a0fff0'], rar: 5, d: L2('Alquimia oscura. Solo flota sobre los puentes del Pantano cuando apagas la linterna.', 'Dark alchemy. It only floats over the Swamp bridges when you turn your lantern off.') });
it('elixir_eclipse', { n: L2('Elixir del Eclipse', 'Eclipse Elixir'), t: 'cons', stack: true, price: 20000, icon: ['potion', '#8a40d0'], rar: 5, d: L2('+25 % de ataque durante 3 minutos.', '+25% attack for 3 minutes.'), buffE: 1 });
it('campana_muda', { n: L2('Campana Muda', 'Silent Bell'), t: 'mat', stack: true, tier: 16, price: 8000, icon: ['gem', '#2aa86a'], rar: 5 });
RECIPES.push({ id: 'r_elixir_ecl', job: 'alquimia', out: 'elixir_eclipse', n: 1, lv: 260, jlv: 1, gold: 5000, mats: [['esencia_espectral', 2], ['cera_campana', 1]], cat: 'pocion' });
{ const _ui = useItem; useItem = function (i) { const s = G.P.inv[i], it_ = s && ITEMS[s.id]; if (it_ && it_.buffE) { addBuff(G.P, 'elixir_eclipse', { atkP: 25 }, 180); G.P.auras = (G.P.auras || []).concat([{ c: 2, until: G.t + 180 }]); if (s.q > 1) s.q--; else G.P.inv.splice(i, 1); toast(it_.n, 'quest'); calcStats(G.P); return; } return _ui.apply(this, arguments); }; }
cosm('c_mascara_luna', L2('Máscara de la Luna Sonriente', 'Smiling Moon Mask'), 'head', () => ({ k: 'va_luna', m: VA.luna.m, s: VA.luna.s, cover: 'hat' }), { src: L2('Final «La máscara» (Castillo de la Luna Sonriente)', 'Ending "The mask" (Castle of the Smiling Moon)') });
cosm('c_alba_capa', L2('Capa del Primer Amanecer', 'First Dawn Cape'), 'back', () => ({ k: 'cape', o: P5(['#7a3a0a', '#b86a14', '#e8a030', '#ffc860', '#fff0b0']), i: P5(['#8a5a8a', '#b07ab0', '#d8a0d8', '#f0c8f0', '#ffffff']), tr: GOLD.slice(0, 5) }), { src: L2('Final «El amanecer» (Castillo de la Luna Sonriente)', 'Ending "The dawn" (Castle of the Smiling Moon)') });
SAVEKEYS.push('vrLant', 'vrSym', 'vrAlt', 'vrChoice', 'vrEnd');

// ---------- el mapa: puentes espectrales, símbolos, altares y la tienda del eclipse ----------
const VR_SYM = ['☾', '✦', '⚶', '♁'];
{ const _mk = makeVelo; makeVelo = function () { const fresh = !G.maps.velo_roto; const M = _mk(); if (!fresh || M.vr2) return M; M.vr2 = 1; const I = M.I, w = M.w;
  // Pantano: un islote en el agua con cofres; solo se llega por puentes que aparecen con la linterna apagada
  M.ghost = new Set(); const isl = [40, 148]; for (let y = isl[1] - 3; y <= isl[1] + 3; y++) for (let x = isl[0] - 4; x <= isl[0] + 4; x++) M.ter[I(x, y)] = T.MUD;
  for (let y = isl[1] - 9; y <= isl[1] + 9; y++) for (let x = isl[0] - 10; x <= isl[0] + 10; x++) { const i = I(x, y), d = Math.hypot((x - isl[0]) / 10, (y - isl[1]) / 9); if (d < 1 && d > 0.5 && M.ter[i] !== T.VOID) M.ter[i] = T.WATER; }
  for (const [x0, y0, dx, dy, n] of [[isl[0] + 5, isl[1], 1, 0, 6], [isl[0], isl[1] - 4, 0, -1, 6]]) for (let k = 0; k < n; k++) { const i = I(x0 + dx * k, y0 + dy * k); if (M.ter[i] === T.WATER) M.ghost.add(i); }
  M.chunks = new Map(); for (let k = 0; k < 3; k++) addObj(M, 'furn', isl[0] - 2 + k * 2, isl[1], { f: 'skychest', chestK: 80 + k, vrEss: 1 });
  // Bosque: 3 estelas con un símbolo cada una, 4 pedestales y un círculo de ilusiones alrededor de Varkhul
  const Z = VR_ZONES[2], seq = [2, 0, 3]; M.vrSeq = seq; M.ilus = [];
  [[Z.c[0] - 30, Z.c[1] + 8], [Z.c[0] + 28, Z.c[1] + 10], [Z.c[0], Z.c[1] + 22]].forEach(([x, y], k) => addObj(M, 'furn', x, y, { f: 'vr_sim', sym: seq[k], ord: k, fp: [[0, 0]] }));
  for (let k = 0; k < 4; k++) addObj(M, 'furn', Z.c[0] - 6 + k * 4, Z.c[1] + 14, { f: 'vr_ped', sym: k, fp: [[0, 0]] });
  for (let a = 0; a < 40; a++) { const x = Math.round(Z.c[0] + Math.cos(a / 40 * 6.28) * 11), y = Math.round(Z.c[1] - 4 + Math.sin(a / 40 * 6.28) * 8), i = I(x, y); if (M.objAt[i] >= 0 || M.ter[i] === T.VOID) continue; M.ilus.push(addObj(M, 'furn', x, y, { f: 'vr_ilus', fp: [[0, 0]] })); }
  // Catedral: 3 altares a encender antes de que se abra la reja del Rey de las Campanas
  const Cz = VR_ZONES[3]; M.alt = [[-16, 4], [16, 4], [0, 16]].map(([dx, dy], k) => addObj(M, 'furn', Cz.c[0] + dx, Cz.c[1] + dy, { f: 'vr_altar', alt: k, fp: [[0, 0]] }));
  M.reja = []; for (let a = 0; a < 44; a++) { const x = Math.round(Cz.c[0] + Math.cos(a / 44 * 6.28) * 9), y = Math.round(Cz.c[1] - 4 + Math.sin(a / 44 * 6.28) * 7), i = I(x, y); if (M.objAt[i] >= 0) continue; M.reja.push(addObj(M, 'furn', x, y, { f: 'vr_reja', fp: [[0, 0]] })); }
  // Aldea: mercader del eclipse (solo de noche)
  spawnNPC('mercader_eclipse', (VR_ZONES[1].c[0] + 6) * 16 + 8, (VR_ZONES[1].c[1] + 4) * 16 + 8, 'velo_roto', { face: 'down' });
  vrSync(M); return M; }; }
function hideObj(M, o, h) { o.hidden = h; const i = M.I(o.tx, o.ty); M.solidO[i] = h ? 0 : 1; M.objAt[i] = h ? -1 : o.id; }
function vrSync(M) { const P = G.P; if (!M || !M.vr2 || !P) return; for (const o of M.ilus) hideObj(M, o, !!P.vrSym); const lit = P.vrAlt || 0; for (const o of M.alt) o.lit = (lit >> o.alt) & 1; for (const o of M.reja) hideObj(M, o, lit === 7); }
{ const _sm = setMap; setMap = function (M) { const r = _sm.apply(this, arguments); if (M && M.vr) vrSync(M); return r; }; }
// la linterna (botón en el Velo Roto): apagada, el mundo se oscurece y aparecen los puentes espectrales
{ const _bf = blockedFor; blockedFor = function (M, tx, ty, L) { if (M && M.ghost && G.P && G.P.vrLant) { const i = tileAt(M, tx, ty); if (i >= 0 && M.ghost.has(i)) return false; } return _bf(M, tx, ty, L); }; }
function lantMount() { const tr = $('#tr .trbtns'); if (!tr) return; let b = $('#bLant'); const show = G.map && G.map.vr; if (!b && show) { b = document.createElement('button'); b.className = 'mini'; b.id = 'bLant'; b.title = L2('Linterna', 'Lantern'); b.onclick = () => { G.P.vrLant = G.P.vrLant ? 0 : 1; toast(G.P.vrLant ? L2('Linterna apagada: mira el agua…', 'Lantern off: look at the water…') : L2('Linterna encendida', 'Lantern on'), 'info'); sfx('ui'); }; tr.insertBefore(b, tr.firstChild); } if (b) { b.hidden = !show; b.textContent = G.P && G.P.vrLant ? '🌑' : '🏮'; } }
V33_TICKS.push(lantMount);
{ const _dk = darkness; darkness = function () { const v = _dk.apply(this, arguments); return G.map && G.map.vr && G.P && G.P.vrLant ? Math.max(v, 0.62) : v; }; }
{ const _dx = vrGround; vrGround = function (M, cx, cy) { _dx(M, cx, cy); if (!M.ghost || !G.P.vrLant) return; for (const i of M.ghost) { const x = (i % M.w) * 16 - cx, y = Math.floor(i / M.w) * 16 - cy; if (x < -16 || y < -16 || x > VW || y > VH) continue; ctx.fillStyle = `rgba(160,255,240,${0.45 + 0.2 * Math.sin(G.t * 3 + i)})`; ctx.fillRect(x + 1, y + 3, 14, 10); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(x + 2, y + 4, 12, 1); } }; }
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = s => C(s);
  if (kind === 'vr_sim') { const p = new Pix(16, 28), S = pal(['#1a1a2a', '#2a2a40', '#3a3a5a', '#5a5a7a']); p.rect(3, 4, 10, 23, S[2]); p.ell(8, 4, 5, 3, S[2]); p.vl(3, 4, 23, S[3]); p.rect(5, 9, 6, 8, D('#c070ff')); p.outline(D('#05030a')); return { c: p.canvas(), ax: 8, ay: 27, light: 1 }; }
  if (kind === 'vr_ped') { const p = new Pix(14, 14), S = pal(['#1a1a2a', '#2a2a40', '#3a3a5a', '#5a5a7a']); p.ell(7, 9, 6, 4, S[2]); p.ell(7, 8, 4, 2.5, D('#5aff8a')); p.outline(D('#05030a')); return { c: p.canvas(), ax: 7, ay: 13 }; }
  if (kind === 'vr_ilus') { const p = new Pix(18, 34); for (let y = 0; y < 34; y++) for (let x = 2; x < 16; x++) if (hash2(x, y, 4) < 0.55) p.set(x, y, D(y % 4 ? '#3a1a6a' : '#7a40c0')); return { c: p.canvas(), ax: 9, ay: 33 }; }
  if (kind === 'vr_altar') { const p = new Pix(20, 24), S = pal(['#1a1a2a', '#2a2a40', '#3a3a5a', '#5a5a7a']); p.rect(2, 12, 16, 11, S[2]); p.hl(1, 12, 18, S[3]); p.rect(7, 4, 6, 8, S[1]); p.outline(D('#05030a')); return { c: p.canvas(), ax: 10, ay: 23 }; }
  if (kind === 'vr_altar_on') { const g = genFurn2('vr_altar'), p = new Pix(20, 24); const c = g.c.getContext('2d').getImageData(0, 0, 20, 24); p.d = new Uint32Array(c.data.buffer.slice(0)); p.rect(8, 0, 4, 5, D('#5aff8a')); p.set(9, 0, D('#e0ffe8')); return { c: p.canvas(), ax: 10, ay: 23, light: 1 }; }
  if (kind === 'vr_reja') { const p = new Pix(16, 30); for (let x = 1; x < 16; x += 3) p.vl(x, 0, 30, D('#3a3a5a')); p.hl(0, 4, 16, D('#5a5a7a')); p.hl(0, 22, 16, D('#5a5a7a')); p.outline(D('#05030a')); return { c: p.canvas(), ax: 8, ay: 29 }; }
  return _ge(kind); }; }
{ const _os = objSprite; objSprite = function (o) { if (o.k === 'furn' && o.f === 'vr_altar' && o.lit) return spr('f_vr_altar_on', () => genFurn2('vr_altar_on')); return _os(o); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl(M, cx, cy, list); for (const d of list) if (d.k === 'furn' && ((d.f === 'vr_altar' && d.lit) || d.f === 'vr_sim')) out.push({ x: d.px, y: d.py - 14, r: 36, c: d.f === 'vr_sim' ? 'rgba(190,110,255,0.45)' : 'rgba(90,255,120,0.5)' }); return out; }; }
// símbolo flotando sobre las estelas y los pedestales
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { _de(e, cx, cy); if (e !== G.P || !G.map || !G.map.vr2) return; const M = G.map; ctx.save(); ctx.font = 'bold 12px serif'; ctx.textAlign = 'center';
  for (const o of M.objs) { if (o.k !== 'furn' || (o.f !== 'vr_sim' && o.f !== 'vr_ped') || Math.abs(o.px - e.x) > VW || Math.abs(o.py - e.y) > VH) continue; const y = o.py - cy - (o.f === 'vr_sim' ? 34 : 18) + Math.sin(G.t * 2 + o.id) * 2; ctx.fillStyle = o.f === 'vr_sim' ? '#e0b0ff' : '#b0ffc8'; ctx.fillText((o.f === 'vr_sim' ? (o.ord + 1) + ' ' : '') + VR_SYM[o.sym], o.px - cx, y); } ctx.restore(); }; }
let VR_SEQ = [];
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && M.vr2 && !P.dead) { const tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16); for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const i = tileAt(M, tx + dx, ty + dy); if (i < 0 || M.objAt[i] < 0) continue; const o = M.objs[M.objAt[i]]; if (o.hidden || o.k !== 'furn') continue;
  if (o.f === 'vr_sim') return { kind: 'vrx_sim', o, label: L2('Leer el símbolo', 'Read the symbol'), icon: 'talk' };
  if (o.f === 'vr_ped' && !P.vrSym) return { kind: 'vrx_ped', o, label: L2('Tocar el pedestal ', 'Touch the pedestal ') + VR_SYM[o.sym], icon: 'talk' };
  if (o.f === 'vr_altar' && !o.lit) return { kind: 'vrx_alt', o, label: L2('Encender el altar', 'Light the altar'), icon: 'talk' };
  if (o.f === 'skychest' && o.vrEss) return { kind: 'vrx_ess', o, label: L2('Abrir cofre espectral', 'Open spectral chest'), icon: 'gather' }; } } return _it(); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(), P = G.P, M = G.map; if (!t || !String(t.kind).startsWith('vrx_')) return _di(); const o = t.o;
  if (t.kind === 'vrx_sim') { typeText(L2('Grabado en la piedra: «El ', 'Carved in the stone: "The ') + ['primero', 'segundo', 'tercero'][o.ord] + L2(' paso es ', ' step is ') + VR_SYM[o.sym] + L2('». Los susurros callan un momento.', '". The whispers fall silent for a moment.')); return; }
  if (t.kind === 'vrx_ped') { VR_SEQ.push(o.sym); burst(o.px, o.py - 6, 10, { sp: 40, up: 30, g: 0, life: 0.6, c: ['#5aff8a', '#ffffff'] }); const k = VR_SEQ.length - 1;
    if (VR_SEQ[k] !== M.vrSeq[k]) { VR_SEQ = []; toast(L2('Los susurros se ríen. Algo toma tu forma…', 'The whispers laugh. Something takes your shape…'), 'warn', 3); const m = spawnMob('imitador', 300, P.x + 40, P.y, P.L, null, false); if (m) m.map = M.id; return; }
    if (VR_SEQ.length === 3) { VR_SEQ = []; P.vrSym = 1; vrSync(M); banner(L2('Las ilusiones se disipan', 'The illusions fade'), L2('El camino a Varkhul está abierto', 'The path to Varkhul is open')); sfx('questdone'); markDirty(); } return; }
  if (t.kind === 'vrx_alt') { P.vrAlt = (P.vrAlt || 0) | (1 << o.alt); o.lit = 1; addFx({ type: 'ring', x: o.px, y: o.py, r: 40, dur: 0.6, col: '#5aff8a' }); for (let k = 0; k < 2; k++) { const m = spawnMob('diacono_eclipse', 315, o.px + (k ? 40 : -40), o.py + 20, P.L, null, false); if (m) m.map = M.id; }
    if (P.vrAlt === 7) { vrSync(M); banner(L2('La reja de la catedral se abre', 'The cathedral gate opens'), L2('El Rey de las Campanas te espera', 'The King of Bells awaits')); } else toast(L2('Altares encendidos: ', 'Altars lit: ') + [0, 1, 2].filter(k => (P.vrAlt >> k) & 1).length + '/3', 'info'); markDirty(); return; }
  if (t.kind === 'vrx_ess') { if (!P.vrLant) { typeText(L2('El cofre es transparente. Con la linterna encendida no se puede tocar.', 'The chest is see-through. With the lantern on you cannot touch it.')); return; } o.hidden = true; giveItem('esencia_espectral', 2 + Math.floor(Math.random() * 3)); if (Math.random() < 0.35) giveItem('frag_mapa', 1); burst(o.px, o.py - 8, 20, { sp: 60, up: 50, g: 0, life: 0.9, c: ['#a0fff0', '#ffffff'] }); sfx('coin'); return; } }; }
// el jefe del bosque y el de la catedral no salen hasta resolver su región
{ const i = V33_TICKS.findIndex(f => /skyTick\(dt\)/.test(String(f))); if (i >= 0) { const f0 = V33_TICKS[i]; V33_TICKS[i] = function (dt) { const M = G.map, P = G.P; if (M && M.vr2 && P) { const keep = M.bossAt; M.bossAt = keep.filter(b => !((b.id === 'rey_esqueleto' && !P.vrSym) || (b.id === 'rey_campanas' && (P.vrAlt || 0) !== 7))); try { return f0(dt); } finally { M.bossAt = keep; } } return f0(dt); }; } }
// tienda del eclipse (Aldea): solo de noche
NPCS.mercader_eclipse = { n: 'Nocturna', title: L2('Mercader del Eclipse', 'Eclipse Merchant'), look: LK({ outfit: 'witch', hairStyle: 'long', hair: HAIRS.negro, g: 'f', skin: P5(['#14143a', '#262a6a', '#3a409a', '#5a60c0', '#8a90e0']), main: P5(['#1a0830', '#3a1060', '#5a1c90', '#7a30c0', '#a060e8']) }), lines: [L2('Solo vendo cuando el sol no mira.', 'I only sell when the sun is not watching.')], quests: [] };
const ECL_SHOP = [['elixir_eclipse', 20000], ['campana_muda', 9000], ['frag_mapa', 6000], ['esencia_espectral', 7000]];
DLG_HOOKS.push((npc, opts) => {
  if (npc.id === 'mercader_eclipse') { if (!isNight()) { opts.length = 0; opts.push({ label: L2('Vuelve de noche', 'Come back at night'), icon: ['talk'], fn: () => typeText(L2('El sol aún mira. Vuelve cuando caiga la noche.', 'The sun is still watching. Come back when night falls.')) }); return; }
    for (const [id, pr] of ECL_SHOP) opts.unshift({ label: L2('Comprar ', 'Buy ') + ITEMS[id].n + ' (' + fmt(pr) + ')', icon: ['coin'], fn: () => { if (G.P.gold < pr) { typeText(L2('No te alcanza.', 'Not enough.')); return; } G.P.gold -= pr; giveItem(id, 1); sfx('coin'); markDirty(); } }); }
  if (npc.id === 'oren_campanero' && G.P.quests.done.vr3 && !G.P.vrChoice) { opts.unshift({ label: L2('Tocar la última campana', 'Ring the last bell'), icon: ['talk'], fn: () => { G.P.vrChoice = 1; giveItem('campana_muda', 2); typeText(L2('La campana suena… y los aldeanos dormidos sonríen en sueños. Oren llora de alegría.', 'The bell rings… and the sleeping villagers smile in their dreams. Oren weeps with joy.')); markDirty(); } });
    opts.unshift({ label: L2('Romper la última campana', 'Break the last bell'), icon: ['sword:3'], fn: () => { G.P.vrChoice = 2; giveItem('cera_campana', 4); typeText(L2('El bronce se parte. Silencio. Oren asiente, triste: «Así ya nadie volverá a dormirse».', 'The bronze cracks. Silence. Oren nods, sad: "This way no one will fall asleep again."')); markDirty(); } }); }
});
V33_TICKS.push(() => { for (const e of G.ents) if (e.id === 'mercader_eclipse') { const n = isNight(); e.hidden = !n; e.noTalk = !n; } });
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e.id === 'mercader_eclipse' && !isNight()) return; return _de(e, cx, cy); }; }
// los aldeanos recuerdan tu decisión
V33_TICKS.push(() => { const P = G.P; if (!P || !P.vrChoice || NPCS.oren_campanero._ch === P.vrChoice) return; NPCS.oren_campanero._ch = P.vrChoice; NPCS.oren_campanero.lines = [P.vrChoice === 1 ? L2('Desde que tocaste la campana, los dormidos sueñan cosas bonitas.', 'Since you rang the bell, the sleepers dream of nice things.') : L2('La campana rota sigue ahí. Nadie se ha vuelto a dormir.', 'The broken bell is still there. No one has fallen asleep again.')]; });

// ---------- Castillo: la Luna observa y cambia a los enemigos; dos finales ----------
let VR_GAZE = 0;
V33_TICKS.push(dt => { const M = G.map, P = G.P; if (!M || !M.vr || !P || P.dead || P.vrZ !== 4) return; VR_GAZE += dt; if (VR_GAZE < 16) return; VR_GAZE = 0;
  toast(L2('La Luna te mira…', 'The Moon is watching you…'), 'warn', 2); const x = P.x, y = P.y; addFx({ type: 'field', ground: true, x, y, r: 60, dur: 1.4, col: '#ff9a3a' });
  setTimeout(() => { if (G.map !== M) return; addFx({ type: 'beam', x, y, dur: 0.8, col: '#ffc060' }); if (Math.hypot(G.P.x - x, G.P.y - y) < 60) { toast(L2('Te ha visto: los enemigos se vuelven más rápidos', 'It saw you: enemies become faster'), 'warn', 3); for (const e of G.ents) if (e.type === 'mob' && e.map === M.id && !e.boss && Math.hypot(e.x - x, e.y - y) < 260) e.enrT = G.t + 12; } }, 1400); });
{ const _cq = completeQuest; completeQuest = function (id) { const r = _cq.apply(this, arguments); if (id === 'vr6' && !G.P.vrEnd) setTimeout(() => vrEnding(), 1200); return r; }; }
function vrEnding() { const P = G.P; openModal(`<div class="frame"><h3>${L2('La máscara de la Luna', 'The Moon\'s mask')}</h3><p>${L2('La Luna Sonriente ha caído. Su máscara queda en el suelo, todavía caliente. Algo dentro de ti quiere ponérsela.', 'The Smiling Moon has fallen. Its mask lies on the ground, still warm. Something inside you wants to put it on.')}</p><div class="row"><button class="btn gold" id="vrE1">${L2('Romper la máscara', 'Break the mask')}</button><button class="btn" id="vrE2">${L2('Ponerte la máscara', 'Put on the mask')}</button></div></div>`);
  $('#vrE1').onclick = () => { P.vrEnd = 1; giveCosmetic('c_alba_capa'); closeModal(); banner(L2('El primer amanecer', 'The first dawn'), L2('El Velo Roto vuelve a ver el sol', 'The Broken Veil sees the sun again')); markDirty(); };
  $('#vrE2').onclick = () => { P.vrEnd = 2; giveCosmetic('c_mascara_luna'); closeModal(); banner(L2('La nueva Luna', 'The new Moon'), L2('Ahora eres tú quien observa', 'Now you are the one who watches')); markDirty(); }; }
// noche eterna o amanecer según el final
{ const _vs = vrSky; vrSky = function (M, cx, cy) { _vs(M, cx, cy); if (G.P && G.P.vrEnd === 1) { ctx.fillStyle = 'rgba(255,160,90,0.12)'; ctx.fillRect(0, 0, VW, VH); } }; }

// ---------- más mecánicas de jefes y efectos ----------
Object.assign(BMECH, {
  obispo_hueco: Object.assign({}, BMECH.obispo_hueco, { fn: (m, P) => { m.hp = Math.min(m.maxhp, m.hp + m.maxhp * 0.04); addFx({ type: 'ring', x: m.x, y: m.y, r: 40, dur: 0.6, col: '#3ac06a' }); vrMinions(m, 'soldado_hueco', 2);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (let k = 1; k <= 5; k++) { const x = m.x + dx * k * 24, y = m.y + dy * k * 18; addFx({ type: 'field', ground: true, x, y, r: 13, dur: 1, col: '#c0ffd0' }); HZ.push({ k: 'lava', x, y, r: 13, t0: G.t + 1, t1: G.t + 1.5, col: '#c0ffd0' }); } } }),   // cruz de luz
  rey_esqueleto: Object.assign({}, BMECH.rey_esqueleto, { fn: (m, P) => { vrMinions(m, 'soldado_hueco', 3); vrMinions(m, 'lancero_sepulcral', 1); addFx({ type: 'ring', x: m.x, y: m.y, r: 70, dur: 0.8, col: '#c0c8d0' }); } }),
});
{ const _hm = hitMob; hitMob = function (m, base, src) { const r = _hm.apply(this, arguments); if (m && m.boss && m.map === 'velo_roto' && r > 0 && Math.random() < 0.25) addFx({ type: 'slash', x: m.x, y: m.y - 10, ang: Math.random() * 6.28, arc: 1.2, r: 22, dur: 0.18, col: 'rgba(160,255,140,0.9)' }); return r; }; }

// ---------- la guía 🔎: todo lo del Velo Roto ----------
{ const _bw = bossWhere; bossWhere = function (id) { const Z = typeof VR_ZONES !== 'undefined' && VR_ZONES.find(z => z.boss === id); if (Z) return { where: L2('Velo Roto: ', 'Broken Veil: ') + Z.n, loc: VR_WPOS.portal || null }; return _bw(id); }; }
{ const _is = itemSources; itemSources = function (id) { const out = _is(id); for (const s of out) { const m = Object.keys(MOBS).find(k => MOBS[k].reg && MOBS[k].reg[0] === 'velo' && s[0].includes(MOBS[k].n) && !s[0].includes('·')); if (m) { const Z = VR_ZONES.find(z => z.pool.includes(m)); s[0] += ' · ' + L2('Velo Roto', 'Broken Veil') + (Z ? ': ' + Z.n : ''); s[1] = VR_WPOS.portal ? { loc: VR_WPOS.portal, t: L2('Portal antiguo', 'Ancient portal') } : null; } }
  if (id === 'esencia_espectral') out.unshift([L2('Cofres espectrales del Pantano (apaga la linterna 🌑)', 'Spectral chests in the Swamp (turn the lantern off 🌑)'), VR_WPOS.portal ? { loc: VR_WPOS.portal, t: L2('Portal antiguo', 'Ancient portal') } : null]);
  if (ECL_SHOP.some(e => e[0] === id)) out.push([L2('Nocturna, Mercader del Eclipse (Aldea de las Campanas Muertas, solo de noche)', 'Nocturna, Eclipse Merchant (Village of the Dead Bells, night only)'), null]);
  return out; }; }
FIT_FLOAT.add('va_velo');   // el velo cuelga a propósito junto a la cara
