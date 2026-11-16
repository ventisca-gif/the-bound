// ================= v4.75: LIENYA, LA DIOSA SIN PINTAR =================
// Descubrimiento de Las Tierras sin Pintar con el dibujo de Sergio (tools/dev/diosa.py → 6zz9s_diosa_data.js).
// 1) Te vigila: mientras recorres el borde aparece a lo lejos con su forma de persona (sprite de héroe del juego), te mira
//    y se desvanece si te acercas. 2) Tras vencer al Lienzo en Blanco te espera junto a la puerta de luz: «La que observa».
// 3) Revela su forma verdadera (jefe de nivel 410, súper jefe muy difícil) con sus 5 ataques: Ráfaga del Vacío, Círculo de
//    Olvido, Tentáculos Incoloros, Lluvia Sin Color y Desvanecer. 4) Al vencerla, el silencio la suelta: te enseña el oficio
//    de Artista (pintar el borde en los caballetes), se queda contigo y se puede conquistar (romance y boda).
// Lore: la Ventisca la dibujó para cuidar el borde y no la terminó; en lo que quedó sin pintar se metió el silencio de Nihil.
SAVEKEYS.push('lny');
function lny() { const P = G.P; P.lny = P.lny || { st: 0, seen: 0 }; return P.lny; }

