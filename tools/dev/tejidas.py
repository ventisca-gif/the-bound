"""Criaturas, jefes y armas de las Tierras Tejidas (v5.79) desde las hojas de Sergio (tools/dev/tejidas_ref/).

Uso:  python3 tools/dev/tejidas.py [--debug]   -> escribe src/6zzzp_v579_tejidas_data.js

criaturas.png: 20 filas (las 15 criaturas, los 4 jefes y una Reina Polilla grande al final) x 6 vistas en el orden de
la hoja del juego: frente quieto, frente andando, frente atacando, perfil andando, perfil atacando y espalda.
Cada vista se recorta (fondo quitado por relleno desde el borde), se reduce al tamaño del juego con media premultiplicada
y 24 colores, y se monta el atlas de los monstruos: 10 columnas (reposo 2, caminata 4, ataque 3, golpe 1) x 4 filas
(abajo, izquierda, derecha = izquierda espejada, arriba).
armas.png: 7 filas (una por clase); de cada fila se eligen 7 armas (TJW_PICK, una por tier 37-43 según su tema) y se
guardan a 32 px (HD), 16 px (mano e icono) con su punto de agarre.
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

D = os.path.join(os.path.dirname(__file__), 'tejidas_ref')
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DBG = '--debug' in sys.argv
OUTD = '/tmp/tejidas_dbg'

# --------------------------------------------------------------------------- criaturas
ROWY = [5, 87, 170, 252, 334, 415, 501, 574, 649, 723, 793, 863, 924, 987, 1052, 1119, 1193, 1261, 1344, 1419, 1523]
# clave del juego, fila de la hoja, alto en el juego (vista de frente), el perfil de la hoja mira a la derecha
CRE = [('ovillo', 0, 24, False), ('polilla', 1, 26, False), ('aguja', 2, 30, False), ('muneco', 3, 28, False), ('arana', 4, 24, False),
       ('carrete', 5, 26, False), ('oveja', 6, 24, False), ('lince', 7, 26, False), ('fantasma', 8, 28, False), ('rana', 9, 22, False),
       ('mantis', 10, 32, False), ('tijera', 11, 30, False), ('maniqui', 12, 32, False), ('guardian', 13, 32, False), ('telar', 14, 34, False),
       ('reina', 19, 66, False), ('nudo', 16, 58, False), ('rueca', 17, 64, False), ('hilandera', 18, 68, False)]
FLIP = set()


def b64(im):
    bio = io.BytesIO(); im.save(bio, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()


def cut(a, box, thr=36, weapon=False):
    x0, y0, x1, y1 = box; sub = a[y0:y1, x0:x1].copy()
    bg = np.median(np.concatenate([sub[:2].reshape(-1, 3), sub[-2:].reshape(-1, 3), sub[:, :2].reshape(-1, 3), sub[:, -2:].reshape(-1, 3)]), 0)
    d = np.sqrt(((sub - bg) ** 2).sum(2))
    lab, _ = ndimage.label(d < thr)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    al = ~np.isin(lab, list(border))
    lab2, n = ndimage.label(al, structure=np.ones((3, 3)))
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n + 1)); big = sizes.max()
        for i, s in enumerate(sizes):
            if s < max(20, big * 0.01): al[lab2 == i + 1] = False
    if weapon:
        # huecos con el color del fondo encerrados por el arma (arco y cuerda, arpas): también transparentes
        holes, nh = ndimage.label((d < thr) & al)
        for i, sl in enumerate(ndimage.find_objects(holes)):
            if sl is None: continue
            m = holes[sl] == i + 1
            if m.sum() > 30: al[sl][m] = False
        # solo la pieza principal y lo que está pegado a ella (fuera trocitos de las armas vecinas)
        lab3, n3 = ndimage.label(al, structure=np.ones((3, 3)))
        if n3 > 1:
            sizes = ndimage.sum(np.ones_like(lab3), lab3, range(1, n3 + 1)); main = int(np.argmax(sizes)) + 1
            near = ndimage.binary_dilation(lab3 == main, iterations=6)
            for i in range(1, n3 + 1):
                if i != main and not (near & (lab3 == i)).any(): al[lab3 == i] = False
    ys, xs = np.where(al)
    sub = sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; al = al[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return np.dstack([sub, al * 255.0])


def shrink(rgba, f, ncol=24, edge_dark=True):
    h, w = rgba.shape[:2]; W, H = max(3, round(w * f)), max(3, round(h * f))
    pm = rgba.copy(); pm[..., :3] *= pm[..., 3:] / 255
    sm = np.array(Image.fromarray(pm.clip(0, 255).astype(np.uint8), 'RGBA').resize((W, H), Image.BOX)).astype(float)
    A = sm[..., 3:]; sm[..., :3] = np.where(A > 0, sm[..., :3] * 255 / np.maximum(A, 1), 0)
    alpha = np.where(A[..., 0] > 105, 255, 0).astype(np.uint8)
    q = Image.fromarray(sm[..., :3].clip(0, 255).astype(np.uint8)).quantize(ncol, dither=Image.NONE).convert('RGB')
    o = np.dstack([np.array(q), alpha])
    if edge_dark:
        m = alpha > 0; e = m & ~ndimage.binary_erosion(m); dark = (o[..., :3].astype(int).sum(2) < 200)
        o[e & ~dark, :3] = (o[e & ~dark, :3] * 0.55).astype(np.uint8)
    return Image.fromarray(o, 'RGBA')


def row_cells(a, r):
    y0, y1 = ROWY[r] + 4, ROWY[r + 1] - 3; X0, X1 = 262, 1000; sub = a[y0:y1, X0:X1]
    bg = np.median(sub[:3].reshape(-1, 3), 0); fg = np.sqrt(((sub - bg) ** 2).sum(2)) > 45
    fg = ndimage.binary_dilation(fg, iterations=3); col = fg.sum(0); segs = []; inn = False
    for x, v in enumerate(col):
        if v > 0 and not inn: s = x; inn = True
        if v == 0 and inn: segs.append((s, x)); inn = False
    if inn: segs.append((s, len(col)))
    segs = sorted(sorted(segs, key=lambda s: -(s[1] - s[0]))[:6])
    assert len(segs) == 6, (r, segs)
    return [(X0 + s0 - 3, y0, X0 + s1 + 3, y1) for s0, s1 in segs]


def creature_sheet(views, flip):
    # views: frente quieto, frente andando, frente atacando, perfil andando, perfil atacando, espalda (PIL RGBA)
    side = [v.transpose(Image.FLIP_LEFT_RIGHT) if flip else v for v in views[3:5]]   # perfil mirando a la izquierda
    fw = max(v.width for v in views) + 8; fh = max(v.height for v in views) + 8
    S = Image.new('RGBA', (fw * 10, fh * 4), (0, 0, 0, 0))
    fr, wk, at, up = views[0], views[1], views[2], views[5]
    seq = {'down': [fr, fr, fr, wk, fr, wk, fr, at, at, fr], 'left': [side[0]] * 6 + [side[0], side[1], side[1], side[0]], 'up': [up] * 10}
    seq['right'] = [v.transpose(Image.FLIP_LEFT_RIGHT) for v in seq['left']]
    bobs = [0, 1, 0, -1, 0, -1, 0, -1, 0, 0]; lean = [0, 0, 0, 1, 0, 1, 0, 2, 3, 0]
    for row, dirn in enumerate(['down', 'left', 'right', 'up']):
        for col in range(10):
            im = seq[dirn][col]
            if col == 9: im = Image.fromarray((np.array(im).astype(float) * [0.6, 0.6, 0.6, 1] + [110, 100, 100, 0]).clip(0, 255).astype(np.uint8), 'RGBA')
            if dirn == 'up' and col in (3, 5): im = im.transpose(Image.FLIP_LEFT_RIGHT)   # paso alterno de espaldas
            dx = 0 if dirn in ('down', 'up') else (-lean[col] if dirn == 'left' else lean[col])
            dy = bobs[col] + (-lean[col] if dirn in ('down', 'up') and col in (7, 8) else 0)
            x = col * fw + (fw - im.width) // 2 + dx; y = row * fh + (fh - 3) - im.height + dy
            S.alpha_composite(im, (max(col * fw, x), max(row * fh, y)))
    return S, [fw, fh]


# --------------------------------------------------------------------------- armas
CLS = ['guerrero', 'mago', 'arquero', 'asesino', 'bardo', 'invocador', 'pez']
WROWY = [(6, 151), (152, 294), (294, 441), (441, 569), (569, 713), (713, 873), (873, 1024)]
# índice (desde 1, de izquierda a derecha) del arma de la hoja para cada tier 37-43:
# 37 legado de la clase, 38 escarcha, 39 raíz, 40 engranaje/reloj, 41 prisma, 42 fénix/fuego, 43 aurora
TJW_PICK = {'guerrero': [12, 4, 6, 5, 10, 3, 13], 'mago': [10, 13, 5, 6, 4, 11, 3], 'arquero': [1, 5, 9, 7, 8, 6, 11],
            'asesino': [1, 4, 5, 3, 9, 10, 7], 'bardo': [3, 4, 6, 7, 8, 10, 11], 'invocador': [1, 3, 2, 6, 4, 10, 11], 'pez': [4, 3, 5, 11, 7, 10, 1]}
# agarre relativo a la caja del dibujo (0-1): por defecto el extremo de abajo a la izquierda
GRIP = {'arquero': (0.45, 0.55), 'bardo': (0.28, 0.66)}


def weapon_items(a, r):
    # componentes 2D (las armas van en diagonal y se solapan en columnas); se juntan las piezas de una misma arma
    y0, y1 = WROWY[r]; X0 = 118; sub = a[y0:y1, X0:]
    bg = np.median(np.concatenate([sub[:2].reshape(-1, 3), sub[-2:].reshape(-1, 3)]), 0); fg = np.sqrt(((sub - bg) ** 2).sum(2)) > 40
    lab, n = ndimage.label(ndimage.binary_dilation(fg, iterations=2), structure=np.ones((3, 3)))
    boxes = []
    for sl in ndimage.find_objects(lab):
        if sl is None: continue
        ys, xs = sl; area = (ys.stop - ys.start) * (xs.stop - xs.start)
        if area > 900: boxes.append([xs.start, ys.start, xs.stop, ys.stop])
    merged = True
    while merged:
        merged = False
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                A, B = boxes[i], boxes[j]; ix = min(A[2], B[2]) - max(A[0], B[0]); iy = min(A[3], B[3]) - max(A[1], B[1])
                small = min((A[2] - A[0]) * (A[3] - A[1]), (B[2] - B[0]) * (B[3] - B[1]))
                if ix > 0 and iy > 0 and ix * iy > 0.35 * small:
                    boxes[i] = [min(A[0], B[0]), min(A[1], B[1]), max(A[2], B[2]), max(A[3], B[3])]; boxes.pop(j); merged = True; break
            if merged: break
    boxes.sort(key=lambda b: (b[0] + b[2]) / 2)
    return [(X0 + b[0] - 2, y0 + max(0, b[1] - 2), X0 + b[2] + 2, y0 + min(y1 - y0, b[3] + 2)) for b in boxes]


def weapon_fit(rgba, N):
    h, w = rgba.shape[:2]; f = (N - 1) / max(h, w)
    im = shrink(rgba, f, 20)
    c = Image.new('RGBA', (N, N), (0, 0, 0, 0)); ox, oy = 0, N - im.height   # pegado abajo a la izquierda (como las del juego)
    c.alpha_composite(im, (ox, oy)); return c, f, (ox, oy)


def grip_of(cls, rgba, f, off):
    al = rgba[..., 3] > 0; ys, xs = np.where(al); h, w = al.shape
    if cls in GRIP: gx, gy = GRIP[cls]; return [round(off[0] + gx * w * f, 2), round(off[1] + gy * h * f, 2)]
    k = np.argmax(ys - xs); ex, ey = xs[k], ys[k]   # extremo abajo-izquierda
    return [round(off[0] + (ex + 0.09 * w) * f, 2), round(off[1] + (ey - 0.09 * h) * f, 2)]


def main():
    os.makedirs(OUTD, exist_ok=True)
    a = np.array(Image.open(os.path.join(D, 'criaturas.png')).convert('RGB')).astype(float)
    out, sizes = {}, {}
    for (k, r, H, flip) in CRE:
        boxes = row_cells(a, r); raw = [cut(a, b) for b in boxes]; f = H / raw[0].shape[0]
        views = [shrink(v, f) for v in raw]
        S, sz = creature_sheet(views, flip or k in FLIP); out[k] = b64(S); sizes[k] = sz
        if DBG: S.resize((S.width * 3, S.height * 3), Image.NEAREST).save(os.path.join(OUTD, 'c_' + k + '.png'))
    w = np.array(Image.open(os.path.join(D, 'armas.png')).convert('RGB')).astype(float); weap = {}
    for r, cls in enumerate(CLS):
        items = weapon_items(w, r)
        if DBG: print(cls, len(items))
        for i, t in enumerate(range(37, 44)):
            box = items[TJW_PICK[cls][i] - 1]; rgba = cut(w, box, 40, True)
            hd, f2, o2 = weapon_fit(rgba, 32); sm, f1, o1 = weapon_fit(rgba, 16)
            weap[cls + '_' + str(t)] = {'hd': b64(hd), 'h16': b64(sm), 'p32': grip_of(cls, rgba, f2, o2), 'p16': grip_of(cls, rgba, f1, o1)}
            if DBG: hd.resize((128, 128), Image.NEAREST).save(os.path.join(OUTD, 'w_%s_%d.png' % (cls, t)))
    p = os.path.join(ROOT, 'src', '6zzzp_v579_tejidas_data.js')
    open(p, 'w').write('// Generado por tools/dev/tejidas.py desde las hojas de Sergio (v5.79). No editar a mano.\nconst TJS_SIZE = ' + json.dumps(sizes) + ';\nconst TJS_SHEET = ' + json.dumps(out) + ';\nconst TJW_IMG = ' + json.dumps(weap) + ';\n')
    print('escrito', p, os.path.getsize(p))


if __name__ == '__main__':
    main()
