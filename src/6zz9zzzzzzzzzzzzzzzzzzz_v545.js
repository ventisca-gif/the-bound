// ================= v5.45: ESCAMAS DEL DRAGÓN ENCIMA DE CUALQUIER ROPA =================
// Sergio: «en las formas híbridas, que las escamas se pongan encima de tu ropa, cualquiera que uses».
// Híbrida (srF 1): escamas en brazos y hombros encima de la ropa. Híbrido 2.0 (srF 3): brazos, hombros, pecho y piernas.
// Usa las capas del dibujo (p.t: 1 piernas, 2 torso, 3 brazos) cuando están; si no, la zona del cuerpo con los anclajes.
function drgClothScales(p, L, F) { const m = p.meta; if (!m || m.torsoTop === undefined) return; const Q = drgPal(L), SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), HAIR = new Set(Array.from(L.hair || []).map(c => typeof c === 'string' ? C(c) : c));
  const t0 = Math.round(m.torsoTop), th = Math.round(m.th || 8), lt = Math.round(m.legTop), base = Math.round(m.base), tx0 = Math.round(m.tx0), tw = Math.round(m.tw || 10), two = F === 3;
  const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
  for (let y = t0; y <= base; y++) for (let x = 0; x < p.w; x++) { const i = y * p.w + x, c = p.d[i]; if (!uA(c) || SKN.has(c) || HAIR.has(c)) continue; const tg = p.t ? p.t[i] : 0;
    let zone = tg === 3 ? 'arm' : tg === 2 ? 'torso' : tg === 1 ? 'leg' : 0; if (tg === 8 || tg === 4 || tg === 6 || tg === 7) continue;
    if (!p.t) zone = y >= lt ? 'leg' : (x < tx0 || x >= tx0 + tw) ? 'arm' : 'torso';
    let dens = 0; const ry = (y - t0) / Math.max(1, th);
    if (zone === 'arm') dens = two ? 0.85 : 0.6; else if (zone === 'torso') dens = (x <= tx0 + 1 || x >= tx0 + tw - 2 || ry < 0.3) ? (two ? 0.8 : 0.5) : (two ? 0.45 : 0); else if (zone === 'leg') dens = two ? 0.5 : 0;
    if (!dens || (hash(x, y) % 100) / 100 > dens) continue;
    const row = Math.floor(y / 2), sx = (x + (row % 2) * 2) % 4, sc = sx === 0 ? Q.sc[1] : (y % 2 === 0 && sx === 2) ? Q.sc[4] : Q.sc[2]; p.d[i] = uMix(c, sc, 0.72) | 0xff000000; } }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (L && L.sr === 'dragon' && (L.srF === 1 || L.srF === 3)) try { drgClothScales(p, L, L.srF); } catch (e) { if (typeof errOnce === 'function') errOnce('drgcl', e); } return r; }; }
