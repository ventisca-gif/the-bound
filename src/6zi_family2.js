// ================= v3.4 FAMILIA: llevar a tu pareja en brazos (y besarla), hijos con vida que pueden caer, 3 hijos, mascota en casa =================
// ---------- cargar a tu pareja en brazos ----------
HERO_ANIMS.push('carry', 'carryw'); ANIMS.carry = [44, 1]; ANIMS.carryw = [45, 4]; for (const a of ['carry', 'carryw', 'kiss', 'hug']) if (!NET_ANIMS.includes(a)) NET_ANIMS.push(a);
{ const _hp = heroPose; heroPose = function (dir, anim, f, L) {
  if (anim !== 'carry' && anim !== 'carryw') return _hp(dir, anim, f, L);
  const ps = poseFor(dir, anim === 'carryw' ? 'walk' : 'idle', anim === 'carryw' ? f : 0, L), side = dir === 'left' || dir === 'right', d = dir === 'left' ? -1 : 1;
  if (side) { ps.lax = d * 4; ps.rax = d * 4; ps.lay = -4; ps.ray = -3; } else { ps.lax = -2; ps.rax = 2; ps.lay = -4; ps.ray = -4; }
  ps.noWeapon = 1; ps.lean = 0; return ps; }; }
function carryActive() { return !!(COMP && COMP.carry && COMP.e && !COMP.e.remove); }
function startCarry() { const P = G.P; if (!COMP || P.dead || P.mount) return; COMP.carry = 1; COMP.kissT = 0; uiCarry(); toast('Llevas a ' + nick(relKey(COMP.e.id)) + ' en brazos ♥', 'quest'); sfx('quest'); netPresence(true); }
function stopCarry() { if (!COMP) return; COMP.carry = 0; const P = G.P, e = COMP.e; e.x = P.x + 12; e.y = P.y + 2; setAnim(P, 'idle'); uiCarry(); netPresence(true); }
function carryKiss() { if (!carryActive()) return; const P = G.P; COMP.kissT = 1.1; setAnim(P, 'kiss'); P.loopAnim = false; sfx('quest');
  for (let i = 0; i < 8; i++) burst(P.x + (Math.random() - 0.5) * 8, P.y - 30, 1, { sp: 18, up: 40, g: -25, life: 1.3, c: ['#ff5a8a', '#ffb0c8', '#ffffff'] }); floatText(P.x, P.y - 40, '♥', '#ff7ab0');
  addRel(relKey(COMP.e.id), 2, 4, 0, 0, true); P.kissN = (P.kissN || 0) + 1; netPresence(true); }
