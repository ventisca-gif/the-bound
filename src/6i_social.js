// ================= MULTIPLAYER EXTRAS: friend arrows, PvP duels, downed state & revives =================
const PVP = { on: false, out: [], seq: 0, rv: [], rvSeq: 0, lastHit: new Map() };
function pvpOn() { return PVP.on && netOnline && netOnline(); }
function pvpTargets() { const P = G.P; return [...G.remote.values()].filter(r => r.pvp && r.map === P.map && !r.dead && !r.dn && r.id); }
function pvpHit(r, dmg) {
  const k = r.id, now = G.t; if ((PVP.lastHit.get(k) || 0) > now - 0.22) return; PVP.lastHit.set(k, now);
  const d = Math.max(1, Math.round(dmg * 0.3)); PVP.out.push({ to: k, d, s: ++PVP.seq }); if (PVP.out.length > 8) PVP.out.shift();
  floatText(r.x, r.y - 34, d, '#ffb0ff'); burst(r.x, r.y - 12, 5, { sp: 50, up: 20, g: 90, life: 0.3, c: ['#ff7ab0', '#ffffff'] }); sfx('hit'); netPresence(true);
}
function pvpArc(x, y, ang, r_, arc, dmg) { if (!pvpOn()) return; for (const r of pvpTargets()) { const dx = r.x - x, dy = (r.y - y) * 1.3, d = Math.hypot(dx, dy); if (d > r_ + 8) continue; const a = Math.atan2(dy, dx), da = Math.abs(((a - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (d < 12 || da <= arc / 2) pvpHit(r, dmg); } }
function pvpCircle(x, y, r_, dmg) { if (!pvpOn()) return; for (const r of pvpTargets()) if (dist2(r.x, (r.y - y) * 1.3 + y, x, y) <= (r_ + 8) ** 2) pvpHit(r, dmg); }
function pvpProj(e) { if (!pvpOn() || e.kidShot) return; for (const r of pvpTargets()) { if (e.hit.has(r)) continue; if (dist2(r.x, r.y - 8, e.x, e.y) < 144) { e.hit.add(r); pvpHit(r, e.dmg); if (!e.pierce) { e.remove = true; return; } } } }
function socialPresence(o) {
  if (PVP.on) { o.pvp = 1; if (PVP.out.length) o.pv = PVP.out; }
  if (G.P.downed) o.dn = 1; if (G.P.riding) o.rd = 1;
  if (PVP.rv.length) o.rv = PVP.rv;
  if (G.P.anim === 'dance' && G.P.dk) o.dk = G.P.dk;
  petPresence(o);
}
function socialRecv(r, pr) {
  const P = G.P; r.dk = typeof pr.dk === 'string' && DANCES[pr.dk] ? pr.dk : null; petRecv(r, pr); r.pvp = !!pr.pvp; r.rd = !!pr.rd; const wasDn = r.dn; r.dn = !!pr.dn; if (r.dn && !wasDn) { r.chat = '¡Ayúdame!'; r.chatT = G.t; }
  const first = r.pvSeen === undefined; let mx = r.pvSeen || 0;
  if (Array.isArray(pr.pv)) for (const h of pr.pv) { if (!h || !(h.s > (r.pvSeen || 0))) continue; mx = Math.max(mx, h.s); if (first || h.to !== NET.myId || !PVP.on || !r.pvp || P.dead || r.map !== P.map) continue; hurtPlayer(clamp(+h.d || 0, 0, 99999), { pvp: r.name }); P.lastPvp = r.name; }
  r.pvSeen = Array.isArray(pr.pv) ? mx : (r.pvSeen === undefined ? 0 : r.pvSeen);
  const f2 = r.rvSeen === undefined; let m2 = r.rvSeen || 0;
  if (Array.isArray(pr.rv)) for (const h of pr.rv) { if (!h || !(h.s > (r.rvSeen || 0))) continue; m2 = Math.max(m2, h.s); if (!f2 && h.to === NET.myId && P.downed) reviveFromDown(r.name); }
  r.rvSeen = Array.isArray(pr.rv) ? m2 : (r.rvSeen === undefined ? 0 : r.rvSeen);
}
// ---------- downed state ----------
const DOWN_T = 18;
function startDown() {
  const P = G.P; P.dead = true; P.hp = 0; P.downed = { t: DOWN_T, tryT: 3, tried: {} }; setAnim(P, 'dead'); P.job = null; if (P.fishing) stopFishing(); showBoss(null);
  sfx('hurt'); G.shake = 5; toast('¡Has caído! Alguien puede reanimarte…', 'warn', 4); netPresence(true); downUI();
}
function reviveFromDown(who) {
  const P = G.P; if (!P.downed) return; P.downed = null; P.dead = false; P.hp = Math.round(P.S.maxhp * 0.4); P.ifr = 2.5; setAnim(P, 'idle');
  addFx({ type: 'ring', x: P.x, y: P.y, r: 30, dur: 0.7, col: '#8aff6a' }); burst(P.x, P.y - 12, 26, { sp: 40, up: 60, g: -20, life: 1, c: ['#8aff6a', '#ffffff', '#ffd040'] }); sfx('level');
  toast(who ? '¡' + who + ' te ha reanimado!' : '¡Te has levantado!', 'quest'); netPresence(true); downUI();
}
function downTick(dt) {
  const P = G.P, D = P.downed; if (!D) return; D.t -= dt; D.tryT -= dt;
  if (D.tryT <= 0) { D.tryT = 3;
    if (typeof petHas === 'function' && petHas('revive') && !D.tried.pet && (G.t - (P.petRevT || -999) > 600)) { D.tried.pet = 1; P.petRevT = G.t; reviveFromDown(PETS[P.pet].n); return; }
    if (COMP && COMP.e && COMP.e.map === P.map && !D.tried.comp) { D.tried.comp = 1; if (Math.random() < (COMP.hand ? 0.6 : 0.45)) { reviveFromDown(nick(relKey(COMP.e.id))); return; } else { COMP.e.chat = '¡No puedo levantarte!'; COMP.e.chatT = G.t; } }
    const kid = G.ents.find(e => e.type === 'kid' && e.map === P.map && dist2(e.x, e.y, P.x, P.y) < 160 * 160 && e.kid && e.kid.cls);
    if (kid && !D.tried.kid) { D.tried.kid = 1; if (Math.random() < 0.35) { reviveFromDown(kid.kid.name); return; } }
  }
  if (D.t <= 0) giveUpDown();
  else downUI();
}
function giveUpDown() { const P = G.P; if (!P.downed) return; P.downed = null; P.dead = false; downUI(true); _playerDieOrig(); }
let _downEl = null;
function downUI(hide) {
  const P = G.P; if (!_downEl) { _downEl = document.createElement('div'); _downEl.id = 'downBar'; _downEl.innerHTML = '<b>Derribado</b><span></span><button class="btn sm">Rendirse</button>'; document.getElementById('hud').appendChild(_downEl); _downEl.querySelector('button').onclick = () => giveUpDown(); }
  if (hide || !P.downed) { _downEl.hidden = true; return; } _downEl.hidden = false; _downEl.querySelector('span').textContent = Math.ceil(P.downed.t) + ' s · tu pareja, tus hijos, tu mascota o un amigo pueden reanimarte';
}
const _playerDieOrig = playerDie;
playerDie = function (full) { const P = G.P; if (P.dead) return; if (full || P.riding || G.map && G.map.home) return _playerDieOrig(); startDown(); };
// reviving a downed friend (hold the action button next to them)
function reviveTarget() { const P = G.P; if (P.dead) return null; for (const r of G.remote.values()) if (r.dn && r.map === P.map && dist2(r.x, r.y, P.x, P.y) < 34 * 34) return { kind: 'revive', r, label: 'Reanimar', icon: 'heart' }; return null; }
{ const _it = interactTarget; interactTarget = function () { return reviveTarget() || _it(); }; }
{ const _di = doInteract; doInteract = function () { const P = G.P; const R = !P.dead && !P.revive && reviveTarget(); if (R) { P.revive = { r: R.r, t: 2 }; setAnim(P, 'gather'); toast('Reanimando a ' + R.r.name + '…', 'info'); return; } return _di(); }; }
function reviveTick(dt) { const P = G.P, R = P.revive; if (!R) return; R.t -= dt; if (dist2(R.r.x, R.r.y, P.x, P.y) > 44 * 44 || !R.r.dn || P.dead) { P.revive = null; return; } if (Math.random() < dt * 8) burst(R.r.x, R.r.y - 10, 2, { sp: 20, up: 40, g: -20, life: 0.6, c: ['#8aff6a', '#ffffff'] });
  if (R.t <= 0) { PVP.rv.push({ to: R.r.id, s: ++PVP.rvSeq }); if (PVP.rv.length > 4) PVP.rv.shift(); P.revive = null; setAnim(P, 'idle'); toast('¡Has reanimado a ' + R.r.name + '!', 'quest'); netPresence(true); if (typeof passEvent === 'function') passEvent('revive', 1); } }
// ---------- arrows pointing to friends that are far away ----------
function drawFriendArrows(cx, cy) {
  const P = G.P; if (!P || P.ghost || !G.remote.size || G.fade > 0.05) return;
  for (const r of G.remote.values()) {
    if (r.map !== P.map) continue; const sx = r.x - cx, sy = r.y - 16 - cy; if (sx > 20 && sx < VW - 20 && sy > 20 && sy < VH - 20) continue;
    const dx = r.x - P.x, dy = r.y - P.y, a = Math.atan2(dy, dx), ex = clamp(VW / 2 + Math.cos(a) * VW, 26, VW - 26), ey = clamp(VH / 2 + Math.sin(a) * VH, 30, VH - 30), m = Math.round(Math.hypot(dx, dy) / 16);
    const col = r.dn ? '#ff4a4a' : r.pt && r.pt === PARTY.id ? '#ff8ab0' : '#5ae0ff';
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(a); ctx.fillStyle = 'rgba(10,6,12,0.75)'; ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(-7, -9); ctx.lineTo(-3, 0); ctx.lineTo(-7, 9); ctx.closePath(); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-5, -6.5); ctx.lineTo(-2, 0); ctx.lineTo(-5, 6.5); ctx.closePath(); ctx.fill(); ctx.restore();
    const t = textSprite((r.dn ? '! ' : '') + r.name + ' ' + m + 'M', col, '#120a0e'), tx = clamp(ex - t.width / 2, 2, VW - t.width - 2), ty = clamp(ey + (Math.sin(a) > 0.5 ? -20 : 12), 2, VH - 10); ctx.drawImage(t, Math.round(tx), Math.round(ty));
  }
}
function mapFriends(x, sc) {
  for (const r of G.remote.values()) { if (r.map !== 'world') continue; const px = r.x / 16 * sc, py = r.y / 16 * sc, col = r.dn ? '#ff4a4a' : r.pt && r.pt === PARTY.id ? '#ff8ab0' : '#5ae0ff';
    x.fillStyle = col; x.strokeStyle = '#0a0a14'; x.lineWidth = 2; x.beginPath(); x.arc(px, py, 5 + Math.sin(G.t * 5), 0, 7); x.stroke(); x.fill();
    x.lineWidth = 3; x.strokeStyle = 'rgba(10,6,4,0.9)'; x.strokeText(r.name, px, py - 9); x.fillStyle = col; x.fillText(r.name, px, py - 9); }
}
function mapExtras(x, sc) { if (typeof railMap === 'function') railMap(x, sc); }
