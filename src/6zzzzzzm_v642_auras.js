// ================= 6.42: AURAS DE TRANSFORMACIÓN, DESTELLO AL TRANSFORMARSE Y POSE DEL ENGRANAJE 2 =================
// Sergio pidió un aura para cada forma y fusión (solo transformado), un destello de 0,45 s al transformarse que
// desaparece solo y un botón para apagar el aura. Referencias que mandó: Dorado = aura de llamas en punta con el centro
// blanco; Alado = aura angelical (alas de luz celeste y columna blanca); Fantasma = niebla espectral con fantasmitas;
// Engranaje 2 = al transformarse se agacha (piernas abiertas, una mano en la rodilla y el puño en el suelo) echando vapor.
// Todo se dibuja con el canvas encima del mundo (capa separada del sprite) y solo cerca de la cámara.
// 🌀 Transformaciones › «Aura: sí/no» la apaga (P.trAuraOff; también para los demás en el online, gear.na).
// Una forma nueva solo tiene que registrar TR_AURA[clave] y TR_FLASH[clave]; las fusiones usan 'fus_dh', 'fus_bf', 'fus_an'.
const TR_AURA = {}, TR_FLASH = {}, TRF_DUR = 0.45, TR_POSE_DUR = 1.1;
const trR = Math.round, trPh = (t, k, sp) => (t * sp + k * 0.37) % 1;
// bruma en anillo (el centro queda limpio para no tapar al personaje)
function trHaze(x, y, h, rgb, a, sx) { const r = h * 0.72; ctx.save(); ctx.translate(x, y - 18); ctx.scale(sx || 0.7, 1); const g = ctx.createRadialGradient(0, 0, 2, 0, 0, r); g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(0.5, `rgba(${rgb},${a * 0.2})`); g.addColorStop(0.78, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore(); }
// lenguas de fuego (dragón y fusiones): cols = [exterior, interior, punta]
function trFlames(x, y, t, n, hgt, wid, cols, ink) { for (let k = 0; k < n; k++) { const u = k / (n - 1), side = u < 0.5 ? -1 : 1, bx = x + side * (8 + Math.abs(u - 0.5) * 2 * wid), fh = hgt * (0.55 + (1 - Math.abs(u - 0.5) * 2) * 0.45) * (0.75 + Math.sin(t * 12 + k * 2.1) * 0.25), sw = Math.sin(t * 8 + k) * 2.5;
  for (let L = 0; L < 2; L++) { const s = L ? 0.55 : 1; ctx.fillStyle = cols[L]; ctx.beginPath(); ctx.moveTo(bx - 4 * s, y + 3); ctx.quadraticCurveTo(bx - 3 * s, y - fh * s * 0.5, bx + sw, y - fh * s); ctx.quadraticCurveTo(bx + 3 * s, y - fh * s * 0.45, bx + 4 * s, y + 3); ctx.fill(); if (ink && !L) { ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.stroke(); } }
  ctx.fillStyle = cols[2]; ctx.fillRect(trR(bx + sw * 0.5), trR(y - fh * 0.35), 1, 2); } }
function trEmbers(x, y, t, n, h, w, colf) { for (let k = 0; k < n; k++) { const ph = trPh(t, k, 1.1); ctx.fillStyle = colf(k, ph); ctx.fillRect(trR(x + Math.sin(k * 5.3 + ph * 2) * w), trR(y - 6 - ph * h), 1, ph < 0.5 ? 2 : 1); } }
// fantasmita: cabeza redonda, sábana con cola ondulada, ojos y boca oscuros
function trGhost(gx, gy, s, a, t, k) { ctx.fillStyle = `rgba(236,246,250,${a})`; ctx.beginPath(); ctx.arc(gx, gy, 3.4 * s, Math.PI, 0); const w = Math.sin(t * 6 + k) * 1.2;
  ctx.lineTo(gx + 3.4 * s, gy + 4 * s); ctx.quadraticCurveTo(gx + 2.2 * s + w, gy + 6.5 * s, gx + 1 * s, gy + 5 * s); ctx.quadraticCurveTo(gx + w, gy + 8 * s, gx - 1 * s, gy + 5.5 * s); ctx.quadraticCurveTo(gx - 2.4 * s + w, gy + 7 * s, gx - 3.4 * s, gy + 4 * s); ctx.closePath(); ctx.fill();
  ctx.fillStyle = `rgba(236,246,250,${a * 0.35})`; ctx.beginPath(); ctx.ellipse(gx + w, gy + 7.5 * s, 2 * s, 2.5 * s, 0, 0, 7); ctx.fill();
  ctx.fillStyle = `rgba(40,20,60,${Math.min(1, a * 1.2)})`; ctx.fillRect(trR(gx - 1.6 * s), trR(gy - 0.6 * s), 1, 2); ctx.fillRect(trR(gx + 0.8 * s), trR(gy - 0.6 * s), 1, 2); ctx.beginPath(); ctx.ellipse(gx - 0.2 * s, gy + 2.2 * s, 0.7 * s, 1.2 * s, 0, 0, 7); ctx.fill(); }
// alas de luz (ángel): plumas de luz que salen de la espalda y se curvan hacia arriba
function trWings(x, y, t, sz, c1, c2, c3) { for (const sd of [-1, 1]) { const ox = x + sd * 3, oy = y - 26, fl = Math.sin(t * 2.2) * 2;
    const g = ctx.createLinearGradient(ox, oy, ox + sd * 30 * sz, oy - 20 * sz); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ox, oy + 2);
    ctx.bezierCurveTo(ox + sd * 14 * sz, oy - 30 * sz - fl, ox + sd * 34 * sz, oy - 26 * sz - fl, ox + sd * 30 * sz, oy - 4 * sz); ctx.bezierCurveTo(ox + sd * 28 * sz, oy + 14 * sz, ox + sd * 16 * sz, oy + 24 * sz, ox + sd * 4, oy + 18); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 1; for (let k = 0; k < 7; k++) { const q = k / 6, ex = ox + sd * (10 + q * 22) * sz, ey = oy - (24 - q * 10) * sz - fl * (1 - q) + Math.sin(t * 3 + k) * 1.5; ctx.strokeStyle = k % 2 ? c3 : 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.moveTo(ox, oy + 4 + q * 10); ctx.quadraticCurveTo(ox + sd * (6 + q * 10) * sz, oy - 18 * sz + q * 8, ex, ey); ctx.quadraticCurveTo(ex + sd * 3, ey + 8 + q * 6, ex - sd * (2 + q * 4), ey + 14 + q * 10); ctx.stroke(); } } }
