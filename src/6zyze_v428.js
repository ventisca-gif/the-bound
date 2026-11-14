// ================= v4.28: hijos equilibrados, con su propio nivel, objetivo de los enemigos, PvP y expediciones =================
// Fuerza: a su mismo nivel un hijo hace el 50 % de tu daño por segundo (nunca más) y tiene el 60 % de tu vida y tu defensa (más con armadura).
// Nivel propio hasta 350: gana experiencia contigo o explorando solo. Te acompañan como mucho 2 a la vez.
// Puedes tener 3 hijos con cada pareja (6 en total con dos parejas).
const KID_POW = 0.5, KID_FOL_MAX = 2, KID_PER_PARTNER = 3, KID_TOTAL_MAX = 6, KID_PVP = 0.4;
function kidArmor(k) { let n = 0; for (const s of ['head', 'body', 'legs', 'feet']) if (k.equip && k.equip[s] && ITEMS[k.equip[s].id]) n++; return n; }
function kidRatio(k) { const P = G.P; return Math.min(1, (kidLv(k) + 20) / ((P.lv || 1) + 20)); }
function kidGearF(k) { const w = k.equip && k.equip.weapon && ITEMS[k.equip.weapon.id]; if (!w) return 0.55; return clamp(0.55 + 0.45 * ((w.lv || 1) + 10) / (kidLv(k) + 10), 0.55, 1); }
kidLv = function (k) { if (kidStage(k) < 2) return 1; if (!k.lv) { k.lv = clamp((G.P && G.P.lv || 1) - 3, 1, MAXLV); k.xp = 0; } return k.lv; };
kidAtk = function (k) { const P = G.P, S = P.S || {}, C = CLASSES[k.cls || 'guerrero'], pa = S.aspd || CLASSES[P.cls].aspd;
  // daño por golpe para que su daño por segundo sea el 50 % del tuyo (ataca cada aspd × 1,5)
  return Math.max(1, Math.round((S.atk || 10) * KID_POW * kidRatio(k) * kidGearF(k) * (C.aspd * 1.5 / pa))); };
kidMaxHp = function (k) { const P = G.P, S = P.S || {}; if (kidStage(k) < 2) return Math.round((150 + (P.lv || 1) * 20) * 0.6); return Math.max(60, Math.round((S.maxhp || 300) * 0.6 * kidRatio(k) * (0.8 + 0.05 * kidArmor(k)))); };
function kidDef(k) { const S = G.P.S || {}; return Math.round((S.def || 10) * kidRatio(k) * (0.8 + 0.05 * kidArmor(k))); }
function kidGainXp(k, n) { if (kidStage(k) < 2 || !k.cls) return; kidLv(k); if (k.lv >= MAXLV) { k.xp = 0; return; } k.xp = (k.xp || 0) + Math.max(1, Math.round(n)); let up = 0;
  while (k.lv < MAXLV && k.xp >= xpToNext(k.lv)) { k.xp -= xpToNext(k.lv); k.lv++; up++; }
  if (up) { k.hp = kidMaxHp(k); if (!k.explore) toast(L2(`${k.name} sube a nivel ${k.lv}`, `${k.name} reaches level ${k.lv}`), 'quest'); kidLog(k, L2(`Subió a nivel ${k.lv}`, `Reached level ${k.lv}`)); markDirty(); } }
function kidLog(k, s) { k.log = k.log || []; k.log.unshift([Date.now(), s]); if (k.log.length > 14) k.log.length = 14; }
// experiencia: los hijos que te acompañan ganan la misma que tú (algo más si van por detrás)
{ const _gx = gainXp; gainXp = function (n) { const P = G.P; for (const e of FOLLOW_KIDS) if (e && !e.remove && !e.down && e.map === P.map && e.kid) kidGainXp(e.kid, n * (kidLv(e.kid) < P.lv ? 1.25 : 0.9)); return _gx.apply(this, arguments); }; }
// daño bruto de un enemigo o jugador: aplica la defensa propia del hijo
function kidHurtRaw(e, base, lv) { kidHurt(e, base * dmgRedP(kidDef(e.kid), lv || G.P.lv) * (0.9 + Math.random() * 0.2)); }

// ---------- límite: 2 te acompañan, 3 hijos por pareja ----------
function kidsOf(pk) { return (G.P.kids || []).filter(k => (k.parent || G.P.partner) === pk); }
function kidFull() { const P = G.P; return (P.kids || []).length >= KID_TOTAL_MAX || kidsOf(P.partner).length >= KID_PER_PARTNER; }
canHaveKid = function () { const P = G.P, cfg = homeCfg(P.inside); return P.partner && cfg && cfg.f.crib === 'crib' && !kidFull() && rel(P.partner).a >= 900; };
{ const _ft = familyTalk; familyTalk = function (npc) { const P = G.P;
  if (kidFull()) { const cfg = P.inside && homeCfg(P.inside); if (!cfg || P.inside !== npc.map) { romanceMenu(npc, L2('Nuestra familia ya está completa. ¡Somos muy felices! ♥', 'Our family is complete. We are so happy! ♥')); return; }
    closeDialog(); const nm = nick(P.partner);
    openModal(`<div class="ending"><h2>${L2('Un rato a solas', 'Some time alone')}</h2><p>${esc(nm)}: ${L2('«Nuestra familia ya está completa… pero eso no quita que pasemos un rato juntos.»', '"Our family is complete… but we can still spend some time together."')}</p><div class="row"><button class="btn gold" id="famBed">${L2('Ir a la cama ♥', 'Go to bed ♥')}</button><button class="btn" id="famNo">${L2('Ahora no', 'Not now')}</button></div></div>`, 'party');
    $('#famNo').onclick = closeModal; $('#famBed').onclick = () => { closeModal(); bedScene(() => { addRel(P.partner, 15, 15, P.x, P.y - 30); toast(L2(nm + ': Te quiero ♥', nm + ': I love you ♥'), 'loot'); markDirty(); }); }; return; }
  // el límite antiguo (3 en total) ya no manda: cuenta los hijos de esta pareja
  const ks = P.kids; P.kids = kidsOf(P.partner); try { return _ft.apply(this, arguments); } finally { P.kids = ks; } }; }
function folCount() { return FOLLOW_KIDS.filter(e => e && !e.remove && e.kid && e.kid.follow).length; }

// ---------- la ficha del hijo: nivel, límite, mochila y expediciones ----------
{ const _ok = openKid; openKid = function (e) { const k = e.kid; if (e.down) return _ok(e); _ok(e); const body = $('#mbody'); if (!body) return;
  const st = kidStage(k);
  const fb = $('#kFol'); if (fb && !k.follow && !kidResting(k)) { const f0 = fb.onclick; if (k.explore) { fb.textContent = L2('Está de expedición', 'On an expedition'); fb.disabled = true; }
    else fb.onclick = ev => { if (folCount() >= KID_FOL_MAX) { toast(L2(`Solo pueden acompañarte ${KID_FOL_MAX} hijos a la vez`, `Only ${KID_FOL_MAX} kids can follow you at once`), 'warn'); return; } f0 && f0(ev); }; }
  if (st < 2 || !k.cls) return;
  const h2 = body.querySelector('h2 small'); if (h2) h2.textContent = ` · ${CLASSES[k.cls].n} Nv. ${kidLv(k)}`;
  const box = document.createElement('div'); const need = kidLv(k) >= MAXLV ? 0 : xpToNext(kidLv(k)), pct = need ? Math.floor((k.xp || 0) / need * 100) : 100;
  const inv = (k.inv || []).map(s => { const it = ITEMS[s.id]; return it ? `<div class="srow">${iconHTML(it.icon, 22)}<div class="sn"><b style="color:${RARC[it.rar || 0]}">${esc(it.n)}${s.n > 1 ? ' ×' + s.n : ''}</b><small>${it.lv ? 'Nv. ' + it.lv : ''}</small></div></div>` : ''; }).join('');
  const where = k.explore ? kidWhere(k) : '';
  box.innerHTML = `<p class="hint">${L2('Experiencia', 'Experience')}: ${pct}% · ${L2('Fuerza', 'Power')}: ${Math.round(KID_POW * kidRatio(k) * kidGearF(k) * 100)}% ${L2('de la tuya', 'of yours')} · ${L2('Ataque', 'Attack')} ${fmt(kidAtk(k))} · ${L2('Vida', 'HP')} ${fmt(kidMaxHp(k))}</p>
    <h3>${L2('Expedición', 'Expedition')}</h3>
    ${k.explore ? `<p class="hint">📍 ${esc(where)}</p>` : `<p class="hint">${L2('Puede salir a explorar el mundo por su cuenta: viaja en tren, barco o aeronave, lucha, sube de nivel, guarda lo que encuentra en su mochila y se equipa solo. Si pasas cerca, le verás luchando.', 'They can explore the world alone: travel by train, ship or airship, fight, level up, keep loot in their own bag and gear up. Pass nearby to see them fighting.')}</p>`}
    <div class="row wrap">${k.explore ? `<button class="btn sm gold" id="kxJoin">${L2('Formar equipo (viene contigo)', 'Team up (joins you)')}</button><button class="btn sm" id="kxHome">${L2('Volver a casa', 'Come home')}</button><button class="btn sm" id="kxGo">${L2('Ir a donde está', 'Go to them')}</button>` : `<button class="btn sm gold" id="kxSend">${L2('Mandar a explorar', 'Send exploring')}</button>`}</div>
    ${(k.log || []).length ? `<details><summary>${L2('Diario', 'Journal')}</summary>${k.log.map(([t, s]) => `<p class="hint">${new Date(t).toLocaleTimeString().slice(0, 5)} · ${esc(s)}</p>`).join('')}</details>` : ''}
    <h3>${L2('Su mochila', 'Their bag')} <small>(${L2('solo mirar', 'view only')}) · ${fmt(k.gold || 0)} ${L2('oro', 'gold')}</small></h3><div class="slist">${inv || `<p class="hint">${L2('Vacía', 'Empty')}</p>`}</div>`;
  const row = $('#mclose') && $('#mclose').parentElement; if (row && row.parentElement === body) body.insertBefore(box, row); else body.appendChild(box);
  const b1 = $('#kxSend'); if (b1) b1.onclick = () => { if (kidResting(k)) { toast(L2('Está descansando', 'Resting'), 'warn'); return; } kidExplore(k, e); closeModal(); };
  const b2 = $('#kxJoin'); if (b2) b2.onclick = () => { if (folCount() >= KID_FOL_MAX) { toast(L2(`Solo pueden acompañarte ${KID_FOL_MAX} hijos a la vez`, `Only ${KID_FOL_MAX} kids can follow you at once`), 'warn'); return; } kidRecall(k, true); closeModal(); };
  const b3 = $('#kxHome'); if (b3) b3.onclick = () => { kidRecall(k, false); closeModal(); };
  const b4 = $('#kxGo'); if (b4) b4.onclick = () => { const c = k.xc; if (c && c.m === 'world') { G.P.wp = { x: c.x * 16, y: c.y * 16, m: 'world', n: k.name }; toast(L2('Sigue la flecha dorada', 'Follow the golden arrow'), 'quest'); } else toast(L2('Está lejos: ' + kidWhere(k), 'Far away: ' + kidWhere(k)), 'info'); closeModal(); };
}; }

// ---------- expediciones ----------
// Zonas lejanas por nivel (viaja con el transporte de cada una). En el mundo principal elige un campamento de su nivel.
const KX_FAR = [[150, 'El Archipiélago', 'The Archipelago', 'barco'], [195, 'Islas del Cielo', 'Sky Islands', 'aeronave'], [225, 'Altavela', 'Altavela', 'aeronave'], [255, 'El Velo Roto', 'The Broken Veil', 'portal']];
const KX_TR = { tren: ['Tomó el tren', 'Took the train'], barco: ['Subió al galeón', 'Boarded the galleon'], yate: ['Cogió el yate', 'Took the yacht'], aeronave: ['Voló en la aeronave', 'Flew on the airship'], portal: ['Cruzó el portal', 'Crossed the portal'], pie: ['Fue caminando', 'Walked'] };
function kidWhere(k) { const c = k.xc; if (!c) return L2('Preparándose', 'Getting ready'); return c.m === 'world' ? L2(`Mundo principal, campamento de nivel ${c.lv} (${c.x}, ${c.y})`, `Main world, level ${c.lv} camp (${c.x}, ${c.y})`) : L2(c.n, c.ne); }
function kidPickZone(k) { const L = kidLv(k), W = G.world, far = KX_FAR.filter(z => L >= z[0]); if (far.length && Math.random() < 0.75) { const z = far[far.length - 1 - (Math.random() < 0.3 && far.length > 1 ? 1 : 0)]; return { m: 'far', n: z[1], ne: z[2], tr: z[3], lv: z[0] }; }
  const cs = (W && W.camps || []).filter(c => c.lv <= L + 2 && c.lv >= L - 10); const pool = cs.length ? cs : (W && W.camps || []).slice().sort((a, b) => Math.abs(a.lv - L) - Math.abs(b.lv - L)).slice(0, 8);
  const c = pick(pool); return c ? { m: 'world', x: c.x, y: c.y, lv: c.lv, tr: Math.random() < 0.5 ? 'tren' : Math.random() < 0.5 ? 'yate' : 'pie' } : { m: 'far', n: 'Camino', ne: 'Road', tr: 'pie', lv: L }; }
