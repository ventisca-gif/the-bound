// ================= 5.30: JUEGO A PRUEBA DE ERRORES, ARRIERO MÁS CLARO, COBRADOR DE COMBI CON INTERIOR, CLIENTES QUE HABLAN =================
// Sergio: «se bugeó, usé una habilidad y se paralizó todo» (error rojo «reading '3'»). No se pudo reproducir aquí, así que:
//  · Cada sistema del juego (V33_TICKS) y el dibujo de cada personaje van protegidos: si uno falla, se salta ese y el
//    resto sigue (antes un solo error congelaba la partida). La barra roja ahora dice dónde fue (archivo:línea).
//  · Arriero de llamas: banderas en el camino, cuerda entre las llamas, instrucciones claras y cansancio más lento.
//  · Cobrador de combi: 12 paraderos, ~5.000 de oro, y puedes entrar en la combi a cobrar asiento por asiento con
//    diálogos; desde la puerta gritas en los paraderos y ves la calle.
//  · Mototaxi y vocho taxi: el cliente te habla durante el viaje y le respondes (propina).
//  · Los oficios de los países dan ×6 de experiencia (antes ×3): hay muchos y subían despacio.
const ERR_SEEN = new Set();
function errOnce(tag, e) { const k = tag + ':' + ((e && e.message) || e); if (ERR_SEEN.has(k)) return; ERR_SEEN.add(k); console.warn(tag, e); try { errShow(e); } catch (q) { } }
v33Tick = function (dt) { for (const f of V33_TICKS) { try { f(dt); } catch (e) { errOnce('tick', e); } } };
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { try { return _de.apply(this, arguments); } catch (err) { errOnce('draw:' + (e && (e.id || e.type)), err); } }; }
{ const _gj = gainJobXp; gainJobXp = function (job, n) { return _gj.call(this, job, COUNTRY_JOBS.has(job) ? Math.round((n || 0) * 2) : n); }; }

// =====================================================================================================
// COBRADOR DE COMBI: afuera gritas en los paraderos; adentro cobras asiento por asiento
// =====================================================================================================
const COB_N = 12, COB_PAY = 170, COB_BONUS = 800;
const COB_ASK = [[L2('¿Cuánto es hasta Javier Prado?', 'How much to Javier Prado?'), 1], [L2('¿Pasa por la Plaza San Martín?', 'Do you go by Plaza San Martín?'), 1], [L2('Universitario, ¿ya?', 'Student fare, OK?'), 1], [L2('Ahí está, cóbrate.', 'There you go, take it.'), 1], [L2('Un ratito, que busco sencillo…', 'Hold on, I am looking for change…'), 2], [L2('¿Me avisas en el paradero, joven?', 'Will you tell me at my stop?'), 1], [L2('Uy, se me cayó la moneda… ya, ya.', 'Oops, I dropped the coin… OK, OK.'), 2], [L2('¡Qué tráfico, causa!', 'What traffic, mate!'), 1]];
const COB_PAID = [L2('Tome, joven.', 'Here you go.'), L2('Gracias, cobrador.', 'Thanks, conductor.'), L2('Ahí va un sol cincuenta.', 'Here is one-fifty.'), L2('Bajo en la esquina, ¿ya?', 'I get off at the corner, OK?')];
function makeCombiIn() { if (G.maps.combi_in) return G.maps.combi_in; const w = 18, h = 7, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'combi_in', w, h, ter: new Uint8Array(N).fill(T.IWALL), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, camps: [], cobIn: 1 };
  for (let y = 2; y <= 4; y++) for (let x = 2; x <= w - 3; x++) M.ter[I(x, y)] = T.CARPET; M.exit = { x: -9, y: -9 }; prepPalettes(M); initMapObjs(M);
  M.seats = []; for (let x = 5; x <= 14; x += 2) for (const y of [2, 4]) { addObj(M, 'furn', x, y, { f: 'av_asiento', fp: [[0, 0]], seat: 1 }); M.seats.push({ x, y, px: x * 16 + 8, py: y * 16 + 8, e: null }); }
  M.drawExtra = (cx, cy) => cobInDraw(M, cx, cy); G.maps.combi_in = M; return M; }
