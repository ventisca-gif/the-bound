// ================= v5.78: LAS TIERRAS TEJIDAS (nivel 500-600) =================
// Sergio (5.78): las Tierras del Vínculo crecen. Al sur del continente del este (bajo Sahrim y Yarakai, al este de Nhar)
// el mar se vuelve una región nueva con un bioma que no existía: campos de algodón rosado, ovillos gigantes, carretes,
// ciénagas de tinte y las ruinas de una hilandería. 15 criaturas con mecánicas propias, 4 jefes, 6 NPCs, minerales y
// maderas nuevas (Hebrita, Tintolita, Plata de Huso y Sedalita) y el nivel máximo sube a 600.
// Lore (LORE.md §32): cuando el Gran Telar se soltó, algunos hilos cayeron al mar del sur y se tejieron solos hasta
// hacerse tierra; la Ventisca los pintó. Lo que se teje sin Tejedor a veces sale mal: los nudos ciegos se llenan de los
// sueños de Nihil (regla 25) y de ahí salen las criaturas y la Hilandera Muda, que quiere deshilarlo todo.
// Se añade al final de buildWorld (envoltura de makeCamps), así no cambia ni un árbol ni una roca del resto del mundo.

// ---------- región ----------
REGIONS.push({ k: 'tejidas', n: L2('Tierras Tejidas', 'Woven Lands'), lv: [500, 600], c: [306, 211], music: 'wild', noGen: 1 });
RI.tejidas = REGIONS.length - 1;
GRASSP.tejidas = ['#4a2a40', '#6a3a5a', '#8a5276', '#aa7096', '#cc98b6'];
const TJZ = { x0: 240, x1: 371, y0: 192, y1: 229,
  zones: [{ k: 'pradera', n: L2('Pradera de Algodón', 'Cotton Meadow'), x0: 240, x1: 283, lv: [500, 528] }, { k: 'ovillos', n: L2('Bosque de Ovillos', 'Yarnball Wood'), x0: 283, x1: 318, lv: [520, 552] },
    { k: 'cienaga', n: L2('Ciénaga de Tinte', 'Dye Marsh'), x0: 318, x1: 346, lv: [545, 578] }, { k: 'hilanderia', n: L2('Hilandería Rota', 'Broken Spinning Mill'), x0: 346, x1: 372, lv: [572, 600] }],
  camp: { x0: 290, x1: 307, y0: 195, y1: 203 }, ws: [304, 199] };
WAYSTONES.push({ k: 'tejidas', n: L2('Campamento de las Hebras', 'Thread Camp'), x: TJZ.ws[0], y: TJZ.ws[1] });
const tjZoneAt = x => TJZ.zones.find(z => x >= z.x0 && x < z.x1) || TJZ.zones[TJZ.zones.length - 1];
function tjLand(x, y) { if (x < TJZ.x0 - 2 || x > TJZ.x1 + 2 || y < TJZ.y0 - 2 || y > TJZ.y1 + 2) return false;
  const n = k => fbm(x / 9, y / 9, 900 + k, 3) - 0.5;
  const m = k => fbm(x / 4, y / 4, 950 + k, 2) - 0.5;
  if (y < TJZ.y0 + 1 + n(1) * 9 + m(1) * 3 || y > TJZ.y1 - 2 + n(2) * 5 + m(2) * 2 || x < TJZ.x0 + 3 + n(3) * 10 + m(3) * 3 || x > TJZ.x1 - 2 + n(4) * 5) return false;
  return Math.hypot(x - 229, y - 171) > 27 + n(5) * 4; }

// ---------- minerales, maderas y herramientas (tiers de recurso 19-22) ----------
const TJ_RES = [
  [19, ['Hebrita', 'Threadite Ore'], ['#7a2a5a', '#e070b0', '#ffd8f0'], ['Tronco de Árbol de Algodón', 'Cotton Tree Log'], 'arbolalgodon', ['#4a3a40', '#7a6a70', '#b8a8b0', '#e0d4da', '#f4ecf0', '#ffffff'], 500, 116],
  [20, ['Tintolita', 'Dyestone Ore'], ['#1a3a8a', '#3a8ae0', '#ffe060'], ['Tronco de Sauce Hilandero', 'Spinner Willow Log'], 'saucehilo', ['#2a1438', '#4a2260', '#6a3488', '#8a4ab0', '#b070d0', '#d8a8f0'], 530, 122],
  [21, ['Plata de Huso', 'Spindle Silver'], ['#5a6070', '#c8d0e0', '#ffffff'], ['Tronco de Roble de Ovillos', 'Yarnball Oak Log'], 'robleovillo', ['#3a0a1a', '#5a1428', '#8a2038', '#b03a50', '#d06070', '#f098a0'], 560, 128],
  [22, ['Sedalita', 'Silkstone Ore'], ['#6a5a2a', '#f0d890', '#fffaf0'], ['Tronco de Ceiba de Seda', 'Silk Ceiba Log'], 'ceibaseda', ['#1a3a3a', '#24584e', '#3a7a6a', '#5aa08a', '#8ac8b0', '#c8f0e0'], 585, 134]];
for (const [t, on, oc, ln, sp, leaf, , jl] of TJ_RES) {
  ORE[t] = oc; OREN[t] = on[0]; LOGN[t] = ln[0].replace(/^Tronco (de |del )/, ''); WOODT[sp] = t; LEAF[sp] = pal(leaf); RESLV[t] = jl;
  it('ore' + t, { n: L2(on[0], on[1]), t: 'mat', stack: true, tier: t, price: 6 * t * t, icon: ['ore', t], rar: 5, d: L2('Mineral de las Tierras Tejidas. Sirve para forjar el equipo de nivel 505 a 600 con Maese Hilario.', 'Ore from the Woven Lands. Used to forge level 505-600 gear with Master Hilario.') });
  it('log' + t, { n: L2(ln[0], ln[1]), t: 'mat', stack: true, tier: t, price: 5 * t * t, icon: ['log', t], rar: 5, d: L2('Madera de las Tierras Tejidas.', 'Wood from the Woven Lands.') }); }
// el pico de potencia p abre el mineral p+5: picos 14-17 para Hebrita, Tintolita, Plata de Huso y Sedalita
[[14, 'Hebrita', 'Threadite', 500, 18], [15, 'Tintolita', 'Dyestone', 530, 19], [16, 'Plata de Huso', 'Spindle Silver', 560, 20], [17, 'Sedalita', 'Silkstone', 585, 21]].forEach(([p, es, en, lv, om], i) => {
  const de = /^[AEIOUÁÉÍÓÚ]/i.test(es) ? 'de ' : 'de ';
  it('hacha' + p, { n: L2('Hacha ' + de + es, en + ' Axe'), t: 'tool', tool: 'tala', power: p, lv, price: 4000 * p * p, icon: ['axe', 22], rar: 5 });
  it('pico' + p, { n: L2('Pico ' + de + es, en + ' Pickaxe'), t: 'tool', tool: 'mineria', power: p, lv, price: 4000 * p * p, icon: ['pick', 22], rar: 5 });
  it('cana' + (p + 1), { n: L2('Caña ' + de + es, en + ' Rod'), t: 'tool', tool: 'pesca', power: p + 1, lv, price: 4000 * p * p, icon: ['rod', 22], rar: 5 });
  const g = 120000 * (i + 1), m = [['ore' + om, 8], ['log' + om, 6]];
  RECIPES.push({ id: 'r_hacha' + p, job: 'herreria', out: 'hacha' + p, n: 1, lv, jlv: 75, gold: g, mats: [['ore' + om, 6], ['log' + om, 8]], cat: 'herramienta' });
  RECIPES.push({ id: 'r_pico' + p, job: 'herreria', out: 'pico' + p, n: 1, lv, jlv: 75, gold: g, mats: m, cat: 'herramienta' });
  RECIPES.push({ id: 'r_cana' + (p + 1), job: 'herreria', out: 'cana' + (p + 1), n: 1, lv, jlv: 75, gold: g, mats: m, cat: 'herramienta' }); });

