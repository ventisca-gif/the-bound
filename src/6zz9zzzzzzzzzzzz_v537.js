// ================= v5.37: ACCESORIOS DE CARA (gafas, bigotes, pendientes…) Y VENTAJAS PEQUEÑAS =================
// Sergio: «crea una lista de accesorios tipo lentes, que tenemos poco, y otras cosas: bigotes falsos y demás».
// Antes solo había 5 gafas y ningún bigote, barba, monóculo ni pendiente, y todo eso ocupaba el hueco del sombrero.
// Ahora la cara tiene su propio hueco (P.app.fa, como el labial): se combina con cualquier sombrero, peinado o casco,
// se dibuja con las medidas de la cara de cada estructura (m.hx, m.ey, m.eyes, boca de BODY_T) y viaja en el online
// dentro del aspecto. Se compran y se ponen en Armario › 👓 Cara (o con un sastre).
// Ventajas: llevar un accesorio de cara da +0,1 % de crítico y +0,1 % de defensa (solo se lleva uno).
// Los 3 oficios de Japón (5.36) ahora solo dan +0,1 % de defensa (nivel 20) y +0,1 % de crítico (nivel 40), más paga.

// ---------- ventajas de los oficios de Japón ----------
for (const k of ['jardinero', 'barquero', 'mensajero']) { if (!JOBP2[k]) continue;
  const P8 = [[10, '+10 % de paga', '+10% pay', { ['v8' + k]: 10 }], [20, '+0,1 % de defensa', '+0.1% defense', { defP: 0.1 }], [40, '+0,1 % de crítico', '+0.1% crit', { crit: 0.1 }], [60, '+15 % de paga', '+15% pay', { ['v8' + k]: 15 }]];
  JOBP2[k] = P8; JOB_PERKS[k] = P8.map(([lv, es, en]) => [lv, L2(es, en)]); if (JOB_GUIDE[k]) { JOB_GUIDE[k].perks = P8.map(([lv, es, en]) => [lv, es, en]); JOB_GUIDE[k].ben = [L2('Oro y experiencia de oficio (oficio de país). Ventajas: +0,1 % de defensa y +0,1 % de crítico.', 'Gold and job experience (country job). Perks: +0.1% defense and +0.1% crit.'), '']; } }

// ---------- los accesorios ----------
// [id, es, en, precio, grupo, dibujo(p, F)] · F: hx, ey, eyes, side, d, up, my (fila de la boca), mx (x de la boca de perfil), hrx, chin
const FA = [];
const faC = h => C(h);
function faAdd(id, es, en, pr, g, draw) { FA.push({ id, n: L2(es, en), pr, g, draw }); }
const faPx = (p, x, y, c) => p.set(Math.round(x), Math.round(y), c);
const faH = (p, x, y, w, c) => { for (let i = 0; i < w; i++) faPx(p, x + i, y, c); };
const faV = (p, x, y, h, c) => { for (let i = 0; i < h; i++) faPx(p, x, y + i, c); };
// lente cuadrada alrededor de un ojo (x = columna izquierda del ojo, que mide 2)
function faLens(p, x, y, fr, gl, w, h) { w = w || 4; h = h || 4; const x0 = x - 1, y0 = y - 1; faH(p, x0, y0, w, fr); faH(p, x0, y0 + h - 1, w, fr); faV(p, x0, y0, h, fr); faV(p, x0 + w - 1, y0, h, fr); if (gl) for (let yy = 1; yy < h - 1; yy++) for (let xx = 1; xx < w - 1; xx++) faPx(p, x0 + xx, y0 + yy, gl); }
function faGlasses(p, F, fr, gl, o) { o = o || {}; const y = F.ey + (o.dy || 0);
  if (F.up) { faH(p, F.hx - F.hrx, y, 2, fr); faH(p, F.hx + F.hrx - 2, y, 2, fr); return; }
  if (F.side) { const ex = F.eyes[0]; (o.lens || faLens)(p, ex, y, fr, gl, o.w, o.h); const back = F.d > 0 ? ex - 1 : ex + 2; faH(p, F.d > 0 ? back - 4 : back + 1, y, 4, fr); return; }
  const [a, b] = F.eyes; (o.lens || faLens)(p, a, y, fr, gl, o.w, o.h); (o.lens || faLens)(p, b, y, fr, gl, o.w, o.h); faH(p, a + 3, y, b - a - 3, o.bridge || fr); faPx(p, a - 2, y, fr); faPx(p, b + 3, y, fr); }
