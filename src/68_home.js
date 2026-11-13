// ================= PLAYER HOUSES: buy, decorate, sleep, storage =================
const HOUSES = {
  casa_a3: { n: 'Casa del Valle', town: 'Aldea Albor', price: 2500 },
  casa_p2: { n: 'Casa del Puerto', town: 'Puerto Coral', price: 9000 },
  casa_x3: { n: 'Casa de la Ciudadela', town: 'Ciudadela de Arxar', price: 30000 },
  casa_s2: { n: 'Casa del Oasis', town: 'Oasis de Sahrim', price: 80000 },
};
const FURN_CAT = {
  bed: { n: 'Cama sencilla', slot: 'bed', price: 0 }, bigbed: { n: 'Cama matrimonial', slot: 'bed', price: 3000 },
  wardrobe: { n: 'Armario (cosméticos)', slot: 'ward', price: 1200 }, mirror: { n: 'Espejo (estilista)', slot: 'mirror', price: 1000 },
  fireplace: { n: 'Chimenea', slot: 'fire', price: 1500 }, bookshelf: { n: 'Estantería', slot: 'fire', price: 600 },
  table: { n: 'Mesa y sillas', slot: 'table', price: 0 }, sofa: { n: 'Sofá', slot: 'table', price: 1400 },
  rug: { n: 'Alfombra roja', slot: 'rug', price: 500 }, rugb: { n: 'Alfombra azul', slot: 'rug', price: 700 },
  plant: { n: 'Planta', slot: 'deco', price: 0 }, flowers: { n: 'Jarrón de flores', slot: 'deco', price: 250 }, lamp: { n: 'Lámpara', slot: 'deco', price: 400 },
  painting: { n: 'Cuadro del valle', slot: 'paint', price: 900 }, painting2: { n: 'Retrato estelar', slot: 'paint', price: 2200 },
};
const HSLOTS = [['bed', 'Cama', 2, 3], ['ward', 'Armario', 5, 2], ['mirror', 'Espejo', 7, 2], ['fire', 'Pared derecha', 11, 2], ['paint', 'Cuadro', 9, 1], ['table', 'Centro', 8, 5], ['rug', 'Alfombra', 7, 7], ['deco1', 'Rincón izquierdo', 1, 8], ['deco2', 'Rincón derecho', 12, 8], ['deco3', 'Junto a la cama', 4, 5]];
const SLOT_CAT = { deco1: 'deco', deco2: 'deco', deco3: 'deco' };
const FLOORS = [['Madera', 'FLOOR'], ['Tablones', 'PLANK'], ['Alfombra real', 'CARPET'], ['Adoquín', 'COBBLE']];
function homeCfg(id) { const P = G.P; P.homes = P.homes || {}; return P.homes[id]; }
function isHome(id) { return !!(G.P && G.P.homes && G.P.homes[id]); }
// ---------- interior ----------
function makeHome(id) {
  const cfg = homeCfg(id), big = cfg && cfg.lv >= 2, w = big ? 20 : 14, h = big ? 12 : 10, N = w * h;
  G.ents = G.ents.filter(e => e.map !== id || (typeof COMP !== 'undefined' && COMP && COMP.e === e) || (e.type === 'kid' && e.kid.follow));
  const M = { id, w, h, ter: new Uint8Array(N).fill(T.FLOOR), lvl: new Uint8Array(N), reg: new Uint8Array(N), flags: new Uint8Array(N), isWorld: false, chunks: new Map(), dark: 0.05, music: 'town', I: (x, y) => y * w + x, home: 1 };
  if (cfg) { const fl = T[(FLOORS[cfg.floor || 0] || FLOORS[0])[1]]; for (let y = 2; y < h - 1; y++) for (let x = 1; x < w - 1; x++) M.ter[y * w + x] = fl; }
  for (let x = 0; x < w; x++) { M.ter[x] = T.IWALL; M.ter[w + x] = T.IWALL; M.ter[(h - 1) * w + x] = T.IWALL; } for (let y = 0; y < h; y++) { M.ter[y * w] = T.IWALL; M.ter[y * w + w - 1] = T.IWALL; }
  const ex = w >> 1; M.ter[(h - 1) * w + ex] = T.FLOOR; M.exit = { x: ex, y: h - 1 };
  initMapObjs(M);
  const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  if (!cfg) { F('salesign', 7, 4); F('rug', 7, 7, [], { solid: false }); addObj(M, 'crate', 2, 7); addObj(M, 'crate', 11, 3); M.dark = 0.25; }
  else {
    const fp = { kidbed: [[0, 0], [0, 1]], crib: [[0, 0], [1, 0]], bed: [[0, 0], [0, 1]], bigbed: [[0, 0], [1, 0], [0, 1], [1, 1]], fireplace: [[0, 0], [1, 0], [-1, 0]], bookshelf: [[0, 0], [1, 0]], table: [[0, 0], [1, 0]], sofa: [[0, 0], [1, 0]], rug: [], rugb: [], painting: [], painting2: [] };
    if (big) { const fl = M.ter[3 * w + 3]; for (let y = 2; y < h - 1; y++) M.ter[y * w + 13] = (y === 6 || y === 7) ? fl : T.IWALL; }
    for (const [slot, , x, y] of big ? HSLOTS.concat(HSLOTS2) : HSLOTS) { const f = cfg.f[slot]; if (!f || !FURN_CAT[f]) continue;
      const o = (f === 'rug' || f === 'rugb' || f === 'painting' || f === 'painting2') ? { solid: false } : {}; F(f === 'crib' && babyInCrib(id) ? 'cribbaby' : f, x, y, fp[f], o);
      if (f === 'table') { F('chair', x - 1, y); F('chair', x + 2, y); } }
    F('chest', 12, 6); F('desk', 2, 7); homeFamily(M);
    if (G.P.partner && !(typeof COMP !== 'undefined' && COMP && relKey(COMP.e.id) === G.P.partner) && NPCS[G.P.partner]) { const e = spawnNPC(G.P.partner, 10 * 16 + 8, 6 * 16 + 12, id, { face: 'down', L: 0, wander: 2 }); if (e) e.atHome = 1; }
  }
  M.wdist = null; G.maps[id] = M; return M;
}
// ---------- furniture sprites ----------
function genFurn2(kind) {
  let p, ax, ay, light;
  const W_ = WOOD;
  switch (kind) {
    case 'wardrobe': { p = new Pix(22, 38); p.rect(1, 2, 20, 35, W_[2]); p.rect(1, 0, 20, 3, W_[4]); p.hl(1, 0, 20, W_[5]); p.rect(3, 4, 7, 30, W_[3]); p.rect(12, 4, 7, 30, W_[3]); p.vl(10, 4, 30, W_[0]); p.vl(11, 4, 30, W_[1]); p.set(9, 19, GOLD[4]); p.set(12, 19, GOLD[4]); p.hl(3, 4, 7, W_[4]); p.hl(12, 4, 7, W_[4]); p.rect(1, 35, 20, 2, W_[1]); ax = 11; ay = 36; break; }
    case 'mirror': { p = new Pix(16, 36); p.rect(2, 1, 12, 30, GOLD[2]); p.rect(3, 2, 10, 28, GOLD[3]); p.rect(4, 3, 8, 26, C('#8ab8d8')); for (let k = 0; k < 7; k++) p.set(5 + (k >> 1), 6 + k, C('#e8f8ff')); p.vl(10, 18, 8, C('#c8e8f8')); p.rect(4, 31, 8, 3, W_[2]); p.rect(2, 33, 12, 2, W_[1]); p.set(8, 1, GOLD[5]); ax = 8; ay = 34; break; }
    case 'bigbed': { p = new Pix(36, 38); p.rect(1, 2, 34, 34, W_[2]); p.rect(1, 0, 34, 4, W_[4]); p.hl(1, 0, 34, W_[5]); p.rect(3, 5, 30, 29, C('#f4ece0')); p.rect(5, 6, 11, 6, C('#ffffff')); p.rect(20, 6, 11, 6, C('#ffffff')); p.rect(3, 14, 30, 20, C('#5a2a8a')); p.hl(3, 14, 30, C('#9a5ad0')); for (let y = 17; y < 34; y += 4) p.hl(3, y, 30, C('#4a1e70')); p.ball(18, 22, 3, 2.5, [C('#a01a40'), C('#e83a6a'), C('#ff9ac0')]); ax = 10; ay = 36; break; }
    case 'sofa': { p = new Pix(34, 22); p.rect(1, 3, 32, 10, C('#8a2a3a')); p.hl(1, 3, 32, C('#c04a5a')); p.rect(1, 12, 32, 7, C('#a83444')); p.hl(1, 12, 32, C('#d86070')); p.rect(0, 6, 4, 13, C('#6a1a28')); p.rect(30, 6, 4, 13, C('#6a1a28')); p.vl(17, 13, 6, C('#6a1a28')); woodPost(p, 2, 19, 21, 2); woodPost(p, 30, 19, 21, 2); ax = 9; ay = 20; break; }
    case 'rugb': { p = new Pix(48, 30); p.rect(0, 0, 48, 30, C('#1a2e6a')); p.rect(2, 2, 44, 26, C('#e8d8a0')); p.rect(4, 4, 40, 22, C('#2a4a9a')); for (let x = 8; x < 42; x += 8) p.ball(x, 15, 2, 2, [C('#c8b070'), C('#e8d8a0'), C('#ffffff')]); ax = 24; ay = 22; break; }
    case 'flowers': return genPot('#ffd040');
    case 'toybox': { p = new Pix(18, 16); p.rect(1, 4, 16, 11, C('#4a8ad0')); p.hl(1, 4, 16, C('#8ac0ff')); p.rect(1, 2, 16, 3, C('#e8c040')); p.ball(5, 2, 2, 2, [C('#c8343a'), C('#ff5a5a'), C('#ffb0b0')]); p.rect(11, 0, 3, 3, C('#5ad04a')); p.set(9, 9, C('#ffffff')); ax = 9; ay = 14; break; }
    case 'crib': case 'cribbaby': { p = new Pix(22, 22); p.rect(1, 6, 20, 12, C('#f0e4cc')); p.rect(2, 7, 18, 9, C('#bfe0ff')); for (let x = 2; x < 21; x += 3) p.vl(x, 3, 14, W_[4]); p.hl(1, 3, 20, W_[5]); p.hl(1, 17, 20, W_[3]); woodPost(p, 2, 17, 21, 2); woodPost(p, 18, 17, 21, 2);
      if (kind === 'cribbaby') { p.ball(9, 10, 3, 2.6, [C('#c89070'), C('#f0c49a'), C('#ffe0c0')]); p.rect(11, 9, 7, 5, C('#ffb0cc')); p.set(8, 10, C('#2a1a14')); p.set(10, 10, C('#2a1a14')); p.set(9, 12, C('#ff7a8a')); }
      ax = 11; ay = 20; break; }
    case 'kidbed': { p = new Pix(18, 30); p.rect(1, 2, 16, 26, W_[3]); p.rect(1, 0, 16, 3, C('#5ad0ff')); p.rect(3, 4, 12, 22, C('#f4ece0')); p.rect(4, 5, 10, 5, C('#ffffff')); p.rect(3, 11, 12, 15, C('#ffb040')); for (let y = 13; y < 26; y += 4) p.hl(3, y, 12, C('#ff8a20')); p.ball(9, 18, 2, 2, [C('#c8343a'), C('#ff5a5a'), C('#ffb0b0')]); ax = 9; ay = 28; break; }
    case 'lamp': { p = new Pix(14, 30); p.rect(5, 26, 4, 3, IRON[2]); p.vl(6, 10, 16, IRON[3]); p.vl(7, 10, 16, IRON[1]); p.poly([[2, 10], [12, 10], [10, 2], [4, 2]], C('#f0d890')); p.hl(2, 10, 11, C('#c8a050')); p.set(6, 4, C('#fff8d0')); ax = 7; ay = 28; light = [7, 6]; break; }
    case 'painting': case 'painting2': { p = new Pix(30, 22); p.rect(0, 0, 30, 22, GOLD[2]); p.rect(1, 1, 28, 20, GOLD[4]); p.rect(3, 3, 24, 16, kind === 'painting' ? C('#7ac0f0') : C('#1a1040'));
      if (kind === 'painting') { p.rect(3, 12, 24, 7, C('#4aa040')); p.ball(10, 12, 6, 3, [C('#2e7a22'), C('#4aa836'), C('#8ad050')]); p.ball(22, 7, 2, 2, [C('#ffd040'), C('#ffe880'), C('#ffffff')]); p.rect(17, 10, 4, 4, C('#f0e4cc')); p.poly([[16, 10], [19, 7], [22, 10]], C('#c8343a')); }
      else { for (let k = 0; k < 12; k++) p.set(4 + Math.floor(hash2(k, 3, 9) * 22), 4 + Math.floor(hash2(k, 5, 9) * 14), C('#fff4c0')); p.ball(15, 11, 4, 4, [C('#c070ff'), C('#e0a0ff'), C('#ffffff')]); }
      ax = 15; ay = 28; break; }
    case 'desk': { p = new Pix(26, 22); p.rect(1, 6, 24, 6, W_[3]); p.hl(1, 6, 24, W_[5]); woodPost(p, 3, 12, 21, 2); woodPost(p, 21, 12, 21, 2); p.rect(5, 2, 10, 5, C('#e8e0c8')); p.hl(6, 3, 7, C('#5a7ac8')); p.hl(6, 5, 5, C('#5a7ac8')); p.line(17, 1, 20, 6, C('#2a2a2a')); p.set(17, 1, C('#ffffff')); ax = 13; ay = 20; break; }
    case 'salesign': { p = new Pix(22, 26); woodPost(p, 10, 10, 25, 2); p.rect(1, 1, 20, 11, W_[3]); p.rect(2, 2, 18, 9, C('#f0e4cc')); p.hl(4, 4, 14, C('#c8343a')); p.hl(4, 6, 10, C('#3a2a1e')); p.hl(4, 8, 12, C('#3a2a1e')); ax = 11; ay = 24; break; }
    default: return null;
  }
  p.outline(OUTL); return { c: p.canvas(), ax, ay, light };
}
// ---------- buying ----------
function openBuyHouse(id) {
  const P = G.P, H = HOUSES[id];
  openModal(`<h2>${iconHTML(['house'], 22)} ${esc(H.n)}</h2><p>${esc(H.town)}. Una casa para ti: duerme y recupera fuerzas, guarda objetos en el baúl, cambia de ropa y de estilo con el armario y el espejo, decórala a tu gusto y, si tienes pareja, vivirá contigo.</p><div class="goldline">${iconHTML(['coin'], 16)} ${fmt(P.gold)} oro · Precio: <b>${fmt(H.price)}</b></div><div class="row"><button class="btn gold" id="hbuy" ${P.gold >= H.price ? '' : 'disabled'}>Comprar casa</button><button class="btn" id="mclose">Ahora no</button></div>`, 'shop');
  $('#mclose').onclick = closeModal;
  $('#hbuy').onclick = () => { if (P.gold < H.price) return; P.gold -= H.price; P.homes = P.homes || {}; P.homes[id] = { floor: 0, f: { bed: 'bed', table: 'table', deco1: 'plant' } }; P.furn = P.furn || []; closeModal(); rebuildHome(); toast('¡Ya tienes casa! ' + H.n, 'quest'); sfx('level'); burst(P.x, P.y - 20, 30, { sp: 80, up: 60, g: 80, life: 1, c: ['#ffd040', '#ff7ab0', '#ffffff'] }); markDirty(true); };
}
function rebuildHome() { const P = G.P; if (!P.inside || !HOUSES[P.inside]) return; const x = P.x, y = P.y, d = P.dir; const M = makeHome(P.inside); G.map = M; setMap(M, x, y, d); }
// ---------- decorating ----------
let decSlot = 'bed';
function openDecor() {
  const P = G.P, id = P.inside, cfg = homeCfg(id); if (!cfg) return; P.furn = P.furn || [];
  const owned = f => FURN_CAT[f].price === 0 || P.furn.includes(f);
  const cat = SLOT_CAT[decSlot] || decSlot;
  const list = Object.keys(FURN_CAT).filter(f => FURN_CAT[f].slot === cat);
  const slots = (cfg.lv >= 2 ? HSLOTS.concat(HSLOTS2) : HSLOTS).map(([k, n]) => `<button class="chip ${decSlot === k ? 'on' : ''}" data-ds="${k}">${n}</button>`).join('');
  const rows = `<button class="srow ${!cfg.f[decSlot] ? 'sel' : ''}" data-df=""><div class="sn"><b>Vacío</b><small>Quitar mueble</small></div></button>` + list.map(f => `<button class="srow ${cfg.f[decSlot] === f ? 'sel' : ''}" data-df="${f}"><div class="sn"><b>${esc(FURN_CAT[f].n)}</b><small>${owned(f) ? (cfg.f[decSlot] === f ? 'Colocado' : 'Tuyo · colocar') : iconHTML(['coin'], 12) + ' ' + fmt(FURN_CAT[f].price) + ' · comprar y colocar'}</small></div></button>`).join('');
  openModal(`<h2>Decorar casa</h2><div class="goldline">${iconHTML(['coin'], 16)} ${fmt(P.gold)} oro</div>${cfg.lv >= 2 ? '<p class="hint">Casa ampliada: tiene un cuarto para los niños.</p>' : `<div class="row"><button class="btn gold sm" id="hUp" ${P.gold >= HOUSE_UP ? '' : 'disabled'}>Ampliar casa · ${fmt(HOUSE_UP)} oro</button></div><p class="hint">La ampliación añade un cuarto para los niños con más espacio para muebles.</p>`}<h3>Suelo</h3><div class="chips">${FLOORS.map(([n], i) => `<button class="chip ${(cfg.floor || 0) === i ? 'on' : ''}" data-fl="${i}">${n}</button>`).join('')}</div><h3>Muebles</h3><div class="chips">${slots}</div><div class="slist">${rows}</div><p class="hint">Los muebles comprados son tuyos para siempre y puedes usarlos en todas tus casas. El armario abre tus cosméticos y el espejo, el estilista (pelo, ojos y ropa).</p><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
  const hu = $('#hUp'); if (hu) hu.onclick = () => { if (P.gold < HOUSE_UP) return; P.gold -= HOUSE_UP; cfg.lv = 2; toast('¡Casa ampliada!', 'quest'); sfx('level'); rebuildHome(); markDirty(true); openDecor(); };
  $$('[data-ds]').forEach(b => b.onclick = () => { decSlot = b.dataset.ds; sfx('ui'); openDecor(); });
  $$('[data-fl]').forEach(b => b.onclick = () => { cfg.floor = +b.dataset.fl; sfx('ui'); rebuildHome(); markDirty(true); openDecor(); });
  $$('[data-df]').forEach(b => b.onclick = () => { const f = b.dataset.df; if (!f) { delete cfg.f[decSlot]; } else { if (!owned(f)) { const pr = FURN_CAT[f].price; if (P.gold < pr) { toast('No tienes suficiente oro', 'warn'); return; } P.gold -= pr; P.furn.push(f); toast('Comprado: ' + FURN_CAT[f].n, 'loot'); } cfg.f[decSlot] = f; } sfx('equip'); rebuildHome(); markDirty(true); openDecor(); });
}
// ---------- storage chest (shared by all your houses) ----------
function openStorage() {
  const P = G.P; P.store = P.store || [];
  const cell = (s, i, from) => { const it = ITEMS[s.id]; return `<button class="srow" data-mv="${from}:${i}">${iconHTML(it.icon, 24)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${s.up ? '+' + s.up + ' ' : ''}${esc(it.n)}</b><small>${s.q > 1 ? '×' + s.q : ''}</small></div></button>`; };
  openModal(`<h2>Baúl de la casa</h2><p class="hint">Toca un objeto para moverlo. El baúl es el mismo en todas tus casas (máx. 80).</p><div class="upwrap"><div><h3>Mochila ${P.inv.length}/${INV_MAX}</h3><div class="slist">${P.inv.map((s, i) => cell(s, i, 'i')).join('') || '<p class="hint">Vacía</p>'}</div></div><div><h3>Baúl ${P.store.length}/80</h3><div class="slist">${P.store.map((s, i) => cell(s, i, 's')).join('') || '<p class="hint">Vacío</p>'}</div></div></div><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
  $$('[data-mv]').forEach(b => b.onclick = () => { const [from, i] = b.dataset.mv.split(':'); const src = from === 'i' ? P.inv : P.store, dst = from === 'i' ? P.store : P.inv, cap = from === 'i' ? 80 : INV_MAX; const s = src[+i]; if (!s) return;
    const it = ITEMS[s.id]; const same = it.stack ? dst.find(d => d.id === s.id) : null;
    if (same) same.q = (same.q || 1) + (s.q || 1); else { if (dst.length >= cap) { toast(from === 'i' ? 'El baúl está lleno' : 'Inventario lleno', 'warn'); return; } dst.push(s); }
    src.splice(+i, 1); sfx('pickup'); uiDirty.inv = true; markDirty(true); openStorage(); });
}
// ---------- sleeping ----------
function sleepHome() {
  const P = G.P; closeDialog(); transition(() => { P.hp = P.S.maxhp; P.mp = P.S.maxmp; P.poison = P.burn = 0; G.time = 7 * 60; toast('Has dormido hasta la mañana. Vida y maná al máximo', 'quest');
    if (P.partner) { const R = rel(P.partner), now = Date.now(); if (now - (R.cs || 0) > 600000) { R.cs = now; addRel(P.partner, 10, 15, P.x, P.y - 30, true); toast('Has dormido junto a ' + NPCS[P.partner].n.split(' ')[0] + ' ♥', 'loot'); } }
    saveGame(true); uiDirty.hud = true; });
}
const FURN_ACT = {
  salesign: ['Comprar casa', 'coin', () => openBuyHouse(G.P.inside)],
  desk: ['Decorar', 'house', () => openDecor()],
  chest: ['Baúl', 'bag', () => openStorage()],
  cribbaby: ['Cuidar al bebé', 'heart', () => { const P = G.P, k = (P.kids || []).find(q => kidStage(q) === 0); if (!k) return; const d = KID_STAGES[1][1] - (calDay() - k.born); for (let i = 0; i < 6; i++) setTimeout(() => floatText(P.x + (Math.random() - 0.5) * 20, P.y - 34, '♥', '#ff7ab0', true), i * 120); sfx('quest'); toast(k.name + ' sonríe y te agarra el dedo. Crecerá en ' + d + ' día' + (d === 1 ? '' : 's') + ' ♥', 'loot', 4); if (P.partner) addRel(P.partner, 2, 2, P.x, P.y - 40, true); }],
  wardrobe: ['Armario', 'hanger', () => { wdMode = 'cos'; openPanel('wardrobe'); }],
  mirror: ['Espejo', 'hanger', () => { wdMode = 'style'; openPanel('wardrobe'); }],
};
