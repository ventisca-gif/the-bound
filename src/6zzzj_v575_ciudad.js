// ================= v5.75: CIUDADES QUE VIVEN =================
// 0) ▦ Atajos se desliza hacia abajo (en el móvil el último botón quedaba fuera de la pantalla).
// 1) Clima: con lluvia la gente se refugia y saca paraguas; en verano sale más.   2) Fiestas de cada país.
// 3) Tráfico con hora punta y calles vacías de madrugada.   4) Puestos que cierran de noche (algunos 24 horas).
// 5) Vecinos con nombre y rutina (casa → trabajo → almuerzo → casa).   6) Serenos y policías de noche.
// 7) Adoptar al animal de la calle que acaricias 3 días.   8) Cumpleaños de los vecinos.
// 9) Amanecer en la playa (surfistas en Lima y pescadores en Huanchaco).   10) Mercado de los sábados.
// 11) Hijos mayores con oficio.   12) Vecinos que se acuerdan de ti (reputación por ciudad y descuento).
// Sin fuerza nueva para el jugador: oro, objetos, experiencia de oficio y comodidad.

// =====================================================================================
// 0) ATAJOS CON DESPLAZAMIENTO
// =====================================================================================
{ const st = document.createElement('style'); st.textContent = `body.hubOpen #tr .trbtns{box-sizing:border-box;max-height:var(--hubMax,70vh);overflow-y:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y;scrollbar-width:thin;scrollbar-color:#ffd040 transparent}
body.hubOpen #tr .trbtns::-webkit-scrollbar{width:6px}body.hubOpen #tr .trbtns::-webkit-scrollbar-thumb{background:#ffd040;border-radius:3px}
body.hubOpen #tr .trbtns.v75more{box-shadow:0 0 0 2px var(--ink),0 6px 14px rgba(0,0,0,.6),inset 0 -14px 10px -8px rgba(255,208,64,.35)}`; document.head.appendChild(st); }
function v75HubFit() { const row = $('#tr .trbtns'); if (!row || !document.body.classList.contains('hubOpen')) return; const r = row.getBoundingClientRect(), top = r.top > 0 ? r.top : 60, max = Math.max(140, window.innerHeight - top - 8);
  if (row._v75m !== max) { row._v75m = max; row.style.setProperty('--hubMax', max + 'px'); } const more = row.scrollHeight - row.scrollTop - row.clientHeight > 6; if (row.classList.contains('v75more') !== more) row.classList.toggle('v75more', more); }
V33_TICKS.push(() => { try { v75HubFit(); } catch (e) { } });
// al tocar un botón tras deslizar no se cierra por error: solo cuenta como toque si el dedo apenas se movió
{ let y0 = 0, moved = false; document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('#tr .trbtns')) { y0 = e.clientY; moved = false; } }, true);
  document.addEventListener('pointermove', e => { if (e.target.closest && e.target.closest('#tr .trbtns') && Math.abs(e.clientY - y0) > 8) moved = true; }, true);
  document.addEventListener('click', e => { if (moved && e.target.closest && e.target.closest('#tr .trbtns')) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true); }

const v75Try = f => function () { try { return f.apply(this, arguments); } catch (e) { console.warn('v575', e); } };
function V75() { const S = V74(); for (const [k, v] of [['rep', {}], ['adopt', {}], ['lqClaim', 0], ['bday', -1], ['fest', {}]]) if (S[k] === undefined) S[k] = (v && typeof v === 'object') ? {} : v; return S; }
const v75Map = () => G.map && V74_CITY[G.map.id] ? G.map : null;
function v75Anchor(M) { const C = V74_CITY[M.id]; if (!C || !C.a) return null; const a = G.ents.find(q => q.type === 'npc' && q.id === C.a && (q.map === M.id || q._v74h === M.id)); return a ? a.home : null; }
function v75Free(M, x, y, L) { for (let k = 0; k < 16; k++) { const tx = Math.floor(x / 16), ty = Math.floor(y / 16); if (!blockedFor(M, tx, ty, L || 0)) return { x, y }; x += 16 * ((k % 3) - 1); y += 16 * (k % 2 ? 1 : -1); } return { x, y }; }
// NPC temporal de la ciudad que aparece y desaparece según una condición
function v75Temp(M, id, x, y, show, o) { let e = G.ents.find(q => q.type === 'npc' && q.id === id && (q.map === M.id || q._v75h === M.id));
  if (!e && show) { const p = v75Free(M, x, y, 0); e = spawnNPC(id, p.x, p.y, M.id, Object.assign({ face: 'down', wander: 0 }, o || {})); if (e) e.v75t = 1; }
  if (!e) return null; if (!show && e.map === M.id) { if (dist2(e.x, e.y, G.P.x, G.P.y) > 240 * 240) { e.map = 'hidden'; e._v75h = M.id; } } else if (show && e.map === 'hidden' && e._v75h === M.id) { e.map = M.id; e._v75h = null; } return e; }
// reputación por ciudad
function v75Rep(mid, n) { const S = V75(); if (!V74_CITY[mid]) return 0; if (n) { const b = S.rep[mid] || 0; S.rep[mid] = Math.round((b + n) * 10) / 10; markDirty(); if (b < 5 && S.rep[mid] >= 5) toast('😊 ' + L2('En ' + v75CityN(mid) + ' ya te conocen: te saludan por tu nombre.', 'In ' + v75CityN(mid) + ' people know you now: they greet you by name.'), 'quest'); if (b < 10 && S.rep[mid] >= 10) toast('🏷 ' + L2('En ' + v75CityN(mid) + ' eres de la casa: 10 % de descuento en los puestos.', 'In ' + v75CityN(mid) + ' you are one of them: 10% off at the stalls.'), 'quest'); } return S.rep[mid] || 0; }
function v75CityN(mid) { return ({ lima: 'Lima', lima_norte: L2('Lima Norte', 'North Lima'), trujillo: 'Trujillo', cusco: 'Cusco', machupicchu: 'Machu Picchu', mexico: L2('México', 'Mexico'), espana: L2('España', 'Spain') })[mid] || mid; }

