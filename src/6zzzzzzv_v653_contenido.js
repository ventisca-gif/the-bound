// 6.53 · Contenido nuevo de la lista de ideas que Sergio aprobó («sí, haz todo eso»). Ya existían y no se repiten: la
// Navidad con nieve, árbol y regalo diario (4.45-4.46), visitas, favores y amistad de los vecinos (5.74-5.77), visitar la
// casa de otros jugadores, el torneo de pesca en barca de Asakusa y los trucos de la mascota adoptada.
//  1) ☕ Chocolatada navideña en Lima, Lima Norte, Trujillo y Cusco (días de Navidad del calendario, 9:00-20:00): una
//     vecina reparte chocolate caliente y panetón una vez al día por ciudad (+1 de reputación).
//  2) 🍇 Las doce uvas en España el día de Año Nuevo (0:00-23:59): doce uvas de la suerte y +2 de reputación.
//  3) 🍳 Concurso de cocina semanal (domingos, 10:00-18:00) en cada ciudad: la jueza prueba tu mejor plato de la mochila
//     contra 3 cocineros; ganar da oro y reputación. Una vez por semana.
//  4) 🐾 Tu mascota ayuda en los oficios: al talar, minar, pescar o recoger, 10 % de traer una unidad más.
//  5) 📚 Códice de colecciones (Bitácora): peces, flores y platos que has conseguido; al completar cada página, oro y un
//     título.
// Todo se juega en el mapa (NPCs y botón de acción); todo sale en Lupa › 🏙 Ciudades y vida y en «Hoy en las ciudades».
it('chocolate_cal', { n: L2('Taza de chocolate caliente', 'Cup of hot chocolate'), t: 'cons', stack: true, heal: 600, mana: 200, price: 40, icon: ['food', 3], rar: 1, d: L2('De la chocolatada navideña. Calienta el cuerpo y el alma.', 'From the Christmas hot chocolate party. Warms body and soul.') });
it('paneton', { n: L2('Panetón', 'Panettone'), t: 'cons', stack: true, heal: 1500, price: 60, icon: ['food', 5], rar: 1, d: L2('Pan dulce con frutas confitadas, el de todas las Navidades peruanas.', 'Sweet bread with candied fruit, a Peruvian Christmas classic.') });
it('uvas_suerte', { n: L2('Uvas de la suerte', 'Lucky grapes'), t: 'cons', stack: true, heal: 300, price: 10, icon: ['food', 2], rar: 1, d: L2('Una por cada campanada de Año Nuevo: ¡que el año traiga suerte!', 'One for each New Year chime: may the year bring luck!') });
NPCS.v653_choco = { n: L2('Doña Rosa', 'Doña Rosa'), title: L2('Chocolatada', 'Hot chocolate'), look: LK({ g: 'f', hairStyle: 'long', hair: HAIRS.gris || HAIRS.negro, main: pal(['#4a1010', '#6a1a1a', '#8a2a24', '#a83a30', '#c85044']) }), lines: [L2('¡Chocolate calientito para todos! ¡Feliz Navidad!', 'Hot chocolate for everyone! Merry Christmas!'), L2('El panetón con chocolate es la Navidad de verdad.', 'Panettone with hot chocolate is the real Christmas.')], quests: [] };
NPCS.v653_uvas = { n: L2('Abuela Carmen', 'Grandma Carmen'), title: L2('Año Nuevo', 'New Year'), look: LK({ g: 'f', hairStyle: 'long', hair: HAIRS.blanco || HAIRS.gris || HAIRS.negro, main: pal(['#1a3a12', '#2a5a1a', '#3a7a26', '#549a36', '#72b84c']) }), lines: [L2('Doce uvas, doce campanadas, doce deseos.', 'Twelve grapes, twelve chimes, twelve wishes.'), L2('¡Feliz Año Nuevo, cariño!', 'Happy New Year, dear!')], quests: [] };
NPCS.v653_jueza = { n: L2('Jueza de cocina', 'Cooking judge'), title: L2('Concurso de los domingos', 'Sunday contest'), look: LK({ g: 'f', hairStyle: 'long', hair: HAIRS.negro, main: pal(['#8a8a8a', '#b4b4b4', '#d8d8d8', '#ececec', '#ffffff']) }), lines: [L2('Los domingos se cocina en serio.', 'On Sundays we cook for real.'), L2('Tráeme tu mejor plato y veremos.', 'Bring me your best dish and we\'ll see.')], quests: [] };
function v653() { const P = G.P; const S = P.v653 && typeof P.v653 === 'object' ? P.v653 : (P.v653 = {}); S.choco = S.choco || {}; S.cx = S.cx || { f: {}, fl: {}, d: {}, got: {} }; return S; }
SAVEKEYS.push('v653');
const v653Navidad = () => { const D = calDate(); return D.m === 11 && D.day >= 3; };
const v653AnoNuevo = () => { const D = calDate(); return D.m === 0 && D.day === 1; };
const v653Domingo = () => calDay() % 7 === 6;
const V653_PE = ['lima', 'lima_norte', 'trujillo', 'cusco'];
let v653T = 0;
V33_TICKS.push(dt => { v653T -= dt || 0.016; if (v653T > 0) return; v653T = 1; try { const M = G.map; if (!M || !V74_CITY[M.id]) return; const a = v75Anchor(M); if (!a) return; const h = hourNow();
  if (V653_PE.includes(M.id)) v75Temp(M, 'v653_choco', a.x + 40, a.y - 30, v653Navidad() && h >= 9 && h < 20, { wander: 0 });
  if (M.id === 'espana') v75Temp(M, 'v653_uvas', a.x + 40, a.y - 30, v653AnoNuevo(), { wander: 0 });
  if (M.id !== 'machupicchu') v75Temp(M, 'v653_jueza', a.x, a.y + 44, v653Domingo() && h >= 10 && h < 18, { wander: 0 }); } catch (e) { if (typeof errOnce === 'function') errOnce('v653t', e); } });
