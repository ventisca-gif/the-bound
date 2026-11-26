// 6.25 · Vida en el Going Merry (ideas 6 y 7 que aprobó Sergio): cocinar con Sanji y entrenar con la tripulación,
// todo dentro del mapa bajo cubierta (joystick y ⚔, estado ACT como los demás minijuegos; sin ventanas).
//  · Cocina: hablas con Sanji o usas el fogón → eliges plato → recoges 3 ingredientes que brillan por la cocina →
//    en el fogón pulsas ⚔ cuando la llama pasa por la zona verde (3 veces). Bono de 20 min para ti y la tripulación.
//  · Entrenar (en la salita): Usopp puntería (botellas, disparas con ⚔ hacia donde miras), Zoro cortes (troncos que
//    vuelan hacia ti, ⚔ cuando están cerca) y Sanji esquivar (círculos rojos de patada).
// Premio: oro (completo la primera vez cada día, ¼ después) y un bono corto. Récords en P.mbTrain.
SAVEKEYS.push('mbMeal', 'mbTrain');
const MB_DISH = {
  carne: { n: L2('Carne del capitán', 'Captain’s meat'), st: q => ({ atkP: 4 + q * 3 }), ing: ['carne', 'carne', 'especia'], d: L2('ataque', 'attack') },
  risotto: { n: L2('Risotto del mar', 'Sea risotto'), st: q => ({ defP: 4 + q * 3 }), ing: ['pez', 'arroz', 'especia'], d: L2('defensa', 'defense') },
  postre: { n: L2('Postre de mandarina', 'Tangerine dessert'), st: q => ({ spdP: 4 + q * 2 }), ing: ['mandarina', 'mandarina', 'leche'], d: L2('velocidad', 'speed') }
};
const MB_ING_N = { carne: L2('carne', 'meat'), especia: L2('especias', 'spices'), pez: L2('pescado', 'fish'), arroz: L2('arroz', 'rice'), mandarina: L2('mandarina', 'tangerine'), leche: L2('leche', 'milk') };
const MB_ING_SPOT = [[1, 5], [6, 5], [2, 9], [7, 9], [6, 12], [1, 12]];   // nevera, fregadero, barra, mesita…
const mbPx = (x, y) => [x * 16 + 8, y * 16 + 8];
const mbHere = () => !!(G.map && G.map.merryBajo && G.P && !G.P.dead);
const mbMealOn = (P = G.P) => !!(P && P.mbMeal && Date.now() < P.mbMeal.until);

