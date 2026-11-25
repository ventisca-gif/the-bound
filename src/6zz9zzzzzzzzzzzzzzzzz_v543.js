// ================= v5.43: MÁS JAPÓN, RECOMPENSAS DE OFICIO, BONSÁI, TORNEO, CUMPLEAÑOS Y MONTAR EN EL DRAGÓN =================
// Sergio eligió de las ideas (sin repetir lo que ya hay: el fotógrafo y su álbum y el mercado entre jugadores ya existen):
//  · Oficios nuevos en Japón (dentro del mapa): 🐙 Takoyakero en Dōtonbori (plancha de 9 huecos con tiempos a la vez) y
//    🎆 Pirotécnico del río en Asakusa (cargar la carcasa del color pedido y encender el tubo que brilla).
//  · Los oficios de Japón dan +0,1 % de crítico y +0,1 % de defensa y COSAS NUEVAS: marcos de retrato con diseño,
//    mascotas japonesas (shiba, kitsune blanca, tanuki, maneki-neko, grulla) y monturas (ciervo de Nara, kirin dorado).
//  · Bonsái en casa: pódalo una vez al día (el bonsái de muebles zen); crece y da muebles zen.
//  · 🏆 Torneo de pesca en barca contra 3 pescadores en el estanque de Asakusa.
//  · 🎂 Cumpleaños de tus hijos (cada año del calendario desde que nacieron) y de tus parejas.
//  · 🐉 Montar en tu dragón: en la forma de dragón a cuatro patas, tu pareja y tus hijos que te acompañan suben a tu lomo.

// =====================================================================================
// RECOMPENSAS JAPONESAS: marcos, mascotas, monturas
// =====================================================================================
Object.assign(BIT_FR, { sakura: [L2('Sakura', 'Sakura'), '#ff9ac8'], ola: [L2('Gran Ola', 'Great Wave'), '#3a8ad8'], neon: [L2('Neón de Tokio', 'Tokyo Neon'), '#ff3ad8'], chochin: [L2('Farolillo rojo', 'Red lantern'), '#e8302a'], hanabi: [L2('Hanabi', 'Hanabi'), '#ffd040'], koi: [L2('Koi dorado', 'Golden koi'), '#ffa030'], ryu: [L2('Dragón de oro', 'Golden dragon'), '#e8b020'] });
{ const st = document.createElement('style'); st.textContent = `
.pframe.fr-sakura,.bfrb.fr-sakura i{box-shadow:0 0 0 2px #ffd0e4,0 0 0 4px #e85a9a,0 0 0 5px #fff,0 0 12px 3px #ff9ac8!important}
.pframe.fr-ola,.bfrb.fr-ola i{box-shadow:0 0 0 2px #e8f4ff,0 0 0 4px #2a64b0,0 0 0 6px #9ad0ff,0 0 10px 2px #3a8ad8!important;animation:frola 2.4s ease-in-out infinite}@keyframes frola{50%{box-shadow:0 0 0 2px #9ad0ff,0 0 0 4px #e8f4ff,0 0 0 6px #2a64b0,0 0 14px 3px #3a8ad8}}
.pframe.fr-neon,.bfrb.fr-neon i{box-shadow:0 0 0 2px #fff,0 0 0 4px #ff3ad8,0 0 0 6px #3af0ff,0 0 14px 4px #ff3ad8!important;animation:frneon 1.4s steps(2) infinite}@keyframes frneon{50%{box-shadow:0 0 0 2px #fff,0 0 0 4px #3af0ff,0 0 0 6px #ff3ad8,0 0 14px 4px #3af0ff}}
.pframe.fr-chochin,.bfrb.fr-chochin i{box-shadow:0 0 0 2px #1a0a08,0 0 0 4px #e8302a,0 0 0 5px #ffd080,0 0 0 7px #1a0a08,0 0 14px 4px #ff7a3a!important}
.pframe.fr-hanabi,.bfrb.fr-hanabi i{animation:frhana 2s linear infinite}@keyframes frhana{0%{box-shadow:0 0 0 2px #ffd040,0 0 12px 4px #ff5a3a}25%{box-shadow:0 0 0 2px #3af0ff,0 0 14px 5px #5a8aff}50%{box-shadow:0 0 0 2px #ff6ad0,0 0 12px 4px #ffd040}75%{box-shadow:0 0 0 2px #8aff6a,0 0 14px 5px #ff6ad0}100%{box-shadow:0 0 0 2px #ffd040,0 0 12px 4px #ff5a3a}}
.pframe.fr-koi,.bfrb.fr-koi i{box-shadow:0 0 0 2px #fff4e0,0 0 0 4px #ff8a20,0 0 0 6px #fff,0 0 0 7px #e8302a,0 0 12px 3px #ffa030!important}
.pframe.fr-ryu,.bfrb.fr-ryu i{box-shadow:0 0 0 2px #5a3a00,0 0 0 4px #ffd040,0 0 0 5px #fff4b0,0 0 0 7px #a87810,0 0 16px 5px #e8b020!important;animation:frryu 3s ease-in-out infinite}@keyframes frryu{50%{filter:brightness(1.25)}}`; document.head.appendChild(st); }
Object.assign(PETS, {
  shiba: { n: L2('Shiba inu', 'Shiba inu'), d: L2('Mascota japonesa (mensajero en bici, nivel 30).', 'Japanese pet (bike courier, level 30).'), price: 0, jp: 1, look: { b: '#d8822a', b2: '#fff2e0', ear: 'pointy', tail: 'bushy', eye: '#2a1a10' } },
  kitsune: { n: L2('Kitsune blanca', 'White kitsune'), d: L2('Zorrita sagrada de los santuarios (jardinero del templo, nivel 30).', 'Sacred shrine fox (temple gardener, level 30).'), price: 0, jp: 1, look: { b: '#f4f0ec', b2: '#ffffff', ear: 'pointy', tail: 'bushy', eye: '#e8302a', mask: 1 } },
  tanuki: { n: L2('Tanuki', 'Tanuki'), d: L2('Mapache japonés travieso (takoyakero, nivel 30).', 'Mischievous Japanese raccoon dog (takoyaki cook, level 30).'), price: 0, jp: 1, look: { b: '#7a5a3a', b2: '#c8a878', ear: 'floppy', tail: 'bushy', eye: '#1a1008', mask: 1 } },
  maneki: { n: L2('Maneki-neko', 'Maneki-neko'), d: L2('Gatita de la suerte (pirotécnico, nivel 30).', 'Lucky cat (fireworks master, level 30).'), price: 0, jp: 1, look: { b: '#f8f4ec', b2: '#e8a050', ear: 'pointy', tail: 'thin', eye: '#2a1a10' } },
  grulla: { n: L2('Grulla japonesa', 'Japanese crane'), d: L2('Grulla de corona roja (pescador de barca, nivel 30).', 'Red-crowned crane (boat fisher, level 30).'), price: 0, jp: 1, fly: 1, look: { kind: 'bird', b: '#f4f4f0', b2: '#1a1a20', eye: '#e8302a' } } });
