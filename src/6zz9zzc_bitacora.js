// ================= v5.11: BITÁCORA DEL AVENTURERO =================
// Botón 📖 a la izquierda (bajo la misión que sigues). Reúne lo más importante del momento y los sistemas nuevos:
//  · Hoy: siguiente paso de la historia, misiones listas para entregar, misión diaria, logros a punto, mascota,
//    tienda, buzón y el clima especial que hay ahora.
//  · Logros curiosos (contadores en P.bit.c) que dan títulos nuevos (en TITLES, se ven online), marcos para el retrato
//    del HUD y muebles para la casa (BK `bit_*`, se colocan con la Mesa de trabajo como los del museo).
//  · Cartas (las define 6zz9zzd_juegos.js), Álbum de fotos (fotos en grupo, se guardan aparte en el teléfono),
//    Mascota exploradora (vuelve con objetos y una nota), Buzón (notas, regalos y visitas a casas de otros jugadores).
// También: historial de misiones (P.qlog), botón «última ventana» y «Vender basura» en el inventario.
// Nada de poder nuevo: todo da oro, objetos, decoración o cosas para presumir.
SAVEKEYS.push('qlog', 'bit');
function BIT() { const P = G.P; P.bit = P.bit || {}; const b = P.bit; b.c = b.c || {}; b.got = b.got || {}; b.cards = b.cards || {}; b.mail = b.mail || []; b.fr = b.fr || ['oro']; b.towns = b.towns || {}; return b; }
let bitBadge = true;
function bitAdd(k, n) { if (!G.P) return; const c = BIT().c; c[k] = (c[k] || 0) + (n === undefined ? 1 : n); bitBadge = true; }
function bitC(k) { return (G.P && G.P.bit && G.P.bit.c && G.P.bit.c[k]) || 0; }

// ---------- historial de misiones ----------
{ const _cq = completeQuest; completeQuest = function (id) { const Q = QD(id), P = G.P; const r = _cq.apply(this, arguments);
  try { if (Q && P) { const c = questCat(Q); P.qlog = P.qlog || []; P.qlog.push({ id: Q.board ? null : id, n: Q.n, c, d: typeof calShort === 'function' ? calShort() : '', xp: (Q.rew && Q.rew.xp) || 0, g: (Q.rew && Q.rew.gold) || 0 }); if (P.qlog.length > 250) P.qlog.splice(0, P.qlog.length - 250);
    bitAdd('quest'); bitAdd('q_' + c); if (Q.chain) bitAdd('chain_' + Q.chain); } } catch (e) { console.warn(e); } return r; }; }

// ---------- contadores para los logros ----------
{ const _qe = questEvent; questEvent = function (type, d) { try { if (type === 'kill') bitAdd('kill'); else if (type === 'boss') bitAdd('boss'); else if (type === 'job') { bitAdd('job', (d && d.n) || 1); } else if (type === 'craft') bitAdd('craft'); } catch (e) { } return _qe.apply(this, arguments); }; }
{ const _fc = fishCaught; fishCaught = function (fish) { try { bitAdd('fish'); const w = curWx(); if (w === 'rain' || w === 'storm') bitAdd('fishRain'); } catch (e) { } return _fc.apply(this, arguments); }; }
{ const _sa = setAnim; setAnim = function (e, a, keep) { if (e && e === G.P && e.anim !== a) { if (a === 'hug') bitAdd('hug'); else if (a === 'kiss') bitAdd('kiss'); else if (a === 'dance') bitAdd('dance'); } return _sa.apply(this, arguments); }; }
let bitWasDead = false, bitLX = null, bitLY = null, bitTownT = 0;
V33_TICKS.push(dt => { const P = G.P; if (!P || !G.map) return;
  if (P.dead && !bitWasDead) bitAdd('death'); bitWasDead = !!P.dead;
  if (bitLX !== null && P.map === bitLM) { const d = Math.hypot(P.x - bitLX, P.y - bitLY); if (d > 0.5 && d < 40) BIT().c.steps = (BIT().c.steps || 0) + d / 16; }
  bitLX = P.x; bitLY = P.y; bitLM = P.map;
  bitTownT -= dt || 0; if (bitTownT <= 0 && G.map.isWorld) { bitTownT = 2; const tx = P.x / 16, ty = P.y / 16, t = TOWNS.find(t => tx >= t.x0 && tx <= t.x1 && ty >= t.y0 && ty <= t.y1); if (t && !BIT().towns[t.k]) { BIT().towns[t.k] = 1; bitBadge = true; } } });
let bitLM = null;

// ---------- marcos para el retrato ----------
const BIT_FR = { oro: [L2('Dorado', 'Golden'), '#ffd040'], bosque: [L2('Bosque', 'Forest'), '#5ad06a'], mar: [L2('Mar', 'Sea'), '#4ab0ff'], rosa: [L2('Rosa', 'Rose'), '#ff6ab0'], sangre: [L2('Sangre', 'Blood'), '#e0303a'], cielo: [L2('Cielo', 'Sky'), '#a8e8ff'], trueno: [L2('Trueno', 'Thunder'), '#b07aff'], estrella: [L2('Estrella', 'Star'), '#fff4a0'], arcoiris: [L2('Arcoíris', 'Rainbow'), 'linear'] };
function bitFrameApply() { const f = $('#tl .pframe'); if (!f || !G.P) return; const k = (G.P.bit && G.P.bit.frame) || 'oro'; f.className = 'pframe' + (k !== 'oro' ? ' frb fr-' + k : ''); if (BIT_FR[k] && k !== 'arcoiris') f.style.setProperty('--frc', BIT_FR[k][1]); }

// ---------- muebles de recompensa (se colocan con la Mesa de trabajo, no se fabrican) ----------
const BIT_FURN = {
  bit_trofeo: [L2('Trofeo del Matajefes', 'Bossbane trophy'), (g) => { g.fillStyle = '#5a3a1a'; g.fillRect(5, 22, 14, 6); g.fillStyle = '#7a5226'; g.fillRect(6, 22, 12, 2); g.fillStyle = '#c8901a'; g.fillRect(9, 17, 6, 5); g.fillRect(4, 3, 16, 3); g.fillStyle = '#ffd040'; g.fillRect(5, 4, 14, 9); g.fillRect(8, 13, 8, 4); g.fillStyle = '#fff4b0'; g.fillRect(7, 5, 2, 6); g.fillStyle = '#c8901a'; g.fillRect(1, 5, 3, 2); g.fillRect(20, 5, 3, 2); g.fillRect(1, 5, 1, 5); g.fillRect(22, 5, 1, 5); }, 24, 29],
  bit_vitrina: [L2('Vitrina de cartas', 'Card showcase'), (g) => { g.fillStyle = '#4a2a14'; g.fillRect(1, 2, 30, 30); g.fillStyle = '#a8d8f0'; g.fillRect(3, 4, 26, 24); const cc = ['#e85a5a', '#5ab0e8', '#5ad06a', '#ffd040', '#c07aff', '#ff9a40']; for (let i = 0; i < 6; i++) { g.fillStyle = '#f4ecd8'; g.fillRect(5 + (i % 3) * 8, 6 + ((i / 3) | 0) * 11, 6, 9); g.fillStyle = cc[i]; g.fillRect(6 + (i % 3) * 8, 7 + ((i / 3) | 0) * 11, 4, 4); } g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(4, 5, 1, 22); g.fillStyle = '#2a180a'; g.fillRect(1, 30, 30, 3); }, 32, 33],
  bit_cuadro: [L2('Cuadro de recuerdos', 'Memory frame'), (g) => { g.fillStyle = '#8a5a1a'; g.fillRect(0, 0, 28, 22); g.fillStyle = '#ffd070'; g.fillRect(1, 1, 26, 1); g.fillStyle = '#7ac0f0'; g.fillRect(3, 3, 22, 16); g.fillStyle = '#5ab04a'; g.fillRect(3, 13, 22, 6); g.fillStyle = '#ffe0a0'; g.fillRect(8, 9, 3, 5); g.fillRect(16, 8, 3, 6); g.fillStyle = '#5a3020'; g.fillRect(8, 7, 3, 2); g.fillRect(16, 6, 3, 2); g.fillStyle = '#fff'; g.fillRect(21, 4, 2, 2); }, 28, 22],
  bit_muneco: [L2('Muñeco de nieve eterno', 'Everlasting snowman'), (g) => { g.fillStyle = '#d8e8f8'; g.beginPath(); g.arc(10, 22, 8, 0, 7); g.fill(); g.beginPath(); g.arc(10, 11, 6, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.fillRect(6, 17, 4, 3); g.fillRect(7, 7, 3, 2); g.fillStyle = '#1a1a24'; g.fillRect(8, 9, 1, 1); g.fillRect(11, 9, 1, 1); g.fillRect(9, 20, 2, 2); g.fillRect(9, 24, 2, 2); g.fillStyle = '#ff8a20'; g.fillRect(10, 11, 4, 1); g.fillStyle = '#c8343a'; g.fillRect(4, 14, 12, 2); g.fillRect(13, 15, 2, 4); g.fillStyle = '#2a2a34'; g.fillRect(6, 3, 8, 3); g.fillRect(4, 5, 12, 1); }, 20, 30],
  bit_lampara: [L2('Lámpara de estrellas', 'Star lamp'), (g) => { g.fillStyle = '#3a3a5a'; g.fillRect(6, 26, 8, 3); g.fillRect(9, 12, 2, 14); g.fillStyle = '#ffe680'; g.beginPath(); for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5 - Math.PI / 2, r = k % 2 ? 3 : 7; g.lineTo(10 + Math.cos(a) * r, 7 + Math.sin(a) * r); } g.fill(); g.fillStyle = '#fffbe0'; g.fillRect(9, 5, 2, 2); }, 20, 29, [10, 7]],
  bit_caseta: [L2('Caseta de la mascota', 'Pet house'), (g) => { g.fillStyle = '#c8343a'; g.beginPath(); g.moveTo(1, 12); g.lineTo(14, 2); g.lineTo(27, 12); g.fill(); g.fillStyle = '#c89a5a'; g.fillRect(4, 12, 20, 14); g.fillStyle = '#a87a3a'; for (let y = 15; y < 26; y += 3) g.fillRect(4, y, 20, 1); g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(14, 21, 5, Math.PI, 0); g.fill(); g.fillRect(9, 21, 10, 5); g.fillStyle = '#ffd040'; g.fillRect(12, 13, 4, 2); }, 28, 27],
  bit_letrero: [L2('Letrero del artesano', 'Artisan sign'), (g) => { g.fillStyle = '#5a3a1a'; g.fillRect(3, 6, 2, 22); g.fillRect(23, 6, 2, 22); g.fillStyle = '#c8a060'; g.fillRect(0, 2, 28, 14); g.fillStyle = '#e8c890'; g.fillRect(1, 3, 26, 1); g.fillStyle = '#5a3a1a'; g.fillRect(5, 7, 6, 1); g.fillRect(13, 7, 10, 1); g.fillRect(5, 10, 18, 1); g.fillStyle = '#c8343a'; g.fillRect(4, 12, 3, 2); }, 28, 28],
  bit_felpudo: [L2('Felpudo de bienvenida', 'Welcome mat'), (g) => { g.fillStyle = '#8a5a2a'; g.fillRect(0, 0, 30, 14); g.fillStyle = '#b07a3a'; g.fillRect(2, 2, 26, 10); g.fillStyle = '#5a2a14'; for (let x = 5; x < 26; x += 4) g.fillRect(x, 5, 2, 4); g.fillStyle = '#ff6a8a'; g.fillRect(13, 4, 4, 1); g.fillRect(12, 5, 6, 2); g.fillRect(14, 7, 2, 1); }, 30, 12, null, true],
  bit_estrella: [L2('Corona de logros', 'Achievement crown'), (g) => { g.fillStyle = '#4a2a5a'; g.fillRect(3, 20, 18, 8); g.fillStyle = '#6a3a7a'; g.fillRect(3, 20, 18, 2); g.fillStyle = '#ffd040'; g.fillRect(5, 10, 14, 8); g.fillRect(5, 5, 3, 5); g.fillRect(10, 3, 4, 7); g.fillRect(16, 5, 3, 5); g.fillStyle = '#e83a5a'; g.fillRect(11, 12, 2, 3); g.fillStyle = '#5ab0ff'; g.fillRect(7, 13, 2, 2); g.fillRect(15, 13, 2, 2); g.fillStyle = '#fff4b0'; g.fillRect(6, 11, 1, 5); }, 24, 28],
};
for (const k in BIT_FURN) { const [n, draw, w, h, light, flat] = BIT_FURN[k];
  XSPR[k] = () => { const [c, g] = XC(w, h); draw(g); return { c, ax: w >> 1, ay: h - 1, light }; };
  BK[k] = { n, f: k, fp: [[0, 0]], cost: [], gold: 0, tool: 'tala', tier: 1, cat: 'deco', L: 1, musOnly: 1, solid: flat ? false : undefined }; if (!BK_KEYS.includes(k)) BK_KEYS.push(k);
  it('bk_' + k, { n, t: 'mat', bk: k, stack: true, tier: 1, price: 5, icon: ['bk', k], rar: 3 }); }

