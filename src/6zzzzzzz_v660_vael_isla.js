// ================= 6.60 · Vael restaurado e Isla Velada =================
// De la lista de ideas aprobada («castillo de Vael restaurado» e «isla misteriosa»). Lore (docs/LORE.md):
//  · Vael es un reino de la Edad de los Reyes; su rey usó un fragmento del Sello para no morir y es uno de los siete
//    guardianes que vences. Lo vencido no vuelve: lo que queda es su ECO, que el Velo devuelve cuando el castillo vuelve
//    a tener vida. Reconstruyen los vivos: los descendientes de Vael que se fueron a otras tierras.
//  · La Isla Velada es un islote de Altavela: los Alados que no cayeron ataron sus casas a una nube; este se soltó y
//    baja con la niebla algunos días. Sus runas hablan la lengua de los Vientos.
function V660() { const P = G.P; return P.v660 && typeof P.v660 === 'object' ? P.v660 : (P.v660 = { st: 0 }); }
SAVEKEYS.push('v660');
const V660_C = [44, 34];   // centro de las Ruinas de Vael (src/11_place.js)
const v660Look = (g, hair, cols, hs) => LK({ g, hairStyle: hs || (g === 'f' ? 'long' : 'short'), hair: HAIRS[hair] || HAIRS.negro, main: pal(cols) });
NPCS.v660_ilda = { n: L2('Ilda de Vael', 'Ilda of Vael'), title: L2('Maestra de obras', 'Master builder'), look: v660Look('f', 'castano', ['#2a1a3a', '#3e2a56', '#56407a', '#70589a', '#9078ba']), lines: [L2('Mis abuelos huyeron de Vael cuando el rey dejó de morir. Ahora que descansa, podemos volver.', 'My grandparents fled Vael when the king stopped dying. Now that he rests, we can return.')], quests: [] };
NPCS.v660_eco = { n: L2('Eco del Rey de Vael', 'Echo of the King of Vael'), title: L2('Lo que el Velo recuerda', 'What the Veil remembers'), look: v660Look('m', 'blanco', ['#3a3a4a', '#545466', '#707084', '#9090a4', '#b8b8c8']), lines: [L2('No soy el rey que venciste. Soy lo que quedó de él antes del fragmento.', 'I am not the king you defeated. I am what was left of him before the fragment.')], quests: [] };
for (let i = 0; i < 8; i++) NPCS['v660_vec' + i] = { n: [L2('Albañil', 'Mason'), L2('Panadera', 'Baker'), L2('Herrero de Vael', 'Vael smith'), L2('Niña de Vael', 'Vael girl'), L2('Vendedora', 'Vendor'), L2('Guardia de Vael', 'Vael guard'), L2('Jardinero', 'Gardener'), L2('Abuelo de Vael', 'Vael grandfather')][i], title: L2('Vecino de Vael', 'Vael neighbour'), look: v660Look(i % 2 ? 'f' : 'm', ['castano', 'negro', 'rubio', 'pelirrojo', 'castano', 'negro', 'rubio', 'blanco'][i], [['#4a3a2a', '#6a523a', '#8a6c4e', '#aa8a66', '#caa882'], ['#5a2a2a', '#7a3a3a', '#9a4e4e', '#ba6666', '#d88282'], ['#2a2a3a', '#3e3e54', '#56566e', '#70708a', '#8e8ea8'], ['#3a5a2a', '#4e7a3a', '#68984e', '#86b666', '#a8d482'], ['#5a4a1a', '#7a6626', '#9a8434', '#baa24a', '#d8c066'], ['#2a2a42', '#3a3a5e', '#4e4e7c', '#66669a', '#8282b8'], ['#2a4a2a', '#3a663a', '#4e844e', '#66a266', '#82c082'], ['#3a3a3a', '#545454', '#707070', '#8e8e8e', '#aeaeae']][i]), lines: [[L2('Piedra a piedra, como lo hacían mis abuelos.', 'Stone by stone, the way my grandparents did.')], [L2('¡Pan de Vael, receta de hace cinco mil años!', 'Vael bread, a five-thousand-year-old recipe!')], [L2('Estas armas ya no sirven a ningún rey muerto.', 'These weapons serve no dead king anymore.')], [L2('¿Es verdad que venciste al rey? ¡Qué valiente!', 'Is it true you defeated the king? So brave!')], [L2('Telas moradas, el color de Vael.', 'Purple cloth, the colour of Vael.')], [L2('Vigilo que nadie toque el trono vacío.', 'I make sure nobody touches the empty throne.')], [L2('Las flores vuelven a crecer donde había huesos.', 'Flowers grow again where there were bones.')], [L2('Mi abuelo me contaba que aquí sonaban campanas.', 'My grandfather told me bells rang here.')]][i], quests: [] };
// las 5 obras: madera (troncos) y piedra (minerales) que consigues con Tala y Minería, más oro
const V660_ST = [
  { n: L2('Retirar escombros y levantar columnas', 'Clear rubble and raise columns'), w: 20, s: 20, g: 5000 },
  { n: L2('Torres del portón', 'Gate towers'), w: 40, s: 60, g: 20000 },
  { n: L2('Jardín y fuente', 'Garden and fountain'), w: 50, s: 40, g: 40000 },
  { n: L2('Mercado y vecinos (los monstruos de alrededor se van)', 'Market and neighbours (nearby monsters leave)'), w: 80, s: 60, g: 80000 },
  { n: L2('Salón del trono', 'Throne hall'), w: 100, s: 120, g: 150000 }];
