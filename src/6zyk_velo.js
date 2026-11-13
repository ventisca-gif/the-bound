// ================= v4.14: ARMAS SUPERADAS Y EL VELO ONÍRICO =================

// ---------- armas superadas ----------
// El ataque era arma + atributo×2,2 + nivel×1,6: el arma pesaba poco y una espada de cobre servía hasta el final.
// Ahora un arma más de 20 niveles por debajo del tuyo pierde fuerza (1,2 % por nivel, como mucho 55 %).
// Con el equipo de tu nivel no cambia nada (el equilibrio contra monstruos y en PvP sigue igual).
function wOutgrown(P) { const e = P && P.equip && P.equip.weapon, it = e && ITEMS[e.id]; if (!it || !it.lv || it.t !== 'weapon') return 0; const gap = P.lv - it.lv - 20; return gap > 0 ? Math.min(0.55, gap * 0.012) : 0; }
{ const _cs = calcStats; calcStats = function (P, ...a) { const r = _cs(P, ...a); if (!P || !P.S) return r; const pen = wOutgrown(P); P.S.wpen = pen;
  if (pen) { P.S.atk = Math.round(P.S.atk * (1 - pen)); const id = P.equip.weapon.id; if (P === G.P && pen >= 0.1 && P._wpenW !== id) { P._wpenW = id; try { toast(L2(`Tu arma se ha quedado atrás: −${Math.round(pen * 100)} % de daño. Busca una de tu nivel.`, `Your weapon has fallen behind: −${Math.round(pen * 100)}% damage. Find one for your level.`), 'warn', 5); } catch (e) { } } }
  return r; }; }
{ const _ri = renderInv; renderInv = function (B) { _ri(B); const P = G.P, s = P.inv[invSel], it = s && ITEMS[s.id]; if (!it || it.t !== 'weapon' || !it.lv) return; const gap = P.lv - it.lv - 20; if (gap <= 0) return;
  const st = $('.invR .stats', B); if (st) st.insertAdjacentHTML('afterend', `<div class="req bad">${L2(`Arma superada a tu nivel: −${Math.round(Math.min(0.55, gap * 0.012) * 100)} % de daño`, `Outgrown at your level: −${Math.round(Math.min(0.55, gap * 0.012) * 100)}% damage`)}</div>`); }; }

