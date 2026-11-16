"""Lienya en forma de persona (v4.78), extraída del dibujo de Sergio (tools/dev/lienzo_ref/lienya_persona.png).

Uso:  python3 tools/dev/lienya_p.py [--debug]   -> escribe src/6zz9s2_lienya_p_data.js

La imagen trae dos vistas en pixel art (unos 12 px = 1 píxel): de frente y de perfil mirando a la izquierda. Se detecta la
cuadrícula, se muestrea el centro de cada celda y se quita el fondo por relleno desde el borde. La espalda se hace con la
vista de frente tapando la cara y el cuerpo con el pelo. Atlas de 6 columnas (reposo 2, caminata 4) x 4 filas
(abajo, izquierda, derecha, arriba).
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

D = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(D, '..', '..'))


def phase(a, P):
    g = np.abs(np.diff(a, axis=1)).sum(2).sum(0); h = np.abs(np.diff(a, axis=0)).sum(2).sum(1)
    def ph(s):
        best, bo = -1, 0
        for o in np.linspace(0, P, 32, endpoint=False):
            idx = np.arange(o, len(s), P).astype(int); idx = idx[idx < len(s)]; v = s[idx].sum()
            if v > best: best, bo = v, o
        return bo
    return ph(g), ph(h)


def main():
    a = np.array(Image.open(os.path.join(D, 'lienzo_ref', 'lienya_persona.png')).convert('RGB')).astype(float)
    P = 12.1; gx, gy = phase(a, P)
    ys = np.arange(gy + P / 2, a.shape[0], P).astype(int); xs = np.arange(gx + P / 2, a.shape[1], P).astype(int)
    ys = ys[ys < a.shape[0]]; xs = xs[xs < a.shape[1]]
    s = a[np.ix_(ys, xs)]
    bg = np.median(s[:2].reshape(-1, 3), 0); d = np.sqrt(((s - bg) ** 2).sum(2))
    lab, _ = ndimage.label(d < 22); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    al = ~np.isin(lab, list(border))
    lab2, n = ndimage.label(al, structure=np.ones((3, 3))); sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n + 1))
    keep = [i + 1 for i in np.argsort(sizes)[::-1][:2]]
    figs = []
    for k in keep:
        m = lab2 == k; yy, xx = np.where(m)
        o = np.zeros(s.shape[:2] + (4,), np.uint8); o[..., :3] = s.clip(0, 255); o[..., 3] = m * 255
        figs.append((xx.min(), o[yy.min():yy.max() + 1, xx.min():xx.max() + 1]))
    figs.sort(key=lambda f: f[0]); front, side = figs[0][1], figs[1][1]
    # espalda: la cara y el cuerpo (píxeles oscuros del centro) pasan a pelo
    back = front.copy(); H, W = back.shape[:2]
    hair = back[(back[..., 3] > 0) & (back[..., :3].mean(2) > 150)][:, :3]
    L3, L2_, L1 = np.percentile(hair, 85, axis=0), np.percentile(hair, 55, axis=0), np.percentile(hair, 25, axis=0)
    for y in range(H - 3):
        for x in range(W):
            if back[y, x, 3] and abs(x - W / 2) < W * 0.32 and (back[y, x, :3].mean() < 120 or (0.25 < y / H < 0.6 and abs(x - W / 2) < W * 0.22)):
                k = y / H; c = L1 if (x + (y // 6)) % 4 == 0 else (L3 if k < 0.35 else L2_)
                back[y, x, :3] = c.astype(np.uint8)
    imgs = {'down': Image.fromarray(front, 'RGBA'), 'left': Image.fromarray(side, 'RGBA'), 'up': Image.fromarray(back, 'RGBA')}
    imgs['right'] = imgs['left'].transpose(Image.FLIP_LEFT_RIGHT)
    fw = max(i.width for i in imgs.values()) + 4; fh = max(i.height for i in imgs.values()) + 4
    S = Image.new('RGBA', (fw * 6, fh * 4), (0, 0, 0, 0)); bob = [0, -1, 0, -1, 0, -1]
    for row, dn in enumerate(['down', 'left', 'right', 'up']):
        im = imgs[dn]
        for col in range(6): S.alpha_composite(im, (col * fw + (fw - im.width) // 2, row * fh + (fh - 2) - im.height + bob[col] + 1))
    if '--debug' in sys.argv: S.resize((S.width * 3, S.height * 3), Image.NEAREST).save('/tmp/lienya_p.png')
    bio = io.BytesIO(); S.save(bio, 'PNG', optimize=True)
    p = os.path.join(ROOT, 'src', '6zz9s2_lienya_p_data.js')
    open(p, 'w').write('// Generado por tools/dev/lienya_p.py desde el dibujo de Sergio (v4.78). No editar a mano.\nconst LNY_P2SIZE = ' + json.dumps([fw, fh]) + ';\nconst LNY_P2SHEET = ' + json.dumps('data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()) + ';\n')
    print('escrito', p, 'frame', fw, fh, 'front', front.shape[:2], 'side', side.shape[:2])


if __name__ == '__main__':
    main()
