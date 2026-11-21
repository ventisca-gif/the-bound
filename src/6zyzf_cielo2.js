// ================= v4.29: CELESTIA VIVA — 3 pueblos, ángeles y arpías, romance alado, beso francés, acertijos,
// prueba de memoria, Carrera de Ángeles y Olimpiadas Angelicales (dos oficios nuevos con 10 ventajas cada uno) =================

// ---------- utilidades comunes de la 4.29 (también las usan el archipiélago y el fondo marino) ----------
// Objetos con los que se interactúa en cualquier mapa: o.xact = clave de XACT → [etiqueta, icono, función(o)]
const XACT = {};
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (P && M && M.objs && !P.dead) { let b = null, bd = 30 * 30;
    for (const o of M.xactObjs || M.objs) { if (!o.xact || o.hidden || !XACT[o.xact]) continue; const d = dist2(o.px, o.py, P.x, P.y); if (d < bd) { bd = d; b = o; } }
    if (b) { const X = XACT[b.xact], lab = typeof X[0] === 'function' ? X[0](b) : X[0]; if (lab) return { kind: 'xact', label: lab, icon: X[1], o: b }; } }
  return _it.apply(this, arguments); }; }
{ const _di = doInteract; doInteract = function (it) { it = it || interactTarget(); if (it && it.kind === 'xact') { XACT[it.o.xact][2](it.o); return; } return _di.apply(this, arguments); }; }
// coloca un mueble en la primera casilla libre cerca de (x, y) que cumpla `ok`
function putNear(M, f, x, y, fp, o, ok) { fp = fp || [[0, 0]]; const okT = ok || (i => !SOLID_T[M.ter[i]] && M.ter[i] !== T.DEEP && M.ter[i] !== T.WATER);
  for (let r = 0; r < 8; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; const xx = x + dx, yy = y + dy;
    if (fp.every(([a, b]) => { const i = M.I(xx + a, yy + b); return i >= 0 && i < M.w * M.h && M.objAt[i] < 0 && okT(i); })) return addObj(M, 'furn', xx, yy, Object.assign({ f, fp }, o || {})); }
  return null; }
// oficios nuevos: ventajas por nivel. JOBP2[job] = [[nivel, es, en, efectos]] (también se copian a JOB_PERKS para el panel de oficios)
const JOBP2 = {};
function jobPerkSum(k) { const P = G.P; let v = 0; if (!P || !P.jobs) return 0; for (const j in JOBP2) { const lv = (P.jobs[j] || { lv: 1 }).lv; for (const [n, , , ef] of JOBP2[j]) if (lv >= n && ef && ef[k]) v += ef[k]; } return v; }
{ const _cs = calcStats; calcStats = function (P) { const r = _cs(P); if (P === G.P && P.S && P.jobs) { const S = P.S, f = k => jobPerkSum(k);
    if (f('atkP')) S.atk = Math.round(S.atk * (1 + f('atkP') / 100)); if (f('defP')) S.def = Math.round(S.def * (1 + f('defP') / 100)); if (f('hpP')) { S.maxhp = Math.round(S.maxhp * (1 + f('hpP') / 100)); }
    if (f('spdP')) S.spd *= 1 + f('spdP') / 100; if (f('dodge')) S.dodge = Math.min(45, (S.dodge || 0) + f('dodge')); if (f('crit')) S.crit = Math.min(70, S.crit + f('crit'));
    if (f('skySpd') && G.map && G.map.sky) S.spd *= 1 + f('skySpd') / 100; if (f('seaSpd') && G.map && (G.map.archi || G.map.id === 'submarino')) S.spd *= 1 + f('seaSpd') / 100; } return r; }; }
{ const _gx = gainXp; gainXp = function (n) { const k = jobPerkSum('xpP'); return _gx.call(this, k ? Math.round(n * (1 + k / 100)) : n); }; }
{ const _km = killMob; killMob = function (m) { const g = jobPerkSum('goldP'); if (g && m && m.gold) m.gold = Math.round(m.gold * (1 + g / 100)); return _km.apply(this, arguments); }; }
function addJob(k, n, icon, desc, guide, perks, ic) { JOBS[k] = { n, icon, desc }; JOBP2[k] = perks; JOB_PERKS[k] = perks.map(([lv, es, en]) => [lv, L2(es, en)]); JOB_GUIDE[k] = Object.assign({ perks: perks.map(([lv, es, en]) => [lv, es, en]) }, guide); if (ic) JOB_IC[k] = ic; if (G.P && G.P.jobs && !G.P.jobs[k]) G.P.jobs[k] = { lv: 1, xp: 0 }; }
// marcador pequeño de minijuego (arriba, centrado)
function mgHud(html) { let d = $('#mgHud'); if (!html) { if (d) d.remove(); return; } if (!d) { d = document.createElement('div'); d.id = 'mgHud'; d.style.cssText = 'position:absolute;left:50%;top:calc(4.2em + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:12;background:rgba(20,12,24,.85);border:2px solid #ffd040;border-radius:.5em;padding:.25em .8em;color:#fff4d0;font-size:.85em;pointer-events:none;text-align:center'; document.getElementById('hud').appendChild(d); } d.innerHTML = html; }
// dibujo extra encima del mundo (aros, plumas, destellos de los minijuegos)
const WORLD_DRAW = [];
{ const _r = render; render = function () { _r.apply(this, arguments); if (!G.map || !G.P || !WORLD_DRAW.length) return; const cx = Math.round(G.cam.x), cy = Math.round(G.cam.y); for (const f of WORLD_DRAW) try { f(cx, cy); } catch (e) { console.warn(e); } }; }

// ---------- alas de colores para arpías y ángeles ----------
{ const _dw = drawAngelWings; drawAngelWings = function (e, cx, cy, dark, sc) { const c = e.def && e.def.wingC; if (!c) return _dw.apply(this, arguments);
  const x = e.x - cx, y = e.y - cy - (e.z || 0), s = sc || 1, fl = Math.sin(G.t * 6 + e.x) * 3 * s; ctx.fillStyle = c[0]; ctx.strokeStyle = c[1]; ctx.lineWidth = 1;
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + sd * 3 * s, y - 20 * s); ctx.quadraticCurveTo(x + sd * 22 * s, y - 38 * s - fl, x + sd * 26 * s, y - 14 * s); ctx.quadraticCurveTo(x + sd * 14 * s, y - 18 * s, x + sd * 3 * s, y - 12 * s); ctx.fill(); ctx.stroke();
    ctx.fillStyle = c[1]; for (let k = 0; k < 3; k++) ctx.fillRect(Math.round(x + sd * (10 + k * 5) * s), Math.round(y - (22 + k * 3) * s - fl * 0.5), 2, 2); ctx.fillStyle = c[0]; } }; }

