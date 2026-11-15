// =====================================================================================
// v4.57: ROPA DESGARRADA SEGÚN LA VIDA. Funciona con cualquier ropa, armadura o cosmético porque se aplica
// sobre el dibujo ya terminado (después de drawHero), usando los puntos de anclaje del cuerpo (p.meta).
//   nivel 1 (vida < 50 %): algunos rotos y raspones
//   nivel 2 (vida < 25 %): más rotos, bordes deshilachados y gotas de sangre
// Siempre protegido: el pecho de los cuerpos femeninos (mitad alta del torso) y la entrepierna.
// Al curarte por encima del 60 % la ropa vuelve a estar bien. Se ve online (presencia «tr»).
// =====================================================================================
const TEAR_HOLES = {   // [parte, fx, fy, tamaño]  (fracciones dentro de cada parte del cuerpo)
  1: [['torso', 0.15, 0.78, 1], ['torso', 0.8, 0.62, 1], ['legL', 0.5, 0.35, 1], ['legR', 0.5, 0.62, 1], ['armL', 0.5, 0.55, 1], ['armR', 0.5, 0.35, 1]],
  2: [['torso', 0.12, 0.72, 2], ['torso', 0.82, 0.58, 2], ['torso', 0.5, 0.92, 1], ['legL', 0.5, 0.25, 2], ['legL', 0.4, 0.7, 1], ['legR', 0.5, 0.5, 2], ['legR', 0.6, 0.85, 1], ['armL', 0.5, 0.4, 2], ['armL', 0.5, 0.8, 1], ['armR', 0.5, 0.3, 1], ['armR', 0.5, 0.7, 2]] };
// v4.58: en los cuerpos femeninos la ropa se rasga un poco más (cintura, costados, brazos y piernas; el pecho sigue protegido)
const TEAR_HOLES_F = {
  1: [['torso', 0.5, 0.88, 1], ['legL', 0.5, 0.75, 1], ['legR', 0.5, 0.2, 1], ['armL', 0.5, 0.15, 1]],
  2: [['torso', 0.3, 0.86, 2], ['torso', 0.7, 0.9, 1], ['legL', 0.5, 0.5, 2], ['legR', 0.5, 0.15, 2], ['legR', 0.4, 0.95, 1], ['armL', 0.5, 0.15, 1], ['armR', 0.5, 0.5, 2]] };
