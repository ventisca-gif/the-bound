// ================= 6.43-6.44: JUGADORES CAZADORES (IA) EN TODOS LOS MAPAS =================
// 6.44: Sergio pidió llamarlos «Jugadores cazadores» (para no confundirlos con los cazadores de los portales), que mejoren
// su equipo, trabajen y viajen por todos los países y mapas con su propia historia (sin el hilo del Vínculo), que usen
// sus formas (y cambien en pleno combate, con aura y destello), diálogos nuevos y que se les pueda atacar sin pedir duelo.
// Viven repartidos por el mundo: P.aihW[k] = { m: mapa donde están, r: refinado +0..10, j: [tala, minería, pesca],
// f: formas conseguidas, s: su historia [[día, código, dato]], tb: mejor piso de la torre, w/l: duelos contra ti }.
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
// población mundial: cada mapa abierto y ciudad tiene su gente (misma semilla que en la 6.43, así los niveles guardados siguen)
const AIH_FORMS_ALL = ['lobo', 'fantasma', 'vampiro', 'dragon', 'alado', 'eco', 'hielo', 'vapor'];
let AIH_POP = null, AIH_LIFE_T = 0;
function aihCountId(id) { if (!id || AIH_SKIP.has(id) || /^dawn|^mar_|^isla_|_dawn$/.test(id)) return 0; const city = typeof V74_CITY !== 'undefined' && V74_CITY[id]; let n = id === 'world' ? 18 : city ? (V74_CITY[id].c === 'pe' ? 8 : 10) : 15; return n; }
function aihHomes() { const ids = new Set(); if (typeof MAPW_LIST !== 'undefined') for (const w of MAPW_LIST) if (aihCountId(w.id)) ids.add(w.id); if (typeof V74_CITY !== 'undefined') for (const id in V74_CITY) if (aihCountId(id)) ids.add(id); ids.add('world'); return [...ids]; }
function aihMakeHome(id) { const n = aihCountId(id), M = G.maps[id] || (id === 'world' ? G.world : null), R = new RNG(SEED * 7 + aihHash(id)), lvs = M ? aihCampLvs(M) : null, cls = AIH_CLS(), used = new Set(), out = [];
  for (let i = 0; i < n; i++) { let nm; do { nm = AIH_NAMES[R.int(0, AIH_NAMES.length - 1)]; if (R.f() < 0.25) nm += R.int(1, 99); } while (used.has(nm)); used.add(nm);
    const g = R.f() < 0.5 ? 'f' : 'm', k = id + ':' + i, lv0 = lvs && R.f() < 0.8 ? clamp(lvs[R.int(0, lvs.length - 1)] + R.int(-4, 10), 1, MAXLV) : R.int(5, Math.min(MAXLV, 650));
    const bts = BODY_T && BODY_T[g] ? BODY_T[g].length : 1, app = { g, skin: R.int(0, SKINS.length - 1), hair: pick(Object.keys(HAIRS).filter(h => !/^dz_|fus|^c_/.test(h))), hs: R.int(0, (g === 'm' ? HS_M : HS_F).length - 1), eyes: EYE_ORDER[R.int(0, EYE_ORDER.length - 1)], bt: R.f() < 0.5 ? 0 : R.int(0, bts - 1),
      top: [R.int(0, TOPS.length - 1), pick(Object.keys(CLOTH))], bot: [R.int(0, BOTS.length - 1), pick(Object.keys(CLOTH))], shoe: [R.int(0, SHOES.length - 1), pick(Object.keys(CLOTH))] };
    const mk_ = Object.keys(MOUNTS || {}), mt = lv0 >= 30 && mk_.length && R.f() < 0.7 ? mk_[R.int(0, mk_.length - 1)] : null; const cl = cls[R.int(0, cls.length - 1)], helm = R.f() < 0.6, sr0 = lv0 >= 250 && R.f() < 0.25 ? AIH_FORMS[R.int(0, AIH_FORMS.length - 1)] : null, chat = R.int(0, 2), seed = R.int(1, 1e6);
    out.push({ k, i, home: id, name: nm, cls: cl, app: normApp(app), lv0, lv: lv0, xp: 0, kills: 0, helm, sr0, chat, seed, mt }); } return out; }
function aihPop() { if (AIH_POP) return AIH_POP; const P = G.P; P.aihLv = P.aihLv || {}; P.aihW = P.aihW || {}; AIH_POP = [];
  for (const id of aihHomes()) for (const h of aihMakeHome(id)) { h.lv = P.aihLv[h.k] || h.lv0; P.aihLv[h.k] = h.lv; const W = P.aihW[h.k] || (P.aihW[h.k] = { m: id, r: Math.min(10, Math.floor(h.lv / 70)), j: [1 + (h.seed % 30), 1 + (h.seed % 23), 1 + (h.seed % 17)], f: h.sr0 ? [h.sr0] : [], s: [] }); h.W = W; if (!W.s.length) aihStory(h, 'h', id); h.sr = W.f[W.fs | 0] || null; AIH_POP.push(h); }
  const now = Date.now(), hrs = P.aihT ? Math.min(72, Math.max(0, (now - P.aihT) / 3.6e6)) : 0; if (hrs > 0.25) aihLife(hrs, true); P.aihT = now; AIH_LIFE_T = now; return AIH_POP; }
// su propia historia (códigos cortos para no hacer grande la partida)
const AIH_MAPN = id => { const w = typeof MAPW_LIST !== 'undefined' && MAPW_LIST.find(x => x.id === id); return w ? w.n : id === 'world' ? L2('las Tierras del Vínculo', 'the Lands of the Bound') : id; };
function aihStory(h, c, a) { const W = h.W; W.s = W.s || []; W.s.push([typeof calDay === 'function' ? calDay() : 0, c, a]); if (W.s.length > 10) W.s.shift(); }
function aihStoryText(e) { const [d, c, a] = e; const bn = id => (BOSSES[id] && BOSSES[id].n) || id, fn = k => (typeof SR !== 'undefined' && SR[k] ? SR[k].n : k), jn = [L2('Tala', 'Woodcutting'), L2('Minería', 'Mining'), L2('Pesca', 'Fishing')];
  return c === 'v' ? L2('Viajó a ', 'Travelled to ') + AIH_MAPN(a) : c === 'n' ? L2('Llegó al nivel ', 'Reached level ') + a : c === 'r' ? L2('Mejoró su equipo a +', 'Upgraded their gear to +') + a : c === 'j' ? jn[a[0]] + L2(' nivel ', ' level ') + a[1] : c === 'f' ? L2('Consiguió la forma ', 'Obtained the form ') + fn(a) : c === 'b' ? L2('Venció a ', 'Defeated ') + bn(a) : c === 't' ? L2('Llegó al piso ', 'Reached floor ') + a + L2(' de la Torre Infinita', ' of the Infinite Tower') : c === 'w' ? L2('Te venció en combate', 'Beat you in a fight') : c === 'l' ? L2('Perdió contra ti en combate', 'Lost a fight against you') : c === 'h' ? L2('Empezó su aventura en ', 'Began their adventure in ') + AIH_MAPN(a) : ''; }
