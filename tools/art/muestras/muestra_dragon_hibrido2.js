// MUESTRA TEMPORAL (no se publica): Dragón Híbrido 2.0
function drgHybrid2(p, L, dir, anim, f) { const m = p.meta; if (!m || m.hrx === undefined) return; const Q = drgPal(L), SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c));
  const top = Math.round(m.headTop), chin = Math.round(m.chin || m.hy + 8), ey = Math.round(m.ey), eyes = (m.eyes || []).map(Math.round), side = m.side, d = m.d, up = m.up, hx = Math.round(m.hx);
  const isEye = (x, y) => y >= ey - 1 && y <= ey + 2 && eyes.some(ex => x >= ex - 1 && x <= ex + 2);
  // escamas en TODA la piel (cara incluida), con dibujo de escamas en filas
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!SKN.has(c) || isEye(x, y)) continue;
    const face = y >= top && y <= chin, row = Math.floor(y / 2), sx = (x + (row % 2) * 2) % 4;
    if (face) p.set(x, y, sx === 0 ? uMix(c, Q.sc[1], 0.6) : (y % 2 === 0 && sx === 2) ? uMix(c, Q.sc[4], 0.45) : uMix(c, Q.sc[3], 0.42));
    else p.set(x, y, sx === 0 ? Q.sc[1] : (y % 2 === 0 && sx === 2) ? Q.sc[3] : uMix(Q.sc[2], Q.sc[1], 0.3)); }
  // cejas de escama y ojos encendidos
  if (!up) for (const ex of eyes) { p.set(ex - 1, ey - 1, Q.sc[0]); p.set(ex, ey - 1, Q.sc[0]); p.set(ex + 1, ey - 1, Q.sc[0]); p.set(ex, ey, Q.eye); p.set(ex + (side ? 0 : 1), ey, C('#fff0a0')); p.set(ex + (side ? 0 : 1), ey + 1, C('#1a0a04')); p.blend(ex - 1, ey + 1, C('#ffb040'), 0.4); p.blend(ex + 2, ey + 1, C('#ffb040'), 0.4); }
  // colmillos
  if (!up) { const mo = ey + ((BODY_T[L.g === 'f' ? 'f' : 'm'] || [])[L.bt || 0] || {}).mo || ey + FACE.mouth; const W = C('#fff8e8'); if (!side) { p.set(hx - 2, mo + 1, W); p.set(hx + 1, mo + 1, W); } else p.set(d < 0 ? hx - 5 : hx + 4, mo + 1, W); }
  // cresta de púas por la cabeza y la espalda
  const H = Q.horn; for (let k = 0; k < 4; k++) { const x = side ? hx - d * (2 + k * 2) : hx - 1 + (k % 2), y = top + 1 + k * (side ? 2 : 0); if (side || k < 2) { p.set(x, y - 1, H[2]); p.set(x, y - 2, H[3]); } }
  // cuernos más largos
  for (const s of side ? [-d] : [-1, 1]) { const bx = hx + s * Math.round(m.hrx * 0.45) - (side ? d * 2 : 0) + s * 3; for (let k = 0; k < 3; k++) { p.set(bx + s * k - (side ? d * k : 0), top - 3 - k, k === 2 ? H[3] : H[2]); } } }
{ const _hk = heroKey; heroKey = function (cls, app) { const k = _hk.apply(this, arguments); return app && app.drg2 ? k + '|drg2' : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app) { const L = _hl.apply(this, arguments); if (L && app && app.drg2) L.drg2 = 1; return L; }; }
{ const _n = normApp; normApp = function (a) { const o = _n.apply(this, arguments); if (a && a.drg2) o.drg2 = 1; return o; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (L && L.drg2) try { const tg = p.tg; if (p.t) p.tg = 5; drgHybrid2(p, L, dir, anim, f); p.tg = tg; } catch (e) { console.warn(e); } return r; }; }