function trColumn(x, y, h, rgb, a, w) { const g = ctx.createLinearGradient(x - w, 0, x + w, 0); g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(0.5, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - w, y - h, w * 2, h + 4); }
function trBolt(px, py, dx, t, k, n) { ctx.beginPath(); ctx.moveTo(px, py); for (let s = 0; s < n; s++) { px += dx + Math.sin(t * 40 + s * 3 + k) * 4; py += 5 + Math.cos(t * 33 + s + k) * 3; ctx.lineTo(px, py); } ctx.stroke(); }
function trCrystal(px, py, s, front) { ctx.fillStyle = front ? 'rgba(224,248,255,0.95)' : 'rgba(168,224,255,0.4)'; ctx.beginPath(); ctx.moveTo(px, py - s * 1.7); ctx.lineTo(px + s * 0.75, py); ctx.lineTo(px, py + s * 1.7); ctx.lineTo(px - s * 0.75, py); ctx.closePath(); ctx.fill(); if (front) { ctx.fillStyle = 'rgba(120,190,240,0.9)'; ctx.beginPath(); ctx.moveTo(px, py - s * 1.7); ctx.lineTo(px + s * 0.75, py); ctx.lineTo(px, py + s * 1.7); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillRect(trR(px) - 1, trR(py - s), 1, 2); } }
function trBat(px, py, t, k, col) { const fl = Math.sin(t * 18 + k); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(px - 1, py); ctx.lineTo(px - 5, py - 2 * fl - 1); ctx.lineTo(px - 3, py + 1); ctx.lineTo(px - 1.5, py + 0.5); ctx.lineTo(px, py + 2); ctx.lineTo(px + 1.5, py + 0.5); ctx.lineTo(px + 3, py + 1); ctx.lineTo(px + 5, py - 2 * fl - 1); ctx.lineTo(px + 1, py); ctx.lineTo(px + 1, py - 1.5); ctx.lineTo(px - 1, py - 1.5); ctx.closePath(); ctx.fill(); }
function trFeather(px, py, a, al, c1, c2) { ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.fillStyle = c1.replace('A', al); ctx.beginPath(); ctx.ellipse(0, 0, 1.7, 4.5, 0, 0, 7); ctx.fill(); ctx.fillStyle = c2.replace('A', al); ctx.fillRect(-0.3, -4, 0.7, 8.5); ctx.restore(); }
function trSnow(px, py, a) { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(px - 1, py, 3, 1); ctx.fillRect(px, py - 1, 1, 3); }
function trPuff(px, py, r, a, rgb) { ctx.fillStyle = `rgba(${rgb || '255,240,236'},${a})`; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.arc(px + r * 0.8, py + r * 0.2, r * 0.7, 0, 7); ctx.arc(px - r * 0.7, py + r * 0.3, r * 0.6, 0, 7); ctx.fill(); }

// ---------- Despertar Dorado: llamas en punta alrededor, centro blanco, chispas y rayos (fases 2 y 3) ----------
function trSpikeAura(x, y, t, h, w, n, fill, edge, seed) { const cy = y - h * 0.42; ctx.beginPath();
  for (let i = 0; i <= n * 2; i++) { const s = i / (n * 2), a = Math.PI / 2 + s * Math.PI * 2, top = Math.max(0, -Math.sin(a)), spike = i % 2 ? (0.12 + top * 0.55) * (0.75 + Math.sin(t * 13 + i * 1.9 + seed) * 0.25) : 0, rr = 1 + spike;
    let px = x + Math.cos(a) * w * rr, py = cy + Math.sin(a) * h * 0.55 * rr; if (i % 2) { py -= spike * h * 0.35; px += Math.cos(a) * spike * 2; } if (Math.sin(a) > 0.6) px = x + (px - x) * 0.6; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1; ctx.stroke(); } }
