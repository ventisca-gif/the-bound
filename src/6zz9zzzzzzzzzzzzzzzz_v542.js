// ================= v5.42: DRAGÓN HÍBRIDO 2.0 =================
// Sergio aprobó la muestra (tools/art/muestras/muestra_dragon_hibrido2.js) y pidió +20 % de daño y escamas también en el
// torso. Escamas en toda la piel (en la cara, mezcladas con tu piel para que se lea), torso con escamas encima de la ropa,
// ojos encendidos, colmillos, cresta y cuernos largos, todo del color del pelo.
// Estado de la forma: P.srF = 3 (normal 0 → híbrida 1 → híbrido 2.0 → dragón a cuatro patas 2). Se desbloquea con la forma
// de dragón en rango 5 (venciendo enemigos transformado). Fuerza: +26 % de ataque (Mitad 6 % + 20 %), +10 % vida, +8 % defensa.
const DRG2_RANK = 5;
const drg2Ok = () => { const P = G.P; return P && P.sr === 'dragon' && srRank() >= DRG2_RANK; };
function drgHybrid2(p, L, dir, anim, f) { const m = p.meta; if (!m || m.hrx === undefined) return; const Q = drgPal(L), SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c));
  const top = Math.round(m.headTop), chin = Math.round(m.chin || m.hy + 8), ey = Math.round(m.ey), eyes = (m.eyes || []).map(Math.round), side = m.side, d = m.d, up = m.up, hx = Math.round(m.hx);
  const isEye = (x, y) => y >= ey - 1 && y <= ey + 2 && eyes.some(ex => x >= ex - 1 && x <= ex + 2);
  // escamas en TODA la piel (cara incluida), con dibujo de escamas en filas
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!SKN.has(c) || isEye(x, y)) continue;
    const face = y >= top && y <= chin, row = Math.floor(y / 2), sx = (x + (row % 2) * 2) % 4;
    if (face) p.set(x, y, sx === 0 ? uMix(c, Q.sc[1], 0.6) : (y % 2 === 0 && sx === 2) ? uMix(c, Q.sc[4], 0.45) : uMix(c, Q.sc[3], 0.42));
    else p.set(x, y, sx === 0 ? Q.sc[1] : (y % 2 === 0 && sx === 2) ? Q.sc[3] : uMix(Q.sc[2], Q.sc[1], 0.3)); }
  // escamas en el torso, encima de la ropa: hombros, cuello y una franja en el pecho
  { const t0 = Math.round(m.torsoTop), th = Math.round(m.th || 8), tx0 = Math.round(m.tx0), tw = Math.round(m.tw || 10), cx = Math.round(m.cx);
    for (let y = t0; y < t0 + th - 1; y++) for (let x = tx0 - 1; x <= tx0 + tw; x++) { if (!uA(p.get(x, y))) continue; const ry = y - t0, edge = x <= tx0 + 1 || x >= tx0 + tw - 2, mid = !side && !up && Math.abs(x - cx) <= 1 && ry < th - 3, collar = ry <= 1;
      if (!(edge && ry < th * 0.6) && !mid && !collar) continue; const row = Math.floor(y / 2), sx = (x + (row % 2) * 2) % 4; p.set(x, y, sx === 0 ? Q.sc[1] : (y % 2 === 0 && sx === 2) ? Q.sc[4] : Q.sc[2]); } }
  // cejas de escama y ojos encendidos
  if (!up) for (const ex of eyes) { p.set(ex - 1, ey - 1, Q.sc[0]); p.set(ex, ey - 1, Q.sc[0]); p.set(ex + 1, ey - 1, Q.sc[0]); p.set(ex, ey, Q.eye); p.set(ex + (side ? 0 : 1), ey, C('#fff0a0')); p.set(ex + (side ? 0 : 1), ey + 1, C('#1a0a04')); p.blend(ex - 1, ey + 1, C('#ffb040'), 0.4); p.blend(ex + 2, ey + 1, C('#ffb040'), 0.4); }
  // colmillos
  if (!up) { const mo = ey + ((BODY_T[L.g === 'f' ? 'f' : 'm'] || [])[L.bt || 0] || {}).mo || ey + FACE.mouth; const W = C('#fff8e8'); if (!side) { p.set(hx - 2, mo + 1, W); p.set(hx + 1, mo + 1, W); } else p.set(d < 0 ? hx - 5 : hx + 4, mo + 1, W); }
  // cresta de púas por la cabeza y la espalda
  const H = Q.horn; for (let k = 0; k < 4; k++) { const x = side ? hx - d * (2 + k * 2) : hx - 1 + (k % 2), y = top + 1 + k * (side ? 2 : 0); if (side || k < 2) { p.set(x, y - 1, H[2]); p.set(x, y - 2, H[3]); } }
  // cuernos más largos
  for (const s of side ? [-d] : [-1, 1]) { const bx = hx + s * Math.round(m.hrx * 0.45) - (side ? d * 2 : 0) + s * 3; for (let k = 0; k < 3; k++) { p.set(bx + s * k - (side ? d * k : 0), top - 3 - k, k === 2 ? H[3] : H[2]); } } }

