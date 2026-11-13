// ================= v4.7: BOUTIQUE, MODISTA, ROPA NUEVA Y MASCOTA BUFANDÍN =================

// ---------- ropa nueva (se ajusta sola a las 8 estructuras con fitKind, ver 6zx_fit) ----------
// Suéter de punto: negro, cuello alto con cuadrícula blanca, franja carmesí en pecho y mangas, puños y bajo rosas,
// botones dorados. Basado en el personaje de Sergio (segunda y tercera imagen).
fitKind('body', 'sweater', (p, A, s) => {
  const { tx0, tw, torsoTop: ty, th, cx, side, up } = A, R = tx0 + tw - 1, band = s.band, rib = s.r, W = C('#e8e4f0');
  const by0 = ty + Math.max(3, Math.round(th * 0.5)), by1 = by0 + 1;   // misma fila que la franja de las mangas (drawArm)
  for (let y = by0; y <= by1; y++) for (let x = tx0; x <= R; x++) if (uA(p.get(x, y))) p.set(x, y, band[y === by0 ? 3 : 2]);
  if (!up) for (let x = tx0 + 1; x < R; x += 3) p.set(x, by0, band[4]);   // puntadas claras de la franja
  for (let x = tx0; x <= R; x++) { p.set(x, ty + th - 1, rib[(x % 2) ? 2 : 3]); p.set(x, ty + th, rib[(x % 2) ? 1 : 2]); }   // bajo acanalado rosa (suéter holgado)
  // cuello alto con cuadrícula blanca
  const c0 = side ? cx - 3 : cx - 3, cw = side ? 5 : 6;
  for (let y = ty - 1; y <= ty + 1; y++) for (let x = c0; x < c0 + cw; x++) p.set(x, y, ((x - c0) % 2 === 1 && !up) || y === ty ? W : s.m[1]);
  if (!up && !side) { p.set(cx - 2, ty + 3, GOLD[4]); p.set(cx, ty + 3, GOLD[4]); p.set(cx - 1, ty + 4, GOLD[3]); p.set(cx + 1, ty + 4, GOLD[3]); }   // botones
  if (!up) { p.set(tx0 + 1, ty + 2, uMix(s.m[2], W, 0.4)); p.set(R - 1, by1 + 2, uMix(s.m[2], W, 0.3)); }   // brillos de lana
});
// zapatillas: suela blanca y cordón oscuro sobre el color del calzado
fitKind('feet', 'sneakers', (p, A, s) => {
  const sole = C('#f4f0f4'), lace = C('#1a1418'), cols = new Set(s.m), lo = {};
  for (let y = A.legTop; y < Math.min(p.h, A.base + 4); y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) lo[x] = y;
  for (const x in lo) { const y = lo[x]; p.set(+x, y, sole); if (uA(p.get(+x, y - 1)) && cols.has(p.get(+x, y - 1)) && (+x % 2 === 0) && !A.up) p.set(+x, y - 1, lace); }
});
// tirita en la mejilla (va pegada a la cara: sigue la línea de los ojos)
fitKind('head', 'bandage', (p, A, s) => {
  if (A.up) return; const y = A.ey + 3, x = A.side ? (A.dir === 'left' ? A.hx - 5 : A.hx + 3) : A.eyes[0] - 1;
  p.hl(x, y, 3, s.m[3]); p.hl(x, y + 1, 3, s.m[2]); p.set(x + 1, y, s.m[1]); p.set(x + 1, y + 1, s.m[1]);
}, { face: true });
// pantalón holgado largo: se arruga sobre el calzado
fitKind('legs', 'baggy', (p, A, s) => {
  if (!s.bunch) return; const cols = new Set([s.m[1], s.m[2], s.m[3]]), y0 = A.base - 5, y1 = A.base - 3;
  for (let y = y0; y <= y1; y++) { const row = []; for (let x = 1; x < p.w - 1; x++) if (cols.has(p.get(x, y))) row.push(x);   // primero se miran, luego se pintan (si no, se propaga)
    for (const x of row) { if (!uA(p.get(x - 1, y))) p.set(x - 1, y, s.m[1]); if (!uA(p.get(x + 1, y))) p.set(x + 1, y, s.m[1]); if ((x + y) % 3 === 0) p.set(x, y, s.m[0]); } }
});
const MODA_PAL = {
  sueter: P5(['#060408', '#0e0a12', '#18121e', '#241c2c', '#36293e']), franja: P5(['#4a0a14', '#7a1424', '#b0283a', '#d84a5a', '#f2a0b0']),
  rosa: P5(['#7a3a52', '#b05a7a', '#e08aa8', '#f8b8cc', '#ffe0ea']), cafe: P5(['#1e100a', '#3a2216', '#563422', '#6e4630', '#8a5e44']),
  zapa: P5(['#1a0c10', '#7a1424', '#c02a3a', '#e85a6a', '#ffa0b0']), tirita: P5(['#7a4a2a', '#b07a4a', '#d8a070', '#f0c49a', '#ffe8cc']),
  noche: P5(['#2a0410', '#4a0a1e', '#7a1430', '#a82848', '#d85a78']), cuero: P5(['#100c0c', '#1e1818', '#2e2626', '#423838', '#5a4e4e']),
};
const MODA_SRC = L2('Boutique de Valentina (todos los pueblos)', "Valentina's Boutique (every town)");
cosm('c_sueter_medianoche', L2('Suéter de Punto Medianoche', 'Midnight Knit Sweater'), 'body', () => ({ k: 'sweater', m: MODA_PAL.sueter, s: MODA_PAL.sueter, band: MODA_PAL.franja, r: MODA_PAL.rosa, cuff: MODA_PAL.rosa }), { src: MODA_SRC });
cosm('c_pantalon_holgado', L2('Pantalón Holgado Café', 'Baggy Brown Trousers'), 'legs', () => ({ k: 'baggy', m: MODA_PAL.cafe, s: uMulP(MODA_PAL.cafe, 0.8), bunch: 1 }), { src: MODA_SRC });
cosm('c_zapatillas_carmesi', L2('Zapatillas Carmesí', 'Crimson Sneakers'), 'feet', () => ({ k: 'sneakers', m: MODA_PAL.zapa }), { src: MODA_SRC });
cosm('c_tirita', L2('Tirita en la Mejilla', 'Cheek Bandage'), 'head', () => ({ k: 'bandage', m: MODA_PAL.tirita }), { src: MODA_SRC });
cosm('c_vestido_noche', L2('Vestido de Noche Carmesí', 'Crimson Evening Dress'), 'body', () => ({ k: 'dress', m: MODA_PAL.noche, s: GOLD.slice(1) }), { src: MODA_SRC });
cosm('c_chaqueta_cuero', L2('Chaqueta de Cuero', 'Leather Jacket'), 'body', () => ({ k: 'coat', m: MODA_PAL.cuero, s: MODA_PAL.franja }), { src: MODA_SRC });
const modaSilver = ['#393440','#726b78','#aaa6ae','#e5e0e3','#fff7ee'].map(hex => C(hex));
const modaGold = ['#463017','#795019','#b6852e','#e6bd51','#fff099'].map(hex => C(hex));
const modaBlue = ['#131944','#162a57','#204489','#295cab','#497bc0'].map(hex => C(hex));
const modaRed = ['#2d111a','#521522','#8b222d','#b42b34','#e84a43'].map(hex => C(hex));
const modaInk = C('#211923');
function modaDressplate(q, A, style, L) {
  const {tx0,tw,torsoTop,th,side,up,d,base,legTop,cx,f,anim} = A;
  const x = 2*tx0, y = 2*torsoTop, w = 2*tw, h = 2*th, mid = 2*cx;
  const face = side ? mid + d*3 : mid;
  const waist = Math.min(y+h-2, 2*legTop-1);
  const step = anim === 'walk' ? [0, 1, 0, -1][f] : 0;
  q.tg = 2;
  const tags = q.t.slice();
  const visible = (i,j) => tags[j*q.w+i]===2 && uA(q.get(i,j));
  const cloth = (i,j,c) => { if(visible(i,j)) q.set(i,j,c); };
  const stroke = (points,c) => {
    for(let k=1;k<points.length;k++){
      const [a,b]=points[k-1], [e,g]=points[k], n=Math.max(1,Math.abs(e-a),Math.abs(g-b));
      for(let t=0;t<=n;t++) cloth(Math.round(lerp(a,e,t/n)),Math.round(lerp(b,g,t/n)),c);
    }
  };
  const skin = L.skin;
  for(let j=y;j<y+h;j++) for(let i=x-2;i<x+w+2;i++){
    if(!visible(i,j)) continue;
    const u=(i-x+.5)/w, v=(j-y+.5)/h, edge=Math.abs(u-.5);
    const light = u<.36 ? 1 : u>.72 ? -1 : 0;
    let c;
    if(style===0){
      const panel = edge < (side?.27:.31) && v>.16 && v<.82;
      c = panel ? modaSilver[3+light] : modaBlue[2+light];
      if(panel && (v<.23 || v>.74 || edge>.25)) c=modaSilver[1+Math.max(light,0)];
      if(v>.82) c=v>.9?modaGold[2]:modaInk;
      if(v<.16 && (edge>.31 || (!up&&Math.abs(i-face)<1))) c=modaGold[3];
    }else{
      c=skin[2+(light>0?1:0)]; if(light<0)c=skin[1];
      if(style===1 && (v<.15 || (v<.49 && (A.fem || up || side || edge>.11)))) {
        c=v<.15?modaGold[3+Math.max(light,0)]:modaRed[3+light];
        if(v>.4 || edge>.38)c=modaGold[2+Math.max(light,0)];
      }
      if(v>.84) c=modaGold[v>.93?3:1];
    }
    cloth(i,j,c);
  }
  if(style===0){
    const k=y+Math.round(h*.45), m=side?face:mid;
    stroke([[m,k-4],[m,k+4]],modaBlue[1]);
    stroke([[m-4,k-2],[m-2,k],[m,k+2],[m+2,k],[m+4,k-2]],modaBlue[2]);
    stroke([[m-3,k+2],[m,k+3],[m+3,k+2]],modaBlue[1]);
    cloth(m,k-4,modaGold[3]);
  }else{
    const k=y+Math.round(h*(style===1?.57:.28)), s=side?d:1;
    stroke([[face-4*s,k],[face-6*s,k+2],[face-3*s,k+3],[face-4*s,k+6]],modaRed[2]);
    stroke([[face+4*s,k],[face+2*s,k+2],[face+5*s,k+3],[face+4*s,k+5]],modaRed[2]);
    if(style===2) stroke([[face-5*s,k-3],[face-1*s,k+2],[face-6*s,k+1],[face-2*s,k-3]],modaRed[1]);
    if(!up) cloth(face,waist-1,modaGold[4]);
  }
  q.tg = 1;
  for(let j=2*legTop;j<2*base+3;j++) for(let i=x-6;i<x+w+6;i++){
    if(tags[j*q.w+i]!==1 || !uA(q.get(i,j)))continue;
    if(j>=2*base-5){
      const sheen=(i+j)%5<2?1:0, seam=(i+j)%7===0;
      q.set(i,j, j>=2*base-1 ? modaInk : style===0 ? modaSilver[2+sheen] : seam?modaBlue[1]:modaGold[2+sheen]);
    }else q.set(i,j, style===0?modaSilver[1+(i%3)]:skin[1+(i%2)]);
  }
  q.tg = 2;
  for(let j=waist+1;j<2*base-3;j++){
    const t=(j-waist)/(2*base-3-waist), drift=Math.round(step*t*2);
    const spread=Math.round(t*(side?2:4));
    const l=x-spread+drift,r=x+w+spread+drift;
    for(let i=l;i<r;i++){
      const tag=tags[j*q.w+i];
      if((tag===3||tag>=5)&&uA(q.get(i,j)))continue;
      const z=(i-l)/(r-l-1), edge=Math.abs(z-.5), hem=j>=2*base-5;
      if(style!==0 && edge>.16 && edge<.33 && t>.51 && !up)continue;
      let c;
      if(style===0){
        c=edge<.25?modaBlue[1+(i%3)]:modaBlue[2+(i%2)];
        if(t<.57&&edge>.22)c=modaSilver[(i%4===0)?4:3];
        if(t<.57&&edge>.22&&(j-waist)%5===0)c=modaSilver[1];
        if(edge>.46||Math.abs(edge-.24)<.04)c=modaGold[2];
        if(hem)c=j===2*base-5?modaGold[3]:modaSilver[i%4===0?2:4];
      }else{
        c=edge<.13&&!up?modaGold[(i%3)+2]:modaRed[(i%3)+1];
        if(t<.31)c=modaGold[(i%3)+2];
        if(edge<.07&&t>.34&&!up&&(j-waist)%4===0)c=modaBlue[1];
        if(t>.83&&edge<.12)continue;
      }
      if(i===l||i===r-1)c=uMul(c,.66);
      q.set(i,j,c);
    }
  }
  q.tg = 3;
  for(let j=y;j<y+2*A.al+5;j++) for(let i=x-9;i<x+w+9;i++){
    if(tags[j*q.w+i]!==3||!uA(q.get(i,j)))continue;
    const rel=(j-y)/Math.max(1,2*A.al);
    if(rel<.27)q.set(i,j,style===0?modaBlue[i%2+2]:modaGold[i%2+2]);
    else if(rel<.4)q.set(i,j,style===0?modaGold[3]:modaRed[2]);
    else if(rel>.56&&rel<.95)q.set(i,j,(style===0?modaSilver:modaGold)[(j%4===0?1:3)+(i%2)]);
  }
}

