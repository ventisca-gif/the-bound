// 6.18 · Smoker más difícil, su botín y la Fruta Humo Humo.
// Sergio: «Smoker debería ser el jefe más difícil con ese nivel y que tenga drops: parte de su ropa (adaptada a los
// cuerpos), con pity y probabilidad; su arma (un bastón raro) la más fuerte por ahora, todas las clases con animación y
// VFX; 1 % de su fruta (Humo Humo); en la pelea 10 s de logia; la fruta también sale por todo Dawn; 4 habilidades:
// puño de humo, logia 10 s, el cuerpo de humo que hace daño, combinaciones… según tu nivel y tu poder».
// Ropa: chaqueta blanca abierta con cuello y puños de pelo verde y guantes marrones, vaquero azul y botas altas de cordones.

// ---------- humo dibujado como en el anime: nubes infladas en 4 pasadas (contorno, sombra, cuerpo y brillo) y rizos ----------
// smokeCloud(bolas, alfa): cada bola [x, y, r] en pantalla. Se dibujan juntas para que el contorno solo quede por fuera.
const SMK = { line: '#76829a', shade: '#a9b4c6', body: '#e6ebf1', light: '#ffffff', curl: '#b9c3d2' };
function smokeCloud(balls, a, curls) {
  if (!balls.length || a <= 0.01) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, a);
  const pass = (col, dr, ox, oy, k) => { ctx.fillStyle = col; ctx.beginPath(); for (const [x, y, r] of balls) { const R = Math.max(0.5, r * k + dr); ctx.moveTo(x + ox + R, y + oy); ctx.arc(x + ox, y + oy, R, 0, 7); } ctx.fill(); };
  pass(SMK.line, 1.2, 0, 0, 1); pass(SMK.shade, 0, 0.6, 0.9, 1); pass(SMK.body, 0, -0.4, -0.7, 0.86);
  ctx.fillStyle = SMK.light; ctx.beginPath(); for (const [x, y, r] of balls) if (r > 3) { const R = r * 0.36; ctx.moveTo(x - r * 0.32 + R, y - r * 0.38); ctx.arc(x - r * 0.32, y - r * 0.38, R, 0, 7); } ctx.fill();
  if (curls !== false) { ctx.strokeStyle = SMK.curl; ctx.lineWidth = 1; ctx.beginPath();
    balls.forEach(([x, y, r], i) => { if (r < 6 || i % 2) return; const a0 = (i * 1.7) % 6.28; ctx.moveTo(x + Math.cos(a0) * r * 0.45, y + Math.sin(a0) * r * 0.45); ctx.arc(x, y + r * 0.08, r * 0.45, a0, a0 + 3.6); }); ctx.stroke(); }
  ctx.restore();
}
// bolas de una nube que respira alrededor de (x, y): n bolas en un óvalo de ancho w y alto h
function smokeBlob(x, y, w, h, n, r, t, seed) {
  const out = []; seed = seed || 0;
  for (let i = 0; i < n; i++) { const a = i / n * 6.283 + seed, wob = Math.sin(t * 2.4 + i * 1.3 + seed) * 0.12;
    out.push([x + Math.cos(a) * w * (0.55 + 0.25 * Math.sin(i * 2.1 + seed)), y + Math.sin(a) * h * 0.55, r * (0.75 + 0.35 * ((i * 37 + seed * 11) % 7) / 7 + wob)]); }
  out.push([x, y, r * 1.15]); return out;
}
// estela: bolas a lo largo de una línea (de (x0,y0) a (x1,y1)) que crecen hacia el final
function smokeTrail(x0, y0, x1, y1, n, r0, r1, t, seed) {
  const out = []; for (let i = 0; i <= n; i++) { const k = i / n, w = Math.sin(t * 5 + i * 1.7 + (seed || 0)) * 2.2;
    out.push([x0 + (x1 - x0) * k - (y1 - y0) / Math.hypot(x1 - x0 || 1, y1 - y0) * w, y0 + (y1 - y0) * k + (x1 - x0) / Math.hypot(x1 - x0 || 1, y1 - y0) * w, r0 + (r1 - r0) * k]); }
  return out;
}
function smokeFx(x, y, w, h, n, r, dur, o) {
  o = o || {}; addFx({ type: 'custom', x, y, dur, ground: !!o.ground, draw: (f, sx, sy, k) => {
    const grow = 0.6 + 0.6 * Math.min(1, k * 2.5), up = (o.rise || 0) * k;
    smokeCloud(smokeBlob(sx, sy - up, w * grow, h * grow, n, r * grow, f.t, f.seed), (o.a || 0.95) * (1 - Math.max(0, (k - 0.55) / 0.45))); }, seed: Math.random() * 6 });
}

