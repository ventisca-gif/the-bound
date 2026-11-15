// =====================================================================================
// v4.50: ropa gótica nueva (inspirada en las referencias de Sergio), pelucas góticas, gafas redondas,
// piel blanca gótica, chaquetas de cazador con diseño propio, esquiva con dash de los cazadores
// y combates online entre jugadores en el Coliseo.
// =====================================================================================
const GTN = P5(['#050407', '#0c0a10', '#16121c', '#221c2a', '#30283a']), GTS = P5(['#3a3a44', '#6a6a78', '#9a9aaa', '#c8c8d6', '#f0f0fa']), GTL = P5(['#060506', '#100d10', '#1c181b', '#2c2529', '#40373c']);
const GTP = P5(['#1a0a2a', '#2e1448', '#4a2470', '#6a3a9a', '#9a6ac8']), GTR = P5(['#1a0408', '#34080e', '#520e18', '#741a26', '#9a2a3a']);
const gtSet = (p, x, y, c) => { if (uA(p.get(x, y))) p.set(x, y, c); };

// ---------- prendas del cuerpo ----------
// Vestido de campana: corsé con cordones, cadenas en la cadera, cruz ansada y falda larga hasta los pies (mangas de campana al final)
fitKind('body', 'gt_campana', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, legTop, base, d } = A, R = tx0 + tw - 1, m = s.m, S = GTS, SK = A.sk;
  for (let y = legTop - 1; y <= base - 2; y++) { const k = y - legTop + 1, e = Math.floor(k / 3); let x0, x1; if (side) { x0 = cx - 4 - (d > 0 ? e : 0); x1 = cx + 3 + (d < 0 ? e : 0); } else { x0 = tx0 - 1 - e; x1 = R + 1 + e; }
    for (let x = x0; x <= x1; x++) { let c = x <= x0 ? m[3] : x >= x1 ? m[1] : m[2]; if ((x - x0) % 3 === 0 && k > 2 && x > x0 && x < x1) c = m[1]; if (y === base - 2) c = m[0]; p.set(x, y, c); } }
  for (let x = (side ? cx - 4 : tx0 - 1); x <= (side ? cx + 3 : R + 1); x++) { gtSet(p, x, legTop - 1, (x % 2) ? S[3] : S[1]); if (!side && Math.abs(x - cx) < tw / 2 - 1) gtSet(p, x, legTop + 1, (x % 2) ? S[2] : m[2]); }
  if (up) return; if (side) { p.vl(cx + (d > 0 ? 1 : -2), ty + 2, th - 3, S[2]); return; }
  for (let y = ty + 3; y <= A.waistY; y++) { p.set(cx - 1, y, (y % 2) ? S[2] : m[0]); p.set(cx, y, (y % 2) ? m[0] : S[2]); }
  for (let x = cx - 2; x <= cx + 1; x++) p.set(x, ty, SK[2]); p.set(cx - 2, ty + 1, m[3]); p.set(cx + 1, ty + 1, m[3]);
  p.set(cx - 1, ty + 1, S[4]); p.set(cx - 2, ty + 2, S[4]); p.set(cx - 1, ty + 2, S[4]); p.set(cx, ty + 2, S[4]); p.set(cx - 1, ty + 3, S[4]); });
// Vestido romántico: mangas abullonadas, escote de encaje, colgante y falda corta con volante de encaje
fitKind('body', 'gt_romantico', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up, legTop, d } = A, R = tx0 + tw - 1, m = s.m, S = GTS, SK = A.sk;
  for (let y = legTop - 1; y <= legTop + 3; y++) { const e = y >= legTop + 1 ? 2 : 1; const x0 = side ? cx - 4 - (d > 0 ? e : 0) : tx0 - e, x1 = side ? cx + 3 + (d < 0 ? e : 0) : R + e; for (let x = x0; x <= x1; x++) p.set(x, y, y === legTop + 3 ? ((x % 2) ? m[4] : m[1]) : x === x0 ? m[3] : x === x1 ? m[1] : m[2]); }
  if (!side) for (const x of [tx0 - 1, R + 1]) { p.set(x, ty, m[3]); p.set(x, ty + 1, m[2]); p.set(x + (x < cx ? 1 : -1), ty, m[4]); }
  else { const x = cx + (d > 0 ? -2 : 1); p.set(x, ty, m[3]); p.set(x, ty + 1, m[2]); }
  if (up || side) return; for (let x = cx - 2; x <= cx + 1; x++) p.set(x, ty, SK[2]); for (let x = cx - 3; x <= cx + 2; x++) p.set(x, ty + 1, (x % 2) ? m[4] : m[1]); p.set(cx - 1, ty + 2, S[4]); p.hl(tx0, A.waistY, tw, m[0]); });