// ---------- los tres pueblos ----------
const CEL_TOWNS = [
  { k: 'cefira', n: L2('Céfira, ciudad de las Arpías', 'Cefira, city of the Harpies'), c: [165, 108], r: [16, 10], ter: 'GRASS', plaza: 'DIRT' },
  { k: 'aurelia', n: L2('Aurelia, ciudad de los Ángeles', 'Aurelia, city of the Angels'), c: [270, 104], r: [15, 10], ter: 'GRASS', plaza: 'COBBLE' },
  { k: 'lumen', n: L2('Lumen, ciudad de los Acertijos', 'Lumen, city of Riddles'), c: [32, 92], r: [15, 10], ter: 'GRASS', plaza: 'COBBLE' },
];
const HARPY = (hair, wing, extra) => LK(Object.assign({ hair, hairStyle: 'long', outfit: 'tunic', main: P5(wing), sec: GOLD.slice(0, 5), skin: SKINS[1] }, extra || {}));
const CEL_NPC = [
  // Céfira: arpías (alas de colores, cantan, viven en nidos enormes)
  ['cf_reina', 'cefira', L2('Reina Aelo', 'Queen Aello'), L2('Matriarca de las Arpías', 'Harpy Matriarch'), HARPY(HAIRS.rojo, ['#4a1a0a', '#8a3a1a', '#c86a2a', '#f0a050', '#ffd8a0'], { g: 'f', outfit: 'royal', hat: 'crown' }), ['#c86a2a', '#ffd8a0'],
    [L2('Las arpías no robamos: recogemos lo que el cielo deja caer. Que a veces caiga de tus bolsillos es mala suerte tuya.', 'Harpies do not steal: we gather what the sky lets fall. If it sometimes falls from your pockets, that is your bad luck.'), L2('Los ángeles de Aurelia nos llaman salvajes. Nosotras a ellos, aburridos. Los dos tenemos razón.', 'The angels of Aurelia call us wild. We call them boring. We are both right.')]],
  ['cf_kiri', 'cefira', 'Kiri', L2('La arpía cantora', 'The singing harpy'), HARPY(HAIRS.turquesa, ['#0a3a3a', '#1a6a6a', '#2aa0a0', '#6ad8d0', '#c0fff4'], { g: 'f', outfit: 'dress' }), ['#2aa0a0', '#c0fff4'],
    [L2('Canto para que el viento no se aburra. Si se aburre, se va… y entonces las islas se caen un poquito.', 'I sing so the wind does not get bored. If it gets bored it leaves… and then the islands fall a little.'), L2('¿Me traes cristales que brillen? Los guardo en mi nido. Bueno, en el de mi madre.', 'Will you bring me shiny crystals? I keep them in my nest. Well, my mother\'s.')]],
  ['cf_tormo', 'cefira', 'Tormo', L2('Vigía de las nubes', 'Cloud lookout'), HARPY(HAIRS.negro, ['#1a1a2a', '#2a2a4a', '#4a4a7a', '#7a7ab0', '#c0c0f0'], { hairStyle: 'short', beard: HAIRS.negro }), ['#4a4a7a', '#c0c0f0'],
    [L2('Desde aquí veo la aeronave llegar mucho antes que tú. Hiciste un aterrizaje horrible.', 'From here I see the airship long before you do. You made a horrible landing.'), L2('En la Corona del Cielo algo se mueve de noche. Las nubes de allí no tienen sombra.', 'Something moves at night on the Crown of the Sky. The clouds there have no shadow.')]],
  ['cf_pluma', 'cefira', L2('Abuela Pluma', 'Granny Feather'), L2('Tejedora de nidos', 'Nest weaver'), HARPY(HAIRS.blanco, ['#3a3a3a', '#6a6a6a', '#9a9a9a', '#cacaca', '#ffffff'], { g: 'f', outfit: 'robe' }), ['#9a9a9a', '#ffffff'],
    [L2('Un nido bien tejido aguanta una tormenta. Uno mal tejido, también, pero a ti no te deja dormir.', 'A well-woven nest withstands a storm. A badly woven one too, but it will not let you sleep.'), L2('Cuando el Telar funcionaba, nos daba hilos de luz para los nidos. Ahora tejemos con plumas viejas y recuerdos.', 'When the Loom worked it gave us threads of light for nests. Now we weave with old feathers and memories.')]],
  ['cf_ruk', 'cefira', 'Ruk', L2('Mercader de plumas', 'Feather trader'), HARPY(HAIRS.castano, ['#3a2a0a', '#6a4a1a', '#a0782a', '#d8b060', '#fff0c0'], { hairStyle: 'short', hat: 'bandana' }), ['#a0782a', '#fff0c0'],
    [L2('Plumas de grifo, de arpía, de ángel… Las de ángel son las más caras porque se quejan cuando se las quitas.', 'Griffin, harpy, angel feathers… Angel ones cost the most because they complain when you pull them.')]],
  // Aurelia: ángeles (la ciudad blanca, la Carrera y las Olimpiadas)
  ['au_aelis', 'aurelia', 'Aelis', L2('Ángel guerrera', 'Warrior angel'), ANGEL(HAIRS.rubio, CLOTH.blanco, { g: 'f', outfit: 'knight', eyes: 'azul' }), null,
    [L2('Entreno al amanecer. El sol de aquí arriba pega distinto: te mira a los ojos.', 'I train at dawn. The sun up here hits differently: it looks you in the eye.'), L2('Gané tres veces la Carrera de Ángeles. La cuarta me la quitó un halcón. No preguntes.', 'I won the Angel Race three times. A hawk took the fourth from me. Don\'t ask.')]],
  ['au_nimiel', 'aurelia', 'Nimiel', L2('Ángel sanadora', 'Healer angel'), ANGEL(HAIRS.blanco, P5(['#5a3a6a', '#8a6aa0', '#b8a0d8', '#e0d0f8', '#ffffff']), { g: 'f', outfit: 'dress', eyes: 'violeta' }), null,
    [L2('Curo heridas, catarros y corazones rotos. Lo último me cuesta más: se curan solos, pero tarde.', 'I heal wounds, colds and broken hearts. The last is hardest: they heal on their own, but late.'), L2('Si vienes cansado, siéntate junto a la fuente. Su agua bajó de la primera nube.', 'If you come tired, sit by the fountain. Its water came down from the first cloud.')]],
  ['au_caelith', 'aurelia', 'Caelith', L2('Lectora de estrellas', 'Star reader'), ANGEL(HAIRS.negro, P5(['#0a0a2a', '#1a1a4a', '#2a2a7a', '#4a4ab0', '#8a8ae0']), { g: 'f', outfit: 'robe', eyes: 'celeste' }), ['#1a1a4a', '#8a8ae0'],
    [L2('Las estrellas no predicen nada. Solo recuerdan. Yo les pregunto qué pasó y a veces me lo cuentan.', 'Stars predict nothing. They only remember. I ask them what happened and sometimes they tell me.'), L2('Tengo alas oscuras porque nací de noche. Los demás dicen que da mala suerte. Las estrellas dicen que no.', 'I have dark wings because I was born at night. Others say it is bad luck. The stars say it is not.')]],
  ['au_zefiro', 'aurelia', L2('Maestro Zéfiro', 'Master Zephyr'), L2('Juez de la Carrera de Ángeles', 'Angel Race judge'), ANGEL(HAIRS.gris, CLOTH.turquesa, { hairStyle: 'short', beard: HAIRS.gris }), null,
    [L2('¿Sabes volar? Aquí todo el mundo sabe. Lo difícil es volar más rápido que los demás sin chocarse con un aro.', 'Can you fly? Everyone here can. The hard part is flying faster than the rest without hitting a ring.')]],
  ['au_olimpia', 'aurelia', L2('Árbitra Olimpia', 'Referee Olympia'), L2('Olimpiadas Angelicales', 'Angelic Olympics'), ANGEL(HAIRS.rubio, P5(['#5a4a0a', '#a08a1a', '#d8c040', '#fff080', '#ffffff']), { g: 'f', outfit: 'tunic', hat: 'crown' }), null,
    [L2('Las Olimpiadas se celebran cada día desde hace ocho mil años. Nunca nadie ha faltado. Bueno, los muertos.', 'The Olympics have been held every day for eight thousand years. No one has ever missed one. Well, the dead.')]],
  ['au_orion', 'aurelia', 'Orión', L2('Guardián de la puerta', 'Gate guardian'), ANGEL(HAIRS.castano, CLOTH.gris, { hairStyle: 'short', outfit: 'knight' }), null,
    [L2('Aurelia es la última ciudad de los ángeles. Antes eran doce. Las otras once se las tragó el Lienzo.', 'Aurelia is the last city of the angels. Once there were twelve. The Canvas swallowed the other eleven.')]],
  // Lumen: ciudad de sabios, acertijos y la prueba de memoria
  ['lu_vespera', 'lumen', L2('Oráculo Vespera', 'Oracle Vespera'), L2('Guardiana de los acertijos', 'Keeper of riddles'), ANGEL(HAIRS.blanco, P5(['#2a1a0a', '#5a3a1a', '#9a6a3a', '#d0a070', '#fff0d0']), { g: 'f', outfit: 'robe', hat: 'hood', hatC: P5(['#1a0a2a', '#3a1a5a', '#5a2a8a', '#8a5ac0', '#c0a0f0']) }), ['#5a2a8a', '#c0a0f0'],
    [L2('Una respuesta es una puerta. Un acertijo es una puerta que te pregunta quién eres antes de abrirse.', 'An answer is a door. A riddle is a door that asks who you are before it opens.'), L2('Hay piedras de acertijos en todas las islas. Cada día cambian de pregunta. Las piedras también se aburren.', 'There are riddle stones on every island. Every day they change their question. Stones get bored too.')]],
  ['lu_tales', 'lumen', L2('Sabio Tales', 'Sage Thales'), L2('Bibliotecario', 'Librarian'), ANGEL(HAIRS.gris, CLOTH.marron, { hairStyle: 'short', beard: HAIRS.gris, outfit: 'robe' }), null,
    [L2('La biblioteca de Lumen tiene un libro por cada pregunta que alguien no se atrevió a hacer.', 'Lumen\'s library has a book for every question someone did not dare to ask.')]],
  ['lu_ixa', 'lumen', 'Ixa', L2('Aprendiz de oráculo', 'Oracle apprentice'), HARPY(HAIRS.rosa, ['#5a0a3a', '#8a1a6a', '#c04aa0', '#f08ad0', '#ffd0f0'], { g: 'f', body: 'small', outfit: 'dress' }), ['#c04aa0', '#ffd0f0'],
    [L2('Soy medio arpía y medio sabia. La mitad sabia dice que no toque nada. La otra mitad ya lo ha tocado.', 'I am half harpy, half sage. The sage half says not to touch anything. The other half already has.')]],
];
for (const [id, , n, title, look, wingC, lines] of CEL_NPC) NPCS[id] = { n, title, look, lines, quests: [], wings: 1, wingC: wingC || null };
// rivales de la Carrera (no aparecen como vecinos)
NPCS.au_rival1 = { n: 'Lirio', look: ANGEL(HAIRS.rubio, CLOTH.blanco, { hairStyle: 'short' }), wings: 1, lines: [] };
NPCS.au_rival2 = { n: 'Sirah', look: ANGEL(HAIRS.rojo, CLOTH.turquesa, { g: 'f' }), wings: 1, wingC: ['#ffe8e0', '#ff8a6a'], lines: [] };
NPCS.au_rival3 = { n: 'Garra', look: HARPY(HAIRS.negro, ['#1a1a1a', '#3a2a1a', '#6a4a2a', '#a07a4a', '#e0c090']), wings: 1, wingC: ['#6a4a2a', '#e0c090'], lines: [] };
// romance: tres ángeles y una arpía, con todo el sistema (corazones, regalos, pasear, beso, pareja, boda e hijos)
Object.assign(ROM, {
  au_aelis: { g: 'f', loves: ['ring', 'gem', 'food'], likes: ['ore', 'cake'], hates: ['spore', 'bone'], taste: L2('los anillos, las gemas y la comida contundente', 'rings, gems and hearty food') },
  au_nimiel: { g: 'f', loves: ['herb', 'bouquet', 'potion'], likes: ['cake', 'crystal'], hates: ['fang', 'bone'], taste: L2('las flores, las hierbas y las pociones', 'flowers, herbs and potions') },
  au_caelith: { g: 'f', loves: ['crystal', 'relic', 'gem'], likes: ['potion', 'bouquet'], hates: ['fish', 'pelt'], taste: L2('los cristales, las reliquias y las noches claras', 'crystals, relics and clear nights') },
  cf_kiri: { g: 'f', loves: ['crystal', 'gem', 'cake'], likes: ['bouquet', 'ring'], hates: ['ore', 'fish'], taste: L2('todo lo que brilla y los pasteles', 'everything shiny and cakes') },
});
Object.assign(ROM_WHERE, { au_aelis: L2('Aurelia (Islas del Cielo)', 'Aurelia (Sky Isles)'), au_nimiel: L2('Aurelia (Islas del Cielo)', 'Aurelia (Sky Isles)'), au_caelith: L2('Aurelia (Islas del Cielo)', 'Aurelia (Sky Isles)'), cf_kiri: L2('Céfira (Islas del Cielo)', 'Cefira (Sky Isles)') });
for (const k of ['au_aelis', 'au_nimiel', 'au_caelith', 'cf_kiri']) if (NPCS[k].look.skin && !SKINS.includes(NPCS[k].look.skin)) SKINS.push(NPCS[k].look.skin);

