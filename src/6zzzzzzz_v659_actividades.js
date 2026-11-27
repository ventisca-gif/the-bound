// ================= 6.59 · Actividades nuevas, todas dentro del mapa =================
// De la lista de ideas que Sergio aprobó («las otras ideas sí»). Cada una con su mecánica propia, con joystick, ⚔ y
// NPCs en el mundo (nada de ventanas). Todas salen en Lupa › Sistemas y en el Mapa con su punto.
//  1) 🏮 Mercado nocturno (Albor, 20:00-2:00): tres puestos con farolillos y ofertas que cambian cada noche.
//  2) 🥚 Búsqueda de huevos (Albor, una vez al día): 8 huevos escondidos por el Valle; el radar dice frío/tibio/caliente.
//  3) 🏹 Tiro con arco (norte de Albor): 10 flechas, dianas a 3 distancias, viento y una mira que se mueve sola.
//  4) 🛷 Carrera de trineos (Picos Helados): bajas una pista de nieve contra 3 rivales; ⚔ salta los troncos.
//  5) 🛡 Defensa del pueblo (puerta sur de Albor): 4 oleadas de monstruos van a por el portón; si cae, pierdes.
//  6) 🌀 Laberinto que cambia (Bosque Susurrante): los muros se mueven cada 25 s; llega al cofre del centro.
//  7) 🌠 Estrellas fugaces (de noche, en el mundo): cae un fragmento estelar cerca; el astrónomo los cambia por deseos.
//  8) 💌 Cápsula del tiempo (Albor): entierras oro y un mensaje; a los 7 días la abres con intereses y ves cómo eras.
function V659() { const P = G.P; return P.v659 && typeof P.v659 === 'object' ? P.v659 : (P.v659 = {}); }
SAVEKEYS.push('v659');
const V659_AT = { mercado: [128, 153], huevos: [110, 143], arco: [119, 136], trineo: [187, 41], defensa: [118, 163], laberinto: [60, 152], astro: [104, 146], capsula: [114, 157] };
const v659Px = k => ({ x: V659_AT[k][0] * 16 + 8, y: V659_AT[k][1] * 16 + 8 });
const v659Night = () => { const h = hourNow(); return h >= 20 || h < 2; };
const v659Look = (g, hair, cols, hs) => LK({ g, hairStyle: hs || (g === 'f' ? 'long' : 'short'), hair: HAIRS[hair] || HAIRS.negro, main: pal(cols) });
NPCS.v659_mn0 = { n: L2('Tía Luma', 'Aunt Luma'), title: L2('Mercado nocturno · comida', 'Night market · food'), look: v659Look('f', 'castano', ['#5a1a10', '#8a2a1a', '#b8402a', '#d8603a', '#f08a5a']), lines: [L2('¡Brochetas recién hechas bajo los farolillos!', 'Fresh skewers under the lanterns!')], quests: [] };
NPCS.v659_mn1 = { n: L2('Mercader Ossi', 'Merchant Ossi'), title: L2('Mercado nocturno · materiales', 'Night market · materials'), look: v659Look('m', 'negro', ['#1a2a4a', '#2a3e6a', '#3a548a', '#5a72aa', '#7a92ca']), lines: [L2('Lo que de día cuesta el doble, de noche es una ganga.', 'What costs double by day is a bargain at night.')], quests: [] };
NPCS.v659_mn2 = { n: L2('Abuela Fen', 'Grandma Fen'), title: L2('Mercado nocturno · pociones', 'Night market · potions'), look: v659Look('f', 'gris', ['#2a1a3a', '#3e2a5a', '#5a3e7a', '#7a5a9a', '#9a7aba']), lines: [L2('Pociones de luna llena, querida.', 'Full-moon potions, dear.')], quests: [] };
NPCS.v659_huevos = { n: L2('Pía', 'Pía'), title: L2('Búsqueda de huevos', 'Egg hunt'), look: v659Look('f', 'rubio', ['#3a6a2a', '#4e8a3a', '#68aa4e', '#88c868', '#aae08a']), lines: [L2('¡Las gallinas del valle han escondido sus huevos otra vez!', 'The valley hens have hidden their eggs again!')], quests: [] };
NPCS.v659_arco = { n: L2('Maestra Ilse', 'Master Ilse'), title: L2('Tiro con arco', 'Archery'), look: v659Look('f', 'pelirrojo', ['#2a3a1a', '#3e5a26', '#567a34', '#709a46', '#90ba5e']), lines: [L2('Respira, mira el viento y suelta.', 'Breathe, read the wind and release.')], quests: [] };
NPCS.v659_trineo = { n: L2('Bjorn', 'Bjorn'), title: L2('Carrera de trineos', 'Sled race'), look: v659Look('m', 'rubio', ['#5a1a1a', '#7a2626', '#9a3434', '#ba4a46', '#da6a5e']), lines: [L2('¡La pista está helada y rápida hoy!', 'The track is icy and fast today!')], quests: [] };
NPCS.v659_defensa = { n: L2('Capitana Brea', 'Captain Brea'), title: L2('Defensa del pueblo', 'Village defence'), look: v659Look('f', 'negro', ['#3a3a42', '#54545e', '#70707c', '#8e8e9a', '#b0b0ba']), lines: [L2('Si cae el portón, cae Albor.', 'If the gate falls, Albor falls.')], quests: [] };
NPCS.v659_lab = { n: L2('Jardinero Tomé', 'Gardener Tomé'), title: L2('Laberinto que cambia', 'Shifting maze'), look: v659Look('m', 'castano', ['#1a3a1a', '#265226', '#346a34', '#468a46', '#5eaa5e']), lines: [L2('Mi laberinto nunca es el mismo dos veces.', 'My maze is never the same twice.')], quests: [] };
NPCS.v659_astro = { n: L2('Astrónomo Celio', 'Astronomer Celio'), title: L2('Estrellas fugaces', 'Shooting stars'), look: v659Look('m', 'blanco', ['#10183a', '#1a2656', '#263874', '#384e94', '#5068b4']), lines: [L2('Cada estrella que cae trae un deseo.', 'Every falling star brings a wish.')], quests: [] };
NPCS.v659_capsula = { n: L2('Guardiana Orla', 'Keeper Orla'), title: L2('Cápsula del tiempo', 'Time capsule'), look: v659Look('f', 'blanco', ['#3a2a10', '#5a4218', '#7a5a24', '#9a7834', '#ba9a4e']), lines: [L2('Lo que entierras hoy te espera mañana.', 'What you bury today awaits you tomorrow.')], quests: [] };
for (const [i, n, hair, cols, g] of [[0, L2('Sven', 'Sven'), 'rubio', ['#1a3a6a', '#26508a', '#3a6aaa', '#5488c8', '#78a8e0'], 'm'], [1, L2('Kaia', 'Kaia'), 'pelirrojo', ['#6a1a3a', '#8a2650', '#aa3a6a', '#c85488', '#e078a8'], 'f'], [2, L2('Oleg', 'Oleg'), 'negro', ['#1a5a3a', '#267a50', '#3a9a6a', '#54b888', '#78d4a8'], 'm']])
  NPCS['v659_rv' + i] = { n, title: L2('Corredor de trineo', 'Sled racer'), look: v659Look(g, hair, cols), lines: [L2('¡Nos vemos en la meta!', 'See you at the finish!')], quests: [] };
