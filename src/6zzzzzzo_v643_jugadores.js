// ================= 6.43: CAZADORES CON IA EN TODOS LOS MAPAS =================
// Sergio: que el mundo se vea más vivo con «cazadores» con nombres como de jugador (Zack…), sin llamarlos jugadores; hacen lo
// que haría cualquiera que juega (farmean, viajan, talan, pescan, saludan, charlan, descansan…): farmean nivel,
// atacan enemigos, talan y pican, suben de nivel solos, de cualquier nivel; no nos ayudan ni compartimos experiencia;
// solo podemos hablar con ellos y desafiarlos; que NO nos roben los enemigos cuando farmeamos una zona; unos 15-20 por mapa.
// Menos ciudadanos de España y muy pocos menos en Perú (v74Dens), para que haya sitio.
// - Una lista fija por mapa (semilla del mapa): nombre, clase, apariencia de jugador (heroLook + drawHero, todas las
//   estructuras de cuerpo) y nivel; P.aihLv guarda lo que han subido (pequeño) y P.aihT la última vez (suben también
//   mientras no juegas, un poco).
// - Solo existen en el mapa en el que estás; en mapas grandes se recolocan fuera de la pantalla cerca de ti, en
//   campamentos de su nivel, para que siempre veas a alguien farmeando. El sprite se crea al verlos y se libera lejos.
// - Antirrobo (aihFree): nunca atacan tu objetivo, ni a un enemigo que te persigue o que golpeaste hace poco, ni nada
//   dentro de la zona en la que estás farmeando (los últimos 25 s), ni lo que tienes al lado. Si golpeas a uno que
//   estaban atacando, te lo dejan.
// - Sus golpes no usan hitMob/killMob: no te dan experiencia ni oro, ni avanzan tus misiones.
const AIH_NAMES = ['Zack', 'Luna', 'Rex', 'Nova', 'Kai', 'Mia', 'Leo', 'Ivy', 'Axel', 'Sky', 'Vex', 'Nyx', 'Lia', 'Dante', 'Echo', 'Yuki', 'Toto', 'Pablo_GG', 'xXSamXx', 'DarkLuz', 'ElTano', 'Vale99', 'Mateo_pro', 'Sofi.exe', 'NicoLV', 'Kenji', 'Aiko',
  'Rafa', 'Cami', 'Thiago', 'Abril', 'Bruno', 'Zoe', 'Iker', 'Lola', 'Gael', 'Emma', 'Hugo', 'Alma', 'Enzo', 'Noa', 'Marco', 'Uma', 'Joaco', 'Sasha', 'Ryo', 'Hana', 'Milo', 'Kira', 'Oscar_RD', 'Tefi', 'JuanchoX', 'Pipe', 'Coni', 'Rocky', 'Kiwi', 'Ozzy',
  'NightFox', 'SrPatata', 'LaMaga', 'Arquerita', 'TanqueRojo', 'ElPanadero', 'Chispa', 'Lobito', 'Neko', 'Mochi', 'Pixel', 'Bit', 'Byte', 'Turbo', 'Frodo_no', 'Sombra', 'Rayo', 'Trueno', 'Brisa', 'Ceniza', 'Ámbar', 'Jade', 'Onyx', 'Cobalto',
  'Vikingo', 'Samu', 'Lu', 'Fer', 'Andy', 'Charly', 'Dani', 'Gabo', 'Isa', 'Jose_mx', 'Kevo', 'Lalo', 'Memo', 'Nacho', 'Paco', 'Quique', 'Rulo', 'Santi', 'Tavo', 'Ulises', 'Vicky', 'Wendy', 'Ximena', 'Yaz', 'Zuri', 'MaxPower', 'Ana_lv',
  'Kuro', 'Shiro', 'Ren', 'Sora', 'Tomo', 'Yui', 'Haru', 'Aoi', 'Kaze', 'Mizu', 'Tora', 'Sakura_s', 'Ricky', 'Gordo', 'Flaco', 'Chino', 'Negrita', 'Peque', 'Profe', 'Jefa', 'Capi', 'Doc', 'Mago_Supremo', 'Healer4u', 'NoobMaster', 'ProGamer'];
const AIH_LINES = [
  [L2('¿Alguien para el jefe del Velo? Busco grupo.', 'Anyone for the Veil boss? Looking for a group.'), L2('Estoy subiendo nivel, ¡suerte!', 'Leveling up here, good luck!'), L2('Esta zona da buena experiencia.', 'This zone gives good XP.'), L2('Me falta poco para subir.', 'Almost leveling up.')],
  [L2('Vendo esencias de portal, pregúntame.', 'Selling portal essences, ask me.'), L2('¿Has probado la Torre Infinita? Yo voy por el piso ', 'Have you tried the Infinite Tower? I\'m on floor '), L2('Tranquilo, no te quito tus monstruos.', 'Relax, I won\'t steal your monsters.'), L2('Llevo toda la tarde aquí, jaja.', 'Been here all afternoon, haha.')],
  [L2('¿Qué arma usas?', 'What weapon do you use?'), L2('Esa armadura te queda bien.', 'That armor looks good on you.'), L2('Hoy toca talar un rato.', 'Some woodcutting today.'), L2('Me voy a la siguiente zona cuando suba.', 'Moving to the next zone when I level.')]];