// Top de malla: hombros de malla, gargantilla de encaje con corazón y cadenas; puños con pulseras de tachas
fitKind('body', 'gt_malla', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up } = A, R = tx0 + tw - 1, m = s.m, S = GTS, SK = A.sk;
  for (let x = (side ? cx - 3 : tx0); x <= (side ? cx + 2 : R); x++) { p.set(x, ty, (x % 2) ? SK[2] : m[1]); p.set(x, ty + 1, (x % 2) ? m[1] : SK[1]); }
  if (up) return; for (let x = cx - 2; x <= cx + 1; x++) { const c = p.get(x, ty - 1); if (uA(c) && A.sk.includes(c)) p.set(x, ty - 1, (x % 2) ? m[0] : m[2]); }
  if (side) return; p.set(cx - 2, ty + 3, S[4]); p.set(cx, ty + 3, S[4]); p.set(cx - 1, ty + 4, S[4]); p.set(cx - 3, ty + 2, S[2]); p.set(cx + 2, ty + 2, S[2]); p.hl(tx0, A.waistY + 1, tw, GTL[0]); p.set(cx - 1, A.waistY + 1, S[4]); p.set(cx, A.waistY + 1, S[3]); });
// Chaleco de tachas sobre blusa de encaje (con anilla en el cuello)
fitKind('body', 'gt_tachas', (p, A, s) => { const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1, m = s.m, L = GTL, S = GTS;
  for (let y = ty; y <= A.waistY + 1; y++) for (let x = tx0; x <= R; x++) { const centre = !side && !up && x >= cx - 1 && x <= cx; if (centre) { p.set(x, y, (y % 2) ? m[3] : m[1]); continue; } if (!uA(p.get(x, y))) continue; p.set(x, y, L[x === tx0 ? 3 : x === R ? 1 : 2]); }
  if (up) { for (let x = tx0 + 1; x < R; x += 2) p.set(x, ty + 1, S[4]); return; }
  if (side) { for (let y = ty + 1; y <= A.waistY; y += 2) p.set(cx, y, S[4]); return; }
  for (let y = ty + 1; y <= A.waistY + 1; y += 2) { p.set(cx - 2, y, S[4]); p.set(cx + 1, y, S[4]); } p.set(tx0 + 1, ty, S[4]); p.set(R - 1, ty, S[4]); p.set(cx - 1, ty, S[3]); p.set(cx, ty, S[3]); });
// Top de hombros caídos y corto: hombros y cintura al aire, volante, gargantilla y rosario con cruz
fitKind('body', 'gt_hombros', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up, legTop } = A, R = tx0 + tw - 1, m = s.m, S = GTS, SK = A.sk, x0 = side ? cx - 3 : tx0, x1 = side ? cx + 2 : R;
  for (let x = x0; x <= x1; x++) { p.set(x, ty, SK[2]); p.set(x, ty + 1, (x % 2) ? m[3] : m[1]); for (let y = A.waistY; y < legTop; y++) p.set(x, y, SK[x === x0 ? 3 : x === x1 ? 1 : 2]); p.set(x, A.waistY - 1, (x % 2) ? m[1] : m[3]); }
  if (up || side) return; p.set(cx - 1, A.waistY + 1, SK[0]); for (let y = ty + 2; y < A.waistY - 2; y += 2) p.set(cx - 1, y, S[3]); p.set(cx - 1, A.waistY - 2, S[4]); p.set(cx - 2, A.waistY - 3, S[4]); p.set(cx, A.waistY - 3, S[4]);
  for (let x = cx - 2; x <= cx + 1; x++) { const c = p.get(x, ty - 1); if (uA(c) && SK.includes(c)) p.set(x, ty - 1, m[0]); } p.set(cx - 1, ty - 1, S[4]); }, { skin: true });
// Top de tiras con malla: red sobre la piel, banda negra y tiras cruzadas en estrella; colgante de corazón
fitKind('body', 'gt_tiras', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up } = A, R = tx0 + tw - 1, m = s.m, S = GTS, SK = A.sk, x0 = side ? cx - 3 : tx0, x1 = side ? cx + 2 : R;
  for (let y = ty; y <= A.waistY + 1; y++) for (let x = x0; x <= x1; x++) p.set(x, y, (x + y) % 2 ? m[0] : SK[(x === x0 ? 3 : x === x1 ? 1 : 2)]);
  for (let x = x0; x <= x1; x++) { p.set(x, ty + 2, m[1]); p.set(x, ty + 3, m[2]); }
  if (up || side) return; p.line(tx0 + 1, ty, cx - 1, ty + 5, m[0]); p.line(R - 1, ty, cx, ty + 5, m[0]); p.hl(tx0 + 1, ty + 5, tw - 2, m[0]); p.set(cx - 1, ty + 1, S[4]); p.set(cx, ty + 1, S[3]); }, { skin: true });
// ---------- piernas y calzado ----------
fitKind('legs', 'gt_faldacuero', (p, A, s) => { const { tx0, tw, cx, side, up, legTop, d } = A, R = tx0 + tw - 1, L = GTL, S = GTS, x0 = side ? cx - 4 : tx0 - 1, x1 = side ? cx + 3 : R + 1;
  for (let y = legTop; y <= legTop + 3; y++) for (let x = x0; x <= x1; x++) p.set(x, y, x === x0 + 1 && !up ? L[4] : x === x1 ? L[1] : L[2]);
  for (let x = x0; x <= x1; x++) p.set(x, legTop, L[0]); if (up || side) return; p.set(cx - 1, legTop, S[4]); p.set(cx, legTop, S[3]); for (let k = 0; k < 4; k++) p.set(x0 + 1 + k * 2, legTop + 1 + (k >> 1), S[3]); p.set(x1 - 1, legTop + 2, S[2]); p.set(x1 - 1, legTop + 3, S[2]); });