DLG_HOOKS.push((npc, opts) => { try { const M = G.map, S = v653(), d = calDay(); if (!npc || !M) return;
  if (npc.id === 'v653_choco') { if (S.choco[M.id] === d) return; opts.unshift({ label: '☕ ' + L2('Chocolate y panetón', 'Hot chocolate and panettone'), cls: 'quest', icon: ['food', 3], fn: () => { if (S.choco[M.id] === d) return; S.choco[M.id] = d; giveItem('chocolate_cal', 2); giveItem('paneton', 1); v75Rep(M.id, 1); typeText(L2('¡Tómalo calientito! Y llévate un panetón para la casa. ¡Feliz Navidad!', 'Drink it while it\'s hot! And take a panettone home. Merry Christmas!')); markDirty(true); } }); }
  if (npc.id === 'v653_uvas') { if (S.uvas === d) return; opts.unshift({ label: '🍇 ' + L2('Las doce uvas', 'The twelve grapes'), cls: 'quest', icon: ['food', 2], fn: () => { if (S.uvas === d) return; S.uvas = d; giveItem('uvas_suerte', 12); v75Rep(M.id, 2); burst(G.P.x, G.P.y - 20, 30, { sp: 80, up: 90, g: 40, life: 1.2, c: ['#72b84c', '#ffd040', '#ffffff'] }); typeText(L2('¡Una por campanada! ¡Feliz Año Nuevo!', 'One per chime! Happy New Year!')); markDirty(true); } }); }
  if (npc.id === 'v653_jueza') { const wk = Math.floor(d / 7); if (S.cook === wk) return; opts.unshift({ label: '🍳 ' + L2('Presentar mi mejor plato', 'Present my best dish'), cls: 'quest', icon: ['food', 1], fn: () => v653Cook(M, wk) }); }
} catch (e) { } });
function v653Dishes() { const outs = new Set(RECIPES.filter(r => r.job === 'cocina').map(r => r.out)); return outs; }
function v653Cook(M, wk) { const S = v653(), P = G.P; if (S.cook === wk) return; const outs = v653Dishes();
  let best = null; for (const s of P.inv) if (s && outs.has(s.id) && ITEMS[s.id] && (!best || (ITEMS[s.id].price || 0) > (ITEMS[best].price || 0))) best = s.id;
  if (!best) { typeText(L2('Necesitas un plato cocinado en la mochila (cocina en una posada con tus cosechas o pescados).', 'You need a cooked dish in your bag (cook at an inn with your harvest or fish).')); return; }
  takeItem(best, 1); S.cook = wk; const me = Math.round(Math.sqrt(ITEMS[best].price || 10) * 10 * (0.9 + Math.random() * 0.25) + ((P.jobs.cocina || { lv: 1 }).lv || 1) * 2);
  const base = Math.round(Math.sqrt(40 + P.lv * 8) * 10), rivals = [0, 1, 2].map(() => Math.round(base * (0.75 + Math.random() * 0.5))), place = 1 + rivals.filter(r => r > me).length;
  const gold = [0, 4000 + P.lv * 40, 2000 + P.lv * 20, 800 + P.lv * 8, 300][place]; P.gold += gold; v75Rep(M.id, place === 1 ? 3 : place === 2 ? 1 : 0); markDirty(true);
  if (place === 1) { sfx('questdone'); burst(P.x, P.y - 20, 30, { sp: 70, up: 80, g: 50, life: 1, c: ['#ffd040', '#ffffff'] }); }
  typeText(L2('Probé tu ', 'I tasted your ') + ITEMS[best].n + ': ' + me + L2(' puntos. Rivales: ', ' points. Rivals: ') + rivals.join(', ') + '. ' + (place === 1 ? L2('¡Primer puesto! ', 'First place! ') : L2('Puesto ', 'Place ') + place + '. ') + '+' + fmt(gold) + L2(' de oro. ¡Vuelve el próximo domingo!', ' gold. Come back next Sunday!')); }
