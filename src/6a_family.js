// ================= FAMILY: house expansion, children (mixed looks), children as allies =================
const KID_STAGES = [['Bebé', 0], ['Niño', 3], ['Joven', 8]]; // [name, calendar days since birth]
const KID_MAX = 3;
FURN_CAT.crib = { n: 'Cuna', slot: 'crib', price: 2500 };
FURN_CAT.kidbed = { n: 'Cama infantil', slot: 'kid', price: 1800 };
FURN_CAT.toybox = { n: 'Baúl de juguetes', slot: 'deco', price: 600 };
HSLOTS.push(['crib', 'Cuna', 5, 4]);
const HSLOTS2 = [['kid1', 'Cuarto de los niños 1', 15, 3], ['kid2', 'Cuarto de los niños 2', 17, 3], ['deco4', 'Rincón de juegos', 14, 8], ['deco5', 'Ventanal', 18, 9], ['rug2', 'Alfombra del cuarto', 16, 6], ['paint2', 'Cuadro 2', 15, 1]];
Object.assign(SLOT_CAT, { kid1: 'kid', kid2: 'kid', deco4: 'deco', deco5: 'deco', rug2: 'rug', paint2: 'paint' });
const HOUSE_UP = 15000;
function kidStName(k, st) { return st === 1 ? (k.g === 'f' ? 'Niña' : 'Niño') : KID_STAGES[st][0]; }
function kidStage(k) { const d = calDay() - (k.born || 0); return d >= KID_STAGES[2][1] ? 2 : d >= KID_STAGES[1][1] ? 1 : 0; }
function kidLv(k) { return kidStage(k) < 2 ? 1 : Math.max(1, G.P.lv - 3); }
// ---------- appearance mixing ----------
function partnerApp(k) {
  const L = NPCS[k] && NPCS[k].look || {}; const hair = Object.keys(HAIRS).find(h => HAIRS[h] === L.hair) || 'castano';
  let skin = SKINS.indexOf(L.skin); if (skin < 0) skin = 1; const eyes = EYE_ORDER.includes(L.eyes) ? L.eyes : 'cafe';
  return { g: ROM[k] ? ROM[k].g : 'f', hair, skin, eyes };
}
function mixApps(g, n) {
  const P = G.P, A = normApp(P.app), B = partnerApp(P.partner), out = [], seen = new Set();
  for (let t = 0; out.length < n && t < 60; t++) {
    const r = () => Math.random() < 0.5; const hair = r() ? A.hair : B.hair, other = hair === A.hair ? B.hair : A.hair;
    const skins = [A.skin, B.skin, Math.round((A.skin + B.skin) / 2)];
    const app = { g, skin: skins[Math.floor(Math.random() * 3)], hair, eyes: r() ? A.eyes : B.eyes, hs: Math.floor(Math.random() * 15), top: [Math.floor(Math.random() * 3), pick(CLOTH_ORDER)], bot: [g === 'f' ? pick([0, 2]) : pick([0, 1]), pick(CLOTH_ORDER)], shoe: [0, 'marron'] };
    if (other !== hair && Math.random() < 0.55) app.hair2 = other;
    const key = JSON.stringify(app); if (!seen.has(key)) { seen.add(key); out.push(app); }
  }
  return out;
}
// ---------- kid atlas & entity ----------
function kidGear(k) { const t = s => k.equip && k.equip[s] && ITEMS[k.equip[s].id] ? ITEMS[k.equip[s].id].tier || 1 : 0; return { weapon: t('weapon'), head: t('head'), body: t('body'), legs: t('legs'), feet: t('feet') }; }
function kidAtlas(k) { const app = normApp(k.app), cls = k.cls || 'guerrero', gear = kidGear(k); return getAtlas('K' + heroKey(cls, app, gear, {}, 0), () => buildHeroAtlas(heroLook(cls, app, gear, {}, {}))); }
function kidEnt(k, map, x, y) { const e = { type: 'kid', kid: k, id: 'kid_' + k.id, x, y, L: 0, map, dir: 'down', anim: 'idle', af: 0, at: 0, home: { x, y }, wt: 1 + Math.random() * 2, cd: 0, scale: kidStage(k) === 1 ? 0.78 : 0.92, name: k.name }; e.atlas = kidAtlas(k); G.ents.push(e); return e; }
function refreshKidAtlas(k) { for (const e of G.ents) if (e.type === 'kid' && e.kid === k) { e.atlas = kidAtlas(k); e.scale = kidStage(k) === 1 ? 0.78 : 0.92; } }
// ---------- update ----------
let FOLLOW_KIDS = [];
function updateKid(e, dt) {
  const P = G.P, k = e.kid; e.cd -= dt;
  if (e.scene) return;
  if (k.follow) {
    if (e.map !== P.map) { e.map = P.map; e.x = P.x - 12; e.y = P.y + 8; }
    const teen = kidStage(k) === 2; let tgt = null;
    if (teen && P.map === G.map.id) { let bd = 130 * 130; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === e.map && m.state !== 'dummy') { const d = dist2(m.x, m.y, P.x, P.y); if (d < bd) { bd = d; tgt = m; } } }
    const C = CLASSES[k.cls || 'guerrero'], ranged = C.range > 60;
    let tx, ty;
    if (tgt) { const a = Math.atan2(e.y - tgt.y, e.x - tgt.x); const rr = ranged ? 70 : 16; tx = tgt.x + Math.cos(a) * rr; ty = tgt.y + Math.sin(a) * rr * 0.7; }
    else { const idx = FOLLOW_KIDS.indexOf(e), dv = DIRV[P.dir] || [0, 1]; tx = P.x - dv[0] * 20 + (idx ? 14 : -14); ty = P.y - dv[1] * 16 + 6; }
    const dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy);
    if (L > 220) { e.x = P.x; e.y = P.y + 6; }
    else if (L > 2) { const sp = Math.min(L * 6, (P.S.spd || 70) * 1.3); if (!moveEnt(G.map, e, dx / L * sp * dt, dy / L * sp * dt) && L > 40) { e.x = tx; e.y = ty; } }
    if (tgt) { e.dir = dirFromVec(tgt.x - e.x, tgt.y - e.y); const d = Math.hypot(tgt.x - e.x, tgt.y - e.y);
      if (e.cd <= 0 && d < (ranged ? 150 : 30)) { e.cd = C.aspd * 1.5; setAnim(e, 'atk'); e.loopAnim = false; const atk = kidAtk(k);
        if (ranged) spawnProj('p', e.x, e.y - 8, Math.atan2(tgt.y - e.y, tgt.x - e.x), { spd: C.weapon === 'bow' ? 300 : 220, dmg: atk, art: C.weapon === 'bow' ? 'arrow' : C.weapon === 'lute' ? 'note' : 'orb', life: 0.8, kidShot: 1 });
        else { hitMob(tgt, atk, { kb: 10, kid: 1 }); addFx({ type: 'slash', x: e.x, y: e.y, ang: Math.atan2(tgt.y - e.y, tgt.x - e.x), arc: 1.8, r: 20, dur: 0.16 }); } } }
    else e.dir = L > 4 ? dirFromVec(dx, dy) : P.dir;
    if (e.anim === 'atk' && e.af < animN(e, 'atk') - 1) stepAnim(e, dt, 10);
    else { setAnim(e, L > 5 ? 'walk' : 'idle', true); e.loopAnim = true; stepAnim(e, dt, L > 5 ? 9 : 2); }
    return;
  }
  // at home: wander
  e.wt -= dt; if (e.wt <= 0) { e.wt = 2 + Math.random() * 3; e.goal = Math.random() < 0.6 ? { x: e.home.x + (Math.random() - 0.5) * 70, y: e.home.y + (Math.random() - 0.5) * 40 } : null; }
  if (e.goal) { const dx = e.goal.x - e.x, dy = e.goal.y - e.y, L = Math.hypot(dx, dy); if (L > 3) { moveEnt(G.map, e, dx / L * 34 * dt, dy / L * 34 * dt); e.dir = dirFromVec(dx, dy); setAnim(e, 'walk', true); stepAnim(e, dt, 8); } else { e.goal = null; setAnim(e, Math.random() < 0.15 ? 'dance' : 'idle', true); } }
  else stepAnim(e, dt, e.anim === 'dance' ? 7 : 2);
}
function kidAtk(k) { let w = 0; if (k.equip && k.equip.weapon && ITEMS[k.equip.weapon.id]) w = ITEMS[k.equip.weapon.id].atk || 0; return Math.round((w + kidLv(k) * 4 + 15) * 1.1); }
// ---------- house: spawn kids & crib baby ----------
function homeFamily(M) {
  const P = G.P; P.kids = P.kids || [];
  for (const k of P.kids) { if (k.follow) continue; const st = kidStage(k); if (st === 0) continue; kidEnt(k, M.id, (6 + Math.random() * 4) * 16, (5 + Math.random() * 2) * 16); }
}
function babyInCrib(id) { const P = G.P; return (P.kids || []).some(k => kidStage(k) === 0); }
// ---------- family event ----------
function canHaveKid() { const P = G.P, cfg = homeCfg(P.inside); return P.partner && cfg && cfg.f.crib === 'crib' && (P.kids || []).length < KID_MAX && rel(P.partner).a >= 900; }
function familyTalk(npc) {
  const P = G.P, cfg = P.inside && homeCfg(P.inside);
  if ((P.kids || []).length >= KID_MAX) { romanceMenu(npc, 'Nuestra familia ya está completa. ¡Somos muy felices! ♥'); return; }
  if (!cfg || cfg.f.crib !== 'crib') { romanceMenu(npc, 'Me encantaría formar una familia contigo... pero primero necesitamos una cuna en casa. (Decorar → Cuna)'); return; }
  if (P.inside !== npc.map) { romanceMenu(npc, 'Hablemos de esto en casa, con calma.'); return; }
  closeDialog(); openFamilyModal();
}
function openFamilyModal() {
  const P = G.P, nm = nick(P.partner);
  openModal(`<div class="ending"><h2>¿Formamos una familia?</h2><p>${esc(nm)} te mira con una sonrisa: «He pensado mucho en ello... ¿y si cuidamos juntos de un pequeño o una pequeña?»</p><div class="row"><button class="btn gold" id="famYes">Sí, formemos una familia</button><button class="btn" id="famNo">Todavía no</button></div></div>`, 'party');
  $('#famNo').onclick = () => { closeModal(); toast(nm + ': Cuando estés listo/a, aquí estaré ♥', 'info'); };
  $('#famYes').onclick = () => { closeModal(); transition(() => { openModal(`<div class="ending"><h1>Unos días después...</h1><p>La casa se llena de risas. ¡Ha llegado un nuevo miembro a la familia!</p><div class="row"><button class="btn gold" id="famNext">Conocer al bebé</button></div></div>`, 'party'); $('#famNext').onclick = () => { closeModal(); openNaming('f'); }; }); };
}
let nameOpts = null;
function openNaming(g) {
  nameOpts = mixApps(g, 6); let sel = 0;
  const render = () => {
    openModal(`<h2>Tu bebé</h2><p class="hint">Así podría ser cuando crezca: cada opción mezcla tu pelo, ojos y piel con los de ${esc(nick(G.P.partner))}. Puedes cambiarle el peinado más adelante en el espejo.</p>
      <div class="chips">${[['f', 'Niña'], ['m', 'Niño']].map(([v, n]) => `<button class="chip ${g === v ? 'on' : ''}" data-kg="${v}">${n}</button>`).join('')}<button class="chip" id="kReroll">Otras combinaciones</button></div>
      <div class="kidopts">${nameOpts.map((a, i) => `<button class="kidopt ${sel === i ? 'on' : ''}" data-ko="${i}"><canvas width="72" height="84" data-kc="${i}"></canvas><small>${esc(HAIR_N[a.hair])}${a.hair2 ? ' + ' + esc(HAIR_N[a.hair2]) : ''}</small></button>`).join('')}</div>
      <label>Nombre</label><input id="kName" maxlength="14" placeholder="Nombre del bebé" autocomplete="off"><div class="row"><button class="btn gold" id="kOk">¡Bienvenido/a a casa!</button></div><p class="hint" id="kMsg"></p>`, 'party');
    $$('[data-kc]').forEach(cv => { const a = nameOpts[+cv.dataset.kc], A = buildHeroAtlas(heroLook('guerrero', a, { weapon: 0 }, {}, {})); const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; const s = Math.min(cv.width / A.fw, cv.height / A.fh) * 1.4; x.drawImage(A.img, A.idx.idle * A.fw, 0, A.fw, A.fh, (cv.width - A.fw * s) / 2, cv.height - A.fh * s + 6, A.fw * s, A.fh * s); });
    $$('[data-ko]').forEach(b => b.onclick = () => { sel = +b.dataset.ko; const n = $('#kName').value; render(); $('#kName').value = n; });
    $$('[data-kg]').forEach(b => b.onclick = () => { g = b.dataset.kg; nameOpts = mixApps(g, 6); sel = 0; render(); });
    $('#kReroll').onclick = () => { nameOpts = mixApps(g, 6); sel = 0; render(); };
    $('#kOk').onclick = () => { const nm = ($('#kName').value || '').replace(/[^\p{L}\p{N} _-]/gu, '').trim().slice(0, 14); if (nm.length < 2) { $('#kMsg').textContent = 'Escribe un nombre de al menos 2 letras.'; return; }
      const P = G.P; P.kids = P.kids || []; P.kids.push({ id: Date.now().toString(36), name: nm, g, app: nameOpts[sel], born: calDay(), parent: P.partner, equip: {} }); closeModal(); sfx('level');
      toast('¡Bienvenido/a, ' + nm + '! Crecerá con los días (mira el calendario)', 'quest', 6); addRel(P.partner, 30, 30, P.x, P.y - 30); rebuildHome(); markDirty(true); };
  };
  render();
}
// ---------- kid interaction ----------
function openKid(e) {
  const P = G.P, k = e.kid, st = kidStage(k), age = calDay() - (k.born || 0);
  const nextIn = st < 2 ? KID_STAGES[st + 1][1] - age : 0;
  const eq = ['weapon', 'head', 'body', 'legs', 'feet'].map(sl => { const s = k.equip[sl], it = s && ITEMS[s.id]; return `<button class="srow" data-kun="${sl}">${it ? iconHTML(it.icon, 22) : ''}<div class="sn"><b>${it ? esc(it.n) : '—'}</b><small>${({ weapon: 'Arma', head: 'Cabeza', body: 'Torso', legs: 'Piernas', feet: 'Pies' })[sl]}${it ? ' · tocar para quitar' : ''}</small></div></button>`; }).join('');
  const inv = st === 2 && k.cls ? P.inv.map((s, i) => [s, i]).filter(([s]) => { const it = ITEMS[s.id]; return it.slot && ['weapon', 'head', 'body', 'legs', 'feet'].includes(it.slot) && (!it.cls || it.cls === k.cls); }).map(([s, i]) => { const it = ITEMS[s.id]; return `<button class="srow" data-keq="${i}">${iconHTML(it.icon, 22)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${esc(it.n)}</b><small>Equipar</small></div></button>`; }).join('') : '';
  openModal(`<h2>${esc(k.name)} <small>· ${kidStName(k, st)}${k.cls ? ' · ' + CLASSES[k.cls].n + ' Nv. ' + kidLv(k) : ''}</small></h2>
    <p class="hint">${st < 2 ? 'Crecerá en ' + nextIn + ' día' + (nextIn === 1 ? '' : 's') + '. ' : '¡Ya es mayor! Puede acompañarte y luchar a tu lado (sube de nivel contigo y no puede caer en combate). '}Hijo/a de ${esc(G.P.name)} y ${esc(k.parent && NPCS[k.parent] ? nick(k.parent) : '—')}.</p>
    <div class="row wrap"><button class="btn sm" id="kHug">Abrazar</button>${st >= 1 ? `<button class="btn sm ${k.follow ? '' : 'gold'}" id="kFol">${k.follow ? 'Volver a casa' : 'Ven conmigo'}</button>` : ''}<button class="btn sm" id="kStyle">Cambiar peinado y ropa</button></div>
    ${st === 2 && !k.cls ? `<h3>¿Qué quiere ser de mayor?</h3><div class="row wrap">${Object.keys(CLASSES).map(c => `<button class="btn sm" data-kcls="${c}">${CLASSES[c].n}</button>`).join('')}</div>` : ''}
    ${st === 2 && k.cls ? `<h3>Equipo</h3><div class="upwrap"><div class="slist">${eq}</div><div class="slist">${inv || '<p class="hint">No tienes equipo de ' + CLASSES[k.cls].n + ' en la mochila.</p>'}</div></div>` : ''}
    <div class="row"><button class="btn" id="mclose">Cerrar</button></div>`, 'party');
  $('#mclose').onclick = closeModal;
  $('#kHug').onclick = () => { closeModal(); romScene(e, 'hug', () => { toast(k.name + ': ¡Te quiero mucho! ♥', 'loot'); }); };
  const f = $('#kFol'); if (f) f.onclick = () => { k.follow = !k.follow; if (k.follow) { FOLLOW_KIDS.push(e); toast(k.name + ' te acompaña', 'quest'); } else { FOLLOW_KIDS = FOLLOW_KIDS.filter(x => x !== e); e.remove = true; toast(k.name + ' vuelve a casa', 'info'); } closeModal(); markDirty(true); };
  $('#kStyle').onclick = () => { openKidStyle(e); };
  $$('[data-kcls]').forEach(b => b.onclick = () => { k.cls = b.dataset.kcls; refreshKidAtlas(k); toast(k.name + ' será ' + CLASSES[k.cls].n, 'quest'); markDirty(true); openKid(e); });
  $$('[data-keq]').forEach(b => b.onclick = () => { const s = P.inv[+b.dataset.keq]; if (!s) return; const sl = ITEMS[s.id].slot; P.inv.splice(+b.dataset.keq, 1); if (k.equip[sl]) P.inv.push(k.equip[sl]); k.equip[sl] = s; sfx('equip'); refreshKidAtlas(k); uiDirty.inv = true; markDirty(true); openKid(e); });
  $$('[data-kun]').forEach(b => b.onclick = () => { const sl = b.dataset.kun; if (!k.equip[sl]) return; if (P.inv.length >= INV_MAX) { toast('Inventario lleno', 'warn'); return; } P.inv.push(k.equip[sl]); delete k.equip[sl]; sfx('equip'); refreshKidAtlas(k); uiDirty.inv = true; markDirty(true); openKid(e); });
}
function openKidStyle(e) {
  const k = e.kid, app = normApp(k.app); edTab = 'pelo';
  const render = () => { openModal(`<h2>Estilo de ${esc(k.name)}</h2>${appEditorHTML(app, [['pelo', 'Pelo'], ['ropa', 'Ropa']])}<div class="row"><button class="btn gold" id="ksOk">Listo</button></div>`, 'party'); bindAppEditor($('#modal'), app, () => render()); $('#ksOk').onclick = () => { k.app = app; refreshKidAtlas(k); markDirty(true); openKid(e); }; };
  render();
}
// teleport following kids with the player
function familyOnMap(M, x, y) { const P = G.P; for (const k of P.kids || []) if (k.follow) { let e = G.ents.find(q => q.type === 'kid' && q.kid === k && !q.remove); if (!e) { e = kidEnt(k, M.id, x, y + 8); } else { e.map = M.id; e.x = x - 10; e.y = y + 8; } if (!FOLLOW_KIDS.includes(e)) FOLLOW_KIDS.push(e); } FOLLOW_KIDS = FOLLOW_KIDS.filter(e => !e.remove && e.kid.follow); }