// ---------- materiales de criaturas y jefes ----------
for (const [id, n, en, col, price, d] of [
  ['hebra_suelta', 'Hebra Suelta', 'Loose Thread', '#f0a0d0', 9000, L2('Hilo que se soltó del Gran Telar. Lo sueltan las criaturas de las Tierras Tejidas. Cora te cambia 20 por una Hebrita.', 'A thread that came loose from the Great Loom. Dropped by Woven Lands creatures. Cora trades 20 for one Threadite.')],
  ['tj_ala_polilla', 'Ala de la Reina Polilla', 'Moth Queen Wing', '#e8d8a0', 60000, L2('Polvo de seda que no se apaga. Lo suelta la Reina Polilla.', 'Silk dust that never fades. Dropped by the Moth Queen.')],
  ['tj_nudo', 'Nudo Ciego', 'Blind Knot', '#a04a7a', 90000, L2('Un nudo tan apretado que nadie sabe deshacerlo. Lo suelta El Nudo Ciego.', 'A knot so tight no one knows how to undo it. Dropped by The Blind Knot.')],
  ['tj_engranaje', 'Engranaje de la Rueca', 'Spinning Wheel Gear', '#d0a050', 130000, L2('Sigue girando en la mano. Lo suelta la Rueca Desbocada.', 'It keeps spinning in your hand. Dropped by the Runaway Spinning Wheel.')],
  ['tj_hebra_silencio', 'Hebra del Silencio', 'Thread of Silence', '#2a2a3a', 200000, L2('Un hilo negro que no hace ruido al caer. Lo suelta la Hilandera Muda.', 'A black thread that makes no sound when it falls. Dropped by the Mute Spinner.')]])
  it(id, { n: L2(n, en), t: 'mat', stack: true, tier: 22, price, icon: ['gem', col], rar: 5, d });

// ---------- criaturas ----------
// [id, es, en, arte cbx, ia, nivel, mecánica, explicación de la mecánica (Lupa)]
const TJ_MOBS = [
  ['tj_ovillo', 'Ovillo Saltarín', 'Bouncing Yarnball', 'ovillo', 'aggro', [500, 526], 'split', ['Al caer se deshace en dos ovillitos.', 'When it falls it unravels into two small yarnballs.']],
  ['tj_polilla', 'Polilla de Seda', 'Silk Moth', 'polilla', 'ranged', [502, 528], 'dust', ['Suelta polvo de seda que te frena.', 'Drops silk dust that slows you.']],
  ['tj_aguja', 'Aguja Viviente', 'Living Needle', 'aguja', 'charge', [505, 528], 'pierce', ['Embiste y te deja sangrando.', 'Charges and leaves you bleeding.']],
  ['tj_muneco', 'Muñeco de Trapo', 'Rag Doll', 'muneco', 'aggro', [508, 530], 'resew', ['Se recose una vez cuando lo vences.', 'Sews itself back together once when defeated.']],
  ['tj_arana', 'Araña Tejedora', 'Weaver Spider', 'arana', 'ranged', [520, 548], 'web', ['Lanza telarañas que te atan los pies.', 'Shoots webs that bind your feet.']],
  ['tj_carrete', 'Carrete Rodante', 'Rolling Spool', 'carrete', 'charge', [522, 550], 'trail', ['Rueda y deja un rastro de hilo que frena.', 'Rolls and leaves a thread trail that slows.']],
  ['tj_oveja', 'Oveja de Lana Negra', 'Black Wool Sheep', 'oveja', 'aggro', [525, 552], 'wool', ['Su lana para los tres primeros golpes.', 'Its wool stops the first three hits.']],
  ['tj_lince', 'Lince de Tapiz', 'Tapestry Lynx', 'lince', 'charge', [528, 552], 'ambush', ['Se esconde en el tapiz: su primer zarpazo hace el doble.', 'Hides in the tapestry: its first swipe deals double.']],
  ['tj_fantasma', 'Fantasma de Tinte', 'Dye Ghost', 'fantasma', 'ranged', [545, 575], 'puddle', ['Deja charcos de tinte que envenenan.', 'Leaves dye puddles that poison.']],
  ['tj_rana', 'Rana de Tinte', 'Dye Frog', 'rana', 'aggro', [548, 576], 'splash', ['Al caer revienta en tinte: ¡aléjate!', 'Bursts into dye when it falls: get away!']],
  ['tj_mantis', 'Mantis Costurera', 'Seamstress Mantis', 'mantis', 'aggro', [550, 578], 'double', ['Da dos puntadas seguidas.', 'Strikes twice in a row.']],
  ['tj_tijera', 'Tijera Errante', 'Wandering Shears', 'tijera', 'aggro', [552, 578], 'snip', ['Corta: a veces golpea muy fuerte y te hace sangrar.', 'Snips: sometimes hits very hard and makes you bleed.']],
  ['tj_maniqui', 'Maniquí sin Rostro', 'Faceless Mannequin', 'maniqui', 'aggro', [572, 598], 'blink', ['Aparece a tu espalda.', 'Appears behind you.']],
  ['tj_guardian', 'Guardián de Bobina', 'Bobbin Guardian', 'guardian', 'aggro', [575, 600], 'mend', ['Cose las heridas de las criaturas cercanas.', 'Sews up the wounds of nearby creatures.']],
  ['tj_telar', 'Telar Animado', 'Animated Loom', 'telar', 'aggro', [578, 600], 'pull', ['Tira de un hilo y te arrastra hacia él.', 'Pulls a thread and drags you towards it.']]];
const TJ_ORE_OF = z => z === 'pradera' ? 'ore19' : z === 'ovillos' ? 'ore20' : z === 'cienaga' ? 'ore21' : 'ore22';
for (const [id, n, en, art, ai, lv, mech, mh] of TJ_MOBS) { const zk = tjZoneAt(TJZ.zones.find(z => lv[0] >= z.lv[0] && lv[0] <= z.lv[1]).x0).k;
  MOBS[id] = { n: L2(n, en), art: ['cbx', 'tj_' + art], reg: ['tejidas'], lv, hp: 1.6 + (lv[0] - 300) / 400, atk: 1.95 + (lv[0] - 300) / 500, def: 1.85, spd: ai === 'charge' ? 76 : ai === 'ranged' ? 52 : 58, ai, fam: 'tejida', fly: art === 'polilla' || art === 'fantasma' ? 1 : 0,
    mech, mechD: L2(mh[0], mh[1]), zone: zk, poison: mech === 'snip' || mech === 'pierce' ? 1 : 0, drops: [['hebra_suelta', 0.35], [TJ_ORE_OF(zk), 0.05], ['pocion3', 0.04]] }; }
