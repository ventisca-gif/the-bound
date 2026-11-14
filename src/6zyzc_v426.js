// ================= v4.26: COLGANTE AL MÁXIMO, BESOS SIN MANO RARA, PAREJA QUE HABLA Y QUE MONTA CONTIGO =================
// - Al llegar a 10 corazones de Confianza y de Amor con alguien, te regala el Colgante de Promesa (una vez por persona).
// - Mientras os besáis o abrazáis no se dibuja la línea de las manos cogidas.
// - La pareja que te acompaña dice cosas en globos de texto según lo que pasa (noche, combate, vida baja, montura,
//   Velo Roto, en brazos, de la mano…).
// - Al montar, quien te acompaña sube detrás de ti y te agarra de la cintura, con cualquier montura y cualquier cuerpo;
//   también lo ven los demás jugadores.

// ---------- Colgante de Promesa al máximo ----------
function colgMax(k) { const R = rel(k); if (R.t >= 1000 && R.a >= 1000 && !R.colg) { R.colg = 1; giveItem('colgante_amor', 1); toast('💍 ' + nick(k) + L2(' te regala un Colgante de Promesa. Ya puedes pedirle que sea tu pareja.', ' gives you a Promise Pendant. Now you can ask them to be your partner.'), 'quest', 6); sfx('level'); markDirty(true); } }
{ const _ar = addRel; addRel = function (k, ...a) { const r = _ar(k, ...a); try { if (ROM[k] && G.P.partner !== k && G.P.partner2 !== k) colgMax(k); } catch (e) { } return r; }; }
{ const _rm = romanceMenu; romanceMenu = function (npc, msg) { const k = relKey(npc.id); if (ROM[k] && G.P.partner !== k && G.P.partner2 !== k) colgMax(k); return _rm(npc, msg); }; }

// ---------- sin mano rara al besar ----------
{ const _hl = drawHandLink; drawHandLink = function (e, cx, cy) { const P = G.P; if (!P || /kiss|hug/.test(P.anim || '') || /kiss|hug/.test(e.anim || '') || Math.abs(e.x - P.x) < 9 || (typeof mountOf === 'function' && mountOf(P))) return; return _hl(e, cx, cy); }; }