// ---------- el Velo: un mundo de sueño blanco y acolchado ----------
// Antes eran cinco manchas de barro, hierba y ceniza sobre negro. Ahora es una sola isla de sueño: suelo de cojines
// cosidos, bordes inflados como almohadas, bruma pastel con estrellas, árboles de algodón, lago de leche, un archivo
// de almohadas y la grieta de Nihil como un desgarrón oscuro en la tela. Las zonas siguen en el mismo sitio.
const DREAM = { base: pal(['#bdb2d6', '#d8cfe9', '#ece6f6', '#f8f5fd', '#ffffff']), pink: pal(['#c9a8c4', '#e6c8de', '#f4e2ee', '#fcf2f8', '#ffffff']), blue: pal(['#a8b8d8', '#c8d4ec', '#e2eaf8', '#f2f6fd', '#ffffff']), velvet: pal(['#140a1e', '#22122e', '#331c44', '#4a2a60', '#7a4aa0']), flame: pal(['#1a6a8a', '#2aa8c8', '#5ad8f0', '#a8f4ff', '#ffffff']) };
function genDreamTile(v, kind) {   // un cojín de 2x2 casillas: centro claro, bordes suaves y una costura apenas marcada
  const p = new Pix(32, 32), P = kind === 'velvet' ? DREAM.velvet : v === 1 ? DREAM.pink : v === 2 ? DREAM.blue : DREAM.base;
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) { const dx = Math.min(x, 31 - x), dy = Math.min(y, 31 - y), d = Math.min(dx, dy);
    p.set(x, y, d === 0 ? uMix(P[2], P[3], 0.35) : d < 4 ? (x + y < 32 ? P[3] : uMix(P[2], P[3], 0.6)) : (Math.hypot(x - 13, y - 13) < 9 ? P[4] : P[3])); }
  p.set(15, 15, P[2]); p.set(16, 16, P[2]); p.set(16, 15, uMix(P[2], P[3], 0.5)); p.set(15, 16, uMix(P[2], P[3], 0.5));   // botón del acolchado
  return p.canvas();
}
const DREAM_T = {}; function dreamTile(v, k) { const key = k + v; return DREAM_T[key] || (DREAM_T[key] = genDreamTile(v, k)); }
// objetos de sueño
function genDream(k, v) {
  let p, ax, ay; const B = DREAM.base;
  if (k === 'tree') { p = new Pix(30, 40); const L = v % 2 ? DREAM.pink : B; p.rect(14, 24, 3, 14, pal(['#7a6a8a'])[0]); p.vl(15, 24, 14, C('#a898b8')); for (const [x, y, r] of [[15, 14, 10], [8, 19, 7], [22, 19, 7], [12, 9, 6], [19, 9, 6]]) p.ball(x, y, r, r * 0.85, [L[1], L[2], L[3], L[4]]); ax = 15; ay = 38; }
  else if (k === 'grave') { p = new Pix(14, 18); p.rect(2, 5, 10, 12, B[3]); p.ell(7, 5, 5, 4, B[3]); p.vl(2, 4, 13, B[4]); p.vl(11, 4, 13, B[1]); p.hl(4, 9, 6, B[2]); p.vl(7, 7, 6, B[2]); p.hl(2, 14, 10, DREAM.pink[2]); p.set(7, 14, DREAM.pink[0]); ax = 7; ay = 17; }
  else if (k === 'urn') { p = new Pix(14, 26); const F = DREAM.flame, f = v % 3; p.ball(7, 18, 5, 5, [B[0], B[1], B[2], B[3]]); p.hl(4, 18, 7, F[2]); p.hl(3, 13, 9, B[1]); p.rect(4, 22, 7, 3, B[1]);
    for (let i = 0; i < 9; i++) { const y = 12 - i, w = Math.max(0, 3 - Math.floor(i / 3)) + (i + f) % 2; for (let x = 7 - w; x <= 7 + w - 1; x++) p.set(x + (i > 5 ? (f - 1) : 0), y, F[i < 2 ? 2 : i < 5 ? 3 : 4]); } ax = 7; ay = 25; }
  else if (k === 'statue') { p = new Pix(36, 52); const S = B; p.rect(6, 40, 24, 11, S[1]); p.hl(6, 40, 24, S[3]); p.rect(9, 36, 18, 5, S[2]);
    p.ball(18, 26, 9, 12, [S[1], S[2], S[3], S[4]]); p.ball(18, 13, 8, 7, [S[1], S[2], S[3], S[4]]);   // durmiente encapuchado
    p.line(13, 14, 16, 14, S[0]); p.line(20, 14, 23, 14, S[0]); p.set(18, 17, S[1]);   // ojos cerrados
    p.ball(26, 30, 3, 3, [DREAM.flame[1], DREAM.flame[2], DREAM.flame[3], DREAM.flame[4]]); p.vl(26, 24, 4, S[1]);   // farol
    p.ball(10, 6, 2, 3, [S[1], S[2], S[3], S[4]]); p.ball(26, 6, 2, 3, [S[1], S[2], S[3], S[4]]); ax = 18; ay = 50; }
  else if (k === 'pillow') { p = new Pix(26, 18); const L = v % 2 ? DREAM.blue : DREAM.pink; p.ball(9, 12, 8, 5, [L[0], L[1], L[2], L[3]]); p.ball(17, 11, 8, 5, [B[1], B[2], B[3], B[4]]); p.ball(13, 6, 7, 4, [L[1], L[2], L[3], L[4]]); p.set(13, 6, L[0]); ax = 13; ay = 16; }
  else { p = new Pix(14, 22); const M = pal(['#c8a020', '#e8c840', '#fff0a0', '#fffbe0', '#ffffff']); p.ball(7, 6, 5, 5, [M[1], M[2], M[3], M[4]]); p.ball(9, 5, 4, 4, [B[3], B[3], B[3], B[3]]); p.vl(7, 11, 9, B[1]); ax = 7; ay = 21; }
  p.outline(C('#6a5a8a')); return { c: p.canvas(), ax, ay };
}
{ const _os = objSprite; objSprite = function (o) { if (o.k && o.k.startsWith('dr_')) { const k = o.k.slice(3), f = k === 'urn' ? Math.floor(G.t * 6) % 3 : (o.v | 0) % 2; return spr('dr_' + k + f, () => genDream(k, f)); } return _os(o); }; }
Object.assign(OBJSH, { dr_tree: [10, 3], dr_grave: [6, 2], dr_urn: [6, 2], dr_statue: [14, 4], dr_pillow: [10, 3], dr_moon: [4, 1] });
{ const _mk = makeSpirit; makeSpirit = function () {
  if (G.maps.espiritual && G.maps.espiritual.dream) return G.maps.espiritual;
  const M = _mk(); if (M.dream) return M; const w = M.w, h = M.h, I = M.I; M.dream = 1;
  const ter = M.ter; ter.fill(T.VOID);
  const set = (x, y, t) => { if (x > 0 && y > 0 && x < w - 1 && y < h - 1) ter[I(x, y)] = t; };
  const blob = (cx, cy, rx, ry, t) => { for (let y = cy - ry - 3; y <= cy + ry + 3; y++) for (let x = cx - rx - 3; x <= cx + rx + 3; x++) { const d = Math.hypot((x - cx) / rx, (y - cy) / ry) + (hash2(x, y, 77) - 0.5) * 0.12; if (d < 1) set(x, y, t); } };
  const road = (x0, y0, x1, y1, r) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let k = 0; k <= n; k++) { const x = x0 + (x1 - x0) * k / n, y = y0 + (y1 - y0) * k / n, rr = r + Math.sin(k * 0.5) * 0.8; for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (Math.hypot(dx, dy) <= rr) set(Math.round(x + dx), Math.round(y + dy), T.SNOW); } };
  blob(23, 18, 20, 14, T.SNOW); blob(55, 22, 18, 15, T.SNOW); blob(40, 57, 20, 14, T.SNOW); blob(88, 26, 17, 14, T.SNOW); blob(90, 62, 16, 13, T.SNOW);
  road(38, 18, 46, 21, 3.4); road(58, 34, 46, 46, 3.4); road(70, 22, 76, 25, 3.4); road(88, 38, 90, 50, 3.4); road(26, 30, 34, 45, 3.4); road(72, 30, 80, 52, 2.6);
  blob(40, 60, 9, 6, T.WATER);       // Lago del Recuerdo: leche quieta
  blob(91, 63, 9, 7, T.DUSK);        // Grieta de Nihil: terciopelo oscuro
  // nada importante queda en el aire
  for (const o of M.objs) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (ter[I(o.tx + dx, o.ty + dy)] === T.VOID) set(o.tx + dx, o.ty + dy, T.SNOW);
  for (const e of G.ents) if (e.map === 'espiritual') { const tx = Math.floor(e.x / 16), ty = Math.floor(e.y / 16); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (ter[I(tx + dx, ty + dy)] === T.VOID || ter[I(tx + dx, ty + dy)] === T.WATER) set(tx + dx, ty + dy, T.SNOW); }
  for (const t of M.threads || []) set(Math.floor(t.x / 16), Math.floor(t.y / 16), T.SNOW);
  for (const [x, y] of [[23, 22], [23, 17], [23, 15]]) set(x, y, T.SNOW);
  M.chunks = new Map(); M.wdist = null; prepPalettes(M); M.dark = 0; M.music = M.music || 'cave';
  // decoración (fuera las setas y macetas antiguas, que no pegaban con el sueño)
  for (const o of M.objs) if (o.k === 'furn' && (o.f === 'plant' || o.f === 'lamp_espora')) { o.hidden = true; o.solid = false; const i = I(o.tx, o.ty); M.solidO[i] = 0; M.objAt[i] = -1; }
  const free = (x, y) => { const i = I(x, y); return ter[i] === T.SNOW && M.objAt[i] < 0 && !G.ents.some(e => e.map === 'espiritual' && Math.abs(e.x / 16 - x) < 1.5 && Math.abs(e.y / 16 - y) < 1.5); };
  const D = (k, x, y, o) => { if (free(x, y)) addObj(M, 'dr_' + k, x, y, Object.assign({ fp: [[0, 0]] }, o || {})); };
  D('statue', 23, 11, { fp: [[0, 0], [-1, 0], [1, 0]] }); D('urn', 20, 12); D('urn', 26, 12);
  for (const x of [16, 19, 27, 30]) for (const y of [15, 18, 21]) D('grave', x, y, { v: x + y });
  for (const [x, y] of [[12, 14], [34, 14], [12, 24], [34, 24], [44, 19], [52, 40], [74, 24], [89, 44], [30, 38]]) D('moon', x, y, { solid: false });
  for (let k = 0; k < 34; k++) { const x = 40 + Math.floor(hash2(k, 11, 3) * 34), y = 9 + Math.floor(hash2(k, 12, 3) * 28); D('tree', x, y, { v: k }); }
  for (let k = 0; k < 10; k++) { const x = 25 + Math.floor(hash2(k, 13, 3) * 32), y = 46 + Math.floor(hash2(k, 14, 3) * 22); D('tree', x, y, { v: k + 1 }); }
  for (let k = 0; k < 14; k++) { const x = 76 + Math.floor(hash2(k, 15, 3) * 24), y = 15 + Math.floor(hash2(k, 16, 3) * 22); D('pillow', x, y, { v: k }); }
  // dibujo del suelo, la bruma y los bordes inflados
  M.drawExtra = (cx, cy) => {
    const g = ctx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, '#e6def4'); g.addColorStop(1, '#f6eef6');
    const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(w - 1, Math.ceil((cx + VW) / 16)), y1 = Math.min(h - 1, Math.ceil((cy + VH) / 16));
    ctx.fillStyle = g; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (ter[I(x, y)] === T.VOID) ctx.fillRect(x * 16 - cx, y * 16 - cy, 16, 16);
    for (let k = 0; k < 24; k++) { const sx = ((hash2(k, 1, 99) * 900 - cx * 0.3) % VW + VW) % VW, sy = ((hash2(k, 2, 99) * 600 - cy * 0.3) % VH + VH) % VH, tx = Math.floor((sx + cx) / 16), ty = Math.floor((sy + cy) / 16); if (ter[I(clamp(tx, 0, w - 1), clamp(ty, 0, h - 1))] !== T.VOID) continue; ctx.globalAlpha = 0.4 + 0.4 * Math.sin(G.t * 2 + k); ctx.fillStyle = k % 3 ? '#ffffff' : '#ffd8f0'; ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2); ctx.fillRect(Math.round(sx) - 1, Math.round(sy) + 0.5, 4, 1); }
    ctx.globalAlpha = 1;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const t = ter[I(x, y)], X = x * 16 - cx, Y = y * 16 - cy;
      if (t === T.VOID) { if (y > 0 && ter[I(x, y - 1)] !== T.VOID) { ctx.fillStyle = 'rgba(150,130,190,0.28)'; ctx.fillRect(X, Y, 16, 6); ctx.fillStyle = '#ebe4f6'; for (let i = 0; i < 16; i += 4) { ctx.beginPath(); ctx.arc(X + i + 2, Y, 3.2, 0, Math.PI); ctx.fill(); } } continue; }
      if (t === T.WATER) { ctx.fillStyle = 'rgba(244,240,252,0.9)'; ctx.fillRect(X, Y, 16, 16); ctx.fillStyle = 'rgba(200,190,235,0.6)'; if ((x * 7 + y * 3 + Math.floor(G.t * 2)) % 9 === 0) ctx.fillRect(X + 3, Y + 7, 8, 1); continue; }
      { const bx = x >> 1, by = y >> 1, hv = hash2(bx, by, 5), v = t === T.DUSK ? 0 : hv < 0.06 ? 1 : hv > 0.95 ? 2 : 0; ctx.drawImage(dreamTile(v, t === T.DUSK ? 'velvet' : 'q'), (x & 1) * 16, (y & 1) * 16, 16, 16, X, Y, 16, 16); }
      if (t === T.DUSK && hash2(x, y, 8) < 0.15) { ctx.fillStyle = `rgba(190,130,255,${(0.4 + 0.4 * Math.sin(G.t * 3 + x)).toFixed(2)})`; ctx.fillRect(X + 6, Y + 6, 2, 2); }
      if (ter[I(x, y - 1)] === T.VOID) { ctx.fillStyle = '#ffffff'; for (let i = 0; i < 16; i += 4) { ctx.beginPath(); ctx.arc(X + i + 2, Y + 1, 2.6, Math.PI, 0); ctx.fill(); } } }
  };
  M.drawPost = (cx, cy) => {
    const g = ctx.createRadialGradient(VW / 2, VH / 2, VH * 0.35, VW / 2, VH / 2, VW * 0.7); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(225,210,245,0.45)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
    if (Math.random() < (OPT.on ? 0.15 : 0.45)) part(cx + Math.random() * VW, cy + VH * Math.random(), { vy: -12, vx: (Math.random() - 0.5) * 10, vz: 0, life: 4, c: Math.random() < 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(255,214,240,0.7)', s: 2 });
    if (G.P.veilQ === 2) for (const t of M.threads) if (!t.got) { const x = t.x - cx, y = t.y - cy - 12 + Math.sin(G.t * 3 + t.x) * 3; ctx.strokeStyle = '#e8b830'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.quadraticCurveTo(x, y - 10, x + 6, y); ctx.stroke(); }
  };
  return M;
}; }
