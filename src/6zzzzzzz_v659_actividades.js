// ================= 6.59 · Actividades nuevas, todas dentro del mapa =================
// De la lista de ideas que Sergio aprobó («las otras ideas sí»). Cada una con su mecánica propia, con joystick, ⚔ y
// NPCs en el mundo (nada de ventanas). Todas salen en Lupa › Sistemas y en el Mapa con su punto.
//  1) 🏮 Mercado nocturno (Albor, 20:00-2:00): los pilluelos roban farolillos y huyen de ti; atrápalos (6.61).
//  2) 🥚 Búsqueda de huevos (Albor, una vez al día): 8 huevos escondidos por el Valle; el radar dice frío/tibio/caliente.
//  3) 🏹 Tiro con arco (norte de Albor): 10 flechas, dianas a 3 distancias, viento y una mira que se mueve sola.
//  4) 🛷 Trineo sobre el lago helado (Picos Helados): carrerilla, sueltas el trineo y barres el hielo hasta la diana (6.61).
//  5) 🛡 Defensa del pueblo (puerta sur de Albor): 4 oleadas de monstruos van a por el portón; si cae, pierdes.
//  6) 🌀 Laberinto que cambia (Bosque Susurrante): los muros se mueven cada 25 s; llega al cofre del centro.
//  7) 🌠 Estrellas fugaces (de noche): cae un fragmento cerca; con 5, el astrónomo abre una lluvia de estrellas que botan y ruedan (6.61).
//  (6.61: la cápsula del tiempo se quitó por petición de Sergio; el oro enterrado se devuelve con el +50 % prometido.)
function V659() { const P = G.P; return P.v659 && typeof P.v659 === 'object' ? P.v659 : (P.v659 = {}); }
SAVEKEYS.push('v659');
const V659_AT = { mercado: [128, 153], huevos: [110, 143], arco: [119, 136], trineo: [187, 41], defensa: [118, 163], laberinto: [60, 152], astro: [104, 146] };
const v659Px = k => ({ x: V659_AT[k][0] * 16 + 8, y: V659_AT[k][1] * 16 + 8 });
const v659Night = () => { const h = hourNow(); return h >= 20 || h < 2; };
const v659Look = (g, hair, cols, hs) => LK({ g, hairStyle: hs || (g === 'f' ? 'long' : 'short'), hair: HAIRS[hair] || HAIRS.negro, main: pal(cols) });
NPCS.v659_mn0 = { n: L2('Tía Luma', 'Aunt Luma'), title: L2('Mercado nocturno · comida', 'Night market · food'), look: v659Look('f', 'castano', ['#5a1a10', '#8a2a1a', '#b8402a', '#d8603a', '#f08a5a']), lines: [L2('¡Brochetas recién hechas bajo los farolillos!', 'Fresh skewers under the lanterns!')], quests: [] };
NPCS.v659_mn1 = { n: L2('Mercader Ossi', 'Merchant Ossi'), title: L2('Mercado nocturno · materiales', 'Night market · materials'), look: v659Look('m', 'negro', ['#1a2a4a', '#2a3e6a', '#3a548a', '#5a72aa', '#7a92ca']), lines: [L2('Lo que de día cuesta el doble, de noche es una ganga.', 'What costs double by day is a bargain at night.')], quests: [] };
NPCS.v659_mn2 = { n: L2('Abuela Fen', 'Grandma Fen'), title: L2('Mercado nocturno · pociones', 'Night market · potions'), look: v659Look('f', 'gris', ['#2a1a3a', '#3e2a5a', '#5a3e7a', '#7a5a9a', '#9a7aba']), lines: [L2('Pociones de luna llena, querida.', 'Full-moon potions, dear.')], quests: [] };
NPCS.v659_huevos = { n: L2('Pía', 'Pía'), title: L2('Búsqueda de huevos', 'Egg hunt'), look: v659Look('f', 'rubio', ['#3a6a2a', '#4e8a3a', '#68aa4e', '#88c868', '#aae08a']), lines: [L2('¡Las gallinas del valle han escondido sus huevos otra vez!', 'The valley hens have hidden their eggs again!')], quests: [] };
NPCS.v659_arco = { n: L2('Maestra Ilse', 'Master Ilse'), title: L2('Tiro con arco', 'Archery'), look: v659Look('f', 'pelirrojo', ['#2a3a1a', '#3e5a26', '#567a34', '#709a46', '#90ba5e']), lines: [L2('Respira, mira el viento y suelta.', 'Breathe, read the wind and release.')], quests: [] };
NPCS.v659_trineo = { n: L2('Bjorn', 'Bjorn'), title: L2('Trineo sobre el lago', 'Sled on the lake'), look: v659Look('m', 'rubio', ['#5a1a1a', '#7a2626', '#9a3434', '#ba4a46', '#da6a5e']), lines: [L2('¡La pista está helada y rápida hoy!', 'The track is icy and fast today!')], quests: [] };
NPCS.v659_defensa = { n: L2('Capitana Brea', 'Captain Brea'), title: L2('Defensa del pueblo', 'Village defence'), look: v659Look('f', 'negro', ['#3a3a42', '#54545e', '#70707c', '#8e8e9a', '#b0b0ba']), lines: [L2('Si cae el portón, cae Albor.', 'If the gate falls, Albor falls.')], quests: [] };
NPCS.v659_lab = { n: L2('Jardinero Tomé', 'Gardener Tomé'), title: L2('Laberinto que cambia', 'Shifting maze'), look: v659Look('m', 'castano', ['#1a3a1a', '#265226', '#346a34', '#468a46', '#5eaa5e']), lines: [L2('Mi laberinto nunca es el mismo dos veces.', 'My maze is never the same twice.')], quests: [] };
NPCS.v659_astro = { n: L2('Astrónomo Celio', 'Astronomer Celio'), title: L2('Estrellas fugaces', 'Shooting stars'), look: v659Look('m', 'blanco', ['#10183a', '#1a2656', '#263874', '#384e94', '#5068b4']), lines: [L2('Cada estrella que cae trae un deseo.', 'Every falling star brings a wish.')], quests: [] };
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
  for (const [id, k] of [['v659_huevos', 'huevos'], ['v659_arco', 'arco'], ['v659_trineo', 'trineo'], ['v659_defensa', 'defensa'], ['v659_lab', 'laberinto']]) v75Temp(M, id, v659Px(k).x, v659Px(k).y, true);
} catch (e) { errOnce('v659 npcs', e); } });