// =====================================================================================
// 1) CLIMA  ·  2) FIESTAS (cambian la cantidad de gente: se añaden a v74Dens)
// =====================================================================================
// en las ciudades no había clima: ahora siguen el del mundo, adaptado (en Lima la lluvia es garúa/niebla; Trujillo casi nunca llueve)
{ const _cw = curWx; curWx = function () { try { const M = G.map; if (M && V74_CITY[M.id] && SETTINGS.weather && G.P && G.P.wstate) { const w = G.P.wstate.wx || 'clear';
  if (M.id === 'lima' || M.id === 'lima_norte') return /rain|storm/.test(w) ? 'fog' : w === 'snow' ? 'cloudy' : w;
  if (M.id === 'trujillo') return /rain|storm|snow|fog/.test(w) ? 'clear' : w; if (M.id === 'cusco' || M.id === 'machupicchu') return w === 'hot' ? 'clear' : w; return w === 'snow' && M.id === 'mexico' ? 'cloudy' : w; } } catch (e) { } return _cw.apply(this, arguments); }; }
{ const _dw = drawWeather; drawWeather = function () { const M = G.map; if (M && !M.isWorld && V74_CITY[M.id]) { M.isWorld = true; try { return _dw.apply(this, arguments); } catch (e) { } finally { M.isWorld = false; } return; } return _dw.apply(this, arguments); }; }
const v75Rain = () => { try { return /rain|storm/.test(curWx()); } catch (e) { return false; } };
// fiestas por mes del calendario del juego (cada mes son 7 días)
const V75_FEST = [
  { k: 'muertos', maps: ['mexico'], m: 10, n: L2('Día de Muertos', 'Day of the Dead'), col: ['#ff8a1a', '#ff3a9a', '#8a3ad8', '#ffd040', '#3ac8e8'], say: [L2('¡Ya pusimos el altar con cempasúchil!', 'We set up the altar with marigolds!'), L2('Hoy vienen a visitarnos los que se fueron.', 'Today those who left come to visit us.'), L2('¿Ya probaste el pan de muerto?', 'Have you tried the bread of the dead?')], sell: ['v75_pan_muerto', 'mx_tamal', 'mx_horchata'], host: L2('Catrina Lupe', 'Catrina Lupe') },
  { k: 'inti', maps: ['cusco', 'machupicchu'], m: 5, n: 'Inti Raymi', col: ['#ffd040', '#ff8a1a', '#e83a2a', '#3a9a4a', '#ffffff'], say: [L2('¡Que viva el Inti, el padre Sol!', 'Long live Inti, father Sun!'), L2('En Saqsaywaman se celebra la fiesta del Sol.', 'At Saqsaywaman they celebrate the Sun festival.'), L2('¡Hoy todo Cusco baila!', 'Today all Cusco dances!')], sell: ['pl_chicha', 'pe_emoliente', 'v75_chiriuchu'], host: L2('Sinchi, el Inca de la fiesta', 'Sinchi, the festival Inca') },
  { k: 'patrias', maps: ['lima', 'lima_norte', 'trujillo'], m: 6, n: L2('Fiestas Patrias', 'National Holidays'), col: ['#d81e2a', '#ffffff', '#d81e2a', '#ffffff'], say: [L2('¡Viva el Perú, carajo!', 'Long live Peru!'), L2('Hoy hay desfile y pollada en el barrio.', 'Today there is a parade and a pollada in the neighbourhood.'), L2('¡Ponte la blanquirroja!', 'Put on the red and white!')], sell: ['pe_pollada', 'pl_anticuchos', 'pl_chicha'], host: L2('Don Patricio', 'Don Patricio') },
  { k: 'marinera', maps: ['trujillo'], m: 0, n: L2('Concurso de Marinera', 'Marinera Contest'), col: ['#ffffff', '#d81e2a', '#ffd040', '#ffffff'], say: [L2('¡Trujillo baila marinera todo enero!', 'Trujillo dances marinera all January!'), L2('Mira cómo mueven el pañuelo.', 'Look how they wave the handkerchief.')], sell: ['pl_ceviche', 'pl_chicha', 'pe_alfajor'], host: L2('Doña Libertad', 'Doña Libertad') },
  { k: 'fermin', maps: ['espana'], m: 6, n: L2('San Fermín', 'San Fermín'), col: ['#ffffff', '#d81e2a', '#ffffff', '#d81e2a'], say: [L2('¡Uno de enero, dos de febrero…!', 'One of January, two of February…!'), L2('Pañuelo rojo y ropa blanca, ¡así se va a San Fermín!', 'Red scarf and white clothes, that is San Fermín!')], sell: ['es_churros', 'es_bocadillo', 'es_horchata'], host: L2('Fermín el mozo', 'Fermín the lad') },
  { k: 'feria', maps: ['espana'], m: 3, n: L2('Feria de Abril', 'April Fair'), col: ['#ff3a6a', '#ffffff', '#3a9a4a', '#ffd040'], say: [L2('¡Vamos a la caseta a bailar sevillanas!', 'Let\'s go dance sevillanas at the marquee!'), L2('Farolillos, volantes y rebujito.', 'Lanterns, frills and rebujito.')], sell: ['es_jamon', 'es_tortilla', 'es_horchata'], host: L2('Rocío la flamenca', 'Rocío the flamenca') } ];
it('v75_pan_muerto', { n: L2('Pan de muerto', 'Bread of the dead'), t: 'cons', stack: true, heal: 900, food: 7, tier: 3, price: 220, icon: ['food', 3], d: L2('Pan dulce con huesitos de azúcar. Solo en Día de Muertos.', 'Sweet bread with sugar bones. Only on the Day of the Dead.') });
it('v75_chiriuchu', { n: 'Chiriuchu', t: 'cons', stack: true, heal: 1100, food: 8, tier: 4, price: 300, icon: ['food', 4], d: L2('Plato frío del Corpus y el Inti Raymi cusqueño.', 'Cold dish of Cusco\'s Corpus and Inti Raymi.') });
function v75FestNow(mid) { let m = 0; try { m = calDate().m; } catch (e) { } return V75_FEST.find(F => F.m === m && F.maps.includes(mid)) || null; }
{ const _d = v74Dens; v74Dens = function (h, c) { let d = _d.apply(this, arguments); try { const M = G.map;
  if (v75Rain()) d *= 0.55; else if (seasonNow() === 2 && h >= 10 && h < 19) d = Math.min(1, d + 0.1);
  const F = M && v75FestNow(M.id); if (F) { if (h >= 9 && h < 24) d = Math.min(1, d + 0.25); else if (h < 2) d = Math.max(d, 0.55); } } catch (e) { } return d; }; }
// paraguas sobre la gente cuando llueve
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const r = _de.apply(this, arguments); try { if (e && e.type === 'npc' && e.map === (G.map && G.map.id) && !e.v75t && V74_CITY[e.map] && V74_CITY[e.map].re.test(e.id) && v75Rain() && v74H(e.id + 'u') < 0.75) {
  const x = Math.round(e.x - cx + 3), y = Math.round(e.y - cy - 47), col = ['#e83a3a', '#3a6ad8', '#2a2a32', '#3aa04a', '#e8c030', '#c84ab8'][Math.floor(v74H(e.id + 'c') * 6)];
  ctx.fillStyle = '#2a2018'; ctx.fillRect(x, y, 1, 22); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y + 1, 13, 7, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let k = -12; k <= 12; k += 6) ctx.fillRect(x + k, y, 1, 1); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(x - 8, y - 4, 5, 1); ctx.fillStyle = '#2a2018'; ctx.fillRect(x, y - 8, 1, 2); } } catch (er) { } return r; }; }