// 4) la mascota ayuda en los oficios
let V653_GI = null;
hookAfter('giveItem', (r, id, q, quiet) => { try { if (r === false || !id) return; V653_GI = [id, G.t]; v653Codex(id); } catch (e) { } });
hookAfter('gainJobXp', (r, job) => { try { const P = G.P; if (!P || !P.pet || !V653_GI || V653_GI[1] !== G.t || !['tala', 'mineria', 'pesca', 'herboristeria', 'recoleccion'].includes(job)) return; const id = V653_GI[0], I = ITEMS[id]; if (!I || I.t === 'quest' || I.t === 'cos' || Math.random() >= 0.1) return;
  V653_GI = null; giveItem(id, 1, true); floatText(P.x, P.y - 44, '🐾 +1 ' + I.n, '#ffd0a0'); } catch (e) { } });
// 5) Códice de colecciones
const V653_CX = [['f', '🐟', L2('Peces', 'Fish'), () => FISH.map(f => f[0]), 't_cx_mar', L2('Enciclopedia del Mar', 'Sea Encyclopedia')],
  ['fl', '🌸', L2('Flores', 'Flowers'), () => typeof FLOR !== 'undefined' ? Object.keys(FLOR).map(k => 'flor_' + k) : [], 't_cx_flor', L2('Paleta de Flores', 'Flower Palette')],
  ['d', '🍲', L2('Platos', 'Dishes'), () => [...v653Dishes()], 't_cx_receta', L2('Recetario Completo', 'Complete Cookbook')]];
let V653_SETS = null;
function v653Sets() { if (!V653_SETS) V653_SETS = V653_CX.map(([k, , , ids]) => [k, new Set(ids().filter(id => ITEMS[id]))]); return V653_SETS; }
function v653Codex(id) { if (!G.P) return; const S = v653(); for (const [k, set] of v653Sets()) if (set.has(id) && !S.cx[k][id]) { S.cx[k][id] = 1; const n = Object.keys(S.cx[k]).length, row = V653_CX.find(r => r[0] === k);
    if (n === set.size && !S.cx.got[k]) { S.cx.got[k] = 1; G.P.gold += 20000; setTimeout(() => banner('📚 ' + L2('Códice: ', 'Codex: ') + row[2] + L2(' completo', ' complete'), '🏷 ' + row[5] + ' · 🪙 20.000'), 300); } markDirty(); } }
