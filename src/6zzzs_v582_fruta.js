// ================= v5.82: LA FRUTA DEL DIABLO SE PUEDE CONSEGUIR =================
// Sergio (5.82): la primera fruta del diablo (morada, con espirales y rabito amarillo) la suelta el jefe más difícil de
// nivel 600, la Hilandera Muda (Tierras Tejidas), con un 10 % (5.83: 5 % con pity de 20). Con la fruta en la mochila se puede desembarcar en
// Foosha (muelle del puerto) y en Shells Town; así ya se llega a Shanks y a Engranaje 2. Little Garden sigue sin
// desembarco (no tiene contenido todavía). La fruta no se gasta: es la llave de las islas.
const DF_ID = 'dawn_fruta_diablo', DF_CH = 0.05, DF_PITY = 20;   // 5.83: 5 % y segura a los 20 intentos
const dfHas = () => !!(G.P && (countItem(DF_ID) > 0 || G.P.dfKey || G.P.fruit));   // la llave se queda aunque te la comas
Object.assign(ITEMS[DF_ID], { icon: ['dfruit'], price: 0, d: L2('Fruta morada con espirales. La suelta la Hilandera Muda (nivel 600, Tierras Tejidas): 5 %, segura a los 20 intentos. Abre los desembarcos de Foosha y Shells Town para siempre. Si te la comes, tu cuerpo se vuelve de goma (Lupa › Progresión crossover).', 'A purple fruit with swirls. Dropped by the Mute Spinner (level 600, Woven Lands): 5%, guaranteed by the 20th try. It opens the Foosha and Shells Town landings for good. If you eat it, your body turns to rubber (Magnifier › Crossover progression).') });
// icono: bola morada con espirales en relieve y rabito amarillo enroscado
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'dfruit') return _gi.apply(this, arguments); const p = new Pix(16, 16), V = [C('#3a1a6a'), C('#5a2a9a'), C('#7a46c8'), C('#9a6ae0'), C('#c4a0f4')], Y = [C('#8a6a10'), C('#d0a828'), C('#f0d060')];
  p.ball(8, 10, 6, 5.6, [V[0], V[1], V[2], V[3]]);
  for (const [cx, cy] of [[5, 8], [10, 8], [7, 12], [12, 12], [4, 12]]) { p.set(cx, cy, V[4]); p.set(cx + 1, cy, V[3]); p.set(cx + 1, cy + 1, V[1]); p.set(cx, cy + 1, V[1]); p.set(cx - 1, cy, V[3]); p.set(cx, cy - 1, V[4]); }
  p.vl(8, 3, 2, Y[1]); p.hl(5, 3, 3, Y[1]); p.hl(9, 2, 3, Y[2]); p.set(12, 3, Y[2]); p.set(12, 4, Y[1]); p.set(11, 4, Y[0]); p.set(4, 3, Y[0]);
  p.outline(OUTL); return p; }; }
// botín: 5 % (pity: segura a los 20 intentos) al vencer a la Hilandera Muda (solo si aún no tienes la fruta)
const dfCanDrop = () => { const P = G.P; return P && countItem(DF_ID) === 0 && P.fruit !== 'goma'; };
{ const _bk = bossKilled; bossKilled = function (m) { const r = _bk.apply(this, arguments); try { const P = G.P; if (m && m.mid === 'tj_hilandera' && dfCanDrop() && (P.dfPity = (P.dfPity || 0) + 1) && (P.dfPity >= DF_PITY || Math.random() < DF_CH * (typeof dropEventMul === 'function' ? dropEventMul() : 1))) { P.dfPity = 0; P.dfKey = 1;
  giveItem(DF_ID, 1, true); lootFx(m.x, m.y, DF_ID); banner('🍇 ' + ITEMS[DF_ID].n, L2('¡Ya puedes desembarcar en Foosha y Shells Town!', 'You can now land at Foosha and Shells Town!')); sfx('quest'); markDirty(true); } } catch (e) { } return r; }; }
// con la fruta, los desembarcos se abren (Shells Town ya lo comprueba con dawnTravelStatus)
{ const _ts = dawnTravelStatus; dawnTravelStatus = function () { const s = _ts.apply(this, arguments); return Object.assign({}, s, { open: s.open || dfHas(), available: true }); }; }
dawnLandingNotice = function () { return dfHas() ? L2('Llevas la Fruta del Diablo: acércate al muelle de Foosha o de Shells Town con tu bote para desembarcar.', 'You carry the Devil Fruit: bring your boat to the Foosha or Shells Town pier to land.')
  : L2('Para desembarcar en Foosha o Shells Town hace falta una Fruta del Diablo. La suelta la Hilandera Muda (nivel 600, Tierras Tejidas): 5 %, segura a los 20 intentos.', 'A Devil Fruit is required to land at Foosha or Shells Town. The Mute Spinner (level 600, Woven Lands) drops it: 5%, guaranteed by the 20th try.'); };
