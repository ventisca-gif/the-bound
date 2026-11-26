// 6.26 · El mar del Mar de Dawn (ideas 1-3 que aprobó Sergio): combate naval, Reyes Marinos y tormentas.
//  · Cañones: al timón del Going Merry (o del galeón), ⚔ dispara al enemigo más cercano (420 px). Con Usopp a bordo
//    apunta adelantándose al movimiento y recarga antes. La bala tarda en llegar: si el blanco se aparta, falla.
//  · Enemigos: el barco de la Marina que ya te perseguía (6zzzy_v588_voluntad, MR.boat) ahora se puede hundir; barcos
//    piratas (tras el Baratie, restos de la flota de Don Krieg) y Reyes Marinos (dibujos marinos del juego, en grande,
//    asomando del agua). Te disparan o muerden con un aviso rojo en el agua: aparta el barco.
//  · Vida del Merry (P.merryHp, 100): a 0 no mueres, pero navega a media vela; Usopp repara fuera de combate y al
//    atracar o bajar a tierra queda como nuevo.
//  · Tormentas: Nami avisa hacia dónde girar; dentro llueve, caen rayos (avisados) y el viento arrastra el barco. Si
//    la esquivas entera, premio y viento a favor.
//  · Los Reyes Marinos sueltan Carne de Rey Marino: 4.º plato de Sanji, «Festín del Rey Marino».
SAVEKEYS.push('merryHp', 'nvStats');
it('nv_carne_rey', { n: L2('Carne de Rey Marino', 'Sea King meat'), t: 'mat', stack: true, price: 4000, icon: ['food', 4], rar: 4,
  d: L2('Un trozo enorme de Rey Marino. Sanji la convierte en el Festín del Rey Marino (cocina del Going Merry).', 'A huge cut of Sea King. Sanji turns it into the Sea King Feast (Going Merry galley).') });
const NV = { foes: [], shots: [], marks: [], cd: 0, nextKing: 0, nextPir: 0, storm: null, nextStorm: 0, lastFight: -99 };
const NV_HP = 100;
function nvOn() { const P = G.P, M = G.map, H = P && P.dawnHelm; return !!(M && M.dawn && H && !P.dead && !G.fading && (H.kind === 'galleon' || (H.kind === 'skiff' && P.dawnCrewJoined))); }
function nvCalm() { const M = G.map; return !!(M && (M.logueArc || (M.syrup && M.syrup.run) || (M.baratie && M.baratie.run) || (M.conomi && (M.conomi.run || M.conomi.scene)) || (M.orange && M.orange.run) || (M.shellsRescue && M.shellsRescue.run))) || (typeof CINE !== 'undefined' && CINE.on) || !!ACT.k; }
const nvTier = () => (typeof bntTier === 'function' ? bntTier() : 0);
const nvUsopp = () => !!(G.P && G.P.syrupUsopp);
function nvHp() { const P = G.P; if (!(P.merryHp >= 0)) P.merryHp = NV_HP; return P.merryHp; }
function nvDamage(n, why) {
  const P = G.P; P.merryHp = Math.max(0, nvHp() - n); NV.lastFight = G.t; G.shake = Math.max(G.shake, 5); sfx('hurt');
  floatText(P.x, P.y - 50, '-' + n + ' ⛵', '#ff8a6a', true);
  if (P.merryHp === 0 && !NV.broken) { NV.broken = 1; toast('⛵ ' + L2('¡El Merry está muy dañado! Navegas a media vela. Usopp lo arregla fuera de combate y al atracar queda como nuevo.', 'The Merry is badly damaged! You sail at half speed. Usopp patches it up out of combat and docking fully repairs it.'), 'warn', 7); }
}
// lista de blancos: el barco de la Marina (MR.boat) y los enemigos propios
function nvTargets() { const L = NV.foes.filter(f => !f.dead && f.ph !== 'under'); if (typeof MR !== 'undefined' && MR.boat) { const b = MR.boat; if (!(b.hp > 0)) b.hp = b.maxhp = 6 + Math.min(6, nvTier()); b.k = 'marina'; L.push(b); } return L; }
function nvFire() {
  const P = G.P; if (NV.cd > 0) return;
  const T = nvTargets().map(t => [t, Math.hypot(t.x - P.x, t.y - P.y)]).filter(([, d]) => d < 420).sort((a, b) => a[1] - b[1])[0];
  NV.cd = nvUsopp() ? 0.75 : 1.1;
  if (!T) { floatText(P.x, P.y - 50, L2('Nada a tiro', 'Nothing in range'), '#ffd0a0'); NV.cd = 0.3; return; }
  const [t, d] = T, fly = 0.35 + d / 700, lead = nvUsopp() ? 1 : 0.35;
  const vx = t.vx || 0, vy = t.vy || 0, tx = t.x + vx * fly * lead, ty = t.y + vy * fly * lead;
  NV.shots.push({ x0: P.x, y0: P.y - 14, tx, ty, t: 0, dur: fly, tgt: t, mine: 1 });
  sfx('hit'); G.shake = Math.max(G.shake, 2); burst(P.x, P.y - 16, 8, { sp: 60, up: 30, life: 0.4, c: ['#d0d0d0', '#ffffff', '#ffb040'] });
}
hookBefore('basicAttack', () => { if (!nvOn() || (typeof merryDeck === 'function' && merryDeck())) return; nvFire(); return HOOK_SKIP; });