// srSet admite el 3 (se monta como la híbrida y se marca 3)
{ const _ss = srSet; srSet = function (on) { const P = G.P; if (on === 3) { if (!drg2Ok()) { toast(L2('El Híbrido 2.0 se desbloquea con la forma de dragón en rango ', 'Hybrid 2.0 unlocks with the dragon form at rank ') + DRG2_RANK + '.', 'warn'); return; } const r = _ss.call(this, 1); P.srF = 3; calcStats(P); refreshLook(); markDirty(); return r; } return _ss.apply(this, arguments); }; }
{ const _gt = gearTiers; gearTiers = function (P) { const g = _gt.apply(this, arguments); if (P && P.sr && P.srF === 3) g.sf = 3; return g; }; }
{ const _lg = lkGear; lkGear = function (g) { const o = _lg.apply(this, arguments); if (o && o.sr === 'dragon' && g && g.sf === 3) o.sf = 3; return o; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { if (L && L.sr === 'dragon' && L.srF === 3) { L.srF = 1; let r; try { r = _dh.apply(this, arguments); } finally { L.srF = 3; } try { const tg = p.tg; if (p.t) p.tg = 5; drgHybrid2(p, L, dir, anim, f); p.tg = tg; } catch (e) { if (typeof errOnce === 'function') errOnce('drg2', e); } return r; } return _dh.apply(this, arguments); }; }
// fuerza del 2.0 (se calcula sobre la de la mitad: se deshace la de la híbrida que pone la v5.39 si srF no es 1/2)
{ const _cs = calcStats; calcStats = function (P, ...a) { if (!P || P.sr !== 'dragon' || P.srF !== 3) return _cs.call(this, P, ...a); P.srF = 0; let S; try { S = _cs.call(this, P, ...a); } finally { P.srF = 3; }
  if (S && srOk()) { S.atk = Math.round(S.atk * 1.26 / 1.06); S.maxhp = Math.round(S.maxhp * 1.10 / 1.06); S.def = Math.round(S.def * 1.08); if (P.hp > S.maxhp) P.hp = S.maxhp; S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); P.S = S; } return S; }; }