it('v659_huevo', { n: L2('Huevo pintado', 'Painted egg'), t: 'cons', stack: true, heal: 400, price: 30, icon: ['food', 2], rar: 1, d: L2('De la búsqueda de huevos del Valle de Albor.', 'From the Albor Valley egg hunt.') });
it('v659_huevo_oro', { n: L2('Huevo dorado', 'Golden egg'), t: 'cons', stack: true, heal: 5000, mana: 1500, price: 2000, icon: ['gem', '#f0e0a0'], rar: 3, d: L2('Premio por encontrar los 8 huevos en un día.', 'Prize for finding all 8 eggs in one day.') });
it('v659_frag', { n: L2('Fragmento estelar', 'Star fragment'), t: 'mat', stack: true, price: 500, icon: ['gem', '#9af0ff'], rar: 2, d: L2('Cae con las estrellas fugaces de noche. El astrónomo de Albor los cambia por deseos (5).', 'Falls with shooting stars at night. The Albor astronomer trades them for wishes (5).') });
// freePxNear devuelve [x, y]; aquí se usa como { x, y }
const v659Free = (M, x, y, r) => { const p = freePxNear(M, x, y, r); return p ? { x: p[0], y: p[1] } : null; };
const v659Lv = () => Math.max(1, G.P.lv || 1);
const v659Gold = (base, k) => Math.round((base + v659Lv() * k));

// NPCs que aparecen y se van según la hora (v75Temp sirve en el mapa del mundo)
let v659NT = 0;
V33_TICKS.push(dt => { v659NT -= dt || 0.016; if (v659NT > 0) return; v659NT = 1; try { const M = G.map; if (!M || M !== G.world || !G.P) return; const n = v659Night();
  for (let i = 0; i < 3; i++) v75Temp(M, 'v659_mn' + i, (V659_AT.mercado[0] + i * 3) * 16 + 8, V659_AT.mercado[1] * 16 + 8, n);
  v75Temp(M, 'v659_astro', v659Px('astro').x, v659Px('astro').y, isNight());
  for (const [id, k] of [['v659_huevos', 'huevos'], ['v659_arco', 'arco'], ['v659_trineo', 'trineo'], ['v659_defensa', 'defensa'], ['v659_lab', 'laberinto'], ['v659_capsula', 'capsula']]) v75Temp(M, id, v659Px(k).x, v659Px(k).y, true);
} catch (e) { errOnce('v659 npcs', e); } });

// ---------- 1) MERCADO NOCTURNO ----------
function v659Deals(i) { const d = calDay(), R = new RNG((d * 131 + i * 17 + 7) | 0), L = v659Lv();
  const pool = Object.keys(ITEMS).filter(k => { const it = ITEMS[k]; if (!it || !(it.price > 0) || it.quest || it.leg) return false; if (i === 0) return it.t === 'cons' && (it.food || it.heal) && !it.mana && (it.lv || 0) <= L + 5;
    if (i === 1) return it.t === 'mat' && (it.lv || 0) <= L + 5; return it.t === 'cons' && (it.mana || it.heal) && /poc|pot/.test(k) && (it.lv || 0) <= L + 5; });
  const out = []; for (let k = 0; k < 2 && pool.length; k++) { const id = pool.splice(R.int(0, pool.length - 1), 1)[0], q = ITEMS[id].stack ? 3 + R.int(0, 4) : 1; out.push({ id, q, price: Math.max(10, Math.round(ITEMS[id].price * q * 0.6)) }); } return out; }
DLG_HOOKS.push((npc, opts) => { try { const m = /^v659_mn(\d)$/.exec(npc && npc.id || ''); if (!m) return; const i = +m[1], S = V659(), d = calDay(); S.mn = S.mn && S.mn.d === d ? S.mn : { d, b: {} };
  v659Deals(i).forEach((o, j) => { const key = i + '_' + j; if (S.mn.b[key]) return; opts.unshift({ label: '🏮 ' + ITEMS[o.id].n + ' ×' + o.q + ' · ' + fmt(o.price) + L2(' oro (−40 %)', ' gold (−40%)'), cls: 'quest', icon: ITEMS[o.id].icon, fn: () => {
    const P = G.P; if (S.mn.b[key]) return; if (P.gold < o.price) { typeText(L2('No te alcanza el oro, cariño.', 'You don\'t have enough gold, dear.')); return; } if (giveItem(o.id, o.q) === false) { typeText(L2('Tu mochila está llena.', 'Your bag is full.')); return; }
    P.gold -= o.price; S.mn.b[key] = 1; markDirty(true); sfx('coin'); typeText(L2('¡Buena compra! Vuelve mañana por la noche, habrá otras cosas.', 'Good buy! Come back tomorrow night, there will be other things.')); } }); });
} catch (e) { } });
WORLD_DRAW.push((cx, cy) => { if (G.map !== G.world || !v659Night()) return; const x0 = V659_AT.mercado[0] * 16 - 8 - cx, y0 = V659_AT.mercado[1] * 16 - 26 - cy; if (x0 < -200 || x0 > VW + 60 || y0 < -80 || y0 > VH + 60) return;
  ctx.strokeStyle = '#3a2410'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + 80, y0 + 10, x0 + 160, y0); ctx.stroke();
  for (let k = 0; k <= 8; k++) { const t = k / 8, x = x0 + 160 * t, y = y0 + 10 * 4 * t * (1 - t) * 0.5 + 3, a = 0.55 + 0.25 * Math.sin(G.t * 3 + k); ctx.fillStyle = `rgba(255,${150 + (k % 3) * 30},60,${a.toFixed(2)})`; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); ctx.fillStyle = ['#e83a2a', '#ffb030', '#ff6a8a'][k % 3]; ctx.fillRect(x - 2, y - 3, 5, 6); } });

// ---------- 2) BÚSQUEDA DE HUEVOS ----------
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_huevos') return; const S = V659(); if (ACT.k === 'huevos') return; opts.unshift({ label: '🥚 ' + L2('Buscar huevos', 'Hunt for eggs') + (S.egg === calDay() ? L2(' (hoy ya: premio pequeño)', ' (done today: small prize)') : ''), cls: 'quest', icon: ['food', 2], fn: () => { closeDialog(); v659EggStart(); } }); });
function v659EggStart() { if (actBusy()) return; const W = G.world, c = v659Px('huevos'), eggs = [];
  for (let k = 0; k < 8; k++) { const p = v659Free(W, c.x + (Math.random() - 0.5) * 300, c.y + (Math.random() - 0.5) * 260, 22); if (p) eggs.push({ x: p.x, y: p.y, col: ['#ff8ab0', '#8ad0ff', '#ffe060', '#9aff8a', '#c08aff'][k % 5], got: 0 }); }
  Object.assign(ACT, { k: 'huevos', t: 0, eggs, n: 0 }); banner('🥚 ' + L2('¡A buscar!', 'Go find them!'), L2('8 huevos escondidos por el valle. El radar de arriba te dice si estás cerca. 3 minutos.', '8 eggs hidden around the valley. The radar on top tells you if you are close. 3 minutes.')); }
