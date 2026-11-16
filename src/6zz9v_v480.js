// ================= v4.80: 19 PEINADOS ANIME DE CHICA + 1 DE CHICO (láminas de Sergio) Y NEVADAS MÁS CORTAS =================
// Usa el pincel de 6zz9u_pelo_anime.js (mechones con número, casquete, rizos) y añade piezas nuevas al contexto c:
//   c.hang  (coleta o mechón grueso colgando)   c.tie (goma)        c.braid (trenza por eslabones)
//   c.bun   (moño con espiral)                  c.blunt (flequillo recto)   c.eyelock (mechón que tapa un ojo, capa E)
//   c.bob   (melena corta hasta la barbilla)    c.curlRing (rizos cortos alrededor de la cabeza)
// Todo medido con la cabeza y el cuerpo de cada estructura (c.hx, c.hy, c.rx, c.ry, c.top, c.ey, c.tt, c.Y()).
function ahMore(c) {
  c.hang = (L, x0, y0, sx, yE, out, w, o) => { o = o || {}; const n = o.n || 1;
    for (let i = n - 1; i >= 0; i--) { const off = (i - (n - 1) / 2) * w * 0.55, wv = o.wave ? Math.sin(i * 2 + y0) * o.wave : 0;
      const pts = [[x0 + off * 0.3, y0], [x0 + sx * out * 0.55 + off * 0.6, y0 + (yE - y0) * 0.2], [x0 + sx * out + off + wv + c.sw * 0.3, (y0 + yE) / 2], [x0 + sx * out * (o.inward ? 0.6 : 0.9) + off * 0.8 - wv + c.sw * 0.6, yE - Math.abs(off) * 0.4]];
      if (o.curl) ahLock(L, pts.concat(ahCurlEnd(pts[3], i % 2 ? sx : -sx, o.curl, 1.3)), w, 1.4, { l: o.l }); else ahLock(L, pts, w, o.blunt ? w * 0.8 : 0.9, { l: o.l }); } };
  c.tie = (L, x, y) => ahLock(L, [[x - 1.3, y], [x + 1.3, y]], 2, 2, { l: 0.02, fade: 0 });
  c.braid = (L, x0, y0, xe, ye, w) => { const dx = xe - x0, dy = ye - y0, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, px = -uy, py = ux, seg = 2.5 * c.ky, n = Math.max(2, Math.floor(len / seg));
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, cx = x0 + dx * t + c.sw * 0.4 * t, cy = y0 + dy * t, sd = i % 2 ? 1 : -1, ww = w * (1 - t * 0.2);
      ahLock(L, [[cx - px * sd * ww * 0.4 - ux * seg * 0.6, cy - py * sd * ww * 0.4 - uy * seg * 0.6], [cx + px * sd * ww * 0.4 + ux * seg * 0.6, cy + py * sd * ww * 0.4 + uy * seg * 0.6]], ww * 0.8, ww * 0.6, { l: 0.52, fade: 0 }); }
    const ex = xe + c.sw * 0.4; c.tie(L, ex, ye + 0.5); ahLock(L, [[ex, ye + 1], [ex + c.sw * 0.2, ye + 3.5]], w * 0.75, 0.9); };
  c.bun = (L, x, y, r, o) => { o = o || {}; ahCap(L, x, y, r, r * 0.9, { ring: false, grooves: 5, bumps: 6, ba: 0.1 }); ahLock(L, ahSpiral(x + 0.3, y + 0.2, r * 0.6, Math.PI * 0.2, Math.PI * 1.3, 0.4), 1, 1, { l: 0.22, fade: 0 });
    if (o.messy) { ahLock(L, ahHook(x + r * 0.7, y - r * 0.7, 1, 1.2), 1.8, 0.8); ahLock(L, ahHook(x - r * 0.8, y - r * 0.3, -1, 1.1), 1.8, 0.8); } };
  c.blunt = (o) => { o = o || {}; if (c.up) return; const F = c.F, t0 = c.top + 2.2, yb = c.ey - 1.2 + (o.drop || 0);
    if (c.side) { for (let i = 0; i < 2; i++) ahLock(F, [[c.hx + c.k * (1 - i), t0 - 0.5], [c.hx + c.d * (c.rx * 0.6), t0 + 1.2 + i], [c.hx + c.d * (c.rx + 0.4 - i * 1.6), yb]], 3.4, 3); return; }
    const n = o.n || 7; for (let i = 0; i < n; i++) { const t = i / (n - 1) * 2 - 1, xe = c.hx + t * (c.rx - 0.6), x0 = c.hx + t * (c.rx - 2) * 0.6; ahLock(F, [[x0, t0 - 0.5], [(x0 + xe) / 2, (t0 + yb) / 2], [xe, yb + (o.arc ? Math.abs(t) * 1.2 : 0)]], 3, 2.6, { l: 0.46 }); } };
  c.eyelock = (s) => { if (c.up) return; const E = c.E; s = s || 1;
    if (c.side) { ahLock(E, [[c.hx + c.k * 0.5, c.top + 2], [c.hx + c.d * (c.rx * 0.5), c.ey - 1], [c.hx + c.d * (c.rx - 2), c.ey + 3]], 3.6, 1.2, { l: 0.46 }); return; }
    ahLock(E, [[c.hx - s * 1.5, c.top + 2], [c.hx + s * 1.6, c.hy - 1.5], [c.hx + s * 3.6, c.ey + 1.5], [c.hx + s * 4, c.ey + 3.5]], 4.4, 1.2, { l: 0.46 }); };
  c.bob = (yB, o) => { o = o || {}; const F = c.F, ext = (o.ext || 0) * c.kx, wv = o.wave || 0;
    const endf = (pts, s, w) => { if (o.curl) ahLock(F, pts.concat(ahCurlEnd(pts[pts.length - 1], o.flip ? s : -s, o.curl, 1.1)), w, 1.6); else ahLock(F, pts, w, o.jag ? 0.8 : w * 0.75); };
    if (c.up) { const m = 7; for (let j = 0; j < m; j++) { const t = j / (m - 1) * 2 - 1; endf([[c.hx + t * (c.rx - 2), c.hy - 3], [c.hx + t * (c.rx + 0.5 + ext) + Math.sin(j * 2) * wv, (c.hy + yB) / 2], [c.hx + t * (c.rx + 0.8 + ext) + c.sw * 0.3, yB - Math.abs(t) * (o.front ? -1.5 : 0.5) - (o.jag ? j % 2 : 0)]], t < 0 ? -1 : 1, 4.4); } return; }
    ahLock(c.B, [[c.hx, c.hy], [c.hx, yB - 1]], c.rx * 2, c.rx * 2 - 1);   // relleno detrás del cuello
    if (c.side) { for (let j = 2; j >= 0; j--) endf([[c.hx + c.k * (j * 2 - 1), c.top + 1], [c.hx + c.k * (c.rx * 0.6 + j * 1.6 + ext) + Math.sin(j * 2) * wv, (c.hy + yB) / 2 - 1], [c.hx + c.k * (c.rx * 0.5 + j * 1.8 + ext) + c.sw * 0.3, yB - j * (o.front ? 1.6 : 0.5) - (o.jag ? j % 2 : 0)]], c.k, 4.4);
      endf([[c.hx + c.k * 2.4, c.hy - 3], [c.hx + c.k * 2.6 + wv * 0.5, (c.hy + yB) / 2], [c.hx + c.k * 2 + c.d * (o.front ? 1 : 0), yB + (o.front ? 1.5 : 0)]], c.d, 3.2); return; }
    for (const s of [-1, 1]) { endf([[c.hx + s * (c.rx - 0.5), c.top + 1.5], [c.hx + s * (c.rx + 2 + ext) + wv * 0.6, c.hy + 2], [c.hx + s * (c.rx + 1.6 + ext) + c.sw * 0.3, yB - 1 - (o.jag ? 1 : 0)]], s, 4);
      endf([[c.hx + s * (c.rx - 2.6), c.top + 2.5], [c.hx + s * (c.rx + 0.6 + ext) - wv * 0.6, c.hy + 2], [c.hx + s * (c.rx + 0.2 + ext) - s * (o.front ? 0.6 : 0) + c.sw * 0.3, yB + (o.front ? 2.5 : 0)]], s, 4.2); } };
  c.curlRing = (yB) => { const L = c.F, ex = c.rx + 1.6, ey2 = c.ry + 1.2, cy = c.hy - 1.5;
    if (c.side) { for (let i = 0; i < 7; i++) { const a = -2.5 + i / 6 * 3.4, x = c.hx + c.k * Math.cos(a) * ex * -1 * -1, y = cy + Math.sin(a) * ey2; ahLock(L, ahHook(c.hx - Math.cos(a) * ex * c.d, y, Math.cos(a) * -c.d >= 0 ? 1 : -1, 1.4), 2.2, 1); }
      for (let y = c.hy + 2; y <= yB; y += 3) ahLock(L, ahHook(c.hx + c.k * (c.rx + 1), y, c.k, 1.3), 2.2, 1); return; }
    for (let i = 0; i < 8; i++) { const a = Math.PI * (1.08 + i / 7 * 0.84), x = c.hx + Math.cos(a) * ex, y = cy + Math.sin(a) * ey2; ahLock(L, ahHook(x, y, Math.cos(a) < 0 ? -1 : 1, 1.4), 2.2, 1); }
    for (const s of [-1, 1]) for (let y = c.hy, i = 0; y <= yB; y += 3, i++) ahLock(L, ahHook(c.hx + s * (c.rx + 1.2 + (i % 2) * 0.6), y, s, 1.3), 2.2, 1);
    if (c.up) for (let i = -1; i <= 1; i++) ahLock(L, ahHook(c.hx + i * 3.5, yB - 1, i < 0 ? -1 : 1, 1.3), 2.2, 1); };
}
{ const _ac = ahCtx; ahCtx = function () { const c = _ac.apply(this, arguments); ahMore(c); return c; }; }