// ---------- dibujos: casas de mármol, nidos, fuente, estatua, piedra de acertijo, cristales, podio ----------
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = s => C(s);
  if (kind === 'sk_casa') { const p = new Pix(50, 56), Mb = pal(['#8a8aa0', '#b8b8cc', '#dcdce8', '#f4f4fa', '#ffffff']), Gd = pal(['#7a5a0a', '#c8a020', '#ffd040', '#fff0a0']);
    p.rect(6, 24, 38, 31, Mb[2]); for (let x = 8; x < 44; x += 6) { p.vl(x, 26, 28, Mb[3]); p.vl(x + 1, 26, 28, Mb[1]); } p.hl(4, 23, 42, Gd[1]); p.hl(4, 54, 42, Mb[1]);
    p.ell(25, 22, 17, 13, Mb[3]); p.ell(25, 20, 15, 11, Mb[4]); p.rect(8, 21, 34, 3, Mb[3]); p.hl(10, 10, 30, Gd[2]); p.rect(24, 2, 2, 8, Gd[2]); p.ball(25, 2, 2, 2, [Gd[1], Gd[2], Gd[3], Gd[3]]);
    p.rect(20, 38, 10, 16, D('#5a8ad0')); p.ell(25, 38, 5, 4, D('#5a8ad0')); p.vl(25, 36, 18, D('#3a5aa0')); for (const wx of [10, 34]) { p.rect(wx, 32, 6, 9, D('#8ad0ff')); p.ell(wx + 3, 32, 3, 2, D('#8ad0ff')); p.set(wx + 1, 33, D('#ffffff')); }
    p.outline(D('#3a3a50')); return { c: p.canvas(), ax: 25, ay: 55, light: 1 }; }
  if (kind === 'sk_nido') { const p = new Pix(54, 48), W = pal(['#3a2410', '#6a4420', '#9a6a3a', '#c89a5a', '#f0d090']);
    for (const x of [10, 24, 40]) { p.rect(x, 28, 3, 19, W[1]); p.vl(x + 1, 28, 19, W[2]); }
    p.ell(27, 22, 25, 11, W[1]); for (let k = 0; k < 90; k++) { const a = hash2(k, 1, 7) * 6.28, r = 0.5 + hash2(k, 2, 7) * 0.5, x = Math.round(27 + Math.cos(a) * 24 * r), y = Math.round(22 + Math.sin(a) * 10 * r); p.line(x - 3, y, x + 3, y + (k % 3) - 1, W[2 + (k % 3)]); }
    p.ell(27, 16, 19, 5, W[0]); for (let k = 0; k < 7; k++) p.line(12 + k * 5, 14, 14 + k * 5, 6 - (k % 2) * 3, D(['#ff6a3a', '#2aa0a0', '#ffd040', '#c04aa0'][k % 4])); p.rect(23, 22, 9, 8, D('#2a1408')); p.ell(27, 22, 4, 3, D('#2a1408'));
    p.outline(D('#1a0e06')); return { c: p.canvas(), ax: 27, ay: 47, light: 0 }; }
  if (kind === 'sk_fuente') { const p = new Pix(40, 34), Mb = pal(['#8a8aa0', '#b8b8cc', '#dcdce8', '#f4f4fa']), Wt = pal(['#2a6ab0', '#4a9ae0', '#8ad0ff', '#e0f8ff']);
    p.ell(20, 26, 18, 7, Mb[1]); p.ell(20, 25, 16, 5, Wt[1]); p.ell(20, 24, 14, 3, Wt[2]); p.rect(17, 10, 6, 15, Mb[2]); p.ell(20, 10, 8, 3, Mb[3]); p.ell(20, 9, 6, 2, Wt[2]);
    for (const [x, y] of [[13, 13], [27, 13], [10, 18], [30, 18]]) p.set(x, y, Wt[3]); p.vl(20, 2, 7, Wt[3]); p.set(19, 3, Wt[2]); p.set(21, 4, Wt[2]); p.outline(D('#3a3a50')); return { c: p.canvas(), ax: 20, ay: 33, light: 1 }; }
  if (kind === 'sk_estatua') { const p = new Pix(30, 52), Mb = pal(['#7a7a90', '#a8a8bc', '#d0d0dc', '#f0f0f8']);
    p.rect(7, 42, 16, 9, Mb[1]); p.hl(7, 42, 16, Mb[3]); p.rect(12, 20, 6, 22, Mb[2]); p.ell(15, 16, 4, 4, Mb[2]); p.ell(15, 25, 5, 3, Mb[2]);
    for (const s of [-1, 1]) p.poly([[15 + s * 2, 20], [15 + s * 14, 4], [15 + s * 12, 26]], Mb[3]); p.ell(15, 9, 5, 1.5, D('#ffd040')); p.outline(D('#3a3a50')); return { c: p.canvas(), ax: 15, ay: 51, light: 0 }; }
  if (kind === 'sk_runa') { const p = new Pix(22, 30), S = pal(['#2a2a3a', '#4a4a6a', '#6a6a8a', '#9a9ac0']), g = D('#8af0ff');
    p.poly([[3, 29], [5, 4], [11, 1], [17, 4], [19, 29]], S[1]); p.vl(5, 5, 23, S[2]); p.hl(5, 4, 12, S[3]); for (const [x, y] of [[9, 9], [12, 12], [8, 16], [13, 19], [10, 23]]) { p.set(x, y, g); p.set(x + 1, y, g); p.set(x, y + 1, D('#ffffff')); }
    p.outline(D('#0a0a14')); return { c: p.canvas(), ax: 11, ay: 29, light: 1 }; }
  if (kind.startsWith('sk_crist')) { const col = ['#ff4a6a', '#4ad06a', '#4a8aff', '#ffd040'][+kind.slice(8) || 0], p = new Pix(18, 30), c = pal(['#1a1a2a', col, '#ffffff']);
    p.poly([[9, 0], [16, 12], [12, 26], [6, 26], [2, 12]], c[1]); p.line(9, 1, 9, 24, c[2]); p.set(6, 10, c[2]); p.rect(4, 26, 10, 3, D('#5a5a70')); p.outline(D('#0a0a14')); return { c: p.canvas(), ax: 9, ay: 29, light: 1 }; }
  if (kind === 'sk_podio') { const p = new Pix(46, 26), Mb = pal(['#8a8aa0', '#b8b8cc', '#dcdce8', '#f4f4fa']);
    p.rect(16, 4, 14, 21, Mb[2]); p.rect(2, 10, 14, 15, Mb[1]); p.rect(30, 13, 14, 12, Mb[1]); p.hl(16, 4, 14, Mb[3]); p.set(22, 12, D('#ffd040')); p.set(23, 12, D('#ffd040')); p.set(8, 16, D('#c0c0d0')); p.set(36, 18, D('#c8783a'));
    p.outline(D('#3a3a50')); return { c: p.canvas(), ax: 23, ay: 25, light: 0 }; }
  if (kind === 'sk_arco') { const p = new Pix(40, 46), Gd = pal(['#7a5a0a', '#c8a020', '#ffd040', '#fff0a0']);
    for (let a = 0; a < 6.3; a += 0.05) { const x = Math.round(20 + Math.cos(a) * 17), y = Math.round(22 + Math.sin(a) * 19); p.set(x, y, Gd[2]); p.set(x + 1, y, Gd[1]); } p.rect(18, 40, 4, 6, Gd[0]);
    p.outline(D('#3a2a00')); return { c: p.canvas(), ax: 20, ay: 45, light: 1 }; }
  return _ge(kind); }; }

