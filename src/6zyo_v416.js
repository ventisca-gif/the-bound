// ================= v4.16: CRIATURAS CON SU DIBUJO, GUÍA DE RECURSOS Y HABILIDADES CON IDENTIDAD =================

// ---------- criaturas de Altavela con el dibujo de Sergio (6zyn_criaturas_data.js) ----------
const CELX_CV = {};
for (const k in CELX_SHEET) { const [fw, fh] = CELX_SIZE[k], c = mkCanvas(fw * 10, fh * 4); CELX_CV[k] = c; const im = new Image(); im.onload = () => c.getContext('2d').drawImage(im, 0, 0); im.src = CELX_SHEET[k]; }
{ const _ma = mobAtlasFor; mobAtlasFor = function (art) { if (art && art[0] === 'celx' && CELX_CV[art[1]]) return getAtlas('M' + art.join(','), () => { const [fw, fh] = CELX_SIZE[art[1]]; return { img: CELX_CV[art[1]], fw, fh, idx: { idle: 0, walk: 2, atk: 6, hurt: 9 }, ax: fw >> 1, ay: fh - 3 }; }); return _ma(art); }; }
for (const [id, k] of [['arpia_maligna', 'arpia'], ['medusa_nube', 'medusa'], ['manta_viento', 'manta'], ['centinela_aeris', 'centinela'], ['chispa_errante', 'chispa']]) if (MOBS[id]) MOBS[id].art = ['celx', k];
for (const [id, k, s] of [['reina_arpia', 'arpia', 2], ['coloso_aeris', 'centinela', 2.2], ['sierpe_tormenta', 'sierpe', 2]]) if (BOSSES[id]) { BOSSES[id].art = ['celx', k]; BOSSES[id].scale = s; }

// ---------- guía «Dónde conseguir»: cada material, equipo, cosmético y jefe, con flecha ----------
// Botón con una lupa junto al Libro. Busca por nombre; «Seguir» enciende la flecha dorada hacia el sitio (otra vez
// para apagarla). Si está en otro mundo, te dice cómo llegar.
SAVEKEYS.push('wp');
function gName(id) { return ITEMS[id] ? ITEMS[id].n : id; }
function townOf(k) { return TOWNS.find(t => t.k === k); }
function townLoc(k) { const t = townOf(k); return t ? [Math.round((t.x0 + t.x1) / 2), Math.round((t.y0 + t.y1) / 2)] : null; }
function nearestObj(fn) { const P = G.P, W = G.world; let b = null, bd = 1e12; for (const o of W.objs) { if (o.hidden || !fn(o)) continue; const d = dist2(o.tx * 16, o.ty * 16, P.map === 'world' ? P.x : (P.retX || P.x), P.map === 'world' ? P.y : (P.retY || P.y)); if (d < bd) { bd = d; b = o; } } return b ? [b.tx, b.ty] : null; }
function bossWhere(id) { const W = G.world, b = W.bosses && W.bosses.find(b => b.id === id); if (b) return { loc: [b.x, b.y], where: L2('mundo', 'world') };
  if (typeof SKY_ISLES !== 'undefined') { const s = SKY_ISLES.find(S => S.boss === id); if (s) return { where: L2('Celestia: ', 'Celestia: ') + s.n }; }
  const cz = { reina_arpia: 'nidos', coloso_aeris: 'aeris', sierpe_tormenta: 'tormenta' }[id]; if (cz) return { where: L2('Altavela: ', 'Altavela: ') + CEL_ZONES.find(z => z.k === cz).n };
  if (typeof CAVES !== 'undefined') for (const k in CAVES) if (CAVES[k].boss === id) return { loc: CAVES[k].near, where: CAVES[k].n };
  return { where: L2('una zona especial', 'a special area') }; }