// la vida sigue aunque no los veas: suben, mejoran, trabajan, viajan, consiguen formas, vencen jefes y suben la torre
function aihLife(hrs, offline) { const P = G.P, homes = aihHomes(), bossOk = Object.keys(BOSSES).filter(k => { const d = BOSSES[k]; return d && !d.ti && !(typeof tiStoryBoss === 'function' && tiStoryBoss(k, d)) && d.lv; });
  for (const h of AIH_POP) { const W = h.W, here = AIH_LIST.some(e => e.aih === h && !e.remove), R = () => Math.random(); if (!W.s.length) aihStory(h, 'h', h.home);
    const lv0 = h.lv; h.lv = Math.min(MAXLV, h.lv + Math.floor(hrs * (0.2 + R()) + R())); if (Math.floor(h.lv / 50) > Math.floor(lv0 / 50)) aihStory(h, 'n', Math.floor(h.lv / 50) * 50); P.aihLv[h.k] = h.lv;
    if (W.r < 10 && R() < 0.12 * hrs) { W.r++; if (W.r >= 5) aihStory(h, 'r', W.r); }
    if (R() < 0.3 * hrs) { const j = Math.floor(R() * 3), was = W.j[j]; W.j[j] = Math.min(200, W.j[j] + 1 + Math.floor(R() * 3)); if (Math.floor(W.j[j] / 10) > Math.floor(was / 10)) aihStory(h, 'j', [j, Math.floor(W.j[j] / 10) * 10]); }
    if (h.lv >= 250 && W.f.length < AIH_FORMS_ALL.length && R() < 0.035 * hrs) { const nf = AIH_FORMS_ALL.filter(k => !W.f.includes(k)); const k = pick(nf); W.f.push(k); aihStory(h, 'f', k); }
    if (R() < 0.08 * hrs) { const ok = bossOk.filter(k => BOSSES[k].lv <= h.lv + 5 && BOSSES[k].lv >= h.lv - 120); if (ok.length) aihStory(h, 'b', pick(ok)); }
    if (R() < 0.04 * hrs) { W.tb = (W.tb || 0) + 1 + Math.floor(R() * 4 * Math.max(1, h.lv / 100)); aihStory(h, 't', W.tb); }
    if (!here && R() < 0.08 * hrs) { const to = pick(homes.filter(x => x !== W.m)); if (to) { W.m = to; aihStory(h, 'v', to); } }
    if (W.f.length && R() < 0.2 * hrs) W.fs = Math.floor(R() * W.f.length); h.sr = W.f[W.fs | 0] || null; } }
// gente que está ahora mismo en este mapa
function aihRoster(M) { const n = aihCount(M); if (!n) return []; const pop = aihPop(); let here = pop.filter(h => h.W.m === M.id);
  if (here.length > n + 4) { const R = new RNG(aihHash(M.id) + (typeof calDay === 'function' ? calDay() : 0)); here = here.map(h => [R.f(), h]).sort((a, b) => a[0] - b[0]).slice(0, n + 4).map(x => x[1]); }
  if (typeof OPT !== 'undefined' && OPT.on) here = here.slice(0, n); return here; }
function aihGear(h, sf) { const t = aihTier(h.lv), g = { weapon: t, head: h.helm ? t : 0, body: t, legs: t, feet: t }; const sr = h.tf || h.sr; if (sr) { g.sr = sr; if (sf || h.tf) g.sf = 1; } return g; }
function aihAtlas(h) { const t = aihTier(h.lv), sr = h.tf || h.sr || '', key = h.k + ':' + t + ':' + sr + (h.tf ? ':T' : ''); let A = AIH_ATL.get(key); if (!A) { if (AIH_ATL.size > 40) AIH_ATL.delete(AIH_ATL.keys().next().value); A = buildAtlas(heroLook(h.cls, h.app, aihGear(h), {}, { hideHelm: !h.helm }), ['idle', 'walk', 'atk', 'cast', 'chop', 'mine', 'hurt', 'fish', 'wave', 'sit', 'dance', 'cheer', 'dash', 'dead'], drawHero); AIH_ATL.set(key, A); } A._aihK = key; return A; }
function aihTitle(h) { return L2('Jugador cazador', 'Player hunter') + ' · ' + (CLASSES[h.cls] ? CLASSES[h.cls].n : h.cls) + ' · ' + L2('Nv. ', 'Lv. ') + h.lv + (h.W && h.W.r ? ' · +' + h.W.r : ''); }
const aihPow = h => 1 + ((h.W && h.W.r) || 0) * 0.04 + (h.tf ? 0.2 : 0);
// 6.44: sus estadísticas salen del motor como las tuyas: personaje temporal con su clase, nivel, atributos repartidos y el
// mejor equipo de su nivel con su refinado (calcStats sobre ese personaje; no toca el tuyo). Caché por nivel y refinado.
const AIH_STC = new Map();
function aihStats(h) { const r = (h.W && h.W.r) || 0, key = h.k + ':' + h.lv + ':' + r; let t = AIH_STC.get(key); if (t) return t; if (AIH_STC.size > 60) AIH_STC.delete(AIH_STC.keys().next().value);
  try { t = newPlayer(h.name, h.cls, h.app); t.lv = h.lv; const C_ = CLASSES[h.cls] || {}, main = C_.main || 'str', pts = (h.lv - 1) * 5; t.attr = Object.assign({}, t.attr); t.attr[main] += Math.round(pts * 0.65); t.attr.vit += Math.round(pts * 0.3); for (const k of ['str', 'int', 'dex']) if (k !== main) t.attr[k] += Math.round(pts * 0.025); t.apts = 0;
    t.equip = {}; for (const s of ['weapon', 'head', 'body', 'legs', 'feet', 'acc', 'neck']) { const c = Object.keys(ITEMS).filter(id => { const it = ITEMS[id]; return it.slot === s && (!it.cls || it.cls === h.cls) && (it.lv || 1) <= h.lv && !it.cos && !it.quest && it.price > 0; }); let best = null; for (const id of c) if (!best || (ITEMS[id].lv || 1) > (ITEMS[best].lv || 1) || ((ITEMS[id].lv || 1) === (ITEMS[best].lv || 1) && aihHash(h.k + id) % 3 === 0)) best = id; if (best) t.equip[s] = { id: best, up: r }; }
    calcStats(t); } catch (e) { t = { S: { maxhp: 100 + h.lv * 40, maxmp: 50 + h.lv * 6, atk: 10 + h.lv * 8, def: 5 + h.lv * 6, crit: 5, critD: 150, aspd: 0.6, spd: 80, life: 0, power: h.lv * 50 }, attr: { str: 10, int: 3, dex: 5, vit: 10 }, equip: {} }; }
  AIH_STC.set(key, t); return t; }