// ---------- construir los pueblos al crear el mapa del cielo ----------
{ const _mk = makeSky; makeSky = function () { const fresh = !G.maps.cielo, M = _mk(); if (!fresh || M.v429) return M; M.v429 = 1; const I = M.I;
  for (const T_ of CEL_TOWNS) { const [cx, cy] = T_.c, [rx, ry] = T_.r;
    for (let y = cy - ry - 2; y <= cy + ry + 2; y++) for (let x = cx - rx - 3; x <= cx + rx + 3; x++) { if (x < 2 || y < 2 || x >= M.w - 2 || y >= M.h - 2) continue; const d = Math.hypot((x - cx) / rx, (y - cy) / ry) + (hash2(x >> 1, y >> 1, 77) - 0.5) * 0.15; if (d < 1) M.ter[I(x, y)] = T[d < 0.42 ? T_.plaza : T_.ter]; }
    const put = (f, x, y, fp, o) => putNear(M, f, x, y, fp, o);
    if (T_.k === 'cefira') { for (const [x, y] of [[-11, -4], [-4, -6], [5, -6], [11, -3], [-10, 4], [10, 4]]) put('sk_nido', cx + x, cy + y, [[-1, 0], [0, 0], [1, 0]]); put('sk_fuente', cx, cy + 1, [[-1, 0], [0, 0], [1, 0]]); }
    if (T_.k === 'aurelia') { for (const [x, y] of [[-11, -4], [-4, -6], [4, -6], [11, -4], [-12, 4]]) put('sk_casa', cx + x, cy + y, [[-1, 0], [0, 0], [1, 0]]); put('sk_fuente', cx - 3, cy + 1, [[-1, 0], [0, 0], [1, 0]]); put('sk_podio', cx + 8, cy + 5, [[-1, 0], [0, 0], [1, 0]]); put('sk_arco', cx + 4, cy + 1, [[0, 0]], { solid: false }); for (const x of [-7, 7]) put('sk_estatua', cx + x, cy - 1, [[0, 0]]); }
    if (T_.k === 'lumen') { for (const [x, y] of [[-10, -4], [10, -4], [-11, 4], [11, 4]]) put('sk_casa', cx + x, cy + y, [[-1, 0], [0, 0], [1, 0]]); put('sk_estatua', cx, cy - 6, [[0, 0]]);
      [[-4, -2], [4, -2], [4, 3], [-4, 3]].forEach(([x, y], i) => put('sk_crist' + i, cx + x, cy + y, [[0, 0]], { xact: 'memcrys', mi: i })); }
    for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28 + 0.3; put('skycrystal', Math.round(cx + Math.cos(a) * rx * 0.75), Math.round(cy + Math.sin(a) * ry * 0.75), [[0, 0]], { skyc: 900 + k }); }
    put('sk_runa', cx - 2, cy + ry - 3, [[0, 0]], { xact: 'riddle', rid: 'r_' + T_.k });
    CEL_NPC.filter(n => n[1] === T_.k).forEach(([id], k, arr) => { const a = k / arr.length * 6.28 + 0.5; spawnNPC(id, Math.round(cx + Math.cos(a) * rx * 0.45) * 16 + 8, Math.round(cy + Math.sin(a) * ry * 0.45) * 16 + 8, 'cielo', { wander: 2, face: 'down' }); }); }
  SKY_ISLES.forEach((S, k) => putNear(M, 'sk_runa', S.c[0] + 4, S.c[1] + Math.round(S.r * 0.55), [[0, 0]], { xact: 'riddle', rid: 'r_isla' + k }));
  M.chunks = new Map(); M.wdist = null; return M; }; }
// cartel al entrar en un pueblo
function celTown(P) { if (!G.map || G.map.id !== 'cielo') return null; for (const T_ of CEL_TOWNS) if (Math.hypot((P.x / 16 - T_.c[0]) / T_.r[0], (P.y / 16 - T_.c[1]) / T_.r[1]) < 1) return T_; return null; }
V33_TICKS.push(() => { const P = G.P; if (!P || !G.map) return; const t = celTown(P), k = t ? t.k : null; if (k !== (P._celT || null)) { P._celT = k; if (t) banner(t.n, L2('Islas del Cielo', 'Sky Isles')); } });
// los monstruos no entran en los pueblos
{ const _um = updateMob; updateMob = function (m, dt) { if (G.map && G.map.id === 'cielo' && !m.boss && G.P && celTown(G.P) && m.state === 'chase') { m.state = 'return'; } return _um(m, dt); }; }

