// ================= v4.18: EL CONTINENTE DEL VELO ROTO (niveles 255-350) =================
// Un continente dark fantasy al otro lado de una grieta del Velo. Se abre con el Lobo Viejo Fenrik y la bruja Malvia,
// que viven por el mundo. Cinco regiones conectadas, cada una con su mecánica: Pantano de las Almas Perdidas, Aldea de
// las Campanas Muertas, Bosque de los Susurros, Catedral del Eclipse y Castillo de la Luna Sonriente. Por primera vez se
// ve el cielo: una franja de noche con la Luna Sonriente (diseño propio), nubes magenta y niebla sobre el horizonte.
// Nivel máximo 350, equipo de tiers 22-26 (armas de la hoja dark fantasy de Sergio, 6zyq_armas_vr_data.js).

// ---------- armas 22-26 en el motor de armas (6zye) ----------
Object.assign(ARM_ICON, ARMV_ICON); Object.assign(ARM_HD, ARMV_HD); Object.assign(ARM_PIVK16, ARMV_PIV16); Object.assign(ARM_PIVK32, ARMV_PIV32);
for (const k in ARMV_ICON) ARM_PIX[k] = wsprPix(ARMV_ICON[k]);
for (const k in ARMV_HAND) ARM_HPIX[k] = wsprPix(ARMV_HAND[k]);
for (const k in ARMV_HD) { const im = new Image(); im.onload = () => { try { ARM_HDP[k] = armPixFromImg(im); } catch (e) { } }; im.src = ARMV_HD[k]; }
for (const t in ARMV_ATLAS) { const im = new Image(); im.src = ARMV_ATLAS[t]; WSPR_IMG['arm' + t] = im; }
// ---------- tiers 22-26 ----------
const VR_T = { 22: ['lobo', L2('del Lobo Nocturno', 'of the Night Wolf'), 262, ['#1a1c22', '#3a3e48', '#6a707c', '#a8b0bc', '#e0e6ee']], 23: ['sepulcral', L2('Sepulcral', 'Sepulchral'), 284, ['#0a1a14', '#1a3a2a', '#3a6a4a', '#7aa880', '#d0f0c8']],
  24: ['velo', L2('del Velo Roto', 'of the Broken Veil'), 304, ['#14082a', '#2a1050', '#4a2080', '#7a48b8', '#c8a0ff']], 25: ['eclipse', L2('Eclipsado', 'Eclipsed'), 324, ['#0a0408', '#2a0a14', '#5a1428', '#9a2a40', '#ff6a7a']],
  26: ['luna', L2('de la Luna Sonriente', 'of the Smiling Moon'), 344, ['#2a0a04', '#6a1e08', '#b84a14', '#f09a30', '#fff0b0']] };
const VR_MATS = [['colmillo_lunar', L2('Colmillo Lunar', 'Lunar Fang'), ['gem', '#d0d8e8']], ['baba_sapo', L2('Baba de Sapo Brujo', 'Witch-Toad Slime'), ['gem', '#5ad070']], ['encaje_maldito', L2('Encaje Maldito', 'Cursed Lace'), ['gem', '#8a40d0']],
  ['hueso_coronado', L2('Hueso Coronado', 'Crowned Bone'), ['gem', '#e8eef4']], ['cera_campana', L2('Cera de Campana', 'Bell Wax'), ['gem', '#2aa86a']], ['polvo_lunar', L2('Polvo de Luna', 'Moon Dust'), ['gem', '#ffb040']]];
for (const [id, n, icon] of VR_MATS) it(id, { n, t: 'mat', stack: true, tier: 16, price: 2500, icon, rar: 5 });
const VR_REC = { 22: [['colmillo_lunar', 8], ['baba_sapo', 6]], 23: [['encaje_maldito', 8], ['hueso_coronado', 4]], 24: [['hueso_coronado', 8], ['cera_campana', 3]], 25: [['cera_campana', 6], ['polvo_lunar', 3]], 26: [['polvo_lunar', 6], ['encaje_maldito', 6], ['esencia_nihil', 2]] };
for (const t in VR_T) { const [k, nm, lv, pl] = VR_T[t]; TIER[t] = { k, m: nm, f: nm, mp: nm, fp: nm, lv, p: +t }; TIERP[t] = pal(pl);
  for (const c in WBASE) { const [bn, g, art, mul] = WBASE[c]; const nmB = c === 'guerrero' && (t == 24 || t == 25) ? L2('Mandoble', 'Greatsword') : c === 'guerrero' && t == 26 ? L2('Espada de la Dama', 'Lady\'s Sword') : c === 'bardo' ? L2('Violín', 'Violin') : c === 'invocador' && (t == 24 || t == 25) ? L2('Guadaña Lunar', 'Lunar Scythe') : bn;
    it(`w_${c}_${t}`, { n: `${nmB} ${nm}`, t: 'weapon', slot: 'weapon', cls: c, lv, tier: +t, atk: Math.round((8 + lv * 3.1 + t * 5) * mul), crit: c === 'arquero' ? +t : c === 'asesino' ? t * 1.5 : 0, mpB: c === 'mago' || c === 'invocador' ? t * 12 : c === 'bardo' ? t * 8 : 0, price: Math.round(30 * Math.pow(t, 2.4)), icon: ['arm', c, +t], rar: 5 }); }
  { const g = ITEMS[`w_guerrero_${t}`]; it(`w_pez_${t}`, Object.assign({}, g, { id: `w_pez_${t}`, n: L2('Aletas ', 'Fins ') + nm, cls: 'pez', atk: Math.round(g.atk * 0.98), crit: Math.round(t * 0.6), icon: ['arm', 'pez', +t] })); }
  const def = 3 + lv * 1.4 + t * 2;
  it(`h_${t}`, { n: L2('Casco ', 'Helmet ') + nm, t: 'armor', slot: 'head', lv, tier: +t, def: Math.round(def * 0.45), hpB: Math.round(lv * 1.5), price: Math.round(14 * Math.pow(t, 2.3)), icon: ['helm', 15], rar: 5 });
  it(`b_${t}`, { n: L2('Armadura ', 'Armor ') + nm, t: 'armor', slot: 'body', lv, tier: +t, def: Math.round(def), hpB: Math.round(lv * 3.5), price: Math.round(20 * Math.pow(t, 2.3)), icon: ['armor', 15], rar: 5 });
  it(`l_${t}`, { n: L2('Grebas ', 'Greaves ') + nm, t: 'armor', slot: 'legs', lv, tier: +t, def: Math.round(def * 0.6), hpB: Math.round(lv * 2), price: Math.round(16 * Math.pow(t, 2.3)), icon: ['legs', 15], rar: 5 });
  it(`f_${t}`, { n: L2('Botas ', 'Boots ') + nm, t: 'armor', slot: 'feet', lv, tier: +t, def: Math.round(def * 0.35), spdB: 9, price: Math.round(12 * Math.pow(t, 2.3)), icon: ['boots', 15], rar: 5 });
  const mats = VR_REC[t]; for (const s of ['h', 'b', 'l', 'f']) RECIPES.push({ id: `r_${s}_${t}`, job: 'herreria', out: `${s}_${t}`, n: 1, lv, jlv: 1, gold: 120000 * (t - 20), mats, cat: 'armadura' });
  for (const c of Object.keys(WBASE).concat(['pez'])) RECIPES.push({ id: `r_w_${c}_${t}`, job: 'herreria', out: `w_${c}_${t}`, n: 1, lv, jlv: 1, gold: 160000 * (t - 20), mats, cat: 'arma', cls: c }); }
