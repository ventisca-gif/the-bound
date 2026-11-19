// MUESTRA TEMPORAL (no se publica): Hijo del Mar y Guardián de Hielo
function smpMar(p, L, dir, anim, f, st) { const m = p.meta; if (!m || m.hrx === undefined) return; const SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), T = [C('#0a3a4a'), C('#1a6a7a'), C('#2aa0a8'), C('#6ae0d0'), C('#c8fff4')];
  const side = m.side, up = m.up, d = m.d, hx = Math.round(m.hx), ey = Math.round(m.ey), lt = Math.round(m.legTop), base = Math.round(m.base), cx = Math.round(m.cx);
  // escamas de pez en la piel (mejillas, cuello, brazos)
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!SKN.has(c)) continue; if (y > ey + 1 && ((x + (Math.floor(y / 2) % 2) * 2) % 4 === 0 || st === 2)) p.set(x, y, st === 2 ? uMix(c, T[2 + ((x + y) % 2)], 0.55) : uMix(c, T[3], 0.5)); }
  // aletas en las orejas
  for (const s of side ? [-d] : [-1, 1]) { const x0 = hx + s * Math.round(m.hrx) - (s < 0 ? 1 : 0); for (let k = 0; k < 4; k++) { p.set(x0 + s * k, ey - 1 + k, k % 2 ? T[2] : T[3]); p.set(x0 + s * k, ey + k, T[1]); } }
  if (!up) for (const ex of m.eyes || []) { p.set(ex, ey, T[3]); p.set(ex + (side ? 0 : 1), ey, T[4]); }
  // aletas en los antebrazos (forma)
  if (st >= 1) for (const s of side ? [-d] : [-1, 1]) { const ax = side ? cx - d * 3 : (s < 0 ? Math.round(m.shL) - 1 : Math.round(m.shR) + 1), ay = Math.round(m.shY) + 4; for (let k = 0; k < 5; k++) { p.set(ax + s * (1 + (k >> 1)), ay + k, T[3]); p.set(ax + s * (2 + (k >> 1)), ay + k, T[2]); } }
  // cola de sirena (forma plena): sin piernas
  if (st === 2) { const hw = Math.ceil(m.tw / 2) + 1; for (let y = lt; y < p.h; y++) for (let x = 0; x < p.w; x++) { const t = (y - lt) / Math.max(1, base - lt + 3), w = hw * (1 - t * 0.55), sw = Math.round(Math.sin(t * 3 + (f || 0) * 0.8) * 2 * t); const inn = Math.abs(x - cx - sw) <= w; if (y > base) { const fin = Math.abs(x - cx - sw) <= hw + 2 - (y - base) * 2 && y <= base + 3; p.set(x, y, fin ? T[(x + y) % 2 ? 3 : 2] : 0); continue; } if (inn) p.set(x, y, (x + Math.floor(y / 2)) % 3 === 0 ? T[1] : t > 0.6 ? T[2] : T[3]); else if (uA(p.get(x, y)) && y > lt + 1) p.set(x, y, 0); } } }
function smpHielo(p, L, dir, anim, f, st) { const m = p.meta; if (!m || m.hrx === undefined) return; const SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), I = [C('#3a6a9a'), C('#6aa8d8'), C('#a8e0ff'), C('#e0f8ff'), C('#ffffff')];
  const side = m.side, up = m.up, d = m.d, hx = Math.round(m.hx), ey = Math.round(m.ey), top = Math.round(m.headTop), sy = Math.round(m.shY);
  // piel cristalina: placas de hielo
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!uA(c)) continue; const sk = SKN.has(c); if (sk && ((x * 3 + y * 5) % 7 < (st === 2 ? 5 : 2))) p.set(x, y, uMix(c, I[(x + y) % 2 ? 2 : 3], 0.6)); else if (!sk && st === 2 && y > top + 4 && (x + y) % 5 === 0) p.set(x, y, uMix(c, I[2], 0.5)); }
  if (!up) for (const ex of m.eyes || []) { p.set(ex, ey, I[3]); p.set(ex + (side ? 0 : 1), ey, I[4]); p.blend(ex, ey + 1, I[2], 0.6); }
  // cristales en los hombros
  for (const s of side ? [-d] : [-1, 1]) { const x0 = side ? Math.round(m.cx) - d : (s < 0 ? Math.round(m.shL) : Math.round(m.shR)); const n = st === 2 ? 4 : st === 1 ? 3 : 1; for (let k = 0; k < n; k++) for (let j = 0; j < 4 - k; j++) p.set(x0 + s * k, sy - 1 - j - k, j === 3 - k ? I[4] : I[2 + (j % 2)]); }
  // corona de hielo (forma) y escarcha que cae
  if (st >= 1) { for (let k = -3; k <= 3; k++) { const h = 3 - Math.abs(k) + (k % 2 ? 0 : 2) + (st === 2 ? 1 : 0); for (let j = 0; j < h; j++) p.set(hx + k * 2, top - j, j === h - 1 ? I[4] : I[2]); } }
  if (st === 2) for (let i = 0; i < 6; i++) { const x = hx - 12 + ((i * 29 + (f || 0) * 3) % 25), y = sy + ((i * 11) % 20); p.set(x, y, I[4]); p.set(x - 1, y, I[3]); p.set(x + 1, y, I[3]); p.set(x, y - 1, I[3]); p.set(x, y + 1, I[3]); } }
{ const _hk = heroKey; heroKey = function (cls, app) { const k = _hk.apply(this, arguments); return app && app.smp ? k + '|smp' + app.smp : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app) { const L = _hl.apply(this, arguments); if (L && app && app.smp) L.smp = app.smp; return L; }; }
{ const _n = normApp; normApp = function (a) { const o = _n.apply(this, arguments); if (a && a.smp) o.smp = a.smp; return o; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (L && L.smp) try { const tg = p.tg; if (p.t) p.tg = 5; const [k, s] = [L.smp[0], +L.smp[1]]; if (k === 'm') smpMar(p, L, dir, anim, f, s); if (k === 'h') smpHielo(p, L, dir, anim, f, s); p.tg = tg; } catch (e) { console.warn(e); } return r; }; }