// gafas
faAdd('fa_pasta', 'Gafas de pasta negras', 'Black thick-rim glasses', 1500, 'gafas', (p, F) => faGlasses(p, F, faC('#141418'), faC('#c8e0f0'), { w: 5, h: 4 }));
faAdd('fa_aviador', 'Gafas de aviador', 'Aviator glasses', 3000, 'gafas', (p, F) => faGlasses(p, F, faC('#e0b040'), faC('#c8781a'), { lens: (p, x, y, fr, gl) => { faH(p, x - 1, y - 1, 4, fr); for (let yy = 0; yy < 3; yy++) faH(p, x - 1 + (yy === 2 ? 1 : 0), y + yy, yy === 2 ? 2 : 4, gl); faPx(p, x - 1, y + 1, fr); faPx(p, x + 2, y + 1, fr); } }));
faAdd('fa_corazon', 'Gafas de corazón', 'Heart glasses', 2000, 'gafas', (p, F) => faGlasses(p, F, faC('#e8306a'), faC('#ff8ab8'), { lens: (p, x, y, fr, gl) => { faPx(p, x - 1, y - 1, fr); faPx(p, x + 2, y - 1, fr); faH(p, x - 1, y, 4, gl); faH(p, x, y + 1, 2, gl); faPx(p, x - 1, y, fr); faPx(p, x + 2, y, fr); faPx(p, x, y + 2, fr); faPx(p, x + 1, y + 2, fr); } }));
faAdd('fa_estrella', 'Gafas de estrella de fiesta', 'Party star glasses', 2000, 'gafas', (p, F) => faGlasses(p, F, faC('#ffd040'), faC('#ff6ad0'), { lens: (p, x, y, fr, gl) => { faPx(p, x, y - 2, fr); faPx(p, x + 1, y - 2, fr); faH(p, x - 2, y - 1, 6, fr); faH(p, x - 1, y, 4, gl); faH(p, x - 1, y + 1, 4, gl); faPx(p, x - 2, y + 2, fr); faPx(p, x + 3, y + 2, fr); } }));
faAdd('fa_lectura', 'Gafas de media luna', 'Half-moon reading glasses', 1800, 'gafas', (p, F) => faGlasses(p, F, faC('#8a6a3a'), faC('#e0f0f8'), { dy: 2, lens: (p, x, y, fr, gl) => { faH(p, x - 1, y, 4, gl); faH(p, x - 1, y + 1, 4, fr); faPx(p, x - 1, y, fr); faPx(p, x + 2, y, fr); } }));
faAdd('fa_gatuna', 'Gafas de ojo de gato', 'Cat-eye glasses', 2500, 'gafas', (p, F) => faGlasses(p, F, faC('#8a1a3a'), faC('#f0d0e0'), { lens: (p, x, y, fr, gl) => { faLens(p, x, y, fr, gl); faPx(p, x - 2, y - 2, fr); faPx(p, x + 3, y - 2, fr); } }));
faAdd('fa_visor', 'Visor cibernético', 'Cyber visor', 5000, 'gafas', (p, F) => { const y = F.ey; if (F.up) { faH(p, F.hx - F.hrx, y, Math.round(F.hrx * 2), faC('#2a2a34')); return; } const x0 = F.side ? (F.d > 0 ? F.hx - 2 : F.hx - 6) : F.eyes[0] - 2, w = F.side ? 8 : F.eyes[1] - F.eyes[0] + 6; faH(p, x0, y - 1, w, faC('#2a2a34')); faH(p, x0, y, w, faC('#3af0ff')); faH(p, x0, y + 1, w, faC('#1a8aa8')); faPx(p, x0 + ((G.t * 6) | 0) % w, y, faC('#ffffff')); });
faAdd('fa_3d', 'Gafas 3D de cartón', '3D cardboard glasses', 1200, 'gafas', (p, F) => { if (F.up || F.side) return faGlasses(p, F, faC('#f4f4f0'), faC('#e83a3a')); const [a, b] = F.eyes, y = F.ey, W = faC('#f4f4f0'); faLens(p, a, y, W, faC('#e83a3a')); faLens(p, b, y, W, faC('#3a8ae8')); faH(p, a + 3, y, b - a - 3, W); });
faAdd('fa_monoculo', 'Monóculo con cadena', 'Monocle with chain', 4000, 'gafas', (p, F) => { if (F.up) return; const G_ = faC('#e0b040'), y = F.ey, x = F.side ? F.eyes[0] : F.eyes[1]; faLens(p, x, y, G_, faC('#e8f4ff')); faPx(p, x, y, faC('#ffffff')); for (let k = 1; k <= 5; k++) faPx(p, x + 2 + (F.side ? -F.d : 1) * (k >> 1), y + 2 + k, k % 2 ? G_ : faC('#a87820')); });
faAdd('fa_antifaz', 'Antifaz de baile de máscaras', 'Masquerade mask', 3500, 'gafas', (p, F) => { if (F.up) return faH(p, F.hx - F.hrx, F.ey, 2, faC('#2a0a3a')); const M = faC('#4a1a6a'), Gd = faC('#e0b040'), y = F.ey; if (F.side) { const ex = F.eyes[0]; faH(p, ex - 2, y - 1, 6, M); faH(p, ex - 2, y + 2, 6, M); faPx(p, ex - 2, y, M); faPx(p, ex + 3, y, M); faPx(p, ex - 2, y + 1, M); faPx(p, ex + 3, y + 1, M); faPx(p, ex + 1, y - 2, Gd); return; }
  const [a, b] = F.eyes; faH(p, a - 2, y - 1, b - a + 6, M); faH(p, a - 2, y + 2, b - a + 6, M); for (const x of [a - 2, a + 2, b - 1, b + 3]) { faPx(p, x, y, M); faPx(p, x, y + 1, M); } faH(p, a + 3, y, b - a - 3, M); faPx(p, b + 4, y - 3, Gd); faPx(p, b + 5, y - 4, faC('#c070ff')); faPx(p, b + 4, y - 2, Gd); });