V33_TICKS.push(dt => { if (ACT.k !== 'huevos') return; const P = G.P, A = ACT; if (G.map !== G.world || P.dead) { actEnd(); return; } A.t += dt || 0.016; let best = 1e9;
  for (const e of A.eggs) { if (e.got) continue; const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < 16) { e.got = 1; A.n++; sfx('coin'); floatText(P.x, P.y - 40, '🥚 ' + A.n + '/8', '#ffe8a0'); burst(e.x, e.y - 6, 10, { sp: 40, up: 50, g: 60, life: 0.6, c: [e.col, '#ffffff'] }); continue; } best = Math.min(best, d); }
  const r = best < 90 ? L2('🔥 ¡Caliente!', '🔥 Hot!') : best < 220 ? L2('♨ Tibio', '♨ Warm') : L2('❄ Frío', '❄ Cold'); mgHud(`🥚 ${A.n}/8 · ${r} · ⏱ ${Math.max(0, Math.ceil(180 - A.t))}s`);
  if (A.n >= 8 || A.t >= 180) { const S = V659(), first = S.egg !== calDay(); S.egg = calDay(); const g = first ? v659Gold(300, 25) * A.n : 50 * A.n; P.gold += g; if (A.n) giveItem('v659_huevo', A.n, true); if (A.n >= 8 && first) giveItem('v659_huevo_oro', 1, true);
    actEnd(); markDirty(true); sfx(A.n >= 8 ? 'questdone' : 'coin'); banner('🥚 ' + A.n + L2(' huevos', ' eggs'), '+' + fmt(g) + L2(' oro', ' gold') + (A.n >= 8 && first ? ' · ' + ITEMS.v659_huevo_oro.n : '')); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'huevos' || G.map !== G.world) return; for (const e of ACT.eggs) { if (e.got) continue; const x = e.x - cx, y = e.y - cy; if (x < -20 || x > VW + 20 || y < -20 || y > VH + 20) continue; const w = Math.sin(G.t * 4 + e.x) * 0.15;
  ctx.save(); ctx.translate(x, y); ctx.rotate(w); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 4, 6, 2, 0, 0, 7); ctx.fill(); ctx.fillStyle = e.col; ctx.beginPath(); ctx.ellipse(0, -2, 5, 7, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillRect(-4, -3, 8, 2); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(-2, -7, 2, 2); ctx.restore(); } });

// ---------- 3) TIRO CON ARCO ----------
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_arco') return; const S = V659(); opts.unshift({ label: '🏹 ' + L2('Tirar 10 flechas', 'Shoot 10 arrows') + (S.arcoBest ? ' · ' + L2('récord ', 'best ') + S.arcoBest : ''), cls: 'quest', icon: ['arrow', '#ffd040'], fn: () => { closeDialog(); v659ArcoStart(); } }); });
function v659ArcoStart() { if (actBusy()) return; const P = G.P, c = v659Px('arco'); if (P.mount) { P.mount = null; calcStats(P); if (typeof mountBtn === 'function') mountBtn(); }
  P.x = c.x; P.y = c.y + 24; P.dir = 'up';
  Object.assign(ACT, { k: 'arco', t: 0, left: 10, score: 0, row: 0, aim: 0, aimV: 1, wind: (Math.random() - 0.5) * 2, fly: null, ax: P.x, ay: P.y, onAtk: () => v659ArcoShoot() });
  banner('🏹 ' + L2('Tiro con arco', 'Archery'), L2('La mira va y viene: toca ⚔ cuando pase por la diana. Mira el viento.', 'The sight sweeps back and forth: tap ⚔ when it crosses the target. Watch the wind.')); }
const V659_ROWS = [{ d: 48, r: 13, p: 1 }, { d: 76, r: 10, p: 1.5 }, { d: 104, r: 7, p: 2.2 }];
const v659TargetX = (A, i) => A.ax + Math.sin(G.t * (0.5 + i * 0.25) + i * 2) * (30 + i * 8);
function v659ArcoShoot() { const A = ACT; if (A.k !== 'arco' || A.fly || A.left <= 0) return true; const R = V659_ROWS[A.row]; A.fly = { t: 0, x0: A.ax, y0: A.ay - 10, tx: A.ax + A.aim * 70 + A.wind * R.d * 0.12, ty: A.ay - R.d, row: A.row }; A.left--; sfx('ui'); return true; }
V33_TICKS.push(dt => { if (ACT.k !== 'arco') return; dt = dt || 0.016; const P = G.P, A = ACT; if (G.map !== G.world || P.dead) { actEnd(); return; } P.x = A.ax; P.y = A.ay; P.dir = 'up'; A.t += dt;
  A.aim += A.aimV * dt * 1.6; if (A.aim > 1) { A.aim = 1; A.aimV = -1; } if (A.aim < -1) { A.aim = -1; A.aimV = 1; }
  if (A.fly) { const F = A.fly; F.t += dt * 4; if (F.t >= 1) { const R = V659_ROWS[F.row], d = Math.abs(F.tx - v659TargetX(A, F.row)), pts = d < R.r * 0.35 ? 10 : d < R.r * 0.7 ? 7 : d < R.r ? 4 : 0, got = Math.round(pts * R.p);
      A.score += got; floatText(F.tx, F.ty - 10, got ? '+' + got : L2('¡Fallo!', 'Miss!'), got >= 15 ? '#ffd040' : got ? '#ffffff' : '#ff8a8a'); if (got) sfx('coin'); A.fly = null; A.row = (A.row + 1) % 3; A.wind = Math.max(-1, Math.min(1, A.wind + (Math.random() - 0.5) * 0.8)); } }
  mgHud(`🏹 ${A.score} ${L2('puntos', 'points')} · ${A.left} ${L2('flechas', 'arrows')} · 🌬 ${A.wind > 0.15 ? '→' : A.wind < -0.15 ? '←' : '·'}${Math.abs(A.wind * 10).toFixed(0)}`);
  if (A.left <= 0 && !A.fly) { const S = V659(), d = calDay(); S.arcoN = S.arcoD === d ? (S.arcoN || 0) + 1 : 1; S.arcoD = d; const k = S.arcoN <= 3 ? 1 : 0.2, g = Math.round(v659Gold(100, 6) * A.score / 10 * k); P.gold += g; gainXp(Math.round(A.score * v659Lv() * 0.6 * k));
    const rec = A.score > (S.arcoBest || 0); if (rec) S.arcoBest = A.score; actEnd(); markDirty(true); sfx(rec ? 'questdone' : 'coin'); banner('🏹 ' + A.score + L2(' puntos', ' points') + (rec ? L2(' · ¡récord!', ' · new best!') : ''), '+' + fmt(g) + L2(' oro', ' gold') + (k < 1 ? L2(' (más de 3 tandas hoy)', ' (more than 3 rounds today)') : '')); } });