const MODA_SETS = [
  ['c_traje_plata_azul', L2('Traje de Plata y Azul', 'Silver and Blue Outfit'), 18000],
  ['c_traje_carmesi_oro', L2('Traje Carmesí y Oro', 'Crimson and Gold Outfit'), 20000],
  ['c_traje_marcas_oro', L2('Traje de Marcas Rojas y Oro', 'Red Markings and Gold Outfit'), 19000],
];
MODA_SETS.forEach(([id, name], style) => {
  const k = 'moda_set_' + style;
  if (style !== 0) FIT_SKIN.add(k);
  cosm(id, name, 'body', () => ({ k, m: modaSilver, s: modaBlue, modaStyle: style }), { src: MODA_SRC });
});
{ const original = drawHero; drawHero = function (p, L, dir, anim, f) {
  const style = L.top?.modaStyle;
  if (style === undefined) return original(p, L, dir, anim, f);
  const look = { ...L, bot: { k: 'pants', m: modaSilver, s: modaSilver }, feet: { k: 'boots', m: modaSilver } };
  if (p.t) return original(p, look, dir, anim, f);
  p.t = new Uint8Array(p.w * p.h);
  try {
    original(p, look, dir, anim, f);
    const q = hdDetail(p, {});
    modaDressplate(q, p.meta, style, look);
    for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) p.set(x, y, q.get(x * 2 + 1, y * 2));
  } finally { p.t = null; }
}; }