const v660Kind = id => { const it = ITEMS[id]; if (!it || it.t === 'tool' || it.t === 'quest') return null; const ic = (it.icon || [])[0]; return ic === 'log' ? 'w' : (ic === 'ore' || ic === 'stone') ? 's' : null; };
function v660Count(k) { let n = 0; for (const s of G.P.inv) if (s && v660Kind(s.id) === k) n += s.q || 1; return n; }
function v660Take(k, n) { const P = G.P; for (const s of P.inv) { if (!n) break; if (!s || v660Kind(s.id) !== k) continue; const t = Math.min(n, s.q || 1); takeItem(s.id, t); n -= t; } }
const v660Done = () => !!(G.P.bossKills && G.P.bossKills.vael);
// coloca en el mapa lo construido (se vuelve a poner al cargar la partida; cada objeto lleva su etapa en o.v660)
function v660Put(W, k, x, y, o, st) { if (W.objs.some(q => q.v660 && q.tx === x && q.ty === y && q.k === k)) return; if (!canPlace(W, x, y)) return; addObj(W, k, x, y, Object.assign({ v660: st }, o || {})); }
function v660Apply() { const W = G.world, st = V660().st || 0; if (!W || !st) return; const [cx, cy] = V660_C;
  if (st >= 1) { for (const o of W.objs) if (o.k === 'pillar' && Math.hypot(o.tx - cx, o.ty - cy) < 10) { o.broken = false; o.ivy = false; } for (const [dx, dy] of [[-6, -4], [6, -4], [-6, 4], [6, 4]]) v660Put(W, 'banner', cx + dx, cy + dy, { col: '#5a2a8a' }, 1); }
  if (st >= 2) { v660Put(W, 'gatetower', cx - 3, cy - 8, {}, 2); v660Put(W, 'gatetower', cx + 3, cy - 8, {}, 2); for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + 0.2; v660Put(W, 'lantern', Math.round(cx + Math.cos(a) * 10), Math.round(cy + Math.sin(a) * 8), { kind: 'wood' }, 2); } }
  if (st >= 3) { v660Put(W, 'fountain', cx, cy + 9, {}, 3); for (const dx of [-3, -2, 2, 3]) v660Put(W, 'pot', cx + dx, cy + 9, { col: ['#c84a8a', '#8a4ac8', '#c8a04a', '#4ac88a'][(dx + 3) % 4] }, 3); v660Put(W, 'bench', cx - 5, cy + 10, {}, 3); v660Put(W, 'bench', cx + 5, cy + 10, {}, 3); }
  if (st >= 4) { v660Put(W, 'stall', cx - 9, cy + 13, { col: '#5a2a8a', fp: [[0, 0], [1, 0], [-1, 0]] }, 4); v660Put(W, 'stall', cx, cy + 14, { col: '#c8a040', fp: [[0, 0], [1, 0], [-1, 0]] }, 4); v660Put(W, 'stall', cx + 9, cy + 13, { col: '#2a6a5a', fp: [[0, 0], [1, 0], [-1, 0]] }, 4); }
  if (st >= 5) { v660Put(W, 'statue', cx - 4, cy - 6, {}, 5); v660Put(W, 'statue', cx + 4, cy - 6, {}, 5); for (const dx of [-8, 8]) v660Put(W, 'banner', cx + dx, cy - 6, { col: '#c8a040' }, 5); } }
