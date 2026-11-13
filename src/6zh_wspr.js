// ================= ARMAS REDISEÑADAS con los sprites de Sergio: tiers 1-18, espadas con estilo y las 4 legendarias =================
// iconos 16x16 del inventario, arma en la mano (rotada), animación de ataque en 3 tiempos e impacto sobre el enemigo. El daño no cambia.
const WSPR_PIX = {};
function wsprPix(b64) { const s = atob(b64), u8 = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i); const p = new Pix(16, 16); p.d = new Uint32Array(u8.buffer); return p; }
for (const k in WSPR_ICON) WSPR_PIX[k] = wsprPix(WSPR_ICON[k]);
WSPR_PIX.solar = wsprPix(WSPR_SOLAR_ICON);
const WSPR_IMG = {}; for (const t in WSPR_ATLAS) { const im = new Image(); im.src = WSPR_ATLAS[t]; WSPR_IMG[t] = im; } { const im = new Image(); im.src = WSPR_SOLAR; WSPR_IMG.solar = im; }
// v3.5: sprites por id de objeto (tiers 7-15, espadas con estilo, legendarias)
const WSPR2_PIX = {}; for (const k in WSPR2_ICON) WSPR2_PIX[k] = wsprPix(WSPR2_ICON[k]);
for (const g in WSPR2_ATLAS) { const im = new Image(); im.src = WSPR2_ATLAS[g]; WSPR_IMG['g_' + g] = im; }
const WSPR_ROW = { guerrero: 0, mago: 1, arquero: 2, asesino: 3, bardo: 4, invocador: 5, pez: 6 };
const WSPR_SOLAR_ID = (Object.values(ITEMS).find(i => i.ws === 'solar') || {}).id;
// iconos de inventario
for (const cls in WSPR_ROW) for (let t = 1; t <= 6; t++) { const it = ITEMS[`w_${cls}_${t}`]; if (it && WSPR_PIX[`${cls}_${t}`]) it.icon = ['wspr', cls, t]; }
if (WSPR_SOLAR_ID) ITEMS[WSPR_SOLAR_ID].icon = ['wspr', 'solar', 0];
for (const id in WSPR2_PIX) if (ITEMS[id]) ITEMS[id].icon = ['wspr', 'id', id];
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'wspr') return _gi(spec); const src = spec[1] === 'solar' ? WSPR_PIX.solar : spec[1] === 'id' ? WSPR2_PIX[spec[2]] : WSPR_PIX[`${spec[1]}_${spec[2]}`]; const p = new Pix(16, 16); if (src) p.d.set(src.d); return p; }; }
// arma en la mano: el sprite del icono rotado hacia donde apunta el arma
const WSPR_PIVOT = { sword: [3.5, 12.5], staff: [4.5, 11.5], scythe: [3.5, 12.5], lute: [5.5, 10.5] };
function drawSpriteRot(p, src, hx, hy, ang, piv) {
  const ca = Math.cos(ang), sa = Math.sin(ang), r2 = Math.SQRT1_2;
  for (let y = Math.floor(hy - 18); y <= hy + 18; y++) for (let x = Math.floor(hx - 18); x <= hx + 18; x++) {
    const dx = x + 0.5 - hx, dy = y + 0.5 - hy, along = dx * ca + dy * sa, perp = -dx * sa + dy * ca;
    if (along < -7 || along > 17 || perp < -7 || perp > 7) continue;
    const sx = Math.floor(piv[0] + along * r2 + perp * r2), sy = Math.floor(piv[1] - along * r2 + perp * r2);
    if (sx < 0 || sy < 0 || sx > 15 || sy > 15) continue; const c = src.d[sy * 16 + sx]; if (uA(c) > 100) p.set(x, y, c);
  }
}
function wsprForWeapon(W) {
  if (!W || !W.k) return null;
  if (W.ws === 'solar') return { pix: WSPR_PIX.solar, piv: WSPR_PIVOT.sword };
  if (W.ws) { const pix = WSPR2_PIX['ws_' + W.ws]; return pix ? { pix, piv: WSPR_PIVOT.sword } : null; }
  if (W.leg) { const id = { dawn: 'lw_guerrero', eclipse: 'lw_mago' }[W.leg], pix = id && WSPR2_PIX[id]; return pix ? { pix, piv: W.leg === 'dawn' ? WSPR_PIVOT.sword : WSPR_PIVOT.staff } : null; }
  if (!WSPR_PIVOT[W.k]) return null; const t = W.tier | 0; if (t < 1 || t > 18) return null;
  const cls = { sword: 'guerrero', staff: 'mago', scythe: 'invocador', lute: 'bardo' }[W.k]; const pix = t <= 6 ? WSPR_PIX[`${cls}_${t}`] : WSPR2_PIX[`w_${cls}_${t}`]; return pix ? { pix, piv: WSPR_PIVOT[W.k] } : null;
}
{ const _dw = drawWeapon; drawWeapon = function (p, W, hx, hy, ang, phase) { const S = wsprForWeapon(W); if (!S) return _dw(p, W, hx, hy, ang, phase); drawSpriteRot(p, S.pix, hx, hy, ang, S.piv); }; }
// ---------- efectos de ataque: preparación → ataque 1 → ataque 2 → ataque 3 → impacto ----------
function wsprSetItem(it) {
  if (!it) return null;
  if (it.id === WSPR_SOLAR_ID) return { img: 'solar', row: 0 };
  const r2 = WSPR2_ROW[it.id]; if (r2) return { img: 'g_' + r2[0], row: r2[1], bow: it.cls === 'arquero' };
  const t = it.tier | 0, row = WSPR_ROW[it.cls]; if (it.ws || it.leg || t < 1 || t > 6 || row === undefined || !WSPR_IMG[t]) return null; return { img: t, row, bow: row === 2 };
}
function wsprSet(P) { const w = P && P.equip && P.equip.weapon; return wsprSetItem(w && ITEMS[w.id]); }
function wsprCell(set, col, cx, cy, sc, alpha, ang, flip, X) {
  const im = WSPR_IMG[set.img]; if (!im || !im.complete || !im.naturalWidth) return; const C2 = X || ctx;
  C2.save(); C2.globalAlpha = alpha; C2.translate(Math.round(cx), Math.round(cy)); if (flip) C2.scale(-1, 1); if (ang) C2.rotate(ang); C2.scale(sc, sc);
  C2.drawImage(im, col * WSPR_CW, set.row * WSPR_CH, WSPR_CW, WSPR_CH, -WSPR_CW / 2, -WSPR_CH / 2, WSPR_CW, WSPR_CH); C2.restore();
}
{ const _df = drawFx; drawFx = function (f, cx, cy) {
  if (f.type !== 'wspr') return _df(f, cx, cy);
  const k = f.t / f.dur, x = f.x - cx, y = f.y - cy;
  if (f.hit) { wsprCell(f.set, 4, x, y, 0.7 + k * 0.5, Math.min(1, (1 - k) * 1.6), 0, false); return; }
  const col = f.bow ? (k < 0.5 ? 0 : 1) : k < 0.18 ? 0 : k < 0.42 ? 1 : k < 0.66 ? 2 : 3, flip = Math.cos(f.ang) < 0, a = flip ? Math.PI - f.ang : f.ang;
  const fwd = f.bow ? 6 : 12, ox = Math.cos(f.ang) * fwd, oy = Math.sin(f.ang) * fwd * 0.7;
  wsprCell(f.set, col, x + ox, y + oy, 0.95, k > 0.8 ? (1 - k) * 5 : 1, flip ? -(a * 0.6) : a * 0.6, flip);
}; }
let WSPR_WIN = { until: 0, set: null }, WSPR_HITT = new WeakMap();
{ const _ba = basicAttack; basicAttack = function () {
  const P = G.P, cd0 = P ? P.atkCd : 0; const r = _ba.apply(this, arguments);
  if (!P || P.atkCd <= cd0 || P.dead) return r; const set = wsprSet(P); if (!set) return r;
  const tg = P.target && !P.target.dying ? P.target : null, ang = tg ? Math.atan2(tg.y - P.y, tg.x - P.x) : Math.atan2(DIRV[P.dir][1], DIRV[P.dir][0]);
  const bow = CLASSES[P.cls] && CLASSES[P.cls].weapon === 'bow';
  addFx({ type: 'wspr', set, x: P.x, y: P.y - 10, ang, dur: bow ? 0.18 : 0.26, bow });
  WSPR_WIN = { until: G.t + 0.45, set, bow, owner: P };
  return r; }; }