// ---------- títulos nuevos (logros de la Bitácora) ----------
const BIT_TIT = [['t_b_viajero', L2('Trotamundos', 'Globetrotter'), 'natural'], ['t_b_lluvia', L2('Pescador de la Lluvia', 'Rain Angler'), 'hielo'], ['t_b_abrazos', L2('Corazón Cálido', 'Warm Heart'), 'amor'], ['t_b_baile', L2('Rey de la Pista', 'Dancefloor King'), 'arcoiris'], ['t_b_torpe', L2('Duro de Matar', 'Hard to Kill'), 'sangre'], ['t_b_obrero', L2('Manos de Oro', 'Golden Hands'), 'oro'], ['t_b_tahur', L2('Tahúr de las Cartas', 'Card Shark'), 'sombra'], ['t_b_halcon', L2('Ojo de Halcón', 'Hawk Eye'), 'natural'], ['t_b_mascota', L2('Mejor Amigo', 'Best Friend'), 'amor'], ['t_b_chef', L2('Chef Estrella', 'Star Chef'), 'fuego'], ['t_b_jinete', L2('Jinete Veloz', 'Swift Rider'), 'hielo'], ['t_b_cronista', L2('Cronista del Reino', 'Realm Chronicler'), 'astral'], ['t_b_vecino', L2('Buen Vecino', 'Good Neighbour'), 'plata'], ['t_b_tormenta', L2('Domador de Tormentas', 'Storm Tamer'), 'astral']];
// ---------- logros: [id, icono, nombre, descripción, contador o función, meta, recompensa] ----------
const BIT_ACH = [
  ['a_pasos', '👣', L2('Caminante', 'Wanderer'), L2('Camina 10.000 pasos.', 'Walk 10,000 steps.'), 'steps', 10000, { g: 5000, fr: 'bosque' }],
  ['a_pueblos', '🏘', L2('Los seis pueblos', 'The six towns'), L2('Visita Albor, Puerto Coral, Arxar, Sahrim, Yarakai y Brasa.', 'Visit Albor, Coral Port, Arxar, Sahrim, Yarakai and Ember.'), P => Object.keys(BIT().towns).length, 6, { t: 't_b_viajero', g: 8000 }],
  ['a_lluvia', '🌧', L2('Pesca bajo la lluvia', 'Fishing in the rain'), L2('Pesca 100 peces con lluvia o tormenta.', 'Catch 100 fish in rain or storm.'), 'fishRain', 100, { t: 't_b_lluvia' }],
  ['a_peces', '🐟', L2('Mil peces', 'A thousand fish'), L2('Pesca 1.000 peces.', 'Catch 1,000 fish.'), 'fish', 1000, { fr: 'mar', g: 20000 }],
  ['a_tormenta', '⚡', L2('Pez de la tormenta', 'Storm fish'), L2('Pesca 5 Peces Tormenta (solo salen con tormenta).', 'Catch 5 Storm Fish (only during storms).'), 'stormFish', 5, { t: 't_b_tormenta', fr: 'trueno' }],
  ['a_abrazos', '🤗', L2('Corazón cálido', 'Warm heart'), L2('Da 10 abrazos.', 'Give 10 hugs.'), 'hug', 10, { t: 't_b_abrazos' }],
  ['a_besos', '💋', L2('Romántico', 'Romantic'), L2('Da 25 besos.', 'Give 25 kisses.'), 'kiss', 25, { fr: 'rosa' }],
  ['a_baile', '💃', L2('Rey de la pista', 'Dancefloor king'), L2('Baila 50 veces.', 'Dance 50 times.'), 'dance', 50, { t: 't_b_baile' }],
  ['a_caidas', '💀', L2('Duro de matar', 'Hard to kill'), L2('Cae 25 veces… y levántate siempre.', 'Fall 25 times… and always get up.'), 'death', 25, { t: 't_b_torpe' }],
  ['a_caza', '⚔', L2('Cazador incansable', 'Tireless hunter'), L2('Derrota 5.000 enemigos.', 'Defeat 5,000 enemies.'), 'kill', 5000, { fr: 'sangre', g: 15000 }],
  ['a_jefes', '👑', L2('Matajefes', 'Bossbane'), L2('Derrota 50 jefes.', 'Defeat 50 bosses.'), 'boss', 50, { bk: 'bit_trofeo' }],
  ['a_misiones', '📜', L2('Ayudante del reino', 'Realm helper'), L2('Completa 50 misiones.', 'Complete 50 quests.'), 'quest', 50, { g: 25000 }],
  ['a_historia', '📖', L2('Leyenda escrita', 'Written legend'), L2('Completa 15 misiones de historia.', 'Complete 15 story quests.'), 'q_story', 15, { fr: 'estrella' }],
  ['a_trabajo', '⚒', L2('Manos de oro', 'Golden hands'), L2('Completa 30 misiones de trabajo.', 'Complete 30 work quests.'), 'q_work', 30, { t: 't_b_obrero' }],
  ['a_oficios', '🔨', L2('Mil oficios', 'A thousand trades'), L2('Haz 2.000 acciones de oficio (talar, minar, pescar, cosechar…).', 'Do 2,000 job actions (chop, mine, fish, harvest…).'), 'job', 2000, { g: 20000 }],
  ['a_cadenas', '🔗', L2('Encargos en cadena', 'Chained commissions'), L2('Completa las 3 cadenas de encargos de oficio.', 'Complete all 3 job commission chains.'), P => ['pez', 'mueble', 'guiso'].filter(k => bitC('chain_' + k + '_end')).length, 3, { bk: 'bit_letrero' }],
  ['a_cartas', '🃏', L2('Coleccionista de cartas', 'Card collector'), L2('Consigue 40 cartas distintas.', 'Collect 40 different cards.'), P => Object.keys(BIT().cards).length, 40, { bk: 'bit_vitrina' }],
  ['a_duelos', '🎴', L2('Tahúr', 'Card shark'), L2('Gana 25 duelos de cartas.', 'Win 25 card duels.'), 'cardWin', 25, { t: 't_b_tahur' }],
  ['a_escondite', '🙈', L2('Ojo de halcón', 'Hawk eye'), L2('Gana 10 partidas al escondite en Higashiyama.', 'Win 10 hide-and-seek games in Higashiyama.'), 'seekWin', 10, { t: 't_b_halcon' }],
  ['a_fotos', '📷', L2('Fotógrafo', 'Photographer'), L2('Haz 20 fotos para el álbum.', 'Take 20 photos for the album.'), 'photo', 20, { bk: 'bit_cuadro' }],
  ['a_munecos', '⛄', L2('Artista de la nieve', 'Snow artist'), L2('Haz 10 muñecos de nieve cuando nieve.', 'Build 10 snowmen while it snows.'), 'snowman', 10, { bk: 'bit_muneco' }],
  ['a_estrellas', '🌠', L2('Cazaestrellas', 'Star catcher'), L2('Atrapa 50 estrellas fugaces de noche en Altavela.', 'Catch 50 shooting stars at night in Altavela.'), 'star', 50, { bk: 'bit_lampara' }],
  ['a_mascota', '🐾', L2('Mejor amigo', 'Best friend'), L2('Tu mascota vuelve de explorar 20 veces.', 'Your pet comes back from exploring 20 times.'), 'petx', 20, { t: 't_b_mascota', bk: 'bit_caseta' }],
  ['a_buzon', '✉', L2('Buen vecino', 'Good neighbour'), L2('Envía 15 notas o regalos a otros jugadores.', 'Send 15 notes or gifts to other players.'), 'mailOut', 15, { t: 't_b_vecino', fr: 'cielo' }],
  ['a_visitas', '🏠', L2('Casa abierta', 'Open house'), L2('Recibe o haz 5 visitas a casas.', 'Host or make 5 house visits.'), 'visit', 5, { bk: 'bit_felpudo' }],
  ['a_cocina', '🍳', L2('Chef estrella', 'Star chef'), L2('Gana 5 concursos de cocina.', 'Win 5 cooking contests.'), 'cookWin', 5, { t: 't_b_chef' }],
  ['a_carrera', '🏇', L2('Jinete veloz', 'Swift rider'), L2('Gana 5 carreras de monturas.', 'Win 5 mount races.'), 'raceWin', 5, { t: 't_b_jinete' }],
  ['a_equipo', '🎣', L2('Pesca en equipo', 'Team fishing'), L2('Gana 3 concursos de pesca por equipos.', 'Win 3 team fishing contests.'), 'teamWin', 3, { g: 15000 }],
  ['a_ordenado', '🧹', L2('Bolsa ordenada', 'Tidy bag'), L2('Vende 100 objetos con «Vender basura».', 'Sell 100 items with «Sell junk».'), 'junk', 100, { g: 5000 }],
  ['a_cronista', '🏆', L2('Cronista del reino', 'Realm chronicler'), L2('Consigue 20 logros de la Bitácora.', 'Earn 20 Logbook achievements.'), P => Object.keys(BIT().got).length, 20, { t: 't_b_cronista', fr: 'arcoiris', bk: 'bit_estrella' }],
];
for (const [id, n, st] of BIT_TIT) { const a = BIT_ACH.find(x => x[6].t === id); if (!TITLES.some(t => t[0] === id)) TITLES.push([id, n, st, P => !!(P.bit && P.bit.got && a && P.bit.got[a[0]]), L2('Logro de la Bitácora: ', 'Logbook achievement: ') + (a ? a[2] : '')]); TIT_ID[id] = TITLES.find(t => t[0] === id); }
function bitProg(a) { let v = 0; try { v = typeof a[4] === 'function' ? a[4](G.P) : bitC(a[4]); } catch (e) { } return [Math.floor(v), a[5]]; }
function bitReady() { const b = BIT(); return BIT_ACH.filter(a => !b.got[a[0]] && bitProg(a)[0] >= a[5]); }
function bitRewTxt(r) { const out = []; if (r.g) out.push('🪙 ' + fmt(r.g)); if (r.t) out.push('🏷 ' + ((TIT_ID[r.t] || [])[1] || '')); if (r.fr) out.push('🖼 ' + L2('Marco ', 'Frame ') + BIT_FR[r.fr][0]); if (r.bk) out.push('🪑 ' + BK[r.bk].n); return out.join(' · '); }
function bitClaim(id) { const a = BIT_ACH.find(x => x[0] === id), b = BIT(), P = G.P; if (!a || b.got[id] || bitProg(a)[0] < a[5]) return; b.got[id] = Date.now(); const r = a[6];
  if (r.g) P.gold += r.g; if (r.fr && !b.fr.includes(r.fr)) b.fr.push(r.fr); if (r.bk) giveItem('bk_' + r.bk, 1);
  banner('🏆 ' + a[2], bitRewTxt(r)); sfx('level'); burst(P.x, P.y - 14, 26, { sp: 70, up: 60, g: 60, life: 0.9, c: ['#ffe080', '#ffffff', '#ff9ad0'] }); markDirty(true); }