// jefes (con sus movimientos propios, ver bossMove más abajo)
Object.assign(BOSSES, {
  tj_reina: { n: L2('La Reina Polilla', 'The Moth Queen'), lv: 540, art: ['cbx', 'tj_reina'], scale: 2.4, hp: 44, atk: 3.3, def: 3.2, spd: 46, moves: ['volley', 'rain', 'field', 'summon', 'blink', 'tj_polvo'], minion: 'tj_polilla', drops: [['tj_ala_polilla', 1, 3], ['hebra_suelta', 1, 12]], r: 40, fly: 1 },
  tj_nudo: { n: L2('El Nudo Ciego', 'The Blind Knot'), lv: 565, art: ['cbx', 'tj_nudo'], scale: 2.6, hp: 48, atk: 3.4, def: 3.35, spd: 38, moves: ['slam', 'hop', 'roots', 'summon', 'tj_atadura'], minion: 'tj_ovillo', drops: [['tj_nudo', 1, 3], ['hebra_suelta', 1, 14]], r: 42 },
  tj_rueca: { n: L2('La Rueca Desbocada', 'The Runaway Spinning Wheel'), lv: 585, art: ['cbx', 'tj_rueca'], scale: 2.6, hp: 50, atk: 3.5, def: 3.4, spd: 50, moves: ['charge', 'nova', 'volley', 'summon', 'tj_giro'], minion: 'tj_carrete', drops: [['tj_engranaje', 1, 3], ['hebra_suelta', 1, 16]], r: 42 },
  tj_hilandera: { n: L2('La Hilandera Muda', 'The Mute Spinner'), lv: 600, art: ['cbx', 'tj_hilandera'], scale: 2.6, hp: 56, atk: 3.6, def: 3.5, spd: 48, moves: ['blink', 'volley', 'rain', 'summon', 'field', 'tj_deshilar', 'tj_silencio'], minion: 'tj_maniqui', drops: [['tj_hebra_silencio', 1, 2], ['tj_engranaje', 0.5, 1], ['hebra_suelta', 1, 20]], r: 44 } });
const TJ_BOSS_AT = { tj_reina: [300, 221], tj_nudo: [331, 214], tj_rueca: [354, 203], tj_hilandera: [364, 222] };
const TJ_BOSS_D = { tj_reina: L2('Polvo de seda en anillo (te frena), lluvia, campo, polillas y parpadeo.', 'Ring of silk dust (slows you), rain, field, moths and blink.'),
  tj_nudo: L2('La Atadura: te arrastra hasta él y te ata los pies antes de aplastarte.', 'The Binding: drags you to it and binds your feet before crushing you.'),
  tj_rueca: L2('El Giro: dos coronas de hilo que salen girando en todas direcciones.', 'The Spin: two crowns of thread spinning out in every direction.'),
  tj_hilandera: L2('Deshilar (cuatro hilos que se cierran sobre ti) y Silencio (te quita maná y te frena).', 'Unravel (four threads closing in on you) and Silence (drains mana and slows you).') };

