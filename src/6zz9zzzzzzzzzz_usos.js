// ================= v5.33: PARA QUÉ SIRVE CADA OBJETO =================
// Al tocar un objeto del inventario, al lado sale «Para qué sirve» con TODOS sus usos (español e inglés).
// Los usos salen solos de las recetas y sistemas del juego (herrería, cocina, hogueras, alquimia, taller,
// construcción, forja artesanal, maestría, misiones, museo, subrazas, conjuros, monturas, tiendas…), así que
// lo nuevo que se añada a esas tablas aparece sin tocar este archivo. Lo que se gasta en un sitio suelto va en USO_X.
// En la Lupa hay una pestaña nueva «🎒 Objetos» con buscador para todo (materiales, comida, pociones, picos,
// runas, objetos de misión…) y su «Para qué sirve» + «Dónde conseguir».

const USO = { idx: null, lang: null };
const usoN = id => ITEMS[id] ? ITEMS[id].n : id;
const usoJob = j => typeof JOBS !== 'undefined' && JOBS[j] ? JOBS[j].n : j;
// usos sueltos (cosas que se gastan en un sitio concreto): id → () => [líneas]
const USO_X = {
  piedra1: () => [L2('⚒ Mejora de equipo en el herrero: de +1 a +4.', '⚒ Gear upgrade at the blacksmith: from +1 to +4.')],
  piedra2: () => [L2('⚒ Mejora de equipo en el herrero: de +5 a +7.', '⚒ Gear upgrade at the blacksmith: from +5 to +7.')],
  piedra3: () => [L2('⚒ Mejora de equipo en el herrero: de +8 a +10.', '⚒ Gear upgrade at the blacksmith: from +8 to +10.')],
  piedra: () => [L2('🏘 Dónala en el tablón de un pueblo para reparar casas y subir la prosperidad.', '🏘 Donate it at a town board to repair houses and raise prosperity.'), L2('✨ Armas ancestrales: 20 de piedra + 5 Polvo Arcano para restaurar su estela.', '✨ Ancestral weapons: 20 stone + 5 Arcane Dust to restore their stele.'), L2('🛩 Aeronave: 50 de piedra (misión del cielo).', '🛩 Airship: 50 stone (sky quest).')],
  ficha_coliseo: () => [L2('🏟 Moneda del Coliseo: cámbiala en el Coliseo por premios.', '🏟 Colosseum currency: trade it at the Colosseum for prizes.')],
  ficha_festival: () => [L2('🎪 Moneda de los festivales: cámbiala en el puesto del festival y juega a las apuestas (2 fichas).', '🎪 Festival currency: trade it at the festival stall and play the bets (2 tokens).')],
  perla: () => [L2('🐚 Misiones de Nerea (fondo marino) piden perlas.', '🐚 Nerea quests (seabed) ask for pearls.'), L2('📿 Perlina ensarta un Collar de Perlas Doradas con 6 perlas, 5 rosas y 3 doradas.', '📿 Perlina strings a Golden Pearl Necklace with 6 pearls, 5 pink and 3 golden.')],
  perla_rosa: () => [L2('📿 Perlina: Collar de Perlas Doradas (5 perlas rosas + 6 perlas + 3 doradas).', '📿 Perlina: Golden Pearl Necklace (5 pink + 6 pearls + 3 golden).')],
  perla_dorada: () => [L2('📿 Perlina: Collar de Perlas Doradas (3 doradas + 6 perlas + 5 rosas).', '📿 Perlina: Golden Pearl Necklace (3 golden + 6 pearls + 5 pink).')],
  polvo_lunar: () => [L2('🌙 Moneda del Tendero Imposible (Velo Roto): objetos que no existen en otro sitio.', '🌙 Currency of the Impossible Shopkeeper (Broken Veil): items that exist nowhere else.')],
  esencia_espectral: () => [L2('👻 Mascotas del Velo: 5 esencias + oro.', '👻 Veil pets: 5 essences + gold.')],
  esencia_portal: () => [L2('⛩ Moneda de la Torre de los Portales: elixires, pociones, diamantes y ropa de cazador (12 por prenda).', '⛩ Portal Tower currency: elixirs, potions, diamonds and hunter clothes (12 per piece).')],
  polvo_arcano: () => [L2('📚 Academia Arcana: compra libros mágicos, escobas y lecciones.', '📚 Arcane Academy: buy magic books, brooms and lessons.'), L2('✨ Armas ancestrales: 5 polvo + 20 de piedra para restaurar su estela.', '✨ Ancestral weapons: 5 dust + 20 stone to restore their stele.')],
  tinta_viva: () => [L2('🎨 Dale 10 gotas a Mael, la Pintora del Borde: tu hilo gana color (progreso de las Tierras sin Pintar).', '🎨 Give 10 drops to Mael, the Painter of the Edge: your thread gains colour (Unpainted Lands progress).')],
  hierba_sueno: () => [L2('☾ Duerme en tu cama de 22:00 a 4:00 con ella y sueñas seguro (Mundo de los Sueños). Se gasta una.', '☾ Sleep in your bed from 22:00 to 4:00 with it and you always dream (Dream World). Uses one.')],
  polvo_sueno: () => [L2('☾ Moneda de Oniria en el Mundo de los Sueños: elixires, pociones y hierba del sueño.', '☾ Oniria\'s currency in the Dream World: elixirs, potions and dream herb.')],
  fragmento_mapa: () => [L2('🗺 Junta 4 y descífralos con el arqueólogo: abre la tumba antigua.', '🗺 Gather 4 and decipher them with the archaeologist: opens the ancient tomb.')],
  frag_mapa: () => [L2('🗺 Une 4 Fragmentos de Mapa para hacer un Mapa Celeste.', '🗺 Join 4 Map Fragments to make a Sky Map.')],
  mapa_celeste: () => [L2('🗺 Llévalo a una isla del cielo marcada: cofre con núcleos, escama y 25.000 de oro.', '🗺 Take it to a marked sky isle: chest with cores, a scale and 25,000 gold.')],
  colgante_amor: () => [L2('💍 Dáselo a quien tenga muchos corazones para pedirle ser tu pareja.', '💍 Give it to someone with many hearts to ask them to be your partner.')],
  anillo_boda: () => [L2('💒 Lo necesitas para la boda con tu pareja.', '💒 You need it for the wedding with your partner.')],
  cometa: () => [L2('🪁 Úsala en un sitio abierto: vuela la cometa con ⬆/⬇. Ganas oro según la altura (se gasta).', '🪁 Use it in an open place: fly the kite with ⬆/⬇. You earn gold by height (used up).')],
  nucleo_viento: () => [L2('🪽 Alas de Serafín: 10 núcleos de viento + 20 Plumas del Alba.', '🪽 Seraph Wings: 10 wind cores + 20 Dawn Feathers.')],
  pluma_alba: () => [L2('🪽 Alas de Serafín: 20 plumas + 10 núcleos de viento.', '🪽 Seraph Wings: 20 feathers + 10 wind cores.'), L2('☁ La Escalera de Nubes: 5 plumas + oro por cada tramo.', '☁ The Cloud Stairway: 5 feathers + gold per section.')],
  colmillo_lunar: () => [L2('🐺 Subraza Mitad Lobo: ofrenda de 8 colmillos (y 200.000 de oro).', '🐺 Half-Wolf subrace: an offering of 8 fangs (and 200,000 gold).')],
};
// ¿qué hace cada mejora? (claves de buffs)
const USO_ST = { atkP: ['ataque', 'attack'], defP: ['defensa', 'defence'], spdP: ['velocidad', 'speed'], aspdP: ['vel. de ataque', 'attack speed'], pcrit: ['crítico', 'crit'], crit: ['crítico', 'crit'], pxp: ['experiencia', 'experience'], xpB: ['experiencia', 'experience'], phpP: ['vida', 'HP'], hpP: ['vida', 'HP'], dodge: ['esquiva', 'dodge'] };
const usoSt = o => Object.entries(o || {}).filter(([k]) => USO_ST[k]).map(([k, v]) => '+' + v + ' % ' + L2(USO_ST[k][0], USO_ST[k][1])).join(', ');