TR_AURA.dorado = (x, y, t, F) => { const h = F === 3 ? 70 : F === 2 ? 60 : 48, w = F === 3 ? 22 : F === 2 ? 19 : 16, al = F === 1 ? 0.7 : 1;
  trHaze(x, y + 4, h + 18, '255,230,90', 0.28 * al, 0.62);
  const mk = (r0, c0, c1) => { const g = ctx.createRadialGradient(x, y - h * 0.4, 2, x, y - h * 0.4, h * r0); g.addColorStop(0, 'rgba(255,255,240,0.05)'); g.addColorStop(0.45, c0); g.addColorStop(0.8, c1); g.addColorStop(1, 'rgba(255,200,0,0)'); return g; };
  trSpikeAura(x, y, t, h * 1.08, w * 1.12, F === 3 ? 13 : 11, mk(0.95, `rgba(255,250,200,${0.18 * al})`, `rgba(255,214,40,${0.38 * al})`), `rgba(255,230,60,${0.55 * al})`, 0);
  trSpikeAura(x, y, t * 1.2, h * 0.92, w * 0.95, F === 3 ? 12 : 10, mk(0.8, `rgba(255,255,255,${0.22 * al})`, `rgba(255,236,120,${0.4 * al})`), `rgba(255,255,200,${0.6 * al})`, 3);
  for (let k = 0; k < (F === 3 ? 14 : F === 2 ? 9 : 5); k++) { const ph = trPh(t, k, 1.5); ctx.fillStyle = `rgba(255,250,210,${1 - ph})`; ctx.fillRect(trR(x + Math.sin(k * 5.1) * w * 1.1), trR(y - ph * h * 1.15), 1, 3); }
  ctx.strokeStyle = 'rgba(255,255,230,0.5)'; ctx.lineWidth = 1; for (let k = 0; k < (F === 3 ? 4 : 2); k++) { ctx.beginPath(); for (let u = 0; u <= 1; u += 0.08) { const yy = y - u * h, xx = x + Math.sin(u * 9 + k * 2.1 + t * 4) * w * 0.7 * (1 - u * 0.4); u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  if (F >= 2 && Math.sin(t * 7) > (F === 3 ? 0 : 0.5)) { ctx.strokeStyle = 'rgba(190,240,255,0.95)'; ctx.lineWidth = 1.5; for (let k = 0; k < (F === 3 ? 3 : 1); k++) trBolt(x + (k % 2 ? 12 : -12), y - 38 - k * 7, k % 2 ? 4 : -4, t, k, 4); } };
TR_FLASH.dorado = (x, y, u) => { const k = 1 - u, w = 8 + u * 24; trColumn(x, y, 150, '255,240,150', 0.9 * k, w); trColumn(x, y, 150, '255,255,255', k * k, w * 0.35);
  trSpikeAura(x, y, G.t, 50 + u * 50, 16 + u * 22, 12, `rgba(255,236,120,${0.45 * k})`, `rgba(255,255,220,${k})`, 1);
  ctx.strokeStyle = `rgba(255,212,64,${k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 10 + u * 50, 4 + u * 17, 0, 0, 7); ctx.stroke();
  if (u < 0.5) { const r = ctx.createRadialGradient(x, y - 18, 2, x, y - 18, 44); r.addColorStop(0, `rgba(255,255,255,${0.95 * (1 - u * 2)})`); r.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = r; ctx.fillRect(x - 44, y - 62, 88, 88); } };

// ---------- Tejedor Primordial: bruma de tinta, hilos en espiral, puntadas y rueda del telar ----------
TR_AURA.tejedor = (x, y, t, F) => { const h = F === 2 ? 58 : 46; trHaze(x, y, h, '18,16,28', 0.34);
  const n = F === 2 ? 4 : 3; ctx.lineWidth = 1;
  for (let k = 0; k < n; k++) { let last = null; for (let u = 0; u <= 1.001; u += 0.04) { const a = u * 9 + t * 2.2 + k * (Math.PI * 2 / n), rx = h * 0.36 * (1 - u * 0.35), px = x + Math.cos(a) * rx, py = y + 2 - u * h * 1.05 + Math.sin(a) * 3;
      if (last) { ctx.strokeStyle = Math.sin(a) > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(228,221,207,0.3)'; ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(px, py); ctx.stroke(); } last = [px, py]; } }
  for (let k = 0; k < (F === 2 ? 10 : 6); k++) { const ph = trPh(t, k, 0.6), px = trR(x + Math.sin(k * 7.3 + t) * h * 0.4), py = trR(y - 4 - ph * h * 1.1); ctx.fillStyle = `rgba(255,255,255,${(1 - ph) * 0.9})`; ctx.fillRect(px, py, 1, 3); ctx.fillRect(px + 2, py + 1, 1, 2); }
  for (let k = 0; k < 3; k++) { const ph = trPh(t, k + 5, 0.3); ctx.fillStyle = `rgba(10,8,16,${0.55 * (1 - ph)})`; ctx.beginPath(); ctx.ellipse(x + Math.sin(k * 3.7) * 22, y - 10 - ph * 40, 2 + ph * 3, 1.5 + ph * 2, 0, 0, 7); ctx.fill(); }
  if (F === 2) for (let k = 0; k < 16; k++) { const a = t * 1.4 + k * Math.PI / 8; ctx.fillStyle = k % 2 ? 'rgba(246,242,234,0.85)' : 'rgba(216,184,72,0.8)'; ctx.fillRect(trR(x + Math.cos(a) * 18) - 1, trR(y + 2 + Math.sin(a) * 6), 3, 1); } };
TR_FLASH.tejedor = (x, y, u) => { const k = 1 - u; ctx.lineWidth = 1; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + 0.3, r0 = 60 * (1 - Math.min(1, u * 1.6)), r1 = r0 + 22 * k; ctx.strokeStyle = `rgba(255,255,255,${k})`; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r1, y - 16 + Math.sin(a) * r1 * 0.8); ctx.lineTo(x + Math.cos(a) * r0, y - 16 + Math.sin(a) * r0 * 0.8); ctx.stroke(); }
  if (u > 0.35) { const v = (u - 0.35) / 0.65; ctx.strokeStyle = `rgba(12,10,18,${0.9 * (1 - v)})`; ctx.lineWidth = 4 * (1 - v) + 1; ctx.beginPath(); ctx.ellipse(x, y - 16, 8 + v * 50, 10 + v * 44, 0, 0, 7); ctx.stroke(); ctx.strokeStyle = `rgba(246,242,234,${1 - v})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 16, 6 + v * 50, 8 + v * 44, 0, 0, 7); ctx.stroke(); } };