WORLD_DRAW.push((cx, cy) => { if (G.map !== G.world) return; const c = v659Px('arco'), A = ACT.k === 'arco' ? ACT : null, ax = A ? A.ax : c.x, ay = A ? A.ay : c.y + 24; if (Math.abs(ax - cx - VW / 2) > VW || Math.abs(ay - cy - VH / 2) > VH) return;
  V659_ROWS.forEach((R, i) => { const tx = A ? v659TargetX(A, i) : ax + (i - 1) * 30, x = tx - cx, y = ay - R.d - cy; ctx.fillStyle = '#6a4424'; ctx.fillRect(x - 1, y, 2, 12); for (const [rr, col] of [[R.r, '#f4f0e0'], [R.r * 0.7, '#e83a3a'], [R.r * 0.35, '#ffd040']]) { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y - 2, rr, rr * 0.8, 0, 0, 7); ctx.fill(); } });
  if (!A) return; const R = V659_ROWS[A.row], sx = ax + A.aim * 70 - cx, sy = ay - R.d - cy; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sx, sy - 2, 5, 0, 7); ctx.moveTo(sx - 8, sy - 2); ctx.lineTo(sx + 8, sy - 2); ctx.moveTo(sx, sy - 10); ctx.lineTo(sx, sy + 6); ctx.stroke();
  if (A.fly) { const F = A.fly, x = F.x0 + (F.tx - F.x0) * F.t - cx, y = F.y0 + (F.ty - F.y0) * F.t - Math.sin(F.t * Math.PI) * 18 - cy; ctx.strokeStyle = '#4a2a10'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x, y - 4); ctx.stroke(); ctx.fillStyle = '#d0d0d8'; ctx.fillRect(x - 1, y - 6, 3, 3); } });

// ---------- 4) CARRERA DE TRINEOS (mapa propio: pista de nieve) ----------
const V659_TR = { w: 26, h: 150, fin: 140 };
function v659MakePista() { const id = 'v659_pista', { w, h } = V659_TR, N = w * h; G.ents = G.ents.filter(e => e.map !== id);
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.SNOW), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'field', I: (x, y) => y * w + x, v659: 1 };
  for (let y = 0; y < h; y++) for (const x of [0, 1, w - 2, w - 1]) M.ter[y * w + x] = T.STONE; for (let x = 2; x < w - 2; x++) M.ter[V659_TR.fin * w + x] = T.COBBLE;
  M.exit = { x: -9, y: -9 }; initMapObjs(M); M.wdist = null; G.maps[id] = M; return M; }
hookAround('makeInterior', (next, id, ...a) => id === 'v659_pista' ? v659MakePista() : id === 'v659_lab' ? v659MakeLab() : next(id, ...a));
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_trineo') return; const S = V659(); opts.unshift({ label: '🛷 ' + L2('Carrera de trineos', 'Sled race') + (S.trBest ? ' · ' + L2('mejor ', 'best ') + S.trBest.toFixed(1) + ' s' : ''), cls: 'quest', icon: ['snow', '#e0f8ff'], fn: () => { closeDialog(); v659TrStart(); } }); });
function v659TrStart() { if (actBusy()) return; const P = G.P; if (P.mount) { P.mount = null; calcStats(P); if (typeof mountBtn === 'function') mountBtn(); }
  P.retX = P.x; P.retY = P.y + 20; transition(() => { P.inside = 'v659_pista'; const M = v659MakePista(); setMap(M, 9 * 16, 4 * 16, 'down');
    const logs = [], ice = [], piles = []; for (let k = 0; k < 16; k++) logs.push({ x: (4 + Math.random() * 18) * 16, y: (14 + k * 7.5 + Math.random() * 3) * 16, hit: 0 });
    for (let k = 0; k < 12; k++) ice.push({ x: (3 + Math.random() * 18) * 16, y: (10 + k * 10) * 16, w: 48, h: 64 }); for (let k = 0; k < 14; k++) piles.push({ x: (3 + Math.random() * 19) * 16, y: (12 + k * 9 + 4) * 16, hit: 0 });
    const riv = [0, 1, 2].map(i => { const r = { x: (13 + i * 4) * 16, y: 4 * 16, v: 0, top: 150 + Math.random() * 40 + Math.min(40, v659Lv() / 20), col: ['#3a7ad0', '#d03a6a', '#3ad08a'][i], fin: 0 }; r.e = spawnNPC('v659_rv' + i, r.x, r.y, M.id, { face: 'down', wander: 0 }); if (r.e) { r.e.scene = 1; r.e.wander = 0; r.e.actTmp = 1; } return r; });
    Object.assign(ACT, { k: 'trineo', t: 0, vy: 30, z: 0, vz: 0, logs, ice, piles, riv, place: 0, onAtk: () => { if (ACT.z <= 0) { ACT.vz = 150; sfx('ui'); } return true; } });
    banner('🛷 ' + L2('¡Salida!', 'Go!'), L2('Gira con el joystick. El hielo azul acelera, la nieve amontonada frena. ⚔ salta los troncos.', 'Steer with the joystick. Blue ice speeds up, snow piles slow down. ⚔ jumps over logs.')); }); }
// en el tiro con arco y el trineo el joystick no te mueve (lo hace la actividad), pero ⚔ sigue funcionando
hookAround('updatePlayer', (next, dt, ...a) => { if (ACT.k !== 'trineo' && ACT.k !== 'arco') return next(dt, ...a); const P = G.P, x = P.x, y = P.y, d = P.dir; const r = next(dt, ...a); P.x = x; P.y = y; P.dir = d; return r; });
V33_TICKS.push(dt => { if (ACT.k !== 'trineo') return; dt = Math.min(0.05, dt || 0.016); const P = G.P, A = ACT, M = G.map; if (!M || M.id !== 'v659_pista' || P.dead) { actEnd(); return; } A.t += dt;
  const onIce = A.ice.some(i => Math.abs(P.x - i.x) < i.w / 2 && Math.abs(P.y - i.y) < i.h / 2); A.vy = Math.min(onIce ? 260 : 200, A.vy + (onIce ? 140 : 70) * dt);
  P.y += A.vy * dt; P.x = Math.max(2.6 * 16, Math.min((V659_TR.w - 2.6) * 16, P.x + (inp.jx || 0) * 110 * dt)); P.dir = 'down'; P.anim = 'idle';
  A.z = Math.max(0, A.z + A.vz * dt); A.vz -= 420 * dt; if (A.z <= 0) { A.z = 0; A.vz = 0; } P.z = A.z;
  for (const l of A.logs) if (!l.hit && Math.abs(P.y - l.y) < 8 && Math.abs(P.x - l.x) < 26) { l.hit = 1; if (A.z < 6) { A.vy *= 0.3; G.shake = 4; sfx('hurt'); floatText(P.x, P.y - 40, L2('¡Tronco!', 'Log!'), '#ff8a8a'); } else floatText(P.x, P.y - 40, '⤴', '#ffffff'); }
  for (const s of A.piles) if (!s.hit && Math.abs(P.y - s.y) < 9 && Math.abs(P.x - s.x) < 14 && A.z < 6) { s.hit = 1; A.vy *= 0.6; burst(P.x, P.y, 8, { sp: 40, up: 40, g: 60, life: 0.5, c: ['#ffffff', '#dfe8f0'] }); }
  for (const r of A.riv) { if (r.fin) continue; r.v = Math.min(r.top, r.v + 80 * dt); r.y += r.v * dt * (0.9 + Math.sin(G.t * 1.3 + r.x) * 0.1); r.x += Math.sin(G.t * 0.8 + r.top) * 30 * dt; if (r.y / 16 >= V659_TR.fin) { r.fin = A.t; A.place++; } if (r.e) { r.e.x = r.x; r.e.y = r.y; r.e.dir = 'down'; r.e.anim = 'idle'; } }
  if (Math.random() < 0.5) part(P.x + (Math.random() - 0.5) * 12, P.y + 6, { vz: 15, vx: (Math.random() - 0.5) * 30, g: 80, life: 0.4, c: '#f4f8ff', s: 2 });
  const pos = 1 + A.riv.filter(r => r.fin || r.y > P.y).length; mgHud(`🛷 ${L2('Puesto', 'Place')} ${pos}/4 · ⏱ ${A.t.toFixed(1)}s`);
  if (P.y / 16 >= V659_TR.fin || A.t > 60) { const place = 1 + A.riv.filter(r => r.fin).length, S = V659(), d = calDay(), first = S.trD !== d; S.trD = d; if (P.y / 16 >= V659_TR.fin && (!S.trBest || A.t < S.trBest)) S.trBest = +A.t.toFixed(2);
    const g = first ? [0, v659Gold(1500, 30), v659Gold(800, 15), v659Gold(400, 8), v659Gold(150, 3)][place] : [0, 600, 300, 150, 50][place]; P.gold += g; P.z = 0; actClean(); actEnd(); markDirty(true); sfx(place === 1 ? 'questdone' : 'coin');
    banner('🛷 ' + L2('Puesto ', 'Place ') + place + ' · ' + A.t.toFixed(1) + ' s', '+' + fmt(g) + L2(' oro', ' gold')); setTimeout(() => exitInterior(), 1800); } });
