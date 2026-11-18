// ================= v5.24: LOS TRABAJOS Y JUEGOS DE LOS PAÍSES, DENTRO DEL MAPA =================
// Sergio: «que no sean interfaces, que sea en el mismo juego». Ahora se juegan en el mapa, moviéndote con el joystick:
//  · Sandboard: te dan la tabla en la cima del Cerro Carretas y bajas la duna de verdad, pasando entre banderas.
//  · Fútbol: partido real 3 contra 3 en el Gran Estadio de Madrid (portero incluido). Chutas con el botón de atacar.
//  · Vóley en Comas: 3 contra 3 con la red; corre hasta donde va a caer la pelota (su sombra) para devolverla.
//  · Bailes (Ballet Folklórico, marinera, flamenco, Concurso Nacional): bailas en la tarima y las flechas caen sobre tu
//    cabeza, sin ventanas.
//  · Los oficios de los países dan el triple de experiencia (subían muy despacio).
const ACT = { k: null };
const COUNTRY_JOBS = new Set(['taquero', 'taxista', 'chofer', 'mototaxi', 'cajero', 'futbolista', 'folklorico', 'ambulante', 'sandboard']);
{ const _gj = gainJobXp; gainJobXp = function (job, n) { return _gj.call(this, job, COUNTRY_JOBS.has(job) ? Math.round((n || 0) * 3) : n); }; }
{ const _ba = basicAttack; basicAttack = function () { if (ACT.k && ACT.onAtk && ACT.onAtk()) return; return _ba.apply(this, arguments); }; }
const actBusy = () => { if (ACT.k) { toast(L2('Termina primero lo que estás haciendo.', 'Finish what you are doing first.'), 'warn'); return true; } return false; };
function actEnd() { ACT.k = null; ACT.onAtk = null; mgHud(null); }
const aDist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function npcStep(e, tx, ty, sp, dt) { const dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy); if (d < 2) { e.anim = 'idle'; return; } const v = Math.min(d, sp * dt); e.x += dx / d * v; e.y += dy / d * v; e.anim = 'walk'; e.af = Math.floor(G.t * 8) % 4; e.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
function actNpc(id, x, y, map) { const e = spawnNPC(id, x, y, map, { face: 'down' }); if (e) { e.scene = 1; e.noTag = 1; e.actTmp = 1; } return e; }
const actClean = () => { for (const e of G.ents) if (e.actTmp) e.remove = true; G.ents = G.ents.filter(e => !e.remove); };

// ---------- SANDBOARD en la duna ----------
trSandboard = function () { const P = G.P, M = G.map; if (actBusy() || !M || M.id !== 'trujillo') return; if (P.mount) { P.mount = null; calcStats(P); mountBtn(); }
  const top = TR_DUNA.top, gates = [], rocks = []; for (let k = 1; k <= 12; k++) { const y = top[1] + k * 9, x = top[0] + Math.round(Math.sin(k * 1.3) * 7); gates.push({ x: x * 16 + 8, y: y * 16, w: 40, ok: 0, done: 0 }); }
  for (let k = 0; k < 16; k++) rocks.push({ x: (top[0] + Math.round((Math.random() - 0.5) * 22)) * 16, y: (top[1] + 6 + Math.random() * 104) * 16, hit: 0 });
  P.x = top[0] * 16 + 8; P.y = top[1] * 16 + 8; P.dir = 'down';
  Object.assign(ACT, { k: 'sb', t: 0, gates, rocks, pass: 0, hits: 0, end: top[1] + 112, vy: 40 }); banner('🏂 ' + L2('¡Tabla puesta!', 'Board on!'), L2('Bajas solo: gira con el joystick y pasa entre las banderas.', 'You slide down by yourself: steer with the joystick and pass between the flags.')); };
