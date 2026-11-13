// ================= WEAPON PASSIVES (per class, scale with weapon tier) & LEGENDARY WEAPONS =================
const WPASS = {
  guerrero: { n: 'Furia de Acero', d: t => `Cada ${t >= 16 ? 3 : 4}.º golpe básico lanza una onda de choque (${70 + t * 7}% de ataque en área). Robo de vida +${1 + Math.floor(t / 4)}%.` },
  mago: { n: 'Resonancia Arcana', d: t => `Tus orbes explotan en área. Las habilidades hacen +${Math.round(t * 0.6)}% de daño.` },
  arquero: { n: 'Ojo Certero', d: t => `${20 + t * 2}% de probabilidad de disparar una segunda flecha. Daño crítico +${t * 4}%.` },
  asesino: { n: 'Golpe Fantasma', d: t => `${6 + Math.round(t * 0.6)}% de probabilidad de asestar un segundo golpe sombrío.` },
};
const LEG = {
  dawn: { cls: 'guerrero', n: 'Filo del Amanecer', col: '#ffd86a', col2: '#fff4c0', d: 'Tajos de luz dorada; la onda de choque sale cada 3 golpes y ciega a los enemigos.' },
  eclipse: { cls: 'mago', n: 'Báculo del Eclipse', col: '#b070ff', col2: '#ffd0ff', d: 'Orbes del vacío que encadenan rayos a 2 enemigos cercanos (45% de daño).' },
  storm: { cls: 'arquero', n: 'Arco de la Tempestad', col: '#7ad8ff', col2: '#ffffff', d: 'Flechas eléctricas; cada 4.ª flecha invoca un rayo en área (180% de daño).' },
  void: { cls: 'asesino', n: 'Colmillos del Vacío', col: '#d04aff', col2: '#ffb0ff', d: 'Un clon de sombra ataca contigo: 18% de probabilidad de un tajo extra del 120%.' },
};
for (const k in LEG) {
  const L = LEG[k], b = ITEMS['w_' + L.cls + '_15'];
  it('lw_' + L.cls, { n: L.n, t: 'weapon', slot: 'weapon', cls: L.cls, lv: 148, tier: 15, leg: k, atk: Math.round(b.atk * 1.22), crit: (b.crit || 0) + 5, mpB: Math.round((b.mpB || 0) * 1.2), rar: 5, price: 30000, icon: b.icon, stack: false });
  RECIPES.push({ id: 'r_lw_' + L.cls, job: 'herreria', out: 'lw_' + L.cls, n: 1, lv: 148, jlv: 70, gold: 60000, mats: [['w_' + L.cls + '_15', 1], ['esenciaeclipse', 10], ['opalo', 4], ['piedra3', 6]], cat: 'arma', cls: L.cls });
  BOSSES.eclipsor.drops.push(['lw_' + L.cls, 0.03, 1]);
}
function wInfo(P) { const w = P.equip && P.equip.weapon && ITEMS[P.equip.weapon.id]; return w ? { t: w.leg ? 16 : (w.tier || 1), leg: w.leg ? LEG[w.leg] : null, lk: w.leg } : { t: 0 }; }
// stat part (called from calcStats)
function weaponStats(P, S) { const W = wInfo(P); if (!W.t) return; const t = W.t;
  if (P.cls === 'guerrero') S.life += 1 + Math.floor(t / 4);
  if (P.cls === 'arquero') S.critD += t * 4;
  if (P.cls === 'mago') S.skillP = Math.round(t * 0.6); }