// fuentes de un objeto: [texto, destino|null]
function itemSources(id) {
  const out = [], it = ITEMS[id]; if (!it) return out;
  for (const r of RECIPES) if (r.out === id) out.push([L2('Fabricar', 'Craft') + ' (' + (typeof JOBS !== 'undefined' && JOBS[r.job] ? JOBS[r.job].n : r.job) + ' ' + (r.jlv || 1) + '): ' + r.mats.map(([m, n]) => n + '× ' + gName(m)).join(', ') + (r.gold ? ' + ' + r.gold + L2(' oro', ' gold') : ''), r.job === 'herreria' ? { loc: nearestObj(o => o.k === 'forge' || o.k === 'anvil'), t: L2('Herrería', 'Smithy') } : null, r.mats.map(m => m[0])]);
  for (const cat in SHOPS) for (const tk in SHOPS[cat]) { const L_ = SHOPS[cat][tk]; if (Array.isArray(L_) && L_.includes(id)) { const T = townOf(tk); out.push([L2('Se vende en ', 'Sold in ') + (T ? T.n : tk), T ? { loc: townLoc(tk), t: T.n } : null]); } }
  const mobs = Object.keys(MOBS).filter(k => (MOBS[k].drops || []).some(d => d[0] === id));
  for (const m of mobs.slice(0, 4)) { const c = G.world.camps.find(c => c.mob === m), R = c ? regionAt(c.x, c.y) : null; out.push([L2('Lo suelta ', 'Dropped by ') + MOBS[m].n + (R ? ' · ' + R.n : MOBS[m].reg && MOBS[m].reg[0] === 'cielo' ? ' · Celestia/Altavela' : ''), c ? { loc: [c.x, c.y], t: MOBS[m].n } : null]); }
  for (const b of Object.keys(BOSSES).filter(k => (BOSSES[k].drops || []).some(d => d[0] === id)).slice(0, 3)) { const w = bossWhere(b); out.push([L2('Jefe: ', 'Boss: ') + BOSSES[b].n + ' · ' + w.where, w.loc ? { loc: w.loc, t: BOSSES[b].n } : null]); }
  let m;
  if ((m = /^ore(\d+)$/.exec(id))) out.push([L2('Minería: vetas de ', 'Mining: veins of ') + OREN[+m[1]], { loc: nearestObj(o => o.k === 'ore' && o.tier === +m[1]), t: OREN[+m[1]] }]);
  if ((m = /^log(\d+)$/.exec(id))) out.push([L2('Tala: árboles de ', 'Woodcutting: trees of ') + LOGN[+m[1]], { loc: nearestObj(o => o.k === 'tree' && !o.deco && String(o.sp || '').toLowerCase() === String(LOGN[+m[1]]).toLowerCase().split(' ')[0]), t: LOGN[+m[1]] }]);
  if ((m = /^herb(\d+)$/.exec(id))) out.push([L2('Recolecta hierbas de nivel ', 'Gather herbs of level ') + m[1], { loc: nearestObj(o => o.k === 'herb' && o.tier === +m[1]), t: it.n }]);
  if (it.icon && it.icon[0] && String(it.icon[0]).startsWith('fish')) out.push([L2('Pesca en ríos, lagos y mar', 'Fish in rivers, lakes and the sea'), null]);
  if (!out.length && it.d) out.push([it.d, null]);
  return out;
}
function cosSources(c) { const C_ = COSM[c], src = String(C_.src || ''); let dst = null;
  const hint = /Vigías|Wardens/.test(src) ? 'vig_selene' : null; const npc = hint || Object.keys(NPCS).find(k => NPCS[k].n && src.includes(NPCS[k].n)); if (npc) { const p = npcWorldPos(npc); if (p) dst = { loc: p, t: NPCS[npc].n }; }
  const boss = Object.keys(BOSSES).find(k => typeof BOSSES[k].n === 'string' && src.includes(BOSSES[k].n.split(',')[0])); if (!dst && boss) { const w = bossWhere(boss); if (w.loc) dst = { loc: w.loc, t: BOSSES[boss].n }; }
  if (!dst) for (const T of TOWNS) if (src.includes(T.n.split(' ')[0])) { dst = { loc: townLoc(T.k), t: T.n }; break; }
  return [[src || L2('Desconocido', 'Unknown'), dst]]; }