function kidExplore(k, e) { k.explore = 1; k.follow = false; k.xt = Date.now(); k.xc = kidPickZone(k); FOLLOW_KIDS = FOLLOW_KIDS.filter(q => q.kid !== k); for (const q of G.ents) if (q.type === 'kid' && q.kid === k) q.remove = true;
  kidLog(k, L2(KX_TR[k.xc.tr][0] + ' → ' + kidWhere(k), KX_TR[k.xc.tr][1] + ' → ' + kidWhere(k))); toast(L2(`${k.name} sale de expedición: ${kidWhere(k)}`, `${k.name} leaves on an expedition: ${kidWhere(k)}`), 'quest', 5); sfx('quest'); markDirty(true); }
function kidRecall(k, join) { k.explore = 0; for (const q of G.ents) if (q.type === 'kid' && q.kid === k) q.remove = true; const P = G.P;
  kidLog(k, L2('Volvió de la expedición', 'Back from the expedition'));
  if (join) { k.follow = true; const e = kidEnt(k, P.map, P.x - 12, P.y + 10); FOLLOW_KIDS.push(e); toast(L2(`${k.name} se une a tu equipo`, `${k.name} joins your team`), 'quest'); }
  else { k.follow = false; toast(L2(`${k.name} vuelve a casa`, `${k.name} heads home`), 'info'); rebuildHome && P.inside && rebuildHome(); }
  markDirty(true); }
// botín de la expedición: equipo de su clase y de su nivel, oro y algún material
function kidLoot(k) { const L = kidLv(k), pool = Object.entries(ITEMS).filter(([id, it]) => it.slot && ['weapon', 'head', 'body', 'legs', 'feet'].includes(it.slot) && (!it.cls || it.cls === k.cls) && (it.lv || 1) <= L && (it.lv || 1) >= L - 25 && !it.quest && !it.cos);
  if (!pool.length) return null; const [id] = pick(pool); return id; }
function kidAutoEquip(k) { k.equip = k.equip || {}; let ch = 0;
  for (const s of k.inv || []) { const it = ITEMS[s.id]; if (!it || !it.slot || !['weapon', 'head', 'body', 'legs', 'feet'].includes(it.slot) || (it.cls && it.cls !== k.cls) || (it.lv || 1) > kidLv(k)) continue;
    const cur = k.equip[it.slot] && ITEMS[k.equip[it.slot].id]; if (!cur || (it.lv || 1) > (cur.lv || 1)) { const old = k.equip[it.slot]; k.equip[it.slot] = s; k.inv = k.inv.filter(q => q !== s); if (old) k.inv.push(old); ch = 1; kidLog(k, L2('Se equipó ' + it.n, 'Equipped ' + it.n)); } }
  if (ch) refreshKidAtlas(k); }
function kidSimStep(k) { // un minuto de expedición
  if (kidResting(k)) return; const L = kidLv(k), c = k.xc || (k.xc = kidPickZone(k));
  const gf = kidGearF(k), risk = c.lv > L + 2 ? 0.08 : 0.025 * (1.2 - gf);
  if (Math.random() < risk) { k.restUntil = Date.now() + KID_REST_MS; kidLog(k, L2('Cayó en combate y descansa un rato', 'Fell in battle and is resting')); return; }
  kidGainXp(k, xpToNext(L) / 22 * (0.7 + gf * 0.5)); k.gold = (k.gold || 0) + Math.round((5 + L * 1.5) * (0.5 + Math.random()));
  if (Math.random() < 0.18) { const id = kidLoot(k); if (id) { k.inv = k.inv || []; if (k.inv.length >= 30) k.inv.shift(); k.inv.push({ id }); kidLog(k, L2('Encontró ' + ITEMS[id].n, 'Found ' + ITEMS[id].n)); kidAutoEquip(k); } }
  if (Math.random() < 0.06) { const z = kidPickZone(k); if (z.m !== c.m || z.x !== c.x) { k.xc = z; kidLog(k, L2(KX_TR[z.tr][0] + ' → ' + kidWhere(k), KX_TR[z.tr][1] + ' → ' + kidWhere(k))); } } }
function kidSimTick() { const P = G.P; if (!P || !P.kids) return; const now = Date.now();
  for (const k of P.kids) { if (!k.explore) continue; if (!k.xt) k.xt = now; let n = Math.floor((now - k.xt) / 60000); if (n <= 0) continue; n = Math.min(n, 8 * 60); k.xt += n * 60000; for (let i = 0; i < n; i++) kidSimStep(k); markDirty(); } }
setInterval(() => { try { if (G.P && !titleMode) { kidSimTick(); kidExploreSpawn(); } } catch (err) { console.warn(err); } }, 3000);
// si pasas cerca de su campamento, le ves luchando allí
function kidExploreSpawn() { const P = G.P; for (const k of P.kids || []) { if (!k.explore || kidResting(k)) continue; const c = k.xc, have = G.ents.find(q => q.type === 'kid' && q.kid === k && !q.remove);
  const near = c && c.m === 'world' && P.map === 'world' && Math.abs(c.x * 16 - P.x) < 520 && Math.abs(c.y * 16 - P.y) < 400;
  if (near && !have) { const e = kidEnt(k, 'world', c.x * 16 + 8, c.y * 16 + 8); e.explore = 1; e.home = { x: e.x, y: e.y }; } else if (!near && have) have.remove = true; } }
// IA del explorador: busca enemigos cerca de su campamento, lucha, esquiva y se cura fuera de combate
function kidExploreAI(e, dt) { const k = e.kid, C = CLASSES[k.cls || 'guerrero'], ranged = C.range > 60; e.cd -= dt;
  let tgt = null, bd = 150 * 150; for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === e.map && m.state !== 'dummy') { const d = dist2(m.x, m.y, e.home.x, e.home.y); if (d < bd) { bd = d; tgt = m; } }
  if (kidDodge(e, dt)) return;
  let tx, ty; if (tgt) { const a = Math.atan2(e.y - tgt.y, e.x - tgt.x), rr = ranged ? 70 : 16; tx = tgt.x + Math.cos(a) * rr; ty = tgt.y + Math.sin(a) * rr * 0.7; }
  else { e.wt -= dt; if (e.wt <= 0 || !e.goal) { e.wt = 2 + Math.random() * 3; e.goal = { x: e.home.x + (Math.random() - 0.5) * 120, y: e.home.y + (Math.random() - 0.5) * 80 }; } tx = e.goal.x; ty = e.goal.y; }
  const dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy);
  if (L > 2) { const sp = Math.min(L * 6, tgt ? 80 : 40); moveEnt(G.map, e, dx / L * sp * dt, dy / L * sp * dt); }
  if (tgt) { e.dir = dirFromVec(tgt.x - e.x, tgt.y - e.y); const d = Math.hypot(tgt.x - e.x, tgt.y - e.y); if (e.cd <= 0 && d < (ranged ? 150 : 30)) kidStrike(e, tgt, C, ranged); }
  else e.dir = L > 4 ? dirFromVec(dx, dy) : e.dir;
  if (k.hp < kidMaxHp(k) && G.t - (e.combatT || 0) > 4) k.hp = Math.min(kidMaxHp(k), k.hp + kidMaxHp(k) * 0.04 * dt);
  if (e.anim === 'atk' && e.af < animN(e, 'atk') - 1) stepAnim(e, dt, 10); else { setAnim(e, L > 5 ? 'walk' : 'idle', true); e.loopAnim = true; stepAnim(e, dt, L > 5 ? 9 : 2); } }
function kidStrike(e, tgt, C, ranged) { const k = e.kid; e.cd = C.aspd * 1.5; setAnim(e, 'atk'); e.loopAnim = false; const atk = kidAtk(k);
  if (ranged) spawnProj('p', e.x, e.y - 8, Math.atan2(tgt.y - e.y, tgt.x - e.x), { spd: C.weapon === 'bow' ? 300 : 220, dmg: atk, art: C.weapon === 'bow' ? 'arrow' : C.weapon === 'lute' ? 'note' : 'orb', life: 0.8, kidShot: 1, kidE: e });
  else { hitMob(tgt, atk, { kb: 10, kid: 1, kidE: e }); addFx({ type: 'slash', x: e.x, y: e.y, ang: Math.atan2(tgt.y - e.y, tgt.x - e.x), arc: 1.8, r: 20, dur: 0.16 }); } }
// esquivar: si está dentro de un aviso rojo (telegrafiado) sale de él
function teleHas(f, x, y, pad) { if (f.type !== 'tele') return false; const dx = x - f.x, dy = y - f.y;
  if (f.shape === 'circle') return dx * dx + (dy / 0.6) * (dy / 0.6) < (f.r + pad) ** 2;
  if (f.shape === 'line') { const c = Math.cos(f.ang), s = Math.sin(f.ang), al = dx * c + dy * s, pe = -dx * s + dy * c; return al > -pad && al < f.len + pad && Math.abs(pe) < f.w / 2 + pad; }
  if (f.shape === 'cone') { const d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), da = Math.abs(((a - f.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI); return d < f.r + pad && da < f.arc / 2 + 0.2; }
  return false; }
function kidDodge(e, dt) { for (const f of G.fx) { if (f.type !== 'tele' || !teleHas(f, e.x, e.y, 8)) continue; let best = null;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, x = e.x + Math.cos(a) * 30, y = e.y + Math.sin(a) * 22; if (!teleHas(f, x, y, 10)) { best = [Math.cos(a), Math.sin(a)]; break; } }
    if (!best) best = [Math.sign(e.x - f.x) || 1, 0]; moveEnt(G.map, e, best[0] * 130 * dt, best[1] * 130 * dt); e.dir = dirFromVec(best[0], best[1]); setAnim(e, 'walk', true); stepAnim(e, dt, 12); return true; }
  return false; }
let KID_ACT = null;
{ const _uk = updateKid; updateKid = function (e, dt) { const k = e.kid; if (k && k.hp === undefined) k.hp = kidMaxHp(k);
  if (e.explore && !e.down) { KID_ACT = e; try { kidExploreAI(e, dt); } finally { KID_ACT = null; } return; }
  if (k && k.follow && !e.down && !e.scene && kidStage(k) === 2) { if (kidDodge(e, dt)) return; if (kidPvp(e, dt)) return; }
  KID_ACT = e; try { return _uk(e, dt); } finally { KID_ACT = null; } }; }
// el golpe del hijo lleva su entidad: los enemigos pueden fijarse en él
{ const _sp = spawnProj; spawnProj = function (owner, x, y, ang, o) { const r = _sp.apply(this, arguments); if (r && owner === 'p' && o && o.kidShot && KID_ACT) r.kidE = KID_ACT; if (r && owner !== 'p' && KID_AGGRO) r.kidT = KID_AGGRO; return r; }; }
{ const _hm = hitMob; hitMob = function (m, base, src) { src = src || {}; const ke = src.kidE || (src.kid || src.kidShot ? KID_ACT : null);
  if (ke && !m.boss && !m.dying && Math.random() < 0.35) { m.ktgt = ke; if (m.state === 'idle' || m.state === 'return') m.state = 'chase'; }
  else if (!ke && !src.summon && m.ktgt && Math.random() < 0.4) m.ktgt = null;
  if (ke) { const P = G.P, lf = P.S.life; P.S.life = 0; try { return _hm(m, base, src); } finally { P.S.life = lf; } }
  return _hm(m, base, src); }; }