// lado de una pieza doble (coletas, moños): de frente y de espaldas las dos; de perfil solo la de la nuca
const ahPair = (c, fn) => { if (c.side) fn(c.k, true); else for (const s of [-1, 1]) fn(s, false); };

// ---------- chica: primera lámina (11) ----------
AH.lisa_raya = c => { c.mane(c.Y(0.55), 3, 4, { w: 4.4, wav: 0.3 }); c.cap(1, { ba: 0.03 }); c.sidelocks(c.Y(0.3), 3.4, { out: 0.5 }); c.fringe('swept', 5, { dir: 1 }); };
AH.coleta_anime = c => { const L = c.up || c.side ? c.F : c.B, ax = c.side ? c.hx + c.k * (c.rx * 0.6) : c.up ? c.hx : c.hx + c.rx * 0.55, ay = c.top + 1, sx = c.side ? c.k : 1;
  c.hang(c.up ? c.F : c.B, ax, ay + 1, sx, c.Y(0.42), c.side ? 6 : c.up ? 1.5 : 6.5, 4.2, { n: 2, wave: 0.9 });
  c.nape(c.hy + 2, 3, {}); c.cap(1.3, {}); ahCap(L, ax + sx * 0.5, ay - 0.6, 3.4, 2.7, { ring: false, grooves: 5, bumps: 6, ba: 0.12 }); c.tie(L, ax + sx * 1.2, ay + 1.4);
  c.sidelocks(c.hy + c.ry + 1, 2.4, {}); c.fringe('swept', 4, { dir: -1 }); };