let v660NT = 0; const V660_DUEL = { on: false };
V33_TICKS.push(dt => { v660NT -= dt || 0.016; if (v660NT > 0) return; v660NT = 1.5; try { const M = G.map; if (!M || M !== G.world || !G.P) return; const [cx, cy] = V660_C, st = V660().st || 0;
  if (Math.abs(G.P.x / 16 - cx) > 50 || Math.abs(G.P.y / 16 - cy) > 40) return;
  // con la reconstrucción empezada, el jefe ya no vuelve solo al centro de la plaza: la revancha se pide a Ilda
  const spot = (G.world.bosses || []).find(b => b.id === 'vael'); if (spot && st >= 1 && !V660_DUEL.on) { if (spot.ent && spot.ent.state !== 'fight' && !spot.ent.dying) { spot.ent.remove = true; spot.ent = null; } spot.respawn = G.t + 99999; }
  // desde la obra 4 Vael es un pueblo: los campamentos de monstruos de alrededor se van (vuelven si cargas una partida sin la obra)
  if (st >= 4) for (const c of G.world.camps || []) { if (Math.hypot(c.x - cx, c.y - cy) > 24) continue; if (c.n0 === undefined) c.n0 = c.n; c.n = 0; for (const m of c.alive || []) if (m.state !== 'chase' && m.state !== 'fight') m.remove = true; c.alive = (c.alive || []).filter(m => !m.remove); }
  v75Temp(M, 'v660_ilda', cx * 16 + 8, (cy + 16) * 16, v660Done());
  for (let i = 0; i < 8; i++) { const e = v75Temp(M, 'v660_vec' + i, (cx - 8 + (i % 4) * 5) * 16 + 8, (cy + 5 + Math.floor(i / 4) * 6) * 16, st >= 4 && (i < 4 || st >= 5)); if (e && !e._v660w) { e._v660w = 1; e.wander = 3; } }
  v75Temp(M, 'v660_eco', cx * 16 + 8, (cy - 5) * 16, st >= 5);
} catch (e) { errOnce('v660 npcs', e); } });
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v660_ilda') return; const S = V660(), st = S.st || 0;
  if (st >= 1 && !V660_DUEL.on) opts.push({ label: '⚔ ' + L2('Revancha con el Rey Vael (un recuerdo del Velo)', 'Rematch with King Vael (a memory of the Veil)'), icon: ['crown', 3], fn: () => { const spot = (G.world.bosses || []).find(b => b.id === 'vael'); if (!spot) return; V660_DUEL.on = true; spot.respawn = 0; closeDialog(); banner('⚔ ' + L2('El Velo recuerda al rey', 'The Veil remembers the king'), L2('Ve al centro de la plaza.', 'Go to the centre of the square.')); } });
  if (st >= V660_ST.length) { opts.unshift({ label: '🏰 ' + L2('¿Cómo va Vael?', 'How is Vael doing?'), icon: ['crown', 3], fn: () => typeText(L2('Vael vuelve a tener pan, mercado y campanas. Y todo gracias a ti.', 'Vael has bread, a market and bells again. All thanks to you.')) }); return; }
  const T = V660_ST[st], hw = v660Count('w'), hs = v660Count('s'), ok = hw >= T.w && hs >= T.s && G.P.gold >= T.g;
  opts.unshift({ label: '🏗 ' + (st + 1) + '/5 · ' + T.n + ' · 🪵 ' + Math.min(hw, T.w) + '/' + T.w + ' · 🪨 ' + Math.min(hs, T.s) + '/' + T.s + ' · 🪙 ' + fmt(T.g), cls: ok ? 'quest' : '', icon: ['anvil'], fn: () => v660Build() }); });
