// ================= v4.24: OFICIOS, DOS PAREJAS, HOMBROS, ESCENA DE LA CAMA Y NOCHEBRUMA =================
// - Herrería: las armas ya no piden nivel de Herrería en ninguna forja (solo nivel del personaje, oro y materiales).
// - Todos los oficios suben 2,5 veces más rápido.
// - Con tu pareja al lado, «Hablar» prefiere al otro personaje que tengas delante (antes siempre salía tu pareja).
// - Hasta dos parejas (P.partner y P.partner2): la que tratas pasa a ser la principal, así boda, casa, ropa e hijos
//   funcionan con cualquiera de las dos. Ilvaine (Velo Roto) entra en todo el sistema y su piel lavanda pasa a los hijos.
// - Llevar a tu pareja sobre los hombros (además de en brazos), visible online.
// - Al decidir tener un hijo, os metéis en la cama y salen corazones (también los ven los demás jugadores).
// - Nochebruma: pueblo dark fantasy nevado en el centro del Velo Roto, sin enemigos, con vecinos que te cuentan su mundo.

// ---------- herrería y oficios ----------
for (const r of RECIPES) if (r.job === 'herreria' && r.cat === 'arma') r.jlv = 1;
const JOB_XPMUL = 2.5;
{ const _g = gainJobXp; gainJobXp = function (job, n, ...a) { return _g(job, Math.max(1, Math.round((n || 0) * JOB_XPMUL)), ...a); }; }

// ---------- hablar con otros aunque tu pareja esté al lado ----------
{ const _it = interactTarget; interactTarget = function () { const t = _it(), P = G.P;
  if (t && t.kind === 'npc' && typeof COMP !== 'undefined' && COMP && t.e === COMP.e && P) { const dv = DIRV[P.dir], fx = P.x + dv[0] * 12, fy = P.y + dv[1] * 10 - 2; let best = null, bd = 34 * 34;
    for (const e of G.ents) if ((e.type === 'npc' || e.type === 'kid') && e !== COMP.e && e.map === P.map && !e.hidden && !e.noTalk) { const d = Math.min(dist2(e.x, e.y, fx, fy), dist2(e.x, e.y, P.x, P.y) * 1.3); if (d < bd) { bd = d; best = e; } }
    if (best) return { kind: 'npc', e: best, label: 'Hablar', icon: 'talk' }; }
  return t; }; }

// ---------- dos parejas ----------
SAVEKEYS.push('partner2');
function swapPartner(k) { const P = G.P; if (!P || !k || P.partner2 !== k) return; P.partner2 = P.partner; P.partner = k; if (typeof ptApply === 'function') try { ptApply(); } catch (e) { } markDirty(); }
{ const _od = openDialog; openDialog = function (npc, ...a) { if (npc && npc.id) swapPartner(relKey(npc.id)); return _od(npc, ...a); }; }
{ const _rm = romanceMenu; romanceMenu = function (npc, msg) { const P = G.P, k = relKey(npc.id); swapPartner(k);
  if (P.partner && P.partner !== k && !P.partner2) { const keep = P.partner; P.partner = null; try { return _rm(npc, msg); } finally { P.partner = keep; } }   // queda un hueco: se puede pedir a otra persona
  return _rm(npc, msg); }; }
{ const _rp = romPropose; romPropose = function (npc) { const P = G.P, k = relKey(npc.id); if (P.partner && P.partner !== k && !P.partner2 && countItem('colgante_amor')) { P.partner2 = P.partner; P.partner = null; } return _rp(npc); }; }
{ const _rb = romBreak; romBreak = function (npc) { const P = G.P, k = relKey(npc.id); swapPartner(k); const r = _rb(npc); if (!P.partner && P.partner2) { P.partner = P.partner2; P.partner2 = null; } markDirty(true); return r; }; }
// la segunda pareja también vive en casa
{ const _mh = makeHome; makeHome = function (id) { const M = _mh(id), P = G.P; if (M && P && P.partner2 && NPCS[P.partner2] && !(typeof COMP !== 'undefined' && COMP && relKey(COMP.e.id) === P.partner2) && !G.ents.some(e => e.type === 'npc' && relKey(e.id) === P.partner2 && e.map === M.id && !e.remove)) spawnNPC(P.partner2, 12 * 16 + 8, 7 * 16 + 12, M.id, { wander: 3 }); return M; }; }
// Ilvaine en la familia: su piel lavanda está disponible para los hijos
if (NPCS.ilvaine && !SKINS.includes(NPCS.ilvaine.look.skin)) SKINS.push(NPCS.ilvaine.look.skin);
// en la lista de relaciones, la segunda pareja también sale marcada
{ const _rr = typeof renderRel === 'function' ? renderRel : null; if (_rr) renderRel = function (B, ...a) { const r = _rr(B, ...a); const P = G.P; if (P && P.partner2 && NPCS[P.partner2]) { for (const b of (B && B.querySelectorAll ? B.querySelectorAll('.relrow b') : [])) if (b.textContent.trim().startsWith(NPCS[P.partner2].n) && !b.querySelector('.pt')) b.insertAdjacentHTML('beforeend', ' <span class="pt">♥ ' + L2('Pareja', 'Partner') + '</span>'); } return r; }; }