it('cria_ciervo', { n: L2('Cría de Ciervo de Nara', 'Nara deer fawn'), t: 'mat', stack: true, tier: 6, price: 0, icon: ['paw', '#c8904a'], rar: 4, d: L2('Llévala al establo para criarla: será tu montura.', 'Take it to the stable to raise it: it will be your mount.') });
it('talisman_kirin', { n: L2('Talismán del Kirin', 'Kirin talisman'), t: 'mat', stack: true, tier: 8, price: 0, icon: ['star', '#ffd040'], rar: 5, d: L2('Llévalo al establo: despierta al kirin dorado, tu montura.', 'Take it to the stable: it awakens the golden kirin, your mount.') });
Object.assign(MOUNTS, { ciervo_nara: { n: L2('Ciervo de Nara', 'Nara deer'), sp: 1.75, egg: 'cria_ciervo', col: ['#4a2a12', '#8a5a2a', '#c08a50', '#e8c090'], mane: '#fff0d8' },
  kirin: { n: L2('Kirin dorado', 'Golden kirin'), sp: 1.9, egg: 'talisman_kirin', col: ['#7a5000', '#c89020', '#ffd040', '#fff4b0'], mane: '#ff7a3a' } });
// recompensas por nivel de cada oficio japonés: [nivel, tipo, id]
const JP_REW = { jardinero: [[15, 'fr', 'sakura'], [30, 'pet', 'kitsune'], [50, 'it', 'cria_ciervo']], barquero: [[15, 'fr', 'ola'], [30, 'pet', 'grulla'], [50, 'fr', 'koi']],
  mensajero: [[15, 'fr', 'neon'], [30, 'pet', 'shiba'], [50, 'fr', 'ryu']], takoyaki: [[15, 'fr', 'chochin'], [30, 'pet', 'tanuki'], [50, 'it', 'talisman_kirin']], hanabi: [[15, 'fr', 'hanabi'], [30, 'pet', 'maneki'], [50, 'fr', 'ryu']] };
const jpRewTxt = ([lv, t, id]) => t === 'fr' ? '🖼 ' + L2('Marco ', 'Frame ') + BIT_FR[id][0] : t === 'pet' ? '🐾 ' + PETS[id].n : '🐎 ' + (ITEMS[id] ? ITEMS[id].n : id);
function jpPerks(k) { const P8 = [[10, '+10 % de paga', '+10% pay', { ['v8' + k]: 10 }], [20, '+0,1 % de defensa', '+0.1% defense', { defP: 0.1 }], [40, '+0,1 % de crítico', '+0.1% crit', { crit: 0.1 }], [60, '+15 % de paga', '+15% pay', { ['v8' + k]: 15 }]].concat((JP_REW[k] || []).map(r => [r[0], jpRewTxt(r), jpRewTxt(r), {}])).sort((a, b) => a[0] - b[0]);
  JOBP2[k] = P8; JOB_PERKS[k] = P8.map(([lv, es, en]) => [lv, L2(es, en)]);  /* 6.13: antes solo español */ if (JOB_GUIDE[k]) { JOB_GUIDE[k].perks = P8.map(([lv, es, en]) => [lv, es, en]); JOB_GUIDE[k].ben = [L2('Oro, experiencia de oficio, +0,1 % de defensa y +0,1 % de crítico, y recompensas japonesas: marcos de retrato, mascotas y monturas.', 'Gold, job experience, +0.1% defense and +0.1% crit, and Japanese rewards: portrait frames, pets and mounts.'), '']; } }
SAVEKEYS.push('jpRew');
V33_TICKS.push(() => { const P = G.P; if (!P || !P.jobs) return; P.jpRew = P.jpRew || {}; for (const k in JP_REW) { const lv = (P.jobs[k] || { lv: 1 }).lv; for (const r of JP_REW[k]) { const key = k + ':' + r[0]; if (lv < r[0] || P.jpRew[key]) continue; P.jpRew[key] = 1;
  if (r[1] === 'fr') { const b = BIT(); if (!b.fr.includes(r[2])) b.fr.push(r[2]); } else if (r[1] === 'pet') givePet(r[2], true); else giveItem(r[2], 1, true);
  banner('🎁 ' + (JOBS[k] ? JOBS[k].n : k) + ' ' + L2('nivel ', 'level ') + r[0], jpRewTxt(r) + (r[1] === 'fr' ? L2(' (Bitácora › Marcos)', ' (Logbook › Frames)') : r[1] === 'pet' ? L2(' (pestaña Mascotas)', ' (Pets tab)') : L2(' (llévala al establo)', ' (take it to the stable)'))); sfx('level'); markDirty(true); } } });