AH.lisa_ojo = c => { c.mane(c.Y(0.6), 3, 4, { w: 4.4 }); c.cap(1, { ba: 0.03 }); c.sidelocks(c.tt + 5, 3, {}); c.fringe('point', 4); c.eyelock(1); };
AH.rizos_flequillo = c => { c.mane(c.Y(0.6), 6, 4, { curl: 1.8, wav: 1.2, wild: 1 }); c.cap(1.6, { bumps: 9, ba: 0.08 }); c.sidelocks(c.tt + 5, 3, { curl: 1.4, out: 1 }); c.blunt({ n: 7 }); };
AH.ondas_lado = c => { c.mane(c.Y(0.58), 5, 4, { wav: 1.6, curl: 1.3, w: 4.4 }); c.cap(1.3, {}); c.sidelocks(c.Y(0.32), 3.2, { out: 1.2, curl: 1.2 }); c.fringe('swept', 5, { dir: -1 }); };
AH.dos_trenzas = c => { c.nape(c.hy + c.ry, 4, {}); c.cap(1, { ba: 0.03 });
  if (c.up) for (const s of [-1, 1]) c.braid(c.F, c.hx + s * (c.rx - 1.5), c.hy - 1, c.hx + s * (c.rx + 0.5), c.tt + 3, 3.6);
  else if (c.side) c.braid(c.F, c.hx + c.k * 1.6, c.hy + 2, c.hx + c.d * 0.5, c.Y(0.36), 3.6);
  else for (const s of [-1, 1]) c.braid(c.F, c.hx + s * (c.rx - 0.8), c.hy + 2, c.hx + s * (c.rx - 2), c.Y(0.36), 3.6);
  c.fringe('point', 5); };
