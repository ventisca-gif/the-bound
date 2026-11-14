// ================= v4.29: EL ARCHIPIÉLAGO VIVO — Puerto Esmeralda, isleños, bikinis, Surf y Arte (oficios nuevos),
// la Ciudad Perdida de Ixtal (puzle de estatuas) con dos mazmorras de nivel 300 y experiencia revisada =================

// ---------- experiencia: del 251 al 350 hacían falta ~70 enemigos por nivel (antes ~50); ahora ~50 en todo el juego ----------
{ const _ms = mobStats; mobStats = function (def, lv, boss) { const s = _ms.apply(this, arguments); if (!boss && lv > 250) s.xp = Math.floor(s.xp * 1.4); return s; }; }

// ---------- bikini: usa el tipo «swim» con bik: 1 (piel en el vientre, top y braguita del color) ----------
fitKind('body', 'swim', (p, A, s) => { if (!s.bik || !A.sk) return; const { tx0, tw, torsoTop: ty, th, side, up, cx } = A, SKc = A.sk, R = tx0 + tw - 1, m = s.m, top0 = ty + 1, top1 = ty + Math.max(2, Math.round(th * 0.32)), bot0 = ty + th - 2;
  for (let y = ty; y < ty + th; y++) for (let x = tx0; x <= R; x++) { if (!uA(p.get(x, y))) continue;
    if (y >= bot0) p.set(x, y, m[y === bot0 ? 3 : 2]);
    else if (y >= top0 && y <= top1 && (!up || y === top0 + 1)) p.set(x, y, m[y === top0 ? 3 : 2]);
    else p.set(x, y, SKc[x === tx0 || x === R ? 1 : 2]); }
  if (!up && !side) { p.set(cx - 1, top1, m[1]); p.set(cx, top1, SKc[1]); p.set(cx - 1, ty + Math.round(th * 0.62), SKc[1]); }
  if (!up) for (let x = tx0 + 1; x < R; x += 3) p.set(x, bot0, m[4]); }, { skin: true });
const BIKINIS = [['c_bikini_rojo', L2('Bikini Rojo', 'Red Bikini'), CLOTH.rojo], ['c_bikini_azul', L2('Bikini Azul', 'Blue Bikini'), CLOTH.azul], ['c_bikini_flores', L2('Bikini de Flores', 'Flower Bikini'), P5(['#8a1a4a', '#d0306a', '#ff6a9a', '#ffd040', '#fff4b0'])], ['c_bikini_negro', L2('Bikini Negro', 'Black Bikini'), CLOTH.negro], ['c_bikini_blanco', L2('Bikini Blanco', 'White Bikini'), CLOTH.blanco]];
for (const [id, n, col] of BIKINIS) cosm(id, n, 'body', () => ({ k: 'swim', bik: 1, m: col, s: col }), { src: L2('Ailani · Puerto Esmeralda', 'Ailani · Emerald Port') });
const BEACH_SHOP = [...BIKINIS.map(b => [b[0], 12000]), ['c_hawaiana', 9000], ['c_hawaiana_roja', 9000], ['c_bermuda', 7000], ['c_pareo', 7000], ['c_banador', 8000], ['c_banador_rojo', 8000]];

