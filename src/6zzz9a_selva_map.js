// Selva peruana · same dimensions and 16 px tile grid as Lima.
const SELVA_AIR = [298, 207];
const SELVA_PORT = [345, 235];
const SELVA_TAMBO = [530, 78];
const SELVA_NAME = L2('Selva peruana', 'Peruvian Amazon');
const SELVA_POI = [
  ['peplane', ...SELVA_AIR, L2('Aeródromo del Aguaje · regreso a Lima', 'Aguaje Airstrip · return to Lima')],
  ['selvaPueblo', ...SELVA_PORT, L2('Puerto del Aguaje · comunidad shipibo-konibo', 'Aguaje Port · Shipibo-Konibo community')],
  ['selvaPueblo', ...SELVA_TAMBO, L2('Tambo del Bosque · comunidad asháninka', 'Forest Tambo · Ashaninka community')],
  ['selvaNature', 572, 226, 'Cocha Espejo'],
  ['selvaNature', 225, 160, L2('Bosque de lupunas', 'Lupuna Forest')],
  ['selvaNature', 70, 78, L2('Mirador de la Neblina', 'Mist Lookout')],
  ['selvaNature', 590, 69, 'Aguajal'],
  ['selvaNature', 107, 176, L2('Cascada del Bosque', 'Forest Waterfall')]
];
const SELVA_RIVERS = [
  [20, [[0,248],[115,234],[250,283],[386,257],[490,180],[610,135],[720,160]]],
  [9, [[375,0],[325,65],[349,118],[415,157],[490,180]]],
  [8, [[470,360],[424,318],[386,257]]]
];
const SELVA_PATHS = [
  [2.1, [[70,78],[129,106],[185,145],[225,160],[234,188],[298,207],[318,221],SELVA_PORT]],
  [2.1, [SELVA_PORT,[370,225],[406,204],[444,190],[455,166],[454,132],[482,98],SELVA_TAMBO]],
  [1.6, [SELVA_TAMBO,[562,74],[590,69],[631,79]]],
  [1.6, [[185,145],[143,161],[107,176]]],
  [2.0, [SELVA_TAMBO,[554,102],[565,127],[567,157],[553,193],[572,226]]]
];
function selvaSpline(points) {
  const curve = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], d = points[Math.min(points.length - 1, i + 2)];
    for (let j = 0; j < 6; j++) {
      const t = j / 6, t2 = t * t, t3 = t2 * t;
      curve.push([0, 1].map(k => b[k] + .5 * ((c[k] - a[k]) * t + (2*a[k] - 5*b[k] + 4*c[k] - d[k]) * t2 + (-a[k] + 3*b[k] - 3*c[k] + d[k]) * t3)));
    }
  }
  curve.push(points[points.length - 1]);
  return curve;
}
function selvaDistanceField(w, h, lines, lake = false) {
  // Retain only the band the renderer needs. Each segment visits its own bounding box.
  const stride = w + 1, F = new Float32Array(stride * (h + 1)).fill(12);
  for (const [width, points] of lines) {
    const curve = selvaSpline(points), padding = width + 10;
    for (let j = 1; j < curve.length; j++) {
      const [ax, ay] = curve[j - 1], [bx, by] = curve[j], dx = bx - ax, dy = by - ay;
      const inv = 1 / (dx * dx + dy * dy);
      const x0 = Math.max(0, Math.floor(Math.min(ax, bx) - padding)), x1 = Math.min(w, Math.ceil(Math.max(ax, bx) + padding));
      const y0 = Math.max(0, Math.floor(Math.min(ay, by) - padding)), y1 = Math.min(h, Math.ceil(Math.max(ay, by) + padding));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const u = clamp(((x - ax) * dx + (y - ay) * dy) * inv, 0, 1);
        const fx = x - ax - u * dx, fy = y - ay - u * dy, i = y * stride + x;
        F[i] = Math.min(F[i], Math.sqrt(fx * fx + fy * fy) - width);
      }
    }
  }
  if (lake) for (let y = 218; y <= 294; y++) for (let x = 505; x <= 639; x++) {
    const i = y * stride + x;
    F[i] = Math.min(F[i], (Math.hypot((x - 572) / 43, (y - 256) / 25) - 1) * 25);
  }
  return F;
}
const SELVA_PALETTE = {
  grass: pal(['#375c35','#476c3c','#567c43','#668c4d','#759953']),
  high: pal(['#365842','#44694b','#527d55','#668c66','#7f9e78']),
  mud: pal(['#495543','#5d6247','#73704d','#8a8159','#a1986c']),
  dirt: pal(['#795d40','#94744f','#a98b5c','#b89c6b','#c8ad7c']),
  river: pal(['#788b78','#82917c','#8e9982','#9da48c','#b6b69c']),
  lake: pal(['#244940','#315d4f','#3c6b58','#527d62','#719276']),
  rock: pal(['#3a5047','#4f6456','#677a62','#819273','#a4ac8a']),
  plank: pal(['#3f3324','#665035','#94754b','#b08f5b','#d0b57b'])
};
function makeSelva() {
  if (G.maps.selva) return G.maps.selva;
  const w = LM_W, h = LM_H, N = w * h, stride = w + 1, rng = new RNG(265671);
  const water = selvaDistanceField(w, h, SELVA_RIVERS, true), path = selvaDistanceField(w, h, SELVA_PATHS);
  for (let y = 0; y <= h; y++) for (let x = 0; x <= w; x++) {
    const i = y * stride + x;
    if (Math.abs(water[i]) < 6) water[i] += (Math.sin(x*.25 + y*.17) + Math.sin(x*.09 - y*.31)) * .45;
  }
  const M = { id:'selva', w, h, I:(x,y) => y*w+x, ter:new Uint8Array(N), lvl:new Uint8Array(N), reg:new Uint8Array(N), flags:new Uint8Array(N),
    isWorld:false, chunks:new Map(), dark:0, music:'field', camps:[], xactObjs:[], water, path, selva:true, hudName:SELVA_NAME, overviewMinimap:true };
  initMapObjs(M);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const d = water[y * stride + x], p = path[y * stride + x];
    const deck = (y >= 239 && y <= 241 && x >= 310 && x <= 375) ||
      (x >= 351 && x <= 354 && y >= 239 && y <= 265) ||
      (x >= 368 && x <= 371 && y >= 236 && y <= 256) ||
      (x >= 325 && x <= 328 && y >= 235 && y <= 241);
    const runway = x >= 280 && x <= 310 && y >= 197 && y <= 203;
    const cascade = x >= 102 && x <= 109 && y >= 167 && y <= 175;
    M.ter[M.I(x,y)] = runway ? T.STONE : cascade ? T.FALL : deck || (p < 1 && d < 1) ? T.BRIDGE :
      d < 0 ? T.DEEP : p < 0 ? T.DIRT : d < 1.2 ? T.MUD : T.GRASS;
  }
  const add = (key, x, y, scale = 1, fp = [[0,0]]) => addObj(M, 'selva', Math.floor(x), Math.floor(y), {
    selvaArt:key, selvaScale:scale, px:Math.round(x*16)+8, py:Math.round(y*16)+12, fp, solid:fp.length > 0
  });
  const clearing = (x, y) => [[342,226,42,25],[70,75,26,18],[530,78,30,22],[295,201,24,13]]
    .some(([cx,cy,rx,ry]) => Math.hypot((x-cx)/rx,(y-cy)/ry)<1);
  for (let gy = 5; gy < h - 4; gy += 5) for (let gx = 5; gx < w - 4; gx += 5) {
    const x = gx + rng.int(-1,1), y = gy + rng.int(-1,1), i = y * stride + x;
    if (M.ter[M.I(x,y)] !== T.GRASS || water[i] < 1.6 || path[i] < 2.8 || clearing(x,y) || rng.f() > .76) continue;
    const species = x > 515 && y < 116 ? 'palma' : ['caoba','ebano','ebano','palma'][rng.int(0,3)];
    add(species + rng.int(0,3), x, y, rng.f() < .3 ? 1.25 : 1.75);
    if (rng.f() < .045) add('helecho',x+1,y+1,1,[]);
  }
  for (const [x,y] of [[221,161],[234,164],[203,155],[212,177],[196,170]]) add('ancestral'+rng.int(0,3),x,y,1.5);
  const footprint = radius => Array.from({length:radius*2+1}, (_,i) => [i-radius,0]);
  for (const [x,y] of [[311,226],[323,223],[338,220],[353,216],[367,212],[319,238],[335,235],[351,232],[364,228],
    [510,68],[522,65],[536,64],[550,69],[509,84],[522,89],[539,88],[551,83]]) add('casa'+rng.int(0,4),x,y,1,footprint(2));
  add('maloca',342,208,1,footprint(4)); add('maloca',530,70,1,footprint(4));
  for (const [x,y] of [[328,229],[344,227],[359,222],[519,77],[543,76],[305,205]]) add('stall',x,y,1,footprint(1));
  for (const [x,y] of [[301,221],[313,216],[375,213],[376,228],[328,203],[363,203],[506,66],[549,90]]) add('banano',x,y,1,[]);
  for (const [x,y] of [[355,263],[371,254],[447,213],[594,247]]) add('boat',x,y,1,[]);
  add('ruina',70,74,1,footprint(4)); add('ruina',89,85,.65,footprint(2));
  for (let i = 0; i < 60; i++) {
    const x = rng.int(537,608), y = rng.int(236,274);
    if (M.ter[M.I(x,y)] === T.DEEP) add('lirio',x,y,1,[]);
  }
  add('jaguar',232,183,1,[]);
  for (const [x,y] of [[218,150],[312,210],[569,266],[98,104],[535,82]]) add('guacamayo',x,y,1,[]);
  addObj(M,'furn',SELVA_AIR[0]-7,200,{f:'selva_plane',fp:[],solid:false});
  return G.maps.selva = M;
}
XSPR.selva_plane = () => planeSprite(0);

