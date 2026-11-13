"""Armas de tier 1-6 de todas las clases (v4.13) a partir de la hoja de cobre de Sergio.

Uso:  python3 tools/dev/armas.py            -> escribe src/6zyd_armas_data.js
      python3 tools/dev/armas.py --preview  -> además deja vistas previas en /tmp/armas_prev

Entrada: tools/dev/armas_ref/nat_w_<clase>.png (arma) y nat_fx_<clase>.png (efecto), recortados de su imagen
a la resolución real de sus píxeles (unos 6 px de la imagen = 1 píxel). Cobre es el original; los demás tiers
cambian los colores del metal (la madera de los mangos, las runas, el agua y el rosa del asesino se quedan).

Salida por tier t y clase:
  ARM_ICON['<clase>_<t>']   icono 16x16 del inventario (RGBA en base64)
  ARM_HAND['<clase>_<t>']   arma en la mano a 16 px (RGBA base64) con su punto de agarre ARM_PIV16[clase]
  ARM_HD['<clase>_<t>']     la misma a 32 px (PNG) para los fotogramas HD, agarre ARM_PIV32[clase]
  ARM_ATLAS[t]              atlas de ataque al doble (HD): filas = clases, columnas = prep, a1, a2, a3, impacto
"""
import base64, colorsys, io, json, math, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
REF = os.path.join(os.path.dirname(__file__), 'armas_ref')
CLS = ["guerrero", "mago", "arquero", "asesino", "bardo", "invocador", "pez"]
CW, CH, S = 80, 48, 2   # celda del atlas en unidades del juego; el atlas va al doble
RAMPS = {   # metal de cada tier, de oscuro a claro (el cobre es el original)
    1: ['#3a2414', '#5e3a1e', '#8a5a30', '#b4834e', '#dcb27a'],
    3: ['#1e2024', '#3a3e44', '#5c626a', '#868c94', '#b4b8be'],
    4: ['#1e2a38', '#3a5068', '#6688a6', '#a2c0d8', '#e6f2fc'],
    5: ['#363a46', '#666c7c', '#a2a8b6', '#d6dae4', '#ffffff'],
    6: ['#4e3006', '#8e600e', '#cc9a1e', '#f2cc4c', '#fff6c0'],
}


def load(n):
    return np.array(Image.open(os.path.join(REF, n)).convert('RGBA'))


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)


def lum(c):
    return c[..., 0] * 0.3 + c[..., 1] * 0.59 + c[..., 2] * 0.11


def is_copper(c):
    h, s, v = colorsys.rgb_to_hsv(*(c / 255))
    h *= 360
    return (h < 48 or h > 350) and s > 0.22 and v > 0.16


def is_wood(c):   # mango de madera: marrón oscuro y poco saturado
    h, s, v = colorsys.rgb_to_hsv(*(c / 255))
    return v < 0.42 and s < 0.72


def recolor(a, t, keep_wood=True):
    if t == 2:
        return a.copy()
    R = [hexc(h) for h in RAMPS[t]]
    o = a.copy().astype(float)
    m = np.zeros(a.shape[:2], bool)
    for y in range(a.shape[0]):
        for x in range(a.shape[1]):
            if a[y, x, 3] < 40:
                continue
            c = a[y, x, :3].astype(float)
            if is_copper(c) and not (keep_wood and t != 1 and is_wood(c)):
                m[y, x] = True
    if not m.any():
        return a.copy()
    L = lum(o[..., :3])
    lo, hi = np.percentile(L[m], 3), np.percentile(L[m], 99)
    for y, x in zip(*np.where(m)):
        k = np.clip((L[y, x] - lo) / max(1, hi - lo), 0, 1) * 4
        i = min(3, int(k))
        o[y, x, :3] = R[i] * (1 - (k - i)) + R[i + 1] * (k - i)
    return o.astype(np.uint8)


def crop_alpha(a):
    ys, xs = np.where(a[..., 3] > 0)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1], (xs.min(), ys.min())


def down(n, r):
    """Reduce un sprite de píxeles por el factor r (<=1) con media por área y el color propio más cercano."""
    h, w = n.shape[:2]
    W, H = max(1, round(w * r)), max(1, round(h * r))
    src = n.astype(float)
    out = np.zeros((H, W, 4), np.uint8)
    for i in range(H):
        for j in range(W):
            ya, yb, xa, xb = i / r, (i + 1) / r, j / r, (j + 1) / r
            ys = np.arange(int(ya), min(h, int(math.ceil(yb))))
            xs = np.arange(int(xa), min(w, int(math.ceil(xb))))
            wy = np.array([min(yb, y + 1) - max(ya, y) for y in ys])
            wx = np.array([min(xb, x + 1) - max(xa, x) for x in xs])
            wgt = np.outer(wy, wx)
            blk = src[np.ix_(ys, xs)]
            al = blk[..., 3] / 255
            cov = (wgt * al).sum() / wgt.sum()
            if cov < 0.42:
                continue
            col = (blk[..., :3] * (wgt * al)[..., None]).sum((0, 1)) / (wgt * al).sum()
            cand = blk[..., :3][al > 0.5]
            if len(cand):
                col = cand[np.argmin(((cand - col) ** 2).sum(1))]
            out[i, j, :3] = col
            out[i, j, 3] = 255
    return out


