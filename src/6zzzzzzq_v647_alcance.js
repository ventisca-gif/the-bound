// ================= 6.47: LOS ATAQUES EN ÁREA PEGAN DONDE SE VE LA ZONA ROJA =================
// Sergio: el Devorador Carmesí le pegaba «aunque no esté en su rango». Causa (de todos los enemigos y jefes): las zonas
// circulares de aviso se DIBUJAN como elipses aplanadas (alto = 0,6 × ancho, el suelo en perspectiva; drawFx 'tele'), pero
// el golpe comprobaba un círculo completo (dist2 < r²): por encima y por debajo del enemigo te alcanzaba hasta un 40 % más
// lejos de lo que mostraba la zona. Ahora, mientras se resuelve una zona circular, el daño a ti solo entra si estás dentro de
// la elipse dibujada (margen del 5 %). No cambia el dibujo ni los golpes a los enemigos (tus habilidades siguen igual).
let TELE_CUR = null;
hookAround('telegraph', (next, o) => { if (o && o.shape === 'circle' && o.r > 0 && typeof o.cb === 'function') { const cb = o.cb; o.cb = f => { const prev = TELE_CUR; TELE_CUR = f; try { return cb(f); } finally { TELE_CUR = prev; } }; } return next(o); });
hookBefore('hurtPlayer', () => { const f = TELE_CUR, P = G.P; if (!f || !P) return; const dx = P.x - f.x, dy = (P.y - f.y) / 0.6; if (dx * dx + dy * dy > f.r * f.r * 1.05) return HOOK_SKIP; });
// Devorador Carmesí (asedio de la Luna de Sangre): un 15 % menos de daño, pisotón cada 13-17 s (antes 10-14) y un anillo en
// el suelo que siempre marca dónde están sus pies y hasta dónde llega su golpe (sus pies suelen quedar tapados por las casas).
hookAfter('spawnMob', m => { if (m && m.mid === 'devorador_carmesi' && !m._dv47) { m._dv47 = 1; m.atk = Math.round(m.atk * 0.85); } });
hookAfter('devourerStomp', (r, b) => { if (b) b.stompT = (b.stompT || G.t) + 3; });
hookBefore('drawEnt', (e, cx, cy) => { if (!e || e.mid !== 'devorador_carmesi' || e.dying) return; const x = Math.round(e.x - cx), y = Math.round(e.y - cy), r = (e.range || 46) + 8, pul = 0.5 + Math.sin(G.t * 4) * 0.2;
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(x, y, 34, 12, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = `rgba(255,60,60,${pul})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.6, 0, 0, 7); ctx.stroke(); ctx.restore(); });
// 6.47: un jefe que dejaron tocado los jugadores cazadores (versiones 6.44-6.46) recupera toda la vida en cuanto te acercas
// o lo atacas, también los jefes del mundo que guardan su vida al alejarte (spot.hpLeft).
V33_TICKS.push(() => { const P = G.P; if (!P || !G.map) return; for (const m of G.ents) { if (m.type !== 'mob' || !m.boss || m.dying || m.map !== P.map || !(m._aihHurt || m._aihV)) continue; if (dist2(m.x, m.y, P.x, P.y) < 320 * 320 || P.target === m) { if (m._aihHurt && m.hp < m.maxhp) { m.hp = m.maxhp; floatText(m.x, m.y - (m.hgt || 40) - 10, L2('¡Recuperado!', 'Recovered!'), '#8aff8a'); } m._aihHurt = 0; m._aihV = 0; } } });
