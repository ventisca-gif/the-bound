// MUESTRA TEMPORAL (no se publica): transformación de vapor («Sangre Hirviente»)
// Piel roja pálida y vapor que sale del cuerpo. El vapor va en una capa de efectos aparte (no toca el sprite):
// unas nubes se pintan detrás del personaje y otras delante. st: 0 = mitad, 1 = forma.
const VAP_RED = C('#e8766c'), VAP_DEEP = C('#a03a3c');
// piel: se cambia la paleta (así también la usa el detalle HD)
function vapLook(L, st) { const S0 = Array.from(L.skin).map(c => typeof c === 'string' ? C(c) : c), n = S0.length;
  L.skin = S0.map((c, i) => st >= 1 ? uMix(c, i === 0 ? VAP_DEEP : VAP_RED, i === 0 ? 0.62 : i === n - 1 ? 0.45 : 0.66) : uMix(c, VAP_RED, 0.14)); return L; }
// mejillas encendidas (mitad y forma)
function vapCheeks(p, st) { const m = p.meta; if (!m || m.up || m.hrx === undefined) return; const ey = Math.round(m.ey) + 2, c = st >= 1 ? VAP_DEEP : VAP_RED;
  const xs = m.side ? [m.eyes[0] - m.d * 1] : [m.eyes[0] - 1, m.eyes[1] + 2]; for (const x of xs) { p.set(x, ey, c); p.set(x + 1, ey, c); } }
// fuentes: [x, y, fuerza, dirección horizontal]
function vapSources(m, st) { const s = [[m.hx, m.headTop, 1.1, 0]];
  if (m.side) s.push([m.cx - m.d * 3, m.shY - 1, 1, -m.d], [m.cx + m.d, m.shY + 5, 0.7, m.d]);
  else s.push([m.shL - 1, m.shY - 1, 1, -1], [m.shR + 1, m.shY - 1, 1, 1], [m.shL - 2, m.shY + 6, 0.7, -1], [m.shR + 2, m.shY + 6, 0.7, 1]);
  return st >= 1 ? s : s.slice(0, 3); }
// vapor: front = false pinta las nubes de detrás, true las de delante
function vapDraw(X, m, ox, oy, S, t, st, front) { const src = vapSources(m, st), N = st >= 1 ? 6 : 3, life = st >= 1 ? 1.1 : 1.7;
  src.forEach(([sx, sy, w, dx], si) => { for (let k = 0; k < N; k++) { const ph = ((t / life) + k / N + si * 0.29) % 1; if ((k + si) % 2 === (front ? 1 : 0)) continue;
    const r = (1.2 + ph * 3.2) * w * (st >= 1 ? 1 : 0.75), x = sx + dx * ph * 4 + Math.sin(ph * 6 + si + k) * 1.2, y = sy - ph * (st >= 1 ? 18 : 10), a = Math.pow(1 - ph, 1.4) * (st >= 1 ? 0.8 : 0.5) * Math.min(1, ph / 0.1);
    if (a < 0.04) continue; const R = Math.max(1, Math.round(r));
    for (const [rr, aa, col] of [[R + 1, a * 0.45, '236,232,240'], [R, a, '255,250,250']]) { X.fillStyle = `rgba(${col},${aa.toFixed(3)})`;
      for (let yy = -rr; yy <= rr; yy++) for (let xx = -rr; xx <= rr; xx++) if (xx * xx + yy * yy <= rr * rr) X.fillRect(Math.round(ox + (x + xx) * S), Math.round(oy + (y + yy) * S), S, S); } } }); }
