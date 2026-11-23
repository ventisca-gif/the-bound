// ================= v5.84: CONJUNTO DE PIRATA DE PAJA (tier 44) · premio de Shanks =================
// Sergio aprobó la muestra (tools/art/muestras/muestra_pirata_paja.js): sombrero de paja, chaleco rojo abierto sin mangas,
// faja amarilla, pantalón corto azul con dobladillo y sandalias. Cualquier clase. Un 5 % más fuerte que la Aurora Divina
// (tier 43). Premio del duelo con Shanks en Foosha: 10 % por victoria y seguro a las 15 (pity); las 4 piezas juntas.
// La piel del pecho, los brazos y las piernas es la del personaje (paleta de la piel guardada en la paleta de la prenda,
// que el motor conserva al copiar la prenda).
SAVEKEYS.push('ppPity', 'ppGot');
const PP = { rojo: P5(['#4a0a0c', '#8a1418', '#c0222a', '#e04a44', '#f4847a']), azul: P5(['#0e1e46', '#1a3470', '#2a50a0', '#4a78c8', '#8ab0e8']), amar: P5(['#6a4a08', '#a87a10', '#e0b020', '#f4d250', '#fff0a0']), cuero: P5(['#2a160c', '#4a2a16', '#6a4022', '#8a5a32', '#b07a4a']) };
fitKind('body', 'pp_chaleco', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, d } = A, R = tx0 + tw - 1, S = s.sk || (s.m && s.m.sk);
  if (S) {
    // chaleco abierto: pecho a la vista
    if (!up && !side) for (let y = ty + 1; y < ty + th - 2; y++) { const w = 1 + Math.floor((y - ty) / 4); for (let x = Math.round(cx - w); x <= Math.round(cx + w - 1); x++) p.set(x, y, x === Math.round(cx - w) ? S[1] : S[Math.min(S.length - 1, 2 + ((y - ty) > 3 ? 0 : 1))]); p.set(Math.round(cx - w) - 1, y, PP.rojo[4]); p.set(Math.round(cx + w), y, PP.rojo[1]); }
    if (side) for (let y = ty + 2; y < ty + th - 3; y++) p.set(Math.round(cx + d * (tw / 2 - 1)), y, S[2]); }
  // cuello del chaleco
  for (let x = tx0; x <= R; x++) p.set(x, ty, x === tx0 || x === R ? PP.rojo[1] : PP.rojo[3]);
  // faja amarilla con el nudo a un lado
  const wy = ty + th - 2; for (let x = tx0 - 1; x <= R + 1; x++) { p.set(x, wy, PP.amar[(x & 1) ? 3 : 2]); p.set(x, wy + 1, PP.amar[1]); }
  const kx = side ? Math.round(cx - d * 2) : up ? R - 1 : tx0 + 1; if (!up || side) { p.set(kx, wy, PP.amar[4]); for (let k = 0; k < 4; k++) { p.set(kx + (side ? -d : -1) * (k >> 1), wy + 2 + k, PP.amar[k & 1 ? 2 : 3]); } } }, { skin: true });
fitKind('legs', 'pp_corto', (p, A, s) => { const { legTop, base } = A, cols = new Set(s.m), S = s.sk || (s.m && s.m.sk);
  const knee = legTop + Math.max(1, Math.round((base - legTop) * 0.25));
  for (let y = legTop; y < base - 1; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; const k = s.m.indexOf(c);
    if (y > knee && S) p.set(x, y, S[Math.min(S.length - 1, Math.max(0, k))]); else if (y >= knee) p.set(x, y, y === knee ? s.m[4] : s.m[3]); } }, { skin: true });
// sin mangas: al final del dibujo, los brazos (capa 3) del color del chaleco pasan a piel
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { if (L && L.top && L.top.k === 'pp_chaleco' && L.top.sk && p.t) { const S = L.top.sk, M = PP.rojo;
  for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3) { const k = M.indexOf(p.d[i]); if (k >= 0) p.d[i] = S[Math.min(S.length - 1, Math.max(0, k))]; } } } catch (e) { } return r; }; }

