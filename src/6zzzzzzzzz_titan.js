// Despertar Titánico (original): the strongest transformation for now. Any class except the Transmutador.
// Etapa 1 «Puño Titán»: each punch lands as a giant fist. Etapa 2 «Doble Titán» (mastery 40+): both fists giant.
// Lasts 2 minutes and then leaves you exhausted, unless you master it (mastery 100 = no limit). Disabled in PvP duels.
// How to get it: level 610 + 8 Fragmentos titánicos (bosses of level 500+ drop them) + 500 000 gold → use a fragment.
SAVEKEYS.push('titanOwn', 'titanM');
const TT = { lv: 610, frags: 8, gold: 500000, dur: 120, cd: 90, tired: 20, stage2: 40, drop: 0.35, bossLv: 500 };
it('titan_frag', { n: 'Fragmento titánico', t: 'cons', stack: true, price: 5000, rar: 4, icon: ['star', '#ffb43a'],
  d: L2('Late como un puño cerrado. Con 8, nivel 610 y 500 000 de oro, úsalo para el Despertar Titánico.', 'It throbs like a clenched fist. With 8, level 610 and 500,000 gold, use it for the Titanic Awakening.') });
function ttCan(P) { return !!P && P.cls !== 'transmutador'; }
function ttPvp() { return typeof pvpOn === 'function' && pvpOn(); }
function ttMastered(P) { return (P.titanM || 0) >= 100; }
function ttCount(P) { return (P.inv || []).filter(s => s && s.id === 'titan_frag').reduce((a, s) => a + (s.q || 1), 0); }
function ttTake(P, n) {
  for (let i = P.inv.length - 1; i >= 0 && n > 0; i--) { const s = P.inv[i]; if (!s || s.id !== 'titan_frag') continue;
    const q = s.q || 1, k = Math.min(q, n); n -= k; if (q - k > 0) s.q = q - k; else P.inv.splice(i, 1); }
}
// ---------- unlock ----------
hookBefore('useItem', idx => {
  const P = G.P, s = P?.inv[idx]; if (!s || s.id !== 'titan_frag') return;
  if (!ttCan(P)) { toast(L2('Tu cuerpo ya está ligado al Brazalete de núcleos.', 'Your body is already bound to the Core Bracelet.'), 'warn'); return HOOK_SKIP; }
  if (P.titanOwn) { toast(L2('Ya tienes el Despertar Titánico. Toca 🥊 para usarlo.', 'You already have the Titanic Awakening. Tap 🥊 to use it.'), 'info'); return HOOK_SKIP; }
  const n = ttCount(P), miss = [];
  if (P.lv < TT.lv) miss.push(L2('nivel ' + TT.lv, 'level ' + TT.lv));
  if (n < TT.frags) miss.push(n + '/' + TT.frags + L2(' fragmentos', ' fragments'));
  if (P.gold < TT.gold) miss.push(fmt(TT.gold) + L2(' de oro', ' gold'));
  if (miss.length) { toast(L2('Despertar Titánico: te falta ', 'Titanic Awakening: you still need ') + miss.join(' · '), 'warn', 4); return HOOK_SKIP; }
  ttTake(P, TT.frags); P.gold -= TT.gold; P.titanOwn = true; P.titanM = 0;
  addFx({ type: 'ttwave', x: P.x, y: P.y, r: 90, dur: 1, light: 160 }); burst(P.x, P.y - 14, 40, { sp: 120, up: 70, g: 40, life: 0.9, c: ['#ffb43a', '#fff2b0', '#ffffff'] });
  if (typeof banner === 'function') banner(L2('¡Despertar Titánico!', 'Titanic Awakening!'), L2('Toca 🥊 junto al mapa para transformarte.', 'Tap 🥊 next to the map to transform.'));
  sfx('levelup'); uiDirty.inv = uiDirty.hud = true; markDirty();
  return HOOK_SKIP;
});
hookAfter('killMob', (_r, m) => {
  const P = G.P; if (!m || !m.boss || !P || !ttCan(P) || (m.lv || 0) < TT.bossLv) return;
  if (P.titanOwn ? Math.random() < TT.drop * 0.3 : Math.random() < TT.drop) giveItem('titan_frag', 1);
});
// ---------- transform ----------
function ttStage(P) { return P?.titanOn || 0; }
function ttSet(P, st) {
  const prev = P.titanOn || 0; P.titanOn = st;
  if (st && !prev) P.titanT = TT.dur;
  calcStats(P); refreshLook(); uiDirty.hud = true;
  if (st) { addFx({ type: 'ttwave', x: P.x, y: P.y, r: 50 + st * 20, dur: 0.6, light: 90 }); burst(P.x, P.y - 12, 24, { sp: 100, up: 50, life: 0.6, c: ['#ffb43a', '#fff2b0', '#ffffff'] });
    toast(st === 1 ? L2('🥊 Puño Titán', '🥊 Titan Fist') : L2('🥊🥊 Doble Titán', '🥊🥊 Double Titan'), 'info', 2); sfx('buff'); }
}
function ttToggle() {
  const P = G.P; if (!P || P.dead || !P.titanOwn) return;
  if (!ttCan(P)) { toast(L2('Tu cuerpo ya está ligado al Brazalete de núcleos.', 'Your body is already bound to the Core Bracelet.'), 'warn'); return; }
  if (ttPvp()) { toast(L2('El Despertar Titánico no se puede usar en duelos.', 'The Titanic Awakening cannot be used in duels.'), 'warn'); return; }
  const st = ttStage(P);
  if (!st && (P.titanCd || 0) > 0) { toast(L2('Agotado: podrás volver a usarlo en ', 'Exhausted: you can use it again in ') + Math.ceil(P.titanCd) + ' s', 'warn'); return; }
  const next = st === 0 ? 1 : st === 1 && (P.titanM || 0) >= TT.stage2 ? 2 : 0;
  if (!next) ttEnd(P, false); else ttSet(P, next);
}
function ttEnd(P, timeout) {
  ttSet(P, 0);
  if (timeout && !ttMastered(P)) { P.titanCd = TT.cd; addBuff(P, 'tt_tired', { spdP: -20, atkP: -10 }, TT.tired);
    toast(L2('Te quedas agotado: −20 % de velocidad durante ' + TT.tired + ' s.', 'You are exhausted: −20% speed for ' + TT.tired + ' s.'), 'warn', 3); }
  else if (!ttMastered(P)) P.titanCd = TT.cd * 0.4;
}
V33_TICKS.push(dt => {
  const P = G.P; if (!P || !dt) return;
  if (P.titanCd > 0) P.titanCd = Math.max(0, P.titanCd - dt);
  if (!P.titanOn) return;
  if (P.dead || ttPvp() || !ttCan(P)) { ttSet(P, 0); return; }
  if (!ttMastered(P)) { P.titanT -= dt; if (P.titanT <= 0) ttEnd(P, true); }
});
hookAfter('killMob', (_r, m) => { const P = G.P; if (P?.titanOn && m) { const before = P.titanM || 0; P.titanM = Math.min(100, before + (m.boss ? 5 : 0.5));
  if (before < TT.stage2 && P.titanM >= TT.stage2) toast(L2('¡Maestría 40! Ya puedes usar el Doble Titán (toca 🥊 otra vez).', 'Mastery 40! You can now use Double Titan (tap 🥊 again).'), 'loot', 4);
  if (before < 100 && P.titanM >= 100) toast(L2('¡Despertar Titánico dominado! Ya no tiene límite de tiempo.', 'Titanic Awakening mastered! No more time limit.'), 'loot', 4); } });