// ---------- mapa: la tierra nueva, decorado, vetas, campamentos y jefes ----------
const tjMark = (W, x, y) => { const i = W.I(x, y); W.flags[i] |= 4; };
function tjExpand(W) { const I = W.I, ok = (x, y) => W.inb(x, y), R = new RNG(SEED + 578);
  const clear = (x, y) => { const i = I(x, y), oi = W.objAt[i]; if (oi >= 0) { const o = W.objs[oi]; if (!o.xact && o.k !== 'bld' && o.k !== 'waystone') { o.hidden = true; for (const [dx, dy] of o.fp || [[0, 0]]) { const j = I(o.tx + dx, o.ty + dy); if (W.objAt[j] === oi) { W.objAt[j] = -1; W.solidO[j] = 0; } } } } };
  // tierra
  for (let y = TJZ.y0 - 3; y <= TJZ.y1 + 3; y++) for (let x = TJZ.x0 - 3; x <= TJZ.x1 + 3; x++) { if (!ok(x, y) || !tjLand(x, y)) continue; const i = I(x, y);
    if (W.rail && W.rail[i]) continue; if (W.land[i] && W.reg[i] !== RI.mar) continue;
    W.land[i] = 1; W.lvl[i] = 0; W.reg[i] = RI.tejidas; W.townAt[i] = -1; W.flags[i] = W.flags[i] & 64; if (W.riverMask) W.riverMask[i] = 0;
    const z = tjZoneAt(x).k, n = fbm(x / 7, y / 7, 911, 3); let t = T.GRASS;
    if (z === 'cienaga' && n > 0.56) t = T.MUD; else if (z === 'hilanderia' && n > 0.6) t = T.STONE; else if (z === 'ovillos' && n > 0.7) t = T.DIRT; W.ter[i] = t; }
  // estanques de tinte
  for (let y = TJZ.y0 + 3; y <= TJZ.y1 - 3; y++) for (let x = TJZ.x0 + 4; x <= TJZ.x1 - 4; x++) { const i = I(x, y); if (W.reg[i] !== RI.tejidas) continue; const z = tjZoneAt(x).k;
    if (fbm(x / 11, y / 11, 933, 3) > (z === 'cienaga' ? 0.62 : 0.74) && x > TJZ.camp.x1 + 3 || fbm(x / 11, y / 11, 933, 3) > 0.74 && x < TJZ.camp.x0 - 3) { let all = true; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (W.reg[I(x + dx, y + dy)] !== RI.tejidas) all = false; if (all) W.ter[i] = T.WATER; } }
  // playa
  for (let y = TJZ.y0 - 3; y <= TJZ.y1 + 3; y++) for (let x = TJZ.x0 - 3; x <= TJZ.x1 + 3; x++) { if (!ok(x, y)) continue; const i = I(x, y); if (W.reg[i] !== RI.tejidas || WATERY[W.ter[i]]) continue;
    let near = false; for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) { if (!ok(x + dx, y + dy)) continue; if (!W.land[I(x + dx, y + dy)]) { near = Math.max(Math.abs(dx), Math.abs(dy)) <= (hash2(x, y, 4) < 0.4 ? 1 : 2); break; } }
    if (near) W.ter[i] = T.SAND; }
  // profundidad del agua alrededor
  { const N = W.w * W.h, q = []; for (let i = 0; i < N; i++) { if (!WATERY[W.ter[i]] && W.ter[i] !== T.LAVA) { W.wdist[i] = 0; q.push(i); } else W.wdist[i] = 255; }
    let qi = 0; while (qi < q.length) { const c = q[qi++], cx = c % W.w, cy = (c / W.w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (!ok(nx, ny)) continue; const j = I(nx, ny); if (W.wdist[j] > W.wdist[c] + 1) { W.wdist[j] = W.wdist[c] + 1; q.push(j); } } }
    for (let y = TJZ.y0 - 10; y <= TJZ.y1 + 6; y++) for (let x = TJZ.x0 - 10; x <= TJZ.x1 + 6; x++) { if (!ok(x, y)) continue; const i = I(x, y); if (W.ter[i] === T.DEEP && W.wdist[i] <= 3) W.ter[i] = T.WATER; } }
  // puentes desde los andenes de Sahrim y Yarakai (línea central del tren) y desde Nhar
  const cy0 = (typeof RAIL !== 'undefined' && RAIL.crossY) || 182;
  for (const bx of [298, 345]) for (let y = cy0 + 2; y <= TJZ.y0 + 8; y++) { let reached = false; for (const x of [bx - 1, bx, bx + 1]) { if (!ok(x, y)) continue; const i = I(x, y); if (W.rail && W.rail[i]) continue; if (W.reg[i] === RI.tejidas && !WATERY[W.ter[i]]) { reached = true; continue; } if (WATERY[W.ter[i]] || W.ter[i] === T.FACE) { W.ter[i] = T.BRIDGE; W.flags[i] |= 8 | 1 | 4; } } if (reached) break; }
  // caminos de piedra: campamento ↔ cada zona
  const road = (x, y) => { if (!ok(x, y)) return; const i = I(x, y); if (W.reg[i] !== RI.tejidas || WATERY[W.ter[i]] || (W.rail && W.rail[i])) return; clear(x, y); W.ter[i] = T.COBBLE; W.flags[i] |= 1 | 4; };
  const path = (ax, ay, bx, by) => { let x = ax, y = ay; for (let k = 0; k < 400 && (x !== bx || y !== by); k++) { road(x, y); road(x, y + 1); if (x !== bx && (k % 3 || y === by)) x += Math.sign(bx - x); else y += Math.sign(by - y); } };
  path(298, TJZ.y0 + 1, 298, 199); path(345, TJZ.y0 + 2, 345, 205); path(290, 199, 248, 207); path(307, 199, 345, 205); path(345, 205, 362, 214); path(298, 203, 300, 215);
  // campamento de las hebras (zona segura)
  const C0 = TJZ.camp; for (let y = C0.y0; y <= C0.y1; y++) for (let x = C0.x0; x <= C0.x1; x++) { if (!ok(x, y)) continue; const i = I(x, y); if (W.reg[i] !== RI.tejidas) continue; clear(x, y); if (!WATERY[W.ter[i]]) W.ter[i] = (x + y) % 5 ? T.GRASS : T.DIRT; W.flags[i] |= 4 | 16; }
  for (let y = C0.y0 - 4; y <= C0.y1 + 4; y++) for (let x = C0.x0 - 4; x <= C0.x1 + 4; x++) if (ok(x, y)) tjMark(W, x, y);
  const F = (f, x, y, fp, o) => { if (!ok(x, y)) return null; for (const [dx, dy] of fp || [[0, 0]]) clear(x + dx, y + dy); return addObj(W, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {})); };
  const O = (k, x, y, o) => { for (const [dx, dy] of (o && o.fp) || [[0, 0]]) clear(x + dx, y + dy); return addObj(W, k, x, y, o || {}); };
  O('tent', C0.x0 + 2, C0.y0 + 2, { col: '#8a3a6a', fp: [[0, 0], [1, 0]] }); O('tent', C0.x1 - 3, C0.y0 + 2, { col: '#3a5a8a', fp: [[0, 0], [1, 0]] }); O('campfire', C0.x0 + 8, C0.y0 + 4);
  F('tj_telar_c', C0.x0 + 5, C0.y1 - 1, [[0, 0], [1, 0]]); O('anvil', C0.x1 - 5, C0.y1 - 2); F('tj_cubas', C0.x0 + 11, C0.y1 - 1, [[0, 0], [1, 0]]); F('tj_carrete', C0.x0 + 1, C0.y1 - 2);
  for (const [id, dx, dy, wd] of [['tj_ovidia', 7, 3, 1], ['tj_hilario', C0.x1 - C0.x0 - 4, C0.y1 - C0.y0 - 3, 0], ['tj_cora', 11, C0.y1 - C0.y0 - 3, 1], ['tj_lino', 3, 5, 1], ['tj_pip', 9, 6, 3], ['tj_brigida', 14, 4, 1]])
    W.npcDefs.push({ id, x: C0.x0 + dx, y: C0.y0 + dy, wander: wd });
  // decorado por zona
  const deco = { pradera: ['tj_algodon', 'tj_algodon', 'tj_ovillo', 'tj_algodon', 'tj_huso'], ovillos: ['tj_ovillo', 'tj_ovillo_g', 'tj_carrete', 'tj_algodon', 'tj_ovillo'], cienaga: ['tj_cubas', 'tj_juncos', 'tj_juncos', 'tj_ovillo', 'tj_huso'], hilanderia: ['tj_telar_r', 'tj_huso', 'tj_carrete', 'tj_columna', 'tj_ovillo'] };
  const FP2 = { tj_ovillo_g: [[0, 0], [1, 0]], tj_telar_r: [[0, 0], [1, 0]], tj_cubas: [[0, 0], [1, 0]] };
  const free = (x, y) => { if (!ok(x, y)) return false; const i = I(x, y); return W.reg[i] === RI.tejidas && !SOLID_T[W.ter[i]] && !WATERY[W.ter[i]] && W.objAt[i] < 0 && !(W.flags[i] & 5) && W.ter[i] !== T.BRIDGE; };
  for (let k = 0; k < 1900; k++) { const x = R.int(TJZ.x0, TJZ.x1), y = R.int(TJZ.y0, TJZ.y1); if (!free(x, y) || !free(x, y + 1)) continue; const z = tjZoneAt(x).k, f = deco[z][k % 5], fp = FP2[f]; if (fp && !fp.every(([dx, dy]) => free(x + dx, y + dy))) continue;
    if (k % 4 === 0) { const sp = z === 'pradera' ? 'arbolalgodon' : z === 'ovillos' ? 'robleovillo' : z === 'cienaga' ? 'saucehilo' : 'ceibaseda'; addObj(W, 'tree', x, y, { sp, v: R.int(0, 3), nv: 1 }); continue; }
    if (k % 9 === 0 && k < 1800) { const tier = z === 'pradera' ? 19 : z === 'ovillos' ? 20 : z === 'cienaga' ? 21 : 22; addObj(W, 'ore', x, y, { tier, v: R.int(0, 3), nv: 1 }); continue; }
    F(f, x, y, fp, { solid: f === 'tj_juncos' ? false : undefined }); }
  W._nv = 1;
  // jefes con su arena
  for (const id in TJ_BOSS_AT) { const [bx, by] = TJ_BOSS_AT[id]; for (let y = by - 4; y <= by + 4; y++) for (let x = bx - 5; x <= bx + 5; x++) if (ok(x, y) && W.reg[I(x, y)] === RI.tejidas) { clear(x, y); const i = I(x, y); if (WATERY[W.ter[i]]) W.ter[i] = T.GRASS; W.flags[i] |= 16; }
    for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283, x = Math.round(bx + Math.cos(a) * 6), y = Math.round(by + Math.sin(a) * 5); if (free(x, y)) F(id === 'tj_hilandera' ? 'tj_columna' : id === 'tj_rueca' ? 'tj_huso' : 'tj_ovillo', x, y); }
    W.bosses.push({ id, x: bx, y: by }); }
  // campamentos de criaturas
  const byZone = {}; for (const [id] of TJ_MOBS) (byZone[MOBS[id].zone] = byZone[MOBS[id].zone] || []).push(id);
  const pts = []; for (let k = 0; k < 6000 && pts.length < 64; k++) { const x = R.int(TJZ.x0 + 2, TJZ.x1 - 2), y = R.int(TJZ.y0 + 2, TJZ.y1 - 2), i = I(x, y);
    if (!free(x, y) || W.flags[i] & 4) continue; if (pts.some(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 < 49)) continue; if (Object.values(TJ_BOSS_AT).some(([bx, by]) => (bx - x) ** 2 + (by - y) ** 2 < 120)) continue;
    const z = tjZoneAt(x), list = byZone[z.k] || [], mob = list[pts.length % list.length], m = MOBS[mob]; if (!m) continue; pts.push([x, y]);
    const t = (x - z.x0) / Math.max(1, z.x1 - z.x0), lv = clamp(Math.round(lerp(Math.max(z.lv[0], m.lv[0]), Math.min(z.lv[1], m.lv[1]), Math.min(1, t * 0.7 + R.f() * 0.3))), 1, MAXLV);
    W.camps.push({ x, y, mob, lv, n: 3, r: 4, alive: [], dead: [], L: 0 }); }
}
{ const _mc = makeCamps; makeCamps = function (W) { const r = _mc.apply(this, arguments); try { if (W && W.isWorld && !W.tjDone) { W.tjDone = 1; tjExpand(W); } } catch (e) { console.warn('tjExpand', e); } return r; }; }