// ---------- los enemigos también atacan a tus hijos ----------
let KID_AGGRO = null, CUR_MOB = null;
function kidProxy(kd) { const RP = G.P, p = Object.create(RP); p.x = kd.x; p.y = kd.y; p.dead = false; p.invis = false; p.downed = false; p.L = RP.L; p.map = kd.map; return p; }
function kidAlive(kd) { return kd && !kd.remove && !kd.down && kd.kid && (kd.kid.follow || kd.explore) && kd.map === G.map.id; }
{ const _hp = hurtPlayer; hurtPlayer = function (base, src) { if (KID_AGGRO) { const kd = KID_AGGRO; if (!kidAlive(kd)) return; kidHurtRaw(kd, base, CUR_MOB && CUR_MOB.lv); return; } return _hp.apply(this, arguments); }; }
{ const _um = updateMob; updateMob = function (m, dt) { CUR_MOB = m;
  try {
    if (!m.boss && !m.dying) {
      // un enemigo tranquilo se fija en el hijo si lo tiene más cerca que a ti
      if (!m.ktgt && m.state === 'idle' && (m.kchk = (m.kchk || 0) - dt) <= 0) { m.kchk = 0.8; const P = G.P, dp = dist2(m.x, m.y, P.x, P.y);
        for (const kd of G.ents) if (kd.type === 'kid' && kidAlive(kd) && kidStage(kd.kid) === 2) { const d = dist2(m.x, m.y, kd.x, kd.y); if (d < (m.aggroR || 80) ** 2 && d < dp) { m.ktgt = kd; break; } } }
      if (m.ktgt && !kidAlive(m.ktgt)) { m.ktgt = null; if (m.state === 'chase' && G.P.dead) m.state = 'return'; }
      if (m.ktgt) { const RP = G.P; G.P = kidProxy(m.ktgt); KID_AGGRO = m.ktgt; try { return _um(m, dt); } finally { G.P = RP; KID_AGGRO = null; } }
    }
    return _um(m, dt);
  } finally { CUR_MOB = null; } }; }
// sus proyectiles buscan al hijo
{ const _up = updateProj; updateProj = function (e, dt) { if (e.owner !== 'p' && e.kidT) { if (!kidAlive(e.kidT)) { e.remove = true; return; } const RP = G.P; G.P = kidProxy(e.kidT); KID_AGGRO = e.kidT; try { return _up(e, dt); } finally { G.P = RP; KID_AGGRO = null; } } return _up(e, dt); }; }
// los ataques de área de los jefes también les alcanzan
{ const _tg = telegraph; telegraph = function (o) { const m = CUR_MOB; if (m && o && typeof o.cb === 'function' && !KID_AGGRO) { const cb = o.cb, f0 = Object.assign({ type: 'tele' }, o); o.cb = f => { const r = cb(f); for (const kd of G.ents) if (kd.type === 'kid' && kidAlive(kd) && teleHas(Object.assign(f0, f || {}, { type: 'tele' }), kd.x, kd.y, 4)) kidHurtRaw(kd, m.atk * 1.4, m.lv); return r; }; } return _tg(o); }; }

// ---------- PvP: tus hijos luchan contra el otro jugador y él puede golpearlos ----------
// Daño de los hijos a jugadores: su golpe × 0,3 (como el tuyo) × 0,4 extra, para que llevar hijos no rompa el duelo.
const PVPK = { out: [], seq: 0 };
function kidPvp(e, dt) { if (typeof pvpOn !== 'function' || !pvpOn()) return false; const P = G.P, k = e.kid;
  if (G.ents.some(m => m.type === 'mob' && !m.dying && m.map === e.map && dist2(m.x, m.y, P.x, P.y) < 130 * 130)) return false;
  let tgt = null, bd = 150 * 150; for (const r of pvpTargets()) { const d = dist2(r.x, r.y, P.x, P.y); if (d < bd) { bd = d; tgt = r; } } if (!tgt) return false;
  const C = CLASSES[k.cls || 'guerrero'], ranged = C.range > 60; e.cd -= dt;
  const a = Math.atan2(e.y - tgt.y, e.x - tgt.x), rr = ranged ? 70 : 16, tx = tgt.x + Math.cos(a) * rr, ty = tgt.y + Math.sin(a) * rr * 0.7, dx = tx - e.x, dy = ty - e.y, L = Math.hypot(dx, dy);
  if (L > 2) { const sp = Math.min(L * 6, (P.S.spd || 70) * 1.2); moveEnt(G.map, e, dx / L * sp * dt, dy / L * sp * dt); }
  e.dir = dirFromVec(tgt.x - e.x, tgt.y - e.y);
  if (e.cd <= 0 && Math.hypot(tgt.x - e.x, tgt.y - e.y) < (ranged ? 150 : 30)) { e.cd = C.aspd * 1.5; setAnim(e, 'atk'); e.loopAnim = false;
    const d = Math.max(1, Math.round(kidAtk(k) * 0.3 * KID_PVP * (PVP_CLS[k.cls] || 1))); PVP.out.push({ to: tgt.id, d, s: ++PVP.seq }); if (PVP.out.length > 8) PVP.out.shift();
    floatText(tgt.x, tgt.y - 34, d, '#ffb0ff'); if (!ranged) addFx({ type: 'slash', x: e.x, y: e.y, ang: Math.atan2(tgt.y - e.y, tgt.x - e.x), arc: 1.8, r: 20, dur: 0.16 }); else spawnProj('p', e.x, e.y - 8, Math.atan2(tgt.y - e.y, tgt.x - e.x), { spd: 260, dmg: 0, art: C.weapon === 'bow' ? 'arrow' : 'orb', life: 0.5, kidShot: 1 }); netPresence(true); }
  if (e.anim === 'atk' && e.af < animN(e, 'atk') - 1) stepAnim(e, dt, 10); else { setAnim(e, L > 5 ? 'walk' : 'idle', true); e.loopAnim = true; stepAnim(e, dt, L > 5 ? 9 : 2); }
  return true; }
// tus golpes a los hijos del otro jugador
function pvpKidHit(r, i, kd, dmg) { const key = r.id + '#' + i, now = G.t; if ((PVP.lastHit.get(key) || 0) > now - 0.22) return; PVP.lastHit.set(key, now);
  const d = Math.max(1, Math.round(dmg * 0.3 * (PVP_CLS[G.P.cls] || 1))); PVPK.out.push({ to: r.id, k: i, d, s: ++PVPK.seq }); if (PVPK.out.length > 8) PVPK.out.shift();
  floatText(kd.x, kd.y - 30, d, '#ffb0ff'); sfx('hit'); netPresence(true); }