// ---------- tier 44: aspecto, objetos y premio ----------
const PP_T = 44, PP_LV = 600, PP_CH = 0.10, PP_PITY = 15;
function ppParts(L) { const SK = Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c), mR = PP.rojo.slice(), mB = PP.azul.slice(); mR.sk = SK; mB.sk = SK;
  return { head: { k: 'dawn_hat', dawn: 'straw', cover: 'hat' }, top: { k: 'pp_chaleco', m: mR, sk: SK }, bot: { k: 'pp_corto', m: mB, sk: SK }, feet: { k: 'sandals', m: PP.cuero } }; }
{ const _gv = gearVis; gearVis = function (cls, slot, t) { if (t === PP_T && slot !== 'weapon') { const D = { head: { k: 'dawn_hat', dawn: 'straw', cover: 'hat' }, body: { k: 'pp_chaleco', m: PP.rojo }, legs: { k: 'pp_corto', m: PP.azul }, feet: { k: 'sandals', m: PP.cuero } }[slot]; if (D) return Object.assign({ t }, D); } return _gv.apply(this, arguments); }; }
// la piel se pone al final (también si llevas solo alguna pieza o una transformación que cambia la piel)
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, o) { const L = _hl.apply(this, arguments); try { if (!L) return L; const P_ = ppParts(L);
  if (L.top && L.top.k === 'pp_chaleco') { L.top = Object.assign({}, L.top, { m: P_.top.m, sk: P_.top.sk }); if (gear && +gear.body === PP_T && !(cos && cos.back && COSM[cos.back]) && !(app && app.evo)) L.back = null; if (cls === 'asesino') L.scarf = null; }
  if (L.bot && L.bot.k === 'pp_corto') L.bot = Object.assign({}, L.bot, { m: P_.bot.m, sk: P_.bot.sk }); } catch (e) { } return L; }; }
{ const _cg = cleanGear; cleanGear = function (g) { const o = _cg.apply(this, arguments); for (const k of ['head', 'body', 'legs', 'feet']) { const v = g && +g[k]; if (v === PP_T) o[k] = PP_T; } return o; }; }
{ const _fi = fitItems; fitItems = function (only) { const out = _fi.apply(this, arguments); for (const c of AP_CLASSES) for (const slot of ['head', 'body', 'legs', 'feet']) { const it_ = { id: `${c}:${slot}:${PP_T}`, kind: 'gear', cls: c, slot, t: PP_T }; if (!only || it_.id.includes(only)) out.push(it_); } return out; }; }
{ const nm = L2('del Pirata de Paja', 'of the Straw Pirate'); TIER[PP_T] = { k: 'paja', m: nm, f: nm, mp: nm, fp: nm, lv: PP_LV, p: PP_T }; TIERP[PP_T] = PP.rojo; }
{ const def = (3 + PP_LV * 1.4 + 43 * 2) * 1.05, d = L2('Conjunto de Pirata de Paja: premio del duelo con Shanks en Foosha (10 % por victoria, seguro a las 15). Un 5 % más fuerte que la armadura de la Aurora Divina. Cualquier clase.', 'Straw Pirate set: reward for the duel with Shanks in Foosha (10% per victory, guaranteed by the 15th). 5% stronger than the Divine Aurora armour. Any class.');
  [['h', 'head', L2('Sombrero de Paja', 'Straw Hat'), 0.45, 1.5, ['helm', 15]], ['b', 'body', L2('Chaleco Rojo de Pirata', 'Red Pirate Vest'), 1, 3.5, ['armor', 15]], ['l', 'legs', L2('Pantalón Corto de Pirata', 'Pirate Shorts'), 0.6, 2, ['legs', 15]], ['f', 'feet', L2('Sandalias de Pirata', 'Pirate Sandals'), 0.35, 0, ['boots', 15]]].forEach(([s, slot, n, dm, hm, icon]) => {
    const o = { n, t: 'armor', slot, lv: PP_LV, tier: PP_T, def: Math.round(def * dm), price: Math.round(20 * Math.pow(44, 2.3) * dm), icon, rar: 5, d, pp: 1 }; if (hm) o.hpB = Math.round(PP_LV * hm * 1.05); else o.spdB = 11; it(`${s}_${PP_T}`, o); }); }
