// ================= v5.79: TIERRAS TEJIDAS 2 · SPRITES DE SERGIO, MÚSICA, PECES Y GUÍA =================
// Sergio (5.79):
// - Las 15 criaturas y los 4 jefes usan sus dibujos (tools/dev/tejidas_ref/criaturas.png → tools/dev/tejidas.py →
//   6zzzp_v579_tejidas_data.js). Mismas mecánicas. Arte ['tjs', clave]; si la imagen no cargara, queda el dibujo 'cbx'.
// - Las 49 armas de nivel 505-600 usan sus dibujos (armas.png, 7 por clase elegidas por tema en TJW_PICK).
// - Música propia de la región (caja de música) y de sus jefes. Cuatro peces nuevos en los estanques de tinte.
// - Lupa › Sistemas: Tierras Tejidas, jefes, recursos y forja, cada uno con flecha. ▦ Atajos › ¿Qué hago ahora?:
//   tarjeta «Tierras Tejidas» que dice el siguiente paso (llegar, hacha/pico/caña, veta/árbol/estanque, jefe y forja).

// ---------- criaturas con el dibujo de Sergio ----------
const TJS_CV = {};
for (const k in TJS_SHEET) { const [fw, fh] = TJS_SIZE[k], c = mkCanvas(fw * 10, fh * 4); TJS_CV[k] = c; const im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = TJS_SHEET[k]; }
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'tjs' && TJS_CV[art[1]]) return getAtlas('Mtjs' + art[1], () => { const [fw, fh] = TJS_SIZE[art[1]]; return { img: TJS_CV[art[1]], fw, fh, idx: { idle: 0, walk: 2, atk: 6, hurt: 9 }, ax: fw >> 1, ay: fh - 4 }; }); return _ma.apply(this, arguments); }; }
for (const [id, , , art] of TJ_MOBS) if (MOBS[id] && TJS_SHEET[art]) MOBS[id].art = ['tjs', art];
for (const [id, k] of [['tj_reina', 'reina'], ['tj_nudo', 'nudo'], ['tj_rueca', 'rueca'], ['tj_hilandera', 'hilandera']]) if (BOSSES[id] && TJS_SHEET[k]) BOSSES[id].art = ['tjs', k];

// ---------- armas con el dibujo de Sergio (mano 16 px, HD 32 px, icono y agarre) ----------
{ let left = 0; const done = () => { if (--left > 0) return; try { const P = G.P; if (P && P.equip && P.equip.weapon && ITEMS[P.equip.weapon.id] && ITEMS[P.equip.weapon.id].tj) { P.atlas = playerAtlas(P); } } catch (e) { } };
  for (const key in TJW_IMG) { const W_ = TJW_IMG[key]; ARM_PIVK16[key] = W_.p16; ARM_PIVK32[key] = W_.p32;
    for (const [src, set] of [[W_.h16, p => { ARM_HPIX[key] = p; ARM_PIX[key] = p; }], [W_.hd, p => { ARM_HDP[key] = p; }]]) { left++; const im = new Image(); im.onload = () => { try { set(armPixFromImg(im)); } catch (e) { } done(); }; im.onerror = done; im.src = src; } } }

// ---------- música ----------
THEMES.tejidas = { bpm: 92, root: 57, scale: [0, 2, 4, 6, 7, 9, 11], chords: [0, 3, 4, 1], lead: 'triangle', seed: 57, drums: 1, arp: 1 };
THEMES.tejidas_boss = { bpm: 150, root: 50, scale: [0, 2, 3, 5, 7, 8, 11], chords: [0, 5, 6, 4], lead: 'sawtooth', seed: 61, drums: 3, arp: 1 };
REGIONS[RI.tejidas].music = 'tejidas';
{ const _cm = currentMusic; currentMusic = function () { const r = _cm.apply(this, arguments); try { const B = G.bossBar; if (r === 'boss' && B && typeof B.mid === 'string' && B.mid.startsWith('tj_')) return 'tejidas_boss'; } catch (e) { } return r; }; }