// ---------- 1) MERCADO NOCTURNO: LOS PILLUELOS ----------
// 6.61 (Sergio: «gameplay real, no una interfaz»): ya no se compra desde el diálogo. Cinco pilluelos roban farolillos
// de los puestos y huyen de ti entre los puestos y la gente: corren más cuanto más te acercas y se cansan si los
// persigues mucho rato (entonces van despacio). Tócalos para recuperar el farolillo. 75 s. Esto no existía: ningún
// otro juego tiene NPCs que huyan de ti.
for (let i = 0; i < 5; i++) NPCS['v659_pil' + i] = { n: L2('Pilluelo', 'Little rascal'), title: L2('Ladrón de farolillos', 'Lantern thief'), look: v659Look(i % 2 ? 'f' : 'm', ['castano', 'negro', 'rubio', 'pelirrojo', 'castano'][i], [['#3a2a1a', '#54402a', '#70583a', '#8e7450', '#ae9268'], ['#2a2a3a', '#3e3e54', '#56566e', '#70708a', '#8e8ea8'], ['#3a4a1a', '#526a26', '#6c8834', '#88a64a', '#a6c466'], ['#4a1a2a', '#6a263e', '#8a3454', '#aa4a6e', '#c8668a'], ['#1a3a3a', '#265454', '#346e6e', '#468a8a', '#5ea8a8']][i]), lines: [L2('¡No me pillas!', 'You can\'t catch me!')], quests: [] };
const v659Mc = () => ({ x: (V659_AT.mercado[0] + 3) * 16 + 8, y: V659_AT.mercado[1] * 16 + 8 });
DLG_HOOKS.push((npc, opts) => { if (!npc || !/^v659_mn\d$/.test(npc.id) || ACT.k === 'pil') return; const S = V659(); opts.unshift({ label: '🏮 ' + L2('¡Nos roban los farolillos! Atrapa a los pilluelos', 'They are stealing our lanterns! Catch the rascals') + (S.pilD === calDay() ? L2(' (hoy ya: premio pequeño)', ' (done today: small prize)') : ''), cls: 'quest', icon: ['run'], fn: () => { closeDialog(); v659PilStart(); } }); });
function v659PilStart() { if (actBusy()) return; const c = v659Mc(), M = G.world, list = [];
  for (let i = 0; i < 5; i++) { const p = v659Free(M, c.x + (Math.random() - 0.5) * 160, c.y + (Math.random() - 0.5) * 100, 4) || c; const e = spawnNPC('v659_pil' + i, p.x, p.y, 'world', { face: 'down', wander: 0 }); if (e) { e.scene = 1; e.actTmp = 1; list.push({ e, st: 1, tired: 0, got: 0 }); } }
  Object.assign(ACT, { k: 'pil', t: 0, list, n: 0 }); banner('🏮 ' + L2('¡Al ladrón!', 'Stop, thief!'), L2('Cinco pilluelos con farolillos. Huyen de ti: acorrálalos contra los puestos. Cuando se cansan van despacio.', 'Five rascals with lanterns. They run from you: corner them against the stalls. When they get tired they slow down.')); }
