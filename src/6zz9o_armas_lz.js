// ================= v4.71: ARMAS Y EQUIPO DE LAS TIERRAS SIN PINTAR (tiers 27-30 y el arma del Lienzo, 31) =================
// Armas de la hoja de Sergio (tools/dev/armas_lz.py → 6zz9n_armas_lz_data.js), cinco por clase. El arquero no salía en la
// hoja y usa el arco del Velo Roto en blanco y lila. Tiers 27 (360), 28 (372), 29 (384), 30 (396) en la herrería con Tinta
// Viva y Pigmento Puro; el 31 (nivel 400) solo lo suelta El Lienzo en Blanco. Armaduras 27-30 (su aspecto propio llega en
// la 4.72; de momento usan el dibujo de placas con la paleta de tiza y lila).
Object.assign(ARM_ICON, ARMZ_ICON); Object.assign(ARM_HD, ARMZ_HD); Object.assign(ARM_PIVK16, ARMZ_PIV16); Object.assign(ARM_PIVK32, ARMZ_PIV32);
for (const k in ARMZ_ICON) ARM_PIX[k] = wsprPix(ARMZ_ICON[k]);
for (const k in ARMZ_HAND) ARM_HPIX[k] = wsprPix(ARMZ_HAND[k]);
for (const k in ARMZ_HD) { const im = new Image(); im.onload = () => { try { ARM_HDP[k] = armPixFromImg(im); } catch (e) { } }; im.src = ARMZ_HD[k]; }
for (const t in ARMZ_ATLAS) { const im = new Image(); im.src = ARMZ_ATLAS[t]; WSPR_IMG['arm' + t] = im; }

const LZ_T = { 27: ['tiza', L2('de Tiza', 'of Chalk'), 360, ['#3a3448', '#6a6480', '#a8a2bc', '#d8d4e6', '#f6f4fc']], 28: ['trazo', L2('del Trazo', 'of the Stroke'), 372, ['#2a2040', '#4a3a6a', '#8a78b0', '#c8b8e8', '#f4ecff']],
  29: ['cal', L2('de Cal', 'of Lime'), 384, ['#3a3830', '#6a665a', '#a8a494', '#dcd8c8', '#fffcf0']], 30: ['lienzo', L2('del Lienzo', 'of the Canvas'), 396, ['#2a1a3a', '#5a3a7a', '#9a70c0', '#d8c0f0', '#ffffff']],
  31: ['eterno', L2('del Lienzo Eterno', 'of the Eternal Canvas'), 400, ['#3a2a10', '#7a5a20', '#c8a050', '#f0dca0', '#fffbe8']] };