const AIH_HI = [L2('¡Hola!', 'Hi!'), L2('¡Buenas!', 'Hey!'), L2('¿Qué tal?', 'How\'s it going?'), L2('Hola, ¿farmeando también?', 'Hi, farming too?'), 'o/'];
const AIH_GO = [L2('Me voy a otra zona.', 'Heading to another zone.'), L2('Aquí ya no queda nada, me muevo.', 'Nothing left here, moving on.'), L2('Voy a probar más al norte.', 'Going to try further north.')];
const AIH_TALK = [L2('¿Viste el jefe de esta zona?', 'Did you see this zone\'s boss?'), L2('Jaja, sí.', 'Haha, yeah.'), L2('Yo llevo el arco de la forja.', 'I have the forge bow.'), L2('Mañana subo la torre.', 'Climbing the tower tomorrow.'), L2('¿Me pasas una poción?', 'Can you spare a potion?'), L2('Toma.', 'Here.'), L2('Esa zona da más oro.', 'That zone gives more gold.'), L2('¿Hacemos un duelo luego?', 'Duel later?'), L2('Vale, nos vemos.', 'Ok, see you.')];
const AIH_SKC = { guerrero: '#ff8a4a', mago: '#8ac8ff', arquero: '#c8f07a', asesino: '#c87aff', bardo: '#ffd07a', invocador: '#9aff9a', sacerdote: '#fff6b0', clerigo: '#fff6b0', paladin: '#ffe070', berserker: '#ff5050' };
const AIH_CLS = () => Object.keys(CLASSES);
const AIH_RANGED = new Set(['mago', 'arquero', 'bardo', 'invocador', 'sacerdote', 'clerigo']);
const AIH_FORMS = ['lobo', 'fantasma', 'vampiro', 'dragon', 'alado', 'eco', 'hielo'];
const AIH_SKIP = new Set(['espiritual', 'submarino', 'nerea', 'jardin_sonrisa']);
const AIH_ATL = new Map(); let AIH_MAP = null, AIH_LIST = [], AIH_TK = 0, AIH_PF = { x: 0, y: 0, t: -99 };
const aihHash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
// ¿hay cazadores en este mapa? cuántos
function aihCount(M) { if (!M || !M.id || AIH_SKIP.has(M.id) || /^dawn|^mar_|^isla_|_dawn$/.test(M.id) || M.sea || M.sub || M.ti || M.tower || M.cave || (typeof CAVES !== 'undefined' && CAVES[M.id]) || (typeof HOUSES !== 'undefined' && HOUSES[M.id]) || M.home) return 0;
  const listed = typeof MAPW_LIST !== 'undefined' && MAPW_LIST.some(w => w.id === M.id), city = typeof V74_CITY !== 'undefined' && V74_CITY[M.id];
  if (!listed && !M.isWorld && !city) return 0; let n = M.id === 'world' ? 18 : city ? (V74_CITY[M.id].c === 'pe' ? 8 : 10) : 15; if (typeof OPT !== 'undefined' && OPT.on) n = Math.ceil(n / 2); return n; }