// ---------- enemigos ----------
function nvFreeSpot(M, P, dmin, dmax) { for (let k = 0; k < 24; k++) { const a = Math.random() * 6.28, r = dmin + Math.random() * (dmax - dmin), x = P.x + Math.cos(a) * r, y = P.y + Math.sin(a) * r * 0.75; if (dawnSurface(M, x, y, 20)) return [x, y]; } return null; }
function nvSpawnPirate(M, P) { const at = nvFreeSpot(M, P, 520, 640); if (!at) return; const t = nvTier(), krieg = !!crewBkSafe('baratie_krieg');
  NV.foes.push({ k: 'pirata', x: at[0], y: at[1], hp: 8 + t, maxhp: 8 + t, cd: 3, dir: 1, vx: 0, vy: 0, ang: Math.random() * 6.28, n: krieg ? L2('Barco de la flota de Krieg', 'Krieg fleet ship') : L2('Barco pirata', 'Pirate ship') });
  toast('🏴‍☠️ ' + (krieg ? L2('¡Restos de la flota de Don Krieg a la vista! Pulsa el botón de la espada para disparar los cañones.', 'Remains of Don Krieg’s fleet in sight! Press the sword button to fire the cannons.') : L2('¡Barco pirata a la vista! Pulsa el botón de la espada para disparar los cañones.', 'Pirate ship in sight! Press the sword button to fire the cannons.')), 'warn', 6); }
const crewBkSafe = id => { try { return crewBk(G.P, id); } catch (e) { return 0; } };
const NV_KINGS = [['tiburon', 3.4, L2('Rey Marino Tiburón', 'Shark Sea King')], ['martillo', 3.2, L2('Rey Marino Martillo', 'Hammerhead Sea King')], ['kraken', 2.8, L2('Rey Marino Kraken', 'Kraken Sea King')]];
function nvSpawnKing(M, P) { const at = nvFreeSpot(M, P, 230, 300); if (!at) return; const [kind, sc, n] = NV_KINGS[(Math.random() * 3) | 0];
  NV.foes.push({ k: 'rey', kind, sc, n, x: at[0], y: at[1], hp: 14 + nvTier(), maxhp: 14 + nvTier(), ph: 'rise', t: 1.2, dives: 0, cd: 1.6, vx: 0, vy: 0 });
  G.shake = 8; sfx('boss'); toast('🌊 ' + n + L2(' sale del agua! Dispárale con el botón de la espada y aparta el barco cuando marque el agua.', ' rises from the water! Shoot it with the sword button and move the ship when the water is marked.'), 'warn', 6); }