// ---------- 1) Smoker: el jefe más difícil de su nivel ----------
// Arlong (605): vida 68, ataque 4,3, defensa 3,85, reto ×2,03. Shanks (600): 80 / 4,4 / 4,0.
Object.assign(BOSSES.logue_arc_smoker, { hp: 84, atk: 4.5, def: 4.05, spd: 92 });
if (typeof DAWN_RETO === 'object') DAWN_RETO.logue_arc_smoker = 2.15;
const SM_LOGIA_S = 10;
const smIsBoss = m => m && m.mid === 'logue_arc_smoker' && !m.dying;
function smLogiaOn(m) { return smIsBoss(m) && (m.smLogiaUntil || 0) > G.t; }
// al bajar al 66 % y al 33 % se vuelve humo 10 s: los golpes lo atraviesan y suelta anillos de humo
hookBefore('updateBoss', (m) => {
  if (!smIsBoss(m)) return;
  const k = m.hp / m.maxhp;
  if ((!m.smL1 && k < 0.66) || (!m.smL2 && k < 0.33)) {
    if (k < 0.33) m.smL2 = 1; m.smL1 = 1; m.smLogiaUntil = G.t + SM_LOGIA_S; m.smRing = G.t + 1.2;
    shellsRescueSpeak(m, '¡Logia! Mientras sea humo, no me tocas.', 'Logia! While I’m smoke, you can’t touch me.');
    banner('💨 ' + L2('Smoker se vuelve humo', 'Smoker turns into smoke'), L2('10 s: los golpes lo atraviesan. ¡Aléjate de los anillos!', '10 s: attacks pass through him. Stay away from the rings!'));
    burst(m.x, m.y - 20, 30, { sp: 90, up: 30, life: 0.7, c: ['#f0f4f6', '#c8d0d8', '#ffffff'] });
  }
  if (smLogiaOn(m) && G.t > (m.smRing || 0)) {
    m.smRing = G.t + 1.6; const x = m.x, y = m.y, r = 74;
    telegraph({ shape: 'circle', x, y, r, dur: 0.7, col: '#e8eef055' });
    addFx({ type: 'custom', x, y: y - 6, dur: 1.2, draw: (f, sx, sy, k) => {
      if (f.t < 0.7) return; const q = (f.t - 0.7) / 0.5;
      const ring = []; for (let i = 0; i < 16; i++) { const an = i * 0.393 + q; ring.push([sx + Math.cos(an) * r * (0.55 + q * 0.45), sy + Math.sin(an) * r * 0.55 * (0.55 + q * 0.45), 7 + q * 5 + (i % 3) * 1.5]); }
      smokeCloud(ring, 0.95 * (1 - q * q));
      if (!f.fired) { f.fired = true; const P = G.P, A = G.map && G.map.logueArc; if (!A || m.dying || m.remove) return;
        if (!P.dead && dist2(P.x, P.y, x, y) < r * r) hurtPlayer(m.atk * 0.8, { lv: m.lv, dawnReto: m });
        for (const e of A.crew || []) if (e.hp > 0 && dist2(e.x, e.y, x, y) < r * r) shellsHurtAlly(e, m.atk * 0.5, m.lv); }
    } });
  }
});
hookBefore('hitMob', (m) => {
  if (!smLogiaOn(m)) return;
  if (!m.smMissT || G.t - m.smMissT > 0.5) { m.smMissT = G.t; floatText(m.x, m.y - 56, L2('LOGIA', 'LOGIA'), '#e8eef0'); burst(m.x, m.y - 24, 6, { sp: 50, up: 20, life: 0.4, c: ['#f0f4f6', '#c8d0d8'] }); }
  return HOOK_SKIP;
});
// humo alrededor de Smoker mientras es logia
DL_HOOKS.push((list, cx, cy) => {
  const A = G.map && G.map.logueArc, m = A && A.boss; if (!smLogiaOn(m)) return;
  list.push({ type: 'xdraw', x: m.x, y: m.y + 3, noShadow: true, draw: () => {
    const x = m.x - cx, y = m.y - cy, left = Math.max(0, m.smLogiaUntil - G.t) / SM_LOGIA_S;
    ctx.save();
    smokeCloud(smokeBlob(x, y - 8, 26, 14, 9, 8, G.t, 1), 0.9);                       // las piernas son humo
    smokeCloud(smokeBlob(x + Math.sin(G.t * 1.3) * 6, y - 40, 20, 26, 8, 6, G.t, 3), 0.42);   // el cuerpo humea
    for (let i = 0; i < 3; i++) { const k = (G.t * 0.7 + i / 3) % 1; smokeCloud(smokeBlob(x + Math.sin(i * 2 + G.t) * 10, y - 56 - k * 40, 8 + k * 8, 6 + k * 6, 5, 4 + k * 4, G.t, i), 0.6 * (1 - k)); }
    ctx.fillStyle = 'rgba(20,24,32,.6)'; ctx.fillRect(x - 15, y - 78, 30, 3); ctx.fillStyle = '#e8eef0'; ctx.fillRect(x - 15, y - 78, Math.round(30 * left), 3);
    ctx.restore();
  } });
});

