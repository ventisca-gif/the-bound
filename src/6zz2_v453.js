// =====================================================================================
// v4.53: TÍTULOS (se ganan por poder y logros, se equipan en el Vestuario › Títulos y se ven sobre tu
// personaje y online) + guías nuevas en la lupa (Arma Velada, herrería, arma despertada, maestría,
// clase despertada, camino al poder máximo).
// =====================================================================================
const TIT_ST = {
  plata: ['#5a5a6a', '#d8d8e8', '#ffffff', '#d8d8e8'], natural: ['#1a6a2a', '#6ae07a', '#e0ffc0', '#6ae07a'], hielo: ['#2a6ab0', '#8ad8ff', '#ffffff', '#8ad8ff'],
  oro: ['#8a5a10', '#ffd040', '#fff6c0', '#ffd040'], fuego: ['#a01800', '#ff5a1a', '#ffe060', '#ff5a1a'], sangre: ['#4a0010', '#c81a2a', '#ff7a7a', '#c81a2a'],
  sombra: ['#2a0a4a', '#8a5aff', '#e8d8ff', '#8a5aff'], astral: ['#5a3aff', '#c070ff', '#ff8ad8', '#8ad8ff', '#5a3aff'], amor: ['#a01a4a', '#ff6aa0', '#ffe0ec', '#ff6aa0'],
  gotico: ['#16121c', '#4a4258', '#d8d0e0', '#4a4258'], arcoiris: ['#ff4a4a', '#ffb04a', '#ffff6a', '#6aff8a', '#6ac8ff', '#b06aff', '#ff4a4a'] };
