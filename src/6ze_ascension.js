// ================= ASCENSIÓN DE CLASE (nivel 190+): misión larga, cambio estético permanente y poder equivalente =================
const ASC = {
  guerrero: { n: 'Espadachín Gemelo', d: 'Empuñas dos espadas: cada ataque básico lanza un segundo tajo (60 %).', col: '#ffd86a' },
  mago: { n: 'Archimago', d: 'Cada ataque básico dispara un segundo orbe arcano (60 %).', col: '#b48aff' },
  arquero: { n: 'Tirador Celestial', d: 'Cada disparo lanza una segunda flecha de luz (60 %).', col: '#9aff8a' },
  asesino: { n: 'Sombra Eterna', d: 'Un clon de sombra repite cada golpe (60 %).', col: '#ff5a6a' },
  bardo: { n: 'Virtuoso Legendario', d: 'Cada nota resuena dos veces (60 %).', col: '#ffd040' },
  invocador: { n: 'Señor de las Almas', d: 'Un segundo tajo espectral acompaña cada golpe (60 %).', col: '#5ab0ff' },
  pez: { n: 'Leviatán', d: 'Una segunda dentellada de agua acompaña cada golpe (60 %).', col: '#7ae8d8' },
};
const ASC_BONUS = { atk: 0.12, hp: 0.08, def: 0.05 };
NPCS.oraculo = { n: 'Oráculo Ysolde', title: 'Maestra de la Ascensión', look: LK({ hair: HAIRS.blanco, hairStyle: 'long', outfit: 'robe', eyes: 'dorado', main: P5(['#2a1a00', '#7a5a0a', '#d8a820', '#ffe070', '#ffffff']), sec: P5(['#0a0a2a', '#1a2a6a', '#3a5ac8', '#8ab0ff', '#ffffff']) }),
  lines: ['Solo quien ha llegado a la cima puede ver lo que hay más allá.', 'La Ascensión no se regala. Se gana.'] };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); const t = TOWNS.find(t => t.k === 'arxar'); if (t) { const [x, y] = freeTileNear(W, (t.x0 + t.x1) / 2 + 2, (t.y0 + t.y1) / 2 - 7); W.npcDefs.push({ id: 'oraculo', x, y, face: 'down' }); } }; }
q('asc1', { n: 'Ascensión I: La Llamada', giver: 'oraculo', lv: 190, desc: 'Demuestra tu fuerza en la Isla de las Ruinas: derrota a 20 Gólems Rúnicos y 20 Guardianes de Jade.', obj: [{ t: 'kill', m: 'golem_runico', n: 20 }, { t: 'kill', m: 'guardian_jade', n: 20 }], rew: { xp: 60000, gold: 40000 },
  offer: ['Has llegado al nivel 190. Pocos lo logran.', 'Más allá del límite está la Ascensión: tu clase despertará su verdadera forma. Pero el camino es largo.', 'Primero, demuestra tu fuerza en la Isla de las Ruinas del Archipiélago.'], prog: ['Gólems Rúnicos y Guardianes de Jade, en la Isla de las Ruinas.'], done: ['Bien. Tu cuerpo está preparado. Ahora tu espíritu.'] });
q('asc2', { n: 'Ascensión II: Ecos Antiguos', giver: 'oraculo', lv: 192, pre: 'asc1', desc: 'Purifica 25 Almas Antiguas y 25 Arpías Doradas.', obj: [{ t: 'kill', m: 'alma_antigua', n: 25 }, { t: 'kill', m: 'arpia_dorada', n: 25 }], rew: { xp: 70000, gold: 50000 },
  offer: ['Las almas de los antiguos héroes vagan por las ruinas. Libéralas.'], prog: ['Almas Antiguas y Arpías Doradas, en la Isla de las Ruinas.'], done: ['Sientes cómo te observan… y te aceptan.'] });
q('asc3', { n: 'Ascensión III: El Guardián del Naufragio', giver: 'oraculo', lv: 194, pre: 'asc2', desc: 'Derrota al Leviatán del Naufragio para obtener el agua del origen.', obj: [{ t: 'boss', b: 'leviatan' }], rew: { xp: 80000, gold: 60000 },
  offer: ['El Leviatán guarda el agua del origen. La necesitarás para el ritual.'], prog: ['El Leviatán del Naufragio, en el Archipiélago.'], done: ['El agua del origen brilla en tus manos.'] });
q('asc4', { n: 'Ascensión IV: Los Titanes Olvidados', giver: 'oraculo', lv: 196, pre: 'asc3', desc: 'Derrota al Coloso de las Ruinas y al Faraón Olvidado.', obj: [{ t: 'boss', b: 'coloso_ruinas' }, { t: 'boss', b: 'faraon' }], rew: { xp: 90000, gold: 80000 },
  offer: ['Dos titanes custodian el fuego y la piedra del origen. Véncelos a ambos.'], prog: ['El Coloso de las Ruinas y el Faraón Olvidado (Tumba Olvidada).'], done: ['Fuego, piedra y agua. Solo falta tu ofrenda.'] });