function cobInDraw(M, cx, cy) { const B = ACT, t = G.t, mv = B.k === 'v8_cobrador' ? B.cx || 0 : t * 60;
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) { const X = x * 16 - cx, Y = y * 16 - cy, tt = M.ter[M.I(x, y)]; if (tt === T.CARPET) { ctx.fillStyle = y === 3 ? ((x % 2) ? '#4a4a52' : '#52525a') : '#3a3a40'; ctx.fillRect(X, Y, 16, 16); } else { ctx.fillStyle = '#e8e4dc'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = '#c81e3a'; ctx.fillRect(X, y < 2 ? Y + 11 : Y, 16, 4); } }
  for (const [wy, far] of [[4, 0], [M.h * 16 - 26, 1]]) for (let wx = 4; wx < M.w - 2; wx += 2) { const X = Math.round(wx * 16 - 6 - cx), Y = Math.round(wy - cy); ctx.save(); ctx.beginPath(); ctx.rect(X, Y, 28, 20); ctx.clip(); ctx.fillStyle = '#9ac8e8'; ctx.fillRect(X, Y, 28, 20);
    const sc = ((mv * (far ? 0.6 : 1)) + wx * 28) % 120; for (let k = -1; k < 3; k++) { const bx = X + k * 40 - sc % 40; ctx.fillStyle = ['#e8d8b0', '#c8a888', '#f4f0e8', '#d8b8a0'][(k + Math.floor(sc / 40) + wx) & 3]; ctx.fillRect(bx, Y + 4, 34, 16); ctx.fillStyle = '#5a7a98'; ctx.fillRect(bx + 4, Y + 8, 6, 5); ctx.fillRect(bx + 20, Y + 8, 6, 5); } ctx.fillStyle = '#45464c'; ctx.fillRect(X, Y + 17, 28, 3); ctx.restore(); ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 2; ctx.strokeRect(X, Y, 28, 20); }
  const dx = 2 * 16 - cx, dy = 3 * 16 - cy; ctx.fillStyle = '#ffd040'; ctx.fillRect(dx - 2, dy, 4, 16); drawTxt(L2('PUERTA', 'DOOR'), dx + 8, dy - 2, '#ffe08a', 7);
  ctx.fillStyle = '#2a2a30'; ctx.fillRect(15 * 16 - cx, 2 * 16 - cy, 16, 16); ctx.fillStyle = '#1a1a1e'; ctx.beginPath(); ctx.arc(15 * 16 + 8 - cx, 2 * 16 + 8 - cy, 6, 0, 7); ctx.stroke(); }
V8_GO.cobrador = A => { const M = G.map, right = M.w * 16 - A.px, left = A.px, dir = right >= left ? 1 : -1, room = (dir > 0 ? right : left) - 400, sp = Math.max(260, Math.min(430, Math.floor(room / (COB_N + 0.7)))), stops = [];
  for (let i = 0; i < COB_N; i++) { const sx = A.px + dir * (240 + i * sp), ppl = [], n = 1 + Math.floor(Math.random() * 3); for (let q = 0; q < n; q++) { const e = actNpc(v8Ped('lima'), sx - 14 + q * 14, A.lane - 30, 'lima'); if (e) ppl.push(e); } stops.push({ x: sx, ppl, done: 0 }); }
  const CI = makeCombiIn(); for (const s of CI.seats) s.e = null;
  Object.assign(ACT, { k: 'v8_cobrador', cx: A.px, cy: A.lane, dir, brake: 0, stops, si: 0, pas: [], paid: 0, lost: 0, left: 0, gold: 0, inside: false, inMap: 'combi_in', swap: false, sp, onAtk: () => cobAtk() });
  banner('🚐 ' + L2('¡A cobrar!', 'Collect the fares!'), L2('Afuera: ⚔ en el paradero = «¡Sube, sube!». Lejos del paradero, ⚔ = entrar a cobrar.', 'Outside: ⚔ at a stop = «Get on, get on!». Away from stops, ⚔ = go inside to charge.')); };