const TIT_ANIM = new Set(['astral', 'arcoiris', 'fuego', 'oro']);
const TITLES = [
  ['t_aventurero', L2('Aventurero', 'Adventurer'), 'plata', () => true, L2('Lo tienes desde el principio.', 'You have it from the start.')],
  ['t_aprendiz', L2('Aprendiz de Cazador', 'Apprentice Hunter'), 'plata', P => titPw(P) >= 3000, L2('Llega a 3.000 de poder.', 'Reach 3,000 power.')],
  ['t_veterano', L2('Guerrero Veterano', 'Veteran Warrior'), 'natural', P => titPw(P) >= 10000, L2('Llega a 10.000 de poder.', 'Reach 10,000 power.')],
  ['t_elite', L2('Élite', 'Elite'), 'hielo', P => titPw(P) >= 20000, L2('Llega a 20.000 de poder.', 'Reach 20,000 power.')],
  ['t_heroe', L2('Héroe del Reino', 'Hero of the Realm'), 'oro', P => titPw(P) >= 30000, L2('Llega a 30.000 de poder.', 'Reach 30,000 power.')],
  ['t_leyenda', L2('Leyenda Viviente', 'Living Legend'), 'fuego', P => titPw(P) >= 40000, L2('Llega a 40.000 de poder.', 'Reach 40,000 power.')],
  ['t_mito', L2('Mito Inmortal', 'Immortal Myth'), 'astral', P => titPw(P) >= 50000, L2('Llega a 50.000 de poder (todo al máximo y transformado).', 'Reach 50,000 power (everything maxed and transformed).')],
  ['t_cima', L2('Cima del Mundo', 'Top of the World'), 'oro', P => P.lv >= MAXLV, L2('Llega al nivel máximo.', 'Reach max level.')],
  ['t_despertado', L2('El Despertado', 'The Awakened'), 'sombra', P => !!P.evo, L2('Despierta tu clase (misiones de nivel 240 en Celestia).', 'Awaken your class (level 240 quests in Celestia).')],
  ['t_velo', L2('Portador del Velo', 'Veil Bearer'), 'sombra', P => !!(P.vrW || hasItemAny(P, /^wv_/)), L2('Consigue el Arma Velada.', 'Get the Veiled Weapon.')],
  ['t_velo2', L2('Voluntad del Velo', 'Will of the Veil'), 'astral', P => !!(P.vrW && P.vrW.st >= 3), L2('Despierta del todo el Arma Velada (1.000 criaturas del Velo).', 'Fully awaken the Veiled Weapon (1,000 Veil creatures).')],
  ['t_forja', L2('Forjado en Acero', 'Forged in Steel'), 'plata', P => Object.values(P.equip || {}).some(e => e && (e.up || 0) >= 10), L2('Mejora una pieza a +10 en la herrería.', 'Upgrade a piece to +10 at the blacksmith.')],
  ['t_alma_arma', L2('Alma del Arma', 'Weapon Soul'), 'hielo', P => !!(P.equip && P.equip.weapon && wlvOf(P.equip.weapon) >= 10), L2('Despierta tu arma al nivel 10.', 'Awaken your weapon to level 10.')],
  ['t_maestro', L2('Maestro de Armas', 'Weapon Master'), 'oro', P => Object.keys(P.wm || {}).some(t => (P.wm[t] || 0) >= wmCum(WM_MAX)), L2('Llega a maestría 50 con un arma.', 'Reach mastery 50 with a weapon.')],
  ['t_oro', L2('Cazador de Oro', 'Gold Hunter'), 'oro', P => (hunt().rank || 0) >= 3, L2('Rango Oro en la Torre de los Portales.', 'Gold rank at the Portal Tower.')],
  ['t_astral', L2('Cazador Astral', 'Astral Hunter'), 'astral', P => (hunt().rank || 0) >= 5, L2('Rango Astral en la Torre de los Portales.', 'Astral rank at the Portal Tower.')],
  ['t_luna', L2('Hijo de la Luna', 'Child of the Moon'), 'natural', P => P.sr === 'lobo', L2('Sé de la subraza Lobo.', 'Be of the Wolf subrace.')],
  ['t_errante', L2('Alma Errante', 'Wandering Soul'), 'hielo', P => P.sr === 'fantasma', L2('Sé de la subraza Fantasma.', 'Be of the Ghost subrace.')],
  ['t_noche', L2('Señor de la Noche', 'Lord of the Night'), 'sangre', P => P.sr === 'vampiro', L2('Sé de la subraza Vampiro.', 'Be of the Vampire subrace.')],
  ['t_corazon', L2('Corazón Unido', 'United Heart'), 'amor', P => !!P.partner, L2('Cásate.', 'Get married.')],
  ['t_coliseo', L2('Campeón del Coliseo', 'Coliseum Champion'), 'fuego', P => (P.arWins || 0) >= 1, L2('Gana un combate online en el Coliseo.', 'Win an online fight at the Coliseum.')],
  ['t_sistema', L2('Disciplina del Sistema', 'System Discipline'), 'hielo', P => (P.dqN || 0) >= 7, L2('Completa 7 misiones diarias del Sistema.', 'Complete 7 System daily quests.')],
  ['t_gotico', L2('Alma Gótica', 'Gothic Soul'), 'gotico', P => GT_NEW.filter(g => (P.wardrobe || []).includes(g[0])).length >= 5, L2('Ten 5 prendas del Taller de Morwenna.', 'Own 5 items from Morwenna\'s Workshop.')],
  ['t_magnate', L2('Magnate', 'Tycoon'), 'oro', P => (P.gold || 0) >= 10000000, L2('Ten 10 millones de oro.', 'Have 10 million gold.')],
  ['t_arcoiris', L2('Coleccionista de Títulos', 'Title Collector'), 'arcoiris', P => titOwned(P).length >= 15, L2('Consigue 15 títulos.', 'Collect 15 titles.')],
];
const TIT_ID = {}; for (const t of TITLES) TIT_ID[t[0]] = t;
function titPw(P) { return (P.S && P.S.power) || 0; }
function hasItemAny(P, re) { return (P.inv || []).some(s => s && re.test(s.id)) || Object.values(P.equip || {}).some(e => e && re.test(e.id)); }
function titOwned(P) { P.titles = P.titles || ['t_aventurero']; return P.titles; }
// se comprueban cada pocos segundos; al ganar uno, aviso
let titT = 0;
V33_TICKS.push(dt => { const P = G.P; if (!P || !P.S) return; titT -= dt || 0; if (titT > 0) return; titT = 3;
  try { const Q = typeof dq === 'function' ? dq() : null; if (Q && Q.done && P.dqLast !== Q.d) { P.dqLast = Q.d; P.dqN = (P.dqN || 0) + 1; } } catch (e) { }
  const own = titOwned(P); for (const t of TITLES) { if (own.includes(t[0])) continue; let ok = false; try { ok = t[3](P); } catch (e) { } if (ok) { own.push(t[0]); banner('🏷 ' + L2('Nuevo título: ', 'New title: ') + t[1], L2('Equípalo en el Vestuario › Títulos', 'Equip it in Wardrobe › Titles')); sfx('level'); markDirty(); } } });
