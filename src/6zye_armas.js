// ================= v4.13: ARMAS NUEVAS DE TIER 1-6 (de la hoja de cobre de Sergio) =================
// Datos en 6zyd_armas_data.js (tools/dev/armas.py). Cobre es su dibujo; madera, hierro, acero, plata y oro cambian
// los colores del metal. Cada clase tiene: icono 16x16, arma en la mano (16 px; en HD se dibuja la de 32 px),
// animación de ataque en 5 tiempos (preparación, 3 golpes e impacto) en un atlas al doble para que se vea fino en HD.
// Las dagas y las aletas del pez van una en cada mano. El daño no cambia.
const ARM_K = { sword: 'guerrero', staff: 'mago', bow: 'arquero', dagger: 'asesino', lute: 'bardo', scythe: 'invocador', fin: 'pez' };
const ARM_PIX = {}, ARM_HPIX = {}, ARM_HDP = {}, ARM_PIVK16 = {}, ARM_PIVK32 = {};   // agarre propio por arma (tiers 22+)
for (const k in ARM_ICON) ARM_PIX[k] = wsprPix(ARM_ICON[k]);
for (const k in ARM_HAND) ARM_HPIX[k] = wsprPix(ARM_HAND[k]);
function armPixFromImg(im) { const c = mkCanvas(im.width, im.height), x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, im.width, im.height); const p = new Pix(im.width, im.height); p.d = new Uint32Array(d.data.buffer.slice(0)); return p; }
for (const k in ARM_HD) { const im = new Image(); im.onload = () => { try { ARM_HDP[k] = armPixFromImg(im); } catch (e) { } }; im.src = ARM_HD[k]; }
for (const t in ARM_ATLAS) { const im = new Image(); im.src = ARM_ATLAS[t]; WSPR_IMG['arm' + t] = im; }
// aletas del pez de tier 7+: el dibujo de cobre con los colores del tier
function armRecolorPix(src, ramp) {
  const p = new Pix(src.w, src.h); let lo = 255, hi = 0; const L = c => uR(c) * 0.3 + uG(c) * 0.59 + uB(c) * 0.11;
  const cu = c => { if (uA(c) < 40) return false; const r = uR(c), g = uG(c), b = uB(c), mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx > 40 && r === mx && (mx - mn) / mx > 0.22 && b < g; };
  for (const c of src.d) if (cu(c)) { const l = L(c); lo = Math.min(lo, l); hi = Math.max(hi, l); }
  for (let i = 0; i < src.d.length; i++) { const c = src.d[i]; if (!cu(c)) { p.d[i] = c; continue; } const k = Math.max(0, Math.min(1, (L(c) - lo) / Math.max(1, hi - lo))) * 4, j = Math.min(3, k | 0); p.d[i] = uMix(ramp[j], ramp[j + 1], k - j); }
  return p;
}
function armKey(W) { if (!W || !W.k || W.ws || W.leg) return null; const cls = ARM_K[W.k], t = W.tier | 0; if (!cls || t < 1) return null; if (t <= 6 || t >= 22) return ARM_HPIX[cls + '_' + t] ? cls + '_' + t : null; return cls === 'pez' && TIERP[t] ? 'pez_' + t : null; }
function armHand(key) { if (!ARM_HPIX[key] && key.startsWith('pez_')) ARM_HPIX[key] = armRecolorPix(ARM_HPIX.pez_2, TIERP[+key.slice(4)]); return ARM_HPIX[key]; }
function armHD(key) { if (!ARM_HDP[key] && key.startsWith('pez_') && ARM_HDP.pez_2) ARM_HDP[key] = armRecolorPix(ARM_HDP.pez_2, TIERP[+key.slice(4)]); return ARM_HDP[key]; }
// iconos del inventario
for (const cls of WSPR_CLS) for (let t = 1; t <= 6; t++) { const it = ITEMS[`w_${cls}_${t}`]; if (it && ARM_PIX[`${cls}_${t}`]) it.icon = ['arm', cls, t]; }
{ const _gi = genIcon; genIcon = function (spec) { if (spec[0] !== 'arm') return _gi(spec); const p = new Pix(16, 16), s = ARM_PIX[spec[1] + '_' + spec[2]]; if (s) p.d.set(s.d); return p; }; }
// ---- arma en la mano: sprite girado alrededor del punto de agarre (el eje del sprite apunta arriba a la derecha) ----
function armRot(p, src, piv, hx, hy, ang, ok) {
  const ca = Math.cos(ang), sa = Math.sin(ang), r2 = Math.SQRT1_2, R = Math.ceil(Math.hypot(src.w, src.h)) + 1;
  for (let y = Math.floor(hy - R); y <= hy + R; y++) for (let x = Math.floor(hx - R); x <= hx + R; x++) {
    if (x < 0 || y < 0 || x >= p.w || y >= p.h) continue;
    const dx = x + 0.5 - hx, dy = y + 0.5 - hy, along = dx * ca + dy * sa, perp = -dx * sa + dy * ca;
    const sx = Math.floor(piv[0] + along * r2 + perp * r2), sy = Math.floor(piv[1] - along * r2 + perp * r2);
    if (sx < 0 || sy < 0 || sx >= src.w || sy >= src.h) continue; const c = src.d[sy * src.w + sx]; if (uA(c) <= 100) continue;
    if (ok && !ok(y * p.w + x)) continue; p.set(x, y, c);
  }
}
let ARM_REC = null;   // mientras se construye un fotograma HD: armas que se dibujan después a 32 px
{ const _dw = drawWeapon; drawWeapon = function (p, W, hx, hy, ang, phase) {
  const key = armKey(W); if (!key) return _dw(p, W, hx, hy, ang, phase);
  const cls = key.split('_')[0], src = armHand(key); if (!src) return _dw(p, W, hx, hy, ang, phase);
  if (ARM_REC && p.t && armHD(key)) { const tg = p.tg; p.tg = 10; armRot(p, src, ARM_PIVK16[key] || ARM_PIV16[cls], hx, hy, ang); p.tg = tg; ARM_REC.push({ key, cls, hx, hy, ang }); return; }
  armRot(p, src, ARM_PIVK16[key] || ARM_PIV16[cls], hx, hy, ang);
}; }
// fotograma HD: igual que antes, y al final el arma a 32 px solo donde el arma de 16 px se veía (o en el aire / el contorno)
hdBuild = function (A, col, row) {
  const [a, f] = hdFrameOf(A, col), dir = DIRS[row], L = A.hdL, FW = A.fw, FH = A.fh, X = A.hdX;
  if (a === 'dead') { X.imageSmoothingEnabled = false; X.drawImage(A.img, col * FW, row * FH, FW, FH, col * FW * 2, row * FH * 2, FW * 2, FH * 2); return; }
  const mirror = dir === 'right' && L.mirror !== false, p = new Pix(FW, FH); p.t = new Uint8Array(FW * FH); p.tg = 0;
  const rec = ARM_REC = []; try { A.hdDraw(p, L, mirror ? 'left' : dir, a, f); } finally { ARM_REC = null; }
  p.outline(OUTL, false);
  const q = hdDetail(p, A.hdMats); hdOrn(q, p, L);
  if (L.top?.modaStyle !== undefined) modaDressplate(q, p.meta, L.top.modaStyle, L);
  for (const r of rec) { const src = armHD(r.key); if (!src) continue; armRot(q, src, ARM_PIVK32[r.key] || ARM_PIV32[r.cls], r.hx * 2, r.hy * 2, r.ang, i => !uA(q.d[i]) || q.t[i] === 10 || q.t[i] === 0); }
  if (mirror) q.flipX();
  q.toCtx(X, col * FW * 2, row * FH * 2);
};
// el pez lleva sus aletas en las manos
{ const _hl = heroLook; heroLook = function (cls, app, gear, ...a) { const L = _hl(cls, app, gear, ...a); if (cls === 'pez' && !L.weapon) { const t = (gear && gear.weapon) | 0; if (t > 0) L.weapon = { k: 'fin', tier: t, dual: 1 }; } return L; }; }
// ---- efectos de ataque: atlas nuevo (celdas de ARM_CW x ARM_CH al doble) ----
{ const _ws = wsprSetItem; wsprSetItem = function (it) {
  if (it && !it.ws && !it.leg && it.id !== WSPR_SOLAR_ID) { const t = it.tier | 0, row = WSPR_ROW[it.cls]; if (t >= 1 && (t <= 6 || t >= 22) && row !== undefined && WSPR_IMG['arm' + t]) return { img: 'arm' + t, row, bow: row === 2, cw: ARM_CW, ch: ARM_CH, s: 2 }; }
  return _ws(it); }; }
{ const _wc = wsprCell; wsprCell = function (set, col, cx, cy, sc, alpha, ang, flip, X) {
  if (!set || !set.cw) return _wc(set, col, cx, cy, sc, alpha, ang, flip, X);
  const im = WSPR_IMG[set.img]; if (!im || !im.complete || !im.naturalWidth) return; const C2 = X || ctx, cw = set.cw, ch = set.ch, s = set.s;
  C2.save(); C2.globalAlpha = alpha; C2.translate(Math.round(cx), Math.round(cy)); if (flip) C2.scale(-1, 1); if (ang) C2.rotate(ang); C2.scale(sc, sc);
  C2.drawImage(im, col * cw * s, set.row * ch * s, cw * s, ch * s, -cw / 2, -ch / 2, cw, ch); C2.restore();
}; }
{ const _re = renderEncyclo; renderEncyclo = function (B) { _re(B); if (ENC_WSPR && ENC_WSPR.set.cw) { const c = document.getElementById('encWspr'); if (c) { c.width = ENC_WSPR.set.cw * 3; c.height = ENC_WSPR.set.ch * 3; } } }; }
// el ataque del pez no guarda las aletas: golpea con ellas hacia delante
{ const _hp = heroPose; heroPose = function (dir, anim, f, L) { const ps = _hp(dir, anim, f, L); if (L && L.pez && anim === 'atk' && L.weapon && L.weapon.k === 'fin') { ps.noWeapon = 0; if (ps.wang == null) ps.wang = { down: 1.2, up: -1.9, left: 2.6, right: 0.5 }[dir] + (f === 1 ? -0.5 : f === 2 ? 0.4 : 0); } return ps; }; }