fitKind('legs', 'gt_tutu', (p, A, s) => { const { tx0, tw, cx, side, up, legTop, base } = A, R = tx0 + tw - 1, m = s.m, SK = A.sk;
  for (let y = legTop; y <= legTop + 3; y++) { const e = y - legTop >> 1; const x0 = (side ? cx - 4 : tx0 - 1) - e, x1 = (side ? cx + 3 : R + 1) + e; for (let x = x0; x <= x1; x++) { if (y === legTop + 3 && (x % 2)) continue; p.set(x, y, y === legTop + 1 || y === legTop + 3 ? ((x % 2) ? m[3] : m[1]) : m[2]); } }
  const cols = new Set(m); for (let y = legTop + 4; y < base - 2; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y)) && ((x * 7 + y * 3) % 11 === 0)) p.set(x, y, SK[2]); });
fitKind('legs', 'gt_cordones', (p, A, s) => { const { tx0, cx, side, up, legTop } = A, m = s.m, S = GTS; if (up) return; if (side) { for (let y = legTop + 1; y < legTop + 6; y += 2) p.set(cx - 1, y, S[3]); return; }
  for (let y = legTop; y < legTop + 6; y++) { gtSet(p, cx - 1, y, (y % 2) ? S[3] : m[0]); gtSet(p, cx, y, (y % 2) ? m[0] : S[3]); } for (let y = legTop + 1; y < A.base - 3; y++) gtSet(p, tx0 + 1, y, m[4]); });
fitKind('feet', 'gt_plataforma', (p, A, s) => { const m = s.m, S = GTS, cols = new Set(), bot = {}; for (let y = A.base - 6; y < Math.min(p.h, A.base + 2); y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (uA(c) && y >= A.base - 6) { if (bot[x] === undefined || y > bot[x]) bot[x] = y; } }
  for (const xs in bot) { const x = +xs, yb = bot[x]; if (yb < A.base - 3) continue; for (let y = yb - 4; y <= yb; y++) { const c = p.get(x, y); if (!uA(c)) continue; p.set(x, y, y === yb ? m[0] : y === yb - 3 && (x % 2) ? S[4] : m[(x % 3) ? 2 : 1]); } } });
// ---------- pelucas góticas (tapan el pelo propio) ----------
function gtWig(style) { return (p, A, s) => { const H = s.m, P2 = s.s, { hx, hy, hrx, hry, ey, side, up, d } = A, top = Math.round(hy - hry);
  const big = style === 'cardado', rx = hrx + (big ? 3.5 : 1.2), ry = hry + (big ? 2.5 : 1), cy = hy - (big ? 1.5 : 0.5), len = style === 'larga' ? hry + 9 : style === 'melena' ? hry + 4 : style === 'cardado' ? hry + 3 : hry - 1;
  for (let y = Math.floor(cy - ry); y <= Math.round(hy + len); y++) for (let x = Math.floor(hx - rx - 1); x <= Math.ceil(hx + rx + 1); x++) {
    const nx = (x - hx) / rx, ny = (y - cy) / ry, inDome = nx * nx + ny * ny <= 1, wave = style === 'larga' || style === 'melena' ? Math.round(Math.sin(y * 0.9) * 0.8) : 0;
    const sideBand = Math.abs(x - hx - wave) >= hrx - 1 && Math.abs(x - hx - wave) <= rx + (big ? 0.5 : 0) && y > hy - 2;
    if (!inDome && !(sideBand && y <= hy + len)) continue; if (big && (x * 13 + y * 7) % 9 === 0 && !inDome) continue;
    if (!up) { const faceZone = y >= ey - 1 && Math.abs(x - hx) < hrx - 1; if (faceZone && !side) continue; if (side && y >= ey - 1 && (x - hx) * d > -1) continue;
      if (style === 'melena' && !side && y >= top + 3 && Math.abs(x - hx) < hrx - 2 && y < ey + 4) continue; }
    const t = (y - (cy - ry)) / (ry * 2 + len); let c = t < 0.12 ? H[2] : t < 0.26 ? ((x + y) % 3 ? H[2] : H[3]) : x < hx ? H[2] : H[1];
    if (style === 'larga' && y > top + 4 && (x % 4 === 1)) c = P2[3]; else if (style === 'larga' && y > top + 4 && (x % 4 === 2)) c = P2[2];
    if (!up && !side && y === ey - 1 && style !== 'melena') c = H[1]; if (style === 'melena' && !side && x === Math.round(hx) && y < top + 4) c = H[0]; if (up && x === Math.round(hx) && style === 'melena') c = H[1];
    p.set(x, y, c); } }; }
fitKind('head', 'gt_bob', gtWig('bob')); fitKind('head', 'gt_cardado', gtWig('cardado')); fitKind('head', 'gt_larga', gtWig('larga')); fitKind('head', 'gt_melena', gtWig('melena'));
// gafas redondas (pegadas a la cara)
fitKind('head', 'gt_gafas', (p, A, s) => { if (A.up) return; const c = s.m[1], ey = A.ey, ring = ex => { for (let x = ex - 1; x <= ex + 2; x++) { p.set(x, ey - 1, c); p.set(x, ey + 3, c); } for (let y = ey; y <= ey + 2; y++) { p.set(ex - 1, y, c); p.set(ex + 2, y, c); } };
  if (A.side) { const ex = A.eyes[0]; ring(ex); p.hl(A.d > 0 ? ex - 4 : ex + 3, ey, 3, c); return; } ring(A.eyes[0]); ring(A.eyes[1]); for (let x = A.eyes[0] + 3; x < A.eyes[1] - 1; x++) p.set(x, ey, c); }, { face: true });
