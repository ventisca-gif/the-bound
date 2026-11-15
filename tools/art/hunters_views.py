# A partir de hn_front.png (15 cazadores de frente) crea: frente, espalda, perfil y máscara de pelo,
# más variantes de mujer (cabeza de pelo largo sobre otros cuerpos). Salida: hoja CW x CH por celda, 4 filas.
import sys, numpy as np
from PIL import Image
from scipy import ndimage
src, out = sys.argv[1], sys.argv[2]
S = np.array(Image.open(src)).astype(float)
CELL = 96; N = S.shape[1] // CELL
def lum(c): return c[..., 0] * .3 + c[..., 1] * .59 + c[..., 2] * .11
def clean(c):
    al = c[..., 3] > 0
    # halo claro del fondo en el borde
    for _ in range(2):
        er = ndimage.binary_erosion(al)
        edge = al & ~er
        r, g, b = c[..., 0], c[..., 1], c[..., 2]
        halo = edge & (lum(c) > 175) & (np.abs(r - b) < 22) & (np.abs(g - b) < 22)
        al = al & ~halo
    c[..., 3] = al * 255
    return c
def bounds(al):
    ys = np.where(al.any(1))[0]; return ys[0], ys[-1]
def neck_of(c, long_hair):
    al = c[..., 3] > 0; top, bot = bounds(al)
    if long_hair: return top + 26
    w = [np.ptp(np.nonzero(al[y])[0]) if al[y].any() else 99 for y in range(96)]
    rng = list(range(top + 21, top + 32))
    return min(rng, key=lambda y: (w[y], -y))