// bigotes y barbas
const faMust = (p, F, col, sh) => { const y = F.my - 1, c = faC(col), s = faC(sh);
  if (F.up) return; if (F.side) { const x = F.mx; faH(p, x - (F.d > 0 ? 2 : 0), y, 3, c); faPx(p, x + F.d, y + 1, s); return; } return { y, c, s }; };
faAdd('fa_bigote', 'Bigote falso clásico', 'Classic fake moustache', 1000, 'bigote', (p, F) => { const r = faMust(p, F, '#3a2416', '#1a0e08'); if (!r) return; faH(p, F.hx - 3, r.y, 6, r.c); faPx(p, F.hx - 4, r.y + 1, r.s); faPx(p, F.hx + 3, r.y + 1, r.s); });
faAdd('fa_manubrio', 'Bigote enroscado', 'Handlebar moustache', 2200, 'bigote', (p, F) => { const r = faMust(p, F, '#2a1a10', '#0e0806'); if (!r) return; faH(p, F.hx - 3, r.y, 6, r.c); faPx(p, F.hx - 4, r.y, r.c); faPx(p, F.hx + 3, r.y, r.c); faPx(p, F.hx - 5, r.y - 1, r.s); faPx(p, F.hx + 4, r.y - 1, r.s); faPx(p, F.hx - 5, r.y - 2, r.s); faPx(p, F.hx + 4, r.y - 2, r.s); });
faAdd('fa_morsa', 'Bigote de morsa', 'Walrus moustache', 2000, 'bigote', (p, F) => { const r = faMust(p, F, '#6a5a4a', '#4a3a2a'); if (!r) return; faH(p, F.hx - 4, r.y, 8, r.c); faH(p, F.hx - 4, r.y + 1, 3, r.s); faH(p, F.hx + 1, r.y + 1, 3, r.s); faPx(p, F.hx - 4, r.y + 2, r.s); faPx(p, F.hx + 3, r.y + 2, r.s); });
faAdd('fa_perilla', 'Perilla', 'Goatee', 1500, 'bigote', (p, F) => { if (F.up) return; const c = faC('#2a1a10'); if (F.side) { faV(p, F.mx, F.my + 1, 3, c); return; } faH(p, F.hx - 1, F.my + 1, 2, c); faH(p, F.hx - 1, F.my + 2, 2, c); faPx(p, F.hx - 1, F.my + 3, c); faH(p, F.hx - 2, F.my - 1, 4, c); });
faAdd('fa_barba_mago', 'Barba larga postiza de mago', 'Long fake wizard beard', 3500, 'bigote', (p, F) => { if (F.up) return; const W = faC('#f0f0f4'), S = faC('#b8b8c8'); if (F.side) { for (let k = 0; k < 7; k++) faH(p, F.mx - (F.d > 0 ? 2 : 0), F.my + k, k < 5 ? 3 : 2, k % 2 ? S : W); return; }
  for (let k = -1; k < 8; k++) { const w = k < 0 ? 8 : Math.max(2, 9 - k); faH(p, F.hx - (w >> 1), F.my + k, w, k % 3 === 2 ? S : W); } faPx(p, F.hx - 1, F.my, faC('#3a2a2a')); faPx(p, F.hx, F.my, faC('#3a2a2a')); });