// basic attack hook
function weaponOnBasic(ang, tgt) {
  const P = G.P, W = wInfo(P); if (!W.t) return; const t = W.t, atk = P.S.atk, L = W.leg;
  P.wHits = (P.wHits || 0) + 1;
  if (P.cls === 'guerrero' && P.wHits % (L ? 3 : 4) === 0) delayAct(0.16, () => { const x = P.x + Math.cos(ang) * 22, y = P.y + Math.sin(ang) * 16; hitCircle(x, y, 34, atk * (0.7 + t * 0.07), { stun: L ? 0.5 : 0, kb: 30 }); addFx({ type: 'ring', x, y, r: 34, dur: 0.35, col: L ? L.col : '#ffd890' }); burst(x, y - 4, 14, { sp: 80, up: 30, g: 120, life: 0.45, c: L ? [L.col, L.col2, '#ffffff'] : ['#c8b090', '#ffffff'] }); sfx('boom'); });
  if (P.cls === 'arquero' && Math.random() * 100 < 20 + t * 2) delayAct(0.22, () => { const tg = P.target && !P.target.dying ? P.target : null, a2 = tg ? Math.atan2(tg.y - P.y, tg.x - P.x) : ang; spawnProj('p', P.x, P.y - 8, a2 + 0.05, { spd: 320, dmg: atk, art: L ? 'storm' : 'arrow', life: 0.75, leg: W.lk }); });
  if (P.cls === 'asesino') { const ch = L ? 18 : 6 + Math.round(t * 0.6); if (Math.random() * 100 < ch) delayAct(0.2, () => { const n = hitArc(P.x, P.y, ang, CLASSES.asesino.range + 4, 1.6, atk * (L ? 1.2 : 1), {}); addFx({ type: 'slash', x: P.x, y: P.y, ang: ang + 0.6, arc: 1.8, r: 24, dur: 0.2, col: L ? 'rgba(208,74,255,0.95)' : 'rgba(150,60,200,0.85)' }); if (L) ghostFx(P); if (n) sfx('slash'); }); }
}
function ghostFx(P) { const dv = DIRV[P.dir]; burst(P.x - dv[0] * 10, P.y - 12, 10, { sp: 30, up: 30, g: -20, life: 0.5, c: ['#d04aff', '#5a1a7a', '#ffb0ff'] }); addFx({ type: 'ring', x: P.x - dv[0] * 10, y: P.y, r: 12, dur: 0.3, col: '#d04aff' }); }
// projectile option hook for basic attacks
function weaponProjOpts(o) {
  const P = G.P, W = wInfo(P); if (!W.t) return o;
  if (P.cls === 'mago') { o.ex = 20 + Math.min(10, W.t); if (W.leg) { o.art = 'eclipse'; o.leg = 'eclipse'; } }
  if (P.cls === 'arquero' && W.leg) { o.art = 'storm'; o.leg = 'storm'; }
  return o;
}
// on-hit legendary effects (from hitMob with a projectile / basic source)
function weaponOnHit(m, d, src) {
  const P = G.P; if (!src || !src.leg || src.chain) return;
  if (src.leg === 'eclipse') { const near = G.ents.filter(e => e.type === 'mob' && !e.dying && e !== m && e.map === m.map && dist2(e.x, e.y, m.x, m.y) < 90 * 90).sort((a, b) => dist2(a.x, a.y, m.x, m.y) - dist2(b.x, b.y, m.x, m.y)).slice(0, 2);
    for (const e of near) { addFx({ type: 'bolt', x: m.x, y: m.y - 10, x2: e.x, y2: e.y - 10, dur: 0.22, col: '#c080ff' }); hitMob(e, P.S.atk * 0.45, { chain: 1 }); } }
  if (src.leg === 'storm') { P.wStorm = (P.wStorm || 0) + 1; if (P.wStorm % 4 === 0) { addFx({ type: 'bolt', x: m.x + 6, y: m.y - 140, x2: m.x, y2: m.y - 6, dur: 0.25, col: '#bfefff' }); addFx({ type: 'ring', x: m.x, y: m.y, r: 30, dur: 0.35, col: '#7ad8ff' }); hitCircle(m.x, m.y, 30, P.S.atk * 1.8, { chain: 1, stun: 0.3 }); G.shake = Math.max(G.shake, 3); sfx('boom'); } }
}
// aura & sparkles for legendary weapons
let wAuraT = 0;
function weaponTick(dt) { const P = G.P, W = wInfo(P); if (!W.leg || P.dead) return; wAuraT += dt; if (wAuraT > 0.18) { wAuraT = 0; const dv = DIRV[P.dir]; burst(P.x + dv[0] * 8 + (Math.random() - 0.5) * 10, P.y - 12 - Math.random() * 10, 1, { sp: 10, up: 25, g: -30, life: 0.7, c: [W.leg.col, W.leg.col2] }); } }
function drawWeaponAura(e, cx, cy) { if (e !== G.P) return; const W = wInfo(e); if (!W.leg) return; const pulse = 0.35 + Math.sin(G.t * 4) * 0.12; ctx.globalAlpha = pulse; const g = glowSprite(18, W.leg.col); ctx.drawImage(g, Math.round(e.x - cx - 18), Math.round(e.y - cy - 30)); ctx.globalAlpha = 1; }
function weaponDescHTML(it) {
  if (it.slot !== 'weapon' || !it.cls || !WPASS[it.cls]) return '';
  const t = it.leg ? 16 : it.tier || 1;
  return `<p class="wpas"><b>Pasiva · ${esc(WPASS[it.cls].n)}:</b> ${esc(WPASS[it.cls].d(t))}${it.leg ? `<br><b class="lgd">Legendaria:</b> ${esc(LEG[it.leg].d)}` : ''}</p>`;
}