function selvaChunk(M, cx, cy) {
  const c = mkCanvas(CHP, CHP), g = c.getContext('2d'), im = g.createImageData(CHP, CHP);
  const buf = new Uint32Array(im.data.buffer), S = SELVA_PALETTE, stride = M.w + 1;
  const ox = cx * CHP, oy = cy * CHP;
  for (let qy = 0; qy < CHP; qy++) {
    const py = oy + qy, y = Math.min(py >> 4, M.h - 1), fy = (py & 15) / 16;
    const row = y * stride, texRow = (py & 127) * 128;
    for (let qx = 0; qx < CHP; qx++) {
      const px = ox + qx, x = Math.min(px >> 4, M.w - 1), fx = (px & 15) / 16, i = row + x, j = texRow + (px & 127);
      const type = M.ter[M.I(x,y)], d = lerp(lerp(M.water[i],M.water[i+1],fx),lerp(M.water[i+stride],M.water[i+stride+1],fx),fy);
      const p = lerp(lerp(M.path[i],M.path[i+1],fx),lerp(M.path[i+stride],M.path[i+stride+1],fx),fy);
      let col;
      if (type === T.BRIDGE) col = (py & 7) === 0 ? S.plank[1] : S.plank[TEX.plank[j]];
      else if (type === T.STONE) col = ((py>>4)===200 && x%4<2 && (py&15)>5 && (py&15)<9) ? S.rock[4] : S.rock[TEX.rock[j]];
      else if (type === T.FALL) col = py % 9 === 0 || px % 7 < 2 ? S.river[4] : S.river[0];
      else if (d < -.2) {
        const water = x > 522 && y > 219 ? S.lake : S.river;
        col = py % 61 === 0 && (px % 79) < 28 ? water[4] : water[TEX.mud[j]];
      } else if (d < .9) col = S.mud[TEX.sand[j]];
      else if (p < 0) col = S.dirt[TEX.dirt[j]];
      else if (d < 3.2) col = S.mud[Math.min(4,TEX.grass[j])];
      else if (x < 240 && y < 190) {
        const elev = (1-Math.hypot((x-75)/180,(y-45)/135))*15;
        col = elev > 1 && elev % 3 < .65 ? S.rock[TEX.rock[j]] : S.high[clamp(TEX.grass[j]-1,0,4)];
      } else col = S.grass[clamp(TEX.grass[j]-1,0,4)];
      buf[qy * CHP + qx] = col;
    }
  }
  g.putImageData(im,0,0);
  return c;
}
{ const previous = renderChunk; renderChunk = function (M,cx,cy) { return M.selva ? selvaChunk(M,cx,cy) : previous.apply(this,arguments); }; }