let GUIA = { tab: 'mat', q: '', sel: null };
function guiaList() { const q = GUIA.q.toLowerCase(), m = s => !q || String(s).toLowerCase().includes(q);
  if (GUIA.tab === 'cos') return Object.keys(COSM).filter(c => m(COSM[c].n)).map(c => ({ id: c, n: COSM[c].n, ic: null, own: (G.P.wardrobe || []).includes(c) }));
  if (GUIA.tab === 'boss') return Object.keys(BOSSES).filter(b => typeof BOSSES[b].n === 'string' && m(BOSSES[b].n)).sort((a, b) => (BOSSES[a].lv || 0) - (BOSSES[b].lv || 0)).map(b => ({ id: b, n: BOSSES[b].n, lv: BOSSES[b].lv }));
  const f = GUIA.tab === 'mat' ? (it => it.t === 'mat') : (it => it.slot && (it.t === 'weapon' || it.t === 'armor' || it.slot === 'weapon' || it.slot === 'body' || it.slot === 'head' || it.slot === 'legs' || it.slot === 'feet' || it.slot === 'acc'));
  return Object.values(ITEMS).filter(it => f(it) && m(it.n) && (!it.cls || it.cls === G.P.cls || GUIA.tab === 'mat')).sort((a, b) => (a.lv || a.tier || 0) - (b.lv || b.tier || 0)).slice(0, 400).map(it => ({ id: it.id, n: it.n, ic: it.icon, lv: it.lv || it.tier })); }