function rkids(r) { return (r.rkd || []).map((e, i) => [e, i]).filter(([e]) => e && !e.remove && !e.rdown && e.map === G.P.map); }
{ const _pa = pvpArc; pvpArc = function (x, y, ang, r_, arc, dmg) { _pa.apply(this, arguments); if (!pvpOn()) return; for (const r of pvpTargets()) for (const [e, i] of rkids(r)) { const dx = e.x - x, dy = (e.y - y) * 1.3, d = Math.hypot(dx, dy); if (d > r_ + 8) continue; const a = Math.atan2(dy, dx), da = Math.abs(((a - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (d < 12 || da <= arc / 2) pvpKidHit(r, i, e, dmg); } }; }
{ const _pc = pvpCircle; pvpCircle = function (x, y, r_, dmg) { _pc.apply(this, arguments); if (!pvpOn()) return; for (const r of pvpTargets()) for (const [e, i] of rkids(r)) if (dist2(e.x, (e.y - y) * 1.3 + y, x, y) <= (r_ + 8) ** 2) pvpKidHit(r, i, e, dmg); }; }
{ const _pp = pvpProj; pvpProj = function (e) { _pp.apply(this, arguments); if (!pvpOn() || e.kidShot || e.remove) return; for (const r of pvpTargets()) for (const [k, i] of rkids(r)) { if (e.hit.has(k)) continue; if (dist2(k.x, k.y - 8, e.x, e.y) < 144) { e.hit.add(k); pvpKidHit(r, i, k, e.dmg); if (!e.pierce) { e.remove = true; return; } } } }; }
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); if (PVP.on && PVPK.out.length) o.pvk = PVPK.out; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); const first = r.pvkSeen === undefined; let mx = r.pvkSeen || 0;
  if (Array.isArray(pr.pvk)) for (const h of pr.pvk) { if (!h || !(h.s > (r.pvkSeen || 0))) continue; mx = Math.max(mx, h.s); if (first || h.to !== NET.myId || !PVP.on || !r.pvp || r.map !== G.P.map) continue;
    const kd = FOLLOW_KIDS.filter(q => q && !q.remove && q.map === G.P.map)[h.k | 0]; if (kd && !kd.down) kidHurtRaw(kd, clamp(+h.d || 0, 0, 99999), r.lv); }
  r.pvkSeen = Array.isArray(pr.pvk) ? mx : (r.pvkSeen === undefined ? 0 : r.pvkSeen); }; }

// ---------- botones que tapaban: Montar y el armario de la pareja pasan a la fila de iconos de arriba ----------
{ const st = document.createElement('style'); st.textContent = '#tr .trbtns{flex-wrap:wrap;justify-content:flex-end;max-width:min(60vw,26em)}#mountBtn.mini{position:static;font-size:inherit;padding:0}#bPtW.mini{position:static;width:auto;height:auto}#mountBtn.on{box-shadow:0 0 0 2px #ffd040}'; document.head.appendChild(st); }
mountBtn = function () { const P = G.P, tr = $('#tr .trbtns'); if (!tr) return; let b = $('#mountBtn');
  if (!b) { b = document.createElement('button'); b.id = 'mountBtn'; b.className = 'mini'; b.onclick = () => toggleMount(); tr.insertBefore(b, tr.firstChild); }
  if (b.parentElement !== tr) { b.className = 'mini'; tr.insertBefore(b, tr.firstChild); }
  if (!b.dataset.ic && ICON.keys['mk:horse'] !== undefined) { b.innerHTML = iconHTML(['mk:horse'], 22); b.dataset.ic = 1; }
  b.hidden = !(P && P.mounts && P.mounts.length); const t = P && P.mount ? L2('Desmontar', 'Dismount') : L2('Montar', 'Mount'); b.title = t; b.setAttribute('aria-label', t); b.classList.toggle('on', !!(P && P.mount)); };
V33_TICKS.push(() => { const b = $('#bPtW'), tr = $('#tr .trbtns'); if (b && tr && b.parentElement !== tr) { b.className = 'mini'; tr.insertBefore(b, tr.firstChild); } });

// ---------- lupa: pestaña ⚒ Oficios (tu nivel, cómo se hace, para qué sirve y flecha al sitio más cercano) ----------
// Cada oficio dice qué hacer y dónde. Los oficios nuevos se apuntan en JOB_GUIDE con su función `find`.
function nearObj(kinds, ok) { const P = G.P, W = G.world, px = P.map === 'world' ? P.x : W.w * 8, py = P.map === 'world' ? P.y : W.h * 8; let b = null, bd = Infinity;
  for (const o of W.objs) { if (!kinds.includes(o.k) || o.hidden || (ok && !ok(o))) continue; const d = (o.px - px) ** 2 + (o.py - py) ** 2; if (d < bd) { bd = d; b = o; } } return b; }
// los tenderos que están dentro de un edificio se buscan por la puerta de ese edificio
function nearNpc(shop) { const P = G.P, W = G.world; let b = null, bd = Infinity; for (const e of G.ents) { if (e.type !== 'npc' || !NPCS[e.id] || NPCS[e.id].shop !== shop) continue;
    let x = e.x, y = e.y; if (e.map !== 'world') { const d = (W.doors || []).find(d => d.to === e.map); if (!d) continue; x = d.x * 16 + 8; y = d.y * 16 + 8; }
    const d = (x - P.x) ** 2 + (y - P.y) ** 2; if (d < bd) { bd = d; b = { x, y, id: e.id }; } }
  if (!b) { const pre = { smith: 'herreria_', inn: 'posada_', alchemy: 'alquimia_', store: 'tienda_', tailor: 'boutique_' }[shop]; if (pre) for (const d of W.doors || []) { if (!d.to.startsWith(pre)) continue; const x = d.x * 16 + 8, y = d.y * 16 + 8, dd = (x - P.x) ** 2 + (y - P.y) ** 2; if (dd < bd) { bd = dd; b = { x, y, id: null }; } } }
  return b; }
function nearWater() { const P = G.P, W = G.world, cx = Math.floor((P.map === 'world' ? P.x : W.w * 8) / 16), cy = Math.floor((P.map === 'world' ? P.y : W.h * 8) / 16);
  for (let r = 1; r < 90; r++) for (let dy = -r; dy <= r; dy++) for (const dx of (Math.abs(dy) === r ? Array.from({ length: 2 * r + 1 }, (_, i) => i - r) : [-r, r])) { const x = cx + dx, y = cy + dy; if (x < 1 || y < 1 || x >= W.w - 1 || y >= W.h - 1) continue; const t = W.ter[y * W.w + x]; if (t === T.WATER && !W.solid[y * W.w + x + 1] && W.ter[y * W.w + x + 1] !== T.WATER && W.ter[y * W.w + x + 1] !== T.DEEP) return [x + 1, y]; } return null; }
