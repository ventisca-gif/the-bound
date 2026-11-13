// ================= NEW JOBS (farming, excavation) & GEAR UPGRADES =================
// ---------- farming ----------
function plotState(o) {
  const P = G.P, F = P && P.farm ? P.farm[o.pid] : null; if (!F) return { st: 0 };
  const sd = ITEMS['sem_' + F.c], g = (sd ? sd.grow : 120) / cropEventMul(), el = (Date.now() - F.t) / 1000;
  return { st: el >= g ? 3 : el >= g * 0.45 ? 2 : 1, F, left: Math.max(0, g - el) };
}
function fmtTime(s) { s = Math.ceil(s); return s >= 60 ? Math.floor(s / 60) + ' min ' + (s % 60) + ' s' : s + ' s'; }
function farmAction(o) {
  const P = G.P, S = plotState(o);
  if (S.st === 3) {
    const c = S.F.c, it = ITEMS[c], n = 2 + (Math.random() < 0.4 + P.jobs.agricultura.lv * 0.008 ? 2 : 1) + (perk('agricultura', 15) && Math.random() < 0.3 ? 1 : 0);
    giveItem(c, n); if (Math.random() < 0.35 + (perk('agricultura', 35) ? 0.15 : 0)) giveItem('sem_' + c, 1, true); delete P.farm[o.pid];
    gainJobXp('agricultura', 12 + it.tier * 14); questEvent('job', { job: 'agricultura', tier: it.tier, n: 1 });
    setAnim(P, 'gather'); P.busy = 0.5; burst(o.px, o.py - 6, 12, { sp: 40, up: 40, g: 80, life: 0.6, c: [uCss(C(it.icon[1])), '#8ad050', '#ffffff'] }); sfx('pickup'); markDirty(true); return;
  }
  if (S.st > 0) { toast(ITEMS[S.F.c].n + ': lista en ' + fmtTime(S.left), 'info'); return; }
  const seeds = P.inv.filter(s => ITEMS[s.id].seed).map(s => ITEMS[s.id]).sort((a, b) => b.tier - a.tier);
  if (!seeds.length) { toast('Necesitas semillas: cómpralas a Hugo el granjero', 'warn'); return; }
  const ok = seeds.find(sd => P.jobs.agricultura.lv >= RESLV[sd.tier]);
  if (!ok) { toast('Requiere Agricultura nivel ' + RESLV[seeds[seeds.length - 1].tier], 'warn'); return; }
  takeItem(ok.id, 1); P.farm[o.pid] = { c: ok.seed, t: Date.now() }; gainJobXp('agricultura', 5 + ok.tier * 5);
  P.dir = dirFromVec(o.px - P.x, o.py - 6 - P.y); setAnim(P, 'gather'); P.busy = 0.5; sfx('pickup'); toast('Plantado: ' + ITEMS[ok.seed].n + ' (' + fmtTime(ok.grow) + ')', 'job'); markDirty(true);
}
function genPlot(st, crop) {
  const p = new Pix(18, 14), soil = pal(['#2a1a0e', '#3e2814', '#54381e', '#6e4a2a']);
  p.ell(9, 8, 8.5, 5, soil[1]); p.ell(9, 7, 7.5, 4, soil[2]); for (let x = 3; x < 16; x += 3) p.vl(x, 5, 4, soil[3]);
  const cc = crop && ITEMS[crop] ? C(ITEMS[crop].icon[1]) : C('#8ad050'), lf = pal(['#1a4a14', '#2e7a22', '#4aa836', '#8ad050']);
  if (st >= 1) for (const x of [5, 9, 13]) { p.vl(x, 6 - st, st + 1, lf[2]); p.set(x - 1, 5 - st, lf[3]); p.set(x + 1, 5 - st, lf[3]); }
  if (st >= 2) for (const x of [5, 9, 13]) { p.set(x - 2, 3, lf[1]); p.set(x + 2, 3, lf[1]); p.set(x, 1, lf[3]); }
  if (st >= 3) for (const x of [5, 9, 13]) p.ball(x, 3, 2, 1.8, [uMul(cc, 0.6), cc, uMix(cc, C('#ffffff'), 0.4)]);
  p.outline(OUTL, false); return { c: p.canvas(), ax: 9, ay: 10 };
}
// ---------- excavation ----------
function genMound(tier) {
  const p = new Pix(18, 12), d = pal(['#2a1a0e', '#4a3018', '#6a4a26', '#8a6436', '#a87e48']);
  p.ball(9, 8, 7.5, 4.5, d.slice(1)); for (let k = 0; k < 6; k++) p.set(4 + k * 2, 6 + (k % 2), d[0]); p.set(7, 4, C('#fff4c0')); if (tier >= 6) p.set(12, 5, C('#a0e0ff'));
  p.outline(OUTL, false); return { c: p.canvas(), ax: 9, ay: 9 };
}
function digLoot(tier) {
  const tbl = DIG_LOOT[tier <= 2 ? 0 : tier <= 5 ? 1 : tier <= 8 ? 2 : 3][1];
  const ws = tbl.map(([id, w]) => ({ id, w })); const pick = choiceW(new RNG((Math.random() * 1e9) | 0), ws).id;
  return pick;
}
function finishDig(J) {
  const P = G.P, o = J.o; o.hidden = true; o.respawn = G.t + 90;
  const id = digLoot(J.tier); giveItem(id, id === 'moneda_antigua' ? 1 + ((Math.random() * 3) | 0) : 1); lootFx(o.px, o.py, id);
  if (Math.random() < 0.006 + P.jobs.excavacion.lv * 0.0002) { const pool = Object.keys(COSM).filter(c => !(P.wardrobe || []).includes(c) && COS_SHOP.includes(c)); if (pool.length) giveCosmetic(pool[(Math.random() * pool.length) | 0]); }
  if (Math.random() < 0.12) { const g = 5 + J.tier * J.tier * 6; P.gold += g; floatText(P.x, P.y - 40, '+' + g + ' ORO', '#ffd040'); }
  gainJobXp('excavacion', 12 + J.tier * 12); questEvent('job', { job: 'excavacion', tier: J.tier, n: 1 });
  burst(o.px, o.py - 4, 12, { sp: 60, up: 50, g: 140, life: 0.6, c: ['#8a6436', '#6a4a26', '#ffe08a'] }); sfx('pickup'); markDirty();
}
// ---------- gear upgrades (+1 .. +10) at the smithy ----------
const UP_CHANCE = [100, 95, 90, 80, 70, 60, 50, 40, 30, 20];
function upCost(it, up) { const stone = up < 4 ? 'piedra1' : up < 7 ? 'piedra2' : 'piedra3'; return { stone, n: up < 4 ? up + 1 : up < 7 ? up - 2 : up - 5, gold: Math.round((40 + (it.lv || 1) * 22) * (up + 1)) }; }
let upSel = null;
function openUpgrade() {
  const P = G.P, list = [];
  for (const sl of ['weapon', 'head', 'body', 'legs', 'feet', 'acc', 'neck']) if (P.equip[sl]) list.push({ ref: P.equip[sl], key: 'e:' + sl, eq: true });
  P.inv.forEach((s, i) => { if (ITEMS[s.id].slot) list.push({ ref: s, key: 'i:' + i }); });
  if (!upSel || !list.find(x => x.key === upSel)) upSel = list[0] && list[0].key;
  const cur = list.find(x => x.key === upSel);
  const rows = list.map(x => { const it = ITEMS[x.ref.id]; return `<button class="srow upr ${upSel === x.key ? 'sel' : ''}" data-up="${x.key}">${iconHTML(it.icon, 28)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${x.ref.up ? '+' + x.ref.up + ' ' : ''}${esc(it.n)}</b><small>${x.eq ? 'Equipado' : 'Mochila'}</small></div></button>`; }).join('') || '<p class="hint">No tienes equipo para mejorar.</p>';
  let det = '';
  if (cur) { const it = ITEMS[cur.ref.id], up = cur.ref.up || 0;
    if (up >= 10) det = `<p class="hint"><b>${esc(it.n)}</b> ya está en +10, el máximo.</p>`;
    else { const c = upCost(it, up), have = countItem(c.stone), k0 = 1 + 0.08 * up, k1 = 1 + 0.08 * (up + 1); const st = ['atk', 'def', 'hpB', 'mpB'].filter(s => it[s]).map(s => `<span>${{ atk: 'Ataque', def: 'Defensa', hpB: 'Vida', mpB: 'Maná' }[s]} ${Math.round(it[s] * k0)} → <b>${Math.round(it[s] * k1)}</b></span>`).join('');
      det = `<div class="upbox"><b>+${up} → +${up + 1}</b><div class="rew">${st}</div><div class="mats"><span class="${have >= c.n ? 'ok' : 'bad'}">${iconHTML(ITEMS[c.stone].icon, 14)} ${esc(ITEMS[c.stone].n)} ${have}/${c.n}</span><span class="${P.gold >= c.gold ? 'ok' : 'bad'}">${iconHTML(['coin'], 12)} ${fmt(c.gold)}</span><span>Éxito: <b>${UP_CHANCE[up]}%</b></span></div><p class="hint">Si falla, pierdes la piedra y el oro, pero el objeto no se rompe. Las piedras las sueltan los enemigos, se preparan en alquimia o salen al excavar.</p><button class="btn gold" id="doUp" ${have >= c.n && P.gold >= c.gold ? '' : 'disabled'}>Mejorar</button></div>`; } }
  openModal(`<h2>Mejorar equipo</h2><div class="goldline">${iconHTML(['coin'], 16)} ${fmt(P.gold)} oro</div><div class="upwrap"><div class="slist">${rows}</div><div>${det}</div></div><div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'shop');
  $$('[data-up]').forEach(b => b.onclick = () => { upSel = b.dataset.up; sfx('ui'); openUpgrade(); });
  const d = $('#doUp'); if (d) d.onclick = () => { const it = ITEMS[cur.ref.id], up = cur.ref.up || 0, c = upCost(it, up); if (countItem(c.stone) < c.n || P.gold < c.gold) return; takeItem(c.stone, c.n); P.gold -= c.gold;
    if (Math.random() * 100 < UP_CHANCE[up]) { cur.ref.up = up + 1; toast('¡Éxito! ' + it.n + ' +' + (up + 1), 'quest'); sfx('forge'); burst(P.x, P.y - 14, 20, { sp: 60, up: 50, g: 80, life: 0.7, c: ['#7ae0ff', '#ffffff', '#ffd040'] }); } else { toast('La mejora ha fallado...', 'warn'); sfx('hurt'); }
    calcStats(P); uiDirty.hud = uiDirty.inv = true; markDirty(true); openUpgrade(); };
  const m = $('#mclose'); if (m) m.onclick = closeModal;
}