V33_TICKS.push(dt => { if (ACT.k !== 'pil') return; dt = Math.min(0.05, dt || 0.016); const P = G.P, A = ACT, M = G.world, c = v659Mc(); if (G.map !== M || P.dead) { actClean(); actEnd(); return; } A.t += dt;
  for (const q of A.list) { if (q.got) continue; const e = q.e, dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy) || 1;
    if (d < 16) { q.got = 1; A.n++; e.remove = true; sfx('coin'); floatText(e.x, e.y - 40, '🏮 ' + A.n + '/5', '#ffd040'); burst(e.x, e.y - 20, 12, { sp: 50, up: 50, g: 60, life: 0.7, c: ['#ffb030', '#e83a2a', '#ffffff'] }); continue; }
    if (q.tired > 0) q.tired -= dt; else if (d < 90) { q.st -= dt * 0.22; if (q.st <= 0) { q.tired = 2.5; q.st = 1; floatText(e.x, e.y - 40, '😮‍💨', '#ffffff'); } } else q.st = Math.min(1, q.st + dt * 0.1);
    let vx = 0, vy = 0; if (d < 150) { vx = dx / d; vy = dy / d; } else { vx = Math.sin(G.t + e.x) * 0.4; vy = Math.cos(G.t * 0.8 + e.y) * 0.4; }
    const hx = c.x - e.x, hy = c.y - e.y, hd = Math.hypot(hx, hy); if (hd > 200) { vx += hx / hd * 1.2; vy += hy / hd * 1.2; }   // no se van lejos del mercado
    const L = Math.hypot(vx, vy) || 1, sp = q.tired > 0 ? 28 : d < 70 ? 92 : 62, bx = e.x, by = e.y; moveEnt(M, e, vx / L * sp * dt, vy / L * sp * dt);
    if (Math.abs(e.x - bx) + Math.abs(e.y - by) < 0.2 * sp * dt) { moveEnt(M, e, -vy / L * sp * dt, vx / L * sp * dt); }   // esquina: prueba de lado
    e.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : (vy > 0 ? 'down' : 'up'); e.anim = 'walk'; e.af = Math.floor(G.t * (q.tired > 0 ? 5 : 10)) % 4; }
  mgHud(`🏮 ${A.n}/5 · ⏱ ${Math.max(0, Math.ceil(75 - A.t))}s`);
  if (A.n >= 5 || A.t >= 75) { const S = V659(), first = S.pilD !== calDay(); S.pilD = calDay(); const g = first ? v659Gold(250, 20) * A.n + (A.n >= 5 ? v659Gold(1000, 20) : 0) : 80 * A.n; P.gold += g; if (A.n >= 5 && first) giveItem('v659_huevo_oro', 1, true);
    actClean(); actEnd(); markDirty(true); sfx(A.n >= 5 ? 'questdone' : 'coin'); banner('🏮 ' + A.n + L2('/5 farolillos recuperados', '/5 lanterns recovered'), '+' + fmt(g) + L2(' oro', ' gold') + (A.n >= 5 && first ? L2(' · los puestos te regalan un Huevo dorado', ' · the stalls give you a Golden egg') : '')); } });
WORLD_DRAW.push((cx, cy) => { if (G.map !== G.world) return; if (ACT.k === 'pil') for (const q of ACT.list) { if (q.got) continue; const x = q.e.x - cx + 7, y = q.e.y - cy - 30; ctx.fillStyle = `rgba(255,170,60,${(0.35 + 0.2 * Math.sin(G.t * 6)).toFixed(2)})`; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#e83a2a'; ctx.fillRect(x - 2, y - 3, 5, 6); }
  if (!v659Night()) return; const x0 = V659_AT.mercado[0] * 16 - 8 - cx, y0 = V659_AT.mercado[1] * 16 - 26 - cy; if (x0 < -200 || x0 > VW + 60 || y0 < -80 || y0 > VH + 60) return;
  ctx.strokeStyle = '#3a2410'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + 80, y0 + 10, x0 + 160, y0); ctx.stroke();
  const left = ACT.k === 'pil' ? ACT.list.filter(q => !q.got).length : 0;
  for (let k = 0; k <= 8; k++) { if (k < left) continue; const t = k / 8, x = x0 + 160 * t, y = y0 + 10 * 4 * t * (1 - t) * 0.5 + 3, a = 0.55 + 0.25 * Math.sin(G.t * 3 + k); ctx.fillStyle = `rgba(255,${150 + (k % 3) * 30},60,${a.toFixed(2)})`; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); ctx.fillStyle = ['#e83a2a', '#ffb030', '#ff6a8a'][k % 3]; ctx.fillRect(x - 2, y - 3, 5, 6); } });

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