// =====================================================================================
// TAKOYAKERO (Dōtonbori, Osaka)
// =====================================================================================
jp7Job('takoyaki', '🐙', 'Takoyakero', 'Takoyaki cook', M => [150, 252], [8, 6], jp7Li((l, i) => l[0] === 'm' && i > 7, 7),
  '¡Irasshaimase! Nueve huecos, nueve bolitas: no dejes que se quemen.', 'Irasshaimase! Nine holes, nine balls: don\'t let them burn.',
  'Te pones detrás de la plancha de 9 huecos y te mueves por ella. ⚔ en un hueco vacío: echas la masa. Cuando brille en amarillo, ⚔ para darle la vuelta. Cuando brille dorada, ⚔ para sacarla al plato. Si tardas, se quema (⚔ para limpiarla). Cada cliente pide 6 u 8 bolitas: sírvelas antes de que se canse.', 'You stand behind the 9-hole griddle and move over it. ⚔ on an empty hole: pour the batter. When it glows yellow, ⚔ to flip it. When it glows golden, ⚔ to put it on the plate. Too slow and it burns (⚔ to clean it). Each customer orders 6 or 8 balls: serve them before they get tired.',
  'Puesto de takoyaki (Dōtonbori, Osaka)', 'Takoyaki stall (Dōtonbori, Osaka)', 0);
const TK_FLIP = [2.2, 3.6], TK_DONE = [2.2, 4.0];
V8_GO.takoyaki = A => { const gx = A.x0 * 16 + 30, gy = A.y0 * 16 + 26, holes = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) holes.push({ x: gx + c * 22, y: gy + r * 20, s: 0, t: 0 }); const P = G.P; P.x = gx + 22; P.y = gy + 20;
  Object.assign(ACT, { k: 'v8_takoyaki', gx, gy, holes, plate: 0, served: 0, burnt: 0, gold: 0, t: 80, cust: null, wait: 0.5,
    onAtk: () => { const B = ACT, P = G.P, h = B.holes.find(h => Math.hypot(h.x - P.x, h.y - P.y) < 13); setAnim(P, 'atk'); if (!h) { floatText(P.x, P.y - 40, L2('Ponte sobre un hueco', 'Stand on a hole'), '#ffe08a'); return true; }
      if (h.s === 0) { h.s = 1; h.t = 0; sfx('ui'); } else if (h.s === 1) { if (h.t >= TK_FLIP[0] && h.t <= TK_FLIP[1]) { h.s = 2; h.t = 0; sfx('hit'); } else floatText(h.x, h.y - 20, L2('Aún no', 'Not yet'), '#ffe08a'); }
      else if (h.s === 2) { if (h.t >= TK_DONE[0] && h.t <= TK_DONE[1]) { h.s = 0; B.plate++; sfx('coin'); floatText(h.x, h.y - 20, '+1', '#ffd040'); } else floatText(h.x, h.y - 20, L2('Aún no', 'Not yet'), '#ffe08a'); }
      else { h.s = 0; B.burnt++; sfx('hurt'); } return true; } });
  banner('🐙 ' + L2('¡A la plancha!', 'Griddle time!'), L2('⚔: masa → vuelta (amarillo) → al plato (dorado).', '⚔: batter → flip (yellow) → plate (golden).')); };
V33_TICKS.push(dt => { if (ACT.k !== 'v8_takoyaki') return; dt = Math.min(0.05, dt || 0.016); const B = ACT, P = G.P; B.t -= dt; P.x = Math.max(B.gx - 10, Math.min(B.gx + 54, P.x)); P.y = Math.max(B.gy - 10, Math.min(B.gy + 50, P.y));
  for (const h of B.holes) { if (h.s === 1 || h.s === 2) { h.t += dt; const lim = h.s === 1 ? TK_FLIP[1] + 1.2 : TK_DONE[1] + 1.2; if (h.t > lim) { h.s = 3; floatText(h.x, h.y - 20, L2('¡Quemada!', 'Burnt!'), '#ff8a8a'); } } }
  if (!B.cust) { B.wait -= dt; if (B.wait <= 0) { const e = actNpc('jp_' + (1 + Math.floor(Math.random() * 60)), B.gx + 120, B.gy + 10, 'japon'); B.cust = { e, n: Math.random() < 0.5 ? 6 : 8, pat: 26, ph: 'come' }; } }
  const c = B.cust; if (c && c.e) { const spot = { x: B.gx + 86, y: B.gy + 20 }; if (c.ph === 'come') { npcStep(c.e, spot.x, spot.y, 60, dt); if (aDist(c.e, spot) < 3) { c.ph = 'wait'; c.e.dir = 'left'; } }
    else if (c.ph === 'wait') { c.pat -= dt; if (B.plate >= c.n) { B.plate -= c.n; B.served++; const g = 120 + c.n * 25 + Math.round(c.pat * 4); B.gold += g; floatText(c.e.x, c.e.y - 44, L2('¡Oishii! +', 'Oishii! +') + g, '#ffd040'); sfx('coin'); c.ph = 'leave'; } else if (c.pat <= 0) { floatText(c.e.x, c.e.y - 44, L2('Me voy…', 'I\'m leaving…'), '#ff8a8a'); c.ph = 'leave'; } }
    else { npcStep(c.e, B.gx + 200, B.gy + 30, 70, dt); c.lt = (c.lt || 0) + dt; if (c.lt > 2.2) { c.e.remove = true; G.ents = G.ents.filter(q => !q.remove); B.cust = null; B.wait = 0.8; } } }
  v8Hud(`🍽 ${B.plate}${c && c.ph === 'wait' ? '/' + c.n : ''} · 🙂 ${B.served} · 🔥 ${B.burnt} · ${Math.ceil(B.t)} s`);
  if (B.t <= 0) v8Pay('takoyaki', B.gold + B.plate * 15, 22 + B.served * 10 - B.burnt * 2, B.served + L2(' clientes contentos', ' happy customers')); });
