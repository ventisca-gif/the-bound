// ================= WORLD POPULATION (towns, nature, landmarks) =================
const WOODT = { roble: 1, palma: 1, pino: 2, abedul: 3, ebano: 4, sauce: 5, pinonev: 6, ceniza: 7 };
function initMapObjs(M) {
  M.objs = []; M.objAt = new Int32Array(M.w * M.h).fill(-1); M.solidO = new Uint8Array(M.w * M.h);
  M.cw = Math.ceil(M.w / CH); M.chh = Math.ceil(M.h / CH); M.objGrid = Array.from({ length: M.cw * M.chh }, () => []);
  M.npcDefs = M.npcDefs || []; M.doors = M.doors || []; M.lights = [];
}
function addObj(M, k, tx, ty, props = {}) {
  const o = Object.assign({ k, tx, ty, px: tx * 16 + 8, py: ty * 16 + 14, v: Math.floor(hash2(tx, ty, 77) * 4) }, props);
  o.id = M.objs.length; M.objs.push(o);
  const fp = o.fp || [[0, 0]];
  for (const [dx, dy] of fp) { const x = tx + dx, y = ty + dy; if (x < 0 || y < 0 || x >= M.w || y >= M.h) continue; const i = y * M.w + x; if (o.solid !== false) M.solidO[i] = 1; M.objAt[i] = o.id; if (M.flags) M.flags[i] |= 32; }
  const gx = clamp(o.px >> 7, 0, M.cw - 1), gy = clamp(o.py >> 7, 0, M.chh - 1); M.objGrid[gy * M.cw + gx].push(o.id);
  return o;
}
function setTer(M, x, y, t) { if (x < 0 || y < 0 || x >= M.w || y >= M.h) return; M.ter[y * M.w + x] = t; }
function rectTer(M, x0, y0, x1, y1, t, flag = 0) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { setTer(M, x, y, t); if (flag && M.flags) M.flags[y * M.w + x] |= flag; } }
function circTer(M, cx, cy, r, t) { for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) if (dist(x, y, cx, cy) <= r) setTer(M, x, y, t); }
function canPlace(M, x, y, r = 0) {
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const xx = x + dx, yy = y + dy; if (xx < 1 || yy < 1 || xx >= M.w - 1 || yy >= M.h - 1) return false; const i = yy * M.w + xx; if (SOLID_T[M.ter[i]] || M.ter[i] === T.STAIRS || M.ter[i] === T.BRIDGE || M.objAt[i] >= 0) return false; }
  return true;
}
// building helper: footprint (bx,by,w,h) door bottom center
function addBuilding(M, bx, by, w, h, spec, interior) {
  const door = [bx + Math.floor(w / 2) + (spec.doorOff || 0), by + h - 1]; const fp = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!(bx + x === door[0] && by + y === door[1])) fp.push([x, y]);
  spec.w = w; spec.h = h;
  const o = addObj(M, 'bld', bx, by, { fp, spec, px: bx * 16 + w * 8, py: (by + h) * 16 - 1, door, interior });
  if (interior) M.doors.push({ x: door[0], y: door[1], to: interior, obj: o.id });
  return o;
}
function townLayouts(W) {
  const L = (k, tx, ty, p) => addObj(W, k, tx, ty, p || {});
  const lantern = (x, y, kind) => L('lantern', x, y, { kind: kind || 'wood' });
  // ---------- ALDEA ALBOR ----------
  {
    rectTer(W, 100, 138, 137, 165, T.GRASS); circTer(W, 118.5, 151.5, 4.6, T.COBBLE);
    rectTer(W, 117, 136, 118, 147, T.COBBLE, 1); rectTer(W, 117, 155, 118, 166, T.COBBLE, 1); rectTer(W, 122, 150, 138, 151, T.COBBLE, 1); rectTer(W, 98, 150, 114, 151, T.COBBLE, 1);
    rectTer(W, 107, 145, 107, 149, T.COBBLE); rectTer(W, 126, 145, 126, 149, T.COBBLE); rectTer(W, 107, 152, 107, 155, T.COBBLE); rectTer(W, 127, 152, 127, 157, T.COBBLE); rectTer(W, 103, 149, 103, 149, T.COBBLE); rectTer(W, 134, 149, 134, 149, T.COBBLE); rectTer(W, 110, 152, 110, 159, T.COBBLE);
    rectTer(W, 124, 161, 134, 164, T.FARM);
    for (let k = 0; k < 5; k++) for (const y of [162, 164]) L('plot', 125 + k * 2, y, { pid: 'a' + k + (y - 162), solid: false });
    addBuilding(W, 104, 141, 6, 4, { style: 'albor', roof: 'red', gable: true, chimney: true, box: true }, 'casa_mira');
    addBuilding(W, 123, 140, 7, 5, { style: 'smith', roof: 'slate', sign: 'smith', chimney: true }, 'herreria_albor');
    addBuilding(W, 104, 152, 6, 4, { style: 'albor', roof: 'red', sign: 'store', awning: '#2a7a3a' }, 'tienda_albor');
    addBuilding(W, 123, 153, 8, 5, { style: 'albor', roof: 'brown', sign: 'inn', chimney: true, big: true }, 'posada_albor');
    addBuilding(W, 100, 145, 5, 4, { style: 'albor', roof: 'red', box: true, v: 1 }, 'casa_a1');
    addBuilding(W, 132, 145, 5, 4, { style: 'albor', roof: 'brown', gable: true, v: 2 }, 'casa_a2');
    addBuilding(W, 108, 160, 5, 4, { style: 'albor', roof: 'red', chimney: true, v: 3 }, 'casa_a3');
    L('fountain', 118, 151, { px: 118 * 16 + 16, py: 152 * 16 + 4, fp: [[0, 0], [1, 0], [-1, 0], [0, 1], [1, 1]] });
    L('forge', 131, 143); L('anvil', 129, 145, { px: 129 * 16 + 8 }); L('barrel', 122, 141); L('barrel', 122, 142); L('crate', 110, 153); L('barrel', 111, 153); L('crate', 122, 157);
    [[115, 147], [122, 147], [115, 156], [121, 156], [116, 137], [119, 137], [137, 149], [137, 152], [99, 149], [99, 152], [116, 164], [119, 164]].forEach(([x, y]) => lantern(x, y));
    [[114, 136], [121, 136]].forEach(([x, y]) => L('banner', x, y, { col: '#8a1626' })); L('banner', 113, 153, { col: '#8a1626' }); L('banner', 124, 149, { col: '#8a1626' });
    L('sign', 120, 134); L('sign', 140, 149); L('well', 111, 147, { fp: [[0, 0], [1, 0]] }); L('bench', 114, 149); L('bench', 122, 154);
    L('pot', 106, 145, { col: '#ff6080' }); L('pot', 109, 145, { col: '#ffe060' }); L('pot', 105, 156, { col: '#c070ff' });
    L('hay', 136, 162); L('cart', 122, 163); for (let x = 123; x <= 135; x++) { L('fence', x, 160, { o: 'h' }); } for (let y = 161; y <= 164; y++) { L('fence', 123, y, { o: 'v' }); L('fence', 135, y, { o: 'v' }); }
    [[102, 141], [136, 141], [101, 164], [136, 165], [113, 142], [101, 158]].forEach(([x, y]) => L('tree', x, y, { sp: x % 2 ? 'cerezo' : 'roble', deco: true }));
    W.npcDefs.push({ id: 'mira', x: 107, y: 146 }, { id: 'rolf', x: 119, y: 141 }, { id: 'greta', x: 102, y: 153 }, { id: 'tomas', x: 100, y: 135 }, { id: 'pip', x: 118, y: 148, wander: 4 }, { id: 'marta', x: 112, y: 156, wander: 3 }, { id: 'hugo_granjero', x: 129, y: 160, wander: 2 });
  }
  // ---------- PUERTO CORAL ----------
  {
    rectTer(W, 189, 117, 226, 143, T.GRASS); circTer(W, 205.5, 130.5, 4.6, T.COBBLE);
    rectTer(W, 186, 129, 201, 130, T.COBBLE, 1); rectTer(W, 210, 129, 226, 130, T.COBBLE, 1); rectTer(W, 205, 114, 206, 126, T.COBBLE, 1); rectTer(W, 205, 135, 206, 143, T.COBBLE, 1);
    rectTer(W, 213, 123, 213, 128, T.COBBLE); rectTer(W, 195, 124, 195, 128, T.COBBLE); rectTer(W, 194, 131, 194, 132, T.COBBLE); rectTer(W, 213, 131, 213, 132, T.COBBLE); rectTer(W, 220, 124, 220, 128, T.COBBLE); rectTer(W, 200, 131, 200, 133, T.COBBLE); rectTer(W, 201, 123, 204, 123, T.COBBLE);
    for (let y = 127; y <= 132; y++) for (let x = 224; x <= 236; x++) if (y >= 128 && y <= 131 || x >= 233) { const i = W.I(x, y); if (WATERY[W.ter[i]] || W.ter[i] === T.SAND || x >= 224) { W.ter[i] = T.PLANK; W.flags[i] |= 1; } }
    for (let y = 132; y <= 139; y++) for (let x = 233; x <= 234; x++) { const i = W.I(x, y); W.ter[i] = T.PLANK; W.flags[i] |= 1; }
    addBuilding(W, 191, 119, 8, 5, { style: 'puerto', roof: 'blue', sign: 'inn', chimney: true, big: true }, 'posada_puerto');
    addBuilding(W, 210, 119, 6, 4, { style: 'puerto', roof: 'blue', sign: 'alchemy', box: true }, 'alquimia_puerto');
    addBuilding(W, 191, 133, 6, 4, { style: 'puerto', roof: 'blue', sign: 'store', awning: '#1e4a8a' }, 'tienda_puerto');
    addBuilding(W, 210, 133, 7, 5, { style: 'smith', roof: 'blue', sign: 'smith', chimney: true }, 'herreria_puerto');
    addBuilding(W, 218, 120, 5, 4, { style: 'puerto', roof: 'blue', box: true, v: 4 }, 'casa_capitana');
    addBuilding(W, 198, 134, 5, 4, { style: 'puerto', roof: 'blue', gable: true, v: 5 }, 'casa_p1');
    addBuilding(W, 199, 119, 5, 4, { style: 'puerto', roof: 'blue', chimney: true, v: 6 }, 'casa_p2');
    L('statue', 205, 130, { px: 205 * 16 + 16, fp: [[0, 0], [1, 0]] }); L('lighthouse', 222, 139, { fp: [[0, 0], [1, 0], [-1, 0]] }); L('boat', 233, 126, { px: 235 * 16, py: 127 * 16, solid: false });
    L('stall', 215, 127, { col: '#1e4a8a', fp: [[0, 0], [1, 0], [-1, 0]] }); L('stall', 220, 132, { col: '#c0302a', fp: [[0, 0], [1, 0], [-1, 0]] }); L('nets', 223, 125); L('crate', 225, 127); L('barrel', 225, 132); L('barrel', 226, 132); L('crate', 189, 128); L('sack', 208, 126);
    [[202, 128], [209, 128], [202, 131], [209, 131], [204, 116], [207, 116], [187, 128], [187, 131], [223, 128], [223, 131], [204, 142], [207, 142]].forEach(([x, y]) => lantern(x, y, 'iron'));
    L('banner', 188, 127, { col: '#1e3a8a' }); L('banner', 188, 132, { col: '#1e3a8a' }); L('sign', 185, 127);
    [[190, 141], [216, 141], [196, 117], [224, 118], [189, 125]].forEach(([x, y]) => L('tree', x, y, { sp: 'palma', deco: true }));
    W.npcDefs.push({ id: 'sastre', x: 209, y: 133, wander: 2 }, { id: 'marina', x: 229, y: 129 }, { id: 'viejopez', x: 234, y: 138, face: 'right' }, { id: 'marinero', x: 217, y: 129, wander: 4 }, { id: 'lena', x: 205, y: 133, wander: 3 }, { id: 'guardia_p', x: 190, y: 128 });
  }
  // ---------- OASIS DE SAHRIM ----------
  {
    rectTer(W, 282, 134, 314, 160, T.SAND); circTer(W, 298.5, 147.5, 6.2, T.COBBLE);
    rectTer(W, 280, 147, 316, 148, T.COBBLE, 1); rectTer(W, 298, 131, 299, 162, T.COBBLE, 1);
    circTer(W, 298.5, 147.5, 3.3, T.WATER); for (let y = 144; y <= 151; y++) for (let x = 295; x <= 302; x++) { const i = W.I(x, y); if (W.ter[i] === T.WATER) W.flags[i] &= ~1; }
    // road + dock to the western shore
    let dx = 281; for (; dx > 250; dx--) { const i = W.I(dx, 147); if (WATERY[W.ter[i]]) break; for (const y of [147, 148]) { const j = W.I(dx, y); W.ter[j] = T.COBBLE; W.flags[j] |= 1 | 4; W.lvl[j] = 0; } }
    for (let x = dx; x > dx - 6; x--) for (let y = 146; y <= 149; y++) { const j = W.I(x, y); W.ter[j] = T.PLANK; W.flags[j] |= 1 | 4; W.lvl[j] = 0; W.reg[j] = RI.desierto; }
    SAHRIM_DOCK[0] = dx - 4; SAHRIM_DOCK[1] = 147;
    addBuilding(W, 284, 136, 7, 5, { style: 'sahrim', roof: 'sand', sign: 'smith', chimney: true }, 'herreria_sahrim');
    addBuilding(W, 303, 136, 6, 4, { style: 'sahrim', roof: 'sand', sign: 'store', awning: '#c8641a' }, 'tienda_sahrim');
    addBuilding(W, 284, 151, 8, 5, { style: 'sahrim', roof: 'sand', sign: 'inn', chimney: true, big: true }, 'posada_sahrim');
    addBuilding(W, 304, 152, 6, 4, { style: 'sahrim', roof: 'sand', sign: 'alchemy', box: true }, 'alquimia_sahrim');
    addBuilding(W, 291, 136, 5, 4, { style: 'sahrim', roof: 'sand', box: true, v: 7 }, 'casa_s1');
    addBuilding(W, 309, 141, 5, 4, { style: 'sahrim', roof: 'red', v: 8 }, 'casa_s2');
    [[294, 143], [303, 143], [294, 152], [303, 152], [289, 146], [308, 146]].forEach(([x, y]) => L('tree', x, y, { sp: 'palma', deco: true }));
    [[296, 145], [301, 145], [296, 150], [301, 150], [283, 146], [313, 146], [297, 133], [300, 133]].forEach(([x, y]) => lantern(x, y, 'iron'));
    L('stall', 290, 149, { col: '#c8641a', fp: [[0, 0], [1, 0], [-1, 0]] }); L('stall', 307, 149, { col: '#7a3ab0', fp: [[0, 0], [1, 0], [-1, 0]] }); L('barrel', 283, 143); L('crate', 284, 143); L('sack', 313, 151); L('sack', 312, 151); L('banner', 281, 145, { col: '#c8641a' }); L('banner', 281, 150, { col: '#c8641a' });
    W.npcDefs.push({ id: 'navegante', x: SAHRIM_DOCK[0] + 1, y: 146 }, { id: 'sabio', x: 296, y: 141 }, { id: 'sastre_s', x: 307, y: 146, wander: 2 }, { id: 'joyero_s', x: 291, y: 146, wander: 2 }, { id: 'guardia_s', x: 283, y: 149 }, { id: 'mercader_s', x: 302, y: 156, wander: 3 });
  }
  // ---------- ALDEA YARAKAI ----------
  {
    rectTer(W, 332, 152, 358, 172, T.GRASS); rectTer(W, 330, 162, 360, 163, T.DIRT, 1); rectTer(W, 345, 150, 346, 174, T.DIRT, 1); circTer(W, 345.5, 162.5, 3.4, T.DIRT);
    rectTer(W, 348, 168, 357, 171, T.FARM);
    addBuilding(W, 334, 154, 6, 4, { style: 'yarakai', roof: 'thatch', sign: 'smith', chimney: true }, 'herreria_yarakai');
    addBuilding(W, 350, 154, 6, 4, { style: 'yarakai', roof: 'thatch', sign: 'store', awning: '#2a7a3a' }, 'tienda_yarakai');
    addBuilding(W, 334, 165, 7, 4, { style: 'yarakai', roof: 'thatch', sign: 'inn', chimney: true }, 'posada_yarakai');
    addBuilding(W, 338, 158, 4, 3, { style: 'yarakai', roof: 'thatch', v: 9 }, 'casa_y1');
    for (let k = 0; k < 4; k++) L('plot', 349 + k * 2, 169, { pid: 'y' + k, solid: false });
    L('campfire', 345, 160); L('totem', 341, 160); L('totem', 350, 160); L('tent', 352, 159, { col: '#2a7a3a', fp: [[0, 0], [1, 0]] });
    [[333, 152], [357, 152], [333, 171], [343, 171], [358, 163]].forEach(([x, y]) => L('tree', x, y, { sp: 'caoba', deco: true }));
    [[343, 164], [348, 164], [343, 158], [348, 158]].forEach(([x, y]) => lantern(x, y, 'wood'));
    W.npcDefs.push({ id: 'chaman', x: 344, y: 157 }, { id: 'cazadora', x: 341, y: 163, wander: 3 }, { id: 'nayra', x: 352, y: 167, wander: 2 });
  }
  // ---------- CIUDADELA DE ARXAR ----------
  {
    rectTer(W, 104, 26, 152, 72, T.GRASS);
    for (let x = 104; x <= 152; x++) { setTer(W, x, 26, T.CWALL); setTer(W, x, 72, T.CWALL); } for (let y = 26; y <= 72; y++) { setTer(W, 104, y, T.CWALL); setTer(W, 152, y, T.CWALL); }
    rectTer(W, 126, 41, 130, 75, T.COBBLE, 1); rectTer(W, 102, 49, 154, 51, T.COBBLE, 1); circTer(W, 128, 50, 5.6, T.COBBLE);
    rectTer(W, 110, 58, 110, 58, T.COBBLE); rectTer(W, 144, 58, 144, 58, T.COBBLE); rectTer(W, 111, 46, 111, 48, T.COBBLE); rectTer(W, 144, 45, 144, 48, T.COBBLE); rectTer(W, 118, 64, 125, 64, T.COBBLE); rectTer(W, 131, 64, 138, 64, T.COBBLE); rectTer(W, 108, 52, 125, 52, T.COBBLE); rectTer(W, 131, 52, 148, 52, T.COBBLE); rectTer(W, 110, 52, 110, 57, T.COBBLE); rectTer(W, 144, 52, 144, 57, T.COBBLE);
    for (let y = 30; y <= 70; y += 1) { if (y > 44) { setTer(W, 115, y, y % 2 ? T.GRASS : T.GRASS); } }
    addObj(W, 'castle', 128, 40, { px: 128 * 16 + 8, py: 41 * 16 - 1, fp: (() => { const f = []; for (let y = -10; y <= 0; y++) for (let x = -12; x <= 12; x++) if (!(x === 0 && y === 0)) f.push([x, y]); return f; })(), door: [128, 40] });
    W.doors.push({ x: 128, y: 40, to: 'castillo' });
    addObj(W, 'magetower', 111, 45, { fp: (() => { const f = []; for (let y = -3; y <= 0; y++) for (let x = -2; x <= 2; x++) if (!(x === 0 && y === 0)) f.push([x, y]); return f; })() }); W.doors.push({ x: 111, y: 45, to: 'torre_magos' });
    addBuilding(W, 106, 53, 8, 5, { style: 'arxar', roof: 'slate', sign: 'smith', chimney: true, big: true }, 'herreria_arxar');
    addBuilding(W, 140, 53, 9, 5, { style: 'arxar', roof: 'red', sign: 'guild', banner: true, big: true }, 'gremio');
    addBuilding(W, 140, 40, 8, 5, { style: 'arxar', roof: 'blue', sign: 'inn', chimney: true, big: true }, 'posada_arxar');
    addBuilding(W, 115, 60, 6, 4, { style: 'arxar', roof: 'blue', sign: 'store', awning: '#8a1626' }, 'tienda_arxar');
    addBuilding(W, 134, 60, 6, 4, { style: 'arxar', roof: 'purple', sign: 'alchemy' }, 'alquimia_arxar');
    addBuilding(W, 106, 63, 5, 4, { style: 'arxar', roof: 'slate', chimney: true, v: 7 }, 'casa_x1');
    addBuilding(W, 145, 63, 5, 4, { style: 'arxar', roof: 'red', v: 8 }, 'casa_x2');
    addBuilding(W, 119, 66, 5, 4, { style: 'arxar', roof: 'slate', v: 9 }, 'casa_x3');
    addBuilding(W, 133, 66, 5, 4, { style: 'arxar', roof: 'blue', gable: true, v: 10 }, 'casa_x4');
    L('fountain', 128, 50, { px: 128 * 16 + 8, py: 51 * 16 + 4, fp: [[0, 0], [1, 0], [-1, 0], [0, 1], [1, 1], [-1, 1]] });
    [[121, 46], [135, 46], [121, 55], [135, 55]].forEach(([x, y], i) => L('stall', x, y, { col: ['#8a1626', '#1e4a8a', '#2a7a3a', '#c08a20'][i], fp: [[0, 0], [1, 0], [-1, 0]] }));
    [[125, 44], [131, 44], [125, 56], [131, 56], [125, 66], [131, 66], [108, 48], [108, 52], [148, 48], [148, 52], [118, 48], [138, 48], [118, 53], [138, 53]].forEach(([x, y]) => lantern(x, y, 'iron'));
    [[124, 41], [132, 41]].forEach(([x, y]) => L('banner', x, y, { col: '#8a1626' })); [[124, 71], [132, 71]].forEach(([x, y]) => L('banner', x, y, { col: '#8a1626' }));
    L('gatetower', 124, 72, { fp: [[0, 0], [-1, 0], [1, 0]] }); L('gatetower', 132, 72, { fp: [[0, 0], [-1, 0], [1, 0]] }); L('gatetower', 104, 47, { fp: [[0, 0]] }); L('gatetower', 104, 53, { fp: [[0, 0]] }); L('gatetower', 152, 47, { fp: [[0, 0]] }); L('gatetower', 152, 53, { fp: [[0, 0]] });
    [[107, 29], [149, 29], [107, 70], [149, 70], [113, 36], [143, 36], [113, 60], [143, 58], [120, 58], [136, 58]].forEach(([x, y], i) => L('tree', x, y, { sp: i % 3 ? 'cerezo' : 'roble', deco: true }));
    L('statue', 118, 41); L('statue', 138, 41);
    W.npcDefs.push({ id: 'joyero', x: 129, y: 54, wander: 2 }, { id: 'darius', x: 126, y: 42 }, { id: 'guardia_x1', x: 125, y: 70 }, { id: 'guardia_x2', x: 131, y: 70 }, { id: 'guardia_x3', x: 106, y: 49 }, { id: 'guardia_x4', x: 150, y: 51 }, { id: 'ciudadano1', x: 122, y: 50, wander: 4 }, { id: 'ciudadano2', x: 134, y: 62, wander: 4 }, { id: 'ciudadano3', x: 140, y: 50, wander: 4 }, { id: 'minero', x: 178, y: 52 });
  }
}
function landmarks(W) {
  const L = (k, tx, ty, p) => addObj(W, k, tx, ty, p || {}); const R = new RNG(SEED + 31);
  const clear = (cx, cy, r) => { for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) if (dist(x, y, cx, cy) <= r && W.inb(x, y)) { const i = W.I(x, y); W.flags[i] |= 16; } };
  // Orc fortress (Colinas)
  { const cx = 210, cy = 77; for (let a = 0; a < 360; a += 2) { const x = Math.round(cx + Math.cos(a * Math.PI / 180) * 9), y = Math.round(cy + Math.sin(a * Math.PI / 180) * 7); if (y >= cy + 5 && Math.abs(x - cx) <= 1) continue; const i = W.I(x, y); if (!SOLID_T[W.ter[i]]) W.ter[i] = T.PALI; }
    circTer(W, cx, cy, 6, T.DIRT); clear(cx, cy, 8); for (let y = cy + 6; y <= cy + 10; y++) for (let x = cx - 1; x <= cx + 1; x++) { const i = W.I(x, y); if (W.ter[i] === T.PALI) W.ter[i] = T.DIRT; }
    L('tent', cx - 5, cy - 3, { col: '#7a4a2a', fp: [[0, 0], [1, 0], [-1, 0]] }); L('tent', cx + 5, cy - 3, { col: '#6a2a1a', fp: [[0, 0], [1, 0], [-1, 0]] }); L('tent', cx - 6, cy + 2, { col: '#7a4a2a', fp: [[0, 0], [1, 0], [-1, 0]] });
    L('totem', cx - 2, cy - 5); L('totem', cx + 2, cy - 5); L('campfire', cx, cy + 1); L('bones', cx + 4, cy + 3, { solid: false }); L('bones', cx - 3, cy + 4, { solid: false });
    W.bosses.push({ id: 'gruk', x: cx, y: cy - 2 }); }
  // Ruins of Vael
  { const cx = 44, cy = 34; circTer(W, cx, cy, 7, T.STONE); clear(cx, cy, 9);
    for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2, x = Math.round(cx + Math.cos(a) * 8.5), y = Math.round(cy + Math.sin(a) * 6.5); if (canPlace(W, x, y)) L('pillar', x, y, { broken: k % 3 === 0, ivy: true }); }
    L('arch', cx, cy - 7, { fp: [[-1, 0], [1, 0]] }); for (let k = 0; k < 14; k++) { const x = R.int(cx - 22, cx + 22), y = R.int(cy - 16, cy + 18); if (dist(x, y, cx, cy) > 10 && canPlace(W, x, y, 1) && !(W.flags[W.I(x, y)] & 1)) { const t = R.f(); if (t < 0.3) L('arch', x, y, { fp: [[-1, 0], [1, 0]] }); else if (t < 0.6) L('ruinwall', x, y, { fp: [[0, 0], [1, 0], [-1, 0]] }); else if (t < 0.85) L('pillar', x, y, { broken: R.f() < 0.6, ivy: true }); else L('grave', x, y); } }
    W.bosses.push({ id: 'vael', x: cx, y: cy }); }
  // Witch hut (Pantano)
  { const cx = 25, cy = 94; clear(cx, cy, 6); L('witchhut', cx - 2, cy - 3, { fp: [[0, 0], [1, 0], [-1, 0]] }); L('campfire', cx + 3, cy + 1); for (let k = 0; k < 4; k++) L('mushroom', cx - 4 + k * 3, cy + 4, { solid: false }); W.bosses.push({ id: 'morgana', x: cx, y: cy + 1 }); }
  // Ent grove (Bosque)
  { const cx = 28, cy = 160; clear(cx, cy, 6); L('tree', cx - 4, cy - 5, { sp: 'ancestral', deco: true, fp: [[0, 0], [-1, 0], [1, 0]] }); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; L('mushroom', Math.round(cx + Math.cos(a) * 5), Math.round(cy + Math.sin(a) * 4), { solid: false }); } W.bosses.push({ id: 'ent', x: cx, y: cy }); }
  // King slime meadow
  { const cx = 96, cy = 172; clear(cx, cy, 6); W.bosses.push({ id: 'reyslime', x: cx, y: cy - 1 }); }
  // Ice golem
  { const cx = 214, cy = 30; clear(cx, cy, 6); for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, x = Math.round(cx + Math.cos(a) * 6), y = Math.round(cy + Math.sin(a) * 5); if (canPlace(W, x, y)) L('crystal', x, y); } W.bosses.push({ id: 'golemhielo', x: cx, y: cy }); }
  // Mining camp
  { const cx = 176, cy = 50; clear(cx, cy, 5); L('mine', cx, cy - 3, { fp: [[0, 0], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1]] }); L('tent', cx - 4, cy + 1, { col: '#a89870', fp: [[0, 0], [1, 0], [-1, 0]] }); L('campfire', cx + 2, cy + 2); L('crate', cx + 4, cy - 1); L('barrel', cx + 5, cy - 1); }
  // Nhar: dock, dragon crater, abyss
  { const RN = REGIONS.findIndex(r => r.k === 'nhar'); for (let y = 167; y <= 170; y++) for (let x = 214; x <= 219; x++) { const i = W.I(x, y); if (WATERY[W.ter[i]] || W.ter[i] === T.SAND) { W.ter[i] = T.PLANK; W.flags[i] |= 1; W.reg[i] = RN; } }
    { const cx = 214, cy = 152; clear(cx, cy, 6); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, x = Math.round(cx + Math.cos(a) * 6), y = Math.round(cy + Math.sin(a) * 4); if (canPlace(W, x, y)) L('rock', x, y, { size: 's', kind: '', v: k }); } W.bosses.push({ id: 'kragg', x: cx, y: cy }); }
    { const cx = 150, cy = 98; clear(cx, cy, 5); L('hay', cx - 3, cy - 3); L('bones', cx + 3, cy + 2, { solid: false }); W.bosses.push({ id: 'colmillo', x: cx, y: cy }); }
    { const cx = 96, cy = 80; clear(cx, cy, 6); L('tent', cx - 3, cy - 3, { col: '#6a2010', fp: [[0, 0], [1, 0]] }); L('campfire', cx + 3, cy - 2); L('banner', cx - 5, cy, { col: '#6a2010' }); W.bosses.push({ id: 'renegado', x: cx, y: cy + 1 }); }
    { const cx = 322, cy = 172; clear(cx, cy, 6); for (let k = 0; k < 5; k++) L('bones', cx - 5 + k * 2 + (k % 2), cy - 4 + (k % 2) * 8, { solid: false }); L('obelisk', cx - 5, cy - 1); W.bosses.push({ id: 'sahrak', x: cx, y: cy }); }
    { const cx = 368, cy = 112; clear(cx, cy, 6); L('totem', cx - 4, cy - 4); L('totem', cx + 4, cy - 4); W.bosses.push({ id: 'yarak', x: cx, y: cy }); }
    { const cx = 288, cy = 26; clear(cx, cy, 6); for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, x = Math.round(cx + Math.cos(a) * 6), y = Math.round(cy + Math.sin(a) * 5); if (canPlace(W, x, y)) L('crystal', x, y); } W.bosses.push({ id: 'coloso', x: cx, y: cy }); }
    { const cx = 366, cy = 22; clear(cx, cy, 6); circTer(W, cx, cy, 5, T.STONE); L('portal', cx, cy - 4, { fp: [[0, 0], [-1, 0], [1, 0]] }); for (const sx of [-5, 5]) L('obsidian', cx + sx, cy); W.bosses.push({ id: 'eclipsor', x: cx, y: cy + 1 }); }
    const dx = 232, dy = 166; clear(dx, dy, 6); circTer(W, dx, dy, 5.5, T.ASH); W.bosses.push({ id: 'ignaroth', x: dx, y: dy });
    const ax = 228, ay = 178; clear(ax, ay, 5); circTer(W, ax, ay, 4, T.STONE); L('portal', ax, ay - 2, { fp: [[0, 0], [-1, 0], [1, 0]] }); W.bosses.push({ id: 'desatado', x: ax, y: ay + 1 });
    W.npcDefs.push({ id: 'marina_nhar', x: 218, y: 168 }); }
  W.npcDefs.push({ id: 'ermitano', x: 60, y: 152 });
  // waystones
  for (const s of WAYSTONES) { L('waystone', s.x, s.y, { ws: s.k }); }
}
function nature(W) {
  const R = new RNG(SEED + 101), N = W.w * W.h;
  const SPEC = { volcan: [['palma', 6], ['roble', 1]], valle: [['roble', 9], ['cerezo', 1]], costa: [['roble', 1]], bosque: [['pino', 5], ['roble', 5]], llanuras: [['abedul', 1]], arxar: [['roble', 5], ['abedul', 3], ['cerezo', 2]], colinas: [['ebano', 6], ['roble', 4]], pantano: [['sauce', 6], ['muerto', 4]], ruinas: [['abedul', 5], ['cerezo', 2], ['muerto', 3]], picos: [['pinonev', 8], ['pino', 2]], nhar: [['ceniza', 1]], desierto: [['acacia', 6], ['palma', 3]], selva: [['caoba', 7], ['palma', 2], ['sauce', 1]], cristal: [['arbolcristal', 7], ['abedul', 3]], eclipse: [['umbrio', 7], ['muerto', 3]] };
  const DENS = { volcan: [0.03, 0.12], valle: [0.025, 0.28], costa: [0.012, 0.1], bosque: [0.16, 0.5], llanuras: [0.008, 0.14], arxar: [0.03, 0.22], colinas: [0.035, 0.24], pantano: [0.07, 0.3], ruinas: [0.05, 0.22], picos: [0.05, 0.24], nhar: [0.03, 0.08], desierto: [0.006, 0.05], selva: [0.18, 0.55], cristal: [0.04, 0.2], eclipse: [0.03, 0.14] };
  const order = []; for (let i = 0; i < N; i++) order.push(i); for (let i = N - 1; i > 0; i--) { const j = Math.floor(R.f() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const okGround = t => t === T.GRASS || t === T.SNOW || t === T.ASH || t === T.MUD || t === T.SAND || t === T.DIRT || t === T.DUSK;
  const nearRoad = (x, y, r) => { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (!W.inb(x + dx, y + dy)) continue; const i = W.I(x + dx, y + dy); if (W.flags[i] & (1 | 2 | 16)) return true; } return false; };
  const treeOcc = new Uint8Array(N);
  for (const i of order) {
    const x = i % W.w, y = (i / W.w) | 0; if (x < 2 || y < 3 || x > W.w - 3 || y > W.h - 2) continue;
    const t = W.ter[i]; if (!okGround(t) || W.objAt[i] >= 0) continue; if (W.townAt[i] >= 0) continue;
    const rk = REGIONS[W.reg[i]].k; if (rk === 'mar') continue; const D = DENS[rk];
    const cl = fbm(x / 9, y / 9, 88, 3); const dens = D[0] + (cl > 0.58 ? D[1] * (cl - 0.58) / 0.25 : 0);
    if (R.f() < dens) {
      if (nearRoad(x, y, 1)) continue; if (t === T.DIRT && rk !== 'colinas') continue;
      let ok = true; for (let dy = -1; dy <= 1 && ok; dy++) for (let dx = -1; dx <= 1; dx++) { const j = W.I(x + dx, y + dy); if (treeOcc[j] || SOLID_T[W.ter[j]] || W.ter[j] === T.STAIRS || W.objAt[j] >= 0) { ok = false; break; } }
      // keep canopy clear of cliff faces just above
      for (let dy = -3; dy <= -1 && ok; dy++) { const j = W.I(x, y + dy); if (W.ter[j] === T.FACE || W.ter[j] === T.FALL) ok = false; }
      if (!ok) continue;
      let sp = choiceW(R, SPEC[rk].map(a => ({ k: a[0], w: a[1] }))).k; if (t === T.SAND && rk !== 'desierto') { if (rk !== 'costa' && rk !== 'valle') continue; sp = 'palma'; } if (rk === 'picos' && t === T.GRASS) sp = 'pino';
      addObj(W, 'tree', x, y, { sp, v: R.int(0, 3) }); treeOcc[i] = 1; continue;
    }
    const r2 = R.f();
    if (r2 < 0.007 + (rk === 'colinas' || rk === 'picos' ? 0.008 : 0)) { if (nearRoad(x, y, 0)) continue; const kind = rk === 'picos' ? 'snow' : rk === 'nhar' ? 'obs' : rk === 'bosque' || rk === 'ruinas' || rk === 'pantano' ? 'moss' : ''; const sz = R.pick(['s', 's', 'm', 'm', 'l']); addObj(W, 'rock', x, y, { size: sz, kind, v: R.int(0, 5), fp: sz === 'l' ? [[0, 0], [1, 0]] : [[0, 0]] }); }
    else if (rk === 'desierto' && r2 < 0.026) { if (nearRoad(x, y, 0)) continue; if (R.f() < 0.65) addObj(W, 'cactus', x, y, { v: R.int(0, 3) }); else addObj(W, 'bones', x, y, { solid: false }); }
    else if ((rk === 'cristal' || rk === 'eclipse') && r2 < 0.02) { if (nearRoad(x, y, 0)) continue; addObj(W, rk === 'cristal' ? 'crystal' : 'obsidian', x, y, { v: R.int(0, 3) }); }
    else if (r2 < 0.017) { if (nearRoad(x, y, 0)) continue; const kind = rk === 'pantano' ? 'swamp' : rk === 'picos' ? 'snow' : R.f() < 0.2 ? 'berry' : ''; if (rk === 'nhar') continue; addObj(W, 'bush', x, y, { kind, v: R.int(0, 3) }); }
  }
  // resource nodes
  const ORES = NAT_ORES, HERBS = NAT_HERBS;
  const tilesOf = {}; for (let i = 0; i < N; i++) { const rk = REGIONS[W.reg[i]].k; (tilesOf[rk] = tilesOf[rk] || []).push(i); }
  const placeN = (rk, n, fn) => { const arr = tilesOf[rk] || [], done = []; let tries = 0, put = 0; while (put < n && tries < n * 200) { tries++; const i = arr[Math.floor(R.f() * arr.length)]; const x = i % W.w, y = (i / W.w) | 0; if (!okGround(W.ter[i]) || W.townAt[i] >= 0 || (W.flags[i] & 4) || nearRoad(x, y, 1) || !canPlace(W, x, y, 1)) continue; if (tries < n * 150 && done.some(p => dist2(p[0], p[1], x, y) < 16)) continue; done.push([x, y]); fn(x, y); put++; } };
  for (const rk in ORES) for (const [tier, n] of ORES[rk]) placeN(rk, n, (x, y) => addObj(W, 'ore', x, y, { tier, v: R.int(0, 3) }));
  for (const rk in HERBS) for (const [tier, n] of HERBS[rk]) placeN(rk, n, (x, y) => addObj(W, 'herb', x, y, { tier, solid: false }));
  for (const rk in NAT_MOUNDS) for (const [tier, n] of NAT_MOUNDS[rk]) placeN(rk, n, (x, y) => addObj(W, 'mound', x, y, { tier, solid: false }));
  // reeds & lilies near swamp/pond shores are baked decor
}
const SAHRIM_DOCK = [270, 147];
const NAT_ORES = { valle: [[1, 18]], costa: [[1, 10]], bosque: [[2, 16]], llanuras: [[2, 10], [3, 5]], arxar: [[3, 10]], colinas: [[3, 10], [4, 10]], pantano: [[4, 14]], ruinas: [[5, 16]], picos: [[5, 8], [6, 14]], nhar: [[7, 10]], desierto: [[8, 16]], selva: [[8, 6], [9, 14]], cristal: [[10, 18]], eclipse: [[10, 6], [11, 14]] };
const NAT_HERBS = { valle: [[1, 28]], costa: [[1, 10]], bosque: [[2, 24]], llanuras: [[3, 20]], arxar: [[2, 8]], colinas: [[3, 14]], pantano: [[4, 24]], ruinas: [[5, 22]], picos: [[6, 22]], nhar: [[7, 12]], desierto: [[8, 14]], selva: [[9, 22]], cristal: [[10, 18]], eclipse: [[11, 16]] };
const NAT_MOUNDS = { valle: [[1, 8]], costa: [[1, 6]], bosque: [[2, 6]], llanuras: [[3, 8]], arxar: [[3, 4]], colinas: [[4, 6]], pantano: [[5, 6]], ruinas: [[6, 8]], picos: [[7, 6]], nhar: [[8, 5]], desierto: [[9, 14]], selva: [[9, 6]], cristal: [[10, 8]], eclipse: [[11, 8]] };
NAT_ORES.volcan = [[10, 8], [11, 8]]; NAT_HERBS.volcan = [[10, 10]]; NAT_MOUNDS.volcan = [[6, 8]];
function bridgeRails(W) {
  for (let y = 1; y < W.h - 1; y++) for (let x = 1; x < W.w - 1; x++) {
    const i = W.I(x, y); if (W.ter[i] !== T.BRIDGE) continue;
    const up = W.ter[W.I(x, y - 1)], dn = W.ter[W.I(x, y + 1)], lf = W.ter[W.I(x - 1, y)], rt = W.ter[W.I(x + 1, y)];
    let hc = 0, vc = 0; for (let d = -3; d <= 3; d++) { if (W.ter[W.I(x + d, y)] === T.BRIDGE) hc++; if (W.ter[W.I(x, y + d)] === T.BRIDGE) vc++; }
    if (hc >= vc) { if (up !== T.BRIDGE && WATERY[up]) addObj(W, 'rail', x, y, { o: 'h', solid: false, py: y * 16 + 2 }); if (dn !== T.BRIDGE && WATERY[dn]) addObj(W, 'rail', x, y, { o: 'h', solid: false, py: y * 16 + 15 }); }
    else { if (lf !== T.BRIDGE && WATERY[lf]) addObj(W, 'rail', x, y, { o: 'v', solid: false, px: x * 16 + 2 }); if (rt !== T.BRIDGE && WATERY[rt]) addObj(W, 'rail', x, y, { o: 'v', solid: false, px: x * 16 + 14 }); }
    // lanterns at bridge ends
    if (hc >= vc && lf !== T.BRIDGE && !WATERY[lf] && up !== T.BRIDGE && WATERY[up] && hash2(x, y, 3) < 0.7) { if (canPlace(W, x - 1, y - 1)) addObj(W, 'lantern', x - 1, y - 1, { kind: 'wood' }); }
    if (hc < vc && up !== T.BRIDGE && !WATERY[up] && lf !== T.BRIDGE && WATERY[lf] && hash2(x, y, 3) < 0.7) { if (canPlace(W, x - 1, y - 1)) addObj(W, 'lantern', x - 1, y - 1, { kind: 'wood' }); }
  }
}
// safe spots outside towns: waystones and the Nhar landing (mobs never spawn near them nor chase into them)
const SAFE_SPOTS = WAYSTONES.filter(w => !TOWNS.some(t => t.k === w.k)).map(w => [w.x, w.y + 1, 4]).concat([[217, 169, 5], [272, 147, 7]]);
// spawn camps
function makeCamps(W, MOBS) {
  const R = new RNG(SEED + 202); const camps = [];
  const byReg = {}; for (const id in MOBS) { const m = MOBS[id]; if (!m.reg) continue; for (const rg of m.reg) (byReg[rg] = byReg[rg] || []).push(id); }
  const pts = [];
  for (let k = 0; k < 14000 && camps.length < 540; k++) {
    const x = R.int(3, W.w - 4), y = R.int(3, W.h - 4), i = W.I(x, y); const rk = REGIONS[W.reg[i]].k; if (rk === 'mar' || !byReg[rk]) continue;
    if (SOLID_T[W.ter[i]] || W.ter[i] === T.STAIRS || W.ter[i] === T.BRIDGE || W.objAt[i] >= 0 || (W.flags[i] & (4 | 2 | 16)) || W.townAt[i] >= 0) continue;
    let far = true; for (const p of pts) if (dist2(p[0], p[1], x, y) < 64) { far = false; break; } if (!far) continue;
    let nearT = false; for (const t of TOWNS) if (x > t.x0 - 8 && x < t.x1 + 8 && y > t.y0 - 8 && y < t.y1 + 8) nearT = true; for (const s of SAFE_SPOTS) if (dist2(s[0], s[1], x, y) < (s[2] + 8) * (s[2] + 8)) nearT = true; for (const b of W.bosses) if (dist2(b.x, b.y, x, y) < 196) nearT = true; if (nearT) continue;
    pts.push([x, y]); const reg = REGIONS[W.reg[i]];
    const list = byReg[rk]; const id = list[Math.floor(R.f() * list.length)]; const m = MOBS[id];
    const lv = clamp(Math.round(lerp(Math.max(reg.lv[0], m.lv[0]), Math.min(reg.lv[1], m.lv[1]), R.f())), 1, MAXLV);
    camps.push({ x, y, mob: id, lv, n: m.group || R.int(2, 3), r: 4, alive: [], dead: [], L: W.lvl[i] });
  }
  W.camps = camps;
}
function buildWorld(MOBS) {
  const W = genWorld(); W.bosses = []; W.npcDefs = []; W.doors = []; initMapObjs(W);
  townLayouts(W); placeBrasa(W); landmarks(W); placeTownDecor(W); placePetShop(W); placeCaves(W); placeRails(W); placeDiveSpots(W); bridgeRails(W);
  for (const [sx, sy, r] of SAFE_SPOTS) for (let y = sy - r; y <= sy + r; y++) for (let x = sx - r; x <= sx + r; x++) if (W.inb(x, y) && dist2(x, y, sx, sy) <= r * r) W.flags[W.I(x, y)] |= 4;
  nature(W);
  // town flags & safety
  for (let i = 0; i < W.w * W.h; i++) if (W.townAt[i] >= 0) W.flags[i] |= 4;
  makeCamps(W, MOBS); prepPalettes(W);
  return W;
}
