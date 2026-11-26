// 6.32 · Conjunto de la Bruja Carmesí (Sergio: dibujo de referencia con sombrero de ala ancha, gafas en el sombrero,
// capa rasgada, top doble con hombro al aire, collar, falda y botas altas). Lo vende Morwenna (Taller gótico, Albor)
// por piezas y cada una va a su ranura del Armario: Cabeza, Torso, Piernas, Pies y Espalda.
// - Todo con anclajes de fitKind (sirve en las 22 estructuras y en 4 direcciones). No cambia la piel ni las estadísticas.
// - Sombrero: el pelo que asomaría por encima del ala se borra (capa 6 = pelo, o sus colores), así cada peinado se ve a su manera.
// - Top: polera negra de cuello alto con mangas negras y blusa gris debajo; la manga izquierda se baja y deja el hombro al
//   aire (de frente). Se pinta después del brazo con un gancho de drawHero (capa 3 = brazo, como 6zzzzzu_inf_ropa).
const BC = (() => { const P = a => a.map(h => C(h)); return {
  red: P(['#2a0608', '#5a1014', '#8a1e22', '#b03a36', '#d8706a']), band: P(['#6a4a44', '#a88a80', '#d8c0b4', '#f0e0d4']),
  blk: P(['#08070c', '#141219', '#201d28', '#2e2a38', '#403a4c']), gry: P(['#3a3840', '#5c5a64', '#7c7a84', '#9a98a2', '#b8b6c0']),
  boot: P(['#2a2240', '#4a4070', '#6a5e98', '#8a80b8', '#b0a8d8']), glow: P(['#7a2a08', '#e0601a', '#ff9a2a', '#ffd070', '#fff4c0']),
  leg: P(['#100f14', '#17151c', '#1e1b24', '#26222e', '#2e2a36']), chain: P(['#b0b0c0', '#e8e8f0']), gem: P(['#a02a90', '#e050c0', '#ff9ae8']) }; })();