V8_UNDER.push((cx, cy) => { if (ACT.k !== 'v8_takoyaki') return; const B = ACT; ctx.fillStyle = '#3a3a40'; ctx.fillRect(B.gx - 14 - cx, B.gy - 12 - cy, 72, 62); ctx.fillStyle = '#222228'; ctx.fillRect(B.gx - 12 - cx, B.gy - 10 - cy, 68, 58);
  for (const h of B.holes) { const x = h.x - cx, y = h.y - cy, glow = (h.s === 1 && h.t >= TK_FLIP[0] && h.t <= TK_FLIP[1]) || (h.s === 2 && h.t >= TK_DONE[0] && h.t <= TK_DONE[1]);
    ctx.fillStyle = '#0e0e12'; ctx.beginPath(); ctx.ellipse(x, y, 8, 6, 0, 0, 7); ctx.fill(); if (h.s) { ctx.fillStyle = h.s === 1 ? '#f0e0a0' : h.s === 2 ? (h.t > TK_DONE[0] ? '#c8822a' : '#e0b060') : '#1a1008'; ctx.beginPath(); ctx.ellipse(x, y - 1, 6, 5, 0, 0, 7); ctx.fill(); if (h.s === 2) { ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x - 3, y - 4, 6, 1); ctx.fillStyle = '#5ac05a'; ctx.fillRect(x - 1, y - 3, 2, 1); } }
    if (glow) { ctx.strokeStyle = h.s === 1 ? 'rgba(255,240,80,' + (0.6 + 0.4 * Math.sin(G.t * 14)) + ')' : 'rgba(255,190,40,' + (0.6 + 0.4 * Math.sin(G.t * 14)) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 9, 7, 0, 0, 7); ctx.stroke(); ctx.lineWidth = 1; } }
  ctx.fillStyle = '#f4f0e8'; ctx.beginPath(); ctx.ellipse(B.gx + 70 - cx, B.gy + 52 - cy, 12, 5, 0, 0, 7); ctx.fill(); for (let i = 0; i < Math.min(8, B.plate); i++) { ctx.fillStyle = '#c8822a'; ctx.beginPath(); ctx.arc(B.gx + 63 + (i % 4) * 5 - cx, B.gy + 50 + Math.floor(i / 4) * 3 - cy, 2.2, 0, 7); ctx.fill(); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'v8_takoyaki' || !ACT.cust || ACT.cust.ph !== 'wait') return; const c = ACT.cust; drawTxt('🐙 ×' + c.n, c.e.x - cx, c.e.y - cy - 52, '#ffffff', 9); ctx.fillStyle = c.pat > 10 ? '#3ac04a' : '#e83a3a'; ctx.fillRect(c.e.x - cx - 14, c.e.y - cy - 48, 28 * Math.max(0, c.pat / 26), 2); });

// =====================================================================================
// PIROTÉCNICO DEL RÍO (Asakusa)
// =====================================================================================
jp7Job('hanabi', '🎆', 'Pirotécnico del río', 'River fireworks master', M => [188, 202], [10, 6], jp7Li((l, i) => l[0] === 'f' && i > 4, 4),
  'Un hanabi bien lanzado se recuerda todo el verano. El color justo, en el tubo justo.', 'A well-launched hanabi is remembered all summer. The right colour, in the right tube.',
  'Junto al río hay 5 tubos y 3 cajas de carcasas (roja, verde y azul). El tubo que brilla pide un color (lo ves encima). Toma la carcasa de ese color en su caja con ⚔, corre al tubo y ⚔ para cargar y encender antes de que se apague. El color correcto vale el doble. Por la noche se ve mejor.', 'By the river there are 5 tubes and 3 shell crates (red, green and blue). The glowing tube asks for a colour (shown above it). Take a shell of that colour from its crate with ⚔, run to the tube and ⚔ to load and light it before it fades. The right colour is worth double. It looks best at night.',
  'Orilla del río (Asakusa, Tokio)', 'Riverbank (Asakusa, Tokyo)', 1);