// ---------- botones del HUD: Bitácora y última ventana ----------
function bitHudInit() { const H = $('#hud'); if (!H || $('#bBit')) return;
  const b = document.createElement('button'); b.id = 'bBit'; b.className = 'bitbtn'; b.title = L2('Bitácora', 'Logbook'); b.setAttribute('aria-label', L2('Bitácora', 'Logbook')); b.innerHTML = `${iconHTML(['book'], 22)}<span>${L2('Bitácora', 'Logbook')}</span><i class="bdot" hidden></i>`; b.onclick = () => openBitacora(); H.appendChild(b);
  const l = document.createElement('button'); l.id = 'bLast'; l.className = 'bitbtn sm'; l.title = L2('Última ventana', 'Last window'); l.setAttribute('aria-label', L2('Última ventana', 'Last window')); l.hidden = true; l.onclick = () => lastWinOpen(); H.appendChild(l); }
let bitHudT = 0;
V33_TICKS.push(dt => { bitHudT -= dt || 0; if (bitHudT > 0) return; bitHudT = 0.8; const P = G.P; if (!P) return; bitHudInit(); bitFrameApply();
  const d = $('#bBit .bdot'); if (d && bitBadge) { bitBadge = false; const b = BIT(), n = bitReady().length + b.mail.filter(m => !m.r).length + (b.px && Date.now() >= b.px.end ? 1 : 0); d.hidden = !n; d.textContent = n > 9 ? '9+' : n || ''; }
  try { const bb = $('#bBit'), tr = $('#tracker'), sc = $('#secChip'); if (bb) { let bot = 0; for (const el of [tr, sc]) if (el && !el.hidden) { const r = el.getBoundingClientRect(); if (r.height) bot = Math.max(bot, r.bottom); } const hr = $('#hud').getBoundingClientRect();
    const top = bot ? bot - hr.top + 6 : null; const v = top === null ? '' : top + 'px'; if (bb.style.top !== v) { bb.style.top = v; const lb = $('#bLast'); if (lb) lb.style.top = v; } const pt = $('#party'); if (pt) { const r2 = bb.getBoundingClientRect(), nv = (r2.bottom - hr.top + 6) + 'px'; if (pt.style.top !== nv) pt.style.top = nv; } } } catch (e) { }
  const l = $('#bLast'); if (l) { const w = SETTINGS.lastW; l.hidden = !w; if (w && l.dataset.w !== w) { l.dataset.w = w; l.innerHTML = '↩ ' + (LASTW_IC[w.split(':')[1]] || '📖'); } } });
setInterval(() => { bitBadge = true; }, 5000);
// última ventana
const LASTW_IC = { char: '🧍', inv: '🎒', skills: '⭐', jobs: '⚒', quest: '📜', map: '🗺', wardrobe: '👗', best: '🐾', rel: '❤', hoy: '📖', logros: '🏆', cartas: '🃏', album: '📷', mascota: '🐾', buzon: '✉', marcos: '🖼' };
{ const _op = openPanel; openPanel = function (tab) { const r = _op.apply(this, arguments); try { if (!$('#panel').hidden) { SETTINGS.lastW = 'p:' + panelTab; saveSettings(); } } catch (e) { } return r; }; }
function lastWinOpen() { const w = SETTINGS.lastW || ''; const [k, t] = w.split(':'); if (k === 'p') openPanel(t); else if (k === 'b') openBitacora(t); }

