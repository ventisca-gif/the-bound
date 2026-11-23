// ================= v5.85: ROPA DEL PELIRROJO (cosméticos) · botín de Shanks =================
// Sergio mandó la foto de Shanks sentado y pidió su ropa por partes como cosméticos: camisa blanca abierta con botones,
// pantalón corto (por debajo de la rodilla) marrón malva con enredaderas verdes y estrellas amarillas, y la capa negra
// sobre los hombros con el cuello levantado. Cada pieza cae al vencer a Shanks (duelo o revancha) con un 30 % y es segura
// a las 15 victorias sin ella (pity propio por prenda, P.skPity). Solo cosméticos: no dan estadísticas.
SAVEKEYS.push('skPity');
const SKR = {
  camisa: P5(['#5e586c', '#8e889e', '#c6c2d4', '#e6e4ee', '#fafafe']),
  pant: P5(['#3e2a2c', '#5e4446', '#7e5e5e', '#9a7874', '#b6948c']),
  capa: P5(['#030305', '#0a0a10', '#14141b', '#1f1f28', '#30303c']),
  boton: C('#4e4858'), hoja: [C('#2e4a22'), C('#4a6c32'), C('#6a8c44')], estrella: [C('#8a7a34'), C('#c4b058'), C('#e8d888')]
};
const skSkin = (A, s) => { const S = (s && s.sk) || A.sk || SKINS[0]; return Array.from(S).map(c => typeof c === 'string' ? C(c) : c); };
// --- camisa: abierta en V hasta media altura, botones debajo, cuello de solapa y faldón suelto por fuera ---
fitKind('body', 'pel_camisa', (p, A, s) => {
  const { tx0, tw, torsoTop: ty, th, cx, side, up, d, fem } = A, m = s.m, S = skSkin(A, s), R = tx0 + tw - 1, waist = ty + th - 1;
  // luz a un lado y sombra lila al otro, con un pliegue en diagonal (como en la foto)
  for (let y = ty + 1; y < waist; y++) { p.set(tx0, y, m[side ? 2 : 3]); p.set(R, y, m[1]); }
  if (!up && !side) { const y0 = ty + Math.round(th * 0.55); p.set(tx0 + 1, y0, m[1]); p.set(tx0 + 2, y0 + 1, m[1]); p.set(R - 2, y0 - 1, m[1]); p.set(R - 1, y0, m[1]); }
  if (up) { p.hl(tx0, ty, tw, m[4]); p.hl(tx0 + 1, ty + 1, tw - 2, m[3]); }
  else if (side) {
    const fx = Math.round(cx + d * (tw / 2 - 1)), dep = Math.max(3, Math.round(th * (fem ? 0.35 : 0.5)));
    for (let y = ty; y < ty + dep; y++) { const w = Math.max(1, Math.round((1 - (y - ty) / dep) * 2.4)); for (let i = 0; i < w; i++) p.set(fx - d * i, y, S[i === w - 1 ? 1 : 2]); p.set(fx - d * w, y, m[4]); }
    for (let y = ty + dep + 1; y < waist; y += 2) p.set(fx - d, y, SKR.boton);
    p.set(fx - d * 3, ty - 1, m[4]); p.set(fx - d * 4, ty, m[4]);
  } else {
    const dep = Math.max(3, Math.round(th * (fem ? 0.42 : 0.62))), hw = tw / 2 - 1.5;
    for (let y = ty; y < ty + dep; y++) { const t = (y - ty) / dep, w = Math.max(0, Math.round((1 - t) * hw));
      for (let x = Math.round(cx - w - 0.5); x <= Math.round(cx + w - 0.5); x++) p.set(x, y, S[x < cx - w + 1 ? 1 : 2]);
      p.set(Math.round(cx - w - 1.5), y, m[4]); p.set(Math.round(cx + w + 0.5), y, m[2]); }
    if (!fem) { p.set(Math.round(cx - 2), ty + 2, S[1]); p.set(Math.round(cx + 1), ty + 2, S[1]); }   // clavículas
    // solapas que se levantan un poco sobre los hombros
    p.set(tx0 + 1, ty - 1, m[4]); p.set(tx0 + 2, ty - 1, m[3]); p.set(R - 1, ty - 1, m[3]); p.set(R - 2, ty - 1, m[2]);
    // botones gris oscuro, un poco a la izquierda como en la foto
    for (let y = ty + dep + 1; y < waist; y += 2) p.set(Math.round(cx - 1), y, SKR.boton);
  }
  // faldón por fuera del pantalón, con el borde irregular
  for (let x = tx0; x <= R; x++) p.set(x, waist, m[(x === tx0 || x === R) ? 1 : (x & 1) ? 2 : 3]);
}, { skin: true });
// --- pantalón corto por debajo de la rodilla, malva con enredaderas y estrellas; pierna de piel debajo ---
fitKind('legs', 'pel_bermuda', (p, A, s) => {
  const { legTop, base } = A, m = s.m, cols = new Set(m), S = skSkin(A, s);
  // la pierna es corta: la última fila de tela antes del pie es piel (espinilla al aire), la anterior el dobladillo
  let last = -1; for (let y = legTop; y < base; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) last = y;
  if (last < 0) return; const hem = last - 1, sx = new Set();
  for (let y = legTop; y <= last; y++) for (let x = 0; x < p.w; x++) { const c = p.get(x, y); if (!cols.has(c)) continue; const k = m.indexOf(c);
    if (y === last) { p.set(x, y, S[Math.min(S.length - 1, Math.max(0, k - 1))]); continue; }
    if (y === hem) { p.set(x, y, m[1]); continue; }
    // estrella amarilla y enredadera verde: una de cada por pierna, en sitios fijos
    const col = (x - (A.side ? 0 : A.cx < x ? 1 : 0)) & 3;
    if (y === hem - 1 && col === 1) p.set(x, y, SKR.estrella[1]); else if (y === hem - 1 && col === 2) p.set(x, y, SKR.hoja[1]);
    else if (y === hem - 2 && col === 2) p.set(x, y, SKR.estrella[2]); else if (y === hem - 2 && col === 0) p.set(x, y, SKR.hoja[0]);
  }
}, { skin: true });
// --- capa negra sobre los hombros, larga, con el cuello levantado en punta ---
fitKind('back', 'pel_capa', (p, A, s) => {
  const { cx, tw, torsoTop: ty, base, side, up, d, anim, f } = A, K = s.o || SKR.capa, bot = base - 2 - (anim === 'walk' ? (f % 2) : 0), half0 = tw / 2;
  if (up) {
    for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), hw = Math.round(half0 + 1 + t * 3);
      for (let x = cx - hw; x < cx + hw; x++) { let c = K[2]; if (x <= cx - hw + 1) c = K[3]; else if (x >= cx + hw - 2) c = K[1]; else if ((x - cx + 41) % 5 === 0 && t > 0.15) c = K[1]; else if ((x - cx + 43) % 5 === 0 && t > 0.15) c = K[3]; if (y === bot && (x + f) % 3 === 0) continue; p.set(x, y, c); } }
    for (let x = cx - half0 - 2; x < cx + half0 + 2; x++) { p.set(x, ty - 2, K[3]); p.set(x, ty - 3, K[2]); }
  } else if (side) {
    for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), w = Math.round(3 + t * 4) + (anim === 'walk' ? (f % 2) : 0), x0 = cx - d * 2;
      for (let i = 0; i < w; i++) p.set(x0 - d * i, y, i === w - 1 ? K[1] : i === 0 ? K[3] : K[2]); }
    for (let k = 0; k < 3; k++) p.set(cx - d * (1 + k), ty - 2 - (k === 1 ? 1 : 0), K[3]);
  } else {
    for (let y = ty; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), hw = Math.round(half0 + 2 + t * 3);
      for (let x = cx - hw; x < cx + hw; x++) { if (y >= A.legTop && Math.abs(x - cx + 0.5) < half0 - 0.5) continue; p.set(x, y, x <= cx - hw ? K[3] : x >= cx + hw - 1 ? K[1] : K[2]); } }
    // cuello alto en punta a los dos lados del cuello
    for (const sg of [-1, 1]) { const x0 = Math.round(cx + sg * (half0 - 1)) - (sg > 0 ? 1 : 0); for (let k = 0; k < 4; k++) { p.set(x0 + sg * k, ty - 1 - (k >> 1), K[k === 3 ? 4 : 3]); p.set(x0 + sg * k, ty - (k >> 1), K[2]); } }
  }
});
// la capa va encima de los hombros: tapa la parte alta de los brazos y el borde de los hombros
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments);
  try { if (L && L.back && L.back.k === 'pel_capa' && p.t && p.meta && !p.meta.up) { const A = p.meta, K = L.back.o || SKR.capa, ty = A.torsoTop, x0 = A.tx0, x1 = A.tx0 + A.tw - 1;
    for (let y = ty - 1; y <= ty + 3; y++) for (let x = 0; x < p.w; x++) { const i = y * p.w + x, tg = p.t[i];
      if (tg === 3 && y <= ty + 2) p.d[i] = K[y === ty - 1 ? 3 : 2];
      else if (tg === 2 && !A.side && y <= ty + 1 && (x === x0 || x === x1)) p.d[i] = K[3]; } } } catch (e) { }
  return r; }; }