// ---------- peces de los estanques de tinte (dan uso a las cañas 15-18) ----------
const TJ_FISH = [['pz_hilo', 'Pez Hilo', 'Thread Fish', 19, '#f0a0d0', 'long'], ['pz_carpatinte', 'Carpa de Tinte', 'Dye Carp', 20, '#3a8ae0', 'round'],
  ['pz_anguilahuso', 'Anguila de Huso', 'Spindle Eel', 21, '#c8d0e0', 'eel'], ['pz_koiseda', 'Koi de Seda', 'Silk Koi', 22, '#f0d890', 'norm']];
for (const [id, es, en, t, col, shape] of TJ_FISH) { const n = L2(es, en); FISH.push([id, n, t, ['tejidas'], col]); it(id, { n, t: 'mat', fish: true, stack: true, tier: t, hab: ['tejidas'], price: 6 * t * t + 4 + t * 20, icon: ['fish', col], rar: 5, d: L2('Pica en los estanques de tinte de las Tierras Tejidas.', 'Bites in the dye ponds of the Woven Lands.') }); if (typeof FX_SHAPE !== 'undefined') FX_SHAPE[id] = shape; }
for (const f of FISH) if (['carpa', 'trucha', 'perca'].includes(f[0]) && !f[3].includes('tejidas')) f[3].push('tejidas');
{ const _ha = habitatAt; habitatAt = function (tx, ty) { try { const M = G.map, W = G.world; if ((!M || M.isWorld) && W && W.reg[W.I(tx, ty)] === RI.tejidas) return 'tejidas'; } catch (e) { } return _ha.apply(this, arguments); }; }

// ---------- dónde está cada cosa ----------
function tjNpcAt(id) { const W = G.world, d = W && W.npcDefs.find(n => n.id === id); return d ? [d.x, d.y + 1] : TJZ.ws; }
function tjNearest(pred) { const W = G.world, P = G.P; if (!W) return null; const px = P && P.map === 'world' ? P.x / 16 : TJZ.ws[0], py = P && P.map === 'world' ? P.y / 16 : TJZ.ws[1]; let b = null, bd = Infinity;
  for (const o of W.objs) { if (o.hidden || !pred(o)) continue; const d = (o.tx - px) ** 2 + (o.ty - py) ** 2; if (d < bd) { bd = d; b = o; } } return b ? [b.tx, b.ty + 1] : null; }
function tjPond() { const W = G.world; if (!W) return null; let best = null, bd = Infinity; const [cx, cy] = TJZ.ws;
  for (let y = TJZ.y0; y <= TJZ.y1; y++) for (let x = TJZ.x0; x <= TJZ.x1; x++) { const i = W.I(x, y); if (W.reg[i] !== RI.tejidas || W.ter[i] !== T.WATER) continue; for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { const j = W.I(x + dx, y + dy); if (!SOLID_T[W.ter[j]] && !WATERY[W.ter[j]]) { const d = (x - cx) ** 2 + (y - cy) ** 2; if (d < bd) { bd = d; best = [x + dx, y + dy]; } } } }
  return best; }