// capucha de lobo (recompensa de Fenrik): piel gris con orejas y hocico sobre la frente
fitKind('head', 'wolfhood', (p, A, s) => { const F = s.m, cx = A.hx, top = A.headTop; p.ball(cx, top + 4, A.hrx + 1.5, 5, [F[1], F[2], F[3], F[4]]); for (let y = top + 4; y < A.ey + 4; y++) for (const x of [Math.round(cx - A.hrx - 1), Math.round(cx + A.hrx)]) { p.set(x, y, F[1]); p.set(x + (x < cx ? 1 : -1), y, F[2]); }
  if (!A.up) { for (const sx of [-1, 1]) p.poly([[cx + sx * 3, top + 1], [cx + sx * 6, top - 5], [cx + sx * 7, top + 2]], F[2]); p.ball(cx, top + 2, 3, 2, [F[2], F[3], F[3], F[4]]); p.set(cx, top + 1, C('#101014')); p.set(cx - 2, top + 3, C('#ffd040')); p.set(cx + 2, top + 3, C('#ffd040')); } else for (const sx of [-1, 1]) p.poly([[cx + sx * 3, top + 1], [cx + sx * 6, top - 5], [cx + sx * 7, top + 2]], F[1]); });
cosm('c_capucha_lobo', L2('Capucha del Lobo Nocturno', 'Night Wolf Hood'), 'head', () => ({ k: 'wolfhood', m: TIERP[22], cover: 'hat' }), { src: L2('Fenrik, el Lobo Viejo', 'Fenrik, the Old Wolf') });
cosm('c_manto_lobo', L2('Manto del Lobo Nocturno', 'Night Wolf Mantle'), 'back', () => ({ k: 'cape', o: TIERP[22], i: P5(['#2a2a30', '#4a4a54', '#6a6a78', '#8a8a98', '#b0b0c0']), tr: TIERP[22] }), { src: L2('Fenrik, el Lobo Viejo', 'Fenrik, the Old Wolf') });

// ---------- enemigos y jefes con los personajes dark fantasy ----------
function vrAtlas(sp) {   // sprite al doble → atlas de monstruo con HD ya hecho (de cara siempre, como en la PS1)
  const fw = Math.ceil(sp.w / 2) + 4, fh = Math.ceil(sp.h / 2) + 6, hd = mkCanvas(fw * 20, fh * 8), lo = mkCanvas(fw * 10, fh * 4), hx = hd.getContext('2d'), lx = lo.getContext('2d'), cv = sp.canvas();
  const bob = [0, 1, 0, 1, 2, 1, -1, -2, 0, 0], lean = [0, 0, 0, 0, 0, 0, 1, 3, 1, 0];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) { const flip = r === 2, x = c * fw * 2 + fw - sp.w / 2 + (flip ? -lean[c] : lean[c]) * 2, y = r * fh * 2 + fh * 2 - 6 - sp.h + bob[c] * 2;
    hx.save(); if (flip) { hx.translate(Math.round(x) + sp.w, Math.round(y)); hx.scale(-1, 1); hx.drawImage(cv, 0, 0); } else hx.drawImage(cv, Math.round(x), Math.round(y)); hx.restore(); }
  lx.imageSmoothingEnabled = false; lx.drawImage(hd, 0, 0, lo.width, lo.height);
  const A = { img: lo, hd, hdL: { vr: 1 }, hdDone: new Uint8Array(40).fill(1), hdT: 0, fw, fh, idx: { idle: 0, walk: 2, atk: 6, hurt: 9 }, ax: fw >> 1, ay: fh - 3 }; return A; }
const VR_KIND = { violeta: () => VR_ART.violeta(), carmesi: () => VR_ART.carmesi(), rey: () => VR_ART.rey(), sapo: () => VR_ART.sapo(), demonio: () => VR_ART.demonio(), obispo: () => VR_ART.obispo(), alce: () => VR_ART.alce(),
  campanas: () => { const p = VR_ART.obispo(); for (let i = 0; i < p.d.length; i++) { const c = p.d[i]; if (uA(c) && uR(c) > uG(c) + 30 && uR(c) > uB(c)) p.d[i] = uMix(c, C('#1a8a4a'), 0.75); } return p; },
  luna: () => { const p = new Pix(120, 120), cx = 60, cy = 60; for (let y = 0; y < 120; y++) for (let x = 0; x < 120; x++) { const d = Math.hypot(x - cx, y - cy); if (d > 54) continue; const t = d / 54; p.set(x, y, C(t > 0.9 ? '#b8380a' : t > 0.7 ? '#e0701a' : (x * 7 + y * 13) % 17 === 0 ? '#e8902a' : '#ffc040')); }
    for (const s of [-1, 1]) { p.ell(cx + s * 18, cy - 12, 11, 5, C('#7a2a0a')); p.ell(cx + s * 18, cy - 10, 9, 3, C('#ffc040')); } p.rect(cx - 3, cy - 6, 6, 14, C('#c8501a'));
    p.ell(cx, cy + 20, 28, 14, C('#5a1a06')); p.rect(cx - 30, cy + 6, 60, 14, C('#ffc040')); for (let x = cx - 24; x <= cx + 22; x += 6) p.rect(x, cy + 20, 5, 6, C('#fff0c0')); p.outline(OUTL); return p; } };
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'vr' && VR_KIND[art[1]]) return getAtlas('Mvr' + art[1], () => vrAtlas(VR_KIND[art[1]]())); return _ma(art); }; }
const VR_MOBS = [
  ['brujo_sapo', L2('Brujo Sapo', 'Toad Warlock'), 'sapo', 'ranged', [262, 272], 'baba_sapo'], ['alce_velado', L2('Alce Velado', 'Veiled Elk'), 'alce', 'charge', [266, 282], 'colmillo_lunar'],
  ['hechicera_violeta', L2('Hechicera Violeta', 'Violet Sorceress'), 'violeta', 'ranged', [276, 290], 'encaje_maldito'], ['demonio_cornudo', L2('Demonio Cornudo', 'Horned Fiend'), 'demonio', 'aggro', [282, 300], 'hueso_coronado'],
  ['hechicera_carmesi', L2('Hechicera Carmesí', 'Crimson Sorceress'), 'carmesi', 'ranged', [292, 310], 'encaje_maldito'], ['soldado_hueco', L2('Soldado Hueco', 'Hollow Soldier'), 'esq', 'aggro', [300, 330], 'hueso_coronado'],
  ['diacono_eclipse', L2('Diácono del Eclipse', 'Eclipse Deacon'), 'obispo', 'ranged', [312, 330], 'cera_campana'], ['heraldo_lunar', L2('Heraldo Lunar', 'Lunar Herald'), 'demonio', 'aggro', [330, 350], 'polvo_lunar'],
];
for (const [id, n, k, ai, lv, mat] of VR_MOBS) MOBS[id] = { n, art: k === 'esq' ? MOBS.esqueleto.art : ['vr', k], reg: ['velo'], lv, hp: 1.35 + (lv[0] - 260) / 500, atk: 1.75 + (lv[0] - 260) / 600, def: 1.7, spd: ai === 'charge' ? 74 : 54, ai, fam: 'velo', drops: [[mat, 0.18], ['frag_mapa', 0.03]] };
Object.assign(BOSSES, {
  obispo_hueco: { n: L2('El Obispo Hueco', 'The Hollow Bishop'), lv: 288, art: ['vr', 'obispo'], scale: 1.4, hp: 30, atk: 2.6, def: 2.6, spd: 40, moves: ['volley', 'field', 'summon', 'nova'], minion: 'soldado_hueco', drops: [['encaje_maldito', 1, 6], ['cera_campana', 0.5, 2]], r: 34 },
  rey_esqueleto: { n: L2('Varkhul, el Rey Esqueleto', 'Varkhul, the Skeleton King'), lv: 305, art: ['vr', 'rey'], scale: 1.5, hp: 31, atk: 2.65, def: 2.65, spd: 42, moves: ['slam', 'volley', 'summon', 'charge'], minion: 'soldado_hueco', drops: [['hueso_coronado', 1, 8]], r: 36 },
  rey_campanas: { n: L2('El Rey de las Campanas', 'The King of Bells'), lv: 330, art: ['vr', 'campanas'], scale: 1.7, hp: 32, atk: 2.7, def: 2.7, spd: 40, moves: ['slam', 'volley', 'rain', 'field', 'blink'], minion: 'diacono_eclipse', drops: [['cera_campana', 1, 8], ['polvo_lunar', 0.6, 3]], r: 40 },
  luna_sonriente: { n: L2('La Luna Sonriente', 'The Smiling Moon'), lv: 350, art: ['vr', 'luna'], scale: 1.1, fly: 1, hp: 34, atk: 2.8, def: 2.8, spd: 34, moves: ['volley', 'rain', 'nova', 'blink', 'summon'], minion: 'heraldo_lunar', drops: [['polvo_lunar', 1, 10], ['esencia_nihil', 1, 2]], r: 44 },
});
// mecánicas (usan los peligros de 6zyp): esbirros que cubren al rey, campanadas, oscuridad, dobles y sellos
function vrSeal(m, frac, title) { if (m.sealDone || m.hp > m.maxhp * frac) return; m.sealDone = 1; m.invuln = 1; banner(title, L2('Activa los 3 sellos dorados', 'Activate the 3 golden seals')); m.seals = [];
  for (let k = 0; k < 3; k++) { const a = k * 2.1 + 0.4, h = { k: 'seal', x: m.x + Math.cos(a) * 90, y: m.y + Math.sin(a) * 60, r: 16, t0: G.t, t1: G.t + 999, col: '#ffd040', prog: 0, boss: m }; HZ.push(h); m.seals.push(h); } }
function vrMinions(m, id, n) { m.minions = (m.minions || []).filter(e => !e.dying && !e.remove); for (let k = 0; k < n; k++) { const a = Math.random() * 6.28, s = spawnMob(id, Math.max(1, m.lv - 6), m.x + Math.cos(a) * 50, m.y + Math.sin(a) * 36, m.L, null, false); if (s) { s.map = m.map; m.minions.push(s); } } }
function vrLine(m, P, col) { const a = Math.atan2(P.y - m.y, P.x - m.x); for (let k = 1; k <= 7; k++) { const x = m.x + Math.cos(a) * k * 26, y = m.y + Math.sin(a) * k * 19; addFx({ type: 'field', ground: true, x, y, r: 16, dur: 0.6 + k * 0.07, col }); HZ.push({ k: 'lava', x, y, r: 16, t0: G.t + 0.6 + k * 0.07, t1: G.t + 1.1 + k * 0.07, col }); } }
Object.assign(BMECH, {
  obispo_hueco: { every: 9, name: L2('¡El Obispo reza a sus muertos!', 'The Bishop prays to his dead!'), fn: (m) => { m.hp = Math.min(m.maxhp, m.hp + m.maxhp * 0.04); addFx({ type: 'ring', x: m.x, y: m.y, r: 40, dur: 0.6, col: '#3ac06a' }); vrMinions(m, 'soldado_hueco', 2); } },
  rey_esqueleto: { every: 10, name: L2('¡Sus soldados lo cubren! Derríbalos primero', 'His soldiers shield him! Bring them down first'), fn: (m) => vrMinions(m, 'soldado_hueco', 3) },
  rey_campanas: { every: 6, name: L2('Campanada…', 'A bell tolls…'), fn: (m, P) => { const ph = m.hp > m.maxhp * 0.66 ? 0 : 1, mv = Math.floor(Math.random() * 3);
    if (ph === 0) { toast([L2('Una campanada: ondas', 'One toll: waves'), L2('Dos campanadas: raíces de bronce', 'Two tolls: bronze roots'), L2('Tres campanadas: fuego verde', 'Three tolls: green fire')][mv], 'warn', 2);
      setTimeout(() => { if (m.dying) return; if (mv === 0) BMECH.gruk.fn(m, G.P); else if (mv === 1) BMECH.ent.fn(m, G.P); else vrLine(m, G.P, '#3aff6a'); }, 900); }
    else { m.dark = G.t + 5; vrMinions(m, 'diacono_eclipse', 2); toast(L2('El Silencio: la catedral se apaga y aparecen dobles', 'The Silence: the cathedral goes dark and doubles appear'), 'warn', 3); } vrSeal(m, 0.33, L2('La Última Campanada', 'The Last Toll')); } },
  luna_sonriente: { every: 7, name: L2('La Luna te mira…', 'The Moon is watching you…'), fn: (m, P) => { vrLine(m, P, '#ff8a3a'); if (m.hp < m.maxhp * 0.5 && !m.eyes) { m.eyes = 1; banner(L2('La Luna abre los ojos', 'The Moon opens its eyes'), L2('Los enemigos se enfurecen', 'Enemies are enraged')); for (const e of G.ents) if (e.type === 'mob' && e.map === m.map && !e.boss) e.enrT = G.t + 999; vrMinions(m, 'hechicera_carmesi', 2); } vrSeal(m, 0.2, L2('La Luna se esconde', 'The Moon hides')); } },
});
{ const _hm = hitMob; hitMob = function (m, base, src) { if (m && m.mid === 'rey_esqueleto' && (m.minions || []).some(e => !e.dying && !e.remove && Math.hypot(e.x - m.x, e.y - m.y) < 140)) { if (!m._cvT || G.t - m._cvT > 0.8) { m._cvT = G.t; floatText(m.x, m.y - 40, L2('¡CUBIERTO!', 'SHIELDED!'), '#c0c8d0'); } return _hm.call(this, m, base * 0.2, src); } return _hm.apply(this, arguments); }; }