function uiCarry() { let b = $('#carryBar'); if (!b) { b = document.createElement('div'); b.id = 'carryBar'; b.innerHTML = '<button class="btn sm gold" id="cbKiss">Besar ♥</button><button class="btn sm" id="cbDown">Bajar</button>'; document.body.appendChild(b); $('#cbKiss').onclick = carryKiss; $('#cbDown').onclick = stopCarry; } b.hidden = !carryActive(); }
DLG_HOOKS.push((npc, opts) => { const P = G.P, k = relKey(npc.id); if (!COMP || COMP.e !== npc || (P.partner !== k && P.spouse !== k)) return; opts.unshift(COMP.carry ? { label: 'Bajarla de tus brazos', icon: ['heart', '#ff5a8a'], fn: () => { closeDialog && closeDialog(); stopCarry(); } } : { label: 'Cargar en brazos', icon: ['heart', '#ff5a8a'], fn: () => { closeDialog && closeDialog(); startCarry(); } }); });
{ const _cu = compUpdate; compUpdate = function (e, dt) {
  if (!carryActive() || COMP.e !== e) return _cu(e, dt); const P = G.P;
  e.map = P.map; e.x = P.x; e.y = P.y + (P.dir === 'up' ? -1 : 1); e.dir = 'down'; setAnim(e, COMP.kissT > 0 ? 'kiss' : 'idle'); e.af = 0;
  if (COMP.kissT > 0) COMP.kissT -= dt; }; }
{ const _ec = endComp; endComp = function (s) { if (COMP) COMP.carry = 0; const r = _ec(s); uiCarry(); return r; }; }
{ const _up = updatePlayer; updatePlayer = function (dt) { const P = G.P, x0 = P.x, y0 = P.y; const r = _up(dt);
  if (carryActive() && !P.dead) { if (P.mount || P.dead) stopCarry(); else if (!(COMP.kissT > 0)) { const mv = Math.hypot(P.x - x0, P.y - y0) > 0.05; const an = mv ? 'carryw' : 'carry'; if (P.anim !== an) { setAnim(P, an, true); P.loopAnim = true; } if (mv) stepAnim(P, dt, 9); } }
  return r; }; }
{ const _ba = basicAttack; basicAttack = function () { if (carryActive()) { toast('Tienes las manos ocupadas ♥', 'info'); return; } return _ba.apply(this, arguments); }; }
{ const _us = useSkill; useSkill = function (s) { if (carryActive()) { toast('Tienes las manos ocupadas ♥', 'info'); return; } return _us.apply(this, arguments); }; }
// dibujo de la pareja en brazos (tumbada sobre los brazos, a la altura del pecho)
function drawCarried(e, holder, cx, cy, kissing) {
  const A = e.atlas; if (!A || !A.img) return; const dir = holder.dir || 'down', side = dir === 'left' || dir === 'right', d = dir === 'left' ? -1 : 1;
  const fr = A.idx[kissing ? 'kiss' : 'idle'] !== undefined ? A.idx[kissing ? 'kiss' : 'idle'] : 0, row = side ? (d < 0 ? 1 : 2) : (dir === 'up' ? 3 : 0);
  const x = holder.x - cx, y = holder.y - cy - 10 - (kissing ? 4 : 0), sc = (e.scale || 1) * 0.8;
  ctx.save(); ctx.translate(Math.round(x + (side ? d * 6 : 0)), Math.round(y)); if (side) ctx.rotate(d * (-Math.PI / 2 + 0.25)); else ctx.rotate(dir === 'up' ? Math.PI / 2 : -Math.PI / 2);
  ctx.drawImage(A.img, fr * A.fw, (side ? 0 : row) * A.fh, A.fw, A.fh, -A.fw * sc / 2, -A.fh * sc * 0.55, A.fw * sc, A.fh * sc); ctx.restore();
}
{ const _de = drawEnt; drawEnt = function (e, cx, cy) {
  if (carryActive() && e === COMP.e) { if (G.P.dir !== 'up') return; drawCarried(e, G.P, cx, cy, COMP.kissT > 0); return; }
  if (e.type === 'rcomp' && e.carriedBy) { const r = e.carriedBy; if (r.dir !== 'up') return; drawCarried(e, r, cx, cy, r.anim === 'kiss'); return; }
  const out = _de(e, cx, cy);
  if (e === G.P && carryActive() && G.P.dir !== 'up') drawCarried(COMP.e, G.P, cx, cy, COMP.kissT > 0);
  if (e.type === 'remote' && e.rcy && e.rcy.carriedBy === e && e.dir !== 'up' && e.map === G.map.id) drawCarried(e.rcy, e, cx, cy, e.anim === 'kiss');
  return out; }; }