// victorias online en el Coliseo
{ const _ae = arenaEnd; arenaEnd = function (won) { if (won === true && G.P) G.P.arWins = (G.P.arWins || 0) + 1; return _ae.apply(this, arguments); }; }

// ---------- letras con estilo: degradado, borde, brillo que se mueve y adornos ----------
const TIT_CACHE = new Map();
function titSprite(text, st) { const anim = TIT_ANIM.has(st), ph = anim ? Math.floor(G.t * 6) % 12 : 0, key = text + '|' + st + '|' + ph; let c = TIT_CACHE.get(key); if (c) return c;
  if (TIT_CACHE.size > 300) TIT_CACHE.clear(); const W_ = textSprite(text, '#ffffff', null), B = textSprite(text, st === 'gotico' ? '#e8e0f0' : '#0a0610', null), w = W_.width, h = W_.height, cols = TIT_ST[st] || TIT_ST.plata;
  c = mkCanvas(w + 14, h + 4); const x = c.getContext('2d'); x.imageSmoothingEnabled = false; const ox = 7, oy = 2;
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) x.drawImage(B, ox + dx, oy + dy);
  const t = mkCanvas(w, h), tx = t.getContext('2d'); tx.drawImage(W_, 0, 0); tx.globalCompositeOperation = 'source-in'; const g = tx.createLinearGradient(-w + (ph / 12) * w * 2, 0, w + (ph / 12) * w * 2, h); cols.forEach((col, i) => g.addColorStop(i / (cols.length - 1), col)); tx.fillStyle = g; tx.fillRect(0, 0, w, h);
  x.drawImage(t, ox, oy);
  // adornos: rombos a los lados (y cruces en el gótico)
  const dc = cols[1], hi = cols[2], my = oy + (h >> 1); for (const sx of [2, w + 11]) { if (st === 'gotico') { x.fillStyle = hi; x.fillRect(sx, my - 2, 1, 5); x.fillRect(sx - 1, my - 1, 3, 1); } else { x.fillStyle = dc; x.fillRect(sx, my - 1, 1, 3); x.fillRect(sx - 1, my, 3, 1); x.fillStyle = hi; x.fillRect(sx, my, 1, 1); } }
  if (anim) { const sx = ox + ((ph * 7) % (w + 4)) - 2; x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(255,255,255,0.4)'; x.fillRect(sx, 0, 1, h + 4); }
  TIT_CACHE.set(key, c); return c; }
function titDraw(e, title, cx, cy, lift) { const t = TIT_ID[title]; if (!t || !e.atlas) return; const A = e.atlas, top = Math.round(e.y - cy - A.ay + (A.fh - (e.hgt || 34)) - 6), s = titSprite(t[1], t[2]); ctx.drawImage(s, Math.round(e.x - cx - s.width / 2), top - lift - s.height); }
WORLD_DRAW.push((cx, cy) => { const P = G.P; if (P && P.title && !P.spect && !P.invis && !(P.riding && false)) titDraw(P, P.title, cx, cy, 2);
  for (const r of G.remote.values()) if (r.map === P.map && r.title) titDraw(r, r.title, cx, cy, 10); });
// online: se envía el título equipado
{ const _ep = extraPresence; extraPresence = function (o) { const r = _ep.apply(this, arguments); if (G.P && G.P.title) o.tt = G.P.title; return r; }; }
{ const _er = extraRecv; extraRecv = function (r, pr) { _er.apply(this, arguments); r.title = typeof pr.tt === 'string' && TIT_ID[pr.tt] ? pr.tt : null; }; }