function aihTier(lv) { let t = 1; for (let k = 1; TIER[k]; k++) if (TIER[k].lv <= lv) t = k; return t; }
function aihCampLvs(M) { const c = (M.camps || []).map(c => c.lv).filter(v => v > 0); return c.length ? c : null; }
// lista fija del mapa (con la semilla del mapa) + lo que han subido
function aihRoster(M) { const n = aihCount(M); if (!n) return []; const P = G.P, R = new RNG(SEED * 7 + aihHash(M.id)), lvs = aihCampLvs(M), cls = AIH_CLS(); P.aihLv = P.aihLv || {};
  const now = Date.now(), hrs = P.aihT ? Math.min(72, Math.max(0, (now - P.aihT) / 3.6e6)) : 0, used = new Set(), out = [];
  for (let i = 0; i < n; i++) { let nm; do { nm = AIH_NAMES[R.int(0, AIH_NAMES.length - 1)]; if (R.f() < 0.25) nm += R.int(1, 99); } while (used.has(nm)); used.add(nm);
    const g = R.f() < 0.5 ? 'f' : 'm', k = M.id + ':' + i; let lv = lvs && R.f() < 0.8 ? clamp(lvs[R.int(0, lvs.length - 1)] + R.int(-4, 10), 1, MAXLV) : R.int(5, Math.min(MAXLV, 650));
    if (P.aihLv[k]) lv = P.aihLv[k]; if (hrs > 0.5) lv = Math.min(MAXLV, lv + Math.floor(hrs * (0.2 + R.f()))); P.aihLv[k] = lv;
    const bts = BODY_T && BODY_T[g] ? BODY_T[g].length : 1, app = { g, skin: R.int(0, SKINS.length - 1), hair: pick(Object.keys(HAIRS).filter(h => !/^dz_|fus|^c_/.test(h))), hs: R.int(0, (g === 'm' ? HS_M : HS_F).length - 1), eyes: EYE_ORDER[R.int(0, EYE_ORDER.length - 1)], bt: R.f() < 0.5 ? 0 : R.int(0, bts - 1),
      top: [R.int(0, TOPS.length - 1), pick(Object.keys(CLOTH))], bot: [R.int(0, BOTS.length - 1), pick(Object.keys(CLOTH))], shoe: [R.int(0, SHOES.length - 1), pick(Object.keys(CLOTH))] };
    out.push({ k, i, name: nm, cls: cls[R.int(0, cls.length - 1)], app: normApp(app), lv, xp: 0, kills: 0, helm: R.f() < 0.6, sr: lv >= 250 && R.f() < 0.25 ? AIH_FORMS[R.int(0, AIH_FORMS.length - 1)] : null, chat: R.int(0, 2), seed: R.int(1, 1e6) }); }
  P.aihT = now; return out; }
function aihGear(h) { const t = aihTier(h.lv), g = { weapon: t, head: h.helm ? t : 0, body: t, legs: t, feet: t }; if (h.sr) { g.sr = h.sr; } return g; }
function aihAtlas(h) { const t = aihTier(h.lv), key = h.k + ':' + t; let A = AIH_ATL.get(key); if (!A) { if (AIH_ATL.size > 40) AIH_ATL.delete(AIH_ATL.keys().next().value); A = buildAtlas(heroLook(h.cls, h.app, aihGear(h), {}, { hideHelm: !h.helm }), ['idle', 'walk', 'atk', 'cast', 'chop', 'mine', 'hurt', 'fish', 'wave', 'sit', 'dance', 'cheer'], drawHero); AIH_ATL.set(key, A); } return A; }
function aihTitle(h) { return (CLASSES[h.cls] ? CLASSES[h.cls].n : h.cls) + ' · ' + L2('Nv. ', 'Lv. ') + h.lv; }
// ---------- crear / quitar en el mapa ----------
function aihFreeTile(M, x0, y0, r0, r1, R) { for (let t = 0; t < 50; t++) { const a = R() * 6.283, r = r0 + R() * (r1 - r0), tx = Math.floor(x0 / 16 + Math.cos(a) * r), ty = Math.floor(y0 / 16 + Math.sin(a) * r);
  if (tx < 2 || ty < 2 || tx >= M.w - 2 || ty >= M.h - 2) continue; const i = M.I(tx, ty); if (SOLID_T[M.ter[i]] || M.solidO[i] || M.ter[i] === T.DEEP || M.ter[i] === T.WATER || M.ter[i] === T.FACE || M.ter[i] === T.STAIRS) continue; return [tx * 16 + 8, ty * 16 + 8, M.lvl[i] | 0]; } return null; }
function aihSpot(M, h, near) { const P = G.P, rnd = Math.random; let best = null;
  if (M.camps && M.camps.length) { const cs = M.camps.filter(c => Math.abs(c.x - P.x / 16) + Math.abs(c.y - P.y / 16) < (near ? 34 : 9999) && (!AIH_PF.t || G.t - AIH_PF.t > 25 || Math.hypot(c.x * 16 - AIH_PF.x, c.y * 16 - AIH_PF.y) > 180)).sort((a, b) => Math.abs(a.lv - h.lv) - Math.abs(b.lv - h.lv)).slice(0, 4);
    if (cs.length) { const c = cs[Math.floor(rnd() * cs.length)]; best = aihFreeTile(M, c.x * 16, c.y * 16, 2, 5, rnd); } }
  return best || aihFreeTile(M, P.x, P.y, near ? 10 : 6, near ? 26 : 30, rnd) || aihFreeTile(M, P.x, P.y, 3, 12, rnd); }