// mangas: campana, malla, encaje y pulseras de tachas (se retocan cuando ya están dibujados los brazos)
const GT_SLEEVE = { gt_campana: 'bell', gt_tiras: 'net', gt_tachas: 'lace', gt_malla: 'stud', gt_hombros: 'lace' };
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { const T_ = L && L.top, mode = T_ && GT_SLEEVE[T_.k], M = p.meta; if (!mode || !M || M.side) return r;
      const cols = new Set(T_.m), R = M.tx0 + M.tw - 1, SK = M.sk, y0 = M.torsoTop, y1 = M.torsoTop + M.th + (M.al || 6);
      for (const sideX of [-1, 1]) { let yb = -1, xa = 99, xb = -1; for (let y = y0; y <= y1; y++) for (let x = (sideX < 0 ? 0 : R + 1); x <= (sideX < 0 ? M.tx0 - 1 : p.w - 1); x++) { const c = p.get(x, y); if (!cols.has(c)) continue; if (y > yb) yb = y; if (x < xa) xa = x; if (x > xb) xb = x;
          if (mode === 'net' && (x + y) % 2) p.set(x, y, SK[2]); else if (mode === 'lace' && (x + y) % 3 === 0) p.set(x, y, T_.m[3]); }
        if (yb < 0) continue; if (mode === 'bell') { for (let x = xa - 1; x <= xb + 1; x++) { p.set(x, yb + 1, T_.m[x === xa - 1 || x === xb + 1 ? 1 : 2]); } p.set(sideX < 0 ? xa - 1 : xb + 1, yb, T_.m[1]); p.set(sideX < 0 ? xa - 1 : xb + 1, yb + 2, T_.m[0]); }
        if (mode === 'stud') for (let x = xa; x <= xb; x++) p.set(x, yb, (x % 2) ? GTS[4] : GTL[1]); } } catch (e) { } return r; }; }

// ---------- piel blanca gótica (opción del editor, se ve online) ----------
const GT_PALE = P5(['#9a8c9e', '#bcb0c0', '#dcd4de', '#eeeaf0', '#fbf9fc']);
{ const _n = normApp; normApp = function (a) { const o = _n.apply(this, arguments); if (a && a.pale) o.pale = 1; return o; }; }
{ const _hk = heroKey; heroKey = function (cls, app) { const k = _hk.apply(this, arguments); return app && app.pale ? k + '|pl' : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app) { const L = _hl.apply(this, arguments); if (L && app && app.pale) L.skin = GT_PALE; return L; }; }
{ const _ae = appEditorHTML; appEditorHTML = function (app, tabs) { const h = _ae.apply(this, arguments); if (edTab !== 'pelo') return h; return h + `<div class="edextra"><h4>${L2('Piel', 'Skin')}</h4><div class="chips"><button class="chip ${app.pale ? '' : 'on'}" data-epl="0">${L2('Normal', 'Normal')}</button><button class="chip ${app.pale ? 'on' : ''}" data-epl="1">${L2('Maquillaje blanco gótico', 'White gothic makeup')}</button></div></div>`; }; }
{ const _ba = bindAppEditor; bindAppEditor = function (root, app, onChange) { const r = _ba.apply(this, arguments); $$('[data-epl]', root).forEach(b => b.onclick = () => { app.pale = +b.dataset.epl ? 1 : 0; sfx('ui'); onChange(true); }); return r; }; }