function usoBuild() {
  const I = {}, logs = Object.keys(ITEMS).filter(k => /^log\d+$/.test(k));
  const add = (id, key, head, what) => { if (!ITEMS[id]) return; const g = I[id] = I[id] || {}; const e = g[key] = g[key] || { h: head, s: new Set() }; if (what) e.s.add(what); };
  const each = (mats, fn) => { for (const m of mats || []) { if (!m) continue; const id = Array.isArray(m) ? m[0] : m; if (id === 'log') logs.forEach(fn); else fn(id); } };
  const T = f => { try { f(); } catch (e) { } };
  // recetas de todos los oficios (herrería, cocina, alquimia, joyería, sastrería…)
  T(() => { for (const r of RECIPES) { if (!ITEMS[r.out]) continue; const h = '⚒ ' + L2('Material para fabricar', 'Material to craft') + ' (' + usoJob(r.job) + ')'; each(r.mats, id => add(id, 'r_' + r.job, h, usoN(r.out))); each(r.alt, id => add(id, 'r_' + r.job, h, usoN(r.out))); } });
  T(() => { for (const L_ of ALCH) each(L_[4], id => add(id, 'alch', '⚗ ' + L2('Mesa de alquimia', 'Alchemy table'), usoN(L_[0]))); });
  T(() => { for (const L_ of WORK) if (ITEMS[L_[0]]) each(L_[4], id => add(id, 'work', '🔨 ' + L2('Taller del artesano', 'Artisan workshop'), usoN(L_[0]))); });
  T(() => { for (const d of PL) each(d[8], id => add(id, 'pl', '🔥 ' + L2('Ingrediente para cocinar en la hoguera', 'Ingredient to cook at the campfire'), L2(d[1], d[2]))); });
  // construcción, granja y muebles
  T(() => { for (const k in BK) { const b = BK[k]; if (!b || b.sys || !b.cost) continue; each(b.cost, id => add(id, 'bk', '🏠 ' + L2('Para construir (modo construcción)', 'To build (build mode)'), b.n)); } });
  // forja artesanal
  T(() => { for (const c of FG_CORE) add(c[0], 'fgc', '⚒ ' + L2('Forja artesanal: núcleo de arma (5)', 'Artisan forge: weapon core (5)'), L2(c[1], c[2])); });
  T(() => { for (const R of FG_RUNE) add(R[5], 'fgr', '⚒ ' + L2('Forja artesanal: grabar runa (3)', 'Artisan forge: engrave rune (3)'), L2(R[1], R[2]) + ' — ' + R[4]); });
  // maestría de oficio, subrazas, conjuros, monturas
  T(() => { for (const j in MAST) MAST[j].mats.forEach((ms, i) => each(ms, id => add(id, 'mast', '⭐ ' + L2('Maestría de oficio', 'Job mastery'), usoJob(j) + ' · ' + MAST_RANK[i + 1]))); });
  T(() => { for (const k in SR) each(SR[k].cost, id => add(id, 'sr', '🐺 ' + L2('Ofrenda para la subraza', 'Subrace offering'), SR[k].n)); });
  T(() => { for (const k in CJ) each(CJ[k].cost[1], id => add(id, 'cj', '✦ ' + L2('Aprender conjuro (Ilvaine)', 'Learn spell (Ilvaine)'), CJ[k].n)); });
  T(() => { for (const k in MOUNTS) if (MOUNTS[k].egg) add(MOUNTS[k].egg, 'egg', '🥚 ' + L2('Incúbalo en el establo: nace la montura', 'Hatch it at the stable: the mount is born'), MOUNTS[k].n); });
  // tiendas con moneda propia
  T(() => { for (const [id, gp, pp] of IMPOS) add('polvo_lunar', 'impos', '🌙 ' + L2('Tendero Imposible', 'Impossible Shopkeeper'), usoN(id) + ' (' + pp + ')'); });
  T(() => { for (const [id, c] of DRM_SHOP) add('polvo_sueno', 'drm', '☾ ' + L2('Tienda de Oniria', 'Oniria\'s shop'), usoN(id) + ' (' + c + ')'); });
  T(() => { for (const [id, c] of TP_SHOP) add('esencia_portal', 'tps', '⛩ ' + L2('Tienda de la Torre', 'Tower shop'), usoN(id) + ' (' + c + ')'); });
  // misiones que lo piden
  T(() => { for (const q in QUESTS) { const Q = QUESTS[q]; for (const o of Q.obj || []) { const id = o.it || o.item; if (id && o.t !== 'craft' && o.t !== 'kill') add(id, 'quest', '📜 ' + L2('Lo pide la misión', 'Needed by the quest'), Q.n); } } });
  // museo y colecciones
  T(() => { for (const M of MUSEUM) for (const id of M[2]) add(id, 'mus', '🏛 ' + L2('Museo: dónalo a la colección', 'Museum: donate it to the collection'), M[1]); });
  // ramos de la floristería
  T(() => { for (const id in ITEMS) { const m = /^flor_(.+)$/.exec(id); if (m && ITEMS['ramo_' + m[1]]) add(id, 'flor', '💐 ' + L2('Floristería (vivero): 3 flores = un ramo', 'Florist (nursery): 3 flowers = a bouquet'), usoN('ramo_' + m[1])); } });
  T(() => { for (const id of AQ_FISH()) add(id, 'aq', '🐠 ' + L2('Acuario de tu casa (hasta 8 peces)', 'Your home aquarium (up to 8 fish)')); });
  // salidas: «se fabrica con…»
  T(() => { for (const r of RECIPES) if (ITEMS[r.out]) add(r.out, 'made', '🛠 ' + L2('Se fabrica con el oficio', 'Crafted with the job'), usoJob(r.job) + (r.jlv > 1 ? ' ' + r.jlv : '')); });
  return I;
}
function usoIdx() { const lg = L2('es', 'en'); if (!USO.idx || USO.lang !== lg) { USO.idx = usoBuild(); USO.lang = lg; } return USO.idx; }