const aihSpd = e => Math.min(110, Math.max(70, (aihStats(e.aih).S.spd || 80)));
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
    ai: { st: 'idle', t: Math.random() * 2, tgt: null, cd: 0, hp: 1, o: null, seen: G.t, potT: 0 } };
  let A0 = null; Object.defineProperty(e, 'atlas', { configurable: true, enumerable: true, get() { const want = h.k + ':' + aihTier(h.lv) + ':' + (h.tf || h.sr || '') + (h.tf ? ':T' : ''); if (!A0 || A0._aihK !== want) A0 = aihAtlas(h); e.ai.seen = G.t; return A0; }, set(v) { A0 = v; } });
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
function aihPath(M, e, tx, ty) { const sx = Math.floor(e.x / 16), sy = Math.floor(e.y / 16), gx = Math.floor(tx / 16), gy = Math.floor(ty / 16), mg = 12, x0 = Math.max(1, Math.min(sx, gx) - mg), x1 = Math.min(M.w - 2, Math.max(sx, gx) + mg), y0 = Math.max(1, Math.min(sy, gy) - mg), y1 = Math.min(M.h - 2, Math.max(sy, gy) + mg), W_ = x1 - x0 + 1, H_ = y1 - y0 + 1;
  if (W_ * H_ > 9000) return null; const prev = new Int32Array(W_ * H_).fill(-1), q = [(sy - y0) * W_ + (sx - x0)]; if (q[0] < 0 || q[0] >= W_ * H_) return null; prev[q[0]] = q[0]; let found = -1, n = 0;
  for (let qi = 0; qi < q.length && n < 5000; qi++, n++) { const c = q[qi], cx = c % W_, cy = (c / W_) | 0; if (cx + x0 === gx && cy + y0 === gy) { found = c; break; } for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= W_ || ny >= H_) continue; const ni = ny * W_ + nx; if (prev[ni] >= 0 || blockedFor(M, nx + x0, ny + y0, e.L)) continue; prev[ni] = c; q.push(ni); } }
  if (found < 0) return null; const out = []; for (let c = found; c !== prev[c]; c = prev[c]) out.push([(c % W_ + x0) * 16 + 8, (((c / W_) | 0) + y0) * 16 + 8]); out.reverse(); return out.filter((p, i) => i % 2 === 1 || i === out.length - 1); }
function aihMove(e, tx, ty, sp, dt) { const A = e.ai, M = G.map; let gx = tx, gy = ty;
  if (A.path && A.pathK === (tx | 0) + ',' + (ty | 0)) { const wp = A.path[0]; if (wp) { gx = wp[0]; gy = wp[1]; if (Math.hypot(gx - e.x, gy - e.y) < 6) { A.path.shift(); if (!A.path.length) A.path = null; } } }
  const dx = gx - e.x, dy = gy - e.y, L = Math.hypot(dx, dy); if (Math.hypot(tx - e.x, ty - e.y) < 3) { A.path = null; e.mt = null; return true; }
  // dash de vez en cuando (como tú) y montura en los mapas abiertos para ir lejos
  A.dashCd = (A.dashCd || 0) - dt; if (A.dashT > 0) A.dashT -= dt; else if (A.dashCd <= 0 && L > 70 && Math.random() < 0.012) { A.dashT = 0.22; A.dashCd = 4 + Math.random() * 5; burst(e.x, e.y - 4, 8, { sp: 40, up: 12, g: 60, life: 0.35, c: ['#c8b898', '#e8dcc0'] }); }
  const far = Math.hypot(tx - e.x, ty - e.y) > 220; e.mt = e.aih.mt && M.isWorld && far && !A.tgt && A.dashT <= 0 ? e.aih.mt : null;
  const v = aihSpd(e) * (A.dashT > 0 ? 2.6 : 1) * (e.mt && MOUNTS[e.mt] ? MOUNTS[e.mt].sp : 1), stepx = L ? dx / L * v * dt : 0, stepy = L ? dy / L * v * dt : 0;
  e.dir = dirFromVec(dx, dy); const ok = moveEnt(M, e, stepx, stepy); setAnim(e, A.dashT > 0 && !e.mt ? 'dash' : 'walk', true);
  if (!ok) { A.stuck = (A.stuck || 0) + dt; if (A.stuck > 0.25 && !A.path) { A.path = aihPath(M, e, tx, ty); A.pathK = (tx | 0) + ',' + (ty | 0); A.stuck = 0; if (!A.path) { e.mt = null; return true; } } else if (A.stuck > 1.5) { A.stuck = 0; A.path = null; e.mt = null; return true; } } else A.stuck = 0; return false; }
function aihGain(e, m) { const h = e.aih; h.kills++; if (m.lv < h.lv - 25) return; h.xp++; const need = 6 + Math.floor(h.lv * 0.4); if (h.xp < need || h.lv >= MAXLV) return; h.xp = 0; h.lv++; const P = G.P; P.aihLv = P.aihLv || {}; P.aihLv[h.k] = h.lv; if (h.W && h.lv % 50 === 0) aihStory(h, 'n', h.lv);
  floatText(e.x, e.y - 40, L2('¡SUBE DE NIVEL!', 'LEVEL UP!'), '#ffe070'); addFx({ type: 'ring', x: e.x, y: e.y, r: 22, dur: 0.6, col: '#ffe070' }); if (Math.random() < 0.3) aihSay(e, pick([L2('¡Nivel ', 'Level ') + h.lv + '!', L2('¡Por fin!', 'Finally!'), 'GG'])); }