// ---------- la tienda de Morwenna se rehace con la ropa nueva ----------
const GT_NEW = [
  ['c_gt_campana', L2('Vestido de Campana con Corsé', 'Bell-Sleeve Corset Dress'), 'body', () => ({ k: 'gt_campana', m: GTN, s: GTS }), 14000],
  ['c_gt_romantico', L2('Vestido Romántico de Encaje', 'Romantic Lace Dress'), 'body', () => ({ k: 'gt_romantico', m: GTN, s: GTS }), 11000],
  ['c_gt_malla', L2('Top de Malla y Gargantilla', 'Mesh Top and Choker'), 'body', () => ({ k: 'gt_malla', m: GTN, s: GTS }), 9000],
  ['c_gt_tachas', L2('Chaleco de Tachas y Encaje', 'Studded Vest and Lace'), 'body', () => ({ k: 'gt_tachas', m: GTN, s: GTS }), 12000],
  ['c_gt_hombros', L2('Top de Hombros Caídos y Rosario', 'Off-Shoulder Top and Rosary'), 'body', () => ({ k: 'gt_hombros', m: GTN, s: GTS }), 9500],
  ['c_gt_tiras', L2('Top de Tiras y Malla', 'Strappy Mesh Top'), 'body', () => ({ k: 'gt_tiras', m: GTN, s: GTS }), 9500],
  ['c_gt_vino', L2('Vestido de Campana Vino', 'Wine Bell-Sleeve Dress'), 'body', () => ({ k: 'gt_campana', m: GTR, s: GTS }), 14000],
  ['c_gt_faldacuero', L2('Falda de Cuero con Cadenas', 'Chained Leather Skirt'), 'legs', () => ({ k: 'gt_faldacuero', m: GTN, s: GTS }), 7000],
  ['c_gt_tutu', L2('Falda Tutú y Medias Rotas', 'Tutu Skirt and Ripped Tights'), 'legs', () => ({ k: 'gt_tutu', m: GTN, s: GTS }), 7000],
  ['c_gt_cordones', L2('Pantalón de Cuero con Cordones', 'Lace-Up Leather Pants'), 'legs', () => ({ k: 'gt_cordones', m: GTL, s: GTS }), 7500],
  ['c_gt_plataforma', L2('Botas de Plataforma', 'Platform Boots'), 'feet', () => ({ k: 'gt_plataforma', m: GTN, s: GTS }), 6500],
  ['c_gt_bob', L2('Peluca Bob con Flequillo', 'Bob Wig with Bangs'), 'head', app => ({ k: 'gt_bob', m: HAIRS[app.hair] || HAIRS.negro, s: GTP, cover: 'full' }), 6000],
  ['c_gt_cardado', L2('Peluca Cardada', 'Teased Wig'), 'head', app => ({ k: 'gt_cardado', m: HAIRS[app.hair] || HAIRS.negro, s: GTP, cover: 'full' }), 6000],
  ['c_gt_larga', L2('Peluca Larga Ondulada Morada', 'Long Wavy Purple Wig'), 'head', () => ({ k: 'gt_larga', m: HAIRS.negro, s: GTP, cover: 'full' }), 7500],
  ['c_gt_melena', L2('Melena Ondulada', 'Wavy Shoulder Hair'), 'head', app => ({ k: 'gt_melena', m: HAIRS[app.hair] || HAIRS.negro, s: GTP, cover: 'full' }), 6000],
  ['c_gt_gafas', L2('Gafas Redondas', 'Round Glasses'), 'head', () => ({ k: 'gt_gafas', m: GTS }), 3000],
];
for (const [id, n, slot, vis, price] of GT_NEW) { cosm(id, n, slot, vis, { src: L2('Morwenna, modista gótica (Albor)', 'Morwenna, gothic seamstress (Albor)') }); it('cosi_' + id, { n, t: 'cos', cos: id, price, icon: ['hanger'], rar: 3 }); }
GOTH_COS.splice(0, GOTH_COS.length, ...GT_NEW);

// ---------- ropa de cazador con diseño propio (antes eran prendas normales en negro) ----------
fitKind('body', 'hn_chaqueta', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up } = A, R = tx0 + tw - 1, m = s.m, G_ = GOLD; for (let x = (side ? cx - 3 : cx - 3); x <= (side ? cx + 1 : cx + 2); x++) p.set(x, ty, m[3]);
  if (up) { p.set(cx - 1, ty + 3, G_[3]); p.set(cx, ty + 3, G_[4]); p.set(cx - 1, ty + 4, G_[2]); p.set(cx, ty + 4, G_[3]); return; } if (side) { p.vl(cx + (A.d > 0 ? 1 : -2), ty + 1, A.waistY - ty, GTS[3]); return; }
  p.vl(cx - 1, ty + 1, A.waistY - ty + 1, GTS[3]); p.set(R - 2, ty + 2, G_[4]); p.set(R - 2, ty + 3, G_[2]); p.hl(tx0, A.waistY + 1, tw, m[0]); });
fitKind('body', 'hn_cuero', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up } = A, R = tx0 + tw - 1, m = s.m, S = GTS; if (up) { p.hl(tx0, ty, tw, m[3]); p.hl(tx0, A.waistY + 1, tw, m[0]); return; }
  if (side) { p.set(cx - 1, ty, S[4]); p.vl(cx + (A.d > 0 ? 0 : -1), ty + 1, A.waistY - ty, S[3]); return; }
  p.line(cx + 1, ty, cx - 2, A.waistY, S[3]); p.set(cx - 3, ty, m[4]); p.set(cx - 2, ty + 1, m[4]); p.set(cx + 2, ty, m[4]); p.set(cx + 3, ty + 1, m[4]); p.set(tx0 + 1, ty, S[4]); p.set(R - 1, ty, S[4]); p.hl(tx0, A.waistY + 1, tw, m[0]); p.set(cx + 1, A.waistY + 1, S[3]); });
fitKind('body', 'hn_sudadera', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up } = A, R = tx0 + tw - 1, m = s.m; if (up) { for (let x = tx0 + 1; x < R; x++) { p.set(x, ty, m[3]); p.set(x, ty + 1, m[2]); } return; }
  if (side) { p.hl(cx - 2, A.waistY - 1, 4, m[1]); return; } p.hl(cx - 3, A.waistY - 2, 6, m[1]); p.vl(cx - 3, A.waistY - 2, 3, m[1]); p.vl(cx + 2, A.waistY - 2, 3, m[1]); p.set(cx - 2, ty + 1, GTS[4]); p.set(cx - 2, ty + 2, GTS[3]); p.set(cx + 1, ty + 1, GTS[4]); p.set(cx + 1, ty + 2, GTS[3]); p.hl(tx0, A.waistY + 1, tw, m[3]); });