// todos los usos de un objeto: lista de líneas de texto
function itemUses(id) {
  const it = ITEMS[id]; if (!it) return []; const P = G.P, out = [], push = t => { if (t && !out.includes(t)) out.push(t); };
  const min = s => Math.max(1, Math.round((s || 0) / 60));
  // 1) lo que hace por sí mismo
  if (it.slot && (it.t === 'weapon' || it.t === 'armor' || it.t === 'acc')) {
    const sl = { weapon: L2('arma', 'weapon'), head: L2('cabeza', 'head'), body: L2('torso', 'body'), legs: L2('piernas', 'legs'), feet: L2('pies', 'feet'), acc: L2('anillo', 'ring'), neck: L2('amuleto', 'amulet') }[it.slot] || it.slot;
    push('🛡 ' + L2('Equípalo (botón Equipar) en la ranura de ', 'Equip it (Equip button) in the slot: ') + sl + (it.cls && typeof CLASSES !== 'undefined' && CLASSES[it.cls] ? ' · ' + L2('solo ', 'only ') + CLASSES[it.cls].n : '') + (it.lv ? ' · ' + L2('nivel ', 'level ') + it.lv : '') + '.');
    if (it.t !== 'acc') push('⚒ ' + L2('Mejóralo en el herrero de +1 a +10 con Piedras de mejora y oro.', 'Upgrade it at the blacksmith from +1 to +10 with Upgrade stones and gold.'));
    if (it.t === 'weapon') push('⚒ ' + L2('Forja artesanal (herrero): ponle un núcleo de mineral y graba una runa.', 'Artisan forge (blacksmith): give it an ore core and engrave a rune.'));
    if (it.anc) push('✨ ' + L2('Arma ancestral: despierta restaurando su estela, hablando con quien conoció a su portador y venciendo a su creador.', 'Ancestral weapon: it awakens by restoring its stele, talking to someone who knew its bearer and defeating its maker.'));
    push('👨‍👩‍👧 ' + L2('También puedes dárselo a tus hijos o a tu pareja si tienen el nivel.', 'You can also give it to your kids or partner if they have the level.'));
  }
  if (it.t === 'tool') push('⛏ ' + L2('Herramienta de ', 'Tool for ') + usoJob(it.tool) + ' (' + L2('potencia ', 'power ') + it.power + '): ' + L2('más potencia = recursos de más nivel y más rápido. Llévala en la mochila: se usa sola.', 'more power = higher-level resources, faster. Keep it in your bag: it is used automatically.'));
  if (it.t === 'cos') push('👗 ' + L2('Úsalo para guardarlo en tu armario y ponértelo cuando quieras (se ve en el online).', 'Use it to store it in your wardrobe and wear it any time (visible online).'));
  if (it.t === 'cons') {
    if (it.d) push('✨ ' + it.d);
    if (it.heal && !it.plato) push('❤ ' + L2('Úsalo para curarte ', 'Use it to heal ') + fmt(Math.min(it.heal, 99999)) + L2(' de vida', ' HP') + (!it.food ? L2(' (puedes ponerlo como poción rápida).', ' (you can set it as your quick potion).') : '.'));
    if (it.mana) push('🔷 ' + L2('Recupera ', 'Restores ') + fmt(Math.min(it.mana, 99999)) + L2(' de maná.', ' mana.'));
    if (it.food) push('🍖 ' + L2('Comida: +', 'Food: +') + it.food + L2(' % de ataque durante 3 min.', '% attack for 3 min.'));
    if (it.tonic) push('💪 ' + usoSt(it.tonic) + ' · ' + min(it.dur) + ' min.');
    if (it.xpB && !it.d) push('📈 +' + it.xpB + L2(' % de experiencia · ', '% experience · ') + min(it.dur) + ' min.');
    if (it.relB) push('🎉 ' + L2('Comida de fiesta: ', 'Festival food: ') + usoSt(it.relB) + '.');
    if (it.cure) push('🩹 ' + L2('Cura el veneno y las enfermedades.', 'Cures poison and illnesses.'));
    if (it.recall) push('🏠 ' + L2('Te devuelve al último pueblo al momento.', 'Takes you back to the last town instantly.'));
    if (it.plato) push('🍽 ' + L2('Plato: cura y da una mejora de comida. Los platos ★ perfectos dan más. También se venden en tu tienda o en la caravana, y sirven para pedidos.', 'Dish: heals and gives a food boost. Perfect ★ dishes give more. They also sell in your shop or caravan, and fill orders.'));
    if (it.legB) push('🐟 ' + L2('Pez legendario: cómetelo para una mejora de 20 min, o guárdalo en tu colección de peces.', 'Legendary fish: eat it for a 20-min boost, or keep it in your fish collection.'));
    if (it.axp) push('⚗ ' + L2('Poción de alquimia experimental: úsala para su efecto.', 'Experimental alchemy potion: use it for its effect.'));
    if (it.book) push('📖 ' + L2('Libro mágico: úsalo y vuela a tu lado 1 minuto atacando.', 'Magic book: use it and it flies by your side for 1 minute attacking.'));
    if (it.comic) push('📚 ' + L2('Úsalo para leerlo (no se gasta).', 'Use it to read it (not used up).'));
    if (!out.length) push('✨ ' + L2('Consumible: pulsa Usar.', 'Consumable: press Use.'));
  }
  if (it.t === 'quest') { push('📜 ' + L2('Objeto de misión: guárdalo hasta entregarlo.', 'Quest item: keep it until you hand it in.')); if (it.d) push(it.d); }
  if (it.t === 'mat') {
    if (it.d) push('ℹ ' + it.d);
    if (it.gift === 'bouquet' || /^ramo_/.test(id)) push('💐 ' + L2('Ramo: el regalo que gusta a casi todo el mundo (romance y amistad).', 'Bouquet: the gift almost everyone likes (romance and friendship).'));
    if (it.seed) push('🌱 ' + L2('Siémbrala en un huerto (agricultura). Tarda ', 'Plant it in a field (farming). It takes ') + min(it.grow) + L2(' min en crecer.', ' min to grow.'));
    if (it.bk) push('🏠 ' + L2('Pieza de construcción: colócala con el modo construcción (casa, pueblo, granja).', 'Building piece: place it with build mode (house, town, farm).'));
    if (it.troph || it.find || it.medal) push('🏆 ' + L2('Expónlo en el museo de tu casa (Vitrina o Pedestal).', 'Display it in your home museum (Showcase or Pedestal).'));
    if (it.fish) push('🐠 ' + L2('Pescado: cocínalo, ponlo en el acuario de tu casa, entrégalo en el torneo de pesca o úsalo en alquimia.', 'Fish: cook it, put it in your home aquarium, enter it in the fishing tournament or use it in alchemy.'));
    if (/^log\d+$/.test(id)) push('🪵 ' + L2('Troncos: casas, barricadas, suministros para los reinos y la aeronave.', 'Logs: houses, barricades, kingdom supplies and the airship.'));
    if (it.ofjob) push('🧺 ' + L2('Producto de oficio: pedidos del gremio, tu tienda, la caravana o para decorar.', 'Job product: guild orders, your shop, the caravan or decoration.'));
    if (/^ofm_/.test(id)) push('🐫 ' + L2('Puedes mandarlo en la caravana de comercio.', 'You can send it with the trade caravan.'));
    try { if (DROPS.some(d => d[0] === id) || /^herb|^ig_/.test(id)) push('⚗ ' + L2('Alquimia experimental: mézclalo con 1 o 2 ingredientes más.', 'Experimental alchemy: mix it with 1 or 2 more ingredients.')); } catch (e) { }
    if (/^food\d|^golosina|^ig_/.test(id)) push('🦊 ' + L2('Comida para domar animales salvajes.', 'Food to tame wild animals.'));
  }
  if (USO_X[id]) USO_X[id]().forEach(push);
  // 2) recetas y sistemas que lo usan
  const g = usoIdx()[id] || {};
  for (const k in g) { if (k === 'made') continue; const e = g[k], L_ = [...e.s]; push(e.h + (L_.length ? ': ' + L_.slice(0, 6).join(', ') + (L_.length > 6 ? ' ' + L2('y ' + (L_.length - 6) + ' más', 'and ' + (L_.length - 6) + ' more') : '') : '') + '.'); }
  if (it.t === 'mat' && !out.length && !Object.keys(g).some(k => k !== 'made')) push('💎 ' + L2('Tesoro o botín: no se usa en recetas. Sirve para vender (buen precio), regalar o poner en tu tienda.', 'Treasure or loot: not used in recipes. It is for selling (good price), gifting or your shop.'));
  // 3) regalos, tienda y venta
  if ((it.t === 'mat' || it.t === 'cons' || it.slot === 'acc' || it.slot === 'neck') && !it.seed && id !== 'colgante_amor') push('💝 ' + L2('Puedes regalarlo a quien te guste o a tu pareja (los raros valen más).', 'You can gift it to someone you like or your partner (rare ones count more).'));
  if (it.t !== 'quest' && it.t !== 'cos' && (it.ofjob || it.plato || it.t === 'mat' || it.t === 'cons')) push('🛒 ' + L2('Ponlo a la venta en tu tienda de casa: los vecinos lo compran solos.', 'Put it on sale in your home shop: neighbours buy it on their own.'));
  if (g.made) push(g.made.h + ': ' + [...g.made.s].slice(0, 3).join(', ') + '.');
  if (it.price && it.t !== 'quest') push('💰 ' + L2('Véndelo en cualquier tienda por ', 'Sell it at any shop for ') + fmt(Math.floor(it.price * 0.4)) + L2(' oro.', ' gold.'));
  return out;
}
function usoHTML(id, max) { const L_ = itemUses(id); if (!L_.length) return ''; const n = max || 99;
  return `<div class="usos"><b>📋 ${L2('Para qué sirve', 'What it\'s for')}</b>${L_.slice(0, n).map(t => `<div>${esc(t)}</div>`).join('')}</div>`; }
{ const st = document.createElement('style'); st.textContent = '.usos{margin:.4em 0;padding:.35em .5em;border:1px solid rgba(255,220,140,.25);border-radius:6px;background:rgba(0,0,0,.22);font-size:.82em;line-height:1.35;max-height:min(40vh,15em);overflow-y:auto}.usos b{display:block;color:#ffd040;margin-bottom:.15em}.usos div{margin:.12em 0}.gdet .usos{max-height:none}'; document.head.appendChild(st); }