const jlv = j => (G.P.jobs[j] || { lv: 1 }).lv;
const oLoc = (o, t) => o && { loc: [o.tx !== undefined ? o.tx : Math.floor(o.px / 16), o.ty !== undefined ? o.ty : Math.floor(o.py / 16)], t, m: 'world' };
const eLoc = (e, t) => e && { loc: [Math.floor(e.x / 16), Math.floor(e.y / 16) + 1], t: t + (NPCS[e.id] ? ' · ' + NPCS[e.id].n : ''), m: 'world' };
const JOB_GUIDE = {
  tala: { how: ['Equipa un hacha (gratis con la Anciana Mira) y pulsa «Talar» junto a un árbol. Robles y palmeras desde nivel 1; pino, abedul, ébano, sauce… piden más nivel y mejor hacha.', 'Equip an axe (free from Elder Mira) and press "Chop" next to a tree. Oak and palm from level 1; pine, birch, ebony, willow… need more level and a better axe.'],
    ben: ['Troncos para construir tu casa, muebles, barcos y pedidos del tablón.', 'Logs for your house, furniture, boats and board orders.'], find: () => oLoc(nearObj(['tree'], o => o.st !== 'stump' && RESLV[WOODT[o.sp] || 1] <= jlv('tala')), L2('Árbol para tu nivel', 'Tree for your level')) },
  mineria: { how: ['Equipa un pico y pulsa «Picar» junto a una veta. Cuanto más nivel, mejores metales (cobre → hierro → plata → oricalco…).', 'Equip a pickaxe and press "Mine" next to a vein. Higher level, better metals (copper → iron → silver → orichalcum…).'],
    ben: ['Minerales para la Herrería y la Joyería.', 'Ore for Smithing and Jewelcrafting.'], find: () => oLoc(nearObj(['ore'], o => RESLV[o.tier || 1] <= jlv('mineria')), L2('Veta para tu nivel', 'Vein for your level')) },
  herbo: { how: ['Acércate a una hierba o flor y pulsa «Recoger».', 'Walk up to a herb or flower and press "Gather".'], ben: ['Hierbas para Alquimia y Cocina.', 'Herbs for Alchemy and Cooking.'], find: () => oLoc(nearObj(['herb'], o => RESLV[o.tier || 1] <= jlv('herbo') + 4), L2('Hierbas', 'Herbs')) },
  pesca: { how: ['Equipa una caña, ponte en la orilla mirando al agua y pulsa «Pescar». Cuando pique, toca a tiempo.', 'Equip a rod, stand on the shore facing water and press "Fish". Tap when it bites.'], ben: ['Peces para Cocina y pedidos; algunos son raros y valen mucho oro.', 'Fish for Cooking and orders; rare ones are worth a lot of gold.'], find: () => { const w = nearWater(); return w && { loc: w, t: L2('Orilla para pescar', 'Fishing shore'), m: 'world' }; } },
  excavacion: { how: ['Busca los montículos de tierra y pulsa «Excavar».', 'Find dirt mounds and press "Dig".'], ben: ['Reliquias, gemas y tesoros para vender o para la Joyería.', 'Relics, gems and treasure to sell or for Jewelcrafting.'], find: () => oLoc(nearObj(['mound']), L2('Montículo', 'Mound')) },
  buceo: { how: ['Habla con la instructora de buceo (Isla Brasa) y entra en los puntos de burbujas del mar.', 'Talk to the diving instructor (Ember Isle) and enter the bubble spots at sea.'], ben: ['Perlas, corales y tesoros hundidos; entrada al Fondo Marino.', 'Pearls, coral and sunken treasure; entrance to the Seabed.'], find: () => oLoc(nearObj(['dive']), L2('Punto de buceo', 'Diving spot')) },
  agricultura: { how: ['Compra semillas en la granja, plántalas en un huerto, riega y cosecha.', 'Buy seeds at the farm, plant them in a plot, water and harvest.'], ben: ['Verduras para Cocina y oro estable.', 'Vegetables for Cooking and steady gold.'], find: () => eLoc(nearNpc('farm'), L2('Granja', 'Farm')) || oLoc(nearObj(['plot']), L2('Huerto', 'Plot')) },
  herreria: { how: ['Lleva minerales al herrero y forja armas, armaduras y herramientas.', 'Bring ore to the blacksmith and forge weapons, armour and tools.'], ben: ['Tu mejor equipo sale de aquí (y el de tus hijos).', 'Your best gear comes from here (and your kids\').'], find: () => eLoc(nearNpc('smith'), L2('Herrería', 'Smithy')) },
  alquimia: { how: ['Usa el caldero del alquimista con hierbas.', 'Use the alchemist\'s cauldron with herbs.'], ben: ['Pociones de vida, maná y mejoras.', 'Health, mana and buff potions.'], find: () => eLoc(nearNpc('alchemy'), L2('Alquimista', 'Alchemist')) },
  cocina: { how: ['Cocina en las posadas con pescado, verduras y hierbas.', 'Cook at inns with fish, vegetables and herbs.'], ben: ['Comidas con mejoras de ataque y defensa durante un rato.', 'Meals that boost attack and defence for a while.'], find: () => eLoc(nearNpc('inn'), L2('Posada', 'Inn')) },
  joyeria: { how: ['Con el joyero, engasta gemas en anillos y amuletos.', 'With the jeweller, set gems into rings and amulets.'], ben: ['Accesorios con crítico, vida y maná.', 'Accessories with crit, HP and mana.'], find: () => eLoc(nearNpc('jeweler'), L2('Joyero', 'Jeweller')) },
  sastreria: { how: ['Con el sastre, cose ropa y cosméticos.', 'With the tailor, sew clothes and cosmetics.'], ben: ['Ropa y cosméticos para ti, tu pareja y tus hijos.', 'Clothes and cosmetics for you, your partner and kids.'], find: () => eLoc(nearNpc('tailor'), L2('Sastre', 'Tailor')) },
};
let GJOB = null;
const JOB_IC = { alquimia: ['potion', '#e02838'], cocina: ['food', 3], excavacion: ['shovel', 3], agricultura: ['seed', '#e8c860'], joyeria: ['gem', '#2a6ae0'], buceo: ['shell', 4], sastreria: ['needle'] };
const jobIc = k => { const i = JOBS[k].icon; return JOB_IC[k] || (['axe', 'pick', 'rod'].includes(i) ? [i, 2] : i === 'herb' ? ['herb', 1] : [i]); };
function guiaChipsHTML(tab) { const P = G.P, chips = [['mat', L2('Materiales', 'Materials')], ['eq', L2('Equipo', 'Gear')], ['cos', L2('Cosméticos', 'Cosmetics')], ['boss', L2('Jefes', 'Bosses')], ['job', '⚒ ' + L2('Oficios', 'Jobs')], ['ene', '👹 ' + L2('Enemigos', 'Enemies')], ['sub', '🐺 ' + L2('Subrazas', 'Subraces')], ['sec', '🗝 ' + L2('Secretos', 'Secrets')]];
  return chips.map(([k, n]) => `<button class="chip ${tab === k ? 'on' : ''}" data-gx="${k}">${n}</button>`).join('') + (P.wp ? `<button class="chip danger" id="gOff">✕ ${L2('Apagar flecha', 'Turn arrow off')}</button>` : ''); }