// ---------- la pareja habla ----------
const PT_TALK = {
  any: [L2('Me gusta ir contigo a cualquier parte.', 'I like going anywhere with you.'), L2('¿Te he dicho hoy que eres increíble?', 'Have I told you today that you are amazing?'), L2('Mira qué cielo tan bonito…', 'Look at that beautiful sky…'), L2('Cuando volvamos a casa, me toca elegir la cena.', 'When we get home, I pick dinner.'), L2('¿Y si nos perdemos un rato?', 'What if we get lost for a while?'),
    L2('No sueltes mi mano, ¿vale?', 'Don\'t let go of my hand, okay?'), L2('Contigo hasta los slimes dan menos miedo.', 'With you even slimes are less scary.'), L2('Algún día escribirán canciones sobre nosotros.', 'Someday they will write songs about us.'), L2('¿Tienes hambre? Yo un poco.', 'Are you hungry? I am a little.'), L2('Me encanta cómo sonríes cuando ganas.', 'I love how you smile when you win.'), L2('Gracias por llevarme contigo.', 'Thank you for taking me with you.'), L2('Vamos despacio, que quiero disfrutar el paseo.', 'Let\'s go slowly, I want to enjoy the walk.')],
  night: [L2('Las estrellas salen solo para nosotros.', 'The stars come out just for us.'), L2('De noche me das más calor que una hoguera.', 'At night you keep me warmer than a campfire.'), L2('Tengo un poco de frío… ¿me abrazas?', 'I\'m a little cold… hug me?')],
  fight: [L2('¡Cuidado! ¡Por tu izquierda!', 'Careful! On your left!'), L2('¡Vamos, tú puedes!', 'Come on, you can do it!'), L2('¡Nadie le hace daño a mi pareja!', 'No one hurts my partner!'), L2('¡Qué golpe! ♥', 'What a hit! ♥')],
  low: [L2('¡Estás herido! Bebe una poción, por favor.', 'You\'re hurt! Drink a potion, please.'), L2('No me asustes así…', 'Don\'t scare me like that…'), L2('Retrocede un poco, te cubro.', 'Step back a bit, I\'ll cover you.')],
  mount: [L2('¡Más rápido! ¡Ja, ja, ja!', 'Faster! Ha ha ha!'), L2('Me agarro fuerte, no me sueltes.', 'I\'m holding on tight, don\'t drop me.'), L2('Qué bien se ve todo desde aquí arriba.', 'Everything looks so nice from up here.'), L2('Este paseo a caballo es lo mejor del día.', 'This ride is the best part of the day.')],
  carry: [L2('Peso poco, ¿verdad? Di que sí.', 'I\'m light, right? Say yes.'), L2('Podría acostumbrarme a esto…', 'I could get used to this…'), L2('Mi héroe ♥', 'My hero ♥')],
  hand: [L2('Tu mano está calentita.', 'Your hand is warm.'), L2('Me gusta que todos vean que vamos juntos.', 'I like everyone seeing we\'re together.')],
  velo: [L2('Este sitio me pone los pelos de punta… quédate cerca.', 'This place gives me goosebumps… stay close.'), L2('La luna nos está mirando. No le devuelvas la sonrisa.', 'The moon is watching us. Don\'t smile back.'), L2('Aquí todo susurra. Pero tu voz es la única que quiero oír.', 'Everything whispers here. But yours is the only voice I want to hear.')],
  nieve: [L2('¡Nieve azul! Parece un sueño.', 'Blue snow! It\'s like a dream.'), L2('¿Subimos al carrusel? Venga, porfa.', 'Shall we ride the carousel? Come on, please.')],
  town: [L2('¿Paramos en alguna tienda? Solo a mirar…', 'Shall we stop at a shop? Just to look…'), L2('Todo el pueblo nos mira. Normal, hacemos buena pareja.', 'The whole town is looking at us. Of course, we make a good couple.')],
};
let PT_T = 20;
V33_TICKS.push(dt => { const P = G.P; if (!P || typeof COMP === 'undefined' || !COMP || !COMP.e || COMP.e.remove || P.dead) return; const k = relKey(COMP.e.id); if (P.partner !== k && P.partner2 !== k && P.spouse !== k) return;
  PT_T -= dt; const low = P.hp < P.S.maxhp * 0.3; if (PT_T > 0 && !(low && PT_T > 8 && (P.ptLowT || 0) < G.t)) return; if (low) P.ptLowT = G.t + 40; PT_T = 28 + Math.random() * 30;
  const fight = G.t - (P.combatT || -99) < 4, mnt = typeof mountOf === 'function' && mountOf(P), M = G.map, pool = [];
  if (low) pool.push(...PT_TALK.low); else if (fight) pool.push(...PT_TALK.fight); else { pool.push(...PT_TALK.any); if (typeof isNight === 'function' && isNight()) pool.push(...PT_TALK.night, ...PT_TALK.night); if (mnt) pool.push(...PT_TALK.mount, ...PT_TALK.mount, ...PT_TALK.mount);
    if (typeof carryActive === 'function' && carryActive()) pool.push(...PT_TALK.carry, ...PT_TALK.carry); if (COMP.hand) pool.push(...PT_TALK.hand); if (M && M.vr) pool.push(...PT_TALK.velo, ...PT_TALK.velo); if (typeof inNieve === 'function' && inNieve(P)) pool.push(...PT_TALK.nieve, ...PT_TALK.nieve, ...PT_TALK.nieve); if (G.pSafe) pool.push(...PT_TALK.town); }
  const e = COMP.e; e.chat = pool[Math.floor(Math.random() * pool.length)]; e.chatT = G.t; P.ptChat = e.chat; P.ptChatT = G.t; });
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); const P = G.P; if (P && P.ptChat && G.t - P.ptChatT < 5) o.pc = String(P.ptChat).slice(0, 90); }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); if (r.rcp && typeof pr.pc === 'string' && pr.pc !== r.rcp.chat) { r.rcp.chat = pr.pc.slice(0, 90); r.rcp.chatT = G.t; } }; }