// ---------- Vestuario › Títulos ----------
{ const _rw = renderWardrobe; renderWardrobe = function (B) { const tit = wdMode === 'tit'; if (tit) wdMode = 'cos'; const r = _rw.apply(this, arguments); if (tit) wdMode = 'tit';
    try { const chips = B.querySelector('.wdL .chips'); if (chips && !chips.querySelector('[data-wt]')) { const b = document.createElement('button'); b.className = 'chip' + (tit ? ' on' : ''); b.dataset.wt = 1; b.textContent = '🏷 ' + L2('Títulos', 'Titles'); b.onclick = () => { wdMode = 'tit'; sfx('ui'); renderPanel(); }; chips.appendChild(b); if (tit) chips.querySelectorAll('[data-wm]').forEach(x => x.classList.remove('on')); }
      if (tit) { const P = G.P, own = titOwned(P), R = B.querySelector('.wdR'), hint = B.querySelector('.wdL .hint'); if (hint) hint.textContent = L2('Los títulos salen encima de tu personaje y los ven los demás jugadores online.', 'Titles show above your character and other online players see them.');
        R.innerHTML = `<h4>${L2('Tus títulos', 'Your titles')} ${own.length}/${TITLES.length}</h4><div class="wdlist"><button class="wdo ${!P.title ? 'on' : ''}" data-tt=""><span>${L2('Sin título', 'No title')}</span></button>${TITLES.filter(t => own.includes(t[0])).map(t => `<button class="wdo ${P.title === t[0] ? 'on' : ''}" data-tt="${t[0]}"><canvas data-tc="${t[0]}" style="image-rendering:pixelated;height:22px"></canvas></button>`).join('')}</div>
          <h4>${L2('Por conseguir', 'To unlock')}</h4><div class="wdcoll">${TITLES.filter(t => !own.includes(t[0])).map(t => `<span><b>${esc(t[1])}</b> <small>· ${esc(t[4])}</small></span>`).join('')}</div>`;
        R.querySelectorAll('[data-tc]').forEach(cv => { const t = TIT_ID[cv.dataset.tc], s = titSprite(t[1], t[2]); cv.width = s.width; cv.height = s.height; cv.style.width = (s.width * 2) + 'px'; cv.style.height = (s.height * 2) + 'px'; cv.getContext('2d').drawImage(s, 0, 0); });
        R.querySelectorAll('[data-tt]').forEach(b => b.onclick = () => { P.title = b.dataset.tt || null; sfx('equip'); netPresence(true); markDirty(true); renderPanel(); }); } } catch (e) { console.warn(e); } return r; }; }