// ---------- 4) TRINEO SOBRE EL LAGO HELADO (mapa propio) ----------
// 6.61: ya no es una carrera cuesta abajo (eso ya lo hacen el sandboard y las carreras). Ahora es de puntería con
// inercia: eliges carril con el joystick, ⚔ para echar a correr y cada toque de ⚔ empuja más fuerte; en la línea azul
// sueltas el trineo, que se desliza solo sobre el hielo. Corres detrás y ⚔ barre el hielo para que frene menos.
// Tres trineos; los que ya están en el hielo se pueden golpear. Puntos según lo cerca que queden de la diana.
const V659_LG = { w: 30, h: 44, x0: 4, x1: 25, y0: 4, y1: 33, rel: 34, tx: 15, ty: 9 };
function v659MakeLago() { const id = 'v659_lago', { w, h } = V659_LG, N = w * h; G.ents = G.ents.filter(e => e.map !== id);
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.SNOW), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'field', I: (x, y) => y * w + x, v659: 1 };
  for (let y = 0; y < h; y++) for (const x of [0, 1, w - 2, w - 1]) M.ter[y * w + x] = T.STONE; for (let x = 0; x < w; x++) for (const y of [0, 1, h - 1]) M.ter[y * w + x] = T.STONE;
  M.drawExtra = v659LagoGround; M.exit = { x: -9, y: -9 }; initMapObjs(M); M.wdist = null; G.maps[id] = M; return M; }
hookAround('makeInterior', (next, id, ...a) => id === 'v659_lago' ? v659MakeLago() : id === 'v659_lab' ? v659MakeLab() : next(id, ...a));
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_trineo') return; const S = V659(); opts.unshift({ label: '🛷 ' + L2('Trineo sobre el lago helado', 'Sled on the frozen lake') + (S.trBest ? ' · ' + L2('récord ', 'best ') + S.trBest : ''), cls: 'quest', icon: ['snow', '#e0f8ff'], fn: () => { closeDialog(); v659TrStart(); } }); });
const v659LgPx = (tx, ty) => ({ x: tx * 16 + 8, y: ty * 16 + 8 });
function v659TrStart() { if (actBusy()) return; const P = G.P; if (P.mount) { P.mount = null; calcStats(P); if (typeof mountBtn === 'function') mountBtn(); }
  P.retX = P.x; P.retY = P.y + 20; transition(() => { P.inside = 'v659_lago'; const M = v659MakeLago(), s = v659LgPx(15, 40); setMap(M, s.x, s.y, 'up');
    Object.assign(ACT, { k: 'trineo', t: 0, ph: 'aim', left: 3, sleds: [], cur: null, v: 0, sweep: 0, onAtk: () => v659TrAtk() });
    banner('🛷 ' + L2('Lago helado', 'Frozen lake'), L2('Joystick: carril. ⚔: correr y empujar. En la línea azul sueltas el trineo. Corre detrás y toca ⚔ para barrer.', 'Joystick: lane. ⚔: run and push. At the blue line you let go. Run behind it and tap ⚔ to sweep.')); }); }
function v659TrAtk() { const A = ACT; if (A.k !== 'trineo') return true; const P = G.P;
  if (A.ph === 'aim') { A.ph = 'run'; A.v = 40; A.cur = { x: P.x, y: P.y - 12, vx: 0, vy: 0, stop: 0 }; sfx('ui'); }
  else if (A.ph === 'run') { A.v = Math.min(270, A.v + 26); part(P.x, P.y + 4, { vz: 20, vx: (Math.random() - 0.5) * 30, g: 80, life: 0.4, c: '#f4f8ff', s: 2 }); }
  else if (A.ph === 'slide') { A.sweep = 0.35; part(P.x + (Math.random() - 0.5) * 10, P.y - 14, { vz: 10, vx: (Math.random() - 0.5) * 40, g: 60, life: 0.35, c: '#dff4ff', s: 2 }); }
  return true; }