function v660Build() { const S = V660(), st = S.st || 0, T = V660_ST[st], P = G.P; if (!T) return;
  if (v660Count('w') < T.w || v660Count('s') < T.s || P.gold < T.g) { typeText(L2('Para esta obra me faltan materiales: troncos (Tala), piedra o mineral (Minería) y oro. ¡Sin prisa!', 'I still need materials for this work: logs (Woodcutting), stone or ore (Mining) and gold. No rush!')); return; }
  v660Take('w', T.w); v660Take('s', T.s); P.gold -= T.g; S.st = st + 1; v660Apply(); markDirty(true); sfx('questdone'); G.shake = 3;
  burst(P.x, P.y - 20, 30, { sp: 70, up: 80, g: 50, life: 1, c: ['#9078ba', '#ffd040', '#ffffff'] }); banner('🏰 ' + T.n, L2('Vael ', 'Vael ') + S.st + '/5');
  if (S.st >= V660_ST.length) v660Finish(); else typeText(L2('¡Obra terminada! Mira cómo ha quedado. La siguiente: ', 'Work finished! Look how it turned out. Next: ') + V660_ST[S.st].n + '.'); }
const CH_V660 = CRON.length; CRON.push([L2('Vael vuelve a sonar', 'Vael rings again'), L2('Cuando el rey muerto de Vael cayó, su fragmento dejó de torcer el reino. Los descendientes de los que huyeron volvieron con el héroe y levantaron columnas, torres, un jardín y un mercado. Al terminar el salón del trono, el Velo devolvió un eco: no el rey vencido, sino el hombre que fue antes de tocar el fragmento. No reina: cuenta la historia para que nadie vuelva a querer no morir.', 'When the dead king of Vael fell, his fragment stopped twisting the kingdom. The descendants of those who fled came back with the hero and raised columns, towers, a garden and a market. When the throne hall was finished, the Veil returned an echo: not the defeated king, but the man he was before touching the fragment. He does not reign: he tells the story so that nobody wants to stop dying again.')]);
{ const hoy = ERAS.find(e => e[1].includes(CH_ORIGEN)) || ERAS[ERAS.length - 1]; hoy[1].push(CH_V660); }
CLUES.n_v660_eco = ['npc', L2('El eco del rey', 'The king\'s echo'), L2('«Quise no morir para no dejar solo a mi pueblo. Y mi pueblo se fue para no verme. El fragmento siempre da lo contrario de lo que pides.»', '"I wanted not to die so as not to leave my people alone. And my people left so as not to see me. The fragment always gives the opposite of what you ask."'), CH_V660];
function v660Finish() { const P = G.P; P.gold += 300000; try { if (typeof loreUnlock === 'function') loreUnlock(CH_V660); if (typeof clueUnlock === 'function') clueUnlock('n_v660_eco'); } catch (e) { }
  typeText(L2('¡Vael está restaurado! Ve al salón del trono: dicen que el Velo ha devuelto a alguien. Toma, 300.000 de oro de todo el pueblo.', 'Vael is restored! Go to the throne hall: they say the Veil has returned someone. Here, 300,000 gold from the whole village.')); }
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'v660_eco') return; opts.unshift({ label: '👑 ' + L2('¿Quién eres?', 'Who are you?'), icon: ['crown', 3], fn: () => { try { if (typeof clueUnlock === 'function') clueUnlock('n_v660_eco'); } catch (e) { }
  typeText(L2('Soy lo que el Velo recuerda del rey de Vael antes del fragmento. Quise no morir para no dejar solo a mi pueblo, y mi pueblo se fue para no verme. Gracias por traerlo de vuelta. Yo solo cuento la historia.', 'I am what the Veil remembers of the King of Vael before the fragment. I wanted not to die so as not to leave my people alone, and my people left so as not to see me. Thank you for bringing them back. I only tell the story.')); } }); });