AH.coletas_bajas = c => { c.bob(c.hy + c.ry, {}); c.cap(1, { ba: 0.03 }); ahPair(c, (s, side) => { const x0 = side ? c.hx + c.k * 2.5 : c.hx + s * (c.rx + 1), y0 = c.hy + 3; c.hang(c.F, x0, y0, s, c.tt + 6, side ? 2.5 : 3.6, 3.8, { n: 1, curl: 1.1 }); c.tie(c.F, x0 + s * 0.6, y0 + 0.5); }); c.fringe('point', 5); };
AH.mono_suelto = c => { c.nape(c.hy + 2, 3, {}); if (!c.up && !c.side) c.bun(c.B, c.hx + 2, c.top - 1.5, 3.6, { messy: 1 }); c.cap(1.2, {});
  if (c.side) c.bun(c.F, c.hx + c.k * (c.rx * 0.6), c.top + 0.2, 3.6, { messy: 1 }); else if (c.up) c.bun(c.F, c.hx + 1, c.top + 2, 3.6, { messy: 1 });
  c.sidelocks(c.tt + 3, 2, { out: 0.6 }); c.fringe('swept', 4, { dir: 1 }); };
AH.media_coleta = c => { c.mane(c.Y(0.55), 3, 4, { w: 4.4 }); c.cap(1, { ba: 0.03 });
  if (c.up) { c.hang(c.F, c.hx, c.hy - 3, 1, c.hy + 8, 0.6, 3.4, {}); c.bun(c.F, c.hx, c.hy - 4, 2.5, {}); c.tie(c.F, c.hx, c.hy - 1.8); } else if (c.side) c.bun(c.F, c.hx + c.k * (c.rx + 0.5), c.hy - 3.5, 2.4, {});
  c.sidelocks(c.Y(0.28), 3, {}); c.fringe('curtain', 6); };