// guirnaldas de fiesta alrededor de la plaza, confeti y anfitrión con regalo diario
WORLD_DRAW.push((cx, cy) => { const M = v75Map(); if (!M) return; const F = v75FestNow(M.id); if (!F) return; const a = v75Anchor(M); if (!a) return;
  for (let gi = 0; gi < 6; gi++) { const gx = a.x + (gi % 3 - 1) * 150, gy = a.y - 60 + Math.floor(gi / 3) * 130, x0 = Math.round(gx - 70 - cx), y0 = Math.round(gy - cy); if (x0 > VW + 20 || x0 + 140 < -20 || y0 < -40 || y0 > VH + 40) continue;
    ctx.strokeStyle = 'rgba(40,30,20,.8)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k <= 14; k++) { const x = x0 + k * 10, y = y0 + Math.sin(k / 14 * Math.PI) * 10; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    for (let k = 0; k < 14; k++) { const x = x0 + k * 10 + 2, y = y0 + Math.sin((k + 0.5) / 14 * Math.PI) * 10, sw = Math.sin(G.t * 3 + k) * 1; ctx.fillStyle = F.col[k % F.col.length]; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y); ctx.lineTo(x + 3 + sw, y + 7); ctx.fill(); } }
  if (Math.random() < 0.25 && Math.abs(G.P.x - a.x) < 400 && Math.abs(G.P.y - a.y) < 300) part(G.P.x + (Math.random() - 0.5) * VW, G.P.y - VH / 2 + Math.random() * 40, { z: 40, vz: -20, life: 2.4, c: pick(F.col) }); });
for (const F of V75_FEST) { NPCS['v75_fest_' + F.k] = { n: F.host, title: F.n, look: LK({ g: 'f', hairStyle: 'long', hair: HAIRS.negro, outfit: 'robe', main: pal([F.col[0], F.col[0], F.col[1], F.col[1], F.col[2] || F.col[0]].map(c => c)), sec: pal(['#ffd040', '#ffd040', '#ffe880', '#fff4c0', '#ffffff']) }), lines: [F.say[0], L2('¡Feliz ' + F.n + '!', 'Happy ' + F.n + '!')], quests: [] }; if (typeof PE_SELL !== 'undefined') PE_SELL['v75_fest_' + F.k] = F.sell.filter(x => ITEMS[x]); }
DLG_HOOKS.push((npc, opts) => { try { const F = V75_FEST.find(f => npc.id === 'v75_fest_' + f.k); if (!F) return; const S = V75(), key = F.k + ':' + calDay(); if (S.fest[F.k] === calDay()) return;
  opts.unshift({ label: '🎁 ' + L2('Regalo de la fiesta', 'Festival gift'), cls: 'quest', icon: ['coin'], fn: () => { if (S.fest[F.k] === calDay()) return; S.fest[F.k] = calDay(); const g = 300 + G.P.lv * 12; G.P.gold += g; const it_ = F.sell.find(x => ITEMS[x]); if (it_) giveItem(it_, 2); v75Rep(G.map.id, 1); markDirty(true); sfx('level'); burst(npc.x, npc.y - 20, 24, { sp: 60, up: 60, g: 40, life: 1, c: F.col }); typeText(L2('¡Feliz ' + F.n + '! Toma ' + fmt(g) + ' de oro y algo rico para la fiesta.', 'Happy ' + F.n + '! Take ' + fmt(g) + ' gold and something tasty for the party.')); } }); void key; } catch (e) { } });
function v75Fest(M) { const a = v75Anchor(M); if (!a) return; for (const F of V75_FEST) if (F.maps.includes(M.id)) v75Temp(M, 'v75_fest_' + F.k, a.x - 36, a.y + 10, v75FestNow(M.id) === F && hourNow() >= 8, { wander: 1 });
  const F = v75FestNow(M.id); if (!F) return; const S = V75(); if (S._festT !== F.k + calDay()) { S._festT = F.k + calDay(); toast('🎉 ' + L2('¡Hoy es ' + F.n + ' en ' + v75CityN(M.id) + '! Busca a ' + F.host + ' en la plaza.', 'Today is ' + F.n + ' in ' + v75CityN(M.id) + '! Find ' + F.host + ' in the square.'), 'quest', 5); } }

// =====================================================================================
// 3) TRÁFICO CON HORARIO (y peatones)
// =====================================================================================
function v75TrafDens(h) { if (h < 5) return 0.15; if (h < 6) return 0.35; if (h < 7) return 0.7; if (h < 9.5) return 1; if (h < 17) return 0.75; if (h < 20.5) return 1; if (h < 23) return 0.55; return 0.3; }
function v75Traffic(M) { if (!M.lcars && !M._v75cars) return; if (!M._v75cars) M._v75cars = M.lcars.slice(); const d = v75TrafDens(hourNow()) * (v75Rain() ? 1.1 : 1), all = M._v75cars;
  const want = all.filter((c, i) => (i * 0.6180339 % 1) < d); if (want.length !== M.lcars.length) M.lcars = want; M._v75rush = d >= 1; }
// en hora punta las combis vocean más
V33_TICKS.push(v75Try(dt => { const M = v75Map(); if (!M || !M._v75rush || !M.lcars) return; for (const c of M.lcars) if (c.combi && !c.honk && Math.random() < (dt || 0.016) * 0.05) c.honk = G.t; else if (c.combi && c.honk && G.t - c.honk > 8 && Math.random() < (dt || 0.016) * 0.05) c.honk = G.t; }));
if (typeof lmPedTick === 'function') { const _pt = lmPedTick; lmPedTick = function (dt) { const r = _pt.apply(this, arguments); try { const M = G.map; if (M && M.lima && typeof LM_PED !== 'undefined') { const C = V74_CITY[M.id], cap = Math.ceil(36 * (C ? v74Dens(hourNow(), C.c) : 1)); while (LM_PED.length > cap) LM_PED.pop(); } } catch (e) { } return r; }; }

// =====================================================================================
// 4) PUESTOS QUE CIERRAN DE NOCHE  ·  12) DESCUENTO POR REPUTACIÓN
// =====================================================================================
const v75Is24 = id => v74H(id + '24') < 0.3;
function v75Closed(npc) { if (!npc || !PE_SELL[npc.id] || npc.v74nv || /^v75_/.test(npc.id) || !V74_CITY[npc.map]) return false; if (v75Is24(npc.id)) return false; const h = hourNow(); return h >= 22 || h < 7; }
DLG_HOOKS.push((npc, opts) => { try { const L_ = PE_SELL[npc.id]; if (!L_ || !V74_CITY[npc.map]) return; const P = G.P, names = L_.filter(x => ITEMS[x]).map(x => ITEMS[x].n);
  const isBuy = o => typeof o.label === 'string' && o.label.startsWith('🛒') && names.some(n => o.label.includes(n));
  if (v75Closed(npc)) { for (let i = opts.length - 1; i >= 0; i--) if (isBuy(opts[i])) opts.splice(i, 1); opts.unshift({ label: '🔒 ' + L2('Cerrado · abre a las 7:00', 'Closed · opens at 7:00'), fn: () => typeText(L2('Ya cerré, casero. Vuelve mañana temprano. Si tienes hambre, busca un puesto de noche o uno de 24 horas.', 'I am closed, friend. Come back early tomorrow. If you are hungry, look for a night stall or a 24-hour one.')) }); return; }
  if (v75Is24(npc.id) && !npc.v74nv && !/^v75_/.test(npc.id)) opts.push({ label: '🕒 ' + L2('Abierto 24 horas', 'Open 24 hours'), fn: () => typeText(L2('Aquí nunca cerramos. ¡Pasa cuando quieras!', 'We never close here. Drop by anytime!')) });
  if (v75Rep(npc.map) < 10) return;
  for (let i = 0; i < opts.length; i++) { if (!isBuy(opts[i])) continue; const id = L_.find(x => ITEMS[x] && opts[i].label.includes(ITEMS[x].n)), I = ITEMS[id], pr = Math.max(1, Math.round(I.price * 0.9));
    opts[i] = { label: '🛒 ' + I.n + ' · ' + pr.toLocaleString() + L2(' oro (-10 %)', ' gold (-10%)'), icon: I.icon, fn: () => { if (P.gold < pr) { typeText(L2('No te alcanza, casero.', 'Not enough gold, friend.')); return; } P.gold -= pr; giveItem(id, 1); sfx('coin'); typeText(L2('¡Para ti, precio de vecino!', 'Neighbour\'s price for you!')); } }; } } catch (e) { } });

// =====================================================================================
// 5) VECINOS CON NOMBRE Y RUTINA  ·  8) CUMPLEAÑOS
// =====================================================================================
const V75_RN = { pe: [['Don Julio', 'm', L2('Panadero', 'Baker')], ['Rosa', 'f', L2('Profesora', 'Teacher')], ['Kevin', 'm', L2('Mototaxista', 'Motorbike taxi driver')]],
  mx: [['Doña Lupita', 'f', L2('Tamalera', 'Tamale seller')], ['Chema', 'm', L2('Mecánico', 'Mechanic')], ['Ximena', 'f', L2('Estudiante', 'Student')]],
  es: [['Paco', 'm', L2('Camarero', 'Waiter')], ['Carmen', 'f', L2('Farmacéutica', 'Pharmacist')], ['Lucía', 'f', L2('Estudiante', 'Student')]] };
const V75_RCOL = [['#2a4a8a', '#3a62a8', '#4e7cc4', '#6a98dc', '#8ab4f0'], ['#8a2a3a', '#a83a4e', '#c45066', '#dc6a80', '#f08a9c'], ['#2a6a3a', '#3a864e', '#4ea264', '#6abc7e', '#8ad49a']];
for (const mid in V74_CITY) { const c = V74_CITY[mid].c; V75_RN[c].forEach(([n, g, job], i) => { NPCS['v75r_' + mid + '_' + i] = { n, title: job, look: LK({ g, hairStyle: g === 'f' ? 'long' : 'short', hair: [HAIRS.negro, HAIRS.castano, HAIRS.negro][i], main: pal(V75_RCOL[i]) }), lines: [L2('¡Hola! Ando con prisa, pero cuéntame.', 'Hi! I am in a hurry, but tell me.')], quests: [] }; }); }
// horario: 0 casa (dentro), 1 va al trabajo, 2 trabaja, 3 almuerza en la plaza, 4 vuelve a casa, 5 en la puerta de casa
function v75RPhase(h) { if (h < 7 || h >= 22) return 0; if (h < 8) return 1; if (h < 13) return 2; if (h < 14) return 3; if (h < 18) return 2; if (h < 19) return 4; return 5; }
const V75_RTXT = [L2('Durmiendo en casa', 'Asleep at home'), L2('Va camino al trabajo', 'On the way to work'), L2('Trabajando', 'Working'), L2('Almorzando en la plaza', 'Having lunch in the square'), L2('Vuelve a casa', 'Going home'), L2('Descansando en la puerta de casa', 'Resting at the front door')];
function v75RSetup(M) { if (M._v75r) return; const C = V74_CITY[M.id], a = v75Anchor(M); if (!C || !a) return; M._v75r = [];
  const homes = G.ents.filter(e => e.type === 'npc' && (e.map === M.id || e._v74h === M.id) && C.re.test(e.id)).map(e => e.home), R = new RNG(v74H(M.id + 'r') * 1e6 | 0);
  const near = (p, lo, hi) => { const c = homes.filter(q => { const d = Math.hypot(q.x - p.x, q.y - p.y); return d > lo * 16 && d < hi * 16; }); return c.length ? c[R.int(0, c.length - 1)] : null; };
  for (let i = 0; i < 3; i++) { const work = near(a, 6, 26) || a, home = near(work, 8, 30) || work; const id = 'v75r_' + M.id + '_' + i;
    M._v75r.push({ id, home: { x: home.x, y: home.y }, work: { x: work.x + 12, y: work.y }, lunch: { x: a.x + (i - 1) * 20, y: a.y + 24 } }); } }
function v75Routine(M, dt) { if (!M._v75r) return; const h = hourNow(), ph = v75RPhase(h), P = G.P, bd = v75BdayOf(M);
  for (const R of M._v75r) { const party = bd === R.id && h >= 18 && h < 21.5, phase = party ? 6 : ph;
    let e = G.ents.find(q => q.type === 'npc' && q.id === R.id && (q.map === M.id || q._v75h === M.id)); const tgt = phase === 6 ? R.lunch : phase === 0 || phase >= 4 ? R.home : phase === 3 ? R.lunch : R.work;
    if (!e) { if (phase === 0) continue; const p = v75Free(M, tgt.x, tgt.y, 0); e = spawnNPC(R.id, p.x, p.y, M.id, { face: 'down', wander: 0 }); if (!e) continue; e.v75t = 1; e.v75r = R; }
    e.v75ph = phase; if (phase === 0) { if (e.map === M.id && dist2(e.x, e.y, P.x, P.y) > 240 * 240 && Math.hypot(e.x - R.home.x, e.y - R.home.y) < 40) { e.map = 'hidden'; e._v75h = M.id; } }
    else if (e.map === 'hidden') { e.map = M.id; e._v75h = null; e.x = R.home.x; e.y = R.home.y; }
    if (e.map !== M.id || dlg && dlg.npc === e) continue; e.wander = 0; e.home.x = tgt.x; e.home.y = tgt.y;
    const dx = tgt.x - e.x, dy = tgt.y - e.y, L = Math.hypot(dx, dy);
    if (L > 6) { const before = e.x + e.y; moveEnt(M, e, dx / L * 40 * dt, dy / L * 40 * dt); e.dir = dirFromVec(dx, dy); setAnim(e, 'walk', true); stepAnim(e, dt, 8);
      if (Math.abs(e.x + e.y - before) < 0.05) { e._stk = (e._stk || 0) + dt; if (e._stk > 2.5 && dist2(e.x, e.y, P.x, P.y) > 260 * 260) { const s = Math.min(L, 160); e.x += dx / L * s; e.y += dy / L * s; e._stk = 0; } else if (e._stk > 1) { moveEnt(M, e, -dy / L * 40 * dt, dx / L * 40 * dt); } } else e._stk = 0; }
    else { setAnim(e, 'idle', true); if (phase === 6 && Math.random() < dt * 0.3) { floatText(e.x, e.y - 40, pick(['🎂', '🎈', '🎉', '♥']), '#ffd040'); } } } }
// la gente de la ciudad no pisa el horario de estos vecinos
{ const _un = updateNPC; updateNPC = function (e, dt) { if (e && e.v75r) return; return _un.apply(this, arguments); }; }
DLG_HOOKS.push((npc, opts) => { try { const R = npc.v75r; if (!R) return; const ph = npc.v75ph || 0, M = G.map, bd = v75BdayOf(M) === npc.id;
  opts.unshift({ label: '🗓 ' + L2('¿Qué haces ahora?', 'What are you doing now?'), icon: ['talk'], fn: () => typeText((bd ? L2('¡Hoy es mi cumpleaños! ', 'It is my birthday today! ') : '') + V75_RTXT[Math.min(5, ph)] + '. ' + L2('Me levanto a las 7, trabajo de 8 a 18 (almuerzo a la 1 en la plaza) y a las 10 de la noche ya estoy durmiendo. ¡Sígueme si quieres!', 'I get up at 7, work from 8 to 18 (lunch at 1 in the square) and by 10 at night I am asleep. Follow me if you like!')) });
  if (bd && V75().bday !== calDay()) { const food = G.P.inv.find(s => s && ITEMS[s.id] && ITEMS[s.id].t === 'cons' && (ITEMS[s.id].food || ITEMS[s.id].heal) && !ITEMS[s.id].mana);
    opts.unshift({ label: '🎂 ' + L2('Regalar por su cumpleaños', 'Give a birthday present') + (food ? ': ' + ITEMS[food.id].n : ''), cls: 'quest', icon: ['heart', '#ff8ac0'], fn: () => { if (!food) { typeText(L2('Qué detalle que te acuerdes… ¡Tráeme algo rico de comer y lo celebramos!', 'So sweet of you to remember… Bring me something tasty and we celebrate!')); return; }
      takeItem(food.id, 1); const S = V75(); S.bday = calDay(); const g = 400 + G.P.lv * 15; G.P.gold += g; v75Rep(M.id, 2); markDirty(true); sfx('level'); burst(npc.x, npc.y - 24, 26, { sp: 60, up: 70, g: 40, life: 1.1, c: ['#ff5a8a', '#ffd040', '#5ac8ff', '#ffffff'] });
      typeText(L2('¡Muchas gracias! Toma un poco de oro para ti (' + fmt(g) + '). ¡Ahora eres de la familia!', 'Thank you so much! Have some gold (' + fmt(g) + '). You are family now!')); } }); } } catch (e) { } });
function v75BdayOf(M) { if (!M || !M._v75r || !M._v75r.length) return null; const d = calDay(); if (v74H(M.id + 'b' + d) > 0.5) return null; return M._v75r[Math.floor(v74H(M.id + 'w' + d) * M._v75r.length)].id; }
// invitados: algunos vecinos se acercan a la fiesta
function v75Party(M) { const bd = v75BdayOf(M), h = hourNow(), on = bd && h >= 18 && h < 21.5, R = on && M._v75r.find(r => r.id === bd), C = V74_CITY[M.id];
  for (const e of G.ents) { if (e.type !== 'npc' || e.map !== M.id || !C.re.test(e.id)) continue;
    if (on && !e._v75g && v74H(e.id + 'g' + calDay()) < 0.04 && dist2(e.x, e.y, G.P.x, G.P.y) > 240 * 240) { e._v75g = { x: e.home.x, y: e.home.y }; const a = Math.random() * 6.28; e.home.x = e.x = R.lunch.x + Math.cos(a) * 36; e.home.y = e.y = R.lunch.y + Math.sin(a) * 22; e.wander = 1; }
    else if (!on && e._v75g && dist2(e.x, e.y, G.P.x, G.P.y) > 240 * 240) { e.home.x = e.x = e._v75g.x; e.home.y = e.y = e._v75g.y; e._v75g = null; } }
  if (on && R && G.P && dist2(G.P.x, G.P.y, R.lunch.x, R.lunch.y) < 260 * 260 && V75()._bdT !== calDay()) { V75()._bdT = calDay(); toast('🎂 ' + L2('¡Hoy cumple años ' + NPCS[bd].n + '! La fiesta es en la plaza.', 'It is ' + NPCS[bd].n + '\'s birthday today! The party is in the square.'), 'quest', 4); } }
WORLD_DRAW.push((cx, cy) => { const M = v75Map(); if (!M) return; const bd = v75BdayOf(M), h = hourNow(); if (!bd || h < 18 || h >= 21.5) return; const e = G.ents.find(q => q.id === bd && q.map === M.id); if (!e) return;
  for (let k = 0; k < 5; k++) { const x = Math.round(e.x - cx - 24 + k * 12 + Math.sin(G.t * 1.5 + k) * 2), y = Math.round(e.y - cy - 58 - (k % 2) * 6 + Math.sin(G.t * 2 + k) * 2); ctx.strokeStyle = 'rgba(40,30,20,.6)'; ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(Math.round(e.x - cx), Math.round(e.y - cy - 30)); ctx.stroke(); ctx.fillStyle = ['#ff5a8a', '#ffd040', '#5ac8ff', '#7ae07a', '#c87aff'][k]; ctx.beginPath(); ctx.ellipse(x, y, 4, 5, 0, 0, 7); ctx.fill(); } });

// =====================================================================================
// 6) SERENOS Y POLICÍAS DE NOCHE
// =====================================================================================
const V75_SER = { pe: [L2('Sereno', 'Night watchman'), L2('Serenazgo', 'Night patrol')], mx: [L2('Policía', 'Police officer'), L2('Policía de barrio', 'Neighbourhood police')], es: [L2('Policía municipal', 'Local police officer'), L2('Policía Municipal', 'Local Police')] };
for (const c of ['pe', 'mx', 'es']) for (let i = 0; i < 2; i++) NPCS['v75_ser_' + c + i] = { n: V75_SER[c][0] + ' ' + (i + 1), title: V75_SER[c][1], look: LK({ g: i ? 'f' : 'm', outfit: 'guard', hairStyle: i ? 'long' : 'short', hair: HAIRS.negro, main: pal(['#0a1430', '#14204a', '#1e2e66', '#2a4084', '#3a56a4']), sec: pal(['#6a5a0a', '#b09a1a', '#e8cc2a', '#ffe860', '#fff6b0']) }), lines: [L2('Tranquilo, de noche patrullamos el barrio.', 'Relax, we patrol the neighbourhood at night.'), L2('Si un loquito te molesta, grita y llegamos.', 'If a nutter bothers you, shout and we come.')], quests: [] };
function v75Serenos(M, dt) { const C = V74_CITY[M.id], h = hourNow(), on = h >= 21 || h < 5.5, P = G.P;
  for (let i = 0; i < 2; i++) { const id = 'v75_ser_' + C.c + i; let e = G.ents.find(q => q.type === 'npc' && q.id === id && (q.map === M.id || q._v75h === M.id));
    if (!e && on) { const a = Math.random() * 6.28, p = v75Free(M, P.x + Math.cos(a) * 280, P.y + Math.sin(a) * 200, P.L); e = spawnNPC(id, p.x, p.y, M.id, { face: 'down', wander: 0 }); if (!e) continue; e.v75t = 1; e.v75s = 1; }
    if (!e) continue; if (!on) { if (e.map === M.id && dist2(e.x, e.y, P.x, P.y) > 240 * 240) { e.map = 'hidden'; e._v75h = M.id; } continue; } if (e.map === 'hidden') { const a = Math.random() * 6.28, p = v75Free(M, P.x + Math.cos(a) * 280, P.y + Math.sin(a) * 200, P.L); e.map = M.id; e._v75h = null; e.x = p.x; e.y = p.y; }
    if (e.map !== M.id || (dlg && dlg.npc === e)) continue;
    const m = G.ents.filter(q => q.lq && !q.dying && q.map === M.id).sort((a, b) => dist2(a.x, a.y, e.x, e.y) - dist2(b.x, b.y, e.x, e.y))[0];
    let tx, ty, sp = 50; if (m && dist2(m.x, m.y, e.x, e.y) < 320 * 320) { tx = m.x + (e.x < m.x ? -16 : 16); ty = m.y; sp = 95;
      if (dist2(m.x, m.y, e.x, e.y) < 26 * 26) { e._hit = (e._hit || 0) - dt; if (e._hit <= 0) { e._hit = 1.4; const d = Math.max(1, Math.round(m.maxhp * 0.1)); m.hp -= d; m.flash = 0.15; m.v75help = 1; floatText(m.x, m.y - 30, d, '#9ad0ff'); setAnim(e, 'idle'); if (m.hp <= 0) killMob(m); else if (Math.random() < 0.3) { e.chat = pick([L2('¡Alto ahí!', 'Stop right there!'), L2('¡Calma, calma!', 'Easy, easy!'), L2('¡Te tenemos!', 'We got you!')]); e.chatT = G.t; } } } }
    else { if (dist2(e.x, e.y, P.x, P.y) > 520 * 520) { const a = Math.random() * 6.28, p = v75Free(M, P.x + Math.cos(a) * 260, P.y + Math.sin(a) * 180, P.L); if (dist2(p.x, p.y, P.x, P.y) > 200 * 200) { e.x = p.x; e.y = p.y; } }
      if (!e.pt || dist2(e.x, e.y, e.pt.x, e.pt.y) < 64) e.pt = { x: P.x + (Math.random() - 0.5) * 360, y: P.y + (Math.random() - 0.5) * 240 }; tx = e.pt.x; ty = e.pt.y; }
    const dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy); e.home.x = e.x; e.home.y = e.y; if (L > 4) { moveEnt(M, e, dx / L * sp * dt, dy / L * sp * dt); e.dir = dirFromVec(dx, dy); setAnim(e, 'walk', true); stepAnim(e, dt, sp > 60 ? 11 : 7); } } }
{ const _un = updateNPC; updateNPC = function (e, dt) { if (e && e.v75s) return; return _un.apply(this, arguments); }; }
WORLD_DRAW.push((cx, cy) => { const M = v75Map(); if (!M) return; for (const e of G.ents) { if (!e.v75s || e.map !== M.id) continue; const x = Math.round(e.x - cx), y = Math.round(e.y - cy); if (x < -30 || x > VW + 30 || y < -60 || y > VH + 30) continue; ctx.save(); ctx.globalAlpha = 0.35; ctx.drawImage(glowSprite(22, ['#fff4c0']), x + 6 - 22, y - 18 - 22); ctx.restore(); ctx.fillStyle = '#fff4c0'; ctx.fillRect(x + 6, y - 19, 3, 2); } });
DLG_HOOKS.push((npc, opts) => { try { if (!npc.v75s) return; const S = V75(), n = Math.max(0, S.lq - (S.lqClaim || 0)); if (!n) return;
  opts.unshift({ label: '🏅 ' + L2('Recompensa por ' + n + ' loquito' + (n > 1 ? 's' : '') + ' calmado' + (n > 1 ? 's' : ''), 'Reward for ' + n + ' nutter' + (n > 1 ? 's' : '') + ' calmed'), cls: 'quest', icon: ['coin'], fn: () => { const n = Math.max(0, S.lq - (S.lqClaim || 0)); if (!n) return; const g = Math.min(n, 20) * (200 + G.P.lv * 8) * (G.P.pet === 'v75_firulais' ? 1.1 : 1) | 0; S.lqClaim = S.lq; G.P.gold += g; v75Rep(G.map.id, 1); markDirty(true); sfx('coin'); typeText(L2('Gracias por ayudarnos a mantener la calma. Toma ' + fmt(g) + ' de oro de la municipalidad.', 'Thanks for helping us keep the peace. Take ' + fmt(g) + ' gold from the council.')); } }); } catch (e) { } });