function v659TrScore(s) { const t = v659LgPx(V659_LG.tx, V659_LG.ty), d = Math.hypot(s.x - t.x, s.y - t.y); return d < 16 ? 10 : d < 32 ? 6 : d < 48 ? 3 : 0; }
V33_TICKS.push(dt => { if (ACT.k !== 'trineo') return; dt = Math.min(0.05, dt || 0.016); const P = G.P, A = ACT, M = G.map, L = V659_LG; if (!M || M.id !== 'v659_lago' || P.dead) { actEnd(); return; } A.t += dt; A.sweep = Math.max(0, A.sweep - dt);
  const s0 = v659LgPx(15, 40);
  if (A.ph === 'aim') { P.x = Math.max(6 * 16, Math.min(24 * 16, P.x + (inp.jx || 0) * 70 * dt)); P.y = s0.y; P.dir = 'up'; }
  else if (A.ph === 'run') { P.y -= A.v * dt; P.x = Math.max(5 * 16, Math.min(25 * 16, P.x + (inp.jx || 0) * 40 * dt)); P.dir = 'up'; P.anim = 'walk'; P.af = Math.floor(G.t * 10) % 4; A.cur.x = P.x; A.cur.y = P.y - 12;
    if (P.y <= L.rel * 16) { A.ph = 'slide'; A.cur.vx = (inp.jx || 0) * 30; A.cur.vy = -A.v; sfx('ui'); floatText(P.x, P.y - 40, L2('¡Suelta!', 'Let go!'), '#9ad8ff'); } }
  else if (A.ph === 'slide') { const c = A.cur, sp = Math.hypot(c.vx, c.vy), dec = A.sweep > 0 ? 22 : 58;
    if (sp > 0) { const ns = Math.max(0, sp - dec * dt); c.vx *= ns / sp; c.vy *= ns / sp; } c.x += c.vx * dt; c.y += c.vy * dt;
    for (const o of A.sleds) { const dx = o.x - c.x, dy = o.y - c.y, d = Math.hypot(dx, dy); if (d > 0 && d < 14) { const nx = dx / d, ny = dy / d, pv = c.vx * nx + c.vy * ny; if (pv > 0) { o.vx = (o.vx || 0) + pv * nx * 0.9; o.vy = (o.vy || 0) + pv * ny * 0.9; c.vx -= pv * nx * 0.9; c.vy -= pv * ny * 0.9; sfx('hurt'); } } }
    if (c.x < (L.x0 + 0.5) * 16 || c.x > (L.x1 + 0.5) * 16) { c.vx = -c.vx * 0.4; c.x = Math.max((L.x0 + 0.5) * 16, Math.min((L.x1 + 0.5) * 16, c.x)); }
    const out = c.y < L.y0 * 16; P.x += (c.x - P.x) * Math.min(1, dt * 6); P.y += (c.y + 24 - P.y) * Math.min(1, dt * 5); P.dir = 'up'; P.anim = A.sweep > 0 ? 'attack' : 'walk'; P.af = Math.floor(G.t * 10) % 4;
    if (Math.hypot(c.vx, c.vy) < 3 || out) { c.stop = 1; c.out = out; A.sleds.push(c); A.cur = null; A.left--; const pts = out ? 0 : v659TrScore(c); floatText(c.x, c.y - 30, out ? L2('¡Fuera!', 'Out!') : pts ? '+' + pts : '0', pts >= 10 ? '#ffd040' : pts ? '#ffffff' : '#ff8a8a'); if (pts) sfx('coin');
      if (A.left > 0) { A.ph = 'aim'; P.x = s0.x; P.y = s0.y; } else A.ph = 'end'; } }
  for (const o of A.sleds) { if (!o.vx && !o.vy) continue; const sp = Math.hypot(o.vx, o.vy), ns = Math.max(0, sp - 58 * dt); if (ns <= 0) { o.vx = 0; o.vy = 0; continue; } o.vx *= ns / sp; o.vy *= ns / sp; o.x += o.vx * dt; o.y += o.vy * dt; if (o.y < L.y0 * 16) o.out = 1; }
  const score = A.sleds.reduce((a, o) => a + (o.out ? 0 : v659TrScore(o)), 0);
  mgHud(`🛷 ${score} ${L2('puntos', 'points')} · ${A.left} ${L2('trineos', 'sleds')} · ${A.ph === 'aim' ? L2('elige carril y ⚔', 'pick a lane and ⚔') : A.ph === 'run' ? L2('¡⚔ para empujar!', '⚔ to push!') : A.ph === 'slide' ? L2('⚔ barre el hielo', '⚔ sweeps the ice') : ''}`);
  if (A.ph === 'end' && A.sleds.every(o => !o.vx && !o.vy)) { const S = V659(), d = calDay(), first = S.trD !== d; S.trD = d; const rec = score > (S.trBest || 0); if (rec) S.trBest = score;
    const g = first ? Math.round(v659Gold(300, 8) * score / 3) : 40 * score; P.gold += g; actEnd(); markDirty(true); sfx(score >= 20 ? 'questdone' : 'coin');
    banner('🛷 ' + score + L2(' puntos', ' points') + (rec ? L2(' · ¡récord!', ' · new best!') : ''), '+' + fmt(g) + L2(' oro', ' gold')); setTimeout(() => exitInterior(), 1800); } });
hookAround('updatePlayer', (next, dt, ...a) => { if (ACT.k !== 'trineo' && ACT.k !== 'arco') return next(dt, ...a); const P = G.P, x = P.x, y = P.y, d = P.dir; const r = next(dt, ...a); P.x = x; P.y = y; P.dir = d; return r; });
// el hielo, la diana y la línea van en el suelo (M.drawExtra, debajo de los personajes); los trineos encima
function v659LagoGround(cx, cy) { const L = V659_LG;
  ctx.fillStyle = 'rgba(150,205,240,.55)'; ctx.fillRect(L.x0 * 16 - cx, L.y0 * 16 - cy, (L.x1 - L.x0 + 1) * 16, (L.y1 - L.y0 + 1) * 16);
  for (let k = 0; k < 14; k++) { const x = (L.x0 + 1 + (k * 7) % (L.x1 - L.x0 - 1)) * 16 - cx, y = (L.y0 + 2 + (k * 5) % (L.y1 - L.y0 - 2)) * 16 - cy; ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x, y, 10, 1); }
  const t = v659LgPx(L.tx, L.ty); for (const [r, col] of [[48, '#3a6ad0'], [32, '#f4f8ff'], [16, '#e83a3a'], [5, '#f4f8ff']]) { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(t.x - cx, t.y - cy, r, r * 0.8, 0, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#3a8ad8'; ctx.fillRect(L.x0 * 16 - cx, L.rel * 16 - cy, (L.x1 - L.x0 + 1) * 16, 3);
}
WORLD_DRAW.push((cx, cy) => { if (!G.map || G.map.id !== 'v659_lago') return; const A = ACT.k === 'trineo' ? ACT : null;
  if (!A) return; const sled = (s, col) => { const x = s.x - cx, y = s.y - cy; ctx.fillStyle = col; ctx.fillRect(x - 7, y - 5, 14, 10); ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x - 8, y + 5, 3, 2); ctx.fillRect(x + 5, y + 5, 3, 2); ctx.fillRect(x - 8, y - 7, 16, 2); };
  A.sleds.forEach(s => sled(s, s.out ? '#7a6a6a' : '#c8402a')); if (A.cur) sled(A.cur, '#e8602a'); });