function aihKill(m, e) { m.hp = 0; m.dying = 0.001; setAnim(m, 'hurt'); burst(m.x, m.y - 10, 10, { sp: 60, up: 36, g: 140, life: 0.5, c: ['#d8d0c8', '#a09890', '#ffffff'] }); if (m.camp && m.camp.dead) m.camp.dead.push(G.t + 28 + Math.random() * 20); if (G.P.target === m) G.P.target = null; m._aih = null; aihGain(e, m); }
function aihFindMob(e) { const h = e.aih; let best = null, bd = 260 * 260; for (const m of G.ents) { if (m.type !== 'mob' || m.lv > h.lv + 8 || m.lv < Math.max(1, h.lv - 40) || (e.ai.skip && e.ai.skip.has(m)) || (m.L !== e.L && m.L >= 0 && e.L >= 0)) continue; const d = dist2(m.x, m.y, e.x, e.y); if (d < bd && aihFree(m, e)) { bd = d; best = m; } } return best; }
function aihFindRes(e) { const M = G.map; if (!M.objs) return null; let best = null, bd = 180 * 180; for (const o of M.objs) { if (o.hidden || (o.k !== 'tree' && o.k !== 'ore')) continue; const d = dist2(o.px, o.py, e.x, e.y); if (d < bd) { bd = d; best = o; } } return best; }
function aihUpdate(e, dt) { const h = e.aih, A = e.ai, P = G.P; if (!h || e.hidden) return; A.t -= dt; A.cd -= dt;
  const near = dist2(e.x, e.y, P.x, P.y) < 40 * 40 && !A.tgt && A.st !== 'chat'; if (near && A.st !== 'gather' && A.st !== 'fish' && A.st !== 'down' && A.st !== 'revive' && A.st !== 'flee' && A.st !== 'heal') { e.dir = dirFromVec(P.x - e.x, P.y - e.y); if (!A.hi) { A.hi = 1; if (Math.random() < 0.5) { aihSay(e, pick(AIH_HI)); setAnim(e, 'wave'); A.waveT = 1.5; } } A.waveT = (A.waveT || 0) - dt; setAnim(e, A.waveT > 0 ? 'wave' : 'idle', true); stepAnim(e, dt, 5); return; }
  switch (A.st) {
    case 'idle': setAnim(e, 'idle', true); if (A.t > 0) break; aihDecide(e); break;
    case 'flee': { const f = A.from || { x: e.x + 1, y: e.y }, ax = e.x - f.x, ay = e.y - f.y, L = Math.hypot(ax, ay) || 1; if (A.dashCd <= 0 && Math.random() < 0.05) { A.dashT = 0.22; A.dashCd = 3; } aihMove(e, e.x + ax / L * 60, e.y + ay / L * 60, 60, dt); if (A.t <= 0 || L > 200) { A.st = 'heal'; A.t = 8 + Math.random() * 6; } break; }
    case 'heal': { setAnim(e, 'sit', true); const mh = aihStats(h).S.maxhp; A.hpN = Math.min(mh, (A.hpN || 0) + mh * 0.06 * dt); A.hp = A.hpN / mh; if (A.hp >= 0.85 || A.t <= 0) { A.st = 'idle'; A.t = 0.5; } break; }
    case 'down': setAnim(e, 'dead', true); e.mt = null; if (G.t - A.downT > A.selfT) { aihRevive(e, 0.4); aihSay(e, pick([L2('Uf… me levanto solo.', 'Phew… getting up on my own.'), L2('Poción de emergencia, ¡vamos!', 'Emergency potion, let\'s go!')])); } break;
    case 'revive': { const o = A.rv; if (!o || o.remove || !o.ai || o.ai.st !== 'down') { A.st = 'idle'; A.t = 0.5; A.rv = null; break; } if (Math.hypot(o.x - e.x, o.y - e.y) > 20) { aihMove(e, o.x + 14, o.y, 60, dt); A.rvT = 0; break; }
      e.dir = dirFromVec(o.x - e.x, o.y - e.y); setAnim(e, 'cast', true); A.rvT = (A.rvT || 0) + dt; if (A.rvT > 3) { aihRevive(o, 0.5); aihSay(e, pick([L2('¡Arriba!', 'Up you go!'), L2('Te tengo.', 'Got you.')])); aihSay(o, pick([L2('¡Gracias!', 'Thanks!'), L2('Te debo una.', 'I owe you one.')])); A.st = 'idle'; A.t = 1; A.rv = null; } break; }
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
      const k = clamp(0.14 + (h.lv - m.lv) * 0.012, 0.05, 0.7) * (sk ? 2.2 : 1) * aihPow(h), dmg = Math.max(1, Math.round(m.maxhp * k * (0.85 + Math.random() * 0.3)));
      if (sk) { const col = AIH_SKC[h.cls] || '#ffffff'; burst(m.x, m.y - 14, 16, { sp: 80, up: 50, g: 60, life: 0.5, c: [col, '#ffffff'] }); addFx({ type: 'ring', x: m.x, y: m.y, r: 26, dur: 0.4, col }); A.cd += 0.6; }
      if (AIH_RANGED.has(h.cls)) for (let s = 0; s < 4; s++) part(e.x + (m.x - e.x) * s / 4, e.y - 14 + (m.y - e.y) * s / 4, { vz: 0, g: 0, life: 0.25, c: h.cls === 'mago' ? '#8ac8ff' : '#e0d0a0', s: 1 });
      if (m.boss) { const floor_ = Math.round(m.maxhp * 0.25); m.hp = Math.max(floor_, m.hp - dmg); m._aihHurt = G.t; m.flash = 0.12; floatText(m.x, m.y - (m.hgt || 30), dmg, '#b8b8c8'); if (m.hp <= floor_) { (A.skip = A.skip || new WeakSet()).add(m); m._aih = null; A.tgt = null; A.st = 'idle'; A.t = 2; aihSay(e, pick([L2('Este jefe para otro, me retiro.', 'This boss is for someone else, I\'m out.'), L2('Lo dejo para quien venga.', 'Leaving it for whoever comes.')])); } break; }
      m.hp -= dmg; m.flash = 0.12; floatText(m.x, m.y - (m.hgt || 30), dmg, '#b8b8c8'); if (m.hp <= 0) { aihKill(m, e); A.tgt = null; A.st = 'idle'; A.t = 0.4 + Math.random(); if (A.hp < 0.6 && Math.random() < 0.5) { A.st = 'rest'; A.t = 4 + Math.random() * 4; } }
      break; } }
  stepAnim(e, dt, e.anim === 'walk' ? (A.st === 'travel' ? 11 : 8) : e.anim === 'atk' || e.anim === 'cast' ? 10 : e.anim === 'chop' || e.anim === 'mine' ? 6 : e.anim === 'dance' || e.anim === 'cheer' || e.anim === 'wave' ? 6 : 2); }
