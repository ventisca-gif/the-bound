"""Ruri, la novena integrante de PRISM9 (v4.86), extraída del dibujo de Sergio (tools/art/ref/prism_novena.png).

Uso:  python3 tools/dev/ruri.py [--debug]   -> escribe src/6zz9zd_ruri_data.js

La hoja trae 2 filas x 4 vistas en pixel art (unos 11,7 px = 1 píxel): de frente, mirando a la izquierda, mirando a la
derecha y de espaldas. Se detecta la cuadrícula, se muestrea el centro de cada celda y se quita el fondo verde por relleno
desde el borde. La fila 1 es el reposo y la fila 2 el paso de la caminata. El beso se hace con las vistas de perfil: ojo
cerrado (pestaña oscura), rubor y la cabeza 1 píxel hacia delante. El abrazo usa el perfil con los brazos adelantados.
Atlas de 10 columnas (reposo 2, caminata 4, beso 2, abrazo 2) x 4 filas (abajo, izquierda, derecha, arriba).
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage

D = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(D, '..', '..'))
P = 11.7


def phase(a):
    g = np.abs(np.diff(a, axis=1)).sum(2).sum(0); h = np.abs(np.diff(a, axis=0)).sum(2).sum(1)
    def ph(s):
        best, bo = -1, 0
        for o in np.linspace(0, P, 40, endpoint=False):
            idx = np.arange(o, len(s), P).astype(int); idx = idx[idx < len(s)]; v = s[idx].sum()
            if v > best: best, bo = v, o
        return bo
    return ph(g), ph(h)


def main():
    a = np.array(Image.open(os.path.join(ROOT, 'tools', 'art', 'ref', 'prism_novena.png')).convert('RGB')).astype(float)
    gx, gy = phase(a)
    ys = np.arange(gy + P / 2, a.shape[0], P).astype(int); xs = np.arange(gx + P / 2, a.shape[1], P).astype(int)
    ys = ys[ys < a.shape[0]]; xs = xs[xs < a.shape[1]]
    s = a[np.ix_(ys, xs)]
    bg = np.median(np.concatenate([s[:2].reshape(-1, 3), s[-2:].reshape(-1, 3)]), 0); d = np.sqrt(((s - bg) ** 2).sum(2))
    lab, _ = ndimage.label(d < 40); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    al = ~np.isin(lab, list(border))
    lab2, n = ndimage.label(al, structure=np.ones((3, 3))); sizes = ndimage.sum(np.ones_like(lab2), lab2, range(1, n + 1))
    keep = [i + 1 for i in np.argsort(sizes)[::-1][:8]]
    figs = []
    for k in keep:
        m = lab2 == k; yy, xx = np.where(m)
        o = np.zeros(s.shape[:2] + (4,), np.uint8); o[..., :3] = s.clip(0, 255); o[..., 3] = m * 255
        figs.append((yy.min(), xx.min(), o[yy.min():yy.max() + 1, xx.min():xx.max() + 1]))
    top = sorted(figs, key=lambda f: f[0]); r1 = sorted(top[:4], key=lambda f: f[1]); r2 = sorted(top[4:], key=lambda f: f[1])
    V1 = {k: f[2] for k, f in zip(['down', 'left', 'right', 'up'], r1)}; V2 = {k: f[2] for k, f in zip(['down', 'left', 'right', 'up'], r2)}

    def kiss(img, dirn):
        k = img.copy(); H, W = k.shape[:2]
        # ojo: píxeles de iris (azul verdoso) en la mitad alta -> piel con pestaña oscura en la fila de abajo
        skin = k[(k[..., 3] > 0) & (k[..., 0] > 200) & (k[..., 1] > 150) & (k[..., 1] < 225)][:, :3]
        sk = np.median(skin, 0) if len(skin) else np.array([240, 200, 180])
        for y in range(int(H * 0.15), int(H * 0.45)):
            for x in range(W):
                r, g, b, al = k[y, x]
                if al and b > 120 and g > 110 and r < 120: k[y, x, :3] = sk
        ey = [y for y in range(int(H * 0.15), int(H * 0.45)) for x in range(W) if (img[y, x, 3] and img[y, x, 2] > 120 and img[y, x, 1] > 110 and img[y, x, 0] < 120)]
        ex = [x for y in range(int(H * 0.15), int(H * 0.45)) for x in range(W) if (img[y, x, 3] and img[y, x, 2] > 120 and img[y, x, 1] > 110 and img[y, x, 0] < 120)]
        if ey:
            yb = max(ey); x0, x1 = min(ex), max(ex)
            for x in range(x0, x1 + 1): k[yb, x, :3] = (40, 30, 60)
            bx = x1 + 1 if dirn == 'right' else x0 - 1
            for x in (bx, bx + (1 if dirn == 'right' else -1)):
                if 0 <= x < W and k[yb + 2, x, 3]: k[yb + 2, x, :3] = (250, 150, 160)
        # cabeza 1 px hacia delante (lo de arriba del 45 %)
        sh = 1 if dirn == 'right' else -1; o = np.zeros_like(k); hy = int(H * 0.45)
        o[hy:] = k[hy:]
        if sh > 0: o[:hy, 1:] = k[:hy, :-1]
        else: o[:hy, :-1] = k[:hy, 1:]
        return o

    def pad(img, fw, fh, dy=0, dx=0):
        c = Image.new('RGBA', (fw, fh), (0, 0, 0, 0)); im = Image.fromarray(img, 'RGBA')
        c.alpha_composite(im, ((fw - im.width) // 2 + dx, fh - 2 - im.height + dy)); return c
    allv = list(V1.values()) + list(V2.values())
    fw = max(v.shape[1] for v in allv) + 6; fh = max(v.shape[0] for v in allv) + 4
    S = Image.new('RGBA', (fw * 10, fh * 4), (0, 0, 0, 0))
    for row, dn in enumerate(['down', 'left', 'right', 'up']):
        side = dn in ('left', 'right'); kd = 'right' if dn == 'right' else 'left'
        cols = [(V1[dn], 0, 0), (V1[dn], -1, 0), (V2[dn], 0, 0), (V1[dn], -1, 0), (V2[dn], 0, 0), (V1[dn], -1, 0),
                (kiss(V1[dn], kd) if side else V1[dn], 0, 0), (kiss(V1[dn], kd) if side else V1[dn], -1, 0),
                (V1[dn], 0, (1 if dn == 'right' else -1) if side else 0), (V2[dn], 0, (1 if dn == 'right' else -1) if side else 0)]
        for col, (img, dy, dx) in enumerate(cols): S.alpha_composite(pad(img, fw, fh, dy, dx), (col * fw, row * fh))
    if '--debug' in sys.argv: S.resize((S.width * 4, S.height * 4), Image.NEAREST).save('/tmp/claude-0/ruri_dbg.png')
    bio = io.BytesIO(); S.save(bio, 'PNG', optimize=True)
    p = os.path.join(ROOT, 'src', '6zz9zd_ruri_data.js')
    open(p, 'w').write('// Generado por tools/dev/ruri.py desde el dibujo de Sergio (v4.86). No editar a mano.\nconst RURI_SIZE = ' + json.dumps([fw, fh]) + ';\nconst RURI_SHEET = ' + json.dumps('data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode()) + ';\n')
    print('escrito', p, 'frame', fw, fh, {k: v.shape[:2] for k, v in V1.items()})


if __name__ == '__main__':
    main()