AH.bob_capas = c => { c.bob(c.hy + c.ry + 1, { jag: 1, ext: 0.5 }); c.cap(1.4, { bumps: 9, ba: 0.07 }); c.fringe('messy', 6); };
AH.bob_recto = c => { c.bob(c.hy + c.ry, {}); c.cap(1, { ba: 0.03 }); c.blunt({ n: 7 }); };
// ---------- chica: segunda lámina (8; el corto con flequillo liso es el bob recto) ----------
AH.corto_rizado = c => { c.nape(c.hy + c.ry, 4, { curl: 1.2 }); c.cap(2.2, { bumps: 10, ba: 0.1 }); c.curlRing(c.hy + c.ry - 1); c.fringe('curl', 4); };
AH.corto_liso = c => { c.nape(c.hy + c.ry - 1, 4, {}); c.cap(0.9, { ba: 0.03 }); c.sidelocks(c.hy + c.ry - 1, 2.6, {}); c.fringe('swept', 4, { dir: 1, drop: 0.5 }); };
AH.cuadrado = c => { c.bob(c.hy + c.ry + 1, { front: 1 }); c.cap(1, { ba: 0.03 }); c.fringe('point', 5); };
AH.liso_largo = c => { c.mane(c.Y(0.62), 3, 4, { w: 4.4 }); c.cap(1, { ba: 0.03 }); c.sidelocks(c.Y(0.26), 3, {}); c.blunt({}); };
AH.cebollas = c => { c.nape(c.hy + c.ry - 1, 4, {}); c.cap(1, { ba: 0.03 }); ahPair(c, (s, side) => c.bun(c.F, side ? c.hx + c.k * 1.5 : c.hx + s * (c.rx - 1.2), c.top + 0.4, 3.3, {})); c.sidelocks(c.hy + c.ry + 1, 2.4, {}); c.blunt({}); };
AH.cuadrado_ondulado = c => { c.bob(c.hy + c.ry + 2, { wave: 1.2, curl: 1.2, flip: 1 }); c.cap(1.3, { bumps: 8 }); c.fringe('swept', 5, { dir: -1 }); };
AH.coletas_largas = c => { const L = c.up ? c.F : c.B; c.nape(c.hy + c.ry - 1, 3, {}); ahPair(c, (s, side) => { const x0 = side ? c.hx + c.k * (c.rx * 0.4) : c.hx + s * (c.rx - 0.5), y0 = c.top + 2.5; c.hang(L, x0, y0, s, c.Y(0.5), side ? 4 : 4.5, 4.4, { n: 2, wave: 0.6 }); });
  c.cap(1.1, {}); if (!c.side) ahPair(c, s => c.tie(c.up ? c.F : c.F, c.hx + s * (c.rx - 0.2), c.top + 2.5)); else c.tie(c.F, c.hx + c.k * (c.rx * 0.4 + 0.5), c.top + 2.5); c.sidelocks(c.hy + c.ry + 1, 2.4, {}); c.fringe('curtain', 6); };
AH.ondas_anime = c => { c.mane(c.Y(0.6), 6, 5, { wav: 1.8, curl: 1.5, w: 4.2 }); c.cap(1.6, { bumps: 8 }); c.sidelocks(c.Y(0.3), 3, { curl: 1.3, out: 1 }); c.fringe('point', 5); };
// ---------- chico: tercera lámina (despeinado en capas con puntas) ----------
AH.despeinado = c => { c.nape(c.hy + c.ry + 1, 4, { jag: 1, out: 1.5, w: 3 }); c.cap(1.8, { bumps: 9, ba: 0.08 });
  c.spikes([[122, 3.5, 3.4], [-120, 3.5, 3.4], [96, 4.5, 4], [-94, 4.5, 4], [64, 5, 4.4], [-62, 5.5, 4.4], [-30, 4.5, 4.6], [26, 4, 4.4]], { bend: 0.55 });
  c.sidelocks(c.hy + c.ry + 1, 2.4, { out: 1.2 }); c.fringe('point', 5, { drop: 1 });
  if (!c.up && !c.side) ahLock(c.E, [[c.hx - 0.5, c.top + 3], [c.hx + 0.2, c.ey], [c.hx + 0.5, c.ey + 2.5]], 2.6, 0.7, { l: 0.46 }); };