const TJ_JOB = { mineria: { tool: 'pico', em: '⛏', res: t => 'ore' + t, obj: t => o => o.k === 'ore' && o.tier === t }, tala: { tool: 'hacha', em: '🪓', res: t => 'log' + t, obj: t => o => o.k === 'tree' && o.st !== 'stump' && WOODT[o.sp] === t }, pesca: { tool: 'cana', em: '🎣', res: t => TJ_FISH[t - 19][0], obj: null } };
// mejor recurso nuevo (19-22) que puedes sacar ya, y lo que te falta para el siguiente
function tjJobStep(job) { const P = G.P, J = TJ_JOB[job], lv = (P.jobs[job] || { lv: 1 }).lv, tool = bestTool(job); let can = 0;
  for (let t = 19; t <= 22; t++) if (RESLV[t] <= lv && toolNeed(job, t) <= tool) can = t;
  const nt = can ? Math.min(22, can + 1) : 19, needTool = toolNeed(job, nt), toolId = J.tool + needTool, needLv = RESLV[nt];
  const nextMsg = can >= 22 ? '' : tool < needTool ? L2('Siguiente: forja ', 'Next: forge ') + (ITEMS[toolId] ? ITEMS[toolId].n : J.tool + needTool) + L2(' con Maese Hilario', ' with Master Hilario') + (RECIPES.find(r => r.out === toolId) ? ' (' + RECIPES.find(r => r.out === toolId).mats.map(([m, n]) => n + '× ' + ITEMS[m].n).join(', ') + ')' : '')
    : lv < needLv ? L2('Siguiente: sube ', 'Next: raise ') + JOBS[job].n + L2(' a nivel ', ' to level ') + needLv + L2(' para ', ' for ') + ITEMS[J.res(nt)].n : '';
  const loc = can ? (job === 'pesca' ? tjPond() : tjNearest(J.obj(can))) : (tool < needTool ? tjNpcAt('tj_hilario') : null);
  return { can, nt, nextMsg, loc, what: can ? ITEMS[J.res(can)].n : null }; }
function tjNextBoss() { const P = G.P; for (const id of ['tj_reina', 'tj_nudo', 'tj_rueca', 'tj_hilandera']) if (!(P.bossKills || {})[id]) return id; return null; }
function tjNextGear() { const P = G.P; const have = id => countItem(id) > 0 || Object.values(P.equip || {}).some(e => e && e.id === id);
  for (const t of TJ_TIERS) { if (TJ_LV[t] > P.lv) return { t, lvl: true }; if (!['h', 'b', 'l', 'f'].every(s => have(s + '_' + t)) || !have('w_' + P.cls + '_' + t)) return { t }; } return null; }

// ---------- ▦ Atajos › ¿Qué hago ahora?: tarjeta de las Tierras Tejidas ----------
function tjQhHTML() { const P = G.P; if (!P || P.lv < 480) return ''; const rows = [], btn = (k, label) => `<button class="btn sm" data-tjwp="${k}">➜ ${label || L2('Llévame', 'Take me')}</button>`;
  const row = (title, txt, k) => rows.push(`<div class="qhjob"><b>${title}</b><br><small>${esc(txt)}</small>${k ? `<div class="row">${btn(k)}</div>` : ''}</div>`);
  if (!P.ws || !P.ws.tejidas) row('🏕 ' + L2('Llega al Campamento de las Hebras', 'Reach the Thread Camp'), L2('Coge el tren a la Estación Sahrim o Yarakai y baja por el andén hacia el sur. Toca la piedra de viaje del campamento.', 'Take the train to Sahrim or Yarakai Station and walk south down the platform. Touch the camp waystone.'), 'camp');
  for (const job of ['mineria', 'tala', 'pesca']) { const s = tjJobStep(job), J = TJ_JOB[job];
    row(J.em + ' ' + JOBS[job].n, (s.can ? L2('Ya puedes sacar ', 'You can already get ') + s.what + '. ' : L2('Aún no puedes con los recursos nuevos. ', 'You can\'t handle the new resources yet. ')) + (s.nextMsg || (s.can >= 22 ? L2('¡Tienes lo mejor!', 'You have the best!') : '')), s.loc ? 'job_' + job : null); }
  const b = tjNextBoss(); if (b) row('👑 ' + L2('Siguiente jefe: ', 'Next boss: ') + BOSSES[b].n + ' (' + L2('nivel ', 'level ') + BOSSES[b].lv + ')', TJ_BOSS_D[b], 'boss');
  const g = tjNextGear(); if (g) row('🛡 ' + L2('Equipo ', 'Gear ') + TIER[g.t].m + ' (' + L2('nivel ', 'level ') + TJ_LV[g.t] + ')', g.lvl ? L2('Llega al nivel ', 'Reach level ') + TJ_LV[g.t] + L2(' para forjarlo.', ' to forge it.') : L2('Fórjalo con Maese Hilario: ', 'Forge it with Master Hilario: ') + TJ_REC[g.t].map(([m, n]) => n + '× ' + ITEMS[m].n + ' (' + countItem(m) + ')').join(', '), g.lvl ? null : 'forge');
  return `<div class="gsrc qhjobs qhtej"><span><b>🧶 ${L2('Tierras Tejidas', 'Woven Lands')}</b> <small>(${L2('nivel 500-600', 'level 500-600')})</small>${rows.join('')}</span></div>`; }