// las mangas van remangadas: del codo para abajo se ve el antebrazo
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments);
  try { if (L && L.top && L.top.k === 'pel_camisa' && p.t && p.meta) { const A = p.meta, M = L.top.m, S = skSkin(A, L.top), ey = A.torsoTop + Math.round(A.th * 0.5);
    for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3) { const y = (i / p.w) | 0, k = M.indexOf(p.d[i]); if (k < 0) continue; if (y > ey + 1) p.d[i] = S[Math.min(S.length - 1, Math.max(0, k - 1))]; else if (y >= ey) p.d[i] = M[4]; } } } catch (e) { }
  return r; }; }
// la piel del personaje viaja en la prenda (también con transformaciones que la cambian)
{ const _hl = heroLook; heroLook = function (cls, app, gear, cos, o) { const L = _hl.apply(this, arguments);
  try { if (!L) return L; const SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c);
    if (L.top && L.top.k === 'pel_camisa') L.top = Object.assign({}, L.top, { sk: SK });
    if (L.bot && L.bot.k === 'pel_bermuda') L.bot = Object.assign({}, L.bot, { sk: SK }); } catch (e) { } return L; }; }

// ---------- cosméticos y botín ----------
const SKR_SRC = L2('Duelo con Shanks (Foosha): 30 % por victoria, seguro a las 15', 'Duel with Shanks (Foosha): 30% per win, guaranteed by the 15th');
cosm('c_pel_camisa', L2('Camisa Abierta del Pelirrojo', 'Red Hair\'s Open Shirt'), 'body', () => ({ k: 'pel_camisa', m: SKR.camisa, s: SKR.camisa }), { src: SKR_SRC });
cosm('c_pel_bermuda', L2('Pantalón Corto del Pelirrojo', 'Red Hair\'s Knee Shorts'), 'legs', () => ({ k: 'pel_bermuda', m: SKR.pant, s: SKR.pant }), { src: SKR_SRC });
cosm('c_pel_capa', L2('Capa Negra del Pelirrojo', 'Red Hair\'s Black Cloak'), 'back', () => ({ k: 'pel_capa', o: SKR.capa }), { src: SKR_SRC });
const SKR_IDS = ['c_pel_camisa', 'c_pel_bermuda', 'c_pel_capa'], SKR_CH = 0.30, SKR_PITY = 15;
for (const id of SKR_IDS) it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: 40000, icon: ['hanger'], rar: 5, d: L2('Cosmético de la ropa de Shanks. ', 'Cosmetic from Shanks\'s clothes. ') + SKR_SRC + '.' });
const skrMiss = () => { const W = (G.P && G.P.wardrobe) || []; return SKR_IDS.filter(id => !W.includes(id)); };
const skrLeft = id => { const P = G.P, n = (P && P.skPity && P.skPity[id]) || 0; return Math.max(1, SKR_PITY - n); };
{ const _bk = bossKilled; bossKilled = function (m) { const r = _bk.apply(this, arguments);
  try { const P = G.P; if (m && m.mid === SH_BOSS && P) { const miss = skrMiss(); if (miss.length) { P.skPity = P.skPity && typeof P.skPity === 'object' ? P.skPity : {}; const got = [], mul = typeof dropEventMul === 'function' ? dropEventMul() : 1;
    for (const id of miss) { const n = (P.skPity[id] || 0) + 1; if (n >= SKR_PITY || Math.random() < SKR_CH * mul) { delete P.skPity[id]; giveCosmetic(id, true); got.push(id); } else P.skPity[id] = n; }
    if (got.length) { lootFx(m.x, m.y, 'cosi_' + got[0]); setTimeout(() => { for (const id of got) toast('🧥 ' + L2('Nuevo cosmético: ', 'New cosmetic: ') + COSM[id].n, 'quest', 6); banner('🧥 ' + L2('Ropa del Pelirrojo', 'Red Hair\'s clothes'), L2('Shanks: «Te queda bien. Cuídala.»', 'Shanks: "It suits you. Look after it."')); }, 3400); }
    else setTimeout(() => toast('🧥 ' + L2('Ropa del Pelirrojo: 30 % por prenda · segura en ', 'Red Hair\'s clothes: 30% per piece · guaranteed in ') + Math.min(...skrMiss().map(skrLeft)), 'info', 5), 2600);
    markDirty(true); } } } catch (e) { } return r; }; }
