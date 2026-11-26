(() => {
const H = h => C(h), PAL = a => a.map(H);
const RED = PAL(['#2a0608', '#5a1014', '#8a1e22', '#b03a36', '#d8706a']);   // sombrero y forro
const BAND = PAL(['#6a4a44', '#a88a80', '#d8c0b4', '#f0e0d4']);
const BLK = PAL(['#08070c', '#141219', '#201d28', '#2e2a38', '#403a4c']);    // negro de la ropa
const GRY = PAL(['#141218', '#24212c', '#34303e', '#464252', '#5a5668']);    // capa exterior del top
const BOOT = PAL(['#1a1626', '#2c2640', '#40385a', '#584e76', '#726894']);
const GLOW = PAL(['#7a2a08', '#e0601a', '#ff9a2a', '#ffd070', '#fff4c0']);
const set = (p, x, y, c) => p.set(Math.round(x), Math.round(y), c);
const row = (p, x0, x1, y, c) => { for (let x = Math.round(x0); x <= Math.round(x1); x++) p.set(x, Math.round(y), c); };
// ---- sombrero de ala ancha con cinta cosida y gafas brillantes sobre el ala ----
fitKind('head', 'smp_hat', (p, A) => { const { hx, hy, side, up, d, headTop } = A, hr = A.hrx || 7, by = Math.round(hy - 3);
  const W = hr + 6; // ala
  for (let y = 0; y < by - 1; y++) for (let x = hx - W - 3; x <= hx + W + 3; x++) p.set(x, y, 0); // el pelo no asoma por encima del ala
  for (let x = hx - W; x <= hx + W; x++) { const e = Math.abs(x - hx) > W - 3 ? 1 : 0, t = side ? (x - hx) * d : 0; const y = by + e - (side && t > W - 4 ? 1 : 0);
    set(p, x, y, RED[1]); set(p, x, y - 1, RED[x < hx ? 3 : 2]); if (Math.abs(x - hx) < W - 1) set(p, x, y + 1, RED[0]); }
  const top = Math.round(headTop - 2), cw = hr - 1;
  for (let y = top; y < by - 1; y++) { const k = (y - top) / Math.max(1, by - 1 - top), half = Math.round(cw - 1 + k * 1.5); for (let x = hx - half; x <= hx + half; x++) set(p, x, y, RED[x === hx - half ? 3 : x === hx + half ? 1 : y === top ? 3 : 2]); }
  // cinta clara con puntadas
  for (let x = hx - cw - 1; x <= hx + cw + 1; x++) { set(p, x, by - 2, BAND[(x % 3) ? 2 : 1]); set(p, x, by - 3, BAND[(x % 3) ? 3 : 2]); }
  if (up) return;
  // gafas de cristal naranja brillante en la parte delantera del ala
  const lens = side ? [hx + d * (hr - 1)] : [hx - 3, hx + 3];
  for (const lx of lens) { row(p, lx - 1, lx + 1, by - 1, GLOW[2]); row(p, lx - 1, lx + 1, by, GLOW[1]); set(p, lx, by - 1, GLOW[4]); set(p, lx - 1, by - 2, GLOW[3]); set(p, lx + 1, by - 2, GLOW[3]); set(p, lx, by - 2, GLOW[3]); }
  if (!side) set(p, hx, by - 1, BLK[3]);
}, {});
// ---- top doble: cuello alto negro + blusa gris caída de un hombro, guantes largos y collar ----
fitKind('body', 'smp_top', (p, A) => { const { tx0, tw, torsoTop: ty, cx, side, up, d, legTop } = A, R = tx0 + tw - 1, SK = A.sk;
  const x0 = side ? cx - 3 : tx0, x1 = side ? cx + 2 : R;
  for (let y = ty - 1; y < legTop; y++) for (let x = x0; x <= x1; x++) set(p, x, y, BLK[x === x0 ? 3 : x === x1 ? 1 : 2]);
  row(p, cx - 2, cx + 1, ty - 2, BLK[3]); // cuello alto
  // blusa gris encima: del pecho a la cintura, deja al aire un hombro (el izquierdo del personaje)
  const bare = side ? (d > 0 ? 'none' : 'all') : 'R';
  for (let y = ty + 1; y <= A.waistY + 1; y++) for (let x = x0; x <= x1; x++) { if (y === ty + 1 && ((bare === 'R' && x > cx) || bare === 'all')) continue; set(p, x, y, GRY[(x + y) % 5 === 0 ? 1 : x === x0 ? 3 : x === x1 ? 1 : 2]); }
  if (!side && !up) { set(p, R, ty, SK[2]); set(p, R - 1, ty, SK[2]); set(p, R, ty + 1, SK[1]); }   // hombro al aire
  // faja negra en la cintura
  row(p, x0, x1, A.waistY + 2, BLK[1]); row(p, x0, x1, A.waistY + 3, BLK[2]);
  if (up || side) return;
  // collar de cadena blanca y colgante rosa
  for (let k = -3; k <= 3; k++) set(p, cx + k - (k < 0 ? 1 : 0), ty + 1 + (Math.abs(k) < 2 ? 1 : 0), k % 2 ? H('#e8e8f0') : H('#b0b0c0'));
  set(p, cx - 1, ty + 3, H('#e050c0')); set(p, cx, ty + 3, H('#ff9ae8')); set(p, cx - 1, ty + 4, H('#a02a90'));
}, {});
// ---- capa negra con forro rojo y bordes rotos ----
fitKind('back', 'smp_cape', (p, A) => { const { cx, tw, torsoTop: ty, base, side, up, d, anim, f } = A, half0 = tw / 2, sw = anim === 'walk' ? (f % 2) : 0, bot = base + 1 - sw;
  const rag = (x, y) => y >= bot - 2 && ((x * 7 + (y - bot) * 3 + 40) % 5 < 2);
  if (up) { for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), hw = Math.round(half0 + 2 + t * 4);
      for (let x = cx - hw; x < cx + hw; x++) { if (rag(x, y)) continue; set(p, x, y, x <= cx - hw + 1 || x >= cx + hw - 2 ? RED[2] : (x - cx + 41) % 4 === 0 ? BLK[1] : BLK[2]); } }
    row(p, cx - half0 - 2, cx + half0 + 1, ty - 2, RED[2]); return; }
  if (side) { for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), w = Math.round(3 + t * 6) + sw, x0 = cx - d * 2;
      for (let i = 0; i < w; i++) { const x = x0 - d * i; if (rag(x, y)) continue; set(p, x, y, i === w - 1 ? RED[3] : i === 0 ? RED[1] : (i === w - 2 ? RED[2] : BLK[2])); } } return; }
  for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), hw = Math.round(half0 + 3 + t * 5);
    for (let x = cx - hw; x < cx + hw; x++) { if (rag(x, y)) continue; if (y >= A.legTop && Math.abs(x - cx + 0.5) < half0 + 1) continue; const edge = x <= cx - hw + 1 || x >= cx + hw - 2; set(p, x, y, edge ? (x <= cx - hw ? RED[1] : x >= cx + hw - 1 ? RED[1] : RED[3]) : RED[(x + y) % 4 ? 2 : 1]); } }
  // cuello alzado de la capa a los lados
  for (const sg of [-1, 1]) { const xx = Math.round(cx + sg * (half0 + 1)) - (sg > 0 ? 1 : 0); for (let k = 0; k < 3; k++) { set(p, xx + sg * k, ty - 2 - k, RED[3]); set(p, xx + sg * k, ty - 1 - k, RED[2]); } }
}, {});
// ---- falda negra larga en capas con bajo roto ----
fitKind('legs', 'smp_skirt', (p, A) => { const { tx0, tw, cx, side, up, legTop, base, anim, f } = A, R = tx0 + tw - 1, len = Math.max(4, Math.round((base - legTop) * 0.42));
  for (let y = legTop; y <= legTop + len; y++) { const e = (y - legTop) / len * 2, x0 = Math.round((side ? cx - 4 : tx0 - 1) - e), x1 = Math.round((side ? cx + 3 : R + 1) + e);
    for (let x = x0; x <= x1; x++) { if (y === legTop + len && (x + f) % 2) continue; const band = (y - legTop) % 3 === 2; set(p, x, y, band ? BLK[0] : x === x0 ? BLK[3] : x === x1 ? BLK[1] : ((x - cx + 40) % 3 === 0 ? BLK[1] : BLK[2])); } }
}, {});
// ---- botas altas hasta el muslo, morado grisáceo con cordones ----
fitKind('feet', 'smp_boots', (p, A, s) => { const { legTop, base, up } = A, top = Math.round(legTop + 1), cols = new Set([...(A.sk || []), ...s.m]);
  const pts = []; for (let y = top; y <= base + 1; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) pts.push([x, y]);
  const has = (x, y) => pts.some(q => q[0] === x && q[1] === y);
  for (const [x, y] of pts) set(p, x, y, !has(x - 1, y) ? BOOT[3] : !has(x + 1, y) ? BOOT[1] : y >= base ? BOOT[0] : BOOT[2]);
  if (!up) for (const [x, y] of pts) if (y % 2 === 0 && has(x - 1, y) && has(x + 1, y) && y < base - 1) set(p, x, y, BOOT[4]);
}, {});
const S = (k, m) => () => ({ k, m: m || BLK, s: RED, cover: k === 'smp_hat' ? 'hat' : undefined });
cosm('c_smp_hat', 'Sombrero', 'head', S('smp_hat', RED)); cosm('c_smp_top', 'Top', 'body', S('smp_top')); cosm('c_smp_cape', 'Capa', 'back', S('smp_cape'));
cosm('c_smp_skirt', 'Falda', 'legs', S('smp_skirt')); cosm('c_smp_boots', 'Botas', 'feet', S('smp_boots', BOOT));
})();