function tjWpOf(k) { const P = G.P; if (k === 'camp') return { loc: TJZ.ws, t: L2('Campamento de las Hebras', 'Thread Camp'), m: 'world' };
  if (k === 'forge') return { loc: tjNpcAt('tj_hilario'), t: L2('Maese Hilario (forja)', 'Master Hilario (forge)'), m: 'world' };
  if (k === 'boss') { const b = tjNextBoss(); return b ? { loc: TJ_BOSS_AT[b], t: BOSSES[b].n, m: 'world' } : null; }
  if (k.startsWith('job_')) { const s = tjJobStep(k.slice(4)); return s.loc ? { loc: s.loc, t: s.what || L2('Maese Hilario (forja)', 'Master Hilario (forge)'), m: 'world' } : null; } return null; }
{ const _qh = qhOpen; qhOpen = function () { const r = _qh.apply(this, arguments); try { const M = $('#modal'); if (M && !M.querySelector('.qhtej')) { const html = tjQhHTML(); if (html) { const after = M.querySelector('.qhjobs') || [...M.querySelectorAll('.frame > .gsrc')].pop(); if (after) after.insertAdjacentHTML('afterend', html);
      M.querySelectorAll('[data-tjwp]').forEach(b => b.onclick = () => { const w = tjWpOf(b.dataset.tjwp); if (w) { setWp(w); closeModal(); } }); } } } catch (e) { console.warn('qh tejidas', e); } return r; }; }
// la guía de Tala, Minería y Pesca de la Lupa también lleva a los recursos nuevos cuando ya puedes con ellos
for (const job of ['tala', 'mineria', 'pesca']) { const G_ = typeof JOB_GUIDE !== 'undefined' && JOB_GUIDE[job]; if (!G_ || !G_.find) continue; const _f = G_.find;
  G_.find = function () { try { const P = G.P; if (P && P.lv >= 480) { const s = tjJobStep(job); if (s.can && s.loc) return { loc: s.loc, t: s.what, m: 'world' }; } } catch (e) { } return _f.apply(this, arguments); }; }

