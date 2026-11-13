// ================= v3.7: TABERNA, ALDEANOS, MAESTROS DE OFICIO, ARMARIO DE LA PAREJA Y CRÓNICAS DEL VÍNCULO =================
SAVEKEYS.push('pOut', 'mast', 'loreU', 'loreMira');
// ---------- anillo de bodas más barato ----------
ITEMS.anillo_boda.price = 15000;
// ---------- taberna: sin gente amontonada y abierta hasta más tarde ----------
function tavFree(M, x, y, used) { const i = tileAt(M, x, y); if (i < 0 || blockedFor(M, x, y, 0) || M.objAt[i] >= 0) return false; return !used.some(([ux, uy]) => Math.abs(ux - x) + Math.abs(uy - y) < 3); }
nightTick = function () {
  const P = G.P, M = G.map; if (!M || !P.inside || M.isWorld) return; const kind = String(M.id).split('_')[0], h = hourNow(), late = h >= 22 || h < 6, evening = h >= 18 || h < 4;
  if (['tienda', 'herreria', 'alquimia'].includes(kind)) { const nid = INT_NPC[M.id]; for (const e of G.ents) if (e.type === 'npc' && e.id === nid && (e.map === M.id || e.nightHid === M.id)) { if (late && e.map === M.id) { e.map = 'hidden'; e.nightHid = M.id; if (!M.closedMsg) { M.closedMsg = 1; toast('Está cerrado: ' + NPCS[nid].n + ' se ha ido a la taberna. Abre a las 6:00.', 'info', 4); } } else if (!late && e.map === 'hidden') { e.map = M.id; M.closedMsg = 0; } } }
  if (kind !== 'posada') return;
  const tk = M.id.split('_').slice(1).join('_'), pats = G.ents.filter(e => e.tav === M.id && !e.remove), used = pats.map(e => [Math.floor(e.x / 16), Math.floor(e.y / 16)]);
  if (evening && !pats.some(e => !e.tavShop)) {
    // como mucho 5 parroquianos y nunca en sillas pegadas
    const chairs = M.objs.filter(o => o.k === 'furn' && o.f === 'chair'); let n = 0;
    for (const o of chairs) { if (n >= 5) break; if (used.some(([ux, uy]) => Math.abs(ux - o.tx) + Math.abs(uy - o.ty) < 3) || Math.random() < 0.2) continue; const e = spawnNPC('parroquiano' + (n % 6), o.px, o.py - 2, M.id, {}); if (e) { e.tav = M.id; e.scene = 1; e.noTag = 1; setAnim(e, 'sit'); e.dir = 'down'; used.push([o.tx, o.ty]); n++; } } }
  if (late && !pats.some(e => e.tavShop)) { let k = 0;
    for (const id in INT_NPC) { if (k >= 4) break; if (id === M.id || !id.endsWith('_' + tk) || id.startsWith('posada')) continue; let spot = null;
      for (let t = 0; t < 60 && !spot; t++) { const x = 2 + Math.floor(Math.random() * (M.w - 4)), y = 3 + Math.floor(Math.random() * (M.h - 5)); if (tavFree(M, x, y, used)) spot = [x, y]; }
      if (!spot) continue; const e = spawnNPC(INT_NPC[id], spot[0] * 16 + 8, spot[1] * 16 + 10, M.id, { wander: 1 }); if (e) { e.tav = M.id; e.tavShop = 1; e.noTag = 1; used.push(spot); } k++; } }
  if (!evening && pats.length) for (const e of pats) e.remove = true;
  if (pats.length && Math.random() < 0.25 && !pats.some(p => p.chat && G.t - p.chatT < 6)) { const e = pick(pats); if (!e.chat || G.t - e.chatT > 6) { e.chat = pick(TAV_LINES); e.chatT = G.t - 2; } }
};
// ---------- maestros de oficio ----------
const MAST = {
  tala: { npc: 'maestra_tala', town: 'albor', need: [40, 60, 75], gold: [15000, 60000, 200000], mats: [[['log4', 20]], [['log7', 25]], [['log10', 30]]] },
  mineria: { npc: 'maestro_mineria', town: 'arxar', need: [40, 60, 75], gold: [15000, 60000, 200000], mats: [[['ore4', 20]], [['ore7', 25]], [['ore10', 30]]] },
  pesca: { npc: 'maestra_pesca', town: 'puerto', need: [40, 60, 75], gold: [20000, 80000, 250000], mats: [[], [], []] },
  agricultura: { npc: 'maestro_agricultura', town: 'sahrim', need: [35, 55, 75], gold: [20000, 80000, 250000], mats: [[], [], []] },
};
const MAST_RANK = ['Aprendiz', 'Oficial', 'Maestro', 'Gran Maestro'];
NPCS.maestra_tala = { n: 'Sauce la Leñadora', title: 'Maestra de Tala', look: LK({ hair: HAIRS.rojo, hairStyle: 'long', outfit: 'ranger', main: CLOTH.verde, sec: CLOTH.marron, eyes: 'verde', weapon: { k: 'axe', tier: 8 } }), lines: ['Un árbol no se corta: se convence.', 'He talado en los cinco reinos. Si tienes paciencia, te enseño a escuchar la madera.'] };
NPCS.maestro_mineria = { n: 'Brok Picahondo', title: 'Maestro de Minería', look: LK({ hair: HAIRS.negro, beard: HAIRS.negro, outfit: 'smith', main: CLOTH.gris, sec: CLOTH.marron, hat: 'helmet', hatC: TIERP[4], weapon: { k: 'pick', tier: 8 } }), lines: ['La roca habla, pero muy despacio.', 'Debajo de Arxar hay vetas que nadie ha tocado. Hace falta brazo… y técnica.'] };
NPCS.maestra_pesca = { n: 'Nerina Anzuelo', title: 'Maestra de Pesca', look: LK({ hair: HAIRS.rubio, hairStyle: 'long', outfit: 'sailor', main: CLOTH.marino, sec: CLOTH.blanco, eyes: 'azul', hat: 'straw', weapon: { k: 'rod', tier: 8 } }), lines: ['El mar no regala nada. Pero presta mucho.', 'Una vez pesqué una bota con un pie dentro. No preguntes.'] };
NPCS.maestro_agricultura = { n: 'Teodoro Semilla', title: 'Maestro de Agricultura', look: LK({ hair: HAIRS.blanco, beard: HAIRS.blanco, outfit: 'apron', main: CLOTH.oliva, sec: CLOTH.beige, hat: 'straw', skin: SKINS[2] }), lines: ['La tierra devuelve lo que le das. Con intereses.', 'Planta aunque no veas la cosecha. Alguien la verá.'] };
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W); for (const job in MAST) { const D = MAST[job], t = TOWNS.find(t => t.k === D.town); if (!t) continue; const [x, y] = freeTileNear(W, (t.x0 + t.x1) / 2 - 5, (t.y0 + t.y1) / 2 + 5); W.npcDefs.push({ id: D.npc, x, y, face: 'down' }); } }; }
function mastRank(job) { const P = G.P; return (P && P.mast && P.mast[job]) || 0; }
function mastHave(id) { return countItem(id); }
function openMastery(job) {
  const P = G.P, D = MAST[job], r = mastRank(job), J = P.jobs[job], cap = JOBMAX + 10 * r;
  const nxt = r < 3 ? r : null, mats = nxt !== null ? D.mats[nxt] : [], ok = nxt !== null && J.lv >= D.need[nxt] && P.gold >= D.gold[nxt] && mats.every(([id, n]) => mastHave(id) >= n);
  const bonus = k => `+${k * 10} niveles de oficio (máx. ${JOBMAX + k * 10}) · +${k * 15}% experiencia de oficio · ${k * 8}% de probabilidad de recolección doble`;
  openModal(`<h2>${iconHTML(['star', '#ffd040'], 22)} Maestría de ${esc(JOBS[job].n)}</h2>
    <p class="hint">Rango actual: <b>${MAST_RANK[r]}</b> · ${esc(JOBS[job].n)} nivel ${J.lv}/${cap}</p>
    ${r ? `<p class="hint">Ahora mismo: ${bonus(r)}</p>` : ''}
    ${nxt !== null ? `<div class="srow"><div class="sn"><b>Siguiente rango: ${MAST_RANK[nxt + 1]}</b><small>${bonus(nxt + 1)}</small><small>Requisitos: ${esc(JOBS[job].n)} nivel ${D.need[nxt]} · ${fmt(D.gold[nxt])} oro${mats.map(([id, n]) => ` · ${n} ${esc(ITEMS[id].n)} (${mastHave(id)})`).join('')}</small></div><button class="btn gold sm" id="mUp" ${ok ? '' : 'disabled'}>Entrenar</button></div>` : '<p class="hint">Ya eres Gran Maestro. No queda nada que enseñarte.</p>'}
    <div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
  const b = $('#mUp'); if (b) b.onclick = () => { if (!ok) return; P.gold -= D.gold[nxt]; for (const [id, n] of mats) takeItem(id, n); P.mast = P.mast || {}; P.mast[job] = nxt + 1; toast('¡Nuevo rango en ' + JOBS[job].n + ': ' + MAST_RANK[nxt + 1] + '!', 'quest'); sfx('level'); burst(P.x, P.y - 16, 16, { sp: 60, up: 60, g: 60, life: 0.9, c: ['#ffd040', '#ffffff', '#9ae0ff'] }); markDirty(true); openMastery(job); };
}
DLG_HOOKS.push((npc, opts) => { for (const job in MAST) if (MAST[job].npc === npc.id) opts.unshift({ label: 'Entrenamiento de maestría', icon: ['star', '#ffd040'], fn: () => { closeDialog(); openMastery(job); } }); });
{ const _g = gainJobXp; gainJobXp = function (job, n) {
  const P = G.P, J = P.jobs[job], rk = mastRank(job); if (rk) n = Math.round(n * (1 + 0.15 * rk)); if (!J || J.lv < JOBMAX) return _g(job, n);
  const cap = JOBMAX + 10 * rk; if (J.lv >= cap) return; J.xp += n; floatText(P.x + 10, P.y - 46, '+' + n + ' ' + JOBS[job].n, '#9ae0ff');
  while (J.lv < cap && J.xp >= jobXpToNext(J.lv)) { J.xp -= jobXpToNext(J.lv); J.lv++; toast(JOBS[job].n + ' sube a nivel ' + J.lv, 'job'); sfx('level'); }
  if (typeof passEvent === 'function') passEvent('job', job); }; }
let mastFarm = false;
{ const _gi = giveItem; giveItem = function (id, n, quiet) { const r = _gi.apply(this, arguments); const P = G.P; if (!P) return r;
  let job = null; if (P.job && P.job.kind === 'tala' && /^log\d+$/.test(id)) job = 'tala'; else if (P.job && P.job.kind === 'mineria' && /^ore\d+$/.test(id)) job = 'mineria'; else if (mastFarm && ITEMS[id] && !/^sem_/.test(id)) job = 'agricultura';
  if (job) { const rk = mastRank(job); if (rk && Math.random() < 0.08 * rk) { _gi(id, 1, true); floatText(P.x - 10, P.y - 54, '¡Maestría! +1', '#ffd040'); } } return r; }; }
{ const _fa = farmAction; farmAction = function (o) { mastFarm = true; try { return _fa(o); } finally { mastFarm = false; } }; }
{ const _fc = fishCaught; fishCaught = function (fish) { const r = _fc.apply(this, arguments); const rk = mastRank('pesca'); if (rk && Math.random() < 0.08 * rk) { giveItem(fish[0], 1, true); floatText(G.P.x - 10, G.P.y - 54, '¡Maestría! +1', '#ffd040'); } return r; }; }
// ---------- armario de la pareja ----------
const PT_SETS = {
  normal: { n: 'Su ropa de siempre' },
  negro: { n: 'Elegante de negro', f: { outfit: 'dress', main: CLOTH.negro, sec: CLOTH.granate }, m: { outfit: 'royal', main: CLOTH.negro, sec: CLOTH.gris } },
  boda: { n: 'Traje de boda', wed: 1 },
  gala: { n: 'Gala real', f: { outfit: 'dress', main: CLOTH.morado, sec: GOLD.slice(0, 5) }, m: { outfit: 'royal', main: CLOTH.morado, sec: GOLD.slice(0, 5) } },
  verano: { n: 'Día de playa', all: { outfit: 'tunic', main: CLOTH.turquesa, sec: CLOTH.amarillo, hat: 'straw' } },
  invierno: { n: 'Abrigo de invierno', all: { outfit: 'robe', main: CLOTH.rojo, sec: CLOTH.blanco, hat: 'hood', hatC: CLOTH.blanco } },
  aventura: { n: 'Ropa de aventura', all: { outfit: 'ranger', main: CLOTH.verde, sec: CLOTH.marron } },
  marinero: { n: 'Marinero', all: { outfit: 'sailor', main: CLOTH.marino, sec: CLOTH.blanco } },
  pijama: { n: 'Pijama', all: { outfit: 'tunic', main: CLOTH.rosa, sec: CLOTH.blanco } },
  bruja: { n: 'Disfraz de brujería', all: { outfit: 'witch', main: CLOTH.morado, sec: CLOTH.negro, hat: 'wizard', hatC: CLOTH.morado } },
};
function ptSetLook(id, k) { const D = (ROM[relKey(id)] || { g: 'f' }), S = PT_SETS[k]; if (!S || k === 'normal') return null; if (S.wed) return WED_LOOK[D.g] || WED_LOOK.f; return S.all || S[D.g] || S.f; }
{ const _na = npcAtlas; npcAtlas = function (id) { const P = G.P; if (P && P.partner && relKey(id) === P.partner && P.pOut && P.pOut !== 'normal' && NPCS[id]) { const L = ptSetLook(id, P.pOut); if (L) return getAtlas('PT' + id + P.pOut, () => buildAtlas(Object.assign({}, NPCS[id].look, L), ['idle', 'walk', 'hug', 'kiss'])); } return _na(id); }; }
function ptApply() { const P = G.P; for (const e of G.ents) if (e.type === 'npc' && relKey(e.id) === P.partner && !e.wedTmp && !e.scene) e.atlas = npcAtlas(e.id); }
function openPartnerWardrobe() {
  const P = G.P, k = P.partner; if (!k || !NPCS[k]) { toast('Primero necesitas una pareja', 'warn'); return; } const nm = NPCS[k].n.split(' ')[0];
  openModal(`<h2>${iconHTML(['hanger'], 22)} Armario de ${esc(nm)}</h2><p class="hint">Elige qué ropa lleva ${esc(nm)}. Se cambia al momento, también cuando paseáis juntos.</p>
    <div class="ptw">${Object.keys(PT_SETS).map(s => `<button class="ptc ${(P.pOut || 'normal') === s ? 'on' : ''}" data-pt="${s}"><canvas width="32" height="48" data-ptc="${s}"></canvas><span>${esc(PT_SETS[s].n)}</span></button>`).join('')}</div>
    <div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
  $$('#modal [data-ptc]').forEach(cv => { const s = cv.dataset.ptc, L = ptSetLook(k, s), A = L ? getAtlas('PT' + k + s, () => buildAtlas(Object.assign({}, NPCS[k].look, L), ['idle', 'walk', 'hug', 'kiss'])) : npcAtlas(k); const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; const src = A.img || A.c || A.canvas; if (src && A.fw) { const fw = A.fw, fh = A.fh, s2 = Math.min(32 / fw, 48 / fh); x.drawImage(src, (A.idx && A.idx.idle || 0) * fw, 0, fw, fh, (32 - fw * s2) / 2, 48 - fh * s2, fw * s2, fh * s2); } });
  $$('#modal [data-pt]').forEach(b => b.onclick = () => { P.pOut = b.dataset.pt; ptApply(); sfx('equip'); markDirty(); toast(nm + ' se ha cambiado: ' + PT_SETS[P.pOut].n, 'loot'); openPartnerWardrobe(); });
}
DLG_HOOKS.push((npc, opts) => { const P = G.P; if (P.partner && relKey(npc.id) === P.partner) opts.unshift({ label: 'Cambiar de ropa (armario)', icon: ['hanger'], fn: () => { closeDialog(); openPartnerWardrobe(); } }); });
function ptwMount() { const acts = $('#acts'); if (!acts || $('#bPtW')) return; const b = document.createElement('button'); b.className = 'rb'; b.id = 'bPtW'; b.hidden = true; b.title = 'Armario de tu pareja'; b.setAttribute('aria-label', 'Armario de tu pareja'); acts.appendChild(b); b.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); openPartnerWardrobe(); }); }
V33_TICKS.push(() => { const b = $('#bPtW'); if (!b) return; const P = G.P, on = !!(P && P.partner && COMP && relKey(COMP.e.id) === P.partner); if (b.hidden === on) b.hidden = !on; if (!b.dataset.ic && ICON.keys.hanger !== undefined) { b.innerHTML = iconHTML(['hanger'], 24); b.dataset.ic = 1; } });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ptwMount); else ptwMount();
// ---------- aldeanos: 10 conjuntos de ropa que cambian cada día ----------
const TF_SETS = [null,
  { n: 'domingo', main: CLOTH.azul, sec: CLOTH.amarillo, keep: 1 },
  { n: 'campo', outfit: 'apron', main: CLOTH.verde, sec: CLOTH.beige, hat: 'straw' },
  { n: 'marinero', outfit: 'sailor', main: CLOTH.marino, sec: CLOTH.blanco },
  { n: 'abrigo', outfit: 'robe', main: CLOTH.granate, sec: CLOTH.blanco, hat: 'hood', hatC: CLOTH.granate },
  { n: 'fiesta', outfit: 'royal', main: CLOTH.morado, sec: GOLD.slice(0, 5) },
  { n: 'viaje', outfit: 'ranger', main: CLOTH.oliva, sec: CLOTH.marron },
  { n: 'taller', outfit: 'smith', main: CLOTH.gris, sec: CLOTH.marron, hat: 'bandana', hatC: CLOTH.rojo },
  { n: 'negro', main: CLOTH.negro, sec: CLOTH.rojo, keep: 1 },
  { n: 'verano', main: CLOTH.amarillo, sec: CLOTH.naranja, hat: 'straw', keep: 1 },
];
const TF_CUR = {}; let tfDay = -1, tfQ = [];
function tfSetIdx(id, d) { return Math.floor(hash2(id.length * 31 + id.charCodeAt(3), d * 7 + id.charCodeAt(id.length - 1), 77) * 10) % 10; }
function tfAtlas(id, k) {
  const c = TF_CUR[id]; if (c && c.k === k) return c.a; const d = NPCS[id], S = TF_SETS[k]; let a;
  if (!S) a = npcAtlas(id); else { const L = Object.assign({}, d.look, S); delete L.n; delete L.keep; if (S.keep) L.outfit = d.look.outfit; if (!S.hat) { L.hat = d.look.hat; L.hatC = d.look.hatC; } a = buildAtlas(L, ['idle', 'walk', 'sit', 'dance', 'cheer']); }
  TF_CUR[id] = { k, a }; return a; }