function cobEnter() { const B = ACT, P = G.P, M = makeCombiIn(); B.swap = true; try { setMap(M, 3 * 16 + 8, 3 * 16 + 8, 'right'); } finally { B.swap = false; } B.inside = true; sfx('ui'); }
function cobExit() { const B = ACT, P = G.P, L_ = G.maps.lima; if (!L_) return; B.swap = true; try { setMap(L_, B.cx - B.dir * 10, B.cy - 4, B.dir > 0 ? 'right' : 'left'); } finally { B.swap = false; } B.inside = false; sfx('ui'); }
function cobAtk() { const B = ACT, P = G.P;
  if (!B.inside) { const s = B.stops.find(s => !s.done && Math.abs(s.x - B.cx) < 70); if (s && !s.call && s.ppl.length) { s.call = 1; B.brake = 2.8; sfx('horn'); floatText(P.x, P.y - 44, L2('¡Sube, sube! ¡Al fondo hay sitio!', 'Get on! Room at the back!'), '#ffe08a'); return true; } cobEnter(); return true; }
  if (P.x < 4 * 16) { cobExit(); return true; }
  const p = B.pas.filter(p => p.e && !p.off).sort((a, b) => aDist(P, a.e) - aDist(P, b.e))[0]; if (!p || aDist(P, p.e) > 26) { floatText(P.x, P.y - 40, L2('¡Pasaje, pasaje!', 'Fares, please!'), '#ffffff'); return true; }
  if (p.paid) { p.e.chat = L2('Ya te pagué, oe.', 'I already paid you.'); p.e.chatT = G.t; return true; }
  p.talk++; if (p.talk < p.need) { p.e.chat = COB_ASK[p.ask][0]; p.e.chatT = G.t; floatText(P.x, P.y - 40, L2('Un sol cincuenta, caserito.', 'One-fifty, please.'), '#ffffff'); return true; }
  p.paid = 1; B.paid++; const g = Math.round(COB_PAY * (1 + jobPerkSum('v8cobrador') / 100)); B.gold += g; p.e.chat = p.need > 1 ? v8Pick(COB_PAID) : COB_ASK[p.ask][0]; p.e.chatT = G.t; sfx('coin'); floatText(p.e.x, p.e.y - 36, '🪙 +' + g, '#ffd040'); return true; }
{ const _off = v8Off; v8Off = function () { const B = ACT; if (B.k === 'v8_cobrador') { if (B.inside && G.maps.lima) { B.swap = true; try { setMap(G.maps.lima, B.cx, B.cy - 4, 'down'); } catch (e) { } B.swap = false; } B.inside = false; for (const p of B.pas) if (p.e) p.e.remove = true; B.inMap = null; } return _off.apply(this, arguments); }; }
V33_TICKS.push(dt => { if (ACT.k !== 'v8_cobrador') return; dt = Math.min(0.05, dt || 0.016); const B = ACT, P = G.P, CI = makeCombiIn(); B.brake = Math.max(0, B.brake - dt); B.cx += B.dir * (B.brake > 0 ? 16 : 70) * dt;
  if (!B.inside) { v8Lock(B.cx - B.dir * 10, B.cy - 4); P.dir = B.dir > 0 ? 'right' : 'left'; }
  for (let i = 0; i < B.stops.length; i++) { const s = B.stops[i];
    if (s.call && s.ppl.length) for (const e of s.ppl) { npcStep(e, B.cx - B.dir * 10, B.cy - 6, 90, dt); if (aDist(e, { x: B.cx - B.dir * 10, y: B.cy - 6 }) < 12) { e.remove = true; const seat = CI.seats.filter(q => !q.e)[Math.floor(Math.random() * CI.seats.filter(q => !q.e).length)];
      if (!seat) { B.left++; continue; } const se = spawnNPC(e.id, seat.px, seat.py - 2, 'combi_in', { face: 'down' }); if (se) { se.scene = 1; se.noTag = 1; se.actTmp = 1; setAnim(se, 'sit'); seat.e = se; } const ask = Math.floor(Math.random() * COB_ASK.length); B.pas.push({ e: se, seat, d: i + 1 + Math.floor(Math.random() * 3), paid: 0, talk: 0, ask, need: COB_ASK[ask][1] }); } }
    if (s.call) s.ppl = s.ppl.filter(e => !e.remove);
    if (!s.done && (B.cx - s.x) * B.dir > 70) { s.done = 1; B.si = i + 1; if (!s.call && s.ppl.length) { B.left += s.ppl.length; if (!B.inside) floatText(s.x, B.cy - 50, L2('¡Se quedaron!', 'They stayed behind!'), '#ff8a8a'); } for (const e of s.ppl) e.remove = true; s.ppl = [];
      for (const p of B.pas) if (!p.off && p.d <= i) { p.off = 1; if (p.seat) p.seat.e = null; if (p.e) { p.e.remove = true; } if (!p.paid) { B.lost++; sfx('hurt'); floatText(P.x, P.y - 54, L2('¡Se bajó sin pagar!', 'Got off without paying!'), '#ff8a8a'); } } B.pas = B.pas.filter(p => !p.off); } }
  G.ents = G.ents.filter(e => !e.remove); const next = B.stops[B.si], secs = next ? Math.max(0, Math.round(((next.x - B.cx) * B.dir) / 70)) : 0, unpaid = B.pas.filter(p => !p.paid).length;
  v8Hud(`${L2('Paradero', 'Stop')} ${Math.min(COB_N, B.si + 1)}/${COB_N} · 👥 ${B.pas.length} · ${L2('por cobrar', 'to charge')} ${unpaid} · 🪙 ${B.gold}${B.inside ? ' · ' + L2('paradero en ', 'stop in ') + secs + ' s · ' + L2('⚔ en la puerta = salir', '⚔ at the door = go out') : ''}`);
  if (B.si >= B.stops.length) { if (B.inside) cobExit(); v8Pay('cobrador', B.gold + (B.lost ? Math.round(COB_BONUS / 2) : COB_BONUS), 40 + B.paid * 10, B.paid + L2(' pasajes cobrados · ', ' fares collected · ') + B.lost + L2(' sin pagar', ' unpaid')); } });
