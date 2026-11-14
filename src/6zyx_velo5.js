// ================= v4.22: LA LUPA LO GUÍA TODO, LOBO HÍBRIDO Y AGARRE DE SANGRE =================
// - La flecha dorada funciona en cualquier mapa (mundo, Velo Roto y Jardín de la Sonrisa) y, si el sitio está en otro
//   mapa, te lleva primero a la puerta o portal que toca (P.wp.m = mapa del destino).
// - Cada secreto de la pestaña 🗝 apunta al sitio exacto del paso en el que vas, y un aviso «📍 Siguiente» bajo la
//   misión te dice dónde ir para seguir avanzando (tócalo para encender la flecha).
// - Pestañas nuevas en la lupa: 👹 Enemigos (todos, con dónde salen, nivel, botín y flecha) y 🐺 Subrazas.
// - Lobo: el botón 🐺 pasa por forma híbrida (pelaje en la cara y el cuerpo, hocico, colmillos; con tu ropa y tus
//   cosméticos) → lobo a cuatro patas → normal.
// - Vampiro: Agarre de Sangre sujeta a un enemigo (o a un jugador online con el PvP activado) y le chupa la sangre.

// ---------- flecha dorada en cualquier mapa ----------
const WP_M = {};
function wpKey(loc, m) { if (loc && m) WP_M[Math.round(loc[0] * 10) / 10 + ',' + Math.round(loc[1] * 10) / 10] = m; }
function curMapId() { const M = G.map; return !M ? 'world' : M.isWorld ? 'world' : M.id; }
const vrDoor = () => { const Z = VR_ZONES[4]; return [Z.c[0] + 14, Z.c[1] + 6]; };
function wpRoute(wp) { const cur = curMapId(), m = wp.m || 'world';
  if (cur === m) return [wp.x, wp.y];
  if (cur === 'world') return m === 'velo_roto' || m === 'jardin_sonrisa' ? VR_WPOS.portal : null;
  if (cur === 'velo_roto') return m === 'jardin_sonrisa' ? vrDoor() : [VR_GATE[0], VR_GATE[1] + 3];
  if (cur === 'jardin_sonrisa') return [12, 35];
  return null; }
function setWp(d) { const P = G.P; if (!d || !d.loc) return; P.wp = { x: d.loc[0], y: d.loc[1], t: d.t, m: d.m || 'world' }; const r = wpRoute(P.wp), far = curMapId() !== P.wp.m;
  toast(L2('La flecha dorada te lleva a: ', 'The golden arrow leads to: ') + d.t + (far && r ? L2(' (primero a la entrada)', ' (first to the entrance)') : ''), 'info', 3); markDirty(); }
{ const _gt = guideTarget; guideTarget = function () { const P = G.P; if (P && P.wp) { if (!P.wp.m) P.wp.m = WP_M[Math.round(P.wp.x * 10) / 10 + ',' + Math.round(P.wp.y * 10) / 10] || 'world';
    if (curMapId() === P.wp.m && Math.hypot(P.x / 16 - P.wp.x, P.y / 16 - P.wp.y) < 4) { toast(L2('Has llegado: ', 'You arrived: ') + P.wp.t, 'info'); P.wp = null; markDirty(); setTimeout(() => secNotify(true), 1200); return _gt(); }
    const loc = wpRoute(P.wp); if (loc) return { loc, label: P.wp.t }; } return _gt(); }; }