V33_TICKS.push(dt => { if (ACT.k !== 'sb') return; dt = dt || 0.016; const P = G.P, M = G.map, A = ACT; if (!M || M.id !== 'trujillo' || P.dead) { actEnd(); return; } A.t += dt; A.vy = Math.min(230, A.vy + 90 * dt);
  P.y += A.vy * dt; P.dir = 'down';
  if (Math.random() < 0.6) part(P.x + (Math.random() - 0.5) * 14, P.y + 4, { vz: 20 + Math.random() * 30, vx: (Math.random() - 0.5) * 40, g: 90, life: 0.5, c: '#e2cfa4', s: 2 });
  for (const g of A.gates) if (!g.done && P.y > g.y) { g.done = 1; if (Math.abs(P.x - g.x) < g.w / 2) { A.pass++; sfx('coin'); floatText(P.x, P.y - 40, '🚩 +1', '#ffd040'); } else floatText(P.x, P.y - 40, L2('¡Fuera!', 'Missed!'), '#ff8a8a'); }
  for (const r of A.rocks) if (!r.hit && Math.abs(P.y - r.y) < 10 && Math.abs(P.x - r.x) < 12) { r.hit = 1; A.hits++; A.vy *= 0.4; G.shake = 4; sfx('hurt'); floatText(P.x, P.y - 40, L2('¡Piedra!', 'Rock!'), '#ff8a8a'); }
  mgHud(`🏂 🚩 ${A.pass}/${A.gates.length} · 🪨 ${A.hits}`);
  if (P.y / 16 >= A.end || A.t > 45 || P.x / 16 < TR_DUNA.x0 + 1) { const score = Math.max(0, A.pass * 2 - A.hits), gold = Math.round((200 + score * 70) * (1 + jobPerkSum('sbG') / 100)); P.gold += gold; gainJobXp('sandboard', 30 + score * 8); actEnd(); banner('🏂 ' + L2('¡Abajo!', 'Down!'), A.pass + L2(' banderas · ', ' flags · ') + A.hits + L2(' golpes · +', ' bumps · +') + gold + L2(' de oro', ' gold')); sfx('quest'); markDirty(); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'sb' || G.map.id !== 'trujillo') return; for (const g of ACT.gates) { if (g.done) continue; for (const s of [-1, 1]) { const x = g.x + s * g.w / 2 - cx, y = g.y - cy; if (y < -30 || y > VH + 30) continue; ctx.fillStyle = '#1a1a1e'; ctx.fillRect(x, y - 22, 2, 22); ctx.fillStyle = s < 0 ? '#e83a3a' : '#3a8ae8'; ctx.fillRect(x + 2, y - 22, 10, 7); } }
  for (const r of ACT.rocks) { const x = r.x - cx, y = r.y - cy; if (y < -20 || y > VH + 20) continue; ctx.fillStyle = '#7a6e62'; ctx.beginPath(); ctx.ellipse(x, y, 10, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#9a8e80'; ctx.fillRect(x - 5, y - 4, 5, 2); } });
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e === G.P && ACT.k === 'sb') { const x = Math.round(e.x - cx), y = Math.round(e.y - cy); ctx.save(); ctx.translate(x, y + 1); ctx.rotate(Math.sin(G.t * 3) * 0.12); ctx.fillStyle = '#ff8a3a'; ctx.beginPath(); ctx.ellipse(0, 0, 15, 4, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1a1e'; ctx.fillRect(-7, -1, 3, 2); ctx.fillRect(4, -1, 3, 2); ctx.restore();
    const a0 = e.anim, z0 = e.z; e.anim = 'idle'; e.z = (z0 || 0) + 3; try { return _de.call(this, e, cx, cy); } finally { e.anim = a0; e.z = z0; } } return _de.apply(this, arguments); }; }

// ---------- FÚTBOL: partido 3 contra 3 en el Gran Estadio ----------
function esMatch() { const P = G.P, M = G.map; if (actBusy() || !M || M.id !== 'espana') return; if (P.mount) { P.mount = null; calcStats(P); mountBtn(); }
  const S = ES_STAD, cy = Math.round((S.y0 + S.y1) / 2) * 16 - 8, F = { x0: (S.x0 + 5) * 16, x1: (S.x1 - 4) * 16, y0: (S.y0 + 5) * 16, y1: (S.y1 - 2) * 16, cy, cx: Math.round((S.x0 + S.x1) / 2) * 16 + 8 };
  for (const e of G.ents) if (e.map === 'espana' && (e.id === 'es_jugador' || e.id === 'es_portero')) { e.actOld = [e.x, e.y, e.scene]; e.scene = 1; e.x = F.cx + (Math.random() - 0.5) * 300; e.y = (S.y1 - 1) * 16 + 4; e.anim = 'idle'; e.dir = 'up'; }
  ipNpc('es_rival', L2('Rival', 'Rival'), L2('Fútbol', 'Football'), 'es', 'm', 3, L2('¡A por el balón!', 'Go for the ball!'), { body: 'c_mx_camiseta' });
  const mk = (id, team, role, hx, hy) => { const e = actNpc(id, hx, hy, 'espana'); if (e) Object.assign(e, { team, role, hx, hy, kcd: 0 }); return e; };
  const pl = [mk('es_jugador', 0, 'gk', F.x0 + 6, cy), mk('es_jugador', 0, 'df', F.cx - 120, cy - 40), mk('es_jugador', 0, 'fw', F.cx - 40, cy + 40), mk('es_rival', 1, 'gk', F.x1 - 6, cy), mk('es_rival', 1, 'df', F.cx + 120, cy + 40), mk('es_rival', 1, 'fw', F.cx + 40, cy - 40)].filter(Boolean);
  Object.assign(ACT, { k: 'fut', F, pl, ball: { x: F.cx, y: cy, vx: 0, vy: 0 }, sc: [0, 0], t: 120, px: P.x, py: P.y, kick: 0, onAtk: () => { const b = ACT.ball; if (aDist(P, b) > 26) return true; const gx = F.x1 + 20, gy = F.cy, dx = gx - b.x, dy = gy - b.y, d = Math.hypot(dx, dy) || 1, fv = DIRV[P.dir] || [1, 0]; const vx = (dx / d) * 0.6 + fv[0] * 0.4, vy = (dy / d) * 0.6 + fv[1] * 0.4, n = Math.hypot(vx, vy) || 1; b.vx = vx / n * 330; b.vy = vy / n * 330; sfx('hit'); setAnim(P, 'atk'); return true; } });
  esKickoff(0); banner('⚽ ' + L2('¡Partido!', 'Match!'), L2('Ataca hacia la derecha. Acércate al balón y pulsa ⚔ para chutar. 2 minutos.', 'Attack to the right. Get to the ball and press ⚔ to shoot. 2 minutes.')); }
function esKickoff(toward) { const A = ACT, F = A.F, P = G.P; A.ball = { x: F.cx, y: F.cy, vx: 0, vy: 0 }; for (const e of A.pl) { e.x = e.hx; e.y = e.hy; } P.x = F.cx - 30; P.y = F.cy; P.dir = 'right'; A.pause = 1.2; }
V33_TICKS.push(dt => { if (ACT.k !== 'fut') return; dt = Math.min(0.05, dt || 0.016); const A = ACT, P = G.P, F = A.F, b = A.ball; if (!G.map || G.map.id !== 'espana' || P.dead) { esMatchEnd(); return; }
  A.t -= dt; const pvx = (P.x - A.px) / dt, pvy = (P.y - A.py) / dt; A.px = P.x; A.py = P.y; P.x = Math.max(F.x0 - 10, Math.min(F.x1 + 10, P.x)); P.y = Math.max(F.y0, Math.min(F.y1, P.y));
  if (A.pause > 0) { A.pause -= dt; } else {
    if (aDist(P, b) < 11 && Math.hypot(pvx, pvy) > 20) { b.vx = pvx * 1.15; b.vy = pvy * 1.15; }
    const near = t => A.pl.filter(e => e.team === t && e.role !== 'gk').sort((p, q) => aDist(p, b) - aDist(q, b))[0];
    for (const e of A.pl) { e.kcd -= dt; const gx = e.team ? F.x0 - 20 : F.x1 + 20;
      if (e.role === 'gk') { const ty = Math.max(F.cy - 34, Math.min(F.cy + 34, b.y)); npcStep(e, e.hx, ty, 70, dt); }
      else if (near(e.team) === e) npcStep(e, b.x + (e.team ? 8 : -8), b.y, 74, dt); else npcStep(e, e.hx + (b.x - F.cx) * 0.4, e.hy + (b.y - F.cy) * 0.3, 60, dt);
      if (e.kcd <= 0 && aDist(e, b) < 12) { e.kcd = 0.8; const tx = e.role === 'gk' ? F.cx : gx, ty = F.cy + (Math.random() - 0.5) * (e.role === 'gk' ? 160 : 70), dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy) || 1, sp = e.role === 'gk' ? 260 : 200 + Math.random() * 60; b.vx = dx / d * sp; b.vy = dy / d * sp; sfx('hit'); } }
    b.x += b.vx * dt; b.y += b.vy * dt; const fr = Math.pow(0.45, dt); b.vx *= fr; b.vy *= fr;
    if (b.y < F.y0) { b.y = F.y0; b.vy = Math.abs(b.vy) * 0.7; } if (b.y > F.y1) { b.y = F.y1; b.vy = -Math.abs(b.vy) * 0.7; }
    const inMouth = Math.abs(b.y - F.cy) < 30;
    if (b.x > F.x1 + 6) { if (inMouth) { A.sc[0]++; banner('⚽ ¡GOOOL!', A.sc[0] + ' - ' + A.sc[1]); sfx('level'); esKickoff(1); } else { b.x = F.x1 + 6; b.vx = -Math.abs(b.vx) * 0.6; } }
    if (b.x < F.x0 - 6) { if (inMouth) { A.sc[1]++; banner('⚽ ' + L2('Gol del rival', 'Rival goal'), A.sc[0] + ' - ' + A.sc[1]); sfx('hurt'); esKickoff(0); } else { b.x = F.x0 - 6; b.vx = Math.abs(b.vx) * 0.6; } } }
  mgHud(`⚽ <b>${L2('Tú', 'You')} ${A.sc[0]} - ${A.sc[1]} ${L2('Rival', 'Rival')}</b> · ${Math.max(0, Math.ceil(A.t))} s`); if (A.t <= 0) esMatchEnd(true); });
function esMatchEnd(fin) { const A = ACT, P = G.P; if (A.k !== 'fut') return; actClean(); for (const e of G.ents) if (e.actOld) { [e.x, e.y, e.scene] = e.actOld; e.actOld = null; } const sc = A.sc || [0, 0]; actEnd(); if (!fin) return;
  const win = sc[0] > sc[1], gold = Math.round((400 + sc[0] * 300 + (win ? 1500 : sc[0] === sc[1] ? 500 : 0)) * (1 + jobPerkSum('fbG') / 100)); P.gold += gold; gainJobXp('futbolista', 60 + sc[0] * 30 + (win ? 60 : 0)); sfx(win ? 'level' : 'quest'); banner('⚽ ' + (win ? L2('¡Victoria!', 'Victory!') : sc[0] === sc[1] ? L2('Empate', 'Draw') : L2('Derrota', 'Defeat')) + ' ' + sc[0] + ' - ' + sc[1], '+' + gold + L2(' de oro', ' gold')); markDirty(); }
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'fut' || G.map.id !== 'espana') return; const b = ACT.ball, x = Math.round(b.x - cx), y = Math.round(b.y - cy); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x, y + 3, 5, 2, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x, y - 2, 4, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1a1e'; ctx.fillRect(x - 1, y - 3, 2, 2); });
DLG_HOOKS.push((npc, opts) => { if (npc.id === 'es_entrenador') opts.unshift({ label: '⚽ ' + L2('Jugar un partido 3 contra 3 (oficio)', 'Play a 3-a-side match (job)'), icon: ['run'], fn: () => { closeDialog(); esMatch(); } }); });