// ---------- forma verdadera (jefe) y efectos ----------
const LNY = { cv: null, fx: null };
{ const [fw, fh] = LNY_SIZE, c = mkCanvas(fw * 10, fh * 4); LNY.cv = c; const im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = LNY_SHEET; }
{ const [cw, ch] = LNY_FXSIZE, c = mkCanvas(cw * 4, ch * LNY_FXN.length); LNY.fx = c; const im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = LNY_FX; }
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'lny') return getAtlas('Mlny', () => { const [fw, fh] = LNY_SIZE; return { img: LNY.cv, fw, fh, idx: { idle: 0, walk: 2, atk: 6, hurt: 9 }, ax: fw >> 1, ay: fh - 4 }; }); return _ma(art); }; }
BOSSES.lienya = { n: L2('Lienya, la Diosa sin Pintar', 'Lienya, the Unpainted Goddess'), lv: 410, art: ['lny'], scale: 1, fly: 1, hp: 44, atk: 3.25, def: 3.2, spd: 46, moves: ['blink', 'summon'], minion: 'tsp_fantasma', drops: [['pigmento_puro', 1, 12], ['tinta_viva', 1, 20]], r: 40 };
it('trofeo_lienya', { n: L2('Trofeo: ', 'Trophy: ') + BOSSES.lienya.n, t: 'mat', stack: true, tier: 1, price: 50, troph: 'lienya', icon: ['trophy', '#e0c0ff'], rar: 3, d: L2('Expónlo en el museo de tu casa (Vitrina o Pedestal).', 'Display it in your house museum (Display case or Pedestal).') });
const LFX = [];   // efectos {r, f (fotogramas), x, y, t0, dur, s, flip}
function lfxAdd(name, x, y, dur, s, flip) { const r = LNY_FXN.indexOf(name); if (r >= 0) LFX.push({ r, f: LNY_FXC[r], x, y, t0: G.t, dur, s: s || 1, flip }); }
const LHZ = [];   // zonas {x, y, r, ts, t0, dmg, root, fx, fs}
function lhzAdd(x, y, r, warn, dmg, o) { LHZ.push(Object.assign({ x, y, r, ts: G.t, t0: G.t + warn, dmg }, o || {})); }
WORLD_DRAW.push((cx, cy) => { if (!LFX.length && !LHZ.length) return; const [cw, ch] = LNY_FXSIZE;
  for (const h of LHZ) { const k = Math.min(1, (G.t - h.ts) / Math.max(0.01, h.t0 - h.ts)), x = h.x - cx, y = h.y - cy; ctx.save(); ctx.globalAlpha = 0.22 + 0.35 * k; ctx.fillStyle = '#b070ff'; ctx.beginPath(); ctx.ellipse(x, y, h.r, h.r * 0.72, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 0.9; ctx.strokeStyle = k > 0.75 ? '#ffffff' : '#d8b0ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, h.r * k, h.r * 0.72 * k, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  for (let i = LFX.length - 1; i >= 0; i--) { const f = LFX[i], t = (G.t - f.t0) / f.dur; if (t >= 1) { LFX.splice(i, 1); continue; } const fr = Math.min(f.f - 1, Math.floor(t * f.f)), w = cw * f.s, h = ch * f.s;
    ctx.save(); ctx.imageSmoothingEnabled = false; if (t > 0.8) ctx.globalAlpha = (1 - t) / 0.2; ctx.translate(Math.round(f.x - cx), Math.round(f.y - cy)); if (f.flip) ctx.scale(-1, 1); ctx.drawImage(LNY.fx, fr * cw, f.r * ch, cw, ch, Math.round(-w / 2), Math.round(-h + 4 * f.s), Math.round(w), Math.round(h)); ctx.restore(); } });
function lienyaBoss() { return G.ents.find(e => e.type === 'mob' && e.mid === 'lienya' && !e.dying && e.map === (G.map && G.map.id)); }
V33_TICKS.push(() => { const P = G.P; if (!P || !LHZ.length) return; if (!lienyaBoss()) { LHZ.length = 0; return; }
  for (let i = LHZ.length - 1; i >= 0; i--) { const h = LHZ[i]; if (G.t < h.t0) continue; LHZ.splice(i, 1); if (h.fx) lfxAdd(h.fx, h.x, h.y + h.r * 0.3, 0.7, h.fs || 1.2);
    const d = Math.hypot(P.x - h.x, (P.y - h.y) * 1.3); if (d < h.r && !P.dead && !(P.ifr > 0)) { hurtPlayer(P.S.maxhp * h.dmg, { lv: 410 }); if (h.root) { P.rootT = h.root; floatText(P.x, P.y - 44, L2('¡ATRAPADO! Rueda', 'TRAPPED! Roll'), '#d8b0ff'); } } } });
const LNY_ATK = {
  rafaga: [L2('Ráfaga del Vacío: sal de la línea', 'Void Burst: get out of the line'), (m, P) => { const a = Math.atan2(P.y - m.y, P.x - m.x); for (let k = 1; k <= 9; k++) lhzAdd(m.x + Math.cos(a) * k * 24, m.y + Math.sin(a) * k * 18, 16, 0.8 + k * 0.05, 0.16); setTimeout(() => lfxAdd('rafaga', (m.x + P.x) / 2, (m.y + P.y) / 2 + 10, 0.6, 1.6, P.x < m.x), 800); }],
  circulo: [L2('Círculo de Olvido: aléjate del círculo', 'Circle of Oblivion: get away from the circle'), (m, P) => { lfxAdd('circulo', P.x, P.y + 16, 1.4, 1.4); lhzAdd(P.x, P.y, 52, 1.3, 0.24); }],
  tentaculos: [L2('Tentáculos Incoloros: ¡rueda si te atrapan!', 'Colourless Tentacles: roll if they grab you!'), (m, P) => { for (let k = 0; k < 4; k++) { const a = k / 4 * 6.28 + Math.random(); lhzAdd(P.x + Math.cos(a) * (k ? 40 : 0), P.y + Math.sin(a) * (k ? 30 : 0), 20, 1.0 + k * 0.15, 0.1, { root: 1.6, fx: 'tentaculos', fs: 1 }); } }],
  lluvia: [L2('Lluvia Sin Color', 'Colourless Rain'), (m, P) => { for (let k = 0; k < 11; k++) lhzAdd(P.x + (Math.random() - 0.5) * (k ? 170 : 6), P.y + (Math.random() - 0.5) * (k ? 110 : 4), 15, 0.8 + k * 0.1, 0.1, { fx: 'lluvia', fs: 0.8 }); }],
  desvanecer: [L2('¡Desvanecer! Se esconde y estalla: aléjate o rueda al final', 'Vanish! She hides and bursts: get away or roll at the end'), (m, P) => { m.invuln = 1; m.lnyHide = G.t + 1.6; lfxAdd('desvanecer', m.x, m.y + 20, 1.6, 2.4); lhzAdd(m.x, m.y, 130, 1.6, 0.3); setTimeout(() => { m.invuln = 0; }, 1650); }],
};
let LNY_NEXT = '';
function lnyPick(m) { const ph = m.hp / m.maxhp, pool = ph > 0.5 ? ['rafaga', 'circulo', 'lluvia', 'tentaculos'] : ['rafaga', 'circulo', 'lluvia', 'tentaculos', 'desvanecer', 'desvanecer']; let k = pick(pool); if (k === m.lnyLast) k = pick(pool); m.lnyLast = k; return k; }
BMECH.lienya = { every: 5, get name() { const m = lienyaBoss(); LNY_NEXT = m ? lnyPick(m) : 'rafaga'; return LNY_ATK[LNY_NEXT][0]; }, fn: (m, P) => { const ph = m.hp / m.maxhp;
  if (ph < 0.5 && !m.lP2) { m.lP2 = 1; banner(L2('El silencio se rompe', 'The silence breaks'), L2('Lienya se desvanece y ataca más rápido', 'Lienya vanishes and attacks faster')); }
  if (ph < 0.2 && !m.lP3) { m.lP3 = 1; banner(L2('Sin color', 'Colourless'), L2('Combina sus ataques. ¡Aguanta, casi está libre!', 'She combines her attacks. Hold on, she\'s almost free!')); }
  const a = LNY_NEXT || lnyPick(m); setAnim(m, 'atk'); try { LNY_ATK[a][1](m, P); } catch (e) { }
  if (m.lP3) { const b = lnyPick(m); if (b !== a) setTimeout(() => { if (!m.dying && !G.P.dead) try { LNY_ATK[b][1](m, G.P); } catch (e) { } }, 1300); }
  if (m.lP2 && Math.random() < 0.3) tspMinions(m, 'tsp_fantasma', 2);
  m.mech = m.lP3 ? 1.6 : m.lP2 ? 1.0 : 0; } };
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (e && e.mid === 'lienya' && e.lnyHide > G.t) { ctx.save(); ctx.globalAlpha = 0.15; try { return _de.apply(this, arguments); } finally { ctx.restore(); } } return _de.apply(this, arguments); }; }
SUPER_BOSS.lienya = -1;