// ---------- cocina ----------
function mbCookStart(k) {
  const D = MB_DISH[k], P = G.P; if (!D || !mbHere() || actBusy()) return;
  const spots = MB_ING_SPOT.slice().sort(() => Math.random() - 0.5);
  Object.assign(ACT, { k: 'mbcook', dish: k, ph: 'pick', t: 60, items: D.ing.map((i, n) => ({ i, x: mbPx(...spots[n])[0], y: mbPx(...spots[n])[1], got: 0 })), heat: 0, hits: 0, tries: 0, onAtk: mbCookAtk });
  banner('🍳 ' + D.n, L2('Recoge los 3 ingredientes que brillan y ve al fogón.', 'Pick up the 3 glowing ingredients and go to the stove.'));
  mbSay(BAR_SANJI, '¡Al lío! La nevera no se abre sola, y las especias están junto a la barra.', 'Let’s go! The fridge won’t open itself, and the spices are by the counter.');
}
const MB_STOVE = mbPx(3.5, 4.6);
function mbCookAtk() {
  const A = ACT, P = G.P; if (A.k !== 'mbcook') return false;
  if (A.ph !== 'fire') return true;
  if (Math.hypot(P.x - MB_STOVE[0], P.y - MB_STOVE[1]) > 40) { floatText(P.x, P.y - 40, L2('Acércate al fogón', 'Get to the stove'), '#ffd0a0'); return true; }
  const v = A.heat, ok = v > 0.62 && v < 0.84; A.tries++;
  if (ok) { A.hits++; sfx('coin'); floatText(MB_STOVE[0], MB_STOVE[1] - 50, L2('¡Perfecto!', 'Perfect!'), '#8aff8a', true); burst(MB_STOVE[0], MB_STOVE[1] - 30, 10, { sp: 60, up: 50, life: 0.5, c: ['#ffd040', '#ff8a3a'] }); }
  else { sfx('hurt'); floatText(MB_STOVE[0], MB_STOVE[1] - 50, v >= 0.84 ? L2('¡Se quema!', 'Burning!') : L2('Aún crudo', 'Still raw'), '#ff8a8a', true); }
  if (A.tries >= 3) mbCookEnd(); return true;
}
function mbCookEnd(fail) {
  const A = ACT, P = G.P, D = MB_DISH[A.dish]; actEnd(); if (!D) return;
  if (fail) { toast(L2('Se acabó el tiempo: Sanji termina el plato él solo… sin bono.', 'Time’s up: Sanji finishes the dish himself… no bonus.'), 'info', 5); return; }
  const q = A.hits;   // 0-3
  P.mbMeal = { k: A.dish, q, until: Date.now() + 20 * 60 * 1000 };
  addBuff(P, 'mb_comida', D.st(q), 20 * 60);
  const st = D.st(q), pct = Object.values(st)[0];
  banner('🍽 ' + D.n + ' · ' + '★'.repeat(q) + '☆'.repeat(3 - q), L2('+', '+') + pct + '% ' + D.d + L2(' y la tripulación pega un ', ' and the crew hits ') + Math.round(q * 7 + 5) + L2('% más fuerte · 20 min', '% harder · 20 min'));
  mbSay(BAR_SANJI, q === 3 ? '¡Un plato digno del Baratie! Que nadie desperdicie ni una miga.' : q ? 'No está mal. La próxima vez vigila más el fuego.' : 'Bueno… se puede comer. Algo es algo.',
    q === 3 ? 'A dish worthy of the Baratie! Nobody wastes a crumb.' : q ? 'Not bad. Watch the fire more closely next time.' : 'Well… it’s edible. That’s something.');
  markDirty(true);
}
// la comida también da fuerza a la tripulación (técnicas y vida en las peleas)
hookAfter('syrupCrewStats', (r, P) => { if (!r || !mbMealOn(P)) return; const k = 1 + (P.mbMeal.q * 0.07 + 0.05); r.boost *= k; r.hp = Math.round(r.hp * k); return r; });
// al cargar la partida el bono vuelve (lo que quede de los 20 min)
hookAfter('initPlayerRuntime', (_r, P) => { try { if (P && mbMealOn(P)) { const D = MB_DISH[P.mbMeal.k]; if (D) addBuff(P, 'mb_comida', D.st(P.mbMeal.q | 0), Math.max(1, (P.mbMeal.until - Date.now()) / 1000)); } } catch (e) { } });