// 🐉: normal → híbrida → 2.0 (si está desbloqueado) → dragón → normal
{ const _st = srToggle; srToggle = function () { const P = G.P; if (!P || P.sr !== 'dragon') return _st.apply(this, arguments); if (P.dead || (P.srTT || 0) > G.t) return; P.srTT = G.t + 1.2;
  const F = P.srF || 0, nx = F === 0 ? 1 : F === 1 ? (drg2Ok() ? 3 : 2) : F === 3 ? 2 : 0; srSet(nx); const D = SR.dragon; addFx({ type: 'ring', x: P.x, y: P.y, r: 40, dur: 0.6, col: D.col }); burst(P.x, P.y - 14, 30, { sp: 80, up: 60, g: 20, life: 0.8, c: [D.col, '#ffffff', '#ffd040'] }); sfx(P.srF ? 'buff' : 'ui');
  if (P.srF) banner(P.srF === 1 ? L2('Forma Híbrida', 'Hybrid Form') : P.srF === 3 ? L2('Dragón Híbrido 2.0', 'Dragon Hybrid 2.0') : D.f, P.srF === 3 ? L2('+26 % de ataque · toca 🐉 otra vez: dragón a cuatro patas', '+26% attack · tap 🐉 again: four-legged dragon') : P.srF === 1 ? L2('Toca 🐉 otra vez', 'Tap 🐉 again') : L2('Toca 🐉 otra vez para volver', 'Tap 🐉 again to change back')); }; }
{ const _ts = transSet; transSet = function (f) { const r = _ts.apply(this, arguments); const P = G.P; if (P && P.sr === 'dragon' && P.srF === 3) banner(L2('Dragón Híbrido 2.0', 'Dragon Hybrid 2.0'), L2('+26 % de ataque', '+26% attack')); return r; }; }
// 🌀: el botón del 2.0 (bloqueado hasta el rango 5)
{ const _to = transOpen; transOpen = function () { const r = _to.apply(this, arguments); try { const P = G.P; if (P.sr !== 'dragon') return r; const b2 = document.querySelector('#modal [data-tf="2"]'); if (!b2 || document.querySelector('#modal [data-tf="3"]')) return r; const ok = drg2Ok();
    b2.insertAdjacentHTML('beforebegin', `<button class="btn sm ${P.srF === 3 ? 'gold' : ''}" data-tf="3" ${ok ? '' : 'disabled'}>${ok ? '' : '🔒 '}${L2('Híbrido 2.0', 'Hybrid 2.0')}${ok ? '' : ' (' + L2('rango ', 'rank ') + DRG2_RANK + ')'}</button>`);
    const b3 = document.querySelector('#modal [data-tf="3"]'); if (b3 && ok) b3.onclick = () => { transSet(3); closeModal(); }; } catch (e) { } return r; }; }
// textos de la forma y de la guía
SR.dragon.pas = L2('Cuernos, escamas, ojos dorados, alas pequeñas y cola, del color de tu pelo. +6 % de ataque, +6 % de vida y +3 % de crítico. Híbrida: escamas en la piel y alas grandes, +16 % de ataque. Híbrido 2.0 (rango 5): escamas en toda la cara, el cuerpo y el torso, colmillos y cresta, +26 % de ataque. Dragón: a cuatro patas con alas que escupe fuego, +32 % de ataque, +15 % de defensa, +15 % de vida y +12 % de velocidad. Nivel 450.', 'Horns, scales, golden eyes, small wings and a tail, in your hair colour. +6% attack, +6% HP and +3% crit. Hybrid: scales on the skin and big wings, +16% attack. Hybrid 2.0 (rank 5): scales on the whole face, body and torso, fangs and crest, +26% attack. Dragon: four-legged winged dragon that breathes fire, +32% attack, +15% defense, +15% HP and +12% speed. Level 450.');
if (typeof SR_GUIDE !== 'undefined') { const h = SR_GUIDE.dragon.how; SR_GUIDE.dragon.how = () => h().concat([L2('5. Dragón Híbrido 2.0: usa la forma de dragón y vence enemigos transformado hasta el rango 5 de sus habilidades. Luego toca 🐉: normal → híbrida → híbrido 2.0 → dragón.', '5. Dragon Hybrid 2.0: use the dragon form and defeat enemies while transformed until its skills reach rank 5. Then tap 🐉: normal → hybrid → hybrid 2.0 → dragon.')]); }
if (typeof GSIS !== 'undefined') GSIS.unshift(['drg542', '🐉 ' + L2('Dragón Híbrido 2.0', 'Dragon Hybrid 2.0'), () => [
  L2('Se desbloquea con la Mitad Dragón en rango 5 (sube venciendo enemigos transformado; mira el rango en 🌀 Transformaciones).', 'Unlocks with Half-Dragon at rank 5 (it rises by defeating enemies while transformed; see the rank in 🌀 Transformations).'),
  L2('Escamas en toda la cara (mezcladas con tu piel), el cuerpo y el torso, ojos encendidos, colmillos, cresta de púas y cuernos largos, todo del color de tu pelo. Mantiene las alas grandes de la híbrida.', 'Scales on the whole face (blended with your skin), body and torso, glowing eyes, fangs, a spiked crest and long horns, all in your hair colour. Keeps the hybrid\'s big wings.'),
  L2('+26 % de ataque (20 % más que la Mitad Dragón), +10 % de vida y +8 % de defensa, sobre tus estadísticas: con mejor equipo da más.', '+26% attack (20% more than Half-Dragon), +10% HP and +8% defense, on top of your stats: better gear gives more.')], () => null]);