const HB_COL = [['#ff4a3a', L2('roja', 'red')], ['#5ae05a', L2('verde', 'green')], ['#4a8aff', L2('azul', 'blue')]];
function hbNext() { const B = ACT; B.n++; if (B.n > B.total) return; B.cue = { tube: Math.floor(Math.random() * 5), col: Math.floor(Math.random() * 3), t: Math.max(4, 7 - B.n * 0.2) }; }
V8_GO.hanabi = A => { const tx = A.x0 * 16 + 20, ty = A.y0 * 16 + 30, tubes = [0, 1, 2, 3, 4].map(i => ({ x: tx + i * 22, y: ty })), crates = [0, 1, 2].map(i => ({ x: tx + 14 + i * 30, y: ty + 46, c: i })); const P = G.P; P.x = tx + 44; P.y = ty + 26;
  Object.assign(ACT, { k: 'v8_hanabi', tubes, crates, hand: -1, n: 0, total: 10, ok: 0, half: 0, miss: 0, cue: null, wait: 1,
    onAtk: () => { const B = ACT, P = G.P; setAnim(P, 'atk'); const cr = B.crates.find(c => Math.hypot(c.x - P.x, c.y - P.y) < 16); if (cr) { B.hand = cr.c; sfx('ui'); return true; }
      const tb = B.tubes.findIndex(t => Math.hypot(t.x - P.x, t.y - P.y) < 14); if (tb < 0) return true; if (!B.cue || tb !== B.cue.tube) { floatText(P.x, P.y - 40, L2('Ese tubo no brilla', 'That tube is not glowing'), '#ffe08a'); return true; } if (B.hand < 0) { floatText(P.x, P.y - 40, L2('Toma una carcasa', 'Grab a shell'), '#ffe08a'); return true; }
      const good = B.hand === B.cue.col; if (good) B.ok++; else B.half++; hbBoom(B.tubes[tb], B.hand, good); B.hand = -1; B.cue = null; B.wait = 0.9; return true; } });
  banner('🎆 ' + L2('¡Hanabi!', 'Hanabi!'), L2('Carcasa del color pedido (cajas) → tubo que brilla (⚔).', 'Shell of the asked colour (crates) → glowing tube (⚔).')); };
function hbBoom(t, ci, good) { const col = HB_COL[ci][0], y = t.y - 150 - Math.random() * 40, x = t.x + (Math.random() - 0.5) * 60; sfx('boom'); for (let k = 0; k < (good ? 48 : 22); k++) { const a = k / (good ? 48 : 22) * 6.28, sp = 40 + Math.random() * (good ? 60 : 30); part(x, y, { vx: Math.cos(a) * sp, vz: Math.sin(a) * sp, g: 30, life: 1.1 + Math.random() * 0.5, c: k % 3 === 0 ? '#ffffff' : col, s: 2 }); } addFx({ type: 'ring', x, y, r: good ? 50 : 30, dur: 0.6, col }); floatText(t.x, t.y - 40, good ? L2('¡Precioso!', 'Beautiful!') : L2('Color cambiado', 'Wrong colour'), good ? '#ffd040' : '#c0c0c0'); }
V33_TICKS.push(dt => { if (ACT.k !== 'v8_hanabi') return; dt = Math.min(0.05, dt || 0.016); const B = ACT, P = G.P; P.x = Math.max(B.tubes[0].x - 14, Math.min(B.tubes[4].x + 14, P.x)); P.y = Math.max(B.tubes[0].y + 6, Math.min(B.crates[0].y + 12, P.y));
  if (!B.cue) { B.wait -= dt; if (B.wait <= 0) { hbNext(); if (B.n > B.total) { v8Pay('hanabi', 90 + B.ok * 70 + B.half * 25, 24 + B.ok * 7 + B.half * 2, B.ok + L2(' perfectos · ', ' perfect · ') + B.half + L2(' de otro color', ' wrong colour')); return; } } }
  else { B.cue.t -= dt; if (B.cue.t <= 0) { B.miss++; floatText(B.tubes[B.cue.tube].x, B.tubes[B.cue.tube].y - 40, L2('Se apagó', 'It fizzled'), '#ff8a8a'); B.cue = null; B.wait = 0.8; } }
  v8Hud(`🎆 ${Math.min(B.n, B.total)}/${B.total} · ✨ ${B.ok} · ${B.hand >= 0 ? '🧨 ' + HB_COL[B.hand][1] : L2('sin carcasa', 'no shell')}`); });
V8_UNDER.push((cx, cy) => { if (ACT.k !== 'v8_hanabi') return; const B = ACT; B.tubes.forEach((t, i) => { const x = t.x - cx, y = t.y - cy, on = B.cue && B.cue.tube === i; ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x - 5, y - 14, 10, 14); ctx.fillStyle = on ? 'rgba(255,220,80,' + (0.5 + 0.5 * Math.sin(G.t * 12)) + ')' : '#5a4a3a'; ctx.fillRect(x - 4, y - 15, 8, 3); });
  for (const c of B.crates) { const x = c.x - cx, y = c.y - cy; ctx.fillStyle = '#8a5a2a'; ctx.fillRect(x - 9, y - 10, 18, 10); ctx.fillStyle = HB_COL[c.c][0]; ctx.beginPath(); ctx.arc(x - 3, y - 11, 3, 0, 7); ctx.arc(x + 3, y - 11, 3, 0, 7); ctx.fill(); } });
WORLD_DRAW.push((cx, cy) => { if (ACT.k !== 'v8_hanabi') return; const B = ACT, P = G.P; if (B.cue) { const t = B.tubes[B.cue.tube]; ctx.fillStyle = HB_COL[B.cue.col][0]; ctx.beginPath(); ctx.arc(t.x - cx, t.y - cy - 26, 5, 0, 7); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillRect(t.x - cx - 8, t.y - cy - 34, 16 * Math.max(0, B.cue.t / 7), 2); }
  if (B.hand >= 0) { ctx.fillStyle = HB_COL[B.hand][0]; ctx.beginPath(); ctx.arc(P.x - cx + 8, P.y - cy - 22, 3.5, 0, 7); ctx.fill(); } });
for (const k of ['jardinero', 'barquero', 'mensajero', 'takoyaki', 'hanabi']) jpPerks(k);
// las ventajas de los 5 oficios japoneses (+0,1 % defensa y crítico) suman en calcStats con el resto de JOBP2

