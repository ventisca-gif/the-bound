// ================= v4.0: personajes en HD (ropa con píxeles finos) + cara más alta + 3 trajes nuevos =================
// Cómo funciona: cada cuadro se dibuja como siempre a 1x, pero el Pix guarda qué capa pintó cada píxel (piernas, torso, brazos,
// capa, cabeza, pelo, sombrero, arma). Luego se amplía al doble y la ROPA recibe detalle a media-píxel según su material
// (metal, tela, cuero, plumas): biseles de luz y sombra, remaches, brillos, pliegues, costuras y encaje. Cabeza, pelo y cara
// no se tocan, así se mantiene el estilo del juego. Los cuadros HD se generan al verlos por primera vez (no al cargar).
const HD_MAX = 40, HD_LIVE = [], HD_W = C('#ffffff'), HD_GOLD = GOLD;
let hdBudget = 0, hdLastF = -1;
const HD_TAG = { legs: 1, torso: 2, arm: 3, back: 4, head: 5, hair: 6, hat: 7, weapon: 8, scarf: 9 };
// ---------- materiales por color de cada capa ----------
function hdMats(L) {
  const mk = () => new Map(), M = { 1: mk(), 2: mk(), 3: mk(), 4: mk(), 7: mk(), 9: mk() };
  const add = (tags, pal_, m) => { if (!pal_ || !pal_.length) return; for (const t of tags) for (const c of pal_) if (typeof c === 'number' && !M[t].has(c)) M[t].set(c, m); };
  const SK = L.skin || []; add([1, 2, 3, 4, 7, 9], SK, 0); if (L.hair) add([2, 3, 7], L.hair, 0);
  add([1, 2, 3, 4, 7], GOLD, 5); add([1, 2, 3], LEATHER, 3);
  if (L.top) {   // héroe
    const T = L.top, B = L.bot || {}, F = L.feet || {}, H = L.head, K = L.back;
    const tm = T.k === 'plate' || T.k === 'warpaint' ? 2 : T.k === 'leather' || T.k === 'shadow' ? 3 : 1;
    add([2, 3], T.s, T.k === 'plate' || T.k === 'warpaint' ? 2 : 5); if (T.k !== 'warpaint') add([2, 3], T.m, tm);
    const bm = B.k === 'greaves' ? 2 : B.k === 'leathp' ? 3 : 1, fm = F.k === 'sabatons' ? 2 : F.k === 'boots' || F.k === 'shoes' ? 3 : 1;
    add([1], F.m, fm); add([1, 2], B.m, bm); add([1, 2], B.s, bm === 1 ? 5 : bm);
    if (H) { const hm = /helm|winged|horned|crown|circlet|halo/.test(H.k) ? 2 : 1; add([7], H.m, hm); add([7], H.s, hm === 2 ? 5 : 1); }
    if (K) { const km = K.k === 'wings' ? 4 : K.k === 'quiver' ? 3 : 1; add([4], K.tr, 5); add([4], K.o, km); add([4], K.i, km); }
    if (L.scarf) add([9], L.scarf, 1);
  } else {       // NPC (drawHumanoid)
    const OF = L.outfit || 'tunic', metal = OF === 'knight' || OF === 'guard' || OF === 'darkknight', bare = OF === 'goblin' || OF === 'orc' || OF === 'skeleton';
    const mm = metal ? 2 : OF === 'rogue' ? 3 : bare ? 0 : 1;
    if (L.armor) add([2, 3], L.armor, 2);
    add([2, 3], L.main, mm); add([2, 3], L.sec, metal ? 5 : 1); add([2, 3, 1], L.cloth, 1); add([2], L.belt, 3); add([2], L.sash, 1);
    add([1], L.boots, metal ? 2 : 3); add([1], L.pants, 1); if (metal) add([1], L.main, 2);
    if (L.cape) { add([4], L.cape.trim, 5); add([4], L.cape.out, 1); add([4], L.cape.in, 1); }
    if (L.hat) add([7], L.hatC || L.main, /helmet|horned|crown/.test(L.hat) ? 2 : 1);
    if (L.scarf) add([9], L.scarf, 1);
  }
  return M;
}
const hdLum = c => (c & 255) * 0.3 + ((c >>> 8) & 255) * 0.59 + ((c >>> 16) & 255) * 0.11;
// ---------- pasada de detalle a media-píxel ----------
function hdDetail(p, mats) {
  const w = p.w, h = p.h, d = p.d, t = p.t, W2 = w * 2, q = new Pix(W2, h * 2), o = q.d;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = d[y * w + x], k = 2 * y * W2 + 2 * x; o[k] = o[k + 1] = o[k + W2] = o[k + W2 + 1] = c; }
  q.t = new Uint8Array(W2 * h * 2); for (let y = 0; y < h * 2; y++) for (let x = 0; x < W2; x++) q.t[y * W2 + x] = t[(y >> 1) * w + (x >> 1)];
  const reg = (xx, yy, tg, c) => { if (xx < 0 || yy < 0 || xx >= w || yy >= h) return 0; const j = yy * w + xx, cc = d[j]; if (!uA(cc) || t[j] !== tg) return 0; return cc === c ? 2 : 1; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, c = d[i], tg = t[i]; if (!uA(c) || !tg || tg === 5 || tg === 6 || tg === 8) continue;
    const mm = mats[tg]; let m = mm ? mm.get(c) : undefined; if (m === undefined) m = 1; if (m === 0) continue;
    const U = reg(x, y - 1, tg, c), D = reg(x, y + 1, tg, c), Lf = reg(x - 1, y, tg, c), R = reg(x + 1, y, tg, c), inner = U && D && Lf && R;
    const a = 2 * y * W2 + 2 * x, b = a + 1, e = a + W2, g = e + 1, met = m === 2 || m === 5, hi = met ? 0.2 : 0.12, lo = met ? 0.2 : 0.14;
    if (!U) { o[a] = uMix(c, HD_W, hi); o[b] = uMix(c, HD_W, hi * 0.6); }
    if (!Lf) { o[a] = uMix(c, HD_W, hi * 0.7); o[e] = uMix(c, HD_W, hi * 0.5); }
    if (!D) { o[e] = uMul(c, 1 - lo); o[g] = uMul(c, 1 - lo); }
    if (!R) { o[g] = uMul(c, 1 - lo); if (U) o[b] = uMul(c, 1 - lo * 0.7); }
    if (met) {
      if (D === 1 && hdLum(d[i + w]) < hdLum(c) - 30) { o[e] = uMul(c, 0.85); o[g] = uMul(c, 0.85); }   // juntas entre placas (suaves)
      if (inner && hdLum(c) > 80 && hash2(x, y, 11) < 0.08) o[a] = uMix(c, HD_W, 0.35);                   // brillo
      if (tg === 2 && !D && U && x % 4 === 1) { o[a] = uMix(c, HD_W, 0.3); o[g] = uMul(c, 0.75); }          // remaches del borde
    } else if (m === 1) {
      if (inner && (x + (y >> 2)) % 3 === 0) { o[b] = uMul(c, 0.92); o[g] = uMul(c, 0.9); }                // pliegues
    } else if (m === 3) {
      if (inner && hash2(x, y, 5) < 0.12) o[g] = uMul(c, 0.93);                                              // grano
    } else if (m === 4) {
      if (!D) { o[e] = uMix(c, HD_W, 0.25); o[g] = uMix(c, HD_W, 0.15); }   // puntas de las plumas
    }
  }
  return q;
}
// ---------- adornos dibujados a media-píxel (frente, lado y espalda) ----------
function hdOrn(q, p, L) {
  const M = p.meta; if (!M) return; const T = L.top, W2 = q.w, o = q.d, qt = q.t;
  const put = (x, y, c, tags = [2]) => { if (x < 0 || y < 0 || x >= W2 || y >= q.h) return; const i = y * W2 + x; if (!uA(o[i]) || !tags.includes(qt[i])) return; o[i] = c; };
  const X0 = M.tx0 * 2, Y0 = M.torsoTop * 2, TW = M.tw * 2, cL = X0 + M.tw - 1, cR = X0 + M.tw, TH = (M.th || 8) * 2, front = !M.up && !M.side, side = M.side, back = M.up;
  if (!T) return hdOrnNpc(q, p, L, put, { X0, Y0, TW, cL, cR, TH, front, side, back });
  const k = T.k, tier = T.t || 0;
  if (k === 'plate' && front) {   // emblema del peto según el tier
    const G1 = HD_GOLD[4], G2 = HD_GOLD[3], m4 = T.m[4], m1 = T.m[1];
    if (tier >= 7) { for (let i = 0; i < 4; i++) { put(cL - 2 - i, Y0 + 5 - (i >> 1), i % 2 ? G2 : G1); put(cR + 2 + i, Y0 + 5 - (i >> 1), i % 2 ? G2 : G1); } put(cL - 2, Y0 + 7, G2); put(cR + 2, Y0 + 7, G2); }
    else { for (let i = 0; i < 4; i++) { put(cL - 3 + i, Y0 + 3 + i, m4); put(cR + 3 - i, Y0 + 3 + i, m4); put(cL - 3 + i, Y0 + 4 + i, m1); put(cR + 3 - i, Y0 + 4 + i, m1); } }
    for (let x = X0 + 1; x < X0 + TW - 1; x += 3) put(x, Y0 + 1, m4);
  }
  if ((k === 'tunic' || k === 'shirt' || k === 'coat' || k === 'dress' || k === 'vest') && front) {   // botones y hebilla
    const bc = k === 'coat' ? HD_GOLD[4] : uMix(T.m[4], HD_W, 0.3); for (let y = Y0 + 5; y < Y0 + TH - 5; y += 3) put(cL, y, bc);
  }
  if (front && k !== 'robe' && k !== 'warpaint' && k !== 'swim') { const by = Y0 + TH - 4; for (const [dx, c] of [[-1, HD_GOLD[4]], [0, HD_GOLD[5]], [1, HD_GOLD[5]], [2, HD_GOLD[4]]]) put(cL + dx, by, c, [2]); put(cL, by + 1, HD_GOLD[2]); put(cR, by + 1, HD_GOLD[2]); }
  if (k === 'robe' && !back) { for (let y = Y0 + 2; y < q.h; y += 2) { put(cL - (side ? 1 : 1), y, HD_GOLD[4]); if (!side) put(cR + 1, y + 1, HD_GOLD[4]); } }
  if (k === 'dress' || (L.bot && L.bot.k === 'skirt') || T.lace) hdLace(q, p, [2]);
  if (k === 'warpaint' && T.orn !== 'none') hdWarpaint(q, M, T, put, { X0, Y0, TW, cL, cR, TH, front, side, back });
  if (T.orn === 'dama') hdDama(q, M, T, put, { X0, Y0, TW, cL, cR, TH, front, side, back });
  const K = L.back;
  if (K && K.k === 'cape' && front) { const cy = Y0 + 1; put(X0 - 1, cy, HD_GOLD[4], [4, 2]); put(X0 + TW, cy, HD_GOLD[4], [4, 2]); }
}
// encaje blanco en el bajo de faldas y vestidos (todas las direcciones)
function hdLace(q, p, tags) {
  const w = p.w, W2 = q.w, o = q.d;
  for (let x = 0; x < w; x++) { let hy = -1; for (let y = p.h - 1; y >= 0; y--) { const i = y * w + x; if (uA(p.d[i]) && tags.includes(p.t[i])) { hy = y; break; } } if (hy < 0) continue;
    const y2 = hy * 2 + 1; if (p.meta && hy < p.meta.legTop) continue;
    for (let i = 0; i < 2; i++) { const xx = x * 2 + i; o[y2 * W2 + xx] = (xx % 2) ? C('#d8d4c8') : C('#f8f6ee'); }
    o[(y2 - 1) * W2 + x * 2 + (x & 1)] = C('#f0ece0'); }
}
// pintura de guerra fina: Heraldo (blanca), Rey del Cielo Blanco (cian: anillo y rayos), Danzarina (lianas violetas)
function hdWarpaint(q, M, T, put, R) {
  const { Y0, TH, cL, cR, front, side, back } = R, Lc = T.l || [C('#b8b8c4'), C('#f4f4fa')], a = Lc[1], b = Lc[0], fem = M.fem, orn = T.orn || 'heraldo';
  const y0 = fem ? Y0 + 8 : Y0 + 3, sym = (dx, y, c) => { put(cL - dx, y, c); put(cR + dx, y, c); };
  if (orn === 'heraldo') {
    if (front) { for (let i = 0; i < 6; i++) sym(6 - i, y0 + i, a); for (let i = 0; i < 4; i++) sym(6 - i, y0 + 3 + i, b); for (const yy of [y0 + 9, y0 + 11]) if (yy < Y0 + TH - 5) { sym(4, yy, b); sym(5, yy, b); } }
    else if (side) { for (let y = y0 + 1; y < Y0 + TH - 5; y += 2) put(cL + (M.d > 0 ? 3 : -2), y, b); }
    else { for (let y = Y0 + 2; y < Y0 + TH - 5; y += 1) if (y % 3) put(cL, y, b); for (let i = 0; i < 3; i++) sym(3 + i, Y0 + 3 + i, b); }
  } else if (orn === 'rey') {
    if (front) { const cy = Y0 + 5; for (const [dx, dy] of [[0, -2], [1, -2], [2, -1], [2, 0], [2, 1], [1, 2], [0, 2]]) sym(dx, cy + dy, a); for (let i = 0; i < 5; i++) sym(4 + i, cy - 1 - (i >> 1), b); sym(3, cy + 4, b); sym(4, cy + 5, b); sym(3, cy + 6, b); sym(4, cy + 7, b); }
    else if (side) { for (let i = 0; i < 4; i++) put(cL + (M.d > 0 ? 2 : -1) + (i & 1) * M.d, Y0 + 4 + i * 2, b); }
    else { for (let i = 0; i < 5; i++) sym(1 + i, Y0 + 3 + i, b); }
  } else if (orn === 'danza') {
    if (front) { for (const s of [-1, 1]) { const px = s < 0 ? cL - 4 : cR + 4; for (let i = 0; i < 7; i++) put(px + s * ((i >> 1) % 2), Y0 + TH - 5 - i, b); put(px - s, Y0 + TH - 8, a); put(px + s * 2, Y0 + TH - 10, a); } }
    else if (side) { for (let i = 0; i < 5; i++) put(cL + (M.d > 0 ? 3 : -2), Y0 + TH - 6 - i, b); }
  }
}
// Dama Esmeralda: corsé de cobre con hoja (frente), cordones (espalda)
function hdDama(q, M, T, put, R) {
  const { Y0, TH, cL, cR, front, side, back } = R, CU = T.s, Gn = T.m;
  if (front) { for (let y = Y0 + 2; y < Y0 + TH - 3; y++) { const half = y < Y0 + 9 ? 4 : 4 - ((y - Y0 - 9) >> 1); for (let dx = 0; dx <= half; dx++) { const c = dx === half ? CU[1] : y === Y0 + 2 ? CU[4] : dx === 0 ? CU[2] : CU[3 - (dx > 2 ? 1 : 0)]; put(cL - dx, y, c); put(cR + dx, y, dx === half ? CU[0] : uMul(c, 0.9)); } }
    for (let i = 0; i < 4; i++) { put(cL - Math.min(i, 3 - i), Y0 + 4 + i, Gn[4]); put(cR + Math.min(i, 3 - i), Y0 + 4 + i, Gn[3]); } put(cL, Y0 + 8, Gn[2]); put(cR, Y0 + 8, Gn[2]); put(cL, Y0 + 5, C('#d8ffe8')); }
  else if (back) { for (let y = Y0 + 2; y < Y0 + TH - 3; y += 2) { put(cL - 1, y, CU[4]); put(cR + 1, y, CU[4]); put(cL, y + 1, CU[3]); put(cR, y + 1, CU[3]); } }
  else if (side) { for (let y = Y0 + 2; y < Y0 + TH - 3; y++) put(cL + (M.d > 0 ? 3 : -2), y, CU[y % 2 ? 2 : 3]); }
}
// NPCs: emblemas de guardias y caballeros, botones, encaje de vestidos
function hdOrnNpc(q, p, L, put, R) {
  const OF = L.outfit || 'tunic', { X0, Y0, TW, cL, cR, TH, front, side, back } = R;
  if ((OF === 'knight' || OF === 'guard' || OF === 'darkknight') && front && L.main) { const m4 = L.main[4], m1 = L.main[1]; for (let i = 0; i < 4; i++) { put(cL - 3 + i, Y0 + 3 + i, m4); put(cR + 3 - i, Y0 + 3 + i, m4); put(cL - 3 + i, Y0 + 4 + i, m1); put(cR + 3 - i, Y0 + 4 + i, m1); } for (let x = X0 + 1; x < X0 + TW - 1; x += 3) put(x, Y0 + 1, m4); }
  if ((OF === 'tunic' || OF === 'ranger' || OF === 'sailor' || OF === 'apron') && front && L.main) { for (let y = Y0 + 5; y < Y0 + TH - 5; y += 3) put(cL, y, uMix(L.main[4], HD_W, 0.3)); }
  if ((OF === 'dress' || OF === 'royal' || OF === 'witch' || OF === 'elder' || OF === 'robe') && !back) { for (let y = Y0 + 2; y < q.h; y += 2) put(cL - 1, y, HD_GOLD[4]); if (OF === 'dress' || OF === 'royal') hdLace(q, p, [2]); }
}
// ---------- generación perezosa de cuadros HD ----------
function hdFrameOf(A, col) { for (const a of A.hdAnims) { const i = A.idx[a]; if (col >= i && col < i + ANIMS[a][1]) return [a, col - i]; } return ['idle', 0]; }
function hdEnsure(A, col, row, force) {
  if (!A.hdL) return false;
  if (!A.hd) { const N = A.img.width / A.fw; A.hd = mkCanvas(A.img.width * 2, A.img.height * 2); A.hdX = A.hd.getContext('2d'); A.hdDone = new Uint8Array(N * 4); A.hdMats = A.hdMats || hdMats(A.hdL);
    HD_LIVE.push(A); if (HD_LIVE.length > HD_MAX) { let k = 0; for (let j = 1; j < HD_LIVE.length; j++) if ((HD_LIVE[j].hdT || 0) < (HD_LIVE[k].hdT || 0)) k = j; const old = HD_LIVE.splice(k, 1)[0]; if (old !== A) { old.hd = null; old.hdX = null; old.hdDone = null; } } }
  A.hdT = G.t; const N = A.hdDone.length / 4, i = row * N + col; if (A.hdDone[i]) return true;
  if (!force) { if (G.frame !== hdLastF) { hdLastF = G.frame; hdBudget = 4; } if (hdBudget <= 0) return false; hdBudget--; }
  try { hdBuild(A, col, row); } catch (e) { A.hdL = null; return false; }
  A.hdDone[i] = 1; return true;
}
function hdBuild(A, col, row) {
  const [a, f] = hdFrameOf(A, col), dir = DIRS[row], L = A.hdL, FW = A.fw, FH = A.fh, X = A.hdX;
  if (a === 'dead') { X.imageSmoothingEnabled = false; X.drawImage(A.img, col * FW, row * FH, FW, FH, col * FW * 2, row * FH * 2, FW * 2, FH * 2); return; }
  const mirror = dir === 'right' && L.mirror !== false, p = new Pix(FW, FH); p.t = new Uint8Array(FW * FH); p.tg = 0;
  A.hdDraw(p, L, mirror ? 'left' : dir, a, f); p.outline(OUTL, false);
  const q = hdDetail(p, A.hdMats); hdOrn(q, p, L);
  if (L.top?.modaStyle !== undefined) modaDressplate(q, p.meta, L.top.modaStyle, L);
  if (mirror) q.flipX();
  q.toCtx(X, col * FW * 2, row * FH * 2);
}
// vistas previas del menú (perfil, armario, peluquería): siempre en HD
{ const _dp = drawPortrait; drawPortrait = function (cvs, A) { if (HDS > 1 && A && A.hdL && hdEnsure(A, 0, 0, true)) { const x = cvs.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, cvs.width, cvs.height); const fw = A.fw, s = cvs.width / 26; x.drawImage(A.hd, 0, 0, fw * 2, fw * 2, Math.round(-(fw / 2 - 13) * s), Math.round(-(fw * 0.22) * s), fw * s, fw * s); return; } return _dp(cvs, A); }; }