function tfOutfitTick() {
  if (!G.P || !G.P.cal) return; const d = calDay();
  if (d !== tfDay) { tfDay = d; tfQ = G.ents.filter(e => e.type === 'npc' && e.def && e.def.tf && !e.remove); }
  for (let n = 0; n < 2 && tfQ.length; n++) { const e = tfQ.shift(); e.atlas = tfAtlas(e.id, tfSetIdx(e.id, d)); }
}
V33_TICKS.push(tfOutfitTick);
// los aldeanos se quedan en el pueblo hasta más tarde (y algunos trasnochan)
function tfOwl(id) { return hash2(id.charCodeAt(3), id.length, 13) < 0.3; }
// ---------- Crónicas del Vínculo (lore) ----------
const CRON = [
  ['El Lienzo', 'Antes del primer amanecer no había nada: solo un Lienzo negro, infinito y en silencio. Los Antiguos Tejedores llegaron de ninguna parte y empezaron a colorearlo casilla a casilla, de dieciséis en dieciséis. Por eso, si miras el mundo muy de cerca, verás que todo está hecho de cuadraditos. No es un defecto: es su firma.'],
  ['El Vínculo', 'Para que el mundo no se deshilachara, los Tejedores tendieron un hilo de luz entre cada ser vivo y la tierra: el Vínculo. Pero un hilo tiene dos extremos. El otro extremo de cada héroe no está aquí: está al otro lado del cristal, en las manos de alguien que mira. Por eso los héroes se levantan cuando caen… y los aldeanos no.'],
  ['El Desatado', 'Uno de los Tejedores no soportó saberse observado. Quiso cortar su hilo y ser libre del otro lado. Al cortarlo se deshizo: se convirtió en el Desatado, una herida en el Lienzo que borra todo lo que toca. Los demás Tejedores lo encerraron en el Abismo con un Sello de siete fragmentos, y se apagaron para siempre al hacerlo.'],
  ['Los siete guardianes', 'Los fragmentos del Sello se repartieron por el mundo y cada uno encontró un guardián: el Rey Slime, el Ent Anciano, Gruk, Morgana, el rey muerto de Vael, el Gólem de Escarcha e Ignaroth. Ninguno lo pidió. El poder del Sello los fue torciendo poco a poco, y por eso tuviste que enfrentarte a ellos.'],
  ['Vael y Nerea', 'Vael fue el reino más sabio de su tiempo. Su rey quiso usar un fragmento para no morir nunca y lo consiguió… a medias: sigue en su trono, muerto y despierto. Su hermano, rey de Nerea, intentó esconder otro fragmento en el fondo del mar. El mar aceptó el regalo y lo convirtió a él en el Kraken.'],
  ['El Eclipse', 'Cuando venciste al Desatado, una parte de él no cayó: su sombra. Ese resto, sin hilo y sin forma, se hizo llamar Señor del Eclipse y reunió a todos los que también querían dejar de ser vistos. Pero una sombra solo existe porque hay luz. Y la luz eres tú… o la pantalla desde la que miras.'],
  ['Las arenas y el ámbar', 'En Sahrim, un faraón olvidado intentó robar a los héroes su don de volver a levantarse. Lo sellaron con ámbar bajo el desierto. El ámbar no olvida: todo lo que atrapa sigue despierto, esperando a que alguien rompa la última capa. Su guardián todavía vigila la cripta.'],
  ['El invierno que no terminó', 'Bajo los Picos Helados, el frío del Gólem de Escarcha se quedó atrapado sin dueño. Con los años aprendió a darse forma: muñecos de nieve con ojos de carbón que se mueven cuando nadie los mira. Su rey lleva una corona de hielo eterno y no recuerda haber sido otra cosa que invierno.'],
  ['Ventisca', 'Los Tejedores se apagaron, pero el mundo sigue creciendo: aparecen cuevas heladas que ayer no estaban, islas nuevas, casas que se levantan solas. Los sabios lo llaman la Ventisca: una voz que escribe tierras nuevas cada estación desde más allá del Lienzo. Nadie la ha visto. Pero cada vez que el mundo se «actualiza», las piedras tiemblan un poco.'],
  ['El héroe que teje', 'Hay una profecía en Albor: cuando el Vínculo de un héroe sea lo bastante fuerte, podrá tejer en lugar de solo caminar. Pondrá paredes, plantará semillas que crecerán aunque cierre los ojos y levantará casas donde antes solo había hierba. Mira a tu alrededor: ya ha empezado.'],
  ['Cuando cierras el juego', 'Nadie sabe qué pasa cuando el héroe «duerme» de verdad: cuando el cielo se apaga y todo se queda quieto. Unos dicen que el mundo sigue sin ti. Otros, que se congela como el ámbar. La Anciana Mira cree otra cosa: que el mundo te espera. Por eso, cuando vuelves, los cultivos han crecido.'],
];
const LORE_LINES = [
  [0, 'Mi abuela decía que el mundo está hecho de cuadraditos de dieciséis. Yo los he contado: es verdad.'],
  [0, 'Si miras el cielo muy de cerca, se ven los píxeles. No se lo digas a nadie.'],
  [1, 'Tú no eres de aquí del todo, ¿verdad? Hay alguien detrás de ti. Lo noto cuando te quedas quieto mucho rato.'],
  [1, '¿Por qué los héroes vuelven a levantarse y nosotros no? Dicen que vuestro hilo llega al otro lado del cristal.'],
  [1, 'A veces te mueves a saltitos, como si alguien te empujara con el dedo. ¿No te hace cosquillas?'],
  [1, 'Ese número que flota encima de tu cabeza… ¿es tu edad? Para ser tan mayor, corres muchísimo.'],
  [2, 'El Desatado quería que nadie lo mirara. Qué triste, ¿no? Yo prefiero que alguien me mire… como tú ahora.'],
  [2, 'Dicen que el Desatado cortó su propio hilo. Por eso borra todo lo que toca: ya no le queda nada que lo sujete.'],
  [3, 'El Rey Slime no era malo. Era un slime normal que encontró algo brillante. Nos podría pasar a cualquiera.'],
  [3, 'Siete fragmentos, siete guardianes… y una sola persona que los juntó todos. Aún no sé si darte las gracias o tenerte miedo.'],
  [4, 'Mi bisabuelo era de Vael. Decía que su rey sigue sentado en el trono, contando los días que no pasan.'],
  [4, 'El Kraken fue un rey. Cuando pesques en el abismo, no le grites: todavía entiende las palabras.'],
  [5, 'Una sombra solo existe porque hay luz. Lo dijo la Anciana Mira. Creo que hablaba de ti… o del brillo de tu pantalla.'],
  [6, 'El ámbar no olvida. Si vas a la cripta del desierto, no rompas la última capa sin estar preparado.'],
  [7, 'Mi primo subió a los Picos y juró que un muñeco de nieve le guiñó un ojo. Desde entonces no hace muñecos.'],
  [8, 'Esta mañana había una cueva helada donde ayer había rocas. Mi tía dice que es cosa de la Ventisca.'],
  [8, '¿Has notado que el mundo tiembla un poco cada cierto tiempo? Los sabios dicen que se está «actualizando».'],
  [8, 'Anoche soñé con un nombre: Ventisca. Escribía montañas con la punta de los dedos.'],
  [9, 'Dicen que los héroes pueden tejer el mundo. Ya te he visto poner paredes… ¿cuánto te falta para tejer un dragón?'],
  [9, 'Ayer aquí no había ninguna casa y hoy sí. ¿La has hecho tú? Tiene buen gusto… para ser de madera.'],
  [9, 'Mi hija quiere ser heroína. Le he dicho que primero tiene que encontrar a alguien al otro lado que quiera jugar con ella.'],
  [10, 'Cuando te vas, ¿adónde vamos nosotros? Yo cuento ovejas pixeladas hasta que vuelves.'],
  [10, '¿Has guardado la partida? No es por nada… pero la última vez se fue la luz.'],
  [10, 'Por cierto, tienes la pantalla un poco sucia. Se ven las huellas de tus dedos desde aquí.'],
  [10, 'Llevo todo el día aquí de pie esperando a que alguien me hable. Gracias por pulsar el botón.'],
];
LIFE_SAY.push('¿Nos están mirando?', 'Qué dedos tan grandes…', 'Hoy el mundo se ha actualizado.', '¡Guarda la partida!', 'Dicen que la Ventisca escribe de noche.', '¿Tú también ves cuadraditos?');
function loreUnlock(ch) { const P = G.P; P.loreU = P.loreU || []; if (!P.loreU.includes(ch)) { P.loreU.push(ch); toast('Crónicas del Vínculo: «' + CRON[ch][0] + '» (' + P.loreU.length + '/' + CRON.length + ')', 'quest', 4); markDirty(); return true; } return false; }
function dailyLore(id) { const d = calDay(), i = Math.floor(hash2(id.length * 13 + id.charCodeAt(3), d * 5 + 1, 66) * LORE_LINES.length) % LORE_LINES.length; return LORE_LINES[i]; }
DLG_HOOKS.push((npc, opts) => { if (!npc.def || !npc.def.tf) return; opts.unshift({ label: '¿Qué se cuenta hoy?', icon: ['book'], fn: () => { const [ch, s] = dailyLore(npc.id); typeText(s); loreUnlock(ch); } }); });
function openChronicles() {
  const P = G.P, U = P.loreU || [];
  openModal(`<h2>${iconHTML(['book'], 22)} Crónicas del Vínculo</h2><p class="hint">${U.length}/${CRON.length} capítulos. Los aldeanos cuentan un trozo distinto cada día («¿Qué se cuenta hoy?») y la Anciana Mira te narra uno por día.</p>
    <div class="cron">${CRON.map(([t, x], i) => U.includes(i) ? `<details><summary><b>${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][i]}. ${esc(t)}</b></summary><p>${esc(x)}</p></details>` : `<div class="cron-l">${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][i]}. ???</div>`).join('')}</div>
    <div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
}
DLG_HOOKS.push((npc, opts) => { if (npc.id !== 'mira') return; opts.unshift({ label: 'Crónicas del Vínculo', icon: ['book'], fn: () => { const P = G.P, d = calDay(), U = P.loreU || []; const nxt = CRON.findIndex((_, i) => !U.includes(i));
  if (nxt >= 0 && P.loreMira !== d) { P.loreMira = d; typeText(CRON[nxt][1]); loreUnlock(nxt); return; }
  closeDialog(); openChronicles(); } }); });
