// ================= v4.15: EL CONTINENTE CELESTIAL DE ALTAVELA =================
// Un reino sobre las nubes conectado a Celestia (portal en la Isla de los Vientos). Continente grande con la capital
// de los Alados supervivientes, las Llanuras de Nimbo, el Templo de Aeris y los Campos de Tormenta, más islotes
// flotantes. Criaturas nuevas dibujadas en código (no se repiten con las del cielo), tres jefes voladores, tormentas
// mágicas con rayos avisados y una investigación que se comparte con tu grupo (ver más abajo).
// Usa la maquinaria del cielo (M.sky): aire transitable con grifo o alas, campamentos de monstruos y jefes.

// ---------- criaturas ----------
const CEL_PAL = {
  arpia: ['#14081e', '#341a46', '#5e3480', '#9a68c8'], mascara: ['#8a8070', '#d8d0c0', '#f4eee0', '#ffffff'], garra: ['#5a3a0a', '#b08020', '#e0c050', '#fff0a0'],
  medusa: ['#3a5a8a', '#7aa8e0', '#c0e0ff', '#ffffff'], rayo: ['#8a6a00', '#e0c020', '#fff060', '#ffffff'], manta: ['#0a2a3a', '#1a5a6a', '#3a9aa0', '#a0f0e8'],
  piedra: ['#3a3848', '#6a6a7a', '#a0a0b0', '#dadae4'], runa: ['#0a4a6a', '#2aa0d0', '#8ae8ff', '#ffffff'], sierpe: ['#0a1430', '#1a3a7a', '#3a7ad0', '#a0d8ff'],
};
function genCel(kind, sc) {
  sc = sc || 1; const S = v => Math.round(v * sc);
  const size = { arpia: [40, 38], medusa: [30, 36], manta: [44, 28], centinela: [32, 40], chispa: [24, 26], sierpe: [56, 40] }[kind] || [32, 32];
  return mobAtlas(S(size[0]), S(size[1]), (p, dir, a, f) => {
    const W = size[0], H = size[1], cx = S(W / 2), flap = (a === 'walk' || a === 'idle') ? f % 2 : a === 'atk' ? 1 : 0, bob = S([0, 1, 2, 1][f % 4]), side = dir === 'left', up = dir === 'up';
    const ball = (x, y, rx, ry, P) => p.ball(S(x), S(y) + bob, S(rx), S(ry), pal(P));
    if (sc > 1.4) { const _l = p.line.bind(p); p.line = (x0, y0, x1, y1, c) => { _l(x0, y0, x1, y1, c); _l(x0 + 1, y0, x1 + 1, y1, c); _l(x0, y0 + 1, x1, y1 + 1, c); }; }
    if (kind === 'arpia') {   // Arpía Maligna: alas moradas, máscara de hueso, ojos rojos y garras doradas
      const Pw = pal(CEL_PAL.arpia), wy = flap ? 4 : 14;
      for (const s of side ? [1] : [-1, 1]) p.poly([[cx + s * S(4), S(15) + bob], [cx + s * S(19), S(wy) + bob], [cx + s * S(17), S(wy + 8) + bob], [cx + s * S(9), S(22) + bob]], Pw[2]);
      for (const s of side ? [1] : [-1, 1]) for (let k = 0; k < 4; k++) p.line(cx + s * S(8 + k * 3), S(18 + k) + bob, cx + s * S(10 + k * 3), S(wy + 6 + k) + bob, Pw[3]);
      ball(W / 2, 20, 6, 8, CEL_PAL.arpia); ball(W / 2 + (side ? -1 : 0), 10, 5, 5, CEL_PAL.mascara);
      if (!up) { const o = side ? -S(2) : 0, k = C('#2a1018'); for (const s of side ? [-1] : [-1, 1]) { p.rect(cx + s * S(2) - S(1) + o, S(9) + bob, S(2), S(2), k); p.set(cx + s * S(2) + o, S(10) + bob, C('#ff2a3a')); } p.poly([[cx - S(1) + o, S(12) + bob], [cx + S(1) + o, S(12) + bob], [cx + o - (side ? S(2) : 0), S(15) + bob]], C(CEL_PAL.garra[2])); p.hl(cx - S(4) + o, S(7) + bob, S(8), C(CEL_PAL.mascara[1])); }
      for (let k = 0; k < 5; k++) p.line(cx - S(5) + k * S(2.5), S(6) + bob, cx - S(6) + k * S(3), S(1) + bob, Pw[1]);   // melena de plumas
      for (const s of [-1, 1]) { p.line(cx + s * S(3), S(27) + bob, cx + s * S(4), S(32) + bob, C(CEL_PAL.garra[1])); p.hl(cx + s * S(4) - S(1), S(33) + bob, S(3), C(CEL_PAL.garra[2])); }
      if (a === 'atk') p.line(cx + S(6), S(20) + bob, cx + S(14), S(28) + bob, C(CEL_PAL.garra[3]));
    } else if (kind === 'medusa') {   // Medusa de Nube: campana translúcida y tentáculos de rayo
      ball(W / 2, 12, 11, 9, CEL_PAL.medusa); p.hl(cx - S(9), S(16) + bob, S(18), C(CEL_PAL.medusa[1]));
      for (let k = 0; k < 5; k++) { const x = cx - S(8) + k * S(4); for (let y = 0; y < S(16); y++) p.set(x + Math.round(Math.sin((y + f * 3 + k) * 0.6) * S(1.5)), S(17) + y + bob, C(y % 4 === 0 ? CEL_PAL.rayo[2] : CEL_PAL.medusa[2])); }
      if (!up) { p.set(cx - S(3), S(12) + bob, C('#20304a')); p.set(cx + S(3), S(12) + bob, C('#20304a')); }
      if (a === 'atk') for (let k = 0; k < 3; k++) p.line(cx, S(20) + bob, cx + S(-8 + k * 8), S(34), C(CEL_PAL.rayo[3]));
    } else if (kind === 'manta') {   // Manta del Viento: raya que planea, aletas que ondulan
      const Pm = pal(CEL_PAL.manta), wy = flap ? -4 : 3;
      p.poly([[cx, S(6) + bob], [cx + S(21), S(12 + wy) + bob], [cx + S(6), S(18) + bob], [cx, S(16) + bob], [cx - S(6), S(18) + bob], [cx - S(21), S(12 + wy) + bob]], Pm[2]);
      p.poly([[cx, S(8) + bob], [cx + S(8), S(13) + bob], [cx, S(15) + bob], [cx - S(8), S(13) + bob]], Pm[3]); p.line(cx, S(16) + bob, cx + (side ? -S(3) : 0), S(26) + bob, Pm[1]);
      if (!up) { p.set(cx - S(4), S(10) + bob, C('#ffffff')); p.set(cx + S(4), S(10) + bob, C('#ffffff')); }
      for (let k = 0; k < 3; k++) p.set(cx - S(12) + k * S(12), S(12 + wy) + bob, Pm[3]);
    } else if (kind === 'centinela') {   // Centinela del Templo: autómata de piedra flotante con ojo rúnico
      ball(W / 2, 14, 10, 9, CEL_PAL.piedra); p.rect(cx - S(7), S(20) + bob, S(14), S(10), pal(CEL_PAL.piedra)[1]); p.hl(cx - S(7), S(20) + bob, S(14), pal(CEL_PAL.piedra)[3]);
      for (const s of [-1, 1]) ball(W / 2 + s * 12, 18 + (a === 'atk' && s === 1 ? -4 : 0), 4, 5, CEL_PAL.piedra);
      if (!up) { ball(W / 2 + (side ? -3 : 0), 13, 3, 3, CEL_PAL.runa); p.set(cx + (side ? -S(3) : 0), S(13) + bob, C('#ffffff')); }
      for (let k = 0; k < 3; k++) p.set(cx - S(4) + k * S(4), S(25) + bob, C(CEL_PAL.runa[2]));
      p.hl(cx - S(4), S(34) + bob, S(8), C(CEL_PAL.runa[1]));
    } else if (kind === 'chispa') {   // Chispa Errante: bola de rayo con cara
      ball(W / 2, 12, 8, 8, CEL_PAL.rayo); for (let k = 0; k < 6; k++) { const an = k * 1.05 + f; p.line(cx, S(12) + bob, cx + Math.round(Math.cos(an) * S(11)), S(12) + bob + Math.round(Math.sin(an) * S(11)), C(CEL_PAL.rayo[k % 2 ? 2 : 3])); }
      if (!up) { p.set(cx - S(3), S(11) + bob, C('#3a2a00')); p.set(cx + S(3), S(11) + bob, C('#3a2a00')); p.hl(cx - S(2), S(15) + bob, S(4), C('#3a2a00')); }
    } else if (kind === 'sierpe') {   // Sierpe de Tormenta: serpiente alada de nubes y rayos
      const Ps = pal(CEL_PAL.sierpe); for (let k = 0; k < 9; k++) { const x = S(8 + k * 4.5), y = S(22 + Math.sin(k * 0.8 + f) * 5) + bob; p.ball(x, y, S(6 - k * 0.3), S(5 - k * 0.3), Ps); if (k % 2 === 0) p.set(x, y - S(4), C(CEL_PAL.rayo[2])); }
      ball(46, 16, 8, 7, CEL_PAL.sierpe); p.poly([[S(50), S(12) + bob], [S(56), S(4) + bob], [S(52), S(14) + bob]], Ps[3]);
      if (!up) { p.set(S(48), S(14) + bob, C('#fff060')); p.set(S(44), S(14) + bob, C('#fff060')); }
      p.poly([[S(26), S(18) + bob], [S(18), S(flap ? 2 : 8) + bob], [S(34), S(16) + bob]], Ps[2]);
      if (a === 'atk') p.line(S(54), S(18) + bob, S(56), S(30) + bob, C(CEL_PAL.rayo[3]));
    }
  });
}
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'cel') return getAtlas('M' + art.join(','), () => genCel(art[1], art[2])); return _ma(art); }; }