// ---------- dibujos del archipiélago ----------
{ const _ge = genFurn2; genFurn2 = function (kind) { const D = s => C(s);
  if (kind === 'ar_cabana') { const p = new Pix(52, 48), W = pal(['#3a2410', '#6a4420', '#9a6a3a', '#c89a5a']), Th = pal(['#6a5a1a', '#a8902a', '#d8c050', '#f8e890']);
    p.rect(8, 22, 36, 25, W[2]); for (let x = 9; x < 44; x += 4) p.vl(x, 22, 25, W[1]); p.rect(4, 44, 44, 3, W[1]);
    p.poly([[0, 24], [26, 2], [52, 24]], Th[1]); for (let y = 6; y < 24; y += 3) for (let x = 26 - (y - 2); x < 26 + (y - 2); x += 2) p.set(x, y, Th[(x + y) % 3 + 1]); p.hl(0, 24, 52, Th[0]);
    p.rect(21, 30, 10, 14, D('#2a1408')); p.rect(11, 29, 7, 6, D('#8ad0ff')); p.rect(34, 29, 7, 6, D('#8ad0ff')); for (const x of [6, 46]) { p.vl(x, 24, 22, W[0]); p.set(x, 30, D('#ff5a7a')); p.set(x, 34, D('#ffd040')); }
    p.outline(D('#1a0e06')); return { c: p.canvas(), ax: 26, ay: 47, light: 0 }; }
  if (kind === 'ar_palma') { const p = new Pix(40, 60), Tr = pal(['#4a2a10', '#7a4a20', '#a8703a']), L_ = pal(['#0a3a1a', '#1a6a2a', '#3a9a3a', '#7ad05a']);
    for (let y = 18; y < 60; y++) { const x = Math.round(20 + Math.sin(y / 9) * 3); p.hl(x - 2, y, 4, Tr[(y % 4 === 0) ? 0 : 1]); p.set(x - 2, y, Tr[2]); }
    for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28 + 0.4; for (let r = 0; r < 17; r++) { const x = Math.round(21 + Math.cos(a) * r), y = Math.round(16 + Math.sin(a) * r * 0.55 + r * r * 0.025); p.set(x, y, L_[r < 4 ? 1 : 2]); p.set(x, y + 1, L_[1]); if (r % 3 === 0) p.set(x, y - 1, L_[3]); } }
    p.ball(19, 19, 2, 2, [D('#3a2410'), D('#6a4420'), D('#8a5a2a'), D('#a8703a')]); p.ball(23, 20, 2, 2, [D('#3a2410'), D('#6a4420'), D('#8a5a2a'), D('#a8703a')]); p.outline(D('#0a1a0a')); return { c: p.canvas(), ax: 20, ay: 59, light: 0 }; }
  if (kind === 'ar_tiki') { const p = new Pix(14, 40), W = pal(['#3a2410', '#6a4420', '#9a6a3a']); p.rect(5, 12, 4, 28, W[1]); p.vl(6, 12, 28, W[2]); p.rect(3, 8, 8, 5, W[0]);
    p.ball(7, 5, 3, 4, [D('#c02a0a'), D('#ff6a1a'), D('#ffc040'), D('#fff0a0')]); p.outline(D('#1a0e06')); return { c: p.canvas(), ax: 7, ay: 39, light: 1 }; }
  if (kind === 'ar_galeria') { const p = new Pix(62, 56), Wl = pal(['#8a6a4a', '#c8a07a', '#e8c8a0', '#fff0d8']);
    p.rect(4, 18, 54, 37, Wl[2]); p.hl(4, 18, 54, Wl[3]); p.rect(2, 12, 58, 7, D('#c02a4a')); for (let x = 2; x < 60; x += 6) p.rect(x, 12, 3, 7, D('#ffffff'));
    p.rect(26, 38, 10, 17, D('#3a2410')); for (const [x, c] of [[8, '#4a8aff'], [16, '#ffd040'], [40, '#ff5a7a'], [48, '#5ad06a']]) { p.rect(x, 24, 7, 9, D('#5a3a1a')); p.rect(x + 1, 25, 5, 7, D(c)); p.set(x + 2, 27, D('#ffffff')); }
    p.rect(18, 4, 26, 8, D('#2a1a10')); for (let x = 20; x < 42; x += 3) p.set(x, 8, D(['#ff5a7a', '#ffd040', '#4a8aff', '#5ad06a'][x % 4])); p.outline(D('#1a0e06')); return { c: p.canvas(), ax: 31, ay: 55, light: 1 }; }
  if (kind === 'ar_surf') { const p = new Pix(44, 40), W = pal(['#3a2410', '#6a4420', '#9a6a3a']); p.rect(2, 30, 40, 4, W[1]); for (const x of [4, 40]) p.rect(x - 1, 8, 3, 32, W[0]);
    [['#ff5a3a', '#ffd040'], ['#3a8aff', '#ffffff'], ['#5ad06a', '#ffd040'], ['#ff8ad0', '#ffffff']].forEach(([a, b], k) => { const x = 9 + k * 8; p.ell(x, 18, 3, 14, D(a)); p.vl(x, 6, 24, D(b)); }); p.outline(D('#1a0e06')); return { c: p.canvas(), ax: 22, ay: 39, light: 0 }; }
  if (kind === 'ar_puesto') { const p = new Pix(40, 38), W = pal(['#3a2410', '#6a4420', '#9a6a3a']); p.rect(4, 20, 32, 16, W[2]); p.hl(4, 20, 32, W[1]); for (const x of [5, 34]) p.rect(x, 6, 2, 16, W[0]);
    p.rect(2, 2, 36, 6, D('#ffd040')); for (let x = 2; x < 38; x += 6) p.rect(x, 2, 3, 6, D('#ff5a3a')); for (let k = 0; k < 6; k++) p.ball(9 + k * 4, 18, 2, 2, [D('#7a0a0a'), D(['#ff3a2a', '#ffd040', '#5ad06a'][k % 3]), D('#ffffff'), D('#ffffff')]); p.outline(D('#1a0e06')); return { c: p.canvas(), ax: 20, ay: 37, light: 0 }; }
  if (kind === 'ar_templo') { const p = new Pix(76, 70), S = pal(['#1a2a1a', '#2a4a2a', '#4a6a3a', '#7a9a5a', '#b0c890']);
    for (let k = 0; k < 4; k++) { const w = 70 - k * 14, y = 66 - k * 12; p.rect(38 - w / 2, y - 12, w, 12, S[1 + (k % 2)]); p.hl(38 - w / 2, y - 12, w, S[3]); for (let x = 38 - w / 2 + 2; x < 38 + w / 2 - 2; x += 5) p.set(x, y - 6, S[0]); }
    p.rect(30, 46, 16, 20, D('#0a0a0a')); p.ell(38, 46, 8, 5, D('#0a0a0a')); for (let k = 0; k < 6; k++) p.set(31 + k * 3, 45, D('#ffd040'));
    for (let a = 0; a < 6.28; a += 0.4) p.set(Math.round(38 + Math.cos(a) * 6), Math.round(14 + Math.sin(a) * 5), D('#ffd040')); p.ball(38, 14, 3, 3, [D('#c07a0a'), D('#ffd040'), D('#fff0a0'), D('#ffffff')]);
    for (let k = 0; k < 40; k++) p.set(4 + Math.floor(hash2(k, 3, 9) * 68), 20 + Math.floor(hash2(k, 4, 9) * 46), D(k % 2 ? '#2a6a2a' : '#4a9a3a')); p.outline(D('#050a05')); return { c: p.canvas(), ax: 38, ay: 69, light: 0 }; }
  if (kind.startsWith('ar_estatua')) { const v = +kind.slice(10) || 0, p = new Pix(22, 40), S = pal(['#2a3a2a', '#4a6a4a', '#7a9a6a', '#a8c890']); p.rect(3, 30, 16, 9, S[1]); p.hl(3, 30, 16, S[3]);
    p.rect(7, 10, 8, 20, S[2]); p.ball(11, 8, 5, 5, S.concat([S[3]]).slice(0, 4)); const g = D('#ffd040'), dx = [0, 1, 0, -1][v], dy = [-1, 0, 1, 0][v];
    if (v === 2) { p.set(9, 8, g); p.set(13, 8, g); p.hl(10, 11, 3, D('#1a2a1a')); } else if (v === 0) { p.hl(8, 6, 7, S[0]); } else { p.set(11 + dx * 3, 8, g); p.set(11 + dx * 5, 9, S[3]); }
    p.line(11, 30, 11 + dx * 8, 34 + dy * 3, g); p.set(11 + dx * 8, 34 + dy * 3, D('#ffffff')); p.outline(D('#050a05')); return { c: p.canvas(), ax: 11, ay: 39, light: 0 }; }
  if (kind === 'ar_tablilla') { const p = new Pix(24, 26), S = pal(['#2a3a2a', '#4a6a4a', '#7a9a6a', '#a8c890']); p.rect(2, 2, 20, 22, S[1]); p.hl(2, 2, 20, S[3]); for (let y = 6; y < 22; y += 3) for (let x = 5; x < 20; x += 2) if (hash2(x, y, 5) < 0.6) p.set(x, y, D('#ffd040'));
    p.outline(D('#050a05')); return { c: p.canvas(), ax: 12, ay: 25, light: 1 }; }
  if (kind === 'ar_escalera') { const p = new Pix(34, 26); for (let k = 0; k < 5; k++) { p.rect(2 + k * 2, 4 + k * 4, 30 - k * 4, 4, D(['#7a6a4a', '#5a4a3a', '#3a2e24', '#241c16', '#120c08'][k])); } p.outline(D('#050505')); return { c: p.canvas(), ax: 17, ay: 25, light: 0 }; }
  if (kind === 'ar_salida') { const p = new Pix(30, 40); p.ell(15, 22, 12, 17, D('#ffd040')); p.ell(15, 22, 10, 15, D('#fff4c0')); p.ell(15, 22, 7, 12, D('#ffffff')); p.outline(D('#5a3a00')); return { c: p.canvas(), ax: 15, ay: 39, light: 1 }; }
  if (kind === 'ar_antorcha') { const p = new Pix(10, 30); p.rect(4, 10, 2, 20, D('#3a2410')); p.ball(5, 6, 3, 4, [D('#c02a0a'), D('#ff6a1a'), D('#ffc040'), D('#fff0a0')]); p.outline(D('#1a0e06')); return { c: p.canvas(), ax: 5, ay: 29, light: 1 }; }
  return _ge(kind); }; }

