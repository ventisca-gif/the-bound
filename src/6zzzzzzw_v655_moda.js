// 6.55 · Moda (ideas aprobadas por Sergio; no existían): 🎨 tinte de ropa, 👔 3 perchas con conjuntos guardados y
// 💃 desfile de moda semanal en las ciudades.
//  - Tinte: en el Armario, la prenda cosmética puesta en cada ranura se puede teñir (8 tonos + original) por 5.000 de
//    oro. Se guarda en P.cosTint {ranura: grados} y gira el tono de su paleta (m y s) sin tocar la piel. Solo se ve
//    en tu personaje (los demás jugadores ven el color original).
//  - Perchas: guardan los cosméticos puestos (y sus tintes) en P.cosSets[0..2] y se ponen de un toque.
//  - Desfile: sábados de 16:00 a 20:00 junto a la plaza de cada ciudad. Tema de la semana (un color); la jueza mira
//    las prendas que llevas (con tinte incluido) y compites contra 3 modelos. Una vez por semana: oro y reputación.
SAVEKEYS.push('cosTint', 'cosSets', 'v655');
const TINT_HUES = [0, 30, 60, 120, 180, 220, 270, 320], TINT_COST = 5000, TINT_SLOTS = { body: 'top', legs: 'bot', feet: 'feet', head: 'head', back: 'back' };
function tintRGB(c, deg) { const a = uA(c); if (!a) return c; let r = uR(c) / 255, g = uG(c) / 255, b = uB(c) / 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  // los colores casi grises (negro, blanco) toman algo de color al teñirse
  if (s < 0.12) s = 0.35; h = (h + deg / 360) % 1;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return rgbU(Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255), a); }
const tintPal = (m, deg) => Array.isArray(m) || (m && m.length && typeof m[0] === 'number') ? Array.from(m).map(c => typeof c === 'number' ? tintRGB(c, deg) : c) : m;
// el tinte solo se aplica mientras se dibuja el atlas del jugador (o la vista previa del Armario)
let TINT_CUR = null;
hookAround('playerAtlas', (next, P, ...a) => { const t = P && P.cosTint && Object.keys(P.cosTint).length ? P.cosTint : null; if (!t) return next(P, ...a); const o = TINT_CUR; TINT_CUR = t; try { return next(P, ...a); } finally { TINT_CUR = o; } });
hookAfter('heroKey', k => TINT_CUR ? k + '|T' + JSON.stringify(TINT_CUR) : k);
hookAfter('heroLook', L => { if (!L || !TINT_CUR) return; for (const slot in TINT_CUR) { const f = TINT_SLOTS[slot], deg = +TINT_CUR[slot]; if (!f || !deg || !L[f] || typeof L[f] !== 'object') continue;
  const o = Object.assign({}, L[f]); if (o.m) o.m = tintPal(o.m, deg); if (o.s) o.s = tintPal(o.s, deg); L[f] = o; } });
