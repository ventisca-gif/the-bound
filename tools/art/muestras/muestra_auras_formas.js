// Muestra (no integrada): auras para las demás transformaciones. Se registran en TR_AURA (src/6zzzzzzm_v642_auras.js).
// (x, y) = pies en pantalla, t = tiempo, F = fase.
{ const R = Math.round, rise = (t, k, sp) => (t * sp + k * 0.37) % 1;
  const haze = (x, y, h, c0, c1) => { const r = h * 0.72; ctx.save(); ctx.translate(x, y - 18); ctx.scale(0.7, 1); const g = ctx.createRadialGradient(0, 0, 2, 0, 0, r); g.addColorStop(0, c0.replace('A', '0')); g.addColorStop(0.5, c0.replace('A', '0.06')); g.addColorStop(0.78, c1); g.addColorStop(1, c0.replace('A', '0')); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore(); };
  // Mitad Lobo: viento plateado a ras del suelo y brillos de luna que suben
  TR_AURA.lobo = (x, y, t, F) => { const w = F === 2 ? 30 : 20; haze(x, y, F === 2 ? 44 : 48, 'rgba(200,208,224,A)', 'rgba(200,208,224,0.22)');
    ctx.lineWidth = 1; for (let k = 0; k < 4; k++) { const a0 = t * 3 + k * 1.57; ctx.strokeStyle = `rgba(230,236,250,${0.35 + 0.4 * (k % 2)})`; ctx.beginPath(); ctx.ellipse(x, y - 2 - k * 3, w + k * 2, 5 + k, 0, a0, a0 + 1.4); ctx.stroke(); }
    for (let k = 0; k < 6; k++) { const ph = rise(t, k, 0.7); ctx.fillStyle = `rgba(240,244,255,${1 - ph})`; const px = R(x + Math.sin(k * 4.7) * w), py = R(y - 6 - ph * 44); ctx.fillRect(px, py, 1, 1); if (k % 2) { ctx.fillRect(px - 1, py + 1, 3, 1); ctx.fillRect(px, py + 2, 1, 1); } } };
  // Mitad Fantasma: niebla fría a los pies y fuegos fatuos que giran
  TR_AURA.fantasma = (x, y, t, F) => { haze(x, y, 50, 'rgba(200,236,255,A)', 'rgba(200,236,255,0.24)');
    for (let k = 0; k < 5; k++) { const a = t * 1.5 + k * 1.26, px = x + Math.sin(k * 2.3 + t * 0.8) * 16, py = y + 2 + Math.cos(a) * 1.5; ctx.fillStyle = 'rgba(230,246,255,0.28)'; ctx.beginPath(); ctx.ellipse(px, py, 9, 3, 0, 0, 7); ctx.fill(); }
    for (let k = 0; k < 3; k++) { const a = t * 1.8 + k * 2.09, px = x + Math.cos(a) * 17, py = y - 22 + Math.sin(a * 2) * 10, front = Math.sin(a) > 0; ctx.fillStyle = `rgba(170,230,255,${front ? 0.85 : 0.35})`; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, 7); ctx.fill();
      for (let s = 1; s < 5; s++) { const b = a - s * 0.12; ctx.fillStyle = `rgba(170,230,255,${(front ? 0.5 : 0.2) * (1 - s / 5)})`; ctx.fillRect(R(x + Math.cos(b) * 17) - 1, R(y - 22 + Math.sin(b * 2) * 10) - 1, 2, 2); } } };
  // Mitad Vampiro: bruma carmesí, murciélagos que rodean y gotas que suben
  TR_AURA.vampiro = (x, y, t, F) => { haze(x, y, 52, 'rgba(120,10,30,A)', 'rgba(150,20,40,0.3)');
    for (let k = 0; k < 3; k++) { const a = t * 2.2 + k * 2.09, px = R(x + Math.cos(a) * 20), py = R(y - 30 + Math.sin(a) * 6 + Math.sin(t * 9 + k) * 2), fl = Math.sin(t * 18 + k) > 0; ctx.fillStyle = Math.sin(a) > 0 ? '#1a0610' : 'rgba(40,8,20,0.5)';
      ctx.fillRect(px - 1, py, 3, 2); if (fl) { ctx.fillRect(px - 4, py - 1, 3, 1); ctx.fillRect(px + 2, py - 1, 3, 1); } else { ctx.fillRect(px - 4, py + 1, 3, 1); ctx.fillRect(px + 2, py + 1, 3, 1); } }
    for (let k = 0; k < 5; k++) { const ph = rise(t, k, 0.8); ctx.fillStyle = `rgba(224,40,60,${1 - ph})`; ctx.fillRect(R(x + Math.sin(k * 3.9) * 14), R(y - ph * 50), 1, 2); } };
  // Mitad Dragón: llamas bajas y brasas que suben (2.0: más grandes y con chispas azules)
  TR_AURA.dragon = (x, y, t, F) => { const big = F >= 2, h = big ? 54 : 42; haze(x, y, h + 6, 'rgba(255,122,42,A)', 'rgba(255,110,30,0.26)');
    for (let k = 0; k < (big ? 9 : 6); k++) { const u = k / ((big ? 9 : 6) - 1), bx = x + (u < 0.5 ? -1 : 1) * (9 + Math.abs(u - 0.5) * 2 * 9), fh = (6 + (1 - Math.abs(u - 0.5) * 2) * 10) * (0.7 + Math.sin(t * 12 + k * 2.1) * 0.3) * (big ? 1.4 : 1);
      ctx.fillStyle = 'rgba(255,90,20,0.45)'; ctx.beginPath(); ctx.moveTo(bx - 3, y + 3); ctx.quadraticCurveTo(bx, y - fh * 0.6, bx + Math.sin(t * 8 + k) * 2, y - fh); ctx.quadraticCurveTo(bx + 1, y - fh * 0.4, bx + 3, y + 3); ctx.fill();
      ctx.fillStyle = 'rgba(255,220,90,0.7)'; ctx.fillRect(R(bx), R(y - fh * 0.3), 1, 2); }
    for (let k = 0; k < (big ? 10 : 6); k++) { const ph = rise(t, k, 1.1); ctx.fillStyle = (big && k % 3 === 0) ? `rgba(140,210,255,${1 - ph})` : `rgba(255,${R(200 - ph * 120)},60,${1 - ph})`; ctx.fillRect(R(x + Math.sin(k * 5.3 + ph * 2) * 16), R(y - 6 - ph * h), 1, 2); } };
  // Alado Caído: halo de luz sobre la cabeza y plumas que caen despacio
  TR_AURA.alado = (x, y, t, F) => { haze(x, y, F === 2 ? 56 : 48, 'rgba(255,240,176,A)', 'rgba(255,236,170,0.24)');
    const hy = y - 44 + Math.sin(t * 2) * 1; ctx.strokeStyle = 'rgba(255,240,160,0.9)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, hy, 7, 2, 0, 0, 7); ctx.stroke();
    for (let k = 0; k < (F === 2 ? 6 : 4); k++) { const ph = rise(t, k, 0.35), px = x + Math.sin(k * 5.7) * 20 + Math.sin(t * 2 + k) * 4, py = y - 56 + ph * 58, a = Math.sin(t * 2.5 + k) * 0.8; ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.fillStyle = `rgba(255,250,230,${Math.min(1, (1 - ph) * 1.5)})`; ctx.beginPath(); ctx.ellipse(0, 0, 1.5, 4, 0, 0, 7); ctx.fill(); ctx.fillStyle = `rgba(220,200,140,${1 - ph})`; ctx.fillRect(0, -3, 0.6, 7); ctx.restore(); } };
  // Eco sin Pintar: trazos de lápiz que se redibujan alrededor y gotas de pintura gris
  TR_AURA.eco = (x, y, t, F) => { const fr = Math.floor(t * 8), n = F === 2 ? 3 : 2; ctx.lineWidth = 1;
    for (let k = 0; k < n; k++) { ctx.strokeStyle = k ? 'rgba(60,58,70,0.5)' : 'rgba(30,28,40,0.7)'; ctx.beginPath(); for (let s = 0; s <= 24; s++) { const a = s / 24 * 6.4 + k, j = Math.sin(fr * 3.1 + s * 1.7 + k * 5) * 2.2, px = x + Math.cos(a) * (17 + k * 3 + j), py = y - 18 + Math.sin(a) * (26 + k * 3 + j); s ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    for (let k = 0; k < (F === 2 ? 8 : 5); k++) { const s = (fr + k * 7) % 13, px = R(x + Math.sin(k * 4.1 + s) * 24), py = R(y - 20 + Math.cos(k * 2.7 + s) * 26); ctx.fillStyle = k % 2 ? 'rgba(232,230,224,0.9)' : 'rgba(26,26,36,0.8)'; ctx.fillRect(px, py, 2, 2); } };
  // Guardián de Hielo: cristales que giran, niebla fría y copos (Cristal 2.0: más cristales)
  TR_AURA.hielo = (x, y, t, F) => { const big = F >= 2; haze(x, y, big ? 56 : 48, 'rgba(168,224,255,A)', 'rgba(168,224,255,0.28)');
    for (let k = 0; k < (big ? 6 : 4); k++) { const a = t * 1.4 + k * Math.PI * 2 / (big ? 6 : 4), px = x + Math.cos(a) * 19, py = y - 18 + Math.sin(a) * 6 - (k % 2) * 10, front = Math.sin(a) > 0, s = 3;
      ctx.fillStyle = front ? 'rgba(224,248,255,0.95)' : 'rgba(168,224,255,0.4)'; ctx.beginPath(); ctx.moveTo(px, py - s * 1.6); ctx.lineTo(px + s * 0.7, py); ctx.lineTo(px, py + s * 1.6); ctx.lineTo(px - s * 0.7, py); ctx.closePath(); ctx.fill(); if (front) { ctx.fillStyle = '#ffffff'; ctx.fillRect(R(px) - 1, R(py) - 2, 1, 2); } }
    for (let k = 0; k < 5; k++) { const ph = rise(t, k, 0.4), px = R(x + Math.sin(k * 6.1 + t * 0.7) * 22), py = R(y - 54 + ph * 56); ctx.fillStyle = `rgba(255,255,255,${1 - ph * 0.7})`; ctx.fillRect(px - 1, py, 3, 1); ctx.fillRect(px, py - 1, 1, 3); } };
  // Engranaje 2: bocanadas de vapor que suben y calor rojizo
  TR_AURA.vapor = (x, y, t, F) => { haze(x, y, 50, 'rgba(255,138,122,A)', 'rgba(255,120,100,0.22)');
    for (let k = 0; k < 8; k++) { const ph = rise(t, k, 0.55), r = 2 + ph * 6, px = x + Math.sin(k * 3.3) * 14 + Math.sin(t * 2 + k) * 3 * ph, py = y - 8 - ph * 50; ctx.fillStyle = `rgba(255,236,230,${0.55 * (1 - ph)})`; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill(); } };
}