// trono del salón (dibujado; no es un objeto para no tapar el sitio del combate de revancha del centro)
WORLD_DRAW.push((cx0, cy0) => { if (G.map !== G.world || (V660().st || 0) < 5) return; const x = V660_C[0] * 16 + 8 - cx0, y = (V660_C[1] - 6) * 16 - cy0; if (x < -60 || x > VW + 60 || y < -60 || y > VH + 60) return;
  ctx.fillStyle = '#3a2a4a'; ctx.fillRect(x - 18, y - 4, 36, 10); ctx.fillStyle = '#5a2a8a'; ctx.fillRect(x - 14, y - 2, 28, 3);
  ctx.fillStyle = '#6a4a20'; ctx.fillRect(x - 8, y - 26, 16, 22); ctx.fillStyle = '#c8a040'; ctx.fillRect(x - 9, y - 30, 18, 4); ctx.fillRect(x - 7, y - 34, 3, 4); ctx.fillRect(x - 1, y - 36, 3, 6); ctx.fillRect(x + 5, y - 34, 3, 4);
  ctx.fillStyle = '#5a2a8a'; ctx.fillRect(x - 6, y - 22, 12, 14); ctx.fillStyle = '#8a5ac0'; ctx.fillRect(x - 6, y - 22, 12, 2); });
hookAfter('startGame', () => { try { v660Apply(); } catch (e) { errOnce('v660 carga', e); } });
hookAfter('killMob', (r, m) => { if (m && m.mid === 'vael') V660_DUEL.on = false; });