V8_UNDER.push((cx, cy) => { if (ACT.k !== 'v8_cobrador' || ACT.inside || !G.map || G.map.id !== 'lima') return; const B = ACT; for (const s of B.stops) { if (s.done) continue; const x = s.x - cx, y = B.cy - 26 - cy; if (x < -40 || x > VW + 40) continue; ctx.fillStyle = '#3a3a40'; ctx.fillRect(x - 1, y - 24, 3, 24); ctx.fillStyle = '#1a6aff'; ctx.fillRect(x - 8, y - 30, 18, 8); ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 5, y - 28, 12, 1); ctx.fillRect(x - 5, y - 25, 9, 1); }
  try { const S = lmCombi(B.dir > 0 ? 'right' : 'left', 0); ctx.drawImage(S.c, Math.round(B.cx - S.ax - cx), Math.round(B.cy + 6 - S.ay - cy)); } catch (e) { ctx.fillStyle = '#c81e3a'; ctx.fillRect(B.cx - 26 - cx, B.cy - 18 - cy, 52, 22); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'v8_cobrador') return; const B = ACT; if (!B.inside) { for (const s of B.stops) if (!s.done && !s.call && s.ppl.length && Math.abs(s.x - B.cx) < 70) drawTxt('⚔ ' + L2('¡Sube!', 'Get on!'), s.x - cx, B.cy - 70 - cy, '#7aff8a', 9); if (!B.stops.some(s => !s.done && Math.abs(s.x - B.cx) < 70)) drawTxt('⚔ ' + L2('entrar a cobrar', 'go in to charge'), G.P.x - cx, G.P.y - 58 - cy, '#ffe08a', 8); }
  else for (const p of B.pas) if (p.e && !p.paid) drawTxt('🪙', p.e.x - cx, p.e.y - 40 - cy, '#ffd040', 10); });

// =====================================================================================================
// MOTOTAXI Y VOCHO TAXI: el cliente te habla durante el viaje y le respondes (buena respuesta = más propina)
// =====================================================================================================
const DRV_TALK = { moto: [
    [L2('¡Oe, jefe! ¿Por dónde nos vamos?', 'Hey, boss! Which way are we going?'), [L2('Por el atajo, tranqui', 'Through the shortcut, relax'), 1], [L2('Por donde sea', 'Whichever way'), 0]],
    [L2('¿Usted es de aquí, joven?', 'Are you from around here?'), [L2('De toda la vida, casero', 'All my life, my friend'), 1], [L2('No sé', 'I don\'t know'), 0]],
    [L2('Uy, ¡cuidado con ese hueco!', 'Whoa, watch out for that pothole!'), [L2('¡Lo vi! Agárrese', 'I saw it! Hold on'), 1], [L2('¿Qué hueco?', 'What pothole?'), 0]],
    [L2('¿Ya almorzó? Hay un menú bien rico en la esquina.', 'Have you had lunch? There\'s a great set menu on the corner.'), [L2('¡Después de la carrerita voy!', 'I\'ll go after this ride!'), 1], [L2('Estoy trabajando', 'I\'m working'), 0]],
    [L2('¡Póngase una cumbia, pues!', 'Put on some cumbia!'), [L2('¡Ahí va! 🎶', 'Here it goes! 🎶'), 1], [L2('Se malogró la radio', 'The radio is broken'), 0]],
    [L2('¿Me da una rebajita?', 'Can you give me a discount?'), [L2('Por ser usted, ya', 'For you, OK'), 1], [L2('Precio fijo', 'Fixed price'), 0]]],
  vocho: [
    [L2('¿Me lleva por Reforma, joven?', 'Can you take me down Reforma?'), [L2('¡Claro que sí, güero!', 'Sure thing!'), 1], [L2('Hay mucho tráfico', 'There is a lot of traffic'), 0]],
    [L2('¡Qué bonito vocho! ¿Es suyo?', 'What a nice Beetle! Is it yours?'), [L2('Mi orgullo, de 1990', 'My pride, from 1990'), 1], [L2('Es rentado', 'It\'s rented'), 0]],
    [L2('¿Sabe dónde venden buenos tacos al pastor?', 'Do you know where they sell good tacos al pastor?'), [L2('¡En la esquina del Zócalo!', 'On the Zócalo corner!'), 1], [L2('Ni idea', 'No idea'), 0]],
    [L2('Uy, ¡ese tope!', 'Whoa, that speed bump!'), [L2('Despacito y con cuidado', 'Slowly and carefully'), 1], [L2('¿Cuál tope?', 'What bump?'), 0]],
    [L2('¿Me pone música de mariachi?', 'Can you put on some mariachi?'), [L2('¡Ay, ay, ay! 🎺', 'Ay, ay, ay! 🎺'), 1], [L2('Mejor silencio', 'Silence is better'), 0]],
    [L2('¿Ya mero llegamos?', 'Are we almost there?'), [L2('Ya merito, cinco minutos', 'Almost, five minutes'), 1], [L2('Quién sabe', 'Who knows'), 0]]] };
