// 5.97 · Sergio: «buff de crítico si tienes Goma con Engranaje 2», «Bara Bara: 4 habilidades con sprites animados (nos
// cortamos en pedazos y los pedazos atacan)» y «3 habilidades de la fruta de invisibilidad».
// Los pedazos se recortan del fotograma real del personaje (atlas del jugador, también en HD), así sirven para las 5
// estructuras de cuerpo, cualquier ropa y cualquier dirección. Efectos en capa aparte (DL_HOOKS), nunca en el sprite.

// ---------- Goma + Engranaje 2 ----------
const GOMA_VAPOR = { crit: 12, critD: 30 };
const gomaVapor = P => !!(P && P.fruit === 'goma' && P.sr === 'vapor' && P.srF && srOk());
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); try { if (P === G.P && P.S && gomaVapor(P)) { P.S.crit = Math.min(75, P.S.crit + GOMA_VAPOR.crit); P.S.critD += GOMA_VAPOR.critD; } } catch (e) { } return r; }; }
{ let was = false; V33_TICKS.push(() => { const P = G.P; if (!P) return; const on = gomaVapor(P); if (on !== was) { was = on; calcStats(P); if (on) banner('♨ ' + L2('Goma + Engranaje 2', 'Rubber + Gear 2'), L2('+12 % de crítico y +30 % de daño crítico', '+12% crit and +30% crit damage')); } }); }

// ---------- utilidades: pedazos del cuerpo ----------
const BARA_FX = [];
function baraFrame(P) { const A = P.atlas || playerAtlas(P), col = A.idx.idle || 0, row = DIRI[P.dir] || 0; return { A, col, row }; }
// pedazo: [y0, y1] en fracción del alto del fotograma; [x0, x1] en fracción del ancho
const BARA_PIECES = [{ n: 'head', y: [0, 0.42], x: [0, 1] }, { n: 'body', y: [0.42, 0.66], x: [0, 1] }, { n: 'armL', y: [0.4, 0.68], x: [0, 0.42] }, { n: 'armR', y: [0.4, 0.68], x: [0.58, 1] }, { n: 'legs', y: [0.66, 1], x: [0, 1] }];
function baraDrawPiece(F, pc, x, y, ang, alpha) { const { A, col, row } = F, hd = HDS > 1 && A.hdL && typeof hdEnsure === 'function' && hdEnsure(A, col, row), k = hd ? 2 : 1, img = hd ? A.hd : A.img;
  const sx = (col * A.fw + pc.x[0] * A.fw) * k, sy = (row * A.fh + pc.y[0] * A.fh) * k, sw = (pc.x[1] - pc.x[0]) * A.fw, sh = (pc.y[1] - pc.y[0]) * A.fh;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(Math.round(x), Math.round(y)); if (ang) ctx.rotate(ang); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, sw * k, sh * k, Math.round(-sw / 2), Math.round(-sh / 2), sw, sh);
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= alpha * 0.55; ctx.strokeStyle = '#d587e6'; ctx.lineWidth = 1; ctx.translate(Math.round(x), Math.round(y)); if (ang) ctx.rotate(ang);
  ctx.setLineDash([2, 2]); ctx.strokeRect(Math.round(-sw / 2) - 0.5, Math.round(-sh / 2) - 0.5, sw + 1, sh + 1); ctx.restore(); }
