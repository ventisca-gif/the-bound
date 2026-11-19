// MUESTRA TEMPORAL (no se publica): fusión de formas «Dragón de Hielo» (dragón + Guardián de Hielo), forma secreta del nivel 500.
// Escamas, alas, cuernos y cola del dragón, pero de hielo (no del color del pelo); ojos de hielo, cristales en los
// hombros y escarcha. Plena: el dragón a cuatro patas de hielo.
const FUS_HAIR = ['#24507a', '#3a7ab0', '#6ab0e0', '#a8e0ff', '#e8f8ff'];
{ const _dp = drgPal; drgPal = function (L) { if (G._fus) return _dp.call(this, Object.assign({}, L, { hair: FUS_HAIR.map(c => C(c)) })); return _dp.apply(this, arguments); }; drgPal.cache = _dp.cache; }
{ const _hk = heroKey; heroKey = function () { const k = _hk.apply(this, arguments); return G._fus ? k + '|fus' : k; }; }
function fusIce(p, L, dir, anim, f, F) { const m = p.meta; if (!m || m.hrx === undefined) return; const I = HIE_COL.map(c => C(c)), side = m.side, up = m.up, d = m.d, ey = Math.round(m.ey), sy = Math.round(m.shY), hx = Math.round(m.hx);
  if (!up) for (const ex of m.eyes || []) { p.set(ex, ey, I[3]); p.set(ex + (side ? 0 : 1), ey, I[4]); p.blend(ex, ey + 1, I[2], 0.6); }
  for (const s of side ? [-d] : [-1, 1]) { const x0 = side ? Math.round(m.cx) - d : (s < 0 ? Math.round(m.shL) : Math.round(m.shR)); for (let k = 0; k < 3; k++) for (let j = 0; j < 4 - k; j++) p.set(x0 + s * k, sy - 1 - j - k, j === 3 - k ? I[4] : I[2 + (j % 2)]); }
  if (F === 3) iceClothCrystals(p, L, 1);
  // aliento helado y escarcha que cae
  const n = F === 3 ? 6 : 3; for (let i = 0; i < n; i++) { const x = hx - 12 + ((i * 29 + (f || 0) * 3) % 25), y = sy + ((i * 11) % 20); p.set(x, y, I[4]); p.set(x - 1, y, I[3]); p.set(x + 1, y, I[3]); p.set(x, y - 1, I[3]); p.set(x, y + 1, I[3]); }
  if (!up) { const mx = side ? hx + d * 6 : hx, my = Math.round(m.hy) + FACE.ey + FACE.mouth + 2; for (let k = 0; k < 3; k++) p.blend(mx + (side ? d * k : (k - 1)), my + (side ? 0 : k), I[4], 0.7 - k * 0.15); } }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (G._fus && L && L.sr === 'dragon' && L.srF !== 2) try { const tg = p.tg; if (p.t) p.tg = 5; fusIce(p, L, dir, anim, f, L.srF); p.tg = tg; } catch (e) { console.warn(e); } return r; }; }