// ---------- dibujos del decorado ----------
const TJD = { rosa: P5(['#4a1a3a', '#7a2a5a', '#b04a84', '#e07ab0', '#ffc0e0']), crema: P5(['#6a5a4a', '#9a8a78', '#cabaa8', '#ece0d2', '#fffaf2']), madera: P5(['#2a160c', '#4a2a16', '#6a4022', '#8a5a32', '#b07a4a']),
  azul: P5(['#0a1a4a', '#14307a', '#2250b0', '#4a80e0', '#90c0ff']), ambar: P5(['#5a3a08', '#9a6a10', '#d0a020', '#f0d050', '#fff0a0']), piedra: P5(['#3a3640', '#5a5664', '#7e7a88', '#a6a2b0', '#cecad8']) };
const tjPx = (w, h, fn) => { const p = new Pix(w, h); fn(p); p.outline(OUTL); return p.canvas(); };
function tjYarn(p, cx, cy, r, P) { p.ball(cx, cy, r, r, [P[1], P[2], P[3], P[4]]); for (let k = -2; k <= 2; k++) { for (let a = -1.2; a <= 1.2; a += 0.08) { const x = Math.round(cx + Math.sin(a) * r * 0.9 + k * r * 0.28), y = Math.round(cy + Math.cos(a) * r * 0.9 * (k % 2 ? 1 : -1) * 0.6); if ((x - cx) ** 2 + (y - cy) ** 2 < r * r * 0.9) p.set(x, y, P[k % 2 ? 1 : 2]); } } }
XSPR.tj_ovillo = () => ({ c: tjPx(16, 14, p => { tjYarn(p, 8, 8, 5.5, TJD.rosa); p.line(12, 11, 15, 13, TJD.rosa[3]); }), ax: 8, ay: 13 });
XSPR.tj_ovillo_g = () => ({ c: tjPx(32, 28, p => { tjYarn(p, 16, 15, 11.5, TJD.azul); p.line(25, 22, 31, 27, TJD.azul[3]); p.line(26, 22, 30, 27, TJD.azul[2]); }), ax: 9, ay: 27 });
XSPR.tj_carrete = () => ({ c: tjPx(18, 24, p => { const M = TJD.madera; p.ell(9, 4, 8, 3, M[3]); p.ell(9, 20, 8, 3, M[2]); p.rect(4, 4, 10, 16, TJD.ambar[2]); for (let y = 5; y < 20; y += 2) p.hl(4, y, 10, TJD.ambar[3]); p.rect(4, 4, 2, 16, TJD.ambar[4]); p.ell(9, 4, 2, 1, M[1]); }), ax: 9, ay: 23 });
XSPR.tj_algodon = () => ({ c: tjPx(20, 26, p => { const M = TJD.madera; p.rect(9, 12, 2, 13, M[2]); p.line(10, 16, 4, 10, M[2]); p.line(10, 14, 16, 8, M[2]); for (const [x, y, r] of [[4, 8, 3.4], [16, 6, 3.6], [10, 5, 4], [7, 13, 2.6], [14, 13, 2.8]]) p.ball(x, y, r, r, [TJD.crema[2], TJD.crema[3], TJD.crema[4], C('#ffffff')]); }), ax: 10, ay: 25 });
XSPR.tj_huso = () => ({ c: tjPx(14, 34, p => { const S_ = TJD.piedra; p.rect(3, 6, 8, 26, S_[2]); p.rect(3, 6, 2, 26, S_[3]); p.rect(10, 6, 1, 26, S_[1]); p.poly([[3, 6], [7, 0], [11, 6]], S_[3]); for (let y = 10; y < 30; y += 3) p.hl(3, y, 8, TJD.rosa[3]); p.rect(1, 31, 12, 3, S_[1]); }), ax: 7, ay: 33 });
XSPR.tj_columna = () => ({ c: tjPx(14, 34, p => { const S_ = TJD.piedra; p.rect(3, 4, 8, 28, S_[2]); p.rect(3, 4, 2, 28, S_[3]); p.rect(1, 2, 12, 3, S_[3]); p.rect(1, 31, 12, 3, S_[1]); p.line(4, 12, 10, 18, S_[1]); p.set(7, 9, TJD.rosa[3]); p.set(8, 22, TJD.rosa[3]); }), ax: 7, ay: 33 });
XSPR.tj_juncos = () => ({ c: tjPx(16, 18, p => { for (let k = 0; k < 6; k++) { const x = 2 + k * 2.4, h = 9 + (k * 5) % 7; p.vl(Math.round(x), 17 - h, h, TJD.azul[k % 2 ? 2 : 3]); p.set(Math.round(x), 17 - h, TJD.rosa[4]); } }), ax: 8, ay: 17 });
XSPR.tj_cubas = () => ({ c: tjPx(30, 20, p => { for (const [x, P] of [[7, TJD.azul], [22, TJD.rosa]]) { p.rect(x - 6, 6, 12, 12, TJD.madera[2]); for (let y = 8; y < 18; y += 4) p.hl(x - 6, y, 12, TJD.madera[1]); p.ell(x, 6, 6, 2, P[3]); p.set(x - 2, 6, P[4]); } }), ax: 7, ay: 19 });
XSPR.tj_telar_r = () => ({ c: tjPx(32, 30, p => { const M = TJD.madera; p.rect(2, 4, 3, 24, M[2]); p.rect(26, 8, 3, 20, M[2]); p.rect(2, 4, 16, 3, M[3]); p.line(18, 5, 28, 9, M[1]); for (let x = 6; x < 25; x += 2) p.line(x, 8, x + 1, 24, x % 4 ? TJD.rosa[3] : TJD.crema[3]); p.rect(5, 20, 20, 4, TJD.rosa[2]); p.hl(5, 20, 20, TJD.rosa[4]); }), ax: 9, ay: 29 });
XSPR.tj_telar_c = () => ({ c: tjPx(32, 30, p => { const M = TJD.madera; p.rect(2, 2, 3, 26, M[3]); p.rect(27, 2, 3, 26, M[3]); p.rect(2, 2, 28, 3, M[4]); for (let x = 6; x < 27; x += 2) p.vl(x, 5, 16, x % 4 ? TJD.azul[3] : TJD.crema[3]); p.rect(5, 12, 22, 9, TJD.rosa[2]); for (let x = 6; x < 26; x += 3) p.set(x, 15, TJD.ambar[4]); p.rect(4, 24, 24, 4, M[2]); }), ax: 9, ay: 29 });

// ---------- NPCs del Campamento de las Hebras ----------
const tjLook = (g, hair, hs, outfit, main) => LK({ g, hair, hairStyle: hs, outfit, main: P5(main) });
NPCS.tj_ovidia = { n: L2('Ovidia', 'Ovidia'), title: L2('Vigía de las Hebras', 'Thread Watcher'), look: tjLook('f', HAIRS.gris, 'long', 'robe', ['#2a1a2a', '#4a2a48', '#6a3a68', '#8a5288', '#b078aa']), quests: [], lines: [
  L2('Bienvenido al Campamento de las Hebras. Los Vigías del Alba me mandaron a vigilar esta tierra el día que salió del mar.', 'Welcome to the Thread Camp. The Dawn Watchers sent me to watch over this land the day it rose from the sea.'),
  L2('Cuando el Gran Telar se soltó, sus hilos sueltos cayeron por todas partes. Unos levantan tormentas. Estos cayeron al mar del sur y se tejieron solos, hasta hacerse tierra.', 'When the Great Loom came loose, its loose threads fell everywhere. Some raise storms. These fell into the southern sea and wove themselves, until they became land.'),
  L2('La Ventisca la pintó de algodón y rosa. Pero lo que se teje sin Tejedor a veces sale mal: en los nudos ciegos se cuelan los sueños de Nihil.', 'The Ventisca painted it cotton and pink. But what is woven without a Weaver sometimes goes wrong: Nihil\'s dreams seep into the blind knots.'),
  L2('Al oeste, la Pradera de Algodón. Al sur, el Bosque de Ovillos. Al este, la Ciénaga de Tinte y la Hilandería Rota. Cuanto más al este, más fuertes (nivel 500 a 600).', 'To the west, the Cotton Meadow. To the south, the Yarnball Wood. To the east, the Dye Marsh and the Broken Spinning Mill. The further east, the stronger (level 500 to 600).')] };