function aihSpawn(M, h) { const p = aihSpot(M, h, true); if (!p) return null; const id = 'aih_' + aihHash(h.k);
  if (!Object.prototype.hasOwnProperty.call(NPCS, id)) Object.defineProperty(NPCS, id, { value: { n: '', title: '', lines: [''], look: null, aih: 1 }, enumerable: false, configurable: true, writable: true });
  const e = { type: 'npc', id, def: NPCS[id], aih: h, x: p[0], y: p[1], L: p[2] | 0, map: M.id, dir: pick(['down', 'left', 'right', 'up']), anim: 'idle', af: 0, at: Math.random(), home: { x: p[0], y: p[1] }, wander: 0, st: 1 + Math.random() * 2, hum: true, shR: 6, hw: 4, hh: 3, noTag: true,
    ai: { st: 'idle', t: Math.random() * 2, tgt: null, cd: 0, hp: 1, o: null, seen: G.t } };
  let A0 = null; Object.defineProperty(e, 'atlas', { configurable: true, enumerable: true, get() { if (!A0 || A0._aihT !== aihTier(h.lv)) { A0 = aihAtlas(h); A0._aihT = aihTier(h.lv); } e.ai.seen = G.t; return A0; }, set(v) { A0 = v; } });
  Object.defineProperty(e, '_aihDrop', { value: () => { A0 = null; }, enumerable: false });
  G.ents.push(e); return e; }
function aihOnMap(M) { for (const e of AIH_LIST) e.remove = true; AIH_LIST = []; AIH_MAP = M ? M.id : null; if (!M || !G.P) return; const ros = aihRoster(M); for (const h of ros) { const e = aihSpawn(M, h); if (e) AIH_LIST.push(e); } }
hookAfter('setMap', (r, M) => { try { aihOnMap(M); } catch (e) { if (typeof errOnce === 'function') errOnce('aihMap', e); } });
// ---------- antirrobo ----------
hookAfter('hitMob', (d, m) => { if (!m) return; m._pHitT = G.t; AIH_PF = { x: m.x, y: m.y, t: G.t }; if (m._aih) { const e = m._aih; m._aih = null; if (e.ai && e.ai.tgt === m) { e.ai.tgt = null; e.ai.st = 'idle'; e.ai.t = 1; if (Math.random() < 0.35) aihSay(e, pick([L2('¡Todo tuyo!', 'All yours!'), L2('Ah, era tuyo, perdona.', 'Oh, that was yours, sorry.'), L2('Te lo dejo.', 'It\'s yours.')])); } } });
function aihFree(m, e) { const P = G.P; if (!m || m.dying || m.hp <= 0 || m.boss || m.duel || m.ti || m.ghost || m.summoned || m.remove || m.map !== e.map) return false;
  if (P.target === m || (m.state && m.state !== 'idle')) return false; if (G.t - (m._pHitT || -99) < 12) return false;
  if (G.t - AIH_PF.t < 25 && Math.hypot(m.x - AIH_PF.x, m.y - AIH_PF.y) < 150) return false; if (Math.hypot(m.x - P.x, m.y - P.y) < 90) return false;
  if (m._aih && m._aih !== e && !m._aih.remove) return false; return true; }
// ---------- cerebro ----------
function aihSay(e, t) { e.chat = t; e.chatT = G.t; }
function aihMove(e, tx, ty, sp, dt) { const dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy); if (L < 3) return true; e.dir = dirFromVec(dx, dy); const M = G.map, ok = moveEnt(M, e, dx / L * sp * dt, dy / L * sp * dt); setAnim(e, 'walk', true); if (!ok) { e.ai.stuck = (e.ai.stuck || 0) + dt; if (e.ai.stuck > 1.2) { e.ai.stuck = 0; return true; } } else e.ai.stuck = 0; return false; }
function aihGain(e, m) { const h = e.aih; h.kills++; if (m.lv < h.lv - 25) return; h.xp++; const need = 6 + Math.floor(h.lv * 0.4); if (h.xp < need || h.lv >= MAXLV) return; h.xp = 0; h.lv++; const P = G.P; P.aihLv = P.aihLv || {}; P.aihLv[h.k] = h.lv;
  floatText(e.x, e.y - 40, L2('¡SUBE DE NIVEL!', 'LEVEL UP!'), '#ffe070'); addFx({ type: 'ring', x: e.x, y: e.y, r: 22, dur: 0.6, col: '#ffe070' }); if (Math.random() < 0.3) aihSay(e, pick([L2('¡Nivel ', 'Level ') + h.lv + '!', L2('¡Por fin!', 'Finally!'), 'GG'])); }