// si cambias la prenda de una ranura, su tinte se quita (cada tinte es para la prenda que lo pagó)
function tintCheck() { const P = G.P; if (!P || !P.cosTint) return; P.cosTintId = P.cosTintId || {}; for (const s in P.cosTint) if (!P.cos || P.cos[s] !== P.cosTintId[s]) { delete P.cosTint[s]; delete P.cosTintId[s]; } }
hookAfter('renderWardrobe', (r, B) => { try { const P = G.P; tintCheck(); if (typeof wdMode !== 'undefined' && wdMode !== 'cos') return; const R = B.querySelector('.wdR'); if (!R || R.querySelector('.tintbox')) return;
  P.cosTint = P.cosTint || {}; P.cosSets = Array.isArray(P.cosSets) ? P.cosSets : [null, null, null]; const cur = P.cos && P.cos[wdSlot], deg = +(P.cosTint[wdSlot] || 0);
  const sw = d => { const c = tintRGB(C('#c84a4a'), d); return `rgb(${uR(c)},${uG(c)},${uB(c)})`; };
  const d = document.createElement('div'); d.className = 'tintbox';
  d.innerHTML = `<h4>🎨 ${L2('Tinte', 'Dye')} <small>(${fmt(TINT_COST)} ${L2('oro', 'gold')})</small></h4>` + (cur ? `<div class="row wrap" style="gap:.3em"><button class="btn sm ${deg ? '' : 'gold'}" data-tint="0">${L2('Original', 'Original')}</button>${TINT_HUES.slice(1).map(h => `<button class="btn sm ${deg === h ? 'gold' : ''}" data-tint="${h}" title="${h}°"><i style="display:inline-block;width:1em;height:1em;border-radius:50%;background:${sw(h)};vertical-align:middle"></i></button>`).join('')}</div>` : `<p class="hint">${L2('Ponte un cosmético en esta ranura para poder teñirlo.', 'Wear a cosmetic in this slot to dye it.')}</p>`)
    + `<h4>👔 ${L2('Perchas', 'Hangers')}</h4><div class="row wrap" style="gap:.3em">${[0, 1, 2].map(i => { const S = P.cosSets[i]; return `<span class="chip" style="display:inline-flex;gap:.3em;align-items:center">${i + 1}: ${S ? Object.keys(S.cos || {}).length + ' ' + L2('prendas', 'pieces') : L2('vacía', 'empty')} <button class="btn sm" data-cssv="${i}">💾</button>${S ? `<button class="btn sm gold" data-csld="${i}">👕</button>` : ''}</span>`; }).join('')}</div>`;
  R.appendChild(d);
  d.querySelectorAll('[data-tint]').forEach(b => b.onclick = () => { const h = +b.dataset.tint; if (h === deg) return; if (h && P.gold < TINT_COST) { toast(L2('No tienes oro suficiente para el tinte.', 'Not enough gold for the dye.'), 'warn'); return; }
    if (h) { P.gold -= TINT_COST; P.cosTint[wdSlot] = h; P.cosTintId = P.cosTintId || {}; P.cosTintId[wdSlot] = cur; sfx('coin'); } else { delete P.cosTint[wdSlot]; } refreshLook(); markDirty(true); renderPanel(); });
  d.querySelectorAll('[data-cssv]').forEach(b => b.onclick = () => { const i = +b.dataset.cssv; P.cosSets[i] = { cos: Object.assign({}, P.cos || {}), tint: Object.assign({}, P.cosTint || {}), tid: Object.assign({}, P.cosTintId || {}) }; toast('👔 ' + L2('Conjunto guardado en la percha ', 'Outfit saved on hanger ') + (i + 1), 'info'); markDirty(true); renderPanel(); });
  d.querySelectorAll('[data-csld]').forEach(b => b.onclick = () => { const S = P.cosSets[+b.dataset.csld]; if (!S) return; const W = P.wardrobe || [], cos = {}; for (const s in S.cos) if (W.includes(S.cos[s]) && COSM[S.cos[s]]) cos[s] = S.cos[s];
    P.cos = cos; P.cosTint = Object.assign({}, S.tint || {}); P.cosTintId = Object.assign({}, S.tid || {}); tintCheck(); refreshLook(); markDirty(true); sfx('ui'); renderPanel(); });
} catch (e) { if (typeof errOnce === 'function') errOnce('tintUI', e); } });

// ---------- 💃 desfile de moda semanal ----------
NPCS.v655_moda = { n: L2('Jueza de moda', 'Fashion judge'), title: L2('Desfile de los sábados', 'Saturday runway'), look: LK({ g: 'f', hairStyle: 'long', hair: HAIRS.negro, main: pal(['#2a0a2a', '#4a1448', '#6a2468', '#8a3a8a', '#b05ab0']) }), lines: [L2('La moda es contar quién eres sin decir nada.', 'Fashion is saying who you are without a word.'), L2('Los sábados por la tarde, ¡a la pasarela!', 'Saturday afternoons, to the runway!')], quests: [] };
const MODA_TEMAS = [['negro', L2('Todo de negro', 'All black'), (h, s, l) => l < 0.22], ['blanco', L2('Blanco y claro', 'White and light'), (h, s, l) => l > 0.72], ['verde', L2('Verde natural', 'Natural green'), (h, s, l) => s > 0.15 && h >= 70 && h < 170],
  ['rojo', L2('Rojo pasión', 'Passion red'), (h, s, l) => s > 0.25 && (h < 18 || h >= 335)], ['azul', L2('Azul cielo y mar', 'Sky and sea blue'), (h, s, l) => s > 0.15 && h >= 185 && h < 255], ['calido', L2('Tonos cálidos (naranja y amarillo)', 'Warm tones (orange and yellow)'), (h, s, l) => s > 0.25 && h >= 18 && h < 70], ['morado', L2('Morado y rosa', 'Purple and pink'), (h, s, l) => s > 0.15 && h >= 255 && h < 335]];
const modaTema = () => MODA_TEMAS[Math.floor(calDay() / 7) % MODA_TEMAS.length];
const modaSab = () => calDay() % 7 === 5;
function modaHSL(c) { const r = uR(c) / 255, g = uG(c) / 255, b = uB(c) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s, l]; }
function modaScore() { const P = G.P, T = modaTema(); let L = null; const o = TINT_CUR; TINT_CUR = P.cosTint && Object.keys(P.cosTint).length ? P.cosTint : null; try { L = heroLook(P.cls, normApp(P.app), gearTiers(P), P.cos || {}, {}); } finally { TINT_CUR = o; }
  let hit = 0, worn = 0; for (const slot of ['body', 'legs', 'feet', 'head', 'back']) { if (!(P.cos || {})[slot]) continue; worn++; const f = L && L[TINT_SLOTS[slot]], m = f && f.m; if (!m || typeof m[2] !== 'number') continue; const [h, s, l] = modaHSL(m[2]); if (T[2](h, s, l)) hit++; }
  return Math.round((hit * 2 + worn * 0.6 + Object.keys(P.cosTint || {}).length * 0.3) * 10) / 10; }