// ---------- forma de persona (sprite de héroe del juego) ----------
const LNY_SKIN = P5(['#120a18', '#1e1226', '#2c1c36', '#3c284a', '#50385e']), LNY_HAIR = P5(['#8a78b8', '#b8a8e0', '#dccff4', '#f4eeff', '#ffffff']), LNY_FEA = P5(['#5a3a8a', '#8a68c0', '#b89ce4', '#e0d0fa', '#ffffff']), LNY_SW = C('#7ad8ff');
fitKind('body', 'lny_pluma', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, legTop, base } = A, R = tx0 + tw - 1, F = LNY_FEA;
  for (let x = tx0 - 2; x <= R + 2; x++) { const j = (x * 7) % 3; p.set(x, ty - 1 + (j ? 1 : 0), F[3 + (x & 1)]); p.set(x, ty + 1, F[2 + (j % 2)]); if (j === 2) p.set(x, ty + 2, F[2]); }   // cuello de plumas
  if (!side) for (const sx of [tx0 - 1, R + 1]) { p.set(sx, ty + 3, LNY_SW); p.set(sx, ty + 5, LNY_SW); }   // espirales azules en los hombros
  p.hl(tx0, ty + th - 2, tw, F[3]); if (!up && !side) { p.set(cx - 1, ty + th - 2, C('#b070ff')); p.set(cx, ty + th - 2, C('#e0c0ff')); }   // cinturón con gema
  const y1 = Math.min(base - 1, legTop + 9); for (let y = ty + th - 1; y < y1; y++) for (let x = tx0 - 1; x <= R + 1; x++) { if (side && (x - cx) * A.d > 1) continue; const jag = (x * 5 + y * 3) % 4; if (y > legTop + 4 && jag === 0) continue; const edge = y >= y1 - 3 || x <= tx0 || x >= R; p.set(x, y, edge ? F[(x + y) % 2 + 2] : LNY_SKIN[(x + y) % 3 + 1]); } });   // falda de plumas
function lnyLook() { const app = normApp({ g: 'f', hs: 1, hair: 'blanco', eyes: 'violeta', skin: 0 }); const L = heroLook('mago', app, { weapon: 0 }, {}, {});
  L.skin = LNY_SKIN; L.hair = LNY_HAIR; L.top = { k: 'lny_pluma', m: LNY_SKIN, s: LNY_FEA }; L.bot = { k: 'skirt', m: LNY_SKIN, s: LNY_FEA }; L.eyes = 'blanco'; L.feet = { k: 'shoes', m: LNY_SKIN }; L.head = null; L.weapon = null; L.back = { k: 'cape', o: LNY_FEA, i: P5(['#2a1a40', '#3a2458', '#4a3070', '#5a3c88', '#6a48a0']), tr: LNY_FEA }; return L; }