// ---------- materiales, monstruos y jefes ----------
const CEL_MATS = [['pluma_maligna', L2('Pluma Maligna', 'Malign Feather'), ['gem', '#9a68c8']], ['gel_tormenta', L2('Gel de Tormenta', 'Storm Gel'), ['gem', '#c0e0ff']], ['nucleo_aeris', L2('Núcleo de Aeris', 'Aeris Core'), ['gem', '#8ae8ff']], ['escama_sierpe', L2('Escama de la Sierpe', 'Wyrm Scale'), ['gem', '#3a7ad0']]];
for (const [id, n, icon] of CEL_MATS) it(id, { n, t: 'mat', stack: true, tier: 15, price: 1800, icon, rar: 4 });
it('frag_mapa', { n: L2('Fragmento de Mapa Roto', 'Broken Map Fragment'), t: 'mat', stack: true, tier: 15, price: 600, icon: ['card', '#d8c090'], rar: 3, d: L2('Cuatro fragmentos forman un mapa. El Archivista de Altavela sabe unirlos.', 'Four fragments make a map. The Altavela Archivist knows how to join them.') });
it('mapa_celeste', { n: L2('Mapa de las Tumbas', 'Map of the Tombs'), t: 'quest', price: 2000, icon: ['card', '#8ae8ff'], rar: 4, d: L2('Lleva a una tumba de los Reyes del Aire. Se gasta al abrir una.', 'Leads to a tomb of the Sky Kings. Used up when you open one.') });
const CEL_MOBS = [
  ['arpia_maligna', L2('Arpía Maligna', 'Malign Harpy'), ['cel', 'arpia'], 'aggro', 1, [236, 242], 'pluma_maligna'],
  ['medusa_nube', L2('Medusa de Nube', 'Cloud Jellyfish'), ['cel', 'medusa'], 'ranged', 1, [238, 244], 'gel_tormenta'],
  ['manta_viento', L2('Manta del Viento', 'Wind Manta'), ['cel', 'manta'], 'charge', 1, [238, 246], 'pluma_maligna'],
  ['centinela_aeris', L2('Centinela de Aeris', 'Aeris Sentinel'), ['cel', 'centinela'], 'aggro', 0, [242, 248], 'nucleo_aeris'],
  ['chispa_errante', L2('Chispa Errante', 'Wandering Spark'), ['cel', 'chispa'], 'ranged', 1, [244, 250], 'gel_tormenta'],
];
for (const [id, n, art, ai, fly, lv, mat] of CEL_MOBS) MOBS[id] = { n, art, reg: ['cielo'], lv, hp: 2.0 + (lv[0] - 236) / 60, atk: 2.4 + (lv[0] - 236) / 80, def: 1.75, spd: ai === 'charge' ? 74 : 56, ai, fly, fam: 'altavela', drops: [[mat, 0.18], ['frag_mapa', 0.07], ['celestita', 0.12]] };
Object.assign(BOSSES, {
  reina_arpia: { n: L2('Kaelyra, Reina de las Arpías', 'Kaelyra, Harpy Queen'), lv: 245, art: ['cel', 'arpia', 2.4], fly: 1, hp: 40, atk: 3, def: 2.7, spd: 58, moves: ['charge', 'volley', 'rain', 'summon', 'blink'], minion: 'arpia_maligna', drops: [['pluma_maligna', 1, 6], ['frag_mapa', 1, 2]], r: 34 },
  coloso_aeris: { n: L2('El Coloso de Aeris', 'The Colossus of Aeris'), lv: 248, art: ['cel', 'centinela', 2.8], hp: 46, atk: 3.1, def: 3, spd: 36, moves: ['slam', 'field', 'nova', 'summon', 'volley'], minion: 'centinela_aeris', drops: [['nucleo_aeris', 1, 6], ['frag_mapa', 1, 2]], r: 38 },
  sierpe_tormenta: { n: L2('Vendaval, la Sierpe de Tormenta', 'Vendaval, the Storm Wyrm'), lv: 250, art: ['cel', 'sierpe', 2.2], fly: 1, hp: 50, atk: 3.2, def: 3, spd: 54, moves: ['volley', 'rain', 'nova', 'blink', 'charge'], minion: 'chispa_errante', drops: [['escama_sierpe', 1, 6], ['frag_mapa', 1, 2]], r: 40 },
});