q('asc5', { n: 'Ascensión V: El Ritual', giver: 'oraculo', lv: 198, pre: 'asc4', desc: 'Entrega 5 diamantes y 4 reliquias antiguas al Oráculo para completar el ritual.', obj: [{ t: 'item', it: 'diamante', n: 5, take: 1 }, { t: 'item', it: 'reliquia_antigua', n: 4, take: 1 }, { t: 'talk', npc: 'oraculo', txt: 'Vuelve con el Oráculo Ysolde en la Ciudadela de Arxar.' }], rew: { xp: 1, gold: 100000 },
  offer: ['El último paso: una ofrenda de 5 diamantes y 4 reliquias antiguas.', 'Cuando estés listo, vuelve y realizaremos el ritual.'], prog: ['5 diamantes y 4 reliquias antiguas.'], done: ['¡Que despierte tu verdadera forma!'] });
NPCS.oraculo.quests = ['asc1', 'asc2', 'asc3', 'asc4', 'asc5'];
function ascend() {
  const P = G.P; if (!P || (P.app && P.app.asc)) return; P.app = P.app || {}; P.app.asc = 1; calcStats(P); refreshLook(); markDirty(true);
  const A = ASC[P.cls] || ASC.guerrero;
  transition(() => { openModal(`<div class="ending"><h1>¡Ascensión!</h1><p>Has despertado como <b style="color:${A.col}">${esc(A.n)}</b>.</p><p>${esc(A.d)}</p><p class="hint">Además: +${ASC_BONUS.atk * 100}% ataque, +${ASC_BONUS.hp * 100}% vida y +${ASC_BONUS.def * 100}% defensa. Tu aspecto cambia para siempre y los demás jugadores lo ven.</p><div class="row"><button class="btn gold" id="mclose">¡Gloria!</button></div></div>`, 'ending'); $('#mclose').onclick = closeModal; });
  sfx('level'); for (let i = 0; i < 4; i++) setTimeout(() => burst(P.x, P.y - 14, 40, { sp: 100, up: 80, g: 30, life: 1.4, c: [A.col, '#ffffff', '#ffe080'] }), i * 250);
}
{ const _cq = completeQuest; completeQuest = function (id) { const r = _cq.apply(this, arguments); if (id === 'asc5') ascend(); return r; }; }
{ const _cs = calcStats; calcStats = function (P) { const S = _cs(P); if (P && P.app && P.app.asc) { S.atk = Math.round(S.atk * (1 + ASC_BONUS.atk)); S.def = Math.round(S.def * (1 + ASC_BONUS.def)); S.maxhp = Math.round(S.maxhp * (1 + ASC_BONUS.hp)); if (P.hp > S.maxhp) P.hp = S.maxhp; S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); } return S; }; }
// eco del ataque básico: segundo golpe al 60 %
{ const _ba = basicAttack; basicAttack = function () {
  const P = G.P, cd0 = P ? P.atkCd : 0; const r = _ba.apply(this, arguments);
  if (!P || !P.app || !P.app.asc || P.atkCd <= cd0 || P.dead) return r; const C_ = CLASSES[P.cls], A = ASC[P.cls] || ASC.guerrero;
  delayAct(0.2, () => { const tg = P.target && !P.target.dying ? P.target : nearestMob(P.x, P.y, C_.range + 60); const ang = tg ? Math.atan2(tg.y - P.y, tg.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]), dmg = P.S.atk * 0.6;
    if (['sword', 'dagger', 'scythe', 'fins'].includes(C_.weapon)) { hitArc(P.x, P.y, ang, C_.range + 4, 2.2, dmg, { kb: 20 }); addFx({ type: 'slash', x: P.x, y: P.y, ang: ang + 0.3, arc: 2.3, r: C_.range * 0.95, dur: 0.18, col: A.col }); if (P.cls === 'asesino') burst(P.x, P.y - 10, 8, { sp: 40, up: 10, g: 0, life: 0.4, c: ['#2a0a14', '#ff5a6a'] }); sfx('swing'); }
    else { spawnProj('p', P.x + Math.cos(ang) * 6, P.y - 10, ang + 0.08, weaponProjOpts({ spd: C_.weapon === 'bow' ? 320 : 230, dmg, art: C_.weapon === 'bow' ? 'arrow' : C_.weapon === 'lute' ? 'note' : 'orb', bard: C_.weapon === 'lute' ? 1 : 0, life: C_.range / (C_.weapon === 'bow' ? 320 : 230) + 0.15 })); }
  });
  return r; }; }
// aura permanente (la ven todos: la ascensión viaja en la apariencia)
{ const _de = drawEnt; drawEnt = function (e, cx, cy) {
  if ((e.type === 'player' || e.type === 'remote') && e.app && e.app.asc && !e.dead && e.map === G.map.id) { const A = ASC[e.cls] || ASC.guerrero, x = e.x - cx, y = e.y - cy, pulse = 0.55 + Math.sin(G.t * 3) * 0.2;
    const g = ctx.createRadialGradient(x, y - 2, 1, x, y - 2, 16); g.addColorStop(0, A.col + '88'); g.addColorStop(1, A.col + '00'); ctx.globalAlpha = pulse; ctx.fillStyle = g; ctx.fillRect(x - 18, y - 12, 36, 20); ctx.globalAlpha = 1;
    ctx.strokeStyle = A.col; ctx.globalAlpha = 0.5 * pulse; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(Math.round(x), Math.round(y), 11, 4, 0, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
    if (Math.random() < 0.12) burst(e.x + (Math.random() - 0.5) * 14, e.y - 4, 1, { sp: 8, up: 30, g: -20, life: 1, c: [A.col, '#ffffff'] }); }
  return _de(e, cx, cy); }; }