function nvMark(x, y, r, t, dmg, col) { NV.marks.push({ x, y, r, t, t0: t, dmg, col: col || 'rgba(255,60,60,' }); }
function nvKill(f) {
  const P = G.P, t = nvTier(); P.nvStats = P.nvStats || {}; f.dead = 1; NV.lastFight = G.t;
  burst(f.x, f.y - 10, 24, { sp: 120, up: 60, life: 0.8, c: ['#ffb040', '#ff6a2a', '#d0d0d0', '#6aa8e0'] }); G.shake = 8; sfx('kill');
  let gold = 0, txt = '';
  if (f.k === 'marina') { gold = 3000 + t * 1500; MR.boat = null; MR.nextSea = G.t + mrEvery(); P.nvStats.marina = (P.nvStats.marina || 0) + 1; if (typeof bntGain === 'function') bntGain(800000 + t * 400000); txt = L2('¡Barco de la Marina hundido! Tu recompensa sube.', 'Navy ship sunk! Your bounty rises.'); }
  else if (f.k === 'pirata') { gold = 4000 + t * 1200; P.nvStats.pirata = (P.nvStats.pirata || 0) + 1; txt = L2('¡Barco pirata hundido!', 'Pirate ship sunk!'); }
  else { gold = 6000 + t * 1500; P.nvStats.rey = (P.nvStats.rey || 0) + 1; giveItem('nv_carne_rey', 1); txt = L2('¡Rey Marino derrotado! +1 Carne de Rey Marino para Sanji.', 'Sea King defeated! +1 Sea King meat for Sanji.'); }
  P.gold = (P.gold || 0) + gold; banner('⚓ ' + txt, '+' + fmt(gold) + ' ' + L2('oro', 'gold')); markDirty(true);
}

// ---------- tormentas ----------
function nvStartStorm(M, P) {
  const [hx, hy] = DIRV[P.dir] || DIRV.down, cx = P.x + hx * 520, cy = P.y + hy * 400;
  NV.storm = { x: cx, y: cy, r: 300, t: 70, hit: 0, warned: G.t, strike: 4, wx: (Math.random() - 0.5) * 60, wy: (Math.random() - 0.5) * 60 };
  const side = hx ? (hx > 0 ? L2('al norte o al sur', 'north or south') : L2('al norte o al sur', 'north or south')) : L2('al este o al oeste', 'east or west');
  toast('⛈ ' + L2('Nami: «¡Se acerca una tormenta! Gira ', 'Nami: “A storm is coming! Turn ') + side + L2(' y no entres en las nubes oscuras.»', ' and stay out of the dark clouds.”'), 'warn', 7);
}
const nvInStorm = () => { const S = NV.storm, P = G.P; return !!(S && Math.hypot(P.x - S.x, (P.y - S.y) / 0.75) < S.r); };