// =====================================================================================
// BONSÁI EN CASA (el bonsái de los muebles zen)
// =====================================================================================
SAVEKEYS.push('bonsai');
const BONS_REW = [[3, 'bk_zen_farol'], [6, 'bk_zen_arena'], [10, 'bk_zen_estanque'], [15, 'bk_zen_torii']];
FURN_ACT.zen_bonsai = [L2('Podar el bonsái', 'Prune the bonsai'), 'herb:1', () => { const P = G.P, B = P.bonsai = P.bonsai || { lv: 0, d: -1 }, day = calDay(); if (B.d === day) { toast(L2('Hoy ya lo podaste. Vuelve mañana.', 'You already pruned it today. Come back tomorrow.'), 'info'); return; }
  const jl = (P.jobs.jardinero || { lv: 1 }).lv, grow = 1 + (jl >= 30 ? 1 : 0); B.d = day; B.lv += grow; setAnim(P, 'atk'); sfx('hit'); for (let k = 0; k < 10; k++) part(P.x, P.y - 16, { vz: 30, vx: (Math.random() - 0.5) * 60, g: 80, life: 0.7, c: '#3a8a3a', s: 2 });
  gainJobXp('jardinero', 20 + B.lv * 2); floatText(P.x, P.y - 44, L2('Bonsái nivel ', 'Bonsai level ') + B.lv, '#8aff8a'); for (const [lv, id] of BONS_REW) if (B.lv >= lv && !(B.got || []).includes(id) && ITEMS[id]) { (B.got = B.got || []).push(id); giveItem(id, 1, true); banner('🌳 ' + L2('Tu bonsái crece', 'Your bonsai grows'), '🎁 ' + ITEMS[id].n); }
  markDirty(true); }];
WORLD_DRAW.push((cx, cy) => { const P = G.P, M = G.map; if (!P || !P.bonsai || !M || !M.objs || !isHome(M.id)) return; const lv = Math.min(15, P.bonsai.lv); if (!lv) return; for (const o of M.objs) { if (o.f !== 'zen_bonsai') continue; const x = o.tx * 16 + 8 - cx, y = o.ty * 16 + 2 - cy; if (x < -30 || x > VW + 30 || y < -40 || y > VH + 30) continue;
  for (let k = 0; k < Math.ceil(lv / 2); k++) { ctx.fillStyle = k % 2 ? '#3a8a3a' : '#5ab05a'; ctx.beginPath(); ctx.ellipse(x - 6 + (k * 5) % 14, y - 12 - (k % 3) * 3, 4 + (k % 2), 3, 0, 0, 7); ctx.fill(); } if (lv >= 10) { ctx.fillStyle = '#ffb0d0'; for (let k = 0; k < 4; k++) ctx.fillRect(x - 6 + k * 4, y - 16 - (k % 2) * 3, 2, 2); } } });

// =====================================================================================
// 🏆 TORNEO DE PESCA EN BARCA (Asakusa)
// =====================================================================================
let BT_TOUR = false;
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'v8_barquero') return; opts.unshift({ label: '🏆 ' + L2('Torneo de pesca en barca (contra 3 pescadores)', 'Boat fishing tournament (vs 3 fishers)'), icon: ['star', '#ffd040'], fn: () => { closeDialog(); const P = G.P, T = P.btT = P.btT || {}; if (T.d === calDay()) { toast(L2('Hoy ya hubo torneo. Vuelve mañana.', 'There was already a tournament today. Come back tomorrow.'), 'info'); return; } BT_TOUR = true; v8Start('barquero'); BT_TOUR = false; } }); });
SAVEKEYS.push('btT');
{ const _go = V8_GO.barquero; V8_GO.barquero = function (A) { const tour = BT_TOUR; _go.apply(this, arguments); if (!tour || ACT.k !== 'v8_barquero') return; const M = G.map; ACT.tour = 1; ACT.t = 100; (G.P.btT = G.P.btT || {}).d = calDay();
  ACT.rivals = [0, 1, 2].map(i => { const r = jp7Ripple(M, A), e = actNpc('jp_' + (5 + i * 9), r.x, r.y, 'japon'); return { e, x: r.x, y: r.y, n: 0, w: 0, tgt: null, nm: [L2('Kenji', 'Kenji'), L2('Aiko', 'Aiko'), L2('Daichi', 'Daichi')][i] }; }); banner('🏆 ' + L2('¡Torneo!', 'Tournament!'), L2('Gana quien pesque más (los grandes valen 3). Vende en el muelle al acabar.', 'Whoever catches most wins (big ones are worth 3). Sell at the pier at the end.')); }; }
V33_TICKS.push(dt => { if (ACT.k !== 'v8_barquero' || !ACT.rivals) return; dt = Math.min(0.05, dt || 0.016); const B = ACT, M = G.map;
  for (const r of B.rivals) { if (!r.tgt || !B.rip.includes(r.tgt)) r.tgt = B.rip[Math.floor(Math.random() * B.rip.length)]; const dx = r.tgt.x - r.x, dy = r.tgt.y - r.y, d = Math.hypot(dx, dy);
    if (d > 6) { const v = 34 * dt, nx = r.x + dx / d * v, ny = r.y + dy / d * v; if (jp7Tile(M, nx, ny) === JP_G.POND) { r.x = nx; r.y = ny; } else r.tgt = null; r.w = 0; } else { r.w += dt; if (r.w > 3.5 + Math.random() * 2) { r.n += Math.random() < 0.25 ? 3 : 1; r.w = 0; const i = B.rip.indexOf(r.tgt); if (i >= 0) B.rip[i] = jp7Ripple(M, V8.at.barquero); r.tgt = null; floatText(r.x, r.y - 40, '+1', '#c8e0ff'); } }
    if (r.e) { r.e.x = r.x; r.e.y = r.y; r.e.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); } } });