faAdd('fa_groucho', 'Gafas con nariz y bigote', 'Nose-and-moustache glasses', 1800, 'bigote', (p, F) => { faGlasses(p, F, faC('#141418'), null); if (F.up) return; const N = faC('#e8a888'); if (F.side) { faPx(p, F.mx + F.d, F.ey + 2, N); faPx(p, F.mx + F.d, F.ey + 3, N); faH(p, F.mx - (F.d > 0 ? 2 : 0), F.my - 1, 3, faC('#141418')); return; }
  faH(p, F.hx - 1, F.ey + 2, 2, N); faH(p, F.hx - 1, F.ey + 3, 2, faC('#c88868')); faH(p, F.hx - 3, F.my - 1, 6, faC('#141418')); });
// pendientes, piercings y cositas
const faEars = F => F.side ? [F.hx - F.d * 2] : [F.hx - F.hrx, F.hx + F.hrx - 1];
const faEarY = F => Math.min(F.ey + (F.side ? 3 : 4), F.chin - 3);
faAdd('fa_aros', 'Pendientes de aro dorados', 'Gold hoop earrings', 2500, 'joya', (p, F) => { const G_ = faC('#ffd040'), D = faC('#a87820'); for (const x of faEars(F)) { const y = faEarY(F); faPx(p, x, y, G_); faPx(p, x - 1, y + 1, G_); faPx(p, x + 1, y + 1, D); faPx(p, x, y + 2, G_); } });
faAdd('fa_perlas', 'Pendientes de perla', 'Pearl earrings', 3000, 'joya', (p, F) => { for (const x of faEars(F)) { const y = faEarY(F); faPx(p, x, y, faC('#c8c0b8')); faPx(p, x, y + 1, faC('#fff8f0')); } });
faAdd('fa_cruz', 'Pendiente de cruz', 'Cross earring', 2200, 'joya', (p, F) => { const x = faEars(F)[F.side ? 0 : 1], S = faC('#d8d8e0'); const y = faEarY(F); faV(p, x, y, 3, S); faPx(p, x - 1, y + 1, S); faPx(p, x + 1, y + 1, S); });
faAdd('fa_nariz_aro', 'Piercing de nariz', 'Nose ring', 1500, 'joya', (p, F) => { if (F.up) return; const S = faC('#e0e0e8'); if (F.side) { faPx(p, F.mx + F.d, F.ey + 3, S); return; } faPx(p, F.hx - 1, F.ey + 3, S); faPx(p, F.hx - 2, F.ey + 3, faC('#9a9aa8')); });
faAdd('fa_lunar', 'Lunar de belleza', 'Beauty mark', 600, 'cara', (p, F) => { if (F.up) return; faPx(p, F.side ? F.mx - F.d : F.hx + 3, F.my - 1, faC('#3a1a14')); });
faAdd('fa_pecas', 'Pecas', 'Freckles', 600, 'cara', (p, F) => { if (F.up) return; const c = faC('#b8704a'); if (F.side) { faPx(p, F.eyes[0], F.ey + 3, c); faPx(p, F.eyes[0] - F.d, F.ey + 4, c); return; } for (const x of F.eyes) { faPx(p, x - 1, F.ey + 3, c); faPx(p, x + 1, F.ey + 4, c); faPx(p, x + 2, F.ey + 3, c); } });
faAdd('fa_estrellitas', 'Pegatinas de estrellas', 'Star stickers', 900, 'cara', (p, F) => { if (F.up) return; const c = faC('#ffd040'), x = F.side ? F.eyes[0] - F.d : F.eyes[1] + 2, y = F.ey + 3; faPx(p, x, y, c); faPx(p, x - 1, y + 1, c); faPx(p, x + 1, y + 1, c); faPx(p, x, y + 2, c); faPx(p, x, y + 1, faC('#fff4b0')); });
faAdd('fa_parche', 'Parche en el ojo', 'Eye patch', 1200, 'cara', (p, F) => { const K = faC('#141418'); if (F.up) { faH(p, F.hx - F.hrx, F.ey - 1, Math.round(F.hrx * 2), K); return; } const x = F.side ? F.eyes[0] : F.eyes[0]; for (let yy = -1; yy <= 2; yy++) faH(p, x - 1, F.ey + yy, 4, K); if (!F.side) { faH(p, x + 3, F.ey - 2, F.hx + F.hrx - x - 3, K); faH(p, F.hx - F.hrx, F.ey - 1, x - 1 - (F.hx - F.hrx), K); } });
faAdd('fa_mascarilla', 'Mascarilla', 'Face mask', 800, 'cara', (p, F) => { const W = faC('#e8f0f4'), S = faC('#b8c8d0'); if (F.up) { faH(p, F.hx - F.hrx, F.ey + 3, 2, W); faH(p, F.hx + F.hrx - 2, F.ey + 3, 2, W); return; }
  if (F.side) { for (let yy = 0; yy < 4; yy++) faH(p, F.mx - (F.d > 0 ? 3 : 0), F.ey + 3 + yy, 4, yy === 3 ? S : W); return; } for (let yy = 0; yy < 4; yy++) faH(p, F.hx - 4, F.ey + 3 + yy, 8, yy === 3 ? S : W); faH(p, F.hx - 3, F.ey + 4, 6, S); });
faAdd('fa_payaso', 'Nariz de payaso', 'Clown nose', 700, 'cara', (p, F) => { if (F.up) return; const R = faC('#e8203a'), Hl = faC('#ff8a9a'); if (F.side) { faPx(p, F.mx + F.d, F.ey + 2, R); faPx(p, F.mx + F.d * 2, F.ey + 2, R); faPx(p, F.mx + F.d, F.ey + 3, R); return; } faH(p, F.hx - 1, F.ey + 2, 2, R); faH(p, F.hx - 2, F.ey + 3, 4, R); faH(p, F.hx - 1, F.ey + 4, 2, R); faPx(p, F.hx - 1, F.ey + 2, Hl); });
faAdd('fa_piruleta', 'Piruleta en la boca', 'Lollipop in mouth', 600, 'cara', (p, F) => { if (F.up) return; const x = F.side ? F.mx + F.d * 2 : F.hx + 2, y = F.my; faH(p, x, y, 3, faC('#f4f4f0')); const cx = x + (F.side && F.d < 0 ? -2 : 3); faPx(p, cx, y - 1, faC('#ff4a8a')); faPx(p, cx + 1, y - 1, faC('#ffd040')); faPx(p, cx, y, faC('#4ac0ff')); faPx(p, cx + 1, y, faC('#ff4a8a')); });

