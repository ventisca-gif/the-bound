// MUESTRA TEMPORAL (no se publica): Mitad Dragón y Forma de Dragón
const DRG = { sc: ['#4a0a08', '#8a1a10', '#c83a1a', '#f0702a', '#ffb050'], bel: ['#8a5a1a', '#c89a3a', '#f0d070', '#fff0b0'], horn: ['#3a2a1a', '#8a7a5a', '#d8ccb0', '#f8f0e0'], wing: ['#3a0806', '#6a140c', '#a02a14', '#d8502a'], eye: '#ffd040' };
const dC = a => a.map(h => C(h));
function drgOverlay(p, L, dir, anim, f) { const m = p.meta; if (!m || m.hrx === undefined) return; const S = dC(DRG.sc), H = dC(DRG.horn), Wn = dC(DRG.wing), B = dC(DRG.bel);
  const hx = Math.round(m.hx), top = Math.round(m.headTop), side = m.side, up = m.up, d = m.d, empty = (x, y) => !uA(p.get(x, y)), behind = (x, y, c) => { if (empty(x, y)) p.set(x, y, c); };
  // alas pequeñas (detrás)
  const sy = Math.round(m.shY), flap = anim === 'walk' ? [0, -1, -2, -1][f % 4] : 0;
  for (const s of side ? [-d] : [-1, 1]) { const x0 = side ? Math.round(m.cx) - d * 2 : (s < 0 ? Math.round(m.shL) : Math.round(m.shR)); for (let k = 0; k < 9; k++) { const x = x0 + s * k, yt = sy - 4 - Math.round(k * 0.9) + flap, yb = sy + 4 - Math.round(k * 0.35) - (k % 3 === 2 ? 1 : 0); for (let y = yt; y <= yb; y++) { const c = y === yt ? H[1] : k % 3 === 0 ? Wn[0] : y < yt + 2 ? Wn[3] : Wn[2]; if (up) p.set(x, y, c); else behind(x, y, c); } } }
  // cola gruesa con púas
  const tail = up ? [[0, 0], [0, 2], [1, 4], [2, 6], [3, 8], [4, 9]] : side ? [[-d * 2, 0], [-d * 4, 0], [-d * 6, -1], [-d * 8, -3], [-d * 9, -5], [-d * 10, -6]] : [[5, 1], [7, 1], [9, 0], [10, -2], [11, -4]];
  const tx0 = Math.round(m.cx), ty0 = Math.round(m.legTop) - 1, wag = anim === 'walk' ? (f % 2 ? 1 : -1) : 0;
  tail.forEach(([dx, dy], k) => { const x = tx0 + dx + (k > 2 ? wag : 0), y = ty0 + dy, rr = Math.max(1, 2 - Math.floor(k / 3)); for (let yy = -rr; yy <= rr; yy++) for (let xx = -rr; xx <= rr; xx++) { if (xx * xx + yy * yy > rr * rr + 1) continue; const c = yy > 0 && !up ? B[1] : yy < 0 ? S[3] : S[2]; if (up) p.set(x + xx, y + yy, c); else behind(x + xx, y + yy, c); } if (k % 2 === 1) (up ? p.set.bind(p) : behind)(x, y - rr - 1, H[2]); });
  // cuernos
  for (const s of side ? [-d] : [-1, 1]) { const bx = hx + s * Math.round(m.hrx * 0.45) - (side ? d * 2 : 0); const pts = [[0, 0], [0, -1], [s * 1, -2], [s * 1, -3], [s * 2, -4], [s * 3, -4]]; pts.forEach(([dx, dy], k) => { p.set(bx + dx - (side ? d * Math.floor(k / 2) : 0), top + 1 + dy, k < 2 ? H[1] : k < 4 ? H[2] : H[3]); if (k < 3) p.set(bx + dx + s - (side ? d * Math.floor(k / 2) : 0), top + 1 + dy, H[1]); }); }
  // escamas en las mejillas y ojos dorados de pupila fina
  if (!up) { const ey = Math.round(m.ey); const cheeks = side ? [m.eyes[0] - d * 2] : [m.eyes[0] - 2, m.eyes[1] + 3]; for (const x of cheeks) { p.set(x, ey + 2, S[2]); p.set(x + 1, ey + 3, S[3]); p.set(x, ey + 4, S[2]); }
    for (const ex of m.eyes) { p.set(ex, ey, C(DRG.eye)); p.set(ex + (side ? 0 : 1), ey, C(DRG.eye)); p.set(ex + (side ? 0 : 1), ey + 1, C('#1a0a04')); } } }