// ---------- VÓLEY en Comas, en la cancha ----------
pnVoley = function () { const P = G.P, M = G.map; if (actBusy() || !M || M.id !== 'lima_norte') return; if (P.mount) { P.mount = null; calcStats(P); mountBtn(); }
  const cx = Math.round((LN_PLAZA.x0 + LN_PLAZA.x1) / 2) * 16 + 8, cy = Math.round((LN_PLAZA.y0 + LN_PLAZA.y1) / 2) * 16 + 8, C_ = { cx, cy, x0: cx - 72, x1: cx + 72, y0: cy - 92, y1: cy + 92 };
  const team = [actNpc('pe_' + (20 + Math.floor(Math.random() * 60)), cx - 50, cy + 70, 'lima_norte'), actNpc('pe_' + (90 + Math.floor(Math.random() * 30)), cx + 50, cy + 70, 'lima_norte')].filter(Boolean);
  const riv = [actNpc('pe_' + (30 + Math.floor(Math.random() * 60)), cx - 50, cy - 60, 'lima_norte'), actNpc('pe_' + (10 + Math.floor(Math.random() * 9)), cx, cy - 80, 'lima_norte'), actNpc('pe_' + (60 + Math.floor(Math.random() * 30)), cx + 50, cy - 60, 'lima_norte')].filter(Boolean);
  for (const e of riv) { e.hx = e.x; e.hy = e.y; } for (const e of team) { e.hx = e.x; e.hy = e.y; }
  P.x = cx; P.y = cy + 60; P.dir = 'up'; Object.assign(ACT, { k: 'vol', C: C_, team, riv, sc: [0, 0], ball: null, wait: 1.5 });
  banner('🏐 ' + L2('¡A la cancha!', 'On the court!'), L2('Corre hasta la sombra de la pelota para devolverla. Gana el primero en llegar a 7.', 'Run to the ball\'s shadow to return it. First to 7 wins.')); };