const TEAR_RED =[C('#7a0a12'), C('#b81a24'), C('#e0303a')], TEAR_BLACK = C('#000000');
let TEAR_CUR = 0;
function tearApply(p, L) { const M = p.meta, lvl = L.tear | 0; if (!M || !lvl) return; const SK = M.sk || L.skin || []; const skin = new Set(SK), hair = new Set(L.hair || []), W = p.w, H = p.h;
  const R = M.tx0 + M.tw - 1, legTop = M.legTop, base = M.base, ty = M.torsoTop, th = M.th, al = M.al || 6, aw = M.aw || 2, cx = M.cx, side = M.side;
  const isCloth = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return false; const c = p.get(x, y); if (!uA(c) || skin.has(c) || hair.has(c)) return false; const r = uR(c), g = uG(c), b = uB(c); if (r + g + b < 40) return false; return true; };
  const protect = (x, y) => { if (M.fem && y >= ty && y < ty + Math.ceil(th * 0.55) && x >= M.tx0 - 1 && x <= R + 1) return true; if (y >= legTop && y <= legTop + 2 && Math.abs(x - cx + 0.5) <= 2 && !side) return true; return y < ty; };
  const where = (part, fx, fy) => { if (part === 'torso') return [Math.round(M.tx0 + fx * (M.tw - 1)), Math.round(ty + fy * (th - 1))];
    if (part === 'legL' || part === 'legR') { const lx = side ? cx - 1 : (part === 'legL' ? M.tx0 + 1 : R - 1); return [lx, Math.round(legTop + 1 + fy * Math.max(1, base - legTop - 4))]; }
    if (side) return null; const ax = part === 'armL' ? M.tx0 - Math.ceil(aw / 2) : R + Math.ceil(aw / 2); return [ax, Math.round(ty + 1 + fy * (al - 1))]; };
  const holes = M.fem ? TEAR_HOLES[lvl].concat(TEAR_HOLES_F[lvl]) : TEAR_HOLES[lvl];
  for (const [part, fx, fy, sz0] of holes) { const sz = M.fem && lvl >= 2 ? Math.max(sz0, 2) : sz0; const w = where(part, fx, fy); if (!w) continue; const [x0, y0] = w; const cells = sz >= 2 ? [[0, 0], [1, 0], [0, 1], [1, 1]] : [[0, 0], [1, 0]];
    for (const [dx, dy] of cells) { const x = x0 + dx, y = y0 + dy; if (protect(x, y) || !isCloth(x, y)) continue; p.set(x, y, M.up && part !== 'legL' && part !== 'legR' ? uMix(p.get(x, y), TEAR_BLACK, 0.7) : (SK[dy ? 1 : 2] || C('#e0b090'))); }
    // borde del roto más oscuro (tela rasgada)
    for (const [dx, dy] of [[-1, 0], [2, 0], [0, -1], [1, -1], [0, sz >= 2 ? 2 : 1], [1, sz >= 2 ? 2 : 1]]) { const x = x0 + dx, y = y0 + dy; if (!protect(x, y) && isCloth(x, y)) p.set(x, y, uMix(p.get(x, y), TEAR_BLACK, 0.45)); } }
  // deshilachado del bajo (nivel 2): el borde inferior de la ropa del torso queda irregular
  if (lvl >= 2) for (let x = M.tx0; x <= R; x++) { if ((x * 7) % 3) continue; for (let y = legTop + 3; y >= legTop - 1; y--) if (isCloth(x, y) && !protect(x, y)) { if (!isCloth(x, y + 1)) { p.set(x, y, uMix(p.get(x, y), TEAR_BLACK, 0.5)); } break; } }
  // raspones rojos en la piel del cuerpo (no en la cara) y gotas
  let n = 0; const want = lvl === 1 ? 2 : 5; for (let y = ty; y < base - 1 && n < want; y++) for (let x = 0; x < W && n < want; x++) { if (!skin.has(p.get(x, y)) || ((x * 13 + y * 7) % 11)) continue; if (M.fem && y < ty + Math.ceil(th * 0.55) && x >= M.tx0 && x <= R) continue; p.set(x, y, TEAR_RED[1]); if (skin.has(p.get(x + 1, y + 1))) p.set(x + 1, y + 1, TEAR_RED[0]); n++; }
  if (lvl >= 2) { const drops = [[M.tx0 + 1, Math.min(base - 2, legTop + 2)], [R - 1, ty + th - 1]]; for (const [x, y] of drops) if (uA(p.get(x, y)) && !protect(x, y)) p.set(x, y, TEAR_RED[2]); } }
{ const _dh = drawHero; drawHero = function (p, L) { const r = _dh.apply(this, arguments); try { if (L && L.tear) tearApply(p, L); } catch (e) { } return r; }; }
{ const _hk = heroKey; heroKey = function () { const k = _hk.apply(this, arguments); return TEAR_CUR ? k + '|tr' + TEAR_CUR : k; }; }
{ const _hl = heroLook; heroLook = function () { const L = _hl.apply(this, arguments); if (L && TEAR_CUR) L.tear = TEAR_CUR; return L; }; }
{ const _pa = playerAtlas; playerAtlas = function (P) { TEAR_CUR = (P && P === G.P && SETTINGS.tear !== false) ? (P.tear | 0) : 0; try { return _pa.apply(this, arguments); } finally { TEAR_CUR = 0; } }; }
{ const _ra = remoteAtlas; remoteAtlas = function (r) { TEAR_CUR = (r && SETTINGS.tear !== false) ? (r.tear | 0) : 0; try { return _ra.apply(this, arguments); } finally { TEAR_CUR = 0; } }; }
// el nivel de rotura sigue a tu vida
V33_TICKS.push(() => { const P = G.P; if (!P || !P.S || !P.S.maxhp) return; const f = P.dead ? 0 : P.hp / P.S.maxhp, cur = P.tear | 0; let lvl = cur;
  if (f < 0.25) lvl = 2; else if (f < 0.5) lvl = Math.max(cur, 1) === 2 && f < 0.32 ? 2 : 1; else if (f >= 0.6) lvl = 0; else lvl = cur;
  if (P.dead || P.downed) lvl = cur; if (lvl !== cur) { P.tear = lvl; P.atlas = playerAtlas(P); uiDirty.hud = true; netPresence(true); } });
{ const _ep = extraPresence; extraPresence = function (o) { const r = _ep.apply(this, arguments); if (G.P && G.P.tear) o.tr = G.P.tear; return r; }; }
{ const _er = extraRecv; extraRecv = function (r, pr) { _er.apply(this, arguments); const t = clamp((pr.tr | 0), 0, 2); if ((r.tear | 0) !== t) { r.tear = t; try { r.atlas = remoteAtlas(r); } catch (e) { } } }; }
