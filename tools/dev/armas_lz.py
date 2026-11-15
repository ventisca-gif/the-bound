"""Armas de Las Tierras sin Pintar (v4.71): tiers 27-30 y el arma del Lienzo (31) desde la hoja de Sergio.

Uso:  python3 tools/dev/armas_lz.py [--preview=/ruta.png]   -> escribe src/6zz9n_armas_lz_data.js

Entrada: tools/dev/lienzo_ref/armas.png (5 armas por clase: bardo, mago, guerrero, pez, ninja = asesino, invocador).
La hoja no tiene cuadrícula de píxel uniforme: cada arma se recorta (fondo por relleno desde el borde), las alargadas se
ponen derechas con su eje principal (punta arriba) y se reducen a 64 px antes de pasar por las funciones de
tools/dev/armas.py (mano 16/32, icono 16 y atlas de ataque), igual que tools/dev/armas_vr.py.
El arquero no sale en la hoja: usa el arco del Velo Roto (armas_vr_ref/dk_arco.png) en blanco y lila.
"""
import base64, colorsys, io, json, math, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
import armas as A
import armas_vr as V

SHEET = os.path.join(os.path.dirname(__file__), 'lienzo_ref', 'armas.png')
ROOT = A.ROOT
TIERS = [27, 28, 29, 30, 31]
# (clase, tier, caja en la hoja, alargada → enderezar)
W = {
    'bardo': [((187, 227, 287, 365), True), ((447, 227, 560, 365), False), ((573, 227, 700, 365), False), ((300, 227, 427, 365), True), ((47, 227, 153, 365), True)],
    'mago': [((880, 222, 993, 365), True), ((1173, 222, 1280, 365), False), ((1020, 222, 1147, 365), False), ((753, 222, 867, 372), True), ((1287, 222, 1413, 365), True)],
    'guerrero': [((313, 500, 440, 640), True), ((193, 500, 287, 640), True), ((460, 500, 573, 640), True), ((573, 500, 707, 640), False), ((40, 473, 173, 640), True)],
    'pez': [((867, 500, 1000, 640), True), ((1147, 500, 1273, 640), False), ((1273, 500, 1413, 640), True), ((1020, 500, 1133, 640), True), ((740, 473, 860, 640), True)],
    'asesino': [((193, 765, 300, 905), False), ((593, 765, 700, 905), False), ((433, 765, 587, 905), False), ((300, 765, 427, 905), False), ((80, 707, 187, 905), True)],
    'invocador': [((1173, 765, 1253, 960), False), ((907, 765, 1000, 960), False), ((1260, 765, 1400, 960), False), ((1013, 765, 1140, 960), False), ((747, 753, 867, 960), True)],
}
HOLD = {True: dict(f=(0.5, 0.86), rot=-45), False: dict(f=(0.5, 0.78), rot=-35)}