function aihKill(m, e) { m.hp = 0; m.dying = 0.001; setAnim(m, 'hurt'); burst(m.x, m.y - 10, 10, { sp: 60, up: 36, g: 140, life: 0.5, c: ['#d8d0c8', '#a09890', '#ffffff'] }); if (m.camp && m.camp.dead) m.camp.dead.push(G.t + 28 + Math.random() * 20); if (G.P.target === m) G.P.target = null; m._aih = null; aihGain(e, m); }
function aihFindMob(e) { const h = e.aih; let best = null, bd = 260 * 260; for (const m of G.ents) { if (m.type !== 'mob' || m.lv > h.lv + 8 || m.lv < Math.max(1, h.lv - 40) || (e.ai.skip && e.ai.skip.has(m)) || (m.L !== e.L && m.L >= 0 && e.L >= 0)) continue; const d = dist2(m.x, m.y, e.x, e.y); if (d < bd && aihFree(m, e)) { bd = d; best = m; } } return best; }
function aihFindRes(e) { const M = G.map; if (!M.objs) return null; let best = null, bd = 180 * 180; for (const o of M.objs) { if (o.hidden || (o.k !== 'tree' && o.k !== 'ore')) continue; const d = dist2(o.px, o.py, e.x, e.y); if (d < bd) { bd = d; best = o; } } return best; }
function aihUpdate(e, dt) { const h = e.aih, A = e.ai, P = G.P; if (!h) return; A.t -= dt; A.cd -= dt;
  const near = dist2(e.x, e.y, P.x, P.y) < 40 * 40 && !A.tgt && A.st !== 'chat'; if (near && A.st !== 'gather' && A.st !== 'fish') { e.dir = dirFromVec(P.x - e.x, P.y - e.y); if (!A.hi) { A.hi = 1; if (Math.random() < 0.5) { aihSay(e, pick(AIH_HI)); setAnim(e, 'wave'); A.waveT = 1.5; } } A.waveT = (A.waveT || 0) - dt; setAnim(e, A.waveT > 0 ? 'wave' : 'idle', true); stepAnim(e, dt, 5); return; }
  switch (A.st) {
    case 'idle': setAnim(e, 'idle', true); if (A.t > 0) break; aihDecide(e); break;
    case 'travel': if (aihMove(e, A.p[0], A.p[1], 58, dt)) { e.home = { x: e.x, y: e.y }; A.st = 'idle'; A.t = 0.5 + Math.random() * 2; } break;
    case 'goFish': if (aihMove(e, A.p[0], A.p[1], 34, dt)) { A.st = 'fish'; A.t = 8 + Math.random() * 10; e.dir = A.p[2]; } break;
    case 'fish': setAnim(e, 'fish', true); if (A.t <= 0) { A.st = 'idle'; A.t = 1; if (Math.random() < 0.6) floatText(e.x, e.y - 34, '+1 ' + L2('pez', 'fish'), '#8ad8ff'); } break;
    case 'emote': setAnim(e, A.em, true); if (A.t <= 0) { A.st = 'idle'; A.t = 1 + Math.random() * 2; } break;
    case 'rest': setAnim(e, 'sit', true); if (A.t <= 0) { A.hp = 1; A.st = 'idle'; A.t = 0.5; } break;
    case 'chat': { const o = A.pal; if (!o || o.remove || !o.ai || o.ai.pal !== e || A.t <= 0) { A.st = 'idle'; A.t = 1 + Math.random() * 2; A.pal = null; break; }
      const d = Math.hypot(o.x - e.x, o.y - e.y); if (d > 24 && A.lead) { aihMove(e, o.x + (e.x < o.x ? -18 : 18), o.y, 34, dt); break; } e.dir = dirFromVec(o.x - e.x, o.y - e.y); setAnim(e, 'idle', true);
      A.ct = (A.ct || 0) - dt; if (A.ct <= 0) { A.ct = 3.2; if (A.lead === (Math.floor(A.t / 1.6) % 2 === 0)) aihSay(e, pick(AIH_TALK)); } break; }
    case 'go': if (aihMove(e, A.p[0], A.p[1], 34, dt)) { A.st = 'idle'; A.t = 1 + Math.random() * 3; } break;
    case 'goRes': { const o = A.o; if (!o || o.hidden) { A.st = 'idle'; A.t = 1; break; } if (aihMove(e, o.px + (e.x < o.px ? -12 : 12), o.py + 4, 34, dt)) { A.st = 'gather'; A.t = 4 + Math.random() * 4; e.dir = e.x < o.px ? 'right' : 'left'; } break; }
    case 'gather': setAnim(e, A.o && A.o.k === 'ore' ? 'mine' : 'chop', true); if (A.t <= 0) { A.st = 'idle'; A.t = 1; if (Math.random() < 0.3) floatText(e.x, e.y - 34, '+1 ' + (A.o && A.o.k === 'ore' ? L2('mineral', 'ore') : L2('madera', 'wood')), '#c8e0a0'); } break;
    case 'fight': { const m = A.tgt; if (!m || m.dying || m.remove || m.hp <= 0 || m._aih !== e || !aihFreeFight(m, e)) { if (m && m._aih === e) m._aih = null; A.tgt = null; A.st = 'idle'; A.t = 0.6 + Math.random(); break; }
      const rng = AIH_RANGED.has(h.cls) ? 64 : 20, d = Math.hypot(m.x - e.x, m.y - e.y); if (d > rng) { A.ft = (A.ft || 0) + dt; m._aihT = G.t; if (A.ft > 6) { (A.skip = A.skip || new WeakSet()).add(m); m._aih = null; A.tgt = null; A.st = 'idle'; A.t = 0.5; break; } aihMove(e, m.x, m.y, 52, dt); break; } A.ft = 0;
      e.dir = dirFromVec(m.x - e.x, m.y - e.y); if (A.cd > 0) { if (e.anim !== 'atk' && e.anim !== 'cast') setAnim(e, 'idle', true); break; }
      A.cd = 0.8 + Math.random() * 0.4; const sk = Math.random() < 0.18; setAnim(e, sk || AIH_RANGED.has(h.cls) ? 'cast' : 'atk'); e.af = 0; m._aihT = G.t;
      const k = clamp(0.14 + (h.lv - m.lv) * 0.012, 0.05, 0.7) * (sk ? 2.2 : 1), dmg = Math.max(1, Math.round(m.maxhp * k * (0.85 + Math.random() * 0.3)));
      if (sk) { const col = AIH_SKC[h.cls] || '#ffffff'; burst(m.x, m.y - 14, 16, { sp: 80, up: 50, g: 60, life: 0.5, c: [col, '#ffffff'] }); addFx({ type: 'ring', x: m.x, y: m.y, r: 26, dur: 0.4, col }); A.cd += 0.6; }
      if (AIH_RANGED.has(h.cls)) for (let s = 0; s < 4; s++) part(e.x + (m.x - e.x) * s / 4, e.y - 14 + (m.y - e.y) * s / 4, { vz: 0, g: 0, life: 0.25, c: h.cls === 'mago' ? '#8ac8ff' : '#e0d0a0', s: 1 });
      m.hp -= dmg; m.flash = 0.12; floatText(m.x, m.y - (m.hgt || 30), dmg, '#b8b8c8'); if (m.hp <= 0) { aihKill(m, e); A.tgt = null; A.st = 'idle'; A.t = 0.4 + Math.random(); if (A.hp < 0.6 && Math.random() < 0.5) { A.st = 'rest'; A.t = 4 + Math.random() * 4; } }
      else if (Math.random() < 0.4) { setAnim(m, 'atk'); m.dir = dirFromVec(e.x - m.x, e.y - m.y); A.hp -= 0.04 + Math.max(0, m.lv - h.lv) * 0.01; if (A.hp < 0.35) { A.hp = 1; floatText(e.x, e.y - 40, L2('poción', 'potion'), '#ff8a8a'); } } break; } }
  stepAnim(e, dt, e.anim === 'walk' ? (A.st === 'travel' ? 11 : 8) : e.anim === 'atk' || e.anim === 'cast' ? 10 : e.anim === 'chop' || e.anim === 'mine' ? 6 : e.anim === 'dance' || e.anim === 'cheer' || e.anim === 'wave' ? 6 : 2); }
