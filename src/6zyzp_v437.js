// ================= v4.37: POSTURAS CON CUERPO, PUEBLOS VIVOS EN TODO EL MUNDO, FAMILIA COMPLETA Y GRUPO SINCRONIZADO =================

// =====================================================================================
// POSTURAS DIBUJADAS: el cuerpo cambia de pose (todas las clases y estructuras de cuerpo, también en el online)
// =====================================================================================
ANIMS.st_of = [0, 2]; ANIMS.st_de = [0, 2]; ANIMS.st_ve = [0, 2];
{ const _hp = heroPose; heroPose = function (dir, anim, f, L) { if (!anim || !anim.startsWith('st_')) return _hp.apply(this, arguments);
  const k = anim.slice(3), ps = poseFor(dir, 'idle', f, L), side = dir === 'left' || dir === 'right', fx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0, wk = L.weapon && L.weapon.k;
  if (k === 'of') { // ofensiva: agachado, inclinado hacia delante, arma alzada lista para golpear
    ps.crouch = 1; ps.lean = 1; ps.bob = f ? 1 : 0; ps.rax = side ? fx * 2 : (dir === 'down' ? 4 : -3); ps.ray = -5; ps.wang = { right: -0.8, left: -2.34, down: -1.15, up: -1.95 }[dir]; ps.lax = side ? fx * 3 : -3; ps.lay = -1; ps.lfx = side ? -fx * 2 : -1; ps.rfx = side ? fx * 2 : 1;
    if (wk === 'bow') { ps.rax = side ? fx * 4 : 0; ps.ray = side ? -2 : (dir === 'down' ? 3 : -4); ps.wang = { right: 0, left: 3.14, down: 1.57, up: -1.57 }[dir]; ps.wph = 2; ps.lax = side ? fx * 5 : 0; ps.lay = ps.ray; }
    if (wk === 'staff') { ps.wang = -1.57; ps.rax = side ? fx * 3 : 3; ps.ray = -6; ps.wph = 1; } }
  else if (k === 'de') { // defensiva: arma cruzada delante del cuerpo y el otro brazo en guardia
    ps.crouch = 2; ps.lean = -1; ps.bob = f ? 1 : 0; ps.rax = side ? fx * 4 : (dir === 'down' ? 3 : -3); ps.ray = -2; ps.wang = { right: -0.35, left: -2.79, down: 2.75, up: -0.35 }[dir]; ps.lax = side ? fx * 3 : -3; ps.lay = -4; ps.lfx = -1; ps.rfx = 1;
    if (wk === 'bow') { ps.wang = { right: -1.2, left: -1.94, down: -1.4, up: -1.7 }[dir]; ps.ray = -3; }
    if (wk === 'lute') { ps.wang = -0.6; ps.lay = -2; } }
  else if (k === 've') { // veloz: de puntillas, rebotando, arma hacia atrás como para salir corriendo
    ps.jump = f ? 2 : 0; ps.lean = 2; ps.crouch = f ? 0 : 1; ps.lfx = side ? -fx * 3 : -2; ps.rfx = side ? fx * 2 : 2; ps.lfy = f ? -1 : 0; ps.lax = side ? -fx * 3 : -2; ps.lay = 1; ps.rax = side ? -fx * 3 : 3; ps.ray = 1; ps.wang = { right: 2.5, left: 0.64, down: 2.3, up: -0.8 }[dir]; }
  return ps; }; }
function stanceAtlasFor(e, k) { const app = normApp(e.app), gear = e.type === 'player' ? gearTiers(e) : e.gear, cos = e.cos || {}, hh = e.type === 'player' ? e.hideHelm : e.hh; return getAtlas('S' + k + heroKey(e.cls, app, gear, cos, hh), () => buildAtlas(heroLook(e.cls, app, gear, cos, { hideHelm: hh }), ['st_' + k], drawHero)); }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) {
  if (e && (e.type === 'player' || e.type === 'remote') && e.anim === 'idle' && !e.mount && !e.dead && e.cls) { const k = e.wpos; if (k && WM_POS[k] && e.app) { const A0 = e.atlas, an0 = e.anim, f0 = e.af; try { e.atlas = stanceAtlasFor(e, k); e.anim = 'st_' + k; e.af = Math.floor(G.t * 2.2) % 2; return _de.apply(this, arguments); } catch (err) { e.atlas = A0; e.anim = an0; e.af = f0; return _de.apply(this, arguments); } finally { e.atlas = A0; e.anim = an0; e.af = f0; } } }
  return _de.apply(this, arguments); }; }