// ---------- entrenamientos ----------
const MB_TRAIN = {
  usopp: { who: SYRUP_USOPP, n: L2('Puntería con Usopp', 'Aim with Usopp'), t: 30, gold: 900, st: { atkP: 6 },
    hint: L2('Mira hacia una botella y pulsa ⚔ para disparar.', 'Face a bottle and press ⚔ to shoot.') },
  zoro: { who: SHELLS_CAST_IDS.zoro, n: L2('Cortes con Zoro', 'Cuts with Zoro'), t: 30, gold: 900, st: { atkP: 8 },
    hint: L2('Pulsa ⚔ cuando un tronco esté cerca de ti.', 'Press ⚔ when a log is close to you.') },
  sanji: { who: BAR_SANJI, n: L2('Esquivar a Sanji', 'Dodge Sanji'), t: 30, gold: 900, st: { spdP: 8 },
    hint: L2('Sal del círculo rojo antes de que caiga la patada.', 'Leave the red circle before the kick lands.') }
};
const MB_ROOM = { x0: 18 * 16, x1: 26 * 16, y0: 5 * 16, y1: 10 * 16 };
function mbRandIn() { const R = MB_ROOM; return [R.x0 + Math.random() * (R.x1 - R.x0), R.y0 + Math.random() * (R.y1 - R.y0)]; }
function mbTrainStart(k) {
  const D = MB_TRAIN[k], P = G.P; if (!D || !mbHere() || actBusy()) return;
  P.x = 22 * 16 + 8; P.y = 8 * 16; P.dir = 'down'; updateCamera(0, true);
  Object.assign(ACT, { k: 'mbtrain', tk: k, t: D.t, score: 0, miss: 0, things: [], shots: [], next: 0.6, onAtk: () => mbTrainAtk() });
  banner('💪 ' + D.n, D.hint);
}
function mbTrainAtk() {
  const A = ACT, P = G.P; if (A.k !== 'mbtrain') return false;
  if (A.tk === 'usopp') { const [dx, dy] = DIRV[P.dir] || DIRV.down; A.shots.push({ x: P.x, y: P.y - 12, vx: dx * 300, vy: dy * 300, t: 0.9 }); sfx('ui'); }
  else if (A.tk === 'zoro') { let hit = false; for (const o of A.things) if (!o.done && Math.hypot(o.x - P.x, o.y - (P.y - 12)) < 30) { o.done = 1; hit = true; A.score++; burst(o.x, o.y, 8, { sp: 70, up: 20, life: 0.4, c: ['#b8844a', '#e8c890'] }); }
    setAnim(P, 'atk'); if (hit) sfx('hit'); else floatText(P.x, P.y - 40, L2('¡Al aire!', 'Missed!'), '#ffd0a0'); }
  return true;
}
V33_TICKS.push(dt => {
  dt = Math.min(0.05, dt || 0.016); const A = ACT, P = G.P;
  if (A.k === 'mbcook') {
    if (!mbHere()) { actEnd(); return; } A.t -= dt;
    if (A.ph === 'pick') { for (const o of A.items) if (!o.got && Math.hypot(o.x - P.x, o.y - P.y) < 16) { o.got = 1; sfx('coin'); floatText(o.x, o.y - 20, '+' + MB_ING_N[o.i], '#ffe08a'); }
      if (A.items.every(o => o.got)) { A.ph = 'fire'; banner('🔥 ' + L2('¡Al fogón!', 'To the stove!'), L2('Pulsa ⚔ cuando la llama esté en la zona verde (3 veces).', 'Press ⚔ when the flame is in the green zone (3 times).')); } }
    else A.heat = (Math.sin(G.t * 2.6) + 1) / 2;
    mgHud('🍳 ' + MB_DISH[A.dish].n + ' · ' + (A.ph === 'pick' ? A.items.filter(o => o.got).length + '/3 ' + L2('ingredientes', 'ingredients') : '🔥 ' + A.tries + '/3 · ★' + A.hits) + ' · ' + Math.ceil(A.t) + ' s');
    if (A.t <= 0) mbCookEnd(true); return;
  }
  if (A.k !== 'mbtrain') return;
  if (!mbHere()) { actEnd(); return; }
  const D = MB_TRAIN[A.tk]; A.t -= dt; A.next -= dt;
  const R = MB_ROOM; P.x = clamp(P.x, R.x0, R.x1); P.y = clamp(P.y, R.y0, R.y1 + 16);
  if (A.tk === 'usopp') {
    if (A.things.filter(o => !o.done).length < 3 && A.next <= 0) { const [x, y] = mbRandIn(); A.things.push({ x, y: y - 10 }); A.next = 0.5; }
    for (const s of A.shots) { s.t -= dt; s.x += s.vx * dt; s.y += s.vy * dt; for (const o of A.things) if (!o.done && Math.hypot(o.x - s.x, o.y - s.y) < 10) { o.done = 1; s.t = 0; A.score++; sfx('hit'); burst(o.x, o.y, 8, { sp: 60, up: 30, life: 0.4, c: ['#7ad08a', '#e0fff0'] }); } }
    A.shots = A.shots.filter(s => s.t > 0);
  } else if (A.tk === 'zoro') {
    if (A.next <= 0) { const a = Math.random() * Math.PI * 2, sp = 70 + Math.random() * 50 + (30 - A.t) * 2; A.things.push({ x: P.x + Math.cos(a) * 110, y: P.y - 12 + Math.sin(a) * 80, a, sp }); A.next = Math.max(0.6, 1.2 - (30 - A.t) * 0.02); }
    for (const o of A.things) { if (o.done) continue; const dx = P.x - o.x, dy = P.y - 12 - o.y, d = Math.hypot(dx, dy) || 1; o.x += dx / d * o.sp * dt; o.y += dy / d * o.sp * dt; if (d < 7) { o.done = 1; A.miss++; G.shake = 3; floatText(P.x, P.y - 40, L2('¡Pum!', 'Bonk!'), '#ff8a8a'); } }
  } else {
    if (A.next <= 0) { A.things.push({ x: P.x, y: P.y, t: 0.75 }); A.next = Math.max(0.7, 1.3 - (30 - A.t) * 0.015); }
    for (const o of A.things) { if (o.done) continue; o.t -= dt; if (o.t <= 0) { o.done = 1; if (Math.hypot(P.x - o.x, P.y - o.y) < 26) { A.miss++; G.shake = 4; sfx('hurt'); floatText(P.x, P.y - 40, L2('¡Patada!', 'Kick!'), '#ff8a8a'); } else { A.score++; floatText(P.x, P.y - 40, '+1', '#8aff8a'); } burst(o.x, o.y, 10, { sp: 80, up: 20, life: 0.35, c: ['#ffd040', '#ffffff'] }); } }
  }
  A.things = A.things.filter(o => !o.done || o.keep);
  mgHud('💪 ' + D.n + ' · ' + A.score + (A.miss ? ' · ✗' + A.miss : '') + ' · ' + Math.ceil(A.t) + ' s');
  if (A.t <= 0) mbTrainEnd();
});
function mbTrainEnd() {
  const A = ACT, P = G.P, D = MB_TRAIN[A.tk], k = A.tk, score = Math.max(0, A.score - (k === 'zoro' ? A.miss : 0)); actEnd(); if (!D) return;
  P.mbTrain = P.mbTrain || {}; const rec = P.mbTrain[k] || (P.mbTrain[k] = { best: 0, day: -1 });
  const day = typeof calDay === 'function' ? calDay() : Math.floor(Date.now() / 864e5), first = rec.day !== day;
  const gold = Math.round(score * D.gold * (first ? 1 : 0.25)); P.gold = (P.gold || 0) + gold; rec.day = day;
  const best = score > rec.best; if (best) rec.best = score;
  if (score > 0) addBuff(P, 'mb_entreno', D.st, 10 * 60);
  banner('💪 ' + D.n + ': ' + score + (best ? ' · ' + L2('¡récord!', 'record!') : ''), '+' + fmt(gold) + ' ' + L2('oro', 'gold') + (score > 0 ? ' · ' + L2('bono 10 min', '10 min bonus') : '') + (first ? '' : ' · ' + L2('hoy ya entrenaste: ¼ de oro', 'already trained today: ¼ gold')));
  const say = { usopp: ['¡Nada mal! Aunque el gran capitán Usopp habría acertado con los ojos cerrados.', 'Not bad! Though the great Captain Usopp would’ve hit them blindfolded.'],
    zoro: ['Sigue así. El acero no miente.', 'Keep it up. Steel doesn’t lie.'], sanji: ['Tus pies empiezan a entender el ritmo.', 'Your feet are starting to get the rhythm.'] }[k];
  mbSay(D.who, say[0], say[1]); markDirty(true);
}
function mbSay(id, es, en) { const M = G.map, e = M && (M.mbCrew || []).find(x => x.id === id); if (e && typeof shellsRescueSpeak === 'function') shellsRescueSpeak(e, es, en); }
WORLD_DRAW.push((cx, cy) => {
  const A = ACT; if (!G.map || !G.map.merryBajo) return;
  if (A.k === 'mbcook') {
    if (A.ph === 'pick') for (const o of A.items) { if (o.got) continue; const x = o.x - cx, y = o.y - cy - 6 + Math.sin(G.t * 4) * 2;
      ctx.fillStyle = 'rgba(255,230,120,.35)'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
      const col = { carne: '#c0402a', especia: '#d8a020', pez: '#6aa8e0', arroz: '#f4f0e0', mandarina: '#f08a20', leche: '#ffffff', rey: '#c05a7a' }[o.i] || '#ffffff';
      ctx.fillStyle = '#1a1220'; ctx.fillRect(x - 5, y - 4, 10, 8); ctx.fillStyle = col; ctx.fillRect(x - 4, y - 3, 8, 6); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(x - 3, y - 3, 3, 2); }
    else { const x = MB_STOVE[0] - cx - 24, y = MB_STOVE[1] - cy - 62;   // barra de fuego sobre el fogón
      ctx.fillStyle = '#1a1220'; ctx.fillRect(x - 1, y - 1, 50, 8); ctx.fillStyle = '#6a3a2a'; ctx.fillRect(x, y, 48, 6); ctx.fillStyle = '#3aa04a'; ctx.fillRect(x + 48 * 0.62, y, 48 * 0.22, 6);
      ctx.fillStyle = '#ffd040'; ctx.fillRect(x + 48 * A.heat - 1, y - 3, 3, 12);
      if (Math.random() < 0.5) part(MB_STOVE[0] + (Math.random() - 0.5) * 16, MB_STOVE[1] - 26, { vz: 30, vx: (Math.random() - 0.5) * 20, g: -40, life: 0.4, c: '#ff8a3a', s: 2 }); }
  }
  if (A.k === 'mbtrain') {
    for (const o of A.things) { if (o.done) continue; const x = o.x - cx, y = o.y - cy;
      if (A.tk === 'usopp') { ctx.fillStyle = '#1a1220'; ctx.fillRect(x - 3, y - 7, 6, 12); ctx.fillStyle = '#4a9a5a'; ctx.fillRect(x - 2, y - 4, 4, 8); ctx.fillStyle = '#8ad89a'; ctx.fillRect(x - 1, y - 7, 2, 3); }
      else if (A.tk === 'zoro') { ctx.save(); ctx.translate(x, y); ctx.rotate(G.t * 6 + o.a); ctx.fillStyle = '#5a3820'; ctx.fillRect(-8, -3, 16, 6); ctx.fillStyle = '#b8844a'; ctx.fillRect(-7, -2, 14, 4); ctx.fillStyle = '#e8c890'; ctx.fillRect(6, -2, 2, 4); ctx.restore(); }
      else { const k = 1 - o.t / 0.75; ctx.strokeStyle = 'rgba(255,60,60,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 26, 14, 0, 0, 7); ctx.stroke(); ctx.fillStyle = `rgba(255,60,60,${0.15 + k * 0.35})`; ctx.beginPath(); ctx.ellipse(x, y, 26 * k, 14 * k, 0, 0, 7); ctx.fill(); } }
    for (const s of A.shots) { ctx.fillStyle = '#3a2a1a'; ctx.fillRect(s.x - cx - 2, s.y - cy - 2, 4, 4); }
    if (A.tk === 'zoro') { ctx.strokeStyle = 'rgba(160,255,200,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(G.P.x - cx, G.P.y - cy - 12, 30, 0, 7); ctx.stroke(); }
  }
});

// ---------- cómo se empiezan: hablando con cada uno bajo cubierta, o con el fogón ----------
DLG_HOOKS.push((npc, opts) => {
  if (!npc || !mbHere()) return;
  if (npc.id === BAR_SANJI) {
    for (const [k, D] of Object.entries(MB_DISH)) opts.unshift({ label: '🍳 ' + L2('Cocinar: ', 'Cook: ') + D.n + ' (+' + D.d + ')', icon: ['food', 3], fn: () => { closeDialog(); mbCookStart(k); } });
    opts.push({ label: '💪 ' + MB_TRAIN.sanji.n, icon: ['run'], fn: () => { closeDialog(); mbTrainStart('sanji'); } });
  }
  if (npc.id === SYRUP_USOPP) opts.unshift({ label: '💪 ' + MB_TRAIN.usopp.n, icon: ['run'], fn: () => { closeDialog(); mbTrainStart('usopp'); } });
  if (npc.id === SHELLS_CAST_IDS.zoro) opts.unshift({ label: '💪 ' + MB_TRAIN.zoro.n, icon: ['run'], fn: () => { closeDialog(); mbTrainStart('zoro'); } });
});
XACT.mb_cocinar = [L2('Cocinar con Sanji', 'Cook with Sanji'), 'talk', () => {
  if (!G.P.baratieSanji) { toast(L2('Sin cocinero a bordo… Sanji se une en el Baratie.', 'No cook aboard… Sanji joins at the Baratie.'), 'info', 4); return; }
  const S = G.map && (G.map.mbCrew || []).find(e => e.id === BAR_SANJI); if (S) openDialog(S);
}];
hookAfter('makeMerryBajo', M => { if (M && !M.mbStoveAct) { M.mbStoveAct = 1; const o = M.objs.find(o => o.f === 'mb_fogon'); if (o) o.xact = 'mb_cocinar'; } });

// ---------- Lupa › 🏴‍☠️ Crossovers ----------
if (typeof LUPA_DAWN !== 'undefined') {
  LUPA_DAWN.push(['merry625', () => '⛵ ' + L2('Going Merry · bajo cubierta', 'Going Merry · below deck'), () => {
    const P = G.P, m = P && mbMealOn(P) ? MB_DISH[P.mbMeal.k] : null, t = (P && P.mbTrain) || {};
    return [
      L2('Navegando con el Going Merry (desde que Nami se une), habla con la tripulación y elige «Bajar a la cocina y el comedor». La escalera te devuelve al timón donde estabas; mientras estás abajo, Nami deja el barco anclado.', 'Sailing the Going Merry (once Nami joins), talk to the crew and choose “Go below to the galley and dining room”. The ladder takes you back to the helm where you were; while you are below, Nami keeps the ship anchored.'),
      L2('Abajo: cocina (fogón, fregadero, nevera, barra y mesita de cuadros), comedor (mesa verde y el mástil) y salita con bodega (sofá verde, armario, cajas, barriles y la cabeza de carnero). Está toda la tripulación que ya tienes.', 'Below: galley (stove, sink, fridge, counter and checkered table), dining room (green table and the mast) and lounge with hold (green sofa, cabinet, crates, barrels and the ram’s head). Your whole crew is there.'),
      '🍳 ' + L2('Cocinar con Sanji (háblale o usa el fogón): recoge los 3 ingredientes que brillan y pulsa ⚔ en el fogón cuando la llama esté en la zona verde, 3 veces. Carne del capitán = ataque, Risotto del mar = defensa, Postre de mandarina = velocidad (de +4 % a +13 %) durante 20 min, y la tripulación pega un 5-26 % más fuerte.', 'Cook with Sanji (talk to him or use the stove): pick up the 3 glowing ingredients and press ⚔ at the stove when the flame is in the green zone, 3 times. Captain’s meat = attack, Sea risotto = defense, Tangerine dessert = speed (+4 % to +13 %) for 20 min, and the crew hits 5-26 % harder.'),
      m ? '✅ ' + L2('Ahora: ', 'Now: ') + m.n + ' ' + '★'.repeat(P.mbMeal.q) + ' · ' + Math.ceil((P.mbMeal.until - Date.now()) / 60000) + ' min' : '• ' + L2('Sin comida activa.', 'No meal active.'),
      '💪 ' + L2('Entrenar en la salita (háblales): Usopp puntería (dispara a las botellas con ⚔ hacia donde miras), Zoro cortes (⚔ cuando un tronco esté cerca) y Sanji esquivar (sal del círculo rojo). 30 s; oro completo la primera vez cada día (¼ después) y un bono de 10 min.', 'Train in the lounge (talk to them): Usopp aim (shoot the bottles with ⚔ where you face), Zoro cuts (⚔ when a log is close) and Sanji dodge (leave the red circle). 30 s; full gold the first time each day (¼ after) and a 10 min bonus.'),
      L2('Récords: ', 'Records: ') + ['usopp', 'zoro', 'sanji'].map(k => MB_TRAIN[k].n + ' ' + ((t[k] && t[k].best) || 0)).join(' · ')
    ]; }, () => null]);
  LUPA_DAWN.push(['crew620', () => '⚔ ' + L2('Poder y duelos de la tripulación', 'Crew power and duels'), () => {
    const P = G.P; let I = null; try { I = crewPowerInfo(P); } catch (e) { }
    return [
      L2('La tripulación sube de poder la primera vez que completas cada arco (+15 %) y la primera vez que vences a cada jefe de la historia (+2 %). Repetir no suma. Más vida, defensa y daño en sus técnicas.', 'The crew grows stronger the first time you complete each arc (+15 %) and the first time you beat each story boss (+2 %). Replays don’t count. More HP, defense and technique damage.'),
      I ? L2('Ahora: ', 'Now: ') + I.done + '/' + CREW_POW_ARCS.length + L2(' arcos · ', ' arcs · ') + I.battles + L2(' jefes · +', ' bosses · +') + Math.round(I.bonus * 100) + ' %' : '',
      L2('Duelos: habla con Luffy, Zoro, Usopp o Sanji en tierra y elige «Desafiar». Nadie muere, no da XP ni botín; oro la primera vez que ganas a cada poder nuevo. Nami no pelea.', 'Duels: talk to Luffy, Zoro, Usopp or Sanji ashore and choose “Challenge”. Nobody dies, no XP or loot; gold the first time you beat each new power level. Nami doesn’t fight.')
    ].filter(Boolean); }, () => null]);
}