// ---------- tick ----------
V33_TICKS.push(dt => { try {
  dt = Math.min(0.05, dt || 0.016); const P = G.P, M = G.map;
  if (!P || !M || !M.dawn) { if (NV.foes.length || NV.storm) { NV.foes = []; NV.shots = []; NV.marks = []; NV.storm = null; } return; }
  if (!P.dawnHelm) { if (nvHp() < NV_HP) { P.merryHp = NV_HP; NV.broken = 0; } NV.foes = []; NV.marks = []; return; }   // en tierra: reparado
  if (!nvOn()) return;
  NV.cd -= dt; const calm = nvCalm() || (typeof merryDeck === 'function' && merryDeck());
  // aparecen enemigos y tormentas (no durante escenas, minijuegos ni paseando por cubierta)
  if (!calm) {
    if (!NV.nextKing) { NV.nextKing = G.t + 70 + Math.random() * 60; NV.nextPir = G.t + 50 + Math.random() * 60; NV.nextStorm = G.t + 120 + Math.random() * 120; }
    if (G.t > NV.nextKing) { NV.nextKing = G.t + 120 + Math.random() * 120; if (!NV.foes.some(f => f.k === 'rey' && !f.dead) && Math.random() < 0.55) nvSpawnKing(M, P); }
    if (G.t > NV.nextPir) { NV.nextPir = G.t + 110 + Math.random() * 100; if (NV.foes.filter(f => f.k === 'pirata' && !f.dead).length < 2 && Math.random() < 0.5) nvSpawnPirate(M, P); }
    if (G.t > NV.nextStorm && !NV.storm) { NV.nextStorm = G.t + 240 + Math.random() * 180; if (Math.random() < 0.45) nvStartStorm(M, P); }
  }
  // enemigos
  for (const f of NV.foes) {
    if (f.dead) continue; const dx = P.x - f.x, dy = P.y - f.y, d = Math.hypot(dx, dy) || 1;
    if (d > 1100) { f.dead = 1; f.gone = 1; continue; }
    f.cd -= dt;
    if (f.k === 'pirata') {   // se acerca hasta ~190 px y rodea el barco disparando
      f.ang += dt * 0.35; const gx = P.x - Math.cos(f.ang) * 290, gy = P.y - Math.sin(f.ang) * 200, mx = gx - f.x, my = gy - f.y, md = Math.hypot(mx, my) || 1, sp = 150;
      const ox = f.x, oy = f.y, st = Math.min(md, sp * dt), nx = f.x + mx / md * st, ny = f.y + my / md * st;
      if (dawnSurface(M, nx, ny, 14)) { f.x = nx; f.y = ny; } f.vx = (f.x - ox) / dt; f.vy = (f.y - oy) / dt; f.dir = dx < 0 ? -1 : 1;
      if (f.cd <= 0 && d < 420) { f.cd = 2.4; nvMark(P.x, P.y, 30, 1.1, 9 + nvTier()); }
    } else if (f.k === 'rey') {
      f.t -= dt;
      if (f.ph === 'rise' && f.t <= 0) { f.ph = 'up'; f.t = 8; }
      else if (f.ph === 'up') { if (f.cd <= 0) { f.cd = 1.7; nvMark(P.x + (Math.random() - 0.5) * 20, P.y, 34, 0.95, 12 + nvTier()); } if (f.t <= 0) { f.ph = 'dive'; f.t = 1; } }
      else if (f.ph === 'dive' && f.t <= 0) { f.dives++; if (f.dives >= 3) { f.dead = 1; f.gone = 1; toast('🌊 ' + f.n + L2(' se hunde en las profundidades.', ' sinks back into the depths.'), 'info', 4); continue; }
        f.ph = 'under'; f.t = 2.2; }
      else if (f.ph === 'under' && f.t <= 0) { const at = nvFreeSpot(M, P, 230, 300); if (at) { f.x = at[0]; f.y = at[1]; } f.ph = 'rise'; f.t = 1; G.shake = 6; }
    }
  }
  // el barco de la Marina también dispara mientras te persigue
  if (typeof MR !== 'undefined' && MR.boat) { const b = MR.boat, d = Math.hypot(P.x - b.x, P.y - b.y); b.cdN = (b.cdN || 2.5) - dt; if (b.cdN <= 0 && d < 420 && d > 60) { b.cdN = 2.8; nvMark(P.x, P.y, 30, 1.1, 8 + nvTier()); } }
  // balas propias
  for (const s of NV.shots) { s.t += dt; if (s.t >= s.dur && !s.done) { s.done = 1; const t = s.tgt, alive = t && !t.dead && (t.k !== 'marina' || MR.boat === t);
    if (alive && Math.hypot(t.x - s.tx, t.y - s.ty) < 38 && t.ph !== 'under') { t.hp--; NV.lastFight = G.t; floatText(t.x, t.y - 40, L2('¡Impacto!', 'Hit!'), '#ffd040'); burst(t.x, t.y - 10, 12, { sp: 90, up: 40, life: 0.5, c: ['#ffb040', '#ff6a2a', '#ffffff'] }); if (t.hp <= 0) nvKill(t); }
    else { floatText(s.tx, s.ty - 20, L2('Al agua', 'Splash'), '#a8d8ff'); burst(s.tx, s.ty, 10, { sp: 50, up: 70, life: 0.5, c: ['#a8d8ff', '#ffffff'] }); } } }
  NV.shots = NV.shots.filter(s => !s.done);
  // avisos rojos en el agua: al acabar, si el barco sigue dentro, daño
  for (const m of NV.marks) { m.t -= dt; if (m.t <= 0 && !m.done) { m.done = 1; burst(m.x, m.y, 14, { sp: 80, up: 60, life: 0.5, c: ['#a8d8ff', '#ffffff', '#ff8a6a'] }); if (Math.hypot(P.x - m.x, (P.y - m.y) / 0.75) < m.r) nvDamage(m.dmg); else floatText(P.x, P.y - 50, L2('¡Esquivado!', 'Dodged!'), '#8aff8a'); } }
  NV.marks = NV.marks.filter(m => !m.done);
  NV.foes = NV.foes.filter(f => !f.dead || false);
  // tormenta: rayos avisados y viento que arrastra
  const S = NV.storm;
  if (S) { S.t -= dt; S.x += S.wx * dt; S.y += S.wy * dt;
    if (nvInStorm()) { S.hit = 1; S.strike -= dt; const nx = P.x + S.wx * 0.9 * dt + Math.sin(G.t * 0.7) * 22 * dt, ny = P.y + S.wy * 0.9 * dt;
      if (dawnSurface(M, nx, ny, 20)) { P.x = nx; P.y = ny; }
      if (S.strike <= 0) { S.strike = 2.2 + Math.random(); nvMark(P.x + (Math.random() - 0.5) * 30, P.y + (Math.random() - 0.5) * 20, 30, 0.9, 10, 'rgba(255,240,120,'); } }
    if (S.t <= 0) { NV.storm = null; if (!S.hit) { const g = 2500 + nvTier() * 800; P.gold = (P.gold || 0) + g; addBuff(P, 'nv_viento', { spdP: 10 }, 180);
        banner('⛵ ' + L2('Nami: «¡Bien esquivada!»', 'Nami: “Nicely dodged!”'), '+' + fmt(g) + ' ' + L2('oro · viento a favor 3 min', 'gold · tailwind 3 min')); }
      else toast('⛈ ' + L2('La tormenta se aleja.', 'The storm moves away.'), 'info', 4); } }
  // reparación de Usopp fuera de combate
  if (G.t - NV.lastFight > 8 && nvHp() < NV_HP && nvUsopp()) { NV.rep = (NV.rep || 0) + dt; if (NV.rep > 2) { NV.rep = 0; P.merryHp = Math.min(NV_HP, P.merryHp + 2); if (P.merryHp >= 30) NV.broken = 0; } }
  // marcador
  const foes = nvTargets(), fight = foes.length > 0 || NV.marks.length > 0 || nvInStorm();
  if (!ACT.k) { if (fight || nvHp() < NV_HP) { const hp = nvHp(), bar = '▮'.repeat(Math.ceil(hp / 10)) + '▯'.repeat(10 - Math.ceil(hp / 10));
      const tgt = foes.map(t => [t, Math.hypot(t.x - P.x, t.y - P.y)]).sort((a, b) => a[1] - b[1])[0];
      mgHud('⛵ ' + bar + ' ' + hp + (tgt ? ' · ' + (tgt[0].n || L2('Marina', 'Navy')) + ' ' + Math.max(0, tgt[0].hp) + '/' + tgt[0].maxhp + (tgt[1] < 420 ? ' · 💣 ' + (NV.cd > 0 ? '…' : L2('¡fuego!', 'fire!')) : ' · ' + L2('acércate', 'get closer')) : '') + (nvInStorm() ? ' · ⛈' : '')); NV.hud = 1; }
    else if (NV.hud) { NV.hud = 0; mgHud(null); } }
} catch (e) { if (typeof errOnce === 'function') errOnce('nvTick', e); } });
// con el barco roto, a media vela
hookAround('updatePlayer', (next, dt) => { const P = G.P; if (!nvOn() || nvHp() > 0 || (typeof merryDeck === 'function' && merryDeck())) return next(dt); const x0 = P.x, y0 = P.y, r = next(dt); P.x = x0 + (P.x - x0) * 0.5; P.y = y0 + (P.y - y0) * 0.5; return r; });