// =====================================================================================
// PUEBLOS VIVOS TAMBIÉN EN EL CIELO, EL ARCHIPIÉLAGO Y EL VELO ROTO
// =====================================================================================
const PV_XT = [
  { k: 'cefira', map: 'cielo', c: CEL_TOWNS[0].c, r: CEL_TOWNS[0].r, n: CEL_TOWNS[0].n, lv: 200, tr: [['seda', 'pieles'], ['cristal', 'vino']] },
  { k: 'aurelia', map: 'cielo', c: CEL_TOWNS[1].c, r: CEL_TOWNS[1].r, n: CEL_TOWNS[1].n, lv: 205, tr: [['cristal'], ['cafe', 'especias']] },
  { k: 'lumen', map: 'cielo', c: CEL_TOWNS[2].c, r: CEL_TOWNS[2].r, n: CEL_TOWNS[2].n, lv: 200, tr: [['vino', 'cacao'], ['sal', 'seda']] },
  { k: 'esmeralda', map: 'archipielago', c: PE.c, r: PE.r, n: L2('Puerto Esmeralda', 'Emerald Port'), lv: 160, tr: [['cacao', 'cafe', 'sal'], ['pieles', 'cristal']] },
  { k: 'nochebruma', map: 'velo_roto', c: NB.c, r: NB.r, n: L2('Nochebruma', 'Nochebruma'), lv: 260, tr: [['pieles'], ['vino', 'especias', 'cafe']] },
];
for (const t of PV_XT) { t.x0 = t.c[0] - t.r[0]; t.x1 = t.c[0] + t.r[0]; t.y0 = t.c[1] - t.r[1]; t.y1 = t.c[1] + t.r[1]; PV_TOWNS.push(t.k); PV_TRADE[t.k] = t.tr; TOWN_LV[t.k] = t.lv; }
function pvXT(k) { return PV_XT.find(t => t.k === k); }
{ const _tn = townName; townName = function (k) { const t = pvXT(k); return t ? t.n : _tn.apply(this, arguments); }; }
{ const _ta = pvTownAt; pvTownAt = function (x, y) { const M = G.map; if (M && !M.isWorld) { const tx = x / 16, ty = y / 16, t = PV_XT.find(t => t.map === M.id && tx >= t.x0 - 1 && tx <= t.x1 + 1 && ty >= t.y0 - 1 && ty <= t.y1 + 1); return t ? t.k : null; } return _ta.apply(this, arguments); }; }
{ const _nt = pvNearTown; pvNearTown = function (x, y) { const M = G.map; if (M && !M.isWorld) { let b = '', bd = 1e9; for (const t of PV_XT) { if (t.map !== M.id) continue; const d = dist2(x / 16, y / 16, t.c[0], t.c[1]); if (d < bd) { bd = d; b = t.k; } } return bd < 70 * 70 ? b : ''; } return _nt.apply(this, arguments); }; }
{ const _bl = pvBoardLoc; pvBoardLoc = function (tk) { const t = pvXT(tk); if (t) { const M = G.maps[t.map], o = M && M.objs.find(o => o.xact === 'pv_board' && o.tk === tk); return o ? [o.tx, o.ty] : null; } return _bl.apply(this, arguments); }; }
function pvPlaceXT(M) { if (!M || M.pvXT) return M; M.pvXT = 1; for (const t of PV_XT) if (t.map === M.id) { const ok = i => !SOLID_T[M.ter[i]] && M.ter[i] !== T.STAIRS && M.ter[i] !== T.BRIDGE; putNear(M, 'pv_tablon', t.c[0] + 3, t.c[1] + 2, [[0, 0]], { xact: 'pv_board', tk: t.k }, ok); } return M; }
{ const _mk = makeSky; makeSky = function () { return pvPlaceXT(_mk.apply(this, arguments)); }; }
{ const _mk = makeArchi; makeArchi = function () { return pvPlaceXT(_mk.apply(this, arguments)); }; }
{ const _mk = makeVelo; makeVelo = function () { return pvPlaceXT(_mk.apply(this, arguments)); }; }
for (const id of ['cielo', 'archipielago', 'velo_roto']) if (G.maps && G.maps[id]) pvPlaceXT(G.maps[id]);
// casas tapiadas también en estos pueblos (las casas son objetos del mapa)
{ const _ab = pvAbandon; pvAbandon = function () { const r = _ab.apply(this, arguments); const M = G.map; if (!M || M.isWorld) return r; const key = 'x' + M.id + PV_XT.map(t => pvPros(t.k) < 25 ? 1 : 0).join(''); if (M.pvAbKey === key) return r; M.pvAbKey = key;
    for (const e of G.ents) if (e.pvXab) e.remove = true;
    for (const t of PV_XT) { if (t.map !== M.id || pvPros(t.k) >= 25) continue; const hs = M.objs.filter(o => o.k === 'furn' && /casa|house|choza|cabana|hut/i.test(o.f || '') && o.tx >= t.x0 && o.tx <= t.x1 && o.ty >= t.y0 && o.ty <= t.y1).slice(0, 2); for (const o of hs) G.ents.push({ type: 'deco', k2: 'pv_tablas', map: M.id, x: o.px, y: o.py + 1, pvXab: 1 }); } return r; }; }
