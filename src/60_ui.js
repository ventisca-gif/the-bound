// ================= UI: HUD & touch controls =================
const $ = s => document.querySelector(s), $$ = (s, root) => [...(root || document).querySelectorAll(s)];
const uiDirty = { hud: true, inv: true, quest: true, skills: true };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function frameImage() {
  // v3.6: marco dorado brillante con esquinas ornamentadas (estilo de la maqueta de Sergio); el centro es transparente y el fondo lo pone el CSS
  const p = new Pix(24, 24), ink = C('#1a0806'), o1 = C('#8a4208'), o2 = C('#e8961c'), o3 = C('#ffcf4a'), o4 = C('#fff2a8'), sh = C('#4a1e08');
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) { const e = Math.min(x, y, 23 - x, 23 - y); const c = e === 0 ? ink : e === 1 ? o1 : e === 2 ? o3 : e === 3 ? o2 : e === 4 ? sh : 0; if (c) p.set(x, y, c); }
  for (let k = 3; k < 21; k++) { p.set(k, 2, o4); p.set(2, k, o4); }   // brillo arriba/izquierda
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {         // esquinas: escuadra con rizo y gema
    const ox = sx > 0 ? 0 : 23, oy = sy > 0 ? 0 : 23, P_ = (x, y, c) => p.set(ox + sx * x, oy + sy * y, c);
    for (let k = 0; k < 8; k++) { P_(k, 0, ink); P_(0, k, ink); }
    for (let k = 1; k < 7; k++) { P_(k, 1, o3); P_(1, k, o3); P_(k, 2, o2); P_(2, k, o2); }
    P_(3, 3, o3); P_(4, 3, o2); P_(3, 4, o2); P_(5, 4, o1); P_(4, 5, o1); P_(1, 1, o4); P_(2, 2, o4);
    P_(5, 5, o4); P_(6, 5, o3); P_(5, 6, o3); P_(6, 6, o2);
  }
  return p.canvas().toDataURL();
}
function setupHUD() {
  document.documentElement.style.setProperty('--icons', `url(${ICON.url})`);
  document.documentElement.style.setProperty('--frame', `url(${frameImage()})`);
  $('#hbChar').innerHTML = iconHTML(['sword', 3], 26); $('#hbBag').innerHTML = iconHTML(['bag'], 26); $('#hbBook').innerHTML = iconHTML(['book'], 26); $('#hbPot').innerHTML = iconHTML(['potion', '#e02838'], 26) + '<em id="potN">0</em>';
  $('#bAtk').innerHTML = iconHTML(['atk'], 40); $('#bDash').innerHTML = iconHTML(['run'], 24); $('#bMenu').innerHTML = iconHTML(['gear'], 20); $('#bMap').innerHTML = iconHTML(['map'], 20);
  // joystick
  const joy = $('#joy'), knob = $('#knob'); let jid = null, jc = null;
  const jmove = (e) => { const r = joy.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; let dx = e.clientX - cx, dy = e.clientY - cy; const R = r.width * 0.4, L = Math.hypot(dx, dy); if (L > R) { dx = dx / L * R; dy = dy / L * R; } knob.style.transform = `translate(${dx}px,${dy}px)`; const m = Math.hypot(dx, dy) / R; inp.jx = m < 0.18 ? 0 : dx / R; inp.jy = m < 0.18 ? 0 : dy / R; };
  joy.addEventListener('pointerdown', e => { jid = e.pointerId; joy.setPointerCapture(jid); joy.classList.add('on'); jmove(e); audioUnlock(); e.preventDefault(); });
  joy.addEventListener('pointermove', e => { if (e.pointerId === jid) jmove(e); });
  const jend = e => { if (e.pointerId !== jid) return; jid = null; inp.jx = inp.jy = 0; knob.style.transform = ''; joy.classList.remove('on'); };
  joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);
  const hold = (el, down, up) => { el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); audioUnlock(); el.classList.add('down'); el.setPointerCapture(e.pointerId); down(e); }); const u = e => { el.classList.remove('down'); up && up(e); }; el.addEventListener('pointerup', u); el.addEventListener('pointercancel', u); };
  hold($('#bAtk'), () => { inp.attack = true; basicAttack(); }, () => { inp.attack = false; });
  hold($('#bDash'), () => dodgeRoll());
  hold($('#bAct'), () => { if (reel.on) { reel.hold = true; return; } doInteract(); }, () => { reel.hold = false; });
  $$('.sk').forEach(b => hold(b, () => useSkill(+b.dataset.s)));
  $('#hbChar').onclick = () => openPanel('char'); $('#hbBag').onclick = () => openPanel('inv'); $('#hbBook').onclick = () => openPanel('quest'); $('#hbPot').onclick = () => quickPotion();
  $('#tracker').onclick = () => openPanel('quest'); $('#mmwrap').onclick = () => openPanel('map'); $('#bMap').onclick = () => openPanel('map'); $('#bMenu').onclick = () => openPanel('opts');
  $('#bOnline').onclick = () => { sfx('ui'); openParty(); };
  $('#bChat').onclick = () => openChat(); $('#bChat').innerHTML = iconHTML(['chat'], 18);
  document.addEventListener('contextmenu', e => e.preventDefault());
}
function onKey(e) {
  if (!G.P || !$('#title').hidden) return;
  if (e.code === 'Escape') { if (!$('#panel').hidden) closePanel(); else if (!$('#modal').hidden) closeModal(); else if (!$('#dialog').hidden) closeDialog(); else openPanel('opts'); return; }
  if (!$('#panel').hidden || !$('#modal').hidden || !$('#dialog').hidden) { if ((e.code === 'KeyE' || e.code === 'Space') && reel.on) reel.hold = true; return; }
  const m = { KeyI: 'inv', KeyB: 'inv', KeyC: 'char', KeyK: 'skills', KeyQ: 'quest', KeyM: 'map', KeyO: 'jobs' }[e.code]; if (m) { openPanel(m); return; }
  if (e.code === 'KeyE' || e.code === 'Enter') doInteract(); if (e.code === 'ShiftLeft' || e.code === 'KeyL') dodgeRoll(); if (e.code === 'KeyH') quickPotion();
  if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) useSkill(+e.code.slice(5) - 1);
}
addEventListener('keyup', e => { if (e.code === 'KeyE' || e.code === 'Space') reel.hold = false; });
// ---------- HUD update ----------
let hudT = 0, mmT = 0, lastAct = '', portraitKey = '';
function updateHUD(dt) {
  const P = G.P; if (!P) return; hudT += dt; mmT += dt;
  if (hudT > 0.1 || uiDirty.hud) {
    hudT = 0; uiDirty.hud = false; const S = P.S;
    $('#lvtag').textContent = 'Lv. ' + P.lv;
    $('#hpbar i').style.width = (100 * P.hp / S.maxhp).toFixed(1) + '%'; $('#hpT').textContent = fmt(Math.ceil(P.hp)) + ' / ' + fmt(S.maxhp);
    $('#mpbar i').style.width = (100 * P.mp / S.maxmp).toFixed(1) + '%'; $('#mpT').textContent = fmt(P.mp) + ' / ' + fmt(S.maxmp);
    $('#xpbar i').style.width = (P.lv >= MAXLV ? 100 : 100 * P.xp / xpToNext(P.lv)).toFixed(1) + '%';
    $('#shbar').style.width = P.shield > 0 ? (100 * Math.min(1, P.shield / S.maxhp)).toFixed(1) + '%' : '0';
    if (P.atlas !== portraitKey) { portraitKey = P.atlas; drawPortrait($('#pcv'), P.atlas); }
    // skills
    $$('.sk').forEach((b, i) => { const id = P.slots[i]; if (!id || !P.skills[id]) { if (b.dataset.id !== '') { b.innerHTML = '<span class="lk">+</span>'; b.dataset.id = ''; } b.classList.add('empty'); return; } b.classList.remove('empty'); if (b.dataset.id !== id) { b.dataset.id = id; b.innerHTML = iconHTML(SK[id].icon, 24) + '<em></em><u></u>'; } const cd = P.cds[id] || 0, s = SK[id]; b.querySelector('u').style.height = cd > 0 ? (100 * cd / s.cd) + '%' : '0'; b.querySelector('em').textContent = cd > 0 ? Math.ceil(cd) : ''; b.classList.toggle('nomp', P.mp < s.mp); });
    $('#potN').textContent = countItem(P.potion) || ['pocion4', 'pocion3', 'pocion2', 'pocion1'].reduce((a, k) => a || countItem(k), 0);
    // buffs
    const bh = P.buffs.map(b => `<span class="buff" title="${esc(SK[b.id] ? SK[b.id].n : 'Comida')}">${iconHTML(SK[b.id] ? SK[b.id].icon : ['food', 1], 16)}<em>${Math.ceil(b.t)}</em></span>`).join('') + (P.poison > 0 ? `<span class="buff bad">${iconHTML(['drop', '#6ae04a'], 16)}</span>` : '');
    if ($('#buffs').innerHTML !== bh) $('#buffs').innerHTML = bh;
    // interact button
    const it = (!P.dead && !G.paused) ? interactTarget() : null; const key = P.fishing ? 'fish:' + P.fishing.state : it ? it.label : '';
    if (it && !P.fishing) { const tk = it.kind === 'tree' ? 'tree' : it.kind === 'ore' ? 'ore' : it.kind === 'fish' ? 'fish' : it.kind === 'herb' ? 'herb' : it.kind === 'waystone' ? 'ways' : null; if (tk) tip(tk); }
    if (key !== lastAct) { lastAct = key; const b = $('#bAct'); if (P.fishing) { b.hidden = false; b.innerHTML = iconHTML(['rod', 2], 24) + `<span>${P.fishing.state === 'bite' ? '¡Tira!' : P.fishing.state === 'reel' ? 'Mantén' : 'Recoger'}</span>`; b.classList.toggle('alert', P.fishing.state === 'bite'); } else if (it) { b.hidden = false; b.classList.remove('alert'); b.innerHTML = iconHTML(it.icon === 'axe' ? ['axe', 2] : it.icon === 'pick' ? ['pick', 2] : it.icon === 'rod' ? ['rod', 2] : it.icon === 'herb' ? ['herb', 1] : [it.icon], 24) + `<span>${it.label}</span>`; } else b.hidden = true; }
    // time / zone
    const hh = Math.floor(G.time / 60), mm = Math.floor(G.time % 60);
    const zn = P.map === 'world' ? (() => { const W = G.world, i = W.I(clamp(Math.floor(P.x / 16), 0, W.w - 1), clamp(Math.floor(P.y / 16), 0, W.h - 1)); return W.townAt[i] >= 0 ? TOWNS[W.townAt[i]].n : REGIONS[W.reg[i]].n; })() : CAVES[P.map] ? CAVES[P.map].n : 'Interior';
    const zt = `${calShort()} · ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')} · ${zn}`; if ($('#zone').textContent !== zt) $('#zone').textContent = zt;
    $('#goldT').textContent = fmt(P.gold);
    if (G.bossBar) { const b = G.bossBar; $('#bossbar i').style.width = (100 * Math.max(0, b.hp) / b.maxhp) + '%'; if (b.hp <= 0 || b.remove) showBoss(null); }
  }
  if (uiDirty.quest) { uiDirty.quest = false; updateTracker(); if (!$('#panel').hidden && panelTab === 'quest') renderPanel(); }
  if (mmT > 0.15) { mmT = 0; drawMinimap(); }
  updateToasts(dt);
}
function drawPortrait(cvs, A) { const x = cvs.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, cvs.width, cvs.height); const fw = A.fw; const s = cvs.width / 26; x.drawImage(A.img, 0, 0, fw, fw, Math.round(-(fw / 2 - 13) * s), Math.round(-(fw * 0.22) * s), fw * s, fw * s); }
function updateTracker() {
  const P = G.P; const id = P.track && P.quests.active[P.track] ? P.track : Object.keys(P.quests.active)[0]; const el = $('#tracker');
  if (!id) { const avail = Object.keys(QUESTS).find(k => canOffer(k) && QUESTS[k].main); if (avail) { el.hidden = false; $('#trT').textContent = 'Siguiente: ' + QUESTS[avail].n; $('#trD').textContent = 'Habla con ' + NPCS[QUESTS[avail].giver].n + ' (!)'; } else el.hidden = true; return; }
  P.track = id; const Q = QD(id); el.hidden = false; el.classList.toggle('main', !!Q.main); $('#trT').textContent = Q.n;
  if (questReady(id)) { const n = turnInNpc(Q); $('#trD').textContent = 'Vuelve con ' + (NPCS[n] ? NPCS[n].n : 'Kael'); return; }
  const lines = Q.obj.map((o, i) => objText(Q, i)).filter(Boolean); $('#trD').textContent = lines.join(' · ');
}
function objText(Q, i) {
  const o = Q.obj[i], c = objCount(Q, i), n = o.n || 1, pr = n > 1 ? ` (${c}/${n})` : c >= n ? ' ✓' : '';
  if (o.txt) return o.txt + pr;
  switch (o.t) { case 'kill': return 'Derrota ' + (o.m ? MOBS[o.m].n : famName(o.fam)) + pr; case 'boss': return 'Derrota a ' + BOSSES[o.b].n + pr; case 'talk': return 'Habla con ' + NPCS[o.npc].n + pr; case 'item': return 'Consigue ' + ITEMS[o.it].n + pr; case 'job': return (o.job === 'pesca' ? 'Pesca' : o.job === 'tala' ? 'Tala' : o.job === 'mineria' ? 'Mina' : 'Recolecta') + (o.tier ? ' (nivel ' + o.tier + '+)' : '') + pr; case 'craft': return 'Fabrica ' + (ITEMS[o.it] ? ITEMS[o.it].n : 'un arma') + pr; case 'level': return 'Alcanza el nivel ' + n; }
  return '';
}
function famName(f) { return { slime: 'slimes', lobo: 'lobos', hongo: 'hongos', cangrejo: 'cangrejos', goblin: 'goblins', bandido: 'bandidos', orco: 'orcos', esqueleto: 'esqueletos', fantasma: 'espectros' }[f] || f; }
// ---------- minimap ----------
let mmBase = null;
function buildMinimapBase() {
  const W = G.world, c = mkCanvas(W.w, W.h), x = c.getContext('2d'), id = x.createImageData(W.w, W.h), d = new Uint32Array(id.data.buffer);
  for (let i = 0; i < W.w * W.h; i++) {
    const t = W.ter[i]; let col;
    if (t === T.DEEP) col = C('#1e3c6e'); else if (t === T.WATER || t === T.FALL) col = C('#3a7ab8'); else if (t === T.LAVA) col = C('#e84a14'); else if (t === T.SAND) col = C('#d8c088'); else if (t === T.SNOW) col = C('#e6eef8'); else if (t === T.DIRT || t === T.BRIDGE || t === T.PLANK) col = C('#b08a58'); else if (t === T.COBBLE || t === T.STONE) col = C('#9a948a'); else if (t === T.FACE || t === T.STAIRS) col = C('#5a4c40'); else if (t === T.CWALL || t === T.PALI) col = C('#6a6470'); else if (t === T.MUD) col = C('#5a4a36'); else if (t === T.ASH) col = C('#4a3e3a'); else if (t === T.FARM) col = C('#7a5a3a');
    else { col = W.gpalF ? W.gpalF[i * 5 + 2] : GP.valle[2]; }
    if (W.lvl[i] > 0 && !(t === T.WATER || t === T.DEEP)) col = uMix(col, C('#ffffff'), 0.08 * W.lvl[i]);
    const o = W.objAt[i]; if (o >= 0) { const ob = W.objs[o]; if (ob.k === 'tree') col = uMul(col, 0.72); else if (ob.k === 'bld' || ob.k === 'castle' || ob.k === 'magetower') col = C('#b04a3a'); }
    d[i] = col;
  }
  x.putImageData(id, 0, 0); mmBase = c;
}
function drawMinimap() {
  const P = G.P, cvs = $('#mm'), x = cvs.getContext('2d'); x.imageSmoothingEnabled = false; const S = cvs.width, sc = 3;
  x.fillStyle = '#0c0a10'; x.fillRect(0, 0, S, S);
  if (P.map === 'world') {
    const tx = P.x / 16, ty = P.y / 16; x.drawImage(mmBase, Math.round(-tx * sc + S / 2), Math.round(-ty * sc + S / 2), mmBase.width * sc, mmBase.height * sc);
    for (const e of G.ents) { if (e.map !== 'world' || (e.type !== 'mob' && e.type !== 'npc')) continue; const dx = (e.x / 16 - tx) * sc + S / 2, dy = (e.y / 16 - ty) * sc + S / 2; if (dx < 0 || dy < 0 || dx > S || dy > S) continue; x.fillStyle = e.type === 'npc' ? (npcMarker(e.id) ? '#ffe040' : '#f0e0b0') : e.boss ? '#ff40a0' : '#ff4040'; x.fillRect(Math.round(dx) - 1, Math.round(dy) - 1, e.boss ? 4 : 2, e.boss ? 4 : 2); }
    for (const r of G.remote.values()) { if (r.map !== 'world') continue; const dx = (r.x / 16 - tx) * sc + S / 2, dy = (r.y / 16 - ty) * sc + S / 2; x.fillStyle = PARTY.id && r.pt === PARTY.id ? '#7aff8a' : '#5ae0ff'; x.fillRect(Math.round(dx) - 1, Math.round(dy) - 1, 3, 3); }
    const tg = guideTarget(); if (tg) { const loc = guidePos(tg); if (loc) { let dx = (loc[0] - tx) * sc, dy = (loc[1] - ty) * sc; const L = Math.hypot(dx, dy), R = S / 2 - 7; const inside = L < R; if (!inside) { dx = dx / L * R; dy = dy / L * R; } const t2 = textSprite(inside ? '!' : '>', '#ffd23a'); x.save(); x.translate(Math.round(dx + S / 2), Math.round(dy + S / 2)); if (!inside) x.rotate(Math.atan2(dy, dx)); x.drawImage(t2, -t2.width, -t2.height, t2.width * 2, t2.height * 2); x.restore(); } }
  } else { x.fillStyle = '#2a1e16'; x.fillRect(S * 0.2, S * 0.25, S * 0.6, S * 0.5); x.fillStyle = '#a89c88'; const t = textSprite('INTERIOR', '#d8c8a8'); x.drawImage(t, (S - t.width) / 2, S / 2 - 4); }
  // player arrow
  x.save(); x.translate(S / 2, S / 2); x.rotate({ up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 }[P.dir]); x.fillStyle = '#ffffff'; x.strokeStyle = '#1a1010'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(0, -6); x.lineTo(4.5, 5); x.lineTo(0, 2.5); x.lineTo(-4.5, 5); x.closePath(); x.stroke(); x.fill(); x.restore();
}
// ---------- toasts & banners ----------
const toastQ = [];
function toast(msg, kind, rar) { toastQ.push({ msg, kind, rar, t: 0 }); if (toastQ.length > 5) toastQ.shift(); renderToasts(); }
function renderToasts() { $('#toasts').innerHTML = toastQ.map(t => `<div class="toast ${t.kind || ''}" style="${t.rar ? 'color:' + RARC[t.rar] : ''}">${esc(t.msg)}</div>`).join(''); }
function updateToasts(dt) { let ch = false; for (const t of toastQ) { t.t += dt; } while (toastQ.length && toastQ[0].t > 3.2) { toastQ.shift(); ch = true; } if (ch) renderToasts(); }
let bannerT = null;
// ---------- tips (first-time hints) ----------
const TIPS = {
  move: 'Muévete con el <b>joystick</b> y ataca con el <b>botón de la espada</b>. Las misiones aparecen arriba a la izquierda y la <b>flecha dorada</b> te guía.',
  tools: 'Las herramientas no se equipan: basta con <b>llevarlas en la mochila</b>. La Anciana Mira te regala hacha, caña y pico.',
  tree: 'Árbol al frente: pulsa el botón de <b>acción</b> para talar y conseguir troncos.',
  ore: 'Veta de mineral: pulsa el botón de <b>acción</b> para minar con tu pico.',
  fish: 'Agua: pulsa <b>acción</b> para lanzar la caña. Cuando pique, toca otra vez y <b>mantén</b> para que el pez quede en la zona verde.',
  herb: 'Planta: pulsa <b>acción</b> para recogerla. Sirve para pociones y comida.',
  skill: '¡Tienes <b>puntos de habilidad</b>! Abre el menú › Habilidades, aprende una y toca un botón vacío <b>+</b> para colocarla.',
  attr: 'Tienes <b>puntos de atributo</b>: asígnalos en el menú › Personaje.',
  potion: 'Vida baja: toca la <b>poción</b> de la barra inferior para curarte.',
  town: 'En las ciudades puedes <b>comprar</b>, <b>forjar</b> equipo con el herrero y <b>descansar</b> en la posada (también guarda la partida).',
  ways: 'Las <b>piedras de viaje</b> te teletransportan a cualquier piedra que ya hayas activado.',
  boss: '¡Un <b>jefe</b>! Aléjate de las zonas rojas que marcan sus ataques.',
  death: 'Has caído. Mejora tu equipo en la herrería, sube de nivel y vuelve a intentarlo.',
  bag: 'Tu mochila está casi llena: <b>vende</b> lo que no uses en una tienda.',
  craft: 'Con materiales puedes <b>forjar</b> armas y armaduras mejores. El herrero te muestra qué necesitas.',
  wardrobe: 'Los <b>cosméticos</b> cambian tu aspecto sin perder estadísticas: menú › Armario.',
};
let tipT = null;
function tip(k, force) {
  const P = G.P; if (!P || P.ghost || !TIPS[k] || !SETTINGS.tips) return; P.tips = P.tips || {}; if (P.tips[k] && !force) return; P.tips[k] = 1;
  const el = $('#tipbox'); el.innerHTML = TIPS[k]; el.hidden = false; el.onclick = () => { el.hidden = true; }; clearTimeout(tipT); tipT = setTimeout(() => { el.hidden = true; }, 9000); markDirty();
}
function banner(a, b) { const el = $('#banner'); el.innerHTML = `<b>${esc(a)}</b>${b ? `<small>${esc(b)}</small>` : ''}`; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); clearTimeout(bannerT); bannerT = setTimeout(() => el.classList.remove('show'), 2600); }
function showBoss(m) { G.bossBar = m; const el = $('#bossbar'); if (!m) { el.hidden = true; return; } tip('boss'); el.hidden = false; el.querySelector('b').textContent = m.name + ' · Nv. ' + m.lv; }
function vibrate(ms) { if (SETTINGS.vib && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { } }
