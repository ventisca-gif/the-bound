// 6.36 · El maná importa y el mago y el arquero aguantan más (Sergio: «mejora el mago y el arquero, sin exagerar, y
// revisa el maná de todas las clases: creo que cada habilidad gasta muy poca»).
// Medido (tools/dev/mana.py): con las 4 habilidades más altas lanzadas en cuanto se recargan, el mago, el bardo y el
// invocador gastaban solo el 8-20 % de lo que recuperan en combate a nivel 300-600 (maná infinito) y las demás clases el
// 40-90 %. El coste era fijo (20-200) y la barra crece con el nivel (hasta 23.000).
// 1) Coste real = el mayor entre el de siempre y un % de tu maná máximo según la recarga: 21,6 % × recarga / 60 s
//    (una de 9 s ≈ 3 %, una de 30 s ≈ 11 %, una de 60 s ≈ 22 %). Así lanzar las 4 en cuanto salen gasta ~1,1 veces lo que
//    recuperas en combate en todas las clases y niveles: hay que elegir, sin quedarte seco enseguida. Solo habilidades de
//    tu clase (y de la evolución); frutas, Voluntad, subrazas y runas siguen igual. La barra marca en gris las que no
//    alcanzan y la ficha de la habilidad dice el coste real.
// 2) Arquero: Espíritu del Bosque cura un 25 % (+2 por nivel, antes 20 %), recarga 24 s (antes 30) y además da +20 % de
//    defensa 8 s. Mago: Escudo Arcano absorbe un 30 % (+3, antes 25 %) y Armadura de Escarcha da +30 % de defensa
//    (+3, antes 25 %) durante 25 s (antes 20).
const MANA_K = 0.216;
function skillMpCost(id) { const P = G.P, s = SK[id]; if (!s || !P || !P.S) return s ? s.mp || 0 : 0; const own = s.cls === P.cls || (s.evo && s.cls === P.cls);
  if (!own || s.fruit || s.cq || /^sr_/.test(s.cls || '')) return s.mp || 0; return Math.max(s.mp || 0, Math.round(P.S.maxmp * MANA_K * (s.cd || 10) / 60)); }
hookAround('useSkill', (next, slot, ...a) => { const P = G.P, id = P && P.slots && P.slots[slot], s = id && SK[id]; if (!s || s.type !== 'act' || !P.skills[id]) return next(slot, ...a);
  const cost = skillMpCost(id), extra = cost - (s.mp || 0); if (extra <= 0) return next(slot, ...a);
  if ((P.cds[id] || 0) <= 0 && P.mp < cost) { toast(L2('Maná insuficiente', 'Not enough mana') + ' (' + fmt(cost) + ')', 'warn'); return; }
  const cd0 = P.cds[id] || 0, r = next(slot, ...a); if (cd0 <= 0 && (P.cds[id] || 0) > 0) { P.mp = Math.max(0, P.mp - extra); uiDirty.hud = true; } return r; });
hookAfter('updateHUD', () => { const P = G.P; if (!P || !P.slots) return; document.querySelectorAll('.sk').forEach((b, i) => { const id = P.slots[i]; if (id && SK[id] && P.skills[id]) b.classList.toggle('nomp', P.mp < skillMpCost(id)); }); });
hookAfter('renderPanel', () => { try { if (typeof panelTab === 'undefined' || panelTab !== 'skills' || !skSel || !SK[skSel] || SK[skSel].type !== 'act' || !G.P) return; const c = skillMpCost(skSel); if (c <= (SK[skSel].mp || 0)) return;
  const st = document.querySelector('#pbody .stats'); if (st && !st.querySelector('.mpreal')) st.insertAdjacentHTML('beforeend', `<div class="mpreal"><small>${L2('Coste real con tu maná: ', 'Real cost with your mana: ')}<b>${fmt(c)}</b> (${Math.round(c / G.P.S.maxmp * 100)} %)</small></div>`); } catch (e) { } });