def transform(a, piv, crop=None, flipx=False, rot=0):
    """Recorta/espeja/gira el sprite nativo y devuelve (sprite, agarre) siguiendo el punto de agarre."""
    if crop:
        x0, y0, x1, y1 = crop
        a = a[y0:y1, x0:x1].copy()
        piv = (piv[0] - x0, piv[1] - y0)
        from scipy import ndimage   # solo la pieza que se agarra (sin trozos de la otra daga o aleta)
        lab, _ = ndimage.label(a[..., 3] > 0, structure=np.ones((3, 3)))
        ys, xs = np.where(lab > 0)
        k = lab[ys, xs][np.argmin((xs - piv[0]) ** 2 + (ys - piv[1]) ** 2)]
        a[lab != k] = 0
    mk = np.zeros(a.shape[:2], np.uint8)
    mk[int(piv[1]), int(piv[0])] = 255
    im, mim = Image.fromarray(a), Image.fromarray(mk)
    if flipx:
        im, mim = im.transpose(Image.FLIP_LEFT_RIGHT), mim.transpose(Image.FLIP_LEFT_RIGHT)
    if rot:
        U = 4
        im = im.resize((im.width * U, im.height * U), Image.NEAREST).rotate(rot, resample=Image.NEAREST, expand=True)
        mim = mim.resize((mim.width * U, mim.height * U), Image.NEAREST).rotate(rot, resample=Image.NEAREST, expand=True)
        a2 = down(np.array(im), 1 / U)
        mm = np.array(mim)
        ys, xs = np.where(mm > 0)
        piv = (xs.mean() / U, ys.mean() / U)
        a = a2
    else:
        a = np.array(im)
        ys, xs = np.where(np.array(mim) > 0)
        piv = (xs.mean(), ys.mean())
    a, (ox, oy) = crop_alpha(a)
    return a, (piv[0] - ox, piv[1] - oy)


# cómo se sostiene cada arma: agarre en el sprite nativo, recorte de una sola pieza (dagas, aletas) y giro
HOLD = {
    'guerrero': dict(piv=(6, 35)),
    'mago': dict(piv=(13, 28)),
    'invocador': dict(piv=(11, 31)),
    'bardo': dict(piv=(14, 25)),
    'asesino': dict(piv=(16, 34), crop=(12, 9, 35, 40)),
    'pez': dict(piv=(28, 12), crop=(13, 6, 40, 38), rot=180),
    'arquero': dict(piv=(4, 25), flipx=True, rot=20),
}


def hand_sprite(nat, cls):
    h = HOLD[cls]
    a, piv = transform(nat, h['piv'], h.get('crop'), h.get('flipx', False), h.get('rot', 0))
    k = min(32 / max(a.shape[:2]), 0.78)
    a32 = down(a, k)
    p32 = (piv[0] * k, piv[1] * k)
    a16 = down(a32, 0.5)
    return a32, p32, a16, (p32[0] / 2, p32[1] / 2)


def fit(a, box):
    return down(a, min(box / a.shape[1], box / a.shape[0], 1.0))


def pad16(a):
    c = np.zeros((16, 16, 4), np.uint8)
    h, w = a.shape[:2]
    y, x = 16 - h, (16 - w) // 2
    c[y:y + h, x:x + w] = a
    return c


def b64raw(a):
    return base64.b64encode(np.ascontiguousarray(a).astype(np.uint8).tobytes()).decode()