// ---- inventario: «Para qué sirve» al lado de cada objeto ----
{ const _ri = renderInv; renderInv = function (B) { const r = _ri.apply(this, arguments); try { const P = G.P, s = P.inv[invSel]; if (s && ITEMS[s.id]) { const R = (B || document).querySelector('.invR'); if (R && !R.querySelector('.usos')) { const val = R.querySelector('.val'); const h = usoHTML(s.id); if (val) val.insertAdjacentHTML('beforebegin', h); else R.insertAdjacentHTML('beforeend', h); } } } catch (e) { } return r; }; }

// ---- Lupa: pestaña 🎒 Objetos con buscador ----
const USO_F = [['all', L2('Todo', 'All')], ['mat', L2('Materiales', 'Materials')], ['food', L2('Comida', 'Food')], ['pot', L2('Pociones', 'Potions')], ['tool', L2('Herramientas', 'Tools')], ['rune', L2('Runas y gemas', 'Runes and gems')], ['bk', L2('Construcción', 'Building')], ['quest', L2('Misión', 'Quest')], ['eq', L2('Equipo', 'Gear')]];
const USO_G = { f: 'all', q: '', sel: null };
function usoMatch(it, f) {
  if (it.t === 'cos') return false; const ic = String((it.icon && it.icon[0]) || ''), nm = String(it.n || '').toLowerCase();
  switch (f) {
    case 'mat': return it.t === 'mat' && !it.bk;
    case 'food': return it.t === 'cons' && (it.food || it.plato || it.relB || /food|cake|bowl|fish|ofi/.test(ic)) && !/potion/.test(ic);
    case 'pot': return it.t === 'cons' && (/potion|elixir|ether/.test(ic) || it.axp || it.tonic || /poci|elixir|éter|potion|tónico|tonic/.test(nm));
    case 'tool': return it.t === 'tool';
    case 'rune': return /runa|rune|gema|gem|cristal|crystal|esencia|essence|piedra|stone|rubí|ruby|zafiro|sapphire|esmeralda|emerald|diamante|diamond|amatista|ópalo/.test(nm) || /gem|rune/.test(ic);
    case 'bk': return !!it.bk;
    case 'quest': return it.t === 'quest';
    case 'eq': return !!it.slot && it.t !== 'cos';
  } return true; }