let pvXT_T = 0; V33_TICKS.push(dt => { pvXT_T += dt || 0; if (pvXT_T < 1.5) return; pvXT_T = 0; if (G.map && !G.map.isWorld && G.P) pvAbandon(); });
// comercio: la flecha también puede llevar a los tableros de otros mapas
if (JOB_GUIDE.comercio) { const _f = JOB_GUIDE.comercio.find; JOB_GUIDE.comercio.find = function () { const M = G.map, P = G.P; if (M && !M.isWorld) { const o = M.objs.find(o => o.xact === 'pv_board'); if (o) return { loc: [o.tx, o.ty], t: L2('Tablón de ', 'Board of ') + townName(o.tk), m: M.id }; } return _f.apply(this, arguments); }; }

// =====================================================================================
// FAMILIA COMPLETA: llamar a cualquier hijo desde cualquier sitio y nietos con todos los sistemas
// =====================================================================================
// los nietos pasan a ser hijos de la familia con todo: crecer, clase, nivel, equipo, acompañarte, expediciones, boda y más nietos
function famMigrate() { const P = G.P; if (!P || !P.kids) return; for (const k of P.kids.slice()) { if (!k.gkids || !k.gkids.length) continue;
  for (const g of k.gkids) if (!P.kids.some(x => x.id === g.id)) P.kids.push({ id: g.id, name: g.name, g: g.g, app: g.app, born: g.born, parent: 'gk:' + k.id, gparent: k.id, house: k.house, equip: {} });
  } }
{ const _ld = legDay; legDay = function () { famMigrate(); const r = _ld.apply(this, arguments); famMigrate(); return r; }; }
let famMT = 0; V33_TICKS.push(dt => { famMT += dt || 0; if (famMT < 2) return; famMT = 0; if (G.P && G.P.kids && G.P.kids.some(k => (k.gkids || []).some(g => !G.P.kids.some(x => x.id === g.id)))) famMigrate(); });
{ const _kf = kidFull; kidFull = function () { const P = G.P, all = P.kids; P.kids = (all || []).filter(k => !k.gparent); try { return _kf.apply(this, arguments); } finally { P.kids = all; } }; }
function famKidsOf(k) { return (G.P.kids || []).filter(x => x.gparent === k.id); }
// en la casa del hijo aparecen sus hijos (tus nietos) como miembros reales de la familia
{ const _sm = setMap; setMap = function (M) { const r = _sm.apply(this, arguments); try { const P = G.P, k = M && (P.kids || []).find(k => k.house === M.id && !k.gparent); if (k) famKidsOf(k).forEach((g, i) => { if (g.follow || g.explore || kidStage(g) < 1 && false) return; if (G.ents.some(e => e.type === 'kid' && e.kid === g && !e.remove)) return; const e = kidEnt(g, M.id, ((M.w >> 1) - 1 + i * 2) * 16, ((M.h >> 1) + 1) * 16); e.fam = 1; e.famOf = g; }); } catch (e) { console.warn(e); } return r; }; }
// los hijos de tus hijos cuentan aparte (no gastan los 3 hijos por pareja)
// panel 👪 Familia en la fila de iconos de arriba
UI_ICONS.push('heart:#ff7ad0');
function famBtn() { const tr = $('#tr .trbtns'), P = G.P; if (!tr || !P) return; let b = $('#famBtn'); if (!b) { b = document.createElement('button'); b.id = 'famBtn'; b.className = 'mini'; b.title = L2('Familia', 'Family'); b.onclick = () => famOpen(); tr.insertBefore(b, tr.firstChild); }
  if (!b.dataset.ic && ICON.keys[iconKey(['heart', '#ff7ad0'])] !== undefined) { b.innerHTML = iconHTML(['heart', '#ff7ad0'], 22); b.dataset.ic = 1; } b.hidden = !(P.kids || []).some(k => kidStage(k) >= 1); }