// ---------- 2) ropa de Smoker (cosméticos que se adaptan a las 10 estructuras) ----------
const SMR = {
  blanco: P5(['#8e949c', '#bcc2c8', '#dfe3e6', '#f1f3f4', '#ffffff']),
  pelo: [C('#1a3420'), C('#28492c'), C('#3a6340'), C('#527d52'), C('#6f9a68')],
  forro: [C('#1c2850'), C('#2c3e76')],
  guante: [C('#3a2614'), C('#5a3c22'), C('#7a5632')],
  cinto: [C('#3a2416'), C('#5e3e24')], hebilla: C('#d8b860'),
  puro: [C('#6a4426'), C('#94643a'), C('#e8e4dc')],
  vaquero: P5(['#10182e', '#1a2748', '#253866', '#344c84', '#4c66a2']),
  bota: P5(['#22170e', '#3a281a', '#523a26', '#6c5036', '#88684a']),
  top: [C('#141c34'), C('#1e2a4c')]
};
const smSkin = (A, s) => { const S = (s && s.sk) || A.sk || SKINS[0]; return Array.from(S).map(c => typeof c === 'string' ? C(c) : c); };
const smFur = (p, x, y, k) => p.set(x, y, SMR.pelo[1 + ((x * 3 + y + k) % 4 === 0 ? 2 : (x + y) % 3 === 0 ? 0 : 1)]);
// --- chaqueta blanca abierta: pecho al aire (en mujer, un top azul), borde azul, cuello de pelo verde y cinturón ---
fitKind('body', 'sm_chaqueta', (p, A, s) => {
  const { tx0, tw, torsoTop: ty, th, cx, side, up, d, fem } = A, m = s.m, S = smSkin(A, s), R = tx0 + tw - 1, waist = ty + th - 1;
  for (let y = ty + 1; y < waist; y++) { p.set(tx0, y, m[side ? 2 : 3]); p.set(R, y, m[1]); }
  if (up) {
    for (let y = ty + 2; y < waist - 1; y++) p.set(Math.round(cx - 0.5), y, m[2]);
    for (let x = tx0 - 1; x <= R + 1; x++) { smFur(p, x, ty - 1, 0); smFur(p, x, ty, 1); }
  } else if (side) {
    const fx = Math.round(cx + d * (tw / 2 - 1));
    for (let y = ty + 1; y < waist; y++) { p.set(fx, y, fem && y < ty + Math.round(th * 0.55) ? SMR.top[1] : S[y % 2 ? 2 : 1]); p.set(fx - d, y, SMR.forro[1]); }
    p.set(fx, waist - 1, SMR.cinto[1]); p.set(fx - d, waist - 1, SMR.cinto[0]);
    for (let k = 0; k < 4; k++) { smFur(p, cx - d * (k - 1), ty - 1, k); smFur(p, cx - d * (k - 1), ty, k + 1); }
  } else {
    const hw = Math.max(1, Math.round(tw * 0.17));
    for (let y = ty + 1; y < waist; y++) {
      for (let x = Math.round(cx - hw - 0.5); x <= Math.round(cx + hw - 0.5); x++) {
        let c = S[2];
        if (fem && y < ty + Math.round(th * 0.6)) c = SMR.top[(x + y) % 3 ? 1 : 0];
        else if (!fem && y > ty + 2 && (y - ty) % 2 === 1) c = S[1];          // abdominales
        else if (!fem && x === Math.round(cx - 0.5) && y > ty + 2) c = S[1];
        p.set(x, y, c);
      }
      p.set(Math.round(cx - hw - 1.5), y, SMR.forro[1]); p.set(Math.round(cx + hw + 0.5), y, SMR.forro[0]);
    }
    // cinturón con hebilla dorada en el hueco
    for (let x = Math.round(cx - hw - 0.5); x <= Math.round(cx + hw - 0.5); x++) p.set(x, waist - 1, SMR.cinto[x % 2]);
    p.set(Math.round(cx - 0.5), waist - 1, SMR.hebilla);
    // cuello de pelo verde, ancho y que baja por las solapas
    for (let x = tx0 - 1; x <= R + 1; x++) { smFur(p, x, ty - 1, 0); smFur(p, x, ty, 1); }
    for (let y = ty + 1; y < ty + Math.max(3, Math.round(th * 0.4)); y++) { smFur(p, Math.round(cx - hw - 2.5), y, 2); smFur(p, Math.round(cx + hw + 1.5), y, 3); }
    // dobladillo blanco con un adorno oscuro a cada lado
    p.set(tx0 + 1, waist, m[1]); p.set(R - 1, waist, m[1]);
  }
}, { skin: true });
// --- vaquero azul que se mete en botas altas: las últimas filas de la pierna son la caña de la bota con cordones ---
fitKind('legs', 'sm_vaquero', (p, A, s) => {
  const { legTop, base } = A, m = s.m, cols = new Set(m), B = SMR.bota;
  let last = -1; for (let y = legTop; y < base; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) last = y;
  if (last < 0) return; const cuff = Math.max(legTop + 2, last - 2);
  for (let y = legTop; y <= last; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; const k = m.indexOf(c);
    if (y >= cuff) { p.set(x, y, y === cuff ? B[3] : ((x + y) % 2 ? B[2] : B[1])); continue; }
    if (y === cuff - 1) p.set(x, y, m[Math.max(0, k - 1)]);    // vuelta del pantalón
    else if ((x * 5 + y * 3) % 11 === 0) p.set(x, y, m[Math.min(4, k + 1)]);   // brillo del vaquero
  }
});
// guantes marrones, puños de pelo verde y el cinturón de puros en el brazo izquierdo
hookAfter('drawHero', (r, p, L) => {
  const T = L && L.top; if (!T || T.k !== 'sm_chaqueta' || !p.t || !p.meta) return;
  const A = p.meta, M = T.m, rows = {};
  for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3 && M.indexOf(p.d[i]) >= 0) { const y = (i / p.w) | 0; (rows[y] = rows[y] || []).push(i); }
  const ys = Object.keys(rows).map(Number).sort((a, b) => b - a);
  if (!ys.length) return;
  ys.slice(0, 2).forEach((y, k) => { for (const i of rows[y]) p.d[i] = SMR.guante[k ? 2 : 1]; });
  if (ys[2] !== undefined) for (const i of rows[ys[2]]) smFur(p, i % p.w, ys[2], 0);
  if (!A.up) { const yb = A.torsoTop + 2;
    for (const y of [yb, yb + 1]) for (const i of rows[y] || []) { const x = i % p.w; if (A.side ? true : x < A.cx) p.d[i] = y === yb ? SMR.puro[(x % 2)] : SMR.puro[2]; } }
});
hookAfter('heroLook', (L) => {
  if (!L) return; const SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c);
  if (L.top && L.top.k === 'sm_chaqueta') L.top = Object.assign({}, L.top, { sk: SK });
});
const SM_SRC = L2('Smoker (arco de Loguetown, nivel 612): 25 % por victoria, segura a las 12', 'Smoker (Loguetown arc, level 612): 25% per win, guaranteed by the 12th');
cosm('c_sm_chaqueta', L2('Chaqueta del Cazador Blanco', 'White Hunter’s Jacket'), 'body', () => ({ k: 'sm_chaqueta', m: SMR.blanco, s: SMR.blanco }), { src: SM_SRC });
cosm('c_sm_vaquero', L2('Vaquero del Cazador Blanco', 'White Hunter’s Jeans'), 'legs', () => ({ k: 'sm_vaquero', m: SMR.vaquero, s: SMR.vaquero }), { src: SM_SRC });
cosm('c_sm_botas', L2('Botas de Cordones del Cazador Blanco', 'White Hunter’s Laced Boots'), 'feet', () => ({ k: 'boots', m: SMR.bota }), { src: SM_SRC });
const SM_COS = ['c_sm_chaqueta', 'c_sm_vaquero', 'c_sm_botas'];
for (const id of SM_COS) it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: 45000, icon: ['hanger'], rar: 5, d: L2('Cosmético de la ropa de Smoker. ', 'Cosmetic from Smoker’s clothes. ') + SM_SRC + '.' });

// ---------- 3) Jitte de Piedra Marina: el arma más fuerte (todas las clases) ----------
const SM_JITTE = 'w_sm_jitte';
const smJitteAtk = (() => { let best = 0; for (const it of Object.values(ITEMS)) if (it.t === 'weapon' && it.id !== SM_JITTE && Number.isFinite(it.atk)) best = Math.max(best, it.atk); return Math.round((best || 2361) * 1.05); })();
it(SM_JITTE, { n: L2('Jitte de Piedra Marina', 'Seastone Jitte'), t: 'weapon', slot: 'weapon', lv: 612, tier: 44, atk: smJitteAtk, price: 90000, icon: ['sm_jitte'], rar: 5, buggyClaws: true, smJitte: true,
  d: L2('Bastón largo de punta roma con una horquilla junto a la empuñadura. El arma más fuerte por ahora, para todas las clases (nivel 612). Cada golpe es un barrido con estela de humo; cada cuarto golpe, «Piedra Marina»: una estocada en línea (×1,9) que inmoviliza a los enemigos comunes.',
    'A long blunt staff with a fork by the grip. The strongest weapon so far, for every class (level 612). Each attack is a sweep with a smoke trail; every fourth attack, “Seastone”: a line thrust (×1.9) that pins ordinary enemies.') });
// icono (16 px) y arma en la mano (más larga)
function smJittePix(n) {
  const p = new Pix(n, n), S = [C('#5a6470'), C('#9aa6b0'), C('#d8e0e6'), C('#ffffff')], W = [C('#7a6a5a'), C('#cfc6b8')];
  const L = n - 3; for (let i = 0; i < L; i++) { const x = 2 + i, y = n - 3 - i; p.set(x, y, S[1]); p.set(x + 1, y, S[2]); if (i % 5 === 0) p.set(x, y - 1, S[3]); }
  for (let i = 0; i < Math.round(n * 0.25); i++) { const x = 2 + i, y = n - 3 - i; p.set(x, y, W[i % 2]); p.set(x + 1, y, W[(i + 1) % 2]); }   // mango con cinta
  const f = Math.round(n * 0.3); for (let i = 0; i < Math.round(n * 0.32); i++) p.set(2 + f + i + 1, n - 3 - f + 1 - i + 2, S[2]);   // horquilla
  p.set(n - 2, 1, S[3]); p.outline(OUTL, false); return p;
}
const SM_JITTE_ICON = smJittePix(16);   // drawSpriteRot solo lee sprites de 16 px
hookAround('genIcon', (next, spec) => spec && spec[0] === 'sm_jitte' ? SM_JITTE_ICON : next(spec));
hookAfter('gearTiers', (out, P) => { if (out && P && P.equip && P.equip.weapon && P.equip.weapon.id === SM_JITTE) { out.jit = 1; delete out.bcl; delete out.kcl; } });
hookAfter('cleanGear', (out, g) => { if (out && g && g.jit === 1) out.jit = 1; });
hookAfter('heroLook', (L, cls, app, gear) => { if (L && gear && gear.jit) L.weapon = { k: 'sm_jitte', tier: 44 }; });
hookAround('drawWeapon', (next, p, W, hx, hy, ang, phase) => { if (!W || W.k !== 'sm_jitte') return next(p, W, hx, hy, ang, phase); drawSpriteRot(p, SM_JITTE_ICON, hx, hy, ang, [4, 12]); });
function smSmokePuff(x, y, n, sp) { burst(x, y, Math.ceil(n / 2), { sp: sp || 40, up: 18, g: -10, life: 0.5, c: ['#eef2f4', '#c8d0d8', '#ffffff'] }); smokeFx(x, y, 7 + n, 5 + n / 2, 5, 3 + n / 3, 0.5, { rise: 10 }); }
function smJitteBasic(P, ang) {
  P.smJitN = (P.smJitN || 0) + 1; const M = G.map;
  if (P.smJitN % 4) {
    delayAct(0.07, () => { if (P.dead || G.map !== M) return;
      hitArc(P.x, P.y, ang, 56, 1.7, P.S.atk * 1.02, { kb: 16 });
      for (let i = -1; i <= 1; i++) addFx({ type: 'slash', x: P.x, y: P.y - 2 + i * 2, ang: ang + i * 0.1, arc: 1.7, r: 50 + i * 3, dur: 0.2, col: i ? 'rgba(232,238,242,0.75)' : '#dfe6ec' });
      smSmokePuff(P.x + Math.cos(ang) * 40, P.y + Math.sin(ang) * 40 - 8, 6); sfx('slash'); });
    return;
  }
  // Piedra Marina: estocada en línea que inmoviliza
  const Ln = 92, dx = Math.cos(ang), dy = Math.sin(ang), ox = P.x, oy = P.y; P.busy = Math.max(P.busy || 0, 0.28);
  floatText(P.x, P.y - 44, L2('Piedra Marina', 'Seastone'), '#dfe8ee'); sfx('swing');
  addFx({ type: 'custom', x: ox, y: oy - 10, dur: 0.38, draw: (f, sx, sy, k) => { ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang);
    const len = Ln * Math.min(1, k * 2.4); ctx.fillStyle = `rgba(230,236,240,${(0.85 * (1 - k)).toFixed(2)})`; ctx.fillRect(6, -2, len, 4); ctx.fillStyle = `rgba(150,170,190,${(0.7 * (1 - k)).toFixed(2)})`; ctx.fillRect(6, -4, len * 0.9, 1); ctx.fillRect(6, 3, len * 0.9, 1); ctx.restore();
    smokeCloud(smokeTrail(sx + dx * 8, sy + dy * 8, sx + dx * len, sy + dy * len, 6, 3, 7 + k * 4, f.t, 2), 0.85 * (1 - k)); } });
  delayAct(0.1, () => { if (P.dead || G.map !== M) return; let n = 0;
    for (const m of G.ents) { if (m.type !== 'mob' || m.dying || m.remove || m.map !== M.id) continue; const vx = m.x - ox, vy = m.y - oy, al = vx * dx + vy * dy, pr = Math.abs(-vx * dy + vy * dx);
      if (al > -6 && al < Ln + 10 && pr < 16 + (m.rad || 8)) { hitMob(m, P.S.atk * 1.9, m.boss ? { kb: 30 } : { kb: 30, root: 1.0, stun: 0.45 }); addFx({ type: 'ring', x: m.x, y: m.y, r: 16, dur: 0.3, col: '#dfe8ee' }); smSmokePuff(m.x, m.y - 14, 8, 60); n++; } }
    if (n) G.shake = Math.max(G.shake, 4); });
}
hookAround('buggyGloveBasic', (next, P, ang) => (P && P.equip && P.equip.weapon && P.equip.weapon.id === SM_JITTE) ? smJitteBasic(P, ang) : next(P, ang));