const PP_IDS = ['h_44', 'b_44', 'l_44', 'f_44'];
const ppCanDrop = () => { const P = G.P; return P && !P.ppGot; };
{ const _bk = bossKilled; bossKilled = function (m) { const r = _bk.apply(this, arguments); try { const P = G.P; if (m && m.mid === SH_BOSS && ppCanDrop()) { P.ppPity = (P.ppPity || 0) + 1;
  if (P.ppPity >= PP_PITY || Math.random() < PP_CH * (typeof dropEventMul === 'function' ? dropEventMul() : 1)) { P.ppPity = 0; P.ppGot = 1; for (const id of PP_IDS) giveItem(id, 1, true); lootFx(m.x, m.y, 'b_44');
    setTimeout(() => banner('👒 ' + L2('Conjunto de Pirata de Paja', 'Straw Pirate set'), L2('Shanks te lo regala: «Guárdalo bien».', 'Shanks gives it to you: "Take good care of it."')), 1800); sfx('quest'); }
  else toast(L2('Shanks: «Vuelve a retarme cuando quieras.» (conjunto: ', 'Shanks: "Challenge me again whenever you like." (set: ') + Math.round(PP_CH * 100) + ' %, ' + L2('seguro en ', 'guaranteed in ') + (PP_PITY - P.ppPity) + ')', 'info', 5); markDirty(true); } } catch (e) { } return r; }; }
if (typeof BOSS_EXTRA !== 'undefined') BOSS_EXTRA[SH_BOSS] = () => { const P = G.P; return ppCanDrop() ? [['b_44', PP_CH, L2('conjunto completo · seguro en ', 'full set · guaranteed in ') + Math.max(1, PP_PITY - ((P && P.ppPity) || 0))]] : []; };
// revancha: después de ganar el primer duelo se puede volver a retar a Shanks
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (!P || npc.id !== 'dawn_shanks' || !P.vaporOk || SH_FIGHT || P.lv < VAP_LV) return;
  opts.unshift({ label: '⚔ ' + L2('Revancha con Shanks', 'Rematch with Shanks') + (P.ppGot ? '' : ' (' + L2('Conjunto de Pirata de Paja: 10 %', 'Straw Pirate set: 10%') + ')'), icon: ['sword'], fn: shStart }); });
{ const _sp = itemSources; itemSources = function (id) { if (PP_IDS.includes(id)) return [[L2('Premio del duelo con Shanks (Foosha): 10 %, seguro a las 15 victorias', 'Reward for the duel with Shanks (Foosha): 10%, guaranteed by the 15th win'), { loc: [229, 129], m: 'world', t: L2('Capitana Marina (bote a Dawn)', 'Captain Marina (boat to Dawn)') }]]; return _sp.apply(this, arguments); }; }
if (typeof GSIS !== 'undefined') { const g = GSIS.find(x => x[0] === 'crossover583'); if (g) { const f = g[2]; g[2] = () => f().concat([L2('6. Conjunto de Pirata de Paja (tier 44, nivel 600, cualquier clase, un 5 % más fuerte que la Aurora Divina): premio del duelo con Shanks, 10 % por victoria y seguro a las 15. Después del primer duelo puedes pedirle la revancha.', '6. Straw Pirate set (tier 44, level 600, any class, 5% stronger than the Divine Aurora): reward for the duel with Shanks, 10% per win and guaranteed by the 15th. After the first duel you can ask him for a rematch.')]); } }