// forma de persona: su propio dibujo reducido (tools/dev/diosa.py), 6 columnas (reposo 2, caminata 4) x 4 direcciones
const LNY_PCV = (() => { const [pw, ph] = LNY_PSIZE, c = mkCanvas(pw * 6, ph * 4), im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = LNY_PSHEET; return c; })();
function lnyAtlas() { return getAtlas('npc_lienya2', () => { const [pw, ph] = LNY_PSIZE; return { img: LNY_PCV, fw: pw, fh: ph, idx: { idle: 0, walk: 2 }, ax: pw >> 1, ay: ph - 3 }; }); }
NPCS.lienya = { n: 'Lienya', title: L2('La Diosa sin Pintar', 'The Unpainted Goddess'), look: LK({ hair: HAIRS.blanco, hairStyle: 'long', outfit: 'dress', main: LNY_FEA, g: 'f' }), lines: [] };
Object.defineProperty(NPCS.lienya, 'lines', { get() { const S = lny(), P = G.P; if (S.st < 2) return [L2('…', '…'), L2('Llevas color encima. Hace mucho que nadie traía color hasta aquí.', 'You carry colour. It\'s been so long since anyone brought colour this far.')];
  const L = [L2('La Ventisca me dibujó para cuidar el borde… y se fue sin terminarme. Tú me has terminado un poco.', 'The Ventisca drew me to watch over the border… and left without finishing me. You\'ve finished me a little.'), L2('Pinta conmigo. Cada trazo es un trozo de mundo que vuelve.', 'Paint with me. Every stroke is a piece of the world coming back.'), L2('¿Sabes lo raro que es ver colores después de tanto silencio? Gracias.', 'Do you know how strange it is to see colours after so much silence? Thank you.')];
  if (P && P.partner === 'lienya') L.push(L2('Antes solo te miraba de lejos. Ahora no te quito los ojos de encima… por otros motivos.', 'I used to watch you from afar. Now I can\'t take my eyes off you… for other reasons.')); return L; } });
{ const _na = npcAtlas; npcAtlas = function (id) { if (id === 'lienya') return lnyAtlas(); return _na.apply(this, arguments); }; }
ROM.lienya = { g: 'f', loves: ['gem', 'crystal', 'bouquet'], likes: ['cloth', 'cake', 'potion'], hates: ['bone', 'fish'], taste: L2('los colores: gemas, cristales y flores', 'colours: gems, crystals and flowers') };
if (typeof ROM_WHERE !== 'undefined') ROM_WHERE.lienya = L2('Las Tierras sin Pintar (junto a Mael, después de vencerla)', 'The Unpainted Lands (next to Mael, after defeating her)');
if (typeof WED_SPOUSE_LINES !== 'undefined') WED_SPOUSE_LINES.lienya = L2('¡Lienya, la Diosa sin Pintar, se casa! Esa noche el borde entero se llenó de color.', 'Lienya, the Unpainted Goddess, is getting married! That night the whole border filled with colour.');

// ---------- 1) te vigila a lo lejos ----------
let LNY_W = null;   // {e, until}
V33_TICKS.push(() => { const P = G.P, M = G.map; if (!P || !M) return; const S = lny();
  if (!M.tsp || S.st >= 1 || P.dead) { if (LNY_W) { LNY_W.e.remove = true; LNY_W = null; } return; }
  if (LNY_W) { const e = LNY_W.e, d = Math.hypot(P.x - e.x, P.y - e.y); e.dir = dirFromVec(P.x - e.x, P.y - e.y);
    if (d < 60 || G.t > LNY_W.until) { burst(e.x, e.y - 14, 16, { sp: 40, up: 40, g: -10, life: 0.8, c: ['#ffffff', '#d8c0ff'] }); if (d < 60) toast(L2('Se desvanece en cuanto te acercas…', 'She vanishes as soon as you get close…'), 'info', 2.5); e.remove = true; LNY_W = null; S.nextW = G.t + 25 + Math.random() * 25; } return; }
  if (G.t < (S.nextW || 0)) return; S.nextW = G.t + 30; if (Math.random() < 0.5) return;
  const a = Math.random() * 6.28, x = P.x + Math.cos(a) * 190, y = P.y + Math.sin(a) * 130, i = tileAt(M, Math.floor(x / 16), Math.floor(y / 16)); if (i < 0 || M.ter[i] === T.VOID) return;
  const e = spawnNPC('lienya', x, y, M.id, { face: 'down' }); if (!e) return; e.noTalk = 1; LNY_W = { e, until: G.t + 9 }; S.seen = (S.seen || 0) + 1; markDirty();
  toast(S.seen === 1 ? L2('Alguien te observa desde lejos…', 'Someone is watching you from afar…') : L2('Ella vuelve a mirarte…', 'She is watching you again…'), 'quest', 3); });
