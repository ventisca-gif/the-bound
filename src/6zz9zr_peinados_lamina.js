// ================= v4.97: 8 PEINADOS DE LA LÁMINA DE SERGIO (píxel a píxel) =================
// El pelo y sus accesorios salen de su lámina (tools/art/ref/lamina_peinados.png) con tools/dev/lamina.py: cada
// peinado tiene sus 4 vistas (frente, izquierda, derecha, espalda) guardadas respecto al centro de la cabeza (LAM_DATA en
// 6zz9zs_lamina_data.js). El juego dibuja el cuerpo calvo y pone encima ese pelo, escalado a la cabeza de cada
// estructura (8 cuerpos) y movido con la cabeza en la caminata. Los colores son los de la lámina (el tinte no los
// cambia); los demás peinados siguen admitiendo tinte. Con casco o sombrero no se dibuja.
const LAM = [['lam_diadema', 'Rosa con diadema', 'Pink with headband'], ['lam_cuernos', 'Lila con cuernos', 'Lilac with horns'], ['lam_coletas', 'Coletas doradas', 'Golden twintails'], ['lam_menta', 'Puntas de menta', 'Mint spikes'],
  ['lam_capas', 'Negro en capas', 'Black layers'], ['lam_plata', 'Coletas de plata', 'Silver twintails'], ['lam_cinta', 'Bob con cinta', 'Bob with band'], ['lam_cobriza', 'Melena cobriza', 'Copper mane']];
for (const [k, es, en] of LAM) { const st = { n: L2(es, en), cap: 'bald', bang: 'none', side: 0, back: 0, lamKey: k }; HS_F.push(st); HS_M.push(Object.assign({}, st)); }
const LAM_PIX = {};
function lamLayer(k, dir) { const key = k + dir; if (LAM_PIX[key] !== undefined) return LAM_PIX[key]; const D = typeof LAM_DATA !== 'undefined' && LAM_DATA[k] && LAM_DATA[k][dir]; if (!D) return (LAM_PIX[key] = null);
  const s = atob(D.raw), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return (LAM_PIX[key] = Object.assign({ px: a }, D)); }
// la vista derecha es la suya propia (los accesorios no se reflejan)
{ const _hl = heroLook; heroLook = function () { const L = _hl.apply(this, arguments); if (L && L.hs && L.hs.lamKey) L.mirror = false; return L; }; }
{ const _dh = drawHero; drawHero = function (p, L, dir, anim, f) { const r = _dh.apply(this, arguments); try { const k = L && L.hs && L.hs.lamKey, M = p.meta; if (!k || !M || L.head || M.hrx === undefined) return r;
  const Ly = lamLayer(k, dir === 'right' || dir === 'left' || dir === 'up' ? dir : 'down'); if (!Ly) return r; const sx = M.hrx / Ly.hrx, sy = M.hry / Ly.hry, W = Ly.w, H = Ly.h;
  const x0 = M.hx + Ly.ox * sx, y0 = M.hy + Ly.oy * sy, X0 = Math.floor(x0), Y0 = Math.floor(y0), X1 = Math.ceil(M.hx + (Ly.ox + W) * sx), Y1 = Math.ceil(M.hy + (Ly.oy + H) * sy); if (p.t) p.tg = 6;
  for (let y = Math.max(0, Y0); y < Math.min(p.h, Y1); y++) for (let x = Math.max(0, X0); x < Math.min(p.w, X1); x++) { const qx = Math.floor((x + 0.5 - x0) / sx), qy = Math.floor((y + 0.5 - y0) / sy); if (qx < 0 || qy < 0 || qx >= W || qy >= H) continue;
    const i = (qy * W + qx) * 4; if (Ly.px[i + 3] < 128) continue; p.set(x, y, rgbU(Ly.px[i], Ly.px[i + 1], Ly.px[i + 2], 255)); } } catch (e) { } return r; }; }