// sincronía: los demás te ven con tu pareja en brazos
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); if (carryActive()) o.cy = 1; }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); const c = r.rcp; if (c && !c.remove) { if (pr.cy) { c.carriedBy = r; r.rcy = c; c.tx = r.tx; c.ty = r.ty; } else if (c.carriedBy) { c.carriedBy = null; r.rcy = null; } } }; }
// ---------- hijos con vida: pueden caer; si nadie les ayuda, vuelven a casa a descansar ----------
function kidMaxHp(k) { return Math.round((150 + kidLv(k) * 45) * (kidStage(k) === 2 ? 1 : 0.6)); }
const KID_REST_MS = 5 * 60 * 1000;
function kidResting(k) { return k.restUntil && Date.now() < k.restUntil; }
{ const _hp = hurtPlayer; hurtPlayer = function (base, src) {
  const P = G.P; if (src && src.type === 'mob' && !P.dead && Math.random() < 0.35) { const kid = FOLLOW_KIDS.find(e => e && !e.remove && !e.down && e.map === P.map && dist2(e.x, e.y, src.x, src.y) < 30 * 30); if (kid) { kidHurt(kid, base * dmgRedP(kidLv(kid.kid) * 6, src.lv || P.lv)); return; } }
  return _hp.apply(this, arguments); }; }
function kidHurt(e, d) {
  const k = e.kid; if (k.hp === undefined || k.hp > kidMaxHp(k)) k.hp = kidMaxHp(k); d = Math.max(1, Math.round(d)); k.hp -= d; e.hurtT = 0.2; floatText(e.x, e.y - 30, '-' + d, '#ffb070'); e.combatT = G.t;
  if (k.hp <= 0) { k.hp = 0; e.down = 1; e.downT = 0; setAnim(e, 'dead'); e.loopAnim = false; toast(`${k.name} ha caído. Tócale para ayudarle a levantarse o volverá a casa a descansar`, 'warn'); sfx('hurt'); netPresence(true); }
}
{ const _uk = updateKid; updateKid = function (e, dt) {
  const k = e.kid; if (k.follow && k.hp === undefined) k.hp = kidMaxHp(k);
  if (e.down) { e.downT += dt; setAnim(e, 'dead'); if (e.downT > 10) { e.down = 0; k.follow = false; k.hp = kidMaxHp(k); k.restUntil = Date.now() + KID_REST_MS; e.remove = true; FOLLOW_KIDS = FOLLOW_KIDS.filter(q => q !== e); toast(`${k.name} ha vuelto a casa a descansar (5 min)`, 'info'); markDirty(); } return; }
  if (k.follow && k.hp < kidMaxHp(k) && G.t - (e.combatT || 0) > 4) k.hp = Math.min(kidMaxHp(k), k.hp + kidMaxHp(k) * 0.03 * dt);
  return _uk(e, dt); }; }
{ const _ok = openKid; openKid = function (e) {
  const k = e.kid;
  if (e.down) { const P = G.P; e.down = 0; k.hp = Math.round(kidMaxHp(k) * 0.4); setAnim(e, 'idle'); setAnim(P, 'hug'); P.loopAnim = false; toast(`¡Ayudaste a ${k.name} a levantarse!`, 'quest'); floatText(e.x, e.y - 34, '♥', '#ff7ab0'); sfx('quest'); netPresence(true); return; }
  _ok(e); const body = $('#mbody'); if (!body) return;
  const hint = body.querySelector('.hint'); if (hint) hint.innerHTML = hint.innerHTML.replace('(sube de nivel contigo y no puede caer en combate)', '(sube de nivel contigo; si cae en combate, ayúdale a levantarse o volverá a casa a descansar)');
  if (kidStage(k) >= 1) { const mx = kidMaxHp(k), hp = k.hp === undefined ? mx : Math.round(k.hp); const p = document.createElement('p'); p.className = 'hint'; p.innerHTML = `Vida: <b>${fmt(hp)} / ${fmt(mx)}</b>${kidResting(k) ? ` · <span class="warnt">Descansando (${Math.ceil((k.restUntil - Date.now()) / 60000)} min)</span>` : ''}`; if (hint) hint.after(p); }
  const fb = $('#kFol'); if (fb && !k.follow && kidResting(k)) { fb.disabled = true; fb.textContent = 'Está descansando'; }
}; }
// vida de los hijos sobre la cabeza
{ const _de = drawEnt; drawEnt = function (e, cx, cy) { const r = _de(e, cx, cy);
  if ((e.type === 'kid' && e.kid && e.kid.follow) || (e.type === 'rkid' && e.hpp !== undefined)) { const k = e.kid, pct = e.type === 'kid' ? (k.hp === undefined ? 1 : k.hp / kidMaxHp(k)) : e.hpp / 100;
    if (pct < 0.999 || e.down) { const x = Math.round(e.x - cx - 9), y = Math.round(e.y - cy - 36 * (e.scale || 1)); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x - 1, y - 1, 20, 4); ctx.fillStyle = pct > 0.5 ? '#5ad05a' : pct > 0.25 ? '#e0c040' : '#e04040'; ctx.fillRect(x, y, Math.round(18 * Math.max(0, pct)), 2); } }
  return r; }; }