// ---------- Mitad Lobo: luna detrás, viento plateado, zarpazos de luz y motas ----------
TR_AURA.lobo = (x, y, t, F) => { const w = F === 2 ? 30 : 20; trHaze(x, y, F === 2 ? 46 : 50, '196,206,226', 0.26);
  const mx = x + (F === 2 ? 14 : 10), my = y - (F === 2 ? 34 : 50), mg = ctx.createRadialGradient(mx, my, 1, mx, my, 12); mg.addColorStop(0, 'rgba(240,244,255,0.5)'); mg.addColorStop(1, 'rgba(200,210,240,0)'); ctx.fillStyle = mg; ctx.fillRect(mx - 12, my - 12, 24, 24);
  ctx.fillStyle = 'rgba(244,246,255,0.8)'; ctx.beginPath(); ctx.arc(mx, my, 4, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(150,160,190,0.9)'; ctx.beginPath(); ctx.arc(mx + 1.8, my - 1, 3.4, 0, 7); ctx.fill();
  ctx.lineWidth = 1; for (let k = 0; k < 5; k++) { const a0 = t * (3 + k * 0.3) + k * 1.26; ctx.strokeStyle = `rgba(230,236,250,${0.3 + 0.45 * (k % 2)})`; ctx.beginPath(); ctx.ellipse(x, y - 1 - k * 4, w + k * 2, 4 + k, 0, a0, a0 + 1.5); ctx.stroke(); }
  const cyc = (t * 0.8) % 1; if (cyc < 0.22) { const v = cyc / 0.22, cxx = x + (Math.floor(t * 0.8) % 2 ? 16 : -16); ctx.strokeStyle = `rgba(235,242,255,${1 - v})`; ctx.lineWidth = 1.2; for (let s = 0; s < 3; s++) { ctx.beginPath(); ctx.moveTo(cxx - 5 + s * 3, y - 34 + s); ctx.quadraticCurveTo(cxx + s * 3, y - 24, cxx + 3 + s * 3, y - 12 - v * 4); ctx.stroke(); } }
  for (let k = 0; k < 8; k++) { const ph = trPh(t, k, 0.7); ctx.fillStyle = `rgba(240,244,255,${1 - ph})`; const px = trR(x + Math.sin(k * 4.7) * w), py = trR(y - 6 - ph * 46); ctx.fillRect(px, py, 1, 1); if (k % 2) { ctx.fillRect(px - 1, py + 1, 3, 1); ctx.fillRect(px, py + 2, 1, 1); } }
  for (let k = 0; k < 4; k++) { const ph = trPh(t, k, 1.6); ctx.fillStyle = `rgba(160,150,130,${0.5 * (1 - ph)})`; ctx.beginPath(); ctx.arc(x + (k % 2 ? 1 : -1) * (6 + ph * 14), y + 1 - ph * 3, 1 + ph * 2, 0, 7); ctx.fill(); } };

// ---------- Mitad Fantasma: niebla de luna (verde azulada), fantasmitas con cara y estelas ----------
TR_AURA.fantasma = (x, y, t, F) => { trHaze(x, y, 56, '150,210,205', 0.3, 0.75);
  for (let k = 0; k < 7; k++) { const px = x + Math.sin(k * 2.3 + t * 0.6) * 20, py = y + 1 - (k % 3) * 2 + Math.cos(t + k) * 1.2; ctx.fillStyle = `rgba(200,236,232,${0.18 + (k % 2) * 0.08})`; ctx.beginPath(); ctx.ellipse(px, py, 11 + (k % 3) * 2, 3, 0, 0, 7); ctx.fill(); }
  for (let k = 0; k < 5; k++) { const ph = trPh(t, k, 0.35), px = x + Math.sin(k * 3.1 + t * 0.9) * 16, py = y - 6 - ph * 50; ctx.strokeStyle = `rgba(210,240,236,${0.4 * (1 - ph)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py + 8); ctx.quadraticCurveTo(px + 4 * Math.sin(t * 2 + k), py + 4, px, py); ctx.stroke(); }
  const n = 4; for (let k = 0; k < n; k++) { const a = t * 1.1 + k * Math.PI * 2 / n, front = Math.sin(a) > 0, gx = x + Math.cos(a) * 22, gy = y - 26 + Math.sin(a) * 5 + Math.sin(t * 3 + k * 1.7) * 3, s = front ? 1 : 0.75;
    for (let q = 1; q < 4; q++) { const b = a - q * 0.18; ctx.fillStyle = `rgba(220,244,240,${(front ? 0.28 : 0.12) * (1 - q / 4)})`; ctx.beginPath(); ctx.arc(x + Math.cos(b) * 22, y - 22 + Math.sin(b) * 5 + Math.sin(t * 3 + k * 1.7) * 3, 3 * s, 0, 7); ctx.fill(); }
    trGhost(gx, gy, s, front ? 0.8 : 0.35, t, k); } };

// ---------- Mitad Vampiro: bruma carmesí, remolino de sangre a los pies, murciélagos y gotas ----------
TR_AURA.vampiro = (x, y, t, F) => { trHaze(x, y, 56, '120,10,30', 0.34);
  trFlames(x, y, t * 0.7, 6, 22, 9, ['rgba(90,8,24,0.35)', 'rgba(170,20,40,0.35)', 'rgba(255,80,90,0.6)']);
  ctx.lineWidth = 1.2; for (let k = 0; k < 3; k++) { const a0 = -t * 2.5 + k * 2.09; ctx.strokeStyle = k % 2 ? 'rgba(200,20,40,0.7)' : 'rgba(120,8,24,0.7)'; ctx.beginPath(); ctx.ellipse(x, y + 1 - k * 2, 16 + k * 3, 4 + k, 0, a0, a0 + 2); ctx.stroke(); }
  for (let k = 0; k < 4; k++) { const a = t * 2.2 + k * Math.PI / 2, px = x + Math.cos(a) * (20 + (k % 2) * 4), py = y - 32 - (k % 2) * 6 + Math.sin(a) * 5 + Math.sin(t * 9 + k) * 2; trBat(px, py, t, k, Math.sin(a) > 0 ? '#1a0610' : 'rgba(40,8,20,0.45)'); if (Math.sin(a) > 0) { ctx.fillStyle = '#ff3040'; ctx.fillRect(trR(px) - 1, trR(py) - 1, 1, 1); ctx.fillRect(trR(px) + 1, trR(py) - 1, 1, 1); } }
  for (let k = 0; k < 7; k++) { const ph = trPh(t, k, 0.8); ctx.fillStyle = `rgba(224,40,60,${1 - ph})`; const px = trR(x + Math.sin(k * 3.9) * 15), py = trR(y - ph * 52); ctx.fillRect(px, py, 1, 2); ctx.fillRect(px, py + 2, 1, 1); } };

// ---------- Mitad Dragón: llamas, brasas y calor (2.0: más grande, con chispas azules) ----------
TR_AURA.dragon = (x, y, t, F) => { const big = F >= 2, h = big ? 56 : 44; trHaze(x, y, h + 8, '255,110,30', 0.3);
  trFlames(x, y, t, big ? 10 : 7, big ? 30 : 20, big ? 12 : 9, ['rgba(255,80,20,0.42)', 'rgba(255,180,50,0.5)', 'rgba(255,240,150,0.8)']);
  ctx.strokeStyle = 'rgba(255,200,120,0.25)'; ctx.lineWidth = 1; for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let u = 0; u <= 1; u += 0.1) { const yy = y - 10 - u * h, xx = x + (k - 1) * 14 + Math.sin(u * 12 + t * 6 + k) * 2; u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  trEmbers(x, y, t, big ? 14 : 8, h, 18, (k, ph) => (big && k % 3 === 0) ? `rgba(140,210,255,${1 - ph})` : `rgba(255,${trR(210 - ph * 130)},60,${1 - ph})`); };

// ---------- Alado Caído: aura angelical (alas de luz celeste, columna blanca, plumas) ----------
TR_AURA.alado = (x, y, t, F) => { const sz = F === 2 ? 1.25 : 1; trColumn(x, y + 4, 90 * sz, '230,252,255', 0.35, 7); trHaze(x, y, 58 * sz, '140,220,240', 0.3, 0.8);
  trWings(x, y, t, sz, 'rgba(255,255,255,0.32)', 'rgba(90,200,230,0.06)', 'rgba(120,220,245,0.7)');
  const g = ctx.createRadialGradient(x, y - 18, 6, x, y - 18, 22); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(200,250,255,0.28)'); g.addColorStop(1, 'rgba(200,250,255,0)'); ctx.fillStyle = g; ctx.fillRect(x - 22, y - 40, 44, 44);
  for (let k = 0; k < (F === 2 ? 7 : 5); k++) { const ph = trPh(t, k, 0.3), px = x + Math.sin(k * 5.7) * 24 + Math.sin(t * 2 + k) * 4, py = y - 62 * sz + ph * 64 * sz; trFeather(px, py, Math.sin(t * 2.5 + k) * 0.8, Math.min(1, (1 - ph) * 1.6), 'rgba(255,255,255,A)', 'rgba(140,210,235,A)'); }
  for (let k = 0; k < 6; k++) { const ph = trPh(t, k, 0.9); ctx.fillStyle = `rgba(230,252,255,${1 - ph})`; ctx.fillRect(trR(x + Math.sin(k * 4.3) * 10), trR(y - ph * 70 * sz), 1, 2); } };

// ---------- Eco sin Pintar: trazos de lápiz que se redibujan, manchas de tinta y pinceladas ----------
TR_AURA.eco = (x, y, t, F) => { const fr = Math.floor(t * 8), n = F === 2 ? 3 : 2; ctx.lineWidth = 1;
  for (let k = 0; k < n; k++) { ctx.strokeStyle = k ? 'rgba(60,58,70,0.5)' : 'rgba(30,28,40,0.75)'; ctx.beginPath(); for (let s = 0; s <= 26; s++) { const a = s / 26 * 6.5 + k, j = Math.sin(fr * 3.1 + s * 1.7 + k * 5) * 2.2, px = x + Math.cos(a) * (18 + k * 3 + j), py = y - 18 + Math.sin(a) * (27 + k * 3 + j); s ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  ctx.strokeStyle = 'rgba(40,38,50,0.35)'; for (let k = 0; k < 7; k++) { const hx = x - 18 + k * 6 + (fr % 2); ctx.beginPath(); ctx.moveTo(hx, y + 5); ctx.lineTo(hx + 4, y + 1); ctx.stroke(); }
  for (let k = 0; k < (F === 2 ? 5 : 3); k++) { const s = (fr + k * 5) % 16, a = s / 16; if (a > 0.7) continue; const px = x + Math.sin(k * 4.1 + Math.floor((fr + k * 5) / 16)) * 24, py = y - 22 + Math.cos(k * 2.7 + Math.floor((fr + k * 5) / 16)) * 24, r = 1.5 + a * 3;
    ctx.fillStyle = k % 2 ? `rgba(240,238,232,${0.9 - a})` : `rgba(20,20,28,${0.9 - a})`; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill(); for (let q = 0; q < 4; q++) { const b = q * 1.6 + k; ctx.fillRect(trR(px + Math.cos(b) * (r + 2)), trR(py + Math.sin(b) * (r + 2)), 1, 1); } }
  for (let k = 0; k < (F === 2 ? 3 : 2); k++) { const ph = trPh(t, k, 0.5), px = x + (k % 2 ? 1 : -1) * (14 + ph * 6), py = y - 10 - ph * 40; ctx.strokeStyle = `rgba(20,20,28,${0.8 * (1 - ph)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(px - 4, py + 2); ctx.quadraticCurveTo(px, py - 2, px + 4, py + 1); ctx.stroke(); ctx.lineWidth = 1; } };

// ---------- Guardián de Hielo: escarcha en el suelo, cristales que giran, niebla y copos ----------
TR_AURA.hielo = (x, y, t, F) => { const big = F >= 2; trHaze(x, y, big ? 58 : 50, '168,224,255', 0.3);
  ctx.strokeStyle = 'rgba(200,240,255,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y + 1, 20, 6, 0, 0, 7); ctx.stroke();
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + t * 0.3, ex = x + Math.cos(a) * 20, ey = y + 1 + Math.sin(a) * 6; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 8, y + 1 + Math.sin(a) * 2.4); ctx.lineTo(ex, ey); ctx.stroke(); const mx = x + Math.cos(a) * 15, my = y + 1 + Math.sin(a) * 4.5; ctx.beginPath(); ctx.moveTo(mx + Math.cos(a + 1) * 3, my + Math.sin(a + 1) * 1); ctx.lineTo(mx, my); ctx.lineTo(mx + Math.cos(a - 1) * 3, my + Math.sin(a - 1) * 1); ctx.stroke(); }
  if (big) for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, px = x + Math.cos(a) * 22, py = y + 1 + Math.sin(a) * 7; ctx.fillStyle = 'rgba(210,244,255,0.75)'; ctx.beginPath(); ctx.moveTo(px - 2, py); ctx.lineTo(px, py - 7 - (k % 2) * 3); ctx.lineTo(px + 2, py); ctx.closePath(); ctx.fill(); }
  const n = big ? 6 : 4; for (let k = 0; k < n; k++) { const a = t * 1.4 + k * Math.PI * 2 / n; trCrystal(x + Math.cos(a) * 20, y - 20 + Math.sin(a) * 6 - (k % 2) * 10, 3.2, Math.sin(a) > 0); }
  for (let k = 0; k < 7; k++) { const ph = trPh(t, k, 0.4); trSnow(trR(x + Math.sin(k * 6.1 + t * 0.7) * 24), trR(y - 58 + ph * 60), 1 - ph * 0.7); } };