// =====================================================================================
// 7) ADOPTAR AL ANIMAL DE LA CALLE
// =====================================================================================
PETS.v75_michi = { n: L2('Michi de la calle', 'Street kitty'), d: L2('Lo adoptaste en la ciudad. +5 % de experiencia de oficio.', 'Adopted in the city. +5% job experience.'), pass: 1, price: 0, look: V74_AN.gato[0] };
PETS.v75_firulais = { n: 'Firulais', d: L2('Lo adoptaste en la ciudad. +10 % de oro en favores, fiestas y recompensas de los serenos.', 'Adopted in the city. +10% gold from favours, festivals and night watch rewards.'), pass: 1, price: 0, look: V74_AN.perro[0] };
function v75PetHook(b) { const S = V75(); if (!b.akey) return; const A = S.adopt[b.akey] || (S.adopt[b.akey] = { d: [], done: 0 }); const d = calDay(); if (!A.d.includes(d)) { A.d.push(d); if (A.d.length > 5) A.d.shift(); } if (b.map) v75Rep(b.map, 0.5);
  if (A.d.length === 3 && !A.done) toast('🐾 ' + L2('¡Te ha cogido cariño! Acarícialo otra vez para adoptarlo.', 'It has grown fond of you! Pet it again to adopt it.'), 'quest'); markDirty(); }