// qué hace ahora: como cualquiera que juega (cada uno con su forma de ser: farmero, viajero, sociable o recolector)
function aihDecide(e) { const h = e.aih, A = e.ai, pers = h.seed % 4, M = G.map, r = Math.random();
  const m = aihFindMob(e); if (m && r < (pers === 0 ? 0.92 : pers === 3 ? 0.55 : 0.75)) { A.st = 'fight'; A.tgt = m; A.ft = 0; m._aih = e; m._aihT = G.t; return; }
  const q = Math.random();
  if (q < (pers === 3 ? 0.3 : 0.14)) { const o = aihFindRes(e); if (o) { A.st = 'goRes'; A.o = o; return; } }
  if (q < (pers === 3 ? 0.42 : 0.24)) { const w = aihFindWater(e); if (w) { A.st = 'goFish'; A.p = w; return; } }
  if (q < (pers === 1 ? 0.55 : 0.36)) { const p = aihFarSpot(e); if (p) { A.st = 'travel'; A.p = p; if (Math.random() < 0.2) aihSay(e, pick(AIH_GO)); return; } }
  if (q < (pers === 2 ? 0.7 : 0.46)) { const o = AIH_LIST.find(x => x !== e && !x.remove && x.ai.st === 'idle' && dist2(x.x, x.y, e.x, e.y) < 150 * 150); if (o) { A.st = 'chat'; A.pal = o; A.lead = true; A.t = 7 + Math.random() * 5; A.ct = 0.5; o.ai.st = 'chat'; o.ai.pal = e; o.ai.lead = false; o.ai.t = A.t; o.ai.ct = 2; return; } }
  if (q < 0.54) { A.st = 'emote'; A.em = pick(['wave', 'dance', 'cheer']); A.t = 2.5 + Math.random() * 2; return; }
  if (q < 0.62) { A.st = 'rest'; A.t = 4 + Math.random() * 5; return; }
  const p = aihFreeTile(M, e.home.x, e.home.y, 1, 6, Math.random); if (aihSameL(p, e)) { A.st = 'go'; A.p = p; } else A.t = 1.5; if (Math.random() < 0.06) aihSay(e, aihLine(e)); }