// ---------- 2) tras el Lienzo en Blanco, te espera junto a la puerta de luz ----------
{ const _mk = makeSinPintar; makeSinPintar = function () { const M = _mk.apply(this, arguments); setTimeout(lnyPlace, 50); return M; }; }
function lnyPlace() { const P = G.P, M = G.maps.sin_pintar, S = lny(); if (!P || !M) return; if (G.ents.some(e => e.id === 'lienya' && !e.remove && !e.noTalk)) return;
  const done = P.quests && P.quests.done && P.quests.done.tsp5; if (!done && S.st < 2) return;
  const Z = TSP_ZONES.find(z => z.k === 'blanco'), pos = S.st >= 2 ? [TSP_GATE[0] + 6, TSP_GATE[1] - 2] : [Z.c[0] + 3, Z.c[1] - 9];
  const e = spawnNPC('lienya', pos[0] * 16 + 8, pos[1] * 16 + 8, 'sin_pintar', { face: 'down' }); if (e && S.st < 2) S.st = Math.max(S.st, 1); }
{ const _cq = completeQuest; completeQuest = function (id) { const r = _cq.apply(this, arguments); if (id === 'tsp5') setTimeout(lnyPlace, 500); return r; }; }
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'lienya') return; const S = lny(); if (npc.noTalk) { opts.length = 0; return; }
  if (S.st === 1) opts.unshift({ label: '❔ ' + L2('¿Quién eres?', 'Who are you?'), icon: ['eye', '#e0c0ff'], fn: () => {
    typeText(L2('Te he mirado desde que cruzaste el puente. Traes color… y el color duele aquí. Si de verdad quieres pintar el borde, enséñamelo. Pelea conmigo.', 'I have watched you since you crossed the bridge. You bring colour… and colour hurts here. If you truly want to paint the border, show me. Fight me.'));
    setTimeout(() => { closeDialog(); lnyFight(npc); }, 3500); } }); });
function lnyFight(npc) { const P = G.P; if (lienyaBoss()) return; const x = npc.x, y = npc.y; npc.remove = true; banner(L2('Lienya revela su forma verdadera', 'Lienya reveals her true form'), L2('Súper jefe · nivel 410', 'Super boss · level 410')); G.shake = 8; sfx('boss');
  burst(x, y - 20, 40, { sp: 90, up: 70, g: 0, life: 1.2, c: ['#ffffff', '#d8c0ff', '#9a60e0'] });
  const m = spawnMob('lienya', 410, x, y, P.L, null, true); if (m) { m.map = G.map.id; m.state = 'chase'; m.aggroR = 999; } }
// ---------- 3) al vencerla ----------
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { if (m && m.mid === 'lienya') { const S = lny(), first = S.st < 2; S.st = 2; markDirty(true);
    if (first) setTimeout(() => { banner(L2('El silencio la suelta', 'The silence lets her go'), L2('Lienya te enseña a pintar: oficio de Artista', 'Lienya teaches you to paint: Artist job')); if (typeof loreUnlock === 'function') loreUnlock(CH_LIENYA); lnyPlace(); }, 4500); } } catch (e) { } return r; }; }
// ---------- oficio de Artista: pintar el borde en los caballetes ----------
addJob('artista', L2('Artista', 'Artist'), 'star', L2('Pinta el mundo sin color en los caballetes de Las Tierras sin Pintar. Lo enseña Lienya después de vencerla.', 'Paint the colourless world at the easels of the Unpainted Lands. Lienya teaches it after you defeat her.'),
  { how: [L2('Vence a Lienya, la Diosa sin Pintar. Después toca los caballetes de Las Tierras sin Pintar: cada cuadro devuelve color a la zona (2 %) y da experiencia de Artista. Cada caballete descansa 2 minutos.', 'Defeat Lienya, the Unpainted Goddess. Then tap the easels of the Unpainted Lands: each painting gives the zone colour back (2%) and Artist experience. Each easel rests 2 minutes.'), ''], ben: [L2('Ataque, defensa, vida y experiencia; cuadros pintados para vender o decorar, y a veces Pigmento Puro.', 'Attack, defence, HP and experience; finished paintings to sell or decorate, and sometimes Pure Pigment.'), ''],
    find: () => ({ loc: [TSP_GATE[0] + 6, TSP_GATE[1] - 2], t: L2('Lienya · Las Tierras sin Pintar', 'Lienya · The Unpainted Lands'), m: 'sin_pintar' }) },
  [[3, '+1 % de crítico', '+1% crit', { crit: 1 }], [6, '+2 % de ataque', '+2% attack', { atkP: 2 }], [10, '+3 % de experiencia', '+3% experience', { xpP: 3 }], [15, '+3 % de vida', '+3% HP', { hpP: 3 }], [20, '+3 % de defensa', '+3% defence', { defP: 3 }],
    [30, '+3 % de ataque', '+3% attack', { atkP: 3 }], [40, '+4 % de experiencia', '+4% experience', { xpP: 4 }], [50, '+4 % de vida y defensa', '+4% HP and defence', { hpP: 4, defP: 4 }], [60, 'Cada cuadro pinta el doble', 'Each painting paints double', { artP: 1 }]], ['star', '#e0c0ff']);