NPCS.tj_hilario = { n: L2('Maese Hilario', 'Master Hilario'), title: L2('Forjador de hebras', 'Thread smith'), look: tjLook('m', HAIRS.castano, 'short', 'smith', ['#2a1a10', '#4a2e18', '#6a4426', '#8a6038', '#ae8052']), quests: [], lines: [
  L2('El hilo de un héroe aprende el patrón de lo que toca. Yo hago lo mismo con el metal: lo tejo con hebras que recuerdan.', 'A hero\'s thread learns the pattern of whatever it touches. I do the same with metal: I weave it with threads that remember.'),
  L2('Tráeme Hebrita, Tintolita, Plata de Huso o Sedalita y los restos de los jefes, y te forjo armaduras y armas de nivel 505 a 600. Cada clase con su propio diseño.', 'Bring me Threadite, Dyestone, Spindle Silver or Silkstone and the remains of the bosses, and I\'ll forge you level 505 to 600 armour and weapons. Each class with its own design.')] };
NPCS.tj_cora = { n: L2('Cora', 'Cora'), title: L2('Tintorera', 'Dyer'), look: tjLook('f', HAIRS.rojo, 'long', 'apron', ['#0a1a4a', '#14307a', '#2250b0', '#4a80e0', '#90c0ff']), quests: [], lines: [
  L2('Mis tintes salen de la ciénaga. ¡Cuidado con las ranas: revientan en tinte!', 'My dyes come from the marsh. Careful with the frogs: they burst into dye!'),
  L2('¿Tienes Hebras Sueltas? Te cambio veinte por una Hebrita. Así no tienes que picar tanto.', 'Got Loose Threads? I\'ll trade twenty for one Threadite. That way you don\'t have to mine as much.')] };
NPCS.tj_lino = { n: L2('Fray Lino', 'Brother Lino'), title: L2('Estudioso del Telar', 'Scholar of the Loom'), look: tjLook('m', HAIRS.blanco, 'short', 'robe', ['#3a3020', '#5a4a30', '#7a6a48', '#9a8a68', '#c0b090']), quests: [], lines: [
  L2('He contado cuatro nudos que no se deshacen. En cada uno vive algo: la Reina Polilla, el Nudo Ciego, la Rueca Desbocada y, en la hilandería, la Hilandera Muda.', 'I have counted four knots that will not come undone. Something lives in each: the Moth Queen, the Blind Knot, the Runaway Spinning Wheel and, in the mill, the Mute Spinner.'),
  L2('La Hilandera no es un dios ni un Tejedor: es un sueño de Nihil que se quedó enredado en un huso. Quiere deshilar esta tierra y devolverla al Lienzo.', 'The Spinner is no god and no Weaver: she is a dream of Nihil that got tangled in a spindle. She wants to unravel this land and return it to the Canvas.'),
  L2('Mientras alguien mire, los sueños de Nihil solo son sueños. Por eso te necesitamos aquí.', 'As long as someone is watching, Nihil\'s dreams are only dreams. That is why we need you here.')] };
NPCS.tj_pip = { n: L2('Pip', 'Pip'), title: L2('Aprendiz de devanadora', 'Apprentice winder'), look: tjLook('m', HAIRS.rubio, 'spiky', 'tunic', ['#4a1a3a', '#7a2a5a', '#b04a84', '#e07ab0', '#ffc0e0']), quests: [], kid: 1, lines: [
  L2('¡Yo enrollo los hilos que se sueltan! Si ves un ovillo que salta, no es un juguete.', 'I wind up the threads that come loose! If you see a yarnball jumping, it\'s not a toy.'),
  L2('La Reina Polilla vive al sur, en el Bosque de Ovillos. ¡De noche sus alas brillan!', 'The Moth Queen lives to the south, in the Yarnball Wood. At night her wings glow!')] };
NPCS.tj_brigida = { n: L2('Brígida', 'Brígida'), title: L2('Minera de hebras', 'Thread miner'), look: tjLook('f', HAIRS.castano, 'short', 'smith', ['#3a3020', '#5a4a30', '#7a6a48', '#9a8a68', '#c0b090']), quests: [], lines: [
  L2('Aquí las rocas tienen hilos dentro. Hebrita en la pradera, Tintolita en el bosque, Plata de Huso en la ciénaga y Sedalita en la hilandería.', 'Here the rocks have threads inside. Threadite in the meadow, Dyestone in the wood, Spindle Silver in the marsh and Silkstone in the mill.'),
  L2('Cada una pide un pico mejor: los de Hebrita, Tintolita, Plata de Huso y Sedalita se forjan con el mineral y la madera de antes.', 'Each needs a better pickaxe: the Threadite, Dyestone, Spindle Silver and Silkstone ones are forged from the previous ore and wood.')] };
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (!P) return;
  if (npc.id === 'tj_hilario') opts.unshift({ label: '⚒ ' + L2('Forja de las Tierras Tejidas', 'Woven Lands forge'), icon: ['anvil'], fn: () => { closeDialog(); openCraft('herreria'); } });
  if (npc.id === 'tj_cora') opts.unshift({ label: '🧵 ' + L2('Cambiar 20 Hebras Sueltas por 1 Hebrita', 'Trade 20 Loose Threads for 1 Threadite'), icon: ['gem', '#f0a0d0'], fn: () => {
    if (countItem('hebra_suelta') < 20) { typeText(L2('Te faltan hebras. Las criaturas de aquí las sueltan al caer.', 'You need more threads. The creatures here drop them when they fall.')); return; }
    takeItem('hebra_suelta', 20); giveItem('ore19', 1); sfx('coin'); typeText(L2('¡Trato hecho! Hebrita recién salida del tinte.', 'Deal! Threadite fresh out of the dye.')); markDirty(); } }); });