// ---------- el mapa ----------
const VR_W = 240, VR_H = 180, VR_GATE = [124, 106];
const VR_ZONES = [
  { k: 'pantano', n: L2('Pantano de las Almas Perdidas', 'Swamp of Lost Souls'), c: [58, 132], r: [42, 30], ter: 'MUD', lv: [262, 282], pool: ['brujo_sapo', 'alce_velado'] },
  { k: 'aldea', n: L2('Aldea de las Campanas Muertas', 'Village of the Dead Bells'), c: [60, 56], r: [36, 26], ter: 'DIRT', lv: [276, 300], pool: ['hechicera_violeta', 'demonio_cornudo'], boss: 'obispo_hueco' },
  { k: 'bosque', n: L2('Bosque de los Susurros', 'Forest of Whispers'), c: [126, 44], r: [42, 28], ter: 'GRASS', lv: [292, 310], pool: ['hechicera_carmesi', 'alce_velado', 'soldado_hueco'], boss: 'rey_esqueleto' },
  { k: 'catedral', n: L2('Catedral del Eclipse', 'Cathedral of the Eclipse'), c: [196, 66], r: [32, 28], ter: 'FLOOR', lv: [312, 330], pool: ['diacono_eclipse', 'demonio_cornudo'], boss: 'rey_campanas' },
  { k: 'castillo', n: L2('Castillo de la Luna Sonriente', 'Castle of the Smiling Moon'), c: [190, 140], r: [34, 28], ter: 'DUSK', lv: [330, 350], pool: ['heraldo_lunar', 'hechicera_carmesi', 'diacono_eclipse'], boss: 'luna_sonriente' },
];
function makeVelo() {
  if (G.maps.velo_roto) return G.maps.velo_roto; const w = VR_W, h = VR_H, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'velo_roto', w, h, ter: new Uint8Array(N).fill(T.VOID), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0.22, music: 'cave', I, sky: 1, _skyd: 1, vr: 1, camps: [], bossAt: [], halos: [], temples: [] };
  const set = (x, y, t) => { if (x > 1 && y > 1 && x < w - 2 && y < h - 2) M.ter[I(x, y)] = T[t]; };
  const land = (cx, cy, rx, ry, t, seed) => { for (let y = cy - ry - 4; y <= cy + ry + 4; y++) for (let x = cx - rx - 4; x <= cx + rx + 4; x++) { const d = Math.hypot((x - cx) / rx, (y - cy) / ry) + (hash2(x, y, seed) - 0.5) * 0.2; if (d < 1) set(x, y, t); } };
  land(124, 92, 110, 82, 'GRASS', 2);
  VR_ZONES.forEach((Z, i) => land(Z.c[0], Z.c[1], Z.r[0], Z.r[1], Z.ter, 10 + i));
  for (let y = 112; y < 160; y++) for (let x = 20; x < 100; x++) if (M.ter[I(x, y)] === T.MUD && hash2(x >> 2, y >> 2, 5) < 0.35) set(x, y, 'WATER');   // pantano con agua luminosa
  const road = (x0, y0, x1, y1) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let k = 0; k <= n; k++) { const x = Math.round(x0 + (x1 - x0) * k / n), y = Math.round(y0 + (y1 - y0) * k / n); for (let d = -1; d <= 1; d++) { set(x + d, y, 'COBBLE'); set(x, y + d, 'COBBLE'); } } };
  for (const Z of VR_ZONES) road(VR_GATE[0], VR_GATE[1], Z.c[0], Z.c[1]);
  for (let y = VR_GATE[1] - 4; y <= VR_GATE[1] + 4; y++) for (let x = VR_GATE[0] - 6; x <= VR_GATE[0] + 6; x++) set(x, y, 'COBBLE');
  prepPalettes(M); M.exit = { x: -9, y: -9 }; initMapObjs(M);
  const R = new RNG(SEED + 9393), free = (x, y) => { const i = I(x, y); return M.ter[i] !== T.VOID && M.ter[i] !== T.WATER && M.objAt[i] < 0 && Math.hypot(x - VR_GATE[0], y - VR_GATE[1]) > 6; };
  const F = (f, x, y, o) => free(x, y) ? addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {})) : null, O = (k, x, y, o) => free(x, y) ? addObj(M, k, x, y, o || {}) : null;
  for (let k = 0; k < 520; k++) { const x = R.int(8, w - 8), y = R.int(8, h - 8), t = M.ter[I(x, y)]; if (t === T.VOID || t === T.COBBLE) continue; const r = R.f();
    if (t === T.MUD) F(r < 0.5 ? 'vr_sauce' : 'vr_arbol', x, y); else if (t === T.GRASS) F(r < 0.75 ? 'vr_arbol' : 'vr_lapida', x, y); else if (t === T.DIRT) r < 0.4 ? O('grave', x, y) : F(r < 0.7 ? 'vr_farol' : 'vr_arbol', x, y); else if (t === T.FLOOR) F(r < 0.5 ? 'vr_vela' : 'vr_lapida', x, y); else if (t === T.DUSK) F(r < 0.5 ? 'vr_arbol' : 'vr_farol', x, y); }
  { const [cx, cy] = VR_ZONES[3].c; for (let a = 0; a < 14; a++) O('pillar', Math.round(cx + Math.cos(a / 14 * 6.28) * 14), Math.round(cy + Math.sin(a / 14 * 6.28) * 10), { v: a }); F('vr_campana', cx, cy - 8, { fp: [[0, 0], [-1, 0], [1, 0]] }); }
  { const [cx, cy] = VR_ZONES[4].c; F('vr_castillo', cx, cy - 12, { fp: [[-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0]] }); }
  F('vr_portal', VR_GATE[0], VR_GATE[1] + 3);
  VR_ZONES.forEach((Z, z) => { for (let j = 0; j < 8; j++) { const a = j / 8 * 6.28 + z, rr = 0.62; M.camps.push({ x: Math.round(Z.c[0] + Math.cos(a) * Z.r[0] * rr), y: Math.round(Z.c[1] + Math.sin(a) * Z.r[1] * rr), mob: Z.pool[j % Z.pool.length], lv: R.int(Z.lv[0], Z.lv[1]), n: 3, alive: [], isl: z }); }
    if (Z.boss) M.bossAt.push({ x: Z.c[0], y: Z.c[1] - 4, id: Z.boss, k: Z.k }); });
  spawnNPC('oren_campanero', (VR_GATE[0] - 3) * 16 + 8, (VR_GATE[1] - 2) * 16 + 8, 'velo_roto', { face: 'down' }); spawnNPC('malvia', (VR_GATE[0] + 3) * 16 + 8, (VR_GATE[1] - 2) * 16 + 8, 'velo_roto', { face: 'down' });
  M.drawExtra = (cx, cy) => vrGround(M, cx, cy); M.drawPost = (cx, cy) => vrSky(M, cx, cy);
  M.wdist = null; G.maps.velo_roto = M; return M;
}
// agua luminosa y caminos de piedra que brillan
function vrGround(M, cx, cy) { const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(M.w - 1, Math.ceil((cx + VW) / 16)), y1 = Math.min(M.h - 1, Math.ceil((cy + VH) / 16));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const t = M.ter[M.I(x, y)], X = x * 16 - cx, Y = y * 16 - cy;
    if (t === T.WATER) { ctx.fillStyle = `rgba(40,230,110,${0.38 + 0.12 * Math.sin(G.t * 2 + x * 0.7 + y)})`; ctx.fillRect(X, Y, 16, 16); if ((x * 5 + y * 3 + Math.floor(G.t * 3)) % 11 === 0) { ctx.fillStyle = '#c0ffb0'; ctx.fillRect(X + 4, Y + 7, 6, 1); } }
    else if (t === T.COBBLE && hash2(x, y, 3) < 0.4) { ctx.fillStyle = `rgba(80,255,150,${0.16 + 0.08 * Math.sin(G.t * 1.5 + x)})`; ctx.fillRect(X + 2, Y + 2, 12, 12); }
    else if (t === T.VOID) { ctx.fillStyle = '#05030c'; ctx.fillRect(X, Y, 16, 16); } } }
