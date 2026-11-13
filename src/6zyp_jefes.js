// ================= v4.17: JEFES CON MECÁNICAS Y MAPA CON ZOOM =================
// Los jefes del mundo ya no son solo golpear hasta que caigan: cada uno tiene algo que hay que leer y esquivar.
// Todo se avisa antes en el suelo. Rodar (botón de esquiva) te suelta del slime y te salva de las ondas.
const HZ = [];   // peligros en el suelo: {x, y, r, k, t0 (aviso hasta), t1 (fin), hit}
function hzAdd(x, y, r, k, warn, dur) { const col = { slime: '#7aff5a', root: '#8a6a3a', ice: '#9ae8ff', lava: '#ff6a2a', seal: '#ffd040', wave: '#ffb060' }[k]; addFx({ type: 'field', ground: true, x, y, r, dur: warn, col }); HZ.push({ x, y, r, k, t0: G.t + warn, t1: G.t + warn + dur, col, on: 0 }); }
const BMECH = {
  reyslime: { every: 7, name: L2('¡Escupe slime pegajoso!', 'It spits sticky slime!'), fn: (m, P) => { for (let i = 0; i < 3; i++) hzAdd(P.x + (Math.random() - 0.5) * (i ? 70 : 10), P.y + (Math.random() - 0.5) * (i ? 50 : 8), 18, 'slime', 0.9, 4); } },
  ent: { every: 8, name: L2('¡Las raíces salen del suelo!', 'Roots burst from the ground!'), fn: (m, P) => { const a = Math.atan2(P.y - m.y, P.x - m.x); for (let k = 1; k <= 6; k++) hzAdd(m.x + Math.cos(a) * k * 22, m.y + Math.sin(a) * k * 16, 14, 'root', 0.6 + k * 0.08, 0.6); } },
  gruk: { every: 9, name: L2('¡Tambor de guerra! Rueda cuando llegue la onda', 'War drum! Roll when the wave arrives'), fn: (m, P) => { for (let k = 0; k < 3; k++) HZ.push({ k: 'wave', x: m.x, y: m.y, r: 0, grow: 110, t0: G.t + 0.4 + k * 0.9, t1: G.t + 1.6 + k * 0.9, col: '#ffb060', ring: 1 }); m.enrT = G.t + 5; } },
  morgana: { every: 11, name: L2('¡Maleficio! Tus pasos van al revés', 'Hex! Your steps are reversed'), fn: (m, P) => { addFx({ type: 'ring', x: P.x, y: P.y, r: 30, dur: 0.6, col: '#c070ff' }); setTimeout(() => { if (!G.P.dead && Math.hypot(G.P.x - m.x, G.P.y - m.y) < 260) G.P.revT = 4; }, 700); } },
  golemhielo: { every: 7, name: L2('¡El suelo se congela!', 'The ground freezes!'), fn: (m, P) => { for (let i = 0; i < 4; i++) hzAdd(P.x + (Math.random() - 0.5) * 90, P.y + (Math.random() - 0.5) * 60, 22, 'ice', 0.8, 6); } },
  volcanus: { every: 6, name: L2('¡Erupción!', 'Eruption!'), fn: (m, P) => { for (let i = 0; i < 4; i++) hzAdd(P.x + (Math.random() - 0.5) * (i ? 100 : 16), P.y + (Math.random() - 0.5) * (i ? 70 : 10), 20, 'lava', 1, 5); } },
  vael: { every: 9, name: L2('¡El rey muerto llama a sus soldados!', 'The dead king calls his soldiers!'), fn: (m, P) => { for (let k = 0; k < 2; k++) { const s = spawnMob('esqueleto', Math.max(1, m.lv - 4), m.x + (k ? 40 : -40), m.y + 20, m.L, null, false); if (s) s.map = m.map; } } },
};
// Vael a mitad de vida: inmune hasta que actives 3 sellos (quédate encima un momento)
function vaelPhase(m) { if (m.mid !== 'vael' || m.vaelP || m.hp > m.maxhp * 0.5) return; m.vaelP = 1; m.invuln = 1; banner(L2('El Rey Muerto se protege', 'The Dead King shields himself'), L2('Activa los 3 sellos dorados', 'Activate the 3 golden seals')); m.seals = [];
  for (let k = 0; k < 3; k++) { const a = k * 2.1 + 0.4, h = { k: 'seal', x: m.x + Math.cos(a) * 80, y: m.y + Math.sin(a) * 55, r: 16, t0: G.t, t1: G.t + 999, col: '#ffd040', prog: 0, boss: m }; HZ.push(h); m.seals.push(h); } }
{ const _hm = hitMob; hitMob = function (m, base, src) { if (m && m.invuln) { if (!m._invT || G.t - m._invT > 0.6) { m._invT = G.t; floatText(m.x, m.y - 30, L2('INMUNE', 'IMMUNE'), '#ffd040'); } return 0; } return _hm.apply(this, arguments); }; }
// tick: lanzar mecánicas y aplicar peligros
function bossMechTick(dt) {
  const P = G.P, M = G.map; if (!P || !M) return;
  for (const s of ['rootT', 'revT', 'slowT', 'iceT']) if (P[s] > 0) P[s] = Math.max(0, P[s] - dt);
  for (const m of G.ents) { if (m.type !== 'mob' || !m.boss || m.dying || m.map !== M.id) continue; const B = BMECH[m.mid]; if (m.mid === 'vael') vaelPhase(m); if (!B || P.dead) continue;
    if (Math.hypot(P.x - m.x, P.y - m.y) > 260 || m.state === 'idle') continue; m.mech = (m.mech || 0) + dt; if (m.mech < B.every) continue; m.mech = 0; toast(B.name, 'warn', 2); try { B.fn(m, P); } catch (e) { } }
  for (let i = HZ.length - 1; i >= 0; i--) { const h = HZ[i]; if (G.t > h.t1 || (h.boss && h.boss.dying)) { HZ.splice(i, 1); continue; } if (G.t < h.t0) continue;
    if (h.ring) h.r = h.grow * (G.t - h.t0) / (h.t1 - h.t0);
    const d = Math.hypot(P.x - h.x, (P.y - h.y) * 1.3), inside = h.ring ? Math.abs(d - h.r) < 9 : d < h.r; if (!inside || P.dead) { if (h.k === 'ice') h.on = 0; continue; }
    if (h.k === 'slime' && !h.hit && !(P.ifr > 0)) { h.hit = 1; P.rootT = 1.6; floatText(P.x, P.y - 36, L2('¡PEGADO!', 'STUCK!'), '#7aff5a'); }
    if (h.k === 'root' && !h.hit && !(P.ifr > 0)) { h.hit = 1; P.rootT = 1; hurtPlayer(P.S.maxhp * 0.08, { lv: P.lv }); }
    if (h.k === 'wave' && !h.hit && !(P.ifr > 0)) { h.hit = 1; hurtPlayer(P.S.maxhp * 0.12, { lv: P.lv }); }
    if (h.k === 'ice') { P.slowT = 0.3; h.on += dt; if (h.on > 2 && !h.hit) { h.hit = 1; P.rootT = 1.2; floatText(P.x, P.y - 36, L2('¡CONGELADO!', 'FROZEN!'), '#9ae8ff'); } }
    if (h.k === 'lava') { h.tick = (h.tick || 0) + dt; if (h.tick > 0.5) { h.tick = 0; hurtPlayer(P.S.maxhp * 0.05, { lv: P.lv }); } }
    if (h.k === 'seal' && !h.done) { h.prog += dt; if (h.prog > 1.5) { h.done = 1; h.col = '#ffffff'; burst(h.x, h.y, 20, { sp: 60, up: 50, g: -20, life: 0.8, c: ['#ffd040', '#ffffff'] }); sfx('questdone'); const m = h.boss; if (m && m.seals.every(s => s.done)) { m.invuln = 0; m.stun = 3; banner(L2('¡Sellos activados!', 'Seals activated!'), L2('El Rey Muerto queda expuesto', 'The Dead King is exposed')); for (const s of m.seals) s.t1 = G.t; } } } }
}
V33_TICKS.push(bossMechTick);
{ const _mi = moveInput; moveInput = function () { let [x, y] = _mi(); const P = G.P; if (P) { if (P.rootT > 0) return [0, 0]; if (P.revT > 0) { x = -x; y = -y; } if (P.slowT > 0) { x *= 0.5; y *= 0.5; } } return [x, y]; }; }
{ const _dr = dodgeRoll; dodgeRoll = function () { const P = G.P; if (P && P.rootT > 0) { P.rootT = 0; P.dashCd = 0; floatText(P.x, P.y - 36, L2('¡Te soltaste!', 'Broke free!'), '#ffffff'); } return _dr.apply(this, arguments); }; }
// dibujo: peligros activos y el estado del jugador
function drawHazards(cx, cy) { for (const h of HZ) { if (G.t < h.t0) continue; const x = h.x - cx, y = h.y - cy; ctx.save();
  if (h.ring) { ctx.strokeStyle = h.col; ctx.globalAlpha = 0.8; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, h.r, h.r * 0.75, 0, 0, 7); ctx.stroke(); }
  else { ctx.globalAlpha = h.k === 'seal' ? 0.5 + 0.3 * Math.sin(G.t * 4) : 0.45; ctx.fillStyle = h.col; ctx.beginPath(); ctx.ellipse(x, y, h.r, h.r * 0.7, 0, 0, 7); ctx.fill(); if (h.k === 'seal') { ctx.globalAlpha = 1; ctx.strokeStyle = '#fff4c0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 1, 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, h.prog / 1.5)); ctx.stroke(); } }
  ctx.restore(); } }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e === G.P && HZ.length) drawHazards(cx, cy); _de(e, cx, cy);
  if (e === G.P) { const x = Math.round(e.x - cx), y = Math.round(e.y - cy);
    if (e.rootT > 0) { ctx.fillStyle = e.iceT > 0 ? 'rgba(160,230,255,0.85)' : 'rgba(110,230,80,0.85)'; ctx.beginPath(); ctx.ellipse(x, y - 1, 9, 4, 0, 0, 7); ctx.fill(); ctx.fillRect(x - 7, y - 5, 14, 4); }
    if (e.revT > 0 && Math.random() < 0.4) part(e.x + (Math.random() - 0.5) * 14, e.y - 30, { z: 0, vz: 10, life: 0.6, c: '#c070ff', s: 1 });
    if (e.slowT > 0 && Math.random() < 0.3) part(e.x + (Math.random() - 0.5) * 14, e.y - 4, { z: 2, vz: 6, life: 0.5, c: '#bfefff', s: 1 }); } }; }