const MODA_ITEMS = { c_sueter_medianoche: 9000, c_pantalon_holgado: 5000, c_zapatillas_carmesi: 3500, c_tirita: 800, c_vestido_noche: 14000, c_chaqueta_cuero: 11000 };
for (const [id, , price] of MODA_SETS) MODA_ITEMS[id] = price;
for (const id in MODA_ITEMS) { it('cosi_' + id, { n: COSM[id].n, t: 'cos', cos: id, price: MODA_ITEMS[id], icon: ['hanger'], rar: 3 }); COS_SHOP.push(id); }

// ---------- la modista y su boutique en cada pueblo ----------
NPCS.modista = { n: 'Valentina', title: L2('Modista de la Boutique', 'Boutique Designer'),
  look: Object.assign(LK({ g: 'f', hair: HAIRS.negro, hairStyle: 'long', outfit: 'dress', eyes: 'violeta', skin: SKINS[0], main: MODA_PAL.noche, sec: GOLD.slice(1), sash: GOLD[3] }), { bt: 2, btS: BODY_T.f[2] }),
  lines: [L2('Bienvenido, cariño. La moda también es una armadura.', 'Welcome, darling. Fashion is armor too.'), L2('Tengo prendas nuevas… te quedarían de maravilla.', 'I have new pieces… they would look wonderful on you.'), L2('Un buen suéter abriga más que mil hechizos de fuego.', 'A good sweater keeps you warmer than a thousand fire spells.')] };