for (const [k, , , , tid, tn] of V653_CX) if (typeof TITLES !== 'undefined' && !TITLES.some(t => t[0] === tid)) { TITLES.push([tid, tn, 'oro', P => !!(P.v653 && P.v653.cx && P.v653.cx.got && P.v653.cx.got[k]), L2('Completa el Códice de colecciones', 'Complete the collections Codex')]); if (typeof TIT_ID !== 'undefined') TIT_ID[tid] = TITLES.find(t => t[0] === tid); }
if (typeof BIT_TABS !== 'undefined') { BIT_TABS.push(['codice', '📚', L2('Códice', 'Codex')]);
  BIT_RENDER.codice = () => { const S = v653(); return `<p class="hint">${L2('Todo lo que has conseguido alguna vez (desde la versión 6.53). Completa una página: 20.000 de oro y un título.', 'Everything you have ever obtained (since version 6.53). Complete a page: 20,000 gold and a title.')}</p>` + v653Sets().map(([k, set]) => { const row = V653_CX.find(r => r[0] === k), have = [...set].filter(id => S.cx[k][id]).length;
    return `<h4>${row[1]} ${row[2]} · ${have}/${set.size}${S.cx.got[k] ? ' ✅ 🏷 ' + esc(row[5]) : ''}</h4><div class="row wrap">${[...set].map(id => S.cx[k][id] ? `<span class="chip" title="${esc(ITEMS[id].n)}">${iconHTML(ITEMS[id].icon, 18)}</span>` : `<span class="chip" style="opacity:.35">?</span>`).join('')}</div>`; }).join(''); }; }
// lo que ya llevas en la mochila cuenta al cargar la partida
hookAfter('startGame', () => { try { for (const s of G.P.inv || []) if (s) v653Codex(s.id); } catch (e) { } });
// Lupa › Ciudades y vida y «Hoy en las ciudades»
if (typeof LUPA_CIU !== 'undefined') { LUPA_CIU.push(['fiestas653', '🎄 ' + L2('Chocolatada, uvas y concurso de cocina', 'Hot chocolate, grapes and cooking contest'), () => [
    L2('☕ Chocolatada: en los días de Navidad del calendario (del 3 al final del último mes), de 9:00 a 20:00, Doña Rosa reparte chocolate caliente y panetón junto a la plaza de Lima, Lima Norte, Trujillo y Cusco (una vez al día por ciudad, +1 de reputación).', '☕ Hot chocolate party: on the calendar\'s Christmas days (from the 3rd to the end of the last month), 9:00-20:00, Doña Rosa hands out hot chocolate and panettone by the square of Lima, North Lima, Trujillo and Cusco (once a day per city, +1 reputation).'),
    L2('🍇 Año Nuevo (día 1 del primer mes): la Abuela Carmen da las doce uvas de la suerte en la plaza de España (+2 de reputación).', '🍇 New Year (day 1 of the first month): Grandma Carmen gives the twelve lucky grapes in the square of Spain (+2 reputation).'),
    L2('🍳 Concurso de cocina: los domingos de 10:00 a 18:00 la jueza espera junto a la plaza de cada ciudad. Presenta tu mejor plato de la mochila contra 3 cocineros: 1.º, 2.º o 3.º puesto dan oro y reputación. Una vez por semana.', '🍳 Cooking contest: on Sundays 10:00-18:00 the judge waits by each city\'s square. Present your best dish from the bag against 3 cooks: 1st, 2nd or 3rd place give gold and reputation. Once a week.'),
    L2('🐾 Con tu mascota a tu lado, al talar, minar, pescar o recoger a veces trae una unidad más. 📚 Bitácora › Códice: peces, flores y platos.', '🐾 With your pet by your side, chopping, mining, fishing or gathering sometimes brings one more. 📚 Logbook › Codex: fish, flowers and dishes.')], () => null]);
  const hoy = LUPA_CIU.find(s => s[0] === 'hoy'); if (hoy) { const f = hoy[2]; hoy[2] = () => { const out = f(); try { if (v653Navidad()) out.push('☕ ' + L2('Chocolatada navideña en Lima, Lima Norte, Trujillo y Cusco (9:00-20:00).', 'Christmas hot chocolate in Lima, North Lima, Trujillo and Cusco (9:00-20:00).')); if (v653AnoNuevo()) out.push('🍇 ' + L2('Las doce uvas en la plaza de España.', 'The twelve grapes in the square of Spain.')); if (v653Domingo()) out.push('🍳 ' + L2('Concurso de cocina en las plazas (10:00-18:00).', 'Cooking contest in the squares (10:00-18:00).')); } catch (e) { } return out; }; } }
