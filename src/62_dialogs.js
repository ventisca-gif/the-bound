// ================= DIALOGS, SHOPS, CRAFTING, TRAVEL, FISHING UI =================
let dlg = null; const DLG_HOOKS = [];
function openDialog(npc) {
  const P = G.P; closePanel(); questEvent('talk', { npc: npc.id }); dlg = { npc, page: null };
  $('#dialog').hidden = false; G.paused = true; drawPortrait($('#dport'), npc.atlas);
  $('#dname').textContent = npc.def.n; $('#dtitle').textContent = npc.def.title || '';
  for (const id in P.quests.active) { const Q = QD(id); if (!Q.board && questReady(id) && sameNpc(turnInNpc(Q), npc.id) && Q.obj.length === 1 && Q.obj[0].t === 'talk') { showLines(Q.done, () => { completeQuest(id); dialogMenu(); }); return; } }
  dialogMenu(npc.def.lines[Math.floor(Math.random() * npc.def.lines.length)]);
  sfx('talk');
}
function closeDialog() { if ($('#dialog').hidden) return; $('#dialog').hidden = true; dlg = null; G.paused = !$('#panel').hidden || !$('#modal').hidden; }
let typeTimer = null;
function typeText(s, cb) { const el = $('#dmsg'); clearInterval(typeTimer); let i = 0; el.textContent = ''; const full = s; el.onclick = () => { clearInterval(typeTimer); el.textContent = full; cb && cb(); el.onclick = null; }; typeTimer = setInterval(() => { i += 2; el.textContent = full.slice(0, i); if (i >= full.length) { clearInterval(typeTimer); el.onclick = null; cb && cb(); } }, 18); }
function setOpts(opts) { $('#dopts').innerHTML = opts.map((o, i) => `<button class="dopt ${o.cls || ''}" data-i="${i}">${o.icon ? iconHTML(o.icon, 18) : ''}<span>${o.label}</span></button>`).join(''); $$('#dopts .dopt').forEach(b => b.onclick = () => { sfx('ui'); opts[+b.dataset.i].fn(); }); }
function showLines(lines, done) { let k = 0; const next = () => { if (k >= lines.length) { done(); return; } const line = lines[k++]; setOpts([]); typeText(line, () => setOpts([{ label: k < lines.length ? 'Continuar ›' : 'Continuar ›', fn: next }])); }; next(); }
function dialogMenu(greet) {
  const P = G.P, npc = dlg.npc, def = npc.def, opts = [];
  for (const id in P.quests.active) { const Q = QD(id); if (!Q.board && questReady(id) && sameNpc(turnInNpc(Q), npc.id)) opts.push({ label: '<b class="q">?</b> Completar: ' + esc(Q.n), cls: 'quest', fn: () => showLines(Q.done || ['¡Bien hecho!'], () => { completeQuest(id); dialogMenu(); }) }); }
  for (const id of (def.quests || [])) if (canOffer(id)) { const Q = QUESTS[id]; opts.push({ label: '<b class="q">!</b> ' + esc(Q.n) + (Q.main ? ' <i>(historia)</i>' : ''), cls: 'quest', fn: () => showLines(Q.offer, () => offerQuest(id)) }); }
  for (const id in P.quests.active) { const Q = QD(id); if (!Q.board && !questReady(id) && sameNpc(turnInNpc(Q), npc.id) && Q.prog) opts.push({ label: '… ' + esc(Q.n), fn: () => showLines(Q.prog, () => dialogMenu()) }); }
  const town = P.inside ? townOfInterior(P.inside) : 'albor';
  if (def.shop === 'store') { opts.push({ label: 'Comprar', icon: ['coin'], fn: () => openShop('store', town) }); opts.push({ label: 'Vender', icon: ['bag'], fn: () => openShop('sell', town) }); }
  if (def.shop === 'smith') { opts.push({ label: 'Forjar armas y armaduras', icon: ['anvil'], fn: () => openCraft('herreria', town) }); opts.push({ label: 'Mejorar equipo (+1 a +10)', icon: ['stone', '#8ad0ff'], fn: () => openUpgrade() }); opts.push({ label: 'Vender', icon: ['bag'], fn: () => openShop('sell', town) }); }
  if (def.shop === 'tailor') { opts.push({ label: 'Confeccionar (Sastrería)', icon: ['needle', 2], fn: () => openCraft('sastreria', town) }); opts.push({ label: 'Comprar cosméticos', icon: ['hanger'], fn: () => openShop('cos', town) }); opts.push({ label: 'Vender', icon: ['bag'], fn: () => openShop('sell', town) }); }
  if (def.shop === 'jeweler') { opts.push({ label: 'Engastar joyas (Joyería)', icon: ['gem', '#e0203a'], fn: () => openCraft('joyeria', town) }); opts.push({ label: 'Comprar gemas', icon: ['coin'], fn: () => openShop('gems', town) }); opts.push({ label: 'Vender', icon: ['bag'], fn: () => openShop('sell', town) }); }
  if (def.shop === 'farm') { opts.push({ label: 'Comprar semillas', icon: ['seed', 2], fn: () => openShop('seeds', town) }); opts.push({ label: '¿Cómo funciona el huerto?', icon: ['talk'], fn: () => typeText('Compra semillas y plántalas en los huertos de la granja con el botón de acción. Crecen aunque no estés: vuelve cuando estén maduras y cosecha. Con la cosecha se cocinan platos muy buenos.') }); }
  if (def.shop === 'alchemy') { opts.push({ label: 'Preparar pociones', icon: ['potion', '#c040e0'], fn: () => openCraft('alquimia', town) }); opts.push({ label: 'Comprar', icon: ['coin'], fn: () => openShop('alchemy', town) }); opts.push({ label: 'Vender', icon: ['bag'], fn: () => openShop('sell', town) }); }
  if (def.shop === 'inn') { const cost = { albor: 10, puerto: 25, arxar: 60, sahrim: 150, yarakai: 180 }[town] || 20; opts.push({ label: `Descansar (${cost} oro)`, icon: ['heart', '#e84050'], fn: () => { if (P.gold < cost) { typeText('No tienes suficiente oro.'); return; } P.gold -= cost; P.hp = P.S.maxhp; P.mp = P.S.maxmp; P.poison = P.burn = 0; saveGame(true); sfx('level'); typeText('Has descansado. Vida y maná restaurados. Partida guardada.'); uiDirty.hud = true; } }); opts.push({ label: 'Cocinar', icon: ['food', 2], fn: () => openCraft('cocina', town) }); opts.push({ label: 'Comprar comida', icon: ['coin'], fn: () => openShop('inn', town) }); }
  if (def.shop === 'guild') opts.push({ label: 'Tablón de encargos', icon: ['board'], fn: () => openBoard() });
  if (npc.id === 'mira' && (P.quests.active.q1 || P.quests.done.q1) && missingTools().length) opts.push({ label: 'Pedir herramientas de oficio', icon: ['axe', 2], fn: () => { const miss = missingTools(); let ok = 0; for (const id of miss) if (giveItem(id, 1)) ok++; typeText(ok ? 'Toma, y cuídalas bien. Con el hacha talas árboles, con la caña pescas y con el pico sacas mineral.' : 'Tu mochila está llena. Haz espacio y vuelve.'); markDirty(true); } });
  if (npc.id === 'marina' && (P.quests.done.q12 || P.quests.active.q13 || P.quests.done.q13)) opts.push({ label: 'Zarpar a la Isla de Nhar', icon: ['ways'], fn: () => { closeDialog(); shipTo('nhar'); } });
  if (npc.id === 'marina_nhar') opts.push({ label: 'Volver a Puerto Coral', icon: ['ways'], fn: () => { closeDialog(); shipTo('puerto'); } });
  if (npc.id === 'marina' && (P.lv >= 95 || P.quests.active.q15 || P.quests.done.q15)) opts.push({ label: 'Zarpar a Sahrim', icon: ['ways'], fn: () => { closeDialog(); shipTo('sahrim'); } });
  if (npc.id === 'navegante') opts.push({ label: 'Volver a Puerto Coral', icon: ['ways'], fn: () => { closeDialog(); shipTo('puerto'); } });
  if (ROM[relKey(npc.id)]) opts.push({ label: 'Relación ♥', icon: ['heart', '#ff5a8a'], cls: 'romo', fn: () => romanceMenu(npc) });
  for (const h of DLG_HOOKS) h(npc, opts);
  opts.push({ label: 'Charlar', icon: ['talk'], fn: () => typeText(def.lines[Math.floor(Math.random() * def.lines.length)]) });
  opts.push({ label: 'Adiós', fn: closeDialog, cls: 'bye' });
  setOpts(opts); if (greet) typeText(greet); else typeText('¿Algo más?');
}
function rewardsHTML(R) { return `${R.xp ? `<span>${fmt(R.xp)} XP</span>` : ''}${R.gold ? `<span>${iconHTML(['coin'], 14)} ${fmt(R.gold)}</span>` : ''}${(R.items || []).map(([id, n]) => `<span>${iconHTML(ITEMS[id].icon, 16)} ${esc(ITEMS[id].n)}${n > 1 ? ' ×' + n : ''}</span>`).join('')}`; }
function offerQuest(id) {
  const Q = QUESTS[id], giv = (Q.give || []).filter(([gid]) => !(ITEMS[gid].t === 'tool' && bestTool(ITEMS[gid].tool))); $('#dmsg').innerHTML = `<b class="qt">${esc(Q.n)}</b><br>${esc(Q.desc)}${giv.length ? `<span class="rew give"><i>Recibes ahora:</i> ${rewardsHTML({ items: giv })}</span>` : ''}<span class="rew">${rewardsHTML(Q.rew)}</span>`; $('#dmsg').onclick = null; clearInterval(typeTimer);
  setOpts([{ label: 'Aceptar misión', cls: 'gold', fn: () => { acceptQuest(id); dialogMenu('¡Cuento contigo!'); } }, { label: 'Ahora no', fn: () => dialogMenu() }]);
}
// ---------- modal ----------
function openModal(html, cls) { const m = $('#modal'); m.hidden = false; m.className = 'modal ' + (cls || ''); $('#mbody').innerHTML = html; G.paused = true; }
function closeModal() { $('#modal').hidden = true; G.paused = !$('#panel').hidden || !$('#dialog').hidden; }
// ---------- shops ----------
let shopState = { kind: 'store', town: 'albor', sel: null, confirm: null };
function openShop(kind, town) { shopState = { kind, town, sel: null, confirm: null }; renderShop(); }
function renderShop() {
  const bp = it => Math.max(1, Math.round(it.price * (shopState.kind === 'sell' ? 1 : townPriceMul(shopState.town))));
  const P = G.P, S = shopState; let rows = '';
  if (S.kind === 'sell') {
    rows = P.inv.map((s, i) => { const it = ITEMS[s.id]; if (it.t === 'quest') return ''; const pr = Math.max(1, Math.floor(it.price * 0.4)); return `<div class="srow">${iconHTML(it.icon, 28)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${esc(it.n)}</b><small>${s.q > 1 ? '×' + s.q + ' · ' : ''}${pr} oro c/u</small></div><button class="btn sm" data-sell="${i}" data-n="1">Vender 1</button>${s.q > 1 ? `<button class="btn sm" data-sell="${i}" data-n="${s.q}">Todo</button>` : ''}</div>`; }).join('') || '<p class="hint">No tienes nada que vender.</p>';
  } else {
    const list = (SHOPS[S.kind] && SHOPS[S.kind][S.town]) || SHOPS.store.albor;
    rows = list.map(id => { const it = ITEMS[id]; const why = it.cls && it.cls !== P.cls ? 'Otra clase' : (it.lv || 1) > P.lv ? 'Nv. ' + it.lv : ''; return `<div class="srow ${why ? 'dim' : ''}">${iconHTML(it.icon, 28)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${esc(it.n)}</b><small>${typeName(it)}${why ? ' · ' + why : ''}</small></div><button class="btn sm gold" data-buy="${id}">${S.confirm === id ? 'Confirmar' : iconHTML(['coin'], 12) + ' ' + fmt(bp(it))}</button></div>`; }).join('');
  }
  openModal(`<h2>${S.kind === 'sell' ? 'Vender' : 'Tienda'}</h2><div class="goldline">${iconHTML(['coin'], 16)} ${fmt(P.gold)} oro</div><div class="slist">${rows}</div><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'shop');
  $$('[data-buy]').forEach(b => b.onclick = () => { const id = b.dataset.buy, it = ITEMS[id]; if (S.confirm !== id) { S.confirm = id; renderShop(); return; } if (P.gold < bp(it)) { toast('No tienes suficiente oro', 'warn'); S.confirm = null; renderShop(); return; } if (giveItem(id, 1)) { P.gold -= bp(it); sfx('coin'); } S.confirm = null; renderShop(); });
  $$('[data-sell]').forEach(b => b.onclick = () => { const i = +b.dataset.sell, n = +b.dataset.n, s = P.inv[i]; if (!s) return; const it = ITEMS[s.id]; const pr = Math.max(1, Math.floor(it.price * 0.4)) * n; if (it.stack) { s.q -= n; if (s.q <= 0) P.inv.splice(i, 1); } else P.inv.splice(i, 1); P.gold += pr; sfx('coin'); uiDirty.inv = true; renderShop(); });
  $('#mclose').onclick = () => { closeModal(); };
}
// ---------- crafting ----------
let craftState = { job: 'herreria', town: 'albor', cat: 'mine' };
function openCraft(job, town) { craftState = { job, town, cat: job === 'herreria' ? 'mine' : 'all' }; renderCraft(); }
function craftCheck(r) { const P = G.P; if (P.lv < r.lv) return 'Requiere nivel ' + r.lv; if (P.jobs[r.job].lv < r.jlv) return 'Requiere ' + JOBS[r.job].n + ' ' + r.jlv; if (P.gold < r.gold) return 'Oro insuficiente'; for (const [id, n] of matsFor(r)) if (countItem(id) < n) return 'Faltan materiales'; return null; }
function matsFor(r) { if (r.alt) { const have = r.alt.find(id => countItem(id) >= r.mats[0][1]); if (have) return [[have, r.mats[0][1]]].concat(r.mats.slice(1)); } return r.mats; }
function doCraft(r) { const why = craftCheck(r); if (why) { toast(why, 'warn'); return; } const P = G.P; for (const [id, n] of matsFor(r)) takeItem(id, n); P.gold -= r.gold; giveItem(r.out, r.n); const t = ITEMS[r.out].tier || 1; gainJobXp(r.job, Math.round(15 + Math.pow(t, 1.6) * 12)); questEvent('craft', { it: r.out }); sfx(r.job === 'herreria' ? 'forge' : 'potion'); burst(P.x, P.y - 14, 14, { sp: 50, up: 40, g: 80, life: 0.6, c: ['#ffd040', '#ffffff', '#ff8a2a'] }); markDirty(); }
function renderCraft() {
  const P = G.P, S = craftState; const maxT = S.job === 'herreria' ? (SHOPS.smith[S.town] || 4) : 99;
  let list = RECIPES.filter(r => r.job === S.job && (ITEMS[r.out].tier || 1) <= maxT);
  const cats = S.job === 'herreria' ? [['mine', 'Mi clase'], ['armadura', 'Armaduras'], ['herramienta', 'Herramientas'], ['accesorio', 'Accesorios'], ['arma', 'Otras armas']] : [['all', 'Todo']];
  if (S.job === 'herreria') list = list.filter(r => S.cat === 'mine' ? r.cat === 'arma' && r.cls === P.cls : S.cat === 'arma' ? r.cat === 'arma' && r.cls !== P.cls : r.cat === S.cat);
  const rows = list.map(r => { const it = ITEMS[r.out], why = craftCheck(r); const mats = matsFor(r).map(([id, n]) => `<span class="${countItem(id) >= n ? 'ok' : 'bad'}">${iconHTML(ITEMS[id].icon, 14)} ${countItem(id)}/${n}</span>`).join('');
    return `<div class="crow ${why ? 'dim' : ''}">${iconHTML(it.icon, 32)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${esc(it.n)}${r.n > 1 ? ' ×' + r.n : ''}</b><small>${itemStatsHTML(it).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}</small><div class="mats"><span class="${P.lv >= r.lv ? 'ok' : 'bad'}">Nv. ${r.lv}</span>${r.jlv > 1 ? `<span class="${P.jobs[r.job].lv >= r.jlv ? 'ok' : 'bad'}">${JOBS[r.job].n} ${r.jlv}</span>` : ''}<span class="${P.gold >= r.gold ? 'ok' : 'bad'}">${iconHTML(['coin'], 12)} ${fmt(r.gold)}</span>${mats}</div></div><button class="btn sm gold" data-craft="${r.id}" ${why ? 'disabled' : ''}>${({ herreria: 'Forjar', cocina: 'Cocinar', joyeria: 'Engastar', sastreria: 'Coser' }[S.job] || 'Preparar')}</button></div>`; }).join('') || '<p class="hint">Nada disponible aquí.</p>';
  const title = { herreria: 'Forja', alquimia: 'Alquimia', cocina: 'Cocina', joyeria: 'Joyería', sastreria: 'Sastrería' }[S.job];
  openModal(`<h2>${title} <span class="pill">${JOBS[S.job].n} Nv. ${P.jobs[S.job].lv}</span></h2>${S.job === 'herreria' ? `<p class="hint">Esta herrería forja hasta el nivel de material ${maxT}. ${maxT < 11 ? 'Las ciudades más grandes forjan equipo mejor.' : ''}</p>` : ''}<div class="chips">${cats.length > 1 ? cats.map(([k, n]) => `<button class="chip ${S.cat === k ? 'on' : ''}" data-c="${k}">${n}</button>`).join('') : ''}</div><div class="goldline">${iconHTML(['coin'], 16)} ${fmt(P.gold)} oro</div><div class="slist">${rows}</div><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'craft');
  $$('[data-c]').forEach(b => b.onclick = () => { S.cat = b.dataset.c; renderCraft(); });
  $$('[data-craft]').forEach(b => b.onclick = () => { doCraft(RECIPES.find(r => r.id === b.dataset.craft)); renderCraft(); });
  $('#mclose').onclick = () => closeModal();
}
// ---------- travel & board ----------
function openTravel() {
  const P = G.P; const rows = WAYSTONES.map(w => { const on = P.ws[w.k]; return `<button class="trow ${on ? '' : 'dim'}" data-w="${w.k}" ${on ? '' : 'disabled'}>${iconHTML(['ways'], 24)}<div class="sn"><b>${esc(w.n)}</b><small>${on ? 'Activada' : 'Sin descubrir'}</small></div></button>`; }).join('');
  openModal(`<h2>Piedras de viaje</h2><p class="hint">Viaja al instante a cualquier piedra que hayas activado.</p><div class="slist">${rows}</div><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'travel');
  $$('[data-w]').forEach(b => b.onclick = () => { closeModal(); travelTo(b.dataset.w); });
  $('#mclose').onclick = () => closeModal();
}
function openBoard() {
  const P = G.P; closeDialog(); if (!P.board.list || (!P.board.list.length && G.t > (P.board.next || 0))) { P.board.seed++; P.board.list = boardQuests(P.lv, P.board.seed); }
  const rows = P.board.list.map((q, i) => `<div class="crow">${iconHTML(['board'], 28)}<div class="sn"><b>${esc(q.n)}</b><small>${esc(objText(Object.assign({}, q, { id: '__' }), 0).replace(/\s*\(0\/\d+\)/, ' ×' + (q.obj[0].n || 1)))}</small><div class="rew">${rewardsHTML(q.rew)}</div></div><button class="btn sm gold" data-acc="${i}">Aceptar</button></div>`).join('') || '<p class="hint">No hay encargos. Vuelve más tarde.</p>';
  const act = Object.keys(P.quests.active).filter(k => QD(k).board).length;
  openModal(`<h2>Tablón del Gremio</h2><p class="hint">Encargos repetibles adaptados a tu nivel. Tienes ${act} en curso. Entrégalos hablando con Kael.</p><div class="slist">${rows}</div><div class="row"><button class="btn" id="bnew">Nuevos encargos</button><button class="btn" id="mclose">Cerrar</button></div>`, 'board');
  $$('[data-acc]').forEach(b => b.onclick = () => { const q = P.board.list.splice(+b.dataset.acc, 1)[0]; q.turnin = 'kael'; acceptQuest(q.id, q); if (!P.board.list.length) P.board.next = G.t + 120; openBoard(); });
  $('#bnew').onclick = () => { P.board.seed++; P.board.list = boardQuests(P.lv, P.board.seed); openBoard(); };
  $('#mclose').onclick = () => closeModal();
}
// ---------- fishing reel ----------
const reel = { on: false, hold: false };
function startReel(fish) { Object.assign(reel, { on: true, hold: false, zone: 0.35, zv: 0, zh: 0.3 - fish[2] * 0.015 + bestTool('pesca') * 0.02, fish: 0.5, fv: 0, ft: 0, prog: 0.3, tier: fish[2], f: fish }); const el = $('#reel'); el.hidden = false; el.querySelector('.fishi').innerHTML = iconHTML(ITEMS[fish[0]].icon, 22); }
function hideReel() { reel.on = false; $('#reel').hidden = true; }
function updateReel(dt) {
  if (!reel.on) return; const R = reel; R.zv += (R.hold ? 2.6 : -2.2) * dt; R.zv *= 0.9; R.zone = clamp(R.zone + R.zv * dt * 2.2, 0, 1 - R.zh); if (R.zone <= 0 || R.zone >= 1 - R.zh) R.zv *= -0.3;
  R.ft -= dt; if (R.ft <= 0) { R.ft = 0.4 + Math.random() * (1.4 - R.tier * 0.12); R.target = Math.random(); } R.fish += ((R.target || 0.5) - R.fish) * dt * (1.2 + R.tier * 0.45); R.fish = clamp(R.fish, 0.02, 0.98);
  const inZone = R.fish >= R.zone && R.fish <= R.zone + R.zh; R.prog += (inZone ? 0.42 : -0.26 - R.tier * 0.02) * dt;
  const el = $('#reel'); el.querySelector('.zone').style.cssText = `bottom:${(R.zone * 100).toFixed(1)}%;height:${(R.zh * 100).toFixed(1)}%`; el.querySelector('.fishi').style.bottom = `calc(${(R.fish * 100).toFixed(1)}% - 11px)`; el.querySelector('.prog i').style.height = (clamp(R.prog, 0, 1) * 100) + '%'; el.classList.toggle('in', inZone);
  if (R.prog >= 1) { const f = R.f; hideReel(); fishCaught(f); } else if (R.prog <= 0) { hideReel(); toast('¡Se escapó!', 'warn'); stopFishing(); }
}
// ---------- death & ending ----------
function showDeath() { const P = G.P; const town = TOWNS.find(t => t.k === (P.lastTown || 'albor')); openModal(`<div class="death"><h1>Has caído</h1><p>La marca del Vínculo te devuelve a la vida... pero algo de tu experiencia se pierde en el camino.</p><button class="btn gold big" id="rev">Revivir en ${esc(town ? town.n : 'Aldea Albor')}</button></div>`, 'deathm'); $('#rev').onclick = () => { closeModal(); revive(); }; }
function showEnding(ch2) { const P = G.P; openModal(`<div class="ending"><h1>The Bound</h1>${ch2 ? '<p>El Señor del Eclipse cae y su sombra se deshace en mil estrellas. Sobre Sahrim, por primera vez en mil años, amanece.</p><p>Los dos continentes celebran al guardián que cerró el sello y apagó el eclipse. El Vínculo está completo.</p><p class="hint">Fin del Capítulo II. Sigue mejorando tu equipo hasta +10, completa el bestiario y reúne todos los cosméticos de los jefes.</p>' : '<p>Los siete fragmentos brillan en tus manos. El Desatado se desvanece entre cadenas de luz y el sello se cierra para siempre.</p><p>Desde hoy, la marca de tu mano ya no es una carga: es una promesa. Eres el nuevo guardián del Vínculo.</p><p class="hint">Fin del Capítulo I. Pero al este del mar, un eclipse que no termina cubre el continente de Sahrim... Habla con la Capitana Marina al llegar al nivel 95.</p>'}<div class="stats">${statLine('Nivel', P.lv)}${statLine('Enemigos derrotados', fmt(P.stats.kills || 0))}${statLine('Caídas', P.stats.deaths || 0)}</div><button class="btn gold big" id="endok">Seguir jugando</button></div>`, 'endm'); $('#endok').onclick = () => closeModal(); }
// ---------- chat ----------
function openChat() { if (!netOnline()) { toast('El chat necesita conexión multijugador', 'warn'); return; } const box = $('#chatbox'); box.hidden = false; const i = $('#chatin'); i.value = ''; i.focus(); }
function sendChat() { const i = $('#chatin'); const t = i.value.replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁠-⁯]/g, '').trim().slice(0, 80); $('#chatbox').hidden = true; i.blur(); if (!t) return; netChat(t); }
function chatLog(name, text, me) { const el = $('#chatlog'); const d = document.createElement('div'); d.className = 'cl' + (me ? ' me' : ''); d.innerHTML = `<b>${esc(name)}:</b> ${esc(text)}`; el.appendChild(d); while (el.children.length > 6) el.removeChild(el.firstChild); setTimeout(() => d.classList.add('fade'), 9000); }