function aihFindWater(e) { const M = G.map, x0 = Math.floor(e.x / 16), y0 = Math.floor(e.y / 16); for (let t = 0; t < 60; t++) { const tx = x0 + Math.round((Math.random() - 0.5) * 16), ty = y0 + Math.round((Math.random() - 0.5) * 16); const i = tileAt(M, tx, ty); if (i < 0 || M.ter[i] !== T.WATER) continue;
  for (const [dx, dy, dir] of [[0, 1, 'up'], [0, -1, 'down'], [1, 0, 'left'], [-1, 0, 'right']]) { const j = tileAt(M, tx + dx, ty + dy); if (j >= 0 && !blockedFor(M, tx + dx, ty + dy, 0) && M.lvl[j] === 0) return [(tx + dx) * 16 + 8, (ty + dy) * 16 + 8, dir]; } } return null; }
function aihFarSpot(e) { const M = G.map, h = e.aih; if (M.camps && M.camps.length > 1) { const cs = M.camps.filter(c => { const d = Math.abs(c.x * 16 - e.x) + Math.abs(c.y * 16 - e.y); const dp = Math.abs(c.x * 16 - G.P.x) + Math.abs(c.y * 16 - G.P.y); return d > 12 * 16 && d < 45 * 16 && dp < 28 * 16 && Math.abs(c.lv - h.lv) < 40 && !(G.t - AIH_PF.t < 25 && Math.hypot(c.x * 16 - AIH_PF.x, c.y * 16 - AIH_PF.y) < 180); }); if (cs.length) { const c = pick(cs); const p = aihFreeTile(M, c.x * 16, c.y * 16, 1, 4, Math.random); if (aihSameL(p, e)) return p; } }
  for (let k = 0; k < 4; k++) { const p = aihFreeTile(M, e.x, e.y, 14, 32, Math.random); if (aihSameL(p, e)) return p; } return null; }
function aihSameL(p, e) { return p && ((p[2] | 0) === (e.L | 0) || e.L < 0); }
function aihFreeFight(m, e) { const P = G.P; if (P.target === m || (m.state && m.state !== 'idle') || G.t - (m._pHitT || -99) < 12) return false; return true; }
function aihLine(e) { const L = AIH_LINES[e.aih.chat % AIH_LINES.length], t = L[Math.floor(Math.random() * L.length)]; return /piso $|floor $/.test(t) ? t + (10 + (e.aih.seed % 90)) + '.' : t; }
hookBefore('updateNPC', (e, dt) => { if (e && e.aih) { aihUpdate(e, dt); return HOOK_SKIP; } });
// el enemigo que pelea con un cazador se queda peleando con él (si no te persigue a ti)
hookBefore('updateMob', (m, dt) => { if (!m || m.dying || !m._aih || m.state !== 'idle' || G.t - (m._aihT || -9) > 2.5) return; const e = m._aih; m.dir = dirFromVec(e.x - m.x, e.y - m.y); if (m.flash > 0) m.flash -= dt; stepAnim(m, dt, m.anim === 'atk' ? 8 : 3); if (m.anim === 'atk' && m.af === 0 && m.at > 0.4) setAnim(m, 'idle'); return HOOK_SKIP; });
// recolocar a los que se quedan lejos (fuera de la pantalla) y liberar sprites
V33_TICKS.push(() => { const M = G.map, P = G.P; if (!M || !P || AIH_MAP !== M.id) { if (M && P && AIH_MAP !== M.id) aihOnMap(M); return; } if (G.t - AIH_TK < 3) return; AIH_TK = G.t;
  for (const e of AIH_LIST) { if (e.remove) continue; const d = Math.hypot(e.x - P.x, e.y - P.y), vis = Math.abs(e.x - P.x) < VW * 0.7 && Math.abs(e.y - P.y) < VH * 0.7;
    if (G.t - e.ai.seen > 20 && e._aihDrop) e._aihDrop();
    if (!vis && d > 50 * 16 && e.ai.st !== 'fight') { const p = aihSpot(M, e.aih, true); if (p && (Math.abs(p[0] - P.x) > VW * 0.6 || Math.abs(p[1] - P.y) > VH * 0.6)) { e.x = e.home.x = p[0]; e.y = e.home.y = p[1]; e.L = p[2] | 0; e.ai.st = 'idle'; e.ai.t = Math.random() * 2; } } } });
