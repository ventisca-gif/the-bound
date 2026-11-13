// ================= APPEARANCE EDITOR, CHARACTER CREATION & WARDROBE =================
function swatchCss(P) { return uCss(P[2]); }
function gearTiers(P) { const t = s => P.equip[s] ? (ITEMS[P.equip[s].id].tier || 1) : 0; return { weapon: t('weapon') || 1, head: t('head'), body: t('body'), legs: t('legs'), feet: t('feet'), ws: P.equip.weapon && ITEMS[P.equip.weapon.id].ws || undefined }; }
function heroKey(cls, app, gear, cos, hh) { return 'H' + cls + JSON.stringify(app) + JSON.stringify(gear) + JSON.stringify(cos || {}) + (hh ? 1 : 0); }
function playerAtlas(P) { const app = normApp(P.app), gear = gearTiers(P), cos = P.cos || {}; return getAtlas(heroKey(P.cls, app, gear, cos, P.hideHelm), () => buildHeroAtlas(heroLook(P.cls, app, gear, cos, { hideHelm: P.hideHelm }))); }
function remoteAtlas(r) { return getAtlas(heroKey(r.cls, r.app, r.gear, r.cos, r.hh), () => buildHeroAtlas(heroLook(r.cls, r.app, r.gear, r.cos, { hideHelm: r.hh }))); }
// ---------- editor (shared by creation and the stylist) ----------
let edTab = 'cuerpo';
function appEditorHTML(app, tabs) {
  const tb = tabs.map(([k, n]) => `<button class="chip ${edTab === k ? 'on' : ''}" data-edtab="${k}">${n}</button>`).join('');
  const sw = (list, key, cssOf, cur, title) => `<div class="swrow2">${list.map(v => `<button class="sw ${cur === v ? 'on' : ''}" data-ek="${key}" data-ev="${v}" title="${esc(title ? title(v) : String(v))}" aria-label="${esc(title ? title(v) : String(v))}" style="background:${cssOf(v)}"></button>`).join('')}</div>`;
  let body = '';
  if (edTab === 'cuerpo') body = `<h4>Cuerpo</h4><div class="chips">${[['f', 'Femenino'], ['m', 'Masculino']].map(([v, n]) => `<button class="chip ${app.g === v ? 'on' : ''}" data-ek="g" data-ev="${v}">${n}</button>`).join('')}</div>
    <h4>Piel</h4>${sw(SKIN_ORDER, 'skin', v => swatchCss(SKINS[v]), app.skin, v => 'Tono ' + (SKIN_ORDER.indexOf(v) + 1))}
    <h4>Ojos <small>${esc(EYE_N[app.eyes] || '')}</small></h4>${sw(EYE_ORDER, 'eyes', v => EYEC[v], app.eyes, v => EYE_N[v] || v)}
    <h4>Heterocromía · ojo derecho <small>${app.eyes2 ? esc(EYE_N[app.eyes2] || '') : 'igual que el izquierdo'}</small></h4><div class="swrow2"><button class="sw none ${!app.eyes2 ? 'on' : ''}" data-ek="eyes2" data-ev="" title="Igual" aria-label="Igual">✕</button>${EYE_ORDER.filter(v => v !== app.eyes).map(v => `<button class="sw ${app.eyes2 === v ? 'on' : ''}" data-ek="eyes2" data-ev="${v}" title="${esc(EYE_N[v])}" aria-label="${esc(EYE_N[v])}" style="background:${EYEC[v]}"></button>`).join('')}</div>`;
  else if (edTab === 'pelo') { const HS = app.g === 'm' ? HS_M : HS_F; body = `<h4>Peinado <small>${app.hs + 1}/${(app.g === 'm' ? HS_M : HS_F).length} · ${LANG_EN ? (app.g === 'm' ? 'male' : 'female') : app.g === 'm' ? 'masculinos' : 'femeninos'}</small></h4><div class="chips hs">${HS.map((h, i) => `<button class="chip ${app.hs === i ? 'on' : ''}" data-ek="hs" data-ev="${i}">${esc(h.n)}</button>`).join('')}</div>
    <h4>Color de pelo <small>${esc(HAIR_N[app.hair] || '')}</small></h4>${sw(HAIR_ORDER, 'hair', v => swatchCss(HAIRS[v]), app.hair, v => HAIR_N[v])}
    <h4>Mechas · segundo color <small>${app.hair2 ? esc(HAIR_N[app.hair2] || '') : 'ninguno'}</small></h4><div class="swrow2"><button class="sw none ${!app.hair2 ? 'on' : ''}" data-ek="hair2" data-ev="" title="Sin mechas" aria-label="Sin mechas">✕</button>${HAIR_ORDER.filter(v => v !== app.hair).map(v => `<button class="sw ${app.hair2 === v ? 'on' : ''}" data-ek="hair2" data-ev="${v}" title="${esc(HAIR_N[v])}" aria-label="${esc(HAIR_N[v])}" style="background:${swatchCss(HAIRS[v])}"></button>`).join('')}</div>`; }
  else if (edTab === 'ropa') body = `<h4>Parte de arriba</h4><div class="chips">${TOPS.map(([, n], i) => `<button class="chip ${app.top[0] === i ? 'on' : ''}" data-ek="top0" data-ev="${i}">${n}</button>`).join('')}</div>${sw(CLOTH_ORDER, 'top1', v => swatchCss(CLOTH[v]), app.top[1], v => CLOTH_N[v])}
    <h4>Parte de abajo</h4><div class="chips">${BOTS.map(([, n], i) => `<button class="chip ${app.bot[0] === i ? 'on' : ''}" data-ek="bot0" data-ev="${i}">${n}</button>`).join('')}</div>${sw(CLOTH_ORDER, 'bot1', v => swatchCss(CLOTH[v]), app.bot[1], v => CLOTH_N[v])}
    <h4>Calzado</h4><div class="chips">${SHOES.map(([, n], i) => `<button class="chip ${app.shoe[0] === i ? 'on' : ''}" data-ek="shoe0" data-ev="${i}">${n}</button>`).join('')}</div>${sw(CLOTH_ORDER, 'shoe1', v => swatchCss(CLOTH[v]), app.shoe[1], v => CLOTH_N[v])}`;
  return `<div class="chips edtabs">${tb}</div><div class="edbody">${body}</div>`;
}
function bindAppEditor(root, app, onChange) {
  $$('[data-edtab]', root).forEach(b => b.onclick = () => { edTab = b.dataset.edtab; sfx('ui'); onChange(false); });
  $$('[data-ek]', root).forEach(b => b.onclick = () => {
    const k = b.dataset.ek, v = b.dataset.ev;
    if (k === 'g') { if (app.g !== v) { app.g = v; app.hs = 0; } }
    else if (k === 'skin' || k === 'hs') app[k] = +v;
    else if (k === 'hair2') { if (v) app.hair2 = v; else delete app.hair2; }
    else if (k === 'eyes2') { if (v) app.eyes2 = v; else delete app.eyes2; }
    else if (k === 'eyes') { app.eyes = v; if (app.eyes2 === v) delete app.eyes2; }
    else if (k === 'hair') { app.hair = v; if (app.hair2 === v) delete app.hair2; }
    else if (k === 'top0') app.top[0] = +v; else if (k === 'top1') app.top[1] = v;
    else if (k === 'bot0') app.bot[0] = +v; else if (k === 'bot1') app.bot[1] = v;
    else if (k === 'shoe0') app.shoe[0] = +v; else if (k === 'shoe1') app.shoe[1] = v;
    else app[k] = v;
    sfx('ui'); onChange(true);
  });
}
// ---------- character creation ----------
const CC = { cls: 'guerrero', name: '', app: normApp(DEF_APP) };
let ccAtlas = null, ccT = 0, ccDir = 0, ccAnimI = 0;
const CC_ANIMS = ['walk', 'atk', 'cast', 'dance', 'cheer', 'idle'];
function openCreate() {
  $('#tmain').hidden = true; $('#create').hidden = false; $('#title').classList.add('creating');
  const cl = Object.keys(CLASSES);
  $('#ccClasses').innerHTML = cl.map(k => `<button class="ccls ${CC.cls === k ? 'on' : ''}" data-c="${k}"><b style="color:${CLASSES[k].color}">${CLASSES[k].n}</b></button>`).join('') + `<p class="ccdesc">${esc(CLASSES[CC.cls].desc)}</p>`;
  $$('#create .ccls').forEach(b => b.onclick = () => { CC.cls = b.dataset.c; sfx('ui'); openCreate(); });
  const ed = $('#ccEd'); ed.innerHTML = appEditorHTML(CC.app, [['cuerpo', 'Cuerpo'], ['pelo', 'Pelo'], ['ropa', 'Ropa']]);
  bindAppEditor(ed, CC.app, () => openCreate());
  const n = $('#ccName'); n.value = CC.name; n.oninput = () => { CC.name = n.value; n.classList.remove('bad'); };
  $('#ccRotL').onclick = () => { ccDir = (ccDir + 3) % 4; ccT = 0; }; $('#ccRotR').onclick = () => { ccDir = (ccDir + 1) % 4; ccT = 0; };
  $('#ccAnim').onclick = () => { ccAnimI = (ccAnimI + 1) % CC_ANIMS.length; ccT = 0; $('#ccAnim').textContent = { walk: 'Caminar', atk: 'Atacar', cast: 'Hechizo', dance: 'Bailar', cheer: 'Celebrar', idle: 'Quieto' }[CC_ANIMS[ccAnimI]]; };
  $('#ccGo').onclick = () => { const nm = (CC.name || '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 14); if (nm.length < 2) { n.focus(); n.classList.add('bad'); $('#ccMsg').textContent = 'Escribe un nombre de al menos 2 letras.'; return; } const old = loadLocal(); if (old && !$('#ccGo').dataset.ok) { $('#ccGo').dataset.ok = 1; $('#ccMsg').textContent = `Esto reemplazará la partida de ${old.name} (nivel ${old.lv}). Toca de nuevo para confirmar.`; return; } storage.del(slotKey(SLOT)); startGame(null, true, nm); };
  $('#ccBack').onclick = () => { $('#create').hidden = true; $('#tmain').hidden = false; $('#title').classList.remove('creating'); };
  ccAtlas = buildHeroAtlas(heroLook(CC.cls, CC.app, { weapon: 1 }, {}, {}));
}
function drawCreatePreview(dt) {
  const c = $('#ccPrev'); if (!c || $('#create').hidden || !ccAtlas) return; ccT += dt;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height);
  const A = ccAtlas, dir = [0, 1, 3, 2][ccDir], anim = CC_ANIMS[ccAnimI], n = ANIMS[anim][1], f = Math.floor(ccT * (anim === 'atk' ? 7 : anim === 'dance' ? 5 : 7)) % n;
  x.drawImage(A.img, (A.idx[anim] + f) * A.fw, dir * A.fh, A.fw, A.fh, (c.width - A.fw) / 2, c.height - A.fh, A.fw, A.fh);
}
// ---------- wardrobe (cosmetics + stylist) ----------
let wdSlot = 'head', wdMode = 'cos';
const WSLOTS = [['head', 'Cabeza'], ['body', 'Torso'], ['legs', 'Piernas'], ['feet', 'Pies'], ['back', 'Espalda']];
function giveCosmetic(id, silent) { const P = G.P; P.wardrobe = P.wardrobe || []; if (!COSM[id] || P.wardrobe.includes(id)) return false; P.wardrobe.push(id); if (!silent) { toast('Nuevo cosmético: ' + COSM[id].n, 'quest'); tip('wardrobe'); } markDirty(true); return true; }
function refreshLook() { const P = G.P; P.atlas = playerAtlas(P); uiDirty.hud = true; netPresence(true); }
let wdPrevT = 0, wdAtlas = null;
function renderWardrobe(B) {
  const P = G.P; P.cos = P.cos || {}; P.wardrobe = P.wardrobe || []; const app = P.app = normApp(P.app);
  const owned = P.wardrobe.filter(id => COSM[id] && COSM[id].slot === wdSlot);
  const cur = P.cos[wdSlot] || null;
  const opt = (v, label, ic) => `<button class="wdo ${cur === v || (!cur && v === null) ? 'on' : ''}" data-wv="${v === null ? '' : v}">${ic || ''}<span>${esc(label)}</span></button>`;
  const gearName = P.equip[wdSlot] ? ITEMS[P.equip[wdSlot].id].n : (wdSlot === 'back' ? 'Según tu clase' : wdSlot === 'head' ? 'Sin casco' : 'Ropa base');
  const allOfSlot = Object.values(COSM).filter(c => c.slot === wdSlot);
  B.innerHTML = `<div class="wdwrap"><div class="frame wdL"><canvas id="wdPrev" width="48" height="48"></canvas><div class="row"><button class="btn sm" id="wdRot">Girar</button><label class="tg"><input type="checkbox" id="wdHelm" ${P.hideHelm ? 'checked' : ''}> Ocultar casco</label></div><div class="chips">${[['cos', 'Cosméticos'], ['style', 'Estilista']].map(([k, n]) => `<button class="chip ${wdMode === k ? 'on' : ''}" data-wm="${k}">${n}</button>`).join('')}</div><p class="hint">${wdMode === 'cos' ? 'Los cosméticos cambian tu aspecto sin tocar tus estadísticas. Los sueltan los jefes y se venden en la tienda de cosméticos.' : 'Cambia tu peinado, colores y ropa base cuando quieras, gratis.'}</p></div>
  <div class="frame wdR">${wdMode === 'cos' ? `<div class="chips">${WSLOTS.map(([k, n]) => `<button class="chip ${wdSlot === k ? 'on' : ''}" data-ws="${k}">${n}</button>`).join('')}</div>
  <div class="wdlist">${opt(null, 'Mostrar equipo: ' + gearName)}${wdSlot !== 'back' && wdSlot !== 'head' ? opt('base', 'Mostrar mi ropa base') : ''}${owned.map(id => opt(id, COSM[id].n)).join('')}</div>
  <h4>Colección ${owned.length}/${allOfSlot.length}</h4><div class="wdcoll">${allOfSlot.map(c => `<span class="${P.wardrobe.includes(c.id) ? 'got' : ''}">${esc(c.n)} <small>${P.wardrobe.includes(c.id) ? '✓' : '· ' + esc(c.src || '')}</small></span>`).join('')}</div>` : `<div id="wdEd">${appEditorHTML(app, [['cuerpo', 'Cuerpo'], ['pelo', 'Pelo'], ['ropa', 'Ropa']])}</div>`}</div></div>`;
  $$('[data-wm]', B).forEach(b => b.onclick = () => { wdMode = b.dataset.wm; sfx('ui'); renderPanel(); });
  $$('[data-ws]', B).forEach(b => b.onclick = () => { wdSlot = b.dataset.ws; sfx('ui'); renderPanel(); });
  $$('[data-wv]', B).forEach(b => b.onclick = () => { const v = b.dataset.wv || null; if (v) P.cos[wdSlot] = v; else delete P.cos[wdSlot]; sfx('equip'); refreshLook(); markDirty(true); renderPanel(); });
  const hb = $('#wdHelm'); if (hb) hb.onchange = () => { P.hideHelm = hb.checked ? 1 : 0; refreshLook(); markDirty(true); renderPanel(); };
  const ed = $('#wdEd'); if (ed) bindAppEditor(ed, app, ch => { if (ch) { refreshLook(); markDirty(true); } renderPanel(); });
  $('#wdRot').onclick = () => { wdDir = (wdDir + 1) % 4; };
  wdAtlas = P.atlas;
}
let wdDir = 0;
function drawWardrobePreview(dt) {
  const c = $('#wdPrev'); if (!c || $('#panel').hidden || panelTab !== 'wardrobe' || !G.P) return; wdPrevT += dt;
  const A = G.P.atlas, x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height);
  const f = Math.floor(wdPrevT * 6) % 4; x.drawImage(A.img, (A.idx.walk + f) * A.fw, [0, 1, 3, 2][wdDir] * A.fh, A.fw, A.fh, (c.width - A.fw) / 2, c.height - A.fh, A.fw, A.fh);
}