// qué hace ahora: como cualquiera que juega (cada uno con su forma de ser: farmero, viajero, sociable o recolector)
function aihDecide(e) { const h = e.aih, A = e.ai, pers = h.seed % 4, M = G.map, r = Math.random();
  const dn = AIH_LIST.find(x => x !== e && !x.remove && x.ai.st === 'down' && !AIH_LIST.some(y => y.ai.rv === x) && dist2(x.x, x.y, e.x, e.y) < 240 * 240); if (dn && (pers === 2 || r < 0.7)) { A.st = 'revive'; A.rv = dn; A.rvT = 0; return; }
  const bs = aihFindBoss(e); if (bs && r < 0.5) { A.st = 'fight'; A.tgt = bs; A.ft = 0; bs._aih = e; bs._aihT = G.t; if (Math.random() < 0.5) aihSay(e, L2('¡A por el jefe!', 'Go for the boss!')); return; }
  if (A.hp < 0.5 && !A.pots) { A.st = 'heal'; A.t = 6; return; } const m = aihFindMob(e); if (m && r < (pers === 0 ? 0.92 : pers === 3 ? 0.55 : 0.75)) { A.st = 'fight'; A.tgt = m; A.ft = 0; m._aih = e; m._aihT = G.t; return; }
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
function aihFreeFight(m, e) { const P = G.P; if (P.target === m || G.t - (m._pHitT || -99) < 12) return false; if (m.boss) return !aihBossMine(m); if (m.state && m.state !== 'idle') return false; return true; }
const aihBossMine = b => { const P = G.P; return P.target === b || G.t - (b._pHitT || -99) < 25 || (b.map === P.map && dist2(b.x, b.y, P.x, P.y) < 220 * 220) || (typeof BOSS_UI !== 'undefined' && BOSS_UI === b); };
function aihFindBoss(e) { const h = e.aih; for (const m of G.ents) { if (m.type !== 'mob' || !m.boss || m.dying || m.ti || m.duel || m.map !== e.map || (e.ai.skip && e.ai.skip.has(m))) continue; if (h.lv < (m.lv || 1) - 10 || m.hp <= m.maxhp * 0.3 || aihBossMine(m)) continue; if (dist2(m.x, m.y, e.x, e.y) < 300 * 300 && (m.L === e.L || m.L < 0 || e.L < 0)) return m; } return null; }
// 6.44b: instinto de supervivencia: esquivan (con dash, según su destreza y clase), llevan pociones propias (las gastan y las
// recuperan con el tiempo), y si están mal y sin pociones huyen y se sientan a recuperarse.
const aihPots = h => 3 + Math.min(5, Math.floor(h.lv / 100));
function aihDodge(e, src) { const h = e.aih, A = e.ai, t = aihStats(h), dex = (t.attr && t.attr.dex) || 5, ch = Math.min(0.35, 0.08 + dex / Math.max(400, h.lv * 12) + (h.cls === 'asesino' || h.cls === 'arquero' ? 0.08 : 0) + (A.hp < 0.5 ? 0.06 : 0));
  if ((A.dashCd || 0) > 0 || Math.random() > ch) return false; A.dashCd = 2.5 + Math.random() * 2; A.dashT = 0.22; const ax = src ? e.x - src.x : Math.random() - 0.5, ay = src ? e.y - src.y : Math.random() - 0.5, L = Math.hypot(ax, ay) || 1, side = Math.random() < 0.5 ? 1 : -1;
  moveEnt(G.map, e, (ax / L * 0.6 - ay / L * side * 0.8) * 22, (ay / L * 0.6 + ax / L * side * 0.8) * 22); burst(e.x, e.y - 4, 8, { sp: 40, up: 12, g: 60, life: 0.35, c: ['#c8b898', '#e8dcc0'] }); setAnim(e, 'dash'); floatText(e.x, e.y - 34, L2('ESQUIVA', 'DODGE'), '#a0e0ff'); return true; }
function aihHurt(e, d, src) { const A = e.ai, h = e.aih, mh = aihStats(h).S.maxhp; if (A.st === 'down' || !isFinite(d)) return; if (aihDodge(e, src)) return; A.pots = A.pots === undefined ? aihPots(h) : A.pots;
  A.hpN = (A.hpN === undefined || !isFinite(A.hpN) ? mh : A.hpN) - d; floatText(e.x, e.y - 34, d, '#ff9a9a'); e.flash = 0.12; A.lastHurt = G.t;
  if (A.hpN < mh * 0.35 && A.pots > 0 && G.t > A.potT) { A.pots--; A.potT = G.t + 6; A.hpN = Math.min(mh, A.hpN + mh * 0.45); floatText(e.x, e.y - 44, L2('poción', 'potion') + ' (' + A.pots + ')', '#ff8a8a'); }
  A.hp = Math.max(0, A.hpN / mh); if (A.hpN <= 0) { aihDown(e); return; }
  if (A.hp < 0.3 && !A.pots && A.st !== 'flee' && A.st !== 'down') { const m = A.tgt; if (m && m._aih === e) m._aih = null; A.tgt = null; A.st = 'flee'; A.from = src ? { x: src.x, y: src.y } : { x: e.x + 1, y: e.y }; A.t = 3.5; aihSay(e, pick([L2('¡Me retiro!', 'Falling back!'), L2('Sin pociones, ¡a correr!', 'Out of potions, run!'), L2('Esto se pone feo…', 'This is getting ugly…')])); } }
function aihDown(e) { const A = e.ai; if (A.tgt && A.tgt._aih === e) A.tgt._aih = null; A.tgt = null; A.st = 'down'; A.downT = G.t; A.selfT = 25 + Math.random() * 20; A.hpN = 0; e.aih.tf = null; e.mt = null; setAnim(e, 'dead'); aihSay(e, pick([L2('¡Ayuda!', 'Help!'), L2('Me han tumbado…', 'I\'m down…'), L2('¡Me caí!', 'I fell!')])); }
function aihRevive(e, f) { const A = e.ai, mh = aihStats(e.aih).S.maxhp; A.hpN = Math.round(mh * f); A.hp = f; A.st = 'idle'; A.t = 1.5; addFx({ type: 'ring', x: e.x, y: e.y, r: 20, dur: 0.5, col: '#8aff8a' }); setAnim(e, 'idle'); }
function aihLine(e) { const L = AIH_LINES[e.aih.chat % AIH_LINES.length], t = L[Math.floor(Math.random() * L.length)]; return /piso $|floor $/.test(t) ? t + (10 + (e.aih.seed % 90)) + '.' : t; }
hookBefore('updateNPC', (e, dt) => { if (e && e.aih) { aihUpdate(e, dt); return HOOK_SKIP; } });
// 6.44: los enemigos (todos, también jefes y súper jefes, según donde estén) atacan a los jugadores cazadores de verdad:
// los que pelean con uno le devuelven los golpes y los agresivos van a por el que tengan cerca (si no te persiguen a ti).
hookBefore('updateMob', (m, dt) => { if (!m || m.dying || m.ghost || m.duel || m.ti || m.aihSrc || !AIH_LIST.length) return; if (m.state && m.state !== 'idle' && !(m.boss && !aihBossMine(m))) return;
  let e = m._aih; if (e && (e.remove || e.hidden || e.ai.st === 'down' || e.map !== m.map)) { m._aih = null; e = null; }
  if (!e && m.def && m.def.ai !== 'passive') { m._aihScan = (m._aihScan || 0) - dt; if (m._aihScan <= 0) { m._aihScan = 0.6; const R = (m.boss ? 140 : (m.aggroR || 80)) * 0.8; for (const h of AIH_LIST) { if (h.remove || h.hidden || h.ai.st === 'down' || h.map !== m.map || (h.L !== m.L && h.L >= 0 && m.L >= 0)) continue; if (dist2(h.x, h.y, m.x, m.y) < R * R) { e = h; m._aih = h; m._aihT = G.t; if (h.ai.st !== 'fight' && h.ai.st !== 'revive') { h.ai.st = 'fight'; h.ai.tgt = m; h.ai.ft = 0; } break; } } } }
  if (!e) return; if (G.t - (m._aihT || -9) > 6 && Math.hypot(e.x - m.x, e.y - m.y) > 160) { m._aih = null; return; } m._aihT = Math.max(m._aihT || 0, G.t - 5);
  const d = Math.hypot(e.x - m.x, e.y - m.y), rng = (m.range || 15) + 8; m.dir = dirFromVec(e.x - m.x, e.y - m.y); if (m.flash > 0) m.flash -= dt;
  if (d > rng) { const sp = (m.spd || 40) * (m.slow > 0 ? 0.5 : 1) * (m.root > 0 ? 0 : 0.9); moveEnt(G.map, m, (e.x - m.x) / d * sp * dt, (e.y - m.y) / d * sp * dt); setAnim(m, 'walk', true); stepAnim(m, dt, 8); return HOOK_SKIP; }
  m.cdH = (m.cdH || 0) - dt; if (m.cdH <= 0) { m.cdH = m.boss ? 2 : 1.4; setAnim(m, 'atk'); const S = aihStats(e.aih).S, dmg = Math.max(1, Math.round(m.atk * dmgRedP(S.def, m.lv) * (0.9 + Math.random() * 0.2) * (m.boss ? 1.6 : 1))); aihHurt(e, dmg, m); if (m.boss) addFx({ type: 'ring', x: e.x, y: e.y, r: 24, dur: 0.35, col: '#ff6a4a' }); }
  if (m.anim === 'atk' && m.af >= animN(m, 'atk') - 1) setAnim(m, 'idle'); stepAnim(m, dt, m.anim === 'atk' ? 8 : 3); return HOOK_SKIP; });
// un jefe que pelearon los cazadores se recupera del todo cuando se van (así no te lo dejan a medias para robártelo)
hookAfter('updateMob', (r, m) => { if (m && m.boss && m._aihHurt && !m.dying && G.t - m._aihHurt > 15 && G.t - (m._pHitT || -99) > 15 && !m._aih) { m.hp = m.maxhp; m._aihHurt = 0; } });
// recolocar a los que se quedan lejos (fuera de la pantalla) y liberar sprites
V33_TICKS.push(() => { const M = G.map, P = G.P; if (!M || !P || AIH_MAP !== M.id) { if (M && P && AIH_MAP !== M.id) aihOnMap(M); return; } if (G.t - AIH_TK < 3) return; AIH_TK = G.t;
  for (const e of AIH_LIST) { if (e.remove) continue; const d = Math.hypot(e.x - P.x, e.y - P.y), vis = Math.abs(e.x - P.x) < VW * 0.7 && Math.abs(e.y - P.y) < VH * 0.7;
    if (G.t - e.ai.seen > 20 && e._aihDrop) e._aihDrop();
    if (!vis && d > 50 * 16 && e.ai.st !== 'fight') { const p = aihSpot(M, e.aih, true); if (p && (Math.abs(p[0] - P.x) > VW * 0.6 || Math.abs(p[1] - P.y) > VH * 0.6)) { e.x = e.home.x = p[0]; e.y = e.home.y = p[1]; e.L = p[2] | 0; e.ai.st = 'idle'; e.ai.t = Math.random() * 2; } } } });
// nombre y nivel en azul, como los jugadores
hookAfter('drawEnt', (r, e, cx, cy) => { if (!e || !e.aih || e.hidden) return; const A = e.atlas, top = Math.round(e.y - cy) - (A ? A.fh - 10 : 40), x = Math.round(e.x - cx); const s = textSprite(e.aih.name + ' NV.' + e.aih.lv, '#8ae0ff'); ctx.drawImage(s, x - (s.width >> 1), top - 9); });
// ---------- hablar y desafiar ----------
hookAround('openDialog', (next, npc) => { if (!npc || !npc.aih) return next(npc); const h = npc.aih; npc.def.n = h.name; npc.def.title = aihTitle(h); npc.def.lines = [aihTalkLine(npc)]; try { return next(npc); } finally { npc.def.n = ''; } });
DLG_HOOKS.push((npc, opts) => { if (!npc || !npc.aih) return; const h = npc.aih;
  opts.unshift({ label: '⚔ ' + L2('Desafiar a un duelo', 'Challenge to a duel'), icon: ['sword', 3], fn: () => { closeDialog(); aihDuel(npc); } });
  opts.unshift({ label: '📖 ' + L2('Su perfil y su historia', 'Their profile and story'), icon: ['users'], fn: () => { closeDialog(); aihProfile(h); } }); });
function aihProfile(h) { const W = h.W || { j: [0, 0, 0], f: [], s: [] }, t = aihStats(h), S = t.S, C_ = CLASSES[h.cls] || { n: h.cls }, fn = k => (typeof SR !== 'undefined' && SR[k] ? SR[k].ic + ' ' + SR[k].n : k);
  const slot = (sl, lab) => { const e = t.equip[sl]; return `<button class="eq">${e && ITEMS[e.id] ? iconHTML(ITEMS[e.id].icon, 32) + (e.up ? `<em class="upl">+${e.up}</em>` : '') : '<span class="ph">' + lab + '</span>'}</button>`; };
  const at = (k, n) => `<div class="attr"><span>${n}</span><b>${t.attr[k]}</b></div>`, need = typeof xpToNext === 'function' ? xpToNext(h.lv) : 100, xp = Math.round(need * Math.min(0.98, (h.xp || 0) / (6 + Math.floor(h.lv * 0.4))));
  openModal(`<div class="charwrap"><div class="frame chL"><div class="eqrow">${slot('head', L2('Casco', 'Helm'))}${slot('neck', L2('Amul.', 'Amul.'))}</div><div class="eqrow">${slot('weapon', L2('Arma', 'Weapon'))}<canvas id="aihPrev" width="48" height="48"></canvas>${slot('acc', L2('Anillo', 'Ring'))}</div><div class="eqrow">${slot('body', L2('Armad.', 'Armor'))}${slot('legs', L2('Grebas', 'Greaves'))}${slot('feet', L2('Botas', 'Boots'))}</div>
    <p class="hint">📍 ${L2('Ahora en', 'Now in')}: ${esc(AIH_MAPN(W.m || h.home))} · ${L2('De', 'From')}: ${esc(AIH_MAPN(h.home))}</p>
    <p class="hint">🪓 ${L2('Tala', 'Woodcutting')} ${W.j[0]} · ⛏ ${L2('Minería', 'Mining')} ${W.j[1]} · 🎣 ${L2('Pesca', 'Fishing')} ${W.j[2]}${h.mt && MOUNTS[h.mt] ? ' · 🐴 ' + esc(MOUNTS[h.mt].n) : ''}</p>
    <p class="hint">🌀 ${L2('Formas', 'Forms')}: ${W.f.length ? W.f.map(fn).join(', ') : '—'}</p><p class="hint">♾ ${L2('Torre Infinita', 'Infinite Tower')}: ${W.tb ? L2('piso ', 'floor ') + W.tb : '—'} · ⚔ ${L2('contra ti', 'against you')}: ${W.w || 0}-${W.l || 0}</p></div>
    <div class="frame chR"><h2>${esc(h.name)}</h2><p class="sub">${L2('Jugador cazador', 'Player hunter')} · ${esc(C_.n)} · ${L2('Nivel', 'Level')} ${h.lv} · ${L2('Poder', 'Power')} ${fmt(S.power || 0)}</p><div class="xpline"><div class="bar xp big"><i style="width:${h.lv >= MAXLV ? 100 : (100 * xp / need).toFixed(1)}%"></i></div><small>${h.lv >= MAXLV ? L2('Nivel máximo', 'Max level') : fmt(xp) + ' / ' + fmt(need) + ' XP'}</small></div>
    <div class="stats">${statLine(L2('Vida', 'HP'), fmt(S.maxhp))}${statLine(L2('Maná', 'Mana'), fmt(S.maxmp))}${statLine(L2('Ataque', 'Attack'), fmt(S.atk))}${statLine(L2('Defensa', 'Defense'), fmt(S.def))}${statLine(L2('Crítico', 'Critical'), (+S.crit || 0).toFixed(1) + '%')}${statLine(L2('Daño crítico', 'Crit damage'), S.critD + '%')}${statLine(L2('Vel. ataque', 'Atk speed'), (1 / (S.aspd || 1)).toFixed(2) + '/s')}${statLine(L2('Velocidad', 'Speed'), Math.round(S.spd))}${S.life ? statLine(L2('Robo de vida', 'Lifesteal'), S.life + '%') : ''}${S.dodge ? statLine(L2('Esquiva', 'Dodge'), S.dodge + '%') : ''}</div>
    <h3>${L2('Atributos', 'Attributes')}</h3><div class="attrs">${at('str', L2('Fuerza', 'Strength'))}${at('int', L2('Inteligencia', 'Intelligence'))}${at('dex', L2('Destreza', 'Dexterity'))}${at('vit', L2('Vitalidad', 'Vitality'))}</div>
    <h3>📖 ${L2('Su historia', 'Their story')}</h3>${(W.s || []).slice().reverse().map(e => `<p class="hint">${esc(aihStoryText(e))}</p>`).join('') || '<p class="hint">—</p>'}
    <div class="goldline">${h.kills || 0} ${L2('enemigos derrotados hoy', 'enemies defeated today')} · ${L2('No comparte experiencia, no te quita tus monstruos y no te puede revivir.', 'Doesn\'t share XP, doesn\'t steal your monsters and can\'t revive you.')}</div><div class="row"><button class="btn" id="aihOk">OK</button></div></div></div>`, 'aihp');
  try { drawPortrait($('#aihPrev'), aihAtlas(h)); } catch (e) { } $('#aihOk').onclick = () => closeModal(); }
// diálogos nuevos: según dónde está, qué hizo hace poco, su forma de ser y si ya os habéis peleado
function aihTalkLine(e) { const h = e.aih, W = h.W || {}, last = (W.s || [])[W.s ? W.s.length - 1 : 0], pers = h.seed % 4, P = G.P;
  const L = [];
  if (last) { const t = aihStoryText(last); if (t) L.push(L2('¿Sabes qué? ', 'Guess what? ') + t.charAt(0).toLowerCase() + t.slice(1) + '.'); }
  if (W.m && W.m !== h.home) L.push(L2('Soy de ', 'I\'m from ') + AIH_MAPN(h.home) + L2(', pero ahora ando por ', ', but now I\'m around ') + AIH_MAPN(W.m) + '.');
  if (W.f && W.f.length > 1) L.push(L2('Tengo ', 'I have ') + W.f.length + L2(' formas y cambio según el enemigo.', ' forms and switch depending on the enemy.'));
  if (W.r >= 7) L.push(L2('Mi equipo está a +', 'My gear is at +') + W.r + L2('. Me costó una fortuna.', '. Cost me a fortune.'));
  if ((W.w || 0) > (W.l || 0)) L.push(L2('La última vez te gané, ¿la revancha?', 'I beat you last time, rematch?')); else if (W.l) L.push(L2('No te creas, la próxima te gano.', 'Don\'t get cocky, I\'ll win next time.'));
  if (h.lv > P.lv + 50) L.push(L2('Cuando llegues a mi nivel te enseño una zona buena.', 'When you reach my level I\'ll show you a good zone.')); else if (h.lv < P.lv - 50) L.push(L2('¡Qué nivel tienes! ¿Cómo farmeas tan rápido?', 'What a level! How do you farm so fast?'));
  L.push([L2('Hoy voy a farmear hasta tarde.', 'Farming till late today.'), L2('Me voy de viaje pronto, quiero ver otros países.', 'Going travelling soon, I want to see other countries.'), L2('Estoy juntando materiales para mejorar mi arma.', 'Gathering materials to upgrade my weapon.'), L2('Mi oficio favorito es pescar, relaja.', 'My favourite job is fishing, it\'s relaxing.')][pers]);
  L.push(aihLine(e)); return pick(L); }
function aihDuel(e) { const h = e.aih; if (typeof duelStart !== 'function' || DUEL) return; const t = aihTier(h.lv);
  duelStart({ name: h.name, lv: h.lv, look: LK({ hair: HAIRS[h.app.hair] || HAIRS.negro, armor: TIERP[clamp(Math.ceil(h.lv / 22), 1, 15)], weapon: { k: 'sword', tier: clamp(Math.ceil(h.lv / 18), 1, 15) } }) });
  let n = 0; const fix = () => { n++; if (DUEL && DUEL.m && DUEL.o && DUEL.o.name === h.name) { try { DUEL.m.atlas = aihAtlas(h); } catch (er) { } return; } if (n < 40) setTimeout(fix, 100); }; setTimeout(fix, 100); }
// menos ciudadanos: España bastante menos y Perú muy poco menos (los cazadores ocupan ese sitio)
hookAfter('v74Dens', (d, h, c) => c === 'es' ? d * 0.72 : c === 'pe' ? d * 0.9 : d);
SAVEKEYS.push('aihLv', 'aihT', 'aihW');
// Lupa › Sistemas
if (typeof GSIS !== 'undefined') GSIS.unshift(['n_cazadores_ia', '🧑‍🤝‍🧑 ' + L2('Jugadores cazadores', 'Player hunters'), () => [L2('En todos los mapas abiertos y en las ciudades hay jugadores cazadores con nombre propio que van y vienen: farmean su nivel, usan habilidades, viajan de una zona a otra, talan, pican, pescan, saludan, charlan entre ellos, descansan y suben de nivel solos (también mientras no juegas, un poco). Llevan su nombre y nivel en azul.', 'In every open map and city there are player hunters with their own names who come and go: they farm their level, use skills, travel between zones, chop, mine, fish, wave, chat with each other, rest and level up on their own (a little even while you are away). Their name and level show in blue.'),
  L2('No te ayudan ni compartes experiencia con ellos, y no te roban: nunca atacan a tu objetivo, a lo que te persigue o golpeaste hace poco, ni a nada de la zona en la que estás farmeando. Si golpeas a uno que estaban atacando, te lo dejan.', 'They don\'t help you and you don\'t share XP, and they don\'t steal: they never attack your target, whatever is chasing you or that you hit recently, or anything in the zone you are farming. If you hit one they were fighting, they leave it to you.'),
  L2('Viven su propia aventura (no tienen tu hilo): mejoran su equipo, suben oficios, consiguen formas, viajan por todos los países y mapas y vencen jefes; lo ves en su perfil (📖). Se transforman en combate y cambian de forma si quieren. No te pueden revivir. Habla con ellos para ver su historia o desafiarlos, o atácalos sin más: se defienden.', 'They live their own adventure (they don\'t have your thread): they upgrade gear, raise jobs, get forms, travel across every country and map and defeat bosses; see it in their profile (📖). They transform in combat and switch forms when they want. They can\'t revive you. Talk to them to see their story or challenge them, or just attack them: they fight back.')], () => null]);
// si un cazador está al lado de un NPC de verdad, «Hablar» elige siempre al NPC (misiones, tiendas…)
hookAfter('interactTarget', r => { if (!r || r.kind !== 'npc' || !r.e || !r.e.aih) return; if (r.e.hidden) return null; const P = G.P; let best = null, bd = 34 * 34;
  for (const e of G.ents) if ((e.type === 'npc' || e.type === 'kid') && !e.aih && e.map === P.map) { const d = dist2(e.x, e.y, P.x, P.y); if (d < bd) { bd = d; best = e; } }
  if (best) return { kind: 'npc', e: best, label: r.label, icon: r.icon }; });

// ---------- 6.44: formas en combate (con aura y destello de la 6.42) y cambio de forma en plena pelea ----------
function aihForm(e, on) { const h = e.aih, W = h.W; if (!W || !W.f.length) return; if (on) { const cur = h.tf, opts = W.f.filter(k => k !== cur); const k = !cur ? (h.sr && W.f.includes(h.sr) ? h.sr : pick(W.f)) : (opts.length ? pick(opts) : cur); if (k !== cur) { h.tf = k; e.tfT = G.t; if (Math.random() < 0.4) aihSay(e, (typeof SR !== 'undefined' && SR[k] ? SR[k].f : '') + '!'); } } else if (h.tf) { h.tf = null; } }
V33_TICKS.push(() => { for (const e of AIH_LIST) { if (e.remove || !e.aih || !e.aih.W || !e.aih.W.f.length) continue; const A = e.ai, h = e.aih, m = A.tgt;
  if (A.st === 'fight' && m && m.lv >= h.lv - 8) { if (!h.tf) aihForm(e, true); else if (e.aih.W.f.length > 1 && G.t - (e.tfT || 0) > 9 && Math.random() < 0.3) aihForm(e, true); A.lastF = G.t; }
  else if (h.tf && G.t - (A.lastF || 0) > 6) aihForm(e, false); } });
// su aura y su destello (el aura de la 6.42 ya acepta jugadores cazadores)
WORLD_DRAW.push((cx, cy) => { if (typeof trAuraEnt !== 'function') return; for (const e of AIH_LIST) if (!e.remove && !e.hidden && e.aih) trAuraEnt(e, e.aih.tf || null, e.aih.tf ? 1 : 0, false, cx, cy);
  for (const m of G.ents) if (m.type === 'mob' && m.aihSrc && !m.dying) trAuraEnt(m, m.aihSrc.aih.tf || null, m.aihSrc.aih.tf ? 1 : 0, false, cx, cy); });
// ---------- 6.44: atacarlos sin pedir duelo ----------
hookBefore('basicAttack', () => { const P = G.P; if (!P || P.dead || !G.map) return; const dv = DIRV[P.dir] || [0, 1], fx = P.x + dv[0] * 14, fy = P.y + dv[1] * 10;
  for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === P.map && dist2(m.x, m.y, P.x, P.y) < 46 * 46) return;
  let best = null, bd = 30 * 30; for (const e of AIH_LIST) { if (e.remove || e.hidden || e.map !== P.map) continue; const d = Math.min(dist2(e.x, e.y, fx, fy), dist2(e.x, e.y, P.x, P.y)); if (d < bd) { bd = d; best = e; } }
  if (best) aihHostile(best); });
function aihHostile(e) { const h = e.aih, P = G.P, key = 'aihx_' + aihHash(h.k); if (e.hidden) return null;
  if (!Object.prototype.hasOwnProperty.call(MOBS, key)) Object.defineProperty(MOBS, key, { value: { n: h.name, art: ['hum', 'espadachin_portal'], reg: ['x'], lv: [1, MAXLV], hp: 6, atk: 1.4, def: 1.2, spd: 66, ai: 'aggro', fam: 'aihx', drops: [], aihx: 1 }, enumerable: false, configurable: true, writable: true });
  const m = spawnMob(key, h.lv, e.x, e.y, e.L, null, false); if (!m) return null; const pw = aihPow(h); m.map = P.map; m.aihSrc = e; m.name = h.name; m.state = 'chase'; m.aggroR = 420; m.hp = m.maxhp = Math.round(m.maxhp * (1 + ((h.W && h.W.r) || 0) * 0.05)); m.atk = Math.round(m.atk * pw); m.xp = Math.round(m.xp * 0.3); m.gold = 0; m.dir = e.dir;
  try { m.atlas = aihAtlas(h); } catch (er) { } e.hidden = true; e.ai.st = 'hostile'; e.ai.tgt = null; P.target = m; aihSay(e, pick([L2('¿Ah, sí? ¡Pues vamos!', 'Oh yeah? Let\'s go!'), L2('¡Eh! ¿Qué haces?', 'Hey! What are you doing?'), L2('Mala idea…', 'Bad idea…')])); m.chat = e.chat; m.chatT = G.t; return m; }