V8_UNDER.push((cx, cy) => { if (ACT.k !== 'v8_barquero' || !ACT.rivals) return; for (const r of ACT.rivals) { const x = r.x - cx, y = r.y - cy + 2; ctx.fillStyle = '#4a3a6a'; ctx.beginPath(); ctx.ellipse(x, y, 16, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#7a6a9a'; ctx.beginPath(); ctx.ellipse(x, y - 1, 12, 4, 0, 0, 7); ctx.fill(); drawTxt(r.nm + ' ' + r.n, x, y - 50, '#c8e0ff', 8); } });
{ const _bs = jp7BoatSell; jp7BoatSell = function (late) { const B = ACT; if (!B.rivals) return _bs.apply(this, arguments); const me = B.small + B.big * 3, best = Math.max(...B.rivals.map(r => r.n)), pos = 1 + B.rivals.filter(r => r.n > me).length;
  for (const r of B.rivals) if (r.e) r.e.remove = true; G.ents = G.ents.filter(q => !q.remove); B.rivals = null; _bs.apply(this, arguments);
  const prize = [0, 3000, 1200, 500, 0][pos] || 0; G.P.gold += prize; setTimeout(() => banner('🏆 ' + L2('Torneo: puesto ', 'Tournament: place ') + pos + '/4', L2('Tus puntos: ', 'Your points: ') + me + L2(' · mejor rival: ', ' · best rival: ') + best + (prize ? ' · +' + prize + L2(' de oro', ' gold') : '')), 1600); if (pos === 1) { gainJobXp('barquero', 80); const b = BIT(); if (!b.fr.includes('koi')) b.fr.push('koi'); } markDirty(); }; }

// =====================================================================================
// 🎂 CUMPLEAÑOS
// =====================================================================================
const BD_YEAR = () => (cal().dpm || 7) * 12;
const bdKid = k => { const d = calDay() - (k.born || 0); return d > 0 && d % BD_YEAR() === 0; };
const bdRom = id => { let h = 0; for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) % 9973; return calDay() % BD_YEAR() === h % BD_YEAR(); };
it('tarta_cumple', { n: L2('Tarta de cumpleaños', 'Birthday cake'), t: 'cons', stack: true, heal: 3000, food: 8, price: 400, icon: ['cake'], gift: 'cake', rar: 2, d: L2('De la fiesta de cumpleaños. Se puede regalar.', 'From a birthday party. Can be gifted.') });
SAVEKEYS.push('bdDone');
let bdT = 0; V33_TICKS.push(dt => { bdT += dt || 0; if (bdT < 5) return; bdT = 0; const P = G.P; if (!P) return; P.bdDone = P.bdDone || {}; const day = calDay(), names = [];
  for (const k of P.kids || []) if (bdKid(k) && P.bdDone['k' + (k.id || k.n) + ':' + day] === undefined) { P.bdDone['k' + (k.id || k.n) + ':' + day] = 0; names.push(k.n); }
  for (const id of romPartners()) if (bdRom(id) && P.bdDone['r' + id + ':' + day] === undefined) { P.bdDone['r' + id + ':' + day] = 0; names.push(NPCS[id] ? NPCS[id].n : id); }
  if (names.length) { banner('🎂 ' + L2('¡Hoy es un cumpleaños!', 'It\'s a birthday today!'), names.join(', ') + L2(': felicítale (habla con él o ella) y llévale un regalo.', ': congratulate them (talk to them) and bring a gift.')); sfx('quest'); markDirty(); } });
function romPartners() { const P = G.P, out = []; try { for (const k in ROM) { const R = rel(k); if (R && (R.partner || R.wed || R.dating || hearts(R.t) >= 8)) out.push(k); } } catch (e) { } return out; }
function bdCelebrate(key, who, onKid) { const P = G.P; P.bdDone = P.bdDone || {}; if (P.bdDone[key] === 1) { toast(L2('Ya le felicitaste hoy.', 'You already congratulated them today.'), 'info'); return; } P.bdDone[key] = 1; giveItem('tarta_cumple', 1, true); P.gold += 500;
  burst(P.x, P.y - 20, 30, { sp: 90, up: 70, g: 40, life: 1, c: ['#ff6ab0', '#ffd040', '#5ad0ff', '#ffffff'] }); sfx('level'); banner('🎂 ' + L2('¡Feliz cumpleaños, ', 'Happy birthday, ') + who + '!', L2('Te comparte su tarta (+1 Tarta de cumpleaños).', 'They share their cake with you (+1 Birthday cake).')); if (onKid) onKid(); markDirty(true); }
DLG_HOOKS.push((npc, opts) => { if (!ROM[npc.id] || !romPartners().includes(npc.id) || !bdRom(npc.id)) return; const key = 'r' + npc.id + ':' + calDay(); opts.unshift({ label: '🎂 ' + L2('¡Feliz cumpleaños!', 'Happy birthday!'), icon: ['heart', '#ff6ab0'], fn: () => { closeDialog(); bdCelebrate(key, NPCS[npc.id].n, () => { try { addRel(npc.id, 6, 6); } catch (e) { } }); } }); });
{ const _gr = giftReact; giftReact = function (k, id) { const r = _gr.apply(this, arguments); return bdRom(k) && romPartners().includes(k) ? Math.max(r, 3) : r; }; }
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid; if (k && bdKid(k)) { const row = $('#modal .row') || $('#modal'); if (row && !$('#bdKid')) { row.insertAdjacentHTML('afterbegin', `<button class="btn gold" id="bdKid">🎂 ${L2('¡Feliz cumpleaños!', 'Happy birthday!')}</button>`); $('#bdKid').onclick = () => { closeModal(); bdCelebrate('k' + (k.id || k.n) + ':' + calDay(), k.n, () => { k.happy = (k.happy || 0) + 1; }); }; } } } catch (er) { } return r; }; }

