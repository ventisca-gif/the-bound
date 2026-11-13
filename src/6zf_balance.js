// ================= v3.3 BALANCE: daño según el nivel, accesorios y equipo desmedidos, experiencia de misiones =================
// Daño contra la defensa: la constante crece con el nivel del atacante, así los enemigos de nivel alto vuelven a ser peligrosos
// y los jugadores de nivel alto no tardan una eternidad en matar.
function dmgRedM(df, lv) { const K = 100 + 2 * Math.max(0, (lv || 1) - 20); return K / (K + (df || 0) * 1.1); }
function dmgRedP(def, lv) { const K = 100 + BAL_KP * Math.max(0, (lv || 1) - 40); return K / (K + (def || 0) * 1.1); }
var BAL_KP = 1.0;
// accesorios (anillos y collares) que daban 10.000 de vida y más ataque que un arma: se limitan según su nivel
for (const it of Object.values(ITEMS)) { if (it.slot !== 'acc' && it.slot !== 'neck') continue; const lv = Math.max(1, it.lv || 1);
  if (it.hpB) it.hpB = Math.min(it.hpB, Math.max(300, Math.round(lv * 10))); if (it.def) it.def = Math.min(it.def, Math.max(20, Math.round(lv * 1.6))); if (it.atk) it.atk = Math.min(it.atk, Math.max(20, Math.round(lv * 2.4))); if (it.mpB) it.mpB = Math.min(it.mpB, Math.max(200, Math.round(lv * 5))); }
// set de Nerea y Yelmo del Vacío: mejores que el tier de su nivel, pero ya no el triple
{ const fix = (id, def, hpB) => { const it = ITEMS[id]; if (it) { it.def = def; if (hpB !== undefined) it.hpB = hpB; } };
  fix('h_nerea', 145, 330); fix('b_nerea', 320, 760); fix('l_nerea', 190, 440); fix('f_nerea', 110, 120); fix('yelmo_vacio', 115); }
// experiencia de misiones: como mucho ~2,5 niveles (principales) o ~1,2 niveles (secundarias) del nivel de la misión
if (typeof QUESTS !== 'undefined') for (const id in QUESTS) { const Q = QUESTS[id]; if (!Q || !Q.rew || !Q.rew.xp || Q.board) continue; const cap = Math.round(xpToNext(Math.max(1, Q.lv || 1)) * (Q.main ? 2.5 : 1.2)); if (Q.rew.xp > cap) Q.rew.xp = cap; }
// v3.5 — tablón del gremio: antes se podían aceptar encargos sin límite (botón "Nuevos encargos") y varios de caza del mismo
// enemigo avanzaban a la vez con cada muerte (14 muertes = varios niveles). Ahora: máximo 3 a la vez, sin repetir enemigo/oficio,
// y las entregas de materiales/oficios dan menos experiencia (antes 8 troncos = 20% de un nivel).
const BOARD_MAX = 3;
{ const _bq = boardQuests; boardQuests = function (lv, seed) {
  const out = _bq(lv, seed), t = xpToNext(Math.max(1, lv));
  for (const q of out) { const o = q.obj[0], n = o.n || 1; if (o.t === 'job') q.rew.xp = Math.round(t * 0.08 * n / 8); else if (o.t === 'item') q.rew.xp = Math.round(t * 0.012 * n); }
  return out; }; }
{ const _aq = acceptQuest; acceptQuest = function (id, def) {
  if (def && def.board) {
    const P = G.P, act = Object.keys(P.quests.active).map(k => QD(k)).filter(q => q && q.board), o = def.obj[0];
    const same = q => q.obj[0].t === o.t && ((o.t === 'kill' && q.obj[0].m === o.m) || (o.t === 'job' && q.obj[0].job === o.job));
    const why = act.length >= BOARD_MAX ? `Solo puedes llevar ${BOARD_MAX} encargos del tablón a la vez` : act.some(same) ? 'Ya tienes un encargo igual en curso' : '';
    if (why) { if (P.board && P.board.list && !P.board.list.includes(def)) P.board.list.push(def); toast(why, 'warn'); return; }
  }
  return _aq.apply(this, arguments); }; }
// v3.6 — Sergio prefiere ~30 enemigos de tu nivel por nivel (antes ~50): la XP de cada monstruo sube ×5/3.
const BAL_KILL_XP = 5 / 3;
{ const _sm = spawnMob; spawnMob = function (mid, lv, x, y, L, camp, boss) { const m = _sm.apply(this, arguments); if (m && m.xp) m.xp = Math.round(m.xp * BAL_KILL_XP); return m; }; }