// ---------- sobre los hombros ----------
DLG_HOOKS.push((npc, opts) => { const P = G.P, k = relKey(npc.id); if (typeof COMP === 'undefined' || !COMP || COMP.e !== npc || (P.partner !== k && P.spouse !== k && P.partner2 !== k) || COMP.carry) return;
  opts.unshift({ label: L2('Subir a tus hombros', 'Put on your shoulders'), icon: ['heart', '#ff9ac0'], fn: () => { closeDialog && closeDialog(); startCarry(); COMP.carry = 2; toast(nick(k) + L2(' va sobre tus hombros ♥', ' rides on your shoulders ♥'), 'quest'); netPresence(true); } }); });
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); if (typeof carryActive === 'function' && carryActive() && COMP.carry === 2) o.cy = 2; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); r.cyM = pr.cy | 0; }; }
function drawShoulders(e, holder, cx, cy, kissing) { const A = e.atlas; if (!A) return; const dir = holder.dir || 'down', row = DIRI[dir] || 0, col = A.idx.idle || 0, sc = (e.scale || 1) * 0.82, w = A.fw * sc, h = A.fh * sc;
  const x = Math.round(holder.x - cx - A.ax * sc), y = Math.round(holder.y - cy - 27 - A.ay * sc + (holder.anim === 'carryw' ? (holder.af % 2) : 0) - (holder.z || 0));
  atlasBlit(ctx, A, col, row, x, y, Math.round(w), Math.round(h)); if (kissing && Math.random() < 0.3) part(holder.x, holder.y - 40, { vy: -14, life: 0.8, c: '#ff7ab0', s: 1 }); }
{ const _dc = drawCarried; drawCarried = function (e, holder, cx, cy, kissing) { const mode = holder === G.P ? (COMP && COMP.carry) : holder.cyM; if (mode === 2) return drawShoulders(e, holder, cx, cy, kissing); return _dc(e, holder, cx, cy, kissing); }; }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const P = G.P;   // sobre los hombros va siempre por encima, también de espaldas
  if (typeof carryActive === 'function' && carryActive() && COMP.carry === 2 && e === COMP.e) return;
  if (e.type === 'rcomp' && e.carriedBy && e.carriedBy.cyM === 2) return;
  const r = _de(e, cx, cy);
  if (e === P && typeof carryActive === 'function' && carryActive() && COMP.carry === 2 && P.dir === 'up') drawShoulders(COMP.e, P, cx, cy, COMP.kissT > 0);
  if (e.type === 'remote' && e.rcy && e.rcy.carriedBy === e && e.cyM === 2 && e.dir === 'up') drawShoulders(e.rcy, e, cx, cy, e.anim === 'kiss');
  return r; }; }