V74_X.unshift(() => { const P = G.P, M = G.map; if (!M || !M._v74an) return null; const S = V75(); let b = null, bd = 26 * 26; for (const e of V74_ANS) { if (e.map !== M.id || e.ak === 'paloma') continue; const d = dist2(e.x, e.y, P.x, P.y); if (d < bd) { bd = d; b = e; } }
  if (!b || !b.akey) return null; const A = S.adopt[b.akey]; if (!A || A.done || A.d.length < 3) return null; const pk = b.ak === 'gato' ? 'v75_michi' : 'v75_firulais'; if ((P.pets || []).includes(pk)) return null;
  return { label: b.ak === 'gato' ? L2('Adoptar al gato', 'Adopt the cat') : L2('Adoptar al perro', 'Adopt the dog'), icon: ['heart', '#ff5a8a'], fn: () => { A.done = 1; PETS[pk].look = V74_AN[b.ak][b.v]; try { ATL.delete('PET' + pk); } catch (e) { } givePet(pk); S.petLook = S.petLook || {}; S.petLook[pk] = b.v; b.remove = true; b.map = 'hidden'; burst(b.x, b.y - 10, 20, { sp: 40, up: 50, g: 30, life: 1, c: ['#ff8ac0', '#ffffff'] }); toast('🏡 ' + L2('¡Ahora vive contigo! Lo tienes en la pestaña Mascotas.', 'It lives with you now! Find it in the Pets tab.'), 'quest', 5); markDirty(true); } }; });