WORLD_DRAW.push((cx, cy) => { if (!G.map || G.map.id !== 'v659_pista') return; const A = ACT.k === 'trineo' ? ACT : null; if (!A) return;
  for (const i of A.ice) { const x = i.x - cx, y = i.y - cy; if (y < -40 || y > VH + 40) continue; ctx.fillStyle = 'rgba(140,200,255,.55)'; ctx.fillRect(x - i.w / 2, y - i.h / 2, i.w, i.h); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(x - i.w / 2 + 4, y - i.h / 2 + 6, 12, 2); }
  for (const s of A.piles) { if (s.hit) continue; const x = s.x - cx, y = s.y - cy; if (y < -20 || y > VH + 20) continue; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(x, y, 12, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#d8e4ee'; ctx.fillRect(x - 8, y + 1, 16, 2); }
  for (const l of A.logs) { const x = l.x - cx, y = l.y - cy; if (y < -20 || y > VH + 20) continue; ctx.fillStyle = '#6a4424'; ctx.fillRect(x - 24, y - 4, 48, 8); ctx.fillStyle = '#8a5e34'; ctx.fillRect(x - 24, y - 4, 48, 2); ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.ellipse(x - 24, y, 3, 4, 0, 0, 7); ctx.fill(); }
  const fy = V659_TR.fin * 16 - cy; if (fy > -20 && fy < VH + 20) for (let x = 2; x < V659_TR.w - 2; x++) { ctx.fillStyle = (x % 2) ? '#1a1a1a' : '#ffffff'; ctx.fillRect(x * 16 - cx, fy - 4, 16, 6); }
  for (const r of A.riv) { const x = r.x - cx, y = r.y - cy; if (y < -30 || y > VH + 30) continue; ctx.fillStyle = r.col; ctx.fillRect(x - 10, y + 2, 20, 6); ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x - 11, y + 8, 22, 2); }   // trineo debajo del corredor (el corredor es un NPC dibujado por el motor)
  for (let k = 0; k < 18; k++) for (const sx of [0.6, V659_TR.w - 0.6]) { const x = sx * 16 - cx, y = (k * 8 + 3) * 16 - cy; if (y < -40 || y > VH + 40) continue; ctx.fillStyle = '#2a4a32'; ctx.beginPath(); ctx.moveTo(x, y - 26); ctx.lineTo(x + 11, y); ctx.lineTo(x - 11, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#f4f8ff'; ctx.fillRect(x - 5, y - 18, 10, 2); ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x - 2, y, 4, 4); }
  const P = G.P, x = P.x - cx, y = P.y - cy; ctx.fillStyle = '#a03a1a'; ctx.fillRect(x - 10, y + 2 - A.z, 20, 6); ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x - 11, y + 8 - A.z, 22, 2); });

// ---------- 5) DEFENSA DEL PUEBLO ----------
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_defensa' || ACT.k === 'defensa') return; const S = V659(); opts.unshift({ label: '🛡 ' + L2('Defender el portón (4 oleadas)', 'Defend the gate (4 waves)') + (S.defD === calDay() ? L2(' (hoy ya: premio pequeño)', ' (done today: small prize)') : ''), cls: 'quest', icon: ['shield', '#9ad8ff'], fn: () => { closeDialog(); v659DefStart(); } }); });
const v659Gate = () => { const c = v659Px('defensa'); return { x: c.x, y: c.y + 40 }; };
function v659DefMobs() { const L = v659Lv(); let ids = Object.keys(MOBS).filter(k => { const m = MOBS[k]; return m && Array.isArray(m.lv) && m.lv[0] <= L && m.lv[1] >= L && m.art && !m.noSpawn; });
  if (!ids.length) ids = Object.keys(MOBS).filter(k => MOBS[k] && Array.isArray(MOBS[k].lv) && MOBS[k].lv[0] <= Math.max(5, L)).slice(-6); return ids.slice(0, 8); }
function v659DefStart() { if (actBusy()) return; Object.assign(ACT, { k: 'defensa', t: 0, wave: 0, hp: 100, next: 3, ids: v659DefMobs() }); banner('🛡 ' + L2('¡Defiende Albor!', 'Defend Albor!'), L2('Los monstruos van a por el portón. Si llegan, lo golpean. Aguanta 4 oleadas.', 'Monsters go for the gate. If they reach it, they hit it. Hold out for 4 waves.')); }
function v659DefSpawn(A) { const g = v659Gate(), n = 3 + A.wave * 2; A.wave++; banner('🛡 ' + L2('Oleada ', 'Wave ') + A.wave + '/4', ''); sfx('quest');
  for (let k = 0; k < n; k++) { const id = A.ids[(k + A.wave) % A.ids.length]; if (!id) continue; const p = v659Free(G.world, g.x + (Math.random() - 0.5) * 160, g.y + 200 + Math.random() * 60, 4) || { x: g.x + (Math.random() - 0.5) * 120, y: g.y + 200 };
    const m = spawnMob(id, v659Lv(), p.x, p.y, 0, null, false); if (m) { m.v659def = 1; m.map = 'world'; } } }
hookBefore('updateMob', function (e, dt) { if (!e || !e.v659def || e.dying || ACT.k !== 'defensa') return; const P = G.P, g = v659Gate();
  if (Math.hypot(e.x - P.x, e.y - P.y) < 70 || e.hp < e.maxhp) return;   // si te ve o le pegaste, pelea contigo
  const dx = g.x - e.x, dy = g.y - e.y, d = Math.hypot(dx, dy); dt = dt || 0.016;
  if (d > 18) { const v = 36 * dt; e.x += dx / d * v; e.y += dy / d * v; e.anim = 'walk'; e.af = Math.floor(G.t * 8) % 4; e.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
  else { e.anim = 'attack'; ACT.hp = Math.max(0, ACT.hp - 4 * dt); if (Math.random() < dt * 2) { G.shake = 1; floatText(g.x, g.y - 30, '💥', '#ff8a5a'); } } return HOOK_SKIP; });
V33_TICKS.push(dt => { if (ACT.k !== 'defensa') return; const P = G.P, A = ACT; if (G.map !== G.world || P.dead) { v659DefEnd(false); return; } A.t += dt || 0.016;
  const alive = G.ents.filter(e => e.v659def && !e.dying && !e.remove && e.hp > 0).length;
  if (!alive && A.wave < 4) { A.next -= dt || 0.016; if (A.next <= 0) { v659DefSpawn(A); A.next = 4; } } else if (!alive && A.wave >= 4) { v659DefEnd(true); return; }
  if (A.hp <= 0) { v659DefEnd(false); return; } mgHud(`🛡 ${L2('Oleada', 'Wave')} ${A.wave}/4 · 👾 ${alive} · 🚪 ${Math.ceil(A.hp)}%`); });
function v659DefEnd(win) { const P = G.P, A = ACT, S = V659(), first = S.defD !== calDay(); for (const e of G.ents) if (e.v659def) e.remove = true; actEnd();
  if (win) { S.defD = calDay(); const g = first ? v659Gold(2000, 40) : v659Gold(300, 5); P.gold += g; markDirty(true); sfx('questdone'); burst(P.x, P.y - 20, 24, { sp: 70, up: 80, g: 50, life: 1, c: ['#ffd040', '#ffffff'] }); banner('🛡 ' + L2('¡Albor está a salvo!', 'Albor is safe!'), L2('Portón al ', 'Gate at ') + Math.ceil(A.hp) + '% · +' + fmt(g) + L2(' oro', ' gold')); }
  else banner('🛡 ' + L2('El portón cayó', 'The gate fell'), L2('Vuelve a intentarlo con la Capitana Brea.', 'Try again with Captain Brea.')); }
WORLD_DRAW.push((cx, cy) => { if (G.map !== G.world) return; const g = v659Gate(), x = g.x - cx, y = g.y - cy; if (x < -60 || x > VW + 60 || y < -60 || y > VH + 60) return;
  ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x - 22, y - 26, 44, 26); ctx.fillStyle = '#7a5228'; for (let k = 0; k < 5; k++) ctx.fillRect(x - 21 + k * 9, y - 25, 7, 24); ctx.fillStyle = '#3a3a42'; ctx.fillRect(x - 22, y - 18, 44, 3); ctx.fillRect(x - 22, y - 8, 44, 3);
  if (ACT.k === 'defensa') { ctx.fillStyle = '#1a0a0e'; ctx.fillRect(x - 21, y - 34, 42, 5); ctx.fillStyle = ACT.hp > 40 ? '#5ad070' : '#ff6a3a'; ctx.fillRect(x - 20, y - 33, Math.round(40 * ACT.hp / 100), 3); } });

// ---------- 6) LABERINTO QUE CAMBIA (mapa propio) ----------
const V659_LB = 31;
function v659MazeCarve(M, seed) { const n = V659_LB, R = new RNG(seed | 0), I = (x, y) => y * n + x; for (let i = 0; i < n * n; i++) M.ter[i] = T.IWALL;
  const st = [[1, 1]]; M.ter[I(1, 1)] = T.GRASS; while (st.length) { const [x, y] = st[st.length - 1], nb = [[2, 0], [-2, 0], [0, 2], [0, -2]].map(([dx, dy]) => [x + dx, y + dy, x + dx / 2, y + dy / 2]).filter(([a, b]) => a > 0 && b > 0 && a < n - 1 && b < n - 1 && M.ter[I(a, b)] === T.IWALL);
    if (!nb.length) { st.pop(); continue; } const [a, b, mx, my] = nb[R.int(0, nb.length - 1)]; M.ter[I(mx, my)] = T.GRASS; M.ter[I(a, b)] = T.GRASS; st.push([a, b]); }
  for (let k = 0; k < 40; k++) { const x = 1 + R.int(0, n - 3), y = 1 + R.int(0, n - 3); if ((x + y) % 2 && M.ter[I(x, y)] === T.IWALL) M.ter[I(x, y)] = T.GRASS; }   // algunos atajos
  const c = (n - 1) / 2; for (let y = c - 1; y <= c + 1; y++) for (let x = c - 1; x <= c + 1; x++) M.ter[I(x, y)] = T.GRASS;
  const P = G.P; if (P && G.map === M) { const tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16); M.ter[I(tx, ty)] = T.GRASS; }
  M.chunks = new Map(); M.wdist = null; }
function v659MakeLab() { const id = 'v659_lab', n = V659_LB, N = n * n; G.ents = G.ents.filter(e => e.map !== id);
  const M = { id, w: n, h: n, ter: new Uint8Array(N), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0.12, music: 'forest', I: (x, y) => y * n + x, v659: 1 };
  v659MazeCarve(M, calDay() * 977 + 1); M.exit = { x: -9, y: -9 }; initMapObjs(M); M.wdist = null; G.maps[id] = M; return M; }
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_lab') return; const S = V659(); opts.unshift({ label: '🌀 ' + L2('Entrar al laberinto', 'Enter the maze') + (S.labD === calDay() ? L2(' (hoy ya: premio pequeño)', ' (done today: small prize)') : ''), cls: 'quest', icon: ['map'], fn: () => { closeDialog(); v659LabStart(); } }); });
function v659LabStart() { if (actBusy()) return; const P = G.P; if (P.mount) { P.mount = null; calcStats(P); if (typeof mountBtn === 'function') mountBtn(); } P.retX = P.x; P.retY = P.y + 20;
  transition(() => { P.inside = 'v659_lab'; const M = v659MakeLab(); setMap(M, 1 * 16 + 8, 1 * 16 + 12, 'down'); Object.assign(ACT, { k: 'lab', t: 0, sh: 25, n: 0 });
    banner('🌀 ' + L2('Laberinto que cambia', 'Shifting maze'), L2('Llega al cofre del centro. Los muros se mueven cada 25 segundos. 3 minutos.', 'Reach the chest in the centre. The walls move every 25 seconds. 3 minutes.')); }); }
V33_TICKS.push(dt => { if (ACT.k !== 'lab') return; dt = dt || 0.016; const P = G.P, A = ACT, M = G.map; if (!M || M.id !== 'v659_lab' || P.dead) { actEnd(); return; } A.t += dt; A.sh -= dt;
  if (A.sh <= 0) { A.sh = 25; A.n++; v659MazeCarve(M, calDay() * 977 + 1 + A.n * 31); G.shake = 3; sfx('door'); floatText(P.x, P.y - 40, L2('¡Los muros se mueven!', 'The walls move!'), '#c0ff8a'); }
  const c = (V659_LB - 1) / 2 * 16 + 8, d = Math.hypot(P.x - c, P.y - c); mgHud(`🌀 ⏱ ${Math.max(0, Math.ceil(180 - A.t))}s · ${L2('cambio en', 'shift in')} ${Math.ceil(A.sh)}s`);
  if (d < 18 || A.t >= 180) { const win = d < 18, S = V659(), first = S.labD !== calDay(); if (win) S.labD = calDay(); const g = win ? (first ? v659Gold(1800, 35) + Math.round(Math.max(0, 180 - A.t) * 20) : v659Gold(250, 4)) : 0; P.gold += g;
    actEnd(); markDirty(true); sfx(win ? 'questdone' : 'hurt'); banner('🌀 ' + (win ? L2('¡Llegaste al centro!', 'You reached the centre!') : L2('Se acabó el tiempo', 'Time is up')), win ? A.t.toFixed(0) + ' s · +' + fmt(g) + L2(' oro', ' gold') : ''); setTimeout(() => exitInterior(), 1500); } });
WORLD_DRAW.push((cx, cy) => { if (!G.map || G.map.id !== 'v659_lab') return; const c = (V659_LB - 1) / 2 * 16 + 8, x = c - cx, y = c - cy; if (x < -30 || x > VW + 30 || y < -30 || y > VH + 30) return;
  ctx.fillStyle = '#6a3a14'; ctx.fillRect(x - 9, y - 8, 18, 12); ctx.fillStyle = '#ffd040'; ctx.fillRect(x - 9, y - 4, 18, 2); ctx.fillRect(x - 1, y - 6, 3, 5); ctx.fillStyle = `rgba(255,220,100,${(0.25 + 0.2 * Math.sin(G.t * 4)).toFixed(2)})`; ctx.beginPath(); ctx.arc(x, y - 2, 16, 0, 7); ctx.fill(); });
// si la partida se guardó dentro de la pista o el laberinto, al cargar vuelves a la puerta
hookAfter('startGame', () => { try { const P = G.P; if (P && (P.inside === 'v659_pista' || P.inside === 'v659_lab')) { const k = P.inside === 'v659_pista' ? 'trineo' : 'laberinto', c = v659Px(k); P.inside = null; setMap(G.world, c.x, c.y + 24, 'down'); } } catch (e) { errOnce('v659 carga', e); } });

// ---------- 7) ESTRELLAS FUGACES ----------
const V659_ST = { next: 30, star: null, frag: null };
V33_TICKS.push(dt => { dt = dt || 0.016; const P = G.P; if (!P || P.dead || G.map !== G.world || !isNight() || P.inside) { V659_ST.star = null; return; }
  const S = V659_ST; if (S.star) { S.star.t += dt; if (S.star.t >= 1.2) { S.frag = { x: S.star.lx, y: S.star.ly, t: 0 }; S.star = null; toast('🌠 ' + L2('¡Una estrella fugaz cayó cerca! Busca el brillo.', 'A shooting star fell nearby! Look for the glow.'), 'info'); } }
  if (S.frag) { S.frag.t += dt; if (Math.hypot(P.x - S.frag.x, P.y - S.frag.y) < 18) { giveItem('v659_frag', 1); sfx('coin'); burst(S.frag.x, S.frag.y - 6, 18, { sp: 60, up: 70, g: 30, life: 0.9, c: ['#9af0ff', '#ffffff', '#ffe080'] }); S.frag = null; }
    else if (S.frag.t > 45) S.frag = null; return; }
  if (ACT.k) return; S.next -= dt; if (S.next > 0) return; S.next = 40 + Math.random() * 50;
  const p = v659Free(G.world, P.x + (Math.random() - 0.5) * 360, P.y + (Math.random() - 0.5) * 240, 6); if (!p) return; S.star = { t: 0, sx: P.x - VW / 2 + Math.random() * VW, sy: P.y - VH / 2 - 20, lx: p.x, ly: p.y }; });
WORLD_DRAW.push((cx, cy) => { const S = V659_ST; if (G.map !== G.world) return;
  if (S.star) { const k = Math.min(1, S.star.t / 1.2), x = S.star.sx + (S.star.lx - S.star.sx) * k - cx, y = S.star.sy + (S.star.ly - S.star.sy) * k - cy, tx = S.star.sx - cx, ty = S.star.sy - cy; const g = ctx.createLinearGradient(tx, ty, x, y); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,250,210,.9)'); ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - (x - tx) * 0.35, y - (y - ty) * 0.35); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 1, 3, 3); }
  if (S.frag) { const x = S.frag.x - cx, y = S.frag.y - cy, a = 0.4 + 0.3 * Math.sin(G.t * 5); ctx.fillStyle = `rgba(150,230,255,${a.toFixed(2)})`; ctx.beginPath(); ctx.arc(x, y - 4, 14, 0, 7); ctx.fill(); ctx.fillStyle = '#e8fcff'; ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x + 4, y - 4); ctx.lineTo(x, y + 4); ctx.lineTo(x - 4, y - 4); ctx.closePath(); ctx.fill(); } });
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_astro') return; const n = countItem('v659_frag');
  const wish = (lab, fn) => opts.unshift({ label: '🌠 ' + lab + ' (5 ' + L2('fragmentos', 'fragments') + ')', cls: n >= 5 ? 'quest' : '', icon: ['gem', '#9af0ff'], fn: () => { if (countItem('v659_frag') < 5) { typeText(L2('Necesito 5 fragmentos estelares. Caen de noche cerca de ti, en cualquier parte del mundo.', 'I need 5 star fragments. They fall at night near you, anywhere in the world.')); return; } takeItem('v659_frag', 5); fn(); markDirty(true); sfx('questdone'); burst(G.P.x, G.P.y - 20, 30, { sp: 70, up: 90, g: 30, life: 1.2, c: ['#9af0ff', '#ffffff', '#ffe080'] }); } });
  wish(L2('Deseo de fortuna', 'Wish for fortune'), () => { const g = v659Gold(5000, 120); G.P.gold += g; typeText(L2('Que la fortuna te acompañe: +', 'May fortune be with you: +') + fmt(g) + L2(' de oro.', ' gold.')); });
  wish(L2('Deseo de sabiduría', 'Wish for wisdom'), () => { const x = Math.round(xpToNext(G.P.lv) * 0.25); gainXp(x); typeText(L2('Las estrellas te enseñan: +', 'The stars teach you: +') + fmt(x) + ' XP.'); });
  wish(L2('Deseo de salud', 'Wish for health'), () => { giveItem('v659_huevo_oro', 2, true); typeText(L2('Que nunca te falten fuerzas: 2 huevos dorados.', 'May you never lack strength: 2 golden eggs.')); }); });