const FA_ID = Object.fromEntries(FA.map(a => [a.id, a]));
const FA_G = [['gafas', L2('Gafas', 'Glasses')], ['bigote', L2('Bigotes y barbas', 'Moustaches and beards')], ['joya', L2('Pendientes y piercings', 'Earrings and piercings')], ['cara', L2('Cara', 'Face')]];

// ---------- aspecto: P.app.fa (como el labial) ----------
{ const _n = normApp; normApp = function (a) { const o = _n.apply(this, arguments); if (a && typeof a.fa === 'string' && FA_ID[a.fa]) o.fa = a.fa; return o; }; }
{ const _hk = heroKey; heroKey = function (cls, app) { const k = _hk.apply(this, arguments); return app && app.fa && FA_ID[app.fa] ? k + '|fa' + app.fa : k; }; }
{ const _hl = heroLook; heroLook = function (cls, app) { const L = _hl.apply(this, arguments); if (L && app && app.fa && FA_ID[app.fa]) L.fa = app.fa; return L; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { const A = L && L.fa && FA_ID[L.fa], m = p.meta; if (!A || !m || m.ey === undefined) return r;
    const side = dir === 'left' || dir === 'right', d = dir === 'left' ? -1 : 1, BT = (BODY_T[L.fem || L.g === 'f' ? 'f' : 'm'] || [])[L.bt || 0] || {}, ey = Math.round(m.ey), mo = BT.mo || FACE.mouth;
    const F = { hx: Math.round(m.hx), ey, eyes: (m.eyes || []).map(Math.round), side, d, up: dir === 'up', my: ey + mo, mx: side ? (dir === 'left' ? Math.round(m.hx) - 6 : Math.round(m.hx) + 5) : Math.round(m.hx), hrx: Math.round(m.hrx || 7), chin: Math.round(m.chin || m.hy + 8) };
    const tg0 = p.tg; p.tg = 7; try { A.draw(p, F); } finally { p.tg = tg0; } } catch (e) { if (typeof errOnce === 'function') errOnce('fa:' + (L && L.fa), e); } return r; }; }

// ---------- ventaja: +0,1 % de crítico y +0,1 % de defensa con un accesorio puesto ----------
SAVEKEYS.push('faOwn');
{ const _cs = calcStats; calcStats = function (P) { const r = _cs.apply(this, arguments); try { if (P && P === G.P && P.S && P.app && P.app.fa && FA_ID[P.app.fa]) { P.S.crit = Math.round((P.S.crit + 0.1) * 100) / 100; P.S.def = Math.round(P.S.def * 1.001); } } catch (e) { } return r; }; }