// ---------- 4) Fruta Humo Humo (logia) ----------
DAWN_FRUIT_PIXELS.df_moku = [['#f2f3f7', '#d6d9e3', '#bcc0cf', '#9ba1b3', '#878da0', '#6f7588', '#5a6072', '#000000', '#1c1e26', '#8acb4a', '#4f8a2a'],
  '.....888........', '....8a9a8.888...', '....8a88.8a9a8..', '.....8a88a8.8a8.', '......8a98...88.', '....88243288....', '...8321111158...', '...8230312228...',
  '..831133111148..', '..842100010348..', '..832200033258..', '..842201223458..', '...8433224458...', '....84444458....', '.....866568.....', '......8888......'];
DFR.moku = { item: 'df_moku', n: L2('Humo Humo', 'Smoke-Smoke'), ic: '💨', rank: 3, colors: ['#9aa0b0', '#d6dae4', '#ffffff'],
  desc: L2('Logia de humo. Puño de humo, serpientes que atrapan, un salto convertido en humo y 10 s de cuerpo de humo que atraviesa los golpes y quema a quien te toque. Todo crece con tu nivel y tu ataque, también con transformaciones.',
    'Smoke Logia. A smoke fist, grabbing snakes, a dash as smoke and 10 s of a smoke body that lets hits pass through and hurts whoever touches you. Everything grows with your level and attack, transformations included.') };