it('cuadro_pintado', { n: L2('Cuadro del borde', 'Border painting'), t: 'mat', stack: true, tier: 5, price: 3000, icon: ['find', '#ff9ad0'], rar: 3, d: L2('Un paisaje del borde recién pintado. Se vende bien.', 'A freshly painted landscape of the border. It sells well.') });
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && M.tsp && !P.dead) { const tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const i = tileAt(M, tx + dx, ty + dy); if (i < 0 || M.objAt[i] < 0) continue; const o = M.objs[M.objAt[i]]; if (o.k === 'furn' && o.f === 'sp_caballete') return { kind: 'lny_paint', o, label: L2('Pintar', 'Paint'), icon: ['star', '#e0c0ff'] }; } } return _it.apply(this, arguments); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(), P = G.P; if (!t || t.kind !== 'lny_paint') return _di();
    if (lny().st < 2) { typeText(L2('Un caballete con un lienzo a medias. Alguien empezó a pintar aquí… pero tú todavía no sabes cómo seguir.', 'An easel with a half-finished canvas. Someone started painting here… but you don\'t know how to continue yet.')); return; }
    if (G.t < (t.o.paintT || 0)) { toast(L2('Este cuadro todavía se está secando', 'This painting is still drying'), 'info'); return; } t.o.paintT = G.t + 120;
    P.jobs.artista = P.jobs.artista || { lv: 1, xp: 0 }; setAnim(P, 'gather'); P.busy = 0.8; const z = tspZoneAt(t.o.px, t.o.py); const dbl = jobPerkSum('artP') ? 2 : 1; tspAddPaint(z >= 0 ? z : 0, 0.02 * dbl); gainJobXp('artista', 30 + P.jobs.artista.lv * 2);
    burst(t.o.px, t.o.py - 12, 18, { sp: 50, up: 50, g: 60, life: 0.8, c: ['#ff70c0', '#5ad0ff', '#ffd040', '#7aff7a'] }); sfx('pickup');
    if (Math.random() < 0.35) giveItem('cuadro_pintado', 1); if (Math.random() < 0.08) giveItem('pigmento_puro', 1); markDirty(); }; }

// ---------- lore, cinemática, pista y lupa ----------
const CH_LIENYA = CRON.length;
CRON.push([L2('Lienya, la Diosa sin Pintar', 'Lienya, the Unpainted Goddess'), L2('Nadie lo esperaba: en el borde vivía una diosa. La Ventisca la dibujó al principio de todo para que cuidara el límite del mundo, le dio el pelo blanco del lienzo y la dejó sin terminar. En lo que quedó sin pintar —su piel— se metió el silencio de Nihil, y durante siglos Lienya miró a cada viajero sin saber si quería que la pintaran o que todo se borrara. Te vigiló desde lejos desde que cruzaste el puente. Cuando la venciste, el silencio la soltó: quedó solo ella, la primera obra de la Ventisca. Ahora pinta contigo el borde, trazo a trazo, y dicen que sonríe cuando ve un color nuevo.', 'Nobody expected it: a goddess lived at the border. The Ventisca drew her at the very beginning to watch over the edge of the world, gave her the canvas-white hair and left her unfinished. Into what remained unpainted —her skin— Nihil\'s silence crept in, and for centuries Lienya watched every traveller without knowing whether she wanted to be painted or for everything to be erased. She watched you from afar ever since you crossed the bridge. When you defeated her, the silence let her go: only she remained, the Ventisca\'s first work. Now she paints the border with you, stroke by stroke, and they say she smiles whenever she sees a new colour.')]);
ERAS[ERAS.length - 1][1].push(CH_LIENYA); SUPER_BOSS.lienya = CH_LIENYA;
if (typeof CN_SC !== 'undefined') { CN_SC.lienya = (x, t, k) => { cnSky(x, '#2a1a4a', '#c8b0f0'); cnStars(x, t, 40, 0.5); cnGround(x, 112, '#f2eef8', '#d8d0e4'); const [fw, fh] = LNY_SIZE, col = Math.floor(t * 3) % 2; x.globalAlpha = Math.min(1, k * 2); x.drawImage(LNY.cv, col * fw, 0, fw, fh, CN_W / 2 - fw / 2 + 30, 112 - fh, fw, fh); x.globalAlpha = 1; for (let i = 0; i < 14; i++) cnR(x, ['#ff70c0', '#5ad0ff', '#ffd040', '#7aff7a'][i % 4], (i * 37 + t * 20) % CN_W, 112 + (i * 7) % 30, 3, 2); cnHero(x, CN_W / 2 - 50, 114, t, false, 2); };
  { const _cc = cnChapterScenes; cnChapterScenes = function (ch) { return ch === CH_LIENYA ? ['sinpintar', 'lienya'] : _cc(ch); }; } }