// Forma de Dragón (a cuatro patas, con alas), 80×64
function drgForm(dir, a, f) { const p = new Pix(80, 64), S = dC(DRG.sc), B = dC(DRG.bel), H = dC(DRG.horn), Wn = dC(DRG.wing), eye = C(DRG.eye), gy = 58, cx = 40, side = dir === 'left' || dir === 'right', up = dir === 'up';
  const flap = a === 'fly' ? -8 : a === 'walk' ? [0, -2, -4, -2][f % 4] : 0, bob = a === 'walk' ? [0, 1, 0, 1][f % 4] : 0, fire = a === 'atk';
  const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const wing = (x0, y0, s, sc) => { sc = sc || 1; const el = [x0 + s * 9 * sc, y0 - 13 * sc + flap], tips = [[x0 + s * 26 * sc, y0 - 18 * sc + flap * 1.3], [x0 + s * 30 * sc, y0 - 3 * sc + flap * 0.6], [x0 + s * 22 * sc, y0 + 9 * sc], [x0 + s * 8 * sc, y0 + 10 * sc]], poly = [[x0, y0], el].concat(tips);
    const xs = poly.map(q => q[0]), ys = poly.map(q => q[1]); for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++) for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs); x++) { if (!inPoly(x + 0.5, y + 0.5, poly)) continue; let cut = false; for (let i = 0; i < tips.length - 1; i++) { const mx = (tips[i][0] + tips[i + 1][0]) / 2, my = (tips[i][1] + tips[i + 1][1]) / 2, ox = mx - (el[0] - mx) * 0.12, oy = my - (el[1] - my) * 0.12; if ((x - ox) ** 2 + (y - oy) ** 2 < (5 * sc) ** 2) cut = true; } if (cut) continue; const t = Math.hypot(x - x0, y - y0) / (30 * sc); p.set(x, y, t > 0.75 ? Wn[3] : t > 0.45 ? Wn[2] : Wn[1]); }
    p.line(x0, y0, el[0], el[1], H[1]); p.line(x0, y0 + 1, el[0], el[1] + 1, Wn[0]); for (const t of tips.slice(0, 3)) { p.line(el[0], el[1], Math.round(t[0]), Math.round(t[1]), Wn[0]); } p.set(el[0], el[1] - 1, H[3]); p.set(el[0] + s, el[1] - 1, H[2]); };
  if (side) { const L_ = dir === 'left' ? 1 : -1, bx = cx + 6 * L_ * -1, by = gy - 20 - bob;
    wing(bx - 6 * L_, by - 8, L_, 0.85);
    for (let i = 0; i < 9; i++) { const t = i / 8, x = bx - L_ * (-14 - 18 * t), y = by + 2 - 8 * Math.sin(t * 2.2); p.ball(Math.round(x), Math.round(y), Math.round(6 - t * 4), Math.round(5 - t * 3), S); if (i % 2) p.set(Math.round(x), Math.round(y - 6 + t * 3), H[2]); }
    for (const [ox, ph] of [[-8, 0], [10, 1]]) { const sw = a === 'walk' ? (((f + ph) % 2) ? 3 : -3) : 0; p.rect(bx + L_ * ox * -1 + sw, by + 6, 5, gy - by - 7, S[1]); p.rect(bx + L_ * ox * -1 + sw - 1, gy - 2, 7, 3, S[0]); }
    p.ball(bx, by, 17, 10, S); p.ell(bx, by + 6, 13, 3, B[2]); for (let k = -12; k <= 12; k += 4) p.set(bx + k, by + 6, B[1]);
    for (const [ox, ph] of [[-12, 1], [8, 0]]) { const sw = a === 'walk' ? (((f + ph) % 2) ? 3 : -3) : 0; p.rect(bx - L_ * ox + sw, by + 6, 5, gy - by - 6, S[2]); p.rect(bx - L_ * ox + sw - 1, gy - 2, 7, 3, S[1]); for (let c = 0; c < 3; c++) p.set(bx - L_ * ox + sw + c * 2 - 1, gy, H[3]); }
    for (let k = -14; k <= 14; k += 5) { p.set(bx + k, by - 10, H[2]); p.set(bx + k, by - 11, H[3]); }
    wing(bx - 10 * L_, by - 10, L_);
    for (let i = 0; i < 6; i++) { const t = i / 5; p.ball(Math.round(bx - L_ * (12 + t * 9)), Math.round(by - 4 - t * 12), Math.round(6 - t * 1.5), Math.round(6 - t), S); if (i % 2 === 0) { p.set(Math.round(bx - L_ * (10 + t * 9)), Math.round(by - 10 - t * 12), H[2]); } }
    const hx = bx - L_ * 23, hy = by - 18 + (fire ? 1 : 0); p.ball(hx, hy, 6, 5, S); p.ball(hx - L_ * 6, hy + 1, 6, 3.5, S); p.ell(hx - L_ * 6, hy + 3, 5, 1.2, B[2]);
    if (fire) { p.ball(hx - L_ * 5, hy + 6, 5, 2, S); p.hl(Math.min(hx - L_ * 10, hx - L_ * 1), hy + 4, 9, C('#3a0a08')); } else p.hl(Math.min(hx - L_ * 11, hx - L_ * 2), hy + 4, 9, S[0]);
    p.set(hx - L_ * 11, hy, C('#1a0a04')); p.rect(hx - L_ * 1 - 1, hy - 2, 3, 2, eye); p.set(hx - L_ * 1, hy - 2, C('#1a0a04')); p.hl(hx - L_ * 1 - 2, hy - 3, 5, S[0]);
    for (const k of [0, 1, 2, 3, 4]) { p.set(hx + L_ * (3 + k), hy - 3 - Math.floor(k * 0.7), H[2]); p.set(hx + L_ * (3 + k), hy - 2 - Math.floor(k * 0.7), H[1]); } p.set(hx + L_ * 8, hy - 6, H[3]);
    if (fire) for (let k = 0; k < 22; k++) { const x = hx - L_ * (12 + k), y = hy + 5 + Math.round(Math.sin(k * 0.9) * (k / 6)); const r = 1 + Math.floor(k / 6); for (let yy = -r; yy <= r; yy++) p.set(x, y + yy, C(k < 4 ? '#fff4b0' : k < 12 ? '#ffb040' : '#e8402a')); } }
  else { const by = gy - 22 - bob; wing(cx - 9, by - 4, -1, 0.9); wing(cx + 9, by - 4, 1, 0.9);
    if (up) { for (let i = 0; i < 6; i++) p.ball(cx + Math.round(Math.sin(i) * 2), by + 10 + i * 3, 5 - Math.floor(i / 2), 3, S); }
    for (const ox of [-12, 8]) { p.rect(cx + ox, by + 6, 5, gy - by - 6, S[2]); p.rect(cx + ox - 1, gy - 2, 7, 3, S[1]); }
    p.ball(cx, by, 15, 11, S); if (!up) { p.ell(cx, by + 3, 8, 7, B[2]); for (let k = -4; k <= 6; k += 3) p.hl(cx - 5, by + k, 10, B[1]); }
    for (let k = -8; k <= 8; k += 4) p.set(cx + k, by - 11, H[3]);
    const hy = by - 16; p.ball(cx, hy, 8, 7, S); if (!up) { p.ball(cx, hy + 4, 6, 4, S); p.ell(cx, hy + 6, 4, 1.5, B[2]); for (const s of [-1, 1]) { p.rect(cx + s * 4 - 1, hy - 1, 3, 2, eye); p.set(cx + s * 4, hy - 1, C('#1a0a04')); p.set(cx + s * 2, hy + 5, C('#1a0a04')); } if (fire) for (let k = 0; k < 10; k++) p.ell(cx, hy + 9 + k, 2 + k / 2, 1.5, C(k < 3 ? '#fff4b0' : k < 7 ? '#ffb040' : '#e8402a')); }
    for (const s of [-1, 1]) for (const k of [0, 1, 2, 3]) { p.set(cx + s * (5 + Math.floor(k / 2)), hy - 6 - k, H[2]); p.set(cx + s * (6 + Math.floor(k / 2)), hy - 6 - k, H[3]); } }
  p.outline(OUTL); return p; }
{ const _hk = heroKey; heroKey = function (cls, app) { const k = _hk.apply(this, arguments); return app && app.drg ? k + '|drg' : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app) { const L = _hl.apply(this, arguments); if (L && app && app.drg) L.drg = 1; return L; }; }
{ const _n = normApp; normApp = function (a) { const o = _n.apply(this, arguments); if (a && a.drg) o.drg = 1; return o; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); if (L && L.drg) try { const tg = p.tg; if (p.t) p.tg = 5; drgOverlay(p, L, dir, anim, f); p.tg = tg; } catch (e) { console.warn(e); } return r; }; }
