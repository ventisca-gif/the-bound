"""Nihil (v4.65) y sus 6 ataques a partir del dibujo de Sergio.

Uso:  python3 tools/dev/nihil.py   -> escribe src/6zz9c_nihil_data.js

Entradas (tools/dev/nihil_ref/):
- nihil.png: Nihil de frente, píxel de unos 5,86 px. Se muestrea el centro de cada bloque de 2x2 píxeles (sale a la mitad,
  unos 107 px de alto, para que quepa en pantalla como jefe grande).
- ataques.png: 6 filas (Orbe Umbrío, Garra del Vacío, Pilar Oscuro, Lluvia de Cristales, Nova Nihil, Prisión Sombría) x 5
  fotogramas, píxel de unos 5,5 px, fondo transparente (se quitan los bordes azules de alfa bajo).

Atlas del jefe con el formato de los monstruos: 10 columnas (reposo 2, caminata 4, ataque 3, golpe 1) x 4 filas
(abajo, izquierda, derecha, arriba). Flota y la cola ondea. De espaldas se apagan la cara, los ojos y el núcleo.
"""
import base64, io, json, os
import numpy as np
from PIL import Image
from scipy import ndimage

D = os.path.join(os.path.dirname(__file__), 'nihil_ref')
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))


def b64(im):
    bio = io.BytesIO(); im.save(bio, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()


def sample(a, pitch, ox, oy):
    H, W = a.shape[:2]
    ys = np.arange(oy, H, pitch).astype(int); xs = np.arange(ox, W, pitch).astype(int)
    ys = ys[ys < H]; xs = xs[xs < W]
    return a[np.ix_(ys, xs)]


def best_phase(a, pitch):
    """Fase de la cuadrícula: la que deja los bordes de color justo entre celdas."""
    g = np.abs(np.diff(a[..., :3].astype(float), axis=1)).sum(2).sum(0)
    h = np.abs(np.diff(a[..., :3].astype(float), axis=0)).sum(2).sum(1)
    def ph(s):
        best, bo = -1, 0
        for o in np.linspace(0, pitch, 24, endpoint=False):
            idx = np.arange(o, len(s), pitch).astype(int); idx = idx[idx < len(s)]
            v = s[idx].sum()
            if v > best: best, bo = v, o
        return bo
    return ph(g), ph(h)


# ---------------- Nihil ----------------
def nihil_frames():
    a = np.array(Image.open(os.path.join(D, 'nihil.png')).convert('RGB')).astype(float)
    a = a[:1160]                       # sin la sombra elíptica del suelo (el juego dibuja la suya)
    bg = np.median(np.concatenate([a[:6].reshape(-1, 3), a[:, :6].reshape(-1, 3)]), 0)
    P = 5.86
    gx, gy = best_phase(a, P)
    # centro de cada bloque de 2x2 píxeles del dibujo
    s = sample(a, P * 2, gx + P, gy + P)
    d = np.sqrt(((s - bg) ** 2).sum(2))
    lab, _ = ndimage.label(d < 16)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    alpha = np.where(np.isin(lab, list(border)), 0, 255).astype(np.uint8)
    o = np.zeros(s.shape[:2] + (4,), np.uint8); o[..., :3] = s.clip(0, 255); o[..., 3] = alpha
    lab2, n = ndimage.label(o[..., 3] > 0, structure=np.ones((3, 3)))
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n + 1))
        for i, sz in enumerate(sizes):
            if sz < 3: o[lab2 == i + 1] = 0
    ys, xs = np.where(o[..., 3] > 0)
    front = o[ys.min():ys.max() + 1, xs.min():xs.max() + 1].copy()
    H, W = front.shape[:2]
    # espalda: apagar cara, ojos, boca, símbolo y núcleo (zona central bajo la aureola)
    back = front.copy()
    yy, xx = np.mgrid[0:H, 0:W]
    cy, cx, ry, rx = H * 0.42, W * 0.5, H * 0.24, W * 0.21
    e = ((yy - cy) / ry) ** 2 + ((xx - cx) / rx) ** 2
    mask = (e < 1) & (back[..., 3] > 0)
    lum = back[..., :3].astype(float).mean(2)
    pal = np.array([[22, 6, 32], [36, 10, 50], [52, 16, 70], [70, 24, 92]], float)
    idx = np.clip((lum / 255.0 * 0.55 * 4 + e * 0.6).astype(int), 0, 3)
    back[mask, :3] = pal[idx[mask]].astype(np.uint8)
    # pliegues de la capucha: una costura central
    for y in range(int(cy - ry * 0.8), int(cy + ry * 0.9)):
        x = int(cx)
        if back[y, x, 3]: back[y, x, :3] = (16, 4, 24)
    return Image.fromarray(front), Image.fromarray(back)