hookAfter('updateMob', (r, m) => { if (!m || !m.aihSrc || m.dying) return; const e = m.aihSrc, h = e.aih, P = G.P;
  if (h.W && h.W.f.length) { if (!h.tf && m.hp < m.maxhp * 0.6) { aihForm(e, true); m.atk = Math.round(m.atk * 1.2); } else if (h.tf && h.W.f.length > 1 && G.t - (e.tfT || 0) > 9 && Math.random() < 0.01) aihForm(e, true); const want = aihAtlas(h); if (m.atlas !== want) m.atlas = want; }
  if (P.dead || dist2(m.x, m.y, P.x, P.y) > 420 * 420 || P.map !== m.map) { if (P.dead && h.W) { h.W.w = (h.W.w || 0) + 1; aihStory(h, 'w', 1); } aihCalm(m, P.dead ? pick([L2('¡Gané!', 'I won!'), 'GG', L2('Otra vez será.', 'Better luck next time.')]) : L2('Bah, se fue.', 'Meh, they left.')); } });
function aihCalm(m, say) { const e = m.aihSrc; m.remove = true; if (!e) return; e.x = m.x; e.y = m.y; e.hidden = false; e.ai.st = 'idle'; e.ai.t = 1; e.aih.tf = null; if (say) aihSay(e, say); }
hookAfter('killMob', (r, m) => { if (!m || !m.aihSrc) return; const e = m.aihSrc, h = e.aih; if (G.P.best) delete G.P.best[m.mid]; if (h.W) { h.W.l = (h.W.l || 0) + 1; aihStory(h, 'l', 1); } h.tf = null;
  e.ai.st = 'down'; e.hidden = true; setTimeout(() => { if (e.remove) return; const p = aihSpot(G.map, h, true); if (p) { e.x = p[0]; e.y = p[1]; e.L = p[2] | 0; } e.hidden = false; e.ai.st = 'idle'; e.ai.t = 1; }, 45000); });