// ---------- ventana de la Bitácora ----------
let bitTab = 'hoy';
const BIT_TABS = [['hoy', '📌', L2('Hoy', 'Today')], ['logros', '🏆', L2('Logros', 'Achievements')], ['cartas', '🃏', L2('Cartas', 'Cards')], ['album', '📷', L2('Álbum', 'Album')], ['mascota', '🐾', L2('Mascota', 'Pet')], ['buzon', '✉', L2('Buzón', 'Mailbox')], ['marcos', '🖼', L2('Marcos', 'Frames')]];
function openBitacora(tab) { const P = G.P; if (!P || P.dead) return; if (tab) bitTab = tab; if (!BIT_TABS.some(t => t[0] === bitTab)) bitTab = 'hoy'; SETTINGS.lastW = 'b:' + bitTab; saveSettings(); bitBadge = true;
  const b = BIT(), nR = bitReady().length, nM = b.mail.filter(m => !m.r).length;
  const tabs = `<div class="btabs">${BIT_TABS.map(([k, ic, n]) => `<button class="btab ${bitTab === k ? 'on' : ''}" data-bt="${k}">${ic} <span>${n}</span>${k === 'logros' && nR ? `<i class="bdot">${nR}</i>` : k === 'buzon' && nM ? `<i class="bdot">${nM}</i>` : k === 'mascota' && b.px && Date.now() >= b.px.end ? '<i class="bdot">!</i>' : ''}</button>`).join('')}</div>`;
  let body = ''; try { body = (BIT_RENDER[bitTab] || BIT_RENDER.hoy)(); } catch (e) { console.warn(e); body = `<p class="hint">${esc(String(e.message || e))}</p>`; }
  openModal(`<h2>📖 ${L2('Bitácora del aventurero', 'Adventurer’s logbook')}</h2>${tabs}<div class="bbody">${body}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party bitm');
  $('#mclose').onclick = closeModal; $$('#modal [data-bt]').forEach(x => x.onclick = () => openBitacora(x.dataset.bt));
  try { (BIT_WIRE[bitTab] || (() => { }))(); } catch (e) { console.warn(e); } }
const BIT_RENDER = {}, BIT_WIRE = {};
// --- Hoy: lo más importante ---
function bitStrip(h) { return String(h || '').replace(/<[^>]+>/g, ''); }
BIT_RENDER.hoy = () => { const P = G.P, b = BIT(), out = [];
  const act = Object.keys(P.quests.active).filter(id => QD(id)), main = act.find(id => QD(id).main), ready = act.filter(questReady);
  if (main) out.push(`<div class="bcard story"><b>📜 ${L2('Historia', 'Story')}: ${esc(QD(main).n)}</b><small>${esc(bitStrip(questGuide(main)[0]))}</small><button class="btn sm gold" data-bgo="q:${main}">${L2('Seguir', 'Follow')}</button></div>`);
  else { const nx = Object.keys(QUESTS).find(id => QUESTS[id].main && canOffer(id)), lk = !nx && Object.keys(QUESTS).find(id => QUESTS[id].main && !P.quests.done[id] && !P.quests.active[id]);
    if (nx) out.push(`<div class="bcard story"><b>📜 ${L2('Siguiente de la historia', 'Next in the story')}: ${esc(QUESTS[nx].n)}</b><small>${L2('Habla con ', 'Talk to ')}${esc((NPCS[QUESTS[nx].giver] || { n: '' }).n)}${esc(npcPlace(QUESTS[nx].giver) || '')}.</small><button class="btn sm gold" data-bgo="g:${nx}">➜ ${L2('Ir', 'Go')}</button></div>`);
    else if (lk) out.push(`<div class="bcard story"><b>📜 ${L2('Siguiente de la historia', 'Next in the story')}: ${esc(QUESTS[lk].n)}</b><small>${L2('Se abre al nivel ', 'Unlocks at level ')}${QUESTS[lk].lv}.</small></div>`); }
  if (ready.length) out.push(`<div class="bcard ready"><b>✨ ${L2('Listas para entregar', 'Ready to turn in')} (${ready.length})</b>${ready.slice(0, 4).map(id => `<div class="brow"><span>${esc(QD(id).n)} → ${esc((NPCS[turnInNpc(QD(id))] || { n: '' }).n)}</span><button class="btn sm gold" data-bgo="t:${id}">➜ ${L2('Ir', 'Go')}</button></div>`).join('')}</div>`);
  try { if (typeof dq === 'function' && typeof DQ_T !== 'undefined' && P.lv >= 50) { const Q = dq(), all = DQ_T.every(([k, n]) => (Q[k] || 0) >= n); out.push(`<div class="bcard"><b>📅 ${L2('Misión diaria del Sistema', 'System daily quest')}: ${Q.done ? '✓ ' + L2('hecha', 'done') : all ? L2('¡lista para cobrar!', 'ready to claim!') : L2('pendiente', 'pending')}</b>${!Q.done ? `<button class="btn sm" data-bgo="dq">${L2('Abrir', 'Open')}</button>` : ''}</div>`); } } catch (e) { }
  const rd = bitReady(); const near = BIT_ACH.filter(a => !b.got[a[0]]).map(a => [a, bitProg(a)]).filter(([a, p]) => p[0] < p[1] && p[0] > 0).sort((x, y) => y[1][0] / y[1][1] - x[1][0] / x[1][1]).slice(0, 3);
  out.push(`<div class="bcard"><b>🏆 ${L2('Logros', 'Achievements')}: ${Object.keys(b.got).length}/${BIT_ACH.length}${rd.length ? ` · <span class="good">${rd.length} ${L2('para reclamar', 'to claim')}</span>` : ''}</b>${near.map(([a, p]) => `<div class="bprog"><span>${a[1]} ${esc(a[2])} <small>${fmt(p[0])}/${fmt(p[1])}</small></span><div class="bar xp"><i style="width:${(100 * p[0] / p[1]).toFixed(0)}%"></i></div></div>`).join('')}<button class="btn sm" data-bt2="logros">${L2('Ver logros', 'See achievements')}</button></div>`);
  if (b.px) { const left = b.px.end - Date.now(); out.push(`<div class="bcard"><b>🐾 ${esc((PETS[b.px.k] || { n: '' }).n)} ${left > 0 ? L2('está explorando', 'is exploring') + ' · ' + fmtTime(left / 1000) : L2('¡ha vuelto con cosas!', 'is back with goodies!')}</b><button class="btn sm ${left > 0 ? '' : 'gold'}" data-bt2="mascota">${L2('Ver', 'See')}</button></div>`); }
  try { const S = typeof homeShopState === 'function' ? homeShopState() : null; if (S && (S.s.length || S.g)) { shopTick(); out.push(`<div class="bcard"><b>🛒 ${L2('Tu tienda', 'Your shop')}: ${fmt(S.g)} ${L2('oro en la caja', 'gold in the till')} · ${S.s.length} ${L2('a la venta', 'on sale')}</b><small>${L2('Cóbralo en el mostrador de tu casa.', 'Collect it at your home counter.')}</small></div>`); } } catch (e) { }
  const nM = b.mail.filter(m => !m.r).length; if (nM) out.push(`<div class="bcard"><b>✉ ${nM} ${L2('mensajes nuevos en el buzón', 'new messages in the mailbox')}</b><button class="btn sm gold" data-bt2="buzon">${L2('Leer', 'Read')}</button></div>`);
  const wx = bitWxNow(); if (wx) out.push(`<div class="bcard wx"><b>${wx}</b></div>`);
  let bj = null; for (const k in P.jobs) { const J = P.jobs[k]; if (!JOBS[k] || J.lv >= JOBMAX) continue; const pc = J.xp / jobXpToNext(J.lv); if (!bj || pc > bj[1]) bj = [k, pc, J.lv]; }
  if (bj && bj[1] > 0.5) out.push(`<div class="bcard"><b>⚒ ${esc(JOBS[bj[0]].n)}: ${Math.round(bj[1] * 100)} % ${L2('para el nivel', 'to level')} ${bj[2] + 1}</b></div>`);
  out.push(`<div class="bcard"><b>🎲 ${L2('Para divertirte', 'For fun')}</b><small>${L2('Salón de juegos en cada pueblo (cartas, cocina, carrera de monturas y pesca por equipos), escondite en Higashiyama (Japón), encargos en cadena de Tomás, Greta y Nora, fotos en grupo y tu mascota exploradora.', 'Game hall in every town (cards, cooking, mount race and team fishing), hide-and-seek in Higashiyama (Japan), chained commissions from Tomás, Greta and Nora, group photos and your exploring pet.')}</small><button class="btn sm" data-bgo="hall">${L2('Ir al Salón más cercano', 'Go to the nearest hall')}</button></div>`);
  return out.join(''); };
BIT_WIRE.hoy = () => { $$('#modal [data-bt2]').forEach(x => x.onclick = () => openBitacora(x.dataset.bt2));
  $$('#modal [data-bgo]').forEach(x => x.onclick = () => { const v = x.dataset.bgo, P = G.P;
    if (v === 'dq') { closeModal(); dqMenu(); return; }
    if (v === 'hall') { const l = typeof hallNearest === 'function' ? hallNearest() : null; if (l) { setWp({ loc: l, t: L2('Salón de juegos', 'Game hall'), m: 'world' }); closeModal(); } return; }
    const id = v.slice(2); if (v[0] === 'q') { P.track = id; uiDirty.quest = true; closeModal(); toast(L2('Siguiendo: ', 'Tracking: ') + QD(id).n, 'info'); }
    else if (v[0] === 'g') { if (qGoNpc(QUESTS[id].giver, QUESTS[id].n)) closeModal(); }
    else if (v[0] === 't') { P.track = id; uiDirty.quest = true; if (qGoNpc(turnInNpc(QD(id)), L2('Entregar: ', 'Turn in: ') + QD(id).n)) closeModal(); } }); };
function bitWxNow() { const P = G.P, M = G.map; if (!M) return ''; const w = curWx(), h = ((G.time || 0) / 60) % 24;
  if (M.sky && (h >= 21 || h < 4)) return '🌠 ' + L2('Noche en Altavela: caen estrellas fugaces. Acércate a los destellos para atraparlas.', 'Night in Altavela: shooting stars are falling. Walk to the sparkles to catch them.');
  if (w === 'storm') return '⚡ ' + L2('Tormenta: al pescar puede picar el raro Pez Tormenta.', 'Storm: the rare Storm Fish may bite while fishing.');
  if (w === 'snow') return '⛄ ' + L2('Nieva: busca montones de nieve brillantes y haz muñecos.', 'Snowing: look for sparkling snow piles and build snowmen.');
  if (w === 'rain') return '🌧 ' + L2('Llueve: los peces pescados ahora cuentan para «Pesca bajo la lluvia».', 'Raining: fish caught now count for «Fishing in the rain».');
  return ''; }
// --- Logros ---
BIT_RENDER.logros = () => { const b = BIT(); const rows = BIT_ACH.map(a => { const [v, g] = bitProg(a), got = b.got[a[0]], ok = !got && v >= g; return `<div class="bach ${got ? 'got' : ok ? 'ok' : ''}"><span class="bic">${a[1]}</span><div class="bt"><b>${esc(a[2])}</b><small>${esc(a[3])}</small><div class="bar xp"><i style="width:${Math.min(100, 100 * v / g).toFixed(0)}%"></i></div><small class="brw">${fmt(Math.min(v, g))}/${fmt(g)} · ${bitRewTxt(a[6])}</small></div>${got ? '<span class="good">✓</span>' : ok ? `<button class="btn sm gold" data-bcl="${a[0]}">${L2('Reclamar', 'Claim')}</button>` : ''}</div>`; });
  return `<p class="hint">${L2('Logros curiosos: dan títulos (Vestuario › Títulos, se ven online), marcos para tu retrato y muebles para tu casa (se colocan con la Mesa de trabajo).', 'Fun achievements: they give titles (Wardrobe › Titles, visible online), portrait frames and furniture for your house (place it with the Workbench).')}</p><div class="blist">${rows.join('')}</div>`; };
BIT_WIRE.logros = () => $$('#modal [data-bcl]').forEach(x => x.onclick = () => { bitClaim(x.dataset.bcl); openBitacora('logros'); });
// --- Marcos ---
BIT_RENDER.marcos = () => { const b = BIT(), cur = b.frame || 'oro'; return `<p class="hint">${L2('El marco de tu retrato (arriba a la izquierda). Se ganan con logros.', 'Your portrait frame (top left). Earned with achievements.')}</p><div class="bfr">${Object.keys(BIT_FR).map(k => { const own = b.fr.includes(k), a = BIT_ACH.find(x => x[6].fr === k); return `<button class="bfrb fr-${k} ${cur === k ? 'on' : ''}" data-bfr="${k}" ${own ? '' : 'disabled'} style="--frc:${BIT_FR[k][1]}"><i></i><b>${esc(BIT_FR[k][0])}</b><small>${own ? (cur === k ? L2('Puesto', 'Equipped') : L2('Poner', 'Equip')) : '🔒 ' + esc(a ? a[2] : '')}</small></button>`; }).join('')}</div>`; };
BIT_WIRE.marcos = () => $$('#modal [data-bfr]').forEach(x => x.onclick = () => { BIT().frame = x.dataset.bfr; bitFrameApply(); sfx('equip'); markDirty(); openBitacora('marcos'); });

// ---------- mascota exploradora ----------
const PETX_DUR = [[10, L2('Paseo corto', 'Short walk')], [30, L2('Excursión', 'Outing')], [60, L2('Gran aventura', 'Big adventure')]];
const PETX_NOTE = [
  L2('{p} volvió con barro hasta las orejas y muy orgulloso de sí mismo.', '{p} came back muddy up to the ears and very proud of itself.'),
  L2('{p} persiguió una mariposa durante una hora. La mariposa ganó.', '{p} chased a butterfly for an hour. The butterfly won.'),
  L2('{p} se hizo amigo de una cabra en las colinas. Dice que es muy sabia.', '{p} befriended a goat in the hills. Says it is very wise.'),
  L2('{p} encontró un charco enorme y decidió que era el mar.', '{p} found a huge puddle and decided it was the sea.'),
  L2('{p} robó una salchicha de la posada. No preguntes.', '{p} stole a sausage from the inn. Don’t ask.'),
  L2('{p} durmió la siesta bajo un árbol y soñó contigo.', '{p} napped under a tree and dreamt of you.'),
  L2('{p} vio un slime y salió corriendo… luego volvió a por él.', '{p} saw a slime and ran away… then came back for it.'),
  L2('{p} trae una flor en la boca. Es para ti.', '{p} brings a flower in its mouth. It is for you.'),
  L2('{p} se perdió, pero un guardia de Arxar lo trajo de vuelta.', '{p} got lost, but an Arxar guard brought it back.'),
  L2('{p} desenterró algo brillante cerca de un río.', '{p} dug up something shiny near a river.')];
BIT_RENDER.mascota = () => { const P = G.P, b = BIT(), own = (P.pets || []).filter(k => PETS[k]);
  if (!own.length) return `<p class="hint">${L2('No tienes mascotas. Las venden en las tiendas de mascotas de los pueblos (y Corvel en el Velo Roto).', 'You have no pets. Pet shops in towns sell them (and Corvel in the Broken Veil).')}</p>`;
  if (b.px) { const left = b.px.end - Date.now(), pn = (PETS[b.px.k] || { n: '?' }).n;
    if (left > 0) return `<div class="bcard"><b>🐾 ${esc(pn)} ${L2('está explorando', 'is exploring')}</b><small>${L2('Vuelve en', 'Back in')} ${fmtTime(left / 1000)}. ${L2('Sigue contando aunque cierres el juego.', 'It keeps counting even if you close the game.')}</small><div class="bar xp"><i style="width:${(100 * (1 - left / (b.px.dur * 60000))).toFixed(0)}%"></i></div></div>`;
    return `<div class="bcard ready"><b>🐾 ¡${esc(pn)} ${L2('ha vuelto!', 'is back!')}</b><small>${L2('Trae algo en la mochila…', 'It brings something in its little bag…')}</small><button class="btn gold" id="pxGet">${L2('Recibir', 'Receive')}</button></div>`; }
  return `<p class="hint">${L2('Manda a una de tus mascotas a explorar. Vuelve con materiales, oro, a veces una carta o un mueble… y una nota de lo que hizo. Si mandas a la que te acompaña, se va hasta que vuelva.', 'Send one of your pets exploring. It comes back with materials, gold, sometimes a card or furniture… and a note about what it did. If you send the one with you, it leaves until it comes back.')}</p>
   <div class="slist">${own.map(k => `<div class="srow">${iconHTML(['paw'], 24)}<div class="sn"><b>${esc(PETS[k].n)}</b><small>${P.pet === k ? L2('Te acompaña', 'With you') : ''}</small></div>${PETX_DUR.map(([m, n]) => `<button class="btn sm" data-px="${k}|${m}">${esc(n)} · ${m} min</button>`).join('')}</div>`).join('')}</div>`; };
BIT_WIRE.mascota = () => { const P = G.P, b = BIT();
  $$('#modal [data-px]').forEach(x => x.onclick = () => { const [k, m] = x.dataset.px.split('|'); b.px = { k, dur: +m, end: Date.now() + m * 60000, act: P.pet === k ? 1 : 0 }; if (P.pet === k && typeof setPet === 'function') setPet(null); toast('🐾 ' + PETS[k].n + L2(' se va a explorar.', ' goes exploring.'), 'info'); sfx('ui'); markDirty(true); openBitacora('mascota'); });
  const g = $('#pxGet'); if (g) g.onclick = () => { const px = b.px; if (!px || Date.now() < px.end) return; const pn = (PETS[px.k] || { n: '?' }).n, f = px.dur / 10, tier = clamp(Math.ceil(P.lv / 50), 1, 7), got = [];
    const give = (id, n) => { if (ITEMS[id] && n > 0) { giveItem(id, n, true); got.push(ITEMS[id].n + ' ×' + n); } };
    for (const base of ['log', 'ore', 'herb']) if (Math.random() < 0.7) give(base + tier, Math.round((2 + Math.random() * 3) * f));
    const gold = Math.round((60 + P.lv * 12) * f * (0.8 + Math.random() * 0.5)); P.gold += gold; got.push(fmt(gold) + ' ' + L2('oro', 'gold'));
    if (Math.random() < 0.2 * f && typeof cardGiveRandom === 'function') { const c = cardGiveRandom(); if (c) got.push('🃏 ' + c); }
    if (Math.random() < 0.06 * f) { const fk = pick2(['plant', 'flowers', 'lamp', 'rug', 'painting']); give('bk_' + fk, 1); }
    const note = pick2(PETX_NOTE).replace('{p}', pn); b.px = null; bitAdd('petx'); if (px.act && !P.pet && typeof setPet === 'function') setPet(px.k);
    openModal(`<h2>🐾 ${esc(pn)}</h2><p class="rum">«${esc(note)}»</p><h4>${L2('Ha traído', 'It brought')}</h4><p>${got.map(esc).join('<br>')}</p><div class="row"><button class="btn gold" id="mclose">${L2('¡Buen chico!', 'Good pet!')}</button></div>`, 'party'); $('#mclose').onclick = () => openBitacora('mascota'); sfx('coin'); markDirty(true); }; };

// ---------- álbum de fotos (fotos en grupo) ----------
const ALB_MAX = 24;
function albKey() { return 'thebound.alb.' + ((G.P && G.P.name) || 'x'); }
function albLoad() { try { const a = JSON.parse(storage.get(albKey()) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function albSave(a) { try { storage.set(albKey(), JSON.stringify(a.slice(-ALB_MAX))); return true; } catch (e) { toast(L2('No queda espacio para más fotos: borra alguna.', 'No room for more photos: delete some.'), 'warn'); return false; } }
const PHOTO_FR = [['clasico', L2('Clásico', 'Classic'), '#f4ecd8'], ['oro', L2('Dorado', 'Golden'), '#ffd040'], ['rosa', L2('Corazones', 'Hearts'), '#ff7ab0'], ['noche', L2('Noche', 'Night'), '#2a2a4a'], ['polaroid', 'Polaroid', '#ffffff']];
const PHOTO = { on: false, fr: 0, pose: null };
let albSel = -1;
BIT_RENDER.album = () => { const a = albLoad();
  return `<p class="hint">${L2('Haz fotos con tus amigos: elige pose y marco, y los jugadores que salgan reciben un aviso. Se guardan en este teléfono (máximo ', 'Take photos with your friends: pick a pose and a frame, and players in the shot get a notice. They are stored on this phone (max ')}${ALB_MAX}).</p><div class="row"><button class="btn gold" id="phStart">📷 ${L2('Hacer una foto', 'Take a photo')}</button></div>
   ${albSel >= 0 && a[albSel] ? `<div class="bphoto big"><img src="${a[albSel].d}" alt=""><small>${esc(a[albSel].t || '')}</small><div class="row"><button class="btn sm" id="phBack">${L2('Volver', 'Back')}</button><button class="btn sm danger" id="phDel">${L2('Borrar', 'Delete')}</button></div></div>` : `<div class="bgrid">${a.map((p, i) => `<button class="bphoto" data-ph="${i}"><img src="${p.d}" alt=""><small>${esc((p.t || '').slice(0, 40))}</small></button>`).reverse().join('') || `<p class="hint">${L2('Aún no hay fotos.', 'No photos yet.')}</p>`}</div>`}`; };
BIT_WIRE.album = () => { const s = $('#phStart'); if (s) s.onclick = () => { closeModal(); photoMode(true); };
  $$('#modal [data-ph]').forEach(x => x.onclick = () => { albSel = +x.dataset.ph; openBitacora('album'); });
  const bk = $('#phBack'); if (bk) bk.onclick = () => { albSel = -1; openBitacora('album'); };
  const dl = $('#phDel'); if (dl) dl.onclick = () => { const a = albLoad(); a.splice(albSel, 1); albSave(a); albSel = -1; openBitacora('album'); }; };
function photoMode(on) { PHOTO.on = on; let d = $('#photoBar'); if (!on) { if (d) d.remove(); document.body.classList.remove('photo'); return; }
  const P = G.P, dances = (P.dances || ['clasico']).filter(k => DANCES[k]).slice(0, 8);
  if (!d) { d = document.createElement('div'); d.id = 'photoBar'; document.body.appendChild(d); } document.body.classList.add('photo');
  d.innerHTML = `<div class="phr"><b>📷 ${L2('Pose', 'Pose')}</b>${[['wave', '👋'], ['cheer', '🙌'], ['sit', '🪑']].map(([k, i]) => `<button class="btn sm" data-pp="e:${k}">${i}</button>`).join('')}${dances.map(k => `<button class="btn sm" data-pp="d:${k}">💃 ${esc(DANCES[k].n)}</button>`).join('')}</div>
   <div class="phr"><b>🖼 ${L2('Marco', 'Frame')}</b>${PHOTO_FR.map((f, i) => `<button class="btn sm ${PHOTO.fr === i ? 'gold' : ''}" data-pf="${i}">${esc(f[1])}</button>`).join('')}</div>
   <div class="phr"><button class="btn gold big" id="phShot">📸 ${L2('¡Foto!', 'Snap!')}</button><button class="btn" id="phX">✕</button></div>`;
  $$('#photoBar [data-pp]').forEach(b => b.onclick = () => { const [k, v] = b.dataset.pp.split(':'); if (k === 'd') doDance(v); else doEmote(v); });
  $$('#photoBar [data-pf]').forEach(b => b.onclick = () => { PHOTO.fr = +b.dataset.pf; photoMode(true); });
  $('#phX').onclick = () => photoMode(false); $('#phShot').onclick = () => photoShot(); }
function photoShot() { const P = G.P, cv = $('#game'); if (!cv) return; const fr = PHOTO_FR[PHOTO.fr] || PHOTO_FR[0];
  const cw = cv.width, ch = cv.height, sw = Math.round(cw * 0.56), sh = Math.round(ch * 0.62), sx = Math.round((cw - sw) / 2), sy = Math.round((ch - sh) / 2 - ch * 0.04), W = 240, H = Math.round(240 * sh / sw), pad = fr[0] === 'polaroid' ? 10 : 6, bot = fr[0] === 'polaroid' ? 26 : pad;
  const [c, g] = XC(W + pad * 2, H + pad + bot); g.fillStyle = fr[2]; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false; try { g.drawImage(cv, sx, sy, sw, sh, pad, pad, W, H); } catch (e) { toast(L2('No se pudo hacer la foto.', 'Could not take the photo.'), 'warn'); return; }
  if (fr[0] === 'rosa') { g.fillStyle = '#ff4a8a'; for (let k = 0; k < 14; k++) { const x = (k * 37) % c.width, y = k % 2 ? 1 : c.height - 5; g.fillRect(x, y, 2, 2); g.fillRect(x + 3, y, 2, 2); g.fillRect(x, y + 1, 5, 2); g.fillRect(x + 1, y + 3, 3, 1); } }
  if (fr[0] === 'oro') { g.strokeStyle = '#a8701a'; g.lineWidth = 2; g.strokeRect(2, 2, c.width - 4, c.height - 4); }
  if (fr[0] === 'noche') { g.fillStyle = '#fff4b0'; for (let k = 0; k < 24; k++) g.fillRect((k * 53) % c.width, (k * 29) % 5 + (k % 3 ? 0 : c.height - 5), 1, 1); }
  const ppl = [...G.remote.values()].filter(r => r.map === P.map && Math.hypot(r.x - P.x, r.y - P.y) < 170); const zone = ($('#zone') && $('#zone').textContent) || '';
  const txt = (zone ? zone + ' · ' : '') + (ppl.length ? L2('Con ', 'With ') + ppl.map(r => r.name).join(', ') : P.name);
  if (fr[0] === 'polaroid') { g.fillStyle = '#3a3a44'; g.font = '10px sans-serif'; g.fillText(txt.slice(0, 40), pad, c.height - 9); }
  let d; try { d = c.toDataURL('image/jpeg', 0.72); } catch (e) { return; }
  const a = albLoad(); a.push({ d, t: txt, ts: Date.now() }); if (!albSave(a)) return; bitAdd('photo');
  for (const r of ppl) mailSend(r, { k: 'photo', txt: P.name + L2(' te ha hecho una foto.', ' took a photo of you.') });
  const fl = document.createElement('div'); fl.className = 'phflash'; document.body.appendChild(fl); setTimeout(() => fl.remove(), 400); sfx('coin'); toast('📷 ' + L2('¡Foto guardada en el álbum de la Bitácora!', 'Photo saved to the Logbook album!'), 'info'); }

// ---------- buzón: notas, regalos y visitas (por la presencia, como el PvP) ----------
const MAILQ = { out: [], seq: 0, sid: Math.random().toString(36).slice(2, 7), pend: new Map() }, MAIL_SEEN = new Set();
function mailSend(r, m) { if (!r || !r.id || !netOnline()) return false; m.to = r.id; m.s = ++MAILQ.seq; m.sid = MAILQ.sid; m.n = (G.P.name || '').slice(0, 16); m.ts = G.t; MAILQ.out.push(m); while (MAILQ.out.length > 6) MAILQ.out.shift(); netPresence(true); return m; }
function mailOnline() { return [...G.remote.values()].filter(r => r.id && r.name); }
{ const _sp = socialPresence; socialPresence = function (o) { _sp.apply(this, arguments); MAILQ.out = MAILQ.out.filter(m => G.t - m.ts < 25); if (MAILQ.out.length) o.bx = MAILQ.out; if (VISIT.host) o.vh = 1; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr.apply(this, arguments); if (!Array.isArray(pr.bx)) return; for (const m of pr.bx) { if (!m || m.to !== NET.myId || typeof m.s !== 'number') continue; const key = (m.sid || '') + ':' + m.s; if (MAIL_SEEN.has(key)) continue; MAIL_SEEN.add(key); try { mailRecv(r, m); } catch (e) { console.warn(e); } } }; }
function mailRecv(r, m) { const P = G.P; if (!P) return; const b = BIT(), from = cleanStr(m.n || r.name, 16) || r.name, add = (o) => { b.mail.unshift(Object.assign({ f: from, t: Date.now() }, o)); if (b.mail.length > 40) b.mail.length = 40; bitBadge = true; markDirty(); };
  if (m.k === 'note') { add({ k: 'note', txt: cleanStr(m.txt, 140) }); toast('✉ ' + from + ': ' + cleanStr(m.txt, 60), 'info', 4); }
  else if (m.k === 'gift') { const id = String(m.it || ''), q = clamp(m.q | 0, 1, 999); if (!ITEMS[id] || ITEMS[id].t === 'quest') return; giveItem(id, q, true); add({ k: 'gift', it: id, q, txt: cleanStr(m.txt || '', 80) }); toast('🎁 ' + from + L2(' te regala ', ' gives you ') + ITEMS[id].n + ' ×' + q, 'loot', 4); mailSend(r, { k: 'ack', a: m.s, as: m.sid }); }
  else if (m.k === 'ack') { for (const [k, g] of MAILQ.pend) if (g.s === m.a && m.as === MAILQ.sid) MAILQ.pend.delete(k); }
  else if (m.k === 'photo') { add({ k: 'note', txt: cleanStr(m.txt, 100) }); toast('📷 ' + cleanStr(m.txt, 60), 'info'); }
  else if (m.k === 'visreq') { add({ k: 'visreq', rid: r.id }); toast('🏠 ' + from + L2(' quiere visitar tu casa (mira el buzón de la Bitácora).', ' wants to visit your house (see the Logbook mailbox).'), 'info', 5); }
  else if (m.k === 'visno') { add({ k: 'note', txt: L2('Ahora no puede recibir visitas.', 'Can’t host visits right now.') }); }
  else if (m.k === 'home' && m.cfg && typeof m.cfg === 'object') { VISIT.offer = { name: from, cfg: m.cfg, b: Array.isArray(m.b) ? m.b.slice(0, 400) : [], base: String(m.base || ''), lv: m.lv | 0, aq: Array.isArray(m.aq) ? m.aq.filter(x => typeof x === 'string').slice(0, 8) : [] }; add({ k: 'home' }); toast('🏠 ' + from + L2(' te abre su casa. Entra desde el buzón de la Bitácora.', ' opens their house to you. Enter from the Logbook mailbox.'), 'quest', 6); }
  else if (typeof JUEGOS_RECV === 'function') JUEGOS_RECV(r, m, from); }
// regalos sin respuesta en 30 s: se devuelven
V33_TICKS.push(() => { for (const [k, g] of MAILQ.pend) if (G.t - g.ts > 30) { MAILQ.pend.delete(k); giveItem(g.it, g.q, true); toast(L2('El regalo no llegó y ha vuelto a tu bolsa.', 'The gift did not arrive and is back in your bag.'), 'warn'); } });
let mailTo = null;
BIT_RENDER.buzon = () => { const P = G.P, b = BIT(), on = mailOnline(); b.mail.forEach(m => { if (m.k !== 'visreq' && m.k !== 'home') m.r = 1; }); bitBadge = true;
  const inbox = b.mail.map((m, i) => `<div class="bmail ${m.r ? '' : 'new'}"><b>${m.k === 'gift' ? '🎁' : m.k === 'visreq' || m.k === 'home' ? '🏠' : '✉'} ${esc(m.f)}</b><small>${m.k === 'gift' ? L2('Te regaló ', 'Gave you ') + esc((ITEMS[m.it] || { n: '?' }).n) + ' ×' + m.q + (m.txt ? ' · «' + esc(m.txt) + '»' : '') : m.k === 'visreq' ? L2('Quiere visitar tu casa.', 'Wants to visit your house.') : m.k === 'home' ? L2('Te ha abierto su casa.', 'Opened their house to you.') : '«' + esc(m.txt || '') + '»'}</small>
    ${m.k === 'visreq' && !m.r ? `<button class="btn sm gold" data-vok="${i}">${L2('Aceptar', 'Accept')}</button><button class="btn sm" data-vno="${i}">${L2('Ahora no', 'Not now')}</button>` : ''}${m.k === 'home' && !m.r && VISIT.offer ? `<button class="btn sm gold" data-vgo="${i}">${L2('Entrar ahora', 'Enter now')}</button>` : ''}<button class="btn sm" data-mdel="${i}">✕</button></div>`).join('');
  let send = ''; const tgt = on.find(r => r.id === mailTo);
  if (tgt) { const gifts = P.inv.map((s, i) => [s, i]).filter(([s]) => ITEMS[s.id] && ITEMS[s.id].t !== 'quest' && !(typeof invNeeded === 'function' && invNeeded(s.id))).slice(0, 60);
    send = `<div class="bcard"><b>${L2('Para', 'To')} ${esc(tgt.name)}</b><input id="mTxt" maxlength="120" placeholder="${L2('Escribe una nota…', 'Write a note…')}" autocomplete="off"><div class="row"><button class="btn sm gold" id="mNote">✉ ${L2('Enviar nota', 'Send note')}</button><button class="btn sm" id="mVis">🏠 ${L2('Pedir visita a su casa', 'Ask to visit their house')}</button><button class="btn sm" id="mBack">${L2('Volver', 'Back')}</button></div>
      <h4>🎁 ${L2('Regalar (se envía con la nota)', 'Gift (sent with the note)')}</h4><div class="slist">${gifts.map(([s, i]) => `<div class="srow">${iconHTML(ITEMS[s.id].icon, 22)}<div class="sn"><b>${esc(ITEMS[s.id].n)}</b><small>×${s.q || 1}</small></div><button class="btn sm" data-gift="${i}|1">1</button>${(s.q || 1) > 1 ? `<button class="btn sm" data-gift="${i}|${s.q}">${L2('Todo', 'All')}</button>` : ''}</div>`).join('')}</div></div>`; }
  else send = on.length ? `<div class="bcard"><b>${L2('Jugadores conectados', 'Players online')}</b>${on.map(r => `<div class="brow"><span>${esc(r.name)} <small>Nv. ${r.lv}</small></span><button class="btn sm" data-mto="${r.id}">✉ ${L2('Escribir', 'Write')}</button></div>`).join('')}</div>` : `<p class="hint">${L2('Conéctate al online (Menú › En línea) para enviar notas, regalos y visitar casas de otros jugadores.', 'Go online (Menu › Online) to send notes, gifts and visit other players’ houses.')}</p>`;
  return send + `<h4>${L2('Recibidos', 'Received')}</h4><div class="blist">${inbox || `<p class="hint">${L2('El buzón está vacío.', 'The mailbox is empty.')}</p>`}</div>`; };
BIT_WIRE.buzon = () => { const P = G.P, b = BIT(), on = mailOnline(), tgt = on.find(r => r.id === mailTo);
  $$('#modal [data-mto]').forEach(x => x.onclick = () => { mailTo = x.dataset.mto; openBitacora('buzon'); });
  $$('#modal [data-mdel]').forEach(x => x.onclick = () => { b.mail.splice(+x.dataset.mdel, 1); markDirty(); openBitacora('buzon'); });
  const bk = $('#mBack'); if (bk) bk.onclick = () => { mailTo = null; openBitacora('buzon'); };
  const txt = () => cleanStr(($('#mTxt') || {}).value || '', 120);
  const nt = $('#mNote'); if (nt) nt.onclick = () => { const t = txt(); if (!t) { toast(L2('Escribe algo primero.', 'Write something first.'), 'warn'); return; } if (mailSend(tgt, { k: 'note', txt: t })) { bitAdd('mailOut'); toast('✉ ' + L2('Nota enviada a ', 'Note sent to ') + tgt.name, 'info'); mailTo = null; openBitacora('buzon'); } };
  const vs = $('#mVis'); if (vs) vs.onclick = () => { if (mailSend(tgt, { k: 'visreq' })) toast('🏠 ' + L2('Petición de visita enviada. Si acepta, te llegará al buzón.', 'Visit request sent. If they accept, it arrives in your mailbox.'), 'info', 4); };
  $$('#modal [data-gift]').forEach(x => x.onclick = () => { const [i, q] = x.dataset.gift.split('|').map(Number), s = P.inv[i]; if (!s || !tgt) return; const id = s.id, n = Math.min(q, s.q || 1); takeItem(id, n); const m = mailSend(tgt, { k: 'gift', it: id, q: n, txt: txt() }); if (!m) { giveItem(id, n, true); return; } MAILQ.pend.set(m.sid + ':' + m.s, { s: m.s, it: id, q: n, ts: G.t }); bitAdd('mailOut'); toast('🎁 ' + ITEMS[id].n + ' ×' + n + ' → ' + tgt.name, 'info'); uiDirty.inv = true; markDirty(true); mailTo = null; openBitacora('buzon'); });
  $$('#modal [data-vok]').forEach(x => x.onclick = () => { const m = b.mail[+x.dataset.vok], r = on.find(q => q.id === m.rid); m.r = 1; if (!r) { toast(L2('Ya no está conectado.', 'They are no longer online.'), 'warn'); openBitacora('buzon'); return; } visitOffer(r); openBitacora('buzon'); });
  $$('#modal [data-vno]').forEach(x => x.onclick = () => { const m = b.mail[+x.dataset.vno], r = on.find(q => q.id === m.rid); m.r = 1; if (r) mailSend(r, { k: 'visno' }); openBitacora('buzon'); });
  $$('#modal [data-vgo]').forEach(x => x.onclick = () => { b.mail[+x.dataset.vgo].r = 1; closeModal(); visitEnter(); }); };

// ---------- visitas a casas de otros jugadores ----------
// El anfitrión manda su casa (configuración + muebles colocados). El visitante entra en una copia de solo lectura
// (mapa `visita`); los muebles van como registros «remotos» (no se pueden mover) y no se toca nada de su propia casa.
const VISIT = { offer: null, host: 0, on: null };
function visitOffer(r) { const P = G.P, hs = Object.keys(P.homes || {}).filter(k => HOUSES[k] && !isUpper(k)); if (!hs.length) { mailSend(r, { k: 'visno' }); toast(L2('No tienes casa todavía.', 'You don’t have a house yet.'), 'warn'); return; }
  const base = P.inside && hs.includes(homeBaseOf(P.inside)) ? homeBaseOf(P.inside) : hs[0], up = homeUpId(base);
  const recs = (P.builds || []).filter(x => Array.isArray(x) && (x[0] === base || x[0] === up)); const pay = { k: 'home', cfg: P.homes[base], b: recs, base, lv: P.lv, aq: (P.bit && P.bit.aq) || [] };
  if (JSON.stringify(pay).length > 24000) { toast(L2('Tu casa tiene demasiadas cosas para enviarla.', 'Your house has too many things to send.'), 'warn'); mailSend(r, { k: 'visno' }); return; }
  mailSend(r, pay); VISIT.host = G.t; bitAdd('visit'); toast('🏠 ' + r.name + L2(' puede entrar a tu casa.', ' can come into your house.'), 'info'); }
function visitEnter() { const P = G.P, O = VISIT.offer; if (!O) return; if (P.map !== 'world') { toast(L2('Sal al exterior primero.', 'Go outside first.'), 'warn'); return; } if (!HOUSES[O.base]) { toast(L2('Esa casa no existe en tu versión del juego.', 'That house does not exist in your game version.'), 'warn'); return; }
  P.retX = P.x; P.retY = P.y;
  transition(() => { const sw = { homes: P.homes, partner: P.partner, partner2: P.partner2, kids: P.kids, petHome: P.petHome };
    const act = new Map(), upId = homeUpId(O.base); for (const x of O.b) { if (!Array.isArray(x) || !BK[x[4]]) continue; const m = x[0] === upId ? 'visita_up' : 'visita'; const rec = { m, x: x[1] | 0, y: x[2] | 0, L: x[3] | 0, k: x[4], sl: x[5] || undefined, sys: x[6] || undefined }; act.set(bkey(m, rec.x, rec.y, rec.L), rec); }
    BLD.rem.set('__visit', { id: '__visit', ver: 0, total: 0, got: new Map(), act }); BLD.dirty = true;
    HOUSES.visita = Object.assign({}, HOUSES[O.base], { n: L2('Casa de ', 'House of ') + O.name });
    let M = null; try { P.homes = { visita: O.cfg }; P.partner = null; P.partner2 = null; P.kids = []; P.petHome = null; delete G.maps.visita; M = makeHome('visita');
      for (const [k, r] of [...BLD.mine]) if (r.m === 'visita' || r.m === 'visita_up') { BLD.mine.delete(k); act.set(k, r); }
      M.visit = O.name; P.inside = 'visita'; VISIT.on = O.name; setMap(M, M.exit.x * 16 + 8, (M.exit.y - 1) * 16 + 10, 'up'); }
    catch (e) { console.warn(e); toast(L2('No se pudo abrir la casa.', 'Could not open the house.'), 'warn'); }
    finally { Object.assign(P, sw); bldSave(); }
    if (M) { banner('🏠 ' + L2('Casa de ', 'House of ') + O.name, L2('Estás de visita: mira, pero no toques.', 'You are visiting: look, but don’t touch.')); bitAdd('visit'); } }); }
{ const _bd = BLD.rem.delete.bind(BLD.rem); BLD.rem.delete = k => (k === '__visit' && VISIT.on ? false : _bd(k)); }
{ const _it = interactTarget; interactTarget = function () { const r = _it.apply(this, arguments); if (G.map && G.map.visit && r && r.kind !== 'npc') return null; return r; }; }
{ const _ex = exitInterior; exitInterior = function () { const was = G.map && G.map.visit; const r = _ex.apply(this, arguments); if (was) setTimeout(() => { if (G.map && G.map.visit) return; VISIT.on = null; BLD.rem.delete('__visit'); delete G.maps.visita; delete G.maps.visita_up; BLD.dirty = true; }, 1500); return r; }; }

// ---------- inventario: «Vender basura» ----------
function junkList() { const P = G.P, out = [];
  P.inv.forEach((s, i) => { const I = ITEMS[s.id]; if (!I || !I.slot || I.t === 'quest' || s.up || s.fg || s.lock || (I.rar || 0) >= 3) return; if (typeof invNeeded === 'function' && invNeeded(s.id)) return;
    const eq = P.equip && P.equip[I.slot], ET = eq && ITEMS[eq.id]; const other = I.cls && I.cls !== P.cls, worse = ET && (ET.tier || 0) > (I.tier || 0), low = (I.lv || 1) < P.lv - 30;
    if (other || worse || low) out.push(i); }); return out; }
let junkSel = null;
function openJunk() { const P = G.P, L = junkList(); if (!junkSel) junkSel = new Set(L); for (const i of [...junkSel]) if (!L.includes(i)) junkSel.delete(i);
  const pr = i => Math.max(1, Math.floor(ITEMS[P.inv[i].id].price * 0.4)) * (P.inv[i].q || 1), tot = [...junkSel].reduce((a, i) => a + pr(i), 0);
  openModal(`<h2>🧹 ${L2('Vender basura', 'Sell junk')}</h2><p class="hint">${L2('Equipo que ya no te sirve: de otra clase, de menos nivel que el que llevas puesto o muy por debajo de tu nivel. Nunca entra lo mejorado (+1…), lo forjado a mano, lo épico o lo que pide una misión. Quita la marca de lo que quieras guardar.', 'Gear you no longer need: other class, lower tier than what you wear, or far below your level. Never includes upgraded (+1…), hand-forged, epic items or anything a quest needs. Untick whatever you want to keep.')}</p>
   <div class="slist">${L.map(i => { const s = P.inv[i], I = ITEMS[s.id]; return `<label class="srow jrow"><input type="checkbox" data-jk="${i}" ${junkSel.has(i) ? 'checked' : ''}>${iconHTML(I.icon, 24)}<div class="sn"><b style="color:${RARC[I.rar || 0]}">${esc(I.n)}</b><small>Nv. ${I.lv || 1} · ${fmt(pr(i))} ${L2('oro', 'gold')}</small></div></label>`; }).join('') || `<p class="hint">${L2('No hay nada que parezca basura. ¡Bolsa ordenada!', 'Nothing looks like junk. Tidy bag!')}</p>`}</div>
   <div class="goldline">${L2('Total', 'Total')}: <b>${fmt(tot)}</b> ${L2('oro', 'gold')} (${junkSel.size})</div><div class="row"><button class="btn gold" id="jSell" ${junkSel.size ? '' : 'disabled'}>${L2('Vender', 'Sell')} ${junkSel.size}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = () => { junkSel = null; closeModal(); };
  $$('#modal [data-jk]').forEach(x => x.onchange = () => { const i = +x.dataset.jk; if (x.checked) junkSel.add(i); else junkSel.delete(i); openJunk(); });
  $('#jSell').onclick = () => { const idx = [...junkSel].sort((a, b) => b - a); let g = 0; for (const i of idx) { if (!P.inv[i]) continue; g += pr(i); P.inv.splice(i, 1); } P.gold += g; bitAdd('junk', idx.length); junkSel = null; sfx('coin'); toast('🧹 ' + L2('Vendido: ', 'Sold: ') + idx.length + ' · +' + fmt(g) + ' ' + L2('oro', 'gold'), 'loot'); invSel = -1; uiDirty.inv = true; markDirty(true); closeModal(); if (!$('#panel').hidden) renderPanel(); }; }
{ const _ri = renderInv; renderInv = function (B) { _ri.apply(this, arguments); const chips = $('.invL .chips', B); if (!chips || $('#bJunk', B)) return; const n = junkList().length;
  chips.insertAdjacentHTML('beforeend', `<button class="chip ${n ? 'gold' : ''}" id="bJunk">🧹 ${L2('Vender basura', 'Sell junk')}${n ? ' (' + n + ')' : ''}</button>`); $('#bJunk', B).onclick = () => { junkSel = null; openJunk(); }; }; }