function volServe(toUs) { const A = ACT, C_ = A.C, P = G.P; const from = toUs ? { x: C_.cx + (Math.random() - 0.5) * 100, y: C_.cy - 70 } : { x: P.x, y: P.y };
  const tgt = toUs ? { x: Math.max(C_.x0 + 10, Math.min(C_.x1 - 10, C_.cx + (Math.random() - 0.5) * 150)), y: C_.cy + 20 + Math.random() * 70 } : { x: C_.cx + (Math.random() - 0.5) * 140, y: C_.cy - 25 - Math.random() * 70 };
  A.ball = { fx: from.x, fy: from.y, tx: tgt.x, ty: tgt.y, t: 0, T: 1.3 + Math.random() * 0.4, toUs }; if (!toUs) { const r = A.riv.slice().sort((p, q) => Math.hypot(p.x - tgt.x, p.y - tgt.y) - Math.hypot(q.x - tgt.x, q.y - tgt.y))[0]; A.catcher = r; } else A.catcher = null; }
V33_TICKS.push(dt => { if (ACT.k !== 'vol') return; dt = Math.min(0.05, dt || 0.016); const A = ACT, P = G.P, C_ = A.C; if (!G.map || G.map.id !== 'lima_norte' || P.dead) { volEnd(); return; }
  P.y = Math.max(C_.cy + 8, Math.min(C_.y1, P.y)); P.x = Math.max(C_.x0, Math.min(C_.x1, P.x));
  if (!A.ball) { A.wait -= dt; if (A.wait <= 0) volServe(true); }
  else { const b = A.ball; b.t += dt;
    if (b.toUs) { const helper = A.team.slice().sort((p, q) => Math.hypot(p.x - b.tx, p.y - b.ty) - Math.hypot(q.x - b.tx, q.y - b.ty))[0], pd = Math.hypot(P.x - b.tx, P.y - b.ty); if (helper && pd > 50 && Math.hypot(helper.x - b.tx, helper.y - b.ty) < 70) npcStep(helper, b.tx, b.ty, 70, dt); }
    else if (A.catcher) npcStep(A.catcher, b.tx, b.ty, 85, dt);
    for (const e of A.riv.concat(A.team)) if (e !== A.catcher && e.anim === 'walk' && !(b.toUs)) npcStep(e, e.hx, e.hy, 50, dt);
    if (b.t >= b.T) { const lx = b.tx, ly = b.ty;
      if (b.toUs) { const pd = Math.hypot(P.x - lx, P.y - ly), hp = A.team.find(e => Math.hypot(e.x - lx, e.y - ly) < 16); if (pd < 22 || hp) { sfx('hit'); floatText(P.x, P.y - 40, pd < 22 ? L2('¡Voleo!', 'Bump!') : L2('¡La sacó tu compañera!', 'Teammate got it!'), '#ffd040'); setAnim(P, 'atk'); volServe(false); A.ball.fx = pd < 22 ? P.x : hp.x; A.ball.fy = pd < 22 ? P.y : hp.y; } else { A.sc[1]++; sfx('hurt'); floatText(lx, ly - 20, L2('Punto rival', 'Rival point'), '#ff8a8a'); A.ball = null; A.wait = 1.6; } }
      else { const c = A.catcher; if (c && Math.hypot(c.x - lx, c.y - ly) < 16 && Math.random() < 0.82) { sfx('hit'); const fx = c.x, fy = c.y; volServe(true); A.ball.fx = fx; A.ball.fy = fy; } else { A.sc[0]++; sfx('coin'); floatText(lx, ly - 20, L2('¡Punto!', 'Point!'), '#8aff8a'); A.ball = null; A.wait = 1.6; } } } }
  mgHud(`🏐 <b>${L2('Tu equipo', 'Your team')} ${A.sc[0]} - ${A.sc[1]}</b>`); if (A.sc[0] >= 7 || A.sc[1] >= 7) volEnd(true); });