// ---------- Engranaje 2: vapor que sale de todo el cuerpo, calor rosado y nube a los pies ----------
TR_AURA.vapor = (x, y, t, F) => { trHaze(x, y, 54, '255,130,140', 0.26);
  for (let k = 0; k < 5; k++) { const sx = x + (k - 2) * 5; ctx.strokeStyle = `rgba(255,246,244,${0.35 + (k % 2) * 0.2})`; ctx.lineWidth = 1.4; ctx.beginPath(); for (let u = 0; u <= 1; u += 0.08) { const yy = y - 14 - u * 46, xx = sx + Math.sin(u * 8 + t * 4 + k * 1.3) * (2 + u * 5); u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  for (let k = 0; k < 9; k++) { const ph = trPh(t, k, 0.55), r = 2 + ph * 6, px = x + Math.sin(k * 3.3) * 15 + Math.sin(t * 2 + k) * 3 * ph, py = y - 10 - ph * 54; trPuff(px, py, r, 0.5 * (1 - ph)); }
  for (let k = 0; k < 5; k++) trPuff(x + (k - 2) * 8 + Math.sin(t + k) * 2, y + 1, 3.5 + (k % 2), 0.32); };

// ---------- Fusiones ----------
// Dragón de Hielo: llamas azules y blancas, cristales y copos
TR_AURA.fus_dh = (x, y, t, F) => { const big = F >= 2; trHaze(x, y, big ? 60 : 52, '140,210,255', 0.32);
  trFlames(x, y, t, big ? 10 : 8, big ? 30 : 22, 11, ['rgba(80,170,255,0.42)', 'rgba(200,240,255,0.55)', 'rgba(255,255,255,0.9)']);
  for (let k = 0; k < 4; k++) { const a = t * 1.2 + k * Math.PI / 2; trCrystal(x + Math.cos(a) * 21, y - 26 + Math.sin(a) * 6, 2.8, Math.sin(a) > 0); }
  trEmbers(x, y, t, 10, 50, 18, (k, ph) => k % 2 ? `rgba(255,255,255,${1 - ph})` : `rgba(140,220,255,${1 - ph})`);
  for (let k = 0; k < 4; k++) { const ph = trPh(t, k + 3, 0.4); trSnow(trR(x + Math.sin(k * 5.1) * 24), trR(y - 56 + ph * 58), 1 - ph * 0.7); } };
// Boceto de Fuego: llamas dibujadas a tinta, manchas y papelitos
TR_AURA.fus_bf = (x, y, t, F) => { const big = F >= 2, fr = Math.floor(t * 8); trHaze(x, y, 54, '255,150,60', 0.24);
  trFlames(x, y, fr * 0.125, big ? 9 : 7, big ? 28 : 20, 10, ['rgba(255,110,30,0.55)', 'rgba(255,200,90,0.6)', 'rgba(20,16,24,0.9)'], 'rgba(20,16,24,0.85)');
  ctx.strokeStyle = 'rgba(20,16,24,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); for (let s = 0; s <= 24; s++) { const a = s / 24 * 6.4, j = Math.sin(fr * 2.7 + s * 1.9) * 2, px = x + Math.cos(a) * (20 + j), py = y - 20 + Math.sin(a) * (28 + j); s ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
  for (let k = 0; k < 5; k++) { const ph = trPh(t, k, 0.45), px = x + Math.sin(k * 4.4) * 20, py = y - 8 - ph * 46; ctx.save(); ctx.translate(px, py); ctx.rotate(t * 2 + k); ctx.fillStyle = `rgba(250,244,230,${0.9 * (1 - ph)})`; ctx.fillRect(-2, -1.5, 4, 3); ctx.strokeStyle = `rgba(20,16,24,${0.7 * (1 - ph)})`; ctx.strokeRect(-2, -1.5, 4, 3); ctx.restore(); }
  trEmbers(x, y, t, 8, 46, 16, (k, ph) => k % 3 ? `rgba(255,${trR(190 - ph * 110)},60,${1 - ph})` : `rgba(20,16,24,${1 - ph})`); };
// Ángel de Niebla: alas de niebla gris azulada, aureola rota y fantasmas de niebla sin cara
TR_AURA.fus_an = (x, y, t, F) => { const sz = F >= 2 ? 1.2 : 1; trColumn(x, y + 4, 80 * sz, '220,228,240', 0.25, 7); trHaze(x, y, 58 * sz, '170,184,210', 0.32, 0.8);
  trWings(x, y, t, sz, 'rgba(238,242,250,0.28)', 'rgba(150,165,190,0.05)', 'rgba(200,210,228,0.6)');
  const hy = y - 46 * sz + Math.sin(t * 2) * 1; ctx.strokeStyle = 'rgba(238,242,250,0.85)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, hy, 7, 2, 0, 0.3, 2.7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(x + 1, hy - 1, 7, 2, 0, 3.4, 5.9); ctx.stroke();
  for (let k = 0; k < 6; k++) { const px = x + Math.sin(k * 2.3 + t * 0.6) * 20, py = y + 1 - (k % 3) * 2; ctx.fillStyle = 'rgba(220,228,240,0.22)'; ctx.beginPath(); ctx.ellipse(px, py, 12, 3, 0, 0, 7); ctx.fill(); }
  for (let k = 0; k < 4; k++) { const ph = trPh(t, k, 0.3), px = x + Math.sin(k * 5.7) * 24, py = y - 60 * sz + ph * 62 * sz; trFeather(px, py, Math.sin(t * 2.5 + k) * 0.8, Math.min(1, (1 - ph) * 1.4) * 0.8, 'rgba(232,236,246,A)', 'rgba(140,150,175,A)'); } };

// ---------- Destellos (0,45 s): columna, onda y partículas con el motivo de cada forma ----------
function trFlashGen(rgb, ring, motif) { return (x, y, u) => { const k = 1 - u; trColumn(x, y, 120, rgb, 0.7 * k, 6 + u * 18);
  ctx.strokeStyle = ring.replace('A', k); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 10 + u * 46, 4 + u * 16, 0, 0, 7); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 18, 6 + u * 40, 8 + u * 46, 0, 0, 7); ctx.stroke();
  if (u < 0.45) { const r = ctx.createRadialGradient(x, y - 18, 2, x, y - 18, 40); r.addColorStop(0, `rgba(${rgb},${0.9 * (1 - u / 0.45)})`); r.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = r; ctx.fillRect(x - 40, y - 58, 80, 80); }
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + 0.2, d = 10 + u * 48, px = x + Math.cos(a) * d, py = y - 18 + Math.sin(a) * d * 0.8; motif(px, py, k, i, a); } }; }
TR_FLASH.lobo = trFlashGen('230,236,255', 'rgba(220,228,250,A)', (px, py, k) => { ctx.fillStyle = `rgba(240,244,255,${k})`; ctx.fillRect(trR(px), trR(py), 2, 1); ctx.fillRect(trR(px), trR(py) + 2, 2, 1); });
TR_FLASH.fantasma = trFlashGen('200,240,236', 'rgba(190,236,230,A)', (px, py, k, i) => { if (i % 2) trGhost(px, py, 0.7, 0.75 * k, G.t, i); });
TR_FLASH.vampiro = trFlashGen('220,40,60', 'rgba(200,20,40,A)', (px, py, k, i) => trBat(px, py, G.t, i, `rgba(26,6,16,${k})`));
TR_FLASH.dragon = trFlashGen('255,170,60', 'rgba(255,120,30,A)', (px, py, k) => { ctx.fillStyle = `rgba(255,200,80,${k})`; ctx.beginPath(); ctx.arc(px, py, 1.5 + k, 0, 7); ctx.fill(); });
TR_FLASH.alado = trFlashGen('220,250,255', 'rgba(150,225,245,A)', (px, py, k, i, a) => trFeather(px, py, a + 1.57, k, 'rgba(255,255,255,A)', 'rgba(140,210,235,A)'));
TR_FLASH.eco = trFlashGen('240,238,232', 'rgba(24,22,32,A)', (px, py, k, i) => { ctx.fillStyle = i % 2 ? `rgba(20,20,28,${k})` : `rgba(245,243,238,${k})`; ctx.beginPath(); ctx.arc(px, py, 1.5 + k * 1.5, 0, 7); ctx.fill(); });
TR_FLASH.hielo = trFlashGen('200,240,255', 'rgba(170,225,255,A)', (px, py, k, i) => i % 2 ? trCrystal(px, py, 2 * k + 1, true) : trSnow(trR(px), trR(py), k));
TR_FLASH.vapor = trFlashGen('255,236,232', 'rgba(255,200,200,A)', (px, py, k) => trPuff(px, py, 2 + (1 - k) * 4, 0.7 * k));
TR_FLASH.fus_dh = trFlashGen('180,230,255', 'rgba(120,200,255,A)', (px, py, k, i) => i % 2 ? trCrystal(px, py, 2 * k + 1, true) : (ctx.fillStyle = `rgba(200,240,255,${k})`, ctx.fillRect(trR(px), trR(py), 2, 2)));
TR_FLASH.fus_bf = trFlashGen('255,180,90', 'rgba(20,16,24,A)', (px, py, k, i) => { ctx.fillStyle = i % 2 ? `rgba(255,140,40,${k})` : `rgba(20,16,24,${k})`; ctx.beginPath(); ctx.arc(px, py, 1.5 + k * 1.5, 0, 7); ctx.fill(); });
TR_FLASH.fus_an = trFlashGen('230,236,248', 'rgba(200,210,230,A)', (px, py, k, i, a) => i % 2 ? trFeather(px, py, a + 1.57, k, 'rgba(238,242,250,A)', 'rgba(140,150,175,A)') : trPuff(px, py, 2 + (1 - k) * 3, 0.5 * k, '220,228,240'));