// ---------- 8) CÁPSULA DEL TIEMPO ----------
const V659_MSG = [L2('Espero que sigas siendo valiente.', 'I hope you are still brave.'), L2('¿Ya venciste a ese jefe que tanto te costaba?', 'Did you beat that boss that was so hard?'), L2('No olvides a tu familia y a tus amigos.', 'Don\'t forget your family and friends.'), L2('Lo mejor está por llegar.', 'The best is yet to come.')];
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_capsula') return; const S = V659(), C = S.cap, d = calDay();
  if (C && d >= C.open) { opts.unshift({ label: '💌 ' + L2('Abrir mi cápsula del tiempo', 'Open my time capsule'), cls: 'quest', icon: ['gem', '#ffd040'], fn: () => v659CapOpen() }); return; }
  if (C) { opts.unshift({ label: '💌 ' + L2('Mi cápsula', 'My capsule') + ' · ' + L2('se abre en ', 'opens in ') + (C.open - d) + L2(' días', ' days'), icon: ['gem', '#ffd040'], fn: () => typeText(L2('Tu cápsula sigue enterrada. Paciencia: lo bueno se hace esperar.', 'Your capsule is still buried. Patience: good things take time.')) }); return; }
  for (const amt of [1000, 10000, 100000]) opts.unshift({ label: '💌 ' + L2('Enterrar ', 'Bury ') + fmt(amt) + L2(' de oro (7 días, +50 %)', ' gold (7 days, +50%)'), cls: G.P.gold >= amt ? 'quest' : '', icon: ['gem', '#ffd040'], fn: () => v659CapMsg(amt) }); });