// ---------- estilos ----------
{ const st = document.createElement('style'); st.textContent = `
.bitbtn{position:absolute;left:calc(.8em + env(safe-area-inset-left,0px));top:calc(12.5em + env(safe-area-inset-top,0px));display:flex;align-items:center;gap:.3em;padding:.25em .55em .25em .35em;font:inherit;font-size:.9em;color:#ffe08a;background:linear-gradient(var(--pbg1),var(--pbg2));border:2px solid var(--gold);border-radius:.6em;box-shadow:0 0 0 2px var(--ink),0 3px 8px rgba(0,0,0,.45);z-index:6}
.bitbtn span{text-shadow:0 1px 0 #000}.bitbtn .bdot{position:absolute;right:-.45em;top:-.45em;min-width:1.25em;height:1.25em;padding:0 .2em;border-radius:1em;background:#e8303a;color:#fff;font-style:normal;font-size:.72em;display:grid;place-items:center;box-shadow:0 0 0 2px var(--ink)}
.bitbtn.sm{left:calc(7.6em + env(safe-area-inset-left,0px));font-size:.82em;padding:.3em .5em}
#tracker[hidden]~.bitbtn{top:calc(7.4em + env(safe-area-inset-top,0px))}
#party{top:calc(16.4em + env(safe-area-inset-top,0px))}
@media (orientation:portrait){.bitbtn{top:calc(15.4em + env(safe-area-inset-top,0px))}#party{top:calc(19.4em + env(safe-area-inset-top,0px))}}
body.photo #hud>*:not(#joy){opacity:0;pointer-events:none}body.photo #hud #joy{opacity:.35}
#photoBar{position:fixed;left:50%;bottom:calc(.6em + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;display:flex;flex-direction:column;gap:.3em;max-width:min(96vw,46em);padding:.45em .6em;background:rgba(14,9,7,.88);border:2px solid var(--gold);border-radius:.7em}
#photoBar .phr{display:flex;flex-wrap:wrap;gap:.25em;align-items:center}#photoBar b{color:#ffe08a;margin-right:.3em;font-size:.85em}
.phflash{position:fixed;inset:0;background:#fff;z-index:99;animation:phf .4s ease-out forwards;pointer-events:none}@keyframes phf{to{opacity:0}}
.pframe.frb{box-shadow:0 0 0 2px var(--frc),0 0 10px 2px var(--frc)}
.pframe.fr-arcoiris{animation:frrb 3s linear infinite}@keyframes frrb{0%{box-shadow:0 0 0 2px #ff5a5a,0 0 10px 2px #ff5a5a}33%{box-shadow:0 0 0 2px #5ad06a,0 0 10px 2px #5ad06a}66%{box-shadow:0 0 0 2px #5a8aff,0 0 10px 2px #5a8aff}100%{box-shadow:0 0 0 2px #ff5a5a,0 0 10px 2px #ff5a5a}}
.modal.bitm .frame{max-width:min(96vw,44em)}
.btabs{display:flex;flex-wrap:wrap;gap:.25em;margin-bottom:.5em}.btab{position:relative;flex:1 1 auto;padding:.35em .5em;border-radius:.45em;border:2px solid #5a4320;background:#1a110c;color:#f3e6c8;font:inherit;font-size:.82em;white-space:nowrap}.btab.on{border-color:#ffd040;background:#3a2a14;color:#ffe08a}
.btab .bdot{position:absolute;right:-.35em;top:-.45em;min-width:1.2em;height:1.2em;border-radius:1em;background:#e8303a;color:#fff;font-style:normal;font-size:.72em;display:grid;place-items:center}
@media (max-width:640px){.btab span{display:none}}
.bbody{max-height:56vh;overflow:auto;display:flex;flex-direction:column;gap:.4em}
.bcard{background:#1a110c;border:1px solid #5a4320;border-radius:.5em;padding:.45em .6em;display:flex;flex-direction:column;gap:.25em;align-items:flex-start}.bcard b{color:#ffe9a0}.bcard small{color:var(--muted)}
.bcard.story{border-color:#ffd23a}.bcard.ready{border-color:#ffd040;box-shadow:0 0 8px rgba(255,208,64,.35)}.bcard.wx{border-color:#7ab0ff}
.bcard input{width:100%;box-sizing:border-box;padding:.35em .5em;border-radius:.4em;border:1px solid #5a4320;background:#0e0907;color:#f3e6c8;font:inherit}
.brow{display:flex;align-items:center;gap:.4em;width:100%}.brow span{flex:1;min-width:0}
.bprog{display:grid;grid-template-columns:minmax(0,1fr) minmax(3em,8em);box-sizing:border-box;padding-right:.4em;gap:.4em;align-items:center;width:100%;font-size:.85em}.bprog .bar{height:.5em;width:auto;min-width:0;margin:0}
.blist{display:flex;flex-direction:column;gap:.3em}
.bach{display:flex;align-items:center;gap:.5em;padding:.35em .5em;border-radius:.45em;background:#140e0b;border:1px solid rgba(217,178,90,.25)}.bach.ok{border-color:#ffd040;box-shadow:0 0 8px rgba(255,208,64,.4)}.bach.got{opacity:.7}
.bach .bic{font-size:1.5em;width:1.4em;text-align:center}.bach .bt{flex:1;min-width:0;display:flex;flex-direction:column}.bach .bt small{color:var(--muted)}.bach .bar{height:.45em;margin:.15em 0}.bach .brw{font-size:.78em}
.bfr{display:grid;grid-template-columns:repeat(auto-fill,minmax(7em,1fr));gap:.4em}.bfrb{display:flex;flex-direction:column;align-items:center;gap:.2em;padding:.5em .3em;border-radius:.5em;border:2px solid #5a4320;background:#1a110c;color:#f3e6c8;font:inherit;font-size:.8em}.bfrb.on{border-color:#ffd040}
.bfrb i{width:2.4em;height:2.4em;border-radius:.3em;background:#2a1a10;box-shadow:0 0 0 2px var(--frc),0 0 8px 1px var(--frc)}.bfrb.fr-arcoiris i{animation:frrb 3s linear infinite}.bfrb[disabled]{opacity:.5}
.bgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(9em,1fr));gap:.4em}.bphoto{display:flex;flex-direction:column;gap:.2em;padding:.25em;border-radius:.4em;border:1px solid #5a4320;background:#1a110c;color:#f3e6c8;font:inherit;font-size:.72em}.bphoto img{width:100%;image-rendering:pixelated;border-radius:.2em}
.bphoto.big img{max-height:42vh;object-fit:contain}
.bmail{display:flex;flex-wrap:wrap;align-items:center;gap:.35em;padding:.35em .5em;border-radius:.45em;background:#140e0b;border:1px solid rgba(217,178,90,.25)}.bmail.new{border-color:#ffd040}.bmail b{color:#ffe9a0}.bmail small{flex:1 1 100%;color:#f3e6c8}
.jrow{cursor:pointer}.jrow input{width:1.2em;height:1.2em}.chip.gold{border-color:#ffd040;color:#ffe08a}
`; document.head.appendChild(st); }

