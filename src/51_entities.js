const LBL = { t: -1, r: [] }; // etiquetas de nivel ya dibujadas en este fotograma (para no amontonarlas)
// ================= ENTITIES: player, NPCs, mobs, combat =================
const ATL = new Map();
function getAtlas(key, fn) { let a = ATL.get(key); if (!a) { a = fn(); ATL.set(key, a); } return a; }
function equipTier(P, slot) { const e = P.equip[slot]; return e ? (ITEMS[e.id].tier || 1) : 1; }
function npcAtlas(id) { const d = NPCS[id], rom = typeof ROM !== 'undefined' && ROM[id === 'marina_nhar' ? 'marina' : id]; return getAtlas('N' + (d.look === NPCS.guardia_x1.look ? 'guard' : d.look === NPCS.marina.look ? 'marina' : id) + (rom ? 'R' : ''), () => buildAtlas(Object.assign({}, d.look), rom ? ['idle', 'walk', 'hug', 'kiss'] : d.tf ? ['idle', 'walk', 'sit', 'dance', 'cheer'] : ['idle', 'walk'])); }
function mobAtlasFor(art) {
  const key = 'M' + art.join(',');
  return getAtlas(key, () => {
    switch (art[0]) {
      case 'slime': return genSlime(art[1], art[2] || 1, art[3]); case 'quad': return genQuad(art[1]); case 'bat': return genBat(art[1]); case 'ghost': return genGhost(art[1]);
      case 'mush': return genMushroomMob(art[1]); case 'crab': return genCrab(art[1] || 1); case 'treant': return genTreant(); case 'dragon': return genDragon();
      case 'scorp': return genScorpion(art[1], art[2] || 1); case 'snake': return genSnake(art[1]); case 'plant': return genPlant(art[1]); case 'spider': return genSpider(art[1]);
      case 'hum': return humanoidMobAtlas(HLOOKS[art[1]] || bossLook(art[1]));
    }
  });
}
const DIRI = { down: 0, left: 1, right: 2, up: 3 };
function animN(e, a) { if (e.hum) return ANIMS[a] ? ANIMS[a][1] : 1; return MOBANIM[a] ? MOBANIM[a][1] : 1; }
function setAnim(e, a, keep) { if (e.anim === a && keep) return; e.anim = a; e.af = 0; e.at = 0; }
function stepAnim(e, dt, fps) { e.at += dt; const n = animN(e, e.anim); const per = 1 / (fps || 6); while (e.at >= per) { e.at -= per; e.af++; if (e.af >= n) e.af = e.loopAnim === false ? n - 1 : 0; } }
// ---------- drawing ----------
// v4.0: dibuja un cuadro del atlas, en HD (ropa con píxeles finos) si el atlas lo tiene
function atlasBlit(c, A, col, row, x, y, w, h) { if (HDS > 1 && A.hdL && typeof hdEnsure === 'function' && hdEnsure(A, col, row)) { c.drawImage(A.hd, col * A.fw * 2, row * A.fh * 2, A.fw * 2, A.fh * 2, x, y, w, h); return; } c.drawImage(A.img, col * A.fw, row * A.fh, A.fw, A.fh, x, y, w, h); }
function drawEnt(e, cx, cy) {
  if (e.type === 'proj') return drawProj(e, cx, cy);
  if (e.type === 'deco') return drawDeco(e, cx, cy);
  if (e.type === 'tcar') return drawTrainCar(e, cx, cy);
  if ((e.type === 'player' && e.riding) || (e.type === 'remote' && e.rd)) return;
  const A = e.atlas; if (!A) return;
  let a = e.anim; if (A.idx[a] === undefined) a = a === 'dead' ? 'hurt' : 'idle'; if (A.idx[a] === undefined) a = 'idle';
  const n = animN(e, a), f = Math.min(e.af, n - 1), col = A.idx[a] + f, row = DIRI[e.dir] || 0;
  let x = Math.round(e.x - A.ax - cx), y = Math.round(e.y - A.ay - cy - (e.z || 0));
  if (e.elite && !e.dying) { const r = 10 + Math.sin(G.t * 4) * 2; ctx.strokeStyle = 'rgba(255,208,64,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(Math.round(e.x - cx), Math.round(e.y - cy), r + 4, (r + 4) * 0.4, 0, 0, 7); ctx.stroke(); if (Math.random() < 0.15) part(e.x + (Math.random() - 0.5) * 16, e.y, { z: 4 + Math.random() * 20, vz: 20, life: 0.6, c: '#ffd040' }); }
  if (e.follow) drawHandLink(e, cx, cy);
  if (e.type === 'player') drawWeaponAura(e, cx, cy);
  if (e.type === 'player' && G.P === e && e.invis) ctx.globalAlpha = 0.45;
  if (e.dying) { ctx.globalAlpha = clamp(1 - e.dying / 0.6, 0, 1); }
  if (e.type === 'summon' || e.type === 'rsum') { const g = ctx.createRadialGradient(e.x - cx, e.y - cy - 4, 1, e.x - cx, e.y - cy - 4, 14 * (e.scale || 1)); g.addColorStop(0, 'rgba(90,176,255,0.35)'); g.addColorStop(1, 'rgba(90,176,255,0)'); ctx.fillStyle = g; ctx.fillRect(e.x - cx - 16 * (e.scale || 1), e.y - cy - 20 * (e.scale || 1), 32 * (e.scale || 1), 28 * (e.scale || 1)); ctx.globalAlpha = (e.t !== undefined && e.t < 1.5 ? e.t / 1.5 : 1) * (0.72 + Math.sin(G.t * 5) * 0.08); }
  if (e.type === 'rcomp') drawRemoteHand(e, cx, cy);
  if (e.scale) { const sc = e.scale; atlasBlit(ctx, A, col, row, Math.round(e.x - A.ax * sc - cx), Math.round(e.y - A.ay * sc - cy), Math.round(A.fw * sc), Math.round(A.fh * sc)); ctx.globalAlpha = 1; return; }
  atlasBlit(ctx, A, col, row, x, y, A.fw, A.fh);
  if (e.flash > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, e.flash * 6) * 0.8; ctx.drawImage(A.img, col * A.fw, row * A.fh, A.fw, A.fh, x, y, A.fw, A.fh); ctx.globalCompositeOperation = 'source-over'; }
  if (e.freeze > 0) { ctx.globalAlpha = 0.45; ctx.fillStyle = '#9ae0ff'; ctx.fillRect(x + A.fw * 0.25, y + A.fh * 0.35, A.fw * 0.5, A.fh * 0.6); }
  ctx.globalAlpha = 1;
  if (e.type === 'player' && e.fishing && e.fishing.bob) { const b = e.fishing.bob; const bx = Math.round(b.x - cx), by = Math.round(b.y - cy + (e.fishing.state === 'bite' ? 2 : Math.sin(G.t * 4))); ctx.strokeStyle = 'rgba(230,230,230,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(e.x - cx + (e.dir === 'left' ? -14 : e.dir === 'right' ? 14 : 6)), Math.round(e.y - cy - 26)); ctx.lineTo(bx, by - 2); ctx.stroke(); ctx.fillStyle = '#e8302a'; ctx.fillRect(bx - 1, by - 3, 3, 2); ctx.fillStyle = '#ffffff'; ctx.fillRect(bx - 1, by - 1, 3, 1); if (e.fishing.state === 'bite') { const s = textSprite('!', '#ffe040'); ctx.drawImage(s, Math.round(e.x - cx - s.width), Math.round(e.y - cy - 52 + Math.sin(G.t * 20) * 2), s.width * 2, s.height * 2); } }
}
const RARC = ['#ffffff', '#6ae04a', '#4aa8ff', '#c070ff', '#ffb030', '#ff5a5a'];
function drawOverhead(e, cx, cy) {
  const A = e.atlas; if (!A) return; const top = Math.round(e.y - cy - A.ay + (A.fh - (e.hgt || 34)) - 6);
  const x = Math.round(e.x - cx);
  if (e.type === 'mob' && !e.dying) {
    const showBar = e.hp < e.maxhp || G.P.target === e;
    if (showBar && !e.boss) { const w = 20; ctx.fillStyle = '#1a0a0e'; ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 4); ctx.fillStyle = '#3a1418'; ctx.fillRect(x - w / 2, top, w, 2); ctx.fillStyle = e.hp / e.maxhp > 0.3 ? '#e83a3a' : '#ff8a2a'; ctx.fillRect(x - w / 2, top, Math.round(w * e.hp / e.maxhp), 2); }
    if (showBar || dist2(e.x, e.y, G.P.x, G.P.y) < 3600 || e.elite) { const lvc = e.elite ? '#ffd040' : e.lv > G.P.lv + 4 ? '#ff5050' : e.lv < G.P.lv - 6 ? '#a0a0a0' : '#ffffff'; const s = textSprite((e.boss ? '' : 'NV.' + e.lv + ' ') + e.name, lvc); { const lx = x - (s.width >> 1), ly = top - 10 - (e.boss ? 8 : 0); if (LBL.t !== G.t) { LBL.t = G.t; LBL.r = []; } if (e.boss || !LBL.r.some(r => lx < r[0] + r[2] && lx + s.width > r[0] && ly < r[1] + 8 && ly + 8 > r[1])) { ctx.drawImage(s, lx, ly); LBL.r.push([lx, ly, s.width]); } } }
  } else if (e.type === 'npc') {
    if (!e.noTag || dist2(e.x, e.y, G.P.x, G.P.y) < 2500) { const s = textSprite(e.def.n, '#ffe8a0'), lx = x - (s.width >> 1), ly = top - 9; if (LBL.t !== G.t) { LBL.t = G.t; LBL.r = []; } const near = dist2(e.x, e.y, G.P.x, G.P.y) < 1600; if (near || !LBL.r.some(r => lx < r[0] + r[2] && lx + s.width > r[0] && ly < r[1] + 8 && ly + 8 > r[1])) { ctx.drawImage(s, lx, ly); LBL.r.push([lx, ly, s.width]); } }
    const mk = npcMarker(e.id); if (mk) { const ms = textSprite(mk[0], mk[1]); const bob = Math.round(Math.sin(G.t * 5) * 1.5); ctx.drawImage(ms, x - ms.width, top - 26 + bob, ms.width * 2, ms.height * 2); }
  } else if (e.type === 'remote') {
    const s = textSprite(e.name + ' NV.' + e.lv, '#8ae0ff'); ctx.drawImage(s, x - (s.width >> 1), top - 9);
  }
  if (e.chat && G.t - e.chatT < 6) { drawBubble(e.chat, x, top - (e.type === 'npc' ? 30 : 14)); }
}
function drawBubble(str, x, y) {
  const lines = []; const words = str.split(' '); let ln = ''; for (const w of words) { if ((ln + ' ' + w).trim().length > 22) { lines.push(ln.trim()); ln = w; } else ln += ' ' + w; } if (ln.trim()) lines.push(ln.trim());
  const sps = lines.slice(0, 3).map(l => textSprite(l, '#20141a', null)); const w = Math.max(...sps.map(s => s.width)) + 6, h = sps.length * 8 + 4;
  ctx.fillStyle = '#20141a'; ctx.fillRect(x - w / 2 - 1, y - h - 1, w + 2, h + 2); ctx.fillStyle = '#fff8ec'; ctx.fillRect(x - w / 2, y - h, w, h); ctx.fillRect(x - 1, y, 3, 2);
  sps.forEach((s, i) => ctx.drawImage(s, Math.round(x - s.width / 2), y - h + 1 + i * 8));
}
// ---------- fx drawing ----------
function drawFx(f, cx, cy) {
  const x = f.x - cx, y = f.y - cy, k = f.t / f.dur;
  switch (f.type) {
    case 'slash': { const a0 = f.ang - f.arc / 2, a1 = f.ang + f.arc / 2; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { const r = f.r * (0.7 + i * 0.15); ctx.strokeStyle = i === 2 ? `rgba(255,255,255,${(1 - k).toFixed(2)})` : f.col || `rgba(200,230,255,${((1 - k) * 0.7).toFixed(2)})`; ctx.lineWidth = i === 2 ? 2 : 3; ctx.beginPath(); const s = a0 + (a1 - a0) * Math.min(1, k * 2.2) * 0.0, e = a0 + (a1 - a0) * Math.min(1, k * 3); ctx.arc(x, y - 10, r, s, e); ctx.stroke(); } break; }
    case 'note': { const yy = f.y - cy - k * 28, xx = f.x - cx + Math.sin(k * 9 + f.x) * 4; ctx.globalAlpha = clamp(1.4 - k * 1.4, 0, 1); ctx.fillStyle = f.col || '#ffd040'; ctx.beginPath(); ctx.ellipse(xx, yy, 2.6, 1.9, -0.4, 0, 7); ctx.fill(); ctx.fillRect(Math.round(xx + 1.5), Math.round(yy - 7), 1.5, 7); ctx.fillRect(Math.round(xx + 1.5), Math.round(yy - 7), 4, 1.5); if (f.dbl) { ctx.fillRect(Math.round(xx + 5), Math.round(yy - 6), 1.5, 6); ctx.beginPath(); ctx.ellipse(xx + 3.6, yy + 1, 2.6, 1.9, -0.4, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; break; }
    case 'bolt': { ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.col; ctx.lineWidth = 2; ctx.beginPath(); const sx = f.x - cx, sy = f.y - cy, ex = f.x2 - cx, ey = f.y2 - cy; ctx.moveTo(sx, sy); for (let q = 1; q < 6; q++) { const tt = q / 6; ctx.lineTo(sx + (ex - sx) * tt + (Math.random() - 0.5) * 10, sy + (ey - sy) * tt + (Math.random() - 0.5) * 6); } ctx.lineTo(ex, ey); ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1; break; }
    case 'ring': { ctx.strokeStyle = f.col; ctx.globalAlpha = 1 - k; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, f.r * (0.3 + k * 0.7), f.r * (0.3 + k * 0.7) * 0.55, 0, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; break; }
    case 'tele': { const fill = Math.min(1, k); ctx.fillStyle = f.col || 'rgba(255,40,40,0.18)'; ctx.strokeStyle = 'rgba(255,60,60,0.8)'; ctx.lineWidth = 1;
      if (f.shape === 'circle') { ctx.beginPath(); ctx.ellipse(x, y, f.r, f.r * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(255,60,60,0.3)'; ctx.beginPath(); ctx.ellipse(x, y, f.r * fill, f.r * 0.6 * fill, 0, 0, Math.PI * 2); ctx.fill(); }
      else if (f.shape === 'line') { ctx.save(); ctx.translate(x, y); ctx.rotate(f.ang); ctx.fillRect(0, -f.w / 2, f.len, f.w); ctx.strokeRect(0, -f.w / 2, f.len, f.w); ctx.fillStyle = 'rgba(255,60,60,0.3)'; ctx.fillRect(0, -f.w / 2, f.len * fill, f.w); ctx.restore(); }
      else if (f.shape === 'cone') { ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, f.r, f.ang - f.arc / 2, f.ang + f.arc / 2); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(255,60,60,0.3)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, f.r * fill, f.ang - f.arc / 2, f.ang + f.arc / 2); ctx.closePath(); ctx.fill(); }
      break; }
    case 'field': { ctx.fillStyle = f.col; ctx.globalAlpha = 0.25 + Math.sin(G.t * 6) * 0.08; ctx.beginPath(); ctx.ellipse(x, y, f.r, f.r * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; if (Math.random() < 0.4) part(f.x + (Math.random() - 0.5) * f.r * 1.6, f.y + (Math.random() - 0.5) * f.r, { vz: 20, life: 0.6, c: f.pc || '#ffffff' }); break; }
    case 'boom': { const r = f.r * (0.4 + k * 0.6); ctx.globalAlpha = 1 - k; ctx.fillStyle = f.col || '#ffb040'; ctx.beginPath(); ctx.arc(x, y - 4, r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff4c0'; ctx.beginPath(); ctx.arc(x, y - 4, r * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; break; }
    case 'fall': { const hgt = 90 * (1 - k); ctx.fillStyle = f.col || '#ff7020'; if (f.art === 'arrowrain') { ctx.fillStyle = '#e8e0d0'; ctx.fillRect(Math.round(x), Math.round(y - hgt - 8), 1, 7); } else if (f.art === 'note') { ctx.fillStyle = '#ffd040'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♪', Math.round(x), Math.round(y - hgt)); }
      else if (f.art === 'phoenix') { const px = Math.round(x - hgt * 0.3), py = Math.round(y - hgt), fl = Math.sin(G.t * 30) > 0 ? 3 : 1; ctx.fillStyle = '#ff5a10'; ctx.beginPath(); ctx.moveTo(px - 7, py - fl - 2); ctx.lineTo(px, py + 1); ctx.lineTo(px + 7, py - fl - 2); ctx.lineTo(px, py - 3); ctx.fill(); ctx.fillStyle = '#ffd040'; ctx.fillRect(px - 1, py - 3, 3, 6); ctx.fillStyle = 'rgba(255,140,40,0.5)'; ctx.fillRect(px, py - 12, 1, 9); } else { ctx.beginPath(); ctx.arc(x - hgt * 0.4, y - hgt, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ffe080'; ctx.fillRect(Math.round(x - hgt * 0.4) - 1, Math.round(y - hgt) - 1, 2, 2); } break; }
    case 'beam': { ctx.globalAlpha = 1 - k; ctx.fillStyle = f.col; ctx.fillRect(Math.round(x - 6 + k * 3), Math.round(y - 120), Math.round(12 - k * 6), 120); ctx.globalAlpha = 1; break; }
    case 'line': { ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(f.x2 - cx, f.y2 - cy); ctx.stroke(); ctx.globalAlpha = 1; break; }
  }
}
// ---------- projectiles ----------
function spawnProj(owner, x, y, ang, o) { const e = Object.assign({ type: 'proj', owner, x, y, z: 12, ang, vx: Math.cos(ang) * (o.spd || 200), vy: Math.sin(ang) * (o.spd || 200), life: o.life || 0.9, t: 0, hit: new Set(), map: G.map.id, noShadow: false, shR: 3 }, o); if (e.art === 'eclipse' || e.art === 'storm') { e.glow = 26; e.glowC = e.art === 'eclipse' ? 'rgb(176,112,255)' : 'rgb(122,216,255)'; } if (e.art === 'fire' || e.art === 'orb' || e.art === 'meteor') { e.glow = 30; e.glowC = e.art === 'orb' ? 'rgba(120,160,255,0.6)' : 'rgba(255,140,40,0.6)'; } G.ents.push(e); return e; }
function drawProj(e, cx, cy) {
  const x = Math.round(e.x - cx), y = Math.round(e.y - cy - e.z), c = Math.cos(e.ang), s = Math.sin(e.ang);
  switch (e.art) {
    case 'arrow': case 'bigarrow': { const L = e.art === 'bigarrow' ? 12 : 8; ctx.strokeStyle = '#7a5434'; ctx.lineWidth = e.art === 'bigarrow' ? 2 : 1; ctx.beginPath(); ctx.moveTo(x - c * L, y - s * L); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = '#e8eef6'; ctx.fillRect(x - 1, y - 1, 2, 2); ctx.fillStyle = '#f0f0f0'; ctx.fillRect(Math.round(x - c * L) - 1, Math.round(y - s * L) - 1, 2, 2); if (e.art === 'bigarrow') part(e.x, e.y, { z: e.z, life: 0.25, c: '#fff4c0' }); break; }
    case 'dagger': { ctx.save(); ctx.translate(x, y); ctx.rotate(e.ang + G.t * 20); ctx.fillStyle = '#d8e0ea'; ctx.fillRect(-4, -1, 8, 2); ctx.fillStyle = '#8a6a40'; ctx.fillRect(-4, -1, 2, 2); ctx.restore(); break; }
    case 'fire': case 'meteor': { ctx.fillStyle = '#e8501a'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); ctx.fillStyle = '#ffd040'; ctx.beginPath(); ctx.arc(x + c, y + s, 2.5, 0, 7); ctx.fill(); part(e.x - c * 4, e.y - s * 4, { z: e.z, vz: 8, life: 0.35, c: Math.random() < 0.5 ? '#ff8a2a' : '#ffd040', s: 2 }); break; }
    case 'ice': { ctx.save(); ctx.translate(x, y); ctx.rotate(e.ang); ctx.fillStyle = '#bfefff'; ctx.fillRect(-7, -1, 12, 3); ctx.fillStyle = '#ffffff'; ctx.fillRect(3, -1, 3, 2); ctx.fillStyle = '#5ab0e8'; ctx.fillRect(-7, 1, 10, 1); ctx.restore(); part(e.x, e.y, { z: e.z, life: 0.3, c: '#bfefff' }); break; }
    case 'note': { const bob = Math.sin(e.t * 18) * 2, col = e.music === 2 ? '#ff7ab0' : '#ffd040'; ctx.fillStyle = 'rgba(255,208,64,0.25)'; ctx.beginPath(); ctx.arc(x, y + bob, 6, 0, 7); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x - 1, y + 2 + bob, 3, 2.2, -0.4, 0, 7); ctx.fill(); ctx.fillRect(x + 1, y - 6 + bob, 1.5, 8); ctx.fillRect(x + 1, y - 6 + bob, 4, 1.5); if (Math.random() < 0.3) part(e.x, e.y, { z: e.z, vz: 10, life: 0.4, c: Math.random() < 0.5 ? '#ffd040' : '#ff9ac8', s: 1 }); break; }
    case 'soul': { ctx.fillStyle = 'rgba(90,176,255,0.3)'; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#5ab0ff'; ctx.beginPath(); ctx.arc(x, y, 3.8, 0, 7); ctx.fill(); ctx.fillStyle = '#e0f4ff'; ctx.fillRect(x - 1, y - 2, 2, 2); part(e.x - c * 3, e.y - s * 3, { z: e.z, vz: 6, life: 0.45, c: Math.random() < 0.5 ? '#5ab0ff' : '#d0f0ff', s: 2 }); break; }
    case 'orb': { ctx.fillStyle = '#4a7aff'; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill(); ctx.fillStyle = '#d0e4ff'; ctx.fillRect(x - 1, y - 2, 2, 2); part(e.x, e.y, { z: e.z, life: 0.3, c: '#8ab0ff' }); break; }
    case 'poison': case 'dark': case 'evil': case 'arcane': { ctx.fillStyle = e.art === 'poison' ? '#5ad040' : '#a040e0'; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill(); ctx.fillStyle = e.art === 'poison' ? '#c0ff90' : '#e8b0ff'; ctx.fillRect(x - 1, y - 1, 2, 2); part(e.x, e.y, { z: e.z, life: 0.3, c: e.art === 'poison' ? '#6ae04a' : '#c070ff' }); break; }
    case 'eclipse': { ctx.fillStyle = 'rgba(176,112,255,0.35)'; ctx.beginPath(); ctx.arc(x - c * 6, y - s * 6, 4, 0, 7); ctx.fill(); ctx.fillStyle = '#2a0a3a'; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); ctx.strokeStyle = '#d0a0ff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 2, 2, 2); if (Math.random() < 0.5) burst(e.x, e.y - e.z, 1, { sp: 10, up: 5, g: 0, life: 0.4, c: ['#b070ff', '#ffd0ff'] }); break; }
    case 'storm': { ctx.save(); ctx.translate(x, y); ctx.rotate(e.ang); ctx.strokeStyle = '#bfefff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-5, -2); ctx.lineTo(-2, 1); ctx.lineTo(4, 0); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.fillRect(3, -1, 4, 2); ctx.restore(); if (Math.random() < 0.4) burst(e.x, e.y - e.z, 1, { sp: 12, up: 4, g: 0, life: 0.3, c: ['#7ad8ff', '#ffffff'] }); break; }
    case 'rock': { ctx.fillStyle = '#7a6f62'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); ctx.fillStyle = '#968a7b'; ctx.fillRect(x - 2, y - 2, 2, 2); break; }
    default: { ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 1, 3, 3); }
  }
}
function updateProj(e, dt) {
  e.t += dt; e.x += e.vx * dt; e.y += e.vy * dt; if (e.t > e.life) { e.remove = true; if (e.ex) explode(e); return; }
  const M = G.map; const ti = tileAt(M, Math.floor(e.x / 16), Math.floor(e.y / 16)); if (ti < 0) { e.remove = true; return; }
  if (M.ter[ti] === T.CWALL || M.ter[ti] === T.IWALL) { e.remove = true; if (e.ex) explode(e); return; }
  if (e.owner === 'p') {
    for (const m of G.ents) { if (m.type !== 'mob' || m.dying || e.hit.has(m) || m.map !== e.map) continue; const rr = (m.rad || 8) + 4; if (dist2(m.x, m.y - 8, e.x, e.y) < rr * rr) { e.hit.add(m); if (e.ex) { explode(e); e.remove = true; return; } hitMob(m, e.dmg, e); if (!e.pierce) { e.remove = true; return; } } }
    pvpProj(e);
  } else {
    const P = G.P; if (!P.dead && dist2(P.x, P.y - 8, e.x, e.y) < 100) { hurtPlayer(e.dmg, e); e.remove = true; if (e.ex) explode(e); }
  }
}
function explode(e) {
  addFx({ type: 'boom', x: e.x, y: e.y, r: e.ex, dur: 0.35, col: e.art === 'ice' ? '#9ae0ff' : e.art === 'poison' ? '#6ae04a' : '#ff8a2a', light: e.ex * 2 });
  burst(e.x, e.y, 10, { sp: 70, up: 30, g: 120, life: 0.5, c: e.art === 'ice' ? ['#bfefff', '#ffffff'] : ['#ff8a2a', '#ffd040', '#e8501a'] }); sfx('boom');
  if (e.owner === 'p') { for (const m of G.ents) if (m.type === 'mob' && !m.dying && m.map === e.map && dist2(m.x, m.y, e.x, e.y) < (e.ex + (m.rad || 8)) ** 2) hitMob(m, e.dmg, e); }
  else if (dist2(G.P.x, G.P.y, e.x, e.y) < e.ex * e.ex) hurtPlayer(e.dmg, e);
}
// ---------- combat core ----------
function nearestMob(x, y, r, filter) { let best = null, bd = r * r; for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.map !== G.map.id) continue; if (filter && !filter(m)) continue; const d = dist2(m.x, m.y, x, y); if (d < bd) { bd = d; best = m; } } return best; }
function hitMob(m, base, src = {}) {
  const P = G.P, S = P.S; if (m.dying) return 0;
  let d = base * dmgRedM(m.df, m.lv) * (0.9 + Math.random() * 0.2);
  let crit = Math.random() * 100 < S.crit + (src.critB || 0) + (P.buff.crit || 0);
  if (P.buff.ambush) { d *= 1 + P.buff.ambush / 100; crit = true; for (const bb of P.buffs.slice()) if (bb.st.invis || bb.st.ambush) removeBuff(P, bb.id); }
  if (crit) d *= S.critD / 100;
  if (m.mark > 0) d *= 1 + m.markP / 100;
  if (m.poison > 0 && S.vsPoison) d *= 1 + S.vsPoison / 100;
  if (src.fire && S.fireP) d *= 1 + S.fireP / 100;
  if (src.exec && m.hp < m.maxhp * 0.3) d *= 2;
  if (m.armorT > 0) d *= 0.5;
  d = Math.max(1, Math.round(d)); m.hp -= d; m.flash = 0.12; m.lastHit = G.t; if (m.boss) partyOnBossHit(m, d);
  floatText(m.x, m.y - (m.hgt || 30), d, crit ? '#ffd23a' : '#ffffff', crit);
  burst(m.x, m.y - 12, crit ? 8 : 4, { sp: 60, up: 20, g: 100, life: 0.3, c: crit ? ['#ffd040', '#ffffff'] : ['#ffffff', '#ffe8c0'] });
  if (src.slow) m.slow = Math.max(m.slow, src.slow); if (src.freeze) m.freeze = Math.max(m.freeze, src.freeze * (m.boss ? 0.3 : 1)); if (src.stun) m.stun = Math.max(m.stun, src.stun * (m.boss ? 0.3 : 1)); if (src.root) m.root = Math.max(m.root, src.root * (m.boss ? 0.3 : 1));
  if (src.burn) m.burn = 4, m.burnD = Math.round(P.S.atk * 0.15); if (src.poison || P.buff.poisonHit) { m.poison = Math.max(m.poison, src.poison || 4); m.poisonD = Math.round(P.S.atk * 0.12); }
  if (src.kb && !m.boss) { const a = Math.atan2(m.y - P.y, m.x - P.x); m.kbx = Math.cos(a) * src.kb; m.kby = Math.sin(a) * src.kb; }
  if (S.life && !src.summon) P.hp = Math.min(P.S.maxhp, P.hp + d * S.life / 100);
  if (src.drain) { P.hp = Math.min(P.S.maxhp, P.hp + d * src.drain / 100); }
  if (src.bard) bardNoteHit();
  if (m.state === 'idle' || m.state === 'return') { m.state = 'chase'; }
  if (!src.summon) P.target = m; P.combatT = G.t; G.hitstop = Math.max(G.hitstop, src.summon ? 0 : crit ? 0.06 : 0.03); if (crit) G.shake = Math.max(G.shake, 2); sfx(crit ? 'crit' : 'hit');
  if (src.leg) weaponOnHit(m, d, src);
  if (m.ghost) { ghostHit(m, d); return d; }
  if (m.hp <= 0) killMob(m);
  return d;
}
function hurtPlayer(base, src = {}) {
  const P = G.P; if (P.dead || P.ifr > 0 || G.paused) return;
  if (Math.random() * 100 < P.S.dodge) { floatText(P.x, P.y - 34, 'ESQUIVA', '#a0e0ff'); return; }
  let d = base * dmgRedP(P.S.def, (src && src.lv) || P.lv) * (0.9 + Math.random() * 0.2); d = Math.max(1, Math.round(d)); if (P.hp - d < P.S.maxhp * 0.35) tip('potion');
  if (P.shield > 0) { const ab = Math.min(P.shield, d); P.shield -= ab; d -= ab; if (ab) floatText(P.x, P.y - 34, 'ESCUDO', '#c0a0ff'); }
  if (d <= 0) return;
  P.hp -= d; P.flash = 0.15; P.lastHurt = G.t; P.combatT = G.t; floatText(P.x, P.y - 34, d, '#ff5a5a'); G.shake = Math.max(G.shake, 3); sfx('hurt'); vibrate(20);
  if (src.poison) { P.poison = 5; P.poisonD = Math.round(base * 0.08); }
  if (src.burn) { P.burn = 3; P.burnD = Math.round(base * 0.1); }
  if (src.slow) P.slowT = src.slow;
  if (P.hp <= 0) playerDie();
}
function killMob(m) {
  m.dying = 0.001; m.hp = 0; setAnim(m, 'hurt'); sfx('kill');
  burst(m.x, m.y - 10, 14, { sp: 70, up: 40, g: 140, life: 0.6, c: m.def.art[0] === 'slime' ? [uCss(C((SLIMEC[m.def.art[1]] || SLIMEC.green)[2])), '#ffffff'] : ['#d8d0c8', '#a09890', '#ffffff'] });
  const P = G.P; const lvDiff = m.lv - P.lv; let xp = m.xp * (lvDiff < -8 ? 0.3 : lvDiff < -4 ? 0.7 : lvDiff > 3 ? 1.25 : 1); if (lvDiff > 10) xp = Math.min(xp, xpToNext(P.lv) * 0.1); xp = Math.max(1, Math.round(xp));
  gainXp(xp); P.gold += m.gold; floatText(m.x, m.y - 44, '+' + xp + ' XP', '#c8a0ff'); partyOnKill(m, xp);
  if (m.gold) setTimeout(() => floatText(P.x, P.y - 40, '+' + m.gold + ' ORO', '#ffd040'), 150);
  if (m.ev || m.chief) worldEventKill(m);
  if (!m.summoned) captureSoul(m);
  if (!m.ghost) { passEvent('kill', m); petOnKill(m); }
  for (const [id, ch, n] of (m.def.drops || [])) if (Math.random() < ch * dropEventMul()) { const q = n ? Math.floor(1 + Math.random() * n) : 1; giveItem(id, q, true); lootFx(m.x, m.y, id); }
  if (Math.random() < 0.035 * (m.elite ? 4 : 1)) { let tier = 1; for (let t = 1; t <= 15; t++) if (TIER[t].lv <= m.lv) tier = t; const pool = ['h_', 'b_', 'l_', 'f_']; const id = pool[(Math.random() * 4) | 0] + tier; if (ITEMS[id]) { giveItem(id, 1, true); lootFx(m.x, m.y, id); } }
  if (Math.random() < 0.06) { giveItem(m.lv > 30 ? 'pocion2' : 'pocion1', 1, true); }
  P.stats.kills = (P.stats.kills || 0) + 1; if (!m.boss) P.best[m.mid] = (P.best[m.mid] || 0) + 1;
  if (m.elite) { const st = m.lv >= 100 ? 'piedra2' : 'piedra1'; if (Math.random() < 0.7) { giveItem(st, 1, true); lootFx(m.x, m.y, st); } for (const [id, ch, n] of (m.def.drops || [])) if (Math.random() < ch) giveItem(id, 1, true); }
  if (m.boss) bossKilled(m);
  questEvent('kill', { m: m.mid, fam: m.def.fam, lv: m.lv });
  if (m.camp) { m.camp.dead.push(G.t + (m.camp.boss ? 300 : 28 + Math.random() * 20)); }
  if (P.target === m) P.target = null;
}
function lootFx(x, y, id) { addFx({ type: 'ring', x, y, r: 14, dur: 0.4, col: RARC[ITEMS[id].rar || 0] }); }
// ---------- mobs ----------
function spawnMob(mid, lv, x, y, L, camp, boss) {
  const def = boss ? BOSSES[mid] : MOBS[mid]; const st = mobStats(def, lv, boss);
  const art = def.art; const atlas = mobAtlasFor(art); const hum = art[0] === 'hum';
  const e = { type: 'mob', mid, def, boss: !!boss, lv, name: def.n, hp: st.hp, maxhp: 0, atk: st.atk, df: st.def, xp: boss ? Math.round(st.xp * 1.6) : st.xp, gold: boss ? st.gold * 3 : st.gold, x, y, L, map: (G.map && G.map.id) || 'world', dir: 'down', anim: 'idle', af: 0, at: Math.random(), state: 'idle', st: Math.random() * 2, home: { x, y }, camp, atlas, hum, flash: 0, stun: 0, slow: 0, root: 0, freeze: 0, poison: 0, burn: 0, mark: 0, kbx: 0, kby: 0, cd: 1, z: 0 };
  if (!boss && camp && !camp.noElite && lv >= 6 && Math.random() < 0.04) { e.elite = 1; e.hp *= 3.5; e.atk = Math.round(e.atk * 1.4); e.xp *= 4; e.gold *= 4; e.name = 'Élite ' + def.n; }
  e.hp = Math.round(e.hp); e.maxhp = e.hp;
  e.spd = def.spd; e.range = (boss ? (def.r || 26) : (atlas.fw > 50 ? 22 : 15)); e.aggroR = boss ? 150 : def.ai === 'passive' ? 0 : 78 + Math.min(40, lv);
  e.rad = boss ? 16 : atlas.fw > 50 ? 12 : 8; e.hgt = boss ? atlas.fh - 10 : hum ? 34 : Math.round(atlas.fh * 0.7); e.shR = boss ? 18 : atlas.fw > 50 ? 10 : 7; e.hw = boss ? 7 : 4; e.hh = 3;
  if (def.fly) { e.z = 10; e.noShadow = false; }
  G.ents.push(e); return e;
}
function mobFace(m, dx, dy) { m.dir = dirFromVec(dx, dy); }
function telegraph(o) { addFx(Object.assign({ type: 'tele', ground: true }, o)); }
function updateMob(m, dt) {
  if (m.dying) { m.dying += dt; if (m.dying > 0.6) m.remove = true; return; }
  if (m.flash > 0) m.flash -= dt;
  if (m.ghost) { ghostUpdate(m, dt); return; }
  for (const k of ['stun', 'slow', 'root', 'freeze', 'mark']) if (m[k] > 0) m[k] -= dt;
  m.dot = (m.dot || 0) + dt; if (m.dot > 0.5) { m.dot = 0; if (m.poison > 0) { m.poison -= 0.5; dotMob(m, m.poisonD, '#7ae04a'); } if (m.burn > 0) { m.burn -= 0.5; dotMob(m, m.burnD, '#ff8a2a'); } if (m.dying) return; }
  const P = G.P; const M = G.map;
  if (m.kbx || m.kby) { moveEnt(M, m, m.kbx * dt, m.kby * dt); m.kbx *= 0.82; m.kby *= 0.82; if (Math.abs(m.kbx) + Math.abs(m.kby) < 3) m.kbx = m.kby = 0; }
  m.cd -= dt;
  const busy = m.stun > 0 || m.freeze > 0;
  const fps = m.anim === 'walk' ? 8 : m.anim === 'atk' ? 8 : 3; m.loopAnim = m.anim !== 'atk'; if (!busy) stepAnim(m, dt, fps);
  if (busy) return;
  const d = Math.sqrt(dist2(m.x, m.y, P.x, P.y)), dh = Math.sqrt(dist2(m.x, m.y, m.home.x, m.home.y));
  const spd = m.spd * (m.slow > 0 ? 0.5 : 1) * (m.root > 0 ? 0 : 1);
  const moveTo = (tx, ty, sp) => { const dx = tx - m.x, dy = ty - m.y, L = Math.hypot(dx, dy); if (L < 1) return true; const vx = dx / L * sp * dt, vy = dy / L * sp * dt; mobFace(m, dx, dy); const ok = moveEnt(M, m, vx, vy); if (!ok) { m.stuck = (m.stuck || 0) + dt; } else m.stuck = 0; setAnim(m, 'walk', true); return false; };
  if (m.boss) return updateBoss(m, dt, d, dh, spd, moveTo);
  switch (m.state) {
    case 'idle': {
      m.st -= dt; if (m.wt) { if (moveTo(m.wt.x, m.wt.y, spd * 0.4) || m.stuck > 0.6) { m.wt = null; setAnim(m, 'idle'); } } else setAnim(m, 'idle', true);
      if (m.st <= 0) { m.st = 2 + Math.random() * 3; m.wt = { x: m.home.x + (Math.random() - 0.5) * 70, y: m.home.y + (Math.random() - 0.5) * 50 }; }
      if (!P.dead && !P.invis && !G.pSafe && d < m.aggroR && (P.L === m.L || P.L < 0) && P.map === m.map) m.state = 'chase';
      break;
    }
    case 'chase': {
      if (P.dead || G.pSafe || dh > 230 || (m.stuck > 2.5) || P.map !== m.map) { m.state = 'return'; break; }
      const ranged = m.def.ai === 'ranged';
      if (ranged && d < 120 && m.cd <= 0) { mobFace(m, P.x - m.x, P.y - m.y); setAnim(m, 'atk'); m.cd = 1.8; const a = Math.atan2(P.y - 8 - (m.y - 10), P.x - m.x); spawnProj('m', m.x, m.y - 4, a, { spd: 120, dmg: m.atk, art: m.def.burn ? 'fire' : 'evil', life: 1.6, burn: m.def.burn }); sfx('cast'); break; }
      if (ranged && d < 60) { moveTo(m.x - (P.x - m.x), m.y - (P.y - m.y), spd * 0.8); break; }
      if (m.def.ai === 'charge' && d < 100 && d > 30 && m.cd <= 0) { m.state = 'windup'; m.wu = 0.6; m.charge = 1; const a = Math.atan2(P.y - m.y, P.x - m.x); m.cang = a; telegraph({ shape: 'line', x: m.x, y: m.y, ang: a, len: 110, w: 14, dur: 0.6 }); break; }
      if (d <= m.range + 6) { m.state = 'windup'; m.wu = 0.38; setAnim(m, 'idle'); mobFace(m, P.x - m.x, P.y - m.y); break; }
      moveTo(P.x, P.y, spd); break;
    }
    case 'windup': {
      m.wu -= dt; m.flash = Math.max(m.flash, (m.wu * 10 % 1 < 0.5) ? 0.03 : 0);
      if (m.wu <= 0) {
        if (m.charge) { m.state = 'dash'; m.dt2 = 0.45; m.charge = 0; setAnim(m, 'walk'); break; }
        setAnim(m, 'atk'); m.state = 'chase'; m.cd = 1.1 + Math.random() * 0.5;
        if (d <= m.range + 12 && (P.L === m.L || P.L < 0 || m.L < 0)) hurtPlayer(m.atk, { poison: m.def.poison, burn: m.def.burn });
        sfx('swing');
      }
      break;
    }
    case 'dash': { m.dt2 -= dt; moveEnt(M, m, Math.cos(m.cang) * m.spd * 3.6 * dt, Math.sin(m.cang) * m.spd * 3.6 * dt); if (d < 16 && !m.dHit) { m.dHit = 1; hurtPlayer(m.atk * 1.3); } if (m.dt2 <= 0) { m.state = 'chase'; m.cd = 2; m.dHit = 0; } break; }
    case 'return': { if (moveTo(m.home.x, m.home.y, spd * 1.4) || m.stuck > 3) { m.state = 'idle'; m.stuck = 0; if (m.stuck > 3) { m.x = m.home.x; m.y = m.home.y; } } m.hp = Math.min(m.maxhp, m.hp + m.maxhp * 0.2 * dt); break; }
  }
}
function dotMob(m, dmg, col) { dmg = Math.max(1, Math.round(dmg)); m.hp -= dmg; floatText(m.x, m.y - (m.hgt || 28), dmg, col); if (m.hp <= 0) killMob(m); }
// ---------- bosses ----------
function updateBoss(m, dt, d, dh, spd, moveTo) {
  const P = G.P;
  const engage = () => { m.state = 'fight'; m.mcd = 1; m.cd = Math.min(m.cd, 0.3); m.lostT = 0; showBoss(m); sfx('boss'); setMusic('boss'); };
  // not fighting: walk home (never teleport) and only heal slowly after a while out of combat
  if (m.state !== 'fight') {
    if (m.state === 'chase') { engage(); return; } // hit while idle -> react at once
    m.oocT = (m.oocT || 0) + dt; if (m.oocT > 8 && m.hp < m.maxhp) m.hp = Math.min(m.maxhp, m.hp + m.maxhp * 0.03 * dt);
    if (dh > 10 && m.stuck < 4) moveTo(m.home.x, m.home.y, spd * 1.2); else { setAnim(m, 'idle', true); if (m.stuck >= 4) { m.x = m.home.x; m.y = m.home.y; m.stuck = 0; } }
    if (!P.dead && !G.pSafe && d < m.aggroR + 30 && P.map === m.map) engage();
    return;
  }
  // fighting: only give up when the player is really gone for several seconds (dead, left the map, hid in town or ran far away)
  const gone = P.dead || P.map !== m.map || G.pSafe || Math.hypot(P.x - m.home.x, P.y - m.home.y) > 620 || d > 520;
  if (gone) { m.lostT = (m.lostT || 0) + dt; if (m.lostT > (P.dead ? 2 : 7)) { m.state = 'idle'; m.oocT = 0; m.stuck = 0; showBoss(null); setMusic(null); } else setAnim(m, 'idle', true); return; }
  m.lostT = 0; m.oocT = 0;
  if (m.hp < m.maxhp * 0.5 && !m.enraged) { m.enraged = true; m.spd *= 1.25; floatText(m.x, m.y - m.hgt - 10, '¡FURIA!', '#ff4040', true); G.shake = 6; }
  m.mcd -= dt;
  if (m.busyT > 0) { m.busyT -= dt; if (m.dash) { const s = m.spd * 4.2 * dt; moveEnt(G.map, m, Math.cos(m.dash.a) * s, Math.sin(m.dash.a) * s); if (d < 22 && !m.dash.hit) { m.dash.hit = 1; hurtPlayer(m.atk * 1.4); } if (m.busyT <= 0) m.dash = null; } return; }
  if (m.hp < m.maxhp * 0.3 && !m.desperate) { m.desperate = true; floatText(m.x, m.y - m.hgt - 10, '¡DESESPERADO!', '#ff2020', true); G.shake = 8; bossMove(m, 'nova'); m.mcd = 1.6; m.armorT = 4; return; }
  if (m.armorT > 0) m.armorT -= dt;
  // anti-kite: if the player keeps away, the boss closes the gap
  if (d > 150) m.farT = (m.farT || 0) + dt; else m.farT = 0;
  if (m.mcd <= 0 || (m.farT > 3.5 && m.mcd < 1.5)) { const mv = pickBossMove(m, d); bossMove(m, mv); m.lastMv = mv; m.farT = 0; m.mcd = (m.desperate ? 1.9 : m.enraged ? 2.3 : 3.2) + Math.random() * 0.8; if (m.enraged && Math.random() < (m.desperate ? 0.35 : 0.2)) m.comboT = m.busyT + 0.35; return; }
  if (m.comboT > 0) { m.comboT -= dt; if (m.comboT <= 0) { const mv = pickBossMove(m, d); if (mv !== 'summon') { bossMove(m, mv); m.lastMv = mv; } return; } }
  if (d <= m.range + 8) { if (m.cd <= 0) { setAnim(m, 'atk'); m.cd = m.enraged ? 1 : 1.4; mobFace(m, P.x - m.x, P.y - m.y); telegraph({ shape: 'circle', x: m.x + Math.cos(Math.atan2(P.y - m.y, P.x - m.x)) * 14, y: m.y + Math.sin(Math.atan2(P.y - m.y, P.x - m.x)) * 10, r: m.range, dur: 0.45, cb: f => { if (dist2(P.x, P.y, f.x, f.y) < f.r * f.r) hurtPlayer(m.atk); } }); } else setAnim(m, 'idle', true); }
  else moveTo(P.x, P.y, spd);
}
const GAP = ['charge', 'hop', 'blink'], FAR = ['volley', 'rain', 'roots', 'field', 'charge', 'hop', 'blink', 'summon'], NEAR = ['slam', 'nova', 'breath', 'summon', 'field'];
function pickBossMove(m, d) {
  const mv = m.def.moves, far = d > 110; let pool = mv.filter(x => (far ? FAR : NEAR).includes(x));
  if (m.farT > 3.5) { const g = mv.filter(x => GAP.includes(x)); if (g.length) pool = g; }
  if (pool.length > 1) pool = pool.filter(x => x !== m.lastMv); if (!pool.length) pool = mv;
  return pool[Math.floor(Math.random() * pool.length)];
}
function bossMove(m, mv) {
  const P = G.P, a = Math.atan2(P.y - m.y, P.x - m.x); setAnim(m, 'atk'); mobFace(m, P.x - m.x, P.y - m.y);
  const hitIn = (x, y, r, mult, extra) => f => { if (dist2(P.x, P.y, x, y) < r * r) hurtPlayer(m.atk * mult, extra); G.shake = Math.max(G.shake, 4); burst(x, y, 12, { sp: 80, up: 30, g: 120, life: 0.5, c: ['#d8c8b0', '#8a7a6a'] }); };
  switch (mv) {
    case 'slam': { const r = m.range + 30; telegraph({ shape: 'circle', x: m.x, y: m.y, r, dur: 0.9, cb: hitIn(m.x, m.y, r, 1.6, { stun: 1 }) }); m.busyT = 0.9; break; }
    case 'hop': { const tx = P.x, ty = P.y; telegraph({ shape: 'circle', x: tx, y: ty, r: 36, dur: 0.9, cb: f => { m.x = tx; m.y = ty; hitIn(tx, ty, 36, 1.7)(f); } }); m.busyT = 0.95; break; }
    case 'summon': { if (G.ents.filter(e => e.summoned && !e.dying && !e.remove).length >= 6) { bossMove(m, 'slam'); return; } const id = m.def.minion || 'slime_v'; for (let k = 0; k < (m.enraged ? 4 : 3); k++) { const an = k / 3 * Math.PI * 2; const s = spawnMob(id, Math.max(1, m.lv - 4), m.x + Math.cos(an) * 30, m.y + Math.sin(an) * 22, m.L, null); s.state = 'chase'; s.home = { x: m.x, y: m.y }; s.summoned = 1; s.map = m.map; addFx({ type: 'ring', x: s.x, y: s.y, r: 16, dur: 0.5, col: '#c070ff' }); } m.busyT = 0.6; break; }
    case 'roots': case 'rain': { const n = mv === 'rain' ? 6 : 4; for (let k = 0; k < n; k++) { const x = P.x + (Math.random() - 0.5) * 90, y = P.y + (Math.random() - 0.5) * 60; setTimeout(() => telegraph({ shape: 'circle', x, y, r: 24, dur: 0.9, cb: hitIn(x, y, 24, 1.2, mv === 'roots' ? { slow: 2 } : {}) }), k * 160); } m.busyT = 0.8; break; }
    case 'charge': { telegraph({ shape: 'line', x: m.x, y: m.y, ang: a, len: 150, w: 22, dur: 0.75 }); m.busyT = 1.2; setTimeout(() => { m.dash = { a, hit: 0 }; }, 750); break; }
    case 'volley': { const n = m.enraged ? 9 : 6; for (let k = 0; k < n; k++) { const an = a + (k - (n - 1) / 2) * 0.22; spawnProj('m', m.x, m.y - 10, an, { spd: 110, dmg: m.atk * 0.8, art: m.mid === 'ignaroth' ? 'fire' : m.mid === 'morgana' ? 'poison' : 'evil', life: 2, poison: m.mid === 'morgana' }); } sfx('cast'); m.busyT = 0.5; break; }
    case 'blink': { addFx({ type: 'ring', x: m.x, y: m.y, r: 20, dur: 0.4, col: '#c070ff' }); m.x = P.x + (Math.random() - 0.5) * 100; m.y = P.y + (Math.random() - 0.5) * 70; if (blockedFor(G.map, Math.floor(m.x / 16), Math.floor(m.y / 16), m.L)) { m.x = m.home.x; m.y = m.home.y; } addFx({ type: 'ring', x: m.x, y: m.y, r: 20, dur: 0.4, col: '#c070ff' }); m.busyT = 0.4; break; }
    case 'field': { const x = P.x, y = P.y; addFx({ type: 'field', ground: true, x, y, r: 34, dur: 5, col: '#5ad040', pc: '#9aff7a', tick: 0.5, cbTick: f => { if (dist2(P.x, P.y, f.x, f.y) < f.r * f.r) hurtPlayer(m.atk * 0.35, { poison: 1 }); } }); m.busyT = 0.5; break; }
    case 'nova': { const r = 80; telegraph({ shape: 'circle', x: m.x, y: m.y, r, dur: 1.2, col: 'rgba(120,200,255,0.2)', cb: hitIn(m.x, m.y, r, 1.8, { slow: 2 }) }); m.busyT = 1.2; break; }
    case 'breath': { telegraph({ shape: 'cone', x: m.x, y: m.y - 4, ang: a, arc: 0.9, r: 130, dur: 1, cb: f => { const pa = Math.atan2(P.y - m.y, P.x - m.x); let da = Math.abs(((pa - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (da < 0.45 && d2(P, m) < 130 * 130) hurtPlayer(m.atk * 2, { burn: 1 }); for (let k = 0; k < 30; k++) { const an = a + (Math.random() - 0.5) * 0.9, rr = Math.random() * 130; part(m.x + Math.cos(an) * rr, m.y + Math.sin(an) * rr, { vz: 30, life: 0.6, c: Math.random() < 0.5 ? '#ff8a2a' : '#ffd040', s: 2 }); } } }); m.busyT = 1.1; break; }
  }
}
function d2(a, b) { return dist2(a.x, a.y, b.x, b.y); }
// ---------- NPCs ----------
function spawnNPC(id, x, y, mapId, o = {}) { const def = NPCS[id]; if (!def) return null; const e = Object.assign({ type: 'npc', id, def, x, y, L: o.L !== undefined ? o.L : 0, map: mapId, dir: o.face || 'down', anim: 'idle', af: 0, at: Math.random(), home: { x, y }, wander: o.wander || 0, st: Math.random() * 3, hum: true, shR: 6 }, o); e.atlas = npcAtlas(id); G.ents.push(e); return e; }
function updateNPC(e, dt) {
  if (e.scene) return; if (e.follow && COMP && COMP.e === e) { compUpdate(e, dt); return; }
  if (e.life) { lifeUpdate(e, dt); return; }
  const P = G.P; const near = P.map === e.map && dist2(e.x, e.y, P.x, P.y) < 40 * 40;
  if (near) { e.dir = dirFromVec(P.x - e.x, P.y - e.y); setAnim(e, 'idle', true); e.wt = null; }
  else if (e.wander) { e.st -= dt; if (e.wt) { const dx = e.wt.x - e.x, dy = e.wt.y - e.y, L = Math.hypot(dx, dy); if (L < 2) { e.wt = null; setAnim(e, 'idle'); } else { e.dir = dirFromVec(dx, dy); if (!moveEnt(G.maps[e.map] || G.map, e, dx / L * 24 * dt, dy / L * 24 * dt)) e.wt = null; setAnim(e, 'walk', true); } } if (e.st <= 0) { e.st = 3 + Math.random() * 4; e.wt = { x: e.home.x + (Math.random() - 0.5) * e.wander * 32, y: e.home.y + (Math.random() - 0.5) * e.wander * 24 }; } }
  stepAnim(e, dt, e.anim === 'walk' ? 7 : 2);
}
