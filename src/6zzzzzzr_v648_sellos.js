// ================= 6.48: FASE DE LOS SELLOS (Rey Vael y jefes del Velo Roto) SIN QUEDARSE INMUNE PARA SIEMPRE =================
// Sergio: «el Rey Vael es inmune a mis golpes por mucho tiempo». Es la mecánica de vaelPhase (6zyp_jefes) y vrSeal
// (6zys_velo_roto): a mitad de vida se vuelve inmune hasta pisar 3 sellos dorados. Fallos: los sellos salían a 80-90 px
// sin mirar el terreno (en las Ruinas podían caer dentro de columnas o muros e imposibles de pisar), no recordaban su mapa
// (si el jefe desaparecía al alejarte y volvía, quedaban sellos viejos) y nada rompía el escudo si algo fallaba.
function sealSpot(M, bx, by, x, y, L) { if (!M) return [x, y]; const bt = [Math.floor(bx / 16), Math.floor(by / 16)], seen = new Map(), q = [bt]; seen.set(bt[0] + ',' + bt[1], 1);
  for (let i = 0; i < q.length && i < 900; i++) { const [cx, cy] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny; if (seen.has(k) || Math.abs(nx - bt[0]) > 9 || Math.abs(ny - bt[1]) > 9 || blockedFor(M, nx, ny, L)) continue; seen.set(k, 1); q.push([nx, ny]); } }
  let best = null, bd = 1e9; for (const [tx, ty] of q) { const px = tx * 16 + 8, py = ty * 16 + 8, d = Math.hypot(px - x, py - y); if (d < bd && Math.hypot(px - bx, py - by) > 40) { bd = d; best = [px, py]; } } return best || [x, y]; }
function sealFix(r, m) { if (!m || !m.seals || m._sealFix === m.seals) return; m._sealFix = m.seals; m.invT0 = G.t; const M = G.maps[m.map] || (m.map === 'world' ? G.world : G.map);
  for (const h of m.seals) { const [x, y] = sealSpot(M, m.x, m.y, h.x, h.y, m.L || 0); h.x = x; h.y = y; h.map = m.map; }
  toast('🔱 ' + L2('El jefe es inmune: pisa los 3 sellos dorados (quédate encima un momento).', 'The boss is immune: stand on the 3 golden seals for a moment.'), 'warn', 5); }
hookAfter('vaelPhase', sealFix); hookAfter('vrSeal', sealFix);
V33_TICKS.push(() => { const P = G.P, M = G.map; if (!P || !M || typeof HZ === 'undefined') return;
  // sellos huérfanos (su jefe ya no está) o de otro mapa: fuera
  for (let i = HZ.length - 1; i >= 0; i--) { const h = HZ[i]; if (h.k !== 'seal') continue; const b = h.boss; if (!b || b.remove || b.dying || (h.map && h.map !== M.id) || (b.map && b.map !== M.id)) HZ.splice(i, 1); }
  for (const m of G.ents) { if (m.type !== 'mob' || !m.boss || !m.invuln || !m.seals || m.dying || m.map !== M.id) continue; if (m.invT0 === undefined) m.invT0 = G.t;
    const live = m.seals.filter(s => HZ.includes(s) && !s.done);
    if ((!live.length && !m.seals.every(s => s.done)) || G.t - m.invT0 > 35) { m.invuln = 0; m.stun = Math.max(m.stun || 0, 2); for (const s of m.seals) s.t1 = G.t; banner(L2('¡El escudo se rompe!', 'The shield breaks!'), L2('El jefe vuelve a recibir daño', 'The boss takes damage again')); continue; }
    if (Math.hypot(P.x - m.x, P.y - m.y) < 300 && G.t - (m._sealHint || 0) > 6) { m._sealHint = G.t; floatText(m.x, m.y - (m.hgt || 40) - 14, L2('INMUNE · pisa los sellos ', 'IMMUNE · stand on the seals ') + m.seals.filter(s => s.done).length + '/3', '#ffd040'); } } });
// rótulo y progreso de cada sello
WORLD_DRAW.push((cx, cy) => { const M = G.map; if (!M || typeof HZ === 'undefined') return; for (const h of HZ) { if (h.k !== 'seal' || h.done || (h.map && h.map !== M.id)) continue; const x = Math.round(h.x - cx), y = Math.round(h.y - cy); const s = textSprite(L2('SELLO', 'SEAL'), '#ffd040'); ctx.drawImage(s, x - (s.width >> 1), y - 22);
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(x - 11, y - 13, 22, 3); ctx.fillStyle = '#ffe070'; ctx.fillRect(x - 11, y - 13, Math.round(22 * Math.min(1, (h.prog || 0) / 1.5)), 3); } });