function drawWpArrow(cx, cy, pos) { const P = G.P; const tx = pos[0] * 16 + 8, ty = pos[1] * 16 + 8, dx = tx - P.x, dy = ty - P.y, d = Math.hypot(dx, dy); if (d < 40) return;
  const a = Math.atan2(dy, dx), r = 21 + Math.sin(G.t * 5) * 1.5, ax = Math.round(P.x - cx + Math.cos(a) * r), ay = Math.round(P.y - 11 - cy + Math.sin(a) * r * 0.8);
  ctx.save(); ctx.translate(ax, ay); ctx.rotate(a); ctx.globalAlpha = 0.95; ctx.fillStyle = '#1a0e08'; ctx.beginPath(); ctx.moveTo(7.5, 0); ctx.lineTo(-4.5, -5.5); ctx.lineTo(-2, 0); ctx.lineTo(-4.5, 5.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd23a'; ctx.beginPath(); ctx.moveTo(5.5, 0); ctx.lineTo(-3, -3.6); ctx.lineTo(-1, 0); ctx.lineTo(-3, 3.6); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff4c0'; ctx.fillRect(1, -1, 3, 1); ctx.restore(); ctx.globalAlpha = 1;
  const m = Math.round(d / 16), s = textSprite(m > 99 ? Math.round(m / 10) * 10 + 'M' : m + 'M', '#ffe08a', '#120a0e'); ctx.drawImage(s, Math.round(ax - s.width / 2), Math.round(ay + (Math.sin(a) > 0.3 ? -14 : 7))); }
{ const _dg = drawGuide; drawGuide = function (cx, cy) { const M = G.map, P = G.P; if (M && !M.isWorld && P && P.wp && !P.dead && !(G.fade > 0.05)) { const tg = guideTarget(); if (tg && tg.loc) drawWpArrow(cx, cy, tg.loc); return; } return _dg(cx, cy); }; }
{ const _fb = guiaFollowBtn; guiaFollowBtn = function (d, label) { if (d && d.loc) wpKey(d.loc, d.m || 'world'); return _fb(d, label); }; }

// ---------- dónde está cada cosa del Velo (en su mapa) ----------
const VRP = {
  fenrik: () => ({ loc: npcWorldPos('lobo_viejo') || [38, 138], m: 'world', t: 'Fenrik' }), malvia: () => ({ loc: npcWorldPos('malvia') || [30, 97], m: 'world', t: 'Malvia' }),
  portal: () => VR_WPOS.portal ? { loc: VR_WPOS.portal, m: 'world', t: L2('Portal antiguo', 'Ancient portal') } : null,
  oren: () => ({ loc: [VR_GATE[0] - 3, VR_GATE[1] - 2], m: 'velo_roto', t: 'Oren' }), islote: () => ({ loc: [52, 148], m: 'velo_roto', t: L2('Puente al islote', 'Bridge to the islet') }),
  pedestales: () => { const Z = VR_ZONES[2]; return { loc: [Z.c[0], Z.c[1] + 14], m: 'velo_roto', t: L2('Estelas y pedestales', 'Steles and pedestals') }; },
  altar: k => { const Z = VR_ZONES[3], o = [[-16, 4], [16, 4], [0, 16]][k]; return { loc: [Z.c[0] + o[0], Z.c[1] + o[1]], m: 'velo_roto', t: L2('Altar ', 'Altar ') + (k + 1) }; },
  zona: k => { const Z = VR_ZONES.find(z => z.k === k); return { loc: [Z.c[0], Z.c[1] - 4], m: 'velo_roto', t: Z.n }; },
  arboleda: () => ({ loc: [160, 34], m: 'velo_roto', t: L2('Arboleda corrupta', 'Corrupted grove') }), puerta: () => ({ loc: vrDoor(), m: 'velo_roto', t: L2('Puerta de la Sonrisa', 'Door of the Smile') }),
  corvel: () => ({ loc: [VR4_POS.torre[0], VR4_POS.torre[1] + 3], m: 'velo_roto', t: 'Corvel' }), ilvaine: () => ({ loc: [VR4_POS.lib[0] - 3, VR4_POS.lib[1] + 1], m: 'velo_roto', t: 'Ilvaine' }),
  grizzla: () => ({ loc: [VR4_POS.cal[0] + 1, VR4_POS.cal[1] + 2], m: 'velo_roto', t: 'Grizzla' }), rosas: () => ({ loc: VR4_POS.rosas, m: 'velo_roto', t: BOSSES.rey_rosas.n }),
  jardin: (x, y, t) => ({ loc: [x, y], m: 'jardin_sonrisa', t }),
};
const SEC_WHERE = {
  portal: P => !P.quests.done.vr1 ? VRP.fenrik() : !P.quests.done.vr2 ? VRP.malvia() : VRP.portal(),
  linterna: () => VRP.islote(), simbolos: () => VRP.pedestales(), altares: P => VRP.altar([0, 1, 2].find(k => !(((P.vrAlt || 0) >> k) & 1)) || 0),
  campana: P => P.quests.done.vr3 ? VRP.oren() : VRP.zona('aldea'), corrupcion: () => corr() >= 60 ? VRP.arboleda() : VRP.oren(),
  mascara: () => VRP.zona('castillo'), heredero: () => VRP.zona('castillo'), jardin: () => VRP.puerta(),
  nombre: P => { const f = P.vrFrag || 0; return !(f & 1) ? VRP.jardin(30, 22, L2('Conejos Sonrientes', 'Smiling Rabbits')) : !(f & 4) ? VRP.jardin(60, 27, L2('Estela del jardín', 'Garden stele')) : !(f & 2) ? VRP.jardin(34, 34, L2('Tendero Imposible', 'Impossible Shopkeeper')) : !(f & 8) ? VRP.arboleda() : VRP.jardin(76, 35, L2('El Sin Nombre', 'The Nameless One')); },
  subraza: () => VRP.corvel(), mascotas: () => VRP.corvel(), conjuros: () => VRP.ilvaine(), rosas: () => VRP.rosas(),
  memoria: () => VRP.zona('aldea'), sangre: () => VRP.zona('castillo'), arma: P => P.vrName ? null : VRP.jardin(76, 35, L2('El Sin Nombre', 'The Nameless One')),
};
const SEC_ORDER = ['portal', 'campana', 'linterna', 'simbolos', 'altares', 'conjuros', 'subraza', 'mascotas', 'rosas', 'corrupcion', 'mascara', 'heredero', 'jardin', 'nombre', 'arma'];
for (const S of SECRETS) { S.where = SEC_WHERE[S.id] || null; S.avail = P => S.id === 'portal' ? P.lv >= 240 : !!P.vrPortal; }
function secNext() { const P = G.P; if (!P || P.lv < 240) return null; for (const id of SEC_ORDER) { const S = SECRETS.find(s => s.id === id); if (S && S.avail(P) && !S.done(P) && S.where && S.where(P)) return S; } return null; }
// ---------- aviso «📍 Siguiente» bajo la misión ----------
function secNotify(force) { const P = G.P, S = secNext(); if (!S) return; if (!force && P.secLastN === S.id) return; P.secLastN = S.id; const w = S.where(P); toast('📍 ' + L2('Siguiente: ', 'Next: ') + S.n + ' — ' + w.t + L2(' (toca el aviso para la flecha)', ' (tap the notice for the arrow)'), 'quest', 5); }
let SEC_T = 0;
V33_TICKS.push(dt => { const P = G.P; if (!P) return; SEC_T += dt; if (SEC_T < 1) return; SEC_T = 0; const S = secNext(); let b = $('#secChip');
  if (!b) { b = document.createElement('button'); b.id = 'secChip'; b.style.cssText = 'position:fixed;z-index:6;max-width:19em;text-align:left;font:inherit;font-size:.72em;padding:.35em .6em;border-radius:7px;border:2px solid #b8862a;background:rgba(26,14,22,.88);color:#ffe8a0;pointer-events:auto'; document.body.appendChild(b);
    b.onclick = () => { const S2 = secNext(); if (!S2) return; const w = S2.where(G.P); setWp(w); GUIA.tab = 'sec'; GSEC = S2.id; }; }
  const tr = $('#tracker'), show = S && !G.paused && G.state !== 'title' && $('#modal').hidden && !(typeof SETTINGS !== 'undefined' && SETTINGS.guide === false);
  if (!show) { b.hidden = true; return; } const r = tr && !tr.hidden ? tr.getBoundingClientRect() : null; b.style.left = (r ? r.left : 12) + 'px'; b.style.top = (r ? r.bottom + 4 : 110) + 'px';
  const w = S.where(P), on = P.wp && w && P.wp.x === w.loc[0] && P.wp.y === w.loc[1], txt = '📍 ' + S.n + ' · ' + w.t + (on ? ' ➜' : ''); if (b.textContent !== txt) b.textContent = txt; b.hidden = false;
  if (P.secLastN !== S.id) secNotify(); });

// ---------- jefes y monstruos del Velo: sitio exacto en su mapa ----------
{ const _bw = bossWhere; bossWhere = function (id) { const r = _bw(id); let w = null;
  const Z = VR_ZONES.find(z => z.boss === id); if (Z) w = { loc: [Z.c[0], Z.c[1] - 4], m: 'velo_roto' };
  const v = typeof VB !== 'undefined' && VB.find(b => b[0] === id); if (v) w = { loc: v[5], m: 'velo_roto' };
  if (id === 'rey_rosas') w = { loc: VR4_POS.rosas, m: 'velo_roto' }; if (id === 'sin_nombre') w = { loc: [76, 35], m: 'jardin_sonrisa' };
  if (w) { wpKey(w.loc, w.m); return Object.assign({}, r, w); } return r; }; }
function mobWhere(k) { const D = MOBS[k]; if (!D) return null;
  const Z = VR_ZONES.find(z => z.pool.includes(k)); if (Z) return { loc: Z.c, m: 'velo_roto', t: L2('Velo Roto: ', 'Broken Veil: ') + Z.n };
  if (typeof MS_MOBS !== 'undefined' && MS_MOBS.some(e => e[0] === k)) return { loc: [45, 35], m: 'jardin_sonrisa', t: L2('Jardín de la Sonrisa (0:00-3:00)', 'Garden of the Smile (0:00-3:00)') };
  const W = G.world, cs = W && W.camps ? W.camps.filter(c => c.mob === k) : []; if (cs.length) { const P = G.P, c = cs.sort((a, b) => dist2(a.x, a.y, P.x / 16, P.y / 16) - dist2(b.x, b.y, P.x / 16, P.y / 16))[0], R = regionAt(c.x, c.y); return { loc: [c.x, c.y], m: 'world', t: R ? R.n : L2('Mundo', 'World') }; }
  const reg = (D.reg || [])[0]; return { loc: null, t: reg === 'cielo' ? 'Celestia / Altavela' : reg === 'mar' || reg === 'atlantis' ? L2('Bajo el mar', 'Under the sea') : reg ? L2('Zona especial: ', 'Special area: ') + reg : L2('Cuevas y eventos', 'Caves and events') }; }
{ const _is = itemSources; itemSources = function (id) { const out = _is(id); for (const s of out) { const k = Object.keys(MOBS).find(k => MOBS[k].reg && MOBS[k].reg[0] === 'velo' && typeof MOBS[k].n === 'string' && s[0].includes(MOBS[k].n)); if (k) { const w = mobWhere(k); if (w && w.loc) { s[1] = { loc: w.loc, t: MOBS[k].n, m: w.m }; wpKey(w.loc, w.m); } } } return out; }; }

// ---------- la lupa: pestañas Secretos, Enemigos y Subrazas ----------
let GENE = null, GSUB = null;
function guiaX(tab) { const P = G.P; P.secH = P.secH || {}; GUIA.tab = tab; const tx = v => typeof v === 'function' ? v() : v, fb = (w, lab) => w && w.loc ? guiaFollowBtn({ loc: w.loc, t: w.t || lab, m: w.m }, lab) : '';
  let list = '', det = '';
  if (tab === 'sec') { const nx = secNext(); list = SECRETS.map(s => `<button class="gitem ${GSEC === s.id ? 'sel' : ''} ${s.done(P) ? 'own' : ''}" data-sec="${s.id}"><span>${nx === s ? '📍 ' : ''}${esc(s.n)}</span>${s.done(P) ? ' ✓' : ''}</button>`).join('');
    const S = SECRETS.find(s => s.id === GSEC);
    det = !S ? `<p class="hint">${L2('Todo lo escondido del Velo Roto. 📍 marca lo siguiente que te toca. Cada uno trae los pasos, pistas una a una y la flecha dorada al sitio exacto del paso en el que vas.', 'Everything hidden in the Broken Veil. 📍 marks what comes next. Each one has the steps, hints one at a time and the golden arrow to the exact place of the step you are on.')}</p>${nx ? `<div class="gsrc"><span>📍 ${L2('Siguiente: ', 'Next: ')}<b>${esc(nx.n)}</b> — ${esc(nx.where(P).t)}</span>${fb(nx.where(P), nx.n)}</div>` : ''}`
      : (() => { const nh = P.secH[S.id] || 0, w = S.where && S.where(P); return `<h4>${esc(S.n)} ${S.done(P) ? '✓' : ''}</h4>` + S.steps.map((s, i) => `<div class="gsrc"><span>${i + 1}. ${esc(tx(s))}</span></div>`).join('') + S.hints.slice(0, nh).map(h => `<div class="gsrc"><span>💡 ${esc(tx(h))}</span></div>`).join('')
        + (w ? `<div class="gsrc"><span>➜ ${L2('Ahora ve a: ', 'Now go to: ')}<b>${esc(w.t)}</b></span>${fb(w, S.n)}</div>` : '') + (nh < S.hints.length ? `<div class="row"><button class="btn sm" id="secH">💡 ${L2('Pista', 'Hint')} ${nh + 1}/${S.hints.length}</button></div>` : ''); })(); }
  if (tab === 'ene') { const q = (GUIA.q || '').toLowerCase(), ks = Object.keys(MOBS).filter(k => typeof MOBS[k].n === 'string' && MOBS[k].lv && (!q || MOBS[k].n.toLowerCase().includes(q))).sort((a, b) => MOBS[a].lv[0] - MOBS[b].lv[0]);
    list = `<input id="gQ" placeholder="${L2('Buscar…', 'Search…')}" value="${esc(GUIA.q || '')}" autocomplete="off">` + ks.map(k => `<button class="gitem ${GENE === k ? 'sel' : ''}" data-ene="${k}"><span>${esc(MOBS[k].n)}</span><small>${MOBS[k].lv[0]}</small></button>`).join('');
    if (GENE && MOBS[GENE]) { const D = MOBS[GENE], w = mobWhere(GENE); det = `<h4>${esc(D.n)} · ${L2('Nv. ', 'Lv. ')}${D.lv[0]}-${D.lv[1]}</h4><div class="gsrc"><span>${esc(w.t)}</span>${fb(w, D.n)}</div>`
      + `<div class="gsrc"><span>${L2('Suelta:', 'Drops:')}</span><div class="gmats">${(D.drops || []).map(([id, ch]) => ITEMS[id] ? `<button class="chip" data-gm="${id}">${esc(ITEMS[id].n)} ${Math.round(ch * 100)}%</button>` : '').join('')}</div></div>`
      + `<div class="gsrc"><span>${L2('Comportamiento: ', 'Behaviour: ')}${{ ranged: L2('ataca a distancia', 'attacks from range'), charge: L2('embiste en línea', 'charges in a line'), passive: L2('pacífico hasta que le pegas', 'peaceful until hit'), aggro: L2('te persigue', 'chases you') }[D.ai] || D.ai}${P.best && P.best[GENE] ? L2(' · Vencidos: ', ' · Defeated: ') + P.best[GENE] : ''}</span></div>`; }
    else det = `<p class="hint">${L2('Todos los enemigos del juego. Elige uno para ver dónde sale, su botín y seguirlo con la flecha dorada (te lleva al campamento más cercano).', 'Every enemy in the game. Pick one to see where it appears, its loot and follow it with the golden arrow (to the nearest camp).')}</p>`; }
  if (tab === 'sub') { list = Object.keys(SR).map(k => `<button class="gitem ${GSUB === k ? 'sel' : ''} ${P.sr === k ? 'own' : ''}" data-sub="${k}"><span>${SR[k].ic} ${esc(SR[k].n)}</span>${P.sr === k ? ' ✓' : ''}</button>`).join('');
    const k = GSUB, D = k && SR[k]; det = !D ? `<p class="hint">${L2('Las subrazas se consiguen con el ritual de Corvel, en la Torre Hueca del Velo Roto (misión «El encapuchado de la torre»). Solo puedes tener una; la Poción de Sangre Limpia la quita.', 'Subraces come from Corvel\'s ritual, at the Hollow Tower in the Broken Veil (quest "The Hooded One of the Tower"). You can only have one; the Clean Blood Potion removes it.')}</p><div class="gsrc"><span>Corvel</span>${fb(VRP.corvel(), 'Corvel')}</div>`
      : `<h4>${D.ic} ${esc(D.n)}${P.sr === k ? ' · ' + L2('rango ', 'rank ') + srRank() : ''}</h4><div class="gsrc"><span>${esc(D.pas)}</span></div>` + (k === 'lobo' ? `<div class="gsrc"><span>${L2('Botón 🐺: normal → forma híbrida (pelaje en la cara y el cuerpo, hocico y colmillos, con tu ropa) → lobo a cuatro patas → normal.', '🐺 button: normal → hybrid form (fur on face and body, snout and fangs, with your clothes) → four-legged wolf → normal.')}</span></div>` : '')
      + SRSK[k].map(id => { const S = SK[id], e = S.eff, m = Math.round(((e.m || 0) + (e.mr || 0) * ((P.sr === k ? srRank() : 1) - 1)) * 100); return `<div class="gsrc"><span>${iconHTML(S.icon, 18)} <b>${esc(S.n)}</b> · ${S.cd} s · ${S.mp} ${L2('maná', 'mana')}<br><small>${esc(String(S.d).replace('{m}', m))}</small></span></div>`; }).join('')
      + `<div class="gsrc"><span>${L2('Ofrenda: ', 'Offering: ')}${D.cost.map(([id, n]) => n + '× ' + esc(ITEMS[id].n) + ' (' + countItem(id) + ')').join(', ')} + ${fmt(200000)} ${L2('oro', 'gold')}</span>${fb(VRP.corvel(), 'Corvel')}</div>`; }
  const chips = [['mat', L2('Materiales', 'Materials')], ['eq', L2('Equipo', 'Gear')], ['cos', L2('Cosméticos', 'Cosmetics')], ['boss', L2('Jefes', 'Bosses')], ['ene', '👹 ' + L2('Enemigos', 'Enemies')], ['sub', '🐺 ' + L2('Subrazas', 'Subraces')], ['sec', '🗝 ' + L2('Secretos', 'Secrets')]];
  openModal(`<div class="frame guia"><h3>🔎 ${L2('Dónde conseguir', 'Where to get it')}</h3><div class="chips">${chips.map(([k, n]) => `<button class="chip ${tab === k ? 'on' : ''}" data-gx="${k}">${n}</button>`).join('')}${P.wp ? `<button class="chip danger" id="gOff">✕ ${L2('Apagar flecha', 'Turn arrow off')}</button>` : ''}</div>
    <div class="gcols"><div class="glist">${list}</div><div class="gdet">${det}</div></div><div class="row"><button class="btn" id="gClose">${L2('Cerrar', 'Close')}</button></div></div>`, 'guiamod');
  $('#gClose').onclick = closeModal; $$('[data-gx]').forEach(b => b.onclick = () => { const k = b.dataset.gx; GUIA.sel = null; if (k === 'sec' || k === 'ene' || k === 'sub') guiaX(k); else { GUIA.tab = k; renderGuia(); } });
  $$('[data-sec]').forEach(b => b.onclick = () => { GSEC = b.dataset.sec; guiaX('sec'); }); $$('[data-ene]').forEach(b => b.onclick = () => { GENE = b.dataset.ene; guiaX('ene'); }); $$('[data-sub]').forEach(b => b.onclick = () => { GSUB = b.dataset.sub; guiaX('sub'); });
  $$('[data-gm]').forEach(b => b.onclick = () => { GUIA.tab = 'mat'; GUIA.sel = b.dataset.gm; GUIA.q = ''; renderGuia(); });
  const h = $('#secH'); if (h) h.onclick = () => { P.secH[GSEC] = (P.secH[GSEC] || 0) + 1; markDirty(); guiaX('sec'); };
  const off = $('#gOff'); if (off) off.onclick = () => { P.wp = null; markDirty(); guiaX(tab); };
  const gq = $('#gQ'); if (gq) gq.oninput = () => { GUIA.q = gq.value; const pos = gq.selectionStart; guiaX(tab); const n = $('#gQ'); n.focus(); n.setSelectionRange(pos, pos); };
  $$('[data-wp]').forEach(b => b.onclick = () => { const [x, y] = b.dataset.wp.split(',').map(Number); if (P.wp && P.wp.x === x && P.wp.y === y) { P.wp = null; markDirty(); } else setWp({ loc: [x, y], t: b.dataset.wl, m: WP_M[Math.round(x * 10) / 10 + ',' + Math.round(y * 10) / 10] || 'world' }); guiaX(tab); }); }
renderSecrets = () => guiaX('sec');
{ const _rg = renderGuia; renderGuia = function () { if (GUIA.tab === 'sec' || GUIA.tab === 'ene' || GUIA.tab === 'sub') return guiaX(GUIA.tab); const r = _rg.apply(this, arguments); const ch = $('.guia .chips'); if (ch) { const old = ch.querySelector('[data-gsec]'); if (old) old.remove();
    for (const [k, n] of [['ene', '👹 ' + L2('Enemigos', 'Enemies')], ['sub', '🐺 ' + L2('Subrazas', 'Subraces')], ['sec', '🗝 ' + L2('Secretos', 'Secrets')]]) { const b = document.createElement('button'); b.className = 'chip'; b.textContent = n; b.onclick = () => guiaX(k); ch.insertBefore(b, ch.querySelector('#gOff')); } }
  $$('#modal [data-wp]').forEach(b => { const f = b.onclick; b.onclick = e => { const [x, y] = b.dataset.wp.split(',').map(Number); const m = WP_M[Math.round(x * 10) / 10 + ',' + Math.round(y * 10) / 10]; f && f(e); if (G.P.wp && m) G.P.wp.m = m; }; }); return r; }; }

// ---------- lobo híbrido: pelaje en la cara y el cuerpo, hocico y colmillos (con tu ropa y cosméticos) ----------
{ const _so = srOverlay; srOverlay = function (p, L, dir, anim, f) { if (L.sr === 'lobo' && L.srF === 1) try { wolfHybrid(p, L, dir, anim, f); } catch (e) { } return _so(p, L, dir, anim, f); }; }
function wolfHybrid(p, L, dir, anim, f) { const m = p.meta; if (!m || m.hrx === undefined) return; const F = L.srFur || HAIRS.blanco, SK = L.skin || SKINS[0], map = new Map();
  for (let i = 0; i < SK.length; i++) map.set(SK[i] >>> 0, F[Math.min(3, Math.max(0, i - (SK.length > 4 ? 1 : 0)))]);
  for (let i = 0; i < p.d.length; i++) { const c = map.get(p.d[i] >>> 0); if (c !== undefined) p.d[i] = c; }   // la piel se vuelve pelaje
  const tg = p.tg; if (p.t) p.tg = 5; const hx = Math.round(m.hx), hy = Math.round(m.hy), ey = hy + FACE.ey, side = m.side, up = m.up, d = m.d, hr = Math.round(m.hrx), N = C('#141016'), W = C('#ffffff'), LT = uMix(F[3], W, 0.35);
  // mechones de pelo en las mejillas
  for (let k = 0; k < 4; k++) for (const s of side ? [-d] : [-1, 1]) { const x = hx + s * (hr + (k % 2)) - (s > 0 ? 1 : 0), y = ey + 1 + k; if (!uA(p.get(x, y))) p.set(x, y, F[k % 2 ? 1 : 2]); }
  if (up) { p.tg = tg; return; }
  if (!side) { for (let y = ey + 2; y <= ey + 5; y++) for (let x = hx - 3; x <= hx + 2; x++) { const dx = (x + 0.5 - hx) / 3.2, dy = (y - ey - 3.5) / 2.2; if (dx * dx + dy * dy <= 1) p.set(x, y, y === ey + 2 ? F[3] : LT); }   // hocico
    p.set(hx - 1, ey + 2, N); p.set(hx, ey + 2, N); p.set(hx - 1, ey + 3, uMix(N, F[2], 0.4)); p.hl(hx - 2, ey + 5, 4, N); p.set(hx - 2, ey + 6, W); p.set(hx + 1, ey + 6, W); p.set(hx - 3, ey + 4, F[1]); p.set(hx + 2, ey + 4, F[1]); }
  else { const x0 = d < 0 ? hx - 6 : hx + 5; for (let k = 0; k < 4; k++) for (let y = ey + 2; y <= ey + 4 - (k > 2 ? 1 : 0); y++) p.set(x0 + d * k, y, y === ey + 2 ? F[3] : LT); p.set(x0 + d * 3, ey + 2, N); p.set(x0 + d * 4, ey + 2, N); p.hl(Math.min(x0, x0 + d * 3), ey + 5, 4, N); p.set(x0 + d * 2, ey + 6, W); }
  p.tg = tg; }

// ---------- vampiro: Agarre de Sangre (enemigos y jugadores online con PvP) ----------
{ const _sc = srCast; srCast = function (id) { const s = SK[id]; if (!s || s.eff.k !== 'vgrab') return _sc(id); const P = G.P, r = P.skills[id] || 1, e = s.eff, mult = (e.m + e.mr * (r - 1)) * (1 + (P.S.skillP || 0) / 100);
  const mob = nearestMob(P.x, P.y, 110), pl = typeof pvpOn === 'function' && pvpOn() ? pvpTargets().filter(q => Math.hypot(q.x - P.x, q.y - P.y) < 100).sort((a, b) => dist2(a.x, a.y, P.x, P.y) - dist2(b.x, b.y, P.x, P.y))[0] : null;
  const T = pl && (!mob || dist2(pl.x, pl.y, P.x, P.y) < dist2(mob.x, mob.y, P.x, P.y)) ? pl : mob;
  if (!T) { toast(L2('Sin presa cerca', 'No prey nearby'), 'warn'); P.mp += s.mp; P.cds[id] = 0; return; }
  P.grab = { T, pl: T === pl, end: G.t + 2.5, next: G.t + 0.3, dmg: P.S.atk * mult }; if (T !== pl) { T.stun = Math.max(T.stun || 0, T.boss ? 0.8 : 2.6); T.grabbed = G.t + 2.5; }
  floatText(T.x, T.y - 42, L2('¡ATRAPADO!', 'GRABBED!'), '#ff3050', true); addFx({ type: 'bite', x: T.x, y: T.y - 14, dur: 0.35 }); sfx('crit'); }; }
V33_TICKS.push(dt => { const P = G.P, g = P && P.grab; if (!g) return; const T = g.T, gone = g.pl ? (T.dead || T.dn || !G.remote || ![...G.remote.values()].includes(T)) : (T.dying || T.remove);
  if (P.dead || gone || G.t > g.end) { P.grab = null; return; }
  const a = Math.atan2(T.y - P.y, T.x - P.x), bx = T.x - Math.cos(a) * 12, by = T.y - Math.sin(a) * 8; if (!blockedFor(G.map, Math.floor(bx / 16), Math.floor(by / 16), P.L)) { P.x += (bx - P.x) * Math.min(1, dt * 10); P.y += (by - P.y) * Math.min(1, dt * 10); }
  P.dir = dirFromVec(T.x - P.x, T.y - P.y); if (P.anim !== 'atk') setAnim(P, 'cast', true);
  if (G.t >= g.next) { g.next = G.t + 0.5; let d = 0; if (g.pl) { SRK_ON++; NFX_ON++; try { pvpHit(T, g.dmg); } finally { SRK_ON--; NFX_ON--; } d = srPvpD(P, g.dmg); } else { d = hitMob(T, g.dmg, {}) || 0; if (!T.boss) T.stun = Math.max(T.stun || 0, 0.6); }
    if (d > 0) { const h = Math.round(d * 0.5); P.hp = Math.min(P.S.maxhp, P.hp + h); floatText(P.x, P.y - 40, '+' + h, '#ff5a7a'); }
    NFX_ON++; try { addFx({ type: 'bolt', x: T.x, y: T.y - 14, x2: P.x, y2: P.y - 16, dur: 0.3, col: '#ff2040' }); } finally { NFX_ON--; } burst(T.x, T.y - 14, 5, { sp: 30, up: 20, g: 60, life: 0.5, c: ['#c01030', '#ff5a7a'] }); } });
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { _de(e, cx, cy); if (e.type === 'mob' && e.grabbed > G.t && !e.dying) { ctx.fillStyle = 'rgba(200,16,48,0.55)'; for (let k = 0; k < 3; k++) ctx.fillRect(Math.round(e.x - cx - 6 + k * 5), Math.round(e.y - cy - 20 + ((G.t * 30 + k * 7) % 14)), 1, 3); } }; }
{ const _om = openModal; openModal = function () { const b = $('#secChip'); if (b) b.hidden = true; return _om.apply(this, arguments); }; }