// ---------- el mapa ----------
const CEL_W = 210, CEL_H = 160, CEL_GATE = [104, 112];
const CEL_ZONES = [
  { k: 'altavela', n: L2('Ciudad de Altavela', 'City of Altavela'), c: [104, 100], r: 12, lv: null },
  { k: 'nimbo', n: L2('Llanuras de Nimbo', 'Nimbus Plains'), c: [56, 82], r: 24, lv: [236, 244] },
  { k: 'aeris', n: L2('Templo de Aeris', 'Temple of Aeris'), c: [104, 42], r: 20, lv: [242, 248] },
  { k: 'tormenta', n: L2('Campos de Tormenta', 'Storm Fields'), c: [156, 78], r: 24, lv: [244, 250] },
  { k: 'nidos', n: L2('Nidos de la Reina', 'Queen\'s Nests'), c: [36, 134], r: 13, lv: [240, 246] },
];
// estelas (lengua de los Vientos) y tumbas de los Reyes del Aire
const CEL_STELE = [[70, 70], [44, 92], [96, 30], [118, 50], [146, 66], [168, 92], [36, 128], [180, 132]];
const CEL_TOMBS = [[22, 64], [186, 40], [176, 136]];
function makeCeleste() {
  if (G.maps.reino_celeste) return G.maps.reino_celeste; const w = CEL_W, h = CEL_H, N = w * h, I = (x, y) => y * w + x;
  const M = { id: 'reino_celeste', w, h, ter: new Uint8Array(N).fill(T.DEEP), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0, music: 'town', I, sky: 1, camps: [], bossAt: [], halos: [], temples: [], cel: 1, stelae: [], tombs: [], storms: [] };
  const set = (x, y, t) => { if (x > 1 && y > 1 && x < w - 2 && y < h - 2) M.ter[I(x, y)] = T[t]; };
  const land = (cx, cy, rx, ry, t, seed) => { for (let y = cy - ry - 4; y <= cy + ry + 4; y++) for (let x = cx - rx - 4; x <= cx + rx + 4; x++) { const d = Math.hypot((x - cx) / rx, (y - cy) / ry) + (hash2(x, y, seed) - 0.5) * 0.22 + Math.sin(x * 0.2 + seed) * 0.04; if (d < 1) set(x, y, t); } };
  land(104, 80, 78, 52, 'GRASS', 3);                                // el continente
  land(56, 82, 26, 22, 'GRASS', 4); land(104, 42, 22, 16, 'FLOOR', 5); land(156, 78, 26, 22, 'DIRT', 6); land(104, 100, 14, 11, 'COBBLE', 7);
  for (let y = 70; y <= 90; y++) for (let x = 140; x <= 172; x++) if (M.ter[I(x, y)] === T.DIRT && hash2(x, y, 9) < 0.3) set(x, y, 'ASH');
  land(36, 134, 13, 9, 'SNOW', 11); land(22, 64, 8, 6, 'GRASS', 12); land(186, 40, 9, 7, 'SNOW', 13); land(176, 136, 10, 7, 'GRASS', 14); land(180, 120, 5, 4, 'GRASS', 15);
  for (let x = CEL_GATE[0] - 3; x <= CEL_GATE[0] + 3; x++) for (let y = CEL_GATE[1] - 2; y <= CEL_GATE[1] + 1; y++) set(x, y, 'PLANK');
  for (let y = 58; y <= 92; y++) for (let x = 103; x <= 105; x++) if (M.ter[I(x, y)] !== T.DEEP) set(x, y, 'COBBLE');   // avenida al templo
  for (let x = 70; x <= 140; x++) for (let y = 99; y <= 100; y++) if (M.ter[I(x, y)] !== T.DEEP) set(x, y, 'COBBLE');
  prepPalettes(M); M.exit = { x: -9, y: -9 }; initMapObjs(M);
  const R = new RNG(SEED + 7171), free = (x, y) => { const i = I(x, y); return M.ter[i] !== T.DEEP && M.objAt[i] < 0; };
  const F = (f, x, y, o) => free(x, y) ? addObj(M, 'furn', x, y, Object.assign({ f, fp: [[0, 0]] }, o || {})) : null;
  const O = (k, x, y, o) => free(x, y) ? addObj(M, k, x, y, o || {}) : null;
  // capital: casas blancas, faroles y estandartes
  for (const [x, y] of [[96, 93], [112, 93], [94, 104], [114, 104]]) O('statue', x, y, { v: x });
  for (const [x, y, c] of [[98, 103, '#5aa0e0'], [110, 103, '#c8a0ff']]) O('stall', x, y, { col: c, fp: [[0, 0], [1, 0]] });
  for (const [x, y] of [[100, 96], [108, 96], [100, 106], [108, 106]]) O('lantern', x, y); O('fountain', 104, 100, { fp: [[0, 0], [-1, 0], [1, 0]] }); O('banner', 104, 92, { col: '#5aa0e0' });
  // templo de Aeris: anillo de columnas
  for (let a = 0; a < 12; a++) O('pillar', Math.round(104 + Math.cos(a / 12 * 6.28) * 12), Math.round(42 + Math.sin(a / 12 * 6.28) * 8), { v: a });
  // decoración y cristales
  for (let k = 0; k < 220; k++) { const x = R.int(30, 180), y = R.int(30, 130); if (Math.hypot(x - 104, y - 100) < 16) continue; const t = M.ter[I(x, y)]; F(t === T.ASH || t === T.DIRT ? (k % 3 ? 's_rockb0' : 'skycrystal') : t === T.FLOOR ? 'skycrystal' : k % 3 === 0 ? 'flowers' : k % 3 === 1 ? 'bhedge' : 'plant', x, y); }
  for (let k = 0; k < 10; k++) F('skychest', R.int(30, 180), R.int(30, 132), { chestK: 40 + k });
  CEL_STELE.forEach(([x, y], i) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (M.ter[I(x + dx, y + dy)] === T.DEEP) set(x + dx, y + dy, 'GRASS'); const o = addObj(M, 'furn', x, y, { f: 'cel_stele', st: i, fp: [[0, 0]] }); M.stelae.push(o); });
  CEL_TOMBS.forEach(([x, y], i) => { const o = addObj(M, 'furn', x, y, { f: 'cel_tomb', tb: i, fp: [[0, 0], [-1, 0], [1, 0]] }); M.tombs.push(o); });
  // monstruos y jefes
  CEL_ZONES.forEach((Z, z) => { if (!Z.lv) return; const pool = { nimbo: ['arpia_maligna', 'manta_viento'], aeris: ['centinela_aeris', 'chispa_errante'], tormenta: ['medusa_nube', 'chispa_errante', 'manta_viento'], nidos: ['arpia_maligna'] }[Z.k];
    for (let j = 0; j < 7; j++) { const a = j / 7 * 6.28 + z, rr = Z.r * 0.7; M.camps.push({ x: Math.round(Z.c[0] + Math.cos(a) * rr), y: Math.round(Z.c[1] + Math.sin(a) * rr * 0.8), mob: pool[j % pool.length], lv: R.int(Z.lv[0], Z.lv[1]), n: 3, alive: [], isl: z }); } });
  M.bossAt.push({ x: 36, y: 131, id: 'reina_arpia', k: 'nidos' }, { x: 104, y: 38, id: 'coloso_aeris', k: 'aeris' }, { x: 164, y: 72, id: 'sierpe_tormenta', k: 'tormenta' });
  // gente de Altavela (Alados que sobrevivieron a la Guerra del Hilo)
  spawnNPC('cel_reina', 104 * 16 + 8, 96 * 16 + 8, 'reino_celeste', { face: 'down' }); spawnNPC('cel_archivista', 98 * 16 + 8, 99 * 16 + 8, 'reino_celeste', { face: 'right' });
  spawnNPC('cel_mercader', 110 * 16 + 8, 99 * 16 + 8, 'reino_celeste', { face: 'left' }); spawnNPC('cel_vigia', CEL_GATE[0] * 16 + 8, (CEL_GATE[1] - 3) * 16 + 8, 'reino_celeste', { face: 'down' });
  M.wdist = null; G.maps.reino_celeste = M; return M;
}
const CEL_SKIN = P5(['#8a6a5a', '#c8a088', '#e8c8a8', '#f8e0c8', '#fff4e8']);
NPCS.cel_reina = { n: 'Lyssandra', title: L2('Reina de Altavela', 'Queen of Altavela'), look: LK({ hair: HAIRS.blanco, hairStyle: 'long', outfit: 'royal', skin: CEL_SKIN, main: P5(['#3a5a8a', '#5a8ac8', '#8ab8f0', '#c8e0ff', '#ffffff']), sec: GOLD.slice(1).concat([C('#ffffff')]) }),
  lines: [L2('Somos lo que quedó de los Alados. Navegamos las nubes desde que cayó el Telar.', 'We are what remained of the Winged. We have sailed the clouds since the Loom fell.'), L2('Las tormentas son cada año más fuertes. Algo tira de los hilos del cielo.', 'The storms grow stronger every year. Something is pulling at the threads of the sky.'), L2('Nuestra lengua es la que enseñamos al mundo de abajo. Nadie la recuerda entera.', 'Our tongue is the one we taught the world below. No one remembers all of it.')], quests: [] };