// ---------- clave de aura: forma o fusión, para ti y para los jugadores del online ----------
function trKeyP(P) { if (!P || !P.sr) return null; if (P.sr === 'dragon' && P.fus) return 'fus_dh'; if (typeof fus2On === 'function') { const f = fus2On(); if (f) return 'fus_' + f; } return P.sr; }
function trKeyG(g) { if (!g || !g.sr) return null; if (g.sr === 'dragon' && g.fu) return 'fus_dh'; if (g.f2) return 'fus_' + g.f2; return g.sr; }
// dibujo: el destello sale al pasar de forma normal a transformado (también al pasar de forma a fusión)
// el aura se dibuja DETRÁS del personaje (antes de drawEnt, como en las referencias); el destello va delante (WORLD_DRAW)
function trAuraEnt(e, key, F, off, cx, cy) { const on = key && F > 0; if (on && e._trSeen && (!(e._trF > 0) || e._trK !== key) && TR_FLASH[key]) { e._trFl = G.t; if (key === 'vapor') e._poseT = G.t + TR_POSE_DUR; }
  e._trF = on ? F : 0; e._trK = key; e._trOff = off; e._trSeen = 1; if (!on || !e._trFl) return;
  const u = (G.t - e._trFl) / TRF_DUR; if (u < 0 || u > 1) { e._trFl = 0; return; } const x = trR(e.x - cx), y = trR(e.y - cy); if (x > -90 && y > -40 && x < VW + 90 && y < VH + 160) TR_FLASH[key](x, y, u); }