fitKind('body', 'hn_tactico', (p, A, s) => { const { tx0, tw, torsoTop: ty, cx, side, up } = A, R = tx0 + tw - 1, m = s.m; if (side) { p.set(cx - 1, A.waistY - 1, m[3]); p.set(cx, A.waistY - 1, m[3]); return; }
  p.vl(tx0 + 2, ty, A.waistY - ty + 1, m[0]); p.vl(R - 2, ty, A.waistY - ty + 1, m[0]); if (up) return; for (const x of [tx0 + 1, cx - 1, R - 2]) { p.set(x, A.waistY - 1, m[3]); p.set(x + 1, A.waistY - 1, m[3]); p.set(x, A.waistY, m[2]); p.set(x + 1, A.waistY, m[2]); } p.set(tx0 + 1, ty + 1, GTS[3]); p.set(tx0 + 1, ty + 2, GTS[2]); });
{ const N_ = P5(['#06060a', '#0e0e14', '#18181f', '#24242e', '#34343f']), G2 = P5(['#14141a', '#24242c', '#363640', '#4a4a56', '#62626e']);
  if (COSM.c_chaq_cazador) COSM.c_chaq_cazador.vis = () => ({ k: 'hn_chaqueta', m: N_ }); if (COSM.c_chaq_cuero) COSM.c_chaq_cuero.vis = () => ({ k: 'hn_cuero', m: N_ });
  if (COSM.c_sudadera) COSM.c_sudadera.vis = () => ({ k: 'hn_sudadera', m: G2 }); if (COSM.c_ropa_negra) COSM.c_ropa_negra.vis = () => ({ k: 'hn_tactico', m: G2 }); }

// =====================================================================================
// LOS CAZADORES ESQUIVAN CON DASH: detectan el peligro (tu habilidad, el poder del rival, las zonas rojas)
// =====================================================================================
function aiDash(e, fx, fy, M) { const dx = e.x - fx, dy = e.y - fy, L = Math.hypot(dx, dy) || 1, px = -dy / L, py = dx / L, s = Math.random() < 0.5 ? 1 : -1, ax = (dx / L) * 0.5 + px * s, ay = (dy / L) * 0.5 + py * s, AL = Math.hypot(ax, ay) || 1;
  const ox = e.x, oy = e.y; for (let k = 0; k < 6; k++) moveEnt(M || G.map, e, ax / AL * 7, ay / AL * 7);
  for (let k = 0; k < 4; k++) part(ox + (e.x - ox) * k / 4, oy + (e.y - oy) * k / 4 - 12, { vz: 0, g: 0, life: 0.3, c: '#c8e0ff', s: 2 });
  addFx({ type: 'ring', x: ox, y: oy, r: 10, dur: 0.25, col: '#c8e0ff' }); floatText(e.x, e.y - 40, '!', '#ffe070'); e.dodgeT = G.t + 0.4; e.dashCd = G.t + 2 + Math.random(); sfx('swing'); }
// el rival del duelo (cazador) esquiva tus habilidades y algunos golpes
function duelDodge(chance) { const P = G.P, m = DUEL && DUEL.m; if (!m || m.dying || m.hp <= 0 || (m.dashCd || 0) > G.t) return; if (dist2(m.x, m.y, P.x, P.y) > 130 * 130) return;
  const c = chance + clamp(((m.lv || 1) - P.lv) / 250, 0, 0.3); if (Math.random() < c) aiDash(m, P.x, P.y); }
{ const _us = useSkill; useSkill = function () { try { if (DUEL) duelDodge(0.45); } catch (e) { } return _us.apply(this, arguments); }; }
{ const _ba = basicAttack; basicAttack = function () { try { if (DUEL) duelDodge(0.08); } catch (e) { } return _ba.apply(this, arguments); }; }
{ const _hm = hitMob; hitMob = function (m) { if (m && m.dodgeT && m.dodgeT > G.t) { if (!m.missT || m.missT < G.t) { m.missT = G.t + 0.3; floatText(m.x, m.y - 30, L2('¡Esquiva!', 'Dodge!'), '#c8e0ff'); } return; } return _hm.apply(this, arguments); }; }
// tus compañeros cazadores salen con dash de las zonas rojas
{ const _hu = huntUpdate; huntUpdate = function (a, dt) { try { if (a && !a.down && (a.dashCd || 0) < G.t && typeof teleHas === 'function') for (const f of G.fx) if (f.type === 'tele' && teleHas(f, a.x, a.y, 6)) { aiDash(a, f.x || a.x + 1, f.y || a.y); break; } } catch (e) { } return _hu.apply(this, arguments); }; }
{ const _hh = huntHurt; huntHurt = function (a) { if (a && a.dodgeT && a.dodgeT > G.t) return; return _hh.apply(this, arguments); }; }
// en el Coliseo: ven venir el poder del rival y lo esquivan
{ const _tu = tfUpdate; tfUpdate = function (e, alive, dt) { try { if ((e.dashCd || 0) < G.t) for (const o of alive) if (o.side !== e.side && o.pcd < 0.35 && o.pcd > 0 && dist2(o.x, o.y, e.x, e.y) < 120 * 120 && Math.random() < 0.02 + Math.min(0.06, e.S.lv / 4000)) { aiDash(e, o.x, o.y, G.map); break; } } catch (x) { } return _tu.apply(this, arguments); }; }
{ const _th = tfHit; tfHit = function (o) { if (o && o.dodgeT && o.dodgeT > G.t) { if (!o.missT || o.missT < G.t) { o.missT = G.t + 0.3; floatText(o.x, o.y - 30, L2('¡Esquiva!', 'Dodge!'), '#c8e0ff'); } return; } return _th.apply(this, arguments); }; }

