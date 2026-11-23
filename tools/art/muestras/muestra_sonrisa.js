// MUESTRA TEMPORAL (no se publica): «Sonrisa Carmesí», transformación original.
// Idea de Sergio: pelo blanco salvaje, máscara de sonrisa en la boca, rayas en la cara y ojos rojos.
// Versión propia (no copia): pelo blanco con raíz carmesí y puntas en llamas hacia atrás, máscara negra con
// sonrisa de puntadas en zigzag y costura carmesí, dos lágrimas carmesí verticales bajo los ojos y una marca
// en la frente, ojos rojos con pupila de rendija. Forma completa: bufanda rota carmesí y brasas.
// s1 = media forma (pelo, ojos, marcas), s2 = forma completa (+ máscara, bufanda, brasas).
const SMP_HAIR = pal(['#5a4a5e', '#b4b0c4', '#e6e6f0', '#ffffff']);
const SMP_CR = [C('#3a0814'), C('#8a1430'), C('#d8264a'), C('#ff6a8a')];
function smpSonrisa(p, L, dir, anim, f, full) { const m = p.meta; if (!m || m.hrx === undefined) return; const side = m.side, up = m.up, d = m.d, hx = Math.round(m.hx), top = Math.round(m.headTop), ey = Math.round(m.hy) + (L.btS && L.btS.ey !== undefined ? L.btS.ey : FACE.ey), empty = (x, y) => !uA(p.get(x, y));
  const W = C('#ffffff'), Wd = C('#d8d8e4'), K = C('#141018'), K2 = C('#241c26');
  // llamas de pelo hacia arriba y atrás: 5 puntas rellenas (blanco → rosa → carmesí) con contorno
  const sp = full ? [4, 6, 5, 7, 4] : [3, 4, 4, 5, 3], hw = Math.round(m.hrx), drawn = [];
  const fl = sp.map((h, i) => { const bx = side ? hx - d * Math.round(hw * 0.5) + (i - 2) * 2 * -d * -1 : hx - hw + 2 + Math.round(i * (2 * hw - 4) / (sp.length - 1)); let base = top + 2; for (let y = 0; y <= top + 6; y++) if (!empty(bx, y)) { base = y; break; } return { h: side ? Math.max(2, h - 1) : h, bx, base, lean: side ? -d * 0.9 : (i - 2) * 0.25 }; });
  for (const F of fl) { const h = F.h, bx = F.bx, base = F.base, lean = F.lean;
    for (let k = 0; k < h; k++) { const wdt = Math.max(1, Math.round(4 * (1 - k / h) + 0.3)), cxk = bx + lean * k, y = base - k, c = k >= h - 1 ? SMP_CR[2] : k >= h - 3 ? SMP_CR[3] : k % 3 === 1 ? Wd : W;
      for (let w = 0; w < wdt; w++) { const x = Math.round(cxk - (wdt - 1) / 2 + w); if (empty(x, y)) { p.set(x, y, w === 0 && wdt > 1 && k < h - 3 ? Wd : c); drawn.push([x, y]); } } } }
  const OL = C('#2a1424'); for (const [x, y] of drawn) for (const [dx, dy] of [[1, 0], [-1, 0], [0, -1]]) if (y + dy >= 0 && empty(x + dx, y + dy)) p.set(x + dx, y + dy, OL);
  if (up) return;
  const eyes = m.eyes || [];
  // ojos rojos con rendija
  for (const ex of eyes) { p.set(ex, ey, SMP_CR[3]); p.set(ex, ey + 1, SMP_CR[2]); if (!side) { p.set(ex + 1, ey, SMP_CR[2]); p.set(ex + 1, ey + 1, K); } else p.set(ex, ey + 1, K); }
  // lágrimas carmesí verticales bajo cada ojo y marca en la frente
  for (const ex of eyes) { const x = side ? ex : ex + (ex < hx ? 0 : 1); for (let k = 3; k <= (full ? 6 : 5); k++) if (!empty(x, ey + k)) p.set(x, ey + k, k === 3 ? SMP_CR[3] : SMP_CR[2]); }
  if (!side) { p.set(hx, ey - 3, SMP_CR[2]); p.set(hx - 1, ey - 2, SMP_CR[1]); p.set(hx + 1, ey - 2, SMP_CR[1]); }
  if (!full) return;
  // máscara negra de la nariz a la barbilla con sonrisa en zigzag
  const x0 = side ? hx - (d > 0 ? 1 : hw - 2) : hx - hw + 2, x1 = side ? hx + (d > 0 ? hw - 2 : 1) : hx + hw - 2, y0 = ey + 3, y1 = Math.round(m.hy + m.hry) - 1;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (empty(x, y)) continue; p.set(x, y, y === y0 ? K2 : K); }
  const my = Math.round((y0 + y1) / 2), xa = side ? (d > 0 ? hx : x0 + 1) : x0 + 1, xb = side ? (d > 0 ? x1 - 1 : hx) : x1 - 1;
  for (let x = xa; x <= xb; x++) { const t = (x - xa) % 2; p.set(x, my - 1 + t, W); if (x > xa && x < xb) p.set(x, my + (t ? -1 : 1), SMP_CR[1]); }
  p.set(xa - 1, my - 2, SMP_CR[2]); p.set(xb + 1, my - 2, SMP_CR[2]);
  // bufanda rota carmesí al viento
  const sy = Math.round(m.shY) - 1, nx = Math.round(m.cx), dirx = side ? -d : 1, len = 13;
  for (let k = 0; k < len; k++) { const x = nx + dirx * (side ? k : Math.round(k * 0.7)) + (side ? 0 : hw - 2), y = sy + Math.round(Math.sin(k * 0.6 + f) * 1.5) + Math.round(k * 0.25);
    for (let w = 0; w < (k > len - 4 ? 1 : 2); w++) { if (k > 6 && (k + w) % 4 === 0) continue; if (empty(x, y + w)) p.set(x, y + w, w ? SMP_CR[1] : SMP_CR[2]); } }
  // brasas
  for (let k = 0; k < 2; k++) { const x = hx - hw - 3 + ((k * 7 + f * 3) % (2 * hw + 6)), y = top - 3 - ((k * 5 + f * 2) % 7); if (empty(x, y)) p.set(x, y, k % 2 ? SMP_CR[3] : SMP_CR[2]); } }
{ const _hk = heroKey; heroKey = function (cls, app) { const k = _hk.apply(this, arguments); return app && app.smp ? k + '|smp' + app.smp : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app) { const L = _hl.apply(this, arguments); if (L && app && app.smp) { L.smp = app.smp; L.hair = SMP_HAIR; if (normApp(app).g !== 'f') L.hairStyle = 'spiky'; } return L; }; }
{ const _n = normApp; normApp = function (a) { const o = _n.apply(this, arguments); if (a && a.smp) o.smp = a.smp; return o; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (L && L.smp) try { const tg = p.tg; if (p.t) p.tg = 5; smpSonrisa(p, L, dir, anim, f, L.smp === 's2' ? 1 : 0); p.tg = tg; } catch (e) { console.warn(e); } return r; }; }