if (typeof CLUES !== 'undefined') CLUES.n_lienya = ['npc', L2('La que observa', 'The one who watches'), L2('En el borde alguien te mira desde lejos y desaparece cuando te acercas. Pelo blanco, piel de noche, ojos que brillan.', 'At the border someone watches you from afar and vanishes when you get close. White hair, night-dark skin, glowing eyes.'), CH_LIENYA];
V33_TICKS.push(() => { const S = G.P && G.P.lny; if (S && S.seen >= 3 && !S.clue) { S.clue = 1; try { clueUnlock('n_lienya'); } catch (e) { } } });
if (typeof GSIS !== 'undefined') GSIS.push(['lienya', '🌸 ' + L2('Lienya, la Diosa sin Pintar', 'Lienya, the Unpainted Goddess'), () => [
  L2('Un descubrimiento de Las Tierras sin Pintar. Mientras recorres el borde, una mujer de pelo blanco y piel oscura te mira desde lejos y se desvanece si te acercas.', 'A discovery in the Unpainted Lands. As you roam the border, a white-haired, dark-skinned woman watches you from afar and vanishes if you get close.'),
  L2('Cuando vences a El Lienzo en Blanco (misión de Mael «El Lienzo en Blanco»), te espera junto a la puerta de luz de la zona El Lienzo en Blanco. Pregúntale quién es y revelará su forma verdadera.', 'Once you defeat The Blank Canvas (Mael\'s quest "The Blank Canvas"), she waits by the door of light in The Blank Canvas zone. Ask her who she is and she will reveal her true form.'),
  L2('Súper jefe de nivel 410 (más que el nivel máximo: muy difícil, lleva todo y, si puedes, amigos). Ataques: Ráfaga del Vacío (sal de la línea), Círculo de Olvido (aléjate), Tentáculos Incoloros (te atrapan: rueda), Lluvia Sin Color y Desvanecer (se esconde, es inmune un momento y estalla: aléjate o rueda al final). Al 50 % ataca más rápido y al 20 % combina ataques.', 'Level 410 super boss (above the max level: very hard, bring everything and friends if you can). Attacks: Void Burst (leave the line), Circle of Oblivion (get away), Colourless Tentacles (they grab you: roll), Colourless Rain and Vanish (she hides, is immune for a moment and bursts: get away or roll at the end). At 50% she attacks faster and at 20% she combines attacks.'),
  L2('Al vencerla, el silencio la suelta: se queda junto a Mael, te enseña el oficio de Artista (pinta los caballetes para devolver el color al borde) y la puedes enamorar y casarte con ella.', 'Once defeated, the silence lets her go: she stays next to Mael, teaches you the Artist job (paint the easels to bring colour back to the border) and you can win her heart and marry her.')],
  () => (typeof TSP_ZONES !== 'undefined' ? (Z => ({ loc: [Z.c[0] + 3, Z.c[1] - 9], t: L2('Puerta de luz · El Lienzo en Blanco', 'Door of light · The Blank Canvas'), m: 'sin_pintar' }))(TSP_ZONES.find(z => z.k === 'blanco')) : null)]);
// dificultad medida con tools/dev/jefes.py: unos 12 minutos en solitario con todo (súper jefe por encima del nivel máximo)
Object.assign(BOSS_TUNE, { lienya: 2.36 });