// ---------- tener un hijo: a la cama y corazones (estilo Sims) ----------
let BED_SC = null;
function bedScene(done) { const P = G.P, M = G.map, bed = M && M.objs.find(o => o.k === 'furn' && (o.f === 'bigbed' || o.f === 'bed') && !o.hidden), pe = G.ents.find(e => e.type === 'npc' && relKey(e.id) === P.partner && e.map === P.map && !e.remove);
  if (!bed) { done(); return; } const s = objSprite(bed), top = bed.py - (s && s.ay || 30), left = bed.px - (s && s.ax || 16), w = s && s.c ? s.c.width : 32;
  BED_SC = { bed, pe, t1: G.t + 3.4, top, left, w, n: 0 }; P.rootT = 3.6; P.busy = 3.6; sfx('quest');
  const tick = () => { if (!BED_SC) return; if (G.t >= BED_SC.t1) { BED_SC = null; done(); return; } NFX_ON++; try { burst(bed.px + (Math.random() - 0.5) * 18, top + 6, 2, { sp: 14, up: 34, g: -22, life: 1.4, c: ['#ff5a8a', '#ffb0c8', '#ffffff'] }); if (Math.random() < 0.5) floatText(bed.px + (Math.random() - 0.5) * 20, top, '♥', '#ff7ab0'); } finally { NFX_ON--; } setTimeout(tick, 280); }; tick(); }
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const S = BED_SC; if (S && (e === G.P || e === S.pe)) { if (e === G.P) drawBedPair(S, cx, cy); return; } return _de(e, cx, cy); }; }
function drawBedPair(S, cx, cy) { const P = G.P, wig = Math.sin(G.t * 9) * 1.5, by = Math.round(S.top + 8 - cy), bx = Math.round(S.bed.px - cx);
  const head = (A, x) => { if (!A) return; const col = A.idx.idle || 0; ctx.drawImage(A.img, col * A.fw, 0, A.fw, Math.round(A.fh * 0.55), Math.round(x - A.fw / 2), by - Math.round(A.fh * 0.36), A.fw, Math.round(A.fh * 0.55)); };
  head(P.atlas, bx - 7); if (S.pe) head(S.pe.atlas, bx + 7);
  ctx.fillStyle = '#c03a5a'; ctx.fillRect(bx - S.w / 2 + 3, by + 2 + Math.round(wig), S.w - 6, 16); ctx.fillStyle = '#e86a8a'; ctx.fillRect(bx - S.w / 2 + 3, by + 2 + Math.round(wig), S.w - 6, 3);
  ctx.fillStyle = '#ffd0dc'; for (let x = bx - S.w / 2 + 6; x < bx + S.w / 2 - 6; x += 6) ctx.fillRect(x, by + 9 + Math.round(wig), 2, 2); }
{ const _of = openFamilyModal; openFamilyModal = function () { const r = _of.apply(this, arguments); const b = $('#famYes'); if (b) { const f = b.onclick; b.onclick = e => { closeModal(); bedScene(() => f && f(e)); }; } return r; }; }