function baraKnife(x, y, ang, s) { ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.rotate(ang); ctx.fillStyle = '#5e7688'; ctx.fillRect(-2 * s, -1, 3 * s, 2); ctx.fillStyle = '#d8e7e7'; ctx.fillRect(s, -1, 6 * s, 2); ctx.fillStyle = '#fff9df'; ctx.fillRect(s, -1, 6 * s, 1); ctx.restore(); }
// cuerpo partido: no se dibuja el personaje entero mientras los pedazos están fuera
{ const _de = drawEnt; drawEnt = function (e) { if (e === G.P && e.baraSplit > G.t) return; return _de.apply(this, arguments); }; }
DL_HOOKS.push((list, cx, cy) => { const P = G.P; if (!P || !BARA_FX.length) return; for (let i = BARA_FX.length - 1; i >= 0; i--) if (G.t - BARA_FX[i].t0 > BARA_FX[i].dur) BARA_FX.splice(i, 1);
  for (const f of BARA_FX) { if (f.map !== G.map.id) continue; list.push({ type: 'xdraw', x: P.x, y: (f.y || P.y) + 1, noShadow: true, draw: () => { try { BARA_C = [cx, cy]; f.draw(clamp((G.t - f.t0) / f.dur, 0, 1), cx, cy); } catch (e) { } } }); } });
const baraDmg = (P, e, r) => P.S.atk * ((e.m || 1) + (e.mr || 0) * (r - 1)) * (1 + (P.S.skillP || 0) / 100);
const ease = t => 1 - (1 - t) * (1 - t);
// recibir menos daño con el cuerpo partido (no en PvP ni el daño del agua)
{ const _hp = hurtPlayer; hurtPlayer = function (base, src) { const P = G.P; if (P && P.baraSplit > G.t && typeof base === 'number' && !(src && src.pvp)) base *= 0.6; if (P && P.traVeil > G.t && typeof base === 'number' && !(src && src.pvp)) base *= 0.65; return _hp.call(this, base, ...Array.prototype.slice.call(arguments, 1)); }; }

// ---------- técnicas ----------
const DF2 = [
  ['bara1', 'bara', L2('Bara Bara: Cañón', 'Chop-Chop: Cannon'), 4, 16, ['star', '#d587e6'], { k: 'bcanon', m: 2.5, mr: 0.12 }, L2('Separas el puño y lo disparas en línea recta (170 px): atraviesa a todos los enemigos, {m}% de daño.', 'You detach your fist and fire it in a straight line (170 px): it pierces every enemy, {m}% damage.')],
  ['bara2', 'bara', L2('Bara Bara: Festival', 'Chop-Chop: Festival'), 18, 34, ['spin', '#d587e6'], { k: 'bfest', m: 0.55, mr: 0.03 }, L2('Te partes en pedazos 3 s: giran a tu alrededor y golpean a todo lo cercano 10 veces ({m}% cada una). Partido recibes 40 % menos de daño.', 'You split apart for 3 s: your pieces spin around you and hit everything nearby 10 times ({m}% each). While split you take 40% less damage.')],
  ['bara3', 'bara', L2('Bara Bara: Pies Saltarines', 'Chop-Chop: Hopping Feet'), 12, 28, ['slam', '#d587e6'], { k: 'bpies', m: 1.05, mr: 0.06 }, L2('Tus piernas se separan y pisotean al objetivo 4 veces ({m}% cada una); el último pisotón aturde a los enemigos comunes.', 'Your legs detach and stomp the target 4 times ({m}% each); the last stomp stuns ordinary enemies.')],
  ['bara4', 'bara', L2('Bara Bara: Cuchillas Voladoras', 'Chop-Chop: Flying Blades'), 26, 48, ['multi', '#d587e6'], { k: 'bcuch', m: 3.4, mr: 0.2 }, L2('Tu cuerpo se deshace y cada pedazo vuela con un cuchillo hacia un enemigo distinto (hasta 5): {m}% de daño a cada uno.', 'Your body comes apart and each piece flies with a knife at a different enemy (up to 5): {m}% damage each.')],
  ['tra2', 'transparente', L2('Golpe Fantasma', 'Phantom Strike'), 9, 24, ['eye', '#5ad8c8'], { k: 'tfant', m: 3.0, mr: 0.15 }, L2('Desapareces, apareces detrás del enemigo más cercano y lo golpeas: {m}% de daño y aturde 0,6 s a los comunes. Quedas invisible 1,5 s.', 'You vanish, appear behind the nearest enemy and strike: {m}% damage and 0.6 s stun on ordinary foes. You stay invisible for 1.5 s.')],
  ['tra3', 'transparente', L2('Velo Espejo', 'Mirror Veil'), 22, 34, ['shield', '#5ad8c8'], { k: 'tvelo', m: 1.6, mr: 0.1 }, L2('Una onda transparente: {m}% de daño alrededor, los enemigos comunes pierden tu rastro y 4 s recibes 35 % menos de daño.', 'A transparent wave: {m}% damage around you, ordinary enemies lose your trail and for 4 s you take 35% less damage.')]];