// ---------- 5) DEFENSA DEL PUEBLO ----------
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_defensa' || ACT.k === 'defensa') return; const S = V659(); opts.unshift({ label: '🛡 ' + L2('Defender el portón (4 oleadas)', 'Defend the gate (4 waves)') + (S.defD === calDay() ? L2(' (hoy ya: premio pequeño)', ' (done today: small prize)') : ''), cls: 'quest', icon: ['shield', '#9ad8ff'], fn: () => { closeDialog(); v659DefStart(); } }); });
const v659Gate = () => { const c = v659Px('defensa'); return { x: c.x, y: c.y + 40 }; };
function v659DefMobs() { const L = v659Lv(); let ids = Object.keys(MOBS).filter(k => { const m = MOBS[k]; return m && Array.isArray(m.lv) && m.lv[0] <= L && m.lv[1] >= L && m.art && !m.noSpawn; });
  if (!ids.length) ids = Object.keys(MOBS).filter(k => MOBS[k] && Array.isArray(MOBS[k].lv) && MOBS[k].lv[0] <= Math.max(5, L)).slice(-6); return ids.slice(0, 8); }
// 6.61: lo propio de la defensa: con ⚔ junto al portón, si ningún monstruo lo está golpeando, lo reparas (+4 % por toque)
function v659DefAtk() { const P = G.P, g = v659Gate(); if (Math.hypot(P.x - g.x, P.y - (g.y + 10)) > 40) return false; if (G.ents.some(e => e.v659def && !e.dying && Math.hypot(e.x - g.x, e.y - g.y) < 60)) return false;
  if (ACT.hp >= 100) return false; ACT.hp = Math.min(100, ACT.hp + 4); sfx('ui'); part(g.x + (Math.random() - 0.5) * 30, g.y - 14, { vz: 30, vx: (Math.random() - 0.5) * 40, g: 90, life: 0.5, c: '#ffd080', s: 2 }); floatText(g.x, g.y - 34, '🔨 ' + Math.ceil(ACT.hp) + '%', '#ffe0a0'); return true; }
function v659DefStart() { if (actBusy()) return; Object.assign(ACT, { k: 'defensa', t: 0, wave: 0, hp: 100, next: 3, ids: v659DefMobs(), onAtk: () => v659DefAtk() }); banner('🛡 ' + L2('¡Defiende Albor!', 'Defend Albor!'), L2('Los monstruos van a por el portón. Si llegan, lo golpean. Entre golpe y golpe, ⚔ junto al portón lo repara. Aguanta 4 oleadas.', 'Monsters go for the gate. If they reach it, they hit it. Between hits, ⚔ next to the gate repairs it. Hold out for 4 waves.')); }
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
hookAfter('startGame', () => { try { const P = G.P; if (P && (P.inside === 'v659_lago' || P.inside === 'v659_pista' || P.inside === 'v659_lab')) { const k = P.inside !== 'v659_lab' ? 'trineo' : 'laberinto', c = v659Px(k); P.inside = null; setMap(G.world, c.x, c.y + 24, 'down'); } } catch (e) { errOnce('v659 carga', e); } });

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
// 6.61: el astrónomo ya no da deseos desde el diálogo. Con 5 fragmentos abre una LLUVIA DE ESTRELLAS de 40 s: caen
// estrellas alrededor que, al tocar el suelo, botan y ruedan; persíguelas antes de que se apaguen (6 s).
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v659_astro' || ACT.k === 'lluvia') return; const n = countItem('v659_frag');
  opts.unshift({ label: '🌠 ' + L2('Abrir una lluvia de estrellas (5 fragmentos)', 'Open a meteor shower (5 fragments)') + ' · ' + n + '/5', cls: n >= 5 ? 'quest' : '', icon: ['gem', '#9af0ff'], fn: () => { if (countItem('v659_frag') < 5) { typeText(L2('Necesito 5 fragmentos estelares. Caen de noche cerca de ti, en cualquier parte del mundo.', 'I need 5 star fragments. They fall at night near you, anywhere in the world.')); return; } if (actBusy()) return; takeItem('v659_frag', 5); closeDialog(); v659RainStart(); } }); });
