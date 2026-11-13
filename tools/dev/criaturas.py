"""Criaturas de Altavela (v4.16) a partir del dibujo de Sergio.

Uso:  python3 tools/dev/criaturas.py   -> escribe src/6zyn_criaturas_data.js

Entrada: tools/dev/criaturas_ref/crnat.png (su imagen reducida a la resolución real de sus píxeles, unos 6,4 px = 1).
Fila de arriba: de frente; fila de abajo: de perfil mirando a la izquierda. Cada criatura sale a tamaño original.
Atlas por criatura con el formato de los monstruos del juego: 10 columnas (reposo 2, caminata 4, ataque 3, golpe 1)
x 4 filas (abajo, izquierda, derecha, arriba). Abajo y arriba usan la vista de frente; izquierda la de perfil y
derecha la misma espejada. Reposo y caminata flotan subiendo y bajando; el ataque se inclina hacia delante.
"""
import base64, io, json, os
import numpy as np
from PIL import Image
from scipy import ndimage

D = os.path.join(os.path.dirname(__file__), 'criaturas_ref')
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
a = np.array(Image.open(os.path.join(D, 'crnat.png')).convert('RGB')).astype(float)
bg = np.median(a[:4].reshape(-1, 3), 0)
KINDS = [('arpia', 0, 49), ('medusa', 50, 85), ('manta', 86, 135), ('centinela', 135, 177), ('chispa', 178, 209), ('sierpe', 208, 269)]
ROWS = [(10, 62), (72, 124)]


def cut(x0, x1, y0, y1):
    sub = a[y0:y1, x0:x1]
    d = np.sqrt(((sub - bg) ** 2).sum(2))
    lab, _ = ndimage.label(d < 24)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    o = np.zeros(sub.shape[:2] + (4,), np.uint8)
    o[..., :3] = sub
    o[..., 3] = np.where(np.isin(lab, list(border)), 0, 255)
    # quitar motas sueltas de otra criatura en los bordes
    lab2, n = ndimage.label(o[..., 3] > 0, structure=np.ones((3, 3)))
    if n > 1:
        sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n + 1))
        for i, s in enumerate(sizes):
            if s < 12:
                o[lab2 == i + 1] = 0
    ys, xs = np.where(o[..., 3] > 0)
    return o[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def main():
    out, sizes = {}, {}
    for k, x0, x1 in KINDS:
        front, side = cut(x0, x1, *ROWS[0]), cut(x0, x1, *ROWS[1])
        fw = max(front.shape[1], side.shape[1]) + 6
        fh = max(front.shape[0], side.shape[0]) + 8
        sheet = Image.new('RGBA', (fw * 10, fh * 4), (0, 0, 0, 0))
        F, Sd = Image.fromarray(front), Image.fromarray(side)
        bobs = [0, 1, 0, 1, 2, 1, -1, -2, 0, 0]       # reposo 2, caminata 4, ataque 3, golpe 1
        lean = [0, 0, 0, 0, 0, 0, 2, 4, 1, -1]
        for row, dirn in enumerate(['down', 'left', 'right', 'up']):
            src = F if dirn in ('down', 'up') else (Sd if dirn == 'left' else Sd.transpose(Image.FLIP_LEFT_RIGHT))
            for col in range(10):
                dx = 0 if dirn in ('down', 'up') else (-lean[col] if dirn == 'left' else lean[col])
                dy = bobs[col] + (lean[col] if dirn == 'down' and col >= 6 else 0)
                x = col * fw + (fw - src.width) // 2 + dx
                y = row * fh + (fh - 3) - src.height + dy - 1
                sheet.alpha_composite(src, (x, y))
        bio = io.BytesIO()
        sheet.save(bio, 'PNG', optimize=True)
        out[k] = 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()
        sizes[k] = [fw, fh]
    path = os.path.join(ROOT, 'src', '6zyn_criaturas_data.js')
    open(path, 'w').write('// Generado por tools/dev/criaturas.py desde el dibujo de Sergio (v4.16). No editar a mano.\n'
                          'const CELX_SIZE = ' + json.dumps(sizes) + ';\nconst CELX_SHEET = ' + json.dumps(out) + ';\n')
    print('escrito', path, os.path.getsize(path), sizes)


if __name__ == '__main__':
    main()