// Gruk enfurecido se mueve más rápido
{ const _um = updateMob; updateMob = function (m, dt) { if (m.enrT && m.enrT > G.t) { const s = m.spd; m.spd = s * 1.5; try { return _um(m, dt); } finally { m.spd = s; } } return _um(m, dt); }; }

// ---------- mapa: zoom con dos dedos, arrastrar con uno y botones ----------
const MAPZ = { s: 1, x: 0, y: 0, key: '' };
function mapZoomWire() {
  const cvs = $('#wm'); if (!cvs || cvs.parentElement.classList.contains('mzoom')) return;
  const wrap = document.createElement('div'); wrap.className = 'mzoom'; cvs.parentElement.insertBefore(wrap, cvs); wrap.appendChild(cvs);
  wrap.insertAdjacentHTML('beforeend', `<div class="mzbtns"><button data-mz="1">+</button><button data-mz="-1">−</button><button data-mz="0">⟲</button></div>`);
  const key = String(MAPW); if (MAPZ.key !== key) { MAPZ.s = 1; MAPZ.x = 0; MAPZ.y = 0; MAPZ.key = key; }
  const apply = () => { MAPZ.s = clamp(MAPZ.s, 1, 6); const mw = cvs.offsetWidth * (MAPZ.s - 1), mh = cvs.offsetHeight * (MAPZ.s - 1); MAPZ.x = clamp(MAPZ.x, -mw, 0); MAPZ.y = clamp(MAPZ.y, -mh, 0); cvs.style.transformOrigin = '0 0'; cvs.style.transform = `translate(${MAPZ.x}px,${MAPZ.y}px) scale(${MAPZ.s})`; };
  const zoomAt = (ns, px, py) => { const s0 = MAPZ.s; ns = clamp(ns, 1, 6); MAPZ.x = px - (px - MAPZ.x) * ns / s0; MAPZ.y = py - (py - MAPZ.y) * ns / s0; MAPZ.s = ns; apply(); };
  wrap.querySelectorAll('[data-mz]').forEach(b => b.onclick = e => { e.stopPropagation(); const v = +b.dataset.mz, w = wrap.clientWidth / 2, h = wrap.clientHeight / 2; if (!v) { MAPZ.s = 1; MAPZ.x = 0; MAPZ.y = 0; apply(); } else zoomAt(MAPZ.s * (v > 0 ? 1.5 : 1 / 1.5), w, h); });
  const pts = new Map(); let d0 = 0, s0 = 1, moved = 0, last = null;
  const rel = e => { const r = wrap.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  wrap.addEventListener('pointerdown', e => { pts.set(e.pointerId, rel(e)); moved = 0; if (pts.size === 2) { const [a, b] = [...pts.values()]; d0 = Math.hypot(a[0] - b[0], a[1] - b[1]); s0 = MAPZ.s; } last = rel(e); });
  wrap.addEventListener('pointermove', e => { if (!pts.has(e.pointerId)) return; const p = rel(e); pts.set(e.pointerId, p);
    if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (d0 > 10) { zoomAt(s0 * d / d0, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); moved = 1; } }
    else if (pts.size === 1 && MAPZ.s > 1 && last) { const dx = p[0] - last[0], dy = p[1] - last[1]; if (Math.abs(dx) + Math.abs(dy) > 2) moved = 1; MAPZ.x += dx; MAPZ.y += dy; apply(); }
    last = p; e.preventDefault(); });
  const up = e => { pts.delete(e.pointerId); if (pts.size < 2) d0 = 0; last = pts.size ? [...pts.values()][0] : null; };
  wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  wrap.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
  wrap.addEventListener('wheel', e => { e.preventDefault(); const [px, py] = rel(e); zoomAt(MAPZ.s * (e.deltaY < 0 ? 1.2 : 1 / 1.2), px, py); }, { passive: false });
  apply();
}
{ const _rm = renderMap; renderMap = function (B) { const r = _rm(B); try { mapZoomWire(); } catch (e) { } return r; }; }
{ const st = document.createElement('style'); st.textContent = '.mzoom{position:relative;overflow:hidden;touch-action:none;max-width:100%}.mzoom canvas{display:block}.mzbtns{position:absolute;right:6px;bottom:6px;display:flex;flex-direction:column;gap:4px}.mzbtns button{width:34px;height:34px;border-radius:8px;border:2px solid #c8a060;background:rgba(42,30,20,.9);color:#ffe8a0;font-size:18px;font-family:inherit}'; document.head.appendChild(st); }