// el aspecto del adoptado se guarda (cada partida puede tener un color distinto)
{ const restore = () => { try { const S = G.P && G.P.v74; if (!S || !S.petLook) return; for (const k in S.petLook) { const ak = k === 'v75_michi' ? 'gato' : 'perro'; if (PETS[k] && V74_AN[ak][S.petLook[k]]) { PETS[k].look = V74_AN[ak][S.petLook[k]]; try { ATL.delete('PET' + k); } catch (e) { } } } } catch (e) { } };
  let done = false; V33_TICKS.push(() => { if (!done && G.P && G.P.v74) { done = true; restore(); } }); }
{ const _gj = gainJobXp; gainJobXp = function (job, n) { if (G.P && G.P.pet === 'v75_michi' && n > 0) n = Math.max(1, Math.round(n * 1.05)); return _gj.call(this, job, n, ...[].slice.call(arguments, 2)); }; }

// =====================================================================================
// 9) AMANECER EN LA PLAYA  ·  10) MERCADO DE LOS SÁBADOS
// =====================================================================================
NPCS.v75_surf = { n: L2('Surfista madrugador', 'Early surfer'), title: L2('Costa Verde', 'Costa Verde'), look: LK({ g: 'm', hair: HAIRS.rubio, hairStyle: 'spiky', outfit: 'tunic', main: pal(['#0a0a10', '#14141c', '#1e1e2a', '#2a2a3a', '#3a3a4e']), sec: pal(['#0a4a6a', '#14708a', '#1e98b0', '#4ac0d8', '#9ae8f4']) }), lines: [L2('A las 6 el mar está como un espejo. ¡La mejor hora!', 'At 6 the sea is like a mirror. Best time!'), L2('Después del surf, un jugo en el malecón.', 'After surfing, a juice on the boardwalk.')], quests: [] };
NPCS.v75_surfa = Object.assign({}, NPCS.v75_surf, { n: L2('Surfista madrugadora', 'Early surfer'), look: LK({ g: 'f', hair: HAIRS.castano, hairStyle: 'long', outfit: 'tunic', main: pal(['#0a0a10', '#14141c', '#1e1e2a', '#2a2a3a', '#3a3a4e']), sec: pal(['#6a0a3a', '#901a54', '#b82a70', '#d84a90', '#f08ab8']) }) });
NPCS.v75_pesc_lima = { n: L2('Don Teodoro', 'Don Teodoro'), title: L2('Pescador del amanecer', 'Dawn fisherman'), look: LK({ g: 'm', hair: HAIRS.gris || HAIRS.blanco, outfit: 'apron', main: pal(['#2a3a4a', '#3a5068', '#4e6a88', '#6a88a8', '#8aa8c8']) }), lines: [L2('Pescado fresquito, recién salido del mar. Solo hasta las 8.', 'Fresh fish, straight from the sea. Only until 8.')], quests: [] };
NPCS.v75_pesc_tru = Object.assign({}, NPCS.v75_pesc_lima, { n: L2('Don Chepe', 'Don Chepe'), title: L2('Pescador de caballito de totora', 'Reed boat fisherman'), lines: [L2('Salimos en caballito de totora como hace dos mil años. ¿Quieres pescado?', 'We go out on reed boats like two thousand years ago. Want some fish?')] });
for (const id of ['v75_pesc_lima', 'v75_pesc_tru']) PE_SELL[id] = ['sardina', 'lubina', 'pezglobo', 'anguila'].filter(x => ITEMS[x]);
function v75Dawn(M) { const h = hourNow(), on = h >= 5 && h < 8;
  if (M.id === 'lima' && typeof lmCoast === 'function') { [260, 300, 340, 390].forEach((x, i) => v75Temp(M, i % 2 ? 'v75_surfa' : 'v75_surf', x * 16, (lmCoast(x) + 24) * 16, on, { wander: 2 }));
    v75Temp(M, 'v75_pesc_lima', 320 * 16, (lmCoast(320) + 21) * 16, on); }
  if (M.id === 'trujillo' && typeof trCoast === 'function' && typeof TR_HU !== 'undefined') v75Temp(M, 'v75_pesc_tru', (trCoast(TR_HU.pier + 3) + 5) * 16, (TR_HU.pier + 3) * 16, on); }
// el id de la surfista se repite en varios puntos: un NPC por punto
{ const _t = v75Temp; v75Temp = function (M, id, x, y, show, o) { if (id === 'v75_surf' || id === 'v75_surfa') { const key = id + '@' + Math.round(x); let e = G.ents.find(q => q.v75key === key);
  if (!e && show) { const p = v75Free(M, x, y, 0); e = spawnNPC(id, p.x, p.y, M.id, Object.assign({ face: 'down' }, o || {})); if (e) { e.v75t = 1; e.v75key = key; } } if (!e) return null;
  if (!show && e.map === M.id && dist2(e.x, e.y, G.P.x, G.P.y) > 240 * 240) { e.map = 'hidden'; e._v75h = M.id; } else if (show && e.map === 'hidden') { e.map = M.id; e._v75h = null; } return e; } return _t.apply(this, arguments); }; }
const V75_MK = { pe: [['v75_mk_fruta', L2('Casera de frutas', 'Fruit seller'), ['tomate', 'zanahoria', 'calabaza', 'uva']], ['v75_mk_pan', L2('Panadera', 'Baker'), ['pe_pan', 'pe_alfajor', 'pe_chicharron']], ['v75_mk_sem', L2('Semillero', 'Seed seller'), ['sem_trigo', 'sem_tomate', 'sem_calabaza']], ['v75_mk_jugo', L2('Juguera', 'Juice seller'), ['pe_emoliente', 'pl_chicha', 'pe_gaseosa']]],
  mx: [['v75_mk_mx1', L2('Marchanta de frutas', 'Fruit seller'), ['tomate', 'calabaza', 'melon']], ['v75_mk_mx2', L2('Elotera', 'Corn seller'), ['mx_elote', 'mx_tamal', 'mx_horchata']], ['v75_mk_mx3', L2('Semillero', 'Seed seller'), ['sem_trigo', 'sem_tomate', 'sem_calabaza']], ['v75_mk_mx4', L2('Panadero', 'Baker'), ['mx_churros', 'pan', 'mx_coco']]],
  es: [['v75_mk_es1', L2('Frutero', 'Greengrocer'), ['tomate', 'uva', 'melon']], ['v75_mk_es2', L2('Charcutera', 'Delicatessen'), ['es_jamon', 'es_tortilla', 'es_bocadillo']], ['v75_mk_es3', L2('Semillero', 'Seed seller'), ['sem_trigo', 'sem_tomate', 'sem_uva']], ['v75_mk_es4', L2('Horchatera', 'Horchata seller'), ['es_horchata', 'es_churros', 'pan']]] };