function usoList() { const q = USO_G.q.toLowerCase().trim(); const out = [];
  for (const id in ITEMS) { const it = ITEMS[id]; if (!usoMatch(it, USO_G.f)) continue; if (q && !String(it.n).toLowerCase().includes(q)) continue; if (it.cls && G.P.cls && it.cls !== G.P.cls && it.cls !== 'pez' && !q) continue; out.push(it); }
  out.sort((a, b) => (countItem(b.id) > 0) - (countItem(a.id) > 0) || (a.lv || a.tier || 0) - (b.lv || b.tier || 0)); return out.slice(0, 300); }
function guiaObj() { const P = G.P; GUIA.tab = 'obj'; const list = usoList();
  const chips2 = USO_F.map(([k, n]) => `<button class="chip ${USO_G.f === k ? 'on' : ''}" data-uf="${k}">${n}</button>`).join('');
  let det = `<p class="hint">${L2('Todo lo que puedes guardar en el inventario: materiales, comida, pociones, picos, runas, gemas, piezas de construcción y objetos de misión. Elige uno para ver para qué sirve y dónde se consigue. ✓ = lo tienes.', 'Everything you can keep in your bag: materials, food, potions, picks, runes, gems, building pieces and quest items. Pick one to see what it is for and where to get it. ✓ = you have it.')}</p>`;
  const it = USO_G.sel && ITEMS[USO_G.sel];
  if (it) { let src = []; try { src = itemSources(it.id); } catch (e) { }
    det = `<h4>${iconHTML(it.icon, 24)} ${esc(it.n)}${countItem(it.id) ? ` <small>(${L2('tienes', 'you have')} ${countItem(it.id)})</small>` : ''}</h4>` + usoHTML(it.id)
      + `<div class="usos"><b>🔎 ${L2('Dónde conseguir', 'Where to get it')}</b>${src.length ? src.map(([t, d]) => `<div class="gsrc"><span>${esc(t)}</span>${guiaFollowBtn(d, it.n)}</div>`).join('') : `<div>${L2('Tiendas, cofres, eventos o recompensas de misiones.', 'Shops, chests, events or quest rewards.')}</div>`}</div>`; }
  openModal(`<div class="frame guia"><h3>🔎 ${L2('Dónde conseguir', 'Where to get it')}</h3><div class="chips">${guiaChipsHTML('obj')}</div><div class="chips">${chips2}</div>
    <input id="uQ" placeholder="${L2('Buscar objeto…', 'Search item…')}" value="${esc(USO_G.q)}" autocomplete="off"><div class="gcols"><div class="glist">${list.map(e => `<button class="gitem ${USO_G.sel === e.id ? 'sel' : ''}" data-uo="${e.id}">${iconHTML(e.icon, 20)}<span>${esc(e.n)}</span>${e.lv || e.tier ? `<small>${e.lv || e.tier}</small>` : ''}${countItem(e.id) ? ' ✓' : ''}</button>`).join('') || `<p class="hint">${L2('Nada con ese nombre.', 'Nothing with that name.')}</p>`}</div><div class="gdet">${det}</div></div><div class="row"><button class="btn" id="gClose">${L2('Cerrar', 'Close')}</button></div></div>`, 'guiamod');
  $('#gClose').onclick = closeModal; guiaBindChips();
  const q = $('#uQ'); q.oninput = () => { USO_G.q = q.value; const pos = q.selectionStart; guiaObj(); const n = $('#uQ'); n.focus(); n.setSelectionRange(pos, pos); };
  $$('[data-uf]').forEach(b => b.onclick = () => { USO_G.f = b.dataset.uf; USO_G.sel = null; guiaObj(); });
  $$('[data-uo]').forEach(b => b.onclick = () => { USO_G.sel = b.dataset.uo; guiaObj(); });
  const off = $('#gOff'); if (off) off.onclick = () => { P.wp = null; markDirty(); guiaObj(); };
  $$('[data-wp]').forEach(b => b.onclick = () => { const [x, y] = b.dataset.wp.split(',').map(Number); if (P.wp && P.wp.x === x && P.wp.y === y) { P.wp = null; markDirty(); } else setWp({ loc: [x, y], t: b.dataset.wl, m: 'world' }); guiaObj(); }); }