function v659RainStart() { Object.assign(ACT, { k: 'lluvia', t: 0, next: 0, stars: [], n: 0 }); banner('🌠 ' + L2('¡Lluvia de estrellas!', 'Meteor shower!'), L2('Las estrellas botan y ruedan al caer. ¡Atrapa todas las que puedas en 40 segundos!', 'The stars bounce and roll when they land. Catch as many as you can in 40 seconds!')); sfx('quest'); }
V33_TICKS.push(dt => { if (ACT.k !== 'lluvia') return; dt = Math.min(0.05, dt || 0.016); const P = G.P, A = ACT, M = G.map; if (M !== G.world || P.dead) { actEnd(); return; } A.t += dt; A.next -= dt;
  if (A.next <= 0 && A.t < 40) { A.next = 0.8; const p = v659Free(M, P.x + (Math.random() - 0.5) * 300, P.y + (Math.random() - 0.5) * 200, 4); if (p) A.stars.push({ x: p.x, y: p.y, sx: p.x - 60 + Math.random() * 120, sy: p.y - 160, f: 0, life: 0, vx: 0, vy: 0, z: 0, vz: 0 }); }
  for (const s of A.stars) { if (s.got || s.dead) continue;
    if (s.f < 1) { s.f += dt * 1.6; if (s.f >= 1) { const a = Math.random() * 6.28, v = 60 + Math.random() * 60; s.vx = Math.cos(a) * v; s.vy = Math.sin(a) * v; s.vz = 90; G.shake = Math.max(G.shake, 1); } continue; }
    s.life += dt; if (s.life > 6) { s.dead = 1; continue; } s.vz -= 300 * dt; s.z = Math.max(0, s.z + s.vz * dt); if (s.z === 0 && s.vz < 0) s.vz = -s.vz * 0.5;
    const nx = s.x + s.vx * dt, ny = s.y + s.vy * dt; if (blockedFor(M, Math.floor(nx / 16), Math.floor(s.y / 16), 0)) s.vx = -s.vx; else s.x = nx; if (blockedFor(M, Math.floor(s.x / 16), Math.floor(ny / 16), 0)) s.vy = -s.vy; else s.y = ny; s.vx *= 1 - dt * 0.4; s.vy *= 1 - dt * 0.4;
    if (Math.hypot(P.x - s.x, P.y - s.y) < 18) { s.got = 1; A.n++; sfx('coin'); burst(s.x, s.y - 6, 10, { sp: 50, up: 60, g: 30, life: 0.7, c: ['#9af0ff', '#ffffff', '#ffe080'] }); floatText(s.x, s.y - 30, '★ ' + A.n, '#ffe080'); } }
  mgHud(`🌠 ★ ${A.n} · ⏱ ${Math.max(0, Math.ceil(40 - A.t))}s`);
  if (A.t >= 46) { const g = v659Gold(300, 12) * A.n, x = Math.round(xpToNext(P.lv) * 0.01 * A.n); P.gold += g; gainXp(x); if (A.n >= 30) giveItem('v659_frag', 2, true); actEnd(); markDirty(true); sfx('questdone'); banner('🌠 ★ ' + A.n, '+' + fmt(g) + L2(' oro · +', ' gold · +') + fmt(x) + ' XP' + (A.n >= 30 ? L2(' · 2 fragmentos', ' · 2 fragments') : '')); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'lluvia' || G.map !== G.world) return; for (const s of ACT.stars) { if (s.got || s.dead) continue;
  if (s.f < 1) { const x = s.sx + (s.x - s.sx) * s.f - cx, y = s.sy + (s.y - s.sy) * s.f - cy; ctx.strokeStyle = 'rgba(255,250,210,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - (s.x - s.sx) * 0.15, y - (s.y - s.sy) * 0.15); ctx.lineTo(x, y); ctx.stroke(); continue; }
  const x = s.x - cx, y = s.y - cy - s.z, a = s.life > 4.5 ? Math.max(0.2, 1 - (s.life - 4.5) / 1.5) : 1; ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(s.x - cx, s.y - cy + 3, 5, 2, 0, 0, 7); ctx.fill();
  ctx.fillStyle = `rgba(255,240,150,${a.toFixed(2)})`; ctx.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 3 : 7, an = k / 10 * Math.PI * 2 + G.t * 3; ctx.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r); } ctx.closePath(); ctx.fill(); } });

// ---------- 8) (6.61) sin cápsula del tiempo: se devuelve el oro enterrado ----------
hookAfter('startGame', () => { try { const S = G.P && G.P.v659; if (!S || !S.cap) return; const g = Math.round((S.cap.gold || 0) * 1.5); G.P.gold += g; S.cap = null; markDirty(true);
  setTimeout(() => toast('💌 ' + L2('La cápsula del tiempo ya no existe: te devolvemos lo enterrado con el +50 % (', 'The time capsule no longer exists: you get back what you buried with the +50% (') + fmt(g) + L2(' de oro).', ' gold).'), 'info', 8), 1500); } catch (e) { } });

