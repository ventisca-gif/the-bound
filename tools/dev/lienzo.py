"""Criaturas y jefes de Las Tierras sin Pintar (v4.70) desde las hojas de Sergio (tools/dev/lienzo_ref/).

Uso:  python3 tools/dev/lienzo.py [--debug]   -> escribe src/6zz9l_lienzo_data.js

Las hojas no tienen una cuadrícula de píxel uniforme, así que cada dibujo se recorta (fondo quitado por relleno desde
el borde), se reduce al tamaño del juego con media premultiplicada y se deja en 16 colores. Atlas con el formato de los
monstruos: 10 columnas (reposo 2, caminata 4, ataque 3, golpe 1) x 4 filas (abajo, izquierda, derecha, arriba).
Abajo/arriba = dibujo de frente (arriba algo más oscuro); izquierda = el dibujo (miran a la izquierda) y derecha espejado.
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

D = os.path.join(os.path.dirname(__file__), 'lienzo_ref')
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DBG = '--debug' in sys.argv

# id, hoja, caja (x0, y0, x1, y1), alto en el juego, zonas a tapar [(x0,y0,x1,y1)], mira a la derecha
ITEMS = [
    ('babosa', 'bestiario', (20, 270, 290, 480), 24, [], False),
    ('lobo', 'bestiario', (300, 240, 590, 480), 30, [], False),
    ('arana', 'bestiario', (595, 260, 880, 480), 26, [], False),
    ('caballero', 'bestiario', (880, 215, 1170, 480), 40, [], False),
    ('esqueleto', 'bestiario', (1180, 225, 1440, 480), 38, [], False),
    ('golem', 'bestiario', (20, 620, 300, 895), 42, [], False),
    ('espectro', 'bestiario', (310, 600, 590, 895), 38, [], False),
    ('pez', 'bestiario', (595, 630, 880, 895), 28, [], False),
    ('mimo', 'bestiario', (880, 630, 1170, 895), 38, [], True),
    ('nihilito', 'bestiario', (1180, 650, 1440, 895), 26, [], False),
    ('eco', 'jefes', (18, 226, 258, 494), 96, [], True),
    ('lienzo', 'jefes', (512, 170, 772, 494), 104, [(660, 170, 800, 256)], True),
    ('sierpe', 'jefes', (14, 560, 345, 912), 96, [], True),
    ('fragmento', 'jefes', (796, 569, 1095, 908), 96, [], True),
]


def b64(im):
    bio = io.BytesIO(); im.save(bio, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()


def cut(sheet, box, masks):
    a = np.array(Image.open(os.path.join(D, sheet + '.png')).convert('RGB')).astype(float)
    x0, y0, x1, y1 = box; sub = a[y0:y1, x0:x1].copy()
    bg = np.median(np.concatenate([sub[:3].reshape(-1, 3), sub[:, :3].reshape(-1, 3), sub[:, -3:].reshape(-1, 3)]), 0)
    for (mx0, my0, mx1, my1) in masks:
        sub[max(0, my0 - y0):max(0, my1 - y0), max(0, mx0 - x0):max(0, mx1 - x0)] = bg
    d = np.sqrt(((sub - bg) ** 2).sum(2)); mx = sub.max(2)
    lab, _ = ndimage.label((d < 34) | (mx < 30))
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    al = ~np.isin(lab, list(border))
    lab2, n = ndimage.label(al, structure=np.ones((3, 3)))
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n + 1)); big = sizes.max()
        H_, W_ = al.shape; edge = set(np.unique(np.concatenate([lab2[:4].ravel(), lab2[-4:].ravel(), lab2[:, :4].ravel(), lab2[:, -4:].ravel()]))) - {0}
        for i, s in enumerate(sizes):
            if s < max(40, big * 0.004) or (i + 1 in edge and s < big * 0.15): al[lab2 == i + 1] = False
    ys, xs = np.where(al)
    sub = sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; al = al[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return np.dstack([sub, al * 255.0])


def shrink(rgba, H):
    h, w = rgba.shape[:2]; W = max(4, round(w * H / h))
    pm = rgba.copy(); pm[..., :3] *= pm[..., 3:] / 255
    sm = np.array(Image.fromarray(pm.clip(0, 255).astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)).astype(float)
    A = sm[..., 3:]; sm[..., :3] = np.where(A > 0, sm[..., :3] * 255 / np.maximum(A, 1), 0)
    alpha = np.where(A[..., 0] > 110, 255, 0).astype(np.uint8)
    q = Image.fromarray(sm[..., :3].clip(0, 255).astype(np.uint8)).quantize(16, dither=Image.NONE).convert('RGB')
    o = np.dstack([np.array(q), alpha])
    # contorno oscuro de 1 px donde el dibujo toca el vacío (como el resto de sprites del juego)
    m = alpha > 0; edge = m & ~ndimage.binary_erosion(m)
    dark = (o[..., :3].astype(int).sum(2) < 200)
    o[edge & ~dark, :3] = (o[edge & ~dark, :3] * 0.55).astype(np.uint8)
    return Image.fromarray(o, 'RGBA')


def sheet(img, right):
    side = img if not right else img.transpose(Image.FLIP_LEFT_RIGHT)   # izquierda = mirando a la izquierda
    up = Image.fromarray((np.array(img).astype(float) * [0.82, 0.82, 0.88, 1]).clip(0, 255).astype(np.uint8), 'RGBA')
    fw, fh = img.width + 8, img.height + 8
    S = Image.new('RGBA', (fw * 10, fh * 4), (0, 0, 0, 0))
    bobs = [0, 1, 0, 1, 2, 1, -1, -2, 0, 0]; lean = [0, 0, 0, 0, 0, 0, 2, 4, 1, -1]
    for row, dirn in enumerate(['down', 'left', 'right', 'up']):
        src = img if dirn == 'down' else up if dirn == 'up' else side if dirn == 'left' else side.transpose(Image.FLIP_LEFT_RIGHT)
        for col in range(10):
            fr = src
            if col == 9: fr = Image.fromarray((np.array(src).astype(float) * [0.6, 0.6, 0.6, 1] + [100, 100, 100, 0]).clip(0, 255).astype(np.uint8), 'RGBA')
            dx = 0 if dirn in ('down', 'up') else (-lean[col] if dirn == 'left' else lean[col])
            x = col * fw + (fw - fr.width) // 2 + dx; y = row * fh + (fh - 3) - fr.height + bobs[col] - 1
            S.alpha_composite(fr, (x, max(row * fh, y)))
    return S, [fw, fh]


def main():
    out, sizes = {}, {}
    for (k, sh, box, H, masks, right) in ITEMS:
        rgba = cut(sh, box, masks); im = shrink(rgba, H)
        if DBG: im.resize((im.width * 4, im.height * 4), Image.NEAREST).save('/tmp/lz_' + k + '.png')
        S, sz = sheet(im, right); out[k] = b64(S); sizes[k] = sz
    p = os.path.join(ROOT, 'src', '6zz9l_lienzo_data.js')
    open(p, 'w').write('// Generado por tools/dev/lienzo.py desde las hojas de Sergio (v4.70). No editar a mano.\nconst LZ_SIZE = ' + json.dumps(sizes) + ';\nconst LZ_SHEET = ' + json.dumps(out) + ';\n')
    print('escrito', p, os.path.getsize(p), sizes)


if __name__ == '__main__':
    main()