// ---------- beso francés: más largo, cerca y con las caras a la misma altura en cualquier cuerpo ----------
const FACE_TOP = {};
function atlasHeadTop(A) { if (!A) return 0; const k = A.img && (A.img.src || A.key || A.fw + 'x' + A.fh + ':' + A.idx.idle); if (FACE_TOP[k] !== undefined) return FACE_TOP[k];
  let top = 0; try { const c = document.createElement('canvas'); c.width = A.fw; c.height = A.fh; const x = c.getContext('2d'); x.drawImage(A.img, (A.idx.idle || 0) * A.fw, 0, A.fw, A.fh, 0, 0, A.fw, A.fh); const d = x.getImageData(0, 0, A.fw, A.fh).data;
    outer: for (let y = 0; y < A.fh; y++) for (let xx = 0; xx < A.fw; xx++) if (d[(y * A.fw + xx) * 4 + 3] > 40) { top = A.ay - y; break outer; } } catch (e) { top = 0; }
  FACE_TOP[k] = top; return top; }
function romKiss2(npc) { const k = relKey(npc.id), R = rel(k), P = G.P;
  romScene(npc, 'kiss', () => { const fresh = cdLeft(R, 'ck2', 180) <= 0; if (fresh) { R.ck2 = Date.now(); addRel(k, 8, 30, npc.x, npc.y - 40); } P.z = 0; npc.z = 0;
    for (let i = 0; i < 3; i++) setTimeout(() => burst((G.P.x + npc.x) / 2, npc.y - 26, 14, { sp: 50, up: 60, g: 20, life: 1.2, c: ['#ff4a7a', '#ff9ac0', '#ffffff'] }), i * 200);
    toast(nick(k) + ': ' + pick([L2('Me tiemblan las piernas… ♥', 'My knees are shaking… ♥'), L2('No pares nunca ♥', 'Never stop ♥'), L2('Eso ha sido… otra cosa ♥', 'That was… something else ♥')]), 'loot', 4); });
  const S = SCENE; if (!S) return; S.deep = 1; S.dur = 4.2;
  // se acercan más y el más bajo se pone de puntillas hasta igualar la altura de las caras
  const side = P.x < npc.x ? -1 : 1, px = npc.x + side * 13; if (!blockedFor(G.map, Math.floor(px / 16), Math.floor(npc.y / 16), P.L)) P.x = px;
  const hp = atlasHeadTop(P.atlas) * (P.scale || 1), hn = atlasHeadTop(npc.atlas) * (npc.scale || 1), dh = Math.round(clamp(hp - hn, -8, 8)); S.zP = dh < 0 ? -dh : 0; S.zN = dh > 0 ? dh : 0; }
{ const _us = sceneUpdate; sceneUpdate = function (dt) { const S = SCENE; if (S && S.deep) { const P = G.P, e = S.e, k = Math.min(1, S.t / 0.6); P.z = S.zP * k + Math.sin(S.t * 3) * 0.4; e.z = S.zN * k; if (S.t > S.dur - 0.05) { P.z = 0; e.z = 0; }
    if (Math.random() < 0.08) part((P.x + e.x) / 2 + (Math.random() - 0.5) * 6, Math.min(P.y, e.y) - 28, { vz: 18, life: 0.9, c: '#ff8ab0', s: 2 }); } return _us(dt); }; }
{ const _rm = romanceMenu; romanceMenu = function (npc, msg) { const so = setOpts; setOpts = function (opts) { const k = relKey(npc.id), R = rel(k); const i = opts.findIndex(o => o && typeof o.label === 'string' && /Dar un beso|Give a kiss/.test(o.label));
      if (i >= 0) opts.splice(i + 1, 0, R.a >= 800 && R.t >= 600 ? { label: L2('Beso francés ♥', 'French kiss ♥'), icon: ['heart', '#ff3a6a'], fn: () => romKiss2(npc) } : { label: '<i class="lk">🔒</i> ' + L2('Beso francés', 'French kiss') + ' <small>· ' + L2('Amor 8 y Confianza 6', 'Love 8 and Trust 6') + '</small>', cls: 'locked', fn: () => typeText(L2('Todavía no…', 'Not yet…')) });
      return so.apply(this, arguments); };
    try { return _rm.apply(this, arguments); } finally { setOpts = so; } }; }

// ---------- piedras de acertijos (una pregunta distinta cada día) ----------
const SKY_RIDDLES = [
  [L2('Cuanto más quitas, más grande me hago. ¿Qué soy?', 'The more you take, the bigger I get. What am I?'), [L2('Un agujero', 'A hole'), L2('Una sombra', 'A shadow'), L2('Una nube', 'A cloud')], 0],
  [L2('Tengo alas pero no soy pájaro; tengo plumas pero no vuelo. ¿Qué soy?', 'I have wings but am no bird; feathers but I do not fly. What am I?'), [L2('Una almohada', 'A pillow'), L2('Un molino', 'A windmill'), L2('Un ángel dormido', 'A sleeping angel')], 0],
  [L2('Vuela sin alas, llora sin ojos. ¿Qué es?', 'It flies without wings, cries without eyes. What is it?'), [L2('El viento', 'The wind'), L2('Una nube', 'A cloud'), L2('Una arpía triste', 'A sad harpy')], 1],
  [L2('Todos me pisan y yo a nadie. Todos preguntan por mí y yo por nadie.', 'Everyone treads on me, I tread on no one. Everyone asks for me, I ask for no one.'), [L2('El suelo', 'The floor'), L2('El camino', 'The road'), L2('La alfombra', 'The rug')], 1],
  [L2('Si me nombras, desaparezco. ¿Qué soy?', 'Say my name and I disappear. What am I?'), [L2('El silencio', 'Silence'), L2('Un secreto', 'A secret'), L2('La niebla', 'Fog')], 0],
  [L2('Tiene dientes y no come, tiene cabeza y no es hombre.', 'It has teeth but does not eat, a head but is no man.'), [L2('Un ajo', 'Garlic'), L2('Un peine', 'A comb'), L2('Una llave', 'A key')], 0],
  [L2('Cuanto más seco, más moja. ¿Qué es?', 'The drier it is, the wetter it gets. What is it?'), [L2('Una toalla', 'A towel'), L2('La arena', 'Sand'), L2('Una esponja', 'A sponge')], 0],
  [L2('Brilla de día y de noche se esconde; si lo buscas en el cielo, nunca responde.', 'It shines by day and hides at night; look for it in the sky, it never answers.'), [L2('El sol', 'The sun'), L2('La luna', 'The moon'), L2('Una estrella', 'A star')], 0],
  [L2('Me rompes sin tocarme y sin verme. ¿Qué soy?', 'You break me without touching or seeing me. What am I?'), [L2('Una promesa', 'A promise'), L2('El hielo', 'Ice'), L2('Un espejo', 'A mirror')], 0],
  [L2('Subo y bajo sin moverme del sitio.', 'I go up and down without moving.'), [L2('La escalera', 'The stairs'), L2('La marea', 'The tide'), L2('Un globo', 'A balloon')], 0],
  [L2('Tiene ojos y no ve, tiene agua y no la bebe.', 'It has eyes but cannot see, water but does not drink.'), [L2('Una patata', 'A potato'), L2('Un pozo', 'A well'), L2('Un pez', 'A fish')], 0],
  [L2('Cien hermanas en una casa, todas con la misma cara y ninguna habla.', 'A hundred sisters in one house, all with the same face, none speaks.'), [L2('Las páginas de un libro', 'A book\'s pages'), L2('Las semillas de una granada', 'Pomegranate seeds'), L2('Los dientes', 'Teeth')], 1],
  [L2('Nace en el cielo, vive en la tierra y muere en el mar.', 'Born in the sky, lives on land, dies in the sea.'), [L2('La lluvia', 'Rain'), L2('Un río', 'A river'), L2('Una pluma', 'A feather')], 0],
  [L2('¿Qué cosa cuanto más grande es, menos se ve?', 'What is it that the bigger it gets, the less you see?'), [L2('La oscuridad', 'Darkness'), L2('La niebla', 'Fog'), L2('Un muro', 'A wall')], 0],
];
function riddleOf(o) { const d = calDay(), h = (o.rid || '').split('').reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7); return SKY_RIDDLES[Math.abs(h + d * 7) % SKY_RIDDLES.length]; }
XACT.riddle = [o => { const P = G.P; return (P.ridD || {})[o.rid] === calDay() ? L2('Acertijo resuelto hoy', 'Riddle solved today') : L2('Piedra de acertijos', 'Riddle stone'); }, ['book'], o => {
  const P = G.P; P.ridD = P.ridD || {}; if (P.ridD[o.rid] === calDay()) { toast(L2('Vuelve mañana: la piedra cambia de pregunta cada día', 'Come back tomorrow: the stone changes its question every day'), 'info'); return; }
  const [q, opts, ok] = riddleOf(o), order = [0, 1, 2].sort(() => Math.random() - 0.5);
  openModal(`<h2>${L2('Piedra de acertijos', 'Riddle stone')}</h2><p class="lorep">«${esc(q)}»</p><div class="row wrap">${order.map(i => `<button class="btn" data-rd="${i}">${esc(opts[i])}</button>`).join('')}</div><p class="hint">${L2('Si fallas, la piedra se calla hasta mañana.', 'If you fail, the stone goes quiet until tomorrow.')}</p>`, 'party');
  $$('[data-rd]').forEach(b => b.onclick = () => { closeModal(); P.ridD[o.rid] = calDay(); if (+b.dataset.rd === ok) { const lv = P.lv; P.gold += 5000 + lv * 120; giveItem('celestita', 3); gainXp(Math.round(xpToNext(lv) * 0.04)); P.ridN = (P.ridN || 0) + 1; sfx('quest'); burst(o.px, o.py - 20, 20, { sp: 60, up: 50, g: 40, life: 0.9, c: ['#8af0ff', '#ffffff'] }); toast(L2('¡Correcto! La piedra brilla. +oro, +3 Celestita, +experiencia', 'Correct! The stone glows. +gold, +3 Celestite, +experience'), 'quest', 4); }
    else { sfx('hurt'); toast(L2('La piedra se apaga. Mañana tendrá otra pregunta.', 'The stone dims. Tomorrow it will ask something else.'), 'warn'); } markDirty(); }); }];