// el cielo: franja de noche arriba, la Luna Sonriente, el castillo, nubes magenta y niebla (primera vez que se ve el cielo)
const VR_SKY = mkCanvas(480, 120);
{ const g = VR_SKY.getContext('2d'), W = 480, H = 120; const s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0a0430'); s.addColorStop(0.65, '#2a0a6a'); s.addColorStop(1, '#5a1a8a'); g.fillStyle = s; g.fillRect(0, 0, W, H);
  for (let k = 0; k < 90; k++) { g.fillStyle = k % 7 ? '#ffffff' : '#ffd0ff'; g.fillRect(Math.floor(hash2(k, 1, 7) * W), Math.floor(hash2(k, 2, 7) * 90), 1, 1); }
  g.fillStyle = '#100a2a'; g.beginPath(); g.moveTo(150, 120); g.lineTo(210, 92); g.lineTo(300, 96); g.lineTo(360, 120); g.fill(); g.fillStyle = '#1a1840';
  for (const [tx, tw, th] of [[205, 14, 52], [222, 22, 40], [248, 16, 60], [268, 20, 36]]) { g.fillRect(tx, 112 - th, tw, th); g.beginPath(); g.moveTo(tx - 2, 112 - th); g.lineTo(tx + tw / 2, 96 - th); g.lineTo(tx + tw + 2, 112 - th); g.fill(); }
  g.fillStyle = '#5aff6a'; for (const [wx, wy] of [[209, 74], [229, 84], [253, 64], [253, 76], [273, 90], [214, 90]]) g.fillRect(wx, wy, 3, 5); }
