// MUESTRA TEMPORAL (no se publica): Alado Caído y Eco sin Pintar
function smpAlado(p, L, dir, anim, f, full) { const m = p.meta; if (!m || m.hrx === undefined) return; const side = m.side, up = m.up, d = m.d, hx = Math.round(m.hx), top = Math.round(m.headTop), sy = Math.round(m.shY), empty = (x, y) => !uA(p.get(x, y));
  const W = [C('#8a8070'), C('#c8c0b0'), C('#f4f0e4'), C('#fffaf0')], Gd = C('#ffd860'), Gr = C('#7a7480');
  // alas de plumas (una con plumas grises: está caída)
  const len = full ? 14 : 11;
  for (const s of side ? [-d] : [-1, 1]) { const x0 = side ? Math.round(m.cx) - d * 2 : (s < 0 ? Math.round(m.shL) : Math.round(m.shR)), broken = s > 0;
    for (let k = 0; k < len; k++) { const x = x0 + s * k, yt = sy - 5 - Math.round(k * (full ? 1.1 : 0.6)) + (full ? Math.round(Math.sin(k / len * 3.14) * -2) : 0), yb = sy + 3 + Math.round(k * 0.35) + (k % 3 === 2 ? 2 : 0);
      for (let y = yt; y <= yb; y++) { let c = y === yt ? W[3] : (y - yt) % 3 === 0 ? W[1] : W[2]; if (broken && k > len * 0.55 && (k + y) % 3 === 0) c = Gr; if (k === len - 1 && y > yt + 1 && (y % 2)) continue; if (up || empty(x, y)) p.set(x, y, c); } } }
  // aureola rota encima de la cabeza
  const hy = top - (full ? 4 : 3), rx = Math.round(m.hrx * 0.7); for (let a = 0; a < 26; a++) { const t = a / 26 * Math.PI * 2; if (t > 4.6 && t < 5.4) continue; const x = hx + Math.round(Math.cos(t) * rx), y = hy + Math.round(Math.sin(t) * 1.5); p.set(x, y, a % 5 === 0 ? C('#fff4b0') : Gd); }
  // ojos de luz
  if (!up) for (const ex of m.eyes || []) { const ey = Math.round(m.ey); p.set(ex, ey, C('#fff8d0')); p.set(ex + (side ? 0 : 1), ey, C('#ffe080')); if (full) { p.blend(ex, ey + 1, C('#fff4b0'), 0.6); p.blend(ex + (side ? 0 : 1), ey + 1, C('#fff4b0'), 0.6); } }
  if (full) { for (let i = 0; i < 6; i++) { const x = hx - 10 + ((i * 37 + (f || 0) * 5) % 21), y = sy + ((i * 13) % 18); p.set(x, y, W[3]); p.set(x, y + 1, W[1]); } } }
function smpEco(p, L, dir, anim, f, full) { const m = p.meta; if (!m || m.hrx === undefined) return; const SKN = new Set(Array.from(L.skin || []).map(c => typeof c === 'string' ? C(c) : c)), ink = C('#1a1a24'), paper = [C('#d8d4cc'), C('#ecebe6'), C('#fbfaf6')];
  const side = m.side, up = m.up, ey = Math.round(m.ey), top = Math.round(m.headTop), chin = Math.round(m.chin || m.hy + 8);
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!uA(c)) continue; const isSkin = SKN.has(c);
    if (isSkin) { const l = (uR(c) + uG(c) + uB(c)) / 765; p.set(x, y, l > 0.62 ? paper[2] : l > 0.5 ? paper[1] : paper[0]); if ((x + y * 2) % 7 === 0) p.set(x, y, C('#b8b4ac')); }
    else if (full) { const l = (uR(c) * 0.3 + uG(c) * 0.59 + uB(c) * 0.11) / 255; p.set(x, y, l < 0.22 ? ink : l < 0.45 ? C('#6a6a74') : l < 0.7 ? C('#b8b6b0') : paper[2]); }
    else if (y > chin && (x + y) % 9 === 0) p.set(x, y, uMix(c, paper[1], 0.6)); }
  // contorno de tinta y gotas que caen
  if (full) { const q = new Uint32Array(p.d); for (let y = 1; y < p.h - 1; y++) for (let x = 1; x < p.w - 1; x++) { if (uA(q[y * p.w + x])) continue; if (uA(q[y * p.w + x + 1]) || uA(q[y * p.w + x - 1]) || uA(q[(y + 1) * p.w + x]) || uA(q[(y - 1) * p.w + x])) p.set(x, y, ink); } }
  for (let i = 0; i < (full ? 5 : 2); i++) { const x = Math.round(m.tx0 + ((i * 7 + 3) % Math.max(4, m.tw))), y0 = Math.round(m.torsoTop + m.th) + (i % 3); for (let k = 0; k < 2 + (i % 3); k++) p.set(x, y0 + k, ink); }
  // ojos vacíos de lienzo
  if (!up) for (const ex of m.eyes || []) { p.set(ex, ey, paper[2]); p.set(ex + (side ? 0 : 1), ey, paper[2]); p.set(ex, ey + 1, full ? ink : paper[1]); p.set(ex + (side ? 0 : 1), ey + 1, full ? ink : paper[1]); }
  // trazos de pincel flotando (forma)
  if (full) { const cx = Math.round(m.cx); for (let k = 0; k < 9; k++) { p.set(cx - 12 + k, top - 2 + Math.round(Math.sin(k * 0.7) * 2), ink); p.set(cx + 4 + k, top + 2 + Math.round(Math.cos(k * 0.7) * 2), C('#6a6a74')); } } }
{ const _hk = heroKey; heroKey = function (cls, app) { const k = _hk.apply(this, arguments); return app && app.smp ? k + '|smp' + app.smp : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app) { const L = _hl.apply(this, arguments); if (L && app && app.smp) L.smp = app.smp; return L; }; }
{ const _n = normApp; normApp = function (a) { const o = _n.apply(this, arguments); if (a && a.smp) o.smp = a.smp; return o; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (L && L.smp) try { const tg = p.tg; if (p.t) p.tg = 5; if (L.smp === 'a1') smpAlado(p, L, dir, anim, f, 0); if (L.smp === 'a2') smpAlado(p, L, dir, anim, f, 1); if (L.smp === 'e1') smpEco(p, L, dir, anim, f, 0); if (L.smp === 'e2') smpEco(p, L, dir, anim, f, 1); p.tg = tg; } catch (e) { console.warn(e); } return r; }; }