function v659CapMsg(amt) { const P = G.P; if (P.gold < amt) { typeText(L2('No llevas tanto oro.', 'You don\'t carry that much gold.')); return; }
  typeText(L2('¿Qué mensaje le dejas a tu yo del futuro?', 'What message do you leave for your future self?'));
  setOpts(V659_MSG.map((m, i) => ({ label: '✉ ' + m, icon: ['book'], fn: () => { if (P.gold < amt) return; P.gold -= amt; const S = V659();
    S.cap = { gold: amt, msg: i, d: calDay(), open: calDay() + 7, lv: P.lv, lk: typeof v658LookIdx === 'function' ? v658LookIdx() : null }; markDirty(true); sfx('quest');
    burst(P.x, P.y, 14, { sp: 40, up: 40, g: 80, life: 0.7, c: ['#8a6a3a', '#c8a070'] }); typeText(L2('Enterrada bajo el roble. Vuelve dentro de 7 días y la abriremos juntas.', 'Buried under the oak. Come back in 7 days and we will open it together.'));
    setOpts([{ label: L2('Adiós', 'Goodbye'), fn: closeDialog, cls: 'bye' }]); } })).concat([{ label: L2('Mejor no', 'Never mind'), fn: closeDialog, cls: 'bye' }])); }
function v659CapOpen() { const P = G.P, S = V659(), C = S.cap; if (!C) return; const g = Math.round(C.gold * 1.5); P.gold += g; S.cap = null; S.capN = (S.capN || 0) + 1; markDirty(true); sfx('questdone');
  burst(P.x, P.y - 20, 30, { sp: 70, up: 90, g: 40, life: 1.2, c: ['#ffd040', '#ffffff', '#ff8ab0'] });
  typeText(L2('Día ', 'Day ') + (C.d + 1) + L2(', nivel ', ', level ') + C.lv + ': «' + V659_MSG[C.msg | 0] + '» ' + L2('Hoy eres nivel ', 'Today you are level ') + P.lv + '. +' + fmt(g) + L2(' de oro.', ' gold.'));
  try { const L = C.lk != null && (P.heroLooks || [])[C.lk]; if (L && typeof v658DrawLook === 'function') { const c = $('#dport'); if (c) v658DrawLook(c, L); } } catch (e) { } }