hookBefore('drawEnt', (e, cx, cy) => { if (!e || !(e._trF > 0) || e._trOff || e.dead || e.invis || e._trAt === G.t || !TR_AURA[e._trK]) return; if (e !== G.P && e.type !== 'remote') return;
  const x = trR(e.x - cx), y = trR(e.y - cy); if (x < -90 || y < -40 || x > VW + 90 || y > VH + 160) return; e._trAt = G.t;
  try { ctx.save(); TR_AURA[e._trK](x, y, G.t + (e.x || 0) * 0.01, e._trF); } finally { ctx.restore(); } });
WORLD_DRAW.push((cx, cy) => { const P = G.P; if (!P) return; trAuraEnt(P, trKeyP(P), P.srF | 0, !!P.trAuraOff, cx, cy);
  for (const r of G.remote.values()) if (r.map === P.map) trAuraEnt(r, trKeyG(r.gear), r.gear ? r.gear.sf | 0 : 0, !!(r.gear && r.gear.na), cx, cy); });
SAVEKEYS.push('trAuraOff');
hookAfter('gearTiers', (g, P) => { if (g && P && P.trAuraOff) g.na = 1; });
hookAfter('lkGear', (o, g) => { if (o && g && g.na) o.na = 1; });
function trAuraSet(off) { const P = G.P; if (!P) return; P.trAuraOff = off ? 1 : 0; markDirty(); try { refreshLook(); } catch (e) { } toast(off ? L2('Aura de transformación apagada', 'Transformation aura off') : L2('Aura de transformación encendida', 'Transformation aura on')); transOpen(); }
// botón en 🌀 Transformaciones (solo si tu forma tiene aura)
hookAfter('transOpen', () => { const P = G.P, fr = document.querySelector('#modal .frame'); if (!P || !fr || !TR_AURA[trKeyP(P)] || fr.querySelector('#trAuraBtn')) return;
  const d = document.createElement('div'); d.className = 'row'; d.innerHTML = `<span class="hint">✨ ${L2('Aura de transformación (solo transformado)', 'Transformation aura (only while transformed)')}</span> <button class="btn" id="trAuraBtn">${P.trAuraOff ? L2('Aura: no', 'Aura: off') : L2('Aura: sí', 'Aura: on')}</button>`;
  const h = fr.querySelector('.hint:not(.tut)') || fr.querySelector('h3'); if (h && h.parentNode) h.parentNode.insertBefore(d, h.nextSibling); else fr.appendChild(d); d.querySelector('#trAuraBtn').onclick = () => trAuraSet(!P.trAuraOff); });