// =====================================================================================
// COMBATE ONLINE EN EL COLISEO: invitas a un jugador conectado, os lleva a la arena y lucháis (PvP)
// =====================================================================================
const CARENA = { inv: null, acc: null, lost: null, seen: {}, fight: null };
function arenaPlayers() { return [...G.remote.values()].filter(r => r && r.id && r.name); }
function arenaInviteMenu() { const L_ = arenaPlayers(); if (!netOnline || !netOnline() || !L_.length) { toast(L2('No hay jugadores conectados para invitar.', 'No online players to invite.'), 'warn', 3); return; }
  openModal(`<h2>⚔ ${L2('Combate en el Coliseo', 'Coliseum fight')}</h2><p class="hint">${L2('Invita a un jugador conectado. Si acepta, los dos apareceréis en la arena y lucharéis (nadie pierde nada).', 'Invite an online player. If they accept, you both appear in the arena and fight (nobody loses anything).')}</p><div class="slist">${L_.map(r => `<div class="srow"><div class="sn"><b>${esc(r.name)}</b><small>${L2('Nv. ', 'Lv. ')}${r.lv || '?'}</small></div><button class="btn gold sm" data-ari="${esc(r.id)}">${L2('Invitar', 'Invite')}</button></div>`).join('')}</div><div class="row"><button class="btn" id="mclose">${L2('Cerrar', 'Close')}</button></div>`, 'party');
  $('#mclose').onclick = closeModal; $$('[data-ari]').forEach(b => b.onclick = () => { CARENA.inv = [b.dataset.ari, Date.now()]; netPresence(true); closeModal(); toast(L2('Invitación enviada. Esperando respuesta…', 'Invite sent. Waiting for an answer…'), 'info', 4); }); }
function arenaGo(opp, left) { CARENA.fight = { opp, left, t0: G.t, state: 'wait' }; const go = () => { if (G.map.id !== 'tp_coliseo') tprGo('tp_coliseo'); }; if (G.map && G.map.tower) go(); else if (G.map && G.map.tw2) { if (G.map.id === 'tp_coliseo') { } else { exitInterior(); setTimeout(go, 900); } } else { tpGo(); setTimeout(go, 1000); } }
{ const _ep = extraPresence; extraPresence = function (o) { const r = _ep.apply(this, arguments); if (CARENA.inv && Date.now() - CARENA.inv[1] < 60000) o.ari = CARENA.inv; if (CARENA.acc && Date.now() - CARENA.acc[1] < 60000) o.ara = CARENA.acc; if (CARENA.lost && Date.now() - CARENA.lost[1] < 30000) o.arl = CARENA.lost; return r; }; }
{ const _er = extraRecv; extraRecv = function (r, pr) { _er.apply(this, arguments); try { const me = NET.myId, S = CARENA.seen;
      if (Array.isArray(pr.ari) && pr.ari[0] === me && S['i' + r.id] !== pr.ari[1]) { S['i' + r.id] = pr.ari[1]; arenaAsk(r); }
      if (Array.isArray(pr.ara) && pr.ara[0] === me && S['a' + r.id] !== pr.ara[1] && CARENA.inv && CARENA.inv[0] === r.id) { S['a' + r.id] = pr.ara[1]; toast(r.name + L2(' aceptó. ¡Al Coliseo!', ' accepted. To the Coliseum!'), 'quest', 4); CARENA.inv = null; arenaGo(r.id, true); }
      if (Array.isArray(pr.arl) && pr.arl[0] === me && S['l' + r.id] !== pr.arl[1] && CARENA.fight && CARENA.fight.opp === r.id) { S['l' + r.id] = pr.arl[1]; arenaEnd(true, r.name); } } catch (e) { } }; }
function arenaAsk(r) { openModal(`<h2>⚔ ${L2('Reto en el Coliseo', 'Coliseum challenge')}</h2><p><b>${esc(r.name)}</b> ${L2('te reta a un combate en la arena del Coliseo de Cazadores.', 'challenges you to a fight in the Hunters\' Coliseum arena.')}</p><div class="row"><button class="btn gold" id="arY">${L2('Aceptar', 'Accept')}</button><button class="btn" id="arN">${L2('Rechazar', 'Decline')}</button></div>`, 'party');
  $('#arN').onclick = closeModal; $('#arY').onclick = () => { closeModal(); CARENA.acc = [r.id, Date.now()]; netPresence(true); arenaGo(r.id, false); }; }