// ---------- Mapa, Lupa ----------
if (typeof MAPC !== 'undefined') MAPC.act659 = ['Actividades', 'Activities', '#7ae0ff', 'star'];
hookAfter('worldPOI', out => { if (!Array.isArray(out)) return; const A = (k, t) => out.push({ c: 'act659', x: V659_AT[k][0], y: V659_AT[k][1], t });
  A('mercado', '🏮 ' + L2('Mercado nocturno (20:00-2:00)', 'Night market (20:00-2:00)')); A('huevos', '🥚 ' + L2('Búsqueda de huevos', 'Egg hunt')); A('arco', '🏹 ' + L2('Tiro con arco', 'Archery'));
  A('trineo', '🛷 ' + L2('Carrera de trineos', 'Sled race')); A('defensa', '🛡 ' + L2('Defensa del pueblo', 'Village defence')); A('laberinto', '🌀 ' + L2('Laberinto que cambia', 'Shifting maze'));
  A('astro', '🌠 ' + L2('Astrónomo (de noche)', 'Astronomer (at night)')); A('capsula', '💌 ' + L2('Cápsula del tiempo', 'Time capsule')); });
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_act659', '🎪 ' + L2('Actividades del mundo', 'World activities'), () => [
  L2('🏮 Mercado nocturno: de 20:00 a 2:00 junto a la plaza de Albor, tres puestos (comida, materiales y pociones) con 2 ofertas cada uno al 60 % del precio. Cambian cada noche; cada oferta se compra una vez.', '🏮 Night market: 20:00-2:00 by the Albor square, three stalls (food, materials and potions) with 2 offers each at 60% of the price. They change every night; each offer can be bought once.'),
  L2('🥚 Búsqueda de huevos (Pía, Albor): 8 huevos por el valle en 3 minutos; el radar dice frío/tibio/caliente. La primera del día da oro por huevo y, con los 8, un Huevo dorado.', '🥚 Egg hunt (Pía, Albor): 8 eggs around the valley in 3 minutes; the radar says cold/warm/hot. The first of the day gives gold per egg and, with all 8, a Golden egg.'),
  L2('🏹 Tiro con arco (Maestra Ilse, norte de Albor): 10 flechas a dianas a 3 distancias que se mueven. La mira va y viene: toca ⚔ al pasar por la diana y ten en cuenta el viento. Las 3 primeras tandas del día dan premio completo.', '🏹 Archery (Master Ilse, north of Albor): 10 arrows at moving targets at 3 distances. The sight sweeps: tap ⚔ as it crosses the target and mind the wind. The first 3 rounds of the day give the full prize.'),
  L2('🛷 Carrera de trineos (Bjorn, junto a la piedra de viaje de los Picos Helados): pista de nieve contra 3 rivales. Joystick para girar, hielo azul acelera, nieve amontonada frena y ⚔ salta los troncos.', '🛷 Sled race (Bjorn, by the Frozen Peaks waystone): snow track against 3 rivals. Joystick to steer, blue ice speeds up, snow piles slow down and ⚔ jumps over logs.'),
  L2('🛡 Defensa del pueblo (Capitana Brea, puerta sur de Albor): 4 oleadas de monstruos de tu nivel van a por el portón. Si te ven o les pegas, pelean contigo. Si el portón llega a 0, pierdes.', '🛡 Village defence (Captain Brea, south gate of Albor): 4 waves of monsters of your level go for the gate. If they see you or you hit them, they fight you. If the gate reaches 0, you lose.'),
  L2('🌀 Laberinto que cambia (Jardinero Tomé, Bosque Susurrante): llega al cofre del centro en 3 minutos; los muros se mueven cada 25 s. Cuanto antes llegues, más oro.', '🌀 Shifting maze (Gardener Tomé, Whispering Forest): reach the chest in the centre in 3 minutes; the walls move every 25 s. The faster you arrive, the more gold.'),
  L2('🌠 Estrellas fugaces: de noche, en el mundo, a veces cae una estrella cerca de ti; corre al brillo para coger el Fragmento estelar. El Astrónomo Celio (Albor, de noche) cambia 5 por un deseo: fortuna, sabiduría o salud.', '🌠 Shooting stars: at night, in the world, a star sometimes falls near you; run to the glow to take the Star fragment. Astronomer Celio (Albor, at night) trades 5 for a wish: fortune, wisdom or health.'),
  L2('💌 Cápsula del tiempo (Guardiana Orla, Albor): entierra 1.000, 10.000 o 100.000 de oro con un mensaje. A los 7 días la abres: el oro +50 %, tu mensaje y tu dibujo de aquel día.', '💌 Time capsule (Keeper Orla, Albor): bury 1,000, 10,000 or 100,000 gold with a message. After 7 days you open it: the gold +50%, your message and your drawing from that day.')], () => null]);
// la barra de un jefe del mundo no sigue en pantalla al entrar en la pista, el laberinto u otro mapa
hookAfter('setMap', () => { try { if (G.bossBar && G.bossBar.map && G.map && G.bossBar.map !== G.map.id) showBoss(null); } catch (e) { } });