function guiaFollowBtn(d, label) { if (!d || !d.loc) return ''; const on = G.P.wp && G.P.wp.x === d.loc[0] && G.P.wp.y === d.loc[1]; return `<button class="btn sm ${on ? 'gold' : ''}" data-wp="${d.loc[0]},${d.loc[1]}" data-wl="${esc(d.t || label)}">${on ? '➜ ' + L2('Siguiendo', 'Following') : '➜ ' + L2('Seguir', 'Follow')}</button>`; }
function renderGuia() {
  const P = G.P, list = guiaList(), tabs = [['mat', L2('Materiales', 'Materials')], ['eq', L2('Equipo', 'Gear')], ['cos', L2('Cosméticos', 'Cosmetics')], ['boss', L2('Jefes', 'Bosses')]];
  let det = `<p class="hint">${L2('Elige algo para ver dónde se consigue. «Seguir» enciende la flecha dorada hacia el sitio.', 'Pick something to see where to get it. "Follow" turns on the golden arrow to the place.')}</p>`;
  if (GUIA.sel) { let src = [], title = '';
    if (GUIA.tab === 'cos') { title = COSM[GUIA.sel].n; src = cosSources(GUIA.sel); }
    else if (GUIA.tab === 'boss') { const B = BOSSES[GUIA.sel], w = bossWhere(GUIA.sel); title = B.n + ' · ' + L2('Nv. ', 'Lv. ') + B.lv; src = [[w.where, w.loc ? { loc: w.loc, t: B.n } : null]]; if (B.drops) src.push([L2('Suelta: ', 'Drops: ') + B.drops.map(d => gName(d[0])).join(', '), null]); }
    else { title = gName(GUIA.sel); src = itemSources(GUIA.sel); }
    det = `<h4>${esc(title)}</h4>` + (src.length ? src.map(([t, d, mats]) => `<div class="gsrc"><span>${esc(t)}</span>${guiaFollowBtn(d, title)}${mats ? `<div class="gmats">${mats.map(m => `<button class="chip" data-gm="${m}">${esc(gName(m))} (${countItem(m)})</button>`).join('')}</div>` : ''}</div>`).join('') : `<p>${L2('Aún no se sabe.', 'Unknown yet.')}</p>`); }
  openModal(`<div class="frame guia"><h3>🔎 ${L2('Dónde conseguir', 'Where to get it')}</h3><div class="chips">${tabs.map(([k, n]) => `<button class="chip ${GUIA.tab === k ? 'on' : ''}" data-gt="${k}">${n}</button>`).join('')}${P.wp ? `<button class="chip danger" id="gOff">✕ ${L2('Apagar flecha', 'Turn arrow off')}</button>` : ''}</div>
    <input id="gQ" placeholder="${L2('Buscar…', 'Search…')}" value="${esc(GUIA.q)}" autocomplete="off"><div class="gcols"><div class="glist">${list.map(e => `<button class="gitem ${GUIA.sel === e.id ? 'sel' : ''} ${e.own ? 'own' : ''}" data-gi="${e.id}">${e.ic ? iconHTML(e.ic, 20) : ''}<span>${esc(e.n)}</span>${e.lv ? `<small>${e.lv}</small>` : ''}${e.own ? ' ✓' : ''}</button>`).join('')}</div><div class="gdet">${det}</div></div><div class="row"><button class="btn" id="gClose">${L2('Cerrar', 'Close')}</button></div></div>`, 'guiamod');
  $('#gClose').onclick = closeModal; const gq = $('#gQ'); gq.oninput = () => { GUIA.q = gq.value; const pos = gq.selectionStart; renderGuia(); const n = $('#gQ'); n.focus(); n.setSelectionRange(pos, pos); };
  $$('[data-gt]').forEach(b => b.onclick = () => { GUIA.tab = b.dataset.gt; GUIA.sel = null; renderGuia(); });
  $$('[data-gi]').forEach(b => b.onclick = () => { GUIA.sel = b.dataset.gi; renderGuia(); });
  $$('[data-gm]').forEach(b => b.onclick = () => { GUIA.tab = 'mat'; GUIA.sel = b.dataset.gm; GUIA.q = ''; renderGuia(); });
  $$('[data-wp]').forEach(b => b.onclick = () => { const [x, y] = b.dataset.wp.split(',').map(Number); if (P.wp && P.wp.x === x && P.wp.y === y) P.wp = null; else { P.wp = { x, y, t: b.dataset.wl }; toast(L2('La flecha dorada te lleva a: ', 'The golden arrow leads to: ') + b.dataset.wl, 'info', 3); } markDirty(); renderGuia(); });
  const off = $('#gOff'); if (off) off.onclick = () => { P.wp = null; markDirty(); renderGuia(); };
}
renderGuia = scrollKeep('#modal', renderGuia, () => GUIA.tab);
{ const st = document.createElement('style'); st.textContent = '.guia .gcols{display:flex;gap:.6em;min-height:16em}.guia .glist{flex:1;max-height:min(52vh,22em);overflow-y:auto;display:flex;flex-direction:column;gap:2px}.guia .gdet{flex:1.2;max-height:min(52vh,22em);overflow-y:auto}.gitem{display:flex;align-items:center;gap:.4em;text-align:left;background:rgba(0,0,0,.25);border:1px solid rgba(255,220,140,.15);color:inherit;padding:.25em .4em;border-radius:5px;font:inherit}.gitem.sel{outline:2px solid #ffd040}.gitem.own{opacity:.7}.gitem small{margin-left:auto;opacity:.7}.gsrc{margin:.35em 0;padding:.35em;border:1px solid rgba(255,220,140,.2);border-radius:6px;display:flex;flex-wrap:wrap;gap:.4em;align-items:center}.gsrc span{flex:1 1 60%}.gmats{flex-basis:100%;display:flex;flex-wrap:wrap;gap:.3em}#gQ{width:100%;margin:.4em 0;padding:.4em;border-radius:6px;border:1px solid #6a5030;background:#1a1218;color:#fff;font:inherit}'; document.head.appendChild(st); }
function guiaMount() { const tr = $('#tr .trbtns'); if (!tr || $('#bGuia')) return; const b = document.createElement('button'); b.className = 'mini'; b.id = 'bGuia'; b.title = L2('Dónde conseguir', 'Where to get it'); b.setAttribute('aria-label', b.title); b.textContent = '🔎'; const bk = $('#bBook') || $('#bMap'); tr.insertBefore(b, bk); b.onclick = () => renderGuia(); }
V33_TICKS.push(guiaMount);
// la flecha dorada: tu destino de la guía tiene prioridad; se apaga sola al llegar
{ const _gt = guideTarget; guideTarget = function () { const P = G.P; if (P && P.wp) { if (P.map === 'world' && Math.hypot(P.x / 16 - P.wp.x, P.y / 16 - P.wp.y) < 4) { toast(L2('Has llegado: ', 'You arrived: ') + P.wp.t, 'info'); P.wp = null; } else return { loc: [P.wp.x, P.wp.y], label: P.wp.t }; } return _gt(); }; }

