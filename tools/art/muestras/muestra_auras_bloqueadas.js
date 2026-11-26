// Muestra (no integrada): aura nueva del Tejedor Primordial, aura nueva del Despertar Dorado y destello al transformarse.
// Se carga encima del juego con tools/art/muestras/auras_bloqueadas.py.
// ---- Tejedor Primordial: bruma de tinta del Lienzo, hilos blancos que suben en espiral y puntadas que flotan ----
function tjAura(e, cx, cy, F) { const x = e.x - cx, y = e.y - cy, t = G.t + (e.x || 0) * 0.01, h = F === 2 ? 58 : 46;
  const g = ctx.createRadialGradient(x, y - 18, 3, x, y - 18, h * 0.75); g.addColorStop(0, 'rgba(12,10,18,0)'); g.addColorStop(0.5, 'rgba(12,10,18,0.08)'); g.addColorStop(0.8, 'rgba(22,20,34,0.32)'); g.addColorStop(1, 'rgba(22,20,34,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y - 18, h * 0.5, h * 0.72, 0, 0, 7); ctx.fill();
  // hilos en espiral: la mitad de atrás más tenue que la de delante
  const n = F === 2 ? 4 : 3; ctx.lineWidth = 1;
  for (let k = 0; k < n; k++) { let last = null; for (let u = 0; u <= 1.001; u += 0.04) { const a = u * 9 + t * 2.2 + k * (Math.PI * 2 / n), rx = h * 0.36 * (1 - u * 0.35), px = x + Math.cos(a) * rx, py = y + 2 - u * h * 1.05 + Math.sin(a) * 3, front = Math.sin(a) > 0;
      if (last) { ctx.strokeStyle = front ? 'rgba(255,255,255,0.85)' : 'rgba(228,221,207,0.3)'; ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(px, py); ctx.stroke(); } last = [px, py]; } }
  // puntadas: trocitos de hilo que suben y se apagan
  for (let k = 0; k < (F === 2 ? 9 : 5); k++) { const ph = (t * 0.6 + k * 0.37) % 1, px = x + Math.sin(k * 7.3 + t) * h * 0.4, py = y - 4 - ph * h * 1.1; ctx.fillStyle = `rgba(255,255,255,${(1 - ph) * 0.9})`; ctx.fillRect(Math.round(px), Math.round(py), 1, 3); ctx.fillRect(Math.round(px) + 2, Math.round(py) + 1, 1, 2); }
  // plena: la rueda del telar a los pies (anillo de puntadas que gira)
  if (F === 2) { const m = 16; for (let k = 0; k < m; k++) { const a = t * 1.4 + k * Math.PI * 2 / m; ctx.fillStyle = k % 2 ? 'rgba(246,242,234,0.85)' : 'rgba(216,184,72,0.8)'; ctx.fillRect(Math.round(x + Math.cos(a) * 18) - 1, Math.round(y + 2 + Math.sin(a) * 6), 3, 1); } } }

// ---- Despertar Dorado (propuesta): llamas de luz que suben con fuerza; fase 2 y 3 con rayos ----
function dzAura2(e, cx, cy, F) { const x = e.x - cx, y = e.y - cy, t = G.t + (e.x || 0) * 0.01, h = F === 3 ? 64 : F === 2 ? 54 : 40, al = F === 1 ? 0.6 : 1;
  const g = ctx.createRadialGradient(x, y - 20, 3, x, y - 20, h * 0.8); g.addColorStop(0, `rgba(255,246,176,${0.12 * al})`); g.addColorStop(0.55, `rgba(255,212,64,${0.3 * al})`); g.addColorStop(1, 'rgba(255,160,0,0)'); ctx.fillStyle = g;
  // contorno de llama: lenguas que se alargan y encogen hacia arriba
  ctx.beginPath(); const n = F === 3 ? 9 : 7; ctx.moveTo(x - h * 0.3, y + 4);
  for (let k = 0; k <= n; k++) { const u = k / n, bx = x - h * 0.3 + u * h * 0.6, mid = 1 - Math.abs(u - 0.5) * 2, tip = y - 10 - (0.55 + mid * 0.6) * h * (0.85 + Math.sin(t * 11 + k * 1.7) * 0.15);
    ctx.quadraticCurveTo(bx - h * 0.04, (y + tip) / 2, bx, tip); if (k < n) ctx.quadraticCurveTo(bx + h * 0.04, y - h * 0.25 - mid * h * 0.2, bx + h * 0.3 / n, y - h * 0.3 - mid * h * 0.22); }
  ctx.lineTo(x + h * 0.3, y + 4); ctx.closePath(); ctx.fill();
  // chispas que suben
  for (let k = 0; k < (F === 3 ? 10 : F === 2 ? 7 : 3); k++) { const ph = (t * 1.3 + k * 0.29) % 1; ctx.fillStyle = `rgba(255,248,200,${1 - ph})`; ctx.fillRect(Math.round(x + Math.sin(k * 5.1) * h * 0.32), Math.round(y - ph * h * 1.2), 1, 2); }
  if (F >= 2 && Math.sin(t * 7) > (F === 3 ? 0.1 : 0.55)) { ctx.strokeStyle = 'rgba(180,235,255,0.95)'; ctx.lineWidth = 1.5;
    for (let k = 0; k < (F === 3 ? 3 : 1); k++) { let px = x + (k % 2 ? 11 : -11), py = y - 34 - k * 7; ctx.beginPath(); ctx.moveTo(px, py); for (let s = 0; s < 4; s++) { px += (k % 2 ? 4 : -4) + Math.sin(t * 40 + s * 3 + k) * 4; py += 5 + Math.cos(t * 33 + s) * 3; ctx.lineTo(px, py); } ctx.stroke(); } } }

// ---- Destello al transformarse (0,45 s y desaparece) ----
// u = 0..1 (progreso). Dorado: columna de luz + onda + chispazo. Tejedor: hilos que se cierran sobre ti + pulso de tinta.
const TRF_DUR = 0.45;
function trFlash(x, y, sr, u) { if (u < 0 || u > 1) return; const k = 1 - u;
  if (sr === 'dorado') { const w = 8 + u * 22; ctx.fillStyle = `rgba(255,246,190,${0.85 * k})`; ctx.fillRect(x - w / 2, y - 140, w, 146); ctx.fillStyle = `rgba(255,255,255,${0.9 * k * k})`; ctx.fillRect(x - w / 5, y - 140, w * 0.4, 146);
    ctx.strokeStyle = `rgba(255,212,64,${k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 10 + u * 46, 4 + u * 16, 0, 0, 7); ctx.stroke();
    if (u < 0.5) { const r = ctx.createRadialGradient(x, y - 18, 2, x, y - 18, 40); r.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - u * 2)})`); r.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = r; ctx.fillRect(x - 40, y - 58, 80, 80); }
    return; }
  if (sr === 'tejedor') { ctx.lineWidth = 1; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + 0.3, r0 = 60 * (1 - Math.min(1, u * 1.6)), r1 = r0 + 22 * k; ctx.strokeStyle = `rgba(255,255,255,${k})`; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r1, y - 16 + Math.sin(a) * r1 * 0.8); ctx.lineTo(x + Math.cos(a) * r0, y - 16 + Math.sin(a) * r0 * 0.8); ctx.stroke(); }
    if (u > 0.35) { const v = (u - 0.35) / 0.65; ctx.strokeStyle = `rgba(12,10,18,${0.9 * (1 - v)})`; ctx.lineWidth = 4 * (1 - v) + 1; ctx.beginPath(); ctx.ellipse(x, y - 16, 8 + v * 50, 10 + v * 44, 0, 0, 7); ctx.stroke(); ctx.strokeStyle = `rgba(246,242,234,${1 - v})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 16, 6 + v * 50, 8 + v * 44, 0, 0, 7); ctx.stroke(); } } }