// ---------- prueba de la memoria del Oráculo (Lumen): repite el orden en que brillan los cristales ----------
let MEM = null;
function memStart() { closeDialog(); const P = G.P; if (P.memD !== undefined && P.memD === calDay()) { toast(L2('Ya superaste la prueba hoy', 'You already passed the trial today'), 'info'); return; } MEM = { seq: [Math.floor(Math.random() * 4)], pos: 0, show: 0, t: 0, round: 1, flash: [0, 0, 0, 0] }; memShow(); }
function memShow() { MEM.show = 1; MEM.t = 0; MEM.pos = 0; mgHud(`🔮 ${L2('Memoriza', 'Memorize')} · ${L2('Ronda', 'Round')} ${MEM.round}/5`); }
V33_TICKS.push(dt => { if (!MEM) return; dt = dt || 0.016; for (let i = 0; i < 4; i++) MEM.flash[i] = Math.max(0, MEM.flash[i] - dt);
  if (MEM.show) { MEM.t += dt; const step = Math.floor(MEM.t / 0.8); if (MEM.t % 0.8 < dt && step < MEM.seq.length) { MEM.flash[MEM.seq[step]] = 0.55; sfx('cast'); } if (step >= MEM.seq.length) { MEM.show = 0; mgHud(`🔮 ${L2('Toca los cristales en el mismo orden', 'Touch the crystals in the same order')} · ${MEM.pos}/${MEM.seq.length}`); } }
  if (!G.map || G.map.id !== 'cielo' || (G.P && G.P.dead)) { MEM = null; mgHud(null); } });
XACT.memcrys = [() => MEM && !MEM.show ? L2('Tocar el cristal', 'Touch the crystal') : L2('Cristal de la memoria', 'Memory crystal'), ['gem', '#8af0ff'], o => {
  if (!MEM) { toast(L2('Habla con el Oráculo Vespera para empezar la prueba', 'Talk to Oracle Vespera to start the trial'), 'info'); return; } if (MEM.show) return;
  MEM.flash[o.mi] = 0.4; if (MEM.seq[MEM.pos] !== o.mi) { sfx('hurt'); toast(L2('Ese no era. El Oráculo suspira: «Otra vez será».', 'Not that one. The Oracle sighs: "Another time."'), 'warn'); MEM = null; mgHud(null); return; }
  MEM.pos++; sfx('hit'); if (MEM.pos < MEM.seq.length) { mgHud(`🔮 ${MEM.pos}/${MEM.seq.length}`); return; }
  if (MEM.round >= 5) { const P = G.P; P.memD = calDay(); MEM = null; mgHud(null); P.gold += 30000 + P.lv * 200; giveItem('celestita', 8); gainXp(Math.round(xpToNext(P.lv) * 0.12)); sfx('level'); banner(L2('¡Prueba superada!', 'Trial passed!'), L2('El Oráculo te sonríe', 'The Oracle smiles at you')); markDirty(); return; }
  MEM.round++; MEM.seq.push(Math.floor(Math.random() * 4)); setTimeout(() => MEM && memShow(), 600); }];
WORLD_DRAW.push((cx, cy) => { if (!MEM || G.map.id !== 'cielo') return; for (const o of G.map.objs) { if (o.xact !== 'memcrys') continue; const a = MEM.flash[o.mi]; if (a <= 0) continue; ctx.drawImage(glowSprite(26, ['#ff4a6a', '#4ad06a', '#4a8aff', '#ffd040'][o.mi]), Math.round(o.px - cx - 26), Math.round(o.py - cy - 40)); } });

// ---------- Carrera de Ángeles (oficio) ----------
addJob('carrera', L2('Carrera de Ángeles', 'Angel Race'), 'wing', L2('Compite volando por los aros de Aurelia contra los ángeles más rápidos del cielo.', 'Race through the rings of Aurelia against the fastest angels in the sky.'),
  { how: [L2('Habla con el Maestro Zéfiro en Aurelia (Islas del Cielo) y elige «Carrera». Pasa por los aros dorados en orden, dos vueltas. Cuanto mejor quedes, más experiencia.', 'Talk to Master Zephyr in Aurelia (Sky Isles) and choose "Race". Fly through the golden rings in order, two laps. The better you place, the more experience.'), ''], ben: [L2('Más velocidad, esquiva y oro; alas de carreras y títulos.', 'More speed, dodge and gold; racing wings and titles.'), ''],
    find: () => ({ loc: [CEL_TOWNS[1].c[0], CEL_TOWNS[1].c[1] + 2], t: L2('Maestro Zéfiro · Aurelia', 'Master Zephyr · Aurelia'), m: 'cielo' }) },
  [[3, 'En el cielo te mueves un 4 % más rápido', 'Move 4% faster in the sky', { skySpd: 4 }], [6, '+4 % de velocidad en la carrera', '+4% race speed', { raceB: 4 }], [10, '+2 % de esquiva', '+2% dodge', { dodge: 2 }], [15, '+3 % de velocidad en todas partes', '+3% speed everywhere', { spdP: 3 }],
    [20, '+6 % de velocidad en la carrera', '+6% race speed', { raceB: 6 }], [25, '+5 % de oro de los enemigos', '+5% gold from enemies', { goldP: 5 }], [30, 'En el cielo te mueves un 6 % más rápido', 'Move 6% faster in the sky', { skySpd: 6 }],
    [40, '+3 % de esquiva', '+3% dodge', { dodge: 3 }], [50, '+8 % de velocidad en la carrera y premio doble', '+8% race speed and double prize', { raceB: 8, raceP: 1 }], [60, '+4 % de velocidad en todas partes', '+4% speed everywhere', { spdP: 4 }]], ['wing', '#30c070']);