// ---------- ISLA VELADA (mapa propio) ----------
NPCS.v660_barq = { n: L2('Barquera Nim', 'Boatwoman Nim'), title: L2('Isla Velada', 'Veiled Isle'), look: v660Look('f', 'blanco', ['#1a3a4a', '#265266', '#346e84', '#468ca4', '#62aac4']), lines: [L2('Solo la niebla sabe cuándo baja la isla.', 'Only the fog knows when the island comes down.')], quests: [] };
it('v660_pluma', { n: L2('Pluma de Alado', 'Alado feather'), t: 'mat', stack: true, price: 3000, icon: ['wing', '#e8f4ff'], rar: 3, d: L2('Cae de los nidos de la Isla Velada, un islote de Altavela que baja con la niebla.', 'Falls from the nests of the Veiled Isle, an Altavela islet that comes down with the fog.') });
const v660Fog = () => [1, 3, 5].includes(calDay() % 7);   // 3 días de cada 7
const V660_RUN = ['◆', '●', '▲', '✦'];
const V660_I = { w: 64, h: 48 };
function v660MakeIsla() { const id = 'v660_isla', { w, h } = V660_I, N = w * h, R = new RNG(6601); G.ents = G.ents.filter(e => e.map !== id);
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.DEEP), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0.05, music: 'field', I: (x, y) => y * w + x, v660: 1 };
  const cx = w / 2, cy = h / 2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x - cx) / (w * 0.42), dy = (y - cy) / (h * 0.42), d = Math.hypot(dx, dy) + (hash2(x, y, 6602) - 0.5) * 0.08; M.ter[y * w + x] = d < 0.78 ? T.GRASS : d < 0.92 ? T.SAND : d < 1.02 ? T.WATER : T.DEEP; }
  for (let y = cy - 4; y <= cy + 4; y++) for (let x = cx - 6; x <= cx + 6; x++) M.ter[y * w + x] = T.STONE;   // plaza de las runas
  for (let y = cy + 4; y < h * 0.86; y++) M.ter[y * w + cx] = T.DIRT;   // sendero desde la playa
  M.exit = { x: -9, y: -9 }; initMapObjs(M);
  const put = (k, x, y, o) => { if (canPlace(M, x, y)) addObj(M, k, x, y, o || {}); };
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; put('pillar', Math.round(cx + Math.cos(a) * 9), Math.round(cy + Math.sin(a) * 6), { broken: k % 3 === 0, ivy: true }); }
  put('arch', cx, cy - 7, { fp: [[-1, 0], [1, 0]] });
  [[-5, -3], [5, -3], [-5, 3], [5, 3]].forEach(([dx, dy], i) => put('obelisk', cx + dx, cy + dy, { xact: 'v660run', ri: i }));
  put('sign', cx, cy + 5, { xact: 'v660mural' });
  put('lighthouse', Math.round(w * 0.78), Math.round(h * 0.22), { fp: [[0, 0], [1, 0]] });
  put('boat', cx + 2, Math.round(h * 0.9), { solid: false });
  for (let k = 0; k < 140; k++) { const x = R.int(3, w - 4), y = R.int(3, h - 4); if (M.ter[y * w + x] !== T.GRASS || Math.hypot(x - cx, y - cy) < 11 || Math.abs(x - cx) < 2) continue; put('tree', x, y, { sp: hash2(x, y, 3) < 0.5 ? 'palma' : 'cerezo', deco: true }); }
  for (let k = 0; k < 30; k++) { const x = R.int(3, w - 4), y = R.int(3, h - 4); if (M.ter[y * w + x] !== T.SAND && M.ter[y * w + x] !== T.GRASS) continue; put('rock', x, y, { size: 's', kind: '' }); }
  M.wdist = null; G.maps[id] = M; return M; }
hookAround('makeInterior', (next, id, ...a) => id === 'v660_isla' ? v660MakeIsla() : next(id, ...a));
const v660Order = () => { const R = new RNG(calDay() * 313 + 7), o = [0, 1, 2, 3]; for (let i = 3; i > 0; i--) { const j = R.int(0, i); [o[i], o[j]] = [o[j], o[i]]; } return o; };
const V660_IS = { step: 0 };
XACT.v660mural = [() => '🪧 ' + L2('Leer el mural', 'Read the mural'), 'talk', () => { const o = v660Order().map(i => V660_RUN[i]).join('  '); banner('🪧 ' + o, L2('«Despierta las piedras en el orden del viento»', '"Wake the stones in the order of the wind"')); sfx('ui'); }];
XACT.v660run = [o => '✨ ' + L2('Tocar la runa ', 'Touch rune ') + V660_RUN[o.ri | 0], 'atk', o => { const ord = v660Order(), S = V660(), P = G.P;
  if ((o.ri | 0) === ord[V660_IS.step]) { V660_IS.step++; sfx('coin'); floatText(o.px, o.py - 40, V660_RUN[o.ri | 0] + ' ' + V660_IS.step + '/4', '#9af0ff'); burst(o.px, o.py - 20, 10, { sp: 40, up: 60, g: 20, life: 0.8, c: ['#9af0ff', '#ffffff'] });
    if (V660_IS.step >= 4) { V660_IS.step = 0; const d = calDay(), first = !S.isla, today = S.islaD !== d; S.isla = (S.isla || 0) + (today ? 1 : 0); if (today) { S.islaD = d; const g = first ? 100000 : 15000 + P.lv * 50; P.gold += g; giveItem('v660_pluma', first ? 5 : 2, true);
        try { if (typeof clueUnlock === 'function') clueUnlock('p_v660_isla'); } catch (e) { } banner('🌫 ' + L2('El santuario de los Vientos despierta', 'The shrine of the Winds awakens'), '+' + fmt(g) + L2(' oro · plumas de Alado', ' gold · Alado feathers')); sfx('questdone'); }
      else banner('🌫 ' + L2('Las runas cantan otra vez', 'The runes sing again'), L2('Hoy ya recibiste el regalo de los Vientos. Vuelve otro día de niebla.', 'You already received the gift of the Winds today. Come back another foggy day.')); G.shake = 3; markDirty(true); } }
  else { V660_IS.step = 0; sfx('hurt'); floatText(o.px, o.py - 40, L2('El viento se calla…', 'The wind falls silent…'), '#ff8a8a'); } }];
