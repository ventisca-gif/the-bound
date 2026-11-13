// ================= HERO ART: gender, 30 hairstyles, layered clothes, visible gear, cosmetics =================
SKINS.push(pal(['#b08474', '#eec6b4', '#fde2d0', '#fff4ea']), pal(['#5a3e22', '#9a6e42', '#ba8c5c', '#d6aa78']));
Object.assign(HAIRS, {
  morado: pal(['#1e0a2e', '#3c1660', '#5e2a92', '#8a52c4']), naranja: pal(['#4a1a06', '#8a3a0c', '#c8641a', '#f09a3a']), turquesa: pal(['#06302e', '#0e5a56', '#1a8e86', '#4ac8bc']),
  cobre: pal(['#3a1408', '#6e2c12', '#a04a20', '#cc7440']), platino: pal(['#6a6252', '#b0a68a', '#e2dabe', '#fffbe8']),
});
Object.assign(EYEC, { gris: '#7a8696', turquesa: '#18b0a8', rosa: '#e0508a', ambar: '#d87a10', negro: '#2e2236' });
const SKIN_ORDER = [4, 0, 1, 5, 2, 3];
const HAIR_ORDER = ['negro', 'castano', 'cobre', 'rojo', 'naranja', 'rubio', 'platino', 'blanco', 'gris', 'rosa', 'morado', 'azul', 'turquesa', 'verde'];
const HAIR_N = { negro: 'Negro', castano: 'Castaño', cobre: 'Cobrizo', rojo: 'Rojo', naranja: 'Naranja', rubio: 'Rubio', platino: 'Platino', blanco: 'Blanco', gris: 'Gris', rosa: 'Rosa', morado: 'Morado', azul: 'Azul', turquesa: 'Turquesa', verde: 'Verde' };
const EYE_ORDER = ['rojo', 'azul', 'verde', 'dorado', 'violeta', 'cafe', 'gris', 'turquesa', 'rosa', 'ambar', 'negro', 'blanco', 'naranja', 'celeste'];
const EYE_N = { rojo: 'Rojo', azul: 'Azul', verde: 'Verde', dorado: 'Dorado', violeta: 'Violeta', cafe: 'Café', gris: 'Gris', turquesa: 'Turquesa', rosa: 'Rosa', ambar: 'Ámbar', negro: 'Negro', blanco: 'Blanco', naranja: 'Naranja', celeste: 'Celeste' };
const CLOTH = {
  rojo: P5(['#3a0a0e', '#6e1418', '#a42228', '#d4403e', '#f07a6a']), granate: P5(['#220610', '#44101e', '#681c30', '#8e2c46', '#b84a66']), naranja: P5(['#3e1606', '#7a3210', '#b4561c', '#e08236', '#f8b468']),
  amarillo: P5(['#4a3608', '#8a6a12', '#c4a020', '#ecce4a', '#fff08e']), verde: P5(['#0c2412', '#16401e', '#22602c', '#3a8a40', '#68b460']), oliva: P5(['#22220c', '#3e3c16', '#5e5a22', '#807a34', '#a8a050']),
  turquesa: P5(['#06282a', '#0c4a4a', '#147070', '#249e96', '#5ad0c0']), azul: P5(['#0a1638', '#162a64', '#22449a', '#3a6ac8', '#70a0ec']), marino: P5(['#070a1a', '#0e1430', '#18224a', '#263666', '#3c5088']),
  morado: P5(['#18082a', '#2e1250', '#4a1e7a', '#6a34a4', '#9a64d0']), rosa: P5(['#3a0e24', '#741e46', '#b03a6c', '#e06898', '#ffa2c4']), blanco: P5(['#6a6a74', '#a4a4b0', '#cfcfd8', '#ececf2', '#ffffff']),
  gris: P5(['#1e1e24', '#34343e', '#4e4e5a', '#6c6c7a', '#9090a0']), negro: P5(['#08080c', '#121218', '#1e1e26', '#2c2c38', '#40404e']), marron: P5(['#1e1008', '#3a2010', '#5a341c', '#7a4a2a', '#9c683e']),
  beige: P5(['#4a4030', '#7e6e52', '#ab9a74', '#d0c09a', '#eee2c4']),
};
const CLOTH_ORDER = ['rojo', 'granate', 'naranja', 'amarillo', 'verde', 'oliva', 'turquesa', 'azul', 'marino', 'morado', 'rosa', 'blanco', 'gris', 'negro', 'marron', 'beige'];
const CLOTH_N = { rojo: 'Rojo', granate: 'Granate', naranja: 'Naranja', amarillo: 'Amarillo', verde: 'Verde', oliva: 'Oliva', turquesa: 'Turquesa', azul: 'Azul', marino: 'Marino', morado: 'Morado', rosa: 'Rosa', blanco: 'Blanco', gris: 'Gris', negro: 'Negro', marron: 'Marrón', beige: 'Beige' };
const TOPS = [['tunic', 'Túnica'], ['shirt', 'Camisa'], ['vest', 'Chaleco'], ['dress', 'Vestido'], ['kimono', 'Kimono'], ['coat', 'Abrigo']];
const BOTS = [['pants', 'Pantalón'], ['shorts', 'Pantalón corto'], ['skirt', 'Falda'], ['baggy', 'Bombacho']];
const SHOES = [['boots', 'Botas'], ['shoes', 'Zapatos'], ['sandals', 'Sandalias']];
// tiers 12-15 metal palettes (oricalco, celestial, abisal, eclipse)
TIERP[12] = pal(['#3a1606', '#7a3010', '#c05a18', '#f0902a', '#ffd080']); TIERP[13] = pal(['#1a2a4a', '#3a5a8a', '#6a9ad0', '#a8d4f8', '#f0fbff']);
TIERP[14] = pal(['#020c14', '#06242e', '#0c4a54', '#1a8a8a', '#5af0e0']); TIERP[15] = pal(['#0a0612', '#1e1030', '#3c1e5a', '#7a40a0', '#f0c050']);
const LEATHER = P5(['#24140a', '#422614', '#64401e', '#86582c', '#a87642']);
const CLOTHT = [null, CLOTH.marron, CLOTH.azul, CLOTH.gris, CLOTH.marino, CLOTH.blanco, CLOTH.beige, CLOTH.turquesa, CLOTH.morado, CLOTH.granate, P5(['#060406', '#140a0c', '#2a0e12', '#4a141a', '#7a2026']), P5(['#7a6a40', '#b8a46a', '#e2d29a', '#f6ecc8', '#ffffff']), CLOTH.naranja, P5(['#4a5a7a', '#7a96c0', '#a8c8ea', '#d6ecff', '#ffffff']), P5(['#020a10', '#062028', '#0a3a44', '#126a6a', '#3ad0c0']), P5(['#06030c', '#140a24', '#26123e', '#3e1e60', '#6a3a90'])];
const LEATHT = t => t <= 2 ? LEATHER : t === 3 ? P5(['#1a0e06', '#2e1a0c', '#462a14', '#5e3a1e', '#7a5030']) : t === 4 ? OUT.ranger.main : TIERP[t].map(c => uMul(c, 0.8));
const DARKT = t => t >= 12 ? TIERP[t].map((c, i) => uMul(c, i < 3 ? 0.55 : 0.7)) : OUT.rogue.main;
const TP = t => TIERP[t] || LEATHER;
// ---- hairstyles (parametric) ----
const HS_F = [
  { n: 'Coleta alta', cap: 'round', bang: 'split', side: 4, back: 0, tail: 'high', ribbon: 1 },
  { n: 'Melena lisa', cap: 'round', bang: 'full', side: 10, back: 17 },
  { n: 'Bob', cap: 'round', bang: 'full', side: 5, back: 5, bw: 1.12 },
  { n: 'Coletas', cap: 'round', bang: 'full', side: 3, back: 0, tail: 'twin', ribbon: 1 },
  { n: 'Moño alto', cap: 'round', bang: 'side', side: 3, back: 0, tail: 'bun' },
  { n: 'Trenza', cap: 'round', bang: 'side', side: 3, back: 2, tail: 'braid' },
  { n: 'Pixie', cap: 'flat', bang: 'side', side: 1, back: 2 },
  { n: 'Ondas largas', cap: 'round', bang: 'side', side: 12, back: 19, bw: 1.22, wave: 1 },
  { n: 'Princesa', cap: 'round', bang: 'full', side: 9, back: 21, hime: 1 },
  { n: 'Dos moños', cap: 'round', bang: 'split', side: 4, back: 0, tail: 'buns' },
  { n: 'Coleta lateral', cap: 'round', bang: 'side', side: 3, back: 0, tail: 'side', ribbon: 1 },
  { n: 'Media melena', cap: 'round', bang: 'long', side: 7, back: 9 },
  { n: 'Rizos', cap: 'volume', bang: 'messy', side: 9, back: 13, bw: 1.3, curl: 1 },
  { n: 'Coleta baja', cap: 'round', bang: 'split', side: 3, back: 1, tail: 'low' },
  { n: 'Salvaje', cap: 'spiky', bang: 'messy', side: 10, back: 18, bw: 1.18, jag: 1 },
  { n: 'Wolfcut', cap: 'volume', bang: 'curtain', side: 9, back: 10, bw: 1.2, jag: 1, layer: 1 },
  { n: 'Rizos cortos', cap: 'volume', bang: 'messy', side: 6, back: 5, bw: 1.4, curl: 2 },
  { n: 'Shag rizado', cap: 'volume', bang: 'full', side: 10, back: 12, bw: 1.32, curl: 2, layer: 1 },
  { n: 'Ondas cortas', cap: 'round', bang: 'side', side: 6, back: 6, bw: 1.16, wave: 1 },
  { n: 'Corte mariposa', cap: 'round', bang: 'curtain', side: 12, back: 16, bw: 1.22, wave: 1, layer: 1 },
  { n: 'Melena rizada', cap: 'volume', bang: 'curtain', side: 13, back: 19, bw: 1.38, curl: 2 },
];
const HS_M = [
  { n: 'Clásico', cap: 'round', bang: 'short', side: 1, back: 3 },
  { n: 'Erizado', cap: 'spiky', bang: 'messy', side: 2, back: 3 },
  { n: 'Despeinado', cap: 'round', bang: 'messy', side: 3, back: 4, jag: 1 },
  { n: 'Hacia atrás', cap: 'swept', bang: 'none', side: 1, back: 4 },
  { n: 'Raya al lado', cap: 'round', bang: 'side', side: 2, back: 3 },
  { n: 'Rapado', cap: 'buzz', bang: 'none', side: 0, back: 1 },
  { n: 'Cresta', cap: 'mohawk', bang: 'none', side: 0, back: 2 },
  { n: 'Melena', cap: 'round', bang: 'split', side: 8, back: 10 },
  { n: 'Samurái', cap: 'swept', bang: 'none', side: 1, back: 0, tail: 'topknot' },
  { n: 'Afro', cap: 'volume', bang: 'none', side: 4, back: 5, bw: 1.35, curl: 1 },
  { n: 'Flequillo largo', cap: 'round', bang: 'long', side: 5, back: 5 },
  { n: 'Undercut', cap: 'flat', bang: 'side', side: 0, back: 1, under: 1 },
  { n: 'Coleta larga', cap: 'round', bang: 'split', side: 3, back: 0, tail: 'low', long: 1 },
  { n: 'Salvaje', cap: 'spiky', bang: 'messy', side: 7, back: 14, jag: 1 },
  { n: 'Calvo', cap: 'bald', bang: 'none', side: 0, back: 0 },
  { n: 'Wolfcut', cap: 'volume', bang: 'curtain', side: 5, back: 7, bw: 1.1, jag: 1, layer: 1 },
  { n: 'Rizos', cap: 'volume', bang: 'messy', side: 3, back: 4, bw: 1.28, curl: 2 },
  { n: 'Cortina', cap: 'round', bang: 'curtain', side: 3, back: 4 },
  { n: 'Mullet', cap: 'round', bang: 'short', side: 2, back: 9, bw: 0.92, jag: 1 },
  { n: 'Ondas surfista', cap: 'round', bang: 'side', side: 6, back: 7, bw: 1.1, wave: 1 },
];
const HERO_ANIMS = ['idle', 'walk', 'atk', 'cast', 'hurt', 'chop', 'mine', 'fish', 'gather', 'dead', 'slam', 'dash', 'wave', 'sit', 'dance', 'cheer', 'dig', 'hug', 'kiss'];
Object.assign(ANIMS, { slam: [24, 3], dash: [27, 1], wave: [28, 2], sit: [30, 1], dance: [31, 4], cheer: [35, 2], dig: [37, 3], hug: [40, 2], kiss: [42, 2] });
// hero-only poses layered on top of poseFor
function heroPose(dir, anim, f, L) {
  if (anim === 'dig') { const ps = poseFor(dir, 'mine', f, L); ps.toolK = 'shovel'; ps.crouch = f === 2 ? 1 : 0; return ps; }
  if (anim === 'slam') { const ps = poseFor(dir, 'atk', f === 2 ? 2 : 0, L); if (f === 0) { ps.crouch = 2; ps.rax = 0; ps.ray = -7; ps.wang = -1.57; ps.lax = 0; ps.lay = -6; } if (f === 1) { ps.jump = 6; ps.rax = 0; ps.ray = -8; ps.wang = -1.7; ps.lay = -7; } if (f === 2) { ps.crouch = 3; ps.lean = 1; } return ps; }
  if (anim === 'dash') { const ps = poseFor(dir, 'walk', 0, L); ps.lean = 2; ps.lax = dir === 'left' ? 4 : dir === 'right' ? -4 : 0; ps.rax = ps.lax; ps.lay = -1; ps.ray = -1; ps.crouch = 1; return ps; }
  if (anim === 'wave') { const ps = poseFor(dir, 'idle', 0, L); ps.rax = (dir === 'left' ? -3 : 3) + (f ? 1 : -1); ps.ray = -9; ps.wang = null; ps.noWeapon = 1; return ps; }
  if (anim === 'sit') { const ps = poseFor(dir, 'idle', 0, L); ps.crouch = 5; ps.sit = 1; ps.lay = 1; ps.ray = 1; return ps; }
  if (anim === 'dance') { const ps = poseFor(dir, 'walk', f, L); ps.bob = f % 2 ? -2 : 0; ps.lay = f % 2 ? -8 : 1; ps.ray = f % 2 ? 1 : -8; ps.lax = f < 2 ? -2 : 2; ps.rax = -ps.lax; ps.noWeapon = 1; return ps; }
  if (anim === 'cheer') { const ps = poseFor(dir, 'idle', 0, L); ps.lay = -9; ps.ray = -9; ps.lax = -2; ps.rax = 2; ps.bob = f ? -2 : 0; ps.jump = f ? 2 : 0; ps.noWeapon = 1; return ps; }
  return poseFor(dir, anim, f, L);
}
function heroStrand(p, pts, w, HP, flow) { for (let k = 0; k + 1 < pts.length; k++) { const [x0, y0] = pts[k], [x1, y1] = pts[k + 1]; const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5)); for (let s = 0; s <= n; s++) { const t = s / n, x = lerp(x0, x1, t), y = lerp(y0, y1, t), ww = w * (flow ? (1 - (k + t) / pts.length * 0.45) : 1); for (let o = -ww / 2; o < ww / 2; o += 1) p.set(Math.round(x + o), Math.round(y), HP[o < -ww / 2 + 1 ? 3 : o >= ww / 2 - 1 ? 1 : 2]); } } }
function drawHero(p, L, dir, anim, f) {
  const B = BODYP.normal, ps = heroPose(dir, anim, f, L), fem = L.g === 'f';
  const side = dir === 'left' || dir === 'right', up = dir === 'up', d = dir === 'left' ? -1 : 1;
  const SK = L.skin || SKINS[0], HP = L.hair, HS = L.hs || HS_F[0];
  const TOP = L.top, BOT = L.bot, FT = L.feet, HD = L.head, BK = L.back;
  const cx = p.w >> 1, base = p.h - 4 - (ps.jump || 0);
  const legTop = base - B.lh + ps.crouch, torsoTop = legTop - B.th + ps.bob + (ps.sit ? 0 : 0), hy = torsoTop - B.hry + 1 - (B === BODYP.normal ? FACE.lift : 0);
  const hx = cx + (side ? -1 : 0) + (side ? d * ps.lean : 0);
  const tw = side ? 8 : (fem ? 9 : 10), tx0 = side ? cx - 4 : cx - (fem ? 4 : 5), th = B.th;
  const W = ps.noWeapon ? null : (anim === 'chop' || anim === 'mine' || anim === 'fish' || anim === 'dig') ? { k: ps.toolK, tier: L.toolTier || 2 } : L.weapon;
  const hideHair = HD && HD.cover === 'full', hood = HD && HD.cover === 'hood';
  const robeLong = TOP.k === 'robe', dressLen = TOP.k === 'dress' ? 6 : 0;
  const TG = p.t ? (k => { p.tg = k; }) : (() => { });   // v4.0 capas para el detalle HD
  p.meta = { cx, torsoTop, tx0, tw, th, legTop, base, dir, side, up, fem, d, hx, hy, anim, f };
  // ---------- legs & feet ----------
  const drawLegs = () => { TG(1);
    const lw = BOT.k === 'baggy' ? 4 : B.lw;
    const legs = side ? [[cx - 1 + d * ps.rfx, ps.rfy, true], [cx - 1 + d * ps.lfx, ps.lfy, false]] : [[cx - Math.ceil(tw / 2) + 1 - (lw > 3 ? 1 : 0), ps.lfy, false], [cx + Math.floor(tw / 2) - lw + (lw > 3 ? 1 : 0), ps.rfy, false]];
    const footRows = FT.k === 'boots' || FT.k === 'sabatons' ? 4 : 2;
    legs.forEach(([lx, ly, back]) => {
      const xx = Math.round(side ? lx - (lw >> 1) : lx), bot = base + ly - (ps.sit ? 2 : 0);
      for (let y = legTop; y < bot; y++) {
        const isFoot = y >= bot - footRows, k = y - legTop; let P;
        if (isFoot) { P = FT.k === 'sandals' ? ((y + xx) % 2 ? SK : FT.m) : FT.m; }
        else if (BOT.k === 'shorts' && k >= 3) P = SK; else if (BOT.k === 'skirt' && k >= 1) P = SK; else P = BOT.m;
        for (let i = 0; i < lw; i++) { let c = back ? P[1] : P[i === 0 ? 3 : i === lw - 1 ? 1 : 2]; if (!isFoot && P === BOT.m) { if ((BOT.k === 'greaves' || BOT.k === 'leathp') && k === 3) c = (BOT.k === 'greaves' ? BOT.m : BOT.s)[back ? 2 : 4]; if (BOT.k === 'wraps' && k % 2 === 1) c = BOT.s[1]; if (BOT.k === 'baggy' && y === bot - footRows - 1) c = P[1]; } if (isFoot && FT.k === 'sabatons' && y === bot - footRows) c = FT.m[back ? 2 : 4]; if (isFoot && y === bot - 1) c = FT.m[back ? 0 : 1]; p.set(xx + i, y, c); }
      }
      if (side) { p.set(xx + (dir === 'left' ? -1 : lw), bot - 1, FT.m[1]); }
    });
  };
  // ---------- torso ----------
  const drawSkirt = (pal_, hem, flare) => { for (let y = legTop - 1; y <= hem; y++) { const t = (y - legTop + 1) / Math.max(1, hem - legTop + 1), ex = Math.round(flare * t); for (let x = tx0 - ex; x < tx0 + tw + ex; x++) p.set(x, y, pal_[x === tx0 - ex ? 3 : x === tx0 + tw + ex - 1 ? 1 : ((x + y) % 4 === 0 ? 1 : 2)]); } p.hl(tx0 - flare, hem, tw + flare * 2, pal_[0]); };
  const drawTorso = () => { TG(2);
    const ty = torsoTop, k = TOP.k, m = k === 'warpaint' ? [SK[0], SK[0], SK[1], SK[2], SK[3]] : TOP.m, s = TOP.s || m;
    if (k === 'robe') { const hem = base - 1, flare = side ? 1 : 2; for (let y = ty + th - 1; y <= hem; y++) { const t = (y - (ty + th)) / (hem - ty - th + 1), ex = Math.round(flare * t); for (let x = tx0 - ex; x < tx0 + tw + ex; x++) p.set(x, y, m[x === tx0 - ex ? 3 : x === tx0 + tw + ex - 1 ? 1 : 2 + ((x + (anim === 'walk' ? f : 0)) % 4 === 0 ? -1 : 0)]); } p.hl(tx0 - flare, hem, tw + flare * 2, s[2]); p.hl(tx0 - flare, hem - 1, tw + flare * 2, s[3]); if (!up) p.vl(cx - (side ? 1 : 0), ty + 1, hem - ty - 1, s[3]); if ((TOP.t || 0) >= 6 && !up) for (let y = ty + th + 2; y < hem - 2; y += 3) { p.set(tx0 + 1, y, s[4]); p.set(tx0 + tw - 2, y + 1, s[4]); } }
    if (dressLen) drawSkirt(m, legTop + dressLen, side ? 1 : 3);
    else if (BOT.k === 'skirt' && k !== 'robe') drawSkirt(BOT.m, legTop + 4, side ? 1 : 2);
    srect(p, tx0, ty, tw, th, m);
    if (fem && !side) { for (const yy of [ty + th - 4, ty + th - 3]) { p.set(tx0, yy, 0); p.set(tx0 + tw - 1, yy, 0); } p.set(tx0 + 1, ty + th - 4, m[1]); p.set(tx0 + tw - 2, ty + th - 4, m[1]); }   // v4.2 cintura
    if (k === 'plate') {
      if (!up) { p.hl(tx0 + 1, ty + 1, tw - 2, m[4]); p.vl(cx - (side ? 1 : 0), ty + 2, th - 3, m[3]); if (fem && !side) { p.set(cx - 3, ty + 3, m[4]); p.set(cx + 2, ty + 3, m[4]); } }
      p.hl(tx0, ty + th - 3, tw, s[2]); p.hl(tx0, ty + th - 2, tw, s[1]); if (!up && !side) p.set(cx, ty + th - 3, (TOP.t || 0) >= 12 ? C('#7af0ff') : GOLD[4]);
      if (!up && !side && (TOP.t || 0) >= 7 && typeof ARM_GEM !== 'undefined' && ARM_GEM[TOP.t]) { const gm = C(ARM_GEM[TOP.t]); p.set(cx - 1, ty + 2, gm); p.set(cx, ty + 2, uMix(gm, C('#ffffff'), 0.5)); p.set(cx - 1, ty + 3, uMul(gm, 0.6)); p.set(cx, ty + 3, gm); p.hl(cx - 2, ty, 4, GOLD[3]); }
      const pr = (TOP.t || 0) >= 9 ? 2.6 : 2.2;
      if (!side) { for (const sx of [tx0 - 2, tx0 + tw - 1]) { p.ball(sx + 1.5, ty + 1.5, pr, 2, m.slice(1)); if ((TOP.t || 0) >= 6) p.set(sx + 1, ty, GOLD[4]); if ((TOP.t || 0) >= 9) { p.set(sx + (sx < cx ? -1 : 3), ty - 1, m[4]); p.set(sx + (sx < cx ? -2 : 4), ty - 2, m[3]); } } }
      else p.ball(cx + d * -1, ty + 1.5, 2.5, 2, m.slice(1));
      for (let i = 0; i < tw; i++) p.set(tx0 + i, ty + th, i % 3 === 2 ? m[0] : m[2]);
    } else if (k === 'warpaint') {
      // v3.9 torso descubierto con pintura de guerra propia (chevrón doble + trazos), hombreras y faldones negros; banda negra si es mujer
      const Lc = TOP.l || [C('#b8b8c4'), C('#f4f4fa')], top2 = fem ? ty + 4 : ty + 1;
      if (fem && !up) for (let y = ty + 1; y <= ty + 3; y++) for (let x = tx0; x < tx0 + tw; x++) p.set(x, y, s[y === ty + 1 ? 3 : ((x + y) % 5 ? 2 : 1)]);
      if (fem && up) p.hl(tx0, ty + 2, tw, s[2]);
      if (TOP.nopaint) { } else if (!up && !side) { for (let i = 0; i < 3; i++) { p.set(cx - 3 + i, top2 + i, Lc[1]); p.set(cx + 2 - i, top2 + i, Lc[1]); } p.set(cx - 1, top2 + 3, Lc[0]); p.set(cx, top2 + 3, Lc[0]); for (let y = top2 + 5; y < ty + th - 3; y += 2) { p.set(cx - 3, y, Lc[0]); p.set(cx + 2, y, Lc[0]); } }
      else if (side) { for (let y = top2 + 1; y < ty + th - 3; y += 2) p.set(cx + d, y, Lc[0]); }
      else { p.vl(cx - 1, ty + 1, th - 4, Lc[0]); for (let i = 0; i < 2; i++) { p.set(cx - 3 - i, ty + 2 + i, Lc[0]); p.set(cx + 1 + i, ty + 2 + i, Lc[0]); } }
      p.hl(tx0, ty + th - 3, tw, s[3]); p.hl(tx0, ty + th - 2, tw, s[2]); p.hl(tx0, ty + th - 1, tw, s[1]); if (!up && !side) { p.set(cx - 1, ty + th - 2, Lc[1]); p.set(cx, ty + th - 2, Lc[1]); }
      if (!side) { for (const sx of [tx0, tx0 + tw - 3]) for (let y = ty + th; y <= ty + th + 2; y++) for (let i = 0; i < 3; i++) p.set(sx + i, y, s[y === ty + th + 2 ? 1 : i === 1 ? 3 : 2]); for (const sx of [tx0 - 2, tx0 + tw - 1]) { p.ball(sx + 1.5, ty + 1.5, 2.3, 2, s.slice(1)); p.set(sx + 1, ty, Lc[0]); } }
      else { for (let y = ty + th; y <= ty + th + 2; y++) for (let i = -1; i < 2; i++) p.set(cx + i, y, s[y === ty + th + 2 ? 1 : 2]); p.ball(cx + d * -1, ty + 1.5, 2.5, 2, s.slice(1)); }
    } else if (k === 'robe') {
      p.hl(tx0, ty + th - 2, tw, s[2]); if (!up && !side) { p.set(cx - 1, ty, SK[2]); p.set(cx, ty, SK[2]); p.set(cx, ty + 1, SK[1]); p.vl(cx - 3, ty + 1, th - 3, s[3]); p.vl(cx + 2, ty + 1, th - 3, s[3]); }
    } else if (k === 'leather') {
      if (!up) { p.line(tx0, ty, tx0 + tw - 1, ty + th - 3, s[2]); p.line(tx0 + 1, ty, tx0 + tw - 1, ty + th - 4, s[3]); }
      else p.line(tx0, ty, tx0 + tw - 1, ty + th - 3, s[1]);
      p.hl(tx0, ty + th - 2, tw, LEATHER[1]); if (!up && !side) p.set(cx, ty + th - 2, GOLD[3]);
      if (!side) p.ball(tx0 + tw - 0.5, ty + 1.5, 2, 1.8, s.slice(1));
    } else if (k === 'shadow') {
      p.hl(tx0, ty + th - 2, tw, s[1]); if (!up) { p.line(tx0, ty, tx0 + tw - 1, ty + th - 3, s[2]); p.set(tx0 + 2, ty + th - 1, LEATHER[2]); p.set(tx0 + tw - 3, ty + th - 1, LEATHER[2]); }
      if (!up && !side) { p.hl(cx - 2, ty, 4, m[0]); }
    } else if (k === 'swim') {
      if (!up) { for (let x = tx0; x < tx0 + tw; x++) { p.set(x, ty, SK[2]); if (x < tx0 + 2 || x > tx0 + tw - 3) p.set(x, ty + 1, SK[2]); } if (!side) { p.set(cx - 1, ty + 1, SK[1]); p.set(cx, ty + 1, SK[1]); } }
      else for (let x = tx0; x < tx0 + tw; x++) p.set(x, ty, SK[2]);
      for (let x = tx0; x < tx0 + tw; x += 2) p.set(x, ty + th - 3, s[3]); p.hl(tx0, ty + th - 1, tw, m[1]);
    } else if (k === 'hawaii') {
      for (let y = ty + 1; y < ty + th - 1; y++) for (let x = tx0; x < tx0 + tw; x++) if ((x * 7 + y * 5) % 9 === 0) { p.set(x, y, s[4]); if (x + 1 < tx0 + tw) p.set(x + 1, y, s[2]); }
      if (!up && !side) { p.set(cx - 1, ty, SK[2]); p.set(cx, ty, SK[2]); p.set(cx, ty + 1, SK[1]); p.set(cx - 2, ty, m[4]); p.set(cx + 1, ty, m[4]); p.vl(cx, ty + 2, th - 3, m[1]); }
      p.hl(tx0, ty + th - 1, tw, m[1]);
    } else if (k === 'tunic' || k === 'shirt' || k === 'vest' || k === 'dress' || k === 'kimono' || k === 'coat') {
      if (k === 'vest' && !up) { const sh = CLOTH.blanco; for (let y = ty; y < ty + th - 1; y++) for (let x = cx - 1 - (side ? 1 : 0); x < cx + 1; x++) p.set(x, y, sh[x === cx - 1 ? 3 : 2]); }
      if (k === 'shirt' && !up) { p.hl(tx0 + 2, ty, tw - 4, m[4]); if (!side) for (let y = ty + 2; y < ty + th - 1; y += 2) p.set(cx, y, s[1]); }
      if (k === 'kimono' && !up) { p.line(cx - 3, ty, cx + 1, ty + th - 3, s[3]); p.line(cx - 2, ty, cx + 2, ty + th - 3, s[1]); }
      if (k === 'coat') { for (let y = ty + th - 1; y < legTop + 6; y++) for (const sgn of [-1, 1]) { if (up) { for (let x = tx0; x < tx0 + tw; x++) p.set(x, y, m[(x + y) % 5 ? 2 : 1]); continue; } const x0 = sgn < 0 ? tx0 - (y > legTop + 2 ? 1 : 0) : tx0 + tw - 3 + (y > legTop + 2 ? 1 : 0); for (let i = 0; i < 3; i++) p.set(x0 + i, y, m[i === 0 ? 3 : i === 2 ? 1 : 2]); } if (!up && !side) p.vl(cx - 1, ty + 1, th - 1, m[0]); }
      const belt = k === 'kimono' ? s : k === 'dress' ? s : LEATHER; p.hl(tx0, ty + th - 2, tw, belt[k === 'kimono' ? 2 : 1]); if (k === 'kimono') p.hl(tx0, ty + th - 3, tw, s[3]);
      if (!up && !side && k !== 'kimono' && k !== 'coat') p.set(cx, ty + th - 2, GOLD[3]);
      if (!up && !side && (k === 'tunic' || k === 'dress')) { p.set(cx - 1, ty, SK[2]); p.set(cx, ty, SK[2]); p.set(cx, ty + 1, SK[1]); }
    }
  };
  // ---------- arms ----------
  const plateArm = TOP.k === 'plate', robeArm = TOP.k === 'robe' || TOP.k === 'kimono';
  const sleeve = TOP.k === 'vest' ? CLOTH.blanco : (TOP.k === 'swim' || TOP.k === 'warpaint') ? [SK[0], SK[0], SK[1], SK[2], SK[3]] : TOP.m, handC = plateArm ? TOP.m[3] : SK[2];
  const shortSleeve = TOP.k === 'tunic' || TOP.k === 'dress' || TOP.k === 'hawaii' || TOP.k === 'swim';
  const drawArm = (sx, sy, dx, dy, back) => { TG(3);
    const hx2 = sx + dx, hy2 = sy + B.al + dy, aw = B.aw;
    for (let k = 0; k < aw; k++) { const x0 = sx + k, y0 = sy, x1 = hx2 + k, y1 = hy2 - 1; const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0))); for (let s = 0; s <= n; s++) { const t = s / n, x = Math.round(lerp(x0, x1, t)), y = Math.round(lerp(y0, y1, t)); const P = shortSleeve && t > 0.4 ? SK : sleeve; p.set(x, y, back ? P[1] : P[k === 0 ? 3 : 2]); } }
    if (robeArm && !back) p.rect(Math.round(hx2) - 1, Math.round(hy2) - 2, aw + 1, 1, TOP.m[3]);
    if (TOP.k === 'leather' && !back) p.rect(Math.round(hx2), Math.round(hy2) - 2, aw, 1, TOP.s[2]);
    if (TOP.k === 'warpaint') { p.rect(Math.round(hx2), Math.round(hy2) - 3, aw, 2, TOP.s[back ? 1 : 2]); if (!back) p.set(Math.round(hx2), Math.round(hy2) - 3, (TOP.l || [C('#b8b8c4')])[0]); }
    p.rect(Math.round(hx2), Math.round(hy2) - 1, aw, 2, back ? uMul(handC, 0.75) : handC);
    return [hx2 + aw / 2, hy2];
  };
  // ---------- back items ----------
  const drawBack = () => { TG(4);
    if (!BK) return;
    if (BK.k === 'cape') { const co = BK.o, ci = BK.i || BK.o, trim = BK.tr, top = torsoTop + 1, bot = base - 1 - (anim === 'walk' ? (f % 2) : 0);
      if (up) { for (let y = top; y <= bot; y++) { const t = (y - top) / (bot - top), half = Math.round(lerp(tw / 2, tw / 2 + 3, t)); for (let x = cx - half; x < cx + half; x++) { let c = co[3]; if (x <= cx - half + 1) c = co[4]; if (x >= cx + half - 2) c = co[1]; if ((x - cx + 40 + (ps.sway || 0)) % 4 === 0 && t > 0.2) c = co[2]; if (trim && (x === cx - half || x === cx + half - 1 || y >= bot - 1)) c = trim[y >= bot - 1 ? 2 : 1]; if (y === bot && (x + f) % 3 === 0) continue; p.set(x, y, c); } } p.hl(cx - tw / 2 - 1, top, tw + 2, (trim || co)[2]); if (BK.emb) p.ball(cx, top + 6, 1.6, 1.6, BK.emb); }
      else if (side) { for (let y = top; y <= bot; y++) { const t = (y - top) / (bot - top); const w2 = Math.round(lerp(3, 6, t)) + (anim === 'walk' ? (f % 2) : 0); const x0 = cx + (-d) * 2; for (let i = 0; i < w2; i++) { const x = x0 + (-d) * i; p.set(x, y, i === w2 - 1 ? co[1] : i === 0 ? ci[2] : co[2]); } } }
      else { for (let y = top + 2; y <= bot; y++) { for (const sgn of [-1, 1]) { const x = cx + sgn * (tw / 2 + 1) - (sgn > 0 ? 1 : 0); const ex = Math.round((y - top) / 6); for (let i = 0; i <= ex; i++) p.set(x + sgn * i, y, i === ex ? co[1] : ci[2]); } } }
    } else if (BK.k === 'wings') {
      const wc = BK.o, flap = (anim === 'walk' ? f % 2 : (f % 2)) ? 1 : 0, wy = torsoTop - 1;
      const wing = sgn => { for (let r = 0; r < 9; r++) { const len = Math.round(10 - r * 0.6 + (BK.demon && r % 3 === 0 ? 2 : 0)); for (let i = 0; i < len; i++) { const x = cx + sgn * (3 + i), y = wy + r + Math.round(i * (BK.demon ? 0.15 : -0.25)) - flap * Math.round(i / 4); p.set(x, y, wc[r < 2 ? 4 : r > 6 ? 1 : (i + r) % 4 === 0 ? 2 : 3]); } } };
      if (side) wing(-d); else { wing(-1); wing(1); }
    } else if (BK.k === 'quiver') {
      const qx = up ? cx + 2 : side ? cx + (-d) * 3 : cx + 4, qy = torsoTop - 3; if (!up && !side) return;
      for (let y = qy; y < qy + 10; y++) { p.set(qx, y, LEATHER[2]); p.set(qx + 1, y, LEATHER[1]); } for (let k = 0; k < 3; k++) { p.set(qx - 1 + k, qy - 1 - (k % 2), C('#e8e0d0')); p.set(qx - 1 + k, qy - 2 - (k % 2), BK.o ? BK.o[3] : C('#c03a2a')); }
    }
  };
  const drawScarf = () => { TG(9);
    if (!L.scarf) return; const sc = L.scarf, y0 = torsoTop;
    if (up) { for (let y = y0; y < y0 + 12; y++) { const xx = cx + 2 + Math.round(Math.sin((y + f * 2) * 0.6) * 1); p.set(xx, y, sc[2]); p.set(xx + 1, y, sc[1]); p.set(xx - 1, y, sc[3]); } p.hl(cx - 5, y0, 10, sc[2]); }
    else if (side) { for (let k = 0; k < 9; k++) { const xx = cx + (-d) * (3 + k), yy = y0 + 1 + Math.round(k * 0.4 + Math.sin(k * 0.9 + f * 1.5) * 1); p.set(xx, yy, sc[2]); p.set(xx, yy + 1, sc[1]); } }
    else { p.hl(cx - 5, y0, 10, sc[2]); p.hl(cx - 4, y0 + 1, 8, sc[1]); }
  };
  // ---------- head / face ----------
  const drawHead = () => { TG(5);
    const rx = B.hrx, ry = B.hry;
    for (let y = Math.floor(hy - ry); y <= Math.ceil(hy + ry); y++) for (let x = Math.floor(hx - rx); x <= Math.ceil(hx + rx); x++) { const dx = (x + 0.5 - hx) / rx, dy = (y + 0.5 - hy) / ry; if (dx * dx + dy * dy > 1) continue; let v = 2; if (dx > 0.6 || dy > 0.86) v = 1; if (dx < -0.45 && dy < 0) v = 3; p.set(x, y, SK[v]); }
    if (up) return;
    // v4.2 cara estilo chibi: ojos 2x3 justo bajo el flequillo (brillo arriba, pupila oscura, reflejo abajo), boquita de 2 px
    const ey = Math.round(hy) + FACE.ey, ec = C(EYEC[L.eyes] || EYEC.azul), ed = uMul(ec, 0.5), dark = C('#1a1220'), brow = HP ? HP[0] : dark;
    const eyes = side ? [dir === 'left' ? hx - 5 : hx + 3] : [hx - 4, hx + 3];
    for (const ex of eyes) {
      if (ps.eyes === 'hurt') { p.set(ex, ey, dark); p.set(ex + 1, ey + 1, dark); p.set(ex, ey + 2, dark); continue; }
      if (ps.eyes === 'closed') { p.set(ex, ey + 1, dark); p.set(ex + 1, ey + 1, dark); p.set(ex - 1, ey, dark); p.set(ex + 2, ey, dark); continue; }
      const outer = side ? (dir === 'left' ? ex - 1 : ex + 2) : (ex === hx - 4 ? ex - 1 : ex + 2);
      p.set(ex, ey - 1, dark); p.set(ex + 1, ey - 1, dark); if (fem) p.set(outer, ey - 1, dark);
      const e2 = L.eyes2 && EYEC[L.eyes2] && ((!side && ex !== eyes[0]) || (side && dir === 'right')), ec_ = e2 ? C(EYEC[L.eyes2]) : ec, ed_ = e2 ? uMul(ec_, 0.5) : ed;
      const pup = uMix(ed_, dark, 0.5), ref = uMix(ec_, C('#ffffff'), 0.4);
      p.set(ex, ey, C('#ffffff')); p.set(ex + 1, ey, ed_);
      p.set(ex, ey + 1, ec_); p.set(ex + 1, ey + 1, pup);
      p.set(ex, ey + 2, ref); p.set(ex + 1, ey + 2, ec_);
    }
    const mo = FACE.mouth, mc = uMix(SK[1], C('#d06a6a'), 0.55);
    if (!side) { p.set(hx - 1, ey + mo, mc); p.set(hx, ey + mo, uMix(mc, SK[2], 0.35)); if (fem || L.blush) { p.set(hx - 6, ey + mo - 1, uMix(SK[2], C('#ef8a8a'), 0.6)); p.set(hx + 5, ey + mo - 1, uMix(SK[2], C('#ef8a8a'), 0.6)); } }
    else p.set(dir === 'left' ? hx - 6 : hx + 5, ey + mo, mc);
    if (L.mask && !up) { const mw = side ? 8 : 13, mx = side ? (dir === 'left' ? hx - 7 : hx) : hx - 6; for (let y = ey + 3; y < ey + 7; y++) for (let x = mx; x < mx + mw; x++) { const dx = (x + 0.5 - hx) / B.hrx, dy = (y + 0.5 - hy) / B.hry; if (dx * dx + dy * dy > 1.05) continue; p.set(x, y, L.mask[y === ey + 3 ? 2 : 1]); } }
  };
  // ---------- hair ----------
  const bangY = x => {
    const ax = Math.abs(x + 0.5 - hx);
    switch (HS.bang) {
      case 'full': return hy - 1.5 + (Math.round(ax) % 3 === 1 ? 1 : 0);
      case 'split': return hy - 4 + Math.min(3.2, ax * 0.6) + (Math.round(ax) % 3 === 2 ? 0.6 : 0);
      case 'side': { if (side) return hy - 2.5; const t = (x + 0.5 - (hx - 7)) / 14; return hy - 4.4 + clamp(t, 0, 1) * 3.8; }
      case 'none': return hy - 4.6 + (ax > 5 ? 1 : 0);
      case 'messy': return hy - 2.6 + [0, 1.6, 0.5, 2.1, 0.2][((Math.round(x) % 5) + 5) % 5];
      case 'long': return side ? hy - 1 : (x < hx ? hy + 2.6 : hy - 3);
      case 'short': return hy - 3.2 + (Math.round(x) % 2 ? 0.7 : 0);
      case 'curtain': return side ? hy - 2 : hy - 4.6 + Math.min(5.2, ax * 0.85) + (Math.round(ax) % 3 === 1 ? 0.5 : 0);
    }
    return hy - 1.5;
  };
  const hairPix = (x, y, dx, ny) => { let v = dx < 0.15 ? 2 : 1; if (ny < 0.55 && (x * 7 + y * 3) % 11 === 0 && dx < 0.5) { p.set(x, y, HP[3]); return; } if (ny > 0.1 && ny < 0.22 && dx < 0.45 && dx > -0.8) v = 3; if (ny > 0.22 && ny < 0.3 && dx < 0 && dx > -0.6) v = 2; if (dx > 0.6) v = 0; if (HS.curl && ((x * 3 + y * 5) % 7 === 0)) v = Math.max(0, v - 1); else if (y > hy && (x % 3 === 0)) v = Math.max(0, v - 1); p.set(x, y, HP[v]); };
  const drawCap = () => { TG(6);
    if (!HP || HS.cap === 'bald' || hideHair || hood) return;
    const cap = HS.cap, vol = cap === 'volume', short_ = cap === 'flat' || cap === 'buzz', rx = B.hrx + (vol ? 2.6 : short_ ? 0.4 : 1) + (short_ ? 0 : FACE.vol), ry = B.hry + (vol ? 2 : short_ ? 0.2 : 0.6) + (short_ ? 0 : FACE.vol * 0.8), cyH = hy - (vol ? 2.2 : 1.4) - (short_ ? 0 : 0.5);
    if (cap === 'mohawk') {
      if (up) { for (let y = Math.round(hy - B.hry - 3); y < hy + 5; y++) for (let x = hx - 1; x <= hx + 1; x++) p.set(x, y, HP[x === hx - 1 ? 3 : x === hx ? 2 : 1]); }
      else if (side) { for (let k = 0; k < 11; k++) { const ang = Math.PI * (0.95 - k / 12), x = Math.round(hx + Math.cos(ang) * (B.hrx + 1) * (dir === 'left' ? -1 : 1) * -1), y0 = Math.round(hy - 1.4 - Math.sin(ang) * (B.hry + 1)); for (let h = 0; h < 3; h++) p.set(x, y0 - h, HP[h === 2 ? 3 : 2]); } }
      else { for (let y = Math.round(hy - B.hry - 4); y < hy - 3; y++) for (let x = hx - 1; x <= hx; x++) p.set(x, y, HP[x === hx - 1 ? 3 : 1]); }
      return;
    }
    for (let y = Math.floor(cyH - ry - 1); y <= Math.ceil(hy + ry + 2); y++) for (let x = Math.floor(hx - rx - 1); x <= Math.ceil(hx + rx + 1); x++) {
      const dx = (x + 0.5 - hx) / rx, dy = (y + 0.5 - cyH) / ry; let r2 = dx * dx + dy * dy; if (vol) r2 += Math.sin(Math.atan2(dy, dx) * 9) * 0.06; else if (cap !== 'flat' && cap !== 'buzz') r2 += Math.sin(Math.atan2(dy, dx) * 7 + 1.3) * 0.045;
      if (r2 > 1) continue;
      if (cap === 'buzz' || HS.under) { const top = y < hy - 3 || (up && y < hy + 2) || (side && (dir === 'left' ? x > hx + 2 : x < hx - 3) && y < hy + 1); if (HS.under && !top) continue; if (cap === 'buzz') { if (!top && !up) continue; if ((x + y) % 2 && !(side && (dir === 'left' ? x > hx : x < hx))) { p.set(x, y, HP[1]); continue; } } }
      if (!up) {
        const by = bangY(x) + FACE.bang; let face = false;
        if (side) { const fx = dir === 'left' ? x < hx - 1 : x > hx; if (fx && y >= by) face = true; if ((dir === 'left' ? x < hx - 4 : x > hx + 3) && y >= by - 1) face = true; if (HS.side <= 2 && y >= hy + 1 + FACE.ey && (dir === 'left' ? x < hx + 2 : x > hx - 3)) face = true; }
        else { if (y >= by && Math.abs(x + 0.5 - hx) < B.hrx - 0.6) face = true; if (HS.side <= 2 && y >= hy + 1 + FACE.ey) face = true; if (cap === 'swept' && y >= hy - 4 && Math.abs(x + 0.5 - hx) < B.hrx - 0.6) face = true; }
        if (face) continue;
      }
      const ny = (y + 0.5 - (cyH - ry)) / (ry * 2); hairPix(x, y, dx, ny);
    }
    // side locks
    if (!up && HS.side > 2) { const inner = HS.hime ? B.hrx - 2.6 : B.hrx - 1.5; for (let y = Math.round(hy - 2); y <= hy + HS.side; y++) for (let x = Math.floor(hx - B.hrx - 2); x <= Math.ceil(hx + B.hrx + 2); x++) { const ax = Math.abs(x + 0.5 - hx); if (ax <= inner || ax >= B.hrx + 1.2 + FACE.vol * 0.6 + (HS.wave ? Math.sin(y * 0.9) * 0.8 : Math.sin(y * 0.8) * 0.5) + (HS.curl === 2 ? Math.abs(Math.sin(y * 1.9)) * 1.4 : 0)) continue; if (HS.layer && (y - Math.round(hy)) % 4 === 3 && ax > B.hrx + 0.2 && x % 2) continue; if (side && (dir === 'left' ? x <= hx : x >= hx)) continue; if (HS.jag && y === Math.round(hy + HS.side) && x % 2) continue; p.set(x, y, HP[x < hx ? 2 : 1]); } }
    // spikes
    if (cap === 'spiky') { const top = cyH - ry; if (side) { for (let k = 0; k < 4; k++) { const bx = hx + (dir === 'left' ? 1 : -1) * (-2 + k * 2.4), by0 = top + 1 + k * 1.6; const tipx = bx + (dir === 'left' ? 1 : -1) * 4, tipy = by0 - 2.5 + k * 0.6; p.poly([[bx - 1.4, by0 + 1.2], [bx + 1.4, by0 + 1.6], [tipx, tipy]], HP[k % 2 ? 2 : 1]); } } else { for (let k = -2; k <= 2; k++) { const bx = hx + k * 3, tipx = bx + k * 0.9, tipy = top - 2.5 + Math.abs(k) * 0.9; p.poly([[bx - 1.6, top + 2], [bx + 1.6, top + 2], [tipx, tipy]], HP[k < 0 ? 3 : k === 0 ? 2 : 1]); } } }
  };
  const drawBackHair = () => { TG(6);
    if (!HP || HS.cap === 'bald' || hood) return;
    if (HS.back > 0) { const top = hy - 3, bot = hy + HS.back, bw = HS.bw || 1;
      for (let y = top; y <= bot; y++) { const t = (y - top) / Math.max(1, bot - top); const half = (up ? lerp(7.6, 5, t) : lerp(9.4, 7.8, t)) * bw + (HS.wave ? Math.sin(y * 0.7) * 0.7 : 0) + (HS.curl === 2 ? Math.sin(y * 1.9) * 1.2 : 0) - (HS.layer ? Math.floor(t * 3) * 0.9 : 0); for (let x = Math.round(hx - half); x <= Math.round(hx + half) - (side ? 0 : 1); x++) { if (side && (dir === 'left' ? x < hx - 1 : x > hx + 1)) continue; if (y === bot && (x + y) % 2) continue; if (HS.jag && y >= bot - 1 && (x % 3 === 0)) continue; let c = x < hx ? HP[2] : HP[1]; if ((x - hx + 30) % 3 === 0) c = HP[x < hx ? 1 : 0]; if (HS.curl === 2 && (x * 5 + y * 3) % 6 === 0) c = HP[3]; else if (HS.curl === 2 && (x * 5 + y * 3) % 6 === 3) c = HP[0]; if (x === Math.round(hx - half)) c = HP[3]; if (up && y > top + 2 && y < top + 5 && x < hx + 2) c = HP[3]; p.set(x, y, c); } } }
  };
  const ribbon = (x, y) => { const rc = L.ribbonC || pal(['#5a0a14', '#9a1424', '#d02a3a', '#f05a64']); p.rect(x - 1, y, 3, 2, rc[2]); p.set(x - 2, y - 1, rc[3]); p.set(x + 2, y - 1, rc[3]); p.set(x - 2, y + 2, rc[1]); p.set(x + 2, y + 2, rc[1]); p.set(x, y, rc[3]); };
  const sway = (anim === 'walk' || anim === 'dance') ? (f % 2 ? 1 : -1) : (anim === 'idle' ? (f ? 0.5 : 0) : 0);
  // tails: drawn in 'back' layer (behind head) or 'front' layer
  const drawTails = layer => { TG(6);
    if (!HP || !HS.tail || hood) return; const t = HS.tail;
    if (t === 'high') {
      if (up) { if (layer !== 'front') return; heroStrand(p, [[hx, hy - 6], [hx + sway * 0.5, hy + 2], [hx + sway, hy + 10], [hx + sway * 1.5, hy + 15]], 4, HP, 1); if (HS.ribbon) ribbon(hx, hy - 7); return; }
      if (side) { if (layer !== 'back') return; const bx = hx - d * 6; heroStrand(p, [[bx, hy - 7], [bx - d * 3, hy - 4], [bx - d * 4 + sway, hy + 3], [bx - d * 3 + sway, hy + 11]], 4, HP, 1); if (HS.ribbon) ribbon(bx, hy - 8); return; }
      if (layer === 'back') heroStrand(p, [[hx + 4, hy - 7], [hx + 8, hy - 3], [hx + 8 + sway * 0.5, hy + 4], [hx + 7 + sway, hy + 11]], 3, HP, 1); else if (HS.ribbon) ribbon(hx + 5, hy - 8); return;
    }
    if (t === 'low') { const len = HS.long ? 16 : 11;
      if (up) { if (layer === 'front') heroStrand(p, [[hx, hy + 3], [hx + sway * 0.5, hy + 3 + len * 0.6], [hx + sway, hy + 3 + len]], 3, HP, 1); return; }
      if (side && layer === 'back') heroStrand(p, [[hx - d * 5, hy + 2], [hx - d * 6, hy + 2 + len * 0.5], [hx - d * 6 + sway, hy + 2 + len]], 3, HP, 1); return; }
    if (t === 'twin') { const tl = (sx, bend) => heroStrand(p, [[hx + sx, hy - 5], [hx + sx * 1.35, hy - 1], [hx + sx * 1.4 + bend, hy + 6], [hx + sx * 1.2 + bend, hy + 13]], 3, HP, 1);
      if (up) { if (layer === 'front') { tl(-6, sway); tl(6, sway); if (HS.ribbon) { ribbon(hx - 6, hy - 6); ribbon(hx + 6, hy - 6); } } return; }
      if (side) { if (layer === 'back') { tl(-d * 5, sway); if (HS.ribbon) ribbon(hx - d * 5, hy - 6); } return; }
      if (layer === 'back') { tl(-7, -sway * 0.5); tl(7, sway * 0.5); } else if (HS.ribbon) { ribbon(hx - 7, hy - 6); ribbon(hx + 7, hy - 6); } return; }
    if (t === 'side') { const sx = side ? -d * 1 : 7;
      if (side) { if (layer === 'back') heroStrand(p, [[hx - d * 5, hy - 3], [hx - d * 7, hy + 2], [hx - d * 6 + sway, hy + 12]], 3, HP, 1); return; }
      if (layer === 'front' && !up) { heroStrand(p, [[hx + 6, hy - 2], [hx + 8, hy + 3], [hx + 7 + sway * 0.5, hy + 13]], 3, HP, 1); if (HS.ribbon) ribbon(hx + 7, hy - 3); }
      if (layer === 'front' && up) heroStrand(p, [[hx - 6, hy - 2], [hx - 8, hy + 3], [hx - 7, hy + 12]], 3, HP, 1); return; }
    if (t === 'braid') { const pts = side ? [[hx - d * 4, hy + 1], [hx - d * 5, hy + 7], [hx - d * 5, hy + 15]] : up ? [[hx, hy + 2], [hx, hy + 9], [hx + sway * 0.5, hy + 16]] : [[hx - 5, hy + 1], [hx - 6, hy + 7], [hx - 5, hy + 15]];
      if ((side || up) ? layer === (up ? 'front' : 'back') : layer === 'front') { for (let k = 0; k + 1 < pts.length; k++) { const [x0, y0] = pts[k], [x1, y1] = pts[k + 1]; for (let y = Math.round(y0); y <= y1; y++) { const t2 = (y - y0) / (y1 - y0), x = Math.round(lerp(x0, x1, t2)), z = (y % 3); p.set(x - 1, y, HP[z === 0 ? 3 : 2]); p.set(x, y, HP[z === 1 ? 3 : 1]); p.set(x + 1, y, HP[z === 2 ? 2 : 0]); } } const [ex, ey] = pts[pts.length - 1]; p.rect(Math.round(ex) - 1, Math.round(ey), 3, 1, (L.ribbonC || pal(['#5a0a14', '#9a1424', '#d02a3a', '#f05a64']))[2]); } return; }
    if (t === 'bun') { if (layer !== (up ? 'front' : 'back')) return; p.ball(hx + (side ? -d * 3 : 0), hy - B.hry - 1.5, 3.4, 3, HP); return; }
    if (t === 'buns') { if (layer !== 'back' && !up) return; if (up && layer !== 'front') return; for (const s2 of side ? [-d] : [-1, 1]) p.ball(hx + s2 * 5, hy - B.hry, 2.8, 2.6, HP); return; }
    if (t === 'topknot') { if (layer !== (up ? 'front' : 'back')) return; p.ball(hx + (side ? -d * 1 : 0), hy - B.hry - 2, 2.2, 2, HP); p.rect(hx - 1 + (side ? -d : 0), hy - B.hry - 0.5, 2, 1, C('#c02030')); return; }
  };
  // ---------- headgear ----------
  const drawHeadgear = () => { TG(7);
    if (!HD) return; const k = HD.k, m = HD.m || IRON, s = HD.s || GOLD.slice(1), top = hy - B.hry - 1;
    if (k === 'helm' || k === 'winged' || k === 'crownhelm' || k === 'horned') {
      for (let y = Math.floor(top); y <= hy + 2; y++) for (let x = hx - 8; x <= hx + 8; x++) { const dx = (x + 0.5 - hx) / 7.8, dy = (y + 0.5 - (hy - 1)) / 7.2; if (dx * dx + dy * dy > 1) continue; const face = !up && y > hy - 2 && (side ? (dir === 'left' ? x < hx : x > hx - 1) : Math.abs(x + 0.5 - hx) < 4.5); if (face) continue; p.set(x, y, m[dx < -0.4 && dy < 0 ? 4 : dx > 0.5 ? 1 : 2]); }
      p.hl(hx - 7, Math.round(hy - 2), 15, m[3]); if (!up && !side) { p.vl(hx, Math.round(top) + 1, 5, m[4]); if ((HD.t || 0) >= 3) p.vl(hx, Math.round(hy - 2), 3, m[3]); }
      if (k === 'winged') for (const sg of side ? [-d] : [-1, 1]) for (let r = 0; r < 4; r++) for (let i = 0; i < 5 - r; i++) p.set(hx + sg * (7 + i), Math.round(top) + 2 + r - Math.round(i * 0.6), s[r === 0 ? 3 : 2]);
      if (k === 'crownhelm') { const y0 = Math.round(top) - 1; for (const x of [-5, -2, 1, 4]) { p.set(hx + x, y0, GOLD[4]); p.set(hx + x, y0 + 1, GOLD[3]); } p.hl(hx - 5, y0 + 2, 11, GOLD[3]); if (!up) p.set(hx, y0 + 3, C('#e02040')); }
      if (k === 'horned') { for (const sg of side ? [-d] : [-1, 1]) for (let k2 = 0; k2 < 7; k2++) { p.set(hx + sg * (6 + Math.round(k2 * 0.55)), Math.round(top) + 2 - k2, s[k2 > 4 ? 4 : 3]); p.set(hx + sg * (7 + Math.round(k2 * 0.55)), Math.round(top) + 2 - k2, s[2]); } if (!up && !side) p.ball(hx, Math.round(top) + 3, 1.3, 1.3, [C('#2a6a8a'), C('#5ae0ff'), C('#e8ffff')]); }
    } else if (k === 'cap') { for (let y = Math.floor(top); y <= hy - 2; y++) for (let x = hx - 8; x <= hx + 8; x++) { const dx = (x + 0.5 - hx) / 8, dy = (y + 0.5 - (hy - 1.5)) / 7; if (dx * dx + dy * dy > 1) continue; p.set(x, y, m[dx < -0.4 ? 4 : dx > 0.5 ? 1 : 2]); } if (!up) { const bx = side ? (dir === 'left' ? hx - 10 : hx + 2) : hx - 6; p.hl(bx, Math.round(hy - 2), side ? 8 : 13, m[1]); } p.hl(hx - 7, Math.round(hy - 3), 15, s[2]); }
    else if (k === 'wizard') { const brimY = Math.round(hy - 3); p.hl(hx - 9, brimY, 18, m[1]); p.hl(hx - 8, brimY - 1, 16, m[2]); const tall = (HD.t || 0) >= 6 ? 13 : 11; for (let y = 0; y < tall; y++) { const half = Math.round(lerp(6, 1, y / tall)); const lean = up ? 0 : Math.round(y * y / 30) * (side && dir === 'right' ? -1 : 1); for (let x = hx - half; x <= hx + half; x++) p.set(x + lean, brimY - 2 - y, m[x === hx - half ? 3 : x === hx + half ? 1 : 2]); } p.hl(hx - 6, brimY - 2, 13, s[2]); p.set(hx - 2, brimY - 3, s[4]); if ((HD.t || 0) >= 9 && !up) { p.set(hx + 1, brimY - 6, C('#fff6c0')); p.set(hx - 1, brimY - 9, C('#fff6c0')); } }
    else if (k === 'hood') { for (let y = Math.floor(top); y <= hy + 3; y++) for (let x = hx - 8; x <= hx + 8; x++) { const dx = (x + 0.5 - hx) / 8, dy = (y + 0.5 - (hy - 1)) / 7.5; if (dx * dx + dy * dy > 1) continue; let face = false; if (!up) { if (side) face = (dir === 'left' ? x < hx - 1 : x > hx) && y > hy - 3; else face = Math.abs(x + 0.5 - hx) < 5 && y > hy - 3; } if (face) continue; p.set(x, y, m[dx < -0.5 ? 3 : dx > 0.5 ? 1 : 2]); } if (!up) p.hl(hx - 4, Math.round(hy - 3), side ? 4 : 9, s[2] || m[0]); }
    else if (k === 'ranger') { const y0 = Math.round(hy - 4); for (let y = y0 - 3; y <= y0; y++) for (let x = hx - 7; x <= hx + 7; x++) { const dx = (x + 0.5 - hx) / 7.5, dy = (y + 0.5 - y0) / 4; if (dx * dx + dy * dy > 1) continue; p.set(x, y, m[dx < -0.3 ? 3 : dx > 0.5 ? 1 : 2]); } p.hl(hx - 8, y0 + 1, 17, m[1]); const fx = side ? hx - d * 5 : hx + 5; for (let k2 = 0; k2 < 7; k2++) { p.set(fx + Math.round(k2 * 0.5) * (side ? -d : 1), y0 - k2, s[k2 < 2 ? 2 : 3]); if (k2 > 1) p.set(fx + Math.round(k2 * 0.5) * (side ? -d : 1) + 1, y0 - k2, s[4]); } }
    else if (k === 'sunhat') { const y0 = Math.round(hy - 4); for (let x = hx - 11; x <= hx + 11; x++) { const e = Math.abs(x - hx) > 8 ? 1 : 0; p.set(x, y0 + e, m[2]); if (Math.abs(x - hx) < 10) p.set(x, y0 + 1 + e, m[1]); } for (let y = y0 - 5; y < y0; y++) for (let x = hx - 6; x <= hx + 6; x++) { const dx = (x + 0.5 - hx) / 6.5, dy = (y + 0.5 - y0) / 5.5; if (dx * dx + dy * dy > 1) continue; p.set(x, y, m[(x + y) % 3 ? 3 : 2]); } p.hl(hx - 6, y0 - 1, 13, s[2]); if (!up) p.set(hx + (side ? -d * 4 : 4), y0 - 1, C('#ff5a7a')); }
    else if (k === 'shades') { if (up) { p.hl(hx - 7, Math.round(hy) - 1, 15, C('#141018')); } else if (side) { const ex = dir === 'left' ? hx - 6 : hx + 2; p.rect(ex, Math.round(hy) - 1, 4, 2, C('#141018')); p.set(ex + (dir === 'left' ? 0 : 3), Math.round(hy) - 1, m[3]); p.hl(dir === 'left' ? ex + 4 : hx - 6, Math.round(hy) - 1, 4, C('#141018')); } else { for (const ex of [hx - 5, hx + 2]) { p.rect(ex, Math.round(hy) - 1, 4, 2, C('#141018')); p.set(ex, Math.round(hy) - 1, m[3]); } p.hl(hx - 1, Math.round(hy) - 1, 3, C('#141018')); } }
    else if (k === 'circlet') { const y0 = Math.round(hy - 4); p.hl(hx - 7, y0, 15, GOLD[3]); p.hl(hx - 6, y0 - 1, 13, GOLD[4]); if (!up && !side) p.ball(hx, y0, 1.5, 1.5, s.slice(1)); }
    else if (k === 'crown') { const y0 = Math.round(top) + 1; p.rect(hx - 5, y0, 11, 3, GOLD[3]); p.hl(hx - 5, y0, 11, GOLD[5]); for (const x of [-5, -2, 1, 4]) { p.set(hx + x, y0 - 1, GOLD[4]); p.set(hx + x + 1, y0 - 2, GOLD[4]); } p.set(hx, y0 + 1, C('#e02040')); }
    else if (k === 'catears') { const ec = HD.m || HP; for (const sg of side ? [-d * 0.3, 1] : [-1, 1]) { const ex = hx + sg * 5; for (let r = 0; r < 4; r++) for (let i = -2 + Math.ceil(r / 2); i <= 2 - Math.ceil(r / 2); i++) p.set(Math.round(ex + i), Math.round(top) + 1 - r, ec[r === 0 ? 1 : i === 0 && r < 3 ? 3 : 2]); if (!side) p.set(Math.round(ex), Math.round(top), C('#f0a0b0')); } }
    else if (k === 'flowers') { const y0 = Math.round(hy - 5); for (let i = -7; i <= 7; i += 2) { const fc = [C('#f05a8a'), C('#ffe060'), C('#ffffff'), C('#a070f0')][((i + 7) / 2) % 4]; if (side && (dir === 'left' ? i < -3 : i > 3)) continue; p.set(hx + i, y0 + Math.round(Math.abs(i) * 0.25), fc); p.set(hx + i, y0 - 1 + Math.round(Math.abs(i) * 0.25), uMul(fc, 0.8)); } p.hl(hx - 7, y0 + 1, 15, C('#3a8a40')); }
    else if (k === 'slimehat') { p.ball(hx, top + 1, 7, 4.5, pal(['#1a5a1a', '#3a9a2a', '#6ad04a', '#b8f890'])); if (!up) { p.set(hx - 2, Math.round(top), C('#102010')); p.set(hx + 2, Math.round(top), C('#102010')); } p.set(hx - 3, Math.round(top) - 2, C('#ffffff')); }
    else if (k === 'witchhat') { const brimY = Math.round(hy - 3); p.hl(hx - 10, brimY, 20, m[1]); p.hl(hx - 9, brimY - 1, 18, m[2]); for (let y = 0; y < 13; y++) { const half = Math.round(lerp(6, 0.5, y / 13)); const bend = Math.round(Math.max(0, y - 7) * 0.8) * (side && dir === 'right' ? -1 : 1); for (let x = hx - half; x <= hx + half; x++) p.set(x + bend, brimY - 2 - y, m[x === hx - half ? 3 : x === hx + half ? 1 : 2]); } p.hl(hx - 6, brimY - 2, 13, s[2]); }
    else if (k === 'halo') { const y0 = Math.round(top) - 4; for (let i = -5; i <= 5; i++) { p.set(hx + i, y0 - (Math.abs(i) < 4 ? 1 : 0), C('#fff6b0')); p.set(hx + i, y0 + (Math.abs(i) < 4 ? 1 : 0), C('#f0c040')); } }
    else if (k === 'demonhorns') { for (const sg of side ? [-d] : [-1, 1]) for (let k2 = 0; k2 < 6; k2++) { const x = hx + sg * (4 + Math.round(k2 * 0.4)), y = Math.round(top) + 2 - k2; p.set(x, y, C(k2 > 3 ? '#e8d8c0' : '#3a1a24')); p.set(x + sg, y, C('#1a0a10')); } }
    else if (k === 'bandana') { const y0 = Math.round(hy - 5); for (let x = hx - 7; x <= hx + 7; x++) for (let y = y0; y < y0 + 3; y++) p.set(x, y, m[y === y0 ? 3 : 2]); if (side || up) { p.set(hx + (side ? -d * 8 : 2), y0 + 3, m[2]); p.set(hx + (side ? -d * 9 : 3), y0 + 4, m[1]); } }
  };
  const drawEars = () => { TG(5); if (L.ears !== 'pointy') return; for (const s of side ? [-d] : [-1, 1]) { for (let k = 0; k < 4; k++) p.set(hx + s * (B.hrx + k), Math.round(hy) - k + 1, SK[k === 3 ? 3 : 2]); } };
  // ---------- compose ----------
  const shY = torsoTop + 1, shL = side ? cx - 1 : tx0 - B.aw, shR = side ? cx - 1 : tx0 + tw; const hands = {};
  const drawWeaponNow = () => { TG(8); if (!W || !W.k || ps.wang == null) return; const hh = hands.r || [cx, torsoTop + B.al]; drawWeapon(p, W, hh[0], hh[1], ps.wang, ps.wph); if ((W.k === 'dagger' || W.dual) && hands.l) drawWeapon(p, W, hands.l[0], hands.l[1], ps.dual ? ps.wang : { down: 1.9, up: -1.9, left: 2.4, right: 0.7 }[dir], 0); };
  const headAll = () => { drawEars(); drawHead(); drawCap(); };
  if (up) {
    hands.r = [shR + B.aw / 2 + ps.rax, shY + B.al + ps.ray]; hands.l = [shL + B.aw / 2 + ps.lax, shY + B.al + ps.lay];
    drawWeaponNow(); drawLegs(); drawTorso(); drawArm(shL, shY, ps.lax, ps.lay); drawArm(shR, shY, ps.rax, ps.ray); drawBack(); headAll(); drawBackHair(); drawTails('front'); drawHeadgear(); drawScarf();
  } else if (side) {
    hands.l = drawArm(cx - 1 - d, shY, ps.lax, ps.lay, true);
    drawBack(); drawScarf(); drawBackHair(); drawTails('back'); drawLegs(); drawTorso(); headAll(); drawTails('front'); drawHeadgear();
    hands.r = drawArm(cx - 2, shY, ps.rax, ps.ray, false); drawWeaponNow();
  } else {
    drawBackHair(); drawTails('back'); drawBack(); drawLegs(); drawTorso(); hands.r = drawArm(shL, shY, ps.rax, ps.ray); hands.l = drawArm(shR, shY, ps.lax, ps.lay); drawScarf(); headAll(); drawTails('front'); drawHeadgear(); drawWeaponNow();
  }
}
// ---------- appearance model ----------
const DEF_APP = { g: 'f', skin: 0, hair: 'negro', hs: 0, eyes: 'rojo', top: [0, 'negro'], bot: [0, 'negro'], shoe: [0, 'marron'] };
function normApp(a) {
  a = Object.assign({}, a || {}); const o = {};
  o.g = a.g === 'm' ? 'm' : 'f'; o.skin = clamp(a.skin | 0, 0, SKINS.length - 1); o.hair = HAIRS[a.hair] ? a.hair : 'negro'; if (HAIRS[a.hair2] && a.hair2 !== o.hair) o.hair2 = a.hair2;
  if (typeof a.hs === 'number') o.hs = clamp(a.hs | 0, 0, (o.g === 'm' ? HS_M : HS_F).length - 1); else o.hs = a.style === 'short' ? (o.g === 'f' ? 6 : 0) : 0;
  o.eyes = EYE_ORDER.includes(a.eyes) ? a.eyes : 'rojo'; if (EYE_ORDER.includes(a.eyes2) && a.eyes2 !== o.eyes) o.eyes2 = a.eyes2;
  const cl = v => CLOTH[v] ? v : 'negro';
  o.top = Array.isArray(a.top) ? [clamp(a.top[0] | 0, 0, TOPS.length - 1), cl(a.top[1])] : [0, 'negro'];
  o.bot = Array.isArray(a.bot) ? [clamp(a.bot[0] | 0, 0, BOTS.length - 1), cl(a.bot[1])] : [0, 'negro'];
  o.shoe = Array.isArray(a.shoe) ? [clamp(a.shoe[0] | 0, 0, SHOES.length - 1), cl(a.shoe[1])] : [0, 'marron'];
  return o;
}
// visual spec for one gear slot of a class at a tier
function gearVis(cls, slot, t) {
  if (cls === 'guerrero') {
    if (slot === 'body') return { k: 'plate', m: TP(t), s: OUT.knight.sec, t };
    if (slot === 'legs') return { k: 'greaves', m: TP(t), s: OUT.knight.sec };
    if (slot === 'feet') return { k: 'sabatons', m: TP(t) };
    if (slot === 'head') return { k: t <= 2 ? 'cap' : t <= 5 ? 'helm' : t <= 8 ? 'winged' : t <= 11 ? 'crownhelm' : 'horned', m: TP(t), s: t >= 12 ? TIERP[t] : OUT.knight.sec, t, cover: t <= 2 ? 'hat' : 'full' };
  }
  if (cls === 'mago') {
    const cm = CLOTHT[t] || CLOTH.morado, tr = TIERP[t] || GOLD.slice(1);
    if (slot === 'body') return { k: 'robe', m: t <= 1 ? OUT.robe.main : cm, s: tr, t };
    if (slot === 'legs') return { k: 'pants', m: CLOTH.marino };
    if (slot === 'feet') return { k: 'shoes', m: t <= 1 ? LEATHER : cm };
    if (slot === 'head') return { k: t >= 13 ? 'circlet' : 'wizard', m: t <= 1 ? OUT.robe.main : cm, s: tr, t, cover: 'hat' };
  }
  if (cls === 'arquero') {
    const lm = LEATHT(t), tr = TIERP[t] || OUT.ranger.sec;
    if (slot === 'body') return { k: 'leather', m: t <= 1 ? OUT.ranger.main : lm, s: tr, t };
    if (slot === 'legs') return { k: 'leathp', m: t <= 1 ? OUT.ranger.sec : uMulP(lm, 0.8), s: tr };
    if (slot === 'feet') return { k: 'boots', m: t <= 1 ? OUT.ranger.sec : lm };
    if (slot === 'head') return { k: 'ranger', m: t <= 1 ? OUT.ranger.main : lm, s: t >= 6 ? tr : CLOTH.rojo, t, cover: 'hat' };
  }
  if (cls === 'bardo') {
    const cm = CLOTH[BARDC[t % BARDC.length]] || CLOTH.rojo, tr = t >= 4 ? TIERP[t] : GOLD.slice(1);
    if (slot === 'body') return { k: t <= 1 ? 'vest' : 'coat', m: t <= 1 ? CLOTH.granate : cm, s: tr, t };
    if (slot === 'legs') return { k: t >= 9 ? 'baggy' : 'pants', m: t <= 1 ? CLOTH.beige : uMulP(cm, 0.6), s: tr };
    if (slot === 'feet') return { k: 'boots', m: t <= 1 ? LEATHER : LEATHT(t) };
    if (slot === 'head') return { k: t >= 13 ? 'circlet' : 'ranger', m: t <= 1 ? CLOTH.granate : cm, s: t >= 6 ? tr : CLOTH.amarillo, t, cover: 'hat' };
  }
  if (cls === 'invocador') {
    const dm = t >= 10 ? TIERP[t].map((c, i) => uMul(c, i < 3 ? 0.45 : 0.6)) : CLOTH.negro, ac = t >= 3 ? (t >= 12 ? TIERP[t] : SOULB) : CLOTH.gris;
    if (slot === 'body') return { k: 'robe', m: dm, s: ac, t };
    if (slot === 'legs') return { k: 'wraps', m: CLOTH.negro, s: ac };
    if (slot === 'feet') return { k: 'boots', m: dm };
    if (slot === 'head') return { k: 'hood', m: dm, s: ac, t, cover: 'hood' };
  }
  const dm = DARKT(t), ac = t >= 3 ? TIERP[t] : OUT.rogue.sec;
  if (slot === 'body') return { k: 'shadow', m: dm, s: ac, t };
  if (slot === 'legs') return { k: 'wraps', m: OUT.rogue.cloth, s: ac };
  if (slot === 'feet') return { k: 'boots', m: dm };
  if (slot === 'head') return { k: 'hood', m: dm, s: ac, t, cover: 'hood' };
  return null;
}
const BARDC = ['rojo', 'verde', 'azul', 'granate', 'turquesa', 'morado', 'naranja', 'rosa', 'amarillo', 'marino'], SOULB = P5(['#0a1a3a', '#163a7a', '#2a6ad0', '#5ab0ff', '#c0e8ff']);
function uMulP(P, f) { return P.map(c => uMul(c, f)); }
function baseVis(app, slot) {
  if (slot === 'body') { const k = TOPS[app.top[0]][0], m = CLOTH[app.top[1]]; return { k, m, s: k === 'kimono' ? CLOTH[app.top[1] === 'blanco' ? 'rojo' : 'blanco'] : uMulP(m, 0.7) }; }
  if (slot === 'legs') return { k: BOTS[app.bot[0]][0], m: CLOTH[app.bot[1]], s: uMulP(CLOTH[app.bot[1]], 0.7) };
  if (slot === 'feet') return { k: SHOES[app.shoe[0]][0], m: CLOTH[app.shoe[1]] };
  return null;
}
// full look for a hero. gear: {weapon,head,body,legs,feet} tiers; cos: {slot: cosmetic id | 'base'}; shoeK
function heroLook(cls, app, gear, cos, opts) {
  app = normApp(app); gear = gear || {}; cos = cos || {}; opts = opts || {};
  const HS = (app.g === 'm' ? HS_M : HS_F)[app.hs] || HS_F[0];
  const L = { g: app.g, skin: SKINS[app.skin], hair: app.hair2 ? [HAIRS[app.hair][0], HAIRS[app.hair][1], HAIRS[app.hair2][2], HAIRS[app.hair2][3]] : HAIRS[app.hair], hs: HS, eyes: app.eyes, eyes2: app.eyes2, weapon: null };
  const slotVis = slot => {
    const c = cos[slot];
    if (c && c !== 'base' && COSM[c] && COSM[c].slot === slot) return COSM[c].vis(app);
    if (c === 'base' || !gear[slot]) return slot === 'head' ? null : baseVis(app, slot);
    return gearVis(cls, slot, gear[slot]);
  };
  L.top = slotVis('body'); L.bot = slotVis('legs'); L.feet = slotVis('feet');
  L.head = opts.hideHelm && !(cos.head && COSM[cos.head]) ? null : slotVis('head');
  // back: cosmetic cape/wings or class flavour
  if (cos.back && COSM[cos.back]) L.back = COSM[cos.back].vis(app);
  else if (cls === 'guerrero') L.back = { k: 'cape', o: P5(['#100e16', '#1c1824', '#2a2434', '#3a3246', '#4e445c']), i: OUT.knight.sec, tr: gear.body >= 9 ? GOLD.slice(1) : OUT.knight.sec };
  else if (cls === 'arquero') L.back = { k: 'quiver', o: CLOTH.rojo };
  else if (cls === 'invocador' && gear.body) L.back = { k: 'cape', o: P5(['#04040a', '#0a0a16', '#141426', '#1e1e36', '#2a2a48']), i: SOULB, tr: gear.body >= 9 ? SOULB : CLOTH.gris };
  else if (cls === 'bardo' && gear.body >= 5) L.back = { k: 'cape', o: CLOTH[BARDC[(gear.body + 3) % BARDC.length]], i: CLOTH.amarillo, tr: GOLD.slice(1) };
  if (cls === 'asesino' && !(cos.back && COSM[cos.back])) L.scarf = OUT.rogue.sec;
  if (cls === 'asesino' && gear.head && !(cos.head && COSM[cos.head]) && L.head) L.mask = (L.head.s || OUT.rogue.sec);
  const wt = gear.weapon || 1, wk = CLASSES[cls] ? CLASSES[cls].weapon : 'sword';
  L.weapon = { k: wk, tier: wt, ws: gear.ws && WS[gear.ws] && wk === 'sword' ? gear.ws : null, orb: wk === 'staff' && wt <= 1 ? ['#1a3a6a', '#2a64b0', '#4a9ae0', '#9ad8ff', '#ffffff'] : null };
  if (L.top && L.top.k === 'plate' && app.g === 'f') L.top = Object.assign({}, L.top);
  return L;
}
function buildHeroAtlas(L) { return buildAtlas(L, HERO_ANIMS, drawHero); }
// ---------- cosmetics catalogue ----------
const COSM = {};
function cosm(id, n, slot, vis, o) { COSM[id] = Object.assign({ id, n, slot, vis }, o || {}); }
cosm('c_sombrero_slime', 'Sombrero de Slime', 'head', () => ({ k: 'slimehat', cover: 'hat' }), { src: 'Rey Slime' });
cosm('c_corona', 'Corona Real', 'head', () => ({ k: 'crown', cover: 'hat' }), { src: 'Tienda de cosméticos' });
cosm('c_flores', 'Corona de Flores', 'head', () => ({ k: 'flowers', cover: 'hat' }), { src: 'Ent Ancestral' });
cosm('c_gato', 'Orejas de Gato', 'head', app => ({ k: 'catears', m: HAIRS[app.hair], cover: 'hat' }), { src: 'Tienda de cosméticos' });
cosm('c_bruja', 'Sombrero de Bruja', 'head', () => ({ k: 'witchhat', m: P5(['#0a0612', '#160c22', '#241638', '#36224e', '#4a3266']), s: CLOTH.morado, cover: 'hat' }), { src: 'Morgana' });
cosm('c_halo', 'Aureola', 'head', () => ({ k: 'halo', cover: 'hat' }), { src: 'Coloso de Cristal' });
cosm('c_cuernos', 'Cuernos Demoníacos', 'head', () => ({ k: 'demonhorns', cover: 'hat' }), { src: 'El Desatado' });
cosm('c_pirata', 'Pañuelo Pirata', 'head', () => ({ k: 'bandana', m: CLOTH.rojo, cover: 'hat' }), { src: 'Rey Cangrejo' });
cosm('c_yelmo_draco', 'Yelmo de Dragón', 'head', () => ({ k: 'horned', m: TIERP[10], s: TIERP[12], t: 10, cover: 'full' }), { src: 'Ignaroth' });
cosm('c_tiara', 'Tiara Celeste', 'head', () => ({ k: 'circlet', s: TIERP[13], cover: 'hat' }), { src: 'Tienda de cosméticos' });
cosm('c_traje_noble', 'Traje de Noble', 'body', () => ({ k: 'coat', m: CLOTH.granate, s: GOLD.slice(1) }), { src: 'Tienda de cosméticos' });
cosm('c_kimono_sakura', 'Kimono Sakura', 'body', () => ({ k: 'kimono', m: CLOTH.rosa, s: CLOTH.blanco }), { src: 'Tienda de cosméticos' });
cosm('c_vestido_hielo', 'Vestido de Hielo', 'body', () => ({ k: 'dress', m: P5(['#2a4a6a', '#4a7aa8', '#7ab0e0', '#b8dcff', '#ffffff']), s: CLOTH.blanco }), { src: 'Golem de Hielo' });
cosm('c_armadura_draco', 'Armadura Dracónica', 'body', () => ({ k: 'plate', m: TIERP[10], s: TIERP[12], t: 12 }), { src: 'Ignaroth' });
cosm('c_tunica_druida', 'Túnica de Druida', 'body', () => ({ k: 'robe', m: CLOTH.verde, s: CLOTH.oliva, t: 6 }), { src: 'Ent Ancestral' });
cosm('c_pieles_orco', 'Pieles de Bárbaro', 'body', () => ({ k: 'leather', m: CLOTH.marron, s: P5(['#5a5a5a', '#8a8a8a', '#b8b8b8', '#dcdcdc', '#ffffff']), t: 3 }), { src: 'Gruk' });
cosm('c_armadura_vael', 'Armadura Espectral', 'body', () => ({ k: 'plate', m: P5(['#1a2a3a', '#3a5a6a', '#6a9aa8', '#a8d8e0', '#e8ffff']), s: CLOTH.turquesa, t: 9 }), { src: 'Rey Vael' });
cosm('c_eclipse', 'Manto del Eclipse', 'body', () => ({ k: 'robe', m: TIERP[15], s: GOLD.slice(1), t: 12 }), { src: 'Señor del Eclipse' });
cosm('c_arena', 'Ropajes del Desierto', 'body', () => ({ k: 'coat', m: CLOTH.beige, s: CLOTH.naranja }), { src: 'Rey Escorpión' });
cosm('c_selva', 'Atuendo de la Selva', 'body', () => ({ k: 'tunic', m: CLOTH.verde, s: CLOTH.amarillo }), { src: 'Gran Simio Yarak' });
cosm('c_pantalon_noble', 'Calzas de Noble', 'legs', () => ({ k: 'pants', m: CLOTH.blanco }), { src: 'Tienda de cosméticos' });
cosm('c_falda_plisada', 'Falda Plisada', 'legs', () => ({ k: 'skirt', m: CLOTH.marino }), { src: 'Tienda de cosméticos' });
cosm('c_bombacho', 'Bombacho del Desierto', 'legs', () => ({ k: 'baggy', m: CLOTH.beige }), { src: 'Rey Escorpión' });
cosm('c_botas_altas', 'Botas Altas', 'feet', () => ({ k: 'boots', m: CLOTH.negro }), { src: 'Tienda de cosméticos' });
cosm('c_sandalias', 'Sandalias Doradas', 'feet', () => ({ k: 'sandals', m: GOLD.slice(1) }), { src: 'Tienda de cosméticos' });
cosm('c_capa_real', 'Capa Real', 'back', () => ({ k: 'cape', o: CLOTH.rojo, i: CLOTH.granate, tr: GOLD.slice(1), emb: GOLD.slice(2) }), { src: 'Tienda de cosméticos' });
cosm('c_capa_estelar', 'Capa Estelar', 'back', () => ({ k: 'cape', o: CLOTH.marino, i: CLOTH.morado, tr: TIERP[13] }), { src: 'Tienda de cosméticos' });
cosm('c_alas_angel', 'Alas de Ángel', 'back', () => ({ k: 'wings', o: P5(['#8a8aa0', '#c8c8dc', '#e8e8f4', '#f8f8ff', '#ffffff']) }), { src: 'Coloso de Cristal' });
cosm('c_alas_demonio', 'Alas de Demonio', 'back', () => ({ k: 'wings', o: P5(['#0a0408', '#2a0a14', '#4a1420', '#6a1e2c', '#8a2a3a']), demon: 1 }), { src: 'El Desatado' });
cosm('c_alas_draco', 'Alas de Dragón', 'back', () => ({ k: 'wings', o: TIERP[10], demon: 1 }), { src: 'Ignaroth' });
cosm('c_capa_eclipse', 'Capa del Eclipse', 'back', () => ({ k: 'cape', o: TIERP[15], i: TIERP[14], tr: GOLD.slice(1), emb: TIERP[13] }), { src: 'Señor del Eclipse' });
cosm('c_capa_hojas', 'Capa de Hojas', 'back', () => ({ k: 'cape', o: CLOTH.verde, i: CLOTH.oliva }), { src: 'Gran Simio Yarak' });
