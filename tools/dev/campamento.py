"""NPCs del campamento de los Vigías del Alba (v4.13), del dibujo de Sergio.

Uso:  python3 tools/dev/campamento.py   -> escribe src/6zyf_campamento_data.js

Entrada: tools/dev/camp_ref/cnat.png (su imagen reducida a la resolución real de sus píxeles, unos 4 px = 1 píxel)
y chars.json (filas: frente, izquierda, derecha, espalda; 8 columnas = 8 personajes).
Cada personaje sale a tamaño original en celdas de 64x64 con los pies en y = 60 (como los atlas del juego).
Columnas: reposo, reposo, caminata 1-4. La caminata alterna los pies (de frente y de espaldas sube un pie;
de perfil la parte baja de las piernas avanza y retrocede) con 1 px de rebote en los pasos intermedios.
"""
import base64, io, json, os
import numpy as np
from PIL import Image
from scipy import ndimage

D = os.path.join(os.path.dirname(__file__), 'camp_ref')
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
J = json.load(open(os.path.join(D, 'chars.json')))
a = np.array(Image.open(os.path.join(D, 'cnat.png')).convert('RGB')).astype(float)
bg = np.array(J['bg'])
FW = FH = 64
LG = 9   # filas de piernas


def cut(y0, y1, x0, x1):
    sub = a[y0 - 1:y1 + 1, x0 - 2:x1 + 2]
    d = np.sqrt(((sub - bg) ** 2).sum(2))
    lab, _ = ndimage.label(d < 20)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    o = np.zeros(sub.shape[:2] + (4,), np.uint8)
    o[..., :3] = sub
    o[..., 3] = np.where(np.isin(lab, list(border)), 0, 255)
    ys, xs = np.where(o[..., 3].any(1))[0], np.where(o[..., 3].any(0))[0]
    return o[ys[0]:ys[-1] + 1, xs[0]:xs[-1] + 1]


def walk(s, side, f):
    h, w = s.shape[:2]
    out = np.zeros((h + 1, w + 2, 4), np.uint8)
    body, legs = s[:h - LG], s[h - LG:]
    bob = 1 if f in (1, 3) else 0
    out[bob:bob + h - LG, 1:w + 1] = body
    cx = w // 2

    def put(part, dx, dy, x0):
        for yy in range(part.shape[0]):
            for xx in range(part.shape[1]):
                if part[yy, xx, 3]:
                    Y, X = h - LG + yy + dy, x0 + xx + dx + 1
                    if 0 <= Y < h + 1 and 0 <= X < w + 2:
                        out[Y, X] = part[yy, xx]
    if not side:
        Lp, Rp = legs[:, :cx], legs[:, cx:]
        upL, upR = f == 0, f == 2
        put(Lp[1:] if upL else Lp, 0, 0, 0)
        put(Rp[1:] if upR else Rp, 0, 0, cx)
    else:
        sh = {0: 1, 1: 0, 2: -1, 3: 0}[f]
        put(legs[:LG // 2], 0, 0, 0)
        put(legs[LG // 2:], sh, LG // 2, 0)
    return out[:h] if bob == 0 else out[1:h]


def main():
    sheet = Image.new('RGBA', (FW * 6, FH * 4 * 8), (0, 0, 0, 0))
    for ci in range(8):
        for r, (y0, y1) in enumerate(J['rows']):
            x0, x1 = J['cols'][r][ci]
            s = cut(y0, y1, x0, x1)
            frames = [s, s] + [walk(s, r in (1, 2), f) for f in range(4)]
            for k, fr in enumerate(frames):
                im = Image.fromarray(fr)
                sheet.alpha_composite(im, (k * FW + FW // 2 - im.width // 2, (ci * 4 + r) * FH + (FH - 4) - im.height))
    bio = io.BytesIO()
    sheet.save(bio, 'PNG', optimize=True)
    uri = 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()
    out = os.path.join(ROOT, 'src', '6zyf_campamento_data.js')
    open(out, 'w').write('// Generado por tools/dev/campamento.py desde el dibujo de Sergio (v4.13). No editar a mano.\n'
                         '// 8 personajes x 4 direcciones (abajo, izquierda, derecha, arriba); columnas: reposo x2, caminata x4; celdas 64x64, pies en y=60.\n'
                         'const CAMP_FW = 64, CAMP_SHEET = ' + json.dumps(uri) + ';\n')
    print('escrito', out, os.path.getsize(out))


if __name__ == '__main__':
    main()
