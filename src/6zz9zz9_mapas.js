// ================= v5.07: MAPAS BONITOS EN TODOS LOS MUNDOS =================
// Antes, fuera de las Tierras del Vínculo y Japón, el mapa solo pintaba un píxel de color por casilla.
// Ahora cada mundo se dibuja a 4 px por casilla con relieve, agua con brillo, lava, vacío con estrellas y la
// miniatura REAL de cada objeto (árboles, casas, castillos, torres, lápidas, cristales, corales…), más el nombre de sus zonas.
const MAPP_K = 4;
const mapHash = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + (s | 0) * 2246822519) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function mapPretty(M, base) {
 const K = MAPP_K, W = M.w, H = M.h, c = mkCanvas(W * K, H * K), x = c.getContext('2d'), id = x.createImageData(W * K, H * K), d = new Uint32Array(id.data.buffer);
 const src = base.getContext('2d').getImageData(0, 0, W, H), S = new Uint32Array(src.data.buffer);
 const T_ = M.ter, L = M.lvl, water = t => t === T.WATER || t === T.DEEP || t === T.FALL, put = (px, py, col) => { d[py * W * K + px] = col; };
 for (let ty = 0; ty < H; ty++) for (let tx = 0; tx < W; tx++) {
  const i = ty * W + tx, t = T_[i]; let col = S[i];
  const nb = mapHash(tx >> 2, ty >> 2, 7) * 0.08 - 0.04; col = nb > 0 ? uMix(col, C('#ffffff'), nb) : uMul(col, 1 + nb);
  const below = ty + 1 < H ? i + W : i, higher = L && L[i] > 0 && L[below] < L[i];
  for (let py = 0; py < K; py++) for (let px = 0; px < K; px++) {
   const X = tx * K + px, Y = ty * K + py, r = mapHash(X, Y, 3); let p = col;
   if (t === T.VOID) p = r < 0.012 ? C('#f0e8ff') : r < 0.02 ? C('#8a7ab0') : uMix(col, C('#000000'), 0.15);
   else if (water(t)) { const wv = Math.sin((X + Y * 0.6) * 0.55 + tx * 0.3); if (wv > 0.93) p = uMix(col, C('#ffffff'), 0.35); else if (r < 0.03) p = uMix(col, C('#ffffff'), 0.2); const shore = (tx > 0 && !water(T_[i - 1])) || (ty > 0 && !water(T_[i - W])); if (shore && (px === 0 || py === 0)) p = uMix(col, C('#e8f4ff'), 0.45); }
   else if (t === T.LAVA) p = r < 0.25 ? C('#ffd040') : r < 0.55 ? C('#ff7a1a') : C('#c8300c');
   else if (t === T.FACE) p = uMul(col, py === K - 1 ? 0.55 : 0.72 + (px % 2) * 0.06);
   else { if (r < 0.06) p = uMul(col, 0.86); else if (r > 0.95) p = uMix(col, C('#ffffff'), 0.12); }
   if (higher && py === K - 1) p = uMul(p, 0.6);
   if (L && L[i] > 0 && py === 0 && ty > 0 && L[i - W] < L[i]) p = uMix(p, C('#ffffff'), 0.18);
   put(X, Y, p);
  }
 }
 x.putImageData(id, 0, 0);
 // objetos con su miniatura real, de arriba abajo (los de delante tapan a los de detrás)
 const s = K / 16, list = (M.objs || []).filter(o => o && !o.hidden && o.k !== 'bwall' && o.k !== 'floor').sort((a, b) => (a.py || a.ty * 16) - (b.py || b.ty * 16));
 x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'medium';
 for (const o of list) { let sp = null; try { sp = objSprite(o); } catch (e) { sp = null; } if (!sp || !sp.c || !sp.c.width) continue;
  const big = sp.c.width >= 44 || sp.c.height >= 56, f = big ? 2 : 1.35, ss = s * f, ox = (o.px != null ? o.px : o.tx * 16 + 8), oy = (o.py != null ? o.py : o.ty * 16 + 15), w = sp.c.width * ss, h = sp.c.height * ss;
  if (w < 0.6 || h < 0.6) continue; try { if (big) { x.fillStyle = 'rgba(0,0,0,0.28)'; x.beginPath(); x.ellipse(ox * s, oy * s, w * 0.4, h * 0.08 + 1, 0, 0, 7); x.fill(); } x.drawImage(sp.c, ox * s - (sp.ax || 0) * ss, oy * s - (sp.ay || 0) * ss, w, h); } catch (e) { } }
 return c;
}
{ const _mo = mapOverview; mapOverview = function (M) {
  if (!M || M.isWorld && M.id === 'world' || M.jp) return _mo.apply(this, arguments);
  const key = 'pretty:' + M.id; if (MAP_OV[key] && MAP_OV[key].w === M.w) return MAP_OV[key].c;
  const base = _mo.apply(this, arguments); let c = base; try { c = mapPretty(M, base); } catch (e) { console.warn(e); c = base; }
  MAP_OV[key] = { c, w: M.w }; return c; }; }
// el lienzo del mapa se pinta suave al reducir (antes píxel a píxel con un píxel por casilla)
// nombres de las zonas de cada mundo
const MAP_ZONES = () => ({
 velo_roto: typeof VR_ZONES !== 'undefined' ? VR_ZONES.map(z => [z.n, z.c[0], z.c[1]]) : [],
 sin_pintar: typeof TSP_ZONES !== 'undefined' ? TSP_ZONES.map(z => [z.n, z.c[0], z.c[1]]) : [],
 reino_celeste: typeof CEL_ZONES !== 'undefined' ? CEL_ZONES.map(z => [z.n, z.c[0], z.c[1]]) : [],
 archipielago: typeof ISLES !== 'undefined' ? ISLES.filter(z => z.c).map(z => [z.n, z.c[0], z.c[1]]) : [],
});
{ const _rm = renderMap; renderMap = function (B) { _rm.apply(this, arguments); const Wd = MAPW_LIST[MAPW]; if (!Wd) return; const Z = MAP_ZONES()[Wd.id]; const cvs = $('#wm'), M = G.maps[Wd.id]; if (!Z || !Z.length || !cvs || !M) return;
  const x = cvs.getContext('2d'), sc = cvs.width / M.w; x.textAlign = 'center'; x.font = `bold ${Math.round(8 + sc * 1.4)}px 'Pixelify Sans', monospace`;
  for (const [n, zx, zy] of Z) { const tx = zx * sc, ty = zy * sc; x.lineWidth = 3; x.strokeStyle = 'rgba(10,6,4,0.95)'; x.strokeText(n, tx, ty); x.fillStyle = '#ffd23a'; x.fillText(n, tx, ty); } }; }
