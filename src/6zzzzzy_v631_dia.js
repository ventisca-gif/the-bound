// 6.31 · Día, tarde y noche en todo el Mar de Dawn (Sergio: «que todo el Mar de Dawn tenga sistema de noche, día y
// tarde; guíate por la hora que ya marca el reloj de la interfaz»).
// La hora es la del reloj del juego (G.time, la misma de la barra de arriba). El mapa 'dawn' (mar e islas) usaba
// oscuridad fija 0; ahora sigue el reloj como el mundo: amanecer rosado (5-7 h), día, tarde dorada (16-18:30 h),
// anochecer y noche azul (20-5 h). De noche se encienden las ventanas de las casas, los faroles del barco y una luz
// alrededor de la tripulación. Los interiores (bajo cubierta, armería, vestíbulo de la Marina, la Tortuga) no cambian.
function dawnSky(h) {
  if (h === undefined) h = (G.time / 60) % 24;
  // oscuridad (0-1) y tono de color encima, según la hora
  let d, tint = null;
  if (h >= 20 || h < 5) d = 1;
  else if (h >= 18.5) d = (h - 18.5) / 1.5;
  else if (h < 7) d = 1 - (h - 5) / 2;
  else d = 0;
  if (h >= 16 && h < 20) { const k = h < 18 ? (h - 16) / 2 : 1 - (h - 18) / 2; tint = `rgba(255,130,40,${(0.2 * k).toFixed(3)})`; }
  else if (h >= 5 && h < 7.5) { const k = h < 6 ? (h - 5) : 1 - (h - 6) / 1.5; tint = `rgba(255,140,170,${(0.16 * Math.max(0, k)).toFixed(3)})`; }
  const part = h >= 20 || h < 5 ? L2('noche', 'night') : h < 7 ? L2('amanecer', 'dawn') : h < 12 ? L2('mañana', 'morning') : h < 16 ? L2('mediodía', 'midday') : h < 20 ? L2('tarde', 'afternoon') : L2('noche', 'night');
  return { d: d * 0.6, tint, part };
}
hookAround('darkness', next => { const M = G.map; if (M && M.dawn) return dawnSky().d; return next(); });
// tono de tarde y de amanecer por encima de todo el mar
WORLD_DRAW.push(() => { const M = G.map; if (!M || !M.dawn || (typeof CINE !== 'undefined' && CINE.on)) return; const S = dawnSky(); if (!S.tint) return; ctx.save(); ctx.fillStyle = S.tint; ctx.fillRect(0, 0, VW, VH); ctx.restore(); });
// luces de noche: ventanas de los edificios de las islas, faroles del barco y la gente
hookAfter('collectLights', (out, M, cx, cy, list) => {
  if (!M || !M.dawn || !Array.isArray(out) || darkness() < 0.08) return;
  for (const d of list || []) {
    if (!d) continue;
    if (d.k && d.fp && d.fp.length >= 9) { const x = d.px - cx, y = d.py - cy; if (x < -120 || x > VW + 120 || y < -60 || y > VH + 160) continue; out.push({ x: d.px, y: d.py - 22, r: 46, c: 'rgba(255,196,110,0.5)' }); }
    else if (d.type === 'npc' && d.map === M.id) out.push({ x: d.x, y: d.y - 12, r: 26 });
  }
  const P = G.P; if (P && P.map === M.id) {
    out.push({ x: P.x, y: P.y - 10, r: 58, c: 'rgba(255,214,150,0.35)' });
    if (P.dawnHelm && P.dawnHelm.kind !== 'swim') for (const s of [-1, 1]) out.push({ x: P.x + s * 70, y: P.y - 26, r: 44, c: 'rgba(255,180,80,0.6)' });
  }
});