guiaObj = scrollKeep('#modal', guiaObj, () => 'obj|' + USO_G.f + '|' + USO_G.q);
{ const _gc = guiaChipsHTML; guiaChipsHTML = function (tab) { return `<button class="chip ${tab === 'obj' ? 'on' : ''}" data-gx="obj">🎒 ${L2('Objetos', 'Items')}</button>` + _gc.apply(this, arguments); }; }
{ const _gb = guiaBindChips; guiaBindChips = function () { _gb.apply(this, arguments); const b = $('.guia [data-gx="obj"]'); if (b) b.onclick = () => guiaObj(); }; }
{ const _ga = guiaAddJobChip; guiaAddJobChip = function () { _ga.apply(this, arguments); const ch = $('.guia .chips'); if (!ch || ch.querySelector('[data-gx="obj"]')) return; const b = document.createElement('button'); b.className = 'chip'; b.dataset.gx = 'obj'; b.textContent = '🎒 ' + L2('Objetos', 'Items'); b.onclick = () => guiaObj(); ch.insertBefore(b, ch.firstChild); }; }
{ const _gx = guiaX; guiaX = function (tab) { if (tab === 'obj') return guiaObj(); return _gx.apply(this, arguments); }; }
{ const _rg = renderGuia; renderGuia = function () { if (GUIA.tab === 'obj') return guiaObj(); const r = _rg.apply(this, arguments);
  // en Materiales y Equipo de la lupa, también «Para qué sirve»
  try { if (GUIA.sel && (GUIA.tab === 'mat' || GUIA.tab === 'eq') && ITEMS[GUIA.sel]) { const d = $('.guia .gdet'), h = d && d.querySelector('h4'); if (h && !d.querySelector('.usos')) h.insertAdjacentHTML('afterend', usoHTML(GUIA.sel)); } } catch (e) { }
  return r; }; }
// Lupa › Sistemas
if (typeof GSIS !== 'undefined') GSIS.unshift(['usos', '📋 ' + L2('Para qué sirve cada objeto', 'What each item is for'), () => [
  L2('Toca cualquier objeto del inventario: al lado sale «Para qué sirve» con todos sus usos (fabricar, cocinar, construir, forja, misiones, museo, regalos, tu tienda y cuánto vale).', 'Tap any item in your bag: next to it, «What it\'s for» lists all its uses (crafting, cooking, building, forge, quests, museum, gifts, your shop and how much it is worth).'),
  L2('Lupa › 🎒 Objetos: busca cualquier cosa que se pueda guardar (materiales, comida, pociones, picos, runas, gemas, piezas de construcción, objetos de misión) y mira para qué sirve y dónde se consigue, con flecha dorada.', 'Magnifier › 🎒 Items: search anything you can keep (materials, food, potions, picks, runes, gems, building pieces, quest items) and see what it is for and where to get it, with the golden arrow.'),
  L2('Los objetos con ✓ son los que ya tienes. Antes de tirar algo, mira si sirve para algo.', 'Items with ✓ are the ones you already have. Before dropping something, check whether it is useful.')], () => null]);