const V75_AWN = ['#e83a3a', '#3a8ad8', '#3aa04a', '#e8a020'];
for (const c in V75_MK) V75_MK[c].forEach(([id, n, sell], i) => { NPCS[id] = { n, title: L2('Mercado de los sábados', 'Saturday market'), look: LK({ g: i % 2 ? 'f' : 'm', hairStyle: i % 2 ? 'long' : 'short', outfit: 'apron', main: pal([V75_AWN[i], V75_AWN[i], V75_AWN[i], '#ffffff', '#ffffff']) }), lines: [L2('¡Solo los sábados, casero! Todo fresquito.', 'Saturdays only! Everything fresh.')], quests: [] }; PE_SELL[id] = sell.filter(x => ITEMS[x]); });
const v75Sat = () => calDay() % 7 === 5;
function v75Market(M) { const a = v75Anchor(M); if (!a) return; const C = V74_CITY[M.id], on = v75Sat() && hourNow() >= 7 && hourNow() < 14, S = V75_SEEDS_MK();
  V75_MK[C.c].forEach(([id], i) => { const e = v75Temp(M, id, a.x + (i - 1.5) * 44, a.y + 56, on); if (e) e.v75mk = i; });
  if (on && S.length && PE_SELL) { PE_SELL[V75_MK[C.c][2][0]] = S.concat(V75_MK[C.c][2][2]).filter((x, i, A) => ITEMS[x] && A.indexOf(x) === i).slice(0, 4); }
  if (on && V75()._mkT !== calDay() && dist2(G.P.x, G.P.y, a.x, a.y) < 400 * 400) { V75()._mkT = calDay(); toast('🧺 ' + L2('¡Es sábado: hay mercado en la plaza hasta las 14:00!', 'It is Saturday: market in the square until 14:00!'), 'info'); } }
const V75_SEEDS_MK = () => { try { return V74_SEEDS(); } catch (e) { return []; } };
WORLD_DRAW.push((cx, cy) => { const M = v75Map(); if (!M) return; for (const e of G.ents) { if (e.v75mk === undefined || e.map !== M.id) continue; const x = Math.round(e.x - cx), y = Math.round(e.y - cy); if (x < -40 || x > VW + 40 || y < -70 || y > VH + 20) continue;
  ctx.fillStyle = '#5a3a1a'; ctx.fillRect(x - 16, y - 44, 2, 38); ctx.fillRect(x + 14, y - 44, 2, 38); for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#ffffff' : V75_AWN[e.v75mk]; ctx.fillRect(x - 18 + k * 4.5, y - 50, 5, 8); } ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x - 18, y - 42, 36, 2);
  ctx.fillStyle = '#8a5a2a'; ctx.fillRect(x - 16, y - 2, 32, 6); ctx.fillStyle = '#a8743a'; ctx.fillRect(x - 16, y - 2, 32, 2); } });

// =====================================================================================
// 11) HIJOS MAYORES CON OFICIO
// =====================================================================================
const V75_KJ = [['tala', '🪓'], ['mineria', '⛏'], ['pesca', '🎣'], ['agricultura', '🌾']];
function v75KidMat(job) { const P = G.P, lv = (P.jobs[job] || { lv: 1 }).lv; let t = 1; for (let k = 1; k <= 11; k++) if (RESLV[k] !== undefined && lv >= RESLV[k]) t = k;
  if (job === 'tala') return ITEMS['log' + t] ? 'log' + t : 'log1'; if (job === 'mineria') return ITEMS['ore' + t] ? 'ore' + t : 'ore1';
  if (job === 'pesca') { const f = FISH.filter(f => f[2] <= t && ITEMS[f[0]]); return f.length ? f[f.length - 1][0] : 'sardina'; } const c = CROPS.filter(c => c[2] <= t); return c.length ? c[c.length - 1][0] : 'trigo'; }
let v75KT = 0; V33_TICKS.push(v75Try(dt => { v75KT += dt || 0.016; if (v75KT < 5) return; v75KT = 0; const P = G.P; if (!P || !P.kids) return; const now = Date.now();
  for (const k of P.kids) { if (!k.v75j || kidStage(k) < 2 || k.explore || k.follow || k.ret) { k.v75t = now; continue; } if (!k.v75t) k.v75t = now; const n = Math.min(8 * 60, Math.floor((now - k.v75t) / 60000)); if (n <= 0) continue; k.v75t += n * 60000;
    k.v75g = Math.min(200000, (k.v75g || 0) + n * Math.round(8 + P.lv * 1.5)); k.v75m = Math.min(40, (k.v75m || 0) + Math.floor(((k.v75mr || 0) + n) / 6)); k.v75mr = ((k.v75mr || 0) + n) % 6; markDirty(); } }));
{ const _ok = openKid; openKid = function (e) { const r = _ok.apply(this, arguments); try { const k = e && e.kid; if (!k || e.fam || !(G.P.kids || []).includes(k) || kidStage(k) < 2 || k.ret) return r; const body = $('#mbody'), row = body && body.querySelector('.row'); if (!row || $('#v75kj')) return r;
  const cur = V75_KJ.find(j => j[0] === k.v75j), pay = (k.v75g || 0) > 0 || (k.v75m || 0) > 0;
  row.insertAdjacentHTML('afterend', `<div id="v75kj" class="gsrc" style="flex-wrap:wrap"><span><b>💼 ${L2('Su trabajo', 'Their job')}:</b> ${cur ? cur[1] + ' ' + esc(JOBS[cur[0]].n) : L2('ninguno', 'none')}<br><small>${L2('Mientras está en casa (no en expedición) gana oro y materiales de tu nivel de oficio. Lo guarda para ti.', 'While at home (not on an expedition) they earn gold and materials of your job level. They keep it for you.')}</small></span>
    <div class="row wrap">${V75_KJ.map(([j, ic]) => `<button class="btn sm ${k.v75j === j ? 'gold' : ''}" data-v75kj="${j}">${ic} ${esc(JOBS[j].n)}</button>`).join('')}<button class="btn sm" data-v75kj="">✕</button>${pay ? `<button class="btn sm gold" id="v75kc">💰 ${L2('Recoger', 'Collect')} ${fmt(k.v75g || 0)} + ${k.v75m || 0}× ${esc(gName(v75KidMat(k.v75j || 'tala')))}</button>` : ''}</div></div>`);
  $$('#modal [data-v75kj]').forEach(b => b.onclick = () => { k.v75j = b.dataset.v75kj || null; k.v75t = Date.now(); markDirty(); sfx('ui'); if (k.v75j) toast('💼 ' + (k.name || '') + L2(' ya trabaja en ', ' now works in ') + JOBS[k.v75j].n, 'info'); openKid(e); });
  const c = $('#v75kc'); if (c) c.onclick = () => { const g = k.v75g || 0, m = k.v75m || 0, it_ = v75KidMat(k.v75j || 'tala'); G.P.gold += g; if (m) giveItem(it_, m); k.v75g = 0; k.v75m = 0; v74KidDia(k, '💼', L2('Le di a mi familia lo que gané trabajando.', 'I gave my family what I earned working.')); markDirty(true); sfx('coin'); toast('💰 +' + fmt(g) + (m ? ' · +' + m + ' ' + gName(it_) : ''), 'loot'); openKid(e); }; } catch (er) { console.warn(er); } return r; }; }

// =====================================================================================
// 12) VECINOS QUE SE ACUERDAN DE TI (reputación: favores, loquitos, cumpleaños, fiestas, animales)
// =====================================================================================
{ const _fd = v74FavDeliver; v74FavDeliver = function (npc) { const F = V74().fav, was = F && F.done; const r = _fd.apply(this, arguments); try { if (F && F.done && !was) { v75Rep(F.map, 2); if (G.P.pet === 'v75_firulais') { const b = Math.round(F.gold * 0.1); G.P.gold += b; toast('🐶 Firulais: +' + fmt(b), 'loot'); } } } catch (e) { } return r; }; }
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { if (m && m.lq && G.map) v75Rep(G.map.id, 1); } catch (e) { } return r; }; }
// los que te conocen te saludan por tu nombre
function v75Greet(M) { if (v75Rep(M.id) < 5) return; const P = G.P, C = V74_CITY[M.id]; for (const e of G.ents) { if (e.type !== 'npc' || e.map !== M.id || !C.re.test(e.id) || (e.chat && G.t - e.chatT < 8)) continue; if (dist2(e.x, e.y, P.x, P.y) > 50 * 50 || (e._v75gr || 0) > G.t) continue; e._v75gr = G.t + 90; if (Math.random() > 0.35) continue;
  e.chat = pick([L2('¡Hola, ' + P.name + '!', 'Hi, ' + P.name + '!'), L2('¡' + P.name + '! ¿Todo bien?', P.name + '! All good?'), L2('¡Buenas, ' + P.name + '! Gracias por lo del otro día.', 'Hi, ' + P.name + '! Thanks for the other day.')]); e.chatT = G.t; return; } }