const MODA_TOWNS = ['albor', 'puerto', 'arxar', 'sahrim', 'yarakai', 'brasa'];
SHOPS.moda = {}; for (const k of MODA_TOWNS) SHOPS.moda[k] = Object.keys(MODA_ITEMS).map(id => 'cosi_' + id).concat(['cosi_c_falda_plisada', 'cosi_c_botas_altas', 'cosi_c_sandalias'].filter(id => ITEMS[id]));
SIGNICON.dress = (p, x, y) => { p.hl(x + 3, y, 5, IRON[4]); p.set(x + 5, y + 1, IRON[4]); p.poly([[x + 3, y + 2], [x + 7, y + 2], [x + 9, y + 8], [x + 1, y + 8]], C('#d0406a')); p.hl(x + 3, y + 4, 5, C('#ffd0e0')); };
for (const k of MODA_TOWNS) INT_NPC['boutique_' + k] = 'modista';
if (typeof DOOR_CAT !== 'undefined') DOOR_CAT.unshift([/^boutique_/, 'tailor']);
{ const _to = townOfInterior; townOfInterior = function (id) { if (id && id.startsWith('boutique_')) return id.slice(9); return _to(id); }; }
// un hueco libre de 5x4 (más un margen) cerca del centro del pueblo, siempre el mismo en todos los teléfonos
function modaSpot(W, t) {
  const w = 5, h = 4, cx = Math.round((t.x0 + t.x1) / 2), cy = Math.round((t.y0 + t.y1) / 2);
  const okTile = (x, y) => { if (x < 1 || y < 1 || x >= W.w - 1 || y >= W.h - 1) return false; const i = W.I(x, y); return !SOLID_T[W.ter[i]] && W.ter[i] !== T.WATER && W.ter[i] !== T.DEEP && W.ter[i] !== T.STAIRS && W.ter[i] !== T.BRIDGE && W.objAt[i] < 0 && W.lvl[i] === W.lvl[W.I(cx, cy)] && !(W.flags[i] & 1); };
  for (let r = 2; r < 26; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; const bx = cx + dx, by = cy + dy; let ok = true;
    for (let y = by - 1; y <= by + h + 1 && ok; y++) for (let x = bx - 1; x <= bx + w; x++) if (!okTile(x, y)) { ok = false; break; }
    if (ok) return [bx, by];
  }
  return null;
}
{ const _pd = placeDiveSpots; placeDiveSpots = function (W) { _pd(W);
  for (const k of MODA_TOWNS) { const t = TOWNS.find(t => t.k === k); if (!t) continue; const s = modaSpot(W, t); if (!s) continue;
    addBuilding(W, s[0], s[1], 5, 4, { style: WALLP[k] ? k : 'puerto', roof: 'purple', sign: 'dress', awning: '#c03a7a', v: 7 }, 'boutique_' + k); }
}; }
{ const _mi = makeInterior; makeInterior = function (id) {
  if (!id || !id.startsWith('boutique_')) return _mi(id);
  const w = 14, h = 10, M = { id, w, h, ter: new Uint8Array(w * h).fill(T.FLOOR), lvl: new Uint8Array(w * h), reg: new Uint8Array(w * h), flags: new Uint8Array(w * h), isWorld: false, chunks: new Map(), dark: 0.05, music: 'town', I: (x, y) => y * w + x };
  for (let x = 0; x < w; x++) { M.ter[x] = T.IWALL; M.ter[w + x] = T.IWALL; M.ter[(h - 1) * w + x] = T.IWALL; } for (let y = 0; y < h; y++) { M.ter[y * w] = T.IWALL; M.ter[y * w + w - 1] = T.IWALL; }
  const ex = w >> 1; M.ter[(h - 1) * w + ex] = T.FLOOR; M.exit = { x: ex, y: h - 1 };
  for (let y = 5; y < h - 1; y++) for (let x = 5; x <= 8; x++) M.ter[y * w + x] = T.CARPET;
  initMapObjs(M); const F = (f, x, y, fp, o) => addObj(M, 'furn', x, y, Object.assign({ f, fp: fp || [[0, 0]] }, o || {}));
  F('counter', 7, 4, [[-2, 0], [-1, 0], [0, 0], [1, 0]]); F('armorstand', 2, 2); F('armorstand', 4, 2); F('armorstand', 10, 2); F('armorstand', 12, 2);
  F('shelf', 2, 6, [[0, 0], [1, 0]]); F('shelf', 11, 6, [[0, 0], [1, 0]]); F('plant', 1, 8); F('plant', 12, 8); F('rug', 7, 7, [], { solid: false });
  spawnNPC('modista', 7 * 16 + 8, 3 * 16 + 12, id, { face: 'down', L: 0 });
  M.wdist = null; G.maps[id] = M; return M;
}; }
DLG_HOOKS.push((npc, opts) => { if (!npc || npc.id !== 'modista') return; const P = G.P, tk = P.inside && P.inside.startsWith('boutique_') ? P.inside.slice(9) : 'puerto';
  opts.unshift({ label: L2('Ver la colección', 'Browse the collection'), icon: ['hanger'], fn: () => { closeDialog(); openShop('moda', tk); } }); });

