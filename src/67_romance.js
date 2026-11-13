// ================= FRIENDSHIP & ROMANCE, COMPANIONS =================
it('ramo', { n: 'Ramo de flores', t: 'mat', stack: true, price: 80, icon: ['bouquet'], gift: 'bouquet', rar: 1 });
it('pastel', { n: 'Pastel de fresa', t: 'cons', stack: true, price: 150, heal: 400, food: 6, icon: ['cake'], gift: 'cake', rar: 1 });
it('colgante_amor', { n: 'Colgante de Promesa', t: 'mat', stack: true, price: 6000, icon: ['heart', '#ff5a8a'], rar: 3 });
for (const t in SHOPS.store) if (!SHOPS.store[t].includes('ramo')) SHOPS.store[t].push('ramo');
for (const t in SHOPS.inn) SHOPS.inn[t].push('pastel');
for (const t in SHOPS.gems) SHOPS.gems[t].push('colgante_amor');
RECIPES.push({ id: 'r_pastel', job: 'cocina', out: 'pastel', n: 2, lv: 1, jlv: 4, gold: 30, mats: [['trigo', 3], ['herb2', 1]], cat: 'comida' });
RECIPES.push({ id: 'r_ramo', job: 'alquimia', out: 'ramo', n: 2, lv: 1, jlv: 1, gold: 10, mats: [['herb1', 2], ['herb2', 1]], cat: 'pocion' });
RECIPES.push({ id: 'r_colgante_amor', job: 'joyeria', out: 'colgante_amor', n: 1, lv: 10, jlv: 15, gold: 1500, mats: [['ore3', 3], ['rubi', 2], ['tinte', 1]], cat: 'joya' });
// Two meters per character: Confianza (trust) and Amor (love), 0-1000 = 10 hearts each.
const ROM = {
  lia: { g: 'f', loves: ['bouquet', 'cake', 'gem'], likes: ['crop', 'food', 'potion'], hates: ['fang', 'bone', 'ore'], taste: 'las flores y los dulces' },
  nora: { g: 'f', loves: ['cake', 'food', 'bouquet'], likes: ['fish', 'crop'], hates: ['core', 'bone'], taste: 'la buena cocina y los pasteles' },
  greta: { g: 'f', loves: ['log', 'food', 'pelt'], likes: ['ore', 'fish', 'cake'], hates: ['cloth', 'potion'], taste: 'la madera fina y la comida contundente' },
  sela: { g: 'f', loves: ['herb', 'potion', 'crystal'], likes: ['gem', 'bouquet'], hates: ['fish', 'bone'], taste: 'las hierbas raras y las pociones' },
  marina: { g: 'f', loves: ['fish', 'relic', 'gem'], likes: ['food', 'ring', 'cake'], hates: ['herb', 'spore'], taste: 'los peces raros y los tesoros antiguos' },
  cazadora: { g: 'f', loves: ['pelt', 'fang', 'food'], likes: ['ore', 'bouquet'], hates: ['cloth', 'potion'], taste: 'las pieles y los colmillos' },
  sastre_s: { g: 'f', loves: ['cloth', 'gem', 'bouquet'], likes: ['ring', 'amulet', 'cake'], hates: ['ore', 'bone'], taste: 'las telas finas y las joyas' },
  kael: { g: 'm', loves: ['fang', 'ring', 'food'], likes: ['ore', 'pelt'], hates: ['bouquet', 'potion'], taste: 'los trofeos de caza' },
  marinero: { g: 'm', loves: ['fish', 'food', 'cake'], likes: ['relic', 'log'], hates: ['herb', 'crystal'], taste: 'el pescado y la comida casera' },
  elian: { g: 'm', loves: ['crystal', 'core', 'herb'], likes: ['potion', 'gem', 'bouquet'], hates: ['fish', 'pelt'], taste: 'los cristales y las esencias mágicas' },
  hugo: { g: 'm', loves: ['ore', 'gem', 'food'], likes: ['log', 'fang', 'cake'], hates: ['bouquet', 'cloth'], taste: 'los buenos metales' },
  zahir: { g: 'm', loves: ['ore', 'relic', 'cake'], likes: ['gem', 'food'], hates: ['herb', 'fish'], taste: 'el oricalco y las reliquias' },
};
const ROM_WHERE = { lia: 'Tienda de Albor', nora: 'Posada de Albor', greta: 'Bosque de Albor', sela: 'Alquimia de Puerto Coral', marina: 'Muelle de Puerto Coral', cazadora: 'Aldea Yarakai', sastre_s: 'Oasis de Sahrim', kael: 'Gremio de Arxar', marinero: 'Puerto Coral', elian: 'Alquimia de Arxar', hugo: 'Herrería de Puerto Coral', zahir: 'Herrería de Sahrim' };
function relKey(id) { return id === 'marina_nhar' ? 'marina' : id; }
function rel(id) { const P = G.P; P.rel = P.rel || {}; return P.rel[id] = P.rel[id] || { t: 0, a: 0 }; }
const hearts = v => Math.floor((v || 0) / 100);
function heartStr(v) { const h = hearts(v); return '♥'.repeat(h) + '♡'.repeat(10 - h); }
function nick(k) { return NPCS[k].n.replace(/^(Capitana|Capitán|Maestro|Marinero|Mercader|Captain|Master|Sailor|Merchant|Elder) /, '').split(' ')[0]; }
function addRel(k, dt, da, x, y, quiet) {
  const R = rel(k), t0 = hearts(R.t), a0 = hearts(R.a); R.t = clamp(R.t + dt, 0, 1000); R.a = clamp(R.a + da, 0, 1000);
  if (!quiet && x !== undefined) { if (da) floatText(x, y, (da > 0 ? '♥ +' : '♥ ') + da, da > 0 ? '#ff7ab0' : '#a07080', da >= 25); if (dt) setTimeout(() => floatText(x, y - 10, (dt > 0 ? 'Confianza +' : 'Confianza ') + dt, '#9ad8ff'), 160); }
  if (hearts(R.t) > t0) { toast(nick(k) + ': Confianza ' + hearts(R.t) + '/10', 'quest'); sfx('quest'); }
  if (hearts(R.a) > a0) { toast(nick(k) + ': Amor ♥ ' + hearts(R.a) + '/10', 'loot', 4); sfx('level'); }
  markDirty();
}
const cdLeft = (R, key, sec) => Math.max(0, sec - (Date.now() - (R[key] || 0)) / 1000);
const pick = a => a[Math.floor(Math.random() * a.length)];
const gx = (D, f, m) => LANG_EN ? '' : D.g === 'f' ? f : m;
// ---------- dialog sub-menu ----------
function romanceMenu(npc, msg) {
  const P = G.P, k = relKey(npc.id), D = ROM[k], R = rel(k), nm = nick(k), partner = P.partner === k, comp = COMP && relKey(COMP.e.id) === k;
  const lock = (label, need) => ({ label: '<i class="lk">🔒</i> ' + label + ' <small>· ' + need + '</small>', cls: 'locked', fn: () => typeText('Aún no. Necesitas ' + need + ' con ' + nm + '.') });
  const opts = [];
  opts.push({ label: 'Charlar con cariño', icon: ['talk'], fn: () => romTalk(npc) });
  opts.push(R.t >= 100 ? { label: 'Coquetear', icon: ['heart', '#ff5a8a'], fn: () => romFlirt(npc) } : lock('Coquetear', 'Confianza 1'));
  opts.push({ label: 'Hacer un regalo', icon: ['bouquet'], fn: () => openGift(npc) });
  opts.push(R.t >= 300 ? { label: 'Abrazar', icon: ['heart', '#ff5a8a'], fn: () => romHug(npc) } : lock('Abrazar', 'Confianza 3'));
  if (comp) opts.push({ label: COMP.hand ? 'Soltar la mano y despedirse' : 'Despedirse por hoy', icon: ['ways'], fn: () => { endComp(); typeText(pick(['¡Ha sido un paseo precioso!', 'Cuando quieras, repetimos.', 'Vuelvo a casa. ¡Cuídate!'])); } });
  else if (R.t >= 400 && R.a >= 300) opts.push({ label: 'Pasear de la mano', icon: ['heart', '#ff5a8a'], fn: () => { startComp(npc, true); closeDialog(); } });
  else if (R.t >= 400) opts.push({ label: 'Pedir que te acompañe', icon: ['users'], fn: () => { startComp(npc, false); closeDialog(); } });
  else opts.push(lock('Pasear juntos', 'Confianza 4'));
  opts.push(R.a >= 600 && R.t >= 500 ? { label: 'Dar un beso', icon: ['heart', '#ff5a8a'], fn: () => romKiss(npc) } : lock('Dar un beso', 'Amor 6 y Confianza 5'));
  if (partner) { opts.push({ label: 'Hablar de formar una familia', icon: ['house'], fn: () => familyTalk(npc) }); opts.push({ label: 'Te quiero', icon: ['heart', '#ff5a8a'], fn: () => romPartnerTalk(npc) }); opts.push({ label: 'Terminar la relación', cls: 'bye', fn: () => romBreak(npc) }); }
  else if (!P.partner) opts.push(R.a >= 900 && R.t >= 800 ? { label: 'Pedir ser tu pareja', icon: ['heart', '#ff5a8a'], fn: () => romPropose(npc) } : lock('Pedir ser pareja', 'Amor 9, Confianza 8 y un Colgante de Promesa'));
  opts.push({ label: 'Volver', fn: () => dialogMenu() });
  setOpts(opts);
  typeText(msg || `${partner ? 'Tu pareja ♥\n' : comp ? 'Te acompaña\n' : ''}Confianza ${heartStr(R.t)}\nAmor      ${heartStr(R.a)}`);
}
function romTalk(npc) {
  const k = relKey(npc.id), D = ROM[k], R = rel(k), h = hearts(R.t);
  const lines = h < 2 ? ['Hola... ¿nos conocemos? Bueno, encantad' + gx(D, 'a', 'o') + '.', 'Siempre estoy por aquí, en ' + ROM_WHERE[k] + '.', 'Si quieres caerme bien... me encantan ' + D.taste + '.']
    : h < 5 ? ['¡Hola otra vez! Me alegra verte.', '¿Qué tal tus aventuras? Cuéntame algo.', 'Ya sabes que me encantan ' + D.taste + ', ¿eh?', 'Contigo el día se pasa volando.']
    : h < 8 ? ['¡Por fin llegas! Te estaba esperando.', 'Eres de las personas en quien más confío.', 'A veces pienso en ti cuando estás de viaje...', '¿Te quedas un rato? Me gusta tu compañía.']
    : ['Mi persona favorita del mundo ♥', 'Cada vez que vuelves, sonrío sin querer.', 'Contigo me siento en casa.', 'Prométeme que tendrás cuidado ahí fuera.'];
  const line = pick(lines);
  if (cdLeft(R, 'ct', 120) > 0) { romanceMenu(npc, line); return; }
  R.ct = Date.now(); addRel(k, 12, R.a >= 100 ? 3 : 0, npc.x, npc.y - 36); romanceMenu(npc, line);
}
const FLIRTS = ['¿Siempre brillas así o solo cuando llego yo?', 'Si fueras una poción, serías una de amor.', 'He cruzado medio mundo y nada se compara contigo.', '¿Tienes un mapa? Me pierdo en tu mirada.', 'Hoy el día está precioso... pero tú más.', 'Derroto jefes sin miedo, pero contigo me tiemblan las piernas.'];
function romFlirt(npc) {
  const P = G.P, k = relKey(npc.id), D = ROM[k], R = rel(k), cd = cdLeft(R, 'cf', 150);
  if (cd > 0) { romanceMenu(npc, pick(['Jeje... ya me lo has dicho antes.', '¡Para, que me pongo roj' + gx(D, 'a', 'o') + '!']) + ' (vuelve en ' + fmtTime(cd) + ')'); return; }
  R.cf = Date.now(); const charm = Math.min(0.15, Object.keys(P.cos || {}).length * 0.04);
  const ch = clamp(0.38 + R.t / 2200 + R.a / 2600 + charm, 0.1, 0.95), say = '«' + pick(FLIRTS) + '»\n';
  if (Math.random() < ch) { const g = 18 + Math.floor(Math.random() * 15); addRel(k, 4, g, npc.x, npc.y - 36); for (let i = 0; i < 4; i++) setTimeout(() => floatText(npc.x + (Math.random() - 0.5) * 12, npc.y - 40, '♥', '#ff7ab0'), i * 120); sfx('quest');
    romanceMenu(npc, say + pick(hearts(R.a) < 3 ? ['¡Jaja! Qué cosas dices...', 'Eres muy direct' + gx(D, 'o', 'o') + ', ¿no? Me gusta.', '¿Eso se lo dices a todo el mundo?'] : hearts(R.a) < 7 ? ['Me haces sonrojar...', 'Tonto... bueno, no pares.', 'Llevo todo el día esperando a que vinieras.'] : ['Tú siempre sabes qué decir ♥', 'Y tú eres lo mejor que me ha pasado.', 'Ven aquí, anda ♥']));
  } else { addRel(k, 0, -5, npc.x, npc.y - 36); sfx('hurt'); romanceMenu(npc, say + pick(['Eh... ¿perdona?', 'Mejor sigue con tus misiones, aventurer' + (LANG_EN ? '' : P.app && P.app.g === 'f' ? 'a' : 'o') + '.', 'Ahora estoy ocupad' + gx(D, 'a', 'o') + '...', 'Jaja, no. Inténtalo otro día.'])); }
}
// ---------- gifts ----------
function giftCat(id) { const it = ITEMS[id]; if (!it) return null; if (it.gift) return it.gift; const k = it.icon && it.icon[0]; return k === 'potion2' ? 'potion' : k; }
function giftable(s) { const it = ITEMS[s.id]; return it && (it.t === 'mat' || it.t === 'cons' || it.slot === 'acc' || it.slot === 'neck') && it.t !== 'quest' && !it.seed && s.id !== 'colgante_amor'; }
function giftReact(k, id) { const D = ROM[k], c = giftCat(id); if (D.loves.includes(c)) return 3; if (D.hates.includes(c)) return 0; if (D.likes.includes(c) || c === 'bouquet' || c === 'cake') return 2; return 1; }
function openGift(npc) {
  const P = G.P, k = relKey(npc.id), R = rel(k), cd = cdLeft(R, 'cg', 240);
  if (cd > 0) { romanceMenu(npc, '¡Ya me has hecho un regalo hace poco! Guárdalo para otro momento. (vuelve en ' + fmtTime(cd) + ')'); return; }
  const list = P.inv.map((s, i) => [s, i]).filter(([s]) => giftable(s));
  closeDialog();
  openModal(`<h2>${iconHTML(['bouquet'], 22)} Regalo para ${esc(nick(k))}</h2><p class="hint">Le encantan ${esc(ROM[k].taste)}. Las flores y los pasteles gustan a casi todo el mundo; los regalos raros valen más.</p><div class="slist">${list.map(([s, i]) => { const it = ITEMS[s.id]; return `<button class="srow" data-g="${i}">${iconHTML(it.icon, 24)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${esc(it.n)}</b><small>${s.q > 1 ? '×' + s.q : ''}</small></div></button>`; }).join('') || '<p class="hint">No tienes nada que regalar. Compra un Ramo de flores en las tiendas o cocina un Pastel.</p>'}</div><div class="row"><button class="btn" id="mclose">Cancelar</button></div>`, 'party');
  $('#mclose').onclick = () => { closeModal(); openDialog(npc); romanceMenu(npc); };
  $$('[data-g]').forEach(b => b.onclick = () => { const s = P.inv[+b.dataset.g]; if (!s) return; const id = s.id, it = ITEMS[id]; takeItem(id, 1); closeModal(); R.cg = Date.now();
    const r = giftReact(k, id), rar = it.rar || 0, romantic = ['bouquet', 'cake', 'gem', 'ring', 'amulet'].includes(giftCat(id));
    const dt = [-20, 12, 26, 42][r] + rar * 6, da = r === 0 ? -10 : romantic && R.t >= 100 ? [0, 6, 18, 32][r] + rar * 4 : r === 3 ? 6 : 0;
    addRel(k, dt, da, npc.x, npc.y - 36); sfx(r ? 'quest' : 'hurt');
    openDialog(npc); romanceMenu(npc, ['Uf... no me gusta nada esto. Pero gracias por intentarlo.', 'Oh, gracias. Es un detalle.', '¡Qué bonito! Me gusta mucho, gracias.', '¡¿Es para mí?! ¡Me encanta! ¡Eres increíble!'][r] + ` (${it.n})`); markDirty(true); });
}
// ---------- scenes: hug & kiss ----------
let SCENE = null;
function romScene(npc, kind, done) {
  closeDialog(); const P = G.P, M = G.map, side = P.x <= npc.x ? -1 : 1, px = npc.x + side * (kind === 'kiss' ? 17 : 13);
  if (!blockedFor(M, Math.floor(px / 16), Math.floor(npc.y / 16), P.L)) { P.x = px; P.y = npc.y; }
  P.dir = side < 0 ? 'right' : 'left'; npc.dir = side < 0 ? 'left' : 'right'; P.emote = null; P.job = null;
  setAnim(P, kind); setAnim(npc, kind); P.loopAnim = true; npc.loopAnim = true; npc.scene = 1;
  SCENE = { e: npc, kind, t: 0, dur: kind === 'kiss' ? 2.6 : 2.1, done, pt: 0 }; sfx('quest');
}
function sceneUpdate(dt) {
  const S = SCENE, P = G.P, e = S.e; S.t += dt; stepAnim(P, dt, 2.5); stepAnim(e, dt, 2.5); S.pt += dt;
  if (S.pt > 0.2) { S.pt = 0; floatText((P.x + e.x) / 2 + (Math.random() - 0.5) * 18, Math.min(P.y, e.y) - 30 - Math.random() * 10, '♥', pick(['#ff7ab0', '#ff4a7a', '#ffc0d8']), Math.random() < 0.6); }
  if (S.t >= S.dur) { e.scene = 0; setAnim(P, 'idle'); setAnim(e, 'idle'); SCENE = null; if (S.done) S.done(); }
}
function romHug(npc) {
  const k = relKey(npc.id), R = rel(k), D = ROM[k];
  romScene(npc, 'hug', () => { const fresh = cdLeft(R, 'ch', 90) <= 0; if (fresh) { R.ch = Date.now(); addRel(k, 15, R.a >= 100 ? 6 : 0, npc.x, npc.y - 40); } toast(nick(k) + ': ' + pick(['Qué abrazo tan cálido...', '¡Gracias! Lo necesitaba.', 'Me siento a salvo contigo.']), 'info'); });
}
function romKiss(npc) {
  const k = relKey(npc.id), R = rel(k);
  romScene(npc, 'kiss', () => { const fresh = cdLeft(R, 'ck', 120) <= 0; if (fresh) { R.ck = Date.now(); addRel(k, 5, 20, npc.x, npc.y - 40); } burst((G.P.x + npc.x) / 2, npc.y - 24, 16, { sp: 50, up: 50, g: 30, life: 1, c: ['#ff7ab0', '#ffc0d8', '#ffffff'] }); toast(nick(k) + ': ' + pick(['♥ ...', 'Me has dejado sin palabras ♥', 'Otra vez... ♥']), 'loot', 4); });
}
function romPropose(npc) {
  const P = G.P, k = relKey(npc.id);
  if (!countItem('colgante_amor')) { romanceMenu(npc, 'Para pedírselo necesitas un Colgante de Promesa (se vende en las joyerías o se engasta en Joyería).'); return; }
  takeItem('colgante_amor', 1);
  romScene(npc, 'kiss', () => { P.partner = k; addRel(k, 50, 100, npc.x, npc.y - 40); for (let i = 0; i < 4; i++) setTimeout(() => burst(npc.x, npc.y - 30, 24, { sp: 90, up: 70, g: 60, life: 1.2, c: ['#ff4a7a', '#ffd040', '#ffffff', '#ff9ac0'] }), i * 250);
    sfx('level'); toast('¡' + nick(k) + ' ha aceptado! Ahora sois pareja ♥', 'quest'); setTimeout(() => toast(Object.keys(G.P.homes || {}).length ? nick(k) + ' vivirá contigo en tu casa' : 'Compra una casa y ' + nick(k) + ' vivirá contigo', 'info'), 1200); markDirty(true); });
}
function romPartnerTalk(npc) {
  const P = G.P, k = relKey(npc.id), R = rel(k), cd = cdLeft(R, 'cp', 1200);
  if (cd > 0) { romanceMenu(npc, pick(['Yo también te quiero ♥', 'Eres mi héroe favorito.', '¿Cenamos juntos esta noche?'])); return; }
  R.cp = Date.now(); const T = Math.min(5, 1 + Math.floor(P.lv / 30)); const gift = pick(['pocion' + T, 'eter' + T, 'food' + Math.min(11, 1 + Math.floor(P.lv / 14)), 'ramo', 'pastel']);
  if (ITEMS[gift]) giveItem(gift, 2); addRel(k, 6, 8, npc.x, npc.y - 36); romanceMenu(npc, 'Te he preparado algo para el camino. ¡Vuelve sano y salvo! ♥');
}
function romBreak(npc) { const P = G.P, k = relKey(npc.id), R = rel(k); P.partner = null; R.a = Math.min(R.a, 300); if (COMP && relKey(COMP.e.id) === k) endComp(); markDirty(true); romanceMenu(npc, 'Entiendo... Gracias por todo. Seguiremos siendo amigos.'); }
// ---------- companion (walk together / hand in hand) ----------
let COMP = null;
function startComp(e, hand) {
  if (COMP) endComp(true); COMP = { e, hand, hm: e.map, hx: e.home.x, hy: e.home.y, t: 0, ht: 0, rt: 0 }; e.follow = 1; e.wt = null;
  const k = relKey(e.id); calcStats(G.P); uiDirty.hud = true; sfx('quest');
  toast(hand ? 'Paseas de la mano con ' + nick(k) + ' ♥ (+' + Math.round(compBonus() * 100) + '% ataque y defensa, curación)' : nick(k) + ' te acompaña (+' + Math.round(compBonus() * 100) + '% ataque y defensa)', 'quest');
}
function endComp(silent) {
  const C = COMP; if (!C) return; const e = C.e; e.follow = 0; e.map = C.hm; e.x = C.hx; e.y = C.hy; setAnim(e, 'idle'); COMP = null; calcStats(G.P); uiDirty.hud = true;
  if (!silent) toast(nick(relKey(e.id)) + ' vuelve a casa', 'info');
}
function compBonus() { if (!COMP || !G.P) return 0; return G.P.partner === relKey(COMP.e.id) ? 0.15 : COMP.hand ? 0.12 : 0.08; }
function compUpdate(e, dt) {
  const P = G.P; if (e.map !== P.map) { e.map = P.map; e.x = P.x; e.y = P.y + 4; }
  const dv = DIRV[P.dir] || [0, 1]; let tx, ty;
  if (COMP.hand) { if (P.dir === 'left' || P.dir === 'right') { tx = P.x - dv[0] * 15; ty = P.y + 2; } else { tx = P.x + 13; ty = P.y; } }
  else { tx = P.x - dv[0] * 24; ty = P.y - dv[1] * 18 + (dv[1] ? 0 : 3); }
  const dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy);
  if (L > 160) { e.x = tx; e.y = ty; }
  else if (L > 1.5) { const sp = Math.min(L * 7, ((P.S && P.S.spd) || 70) * 1.35); if (!moveEnt(G.map, e, dx / L * sp * dt, dy / L * sp * dt) && L > 30) { e.x = tx; e.y = ty; } }
  e.dir = COMP.hand ? P.dir : (L > 5 ? dirFromVec(dx, dy) : P.dir);
  const walking = P.anim === 'walk' || L > 6; setAnim(e, walking ? 'walk' : 'idle', true); e.loopAnim = true; stepAnim(e, dt, walking ? 8 : 2);
  COMP.t += dt; if (COMP.t > 4) { COMP.t = 0; if (!P.dead && P.hp < P.S.maxhp) { const h = Math.max(1, Math.round(P.S.maxhp * (COMP.hand ? 0.02 : 0.01))); P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 36, '+' + h, '#7ae07a'); } }
  COMP.ht += dt; if (COMP.hand && COMP.ht > 2.4) { COMP.ht = 0; floatText((P.x + e.x) / 2, Math.min(P.y, e.y) - 34, '♥', '#ff7ab0'); }
  COMP.rt += dt; if (COMP.rt > 30) { COMP.rt = 0; addRel(relKey(e.id), 4, COMP.hand ? 3 : 0, 0, 0, true); }
}
// hands joined: a short skin-coloured link between both hands
function drawHandLink(e, cx, cy) {
  const P = G.P; if (!COMP || !COMP.hand || COMP.e !== e || e.map !== P.map) return;
  const ax = e.x - cx, ay = e.y - cy - 9, bx = P.x - cx, by = P.y - cy - 9; if (Math.abs(ax - bx) > 20 || Math.abs(ay - by) > 12) return;
  const side = P.dir === 'left' || P.dir === 'right', s = Math.sign(ax - bx) || 1, x0 = bx + s * 4, y0 = by + 1, x1 = ax - s * 4, y1 = ay + 1;
  ctx.strokeStyle = '#2a1a14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(Math.round(x0), Math.round(y0)); ctx.lineTo(Math.round(x1), Math.round(y1)); ctx.stroke();
  ctx.strokeStyle = '#f0c49a'; ctx.lineWidth = 2; ctx.stroke();
}
// ---------- relationships tab ----------
function renderRel(B) {
  const P = G.P; P.rel = P.rel || {};
  const rows = Object.keys(ROM).map(k => { const R = P.rel[k] || { t: 0, a: 0 }, D = ROM[k], met = R.t > 0;
    return `<div class="srow relrow"><div class="sn"><b>${esc(NPCS[k].n)} ${P.partner === k ? '<span class="pt">♥ Pareja</span>' : ''}${COMP && relKey(COMP.e.id) === k ? ' <span class="cp">te acompaña</span>' : ''}</b><small>${esc(NPCS[k].title)} · ${esc(ROM_WHERE[k])}</small>
      <div class="hrow"><span class="lb">Confianza</span><span class="hs tr">${heartStr(R.t)}</span></div><div class="hrow"><span class="lb">Amor</span><span class="hs">${heartStr(R.a)}</span></div>
      <small>Le gusta: ${hearts(R.t) >= 2 ? esc(D.taste) : met ? 'habla más para descubrirlo' : '¿?'}</small></div></div>`; }).join('');
  const houses = Object.entries(HOUSES).map(([id, H]) => `<div class="srow"><div class="sn"><b>${iconHTML(['house'], 16)} ${esc(H.n)}</b><small>${esc(H.town)} · ${isHome(id) ? '<span class="ok2">Es tuya</span>' : fmt(H.price) + ' oro · entra en la casa con el cartel "Se vende"'}</small></div></div>`).join('');
  B.innerHTML = `<div class="relwrap"><div class="frame"><h3>Relaciones</h3><p class="hint">Habla con los personajes y elige «Relación». Charlar y los regalos suben la Confianza; coquetear, los besos y los regalos románticos (flores, pasteles, gemas, joyas) suben el Amor. Con Confianza 3 podéis abrazaros, con 4 pasear juntos, con Amor 6 besaros y con Amor 9 y un Colgante de Promesa, pedirle ser tu pareja.</p>${rows}</div><div class="frame"><h3>Casas</h3>${houses}<p class="hint">En tu casa puedes dormir, guardar objetos en el baúl, cambiar de ropa (armario y espejo) y decorar con la mesa de diseño.</p></div></div>`;
}