// ---------- guías nuevas en la lupa › Sistemas ----------
if (typeof GSIS !== 'undefined') {
  GSIS.push(['poder', '💪 ' + L2('Camino al poder máximo', 'Road to max power'), () => [
    L2('Poder = ataque × 2 + defensa × 1,5 + vida ÷ 10. Lo ves en el menú del personaje y lo mide el cristal de la Torre.', 'Power = attack × 2 + defence × 1.5 + HP ÷ 10. You see it in the character menu and the Tower crystal measures it.'),
    L2('Nivel 350 con el mejor equipo de tu nivel: unos 20.500–22.000.', 'Level 350 with the best gear for your level: about 20,500–22,000.'),
    L2('+ todo a +10 en la herrería, arma despertada al 10 y maestría 50: unos 37.700–41.000.', '+ everything at +10 at the blacksmith, weapon awakened to 10 and mastery 50: about 37,700–41,000.'),
    L2('+ clase despertada: unos 41.300–45.700.', '+ awakened class: about 41,300–45,700.'),
    L2('+ subraza transformada: Lobo 47.500–52.900, Vampiro 46.000–51.000, Fantasma 45.000–50.000 (sin transformarte la subraza no suma poder).', '+ transformed subrace: Wolf 47,500–52,900, Vampire 46,000–51,000, Ghost 45,000–50,000 (untransformed, the subrace adds no power).'),
    L2('Mascotas, anillos, comida y familia suman algo más.', 'Pets, rings, food and family add a bit more.')], () => null]);
  GSIS.push(['velada', '🗡 ' + L2('Arma Velada', 'Veiled Weapon'), () => [
    L2('La mejor arma de cada clase (nivel 350, +8 % de ataque sobre el arma normal de ese nivel).', 'The best weapon of every class (level 350, +8% attack over the normal weapon of that level).'),
    L2('Cómo conseguirla: en el Velo Roto, entra al Jardín y reúne los fragmentos del nombre de El Sin Nombre (los conejos sonrientes y el jardín esconden las sílabas). Acércate a él y pronuncia su nombre: se vuelve vulnerable y al vencerle te da el Arma Velada de tu clase.', 'How to get it: in the Broken Veil, enter the Garden and gather the fragments of the Nameless One\'s name (the smiling rabbits and the garden hide the syllables). Go near him and say his name: he becomes vulnerable and beating him gives you the Veiled Weapon of your class.'),
    L2('Crece con cada criatura del Velo que vences: a las 300 eliges camino (Guardiana: escudos para ti y tu grupo; Devoradora: más daño a criaturas malditas y robo de vida) y a las 1.000 despierta del todo.', 'It grows with every Veil creature you defeat: at 300 you choose a path (Guardian: shields for you and your group; Devourer: more damage to cursed creatures and life steal) and at 1,000 it fully awakens.')], () => null]);
  GSIS.push(['herreria', '🔨 ' + L2('Herrería: mejorar a +10', 'Blacksmith: upgrade to +10'), () => [
    L2('Habla con un herrero › Mejorar equipo. Cada nivel da +8 % a las estadísticas de la pieza (en +10: +80 %).', 'Talk to a blacksmith › Upgrade gear. Each level gives +8% to the piece\'s stats (at +10: +80%).'),
    L2('De +0 a +4 usa Piedra de mejora I, de +4 a +7 Piedra II y de +7 a +10 Piedra III, más oro (sube con el nivel de la pieza).', 'From +0 to +4 it uses Upgrade Stone I, +4 to +7 Stone II and +7 to +10 Stone III, plus gold (higher for higher-level pieces).'),
    L2('Mejora todo: arma, casco, pecho, piernas, botas, anillo y collar.', 'Upgrade everything: weapon, helmet, chest, legs, boots, ring and necklace.')], () => null]);
  GSIS.push(['despertar', '✨ ' + L2('Arma despertada', 'Awakened weapon'), () => [
    L2('Tu arma equipada gana experiencia con cada enemigo (élite ×6, jefe ×30). Al nivel 1 despierta, recibe un nombre y te habla.', 'Your equipped weapon gains experience with every enemy (elite ×6, boss ×30). At level 1 it awakens, gets a name and talks to you.'),
    L2('Cada nivel da +3 % de ataque; el máximo es 10 (+30 %, unos 4.000 puntos: 4.000 enemigos o 133 jefes). Brilla más cuanto más despierta.', 'Each level gives +3% attack; the max is 10 (+30%, about 4,000 points: 4,000 enemies or 133 bosses). It glows more the more awake it is.'),
    L2('La experiencia se queda en esa arma: si la cambias, la nueva empieza de cero.', 'The experience stays in that weapon: if you swap it, the new one starts from zero.')], () => null]);
  GSIS.push(['maestria50', '🎖 ' + L2('Maestría 50', 'Mastery 50'), () => [
    L2('Cada tipo de arma sube su maestría al vencer enemigos (jefe +25, élite +4) y en el Campo de Entrenamiento de Arxar.', 'Each weapon type raises its mastery by defeating enemies (boss +25, elite +4) and at the Arxar Training Grounds.'),
    L2('+0,1 % de ataque por nivel y +5 % extra en el 50 (en total +10 %). En el camino desbloqueas las posturas (5), la técnica especial y el contraataque maestro.', '+0.1% attack per level and +5% extra at 50 (+10% in total). Along the way you unlock stances (5), the special technique and the master counter.'),
    L2('En el modo espectador no se gana maestría.', 'Spectator mode gives no mastery.')], () => null]);
  GSIS.push(['evolucion', '🌟 ' + L2('Clase despertada', 'Awakened class'), () => [
    L2('Desde el nivel 240, tras la misión principal de Celestia (Islas del Cielo), el maestro de tu clase allí te da tres pruebas: cazar criaturas, vencer a un jefe y derrotar a tu propia sombra.', 'From level 240, after Celestia\'s main quest (Sky Isles), your class master there gives you three trials: hunt creatures, defeat a boss and beat your own shadow.'),
    L2('Al terminar despiertas: Paladín del Alba, Archimago Rúnico, Tirador Celeste, Sombra del Ocaso, Juglar del Coro Celeste, Señor de Almas o Leviatán Celeste.', 'When done you awaken: Dawn Paladin, Runic Archmage, Celestial Marksman, Twilight Shade, Celestial Choir Minstrel, Lord of Souls or Celestial Leviathan.'),
    L2('Todas ganan +10 % de ataque, +8 % de vida y +8 % de defensa, además de su pasiva propia y un aspecto nuevo.', 'All gain +10% attack, +8% HP and +8% defence, plus their own passive and a new look.')], () => null]);
  GSIS.push(['titulos', '🏷 ' + L2('Títulos', 'Titles'), () => [L2('Se equipan en el Vestuario › Títulos y salen encima de tu personaje (online también). Se ganan así:', 'Equip them in Wardrobe › Titles; they show above your character (online too). How to earn them:')].concat(TITLES.map(t => '· ' + t[1] + ' — ' + t[4])), () => null]);
}
