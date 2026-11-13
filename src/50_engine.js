// ================= ENGINE: canvas, input, camera, rendering =================
const G = { maps: {}, map: null, world: null, P: null, ents: [], fx: [], parts: [], texts: [], cam: { x: 0, y: 0 }, time: 8 * 60, t: 0, frame: 0, shake: 0, hitstop: 0, paused: false, fade: 0, fadeTarget: 0, remote: new Map(), quality: 1 };
const cv = document.getElementById('game'), ctx = cv.getContext('2d', { alpha: false });
let VW = 400, VH = 225;
// v4.0: la pantalla se dibuja al doble por dentro (HDS = 2) para que la ropa tenga píxeles finos; se puede apagar en Ajustes
let HDS = (() => { try { return localStorage.getItem('thebound.hd') === '0' ? 1 : 2; } catch (e) { return 2; } })();
const lightCv = mkCanvas(64, 64), lctx = lightCv.getContext('2d');
function resize() {
  const w = innerWidth, h = innerHeight; let s;
  if (w >= h) s = Math.min(h / 216, w / 380); else s = Math.min(w / 240, h / 300);
  s = Math.max(1, s); VW = Math.round(w / s); VH = Math.round(h / s); cv.width = VW * HDS; cv.height = VH * HDS; ctx.setTransform(HDS, 0, 0, HDS, 0, 0); ctx.imageSmoothingEnabled = false;
  lightCv.width = VW; lightCv.height = VH;
}
addEventListener('resize', resize);
// ---------- input ----------
const keys = {}; const inp = { jx: 0, jy: 0, attack: false, act: false, actPressed: false };
addEventListener('keydown', e => { if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return; keys[e.code] = true; if (typeof onKey === 'function') onKey(e); });
addEventListener('keyup', e => { keys[e.code] = false; });
function moveInput() {
  let x = inp.jx, y = inp.jy;
  if (keys.KeyA || keys.ArrowLeft) x -= 1; if (keys.KeyD || keys.ArrowRight) x += 1; if (keys.KeyW || keys.ArrowUp) y -= 1; if (keys.KeyS || keys.ArrowDown) y += 1;
  const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } return [x, y];
}
// ---------- maps ----------
function tileAt(M, tx, ty) { if (tx < 0 || ty < 0 || tx >= M.w || ty >= M.h) return -1; return ty * M.w + tx; }
function blockedFor(M, tx, ty, L) {
  const i = tileAt(M, tx, ty); if (i < 0) return true; const t = M.ter[i];
  if (M.rail && M.rail[i] && !M.solidO[i]) return false;
  if (SOLID_T[t] || M.solidO[i]) return true;
  if (t === T.STAIRS || L < 0) return false;
  return M.lvl[i] !== L;
}
function moveEnt(M, e, dx, dy) {
  const hw = e.hw || 4, hh = e.hh || 3;
  const test = (x, y) => { const x0 = Math.floor((x - hw) / 16), x1 = Math.floor((x + hw) / 16), y0 = Math.floor((y - hh) / 16), y1 = Math.floor((y + hh) / 16); for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (blockedFor(M, tx, ty, e.L)) return true; return false; };
  let moved = false;
  if (dx) { if (!test(e.x + dx, e.y)) { e.x += dx; moved = true; } else if (!e.noSlide) { for (const s of [1, -1]) { if (!test(e.x + dx, e.y + s * 1.2) && !test(e.x, e.y + s * 1.2)) { e.y += s * Math.min(1.2, Math.abs(dx)); moved = true; break; } } } }
  if (dy) { if (!test(e.x, e.y + dy)) { e.y += dy; moved = true; } else if (!e.noSlide) { for (const s of [1, -1]) { if (!test(e.x + s * 1.2, e.y + dy) && !test(e.x + s * 1.2, e.y)) { e.x += s * Math.min(1.2, Math.abs(dy)); moved = true; break; } } } }
  const i = tileAt(M, Math.floor(e.x / 16), Math.floor(e.y / 16)); if (i >= 0) { e.L = M.ter[i] === T.STAIRS || (M.rail && M.rail[i]) ? -1 : M.lvl[i]; }
  return moved;
}
// ---------- chunk cache ----------
let chunkBudget = 2;
function storeChunk(M, k, cv) {
  railChunk(M, k, cv);
  M.chunks.set(k, { cv, t: G.frame });
  if (M.chunks.size > 90) { let old = null, ot = 1e12; for (const [kk, v] of M.chunks) if (v.t < ot) { ot = v.t; old = kk; } M.chunks.delete(old); }
  return cv;
}
const useWorker = M => !!(CW.w && CW.maps && CW.maps[M.id]);
function getChunk(M, cx, cy) {
  if (cx < 0 || cy < 0 || cx >= M.cw || cy >= M.chh) return null;
  const k = cy * 4096 + cx; const c = M.chunks.get(k); if (c) { c.t = G.frame; return c.cv; }
  if (chunkBudget <= 0) { if (useWorker(M)) requestChunk(M, cx, cy); return null; }
  chunkBudget--; return storeChunk(M, k, renderChunk(M, cx, cy));
}
const _pw = [];
function prewarm(M) {
  const wk = useWorker(M), m = wk ? 220 : 64;
  const cx0 = Math.floor((G.cam.x - m) / CHP), cy0 = Math.floor((G.cam.y - m) / CHP), cx1 = Math.floor((G.cam.x + VW + m) / CHP), cy1 = Math.floor((G.cam.y + VH + m) / CHP);
  const mx = (G.cam.x + VW / 2) / CHP - 0.5, my = (G.cam.y + VH / 2) / CHP - 0.5; _pw.length = 0;
  for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) { if (cx < 0 || cy < 0 || cx >= M.cw || cy >= M.chh) continue; if (M.chunks.has(cy * 4096 + cx)) continue; _pw.push([(cx - mx) * (cx - mx) + (cy - my) * (cy - my), cx, cy]); }
  if (!_pw.length) return; _pw.sort((a, b) => a[0] - b[0]);
  for (const [, cx, cy] of _pw) { if (wk) requestChunk(M, cx, cy); else if (chunkBudget > 0) getChunk(M, cx, cy); else break; }
}
// baked ground decor
const DECOR = { valle: [['fw', 0.05], ['fy', 0.025], ['tuft', 0.12], ['peb', 0.015]], costa: [['tuft', 0.08], ['fy', 0.02]], bosque: [['fern', 0.1], ['mush', 0.025], ['tuft', 0.06]], llanuras: [['gtuft', 0.16], ['fy', 0.03], ['fr', 0.01]], arxar: [['fw', 0.03], ['fp', 0.02], ['tuft', 0.1]], colinas: [['peb', 0.05], ['tuft', 0.06], ['fr', 0.01]], pantano: [['reeds', 0.04], ['fern', 0.05], ['mush', 0.02]], ruinas: [['peb', 0.04], ['fb', 0.02], ['fw', 0.02], ['tuft', 0.06]], picos: [['snowpeb', 0.04]], nhar: [['ember', 0.05], ['peb', 0.03]] };
const DECSPR = {};
function decorSpr(k, v) { const key = k + v; if (!DECSPR[key]) { if (k === 'mush') DECSPR[key] = genMushroom(v).c; else if (k === 'reeds') DECSPR[key] = genReeds().c; else DECSPR[key] = genDecor(k, v); } return DECSPR[key]; }
function decorateWorld(M) {
  M.decorate = (x, cx, cy) => {
    for (let ty = cy * CH; ty < cy * CH + CH; ty++) for (let tx = cx * CH; tx < cx * CH + CH; tx++) {
      const i = tileAt(M, tx, ty); if (i < 0) continue; const t = M.ter[i]; const h = hash2(tx, ty, 404);
      if (t === T.FARM) { if (ty % 1 === 0) x.drawImage(decorSpr(tx % 3 ? 'crop' : 'cabbage', 0), tx * 16 - cx * CHP + 3, ty * 16 - cy * CHP + 4); continue; }
      if (t === T.WATER && (M.reg[i] === RI.pantano || M.reg[i] === RI.valle) && M.wdist[i] <= 2 && h < 0.12) { x.drawImage(decorSpr('lily', (h * 100) | 0), tx * 16 - cx * CHP + 3, ty * 16 - cy * CHP + 3); continue; }
      if (M.objAt[i] >= 0 || (M.flags[i] & (1 | 2))) continue;
      if (!(t === T.GRASS || t === T.SNOW || t === T.SAND || t === T.ASH || t === T.MUD || t === T.DUSK)) continue;
      const rk = REGIONS[M.reg[i]].k; const L = t === T.SAND ? [['shell', 0.04]] : DECOR[rk]; if (!L) continue;
      let acc = 0; for (const [k, p] of L) { acc += p; if (h < acc) { const v = (hash2(tx, ty, 405) * 4) | 0; x.drawImage(decorSpr(k, v), tx * 16 - cx * CHP + 3 + ((h * 50) % 4 | 0), ty * 16 - cy * CHP + 3 + ((h * 90) % 4 | 0)); break; } }
    }
  };
}
// ---------- object sprites ----------
function objSprite(o) {
  const t = G.t;
  switch (o.k) {
    case 'tree': { if (o.st === 'stump') return spr('stump' + o.sp, () => genStump(o.sp)); return spr('tree' + o.sp + (o.v % 4), () => genTree(o.sp, o.v % 4)); }
    case 'rock': return spr('rock' + o.size + o.kind + (o.v % 6), () => genRock(o.size, o.v % 6, o.kind));
    case 'ore': if (o.st === 'dep') return spr('rockdep' + (o.v % 4), () => genRock('s', o.v % 4, '')); return spr('ore' + o.tier + (o.v % 3), () => genRock('m', o.v % 3 + o.tier * 10, o.tier));
    case 'herb': return spr('herb' + o.tier, () => genHerb(o.tier));
    case 'mound': return spr('mound' + (o.tier >= 6 ? 1 : 0), () => genMound(o.tier));
    case 'plot': { const S = plotState(o); return spr('plot' + S.st + (S.F ? S.F.c : ''), () => genPlot(S.st, S.F && S.F.c)); }
    case 'bush': return spr('bush' + o.kind + (o.v % 3), () => genBush(o.v % 3, o.kind));
    case 'lantern': return spr('lan' + o.kind, () => genLantern(o.kind));
    case 'banner': { const f = Math.floor(t * 2 + o.tx) % 2; return spr('ban' + o.col + f, () => genBanner(o.col, f)); }
    case 'fence': return spr('fence' + o.o, () => genFence(o.o));
    case 'barrel': return spr('barrel', genBarrel); case 'crate': return spr('crate', genCrate); case 'sack': return spr('sack', genSack); case 'sign': return spr('sign', genSign);
    case 'waystone': { const f = Math.floor(t * 1.5) % 2; return spr('ways' + f, () => genWaystone(f)); }
    case 'fountain': { const f = Math.floor(t * 6) % 3; return spr('fount' + f, () => genFountain(f)); }
    case 'well': return spr('well', genWell); case 'stall': return spr('stall' + o.col, () => genStall(o.col)); case 'cart': return spr('cart', genCart); case 'hay': return spr('hay', genHay); case 'bench': return spr('bench', genBench); case 'pot': return spr('pot' + o.col, () => genPot(o.col)); case 'statue': return spr('statue', genStatue);
    case 'rail': return spr('rail' + o.o, () => genRail(o.o));
    case 'campfire': { const f = Math.floor(t * 8) % 4; return spr('fire' + f, () => genCampfire(f)); }
    case 'tent': return spr('tent' + o.col, () => genTent(o.col)); case 'totem': return spr('totem', genTotem); case 'cactus': return spr('cactus' + (o.v % 3), () => genCactus(o.v % 3)); case 'obelisk': return spr('obelisk', genObelisk); case 'bones': return spr('bones', genBones);
    case 'pillar': return spr('pil' + (o.broken ? 1 : 0) + (o.v % 3), () => genPillar(o.broken, o.ivy, o.v % 3)); case 'arch': return spr('arch' + (o.v % 2), () => genArch(o.v % 2)); case 'ruinwall': return spr('rw' + (o.v % 3), () => genRuinWall(o.v % 3)); case 'grave': return spr('grave', () => genGrave(0));
    case 'crystal': return spr('cry' + (o.v % 3), () => genCrystal(o.v % 3)); case 'obsidian': return spr('obs' + (o.v % 3), () => genObsidian(o.v % 3));
    case 'portal': { const f = Math.floor(t * 6) % 4; return spr('portal' + f, () => genPortal(f)); }
    case 'anvil': return spr('anvil', genAnvil); case 'forge': { const f = Math.floor(t * 6) % 3; return spr('forge' + f, () => genForge(f)); }
    case 'nets': return spr('nets', genNets); case 'mine': return spr('mine', genMineEntrance); case 'cave': { const v = o.cave === 'grieta_magma' ? 1 : o.cave === 'abismo_cristal' ? 2 : 0; return spr('cave' + v, () => genCaveMouth(v)); } case 'mushroom': return spr('mushd' + (o.v % 2), () => genMushroom(o.v % 2)); case 'witchhut': return spr('witch', genWitchHut);
    case 'boat': return spr('boat', genBoat); case 'lighthouse': { const f = Math.floor(t) % 2; return spr('lh' + f, () => genLighthouse(f)); }
    case 'bld': return spr('bld' + o.id + (G.map ? G.map.id : ''), () => genBuilding(o.spec));
    case 'castle': return spr('castle', genCastle); case 'magetower': return spr('magetower', genMageTower); case 'gatetower': return spr('gatetower', genGateTower);
    case 'furn': { const anim = o.f === 'fireplace' || o.f === 'cauldron'; const f = anim ? Math.floor(t * 6) % 3 : 0; return spr('furn' + o.f + f, () => genFurn(o.f, f)); }
  }
  if (EXTRA_SPR[o.k]) return EXTRA_SPR[o.k](o);
  return spr('missing', () => ({ c: mkCanvas(4, 4), ax: 2, ay: 3 }));
}
const OBJSH = { tree: 1, rock: 1, ore: 1, bush: 1, cactus: [6, 2], obelisk: [8, 2], mound: [7, 2], barrel: [6, 2], crate: [7, 2], stall: [18, 3], cart: [12, 3], hay: [9, 3], statue: [10, 3], fountain: [20, 5], well: [10, 3], tent: [15, 3], totem: [5, 2], pillar: [8, 2], arch: [26, 4], lantern: [5, 2], waystone: [9, 3], gatetower: [18, 4], witchhut: [24, 4], lighthouse: [12, 3], magetower: [36, 6] };
// ---------- particles / fx ----------
function part(x, y, o) { if (G.parts.length > 260) G.parts.shift(); G.parts.push(Object.assign({ x, y, z: 0, vx: 0, vy: 0, vz: 0, g: 0, life: 0.6, t: 0, c: '#ffffff', s: 1 }, o)); }
function burst(x, y, n, o) { for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, sp = (o.sp || 40) * (0.4 + Math.random() * 0.8); part(x, y, Object.assign({}, o, { vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6, vz: (o.up || 0) * (0.5 + Math.random()), life: (o.life || 0.5) * (0.6 + Math.random() * 0.6), c: Array.isArray(o.c) ? o.c[(Math.random() * o.c.length) | 0] : o.c })); } }
function floatText(x, y, str, col, big) { G.texts.push({ x: x + (Math.random() - 0.5) * 6, y, str: String(str), col, t: 0, life: big ? 1.2 : 0.9, big }); if (G.texts.length > 40) G.texts.shift(); }
function addFx(o) { G.fx.push(Object.assign({ t: 0 }, o)); }
const GLOW = {};
function glowSprite(r, col) { const k = r + col; if (GLOW[k]) return GLOW[k]; const c = mkCanvas(r * 2, r * 2), x = c.getContext('2d'); const g = x.createRadialGradient(r, r, 0, r, r, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, r * 2, r * 2); GLOW[k] = c; return c; }
// ---------- camera ----------
function updateCamera(dt, snap) {
  const P = G.P, M = G.map; let tx = P.x - VW / 2, ty = P.y - 12 - VH / 2;
  const mw = M.w * 16, mh = M.h * 16;
  tx = mw < VW ? (mw - VW) / 2 : clamp(tx, 0, mw - VW); ty = mh < VH ? (mh - VH) / 2 : clamp(ty, 0, mh - VH);
  if (snap) { G.cam.x = tx; G.cam.y = ty; } else { const k = 1 - Math.pow(0.0005, dt); G.cam.x += (tx - G.cam.x) * k; G.cam.y += (ty - G.cam.y) * k; }
}
// ---------- day/night ----------
function darkness() { if (G.map && !G.map.isWorld) return G.map.dark || 0; const h = (G.time / 60) % 24; let d; if (h >= 20 || h < 5) d = 1; else if (h >= 18) d = (h - 18) / 2; else if (h < 7) d = 1 - (h - 5) / 2; else d = 0; return d * 0.62; }
// ---------- main render ----------
const drawList = [];
function render() {
  const M = G.map, P = G.P; if (!M || !P) return;
  const sx = G.shake > 0 ? Math.round((Math.random() - 0.5) * G.shake * 2) : 0, sy = G.shake > 0 ? Math.round((Math.random() - 0.5) * G.shake * 2) : 0;
  const cx = Math.round(G.cam.x) + sx, cy = Math.round(G.cam.y) + sy;
  ctx.fillStyle = M.isWorld ? '#1e4479' : '#0c0a10'; ctx.fillRect(0, 0, VW, VH);
  // ground
  const c0 = Math.floor(cx / CHP), r0 = Math.floor(cy / CHP), c1 = Math.floor((cx + VW) / CHP), r1 = Math.floor((cy + VH) / CHP);
  for (let ry = r0; ry <= r1; ry++) for (let rx = c0; rx <= c1; rx++) { const ch = getChunk(M, rx, ry); if (ch) ctx.drawImage(ch, rx * CHP - cx, ry * CHP - cy); else if (rx >= 0 && ry >= 0 && rx < M.cw && ry < M.chh) { ctx.fillStyle = M.isWorld ? '#3d7a33' : '#3a2a1e'; ctx.fillRect(rx * CHP - cx, ry * CHP - cy, CHP, CHP); } }
  // animated water/falls/lava
  if (M.isWorld && G.quality) {
    const tx0 = Math.max(0, Math.floor(cx / 16)), ty0 = Math.max(0, Math.floor(cy / 16)), tx1 = Math.min(M.w - 1, Math.floor((cx + VW) / 16)), ty1 = Math.min(M.h - 1, Math.floor((cy + VH) / 16));
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const i = ty * M.w + tx, t = M.ter[i];
      if (t === T.WATER || t === T.DEEP) { const h = hash2(tx, ty, 9); const ph = (G.t * 0.7 + h * 13) % 5; if (ph < 0.9) { const a = Math.sin(ph / 0.9 * Math.PI); ctx.fillStyle = `rgba(220,240,255,${(a * 0.7).toFixed(2)})`; const ox = (h * 97 | 0) % 11 + 2, oy = (h * 311 | 0) % 12 + 2; ctx.fillRect(tx * 16 - cx + ox, ty * 16 - cy + oy, 3, 1); ctx.fillRect(tx * 16 - cx + ox + 1, ty * 16 - cy + oy - 1, 1, 1); } }
      else if (t === T.FALL) { ctx.fillStyle = 'rgba(230,248,255,0.55)'; for (let k = 0; k < 4; k++) { const x = tx * 16 - cx + ((k * 5 + tx * 3) % 15), y = ty * 16 - cy + ((G.t * 60 + k * 23 + tx * 7) % 16); ctx.fillRect(x, y, 1, 4); } if (M.ter[i + M.w] !== T.FALL && Math.random() < 0.3) part(tx * 16 + Math.random() * 16, (ty + 1) * 16 + 2, { vz: 20 + Math.random() * 20, g: 80, vx: (Math.random() - 0.5) * 20, life: 0.5, c: '#e8f8ff' }); }
      else if (t === T.LAVA) { const h = hash2(tx, ty, 19), ph = (G.t * 0.6 + h * 9) % 3; if (ph < 0.7) { ctx.fillStyle = `rgba(255,${180 + (h * 70 | 0)},60,${(Math.sin(ph / 0.7 * Math.PI) * 0.8).toFixed(2)})`; ctx.fillRect(tx * 16 - cx + (h * 97 | 0) % 12 + 2, ty * 16 - cy + (h * 311 | 0) % 12 + 2, 2, 2); } }
    }
  }
  // collect drawables
  drawList.length = 0;
  const gx0 = Math.max(0, Math.floor((cx - 220) / CHP)), gx1 = Math.min(M.cw - 1, Math.floor((cx + VW + 220) / CHP)), gy0 = Math.max(0, Math.floor((cy - 16) / CHP)), gy1 = Math.min(M.chh - 1, Math.floor((cy + VH + 300) / CHP));
  for (let gy = gy0; gy <= gy1; gy++) for (let gx = gx0; gx <= gx1; gx++) for (const id of M.objGrid[gy * M.cw + gx]) { const o = M.objs[id]; if (o.hidden) continue; drawList.push(o); }
  for (const e of G.ents) if (e.map === M.id && e.x > cx - 80 && e.x < cx + VW + 80 && e.y > cy - 40 && e.y < cy + VH + 120) drawList.push(e);
  for (const r of G.remote.values()) if (r.map === M.id) drawList.push(r);
  if (M.isWorld) trainDrawList(drawList, cx, cy);
  drawList.push(P);
  drawList.sort((a, b) => (a.py !== undefined && a.k ? a.py : a.y) - (b.py !== undefined && b.k ? b.py : b.y));
  if (M.drawExtra) M.drawExtra(cx, cy);
  // shadows pass
  for (const d of drawList) {
    if (d.k) { const s = OBJSH[d.k]; if (!s) continue; let rx, ry; if (s === 1) { if (d.k === 'tree' && d.st !== 'stump') { const tr = objSprite(d); rx = tr.sh[0]; ry = tr.sh[1]; } else if (d.k === 'tree') { rx = 6; ry = 2; } else { const sp = objSprite(d); rx = Math.round(sp.c.width * 0.4); ry = Math.max(2, Math.round(sp.c.height * 0.12)); } } else { rx = s[0]; ry = s[1]; } const sh = shadowSprite(rx, ry); ctx.drawImage(sh, Math.round(d.px - cx - rx - 1 + (d.k === 'tree' ? 3 : 1)), Math.round(d.py - cy - ry - 1)); }
    else if (!d.noShadow) { const r = d.shR || 6; const sh = shadowSprite(r, Math.max(2, Math.round(r * 0.4))); ctx.drawImage(sh, Math.round(d.x - cx - r - 1), Math.round(d.y - cy - Math.round(r * 0.4) - 1)); }
  }
  // ground fx (telegraphs, fields)
  for (const f of G.fx) if (f.ground) drawFx(f, cx, cy);
  // sprites
  const pcx = cx + VW / 2, pcy = cy + VH / 2;
  for (const d of drawList) {
    if (d.k) {
      if (d.k === 'tree' && d.st !== 'stump') {
        const tr = objSprite(d), x = Math.round(d.px - tr.ax - cx), y = Math.round(d.py - tr.ay - cy);
        if (x > VW || y > VH || x + tr.w < 0 || y + tr.h < 0) continue;
        ctx.drawImage(tr.trunk, x, y);
        const lean = clamp(Math.round((d.px - pcx) * 0.022 + Math.sin(G.t * 1.3 + d.px * 0.07) * 0.6), -5, 5), leanY = clamp(Math.round((d.py - pcy) * 0.008), -2, 2);
        const behind = P.y < d.py - 2 && P.y > d.py - tr.h + 10 && Math.abs(P.x - d.px) < tr.w * 0.42 && P.map === M.id;
        if (behind) ctx.globalAlpha = 0.5; ctx.drawImage(tr.canopy, x + lean, y + leanY); ctx.globalAlpha = 1;
        if (d.hit > 0) { d.hit -= 1 / 60; }
        continue;
      }
      const s = objSprite(d); const x = Math.round(d.px - s.ax - cx), y = Math.round(d.py - s.ay - cy);
      if (x > VW || y > VH || x + s.c.width < 0 || y + s.c.height < 0) continue;
      const big = d.k === 'bld' || d.k === 'castle' || d.k === 'magetower' || d.k === 'lighthouse' || d.k === 'volcano';
      let alpha = 1; if (big && P.y < d.py - 4 && P.x > d.px - s.ax + 4 && P.x < d.px - s.ax + s.c.width - 4 && P.y > d.py - s.ay + 6) alpha = 0.55;
      if (alpha < 1) ctx.globalAlpha = alpha; ctx.drawImage(s.c, x, y); if (d.ruin) drawRuin(d, x, y, s); if (alpha < 1) ctx.globalAlpha = 1;
      if (d.k === 'herb' || (d.k === 'ore' && d.st !== 'dep')) { const gl = (Math.sin(G.t * 3 + d.tx) + 1) * 0.5; if (gl > 0.8) { ctx.fillStyle = 'rgba(255,255,220,0.9)'; ctx.fillRect(x + (d.k === 'herb' ? 9 : 6), y + 2, 1, 1); } }
    } else drawEnt(d, cx, cy);
  }
  // overhead fx
  for (const f of G.fx) if (!f.ground) drawFx(f, cx, cy);
  for (const p of G.parts) { const a = 1 - p.t / p.life; ctx.globalAlpha = clamp(a * 1.4, 0, 1); ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x - cx), Math.round(p.y - cy - p.z), p.s, p.s); } ctx.globalAlpha = 1;
  drawWeather(cx, cy, 0);
  if (M.drawPost) M.drawPost(cx, cy);
  // lighting
  const dk = Math.min(1, darkness() + wxDark());
  if (dk > 0.02) {
    lctx.globalCompositeOperation = 'source-over'; lctx.fillStyle = `rgba(8,12,38,${dk.toFixed(3)})`; lctx.clearRect(0, 0, VW, VH); lctx.fillRect(0, 0, VW, VH);
    lctx.globalCompositeOperation = 'destination-out';
    const lights = collectLights(M, cx, cy, drawList);
    for (const L of lights) { const g = glowSprite(L.r, 'rgba(255,255,255,1)'); lctx.drawImage(g, Math.round(L.x - cx - L.r), Math.round(L.y - cy - L.r)); }
    ctx.drawImage(lightCv, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    for (const L of lights) if (L.c) { const g = glowSprite(Math.round(L.r * 0.7), L.c); ctx.globalAlpha = dk * 0.9; ctx.drawImage(g, Math.round(L.x - cx - L.r * 0.7), Math.round(L.y - cy - L.r * 0.7)); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  drawWeather(cx, cy, 1);
  // floating texts & overheads
  for (const tx of G.texts) { const a = 1 - tx.t / tx.life; const s = textSprite(tx.str, tx.col, '#120a0e'); ctx.globalAlpha = clamp(a * 2, 0, 1); const sc = tx.big ? 2 : 1; ctx.drawImage(s, Math.round(tx.x - cx - s.width * sc / 2), Math.round(tx.y - cy - tx.t * 26), s.width * sc, s.height * sc); } ctx.globalAlpha = 1;
  for (const d of drawList) if (!d.k) drawOverhead(d, cx, cy);
  if (SETTINGS.guide) drawGuide(cx, cy);
  drawFriendArrows(cx, cy);
  if (G.fade > 0) { ctx.fillStyle = `rgba(0,0,0,${G.fade.toFixed(3)})`; ctx.fillRect(0, 0, VW, VH); }
}
// golden guide arrow around the hero pointing at the current objective
function drawGuide(cx, cy) {
  const P = G.P, M = G.map; if (!P || P.dead || P.ghost || !M || !M.isWorld || G.fade > 0.05) return;
  const pos = guidePos(guideTarget()); if (!pos) return;
  const tx = pos[0] * 16 + 8, ty = pos[1] * 16 + 8, dx = tx - P.x, dy = ty - P.y, d = Math.hypot(dx, dy); if (d < 70) return;
  const a = Math.atan2(dy, dx), r = 21 + Math.sin(G.t * 5) * 1.5, ax = Math.round(P.x - cx + Math.cos(a) * r), ay = Math.round(P.y - 11 - cy + Math.sin(a) * r * 0.8);
  ctx.save(); ctx.translate(ax, ay); ctx.rotate(a); ctx.globalAlpha = 0.95;
  ctx.fillStyle = '#1a0e08'; ctx.beginPath(); ctx.moveTo(7.5, 0); ctx.lineTo(-4.5, -5.5); ctx.lineTo(-2, 0); ctx.lineTo(-4.5, 5.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd23a'; ctx.beginPath(); ctx.moveTo(5.5, 0); ctx.lineTo(-3, -3.6); ctx.lineTo(-1, 0); ctx.lineTo(-3, 3.6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff4c0'; ctx.fillRect(1, -1, 3, 1); ctx.restore(); ctx.globalAlpha = 1;
  const m = Math.round(d / 16), str = m > 99 ? Math.round(m / 10) * 10 + 'M' : m + 'M'; const s = textSprite(str, '#ffe08a', '#120a0e');
  ctx.drawImage(s, Math.round(ax - s.width / 2 - Math.cos(a) * 1), Math.round(ay + (Math.sin(a) > 0.3 ? -14 : 7)));
}
function collectLights(M, cx, cy, list) {
  const out = [];
  for (const d of list) {
    if (d.k) {
      if (d.k === 'lantern') { const s = objSprite(d); out.push({ x: d.px - s.ax + s.light[0], y: d.py - s.ay + s.light[1], r: 54, c: 'rgba(255,190,90,0.55)' }); }
      else if (d.k === 'brazier') out.push({ x: d.px, y: d.py - 18, r: 50, c: 'rgba(255,150,60,0.55)' });
      else if (d.k === 'campfire' || d.k === 'forge') out.push({ x: d.px, y: d.py - 8, r: 64, c: 'rgba(255,150,60,0.6)' });
      else if (d.k === 'waystone') out.push({ x: d.px, y: d.py - 20, r: 40, c: 'rgba(90,220,255,0.5)' });
      else if (d.k === 'crystal') out.push({ x: d.px, y: d.py - 12, r: 34, c: 'rgba(120,200,255,0.4)' });
      else if (d.k === 'portal') out.push({ x: d.px, y: d.py - 28, r: 70, c: 'rgba(200,80,255,0.6)' });
      else if (d.k === 'lighthouse') out.push({ x: d.px, y: d.py - 75, r: 90, c: 'rgba(255,230,140,0.6)' });
      else if (d.k === 'herb' && d.tier === 5) out.push({ x: d.px, y: d.py - 6, r: 18, c: 'rgba(220,240,255,0.5)' });
      else if (d.k === 'fountain') out.push({ x: d.px, y: d.py - 10, r: 30, c: null });
      else if ((d.k === 'bld' || d.k === 'castle' || d.k === 'magetower' || d.k === 'witchhut') ) { const s = objSprite(d); if (s.lights) for (const l of s.lights) out.push({ x: d.px - s.ax + l[0], y: d.py - s.ay + l[1], r: 26, c: 'rgba(255,200,100,0.55)' }); }
      else if (d.k === 'furn' && (d.f === 'fireplace' || d.f === 'cauldron')) out.push({ x: d.px, y: d.py - 12, r: 60, c: 'rgba(255,150,60,0.5)' });
    } else if (d === G.P) out.push({ x: d.x, y: d.y - 12, r: 46, c: null });
    else if (d.glow) out.push({ x: d.x, y: d.y - 10, r: d.glow, c: d.glowC || null });
  }
  for (const f of G.fx) if (f.light) out.push({ x: f.x, y: f.y, r: f.light, c: f.lightC || 'rgba(255,160,60,0.6)' });
  return out;
}