V33_TICKS.push(() => { const F = CARENA.fight, P = G.P; if (!F || !P) return; if (G.t - F.t0 > 240) { arenaEnd(null); return; } if (!G.map || G.map.id !== 'tp_coliseo') return; const M = G.map, r = M.ring, opp = G.remote.get ? [...G.remote.values()].find(x => x.id === F.opp) : null;
  if (F.state === 'wait') { if (opp && opp.map === 'tp_coliseo') { F.state = 'count'; F.ct = G.t + 3; P.x = r.x + (F.left ? -r.rx * 0.5 : r.rx * 0.5); P.y = r.y; P.dir = F.left ? 'right' : 'left'; if (P.S) P.hp = P.S.maxhp; F.pvp0 = PVP.on; banner('⚔ ' + G.P.name + ' VS ' + opp.name, L2('¡Preparados…!', 'Get ready…!')); sfx('boss'); } return; }
  if (F.state === 'count' && G.t >= F.ct) { F.state = 'fight'; PVP.on = true; netPresence(true); banner(L2('¡LUCHA!', 'FIGHT!'), L2('Coliseo de Cazadores', 'Hunters\' Coliseum')); }
  if (F.state === 'fight' && (!opp || opp.map !== 'tp_coliseo') && G.t - F.ct > 5) arenaEnd(true, opp ? opp.name : '?'); });
function arenaEnd(won, oppName) { const F = CARENA.fight, P = G.P; if (!F) return; CARENA.fight = null; PVP.on = !!F.pvp0; netPresence(true); if (P.S && (P.dead || P.hp < P.S.maxhp * 0.5)) { P.dead = false; P.downed = null; P.hp = Math.round(P.S.maxhp * 0.6); setAnim(P, 'idle'); if (typeof downUI === 'function') downUI(); }
  if (won === true) { banner(L2('¡Victoria en el Coliseo!', 'Coliseum victory!'), oppName || ''); sfx('level'); hnLog('🏟 ' + P.name + L2(' venció a ', ' beat ') + (oppName || '') + L2(' en el Coliseo.', ' at the Coliseum.')); }
  else if (won === false) { banner(L2('Derrota en el Coliseo', 'Coliseum defeat'), L2('¡La próxima será!', 'Next time!')); sfx('hurt'); } }
// si caes en el combate de la arena no quedas derribado: pierdes el combate
{ const _sd = startDown; startDown = function () { const F = CARENA.fight, P = G.P; if (F && F.state === 'fight' && G.map && G.map.id === 'tp_coliseo') { CARENA.lost = [F.opp, Date.now()]; netPresence(true); P.dead = false; P.hp = 1; arenaEnd(false); return; } return _sd.apply(this, arguments); }; }
// en el menú del Coliseo aparece «Combate online»
{ const _tm = tourMenu; tourMenu = function () { const r = _tm.apply(this, arguments); try { const row = document.querySelector('#modal .row:last-child'); if (row && !$('#arInv')) { const b = document.createElement('button'); b.id = 'arInv'; b.className = 'btn gold'; b.textContent = '🌐 ' + L2('Combate online', 'Online fight'); b.onclick = () => { closeModal(); arenaInviteMenu(); }; row.prepend(b); } } catch (e) { } return r; }; }
// en la lupa › Sistemas: cómo conseguir la ropa gótica, la de cazador, las pelucas y el maquillaje (ES/EN)
if (typeof GSIS !== 'undefined') GSIS.push(['ropa_gotica', '🖤 ' + L2('Ropa gótica y de cazador', 'Gothic and hunter clothes'), () => [
  L2('Taller de Morwenna (Albor, modista gótica): habla con ella y elige «Ropa gótica». Vende:', 'Morwenna\'s Workshop (Albor, gothic seamstress): talk to her and choose "Gothic clothes". She sells:')
].concat(GT_NEW.map(([id, n, slot, , pr]) => '· ' + n + ' — ' + fmt(pr) + L2(' oro', ' gold') + ' (' + ({ body: L2('cuerpo', 'body'), legs: L2('piernas', 'legs'), feet: L2('pies', 'feet'), head: L2('cabeza', 'head') }[slot] || slot) + ')')).concat([
  L2('Maquillaje blanco gótico: gratis, en el editor de personaje (pestaña Pelo › Piel). Labial negro, ojeras y delineado están en la misma pestaña.', 'White gothic makeup: free, in the character editor (Hair tab › Skin). Black lipstick, dark circles and eyeliner are in the same tab.'),
  L2('Ropa de cazador (chaquetas, sudadera, chaleco táctico, capuchas, pantalones, falda, botas y capas): sale en los cofres al cerrar un portal de la Torre de los Portales y se compra en la Tienda del Portal (vestíbulo de la Torre).', 'Hunter clothes (jackets, hoodie, tactical vest, hoods, trousers, skirt, boots and capes): drop from chests when you close a Portal Tower portal and can be bought at the Portal Shop (Tower lobby).'),
  L2('Todo se pone en el Vestuario (menú › percha) y se ajusta solo a tu cuerpo.', 'Everything is worn from the Wardrobe (menu › hanger) and fits your body automatically.')
]), () => null]);
// v4.52: la clase despertada sube a todas las clases (+10 % ataque, +8 % vida y defensa, además de su bonus propio)
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); try { if (P && P === G.P && P.S && P.evo) { const S = P.S; S.atk = Math.round(S.atk * 1.10); S.def = Math.round(S.def * 1.08); const h0 = S.maxhp; S.maxhp = Math.round(S.maxhp * 1.08); if (P.hp > S.maxhp) P.hp = S.maxhp; } } catch (e) { } return r; }; }
// el poder se calcula al final, con todos los bonus (antes algunos solo contaban si tenías subraza)
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); try { const S = (P && P.S) || r; if (S && S.atk !== undefined) S.power = Math.round(S.atk * 2 + S.def * 1.5 + S.maxhp / 10); } catch (e) { } return r; }; }