// ---------- mecánicas propias de las criaturas ----------
const tjNear = (m, r) => { const P = G.P; return P && !P.dead && P.map === m.map && dist2(m.x, m.y, P.x, P.y) < r * r; };
function tjMech(m, dt) { const P = G.P, k = m.def.mech; if (!k || m.dying || m.ghost || !P || m.state === 'idle' || m.state === 'return') return; m.mt = (m.mt || 0) - dt; const d = Math.sqrt(dist2(m.x, m.y, P.x, P.y));
  switch (k) {
    case 'dust': if (m.mt <= 0 && d < 100) { m.mt = 4; const x = P.x, y = P.y; telegraph({ shape: 'circle', x, y, r: 26, dur: 0.8, col: 'rgba(240,230,190,0.28)', cb: () => { if (dist2(P.x, P.y, x, y) < 26 * 26) hurtPlayer(m.atk * 0.6, { slow: 2, lv: m.lv }); burst(x, y, 14, { sp: 40, up: 30, g: 20, life: 0.8, c: ['#f4ecc8', '#e8d8a0', '#ffffff'] }); } }); } break;
    case 'web': if (m.mt <= 0 && d < 130) { m.mt = 4.5; const a = Math.atan2(P.y - 8 - (m.y - 6), P.x - m.x); spawnProj('m', m.x, m.y - 6, a, { spd: 130, dmg: m.atk * 0.5, art: 'orb', life: 1.6, slow: 2.5 }); sfx('cast'); } break;
    case 'trail': if (m.state === 'dash' && (m.tt = (m.tt || 0) - dt) <= 0) { m.tt = 0.12; addFx({ type: 'field', ground: true, x: m.x, y: m.y, r: 12, dur: 2.5, col: '#e07ab0', pc: '#ffc0e0', tick: 0.5, cbTick: f => { if (dist2(P.x, P.y, f.x, f.y) < f.r * f.r) hurtPlayer(m.atk * 0.2, { slow: 1.2, lv: m.lv }); } }); } break;
    case 'puddle': if (m.mt <= 0 && d < 140) { m.mt = 5; const x = P.x, y = P.y; addFx({ type: 'field', ground: true, x, y, r: 26, dur: 4, col: '#2250b0', pc: '#90c0ff', tick: 0.5, cbTick: f => { if (dist2(P.x, P.y, f.x, f.y) < f.r * f.r) hurtPlayer(m.atk * 0.25, { poison: 1, lv: m.lv }); } }); } break;
    case 'blink': if (m.mt <= 0 && d < 160 && d > 40) { m.mt = 5.5; const dx = { left: -1, right: 1 }[P.dir] || 0, dy = { up: -1, down: 1 }[P.dir] || 0, nx = P.x - dx * 26, ny = P.y - dy * 22;
      if (!blockedFor(G.map, Math.floor(nx / 16), Math.floor(ny / 16), m.L)) { addFx({ type: 'ring', x: m.x, y: m.y, r: 18, dur: 0.4, col: '#e8e0f0' }); m.x = nx; m.y = ny; addFx({ type: 'ring', x: m.x, y: m.y, r: 18, dur: 0.4, col: '#e8e0f0' }); m.cd = Math.min(m.cd, 0.2); } } break;
    case 'mend': if (m.mt <= 0) { m.mt = 6; let n = 0; for (const e of G.ents) if (e.type === 'mob' && !e.dying && e !== m && e.map === m.map && !e.boss && dist2(e.x, e.y, m.x, m.y) < 90 * 90 && e.hp < e.maxhp) { e.hp = Math.min(e.maxhp, e.hp + e.maxhp * 0.12); n++; floatText(e.x, e.y - (e.hgt || 28), '+', '#7ae04a'); }
      if (n) addFx({ type: 'ring', x: m.x, y: m.y, r: 90, dur: 0.6, col: '#7ae04a' }); } break;
    case 'pull': if (m.mt <= 0 && d < 150 && d > 34) { m.mt = 6.5; telegraph({ shape: 'line', x: m.x, y: m.y, ang: Math.atan2(P.y - m.y, P.x - m.x), len: d, w: 8, dur: 0.6, cb: () => { if (P.dead || P.map !== m.map) return; const a = Math.atan2(m.y - P.y, m.x - P.x), L = Math.min(60, Math.max(0, Math.hypot(m.x - P.x, m.y - P.y) - 22));
      for (let s = 0; s < 6; s++) moveEnt(G.map, P, Math.cos(a) * L / 6, Math.sin(a) * L / 6); P.slowT = Math.max(P.slowT || 0, 1.2); floatText(P.x, P.y - 40, L2('¡Hilo!', 'Thread!'), '#e07ab0'); } }); } break;
  } }
{ const _um = updateMob; updateMob = function (m, dt) { const st0 = m.state, r = _um.apply(this, arguments); try { const k = m.def && m.def.mech; if (k && !m.boss) { tjMech(m, dt);
    // golpe doble de la mantis, ataque sorpresa del lince y corte fuerte de la tijera (justo al acabar la preparación)
    if (st0 === 'windup' && m.state === 'chase' && !m.dying) { const P = G.P, near = dist2(m.x, m.y, P.x, P.y) < (m.range + 14) ** 2;
      if (k === 'double' && near) setTimeout(() => { if (!m.dying && !P.dead && dist2(m.x, m.y, P.x, P.y) < (m.range + 16) ** 2) { hurtPlayer(m.atk * 0.7, { lv: m.lv }); sfx('swing'); } }, 260);
      if (k === 'ambush' && !m.ambushed && near) { m.ambushed = 1; hurtPlayer(m.atk, { lv: m.lv }); floatText(P.x, P.y - 46, L2('¡Emboscada!', 'Ambush!'), '#ffb040'); }
      if (k === 'snip' && near && Math.random() < 0.25) { hurtPlayer(m.atk * 0.6, { poison: 1, lv: m.lv }); floatText(P.x, P.y - 46, L2('¡Tijeretazo!', 'Snip!'), '#ff5a5a'); } }
    if (k === 'wool' && m.wool === undefined) m.wool = 3; if (k === 'wool' && m.wool < 3 && (m.woolT = (m.woolT || 0) + dt) > 8) { m.wool = 3; m.woolT = 0; } } } catch (e) { } return r; }; }
{ const _hm = hitMob; hitMob = function (m, base, src) { try { if (m && m.def && m.def.mech === 'wool' && m.wool > 0 && !m.dying) { m.wool--; m.woolT = 0; base *= 0.2; floatText(m.x, m.y - (m.hgt || 28) - 8, L2('lana', 'wool'), '#c8c0d0'); } } catch (e) { } return _hm.call(this, m, base, src); }; }
{ const _km = killMob; killMob = function (m) {
    if (m && m.def && m.def.mech === 'resew' && !m.resewn && !m.ghost) { m.resewn = 1; m.hp = Math.round(m.maxhp * 0.4); m.dying = 0; floatText(m.x, m.y - (m.hgt || 28) - 10, L2('¡Se recose!', 'It sews itself up!'), '#e07ab0', true); addFx({ type: 'ring', x: m.x, y: m.y, r: 22, dur: 0.5, col: '#e07ab0' }); return; }
    const r = _km.apply(this, arguments);
    try { const k = m && m.def && m.def.mech, P = G.P;
      if (k === 'split' && !m.small && !m.ghost) for (let s = 0; s < 2; s++) { const e = spawnMob(m.mid, Math.max(1, m.lv - 3), m.x + (s ? 10 : -10), m.y + 4, m.L, null, false); e.map = m.map; e.small = 1; e.hp = e.maxhp = Math.round(e.maxhp * 0.3); e.xp = Math.round(e.xp * 0.2); e.gold = 0; e.def = Object.assign({}, e.def, { drops: [] }); e.name = L2('Ovillito', 'Small Yarnball'); e.state = 'chase'; e.home = { x: e.x, y: e.y }; }
      if (k === 'splash' && !m.ghost) { const x = m.x, y = m.y; telegraph({ shape: 'circle', x, y, r: 40, dur: 0.7, col: 'rgba(40,90,200,0.25)', cb: () => { if (dist2(P.x, P.y, x, y) < 40 * 40) hurtPlayer(m.atk * 1.1, { slow: 2, poison: 1, lv: m.lv }); burst(x, y, 20, { sp: 90, up: 40, g: 120, life: 0.6, c: ['#2250b0', '#4a80e0', '#e07ab0'] }); } }); }  } catch (e) { }
    return r; }; }