const MOKU_TECH = [
  ['moku_puno', 'Puño Blanco', 'White Blow', 7, 24, 'slam', 2.9, 0.15, 'Un puño gigante de humo sale en línea y empuja. Con el cuerpo de humo activo hace un 30 % más.', 'A giant smoke fist flies in a line and pushes. With the smoke body active it deals 30% more.'],
  ['moku_serpiente', 'Serpientes Blancas', 'White Snake', 12, 32, 'spin', 1.05, 0.055, 'Cuatro serpientes de humo atrapan a los enemigos alrededor del objetivo (los comunes quedan inmóviles). Con el cuerpo de humo, el agarre dura el doble.', 'Four smoke snakes grab enemies around the target (ordinary ones are pinned). With the smoke body, the hold lasts twice as long.'],
  ['moku_lanzador', 'Lanzador Blanco', 'White Launcher', 16, 38, 'arrow', 3.6, 0.18, 'Te vuelves humo y sales disparado en línea: no te tocan y golpeas a todo lo que cruzas.', 'You turn into smoke and shoot forward in a line: you can’t be hit and you strike everything you cross.'],
  ['moku_impulso', 'Impulso Blanco', 'White Jet', 14, 26, 'arrow', 0.9, 0.05, 'Tus piernas se vuelven una columna de humo que te impulsa: 4 s con un 85 % más de velocidad, y quien toques con el humo recibe daño cada 0,5 s. Con el cuerpo de humo activo dura el doble.', 'Your legs turn into a smoke column that propels you: 4 s with 85% more speed, and anyone your smoke touches takes damage every 0.5 s. With the smoke body active it lasts twice as long.'],
  ['moku_logia', 'Cuerpo de Humo · Logia', 'Smoke Body · Logia', 30, 40, 'shield', 0.35, 0.02, 'Diez segundos. Los golpes físicos de monstruos comunes te atraviesan y los jefes te quitan un 30 % menos. Quien esté pegado a ti recibe daño de humo cada 0,6 s. El agua, el daño elemental y el PvP atraviesan la forma.', 'Ten seconds. Ordinary monsters’ physical hits pass through you and bosses deal 30% less. Anyone right next to you takes smoke damage every 0.6 s. Water, elemental damage and PvP pierce the form.']
];
DFS.moku = MOKU_TECH.map(([id, es, en, cd, mp, icon, m, mr, desc, text]) => {
  DF_TECH_OWNER[id] = 'moku';
  sk(id, 'fruta', 0, 0, L2(es, en), 'act', 500, null, { mp, cd, icon: [icon, '#d6dae4'], eff: { k: id, m, mr }, fruit: 1, max: 10, d: L2(desc, text) + ' ' + L2('Potencia: {m}% del ataque.', 'Power: {m}% of attack.') });
  return id;
});
it('df_moku', { n: L2('Fruta ', 'Fruit: ') + DFR.moku.n, t: 'cons', stack: true, price: 0, icon: ['df_moku'], rar: 5, d: DFR.moku.desc });
SAVEKEYS.push('smPity');
const mokuLogia = P => P && P.fruit === 'moku' && (P.mokuUntil || 0) > G.t && dfNewCombatReady(P);
function mokuSmoke(x, y, n, sp) { burst(x, y - 10, n, { sp: sp || 70, up: 22, g: -8, life: 0.55, c: DFR.moku.colors }); }
function mokuCast(id) {
  const P = G.P, M = G.map, s = SK[id], pw = s.eff, logia = mokuLogia(P), boost = id === 'moku_puno' && logia ? 1.3 : 1;
  const damage = P.S.atk * (pw.m + pw.mr * (dfRank() - 1)) * (1 + (P.S.skillP || 0) / 100) * boost;
  const mob = nearestMob(P.x, P.y, 180, m => dfNewMob(m, M)), [ax, ay] = DIRV[P.dir] || DIRV.down;
  const ang = mob ? Math.atan2(mob.y - P.y, mob.x - P.x) : Math.atan2(ay, ax), dx = Math.cos(ang), dy = Math.sin(ang), x = P.x, y = P.y;
  const tx = mob ? mob.x : x + dx * 86, ty = mob ? mob.y : y + dy * 86;
  const valid = () => G.P === P && G.map === M && P.fruit === 'moku' && dfNewCombatReady(P);
  const later = (t, fn) => delayAct(t, () => { if (valid()) fn(); });
  setAnim(P, 'cast');
  if (id === 'moku_puno') {
    P.busy = 0.4;
    addFx({ type: 'custom', x, y: y - 12, dur: 0.7, draw: (f, sx, sy, k) => { const d = 165 * Math.min(1, k * 1.8), a = 1 - Math.max(0, (k - 0.6) / 0.4), ex = sx + dx * d, ey = sy + dy * d;
      // brazo de humo que se estira y un puño grande con nudillos al final
      smokeCloud(smokeTrail(sx + dx * 6, sy + dy * 6, ex - dx * 10, ey - dy * 10, 9, 4, 9, f.t, 1), a * 0.95);
      const fist = smokeBlob(ex, ey, 17, 15, 8, 9, f.t, 2); for (let i = -1; i <= 2; i++) fist.push([ex + dx * 12 - dy * i * 6, ey + dy * 12 + dx * i * 6, 5.5]);
      smokeCloud(fist, a); } });
    later(0.24, () => { dfNewSweep(M, x, y, dx, dy, 165, 24, damage, { kb: 140 }); mokuSmoke(x + dx * 150, y + dy * 150, 22, 110); sfx('boom'); });
  } else if (id === 'moku_serpiente') {
    P.busy = 0.45; const hold = logia ? 2.4 : 1.2;
    addFx({ type: 'custom', x: tx, y: ty, dur: 1.6, draw: (f, sx, sy, k) => { const a = 1 - Math.max(0, (k - 0.7) / 0.3), reach = Math.min(1, k * 2.2), balls = [];
      // cuatro serpientes de humo que salen desde fuera y se enroscan sobre el objetivo; la cabeza es más gorda
      for (let j = 0; j < 4; j++) { const a0 = j * 1.571 + 0.4; for (let i = 0; i <= 12; i++) { const t = i / 12 * reach, rr = 64 * (1 - t);
        balls.push([sx + Math.cos(a0 + t * 2.6) * rr, sy - 8 + Math.sin(a0 + t * 2.6) * rr * 0.55 + Math.sin(t * 10 + f.t * 7 + j) * 2, i === 12 ? 7.5 : 3 + i * 0.25]); } }
      smokeCloud(balls, a); if (k > 0.35) smokeCloud(smokeBlob(sx, sy - 10, 14, 10, 7, 6, f.t, 4), a * 0.9); } });
    for (let i = 0; i < 4; i++) later(0.3 + i * 0.3, () => { dfNewHitCircle(M, tx, ty, 60, damage, m => m.boss ? {} : { root: hold, slow: hold + 0.5 }); mokuSmoke(tx, ty, 8); });
    sfx('swing');
  } else if (id === 'moku_lanzador') {
    P.busy = 0.42; P.ifr = Math.max(P.ifr || 0, 0.5); const L = 125, hit = new Set();
    for (const m of G.ents) { if (!dfNewMob(m, M)) continue; const vx = m.x - x, vy = m.y - y, al = vx * dx + vy * dy, pr = Math.abs(-vx * dy + vy * dx); if (al > -6 && al < L + 12 && pr < 20 + (m.rad || 8)) hit.add(m); }
    for (let k = 0; k < 8; k++) { const px = P.x, py = P.y; if (!moveEnt(M, P, dx * L / 8, dy * L / 8)) break; if (k % 2 === 0) smokeFx(px, py - 10, 12 + k, 9 + k / 2, 6, 6 + k * 0.5, 0.7, { rise: 8 }); }
    later(0.06, () => { for (const m of hit) if (!m.dying) { hitMob(m, damage, { kb: 80 }); addFx({ type: 'ring', x: m.x, y: m.y, r: 18, dur: 0.3, col: '#eef2f4' }); } if (hit.size) G.shake = Math.max(G.shake, 4); });
    floatText(P.x, P.y - 44, L2('Lanzador Blanco', 'White Launcher'), '#eef2f4'); sfx('swing');
  } else if (id === 'moku_impulso') {
    const dur = logia ? 8 : 4; P.mokuJetUntil = G.t + dur; P.mokuJetTick = G.t + 0.5; P.mokuJetDmg = damage; addBuff(P, 'moku_jet', { spdP: 85 }, dur);
    smokeFx(x, y - 4, 22, 10, 9, 8, 0.8, { rise: 6 }); floatText(P.x, P.y - 48, L2('¡Impulso Blanco!', 'White Jet!'), '#eef2f4'); sfx('buff');
  } else if (id === 'moku_logia') {
    P.mokuUntil = G.t + 10; P.mokuTick = G.t + 0.6; P.mokuDmg = damage;
    mokuSmoke(x, y, 26, 90); floatText(P.x, P.y - 48, L2('¡Cuerpo de humo!', 'Smoke body!'), '#eef2f4'); sfx('buff');
  }
  uiDirty.hud = true;
}
hookAround('dfCast', (next, id) => {
  if (DF_TECH_OWNER[id] !== 'moku') return next(id);
  if (G.P.fruit === 'moku' && dfNewCombatReady(G.P)) mokuCast(id);
});
// cuerpo de humo: los golpes comunes te atraviesan, los jefes quitan menos
hookAround('hurtPlayer', (next, base, src) => {
  const P = G.P; src = src || {};
  if (!mokuLogia(P) || src.pvp || src.burn || src.poison || G.paused) return next(base, src);
  const boss = !!(DAWN_RETO_SRC || src.boss || src.dawnReto);
  if (!boss && src.dfPhysical) { if (!P.mokuMissT || G.t - P.mokuMissT > 0.4) { P.mokuMissT = G.t; floatText(P.x, P.y - 42, L2('HUMO', 'SMOKE'), '#eef2f4'); mokuSmoke(P.x, P.y, 7); } return; }
  return next(boss ? base * 0.7 : base, src);
});
// daño de humo a quien esté pegado a ti mientras eres humo
V33_TICKS.push(() => {
  const P = G.P; if (!mokuLogia(P) || G.t < (P.mokuTick || 0)) return;
  P.mokuTick = G.t + 0.6; let n = 0;
  for (const m of G.ents) if (dfNewMob(m, G.map) && dist2(m.x, m.y, P.x, P.y) < 44 * 44) { hitMob(m, (P.mokuDmg || P.S.atk * 0.35), {}); n++; }
  if (n) mokuSmoke(P.x, P.y, 6, 50);
});
const mokuJet = P => P && P.fruit === 'moku' && (P.mokuJetUntil || 0) > G.t && dfNewCombatReady(P);
V33_TICKS.push(() => {
  const P = G.P; if (!mokuJet(P) || G.t < (P.mokuJetTick || 0)) return;
  P.mokuJetTick = G.t + 0.5; dfNewHitCircle(G.map, P.x, P.y, 30, P.mokuJetDmg || P.S.atk * 0.9, { kb: 40 });
});
hookAfter('setMap', () => { const P = G.P; if (P) { P.mokuUntil = 0; P.mokuJetUntil = 0; if (P.buffs) removeBuff(P, 'moku_jet'); } });
hookBefore('playerDie', () => { const P = G.P; if (P) { P.mokuUntil = 0; P.mokuJetUntil = 0; } });
// impulso: las piernas son una columna de humo que deja estela detrás
DL_HOOKS.push((list, cx, cy) => {
  const P = G.P; if (!mokuJet(P)) return;
  const tr = P._mkTrail || (P._mkTrail = []); const last = tr[tr.length - 1];
  if (!last || Math.hypot(last[0] - P.x, last[1] - P.y) > 6) { tr.push([P.x, P.y, G.t]); if (tr.length > 14) tr.shift(); }
  list.push({ type: 'xdraw', x: P.x, y: P.y + 3, noShadow: true, draw: () => {
    const x = P.x - cx, y = P.y - cy, balls = [];
    for (const [tx, ty, t0] of tr) { const age = Math.min(1, (G.t - t0) / 0.9); if (age >= 1) continue; balls.push([tx - cx + Math.sin(t0 * 9) * 2, ty - cy - 6 - age * 6, 4 + age * 4]); }
    smokeCloud(balls, 0.75, false);
    smokeCloud(smokeBlob(x, y - 6, 12, 9, 7, 6, G.t * 1.6, 5).concat([[x - 3, y - 13, 5], [x + 3, y - 13, 5], [x, y + 1, 7]]), 0.97);
  } });
});
// dibujo: con el cuerpo de humo, las piernas se deshacen en humo y sube una estela
DL_HOOKS.push((list, cx, cy) => {
  const P = G.P; if (!mokuLogia(P)) return;
  list.push({ type: 'xdraw', x: P.x, y: P.y + 2, noShadow: true, draw: () => {
    const x = P.x - cx, y = P.y - cy, left = (P.mokuUntil - G.t) / 10; ctx.save();
    smokeCloud(smokeBlob(x, y - 6, 18, 10, 8, 6.5, G.t, 1), 0.92);                        // piernas de humo
    smokeCloud(smokeBlob(x + Math.sin(G.t * 1.7) * 3, y - 26, 13, 18, 7, 4.5, G.t, 2), 0.35);  // el cuerpo se vuelve humo
    for (let i = 0; i < 3; i++) { const k = (G.t * 0.8 + i / 3) % 1; smokeCloud(smokeBlob(x + Math.sin(i * 3 + G.t) * 6, y - 38 - k * 30, 5 + k * 6, 4 + k * 5, 5, 3 + k * 3, G.t, i), 0.55 * (1 - k)); }
    ctx.fillStyle = 'rgba(20,24,32,.6)'; ctx.fillRect(x - 13, y - 62, 26, 3); ctx.fillStyle = '#eef2f4'; ctx.fillRect(x - 13, y - 62, Math.round(26 * left), 3);
    ctx.restore();
  } });
});
// también aparece suelta por el Mar de Dawn (después de vencer a Smoker una vez)
hookAfter('dfTrySpawn', () => {
  const P = G.P, M = G.map;
  if (!P || !M || M.id !== 'dawn' || DF_SPAWN.f || DF_SPAWN.t !== G.t || !(P.logueArcN > 0) || !dfHas()) return;
  if (P.fruit === 'moku' || countItem('df_moku') || Math.random() >= 0.03) return;
  const site = dfNewDiscovery(P, M, 'moku'); if (site) { DF_SPAWN.f = site; dfAnnouncement(site); }
});
hookAround('dfTabHow', (next, kind) => {
  if (kind !== 'moku') return next(kind);
  const P = G.P, live = DF_SPAWN.f && DF_SPAWN.f.kind === 'moku' && G.t - DF_SPAWN.f.t < 240 ? DF_SPAWN.f : null;
  return { where: L2('Smoker · nivel 612 · arco de Loguetown (Mar de Dawn); también aparece suelta en una isla de Dawn', 'Smoker · level 612 · Loguetown arc (Dawn Sea); it also appears on a Dawn island'),
    chance: L2('1 % cada vez que vences a Smoker · segura a la victoria ', '1% each time you defeat Smoker · guaranteed by win ') + SM_FRUIT_PITY + L2(' · 3 % cada 45 s en Dawn después de vencerlo', ' · 3% every 45 s in Dawn after you defeat him'),
    left: (P.fruit === 'moku' || countItem('df_moku')) ? 0 : Math.max(1, SM_FRUIT_PITY - ((P.smPity || {}).df_moku || 0)),
    extra: L2('Logia: 4 técnicas que crecen con tu nivel y tu ataque. Shanks la quita con Voluntad 3 (o si ganaste su duelo).', 'Logia: 4 techniques that grow with your level and attack. Shanks removes it at Will rank 3 (or if you won his duel).'),
    wp: live ? { loc: [live.x >> 4, live.y >> 4], m: 'dawn', t: ITEMS.df_moku.n } : { loc: logueAt(104, 122), m: 'dawn', t: 'Loguetown' }, live };
});