// =====================================================================================
// TICK y 🧺 Vida diaria › Ciudades
// =====================================================================================
let v75T = 0; V33_TICKS.push(v75Try(dt => { dt = Math.min(0.05, dt || 0.016); const M = v75Map(); if (!M || G.paused) return; v75Routine(M, dt); v75Serenos(M, dt);
  v75T -= dt; if (v75T > 0) return; v75T = 1; v75RSetup(M); v75Traffic(M); v75Fest(M); v75Dawn(M); v75Market(M); v75Party(M); v75Greet(M);
  // puestos cerrados: cartel al acercarte
  const P = G.P; for (const e of G.ents) if (e.type === 'npc' && e.map === M.id && PE_SELL[e.id] && dist2(e.x, e.y, P.x, P.y) < 60 * 60 && v75Closed(e) && !(e.chat && G.t - e.chatT < 5)) { e.chat = '🔒 ' + L2('CERRADO', 'CLOSED'); e.chatT = G.t; } }));
{ const _lo = v74LifeOpen; v74LifeOpen = function (tab) { const r = _lo.apply(this, arguments); try { const chips = $('#modal .chips'); if (chips && !$('#v75ct')) { chips.insertAdjacentHTML('beforeend', `<button class="chip ${tab === 'city' ? 'on' : ''}" id="v75ct">🏙 ${L2('Ciudades', 'Cities')}</button>`); $('#v75ct').onclick = () => v75CityOpen(); } } catch (e) { } return r; }; }
function v75CityOpen() { const S = V75(), m = (() => { try { return calDate().m; } catch (e) { return 0; } })();
  const rows = Object.keys(V74_CITY).map(mid => { const r = S.rep[mid] || 0, F = V75_FEST.filter(f => f.maps.includes(mid)); return `<div class="gsrc"><span><b>${esc(v75CityN(mid))}</b> · ${L2('reputación ', 'reputation ')}${r}${r >= 10 ? ' · 🏷 -10 %' : r >= 5 ? ' · 😊' : ''}<br><small>${F.map(f => (f.m === m ? '🎉 ' : '') + esc(f.n) + ' (' + esc((typeof LANG_EN !== 'undefined' && LANG_EN ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] : MONTHS)[f.m]) + ')').join(' · ') || ''}</small></span></div>`; }).join('');
  openModal(`<div class="frame"><h3>🏙 ${L2('Ciudades', 'Cities')}</h3><p class="hint">${L2('Favores, loquitos calmados, cumpleaños, fiestas y acariciar a los animales suben tu reputación. Con 5 te saludan por tu nombre; con 10, -10 % en los puestos de esa ciudad. Mercado: sábados de 7 a 14. Puestos: cierran de 22 a 7 (algunos abren 24 horas).', 'Favours, calmed nutters, birthdays, festivals and petting animals raise your reputation. At 5 people greet you by name; at 10, -10% at that city\'s stalls. Market: Saturdays 7 to 14. Stalls close 22 to 7 (some open 24 hours).')}</p><div style="max-height:40vh;overflow:auto">${rows}</div><div class="row"><button class="btn" id="v75cb">‹ ${L2('Volver', 'Back')}</button><button class="btn" id="v75cx">${L2('Cerrar', 'Close')}</button></div></div>`);
  $('#v75cx').onclick = closeModal; $('#v75cb').onclick = () => v74LifeOpen(); }

// =====================================================================================
// LUPA › SISTEMAS
// =====================================================================================
if (typeof GSIS !== 'undefined') {
  const E = [
    ['v75_ciudad', '🏙 ' + L2('Ciudades que viven (5.75)', 'Living cities (5.75)'), [
      L2('☔ Con lluvia la mitad de la gente se refugia y los demás sacan paraguas; en verano sale más gente.', '☔ When it rains half the people take shelter and the rest open umbrellas; in summer more people come out.'),
      L2('🎉 Fiestas: Día de Muertos (México, noviembre), Inti Raymi (Cusco, junio), Fiestas Patrias (Lima, Lima Norte y Trujillo, julio), Concurso de Marinera (Trujillo, enero), San Fermín (España, julio) y Feria de Abril (España, abril). Guirnaldas, más gente, comida típica y un regalo diario del anfitrión en la plaza.', '🎉 Festivals: Day of the Dead (Mexico, November), Inti Raymi (Cusco, June), National Holidays (Lima, North Lima and Trujillo, July), Marinera Contest (Trujillo, January), San Fermín (Spain, July) and April Fair (Spain, April). Garlands, more people, typical food and a daily gift from the host in the square.'),
      L2('🚗 Hora punta de 7:00 a 9:30 y de 17:00 a 20:30 (combis voceando); de madrugada casi no hay coches ni peatones.', '🚗 Rush hour 7:00-9:30 and 17:00-20:30 (combis shouting); late at night there are hardly any cars or pedestrians.'),
      L2('🔒 Los puestos cierran de 22:00 a 7:00; algunos abren 24 horas (lo dicen al hablarles).', '🔒 Stalls close from 22:00 to 7:00; some are open 24 hours (they tell you).'),
      L2('🗓 Tres vecinos con nombre por ciudad (panadero, profesora, mototaxista…) van de casa al trabajo, almuerzan en la plaza a la 1 y vuelven a casa. Puedes seguirlos. Cada pocos días uno cumple años: fiesta en la plaza de 18:00 a 21:30; regálale comida (oro y reputación).', '🗓 Three named neighbours per city (baker, teacher, motorbike taxi…) go from home to work, have lunch in the square at 1 and go home. You can follow them. Every few days one has a birthday: party in the square 18:00-21:30; give them food (gold and reputation).'),
      L2('👮 De 21:00 a 5:30 patrullan serenos o policías con linterna. Si sale un loquito, corren a ayudarte. Háblales para cobrar la recompensa por los loquitos calmados.', '👮 From 21:00 to 5:30 night watchmen or police patrol with a torch. If a nutter appears, they run to help. Talk to them to collect the reward for calmed nutters.'),
      L2('🐾 Acaricia al mismo gato o perro 3 días distintos y podrás adoptarlo: Michi de la calle (+5 % exp. de oficio) o Firulais (+10 % de oro en favores y recompensas).', '🐾 Pet the same cat or dog on 3 different days and you can adopt it: Street kitty (+5% job exp.) or Firulais (+10% gold from favours and rewards).'),
      L2('🌅 De 5:00 a 8:00: surfistas en la Costa Verde (Lima) y pescadores con pescado fresco en Lima y Huanchaco.', '🌅 From 5:00 to 8:00: surfers on the Costa Verde (Lima) and fishermen with fresh fish in Lima and Huanchaco.'),
      L2('🧺 Sábados de 7:00 a 14:00: mercado en la plaza con 4 puestos (frutas, pan, semillas de temporada y bebidas).', '🧺 Saturdays 7:00-14:00: market in the square with 4 stalls (fruit, bread, seasonal seeds and drinks).'),
      L2('💼 Hijos mayores: al hablar con ellos elige su oficio (tala, minería, pesca o agricultura). Mientras están en casa ganan oro y materiales; recógelos con «Recoger».', '💼 Grown-up children: when you talk to them choose their job (woodcutting, mining, fishing or farming). While at home they earn gold and materials; pick them up with «Collect».'),
      L2('😊 Reputación por ciudad (▦ Atajos › 🧺 › 🏙 Ciudades): con 5 te saludan por tu nombre; con 10, -10 % en los puestos.', '😊 Reputation per city (▦ Shortcuts › 🧺 › 🏙 Cities): at 5 they greet you by name; at 10, -10% at the stalls.')]] ];
  for (const [id, t, lines] of E.reverse()) GSIS.unshift([id, t, () => lines, () => null]);
}