function volEnd(fin) { const A = ACT, P = G.P; if (A.k !== 'vol') return; const sc = A.sc; actClean(); actEnd(); if (!fin) return; const win = sc[0] > sc[1], gold = 300 + sc[0] * 150 + (win ? 1500 : 0); P.gold += gold; banner('🏐 ' + (win ? L2('¡Ganaron el partido!', 'You won the match!') : L2('Perdieron esta vez', 'You lost this time')) + ' ' + sc[0] + '-' + sc[1], '+' + gold + L2(' de oro', ' gold')); sfx(win ? 'level' : 'quest'); markDirty(); }
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'vol' || G.map.id !== 'lima_norte') return; const A = ACT, C_ = A.C; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1; ctx.strokeRect(C_.x0 - cx, C_.y0 - cy, C_.x1 - C_.x0, C_.y1 - C_.y0); ctx.fillStyle = 'rgba(232,200,144,0.35)'; ctx.fillRect(C_.x0 - cx, C_.y0 - cy, C_.x1 - C_.x0, C_.y1 - C_.y0); ctx.fillStyle = '#3a3a40'; ctx.fillRect(C_.x0 - cx - 2, C_.cy - cy - 26, 3, 26); ctx.fillRect(C_.x1 - cx - 1, C_.cy - cy - 26, 3, 26); ctx.fillStyle = 'rgba(240,240,240,0.85)'; for (let x = C_.x0; x < C_.x1; x += 4) ctx.fillRect(x - cx, C_.cy - cy - 24, 1, 12); for (let y = -24; y <= -12; y += 4) ctx.fillRect(C_.x0 - cx, C_.cy - cy + y, C_.x1 - C_.x0, 1); ctx.fillRect(C_.x0 - cx, C_.cy - cy - 25, C_.x1 - C_.x0, 2);
  const b = A.ball; if (!b) return; const f = Math.min(1, b.t / b.T), x = b.fx + (b.tx - b.fx) * f, y = b.fy + (b.ty - b.fy) * f, z = Math.sin(f * Math.PI) * 70; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(b.tx - cx, b.ty - cy, 7, 3, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x - cx, y - cy, 4, 2, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x - cx, y - cy - z - 6, 5, 0, 7); ctx.fill(); ctx.strokeStyle = '#2a4ab8'; ctx.beginPath(); ctx.arc(x - cx, y - cy - z - 6, 5, 0.3, 2.2); ctx.stroke(); });