// ---------- isleños de Puerto Esmeralda (dibujados como héroes: bikinis, camisas hawaianas, bermudas) ----------
const ISL_APP = {
  ar_maile: [{ g: 'f', skin: 3, hair: 'negro', hs: 3, eyes: 'cafe' }, { body: 'c_bikini_rojo', legs: 'c_pareo' }],
  ar_noa: [{ g: 'f', skin: 2, hair: 'castano', hs: 6, eyes: 'verde' }, { body: 'c_bikini_azul', legs: 'c_bermuda' }],
  ar_ailani: [{ g: 'f', skin: 3, hair: 'rubio', hs: 1, eyes: 'azul' }, { body: 'c_bikini_flores', legs: 'c_pareo' }],
  ar_leilani: [{ g: 'f', skin: 4, hair: 'negro', hs: 9, eyes: 'cafe' }, { body: 'c_bikini_blanco', legs: 'c_pareo' }],
  ar_kai: [{ g: 'm', skin: 3, hair: 'rubio', hs: 2, eyes: 'azul' }, { body: 'c_hawaiana', legs: 'c_bermuda' }],
  ar_keoni: [{ g: 'm', skin: 4, hair: 'negro', hs: 4, eyes: 'cafe' }, { body: 'c_hawaiana_roja', legs: 'c_bermuda' }],
  ar_mano: [{ g: 'm', skin: 3, hair: 'blanco', hs: 1, eyes: 'cafe' }, { body: 'c_hawaiana', legs: 'c_bermuda' }],
  ar_iolana: [{ g: 'f', skin: 2, hair: 'rosa', hs: 5, eyes: 'violeta' }, { body: 'c_bikini_negro', legs: 'c_bermuda' }],
};
{ const _na = npcAtlas; npcAtlas = function (id) { const D = ISL_APP[id]; if (D) return getAtlas('ISL' + id, () => { const L = heroLook('guerrero', D[0], { weapon: 0 }, D[1], {}); L.weapon = null; return buildHeroAtlas(L); }); return _na.apply(this, arguments); }; }
const ISLV = (o) => LK(Object.assign({ outfit: 'tunic', skin: SKINS[3], main: P5(['#0a3a5a', '#165a8a', '#2a7ab8', '#4a9ad8', '#8ac8ff']) }, o));
const ARCHI_NPC = [
  ['ar_maile', 'Maile', L2('La surfista', 'The surfer'), ISLV({ g: 'f', hair: HAIRS.negro, hairStyle: 'long', skin: SKINS[3] }),
    [L2('El mar de aquí no perdona, pero tampoco guarda rencor. Si te tira, mañana te vuelve a recibir.', 'The sea here does not forgive, but it does not hold grudges either. If it throws you, tomorrow it welcomes you back.'), L2('Kai dice que surfeo mejor que él. Kai miente fatal.', 'Kai says I surf better than him. Kai is a terrible liar.')]],
  ['ar_noa', 'Noa', L2('Pintora del puerto', 'Port painter'), ISLV({ g: 'f', hair: HAIRS.castano, hairStyle: 'long', skin: SKINS[2] }),
    [L2('Pinto lo que veo y lo que me cuentan. Lo que me cuentan se vende mejor.', 'I paint what I see and what I am told. What I am told sells better.'), L2('Los turistas del galeón compran cuadros de casi todo. Una vez vendí un cuadro de una piedra por mil monedas.', 'Galleon tourists buy paintings of almost anything. Once I sold a painting of a rock for a thousand coins.')]],
  ['ar_ailani', 'Ailani', L2('Ropa de playa', 'Beachwear'), ISLV({ g: 'f', hair: HAIRS.rubio, hairStyle: 'long', skin: SKINS[3] }),
    [L2('Con esa armadura te vas a cocer. Prueba algo con más… brisa.', 'You will boil in that armour. Try something with more… breeze.')]],
  ['ar_leilani', 'Leilani', L2('Tejedora de collares', 'Necklace weaver'), ISLV({ g: 'f', hair: HAIRS.negro, hairStyle: 'long', skin: SKINS[4] }),
    [L2('Las mejores perlas no están en las ostras de la orilla: están abajo, en el Fondo Marino, dentro de las almejas gigantes.', 'The best pearls are not in shore oysters: they are down on the Seabed, inside the giant clams.'), L2('Una perla dorada da suerte. Tres, te dan un collar. Mil, te dan problemas.', 'One golden pearl brings luck. Three make a necklace. A thousand bring trouble.')]],
  ['ar_kai', 'Kai', L2('Maestro de surf', 'Surf master'), ISLV({ hair: HAIRS.rubio, skin: SKINS[3] }),
    [L2('La ola no se doma. Se convence. Le enseñas que vas a ir a donde ella vaya, y te deja subir.', 'You do not tame a wave. You convince it. You show it you will go wherever it goes, and it lets you ride.')]],
  ['ar_keoni', 'Keoni', L2('Cuentacuentos', 'Storyteller'), ISLV({ hair: HAIRS.negro, skin: SKINS[4] }),
    [L2('Antes de las cinco islas hubo una sola: Ixtal, el Reino del Sol. Su rey quiso que nunca anocheciera… y el mar se lo tragó para darle sombra.', 'Before the five islands there was only one: Ixtal, the Kingdom of the Sun. Its king wanted night never to fall… and the sea swallowed it to give it shade.'), L2('Al sur del puerto asoma la punta del templo. Dicen que cuatro guardianes de piedra miran hacia donde no deben.', 'South of the port the tip of the temple peeks out. They say four stone guardians are looking where they should not.')]],
  ['ar_mano', L2('Abuelo Mano', 'Grandpa Mano'), L2('El más viejo del puerto', 'Oldest in the port'), ISLV({ hair: HAIRS.blanco, skin: SKINS[3], beard: HAIRS.blanco }),
    [L2('Mi abuelo bajó a Ixtal una vez. Volvió con oro en los bolsillos y sin ganas de hablar. Solo repetía: «el sol nace, el mar duerme, el día muere, la estrella no se mueve».', 'My grandfather went down to Ixtal once. He came back with gold in his pockets and no wish to talk. He only repeated: "the sun rises, the sea sleeps, the day dies, the star does not move".'), L2('Puerto Esmeralda era un pueblo de pescadores. Ahora vienen héroes, turistas y gente rara del cielo. A mí me gusta.', 'Emerald Port was a fishing village. Now heroes, tourists and odd sky folk come. I like it.')]],
  ['ar_iolana', 'Iolana', L2('Socorrista', 'Lifeguard'), ISLV({ g: 'f', hair: HAIRS.rosa, hairStyle: 'long', skin: SKINS[2] }),
    [L2('Si te ahogas, silba. Si no sabes silbar, ahógate más fuerte, que yo te oigo.', 'If you are drowning, whistle. If you cannot whistle, drown louder, I will hear you.')]],
];
for (const [id, n, title, look, lines] of ARCHI_NPC) NPCS[id] = { n, title, look, lines, quests: [] };
ROM.ar_maile = { g: 'f', loves: ['fish', 'food', 'cake'], likes: ['bouquet', 'gem'], hates: ['spore', 'bone'], taste: L2('el pescado fresco, la comida casera y los pasteles', 'fresh fish, home cooking and cakes') };
ROM.ar_noa = { g: 'f', loves: ['gem', 'bouquet', 'cloth'], likes: ['crystal', 'cake'], hates: ['fang', 'ore'], taste: L2('los colores: gemas, flores y telas', 'colours: gems, flowers and fabrics') };
ROM_WHERE.ar_maile = L2('Puerto Esmeralda (Archipiélago)', 'Emerald Port (Archipelago)'); ROM_WHERE.ar_noa = L2('Puerto Esmeralda (Archipiélago)', 'Emerald Port (Archipelago)');
for (const k in ISL_APP) { const s = SKINS[ISL_APP[k][0].skin]; NPCS[k].look.skin = s; }

// ---------- Puerto Esmeralda y la islita del templo al crear el mapa ----------
const PE = { c: [75, 58], r: [20, 10] }, IX = { c: [75, 98], r: [9, 5] };
{ const _mk = makeArchi; makeArchi = function () { const fresh = !G.maps.archipielago, M = _mk(); if (!fresh || M.v429) return M; M.v429 = 1; const I = M.I;
  const land = (C_, R_, inner, outer, plaza) => { const [cx, cy] = C_, [rx, ry] = R_; for (let y = cy - ry - 4; y <= cy + ry + 4; y++) for (let x = cx - rx - 5; x <= cx + rx + 5; x++) { if (x < 2 || y < 2 || x >= M.w - 2 || y >= M.h - 2) continue; const d = Math.hypot((x - cx) / rx, (y - cy) / ry) + (hash2(x, y, 31) - 0.5) * 0.08, i = I(x, y);
      if (d < 0.42 && plaza) M.ter[i] = T[plaza]; else if (d < 0.8) M.ter[i] = T[inner]; else if (d < 1) M.ter[i] = T[outer]; else if (d < 1.25 && M.ter[i] === T.DEEP) M.ter[i] = T.WATER; } };
  land(PE.c, PE.r, 'GRASS', 'SAND', 'COBBLE'); for (let x = PE.c[0] - 2; x <= PE.c[0] + 2; x++) for (let y = PE.c[1] + PE.r[1] - 1; y <= PE.c[1] + PE.r[1] + 3; y++) M.ter[I(x, y)] = T.PLANK;
  land(IX.c, IX.r, 'STONE', 'SAND', null);
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) { const i = I(x, y); if (M.objAt[i] >= 0) { const o = M.objs[M.objAt[i]]; if (o.k === 'furn' && Math.hypot((x - PE.c[0]) / PE.r[0], (y - PE.c[1]) / PE.r[1]) < 1.1 && /^s_|^plant|^barrels/.test(o.f)) hideObj(M, o, true); } }
  const [cx, cy] = PE.c, put = (f, x, y, fp, o) => putNear(M, f, x, y, fp, o);
  for (const [x, y] of [[-15, -5], [-9, -7], [9, -7], [15, -5], [-16, 3], [16, 3]]) put('ar_cabana', cx + x, cy + y, [[-1, 0], [0, 0], [1, 0]]);
  put('ar_galeria', cx - 5, cy - 6, [[-1, 0], [0, 0], [1, 0]], { xact: 'galeria' }); put('ar_surf', cx + 5, cy - 6, [[-1, 0], [0, 0], [1, 0]]); put('ar_puesto', cx - 10, cy + 4, [[-1, 0], [0, 0], [1, 0]]); put('ar_puesto', cx + 10, cy + 4, [[-1, 0], [0, 0], [1, 0]]);
  for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; put('ar_palma', Math.round(cx + Math.cos(a) * PE.r[0] * 0.86), Math.round(cy + Math.sin(a) * PE.r[1] * 0.8), [[0, 0]]); }
  for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28 + 0.4; put('ar_tiki', Math.round(cx + Math.cos(a) * PE.r[0] * 0.48), Math.round(cy + Math.sin(a) * PE.r[1] * 0.5), [[0, 0]]); }
  ARCHI_NPC.forEach(([id], k) => { const a = k / ARCHI_NPC.length * 6.28 + 0.2; spawnNPC(id, Math.round(cx + Math.cos(a) * 6) * 16 + 8, Math.round(cy + Math.sin(a) * 3) * 16 + 8, 'archipielago', { wander: 2, face: 'down' }); });
  // Ixtal: el templo asoma en una islita al sur; cuatro estatuas y una tablilla
  const [ix, iy] = IX.c; addObj(M, 'furn', ix, iy - 1, { f: 'ar_templo', fp: [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]], xact: 'ixdoor' });
  [[-6, 2], [-3, 3], [3, 3], [6, 2]].forEach(([x, y], k) => putNear(M, 'ar_estatua0', ix + x, iy + y, [[0, 0]], { xact: 'ixstat', sk: k, v: 0 }));
  putNear(M, 'ar_tablilla', ix, iy + 3, [[0, 0]], { xact: 'ixtab' });
  M.chunks = new Map(); M.wdist = null; return M; }; }