for (const [id, kind, n, cd, mp, icon, eff, d] of DF2) { sk(id, 'fruta', 0, 0, n, 'act', 500, null, { mp, cd, icon, eff, d, fruit: 1, max: 10 }); if (!DFS[kind].includes(id)) DFS[kind].push(id); }
const DF2_IDS = new Set(DF2.map(r => r[0]));
DFR.bara.passive = L2('Pasiva · 10 % de esquivar al separarte. Técnicas en Habilidades › Fruta.', 'Passive · 10% dodge by splitting. Techniques in Skills › Fruit.');

function df2Cast(id) { const P = G.P, s = SK[id], e = s.eff, r = P.skills[id] || 1, dmg = baraDmg(P, e, r), M = G.map, F = baraFrame(P);
  const tgt = nearestMob(P.x, P.y, 190, m => !m.remove), ang = tgt ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]); if (tgt) P.dir = dirFromVec(tgt.x - P.x, tgt.y - P.y);
  const add = (dur, draw, y) => BARA_FX.push({ t0: G.t, dur, draw, map: M.id, y });
  switch (e.k) {
    case 'bcanon': { setAnim(P, 'atk'); const L = 170, ox = P.x, oy = P.y - 22, arm = BARA_PIECES[ang > -Math.PI / 2 && ang < Math.PI / 2 ? 3 : 2]; sfx('swing');
      add(0.62, (p) => { const t = p < 0.55 ? ease(p / 0.55) : 1 - (p - 0.55) / 0.45, x = ox + Math.cos(ang) * L * t, y = oy + Math.sin(ang) * L * t; baraDrawPiece(F, arm, x - cxW(), y - cyW(), ang + Math.PI / 2, 1);
        for (let k = 1; k < 4; k++) baraDrawPiece(F, arm, ox + Math.cos(ang) * L * t * (1 - k * 0.12) - cxW(), oy + Math.sin(ang) * L * t * (1 - k * 0.12) - cyW(), ang + Math.PI / 2, 0.18 / k); });
      delayAct(0.2, () => { const hit = new Set(); for (let k = 1; k <= 7; k++) { const x = ox + Math.cos(ang) * L * k / 7, y = oy + 22 + Math.sin(ang) * L * k / 7; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === M.id && !hit.has(m) && dist2(m.x, m.y, x, y) < (20 + (m.rad || 8)) ** 2) { hit.add(m); hitMob(m, dmg, { kb: 60 }); } }
        burst(ox + Math.cos(ang) * L, oy + Math.sin(ang) * L, 12, { sp: 80, up: 20, life: 0.4, c: DFR.bara.colors }); G.shake = 3; }); break; }
    case 'bfest': { P.baraSplit = G.t + 3; setAnim(P, 'cast'); sfx('buff'); burst(P.x, P.y - 16, 22, { sp: 90, up: 40, life: 0.5, c: DFR.bara.colors });
      add(3, (p) => { const T = p * 3, px = G.P.x - cxW(), py = G.P.y - cyW(); BARA_PIECES.forEach((pc, i) => { const a = T * 4.2 + i * 2 * Math.PI / 5, rr = 14 + 32 * Math.min(1, T * 3, (3 - T) * 3), x = px + Math.cos(a) * rr, y = py - 18 + Math.sin(a) * rr * 0.6;
        baraDrawPiece(F, pc, x, y, a * 0.6, 1); if (pc.n.startsWith('arm')) baraKnife(x + Math.cos(a + 1.6) * 6, y + Math.sin(a + 1.6) * 6, a + 1.6, 1); }); });
      for (let k = 0; k < 10; k++) delayAct(0.25 + k * 0.28, () => { if (G.map !== M) return; hitCircle(P.x, P.y, 58, dmg); if (k % 2) sfx('swing'); }); break; }
    case 'bpies': { const tx = tgt ? tgt.x : P.x + Math.cos(ang) * 70, ty = tgt ? tgt.y : P.y + Math.sin(ang) * 50, ox = P.x, oy = P.y - 8; P.busy = 0.5; setAnim(P, 'cast'); telegraph({ shape: 'circle', x: tx, y: ty, r: 40, dur: 0.5, col: 'rgba(213,135,230,0.18)' });
      add(2.2, (p) => { const T = p * 2.2, legs = BARA_PIECES[4]; let x, y; if (T < 0.35) { const t = ease(T / 0.35); x = ox + (tx - ox) * t; y = oy + (ty - 8 - oy) * t - Math.sin(t * Math.PI) * 30; }
        else if (T < 1.95) { const q = ((T - 0.35) / 0.4) % 1; x = tx; y = ty - 8 - Math.abs(Math.sin(q * Math.PI)) * 22; } else { const t = (T - 1.95) / 0.25; x = tx + (G.P.x - tx) * t; y = ty - 8 + (G.P.y - 8 - (ty - 8)) * t; }
        baraDrawPiece(F, legs, x - cxW(), y - cyW(), 0, 1); });
      for (let k = 0; k < 4; k++) delayAct(0.55 + k * 0.4, () => { if (G.map !== M) return; hitCircle(tx, ty, 40, dmg, k === 3 ? { stun: 0.8 } : {}); addFx({ type: 'ring', x: tx, y: ty, r: 30, dur: 0.3, col: '#d587e6' }); burst(tx, ty, 8, { sp: 70, up: 20, life: 0.35, c: ['#d8c8b0', '#874aac'] }); G.shake = 2; }); break; }
    case 'bcuch': { const foes = G.ents.filter(m => m.type === 'mob' && !m.dying && !m.remove && m.map === M.id && dist2(m.x, m.y, P.x, P.y) < 190 * 190).sort((a, b) => dist2(a.x, a.y, P.x, P.y) - dist2(b.x, b.y, P.x, P.y)).slice(0, 5);
      P.baraSplit = G.t + 1.2; P.busy = 1.1; sfx('boom'); burst(P.x, P.y - 16, 26, { sp: 110, up: 50, life: 0.5, c: DFR.bara.colors }); const ox = P.x, oy = P.y - 18;
      BARA_PIECES.forEach((pc, i) => { const m = foes[i % Math.max(1, foes.length)]; const tx = m ? m.x : ox + Math.cos(i * 1.26) * 80, ty = m ? m.y - 14 : oy + Math.sin(i * 1.26) * 60;
        add(1.2, (p) => { const t = p < 0.5 ? ease(p / 0.5) : 1 - ease((p - 0.5) / 0.5), x = ox + (tx - ox) * t, y = oy + (ty - oy) * t - Math.sin(t * Math.PI) * 20, a = Math.atan2(ty - oy, tx - ox);
          baraDrawPiece(F, pc, x - cxW(), y - cyW(), p * 9, 1); baraKnife(x - cxW() + Math.cos(a) * 8, y - cyW() + Math.sin(a) * 8, a, 1.2); }, ty); });
      delayAct(0.6, () => { if (G.map !== M) return; for (const m of foes) if (!m.dying) { hitMob(m, dmg, { kb: 40 }); addFx({ type: 'ring', x: m.x, y: m.y, r: 18, dur: 0.3, col: '#ebacff' }); } G.shake = 4; }); break; }
    case 'tfant': { const m = tgt; if (!m) { toast(L2('No hay ningún enemigo cerca.', 'No enemy nearby.'), 'info', 2); P.cds[id] = 1; P.mp += s.mp; return; }
      const bx = m.x + Math.cos(ang) * 22, by = m.y + Math.sin(ang) * 14, ox = P.x, oy = P.y, F0 = baraFrame(P);
      add(0.55, (p) => { for (let k = 0; k < 4; k++) { const t = Math.min(1, p * 1.8 - k * 0.12); if (t < 0) continue; const x = ox + (bx - ox) * t, y = oy + (by - oy) * t; ctx.save(); ctx.globalAlpha = (1 - p) * 0.4 / (k + 1); ctx.filter = 'hue-rotate(140deg) saturate(1.6)';
        try { atlasBlit(ctx, F0.A, F0.col, F0.row, Math.round(x - F0.A.ax - cxW()), Math.round(y - F0.A.ay - cyW()), F0.A.fw, F0.A.fh); } catch (e) { } ctx.restore(); } });
      if (!blockedFor(M, bx >> 4, by >> 4, P.L || 0)) { P.x = bx; P.y = by; } else moveEnt(M, P, bx - P.x, by - P.y); P.dir = dirFromVec(m.x - P.x, m.y - P.y); setAnim(P, 'atk'); sfx('swing');
      delayAct(0.12, () => { if (m.dying || G.map !== M) return; hitMob(m, dmg, m.boss ? {} : { stun: 0.6 }); addFx({ type: 'ring', x: m.x, y: m.y, r: 22, dur: 0.35, col: '#a8f4e4' }); burst(m.x, m.y - 12, 14, { sp: 90, up: 30, life: 0.4, c: ['#a8f4e4', '#5ad8c8', '#ffffff'] }); });
      addBuff(P, 'df_invis', { invis: 1, ambush: 0 }, 1.5); break; }
    case 'tvelo': { setAnim(P, 'cast'); sfx('buff'); P.traVeil = G.t + 4; hitCircle(P.x, P.y, 110, dmg);
      for (const m of G.ents) if (m.type === 'mob' && !m.boss && !m.dying && m.map === M.id && dist2(m.x, m.y, P.x, P.y) < 160 * 160) { m.state = 'return'; m.cd = Math.max(m.cd || 0, 1.5); }
      addBuff(P, 'df_invis', { invis: 1, ambush: 0 }, 2); const ox = P.x, oy = P.y;
      add(0.9, (p) => { for (let k = 0; k < 3; k++) { const q = clamp(p * 1.3 - k * 0.15, 0, 1); if (!q) continue; ctx.save(); ctx.globalAlpha = (1 - q) * 0.7; ctx.strokeStyle = k === 1 ? '#ffffff' : '#7ae8d8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(Math.round(ox - cxW()), Math.round(oy - cyW()), 110 * q, 66 * q, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); } });
      add(4, (p) => { const P_ = G.P; ctx.save(); ctx.globalAlpha = 0.22 + Math.sin(G.t * 6) * 0.08; ctx.strokeStyle = '#a8f4e4'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(Math.round(P_.x - cxW()), Math.round(P_.y - 14 - cyW()), 15, 22, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }); break; } } }
// coordenadas de cámara del fotograma que se está dibujando (las pasa DL_HOOKS)
let BARA_C = [0, 0]; function cxW() { return BARA_C[0]; } function cyW() { return BARA_C[1]; }
{ const _dc = dfCast; dfCast = function (id) { if (!DF2_IDS.has(id)) return _dc.apply(this, arguments); const P = G.P; if (DFS[P.fruit] && DFS[P.fruit].includes(id) && !P.dawnHelm) df2Cast(id); }; }
{ const _pd = playerDie; playerDie = function () { if (G.P) { G.P.baraSplit = 0; G.P.traVeil = 0; } BARA_FX.length = 0; return _pd.apply(this, arguments); }; }
{ const _sm = setMap; setMap = function () { const r = _sm.apply(this, arguments); if (G.P) { G.P.baraSplit = 0; } BARA_FX.length = 0; return r; }; }
