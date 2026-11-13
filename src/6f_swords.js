// ================= NAMED SWORDS (unique blade shapes & VFX) + EXTRA SKILL FOR THE ORIGINAL CLASSES =================
// Blade profile: len, w (base width), tw (tip width), curve, serr (serration), fork, glow, guard, pal (blade), gp (guard), hilt
const WS = {
  carmesi: { n: 'Hoja Carmesí', lv: 22, len: 15, w: 2, tw: 1, curve: 0.05, pal: ['#2a0608', '#5a0e14', '#8a1a22', '#c02a34', '#ff6a6a'], gp: ['#3a1a0e', '#6a3a1e', '#8a5a2e', '#a87a46', '#c89a66'], guard: 'small', fx: 'bleed', d: 'Los golpes desangran al enemigo.' },
  solar: { n: 'Espada Solar', lv: 30, len: 16, w: 1, tw: 1, pal: ['#4a4a5a', '#9a9aaa', '#d8d8e8', '#f0f0ff', '#ffffff'], gp: ['#6a4a0a', '#a8780e', '#e0a820', '#ffd040', '#fff4a0'], guard: 'sun', fx: 'light', d: 'Un destello de luz acompaña cada golpe.' },
  lava: { n: 'Espada de Lava', lv: 48, len: 16, w: 2, tw: 1, pal: ['#3a1206', '#7a2a0a', '#b8480e', '#e87a1e', '#ffd040'], gp: ['#6a4a0a', '#a8780e', '#e0a820', '#ffd040', '#fff4a0'], guard: 'cross', nodes: '#ff4a10', fx: 'burn', d: 'Quema a los enemigos.' },
  alanoche: { n: 'Ala Nocturna', lv: 58, len: 16, w: 1, tw: 1, pal: ['#0a0a0e', '#1a1a22', '#3a3a46', '#d8d8e0', '#ffffff'], gp: ['#0a0a0e', '#2a2a32', '#4a4a56', '#e8e8f0', '#ffffff'], guard: 'wings', fx: 'speed', d: 'Golpes rápidos como el viento nocturno.' },
  escarcha: { n: 'Hoja de Escarcha', lv: 66, len: 16, w: 2, tw: 1, pal: ['#2a5a7a', '#5ab0e0', '#9ad8ff', '#d8f4ff', '#ffffff'], gp: ['#4a5a6a', '#8a9aaa', '#c8d0e0', '#e8f0ff', '#ffffff'], guard: 'ring', glow: '#9ad8ff', fx: 'slow', d: 'Ralentiza a los enemigos con hielo.' },
  dragon: { n: 'Garra del Dragón', lv: 74, len: 15, w: 3, tw: 1, curve: 0.07, serr: 1, pal: ['#3a060a', '#7a1018', '#b81a26', '#e84a4a', '#ff9a8a'], gp: ['#5a0a14', '#8a1420', '#c02030', '#ff5a6a', '#ffb0b0'], guard: 'heart', fx: 'bleed', d: 'Desgarra y desangra.' },
  jade: { n: 'Espada Rúnica de Jade', lv: 82, len: 17, w: 2, tw: 2, pal: ['#1a4a3a', '#3a8a6a', '#7ad0a8', '#c8f8e0', '#ffffff'], gp: ['#0a4a4a', '#1a7a7a', '#2ab0a8', '#7ae8d8', '#d0fff8'], guard: 'ring', runes: '#2a8a6a', glow: '#7ae8c8', fx: 'heal', d: 'Las runas de jade te curan al golpear.' },
  verdugo: { n: 'Cuchilla del Verdugo', lv: 90, len: 16, w: 4, tw: 3, pal: ['#2a2a2e', '#5a5a62', '#8a8a92', '#b8b8c0', '#e0e0e8'], gp: ['#1a1a1e', '#3a3a40', '#5a5a62', '#7a7a82', '#9a9aa2'], guard: 'none', fx: 'crush', d: 'Golpes pesados que aturden.' },
  ignea: { n: 'Filo Ígneo', lv: 100, len: 16, w: 3, tw: 1, pal: ['#6a1a06', '#c8400a', '#ff7a1a', '#ffb040', '#fff0a0'], gp: ['#5a2a0a', '#8a4a1a', '#c86a2a', '#ff9a4a', '#ffd0a0'], guard: 'flame', glow: '#ff8a2a', fx: 'burn', d: 'Una llama que nunca se apaga.' },
  aguijon: { n: 'Aguijón Sangriento', lv: 108, len: 17, w: 1, tw: 1, pal: ['#2a0206', '#6a0a12', '#a8141e', '#e02a36', '#ff7a7a'], gp: ['#5a0a14', '#8a1420', '#c02030', '#ff5a6a', '#ffb0b0'], guard: 'trident', fx: 'life', d: 'Roba vida con cada golpe.' },
  dentado: { n: 'Mandoble Dentado', lv: 116, len: 19, w: 2, tw: 1, serr: 1, pal: ['#3a3a42', '#6a6a76', '#9a9aa8', '#c8c8d4', '#f0f0f8'], gp: ['#5a2a0a', '#8a4a1a', '#c86a2a', '#e88a4a', '#ffb07a'], guard: 'cross', fx: 'bleed', d: 'Sus dientes de acero desgarran armaduras.' },
  fantasma: { n: 'Llama Fantasma', lv: 124, len: 18, w: 1, tw: 1, pal: ['#4a4a52', '#9a9aa8', '#d8d8e4', '#f0f0f8', '#ffffff'], gp: ['#5a0a14', '#8a1420', '#c02030', '#ff5a6a', '#ffb0b0'], guard: 'katana', glow: '#ff7aa0', wisp: '#ff7aa0', fx: 'burn', d: 'Una katana envuelta en fuego espectral rosado.' },
  cosmica: { n: 'Hoja Cósmica', lv: 132, len: 17, w: 3, tw: 1, curve: 0.03, pal: ['#1a0a3a', '#3a1a6a', '#6a2aa8', '#c04ae0', '#ffd0ff'], gp: ['#2a1a3a', '#4a2a6a', '#6a3a9a', '#9a6ac8', '#d0a8f0'], guard: 'small', stars: 1, glow: '#c070ff', fx: 'star', d: 'Contiene una galaxia; a veces caen estrellas.' },
  // three special blades with signature effects
  abismo: { n: 'Colmillo del Abismo', lv: 138, len: 19, w: 3, tw: 2, fork: 1, pal: ['#0a0e16', '#18202e', '#2a3446', '#8ab0c8', '#e0f4ff'], gp: ['#0a0e16', '#18202e', '#2a3446', '#8ab0c8', '#e0f4ff'], guard: 'horns', runes: '#9ad8f0', glow: '#7ab0e0', vfx: 'abyss', d: 'Doble filo abisal: estelas de sombra y un 15% de probabilidad de una explosión del vacío (160%).' },
  rosa: { n: 'Rosa de Cristal', lv: 144, len: 18, w: 3, tw: 2, pal: ['#8a7a88', '#c8b8c8', '#efe4ec', '#fff8fc', '#ffffff'], gp: ['#5a0a3a', '#9a1a5a', '#e04a8a', '#ff8ac0', '#ffd0e8'], guard: 'ring', gems: '#ff4a9a', glow: '#ff8ac0', vfx: 'rose', d: 'Cristal y pétalos: cada golpe esparce pétalos que curan un 2% y un 20% de probabilidad de una lluvia de cristales (120% en área).' },
  runa: { n: 'Juramento Rúnico', lv: 150, len: 19, w: 3, tw: 1, pal: ['#4a4a5a', '#8a8a9a', '#c8c8d8', '#ececf4', '#ffffff'], gp: ['#2a1a3a', '#4a2a5a', '#6a4a7a', '#c0a0e0', '#f0e0ff'], guard: 'horns', runes: '#a060ff', glow: '#b080ff', vfx: 'rune', d: 'Las runas brillan: un círculo rúnico protege (+10% defensa) y un 20% de probabilidad de un rayo arcano (180%).' },
};
const WS_SRC = { carmesi: ['drop', 'slime_gema_rey'], solar: ['forge', 20], lava: ['forge', 30], alanoche: ['forge', 35], escarcha: ['drop', 'capataz'], dragon: ['drop', 'ignaroth'], jade: ['forge', 50], verdugo: ['drop', 'golem_lava'], ignea: ['forge', 60], aguijon: ['drop', 'sahrak'], dentado: ['forge', 65], fantasma: ['drop', 'coloso'], cosmica: ['forge', 70], abismo: ['drop', 'escorp_rey'], rosa: ['forge', 72], runa: ['drop', 'eclipsor'] };
const WS_LATE = [];
for (const k in WS) {
  const S = WS[k], base = Object.values(ITEMS).filter(i => i.slot === 'weapon' && i.cls === 'guerrero' && i.lv <= S.lv && !i.ws && !i.leg).sort((a, b) => b.lv - a.lv)[0];
  const special = !!S.vfx, atk = Math.round(base.atk * (special ? 1.08 : 1.03) + S.lv * 0.4);
  it('ws_' + k, { n: S.n, t: 'weapon', slot: 'weapon', cls: 'guerrero', lv: S.lv, tier: base.tier, ws: k, atk, crit: S.fx === 'speed' ? 6 : 2, rar: special ? 5 : S.lv >= 100 ? 4 : 3, price: Math.round(base.price * 2.2), icon: ['wsword', k] });
  const src = WS_SRC[k];
  if (src[0] === 'forge') RECIPES.push({ id: 'r_ws_' + k, job: 'herreria', out: 'ws_' + k, n: 1, lv: S.lv, jlv: src[1], gold: Math.round(base.price * 1.5), mats: [[base.id, 1], ['piedra' + (S.lv >= 120 ? 3 : S.lv >= 70 ? 2 : 1), special ? 6 : 3], [S.lv >= 100 ? 'opalo' : S.lv >= 60 ? 'diamante' : 'rubi', 2]].filter(m => ITEMS[m[0]]), cat: 'arma', cls: 'guerrero' });
  else if (BOSSES[src[1]]) BOSSES[src[1]].drops.push(['ws_' + k, 0.12, 1]); else WS_LATE.push([src[1], 'ws_' + k]);
}
// ---------- drawing ----------
function drawStyledBlade(p, pt, S, scale) {
  const pal_ = pal(S.pal), gp = pal(S.gp), L = Math.round(S.len * (scale || 1)), set = (d, o, c) => { const [x, y] = pt(d, o + (S.curve ? S.curve * d * d / (scale || 1) : 0)); p.set(Math.round(x), Math.round(y), c); };
  for (let d = 2; d <= L; d++) { const f = (d - 2) / Math.max(1, L - 2), w = Math.max(1, Math.round(S.w + (S.tw - S.w) * f)), off = (w - 1) / 2;
    for (let o = 0; o < w; o++) set(d, o - off, o === 0 ? pal_[4] : o === w - 1 ? pal_[1] : pal_[3]);
    if (S.serr && d % 3 === 0 && d < L - 1) set(d, -off - 1, pal_[2]);
    if (S.fork && d > L - 4) { set(d, -off - 1, pal_[3]); set(d, off + 1, pal_[3]); }
    if (S.runes && d % 3 === 1 && d < L - 2 && w >= 2) set(d, 0, C(S.runes));
    if (S.nodes && d % 4 === 2) set(d, 0, C(S.nodes));
    if (S.gems && d % 5 === 3) set(d, 0, C(S.gems));
    if (S.stars && (d * 7) % 5 === 1) set(d, 0, C('#ffffff')); }
  if (!S.fork) set(L + 1, 0, pal_[4]); else { set(L + 1, -1, pal_[4]); set(L + 1, 1, pal_[4]); }
  const g = S.guard;
  if (g === 'small' || g === 'cross' || g === 'katana') { const gw = g === 'cross' ? 4 : g === 'katana' ? 2 : 3; for (let o = -gw; o <= gw; o++) set(1, o, gp[o === -gw || o === gw ? 2 : 4]); }
  else if (g === 'sun') { for (let o = -3; o <= 3; o++) set(1, o, gp[3]); set(1, 0, gp[4]); set(0, -1, gp[4]); set(2, 1, gp[4]); set(0, 1, gp[2]); set(2, -1, gp[2]); }
  else if (g === 'wings') { for (let o = 1; o <= 5; o++) { set(1 - (o >> 1), o, gp[o % 2 ? 4 : 3]); set(1 - (o >> 1), -o, gp[o % 2 ? 1 : 2]); } }
  else if (g === 'ring') { for (const [d, o] of [[0, -2], [1, -2], [2, -1], [2, 0], [2, 1], [1, 2], [0, 2], [-1, 1], [-1, 0], [-1, -1]]) set(d, o, gp[3]); set(0, 0, C(S.glow || '#ffffff')); set(1, 0, C(S.glow || '#ffffff')); }
  else if (g === 'heart') { for (const [d, o] of [[1, -2], [1, 2], [0, -1], [0, 1], [-1, 0], [1, -1], [1, 1], [1, 0]]) set(d, o, gp[3]); }
  else if (g === 'flame') { for (let o = -3; o <= 3; o++) set(1 + (Math.abs(o) > 1 ? 1 : 0), o, gp[Math.abs(o) > 2 ? 4 : 3]); }
  else if (g === 'trident') { for (let o = -3; o <= 3; o++) set(1, o, gp[3]); set(2, -3, gp[4]); set(2, 3, gp[4]); set(3, -3, gp[4]); set(3, 3, gp[4]); }
  else if (g === 'horns') { for (let o = -2; o <= 2; o++) set(1, o, gp[3]); for (const s of [-1, 1]) { set(2, s * 3, gp[4]); set(3, s * 4, gp[4]); set(4, s * 4, gp[3]); set(0, s * 3, gp[2]); } set(1, 0, C(S.glow || '#ffffff')); }
  for (let d = g === 'ring' ? -4 : -3; d <= 0; d++) if (g !== 'ring' || d < -1) set(d, 0, d === -3 || d === -4 ? gp[4] : (g === 'katana' ? C(d % 2 ? '#c02030' : '#2a0a0a') : WOOD[2]));
}
// ---------- VFX on attacks for styled swords ----------
function swordOnBasic(ang, tgt) {
  const P = G.P, w = P.equip.weapon && ITEMS[P.equip.weapon.id]; if (!w || !w.ws) return; const S = WS[w.ws], atk = P.S.atk, fx = S.fx;
  const x = P.x + Math.cos(ang) * 22, y = P.y + Math.sin(ang) * 16 - 6;
  if (S.glow) burst(x, y, 5, { sp: 40, up: 20, g: 30, life: 0.35, c: [S.glow, '#ffffff'] });
  if (tgt && !tgt.dying) {
    if (fx === 'burn' && Math.random() < 0.35) { tgt.burn = 4; tgt.burnD = Math.round(atk * 0.15); }
    if (fx === 'slow' && Math.random() < 0.35) tgt.slow = Math.max(tgt.slow || 0, 2);
    if (fx === 'bleed' && Math.random() < 0.3) { tgt.poison = Math.max(tgt.poison || 0, 4); tgt.poisonD = Math.round(atk * 0.12); }
    if (fx === 'crush' && Math.random() < 0.15) tgt.stun = Math.max(tgt.stun || 0, 0.6);
    if (fx === 'life' || fx === 'heal') { const h = Math.round(P.S.maxhp * (fx === 'life' ? 0.012 : 0.015)); P.hp = Math.min(P.S.maxhp, P.hp + h); }
    if (fx === 'star' && Math.random() < 0.2) delayAct(0.3, () => { addFx({ type: 'bolt', x: tgt.x + 20, y: tgt.y - 120, x2: tgt.x, y2: tgt.y - 6, dur: 0.3, col: '#ffd0ff' }); hitCircle(tgt.x, tgt.y, 24, atk * 1.2, {}); });
    if (fx === 'light') addFx({ type: 'ring', x: tgt.x, y: tgt.y, r: 12, dur: 0.25, col: '#fff4a0' });
  }
  if (S.vfx === 'abyss') { addFx({ type: 'slash', x: P.x, y: P.y, ang: ang - 0.3, arc: 2.4, r: 30, dur: 0.25, col: 'rgba(120,170,220,0.9)' }); burst(x, y, 8, { sp: 50, up: 10, g: 0, life: 0.5, c: ['#0a0e16', '#2a3446', '#8ab0c8'] });
    if (tgt && Math.random() < 0.15) delayAct(0.2, () => { addFx({ type: 'ring', x: tgt.x, y: tgt.y, r: 34, dur: 0.4, col: '#7ab0e0' }); burst(tgt.x, tgt.y - 8, 24, { sp: 90, up: 30, g: 0, life: 0.6, c: ['#0a0e16', '#18202e', '#9ad8f0'] }); hitCircle(tgt.x, tgt.y, 34, atk * 1.6, {}); G.shake = Math.max(G.shake, 2); sfx('boom'); }); }
  if (S.vfx === 'rose') { burst(x, y, 10, { sp: 50, up: 30, g: 40, life: 0.8, c: ['#ff8ac0', '#ffd0e8', '#ffffff'] }); const h = Math.round(P.S.maxhp * 0.02); P.hp = Math.min(P.S.maxhp, P.hp + h);
    if (tgt && Math.random() < 0.2) for (let i = 0; i < 6; i++) delayAct(0.08 * i, () => { const ox = tgt.x + (Math.random() - 0.5) * 40, oy = tgt.y + (Math.random() - 0.5) * 24; addFx({ type: 'bolt', x: ox, y: oy - 60, x2: ox, y2: oy, dur: 0.2, col: '#ffd0e8' }); hitCircle(ox, oy, 16, atk * 0.4, {}); }); }
  if (S.vfx === 'rune') { addFx({ type: 'ring', x: P.x, y: P.y, r: 20, dur: 0.35, col: '#b080ff' }); if (tgt && Math.random() < 0.2) delayAct(0.15, () => { addFx({ type: 'bolt', x: P.x, y: P.y - 14, x2: tgt.x, y2: tgt.y - 10, dur: 0.3, col: '#c8a0ff' }); hitCircle(tgt.x, tgt.y, 28, atk * 1.8, { stun: 0.3 }); sfx('boom'); }); }
}
function swordStats(P, S) { const w = P.equip.weapon && ITEMS[P.equip.weapon.id]; if (!w || !w.ws) return; const st = WS[w.ws]; if (st.vfx === 'rune') S.def = Math.round(S.def * 1.1); if (st.fx === 'speed') S.aspd /= 1.1; }
function swordAura(dt) { const P = G.P, w = P.equip.weapon && ITEMS[P.equip.weapon.id]; if (!w || !w.ws || P.dead) return; const S = WS[w.ws]; if (!S.glow && !S.wisp) return; if (Math.random() < dt * (S.vfx ? 8 : 3)) { const dv = DIRV[P.dir]; burst(P.x + dv[0] * 8 + (Math.random() - 0.5) * 10, P.y - 10 - Math.random() * 12, 1, { sp: 8, up: 22, g: -30, life: 0.7, c: [S.wisp || S.glow, '#ffffff'] }); } }
// ---------- one more skill for each original class (with new VFX) ----------
sk('g19', 'guerrero', 0, 6, 'Juicio Celestial', 'act', 145, 'g14', { mp: 200, cd: 40, icon: ['slash', '#ffffff'], eff: { k: 'skyfall', m: 12, mr: 0.8, r: 70, col: '#ffe08a', n: 1 }, d: 'Una espada de luz gigante cae del cielo: {m}% de daño en área y aturde.' });
sk('m19', 'mago', 2, 6, 'Tormenta Prismática', 'act', 145, 'm18', { mp: 210, cd: 36, icon: ['star', '#7ad8ff'], eff: { k: 'beams', m: 2.6, mr: 0.2, n: 14, area: 80 }, d: 'Catorce rayos de todos los colores golpean la zona ({m}% cada uno).' });
sk('a19', 'arquero', 0, 6, 'Lluvia del Fénix', 'act', 145, 'a14', { mp: 190, cd: 32, icon: ['fire', '#ff8a2a'], eff: { k: 'rain', m: 2.6, mr: 0.2, n: 16, r: 30, area: 80, art: 'phoenix', burn: 1 }, d: 'Flechas de fuego con forma de fénix caen sobre la zona ({m}% cada una) y queman.' });
sk('s19', 'asesino', 0, 6, 'Mil Cortes Sombríos', 'act', 145, 's14', { mp: 180, cd: 30, icon: ['slash', '#c070ff'], eff: { k: 'flurry', m: 1.2, mr: 0.1, hits: 22, r: 40, vfx: 'void' }, d: 'Desapareces y asestas 22 cortes sombríos alrededor ({m}% cada uno).' });
function castExtra(id, r, mult, e, tgt, ang) {
  const P = G.P, atk = P.S.atk, cx = tgt ? tgt.x : P.x + Math.cos(ang) * 50, cy = tgt ? tgt.y : P.y + Math.sin(ang) * 36;
  if (e.k === 'skyfall') { addFx({ type: 'field', ground: true, x: cx, y: cy, r: e.r, dur: 0.7, col: '#ffe08a' }); for (let i = 0; i < 8; i++) delayAct(i * 0.07, () => addFx({ type: 'bolt', x: cx + (Math.random() - 0.5) * 8, y: cy - 220 + i * 25, x2: cx, y2: cy - 200 + i * 25 + 40, dur: 0.25, col: '#fff4c0' }));
    delayAct(0.7, () => { hitCircle(cx, cy, e.r, atk * mult, { stun: 1.5 }); addFx({ type: 'ring', x: cx, y: cy, r: e.r * 1.3, dur: 0.6, col: '#ffd040' }); addFx({ type: 'bolt', x: cx, y: cy - 260, x2: cx, y2: cy, dur: 0.5, col: '#ffffff' }); burst(cx, cy - 6, 50, { sp: 150, up: 80, g: 160, life: 0.9, c: ['#ffd040', '#fff4c0', '#ffffff'] }); G.shake = 8; sfx('boom'); }); return true; }
  if (e.k === 'beams') { const cols = ['#ff5a5a', '#ffa040', '#ffe040', '#5aff7a', '#5ac8ff', '#7a7aff', '#d070ff']; for (let i = 0; i < e.n; i++) delayAct(0.09 * i, () => { const near = G.ents.filter(m => m.type === 'mob' && !m.dying && m.map === G.map.id && dist(m.x, m.y, cx, cy) < e.area * 1.4), T = near.length ? near[(Math.random() * near.length) | 0] : null, x = T ? T.x : cx + (Math.random() - 0.5) * e.area * 1.6, y = T ? T.y : cy + (Math.random() - 0.5) * e.area; const c = cols[i % cols.length]; addFx({ type: 'bolt', x: x + 10, y: y - 160, x2: x, y2: y, dur: 0.3, col: c }); addFx({ type: 'ring', x, y, r: 20, dur: 0.3, col: c }); hitCircle(x, y, 22, atk * mult, {}); }); sfx('boom'); return true; }
  return false;
}