hookAfter('playerDie', () => { const P = G.P; if (P?.titanOn) ttSet(P, 0); });
// Strongest transformation for now; mastery adds up to +15 % more.
hookAfter('calcStats', (S, P) => {
  const st = P?.titanOn; if (!st || !S) return;
  const m = (P.titanM || 0) / 100, atk = (st === 2 ? 0.45 : 0.30) + 0.15 * m, def = st === 2 ? 0.15 : 0.10;
  S.atk = Math.round(S.atk * (1 + atk)); S.def = Math.round(S.def * (1 + def));
  if (st === 2) S.aspd /= 1.10;
  S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10);
});
// The Transmutador cannot eat fruits nor use the game's other transformations.
hookBefore('dfEat', () => { if (G.P?.cls === 'transmutador') { toast(L2('Tu cuerpo ya está ligado al Brazalete de núcleos: no puedes comer frutas.', 'Your body is already bound to the Core Bracelet: you cannot eat fruits.'), 'warn'); return HOOK_SKIP; } });
hookBefore('srToggle', () => { if (G.P?.cls === 'transmutador') { toast(L2('Tu cuerpo ya está ligado al Brazalete de núcleos.', 'Your body is already bound to the Core Bracelet.'), 'warn'); return HOOK_SKIP; } });
// ---------- combat ----------
const TT_TECH = [
  { n: ['Martillo titánico', 'Titan hammer'], icon: '🔨', cd: 8, mp: 0.06, m: 3.0 },
  { n: ['Ráfaga titánica', 'Titan barrage'], icon: '👊', cd: 10, mp: 0.07, m: 0.8 },
  { n: ['Embestida titánica', 'Titan charge'], icon: '💨', cd: 9, mp: 0.06, m: 2.4 },
  { n: ['Impacto final', 'Final impact'], icon: '💥', cd: 22, mp: 0.1, m: 4.0 }
];
function ttDmg(P, m) { return P.S.atk * m * (1 + (P.titanM || 0) / 200); }
function ttSkin(P) { return [['#a86e58', '#e3a98d', '#f6caaf'], ['#8a5640', '#c78c6a', '#dea684'], ['#5e3826', '#905c3e', '#ae7652'], ['#3a2216', '#603c28', '#7c5036']][(P.app?.skin | 0) % 4]; }
function ttAttack(P, i) {
  if (P.dead || P.busy > 0 || P.job || P.fishing) return;
  const t = TT_TECH[i], key = 'tt_' + i;
  if (t) { const cost = Math.ceil(P.S.maxmp * t.mp); if (P.cds[key] > 0 || P.mp < cost) return; P.cds[key] = t.cd; P.mp -= cost; }
  else { if (P.atkCd > 0) return; P.atkCd = P.S.aspd; }
  const target = nearestMob(P.x, P.y, t ? 170 : 56); if (target) P.dir = dirFromVec(target.x - P.x, target.y - P.y);
  const [dx, dy] = DIRV[P.dir], ang = Math.atan2(dy, dx), map = G.map, st = P.titanOn, skin = ttSkin(P);
  const later = (s, fn) => delayAct(s, () => { if (G.P === P && G.map === map && !P.dead && P.titanOn) fn(); });
  const fist = (x, y, a, size, dur, drop) => addFx({ type: 'ttfist', x, y, ang: a, s: size, dur, skin, drop });
  setAnim(P, t && i === 3 ? 'slam' : 'atk'); P.loopAnim = false; P.busy = 0.3; P.combatT = G.t;
  const ex = target?.x ?? P.x + dx * 60, ey = target?.y ?? P.y + dy * 50;
  if (!t) { // basic punch: the giant fist on the sprite punches; here only the impact
    const side = (P._ttSide = !P._ttSide) ? 1 : -1, d = ttDmg(P, st === 2 ? 0.75 : 1.1);
    later(0.06, () => { const x = P.x + dx * 30 - dy * 5 * side, y = P.y + dy * 22 + dx * 3 * side;
      hitArc(P.x, P.y, ang, 46, 1.4, d, { kb: 26 }); addFx({ type: 'ttwave', x, y, r: 22, dur: 0.3 }); burst(x, y - 8, 6, { sp: 70, up: 30, life: 0.3, c: ['#fff2b0', '#ffb43a'] }); G.shake = Math.max(G.shake || 0, 1.5); });
    if (st === 2) later(0.18, () => { setAnim(P, 'atk'); const x = P.x + dx * 30 + dy * 5 * side, y = P.y + dy * 22 - dx * 3 * side;
      hitArc(P.x, P.y, ang, 46, 1.4, d, { kb: 26 }); addFx({ type: 'ttwave', x, y, r: 22, dur: 0.3 }); });
  } else if (i === 0) { // giant fist falls from above
    later(0.1, () => fist(ex, ey - 10, Math.PI / 2, 1.8, 0.42, 1));
    later(0.42, () => { hitCircle(ex, ey, 46, ttDmg(P, t.m), { stun: 0.8 }); addFx({ type: 'ttwave', x: ex, y: ey, r: 52, dur: 0.6, light: 90 }); G.shake = Math.max(G.shake || 0, 5); });
  } else if (i === 1) { // barrage of giant punches
    for (let j = 0; j < 6; j++) later(0.06 + j * 0.1, () => { setAnim(P, 'atk'); const o = (j % 2 ? 1 : -1) * (4 + (j % 3) * 3);
      fist(P.x + dx * 28 - dy * o, P.y + dy * 22 + dx * o * 0.6 - 10, ang + (j % 2 ? 0.12 : -0.12), 1.1, 0.2); hitArc(P.x, P.y, ang, 50, 1.3, ttDmg(P, t.m), {}); G.shake = Math.max(G.shake || 0, 1.5); });
  } else if (i === 2) { // charge with the fist in front
    const steps = 8, dist = 76;
    for (let j = 1; j <= steps; j++) later(j * 0.025, () => { moveEnt(G.map, P, dx * dist / steps, dy * dist / steps); if (j % 2) fist(P.x + dx * 22, P.y + dy * 18 - 10, ang, 1.25, 0.12); });
    later(steps * 0.025 + 0.02, () => { hitArc(P.x - dx * dist / 2, P.y - dy * dist / 2, ang, dist / 2 + 24, 0.9, ttDmg(P, t.m), { kb: 50 }); addFx({ type: 'ttwave', x: P.x + dx * 20, y: P.y + dy * 16, r: 36, dur: 0.4 }); G.shake = Math.max(G.shake || 0, 3); });
  } else { // final impact: both giant fists slam the ground
    later(0.12, () => { fist(P.x - 22, P.y - 22, Math.PI / 2, 1.6, 0.35, 1); fist(P.x + 22, P.y - 22, Math.PI / 2, 1.6, 0.35, 1); });
    later(0.42, () => { hitCircle(P.x, P.y, 80, ttDmg(P, t.m), { stun: 1, kb: 60 }); addFx({ type: 'ttwave', x: P.x, y: P.y, r: 90, dur: 0.8, light: 160 }); G.shake = Math.max(G.shake || 0, 7); });
  }
  sfx('hit');
}
hookBefore('basicAttack', () => { const P = G.P; if (P?.titanOn && !(typeof tmActive === 'function' && tmActive(P))) { ttAttack(P, -1); return HOOK_SKIP; } });
// ---------- sprite: giant arm(s) drawn on the player's own body, every frame and direction ----------
function ttDrawArm(p, A, L, sx, dx, dy, back) {
  const SK = L.skin, out = C('#2a1614'), shY = A.torsoTop + 1, side = A.side;
  const fwd = A.anim === 'atk' || A.anim === 'slam' ? 3 : 0, [vx, vy] = DIRV[A.dir] || [0, 1];
  const hx = Math.round(sx + 1 + dx * 1.2 + vx * fwd), hy = Math.round(shY + 7 + dy * 1.1 + Math.max(0, vy) * fwd - (vy < 0 ? fwd : 0));
  const put = (x, y, c) => { if (x < 0 || y < 0 || x >= p.w || y >= p.h) return; if (back && tmOpaqueTT(p, x, y)) return; p.set(x, y, c); };
  // upper arm (bicep) and forearm: thick, outlined, shaded
  const ex = Math.round((sx + 1 + hx) / 2), ey = Math.round((shY + hy) / 2);
  const seg = (x0, y0, x1, y1, w) => { const n = Math.max(1, Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let k = 0; k <= n; k++) { const x = Math.round(x0 + (x1 - x0) * k / n), y = Math.round(y0 + (y1 - y0) * k / n);
      for (let i = -1; i <= w; i++) put(x - (w >> 1) + i, y, i < 0 || i === w ? out : SK[back ? 0 : i === 0 ? 2 : i === w - 1 ? 0 : 1]); } };
  seg(sx + 1, shY, ex, ey, 4); seg(ex, ey, hx, hy - 2, 5);
  if (!back) { put(ex - 1, ey - 1, SK[3]); put(ex, ey - 2, SK[3]); }   // bicep highlight
  // big fist 8x7 with knuckles, fingers and thumb
  const fx = hx - 4, fy = hy - 2, front = !A.up;
  for (let y = -1; y <= 7; y++) for (let x = -1; x <= 8; x++) {
    const edge = x < 0 || x > 7 || y < 0 || y > 6; if (edge) { if (!((x < 0 || x > 7) && (y < 0 || y > 6))) put(fx + x, fy + y, out); continue; }
    let c = SK[back ? 0 : 1]; if (!back) { if (y <= 1) c = SK[2]; if (y === 0 && x % 2 === 1) c = SK[3]; if (x === 0 || y === 6) c = SK[0]; }
    put(fx + x, fy + y, c);
  }
  if (front && !back) { for (const x of side ? [] : [2, 4, 6]) for (let y = 2; y <= 4; y++) put(fx + x, fy + y, SK[0]);
    if (side) { const kx = A.d > 0 ? fx + 7 : fx; for (let y = 1; y <= 5; y += 2) put(kx, fy + y, SK[0]); }
    const tx = side ? (A.d > 0 ? fx + 1 : fx + 4) : fx + 1; put(tx, fy + 5, SK[2]); put(tx + 1, fy + 5, SK[2]); put(tx + 2, fy + 5, SK[3]); }
}
function tmOpaqueTT(p, x, y) { return x >= 0 && y >= 0 && x < p.w && y < p.h && (p.d[y * p.w + x] >>> 24) > 0; }
hookAround('drawHero', (next, p, L, ...a) => {
  const r = next(p, L, ...a), A = p.meta; if (!L.ttArms || !A) return r;
  const ps = heroPose(A.dir, A.anim, A.f, L), tg = p.tg; p.tg = 3;
  const shL = A.side ? A.cx - 1 : A.tx0 - 3, shR = A.side ? A.cx - 1 : A.tx0 + A.tw;
  // engine convention: the "r" arm is at shR in front view, shL in back view and the near arm in profile
  if (A.side) { if (L.ttArms === 2) ttDrawArm(p, A, L, A.cx - 1 - A.d, ps.lax, ps.lay, true); ttDrawArm(p, A, L, A.cx - 2, ps.rax, ps.ray, false); }
  else if (A.up) { ttDrawArm(p, A, L, shL, ps.rax, ps.ray, false); if (L.ttArms === 2) ttDrawArm(p, A, L, shR, ps.lax, ps.lay, false); }
  else { ttDrawArm(p, A, L, shR, ps.rax, ps.ray, false); if (L.ttArms === 2) ttDrawArm(p, A, L, shL, ps.lax, ps.lay, false); }
  p.tg = tg; return r;
});
hookAround('playerAtlas', (next, P) => {
  const st = P?.titanOn; if (!st || (typeof tmActive === 'function' && tmActive(P))) return next(P);
  const app = normApp(P.app), gear = gearTiers(P), cos = P.cos || {};
  return getAtlas(heroKey(P.cls, app, gear, cos, P.hideHelm) + '|tt' + st, () => { const L = heroLook(P.cls, app, gear, cos, { hideHelm: P.hideHelm }); L.ttArms = st; L.weapon = { k: 'none', tier: 1 }; return buildHeroAtlas(L); });
});
// ---------- VFX: giant fist and shockwave (separate layer from the sprite) ----------
function ttRR(x, y, w, h, r) { if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); } }
function ttDrawFist(x, y, a, s, k, skin, drop) {
  const grow = drop ? 1 : 0.55 + 0.45 * Math.sin(Math.min(1, k * 2.5) * Math.PI * 0.5), fade = k > 0.7 ? (1 - k) / 0.3 : 1;
  const yy = drop ? y - 90 * Math.max(0, 1 - k * 1.6) : y;
  ctx.save(); ctx.translate(x, yy); ctx.rotate(a); ctx.scale(s * grow, s * grow); ctx.globalAlpha = fade;
  // forearm
  ctx.fillStyle = skin[0]; ctx.fillRect(-26, -6, 18, 12); ctx.fillStyle = skin[1]; ctx.fillRect(-26, -5, 18, 8);
  // fist
  ctx.fillStyle = '#2a1614'; ctx.beginPath(); ttRR(-11, -12, 24, 24, 6); ctx.fill();
  ctx.fillStyle = skin[1]; ctx.beginPath(); ttRR(-10, -11, 22, 22, 5); ctx.fill();
  ctx.fillStyle = skin[2]; ctx.fillRect(-6, -9, 12, 4);
  ctx.strokeStyle = skin[0]; ctx.lineWidth = 1.2; for (let j = -1; j <= 1; j++) { ctx.beginPath(); ctx.moveTo(4, j * 6 - 2); ctx.lineTo(11, j * 6 - 2); ctx.stroke(); }
  ctx.fillStyle = skin[0]; ctx.fillRect(-9, 6, 10, 4);   // thumb
  ctx.restore();
  // motion lines behind the fist
  if (!drop && k < 0.6) { ctx.save(); ctx.strokeStyle = 'rgba(255,240,200,' + (0.7 * (1 - k / 0.6)) + ')'; ctx.lineWidth = 1.5;
    for (let j = -1; j <= 1; j++) { const ox = -Math.sin(a) * j * 8 * s, oy = Math.cos(a) * j * 8 * s; ctx.beginPath(); ctx.moveTo(x + ox - Math.cos(a) * 30 * s, yy + oy - Math.sin(a) * 30 * s); ctx.lineTo(x + ox - Math.cos(a) * 46 * s, yy + oy - Math.sin(a) * 46 * s); ctx.stroke(); }
    ctx.restore(); }
}
hookAround('drawFx', (next, f, cx, cy) => {
  if (f.type !== 'ttfist' && f.type !== 'ttwave') return next(f, cx, cy);
  const x = f.x - cx, y = f.y - cy, k = clamp(f.t / f.dur, 0, 1), fade = 1 - k;
  if (f.type === 'ttfist') { ttDrawFist(x, y, f.ang, f.s || 1, k, f.skin || ['#a86e58', '#e3a98d', '#f6caaf'], f.drop); return; }
  ctx.save();
  const r = f.r * (0.3 + 0.7 * Math.min(1, k * 1.6));
  ctx.fillStyle = `rgba(40,28,18,${0.3 * fade})`; ctx.beginPath(); ctx.ellipse(x, y, f.r * 0.6, f.r * 0.33, 0, 0, 7); ctx.fill();
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = `rgba(255,180,60,${fade})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 7); ctx.stroke();
  ctx.strokeStyle = `rgba(255,242,176,${0.7 * fade})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, r * 0.75, r * 0.4, 0, 0, 7); ctx.stroke();
  for (let j = 0; j < 10; j++) { const a = j / 10 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.47); ctx.lineTo(x + Math.cos(a) * r * 1.1, y + Math.sin(a) * r * 0.6); ctx.stroke(); }
  ctx.restore();
});
// Golden aura while awakened.
hookAfter('drawEnt', (_, e, cx, cy) => {
  const P = G.P; if (e !== P || !P.titanOn || P.dead) return;
  const x = P.x - cx, y = P.y - cy - 12, r = 18 + P.titanOn * 4 + Math.sin(G.t * 8) * 1.5;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,236,170,0.22)'); g.addColorStop(1, 'rgba(255,170,50,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
  if (Math.random() < 0.25) part(P.x + (Math.random() - 0.5) * 14, P.y - 4, { z: 8, vz: 22, life: 0.5, c: Math.random() < 0.5 ? '#ffb43a' : '#fff2b0' });
});
// ---------- HUD ----------
V33_TICKS.push(() => {
  const P = G.P, tr = $('#tr .trbtns'); let b = $('#bTitan');
  if (!P || !tr) return;
  if (!P.titanOwn || !ttCan(P)) { if (b) b.remove(); document.getElementById('ttControls')?.remove(); return; }
  if (!b) { b = document.createElement('button'); b.className = 'mini'; b.id = 'bTitan'; b.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); ttToggle(); }); tr.append(b); }
  const st = ttStage(P), t = st ? '🥊' + (st === 2 ? '🥊' : '') + (ttMastered(P) ? '' : ' ' + Math.ceil(P.titanT || 0)) : (P.titanCd > 0 ? '🥊 ' + Math.ceil(P.titanCd) : '🥊');
  if (b.textContent !== t) b.textContent = t;
  b.title = L2('Despertar Titánico · maestría ', 'Titanic Awakening · mastery ') + Math.floor(P.titanM || 0) + '/100';
  let c = document.getElementById('ttControls');
  if (!st) { if (c) c.style.display = 'none'; return; }
  if (!c) {
    c = document.createElement('div'); c.id = 'ttControls';
    c.style.cssText = 'position:fixed;z-index:7;left:50%;bottom:15%;transform:translateX(-50%);display:flex;gap:4px';
    TT_TECH.forEach((tk, i) => { const btn = document.createElement('button'); btn.className = 'chip'; btn.dataset.tt = i; btn.title = L2(tk.n[0], tk.n[1]);
      btn.innerHTML = `<b style="font-size:22px;line-height:30px;display:inline-block;width:30px;text-align:center">${tk.icon}</b><span></span>`;
      btn.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); ttAttack(G.P, i); }); c.append(btn); });
    document.getElementById('hud').append(c);
  }
  if (c.style.display !== 'flex') c.style.display = 'flex';
  TT_TECH.forEach((tk, i) => { const btn = c.children[i], cd = Math.ceil(P.cds['tt_' + i] || 0), dis = cd > 0 || P.mp < Math.ceil(P.S.maxmp * tk.mp);
    if (btn.disabled !== dis) btn.disabled = dis; const s = cd ? ' ' + cd : ''; if (btn.lastChild.textContent !== s) btn.lastChild.textContent = s; });
});
