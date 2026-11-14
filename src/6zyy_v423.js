// ================= v4.23: SUBRAZAS EN EL PVP Y RECURSOS QUE REAPARECEN EN 5 s =================
// - En un duelo funcionan todas las habilidades de subraza y se ven en el teléfono del rival (efectos, proyectiles,
//   transformación y vuelo viajan en la presencia como las de clase).
// - Igualadas entre subrazas sin importar la clase: contra jugadores, el daño de una habilidad de subraza no sale del
//   ataque de tu clase sino de tu nivel (srBase) por el multiplicador de la habilidad y un ajuste por subraza (SR_PVPK).
//   Las pasivas de subraza siguen apagadas en duelo; Vuelo Nocturno sí da esquiva.
// - Rocas, árboles, hierbas, montículos y puntos de buceo reaparecen a los 5 s en el mismo sitio.

// ---------- recursos ----------
const RES_RESPAWN = 5, RES_K = new Set(['ore', 'tree', 'herb', 'mound', 'dive']);
if (typeof FOREST !== 'undefined') FOREST.sapling = 2;
{ const _rr = respawnResources; respawnResources = function (M) { if (M && M.objs) for (const o of M.objs) if (o.respawn && RES_K.has(o.k) && o.respawn - G.t > RES_RESPAWN + 0.1) o.respawn = G.t + (o.st === 'sapling' ? 2 : RES_RESPAWN); return _rr(M); }; }

// ---------- subrazas en el PvP ----------
const SR_PVPK = { lobo: 0.96, fantasma: 1.25, vampiro: 1.44 };   // medido con tests/srpvp.txt: daño por segundo de las 4 habilidades (+ lo que cura el vampiro) igualado ±5 %
let SRK_ON = 0;
function srBase(P) { return 60 + P.lv * 9; }
function srPvpMul(P, dmg) { const k = 1 + (P.S.skillP || 0) / 100; return dmg / Math.max(1, P.S.atk * k) * srBase(P) * (SR_PVPK[P.sr] || 1); }
function srPvpD(P, dmg) { return Math.max(1, Math.round(srPvpMul(P, dmg) * 0.3)); }
{ const _ph = pvpHit; pvpHit = function (r, dmg) { const P = G.P; if (SRK_ON && P && P.sr && P.S && P.S.atk > 0) dmg = srPvpMul(P, dmg) / (PVP_CLS[P.cls] || 1); return _ph(r, dmg); }; }
{ const _sp = spawnProj; spawnProj = function (owner, x, y, ang, o) { const e = _sp(owner, x, y, ang, o); if (e && SRK_ON && owner === 'p') e.srk = 1; return e; }; }
{ const _pp = pvpProj; pvpProj = function (e) { if (e && e.srk) { SRK_ON++; try { return _pp(e); } finally { SRK_ON--; } } return _pp(e); }; }
for (const t of ['claw', 'howl', 'bite', 'cj']) NFX_TYPES.add(t);
const srFlag = fn => function () { SRK_ON++; try { return fn.apply(this, arguments); } finally { SRK_ON--; } };
function srPvpExtra(id, mult, x0, y0) { const P = G.P, k = SK[id].eff.k, atk = P.S.atk * mult;
  if (k === 'phase') { for (const r of pvpTargets()) { const t = Math.max(0, Math.min(1, ((r.x - x0) * (P.x - x0) + (r.y - y0) * (P.y - y0)) / Math.max(1, (P.x - x0) ** 2 + (P.y - y0) ** 2))); if (Math.hypot(r.x - (x0 + (P.x - x0) * t), r.y - (y0 + (P.y - y0) * t)) < 24) pvpHit(r, atk); } }
  if (k === 'blood') for (let n = 0; n < 6; n++) delayAct(0.1 + n * 0.5, () => { let hit = 0; for (const r of pvpTargets()) if (Math.hypot(r.x - P.x, r.y - P.y) < 75) { pvpHit(r, atk); hit++; addFx({ type: 'bolt', x: r.x, y: r.y - 12, x2: P.x, y2: P.y - 12, dur: 0.25, col: '#ff2040' }); } if (hit) { const h = Math.round(srPvpD(P, atk) * 0.5 * hit); P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 40, '+' + h, '#ff5a7a'); } }); }
{ const _sc = srCast; srCast = nfxWrap(function (id) { const P = G.P, s = SK[id], e = s.eff, r = P.skills[id] || 1, mult = ((e.m || 1) + (e.mr || 0) * (r - 1)) * (1 + (P.S.skillP || 0) / 100), pv = typeof pvpOn === 'function' && pvpOn(), x0 = P.x, y0 = P.y;
  SRK_ON++; const _da = delayAct; delayAct = (t, fn) => _da(t, srFlag(fn));
  try {
    if (pv && e.k === 'possess' && !G.ents.some(m => m.type === 'mob' && !m.dying && !m.boss && m.map === G.map.id && Math.hypot(m.x - P.x, m.y - P.y) < 140)) {   // en duelo: posees al rival y le arrancas el alma poco a poco
      const t = pvpTargets().filter(q => Math.hypot(q.x - P.x, q.y - P.y) < 140).sort((a, b) => dist2(a.x, a.y, P.x, P.y) - dist2(b.x, b.y, P.x, P.y))[0];
      if (!t) { toast(L2('No hay nadie a quien poseer cerca', 'No one to possess nearby'), 'warn'); P.mp += s.mp; P.cds[id] = 0; return; }
      addFx({ type: 'bolt', x: P.x, y: P.y - 14, x2: t.x, y2: t.y - 14, dur: 0.4, col: '#9ae8ff' }); floatText(t.x, t.y - 40, L2('¡POSEÍDO!', 'POSSESSED!'), '#9ae8ff', true);
      for (let n = 0; n < 4; n++) delayAct(0.6 + n, () => { pvpHit(t, P.S.atk * 0.5 * (1 + (P.S.skillP || 0) / 100)); addFx({ type: 'ring', x: t.x, y: t.y - 10, r: 16, dur: 0.4, col: '#9ae8ff' }); }); return; }
    const res = _sc(id); if (pv) srPvpExtra(id, mult, x0, y0); return res;
  } finally { delayAct = _da; SRK_ON--; } }); }
srToggle = nfxWrap(srToggle);
if (typeof cjCast === 'function') cjCast = nfxWrap(cjCast);
// Vuelo Nocturno también esquiva en duelo (el resto de pasivas sigue apagado para que ninguna subraza gane por estadísticas)
{ const _cs = calcStats; calcStats = function (P, ...a) { const S = _cs(P, ...a); if (P && P.sr && S && !srOk() && P.flyT > G.t) S.dodge = Math.min(60, S.dodge + 30); return S; }; }