// ---------- movimientos propios de los jefes ----------
FAR.push('tj_polvo', 'tj_atadura', 'tj_giro', 'tj_deshilar', 'tj_silencio'); NEAR.push('tj_polvo', 'tj_giro', 'tj_silencio');
{ const _bm = bossMove; bossMove = function (m, mv) { if (!mv || !mv.startsWith('tj_')) return _bm.apply(this, arguments); const P = G.P; setAnim(m, 'atk'); mobFace(m, P.x - m.x, P.y - m.y);
  switch (mv) {
    case 'tj_polvo': { const r = 110; telegraph({ shape: 'circle', x: m.x, y: m.y, r, dur: 1.1, col: 'rgba(240,230,190,0.22)', cb: () => { if (dist2(P.x, P.y, m.x, m.y) < r * r) hurtPlayer(m.atk * 1.4, { slow: 3, lv: m.lv }); for (let k = 0; k < 30; k++) part(m.x + (Math.random() - 0.5) * r * 2, m.y + (Math.random() - 0.5) * r * 1.4, { vz: 20, g: -4, life: 1.2, c: pick(['#f4ecc8', '#ffffff', '#e8d8a0']) }); } }); m.busyT = 1.1; break; }
    case 'tj_atadura': { const a = Math.atan2(P.y - m.y, P.x - m.x), d = Math.hypot(P.x - m.x, P.y - m.y); telegraph({ shape: 'line', x: m.x, y: m.y, ang: a, len: Math.min(220, d + 10), w: 12, dur: 0.8, cb: () => {
        if (P.dead || P.map !== m.map || Math.hypot(P.x - m.x, P.y - m.y) > 240) return; const b = Math.atan2(m.y - P.y, m.x - P.x), L = Math.max(0, Math.hypot(m.x - P.x, m.y - P.y) - 30); for (let s = 0; s < 10; s++) moveEnt(G.map, P, Math.cos(b) * L / 10, Math.sin(b) * L / 10);
        P.slowT = Math.max(P.slowT || 0, 2.5); floatText(P.x, P.y - 42, L2('¡Atado!', 'Bound!'), '#e07ab0', true); setTimeout(() => { if (!m.dying) bossMove(m, 'slam'); }, 350); } }); m.busyT = 1.3; break; }
    case 'tj_giro': { for (const w of [0, 1]) setTimeout(() => { if (m.dying) return; const n = 14; for (let k = 0; k < n; k++) spawnProj('m', m.x, m.y - 10, (k + w * 0.5) / n * Math.PI * 2 + G.t, { spd: 95 + w * 20, dmg: m.atk * 0.7, art: 'orb', life: 2.2, slow: 1 }); sfx('cast'); }, w * 450); m.busyT = 1; break; }
    case 'tj_deshilar': { const px = P.x, py = P.y; for (let k = 0; k < 4; k++) { const ang = k * Math.PI / 2 + Math.PI / 4, sx = px - Math.cos(ang) * 120, sy = py - Math.sin(ang) * 120;
        setTimeout(() => telegraph({ shape: 'line', x: sx, y: sy, ang, len: 240, w: 16, dur: 0.9, col: 'rgba(30,30,40,0.3)', cb: () => { const vx = P.x - sx, vy = P.y - sy, along = vx * Math.cos(ang) + vy * Math.sin(ang), perp = Math.abs(-vx * Math.sin(ang) + vy * Math.cos(ang)); if (along > 0 && along < 240 && perp < 12) hurtPlayer(m.atk * 1.3, { lv: m.lv }); } }), k * 120); }
      m.busyT = 1.2; break; }
    case 'tj_silencio': { const x = P.x, y = P.y, r = 70; telegraph({ shape: 'circle', x, y, r, dur: 1.3, col: 'rgba(20,20,30,0.35)', cb: () => { if (dist2(P.x, P.y, x, y) < r * r) { hurtPlayer(m.atk * 1.6, { slow: 2.5, lv: m.lv }); const lost = Math.round(P.mp * 0.3); P.mp -= lost; if (lost) floatText(P.x, P.y - 52, '−' + lost + ' MP', '#8aa0ff'); } } }); m.busyT = 1.2; break; }
  } }; }
// los jefes vencidos dejan un brillo de hilo donde estaban
{ const _bk = bossKilled; bossKilled = function (m) { const r = _bk.apply(this, arguments); try { if (m && TJ_BOSS_AT[m.mid]) { banner(m.name, L2('El nudo se deshace', 'The knot comes undone')); for (let k = 0; k < 40; k++) part(m.x + (Math.random() - 0.5) * 60, m.y - 20, { vz: 30, g: -6, life: 1.6, c: pick(['#ffc0e0', '#f0d890', '#ffffff', '#90c0ff']) }); } } catch (e) { } return r; }; }

// ---------- Lupa ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['tejidas578', '🧶 ' + L2('Tierras Tejidas y nivel 600 (5.78)', 'Woven Lands and level 600 (5.78)'), () => [
  L2('El nivel máximo sube a 600. Al sur de Sahrim y Yarakai (y al este de Nhar) hay una región nueva: las Tierras Tejidas (nivel 500 a 600). Se llega por los andenes de las estaciones Sahrim y Yarakai, que bajan al mar.', 'The level cap rises to 600. South of Sahrim and Yarakai (and east of Nhar) there is a new region: the Woven Lands (level 500 to 600). Reach it from the Sahrim and Yarakai station platforms, which lead down to the sea.'),
  L2('Zonas: Pradera de Algodón (500-528), Bosque de Ovillos (520-552), Ciénaga de Tinte (545-578) y Hilandería Rota (572-600). En el Campamento de las Hebras están Ovidia, Maese Hilario (forja), Cora, Fray Lino, Pip y Brígida.', 'Zones: Cotton Meadow (500-528), Yarnball Wood (520-552), Dye Marsh (545-578) and Broken Spinning Mill (572-600). At the Thread Camp you will find Ovidia, Master Hilario (forge), Cora, Brother Lino, Pip and Brígida.'),
  ...TJ_MOBS.map(([id]) => '• ' + MOBS[id].n + ' (' + MOBS[id].lv[0] + '-' + MOBS[id].lv[1] + '): ' + MOBS[id].mechD),
  ...Object.keys(TJ_BOSS_AT).map(id => '👑 ' + BOSSES[id].n + ' (' + L2('nivel ', 'level ') + BOSSES[id].lv + '): ' + TJ_BOSS_D[id]),
  L2('Minerales nuevos: Hebrita (pradera), Tintolita (bosque), Plata de Huso (ciénaga) y Sedalita (hilandería), cada uno con su pico (14 a 17). Maderas: Árbol de Algodón, Sauce Hilandero, Roble de Ovillos y Ceiba de Seda.', 'New ores: Threadite (meadow), Dyestone (wood), Spindle Silver (marsh) and Silkstone (mill), each with its own pickaxe (14 to 17). Woods: Cotton Tree, Spinner Willow, Yarnball Oak and Silk Ceiba.'),
  L2('Equipo nuevo de nivel 505 a 600 (7 tiers): armaduras con un diseño distinto para cada clase y 49 armas nuevas. Se forjan con Maese Hilario usando los minerales y lo que sueltan los cuatro jefes.', 'New level 505 to 600 gear (7 tiers): armour with a different design for each class and 49 new weapons. Forged with Master Hilario using the ores and what the four bosses drop.')
], () => G.P && G.P.map === 'world' ? { loc: TJZ.ws, m: 'world', t: L2('Campamento de las Hebras', 'Thread Camp') } : null]);
// «Dónde conseguir»: las maderas nuevas apuntan a sus árboles de las Tierras Tejidas
{ const _is = itemSources; itemSources = function (id) { const out = _is.apply(this, arguments); try { const m = /^log(\d+)$/.exec(id), R_ = m && TJ_RES.find(r => r[0] === +m[1]);
  if (R_ && Array.isArray(out)) { const W = G.world, o = W && W.objs.find(o => o.k === 'tree' && o.sp === R_[4]); for (const s of out) if (s && s[1] && o && /^(Tala|Woodcutting)/.test(s[0])) s[1].loc = [o.tx, o.ty]; } } catch (e) { } return out; }; }