// los demás jugadores ven su vida y si han caído
{ const _sp = socialPresence; socialPresence = function (o) { _sp(o); if (o.kd) o.kd.forEach((a, i) => { const e = FOLLOW_KIDS.filter(q => q && !q.remove && q.map === G.P.map)[i]; if (e) { const k = e.kid; a[8] = k.hp === undefined ? 100 : Math.round(k.hp / kidMaxHp(k) * 100); a[9] = e.down ? 1 : 0; } }); }; }
{ const _sr = socialRecv; socialRecv = function (r, pr) { _sr(r, pr); const a = Array.isArray(pr.kd) ? pr.kd : []; (r.rkd || []).forEach((e, i) => { if (!e || !a[i]) return; e.hpp = clamp(+a[i][8] || 100, 0, 100); e.rdown = a[i][9] ? 1 : 0; if (e.rdown) { e.ta = 'dead'; e.anim = 'dead'; } }); }; }
{ const _ure = updateRemoteExtra; updateRemoteExtra = function (e, dt) { if (e.type === 'rkid' && e.rdown) { e.x += (e.tx - e.x) * Math.min(1, dt * 8); e.y += (e.ty - e.y) * Math.min(1, dt * 8); setAnim(e, 'dead'); if (G.t - (e.seen || 0) > 4) e.remove = true; return; } return _ure(e, dt); }; }
// ---------- mascota que se queda en casa y juega con la familia ----------
function petStayHome() { const P = G.P; if (!P.pet) return; P.petHome = P.pet; setPet(null); toast(PETS[P.petHome].n + ' se queda en casa esperándote', 'info'); markDirty(); }
function petTakeAlong() { const P = G.P; const k = P.petHome; if (!k) return; P.petHome = null; for (const e of G.ents) if (e.type === 'hpet') e.remove = true; setPet(k); toast(PETS[k].n + ' viene contigo', 'quest'); markDirty(); }
SAVEKEYS.push('petHome');
{ const _mh = makeHome; makeHome = function (id) { const M = _mh(id); const P = G.P; if (M && P && P.petHome && PETS[P.petHome] && !G.ents.some(q => q.type === 'hpet' && q.map === M.id && !q.remove)) { const e = { type: 'hpet', pid: P.petHome, atlas: petAtlas(P.petHome), x: 8 * 16, y: 6 * 16 + 8, L: 0, map: M.id, dir: 'down', anim: 'idle', af: 0, at: 0, wt: 1, name: PETS[P.petHome].n }; const ev = typeof petEvo === 'function' ? petEvo(P.petHome) : 0; if (ev && typeof PET_EVO !== 'undefined') e.scale = PET_EVO[ev][2]; G.ents.push(e); } return M; }; }
function updateHomePet(e, dt) {
  e.wt -= dt; const kids = G.ents.filter(q => q.type === 'kid' && q.map === e.map && !q.remove);
  if (e.wt <= 0) { e.wt = 1.5 + Math.random() * 2.5; const k = kids.length && Math.random() < 0.5 ? pick(kids) : null; e.goal = k ? { x: k.x + (Math.random() - 0.5) * 20, y: k.y + 8, kid: k } : Math.random() < 0.7 ? { x: e.x + (Math.random() - 0.5) * 80, y: e.y + (Math.random() - 0.5) * 50 } : null; }
  if (e.playT > 0) { e.playT -= dt; e.z = Math.abs(Math.sin(e.playT * 9)) * 6; setAnim(e, 'walk', true); stepAnim(e, dt, 12); if (e.playT <= 0) e.z = 0; return; }
  if (e.goal) { const dx = e.goal.x - e.x, dy = e.goal.y - e.y, L = Math.hypot(dx, dy); if (L > 3) { moveEnt(G.map, e, dx / L * 40 * dt, dy / L * 40 * dt); e.dir = dirFromVec(dx, dy); setAnim(e, 'walk', true); stepAnim(e, dt, 9); }
    else { if (e.goal.kid) { e.playT = 0.8; floatText(e.x, e.y - 18, '♥', '#ff7ab0'); setAnim(e.goal.kid, 'cheer'); e.goal.kid.loopAnim = false; } e.goal = null; setAnim(e, 'idle', true); } }
  else stepAnim(e, dt, 3);
}
{ const _ure = updateRemoteExtra; updateRemoteExtra = function (e, dt) { if (e.type === 'hpet') { updateHomePet(e, dt); return; } return _ure(e, dt); }; }
{ const _it = interactTarget; interactTarget = function () { const P = G.P; const hp = G.ents.find(e => e.type === 'hpet' && !e.remove && e.map === P.map && dist2(e.x, e.y, P.x, P.y) < 26 * 26); if (hp) return { kind: 'hpet', label: 'Jugar con ' + hp.name, icon: ['heart', '#ff5a8a'], e: hp }; return _it.apply(this, arguments); }; }
{ const _di = doInteract; doInteract = function (it) {
  it = it || interactTarget(); if (!it || it.kind !== 'hpet') return _di.apply(this, arguments); const P = G.P, e = it.e;
  openModal(`<h2>${esc(e.name)}</h2><p class="hint">Se ha quedado en casa con tu familia. ¿Qué quieres hacer?</p><div class="row wrap"><button class="btn gold" id="hpPlay">Jugar</button><button class="btn" id="hpTake">Llevármelo de aventura</button><button class="btn" id="hpNo">Nada</button></div>`, 'party');
  $('#hpPlay').onclick = () => { closeModal(); e.playT = 1.6; setAnim(P, 'cheer'); P.loopAnim = false; for (let i = 0; i < 6; i++) floatText(e.x + (Math.random() - 0.5) * 16, e.y - 20 - i * 4, '♥', '#ff7ab0'); sfx('quest'); const k0 = P.pet; P.pet = e.pid; if (typeof addBond === 'function') addBond(3); P.pet = k0; toast('¡' + e.name + ' está feliz!', 'quest');
    for (const kd of G.ents.filter(q => q.type === 'kid' && q.map === e.map)) { kd.goal = { x: e.x + (Math.random() - 0.5) * 20, y: e.y + 6 }; } };
  $('#hpTake').onclick = () => { closeModal(); petTakeAlong(); };
  $('#hpNo').onclick = closeModal; }; }
// botón en el panel de mascotas
{ const _rp = renderPets; renderPets = function (B) { _rp(B); const P = G.P; const box = document.createElement('div'); box.className = 'row wrap'; box.style.marginTop = '.5em';
  if (P.pet) box.innerHTML = `<button class="btn sm" id="petHomeB">Dejar a ${esc(PETS[P.pet].n)} en casa</button><small class="hint">En casa juega con tus hijos y puedes jugar con ella.</small>`;
  else if (P.petHome && PETS[P.petHome]) box.innerHTML = `<small class="hint">${esc(PETS[P.petHome].n)} está en tu casa. Ve a verla para jugar o llevártela.</small>`;
  (B || $('#mbody') || document.body).appendChild(box); const b = $('#petHomeB'); if (b) b.onclick = () => { petStayHome(); renderPets(B); }; }; }