// ---------- Nochebruma: pueblo nevado del Velo Roto ----------
const NB = { c: [124, 82], r: [22, 10] };
const inNieve = P => P && G.map && G.map.id === 'velo_roto' && Math.hypot((P.x / 16 - NB.c[0]) / NB.r[0], (P.y / 16 - NB.c[1]) / NB.r[1]) < 1.05;
const NBV = (o) => LK(Object.assign({ skin: P5(['#3a4470', '#5a6aa0', '#8a98c8', '#b8c4e8', '#e0e8ff']), eyes: 'celeste' }, o));
const NB_NPC = [
  ['nb_farolera', L2('Brumilda', 'Brumilda'), L2('La Farolera', 'The Lamplighter'), NBV({ g: 'f', outfit: 'dress', hairStyle: 'long', hair: HAIRS.blanco, main: P5(['#140a2a', '#24164a', '#3a2470', '#58389a', '#8a64c8']), hat: 'hood', hatC: P5(['#3a0a10', '#6a1420', '#9a2030', '#c83a48', '#f06a70']) }),
    [L2('Aquí siempre es la noche antes de algo bonito. Nunca llega la mañana… pero tampoco llega lo malo.', 'Here it is always the night before something lovely. Morning never comes… but neither does anything bad.'), L2('Enciendo los faroles con fuego de luna. La Luna Sonriente nos dejó en paz a cambio de que nunca apagáramos la luz.', 'I light the lamps with moonfire. The Smiling Moon left us alone as long as we never put the light out.'), L2('Los monstruos no entran en Nochebruma. Dicen que el Vigilante de Piedra los mira y se les olvida a qué venían.', 'Monsters do not enter Nochebruma. They say the Stone Watcher looks at them and they forget why they came.')]],
  ['nb_juguetero', L2('Tobías', 'Tobias'), L2('El Juguetero', 'The Toymaker'), NBV({ outfit: 'apron', hair: HAIRS.gris, beard: HAIRS.gris, main: P5(['#3a0a10', '#6a1420', '#9a2030', '#c83a48', '#f06a70']) }),
    [L2('Hago juguetes con madera de los pinos que cantan. Los niños de aquí no crecen… así que nunca dejan de jugar.', 'I make toys from the singing pines. Children here never grow up… so they never stop playing.'), L2('El trineo de la plaza lo dejó alguien que repartía regalos a mundos que ya no existen. Nadie se atreve a moverlo.', 'Someone who delivered gifts to worlds that no longer exist left the sleigh in the square. No one dares move it.')]],
  ['nb_lisel', 'Lisel', L2('La niña de los copos', 'The snowflake girl'), NBV({ g: 'f', body: 'small', outfit: 'dress', hairStyle: 'long', hair: HAIRS.rubio, main: P5(['#0a1a4a', '#14286e', '#203a98', '#3a5ac0', '#6a8ae8']) }),
    [L2('¿Has visto al Vigilante? Es enorme y tiene ojos blancos. A mí me guiña uno cuando nadie mira.', 'Have you seen the Watcher? It is huge and has white eyes. It winks at me when no one is looking.'), L2('Cada copo de nieve es una carta que alguien no llegó a enviar. Yo las colecciono.', 'Every snowflake is a letter someone never sent. I collect them.')]],
  ['nb_mistral', 'Mistral', L2('Dueño del carrusel', 'Carousel owner'), NBV({ outfit: 'royal', hair: HAIRS.negro, main: P5(['#3a0a10', '#6a1420', '#9a2030', '#c83a48', '#f06a70']), sec: P5(['#0a2a14', '#14482a', '#206a3a', '#3a9a5a', '#6ac88a']) }),
    [L2('El carrusel gira solo cuando alguien en el mundo se acuerda de su infancia. Hoy ha dado tres vueltas.', 'The carousel turns by itself whenever someone in the world remembers their childhood. Today it went round three times.'), L2('Antes del Velo esto era un pueblo normal. La grieta se lo tragó en plena fiesta y nos quedamos así: siempre en fiestas.', 'Before the Veil this was an ordinary town. The tear swallowed it mid-festival and we stayed like this: always celebrating.')]],
  ['nb_monje', L2('Hermano Cirio', 'Brother Taper'), L2('Guardián de las velas', 'Keeper of candles'), NBV({ outfit: 'robe', hat: 'hood', hatC: P5(['#0a0a20', '#141a3a', '#202a58', '#2e3c7a', '#4a5aa0']), main: P5(['#0a0a20', '#141a3a', '#202a58', '#2e3c7a', '#4a5aa0']), hair: HAIRS.negro }),
    [L2('Cada vela de Nochebruma es el nombre de un vecino. Mientras arda, el Velo no puede borrarlo.', 'Every candle in Nochebruma is a neighbour\'s name. While it burns, the Veil cannot erase it.'), L2('Fuera de aquí está la Corrupción. Si te pesa, vuelve: la nieve azul limpia un poco el alma.', 'Outside lies the Corruption. If it weighs on you, come back: the blue snow cleans the soul a little.')]],
  ['nb_ottilia', 'Ottilia', L2('La tejedora', 'The weaver'), NBV({ g: 'f', outfit: 'dress', hairStyle: 'long', hair: HAIRS.rojo, main: P5(['#0a2a14', '#14482a', '#206a3a', '#3a9a5a', '#6ac88a']) }),
    [L2('Tejo mantas de flores rojas para las buhardillas. Abrigan tanto que se sueña en colores.', 'I weave red-flower quilts for the attics. They are so warm you dream in colours.'), L2('Arriba, en los tejados, el cielo tiene estrellas azules pintadas. Las pinté yo, para que nadie se sienta solo de noche.', 'Up on the roofs the sky has painted blue stars. I painted them, so no one feels lonely at night.')]],
];
for (const [id, n, title, look, lines] of NB_NPC) NPCS[id] = { n, title, look, lines, quests: [] };
{ const _mk = makeVelo; makeVelo = function () { const fresh = !G.maps.velo_roto, M = _mk(); if (!fresh || M.nb) return M; M.nb = 1; const I = M.I, [cx, cy] = NB.c, [rx, ry] = NB.r;
  for (let y = cy - ry - 1; y <= cy + ry + 1; y++) for (let x = cx - rx - 1; x <= cx + rx + 1; x++) { const d = Math.hypot((x - cx) / rx, (y - cy) / ry); if (d > 1.05) continue; const i = I(x, y);
    if (M.objAt[i] >= 0) { const o = M.objs[M.objAt[i]]; if (o.k === 'furn' && /^vr_(arbol|lapida|farol|sauce|vela|pino)$/.test(o.f) || o.k === 'grave') hideObj(M, o, true); }
    if (M.ter[i] !== T.COBBLE && M.ter[i] !== T.VOID) M.ter[i] = T.SNOW; if (Math.hypot(x - cx, (y - cy) * 1.4) < 3.2) M.ter[i] = T.COBBLE; }
  const ok = (x, y, fp) => fp.every(([dx, dy]) => { const i = I(x + dx, y + dy); return M.ter[i] === T.SNOW && M.objAt[i] < 0; });
  const put = (f, x, y, fp, o) => { for (let k = 0; k < 12; k++) { const xx = x + [0, 1, -1, 2, -2, 0, 0, 3, -3, 1, -1, 2][k], yy = y + [0, 0, 0, 0, 0, 1, -1, 0, 0, 1, 1, -1][k]; if (ok(xx, yy, fp)) return addObj(M, 'furn', xx, yy, Object.assign({ f, fp }, o || {})); } return null; };
  put('vr_gigante', cx - 18, cy - 9, [[0, 0]]); put('vr_torrenieve', cx - 14, cy - 7, [[0, 0], [1, 0]]);
  for (const [x, y] of [[cx - 15, cy - 3], [cx - 9, cy - 6], [cx + 7, cy - 6], [cx + 14, cy - 4], [cx - 16, cy + 5], [cx + 15, cy + 5], [cx - 9, cy + 8], [cx + 9, cy + 8]]) put('vr_casanieve', x, y, [[-1, 0], [0, 0], [1, 0]]);
  put('vr_arbolnav', cx, cy - 1, [[0, 0]]); put('vr_carrusel', cx + 6, cy + 3, [[-1, 0], [0, 0], [1, 0]]); put('vr_trineo', cx - 6, cy + 3, [[0, 0], [1, 0]]);
  for (let k = 0; k < 10; k++) { const a = k / 10 * 6.28, x = Math.round(cx + Math.cos(a) * rx * 0.55), y = Math.round(cy + Math.sin(a) * ry * 0.6); put('vr_farolesp', x, y, [[0, 0]]); }
  NB_NPC.forEach(([id], k) => { const a = k / NB_NPC.length * 6.28 + 0.4; spawnNPC(id, Math.round(cx + Math.cos(a) * 7) * 16 + 8, Math.round(cy + Math.sin(a) * 4) * 16 + 8, 'velo_roto', { wander: 2, face: 'down' }); });
  M.chunks = new Map(); return M; }; }
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = s => C(s);
  if (kind === 'vr_casanieve') { const p = new Pix(54, 58), St = pal(['#1a1e44', '#2a3068', '#3e488e', '#5a66b4', '#8a96d8']), R = pal(['#2a1a2a', '#3e2a3a', '#5a3e4e']), Sn = pal(['#8a96d8', '#b8c4f0', '#e0e8ff', '#ffffff']);
    p.rect(6, 26, 42, 31, St[1]); for (let y = 27; y < 56; y += 4) for (let x = 6 + ((y >> 2) % 2) * 4; x < 46; x += 8) { p.rect(x, y, 7, 3, St[2 + ((x * 3 + y) % 3 === 0 ? 1 : 0)]); p.hl(x, y, 7, St[3]); }
    p.poly([[2, 28], [27, 3], [52, 28]], R[1]); for (let y = 6; y < 28; y += 3) p.hl(27 - (y - 3), y, (y - 3) * 2, R[2]); p.poly([[1, 27], [27, 1], [53, 27], [48, 27], [27, 7], [6, 27]], Sn[2]); for (let x = 4; x < 51; x += 3) p.set(x, 28 + (x % 2), Sn[1]);
    p.rect(38, 4, 6, 12, St[2]); p.rect(37, 2, 8, 3, Sn[2]);
    for (const wx of [11, 35]) { p.rect(wx, 33, 9, 10, D('#2a1408')); p.rect(wx + 1, 34, 7, 8, D('#ffb040')); p.rect(wx + 2, 35, 2, 3, D('#ffe08a')); p.vl(wx + 4, 34, 8, D('#5a2a10')); p.hl(wx + 1, 38, 7, D('#5a2a10')); p.hl(wx - 1, 43, 11, Sn[2]); }
    p.rect(23, 42, 9, 15, D('#3a1e10')); p.vl(27, 42, 15, D('#2a1408')); p.set(30, 50, D('#ffd040')); p.outline(D('#05040e')); return { c: p.canvas(), ax: 27, ay: 57, light: 1 }; }
  if (kind === 'vr_farolesp') { const p = new Pix(24, 50), I_ = D('#1a1410'), I2 = D('#3a2a1e'); p.rect(6, 14, 3, 35, I_); p.vl(7, 14, 35, I2);
    for (let a = 0; a < 9.5; a += 0.25) { const r = 7 - a * 0.6; p.set(Math.round(14 + Math.cos(a) * r), Math.round(8 + Math.sin(a) * r * 0.9), I_); } p.line(7, 14, 13, 2, I_);
    p.rect(3, 6, 9, 9, D('#2a1e14')); p.rect(4, 7, 7, 7, D('#ffc040')); p.rect(5, 8, 2, 4, D('#fff0a0')); p.poly([[2, 6], [7, 1], [13, 6]], D('#2a1e14'));
    for (let a = 0; a < 6.28; a += 0.35) { const x = Math.round(7 + Math.cos(a) * 6), y = Math.round(28 + Math.sin(a) * 5); p.set(x, y, D(a % 1.05 < 0.35 ? '#d02a3a' : '#1a5a2a')); p.set(x + 1, y, D('#2a7a3a')); }
    p.outline(D('#05040e')); return { c: p.canvas(), ax: 7, ay: 49, light: 1 }; }
  if (kind === 'vr_arbolnav') { const p = new Pix(44, 72); p.rect(19, 62, 6, 9, D('#3a1e10')); p.rect(14, 66, 16, 5, D('#9a1a2a'));
    for (let k = 0; k < 7; k++) { const y = 10 + k * 8, w = 4 + k * 2.6; p.poly([[22, y - 8], [22 - w, y + 8], [22 + w, y + 8]], D(k % 2 ? '#0e2a1a' : '#143a22')); p.hl(Math.round(22 - w + 1), y + 7, Math.round(w * 2 - 1), D('#d0dcff')); }
    for (let k = 0; k < 26; k++) { const y = 10 + Math.floor(hash2(k, 1, 5) * 54), w = 3 + (y - 10) * 0.32, x = Math.round(22 + (hash2(k, 2, 5) - 0.5) * 2 * w); p.set(x, y, D(['#ff3a4a', '#ffd040', '#5aa0ff', '#ff8ad0'][k % 4])); }
    p.poly([[22, 0], [24, 4], [28, 4], [25, 7], [26, 11], [22, 8], [18, 11], [19, 7], [16, 4], [20, 4]], D('#ffd040')); p.set(22, 5, D('#fff8c0')); p.outline(D('#05040e')); return { c: p.canvas(), ax: 22, ay: 71, light: 1 }; }
  if (kind === 'vr_carrusel') { const p = new Pix(60, 54), R = pal(['#5a0a14', '#8a1420', '#c02a34', '#e8505a']), Gr = D('#1a5a2a');
    p.ell(30, 47, 28, 6, D('#3a1e10')); p.ell(30, 46, 26, 4.5, R[2]); for (const x of [8, 18, 30, 42, 52]) p.rect(x, 18, 2, 28, D('#d8b060'));
    for (const [x, c] of [[14, '#e8e0ff'], [36, '#3a2a1a']]) { p.ell(x, 34, 5, 3, D(c)); p.rect(x - 4, 36, 2, 5, D(c)); p.rect(x + 3, 36, 2, 5, D(c)); p.rect(x + 3, 30, 3, 4, D(c)); }
    p.poly([[4, 18], [30, 4], [56, 18]], R[1]); p.ell(30, 18, 27, 4, R[2]); for (let x = 5; x < 56; x += 4) { p.set(x, 21, Gr); p.set(x + 1, 22, Gr); p.set(x + 2, 21, D('#ffd040')); }
    p.rect(29, 0, 2, 5, D('#d8b060')); p.outline(D('#05040e')); return { c: p.canvas(), ax: 30, ay: 52, light: 1 }; }
  if (kind === 'vr_trineo') { const p = new Pix(44, 30), R = pal(['#5a0a14', '#8a1420', '#c02a34', '#e8505a']), W_ = D('#7a3a1e');
    p.rect(8, 10, 28, 12, R[1]); p.hl(8, 10, 28, R[3]); p.rect(9, 12, 26, 2, R[2]); for (let a = 0; a < 5; a += 0.3) p.set(Math.round(38 + Math.cos(a) * 4), Math.round(8 + Math.sin(a) * 4), W_);
    p.hl(4, 26, 38, W_); p.hl(4, 27, 38, D('#4a2410')); for (const x of [10, 22, 34]) p.vl(x, 22, 4, W_); for (let a = 2; a < 6; a += 0.3) p.set(Math.round(5 + Math.cos(a) * 3), Math.round(23 + Math.sin(a) * 3), W_);
    p.rect(12, 3, 8, 7, D('#c02a34')); p.vl(16, 3, 7, D('#2a8a3a')); p.rect(21, 5, 9, 5, D('#2a8a3a')); p.vl(25, 5, 5, D('#ffd040')); p.rect(3, 12, 3, 4, D('#ffd040')); p.outline(D('#05040e')); return { c: p.canvas(), ax: 22, ay: 29, light: 1 }; }
  if (kind === 'vr_torrenieve') { const p = new Pix(36, 110), S = pal(['#1a1e44', '#2a3068', '#3e488e', '#5a66b4', '#8a96d8']); p.rect(4, 24, 28, 85, S[1]); for (let y = 26; y < 108; y += 5) for (let x = 4 + ((y / 5) % 2 ? 0 : 4); x < 30; x += 8) { p.rect(x, y, 7, 4, S[2]); p.hl(x, y, 7, S[3]); }
    p.poly([[1, 25], [18, 2], [35, 25]], D('#2a2a4a')); p.poly([[1, 25], [18, 2], [35, 25], [30, 25], [18, 8], [6, 25]], D('#e0e8ff')); for (const y of [40, 66]) { p.rect(14, y, 7, 10, D('#2a1408')); p.rect(15, y + 1, 5, 8, D('#ffb040')); } p.outline(D('#05040e')); return { c: p.canvas(), ax: 18, ay: 109, light: 1 }; }
  if (kind === 'vr_gigante') { const p = new Pix(110, 170), Sk = pal(['#06081a', '#0e1430', '#182448', '#22345e']), V = D('#3a5aff'), V2 = D('#8aa0ff');
    p.ell(60, 70, 34, 46, Sk[1]); p.rect(30, 90, 60, 80, Sk[1]); for (const [x, h] of [[8, 70], [20, 86], [32, 80]]) { p.rect(x, 170 - h - 40, 9, h, Sk[1]); p.ell(x + 4, 170 - h - 40, 5, 6, Sk[1]); }
    for (let k = 0; k < 900; k++) { const x = Math.floor(hash2(k, 1, 3) * 110), y = Math.floor(hash2(k, 2, 3) * 170); if (uA(p.get(x, y)) && hash2(x >> 2, y >> 2, 4) < 0.5) p.set(x, y, Sk[2 + (k % 2)]); }
    let x = 60, y = 30; for (let k = 0; k < 420; k++) { x += Math.round((hash2(k, 7, 9) - 0.5) * 3); y += Math.round((hash2(k, 8, 9) - 0.4) * 3); if (x < 5 || x > 105 || y > 165 || y < 5) { x = 20 + (k * 37) % 70; y = 20 + (k * 53) % 140; } if (uA(p.get(x, y))) { p.set(x, y, V); if (k % 3 === 0) p.set(x + 1, y, V2); } }
    for (const s of [-1, 1]) { p.ell(60 + s * 15, 62, 9, 5, D('#e8ecff')); p.ell(60 + s * 15, 63, 3, 4, D('#0a0a14')); p.set(60 + s * 15 - 1, 61, D('#ffffff')); p.hl(60 + s * 15 - 10, 56, 20, Sk[0]); }
    p.ell(60, 88, 11, 4, D('#1a1830')); p.hl(50, 88, 21, D('#0a0814')); p.outline(D('#020308')); return { c: p.canvas(), ax: 60, ay: 169 }; }
  return _ge(kind); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl(M, cx, cy, list); for (const d of list) if (d.k === 'furn' && !d.hidden && /^vr_(casanieve|farolesp|arbolnav|carrusel|torrenieve|trineo)$/.test(d.f)) out.push({ x: d.px, y: d.py - (d.f === 'vr_farolesp' ? 40 : d.f === 'vr_torrenieve' ? 60 : 20), r: d.f === 'vr_casanieve' ? 46 : 36, c: 'rgba(255,190,90,0.5)' }); return out; }; }