// nombre y nivel en azul, como los jugadores
hookAfter('drawEnt', (r, e, cx, cy) => { if (!e || !e.aih || e.hidden) return; const A = e.atlas, top = Math.round(e.y - cy) - (A ? A.fh - 10 : 40), x = Math.round(e.x - cx); const s = textSprite(e.aih.name + ' NV.' + e.aih.lv, '#8ae0ff'); ctx.drawImage(s, x - (s.width >> 1), top - 9); });
// ---------- hablar y desafiar ----------
hookAround('openDialog', (next, npc) => { if (!npc || !npc.aih) return next(npc); const h = npc.aih; npc.def.n = h.name; npc.def.title = aihTitle(h); npc.def.lines = [aihLine(npc)]; try { return next(npc); } finally { npc.def.n = ''; } });
DLG_HOOKS.push((npc, opts) => { if (!npc || !npc.aih) return; const h = npc.aih;
  opts.unshift({ label: '⚔ ' + L2('Desafiar a un duelo', 'Challenge to a duel'), icon: ['sword', 3], fn: () => { closeDialog(); aihDuel(npc); } });
  opts.unshift({ label: '📊 ' + L2('Ver su perfil', 'See their profile'), icon: ['users'], fn: () => { closeDialog(); openModal(`<div class="frame"><h3>${esc(h.name)}</h3><p>${esc(aihTitle(h))}</p><p>${L2('Monstruos vencidos hoy', 'Monsters defeated today')}: ${h.kills}</p><p class="hint">${L2('Cazador que farmea por su cuenta. No comparte experiencia ni te quita tus monstruos.', 'A hunter farming on their own. They don\'t share XP or steal your monsters.')}</p><div class="row"><button class="btn" id="aihOk">OK</button></div></div>`); $('#aihOk').onclick = () => closeModal(); } }); });
function aihDuel(e) { const h = e.aih; if (typeof duelStart !== 'function' || DUEL) return; const t = aihTier(h.lv);
  duelStart({ name: h.name, lv: h.lv, look: LK({ hair: HAIRS[h.app.hair] || HAIRS.negro, armor: TIERP[clamp(Math.ceil(h.lv / 22), 1, 15)], weapon: { k: 'sword', tier: clamp(Math.ceil(h.lv / 18), 1, 15) } }) });
  let n = 0; const fix = () => { n++; if (DUEL && DUEL.m && DUEL.o && DUEL.o.name === h.name) { try { DUEL.m.atlas = aihAtlas(h); } catch (er) { } return; } if (n < 40) setTimeout(fix, 100); }; setTimeout(fix, 100); }
// menos ciudadanos: España bastante menos y Perú muy poco menos (los cazadores ocupan ese sitio)
hookAfter('v74Dens', (d, h, c) => c === 'es' ? d * 0.72 : c === 'pe' ? d * 0.9 : d);
SAVEKEYS.push('aihLv', 'aihT');
// Lupa › Sistemas
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_cazadores_ia', '🧑‍🤝‍🧑 ' + L2('Cazadores por el mundo', 'Hunters around the world'), () => [L2('En todos los mapas abiertos y en las ciudades hay cazadores con nombre propio que van y vienen: farmean su nivel, usan habilidades, viajan de una zona a otra, talan, pican, pescan, saludan, charlan entre ellos, descansan y suben de nivel solos (también mientras no juegas, un poco). Llevan su nombre y nivel en azul.', 'In every open map and city there are hunters with their own names who come and go: they farm their level, use skills, travel between zones, chop, mine, fish, wave, chat with each other, rest and level up on their own (a little even while you are away). Their name and level show in blue.'),
  L2('No te ayudan ni compartes experiencia con ellos, y no te roban: nunca atacan a tu objetivo, a lo que te persigue o golpeaste hace poco, ni a nada de la zona en la que estás farmeando. Si golpeas a uno que estaban atacando, te lo dejan.', 'They don\'t help you and you don\'t share XP, and they don\'t steal: they never attack your target, whatever is chasing you or that you hit recently, or anything in the zone you are farming. If you hit one they were fighting, they leave it to you.'),
  L2('Habla con ellos para ver su perfil o desafiarlos a un duelo.', 'Talk to them to see their profile or challenge them to a duel.')], () => null]);
// si un cazador está al lado de un NPC de verdad, «Hablar» elige siempre al NPC (misiones, tiendas…)
hookAfter('interactTarget', r => { if (!r || r.kind !== 'npc' || !r.e || !r.e.aih) return; const P = G.P; let best = null, bd = 34 * 34;
  for (const e of G.ents) if ((e.type === 'npc' || e.type === 'kid') && !e.aih && e.map === P.map) { const d = dist2(e.x, e.y, P.x, P.y); if (d < bd) { bd = d; best = e; } }
  if (best) return { kind: 'npc', e: best, label: r.label, icon: r.icon }; });