// nombres de la hoja de Sergio
const LZ_WN = {
  bardo: [['Flauta-Daga del Soplo Vacío', 'Flute-Dagger of the Empty Breath'], ['Campana Encantada de la Sala en Blanco', 'Enchanted Bell of the Blank Hall'], ['Tambor de Guerra del Lienzo Mudo', 'War Drum of the Mute Canvas'], ['Violín Místico del Trazo Eterno', 'Mystic Violin of the Eternal Stroke'], ['Laúd-Espada de la Página Inconclusa', 'Lute-Sword of the Unfinished Page']],
  mago: [['Varita Quebrada del Hechizo Inacabado', 'Broken Wand of the Unfinished Spell'], ['Orbe del Lienzo sin Forma', 'Orb of the Formless Canvas'], ['Grimorio de los Bocetos Prohibidos', 'Grimoire of the Forbidden Sketches'], ['Báculo Rúnico de la Línea Primordial', 'Runic Staff of the Primordial Line'], ['Cetro-Pincel de la Pintura aún no Nacida', 'Brush-Sceptre of the Unborn Paint']],
  guerrero: [['Lanza de Mármol de la Estatua Incompleta', 'Marble Spear of the Incomplete Statue'], ['Hacha de Yeso de las Formas Rotas', 'Plaster Axe of the Broken Forms'], ['Martillo de Cal del Molde Perdido', 'Lime Hammer of the Lost Mould'], ['Espada y Escudo Agrietados del Pacto sin Pintar', 'Cracked Sword and Shield of the Unpainted Pact'], ['Espadón del Vacío Blanco', 'Greatsword of the White Void']],
  pez: [['Arpón Etéreo del Naufragio de Papel', 'Ethereal Harpoon of the Paper Wreck'], ['Chakram de Concha del Giro Infinito', 'Shell Chakram of the Endless Spin'], ['Hoja de Marea del Dibujo Sumergido', 'Tide Blade of the Sunken Drawing'], ['Cetro Coralino de los Arrecifes sin Color', 'Coral Sceptre of the Colourless Reefs'], ['Tridente Perlado de la Marea Incolora', 'Pearl Trident of the Colourless Tide']],
  asesino: [['Kunais del Boceto Fugaz', 'Kunai of the Fleeting Sketch'], ['Shuriken Lunar del Eclipse de Boceto', 'Lunar Shuriken of the Sketch Eclipse'], ['Abanico de Cuchillas del Viento en Blanco', 'Blade Fan of the Blank Wind'], ['Kusarigama sin Tinta de la Línea Circular', 'Inkless Kusarigama of the Circular Line'], ['Katana Pálida del Trazo Silencioso', 'Pale Katana of the Silent Stroke']],
  invocador: [['Talismán Cristalino del Vínculo sin Color', 'Crystal Talisman of the Colourless Bond'], ['Campana Ritual del Llamado Inconcluso', 'Ritual Bell of the Unfinished Call'], ['Incensario de los Espíritus en Borrador', 'Censer of the Draft Spirits'], ['Libro de Invocación de las Formas por Pintar', 'Summoning Book of the Forms to Paint'], ['Bastón de Sellos de las Criaturas sin Nombre', 'Seal Staff of the Nameless Creatures']],
  arquero: [['Arco de Tiza', 'Chalk Bow'], ['Arco del Trazo', 'Stroke Bow'], ['Arco de Bruma Pálida', 'Pale Mist Bow'], ['Arco del Boceto', 'Sketch Bow'], ['Arco del Lienzo Eterno', 'Bow of the Eternal Canvas']],
};
const LZ_REC = { 27: [['tinta_viva', 8], ['pigmento_puro', 2]], 28: [['tinta_viva', 10], ['pigmento_puro', 3]], 29: [['tinta_viva', 12], ['pigmento_puro', 4]], 30: [['tinta_viva', 14], ['pigmento_puro', 6]] };
for (const t in LZ_T) { const [k, nm, lv, pl] = LZ_T[t]; TIER[t] = { k, m: nm, f: nm, mp: nm, fp: nm, lv, p: +t }; TIERP[t] = pal(pl); const i = t - 27;
  for (const c of Object.keys(WBASE).concat(['pez'])) { const [bn, g, art, mul] = WBASE[c === 'pez' ? 'guerrero' : c]; const nmz = (LZ_WN[c] || [])[i], id = +t === 31 ? 'wlz_' + c : `w_${c}_${t}`;
    it(id, { n: nmz ? L2(nmz[0], nmz[1]) : `${bn} ${nm}`, t: 'weapon', slot: 'weapon', cls: c, lv, tier: +t, atk: Math.round((8 + lv * 3.1 + t * 5) * mul * (c === 'pez' ? 0.98 : 1)), crit: c === 'arquero' ? +t : c === 'asesino' ? t * 1.5 : c === 'pez' ? Math.round(t * 0.6) : 0, mpB: c === 'mago' || c === 'invocador' ? t * 12 : c === 'bardo' ? t * 8 : 0, price: Math.round(30 * Math.pow(t, 2.4)), icon: ['arm', c, +t], rar: 5, lz: 1 }); }
  if (+t === 31) continue;
  const def = 3 + lv * 1.4 + t * 2;
  it(`h_${t}`, { n: L2('Casco ', 'Helmet ') + nm, t: 'armor', slot: 'head', lv, tier: +t, def: Math.round(def * 0.45), hpB: Math.round(lv * 1.5), price: Math.round(14 * Math.pow(t, 2.3)), icon: ['helm', 15], rar: 5 });
  it(`b_${t}`, { n: L2('Armadura ', 'Armor ') + nm, t: 'armor', slot: 'body', lv, tier: +t, def: Math.round(def), hpB: Math.round(lv * 3.5), price: Math.round(20 * Math.pow(t, 2.3)), icon: ['armor', 15], rar: 5 });
  it(`l_${t}`, { n: L2('Grebas ', 'Greaves ') + nm, t: 'armor', slot: 'legs', lv, tier: +t, def: Math.round(def * 0.6), hpB: Math.round(lv * 2), price: Math.round(16 * Math.pow(t, 2.3)), icon: ['legs', 15], rar: 5 });
  it(`f_${t}`, { n: L2('Botas ', 'Boots ') + nm, t: 'armor', slot: 'feet', lv, tier: +t, def: Math.round(def * 0.35), spdB: 9, price: Math.round(12 * Math.pow(t, 2.3)), icon: ['boots', 15], rar: 5 });
  const mats = LZ_REC[t]; for (const s of ['h', 'b', 'l', 'f']) RECIPES.push({ id: `r_${s}_${t}`, job: 'herreria', out: `${s}_${t}`, n: 1, lv, jlv: 1, gold: 140000 * (t - 20), mats, cat: 'armadura' });
  for (const c of Object.keys(WBASE).concat(['pez'])) RECIPES.push({ id: `r_w_${c}_${t}`, job: 'herreria', out: `w_${c}_${t}`, n: 1, lv, jlv: 1, gold: 180000 * (t - 20), mats, cat: 'arma', cls: c }); }