// ---------- Lupa › Sistemas ----------
if (typeof GSIS !== 'undefined') {
  GSIS.unshift(['tejidas_equipo', '🛡 ' + L2('Tierras Tejidas: forja de nivel 505-600', 'Woven Lands: level 505-600 forge'), () => [
    L2('Maese Hilario (Campamento de las Hebras) forja 7 tiers de armaduras y armas. Cada tier pide minerales nuevos y restos de un jefe:', 'Master Hilario (Thread Camp) forges 7 tiers of armour and weapons. Each tier needs new ores and a boss\'s remains:'),
    ...TJ_TIERS.map(t => '• ' + L2('Nivel ', 'Level ') + TJ_LV[t] + ' · ' + TIER[t].m + ': ' + TJ_REC[t].map(([m, n]) => n + '× ' + ITEMS[m].n).join(', ')),
    L2('La armadura es la misma pieza para todas las clases, pero cada clase la lleva con su propio diseño. Las armas son distintas para cada clase.', 'The armour is the same piece for every class, but each class wears it with its own design. Weapons are different for each class.')
  ], () => ({ loc: tjNpcAt('tj_hilario'), t: L2('Maese Hilario (forja)', 'Master Hilario (forge)'), m: 'world' })]);
  GSIS.unshift(['tejidas_recursos', '⛏ ' + L2('Tierras Tejidas: minerales, maderas, peces y herramientas', 'Woven Lands: ores, woods, fish and tools'), () => [
    ...TJ_RES.map(([t, on, , ln]) => '• ' + L2('Nivel de oficio ', 'Job level ') + RESLV[t] + ': ⛏ ' + ITEMS['ore' + t].n + ' (' + L2('pico ', 'pickaxe ') + toolNeed('mineria', t) + ') · 🪓 ' + ITEMS['log' + t].n + ' (' + L2('hacha ', 'axe ') + toolNeed('tala', t) + ') · 🎣 ' + ITEMS[TJ_FISH[t - 19][0]].n + ' (' + L2('caña ', 'rod ') + toolNeed('pesca', t) + ')'),
    L2('Zonas: Hebrita y Árbol de Algodón en la Pradera de Algodón, Tintolita y Roble de Ovillos en el Bosque de Ovillos, Plata de Huso y Sauce Hilandero en la Ciénaga de Tinte, Sedalita y Ceiba de Seda en la Hilandería Rota. Los peces pican en los estanques de tinte.', 'Zones: Threadite and Cotton Tree in the Cotton Meadow, Dyestone and Yarnball Oak in the Yarnball Wood, Spindle Silver and Spinner Willow in the Dye Marsh, Silkstone and Silk Ceiba in the Broken Spinning Mill. Fish bite in the dye ponds.'),
    L2('Cada pico, hacha y caña nueva se forja con Maese Hilario usando el mineral y la madera del nivel anterior (el primero, con Tejedita y Árbol del Telar). Equípala en el inventario y usa su casilla de la barra.', 'Each new pickaxe, axe and rod is forged with Master Hilario using the previous level\'s ore and wood (the first one, with Weaverite and Loom Tree). Equip it in the bag and use its slot on the bar.'),
    L2('▦ Atajos › ¿Qué hago ahora? › Tierras Tejidas te dice qué herramienta te toca y te lleva a la veta, árbol o estanque que ya puedes usar.', '▦ Shortcuts › What do I do now? › Woven Lands tells you which tool is next and takes you to the vein, tree or pond you can already use.')
  ], () => { const P = G.P; if (!P) return null; const s = tjJobStep('mineria'); return s.loc ? { loc: s.loc, t: s.what || L2('Maese Hilario (forja)', 'Master Hilario (forge)'), m: 'world' } : { loc: tjNpcAt('tj_brigida'), t: L2('Brígida, minera', 'Brígida, miner'), m: 'world' }; }]);
  GSIS.unshift(['tejidas_jefes', '👑 ' + L2('Tierras Tejidas: los cuatro jefes', 'Woven Lands: the four bosses'), () => [
    L2('Véncelos en orden; cada uno suelta lo que pide la forja del siguiente tier. La flecha lleva al siguiente que no has vencido.', 'Defeat them in order; each drops what the next tier\'s forge needs. The arrow leads to the next one you haven\'t defeated.'),
    ...Object.keys(TJ_BOSS_AT).map(id => ((G.P && (G.P.bossKills || {})[id]) ? '✅ ' : '👑 ') + BOSSES[id].n + ' · ' + L2('nivel ', 'level ') + BOSSES[id].lv + ' · ' + tjZoneAt(TJ_BOSS_AT[id][0]).n + ': ' + TJ_BOSS_D[id] + ' ' + L2('Suelta: ', 'Drops: ') + BOSSES[id].drops.map(([m]) => ITEMS[m].n).join(', ') + '.')
  ], () => { const b = tjNextBoss(); return b ? { loc: TJ_BOSS_AT[b], t: BOSSES[b].n, m: 'world' } : null; }]);
}