// ---------- Lupa › Sistemas ----------
if (typeof GSIS !== 'undefined') {
 GSIS.unshift(['bitacora', '📖 ' + L2('Bitácora del aventurero', 'Adventurer’s logbook'), () => [
  L2('El botón 📖 Bitácora está a la izquierda, debajo de la misión que sigues. El punto rojo avisa de logros para reclamar, cartas del buzón o tu mascota de vuelta.', 'The 📖 Logbook button is on the left, under the quest you follow. The red dot tells you about achievements to claim, mail or your pet coming back.'),
  L2('Hoy: lo más importante (historia, misiones para entregar con botón «Ir», misión diaria, logros a punto, mascota, tienda, buzón y el clima especial).', 'Today: the most important things (story, quests to turn in with a «Go» button, daily quest, nearly-done achievements, pet, shop, mailbox and special weather).'),
  L2('Logros: ' + BIT_ACH.length + ' logros curiosos con títulos, marcos para el retrato y muebles. Marcos: cambia el borde de tu retrato.', 'Achievements: ' + BIT_ACH.length + ' fun achievements with titles, portrait frames and furniture. Frames: change your portrait border.'),
  L2('Álbum: fotos en grupo con pose y marco. Mascota: mándala a explorar 10, 30 o 60 minutos. Buzón: notas, regalos y visitas a casas de otros jugadores conectados.', 'Album: group photos with pose and frame. Pet: send it exploring for 10, 30 or 60 minutes. Mailbox: notes, gifts and visits to the houses of other online players.'),
  L2('Junto a la Bitácora, el botón ↩ abre la última ventana que usaste. En el inventario, «🧹 Vender basura» vende de una vez el equipo que ya no te sirve.', 'Next to the Logbook, the ↩ button opens the last window you used. In the inventory, «🧹 Sell junk» sells all gear you no longer need at once.')], () => null]);
 GSIS.splice(1, 0, ['visitas', '🏠 ' + L2('Visitar casas de otros jugadores', 'Visiting other players’ houses'), () => [
  L2('Bitácora › Buzón › Escribir a un jugador conectado › «Pedir visita a su casa». Si acepta, te llega su casa al buzón: «Entrar ahora» (desde el exterior).', 'Logbook › Mailbox › Write to an online player › «Ask to visit their house». If they accept, their house arrives in your mailbox: «Enter now» (from outdoors).'),
  L2('Ves su casa tal como la tiene (muebles, suelo y paredes). Estás de visita: no puedes mover ni usar sus cosas. Sal por la puerta para volver.', 'You see their house as they have it (furniture, floor and walls). You are visiting: you can’t move or use their things. Leave through the door to go back.')], () => null]);
}