// ---------- dibujo ----------
XSPR.nv_pirata = () => { const p = new Pix(64, 58), W = TGP.madera; p.poly([[4, 40], [60, 40], [54, 54], [10, 54]], W[2]); p.hl(6, 44, 52, W[3]); p.hl(8, 48, 48, W[1]); p.rect(31, 6, 2, 36, W[1]);
  p.poly([[12, 10], [52, 10], [50, 36], [14, 36]], C('#2a2a30')); p.line(14, 10, 15, 36, C('#1a1a1e'));
  p.ball(32, 21, 5, 5, pal(['#9a968c', '#c4c0b4', '#e4e0d4', '#ffffff'])); p.set(30, 21, C('#1a1a1e')); p.set(34, 21, C('#1a1a1e')); p.line(25, 28, 39, 32, C('#e4e0d4')); p.line(25, 32, 39, 28, C('#e4e0d4'));
  p.poly([[33, 2], [44, 4], [33, 7]], C('#c0302c')); for (const x of [14, 24, 40, 50]) p.rect(x, 46, 3, 2, C('#1a1a1e')); p.outline(OUTL); return { c: p.canvas(), ax: 32, ay: 50 }; };
function nvKingAtlas(f) { try { return mobAtlasFor(['sea', f.kind, f.sc]); } catch (e) { return null; } }
DL_HOOKS.push((list, cx, cy) => {
  const M = G.map; if (!M || !M.dawn) return;
  for (const f of NV.foes) { if (f.dead) continue;
    if (f.k === 'pirata') list.push({ type: 'xdraw', x: f.x, y: f.y + 10, draw: (e, cx2, cy2) => { const s = spr('nv:pirata', XSPR.nv_pirata); ctx.save(); ctx.translate(Math.round(f.x - cx2), Math.round(f.y - cy2 + 10)); ctx.scale(f.dir < 0 ? -2.2 : 2.2, 2.2); ctx.imageSmoothingEnabled = false; ctx.drawImage(s.c, -s.ax, -s.ay); ctx.restore(); nvBar(f, cx2, cy2, 120); } });
    else if (f.ph !== 'under') list.push({ type: 'xdraw', x: f.x, y: f.y + 6, draw: (e, cx2, cy2) => { const A = nvKingAtlas(f); if (!A) return;
      const k = f.ph === 'rise' ? 1 - Math.max(0, f.t) / 1.2 : f.ph === 'dive' ? Math.max(0, f.t) : 1, fw = A.fw, fh = A.fh, sx = Math.round(f.x - cx2), sy = Math.round(f.y - cy2);
      const shown = Math.round(fh * (0.25 + 0.55 * k)); const col = (A.idx && (A.idx.idle != null) ? A.idx.idle : 0) + (Math.floor(G.t * 3) % 2);
      ctx.save(); ctx.beginPath(); ctx.rect(sx - fw, sy - shown, fw * 2, shown); ctx.clip(); ctx.drawImage(A.img, col * fw, 0, fw, fh, sx - fw / 2, sy - fh + (fh - shown) * 0.15, fw, fh); ctx.restore();
      ctx.strokeStyle = 'rgba(220,240,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy, fw * 0.4, 6, 0, 0, 7); ctx.stroke();
      if (Math.random() < 0.3) part(f.x + (Math.random() - 0.5) * fw * 0.6, f.y, { vz: 40, vx: (Math.random() - 0.5) * 40, g: 120, life: 0.5, c: '#dff4ff', s: 2 });
      nvBar(f, cx2, cy2, shown + 6); } });
  }
});
function nvBar(f, cx, cy, h) { const x = Math.round(f.x - cx) - 20, y = Math.round(f.y - cy) - h; ctx.fillStyle = '#1a1220'; ctx.fillRect(x - 1, y - 1, 42, 5); ctx.fillStyle = '#c0302c'; ctx.fillRect(x, y, 40 * Math.max(0, f.hp) / f.maxhp, 3); }
WORLD_DRAW.push((cx, cy) => {
  const M = G.map; if (!M || !M.dawn) return;
  for (const m of NV.marks) { const k = 1 - m.t / m.t0, x = m.x - cx, y = m.y - cy; ctx.strokeStyle = m.col + '0.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, m.r, m.r * 0.75, 0, 0, 7); ctx.stroke(); ctx.fillStyle = m.col + (0.12 + k * 0.35) + ')'; ctx.beginPath(); ctx.ellipse(x, y, m.r * k, m.r * 0.75 * k, 0, 0, 7); ctx.fill(); }
  for (const s of NV.shots) { const k = Math.min(1, s.t / s.dur), x = s.x0 + (s.tx - s.x0) * k - cx, y = s.y0 + (s.ty - s.y0) * k - cy - Math.sin(k * Math.PI) * 40; ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(s.x0 + (s.tx - s.x0) * k - cx, s.y0 + (s.ty - s.y0) * k - cy + 14, 4, 2, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1a1e'; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill(); ctx.fillStyle = '#8a8a90'; ctx.fillRect(x - 2, y - 2, 1, 1); }
  const S = NV.storm; if (S) {   // nubes de la tormenta en el mar y, si estás dentro, lluvia y oscuridad
    const x = S.x - cx, y = S.y - cy; ctx.fillStyle = 'rgba(20,24,40,.35)'; for (let k = 0; k < 9; k++) { const a = k * 0.7 + G.t * 0.1; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * S.r * 0.55, y + Math.sin(a) * S.r * 0.4, S.r * 0.45, S.r * 0.3, 0, 0, 7); ctx.fill(); }
    if (nvInStorm()) { ctx.fillStyle = 'rgba(10,14,30,.35)'; ctx.fillRect(0, 0, VW, VH); ctx.strokeStyle = 'rgba(180,200,240,.55)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k < 70; k++) { const rx = (k * 53 + G.t * 520) % (VW + 40) - 20, ry = (k * 97 + G.t * 900) % (VH + 40) - 20; ctx.moveTo(rx, ry); ctx.lineTo(rx - 6, ry + 14); } ctx.stroke();
      if (Math.random() < 0.01) { ctx.fillStyle = 'rgba(255,255,230,.5)'; ctx.fillRect(0, 0, VW, VH); } }
  }
});

// ---------- Festín del Rey Marino (cocina de Sanji) ----------
if (typeof MB_DISH !== 'undefined') MB_DISH.festin = { n: L2('Festín del Rey Marino', 'Sea King Feast'), st: q => ({ atkP: 3 + q * 2, defP: 3 + q * 2, spdP: 2 + q }), ing: ['rey', 'especia', 'arroz'], d: L2('todo', 'everything'), need: 'nv_carne_rey' };
if (typeof MB_ING_N !== 'undefined') MB_ING_N.rey = L2('carne de Rey Marino', 'Sea King meat');
hookBefore('mbCookStart', k => { const D = MB_DISH[k]; if (!D || !D.need) return; const P = G.P, s = (P.inv || []).find(x => x && x.id === D.need);
  if (!s) { toast(L2('Necesitas Carne de Rey Marino: derrota a un Rey Marino en el mar.', 'You need Sea King meat: defeat a Sea King at sea.'), 'info', 5); return HOOK_SKIP; }
  if (ACT.k || !(G.map && G.map.merryBajo)) return; takeItem(D.need, 1); });

// ---------- Lupa › 🏴‍☠️ Crossovers ----------
if (typeof LUPA_DAWN !== 'undefined') LUPA_DAWN.push(['mar626', () => '🌊 ' + L2('Batallas en el mar', 'Sea battles'), () => {
  const P = G.P, s = (P && P.nvStats) || {};
  return [
    L2('Al timón del Going Merry (o del galeón), el botón de la espada dispara los cañones al enemigo más cercano (hasta ~26 casillas). La bala tarda: si el blanco se mueve, falla. Con Usopp a bordo se apunta con ventaja y se recarga antes.', 'At the helm of the Going Merry (or the galleon), the sword button fires the cannons at the nearest enemy (up to ~26 tiles). The ball takes time: if the target moves, it misses. With Usopp aboard you lead the target and reload faster.'),
    L2('Enemigos: el barco de la Marina que te persigue según tu recompensa (ahora se puede hundir: +oro y tu recompensa sube), barcos piratas (tras el Baratie, restos de la flota de Don Krieg) y Reyes Marinos (Tiburón, Martillo y Kraken) que asoman del agua, se sumergen y vuelven.', 'Enemies: the Navy ship that chases you depending on your bounty (now it can be sunk: +gold and your bounty rises), pirate ships (after the Baratie, remains of Don Krieg’s fleet) and Sea Kings (Shark, Hammerhead and Kraken) that rise, dive and come back.'),
    L2('Sus ataques marcan el agua en rojo: aparta el barco antes de que caigan. Vida del Merry: 100. A 0 navegas a media vela; Usopp repara fuera de combate y al atracar queda como nuevo.', 'Their attacks mark the water in red: move the ship before they land. Merry HP: 100. At 0 you sail at half speed; Usopp repairs out of combat and docking fully repairs it.'),
    L2('Tormentas: Nami avisa hacia dónde girar. Dentro llueve, el viento te arrastra y caen rayos (marcados en amarillo). Si la esquivas entera: oro y viento a favor 3 min.', 'Storms: Nami tells you which way to turn. Inside it rains, the wind drags you and lightning strikes (marked in yellow). Dodge it entirely: gold and a tailwind for 3 min.'),
    L2('Los Reyes Marinos sueltan Carne de Rey Marino: Sanji la cocina en el Festín del Rey Marino (ataque, defensa y velocidad).', 'Sea Kings drop Sea King meat: Sanji cooks it into the Sea King Feast (attack, defense and speed).'),
    L2('Hundidos: ', 'Sunk: ') + L2('Marina ', 'Navy ') + (s.marina || 0) + ' · ' + L2('piratas ', 'pirates ') + (s.pirata || 0) + ' · ' + L2('Reyes Marinos ', 'Sea Kings ') + (s.rey || 0)
  ]; }, () => null]);

// ---------- cámara: en combate se desplaza hacia el enemigo más cercano (el Merry ocupa casi toda la pantalla) ----------
NV.cam = { x: 0, y: 0 };
hookAround('updateCamera', (next, dt, snap) => {
  const P = G.P, o = NV.cam; G.cam.x -= o.x; G.cam.y -= o.y;
  const r = next(dt, snap);
  let tx = 0, ty = 0;
  if (nvOn() && !(typeof merryDeck === 'function' && merryDeck())) { const t = nvTargets().map(t => [t, Math.hypot(t.x - P.x, t.y - P.y)]).filter(([, d]) => d < 700).sort((a, b) => a[1] - b[1])[0];
    if (t) { tx = clamp((t[0].x - P.x) * 0.6, -210, 210); ty = clamp((t[0].y - P.y) * 0.6, -110, 110); } }
  const k = snap ? 1 : 1 - Math.pow(0.02, dt || 0.016); o.x += (tx - o.x) * k; o.y += (ty - o.y) * k;
  G.cam.x += o.x; G.cam.y += o.y; return r;
});
// flechas en el borde de la pantalla hacia los enemigos que no se ven
WORLD_DRAW.push((cx, cy) => {
  if (!nvOn()) return;
  for (const t of nvTargets()) { const x = t.x - cx, y = t.y - cy; if (x > 10 && x < VW - 10 && y > 10 && y < VH - 10) continue;
    const ax = clamp(x, 14, VW - 14), ay = clamp(y, 40, VH - 40), a = Math.atan2(y - ay, x - ax);
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(a); ctx.fillStyle = t.k === 'rey' ? '#6ad0ff' : '#ff5a4a'; ctx.strokeStyle = '#1a1220'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-6, -6); ctx.lineTo(-3, 0); ctx.lineTo(-6, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
});