let drvTalkEl = null;
function drvTalkUI() { const D = LM_DRV; if (!drvTalkEl) { drvTalkEl = document.createElement('div'); drvTalkEl.id = 'drvTalk'; drvTalkEl.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);bottom:calc(9.6em + env(safe-area-inset-bottom,0px));z-index:12;display:flex;gap:.4em;flex-wrap:wrap;justify-content:center;max-width:92vw'; document.getElementById('hud').appendChild(drvTalkEl); }
  const T_ = D && D.talk; if (!T_ || T_.ans) { drvTalkEl.hidden = true; drvTalkEl._h = ''; return; } drvTalkEl.hidden = false; const h = T_.q[1][0] + '|' + T_.q[2][0]; if (drvTalkEl._h === h) return; drvTalkEl._h = h;
  drvTalkEl.innerHTML = [1, 2].map(k => `<button class="btn sm ${k === 1 ? 'gold' : ''}" data-dt="${k}">💬 ${esc(T_.q[k][0])}</button>`).join(''); drvTalkEl.querySelectorAll('[data-dt]').forEach(b => b.onclick = () => { const D = LM_DRV; if (!D || !D.talk) return; const good = D.talk.q[+b.dataset.dt][1]; D.talk.ans = 1; D.talk.reply = D.talk.q[+b.dataset.dt][0]; D.talk.at = G.t; if (good) { D.tipT = (D.tipT || 0) + 80; sfx('coin'); D.talk.mood = '😄'; } else { D.talk.mood = '😐'; } drvTalkUI(); }); }
V33_TICKS.push(dt => { const D = LM_DRV; if (!D || D.kind === 'combi') { if (drvTalkEl && !drvTalkEl.hidden) { drvTalkEl.hidden = true; drvTalkEl._h = ''; } return; } const pool = DRV_TALK[D.kind] || DRV_TALK.moto; D.talkT = (D.talkT === undefined ? 4 : D.talkT) - (dt || 0);
  if (D.talk && (D.talk.ans ? G.t - D.talk.at > 3 : G.t - D.talk.t0 > 9)) D.talk = null; if (!D.talk && D.talkT <= 0) { D.talkT = 9 + Math.random() * 6; D.talk = { q: v8Pick(pool), t0: G.t, ans: 0 }; } drvTalkUI(); });
WORLD_DRAW.push((cx, cy) => { const D = LM_DRV, P = G.P; if (!D || !D.talk || D.kind === 'combi') return; const x = P.x - cx, y = P.y - cy - 52, t = D.talk.ans ? D.talk.mood + ' ' + D.talk.reply : '💬 ' + D.talk.q[0]; ctx.font = 'bold 8px sans-serif'; const w = Math.min(220, ctx.measureText(t).width + 10); bubble(x, y, w, 14); ctx.fillStyle = '#1a1a1e'; ctx.textAlign = 'center'; ctx.fillText(t.length > 46 ? t.slice(0, 45) + '…' : t, x, y - 4); });
{ const _end = lmDriveEnd; lmDriveEnd = function (ok) { const D = LM_DRV; const r = _end.apply(this, arguments); if (ok && D && D.kind !== 'combi' && D.tipT) { G.P.gold += D.tipT; toast('💬 ' + L2('Propina por la buena charla: +', 'Tip for the nice chat: +') + D.tipT, 'loot', 3); markDirty(); } if (drvTalkEl) { drvTalkEl.hidden = true; drvTalkEl._h = ''; } return r; }; }