if (typeof BOSS_EXTRA !== 'undefined') { const prev = BOSS_EXTRA[SH_BOSS]; BOSS_EXTRA[SH_BOSS] = () => (prev ? prev() : []).concat(skrMiss().map(id => ['cosi_' + id, SKR_CH, L2('segura en ', 'sure in ') + skrLeft(id)])); }
// la revancha dice también lo de la ropa
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'dawn_shanks' || !skrMiss().length) return; const o = opts.find(x => x && x.fn === shStart); if (o) o.label += ' · ' + L2('ropa 30 %', 'clothes 30%'); });
{ const _sp = itemSources; itemSources = function (id) { if (SKR_IDS.includes(String(id).replace(/^cosi_/, ''))) return [[SKR_SRC, { loc: [229, 129], m: 'world', t: L2('Capitana Marina (bote a Dawn)', 'Captain Marina (boat to Dawn)') }]]; return _sp.apply(this, arguments); }; }
if (typeof GSIS !== 'undefined') { const g = GSIS.find(x => x[0] === 'crossover583'); if (g) { const f = g[2]; g[2] = () => f().concat([L2('7. Ropa del Pelirrojo (cosméticos, sin estadísticas): Camisa Abierta, Pantalón Corto y Capa Negra. Cada victoria contra Shanks da un 30 % por cada prenda que te falte, y cada una es segura a las 15 victorias sin ella. Se ponen en el Armario.', '7. Red Hair\'s clothes (cosmetics, no stats): Open Shirt, Knee Shorts and Black Cloak. Each win against Shanks gives a 30% chance for every piece you are missing, and each one is guaranteed by the 15th win without it. Wear them from the Wardrobe.')]); } }