// ---------- mago y arquero ----------
if (SK.a7 && SK.a7.eff) { SK.a7.eff.p = 25; SK.a7.cd = 24; SK.a7.d = L2('Recuperas el {p}% de tu vida máxima y ganas +20 % de defensa durante 8 s.', 'You recover {p}% of your max HP and gain +20% defence for 8 s.'); }
if (SK.m11 && SK.m11.eff) SK.m11.eff.p = 30;
if (SK.m7 && SK.m7.eff) { SK.m7.eff.st.defP = 30; SK.m7.eff.dur = 25; SK.m7.d = L2('Durante 25 s: +{defP}% defensa.', 'For 25 s: +{defP}% defence.'); }
hookAround('useSkill', (next, slot, ...a) => { const P = G.P, id = P && P.slots && P.slots[slot]; if (id !== 'a7') return next(slot, ...a); const cd0 = P.cds[id] || 0, r = next(slot, ...a);
  if (cd0 <= 0 && (P.cds[id] || 0) > 0 && typeof addBuff === 'function') { addBuff(P, 'a7_def', { defP: 20 }, 8); calcStats(P); } return r; });
if (typeof GSIS !== 'undefined') GSIS.unshift(['mana636', '🔷 ' + L2('Maná y habilidades (6.36)', 'Mana and skills (6.36)'), () => [
  L2('Cada habilidad de tu clase cuesta lo de siempre o un % de tu maná máximo según su recarga, lo que sea mayor: una de 9 s ≈ 3 %, de 30 s ≈ 11 %, de 60 s ≈ 22 %. Lanzarlas todas en cuanto salen gasta algo más de lo que recuperas en combate: elige cuáles. Fuera de combate el maná se recupera más rápido.', 'Each class skill costs its usual amount or a % of your max mana based on its cooldown, whichever is higher: 9 s ≈ 3%, 30 s ≈ 11%, 60 s ≈ 22%. Casting them all as soon as they are ready costs a bit more than you regain in combat: choose. Out of combat mana comes back faster.'),
  L2('La ficha de cada habilidad dice el coste real y la barra la pone en gris si no te llega.', 'Each skill’s card shows the real cost and the bar greys it out if you can’t afford it.'),
  L2('Arquero: Espíritu del Bosque cura más, se recarga antes y da +20 % de defensa 8 s. Mago: Escudo Arcano y Armadura de Escarcha protegen más.', 'Archer: Forest Spirit heals more, recharges sooner and gives +20% defence for 8 s. Mage: Arcane Shield and Frost Armour protect more.')
], () => null]);

// 6.37 · El maná se recupera algo más rápido (Sergio: «que se recupere también algo más rápido»): en combate 1,2 → 1,45 %
// del máximo por segundo y fuera de combate 3 → 4 %. Con el coste de la 6.36, lanzar las 4 habilidades en cuanto salen
// gasta ~lo mismo que recuperas (×1,0): la barra baja al empezar la pelea y se mantiene. Como el coste y la recuperación
// van en % del maná máximo, subir Inteligencia/maná en las estadísticas no hace falta (ni ayuda a lanzar más).
hookAfter('updatePlayer', (r, dt) => { const P = G.P; if (!P || P.dead || !P.S || !(dt > 0) || P.mp >= P.S.maxmp || (typeof SCENE !== 'undefined' && SCENE)) return;
  const ooc = G.t - (P.combatT || -99) > 6 && G.t - (P.lastHurt || -99) > 6; P.mp = Math.min(P.S.maxmp, P.mp + P.S.maxmp * (ooc ? 0.01 : 0.0025) * dt); });
{ const i = typeof GSIS !== 'undefined' ? GSIS.findIndex(g => g[0] === 'mana636') : -1; if (i >= 0) { const f = GSIS[i][2]; GSIS[i][2] = () => f().concat([L2('Desde la 6.37 el maná se recupera más rápido: 1,45 % por segundo en combate y 4 % fuera. Como el coste y la recuperación van en % de tu maná máximo, no hace falta subir Inteligencia para lanzar más habilidades.', 'Since 6.37 mana regenerates faster: 1.45% per second in combat and 4% out of combat. As cost and regen are a % of your max mana, you don’t need Intelligence to cast more skills.')]); } }