NPCS.cel_archivista = { n: 'Orelio', title: L2('Archivista de Altavela', 'Archivist of Altavela'), look: LK({ hair: HAIRS.gris || HAIRS.blanco, beard: HAIRS.gris || HAIRS.blanco, outfit: 'robe', skin: CEL_SKIN, main: P5(['#3a2a5a', '#5a4a8a', '#8a7ab8', '#b8a8e0', '#e8e0ff']) }),
  lines: [L2('Mapas rotos, estelas en la lengua de los Vientos, tumbas de reyes… Todo junto cuenta una sola historia.', 'Broken maps, stelae in the Wind tongue, tombs of kings… Together they tell one story.'), L2('Investigar solo es lento. Con amigos, cada uno trae una pieza.', 'Researching alone is slow. With friends, everyone brings a piece.')], quests: [] };
NPCS.cel_mercader = { n: 'Brisa', title: L2('Mercader de los Vientos', 'Wind Merchant'), look: LK({ hair: HAIRS.rubio || HAIRS.castano, hairStyle: 'long', outfit: 'dress', skin: CEL_SKIN, main: P5(['#2a6a7a', '#3a9aa8', '#6ac8d0', '#a8f0f0', '#e8ffff']) }), lines: [L2('Plumas, geles y núcleos. Aquí todo se paga con lo que da el cielo.', 'Feathers, gels and cores. Here everything is paid with what the sky gives.')], quests: [] };
NPCS.cel_vigia = { n: 'Aerin', title: L2('Vigía de la Puerta', 'Gate Watcher'), look: LK({ hair: HAIRS.negro, outfit: 'knight', skin: CEL_SKIN, main: P5(['#5a6a7a', '#8a9aa8', '#c0ccd8', '#e8eef4', '#ffffff']), sec: P5(['#2a4a8a', '#3a6ac0', '#5a8ae0', '#8ab0f0', '#c0d8ff']) }),
  lines: [L2('La puerta vuelve a Celestia, a la Isla de los Vientos.', 'The gate leads back to Celestia, to the Isle of Winds.'), L2('Si ves el cielo ponerse morado, busca refugio: los rayos avisan antes de caer.', 'If you see the sky turn purple, take cover: the lightning warns before it strikes.')], quests: [] };
