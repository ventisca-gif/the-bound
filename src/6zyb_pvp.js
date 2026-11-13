// ================= v4.7: EQUILIBRIO PVP A NIVEL MÁXIMO =================
// Solo afecta a los duelos entre jugadores; contra monstruos todo sigue igual.
// - Curas y escudos de habilidades al PVP_HEAL (40 %) mientras estás en combate PvP (8 s desde el último golpe).
// - Las invocaciones del Invocador también atacan al rival en un duelo (antes solo atacaban a monstruos).
// - Multiplicador de daño PvP por clase (PVP_CLS) calculado con tools/dev/pvp.py --solve para que, a nivel máximo,
//   todas las clases puedan hacerse frente.
const PVP_HEAL = 0.4, PVP_WINDOW = 8, PVP_HEALC = { bardo: 0.12 };   // el Bardo cura muchísimo: en PvP sus curas cuentan menos que las del resto
const PVP_CLS = { guerrero: 0.8, mago: 0.88, arquero: 1.71, asesino: 1.7, bardo: 0.45, invocador: 1.42, pez: 0.85 };   // tools/dev/pvp.py --solve (v4.7, nivel 250)
function pvpActive() { const P = G.P; return !!(P && P.pvpT && G.t - P.pvpT < PVP_WINDOW); }
{ const _ph = pvpHit; pvpHit = function (r, dmg) { const P = G.P; if (P) P.pvpT = G.t; return _ph(r, dmg * (PVP_CLS[P && P.cls] || 1)); }; }
{ const _hp = hurtPlayer; hurtPlayer = function (base, src) { if (src && src.pvp && G.P) G.P.pvpT = G.t; return _hp(base, src); }; }
{ const _sv = skillVal; skillVal = function (id, r) { const o = _sv(id, r), s = SK[id]; if (o.p !== undefined && s && s.eff && (s.eff.k === 'heal' || s.eff.k === 'shield') && pvpActive()) o.p = o.p * (PVP_HEALC[G.P.cls] !== undefined ? PVP_HEALC[G.P.cls] : PVP_HEAL); return o; }; }
// invocaciones contra el rival del duelo cuando no hay monstruos cerca
{ const _us = updateSummon; updateSummon = function (e, dt) {
  _us(e, dt); const P = G.P; if (e.remove || !P || P.dead || typeof pvpOn !== 'function' || !pvpOn()) return;
  if (G.ents.some(m => m.type === 'mob' && !m.dying && m.map === e.map && dist2(m.x, m.y, P.x, P.y) < 170 * 170)) return;
  let r = null, bd = 170 * 170; for (const t of pvpTargets()) { const d = dist2(t.x, t.y, P.x, P.y); if (d < bd) { bd = d; r = t; } } if (!r) return;
  const rng = 18 * (e.scale || 1) + 8, dx = r.x - e.x, dy = r.y - e.y, L = Math.hypot(dx, dy);
  if (L > rng) { const sp = 95 * (e.rage > 0 ? 1.4 : 1) * dt; e.x += dx / L * Math.min(sp, L - rng); e.y += dy / L * Math.min(sp, L - rng); }
  e.dir = dirFromVec(dx, dy); e.pcd = (e.pcd || 0) - dt;
  if (e.pcd <= 0 && L < rng + 14) { e.pcd = e.rage > 0 ? 0.75 : 1.05; setAnim(e, e.atlas.idx.atk !== undefined ? 'atk' : 'idle'); pvpHit(r, P.S.atk * e.atkM * (1 + (e.rage > 0 ? e.rageP / 100 : 0))); addFx({ type: 'ring', x: r.x, y: r.y, r: 10, dur: 0.25, col: '#7ac8ff' }); }
}; }