// ---------- Mapa, Lupa ----------
if (typeof MAPC !== 'undefined') MAPC.act659 = ['Actividades', 'Activities', '#7ae0ff', 'star'];
hookAfter('worldPOI', out => { if (!Array.isArray(out)) return; const A = (k, t) => out.push({ c: 'act659', x: V659_AT[k][0], y: V659_AT[k][1], t });
  A('mercado', '🏮 ' + L2('Mercado nocturno: pilluelos (20:00-2:00)', 'Night market: rascals (20:00-2:00)')); A('huevos', '🥚 ' + L2('Búsqueda de huevos', 'Egg hunt')); A('arco', '🏹 ' + L2('Tiro con arco', 'Archery'));
  A('trineo', '🛷 ' + L2('Trineo sobre el lago helado', 'Sled on the frozen lake')); A('defensa', '🛡 ' + L2('Defensa del pueblo', 'Village defence')); A('laberinto', '🌀 ' + L2('Laberinto que cambia', 'Shifting maze'));
  A('astro', '🌠 ' + L2('Astrónomo: lluvia de estrellas (de noche)', 'Astronomer: meteor shower (at night)')); });
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_act659', '🎪 ' + L2('Actividades del mundo', 'World activities'), () => [
  L2('🏮 Pilluelos del mercado nocturno (20:00-2:00, junto a la plaza de Albor): habla con un puesto y cinco pilluelos huyen con farolillos. Huyen de ti; si los persigues mucho se cansan y van despacio. Acorrálalos contra los puestos y tócalos. 75 s.', '🏮 Night market rascals (20:00-2:00, by the Albor square): talk to a stall and five rascals run off with lanterns. They flee from you; if you chase them long they get tired and slow down. Corner them against the stalls and touch them. 75 s.'),
  L2('🥚 Búsqueda de huevos (Pía, Albor): 8 huevos por el valle en 3 minutos; el radar dice frío/tibio/caliente. La primera del día da oro por huevo y, con los 8, un Huevo dorado.', '🥚 Egg hunt (Pía, Albor): 8 eggs around the valley in 3 minutes; the radar says cold/warm/hot. The first of the day gives gold per egg and, with all 8, a Golden egg.'),
  L2('🏹 Tiro con arco (Maestra Ilse, norte de Albor): 10 flechas a dianas a 3 distancias que se mueven. La mira va y viene: toca ⚔ al pasar por la diana y ten en cuenta el viento.', '🏹 Archery (Master Ilse, north of Albor): 10 arrows at moving targets at 3 distances. The sight sweeps: tap ⚔ as it crosses the target and mind the wind.'),
  L2('🛷 Trineo sobre el lago helado (Bjorn, piedra de viaje de los Picos Helados): joystick para el carril, ⚔ para correr y cada toque empuja más; en la línea azul sueltas el trineo. Corre detrás y toca ⚔ para barrer el hielo (frena menos). 3 trineos; se pueden golpear entre sí. Diana: 10, 6 o 3 puntos.', '🛷 Sled on the frozen lake (Bjorn, Frozen Peaks waystone): joystick for the lane, ⚔ to run and each tap pushes harder; at the blue line you let go. Run behind and tap ⚔ to sweep the ice (it slows less). 3 sleds; they can knock each other. Target: 10, 6 or 3 points.'),
  L2('🛡 Defensa del pueblo (Capitana Brea, puerta sur de Albor): 4 oleadas de monstruos de tu nivel van a por el portón. Entre golpe y golpe, ⚔ junto al portón lo repara. Si llega a 0, pierdes.', '🛡 Village defence (Captain Brea, south gate of Albor): 4 waves of monsters of your level go for the gate. Between hits, ⚔ next to the gate repairs it. If it reaches 0, you lose.'),
  L2('🌀 Laberinto que cambia (Jardinero Tomé, Bosque Susurrante): llega al cofre del centro en 3 minutos; los muros se mueven cada 25 s. Cuanto antes llegues, más oro.', '🌀 Shifting maze (Gardener Tomé, Whispering Forest): reach the chest in the centre in 3 minutes; the walls move every 25 s. The faster you arrive, the more gold.'),
  L2('🌠 Estrellas fugaces: de noche, en el mundo, a veces cae una estrella cerca de ti; corre al brillo para coger el Fragmento estelar. Con 5, el Astrónomo Celio (Albor, de noche) abre una lluvia de estrellas de 40 s: las estrellas botan y ruedan al caer; atrapa todas las que puedas.', '🌠 Shooting stars: at night, in the world, a star sometimes falls near you; run to the glow to take the Star fragment. With 5, Astronomer Celio (Albor, at night) opens a 40 s meteor shower: the stars bounce and roll when they land; catch as many as you can.')], () => null]);