function vrSky(M, cx, cy) { const H = Math.round(VH * (OPT && OPT.on ? 0.2 : 0.26)), P = G.P, boss = G.ents.find(e => e.mid === 'luna_sonriente' && !e.dying && e.map === M.id), open = boss && boss.eyes;
  ctx.fillStyle = 'rgba(30,10,60,0.14)'; ctx.fillRect(0, 0, VW, VH);   // noche
  const off = -((cx * 0.1) % 480 + 480) % 480; for (let k = -1; k < Math.ceil(VW / 480) + 1; k++) ctx.drawImage(VR_SKY, Math.round(off + k * 480), 0, 480, H);
  for (let k = 0; k < 6; k++) { ctx.fillStyle = `rgba(${200 + k * 8},40,${200 + k * 6},0.42)`; const y0 = H * 0.18 + k * H * 0.11; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const xx = i * VW / 24, yy = y0 + Math.sin(i * 0.6 + k + G.t * 0.15) * 4; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } for (let i = 24; i >= 0; i--) ctx.lineTo(i * VW / 24, y0 + 5 + Math.sin(i * 0.5 + k * 2 + G.t * 0.1) * 2); ctx.fill(); }
  { const mx = VW * 0.72, my = H * 0.42, r = H * 0.26; const gr = ctx.createRadialGradient(mx, my, 2, mx, my, r * 2); gr.addColorStop(0, 'rgba(255,170,60,0.55)'); gr.addColorStop(1, 'rgba(255,80,40,0)'); ctx.fillStyle = gr; ctx.fillRect(mx - r * 2, my - r * 2, r * 4, r * 4);
    ctx.fillStyle = '#ffb83a'; ctx.beginPath(); ctx.arc(mx, my, r, 0, 7); ctx.fill(); ctx.fillStyle = '#e0701a'; ctx.beginPath(); ctx.arc(mx, my, r, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#c8501a'; ctx.stroke();
    ctx.fillStyle = '#7a2a0a'; for (const s of [-1, 1]) { ctx.beginPath(); if (open) ctx.arc(mx + s * r * 0.35, my - r * 0.2, r * 0.16, 0, 7); else ctx.ellipse(mx + s * r * 0.35, my - r * 0.2, r * 0.22, r * 0.1, 0, Math.PI, 0); ctx.fill(); }
    if (open) { ctx.fillStyle = '#fff4c0'; for (const s of [-1, 1]) ctx.fillRect(mx + s * r * 0.35 - 1 + (P.x - cx - mx) * 0.004, my - r * 0.2 - 1, 2, 2); }
    ctx.fillStyle = '#5a1a06'; ctx.beginPath(); ctx.ellipse(mx, my + r * 0.28, r * 0.55, r * 0.34, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#fff0c0'; for (let i = -4; i <= 3; i++) ctx.fillRect(Math.round(mx + i * r * 0.12), Math.round(my + r * 0.28), Math.max(1, Math.round(r * 0.08)), Math.max(2, Math.round(r * 0.12))); }
  for (let k = 0; k < 4; k++) { const fg = ctx.createLinearGradient(0, H * 0.75 + k * 6, 0, H * 1.35 + k * 6); fg.addColorStop(0, 'rgba(120,80,170,0)'); fg.addColorStop(0.5, 'rgba(140,100,190,0.4)'); fg.addColorStop(1, 'rgba(60,30,90,0)'); ctx.fillStyle = fg; ctx.fillRect(0, H * 0.7 + k * 6, VW, H * 0.7); }
  const lf = ctx.createLinearGradient(0, VH * 0.75, 0, VH); lf.addColorStop(0, 'rgba(90,60,140,0)'); lf.addColorStop(1, 'rgba(90,60,140,0.32)'); ctx.fillStyle = lf; ctx.fillRect(0, VH * 0.75, VW, VH * 0.25);
  const zb = G.ents.find(e => e.mid === 'rey_campanas' && e.dark > G.t && e.map === M.id); if (zb) { ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, VW, VH); }
  if (!(OPT && OPT.on) && Math.random() < 0.5) part(cx + Math.random() * VW, cy + VH * (0.3 + Math.random() * 0.7), { vy: -6, vx: (Math.random() - 0.5) * 8, vz: 4, life: 3, c: Math.random() < 0.5 ? '#9aff7a' : '#d090ff', s: 1 }); }
// objetos del Velo
{ const _g2 = genFurn2; genFurn2 = function (kind) {
  const D = s => C(s);
  if (kind === 'vr_arbol') { const p = new Pix(40, 54); const br = (x0, y0, a, l, d) => { if (d > 4 || l < 2) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; p.line(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), D('#120a1a')); if (d < 2) p.line(Math.round(x0) + 1, Math.round(y0), Math.round(x1) + 1, Math.round(y1), D('#1e1228')); br(x1, y1, a - 0.55, l * 0.7, d + 1); br(x1, y1, a + 0.5, l * 0.66, d + 1); }; p.rect(18, 34, 4, 19, D('#140c1c')); br(20, 36, -Math.PI / 2, 14, 0); p.outline(D('#05030a')); return { c: p.canvas(), ax: 20, ay: 52 }; }
  if (kind === 'vr_sauce') { const p = new Pix(40, 52); p.rect(18, 26, 4, 25, D('#14101e')); p.ball(20, 18, 16, 12, [D('#0a1424'), D('#122238'), D('#1a3050'), D('#24406a')]); for (let x = 6; x < 35; x += 2) p.vl(x, 20 + (x % 3), 14 + (x * 7) % 9, D(x % 4 ? '#122238' : '#1a3050')); p.outline(D('#05030a')); return { c: p.canvas(), ax: 20, ay: 50 }; }
  if (kind === 'vr_lapida') { const p = new Pix(14, 20), S = pal(['#1a1a2a', '#2a2a40', '#3a3a5a', '#5a5a7a', '#7a7aa0']); p.rect(2, 6, 10, 13, S[2]); p.ell(7, 6, 5, 4, S[2]); p.vl(2, 5, 14, S[3]); p.hl(4, 10, 6, S[1]); p.vl(7, 8, 6, S[1]); for (let x = 2; x < 12; x += 3) p.set(x, 18, D('#3aff6a')); p.outline(D('#05030a')); return { c: p.canvas(), ax: 7, ay: 19 }; }
  if (kind === 'vr_farol') { const p = new Pix(10, 30); p.rect(4, 8, 2, 21, D('#1a1428')); p.rect(2, 2, 6, 7, D('#2a2040')); p.rect(3, 3, 4, 5, D('#5aff6a')); p.outline(D('#05030a')); return { c: p.canvas(), ax: 5, ay: 29, light: 1 }; }
  if (kind === 'vr_vela') { const p = new Pix(10, 22); p.rect(3, 8, 4, 13, D('#d8d0e0')); p.rect(4, 3, 2, 5, D('#5aff6a')); p.set(4, 2, D('#c0ffb0')); p.outline(D('#05030a')); return { c: p.canvas(), ax: 5, ay: 21, light: 1 }; }
  if (kind === 'vr_campana') { const p = new Pix(48, 50), B = pal(['#0a3a2a', '#1a6a4a', '#2aa86a', '#6ae0a0', '#c0ffe0']); p.rect(4, 2, 40, 4, D('#2a2038')); p.rect(6, 2, 3, 46, D('#2a2038')); p.rect(39, 2, 3, 46, D('#2a2038')); p.ball(24, 24, 13, 14, B.slice(1)); p.rect(11, 26, 26, 12, B[2]); p.hl(9, 38, 30, B[3]); p.ball(24, 42, 3, 3, B.slice(1)); p.outline(D('#05030a')); return { c: p.canvas(), ax: 24, ay: 48, light: 1 }; }
  if (kind === 'vr_castillo') { const p = new Pix(120, 110), S = pal(['#0e0c22', '#1a1840', '#2a2a5a', '#3a3a7a', '#5a5aa0']); p.rect(10, 50, 100, 59, S[1]); for (const [x, w, hh] of [[8, 20, 70], [34, 18, 56], [58, 22, 96], [86, 24, 64]]) { p.rect(x, 108 - hh, w, hh, S[2]); p.poly([[x - 3, 108 - hh], [x + w / 2, 108 - hh - 18], [x + w + 3, 108 - hh]], S[1]); for (let k = 0; k < 3; k++) p.rect(x + w / 2 - 2, 112 - hh + 10 + k * 16, 4, 6, D('#5aff6a')); }
    for (let x = 10; x < 110; x += 8) p.rect(x, 46, 5, 5, S[2]); p.rect(52, 84, 16, 24, D('#05030a')); p.outline(D('#05030a')); return { c: p.canvas(), ax: 60, ay: 108, light: 1 }; }
  if (kind === 'vr_portal') { const p = new Pix(34, 46), S = pal(['#1a1428', '#2a2040', '#3a3058', '#5a4a7a']), G_ = pal(['#0a5a2a', '#1aa04a', '#5aff8a', '#d0ffe0']); p.rect(2, 8, 6, 37, S[1]); p.rect(26, 8, 6, 37, S[1]); p.ell(17, 9, 15, 8, S[2]); p.ell(17, 11, 10, 6, G_[1]); p.rect(8, 11, 18, 34, G_[1]);
    for (let y = 12; y < 44; y += 3) p.hl(9, y, 16, G_[(y >> 2) % 2 ? 2 : 3]); for (let y = 10; y < 44; y += 6) { p.set(4, y, D('#5aff8a')); p.set(29, y, D('#5aff8a')); } p.outline(D('#05030a')); return { c: p.canvas(), ax: 17, ay: 45, light: 1 }; }
  return _g2(kind); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl(M, cx, cy, list); for (const d of list) if (d.k === 'furn' && /^vr_(farol|vela|campana|portal|castillo)$/.test(d.f) && !d.hidden) out.push({ x: d.px, y: d.py - 16, r: d.f === 'vr_castillo' ? 90 : d.f === 'vr_portal' ? 60 : 34, c: 'rgba(90,255,120,0.45)' }); return out; }; }
// carteles de zona y la franja de islas de Celestia que no aplica aquí
V33_TICKS.push(() => { const M = G.map, P = G.P; if (!M || !M.vr || !P) return; const z = VR_ZONES.findIndex(Z => Math.hypot((P.x / 16 - Z.c[0]) / Z.r[0], (P.y / 16 - Z.c[1]) / Z.r[1]) < 0.9); if (z !== P.vrZ) { P.vrZ = z; if (z >= 0) banner(VR_ZONES[z].n, L2('Nivel ', 'Level ') + VR_ZONES[z].lv[0] + ' - ' + VR_ZONES[z].lv[1]); } });
{ const i = V33_TICKS.findIndex(f => /skyTick\(dt\)/.test(String(f))); if (i >= 0) { const f0 = V33_TICKS[i]; V33_TICKS[i] = function (dt) { const M = G.map, P = G.P; if (M && M.vr && P) P.skyK = SKY_ISLES.findIndex(S => dist2(S.c[0] * 16, S.c[1] * 16, P.x, P.y) < (S.r * 22) * (S.r * 22)); return f0(dt); }; } }