// ---------- BAILES en la tarima, sin ventana ----------
let rhyEl = null;
fsRhythm = function (o) { const P = G.P; if (actBusy()) return; if (P.mount) { P.mount = null; calcStats(P); mountBtn(); }
  const n = o.n || 16, step = o.step || 600, seq = Array.from({ length: n }, () => Math.floor(Math.random() * 4)), t0 = performance.now() + 1600, dk = o.dance || (/marinera/i.test(o.t) ? 'marinera' : /flamenco|tablao/i.test(o.t) ? 'flamenco' : 'jarabe');
  fsLearn(dk); P.dk = dk; doDance(dk); Object.assign(ACT, { k: 'rhy', o, seq, t0, step, n, idx: 0, hit: 0, combo: 0, best: 0, dk, cols: o.cols || ['#ff6a8a', '#8ad8ff', '#9aff6a', '#ffd040'], flash: 0 });
  if (!rhyEl) { rhyEl = document.createElement('div'); rhyEl.id = 'rhyBar'; rhyEl.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);bottom:calc(6.2em + env(safe-area-inset-bottom,0px));z-index:14;display:flex;gap:.4em'; $('#hud').appendChild(rhyEl);
    rhyEl.innerHTML = ['←', '↑', '↓', '→'].map((a, i) => `<button class="btn" data-rh="${i}" style="font-size:1.5em;min-width:2.6em;min-height:2.2em">${a}</button>`).join(''); rhyEl.querySelectorAll('[data-rh]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); rhyPress(+b.dataset.rh); }));
    window.addEventListener('keydown', e => { if (ACT.k !== 'rhy') return; const m = { ArrowLeft: 0, ArrowUp: 1, ArrowDown: 2, ArrowRight: 3 }[e.code]; if (m !== undefined) { e.preventDefault(); e.stopPropagation(); rhyPress(m); } }, true); }
  rhyEl.hidden = false; banner(o.t.replace(/<[^>]+>/g, ''), L2('Pulsa la flecha cuando llegue a la línea sobre tu cabeza', 'Tap the arrow when it reaches the line above your head')); };