JOB_GUIDE.carrera.how[1] = 'Talk to Master Zephyr in Aurelia (Sky Isles) and choose "Race". Fly through the golden rings in order, two laps.'; JOB_GUIDE.carrera.ben[1] = 'More speed, dodge and gold.';
let RACE = null;
function raceRings() { const [cx, cy] = CEL_TOWNS[1].c, n = 10; return Array.from({ length: n }, (_, i) => { const a = i / n * 6.28 - 1.57; return [(cx + Math.cos(a) * 23 + Math.sin(i * 1.7) * 2) * 16 + 8, (cy + Math.sin(a) * 16) * 16 + 8]; }); }
function raceStart() { closeDialog(); const P = G.P, lv = (P.jobs.carrera || { lv: 1 }).lv; if (RACE) return; const rings = raceRings();
  const [sx, sy] = rings[rings.length - 1]; P.x = sx; P.y = sy + 10; P.mount = null; calcStats(P);
  const racers = ['au_rival1', 'au_rival2', 'au_rival3'].map((id, i) => { const e = { type: 'racer', id, def: NPCS[id], atlas: npcAtlas(id), x: sx + (i - 1) * 16, y: sy - 8 - i * 4, L: 0, map: 'cielo', dir: 'up', anim: 'walk', af: 0, at: 0, z: 6, noShadow: false, name: NPCS[id].n, ri: 0, lap: 0, spd: (82 + lv * 0.9 + i * 4) * (0.95 + Math.random() * 0.1) }; G.ents.push(e); return e; });
  RACE = { rings, ri: 0, lap: 0, racers, t: -3, fin: [], laps: 2 }; banner(L2('¡Carrera de Ángeles!', 'Angel Race!'), L2('Pasa por los aros dorados · 2 vueltas', 'Fly through the golden rings · 2 laps')); calcStats(P); }
function raceEnd(place) { const P = G.P, R = RACE; RACE = null; for (const e of R.racers) e.remove = true; mgHud(null); calcStats(P); if (!place) { toast(L2('Carrera abandonada', 'Race abandoned'), 'warn'); return; }
  const xp = [0, 70, 45, 28, 14][place], dbl = jobPerkSum('raceP') ? 2 : 1, gold = [0, 40000, 22000, 12000, 5000][place] * dbl; gainJobXp('carrera', xp); P.gold += gold; if (place === 1) { giveItem('celestita', 4 * dbl); P.raceW = (P.raceW || 0) + 1; }
  sfx(place === 1 ? 'level' : 'quest'); banner(place === 1 ? L2('¡Primer puesto!', 'First place!') : L2(`Puesto ${place}º`, `Place ${place}`), `+${fmt(gold)} ${L2('oro', 'gold')}`); markDirty(); }
{ const _cs = calcStats; calcStats = function (P) { const r = _cs(P); if (RACE && P === G.P && P.S) P.S.spd *= 1.45 * (1 + jobPerkSum('raceB') / 100); return r; }; }
V33_TICKS.push(dt => { const R = RACE; if (!R) return; dt = dt || 0.016; const P = G.P; if (!G.map || G.map.id !== 'cielo' || P.dead) { raceEnd(0); return; } R.t += dt; const N = R.rings.length;
  if (R.t < 0) { mgHud(`🏁 ${Math.ceil(-R.t)}…`); P.rootT = 0.1; return; }
  if (R.t > 150) { raceEnd(0); return; }
  const [rx, ry] = R.rings[R.ri]; if (dist2(P.x, P.y, rx, ry) < 24 * 24) { R.ri++; sfx('coin'); burst(rx, ry - 10, 10, { sp: 50, up: 30, g: 0, life: 0.5, c: ['#ffd040', '#ffffff'] }); if (R.ri >= N) { R.ri = 0; R.lap++; if (R.lap >= R.laps) { raceEnd(R.fin.length + 1); return; } } }
  for (const e of R.racers) { if (e.done) continue; const [tx, ty] = R.rings[e.ri], dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy); const sp = e.spd * (1 + Math.sin(R.t * 0.7 + e.spd) * 0.08);
    if (L < 10) { e.ri++; if (e.ri >= N) { e.ri = 0; e.lap++; if (e.lap >= R.laps) { e.done = 1; R.fin.push(e); } } } else { e.x += dx / L * sp * dt; e.y += dy / L * sp * dt; e.dir = dirFromVec(dx, dy); } e.z = 6 + Math.sin(R.t * 4 + e.spd) * 2; stepAnim(e, dt, 10); }
  const prog = e => (e.lap * N + e.ri) * 10000 - Math.hypot(R.rings[e.ri][0] - e.x, R.rings[e.ri][1] - e.y), me = prog({ lap: R.lap, ri: R.ri, x: P.x, y: P.y }), pos = 1 + R.racers.filter(e => e.done || prog(e) > me).length;
  mgHud(`🏁 ${L2('Vuelta', 'Lap')} ${R.lap + 1}/${R.laps} · ${L2('Aro', 'Ring')} ${R.ri + 1}/${N} · <b>${pos}º</b> · ${Math.floor(R.t)} s`); });
WORLD_DRAW.push((cx, cy) => { const R = RACE; if (!R) return; R.rings.forEach(([x, y], i) => { const next = i === R.ri, k = next ? 1 + Math.sin(G.t * 8) * 0.12 : 0.85; ctx.strokeStyle = next ? '#ffe070' : 'rgba(255,208,64,0.35)'; ctx.lineWidth = next ? 3 : 2; ctx.beginPath(); ctx.ellipse(Math.round(x - cx), Math.round(y - cy - 14), 9 * k, 15 * k, 0, 0, 7); ctx.stroke(); }); });
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e.type === 'racer') { if (e.map !== G.map.id) return; drawAngelWings(e, cx, cy, false, 1); } return _de(e, cx, cy); }; }

// ---------- Olimpiadas Angelicales (oficio): Tiro celeste y Lluvia de plumas ----------
addJob('olimpiadas', L2('Olimpiadas Angelicales', 'Angelic Olympics'), 'ring', L2('Pruebas diarias de puntería y reflejos en el estadio de Aurelia. Medallas de oro, plata y bronce.', 'Daily aim and reflex events at the Aurelia stadium. Gold, silver and bronze medals.'),
  { how: [L2('Habla con la Árbitra Olimpia en Aurelia. «Tiro celeste»: rompe las dianas que aparecen (30 s). «Lluvia de plumas»: ponte debajo de las plumas que caen (las doradas valen 3).', 'Talk to Referee Olympia in Aurelia. "Celestial Shot": break the targets that appear (30 s). "Feather Rain": stand under falling feathers (gold ones are worth 3).'), ''], ben: [L2('Ataque, crítico, vida y experiencia extra; medallas.', 'Attack, crit, HP and extra experience; medals.'), ''],
    find: () => ({ loc: [CEL_TOWNS[1].c[0] + 6, CEL_TOWNS[1].c[1] + 4], t: L2('Árbitra Olimpia · Aurelia', 'Referee Olympia · Aurelia'), m: 'cielo' }) },
  [[3, '+1 % de crítico', '+1% crit', { crit: 1 }], [6, '+2 % de ataque', '+2% attack', { atkP: 2 }], [10, '+3 % de experiencia', '+3% experience', { xpP: 3 }], [15, '+3 % de vida', '+3% HP', { hpP: 3 }], [20, '+2 s en cada prueba', '+2 s per event', { olyT: 2 }],
    [25, '+2 % de crítico', '+2% crit', { crit: 2 }], [30, '+3 % de ataque', '+3% attack', { atkP: 3 }], [40, '+4 % de experiencia', '+4% experience', { xpP: 4 }], [50, '+4 % de vida y defensa', '+4% HP and defence', { hpP: 4, defP: 4 }], [60, 'Medallas con premio doble', 'Medals give double prize', { olyP: 1 }]], ['ring', 3]);