def hair_mask(c, neck, long_hair):
    al = c[..., 3] > 0; top, _ = bounds(al)
    rgb = c[..., :3]
    samp = rgb[top + 1:top + 7][al[top + 1:top + 7]]
    samp = samp[lum(samp) > 45]
    if len(samp) == 0: return np.zeros(al.shape, bool)
    d = np.min(np.linalg.norm(rgb[:, :, None, :] - samp[None, None, ::max(1, len(samp) // 60), :], axis=3), axis=2)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    skin = (r > g) & (g > b) & ((r - b) > 28) & ((r - b) < 130)
    hairish = (d < 34) & al
    hairc = np.median(samp, 0); hskin = hairc[0] > hairc[1] > hairc[2] and hairc[0] - hairc[2] > 28
    if not hskin: hairish &= ~skin
    m = np.zeros(al.shape, bool); m[:neck] = hairish[:neck]
    if long_hair:
        cx = np.nonzero(al[top:neck].any(0))[0].mean()
        xs = np.arange(96)[None, :]
        side = np.abs(xs - cx) >= 6
        m[neck:neck + 22] |= (hairish & side)[neck:neck + 22]
    m = ndimage.binary_opening(m)
    lab, n = ndimage.label(m)
    for k in range(1, n + 1):
        if (lab == k).sum() < 18: m[lab == k] = False
    return m
def back_view(c, neck, hm, long_hair):
    o = c.copy(); al = c[..., 3] > 0; top, bot = bounds(al)
    inner = ndimage.binary_erosion(al)
    rgb = o[..., :3]
    hp = rgb[hm]; base_c = np.median(hp, 0) if len(hp) else np.array([60, 60, 70.])
    hl = rgb[hm & (lum(rgb) > lum(base_c[None])[0])]; hi_c = np.median(hl, 0) if len(hl) else base_c * 1.15
    lo_c = base_c * 0.74; ol = base_c * 0.35
    # torso: el frente volteado, quitando solo los brillos sueltos (gemas, hebillas)
    inner2 = ndimage.binary_erosion(al, iterations=2)
    med = np.dstack([ndimage.median_filter(c[..., ch], size=5) for ch in range(3)])
    det = (np.linalg.norm(c[..., :3] - med, axis=2) > 55) & inner2
    det[:neck] = False
    rgb[det] = med[det]
    # cabeza de espaldas
    for y in range(top, neck):
        for x in range(96):
            if not al[y, x] or not inner[y, x]: continue
            t = (y - top) / max(1, neck - top)
            col = hi_c * (1 - t) + lo_c * t if t < 1 else lo_c
            col = col * (0.88 if (x + (y // 6)) % 4 == 0 and t > 0.2 else 1.0)
            rgb[y, x] = col
    if long_hair:
        hx = np.nonzero(al[neck - 3])[0]
        x0, x1 = hx[0] + 2, hx[-1] - 2
        L = 16
        for k in range(L):
            y = neck + k; sh = k // 4
            a0, a1 = x0 + sh, x1 - sh
            for x in range(a0, a1 + 1):
                if k >= L - 3 and (x - a0) % 3 != 1 and k > L - 3 + ((x - a0) % 3 == 0): continue   # puntas
                edge = x == a0 or x == a1 or k == L - 1
                t = k / L
                col = ol if edge else (hi_c * (1 - t) * 0.4 + base_c * (0.6 + t * 0.4) * (1 - t * 0.3))
                if not edge and (x - a0) % 3 == 0: col = col * 0.82
                rgb[y, x] = col; o[y, x, 3] = 255
    o[..., :3] = rgb
    return o[:, ::-1].copy()
def side_view(c):
    al = c[..., 3] > 0; ys = np.where(al.any(0))[0]
    x0, x1 = ys[0], ys[-1] + 1; crop = c[:, x0:x1]
    w = x1 - x0; nw = max(4, round(w * 0.74))
    pre = crop.copy(); a = pre[..., 3:4] / 255; pre[..., :3] *= a
    im = Image.fromarray(np.clip(pre, 0, 255).astype(np.uint8), 'RGBA').resize((nw, 96), Image.BOX)
    q = np.array(im).astype(float); a = q[..., 3:4] / 255
    q[..., :3] = np.where(a > 0.01, q[..., :3] / np.maximum(a, 1e-3), 0); q[..., 3] = (q[..., 3] > 110) * 255
    o = np.zeros_like(c); ox = (96 - nw) // 2; o[:, ox:ox + nw] = q
    return o
base = [clean(S[:, i * CELL:(i + 1) * CELL].copy()) for i in range(N)]
LONG = {1, 3}
info = []
for i, c in enumerate(base):
    n = neck_of(c, i in LONG) if i != 13 else bounds(c[..., 3] > 0)[0] + 28; info.append((n, hair_mask(c, n, i in LONG)))
# variantes de mujer: cabezas 1 y 3 sobre cuerpos de hombre
FEM_BODIES = [0, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14]
allc = list(zip(base, info)); fem = [1, 3]
meta = [('m' if i not in LONG else 'f', i) for i in range(N)]
for hi, h in enumerate(fem):
    for bi in FEM_BODIES:
        if (bi + hi) % 2: continue      # la mitad de combinaciones por cabeza: 11 variantes
        b, (bn, _) = allc[bi]; hc, (hn, hhm) = allc[h]
        o = b.copy(); o[:bn] = 0
        alh = hc[..., 3] > 0; top, _ = bounds(alh)
        hx = np.nonzero(alh[top:hn].any(0))[0].mean()
        bx = np.nonzero((b[bn:bn + 4, :, 3] > 0).any(0))[0].mean()
        dx, dy = int(round(bx - hx)), bn - hn
        layer = np.zeros(hc.shape[:2], bool); layer[:hn] = alh[:hn]; layer |= hhm
        ys, xs = np.nonzero(layer)
        ys2, xs2 = ys + dy, xs + dx; ok = (ys2 >= 0) & (ys2 < 96) & (xs2 >= 0) & (xs2 < 96)
        o[ys2[ok], xs2[ok]] = hc[ys[ok], xs[ok]]
        hm = np.zeros((96, 96), bool); hm[ys2[ok], xs2[ok]] = hhm[ys[ok], xs[ok]]
        allc.append((o, (bn, hm))); meta.append(('f', bi))
cnt = len(allc)
CW, Y0, CH = 72, 14, 76
sheet = np.zeros((CH * 4, CW * cnt, 4), np.uint8)
for k, (c, (n, hm)) in enumerate(allc):
    views = [c, back_view(c, n, hm, meta[k][0] == 'f'), side_view(c)]
    m = np.zeros_like(c); m[..., :3] = 255; m[..., 3] = hm * 255
    views.append(m)
    for r, v in enumerate(views):
        sheet[r * CH:(r + 1) * CH, k * CW:(k + 1) * CW] = np.clip(v[Y0:Y0 + CH, 12:12 + CW], 0, 255).astype(np.uint8)
Image.fromarray(sheet, 'RGBA').save(out, optimize=True)
print(cnt, ''.join(g for g, _ in meta), [b for _, b in meta])