// el arma del Lienzo: la suelta El Lienzo en Blanco (6 %, la de tu clase)
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { const P = G.P; if (m && m.mid === 'lienzo_blanco' && P && Math.random() < 0.06 && ITEMS['wlz_' + P.cls]) { giveItem('wlz_' + P.cls, 1); banner(L2('Arma del Lienzo', 'Canvas weapon'), ITEMS['wlz_' + P.cls].n); } } catch (e) { } return r; }; }
// los jefes del borde sueltan más Pigmento Puro y, a veces, un arma de tu clase de su nivel
{ const _km = killMob; killMob = function (m) { const r = _km.apply(this, arguments); try { const P = G.P; if (m && m.boss && m.map === 'sin_pintar' && P && Math.random() < 0.15) { const t = m.lv >= 390 ? 30 : m.lv >= 378 ? 29 : m.lv >= 366 ? 28 : 27, id = `w_${P.cls}_${t}`; if (ITEMS[id]) giveItem(id, 1); } } catch (e) { } return r; }; }
// el online acepta los tiers nuevos
{ const _cg = cleanGear; cleanGear = function (g) { const o = _cg.apply(this, arguments); for (const k of ['weapon', 'head', 'body', 'legs', 'feet']) { const v = g && +g[k]; if (isFinite(v) && v > 26 && v <= 31) o[k] = v | 0; } return o; }; }
if (typeof GSIS !== 'undefined') GSIS.push(['armas_lienzo', '🖌 ' + L2('Armas y equipo del Lienzo (tiers 27-31)', 'Canvas weapons and gear (tiers 27-31)'), () => [
  L2('Cinco armas por clase con el dibujo de Sergio: tiers 27 (nivel 360), 28 (372), 29 (384) y 30 (396) y el arma del Lienzo Eterno (31, nivel 400). El arquero lleva arcos de tiza.', 'Five weapons per class with Sergio\'s drawing: tiers 27 (level 360), 28 (372), 29 (384) and 30 (396) and the Eternal Canvas weapon (31, level 400). The archer carries chalk bows.'),
  L2('Cómo conseguirlas: en la herrería con Tinta Viva (la sueltan las criaturas de Las Tierras sin Pintar) y Pigmento Puro (los jefes del borde). Los jefes del borde también sueltan a veces un arma de tu clase. El arma del Lienzo Eterno solo la suelta El Lienzo en Blanco (6 %).', 'How to get them: at the blacksmith with Living Ink (dropped by Unpainted Lands creatures) and Pure Pigment (the border bosses). Border bosses also sometimes drop a weapon of your class. The Eternal Canvas weapon is only dropped by The Blank Canvas (6%).'),
  L2('Armaduras de tiza, trazo, cal y lienzo (27-30) en la herrería con los mismos materiales.', 'Chalk, stroke, lime and canvas armour (27-30) at the blacksmith with the same materials.')], () => null]);
// dificultad medida otra vez con el equipo nuevo (tools/dev/jefes.py)
Object.assign(BOSS_TUNE, { tsp_marco: 1.21 });