JOB_GUIDE.olimpiadas.how[1] = 'Talk to Referee Olympia in Aurelia: "Celestial Shot" and "Feather Rain".'; JOB_GUIDE.olimpiadas.ben[1] = 'Attack, crit, HP and extra experience; medals.';
MOBS.diana_celeste = { n: L2('Diana celeste', 'Celestial target'), art: ['bst', 'wisp', ['#7a5a0a', '#d8a820', '#ffe070', '#ffffff'], 0.8], reg: [], lv: [1, 1], hp: 0.05, atk: 0, def: 0, spd: 0, ai: 'passive', drops: [] };
let OLY = null;
function olyStart(ev) { closeDialog(); const P = G.P; if (OLY || RACE) return; P.olyD = P.olyD || {}; if (P.olyD[ev] === calDay()) { toast(L2('Esa prueba ya la hiciste hoy. ¡Vuelve mañana!', 'You already did that event today. Come back tomorrow!'), 'info'); return; }
  const [cx, cy] = CEL_TOWNS[1].c; OLY = { ev, t: -3, dur: 30 + jobPerkSum('olyT'), score: 0, cx: (cx + 6) * 16, cy: (cy + 1) * 16, items: [], sp: 0 }; P.x = OLY.cx; P.y = OLY.cy + 30; banner(ev === 'tiro' ? L2('Tiro celeste', 'Celestial Shot') : L2('Lluvia de plumas', 'Feather Rain'), L2('¡Prepárate!', 'Get ready!')); }
function olyEnd() { const O = OLY, P = G.P; OLY = null; mgHud(null); for (const m of G.ents) if (m.oly) m.remove = true; P.olyD[O.ev] = calDay();
  const th = O.ev === 'tiro' ? [14, 9, 5] : [22, 15, 8], med = O.score >= th[0] ? 1 : O.score >= th[1] ? 2 : O.score >= th[2] ? 3 : 0, dbl = jobPerkSum('olyP') ? 2 : 1;
  const xp = [8, 80, 50, 30][med]; gainJobXp('olimpiadas', xp); const gold = [2000, 35000, 20000, 10000][med] * dbl; P.gold += gold; if (med) { P.medals = P.medals || [0, 0, 0]; P.medals[med - 1]++; if (med === 1) giveItem('celestita', 3 * dbl); }
  sfx(med ? 'level' : 'quest'); banner(med ? [L2('¡Medalla de oro!', 'Gold medal!'), L2('Medalla de plata', 'Silver medal'), L2('Medalla de bronce', 'Bronze medal')][med - 1] : L2('Sin medalla', 'No medal'), `${L2('Puntos', 'Points')}: ${O.score} · +${fmt(gold)} ${L2('oro', 'gold')}`); markDirty(); }
{ const _km = killMob; killMob = function (m) { if (m && m.oly) { m.xp = 0; m.gold = 0; if (OLY) { OLY.score++; floatText(m.x, m.y - 30, '+1', '#ffe070', true); } m.dying = 0.001; m.hp = 0; setAnim(m, 'hurt'); sfx('coin'); burst(m.x, m.y - 10, 10, { sp: 60, up: 30, g: 60, life: 0.5, c: ['#ffe070', '#ffffff'] }); return; } return _km.apply(this, arguments); }; }
V33_TICKS.push(dt => { const O = OLY; if (!O) return; dt = dt || 0.016; const P = G.P; if (!G.map || G.map.id !== 'cielo' || P.dead) { OLY = null; mgHud(null); return; } O.t += dt;
  if (O.t < 0) { mgHud(`🏅 ${Math.ceil(-O.t)}…`); return; } if (O.t >= O.dur) { olyEnd(); return; } mgHud(`🏅 ${L2('Puntos', 'Points')}: <b>${O.score}</b> · ${Math.ceil(O.dur - O.t)} s`);
  O.sp -= dt; if (O.ev === 'tiro') { if (O.sp <= 0) { O.sp = 1.1; const m = spawnMob('diana_celeste', 1, O.cx + (Math.random() - 0.5) * 150, O.cy + (Math.random() - 0.5) * 80, 0, null); if (m) { m.oly = 1; m.state = 'dummy'; m.life = 3; m.z = 8; } }
    for (const m of G.ents) if (m.oly && !m.dying) { m.life -= dt; if (m.life <= 0) m.remove = true; } }
  else { if (O.sp <= 0) { O.sp = 0.55; O.items.push({ x: O.cx + (Math.random() - 0.5) * 170, y: O.cy + (Math.random() - 0.5) * 90, z: 90, g: Math.random() < 0.15 }); }
    for (const f of O.items) { f.z -= 38 * dt; if (f.z < 12 && !f.got && dist2(f.x, f.y, P.x, P.y) < 16 * 16) { f.got = 1; O.score += f.g ? 3 : 1; floatText(f.x, f.y - 20, f.g ? '+3' : '+1', '#ffe070'); sfx('coin'); } } O.items = O.items.filter(f => !f.got && f.z > 0); } });
WORLD_DRAW.push((cx, cy) => { const O = OLY; if (!O || O.ev !== 'plumas') return; for (const f of O.items) { const x = Math.round(f.x - cx), y = Math.round(f.y - cy - f.z), sw = Math.round(Math.sin(G.t * 5 + f.x) * 3);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(Math.round(f.x - cx), Math.round(f.y - cy), 4, 2, 0, 0, 7); ctx.fill(); ctx.fillStyle = f.g ? '#ffd040' : '#ffffff'; ctx.beginPath(); ctx.ellipse(x + sw, y, 2.5, 6, 0.5, 0, 7); ctx.fill(); ctx.fillStyle = f.g ? '#a07a10' : '#a0b0c8'; ctx.fillRect(x + sw, y - 5, 1, 10); } });

// ---------- diálogos de los vecinos de Celestia ----------
DLG_HOOKS.push((npc, opts) => {
  if (npc.id === 'au_zefiro') opts.unshift({ label: L2('Carrera de Ángeles', 'Angel Race') + ` (${L2('Nv.', 'Lv.')} ${(G.P.jobs.carrera || { lv: 1 }).lv})`, icon: ['wing', '#30c070'], fn: raceStart });
  if (npc.id === 'au_olimpia') { opts.unshift({ label: L2('Olimpiadas: Lluvia de plumas', 'Olympics: Feather Rain'), icon: ['ring', 3], fn: () => olyStart('plumas') }); opts.unshift({ label: L2('Olimpiadas: Tiro celeste', 'Olympics: Celestial Shot'), icon: ['ring', 3], fn: () => olyStart('tiro') });
    const m = G.P.medals; if (m) opts.push({ label: `🥇 ${m[0]} · 🥈 ${m[1]} · 🥉 ${m[2]}`, fn: () => typeText(L2('Tus medallas de las Olimpiadas Angelicales.', 'Your Angelic Olympics medals.')) }); }
  if (npc.id === 'lu_vespera') opts.unshift({ label: L2('Prueba de la memoria', 'Memory trial'), icon: ['gem', '#8af0ff'], fn: memStart });
});
// en la lupa: los pueblos del cielo como lugar con flecha
if (typeof SECRETS !== 'undefined') for (const T_ of CEL_TOWNS) SECRETS.push({ id: 'cel_' + T_.k, n: T_.n, done: P => (P.celSeen || []).includes(T_.k), steps: [L2('Un pueblo de las Islas del Cielo. Llega en la aeronave (ingeniera de Puerto Coral, nivel 200) y vuela hasta él.', 'A town on the Sky Isles. Take the airship (engineer in Puerto Coral, level 200) and fly there.')], hints: [], where: () => ({ loc: [T_.c[0], T_.c[1] + 2], m: 'cielo', t: T_.n }), avail: P => P.lv >= 200 });
V33_TICKS.push(() => { const P = G.P; if (!P || !P._celT) return; P.celSeen = P.celSeen || []; if (!P.celSeen.includes(P._celT)) { P.celSeen.push(P._celT); markDirty(); } });
SAVEKEYS.push('ridD', 'ridN', 'memD', 'raceW', 'olyD', 'medals', 'celSeen');