def cut(box):
    a = np.array(Image.open(SHEET).convert('RGB')).astype(float)
    x0, y0, x1, y1 = box; sub = a[y0:y1, x0:x1]
    bg = np.median(np.concatenate([sub[:3].reshape(-1, 3), sub[:, :3].reshape(-1, 3), sub[:, -3:].reshape(-1, 3)]), 0)
    d = np.sqrt(((sub - bg) ** 2).sum(2))
    lab, _ = ndimage.label(d < 40)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    al = ~np.isin(lab, list(border))
    lab2, n = ndimage.label(al, structure=np.ones((3, 3)))
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n + 1)); big = sizes.max()
        for i, s in enumerate(sizes):
            if s < big * 0.03: al[lab2 == i + 1] = False
    ys, xs = np.where(al)
    o = np.zeros(sub.shape[:2] + (4,), np.uint8); o[..., :3] = sub.clip(0, 255); o[..., 3] = al * 255
    return o[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def upright(a):
    ys, xs = np.where(a[..., 3] > 0); c = np.cov(np.vstack([xs - xs.mean(), ys - ys.mean()]))
    w, v = np.linalg.eigh(c); vx, vy = v[:, 1]
    ang = math.degrees(math.atan2(vx, -vy))          # ángulo del eje mayor respecto a la vertical
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    im = Image.fromarray(a).rotate(ang, resample=Image.BICUBIC, expand=True)
    r = np.array(im); r[..., 3] = np.where(r[..., 3] > 120, 255, 0)
    ys, xs = np.where(r[..., 3] > 0)
    return r[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def native(box, long_):
    a = cut(box)
    if long_: a = upright(a)
    return A.down(a, 64 / max(a.shape[:2]))


def hand(n, long_):
    h = HOLD[long_]; H, Wd = n.shape[:2]
    piv = (min(Wd - 1, h['f'][0] * Wd), min(H - 1, h['f'][1] * H))
    a, p = A.transform(n, piv, None, False, h['rot'])
    k = min((32 if long_ else 21) / max(a.shape[:2]), 0.95)
    a32 = A.down(a, k); p32 = (p[0] * k, p[1] * k); a16 = A.down(a32, 0.5)
    return a32, p32, a16, (p32[0] / 2, p32[1] / 2)


def pale(a, hue):
    """Arco del Velo Roto en blanco/lila (para el arquero)."""
    o = a.copy()
    for y in range(a.shape[0]):
        for x in range(a.shape[1]):
            if a[y, x, 3] < 40: continue
            h, s, v = colorsys.rgb_to_hsv(*(a[y, x, :3] / 255))
            if s > 0.35: r, g, b = colorsys.hsv_to_rgb(hue / 360, min(1, s * 0.9), min(1, v * 1.1))
            else: r, g, b = colorsys.hsv_to_rgb(0.75, 0.08, min(1, 0.55 + v * 0.5))
            o[y, x, :3] = [int(r * 255), int(g * 255), int(b * 255)]
    return o


def main():
    ICON, HAND, HD, PIV16, PIV32, ATL = {}, {}, {}, {}, {}, {}
    arco = V.native('arco')
    NAT = {}
    for c in A.CLS:
        for i, t in enumerate(TIERS):
            if c == 'arquero':
                n = pale(arco, [275, 290, 255, 300, 280][i]); a32, p32, a16, p16 = V.hand(n, 'arco')
            else:
                box, lg = W[c][i]; n = native(box, lg); a32, p32, a16, p16 = hand(n, lg)
            NAT[(c, t)] = n
            key = f'{c}_{t}'
            ICON[key] = A.b64raw(A.pad16(A.fit(n, 16)))
            c16 = np.zeros((16, 16, 4), np.uint8); c16[:min(16, a16.shape[0]), :min(16, a16.shape[1])] = a16[:16, :16]
            HAND[key] = A.b64raw(c16); HD[key] = A.b64png(a32)
            PIV16[key] = [round(p16[0], 2), round(p16[1], 2)]; PIV32[key] = [round(p32[0], 2), round(p32[1], 2)]
    orig = A.load
    for t in TIERS:
        def load(name, t=t):
            if name.startswith('nat_w_'): return NAT[(name[6:-4], t)]
            fx = orig(name); fx = V.shift(fx, 250, protect=False)       # efectos de cobre pasados a lila
            f = fx.astype(float); f[..., :3] = f[..., :3] * 0.7 + 70; return f.clip(0, 255).astype(np.uint8)
        A.load = load
        try: ATL[t] = A.b64png(A.atlas_for(2))
        finally: A.load = orig
        print('tier', t, 'ok')
    js = ['// Generado por tools/dev/armas_lz.py desde la hoja de armas de Las Tierras sin Pintar de Sergio (v4.71). No editar a mano.',
          'const ARMZ_ICON = ' + json.dumps(ICON) + ';', 'const ARMZ_HAND = ' + json.dumps(HAND) + ';',
          'const ARMZ_PIV16 = ' + json.dumps(PIV16) + ', ARMZ_PIV32 = ' + json.dumps(PIV32) + ';',
          'const ARMZ_HD = ' + json.dumps(HD) + ';', 'const ARMZ_ATLAS = ' + json.dumps(ATL) + ';']
    out = os.path.join(ROOT, 'src', '6zz9n_armas_lz_data.js'); open(out, 'w').write('\n'.join(js) + '\n')
    print('escrito', out, os.path.getsize(out))
    prev = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--preview=')), None)
    if prev:
        sheet = Image.new('RGBA', (len(A.CLS) * 140, len(TIERS) * 140), (60, 50, 70, 255))
        for i, t in enumerate(TIERS):
            for j, c in enumerate(A.CLS):
                im = Image.open(io.BytesIO(base64.b64decode(HD[f'{c}_{t}'].split(',')[1])))
                sheet.alpha_composite(im.resize((im.width * 4, im.height * 4), Image.NEAREST), (j * 140 + 4, i * 140 + 4))
        sheet.save(prev)


if __name__ == '__main__':
    main()