let famT = 0; V33_TICKS.push(dt => { famT += dt || 0; if (famT < 1) return; famT = 0; if (G.P && !titleMode) famBtn(); });
function famOpen() {
  const P = G.P, ks = (P.kids || []).filter(k => !k.gparent), row = (k, sub) => { const st = kidStage(k), lv = typeof kidLv === 'function' ? kidLv(k) : 1, where = k.explore ? L2('de expedición', 'on an expedition') : k.follow ? L2('contigo', 'with you') : k.house ? L2('en su casa', 'at home') + ' · ' + townName(legKidTown(k) || '') : L2('en tu casa', 'at your home');
    return `<div class="srow" style="${sub ? 'margin-left:1.4em' : ''}"><div class="sn"><b>${sub ? '👶 ' : ''}${esc(k.name)}${k.cls && CLASSES[k.cls] ? ' · ' + esc(CLASSES[k.cls].n) + ' ' + L2('Nv.', 'Lv.') + ' ' + lv : ''}</b><small>${esc(kidStName(k, st))}${kidAdult(k) ? ' · ' + L2('adulto', 'adult') : ''}${k.spouse ? ' · 💍 ' + esc(k.spouse.name) : ''} · ${esc(where)}</small></div>${st >= 1 && !k.explore ? `<button class="btn sm" data-fm="${k.id}">${k.follow ? L2('Hablar', 'Talk') : L2('Llamar', 'Call')}</button>` : ''}</div>`; };
  openModal(`<h2>👪 ${L2('Tu familia', 'Your family')}</h2><p class="hint">${L2('Llama a cualquiera de tus hijos o nietos: vendrá a tu lado y podrás hablar con él para que te acompañe, mandarle de expedición, equiparle y todo lo demás, aunque ya tenga su propia casa.', 'Call any of your kids or grandkids: they will come to you and you can talk to them to have them follow you, send them on an expedition, equip them and everything else, even if they already have their own home.')}</p>
    <div class="pvBody">${ks.map(k => row(k, 0) + famKidsOf(k).map(g => row(g, 1) + famKidsOf(g).map(gg => row(gg, 1)).join('')).join('')).join('') || `<p class="hint">${L2('Aún no tienes hijos.', 'You have no kids yet.')}</p>`}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party pvmodal');
  $('#mclose').onclick = closeModal; $$('#modal [data-fm]').forEach(b => b.onclick = () => { const k = P.kids.find(k => k.id === b.dataset.fm); if (!k) return; closeModal(); famCall(k); });
}
function famCall(k) { const P = G.P; let e = G.ents.find(q => q.type === 'kid' && q.kid === k && !q.remove && q.map === P.map);
  if (!e) { e = kidEnt(k, P.map, P.x + 18, P.y + 6); e.fam = 1; e.famOf = k; burst(e.x, e.y - 10, 10, { sp: 30, up: 40, g: -10, life: 0.7, c: ['#ff9ad8', '#ffffff'] }); e.chat = pick([L2('¡Aquí estoy!', 'Here I am!'), L2('¿Me llamabas?', 'Did you call me?'), L2('¡Vamos de aventura!', 'Let\'s go on an adventure!')]); e.chatT = G.t; }
  e.dir = dirFromVec(P.x - e.x, P.y - e.y); openKid(e); }
// la casa de los nietos casados también es una casa de la familia (marca en el mapa)
// (worldPOI ya marca toda casa de P.kids con k.house)

// =====================================================================================
// GRUPO: TODO SINCRONIZADO
// =====================================================================================
// mapas nuevos que comparten monstruos con el líder
for (const id of ['cielo', 'velo_roto', 'reino_celeste', 'jardin_sonrisa', 'ixtal0', 'ixtal1', 'ixtal2'].concat(Object.keys(CAVES))) SYNC_MAPS.add(id);
{ const _dd = deepDef; deepDef = function () { const id = _dd.apply(this, arguments); SYNC_MAPS.add(id); return id; }; }
// los monstruos del líder llevan su papel (guardián/curandero) y su estado elemental
{ const _sp = syncPresence; syncPresence = function (o) { _sp.apply(this, arguments); if (!Array.isArray(o.mb)) return; for (const a of o.mb) { const m = G.ents.find(e => e.type === 'mob' && e.nid === a[0] && !e.dying); if (!m) continue; a[9] = m.role === 'guard' ? 1 : m.role === 'healer' ? 2 : 0; a[10] = (elHas(m, 'wet') ? 1 : 0) | (elHas(m, 'shock') ? 2 : 0) | ((m.burn || 0) > 0 ? 4 : 0) | ((m.freeze || 0) > 0 || (m.slow || 0) > 0 ? 8 : 0); } }; }
{ const _mr = syncMemberRecv; syncMemberRecv = function (r, pr) { const res = _mr.apply(this, arguments); if (r.id === PARTY.id && Array.isArray(pr.mb)) for (const a of pr.mb) { if (!Array.isArray(a)) continue; const m = GHOSTS.get(a[0]); if (!m || m.remove) continue;
    const rl = a[9] === 1 ? 'guard' : a[9] === 2 ? 'healer' : null; if (rl !== m.role) { m.role = rl; m.name = (rl ? TM_ROLE[rl][0] + ' ' : '') + (m.def ? m.def.n : m.name); }
    const b = a[10] | 0; m.el = m.el || {}; if (b & 1) elSet(m, 'wet', 1.5); if (b & 2) elSet(m, 'shock', 1.5); if (b & 4) m.burn = Math.max(m.burn || 0, 0.6); if (b & 8) m.slow = Math.max(m.slow || 0, 0.6); } return res; }; }
// partes vulnerables de los jefes: si alguien del grupo las rompe, se rompen para todos
{ const _ep = extraPresence; extraPresence = function (o) { const r = _ep.apply(this, arguments); if (PARTY.id) { const out = []; for (const m of G.ents) if (m.boss && m.bp && !m.dying && m.map === G.P.map && dist2(m.x, m.y, G.P.x, G.P.y) < 700 * 700) out.push([m.mid, m.bp.on ? 1 : 0, Math.max(0, Math.round(m.bp.hp / m.bp.max * 100))]); if (out.length) o.bpk = out; } return r; }; }
{ const _ur = upsertRemote; upsertRemote = function (p) { const res = _ur.apply(this, arguments); try { const pr = p && p.presence, R = G.remote.get(p.peer); if (pr && R && PARTY.id && R.pt === PARTY.id && Array.isArray(pr.bpk) && R.map === G.P.map) for (const a of pr.bpk) { if (!Array.isArray(a)) continue; const m = G.ents.find(e => e.boss && e.mid === a[0] && e.bp && !e.dying); if (!m || !m.bp.on) continue; if (!a[1]) bpBreak(m); else m.bp.hp = Math.min(m.bp.hp, m.bp.max * clamp(+a[2] || 0, 0, 100) / 100); } } catch (e) { } return res; }; }
// la postura y la técnica de los demás también se ven (la postura ya viaja; la técnica con su efecto)