def nihil_sheet(front, back):
    W, H = front.size
    fw, fh = W + 14, H + 12
    sheet = Image.new('RGBA', (fw * 10, fh * 4), (0, 0, 0, 0))
    bobs = [0, -1, -1, -2, -1, 0, 1, 2, 1, 0]
    sway = [0, 1, 1, 2, 1, -1, 2, 3, 2, 0]
    for row, dirn in enumerate(['down', 'left', 'right', 'up']):
        base = back if dirn == 'up' else front
        if dirn in ('left', 'right'):
            sw = int(W * 0.84)
            src = base.resize((sw, H), Image.NEAREST)
            if dirn == 'right': src = src.transpose(Image.FLIP_LEFT_RIGHT)
        else:
            src = base
        A = np.array(src)
        for col in range(10):
            fr = A.copy(); h = fr.shape[0]
            # la cola ondea: desplaza filas de la mitad baja
            for y in range(int(h * 0.55), h):
                k = (y - h * 0.55) / (h * 0.45)
                dx = int(round(np.sin(col * 0.9 + k * 3) * k * (2 + abs(sway[col]))))
                fr[y] = np.roll(fr[y], dx, axis=0)
            im = Image.fromarray(fr)
            if col in (6, 7, 8):          # ataque: crece y brilla
                sc = 1.0 + 0.04 * (col - 5)
                im = im.resize((int(im.width * sc), int(im.height * sc)), Image.NEAREST)
                arr = np.array(im).astype(int); arr[..., 0] = (arr[..., 0] * 1.15).clip(0, 255); arr[..., 2] = (arr[..., 2] * 1.1).clip(0, 255); im = Image.fromarray(arr.astype(np.uint8))
            if col == 9:                  # golpe: destello claro
                arr = np.array(im).astype(int); arr[..., :3] = (arr[..., :3] * 0.6 + 100).clip(0, 255); im = Image.fromarray(arr.astype(np.uint8))
            lean = 0
            if dirn == 'left' and col in (6, 7, 8): lean = -2 * (col - 5)
            if dirn == 'right' and col in (6, 7, 8): lean = 2 * (col - 5)
            x = col * fw + (fw - im.width) // 2 + lean
            y = row * fh + (fh - 4) - im.height + bobs[col]
            sheet.alpha_composite(im, (x, max(row * fh, y)))
    return sheet, [fw, fh]


# ---------------- ataques ----------------
FX_NAMES = ['orbe', 'garra', 'pilar', 'cristales', 'nova', 'prision']
ROWS = [(10, 240), (268, 450), (470, 705), (730, 922), (937, 1153), (1174, 1360)]
COLS = [145, 290, 477, 670, 877, 1118]


def fx_sheet():
    a = np.array(Image.open(os.path.join(D, 'ataques.png')).convert('RGBA')).astype(float)
    a[a[..., 3] < 48] = 0                          # fuera los bordes azules de alfa bajo
    P = 5.5
    frames, mw, mh = [], 0, 0
    for (y0, y1) in ROWS:
        row = []
        for i in range(5):
            sub = a[y0:y1, COLS[i]:COLS[i + 1]]
            gx, gy = best_phase(sub, P)
            s = sample(sub, P, gx + P / 2, gy + P / 2)
            s[..., 3] = np.where(s[..., 3] >= 96, 255, 0)
            o = s.clip(0, 255).astype(np.uint8)
            ys, xs = np.where(o[..., 3] > 0)
            if len(ys) == 0: o = np.zeros((2, 2, 4), np.uint8)
            else: o = o[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
            row.append(o); mw = max(mw, o.shape[1]); mh = max(mh, o.shape[0])
        frames.append(row)
    fw, fh = mw + 2, mh + 2
    sheet = Image.new('RGBA', (fw * 5, fh * len(frames)), (0, 0, 0, 0))
    for r, row in enumerate(frames):
        for c, o in enumerate(row):
            im = Image.fromarray(o)
            sheet.alpha_composite(im, (c * fw + (fw - im.width) // 2, r * fh + (fh - im.height)))   # anclado abajo
    return sheet, [fw, fh]


def main():
    front, back = nihil_frames()
    sh, sz = nihil_sheet(front, back)
    fx, fsz = fx_sheet()
    sh.save('/tmp/nihil_sheet.png'); fx.save('/tmp/nihil_fx.png')
    path = os.path.join(ROOT, 'src', '6zz9c_nihil_data.js')
    open(path, 'w').write('// Generado por tools/dev/nihil.py desde el dibujo de Sergio (v4.65). No editar a mano.\n'
                          'const NIHX_SIZE = ' + json.dumps(sz) + ';\nconst NIHX_SHEET = ' + json.dumps(b64(sh)) + ';\n'
                          'const NIHX_FXSIZE = ' + json.dumps(fsz) + ';\nconst NIHX_FXN = ' + json.dumps(FX_NAMES) + ';\nconst NIHX_FX = ' + json.dumps(b64(fx)) + ';\n')
    print('escrito', path, os.path.getsize(path), 'nihil', front.size, 'frame', sz, 'fx', fsz)


if __name__ == '__main__':
    main()