function rhyPress(i) { const A = ACT; if (A.k !== 'rhy') return; const now = performance.now(); let bi = -1, bd = 1e9; A.seq.forEach((s, k) => { if (k < A.idx) return; const d = Math.abs(now - (A.t0 + k * A.step)); if (d < bd) { bd = d; bi = k; } });
  if (bi >= 0 && A.seq[bi] === i && bd < 230) { A.hit += bd < 100 ? 2 : 1; A.idx = bi + 1; A.combo++; A.best = Math.max(A.best, A.combo); A.flash = 0.25; sfx('coin'); if (A.combo > 2) floatText(G.P.x, G.P.y - 60, 'x' + A.combo, '#ffd040'); } else { A.combo = 0; sfx('hurt'); } }
V33_TICKS.push(() => { if (ACT.k !== 'rhy') return; const A = ACT, P = G.P, now = performance.now(); if (P.anim !== 'dance' && now % 1500 < 40) doDance(A.dk); while (A.idx < A.n && now > A.t0 + A.idx * A.step + 260) { A.idx++; A.combo = 0; }
  mgHud(`💃 ${A.hit} ${L2('puntos', 'points')}${A.combo > 2 ? ' · ' + L2('racha ', 'streak ') + A.combo : ''}`);
  if (now > A.t0 + A.n * A.step + 400) { const o = A.o, pct = A.hit / (A.n * 2), best = A.best; actEnd(); if (rhyEl) rhyEl.hidden = true; P.emoteT = 0.01; o.onEnd(pct, best); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'rhy') return; const A = ACT, P = G.P, now = performance.now(), bx = Math.round(P.x - cx), by = Math.round(P.y - cy - 62); ctx.fillStyle = 'rgba(10,6,4,0.55)'; ctx.fillRect(bx - 40, by - 70, 80, 74); ctx.fillStyle = A.flash > 0 ? '#ffffff' : '#ffd040'; ctx.fillRect(bx - 40, by, 80, 2); A.flash = Math.max(0, A.flash - 0.016);
  ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; A.seq.forEach((s, k) => { if (k < A.idx) return; const y = by - (A.t0 + k * A.step - now) / 9; if (y < by - 70 || y > by + 8) return; ctx.fillStyle = A.cols[s]; ctx.fillText(['←', '↑', '↓', '→'][s], bx - 30 + s * 20, y + 4); }); });
{ const _sm = setMap; setMap = function () { if (ACT.k) { if (ACT.k === 'fut') esMatchEnd(); else if (ACT.k === 'vol') volEnd(); else { actEnd(); if (rhyEl) rhyEl.hidden = true; } } return _sm.apply(this, arguments); }; }

if (typeof GSIS !== 'undefined') GSIS.unshift(['enjuego524', '🎮 ' + L2('Juegos dentro del mapa', 'In-map games'), () => [
  L2('Sandboard (Trujillo): en la cima del Cerro Carretas te pones la tabla y bajas la duna de verdad; gira con el joystick para pasar entre las banderas y esquiva las piedras.', 'Sandboarding (Trujillo): at the top of Cerro Carretas you strap on the board and ride down the real dune; steer with the joystick between the flags and dodge the rocks.'),
  L2('Fútbol (Madrid): el Entrenador del Gran Estadio te mete en un partido 3 contra 3 de 2 minutos. Conduce el balón andando hacia él y chuta con ⚔. Atacas hacia la derecha.', 'Football (Madrid): the Coach at the Great Stadium puts you in a 2-minute 3-a-side match. Dribble by walking into the ball and shoot with ⚔. You attack to the right.'),
  L2('Vóley (Comas): 3 contra 3 en la cancha de la plaza. Corre hasta la sombra de la pelota antes de que caiga y la devuelves. Gana el primero en llegar a 7.', 'Volleyball (Comas): 3-a-side on the square court. Run to the ball\'s shadow before it lands to return it. First to 7 wins.'),
  L2('Bailes (Ballet Folklórico, marinera, flamenco y el Concurso Nacional): bailas en la tarima y las flechas caen sobre tu cabeza; pulsa los botones de flecha de abajo.', 'Dances (Folk Ballet, marinera, flamenco and the National Contest): you dance on the stage and the arrows fall above your head; tap the arrow buttons below.'),
  L2('Los oficios de México, Perú y España dan el triple de experiencia.', 'Mexico, Peru and Spain jobs give triple experience.')], () => null]);