// ---------- Armario › 👓 Cara: comprar y ponerse ----------
let faGrp = 'gafas';
function faWear(id) { const P = G.P; P.app = normApp(P.app); if (id) P.app.fa = id; else delete P.app.fa; calcStats(P); refreshLook(); markDirty(); sfx('ui'); }
{ const _rw = renderWardrobe; renderWardrobe = function (B) { const fa = wdMode === 'fa'; if (fa) wdMode = 'cos'; const r = _rw.apply(this, arguments); if (fa) wdMode = 'fa';
  try { const chips = B.querySelector('.wdL .chips'); if (chips && !chips.querySelector('[data-wfa]')) { const b = document.createElement('button'); b.className = 'chip' + (fa ? ' on' : ''); b.dataset.wfa = 1; b.textContent = '👓 ' + L2('Cara', 'Face'); b.onclick = () => { wdMode = 'fa'; sfx('ui'); renderPanel(); }; chips.appendChild(b); if (fa) chips.querySelectorAll('[data-wm],[data-wt]').forEach(x => x.classList.remove('on')); }
    if (!fa) return r; const P = G.P, own = P.faOwn = P.faOwn || [], cur = P.app && P.app.fa, R = B.querySelector('.wdR'), hint = B.querySelector('.wdL .hint');
    if (hint) hint.textContent = L2('Gafas, bigotes, pendientes y más. Van en su propio hueco: se combinan con cualquier sombrero, casco o peinado. Llevar uno da +0,1 % de crítico y +0,1 % de defensa. Los demás jugadores lo ven.', 'Glasses, moustaches, earrings and more. They have their own slot: they go with any hat, helmet or hairstyle. Wearing one gives +0.1% crit and +0.1% defense. Other players see it.');
    if (R) { R.innerHTML = `<div class="chips">${FA_G.map(([k, n]) => `<button class="chip ${faGrp === k ? 'on' : ''}" data-fag="${k}">${n}</button>`).join('')}</div><div class="wdlist"><button class="wdo ${!cur ? 'on' : ''}" data-faw=""><span>${L2('Nada en la cara', 'Nothing on the face')}</span></button>`
      + FA.filter(a => a.g === faGrp).map(a => { const has = own.includes(a.id); return `<button class="wdo ${cur === a.id ? 'on' : ''}" data-faw="${a.id}"><span>${esc(a.n)}</span><small>${has ? (cur === a.id ? '✓ ' + L2('puesto', 'worn') : L2('tuyo', 'owned')) : '🪙 ' + fmt(a.pr)}</small></button>`; }).join('') + `</div><p class="hint">${L2('Toca uno que no tengas para comprarlo y ponértelo.', 'Tap one you don\'t own to buy it and put it on.')}</p>`;
      R.querySelectorAll('[data-fag]').forEach(b => b.onclick = () => { faGrp = b.dataset.fag; sfx('ui'); renderPanel(); });
      R.querySelectorAll('[data-faw]').forEach(b => b.onclick = () => { const id = b.dataset.faw; if (!id) { faWear(null); renderPanel(); return; } const A = FA_ID[id]; if (!own.includes(id)) { if (P.gold < A.pr) { toast(L2('No tienes oro suficiente', 'Not enough gold'), 'warn'); return; } P.gold -= A.pr; own.push(id); sfx('coin'); toast('👓 ' + A.n, 'quest'); } faWear(id); renderPanel(); }); } } catch (e) { console.warn(e); } return r; }; }
{ const st = document.createElement('style'); st.textContent = '.wdR .wdlist{display:flex;flex-wrap:wrap;gap:4px;max-height:min(46vh,18em);overflow-y:auto}.wdR .wdlist .wdo small{display:block;opacity:.8;font-size:.75em}'; document.head.appendChild(st); }
// con un sastre también
DLG_HOOKS.push((npc, opts) => { const D = NPCS[npc.id]; if (!D || D.shop !== 'tailor') return; opts.push({ label: '👓 ' + L2('Accesorios de cara (gafas, bigotes…)', 'Face accessories (glasses, moustaches…)'), icon: ['needle', 2], fn: () => { closeDialog(); wdMode = 'fa'; openPanel('wardrobe'); } }); });

// ---------- Lupa › Sistemas ----------
if (typeof GSIS !== 'undefined') GSIS.unshift(['fa537', '👓 ' + L2('Accesorios de cara', 'Face accessories'), () => [
  L2('Armario › 👓 Cara (o habla con un sastre): ' + FA.length + ' accesorios con su propio hueco, que se combinan con sombreros, cascos y peinados.', 'Wardrobe › 👓 Face (or talk to a tailor): ' + FA.length + ' accessories with their own slot, combinable with hats, helmets and hairstyles.'),
  L2('Gafas: ', 'Glasses: ') + FA.filter(a => a.g === 'gafas').map(a => a.n).join(', ') + '.',
  L2('Bigotes y barbas: ', 'Moustaches and beards: ') + FA.filter(a => a.g === 'bigote').map(a => a.n).join(', ') + '.',
  L2('Pendientes y piercings: ', 'Earrings and piercings: ') + FA.filter(a => a.g === 'joya').map(a => a.n).join(', ') + '.',
  L2('Cara: ', 'Face: ') + FA.filter(a => a.g === 'cara').map(a => a.n).join(', ') + '.',
  L2('Se compran con oro (de 600 a 5.000) y se quedan para siempre. Llevar uno da +0,1 % de crítico y +0,1 % de defensa. Los demás jugadores lo ven en el WiFi y el online.', 'Bought with gold (600 to 5,000) and kept forever. Wearing one gives +0.1% crit and +0.1% defense. Other players see it on WiFi and online.')], () => null]);