// ---------- desembarco en Foosha (muelle del puerto, M.port) ----------
function fooshaPier(M) { const [px, py] = M.port || [522, 267]; for (let r = 0; r < 10; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const x = px + dx, y = py + dy, i = M.I(x, y); if (x < 0 || y < 0 || x >= M.w || y >= M.h) continue; if (!SOLID_T[M.ter[i]] && !WATERY[M.ter[i]] && M.ter[i] !== T.DEEP && !(M.solidO && M.solidO[i])) return [x * 16 + 8, y * 16 + 8]; } return [px * 16 + 8, py * 16 + 8]; }
function fooshaAction() { const P = G.P, M = G.map; if (!M || M.id !== 'dawn' || !P || P.dead || G.fading) return null; const [px, py] = fooshaPier(M);
  if (P.dawnHelm && P.dawnHelm.kind === 'skiff') return dist2(P.x, P.y, px, py) < 72 * 72 ? (dfHas() ? 'foosha_land' : 'foosha_closed') : null;
  if (P.fooshaBerth && !P.dawnHelm) return dist2(P.x, P.y, px, py) < 40 * 40 ? 'foosha_sail' : null; return null; }
function fooshaChange(action) { if (fooshaAction() !== action) return; transition(() => { const P = G.P, M = G.map, [px, py] = fooshaPier(M);
  if (action === 'foosha_land') { P.fooshaBerth = { x: P.x, y: P.y, dir: P.dir, h: P.dawnHelm }; P.dawnHelm = null; P.x = px; P.y = py; P.dir = 'up'; banner('Villa Foosha', L2('Molinos, el Partys Bar y la tripulación de Shanks', 'Windmills, the Partys Bar and Shanks\'s crew')); }
  else { const B = P.fooshaBerth; P.dawnHelm = B.h; P.x = B.x; P.y = B.y; P.dir = 'down'; P.fooshaBerth = null; }
  P.target = null; updateCamera(0, true); prewarm(M); netPresence(true); markDirty(true); }); }
XACT.foosha_closed = [L2('Desembarco cerrado · Fruta del Diablo', 'Landing closed · Devil Fruit'), 'ways', () => toast(dawnLandingNotice(), 'info', 5)];
XACT.foosha_land = [L2('Desembarcar en Foosha', 'Land at Foosha'), 'ways', () => fooshaChange('foosha_land')];
XACT.foosha_sail = [L2('Volver al bote', 'Return to your boat'), 'ways', () => fooshaChange('foosha_sail')];
{ const _it = interactTarget; interactTarget = function () { const k = fooshaAction(); return k ? { kind: 'xact', label: XACT[k][0], icon: 'ways', o: { xact: k } } : _it.apply(this, arguments); }; }
{ const _sm = setMap; setMap = function (M) { const r = _sm.apply(this, arguments); if (r !== false && G.P && G.map === M && M.id !== 'dawn') G.P.fooshaBerth = null; return r; }; }
// Engranaje 2 ya se puede conseguir: textos al día
SR.vapor.why = off => (G.P.lv < VAP_LV ? `<b>${L2('Requiere nivel ', 'Requires level ')}${VAP_LV}.</b> ` : '') + L2('Vence a la Rueca Desbocada (Tierras Tejidas), consigue la Fruta del Diablo (Hilandera Muda, 5 % con pity), desembarca en Foosha y vence a Shanks. Luego Shanks hace el ritual: ', 'Defeat the Runaway Spinning Wheel (Woven Lands), get the Devil Fruit (Mute Spinner, 5% with pity), land at Foosha and defeat Shanks. Then Shanks performs the ritual: ') + off + '.';
if (typeof GSIS !== 'undefined') { const g = GSIS.find(x => x[0] === 'engranaje2'); if (g) { const f = g[2]; g[2] = () => f().map(l => /🔒/.test(l) ? L2('🍇 Para llegar a Foosha necesitas la Fruta del Diablo: la suelta la Hilandera Muda (nivel 600, Tierras Tejidas), 5 % y segura a los 20 intentos. Luego navega con Marina (Puerto Coral) y acércate al muelle de Foosha.', '🍇 To reach Foosha you need the Devil Fruit: the Mute Spinner (level 600, Woven Lands) drops it, 5% and guaranteed by the 20th try. Then sail with Marina (Coral Port) and approach the Foosha pier.') : l); }
  GSIS.unshift(['fruta582', '🍇 ' + L2('Fruta del Diablo', 'Devil Fruit'), () => [ITEMS[DF_ID].d, L2('Con la fruta: navega desde Puerto Coral (Capitana Marina, nivel 500) y acércate con el bote al muelle de Foosha o de Shells Town. Little Garden aún no tiene desembarco.', 'With the fruit: sail from Coral Port (Captain Marina, level 500) and bring the boat to the Foosha or Shells Town pier. Little Garden has no landing yet.')],
    () => dfHas() ? { loc: [229, 129], m: 'world', t: L2('Capitana Marina', 'Captain Marina') } : { loc: TJ_BOSS_AT.tj_hilandera, m: 'world', t: BOSSES.tj_hilandera.n }]); }
{ const _is = itemSources; itemSources = function (id) { if (id === DF_ID) return [[L2('Lo suelta la Hilandera Muda (5 %, segura a los 20) · Tierras Tejidas', 'Dropped by the Mute Spinner (5%, guaranteed at 20) · Woven Lands'), { loc: TJ_BOSS_AT.tj_hilandera, m: 'world', t: BOSSES.tj_hilandera.n }]]; return _is.apply(this, arguments); }; }
SAVEKEYS.push('fooshaBerth');