// =====================================================================================
// 🐉 MONTAR EN TU DRAGÓN (pareja e hijos que te acompañan)
// =====================================================================================
const drgRiders = () => { const P = G.P; if (!P || P.sr !== 'dragon' || P.srF !== 2) return []; const out = []; if (typeof COMP !== 'undefined' && COMP && COMP.e) out.push(COMP.e); if (typeof COMP2 !== 'undefined' && COMP2 && COMP2.e) out.push(COMP2.e); for (const e of FOLLOW_KIDS || []) if (!e.remove) out.push(e); return out.filter(e => e.map === P.map).slice(0, 2); };
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const R = drgRiders(); if (R.length && R.includes(e)) return; const r = _de.apply(this, arguments);
  if (e === G.P && R.length) { const P = G.P, side = P.dir === 'left' || P.dir === 'right', back = P.dir === 'left' ? 1 : -1; R.forEach((q, i) => { const A = q.atlas; if (!A || !A.img) return; const row = { down: 0, up: 1, left: 3, right: 2 }[P.dir] || 0, sx = (A.idx.idle || 0) * A.fw, ox = side ? back * (8 + i * 12) : (i ? 10 : -10), oy = -26 + (side ? 0 : -2) - (i * 2);
      ctx.drawImage(A.img, sx, row * A.fh, A.fw, A.fh, Math.round(P.x - cx - A.fw / 2 + ox), Math.round(P.y - cy - A.fh + oy), A.fw, A.fh); q.x = P.x; q.y = P.y; }); } return r; }; }
{ const _ss = srSet; srSet = function (on) { const r = _ss.apply(this, arguments); const P = G.P; if (P && P.sr === 'dragon' && P.srF === 2 && drgRiders().length) toast('🐉 ' + L2('¡Tu familia se sube a tu lomo!', 'Your family climbs onto your back!'), 'quest', 3); return r; }; }

// =====================================================================================
// LUPA › SISTEMAS
// =====================================================================================
if (typeof GSIS !== 'undefined') GSIS.unshift(['v543', '🎁 ' + L2('Novedades 5.43 (Japón, bonsái, torneo, cumpleaños, montar en el dragón)', 'New in 5.43 (Japan, bonsai, tournament, birthdays, dragon riding)'), () => [
  L2('🐙 Takoyakero (Dōtonbori, Osaka): plancha de 9 huecos; masa → vuelta (amarillo) → al plato (dorado). Sirve los pedidos de 6 u 8 antes de que se canse el cliente.', '🐙 Takoyaki cook (Dōtonbori, Osaka): 9-hole griddle; batter → flip (yellow) → plate (golden). Serve 6 or 8-ball orders before the customer tires.'),
  L2('🎆 Pirotécnico del río (Asakusa): toma la carcasa del color que pide el tubo que brilla y enciéndelo con ⚔.', '🎆 River fireworks master (Asakusa): take the shell of the colour the glowing tube asks for and light it with ⚔.'),
  L2('🎁 Los 5 oficios de Japón dan +0,1 % de defensa (nivel 20), +0,1 % de crítico (40) y recompensas: marcos (Sakura, Gran Ola, Neón de Tokio, Farolillo rojo, Hanabi, Koi dorado, Dragón de oro) en nivel 15/50, mascotas (kitsune blanca, grulla, shiba, tanuki, maneki-neko) en el 30 y monturas (Ciervo de Nara, Kirin dorado: llévalas al establo) en el 50.', '🎁 The 5 Japan jobs give +0.1% defense (level 20), +0.1% crit (40) and rewards: frames (Sakura, Great Wave, Tokyo Neon, Red lantern, Hanabi, Golden koi, Golden dragon) at level 15/50, pets (white kitsune, crane, shiba, tanuki, maneki-neko) at 30 and mounts (Nara deer, Golden kirin: take them to the stable) at 50.'),
  L2('🌳 Bonsái: pon un Bonsái zen en tu casa y pódalo una vez al día. Crece (más rápido con jardinero 30+) y a los niveles 3, 6, 10 y 15 da farol, arena, estanque y torii.', '🌳 Bonsai: place a zen Bonsai in your home and prune it once a day. It grows (faster with gardener 30+) and at levels 3, 6, 10 and 15 gives a lantern, sand, a pond and a torii.'),
  L2('🏆 Torneo de pesca en barca: habla con el pescador de barca de Asakusa (una vez al día). Compites contra Kenji, Aiko y Daichi; los grandes valen 3. Premios para los 3 primeros.', '🏆 Boat fishing tournament: talk to the Asakusa boat fisher (once a day). You compete against Kenji, Aiko and Daichi; big ones are worth 3. Prizes for the top 3.'),
  L2('🎂 Cumpleaños: tus hijos cumplen años cada año del calendario desde que nacieron, y tus parejas tienen su día. Ese día sale un aviso: habla con ellos para felicitarles (tarta y oro) y tus regalos les encantan.', '🎂 Birthdays: your kids have a birthday every calendar year since they were born, and your partners have their day. That day you get a notice: talk to them to congratulate them (cake and gold) and they love your gifts.'),
  L2('🐉 Montar en tu dragón: en la forma de dragón a cuatro patas, tu pareja y tus hijos que te acompañan (hasta 2) suben a tu lomo.', '🐉 Dragon riding: in the four-legged dragon form, your partner and kids who are with you (up to 2) ride on your back.')], () => null]);