function inPE(P) { return P && G.map && G.map.id === 'archipielago' && Math.hypot((P.x / 16 - PE.c[0]) / PE.r[0], (P.y / 16 - PE.c[1]) / PE.r[1]) < 1; }
V33_TICKS.push(() => { const P = G.P; if (!P || !G.map) return; const k = inPE(P); if (k !== !!P._peIn) { P._peIn = k; if (k) banner(L2('Puerto Esmeralda', 'Emerald Port'), L2('El corazón del Archipiélago', 'The heart of the Archipelago')); } });

// ---------- tienda de playa de Ailani ----------
function beachShop() { closeDialog(); const P = G.P; P.wardrobe = P.wardrobe || [];
  const render = () => { openModal(`<h2>${L2('Ropa de playa', 'Beachwear')}</h2><p class="hint">${L2('Se guarda en tu armario de cosméticos (también puedes ponérsela a tu pareja si tiene ese conjunto).', 'Saved to your cosmetics wardrobe.')}</p><div class="slist">${BEACH_SHOP.map(([id, pr]) => { const c = COSM[id]; if (!c) return ''; const own = P.wardrobe.includes(id); return `<button class="srow" data-bs="${id}" ${own ? 'disabled' : ''}><div class="sn"><b>${esc(c.n)}</b><small>${own ? L2('Ya lo tienes', 'Owned') : fmt(pr) + ' ' + L2('oro', 'gold')}</small></div></button>`; }).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
    $('#mclose').onclick = closeModal; $$('[data-bs]').forEach(b => b.onclick = () => { const id = b.dataset.bs, pr = BEACH_SHOP.find(x => x[0] === id)[1]; if (P.gold < pr) { toast(L2('No tienes suficiente oro', 'Not enough gold'), 'warn'); return; } P.gold -= pr; giveCosmetic(id); sfx('coin'); markDirty(); render(); }); };
  render(); }

// ---------- SURF (oficio) ----------
addJob('surf', L2('Surf', 'Surfing'), 'wave', L2('Cabalga las olas del Archipiélago con tu tabla: trucos, combos y buenas olas.', 'Ride the Archipelago waves on your board: tricks, combos and great waves.'),
  { how: [L2('Habla con Kai en Puerto Esmeralda y elige «Surfear». Pulsa «¡Truco!» cuando la marca esté en la zona verde. Tres caídas y se acaba.', 'Talk to Kai in Emerald Port and choose "Surf". Press "Trick!" when the marker is in the green zone. Three wipeouts and it ends.'), 'Talk to Kai in Emerald Port and choose "Surf".'],
    ben: [L2('Velocidad en el mar, vida, esquiva, oro y una zona verde más ancha.', 'Sea speed, HP, dodge, gold and a wider green zone.'), 'Sea speed, HP, dodge, gold.'], find: () => ({ loc: [PE.c[0] + 5, PE.c[1] - 4], t: L2('Kai · Puerto Esmeralda', 'Kai · Emerald Port'), m: 'archipielago' }) },
  [[3, 'Navegas y nadas un 5 % más rápido', 'Sail and swim 5% faster', { seaSpd: 5 }], [6, 'Zona verde un 10 % más ancha', 'Green zone 10% wider', { surfB: 10 }], [10, '+3 % de vida', '+3% HP', { hpP: 3 }], [15, '+2 % de esquiva', '+2% dodge', { dodge: 2 }], [20, '+4 % de oro de los enemigos', '+4% gold from enemies', { goldP: 4 }],
    [25, 'Zona verde un 15 % más ancha', 'Green zone 15% wider', { surfB: 15 }], [30, 'Navegas y nadas un 8 % más rápido', 'Sail and swim 8% faster', { seaSpd: 8 }], [40, '+4 % de vida', '+4% HP', { hpP: 4 }], [50, 'Una caída extra antes de acabar', 'One extra wipeout allowed', { surfL: 1 }], [60, '+3 % de experiencia', '+3% experience', { xpP: 3 }]], ['shell', 4]);
let SURF = null;
function surfStart() { closeDialog(); const P = G.P, M = G.map; if (SURF || !M || !M.archi) return; P.surfD = P.surfD || {};
  const y0 = (PE.c[1] + PE.r[1] + 4) * 16 + 8, x0 = PE.c[0] * 16 + 8; P.x = x0; P.y = y0; P.mount = null;
  SURF = { t: -2.5, dur: 45, score: 0, combo: 0, wipe: 0, lives: 3 + jobPerkSum('surfL'), mk: 0, dirm: 1, x0, y0, zone: 0.17 * (1 + jobPerkSum('surfB') / 100), trick: 0 };
  let b = $('#surfBtn'); if (!b) { b = document.createElement('button'); b.id = 'surfBtn'; b.className = 'btn gold'; b.style.cssText = 'position:absolute;left:50%;bottom:calc(6.5em + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:13;font-size:1.1em;padding:.6em 1.6em'; document.getElementById('hud').appendChild(b); b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); surfTrick(); }); }
  b.textContent = L2('¡Truco!', 'Trick!'); b.hidden = false; banner(L2('¡Al agua!', 'Into the water!'), L2('Pulsa «¡Truco!» en la zona verde', 'Press "Trick!" in the green zone')); }
function surfTrick() { const S = SURF, P = G.P; if (!S || S.t < 0) return; const c = 0.5, ok = Math.abs(S.mk - c) < S.zone / 2;
  if (ok) { S.combo++; const pts = 1 + Math.min(9, S.combo); S.score += pts; S.trick = 0.6; floatText(P.x, P.y - 40, '+' + pts + (S.combo > 2 ? ' x' + S.combo : ''), '#8af0ff', S.combo > 4); sfx('coin'); S.zone = Math.max(0.07, S.zone * 0.97); }
  else { S.combo = 0; S.wipe++; sfx('hurt'); floatText(P.x, P.y - 40, L2('¡Al agua!', 'Wipeout!'), '#ff8a8a'); for (let i = 0; i < 14; i++) part(P.x + (Math.random() - 0.5) * 20, P.y, { vz: 40 + Math.random() * 40, g: 120, vx: (Math.random() - 0.5) * 60, life: 0.7, c: '#e0f8ff', s: 2 }); if (S.wipe >= S.lives) surfEnd(); } }
function surfEnd() { const S = SURF, P = G.P; SURF = null; mgHud(null); const b = $('#surfBtn'); if (b) b.hidden = true; P.z = 0; if (!S) return;
  const xp = Math.min(120, Math.round(S.score * 1.6)), gold = S.score * 450; gainJobXp('surf', Math.max(3, xp)); P.gold += gold; P.surfBest = Math.max(P.surfBest || 0, S.score);
  banner(L2('Sesión de surf', 'Surf session'), `${L2('Puntos', 'Points')}: ${S.score} · ${L2('Récord', 'Best')}: ${P.surfBest} · +${fmt(gold)} ${L2('oro', 'gold')}`); sfx('quest'); markDirty(); }
V33_TICKS.push(dt => { const S = SURF; if (!S) return; dt = dt || 0.016; const P = G.P; if (!G.map || !G.map.archi || P.dead) { surfEnd(); return; } S.t += dt;
  P.x = S.x0 + Math.sin(S.t * 0.55) * 70; P.y = S.y0 + Math.sin(S.t * 1.3) * 6; P.dir = Math.cos(S.t * 0.55) > 0 ? 'right' : 'left'; P.rootT = 0.1; S.trick = Math.max(0, S.trick - dt); P.z = S.trick > 0 ? Math.sin(S.trick / 0.6 * Math.PI) * 14 : 0;
  if (S.t < 0) { mgHud(`🏄 ${Math.ceil(-S.t)}…`); return; } if (S.t >= S.dur) { surfEnd(); return; }
  const sp = 0.9 + S.t / S.dur * 0.9; S.mk += S.dirm * sp * dt; if (S.mk > 1) { S.mk = 1; S.dirm = -1; } if (S.mk < 0) { S.mk = 0; S.dirm = 1; }
  if (Math.random() < 0.4) part(P.x - (P.dir === 'right' ? 12 : -12), P.y + 2, { vz: 14, vx: (P.dir === 'right' ? -30 : 30), life: 0.5, c: '#e0f8ff', s: 2 });
  const zw = Math.round(S.zone * 100), zl = 50 - zw / 2, ml = Math.round(S.mk * 100);
  mgHud(`🏄 <b>${S.score}</b> ${S.combo > 1 ? '· combo x' + S.combo : ''} · ${'❤'.repeat(Math.max(0, S.lives - S.wipe))} · ${Math.ceil(S.dur - S.t)} s<div style="position:relative;width:14em;height:.9em;margin:.3em auto 0;background:#1a2a3a;border-radius:.4em;overflow:hidden"><div style="position:absolute;left:${zl}%;width:${zw}%;top:0;bottom:0;background:#3ad07a"></div><div style="position:absolute;left:calc(${ml}% - 2px);width:4px;top:0;bottom:0;background:#fff"></div></div>`); });
// la tabla: en vez del bote se dibuja una tabla de surf bajo el jugador
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { if (SURF && e === G.P) { const x = Math.round(e.x - cx), y = Math.round(e.y - cy); ctx.fillStyle = 'rgba(224,248,255,0.55)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 20, 5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#ff5a3a'; ctx.beginPath(); ctx.ellipse(x, y - 1 - (e.z || 0) * 0.4, 15, 3.5, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#ffd040'; ctx.fillRect(x - 13, y - 2 - Math.round((e.z || 0) * 0.4), 26, 1);
    const M = G.map, a0 = M.archi; M.archi = 0; const z0 = e.z; e.z = (z0 || 0) + 3; try { return _de(e, cx, cy); } finally { M.archi = a0; e.z = z0; } } return _de(e, cx, cy); }; }

// ---------- ARTE (oficio): pinta pixel art y véndelo en tu galería de Puerto Esmeralda ----------
addJob('arte', L2('Arte', 'Art'), 'paint', L2('Pinta cuadros en pixel art y véndelos en tu galería. Los turistas compran mientras juegas.', 'Paint pixel art and sell it in your gallery. Tourists buy while you play.'),
  { how: [L2('En la galería de Puerto Esmeralda (o hablando con Noa) elige «Pintar un cuadro». Dibuja lo que quieras en la cuadrícula, ponle nombre y guárdalo. Después ponlo a la venta en «Mi galería»: se vende solo con el tiempo.', 'At the Emerald Port gallery (or talking to Noa) choose "Paint a picture". Draw anything on the grid, name it and save it. Then put it on sale in "My gallery": it sells over time.'), 'At the Emerald Port gallery choose "Paint a picture", then sell it in "My gallery".'],
    ben: [L2('Oro pasivo, cuadros más caros, ventas más rápidas, experiencia y crítico.', 'Passive gold, pricier paintings, faster sales, experience and crit.'), 'Passive gold, pricier paintings, faster sales.'], find: () => ({ loc: [PE.c[0] - 5, PE.c[1] - 4], t: L2('Galería · Puerto Esmeralda', 'Gallery · Emerald Port'), m: 'archipielago' }) },
  [[3, 'Cuadros un 10 % más caros', 'Paintings 10% pricier', { artV: 10 }], [6, 'Ventas un 15 % más rápidas', 'Sales 15% faster', { artS: 15 }], [10, '+1 % de crítico', '+1% crit', { crit: 1 }], [15, 'Cuadros un 15 % más caros', 'Paintings 15% pricier', { artV: 15 }], [20, '+3 % de experiencia', '+3% experience', { xpP: 3 }],
    [25, 'Ventas un 20 % más rápidas', 'Sales 20% faster', { artS: 20 }], [30, '+5 % de oro de los enemigos', '+5% gold from enemies', { goldP: 5 }], [40, 'Cuadros un 25 % más caros', 'Paintings 25% pricier', { artV: 25 }], [50, '+2 % de crítico', '+2% crit', { crit: 2 }], [60, 'Puedes tener 10 cuadros más a la venta', '10 more paintings on sale', { artN: 10 }]], ['potion', '#ff8ad0']);
const ART_PAL = ['#000000', '#ffffff', '#7a7a8a', '#c8c8d0', '#e02838', '#ff8a2a', '#ffd040', '#5ad06a', '#1a7a3a', '#3ad8ff', '#2a5ae0', '#8a3ad0', '#ff8ad0', '#8a5a2a', '#f0c8a0', '#2a1a10'], ART_N = 24, ART_SYM = '0123456789abcdef';
function artValue(a) { const s = a.d.replace(/\./g, ''), cols = new Set(s).size, fill = s.length / (ART_N * ART_N), lv = (G.P.jobs.arte || { lv: 1 }).lv; return Math.round((800 + lv * 260) * (0.5 + fill) * (0.6 + Math.min(10, cols) * 0.12) * (1 + jobPerkSum('artV') / 100)); }
function artCanvas(a, sc) { const c = document.createElement('canvas'); c.width = ART_N * sc; c.height = ART_N * sc; const x = c.getContext('2d'); x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, c.width, c.height); for (let i = 0; i < a.d.length; i++) { const ch = a.d[i]; if (ch === '.') continue; x.fillStyle = ART_PAL[ART_SYM.indexOf(ch)]; x.fillRect((i % ART_N) * sc, Math.floor(i / ART_N) * sc, sc, sc); } return c; }
function artEditor() { closeDialog(); const P = G.P; P.arts = P.arts || []; if (P.arts.length >= 40) { toast(L2('Tu galería está llena (40). Vende o tira alguno.', 'Your gallery is full (40). Sell or discard one.'), 'warn'); return; }
  const g = new Array(ART_N * ART_N).fill('.'); let col = 0, tool = 'pen', down = false;
  openModal(`<h2>🎨 ${L2('Pintar un cuadro', 'Paint a picture')}</h2><div class="artw"><canvas id="artC" width="${ART_N * 12}" height="${ART_N * 12}"></canvas><div class="artp">${ART_PAL.map((c, i) => `<button class="artc ${i === 0 ? 'on' : ''}" data-ac="${i}" style="background:${c}"></button>`).join('')}</div>
    <div class="row wrap"><button class="btn sm on" data-at="pen">✏ ${L2('Lápiz', 'Pen')}</button><button class="btn sm" data-at="fill">🪣 ${L2('Rellenar', 'Fill')}</button><button class="btn sm" data-at="erase">🧽 ${L2('Borrar', 'Erase')}</button><button class="btn sm" id="artClr">${L2('Limpiar', 'Clear')}</button></div></div>
    <label>${L2('Nombre del cuadro', 'Painting name')}</label><input id="artN" maxlength="24" placeholder="${L2('Atardecer en el puerto', 'Sunset at the port')}" autocomplete="off"><div class="row"><button class="btn gold" id="artOk">${L2('Guardar en mi galería', 'Save to my gallery')}</button><button class="btn" id="artNo">${L2('Cancelar', 'Cancel')}</button></div><p class="hint" id="artMsg"></p>`, 'party');
  const cv = $('#artC'), x = cv.getContext('2d'), draw = () => { x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, cv.width, cv.height); x.strokeStyle = 'rgba(0,0,0,0.06)'; for (let i = 0; i <= ART_N; i++) { x.beginPath(); x.moveTo(i * 12, 0); x.lineTo(i * 12, cv.height); x.moveTo(0, i * 12); x.lineTo(cv.width, i * 12); x.stroke(); } for (let i = 0; i < g.length; i++) if (g[i] !== '.') { x.fillStyle = ART_PAL[ART_SYM.indexOf(g[i])]; x.fillRect((i % ART_N) * 12, Math.floor(i / ART_N) * 12, 12, 12); } };
  const cell = e => { const r = cv.getBoundingClientRect(), cx = Math.floor((e.clientX - r.left) / r.width * ART_N), cy = Math.floor((e.clientY - r.top) / r.height * ART_N); return cx >= 0 && cy >= 0 && cx < ART_N && cy < ART_N ? cy * ART_N + cx : -1; };
  const paint = i => { if (i < 0) return; if (tool === 'fill') { const from = g[i], to = ART_SYM[col]; if (from === to) return; const st = [i]; while (st.length) { const j = st.pop(); if (g[j] !== from) continue; g[j] = to; const jx = j % ART_N; if (jx > 0) st.push(j - 1); if (jx < ART_N - 1) st.push(j + 1); if (j >= ART_N) st.push(j - ART_N); if (j < g.length - ART_N) st.push(j + ART_N); } } else g[i] = tool === 'erase' ? '.' : ART_SYM[col]; draw(); };
  cv.addEventListener('pointerdown', e => { e.preventDefault(); down = true; cv.setPointerCapture(e.pointerId); paint(cell(e)); }); cv.addEventListener('pointermove', e => { if (down && tool !== 'fill') paint(cell(e)); }); cv.addEventListener('pointerup', () => { down = false; });
  $$('[data-ac]').forEach(b => b.onclick = () => { col = +b.dataset.ac; if (tool === 'erase') tool = 'pen'; $$('[data-ac]').forEach(q => q.classList.toggle('on', q === b)); });
  $$('[data-at]').forEach(b => b.onclick = () => { tool = b.dataset.at; $$('[data-at]').forEach(q => q.classList.toggle('on', q === b)); });
  $('#artClr').onclick = () => { g.fill('.'); draw(); }; $('#artNo').onclick = closeModal;
  $('#artOk').onclick = () => { const filled = g.filter(c => c !== '.').length; if (filled < 20) { $('#artMsg').textContent = L2('Pinta un poco más (al menos 20 casillas).', 'Paint a bit more (at least 20 cells).'); return; }
    const n = ($('#artN').value || '').replace(/[<>]/g, '').trim().slice(0, 24) || L2('Sin título', 'Untitled'), a = { n, d: g.join(''), t: Date.now() }; a.v = artValue(a); P.arts.push(a);
    const cols = new Set(g.filter(c => c !== '.')).size; gainJobXp('arte', Math.round(8 + cols * 2 + filled / 40)); closeModal(); sfx('quest'); toast(L2(`«${n}» guardado en tu galería · valor ${fmt(a.v)} oro`, `"${n}" saved to your gallery · value ${fmt(a.v)} gold`), 'quest', 5); markDirty(true); };
  draw(); }
function artGallery() { closeDialog(); const P = G.P; P.arts = P.arts || []; const maxSale = 10 + jobPerkSum('artN');
  const render = () => { const onSale = P.arts.filter(a => a.sale).length;
    openModal(`<h2>🖼 ${L2('Mi galería', 'My gallery')}</h2><p class="hint">${L2('Los cuadros a la venta se venden solos con el tiempo (aunque estés lejos). A la venta', 'Paintings on sale sell by themselves over time (even when you are away). On sale')}: ${onSale}/${maxSale} · ${L2('Vendidos', 'Sold')}: ${P.artSold || 0}</p>
      <div class="artg">${P.arts.map((a, i) => `<div class="artit"><canvas data-art="${i}" width="72" height="72"></canvas><b>${esc(a.n)}</b><small>${fmt(a.v)} ${L2('oro', 'gold')}</small><div class="row"><button class="btn sm ${a.sale ? '' : 'gold'}" data-asl="${i}">${a.sale ? L2('Retirar', 'Withdraw') : L2('Vender', 'Sell')}</button><button class="btn sm" data-adel="${i}">✕</button></div></div>`).join('') || `<p class="hint">${L2('Aún no has pintado nada.', 'You have not painted anything yet.')}</p>`}</div>
      <div class="row"><button class="btn gold" id="agNew">🎨 ${L2('Pintar un cuadro', 'Paint a picture')}</button><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
    $$('[data-art]').forEach(c => { const a = P.arts[+c.dataset.art], s = artCanvas(a, 3), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(s, 0, 0); });
    $$('[data-asl]').forEach(b => b.onclick = () => { const a = P.arts[+b.dataset.asl]; if (!a.sale && P.arts.filter(q => q.sale).length >= maxSale) { toast(L2('No caben más cuadros a la venta', 'No more room on sale'), 'warn'); return; } a.sale = a.sale ? 0 : Date.now(); markDirty(); render(); });
    $$('[data-adel]').forEach(b => b.onclick = () => { P.arts.splice(+b.dataset.adel, 1); markDirty(); render(); });
    $('#agNew').onclick = artEditor; $('#mclose').onclick = closeModal; };
  render(); }
// ventas: cada minuto real, cada cuadro a la venta tiene una probabilidad de venderse (más con las ventajas)
setInterval(() => { try { const P = G.P; if (!P || !P.arts || titleMode) return; const now = Date.now(), ch = 0.08 * (1 + jobPerkSum('artS') / 100);
  for (const a of P.arts.slice()) { if (!a.sale) continue; const mins = Math.min(600, Math.floor((now - (a.sl || a.sale)) / 60000)); if (mins < 1) continue; a.sl = (a.sl || a.sale) + mins * 60000; let sold = false; for (let i = 0; i < mins && !sold; i++) if (Math.random() < ch) sold = true;
    if (sold) { P.arts.splice(P.arts.indexOf(a), 1); P.gold += a.v; P.artSold = (P.artSold || 0) + 1; gainJobXp('arte', 12); toast(L2(`Un turista compró «${a.n}» por ${fmt(a.v)} oro 🖼`, `A tourist bought "${a.n}" for ${fmt(a.v)} gold 🖼`), 'loot', 5); sfx('coin'); markDirty(); } } } catch (e) { console.warn(e); } }, 15000);
{ const st = document.createElement('style'); st.textContent = '.artw{display:flex;flex-direction:column;align-items:center;gap:.4em}#artC{width:min(68vw,52vh,288px);height:auto;image-rendering:pixelated;touch-action:none;border:2px solid #5a4320;background:#f4ecd8}.artp{display:grid;grid-template-columns:repeat(8,1fr);gap:3px}.artc{width:1.7em;height:1.7em;border:2px solid #2a1a10;border-radius:4px}.artc.on{outline:2px solid #ffd040}.artg{display:grid;grid-template-columns:repeat(auto-fill,minmax(7.5em,1fr));gap:.5em;max-height:50vh;overflow:auto}.artit{display:flex;flex-direction:column;align-items:center;gap:.15em;padding:.3em;border:1px solid #5a4320;border-radius:.4em;background:#1a110c}.artit canvas{width:72px;height:72px;image-rendering:pixelated}.artit b{font-size:.8em;text-align:center}.btn.sm.on{outline:2px solid #ffd040}'; document.head.appendChild(st); }
XACT.galeria = [L2('Entrar en la galería', 'Enter the gallery'), ['potion', '#ff8ad0'], () => artGallery()];

// ---------- diálogos de Puerto Esmeralda ----------
DLG_HOOKS.push((npc, opts) => {
  if (npc.id === 'ar_kai') opts.unshift({ label: L2('Surfear', 'Surf') + ` (${L2('Nv.', 'Lv.')} ${(G.P.jobs.surf || { lv: 1 }).lv})`, icon: ['shell', 4], fn: surfStart });
  if (npc.id === 'ar_noa') { opts.unshift({ label: L2('Mi galería', 'My gallery'), icon: ['potion', '#ff8ad0'], fn: artGallery }); opts.unshift({ label: L2('Pintar un cuadro', 'Paint a picture'), icon: ['potion', '#ff8ad0'], fn: artEditor }); }
  if (npc.id === 'ar_ailani') opts.unshift({ label: L2('Ropa de playa', 'Beachwear'), icon: ['hanger'], fn: beachShop });
});

// ---------- IXTAL, la Ciudad Perdida: puzle de las estatuas ----------
const IX_SOL = [1, 2, 3, 0]; // el sol nace (este), el mar duerme (sur), el día muere (oeste), la estrella no se mueve (norte)
XACT.ixstat = [L2('Girar la estatua', 'Turn the statue'), ['ways'], o => { const P = G.P; if (P.ixOpen) { toast(L2('Las estatuas ya miran donde deben', 'The statues already face the right way'), 'info'); return; } o.v = (o.v + 1) % 4; o.f = 'ar_estatua' + o.v; sfx('hit');
  const ss = G.map.objs.filter(q => q.xact === 'ixstat').sort((a, b) => a.sk - b.sk); if (ss.length === 4 && ss.every((s, i) => s.v === IX_SOL[i])) { P.ixOpen = 1; sfx('level'); G.shake = 6; banner(L2('¡El templo se abre!', 'The temple opens!'), L2('Ixtal, la Ciudad Perdida', 'Ixtal, the Lost City')); markDirty(true); } }];
XACT.ixtab = [L2('Leer la tablilla', 'Read the tablet'), ['book'], () => { openModal(`<h2>${L2('Tablilla de Ixtal', 'Tablet of Ixtal')}</h2><p class="lorep">${L2('«Cuatro guardianes custodian el sueño del Rey Sol. El primero mira donde el sol nace. El segundo, donde el mar duerme. El tercero, donde el día muere. El cuarto, a la estrella que no se mueve.»', '"Four guardians watch over the Sun King\'s sleep. The first looks where the sun rises. The second, where the sea sleeps. The third, where the day dies. The fourth, at the star that does not move."')}</p><p class="hint">${L2('Las estatuas se cuentan de izquierda a derecha. Tócalas para girarlas.', 'Statues are counted left to right. Touch them to turn them.')}</p><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party'); $('#mclose').onclick = closeModal; }];
XACT.ixdoor = [() => G.P.ixOpen ? L2('Entrar en Ixtal', 'Enter Ixtal') : L2('Templo sellado', 'Sealed temple'), ['ways'], () => { const P = G.P; if (!P.ixOpen) { toast(L2('Una piedra enorme tapa la entrada. Quizá las estatuas tengan algo que ver…', 'A huge stone blocks the entrance. Perhaps the statues have something to do with it…'), 'info'); return; }
  if (P.lv < 290) { toast(L2('Un calor terrible sale de dentro. Vuelve con nivel 290 o más.', 'Terrible heat comes from inside. Come back at level 290 or higher.'), 'warn'); return; } ixEnter(1); }];
if (typeof SECRETS !== 'undefined') SECRETS.push({ id: 'ixtal', n: L2('Ixtal, la Ciudad Perdida', 'Ixtal, the Lost City'), done: P => !!P.ixBoss2, steps: [L2('Al sur de Puerto Esmeralda asoma un templo en una islita. Lee la tablilla.', 'South of Emerald Port a temple peeks out of an islet. Read the tablet.'), L2('Gira las cuatro estatuas para que miren donde dice la tablilla.', 'Turn the four statues to face where the tablet says.'), L2('Dentro hay dos mazmorras de nivel 300: el Templo Hundido y la Cripta del Sol.', 'Inside there are two level 300 dungeons: the Sunken Temple and the Crypt of the Sun.')],
  hints: [L2('El sol nace por el este y muere por el oeste.', 'The sun rises in the east and dies in the west.'), L2('La estrella que no se mueve es la del norte.', 'The star that does not move is the north star.'), L2('Orden: este, sur, oeste, norte.', 'Order: east, south, west, north.')], where: () => ({ loc: [IX.c[0], IX.c[1] + 3], m: 'archipielago', t: L2('Templo de Ixtal', 'Temple of Ixtal') }), avail: P => P.lv >= 160 });

// ---------- las dos mazmorras de nivel 300 ----------
const IX_MATS = [['jade_ixtal', L2('Jade de Ixtal', 'Ixtal Jade'), '#3ad08a'], ['oro_solar', L2('Oro Solar', 'Solar Gold'), '#ffd040'], ['obsidiana_viva', L2('Obsidiana Viva', 'Living Obsidian'), '#5a3a8a']];
for (const [id, n, c] of IX_MATS) it(id, { n, t: 'mat', stack: true, price: 4000, icon: ['gem', c], rar: 5 });
const IX_FL = [
  { k: 1, n: L2('Ixtal · Templo Hundido', 'Ixtal · Sunken Temple'), lv: [300, 312], boss: 'quetzal_obsidiana', mat: 'jade_ixtal', mobs: [
    ['ix_jaguar', L2('Jaguar de Obsidiana', 'Obsidian Jaguar'), ['bst', 'lizard', ['#05000a', '#1a1028', '#3a2a5a', '#8a6ad0'], 1.2, { eye: '#ffd040' }], 'charge'], ['ix_guerrero', L2('Guerrero de Jade', 'Jade Warrior'), ['bst', 'golem', ['#0a2a1a', '#1a5a3a', '#3a9a6a', '#8ae0b0'], 1.2, { core: '#ffd040' }], 'aggro'],
    ['ix_serpiente', L2('Serpiente Emplumada', 'Feathered Serpent'), ['bst', 'lizard', ['#0a3a3a', '#1a7a6a', '#3ad0a0', '#ffe070'], 1.15], 'ranged'], ['ix_escarabajo', L2('Escarabajo Solar', 'Solar Beetle'), ['bst', 'beetle', ['#5a3a00', '#a87a0a', '#ffd040', '#fff4b0'], 1.2], 'charge'], ['ix_alma', L2('Alma del Sacrificio', 'Sacrificial Soul'), ['bst', 'wisp', ['#5a0a0a', '#a02a1a', '#ff6a3a', '#ffe0a0'], 1.2], 'ranged']] },
  { k: 2, n: L2('Ixtal · Cripta del Sol', 'Ixtal · Crypt of the Sun'), lv: [312, 325], boss: 'rey_sol_ixtal', mat: 'oro_solar', mobs: [
    ['ix_momia', L2('Sacerdote Momificado', 'Mummified Priest'), ['bst', 'golem', ['#3a2a1a', '#7a6a4a', '#c8b890', '#fff0d0'], 1.15, { core: '#ff3a2a' }], 'aggro'], ['ix_arana', L2('Araña de Obsidiana', 'Obsidian Spider'), ['bst', 'spider2', ['#05000a', '#1a1028', '#3a2a5a', '#ffd040'], 1.25], 'charge'],
    ['ix_espiritu', L2('Espíritu del Sol Negro', 'Black Sun Spirit'), ['bst', 'wisp', ['#000000', '#1a0a00', '#5a2a00', '#ffd040'], 1.3], 'ranged'], ['ix_sapo', L2('Sapo de Oro', 'Golden Toad'), ['bst', 'toad', ['#5a3a00', '#a87a0a', '#ffd040', '#fff4b0'], 1.3], 'aggro'], ['ix_coatl', L2('Cóatl Guardián', 'Coatl Guardian'), ['bst', 'harpy', ['#0a3a1a', '#1a7a3a', '#3ad06a', '#ffd040'], 1.3], 'charge']] },
];
for (const F of IX_FL) for (const [id, n, art, ai] of F.mobs) MOBS[id] = { n, art, reg: ['ixtal'], lv: F.lv, hp: 1.5 + (F.k - 1) * 0.08, atk: 1.9 + (F.k - 1) * 0.06, def: 1.75, spd: ai === 'charge' ? 70 : 56, ai, fam: 'ixtal', drops: [[F.mat, 0.2], ['obsidiana_viva', 0.05], ['diamante', 0.02]], where: F.n };
Object.assign(BOSSES, {
  quetzal_obsidiana: { n: L2('Quetzal de Obsidiana', 'Obsidian Quetzal'), lv: 315, art: ['bst', 'harpy', ['#05000a', '#1a1028', '#3ad0a0', '#ffe070'], 2.8], hp: 34, atk: 2.75, def: 2.7, spd: 52, moves: ['charge', 'volley', 'hop', 'nova', 'summon'], minion: 'ix_serpiente', drops: [['jade_ixtal', 1, 10], ['obsidiana_viva', 1, 3], ['diamante', 0.6, 3]], r: 40 },
  rey_sol_ixtal: { n: L2('Tonatiuh, el Rey Sol de Ixtal', 'Tonatiuh, Sun King of Ixtal'), lv: 328, art: ['bst', 'golem', ['#5a3a00', '#c89a1a', '#ffd040', '#fff8c0'], 2.9, { core: '#ff3a1a' }], hp: 40, atk: 2.85, def: 2.8, spd: 42, moves: ['slam', 'rain', 'field', 'nova', 'summon', 'breath'], minion: 'ix_momia', drops: [['oro_solar', 1, 10], ['obsidiana_viva', 1, 5], ['diamante', 1, 4]], r: 42 },
});
for (const c in WBASE) { BOSSES.quetzal_obsidiana.drops.push(['w_' + c + '_23', 0.03, 1]); BOSSES.rey_sol_ixtal.drops.push(['w_' + c + '_24', 0.03, 1]); }
for (const s of ['h', 'b', 'l', 'f']) { BOSSES.quetzal_obsidiana.drops.push([s + '_23', 0.05, 1]); BOSSES.rey_sol_ixtal.drops.push([s + '_24', 0.05, 1]); }
function makeIxtal(k) { const id = 'ixtal' + k; if (G.maps[id]) return G.maps[id]; const F = IX_FL[k - 1], cols = 4, rows = 3, RW = 13, RH = 10, w = cols * (RW + 3) + 4, h = rows * (RH + 3) + 4, N = w * h, I = (x, y) => y * w + x, R = new RNG(SEED + 7300 + k);
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.CWALL), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0.45, music: 'cave', I, ixtal: k, camps: [], bossAt: [] };
  const rooms = []; for (let ry = 0; ry < rows; ry++) for (let rx = 0; rx < cols; rx++) { const x0 = 3 + rx * (RW + 3), y0 = 3 + ry * (RH + 3), rw = RW - R.int(0, 2), rh = RH - R.int(0, 2); for (let y = y0; y < y0 + rh; y++) for (let x = x0; x < x0 + rw; x++) M.ter[I(x, y)] = (x + y) % 7 === 0 ? T.COBBLE : T.FLOOR; rooms.push({ x0, y0, rw, rh, cx: x0 + (rw >> 1), cy: y0 + (rh >> 1) }); }
  const dig = (a, b) => { let x = a.cx, y = a.cy; while (x !== b.cx) { for (let d = -1; d <= 1; d++) M.ter[I(x, y + d)] = T.FLOOR; x += Math.sign(b.cx - x); } while (y !== b.cy) { for (let d = -1; d <= 1; d++) M.ter[I(x + d, y)] = T.FLOOR; y += Math.sign(b.cy - y); } };
  // camino en serpiente (izquierda→derecha, abajo, derecha→izquierda…) y algún atajo
  const order = []; for (let ry = 0; ry < rows; ry++) for (let i = 0; i < cols; i++) order.push(ry * cols + (ry % 2 ? cols - 1 - i : i)); for (let i = 1; i < order.length; i++) dig(rooms[order[i - 1]], rooms[order[i]]); dig(rooms[1], rooms[5]); dig(rooms[6], rooms[10]);
  prepPalettes(M); M.exit = { x: -9, y: -9 }; initMapObjs(M); const first = rooms[order[0]], last = rooms[order[order.length - 1]]; M.start = [first.cx, first.cy + 1];
  for (const r of rooms) { for (const [x, y] of [[r.x0, r.y0], [r.x0 + r.rw - 1, r.y0], [r.x0, r.y0 + r.rh - 1], [r.x0 + r.rw - 1, r.y0 + r.rh - 1]]) putNear(M, 'ar_antorcha', x, y, [[0, 0]]); }
  order.forEach((ri, i) => { const r = rooms[ri]; if (i === 0 || i === order.length - 1) return; M.camps.push({ x: r.cx, y: r.cy, mob: F.mobs[i % F.mobs.length][0], lv: R.int(F.lv[0], F.lv[1]), n: 3 + (i % 2), alive: [] }); });
  M.bossAt.push({ x: last.cx, y: last.cy, id: F.boss });
  putNear(M, 'ar_salida', first.cx - 3, first.cy, [[0, 0]], { xact: k === 1 ? 'ixout' : 'ixup', solid: false });
  if (k === 1) putNear(M, 'ar_escalera', last.cx + 3, last.cy + 2, [[0, 0]], { xact: 'ixdown', solid: false });
  G.maps[id] = M; return M; }
function ixEnter(k) { const P = G.P, M = makeIxtal(k); transition(() => { P.inside = M.id; setMap(M, M.start[0] * 16 + 8, M.start[1] * 16 + 8, 'down'); banner(IX_FL[k - 1].n, L2('Nivel ', 'Level ') + IX_FL[k - 1].lv[0] + ' - ' + IX_FL[k - 1].lv[1]); }); }
XACT.ixout = [L2('Salir al Archipiélago', 'Back to the Archipelago'), ['ways'], () => { const P = G.P, M = makeArchi(); transition(() => { P.inside = 'archipielago'; setMap(M, IX.c[0] * 16 + 8, (IX.c[1] + 1) * 16 + 8, 'down'); }); }];
XACT.ixdown = [L2('Bajar a la Cripta del Sol', 'Go down to the Crypt of the Sun'), ['ways'], () => { const P = G.P; if (!P.ixBoss1) { toast(L2('Una barrera de luz solar te cierra el paso. Vence al Quetzal de Obsidiana.', 'A barrier of sunlight blocks the way. Defeat the Obsidian Quetzal.'), 'warn'); return; } ixEnter(2); }];
XACT.ixup = [L2('Subir al Templo Hundido', 'Go up to the Sunken Temple'), ['ways'], () => ixEnter(1)];
V33_TICKS.push(() => { const M = G.map, P = G.P; if (!M || !M.ixtal || !P) return;
  for (const c of M.camps) { c.alive = c.alive.filter(m => !m.remove && m.hp > 0); const d = Math.abs(c.x - P.x / 16) + Math.abs(c.y - P.y / 16); if (d > 34) { for (const m of c.alive) m.remove = true; c.alive = []; continue; } if (d > 22 || c.alive.length >= c.n || Math.random() > 0.04) continue;
    const x = (c.x + (Math.random() - 0.5) * 6) * 16, y = (c.y + (Math.random() - 0.5) * 4) * 16; if (blockedFor(M, Math.floor(x / 16), Math.floor(y / 16), 0)) continue; const m = spawnMob(c.mob, c.lv, x, y, 0, c); m.map = M.id; m.home = { x, y }; c.alive.push(m); }
  for (const b of M.bossAt) { if (b.ent && (b.ent.remove || b.ent.dying)) { if (b.ent.dying) { b.respawn = G.t + 900; if (M.ixtal === 1 && !P.ixBoss1) { P.ixBoss1 = 1; toast(L2('La barrera de luz se apaga: ya puedes bajar a la Cripta del Sol', 'The light barrier fades: you can now go down to the Crypt of the Sun'), 'quest', 6); } if (M.ixtal === 2 && !P.ixBoss2) { P.ixBoss2 = 1; banner(L2('Ixtal descansa', 'Ixtal rests'), L2('El Rey Sol por fin duerme a la sombra', 'The Sun King finally sleeps in the shade')); } markDirty(true); } b.ent = null; }
    if (!b.ent && G.t > (b.respawn || 0) && dist2(b.x * 16, b.y * 16, P.x, P.y) < 200 * 200) { b.ent = spawnMob(b.id, BOSSES[b.id].lv, b.x * 16 + 8, b.y * 16 + 8, 0, null, true); b.ent.map = M.id; } } });
SAVEKEYS.push('arts', 'artSold', 'surfBest', 'ixOpen', 'ixBoss1', 'ixBoss2');