HS_F.push(
  { n: L2('Lisa con raya', 'Straight side part'), cap: 'round', bang: 'side', side: 10, back: 17, ah: 'lisa_raya' },
  { n: L2('Coleta anime', 'Anime ponytail'), cap: 'round', bang: 'side', side: 4, back: 0, tail: 'high', ah: 'coleta_anime' },
  { n: L2('Lisa tapando un ojo', 'Straight over one eye'), cap: 'round', bang: 'long', side: 9, back: 18, ah: 'lisa_ojo' },
  { n: L2('Rizos con flequillo', 'Curls with bangs'), cap: 'volume', bang: 'full', side: 12, back: 18, bw: 1.3, curl: 2, ah: 'rizos_flequillo' },
  { n: L2('Ondas de lado', 'Side waves'), cap: 'round', bang: 'side', side: 12, back: 18, bw: 1.2, wave: 1, ah: 'ondas_lado' },
  { n: L2('Dos trenzas', 'Two braids'), cap: 'round', bang: 'full', side: 3, back: 2, tail: 'twin', ah: 'dos_trenzas' },
  { n: L2('Coletitas bajas', 'Low pigtails'), cap: 'round', bang: 'full', side: 5, back: 5, tail: 'low', ah: 'coletas_bajas' },
  { n: L2('Moño despeinado', 'Messy bun'), cap: 'round', bang: 'side', side: 3, back: 0, tail: 'bun', ah: 'mono_suelto' },
  { n: L2('Media coleta', 'Half-up'), cap: 'round', bang: 'curtain', side: 10, back: 17, ah: 'media_coleta' },
  { n: L2('Bob en capas', 'Layered bob'), cap: 'volume', bang: 'messy', side: 6, back: 6, bw: 1.15, jag: 1, layer: 1, ah: 'bob_capas' },
  { n: L2('Bob con flequillo recto', 'Blunt bob'), cap: 'round', bang: 'full', side: 5, back: 5, bw: 1.12, ah: 'bob_recto' },
  { n: L2('Corto rizado', 'Short curly'), cap: 'volume', bang: 'messy', side: 5, back: 4, bw: 1.35, curl: 2, ah: 'corto_rizado' },
  { n: L2('Corto liso', 'Short straight'), cap: 'flat', bang: 'side', side: 2, back: 3, ah: 'corto_liso' },
  { n: L2('Cuadrado largo delante', 'Angled bob'), cap: 'round', bang: 'full', side: 7, back: 5, ah: 'cuadrado' },
  { n: L2('Lisa larga con flequillo', 'Long straight with bangs'), cap: 'round', bang: 'full', side: 10, back: 20, ah: 'liso_largo' },
  { n: L2('Cebollas', 'Space buns'), cap: 'round', bang: 'full', side: 4, back: 0, tail: 'buns', ah: 'cebollas' },
  { n: L2('Cuadrado ondulado', 'Wavy bob'), cap: 'round', bang: 'side', side: 6, back: 6, bw: 1.16, wave: 1, ah: 'cuadrado_ondulado' },
  { n: L2('Coletas largas', 'Long twintails'), cap: 'round', bang: 'curtain', side: 3, back: 0, tail: 'twin', ah: 'coletas_largas' },
  { n: L2('Ondas largas anime', 'Long anime waves'), cap: 'round', bang: 'full', side: 12, back: 19, bw: 1.22, wave: 1, ah: 'ondas_anime' });
HS_M.push({ n: L2('Despeinado anime', 'Messy anime'), cap: 'spiky', bang: 'messy', side: 3, back: 4, jag: 1, ah: 'despeinado' });

// ---------- nevadas más cortas: cada nevada dura de 30 a 75 s (antes de 90 a 330 s) ----------
// En el último mes del año (nieve de Navidad) ya no nieva sin parar: nieva 1 minuto de cada 3.
const SNOW_MAX = 75;
{ const _wt = weatherTick; weatherTick = function (dt) { const r = _wt.apply(this, arguments); try { const W = G.P && G.P.wstate; if (W && W.wx === 'snow' && W.wxT > SNOW_MAX) W.wxT = 30 + Math.random() * (SNOW_MAX - 30); } catch (e) { } return r; }; }
{ const _cw = curWx; curWx = function () { const w = _cw.apply(this, arguments); try { if (w === 'snow' && xmasSnow() && G.P.wstate.wx !== 'snow' && Math.floor((G.t || 0) / 60) % 3) return regionWx(G.P.wstate.wx) || 'clear'; } catch (e) { } return w; }; }   // el suelo sigue nevado