let v655T = 0;
V33_TICKS.push(dt => { v655T -= dt || 0.016; if (v655T > 0) return; v655T = 1; try { const M = G.map; if (!M || !V74_CITY[M.id] || M.id === 'machupicchu') return; const a = v75Anchor(M); if (!a) return; const h = hourNow(); v75Temp(M, 'v655_moda', a.x - 40, a.y + 44, modaSab() && h >= 16 && h < 20, { wander: 0 }); } catch (e) { if (typeof errOnce === 'function') errOnce('v655t', e); } });
DLG_HOOKS.push((npc, opts) => { try { if (!npc || npc.id !== 'v655_moda') return; const P = G.P, S = P.v655 = P.v655 || {}, wk = Math.floor(calDay() / 7), T = modaTema(); if (S.moda === wk) return;
  opts.unshift({ label: '💃 ' + L2('Desfilar · tema: ', 'Walk the runway · theme: ') + T[1], cls: 'quest', icon: ['hanger'], fn: () => { if (S.moda === wk) return; const M = G.map, me = modaScore();
    if (!Object.keys(P.cos || {}).length) { typeText(L2('Ponte algún cosmético en el Armario y vuelve: hoy el tema es «', 'Wear some cosmetics from the Wardrobe and come back: today\'s theme is «') + T[1] + '».'); return; }
    S.moda = wk; const rivals = [0, 1, 2].map(() => Math.round((2 + Math.random() * 6) * 10) / 10), place = 1 + rivals.filter(r => r > me).length, gold = [0, 3000 + P.lv * 30, 1500 + P.lv * 15, 600 + P.lv * 6, 200][place];
    P.gold += gold; if (V74_CITY[M.id]) v75Rep(M.id, place === 1 ? 3 : place === 2 ? 1 : 0); markDirty(true); setAnim(P, 'idle'); burst(P.x, P.y - 20, place === 1 ? 30 : 10, { sp: 60, up: 70, g: 40, life: 1, c: ['#ff9ad0', '#ffd040', '#ffffff'] }); if (place === 1) sfx('questdone');
    typeText(L2('Tu puntuación: ', 'Your score: ') + me + L2(' · modelos: ', ' · models: ') + rivals.join(', ') + '. ' + (place === 1 ? L2('¡Ganaste la pasarela! ', 'You won the runway! ') : L2('Puesto ', 'Place ') + place + '. ') + '+' + fmt(gold) + L2(' de oro. Consejo: viste prendas del color del tema (el tinte también cuenta).', ' gold. Tip: wear pieces in the theme colour (dye counts too).')); } }); } catch (e) { } });
if (typeof LUPA_CIU !== 'undefined') { LUPA_CIU.push(['moda655', '💃 ' + L2('Desfile de moda, tinte y perchas', 'Fashion runway, dye and hangers'), () => [
    L2('💃 Desfile: los sábados de 16:00 a 20:00 la jueza de moda espera junto a la plaza de cada ciudad (menos Machu Picchu). Cada semana hay un tema de color; cuantas más prendas cosméticas del color del tema lleves, más puntos. Compites contra 3 modelos: oro y reputación, una vez por semana.', '💃 Runway: on Saturdays 16:00-20:00 the fashion judge waits by each city\'s square (except Machu Picchu). Each week has a colour theme; the more cosmetic pieces of that colour you wear, the more points. You compete against 3 models: gold and reputation, once a week.'),
    L2('🎨 Tinte: Armario › Cosméticos, elige la ranura y un color (5.000 de oro). Si cambias de prenda, el tinte se quita. Solo lo ves tú. 👔 Perchas: guarda hasta 3 conjuntos y póntelos de un toque.', '🎨 Dye: Wardrobe › Cosmetics, pick the slot and a colour (5,000 gold). If you change the piece, the dye goes away. Only you see it. 👔 Hangers: save up to 3 outfits and wear them with one tap.'),
    () => '🎯 ' + L2('Tema de esta semana: ', 'This week\'s theme: ') + modaTema()[1]].map(x => typeof x === 'function' ? x() : x), () => null]);
  const hoy = LUPA_CIU.find(s => s[0] === 'hoy'); if (hoy) { const f = hoy[2]; hoy[2] = () => { const out = f(); try { if (modaSab()) out.push('💃 ' + L2('Desfile de moda en las plazas (16:00-20:00) · tema: ', 'Fashion runway in the squares (16:00-20:00) · theme: ') + modaTema()[1]); } catch (e) { } return out; }; } }