// ---------- 5) botín de Smoker con pity ----------
const SM_FRUIT_PITY = 80;
// [objeto, probabilidad, seguro a la victoria, ya lo tienes]
const SM_DROPS = [
  [SM_JITTE, 0.12, 10, P => (P.equip.weapon && P.equip.weapon.id === SM_JITTE) || countItem(SM_JITTE) > 0],
  ...SM_COS.map(id => ['cosi_' + id, 0.25, 12, P => (P.wardrobe || []).includes(id) || countItem('cosi_' + id) > 0]),
  ['df_moku', 0.01, SM_FRUIT_PITY, P => P.fruit === 'moku' || countItem('df_moku') > 0]
];
const smMissing = P => SM_DROPS.filter(r => !r[3](P));
BOSS_EXTRA.logue_arc_smoker = () => { const P = G.P; if (!P || !P.inv) return []; return smMissing(P).map(([id, ch, cap]) => [id, ch, L2('seguro en ', 'sure in ') + Math.max(1, cap - ((P.smPity || {})[id] || 0))]); };
hookAfter('bossKilled', (r, m) => {
  const P = G.P; if (!P || !m || m.mid !== 'logue_arc_smoker') return;
  try {
    P.smPity = P.smPity && typeof P.smPity === 'object' ? P.smPity : {}; const mul = typeof dropEventMul === 'function' ? dropEventMul() : 1, got = [];
    for (const [id, ch, cap] of smMissing(P)) {
      const n = Math.min(cap, (P.smPity[id] || 0) + 1);
      if (n < cap && Math.random() >= ch * mul) { P.smPity[id] = n; continue; }
      let ok = false; const c = ITEMS[id] && ITEMS[id].cos;
      if (c) { giveCosmetic(c, true); ok = true; } else ok = giveItem(id, 1, true);
      if (ok) { delete P.smPity[id]; got.push(id); lootFx(m.x, m.y, id); } else P.smPity[id] = cap;
    }
    if (got.length) setTimeout(() => { for (const id of got) toast((id === 'df_moku' ? '💨 ' : id === SM_JITTE ? '⚔ ' : '🧥 ') + ITEMS[id].n, 'quest', 6); if (got.includes('df_moku')) banner('💨 ' + ITEMS.df_moku.n, L2('¡La fruta de Smoker! Cómela desde el inventario.', 'Smoker’s fruit! Eat it from the inventory.')); }, 3000);
    markDirty(true);
  } catch (e) { if (typeof errOnce === 'function') errOnce('smDrops', e); }
});
hookAround('itemSources', (next, id) => {
  const k = String(id);
  if (k === SM_JITTE || k === 'df_moku' || SM_COS.includes(k.replace(/^cosi_/, ''))) return [[SM_SRC.replace('25 %', k === SM_JITTE ? '12 %' : k === 'df_moku' ? '1 %' : '25 %').replace('25%', k === SM_JITTE ? '12%' : k === 'df_moku' ? '1%' : '25%'), { loc: logueAt(104, 122), m: 'dawn', t: 'Loguetown' }]];
  return next(id);
});
GSIS.push(['smoker618', L2('Smoker: logia, botín y Fruta Humo Humo', 'Smoker: Logia, loot and Smoke-Smoke Fruit'), () => [
  L2('Smoker (arco de Loguetown, nivel 612) es el jefe más fuerte de su nivel. Al bajar al 66 % y al 33 % se vuelve humo 10 s: tus golpes lo atraviesan y suelta anillos de humo. Aléjate y espera.', 'Smoker (Loguetown arc, level 612) is the strongest boss of his level. At 66% and 33% he turns into smoke for 10 s: your hits pass through him and he releases smoke rings. Back off and wait.'),
  L2('Botín: Chaqueta, Vaquero y Botas del Cazador Blanco (25 % cada una, seguras a las 12), Jitte de Piedra Marina (12 %, seguro a las 10; el arma más fuerte, todas las clases) y la Fruta Humo Humo (1 %, segura a las 80). Se ve encima de su barra de vida.', 'Loot: White Hunter’s Jacket, Jeans and Boots (25% each, guaranteed by 12), Seastone Jitte (12%, guaranteed by 10; the strongest weapon, every class) and the Smoke-Smoke Fruit (1%, guaranteed by 80). Shown above his health bar.'),
  L2('Humo Humo: Puño Blanco, Serpientes Blancas, Lanzador Blanco y Cuerpo de Humo (10 s). Con el cuerpo de humo, el Puño hace un 30 % más y las serpientes sujetan el doble. Todo depende de tu nivel y tu ataque, así que se suma a transformaciones y despertares.', 'Smoke-Smoke: White Blow, White Snake, White Launcher and Smoke Body (10 s). With the smoke body, the Blow deals 30% more and the snakes hold twice as long. Everything depends on your level and attack, so it stacks with transformations and awakenings.')
], () => ({ loc: logueAt(104, 122), m: 'dawn', t: 'Loguetown' })]);