// ---------- habilidades con identidad: auras de color, destellos de elemento ----------
// Las habilidades de mejora pintan el cuerpo del color de su nombre mientras duran (Furia: rojo, Escarcha: hielo,
// Invisibilidad y Sombras: sombra, Fortaleza y Baluarte: oro…) con brillo y chispas. Funciona en las 8 estructuras
// de cuerpo porque se pinta encima del dibujo real del personaje. Los demás jugadores lo ven (viaja en la presencia).
const AU_COL = ['#ff3030', '#9ae8ff', '#7a40c0', '#ffd040', '#8aff6a', '#5ab0ff', '#ff9a2a', '#ffffff', '#c070ff', '#3ad8ff'];
function skAura(id) { const s = SK[id]; if (!s || !s.eff) return null; const n = (s.n || '').toLowerCase(), k = s.eff.k;
  if (k === 'shield') return 9; if (k !== 'buff') return null;
  if (/furia|ira|avatar|frenét|guerra|ritmo/.test(n)) return 0; if (/escarcha|hielo|glaci/.test(n)) return 1; if (/invisib|sombr|mil sombras/.test(n)) return 2;
  if (/fortaleza|baluarte|coraza|égida|aria|balada|marcha/.test(n)) return 3; if (/veneno|envenen|bosque|halcón|ojo/.test(n)) return 4; if (/abismo|marea/.test(n)) return 5; return 6; }
