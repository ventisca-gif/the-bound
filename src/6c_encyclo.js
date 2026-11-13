// ================= ENCYCLOPEDIA: enemies + all gear, weapons, tools, accessories, NPCs (with where to get them) =================
let encTab = 'mobs', encCls = 'all', encSel = null, ITEM_SRC = null;
const SHOP_N = { smith: 'Herrería', store: 'Tienda', inn: 'Posada', alchemy: 'Alquimia', tailor: 'Sastrería', jeweler: 'Joyería', gems: 'Joyería', seeds: 'Granja', farm: 'Granja', cos: 'Tienda de cosméticos' };
const TOWN_N = { albor: 'Albor', puerto: 'Puerto Coral', arxar: 'Arxar', sahrim: 'Sahrim', yarakai: 'Yarakai', nhar: 'Isla de Nhar', wander: 'Mercader ambulante' };
function buildItemSources() {
  const S = {}; const add = (id, s) => { (S[id] = S[id] || []).push(s); };
  for (const r of RECIPES) add(r.out, (JOBS[r.job] ? JOBS[r.job].n : r.job) + ' nv. ' + r.jlv);
  for (const k in SHOPS) for (const t in SHOPS[k]) if (Array.isArray(SHOPS[k][t])) for (const id of SHOPS[k][t]) add(id, (SHOP_N[k] || 'Tienda') + ' de ' + (TOWN_N[t] || t));
  for (const m in MOBS) for (const [id] of MOBS[m].drops || []) add(id, 'Botín: ' + MOBS[m].n);
  for (const b in BOSSES) { for (const [id] of BOSSES[b].drops) add(id, 'Jefe: ' + BOSSES[b].n); if (BOSSES[b].acc) add(BOSSES[b].acc, 'Jefe: ' + BOSSES[b].n); }
  for (const id in QUESTS) for (const [i] of (QUESTS[id].rew.items || [])) add(i, 'Misión: ' + QUESTS[id].n);
  for (const id in S) S[id] = [...new Set(S[id])];
  return S;
}
function encGearList(kind) {
  return Object.values(ITEMS).filter(it => kind === 'armor' ? it.t === 'armor' : kind === 'weapons' ? it.t === 'weapon' : kind === 'tools' ? it.t === 'tool' : kind === 'acc' ? it.t === 'acc' : false)
    .filter(it => encCls === 'all' || !it.cls || it.cls === encCls).sort((a, b) => (a.lv || 0) - (b.lv || 0) || (a.slot || '').localeCompare(b.slot || ''));
}
function npcWhere(id) {
  for (const k in INT_NPC) if (INT_NPC[k] === id) { const tw = townOfInterior(k); return (k.split('_')[0].replace(/^\w/, c => c.toUpperCase())) + ' de ' + (TOWN_N[tw] || tw || 'la ciudad'); }
  const d = G.world.npcDefs.find(n => n.id === id); if (d) { const r = regionAt(d.x, d.y); return r ? r.n : 'el mundo'; }
  return typeof ROM_WHERE !== 'undefined' && ROM_WHERE[id] || 'Viaja por el mundo';
}
function renderEncyclo(B) {
  if (!ITEM_SRC) ITEM_SRC = buildItemSources();
  const tabs = [['mobs', 'Enemigos'], ['armor', 'Armaduras'], ['weapons', 'Armas'], ['tools', 'Herramientas'], ['acc', 'Accesorios'], ['npcs', 'Personajes']];
  const head = `<div class="chips enctabs">${tabs.map(([k, n]) => `<button class="chip ${encTab === k ? 'on' : ''}" data-enc="${k}">${n}</button>`).join('')}</div>`;
  if (encTab === 'mobs') { B.innerHTML = head + '<div id="encMobs"></div>'; renderBestiary($('#encMobs')); bindEnc(B); return; }
  let body = '';
  if (encTab === 'npcs') {
    const ids = Object.keys(NPCS).filter(id => id !== 'marina_nhar' && !/^guardia_x\d/.test(id) && NPCS[id].look);
    body = `<div class="enclist">${ids.map(id => { const N = NPCS[id], q = (N.quests || []).length, rom = typeof ROM !== 'undefined' && ROM[id];
      return `<div class="srow encnpc"><div class="sn"><b>${esc(N.n)} ${rom ? '<span class="pt">♥</span>' : ''}</b><small>${esc(N.title || '')} · ${esc(npcWhere(id))}</small><small class="sum">«${esc((N.lines || [''])[0])}»</small><small>${[N.shop ? (SHOP_N[N.shop] || 'Tienda') : '', q ? q + ' misión' + (q > 1 ? 'es' : '') : '', rom ? 'Se puede tener una relación' : ''].filter(Boolean).join(' · ') || 'Vecino'}</small></div></div>`; }).join('')}</div>`;
  } else {
    const list = encGearList(encTab), P = G.P;
    const clsChips = encTab === 'tools' ? '' : `<div class="chips">${[['all', 'Todas']].concat(Object.keys(CLASSES).map(c => [c, CLASSES[c].n])).map(([k, n]) => `<button class="chip ${encCls === k ? 'on' : ''}" data-ecls="${k}">${n}</button>`).join('')}</div>`;
    const sel = ITEMS[encSel] && list.includes(ITEMS[encSel]) ? ITEMS[encSel] : list[0];
    const have = id => countItem(id) || Object.values(P.equip).some(e => e && e.id === id);
    const rows = list.map(it => `<button class="srow ${sel === it ? 'sel' : ''}" data-eit="${it.id}">${iconHTML(it.icon, 26)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${esc(it.n)}${have(it.id) ? ' <span class="ok2">✔</span>' : ''}</b><small>${esc(typeName(it))} · Nv. ${it.lv || 1}</small></div></button>`).join('');
    const det = sel ? `<div class="frame encdet"><div class="ehead">${iconHTML(sel.icon, 40)}<div><b style="color:${RARC[sel.rar || 0]}">${esc(sel.n)}</b><small>${esc(typeName(sel))} · Nivel ${sel.lv || 1}${sel.tier ? ' · Rango ' + sel.tier : ''}</small></div></div><div class="stats">${itemStatsHTML(sel)}</div><h4>Cómo conseguirlo</h4>${(ITEM_SRC[sel.id] || ['Desconocido']).map(s => `<div class="src">${esc(s)}</div>`).join('')}</div>` : '';
    body = clsChips + `<div class="encwrap"><div class="slist">${rows}</div>${det}</div>`;
  }
  B.innerHTML = head + body; bindEnc(B);
}
function bindEnc(B) {
  $$('[data-enc]', B).forEach(b => b.onclick = () => { encTab = b.dataset.enc; encSel = null; sfx('ui'); renderPanel(); });
  $$('[data-ecls]', B).forEach(b => b.onclick = () => { encCls = b.dataset.ecls; encSel = null; sfx('ui'); renderPanel(); });
  $$('[data-eit]', B).forEach(b => b.onclick = () => { encSel = b.dataset.eit; sfx('ui'); renderPanel(); });
}