MAPC.selvaPueblo = [L2('Comunidades', 'Communities'), 'Communities', '#e6b96b', 'house'];
MAPC.selvaNature = [L2('Paisajes amazónicos', 'Amazonian landmarks'), 'Amazonian landmarks', '#a0d388', 'star'];
MAPW_LIST.push({id:'selva', n:SELVA_NAME, mk:makeSelva,
  how:L2('En Lima, compra el billete a la Selva en el aeropuerto Jorge Chávez por 10.000 de oro y embarca por la Puerta 2.',
    'In Lima, buy your ticket to the Amazon at Jorge Chávez Airport for 10,000 gold and board at Gate 2.')});
{ const previous = otherPOI; otherPOI = function(M) {
  const out = previous.apply(this,arguments);
  if (M.selva) for (const [c,x,y,t] of SELVA_POI) out.push({c,x,y,t});
  return out;
}; }
{ const previous = mapOverview; mapOverview = function (M) {
  if (!M.selva) return previous.apply(this,arguments);
  if (MAP_OV[M.id]) return MAP_OV[M.id].c;
  const c = mkCanvas(M.w,M.h), g = c.getContext('2d'), im = g.createImageData(M.w,M.h), out = new Uint32Array(im.data.buffer), S = SELVA_PALETTE;
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) {
    const i = M.I(x,y), t = M.ter[i];
    out[i] = t === T.DEEP ? (x > 522 && y > 219 ? S.lake[2] : S.river[2]) : t === T.BRIDGE || t === T.DIRT ? S.dirt[4] :
      t === T.STONE || t === T.FALL ? S.rock[4] : t === T.MUD ? S.mud[3] : (x < 240 && y < 190 ? S.high : S.grass)[M.solidO[i] ? 0 : 2];
  }
  g.putImageData(im,0,0); MAP_OV[M.id] = {c,w:M.w};
  return c;
}; }