// sin enemigos: los monstruos no te persiguen dentro del pueblo
{ const _um = updateMob; updateMob = function (m, dt) { if (inNieve(G.P) && !m.boss) { const ps = G.pSafe; G.pSafe = true; try { return _um(m, dt); } finally { G.pSafe = ps; } } return _um(m, dt); }; }
SAVEKEYS.push('nbSeen');
V33_TICKS.push(dt => { const P = G.P; if (!P || !G.map) return; const inn = inNieve(P); if (inn !== !!P.nbIn) { P.nbIn = inn; if (inn) { banner('Nochebruma', L2('El pueblo de la nieve azul · aquí nadie ataca', 'The town of blue snow · no one attacks here')); if (!P.nbSeen) { P.nbSeen = 1; markDirty(); } } } });
{ const _vs = vrSky; vrSky = function (M, cx, cy) { _vs(M, cx, cy); if (!inNieve(G.P)) return; ctx.fillStyle = 'rgba(30,50,210,0.26)'; ctx.fillRect(0, 0, VW, VH);
  const H = Math.round(VH * 0.26), mx = VW * 0.28, my = H * 0.5, r = H * 0.3, g = ctx.createRadialGradient(mx, my, 2, mx, my, r * 2.2); g.addColorStop(0, 'rgba(200,210,255,0.5)'); g.addColorStop(1, 'rgba(120,140,255,0)'); ctx.fillStyle = g; ctx.fillRect(mx - r * 2.2, my - r * 2.2, r * 4.4, r * 4.4);
  ctx.fillStyle = '#c8d0ff'; ctx.beginPath(); ctx.arc(mx, my, r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(120,130,220,0.5)'; for (const [dx, dy, rr] of [[-0.3, -0.2, 0.2], [0.25, 0.1, 0.15], [-0.05, 0.35, 0.12]]) { ctx.beginPath(); ctx.arc(mx + dx * r, my + dy * r, rr * r, 0, 7); ctx.fill(); }
  if (!(OPT && OPT.on)) for (let k = 0; k < 3; k++) part(cx + Math.random() * VW, cy - 10 + Math.random() * 20, { vy: 22 + Math.random() * 14, vx: (Math.random() - 0.5) * 10, vz: 0, life: VH / 26, c: Math.random() < 0.7 ? '#ffffff' : '#c0d0ff', s: 1 }); }; }
// el Vigilante de Piedra se puede mirar
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && M.nb && inNieve(P) && !P.dead) { const o = M.objs.find(o => o.k === 'furn' && o.f === 'vr_gigante' && !o.hidden); if (o && Math.hypot(o.px - P.x, o.py - P.y) < 48) return { kind: 'nb_gig', o, label: L2('Mirar al Vigilante', 'Look at the Watcher'), icon: 'talk' }; } return _it(); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(); if (!t || t.kind !== 'nb_gig') return _di(); typeText(L2('Un gigante de piedra con venas de luz azul asoma por detrás de la torre. Te mira sin parpadear. Por un momento olvidas a qué habías venido… y te sientes a salvo.', 'A stone giant with veins of blue light peers from behind the tower. It looks at you without blinking. For a moment you forget why you came… and you feel safe.')); if (typeof G.P.vrCor === 'number') { G.P.vrCor = Math.max(0, G.P.vrCor - 15); toast(L2('El Vigilante te quita un poco de corrupción', 'The Watcher takes away a little corruption'), 'info', 3); } }; }
// en la guía: Nochebruma como lugar secreto, con flecha
if (typeof SECRETS !== 'undefined') { const S = { id: 'nochebruma', n: L2('Nochebruma, el pueblo de la nieve azul', 'Nochebruma, the town of blue snow'), done: P => !!P.nbSeen, steps: [L2('Un pueblo nevado al norte de la entrada del Velo Roto. Allí no te ataca nadie y sus vecinos te cuentan cómo es su mundo.', 'A snowy town north of the Broken Veil entrance. No one attacks you there and its people tell you about their world.'), L2('Mira al Vigilante de Piedra (detrás de la torre): te quita un poco de corrupción.', 'Look at the Stone Watcher (behind the tower): it takes away a little corruption.')], hints: [], where: () => ({ loc: [NB.c[0], NB.c[1] + 4], m: 'velo_roto', t: 'Nochebruma' }), avail: P => !!P.vrPortal };
  SECRETS.splice(1, 0, S); if (typeof SEC_ORDER !== 'undefined') SEC_ORDER.splice(1, 0, 'nochebruma'); }