// ---------- montar juntos: detrás de ti, agarrando tu cintura ----------
function rideComp(e) { if (e === G.P) return typeof COMP !== 'undefined' && COMP && COMP.e && !COMP.e.remove && !(typeof carryActive === 'function' && carryActive()) && COMP.e.map !== 'hidden' ? COMP.e : null; if (e.type === 'remote' && e.rcp && !e.rcp.remove && !e.rcp.carriedBy) return e.rcp; return null; }
function drawPassenger(e, c, cx, cy) { const A = c.atlas, k = mountOf(e); if (!A || !k) return; const D = MOUNTS[k], fz = D.fly ? 14 + Math.sin(G.t * 3) * 3 : 0, z = 12 + fz + (e.z || 0), dir = e.dir || 'down', row = DIRI[dir] || 0, d = dir === 'left' ? -1 : 1;
  const ox = dir === 'left' || dir === 'right' ? -d * 9 : 0, oy = dir === 'down' ? -3 : dir === 'up' ? 8 : 0, col = A.idx.idle || 0, bob = e.anim === 'walk' ? (Math.floor(G.t * 10) % 2) : 0;
  const x = Math.round(e.x - cx - A.ax + ox), y = Math.round(e.y - cy - A.ay - z + oy - bob), cutY = Math.round(e.y - cy - z - 9 + oy);   // las piernas quedan tapadas por la montura: va sentada
  ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y - 40, A.fw + 8, cutY - (y - 40)); ctx.clip(); atlasBlit(ctx, A, col, row, x, y, A.fw, A.fh); ctx.restore(); }
function drawWaistHands(e, c, cx, cy) { const k = mountOf(e); if (!k) return; const D = MOUNTS[k], fz = D.fly ? 14 + Math.sin(G.t * 3) * 3 : 0, z = 12 + fz + (e.z || 0), dir = e.dir || 'down', d = dir === 'left' ? -1 : 1, look = c.def && c.def.look || (NPCS[c.id] && NPCS[c.id].look) || {};
  const sk = look.skin ? uCss(look.skin[2]) : '#f0c8a8', sl = look.main ? uCss(look.main[2]) : '#6a4a8a', wy = Math.round(e.y - cy - z - 14), x0 = Math.round(e.x - cx);
  ctx.fillStyle = sl; if (dir === 'down') { ctx.fillRect(x0 - 7, wy - 1, 2, 3); ctx.fillRect(x0 + 5, wy - 1, 2, 3); ctx.fillStyle = sk; ctx.fillRect(x0 - 5, wy, 2, 2); ctx.fillRect(x0 + 3, wy, 2, 2); }
  else if (dir !== 'up') { ctx.fillRect(x0 - d * 4, wy, d * 7 || 7, 2); ctx.fillStyle = sk; ctx.fillRect(x0 + d * 3 - (d < 0 ? 1 : 0), wy, 2, 2); } }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) {
  if ((e.type === 'npc' || e.type === 'rcomp') && typeof mountOf === 'function') { const own = typeof COMP !== 'undefined' && COMP && COMP.e === e ? G.P : e.type === 'rcomp' ? e.owner : null; if (own && mountOf(own) && rideComp(own) === e) return; }
  if ((e.type === 'player' || e.type === 'remote') && typeof mountOf === 'function' && mountOf(e)) { const c = rideComp(e); if (c) { const up = e.dir === 'up'; if (!up) drawPassenger(e, c, cx, cy); const r = _de(e, cx, cy); if (up) drawPassenger(e, c, cx, cy); else drawWaistHands(e, c, cx, cy); return r; } }
  return _de(e, cx, cy); }; }
// mientras montas, quien te acompaña va pegado a ti (y se baja a tu lado al desmontar)
{ const _cu = compUpdate; compUpdate = function (e, dt) { const P = G.P; if (P && COMP && COMP.e === e && mountOf(P) && !(typeof carryActive === 'function' && carryActive())) { e.map = P.map; e.x = P.x; e.y = P.y - 1; e.dir = P.dir; e.wasRide = 1; return; } if (e.wasRide) { e.wasRide = 0; e.x = P.x + 14; e.y = P.y + 2; } return _cu(e, dt); }; }