const bcSet = (p, x, y, c) => p.set(Math.round(x), Math.round(y), c);
const bcRow = (p, x0, x1, y, c) => { for (let x = Math.round(x0); x <= Math.round(x1); x++) p.set(x, Math.round(y), c); };
const bcSkirtLen = A => Math.max(2, Math.round((A.base - A.legTop) * 0.25));
// ---- sombrero de ala ancha con cinta cosida y gafas de cristal naranja sobre el ala ----
fitKind('head', 'bc_sombrero', (p, A, s) => { const { hx, hy, side, up, d, headTop } = A, R = BC.red, hr = A.hrx || 7, by = Math.round(hy - 3), W = hr + 6;
  for (let x = hx - W; x <= hx + W; x++) { const e = Math.abs(x - hx) > W - 3 ? 1 : 0, y = by + e - (side && (x - hx) * d > W - 4 ? 1 : 0);
    bcSet(p, x, y, R[1]); bcSet(p, x, y - 1, R[x < hx ? 3 : 2]); if (Math.abs(x - hx) < W - 1) bcSet(p, x, y + 1, R[0]); }
  const top = Math.round(headTop - 2), cw = hr - 1;
  for (let y = top; y < by - 1; y++) { const k = (y - top) / Math.max(1, by - 1 - top), half = Math.round(cw - 1 + k * 1.5); for (let x = hx - half; x <= hx + half; x++) bcSet(p, x, y, R[x === hx - half ? 3 : x === hx + half ? 1 : y === top ? 3 : 2]); }
  for (let x = hx - cw - 1; x <= hx + cw + 1; x++) { bcSet(p, x, by - 2, BC.band[(x % 3) ? 2 : 1]); bcSet(p, x, by - 3, BC.band[(x % 3) ? 3 : 2]); }
  if (up) return; const G_ = BC.glow;
  for (const lx of side ? [hx + d * (hr - 1)] : [hx - 3, hx + 3]) { bcRow(p, lx - 1, lx + 1, by - 1, G_[2]); bcRow(p, lx - 1, lx + 1, by, G_[1]); bcSet(p, lx, by - 1, G_[4]); bcRow(p, lx - 1, lx + 1, by - 2, G_[3]); }
  if (!side) bcSet(p, hx, by - 1, BC.blk[3]);
});
// ---- top doble: polera negra de cuello alto y mangas negras, blusa gris debajo, faja y collar con colgante ----
fitKind('body', 'bc_top', (p, A) => { const { tx0, tw, torsoTop: ty, cx, side, up, legTop } = A, R = tx0 + tw - 1, K = BC.blk, Gy = BC.gry;
  const x0 = side ? cx - 3 : tx0, x1 = side ? cx + 2 : R, gy = ty + 3;
  for (let y = ty - 1; y < legTop; y++) for (let x = x0; x <= x1; x++) bcSet(p, x, y, K[x === x0 ? 3 : x === x1 ? 1 : 2]);
  bcRow(p, cx - 2, cx + 1, ty - 2, K[3]); bcRow(p, cx - 2, cx + 1, ty - 1, K[4]);
  for (let y = gy; y <= A.waistY + 1; y++) for (let x = x0; x <= x1; x++) bcSet(p, x, y, Gy[x === x0 ? 4 : x === x1 ? 1 : ((x + y) % 4 === 0 ? 3 : 2)]);
  bcRow(p, x0, x1, gy - 1, K[0]); bcRow(p, x0, x1, A.waistY + 2, K[1]); bcRow(p, x0, x1, A.waistY + 3, K[3]);
  if (up || side) return;
  for (let k = -3; k <= 1; k++) bcSet(p, cx + k, ty + (Math.abs(k + 0.5) < 2 ? 2 : 1), BC.chain[k % 2 ? 1 : 0]);
  bcSet(p, cx - 1, ty + 3, BC.gem[2]); bcSet(p, cx, ty + 3, BC.gem[1]); bcSet(p, cx - 1, ty + 4, BC.gem[0]); bcSet(p, cx, ty + 4, BC.gem[0]);
}, { skin: true });
hookBefore('drawHero', (p, L) => { if (L && ((L.top && L.top.k === 'bc_top') || (L.head && L.head.k === 'bc_sombrero')) && p && !p.t) { p.t = new Uint8Array(p.w * p.h); p.tg = 0; } });
// el pelo se dibuja después del sombrero: al final se quita el que queda por encima del ala (en cada columna, lo que
// está más arriba que el píxel más bajo del sombrero). Solo pelo (capa 6 o sus colores); el arma y lo demás no se tocan.
const BC_HAT = new Set([...BC.red, ...BC.band, ...BC.glow]);
hookAfter('drawHero', (r, p, L) => {
  const Hd = L && L.head; if (!Hd || Hd.k !== 'bc_sombrero' || !p || !p.d) return; const hair = new Set(Hd.hair || []), W = p.w;
  for (let x = 0; x < W; x++) { let low = -1; for (let y = p.h - 1; y >= 0; y--) if (BC_HAT.has(p.d[y * W + x])) { low = y; break; } if (low < 0) continue;
    for (let y = 0; y < low; y++) { const i = y * W + x; if (BC_HAT.has(p.d[i])) continue; if ((p.t && p.t[i] === 6) || hair.has(p.d[i])) { p.d[i] = 0; if (p.t) p.t[i] = 0; } } }
});
hookAfter('drawHero', (r, p, L, dir) => {
  const T = L && L.top; if (!T || T.k !== 'bc_top' || !p || !p.t || !p.meta || dir !== 'down') return;
  const cx = p.meta.cx, SK = Array.from(L.skin || SKINS[0]).map(c => typeof c === 'string' ? C(c) : c), pts = [];
  for (let i = 0; i < p.d.length; i++) if (p.t[i] === 3 && T.m.includes(p.d[i]) && i % p.w >= cx) pts.push(i);
  if (!pts.length) return; const own = new Set(pts); let y0 = 1e9; for (const i of pts) y0 = Math.min(y0, (i / p.w) | 0);
  for (const i of pts) { const y = (i / p.w) | 0; if (y <= y0 + 1) p.d[i] = y === y0 ? SK[2] : SK[own.has(i + 1) ? 2 : 1]; else if (y === y0 + 2) p.d[i] = BC.blk[0]; }
});
// ---- capa negra con forro rojo, cuello alzado y bordes rotos ----
fitKind('back', 'bc_capa', (p, A) => { const { cx, tw, torsoTop: ty, base, side, up, d, anim, f } = A, R = BC.red, K = BC.blk, half0 = tw / 2, sw = anim === 'walk' ? (f % 2) : 0, bot = base + 1 - sw;
  const rag = (x, y) => y >= bot - 2 && ((x * 7 + (y - bot) * 3 + 40) % 5 < 2);
  if (up) { for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), hw = Math.round(half0 + 2 + t * 4);
      for (let x = cx - hw; x < cx + hw; x++) { if (rag(x, y)) continue; bcSet(p, x, y, x <= cx - hw + 1 || x >= cx + hw - 2 ? R[2] : (x - cx + 41) % 4 === 0 ? K[1] : K[2]); } }
    bcRow(p, cx - half0 - 2, cx + half0 + 1, ty - 2, R[2]); return; }
  if (side) { for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), w = Math.round(3 + t * 6) + sw, x0 = cx - d * 2;
      for (let i = 0; i < w; i++) { const x = x0 - d * i; if (rag(x, y)) continue; bcSet(p, x, y, i === w - 1 ? R[3] : i === 0 ? R[1] : i === w - 2 ? R[2] : K[2]); } } return; }
  for (let y = ty - 1; y <= bot; y++) { const t = (y - ty) / Math.max(1, bot - ty), hw = Math.round(half0 + 3 + t * 5);
    for (let x = cx - hw; x < cx + hw; x++) { if (rag(x, y)) continue; if (y >= A.legTop && Math.abs(x - cx + 0.5) < half0 + 1) continue;
      const edge = x <= cx - hw + 1 || x >= cx + hw - 2; bcSet(p, x, y, edge ? (x <= cx - hw || x >= cx + hw - 1 ? R[1] : R[3]) : R[(x + y) % 4 ? 2 : 1]); } }
  for (const sg of [-1, 1]) { const xx = Math.round(cx + sg * (half0 + 1)) - (sg > 0 ? 1 : 0); for (let k = 0; k < 3; k++) { bcSet(p, xx + sg * k, ty - 2 - k, R[3]); bcSet(p, xx + sg * k, ty - 1 - k, R[2]); } }
});
// ---- falda negra en capas con el bajo roto ----
fitKind('legs', 'bc_falda', (p, A) => { const { tx0, tw, cx, side, legTop, f } = A, R = tx0 + tw - 1, K = BC.blk, len = bcSkirtLen(A);
  for (let y = legTop; y <= legTop + len; y++) { const e = (y - legTop) / len * 2, x0 = Math.round((side ? cx - 4 : tx0 - 1) - e), x1 = Math.round((side ? cx + 3 : R + 1) + e);
    for (let x = x0; x <= x1; x++) { if (y === legTop + len && (x + (f | 0)) % 2) continue; bcSet(p, x, y, (y - legTop) % 3 === 2 ? K[0] : x === x0 ? K[3] : x === x1 ? K[1] : ((x - cx + 40) % 3 === 0 ? K[1] : K[2])); } }
});
// ---- botas altas de cordones (pintan la pierna que queda bajo la falda, sea cual sea la falda o pantalón) ----
fitKind('feet', 'bc_botas', (p, A, s) => { const { legTop, base, up } = A, B = BC.boot, top = Math.round(legTop + bcSkirtLen(A) + 1), cols = new Set([...(A.sk || []), ...s.m, ...BC.leg]);
  const pts = []; for (let y = top; y <= base + 1; y++) for (let x = 0; x < p.w; x++) if (cols.has(p.get(x, y))) pts.push([x, y]);
  const key = new Set(pts.map(q => q[0] + ',' + q[1])), has = (x, y) => key.has(x + ',' + y);
  for (const [x, y] of pts) { const l = has(x - 1, y), r = has(x + 1, y); bcSet(p, x, y, y === top ? B[4] : !l ? B[3] : !r ? B[1] : y >= base ? B[1] : B[2]);
    if (!l && y < base) bcSet(p, x - 1, y, B[0]); if (!r && y < base) bcSet(p, x + 1, y, B[0]); }
  if (!up) for (const [x, y] of pts) if (y > top && y < base - 1 && (y - top) % 2 === 1 && has(x - 1, y) && has(x + 1, y)) bcSet(p, x, y, B[4]);
});
const BC_COS = [
  ['c_bc_sombrero', L2('Sombrero Carmesí con Gafas', 'Crimson Hat with Goggles'), 'head', app => ({ k: 'bc_sombrero', m: BC.red, s: BC.band, cover: 'hat', hair: [...(HAIRS[app && app.hair] || HAIRS.negro), ...((app && HAIRS[app.hair2]) || [])] }), 8000],
  ['c_bc_top', L2('Top Doble de Hombro Caído', 'Off-Shoulder Double Top'), 'body', () => ({ k: 'bc_top', m: BC.blk, s: BC.gry }), 9500],
  ['c_bc_falda', L2('Falda de Capas Rasgada', 'Tattered Layered Skirt'), 'legs', () => ({ k: 'bc_falda', m: BC.leg, s: BC.blk }), 7000],
  ['c_bc_botas', L2('Botas Altas de Cordones', 'Laced Thigh-High Boots'), 'feet', () => ({ k: 'bc_botas', m: BC.boot }), 7000],
  ['c_bc_capa', L2('Capa Rasgada Carmesí', 'Tattered Crimson Cape'), 'back', () => ({ k: 'bc_capa', o: BC.blk, i: BC.red }), 9000],
];
for (const [id, n, slot, vis, price] of BC_COS) { cosm(id, n, slot, vis, { src: L2('Morwenna, modista gótica (Albor) · Bruja Carmesí', 'Morwenna, gothic seamstress (Albor) · Crimson Witch') }); it('cosi_' + id, { n, t: 'cos', cos: id, price, icon: ['hanger'], rar: 3 }); }
GOTH_COS.push(...BC_COS);