NPC_CAT.cel_archivista = 'lore'; NPC_CAT.cel_mercader = 'store';
// ---------- portal en la Isla de los Vientos (Celestia) y vuelta ----------
{ const _mk = makeSky; makeSky = function () { const fresh = !G.maps.cielo; const M = _mk(); if (fresh || !M.celGate) { M.celGate = 1; const [cx, cy] = SKY_ISLES[1].c, x = cx + 20, y = cy - 8; for (let dy = -1; dy <= 1; dy++) for (let dx = -2; dx <= 2; dx++) M.ter[M.I(x + dx, y + dy)] = T.PLANK; M.chunks = new Map(); if (M.objAt[M.I(x, y)] < 0) addObj(M, 'furn', x, y, { f: 'cel_portal', fp: [[0, 0]] }); } return M; }; }
function goCeleste() { const P = G.P, M = makeCeleste(); transition(() => { P.inside = 'reino_celeste'; setMap(M, CEL_GATE[0] * 16 + 8, (CEL_GATE[1] - 1) * 16 + 8, 'up'); if (!P.celSeen) { P.celSeen = 1; banner(L2('Altavela', 'Altavela'), L2('El Continente Celestial', 'The Celestial Continent')); clueUnlock('p_altavela'); markDirty(); } }); }
function backToSky() { const P = G.P, M = makeSky(), [cx, cy] = SKY_ISLES[1].c; transition(() => { P.inside = 'cielo'; setMap(M, (cx + 20) * 16 + 8, (cy - 6) * 16 + 8, 'down'); }); }
SAVEKEYS.push('celSeen', 'cel');
// los objetos nuevos
{ const _g2 = genFurn2; genFurn2 = function (kind) {
  if (kind === 'cel_portal') { const p = new Pix(30, 40), s = pal(['#3a4a6a', '#6a7aa8', '#a8b8e0', '#e8f0ff']), g = pal(['#1a5aa8', '#3a9ae8', '#8ad8ff', '#ffffff']); p.rect(2, 6, 4, 33, s[1]); p.rect(24, 6, 4, 33, s[1]); p.ell(15, 8, 13, 7, s[2]); p.ell(15, 9, 9, 5, g[1]); p.rect(6, 9, 18, 30, g[1]); for (let y = 10; y < 38; y += 3) p.hl(8, y, 14, g[(y >> 2) % 2 ? 2 : 3]); p.outline(OUTL); return { c: p.canvas(), ax: 15, ay: 39, light: 1 }; }
  if (kind === 'cel_stele') { const p = new Pix(16, 28), s = pal(['#4a4a5a', '#7a7a8a', '#b0b0c0', '#e0e0ea']); p.rect(3, 4, 10, 23, s[1]); p.ell(8, 4, 5, 3, s[2]); p.vl(3, 4, 23, s[3]); for (let y = 8; y < 24; y += 3) for (let x = 5; x < 11; x += 2) if (hash2(x, y, 4) < 0.7) p.set(x, y, C('#8ae8ff')); p.outline(OUTL); return { c: p.canvas(), ax: 8, ay: 27 }; }
  if (kind === 'cel_tomb') { const p = new Pix(44, 30), s = pal(['#3a3848', '#6a6a7a', '#a0a0b0', '#dadae4']); p.rect(2, 10, 40, 19, s[1]); p.hl(2, 10, 40, s[3]); p.poly([[0, 10], [22, 0], [44, 10]], s[2]); p.rect(17, 15, 10, 14, C('#14101c')); for (let x = 6; x < 40; x += 6) p.set(x, 20, C('#8ae8ff')); p.ball(22, 6, 3, 2, pal(['#7a5a0a', '#c8a020', '#ffd040', '#fff8c0'])); p.outline(OUTL); return { c: p.canvas(), ax: 22, ay: 29 }; }
  return _g2(kind); }; }
{ const _cl = collectLights; collectLights = function (M, cx, cy, list) { const out = _cl(M, cx, cy, list); for (const d of list) if (d.k === 'furn' && (d.f === 'cel_portal' || d.f === 'cel_stele') && !d.hidden) out.push({ x: d.px, y: d.py - 14, r: d.f === 'cel_portal' ? 60 : 30, c: 'rgba(120,200,255,0.5)' }); return out; }; }