// ---------- el portal antiguo en el mundo, Fenrik y Malvia ----------
NPCS.lobo_viejo = { n: 'Fenrik', title: L2('El Lobo Viejo', 'The Old Wolf'), look: LK({}), lines: [L2('Aúllo a una luna que no es esta. La otra… sonríe.', 'I howl at a moon that is not this one. The other one… smiles.'), L2('Mi manada cruzó la grieta del Velo hace mucho. Yo me quedé a vigilarla.', 'My pack crossed the tear in the Veil long ago. I stayed to watch it.')], quests: [] };
NPCS.malvia = { n: 'Malvia', title: L2('Bruja de los Caminos', 'Witch of the Roads'), look: LK({ outfit: 'witch', hairStyle: 'long', hair: HAIRS.negro, skin: P5(['#3a3a6a', '#5a5a9a', '#7a7ac0', '#a0a0e0', '#d0d0ff']), main: P5(['#14082a', '#2a1050', '#4a2080', '#7a48b8', '#c8a0ff']), g: 'f' }),
  lines: [L2('El portal antiguo solo despierta con esencia de Nihil. Lo que se cuela por la grieta… huele a lo mismo.', 'The ancient portal only wakes with Nihil essence. What seeps through the tear… smells the same.'), L2('Allí las campanas suenan solas. No respondas cuando digan tu nombre.', 'There the bells ring by themselves. Don\'t answer when they say your name.')], quests: [] };
NPCS.oren_campanero = { n: 'Oren', title: L2('El último campanero', 'The last bell-ringer'), look: LK({ outfit: 'robe', hair: HAIRS.blanco, beard: HAIRS.blanco, skin: P5(['#4a5a5a', '#6a7a7a', '#8a9a9a', '#b0c0c0', '#e0f0f0']), main: P5(['#0a1a14', '#1a3a2a', '#2a5a40', '#3a7a5a', '#5aa07a']) }),
  lines: [L2('Toqué la última campana de la aldea y todos se quedaron dormidos para siempre. Ayúdame a callarlas.', 'I rang the village\'s last bell and everyone fell asleep forever. Help me silence them.')], quests: [] };
{ const _na = npcAtlas; npcAtlas = function (id) { if (id === 'lobo_viejo') return mobAtlasFor(MOBS.lobo.art); return _na(id); }; }
const VR_WPOS = { portal: null };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  const [px, py] = freeTileNear(W, 62, 30); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) W.flags[W.I(px + dx, py + dy)] |= 16; addObj(W, 'furn', px, py, { f: 'vr_portal', fp: [[0, 0]] }); VR_WPOS.portal = [px, py];
  const [lx, ly] = freeTileNear(W, 38, 138); W.npcDefs.push({ id: 'lobo_viejo', x: lx, y: ly, face: 'right' });
  const [mx, my] = freeTileNear(W, 30, 97); W.npcDefs.push({ id: 'malvia', x: mx, y: my, face: 'down' }); }; }
SAVEKEYS.push('vrPortal', 'vrSeen');
function goVelo() { const P = G.P, M = makeVelo(); transition(() => { P.inside = 'velo_roto'; P.spRet = P.map === 'world' ? null : P.spRet; if (P.map === 'world') { P.retX = P.x; P.retY = P.y; } setMap(M, VR_GATE[0] * 16 + 8, (VR_GATE[1] + 1) * 16 + 8, 'up'); if (!P.vrSeen) { P.vrSeen = 1; banner(L2('El Velo Roto', 'The Broken Veil'), L2('Por primera vez ves el cielo', 'For the first time you see the sky')); clueUnlock('p_velo_roto'); markDirty(); } }); }
function backFromVelo() { const P = G.P, W = G.world, p = VR_WPOS.portal || [62, 30]; transition(() => { P.inside = null; setMap(W, p[0] * 16 + 8, (p[1] + 2) * 16 + 8, 'down'); }); }
{ const _it = interactTarget; interactTarget = function () { const P = G.P, M = G.map; if (M && !P.dead) { const tx = Math.floor(P.x / 16), ty = Math.floor(P.y / 16); for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const i = tileAt(M, tx + dx, ty + dy); if (i < 0 || M.objAt[i] < 0) continue; const o = M.objs[M.objAt[i]]; if (o.k === 'furn' && o.f === 'vr_portal') return { kind: 'vr_portal', o, label: M.vr ? L2('Volver por el portal', 'Go back through the portal') : L2('Portal antiguo', 'Ancient portal'), icon: 'talk' }; } } return _it(); }; }
{ const _di = doInteract; doInteract = function () { const t = interactTarget(), P = G.P, M = G.map; if (!t || t.kind !== 'vr_portal') return _di();
  if (M.vr) { backFromVelo(); return; } if (!P.vrPortal) { typeText(L2('Un arco de piedra cubierto de musgo que brilla. Está dormido. Dicen que un lobo viejo del Bosque Susurrante sabe cómo despertarlo.', 'A stone arch covered in glowing moss. It is asleep. They say an old wolf in the Whispering Forest knows how to wake it.')); return; }
  if (P.lv < 255) { toast(L2('El portal te rechaza. Vuelve con nivel 255.', 'The portal rejects you. Come back at level 255.'), 'warn', 4); return; } goVelo(); }; }
// misiones: abrir el portal y callar las campanas
q('vr1', { n: L2('El aullido del Velo', 'The Howl of the Veil'), giver: 'lobo_viejo', lv: 250, desc: L2('Fenrik, el Lobo Viejo, dice que solo la bruja Malvia sabe despertar el portal antiguo. Búscala cerca del Pantano Gris.', 'Fenrik, the Old Wolf, says only the witch Malvia knows how to wake the ancient portal. Find her near the Gray Swamp.'),
  obj: [{ t: 'talk', npc: 'malvia', txt: L2('Habla con Malvia', 'Talk to Malvia') }], rew: { xp: 400000, gold: 50000 },
  offer: [L2('Hueles a Vínculo. Hace mil lunas que espero a alguien como tú.', 'You smell of the Bond. I have waited a thousand moons for someone like you.'), L2('Detrás del portal de piedra hay un continente que nació cuando venciste a Nihil: su silencio se coló por una grieta del Velo.', 'Behind the stone portal there is a continent born when you defeated Nihil: its silence seeped through a tear in the Veil.'), L2('Ve a ver a Malvia. Toma mi capucha: allí hace frío.', 'Go see Malvia. Take my hood: it is cold there.')],
  prog: [L2('Malvia vive cerca del Pantano Gris, al oeste.', 'Malvia lives near the Gray Swamp, to the west.')], done: [L2('Así que Fenrik te manda. Bien.', 'So Fenrik sends you. Good.')] });