// ---------- 3 trajes nuevos (diseños propios) + Heraldo con detalle fino ----------
const DAMA_G = P5(['#0a2a1e', '#145038', '#1e7050', '#2e9468', '#5ac090']), DAMA_CU = P5(['#4a2412', '#8a4a24', '#c47a44', '#e8a874', '#ffd8b0']);
const DANZA_T = P5(['#24364a', '#4a8a94', '#22a4a0', '#5ad8d0', '#d0fff8']), DANZA_S = P5(['#24364a', '#4a6a84', '#8ab0c8', '#c8e4f0', '#f4ffff']), DANZA_V = [C('#6a1e9a'), C('#c080ff')];
const REY_S = P5(['#26303e', '#4e6070', '#8ea4b4', '#d0e0ea', '#ffffff']), REY_B = P5(['#0a1640', '#16286e', '#2444a8', '#3a5cc0', '#4a74d8']), REY_CY = [C('#20b0d8'), C('#90f0ff')];
cosm('c_dama_vestido', L2('Vestido de la Dama Esmeralda', 'Emerald Lady Gown'), 'body', () => ({ k: 'dress', m: DAMA_G, s: DAMA_CU, orn: 'dama', lace: 1 }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
cosm('c_dama_botas', L2('Botas de cobre de la Dama', 'Emerald Lady Copper Boots'), 'feet', () => ({ k: 'sabatons', m: DAMA_CU }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
cosm('c_danza_top', L2('Escamas de la Danzarina del Ocaso', 'Dusk Dancer Scales'), 'body', () => ({ k: 'warpaint', m: DANZA_T, s: DANZA_T, l: DANZA_V, nopaint: 1, orn: 'danza' }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
cosm('c_danza_grebas', L2('Grebas de la Danzarina', 'Dusk Dancer Greaves'), 'legs', () => ({ k: 'greaves', m: DANZA_S, s: DANZA_T }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
cosm('c_rey_torso', L2('Marcas del Rey del Cielo Blanco', 'White Sky King Marks'), 'body', () => ({ k: 'warpaint', m: REY_S, s: REY_S, l: REY_CY, nopaint: 1, orn: 'rey' }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
cosm('c_rey_grebas', L2('Grebas del Rey del Cielo Blanco', 'White Sky King Greaves'), 'legs', () => ({ k: 'greaves', m: REY_S, s: REY_B }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
cosm('c_rey_botas', L2('Botas del Rey del Cielo Blanco', 'White Sky King Boots'), 'feet', () => ({ k: 'sabatons', m: REY_S }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
cosm('c_danza_botas', L2('Botas de la Danzarina', 'Dusk Dancer Boots'), 'feet', () => ({ k: 'sabatons', m: DANZA_S }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
cosm('c_rey_capa', L2('Capa del Rey del Cielo Blanco', 'White Sky King Cloak'), 'back', () => ({ k: 'cape', o: REY_B, i: P5(['#060c26', '#0a1640', '#101e52', '#16286e', '#1e3482']), tr: REY_S }), { src: L2('Sastrería (Sahrim y Puerto Coral)', 'Tailor (Sahrim and Puerto Coral)') });
{ const NEW_COS = { c_dama_vestido: 22000, c_dama_botas: 6000, c_danza_top: 20000, c_danza_grebas: 8000, c_rey_torso: 18000, c_rey_grebas: 8000, c_rey_capa: 16000, c_rey_botas: 6000, c_danza_botas: 6000 };
  for (const id in NEW_COS) { it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: NEW_COS[id], icon: ['hanger'], rar: 4 }); COS_SHOP.push(id); for (const tk of ['puerto', 'sahrim']) if (SHOPS.cos[tk]) SHOPS.cos[tk].push('cosi_' + id); } }
// el Heraldo Nocturno pasa a la pintura fina (sin las líneas gruesas de 1x)
if (COSM.c_heraldo_torso) { const _v = COSM.c_heraldo_torso.vis; COSM.c_heraldo_torso.vis = app => Object.assign(_v(app), { nopaint: 1, orn: 'heraldo' }); }
// Danzarina: paño violeta largo al frente y atrás (se dibuja también a 1x para que exista sin HD)
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { _dh(p, L, dir, anim, f); const T = L.top, M = p.meta; if (!T || T.orn !== 'danza' || !M || dir === 'left' && false) return;
  const tg = p.tg; p.tg = 2; const V = [C('#3a0a5a'), C('#6a1e9a'), C('#8a3ac0'), C('#a050e0')], y0 = M.legTop, len = 6;
  if (!M.side) { const x0 = M.cx - 1 - (M.fem ? 0 : 1); for (let y = y0; y < y0 + len; y++) for (let i = 0; i < 3; i++) p.set(x0 + i, y, V[i === 0 ? 3 : i === 2 ? 1 : 2]); p.set(x0 + 1, y0 + len, V[1]); }
  else { const x0 = M.cx + (M.d > 0 ? 1 : -2); for (let y = y0; y < y0 + len - 1; y++) for (let i = 0; i < 2; i++) p.set(x0 + i, y, V[i ? 1 : 2]); }
  p.tg = tg; }; }
// ---------- ajuste: gráficos HD sí/no ----------
function setHD(on) { HDS = on ? 2 : 1; try { localStorage.setItem('thebound.hd', on ? '1' : '0'); } catch (e) { } if (!on) { for (const A of HD_LIVE) { A.hd = null; A.hdX = null; A.hdDone = null; } HD_LIVE.length = 0; } resize(); }
{ const _ro = renderOpts; renderOpts = function (B) { _ro(B); const q = $('#oQ'); if (!q || $('#oHD')) return; const lb = q.closest('label');
  lb.insertAdjacentHTML('afterend', `<label class="tg"><input type="checkbox" id="oHD" ${HDS > 1 ? 'checked' : ''}> ${L2('Gráficos HD: ropa y armaduras con detalle fino (desactiva si va lento)', 'HD graphics: fine detail on clothes and armor (turn off if slow)')}</label>`);
  $('#oHD').onchange = e => setHD(e.target.checked); }; }
// ---------- tu pareja te atiende aunque seas criminal en su pueblo ----------
function partnerServes() { const P = G.P; if (!P || !P.partner) return false; const k = P.partner; if (typeof dlg !== 'undefined' && dlg && dlg.npc && relKey(dlg.npc.id) === k) return true; return !!(P.inside && typeof INT_NPC !== 'undefined' && relKey(INT_NPC[P.inside] || '') === k); }
{ const _os = openShop; openShop = function (kind, town) { if (!partnerServes()) return _os(kind, town); const _rs = repStatus; repStatus = function (tk) { const r = _rs(tk); return r && r.n === 'Criminal' ? Object.assign({}, r, { n: 'Neutral' }) : r; };
  try { const r = _os(kind, town); toast(L2('Tu pareja te atiende aunque tengas la multa pendiente. ♥', 'Your partner serves you even with an unpaid fine. ♥'), 'info', 3); return r; } finally { repStatus = _rs; } }; }