def b64png(a):
    bio = io.BytesIO()
    (a if isinstance(a, Image.Image) else Image.fromarray(a)).save(bio, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()


# ---------------- atlas de ataque ----------------
def hue_mask(a, fn):
    m = np.zeros(a.shape[:2], bool)
    for y in range(a.shape[0]):
        for x in range(a.shape[1]):
            if a[y, x, 3] < 40:
                continue
            h, s, v = colorsys.rgb_to_hsv(*(a[y, x, :3] / 255))
            m[y, x] = fn(h * 360, s, v)
    return m


def reveal(a, t, mode):
    a = a.copy()
    h, w = a.shape[:2]
    if t >= 1:
        return a
    yy, xx = np.mgrid[0:h, 0:w]
    f = {'y': yy / (h - 1), 'x': xx / (w - 1), 'rx': 1 - xx / (w - 1)}.get(mode)
    if f is None:
        f = np.hypot(yy - h / 2, xx - w / 2) / np.hypot(h / 2, w / 2)
    al = np.clip((t - f) / 0.12, 0, 1)
    a[..., 3] = (a[..., 3] * al).astype(np.uint8)
    a[a[..., 3] < 70] = 0
    a[..., 3][a[..., 3] > 0] = 255
    return a


def scale_img(a, k):
    h, w = a.shape[:2]
    return np.array(Image.fromarray(a).resize((max(1, round(w * k)), max(1, round(h * k))), Image.NEAREST))


def fade(a, k):
    a = a.copy()
    a[..., 3] = (a[..., 3] * k).astype(np.uint8)
    return a


def paste(dst, src, cx, cy):
    dst.alpha_composite(Image.fromarray(src), (int(round(cx - src.shape[1] / 2)), int(round(cy - src.shape[0] / 2))))


def rot(w, deg):
    im = Image.fromarray(w)
    big = im.resize((im.width * 2, im.height * 2), Image.NEAREST)
    r = big.rotate(-deg, resample=Image.NEAREST, expand=True)
    return np.array(r.resize((r.width // 2, r.height // 2), Image.NEAREST))


def pal_of(a):
    px = a[a[..., 3] > 200][:, :3].astype(float)
    sat = np.array([colorsys.rgb_to_hsv(*(c / 255))[1] for c in px])
    if (sat > 0.25).sum() > 10:
        px = px[sat > 0.25]
    L = px @ [0.3, 0.59, 0.11]
    o = np.argsort(L)
    n = len(o)
    return [tuple(int(v) for v in px[o[int(n * q)]]) for q in (0.15, 0.45, 0.75, 0.97)]


def burst(pal, size=33, seed=1):
    rng = np.random.default_rng(seed)
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    p = im.load()
    c = size // 2

    def put(x, y, col):
        if 0 <= x < size and 0 <= y < size:
            p[x, y] = col + (255,)
    for k in range(8):
        ang = k * math.pi / 4 + 0.2
        ln = 13 if k % 2 == 0 else 8
        for i in range(1, ln):
            col = pal[3] if i < 4 else pal[2] if i < ln - 3 else pal[1]
            put(round(c + math.cos(ang) * i), round(c + math.sin(ang) * i), col)
            if k % 2 == 0 and i < 6:
                put(round(c + math.cos(ang) * i + math.sin(ang)), round(c + math.sin(ang) * i - math.cos(ang)), pal[2])
    for dx in (-2, -1, 0, 1, 2):
        for dy in (-2, -1, 0, 1, 2):
            if abs(dx) + abs(dy) <= 2:
                put(c + dx, c + dy, pal[3] if abs(dx) + abs(dy) <= 1 else pal[2])
    put(c, c, (255, 255, 240))
    for _ in range(14):
        a = rng.uniform(0, 2 * math.pi)
        r = rng.uniform(9, 15)
        put(round(c + math.cos(a) * r), round(c + math.sin(a) * r), pal[int(rng.integers(1, 4))])
    return np.array(im)


def atlas_for(t):
    atlas = Image.new('RGBA', (CW * S * 5, CH * S * len(CLS)), (0, 0, 0, 0))
    for r, c in enumerate(CLS):
        W = fit(recolor(load(f'nat_w_{c}.png'), t), 32)
        FX = recolor(load(f'nat_fx_{c}.png'), t, keep_wood=False)
        FX2 = scale_img(FX, S)
        pal = pal_of(FX)
        cells = [Image.new('RGBA', (CW * S, CH * S), (0, 0, 0, 0)) for _ in range(5)]
        wx, wy, ex, ey = 26 * S, 26 * S, 52 * S, 24 * S
        if c in ('guerrero', 'invocador'):
            for i, (ang, tt) in enumerate(zip([-75, -35, 5, 40], [0, 0.35, 0.7, 1])):
                if i:
                    paste(cells[i], reveal(FX2, tt, 'y'), ex, ey)
                paste(cells[i], rot(W, ang), wx, wy)
        elif c == 'asesino':
            pink = hue_mask(FX2, lambda h, s, v: (h > 280 or h < 20) and s > 0.25)
            P_, O_ = FX2.copy(), FX2.copy()
            P_[~pink] = 0
            O_[pink] = 0
            seq = [None, reveal(P_, 0.85, 'y'), None, FX2]
            for i in range(4):
                if i == 2:
                    paste(cells[i], P_, ex, ey)
                    paste(cells[i], reveal(O_, 0.6, 'y'), ex, ey)
                elif seq[i] is not None:
                    paste(cells[i], seq[i], ex, ey)
                paste(cells[i], rot(W, [-75, -35, 5, 40][i]), wx, wy)
        elif c == 'pez':
            for i, tt in enumerate([0, 0.35, 0.7, 1]):
                if i:
                    paste(cells[i], reveal(FX2, tt, 'x'), ex, ey)
                paste(cells[i], rot(W, [-30, -10, 10, 30][i]), wx - 4 * S, wy)
        elif c == 'mago':
            rune = hue_mask(FX2, lambda h, s, v: 240 < h < 320)
            R_, O_ = FX2.copy(), FX2.copy()
            R_[~rune] = 0
            O_[rune] = 0
            seq = [(fade(reveal(R_, 0.6, 'c'), 0.6), None), (R_, None), (R_, reveal(O_, 0.55, 'x')), (R_, O_)]
            for i, (a, b) in enumerate(seq):
                paste(cells[i], a, ex, ey)
                if b is not None:
                    paste(cells[i], b, ex, ey)
                paste(cells[i], rot(W, [-40, -20, 10, 25][i]), wx, wy)
        elif c == 'arquero':
            paste(cells[0], rot(W, -45), wx, wy)
            paste(cells[0], FX2[:, FX2.shape[1] // 2:], wx + 10 * S, wy)
            paste(cells[1], rot(W, -45), wx, wy)
            paste(cells[1], reveal(FX2, 0.55, 'rx'), ex, ey)
            paste(cells[2], reveal(FX2, 0.8, 'rx'), ex - 6 * S, ey)
            paste(cells[3], FX2, CW * S / 2, CH * S / 2)
        elif c == 'bardo':
            for i, k in enumerate([0.45, 0.65, 0.85, 1.0]):
                e = scale_img(FX2, k)
                if i == 0:
                    e = fade(e, 0.7)
                paste(cells[i], e, ex, ey)
                paste(cells[i], rot(W, [-20, -5, 10, 20][i]), wx - 2 * S, wy)
        paste(cells[4], scale_img(burst(pal, 33, r + t * 7), S), CW * S / 2, CH * S / 2)
        for i in range(5):
            atlas.alpha_composite(cells[i], (i * CW * S, r * CH * S))
    return atlas


def main():
    prev = '--preview' in sys.argv
    ICON, HAND, HD, ATL, P16, P32 = {}, {}, {}, {}, {}, {}
    nat = {c: load(f'nat_w_{c}.png') for c in CLS}
    for c in CLS:
        _, p32, _, p16 = hand_sprite(nat[c], c)
        P32[c] = [round(p32[0], 2), round(p32[1], 2)]
        P16[c] = [round(p16[0], 2), round(p16[1], 2)]
    for t in range(1, 7):
        for c in CLS:
            n = recolor(nat[c], t)
            ICON[f'{c}_{t}'] = b64raw(pad16(fit(n, 16)))
            a32, _, a16, _ = hand_sprite(n, c)
            c16 = np.zeros((16, 16, 4), np.uint8)
            c16[:a16.shape[0], :a16.shape[1]] = a16[:16, :16]
            HAND[f'{c}_{t}'] = [b64raw(c16)]
            HD[f'{c}_{t}'] = b64png(a32)
            if prev:
                os.makedirs('/tmp/armas_prev', exist_ok=True)
                Image.fromarray(a32).save(f'/tmp/armas_prev/hd_{c}_{t}.png')
        A = atlas_for(t)
        ATL[t] = b64png(A)
        if prev:
            A.save(f'/tmp/armas_prev/atlas_{t}.png')
        print('tier', t, 'ok')
    js = ['// Generado por tools/dev/armas.py desde la hoja de armas de cobre de Sergio (v4.13). No editar a mano.',
          'const ARM_CW = %d, ARM_CH = %d;' % (CW, CH),
          'const ARM_ICON = ' + json.dumps(ICON) + ';',
          'const ARM_HAND = ' + json.dumps({k: v[0] for k, v in HAND.items()}) + ';',
          'const ARM_PIV16 = ' + json.dumps(P16) + ', ARM_PIV32 = ' + json.dumps(P32) + ';',
          'const ARM_HD = ' + json.dumps(HD) + ';',
          'const ARM_ATLAS = ' + json.dumps(ATL) + ';']
    out = os.path.join(ROOT, 'src', '6zyd_armas_data.js')
    open(out, 'w').write('\n'.join(js) + '\n')
    print('escrito', out, os.path.getsize(out), 'bytes')


if __name__ == '__main__':
    main()