q('vr2', { n: L2('Llaves de silencio', 'Keys of Silence'), giver: 'malvia', lv: 252, pre: 'vr1', desc: L2('Malvia necesita 3 Esencias de Nihil para despertar el portal antiguo, al oeste de la Ciudadela de Arxar.', 'Malvia needs 3 Nihil Essences to wake the ancient portal, west of the Arxar Citadel.'),
  obj: [{ t: 'item', it: 'esencia_nihil', n: 3, take: true, txt: L2('Trae 3 Esencias de Nihil', 'Bring 3 Nihil Essences') }], rew: { xp: 600000, gold: 80000 },
  offer: [L2('El portal antiguo duerme porque nadie le habla en su idioma: el silencio de Nihil.', 'The ancient portal sleeps because no one speaks to it in its language: Nihil\'s silence.'), L2('Tráeme 3 Esencias de Nihil y lo despertaré. Las sueltan las criaturas de la Corona del Cielo.', 'Bring me 3 Nihil Essences and I will wake it. The creatures of the Crown of the Sky drop them.')],
  prog: [L2('Esencias de Nihil: Corona del Cielo, en Celestia.', 'Nihil Essences: Crown of the Sky, in Celestia.')], done: [L2('Ya está. El portal te espera al oeste de la Ciudadela de Arxar. Allí verás el cielo… y el cielo te verá a ti.', 'It\'s done. The portal waits for you west of the Arxar Citadel. There you will see the sky… and the sky will see you.')] });
const VR_BQ = [['vr3', 'obispo_hueco', L2('Rezos huecos', 'Hollow Prayers'), 276, 'aldea'], ['vr4', 'rey_esqueleto', L2('Una corona de huesos', 'A Crown of Bones'), 295, 'bosque'], ['vr5', 'rey_campanas', L2('La Última Campanada', 'The Last Toll'), 318, 'catedral'], ['vr6', 'luna_sonriente', L2('La Luna que sonríe', 'The Moon that Smiles'), 335, 'castillo']];
VR_BQ.forEach(([id, b, n, lv, z], i) => { const Z = VR_ZONES.find(x => x.k === z); q(id, { n, giver: 'oren_campanero', lv, pre: i ? VR_BQ[i - 1][0] : 'vr2', desc: L2('Vence a ', 'Defeat ') + BOSSES[b].n + L2(' en ', ' in ') + Z.n + '.', obj: [{ t: 'boss', b, loc: [Z.c[0], Z.c[1] - 4] }], rew: { xp: 1500000 + i * 600000, gold: 150000 + i * 80000 },
  offer: [[L2('El Obispo Hueco sigue dando misa a los muertos de mi aldea. Cada rezo los levanta otra vez.', 'The Hollow Bishop still holds mass for the dead of my village. Every prayer raises them again.')], [L2('Varkhul fue rey de este bosque. Sus soldados le cubren con sus cuerpos: derríbalos primero.', 'Varkhul was king of this forest. His soldiers cover him with their bodies: bring them down first.')], [L2('El Rey de las Campanas avisa cada golpe con campanadas. Escucha y aprende. Al final se encierra tras tres sellos.', 'The King of Bells announces every blow with tolls. Listen and learn. At the end he locks himself behind three seals.')], [L2('La Luna Sonriente es la cara que el silencio se puso para que lo miraran. Cuando abra los ojos, todo se enfurece.', 'The Smiling Moon is the face the silence put on so it would be looked at. When it opens its eyes, everything rages.')]][i],
  prog: [Z.n], done: [[L2('Las campanas de la aldea se callan. Gracias.', 'The village bells fall silent. Thank you.')], [L2('El bosque deja de susurrar tu nombre.', 'The forest stops whispering your name.')], [L2('Silencio… por fin un silencio bueno.', 'Silence… finally a good silence.')], [L2('La luna ya no sonríe. Mira: por primera vez en mil años, amanece.', 'The moon no longer smiles. Look: for the first time in a thousand years, dawn breaks.')]][i] }); });
NPCS.lobo_viejo.quests.push('vr1'); NPCS.malvia.quests.push('vr2'); NPCS.oren_campanero.quests.push('vr3', 'vr4', 'vr5', 'vr6');
{ const _cq = completeQuest; completeQuest = function (id) { const r = _cq.apply(this, arguments); const P = G.P;
  if (id === 'vr1') { giveCosmetic('c_capucha_lobo'); giveCosmetic('c_manto_lobo'); }
  if (id === 'vr2') { P.vrPortal = 1; banner(L2('El portal antiguo despierta', 'The ancient portal awakens'), L2('Al oeste de la Ciudadela de Arxar', 'West of the Arxar Citadel')); if (VR_WPOS.portal) P.wp = { x: VR_WPOS.portal[0], y: VR_WPOS.portal[1], t: L2('Portal antiguo', 'Ancient portal') }; }
  if (id === 'vr6' && typeof loreUnlock === 'function' && !(P.loreU || []).includes(CH_VELO_ROTO)) loreUnlock(CH_VELO_ROTO);
  markDirty(); return r; }; }
// lore
const CH_VELO_ROTO = CRON.length;
CRON.push([L2('El Velo Roto', 'The Broken Veil'), L2('Cuando venciste a Nihil, su silencio no desapareció: se coló por una grieta del Velo y pintó al otro lado un continente al revés, donde siempre es de noche y las campanas suenan solas. La Luna Sonriente es la cara que el silencio se puso para que, por fin, alguien lo mirara. Fenrik, el Lobo Viejo, y su manada vigilan la grieta desde entonces; la bruja Malvia aprendió a hablarle al portal en su idioma. Allí los muertos rezan, los reyes no se acuestan y el cielo, por primera vez, se deja ver.', 'When you defeated Nihil, its silence did not vanish: it seeped through a tear in the Veil and painted, on the other side, an inverted continent where it is always night and the bells ring by themselves. The Smiling Moon is the face the silence put on so that, at last, someone would look at it. Fenrik, the Old Wolf, and his pack have watched the tear ever since; the witch Malvia learned to speak to the portal in its own language. There the dead pray, the kings never lie down and the sky, for the first time, lets itself be seen.')]);
ERAS[ERAS.length - 1][1].push(CH_VELO_ROTO);
CLUES.p_velo_roto = ['lugar', L2('El Velo Roto', 'The Broken Veil'), L2('Al otro lado del portal el cielo se ve, y la luna te sonríe.', 'Beyond the portal the sky can be seen, and the moon smiles at you.'), CH_VELO_ROTO];
if (typeof MAPW_LIST !== 'undefined') MAPW_LIST.push({ id: 'velo_roto', n: L2('El Continente del Velo Roto', 'The Broken Veil Continent'), mk: () => makeVelo(), how: L2('Portal antiguo al oeste de la Ciudadela de Arxar (nivel 255, misiones de Fenrik y Malvia).', 'Ancient portal west of the Arxar Citadel (level 255, quests from Fenrik and Malvia).') });