CLUES.p_v660_isla = ['lugar', L2('La isla que baja con la niebla', 'The island that comes down with the fog'), L2('Columnas aladas, runas en la lengua de los Vientos y nidos de plumas blancas: es una casa de Altavela que se soltó de su nube.', 'Winged columns, runes in the language of the Winds and nests of white feathers: it is an Altavela house that came loose from its cloud.'), CH_ALADOS];
DLG_HOOKS.push((npc, opts) => { if (!npc) return;
  if (npc.id === 'marina') opts.unshift(v660Fog() ? { label: '🌫 ' + L2('Zarpar a la Isla Velada (hoy hay niebla)', 'Sail to the Veiled Isle (foggy today)'), cls: 'quest', icon: ['ways'], fn: () => { closeDialog(); v660Go(); } }
    : { label: '🌫 ' + L2('Isla Velada: hoy no hay niebla', 'Veiled Isle: no fog today'), icon: ['ways'], fn: () => typeText(L2('La isla solo baja los días de niebla (3 de cada 7). Mira en Lupa › Sistemas cuándo vuelve.', 'The island only comes down on foggy days (3 out of 7). Check Magnifier › Systems for when it returns.')) });
  if (npc.id === 'v660_barq') opts.unshift({ label: '⛵ ' + L2('Volver a Puerto Coral', 'Back to Puerto Coral'), icon: ['ways'], fn: () => { closeDialog(); exitInterior(); } }); });
function v660Go() { const P = G.P; if (typeof actBusy === 'function' && actBusy()) return; P.retX = 229 * 16 + 8; P.retY = 131 * 16; V660_IS.step = 0;
  transition(() => { P.inside = 'v660_isla'; const M = v660MakeIsla(); setMap(M, (V660_I.w / 2) * 16 + 8, Math.round(V660_I.h * 0.84) * 16, 'up');
    const b = spawnNPC('v660_barq', (V660_I.w / 2 + 3) * 16, Math.round(V660_I.h * 0.86) * 16, M.id, { face: 'up', wander: 0 }); if (b) b.v660t = 1;
    banner('🌫 ' + L2('Isla Velada', 'Veiled Isle'), L2('Un islote de Altavela que baja con la niebla. Lee el mural de la plaza.', 'An Altavela islet that comes down with the fog. Read the mural in the square.')); }); }
// niebla que se mueve sobre la isla
WORLD_DRAW.push((cx, cy) => { if (!G.map || G.map.id !== 'v660_isla') return; for (let k = 0; k < 9; k++) { const x = ((k * 173 + G.t * (8 + k)) % (VW + 300)) - 150, y = (k * 97) % VH, r = 70 + (k % 3) * 30; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(235,240,248,0.32)'); g.addColorStop(1, 'rgba(235,240,248,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); } });
// si se guardó en la isla, al cargar vuelves al puerto
hookAfter('startGame', () => { try { const P = G.P; if (P && P.inside === 'v660_isla') { P.inside = null; setMap(G.world, 229 * 16 + 8, 131 * 16, 'down'); } } catch (e) { } });
// títulos
for (const [tid, tn, cond, how] of [['t_v660_vael', L2('Restaurador de Vael', 'Restorer of Vael'), P => (P.v660 && P.v660.st) >= 5, L2('Restaura el castillo de Vael', 'Restore the castle of Vael')], ['t_v660_niebla', L2('Explorador de la niebla', 'Fog explorer'), P => !!(P.v660 && P.v660.isla), L2('Despierta el santuario de la Isla Velada', 'Awaken the shrine of the Veiled Isle')]])
  if (typeof TITLES !== 'undefined' && !TITLES.some(t => t[0] === tid)) { TITLES.push([tid, tn, 'oro', cond, how]); if (typeof TIT_ID !== 'undefined') TIT_ID[tid] = TITLES.find(t => t[0] === tid); }