hookBefore('captureSoul', m => { if (m && (m.aihSrc || m.ti)) return HOOK_SKIP; });
// la vida sigue cada 10 minutos de juego real
V33_TICKS.push(() => { for (const e of AIH_LIST) { if (e.remove || !e.aih) continue; const A = e.ai, h = e.aih; A.pots = A.pots === undefined ? aihPots(h) : A.pots; if (G.t - (A.lastHurt || -99) > 8 && A.st !== 'down') { if (A.pots < aihPots(h) && G.t - (A.potR || 0) > 45) { A.pots++; A.potR = G.t; } if (A.hp < 1 && A.hpN !== undefined) { const mh = aihStats(h).S.maxhp; A.hpN = Math.min(mh, A.hpN + mh * 0.01); A.hp = A.hpN / mh; } } } });
V33_TICKS.push(() => { if (!AIH_POP || !G.P) return; const now = Date.now(); if (now - AIH_LIFE_T < 600000) return; aihLife((now - AIH_LIFE_T) / 3.6e6, false); AIH_LIFE_T = now; G.P.aihT = now; });
// escondido (derrotado o peleando contra ti como enemigo): no se dibuja
hookBefore('drawEnt', e => { if (e && e.aih && e.hidden) return HOOK_SKIP; });

// ---------- 6.44: su montura (en los mapas abiertos, para ir lejos) ----------
hookAround('drawEnt', (next, e, cx, cy) => { if (!e || !e.aih || !e.mt || e.hidden || !MOUNTS[e.mt] || typeof genMount !== 'function') return next(e, cx, cy); const k = e.mt, D = MOUNTS[k], mv = e.anim === 'walk' || e.anim === 'dash', f = mv ? Math.floor(G.t * 10) % 4 : D.fly ? Math.floor(G.t * 5) % 4 : 0, s = genMount(k, e.dir, f), fz = D.fly ? 14 + Math.sin(G.t * 3) * 3 : 0;
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(Math.round(e.x - cx), Math.round(e.y - cy), 15, 5, 0, 0, 7); ctx.fill(); const x = Math.round(e.x - cx), y = Math.round(e.y - cy - fz);
  if (e.dir === 'right') { ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1); ctx.drawImage(s.c, -s.ax, y - s.ay + 6); ctx.restore(); } else if (e.dir !== 'up') ctx.drawImage(s.c, x - s.ax, y - s.ay + 6);
  const a0 = e.anim, z0 = e.z, f0 = e.af; e.anim = 'sit'; e.af = 0; e.z = (z0 || 0) + 12 + fz; try { next(e, cx, cy); } finally { e.anim = a0; e.z = z0; e.af = f0; } if (e.dir === 'up') ctx.drawImage(s.c, x - s.ax, y - s.ay + 6); });