function guiaJobs() { const P = G.P; GUIA.tab = 'job'; const ks = Object.keys(JOBS);
  const list = ks.map(k => { const J = P.jobs[k] || { lv: 1 }; return `<button class="gitem ${GJOB === k ? 'sel' : ''}" data-gj="${k}">${iconHTML(jobIc(k), 20)}<span>${esc(JOBS[k].n)}</span><small>${L2('Nv. ', 'Lv. ')}${J.lv}</small></button>`; }).join('');
  let det; const D = GJOB && JOBS[GJOB], Gd = D && JOB_GUIDE[GJOB];
  if (!D) { const top = ks.slice().sort((a, b) => (P.jobs[b] || { lv: 0 }).lv - (P.jobs[a] || { lv: 0 }).lv)[0]; det = `<p class="hint">${L2('Todos los oficios: tu nivel, cómo se hacen, para qué sirven y la flecha dorada al sitio más cercano donde practicarlos con tu nivel. Suben 2,5 veces más rápido desde la 4.24.', 'Every job: your level, how it works, what it is for and the golden arrow to the nearest place to practise it at your level.')}</p><p class="hint">${L2('Tu mejor oficio: ', 'Your best job: ')}<b>${esc(JOBS[top].n)}</b> (${L2('Nv. ', 'Lv. ')}${(P.jobs[top] || { lv: 1 }).lv})</p>`; }
  else { const J = P.jobs[GJOB] || { lv: 1, xp: 0 }, need = J.lv >= JOBMAX ? 0 : jobXpToNext(J.lv), pct = need ? Math.floor(J.xp / need * 100) : 100, w = Gd && Gd.find ? Gd.find() : null; if (w) WP_M[Math.round(w.loc[0] * 10) / 10 + ',' + Math.round(w.loc[1] * 10) / 10] = w.m || 'world';
    det = `<h4>${iconHTML(jobIc(GJOB), 22)} ${esc(D.n)} · ${L2('Nv. ', 'Lv. ')}${J.lv}/${JOBMAX}</h4><span class="dbar"><b style="width:${pct}%"></b></span><div class="gsrc"><span>${esc(D.desc || '')}</span></div>`
      + (Gd ? `<div class="gsrc"><span>🛠 <b>${L2('Cómo', 'How')}:</b> ${esc(L2(Gd.how[0], Gd.how[1]))}</span></div><div class="gsrc"><span>✨ <b>${L2('Para qué sirve', 'What for')}:</b> ${esc(L2(Gd.ben[0], Gd.ben[1]))}</span></div>` : '')
      + (Gd && Gd.perks ? `<div class="gsrc"><span>🏅 <b>${L2('Ventajas por nivel', 'Level perks')}:</b><br>${Gd.perks.map(([lv, es, en]) => `${J.lv >= lv ? '✓' : '·'} ${L2('Nv. ', 'Lv. ')}${lv}: ${esc(L2(es, en))}`).join('<br>')}</span></div>` : '')
      + (w ? `<div class="gsrc"><span>📍 ${L2('Lo más cercano: ', 'Nearest: ')}<b>${esc(w.t)}</b></span>${guiaFollowBtn(w, w.t)}</div>` : `<div class="gsrc"><span>${L2('No hay un sitio en el mundo principal para tu nivel.', 'No place in the main world for your level.')}</span></div>`); }
  openModal(`<div class="frame guia"><h3>🔎 ${L2('Dónde conseguir', 'Where to get it')}</h3><div class="chips">${guiaChipsHTML('job')}</div><div class="gcols"><div class="glist">${list}</div><div class="gdet">${det}</div></div><div class="row"><button class="btn" id="gClose">${L2('Cerrar', 'Close')}</button></div></div>`, 'guiamod');
  $('#gClose').onclick = closeModal; guiaBindChips();
  $$('[data-gj]').forEach(b => b.onclick = () => { GJOB = b.dataset.gj; guiaJobs(); });
  const off = $('#gOff'); if (off) off.onclick = () => { P.wp = null; markDirty(); guiaJobs(); };
  $$('[data-wp]').forEach(b => b.onclick = () => { const [x, y] = b.dataset.wp.split(',').map(Number); if (P.wp && P.wp.x === x && P.wp.y === y) { P.wp = null; markDirty(); } else setWp({ loc: [x, y], t: b.dataset.wl, m: 'world' }); guiaJobs(); }); }
function guiaBindChips() { $$('.guia [data-gx]').forEach(b => b.onclick = () => { const k = b.dataset.gx; GUIA.sel = null; if (k === 'job') guiaJobs(); else if (k === 'sec' || k === 'ene' || k === 'sub') guiaX(k); else { GUIA.tab = k; renderGuia(); } }); }
function guiaAddJobChip() { const ch = $('.guia .chips'); if (!ch || ch.querySelector('[data-gx="job"]')) return; const b = document.createElement('button'); b.className = 'chip'; b.dataset.gx = 'job'; b.textContent = '⚒ ' + L2('Oficios', 'Jobs'); b.onclick = () => guiaJobs(); const ref = ch.querySelector('[data-gx="ene"]') || [...ch.children].find(c => /👹/.test(c.textContent)); ch.insertBefore(b, ref || ch.querySelector('#gOff')); }
{ const _gx = guiaX; guiaX = function (tab) { if (tab === 'job') return guiaJobs(); const r = _gx.apply(this, arguments); guiaAddJobChip(); return r; }; }
{ const _rg = renderGuia; renderGuia = function () { if (GUIA.tab === 'job') return guiaJobs(); const r = _rg.apply(this, arguments); guiaAddJobChip(); return r; }; }