function elemCol(id) { const s = SK[id], e = s && s.eff, a = e && (e.art || e.vfx); const m = { fire: '#ff6a2a', meteor: '#ff4a1a', ice: '#9ae8ff', poison: '#8aff6a', root: '#8aff6a', soul: '#5ab0ff', note: '#ffd040', arrow: '#e8d8a8', bigarrow: '#ffe8a0', arrowrain: '#e8d8a8', phoenix: '#ff9a2a', dark: '#a040e0', void: '#c070ff', dagger: '#d8e0ea' }; if (a && m[a]) return m[a];
  return { guerrero: '#ffd890', mago: '#c070ff', arquero: '#a8e070', asesino: '#c070ff', bardo: '#ffd040', invocador: '#5ab0ff', pez: '#5ad0ff' }[s && s.cls] || '#ffffff'; }
{ const _us = useSkill; useSkill = nfxWrap(function (slot) { const P = G.P, id = P && P.slots[slot], cd0 = id ? (P.cds[id] || 0) : 0; const r = _us.apply(this, arguments);
  if (!id || !P || (P.cds[id] || 0) <= cd0) return r; const s = SK[id], col = elemCol(id), au = skAura(id);
  addFx({ type: 'ring', x: P.x, y: P.y, r: 16, dur: 0.35, col }); burst(P.x, P.y - 14, 10, { sp: 50, up: 40, g: -20, life: 0.6, c: [col, '#ffffff'] });   // destello al lanzar
  if (au !== null) { const dur = (s.eff.dur || 8); P.auras = (P.auras || []).filter(a => a.c !== au); P.auras.push({ c: au, until: G.t + dur }); addFx({ type: 'beam', x: P.x, y: P.y, dur: 0.5, col: AU_COL[au] }); }
  return r; }); }
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); const P = G.P; if (!P || !P.auras) return; P.auras = P.auras.filter(a => a.until > G.t); if (P.shield > 0 && !P.auras.some(a => a.c === 9)) P.auras.push({ c: 9, until: G.t + Math.max(0.5, P.shieldT || 1) }); if (P.auras.length) o.au = P.auras.map(a => [a.c, Math.round((a.until - G.t) * 10) / 10]); }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); r.auras = Array.isArray(pr.au) ? pr.au.slice(0, 4).filter(a => Array.isArray(a) && AU_COL[a[0] | 0]).map(a => ({ c: a[0] | 0, until: G.t + clamp(+a[1] || 0, 0, 120) })) : []; }; }
const AU_CV = mkCanvas(128, 128), AU_X = AU_CV.getContext('2d');
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { _de(e, cx, cy);
  if ((e.type !== 'player' && e.type !== 'remote') || !e.auras || !e.auras.length || e.dying || e.dead) return; const A = e.atlas; if (!A || (G.map && G.map.sky && typeof onAir === 'function' && onAir(G.map, e.x, e.y))) return;
  const live = e.auras.filter(a => a.until > G.t); if (!live.length) return; const a = live[Math.floor(G.t * 1.5) % live.length], col = AU_COL[a.c];
  let an = e.anim; if (A.idx[an] === undefined) an = 'idle'; const n = animN(e, an), f = Math.min(e.af || 0, n - 1), c = A.idx[an] + f, row = DIRI[e.dir] || 0;
  const hd = HDS > 1 && A.hd && A.hdDone && A.hdDone[row * (A.hdDone.length / 4) + c], src = hd ? A.hd : A.img, m = hd ? 2 : 1;
  AU_CV.width = A.fw * m; AU_CV.height = A.fh * m; AU_X.clearRect(0, 0, AU_CV.width, AU_CV.height); AU_X.globalCompositeOperation = 'source-over'; AU_X.drawImage(src, c * A.fw * m, row * A.fh * m, A.fw * m, A.fh * m, 0, 0, A.fw * m, A.fh * m);
  AU_X.globalCompositeOperation = 'source-atop'; AU_X.fillStyle = col; AU_X.fillRect(0, 0, AU_CV.width, AU_CV.height); AU_X.globalCompositeOperation = 'source-over';
  const x = Math.round(e.x - A.ax - cx), y = Math.round(e.y - A.ay - cy - (e.z || 0)), pulse = 0.17 + Math.sin(G.t * 6) * 0.06;
  ctx.save(); ctx.globalAlpha = a.c === 2 ? 0.38 : pulse; ctx.drawImage(AU_CV, x, y, A.fw, A.fh); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.35; const g = glowSprite(18, col); ctx.drawImage(g, Math.round(e.x - cx - 18), Math.round(e.y - cy - 30 - (e.z || 0))); ctx.restore();
  if (a.c === 9) { ctx.save(); ctx.strokeStyle = col; ctx.globalAlpha = 0.5 + Math.sin(G.t * 5) * 0.15; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(Math.round(e.x - cx), Math.round(e.y - cy - 13 - (e.z || 0)), 15, 19, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  if (!(typeof OPT !== 'undefined' && OPT.on) && Math.random() < 0.3) part(e.x + (Math.random() - 0.5) * 16, e.y - 4, { z: 4 + Math.random() * 18, vz: 18, life: 0.7, c: col, s: 1 });
}; }