// ---------- v4.77: forma de persona (después de vencerla) con pelo propio, salvaje y rizado como en su dibujo ----------
// Antes de vencerla se ve su dibujo reducido (lnyAtlas); después, el sprite de personaje del juego con este pelo.
const LNY_HL = P5(['#4a2c78', '#7a58b4', '#a888dc', '#cdb8f0', '#f0e8ff']);
fitKind('head', 'lny_pelo', (p, A, s) => { const H = LNY_HL, { hx, hy, hrx, hry, headTop: top, ey, side, up, d } = A, legTop = A.legTop, R = Math.round, rx = hrx + 3;
  const col = (x, y) => { const g = (x - hx) * 0.08 + (y - top) * 0.09 + (Math.sin((x - hx) * 0.9 + (y - top) * 0.35) > 0.82 ? 0.9 : 0); return g < 0.15 ? H[4] : g < 0.65 ? H[3] : g < 1.25 ? H[2] : H[1]; };
  const face = (x, y) => !up && y >= ey - 2 && y <= hy + hry && (side ? (x - hx) * d >= -1 && Math.abs(x - hx) <= hrx : Math.abs(x - hx) <= hrx - 2);
  const put = (x, y, c) => { x = R(x); y = R(y); if (!face(x, y)) p.set(x, y, c || col(x, y)); };
  const curl = (x, y, sx) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx * dx + dy * dy < 2) put(x + dx, y + dy, dy > 0 || dx * sx > 0 ? H[2] : H[3]); put(x + sx * 2, y, H[2]); put(x + sx * 2, y - 1, H[1]); };
  // volumen de arriba
  for (let y = R(top) - 3; y <= R(hy); y++) for (let x = hx - rx; x <= hx + rx; x++) { const e = ((x - hx) / rx) ** 2 + ((y - hy + 2) / (hry + 2)) ** 2 + (Math.sin(Math.atan2(y - hy, x - hx) * 6) * 0.12); if (e < 1) put(x, y); }
  // mechones que se escapan arriba
  for (const [ox, oy, sx] of [[-7, 1, -1], [-3, -2, -1], [3, -2, 1], [7, 1, 1]]) { const x0 = hx + ox * (side ? 0.7 : 1), y0 = top + oy; put(x0, y0, H[3]); put(x0 + sx, y0 - 1, H[3]); curl(x0 + sx * 2, y0 - 2, sx); }
  if (!up && !side) for (const bx of [-1, 1]) for (let y = R(top) + 2; y <= ey - 1; y++) put(hx + bx, y, H[4]);   // flequillo fino
  // melena larga que ondea hasta la cintura
  const lock = (bx, sx) => { for (let y = R(hy) - 3; y <= legTop + 3; y++) { const k = (y - hy) / Math.max(1, legTop - hy), w = R(bx + sx * (k * 3.5 + Math.sin(y * 0.5) * 2)); const tw = y < hy + 3 ? 4 : 3; for (let t = 0; t < tw; t++) put(w + sx * t, y, t === tw - 1 ? H[1] : t === 0 ? H[3] : H[2]); if ((y - R(hy)) % 7 === 3) { put(w + sx * tw, y - 1, H[2]); put(w + sx * (tw + 1), y - 2, H[2]); put(w + sx * (tw + 1), y - 3, H[1]); } } curl(bx + sx * 5, legTop + 4, sx); };
  if (up) { for (let y = R(hy) - 2; y <= legTop + 4; y++) { const half = R(rx - 1 + (y - hy) * 0.18 + Math.sin(y * 0.6)); for (let x = hx - half; x <= hx + half; x++) put(x, y, (x - hx + 40) % 4 === 0 ? H[2] : Math.abs(x - hx) > half - 1 ? H[1] : H[3]); } for (const sx of [-1, 1]) curl(hx + sx * (rx + 2), legTop + 4, sx); }
  else if (side) { lock(hx - d * (hrx - 1), -d); lock(hx - d * (hrx - 3), -d); }
  else { lock(hx - hrx - 1, -1); lock(hx + hrx - 1, 1); } }, { cover: 'full' });
{ const _ll = lnyLook; lnyLook = function () { const L = _ll.apply(this, arguments); L.head = { k: 'lny_pelo', cover: 'full', m: LNY_HAIR }; L.hs = Object.assign({}, L.hs, { back: 0, side: 0, bang: 'none' }); return L; }; }
function lnyAtlasP() { return getAtlas('npc_lienya_p', () => buildHeroAtlas(lnyLook())); }
{ const _na = npcAtlas; npcAtlas = function (id) { if (id === 'lienya' && G.P && G.P.lny && G.P.lny.st >= 2) return lnyAtlasP(); return _na.apply(this, arguments); }; }