// las flechas del arco usan el sprite de la flecha con estela
{ const _sp = spawnProj; spawnProj = function (owner, x, y, ang, o) { const e = _sp(owner, x, y, ang, o); if (e && owner === 'p' && G.t < WSPR_WIN.until && !(o && o.kidShot)) e.wspr = WSPR_WIN.set; return e; }; }
{ const _dp = drawProj; drawProj = function (e, cx, cy) {
  if (!e.wspr || !e.wspr.bow) return _dp(e, cx, cy);
  const flip = Math.cos(e.ang) < 0, a = flip ? Math.PI - e.ang : e.ang; wsprCell(e.wspr, 3, e.x - cx - Math.cos(e.ang) * 14, e.y - cy - (e.z || 12) - Math.sin(e.ang) * 6, 0.75, 1, flip ? -a : a, flip);
}; }
// impacto sobre el enemigo
{ const _hm = hitMob; hitMob = function (m, dmg, src) {
  const r = _hm.apply(this, arguments); let set = null;
  if (src && src.wspr) set = src.wspr; else if (G.t < WSPR_WIN.until && !WSPR_WIN.bow && !(src && (src.kid || src.kidShot || src.summon))) set = WSPR_WIN.set;
  if (set && m && !m.ghostSkip) { const last = WSPR_HITT.get(m) || -9; if (G.t - last > 0.12) { WSPR_HITT.set(m, G.t); addFx({ type: 'wspr', hit: 1, set, x: m.x, y: m.y - 12, ang: 0, dur: 0.22 }); } }
  return r; }; }
// enciclopedia: vista previa animada del ataque del arma (preparación → ataque 1 → 2 → 3 → impacto)
let ENC_WSPR = null;
{ const _re = renderEncyclo; renderEncyclo = function (B) {
  _re(B); ENC_WSPR = null; if (encTab !== 'weapons') return; const h = B.querySelector('.encdet .ehead'); if (!h) return;
  const list = encGearList('weapons'), sel = ITEMS[encSel] && list.includes(ITEMS[encSel]) ? ITEMS[encSel] : list[0], set = wsprSetItem(sel); if (!set) return;
  h.insertAdjacentHTML('afterend', '<div class="encwspr"><canvas id="encWspr" width="' + WSPR_CW * 3 + '" height="' + WSPR_CH * 3 + '"></canvas><small>Animación de ataque</small></div>'); ENC_WSPR = { set, t: 0 };
}; }
{ const _uh = updateHUD; updateHUD = function (dt) { _uh(dt); if (!ENC_WSPR) return; const c = document.getElementById('encWspr'); if (!c) { ENC_WSPR = null; return; }
  ENC_WSPR.t += dt; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, c.width, c.height);
  const col = Math.floor(ENC_WSPR.t / 0.22) % 6; if (col < 5) wsprCell(ENC_WSPR.set, col, c.width / 2, c.height / 2, 3, 1, 0, false, x);
}; }