PETS.bufandin = { n: L2('Bufandín, el Gato Viajero', 'Scarfy, the Wandering Cat'), d: L2('+6% de velocidad y +4% de crítico. Su bufanda ondea al correr.', '+6% speed and +4% crit. Its scarf flutters as it runs.'), price: 5500, look: { kind: 'scarfcat', b: '#3a58c8', b2: '#7aa0f0', eye: '#58e0a0' } };
{ const _ps = petStats; petStats = function (P, S) { _ps(P, S); if (P.pet === 'bufandin') { S.spd *= 1.06; S.crit = Math.min(70, S.crit + 4); } }; }
// La hoja trae filas abajo, arriba, izquierda y derecha, con cuatro pasos por fila.
const BUFI_ROWS = { down: 0, up: 1, left: 2, right: 3 };
const BUFI_SHEET = new Image();
BUFI_SHEET.src = 'data:image/png;base64,__BUFANDIN_PNG__';

function bufandinAtlas() {
  const fw = 26, fh = 24, columns = 10;
  const A = {
    img: mkCanvas(fw * columns, fh * 4),
    hd: mkCanvas(fw * columns * 2, fh * 8),
    fw, fh, ax: 13, ay: 21,
    idx: { idle: 0, walk: 2, atk: 6, hurt: 9 },
    hdL: { pet: 1 },
    hdDone: new Uint8Array(columns * 4).fill(1)
  };
  function fillAtlas() {
    for (const [canvas, scale] of [[A.img, 1], [A.hd, 2]]) {
      const ctx = canvas.getContext('2d'), w = fw * scale, h = fh * scale;
      ctx.imageSmoothingEnabled = false;
      DIRS.forEach((dir, row) => {
        for (let col = 0; col < columns; col++) {
          // Bufandín es pasivo. Las celdas de reposo, ataque y daño usan la pose inicial.
          const step = col >= A.idx.walk && col < A.idx.atk ? col - A.idx.walk : 0;
          // Recorte fijo para mantener el mismo anclaje en los 16 fotogramas.
          ctx.drawImage(BUFI_SHEET, step * 128 + 12, BUFI_ROWS[dir] * 128 + 33,
            104, 96, col * w, row * h, w, h - scale);
        }
      });
    }
  }
  if (BUFI_SHEET.complete && BUFI_SHEET.naturalWidth) fillAtlas();
  else BUFI_SHEET.addEventListener('load', fillAtlas, { once: true });
  return A;
}

{ const _gp = genPet; genPet = function (k) { return k === 'bufandin' ? bufandinAtlas() : _gp(k); }; }