// ---------- Engranaje 2: pose agachada al transformarse (1,1 s) ----------
// Piernas flexionadas y abiertas, inclinado hacia delante, una mano en la rodilla y el puño en el suelo.
ANIMS.st_g2 = [0, 2];
hookAround('heroPose', (next, dir, anim, f, L) => { if (anim !== 'st_g2') return next(dir, anim, f, L);
  const ps = poseFor(dir, 'idle', 0, L), side = dir === 'left' || dir === 'right', fx = dir === 'left' ? -1 : 1;
  ps.crouch = 3; ps.bob = f ? 1 : 0; ps.noWeapon = 1; ps.lean = side ? 3 : 0;
  if (side) { ps.lfx = -fx * 3; ps.rfx = fx * 3; ps.rax = fx * 4; ps.ray = 4; ps.lax = fx * 2; ps.lay = 1; }
  else { ps.lax = -4; ps.lay = 1; ps.rax = 1; ps.ray = 4; ps.lfy = 0; ps.rfy = 0; }
  return ps; });
hookAround('drawEnt', (next, e, cx, cy) => { if (!e || !(e._poseT > G.t) || !(e.type === 'player' || e.type === 'remote') || e.mount || e.dead || !e.cls || !e.app || typeof stanceAtlasFor !== 'function') return next(e, cx, cy);
  const A0 = e.atlas, an0 = e.anim, f0 = e.af; try { e.atlas = stanceAtlasFor(e, 'g2'); e.anim = 'st_g2'; e.af = Math.floor(G.t * 6) % 2; return next(e, cx, cy); } catch (err) { if (typeof errOnce === 'function') errOnce('g2pose', err); return next(e, cx, cy); } finally { e.atlas = A0; e.anim = an0; e.af = f0; } });