// mapa y Lupa
if (typeof MAPC !== 'undefined') MAPC.v660 = ['Vael e Isla Velada', 'Vael & Veiled Isle', '#c8a0ff', 'crown'];
hookAfter('worldPOI', out => { if (!Array.isArray(out)) return; const st = (G.P && V660().st) || 0;
  out.push({ c: 'v660', x: V660_C[0], y: V660_C[1] + 16, t: '🏰 ' + L2('Reconstrucción de Vael ', 'Rebuilding Vael ') + st + '/5' + (v660Done() ? '' : L2(' (vence antes al Rey Vael)', ' (defeat King Vael first)')) });
  out.push({ c: 'v660', x: 229, y: 129, t: '🌫 ' + L2('Isla Velada: barco desde la capitana del puerto', 'Veiled Isle: boat from the harbour captain') + (v660Fog() ? L2(' · hoy hay niebla', ' · foggy today') : '') }); });
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_v660', '🏰 ' + L2('Vael restaurado e Isla Velada', 'Vael restored & Veiled Isle'), () => { const st = (G.P && V660().st) || 0, d = calDay(); let nx = 0; while (nx < 7 && ![1, 3, 5].includes((d + nx) % 7)) nx++;
  return [L2('🏰 Tras vencer al Rey Vael, Ilda de Vael te espera al sur de las Ruinas. Cinco obras con troncos (Tala), piedra o mineral (Minería) y oro: columnas y estandartes, torres del portón, jardín y fuente, mercado con vecinos y el salón del trono. Cada obra cambia las ruinas en el mapa. Con la reconstrucción empezada, el rey ya no aparece solo en la plaza: pide la revancha a Ilda (un recuerdo del Velo).', '🏰 After defeating King Vael, Ilda of Vael waits south of the Ruins. Five works with logs (Woodcutting), stone or ore (Mining) and gold: columns and banners, gate towers, garden and fountain, a market with neighbours and the throne hall. Each work changes the ruins on the map. Once rebuilding starts, the king no longer appears in the square by himself: ask Ilda for a rematch (a memory of the Veil).') + ' ' + L2('Llevas ', 'Progress ') + st + '/5.',
    L2('👑 Al terminar, el Velo devuelve el eco del rey: no el que venciste, sino el hombre que fue antes del fragmento. Capítulo nuevo en el Libro, 300.000 de oro y el título «Restaurador de Vael».', '👑 When finished, the Veil returns the king\'s echo: not the one you defeated, but the man he was before the fragment. New chapter in the Book, 300,000 gold and the title "Restorer of Vael".'),
    L2('🌫 Isla Velada: los días de niebla (3 de cada 7) la capitana del puerto de Puerto Coral te lleva. Lee el mural de la plaza y toca las 4 runas en el orden del viento. Una vez por día de niebla: oro y Plumas de Alado; la primera vez, 100.000 y el título «Explorador de la niebla».', '🌫 Veiled Isle: on foggy days (3 out of 7) the Puerto Coral harbour captain takes you there. Read the mural in the square and touch the 4 runes in the order of the wind. Once per foggy day: gold and Alado feathers; the first time, 100,000 and the title "Fog explorer".') + ' ' + (nx === 0 ? L2('Hoy hay niebla.', 'It is foggy today.') : L2('Próxima niebla en ', 'Next fog in ') + nx + L2(' días.', ' days.'))]; }, () => null]);