// ---------- tormentas mágicas ----------
// Nubes de tormenta que cruzan el continente. Dentro el cielo se oscurece y caen rayos: primero un aviso en el
// suelo y al momento el rayo. Si sigues dentro del círculo, duele.
function celStormTick(dt) {
  const M = G.map, P = G.P; if (!M || !M.cel || !P || P.dead) return;
  if (M.storms.length < 3 && Math.random() < dt * 0.05) { const z = CEL_ZONES[1 + Math.floor(Math.random() * 3)]; M.storms.push({ x: (z.c[0] + (Math.random() - 0.5) * 30) * 16, y: (z.c[1] + (Math.random() - 0.5) * 20) * 16, vx: (Math.random() - 0.5) * 18, vy: (Math.random() - 0.5) * 10, r: 120 + Math.random() * 60, life: 50 + Math.random() * 40, t: 0, nx: 1 }); }
  M.storms = M.storms.filter(s => (s.t += dt) < s.life);
  for (const s of M.storms) { s.x += s.vx * dt; s.y += s.vy * dt; s.nx -= dt; const inside = Math.hypot(P.x - s.x, P.y - s.y) < s.r;
    if (s.nx <= 0) { s.nx = (OPT && OPT.on ? 1.8 : 1.2) + Math.random(); const near = inside && Math.random() < 0.6, a = Math.random() * 6.28, d = Math.random() * s.r * 0.8, x = near ? P.x + (Math.random() - 0.5) * 30 : s.x + Math.cos(a) * d, y = near ? P.y + (Math.random() - 0.5) * 20 : s.y + Math.sin(a) * d * 0.7;
      addFx({ type: 'field', ground: true, x, y, r: 22, dur: 0.75, col: '#ffe060' });
      setTimeout(() => { if (G.map !== M) return; addFx({ type: 'bolt', x, y: y - 140, x2: x, y2: y, dur: 0.3, col: '#fff8a0' }); addFx({ type: 'ring', x, y, r: 26, dur: 0.35, col: '#c0a0ff' }); burst(x, y, 12, { sp: 70, up: 40, g: 120, life: 0.5, c: ['#ffffff', '#fff060', '#a080ff'] }); sfx('hit');
        if (!G.P.dead && Math.hypot(G.P.x - x, G.P.y - y) < 24) hurtPlayer(G.P.S.maxhp * 0.16, { lv: 248 }); }, 750); } }
}
V33_TICKS.push(celStormTick);
{ const _dk = darkness; darkness = function () { const v = _dk.apply(this, arguments), M = G.map, P = G.P; if (!M || !M.cel || !P) return v; const s = M.storms.find(s => Math.hypot(P.x - s.x, P.y - s.y) < s.r * 1.3); return s ? Math.max(v, 0.35) : v; }; }
{ const _dw = drawWeather; drawWeather = function (cx, cy, after) { _dw(cx, cy, after); const M = G.map, P = G.P; if (!M || !M.cel || !P || !after) return; const s = M.storms.find(s => Math.hypot(P.x - s.x, P.y - s.y) < s.r * 1.3); if (!s) return;
  ctx.fillStyle = 'rgba(70,40,120,0.18)'; ctx.fillRect(0, 0, VW, VH); if (OPT && OPT.on) return; ctx.strokeStyle = 'rgba(200,210,255,0.5)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k < 40; k++) { const x = (k * 53 + G.t * 300) % VW, y = (k * 97 + G.t * 520) % VH; ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 9); } ctx.stroke(); }; }
// carteles de zona al entrar
V33_TICKS.push(() => { const M = G.map, P = G.P; if (!M || !M.cel || !P) return; const z = CEL_ZONES.findIndex(Z => Math.hypot(P.x / 16 - Z.c[0], P.y / 16 - Z.c[1]) < Z.r); if (z !== P.celZ) { P.celZ = z; if (z >= 0) { const Z = CEL_ZONES[z]; banner(Z.n, Z.lv ? L2('Nivel ', 'Level ') + Z.lv[0] + ' - ' + Z.lv[1] : L2('Capital de los Alados', 'Capital of the Winged')); } } });
// la banda de islas de Celestia no aplica aquí
{ const i = V33_TICKS.indexOf(skyTick); if (i >= 0) V33_TICKS[i] = function (dt) { const M = G.map, P = G.P; if (M && M.cel && P) P.skyK = SKY_ISLES.findIndex(S => dist2(S.c[0] * 16, S.c[1] * 16, P.x, P.y) < (S.r * 22) * (S.r * 22)); return skyTick(dt); }; }
